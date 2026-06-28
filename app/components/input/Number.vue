<script setup lang="ts">
const value = defineModel<string | number>();
const hasErrors = defineModel<boolean>("hasErrors");

defineProps<{
  id: string;
  label?: string;
  validationErrors?: Record<string, string[]>;
  wrapperClass?: string;
}>();
</script>

<template>
  <Input
    :id
    :label
    :validation-errors
    :wrapper-class
    type="number"
    v-model="value"
    v-model:has-errors="hasErrors"
  />
</template>
