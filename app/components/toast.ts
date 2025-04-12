import { runTask } from "ember-lifeline";
import { action } from "@ember/object";
import { htmlSafe, type SafeString } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { Size } from "global";
import type { Message } from "podcast-frontend/services/message";
import { service } from "@ember/service";
import type AudioService from "podcast-frontend/services/audio";

export interface ToastSignature {
    Args: {
        message: Message;
        id: number;
        "bottom-offset": number;
        "on-size-change": (id: number, size: Size) => void;
        "on-hidden": (id: number) => void;
    };
    Element: HTMLDivElement;
}

const transitions = ["up", "right", "down", "left", "scale", "fade"] as const;

export default class Toast extends Component<ToastSignature> {
    @service declare audio: AudioService;
    @tracked isHovering: boolean = false;
    @tracked isLoading: boolean = false;
    @tracked show: boolean = false;
    @tracked size: Size = { width: 0, height: 0 };
    transition: (typeof transitions)[number];

    constructor(...args: ConstructorParameters<typeof Component<ToastSignature>>) {
        super(...args);
        this.transition = transitions[Math.floor(Math.random() * transitions.length)]!;
        runTask(this, () => {
            this.show = true;
        });
        runTask(
            this,
            () => {
                this.show = false;
            },
            5000,
        );
    }

    get color(): SafeString {
        switch (this.args.message.level) {
            case "error":
                return htmlSafe("primary");
            case "info":
                return htmlSafe("secondary");
            case "success":
                return htmlSafe("tertiary");
        }
    }

    get style(): SafeString {
        const dy = this.args["bottom-offset"] + (this.audio.episode ? 75 : 10);

        let bottom = `${dy}px`;
        let left = "calc(50% - calc(var(--mm-toast-width) / 2))";
        let scale = 1;
        let opacity = 1;

        if (!this.show && !this.isHovering) {
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
        this.show = false;
        this.isHovering = false;
    }

    @action onMouseEnter() {
        this.isHovering = true;
    }

    @action onMouseLeave() {
        this.isHovering = false;
    }

    @action onSizeChange(size: Size) {
        this.size = size;
        this.args["on-size-change"](this.args.id, size);
    }

    @action onTransitionEnd() {
        if (!this.show) this.args["on-hidden"](this.args.id);
    }
}
