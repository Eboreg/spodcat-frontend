import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export interface Favicon {
    url: string;
    contentType: string;
}

export interface Rss {
    title: string;
    url: string;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export default class HeadDataService extends Service {
    @tracked declare favicon?: Favicon;
    @tracked declare ogDescription?: string;
    @tracked declare ogTitle?: string;
    @tracked declare ogImage?: Image;
    @tracked declare rss?: Rss;
}

declare module "@ember/service" {
    interface Registry {
        "head-data": HeadDataService;
    }
}
