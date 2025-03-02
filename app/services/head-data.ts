import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type PodcastModel from "podcast-frontend/models/podcast";
import type PodcastContentModel from "podcast-frontend/models/podcast-content";

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

    updateFromPodcastContent(value: PodcastContentModel) {
        this.ogTitle = `${value.name} | ${value.podcast.name}`;
        this.ogDescription = value.description || value.podcast.tagline;
        this.updateFromPodcastBase(value.podcast);
    }

    updateFromPodcast(value: PodcastModel) {
        this.ogTitle = value.name;
        this.ogDescription = value.tagline;
        this.updateFromPodcastBase(value);
    }

    updateFromPodcastBase(value: PodcastModel) {
        this.favicon = value.faviconData;
        this.ogImage = value.bannerData;
        this.rss = value.rssData;
    }
}

declare module "@ember/service" {
    interface Registry {
        "head-data": HeadDataService;
    }
}
