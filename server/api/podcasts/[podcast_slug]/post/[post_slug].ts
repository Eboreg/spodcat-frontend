import type { PostModel } from "@/types/api";
import { makeBackendUrl } from "~/utils";

export default defineEventHandler(async (event) => {
  const podcast = getRouterParam(event, "podcast_slug");
  const slug = getRouterParam(event, "post_slug");
  const url = makeBackendUrl("v2/posts/", event);
  const response = await $fetch<PostModel[]>(url, {
    headers: { Accept: "application/json" },
    query: { podcast, slug },
  });

  return response[0];
});
