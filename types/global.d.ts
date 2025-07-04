import "@glint/environment-ember-loose";
import type EmberIntlRegistry from "ember-intl/template-registry";
import type EmberFontAwesomeRegistry from "@fortawesome/ember-fontawesome/template-registry";
import type EmberTruthRegistry from "ember-truth-helpers/template-registry";
import type DbfsBar from "spodcat/components/dbfs/bar";
import type DbfsColumn from "spodcat/components/dbfs/column";
import type PlayerBar from "spodcat/components/player-bar";
import type staticUrl from "spodcat/helpers/static-url";
import type PlayerBar from "spodcat/components/player-bar";
import type VolumeControl from "spodcat/components/volume-control";
import type htmlSafe from "spodcat/helpers/html-safe";
import type PodcastIndex from "spodcat/components/podcast/index";
import type PodcastAside from "spodcat/components/podcast/aside";
import type ProgressCircle from "spodcat/components/progress-circle";
import type PlaybackRateControl from "spodcat/components/playback-rate-control";
import type setBodyClass from "ember-set-body-class/addon/helpers/set-body-class";
import type Button from "spodcat/components/button";
import type HeadLayout from "ember-cli-head/addon/components/head-layout";
import type ButtonContent from "spodcat/components/button/content";
import type onOutsideClick from "spodcat/modifiers/on-outside-click";
import type Attribution from "spodcat/components/attribution";
import type PodcastContentEpisodeCard from "spodcat/components/podcast/content/episode-card";
import type PodcastContentPostCard from "spodcat/components/podcast/content/post-card";
import type PodcastContentComments from "spodcat/components/podcast/content/comments";
import type PodcastContentDescription from "spodcat/components/podcast/content/description";
import type PodcastEpisode from "spodcat/components/podcast/episode";
import type PodcastPost from "spodcat/components/podcast/post";
import type PlayerBarExpanded from "spodcat/components/player-bar/expanded";
import type VolumeControlInner from "spodcat/components/volume-control/inner";
import type Popup from "spodcat/components/popup";
import type TextInput from "spodcat/components/text-input";
import type Toast from "spodcat/components/toast";
import type onInsert from "spodcat/modifiers/on-insert";
import type PodcastContentEpisodeLeadingIcon from "spodcat/components/podcast/content/episode-leading-icon";

declare module "@glint/environment-ember-loose/registry" {
    import { HelperLike } from "@glint/template";

    export type PageTitle = abstract new <T>() => InstanceType<
        HelperLike<{
            Args: {
                Positional: [value: T];
            };
            Return: "";
        }>
    >;

    export default interface Registry extends EmberFontAwesomeRegistry, EmberTruthRegistry, EmberIntlRegistry {
        "Button::Content": typeof ButtonContent;
        "Dbfs::Bar": typeof DbfsBar;
        "Dbfs::Column": typeof DbfsColumn;
        "html-safe": typeof htmlSafe;
        "on-insert": typeof onInsert;
        "on-outside-click": typeof onOutsideClick;
        "page-title": PageTitle;
        "PlayerBar::Expanded": typeof PlayerBarExpanded;
        "Podcast::Aside": typeof PodcastAside;
        "Podcast::Content::Comments": typeof PodcastContentComments;
        "Podcast::Content::Description": typeof PodcastContentDescription;
        "Podcast::Content::EpisodeCard": typeof PodcastContentEpisodeCard;
        "Podcast::Content::EpisodeLeadingIcon": typeof PodcastContentEpisodeLeadingIcon;
        "Podcast::Content::PostCard": typeof PodcastContentPostCard;
        "Podcast::Episode": typeof PodcastEpisode;
        "Podcast::Index": typeof PodcastIndex;
        "Podcast::Post": typeof PodcastPost;
        "set-body-class": typeof setBodyClass;
        "static-url": typeof staticUrl;
        "VolumeControl::Inner": typeof VolumeControlInner;
        Attribution: typeof Attribution;
        Button: typeof Button;
        HeadLayout: typeof HeadLayout;
        PlaybackRateControl: typeof PlaybackRateControl;
        PlayerBar: typeof PlayerBar;
        Popup: typeof Popup;
        ProgressCircle: typeof ProgressCircle;
        TextInput: typeof TextInput;
        Toast: typeof Toast;
        VolumeControl: typeof VolumeControl;
    }
}

export interface Size {
    width: number;
    height: number;
}

export interface Image extends Size {
    url: string;
}

export type Theme = "primary" | "secondary" | "tertiary" | "boring";
