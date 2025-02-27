import { service } from "@ember/service";
import Component from "@glimmer/component";
import type PodcastModel from "podcast-frontend/models/podcast";
import type AudioService from "podcast-frontend/services/audio";

export interface PodcastBaseSignature {
    Args: {
        podcast: PodcastModel;
    };
    Blocks: {
        before: [];
        default: [];
    };
    Element: HTMLElement;
}

export default class PodcastBase extends Component<PodcastBaseSignature> {
    @service declare audio: AudioService;
}
