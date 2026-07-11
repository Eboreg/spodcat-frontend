<script setup lang="ts">
import { FastForward, Rewind } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";
import useResponsiveBreakpoint from "~/composables/useResponsiveBreakpoint";
import { BREAKPOINT_ORDER } from "~/constants";
import { timeToString } from "~/utils";

const audio = useAudioStore();
const { t } = useI18n();
const { breakpointOrder } = useResponsiveBreakpoint();
const noLink = computed(() => breakpointOrder.value < BREAKPOINT_ORDER.lg);
const titlesRoute = computed(() => {
  if (noLink.value) return `/${audio.episode?.podcast}/episode/${audio.episode?.slug}/player`;
  return `/${audio.episode?.podcast}/episode/${audio.episode?.slug}`;
});
</script>

<template>
  <div class="player-bar bg-opaque primary-top-border px-half">
    <div class="row align-center">
      <MaybeLink class="row gap-single align-center episode overflow-x-hidden nowrap cursor-pointer" :to="titlesRoute">
        <EpisodeRoundIcon :episode="audio.episode" :podcast="audio.podcast" fallback-to-cover bg-diagonal />
        <div class="overflow-x-hidden column gap-quarter">
          <HorizontalScroll>{{ audio.episode?.name }}</HorizontalScroll>
          <HorizontalScroll class="font-size-xs">{{ audio.episode?.podcast_name }}</HorizontalScroll>
        </div>
      </MaybeLink>

      <ProgressCircle v-if="audio.isLoading" class="p-half" :size="30" />
      <PlayButton v-else :size="30" class="p-half border-0" transparent />

      <div class="row align-center gap-half fill d-none d-lg-flex">
        <div class="font-size-xs time-string">{{ timeToString(audio.currentTime) }}</div>
        <DbfsBar v-if="audio.episode" :episode="audio.episode" class="fill" margin-x=".5rem" />
        <div class="font-size-xs time-string">
          {{ timeToString(audio.duration) }}
        </div>
      </div>

      <div class="row align-center d-none d-sm-flex d-lg-none">
        <Button
          :icon="Rewind"
          :size="30"
          :title="t('rewind-10s')"
          class="border-0"
          color-variant="accented"
          text="gray"
          @click="audio.seek(-10)"
        />
        <Button
          :icon="FastForward"
          :size="30"
          :title="t('forward-10s')"
          class="border-0"
          color-variant="accented"
          text="gray"
          @click="audio.seek(10)"
        />
      </div>

      <div class="row align-center d-none d-md-flex">
        <VolumeControl />
        <PlaybackRateControl />
        <KeyboardHelp />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "~/assets/scss/responsive" as *;

.player-bar > .row {
  height: var(--spod-player-bar-height);
}

.episode {
  height: 100%;
  flex: 1 1 350px;

  @include minsize(lg) {
    flex-grow: 0;
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
