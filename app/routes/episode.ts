import type Store from "@ember-data/store";
import { action } from "@ember/object";
import type RouterService from "@ember/routing/router-service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import EpisodeModel from "podcast-frontend/models/episode";
import type HeadDataService from "podcast-frontend/services/head-data";
import type AudioService from "podcast-frontend/services/audio";
import { NotFoundError, ping } from "podcast-frontend/utils";
import PreserveScrollRoute from "podcast-frontend/preserve-scroll-route";
import type MessageService from "podcast-frontend/services/message";
import ENV from "podcast-frontend/config/environment";

export default class EpisodeRoute extends PreserveScrollRoute<EpisodeModel> {
    @service declare audio: AudioService;
    @service declare fastboot: FastBoot;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;
    @service declare store: Store;
    @service declare message: MessageService;

    afterModel(model?: EpisodeModel) {
        if (model) {
            this.headData.updateFromEpisode(model);
            if (!this.audio.episode) this.audio.setEpisode(model);
            if (!this.fastboot.isFastBoot && model.id) {
                ping("episodes", model.id);
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

    async model(params: { episode_id: string }) {
        const podcastId = this.getPodcastId();
        const result = await this.store.query<EpisodeModel>("episode", {
            include: ["songs.artists", "comments"],
            filter: podcastId ? { episode: params.episode_id, podcast: podcastId } : { episode: params.episode_id },
        });

        if (result.length == 0) throw new NotFoundError("Kunde inte hitta avsnittet.");

        return result[0]!;
    }

    redirect(model: EpisodeModel) {
        if (!ENV.APP.IS_SINGLETON && !this.getPodcastId()) {
            this.router.replaceWith("podcast.episode", model.podcast, model.slug);
        }
    }
}
