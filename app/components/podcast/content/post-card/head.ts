import templateOnly from "@ember/component/template-only";
import type PostModel from "spodcat/models/post";

export interface PodcastContentPostCardHeadSignature {
    Args: {
        post: PostModel;
    };
}

export default templateOnly<PodcastContentPostCardHeadSignature>();
