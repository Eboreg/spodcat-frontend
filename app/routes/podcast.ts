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
            include: ["contents", "categories", "links"],
        });
    }

    afterModel(model: PodcastModel) {
        this.headData.favicon = model.faviconData;
        this.headData.ogTitle = model.name;
        this.headData.ogDescription = model.description || model.tagline;
        this.headData.ogImage = model.bannerData;
        this.headData.rss = { title: model.name, url: model["rss-url"] };
    }
}
