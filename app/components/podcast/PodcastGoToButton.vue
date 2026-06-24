<script setup lang="ts">
import { ArrowLeft } from "@lucide/vue";
import { podcastKey } from "@/symbols";

const { t } = useI18n();
const podcast = inject(podcastKey);
</script>

<template>
  <Button
    v-if="podcast"
    :icon="ArrowLeft"
    :route="`/${podcast.slug}/`"
    :icon-size="20"
    class="mb-half"
    theme="secondary"
  >
    <span>{{ t("go-to-x", { x: podcast.name }) }}</span>
  </Button>
</template>
