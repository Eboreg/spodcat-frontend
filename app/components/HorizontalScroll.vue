<script setup lang="ts">
type Props = {
  duration?: number;
  easing?: string;
  iterations?: number;
};

const props = withDefaults(defineProps<Props>(), {
  duration: 10_000,
  easing: "linear",
  iterations: Infinity,
});
const target = useTemplateRef("target");
const overflow = ref<number>(0);
const keyframes = computed(() => [
  { right: "0px", offset: 0 },
  { right: "0px", offset: 0.25 },
  { right: `${overflow.value}px`, offset: 0.75 },
  { right: `${overflow.value}px`, offset: 1 },
]);
const { play, finish } = useAnimate(target, keyframes, props);

useResizeObserver(target, ([entry]) => {
  if (entry) {
    const _overflow = entry.target.scrollWidth - entry.contentRect.width;
    overflow.value = Math.max(_overflow, 0);
  }
});

watch(overflow, () => {
  if (overflow.value > 0) play();
  else finish();
});
</script>

<template>
  <div class="nowrap outer horizontal-scroll">
    <div class="pos-relative" ref="target">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.outer {
  overflow-x: hidden;
}
</style>
