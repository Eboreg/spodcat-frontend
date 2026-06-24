<script setup lang="ts">
import { X } from "@lucide/vue";
import type { BreakpointSizesArg } from "~/responsive";

const props = defineProps<{ size?: BreakpointSizesArg }>();
const { t } = useI18n();
</script>

<template>
  <SpodcatIcon
    :icon="X"
    :size="size ?? 20"
    :title="t('close')"
    class="hover-light cursor-pointer"
    theme="boring-inverse"
  />
</template>
