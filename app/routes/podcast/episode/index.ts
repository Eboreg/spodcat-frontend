import EpisodeModel from "podcast-frontend/models/episode";
import { NotFoundError } from "podcast-frontend/utils";
import BasePodcastEpisodeRoute from "./base";
import type PodcastEpisodeIndexController from "podcast-frontend/controllers/podcast/episode/index";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";

export default class PodcastEpisodeIndexRoute extends BasePodcastEpisodeRoute {
    @service declare intl: Registry["intl"];

    async model(params: { episode_slug: string }) {
        const result = await this.store.query<EpisodeModel>("episode", {
            include: ["songs.artists", "comments"],
            filter: { episode: params.episode_slug, podcast: this.getPodcastId() },
        });

        if (result.length == 0) throw new NotFoundError(this.intl.t("episode-not-found"));
        return result[0]!;
    }

    resetController(controller: PodcastEpisodeIndexController, isExiting: boolean) {
        if (isExiting) {
            controller.start = null;
        }
    }

    setupController(controller: PodcastEpisodeIndexController, model: EpisodeModel) {
        super.setupController(controller, model);

        const start = controller.startAsFloat;

        if (start && !isNaN(start)) this.audio.seekToTime(start);
    }
}
