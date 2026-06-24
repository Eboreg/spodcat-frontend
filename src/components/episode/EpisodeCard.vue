<script setup lang="ts">
import type { PartialEpisodeModel } from "@/types/api";
import { computed, inject, ref } from "vue";
import { getLocaleDateString, makeAbsoluteUrl, timeToString } from "@/utils";
import useAudioStore from "@/composables/useAudioStore";
import { ContentCard, Loading, MaterialSymbol, ShareModal } from "@/components";
import { useQuery } from "@pinia/colada";
import { getEpisodeBySlug } from "@/api.ts";
import EpisodeRoundIcon from "./EpisodeRoundIcon.vue";
import useSeason from "@/composables/useSeason";
import { useI18n } from "vue-i18n";
import { podcastKey } from "@/symbols";

function onPlayClick() {
  const episodeSlug = props.episode?.slug;
  const podcastSlug = podcast?.value?.slug ?? props.episode?.podcast;

  if (podcastSlug && episodeSlug) {
    useQuery({
      key: () => ["podcast", podcastSlug, "episode", episodeSlug],
      query: () => getEpisodeBySlug(podcastSlug, episodeSlug),
      staleTime: 60000,
    })
      .refresh()
      .then((state) => {
        if (state.data) audio.playEpisode(state.data, podcast?.value);
      });
  }
}

function openShareModal() {
  showShareModal.value = true;
  currentTimestampSnapshot.value = audio.currentTime;
}

const { t } = useI18n();
const audio = useAudioStore();
const props = defineProps<{
  episode?: PartialEpisodeModel;
  expand: boolean;
}>();
const podcast = inject(podcastKey);
const showShareModal = ref<boolean>(false);
const currentTimestampSnapshot = ref<number>(0);
const podcastSlug = computed(() => podcast?.value?.slug ?? props.episode?.podcast);
const route = computed(() =>
  props.episode && podcastSlug.value
    ? `/${podcastSlug.value}/episode/${props.episode.slug}`
    : undefined,
);
const absoluteUrl = computed(() => (route.value ? makeAbsoluteUrl(route.value) : undefined));
const { season, theme } = useSeason(podcastSlug, () => props.episode?.season);
</script>

<template>
  <ContentCard :route="route" :expand="expand" :content="episode">
    <template #head-start>
      <EpisodeRoundIcon :episode="episode" :podcast="podcast" />
      <div v-if="episode" class="fill column gap-quarter">
        <div class="font-weight-bold">{{ episode.name }}</div>
        <div class="row gap-half">
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
          <div class="badge theme-secondary">
            {{ getLocaleDateString(new Date(episode.published), podcast?.language) }}
          </div>
          <div class="badge theme-tertiary d-none d-sm-block">
            {{ timeToString(episode.duration_seconds) }}
          </div>
        </div>
      </div>
      <Loading v-else :opacity="0.5" />
    </template>

    <template #head-end>
      <MaterialSymbol
        v-if="expand && absoluteUrl"
        icon="share"
        class="text-secondary hover-light py-single px-half"
        :title="t('share.share')"
        @click="openShareModal"
        :size="30"
      />

      <RouterLink
        :to="route"
        v-if="route && episode?.has_songs && !expand"
        class="d-none d-sm-block py-single px-half"
        :title="t('has-tracklist')"
      >
        <MaterialSymbol
          icon="queue_music"
          :title="t('has-tracklist')"
          class="text-secondary hover-light"
          cursor="pointer"
          :size="35"
        />
      </RouterLink>

      <a v-if="episode" :href="episode.audio_url" :title="t('download')" class="py-single px-half">
        <MaterialSymbol
          icon="download"
          :title="t('download')"
          cursor="pointer"
          class="text-primary hover-light"
          :size="35"
        />
      </a>

      <MaterialSymbol
        v-if="episode"
        icon="play_arrow"
        :title="t('play')"
        cursor="pointer"
        class="text-tertiary hover-light py-single px-half"
        @click="onPlayClick"
        :size="40"
      />
    </template>

    <slot />

    <ShareModal
      v-if="absoluteUrl && showShareModal"
      @close="showShareModal = false"
      :url="absoluteUrl"
      :current-timestamp="currentTimestampSnapshot"
    />
  </ContentCard>
</template>
