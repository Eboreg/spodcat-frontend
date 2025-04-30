import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type MessageService from "podcast-frontend/services/message";

export interface AttributionSignature {
    Element: HTMLDivElement;
}

export default class Attribution extends Component<AttributionSignature> {
    @service declare message: MessageService;
    @tracked declare audioElement: HTMLAudioElement;
    @tracked showFlash: boolean = false;

    @action onFlashAnimationEnd() {
        this.showFlash = false;
    }

    @action onCookiesClick() {
        this.message.addToast({
            level: "info",
            text:
                "Vi ställer inga irriterande frågor om cookies eftersom vi helt enkelt inte lagrar några. " +
                "Det går nämligen ofta utmärkt att låta bli.",
            timeout: 10000,
            icon: "cookie",
        });
    }

    @action onMouseEnter() {
        void this.audioElement?.play();
        this.showFlash = true;
    }

    @action setAudioElement(element: HTMLAudioElement) {
        element.volume = 0.6;
        this.audioElement = element;
    }
}
