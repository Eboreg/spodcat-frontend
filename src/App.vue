<script setup lang="ts">
import { RouterView } from "vue-router";
import useAudioStore from "@/composables/useAudioStore";
import { Audio, PlayerBar, Toast } from "@/components";
import useMessageStore from "./composables/useMessageStore";

const audio = useAudioStore();
const messages = useMessageStore();
</script>

<template>
  <RouterView />
  <Toast v-for="toast in messages.toasts" :toast="toast" :key="toast.id" />
  <Audio :start="$route.query.start" />
  <footer v-if="audio.episode && audio.podcast">
    <PlayerBar :episode="audio.episode" :podcast="audio.podcast" />
  </footer>
</template>

<style scoped lang="scss">
footer {
  bottom: 0;
  box-shadow: 0 0 10px -3px black;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  width: 100%;
  z-index: var(--spod-zindex-footer);
}
</style>
