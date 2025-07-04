import templateOnly from "@ember/component/template-only";
import type PodcastContentModel from "spodcat/models/podcast-content";

export interface PodcastContentDescriptionSignature {
    Args: {
        content: PodcastContentModel;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [];
    };
}

export default templateOnly<PodcastContentDescriptionSignature>();
