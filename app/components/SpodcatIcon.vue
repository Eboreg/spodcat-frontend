<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import type { Component } from "vue";
import type { BreakpointSizesArg, ThemedProps } from "@/types";
import useTheme from "~/composables/useTheme";

export interface SpodcatIconProps extends ThemedProps {
  element?: string | Component;
  icon: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  size?: BreakpointSizesArg;
}

const props = withDefaults(defineProps<SpodcatIconProps>(), { transparent: true });
const iconName = computed(() => (typeof props.icon === "string" ? props.icon : undefined));
const lucideIcon = computed(() => (typeof props.icon === "function" ? props.icon : undefined));
const attribute = computed(() => (iconName.value ? "font-size" : "size"));
const outerSize = computed(() => props.size ?? props.iconSize ?? 24);
const innerSize = computed(() => props.iconSize ?? props.size ?? 24);
const { themeClasses } = useTheme(toRef(props));
</script>

<template>
  <ResponsiveSize :class="themeClasses" :sized-element="element" :size="outerSize" attribute="size" class="outer">
    <div v-if="innerSize !== outerSize" class="inner">
      <ResponsiveSize :size="innerSize" :attribute>
        <Icon v-if="iconName" :name="iconName" />
        <component :is="lucideIcon" v-else-if="lucideIcon" />
      </ResponsiveSize>
    </div>
    <template v-else>
      <Icon v-if="iconName" :name="iconName" />
      <component :is="lucideIcon" v-else-if="lucideIcon" />
    </template>
  </ResponsiveSize>
</template>

<style scoped lang="scss">
button.outer {
  border: none;
  background-color: initial;
  padding: 0;
  padding-inline: 0;
}
.inner {
  align-items: center;
  display: flex;
  justify-content: center;
}
.on-hover-border:hover {
  border-radius: var(--spod-border-radius-xl);
  border-style: solid;
  border-width: 3px;
  margin: -3px;
}
.on-hover-border:active {
  margin: -2px -4px -4px -2px;
}
</style>
