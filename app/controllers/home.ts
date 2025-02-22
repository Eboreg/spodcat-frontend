import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import type PodcastModel from "podcast-frontend/models/podcast";

export default class HomeController extends Controller<PodcastModel[]> {
    @tracked declare model: PodcastModel[];

    get isSingleton(): boolean {
        return this.model.length == 1;
    }

    get singleton(): PodcastModel {
        return this.model[0]!;
    }
}
