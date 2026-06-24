export function usePost(podcastSlug: MaybeRefOrGetter<string>, postSlug: MaybeRefOrGetter<string>) {
  const result = useQuery({
    key: () => ["podcast", toValue(podcastSlug), "post", toValue(postSlug)],
    query: () => $fetch(`/api/podcasts/${toValue(podcastSlug)}/post/${toValue(postSlug)}`),
    staleTime: 60000,
  });
  const post = computed(() => (result.isLoading.value ? undefined : result.data.value));

  return { post, ...result };
}
