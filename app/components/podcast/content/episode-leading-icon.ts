import Component from "@glimmer/component";
import type EpisodeModel from "podcast-frontend/models/episode";

export interface PodcastContentEpisodeLeadingIconSignature {
    Args: {
        episode: EpisodeModel;
        "fallback-to-cover"?: boolean;
    };
}

export default class PodcastContentEpisodeLeadingIcon extends Component<PodcastContentEpisodeLeadingIconSignature> {
    get classes() {
        return `podcast-content-leading-icon theme-${this.args.episode.seasonTheme}`;
    }

    get coverThumbnail() {
        if (this.args["fallback-to-cover"]) return this.args.episode.podcast["cover-thumbnail"];
        return;
    }

    get numberClass() {
        if (this.args.episode.numberString != undefined && this.args.episode.numberString.length > 3) return "small";
        return "";
    }
}
