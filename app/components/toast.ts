import { runTask } from "ember-lifeline";
import { action } from "@ember/object";
import { htmlSafe, type SafeString } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { Size } from "global";
import type { PlacedToast } from "podcast-frontend/services/message";
import { service } from "@ember/service";
import type AudioService from "podcast-frontend/services/audio";
import type MessageService from "podcast-frontend/services/message";
import type FastBoot from "ember-cli-fastboot/services/fastboot";

export interface ToastSignature {
    Args: {
        toast: PlacedToast;
    };
    Element: HTMLDivElement;
}

interface TransitionStyle {
    bottom: string;
    left: string;
    scale: number;
    opacity: number;
}

type TransitionFunction = (style: TransitionStyle) => void;

export default class Toast extends Component<ToastSignature> {
    @service declare audio: AudioService;
    @service declare message: MessageService;
    @service declare fastboot: FastBoot;

    @tracked declare countdownAnimation: Animation;
    @tracked show: boolean = false;
    @tracked size: Size = { width: 802, height: 71 };

    constructor(...args: ConstructorParameters<typeof Component<ToastSignature>>) {
        super(...args);
        if (!this.fastboot.isFastBoot) {
            this.size = { width: Math.min(802, document.body.clientWidth - 20), height: 71 };
        }
        // Tiny delay, because this.style() needs to be able to run once before
        // this.show is set to true, to make sure we start from "hidden" state:
        runTask(
            this,
            () => {
                this.show = true;
            },
            10,
        );
    }

    get classes(): SafeString {
        switch (this.args.toast.message.level) {
            case "error":
                return htmlSafe("toast theme-primary");
            case "info":
                return htmlSafe("toast theme-secondary");
            case "success":
                return htmlSafe("toast theme-tertiary");
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
        const style: TransitionStyle = {
            bottom: `${dy}px`,
            left: "calc(50% - calc(var(--mm-toast-width) / 2))",
            scale: 1,
            opacity: this.size.height > 0 ? 1 : 0,
        };

        if (!this.show) this.getRandomTransitionFunction()(style);

        return htmlSafe(
            `bottom: ${style.bottom}; left: ${style.left}; scale: ${style.scale}; opacity: ${style.opacity}`,
        );
    }

    getRandomTransitionFunction(): TransitionFunction {
        const functions: TransitionFunction[] = [
            (style) => {
                // from top
                style.bottom = "calc(100% + var(--mm-length-half))";
            },
            (style) => {
                // from right
                style.left = "calc(100% + var(--mm-length-half))";
            },
            (style) => {
                // from bottom
                style.bottom = `-${this.size.height + 10}px`;
            },
            (style) => {
                // from left
                style.left = `-${this.size.width + 10}px`;
            },
            (style) => {
                // from 0x size
                style.scale = 0;
            },
            (style) => {
                // from 100x size
                style.scale = 100;
                style.opacity = 0;
            },
        ];

        return functions[Math.floor(Math.random() * functions.length)]!;
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
        if (size.height != this.size.height || size.width != this.size.width) {
            this.size = size;
        }
        this.message.onToastSizeChange(this.args.toast.id, size);
    }

    @action onTransitionEnd() {
        if (!this.show) {
            this.message.onToastHidden(this.args.toast.id);
        }
    }

    @action setCountdownElement(elem: HTMLElement) {
        this.countdownAnimation = elem.animate({ width: ["100%", "0%"] }, this.args.toast.timeout);
        this.countdownAnimation.onfinish = () => {
            this.show = false;
        };
    }
}
