<script setup lang="ts">
const props = defineProps<{
  outerDuration?: number;
  innerDuration?: number;
  strokeWidth?: number;
}>();
</script>

<template>
  <div class="loader">
    <svg
      class="progress-circle"
      viewBox="25 25 50 50"
      :style="`animation-duration: ${outerDuration ?? 2}s`"
    >
      <circle
        class="circle"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        :style="`animation-duration: ${innerDuration ?? 1.5}s; stroke-width: ${strokeWidth ?? 8}px`"
      ></circle>
    </svg>
  </div>
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

.loader {
  aspect-ratio: 1/1;
  line-height: 1;

  .progress-circle {
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-name: rotate;
    padding: var(--spod-length-quarter);

    .circle {
      stroke-dasharray: 10, 10;
      animation-name: animate-stroke;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      fill: none;
      stroke: var(--spod-text-color);
      stroke-linecap: round;
    }
  }

  &.primary .circle {
    stroke: get-color("primary") !important;
  }
  &.secondary .circle {
    stroke: get-color("secondary") !important;
  }
  &.tertiary .circle {
    stroke: get-color("tertiary") !important;
  }
}
</style>
