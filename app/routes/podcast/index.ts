import type Store from "@ember-data/store";
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import { service } from "@ember/service";
import PodcastModel from "podcast-frontend/models/podcast";
import type HeadDataService from "podcast-frontend/services/head-data";

export default class PodcastIndexRoute extends Route<PodcastModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;

    model() {
        const params = this.paramsFor("podcast") as { podcast_id: string };

        return this.store.findRecord<PodcastModel>("podcast", params.podcast_id, {
            include: ["contents", "categories", "links"],
            reload: true,
        });
    }

    afterModel(model: PodcastModel) {
        this.headData.updateFromPodcast(model);
    }

    @action error(error: any) {
        if (error.isAdapterError && error.errors && error.errors[0].status == "404") {
            this.router.replaceWith("home");
            return false;
        }
        return true;
    }
}
