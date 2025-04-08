import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";

export interface PodcastContentEpisodeCardSignature {
    Args: {
        episode: EpisodeModel;
        expand?: boolean;
        start?: string | null;
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

    get start(): number | undefined {
        if (this.args.start) {
            const start = parseFloat(this.args.start);
            if (!isNaN(start)) return start;
        }
        return;
    }

    @action play() {
        this.audio.playEpisode(this.args.episode, this.start);
    }
}
