<script setup lang="ts">
import { ArrowLeft } from "@lucide/vue";
import { podcastKey } from "~/symbols";

const { t, locale } = useI18n();
const podcast = inject(podcastKey);
const isLocaleReady = computed(
  () => podcast?.value && (!podcast.value.language || locale.value === podcast.value.language),
);
</script>

<template>
  <Button
    v-if="podcast && isLocaleReady"
    :icon-size="20"
    :icon="ArrowLeft"
    :to="`/${podcast.slug}/`"
    class="mb-half"
    color="secondary"
  >
    <span>{{ t("go-to-x", { x: podcast.name }) }}</span>
  </Button>
</template>
