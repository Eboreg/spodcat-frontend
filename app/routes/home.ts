import type Store from "@ember-data/store";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import PodcastModel from "podcast-frontend/models/podcast";
import type HeadDataService from "podcast-frontend/services/head-data";

export default class HomeRoute extends Route<PodcastModel[]> {
    @service declare store: Store;
    @service declare headData: HeadDataService;

    model() {
        return this.store.findAll<PodcastModel>("podcast", {
            include: ["contents", "categories", "links"],
        });
    }

    afterModel(model: PodcastModel[]) {
        if (model.length == 1) this.headData.updateFromPodcast(model[0]!);
    }
}
