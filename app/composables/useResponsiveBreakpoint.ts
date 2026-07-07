import type { Breakpoint } from "~/types";
import { BREAKPOINT_ORDER, BREAKPOINTS } from "~/constants";

function findBreakpoint(width: number): Breakpoint {
  return BREAKPOINTS.toSorted((a, b) => a.min - b.min).find((bp) => width <= bp.max)!;
}

export default function useResponsiveBreakpoint() {
  const { width: windowWidth } = useWindowSize();
  const breakpoint: ComputedRef<Breakpoint> = computed(() => findBreakpoint(windowWidth.value));
  const breakpointOrder = computed(() => BREAKPOINT_ORDER[breakpoint.value.key]);

  return { breakpoint, breakpointOrder };
}
