import type { Breakpoint, BreakpointKey } from "@/types";

export const BREAKPOINT_KEYS = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;

export const BREAKPOINT_ORDER = Object.fromEntries(BREAKPOINT_KEYS.map((key, idx) => [key, idx])) as {
  [k in BreakpointKey]: number;
};

export const BREAKPOINTS: Breakpoint[] = [
  { key: "xs", min: 0, max: 575 },
  { key: "sm", min: 576, max: 767 },
  { key: "md", min: 768, max: 991 },
  { key: "lg", min: 992, max: 1199 },
  { key: "xl", min: 1200, max: 1399 },
  { key: "xxl", min: 1400, max: Infinity },
] as const;

export const CSS_LENGTHS = ["0", "quarter", "half", "quarter-to", "single", "double", "3x", "4x"] as const;

export const SPODCAT_FAVICON = {
  href: "/img/spodcat-favicon.png",
  type: "image/png",
} as const;

export const SPODCAT_LOGO = {
  url: "/img/spodcat-logo.png",
  type: "image/png",
  width: 1024,
  height: 1024,
} as const;

export const SPODCAT_LOGO_TRANSPARENT = {
  url: "/img/spodcat-logo-transparent.png",
  type: "image/png",
  width: 1024,
  height: 1024,
} as const;

export const SUPPORTED_LOCALES = ["sv", "en"] as const;

export const THEMES = ["boring", "error", "info", "primary", "secondary", "success", "tertiary"] as const;
