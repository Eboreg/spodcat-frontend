import { action } from "@ember/object";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import { htmlSafe, type SafeString } from "@ember/template";
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
    @service declare audio: AudioService;
    @service declare intl: Registry["intl"];

    @tracked popupVisible: boolean = false;

    get buttonClass(): SafeString {
        if (this.audio.playbackRate != 1.0) return htmlSafe("text-primary-light");
        return htmlSafe("");
    }

    get currentLabel() {
        return this.playbackRates.find((r) => r.rate == this.audio.playbackRate)?.label;
    }

    get playbackRates(): PlaybackRate[] {
        return [
            { rate: 0.25, label: "0,25" },
            { rate: 0.5, label: "0,5" },
            { rate: 0.75, label: "0,75" },
            { rate: 1, label: this.intl.t("normal") },
            { rate: 1.25, label: "1,25" },
            { rate: 1.5, label: "1,5" },
            { rate: 1.75, label: "1,75" },
            { rate: 2, label: "2" },
        ];
    }

    @action onOutsideClick() {
        this.popupVisible = false;
    }

    @action onRateClick(rate: number) {
        this.audio.setPlaybackRate(rate);
        this.popupVisible = false;
    }

    @action onTriggerButtonClick() {
        this.popupVisible = !this.popupVisible;
    }
}
