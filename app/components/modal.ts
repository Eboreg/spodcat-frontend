import { action } from "@ember/object";
import Component from "@glimmer/component";

export interface ModalSignature {
    Args: {
        open: boolean;
    };
    Element: HTMLDialogElement;
    Blocks: {
        default: [];
        header: [];
    };
}

export default class Modal<T extends ModalSignature> extends Component<T> {
    dialogElement?: HTMLDialogElement;

    @action hide() {
        this.dialogElement?.close();
    }

    @action onInsert(dialog: HTMLElement) {
        if (dialog instanceof HTMLDialogElement && dialog != this.dialogElement) {
            this.dialogElement = dialog;
            if (this.args.open) this.show();
            else this.hide();
        }
    }

    @action onOpenChange(dialog: HTMLElement, open: boolean) {
        if (open) this.show();
        else this.hide();
    }

    @action show() {
        this.dialogElement?.showModal();
    }
}
