<script setup lang="ts">
import useAudioStore from "~/composables/useAudioStore";
import useMessageStore from "~/composables/useMessageStore";

const audio = useAudioStore();
const messages = useMessageStore();
</script>

<template>
  <div id="app" class="column">
    <div id="scroll-container" class="column fill">
      <div id="main-container" class="align-center column">
        <slot />
        <Toast v-for="toast in messages.toasts" :key="toast.id" :toast />
      </div>
    </div>
    <footer v-if="audio.episode">
      <PlayerBar />
    </footer>
  </div>
</template>

<style scoped lang="scss">
#app {
  height: 100dvh;
  overflow: hidden;
  position: absolute;
  width: 100dvw;
}

#scroll-container {
  overflow-y: auto;
  position: relative;
}

#main-container {
  flex: 1 1 auto;
  overflow-y: scroll;
  width: 100%;
}

footer {
  box-shadow: 0 0 10px -3px black;
}

.player-leave-active {
  transition-delay: var(--spod-player-transition-duration);
}
</style>
