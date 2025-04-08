import Model, { attr, belongsTo } from "@ember-data/model";
import type PodcastModel from "./podcast";
import { Type } from "@warp-drive/core-types/symbols";

export default class PodcastContentModel extends Model {
    @attr declare slug: string;
    @attr declare name: string;
    @attr declare description?: string;
    @attr declare "description-html"?: string;
    @attr("date") declare published: Date;
    @attr("date") declare created?: Date;

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
        return `${this.name} | ${this.podcast.name}`;
    }

    get publishedString() {
        if (this.podcast.language) return this.published.toLocaleDateString(this.podcast.language);
        return this.published.toLocaleDateString();
    }

    [Type]: "podcast-content" | "episode" | "post" = "podcast-content" as const;
}
