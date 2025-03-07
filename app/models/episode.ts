import ENV from "podcast-frontend/config/environment";
import { attr, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import { timeString } from "podcast-frontend/utils";
import PodcastContentModel from "./podcast-content";
import type EpisodeSongModel from "./episode-song";

export default class EpisodeModel extends PodcastContentModel {
    @attr declare number?: number;
    @attr declare "audio-file": string;
    @attr declare "duration-seconds": number;
    @attr declare "dbfs-array": number[];
    @attr declare "audio-content-type": string;
    @attr declare "audio-file-length": number;
    @attr declare "audio-url": string;

    @hasMany<EpisodeSongModel>("episode-song", { async: false, inverse: "episode" })
    declare songs: HasMany<EpisodeSongModel>;

    get durationString() {
        return timeString(this["duration-seconds"]);
    }

    get hasNumber() {
        return this.number != undefined;
    }

    get isEpisode() {
        return true;
    }

    get route() {
        if (ENV.APP.IS_SINGLETON) return "episode";
        return "podcast.episode";
    }

    get routeModels() {
        if (ENV.APP.IS_SINGLETON) return [this.slug];
        return [this.podcast, this.slug];
    }

    [Type] = "episode" as const;
}
