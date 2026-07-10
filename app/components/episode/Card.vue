<script setup lang="ts">
import type { PartialEpisodeModel } from "@/types/api";
import { Download, ListMusic, Pause, Play } from "@lucide/vue";
import { NuxtLink } from "#components";
import { podcastKey } from "@/symbols";
import { timeToString } from "@/utils";
import useAudioStore from "~/composables/useAudioStore";
import useEpisode from "~/composables/useEpisode";
import useSeason from "~/composables/useSeason";

const props = defineProps<{ episode?: PartialEpisodeModel; expand?: boolean }>();

function onPlayOrPauseClick() {
  const episodeSlug = props.episode?.slug;
  const podcastSlug = podcast?.value?.slug ?? props.episode?.podcast;

  if (isPlaying.value) {
    audio.playing = false;
  } else if (audio.episode?.id === props.episode?.id) {
    audio.playing = true;
  } else if (podcastSlug && episodeSlug) {
    useEpisode(podcastSlug, episodeSlug)
      .refresh()
      .then((state) => {
        if (state.data) audio.playEpisode(state.data, podcast?.value);
      });
  }
}

const { t } = useI18n();
const audio = useAudioStore();
const podcast = inject(podcastKey);
const currentTimestamp = shallowRef<number>(0);
const podcastSlug = computed(() => podcast?.value?.slug ?? props.episode?.podcast);
const route = computed(() =>
  props.episode && podcastSlug.value ? `/${podcastSlug.value}/episode/${props.episode.slug}` : undefined,
);
const { season, theme } = useSeason(podcastSlug, () => props.episode?.season);
const isPlaying = computed(() => audio.isPlaying && audio.episode?.id === props.episode?.id);
</script>

<template>
  <ContentCard
    :content="episode"
    :current-timestamp
    :expand
    :route
    @share-modal-open="currentTimestamp = audio.currentTime"
  >
    <template v-if="episode" #icon>
      <EpisodeRoundIcon :episode :podcast class="content-round-icon" bg-diagonal />
    </template>

    <template #badges>
      <Themed v-if="season" :color="theme" class="badge">
        <template v-if="season.name">
          {{
            t("season-number-name", {
              name: season.name,
              number: season.number,
            })
          }}
        </template>
        <template v-else>
          {{ t("season-number", { number: season.number }) }}
        </template>
      </Themed>
      <Themed v-if="episode" color="tertiary" class="badge d-none d-sm-block">
        {{ timeToString(episode.duration_seconds) }}
      </Themed>
    </template>

    <template v-if="episode" #head-end>
      <ContentCardIcon
        v-if="route && episode.has_songs && !expand"
        :element="NuxtLink"
        :icon="ListMusic"
        :title="t('has-tracklist')"
        :to="route"
        class="d-none d-sm-flex"
        color="secondary"
      />

      <ContentCardIcon
        :class="{ 'd-none': !expand }"
        :element="NuxtLink"
        :icon="Download"
        :title="t('download')"
        :to="episode.audio_url"
        class="d-sm-flex"
        color="primary"
        target="_blank"
      />

      <ContentCardIcon
        :icon="isPlaying ? Pause : Play"
        :color="isPlaying ? 'info' : 'success'"
        :title="isPlaying ? t('pause') : t('play')"
        @click="onPlayOrPauseClick"
      />
    </template>

    <slot />
  </ContentCard>
</template>
