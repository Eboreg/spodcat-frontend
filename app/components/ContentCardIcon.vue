<script setup lang="ts">
import type { LucideIcon } from "@lucide/vue";
import type { ThemeColor } from "~/types";

withDefaults(
  defineProps<{
    icon: string | LucideIcon;
    color: ThemeColor;
    element?: string | Component;
  }>(),
  { element: "button" },
);
</script>

<template>
  <SpodcatIcon
    :color
    :element
    :icon
    :icon-size="30"
    :size="40"
    :text="{ accentedOnActive: true }"
    background="none"
    class="translated-on-press border-on-hover"
  />
</template>
