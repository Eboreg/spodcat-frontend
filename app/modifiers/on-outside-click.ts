import { modifier } from "ember-modifier";
import { elementIsChildOf } from "podcast-frontend/utils";

interface OnOutsideClickSignature {
    Element: HTMLElement;
    Args: {
        Positional: [(event: MouseEvent) => void];
    };
}

const onOutsideClick = modifier<OnOutsideClickSignature>((element, [callback]) => {
    function listener(event: MouseEvent) {
        if (event.target instanceof HTMLElement && !elementIsChildOf(event.target, element)) {
            callback(event);
        }
    }

    document.body.addEventListener("click", listener);

    return () => {
        document.body.removeEventListener("click", listener);
    };
});

export default onOutsideClick;
