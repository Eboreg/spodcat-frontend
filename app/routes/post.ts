import ENV from "podcast-frontend/config/environment";
import type Store from "@ember-data/store";
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import type Transition from "@ember/routing/transition";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import PostModel from "podcast-frontend/models/post";
import type HeadDataService from "podcast-frontend/services/head-data";

class PostNotFoundError extends Error {}

export default class PostRoute extends Route<PostModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;
    @service declare fastboot: FastBoot;

    async model(params: { post_id: string }) {
        const { podcast_id } = this.paramsFor("podcast") as { podcast_id: string };
        const result = await this.store.query<PostModel>("post", {
            include: this.fastboot.isFastBoot
                ? ["podcast.categories", "podcast.links", "podcast.owners", "podcast.contents"]
                : [],
            filter: {
                podcast: podcast_id,
                slug: params.post_id,
            },
        });

        if (result.length == 0) throw new PostNotFoundError();

        return result[0]!;
    }

    afterModel(model: PostModel) {
        this.headData.updateFromPost(model);
    }

    @action error(error: any, transition: Transition) {
        if (
            (error.isAdapterError && error.errors && error.errors[0].status == "404") ||
            error instanceof PostNotFoundError
        ) {
            if (ENV.APP.IS_SINGLETON && transition.to?.parent?.params?.["podcast_id"]) {
                this.router.replaceWith("podcast", transition.to.parent.params["podcast_id"]);
            } else {
                this.router.replaceWith("home");
            }
            return false;
        }
        return true;
    }
}
