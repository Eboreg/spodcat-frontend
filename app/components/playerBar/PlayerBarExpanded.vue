<script setup lang="ts">
import { ArrowLeft, ArrowRight, FastForward, Keyboard, Rewind } from "@lucide/vue";
import type { EpisodeModel } from "@/types/api";
import { timeToString } from "@/utils";

const { t } = useI18n();
const props = defineProps<{ episode: EpisodeModel }>();
const isKeyboardHelpOpen = ref<boolean>(false);
const keyboardHelp = useTemplateRef("keyboardHelp");
const audio = useAudioStore();
const { seek } = audio;

onClickOutside(keyboardHelp, () => (isKeyboardHelpOpen.value = false));
</script>

<template>
  <div class="row align-center">
    <div class="row align-center gap-half fill">
      <div class="text-xs time-string">{{ timeToString(audio.currentTime) }}</div>
      <DbfsBar :episode="episode" />
      <div class="text-xs time-string d-none d-sm-block">{{ timeToString(audio.duration) }}</div>
    </div>

    <VolumeControl />
    <PlaybackRateControl />

    <div class="d-md-none">
      <SpodcatIcon
        :class="audio.error ? 'cursor-not-allowed' : 'cursor-pointer'"
        :icon="Rewind"
        :title="t('rewind-10s')"
        @click="seek(-10)"
        class="hover-light p-half"
        theme="boring-inverse"
      />
    </div>

    <div class="d-md-none">
      <SpodcatIcon
        :class="audio.error ? 'cursor-not-allowed' : 'cursor-pointer'"
        :icon="FastForward"
        :title="t('forward-10s')"
        @click="seek(10)"
        class="hover-light p-half"
        theme="boring-inverse"
      />
    </div>

    <div ref="keyboardHelp" class="pos-relative d-none d-md-flex">
      <SpodcatIcon
        :icon="Keyboard"
        :size="30"
        :title="t('keyboard.shortcuts')"
        @click="isKeyboardHelpOpen = !isKeyboardHelpOpen"
        class="hover-light cursor-pointer p-half"
        theme="boring-inverse"
      />

      <Popup v-if="isKeyboardHelpOpen" class="gap-half p-single">
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key">
            <span class="text">{{ t("keyboard.space") }}</span>
          </div>
          <span>{{ t("play-pause") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key"><SpodcatIcon :icon="ArrowLeft" :size="16" /></div>
          <span>{{ t("rewind-10s") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key"><SpodcatIcon :icon="ArrowRight" :size="16" /></div>
          <span>{{ t("forward-10s") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key">
            <span class="text">{{ t("keyboard.ctrl") }}</span>
          </div>
          +
          <div class="keyboard-key"><SpodcatIcon :icon="ArrowLeft" :size="16" /></div>
          <span>{{ t("rewind-60s") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key">
            <span class="text">{{ t("keyboard.ctrl") }}</span>
          </div>
          +
          <div class="keyboard-key"><SpodcatIcon :icon="ArrowRight" :size="16" /></div>
          <span>{{ t("forward-60s") }}</span>
        </div>
      </Popup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-string {
  text-align: center;
  width: 45px;
}

.keyboard-key {
  align-items: center;
  background: linear-gradient(to right top, #444, #666);
  border-color: #666;
  border-radius: var(--spod-border-radius);
  border-style: outset;
  border-width: 2px 5px 5px 2px;
  display: flex;
  height: 25px;
  padding: 0 var(--spod-length-half);

  .text {
    font-family: monospace;
    font-size: var(--spod-font-size-xs);
  }
}
</style>
