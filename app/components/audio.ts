import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import { coerceBetween } from "podcast-frontend/utils";

export interface AudioSignature {
    Args: {
        "on-add"?: (element: Audio) => any;
        "on-buffer-update"?: (bufferEnd: number) => any;
        "on-time-update"?: (currentTime: number) => any;
    };
    Element: HTMLAudioElement;
}

export default class Audio extends Component<AudioSignature> {
    @service declare fastboot: FastBoot;

    declare audioElement: HTMLAudioElement;

    @tracked bufferEnd: number = 0;
    @tracked currentTime: number = 0;
    @tracked duration: number = 0;
    @tracked isMuted: boolean = false;
    @tracked isPlaying: boolean = false;
    @tracked isSeeking: boolean = false;
    @tracked playbackRate: number = 1;
    @tracked volume: number = 0;

    constructor(...args: ConstructorParameters<typeof Component<AudioSignature>>) {
        super(...args);
        if (!this.fastboot.isFastBoot) {
            document.addEventListener("keydown", (event) => {
                this.onKeyDown(event);
            });
        }
        if (this.mediaSessionAvailable) {
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

    get mediaSessionAvailable() {
        return !this.fastboot.isFastBoot && "mediaSession" in navigator;
    }

    @action on(eventType: string, callback: (event: Event) => any) {
        this.audioElement.addEventListener(eventType, callback);
    }

    @action once(eventType: string, callback: (event: Event) => any) {
        const finalCallback = (event: Event) => {
            callback(event);
            this.audioElement.removeEventListener(eventType, finalCallback);
        };
        this.audioElement.addEventListener(eventType, finalCallback);
    }

    @action onDurationChange() {
        if (!isNaN(this.audioElement.duration)) {
            this.duration = this.audioElement.duration;
            this.setMediaSessionPositionState();
        }
    }

    @action onEnded() {
        this.isPlaying = false;
        if (this.mediaSessionAvailable) navigator.mediaSession.playbackState = "none";
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
        this.isPlaying = true;
        if (this.mediaSessionAvailable) navigator.mediaSession.playbackState = "playing";
    }

    @action onRateChange() {
        this.playbackRate = this.audioElement.playbackRate;
        this.setMediaSessionPositionState();
    }

    @action onSeeked() {
        this.isSeeking = false;
    }

    @action onSeeking() {
        this.isSeeking = true;
    }

    @action onTimeUpdate() {
        if (this.audioElement.currentTime != this.currentTime) {
            this.currentTime = this.audioElement.currentTime;
            if (this.args["on-time-update"]) this.args["on-time-update"](this.currentTime);
            this.setMediaSessionPositionState();
        }
    }

    @action onVolumeChange() {
        this.volume = Math.sqrt(this.audioElement.volume);
        this.isMuted = this.audioElement.muted;
    }

    @action pause() {
        this.audioElement.pause();
    }

    @action play() {
        void this.audioElement.play();
    }

    @action playOrPause() {
        if (this.isPlaying) this.pause();
        else this.play();
    }

    @action refreshBufferEnd() {
        const bufferEnd = Math.max(
            ...[...Array(this.audioElement.buffered.length).keys()].map((i: number) =>
                this.audioElement.buffered.end(i),
            ),
        );

        if (bufferEnd != this.bufferEnd) {
            this.bufferEnd = bufferEnd;
            if (this.args["on-buffer-update"]) this.args["on-buffer-update"](bufferEnd);
        }
    }

    @action seek(seconds: number) {
        const time = coerceBetween(this.currentTime + seconds, 0, this.duration);

        this.currentTime = time;
        this.audioElement.currentTime = time;
    }

    @action seekToProgress(progress: number) {
        this.seekToTime(this.duration * progress);
    }

    @action seekToTime(time: number, fastSeek?: boolean) {
        this.currentTime = time;
        if (fastSeek) this.audioElement.fastSeek(time);
        else this.audioElement.currentTime = time;
    }

    @action setAudioElement(element: HTMLAudioElement) {
        this.audioElement = element;
        this.playbackRate = this.audioElement.playbackRate;
        if (!isNaN(this.audioElement.duration)) this.duration = this.audioElement.duration;
        this.currentTime = this.audioElement.currentTime;
        this.onVolumeChange();
        if (this.args["on-add"]) this.args["on-add"](this);
    }

    @action setPlaybackRate(value: number) {
        this.playbackRate = value;
        this.audioElement.playbackRate = value;
    }

    @action setSrc(value: string) {
        if (value != this.audioElement.src) {
            this.audioElement.src = value;
        }
    }

    @action setVolume(value: number) {
        this.volume = value;
        this.audioElement.volume = Math.pow(value, 2);
    }

    @action toggleMute() {
        const isMuted = !this.isMuted;

        this.isMuted = isMuted;
        this.audioElement.muted = isMuted;
    }

    setMediaSessionPositionState() {
        if (this.mediaSessionAvailable) {
            navigator.mediaSession.setPositionState({
                duration: this.audioElement.duration,
                playbackRate: this.audioElement.playbackRate,
                position: this.audioElement.currentTime,
            });
        }
    }
}
