<script setup lang="ts">
import type { BorderWidthSize } from "~/composables/useCssSizes";
import type { Theme } from "~/types";
import useCssSizes from "~/composables/useCssSizes";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ borderWidth?: BorderWidthSize; theme?: Theme }>(), {
  borderWidth: "sm",
  theme: "primary",
});
const themeCssColor = computed(() => `var(--spod-color-${props.theme}-normal)`);
const themeDarkCssColor = computed(() => `var(--spod-color-${props.theme}-dark)`);
const { borderWidthClass } = useCssSizes(toRef(props));
</script>

<template>
  <div class="popup-container">
    <div class="popup column bg-opaque border-radius-md" v-bind="$attrs" :class="[borderWidthClass]">
      <slot />
    </div>
    <div class="arrow bg-opaque dark" :class="[`border-${theme}`, borderWidthClass]" />
  </div>
</template>

<style scoped lang="scss">
.arrow {
  border-top-width: 0 !important;
  border-left-width: 0 !important;
  bottom: -6px;
  height: 10px;
  position: absolute;
  right: 20px;
  transform: rotate(45deg);
  width: 10px;
}

.popup {
  border-color: v-bind(themeCssColor);
  border-bottom-color: v-bind(themeDarkCssColor);
  border-right-color: v-bind(themeDarkCssColor);
  box-shadow: 0 2px 5px black;
}

.popup-container {
  bottom: calc(100% + var(--spod-length-half));
  position: absolute;
  right: 0;
}

:deep(.popup-header) {
  border-bottom: 1px solid v-bind(themeCssColor);
  padding: var(--spod-length-half) var(--spod-length-single);
}
</style>
