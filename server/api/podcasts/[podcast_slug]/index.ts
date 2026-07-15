import type { PodcastModel } from "~/types/api";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl(`podcasts/${slug}/`, event);

  return $fetch<PodcastModel>(url);
});
