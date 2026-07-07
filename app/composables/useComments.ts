import useChallenge from "./useChallenge";

export default function useComments(contentId: MaybeRefOrGetter<string | undefined>) {
  const { data: comments, refetch } = useQuery({
    key: () => ["content", toValue(contentId)!, "comments"],
    query: ({ signal }) => $fetch(`/api/contents/${toValue(contentId)}/comments`, { signal }),
    enabled: () => !!toValue(contentId),
  });
  const { challenge, resetChallenge } = useChallenge();
  const isSubmitting = shallowRef<boolean>(false);

  async function postComment(name: string, text: string, challengeAnswer: string | number) {
    const _contentId = toValue(contentId);

    if (_contentId) {
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
        resetChallenge();
        if (comment.is_approved) await refetch();
      } finally {
        isSubmitting.value = false;
      }
    }
  }

  return {
    challenge,
    comments: readonly(comments),
    isSubmitting: readonly(isSubmitting),
    postComment,
  };
}
