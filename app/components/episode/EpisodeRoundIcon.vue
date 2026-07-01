<script setup lang="ts">
import { Podcast } from "@lucide/vue";
import type { PartialEpisodeModel, PodcastModel } from "@/types/api";
import useSeason from "~/composables/useSeason";

const props = defineProps<{
  episode?: PartialEpisodeModel;
  fallbackToCover?: boolean;
  podcast?: PodcastModel;
}>();
const { season, theme } = useSeason(
  () => props.podcast?.slug ?? props.episode?.podcast,
  () => props.episode?.season,
);
const numberString = computed(() => props.episode?.number?.toLocaleString("sv") ?? "");
</script>

<template>
  <RoundIcon :size="{ xs: 35, sm: 38 }" :theme>
    <img v-if="episode?.image_thumbnail" :src="episode.image_thumbnail" alt="" />
    <img v-else-if="season?.image_thumbnail" :src="season.image_thumbnail" alt="" />
    <div v-else-if="numberString" :class="{ small: numberString.length > 3 }">
      {{ numberString }}
    </div>
    <img
      v-else-if="fallbackToCover && podcast?.cover_thumbnail"
      :src="podcast.cover_thumbnail"
      alt=""
    />
    <SpodcatIcon v-else :icon="Podcast" />
  </RoundIcon>
</template>

<style scoped lang="scss">
:deep(.round-icon) {
  font-size: 16px;

  @include minsize(sm) {
    font-size: 20px;

    .small {
      font-size: 16px;
    }
  }
}
</style>
