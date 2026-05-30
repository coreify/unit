import { UNIT_FACTORS } from "./constants";
import { IncompatibleUnitError, InvalidMeasurementError } from "./errors";
import { getUnit } from "./units";
import type {
  ConversionWarning,
  ConvertOptions,
  DetailedConversion,
  UnitDefinition,
  DetailedConvertOptions,
  UnitId
} from "../types";

const REGIONAL_UNITS = new Set<UnitId>(["seer", "mon", "katha", "bigha"]);

export function convert(
  value: number,
  from: string,
  to: string,
  options: ConvertOptions = {}
): number {
  assertFiniteNumber(value, "value");

  const fromUnit = getUnit(from);
  const toUnit = getUnit(to);

  return applyPrecision(
    convertValue(value, fromUnit, toUnit, from, to),
    options
  );
}

export function convertMany(
  value: number,
  from: string,
  units: readonly string[],
  options: ConvertOptions = {}
): Record<string, number> {
  assertFiniteNumber(value, "value");

  const fromUnit = getUnit(from);
  const converted: Record<string, number> = {};

  for (const unit of units) {
    const toUnit = getUnit(unit);
    converted[unit] = applyPrecision(
      convertValue(value, fromUnit, toUnit, from, unit),
      options
    );
  }

  return converted;
}

export function convertDetailed(
  value: number,
  from: string,
  to: string,
  options: DetailedConvertOptions = {}
): DetailedConversion {
  assertFiniteNumber(value, "value");

  const fromUnit = getUnit(from);
  const toUnit = getUnit(to);

  const rawValue = convertValue(value, fromUnit, toUnit, from, to);
  const converted = applyPrecision(rawValue, options);
  const fromFactor = getOptionalFactor(fromUnit);
  const toFactor = getOptionalFactor(toUnit);
  const regionalUnit = REGIONAL_UNITS.has(fromUnit.id) ? fromUnit.id : toUnit.id;
  const baseValue =
    fromUnit.category === "temperature"
      ? toCelsius(value, fromUnit.id)
      : value * (fromFactor ?? 1);
  const warnings: ConversionWarning[] = [];

  if (options.profile) {
    warnings.push({
      code: "profile-unused",
      message: `Profile "${options.profile}" is ignored right now. Conversion uses default rules.`
    });
  }

  if (REGIONAL_UNITS.has(regionalUnit)) {
    warnings.push({
      code: "regional-unit",
      message: `${regionalUnit} can vary by region. Verify local definition before storing or comparing values.`
    });
  }

  const detailed: DetailedConversion = {
    value: converted,
    rawValue,
    from: fromUnit.id,
    to: toUnit.id,
    category: fromUnit.category,
    baseValue,
    status: converted === rawValue ? "exact" : "rounded",
    warnings
  };

  if (fromFactor !== undefined) detailed.fromFactor = fromFactor;
  if (toFactor !== undefined) detailed.toFactor = toFactor;
  if (options.precision !== undefined) detailed.precision = options.precision;
  if (options.roundingMode !== undefined) {
    detailed.roundingMode = options.roundingMode;
  }

  return detailed;
}

function getFactor(unit: UnitDefinition): number {
  const factor = unit.toBaseFactor ?? UNIT_FACTORS[unit.id as keyof typeof UNIT_FACTORS];

  if (typeof factor !== "number") {
    throw new InvalidMeasurementError(
      `Unit "${unit.id}" does not have linear conversion factor. Use compatible linear unit or unit-specific conversion flow.`
    );
  }

  return factor;
}

function convertValue(
  value: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
  from: string,
  to: string
): number {
  if (fromUnit.category !== toUnit.category) {
    throw new IncompatibleUnitError(from, to);
  }

  return fromUnit.category === "temperature"
    ? convertTemperature(value, fromUnit.id, toUnit.id)
    : (value * getFactor(fromUnit)) / getFactor(toUnit);
}

function getOptionalFactor(unit: UnitDefinition): number | undefined {
  return unit.toBaseFactor ?? UNIT_FACTORS[unit.id as keyof typeof UNIT_FACTORS];
}

function convertTemperature(value: number, from: string, to: string): number {
  const celsius = toCelsius(value, from);
  return fromCelsius(celsius, to);
}

function toCelsius(value: number, unit: string): number {
  if (unit === "c") return value;
  if (unit === "f") return (value - 32) * (5 / 9);
  if (unit === "k") return value - 273.15;
  throw new InvalidMeasurementError(
    `Temperature unit "${unit}" is not supported. Use c, f, or k.`
  );
}

function fromCelsius(value: number, unit: string): number {
  if (unit === "c") return value;
  if (unit === "f") return value * (9 / 5) + 32;
  if (unit === "k") return value + 273.15;
  throw new InvalidMeasurementError(
    `Temperature unit "${unit}" is not supported. Use c, f, or k.`
  );
}

export function applyPrecision(value: number, options: ConvertOptions): number {
  if (options.precision === undefined) {
    return value;
  }

  if (
    !Number.isInteger(options.precision) ||
    options.precision < 0 ||
    options.precision > 100
  ) {
    throw new InvalidMeasurementError(
      `Precision must be whole number from 0 to 100. Received ${String(options.precision)}.`
    );
  }

  const factor = 10 ** options.precision;
  const scaled = value * factor;
  const rounded = round(scaled, options.roundingMode ?? "half-up");
  return rounded / factor;
}

function round(
  value: number,
  mode: NonNullable<ConvertOptions["roundingMode"]>
): number {
  if (mode === "floor") return Math.floor(value);
  if (mode === "ceil") return Math.ceil(value);
  if (mode === "trunc") return Math.trunc(value);
  if (mode === "expand")
    return value < 0 ? Math.floor(value) : Math.ceil(value);
  return Math.round(value);
}

function assertFiniteNumber(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new InvalidMeasurementError(
      `${name} must be finite number. Do not pass NaN, Infinity, or -Infinity.`
    );
  }
}
