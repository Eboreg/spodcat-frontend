<script setup lang="ts">
import { FileText } from "@lucide/vue";
import type { PartialPostModel } from "@/types/api";
import { podcastKey } from "@/symbols";

const props = defineProps<{ post?: PartialPostModel; expand: boolean }>();
const podcast = inject(podcastKey);
const route = computed(() => {
  const podcastSlug = podcast?.value?.slug ?? props.post?.podcast;
  return podcastSlug && props.post ? `/${podcastSlug}/post/${props.post.slug}` : undefined;
});
</script>

<template>
  <ContentCard :route="route" :expand="expand" :content="post">
    <template #icon v-if="post">
      <RoundIcon :data="[{ type: 'icon', value: FileText }]" theme="secondary" />
    </template>

    <slot />
  </ContentCard>
</template>
