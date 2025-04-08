import Component from "@glimmer/component";
import type { Dbfs } from "./bar";
import { htmlSafe, type SafeString } from "@ember/template";

export interface DbfsColumnSignature {
    Args: {
        column: Dbfs;
        "column-count": number;
    };
    Element: HTMLDivElement;
}

export default class DbfsColumn extends Component<DbfsColumnSignature> {
    get innerClass() {
        if (this.args.column.isPlayed) return "played";
        return "unbuffered";
    }

    get outerStyle(): SafeString {
        return htmlSafe(`height: max(2px, ${this.args.column.dbfs}%); flex-basis: ${100 / this.args["column-count"]}%`);
    }
}
