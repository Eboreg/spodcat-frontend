<script setup lang="ts">
import useResponsiveSize from "~/composables/useResponsiveSize";
import type { BreakpointSizesArg } from "~/types";

type Attribute = "size" | "font-size";

const props = defineProps<{
  attribute?: Attribute | Attribute[];
  element?: string;
  size?: BreakpointSizesArg;
}>();
const attributes = computed(() => {
  if (typeof props.attribute === "string") return [props.attribute];
  return props.attribute ?? [];
});
const { sizeString } = useResponsiveSize(props.size);
</script>

<template>
  <component :is="element ?? 'div'" class="responsive-size" :class="attributes">
    <slot />
  </component>
</template>

<style lang="scss">
.responsive-size {
  display: flex;
}
.responsive-size.size > * {
  height: v-bind(sizeString);
  width: v-bind(sizeString);
}
.responsive-size.font-size > * {
  font-size: v-bind(sizeString);
}
</style>
