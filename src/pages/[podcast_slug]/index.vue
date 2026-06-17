<script lang="ts">
import { usePodcast, podcastLoader } from "@/composables/usePodcast";
import { usePodcastContents, podcastContentsLoader } from "@/composables/usePodcastContents";

export { usePodcast, usePodcastContents, podcastLoader, podcastContentsLoader };
</script>

<script setup lang="ts">
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import useSpodcatHead from "@/composables/useSpodcatHead";
import { EpisodeCard } from "@/components/episode";
import { PodcastMain } from "@/components/podcast";
import { Loading, PostCard } from "@/components";
import { detectLocale } from "@/i18n";

const { podcast } = usePodcast();
const { contents, isLoading: isContentsLoading } = usePodcastContents();
const { locale } = useI18n();

useSpodcatHead({ podcast });
watchEffect(() => {
  locale.value = detectLocale(podcast.value?.language);
});
</script>

<template>
  <PodcastMain>
    <template #before>
      <div class="dashed-border before" v-if="podcast?.description_html">
        <div class="podcast-description bg p-single" v-html="podcast.description_html"></div>
      </div>
    </template>

    <div class="column gap-half">
      <Loading v-if="isContentsLoading" height="100px" />
      <template v-for="content in contents" :key="content.id">
        <EpisodeCard v-if="content.resourcetype === 'episode'" :episode="content" :expand="false" />
        <PostCard v-else-if="content.resourcetype === 'post'" :post="content" :expand="false" />
      </template>
    </div>
  </PodcastMain>
</template>

<style scoped lang="scss">
.podcast-description {
  line-height: 1.5;

  & > :deep(:first-child) {
    margin-top: 0;
  }

  & > :deep(:last-child) {
    margin-bottom: 0;
  }

  :deep(a) {
    font-weight: bold;
  }
}
</style>
