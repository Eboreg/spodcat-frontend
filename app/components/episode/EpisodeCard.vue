<script setup lang="ts">
import { Download, ListMusic, Pause, Play } from "@lucide/vue";
import type { PartialEpisodeModel } from "@/types/api";
import { timeToString } from "@/utils";
import { podcastKey } from "@/symbols";
import useAudioStore from "~/composables/useAudioStore";
import useSeason from "~/composables/useSeason";
import useEpisode from "~/composables/useEpisode";

function onPlayOrPauseClick() {
  const episodeSlug = props.episode?.slug;
  const podcastSlug = podcast?.value?.slug ?? props.episode?.podcast;

  if (isPlaying.value) {
    audio.pause();
  } else if (audio.episode?.id === props.episode?.id) {
    audio.play();
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
const props = defineProps<{
  episode?: PartialEpisodeModel;
  expand: boolean;
}>();
const podcast = inject(podcastKey);
const currentTimestampSnapshot = ref<number>(0);
const podcastSlug = computed(() => podcast?.value?.slug ?? props.episode?.podcast);
const route = computed(() =>
  props.episode && podcastSlug.value
    ? `/${podcastSlug.value}/episode/${props.episode.slug}`
    : undefined,
);
const { season, theme } = useSeason(podcastSlug, () => props.episode?.season);
const isPlaying = computed(() => audio.isPlaying && audio.episode?.id === props.episode?.id);
</script>

<template>
  <ContentCard
    :route="route"
    :expand="expand"
    :content="episode"
    :current-timestamp="currentTimestampSnapshot"
    @share-modal-open="currentTimestampSnapshot = audio.currentTime"
  >
    <template #icon v-if="episode">
      <EpisodeRoundIcon :episode="episode" :podcast="podcast" />
    </template>

    <template #badges>
      <div v-if="season" class="badge" :class="`theme-${theme}`">
        <template v-if="season.name">
          {{
            t("season-number-name", {
              number: season.number,
              name: season.name,
            })
          }}
        </template>
        <template v-else>
          {{ t("season-number", { number: season.number }) }}
        </template>
      </div>
      <div v-if="episode" class="badge theme-tertiary d-none d-sm-block">
        {{ timeToString(episode.duration_seconds) }}
      </div>
    </template>

    <template #head-end v-if="episode">
      <NuxtLink
        v-if="route && episode.has_songs && !expand"
        :title="t('has-tracklist')"
        :to="route"
        class="d-none d-sm-block"
      >
        <SpodcatIcon
          :icon-size="30"
          :icon="ListMusic"
          :size="40"
          :title="t('has-tracklist')"
          class="hover-light hover-border"
          element="button"
          theme="secondary"
        />
      </NuxtLink>

      <SpodcatIcon
        :class="{ 'd-none': !expand }"
        :href="episode.audio_url"
        :icon-size="30"
        :icon="Download"
        :size="40"
        :title="t('download')"
        class="hover-light hover-border d-sm-flex"
        element="a"
        target="_blank"
        theme="primary"
      />

      <SpodcatIcon
        :icon-size="30"
        :icon="isPlaying ? Pause : Play"
        :size="40"
        :theme="isPlaying ? 'info' : 'success'"
        :title="isPlaying ? t('pause') : t('play')"
        @click="onPlayOrPauseClick"
        class="hover-light hover-border"
        element="button"
      />
    </template>

    <slot />
  </ContentCard>
</template>
