import type { EpisodeModel, PodcastModel } from "@/types/api";
import { coerceBetween, extractImageUrlsFromMarkdown } from "@/utils";
import { SPODCAT_LOGO } from "~/constants";
import useSeason from "@/composables/useSeason";

const useAudioStore = defineStore("audio", () => {
  const audioElement = ref<HTMLAudioElement | null>();
  const episode = ref<EpisodeModel>();
  const error = shallowRef<string | undefined>();
  const errorEvent = createEventHook<string>();
  const podcast = ref<PodcastModel>();

  const src = computed(() => {
    console.log("src computed", episode.value?.slug, episode.value?.audio_url);
    if (episode.value)
      return { src: episode.value.audio_url, type: episode.value.audio_content_type };
    return { src: "" };
  });

  const { t } = useI18n();

  const {
    currentTime,
    duration: _duration,
    ended,
    muted,
    playing,
    rate,
    seeking,
    stalled,
    volume: _volume,
    waiting,
    onPlaybackError,
  } = useMediaControls(audioElement, { src });

  const { season } = useSeason(
    () => podcast.value?.slug ?? episode.value?.podcast,
    () => episode.value?.season,
  );

  const canPlay = computed(
    () => !waiting.value && !ended.value && !seeking.value && !stalled.value && !error.value,
  );

  const coverImageUrl = computed(() => {
    if (episode.value?.image) return episode.value.image;
    if (episode.value?.description) {
      const imageUrl = extractImageUrlsFromMarkdown(episode.value.description)[0];
      if (imageUrl) return imageUrl;
    }
    if (season.value?.image) return season.value.image;
    if (podcast.value?.cover) return podcast.value.cover;
    return SPODCAT_LOGO.url;
  });

  const currentProgress = computed<number>(() => {
    if (duration.value > 0)
      return coerceBetween((currentTime.value / duration.value) * 100, 0, 100);
    return 0;
  });

  const duration = computed(() =>
    _duration.value > 0 ? _duration.value : (episode.value?.duration_seconds ?? 0),
  );

  const episodeMediaImages = computed(() => {
    const mediaImages: MediaImage[] = [];

    if (episode.value?.image) {
      mediaImages.push({
        src: episode.value.image,
        sizes: `${episode.value.image_width}x${episode.value.image_height}`,
        type: episode.value.image_mimetype ?? undefined,
      });
    }
    if (episode.value?.image_thumbnail) {
      mediaImages.push({
        src: episode.value.image_thumbnail,
        sizes: `${episode.value.image_thumbnail_width}x${episode.value.image_thumbnail_height}`,
        type: episode.value.image_thumbnail_mimetype ?? undefined,
      });
    }
    return mediaImages;
  });

  const isError = computed(() => !!error.value);

  const isLoading = computed(
    () => (waiting.value || seeking.value || stalled.value) && !error.value,
  );

  const isPlaying = computed(
    () => playing.value && !audioElement.value?.error && !audioElement.value?.paused,
  );

  const podcastMediaImages = computed(() => {
    const mediaImages: MediaImage[] = [];

    if (podcast.value?.cover) {
      mediaImages.push({
        src: podcast.value.cover,
        sizes: `${podcast.value.cover_width}x${podcast.value.cover_height}`,
        type: podcast.value.cover_mimetype ?? undefined,
      });
    }
    if (podcast.value?.cover_thumbnail) {
      mediaImages.push({
        src: podcast.value.cover_thumbnail,
        sizes: `${podcast.value.cover_thumbnail_width}x${podcast.value.cover_thumbnail_height}`,
        type: podcast.value.cover_thumbnail_mimetype ?? undefined,
      });
    }
    return mediaImages;
  });

  const volume = computed(() => Math.sqrt(_volume.value));

  onPlaybackError((event) => {
    const message = (event as any).message as string | undefined;
    errorEvent.trigger(message ?? audioElement.value?.error?.message ?? t("unknown-error"));
  });

  watch([src, audioElement], () => {
    error.value = undefined;
    if (src.value && audioElement.value) audioElement.value.src = src.value.src;
  });

  watch(audioElement, () => {
    audioElement.value?.addEventListener("error", () => {
      errorEvent.trigger(audioElement.value?.error?.message ?? t("unknown-error"));
    });
  });

  watch(ended, () => {
    if (ended.value) currentTime.value = 0;
  });

  watch([episodeMediaImages, podcastMediaImages], () => {
    if ("mediaSession" in navigator && episode.value) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: episode.value.name,
        artist: episode.value.podcast_name,
        artwork: [...episodeMediaImages.value, ...podcastMediaImages.value],
      });
    }
  });

  watch([ended, seeking, isPlaying], () => {
    if ("mediasession" in navigator) {
      if (ended.value || seeking.value) {
        navigator.mediaSession.playbackState = "none";
      } else if (isPlaying.value) {
        navigator.mediaSession.playbackState = "playing";
      } else {
        navigator.mediaSession.playbackState = "paused";
      }
    }
  });

  watch([duration, rate, currentTime], () => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setPositionState({
        duration: Math.max(duration.value, currentTime.value),
        playbackRate: rate.value,
        position: currentTime.value,
      });
    }
  });

  errorEvent.on((err) => (error.value = err));

  function playEpisode(newEpisode: EpisodeModel, newPodcast?: PodcastModel, start?: number) {
    if (episode.value !== newEpisode) {
      setEpisode(newEpisode, newPodcast);
      if (!start) currentTime.value = 0;
    }
    if (start) seekToTime(start);
    playing.value = true;
  }

  function seek(seconds: number) {
    currentTime.value = coerceBetween(currentTime.value + seconds, 0, duration.value);
  }

  function seekToProgress(progress: number) {
    seekToTime(duration.value * progress);
  }

  function seekToTime(seconds: number) {
    currentTime.value = coerceBetween(seconds, 0, duration.value);
  }

  function setEpisode(newEpisode: EpisodeModel, newPodcast?: PodcastModel) {
    episode.value = newEpisode;
    if (newPodcast !== undefined || podcast.value?.slug !== newEpisode.podcast) {
      podcast.value = newPodcast;
    }
  }

  function setVolume(value: number) {
    _volume.value = Math.pow(value, 2);
  }

  return {
    audioElement,
    canPlay,
    coverImageUrl,
    currentProgress,
    currentTime,
    duration,
    episode,
    isError,
    isLoading,
    isPlaying,
    muted,
    onError: errorEvent.on,
    playEpisode,
    playing,
    podcast,
    rate,
    seek,
    seekToProgress,
    seekToTime,
    setEpisode,
    setVolume,
    volume,

    waiting,
    seeking,
    stalled,
    season,
  };
});

export default useAudioStore;
