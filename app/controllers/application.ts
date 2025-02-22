import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type AudioService from "podcast-frontend/services/audio";

export default class ApplicationController extends Controller {
    @service declare audio: AudioService;
    @tracked declare airhornElement: HTMLAudioElement;
    @tracked showFlash: boolean = false;

    @action onFlashAnimationEnd() {
        this.showFlash = false;
    }

    @action onMouseEnterRobert() {
        void this.airhornElement?.play();
        this.showFlash = true;
    }

    @action setAirhornElement(element: HTMLAudioElement) {
        this.airhornElement = element;
    }
}
