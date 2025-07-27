import Controller from "@ember/controller";
import { getOwner } from "@ember/owner";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type { FastbootResponse } from "global";
import type AudioService from "spodcat/services/audio";
import type MessageService from "spodcat/services/message";

export default class ApplicationController extends Controller {
    @service declare audio: AudioService;
    @service declare fastboot: FastBoot;
    @service declare intl: Registry["intl"];
    @service declare message: MessageService;

    setLocale(value: string) {
        const docService = getOwner(this)?.lookup("service:-document") as Document | undefined;

        this.intl.setLocale(value);
        docService?.documentElement?.setAttribute("lang", value);

        if (this.fastboot.isFastBoot) {
            const response = this.fastboot.get("response") as FastbootResponse;
            response.headers.set("Content-Language", value);
        }
    }
}
