<script setup lang="ts">
import usePodcast from "~/composables/usePodcast";
import usePodcastContents from "~/composables/usePodcastContents";
import useSpodcatHead from "~/composables/useSpodcatHead";
import { podcastSlugKey } from "~/symbols";
import { detectLocale, pling } from "~/utils";

const route = useRoute();
const slug = route.params.podcast_slug as string;
const { podcast } = usePodcast(slug);
const { contents } = usePodcastContents(slug);
const { setLocale } = useI18n();

provide(podcastSlugKey, slug);
useSpodcatHead({ podcast });
pling(`podcasts/${slug}/pling/`);
watch(podcast, () => setLocale(detectLocale(podcast.value?.language)), { immediate: true });
</script>

<template>
  <PodcastMain>
    <template #before>
      <div v-if="podcast?.description_html" class="dashed-border before">
        <div class="podcast-description bg p-single" v-html="podcast.description_html" />
      </div>
    </template>

    <div class="column gap-half">
      <Loading v-if="contents === undefined" height="150px" />
      <template v-for="content in contents" :key="content.id">
        <EpisodeCard v-if="content.resourcetype === 'episode'" :episode="content" />
        <PostCard v-else-if="content.resourcetype === 'post'" :post="content" />
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
