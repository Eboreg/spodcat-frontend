<script setup lang="ts">
import useAudioStore from "@/composables/useAudioStore";
import { computed, ref, useTemplateRef } from "vue";
import VolumeControlInner from "./VolumeControlInner.vue";
import { onClickOutside } from "@vueuse/core";
import { MaterialSymbol, Popup } from "@/components";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const popupVisible = ref<boolean>(false);
const audio = useAudioStore();
const icon = computed(() => (audio.isMuted ? "volume_off" : "volume_up"));
const container = useTemplateRef("container");

onClickOutside(container, () => (popupVisible.value = false));
</script>

<template>
  <VolumeControlInner class="d-none d-lg-flex" />

  <div class="d-lg-none pos-relative" ref="container">
    <MaterialSymbol
      :icon="icon"
      class="button"
      @click="popupVisible = !popupVisible"
      :title="t('volume.volume')"
    />

    <Popup class="volume-control-popup" v-if="popupVisible">
      <VolumeControlInner />
    </Popup>
  </div>
</template>

<style scoped lang="scss">
.volume-control-popup {
  padding-right: var(--spod-length-single);
}
</style>
