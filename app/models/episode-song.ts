import { attr, belongsTo, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import Model from "@ember-data/model";
import type EpisodeModel from "./episode";
import type ArtistModel from "./artist";
import { timeToString } from "podcast-frontend/utils";

export default class EpisodeSongModel extends Model {
    @attr declare comment?: string;
    @attr declare title: string;
    @attr declare "start-time": number;

    @hasMany<ArtistModel>("artist", { async: false, inverse: "songs" })
    declare artists: HasMany<ArtistModel>;
    @belongsTo<EpisodeModel>("episode", { async: false, inverse: "songs" })
    declare episode: EpisodeModel;

    get artistString() {
        return this.artists.map((a) => a.name).join("/");
    }

    get displayString() {
        let result = "";
        const artist = this.artistString;

        if (artist) result += `${artist} – `;
        result += this.title;
        if (this.comment) result += ` (${this.comment})`;

        return result;
    }

    get timestampString() {
        return timeToString(this["start-time"]);
    }

    [Type] = "episode-song" as const;
}
