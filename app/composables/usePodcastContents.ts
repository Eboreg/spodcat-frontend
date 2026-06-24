export function usePodcastContents(podcastSlug: MaybeRefOrGetter<string>) {
  const result = useQuery({
    key: () => ["podcast", toValue(podcastSlug), "content"],
    query: () => $fetch(`/api/podcasts/${toValue(podcastSlug)}/contents`),
    staleTime: 60000,
  });
  const contents = computed(() => (result.isLoading.value ? undefined : result.data.value));

  return { contents, ...result };
}
