<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  icon: string;
  title?: string;
  size?: number;
  cursor?: string;
  fontSize?: number;
  onClick?: (event: PointerEvent) => void;
}>();
const cursor = props.cursor ?? (props.onClick ? "pointer" : "default");
const style = computed(() => {
  const results: string[] = [];

  if (props.fontSize ?? props.size) results.push(`font-size:${props.fontSize ?? props.size}px`);
  if (props.size) results.push(`height:${props.size}px;width:${props.size}px`);
  if (props.cursor) results.push(`cursor:${props.cursor}`);
  else if (props.onClick) results.push("cursor:pointer");

  return results.join(";");
});
</script>

<template>
  <span
    class="material-symbols-outlined icon"
    role="button"
    :title="title ?? ''"
    @click="onClick"
    :style="style"
  >
    {{ icon }}
  </span>
</template>

<style scoped lang="scss">
.icon {
  cursor: v-bind(cursor);
  font-variation-settings: "FILL" 1;
  overflow: hidden;
}
</style>
