import { action } from "@ember/object";
import type { Registry } from "@ember/service";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type MessageService from "spodcat/services/message";

export interface AttributionSignature {
    Element: HTMLDivElement;
}

export default class Attribution extends Component<AttributionSignature> {
    @service declare message: MessageService;
    @service declare intl: Registry["intl"];

    @action onCookiesClick() {
        this.message.addToast({
            level: "info",
            text: this.intl.t("cookies.answer"),
            timeout: 10000,
            icon: "cookie",
        });
    }
}
