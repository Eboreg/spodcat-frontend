import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type EpisodeModel from "podcast-frontend/models/episode";
import type EpisodeSongModel from "podcast-frontend/models/episode-song";
import type AudioService from "podcast-frontend/services/audio";

export default class PodcastEpisodeController extends Controller<EpisodeModel> {
    @service declare audio: AudioService;
    @service declare fastboot: FastBoot;
    queryParams = ["start"];
    @tracked declare model: EpisodeModel;
    @tracked start: string | null = null;

    get showSongs() {
        return !this.fastboot.isFastBoot;
    }

    @action onSongClick(song: EpisodeSongModel) {
        void this.audio.playEpisode(this.model, song.timestamp, true);
    }
}
