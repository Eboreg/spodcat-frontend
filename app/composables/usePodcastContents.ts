export function usePodcastContents(podcastSlug: string) {
  const result = useQuery({
    key: () => ["podcast", podcastSlug, "content"],
    query: () => $fetch(`/api/podcasts/${podcastSlug}/contents`),
  });

  return { contents: result.data, ...result };
}
