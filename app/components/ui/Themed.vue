<script setup lang="ts">
import type { ThemedProps } from "~/types";
import useTheme from "~/composables/useTheme";

interface Props extends ThemedProps {
  is?: string | Component;
}

const props = withDefaults(defineProps<Props>(), { is: "div" });
const { themeClasses } = useTheme(toRef(props));
</script>

<template>
  <component :is :class="themeClasses">
    <slot />
  </component>
</template>
