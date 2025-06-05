import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";

export interface PodcastContentEpisodeCardSignature {
    Args: {
        episode: EpisodeModel;
        expand?: boolean;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [];
    };
}

export default class PodcastContentEpisodeCard extends Component<PodcastContentEpisodeCardSignature> {
    @service declare audio: AudioService;

    get isLoadingAudio() {
        return this.audio.isLoadingEpisode == this.args.episode.slug;
    }

    get isPlaying() {
        return this.audio.episode == this.args.episode && this.audio.isPlaying;
    }

    @action onPlayClick() {
        this.audio.playEpisode(this.args.episode);
    }
}
