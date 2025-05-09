import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";

export interface PodcastContentEpisodeLeadingIconSignature {
    Args: {
        episode: EpisodeModel;
    };
}

export default class PodcastContentEpisodeLeadingIcon extends Component<PodcastContentEpisodeLeadingIconSignature> {
    get numberClass() {
        if (this.args.episode.numberString != undefined && this.args.episode.numberString.length > 3) return "small";
        return "";
    }
}
