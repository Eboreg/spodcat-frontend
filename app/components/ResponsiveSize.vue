<script setup lang="ts">
import { type BreakpointSizesArg } from "~/responsive";

type Attribute = "size" | "font-size";

const props = defineProps<{ attribute?: Attribute | Attribute[]; size?: BreakpointSizesArg }>();
const attributes = computed(() => {
  if (typeof props.attribute === "string") return [props.attribute];
  return props.attribute ?? [];
});
const { sizeString } = useResponsiveSize(props.size);
</script>

<template>
  <div class="responsive-size d-flex" :class="attributes">
    <slot />
  </div>
</template>

<style lang="scss">
.responsive-size.size > * {
  height: v-bind(sizeString);
  width: v-bind(sizeString);
}
.responsive-size.font-size > * {
  font-size: v-bind(sizeString);
}
</style>
