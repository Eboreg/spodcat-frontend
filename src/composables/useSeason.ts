import { listPodcastSeasons } from "@/api";
import { getSeasonTheme } from "@/utils";
import { useQuery } from "@pinia/colada";
import { computed, ref, toValue, type MaybeRefOrGetter } from "vue";

export default function useSeason(
  podcastSlug: MaybeRefOrGetter<string | undefined>,
  seasonId: MaybeRefOrGetter<number | null | undefined>,
) {
  const isLoading = ref<boolean>(false);
  const season = computed(() => result.data.value?.find((s) => s.id === toValue(seasonId)));
  const theme = computed(() => (season.value ? getSeasonTheme(season.value.number) : "primary"));

  const result = useQuery({
    key: () => ["podcast", toValue(podcastSlug)!, "seasons"],
    query: async () => {
      isLoading.value = true;
      try {
        return await listPodcastSeasons(toValue(podcastSlug)!);
      } finally {
        isLoading.value = false;
      }
    },
    staleTime: 60000,
    enabled: () => !!toValue(podcastSlug),
  });

  return { data: result.data, isLoading, season, theme };
}
