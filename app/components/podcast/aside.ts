import templateOnly from "@ember/component/template-only";
import type PodcastModel from "podcast-frontend/models/podcast";

export interface PodcastAsideSignature {
    Args: {
        podcast: PodcastModel;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLElement;
}

export default templateOnly<PodcastAsideSignature>();
