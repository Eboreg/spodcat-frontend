import type { BreakpointSizesArg } from "~/types";
import useResponsiveBreakpoint from "./useResponsiveBreakpoint";

export default function useResponsiveSize(
  breakpointSizes?: MaybeRefOrGetter<BreakpointSizesArg | undefined>,
) {
  const { breakpoint } = useResponsiveBreakpoint();

  const normalizedArg = () => {
    const b = toValue(breakpointSizes);

    if (typeof b === "number" || typeof b === "string") {
      return { xs: b };
    }
    if (b === undefined) return {};
    return b;
  };

  const size = computed(() => {
    const b = normalizedArg();

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

  const sizeString = computed(() => {
    if (typeof size.value === "string") return size.value;
    if (typeof size.value === "number") return `${size.value}px`;
    return undefined;
  });

  return { size, sizeString };
}
