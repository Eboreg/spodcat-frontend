import templateOnly from "@ember/component/template-only";
import type PodcastModel from "podcast-frontend/models/podcast";
import type PostModel from "podcast-frontend/models/post";

export interface PodcastPostSignature {
    Args: {
        podcast: PodcastModel;
        post: PostModel;
    };
    Blocks: {
        default: [];
    };
}

export default templateOnly<PodcastPostSignature>();
