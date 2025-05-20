import { action } from "@ember/object";
import Route from "@ember/routing/route";
import type Transition from "@ember/routing/transition";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import type ApplicationController from "podcast-frontend/controllers/application";

export default class ApplicationRoute extends Route {
    @service declare fastboot: FastBoot;

    @action error(error: any) {
        const statusCode = Array.isArray(error.errors) ? parseInt(error.errors[0]?.status) : NaN;

        if (this.fastboot.isFastBoot && !isNaN(statusCode)) {
            this.fastboot.set("response.statusCode", statusCode);
        }

        return true;
    }

    @action loading(transition: Transition) {
        // eslint-disable-next-line ember/no-controller-access-in-routes
        const controller = this.controllerFor("application") as ApplicationController;

        console.log("loading", controller.isLoading);
        controller.isLoading = true;
        transition.promise?.finally(() => {
            console.log("no longer loading", controller.isLoading);
            controller.isLoading = false;
        });
        return true;
    }
}
