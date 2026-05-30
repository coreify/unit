# @coreify/unit

[![npm version](https://img.shields.io/npm/v/%40coreify%2Funit.svg?style=flat-square)](https://www.npmjs.com/package/@coreify/unit)
[![npm downloads](https://img.shields.io/npm/dm/%40coreify%2Funit.svg?style=flat-square)](https://www.npmjs.com/package/@coreify/unit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat-square)](https://www.typescriptlang.org/)

**Type-safe measurement conversion for JavaScript, TypeScript, Node.js, browsers, apps.**

*"Convert with precision, format with confidence."*

---

## Features

- **Multi-Category Conversion** - Length, mass, area, volume, temperature, data, time
- **TypeScript First** - Strong types for units, options, results
- **Localized Parsing + Formatting** - Bangla digits, Bangla unit labels, native digit output
- **Mixed Measurement Support** - Normalize inputs like `5 ft 7 in` or `1 kg 250 g`
- **Zero Runtime Dependencies** - Small, portable, tree-shake friendly
- **Actionable Errors** - User-facing validation + conversion errors

---

## Installation

```bash
npm install @coreify/unit
# or
yarn add @coreify/unit
# or
bun add @coreify/unit
```

---

## Quick Start

```ts
import {
  bestUnit,
  convert,
  convertDetailed,
  formatMeasurement,
  normalizeMixedMeasurement,
  parseMeasurement,
  suggestUnit
} from "@coreify/unit";

convert(1, "km", "m"); // 1000
convert(32, "f", "c"); // 0
convert(1, "seer", "kg"); // 0.933105

formatMeasurement(2.5, "kg"); // "2.5 kg"
formatMeasurement(2.5, "kg", { locale: "bn-BD" }); // "২.৫ kg"
formatMeasurement(2.5, "kg", {
  locale: "bn-BD",
  unitDisplay: "label",
  localizeUnits: true
}); // "২.৫ কিলোগ্রাম"

parseMeasurement("১২.৫০ কেজি");
// { value: 12.5, unit: "kg", rawUnit: "কেজি", decimalPlaces: 2 }

normalizeMixedMeasurement("5 ft 7 in", "in"); // 67
bestUnit(1532, "m", { precision: 3 });
// { value: 1.532, unit: "km", formatted: "1.532 km" }

suggestUnit("kilogrm")[0]?.unit; // "kg"
convertDetailed(1, "bigha", "sq_ft").warnings; // regional warning
```

---

## Core API

### Convert Values

```ts
import { convert, convertMany, convertDetailed } from "@coreify/unit";

convert(5280, "ft", "mi"); // 1
convert(1, "m", "ft", { precision: 2, roundingMode: "ceil" }); // 3.29

convertMany(1, "kg", ["g", "lb"], { precision: 3 });
// { g: 1000, lb: 2.205 }

convertDetailed(1, "acre", "sq_ft");
// {
//   value: 43560,
//   rawValue: 43560,
//   from: "acre",
//   to: "sq_ft",
//   category: "area",
//   baseValue: 4046.8564224,
//   status: "exact",
//   warnings: []
// }
```

### Parse + Normalize Input

```ts
import {
  normalizeMixedMeasurement,
  parseMeasurement,
  createMeasurementSchema
} from "@coreify/unit";

parseMeasurement("5.5 liters");
// { value: 5.5, unit: "l", rawUnit: "liters", decimalPlaces: 1 }

parseMeasurement("১২.৫০ কেজি", { maxDecimalPlaces: 2 });
// { value: 12.5, unit: "kg", rawUnit: "কেজি", decimalPlaces: 2 }

normalizeMixedMeasurement("২ মি ৩০ সেমি", "cm"); // 230

const schema = createMeasurementSchema({
  category: "mass",
  allowedUnits: ["g", "kg"],
  maxDecimalPlaces: 2
});

schema.validate("১২.৫০ কেজি");
```

### Format Output

```ts
import { formatMeasurement } from "@coreify/unit";

formatMeasurement(12.3456, "meter", { maximumFractionDigits: 2 }); // "12.35 m"
formatMeasurement(12, "meter", { unitDisplay: "label" }); // "12 meter"
formatMeasurement(12, "meter", {
  locale: "bn-BD",
  unitDisplay: "label",
  localizeUnits: true
}); // "১২ মিটার"
```

### Smart Helpers

```ts
import { bestUnit, listUnitsByCategory, suggestUnit } from "@coreify/unit";

bestUnit(0.003, "kg"); // { value: 3, unit: "g", formatted: "3 g" }
listUnitsByCategory("area");
suggestUnit("kilogrm");
```

---

## Supported Units

- **Length** - `mm`, `cm`, `m`, `km`, `in`, `ft`, `yd`, `mi`
- **Mass** - `mg`, `g`, `kg`, `tonne`, `oz`, `lb`, `seer`, `mon`
- **Area** - `sq_m`, `sq_km`, `sq_ft`, `acre`, `hectare`, `katha`, `bigha`
- **Volume** - `ml`, `l`, `cu_m`, `tsp`, `tbsp`, `cup`, `pt`, `qt`, `gal`
- **Temperature** - `c`, `f`, `k`
- **Data** - `b`, `kb`, `mb`, `gb`, `tb`, `kib`, `mib`, `gib`, `tib`
- **Time** - `ms`, `s`, `min`, `h`, `day`, `week`

---

## Error Design

Errors aim to be user-facing, explicit, actionable.

```ts
parseMeasurement("banana");
// InvalidMeasurementError:
// Could not read "banana" as measurement. Use format like "12.5 kg" or "5 ft".

convert(1, "kg", "banana");
// UnknownUnitError:
// Unit "banana" is not recognized. Use known unit ids, symbols, or aliases like "kg", "meter", or "sq_ft".
```

---

## Links

- Docs: `https://unit.js.org`
- Package: `https://www.npmjs.com/package/@coreify/unit`
- Issues: `https://github.com/coreify/unit/issues`

---

## License

MIT © Coreify

*"Measure once. Convert everywhere."*
