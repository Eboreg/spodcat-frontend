<script setup lang="ts">
import type { Theme } from "@/utils";
import { MaterialSymbol } from "@/components";
import { computed } from "vue";

interface IconData {
  type: "image" | "text" | "material-symbol";
  value?: string | null;
}

const props = defineProps<{ data: IconData[]; theme?: Theme }>();
const iconData = computed(() => props.data.find((data) => !!data.value));
const classes = computed(() => `round-icon theme-${props.theme ?? "primary"}`);
const numberClass = computed(() =>
  iconData.value?.type === "text" && iconData.value.value!.length > 3 ? "small" : "",
);
</script>

<template>
  <img v-if="iconData?.type === 'image'" :src="iconData.value!" alt="" :class="classes" />
  <div v-else-if="iconData?.type === 'text'" :class="`${classes} ${numberClass}`">
    {{ iconData.value }}
  </div>
  <MaterialSymbol
    v-else-if="iconData?.type === 'material-symbol' && iconData.value"
    :class="classes"
    :icon="iconData.value"
  />
</template>

<style scoped lang="scss">
.round-icon {
  align-items: center;
  border-radius: 100%;
  border-style: outset;
  display: flex;
  flex: 0 0 auto;
  font-size: 16px;
  font-weight: bold;
  height: 35px;
  justify-content: center;
  width: 35px;

  @include minsize(sm) {
    font-size: 20px;
    height: 38px;
    width: 38px;
  }

  &.material-symbols-outlined {
    font-size: 24px;
  }

  &.small {
    font-size: 16px;
  }
}
</style>
