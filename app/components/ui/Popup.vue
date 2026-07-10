<script setup lang="ts">
import type { BorderWidth, ThemeColor } from "~/types";

const props = withDefaults(defineProps<{ theme?: ThemeColor, borderWidth?: BorderWidth }>(), {
  borderWidth: "sm",
  theme: "primary",
});
const borderColor = computed(() => `var(--spod-${props.theme})`);
const borderColorMuted = computed(() => `var(--spod-${props.theme}-muted)`);
const borderWidth = computed(() => `var(--spod-border-width-${props.borderWidth})`);

defineOptions({ inheritAttrs: false });
</script>

<template>
  <div class="popup-container">
    <div class="popup column bg-opaque" v-bind="$attrs">
      <slot />
    </div>
    <div class="arrow bg-opaque border-muted" :class="[`border-${theme}`]" />
  </div>
</template>

<style scoped lang="scss">
.arrow {
  border-style: solid;
  border-width: 0 v-bind(borderWidth) v-bind(borderWidth) 0;
  bottom: -6px;
  height: 10px;
  position: absolute;
  right: 18px;
  transform: rotate(45deg);
  width: 10px;
}

.popup {
  border-color: v-bind(borderColor);
  border-bottom-color: v-bind(borderColorMuted);
  border-radius: var(--spod-border-radius-md);
  border-right-color: v-bind(borderColorMuted);
  border-style: solid;
  border-width: v-bind(borderWidth);
  box-shadow: 0 2px 5px black;
}

.popup-container {
  bottom: calc(100% + var(--spod-length-half));
  position: absolute;
  right: 0;
}
</style>
