<script setup lang="ts">
import type { EpisodeModel } from "@/types/api";
import { coerceBetween, timeToString } from "@/utils";
import useAudioStore from "~/composables/useAudioStore";

const props = defineProps<{ episode: EpisodeModel; marginX?: string }>();

const audio = useAudioStore();
const dbfsBar = useTemplateRef("dbfs");
const dbfsBarWidth = shallowRef<number>();
const dbfsContainer = useTemplateRef("dbfs-container");
const pointer = usePointer({ target: dbfsContainer });
const showTooltip = shallowRef<boolean>(false);
const tooltipBoxRight = shallowRef<boolean>(false);
const tooltipProgress = shallowRef<number>(0);

const tooltipLeft = computed(() => `${tooltipProgress.value * 100}%`);
const dbfsColumnFlexBasis = computed(() => (dbfsArray.value ? `${100 / dbfsArray.value.length}%` : undefined));
const dbfsOverlayWidth = computed(() => `${100 - audio.currentProgress}%`);

const containerStyle = computed(() => {
  if (props.marginX) {
    return {
      marginLeft: `-${props.marginX}`,
      marginRight: `-${props.marginX}`,
      paddingLeft: props.marginX,
      paddingRight: props.marginX,
    };
  }
  return undefined;
});

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

    return [...Array(columnCount)].map((_, x) => 60 + 40 * Math.sin((x - curveWidth / 2) * (Math.PI / curveWidth)));
  }
  return undefined;
});

useResizeObserver(dbfsBar, ([entry]) => {
  if (entry !== undefined) {
    dbfsBarWidth.value = entry.contentRect.width;
  }
});

watch([pointer.x, pointer.pressure, pointer.isInside], () => {
  if (pointer.isInside.value) {
    const barWidth = dbfsBar.value?.clientWidth ?? 0;

    if (dbfsBar.value && barWidth > 0) {
      const pos = coerceBetween(pointer.x.value - dbfsBar.value.offsetLeft, 0, barWidth);
      const progress = pos / barWidth;

      tooltipProgress.value = progress;
      showTooltip.value = true;
      tooltipBoxRight.value = pos + 60 > barWidth;

      if (!audio.isError) {
        if (
          (pointer.pointerType.value === "touch" && pointer.pressure.value === 0)
          || (pointer.pointerType.value !== "touch" && pointer.pressure.value > 0)
        ) {
          audio.seekToProgress(progress);
          audio.playing = true;
        }
      }
    }
  } else {
    showTooltip.value = false;
  }
});

watchEffect(() => {
  if (dbfsBar.value !== null) dbfsBarWidth.value = dbfsBar.value.clientWidth;
});
</script>

<template>
  <div ref="dbfs-container" class="dbfs-container" :style="containerStyle">
    <div ref="dbfs" class="dbfs" :class="{ 'cursor-not-allowed': audio.isError }">
      <div class="dbfs-overlay bg-opaque" />
      <div v-if="showTooltip" class="tooltip">
        <div
          class="tooltip-box font-size-xs bg p-quarter bg-opaque border-sm border-primary"
          :class="{ right: tooltipBoxRight }"
        >
          {{ timeToString(episode.duration_seconds * tooltipProgress) }}
        </div>
        <div class="tooltip-line border-primary" />
      </div>
      <div v-for="(dbfs, idx) in dbfsArray" :key="idx" :style="`height: max(2px, ${dbfs}%)`" class="dbfs-column">
        <div />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dbfs {
  align-items: center;
  display: flex;
  height: 50px;
  position: relative;
}

.dbfs-column {
  flex: 1 1 v-bind(dbfsColumnFlexBasis);

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
  width: v-bind("dbfsOverlayWidth");
}

.tooltip {
  height: 100%;
  left: v-bind("tooltipLeft");
  position: absolute;
  top: 0;
}

.tooltip-box {
  bottom: 100%;
  cursor: default;
  position: absolute;

  &.right {
    right: 0;
  }
}

.tooltip-line {
  border-left-style: dashed;
  border-left-width: 2px;
  height: 100%;
}
</style>
