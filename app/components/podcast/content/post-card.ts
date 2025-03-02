import templateOnly from "@ember/component/template-only";
import type PostModel from "podcast-frontend/models/post";

export interface PodcastContentPostCardSignature {
    Args: {
        post: PostModel;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLElement;
}

export default templateOnly<PodcastContentPostCardSignature>();
