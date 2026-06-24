<script setup lang="ts">
import { Home, Menu, Podcast, Rss, Search } from "@lucide/vue";
import { podcastKey } from "@/symbols";

const { t } = useI18n();
const isSearchModalOpen = ref<boolean>(false);
const isVisibleMobile = ref<boolean>(false);
const podcast = inject(podcastKey);
</script>

<template>
  <aside class="gap-half column">
    <Loading v-if="!podcast" height="100px" />
    <template v-else>
      <Button
        :class="{ show: isVisibleMobile }"
        :icon-size="20"
        :icon="Menu"
        @click="isVisibleMobile = !isVisibleMobile"
        class="d-md-none toggle-menu-button"
      >
        <span v-if="isVisibleMobile">{{ t("menu.hide") }}</span>
        <span v-else>{{ t("menu.show") }}</span>
      </Button>

      <div :class="{ 'd-none': !isVisibleMobile }" class="d-md-flex column gap-half">
        <Button
          :href="podcast.episodes_fm_url"
          :icon-size="20"
          :icon="Podcast"
          new-tab
          theme="tertiary"
        >
          <span>{{ t("subscribe") }}</span>
        </Button>
        <Button :href="podcast.rss_url" :icon-size="20" new-tab theme="primary" :icon="Rss">
          <span>{{ t("rss-feed") }}</span>
        </Button>
        <Button
          v-for="link in podcast.links"
          :href="link.url"
          :key="link.id"
          :theme="link.theme"
          new-tab
        >
          <img v-if="link.custom_icon" :src="link.custom_icon" alt="" class="icon" />
          <SpodcatIcon v-else-if="link.icon" :icon="`mdi:${link.icon}`" :size="20" />
          <span>{{ link.label }}</span>
        </Button>
        <Button route="/" theme="secondary" :icon="Home" :icon-size="20">
          <span>{{ t("all-podcasts") }}</span>
        </Button>
        <Button :icon-size="20" :icon="Search" @click="isSearchModalOpen = true" theme="secondary">
          <span>{{ t("search") }}</span>
        </Button>

        <Attribution class="d-none d-md-flex" />
      </div>

      <SearchModal v-if="isSearchModalOpen" v-model="isSearchModalOpen" />
    </template>

    <slot />
  </aside>
</template>

<style scoped lang="scss">
.toggle-menu-button {
  background-color: var(--spod-background-color);
  border-color: var(--spod-background-color);
  color: var(--spod-text-color);

  &.show {
    background-color: var(--spod-text-color);
    border-color: var(--spod-text-color);
    color: var(--spod-background-color);
  }
}
</style>
