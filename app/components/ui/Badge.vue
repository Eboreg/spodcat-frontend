<script setup lang="ts">
import type { CssSizeProps } from "~/composables/useCssSizes";
import type { ThemedProps } from "~/types";
import useCssSizes from "~/composables/useCssSizes";
import useTheme from "~/composables/useTheme";

interface Props extends ThemedProps, CssSizeProps {}

const props = withDefaults(defineProps<Props>(), { borderWidth: "sm", fontSize: "xs", borderRadius: "md" });
const { themeClasses } = useTheme(toRef({ ...props, borderTheme: props.borderTheme ?? props.theme }));
const { sizeClasses } = useCssSizes(toRef(props));
</script>

<template>
  <div class="badge" :class="[...sizeClasses, ...themeClasses]">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.badge {
  border-style: outset;
  font-weight: bold;
  padding: 0 2px;
}
</style>
