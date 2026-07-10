<script setup lang="ts">
import type { PlacedMessage } from "~/composables/useMessageStore";
import useMessageStore from "~/composables/useMessageStore";
import useTheme from "~/composables/useTheme";

const props = defineProps<{ message: PlacedMessage }>();
const { removeMessage } = useMessageStore();
const { themeClasses } = useTheme(() => ({ color: props.message.level }));

useTimeoutFn(() => removeMessage(props.message.id), 5000);
</script>

<template>
  <div class="row space-between" :class="themeClasses">
    <div class="p-half" v-html="message.text" />
    <CloseIcon class="p-half" @click="removeMessage(message.id)" />
  </div>
</template>
