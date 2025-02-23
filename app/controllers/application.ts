import Controller from "@ember/controller";
import { service } from "@ember/service";
import type AudioService from "podcast-frontend/services/audio";

export default class ApplicationController extends Controller {
    @service declare audio: AudioService;
}
