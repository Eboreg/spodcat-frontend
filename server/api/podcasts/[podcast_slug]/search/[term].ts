import type { PartialEpisodePolymorphicModel, PartialPostPolymorphicModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const freetext = getRouterParam(event, "term");
  const podcast = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl("v2/podcast-contents/", event);
  const response = await $fetch<(PartialEpisodePolymorphicModel | PartialPostPolymorphicModel)[]>(
    url,
    {
      headers: { Accept: "application/json" },
      query: { freetext, podcast },
    },
  );

  return response;
});
