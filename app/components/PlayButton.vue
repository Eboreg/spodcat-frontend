<script setup lang="ts">
import type { BreakpointSizesArg, ThemeColor } from "~/types";
import { Pause, Play, TriangleAlert } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";

const audio = useAudioStore();
const { t } = useI18n();

const props = defineProps<{
  size?: BreakpointSizesArg;
  noTheme?: boolean;
  iconSize?: BreakpointSizesArg;
}>();

const color: ComputedRef<ThemeColor | undefined> = computed(() => {
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
  <Button
    :icon
    :icon-size
    :size
    :color
    :title
    class="translated-on-press"
    @click="audio.playing = !audio.playing"
  />
</template>
