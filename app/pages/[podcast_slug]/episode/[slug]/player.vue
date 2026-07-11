<script setup lang="ts">
import type { ThemeColor } from "~/types";
import { ChevronDown, FastForward, Rewind } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";
import useEpisode from "~/composables/useEpisode";
import usePodcast from "~/composables/usePodcast";
import useSpodcatHead from "~/composables/useSpodcatHead";
import { podcastSlugKey } from "~/symbols";
import { detectLocale, timeToString } from "~/utils";

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
const container = useTemplateRef("container");
const containerHeight = computed(() => container.value?.offsetHeight);
const top = shallowRef<number>(0);

const { distanceY, isSwiping } = usePointerSwipe(container, {
  disableTextSelect: true,
  onSwipe: () => {
    if (distanceY.value < 0) {
      top.value = Math.abs(distanceY.value);
    } else {
      top.value = 0;
    }
  },
  onSwipeEnd: () => {
    if (distanceY.value < 0 && containerHeight.value && (Math.abs(distanceY.value) / containerHeight.value) >= 0.5) {
      onCloseClick();
    } else {
      top.value = 0;
    }
  },
});

const playButtonTheme: ComputedRef<ThemeColor> = computed(() => {
  if (audio.isError) return "error";
  if (audio.isPlaying) return "info";
  return "success";
});

provide(podcastSlugKey, podcastSlug);
useSpodcatHead({ podcast, episode });

watch([episode, podcast], () => {
  if (episode.value) audio.setEpisode(episode.value, podcast.value);
}, { immediate: true });

watch(podcast, () => setLocale(detectLocale(podcast.value?.language)), { immediate: true });

definePageMeta({
  layout: "player",
  layoutTransition: {
    name: "player",
  },
});
</script>

<template>
  <div class="w-100">
    <div v-if="top > 0" class="p-single loading-container" :style="{ height: `${top}px` }">
      <Loading height="100%" />
    </div>

    <div
      ref="container"
      :class="{ 'container-transition': !isSwiping }"
      :style="{ top: `${top}px` }"
      class="container primary-top-border bg-opaque p-single column gap-single overflow-x-hidden"
    >
      <div class="column gap-single image-wrapper">
        <SpodcatIcon
          :icon-size="30"
          :icon="ChevronDown"
          :size="40"
          accented-on-active
          class="cursor-pointer translated-on-press"
          color-variant="accented"
          text="gray"
          @click="onCloseClick"
        />
        <div class="image-container border-primary border-sm border-radius-lg">
          <img :src="audio.coverImageUrl" alt="">
        </div>
      </div>

      <Loading v-if="!episode" height="120px" />
      <template v-else>
        <div class="column align-center gap-half">
          <HorizontalScroll class="font-size-lgze-lg">
            <NuxtLink :to="`/${episode.podcast}/episode/${episode.slug}`">
              {{ episode.name }}
            </NuxtLink>
          </HorizontalScroll>
          <HorizontalScroll>{{ episode.podcast_name }}</HorizontalScroll>
        </div>

        <div class="column">
          <DbfsBar :episode margin-x="1rem" />
          <div class="row space-between">
            <div class="font-size-xs time-string">{{ timeToString(audio.currentTime) }}</div>
            <div class="font-size-xs time-string">{{ timeToString(audio.duration) }}</div>
          </div>
        </div>
      </template>

      <div class="row align-center button-row mb-single">
        <VolumeControl vertical always-collapse />

        <Button
          :border="{ colorVariant: 'muted' }"
          :icon-size="30"
          :icon="Rewind"
          :size="40"
          :text="{ colorVariant: 'accented' }"
          :title="t('rewind-10s')"
          class="py-0 px-half border-radius-lg border-sm border-outset"
          color="gray"
          transparent
          @click="audio.seek(-10)"
        />

        <PlayButton
          :color="playButtonTheme"
          :icon-size="40"
          :size="60"
          bg-diagonal
          class="p-0 border-sm border-radius-100"
        />

        <Button
          :border="{ colorVariant: 'muted' }"
          :icon-size="30"
          :icon="FastForward"
          :size="40"
          :text="{ colorVariant: 'accented' }"
          :title="t('forward-10s')"
          class="p-0 px-half border-radius-lg border-sm border-outset"
          color="gray"
          transparent
          @click="audio.seek(10)"
        />

        <PlaybackRateControl />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-container,
.container {
  box-sizing: border-box;
}

.container {
  height: 100dvh;
  justify-content: space-between;
  position: absolute;
}

.container-transition {
  transition-duration: 0.2s;
  transition-property: top;
  transition-timing-function: linear;
}

.image-wrapper {
  flex: 0 1 auto;
  overflow: hidden;
}

.image-container {
  align-self: center;
  aspect-ratio: 1/1;
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
</style>
