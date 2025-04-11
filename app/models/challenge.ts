import Model, { attr } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";

export default class ChallengeModel extends Model {
    @attr declare "challenge-string": string;

    [Type] = "challenge" as const;
}
