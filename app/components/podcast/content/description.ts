import templateOnly from "@ember/component/template-only";
import type PodcastContentModel from "podcast-frontend/models/podcast-content";

export interface PodcastContentDescriptionSignature {
    Args: {
        model: PodcastContentModel;
    };
    Element: null;
}

export default templateOnly<PodcastContentDescriptionSignature>();
