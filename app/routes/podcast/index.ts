import { service } from "@ember/service";
import PodcastModel from "spodcat/models/podcast";
import type HeadDataService from "spodcat/services/head-data";
import { ping } from "spodcat/utils";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import PreserveScrollRoute from "spodcat/preserve-scroll-route";

export default class PodcastIndexRoute extends PreserveScrollRoute<PodcastModel> {
    @service declare fastboot: FastBoot;
    @service declare headData: HeadDataService;

    afterModel(model?: PodcastModel) {
        if (model) {
            this.headData.setPodcast(model);
            if (model.id && !this.fastboot.isFastBoot) {
                ping("podcasts", model.id);
            }
        }
    }
}
