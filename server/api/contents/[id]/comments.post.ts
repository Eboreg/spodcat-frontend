import type { CommentModel } from "@/types/api";
import { makeBackendUrl } from "@/utils";

export default defineEventHandler(async (event) => {
  const contentId = getRouterParam(event, "id");
  const body = await readBody(event);
  const url = makeBackendUrl("v2/comments/", event);

  return $fetch<CommentModel>(url, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: { podcast_content: contentId, ...body },
    method: "POST",
  });
});
