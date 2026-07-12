<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import type { BreakpointSizesArg, ThemedProps } from "~/types";
import useTheme from "~/composables/useTheme";

interface Props extends ThemedProps {
  bgDiagonal?: boolean;
  disabled?: boolean;
  gridArea?: string;
  icon?: string | LucideIcon;
  iconSize?: BreakpointSizesArg;
  newTab?: boolean;
  size?: BreakpointSizesArg;
  to?: string;
  translatedOnPress?: boolean;
}

function onClick(event: MouseEvent) {
  if (loading.value || props.disabled) {
    event.preventDefault();
  } else {
    if (props.to && !props.newTab) loading.value = true;
    emit("click", event);
  }
}

const props = withDefaults(defineProps<Props>(), {
  accentedOnActive: true,
  mutedOnDisabled: true,
  translatedOnPress: true,
});
const emit = defineEmits<{ click: [MouseEvent] }>();
const loading = shallowRef<boolean>(false);
// const themeProps = computed(() => mergeThemedProps(props.theme, props));
const { themeClasses } = useTheme(toRef(props));

defineOptions({ inheritAttrs: false });
</script>

<template>
  <DiagonalBackground v-bind="$props" :color-diff="-0.05" :softness="0">
    <MaybeLink
      is="button"
      v-bind="$attrs"
      :class="[
        {
          loading,
          disabled,
          'translated-on-press': translatedOnPress,
          'bg-diagonal': bgDiagonal,
        },
        ...themeClasses,
      ]"
      :disabled
      :new-tab
      :to
      class="button"
      @click="onClick"
    >
      <ProgressCircle v-if="icon && loading" :size="iconSize" grayscale />
      <SpodcatIcon v-else-if="icon" :icon :size :icon-size />
      <slot />
    </MaybeLink>
  </DiagonalBackground>
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

  &:not(.disabled, .loading) {
    cursor: pointer;
  }

  &.small {
    font-size: var(--spod-font-size-xs);
    padding: var(--spod-length-quarter) var(--spod-length-half);
  }
}
</style>
