import type { PartialPodcastModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const url = makeBackendUrl("v2/podcasts/", event);
  const response = await $fetch<PartialPodcastModel[]>(url, {
    headers: { Accept: "application/json" },
  });

  return response;
});
