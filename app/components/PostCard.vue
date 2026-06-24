<script setup lang="ts">
import { FileText } from "@lucide/vue";
import type { PartialPostModel } from "@/types/api";
import { getLocaleDateString, makeAbsoluteUrl } from "@/utils";
import { podcastKey } from "@/symbols";

const props = defineProps<{ post?: PartialPostModel; expand: boolean }>();
const podcast = inject(podcastKey);
const showShareModal = ref<boolean>(false);
const route = computed(() => {
  const podcastSlug = podcast?.value?.slug ?? props.post?.podcast;
  return podcastSlug && props.post ? `/${podcastSlug}/post/${props.post.slug}` : undefined;
});
const absoluteUrl = computed(() => (route.value ? makeAbsoluteUrl(route.value) : undefined));
</script>

<template>
  <ContentCard :route="route" :expand="expand" :content="post">
    <template #head-start>
      <RoundIcon :data="[{ type: 'icon', value: FileText }]" theme="secondary" />
      <div v-if="post" class="fill column gap-quarter">
        <div class="font-weight-bold">{{ post.name }}</div>
        <div class="row gap-half">
          <div class="badge theme-secondary">
            {{ getLocaleDateString(new Date(post.published), podcast?.language) }}
          </div>
        </div>
      </div>
      <Loading v-else :opacity="0.5" />
    </template>

    <template #head-end>
      <div v-if="expand && absoluteUrl" class="py-single px-sm-half">
        <ContentShareIcon @click="showShareModal = true" />
      </div>
    </template>
    <slot />
  </ContentCard>

  <ShareModal v-if="absoluteUrl && showShareModal" v-model="showShareModal" :url="absoluteUrl" />
</template>
