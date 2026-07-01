<script setup lang="ts">
import type { BreakpointSizesArg, Theme } from "@/types";
import type { LucideIcon } from "@lucide/vue";

const props = defineProps<{
  disabled?: boolean;
  icon?: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  newTab?: boolean;
  theme?: Theme;
  to?: string;
}>();
const emit = defineEmits<{ click: [MouseEvent] }>();
const isLoading = ref<boolean>(false);
const themeClass = computed(() => (props.theme ? `theme-${props.theme}` : undefined));

function onClick(event: MouseEvent) {
  if (isLoading.value || props.disabled) {
    event.preventDefault();
  } else {
    if (props.to && !props.newTab) isLoading.value = true;
    emit("click", event);
  }
}
</script>

<template>
  <MaybeLink
    :class="[themeClass, { loading: isLoading, disabled: disabled }]"
    :disabled
    :new-tab
    :to
    @click="onClick"
    class="button button-press hover-light border-radius"
    element="button"
  >
    <ProgressCircle v-if="icon && isLoading" class="icon" />
    <SpodcatIcon v-else-if="icon" :icon :size="iconSize" />
    <slot />
  </MaybeLink>
</template>

<style scoped lang="scss">
.button {
  align-items: center;
  border-style: outset;
  border-width: 0 1px 1px 0;
  cursor: pointer;
  display: flex;
  gap: var(--spod-length-half);
  padding: var(--spod-length-single);
  text-decoration: none;

  &.disabled {
    color: var(--spod-text-color-dark) !important;
    cursor: not-allowed !important;
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
