import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "spodcat/models/episode";
import type AudioService from "spodcat/services/audio";

export interface PlayerBarExpandedSignature {
    Args: {
        episode: EpisodeModel;
    };
    Element: HTMLDivElement;
}

export default class PlayerBarExpanded extends Component<PlayerBarExpandedSignature> {
    @service declare audio: AudioService;
    @tracked isKeyboardHelpOpen: boolean = false;

    @action onKeyboardHelpOutsideClick() {
        this.isKeyboardHelpOpen = false;
    }

    @action onKeyboardHelpButtonClick() {
        this.isKeyboardHelpOpen = !this.isKeyboardHelpOpen;
    }
}
