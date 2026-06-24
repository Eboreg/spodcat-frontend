<script setup lang="ts">
import type { Theme } from "@/utils";
import { computed, ref } from "vue";

import ButtonContent from "./ButtonContent.vue";

const props = defineProps<{
  route?: string;
  disabled?: boolean;
  materialIcon?: string;
  href?: string;
  newTab?: boolean;
  theme?: Theme;
}>();
const emit = defineEmits<{ click: [MouseEvent] }>();
const isLoading = ref<boolean>(false);
const classes = computed(() => {
  const ret: string[] = ["button", "hover-light"];

  if (props.theme) ret.push(`theme-${props.theme}`);
  if (isLoading.value) ret.push("loading");
  if (props.disabled) ret.push("disabled");
  return ret;
});

function onClick(event: MouseEvent) {
  if (isLoading.value || props.disabled) {
    event.preventDefault();
  } else {
    if (props.href && !props.newTab) isLoading.value = true;
    emit("click", event);
  }
}
</script>

<template>
  <RouterLink v-if="route" :to="route" :class="[classes, $attrs.class]" @click="onClick">
    <ButtonContent :loading="isLoading" :material-icon="materialIcon"><slot /></ButtonContent>
  </RouterLink>
  <a
    v-else
    :href="href"
    :target="newTab ? '_blank' : '_self'"
    :class="[classes, $attrs.class]"
    :rel="newTab ? 'noopener noreferrer' : ''"
    @click="onClick"
  >
    <ButtonContent :loading="isLoading" :material-icon="materialIcon"><slot /></ButtonContent>
  </a>
</template>

<style scoped lang="scss">
.button {
  align-items: center;
  border-radius: var(--spod-border-radius);
  border-style: outset;
  border-width: 0;
  cursor: pointer;
  display: flex;
  gap: var(--spod-length-half);
  padding: var(--spod-length-half);
  text-decoration: none;

  &:active:not(.loading):not(.disabled) {
    border-style: inset;
    left: 1px;
    top: 1px;
  }

  &.disabled {
    color: var(--spod-text-color-dark) !important;
    cursor: not-allowed !important;
  }

  &.inactive {
    color: var(--spod-text-color-dark) !important;
  }

  &.loading {
    color: lightgray !important;
    cursor: wait !important;
  }

  :deep(.icon) {
    font-size: 20px;
    height: 20px;
    width: 20px;
  }

  &.small {
    font-size: var(--spod-font-size-xs);
    padding: var(--spod-length-quarter) var(--spod-length-half);

    :deep(.icon) {
      font-size: 16px;
      height: 16px;
      width: 16px;
    }
  }
}
</style>
