<script setup lang="ts">
import type { Theme } from "@/utils";
import type { LucideIcon } from "@lucide/vue";
import type { BreakpointSizesArg } from "~/responsive";

const props = defineProps<{
  disabled?: boolean;
  href?: string;
  icon?: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  newTab?: boolean;
  route?: string;
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
  <MaybeLink
    :class="classes"
    :disabled="disabled"
    :href="href"
    :new-tab="newTab"
    :route="route"
    @click="onClick"
  >
    <ProgressCircle v-if="icon && isLoading" class="icon" />
    <SpodcatIcon v-else-if="icon" :icon="icon" :size="iconSize" />
    <slot />
  </MaybeLink>
</template>

<style scoped lang="scss">
.button {
  align-items: center;
  border-radius: var(--spod-border-radius);
  border-style: outset;
  border-width: 0 1px 1px 0;
  cursor: pointer;
  display: flex;
  gap: var(--spod-length-half);
  padding: var(--spod-length-half);
  text-decoration: none;

  &:active:not(.loading):not(.disabled) {
    border-style: inset;
    translate: 1px 1px;
  }

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
