<script setup lang="ts">
import type { Component } from "vue";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    is?: string | Component;
    newTab?: boolean;
    noLink?: boolean;
    to?: string;
  }>(),
  { is: "span" },
);
const emit = defineEmits<{ click: [MouseEvent] }>();
const target = computed(() => (props.newTab ? "_blank" : "_self"));

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
  } else {
    emit("click", event);
  }
}
</script>

<template>
  <NuxtLink v-if="!noLink" :class="{ disabled }" :target :to @click="onClick">
    <slot />
  </NuxtLink>
  <component :is v-else :class="{ disabled }" :disabled @click="onClick">
    <slot />
  </component>
</template>
