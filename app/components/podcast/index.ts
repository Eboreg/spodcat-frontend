import templateOnly from "@ember/component/template-only";
import type PodcastModel from "podcast-frontend/models/podcast";
import type PodcastBase from "podcast-frontend/components/podcast/base";

export interface PodcastIndexSignature {
    Args: {
        podcast: PodcastModel;
    };
    Element: typeof PodcastBase;
}

export default templateOnly<PodcastIndexSignature>();
