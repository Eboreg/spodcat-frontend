import type EpisodeModel from "spodcat/models/episode";
import BasePodcastEpisodeRoute from "./base";

export default class PodcastEpisodeDraftRoute extends BasePodcastEpisodeRoute {
    model(params: { episode_id: string }) {
        return this.store.findRecord<EpisodeModel>("episode", params.episode_id, {
            include: ["songs.artists", "comments", "videos", "season2"],
        });
    }
}
