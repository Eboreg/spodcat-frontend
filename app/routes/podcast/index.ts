import type Store from "@ember-data/store";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import PodcastModel from "podcast-frontend/models/podcast";
import type HeadDataService from "podcast-frontend/services/head-data";
import { ping } from "podcast-frontend/utils";
import type FastBoot from "ember-cli-fastboot/services/fastboot";

export default class PodcastIndexRoute extends Route<PodcastModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;
    @service declare fastboot: FastBoot;

    async model() {
        const params = this.paramsFor("podcast") as { podcast_id: string };

        return this.store.findRecord<PodcastModel>("podcast", params.podcast_id, {
            include: ["contents", "categories", "links"],
            backgroundReload: false,
        });
    }

    afterModel(model?: PodcastModel) {
        if (model) {
            this.headData.updateFromPodcast(model);
            if (model.id && !this.fastboot.isFastBoot) {
                ping("podcasts", model.id);
            }
        }
    }
}
