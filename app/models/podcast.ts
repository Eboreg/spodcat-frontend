import ENV from "podcast-frontend/config/environment";
import Model, { attr, hasMany, type HasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type CategoryModel from "./category";
import type PodcastLinkModel from "./podcast-link";
import type PodcastContentModel from "./podcast-content";
import type { Favicon, Image, Rss } from "podcast-frontend/services/head-data";
import { htmlSafe, type SafeString } from "@ember/template";

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
    @attr declare "name-font-family": string;
    @attr declare "name-font-size": "small" | "normal" | "large";
    @attr declare "enable-comments": boolean;
    @attr declare "require-comment-approval": boolean;

    @hasMany<PodcastContentModel>("podcast-content", { async: false, inverse: "podcast", polymorphic: true })
    declare contents: HasMany<PodcastContentModel>;
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

    get nameCssClass(): SafeString {
        return htmlSafe(this["name-font-size"]);
    }

    get nameCssStyle(): SafeString {
        return htmlSafe(`font-family: "${this["name-font-family"]}"`);
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
