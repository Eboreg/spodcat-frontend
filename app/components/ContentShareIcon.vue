<script setup lang="ts">
import { Share2 } from "@lucide/vue";

const { t } = useI18n();
</script>

<template>
  <SpodcatIcon
    :icon-size="30"
    :icon="Share2"
    :size="40"
    :title="t('share.share')"
    class="hover-light hover-border"
    theme="secondary"
    element="button"
  />
</template>
