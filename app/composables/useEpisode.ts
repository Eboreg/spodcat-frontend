export function useEpisode(podcastSlug: string, episodeSlug: string) {
  const result = useQuery({
    key: () => ["podcast", podcastSlug, "episode", episodeSlug],
    query: () => $fetch(`/api/podcasts/${podcastSlug}/episode/${episodeSlug}`),
  });

  return { episode: result.data, ...result };
}
