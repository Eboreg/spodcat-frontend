import templateOnly from "@ember/component/template-only";
import type PodcastModel from "spodcat/models/podcast";
import type PostModel from "spodcat/models/post";

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
