<script setup lang="ts">
import type { PlacedMessage } from "@/composables/useMessageStore";

const props = defineProps<{ message: PlacedMessage }>();
const { removeMessage } = useMessageStore();

useTimeoutFn(() => removeMessage(props.message.id), 5000);
</script>

<template>
  <div class="row space-between" :class="`theme-${message.level}`">
    <div class="p-half">{{ message.text }}</div>
    <CloseIcon @click="removeMessage(message.id)" class="p-half" />
  </div>
</template>
