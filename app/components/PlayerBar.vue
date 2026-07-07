<script setup lang="ts">
import useAudioStore from "~/composables/useAudioStore";
import useResponsiveBreakpoint from "~/composables/useResponsiveBreakpoint";
import { BREAKPOINT_ORDER } from "~/constants";
import { timeToString } from "~/utils";

const audio = useAudioStore();
const { breakpointOrder } = useResponsiveBreakpoint();
const noLink = computed(() => breakpointOrder.value < BREAKPOINT_ORDER.xl);
const titlesRoute = computed(() => {
  if (noLink.value) return `/${audio.episode?.podcast}/episode/${audio.episode?.slug}/player`;
  return `/${audio.episode?.podcast}/episode/${audio.episode?.slug}`;
});
</script>

<template>
  <div class="player-bar bg-opaque primary-top-border px-half">
    <div class="row align-center">
      <MaybeLink class="row gap-single align-center episode overflow-x-hidden nowrap cursor-pointer" :to="titlesRoute">
        <EpisodeRoundIcon :episode="audio.episode" :podcast="audio.podcast" fallback-to-cover />
        <div class="overflow-x-hidden column gap-quarter">
          <HorizontalScroll>{{ audio.episode?.name }}</HorizontalScroll>
          <HorizontalScroll class="font-size-xs">{{ audio.episode?.podcast_name }}</HorizontalScroll>
        </div>
      </MaybeLink>

      <ProgressCircle v-if="audio.isLoading" class="p-half" :size="30" stroke-width="6" />
      <PlayButton v-else :size="30" />

      <div class="row align-center d-none d-xl-flex fill">
        <div class="row align-center gap-half fill">
          <div class="font-size-xs time-string">{{ timeToString(audio.currentTime) }}</div>
          <DbfsBar v-if="audio.episode" :episode="audio.episode" class="fill" margin-x=".5rem" />
          <div class="font-size-xs time-string">
            {{ timeToString(audio.duration) }}
          </div>
        </div>

        <VolumeControl />
        <PlaybackRateControl />
        <KeyboardHelp />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/_responsive.scss" as *;

.player-bar > .row {
  height: var(--spod-player-bar-height);
}

.episode {
  flex-grow: 1;
  height: 100%;

  @include minsize(xl) {
    flex-grow: 0;
    width: 350px;
  }
}

.button {
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
