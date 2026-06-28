<script setup lang="ts">
import { detectLocale, ping } from "@/utils";
import { podcastSlugKey } from "@/symbols";
import useSpodcatHead from "~/composables/useSpodcatHead";
import usePodcast from "~/composables/usePodcast";
import usePost from "~/composables/usePost";

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
    <PostCard :post="post" expand>
      <ContentDescription :content="post" />
    </PostCard>
  </PodcastMain>
</template>
