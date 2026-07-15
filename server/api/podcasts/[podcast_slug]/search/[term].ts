import type { PartialEpisodePolymorphicModel, PartialPostPolymorphicModel } from "~/types/api";

export default defineEventHandler(async (event) => {
  const freetext = getRouterParam(event, "term");
  const podcast = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl("podcast-contents/", event);

  return $fetch<(PartialEpisodePolymorphicModel | PartialPostPolymorphicModel)[]>(url, {
    query: { freetext, podcast },
  });
});
