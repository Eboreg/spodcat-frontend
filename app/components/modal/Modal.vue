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
  <dialog ref="dialog" class="modal" closedby="any" @click="onClick" @close="isOpen = false">
    <div class="dotted-border pos-relative">
      <div class="modal-background" />
      <div>
        <div class="d-flex align-center">
          <div class="fill">
            <slot name="header" />
          </div>
          <CloseIcon class="p-half" @click="isOpen = false" />
        </div>
        <div class="modal-content">
          <slot />
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.modal {
  background-color: initial;
  border-width: 0;
  color: var(--spod-text-color);
  margin: var(--spod-modal-top-margin) auto 1rem;
  max-height: calc(100% - var(--spod-modal-top-margin) - 1rem - (var(--spod-dotted-border-width) * 2));
  max-width: var(--spod-modal-width);
  padding: 0;

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
  box-shadow: 0 0 calc(var(--spod-dotted-border-width) / 2) calc(var(--spod-dotted-border-width) / 2)
    var(--spod-background-color-opaque);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: -1;
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
