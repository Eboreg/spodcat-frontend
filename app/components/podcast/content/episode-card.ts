import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "spodcat/models/episode";
import type AudioService from "spodcat/services/audio";

export interface PodcastContentEpisodeCardSignature {
    Args: {
        episode: EpisodeModel;
        expand?: boolean;
    };
    Element: HTMLElement;
    Blocks: {
        default: [];
    };
}

export default class PodcastContentEpisodeCard extends Component<PodcastContentEpisodeCardSignature> {
    @service declare audio: AudioService;

    @tracked currentTimeSnapshot: number = 0;
    @tracked showShareModal: boolean = false;

    get isLoadingAudio() {
        return this.audio.isLoadingEpisode == this.args.episode.slug;
    }

    get isPlaying() {
        return this.audio.episode == this.args.episode && this.audio.isPlaying;
    }

    @action closeShareModal() {
        this.showShareModal = false;
    }

    @action getCurrentTime() {
        return this.audio.currentTime;
    }

    @action onPlayClick() {
        this.audio.playEpisode(this.args.episode);
    }

    @action openShareModal() {
        this.showShareModal = true;
        this.currentTimeSnapshot = this.audio.currentTime;
    }
}
