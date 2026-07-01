<script setup lang="ts">
import { Volume, Volume1, Volume2, VolumeX } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";
import type { BreakpointSizesArg } from "~/types";

const audio = useAudioStore();
const icon = computed(() => {
  if (audio.muted) return VolumeX;
  if (audio.volume < 1 / 3) return Volume;
  if (audio.volume < 2 / 3) return Volume1;
  return Volume2;
});

defineProps<{ size?: BreakpointSizesArg }>();
</script>

<template>
  <SpodcatIcon
    :icon
    :size
    class="hover-light p-half button-press"
    element="button"
    theme="boring-inverse"
  />
</template>
