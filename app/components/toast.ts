import { runTask } from "ember-lifeline";
import { action } from "@ember/object";
import { htmlSafe, type SafeString } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { Size } from "global";
import type { PlacedToast } from "podcast-frontend/services/message";
import { service } from "@ember/service";
import type AudioService from "podcast-frontend/services/audio";

export interface ToastSignature {
    Args: {
        toast: PlacedToast;
        "on-size-change": (id: number, size: Size) => void;
        "on-hidden": (id: number) => void;
    };
    Element: HTMLDivElement;
}

const transitions = ["up", "right", "down", "left", "scale", "fade"] as const;

export default class Toast extends Component<ToastSignature> {
    @service declare audio: AudioService;
    @tracked declare countdownAnimation: Animation;
    @tracked show: boolean = false;
    @tracked size: Size = { width: 0, height: 0 };
    transition: (typeof transitions)[number];

    constructor(...args: ConstructorParameters<typeof Component<ToastSignature>>) {
        super(...args);
        this.transition = transitions[Math.floor(Math.random() * transitions.length)]!;
        runTask(this, () => {
            this.show = true;
        });
    }

    get classes(): SafeString {
        switch (this.args.toast.message.level) {
            case "error":
                return htmlSafe("toast color-white bg-primary");
            case "info":
                return htmlSafe("toast color-white bg-secondary");
            case "success":
                return htmlSafe("toast color-white bg-tertiary");
        }
    }

    get countdownClass() {
        switch (this.args.toast.message.level) {
            case "error":
                return "bg-primary-dark";
            case "info":
                return "bg-secondary-dark";
            case "success":
                return "bg-tertiary-dark";
        }
    }

    get icon() {
        if (this.args.toast.message.icon == undefined) {
            if (this.args.toast.message.level == "error") return "sentiment_dissatisfied";
        }
        return this.args.toast.message.icon;
    }

    get style(): SafeString {
        const dy = this.args.toast.bottomOffset + (this.audio.episode ? 75 : 10);

        let bottom = `${dy}px`;
        let left = "calc(50% - calc(var(--mm-toast-width) / 2))";
        let scale = 1;
        let opacity = 1;

        if (!this.show) {
            switch (this.transition) {
                case "up":
                    bottom = "calc(100% + 10px)";
                    break;
                case "right":
                    left = "calc(100% + 10px)";
                    break;
                case "down":
                    bottom = `-${this.size.height + 10}px`;
                    break;
                case "left":
                    left = `-${this.size.width + 10}px`;
                    break;
                case "scale":
                    scale = 0;
                    break;
                case "fade":
                    opacity = 0;
                    break;
            }
        }

        return htmlSafe(`bottom: ${bottom}; left: ${left}; scale: ${scale}; opacity: ${opacity}`);
    }

    @action onCloseClick() {
        this.countdownAnimation?.finish();
    }

    @action onMouseEnter() {
        this.countdownAnimation?.pause();
    }

    @action onMouseLeave() {
        this.countdownAnimation?.play();
    }

    @action onSizeChange(size: Size) {
        this.size = size;
        this.args["on-size-change"](this.args.toast.id, size);
    }

    @action onTransitionEnd() {
        if (!this.show) this.args["on-hidden"](this.args.toast.id);
    }

    @action setCountdownElement(elem: HTMLElement) {
        this.countdownAnimation = elem.animate({ width: ["100%", "0%"] }, this.args.toast.timeout);
        this.countdownAnimation.onfinish = () => {
            this.show = false;
        };
    }
}
