<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import type { Component } from "vue";
import type { BreakpointSizesArg, ThemedProps } from "~/types";
import { Icon } from "#components";
import useTheme from "~/composables/useTheme";

export interface SpodcatIconProps extends ThemedProps {
  element?: string | Component;
  icon: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  size?: BreakpointSizesArg;
}

const props = withDefaults(defineProps<SpodcatIconProps>(), { background: "none", transparent: true });

const iconName = computed(() => (typeof props.icon === "string" ? props.icon : undefined));
const innerSizeAttribute = computed(() => (iconName.value ? "font-size" : "size"));
const outerSize = computed(() => props.size ?? props.iconSize ?? 24);
const innerSize = computed(() => props.iconSize ?? props.size ?? 24);
const { themeClasses } = useTheme(toRef(props));
const iconElement = computed(() => iconName.value ? Icon : props.icon);
</script>

<template>
  <ResponsiveSize :class="themeClasses" :sized-element="element" :size="outerSize" attribute="size">
    <ResponsiveSize
      v-if="innerSize !== outerSize"
      :attribute="innerSizeAttribute"
      :size="innerSize"
    >
      <component :is="iconElement" :name="iconName" />
    </ResponsiveSize>
    <component :is="iconElement" v-else :name="iconName" />
  </ResponsiveSize>
</template>

<style scoped lang="scss">
.responsive-size {
  align-items: center;
  display: flex;
  justify-content: center;
}

.border-on-hover {
  border-radius: var(--spod-border-radius-xl);
  border-style: solid;
  border-width: 3px;
}
</style>
