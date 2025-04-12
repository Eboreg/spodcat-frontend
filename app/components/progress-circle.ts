import type { SafeString } from "@ember/template";
import { htmlSafe } from "@ember/template";
import Component from "@glimmer/component";

export interface ProgressCircleSignature {
    Args: {
        "outer-duration"?: number;
        "inner-duration"?: number;
        "stroke-width"?: number;
    };
    Element: HTMLDivElement;
}

export default class ProgressCircle extends Component<ProgressCircleSignature> {
    get circleStyle(): SafeString {
        const rows = [
            `animation-duration: ${this.args["inner-duration"] || 1.5}s`,
            `stroke-width: ${this.args["stroke-width"] || 8}px`,
        ];
        return htmlSafe(rows.join("; "));
    }

    get svgStyle(): SafeString {
        return htmlSafe(`animation-duration: ${this.args["outer-duration"] || 2}s`);
    }
}
