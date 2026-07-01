<script setup lang="ts">
import { ChevronDown, Rewind, FastForward } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";
import { detectLocale, timeToString } from "~/utils";
import useEpisode from "~/composables/useEpisode";
import usePodcast from "~/composables/usePodcast";
import type { Theme } from "~/types";

function onCloseClick() {
  if (navigation.canGoBack) router.back();
  else navigateTo(`/${podcastSlug}/episode/${slug}`);
}

const route = useRoute();
const podcastSlug = route.params.podcast_slug as string;
const slug = route.params.slug as string;
const { episode } = useEpisode(podcastSlug, slug);
const { podcast } = usePodcast(podcastSlug);
const router = useRouter();

const { t, setLocale } = useI18n();
const audio = useAudioStore();

const playButtonTheme: ComputedRef<Theme> = computed(() => {
  if (audio.isError) return "error";
  if (audio.isPlaying) return "info";
  return "success";
});

watchEffect(() => {
  if (episode.value) audio.setEpisode(episode.value, podcast.value);
});

watchEffect(() => {
  setLocale(detectLocale(podcast.value?.language));
});

definePageMeta({
  layout: "player",
  layoutTransition: {
    name: "player",
  },
});
</script>

<template>
  <div class="container primary-top-border bg-opaque p-single column gap-single overflow-x-hidden">
    <div class="column gap-single image-wrapper">
      <SpodcatIcon
        :icon-size="30"
        :icon="ChevronDown"
        :size="40"
        @click="onCloseClick"
        class="hover-light cursor-pointer button-press"
        theme="boring-inverse"
      />
      <div class="border-primary-dark image-container">
        <img :src="audio.coverImageUrl" alt="" />
      </div>
    </div>

    <Loading v-if="!episode" height="120px" />
    <template v-else>
      <div class="column align-center gap-half">
        <HorizontalScroll class="text-lg">{{ episode?.name }}</HorizontalScroll>
        <HorizontalScroll>{{ episode?.podcast_name }}</HorizontalScroll>
      </div>
      <div v-if="episode" class="column">
        <DbfsBar :episode />
        <div class="row space-between">
          <div class="text-xs time-string">{{ timeToString(audio.currentTime) }}</div>
          <div class="text-xs time-string">{{ timeToString(audio.duration) }}</div>
        </div>
      </div>
    </template>

    <div class="row align-center button-row mb-single">
      <VolumeControl vertical />
      <RoundIcon
        :size="40"
        :title="t('rewind-10s')"
        @click="audio.seek(-10)"
        class="hover-light button-press"
        theme="boring-inverse"
      >
        <SpodcatIcon :icon="Rewind" :size="30" />
      </RoundIcon>
      <RoundIcon :theme="playButtonTheme" :size="60" class="hover-light button-press">
        <PlayButton no-theme :size="40" />
      </RoundIcon>
      <RoundIcon
        :size="40"
        :title="t('forward-10s')"
        @click="audio.seek(10)"
        class="hover-light button-press"
        theme="boring-inverse"
      >
        <SpodcatIcon :icon="FastForward" :size="30" />
      </RoundIcon>
      <PlaybackRateControl />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  justify-content: space-between;
  width: 100%;
}

.image-wrapper {
  flex: 0 1 auto;
  overflow: hidden;
}

.image-container {
  align-self: center;
  aspect-ratio: 1/1;
  border-radius: 8px;
  flex: 0 1 auto;
  overflow: hidden;

  img {
    aspect-ratio: 1/1;
    object-fit: cover;
  }
}

.button-row {
  justify-content: space-evenly;
}

.horizontal-scroll {
  max-width: 100%;
}
</style>
