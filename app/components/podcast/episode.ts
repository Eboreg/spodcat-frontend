import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";
import type PodcastModel from "podcast-frontend/models/podcast";
import type PodcastBase from "./base";
import { action } from "@ember/object";
import type EpisodeSongModel from "podcast-frontend/models/episode-song";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type AudioService from "podcast-frontend/services/audio";

export interface PodcastEpisodeSignature {
    Args: {
        podcast: PodcastModel;
        episode: EpisodeModel;
        start?: number;
    };
    Element: typeof PodcastBase;
}

export default class PodcastEpisode extends Component<PodcastEpisodeSignature> {
    @service declare audio: AudioService;
    @service declare fastboot: FastBoot;

    get hasSongs() {
        return !this.fastboot.isFastBoot && this.args.episode.songs.length > 0;
    }

    @action onSongClick(song: EpisodeSongModel) {
        this.audio.playEpisode(this.args.episode, song["start-time"], true);
    }
}
