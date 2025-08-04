import ENV from "spodcat/config/environment";
import Model, { attr, hasMany, type AsyncHasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastLinkModel from "./podcast-link";
import type PodcastContentModel from "./podcast-content";
import { htmlSafe, type SafeString } from "@ember/template";
import type { Favicon, Image, Rss } from "global";
import type SeasonModel from "./season";

export default class PodcastModel extends Model {
    @attr declare banner?: string;
    @attr declare "banner-height"?: number;
    @attr declare "banner-width"?: number;
    @attr declare cover?: string;
    @attr declare "cover-height"?: number;
    @attr declare "cover-mimetype"?: string;
    @attr declare "cover-thumbnail-height"?: number;
    @attr declare "cover-thumbnail-mimetype"?: string;
    @attr declare "cover-thumbnail-width"?: number;
    @attr declare "cover-thumbnail"?: string;
    @attr declare "cover-width"?: number;
    @attr declare description?: string;
    @attr declare "description-html"?: string;
    @attr declare "enable-comments": boolean;
    @attr declare "episodes-fm-url": string;
    @attr declare favicon?: string;
    @attr declare "favicon-content-type"?: string;
    @attr declare language?: string;
    @attr declare name: string;
    @attr declare "name-font-family": string;
    @attr declare "name-font-size": "small" | "normal" | "large";
    @attr declare "require-comment-approval": boolean;
    @attr declare "rss-url": string;
    @attr declare tagline?: string;

    @hasMany<PodcastContentModel>("podcast-content", { async: true, inverse: "podcast", polymorphic: true })
    declare contents: AsyncHasMany<PodcastContentModel>;
    @hasMany<PodcastLinkModel>("podcast-link", { async: true, inverse: "podcast" })
    declare links: AsyncHasMany<PodcastLinkModel>;
    @hasMany<SeasonModel>("season", { async: true, inverse: "podcast" })
    declare seasons: AsyncHasMany<SeasonModel>;

    get bannerCssStyle(): SafeString {
        return htmlSafe(this.banner ? `background-image: url("${this.banner}")` : "");
    }

    get bannerData(): Image | undefined {
        const size =
            this["banner-height"] && this["banner-width"]
                ? { height: this["banner-height"], width: this["banner-width"] }
                : undefined;

        return this.banner ? { url: this.banner, size: size } : undefined;
    }

    get faviconData(): Favicon | undefined {
        if (this.favicon && this["favicon-content-type"]) {
            return { url: this.favicon, contentType: this["favicon-content-type"] };
        }
        return;
    }

    get nameCssClass(): SafeString {
        const classes = [this["name-font-size"], this.banner ? "outlined-text" : "shadowed-text", "podcast-name"];
        return htmlSafe(classes.join(" "));
    }

    get nameCssStyle(): SafeString {
        return htmlSafe(this["name-font-family"] ? `font-family: "${this["name-font-family"]}"` : "");
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
