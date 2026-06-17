import { useI18n as baseUseI18n, type UseI18nOptions } from "vue-i18n";

import en from "./en.yaml";
import sv from "./sv.yaml";

export const SUPPORTED_LOCALES = ["sv", "en"];
export type SupportedLocale = "sv" | "en";
export const messages = { en, sv };

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value);
}

export function detectLocale(value?: string | null): SupportedLocale {
  if (value && isSupportedLocale(value)) return value;

  for (const lang of navigator.languages || [navigator.language]) {
    const code = lang.split("-")[0]!;
    if (isSupportedLocale(code)) return code;
  }

  return "en";
}

export function useI18n(options?: UseI18nOptions) {
  return baseUseI18n({ messages, ...options });
}
