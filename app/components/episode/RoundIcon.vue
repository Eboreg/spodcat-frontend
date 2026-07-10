<script setup lang="ts">
import type { PartialEpisodeModel, PodcastModel } from "@/types/api";
import { Podcast } from "@lucide/vue";
import useSeason from "~/composables/useSeason";

const props = withDefaults(
  defineProps<{
    bgDiagonal?: boolean;
    episode?: PartialEpisodeModel;
    fallbackToCover?: boolean;
    podcast?: PodcastModel;
  }>(),
  { bgDiagonal: true },
);
const { season, theme } = useSeason(
  () => props.podcast?.slug ?? props.episode?.podcast,
  () => props.episode?.season,
);
const numberString = computed(() => props.episode?.number?.toLocaleString("sv") ?? "");
</script>

<template>
  <RoundIcon :size="{ xs: 35, sm: 38 }" :color="theme" :bg-diagonal class="font-weight-bold">
    <img v-if="episode?.image_thumbnail" :src="episode.image_thumbnail" alt="">
    <img v-else-if="season?.image_thumbnail" :src="season.image_thumbnail" alt="">
    <ResponsiveSize
      v-else-if="numberString"
      attribute="font-size"
      :size="{ xs: 16, sm: numberString.length <= 3 ? 20 : 16 }"
    >
      {{ numberString }}
    </ResponsiveSize>
    <img v-else-if="fallbackToCover && podcast?.cover_thumbnail" :src="podcast.cover_thumbnail" alt="">
    <Podcast v-else />
  </RoundIcon>
</template>
