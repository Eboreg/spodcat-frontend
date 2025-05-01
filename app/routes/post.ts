import type Store from "@ember-data/store";
import { action } from "@ember/object";
import type RouterService from "@ember/routing/router-service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import PostModel from "podcast-frontend/models/post";
import type HeadDataService from "podcast-frontend/services/head-data";
import { NotFoundError, ping } from "podcast-frontend/utils";
import PreserveScrollRoute from "podcast-frontend/preserve-scroll-route";
import type MessageService from "podcast-frontend/services/message";
import ENV from "podcast-frontend/config/environment";

export default class PostRoute extends PreserveScrollRoute<PostModel> {
    @service declare fastboot: FastBoot;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;
    @service declare store: Store;
    @service declare message: MessageService;

    afterModel(model?: PostModel) {
        if (model) {
            this.headData.updateFromPost(model);
            if (model.id && !this.fastboot.isFastBoot) {
                ping("posts", model.id);
            }
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

    getPodcastId(): string | undefined {
        return;
    }

    getScrollY(): number {
        return 0;
    }

    async model(params: { post_id: string }) {
        const podcastId = this.getPodcastId();
        const result = await this.store.query<PostModel>("post", {
            include: ["comments"],
            filter: podcastId ? { post: params.post_id, podcast: podcastId } : { post: params.post_id },
        });

        if (result.length == 0) throw new NotFoundError("Kunde inte hitta inlägget.");

        return result[0]!;
    }

    redirect(model: PostModel) {
        if (!ENV.APP.IS_SINGLETON && !this.getPodcastId()) {
            this.router.replaceWith("podcast.post", model.podcast, model.slug);
        }
    }
}
