import Component from "@glimmer/component";
import type PodcastModel from "podcast-frontend/models/podcast";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export interface PodcastAsideSignature {
    Args: {
        podcast: PodcastModel;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLElement;
}

export default class PodcastAside extends Component<PodcastAsideSignature> {
    @tracked declare airhornElement: HTMLAudioElement;
    @tracked showFlash: boolean = false;

    @action onFlashAnimationEnd() {
        this.showFlash = false;
    }

    @action onMouseEnterRobert() {
        void this.airhornElement?.play();
        this.showFlash = true;
    }

    @action setAirhornElement(element: HTMLAudioElement) {
        this.airhornElement = element;
    }
}
