import { runTask } from "ember-lifeline";
import { action } from "@ember/object";
import { htmlSafe, type SafeString } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { Size } from "global";
import type { PlacedToast } from "spodcat/services/message";
import { service } from "@ember/service";
import type AudioService from "spodcat/services/audio";
import type MessageService from "spodcat/services/message";
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
            50,
        );
    }

    get classes(): SafeString {
        return htmlSafe(`toast theme-${this.args.toast.message.level}`);
    }

    get countdownClass() {
        return `bg-${this.args.toast.message.level}-dark`;
    }

    get icon() {
        if (this.args.toast.message.icon == undefined) {
            if (this.args.toast.message.level == "error") return "sentiment_dissatisfied";
        }
        return this.args.toast.message.icon;
    }

    get style(): SafeString {
        const dy = this.args.toast.bottomOffset + (this.audio.episode ? 75 : 10);
        const styleBase: TransitionStyle = {
            bottom: `${dy}px`,
            left: "calc(50% - calc(var(--mm-toast-width) / 2))",
            scale: 1,
            opacity: this.size.height > 0 ? 1 : 0,
        };
        const styleModifier = this.show ? {} : this.getRandomTransition();
        const style = { ...styleBase, ...styleModifier };

        return htmlSafe(
            `bottom: ${style.bottom}; left: ${style.left}; scale: ${style.scale}; opacity: ${style.opacity}`,
        );
    }

    getRandomTransition(): Partial<TransitionStyle> {
        const styles: Partial<TransitionStyle>[] = [
            // from top
            { bottom: "calc(100% + var(--mm-length-half))" },
            // from right
            { left: "calc(100% + var(--mm-length-half))" },
            // from bottom
            { bottom: `-${this.size.height + 10}px` },
            // from left
            { left: `-${this.size.width + 10}px` },
            // from 0x size
            { scale: 0 },
            // from 100x size
            { scale: 100, opacity: 0 },
        ];

        return styles[Math.floor(Math.random() * styles.length)]!;
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
