export default defineEventHandler(async (event) => {
  const challengeId = getRouterParam(event, "id");
  const url = makeBackendUrl(`challenges/${challengeId}/`, event);

  return $fetch(url, { method: "DELETE" });
});
