import { performance } from "node:perf_hooks";
import {
  convert,
  convertMany,
  countDecimalPlaces,
  getUnit,
  listUnits,
  normalizeBanglaDigits,
  parseMixedMeasurement,
  resolveUnit,
  suggestUnit
} from "../src";

type BenchTask = {
  name: string;
  before: () => unknown;
  after: () => unknown;
};

type BenchResult = {
  label: string;
  opsPerSecond: number;
  meanMs: number;
};

type BenchAggregate = {
  label: string;
  medianOpsPerSecond: number;
  medianMeanMs: number;
  p95MeanMs: number;
  minMeanMs: number;
  maxMeanMs: number;
  samples: BenchResult[];
};

type OutputMode = "text" | "json" | "csv";

type BenchConfig = {
  outputMode: OutputMode;
  repeats: number;
  warmupMs: number;
  sampleMs: number;
};

type TaskSummary = {
  name: string;
  before: BenchAggregate;
  after: BenchAggregate;
  speedupMedian: number;
  speedupP95: number;
};

const MIXED_PATTERN =
  /([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)\s*([^\d\s+-][^\d+-]*?)(?=\s*[+-]?(?:\d|$))/gi;

const suggestInput = "kilogrm";
const convertManyUnits = ["g", "lb", "oz", "tonne", "seer", "mon"];
const mixedInput = "5 ft 7 in 3 cm";
const config = parseConfig(process.argv.slice(2));

const tasks: BenchTask[] = [
  {
    name: "suggestUnit",
    before: () => baselineSuggestUnit(suggestInput),
    after: () => suggestUnit(suggestInput)
  },
  {
    name: "convertMany",
    before: () => baselineConvertMany(123.456, "kg", convertManyUnits, 3),
    after: () => convertMany(123.456, "kg", convertManyUnits, { precision: 3 })
  },
  {
    name: "parseMixedMeasurement",
    before: () => baselineParseMixedMeasurement(mixedInput),
    after: () => parseMixedMeasurement(mixedInput)
  }
];

const summaries = tasks.map((task) => {
  const before = runBenchSet(`${task.name} before`, task.before, config);
  const after = runBenchSet(`${task.name} after`, task.after, config);

  return {
    name: task.name,
    before,
    after,
    speedupMedian: before.medianMeanMs / after.medianMeanMs,
    speedupP95: before.p95MeanMs / after.p95MeanMs
  } satisfies TaskSummary;
});

printOutput(summaries, config);

function parseConfig(args: string[]): BenchConfig {
  return {
    outputMode: getOutputMode(args),
    repeats: getNumberArg(args, "--repeats", 7),
    warmupMs: getNumberArg(args, "--warmup-ms", 250),
    sampleMs: getNumberArg(args, "--sample-ms", 900)
  };
}

function getOutputMode(args: string[]): OutputMode {
  if (args.includes("--json")) return "json";
  if (args.includes("--csv")) return "csv";
  return "text";
}

function getNumberArg(args: string[], flag: string, fallback: number): number {
  const index = args.indexOf(flag);

  if (index === -1) return fallback;

  const value = Number(args[index + 1]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function printOutput(summaries: TaskSummary[], benchConfig: BenchConfig): void {
  if (benchConfig.outputMode === "json") {
    console.log(JSON.stringify({ config: benchConfig, summaries }, null, 2));
    return;
  }

  if (benchConfig.outputMode === "csv") {
    console.log(
      [
        "name,before_median_ops_per_second,before_median_mean_ms,before_p95_mean_ms,after_median_ops_per_second,after_median_mean_ms,after_p95_mean_ms,speedup_median_ratio,speedup_p95_ratio"
      ]
        .concat(
          summaries.map((summary) =>
            [
              summary.name,
              summary.before.medianOpsPerSecond.toFixed(6),
              summary.before.medianMeanMs.toFixed(9),
              summary.before.p95MeanMs.toFixed(9),
              summary.after.medianOpsPerSecond.toFixed(6),
              summary.after.medianMeanMs.toFixed(9),
              summary.after.p95MeanMs.toFixed(9),
              summary.speedupMedian.toFixed(6),
              summary.speedupP95.toFixed(6)
            ].join(",")
          )
        )
        .join("\n")
    );
    return;
  }

  console.log(
    `config  repeats=${benchConfig.repeats} warmupMs=${benchConfig.warmupMs} sampleMs=${benchConfig.sampleMs}`
  );

  for (const summary of summaries) {
    printResult(summary);
  }
}

function printResult(summary: TaskSummary): void {
  const medianText =
    summary.speedupMedian >= 1
      ? `${summary.speedupMedian.toFixed(2)}x faster`
      : `${(1 / summary.speedupMedian).toFixed(2)}x slower`;
  const p95Text =
    summary.speedupP95 >= 1
      ? `${summary.speedupP95.toFixed(2)}x faster`
      : `${(1 / summary.speedupP95).toFixed(2)}x slower`;

  console.log(`\n${summary.name}`);
  console.log(
    `  before  median ${summary.before.medianOpsPerSecond.toFixed(0).padStart(10)} ops/s  ${summary.before.medianMeanMs.toFixed(6)} ms/op  p95 ${summary.before.p95MeanMs.toFixed(6)}`
  );
  console.log(
    `  after   median ${summary.after.medianOpsPerSecond.toFixed(0).padStart(10)} ops/s  ${summary.after.medianMeanMs.toFixed(6)} ms/op  p95 ${summary.after.p95MeanMs.toFixed(6)}`
  );
  console.log(`  delta   median ${medianText}  p95 ${p95Text}`);
}

function runBenchSet(
  label: string,
  fn: () => unknown,
  benchConfig: BenchConfig
): BenchAggregate {
  const samples: BenchResult[] = [];

  for (let i = 0; i < benchConfig.repeats; i += 1) {
    samples.push(runBench(label, fn, benchConfig));
  }

  const meanValues = samples
    .map((sample) => sample.meanMs)
    .sort((a, b) => a - b);
  const opsValues = samples
    .map((sample) => sample.opsPerSecond)
    .sort((a, b) => a - b);

  return {
    label,
    medianOpsPerSecond: percentile(opsValues, 0.5),
    medianMeanMs: percentile(meanValues, 0.5),
    p95MeanMs: percentile(meanValues, 0.95),
    minMeanMs: meanValues[0] ?? 0,
    maxMeanMs: meanValues[meanValues.length - 1] ?? 0,
    samples
  };
}

function runBench(
  label: string,
  fn: () => unknown,
  benchConfig: BenchConfig
): BenchResult {
  consume(label, fn, benchConfig.warmupMs);
  const iterations = consume(label, fn, benchConfig.sampleMs);
  const meanMs = benchConfig.sampleMs / iterations;

  return {
    label,
    opsPerSecond: (iterations / benchConfig.sampleMs) * 1000,
    meanMs
  };
}

function percentile(values: number[], ratio: number): number {
  if (values.length === 0) return 0;

  const position = (values.length - 1) * ratio;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);

  if (lower === upper) {
    return values[lower] ?? 0;
  }

  const lowerValue = values[lower] ?? 0;
  const upperValue = values[upper] ?? lowerValue;
  const weight = position - lower;

  return lowerValue + (upperValue - lowerValue) * weight;
}

function consume(label: string, fn: () => unknown, durationMs: number): number {
  const deadline = performance.now() + durationMs;
  let iterations = 0;

  while (performance.now() < deadline) {
    const result = fn();

    if (iterations === -1 && result === label) {
      throw new Error("unreachable");
    }

    iterations += 1;
  }

  return Math.max(iterations, 1);
}

function baselineConvertMany(
  value: number,
  from: string,
  units: readonly string[],
  precision: number
): Record<string, number> {
  return Object.fromEntries(
    units.map((unit) => [unit, convert(value, from, unit, { precision })])
  );
}

function baselineParseMixedMeasurement(input: string) {
  const normalizedInput = normalizeBanglaDigits(input);
  const terms: Array<{
    value: number;
    unit: string;
    rawUnit: string;
    decimalPlaces: number;
  }> = [];
  let match: RegExpExecArray | null;

  while ((match = MIXED_PATTERN.exec(normalizedInput))) {
    const valueText = match[1];
    const rawUnit = match[2]?.trim();

    if (!valueText || !rawUnit) continue;

    terms.push({
      value: Number(valueText),
      unit: resolveUnit(rawUnit),
      rawUnit,
      decimalPlaces: countDecimalPlaces(valueText)
    });
  }

  if (terms.length === 0) {
    throw new Error("invalid");
  }

  const category = getUnit(terms[0]!.unit).category;

  for (const term of terms) {
    if (getUnit(term.unit).category !== category) {
      throw new Error("mixed-category");
    }
  }

  return {
    terms,
    category,
    raw: input
  };
}

function baselineSuggestUnit(input: string) {
  const normalized = normalizeUnitKey(normalizeBanglaDigits(input));
  const candidates: Array<{
    unit: string;
    input: string;
    reason: "alias-distance";
    score: number;
  }> = [];

  for (const unit of listUnits()) {
    const labels = [
      unit.id,
      unit.symbol,
      unit.label,
      ...(unit.aliases ?? []),
      unit.labelBn,
      unit.symbolBn,
      ...(unit.aliasesBn ?? [])
    ].filter((item): item is string => typeof item === "string");

    const score = Math.max(
      ...labels.map((label) => similarity(normalized, normalizeUnitKey(label)))
    );

    if (score >= 0.5) {
      candidates.push({
        unit: unit.id,
        input,
        reason: "alias-distance",
        score
      });
    }
  }

  return candidates
    .sort((a, b) => b.score - a.score || a.unit.localeCompare(b.unit))
    .slice(0, 5);
}

function normalizeUnitKey(unit: string): string {
  return unit.trim().toLowerCase().replace(/\s+/g, "-").replace(/²/g, "2");
}

function similarity(a: string, b: string): number {
  const maxLength = Math.max(a.length, b.length);

  if (maxLength === 0) return 1;

  return 1 - levenshtein(a, b) / maxLength;
}

function levenshtein(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1]! + 1,
        previous[j]! + 1,
        previous[j - 1]! + cost
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length]!;
}
