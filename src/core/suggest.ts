import { normalizeBanglaDigits } from "./locale";
import { listUnits, normalizeUnitKey } from "./units";
import type { UnitSuggestion } from "../types";

const suggestionIndex = listUnits().map((unit) => ({
  unit: unit.id,
  labels: [
    unit.id,
    unit.symbol,
    unit.label,
    ...(unit.aliases ?? []),
    unit.labelBn,
    unit.symbolBn,
    ...(unit.aliasesBn ?? [])
  ]
    .filter((item): item is string => typeof item === "string")
    .map((label) => normalizeUnitKey(label))
}));

export function suggestUnit(input: string, limit = 5): UnitSuggestion[] {
  const normalized = normalizeUnitKey(normalizeBanglaDigits(input));
  const candidates: UnitSuggestion[] = [];

  for (const unit of suggestionIndex) {
    let score = 0;

    for (const label of unit.labels) {
      const labelScore = similarity(normalized, label);

      if (labelScore > score) {
        score = labelScore;
      }
    }

    if (score >= 0.5) {
      candidates.push({
        unit: unit.unit,
        input,
        reason: "alias-distance",
        score
      });
    }
  }

  return candidates
    .sort((a, b) => b.score - a.score || a.unit.localeCompare(b.unit))
    .slice(0, limit);
}

function similarity(a: string, b: string): number {
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  return 1 - levenshtein(a, b) / maxLength;
}

function levenshtein(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1]! + 1,
        previous[j]! + 1,
        previous[j - 1]! + cost
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length]!;
}
