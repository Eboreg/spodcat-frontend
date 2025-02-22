import type Store from "@ember-data/store";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import PodcastModel from "podcast-frontend/models/podcast";
import type HeadDataService from "podcast-frontend/services/head-data";

export default class PodcastRoute extends Route<PodcastModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;

    model(params: { podcast_id: string }) {
        return this.store.findRecord<PodcastModel>("podcast", params.podcast_id, {
            include: ["episodes", "categories", "links"],
        });
    }

    afterModel(model: PodcastModel) {
        if (model.favicon && model["favicon-content-type"]) {
            this.headData.favicon = {
                url: model.favicon,
                contentType: model["favicon-content-type"],
            };
        }
    }
}
