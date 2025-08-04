import ENV from "spodcat/config/environment";
import { attr, belongsTo, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import { makeAbsoluteUrl, timeToString } from "spodcat/utils";
import PodcastContentModel from "./podcast-content";
import type EpisodeSongModel from "./episode-song";
import type { Image } from "global";
import type SeasonModel from "./season";

export default class EpisodeModel extends PodcastContentModel {
    @attr declare "audio-content-type"?: string;
    @attr declare "audio-url": string;
    @attr declare "dbfs-array"?: number[];
    @attr declare "duration-seconds": number;
    @attr declare "has-songs": boolean;
    @attr declare image?: string;
    @attr declare "image-height"?: number;
    @attr declare "image-mimetype"?: string;
    @attr declare "image-thumbnail-height"?: number;
    @attr declare "image-thumbnail-mimetype"?: string;
    @attr declare "image-thumbnail-width"?: number;
    @attr declare "image-thumbnail"?: string;
    @attr declare "image-width"?: number;
    @attr declare number?: number;

    @belongsTo<SeasonModel>("season", { async: false, inverse: "episodes" })
    declare season?: SeasonModel;
    @hasMany<EpisodeSongModel>("episode-song", { async: false, inverse: "episode" })
    declare songs: HasMany<EpisodeSongModel>;

    get durationString() {
        return timeToString(this["duration-seconds"]);
    }

    get frontendUrl() {
        return makeAbsoluteUrl(`${this.podcast.id}/episode/${this.slug}`);
    }

    get imageData(): Image | undefined {
        const size =
            this["image-height"] && this["image-width"]
                ? { height: this["image-height"], width: this["image-width"] }
                : undefined;

        return this.image ? { url: this.image, size: size } : undefined;
    }

    get isEpisode() {
        return true;
    }

    get mediaImages(): MediaImage[] {
        const result: MediaImage[] = [];

        if (this.image) {
            result.push({
                src: this.image,
                sizes: `${this["image-width"]}x${this["image-height"]}`,
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
        if (this.podcast.cover) {
            result.push({
                src: this.podcast.cover,
                sizes: `${this.podcast["cover-width"]}x${this.podcast["cover-height"]}`,
                type: this.podcast["cover-mimetype"],
            });
        }
        if (this.podcast["cover-thumbnail"]) {
            result.push({
                src: this.podcast["cover-thumbnail"],
                sizes: `${this.podcast["cover-thumbnail-width"]}x${this.podcast["cover-thumbnail-height"]}`,
                type: this.podcast["cover-thumbnail-mimetype"],
            });
        }

        return result;
    }

    get numberString() {
        return this.number?.toLocaleString("sv");
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
