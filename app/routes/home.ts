import type Store from "@ember-data/store";
import { service } from "@ember/service";
import PodcastModel from "spodcat/models/podcast";
import PreserveScrollRoute from "spodcat/preserve-scroll-route";
import type HeadDataService from "spodcat/services/head-data";
import ENV from "spodcat/config/environment";
import type { Registry } from "@ember/service";
import type ApplicationController from "spodcat/controllers/application";

export default class HomeRoute extends PreserveScrollRoute<PodcastModel[]> {
    @service declare headData: HeadDataService;
    @service declare store: Store;
    @service declare intl: Registry["intl"];

    afterModel(model: PodcastModel[]) {
        const appController = this.controllerFor("application") as ApplicationController;

        if (model[0] && ENV.APP.IS_SINGLETON) {
            this.headData.setPodcast(model[0]);
            appController?.setLocale(model[0].language || ENV.APP.LOCALE);
        } else {
            this.headData.reset();
            appController?.setLocale(ENV.APP.LOCALE);
        }
    }

    model() {
        return this.store.findAll<PodcastModel>("podcast");
    }
}
