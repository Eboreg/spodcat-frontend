import type { Textarea } from "@ember/component";
import type { Input } from "@ember/component";
import Component from "@glimmer/component";

export interface ValidationError {
    attribute: string;
    message: string;
}

export interface TextInputSignature {
    Args: {
        disabled?: boolean;
        label?: string;
        value?: string;
        "max-length"?: number;
        errors?: ValidationError[];
        multiline?: boolean;
        id?: string;
        type?: string;
        "wrapper-class"?: string;
    };
    Element: Input | Textarea;
}

export default class TextInput extends Component<TextInputSignature> {
    get length() {
        return this.args.value?.length || 0;
    }

    get overflow() {
        if (this.args["max-length"] != undefined) return this.length > this.args["max-length"];
        return false;
    }
}
