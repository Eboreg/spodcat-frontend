<script setup lang="ts">
import { Volume, Volume1, Volume2, VolumeX } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";
import type { BreakpointSizesArg } from "~/responsive";

const audio = useAudioStore();
const icon = computed(() => {
  if (audio.isMuted) return VolumeX;
  if (audio.volume < 1 / 3) return Volume;
  if (audio.volume < 2 / 3) return Volume1;
  return Volume2;
});
const props = defineProps<{ size?: BreakpointSizesArg }>();
</script>

<template>
  <SpodcatIcon
    :icon="icon"
    :size="size"
    class="hover-light p-half"
    theme="boring-inverse"
    element="button"
  />
</template>
