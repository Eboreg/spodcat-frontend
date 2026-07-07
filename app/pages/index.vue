<script setup lang="ts">
import { detectLocale } from "@/utils";
import useSpodcatHead from "~/composables/useSpodcatHead";
import { SPODCAT_LOGO_TRANSPARENT } from "~/constants";

const { data: podcasts } = useQuery({
  key: ["podcast"],
  query: ({ signal }) => $fetch("/api/podcasts", { signal }),
});
const { t, setLocale } = useI18n();

useSpodcatHead();
setLocale(detectLocale());
</script>

<template>
  <main class="content-width column gap-half py-half">
    <div class="spodcat-banner p-single border-radius-md">
      <div class="row space-between align-center w-100">
        <div>
          <div class="title">Spodcat</div>
          <div class="subtitle">{{ t("spodcat-subtitle") }}</div>
        </div>
        <img :src="SPODCAT_LOGO_TRANSPARENT.url" alt="" class="logo d-none d-sm-block">
      </div>
    </div>

    <Loading v-if="podcasts === undefined" height="150px" />

    <template v-else>
      <PodcastBanner v-for="podcast in podcasts" :key="podcast.slug" :podcast compact />
    </template>

    <Attribution />
  </main>
</template>

<style scoped lang="scss">
@font-face {
  font-family: "Limelight-Regular";
  font-weight: 500;
  src: url("/fonts/Limelight-Regular.ttf") format(truetype);
}

.spodcat-banner {
  background-color: var(--spod-spodcat-yellow);

  .subtitle {
    color: black;
    font-weight: bold;
  }

  .title {
    color: var(--spod-spodcat-blue);
    font-family: "Limelight-Regular";
    font-size: 72px;
    line-height: 1;
  }

  .logo {
    height: 90px;
  }
}
</style>
