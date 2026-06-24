<script setup lang="ts">
import { detectLocale } from "@/utils";

const { data: podcasts, isLoading } = useQuery({
  key: ["podcast"],
  query: () => $fetch("/api/podcasts"),
  staleTime: 60000,
});
const { t, setLocale } = useI18n();

useSpodcatHead();
setLocale(detectLocale());
</script>

<template>
  <main class="content-width column gap-half py-half">
    <div class="spodcat-banner p-single">
      <div class="row space-between align-center w-100">
        <div>
          <div class="title">Spodcat</div>
          <div class="subtitle">{{ t("spodcat-subtitle") }}</div>
        </div>
        <img src="/img/spodcat-logo.png" alt="" class="logo d-none d-sm-block" />
      </div>
    </div>
    <Loading v-if="isLoading" height="120px" />
    <template v-else>
      <PodcastBanner v-for="podcast in podcasts" :podcast="podcast" :key="podcast.slug" compact />
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
  background-color: $spodcat-yellow;
  border-radius: var(--spod-border-radius);

  .subtitle {
    color: black;
    font-weight: bold;
  }

  .title {
    color: $spodcat-blue;
    font-family: "Limelight-Regular";
    font-size: 72px;
    line-height: 1;
  }

  .logo {
    height: 90px;
  }
}
</style>
