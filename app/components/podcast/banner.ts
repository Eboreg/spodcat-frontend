import type PodcastModel from "spodcat/models/podcast";
import templateOnly from "@ember/component/template-only";

export interface PodcastBannerSignature {
    Args: {
        "is-menu-open"?: boolean;
        "on-menu-click"?: () => any;
        podcast: PodcastModel;
    };
    Element: HTMLElement;
}

export default templateOnly<PodcastBannerSignature>();
