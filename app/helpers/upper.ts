import { helper } from "@ember/component/helper";

function upper(args: [string]): string {
    return args[0].toUpperCase();
}

export default helper(upper);
