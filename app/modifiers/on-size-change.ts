import { modifier } from "ember-modifier";
import type { Size } from "global";

interface OnSizeChangeSignature {
    Element: HTMLElement;
    Args: {
        Positional: [(size: Size) => void];
    };
}

const onSizeChange = modifier<OnSizeChangeSignature>((element, [callback]) => {
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            for (const size of entry.borderBoxSize) {
                callback({ width: size.inlineSize, height: size.blockSize });
            }
        }
    });

    observer.observe(element);

    return () => {
        observer.disconnect();
    };
});

export default onSizeChange;
