import type { H3Event } from "h3";
import type { SupportedLocale } from "@/types";
import { SUPPORTED_LOCALES } from "@/constants";

function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale);
}

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

export function extractImageUrlsFromMarkdown(description: string): string[] {
  return [...description.matchAll(/!\[.*?]\((?<url>.*?)\)/g)].map((m) => m.groups!["url"]!);
}

export function getLocaleDateString(date: Date | string, locale?: string | null): string {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString(locale ?? undefined, { dateStyle: "short" });
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

export function ping(path: string) {
  if (import.meta.client) {
    callOnce(() => navigator.sendBeacon(makeBackendUrl(path)), { mode: "navigation" });
  }
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
