import ENV from "podcast-frontend/config/environment";
import { attr, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import { timeString } from "podcast-frontend/utils";
import PodcastContentModel from "./podcast-content";
import type EpisodeSongModel from "./episode-song";

export default class EpisodeModel extends PodcastContentModel {
    @attr declare number?: number;
    @attr declare "duration-seconds": number;
    @attr declare "dbfs-array": number[];
    @attr declare "audio-content-type": string;
    @attr declare "audio-url": string;
    @attr declare "has-songs": boolean;
    @attr declare image?: string;
    @attr declare "image-height"?: number;
    @attr declare "image-width"?: number;
    @attr declare "image-mimetype"?: string;
    @attr declare "image-thumbnail"?: string;
    @attr declare "image-thumbnail-height"?: number;
    @attr declare "image-thumbnail-width"?: number;
    @attr declare "image-thumbnail-mimetype"?: string;

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

    get mediaImages(): MediaImage[] {
        const result: MediaImage[] = [];

        if (this.image) {
            result.push({
                src: this.image,
                sizes: `${this["image-height"]}x${this["image-width"]}`,
                type: this["image-mimetype"],
            });
        }
        if (this["image-thumbnail"]) {
            result.push({
                src: this["image-thumbnail"],
                sizes: `${this["image-thumbnail-width"]}x${this["image-thumbnail-height"]}`,
                type: this["image-thumbnail-mimetype"],
            });
        }

        return result;
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
