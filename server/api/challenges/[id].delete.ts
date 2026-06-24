import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const challengeId = getRouterParam(event, "id");
  const url = makeBackendUrl(`v2/challenges/${challengeId}/`, event);
  const response = await $fetch(url, {
    headers: { Accept: "application/json" },
    method: "DELETE",
  });

  return response;
});
