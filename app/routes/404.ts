import Route from "@ember/routing/route";
import type RouterService from "@ember/routing/router-service";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";

export default class SwjsRoute extends Route {
    @service declare fastboot: FastBoot;
    @service declare router: RouterService;

    beforeModel() {
        if (this.fastboot.isFastBoot) {
            this.fastboot.set("response.statusCode", 404);
        }
    }
}
