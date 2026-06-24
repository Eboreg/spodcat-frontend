import { BREAKPOINTS, type BreakpointSizesArg } from "~/responsive";

export default function useResponsiveSize(
  breakpointSizes?: MaybeRefOrGetter<BreakpointSizesArg | undefined>,
) {
  const { width: windowWidth } = useWindowSize();
  const size = computed(() => {
    const bValue = toValue(breakpointSizes);
    const b = typeof bValue === "number" ? { xs: bValue } : bValue === undefined ? {} : bValue;

    if (windowWidth.value < BREAKPOINTS.sm) return b.xs;
    if (windowWidth.value < BREAKPOINTS.md) return b.sm ?? b.xs;
    if (windowWidth.value < BREAKPOINTS.lg) return b.md ?? b.sm ?? b.xs;
    if (windowWidth.value < BREAKPOINTS.xl) return b.lg ?? b.md ?? b.sm ?? b.xs;
    if (windowWidth.value < BREAKPOINTS.xxl) return b.xl ?? b.lg ?? b.md ?? b.sm ?? b.xs;
    return b.xxl ?? b.xl ?? b.lg ?? b.md ?? b.sm ?? b.xs;
  });
  const sizeString = computed(() => (size.value !== undefined ? `${size.value}px` : undefined));

  return { size, sizeString };
}
