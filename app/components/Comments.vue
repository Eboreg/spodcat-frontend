<script setup lang="ts">
import { HandMetal } from "@lucide/vue";
import { podcastKey } from "@/symbols";
import useComments from "~/composables/useComments";
import useForm from "~/composables/useForm";
import useMessageStore from "~/composables/useMessageStore";

const props = defineProps<{ contentId?: string }>();

async function onSubmitComment() {
  const nameValue = name.valueAsString;
  const textValue = text.valueAsString;
  const challengeAnswerValue = challengeAnswer.valueAsNumber;

  if (nameValue && textValue && !Number.isNaN(challengeAnswerValue)) {
    try {
      const toast = podcast?.value?.require_comment_approval
        ? t("comment.thanks.approval-required")
        : t("comment.thanks.no-approval-required");

      await postComment(nameValue, textValue, challengeAnswerValue);
      addToast({ level: "success", text: toast, icon: HandMetal });
      form.reset();
    } catch (err: any) {
      if (err.data && err.data.data) {
        form.setServerErrors(err.data.data as Record<string, string[]>);
      } else {
        addToast({ level: "error", text: t("something-wrong") });
      }
    }
  }
}

function dateToString(date: string) {
  return new Date(date).toLocaleString(podcast?.value?.language ?? undefined, {
    timeStyle: "short",
    dateStyle: "medium",
  });
}

const { t } = useI18n();
const podcast = inject(podcastKey);

const form = useForm();
const text = form.addInput("text", { required: true, gridArea: "text" });
const name = form.addInput("name", { required: true, maxlength: 50, gridArea: "name" });
const challengeAnswer = form.addInput("challenge_answer", { required: true, gridArea: "challenge" });

const { addToast } = useMessageStore();
const { challenge, comments, isSubmitting, postComment } = useComments(() => props.contentId);
const isSubmitDisabled = computed(() => isSubmitting.value || !form.canSubmit.value);
</script>

<template>
  <div v-if="comments && comments.length > 0">
    <h3>{{ t("comment.comments") }}</h3>
    <div class="column gap-half">
      <div v-for="comment in comments" :key="comment.id" class="comment border-radius-md p-half">
        <p class="font-size-xs">
          {{ t("comment.x-said-on-date", { x: comment.name, date: dateToString(comment.created) }) }}:
        </p>
        <div class="comment-text" v-html="comment.text_html" />
      </div>
    </div>
  </div>

  <div>
    <h3>{{ t("comment.leave-a-comment") }}</h3>
    <div v-if="podcast?.require_comment_approval" class="font-size-xs">
      {{ t("comment.approval-required") }}
    </div>
    <div class="comment-form row-gap-quarter column-gap-half">
      <Input v-model="text.value" v-bind="text.props" :disabled="isSubmitting" multiline type="text" />
      <InputErrors v-bind="text.errorsProps" />

      <InputLabel v-bind="name.labelProps">
        {{ t("comment.your-name") }}
      </InputLabel>
      <Input v-model="name.value" v-bind="name.props" :disabled="isSubmitting" type="text" />
      <InputErrors v-bind="name.errorsProps" />

      <InputLabel v-if="challenge" v-bind="challengeAnswer.labelProps">
        {{ t("comment.challenge", { q: challenge.challenge_string }) }}
      </InputLabel>
      <Input
        v-model="challengeAnswer.value"
        v-bind="challengeAnswer.props"
        :disabled="!challenge || isSubmitting"
        :placeholder="!challenge ? t('loading-ellipsis') : undefined"
        type="number"
      />
      <InputErrors v-bind="challengeAnswer.errorsProps" />

      <Button id="submit" grid-area="submit" :disabled="isSubmitDisabled" theme="secondary" @click="onSubmitComment">
        {{ t("comment.send") }}
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/_color.scss" as *;
@use "@/assets/scss/_responsive.scss" as *;

.comment {
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
  display: grid;
  grid-template-areas:
    "text text"
    "text-errors text-errors"
    "name-label name-label"
    "name name"
    "name-errors name-errors"
    "challenge-label challenge-label"
    "challenge submit"
    "challenge-errors challenge-errors";
  grid-template-columns: 1fr auto;

  @include minsize(lg) {
    grid-template-areas:
      "text text text"
      "text-errors text-errors text-errors"
      "name-label challenge-label ."
      "name challenge submit"
      "name-errors challenge-errors .";
    grid-template-columns: 3fr 2fr auto;
  }
}
</style>
