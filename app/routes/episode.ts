import ENV from "podcast-frontend/config/environment";
import type Store from "@ember-data/store";
import { action } from "@ember/object";
import type RouterService from "@ember/routing/router-service";
import type Transition from "@ember/routing/transition";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import EpisodeModel from "podcast-frontend/models/episode";
import type HeadDataService from "podcast-frontend/services/head-data";
import type AudioService from "podcast-frontend/services/audio";
import { ping } from "podcast-frontend/utils";
import PreserveScrollRoute from "podcast-frontend/preserve-scroll-route";

class EpisodeNotFoundError extends Error {}

export default class EpisodeRoute extends PreserveScrollRoute<EpisodeModel> {
    @service declare audio: AudioService;
    @service declare fastboot: FastBoot;
    @service declare headData: HeadDataService;
    @service declare router: RouterService;
    @service declare store: Store;

    afterModel(model?: EpisodeModel) {
        if (model) {
            this.headData.updateFromEpisode(model);
            if (!this.audio.episode) this.audio.setEpisode(model);
            if (!this.fastboot.isFastBoot && model.id) {
                ping("episodes", model.id);
            }
        }
    }

    @action error(error: any, transition: Transition) {
        if (
            (error.isAdapterError && error.errors && error.errors[0].status == "404") ||
            error instanceof EpisodeNotFoundError
        ) {
            // TODO: For some fucking reason, this refuses to work, at least
            // when running ember serve with fastboot. Says store is
            // destroyed. Works in production though:
            if (ENV.APP.IS_SINGLETON && transition.to?.parent?.params?.["podcast_id"]) {
                this.router.replaceWith("podcast", transition.to.parent.params["podcast_id"]);
            } else {
                this.router.replaceWith("home");
            }
            return false;
        }
        return true;
    }

    getScrollY(): number {
        return 0;
    }

    async model(params: { episode_id: string }) {
        const { podcast_id } = this.paramsFor("podcast") as { podcast_id: string };
        const result = await this.store.query<EpisodeModel>("episode", {
            include: this.fastboot.isFastBoot
                ? ["podcast.categories", "podcast.links", "podcast.contents", "songs.artists", "comments"]
                : ["songs.artists", "comments"],
            filter: {
                podcast: podcast_id,
                slug: params.episode_id,
            },
        });

        if (result.length == 0) throw new EpisodeNotFoundError();

        return result[0]!;
    }
}
