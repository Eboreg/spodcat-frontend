import type Store from "@ember-data/store";
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import type Transition from "@ember/routing/transition";
import { service } from "@ember/service";
import type PostModel from "podcast-frontend/models/post";
import type HeadDataService from "podcast-frontend/services/head-data";

export default class PodcastPostRoute extends Route<PostModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;

    model(params: { post_id: string }) {
        return this.store.findRecord<PostModel>("post", params.post_id, {
            include: ["podcast.categories", "podcast.links", "podcast.owners"],
        });
    }

    afterModel(model: PostModel) {
        this.headData.updateFromPost(model);
    }

    @action error(error: any, transition: Transition) {
        if (error.isAdapterError && error.errors && error.errors[0].status == "404") {
            if (transition.to?.parent?.params?.["podcast_id"]) {
                this.router.transitionTo("podcast.index", transition.to.parent.params["podcast_id"]);
                return false;
            }
        }
        return true;
    }
}
