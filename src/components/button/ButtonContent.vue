<script setup lang="ts">
import { MaterialSymbol, ProgressCircle } from "@/components";

const props = defineProps<{
  loading: boolean;
  materialIcon?: string;
}>();
</script>

<template>
  <ProgressCircle v-if="materialIcon && loading" class="icon" />
  <MaterialSymbol v-else-if="materialIcon" :icon="materialIcon" />
  <slot />
</template>
