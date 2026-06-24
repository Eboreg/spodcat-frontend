<script setup lang="ts">
import { type LucideIcon } from "@lucide/vue";
import type { Theme } from "@/utils";
import type { BreakpointSizesArg } from "~/responsive";

const props = defineProps<{
  icon: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  size?: BreakpointSizesArg;
  theme?: Theme;
}>();
const themeClass = computed(() => (props.theme ? `text-${props.theme}` : undefined));
const iconName = computed(() => (typeof props.icon === "string" ? props.icon : undefined));
const lucideIcon = computed(() => (typeof props.icon === "function" ? props.icon : undefined));

defineOptions({ inheritAttrs: false });
</script>

<template>
  <ResponsiveSize :size="size ?? iconSize ?? 24" attribute="size">
    <div class="container" v-bind="$attrs" :class="themeClass">
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
.container {
  align-items: center;
  display: flex;
  justify-content: center;
}
.container.hover-border:hover {
  border-radius: 10px;
  border-style: solid;
  border-width: 3px;
  margin: -3px;
}
.container.hover-border:active {
  margin: -2px -4px -4px -2px;
}
</style>
