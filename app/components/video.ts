import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type VideoModel from "spodcat/models/video";
import type { Size } from "global";

export interface VideoSignature {
    Args: {
        video: VideoModel;
        consent?: boolean;
        "on-consent-click": () => void;
    };
}

export default class Video extends Component<VideoSignature> {
    @tracked width: number = 600;
    iframe?: HTMLIFrameElement;

    get height(): number {
        return this.width * (9 / 16);
    }

    @action onInsert(elem: HTMLElement) {
        const iframe = elem.querySelector("iframe");
        if (iframe instanceof HTMLIFrameElement) {
            this.iframe = iframe;
            iframe.width = this.width.toString();
            iframe.height = this.height.toString();
        }
    }

    @action onSizeChange(size: Size) {
        this.width = size.width;

        if (this.iframe) {
            this.iframe.width = this.width.toString();
            this.iframe.height = this.height.toString();
        }
    }
}
