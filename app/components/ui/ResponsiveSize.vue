<script setup lang="ts">
import type { Component } from "vue";
import type { BreakpointSizesArg } from "~/types";
import useResponsiveSize from "~/composables/useResponsiveSize";

type Attribute = "size" | "font-size";

const props = defineProps<{
  attribute?: Attribute | Attribute[];
  sizedElement?: string | Component;
  size?: BreakpointSizesArg;
}>();
const classes = computed(() => {
  if (typeof props.attribute === "string") return [props.attribute];
  return props.attribute ?? [];
});
const { sizeString } = useResponsiveSize(props.size);
</script>

<template>
  <component :is="sizedElement ?? 'div'" class="responsive-size" :class="classes">
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
