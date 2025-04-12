import { runTask } from "ember-lifeline";
import Route from "@ember/routing/route";
import { service } from "@ember/service";
import type FastBoot from "ember-cli-fastboot/services/fastboot";

export default class PreserveScrollRoute<Model> extends Route<Model> {
    @service declare fastboot: FastBoot;
    scrollY: number = 0;

    enter() {
        if (!this.fastboot.isFastBoot) {
            runTask(this, () => {
                document.body.scrollTo(0, this.getScrollY());
            });
        }
    }

    exit() {
        if (!this.fastboot.isFastBoot) {
            this.setScrollY(document.body.scrollTop);
        }
    }

    getScrollY() {
        return this.scrollY;
    }

    setScrollY(value: number) {
        this.scrollY = value;
    }
}
