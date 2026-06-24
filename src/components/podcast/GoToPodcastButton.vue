<script setup lang="ts">
import { Button } from "@/components";
import { podcastKey } from "@/symbols";
import { inject } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const podcast = inject(podcastKey);
</script>

<template>
  <Button
    v-if="podcast"
    :route="`/${podcast.slug}/`"
    theme="secondary"
    material-icon="arrow_back"
    class="mb-half"
  >
    <span class="label">{{ t("go-to-x", { x: podcast.name }) }}</span>
  </Button>
</template>
