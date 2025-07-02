import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import ENV from "podcast-frontend/config/environment";

export default class ApplicationRoute extends Route {
    @service declare fastboot: FastBoot;
    @service declare intl: Registry["intl"];

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
