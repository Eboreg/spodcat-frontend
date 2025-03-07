import ENV from "podcast-frontend/config/environment";
import type Store from "@ember-data/store";
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import type Transition from "@ember/routing/transition";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type PostModel from "podcast-frontend/models/post";
import type HeadDataService from "podcast-frontend/services/head-data";

export default class PostRoute extends Route<PostModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;
    @service declare fastboot: FastBoot;

    model(params: { post_id: string }) {
        if (this.fastboot.isFastBoot) {
            return this.store.findRecord<PostModel>("post", params.post_id, {
                include: ["podcast.categories", "podcast.links", "podcast.owners", "podcast.contents"],
            });
        }
        return this.store.findRecord<PostModel>("post", params.post_id);
    }

    afterModel(model: PostModel) {
        this.headData.updateFromPost(model);
    }

    @action error(error: any, transition: Transition) {
        if (error.isAdapterError && error.errors && error.errors[0].status == "404") {
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
