<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import type { BreakpointSizesArg, ThemedProps } from "@/types";
import useTheme from "~/composables/useTheme";

interface Props extends ThemedProps {
  disabled?: boolean;
  gridArea?: string;
  icon?: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  newTab?: boolean;
  size?: BreakpointSizesArg;
  to?: string;
  translateOnPress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  darkenOnDisabled: true,
  lightenOnActive: true,
  lightenOnHover: true,
  translateOnPress: true,
});
const emit = defineEmits<{ click: [MouseEvent] }>();
const loading = shallowRef<boolean>(false);
const { themeClasses } = useTheme(toRef(props));

function onClick(event: MouseEvent) {
  if (loading.value || props.disabled) {
    event.preventDefault();
  } else {
    if (props.to && !props.newTab) loading.value = true;
    emit("click", event);
  }
}
</script>

<template>
  <MaybeLink
    is="button"
    :class="[{ loading, disabled, 'on-press-translate': translateOnPress }, ...themeClasses]"
    :disabled
    :new-tab
    :to
    class="button"
    @click="onClick"
  >
    <ProgressCircle v-if="icon && loading" :size="iconSize" />
    <SpodcatIcon v-else-if="icon" :icon :size :icon-size />
    <slot />
  </MaybeLink>
</template>

<style scoped lang="scss">
.button {
  align-items: center;
  border-radius: var(--spod-border-radius-md);
  border-style: outset;
  border-width: 0 1px 1px 0;
  display: flex;
  gap: var(--spod-length-half);
  grid-area: v-bind(gridArea);
  padding: var(--spod-length-quarter-to);
  text-decoration: none;

  &.disabled {
    cursor: not-allowed;
  }

  &.loading {
    cursor: wait;
  }

  &:not(.disabled):not(.loading) {
    cursor: pointer;
  }

  &.small {
    font-size: var(--spod-font-size-xs);
    padding: var(--spod-length-quarter) var(--spod-length-half);
  }
}
</style>
