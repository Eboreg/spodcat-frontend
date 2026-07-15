import type { ChallengeModel } from "~/types/api";

export default defineEventHandler(async (event) => {
  const podcast = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl("challenges/", event);

  return $fetch<ChallengeModel>(url, { method: "POST", body: { podcast } });
});
