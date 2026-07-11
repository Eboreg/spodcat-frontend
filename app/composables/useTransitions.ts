import type { ElementSize, MaybeComputedElementRef } from "@vueuse/core";
import type * as CSS from "csstype";
import type { Offsets, RelativePosition } from "~/types";

interface Size {
  height: MaybeRefOrGetter<number>;
  width: MaybeRefOrGetter<number>;
}

interface TransitionStyle extends CSS.PropertiesHyphen {
  "transition-property"?: string;
  bottom?: string;
  left?: string;
  opacity?: number;
  scale?: number;
}

interface UseTransitionsOptions {
  immediate?: boolean;
  offsets?: MaybeRefOrGetter<Offsets>;
  onEndTransitionEnd?: () => void;
  onReady?: (state: TransitionState) => void;
  onStartTransitionEnd?: () => void;
}

const TRANSISION_KEYS = ["top", "right", "bottom", "left", "size0x", "size100x"] as const;

type TransitionKey = (typeof TRANSISION_KEYS)[number];

type TransitionState = "created" | "stable" | "end";

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
  const style = getStableStyle(size, stablePosition, offsets);

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

function applyStyle(element: HTMLElement | SVGElement, style: TransitionStyle) {
  Object.entries(style).forEach(([k, v]) => {
    element.style.setProperty(k, v);
  });
}

export default function useTransitions(
  element: MaybeComputedElementRef,
  stablePosition: RelativePosition,
  size: Size,
  { immediate, onReady, onEndTransitionEnd, onStartTransitionEnd, offsets }: UseTransitionsOptions = {},
) {
  const state = shallowRef<TransitionState>("created");
  const startTransitionKey: TransitionKey
    = TRANSISION_KEYS[Math.floor(Math.random() * TRANSISION_KEYS.length)]!;
  const endTransitionKey: TransitionKey
    = TRANSISION_KEYS[Math.floor(Math.random() * TRANSISION_KEYS.length)]!;

  function startTransition() {
    if (onStartTransitionEnd) {
      unrefElement(element)?.addEventListener("transitionend", onStartTransitionEnd, { once: true });
    }
    state.value = "stable";
  }

  function endTransition() {
    if (onEndTransitionEnd) {
      unrefElement(element)?.addEventListener("transitionend", onEndTransitionEnd, { once: true });
    }
    state.value = "end";
  }

  watchEffect(() => {
    const _element = unrefElement(element);

    if (_element) {
      const style = getStyle(
        { width: toValue(size.width), height: toValue(size.height) },
        stablePosition,
        state.value,
        startTransitionKey,
        endTransitionKey,
        toValue(offsets),
      );

      applyStyle(_element, style);

      if (state.value === "created") {
        if (onReady) onReady(state.value);
        if (immediate) startTransition();
      }
    }
  });

  watch(state, () => {
    if (onReady) onReady(state.value);
  });

  return { transitionState: readonly(state), startTransition, endTransition };
}
