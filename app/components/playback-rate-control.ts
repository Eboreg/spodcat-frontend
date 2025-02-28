import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type AudioService from "podcast-frontend/services/audio";

export interface PlaybackRateControlSignature {
    Element: null;
}

interface PlaybackRate {
    rate: number;
    label: string;
}

export default class PlaybackRateControl extends Component<PlaybackRateControlSignature> {
    playbackRates: PlaybackRate[] = [
        { rate: 0.25, label: "0,25" },
        { rate: 0.5, label: "0,5" },
        { rate: 0.75, label: "0,75" },
        { rate: 1, label: "Normal" },
        { rate: 1.25, label: "1,25" },
        { rate: 1.5, label: "1,5" },
        { rate: 1.75, label: "1,75" },
        { rate: 2, label: "2" },
    ];
    @service declare audio: AudioService;
    @tracked popupVisible: boolean = false;

    @action onOutsideClick() {
        this.popupVisible = false;
    }

    @action onRateClick(rate: number) {
        this.audio.setPlaybackRate(rate);
        this.popupVisible = false;
    }

    @action togglePopup() {
        this.popupVisible = !this.popupVisible;
    }
}
