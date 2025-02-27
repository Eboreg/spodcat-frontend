import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "podcast-frontend/models/episode";

export default class PodcastEpisodeController extends Controller<EpisodeModel> {
    queryParams = ["start"];
    @tracked declare model: EpisodeModel;
    @tracked start: string | null = null;

    get pageTitle() {
        return `${this.model.name} | ${this.model.podcast.name}`;
    }
}
