import Modifier, { type PositionalArgs } from "ember-modifier";

interface OnUpdateSignature {
    Element: HTMLElement;
    Args: {
        Positional: [(element: HTMLElement, ...args: unknown[]) => void, ...args: unknown[]];
    };
}

export default class OnUpdate extends Modifier<OnUpdateSignature> {
    firstRun: boolean = true;

    modify(element: HTMLElement, positional: PositionalArgs<OnUpdateSignature>) {
        const [callback, ...args] = positional;

        args.forEach(() => {});
        if (!this.firstRun) callback(element, ...args);
        this.firstRun = false;
    }
}
