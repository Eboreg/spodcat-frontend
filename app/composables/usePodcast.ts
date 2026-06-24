import { podcastKey } from "@/symbols";

export function usePodcast(slug: MaybeRefOrGetter<string>) {
  const result = useQuery({
    key: () => ["podcast", toValue(slug)],
    query: () => $fetch(`/api/podcasts/${toValue(slug)}`),
    staleTime: 60000,
  });
  const podcast = computed(() => (result.isLoading.value ? undefined : result.data.value));

  provide(podcastKey, podcast);

  return { podcast, ...result };
}
