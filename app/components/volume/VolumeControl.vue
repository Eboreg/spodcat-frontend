<script setup lang="ts">
const { t } = useI18n();
const popupVisible = ref<boolean>(false);
const container = useTemplateRef("container");

onClickOutside(container, () => (popupVisible.value = false));
</script>

<template>
  <VolumeControlInner class="d-none d-lg-flex" />

  <div class="d-lg-none pos-relative" ref="container">
    <VolumeIcon
      :size="{ sm: 30 }"
      :title="t('volume.volume')"
      @click="popupVisible = !popupVisible"
    />
    <Popup v-if="popupVisible">
      <VolumeControlInner />
    </Popup>
  </div>
</template>
