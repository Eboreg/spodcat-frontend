<script setup lang="ts">
import type { PodcastContentModel } from "~/types/api";
import { podcastKey } from "~/symbols";

const props = defineProps<{ content?: PodcastContentModel }>();
const consent = shallowRef<boolean>(false);
const podcast = inject(podcastKey);
const show = computed(() => !!props.content || podcast?.value?.enable_comments);
</script>

<template>
  <div v-if="show" class="gap-single px-single column pb-single">
    <div v-if="content?.description_html" class="description" v-html="content.description_html" />

    <Video
      v-for="video in content?.videos"
      :key="video.id"
      :consent
      :video
      @consent-click="consent = true"
    />

    <slot />

    <ClientOnly v-if="podcast?.enable_comments">
      <Comments :content-id="content?.id" />
      <CommentForm :content-id="content?.id" />
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.description {
  line-height: 1.5;

  & > :deep(:first-child) {
    margin-top: 0;
  }

  & > :deep(:last-child) {
    margin-bottom: 0;
  }

  :deep(a:not(.button)) {
    font-weight: bold;
  }

  :deep(p) {
    font-size: var(--spod-font-size-article);
    margin: 0.75em 0;
  }

  :deep(img) {
    border-radius: var(--spod-border-radius-md);
  }
}
</style>
