export function usePost(podcastSlug: string, postSlug: string) {
  const result = useQuery({
    key: () => ["podcast", podcastSlug, "post", postSlug],
    query: () => $fetch(`/api/podcasts/${podcastSlug}/post/${postSlug}`),
    staleTime: 60000,
  });

  return { post: result.data, ...result };
}
