<script setup lang="ts">
import { Download, ListMusic, Play } from "@lucide/vue";
import type { PartialEpisodeModel } from "@/types/api";
import { getLocaleDateString, makeAbsoluteUrl, timeToString } from "@/utils";
import { podcastKey } from "@/symbols";

function onPlayClick() {
  const episodeSlug = props.episode?.slug;
  const podcastSlug = podcast?.value?.slug ?? props.episode?.podcast;

  if (podcastSlug && episodeSlug) {
    useEpisode(podcastSlug, episodeSlug)
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
        <div class="row column-gap-half row-gap-quarter wrap">
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
      <div v-if="expand && absoluteUrl" class="py-single px-sm-half">
        <ContentShareIcon @click="openShareModal" />
      </div>

      <NuxtLink
        v-if="route && episode?.has_songs && !expand"
        :title="t('has-tracklist')"
        :to="route"
        class="d-none d-sm-block py-single px-half"
      >
        <SpodcatIcon
          :icon="ListMusic"
          :icon-size="30"
          :size="40"
          :title="t('has-tracklist')"
          class="hover-light hover-border cursor-pointer"
          theme="secondary"
        />
      </NuxtLink>

      <div v-if="episode" class="py-single px-sm-half">
        <a :href="episode.audio_url" target="_blank">
          <SpodcatIcon
            :icon="Download"
            :icon-size="{ xs: 25, sm: 30 }"
            :size="{ xs: 35, sm: 40 }"
            :title="t('download')"
            class="hover-light hover-border cursor-pointer"
            theme="primary"
          />
        </a>
      </div>

      <div v-if="episode" class="py-single px-sm-half">
        <SpodcatIcon
          :icon="Play"
          :icon-size="{ xs: 25, sm: 30 }"
          :size="{ xs: 35, sm: 40 }"
          :title="t('play')"
          @click="onPlayClick"
          class="hover-light hover-border cursor-pointer"
          theme="tertiary"
        />
      </div>
    </template>

    <slot />

    <ShareModal
      v-if="absoluteUrl && showShareModal"
      v-model="showShareModal"
      :current-timestamp="currentTimestampSnapshot"
      :url="absoluteUrl"
    />
  </ContentCard>
</template>
