import type { CommentModel } from "@/types/api";

export default defineEventHandler(async (event) => {
  const podcast_content = getRouterParam(event, "id");
  const url = makeBackendUrl("v2/comments/", event);

  return $fetch<CommentModel[]>(url, { query: { podcast_content } });
});
