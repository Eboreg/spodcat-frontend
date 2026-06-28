<script setup lang="ts">
import { podcastKey } from "@/symbols";
import useComments from "~/composables/useComments";
import useMessageStore from "~/composables/useMessageStore";

async function onSubmitComment() {
  if (name.value && text.value && challengeAnswer.value) {
    try {
      const toast = podcast?.value?.require_comment_approval
        ? t("comment.thanks.approval-required")
        : t("comment.thanks.no-approval-required");

      await postComment(name.value, text.value, challengeAnswer.value);
      addToast({ level: "success", text: toast });
      resetComment();
    } catch (err: any) {
      if (err.data && err.data.data) {
        validationErrors.value = err.data.data as Record<string, string[]>;
      } else {
        addToast({ level: "error", text: t("comment.something-wrong") });
      }
    }
  }
}

function resetComment() {
  name.value = "";
  nameHasErrors.value = false;
  text.value = "";
  textHasErrors.value = false;
  challengeAnswer.value = "";
  challengeAnswerHasErrors.value = false;
}

function dateToString(date: string) {
  return new Date(date).toLocaleString(podcast?.value?.language ?? undefined, {
    timeStyle: "short",
    dateStyle: "medium",
  });
}

const { t } = useI18n();
const props = defineProps<{ contentId?: string }>();
const podcast = inject(podcastKey);
const validationErrors = ref<Record<string, string[]>>();

const name = ref<string>("");
const nameHasErrors = ref<boolean>(false);
const text = ref<string>("");
const textHasErrors = ref<boolean>(false);
const challengeAnswer = ref<string>("");
const challengeAnswerHasErrors = ref<boolean>(false);

const { addToast } = useMessageStore();
const { challenge, comments, isSubmitting, postComment } = useComments(() => props.contentId);
const isChallengeInputDisabled = computed(() => isSubmitting.value || !challenge.value);
const isSubmitDisabled = computed(
  () =>
    isChallengeInputDisabled.value ||
    !name.value ||
    !text.value ||
    !challengeAnswer.value ||
    nameHasErrors.value ||
    textHasErrors.value ||
    challengeAnswerHasErrors.value,
);
</script>

<template>
  <div v-if="comments && comments.length > 0">
    <h3>{{ t("comment.comments") }}</h3>
    <div class="column gap-half">
      <div v-for="comment in comments" :key="comment.id" class="comment p-half">
        <p class="text-xs">
          {{
            t("comment.x-said-on-date", { x: comment.name, date: dateToString(comment.created) })
          }}:
        </p>
        <div class="comment-text" v-html="comment.text_html" />
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
        <InputText
          :disabled="isSubmitting"
          :validation-errors="validationErrors"
          id="text"
          multiline
          required
          v-model="text"
          v-model:has-errors="textHasErrors"
        />
      </div>
      <div class="row gap-half wrap align-start">
        <InputText
          :disabled="isSubmitting"
          :label="t('comment.your-name')"
          :maxlength="50"
          :validation-errors="validationErrors"
          id="name"
          required
          v-model="name"
          v-model:has-errors="nameHasErrors"
          wrapper-class="name-wrapper"
        />
        <InputNumber
          id="challenge_answer"
          :disabled="isChallengeInputDisabled"
          :label="challenge ? t('comment.challenge', { q: challenge.challenge_string }) : '&nbsp;'"
          :placeholder="isChallengeInputDisabled ? t('loading-ellipsis') : undefined"
          :validation-errors="validationErrors"
          required
          v-model="challengeAnswer"
          v-model:has-errors="challengeAnswerHasErrors"
          wrapper-class="challenge-wrapper"
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
    margin-top: 2px;
  }
}
</style>
