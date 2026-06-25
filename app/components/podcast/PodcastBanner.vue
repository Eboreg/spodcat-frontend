<script setup lang="ts">
import type { PartialPodcastModel } from "@/types/api";

// Don't use inject() for podcast here! That would fuck up pages/index.vue.
const props = defineProps<{ podcast?: PartialPodcastModel; compact?: boolean }>();
const nameCssClass = computed(() =>
  [
    props.podcast?.name_font_size,
    props.podcast?.banner ? "outlined-text" : "shadowed-text",
    "podcast-name",
  ]
    .filter((c) => c !== undefined)
    .join(" "),
);
const nameCssStyle = computed(() =>
  props.podcast?.name_font_family ? `font-family: "${props.podcast.name_font_family}"` : "",
);
</script>

<template>
  <header
    class="podcast-banner box-shadow"
    :class="{ 'has-banner-image': podcast?.banner, compact }"
  >
    <template v-if="podcast">
      <div
        v-if="podcast.banner"
        :style="`background-image: url('${podcast.banner}')`"
        class="podcast-banner-image"
      ></div>

      <div v-else class="podcast-banner-image"></div>

      <NuxtLink :to="`/${podcast.slug}`" class="row gap-single align-center p-single">
        <img
          v-if="podcast.cover_thumbnail"
          :src="podcast.cover_thumbnail"
          alt=""
          class="podcast-cover d-none d-sm-block"
        />
        <div>
          <div :class="nameCssClass" :style="nameCssStyle">{{ podcast.name }}</div>
          <div v-if="podcast.tagline" class="podcast-tagline outlined-text mt-quarter">
            {{ podcast.tagline }}
          </div>
        </div>
      </NuxtLink>
    </template>

    <Loading v-else height="120px" />
  </header>
</template>

<style scoped lang="scss">
.podcast-banner {
  border-radius: var(--spod-border-radius);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 120px;
  overflow: hidden;
  position: relative;

  &:nth-child(odd) .podcast-banner-image {
    background-image: var(--spod-podcast-banner-background-1);
  }

  &:nth-child(even) .podcast-banner-image {
    background-image: var(--spod-podcast-banner-background-2);
  }

  &.has-banner-image:not(.compact) {
    aspect-ratio: 3/1;
    justify-content: end;
  }
}

.podcast-banner-image {
  background-position: center;
  background-size: cover;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: -1;
}

.podcast-cover {
  border: 5px outset get-color("primary");
  border-radius: 100%;
  height: 100px;
  object-fit: cover;
  object-position: center;
  width: 100px;
}

.compact .podcast-cover {
  height: 80px;
  width: 80px;
}

.podcast-name {
  font-size: 40px;
  line-height: 1;

  &.small {
    font-size: 30px;
  }

  &.large {
    font-size: 50px;
  }

  @include minsize(md) {
    font-size: 50px;

    &.small {
      font-size: 35px;
    }

    &.large {
      font-size: 70px;
    }
  }

  @include minsize(lg) {
    font-size: 60px;

    &.small {
      font-size: 45px;
    }

    &.large {
      font-size: 80px;
    }
  }
}

.podcast-tagline {
  font-size: var(--spod-font-size-article);
}
</style>
