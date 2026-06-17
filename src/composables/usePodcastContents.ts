import { listPodcastContents } from "@/api";
import { computed } from "vue";
import { defineColadaLoader } from "vue-router/experimental/pinia-colada";

export const podcastContentsLoader = defineColadaLoader("/[podcast_slug]/", {
  async query(route, { signal }) {
    return listPodcastContents(route.params.podcast_slug, signal);
  },
  key: (route) => ["podcast", route.params.podcast_slug, "content"],
  lazy: true,
  staleTime: 60000,
});

export function usePodcastContents() {
  const loaded = podcastContentsLoader();
  const contents = computed(() => (loaded.isLoading.value ? undefined : loaded.data.value));

  return { contents, ...loaded };
}
