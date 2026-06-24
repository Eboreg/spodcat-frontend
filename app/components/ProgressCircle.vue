<script setup lang="ts">
const props = defineProps<{
  innerDuration?: number;
  outerDuration?: number;
  size?: number;
  strokeWidth?: number;
}>();
const innerDuration = computed(() => `${props.innerDuration ?? 1.5}s`);
const outerDuration = computed(() => `${props.outerDuration ?? 2}s`);
const size = computed(() => (props.size ? `${props.size}px` : "initial"));
const strokeWidth = computed(() => `${props.strokeWidth ?? 8}px`);
</script>

<template>
  <div class="progress-circle">
    <svg class="progress-circle-outer" viewBox="25 25 50 50">
      <circle class="progress-circle-stroke" cx="50" cy="50" r="20" fill="none"></circle>
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

.progress-circle {
  height: v-bind(size);
  line-height: 1;
  width: v-bind(size);
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
  stroke: var(--spod-theme-boring-inverse-normal);
}
</style>
