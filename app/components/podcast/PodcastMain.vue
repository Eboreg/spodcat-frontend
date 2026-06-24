<script setup lang="ts">
import { podcastKey } from "@/symbols";

const podcast = inject(podcastKey);
</script>

<template>
  <main class="content-width pt-half column-gap-half" :class="podcast?.slug ?? ''">
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
  display: grid;
  grid-template-areas: "header" "before" "aside" "content";
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, min-content);

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
