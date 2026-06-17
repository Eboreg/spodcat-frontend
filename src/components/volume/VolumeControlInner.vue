<script setup lang="ts">
import useAudioStore from "@/composables/useAudioStore";
import { computed } from "vue";
import { MaterialSymbol } from "@/components";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const audio = useAudioStore();
const { toggleMute, setVolume } = audio;
const icon = computed(() => (audio.isMuted ? "volume_off" : "volume_up"));

function onVolumeInput(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    setVolume(event.target.valueAsNumber);
  }
}
</script>

<template>
  <div class="row align-center">
    <MaterialSymbol
      :icon="icon"
      class="button"
      @click="toggleMute"
      :title="audio.isMuted ? t('volume.unmute') : t('volume.mute')"
    />
    <input
      type="range"
      name="volume"
      :value="audio.isMuted ? 0 : audio.volume"
      min="0"
      max="1"
      step="0.01"
      @input="onVolumeInput"
      :disabled="audio.isMuted"
    />
  </div>
</template>
