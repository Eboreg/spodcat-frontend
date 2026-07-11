<script setup lang="ts">
import useAudioStore from "~/composables/useAudioStore";

const { t } = useI18n();
const audio = useAudioStore();

function onVolumeInput(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    audio.setVolume(event.target.valueAsNumber);
  }
}

defineProps<{ vertical?: boolean }>();
</script>

<template>
  <div class="align-center gap-half" :class="{ column: vertical, row: !vertical }">
    <VolumeIcon
      :size="30"
      :title="audio.muted ? t('volume.unmute') : t('volume.mute')"
      @click="audio.muted = !audio.muted"
    />
    <input
      :disabled="audio.muted"
      :orient="vertical ? 'vertical' : 'horizontal'"
      :value="audio.muted ? 0 : audio.volume"
      max="1"
      min="0"
      name="volume"
      step="0.01"
      type="range"
      @input="onVolumeInput"
    >
  </div>
</template>
