import type { CommentModel } from "@/types/api";
import { makeBackendUrl } from "@/utils";

export default defineEventHandler(async (event) => {
  const podcast_content = getRouterParam(event, "id");
  const url = makeBackendUrl("v2/comments/", event);
  const response = await $fetch<CommentModel[]>(url, {
    headers: { Accept: "application/json" },
    query: { podcast_content },
  });

  return response;
});
