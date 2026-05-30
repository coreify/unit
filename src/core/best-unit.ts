import { convert } from "./convert";
import { InvalidMeasurementError } from "./errors";
import { formatMeasurement } from "./format";
import { getUnit } from "./units";
import type { BestUnitOptions, BestUnitResult, UnitId } from "../types";

const DEFAULT_CANDIDATES: Record<string, readonly UnitId[]> = {
  length: ["mm", "cm", "m", "km"],
  mass: ["mg", "g", "kg", "tonne"],
  area: ["sq_m", "hectare", "sq_km"],
  volume: ["ml", "l", "cu_m"],
  data: ["b", "kb", "mb", "gb", "tb"],
  time: ["ms", "s", "min", "h", "day", "week"]
};

export function bestUnit(
  value: number,
  unit: string,
  options: BestUnitOptions = {}
): BestUnitResult {
  const source = getUnit(unit);
  const min = options.min ?? 1;
  const max = options.max ?? 1000;
  const candidates =
    options.candidates?.length
      ? options.candidates.map((candidate) => {
          const definition = getUnit(candidate);

          if (definition.category !== source.category) {
            throw new InvalidMeasurementError(
              `bestUnit candidates must stay in ${source.category}: ${candidate}`
            );
          }

          return definition.id;
        })
      : DEFAULT_CANDIDATES[source.category] ?? [source.id];
  let fallback = source.id;
  let fallbackValue = value;

  for (const candidate of candidates) {
    const converted = convert(value, source.id, candidate, options);
    const absolute = Math.abs(converted);

    if (absolute >= min && absolute < max) {
      return {
        value: converted,
        unit: candidate,
        formatted: formatMeasurement(converted, candidate, options)
      };
    }

    if (absolute > 0 && absolute < Math.abs(fallbackValue)) {
      fallback = candidate;
      fallbackValue = converted;
    }
  }

  return {
    value: fallbackValue,
    unit: fallback,
    formatted: formatMeasurement(fallbackValue, fallback, options)
  };
}

export function formatBest(
  value: number,
  unit: string,
  options: BestUnitOptions = {}
): string {
  return bestUnit(value, unit, options).formatted;
}
