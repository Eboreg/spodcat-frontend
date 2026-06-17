<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<template>
  <div class="popup-container">
    <div class="popup bg-opaque" :class="$attrs.class">
      <slot />
    </div>
    <div class="arrow bg-opaque"></div>
  </div>
</template>

<style scoped lang="scss">
.arrow {
  border-color: get-color("primary", "dark");
  border-style: solid;
  border-width: 0 2px 2px 0;
  bottom: -6px;
  height: 10px;
  position: absolute;
  right: 20px;
  transform: rotate(45deg);
  width: 10px;
}

.popup {
  border: 2px solid get-color("primary");
  border-bottom-color: get-color("primary", "dark");
  border-radius: var(--spod-border-radius);
  border-right-color: get-color("primary", "dark");
  box-shadow: 0 2px 5px black;
  display: flex;
  flex-direction: column;
}

.popup-container {
  bottom: calc(100% + var(--spod-length-half));
  position: absolute;
  right: 0;
}

:deep(.popup-header) {
  border-bottom: 1px solid get-color("primary");
  padding: var(--spod-length-half) var(--spod-length-single);
}
</style>
