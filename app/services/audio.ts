import { action } from "@ember/object";
import Service from "@ember/service";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type EpisodeModel from "podcast-frontend/models/episode";
import { coerceBetween, timeString } from "podcast-frontend/utils";
import type MessageService from "./message";

export default class AudioService extends Service {
    @service declare fastboot: FastBoot;
    @service declare message: MessageService;

    @tracked audioElement?: HTMLAudioElement;
    @tracked currentProgress: number = 0;
    @tracked episode?: EpisodeModel;
    @tracked isLoadingEpisode?: string;

    // @tracked bufferEnd: number = 0;
    @tracked currentTime: number = 0;
    @tracked duration: number = 0;
    @tracked isMuted: boolean = false;
    @tracked isPlaying: boolean = false;
    @tracked isSeeking: boolean = false;
    @tracked playbackRate: number = 1;
    @tracked volume: number = 0;

    constructor(...args: ConstructorParameters<typeof Service>) {
        super(...args);
        if (!this.fastboot.isFastBoot) {
            document.addEventListener("keydown", (event) => {
                this.onKeyDown(event);
            });
        }
        if (this.mediaSessionAvailable) {
            navigator.mediaSession.metadata = null;
            navigator.mediaSession.setPositionState();
            navigator.mediaSession.setActionHandler("play", () => {
                this.play();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                this.pause();
            });
            navigator.mediaSession.setActionHandler("stop", () => {
                this.pause();
            });
            navigator.mediaSession.setActionHandler("seekbackward", (details) => {
                this.seek((details.seekOffset || 10) * -1);
            });
            navigator.mediaSession.setActionHandler("seekforward", (details) => {
                this.seek(details.seekOffset || 30);
            });
            navigator.mediaSession.setActionHandler("seekto", (details) => {
                if (details.seekTime) this.seekToTime(details.seekTime, details.fastSeek);
            });
        }
    }

    get currentTimeString() {
        return timeString(this.currentTime);
    }

    get durationString() {
        return timeString(this.duration);
    }

    get mediaSessionAvailable() {
        return !this.fastboot.isFastBoot && "mediaSession" in navigator;
    }

    get volumeDisplay() {
        if (this.isMuted) return 0;
        return this.volume;
    }

    @action onDurationChange() {
        if (this.audioElement && !isNaN(this.audioElement.duration)) {
            this.duration = this.audioElement.duration;
            this.setMediaSessionPositionState();
        }
    }

    @action onEnded() {
        console.log("onEnded");
        this.isPlaying = false;
        if (this.mediaSessionAvailable) navigator.mediaSession.playbackState = "none";
    }

    @action onError(event: Event) {
        console.error("onError", event);
        this.isLoadingEpisode = undefined;
        this.isPlaying = false;
    }

    @action onKeyDown(event: KeyboardEvent) {
        if (event.metaKey || event.altKey) return;

        if (event.key == " " && !event.ctrlKey) {
            this.playOrPause();
        } else if (event.key == "ArrowRight") {
            if (!event.ctrlKey) this.seek(30);
            else this.seek(180);
        } else if (event.key == "ArrowLeft") {
            if (!event.ctrlKey) this.seek(-10);
            else this.seek(-60);
        } else return;

        event.preventDefault();
    }

    @action onPause() {
        this.isPlaying = false;
        if (this.mediaSessionAvailable) navigator.mediaSession.playbackState = "paused";
    }

    @action onPlay() {
        console.log("onPlay");
        this.isPlaying = true;
        this.isLoadingEpisode = undefined;
        if (this.mediaSessionAvailable) navigator.mediaSession.playbackState = "playing";
    }

    @action onPlaying() {
        console.log("onPlaying");
        this.onPlay();
    }

    @action onRateChange() {
        if (this.audioElement) {
            this.playbackRate = this.audioElement.playbackRate;
            this.setMediaSessionPositionState();
        }
    }

    @action onSeeked() {
        this.isSeeking = false;
    }

    @action onSeeking() {
        this.isSeeking = true;
    }

    @action onStalled() {
        console.log("onStalled");
        this.isLoadingEpisode = this.episode?.slug;
    }

    @action onTimeUpdate() {
        if (this.audioElement && this.audioElement.currentTime != this.currentTime) {
            this.currentTime = this.audioElement.currentTime;
            if (this.episode && this.duration > 0) {
                const progress = Math.floor(
                    (this.currentTime / this.duration) * (this.episode["dbfs-array"]?.length || 0),
                );
                if (progress != this.currentProgress) this.currentProgress = progress;
            }
            this.setMediaSessionPositionState();
        }
    }

    @action onVolumeChange() {
        if (this.audioElement) {
            this.volume = Math.sqrt(this.audioElement.volume);
            this.isMuted = this.audioElement.muted;
        }
    }

    @action onWaiting() {
        console.log("onWaiting");
        this.isLoadingEpisode = this.episode?.slug;
    }

    @action pause() {
        this.audioElement?.pause();
    }

    @action play() {
        this.audioElement?.play().catch((reason) => {
            this.pause();
            this.message.addToast({ level: "error", text: String(reason), icon: "sentiment_dissatisfied" });
        });
    }

    playEpisode(episode: EpisodeModel, start?: number, alwaysSeek?: boolean) {
        if (this.episode != episode) {
            console.log(`setting isLoadingEpisode=${episode.slug}`);
            this.isLoadingEpisode = episode.slug;
            if (episode["dbfs-array"] == undefined) {
                episode.reload().catch((reason) => {
                    this.message.addToast({ level: "error", text: String(reason), icon: "sentiment_dissatisfied" });
                });
            }
            this.setEpisode(episode);
            if (start && !alwaysSeek) this.seekToTime(start);
        }
        if (start && alwaysSeek) this.seekToTime(start);
        this.play();
    }

    playOrPause() {
        if (this.isPlaying) this.pause();
        else this.play();
    }

    seek(seconds: number) {
        if (this.audioElement) {
            const time = coerceBetween(this.currentTime + seconds, 0, this.duration);

            this.currentTime = time;
            this.audioElement.currentTime = time;
        }
    }

    seekToProgress(progress: number) {
        this.seekToTime(this.duration * progress);
    }

    seekToTime(time: number, fastSeek?: boolean) {
        if (this.audioElement) {
            this.currentTime = time;
            if (fastSeek) this.audioElement.fastSeek(time);
            else this.audioElement.currentTime = time;
        }
    }

    @action setAudioElement(element: HTMLAudioElement) {
        this.audioElement = element;
        this.playbackRate = element.playbackRate;
        if (!isNaN(element.duration)) this.duration = element.duration;
        this.currentTime = element.currentTime;
        this.onVolumeChange();
        if (this.episode) this.setSrc(this.episode["audio-url"]);
    }

    setEpisode(value: EpisodeModel) {
        this.episode = value;
        this.setSrc(value["audio-url"]);

        if (!this.fastboot.isFastBoot && "mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: value.name,
                artist: value.podcast.name,
                artwork: value.mediaImages,
            });
        }
    }

    setMediaSessionPositionState() {
        if (this.mediaSessionAvailable && this.audioElement) {
            navigator.mediaSession.setPositionState({
                duration: this.audioElement.duration,
                playbackRate: this.audioElement.playbackRate,
                position: this.audioElement.currentTime,
            });
        }
    }

    setPlaybackRate(value: number) {
        if (this.audioElement) {
            this.playbackRate = value;
            this.audioElement.playbackRate = value;
        }
    }

    setSrc(value: string) {
        if (this.audioElement && value != this.audioElement.src) {
            this.audioElement.src = value;
        }
    }

    setVolume(value: number) {
        if (this.audioElement) {
            this.volume = value;
            this.audioElement.volume = Math.pow(value, 2);
        }
    }

    @action toggleMute() {
        if (this.audioElement) {
            const isMuted = !this.isMuted;

            this.isMuted = isMuted;
            this.audioElement.muted = isMuted;
        }
    }
}

declare module "@ember/service" {
    interface Registry {
        audio: AudioService;
    }
}
