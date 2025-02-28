import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type AudioService from "podcast-frontend/services/audio";

export interface VolumeControlInnerSignature {
    Element: HTMLDivElement;
}

export default class VolumeControlInner extends Component<VolumeControlInnerSignature> {
    @service declare audio: AudioService;

    @action onVolumeInput(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            this.audio.setVolume(event.target.valueAsNumber);
        }
    }
}
