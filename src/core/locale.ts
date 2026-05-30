import type { UnitDigitStyle, UnitLocale, UnitId } from "../types";

export const BN_UNIT_NAMES = {
  mm: { label: "মিলিমিটার", symbol: "মিমি", aliases: ["মিলিমিটার", "মিমি"] },
  cm: {
    label: "সেন্টিমিটার",
    symbol: "সেমি",
    aliases: ["সেন্টিমিটার", "সেমি"]
  },
  m: { label: "মিটার", symbol: "মি", aliases: ["মিটার", "মি"] },
  km: { label: "কিলোমিটার", symbol: "কিমি", aliases: ["কিলোমিটার", "কিমি"] },
  in: { label: "ইঞ্চি", symbol: "ইঞ্চি", aliases: ["ইঞ্চি"] },
  ft: { label: "ফুট", symbol: "ফুট", aliases: ["ফুট"] },
  yd: { label: "গজ", symbol: "গজ", aliases: ["গজ"] },
  mi: { label: "মাইল", symbol: "মাইল", aliases: ["মাইল"] },
  mg: {
    label: "মিলিগ্রাম",
    symbol: "মিগ্রা",
    aliases: ["মিলিগ্রাম", "মিগ্রা"]
  },
  g: { label: "গ্রাম", symbol: "গ্রা", aliases: ["গ্রাম", "গ্রা"] },
  kg: { label: "কিলোগ্রাম", symbol: "কেজি", aliases: ["কিলোগ্রাম", "কেজি"] },
  tonne: { label: "টন", symbol: "টন", aliases: ["টন"] },
  oz: { label: "আউন্স", symbol: "আউন্স", aliases: ["আউন্স"] },
  lb: { label: "পাউন্ড", symbol: "পাউন্ড", aliases: ["পাউন্ড"] },
  seer: { label: "সের", symbol: "সের", aliases: ["সের"] },
  mon: { label: "মণ", symbol: "মণ", aliases: ["মণ", "মন"] },
  sq_m: {
    label: "বর্গ মিটার",
    symbol: "বর্গমি",
    aliases: ["বর্গ মিটার", "বর্গমি"]
  },
  sq_km: {
    label: "বর্গ কিলোমিটার",
    symbol: "বর্গকিমি",
    aliases: ["বর্গ কিলোমিটার", "বর্গকিমি"]
  },
  sq_ft: {
    label: "বর্গ ফুট",
    symbol: "বর্গফুট",
    aliases: ["বর্গ ফুট", "বর্গফুট"]
  },
  acre: { label: "একর", symbol: "একর", aliases: ["একর"] },
  hectare: { label: "হেক্টর", symbol: "হেক্টর", aliases: ["হেক্টর"] },
  katha: { label: "কাঠা", symbol: "কাঠা", aliases: ["কাঠা"] },
  bigha: { label: "বিঘা", symbol: "বিঘা", aliases: ["বিঘা"] },
  ml: { label: "মিলিলিটার", symbol: "মিলি", aliases: ["মিলিলিটার", "মিলি"] },
  l: { label: "লিটার", symbol: "লি", aliases: ["লিটার", "লি"] },
  cu_m: { label: "ঘন মিটার", symbol: "ঘনমি", aliases: ["ঘন মিটার", "ঘনমি"] },
  tsp: { label: "চা চামচ", symbol: "চা চামচ", aliases: ["চা চামচ"] },
  tbsp: { label: "টেবিল চামচ", symbol: "টেবিল চামচ", aliases: ["টেবিল চামচ"] },
  cup: { label: "কাপ", symbol: "কাপ", aliases: ["কাপ"] },
  pt: { label: "পাইন্ট", symbol: "পাইন্ট", aliases: ["পাইন্ট"] },
  qt: { label: "কোয়ার্ট", symbol: "কোয়ার্ট", aliases: ["কোয়ার্ট"] },
  gal: { label: "গ্যালন", symbol: "গ্যালন", aliases: ["গ্যালন"] },
  c: { label: "সেলসিয়াস", symbol: "সে", aliases: ["সেলসিয়াস", "সে"] },
  f: { label: "ফারেনহাইট", symbol: "ফা", aliases: ["ফারেনহাইট", "ফা"] },
  k: { label: "কেলভিন", symbol: "কে", aliases: ["কেলভিন", "কে"] },
  b: { label: "বাইট", symbol: "B", aliases: ["বাইট"] },
  kb: { label: "কিলোবাইট", symbol: "KB", aliases: ["কিলোবাইট"] },
  mb: { label: "মেগাবাইট", symbol: "MB", aliases: ["মেগাবাইট"] },
  gb: { label: "গিগাবাইট", symbol: "GB", aliases: ["গিগাবাইট"] },
  tb: { label: "টেরাবাইট", symbol: "TB", aliases: ["টেরাবাইট"] },
  kib: { label: "কিবিবাইট", symbol: "KiB", aliases: ["কিবিবাইট"] },
  mib: { label: "মেবিবাইট", symbol: "MiB", aliases: ["মেবিবাইট"] },
  gib: { label: "গিবিবাইট", symbol: "GiB", aliases: ["গিবিবাইট"] },
  tib: { label: "টেবিবাইট", symbol: "TiB", aliases: ["টেবিবাইট"] },
  ms: {
    label: "মিলিসেকেন্ড",
    symbol: "মিসে",
    aliases: ["মিলিসেকেন্ড", "মিসে"]
  },
  s: { label: "সেকেন্ড", symbol: "সে", aliases: ["সেকেন্ড"] },
  min: { label: "মিনিট", symbol: "মিনিট", aliases: ["মিনিট"] },
  h: { label: "ঘণ্টা", symbol: "ঘণ্টা", aliases: ["ঘণ্টা", "ঘন্টা"] },
  day: { label: "দিন", symbol: "দিন", aliases: ["দিন"] },
  week: { label: "সপ্তাহ", symbol: "সপ্তাহ", aliases: ["সপ্তাহ"] }
} as const satisfies Record<
  UnitId,
  { label: string; symbol: string; aliases: readonly string[] }
>;

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const englishDigits = new Map(
  banglaDigits.map((digit, index) => [digit, String(index)])
);

export function isBanglaLocale(locale: UnitLocale | string | undefined): boolean {
  return typeof locale === "string" && locale.toLowerCase().startsWith("bn");
}

export function normalizeBanglaDigits(input: string): string {
  return input.replace(/[০-৯]/g, (digit) => englishDigits.get(digit) ?? digit);
}

export function toBanglaDigits(input: string): string {
  return input.replace(/\d/g, (digit) => banglaDigits[Number(digit)] ?? digit);
}

export function shouldUseNativeDigits(
  locale: UnitLocale | string | undefined,
  digitStyle: UnitDigitStyle | undefined
): boolean {
  if (digitStyle === "native") return true;
  if (digitStyle === "latin") return false;
  return isBanglaLocale(locale);
}
