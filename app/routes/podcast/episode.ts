import type Store from "@ember-data/store";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import EpisodeModel from "podcast-frontend/models/episode";
import type PodcastModel from "podcast-frontend/models/podcast";

export default class PodcastEpisodeRoute extends Route<EpisodeModel> {
    @service declare store: Store;

    model(params: { episode_id: string }) {
        const podcast = this.modelFor("podcast") as PodcastModel;

        return podcast.contents.filter((e) => e instanceof EpisodeModel).find((e) => e.slug == params.episode_id);
    }
}
