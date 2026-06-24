<script setup lang="ts">
const emit = defineEmits<{ click: [MouseEvent] }>();
const props = defineProps<{
  disabled?: boolean;
  href?: string;
  newTab?: boolean;
  route?: string;
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
  <a
    v-if="href"
    :href="href"
    :rel="newTab ? 'noopener noreferrer' : ''"
    :target="newTab ? '_blank' : '_self'"
    @click="onClick"
  >
    <slot />
  </a>
  <NuxtLink v-else-if="route" :to="route" @click="onClick">
    <slot />
  </NuxtLink>
  <span v-else @click="onClick">
    <slot />
  </span>
</template>
