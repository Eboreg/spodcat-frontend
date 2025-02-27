import type Store from "@ember-data/store";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import PodcastModel from "podcast-frontend/models/podcast";
import type HeadDataService from "podcast-frontend/services/head-data";

export default class PodcastIndexRoute extends Route<PodcastModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;

    async model() {
        const params = this.paramsFor("podcast") as { podcast_id: string };

        return await this.store.findRecord<PodcastModel>("podcast", params.podcast_id, {
            include: ["contents", "categories", "links"],
            reload: true,
        });
    }

    afterModel(model: PodcastModel) {
        this.headData.favicon = model.faviconData;
        this.headData.ogTitle = model.name;
        this.headData.ogDescription = model.tagline;
        this.headData.ogImage = model.bannerData;
        this.headData.rss = model.rssData;
    }
}
