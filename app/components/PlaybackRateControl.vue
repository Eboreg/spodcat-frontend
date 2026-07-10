<script setup lang="ts">
import type { Theme } from "~/types";
import { Check, CircleGauge } from "@lucide/vue";
import useAudioStore from "~/composables/useAudioStore";

function onRateClick(rate: number) {
  audio.rate = rate;
  popupVisible.value = false;
}

const { t } = useI18n();
const popupVisible = shallowRef<boolean>(false);
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
const iconTextTheme = computed<Theme>(() => ({
  color: audio.rate === 1 ? "gray" : "primary",
  colorVariant: audio.rate === 1 ? "accented" : undefined,
  accentedOnActive: true,
}));

onClickOutside(container, () => (popupVisible.value = false));
</script>

<template>
  <div ref="container" class="pos-relative">
    <SpodcatIcon
      :icon="CircleGauge"
      :size="30"
      :text="iconTextTheme"
      :title="
        t('change-playback-rate-x', {
          x: playbackRates.find((r) => r.rate === audio.rate)?.label,
        })
      "
      class="p-half translated-on-press"
      element="button"
      @click="popupVisible = !popupVisible"
    />

    <Popup v-if="popupVisible" class="pb-half">
      <div class="popup-header border-primary px-single py-half">{{ t("playback-rate") }}</div>
      <button
        v-for="rate in playbackRates"
        :key="rate.rate"
        class="pt-half pr-single pb-quarter pl-half gap-half align-center cursor-pointer d-flex"
        @click="onRateClick(rate.rate)"
      >
        <div class="popup-row-check align-center d-flex">
          <Check v-if="rate.rate === audio.rate" :size="16" />
        </div>
        <div>{{ rate.label }}</div>
      </button>
    </Popup>
  </div>
</template>

<style scoped lang="scss">
.popup-row-check {
  height: 24px;
  justify-content: center;
  width: 24px;
}

.popup-header {
  border-bottom: 1px solid;
}
</style>
