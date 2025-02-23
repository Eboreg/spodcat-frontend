import type { SafeString } from "@ember/template";
import { htmlSafe } from "@ember/template";
import Component from "@glimmer/component";

export interface ProgressCircleSignature {
    Args: {
        "outer-duration"?: number;
        "inner-duration"?: number;
        color?: string;
        "stroke-width"?: number;
    };
    Element: HTMLDivElement;
}

export default class ProgressCircle extends Component<ProgressCircleSignature> {
    get svgStyle(): SafeString {
        return htmlSafe(`animation-duration: ${this.args["outer-duration"] || 2}s`);
    }

    get circleStyle(): SafeString {
        const rows = [
            `animation-duration: ${this.args["inner-duration"] || 1.5}s`,
            `stroke: ${this.args.color || "var(--mm-text-color)"}`,
            `stroke-width: ${this.args["stroke-width"] || 5}px`,
        ];
        return htmlSafe(rows.join("; "));
    }
}
