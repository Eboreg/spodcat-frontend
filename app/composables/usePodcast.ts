import { podcastKey } from "@/symbols";

export default function usePodcast(slug: string) {
  const result = useQuery({
    key: () => ["podcast", slug],
    query: ({ signal }) => $fetch(`/api/podcasts/${slug}`, { signal }),
  });

  provide(podcastKey, result.data);

  return { podcast: result.data, ...result };
}
