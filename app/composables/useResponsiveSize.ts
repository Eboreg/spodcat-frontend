import type { BreakpointSizesArg } from "~/types";
import useResponsiveBreakpoint from "./useResponsiveBreakpoint";

export default function useResponsiveSize(
  breakpointSizes?: MaybeRefOrGetter<BreakpointSizesArg | undefined>,
) {
  const { breakpoint } = useResponsiveBreakpoint();
  const size = computed(() => {
    const bValue = toValue(breakpointSizes);
    const b = typeof bValue === "number" ? { xs: bValue } : bValue === undefined ? {} : bValue;

    switch (breakpoint.value.key) {
      case "xs":
        return b.xs;
      case "sm":
        return b.sm ?? b.xs;
      case "md":
        return b.md ?? b.sm ?? b.xs;
      case "lg":
        return b.lg ?? b.md ?? b.sm ?? b.xs;
      case "xl":
        return b.xl ?? b.lg ?? b.md ?? b.sm ?? b.xs;
      case "xxl":
        return b.xxl ?? b.xl ?? b.lg ?? b.md ?? b.sm ?? b.xs;
    }
  });
  const sizeString = computed(() => (size.value !== undefined ? `${size.value}px` : undefined));

  return { size, sizeString };
}
