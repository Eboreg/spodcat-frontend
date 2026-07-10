<script setup lang="ts">
function onClick(event: MouseEvent) {
  // Safari (who else?) doesn't support closedby="any" and will not close
  // dialog by clicking on backdrop.
  if (dialog.value && dialog.value === event.target) dialog.value.close();
}

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
  <dialog ref="dialog" class="modal dotted-border p-0" closedby="any" @click="onClick" @close="isOpen = false">
    <div class="modal-background">
      <div class="d-flex align-center">
        <div class="fill"><slot name="header" /></div>
        <CloseIcon class="p-half" @click="isOpen = false" />
      </div>
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.modal {
  background-color: initial;
  color: var(--spod-text-color);
  margin: var(--spod-modal-top-margin) auto 1rem;
  max-height: calc(100% - var(--spod-modal-top-margin) - 1rem - (var(--spod-dotted-border-width) * 2));
  max-width: var(--spod-modal-width);

  &[open] {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &::backdrop {
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 50%);
  }
}

.modal-background {
  background-color: var(--spod-background-color-opaque);
  box-shadow: 0 0 10px black;
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
