<script setup lang="ts">
import type { BreakpointSizesArg } from "~/types";

withDefaults(defineProps<{ size?: BreakpointSizesArg }>(), { size: "initial" });
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
    background-color: var(--spod-secondary);
  }
}

.progress-circle {
  animation: color-shift 1s ease-in-out infinite alternate, rotate 3s linear infinite normal;
  background-color: var(--spod-primary);
  border-radius: 100%;
  mask: radial-gradient(circle at 25% 25%, black 0, transparent 70%);
}
</style>
