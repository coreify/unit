import { describe, expect, it } from "vitest";
import * as unit from "../src";

describe("public surface", () => {
  it("exports core functions", () => {
    expect(typeof unit.convert).toBe("function");
    expect(typeof unit.convertDetailed).toBe("function");
    expect(typeof unit.convertMany).toBe("function");
    expect(typeof unit.bestUnit).toBe("function");
    expect(typeof unit.formatBest).toBe("function");
    expect(typeof unit.formatMeasurement).toBe("function");
    expect(typeof unit.parseMeasurement).toBe("function");
    expect(typeof unit.parseMixedMeasurement).toBe("function");
    expect(typeof unit.normalizeMixedMeasurement).toBe("function");
    expect(typeof unit.createMeasurementSchema).toBe("function");
    expect(typeof unit.suggestUnit).toBe("function");
    expect(typeof unit.countDecimalPlaces).toBe("function");
    expect(typeof unit.getUnit).toBe("function");
    expect(typeof unit.listUnits).toBe("function");
    expect(typeof unit.toBanglaDigits).toBe("function");
  });
});
