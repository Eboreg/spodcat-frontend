import type { BreakpointSize, BreakpointSizesArg, DetailedBreakpointSize } from "~/types";
import useResponsiveBreakpoint from "./useResponsiveBreakpoint";

export default function useResponsiveSize(breakpointSizes?: MaybeRefOrGetter<BreakpointSizesArg | undefined>) {
  function isDetailedSize(size: any): size is DetailedBreakpointSize {
    return (
      (typeof size.width === "number" || typeof size.width === "string")
      && (typeof size.height === "number" || typeof size.height === "string")
    );
  }

  function toPx(value: string | number | undefined): string | undefined {
    if (typeof value === "string") return value;
    if (typeof value === "number") return `${value}px`;
    return undefined;
  }

  const { breakpoint } = useResponsiveBreakpoint();

  const normalizedArg = () => {
    const arg = toValue(breakpointSizes);

    if (typeof arg === "number" || typeof arg === "string") {
      return { xs: { width: arg, height: arg } };
    }
    if (isDetailedSize(arg)) return { xs: arg };
    if (arg === undefined) return {};
    return arg;
  };

  const size = computed<BreakpointSize | undefined>(() => {
    const arg = normalizedArg();

    switch (breakpoint.value.key) {
      case "xs":
        return arg.xs;
      case "sm":
        return arg.sm ?? arg.xs;
      case "md":
        return arg.md ?? arg.sm ?? arg.xs;
      case "lg":
        return arg.lg ?? arg.md ?? arg.sm ?? arg.xs;
      case "xl":
        return arg.xl ?? arg.lg ?? arg.md ?? arg.sm ?? arg.xs;
      case "xxl":
        return arg.xxl ?? arg.xl ?? arg.lg ?? arg.md ?? arg.sm ?? arg.xs;
    }
  });

  const detailedSize = computed<DetailedBreakpointSize | undefined>(() => {
    const sizeValue = size.value;

    if (typeof sizeValue === "string" || typeof sizeValue === "number") {
      return { width: sizeValue, height: sizeValue };
    }
    return sizeValue;
  });

  const height = computed(() => toPx(detailedSize.value?.height));

  const width = computed(() => toPx(detailedSize.value?.width));

  return { width, height };
}
