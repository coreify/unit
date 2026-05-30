import { describe, expect, it } from "vitest";
import {
  formatMeasurement,
  getUnit,
  isKnownUnit,
  listUnitsByCategory,
  parseMeasurement,
  resolveUnit
} from "../src";

describe("unit metadata", () => {
  it("resolves ids, labels, symbols, and aliases", () => {
    expect(resolveUnit("meters")).toBe("m");
    expect(resolveUnit("m2")).toBe("sq_m");
    expect(resolveUnit("square feet")).toBe("sq_ft");
    expect(resolveUnit("কেজি")).toBe("kg");
    expect(resolveUnit("বর্গফুট")).toBe("sq_ft");
    expect(isKnownUnit("kilograms")).toBe(true);
    expect(isKnownUnit("unknown")).toBe(false);
  });

  it("lists units by category", () => {
    expect(listUnitsByCategory("length").map((unit) => unit.id)).toContain(
      "km"
    );
    expect(getUnit("kilogram").category).toBe("mass");
  });

  it("does not expose mutable cached metadata collections", () => {
    const lengthUnits = listUnitsByCategory("length");
    const allUnits = listUnitsByCategory("mass");

    lengthUnits.pop();
    allUnits[0] = getUnit("meter");

    expect(listUnitsByCategory("length").map((unit) => unit.id)).toContain(
      "km"
    );
    expect(listUnitsByCategory("mass")[0]?.id).toBe("mg");
  });
});

describe("parseMeasurement", () => {
  it("parses decimal measurements", () => {
    expect(parseMeasurement("12.5 kilograms")).toEqual({
      value: 12.5,
      unit: "kg",
      rawUnit: "kilograms",
      decimalPlaces: 1
    });
  });

  it("parses scientific notation", () => {
    expect(parseMeasurement("1e3 ms")).toEqual({
      value: 1000,
      unit: "ms",
      rawUnit: "ms",
      decimalPlaces: 0
    });
  });

  it("parses Bangla digits and unit names", () => {
    expect(parseMeasurement("১২.৫০ কেজি")).toEqual({
      value: 12.5,
      unit: "kg",
      rawUnit: "কেজি",
      decimalPlaces: 2
    });
  });

  it("validates decimal place length", () => {
    expect(() =>
      parseMeasurement("12.345 kg", { maxDecimalPlaces: 2 })
    ).toThrow("Use at most 2 decimal places");
  });
});

describe("formatMeasurement", () => {
  it("formats with unit symbols by default", () => {
    expect(
      formatMeasurement(12.3456, "meter", { maximumFractionDigits: 2 })
    ).toBe("12.35 m");
  });

  it("formats with labels or ids", () => {
    expect(formatMeasurement(12, "meter", { unitDisplay: "label" })).toBe(
      "12 meter"
    );
    expect(formatMeasurement(12, "meter", { unitDisplay: "id" })).toBe("12 m");
  });

  it("keeps canonical units by default for Bangla locale", () => {
    expect(
      formatMeasurement(12.5, "kg", {
        locale: "bn-BD",
        unitDisplay: "label",
        maximumFractionDigits: 1
      })
    ).toBe("১২.৫ kilogram");
  });

  it("formats Bangla names and digits when unit localization is enabled", () => {
    expect(
      formatMeasurement(12.5, "kg", {
        locale: "bn-BD",
        unitDisplay: "label",
        localizeUnits: true,
        maximumFractionDigits: 1
      })
    ).toBe("১২.৫ কিলোগ্রাম");
  });

  it("can force Latin digits with Bangla locale", () => {
    expect(
      formatMeasurement(12.5, "kg", {
        digitStyle: "latin",
        locale: "bn-BD",
        unitDisplay: "symbol",
        maximumFractionDigits: 1
      })
    ).toBe("12.5 kg");
  });

  it("can keep Latin digits while localizing unit labels", () => {
    expect(
      formatMeasurement(12.5, "kg", {
        digitStyle: "latin",
        locale: "bn-BD",
        unitDisplay: "label",
        localizeUnits: true,
        maximumFractionDigits: 1
      })
    ).toBe("12.5 কিলোগ্রাম");
  });
});
