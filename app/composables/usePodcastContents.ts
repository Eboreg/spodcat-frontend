export default function usePodcastContents(podcastSlug: string) {
  const result = useQuery({
    key: () => ["podcast", podcastSlug, "content"],
    query: ({ signal }) => $fetch(`/api/podcasts/${podcastSlug}/contents`, { signal }),
  });

  return { contents: result.data, ...result };
}
