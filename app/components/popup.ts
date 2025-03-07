import templateOnly from "@ember/component/template-only";

export interface PopupSignature {
    Blocks: {
        default: [];
    };
    Element: HTMLDivElement;
}

export default templateOnly<PopupSignature>();
