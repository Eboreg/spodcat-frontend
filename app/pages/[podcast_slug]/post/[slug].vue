<script setup lang="ts">
import { detectLocale, ping } from "@/utils";
import { podcastSlugKey } from "@/symbols";

const route = useRoute();
const { podcast } = usePodcast(route.params.podcast_slug as string);
const { post } = usePost(route.params.podcast_slug as string, route.params.slug as string);
const { setLocale } = useI18n();

provide(podcastSlugKey, route.params.podcast_slug as string);
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
      <ContentDescription content-type="post" :content="post" />
    </PostCard>
  </PodcastMain>
</template>
