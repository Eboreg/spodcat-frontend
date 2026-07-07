<script setup lang="ts">
import type { BreakpointSizesArg } from "~/types";
import { Volume, Volume1, Volume2, VolumeX } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";

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
    class="p-half on-press-translate"
    element="button"
    theme="boring"
    theme-variant="light"
    lighten-on-hover
  />
</template>
