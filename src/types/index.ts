export type MeasurementCategory =
  | "length"
  | "mass"
  | "area"
  | "volume"
  | "temperature"
  | "data"
  | "time";

export type UnitLocale = "en" | "bn" | "en-US" | "bn-BD";

export type UnitDigitStyle = "auto" | "latin" | "native";

export type RoundingMode = "half-up" | "floor" | "ceil" | "trunc" | "expand";

export type UnitId =
  | "mm"
  | "cm"
  | "m"
  | "km"
  | "in"
  | "ft"
  | "yd"
  | "mi"
  | "mg"
  | "g"
  | "kg"
  | "tonne"
  | "oz"
  | "lb"
  | "seer"
  | "mon"
  | "sq_m"
  | "sq_km"
  | "sq_ft"
  | "acre"
  | "hectare"
  | "katha"
  | "bigha"
  | "ml"
  | "l"
  | "cu_m"
  | "tsp"
  | "tbsp"
  | "cup"
  | "pt"
  | "qt"
  | "gal"
  | "c"
  | "f"
  | "k"
  | "b"
  | "kb"
  | "mb"
  | "gb"
  | "tb"
  | "kib"
  | "mib"
  | "gib"
  | "tib"
  | "ms"
  | "s"
  | "min"
  | "h"
  | "day"
  | "week";

export interface UnitDefinition {
  id: UnitId;
  category: MeasurementCategory;
  label: string;
  symbol: string;
  aliases: readonly string[];
  labelBn?: string;
  symbolBn?: string;
  aliasesBn?: readonly string[];
  toBaseFactor?: number;
  fromBase?: (value: number) => number;
  toBase?: (value: number) => number;
}

export interface ConvertOptions {
  precision?: number;
  roundingMode?: RoundingMode;
}

export type ConversionStatus = "exact" | "rounded" | "approx";

export interface DetailedConvertOptions extends ConvertOptions {
  profile?: string;
}

export interface ConversionWarning {
  code: string;
  message: string;
}

export interface DetailedConversion {
  value: number;
  rawValue: number;
  from: UnitId;
  to: UnitId;
  category: MeasurementCategory;
  baseValue: number;
  fromFactor?: number;
  toFactor?: number;
  precision?: number;
  roundingMode?: RoundingMode;
  status: ConversionStatus;
  warnings: ConversionWarning[];
}

export interface FormatMeasurementOptions extends ConvertOptions {
  locale?: UnitLocale | string;
  digitStyle?: UnitDigitStyle;
  unitDisplay?: "symbol" | "label" | "id";
  localizeUnits?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export interface ParseMeasurementOptions {
  maxDecimalPlaces?: number;
  allowBanglaDigits?: boolean;
  category?: MeasurementCategory;
  min?: number;
  max?: number;
  allowedUnits?: readonly string[];
}

export interface ParsedMeasurement {
  value: number;
  unit: UnitId;
  rawUnit: string;
  decimalPlaces: number;
}

export interface MixedMeasurement {
  terms: ParsedMeasurement[];
  category: MeasurementCategory;
  raw: string;
}

export interface BestUnitOptions extends ConvertOptions {
  candidates?: readonly string[];
  min?: number;
  max?: number;
}

export interface BestUnitResult {
  value: number;
  unit: UnitId;
  formatted: string;
}

export interface MeasurementIssue {
  code: string;
  message: string;
  path?: string;
}

export interface MeasurementValidationResult {
  success: boolean;
  data?: ParsedMeasurement;
  issues: MeasurementIssue[];
}

export interface MeasurementSchemaOptions extends ParseMeasurementOptions {
  required?: boolean;
}

export interface MeasurementSchema {
  parse(input: string): ParsedMeasurement;
  validate(input: string): MeasurementValidationResult;
}

export interface UnitSuggestion {
  unit: UnitId;
  input: string;
  reason: "alias-distance";
  score: number;
}
