import { ChallengeModel } from "~/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const podcast = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl("v2/challenges/", event);
  const response = await $fetch<ChallengeModel>(url, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "POST",
    body: { podcast },
  });

  return response;
});
