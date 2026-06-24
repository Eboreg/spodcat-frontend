<script setup lang="ts">
import { detectLocale, timeToString } from "@/utils";
import type { EpisodeSongModel } from "@/types/api";
import { podcastSlugKey } from "@/symbols";

function getSongDisplayString(song: EpisodeSongModel): string {
  let result = "";
  const artist = song.artists.map((a) => a.name).join("/");

  if (artist) result += `${artist} – `;
  result += song.title;
  if (song.comment) result += ` (${song.comment})`;

  return result;
}

const route = useRoute();
const { episode } = useEpisode(route.params.podcast_slug as string, route.params.slug as string);
const { t, setLocale } = useI18n();
const { podcast } = usePodcast(route.params.podcast_slug as string);
const { setEpisode, playEpisode, isPlaying } = useAudioStore();

provide(podcastSlugKey, route.params.podcast_slug as string);
useSpodcatHead({ podcast, episode });
watchEffect(() => {
  if (episode.value && podcast.value && !isPlaying) setEpisode(episode.value, podcast.value);
  setLocale(detectLocale(podcast.value?.language));
});
</script>

<template>
  <PodcastMain>
    <PodcastGoToButton />
    <EpisodeCard :episode="episode" expand>
      <ContentDescription content-type="episode" :content="episode">
        <ClientOnly>
          <div v-if="episode?.has_songs" class="text-article">
            <h2>{{ t("songs") }}</h2>
            <div v-for="song in episode.songs" :key="song.id" class="episode-song my-half">
              <span @click="playEpisode(episode, podcast, song.start_time)">
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
