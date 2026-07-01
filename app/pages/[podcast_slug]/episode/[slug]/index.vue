<script setup lang="ts">
import { detectLocale, ping, timeToString } from "@/utils";
import type { EpisodeSongModel } from "@/types/api";
import { podcastSlugKey } from "@/symbols";
import useAudioStore from "~/composables/useAudioStore";
import useSpodcatHead from "~/composables/useSpodcatHead";
import useEpisode from "~/composables/useEpisode";
import usePodcast from "~/composables/usePodcast";

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

watchEffect(() => {
  if (episode.value && podcast.value && !audio.isPlaying)
    audio.setEpisode(episode.value, podcast.value);
});

watchEffect(() => {
  setLocale(detectLocale(podcast.value?.language));
});

watchEffect(() => {
  if (episode.value) ping(`v2/episodes/${episode.value.id}/ping/`);
});
</script>

<template>
  <PodcastMain>
    <PodcastGoToButton />
    <EpisodeCard :episode expand>
      <ContentDescription :content="episode">
        <ClientOnly>
          <div v-if="episode?.has_songs" class="text-article">
            <h2>{{ t("songs") }}</h2>
            <div v-for="song in episode.songs" :key="song.id" class="episode-song my-half">
              <span @click="audio.playEpisode(episode, podcast, song.start_time)">
                <span class="text-boring-inverse-dark pr-half">
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
