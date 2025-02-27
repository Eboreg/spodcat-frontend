import type Model from "@ember-data/model";
import { action } from "@ember/object";
import { htmlSafe, type SafeString } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export interface ButtonSignature {
    Args: {
        route?: string;
        model?: Model | string;
        models?: (Model | string)[];
        disabled?: boolean;
        theme: "primary" | "secondary" | "tertiary";
        "material-icon"?: string;
        href?: string;
        "new-tab"?: boolean;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLAnchorElement;
}

export default class Button extends Component<ButtonSignature> {
    @tracked isLoading: boolean = false;

    get isLink(): boolean {
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

    @action onLinkClick(event: Event) {
        if (this.isLoading) {
            event.preventDefault();
        } else if (this.isLink && this.args["new-tab"] != true) {
            this.isLoading = true;
        }
    }
}
