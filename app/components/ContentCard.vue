<script setup lang="ts">
import type { PartialPodcastContentModel } from "@/types/api";

const props = defineProps<{
  expand?: boolean;
  route?: string;
  content?: PartialPodcastContentModel;
}>();
const route = computed(() => (!props.expand ? props.route : undefined));
</script>

<template>
  <div class="dashed-border">
    <a v-if="content" :id="content.slug"></a>
    <div class="bg column">
      <Loading v-if="!content" height="120px" />

      <div v-if="content" class="row align-center pl-single">
        <MaybeLink :route="route" class="row gap-single fill py-single">
          <slot name="head-start" />
        </MaybeLink>
        <div class="row align-center px-half">
          <slot name="head-end" />
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>
