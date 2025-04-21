import ENV from "podcast-frontend/config/environment";
import type RouterService from "@ember/routing/router-service";
import Service from "@ember/service";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "podcast-frontend/models/episode";
import type PodcastModel from "podcast-frontend/models/podcast";
import type PodcastContentModel from "podcast-frontend/models/podcast-content";
import type PostModel from "podcast-frontend/models/post";
import { makeAbsoluteUrl, trimString } from "podcast-frontend/utils";
import type { Size } from "global";

export interface Favicon {
    url: string;
    contentType: string;
}

export interface Rss {
    title: string;
    url: string;
}

export default class HeadDataService extends Service {
    @service declare router: RouterService;

    @tracked declare favicon?: Favicon;
    @tracked declare musicDuration?: string;
    @tracked declare musicReleaseDate?: string;
    @tracked declare ogAudio?: string;
    @tracked declare ogAudioType?: string;
    @tracked declare ogDescription?: string;
    @tracked declare ogImage?: string;
    @tracked declare ogImageSize?: Size;
    @tracked declare ogLocale?: string;
    @tracked declare ogTitle?: string;
    @tracked ogType: string = "website";
    @tracked declare ogUrl?: string;
    @tracked declare rss?: Rss;
    @tracked declare twitterDescription?: string;
    @tracked declare twitterTitle?: string;

    #updateFromPodcastBase(value: PodcastModel) {
        this.favicon = value.faviconData;
        this.rss = value.rssData;
        this.ogLocale = value.language;
        if (this.ogTitle) this.twitterTitle = trimString(this.ogTitle, 70);
        if (this.ogDescription) this.twitterDescription = trimString(this.ogDescription, 200);
    }

    #updateFromPodcastContent(value: PodcastContentModel) {
        const imageUrls = value.extractImageUrls();

        if (!this.ogImage) {
            if (imageUrls.length > 0) {
                this.ogImage = imageUrls[0];
            } else {
                this.ogImage = value.podcast.banner;
                this.ogImageSize = value.podcast.bannerSize;
            }
        }

        this.ogTitle = `${value.name} | ${value.podcast.name}`;
        this.ogDescription = value.strippedDescription || value.podcast.tagline;
        this.#updateFromPodcastBase(value.podcast);
    }

    updateFromEpisode(value: EpisodeModel) {
        this.ogAudio = value["audio-url"];
        this.ogAudioType = value["audio-content-type"];
        this.musicDuration = value["duration-seconds"].toString();
        this.musicReleaseDate = value.published.toISOString();
        this.ogType = "music.song";

        if (value.imageData && value.imageData.width >= 200 && value.imageData.height >= 200) {
            this.ogImage = value.imageData.url;
            this.ogImageSize = value.imageData;
        }

        if (ENV.APP.IS_SINGLETON) this.ogUrl = makeAbsoluteUrl(this.router.urlFor("episode", value.slug));
        else this.ogUrl = makeAbsoluteUrl(this.router.urlFor("podcast.episode", value.podcast, value.slug));

        this.#updateFromPodcastContent(value as PodcastContentModel);
    }

    updateFromPodcast(value: PodcastModel) {
        this.ogTitle = value.name;
        this.ogDescription = value.tagline;
        this.ogImage = value.banner;
        this.ogImageSize = value.bannerSize;

        if (ENV.APP.IS_SINGLETON) this.ogUrl = makeAbsoluteUrl(this.router.urlFor("home"));
        else this.ogUrl = makeAbsoluteUrl(this.router.urlFor("podcast", value));

        this.#updateFromPodcastBase(value);
    }

    updateFromPost(value: PostModel) {
        this.ogType = "article";

        if (ENV.APP.IS_SINGLETON) this.ogUrl = makeAbsoluteUrl(this.router.urlFor("post", value.slug));
        else this.ogUrl = makeAbsoluteUrl(this.router.urlFor("podcast.post", value.podcast, value.slug));

        this.#updateFromPodcastContent(value as PodcastContentModel);
    }
}

declare module "@ember/service" {
    interface Registry {
        "head-data": HeadDataService;
    }
}
