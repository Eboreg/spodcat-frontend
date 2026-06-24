import { getPodcastBySlug } from "@/api";
import { podcastKey } from "@/symbols";
import { computed, provide } from "vue";

import { defineColadaLoader } from "vue-router/experimental/pinia-colada";

export const podcastLoader = defineColadaLoader("/[podcast_slug]/", {
  async query(route, { signal }) {
    return getPodcastBySlug(route.params.podcast_slug, signal);
  },
  key: (route) => ["podcast", route.params.podcast_slug],
  lazy: true,
  staleTime: 60000,
});

export function usePodcast() {
  const loaded = podcastLoader();
  const podcast = computed(() => (loaded.isLoading.value ? undefined : loaded.data.value));

  provide(podcastKey, podcast);

  return { podcast, ...loaded };
}
