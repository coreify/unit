import { describe, expect, it } from "vitest";
import {
  IncompatibleUnitError,
  UnknownUnitError,
  convert,
  convertMany
} from "../src";

describe("convert", () => {
  it("converts metric length units", () => {
    expect(convert(1, "km", "m")).toBe(1000);
    expect(convert(100, "cm", "m")).toBe(1);
  });

  it("converts imperial length units", () => {
    expect(convert(5280, "ft", "mi")).toBe(1);
    expect(convert(12, "inches", "ft")).toBeCloseTo(1);
  });

  it("converts mass units", () => {
    expect(convert(1, "kg", "g")).toBe(1000);
    expect(convert(1, "lb", "kg", { precision: 6 })).toBe(0.453592);
    expect(convert(1, "seer", "kg")).toBe(0.933105);
  });

  it("converts area units", () => {
    expect(convert(1, "acre", "sq_ft", { precision: 2 })).toBe(43560);
    expect(convert(1, "bigha", "katha", { precision: 6 })).toBe(20);
  });

  it("converts volume units", () => {
    expect(convert(1, "l", "ml")).toBe(1000);
    expect(convert(1, "gal", "l", { precision: 6 })).toBe(3.785412);
  });

  it("converts temperature units", () => {
    expect(convert(32, "f", "c")).toBe(0);
    expect(convert(100, "celsius", "fahrenheit")).toBe(212);
    expect(convert(0, "c", "k")).toBe(273.15);
  });

  it("converts data and time units", () => {
    expect(convert(1, "mb", "kb")).toBe(1000);
    expect(convert(1, "mib", "kib")).toBe(1024);
    expect(convert(2, "h", "min")).toBe(120);
  });

  it("converts one value to many units", () => {
    expect(convertMany(1, "kg", ["g", "lb"], { precision: 3 })).toEqual({
      g: 1000,
      lb: 2.205
    });
  });

  it("supports explicit rounding modes", () => {
    expect(convert(1, "m", "ft", { precision: 2 })).toBe(3.28);
    expect(convert(1, "m", "ft", { precision: 2, roundingMode: "ceil" })).toBe(
      3.29
    );
    expect(convert(1, "m", "ft", { precision: 2, roundingMode: "floor" })).toBe(
      3.28
    );
  });

  it("rejects incompatible unit categories", () => {
    expect(() => convert(1, "kg", "m")).toThrow(IncompatibleUnitError);
  });

  it("rejects unknown units", () => {
    expect(() => convert(1, "kg", "banana")).toThrow(
      'Unit "banana" is not recognized'
    );
    expect(() => convert(1, "kg", "banana")).toThrow(UnknownUnitError);
  });
});
