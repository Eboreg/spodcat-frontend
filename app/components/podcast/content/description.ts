import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type PodcastContentModel from "spodcat/models/podcast-content";

export interface PodcastContentDescriptionSignature {
    Args: {
        content: PodcastContentModel;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [];
    };
}

export default class PodcastContentDescription extends Component<PodcastContentDescriptionSignature> {
    @tracked videoConsent: boolean = false;

    @action onVideoConsentClick() {
        this.videoConsent = true;
        console.log("onVideoConsentClick", this.videoConsent);
    }
}
