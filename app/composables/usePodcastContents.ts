export function usePodcastContents(podcastSlug: string) {
  const result = useQuery({
    key: () => ["podcast", podcastSlug, "content"],
    query: () => $fetch(`/api/podcasts/${podcastSlug}/contents`),
    staleTime: 60000,
  });

  return { contents: result.data, ...result };
}
