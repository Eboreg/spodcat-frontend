import EpisodeRoute from "../episode";

export default class PodcastEpisodeRoute extends EpisodeRoute {
    getPodcastId() {
        return (this.paramsFor("podcast") as { podcast_id: string }).podcast_id;
    }
}
