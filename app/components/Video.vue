<script setup lang="ts">
import type { VideoModel } from "@/types/api";

const { t } = useI18n();
const props = defineProps<{ consent?: boolean; video: VideoModel }>();
const emit = defineEmits<{ consentClick: [] }>();
const videoIframe = useTemplateRef("iframe");
const videoContainer = useTemplateRef("container");
const width = ref<number>(600);
const height = computed(() => width.value * (9 / 16));

useResizeObserver(videoContainer, (entries) => {
  const [entry] = entries;
  if (entry !== undefined) {
    width.value = entry.contentRect.width;
  }
});

watchEffect(() => {
  if (videoIframe.value !== null) {
    videoIframe.value.width = width.value.toString();
    videoIframe.value.height = height.value.toString();
  }
});
</script>

<template>
  <div v-if="consent">
    <div class="mt-single" ref="container">
      <iframe
        width="560"
        height="315"
        ref="iframe"
        :src="`https://www.youtube-nocookie.com/embed/${video.video_id}?privacy_mode=1`"
        frameborder="0"
        allow="encrypted-media; gyroscope; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
    <div v-if="video.title">
      <em>{{ video.title }}</em>
    </div>
  </div>
  <div v-else class="video-consent-prompt p-single mt-single">
    <h3>
      {{ t("video.video") }}<span v-if="video.title">: {{ video.title }}</span>
    </h3>
    <p>{{ t("video.embed-explanation") }}</p>
    <div class="row gap-half wrap">
      <Button @click="$emit('consentClick')" theme="primary">{{ t("video.show-embedded") }}</Button>
      <Button :href="`https://youtu.be/${video.video_id}`" new-tab theme="secondary">
        {{ t("video.open-new-tab") }}
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-consent-prompt {
  border: 2px outset get-color("primary");
  border-radius: var(--spod-border-radius);
}
</style>
