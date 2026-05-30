export class UnitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnitError";
  }
}

export class UnknownUnitError extends UnitError {
  constructor(unit: string) {
    super(
      `Unit "${unit}" is not recognized. Use known unit ids, symbols, or aliases like "kg", "meter", or "sq_ft".`
    );
    this.name = "UnknownUnitError";
  }
}

export class IncompatibleUnitError extends UnitError {
  constructor(from: string, to: string) {
    super(
      `Cannot convert "${from}" to "${to}" because they are different measurement categories. Convert between units from same category only.`
    );
    this.name = "IncompatibleUnitError";
  }
}

export class InvalidMeasurementError extends UnitError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMeasurementError";
  }
}
