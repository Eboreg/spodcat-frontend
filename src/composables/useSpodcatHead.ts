import type { EpisodeModel, PodcastModel, PostModel } from "@/types/api";
import { type ResolvableLink, type ResolvableMeta, useHead, useSeoMeta } from "@unhead/vue";
import { makeAbsoluteUrl } from "@/utils";
import type { Image } from "@/types";
import { type ComputedRef, type Ref, computed } from "vue";
import spodcatFavicon from "@/assets/spodcat-favicon.png";

function extractImageUrl(description: string): string | undefined {
  return [...description.matchAll(/!\[.*?]\((?<url>.*?)\)/g)].map((m) => m.groups!["url"]!)[0];
}

function imageData(url: string, width?: number | null, height?: number | null): Image {
  return { url, size: width && height ? { width, height } : undefined };
}

function stripDescription(description: string): string {
  return description
    .replaceAll(/!\[.*?]\(.*?\)\s*/g, "") // remove image tags completely
    .replaceAll(/\[(.*?)]\(.*?\)/g, "$1") // replace links with link text only
    .replaceAll(/\s+/g, " ") // replace all whitespace sequences with single spaces
    .trim();
}

export default function useSpodcatHead({
  podcast,
  episode,
  post,
}: {
  podcast?: Ref<PodcastModel | undefined>;
  episode?: Ref<EpisodeModel | undefined>;
  post?: Ref<PostModel | undefined>;
} = {}) {
  const podcastContent = computed(() => episode?.value ?? post?.value);

  const title = computed(() => {
    const _podcastContent = podcastContent.value;
    const _podcast = podcast?.value;

    return _podcastContent && _podcast
      ? `${_podcastContent.name} | ${_podcast.name}`
      : _podcast
        ? _podcast.name
        : import.meta.env.VITE_SITE_NAME;
  });

  const favicon = computed(() => {
    const _podcast = podcast?.value;

    return _podcast?.favicon && _podcast.favicon_content_type
      ? { href: _podcast.favicon, type: _podcast.favicon_content_type }
      : { href: spodcatFavicon, type: "image/png" };
  });

  const ogUrl = computed(() => {
    const _post = post?.value;
    const _episode = episode?.value;
    const _podcast = podcast?.value;

    const route = _post
      ? `/${_post.podcast}/post/${_post.slug}`
      : _episode
        ? `/${_episode.podcast}/episode/${_episode.slug}`
        : _podcast
          ? `/${_podcast.slug}/`
          : "/";

    return makeAbsoluteUrl(route);
  });

  const ogImage = computed(() => {
    const _episode = episode?.value;
    const _podcastContent = podcastContent.value;

    if (_episode?.image)
      return imageData(_episode.image, _episode.image_width, _episode.image_height);
    if (_podcastContent?.description) {
      const imageUrl = extractImageUrl(_podcastContent.description);
      if (imageUrl) return imageUrl;
    }
    return undefined;
  });

  const link = computed(() => {
    const fontFacesUrl = new URL("/font-faces/", import.meta.env.VITE_BACKEND_HOST);
    const l: ResolvableLink[] = [
      { rel: "shortcut icon", ...favicon.value },
      { rel: "stylesheet", href: fontFacesUrl.toString() },
    ];
    const _podcast = podcast?.value;

    if (_podcast) {
      l.push({
        rel: "alternate",
        type: "application/rss+xml",
        title: _podcast.name,
        href: _podcast.rss_url,
      });
    }
    return l;
  });

  const meta: ComputedRef<ResolvableMeta[]> = computed(() => {
    const _episode = episode?.value;

    if (_episode) {
      return [
        { name: "music:duration", content: _episode.duration_seconds.toString() },
        { name: "music:release_date", content: _episode.published },
      ];
    }
    return [];
  });

  const ogType = computed(() => {
    const _episode = episode?.value;
    const _post = post?.value;

    return _post ? "article" : _episode ? "music.song" : "website";
  });

  const description = computed(() => {
    const _episode = episode?.value;
    const _post = post?.value;
    const _podcast = podcast?.value;

    return _episode?.description
      ? stripDescription(_episode.description)
      : _post?.description
        ? stripDescription(_post.description)
        : _podcast?.tagline;
  });

  useHead({ link, meta });

  useSeoMeta({
    ogSiteName: import.meta.env.VITE_SITE_NAME,
    ogType,
    title,
    ogUrl,
    description,
    ogAudio: computed(() => episode?.value?.audio_url),
    ogLocale: computed(() => podcast?.value?.language),
    ogImage,
  });
}
