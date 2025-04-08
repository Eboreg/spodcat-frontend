import { action } from "@ember/object";
import Route from "@ember/routing/route";

export default class ApplicationRoute extends Route {
    @action error(error: any) {
        console.log(error);
        return true;
    }
}
