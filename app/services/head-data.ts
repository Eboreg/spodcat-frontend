import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

interface Favicon {
    url: string;
    contentType: string;
}

export default class HeadDataService extends Service {
    @tracked declare favicon: Favicon;
}

declare module "@ember/service" {
    interface Registry {
        "head-data": HeadDataService;
    }
}
