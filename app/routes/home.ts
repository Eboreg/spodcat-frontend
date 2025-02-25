import type Store from "@ember-data/store";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import PodcastModel from "podcast-frontend/models/podcast";

export default class HomeRoute extends Route<PodcastModel[]> {
    @service declare store: Store;

    model() {
        return this.store.findAll<PodcastModel>("podcast", {
            include: ["contents", "categories", "links"],
        });
    }
}
