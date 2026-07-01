<script setup lang="ts">
import type { PartialPodcastContentModel } from "@/types/api";
import { Share2 } from "@lucide/vue";
import { podcastKey } from "~/symbols";
import { getLocaleDateString } from "~/utils";

const props = defineProps<{
  content?: PartialPodcastContentModel;
  currentTimestamp?: number;
  expand?: boolean;
  route?: string;
}>();
const runtimeConfig = useRuntimeConfig();
const emit = defineEmits<{ shareModalOpen: [] }>();
const showShareModal = ref<boolean>(false);
const absoluteUrl = computed(() => {
  if (props.route) return new URL(props.route, runtimeConfig.public.frontendHost).toString();
  return undefined;
});
const podcast = inject(podcastKey);
const { t } = useI18n();

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

      <div v-else class="row">
        <MaybeLink
          :no-link="expand"
          :to="route"
          class="row align-center gap-single p-single fill"
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
                  {{ getLocaleDateString(content.published, podcast?.language) }}
                </div>

                <slot name="badges" />
              </div>
            </div>

            <div v-if="expand" class="row align-center gap-half">
              <SpodcatIcon
                v-if="absoluteUrl"
                :icon-size="30"
                :icon="Share2"
                :size="40"
                :title="t('share.share')"
                @click="openShareModal"
                class="hover-light hover-border"
                element="button"
                theme="secondary"
              />
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
    :current-timestamp
    :url="absoluteUrl"
    v-model="showShareModal"
  />
</template>

<style scoped lang="scss">
.icon-wrapper {
  align-self: flex-start;
  flex: 0 0 auto;
}
</style>
