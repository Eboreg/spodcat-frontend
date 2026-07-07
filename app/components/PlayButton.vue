<script setup lang="ts">
import type { BreakpointSizesArg, Theme } from "~/types";
import { Pause, Play, TriangleAlert } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";

const props = defineProps<{ size?: BreakpointSizesArg; noTheme?: boolean }>();
const audio = useAudioStore();
const { t } = useI18n();
const theme: ComputedRef<Theme | undefined> = computed(() => {
  if (props.noTheme) return undefined;
  if (audio.isError) return "error";
  if (audio.isPlaying) return "info";
  return "success";
});
const icon = computed(() => {
  if (audio.isError) return TriangleAlert;
  if (audio.isPlaying) return Pause;
  return Play;
});
const title = computed(() => {
  if (audio.isError) return t("something-wrong");
  if (audio.isPlaying) return t("pause");
  return t("play");
});
</script>

<template>
  <SpodcatIcon
    :icon
    :size
    :theme
    :title
    class="p-half on-press-translate"
    element="button"
    lighten-on-hover
    @click="audio.playing = !audio.playing"
  />
</template>
