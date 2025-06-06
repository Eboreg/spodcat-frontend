import ENV from "podcast-frontend/config/environment";
import { Type } from "@warp-drive/core-types/symbols";
import PodcastContentModel from "./podcast-content";
import { makeAbsoluteUrl } from "podcast-frontend/utils";

export default class PostModel extends PodcastContentModel {
    get frontendUrl() {
        return makeAbsoluteUrl(`${this.podcast.id}/post/${this.slug}`);
    }

    get isPost() {
        return true;
    }

    get route() {
        if (ENV.APP.IS_SINGLETON) return "post";
        return "podcast.post";
    }

    get routeModels() {
        if (ENV.APP.IS_SINGLETON) return [this.slug];
        return [this.podcast, this.slug];
    }

    [Type] = "post" as const;
}
