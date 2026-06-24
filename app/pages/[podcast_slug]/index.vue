<script setup lang="ts">
import { detectLocale } from "@/utils";
import { podcastSlugKey } from "~/symbols";

const { setLocale } = useI18n();
const route = useRoute();
const { podcast } = usePodcast(route.params.podcast_slug as string);
const { contents, isLoading: isContentsLoading } = usePodcastContents(
  route.params.podcast_slug as string,
);

provide(podcastSlugKey, route.params.podcast_slug as string);
useSpodcatHead({ podcast });
watchEffect(async () => {
  await setLocale(detectLocale(podcast.value?.language));
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
