import Model, { attr, belongsTo, hasMany, type HasMany } from "@ember-data/model";
import type PodcastModel from "./podcast";
import { Type } from "@warp-drive/core-types/symbols";
import type CommentModel from "./comment";

export default class PodcastContentModel extends Model {
    @attr("date") declare created?: Date;
    @attr declare description?: string;
    @attr declare "description-html"?: string;
    @attr declare name: string;
    @attr("date") declare published: Date;
    @attr declare slug: string;

    @hasMany<CommentModel>("comment", { async: false, inverse: "podcast-content", as: "podcast-content" })
    declare comments: HasMany<CommentModel>;
    @belongsTo<PodcastModel>("podcast", { async: false, inverse: "contents", as: "podcast-content" })
    declare podcast: PodcastModel;

    get descriptionIsLoading() {
        return this["description-html"] == undefined;
    }

    get isEpisode(): boolean {
        return false;
    }

    get isPost(): boolean {
        return false;
    }

    get pageTitle() {
        return `${this.name} | ${this.podcast?.name}`;
    }

    get publishedString() {
        if (this.podcast?.language) return this.published.toLocaleDateString(this.podcast.language);
        return this.published.toLocaleDateString();
    }

    get strippedDescription(): string | undefined {
        return this.description
            ?.replaceAll(/!\[.*?\]\(.*?\)\s*/g, "") // remove image tags completely
            ?.replaceAll(/\[(.*?)\]\(.*?\)/g, "$1") // replace links with link text only
            ?.replaceAll(/\s+/g, " ") // replace all whitespace sequences with single spaces
            ?.trim();
    }

    extractImageUrls(): string[] {
        if (this.description) {
            return [...this.description.matchAll(/!\[.*?\]\((?<url>.*?)\)/g)].map((m) => m.groups!["url"]!);
        }
        return [];
    }

    [Type]: "podcast-content" | "episode" | "post" = "podcast-content" as const;
}
