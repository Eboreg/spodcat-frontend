<script setup lang="ts">
import type { Component } from "vue";
import type { BreakpointSizesArg } from "~/types";
import useResponsiveSize from "~/composables/useResponsiveSize";

type Attribute = "size" | "font-size";

const props = withDefaults(
  defineProps<{
    attribute?: Attribute | Attribute[];
    sizedElement?: string | Component;
    size?: BreakpointSizesArg;
  }>(),
  { sizedElement: "div", attribute: () => [] },
);

const { height, width } = useResponsiveSize(props.size);
</script>

<template>
  <component :is="sizedElement" class="responsive-size d-flex" :class="attribute">
    <slot />
  </component>
</template>

<style scoped lang="scss">
// Yes, both are needed (the one on .size mostly for nested ResponsiveSize:s
// or ones without child elements).
.responsive-size.size,
.responsive-size.size > * {
  height: v-bind(height);
  width: v-bind(width);
}

.responsive-size.font-size,
.responsive-size.font-size > * {
  font-size: v-bind(height);
}
</style>
