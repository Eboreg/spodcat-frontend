import { attr } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import { timeString } from "podcast-frontend/utils";
import PodcastContentModel from "./podcast-content";

export default class EpisodeModel extends PodcastContentModel {
    @attr declare number?: number;
    @attr declare "audio-file": string;
    @attr declare "duration-seconds": number;
    @attr declare "dbfs-array": number[];
    @attr declare "audio-content-type": string;
    @attr declare "audio-file-length": number;
    @attr declare "audio-url": string;

    get durationString() {
        return timeString(this["duration-seconds"]);
    }

    get hasNumber() {
        return this.number != undefined;
    }

    get isEpisode() {
        return true;
    }

    [Type] = "episode" as const;
}
