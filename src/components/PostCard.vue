<script setup lang="ts">
import type { PartialPostModel } from "@/types/api";
import { computed, inject, ref } from "vue";
import { ContentCard, ShareModal, MaterialSymbol, RoundIcon, Loading } from "@/components";
import { getLocaleDateString, makeAbsoluteUrl } from "@/utils";
import { useI18n } from "vue-i18n";
import { podcastKey } from "@/symbols";

const { t } = useI18n();
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
      <RoundIcon :data="[{ type: 'material-symbol', value: 'article' }]" theme="secondary" />
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
      <MaterialSymbol
        v-if="expand && absoluteUrl"
        icon="share"
        class="text-secondary hover-light py-single px-half"
        :title="t('share.share')"
        @click="showShareModal = true"
        :size="30"
      />
    </template>
    <slot />
  </ContentCard>

  <ShareModal
    v-if="absoluteUrl && showShareModal"
    @close="showShareModal = false"
    :url="absoluteUrl"
  />
</template>
