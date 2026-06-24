<script setup lang="ts">
import { ChevronDown, ChevronUp, Pause, Play, TriangleAlert } from "@lucide/vue";
import type { EpisodeModel, PodcastModel } from "@/types/api";

// Don't use inject() for podcast here, since it may happen that the user
// navigates to one podcast while listening to another.
const { t } = useI18n();
const props = defineProps<{ episode: EpisodeModel; podcast: PodcastModel }>();
const isExpanded = ref<boolean>(false);
const audio = useAudioStore();
const { addToast } = useMessageStore();
const { pause, play } = audio;
</script>

<template>
  <div class="player-bar bg-opaque">
    <PlayerBarExpanded v-if="isExpanded" :episode="episode" class="d-xl-none mx-half" />

    <div class="row align-center mr-half">
      <NuxtLink
        :to="`/${episode.podcast}/episode/${episode.slug}`"
        class="row gap-single align-center episode ellipsis nowrap"
      >
        <EpisodeRoundIcon :episode="episode" :podcast="podcast" fallback-to-cover class="ml-half" />
        <div class="ellipsis">
          <div class="font-weight-bold ellipsis">{{ episode.name }}</div>
          <div class="text-xs ellipsis">{{ episode.podcast_name }}</div>
        </div>
      </NuxtLink>

      <ProgressCircle v-if="audio.isLoading" class="p-half" :size="30" :stroke-width="6" />
      <SpodcatIcon
        v-else-if="audio.error"
        :icon="TriangleAlert"
        :size="30"
        @click="addToast({ level: 'error', text: audio.error })"
        class="p-half hover-light cursor-pointer"
        theme="error"
      />
      <SpodcatIcon
        v-else-if="audio.isPlaying"
        :icon="Pause"
        :size="30"
        :title="t('pause')"
        @click="pause"
        class="hover-light cursor-pointer p-half"
        theme="info"
      />
      <SpodcatIcon
        v-else
        :icon="Play"
        :size="30"
        :title="t('play')"
        @click="play"
        class="hover-light cursor-pointer p-half"
        theme="success"
      />

      <PlayerBarExpanded :episode="episode" class="d-none d-xl-flex fill" />

      <div class="d-xl-none">
        <SpodcatIcon
          :icon="isExpanded ? ChevronDown : ChevronUp"
          :size="30"
          @click="isExpanded = !isExpanded"
          class="hover-light cursor-pointer p-half"
          theme="boring-inverse"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-bar {
  border-top: 5px solid get-color("primary");

  & > .row {
    height: var(--spod-player-bar-height);
  }
}

.episode {
  flex-grow: 1;
  height: 100%;
  width: 350px;

  @include minsize(xl) {
    flex-grow: 0;
  }
}

:deep(.button) {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  font-size: 30px;
  height: 30px;
  padding: 8px;
  width: 30px;

  &.larger {
    @include minsize(sm) {
      font-size: 40px;
      height: 40px;
      width: 40px;
    }
  }
}
</style>
