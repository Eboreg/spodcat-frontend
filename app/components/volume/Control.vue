<script setup lang="ts">
const { t } = useI18n();
const popupVisible = shallowRef<boolean>(false);
const container = useTemplateRef("container");

defineProps<{ vertical?: boolean; alwaysCollapse?: boolean; }>();
onClickOutside(container, () => (popupVisible.value = false));
</script>

<template>
  <VolumeControlInner class="d-none m-half" :class="{ 'd-xl-flex': !alwaysCollapse }" :vertical />

  <div ref="container" class="pos-relative" :class="{ 'd-xl-none': !alwaysCollapse }">
    <VolumeIcon :size="30" :title="t('volume.volume')" class="m-half" @click="popupVisible = !popupVisible" />
    <Popup v-if="popupVisible" class="p-single">
      <VolumeControlInner :vertical />
    </Popup>
  </div>
</template>
