import { InvalidMeasurementError } from "./errors";
import { normalizeBanglaDigits } from "./locale";
import { getUnit, resolveUnit } from "./units";
import type { ParseMeasurementOptions, ParsedMeasurement } from "../types";

const MEASUREMENT_PATTERN =
  /^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)\s*([^\d\s].*?)\s*$/i;

function categoryLabel(
  category: NonNullable<ParseMeasurementOptions["category"]>
): string {
  return category.replace(/_/g, " ");
}

export function parseMeasurement(
  input: string,
  options: ParseMeasurementOptions = {}
): ParsedMeasurement {
  const normalizedInput =
    options.allowBanglaDigits === false ? input : normalizeBanglaDigits(input);
  const match = MEASUREMENT_PATTERN.exec(normalizedInput);

  if (!match?.[1] || !match[2]) {
    throw new InvalidMeasurementError(
      `Could not read "${input}" as measurement. Use format like "12.5 kg" or "5 ft".`
    );
  }

  const value = Number(match[1]);
  const decimalPlaces = countDecimalPlaces(match[1]);

  if (!Number.isFinite(value)) {
    throw new InvalidMeasurementError(
      `Value "${match[1]}" is not valid number. Use numeric value like "12", "12.5", or "1e3".`
    );
  }

  if (
    options.maxDecimalPlaces !== undefined &&
    decimalPlaces > options.maxDecimalPlaces
  ) {
    throw new InvalidMeasurementError(
      `Too many decimal places in "${input}". Use at most ${options.maxDecimalPlaces} decimal places.`
    );
  }

  const unit = resolveUnit(match[2]);
  const definition = getUnit(unit);

  if (options.category && definition.category !== options.category) {
    throw new InvalidMeasurementError(
      `Unit "${match[2].trim()}" is not ${categoryLabel(options.category)} unit. Use ${categoryLabel(options.category)} unit instead.`
    );
  }

  if (options.allowedUnits) {
    const allowed = new Set(
      options.allowedUnits.map((item) => resolveUnit(item))
    );
    if (!allowed.has(unit)) {
      throw new InvalidMeasurementError(
        `Unit "${match[2].trim()}" is not allowed here. Allowed units: ${[...allowed].join(", ")}.`
      );
    }
  }

  if (options.min !== undefined && value < options.min) {
    throw new InvalidMeasurementError(
      `Value must be at least ${options.min}. Received ${value}.`
    );
  }

  if (options.max !== undefined && value > options.max) {
    throw new InvalidMeasurementError(
      `Value must be at most ${options.max}. Received ${value}.`
    );
  }

  return {
    value,
    unit,
    rawUnit: match[2].trim(),
    decimalPlaces
  };
}

export function countDecimalPlaces(value: string): number {
  const [base] = value.toLowerCase().split("e");
  const decimal = base?.split(".")[1];
  return decimal?.length ?? 0;
}
