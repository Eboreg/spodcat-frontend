import Component from "@glimmer/component";
import type EpisodeModel from "spodcat/models/episode";
import type PodcastModel from "spodcat/models/podcast";
import { action } from "@ember/object";
import type EpisodeSongModel from "spodcat/models/episode-song";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type AudioService from "spodcat/services/audio";

export interface PodcastEpisodeSignature {
    Args: {
        podcast: PodcastModel;
        episode: EpisodeModel;
    };
    Blocks: {
        default: [];
    };
}

export default class PodcastEpisode extends Component<PodcastEpisodeSignature> {
    @service declare audio: AudioService;
    @service declare fastboot: FastBoot;

    get hasSongs() {
        return !this.fastboot.isFastBoot && this.args.episode.songs.length > 0;
    }

    @action onSongClick(song: EpisodeSongModel) {
        this.audio.playEpisode(this.args.episode, song["start-time"]);
    }
}
