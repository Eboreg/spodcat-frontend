import type { EpisodeModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const podcast = getRouterParam(event, "podcast_slug");
  const slug = getRouterParam(event, "episode_slug");
  const url = makeBackendUrl("v2/episodes/", event);
  const response = await $fetch<EpisodeModel[]>(url.toString(), { query: { podcast, slug } });

  return response[0];
});
