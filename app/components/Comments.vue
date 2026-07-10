<script setup lang="ts">
import { podcastKey } from "@/symbols";
import useComments from "~/composables/useComments";

function dateToString(date: string) {
  return new Date(date).toLocaleString(podcast?.value?.language ?? undefined, {
    timeStyle: "short",
    dateStyle: "medium",
  });
}

const props = defineProps<{ contentId?: string }>();
const { t } = useI18n();
const podcast = inject(podcastKey);
const { comments } = useComments(() => props.contentId);
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
</template>

<style scoped lang="scss">
.comment {
  &:nth-child(odd) {
    background-color: var(--spod-secondary-muted);
  }

  &:nth-child(even) {
    background-color: var(--spod-tertiary-muted);
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
</style>
