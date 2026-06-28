<script setup lang="ts">
import type { PartialPodcastContentModel } from "@/types/api";
import { podcastKey } from "~/symbols";
import { getLocaleDateString, makeAbsoluteUrl } from "~/utils";

const props = defineProps<{
  expand?: boolean;
  route?: string;
  content?: PartialPodcastContentModel;
  currentTimestamp?: number;
}>();
const emit = defineEmits<{ shareModalOpen: [] }>();
const showShareModal = ref<boolean>(false);
const absoluteUrl = computed(() => (props.route ? makeAbsoluteUrl(props.route) : undefined));
const podcast = inject(podcastKey);

function openShareModal() {
  emit("shareModalOpen");
  showShareModal.value = true;
}
</script>

<template>
  <div class="dashed-border">
    <a v-if="content" :id="content.slug" />
    <div class="bg column">
      <Loading v-if="!content" height="120px" />

      <div v-else class="row align-center">
        <MaybeLink :route="!expand ? route : undefined" class="row gap-single fill p-single">
          <slot name="icon" />

          <div class="fill column gap-quarter">
            <div class="font-weight-bold">{{ content.name }}</div>
            <div class="row column-gap-half row-gap-quarter wrap">
              <div class="badge theme-secondary">
                {{ getLocaleDateString(new Date(content.published), podcast?.language) }}
              </div>

              <slot name="badges" />
            </div>
          </div>
        </MaybeLink>

        <div class="row align-center gap-half p-single">
          <ContentShareIcon v-if="expand && absoluteUrl" @click="openShareModal" />

          <slot name="head-end" />
        </div>
      </div>

      <slot />
    </div>
  </div>

  <ShareModal
    v-if="absoluteUrl && showShareModal"
    v-model="showShareModal"
    :current-timestamp="currentTimestamp"
    :url="absoluteUrl"
  />
</template>
