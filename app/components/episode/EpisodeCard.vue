<script setup lang="ts">
import type { PartialEpisodeModel } from "@/types/api";
import { Download, ListMusic, Pause, Play } from "@lucide/vue";
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
      <EpisodeRoundIcon :episode :podcast class="content-round-icon" />
    </template>

    <template #badges>
      <Badge v-if="season" :theme>
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
      </Badge>
      <Badge v-if="episode" theme="tertiary" class="d-none d-sm-block">
        {{ timeToString(episode.duration_seconds) }}
      </Badge>
    </template>

    <template v-if="episode" #head-end>
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
          class="on-hover-border"
          element="button"
          text-theme="secondary"
          lighten-on-hover
        />
      </NuxtLink>

      <SpodcatIcon
        :class="{ 'd-none': !expand }"
        :href="episode.audio_url"
        :icon-size="30"
        :icon="Download"
        :size="40"
        :title="t('download')"
        class="on-hover-border d-sm-flex"
        element="a"
        target="_blank"
        text-theme="primary"
        lighten-on-hover
      />

      <SpodcatIcon
        :icon-size="30"
        :icon="isPlaying ? Pause : Play"
        :size="40"
        :text-theme="isPlaying ? 'info' : 'success'"
        :title="isPlaying ? t('pause') : t('play')"
        class="on-hover-border"
        element="button"
        lighten-on-hover
        @click="onPlayOrPauseClick"
      />
    </template>

    <slot />
  </ContentCard>
</template>
