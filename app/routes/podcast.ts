import ENV from "spodcat/config/environment";
import type Store from "@ember-data/store";
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type ApplicationController from "spodcat/controllers/application";
import PodcastModel from "spodcat/models/podcast";
import type MessageService from "spodcat/services/message";

export default class PodcastRoute extends Route<PodcastModel> {
    @service declare router: RouterService;
    @service declare store: Store;
    @service declare message: MessageService;
    @service declare fastboot: FastBoot;
    @service declare intl: Registry["intl"];

    @action error(error: any) {
        const statusCode = Array.isArray(error.errors) ? parseInt(error.errors[0]?.status) : NaN;
        const podcastId = (this.paramsFor("podcast") as { podcast_id: string }).podcast_id;

        if (statusCode == 404) {
            if (!this.fastboot.isFastBoot) {
                this.message.addToast({
                    level: "error",
                    text: this.intl.t("podcast-x-not-found", { x: podcastId }),
                    timeout: 10000,
                });
                this.router.transitionTo("home");
            }

            return false;
        }

        return true;
    }

    afterModel(model?: PodcastModel) {
        (this.controllerFor("application") as ApplicationController)?.setLocale(model?.language || ENV.APP.LOCALE);
    }

    model(params: { podcast_id: string }): Promise<PodcastModel> {
        return this.store.findRecord<PodcastModel>("podcast", params.podcast_id, {
            include: ["contents", "links", "seasons"],
        });
    }
}
