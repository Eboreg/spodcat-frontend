<script setup lang="ts">
const isOpen = defineModel<boolean>();
const dialog = useTemplateRef("dialog");

watchEffect(() => {
  if (dialog.value) {
    if (isOpen.value) dialog.value.showModal();
    else dialog.value.close();
  }
});
</script>

<template>
  <dialog ref="dialog" class="modal dotted-border p-0" closedby="any" @close="isOpen = false">
    <div class="d-flex align-center">
      <div class="fill"><slot name="header" /></div>
      <CloseIcon @click="isOpen = false" class="p-half" />
    </div>
    <div class="modal-content">
      <slot />
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.modal {
  background-color: var(--spod-background-color-opaque);
  box-shadow: 0 0 10px black;
  color: var(--spod-text-color);
  margin: var(--spod-modal-top-margin) auto 1rem;
  max-height: calc(
    100% - var(--spod-modal-top-margin) - 1rem - (var(--spod-dotted-border-width) * 2)
  );
  max-width: var(--spod-modal-width);

  &[open] {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &::backdrop {
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  & > :deep(:first-child) {
    margin-top: 0;
  }

  & > :deep(:last-child) {
    margin-bottom: 0;
  }
}
</style>
