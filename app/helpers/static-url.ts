import { helper } from "@ember/component/helper";
import config from "podcast-frontend/config/environment";

export function staticUrl(path: string): string {
    return config.rootURL.replace(/\/*$/, "") + "/" + path.replace(/^\/*/, "");
}

export default helper(function (args: [string]) {
    return staticUrl(args[0]);
});
