<script setup lang="ts">
import { Share2 } from "@lucide/vue";

const { t } = useI18n();
</script>

<template>
  <SpodcatIcon
    :icon-size="{ xs: 25, sm: 30 }"
    :icon="Share2"
    :size="{ xs: 35, sm: 40 }"
    :title="t('share.share')"
    class="hover-light hover-border cursor-pointer"
    theme="secondary"
  />
</template>
