<script setup lang="ts">
import type { SpodcatIconProps } from "./SpodcatIcon.vue";
import useTheme from "~/composables/useTheme";

interface Props extends Omit<SpodcatIconProps, "icon" | "iconSize"> {}

const props = defineProps<Props>();
const { themeClasses } = useTheme(toRef(props));
</script>

<template>
  <ResponsiveSize :sized-element="element" :size="size ?? 24" attribute="size">
    <div class="round-icon border-sm border-radius-100" :class="themeClasses">
      <slot />
    </div>
  </ResponsiveSize>
</template>

<style scoped lang="scss">
.round-icon {
  align-items: center;
  border-style: outset;
  display: flex;
  flex: 0 0 auto;
  font-weight: bold;
  justify-content: center;
  overflow: hidden;
}
</style>
