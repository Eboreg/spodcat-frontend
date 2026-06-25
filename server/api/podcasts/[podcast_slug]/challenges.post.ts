import { ChallengeModel } from "~/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const podcast = getRouterParam(event, "podcast_slug");
  const url = makeBackendUrl("v2/challenges/", event);

  return $fetch<ChallengeModel>(url, { method: "POST", body: { podcast } });
});
