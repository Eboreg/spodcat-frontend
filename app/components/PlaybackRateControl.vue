<script setup lang="ts">
import { Check, CircleGauge } from "@lucide/vue";

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

function onRateClick(rate: number) {
  audio.setPlaybackRate(rate);
  popupVisible.value = false;
}

onClickOutside(container, () => (popupVisible.value = false));
</script>

<template>
  <div class="pos-relative" ref="container">
    <SpodcatIcon
      :icon="CircleGauge"
      :size="{ sm: 30 }"
      :theme="audio.playbackRate === 1 ? 'boring-inverse' : 'primary'"
      :title="
        t('change-playback-rate-x', {
          x: playbackRates.find((r) => r.rate === audio.playbackRate)?.label,
        })
      "
      @click="popupVisible = !popupVisible"
      class="hover-light cursor-pointer p-half"
    />
    <Popup class="pb-half" v-if="popupVisible">
      <div class="popup-header">{{ t("playback-rate") }}</div>
      <div
        v-for="rate in playbackRates"
        :key="rate.rate"
        @click="onRateClick(rate.rate)"
        class="pt-half pr-single pb-quarter pl-half gap-half align-center cursor-pointer d-flex"
      >
        <div class="popup-row-check align-center d-flex">
          <SpodcatIcon v-if="rate.rate === audio.playbackRate" :icon="Check" :size="16" />
        </div>
        <div>{{ rate.label }}</div>
      </div>
    </Popup>
  </div>
</template>

<style scoped lang="scss">
.popup-row-check {
  height: 24px;
  justify-content: center;
  width: 24px;
}
</style>
