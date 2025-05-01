import type Store from "@ember-data/store";
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import PodcastModel from "podcast-frontend/models/podcast";
import type MessageService from "podcast-frontend/services/message";

export default class PodcastRoute extends Route<PodcastModel> {
    @service declare router: RouterService;
    @service declare store: Store;
    @service declare message: MessageService;
    @service declare fastboot: FastBoot;

    @action error(error: any) {
        const statusCode = Array.isArray(error.errors) ? parseInt(error.errors[0]?.status) : NaN;
        const podcastId = (this.paramsFor("podcast") as { podcast_id: string }).podcast_id;

        if (statusCode == 404) {
            if (!this.fastboot.isFastBoot) {
                this.message.addToast({
                    level: "error",
                    text: `Kunde inte hitta podden "${podcastId}".`,
                    timeout: 10000,
                });
                this.router.transitionTo("home");
            }

            return false;
        }

        return true;
    }

    model(params: { podcast_id: string }) {
        return this.store.findRecord<PodcastModel>("podcast", params.podcast_id, {
            include: ["contents", "categories", "links"],
            backgroundReload: false,
        });
    }
}
