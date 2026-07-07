<script setup lang="ts">
export type InputType = "text" | "number" | "date" | "email" | "password" | "tel" | "time" | "url" | "search";

export interface InputProps {
  gridArea?: string
  hasErrors?: boolean
  multiline?: boolean
  setClientValidationMessage?: (message: string) => void
  type?: InputType
}

function onInput(event: InputEvent) {
  emit("input", event);

  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    emit("validationMessage", event.target.validationMessage);
    if (props.setClientValidationMessage) {
      props.setClientValidationMessage(event.target.validationMessage);
    }
  }

  if (event.target instanceof HTMLTextAreaElement) {
    // Clumsily make sure the element not just grows, but also shrinks when
    // text is removed:
    if (event.data === null)
      event.target.style.height = "";

    const paddingTop = parseFloat(textareaStyle.value?.paddingTop ?? "0");
    const paddingBottom = parseFloat(textareaStyle.value?.paddingBottom ?? "0");
    const height = event.target.scrollHeight - paddingTop - paddingBottom;

    event.target.style.height = `${height}px`;
  }
}

const props = withDefaults(defineProps<InputProps>(), { type: "text" });
const emit = defineEmits<{ input: [InputEvent], validationMessage: [string] }>();

const value = defineModel<string | number>();
const multiline = computed(() => props.multiline && props.type === "text");
const textarea = useTemplateRef("textarea");
const textareaStyle = computed(() =>
  textarea.value && import.meta.client ? window.getComputedStyle(textarea.value) : undefined,
);

defineOptions({ inheritAttrs: false });
</script>

<template>
  <textarea
    v-if="multiline"
    ref="textarea"
    v-bind="$attrs"
    v-model="value"
    :class="{ 'border-error': hasErrors }"
    class="input"
    @input="onInput"
  />
  <input
    v-else
    v-bind="$attrs"
    v-model="value"
    :class="{ 'border-error': hasErrors }"
    :type
    class="input"
    @input="onInput"
  >
</template>

<style scoped lang="scss">
textarea {
  min-height: var(--spod-length-3x);
}

.border-error {
  border-style: solid;
}

.input {
  font-family: var(--spod-font-family);
  font-size: var(--spod-font-size-body);
  grid-area: v-bind(gridArea);
  padding: var(--spod-length-half);
}
</style>
