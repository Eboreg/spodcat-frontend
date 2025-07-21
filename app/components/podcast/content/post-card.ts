import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type PostModel from "spodcat/models/post";

export interface PodcastContentPostCardSignature {
    Args: {
        post: PostModel;
        expand: boolean;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLElement;
}

export default class PodcastContentPostCard extends Component<PodcastContentPostCardSignature> {
    @tracked showShareModal: boolean = false;

    @action closeShareModal() {
        this.showShareModal = false;
    }

    @action openShareModal() {
        this.showShareModal = true;
    }
}
