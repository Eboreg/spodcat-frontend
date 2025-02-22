import "@glint/environment-ember-loose";
import type EmberFontAwesomeRegistry from "@fortawesome/ember-fontawesome/template-registry";
import type EmberTruthRegistry from "ember-truth-helpers/template-registry";
import type EpisodeCard from "podcast-frontend/components/episode-card";
import type DbfsBar from "podcast-frontend/components/dbfs/bar";
import type DbfsColumn from "podcast-frontend/components/dbfs/column";
import type PlayerBar from "podcast-frontend/components/player-bar";
import type upper from "podcast-frontend/helpers/upper";
import type staticUrl from "podcast-frontend/helpers/static-url";
import type onAudioInsert from "podcast-frontend/modifiers/on-audio-insert";
import type PlayerBar from "podcast-frontend/components/player-bar";
import type VolumeControl from "podcast-frontend/components/volume-control";
import type htmlSafe from "podcast-frontend/helpers/html-safe";

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
        "Dbfs::Bar": typeof DbfsBar;
        "Dbfs::Column": typeof DbfsColumn;
        "html-safe": typeof htmlSafe;
        "on-audio-insert": typeof onAudioInsert;
        "page-title": PageTitle;
        "static-url": typeof staticUrl;
        EpisodeCard: typeof EpisodeCard;
        PlayerBar: typeof PlayerBar;
        upper: typeof upper;
        VolumeControl: typeof VolumeControl;
    }
}
