<script setup lang="ts">
import useAudioStore from "@/composables/useAudioStore";
import { ref, useTemplateRef } from "vue";
import { onClickOutside } from "@vueuse/core";
import { MaterialSymbol, Popup } from "@/components";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const popupVisible = ref<boolean>(false);
const audio = useAudioStore();
const container = useTemplateRef("container");
const playbackRates = [
  { rate: 0.25, label: "0,25" },
  { rate: 0.5, label: "0,5" },
  { rate: 0.75, label: "0,75" },
  { rate: 1, label: t("normal") },
  { rate: 1.25, label: "1,25" },
  { rate: 1.5, label: "1,5" },
  { rate: 1.75, label: "1,75" },
  { rate: 2, label: "2" },
];

onClickOutside(container, () => (popupVisible.value = false));
</script>

<template>
  <div class="pos-relative" ref="container">
    <MaterialSymbol
      icon="settings_timelapse"
      class="button"
      :class="{ 'text-primary-light': audio.playbackRate !== 1 }"
      @click="popupVisible = !popupVisible"
      :title="
        t('change-playback-rate-x', {
          x: playbackRates.find((r) => r.rate === audio.playbackRate)?.label,
        })
      "
    />

    <Popup class="pb-half" v-if="popupVisible">
      <div class="popup-header">{{ t("playback-rate") }}</div>
      <div class="popup-row" v-for="rate in playbackRates" :key="rate.rate">
        <div class="popup-row-check">
          <MaterialSymbol v-if="rate.rate === audio.playbackRate" icon="check" />
        </div>
        <div>{{ rate.label }}</div>
      </div>
    </Popup>
  </div>
</template>

<style scoped lang="scss">
.popup-row {
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: var(--spod-length-half);
  padding: var(--spod-length-half) var(--spod-length-single) var(--spod-length-quarter)
    var(--spod-length-half);
}

.popup-row-check {
  height: 24px;
  width: 24px;
}
</style>
