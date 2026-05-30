import { UNIT_FACTORS, UNITS } from "./constants";
import { UnknownUnitError } from "./errors";
import { BN_UNIT_NAMES } from "./locale";
import type { MeasurementCategory, UnitDefinition, UnitId } from "../types";

const unitsById = new Map<UnitId, UnitDefinition>(
  UNITS.map((unit) => [
    unit.id,
    Object.freeze({
      ...unit,
      labelBn: BN_UNIT_NAMES[unit.id].label,
      symbolBn: BN_UNIT_NAMES[unit.id].symbol,
      aliasesBn: BN_UNIT_NAMES[unit.id].aliases,
      toBaseFactor: UNIT_FACTORS[unit.id as keyof typeof UNIT_FACTORS]
    })
  ])
);
const allUnits = Object.freeze([...unitsById.values()]);
const unitsByCategory = new Map<
  MeasurementCategory,
  readonly UnitDefinition[]
>();

const aliases = new Map<string, UnitId>();

for (const unit of UNITS) {
  const definition = unitsById.get(unit.id);

  if (definition) {
    const bucket = [...(unitsByCategory.get(unit.category) ?? []), definition];
    unitsByCategory.set(unit.category, bucket);
  }

  aliases.set(normalizeUnitKey(unit.id), unit.id);
  aliases.set(normalizeUnitKey(unit.symbol), unit.id);
  aliases.set(normalizeUnitKey(unit.label), unit.id);
  aliases.set(normalizeUnitKey(BN_UNIT_NAMES[unit.id].label), unit.id);
  aliases.set(normalizeUnitKey(BN_UNIT_NAMES[unit.id].symbol), unit.id);
  for (const alias of unit.aliases) {
    aliases.set(normalizeUnitKey(alias), unit.id);
  }
  for (const alias of BN_UNIT_NAMES[unit.id].aliases) {
    aliases.set(normalizeUnitKey(alias), unit.id);
  }
}

for (const [category, bucket] of unitsByCategory) {
  unitsByCategory.set(category, Object.freeze([...bucket]));
}

export function normalizeUnitKey(unit: string): string {
  return unit.trim().toLowerCase().replace(/\s+/g, "-").replace(/²/g, "2");
}

export function resolveUnit(unit: string): UnitId {
  const resolved = aliases.get(normalizeUnitKey(unit));

  if (!resolved) {
    throw new UnknownUnitError(unit);
  }

  return resolved;
}

export function isKnownUnit(unit: string): boolean {
  return aliases.has(normalizeUnitKey(unit));
}

export function getUnit(unit: string): UnitDefinition {
  const resolved = resolveUnit(unit);
  const definition = unitsById.get(resolved);

  if (!definition) {
    throw new UnknownUnitError(unit);
  }

  return definition;
}

export function listUnits(): UnitDefinition[] {
  return [...allUnits];
}

export function listUnitsByCategory(
  category: MeasurementCategory
): UnitDefinition[] {
  return [...(unitsByCategory.get(category) ?? [])];
}
