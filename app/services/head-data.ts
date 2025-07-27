import ENV from "spodcat/config/environment";
import type RouterService from "@ember/routing/router-service";
import Service from "@ember/service";
import { service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import type EpisodeModel from "spodcat/models/episode";
import type PodcastModel from "spodcat/models/podcast";
import type PostModel from "spodcat/models/post";
import { makeAbsoluteUrl, trimString, urljoin } from "spodcat/utils";
import type { Favicon, Rss, Image } from "global";

export default class HeadDataService extends Service {
    @service declare router: RouterService;

    @tracked _podcast?: PodcastModel;
    @tracked _episode?: EpisodeModel;
    @tracked _post?: PostModel;
    @tracked _extractedImageUrls?: string[];

    fontFaceUrl = urljoin(ENV.APP.BACKEND_HOST, "font-faces");
    siteName = ENV.APP.SITE_NAME;

    get extractedImage(): Image | undefined {
        return this._extractedImageUrls && this._extractedImageUrls[0]
            ? { url: this._extractedImageUrls[0] }
            : undefined;
    }

    get favicon(): Favicon {
        return this._podcast?.faviconData || { url: "/spodcat-favicon.png", contentType: "image/png" };
    }

    get musicDuration(): string | undefined {
        return this._episode?.["duration-seconds"]?.toString();
    }

    get musicReleaseDate(): string | undefined {
        return this._episode?.published?.toISOString();
    }

    get ogAudio(): string | undefined {
        return this._episode?.["audio-url"];
    }

    get ogAudioType(): string | undefined {
        return this._episode?.["audio-content-type"];
    }

    get ogDescription(): string | undefined {
        return this._episode?.strippedDescription || this._post?.strippedDescription || this._podcast?.tagline;
    }

    get ogImage(): Image | undefined {
        return this._episode?.imageData || this.extractedImage || this._podcast?.bannerData;
    }

    get ogLocale(): string {
        return this._podcast?.language || ENV.APP.LOCALE;
    }

    get ogTitle(): string {
        const podcastContent = this._episode || this._post;

        return podcastContent
            ? `${podcastContent.name} | ${podcastContent.podcast.name}`
            : this._podcast?.name || ENV.APP.SITE_NAME;
    }

    get ogType(): string {
        if (this._post) return "article";
        if (this._episode) return "music.song";
        return "website";
    }

    get ogUrl(): string {
        if (ENV.APP.IS_SINGLETON) {
            if (this._post) return makeAbsoluteUrl(this.router.urlFor("post", this._post.slug));
            if (this._episode) return makeAbsoluteUrl(this.router.urlFor("episode", this._episode.slug));
        } else {
            if (this._post)
                return makeAbsoluteUrl(this.router.urlFor("podcast.post", this._post.podcast, this._post.slug));
            if (this._episode)
                return makeAbsoluteUrl(
                    this.router.urlFor("podcast.episode", this._episode.podcast, this._episode.slug),
                );
            if (this._podcast) return makeAbsoluteUrl(this.router.urlFor("podcast", this._podcast));
        }

        return makeAbsoluteUrl(this.router.urlFor("home"));
    }

    get rss(): Rss | undefined {
        return this._podcast?.rssData;
    }

    get twitterDescription(): string | undefined {
        return this.ogDescription ? trimString(this.ogDescription, 200) : undefined;
    }

    get twitterTitle(): string {
        return trimString(this.ogTitle, 70);
    }

    reset() {
        this._podcast = undefined;
        this._episode = undefined;
        this._post = undefined;
        this._extractedImageUrls = undefined;
    }

    setEpisode(value: EpisodeModel) {
        this.reset();
        this._podcast = value.podcast;
        this._episode = value;
        this._extractedImageUrls = value.extractImageUrls();
    }

    setPodcast(value: PodcastModel) {
        this.reset();
        this._podcast = value;
    }

    setPost(value: PostModel) {
        this.reset();
        this._podcast = value.podcast;
        this._post = value;
        this._extractedImageUrls = value.extractImageUrls();
    }
}

declare module "@ember/service" {
    interface Registry {
        "head-data": HeadDataService;
    }
}
