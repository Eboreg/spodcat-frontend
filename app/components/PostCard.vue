<script setup lang="ts">
import { FileText } from "@lucide/vue";
import type { PartialPostModel } from "@/types/api";

const props = defineProps<{ post?: PartialPostModel; expand?: boolean }>();
const route = computed(() =>
  props.post ? `/${props.post.podcast}/post/${props.post.slug}` : undefined,
);
</script>

<template>
  <ContentCard :route :expand :content="post">
    <template #icon v-if="post">
      <RoundIcon :size="{ xs: 35, sm: 38 }" theme="secondary">
        <SpodcatIcon :icon="FileText" />
      </RoundIcon>
    </template>
    <slot />
  </ContentCard>
</template>
