import Model, { attr, hasMany, type AsyncHasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type UserModel from "./user";
import type CategoryModel from "./category";
import type PodcastLinkModel from "./podcast-link";
import type PodcastContentModel from "./podcast-content";
import type { Favicon, Image } from "podcast-frontend/services/head-data";

export default class PodcastModel extends Model {
    @attr declare banner?: string;
    @attr declare "banner-height"?: number;
    @attr declare "banner-width"?: number;
    @attr declare cover?: string;
    @attr declare "cover-thumbnail"?: string;
    @attr declare description?: string;
    @attr declare "description-html"?: string;
    @attr declare favicon?: string;
    @attr declare "favicon-content-type"?: string;
    @attr declare language?: string;
    @attr declare name: string;
    @attr declare "rss-url": string;
    @attr declare tagline?: string;

    @hasMany<PodcastContentModel>("podcast-content", { async: false, inverse: "podcast", polymorphic: true })
    declare contents: HasMany<PodcastContentModel>;
    // @hasMany<EpisodeModel>("episode", { async: false, inverse: "podcast" })
    // declare episodes: HasMany<EpisodeModel>;
    @hasMany<UserModel>("user", { async: true, inverse: "podcasts" })
    declare owners: AsyncHasMany<UserModel>;
    @hasMany<CategoryModel>("category", { async: false, inverse: null })
    declare categories: HasMany<CategoryModel>;
    @hasMany<PodcastLinkModel>("podcast-link", { async: false, inverse: "podcast" })
    declare links: HasMany<PodcastLinkModel>;

    get bannerData(): Image | undefined {
        if (this.banner && this["banner-height"] && this["banner-width"]) {
            return { url: this.banner, height: this["banner-height"], width: this["banner-width"] };
        }
        return;
    }

    get faviconData(): Favicon | undefined {
        if (this.favicon && this["favicon-content-type"]) {
            return { url: this.favicon, contentType: this["favicon-content-type"] };
        }
        return;
    }

    [Type] = "podcast" as const;
}
