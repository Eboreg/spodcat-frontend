<script setup lang="ts">
import type { DiagonalBackgroundProps } from "@/components/ui/DiagonalBackground.vue";
import type { SpodcatIconProps } from "@/components/ui/SpodcatIcon.vue";
import useTheme from "~/composables/useTheme";

interface Props extends Omit<SpodcatIconProps, "icon" | "iconSize">, DiagonalBackgroundProps {
  bgDiagonal?: boolean;
}

const props = withDefaults(defineProps<Props>(), { size: 24 });
const { themeClasses } = useTheme(toRef(props));
</script>

<template>
  <ResponsiveSize :sized-element="element" :size attribute="size">
    <DiagonalBackground v-bind="$props" :color-diff :softness>
      <div class="round-icon border-radius-100" :class="[themeClasses, { 'bg-diagonal': bgDiagonal }]">
        <slot />
      </div>
    </DiagonalBackground>
  </ResponsiveSize>
</template>

<style scoped lang="scss">
.round-icon {
  align-items: center;
  border-style: outset;
  border-width: var(--spod-border-width-sm);
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  overflow: hidden;
}
</style>
