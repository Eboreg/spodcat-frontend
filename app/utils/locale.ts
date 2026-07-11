import type { SupportedLocale } from "@/types";
import { SUPPORTED_LOCALES } from "@/constants";

function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function detectLocale(value?: string | null): SupportedLocale {
  if (value && isSupportedLocale(value)) return value;

  if (navigator === undefined) return "en";

  for (const lang of navigator.languages || [navigator.language]) {
    const code = lang.split("-")[0]!;
    if (isSupportedLocale(code)) return code;
  }

  return "en";
}
