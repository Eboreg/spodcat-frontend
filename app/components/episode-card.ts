import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";

export interface EpisodeCardSignature {
    Args: {
        episode: EpisodeModel;
        "expand-link"?: boolean;
        start?: string | null;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [];
    };
}

export default class EpisodeCard extends Component<EpisodeCardSignature> {
    @service declare audio: AudioService;
    @tracked isLoadingAudio: boolean = false;

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

    @action async play() {
        if (this.audio.episode != this.args.episode) {
            this.isLoadingAudio = true;
            this.audio.once("play", () => {
                this.isLoadingAudio = false;
            });
            if (this.args.episode["dbfs-array"] == undefined) await this.args.episode.reload();
            this.audio.setEpisode(this.args.episode);
            if (this.start) this.audio.seekToTime(this.start);
        }
        this.audio.play();
    }
}
