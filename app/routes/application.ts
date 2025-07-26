import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type { FastbootResponse } from "global";
import ENV from "spodcat/config/environment";

export default class ApplicationRoute extends Route {
    @service declare fastboot: FastBoot;
    @service declare intl: Registry["intl"];

    afterModel() {
        if (this.fastboot.isFastBoot) {
            const response = this.fastboot.get("response") as FastbootResponse;

            response.headers.set("Content-Type", "text/html; charset=utf-8");
            if (!response.headers.has("Content-Language")) {
                response.headers.set("Content-Language", ENV.APP.LOCALE);
            }
        }
    }

    beforeModel() {
        this.intl.setLocale(ENV.APP.LOCALE);
    }

    @action error(error: any) {
        const statusCode = Array.isArray(error.errors) ? parseInt(error.errors[0]?.status) : NaN;

        if (this.fastboot.isFastBoot && !isNaN(statusCode)) {
            this.fastboot.set("response.statusCode", statusCode);
        }

        return true;
    }
}
