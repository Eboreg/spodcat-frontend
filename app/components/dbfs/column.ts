import Component from "@glimmer/component";
import { htmlSafe, type SafeString } from "@ember/template";

export interface DbfsColumnSignature {
    Args: {
        height: number;
        "column-count": number;
    };
    Element: HTMLDivElement;
}

export default class DbfsColumn extends Component<DbfsColumnSignature> {
    get outerStyle(): SafeString {
        return htmlSafe(`height: max(2px, ${this.args.height}%); flex-basis: ${100 / this.args["column-count"]}%`);
    }
}
