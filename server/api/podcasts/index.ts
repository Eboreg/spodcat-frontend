import type { PartialPodcastModel } from "~/types/api";

export default defineEventHandler(async (event) => {
  const url = makeBackendUrl("podcasts/", event);

  return $fetch<PartialPodcastModel[]>(url);
});
