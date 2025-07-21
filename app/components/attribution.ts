import { action } from "@ember/object";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type MessageService from "spodcat/services/message";

export interface AttributionSignature {
    Element: HTMLDivElement;
}

export default class Attribution extends Component<AttributionSignature> {
    @service declare message: MessageService;
    @service declare intl: Registry["intl"];

    @tracked declare audioElement: HTMLAudioElement;
    @tracked showFlash: boolean = false;

    @action onFlashAnimationEnd() {
        this.showFlash = false;
    }

    @action onCookiesClick() {
        this.message.addToast({
            level: "info",
            text: this.intl.t("cookies.answer"),
            timeout: 10000,
            icon: "cookie",
        });
    }

    @action onMouseEnter() {
        void this.audioElement?.play();
        this.showFlash = true;
    }

    @action setAudioElement(element: HTMLElement) {
        if (element instanceof HTMLAudioElement) {
            element.volume = 0.6;
            this.audioElement = element;
        }
    }
}
