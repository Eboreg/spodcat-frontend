import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export interface AttributionSignature {
    Element: HTMLDivElement;
}

export default class Attribution extends Component<AttributionSignature> {
    @tracked declare audioElement: HTMLAudioElement;
    @tracked showFlash: boolean = false;

    @action onFlashAnimationEnd() {
        this.showFlash = false;
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
