import { action } from "@ember/object";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type MessageService from "spodcat/services/message";
import { timeFromString, timeToString } from "spodcat/utils";

export interface PodcastContentShareModalSignature {
    Args: {
        url: string;
        "current-time"?: number;
        open: boolean;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [];
    };
}

export default class PodcastContentShareModal extends Component<PodcastContentShareModalSignature> {
    @service declare message: MessageService;
    @service declare intl: Registry["intl"];

    @tracked attachTimeCode = false;
    @tracked currentTime = this.args["current-time"] || 0;
    @tracked currentTimeString = timeToString(this.args["current-time"] || 0);

    get eggsUrl() {
        return "https://x.com/intent/tweet?url=" + encodeURIComponent(this.contentUrl);
    }

    get contentUrl() {
        if (this.attachTimeCode && this.currentTime) return `${this.args.url}?start=${this.currentTime}`;
        return this.args.url;
    }

    get facebookUrl() {
        return "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.contentUrl);
    }

    get hasCurrentTime() {
        return this.args["current-time"] != undefined;
    }

    get telegramUrl() {
        return "https://t.me/share/url?url=" + encodeURIComponent(this.contentUrl);
    }

    get whatsappUrl() {
        return "https://api.whatsapp.com/send?text=" + encodeURIComponent(this.contentUrl);
    }

    @action async onCopyClick() {
        try {
            await navigator.clipboard.writeText(this.contentUrl);
            this.message.addToast({ level: "info", text: this.intl.t("share.link-copied") });
        } catch (error: any) {
            console.error(error);
            this.message.addToast({ level: "error", text: String(error) });
        }
    }

    @action onCurrentTimeStringChange() {
        const time = timeFromString(this.currentTimeString.replace(/[^0-9:]/g, ""));

        if (time != null) this.currentTime = time;
        else this.currentTimeString = timeToString(this.currentTime);
    }

    @action onContentUrlClick(event: MouseEvent) {
        if (event.target instanceof HTMLInputElement) event.target.select();
    }
}
