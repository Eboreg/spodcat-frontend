<script setup lang="ts">
import useAudioStore from "@/composables/useAudioStore";
import type { EpisodeModel } from "@/types/api";
import { timeToString } from "@/utils";
import { useResizeObserver } from "@vueuse/core";
import { computed, ref, useTemplateRef, watchEffect } from "vue";

function getMouseProgress(event: MouseEvent): number | null {
  if (event.target instanceof HTMLElement) {
    const parent = event.target.closest(".dbfs");

    if (parent instanceof HTMLElement) {
      return (event.clientX - parent.offsetLeft) / parent.offsetWidth;
    }
  }

  return null;
}

function onClick(event: MouseEvent) {
  const progress = getMouseProgress(event);

  if (progress !== null) {
    seekToProgress(progress);
    play();
  }
}

function onMouseMove(event: MouseEvent) {
  const progress = getMouseProgress(event);

  if (progress !== null) {
    tooltipProgress.value = progress;
    showTooltip.value = true;
  }
}

const audio = useAudioStore();
const { seekToProgress, play } = audio;
const props = defineProps<{ episode: EpisodeModel }>();
const tooltipProgress = ref<number>(0);
const showTooltip = ref<boolean>(false);
const dbfsBar = useTemplateRef("dbfs");
const dbfsBarWidth = ref<number>();

const dbfsArray = computed(() => {
  if (dbfsBarWidth.value) {
    const columnCount = Math.floor(dbfsBarWidth.value / 5);
    const episodeArray = props.episode.dbfs_array ?? [];

    if (episodeArray.length > 0) {
      const idxMultiplier = episodeArray.length / columnCount;
      return [...Array(columnCount)].map((_, idx) => episodeArray[Math.floor(idx * idxMultiplier)]);
    }

    const curveCount = Math.max(Math.round(columnCount / 25), 1);
    const curveWidth = columnCount / curveCount / 2;

    return [...Array(columnCount)].map(
      (_, x) => 60 + 40 * Math.sin((x - curveWidth / 2) * (Math.PI / curveWidth)),
    );
  }
  return undefined;
});

useResizeObserver(dbfsBar, (entries) => {
  const [entry] = entries;
  if (entry !== undefined) {
    dbfsBarWidth.value = entry.contentRect.width;
  }
});

watchEffect(() => {
  if (dbfsBar.value !== null) dbfsBarWidth.value = dbfsBar.value.clientWidth;
});
</script>

<template>
  <div
    ref="dbfs"
    class="dbfs"
    @click="onClick"
    @mousemove="onMouseMove"
    @mouseleave="showTooltip = false"
  >
    <div class="dbfs-overlay bg-opaque" :style="`width: ${100 - audio.currentProgress}%`"></div>
    <div v-if="showTooltip" class="tooltip" :style="`left: ${tooltipProgress * 100}%`">
      <div class="tooltip-box text-xs bg">
        {{ timeToString(episode.duration_seconds * tooltipProgress) }}
      </div>
      <div class="tooltip-line"></div>
    </div>

    <div
      v-if="dbfsArray"
      v-for="(dbfs, idx) in dbfsArray"
      :key="idx"
      class="dbfs-column"
      :style="`height: max(2px, ${dbfs}%); flex-basis: ${100 / dbfsArray.length}%`"
    >
      <div></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dbfs {
  align-items: center;
  display: flex;
  flex-grow: 1;
  height: 50px;
  position: relative;
}

.dbfs-column {
  flex-grow: 1;
  flex-shrink: 1;

  div {
    background-color: var(--spod-text-color);
    height: 100%;
    width: max(60%, 3px);
  }
}

.dbfs-overlay {
  height: 100%;
  opacity: 0.7;
  position: absolute;
  right: 0;
  width: 100%;
}

.tooltip {
  height: 100%;
  position: absolute;
}

.tooltip-box {
  border: 2px solid get-color("primary");
  bottom: 100%;
  padding: var(--spod-length-quarter);
  position: absolute;
}

.tooltip-line {
  border-left: 2px dashed get-color("primary");
  height: 100%;
}
</style>
