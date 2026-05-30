import { describe, expect, it } from "vitest";
import {
  bestUnit,
  convertDetailed,
  createMeasurementSchema,
  formatBest,
  normalizeMixedMeasurement,
  parseMixedMeasurement,
  suggestUnit
} from "../src";

describe("mixed measurements", () => {
  it("parses mixed length measurements", () => {
    expect(parseMixedMeasurement("5 ft 7 in")).toMatchObject({
      category: "length",
      terms: [
        { value: 5, unit: "ft", rawUnit: "ft", decimalPlaces: 0 },
        { value: 7, unit: "in", rawUnit: "in", decimalPlaces: 0 }
      ]
    });
  });

  it("parses compact and Bangla mixed measurements", () => {
    expect(parseMixedMeasurement("২ মি ৩০ সেমি")).toMatchObject({
      category: "length",
      terms: [
        { value: 2, unit: "m" },
        { value: 30, unit: "cm" }
      ]
    });
  });

  it("normalizes mixed measurements", () => {
    expect(normalizeMixedMeasurement("5 ft 7 in", "in")).toBe(67);
    expect(normalizeMixedMeasurement("2 m 30 cm", "cm")).toBeCloseTo(230);
    expect(normalizeMixedMeasurement("1 kg 250 g", "g")).toBe(1250);
  });

  it("rejects incompatible mixed measurements", () => {
    expect(() => parseMixedMeasurement("1 kg 2 m")).toThrow(
      "uses different unit categories"
    );
  });

  it("rejects mixed measurements with leftover garbage", () => {
    expect(() => parseMixedMeasurement("5 ft nope 7 in")).toThrow(
      "Could not read \"5 ft nope 7 in\" as mixed measurement"
    );
  });
});

describe("best unit", () => {
  it("chooses human-sized metric units", () => {
    expect(bestUnit(1532, "m", { precision: 3 })).toMatchObject({
      value: 1.532,
      unit: "km",
      formatted: "1.532 km"
    });
    expect(formatBest(0.003, "kg")).toBe("3 g");
  });

  it("supports custom candidate units", () => {
    expect(bestUnit(5280, "ft", { candidates: ["ft", "mi"] })).toMatchObject({
      value: 1,
      unit: "mi"
    });
  });

  it("rejects cross-category custom candidates", () => {
    expect(() => bestUnit(1, "kg", { candidates: ["m"] })).toThrow(
      "bestUnit candidates must stay in mass: m"
    );
  });
});

describe("detailed conversion", () => {
  it("returns conversion trace and rounding status", () => {
    expect(convertDetailed(1, "m", "ft", { precision: 2 })).toMatchObject({
      value: 3.28,
      from: "m",
      to: "ft",
      category: "length",
      baseValue: 1,
      precision: 2,
      status: "rounded"
    });
  });

  it("flags regional units", () => {
    expect(convertDetailed(1, "bigha", "sq_ft").warnings).toContainEqual({
      code: "regional-unit",
      message:
        "bigha can vary by region. Verify local definition before storing or comparing values."
    });
    expect(convertDetailed(1, "kg", "seer").warnings).toContainEqual({
      code: "regional-unit",
      message:
        "seer can vary by region. Verify local definition before storing or comparing values."
    });
  });
});

describe("measurement schema", () => {
  it("validates form-ready measurement rules", () => {
    const schema = createMeasurementSchema({
      category: "mass",
      allowedUnits: ["g", "kg"],
      min: 0,
      max: 10,
      maxDecimalPlaces: 2,
      required: true
    });

    expect(schema.validate("2.25 kg")).toMatchObject({
      success: true,
      data: { value: 2.25, unit: "kg" },
      issues: []
    });
    expect(schema.validate("")).toMatchObject({
      success: false,
      issues: [{ code: "required" }]
    });
    expect(schema.validate("2.123 kg").success).toBe(false);
    expect(() => schema.parse("11 kg")).toThrow(
      "Value must be at most 10"
    );
  });
});

describe("unit suggestions", () => {
  it("suggests likely units for typos and Bangla aliases", () => {
    expect(suggestUnit("kilogrm")[0]).toMatchObject({ unit: "kg" });
    expect(suggestUnit("বর্গফু")[0]).toMatchObject({ unit: "sq_ft" });
  });
});
