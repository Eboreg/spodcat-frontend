import type { BREAKPOINT_KEYS, SUPPORTED_LOCALES, THEMES } from "~/constants";

export type Breakpoint = { key: BreakpointKey; min: number; max: number };

export type BreakpointKey = (typeof BREAKPOINT_KEYS)[number];

export type BreakpointSizesArg = number | Partial<{ [k in BreakpointKey]: number }>;

export interface Image {
  url: string;
  width?: string | number;
  height?: string | number;
}

export interface Offsets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface RelativePosition {
  x: RelativePositionX;
  y: RelativePositionY;
}

export type RelativePositionX = "left" | "right" | "center";

export type RelativePositionY = "top" | "bottom" | "center";

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type Theme = (typeof THEMES)[number];
