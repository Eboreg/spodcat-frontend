import templateOnly from "@ember/component/template-only";
import type PodcastModel from "podcast-frontend/models/podcast";
import type PodcastBase from "./base";
import type PostModel from "podcast-frontend/models/post";

export interface PodcastPostSignature {
    Args: {
        podcast: PodcastModel;
        post: PostModel;
    };
    Element: typeof PodcastBase;
}

export default templateOnly<PodcastPostSignature>();
