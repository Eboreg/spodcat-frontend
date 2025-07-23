import PostModel from "spodcat/models/post";
import { NotFoundError } from "spodcat/utils";
import BasePodcastPostRoute from "./base";
import { service } from "@ember/service";
import type { Registry } from "@ember/service";

export default class PodcastPostIndexRoute extends BasePodcastPostRoute {
    @service declare intl: Registry["intl"];

    async model(params: { post_slug: string }) {
        const result = await this.store.query<PostModel>("post", {
            include: ["comments", "videos"],
            filter: { post: params.post_slug, podcast: this.getPodcastId() },
        });

        if (result.length == 0) throw new NotFoundError(this.intl.t("post-not-found"));
        return result[0]!;
    }
}
