<script setup lang="ts">
import type { ThemedProps } from "~/types";
import useTheme from "~/composables/useTheme";

export interface DiagonalBackgroundProps {
  colorDiff?: number;
  softness?: number;
}

interface Props extends ThemedProps, DiagonalBackgroundProps {}

function linearGradient(color: string) {
  const colorStop1 = `${color} ${50 - props.softness}%`;
  const color2 = `oklab(from ${color} calc(l * ${1 + props.colorDiff}) a b)`;
  const colorStop2 = `${color2} ${50 + props.softness}%`;

  return `linear-gradient(to bottom right, ${colorStop1}, ${colorStop2})`;
}

const props = withDefaults(defineProps<Props>(), { colorDiff: -0.1, softness: 2 });
const { backgroundCssVars } = useTheme(toRef(props));

const backgroundImages = computed(() => {
  const bg = backgroundCssVars.value;

  return {
    default: bg ? linearGradient(bg.default) : "none",
    accented: bg ? linearGradient(bg.accented) : "none",
    muted: bg ? linearGradient(bg.muted) : "none",
  };
});

defineOptions({ inheritAttrs: false });
</script>

<template>
  <slot />
</template>

<style scoped lang="scss">
:slotted(.bg-diagonal) {
  background-image: v-bind("backgroundImages.default");

  &.bg-accented-on-active:not(.disabled) {
    &:active, &:hover, &:focus {
      background-image: v-bind("backgroundImages.accented");
    }
  }

  &.bg-muted-on-disabled.disabled {
    background-image: v-bind("backgroundImages.muted");
  }
}
</style>
