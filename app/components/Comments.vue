<script setup lang="ts">
import { podcastKey } from "@/symbols";
import type { PodcastContentType } from "@/types/api";

const { t } = useI18n();
const props = defineProps<{
  contentType: PodcastContentType;
  contentId?: string;
}>();
const podcast = inject(podcastKey);
const { getValue, getValidationErrors, hasErrors, setValidationErrors } = useTextInputs(
  "name",
  "text",
  "challenge_answer",
);
const name = getValue("name");
const text = getValue("text");
const challengeAnswer = getValue("challenge_answer");
const nameErrors = getValidationErrors("name");
const textErrors = getValidationErrors("text");
const challengeAnswerErrors = getValidationErrors("challenge_answer");
const { addToast } = useMessageStore();
const { canSubmit, challenge, comments, deleteChallenge, postComment, resetChallenge } =
  useComments(
    () => podcast?.value?.slug,
    () => props.contentId,
  );
const isSubmitDisabled = computed(
  () => !canSubmit.value || !name.value || !text.value || !challengeAnswer.value || hasErrors.value,
);

async function onSubmitComment() {
  try {
    const toast = podcast?.value?.require_comment_approval
      ? t("comment.thanks.approval-required")
      : t("comment.thanks.no-approval-required");

    await postComment(name.value, text.value, challengeAnswer.value);
    addToast({ level: "success", text: toast });
    resetComment();
    challengeAnswer.value = "";
  } catch (err: any) {
    if (err.data && err.data.data) {
      setValidationErrors(err.data.data as Record<string, string[]>);
    } else {
      addToast({ level: "error", text: t("comment.something-wrong") });
    }
  }
}

function resetComment() {
  name.value = "";
  text.value = "";
  setValidationErrors({});
}

function dateToString(date: string) {
  return new Date(date).toLocaleString(podcast?.value?.language ?? undefined, {
    timeStyle: "short",
    dateStyle: "medium",
  });
}

onMounted(() => {
  if (podcast?.value) resetChallenge(podcast?.value?.slug);
});

onUnmounted(deleteChallenge);
</script>

<template>
  <div v-if="comments && comments.length > 0">
    <h3>{{ t("comment.comments") }}</h3>
    <div class="column gap-half">
      <div v-for="comment in comments" :key="comment.id" class="comment mb-half p-half">
        <p class="text-xs">
          {{
            t("comment.x-said-on-date", { x: comment.name, date: dateToString(comment.created) })
          }}:
        </p>
        <div class="comment-text" v-html="comment.text_html"></div>
      </div>
    </div>
  </div>

  <div>
    <h3>{{ t("comment.leave-a-comment") }}</h3>
    <div class="comment-form column gap-half">
      <div class="column">
        <div v-if="podcast?.require_comment_approval" class="text-xs">
          {{ t("comment.approval-required") }}
        </div>
        <TextInput v-model="text" id="text" :errors="textErrors" multiline />
      </div>
      <div class="row gap-half wrap align-start">
        <TextInput
          :errors="nameErrors"
          :label="t('comment.your-name')"
          :max-length="50"
          class="name-wrapper"
          id="name"
          v-model="name"
        />
        <TextInput
          :errors="challengeAnswerErrors"
          :label="t('comment.challenge', { q: challenge?.challenge_string })"
          class="challenge-wrapper"
          id="challenge_answer"
          type="number"
          v-model="challengeAnswer"
        />
        <Button :disabled="isSubmitDisabled" theme="secondary" @click="onSubmitComment">
          {{ t("comment.send") }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment {
  border-radius: var(--spod-border-radius);

  &:nth-child(odd) {
    background-color: get-color("secondary", "dark");
  }

  &:nth-child(even) {
    background-color: get-color("tertiary", "dark");
  }

  &,
  .comment-text {
    & > :deep(:first-child) {
      margin-top: 0;
    }

    & > :deep(:last-child) {
      margin-bottom: 0;
    }
  }
}

.comment-form {
  textarea {
    display: block;
    min-height: 70px;
  }

  label {
    display: block;
  }

  .name-wrapper {
    flex: 1 1 300px;
  }

  .challenge-wrapper {
    flex: 1 0 222px;
  }

  .has-error {
    border: 2px solid get-color("error");
  }

  .button {
    margin-top: 1px;
  }
}
</style>
