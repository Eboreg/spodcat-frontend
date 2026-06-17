<script setup lang="ts">
import type { PodcastContentModel, PodcastContentType } from "@/types/api";
import { inject, ref } from "vue";
import { Comments, Loading, Video } from "@/components";
import { podcastKey } from "@/symbols";

const videoConsent = ref<boolean>(false);
const podcast = inject(podcastKey);
const props = defineProps<{
  contentType: PodcastContentType;
  content?: PodcastContentModel;
}>();
</script>

<template>
  <div class="gap-single px-single column pb-single">
    <Loading v-if="!content" :opacity="0.5" height="100px" />
    <div
      v-if="content?.description_html"
      class="description"
      v-html="content.description_html"
    ></div>
    <Video
      v-for="video in content?.videos"
      :video="video"
      :key="video.id"
      @consent-click="videoConsent = true"
      :consent="videoConsent"
    />
    <slot />
    <Comments
      v-if="podcast?.enable_comments"
      :content-type="contentType"
      :content-slug="content?.slug"
    />
  </div>
</template>

<style scoped lang="scss">
.description {
  line-height: 1.5;

  & > :deep(:first-child) {
    margin-top: 0;
  }

  :deep(a:not(.button)) {
    font-weight: bold;
  }

  :deep(p) {
    font-size: var(--spod-font-size-article);
    margin: 0.75em 0;
  }

  :deep(img) {
    border-radius: var(--spod-border-radius);
  }
}
</style>
