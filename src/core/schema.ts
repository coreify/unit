import { InvalidMeasurementError } from "./errors";
import { parseMeasurement } from "./parse";
import type {
  MeasurementSchema,
  MeasurementSchemaOptions,
  MeasurementValidationResult
} from "../types";

export function createMeasurementSchema(
  options: MeasurementSchemaOptions
): MeasurementSchema {
  return {
    parse(input) {
      if (options.required && input.trim() === "") {
        throw new InvalidMeasurementError(
          "Measurement is required. Enter value with unit like \"12 kg\"."
        );
      }

      return parseMeasurement(input, options);
    },
    validate(input): MeasurementValidationResult {
      try {
        if (options.required && input.trim() === "") {
          return {
            success: false,
            issues: [
              {
                code: "required",
                message:
                  "Measurement is required. Enter value with unit like \"12 kg\"."
              }
            ]
          };
        }

        return {
          success: true,
          data: parseMeasurement(input, options),
          issues: []
        };
      } catch (error) {
        return {
          success: false,
          issues: [
            {
              code: "invalid_measurement",
              message:
                error instanceof Error ? error.message : "Invalid measurement"
            }
          ]
        };
      }
    }
  };
}
