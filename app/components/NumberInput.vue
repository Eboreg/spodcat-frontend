<script setup lang="ts">
const props = defineProps<{
  id: string;
  label?: string;
  validationErrors?: Record<string, string[]>;
  wrapperClass?: string;
}>();
const rawValue = ref<string | number>();
const value = defineModel<number>();
const hasErrors = defineModel<boolean>("hasErrors");

watch(rawValue, () => {
  console.log("watch rawvalue", rawValue.value, typeof rawValue.value);
  if (typeof rawValue.value === "number") value.value = rawValue.value;
  else value.value = undefined;
});
</script>

<template>
  <Input
    :id
    :label
    :validation-errors
    :wrapper-class
    type="number"
    v-model="rawValue"
    v-model:has-errors="hasErrors"
  />
</template>
