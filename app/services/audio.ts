import { action } from "@ember/object";
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "podcast-frontend/models/episode";
import { timeString } from "podcast-frontend/utils";

export default class AudioService extends Service {
    @tracked element?: HTMLAudioElement;
    @tracked episode?: EpisodeModel;
    @tracked currentTime: number = 0;
    @tracked duration: number = 0;
    @tracked bufferEnd: number = 0;
    @tracked isPlaying: boolean = false;
    @tracked currentProgress: number = 0;
    @tracked bufferProgress: number = 0;
    @tracked volume: number = 0;
    @tracked isMuted: boolean = false;

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

    @action seekTo(progress: number) {
        if (this.element) this.element.currentTime = this.duration * progress;
    }

    @action setElement(element: HTMLAudioElement) {
        this.element = element;
    }

    @action setIsMuted(value: boolean) {
        if (this.element) {
            this.isMuted = value;
            this.element.muted = value;
        }
    }

    @action setVolume(value: number) {
        if (this.element) {
            this.volume = value;
            this.element.volume = value;
        }
    }

    @action updateAudioData() {
        const element = this.element;

        if (element) {
            if (!isNaN(element.duration)) this.duration = element.duration;
            this.isPlaying = !element.paused && !element.ended;
            this.onTimeUpdate();
            this.updateVolume();
            if (element.buffered.length > 0) {
                this.bufferEnd = Math.max(
                    ...[...Array(element.buffered.length).keys()].map((i: number) => element.buffered.end(i)),
                );
            }
        }
    }

    @action updateVolume() {
        if (this.element) {
            this.volume = this.element.volume;
            this.isMuted = this.element.muted;
        }
    }
}

declare module "@ember/service" {
    interface Registry {
        audio: AudioService;
    }
}
