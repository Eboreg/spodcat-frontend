<script setup lang="ts">
const emit = defineEmits<{ click: [MouseEvent] }>();
const props = defineProps<{
  disabled?: boolean;
  element?: string;
  newTab?: boolean;
  noLink?: boolean;
  to?: string;
}>();

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
  } else {
    emit("click", event);
  }
}
</script>

<template>
  <NuxtLink
    v-if="!noLink"
    :class="{ disabled }"
    :target="newTab ? '_blank' : '_self'"
    :to
    @click="onClick"
  >
    <slot />
  </NuxtLink>
  <component v-else :is="element ?? 'span'" :class="{ disabled }" @click="onClick">
    <slot />
  </component>
</template>
