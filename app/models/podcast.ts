import Model, { attr, hasMany, type AsyncHasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type EpisodeModel from "./episode";
import type UserModel from "./user";
import type CategoryModel from "./category";
import type PodcastLinkModel from "./podcast-link";

export default class PodcastModel extends Model {
    @attr declare name: string;
    @attr declare description?: string;
    @attr declare "description-html"?: string;
    @attr declare cover?: string;
    @attr declare "cover-thumbnail"?: string;
    @attr declare banner?: string;
    @attr declare tagline?: string;
    @attr declare language?: string;
    @attr declare "rss-url": string;
    @attr declare favicon?: string;
    @attr declare "favicon-content-type"?: string;

    @hasMany<EpisodeModel>("episode", { async: false, inverse: "podcast" })
    declare episodes: HasMany<EpisodeModel>;
    @hasMany<UserModel>("user", { async: true, inverse: "podcasts" })
    declare owners: AsyncHasMany<UserModel>;
    @hasMany<CategoryModel>("category", { async: false, inverse: null })
    declare categories: HasMany<CategoryModel>;
    @hasMany<PodcastLinkModel>("podcast-link", { async: false, inverse: "podcast" })
    declare links: HasMany<PodcastLinkModel>;

    [Type] = "podcast" as const;
}
