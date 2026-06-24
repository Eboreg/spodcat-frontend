<script setup lang="ts">
import { Frown } from "@lucide/vue";
import type { PlacedToast } from "@/composables/useMessageStore";
import type { Offsets } from "@/types";

const props = defineProps<{ toast: PlacedToast }>();
const placedToast = reactive(props.toast);
const audio = useAudioStore();
const container = useTemplateRef("container");
const countdownElement = useTemplateRef("countdown");
const messageStore = useMessageStore();

const offsets: ComputedRef<Offsets> = computed(() => ({
  bottom: placedToast.bottomOffset + (audio.episode ? 75 : 10),
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
    onReady: (animate) => (animate.onfinish = endTransition),
  },
);

watch([height, width], ([h, w]) =>
  messageStore.onToastSizeChange(placedToast.id, { width: w, height: h }),
);
</script>

<template>
  <div
    ref="container"
    :class="`toast theme-${placedToast.level}`"
    @mouseenter="if (transitionState !== 'created') pauseAnimation();"
    @mouseleave="playAnimation"
  >
    <SpodcatIcon v-if="icon" :icon="icon" class="toast-icon p-half" :size="30" />
    <div class="toast-text">{{ placedToast.text }}</div>
    <CloseIcon @click="finishAnimation" class="toast-close-icon p-half" />
    <div ref="countdown" :class="`toast-countdown bg-${placedToast.level}-dark`"></div>
  </div>
</template>

<style scoped lang="scss">
.toast {
  align-items: start;
  border-left-width: 0;
  border-radius: var(--spod-border-radius);
  border-style: outset;
  border-top-width: 0;
  display: grid;
  grid-template: "icon text close" "countdown countdown countdown" / auto 1fr auto;
  overflow: hidden;
  padding-top: var(--spod-length-quarter);
  position: fixed;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  width: var(--spod-toast-width);
  z-index: var(--spod-zindex-toast);
}

:deep(.toast-close-icon) {
  grid-area: close;
}

.toast-countdown {
  grid-area: countdown;
  height: 5px;
  width: 0%;
}

:deep(.toast-icon) {
  align-self: center;
  grid-area: icon;
}

.toast-text {
  grid-area: text;
  padding: 11px var(--spod-length-half);
}
</style>
