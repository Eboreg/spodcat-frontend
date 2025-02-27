import templateOnly from "@ember/component/template-only";
import type PodcastModel from "podcast-frontend/models/podcast";

export interface PodcastBaseSignature {
    Args: {
        podcast: PodcastModel;
    };
    Blocks: {
        before: [];
        default: [];
    };
    Element: HTMLElement;
}

export default templateOnly<PodcastBaseSignature>();
