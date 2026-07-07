<script setup lang="ts">
import { ArrowLeft, ArrowRight, Keyboard } from "@lucide/vue";

const { t } = useI18n();
const isPopupOpen = shallowRef<boolean>(false);
const container = useTemplateRef("container");

onClickOutside(container, () => (isPopupOpen.value = false));
</script>

<template>
  <div ref="container" class="pos-relative d-none d-md-flex">
    <SpodcatIcon
      :icon="Keyboard"
      :size="30"
      :title="t('keyboard.shortcuts')"
      class="p-half on-press-translate"
      element="button"
      lighten-on-hover
      theme="boring"
      theme-variant="light"
      @click="isPopupOpen = !isPopupOpen"
    />

    <Popup v-if="isPopupOpen" class="gap-half p-single">
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
</template>

<style scoped lang="scss">
.keyboard-key {
  align-items: center;
  background: linear-gradient(to right top, #444, #666);
  border-color: #666;
  border-radius: var(--spod-border-radius-md);
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
