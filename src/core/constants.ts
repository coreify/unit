import type { UnitDefinition } from "../types";

export const UNITS = [
  {
    id: "mm",
    category: "length",
    label: "millimeter",
    symbol: "mm",
    aliases: ["millimeter", "millimeters"]
  },
  {
    id: "cm",
    category: "length",
    label: "centimeter",
    symbol: "cm",
    aliases: ["centimeter", "centimeters"]
  },
  {
    id: "m",
    category: "length",
    label: "meter",
    symbol: "m",
    aliases: ["meter", "meters", "metre", "metres"]
  },
  {
    id: "km",
    category: "length",
    label: "kilometer",
    symbol: "km",
    aliases: ["kilometer", "kilometers", "kilometre", "kilometres"]
  },
  {
    id: "in",
    category: "length",
    label: "inch",
    symbol: "in",
    aliases: ["inch", "inches"]
  },
  {
    id: "ft",
    category: "length",
    label: "foot",
    symbol: "ft",
    aliases: ["foot", "feet"]
  },
  {
    id: "yd",
    category: "length",
    label: "yard",
    symbol: "yd",
    aliases: ["yard", "yards"]
  },
  {
    id: "mi",
    category: "length",
    label: "mile",
    symbol: "mi",
    aliases: ["mile", "miles"]
  },
  {
    id: "mg",
    category: "mass",
    label: "milligram",
    symbol: "mg",
    aliases: ["milligram", "milligrams"]
  },
  {
    id: "g",
    category: "mass",
    label: "gram",
    symbol: "g",
    aliases: ["gram", "grams"]
  },
  {
    id: "kg",
    category: "mass",
    label: "kilogram",
    symbol: "kg",
    aliases: ["kilogram", "kilograms", "kilo", "kilos"]
  },
  {
    id: "tonne",
    category: "mass",
    label: "tonne",
    symbol: "t",
    aliases: ["tonne", "tonnes", "metric-ton", "metric-tonne"]
  },
  {
    id: "oz",
    category: "mass",
    label: "ounce",
    symbol: "oz",
    aliases: ["ounce", "ounces"]
  },
  {
    id: "lb",
    category: "mass",
    label: "pound",
    symbol: "lb",
    aliases: ["pound", "pounds", "lbs"]
  },
  {
    id: "seer",
    category: "mass",
    label: "seer",
    symbol: "seer",
    aliases: ["ser"]
  },
  {
    id: "mon",
    category: "mass",
    label: "mon",
    symbol: "mon",
    aliases: ["maund", "mound"]
  },
  {
    id: "sq_m",
    category: "area",
    label: "square meter",
    symbol: "m2",
    aliases: ["sqm", "square-meter", "square-meters", "m2"]
  },
  {
    id: "sq_km",
    category: "area",
    label: "square kilometer",
    symbol: "km2",
    aliases: ["sqkm", "square-kilometer", "square-kilometers", "km2"]
  },
  {
    id: "sq_ft",
    category: "area",
    label: "square foot",
    symbol: "ft2",
    aliases: ["sqft", "square-foot", "square-feet", "ft2"]
  },
  {
    id: "acre",
    category: "area",
    label: "acre",
    symbol: "acre",
    aliases: ["acres"]
  },
  {
    id: "hectare",
    category: "area",
    label: "hectare",
    symbol: "ha",
    aliases: ["ha", "hectares"]
  },
  {
    id: "katha",
    category: "area",
    label: "katha",
    symbol: "katha",
    aliases: ["kattha"]
  },
  {
    id: "bigha",
    category: "area",
    label: "bigha",
    symbol: "bigha",
    aliases: ["bighas"]
  },
  {
    id: "ml",
    category: "volume",
    label: "milliliter",
    symbol: "ml",
    aliases: ["milliliter", "milliliters", "millilitre", "millilitres"]
  },
  {
    id: "l",
    category: "volume",
    label: "liter",
    symbol: "l",
    aliases: ["liter", "liters", "litre", "litres"]
  },
  {
    id: "cu_m",
    category: "volume",
    label: "cubic meter",
    symbol: "m3",
    aliases: ["cubic-meter", "cubic-meters", "m3"]
  },
  {
    id: "tsp",
    category: "volume",
    label: "teaspoon",
    symbol: "tsp",
    aliases: ["teaspoon", "teaspoons"]
  },
  {
    id: "tbsp",
    category: "volume",
    label: "tablespoon",
    symbol: "tbsp",
    aliases: ["tablespoon", "tablespoons"]
  },
  {
    id: "cup",
    category: "volume",
    label: "cup",
    symbol: "cup",
    aliases: ["cups"]
  },
  {
    id: "pt",
    category: "volume",
    label: "pint",
    symbol: "pt",
    aliases: ["pint", "pints"]
  },
  {
    id: "qt",
    category: "volume",
    label: "quart",
    symbol: "qt",
    aliases: ["quart", "quarts"]
  },
  {
    id: "gal",
    category: "volume",
    label: "gallon",
    symbol: "gal",
    aliases: ["gallon", "gallons"]
  },
  {
    id: "c",
    category: "temperature",
    label: "celsius",
    symbol: "C",
    aliases: ["celsius", "centigrade"]
  },
  {
    id: "f",
    category: "temperature",
    label: "fahrenheit",
    symbol: "F",
    aliases: ["fahrenheit"]
  },
  {
    id: "k",
    category: "temperature",
    label: "kelvin",
    symbol: "K",
    aliases: ["kelvin"]
  },
  {
    id: "b",
    category: "data",
    label: "byte",
    symbol: "B",
    aliases: ["byte", "bytes"]
  },
  {
    id: "kb",
    category: "data",
    label: "kilobyte",
    symbol: "KB",
    aliases: ["kilobyte", "kilobytes"]
  },
  {
    id: "mb",
    category: "data",
    label: "megabyte",
    symbol: "MB",
    aliases: ["megabyte", "megabytes"]
  },
  {
    id: "gb",
    category: "data",
    label: "gigabyte",
    symbol: "GB",
    aliases: ["gigabyte", "gigabytes"]
  },
  {
    id: "tb",
    category: "data",
    label: "terabyte",
    symbol: "TB",
    aliases: ["terabyte", "terabytes"]
  },
  {
    id: "kib",
    category: "data",
    label: "kibibyte",
    symbol: "KiB",
    aliases: ["kibibyte", "kibibytes"]
  },
  {
    id: "mib",
    category: "data",
    label: "mebibyte",
    symbol: "MiB",
    aliases: ["mebibyte", "mebibytes"]
  },
  {
    id: "gib",
    category: "data",
    label: "gibibyte",
    symbol: "GiB",
    aliases: ["gibibyte", "gibibytes"]
  },
  {
    id: "tib",
    category: "data",
    label: "tebibyte",
    symbol: "TiB",
    aliases: ["tebibyte", "tebibytes"]
  },
  {
    id: "ms",
    category: "time",
    label: "millisecond",
    symbol: "ms",
    aliases: ["millisecond", "milliseconds"]
  },
  {
    id: "s",
    category: "time",
    label: "second",
    symbol: "s",
    aliases: ["second", "seconds", "sec", "secs"]
  },
  {
    id: "min",
    category: "time",
    label: "minute",
    symbol: "min",
    aliases: ["minute", "minutes"]
  },
  {
    id: "h",
    category: "time",
    label: "hour",
    symbol: "h",
    aliases: ["hour", "hours", "hr", "hrs"]
  },
  {
    id: "day",
    category: "time",
    label: "day",
    symbol: "d",
    aliases: ["days", "d"]
  },
  {
    id: "week",
    category: "time",
    label: "week",
    symbol: "wk",
    aliases: ["weeks", "wk", "wks"]
  }
] as const satisfies readonly Omit<UnitDefinition, "toBaseFactor">[];

export const UNIT_FACTORS = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  tonne: 1000,
  oz: 0.028349523125,
  lb: 0.45359237,
  seer: 0.933105,
  mon: 37.3242,
  sq_m: 1,
  sq_km: 1_000_000,
  sq_ft: 0.09290304,
  acre: 4046.8564224,
  hectare: 10000,
  katha: 66.8902995202,
  bigha: 1337.805990404,
  ml: 0.001,
  l: 1,
  cu_m: 1000,
  tsp: 0.00492892159375,
  tbsp: 0.01478676478125,
  cup: 0.2365882365,
  pt: 0.473176473,
  qt: 0.946352946,
  gal: 3.785411784,
  b: 1,
  kb: 1000,
  mb: 1_000_000,
  gb: 1_000_000_000,
  tb: 1_000_000_000_000,
  kib: 1024,
  mib: 1_048_576,
  gib: 1_073_741_824,
  tib: 1_099_511_627_776,
  ms: 1,
  s: 1000,
  min: 60_000,
  h: 3_600_000,
  day: 86_400_000,
  week: 604_800_000
} as const;
