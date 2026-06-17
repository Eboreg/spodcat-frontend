<script setup lang="ts">
import useAudioStore from "@/composables/useAudioStore";
import type { EpisodeModel } from "@/types/api";
import { ref, useTemplateRef } from "vue";
import { timeToString } from "@/utils";
import { onClickOutside } from "@vueuse/core";
import { DbfsBar, MaterialSymbol, PlaybackRateControl, Popup, VolumeControl } from "@/components";
import { useI18n } from "vue-i18n";

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

    <div class="pos-relative d-md-none">
      <MaterialSymbol
        icon="replay_10"
        :title="t('rewind-10s')"
        @click="seek(-10)"
        cursor="pointer"
        class="button"
      />
    </div>

    <div class="pos-relative d-md-none">
      <MaterialSymbol
        icon="forward_10"
        class="button"
        :title="t('forward-10s')"
        @click="seek(10)"
        cursor="pointer"
      />
    </div>

    <div ref="keyboardHelp" class="pos-relative d-none d-md-flex">
      <MaterialSymbol
        icon="keyboard"
        class="button"
        @click="isKeyboardHelpOpen = !isKeyboardHelpOpen"
        :title="t('keyboard.shortcuts')"
        cursor="pointer"
      />

      <Popup v-if="isKeyboardHelpOpen" class="gap-half p-single">
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key">
            <span class="text">{{ t("keyboard.space") }}</span>
          </div>
          <span>{{ t("play-pause") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key"><MaterialSymbol icon="arrow_left" /></div>
          <span>{{ t("rewind-10s") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key"><MaterialSymbol icon="arrow_right" /></div>
          <span>{{ t("forward-10s") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key">
            <span class="text">{{ t("keyboard.ctrl") }}</span>
          </div>
          +
          <div class="keyboard-key"><MaterialSymbol icon="arrow_left" /></div>
          <span>{{ t("rewind-60s") }}</span>
        </div>
        <div class="nowrap row align-center gap-half">
          <div class="keyboard-key">
            <span class="text">{{ t("keyboard.ctrl") }}</span>
          </div>
          +
          <div class="keyboard-key"><MaterialSymbol icon="arrow_right" /></div>
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
