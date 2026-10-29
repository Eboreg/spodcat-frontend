<script setup lang="ts">
import type { PartialEpisodeModel, PodcastModel } from "~/types/api";
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
const thumbnail = computed(() => {
  if (props.episode?.image_usage.includes("FRONTEND") && props.episode.image_thumbnail) {
    return props.episode.image_thumbnail;
  }
  return season.value?.image_thumbnail;
});
</script>

<template>
  <RoundIcon :size="{ xs: 35, sm: 38 }" :color="theme" :bg-diagonal class="font-weight-bold">
    <img v-if="thumbnail" :src="thumbnail" alt="">
    <ResponsiveSize
      v-else-if="numberString"
      :size="{ xs: 16, sm: numberString.length <= 3 ? 20 : 16 }"
      attribute="font-size"
    >
      {{ numberString }}
    </ResponsiveSize>
    <img v-else-if="fallbackToCover && podcast?.cover_thumbnail" :src="podcast.cover_thumbnail" alt="">
    <Podcast v-else />
  </RoundIcon>
</template>

<style scoped lang="scss">
img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
