<script setup lang="ts">
import type { SpodcatIconProps } from "./SpodcatIcon.vue";

interface Props extends Omit<SpodcatIconProps, "icon" | "iconSize"> {}

defineProps<Props>();
</script>

<template>
  <ResponsiveSize :element :size="size ?? 24" attribute="size">
    <div class="round-icon" :class="`theme-${theme ?? 'primary'}`">
      <slot />
    </div>
  </ResponsiveSize>
</template>

<style scoped lang="scss">
.round-icon {
  align-items: center;
  border-radius: 100%;
  border-style: outset;
  display: flex;
  flex: 0 0 auto;
  font-weight: bold;
  justify-content: center;
  overflow: hidden;
}
</style>
