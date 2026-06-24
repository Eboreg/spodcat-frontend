<script setup lang="ts">
import type { ValidationError } from "@/types";
import { computed } from "vue";

const props = defineProps<{
  label?: string;
  id?: string;
  maxLength?: number;
  errors?: ValidationError[];
  multiline?: boolean;
  type?: string;
}>();
const value = defineModel<string | number>();
const stringValue = computed(() => (value.value ? String(value.value) : undefined));
const length = computed(() => stringValue.value?.length ?? 0);
const overflow = computed(() => (props.maxLength ? length.value > props.maxLength : false));
const classes = computed(() => {
  if (props.errors && props.errors.length > 0) return "input has-error";
  return "input";
});

function onTextareaInput(event: InputEvent) {
  if (event.target instanceof HTMLTextAreaElement) {
    event.target.rows = event.target.value.split("\n").length;
  }
}
</script>

<template>
  <div class="text-input">
    <label v-if="label" :for="id">{{ label }}</label>
    <div v-if="maxLength" :class="{ 'text-primary': overflow }">{{ length }}/{{ maxLength }}</div>
    <textarea
      v-if="multiline"
      v-model="value"
      :id="id"
      :class="classes"
      :maxlength="maxLength"
      @input="onTextareaInput"
    ></textarea>
    <input v-else v-model="value" :type="type" :id="id" :class="classes" :maxlength="maxLength" />
    <div v-if="errors" class="errors">
      <div v-for="(error, idx) in errors" :key="idx" class="error">{{ error.message }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-input {
  column-gap: var(--spod-length-single);
  display: grid;
  font-size: var(--spod-font-size-xs);
  grid-template-columns: 1fr auto;

  textarea {
    min-height: var(--spod-length-3x);
  }

  .input {
    grid-column-end: span 2;
  }

  .errors {
    grid-column-end: span 2;
  }
}
</style>
