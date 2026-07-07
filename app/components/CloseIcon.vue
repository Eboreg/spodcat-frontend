<script setup lang="ts">
import type { BreakpointSizesArg } from "~/types";
import { X } from "@lucide/vue";

defineProps<{ size?: BreakpointSizesArg }>();

const { t } = useI18n();
</script>

<template>
  <SpodcatIcon
    :icon="X"
    :size="size ?? 20"
    :title="t('close')"
    class="on-press-translate"
    element="button"
    theme="boring"
    theme-variant="light"
    lighten-on-hover
  />
</template>
