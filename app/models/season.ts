import Model, { attr, belongsTo, hasMany, type AsyncHasMany } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastModel from "./podcast";
import type EpisodeModel from "./episode";
import type { Theme } from "global";

export default class SeasonModel extends Model {
    @attr declare number: number;
    @attr declare name?: string;
    @attr declare image?: string;
    @attr declare "image-height"?: number;
    @attr declare "image-mimetype"?: string;
    @attr declare "image-thumbnail-height"?: number;
    @attr declare "image-thumbnail-mimetype"?: string;
    @attr declare "image-thumbnail-width"?: number;
    @attr declare "image-thumbnail"?: string;
    @attr declare "image-width"?: number;

    @belongsTo<PodcastModel>("podcast", { async: false, inverse: "seasons" })
    declare podcast: PodcastModel;
    @hasMany<EpisodeModel>("episode", { async: true, inverse: "season" })
    declare episodes: AsyncHasMany<EpisodeModel>;

    get theme(): Theme {
        const alternatives: Theme[] = ["primary", "secondary", "tertiary", "boring"];

        return alternatives[this.number % 3]!;
    }

    [Type] = "season" as const;
}
