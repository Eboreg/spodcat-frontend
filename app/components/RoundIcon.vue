<script setup lang="ts">
import type { Theme } from "@/utils";
import type { LucideIcon } from "@lucide/vue";

interface ImageIconData {
  type: "image";
  value: string;
}

interface TextIconData {
  type: "text";
  value: string;
}

interface IconIconData {
  type: "icon";
  value: string | LucideIcon;
}

type IconData = ImageIconData | TextIconData | IconIconData;

const props = defineProps<{ data: Partial<IconData>[]; theme?: Theme }>();
const iconData = computed(() => props.data.find((data) => !!data.value) as IconData | undefined);
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
  <div v-else-if="iconData?.type === 'icon'" :class="classes">
    <SpodcatIcon :icon="iconData.value" />
  </div>
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

  &.small {
    font-size: 16px;
  }
}
</style>
