export default function useEpisode(podcastSlug: string, episodeSlug: string) {
  const result = useQuery({
    key: () => ["podcast", podcastSlug, "episode", episodeSlug],
    query: ({ signal }) =>
      $fetch(`/api/podcasts/${podcastSlug}/episode/${episodeSlug}`, { signal }),
  });

  return { episode: result.data, ...result };
}
