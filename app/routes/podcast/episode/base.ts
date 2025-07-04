import PreserveScrollRoute from "spodcat/preserve-scroll-route";
import EpisodeModel from "spodcat/models/episode";
import { service } from "@ember/service";
import type HeadDataService from "spodcat/services/head-data";
import type AudioService from "spodcat/services/audio";
import { NotFoundError, ping } from "spodcat/utils";
import { action } from "@ember/object";
import type MessageService from "spodcat/services/message";
import type RouterService from "@ember/routing/router-service";
import type Store from "@ember-data/store";

export default class BasePodcastEpisodeRoute extends PreserveScrollRoute<EpisodeModel> {
    @service declare audio: AudioService;
    @service declare headData: HeadDataService;
    @service declare message: MessageService;
    @service declare router: RouterService;
    @service declare store: Store;

    afterModel(model?: EpisodeModel) {
        if (model) {
            this.headData.updateFromEpisode(model);
            if (!this.audio.episode) this.audio.setEpisode(model);
            if (!this.fastboot.isFastBoot && model.id) ping("episodes", model.id);
        }
    }

    @action error(error: any) {
        if (error instanceof NotFoundError) {
            if (!this.fastboot.isFastBoot) {
                this.message.addToast({ level: "error", text: error.message, timeout: 10000 });
                this.router.transitionTo("podcast", this.getPodcastId());
            }

            return false;
        }
        return true;
    }

    getPodcastId(): string {
        return (this.paramsFor("podcast") as { podcast_id: string }).podcast_id;
    }

    getScrollY(): number {
        return 0;
    }
}
