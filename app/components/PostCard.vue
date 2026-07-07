<script setup lang="ts">
import type { PartialPostModel } from "@/types/api";
import { FileText } from "@lucide/vue";

const props = defineProps<{ post?: PartialPostModel; expand?: boolean }>();
const route = computed(() => (props.post ? `/${props.post.podcast}/post/${props.post.slug}` : undefined));
</script>

<template>
  <ContentCard :route :expand :content="post">
    <template v-if="post" #icon>
      <RoundIcon :size="{ xs: 35, sm: 38 }" theme="secondary" class="content-round-icon">
        <SpodcatIcon :icon="FileText" />
      </RoundIcon>
    </template>
    <slot />
  </ContentCard>
</template>
