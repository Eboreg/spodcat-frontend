import Model, { attr, belongsTo } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";
import type PodcastContentModel from "./podcast-content";

export default class VideoModel extends Model {
    @attr declare "video-type": "youtube";
    @attr declare "video-id": string;
    @attr declare title?: string;

    @belongsTo<PodcastContentModel>("podcast-content", {
        async: false,
        inverse: "videos",
        as: "video",
        polymorphic: true,
    })
    declare "podcast-content": PodcastContentModel;

    get externalLink() {
        return `https://youtu.be/${this["video-id"]}`;
    }

    get iframe() {
        return `<iframe
            class="video"
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/${this["video-id"]}?privacy_mode=1"
            frameborder="0"
            allow="encrypted-media; gyroscope; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
        ></iframe>`;
    }

    [Type] = "video" as const;
}
