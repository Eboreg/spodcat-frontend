import { action } from "@ember/object";
import { service } from "@ember/service";
import type { SafeString } from "@ember/template";
import { htmlSafe } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "podcast-frontend/models/episode";
import type AudioService from "podcast-frontend/services/audio";
import { timeToString } from "podcast-frontend/utils";

export interface DbfsBarSignature {
    Args: {
        episode: EpisodeModel;
    };
    Element: HTMLDivElement;
}

export default class DbfsBar extends Component<DbfsBarSignature> {
    @service declare audio: AudioService;
    @tracked showTooltip: boolean = false;
    @tracked tooltipProgress: number = 0;

    get columnCount() {
        return this.args.episode["dbfs-array"]?.length || 0;
    }

    get overlayStyle(): SafeString {
        return htmlSafe(`width: ${100 - this.audio.currentProgress}%`);
    }

    get tooltipContent() {
        return timeToString(this.args.episode["duration-seconds"] * this.tooltipProgress);
    }

    get tooltipStyle(): SafeString {
        return htmlSafe(`left: ${this.tooltipProgress * 100}%`);
    }

    getMouseProgress(event: MouseEvent) {
        if (event.target instanceof HTMLElement) {
            const parent = event.target.closest(".dbfs");

            if (parent instanceof HTMLElement) {
                return (event.clientX - parent.offsetLeft) / parent.offsetWidth;
            }
        }

        return null;
    }

    @action onClick(event: MouseEvent) {
        const progress = this.getMouseProgress(event);

        if (progress != null) {
            this.audio.seekToProgress(progress);
            this.audio.play();
        }
    }

    @action onMouseLeave() {
        this.showTooltip = false;
    }

    @action onMouseMove(event: MouseEvent) {
        const progress = this.getMouseProgress(event);

        if (progress != null) {
            this.tooltipProgress = progress;
            this.showTooltip = true;
        }
    }
}
