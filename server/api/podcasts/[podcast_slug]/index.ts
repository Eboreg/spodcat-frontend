import type { PodcastModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl(`v2/podcasts/${slug}/`, event);

  return $fetch<PodcastModel>(url);
});
