<script setup lang="ts">
const value = defineModel<string>();
const hasErrors = defineModel<boolean>("hasErrors");

defineProps<{
  id: string;
  label?: string;
  multiline?: boolean;
  validationErrors?: Record<string, string[]>;
  wrapperClass?: string;
}>();
</script>

<template>
  <Input
    :id
    :label
    :multiline
    :validation-errors
    :wrapper-class
    type="text"
    v-model:has-errors="hasErrors"
    v-model="value"
  />
</template>
