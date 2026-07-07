import type { BREAKPOINT_KEYS, CSS_LENGTHS, SUPPORTED_LOCALES, THEMES } from "~/constants";

export type Breakpoint = { key: BreakpointKey; min: number; max: number };

export type BreakpointKey = (typeof BREAKPOINT_KEYS)[number];

export type BreakpointSizesArg = number | string | Partial<{ [k in BreakpointKey]: number | string }>;

export type CssLength = (typeof CSS_LENGTHS)[number];

export interface Image {
  url: string;
  width?: string | number;
  height?: string | number;
}

export interface Offsets {
  top?: number,
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

export interface ThemedProps {
  borderTheme?: Theme;
  darkenOnDisabled?: boolean;
  diagonalBg?: boolean;
  lightenOnActive?: boolean;
  lightenOnHover?: boolean;
  textTheme?: Theme;
  theme?: Theme;
  themeVariant?: ThemeVariant;
  transparent?: boolean;
}

export type ThemeVariant = "light" | "dark";
