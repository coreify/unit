import { InvalidMeasurementError } from "./errors";
import {
  isBanglaLocale,
  shouldUseNativeDigits,
  toBanglaDigits
} from "./locale";
import { getUnit } from "./units";
import type { FormatMeasurementOptions } from "../types";

export function formatMeasurement(
  value: number,
  unit: string,
  options: FormatMeasurementOptions = {}
): string {
  if (!Number.isFinite(value)) {
    throw new InvalidMeasurementError("value must be a finite number");
  }

  const definition = getUnit(unit);
  const maximumFractionDigits =
    options.maximumFractionDigits ?? options.precision;
  const useNativeDigits = shouldUseNativeDigits(
    options.locale,
    options.digitStyle
  );
  const numberLocale =
    options.digitStyle === "latin" &&
    options.locale?.toLowerCase().startsWith("bn")
      ? "en-US"
      : useNativeDigits
        ? "bn-BD"
        : options.locale;
  const formatter = new Intl.NumberFormat(numberLocale, {
    maximumFractionDigits,
    minimumFractionDigits: options.minimumFractionDigits
  });
  const valueText = formatter.format(value);
  const output = `${valueText} ${getUnitDisplay(definition, options)}`;

  return useNativeDigits ? toBanglaDigits(output) : output;
}

function getUnitDisplay(
  unit: ReturnType<typeof getUnit>,
  options: FormatMeasurementOptions
): string {
  const useBangla =
    options.localizeUnits === true && isBanglaLocale(options.locale);

  if (options.unitDisplay === "label") {
    return useBangla ? (unit.labelBn ?? unit.label) : unit.label;
  }
  if (options.unitDisplay === "id") return unit.id;
  return useBangla ? (unit.symbolBn ?? unit.symbol) : unit.symbol;
}
