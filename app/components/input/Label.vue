<script setup lang="ts">
export type LabelProps = {
  for?: string;
  length?: number;
  maxlength?: number;
  gridArea?: string;
};

defineProps<LabelProps>();
</script>

<template>
  <div class="row space-between font-size-xs label">
    <label :for="$props.for"><slot /></label>
    <div v-if="maxlength !== undefined && length !== undefined" :class="{ 'text-error light': length > maxlength }">
      {{ length }}/{{ maxlength }}
    </div>
  </div>
</template>

<style scoped>
.label {
  grid-area: v-bind(gridArea);
}
</style>
