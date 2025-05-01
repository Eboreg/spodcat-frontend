import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type AudioService from "podcast-frontend/services/audio";

export interface VolumeControlSignature {
    Element: null;
}

export default class VolumeControl extends Component<VolumeControlSignature> {
    @service declare audio: AudioService;
    @tracked popupVisible: boolean = false;

    @action onOutsideClick() {
        this.popupVisible = false;
    }

    @action onTriggerButtonClick() {
        this.popupVisible = !this.popupVisible;
    }
}
