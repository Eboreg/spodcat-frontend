import { service } from "@ember/service";
import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";

export interface PlayerBarSignature {
    Args: {
        episode: EpisodeModel;
    };
    Element: HTMLDivElement;
}

export default class PlayerBar extends Component<PlayerBarSignature> {
    @service declare audio: AudioService;
}
