<script setup lang="ts">
import type { PlacedMessage } from "@/composables/useMessageStore";
import useMessageStore from "@/composables/useMessageStore";
import { MaterialSymbol } from "@/components";
import { useTimeoutFn } from "@vueuse/core";

const props = defineProps<{ message: PlacedMessage }>();
const { removeMessage } = useMessageStore();
const {} = useTimeoutFn(() => removeMessage(props.message.id), 5000);
</script>

<template>
  <div class="row" :class="`theme-${message.level}`">
    <div class="text p-half">{{ message.text }}</div>
    <MaterialSymbol icon="close" class="close-icon p-half" @click="removeMessage(message.id)" />
  </div>
</template>

<style scoped lang="scss">
.text {
  flex-grow: 1;
}
.close-icon {
  font-size: 20px;
}
</style>
