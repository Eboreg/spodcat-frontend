import type { PartialPodcastModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const url = makeBackendUrl("v2/podcasts/", event);

  return $fetch<PartialPodcastModel[]>(url);
});
