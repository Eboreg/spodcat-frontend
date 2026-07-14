<script setup lang="ts">
import type { EpisodeSongModel } from "~/types/api";
import useAudioStore from "~/composables/useAudioStore";
import useEpisode from "~/composables/useEpisode";
import usePodcast from "~/composables/usePodcast";
import useSpodcatHead from "~/composables/useSpodcatHead";
import { podcastSlugKey } from "~/symbols";
import { detectLocale, pling, timeToString } from "~/utils";

function getSongDisplayString(song: EpisodeSongModel): string {
  let result = "";
  const artist = song.artists.map((a) => a.name).join("/");

  if (artist) result += `${artist} – `;
  result += song.title;
  if (song.comment) result += ` (${song.comment})`;

  return result;
}

const route = useRoute();
const podcastSlug = route.params.podcast_slug as string;
const slug = route.params.slug as string;
const { episode } = useEpisode(podcastSlug, slug);
const { t, setLocale } = useI18n();
const { podcast } = usePodcast(podcastSlug);
const audio = useAudioStore();

provide(podcastSlugKey, podcastSlug);
useSpodcatHead({ podcast, episode });

watch([episode, podcast], () => {
  if (episode.value && !audio.isPlaying) audio.setEpisode(episode.value, podcast.value);
}, { immediate: true });

watch(podcast, () => setLocale(detectLocale(podcast.value?.language)), { immediate: true });

watchEffect(() => {
  if (episode.value) pling(`v2/episodes/${episode.value.id}/pling/`);
});
</script>

<template>
  <PodcastMain>
    <PodcastGoToButton />
    <EpisodeCard :episode expand>
      <ContentDescription :content="episode">
        <ClientOnly>
          <div v-if="episode?.has_songs" class="font-size-article">
            <h2>{{ t("songs") }}</h2>
            <div v-for="song in episode.songs" :key="song.id" class="episode-song my-half">
              <span @click="audio.playEpisode(episode, podcast, song.start_time)">
                <span class="text-gray pr-half">
                  {{ timeToString(song.start_time) }}
                </span>
                <span>{{ getSongDisplayString(song) }}</span>
              </span>
            </div>
          </div>
        </ClientOnly>
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
