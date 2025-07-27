import type PodcastModel from "spodcat/models/podcast";
import templateOnly from "@ember/component/template-only";

export interface PodcastBannerSignature {
    Args: {
        podcast: PodcastModel;
    };
    Element: HTMLElement;
}

export default templateOnly<PodcastBannerSignature>();
