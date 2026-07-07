<script setup lang="ts">
export type ErrorsProps = {
  errors?: string[];
  gridArea?: string;
};

defineProps<ErrorsProps>();
</script>

<template>
  <div class="errors font-size-xs">
    <div v-for="(error, index) in errors" :key="index" class="text-error light">{{ error }}</div>
  </div>
</template>

<style scoped>
.errors {
  grid-area: v-bind(gridArea);
}
</style>
