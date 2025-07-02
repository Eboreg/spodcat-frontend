import Model, { attr, belongsTo } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastModel from "./podcast";

export default class ChallengeModel extends Model {
    @attr declare "challenge-string": string;

    @belongsTo<PodcastModel>("podcast", { async: true, inverse: null })
    declare podcast: PodcastModel;

    [Type] = "challenge" as const;
}
