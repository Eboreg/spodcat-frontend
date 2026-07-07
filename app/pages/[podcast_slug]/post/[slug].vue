<script setup lang="ts">
import { podcastSlugKey } from "@/symbols";
import { detectLocale, ping } from "@/utils";
import usePodcast from "~/composables/usePodcast";
import usePost from "~/composables/usePost";
import useSpodcatHead from "~/composables/useSpodcatHead";

const route = useRoute();
const podcastSlug = route.params.podcast_slug as string;
const slug = route.params.slug as string;
const { podcast } = usePodcast(podcastSlug);
const { post } = usePost(podcastSlug, slug);
const { setLocale } = useI18n();

provide(podcastSlugKey, podcastSlug);
useSpodcatHead({ podcast, post });

watchEffect(() => {
  setLocale(detectLocale(podcast.value?.language));
});

watchEffect(() => {
  if (post.value) ping(`v2/posts/${post.value.id}/ping/`);
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
