<script setup lang="ts">
import { Home, Menu, Podcast, Rss, Search } from "@lucide/vue";
import { podcastKey } from "@/symbols";

const { t } = useI18n();
const isSearchModalOpen = shallowRef<boolean>(false);
const isVisibleMobile = shallowRef<boolean>(false);
const podcast = inject(podcastKey);
</script>

<template>
  <aside class="gap-half column border-radius-md">
    <Loading v-if="!podcast" height="100px" />

    <template v-else>
      <Button
        :class="{ show: isVisibleMobile }"
        :icon-size="20"
        :icon="Menu"
        class="d-md-none toggle-menu-button"
        @click="isVisibleMobile = !isVisibleMobile"
      >
        <span v-if="isVisibleMobile">{{ t("menu.hide") }}</span>
        <span v-else>{{ t("menu.show") }}</span>
      </Button>

      <div :class="{ 'd-none': !isVisibleMobile }" class="d-md-flex column gap-half px-sm-0 px-half pb-sm-0 pb-half">
        <Button :icon-size="20" :icon="Podcast" :to="podcast.episodes_fm_url" new-tab theme="tertiary">
          <span>{{ t("subscribe") }}</span>
        </Button>

        <Button :to="podcast.rss_url" :icon-size="20" new-tab :icon="Rss" theme="primary">
          <span>{{ t("rss-feed") }}</span>
        </Button>

        <Button v-for="link in podcast.links" :key="link.id" :to="link.url" new-tab :theme="link.theme">
          <img v-if="link.custom_icon" :src="link.custom_icon" alt="">
          <SpodcatIcon v-else-if="link.icon" :icon="`mdi:${link.icon}`" :size="20" />
          <span>{{ link.label }}</span>
        </Button>

        <Button to="/" :icon="Home" :icon-size="20" theme="secondary">
          <span>{{ t("all-podcasts") }}</span>
        </Button>

        <Button :icon-size="20" :icon="Search" theme="secondary" @click="isSearchModalOpen = true">
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
@use "@/assets/scss/_responsive.scss" as *;

@include maxsize(sm) {
  aside {
    background-color: var(--spod-background-color);
    border-color: var(--spod-background-color);
    border-style: outset;
    border-width: 0 1px 1px 0;
  }
}
.toggle-menu-button {
  border: none !important;
  color: var(--spod-text-color-on-dark);
}
</style>
