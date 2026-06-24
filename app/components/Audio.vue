<script setup lang="ts">
const audioElement = useTemplateRef("audioElement");
const audio = useAudioStore();
const {
  onCanPlay,
  onDurationChange,
  onEnded,
  onError,
  onPause,
  onPlaying,
  onRateChange,
  onSeeked,
  onSeeking,
  onTimeUpdate,
  onVolumeChange,
  playOrPause,
  seek,
  seekToTime,
  setAudioElement,
} = audio;
const { addToast } = useMessageStore();
const props = defineProps<{ start?: string | null | (string | null)[] }>();
const isReady = ref<boolean>(false);

onKeyDown([" ", "ArrowRight", "ArrowLeft"], (event) => {
  if (
    event.metaKey ||
    event.altKey ||
    !audio.canPlay ||
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  )
    return;
  if (event.key === " " && !event.ctrlKey) {
    playOrPause();
  } else if (event.key === "ArrowRight") {
    if (!event.ctrlKey) seek(10);
    else seek(60);
  } else if (event.key === "ArrowLeft") {
    if (!event.ctrlKey) seek(-10);
    else seek(-60);
  } else return;

  event.preventDefault();
});

watchEffect(() => {
  if (audioElement.value !== null) setAudioElement(audioElement.value);
});

watch(
  () => [audio.error],
  () => {
    if (audio.error) addToast({ level: "error", text: audio.error });
  },
);

watch(
  () => [props.start, isReady.value],
  () => {
    if (typeof props.start === "string" && isReady.value) {
      const start = parseInt(props.start);
      seekToTime(start);
    }
  },
);

onUnmounted(() => setAudioElement());

function doOnCanPlay() {
  onCanPlay();
  isReady.value = true;
}
</script>

<template>
  <audio
    preload="metadata"
    ref="audioElement"
    @canplay="doOnCanPlay"
    @durationchange="onDurationChange"
    @ended="onEnded"
    @error="onError"
    @pause="onPause"
    @playing="onPlaying"
    @ratechange="onRateChange"
    @seeked="onSeeked"
    @seeking="onSeeking"
    @timeupdate="onTimeUpdate"
    @volumechange="onVolumeChange"
    @waiting="audio.isLoading = true"
  ></audio>
</template>
