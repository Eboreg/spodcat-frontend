import type { SeasonModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const podcast = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl("v2/seasons/", event);

  return $fetch<SeasonModel[]>(url, { query: { podcast } });
});
