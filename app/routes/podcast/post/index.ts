import PostModel from "podcast-frontend/models/post";
import { NotFoundError } from "podcast-frontend/utils";
import BasePodcastPostRoute from "./base";

export default class PodcastPostIndexRoute extends BasePodcastPostRoute {
    async model(params: { post_slug: string }) {
        const result = await this.store.query<PostModel>("post", {
            include: ["comments"],
            filter: { post: params.post_slug, podcast: this.getPodcastId() },
        });

        if (result.length == 0) throw new NotFoundError("Kunde inte hitta inlägget.");
        return result[0]!;
    }
}
