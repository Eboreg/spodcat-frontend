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
const emit = defineEmits<{ shareModalOpen: [] }>();

const runtimeConfig = useRuntimeConfig();
const showShareModal = shallowRef<boolean>(false);
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
        <MaybeLink is="div" :no-link="expand" :to="route" class="row align-center gap-single p-single fill">
          <slot name="icon" />

          <div class="row fill column-gap-single row-gap-half" :class="{ wrap: expand }">
            <div class="fill column gap-quarter">
              <div class="font-weight-bold">{{ content.name }}</div>
              <div class="row column-gap-half row-gap-quarter wrap">
                <Badge theme="secondary">
                  {{ getLocaleDateString(content.published, podcast?.language) }}
                </Badge>

                <slot name="badges" />
              </div>
            </div>
          </div>
        </MaybeLink>

        <div class="row align-center gap-half pr-single">
          <SpodcatIcon
            v-if="absoluteUrl && expand"
            :icon-size="30"
            :icon="Share2"
            :size="40"
            :title="t('share.share')"
            class="on-hover-border"
            element="button"
            lighten-on-hover
            text-theme="secondary"
            @click="openShareModal"
          />
          <slot name="head-end" />
        </div>
      </div>

      <slot />
    </div>
  </div>

  <ShareModal v-if="absoluteUrl && showShareModal" v-model="showShareModal" :current-timestamp :url="absoluteUrl" />
</template>

<style scoped lang="scss">
:slotted(.content-round-icon) {
  align-self: flex-start;
  flex: 0 0 auto;
}
</style>
