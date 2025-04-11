import Model, { attr, belongsTo } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastContentModel from "./podcast-content";

export default class CommentModel extends Model {
    @attr declare name: string;
    @attr declare text: string;
    @attr declare "text-html": string;
    @attr("date") declare created: Date;
    @attr declare challenge?: string;
    @attr declare "challenge-answer"?: string;
    @attr declare "is-approved": boolean;

    @belongsTo<PodcastContentModel>("podcast-content", {
        async: false,
        inverse: "comments",
        as: "comment",
        polymorphic: true,
    })
    declare "podcast-content": PodcastContentModel;

    get createdString() {
        return this.created.toLocaleString(undefined, { timeStyle: "short", dateStyle: "medium" });
    }

    [Type] = "comment" as const;
}
