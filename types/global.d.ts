import "@glint/environment-ember-loose";
import type EmberFontAwesomeRegistry from "@fortawesome/ember-fontawesome/template-registry";
import type EmberTruthRegistry from "ember-truth-helpers/template-registry";
import type DbfsBar from "podcast-frontend/components/dbfs/bar";
import type DbfsColumn from "podcast-frontend/components/dbfs/column";
import type PlayerBar from "podcast-frontend/components/player-bar";
import type staticUrl from "podcast-frontend/helpers/static-url";
import type PlayerBar from "podcast-frontend/components/player-bar";
import type VolumeControl from "podcast-frontend/components/volume-control";
import type htmlSafe from "podcast-frontend/helpers/html-safe";
import type PodcastIndex from "podcast-frontend/components/podcast/index";
import type PodcastBase from "podcast-frontend/components/podcast/base";
import type PodcastAside from "podcast-frontend/components/podcast/aside";
import type ProgressCircle from "podcast-frontend/components/progress-circle";
import type PlaybackRateControl from "podcast-frontend/components/playback-rate-control";
import type setBodyClass from "ember-set-body-class/addon/helpers/set-body-class";
import type Button from "podcast-frontend/components/button";
import type HeadLayout from "ember-cli-head/addon/components/head-layout";
import type ButtonContent from "podcast-frontend/components/button/content";
import type onOutsideClick from "podcast-frontend/modifiers/on-outside-click";
import type Attribution from "podcast-frontend/components/attribution";
import type PodcastContentEpisodeCard from "podcast-frontend/components/podcast/content/episode-card";
import type PodcastContentPostCard from "podcast-frontend/components/podcast/content/post-card";
import type PodcastContentComments from "podcast-frontend/components/podcast/content/comments";
import type PodcastContentDescription from "podcast-frontend/components/podcast/content/description";
import type PodcastEpisode from "podcast-frontend/components/podcast/episode";
import type PodcastPost from "podcast-frontend/components/podcast/post";
import type PlayerBarExpanded from "podcast-frontend/components/player-bar/expanded";
import type VolumeControlInner from "podcast-frontend/components/volume-control/inner";
import type Popup from "podcast-frontend/components/popup";
import type TextInput from "podcast-frontend/components/text-input";
import type Toast from "podcast-frontend/components/toast";
import type onInsert from "podcast-frontend/modifiers/on-insert";
import type PodcastContentEpisodeLeadingIcon from "podcast-frontend/components/podcast/content/episode-leading-icon";

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

    export default interface Registry extends EmberFontAwesomeRegistry, EmberTruthRegistry {
        "Button::Content": typeof ButtonContent;
        "Dbfs::Bar": typeof DbfsBar;
        "Dbfs::Column": typeof DbfsColumn;
        "html-safe": typeof htmlSafe;
        "on-insert": typeof onInsert;
        "on-outside-click": typeof onOutsideClick;
        "page-title": PageTitle;
        "PlayerBar::Expanded": typeof PlayerBarExpanded;
        "Podcast::Aside": typeof PodcastAside;
        "Podcast::Base": typeof PodcastBase;
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
