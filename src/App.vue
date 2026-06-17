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

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
