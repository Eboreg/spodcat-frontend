import type { ThemeColor } from "~/types";

const colors: ThemeColor[] = ["primary", "secondary", "tertiary", "gray-inverted"];

function getSeasonTheme(number: number): ThemeColor {
  return colors[number % (colors.length - 1)]!;
}

export default function useSeason(
  podcastSlug: MaybeRefOrGetter<string | undefined>,
  seasonId: MaybeRefOrGetter<number | null | undefined>,
) {
  const result = useQuery({
    key: () => ["podcast", toValue(podcastSlug)!, "seasons"],
    query: ({ signal }) => $fetch(`/api/podcasts/${toValue(podcastSlug)!}/seasons`, { signal }),
    enabled: () => !!toValue(podcastSlug) && !!toValue(seasonId),
  });
  const season = computed(() => result.data.value?.find((s) => s.id === toValue(seasonId)));
  const theme = computed(() => (season.value ? getSeasonTheme(season.value.number) : "primary"));

  return { season, theme, ...result };
}
