import { attr, belongsTo, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import Model from "@ember-data/model";
import type EpisodeModel from "./episode";
import type ArtistModel from "./artist";
import { timeString } from "podcast-frontend/utils";

export default class EpisodeSongModel extends Model {
    @attr declare comment?: string;
    @attr declare name: string;
    @attr declare timestamp: number;

    @hasMany<ArtistModel>("artist", { async: false, inverse: "songs" })
    declare artists: HasMany<ArtistModel>;
    @belongsTo<EpisodeModel>("episode", { async: false, inverse: "songs" })
    declare episode: EpisodeModel;

    get artistString() {
        return this.artists.map((a) => a.name).join("/");
    }

    get timestampString() {
        return timeString(this.timestamp);
    }

    [Type] = "episode-song" as const;
}
