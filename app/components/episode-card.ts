import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";

export interface EpisodeCardSignature {
    Args: {
        episode: EpisodeModel;
        "expand-link"?: boolean;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [];
    };
}

export default class EpisodeCard extends Component<EpisodeCardSignature> {
    @service declare audio: AudioService;

    get isPlaying() {
        return this.audio.episode == this.args.episode && this.audio.isPlaying;
    }

    @action play() {
        this.audio.episode = this.args.episode;
        this.audio.play();
    }
}
