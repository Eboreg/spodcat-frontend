import type Store from "@ember-data/store";
import { action } from "@ember/object";
import type RouterService from "@ember/routing/router-service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import PostModel from "spodcat/models/post";
import type HeadDataService from "spodcat/services/head-data";
import { NotFoundError, ping } from "spodcat/utils";
import PreserveScrollRoute from "spodcat/preserve-scroll-route";
import type MessageService from "spodcat/services/message";

export default class BasePodcastPostRoute extends PreserveScrollRoute<PostModel> {
    @service declare fastboot: FastBoot;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;
    @service declare store: Store;
    @service declare message: MessageService;

    afterModel(model?: PostModel) {
        if (model) {
            this.headData.setPost(model);
            if (model.id && !this.fastboot.isFastBoot) ping("posts", model.id);
        }
    }

    @action error(error: any) {
        if (error instanceof NotFoundError) {
            if (!this.fastboot.isFastBoot) {
                const podcastId = this.getPodcastId();

                this.message.addToast({ level: "error", text: error.message, timeout: 10000 });
                if (podcastId) this.router.transitionTo("podcast", podcastId);
                else this.router.transitionTo("home");
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
