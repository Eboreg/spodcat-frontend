import { action } from "@ember/object";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";

export default class ApplicationRoute extends Route {
    @service declare fastboot: FastBoot;

    @action error(error: any) {
        const statusCode = Array.isArray(error.errors) ? parseInt(error.errors[0]?.status) : NaN;

        if (this.fastboot.isFastBoot && !isNaN(statusCode)) {
            this.fastboot.set("response.statusCode", statusCode);
        }

        return true;
    }
}
