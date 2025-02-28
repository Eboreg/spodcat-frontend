import { service } from "@ember/service";
import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";

export interface PlayerBarExpandedSignature {
    Args: {
        episode: EpisodeModel;
    };
    Element: HTMLDivElement;
}

export default class PlayerBarExpanded extends Component<PlayerBarExpandedSignature> {
    @service declare audio: AudioService;
}
