import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "podcast-frontend/models/episode";
import { coerceBetween, timeString } from "podcast-frontend/utils";

export default class AudioService extends Service {
    @tracked bufferEnd: number = 0;
    @tracked duration: number = 0;
    @tracked currentTime: number = 0;
    @tracked element?: HTMLAudioElement;
    @tracked volume: number = 0;

    @tracked bufferProgress: number = 0;
    @tracked currentProgress: number = 0;
    @tracked episode?: EpisodeModel;
    @tracked isMuted: boolean = false;
    @tracked isPlaying: boolean = false;
    @tracked isSeeking: boolean = false;
    @tracked playbackRate: number = 1;

    get currentTimeString() {
        return timeString(this.currentTime);
    }

    get displayedVolume() {
        if (this.isMuted) return 0;
        return this.volume;
    }

    get durationString() {
        return timeString(this.duration);
    }

    #updateBufferProgress() {
        if (this.episode && this.duration > 0) {
            const progress = Math.floor((this.bufferEnd / this.duration) * this.episode["dbfs-array"].length);
            if (progress != this.bufferProgress) this.bufferProgress = progress;
        }
    }

    #updateCurrentProgress() {
        if (this.episode && this.duration > 0) {
            const progress = Math.floor((this.currentTime / this.duration) * this.episode["dbfs-array"].length);
            if (progress != this.currentProgress) this.currentProgress = progress;
        }
    }

    @action onKeyDown(event: KeyboardEvent) {
        if (event.metaKey) return;

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

    @action onSeeked() {
        this.isSeeking = false;
    }

    @action onSeeking() {
        this.isSeeking = true;
    }

    @action onTimeUpdate() {
        if (this.element) {
            this.currentTime = this.element.currentTime;
            this.#updateCurrentProgress();
            this.#updateBufferProgress();
        }
    }

    @action pause() {
        this.element?.pause();
    }

    @action play() {
        void this.element?.play();
    }

    @action playOrPause() {
        if (this.isPlaying) this.pause();
        else this.play();
    }

    @action refreshAudioData() {
        const element = this.element;

        if (element) {
            if (!isNaN(element.duration)) this.duration = element.duration;
            this.isPlaying = !element.paused && !element.ended;
            this.onTimeUpdate();
            this.refreshVolume();
            if (element.buffered.length > 0) {
                this.bufferEnd = Math.max(
                    ...[...Array(element.buffered.length).keys()].map((i: number) => element.buffered.end(i)),
                );
            }
        }
    }

    @action refreshVolume() {
        if (this.element) {
            this.volume = this.element.volume;
            this.isMuted = this.element.muted;
        }
    }

    @action seek(seconds: number) {
        if (this.element) {
            const time = coerceBetween(this.currentTime + seconds, 0, this.duration);

            this.currentTime = time;
            this.element.currentTime = time;
        }
    }

    @action seekTo(progress: number) {
        if (this.element) this.element.currentTime = this.duration * progress;
    }

    @action setAudioElement(element: HTMLAudioElement) {
        this.element = element;
        document.addEventListener("keydown", (event) => {
            this.onKeyDown(event);
        });
    }

    @action setIsMuted(value: boolean) {
        if (this.element) {
            this.isMuted = value;
            this.element.muted = value;
        }
    }

    @action setPlaybackRate(value: number) {
        if (this.element) {
            this.playbackRate = value;
            this.element.playbackRate = value;
        }
    }

    @action setVolume(value: number) {
        if (this.element) {
            this.volume = value;
            this.element.volume = value;
        }
    }
}

declare module "@ember/service" {
    interface Registry {
        audio: AudioService;
    }
}
