import Model, { attr, belongsTo } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastModel from "./podcast";
import {
    faFacebook,
    faDiscord,
    faPatreon,
    type IconDefinition,
    faApple,
    faAndroid,
    faSpotify,
    faItunes,
} from "@fortawesome/free-brands-svg-icons";

export default class PodcastLinkModel extends Model {
    @attr declare "custom-icon"?: string;
    @attr declare icon?: "facebook" | "discord" | "patreon" | "apple" | "android" | "spotify" | "itunes";
    @attr declare label: string;
    @attr declare theme: "primary" | "secondary" | "tertiary";
    @attr declare url: string;

    @belongsTo<PodcastModel>("podcast", { async: false, inverse: "links" })
    declare podcast: PodcastModel;

    get faIcon(): IconDefinition | undefined {
        switch (this["icon"]) {
            case "facebook":
                return faFacebook;
            case "discord":
                return faDiscord;
            case "patreon":
                return faPatreon;
            case "apple":
                return faApple;
            case "android":
                return faAndroid;
            case "spotify":
                return faSpotify;
            case "itunes":
                return faItunes;
        }
        return;
    }

    [Type] = "podcast-link" as const;
}
