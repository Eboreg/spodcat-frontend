<script setup lang="ts">
import type { PlacedToast } from "~/composables/useMessageStore";
import type { Offsets } from "~/types";
import { Frown } from "@lucide/vue";
import useMessageStore from "~/composables/useMessageStore";
import useTheme from "~/composables/useTheme";
import useTransitions from "~/composables/useTransitions";

const props = defineProps<{ toast: PlacedToast }>();
const placedToast = reactive(props.toast);
const container = useTemplateRef("container");
const countdownElement = useTemplateRef("countdown");
const messageStore = useMessageStore();
const isAnimationActive = computed(() => placedToast.timeout > 0);
const { themeClasses } = useTheme({ color: placedToast.level });

const offsets: ComputedRef<Offsets> = computed(() => ({
  bottom: placedToast.bottomOffset + 10,
}));

const { width, height } = useElementSize(container, {
  width: Math.min(802, document.body.clientWidth - 20),
  height: 71,
});

const { endTransition, transitionState } = useTransitions(
  container,
  { x: "center", y: "bottom" },
  { width, height },
  {
    offsets,
    immediate: true,
    onEndTransitionEnd: () => messageStore.removeToast(placedToast.id),
  },
);

const icon = computed(() => {
  if (placedToast.icon === undefined && placedToast.level === "error") return Frown;
  return placedToast.icon;
});

const {
  play: playAnimation,
  pause: pauseAnimation,
  finish: finishAnimation,
} = useAnimate(
  countdownElement,
  { width: ["100%", "0%"] },
  {
    duration: placedToast.timeout,
    immediate: isAnimationActive.value,
    onReady: (animate) => (animate.onfinish = endTransition),
  },
);

watch([height, width], ([h, w]) => messageStore.onToastSizeChange(placedToast.id, { width: w, height: h }));
</script>

<template>
  <div
    ref="container"
    :class="themeClasses"
    class="toast column border-radius-md border-outset"
    @mouseenter="if (transitionState !== 'created' && isAnimationActive) pauseAnimation();"
    @mouseleave="if (isAnimationActive) playAnimation();"
  >
    <div class="row gap-single px-single py-half">
      <SpodcatIcon v-if="icon" :icon class="toast-icon" :size="30" />
      <div class="fill" v-html="placedToast.text" />
      <CloseIcon @click="finishAnimation" />
    </div>
    <div ref="countdown" :class="`toast-countdown bg-${placedToast.level} bg-muted`" />
  </div>
</template>

<style scoped lang="scss">
.toast {
  border-left-width: 0;
  border-top-width: 0;
  overflow: hidden;
  padding-top: 5px;
  position: absolute;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  width: var(--spod-toast-width);
  z-index: var(--spod-zindex-toast);
}

.toast-countdown {
  height: 5px;
  width: 0%;
}

.toast-icon {
  align-self: center;
}
</style>
