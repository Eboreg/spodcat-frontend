<script setup lang="ts">
import { inject, ref } from "vue";
import { Attribution, Button, SearchModal } from "@/components";
import { useI18n } from "vue-i18n";
import Loading from "../Loading.vue";
import { podcastKey } from "@/symbols";

const { t } = useI18n();
const isSearchModalOpen = ref<boolean>(false);
const podcast = inject(podcastKey);
</script>

<template>
  <aside class="gap-half column">
    <Loading v-if="!podcast" height="100px" />
    <template v-else>
      <Button
        :href="podcast.episodes_fm_url"
        new-tab
        theme="tertiary"
        material-icon="podcasts"
        :title="t('add-x-in-app', { x: podcast.name })"
      >
        <span>{{ t("subscribe") }}</span>
      </Button>
      <Button :href="podcast.rss_url" new-tab theme="primary" material-icon="rss_feed">
        <span>{{ t("rss-feed") }}</span>
      </Button>
      <Button
        v-for="link in podcast.links"
        :key="link.id"
        :href="link.url"
        new-tab
        :theme="link.theme"
      >
        <img v-if="link.custom_icon" :src="link.custom_icon" alt="" class="icon" />
        <font-awesome-icon v-else-if="link.icon" :icon="`fa-brands fa-${link.icon}`" class="icon" />
        <span class="label">{{ link.label }}</span>
      </Button>

      <Button route="/" theme="secondary" material-icon="home">
        <span class="label">{{ t("all-podcasts") }}</span>
      </Button>

      <Button @click="isSearchModalOpen = true" theme="secondary" material-icon="search">
        <span class="label">{{ t("search") }}</span>
      </Button>

      <SearchModal v-if="isSearchModalOpen" @close="isSearchModalOpen = false" />

      <Attribution class="d-none d-md-flex" />
    </template>

    <slot />
  </aside>
</template>
