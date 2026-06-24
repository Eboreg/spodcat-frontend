import type { H3Event } from "h3";

const SUPPORTED_LOCALES = ["sv", "en"] as const;
const THEMES = [
  "primary",
  "secondary",
  "tertiary",
  "boring",
  "boring-inverse",
  "error",
  "info",
  "success",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type Theme = (typeof THEMES)[number];

export function coerceBetween(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
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

export function getLocaleDateString(date: Date, locale?: string | null): string {
  if (locale !== undefined && locale !== null) return new Intl.DateTimeFormat(locale).format(date);
  return new Intl.DateTimeFormat().format(date);
}

export function getSeasonTheme(number: number): Theme {
  return THEMES[number % (THEMES.length - 1)]!;
}

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

export function makeAbsoluteUrl(url: string): string {
  const runtimeConfig = useRuntimeConfig();

  if (url.match(/^https?:\/\/.*/)) return url;
  return new URL(url, runtimeConfig.public.frontendHost).toString();
}

export function makeBackendUrl(path: string, event?: H3Event<EventHandlerRequest>): string {
  if (path.match(/^https?:\/\/.*/)) return path;
  const runtimeConfig = useRuntimeConfig(event);
  return new URL(path, runtimeConfig.public.backendHost).toString();
}

export function modulo(n: number, d: number): number {
  // "%" in Javascript is a remainder operator, not modulo!
  // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description
  return ((n % d) + d) % d;
}

export function timeFromString(time: string): number | null {
  if (!time.match(/^(?:\d{1,2}:)?(?:\d{1,2}:)?\d{1,2}$/)) return null;

  const parts = time.split(":");
  let seconds = 0;

  parts.forEach((part, idx) => {
    const partInt = parseInt(part);

    if (!isNaN(partInt)) {
      if (parts.length - idx === 3) seconds += partInt * 60 * 60;
      else if (parts.length - idx === 2) seconds += partInt * 60;
      else if (parts.length - idx === 1) seconds += partInt;
    }
  });

  return seconds;
}

export function timeToString(time: number): string {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor(time / 60 / 60);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
