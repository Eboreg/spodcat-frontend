<script setup lang="ts">
import { useTemplateRef, watchEffect } from "vue";
import { MaterialSymbol } from "@/components";
import { useI18n } from "vue-i18n";

const dialog = useTemplateRef("dialog");
const props = defineProps<{ open?: boolean }>();
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();

watchEffect(() => {
  if (dialog.value) {
    if (props.open) dialog.value.showModal();
    else dialog.value.close();
  }
});
</script>

<template>
  <dialog ref="dialog" class="modal dotted-border p-0" closedby="any" @close="$emit('close')">
    <div class="modal-header">
      <div class="fill"><slot name="header" /></div>
      <MaterialSymbol
        icon="close"
        @click="dialog?.close()"
        class="close-icon"
        :title="t('close')"
      />
    </div>
    <div class="modal-content">
      <slot />
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.close-icon {
  color: var(--spod-text-color-dark);
  padding: 10px;
}

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

.modal-header {
  align-items: center;
  display: flex;
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
