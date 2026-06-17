<script setup lang="ts">
import type { PartialPodcastContentModel } from "@/types/api";

const props = defineProps<{
  expand?: boolean;
  route?: string;
  content?: PartialPodcastContentModel;
}>();
</script>

<template>
  <div class="dashed-border">
    <a v-if="content" :id="content.slug"></a>
    <div class="bg column">
      <div class="row align-start pl-single">
        <RouterLink v-if="!expand && route" :to="route" class="row gap-single fill py-single">
          <slot name="head-start" />
        </RouterLink>
        <div v-else class="row gap-single fill py-single">
          <slot name="head-start" />
        </div>

        <div class="row align-center px-half">
          <slot name="head-end" />
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>
