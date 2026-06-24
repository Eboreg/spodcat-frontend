import {
  deleteChallenge as apiDeleteChallenge,
  postComment as apiPostComment,
  createChallenge,
  listComments,
} from "@/api";
import type { ChallengeModel, PodcastContentType } from "@/types/api";
import { type MaybeRefOrGetter, computed, ref, toRef, toValue, watch } from "vue";

import { useQuery } from "@pinia/colada";

export default function useComments(
  contentType: MaybeRefOrGetter<PodcastContentType>,
  podcastSlug: MaybeRefOrGetter<string | undefined>,
  contentSlug: MaybeRefOrGetter<string | undefined>,
) {
  const {
    data: comments,
    isLoading,
    refetch,
    error,
  } = useQuery({
    key: () => [
      "podcast",
      toValue(podcastSlug)!,
      toValue(contentType),
      toValue(contentSlug)!,
      "comments",
    ],
    query: async ({ signal }) =>
      listComments(toValue(podcastSlug)!, toValue(contentSlug)!, toValue(contentType), signal),
    staleTime: 60000,
    enabled: () => !!toValue(podcastSlug) && !!toValue(contentSlug),
  });
  const isSubmitting = ref<boolean>(false);
  const challenge = ref<ChallengeModel>();
  const canSubmit = computed(
    () =>
      !isSubmitting.value && !!challenge.value && !!toValue(podcastSlug) && !!toValue(contentSlug),
  );

  function deleteChallenge() {
    if (challenge.value) apiDeleteChallenge(challenge.value.id);
  }

  async function resetChallenge(podcastSlug: string) {
    challenge.value = await createChallenge(podcastSlug);
  }

  async function postComment(
    name: string,
    text: string,
    challengeAnswer: string,
    signal?: AbortSignal,
  ) {
    const _podcastSlug = toValue(podcastSlug);
    const _contentSlug = toValue(contentSlug);

    if (_podcastSlug && _contentSlug) {
      isSubmitting.value = true;
      try {
        const comment = await apiPostComment(
          name,
          text,
          challenge.value!.id,
          challengeAnswer,
          _podcastSlug,
          _contentSlug,
          toValue(contentType),
          signal,
        );
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
