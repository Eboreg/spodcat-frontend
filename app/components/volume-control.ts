import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type AudioService from "podcast-frontend/services/audio";

export interface VolumeControlSignature {
    Element: null;
}

export default class VolumeControl extends Component<VolumeControlSignature> {
    @service declare audio: AudioService;

    @action mute() {
        this.audio.setIsMuted(true);
    }

    @action onVolumeInput(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            this.audio.setVolume(event.target.valueAsNumber);
        }
    }

    @action unmute() {
        this.audio.setIsMuted(false);
    }
}
