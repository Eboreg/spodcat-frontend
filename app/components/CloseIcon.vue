<script setup lang="ts">
import { X } from "@lucide/vue";
import type { BreakpointSizesArg } from "~/responsive";

const { t } = useI18n();

defineProps<{ size?: BreakpointSizesArg }>();
</script>

<template>
  <SpodcatIcon
    :icon="X"
    :size="size ?? 20"
    :title="t('close')"
    class="hover-light"
    theme="boring-inverse"
    element="button"
  />
</template>
