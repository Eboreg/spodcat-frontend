import "@glint/environment-ember-loose";
import type EmberFontAwesomeRegistry from "@fortawesome/ember-fontawesome/template-registry";
import type EmberTruthRegistry from "ember-truth-helpers/template-registry";
import type EpisodeCard from "podcast-frontend/components/episode-card";
import type DbfsBar from "podcast-frontend/components/dbfs/bar";
import type DbfsColumn from "podcast-frontend/components/dbfs/column";
import type PlayerBar from "podcast-frontend/components/player-bar";
import type staticUrl from "podcast-frontend/helpers/static-url";
import type onAudioInsert from "podcast-frontend/modifiers/on-audio-insert";
import type PlayerBar from "podcast-frontend/components/player-bar";
import type VolumeControl from "podcast-frontend/components/volume-control";
import type htmlSafe from "podcast-frontend/helpers/html-safe";
import type PodcastIndex from "podcast-frontend/components/podcast/index";
import type PodcastBase from "podcast-frontend/components/podcast/base";
import type PodcastAside from "podcast-frontend/components/podcast/aside";
import type ProgressCircle from "podcast-frontend/components/progress-circle";
import type PlaybackRateControl from "podcast-frontend/components/playback-rate-control";
import type Audio from "podcast-frontend/components/audio";
import type setBodyClass from "ember-set-body-class/addon/helpers/set-body-class";
import type Button from "podcast-frontend/components/button";
import type HeadLayout from "ember-cli-head/addon/components/head-layout";
import type ButtonContent from "podcast-frontend/components/button/content";
import type onOutsideClick from "podcast-frontend/modifiers/on-outside-click";
import type Attribution from "podcast-frontend/components/attribution";

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
        "on-audio-insert": typeof onAudioInsert;
        "on-outside-click": typeof onOutsideClick;
        "page-title": PageTitle;
        "Podcast::Aside": typeof PodcastAside;
        "Podcast::Base": typeof PodcastBase;
        "Podcast::Index": typeof PodcastIndex;
        "set-body-class": typeof setBodyClass;
        "static-url": typeof staticUrl;
        Audio: typeof Audio;
        Button: typeof Button;
        EpisodeCard: typeof EpisodeCard;
        HeadLayout: typeof HeadLayout;
        PlaybackRateControl: typeof PlaybackRateControl;
        PlayerBar: typeof PlayerBar;
        ProgressCircle: typeof ProgressCircle;
        VolumeControl: typeof VolumeControl;
        Attribution: typeof Attribution;
    }
}
