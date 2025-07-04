import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "spodcat/models/episode";

export default class PodcastEpisodeIndexController extends Controller<EpisodeModel> {
    queryParams = ["start"];
    @tracked declare model: EpisodeModel;
    @tracked start: string | null = null; // seconds

    get startAsFloat(): number | undefined {
        if (this.start) {
            const start = parseFloat(this.start);
            if (!isNaN(start)) return start;
        }
        return;
    }
}
