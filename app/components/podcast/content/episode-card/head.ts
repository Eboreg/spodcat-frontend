import templateOnly from "@ember/component/template-only";
import type EpisodeModel from "spodcat/models/episode";

export interface PodcastContentEpisodeCardHeadSignature {
    Args: {
        episode: EpisodeModel;
    };
}

export default templateOnly<PodcastContentEpisodeCardHeadSignature>();
