import type Store from "@ember-data/store";
import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import type Transition from "@ember/routing/transition";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";
import type HeadDataService from "podcast-frontend/services/head-data";

export default class PodcastEpisodeRoute extends Route<EpisodeModel> {
    @service declare store: Store;
    @service declare headData: HeadDataService;
    @service declare audio: AudioService;
    @service declare router: RouterService;
    @service declare fastboot: FastBoot;

    model(params: { episode_id: string }) {
        if (this.fastboot.isFastBoot) {
            return this.store.findRecord<EpisodeModel>("episode", params.episode_id, {
                include: ["podcast.categories", "podcast.links", "podcast.owners", "podcast.contents", "songs.artists"],
            });
        }
        return this.store.findRecord<EpisodeModel>("episode", params.episode_id, { include: ["songs.artists"] });
    }

    afterModel(model: EpisodeModel) {
        this.headData.updateFromEpisode(model);
        if (model["dbfs-array"] && !this.audio.episode) this.audio.setEpisode(model);
    }

    @action error(error: any, transition: Transition) {
        if (error.isAdapterError && error.errors && error.errors[0].status == "404") {
            // TODO: For some fucking reason, this refuses to work, at least
            // when running ember serve with fastboot. Says store is
            // destroyed. Works in production though:
            if (transition.to?.parent?.params?.["podcast_id"]) {
                this.router.replaceWith("podcast", transition.to.parent.params["podcast_id"]);
                return false;
            }
        }
        return true;
    }
}
