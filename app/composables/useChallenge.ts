import { podcastSlugKey } from "~/symbols";

export default function useChallenge() {
  const podcastSlug = inject(podcastSlugKey);
  const { data: challenge, refetch } = useQuery({
    key: () => ["podcast", podcastSlug!, "challenge"],
    query: ({ signal }) =>
      $fetch(`/api/podcasts/${podcastSlug}/challenges`, { method: "POST", signal }),
    enabled: () => !!podcastSlug,
  });

  async function resetChallenge() {
    challenge.value = undefined;
    await refetch();
  }

  return { challenge: readonly(challenge), resetChallenge };
}
