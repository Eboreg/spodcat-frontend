import Model, { attr, belongsTo } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastModel from "./podcast";
import { faFacebook, faDiscord, faPatreon, type IconDefinition } from "@fortawesome/free-brands-svg-icons";

export default class PodcastLinkModel extends Model {
    @attr declare "link-type": "facebook" | "discord" | "patreon";
    @attr declare url: string;
    @attr declare label: string;

    @belongsTo<PodcastModel>("podcast", { async: false, inverse: "links" })
    declare podcast: PodcastModel;

    get icon(): IconDefinition {
        switch (this["link-type"]) {
            case "facebook":
                return faFacebook;
            case "discord":
                return faDiscord;
            case "patreon":
                return faPatreon;
        }
    }

    [Type] = "podcast-link" as const;
}
