<script setup lang="ts">
import usePodcast from "~/composables/usePodcast";
import usePost from "~/composables/usePost";
import useSpodcatHead from "~/composables/useSpodcatHead";
import { podcastSlugKey } from "~/symbols";
import { detectLocale, pling } from "~/utils";

const route = useRoute();
const podcastSlug = route.params.podcast_slug as string;
const slug = route.params.slug as string;
const { podcast } = usePodcast(podcastSlug);
const { post } = usePost(podcastSlug, slug);
const { setLocale } = useI18n();

provide(podcastSlugKey, podcastSlug);
useSpodcatHead({ podcast, post });

watch(podcast, () => setLocale(detectLocale(podcast.value?.language)), { immediate: true });

watchEffect(() => {
  if (post.value) pling(`posts/${post.value.id}/pling/`);
});
</script>

<template>
  <PodcastMain>
    <PodcastGoToButton />
    <div v-if="post?.is_draft" class="draft my-half">
      DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT DRAFT
    </div>
    <PostCard :post expand>
      <ContentDescription :content="post" />
    </PostCard>
  </PodcastMain>
</template>

<style scoped lang="scss">
.draft {
  background-color: yellow;
  color: black;
  font-weight: bold;
  white-space: nowrap;
}
</style>
