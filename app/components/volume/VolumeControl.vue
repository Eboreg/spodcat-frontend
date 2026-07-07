<script setup lang="ts">
const { t } = useI18n();
const popupVisible = shallowRef<boolean>(false);
const container = useTemplateRef("container");

onClickOutside(container, () => (popupVisible.value = false));
defineProps<{ vertical?: boolean }>();
</script>

<template>
  <VolumeControlInner class="d-none d-lg-flex" :vertical />

  <div ref="container" class="d-lg-none pos-relative">
    <VolumeIcon :size="30" :title="t('volume.volume')" @click="popupVisible = !popupVisible" />
    <Popup v-if="popupVisible">
      <VolumeControlInner :vertical />
    </Popup>
  </div>
</template>
