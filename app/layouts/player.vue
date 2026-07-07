<script setup lang="ts">
import useMessageStore from "@/composables/useMessageStore";

const messages = useMessageStore();
</script>

<template>
  <div id="player">
    <slot />
    <Toast v-for="toast in messages.toasts" :key="toast.id" :toast />
  </div>
</template>

<style scoped lang="scss">
#player {
  display: flex;
  height: 100dvh;
  left: 0;
  position: absolute;
  width: 100%;
}

.player-enter-active,
.player-leave-active {
  transition: top var(--spod-player-transition-duration);
  z-index: 20;
}

.player-enter-from,
.player-leave-to {
  top: 100%;
}

.player-enter-to,
.player-leave-from {
  top: 0%;
}
</style>
