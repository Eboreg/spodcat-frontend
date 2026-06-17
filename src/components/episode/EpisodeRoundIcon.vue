<script setup lang="ts">
import type { PartialEpisodeModel, PodcastModel } from "@/types/api";
import { RoundIcon } from "@/components";
import useSeason from "@/composables/useSeason";

const props = defineProps<{
  podcast?: PodcastModel;
  episode?: PartialEpisodeModel;
  fallbackToCover?: boolean;
}>();
const { season, theme } = useSeason(
  () => props.podcast?.slug ?? props.episode?.podcast,
  () => props.episode?.season,
);
</script>

<template>
  <RoundIcon
    :data="[
      { type: 'image', value: episode?.image_thumbnail },
      { type: 'image', value: season?.image_thumbnail },
      { type: 'text', value: episode?.number?.toLocaleString('sv') },
      { type: 'image', value: fallbackToCover ? podcast?.cover_thumbnail : undefined },
      { type: 'material-symbol', value: 'podcasts' },
    ]"
    :theme="theme"
  />
</template>
