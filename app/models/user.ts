import Model, { attr, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastModel from "./podcast";

export default class UserModel extends Model {
    @attr declare username: string;
    @attr declare "first-name": string;
    @attr declare "last-name": string;
    @attr declare email: string;
    @hasMany<PodcastModel>("podcast", { async: false, inverse: "authors" })
    declare podcasts: HasMany<PodcastModel>;
    @hasMany<PodcastModel>("podcast", { async: false, inverse: "owner" })
    declare "owned-podcasts": HasMany<PodcastModel>;

    [Type] = "user" as const;
}
