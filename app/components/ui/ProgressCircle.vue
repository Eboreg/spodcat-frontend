<script setup lang="ts">
import type { BreakpointSizesArg } from "~/types";

const props = withDefaults(defineProps<{ size?: BreakpointSizesArg; grayscale?: boolean }>(), { size: "initial" });
const color1 = computed(() => (props.grayscale ? "var(--spod-text-color)" : "var(--spod-primary)"));
const color2 = computed(() =>
  props.grayscale ? "rgb(from var(--spod-text-color) r g b / 50%)" : "var(--spod-secondary)",
);
</script>

<template>
  <ResponsiveSize :size class="progress-circle" attribute="size" />
</template>

<style scoped lang="scss">
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes color-shift {
  100% {
    background-color: v-bind(color2);
  }
}

.progress-circle {
  animation:
    color-shift 1s ease-in-out infinite alternate,
    rotate 3s linear infinite normal;
  background-color: v-bind(color1);
  border-radius: 100%;
  box-sizing: border-box;
  mask: radial-gradient(circle at 25% 25%, black 0, transparent 70%);
}
</style>
