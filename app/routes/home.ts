import type Store from "@ember-data/store";
import { service } from "@ember/service";
import PodcastModel from "spodcat/models/podcast";
import PreserveScrollRoute from "spodcat/preserve-scroll-route";
import type HeadDataService from "spodcat/services/head-data";
import ENV from "spodcat/config/environment";

export default class HomeRoute extends PreserveScrollRoute<PodcastModel[]> {
    @service declare headData: HeadDataService;
    @service declare store: Store;

    afterModel(model: PodcastModel[]) {
        if (model.length == 1 && ENV.APP.IS_SINGLETON) this.headData.updateFromPodcast(model[0]!);
    }

    model() {
        return this.store.findAll<PodcastModel>("podcast");
    }
}
