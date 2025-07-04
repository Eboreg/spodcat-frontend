import templateOnly from "@ember/component/template-only";
import type PodcastModel from "spodcat/models/podcast";

export interface PodcastIndexSignature {
    Args: {
        podcast: PodcastModel;
    };
}

export default templateOnly<PodcastIndexSignature>();
