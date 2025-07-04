import Controller from "@ember/controller";
import { service } from "@ember/service";
import type AudioService from "spodcat/services/audio";
import type MessageService from "spodcat/services/message";

export default class ApplicationController extends Controller {
    @service declare audio: AudioService;
    @service declare message: MessageService;
}
