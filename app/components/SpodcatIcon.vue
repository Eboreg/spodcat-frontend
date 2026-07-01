<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import type { BreakpointSizesArg, Theme } from "@/types";

export interface SpodcatIconProps {
  element?: string;
  icon: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  size?: BreakpointSizesArg;
  theme?: Theme;
}

const props = defineProps<SpodcatIconProps>();
const iconName = computed(() => (typeof props.icon === "string" ? props.icon : undefined));
const lucideIcon = computed(() => (typeof props.icon === "function" ? props.icon : undefined));
const themeClass = computed(() => (props.theme ? `text-${props.theme}` : undefined));
const outerSize = computed(() => props.size ?? props.iconSize ?? 24);
const innerSize = computed(() => props.iconSize ?? props.size ?? 24);
const attribute = computed(() => (iconName.value ? "font-size" : "size"));
</script>

<template>
  <ResponsiveSize :class="themeClass" :element :size="outerSize" attribute="size" class="outer">
    <div class="inner">
      <ResponsiveSize :size="innerSize" :attribute>
        <Icon v-if="iconName" :name="iconName" />
        <component v-else-if="lucideIcon" :is="lucideIcon" />
      </ResponsiveSize>
    </div>
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
.hover-border:hover {
  border-radius: 10px;
  border-style: solid;
  border-width: 3px;
  margin: -3px;
}
.hover-border:active {
  margin: -2px -4px -4px -2px;
}
</style>
