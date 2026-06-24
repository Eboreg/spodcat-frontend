<script setup lang="ts">
const audio = useAudioStore();
const messages = useMessageStore();
</script>

<template>
  <div id="app" class="column">
    <div id="main-container" class="align-center column">
      <NuxtPage />
    </div>
    <Toast v-for="toast in messages.toasts" :toast="toast" :key="toast.id" />
    <Audio :start="$route.query.start" />
    <footer v-if="audio.episode && audio.podcast">
      <PlayerBar :episode="audio.episode" :podcast="audio.podcast" />
    </footer>
  </div>
  <div>
    <NuxtRouteAnnouncer />
  </div>
</template>

<style scoped lang="scss">
#app {
  height: 100dvh;
  overflow: hidden;
  width: 100dvw;
}

#main-container {
  flex: 1 1 auto;
  overflow-y: scroll;
  width: 100%;
}

footer {
  box-shadow: 0 0 10px -3px black;
}
</style>
