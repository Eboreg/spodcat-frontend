import type { Breakpoint, BreakpointKey } from "@/types";

export const BREAKPOINT_ORDER = Object.fromEntries(
  ["xs", "sm", "md", "lg", "xl", "xxl"].map((key, idx) => [key, idx]),
) as {
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
