<script setup lang="ts">
import type { PodcastContentModel, PodcastContentType } from "@/types/api";
import { podcastKey } from "@/symbols";

const videoConsent = ref<boolean>(false);
const podcast = inject(podcastKey);
const props = defineProps<{
  contentType: PodcastContentType;
  content?: PodcastContentModel;
}>();
const show = computed(() => !!props.content || podcast?.value?.enable_comments);
</script>

<template>
  <div v-if="show" class="gap-single px-single column pb-single">
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

    <ClientOnly>
      <Comments
        v-if="podcast?.enable_comments"
        :content-type="contentType"
        :content-id="content?.id"
      />
    </ClientOnly>
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
