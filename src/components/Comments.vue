<script setup lang="ts">
import { Button, TextInput } from "@/components";
import useComments from "@/composables/useComments";
import useMessageStore from "@/composables/useMessageStore";
import { podcastKey } from "@/symbols";
import type { ValidationError } from "@/types";
import type { PodcastContentType } from "@/types/api";
import { computed, inject, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  contentType: PodcastContentType;
  contentSlug?: string;
}>();
const podcast = inject(podcastKey);
const name = ref<string>("");
const text = ref<string>("");
const challengeAnswer = ref<string>("");
const errors = ref<ValidationError[]>([]);
const { addToast } = useMessageStore();
const { canSubmit, challenge, comments, deleteChallenge, postComment, error, resetChallenge } =
  useComments(
    props.contentType,
    () => podcast?.value?.slug,
    () => props.contentSlug,
  );
const isSubmitDisabled = computed(
  () =>
    !canSubmit.value ||
    !name.value ||
    !text.value ||
    !challengeAnswer.value ||
    !!errors.value?.length,
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
  } catch {
    addToast({ level: "error", text: t("comment.something-wrong") });
  }
}

function resetComment() {
  name.value = "";
  text.value = "";
}

function dateToString(date: string) {
  return new Date(date).toLocaleString(undefined, { timeStyle: "short", dateStyle: "medium" });
}

onMounted(() => {
  if (podcast?.value) resetChallenge(podcast?.value?.slug);
});

onUnmounted(deleteChallenge);

watchEffect(() => {
  if (error.value) console.error("loader error", error.value);
});
</script>

<template>
  <div v-if="comments && comments.length > 0">
    <h3>{{ t("comment.comments") }}</h3>
    <div class="column gap-half">
      <div v-for="comment in comments" :key="comment.id" class="comment">
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
    <div class="comment-form gap-half">
      <div class="column">
        <div v-if="podcast?.require_comment_approval" class="text-xs">
          {{ t("comment.approval-required") }}
        </div>
        <TextInput v-model="text" multiline />
      </div>
      <div class="row gap-half wrap">
        <TextInput
          v-model="name"
          id="name"
          :max-length="50"
          :label="t('comment.your-name')"
          class="name-wrapper"
        />
        <TextInput
          id="challenge"
          type="number"
          v-model="challengeAnswer"
          :label="t('comment.challenge', { q: challenge?.challenge_string })"
          class="challenge-wrapper"
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
  margin-bottom: var(--spod-length-half);
  padding: var(--spod-length-half);

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
  display: flex;
  flex-direction: column;

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

  .error {
    color: get-color("error");
  }

  .has-error {
    border: 2px solid get-color("error");
  }

  .button {
    margin-top: 1px;
  }
}
</style>
