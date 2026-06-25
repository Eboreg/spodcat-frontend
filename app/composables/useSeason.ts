import { getSeasonTheme } from "@/utils";

export default function useSeason(
  podcastSlug: MaybeRefOrGetter<string | undefined>,
  seasonId: MaybeRefOrGetter<number | null | undefined>,
) {
  const result = useQuery({
    key: () => ["podcast", toValue(podcastSlug)!, "seasons"],
    query: () => $fetch(`/api/podcasts/${toValue(podcastSlug)!}/seasons`),
    enabled: () => !!toValue(podcastSlug) && !!toValue(seasonId),
  });
  const season = computed(() => result.data.value?.find((s) => s.id === toValue(seasonId)));
  const theme = computed(() => (season.value ? getSeasonTheme(season.value.number) : "primary"));

  return { season, theme, ...result };
}
