import Controller from "@ember/controller";
import { action } from "@ember/object";
import { service } from "@ember/service";
import type AudioService from "podcast-frontend/services/audio";
import type MessageService from "podcast-frontend/services/message";

export default class ApplicationController extends Controller {
    @service declare audio: AudioService;
    @service declare message: MessageService;

    @action onAudioError(error: string) {
        this.message.addToast({ level: "error", text: error, icon: "sentiment_dissatisfied" });
    }
}
