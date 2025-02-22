import { modifier } from "ember-modifier";

interface OnAudioInsertSignature {
    Element: HTMLAudioElement;
    Args: {
        Positional: [(element: HTMLAudioElement) => void];
    };
}

export default modifier<OnAudioInsertSignature>(function onAudioInsert(element, [callback]) {
    callback(element);
});
