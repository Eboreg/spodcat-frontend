<script setup lang="ts">
import PodcastBanner from "./PodcastBanner.vue";
import PodcastAside from "./PodcastAside.vue";
import { inject } from "vue";
import { podcastKey } from "@/symbols";

const podcast = inject(podcastKey);
</script>

<template>
  <main class="content-width pt-half" :class="podcast ? podcast.slug : ''">
    <PodcastBanner :podcast="podcast" />
    <slot name="before" />
    <div class="content">
      <slot />
    </div>
    <PodcastAside />
  </main>
</template>

<style scoped lang="scss">
main {
  column-gap: var(--spod-length-half);
  display: grid;
  grid-template-rows: repeat(3, min-content);

  grid-template-areas: "header" "before" "aside" "content";
  grid-template-columns: 1fr;

  & > * {
    margin-bottom: var(--spod-length-half);
  }

  @include minsize(md) {
    grid-template-areas: "header header" "before before" "content aside";
    grid-template-columns: 1fr 250px;
  }

  & > .content {
    grid-area: content;
    overflow-x: hidden;
  }

  & > :deep(.before) {
    grid-area: before;
  }

  & > aside {
    grid-area: aside;
  }

  & > header {
    grid-area: header;
  }
}
</style>
