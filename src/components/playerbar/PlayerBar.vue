<script setup lang="ts">
import useAudioStore from "@/composables/useAudioStore";
import type { EpisodeModel, PodcastModel } from "@/types/api";
import { ref } from "vue";
import PlayerBarExpanded from "./PlayerBarExpanded.vue";
import { MaterialSymbol, ProgressCircle } from "@/components";
import { EpisodeRoundIcon } from "@/components/episode";
import { useI18n } from "vue-i18n";

// Don't use inject() for podcast here, since it may happen that the user
// navigates to one podcast while listening to another.
const { t } = useI18n();
const props = defineProps<{ episode: EpisodeModel; podcast: PodcastModel }>();
const isExpanded = ref<boolean>(false);
const audio = useAudioStore();
const { pause, play } = audio;
</script>

<template>
  <div class="player-bar bg-opaque column">
    <PlayerBarExpanded v-if="isExpanded" :episode="episode" class="d-xl-none mx-half" />

    <div class="row align-center mr-half">
      <RouterLink
        :to="`/${episode.podcast}/episode/${episode.slug}`"
        class="row gap-single align-center episode ellipsis nowrap"
      >
        <EpisodeRoundIcon :episode="episode" :podcast="podcast" fallback-to-cover class="ml-half" />
        <div class="ellipsis">
          <div class="font-weight-bold ellipsis">{{ episode.name }}</div>
          <div class="text-xs ellipsis">{{ episode.podcast_name }}</div>
        </div>
      </RouterLink>

      <ProgressCircle v-if="audio.isLoading" class="p-half" />
      <MaterialSymbol
        v-else-if="audio.isPlaying"
        icon="pause"
        class="button larger"
        :title="t('pause')"
        @click="pause"
      />
      <MaterialSymbol
        v-else
        icon="play_arrow"
        class="button larger"
        :title="t('play')"
        @click="play"
      />

      <PlayerBarExpanded :episode="episode" class="d-none d-xl-flex fill" />

      <div class="d-xl-none">
        <MaterialSymbol
          v-if="isExpanded"
          class="button"
          @click="isExpanded = false"
          icon="keyboard_arrow_down"
        />
        <MaterialSymbol v-else class="button" @click="isExpanded = true" icon="keyboard_arrow_up" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-bar {
  border-top: 5px solid get-color("primary");
  position: relative;

  & > .row {
    height: var(--spod-player-bar-height);
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

  .loader {
    font-size: 40px;
    height: 40px;
  }
}
</style>
