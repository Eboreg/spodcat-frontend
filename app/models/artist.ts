import { attr, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import Model from "@ember-data/model";
import type EpisodeSongModel from "./episode-song";

export default class ArtistModel extends Model {
    @attr declare name: string;

    @hasMany<EpisodeSongModel>("episode-song", { async: false, inverse: "artists" })
    declare songs: HasMany<EpisodeSongModel>;

    [Type] = "artist" as const;
}
