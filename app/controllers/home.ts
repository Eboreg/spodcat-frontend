import ENV from "spodcat/config/environment";
import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import type PodcastModel from "spodcat/models/podcast";

export default class HomeController extends Controller<PodcastModel[]> {
    @tracked declare model: PodcastModel[];

    get isSingleton(): boolean {
        return ENV.APP.IS_SINGLETON;
    }

    get singleton(): PodcastModel {
        return this.model[0]!;
    }
}
