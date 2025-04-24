import PostRoute from "../post";

export default class PodcastPostRoute extends PostRoute {
    getPodcastId(): string | undefined {
        return (this.paramsFor("podcast") as { podcast_id: string }).podcast_id;
    }
}
