import type { MaybeRefOrGetter } from "vue";
import type { SUPPORTED_LOCALES } from "~/constants";

export type BorderRadius = "0" | "sm" | "md" | "lg" | "xl" | "100";

export type BorderWidth = "0" | "xs" | "sm" | "md" | "lg";

export type Breakpoint = { key: BreakpointKey; min: number; max: number };

export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export interface DetailedBreakpointSize {
  width: number | string;
  height: number | string;
}

export type BreakpointSize = number | string | DetailedBreakpointSize;

export type BreakpointSizesArg = BreakpointSize | Partial<{ [k in BreakpointKey]: BreakpointSize }>;

export type CssLength = "0" | "quarter" | "half" | "quarter-to" | "single" | "double" | "3x" | "4x";

export type FontSize = "xs" | "sm" | "md" | "lg";

export interface Image {
  height?: string | number;
  url: string;
  width?: string | number;
}

export type MaybeRefOrGetterDeep<T> = MaybeRefOrGetter<T> & {
  [K in keyof T]: MaybeRefOrGetter<T[K]>;
};

export interface Offsets {
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
}

export interface RelativePosition {
  x: RelativePositionX;
  y: RelativePositionY;
}

export type RelativePositionX = "center" | "left" | "right";

export type RelativePositionY = "bottom" | "center" | "top";

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type ThemeColor = "error" | "gray" | "gray-inverted" | "info" | "primary" | "secondary" | "success" | "tertiary";

export type ThemeColorVariant = "accented" | "muted";

export interface Theme {
  accentedOnActive?: boolean;
  color?: ThemeColor;
  mutedOnDisabled?: boolean;
  colorVariant?: ThemeColorVariant;
}

export interface ThemedProps extends Theme {
  background?: ThemeColor | Theme | "none";
  border?: ThemeColor | Theme | "none";
  text?: ThemeColor | Theme | "none";
  transparent?: boolean;
}
