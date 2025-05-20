import EpisodeModel from "podcast-frontend/models/episode";
import { NotFoundError } from "podcast-frontend/utils";
import BasePodcastEpisodeRoute from "./base";

export default class PodcastEpisodeIndexRoute extends BasePodcastEpisodeRoute {
    async model(params: { episode_slug: string }) {
        const result = await this.store.query<EpisodeModel>("episode", {
            include: ["songs.artists", "comments"],
            filter: { episode: params.episode_slug, podcast: this.getPodcastId() },
        });

        if (result.length == 0) throw new NotFoundError("Kunde inte hitta avsnittet.");
        return result[0]!;
    }
}
