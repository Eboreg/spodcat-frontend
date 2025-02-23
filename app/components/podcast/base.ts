import templateOnly from "@ember/component/template-only";
import type PodcastModel from "podcast-frontend/models/podcast";

export interface PodcastBaseSignature {
    Args: {
        podcast: PodcastModel;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLElement;
}

export default templateOnly<PodcastBaseSignature>();
