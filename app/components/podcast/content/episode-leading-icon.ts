import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";

export interface PodcastContentEpisodeLeadingIconSignature {
    Args: {
        episode: EpisodeModel;
    };
}

export default class PodcastContentEpisodeLeadingIcon extends Component<PodcastContentEpisodeLeadingIconSignature> {
    get classes() {
        return `podcast-content-leading-icon theme-${this.args.episode.seasonTheme}`;
    }

    get numberClass() {
        if (this.args.episode.numberString != undefined && this.args.episode.numberString.length > 3) return "small";
        return "";
    }
}
