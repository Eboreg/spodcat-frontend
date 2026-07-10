<script setup lang="ts">
import type { VideoModel } from "@/types/api";

defineProps<{ consent?: boolean; video: VideoModel }>();
defineEmits<{ consentClick: [] }>();

const { t } = useI18n();
const container = useTemplateRef("container");
const width = shallowRef<number>(600);

useResizeObserver(container, ([entry]) => {
  if (entry !== undefined) {
    width.value = entry.contentRect.width;
  }
});
</script>

<template>
  <div v-if="consent">
    <div ref="container" class="mt-single">
      <iframe
        :height="width * (9 / 16)"
        :src="`https://www.youtube-nocookie.com/embed/${video.video_id}?privacy_mode=1`"
        :width
        allow="encrypted-media; gyroscope; web-share"
        allowfullscreen
        frameborder="0"
        referrerpolicy="strict-origin-when-cross-origin"
      />
    </div>
    <div v-if="video.title">
      <em>{{ video.title }}</em>
    </div>
  </div>
  <div v-else class="p-single mt-single border-radius-md border-sm border-primary border-outset">
    <h3>
      {{ t("video.video") }}<span v-if="video.title">: {{ video.title }}</span>
    </h3>
    <p>{{ t("video.embed-explanation") }}</p>
    <div class="row gap-half wrap">
      <Button color="primary" @click="$emit('consentClick')">{{ t("video.show-embedded") }}</Button>
      <Button :to="`https://youtu.be/${video.video_id}`" new-tab color="secondary">
        {{ t("video.open-new-tab") }}
      </Button>
    </div>
  </div>
</template>
