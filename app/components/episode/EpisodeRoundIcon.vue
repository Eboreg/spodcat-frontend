<script setup lang="ts">
import { Podcast } from "@lucide/vue";
import type { PartialEpisodeModel, PodcastModel } from "@/types/api";

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
      { type: 'image', value: episode?.image_thumbnail ?? undefined },
      { type: 'image', value: season?.image_thumbnail ?? undefined },
      { type: 'text', value: episode?.number?.toLocaleString('sv') },
      {
        type: 'image',
        value: fallbackToCover && podcast?.cover_thumbnail ? podcast.cover_thumbnail : undefined,
      },
      { type: 'icon', value: Podcast },
    ]"
    :theme="theme"
  />
</template>
