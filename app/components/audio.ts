import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
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
    declare audioElement: HTMLAudioElement;

    @tracked bufferEnd: number = 0;
    @tracked currentTime: number = 0;
    @tracked duration: number = 0;
    @tracked isMuted: boolean = false;
    @tracked isPlaying: boolean = false;
    @tracked isSeeking: boolean = false;
    @tracked playbackRate: number = 1;
    @tracked volume: number = 0;

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

    @action refreshAudioData() {
        if (!isNaN(this.audioElement.duration)) this.duration = this.audioElement.duration;
        this.isPlaying = !this.audioElement.paused && !this.audioElement.ended;
        this.refreshCurrentTime();
        this.refreshVolume();
        this.refreshBufferEnd();
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

    @action refreshCurrentTime() {
        if (this.audioElement.currentTime != this.currentTime) {
            this.currentTime = this.audioElement.currentTime;
            if (this.args["on-time-update"]) this.args["on-time-update"](this.currentTime);
        }
    }

    @action refreshVolume() {
        this.volume = this.audioElement.volume;
        this.isMuted = this.audioElement.muted;
    }

    @action seek(seconds: number) {
        const time = coerceBetween(this.currentTime + seconds, 0, this.duration);

        this.currentTime = time;
        this.audioElement.currentTime = time;
    }

    @action seekToProgress(progress: number) {
        this.seekToTime(this.duration * progress);
    }

    @action seekToTime(time: number) {
        this.currentTime = time;
        this.audioElement.currentTime = time;
    }

    @action setAudioElement(element: HTMLAudioElement) {
        document.addEventListener("keydown", (event) => {
            this.onKeyDown(event);
        });
        this.audioElement = element;
        if (this.args["on-add"]) this.args["on-add"](this);
    }

    @action setIsMuted(value: boolean) {
        this.isMuted = value;
        this.audioElement.muted = value;
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
        this.audioElement.volume = value;
    }
}
