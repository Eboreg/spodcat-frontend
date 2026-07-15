import type { SeasonModel } from "~/types/api";

export default defineEventHandler(async (event) => {
  const podcast = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl("seasons/", event);

  return $fetch<SeasonModel[]>(url, { query: { podcast } });
});
