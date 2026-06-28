<script setup lang="ts">
function onInput(event: InputEvent) {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    frontendError.value = !event.target.validity.valid ? event.target.validationMessage : undefined;
  }
  if (event.target instanceof HTMLTextAreaElement) {
    event.target.rows = event.target.value.split("\n").length;
  }
}

type Type = "text" | "number" | "date" | "email" | "password" | "tel" | "time" | "url" | "search";

type Props = {
  id: string;
  label?: string;
  maxlength?: number;
  multiline?: boolean;
  type?: Type;
  validationErrors?: Record<string, string[]>;
  wrapperClass?: string;
};

const value = defineModel<string | number>();
const hasErrors = defineModel<boolean>("hasErrors");

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  label: undefined,
  maxlength: undefined,
  validationErrors: undefined,
  wrapperClass: undefined,
});

const backendErrors = ref<string[]>([]);
const frontendError = ref<string>();
const valueAtValidation = ref<string | number>();

const length = computed(() => valueAsString.value?.length ?? 0);
const overflow = computed(() => (props.maxlength ? length.value > props.maxlength : false));
const multiline = computed(() => props.multiline && props.type === "text");
const valueAsString = computed(() => (value.value !== undefined ? String(value.value) : undefined));

const errors = computed(() => {
  const _errors = valueAtValidation.value === value.value ? backendErrors.value : [];

  if (frontendError.value) _errors.push(frontendError.value);
  return _errors;
});

watch(errors, () => {
  hasErrors.value = errors.value.length > 0;
});

watch(
  () => props.validationErrors,
  () => {
    valueAtValidation.value = value.value;
    backendErrors.value = Object.entries(props.validationErrors ?? {})
      .filter(([id]) => id === props.id)
      .flatMap(([_, err]) => err);
  },
);

defineOptions({ inheritAttrs: false });
</script>
<template>
  <div class="input-wrapper column-gap-single" :class="wrapperClass">
    <label v-if="label !== undefined" :for="id">{{ label }}</label>
    <div v-if="maxlength" :class="{ 'text-primary': overflow }">{{ length }}/{{ maxlength }}</div>
    <textarea
      v-if="multiline"
      :class="{ 'has-error': hasErrors }"
      :id
      :maxlength
      @input="onInput"
      class="input p-half"
      v-bind="$attrs"
      v-model="value"
    />
    <input
      v-else
      :class="{ 'has-error': hasErrors }"
      :id
      :maxlength
      :type
      @input="onInput"
      class="input p-half"
      v-bind="$attrs"
      v-model="value"
    />
    <div v-if="hasErrors" class="errors">
      <div v-for="(error, index) in errors" :key="index" class="text-error-light">{{ error }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.input-wrapper {
  display: grid;
  font-size: var(--spod-font-size-xs);
  grid-template-columns: 1fr auto;
}

textarea {
  min-height: var(--spod-length-3x);
}

.input,
.errors {
  grid-column-end: span 2;
}

.input {
  font-size: var(--spod-font-size-body);
  font-family: var(--spod-font-family);
}

.has-error {
  border: 2px solid get-color("error");
}
</style>
