import type Model from "@ember-data/model";
import { action } from "@ember/object";
import { htmlSafe, type SafeString } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import type { Theme } from "global";

export interface ButtonSignature {
    Args: {
        route?: string;
        model?: Model | string;
        models?: (Model | string)[];
        disabled?: boolean;
        theme: Theme;
        "material-icon"?: string;
        href?: string;
        "new-tab"?: boolean;
        "on-click"?: (event: Event) => any;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLAnchorElement;
}

export default class Button extends Component<ButtonSignature> {
    @tracked isLoading: boolean = false;

    get classes(): SafeString {
        const ret: string[] = ["button", "hover-light", `theme-${this.args.theme}`];

        if (this.isLoading) ret.push("loading");
        if (this.args.disabled) ret.push("disabled");
        return htmlSafe(ret.join(" "));
    }

    get isExternalLink(): boolean {
        return this.useLinkTo || this.args.href != undefined;
    }

    get models() {
        if (this.args.models) return this.args.models;
        if (this.args.model) return [this.args.model];
        return [];
    }

    get rel(): SafeString {
        if (this.args["new-tab"] == true) return htmlSafe("noopener noreferrer");
        return htmlSafe("");
    }

    get target(): SafeString {
        if (this.args["new-tab"] == true) return htmlSafe("_blank");
        return htmlSafe("_self");
    }

    get useLinkTo(): boolean {
        return this.args.route != undefined || this.args.model != undefined || this.args.models != undefined;
    }

    @action onClick(event: Event) {
        if (this.isLoading || this.args.disabled) {
            event.preventDefault();
        } else {
            if (this.isExternalLink && this.args["new-tab"] != true) {
                this.isLoading = true;
            }
            if (this.args["on-click"]) {
                this.args["on-click"](event);
            }
        }
    }
}
