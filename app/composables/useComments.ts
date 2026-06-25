import type { ChallengeModel } from "@/types/api";

export default function useComments(
  podcastSlug: MaybeRefOrGetter<string | undefined>,
  contentId: MaybeRefOrGetter<string | undefined>,
) {
  const {
    data: comments,
    isLoading,
    refetch,
    error,
  } = useQuery({
    key: () => ["content", toValue(contentId)!, "comments"],
    query: () => $fetch(`/api/contents/${toValue(contentId)}/comments`),
    enabled: () => !!toValue(contentId),
  });
  const isSubmitting = ref<boolean>(false);
  const challenge = ref<ChallengeModel>();
  const canSubmit = computed(
    () =>
      !isSubmitting.value && !!challenge.value && !!toValue(podcastSlug) && !!toValue(contentId),
  );

  function deleteChallenge() {
    if (challenge.value) {
      $fetch(`/api/challenges/${challenge.value.id}`, { method: "DELETE" });
    }
  }

  async function resetChallenge(podcastSlug: string) {
    challenge.value = await $fetch(`/api/podcasts/${podcastSlug}/challenges`, { method: "POST" });
  }

  async function postComment(name: string, text: string, challengeAnswer: string) {
    const _podcastSlug = toValue(podcastSlug);
    const _contentId = toValue(contentId);

    if (_podcastSlug && _contentId) {
      isSubmitting.value = true;
      try {
        const comment = await $fetch(`/api/contents/${_contentId}/comments`, {
          method: "POST",
          body: {
            name,
            text,
            challenge: challenge.value!.id,
            challenge_answer: challengeAnswer,
          },
        });
        await resetChallenge(_podcastSlug);
        if (comment.is_approved) await refetch();
      } finally {
        isSubmitting.value = false;
      }
    }
  }

  watch(toRef(podcastSlug), (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) resetChallenge(newValue);
  });

  return {
    comments,
    refetch,
    error,
    canSubmit,
    challenge,
    isLoading,
    deleteChallenge,
    postComment,
    resetChallenge,
  };
}
