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
  if (post.value) pling(`v2/posts/${post.value.id}/pling/`);
});
</script>

<template>
  <PodcastMain>
    <PodcastGoToButton />
    <PostCard :post expand>
      <ContentDescription :content="post" />
    </PostCard>
  </PodcastMain>
</template>
