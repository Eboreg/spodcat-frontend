import type { EpisodeModel, PodcastModel } from "@/types/api";
import { computed, ref } from "vue";
import { coerceBetween } from "@/utils";
import { defineStore } from "pinia";
import useMessageStore from "./useMessageStore";

const useAudioStore = defineStore("audio", () => {
  const audioElement = ref<HTMLAudioElement>();
  const canPlay = computed(() => !!audioElement.value && !isLoading.value);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const episode = ref<EpisodeModel>();
  const isLoading = ref<boolean>(false);
  const isMuted = ref<boolean>(false);
  const isPlaying = ref<boolean>(false);
  const playbackRate = ref<number>(1);
  const podcast = ref<PodcastModel>();
  const volume = ref<number>(0);

  const { addToast } = useMessageStore();

  const currentProgress = computed<number>(() => {
    if (duration.value && duration.value > 0)
      return coerceBetween((currentTime.value / duration.value) * 100, 0, 100);
    return 0;
  });

  function onCanPlay() {
    isLoading.value = false;
  }

  function onDurationChange() {
    if (audioElement.value) {
      duration.value = audioElement.value.duration;
      setMediaSessionPositionState();
    }
  }

  function onEnded() {
    isPlaying.value = false;
    setMediaSessionPlaybackState();
  }

  function onError() {
    isPlaying.value = false;
    isLoading.value = false;
  }

  function onPause() {
    isPlaying.value = false;
    isLoading.value = false;
    setMediaSessionPlaybackState();
  }

  function onPlaying() {
    isPlaying.value = true;
    isLoading.value = false;
    setMediaSessionPlaybackState();
  }

  function onRateChange() {
    if (audioElement.value) {
      playbackRate.value = audioElement.value.playbackRate;
      setMediaSessionPositionState();
    }
  }

  function onSeeked() {
    isLoading.value = false;
    setMediaSessionPlaybackState();
  }

  function onSeeking() {
    isLoading.value = true;
    setMediaSessionPlaybackState();
  }

  function onTimeUpdate() {
    if (audioElement.value) {
      currentTime.value = Math.floor(audioElement.value.currentTime);
      setMediaSessionPositionState();
    }
  }

  function onVolumeChange() {
    if (audioElement.value) {
      volume.value = Math.sqrt(audioElement.value.volume);
      isMuted.value = audioElement.value.muted;
    }
  }

  function pause() {
    audioElement.value?.pause();
  }

  function play() {
    audioElement.value?.play().catch((reason) => {
      addToast({ level: "error", text: String(reason) });
    });
  }

  function playEpisode(newEpisode: EpisodeModel, newPodcast?: PodcastModel, start?: number) {
    if (episode.value !== newEpisode) {
      isLoading.value = true;
      setEpisode(newEpisode, newPodcast);
      if (!start) seekToTime(0);
    }
    if (start) seekToTime(start);
    play();
  }

  function playOrPause() {
    if (isPlaying.value) pause();
    else play();
  }

  function seek(seconds: number) {
    if (audioElement.value) {
      const time = coerceBetween(currentTime.value + seconds, 0, duration.value);

      currentTime.value = time;
      audioElement.value.currentTime = time;
    }
  }

  function seekToProgress(progress: number) {
    seekToTime(duration.value * progress);
  }

  function seekToTime(seconds: number) {
    if (audioElement.value) {
      seconds = coerceBetween(seconds, 0, duration.value);
      currentTime.value = seconds;
      audioElement.value.currentTime = seconds;
    }
  }

  function setAudioElement(element?: HTMLAudioElement) {
    audioElement.value = element;
    if (element !== undefined) {
      playbackRate.value = element.playbackRate;
      if (!isNaN(element.duration)) duration.value = element.duration;
      currentTime.value = element.currentTime;
      onVolumeChange();
      if (episode.value) setSrc(episode.value.audio_url);
    }
  }

  function setEpisode(newEpisode: EpisodeModel, newPodcast?: PodcastModel) {
    episode.value = newEpisode;
    podcast.value = newPodcast;
    setSrc(newEpisode.audio_url);
    duration.value = newEpisode.duration_seconds;

    if ("mediaSession" in navigator) {
      const mediaImages: MediaImage[] = [];

      if (newEpisode.image) {
        mediaImages.push({
          src: newEpisode.image,
          sizes: `${newEpisode.image_width}x${newEpisode.image_height}`,
          type: newEpisode.image_mimetype || undefined,
        });
      }
      if (newEpisode.image_thumbnail) {
        mediaImages.push({
          src: newEpisode.image_thumbnail,
          sizes: `${newEpisode.image_thumbnail_width}x${newEpisode.image_thumbnail_height}`,
          type: newEpisode.image_thumbnail_mimetype || undefined,
        });
      }
      if (newPodcast?.cover) {
        mediaImages.push({
          src: newPodcast.cover,
          sizes: `${newPodcast.cover_width}x${newPodcast.cover_height}`,
          type: newPodcast.cover_mimetype || undefined,
        });
      }
      if (newPodcast?.cover_thumbnail) {
        mediaImages.push({
          src: newPodcast.cover_thumbnail,
          sizes: `${newPodcast.cover_thumbnail_width}x${newPodcast.cover_thumbnail_height}`,
          type: newPodcast.cover_thumbnail_mimetype || undefined,
        });
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: newEpisode.name,
        artist: newEpisode.podcast_name,
        artwork: mediaImages,
      });
    }
  }

  function setMediaSessionPlaybackState() {
    if ("mediaSession" in navigator && audioElement.value) {
      if (audioElement.value.ended || audioElement.value.seeking)
        navigator.mediaSession.playbackState = "none";
      else if (audioElement.value.paused) navigator.mediaSession.playbackState = "paused";
      else navigator.mediaSession.playbackState = "playing";
    }
  }

  function setMediaSessionPositionState() {
    if ("mediaSession" in navigator && audioElement.value) {
      navigator.mediaSession.setPositionState({
        duration: duration.value,
        playbackRate: audioElement.value.playbackRate,
        position: audioElement.value.currentTime,
      });
    }
  }

  function setSrc(value: string) {
    if (audioElement.value && value !== audioElement.value.src) {
      audioElement.value.src = value;
    }
  }

  function setVolume(value: number) {
    if (audioElement.value) {
      volume.value = value;
      audioElement.value.volume = Math.pow(value, 2);
    }
  }

  function toggleMute() {
    if (audioElement.value) {
      audioElement.value.muted = !audioElement.value.muted;
    }
  }

  return {
    audioElement,
    canPlay,
    currentProgress,
    currentTime,
    duration,
    episode,
    isLoading,
    isMuted,
    isPlaying,
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
    pause,
    play,
    playbackRate,
    playEpisode,
    playOrPause,
    podcast,
    seek,
    seekToProgress,
    seekToTime,
    setAudioElement,
    setEpisode,
    setVolume,
    toggleMute,
    volume,
  };
});

export default useAudioStore;
