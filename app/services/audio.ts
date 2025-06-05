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
    @tracked currentTime: number = 0; // seconds
    @tracked duration: number = 0; // seconds
    @tracked episode?: EpisodeModel;
    @tracked isLoadingEpisode?: string;
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
                if (details.seekTime) this.seekToTime(details.seekTime);
            });
        }
    }

    get currentProgress() {
        if (this.duration > 0) {
            return coerceBetween((this.currentTime / this.duration) * 100, 0, 100);
        }
        return 0;
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

    /** <audio> event listeners **********************************************/

    @action onAudioElementInsert(element: HTMLAudioElement) {
        this.audioElement = element;
        this.playbackRate = element.playbackRate;
        if (!isNaN(element.duration)) this.duration = element.duration;
        this.currentTime = element.currentTime;
        this.onVolumeChange();
        if (this.episode) this.setSrc(this.episode["audio-url"]);
    }

    @action onDurationChange() {
        if (this.audioElement && !isNaN(this.audioElement.duration)) {
            this.duration = this.audioElement.duration;
            this.setMediaSessionPositionState();
        }
    }

    @action onEnded() {
        this.isPlaying = false;
        this.setMediaSessionPlaybackState();
    }

    @action onError() {
        this.isLoadingEpisode = undefined;
        this.isPlaying = false;
    }

    @action onPause() {
        this.isPlaying = false;
        this.setMediaSessionPlaybackState();
    }

    @action onPlay() {
        this.isPlaying = true;
        this.isLoadingEpisode = undefined;
        this.setMediaSessionPlaybackState();
    }

    @action onPlaying() {
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
        this.setMediaSessionPlaybackState();
    }

    @action onSeeking() {
        this.isSeeking = true;
        this.setMediaSessionPlaybackState();
    }

    @action onStalled() {
        this.isLoadingEpisode = this.episode?.slug;
    }

    @action onTimeUpdate() {
        if (this.audioElement) {
            const currentTime = Math.floor(this.audioElement.currentTime);

            if (currentTime != this.currentTime) {
                this.currentTime = currentTime;
            }
        }
        this.setMediaSessionPositionState();
    }

    @action onVolumeChange() {
        if (this.audioElement) {
            this.volume = Math.sqrt(this.audioElement.volume);
            this.isMuted = this.audioElement.muted;
        }
    }

    @action onWaiting() {
        this.isLoadingEpisode = this.episode?.slug;
    }

    /** Other actions ********************************************************/

    @action onKeyDown(event: KeyboardEvent) {
        if (event.metaKey || event.altKey) return;
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

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

    @action pause() {
        // Triggered from <PlayerBar> and <Podcast::Content::EpisodeCard>
        this.audioElement?.pause();
    }

    @action play() {
        // Triggered from <PlayerBar>
        this.audioElement?.play().catch((reason) => {
            this.pause();
            this.message.addToast({ level: "error", text: String(reason) });
        });
    }

    @action toggleMute() {
        // Triggered from <VolumeControl::Inner>
        if (this.audioElement) {
            const isMuted = !this.isMuted;

            this.isMuted = isMuted;
            this.audioElement.muted = isMuted;
        }
    }

    /** Other methods ********************************************************/

    playEpisode(episode: EpisodeModel, start?: number) {
        // start = seconds
        if (this.episode != episode) {
            this.isLoadingEpisode = episode.slug;
            if (episode["dbfs-array"] == undefined) {
                episode.reload().catch((reason) => {
                    this.message.addToast({ level: "error", text: String(reason) });
                });
            }
            this.setEpisode(episode);
            if (!start) this.seekToTime(0);
        }
        if (start) this.seekToTime(start);
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

    seekToTime(seconds: number) {
        if (this.audioElement) {
            seconds = coerceBetween(seconds, 0, this.duration);
            this.currentTime = seconds;
            this.audioElement.currentTime = seconds;
        }
    }

    setEpisode(value: EpisodeModel) {
        this.episode = value;
        this.setSrc(value["audio-url"]);
        this.duration = value["duration-seconds"];

        if (!this.fastboot.isFastBoot && "mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: value.name,
                artist: value.podcast.name,
                artwork: value.mediaImages,
            });
        }
    }

    setMediaSessionPlaybackState() {
        if (this.mediaSessionAvailable && this.audioElement) {
            if (this.audioElement.ended || this.audioElement.seeking) navigator.mediaSession.playbackState = "none";
            else if (this.audioElement.paused) navigator.mediaSession.playbackState = "paused";
            else navigator.mediaSession.playbackState = "playing";
        }
    }

    setMediaSessionPositionState() {
        if (this.mediaSessionAvailable && this.audioElement) {
            navigator.mediaSession.setPositionState({
                duration: this.duration,
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
}

declare module "@ember/service" {
    interface Registry {
        audio: AudioService;
    }
}
