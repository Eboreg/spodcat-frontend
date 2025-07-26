import "@glint/environment-ember-loose";
import type Attribution from "spodcat/components/attribution";
import type Button from "spodcat/components/button";
import type ButtonContent from "spodcat/components/button/content";
import type DbfsBar from "spodcat/components/dbfs/bar";
import type DbfsColumn from "spodcat/components/dbfs/column";
import type EmberFontAwesomeRegistry from "@fortawesome/ember-fontawesome/template-registry";
import type EmberIntlRegistry from "ember-intl/template-registry";
import type EmberTruthRegistry from "ember-truth-helpers/template-registry";
import type HeadLayout from "ember-cli-head/addon/components/head-layout";
import type htmlSafe from "spodcat/helpers/html-safe";
import type Modal from "spodcat/components/modal";
import type onInsert from "spodcat/modifiers/on-insert";
import type onOutsideClick from "spodcat/modifiers/on-outside-click";
import type onSizeChange from "spodcat/modifiers/on-size-change";
import type PlaybackRateControl from "spodcat/components/playback-rate-control";
import type PlayerBar from "spodcat/components/player-bar";
import type PlayerBar from "spodcat/components/player-bar";
import type PlayerBarExpanded from "spodcat/components/player-bar/expanded";
import type PodcastAside from "spodcat/components/podcast/aside";
import type PodcastContentComments from "spodcat/components/podcast/content/comments";
import type PodcastContentDescription from "spodcat/components/podcast/content/description";
import type PodcastContentEpisodeCard from "spodcat/components/podcast/content/episode-card";
import type PodcastContentEpisodeCardHead from "spodcat/components/podcast/content/episode-card/head";
import type PodcastContentEpisodeLeadingIcon from "spodcat/components/podcast/content/episode-leading-icon";
import type PodcastContentPostCard from "spodcat/components/podcast/content/post-card";
import type PodcastContentPostCardHead from "spodcat/components/podcast/content/post-card/head";
import type PodcastContentShareModal from "spodcat/components/podcast/content/share-modal";
import type PodcastEpisode from "spodcat/components/podcast/episode";
import type PodcastIndex from "spodcat/components/podcast/index";
import type PodcastPost from "spodcat/components/podcast/post";
import type Popup from "spodcat/components/popup";
import type ProgressCircle from "spodcat/components/progress-circle";
import type setBodyClass from "ember-set-body-class/addon/helpers/set-body-class";
import type staticUrl from "spodcat/helpers/static-url";
import type TextInput from "spodcat/components/text-input";
import type Toast from "spodcat/components/toast";
import type VolumeControl from "spodcat/components/volume-control";
import type VolumeControlInner from "spodcat/components/volume-control/inner";

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
        "on-size-change": typeof onSizeChange;
        "page-title": PageTitle;
        "PlayerBar::Expanded": typeof PlayerBarExpanded;
        "Podcast::Aside": typeof PodcastAside;
        "Podcast::Content::Comments": typeof PodcastContentComments;
        "Podcast::Content::Description": typeof PodcastContentDescription;
        "Podcast::Content::EpisodeCard::Head": typeof PodcastContentEpisodeCardHead;
        "Podcast::Content::EpisodeCard": typeof PodcastContentEpisodeCard;
        "Podcast::Content::EpisodeLeadingIcon": typeof PodcastContentEpisodeLeadingIcon;
        "Podcast::Content::PostCard::Head": typeof PodcastContentPostCardHead;
        "Podcast::Content::PostCard": typeof PodcastContentPostCard;
        "Podcast::Content::ShareModal": typeof PodcastContentShareModal;
        "Podcast::Episode": typeof PodcastEpisode;
        "Podcast::Index": typeof PodcastIndex;
        "Podcast::Post": typeof PodcastPost;
        "set-body-class": typeof setBodyClass;
        "static-url": typeof staticUrl;
        "VolumeControl::Inner": typeof VolumeControlInner;
        Attribution: typeof Attribution;
        Button: typeof Button;
        HeadLayout: typeof HeadLayout;
        Modal: typeof Modal;
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

export interface YoutubeLink {
    videoId: string;
    start?: number;
}

interface FastbootHeaders {
    has: (header: string) => boolean;
    set: (header: string, value: string) => void;
}

export interface FastbootResponse {
    statusCode: number;
    headers: FastbootHeaders;
}
