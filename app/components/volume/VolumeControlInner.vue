<script setup lang="ts">
const { t } = useI18n();
const audio = useAudioStore();
const { toggleMute, setVolume } = audio;

function onVolumeInput(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    setVolume(event.target.valueAsNumber);
  }
}
</script>

<template>
  <div class="row align-center p-half gap-half">
    <VolumeIcon
      :size="{ sm: 30 }"
      :title="audio.isMuted ? t('volume.unmute') : t('volume.mute')"
      @click="toggleMute"
    />
    <input
      :disabled="audio.isMuted"
      :value="audio.isMuted ? 0 : audio.volume"
      @input="onVolumeInput"
      max="1"
      min="0"
      name="volume"
      step="0.01"
      type="range"
    />
  </div>
</template>
