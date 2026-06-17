import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import type PodcastModel from "spodcat/models/podcast";

export default class PodcastController extends Controller<PodcastModel> {
    @tracked declare model: PodcastModel;
    @tracked isMenuOpen: boolean = false;

    @action onMenuClick() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
