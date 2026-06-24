export function useEpisode(
  podcastSlug: MaybeRefOrGetter<string>,
  episodeSlug: MaybeRefOrGetter<string>,
) {
  const result = useQuery({
    key: () => ["podcast", toValue(podcastSlug), "episode", toValue(episodeSlug)],
    query: () => $fetch(`/api/podcasts/${toValue(podcastSlug)}/episode/${toValue(episodeSlug)}`),
    staleTime: 60000,
  });
  const episode = computed(() => (result.isLoading.value ? undefined : result.data.value));

  return { episode, ...result };
}
