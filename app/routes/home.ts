import type Store from "@ember-data/store";
import { service } from "@ember/service";
import PodcastModel from "podcast-frontend/models/podcast";
import PreserveScrollRoute from "podcast-frontend/preserve-scroll-route";
import type HeadDataService from "podcast-frontend/services/head-data";
import ENV from "podcast-frontend/config/environment";

export default class HomeRoute extends PreserveScrollRoute<PodcastModel[]> {
    @service declare headData: HeadDataService;
    @service declare store: Store;

    afterModel(model: PodcastModel[]) {
        if (model.length == 1 && ENV.APP.IS_SINGLETON) this.headData.updateFromPodcast(model[0]!);
    }

    async model() {
        return this.store.findAll<PodcastModel>("podcast", {
            include: ["contents", "categories", "links"],
        });
    }
}
