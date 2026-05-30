import { applyPrecision, convert } from "./convert";
import { InvalidMeasurementError } from "./errors";
import { normalizeBanglaDigits } from "./locale";
import { countDecimalPlaces } from "./parse";
import { getUnit, resolveUnit } from "./units";
import type {
  ConvertOptions,
  MixedMeasurement,
  ParsedMeasurement
} from "../types";

const MIXED_TERM_PATTERN =
  /([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)\s*([^\d\s+-][^\d+-]*?)(?=\s*[+-]?(?:\d|$))/gi;

function invalidMixedMeasurement(input: string): InvalidMeasurementError {
  return new InvalidMeasurementError(
    `Could not read "${input}" as mixed measurement. Use format like "5 ft 7 in" or "1 kg 250 g".`
  );
}

export function parseMixedMeasurement(input: string): MixedMeasurement {
  const normalizedInput = normalizeBanglaDigits(input);
  const terms: ParsedMeasurement[] = [];
  let match: RegExpExecArray | null;
  let cursor = 0;
  let category: MixedMeasurement["category"] | undefined;

  while ((match = MIXED_TERM_PATTERN.exec(normalizedInput))) {
    if (normalizedInput.slice(cursor, match.index).trim() !== "") {
      throw invalidMixedMeasurement(input);
    }

    const valueText = match[1];
    const rawUnit = match[2]?.trim();

    if (!valueText || !rawUnit) continue;

    const value = Number(valueText);
    if (!Number.isFinite(value)) {
      throw new InvalidMeasurementError(
        `Value "${valueText}" is not valid number in "${input}".`
      );
    }

    let unit: ParsedMeasurement["unit"];

    try {
      unit = resolveUnit(rawUnit);
    } catch {
      throw invalidMixedMeasurement(input);
    }

    const definition = getUnit(unit);

    if (definition.category === "temperature") {
      throw new InvalidMeasurementError(
        "Mixed measurements do not support temperature units. Use single temperature value like \"32 F\"."
      );
    }

    if (category && definition.category !== category) {
      throw new InvalidMeasurementError(
        `Mixed measurement "${input}" uses different unit categories. Keep all parts in same category.`
      );
    }

    category = category ?? definition.category;

    terms.push({
      value,
      unit,
      rawUnit,
      decimalPlaces: countDecimalPlaces(valueText)
    });

    cursor = MIXED_TERM_PATTERN.lastIndex;
  }

  if (terms.length === 0) {
    throw invalidMixedMeasurement(input);
  }

  if (normalizedInput.slice(cursor).trim() !== "") {
    throw invalidMixedMeasurement(input);
  }

  return {
    terms,
    category: category!,
    raw: input
  };
}

export function normalizeMixedMeasurement(
  input: string,
  to: string,
  options: ConvertOptions = {}
): number {
  const mixed = parseMixedMeasurement(input);
  const target = getUnit(to);

  if (target.category !== mixed.category) {
    throw new InvalidMeasurementError(
      `Target unit "${to}" must be ${mixed.category} unit to match "${input}".`
    );
  }

  const total = mixed.terms.reduce(
    (sum, term) => sum + convert(term.value, term.unit, target.id),
    0
  );

  return applyPrecision(total, options);
}
