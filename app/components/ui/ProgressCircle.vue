<script setup lang="ts">
import type { BreakpointSizesArg } from "~/types";

interface Props {
  innerDuration?: string;
  outerDuration?: string;
  size?: BreakpointSizesArg;
  stroke?: string;
  strokeWidth?: string;
}

withDefaults(defineProps<Props>(), {
  innerDuration: "1.5s",
  outerDuration: "2s",
  stroke: "var(--spod-gray-accented)",
  strokeWidth: "8px",
});
</script>

<template>
  <ResponsiveSize :size="size ?? 'initial'" class="progress-circle" attribute="size">
    <svg class="progress-circle-outer" viewBox="25 25 50 50">
      <circle class="progress-circle-stroke" cx="50" cy="50" r="20" fill="none" />
    </svg>
  </ResponsiveSize>
</template>

<style scoped lang="scss">
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes animate-stroke {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}

.progress-circle {
  line-height: 1;
}

.progress-circle-outer {
  animation-duration: v-bind(outerDuration);
  animation-iteration-count: infinite;
  animation-name: rotate;
  animation-timing-function: linear;
}

.progress-circle-stroke {
  animation-duration: v-bind(innerDuration);
  animation-iteration-count: infinite;
  animation-name: animate-stroke;
  animation-timing-function: ease-in-out;
  fill: none;
  stroke-dasharray: 10, 10;
  stroke-linecap: round;
  stroke-width: v-bind(strokeWidth);
  stroke: v-bind(stroke);
}
</style>
