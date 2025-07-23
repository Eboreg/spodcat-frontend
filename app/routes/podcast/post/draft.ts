import type PostModel from "spodcat/models/post";
import BasePodcastPostRoute from "./base";

export default class PodcastPostDraftRoute extends BasePodcastPostRoute {
    model(params: { post_id: string }) {
        return this.store.findRecord<PostModel>("post", params.post_id, { include: ["comments", "videos"] });
    }
}
