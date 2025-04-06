import { action } from "@ember/object";
import Service from "@ember/service";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type Audio from "podcast-frontend/components/audio";
import type EpisodeModel from "podcast-frontend/models/episode";
import { timeString } from "podcast-frontend/utils";

interface AudioEventListener {
    type: string;
    callback: (event: Event) => any;
    once: boolean;
}

export default class AudioService extends Service {
    _listeners: AudioEventListener[] = [];

    @service declare fastboot: FastBoot;

    @tracked bufferProgress: number = 0;
    @tracked currentProgress: number = 0;
    @tracked element?: Audio;
    @tracked episode?: EpisodeModel;
    @tracked isLoadingEpisode?: string;

    constructor(...args: ConstructorParameters<typeof Service>) {
        super(...args);
        if (this.mediaSessionAvailable) {
            navigator.mediaSession.metadata = null;
            navigator.mediaSession.setPositionState();
        }
    }

    get currentTimeString() {
        return timeString(this.element?.currentTime || 0);
    }

    get duration() {
        return this.element?.duration || 0;
    }

    get durationString() {
        return timeString(this.duration);
    }

    get isMuted() {
        return this.element?.isMuted == true;
    }

    get isPlaying() {
        return this.element?.isPlaying == true;
    }

    get isSeeking() {
        return this.element?.isSeeking == true;
    }

    get mediaSessionAvailable() {
        return !this.fastboot.isFastBoot && "mediaSession" in navigator;
    }

    get playbackRate() {
        return this.element?.playbackRate || 1;
    }

    get volume() {
        if (this.isMuted) return 0;
        return this.element?.volume || 0;
    }

    @action on(eventType: string, callback: (event: Event) => any) {
        if (this.element) this.element.on(eventType, callback);
        else this._listeners.push({ type: eventType, callback: callback, once: false });
    }

    @action onBufferUpdate(bufferEnd: number) {
        if (this.episode && this.duration > 0) {
            const progress = Math.floor((bufferEnd / this.duration) * this.episode["dbfs-array"].length);
            if (progress != this.bufferProgress) this.bufferProgress = progress;
        }
    }

    @action onTimeUpdate(currentTime: number) {
        if (this.episode && this.duration > 0) {
            const progress = Math.floor((currentTime / this.duration) * this.episode["dbfs-array"].length);
            if (progress != this.currentProgress) this.currentProgress = progress;
        }
    }

    @action once(eventType: string, callback: (event: Event) => any) {
        if (this.element) this.element.once(eventType, callback);
        else this._listeners.push({ type: eventType, callback: callback, once: true });
    }

    @action pause() {
        this.element?.pause();
    }

    @action play() {
        this.element?.play();
    }

    @action async playEpisode(episode: EpisodeModel, start?: number, alwaysSeek?: boolean) {
        if (this.episode != episode) {
            this.isLoadingEpisode = episode.slug;
            this.once("play", () => {
                this.isLoadingEpisode = undefined;
            });
            if (episode["dbfs-array"] == undefined) await episode.reload();
            this.setEpisode(episode);
            if (start && !alwaysSeek) this.seekToTime(start);
        }
        if (start && alwaysSeek) this.seekToTime(start);
        this.play();
    }

    @action playOrPause() {
        this.element?.playOrPause();
    }

    @action seekToProgress(progress: number) {
        this.element?.seekToProgress(progress);
    }

    @action seekToTime(time: number) {
        this.element?.seekToTime(time);
    }

    @action setAudioElement(element: Audio) {
        this.element = element;
        if (this.episode) element.setSrc(this.episode["audio-url"]);

        let listener = this._listeners.shift();

        while (listener != undefined) {
            if (listener.once) element.once(listener.type, listener.callback);
            else element.on(listener.type, listener.callback);
            listener = this._listeners.shift();
        }
    }

    @action setEpisode(value: EpisodeModel) {
        this.episode = value;
        this.element?.setSrc(value["audio-url"]);

        if (!this.fastboot.isFastBoot && "mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: value.name,
                artist: value.podcast.name,
                artwork: value.podcast.coverMediaImages,
            });
        }
    }

    @action setPlaybackRate(value: number) {
        this.element?.setPlaybackRate(value);
    }

    @action setVolume(value: number) {
        this.element?.setVolume(value);
    }

    @action toggleMute() {
        this.element?.toggleMute();
    }
}

declare module "@ember/service" {
    interface Registry {
        audio: AudioService;
    }
}
