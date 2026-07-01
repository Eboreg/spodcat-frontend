export default function usePost(podcastSlug: string, postSlug: string) {
  const result = useQuery({
    key: () => ["podcast", podcastSlug, "post", postSlug],
    query: ({ signal }) => $fetch(`/api/podcasts/${podcastSlug}/post/${postSlug}`, { signal }),
  });

  return { post: readonly(result.data), ...result };
}
