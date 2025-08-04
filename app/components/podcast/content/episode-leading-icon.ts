import Component from "@glimmer/component";
import type EpisodeModel from "spodcat/models/episode";

export interface PodcastContentEpisodeLeadingIconSignature {
    Args: {
        episode: EpisodeModel;
        "fallback-to-cover"?: boolean;
    };
    Element: HTMLElement;
}

export default class PodcastContentEpisodeLeadingIcon extends Component<PodcastContentEpisodeLeadingIconSignature> {
    get classes() {
        const theme = this.args.episode.season ? this.args.episode.season.theme : "primary";
        return `podcast-content-leading-icon theme-${theme}`;
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
