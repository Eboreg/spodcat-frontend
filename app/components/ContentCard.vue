<script setup lang="ts">
import type { PartialPodcastContentModel } from "@/types/api";
import { podcastKey } from "~/symbols";
import { getLocaleDateString, makeAbsoluteUrl } from "~/utils";

const props = defineProps<{
  content?: PartialPodcastContentModel;
  currentTimestamp?: number;
  expand?: boolean;
  route?: string;
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
    <a v-if="content && !expand" :id="content.slug" />
    <div class="bg column">
      <Loading v-if="!content" height="120px" />

      <div v-else class="row">
        <MaybeLink
          class="row align-center gap-single p-single fill"
          :route="!expand ? route : undefined"
          element="div"
        >
          <div class="icon-wrapper">
            <slot name="icon" />
          </div>

          <div class="row fill column-gap-single row-gap-half" :class="{ wrap: expand }">
            <div class="fill column gap-quarter">
              <div class="font-weight-bold">{{ content.name }}</div>
              <div class="row column-gap-half row-gap-quarter wrap">
                <div class="badge theme-secondary">
                  {{ getLocaleDateString(new Date(content.published), podcast?.language) }}
                </div>

                <slot name="badges" />
              </div>
            </div>

            <div v-if="expand" class="row align-center gap-half">
              <ContentShareIcon v-if="absoluteUrl" @click="openShareModal" />
              <slot name="head-end" />
            </div>
          </div>
        </MaybeLink>

        <div v-if="!expand" class="row align-center gap-half pr-single">
          <slot name="head-end" />
        </div>
      </div>

      <slot />
    </div>
  </div>

  <ShareModal
    v-if="absoluteUrl && showShareModal"
    :current-timestamp="currentTimestamp"
    :url="absoluteUrl"
    v-model="showShareModal"
  />
</template>

<style scoped lang="scss">
.icon-wrapper {
  align-self: flex-start;
}
</style>
