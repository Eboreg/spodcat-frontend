import { action } from "@ember/object";
import Component from "@glimmer/component";

export interface ModalSignature {
    Args: {
        "on-backdrop-click"?: () => void;
        "on-close-click": () => void;
    };
    Element: HTMLDivElement;
    Blocks: {
        default: [];
    };
}

export default class Modal extends Component<ModalSignature> {
    @action onCloseClick() {
        this.args["on-close-click"]();
    }

    @action onContainerClick(event: MouseEvent) {
        if (
            event.target instanceof HTMLElement &&
            event.target.classList.contains("modal-container") &&
            this.args["on-backdrop-click"]
        ) {
            this.args["on-backdrop-click"]();
        }
    }
}
