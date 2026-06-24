import type { PodcastModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl(`v2/podcasts/${slug}/`, event);
  const response = await $fetch<PodcastModel>(url, {
    headers: { Accept: "application/json" },
  });

  return response;
});
