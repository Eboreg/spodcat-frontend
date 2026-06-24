export interface BreakpointSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export type BreakpointSizesArg = number | Partial<BreakpointSizes>;

export const BREAKPOINTS: BreakpointSizes = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};
