import { podcastKey } from "@/symbols";

export function usePodcast(slug: string) {
  const result = useQuery({
    key: () => ["podcast", slug],
    query: () => $fetch(`/api/podcasts/${slug}`),
  });

  provide(podcastKey, result.data);

  return { podcast: result.data, ...result };
}
