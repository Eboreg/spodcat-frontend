<script setup lang="ts">
import useAudioStore from "~/composables/useAudioStore";
import useMessageStore from "~/composables/useMessageStore";

const audioElement = useTemplateRef("audioElement");
const audio = useAudioStore();
const { addToast } = useMessageStore();
const props = defineProps<{ start?: string | null | (string | null)[] }>();

watch(audioElement, () => (audio.audioElement = audioElement.value));

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
    audio.playing = !audio.playing;
  } else if (event.key === "ArrowRight") {
    if (!event.ctrlKey) audio.seek(10);
    else audio.seek(60);
  } else if (event.key === "ArrowLeft") {
    if (!event.ctrlKey) audio.seek(-10);
    else audio.seek(-60);
  } else return;

  event.preventDefault();
});

audio.onError((error) => {
  addToast({ level: "error", text: error });
});

watch(
  () => [props.start],
  () => {
    if (typeof props.start === "string") {
      audio.seekToTime(parseInt(props.start));
    }
  },
);
</script>

<template>
  <audio preload="metadata" ref="audioElement" />
</template>
