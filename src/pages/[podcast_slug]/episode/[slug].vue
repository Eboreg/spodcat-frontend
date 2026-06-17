<script lang="ts">
import { usePodcast, podcastLoader } from "@/composables/usePodcast";
import { defineColadaLoader } from "vue-router/experimental/pinia-colada";
import { getEpisodeBySlug } from "@/api";

const useEpisode = defineColadaLoader("/[podcast_slug]/episode/[slug]", {
  async query(route, { signal }) {
    return getEpisodeBySlug(route.params.podcast_slug, route.params.slug, signal);
  },
  key: (route) => ["podcast", route.params.podcast_slug, "episode", route.params.slug],
  lazy: true,
  staleTime: 60000,
});

export { useEpisode, usePodcast, podcastLoader };
</script>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { detectLocale } from "@/i18n";
import { timeToString } from "@/utils";
import { ContentDescription } from "@/components";
import { EpisodeCard } from "@/components/episode";
import { GoToPodcastButton, PodcastMain } from "@/components/podcast";
import useAudioStore from "@/composables/useAudioStore";
import type { EpisodeSongModel } from "@/types/api";
import useSpodcatHead from "@/composables/useSpodcatHead";

function getSongDisplayString(song: EpisodeSongModel): string {
  let result = "";
  const artist = song.artists.map((a) => a.name).join("/");

  if (artist) result += `${artist} – `;
  result += song.title;
  if (song.comment) result += ` (${song.comment})`;

  return result;
}

const { t, locale } = useI18n();
const { data: episodeData, isLoading: isEpisodeLoading } = useEpisode();
const { podcast } = usePodcast();
const { setEpisode, playEpisode, isPlaying } = useAudioStore();
const episode = computed(() => (isEpisodeLoading.value ? undefined : episodeData.value));

useSpodcatHead({ podcast, episode });
watchEffect(() => {
  if (episode.value && podcast.value && !isPlaying) setEpisode(episode.value, podcast.value);
  locale.value = detectLocale(podcast.value?.language);
});
</script>

<template>
  <PodcastMain>
    <GoToPodcastButton />
    <EpisodeCard :episode="episode" expand>
      <ContentDescription content-type="episode" :content="episode">
        <div v-if="episode?.has_songs" class="text-article">
          <h2>{{ t("songs") }}</h2>
          <div v-for="song in episode.songs" :key="song.id" class="episode-song my-half">
            <span @click="playEpisode(episode, podcast, song.start_time)">
              <span class="text-boring-light pr-half">{{ timeToString(song.start_time) }}</span>
              <span>{{ getSongDisplayString(song) }}</span>
            </span>
          </div>
        </div>
      </ContentDescription>
    </EpisodeCard>
  </PodcastMain>
</template>

<style scoped lang="scss">
.episode-song {
  line-height: 1.5;

  & > * {
    cursor: pointer;
    display: inline-block;
  }
}
</style>
