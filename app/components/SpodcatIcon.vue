<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import type { Theme } from "@/utils";
import type { BreakpointSizesArg } from "~/responsive";

const props = defineProps<{
  icon: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  size?: BreakpointSizesArg;
  theme?: Theme;
  element?: string;
}>();
const themeClass = computed(() => (props.theme ? `text-${props.theme}` : undefined));
const iconName = computed(() => (typeof props.icon === "string" ? props.icon : undefined));
const lucideIcon = computed(() => (typeof props.icon === "function" ? props.icon : undefined));
</script>

<template>
  <ResponsiveSize
    :size="size ?? iconSize ?? 24"
    attribute="size"
    :class="themeClass"
    :element="element"
    class="outer"
  >
    <div class="inner">
      <ResponsiveSize v-if="iconName" :size="iconSize ?? size ?? 24" attribute="font-size">
        <Icon :name="iconName" />
      </ResponsiveSize>
      <ResponsiveSize v-else-if="lucideIcon" :size="iconSize ?? size ?? 24" attribute="size">
        <component :is="lucideIcon" />
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
