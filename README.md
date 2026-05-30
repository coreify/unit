# @coreify/unit

Type-safe measurement conversion for JavaScript, TypeScript, and modern apps.

## Install

```sh
npm install @coreify/unit
```

## Usage

```ts
import {
  bestUnit,
  convert,
  convertDetailed,
  createMeasurementSchema,
  formatMeasurement,
  listUnitsByCategory,
  normalizeMixedMeasurement,
  parseMeasurement,
  suggestUnit
} from "@coreify/unit";

convert(1, "km", "m"); // 1000
convert(1, "seer", "kg"); // 0.933105
convert(32, "f", "c"); // 0

formatMeasurement(2.5, "kg"); // "2.5 kg"
formatMeasurement(2.5, "kg", { locale: "bn-BD" }); // "২.৫ kg"
formatMeasurement(2.5, "kg", { locale: "bn-BD", unitDisplay: "label" }); // "২.৫ kilogram"
formatMeasurement(2.5, "kg", { locale: "bn-BD", unitDisplay: "label", localizeUnits: true }); // "২.৫ কিলোগ্রাম"
parseMeasurement("১২.৫০ কেজি"); // { value: 12.5, unit: "kg", rawUnit: "কেজি", decimalPlaces: 2 }
normalizeMixedMeasurement("5 ft 7 in", "in"); // 67
bestUnit(1532, "m", { precision: 3 }); // { value: 1.532, unit: "km", formatted: "1.532 km" }
convertDetailed(1, "bigha", "sq_ft").warnings; // regional unit warning
listUnitsByCategory("area");
```

## API

### `convert(value, from, to, options?)`

Converts a finite number between compatible units.

```ts
convert(5280, "ft", "mi"); // 1
convert(1, "acre", "sq_ft", { precision: 2 }); // 43560
convert(1, "m", "ft", { precision: 2, roundingMode: "ceil" }); // 3.29
```

### `convertMany(value, from, units, options?)`

Converts one value to multiple target units.

```ts
convertMany(1, "kg", ["g", "lb"], { precision: 3 });
// { g: 1000, lb: 2.205 }
```

### Advanced helpers

```ts
normalizeMixedMeasurement("২ মি ৩০ সেমি", "cm"); // 230
bestUnit(0.003, "kg"); // { value: 3, unit: "g", formatted: "3 g" }
suggestUnit("kilogrm")[0]?.unit; // "kg"

const schema = createMeasurementSchema({
  category: "mass",
  allowedUnits: ["g", "kg"],
  maxDecimalPlaces: 2
});

schema.validate("১২.৫০ কেজি");
```

### Benchmarks

```sh
bun run bench
bun run bench --json
bun run bench --csv
bun run bench --json --repeats 9 --sample-ms 1200
```

### `parseMeasurement(input, options?)`

Parses simple values with units.

```ts
parseMeasurement("5.5 liters");
// { value: 5.5, unit: "l", rawUnit: "liters", decimalPlaces: 1 }

parseMeasurement("১২.৫০ কেজি", { maxDecimalPlaces: 2 });
// { value: 12.5, unit: "kg", rawUnit: "কেজি", decimalPlaces: 2 }
```

### `formatMeasurement(value, unit, options?)`

Formats a number with a unit symbol, label, or id.

```ts
formatMeasurement(12.3456, "meter", { maximumFractionDigits: 2 }); // "12.35 m"
formatMeasurement(12, "meter", { unitDisplay: "label" }); // "12 meter"
formatMeasurement(12, "meter", { locale: "bn-BD", unitDisplay: "label" }); // "১২ meter"
formatMeasurement(12, "meter", { locale: "bn-BD", unitDisplay: "label", localizeUnits: true }); // "১২ মিটার"
```

## Units

- Length: `mm`, `cm`, `m`, `km`, `in`, `ft`, `yd`, `mi`
- Mass: `mg`, `g`, `kg`, `tonne`, `oz`, `lb`, `seer`, `mon`
- Area: `sq_m`, `sq_km`, `sq_ft`, `acre`, `hectare`, `katha`, `bigha`
- Volume: `ml`, `l`, `cu_m`, `tsp`, `tbsp`, `cup`, `pt`, `qt`, `gal`
- Temperature: `c`, `f`, `k`
- Data: `b`, `kb`, `mb`, `gb`, `tb`, `kib`, `mib`, `gib`, `tib`
- Time: `ms`, `s`, `min`, `h`, `day`, `week`

## License

MIT
