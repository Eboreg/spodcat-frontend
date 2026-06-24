<script lang="ts">
import { podcastLoader, usePodcast } from "@/composables/usePodcast";
import { defineColadaLoader } from "vue-router/experimental/pinia-colada";
import { getPostBySlug } from "@/api";

const usePost = defineColadaLoader("/[podcast_slug]/post/[slug]", {
  async query(route, { signal }) {
    return getPostBySlug(route.params.podcast_slug, route.params.slug, signal);
  },
  key: (route) => ["podcast", route.params.podcast_slug, "post", route.params.slug],
  staleTime: 60000,
});

export { usePost, usePodcast, podcastLoader };
</script>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import useSpodcatHead from "@/composables/useSpodcatHead";
import { ContentDescription, PostCard } from "@/components";
import { GoToPodcastButton, PodcastMain } from "@/components/podcast";
import { detectLocale } from "@/i18n";

const { podcast } = usePodcast();
const { data: postData, isLoading: isPostLoading } = usePost();
const post = computed(() => (isPostLoading.value ? undefined : postData.value));
const { locale } = useI18n();

useSpodcatHead({ podcast, post });
watchEffect(() => {
  locale.value = detectLocale(podcast.value?.language);
});
</script>

<template>
  <PodcastMain>
    <GoToPodcastButton />
    <PostCard :post="post" expand>
      <ContentDescription content-type="post" :content="post" />
    </PostCard>
  </PodcastMain>
</template>
