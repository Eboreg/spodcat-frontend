import ENV from "podcast-frontend/config/environment";
import Model, { attr, hasMany, type AsyncHasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type UserModel from "./user";
import type CategoryModel from "./category";
import type PodcastLinkModel from "./podcast-link";
import type PodcastContentModel from "./podcast-content";
import type { Favicon, Image, Rss } from "podcast-frontend/services/head-data";

export default class PodcastModel extends Model {
    @attr declare banner?: string;
    @attr declare "banner-height"?: number;
    @attr declare "banner-width"?: number;
    @attr declare cover?: string;
    @attr declare "cover-height"?: number;
    @attr declare "cover-width"?: number;
    @attr declare "cover-mimetype"?: string;
    @attr declare "cover-thumbnail"?: string;
    @attr declare "cover-thumbnail-height"?: number;
    @attr declare "cover-thumbnail-width"?: number;
    @attr declare "cover-thumbnail-mimetype"?: string;
    @attr declare favicon?: string;
    @attr declare "favicon-content-type"?: string;
    @attr declare language?: string;
    @attr declare name: string;
    @attr declare "rss-url": string;
    @attr declare tagline?: string;
    @attr declare description?: string;
    @attr declare "description-html"?: string;

    @hasMany<PodcastContentModel>("podcast-content", { async: false, inverse: "podcast", polymorphic: true })
    declare contents: HasMany<PodcastContentModel>;
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

    get coverMediaImages(): MediaImage[] {
        const result: MediaImage[] = [];

        if (this.cover) {
            result.push({
                src: this.cover,
                sizes: `${this["cover-height"]}x${this["cover-width"]}`,
                type: this["cover-mimetype"],
            });
        }
        if (this["cover-thumbnail"]) {
            result.push({
                src: this["cover-thumbnail"],
                sizes: `${this["cover-thumbnail-width"]}x${this["cover-thumbnail-height"]}`,
                type: this["cover-thumbnail-mimetype"],
            });
        }

        return result;
    }

    get faviconData(): Favicon | undefined {
        if (this.favicon && this["favicon-content-type"]) {
            return { url: this.favicon, contentType: this["favicon-content-type"] };
        }
        return;
    }

    get route() {
        if (ENV.APP.IS_SINGLETON) return "home";
        return "podcast";
    }

    get routeModels() {
        if (ENV.APP.IS_SINGLETON) return [];
        return [this];
    }

    get rssData(): Rss | undefined {
        return { title: this.name, url: this["rss-url"] };
    }

    [Type] = "podcast" as const;
}
