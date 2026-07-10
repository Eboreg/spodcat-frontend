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
    accented-on-active
    class="translated-on-press"
    color-variant="accented"
    color="gray"
    element="button"
  />
</template>
