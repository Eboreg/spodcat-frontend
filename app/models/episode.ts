import Model, { attr, belongsTo } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastModel from "./podcast";
import { timeString } from "podcast-frontend/utils";

export default class EpisodeModel extends Model {
    @attr declare name: string;
    @attr declare description?: string;
    @attr declare "description-html"?: string;
    @attr declare episode?: number;
    @attr declare "audio-file": string;
    @attr("date") declare published?: Date;
    @attr("date") declare created: Date;
    @attr declare "duration-seconds": number;
    @attr declare "dbfs-array": number[];
    @attr declare "audio-content-type": string;
    @attr declare "audio-file-length": number;
    @attr declare slug: string;

    @belongsTo<PodcastModel>("podcast", { async: false, inverse: "episodes" })
    declare podcast: PodcastModel;

    get durationString() {
        return timeString(this["duration-seconds"]);
    }

    get publishedString() {
        return this.published?.toLocaleDateString();
    }

    [Type] = "episode" as const;
}
