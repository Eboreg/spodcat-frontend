import type { Offsets, RelativePosition } from "@/types";
import type { ElementSize } from "@vueuse/core";

interface Size {
  width: MaybeRefOrGetter<number>;
  height: MaybeRefOrGetter<number>;
}

interface TransitionStyle {
  bottom?: string;
  left?: string;
  scale?: number;
  opacity?: number;
  "transition-property"?: string;
}

interface UseTransitionsOptions {
  immediate?: boolean;
  offsets?: MaybeRefOrGetter<Offsets>;
  onReady?: (state: TransitionState) => void;
  onStartTransitionEnd?: () => void;
  onEndTransitionEnd?: () => void;
}

const transitionKeys = ["top", "right", "bottom", "left", "size0x", "size100x"] as const;

type TransitionKey = (typeof transitionKeys)[number];

export type TransitionState = "created" | "stable" | "end";

function getStartOrEndStyle(key: TransitionKey, size: ElementSize): TransitionStyle {
  switch (key) {
    case "top":
      return { bottom: "calc(100% + var(--spod-length-half))" };
    case "right":
      return { left: "calc(100% + var(--spod-length-half))" };
    case "bottom":
      return { bottom: `-${size.height + 10}px` };
    case "left":
      return { left: `-${size.width + 10}px` };
    case "size0x":
      return { scale: 0 };
    case "size100x":
      return { scale: 100, opacity: 0 };
  }
}

function getStableStyle(
  size: ElementSize,
  position: RelativePosition,
  offsets: Offsets = {},
): TransitionStyle {
  const bottom = () => {
    switch (position.y) {
      case "top":
        return `calc(100% - ${size.height}px - ${offsets.top ?? 0}px)`;
      case "bottom":
        return `${offsets.bottom ?? 0}px`;
      case "center":
        return `calc(50% - ${size.height / 2 - (offsets.top ?? 0) + (offsets.bottom ?? 0)}px)`;
    }
  };
  const left = () => {
    switch (position.x) {
      case "left":
        return `${offsets.left ?? 0}px`;
      case "right":
        return `calc(100% - ${size.width}px - ${offsets.right ?? 0}px)`;
      case "center":
        return `calc(50% - ${size.width / 2 - (offsets.right ?? 0) + (offsets.left ?? 0)}px)`;
    }
  };

  return { bottom: bottom(), left: left(), scale: 1, opacity: 1 };
}

function getStyle(
  size: ElementSize,
  stablePosition: RelativePosition,
  state: TransitionState,
  startTransitionKey: TransitionKey,
  endTransitionKey: TransitionKey,
  offsets: Offsets = {},
): TransitionStyle {
  const style: TransitionStyle = getStableStyle(size, stablePosition, offsets);

  switch (state) {
    case "created":
      return {
        ...style,
        ...getStartOrEndStyle(startTransitionKey, size),
        "transition-property": "none",
      };
    case "end":
      return {
        ...style,
        ...getStartOrEndStyle(endTransitionKey, size),
        "transition-property": "bottom,left,scale,opacity",
      };
    default:
      return {
        ...style,
        "transition-property": "bottom,left,scale,opacity",
      };
  }
}

function styleToString(style: TransitionStyle): string {
  return Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

export default function useTransitions(
  element: MaybeRefOrGetter<HTMLElement | undefined | null>,
  stablePosition: RelativePosition,
  size: Size,
  options: UseTransitionsOptions = {},
) {
  const state = ref<TransitionState>("created");
  const startTransitionKey: TransitionKey =
    transitionKeys[Math.floor(Math.random() * transitionKeys.length)]!;
  const endTransitionKey: TransitionKey =
    transitionKeys[Math.floor(Math.random() * transitionKeys.length)]!;

  function startTransition() {
    const _element = toValue(element);

    if (_element && options.onStartTransitionEnd) {
      _element.addEventListener("transitionend", options.onStartTransitionEnd, { once: true });
    }
    state.value = "stable";
  }

  function endTransition() {
    const _element = toValue(element);

    if (_element && options.onEndTransitionEnd) {
      _element.addEventListener("transitionend", options.onEndTransitionEnd, { once: true });
    }
    state.value = "end";
  }

  watchEffect(() => {
    const _element = toValue(element);

    if (_element) {
      const style = getStyle(
        { width: toValue(size.width), height: toValue(size.height) },
        stablePosition,
        state.value,
        startTransitionKey,
        endTransitionKey,
        toValue(options.offsets),
      );
      const styleString = styleToString(style);

      _element.style = styleString;
      if (options.onReady) options.onReady(state.value);
      if (options.immediate && state.value === "created") startTransition();
    }
  });

  return { transitionState: readonly(state), startTransition, endTransition };
}
