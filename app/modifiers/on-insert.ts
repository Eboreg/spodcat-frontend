import { modifier } from "ember-modifier";

interface OnInsertSignature {
    Element: HTMLElement;
    Args: {
        Positional: [(element: HTMLElement) => void];
    };
}

export default modifier<OnInsertSignature>(function onInsert(element, [callback]) {
    callback(element);
});
