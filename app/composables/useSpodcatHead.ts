import type { EpisodeModel, PodcastModel, PostModel } from "@/types/api";
import type { ResolvableLink, ResolvableMeta } from "@unhead/vue";
import type { Image } from "@/types";

function extractImageUrl(description: string): string | undefined {
  return [...description.matchAll(/!\[.*?]\((?<url>.*?)\)/g)].map((m) => m.groups!["url"]!)[0];
}

function imageData(url: string, width?: number | null, height?: number | null): Image {
  return { url, width: width ?? undefined, height: height ?? undefined };
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
  podcast?: MaybeRefOrGetter<PodcastModel | undefined>;
  episode?: MaybeRefOrGetter<EpisodeModel | undefined>;
  post?: MaybeRefOrGetter<PostModel | undefined>;
} = {}) {
  const podcastRef = toRef(podcast);
  const episodeRef = toRef(episode);
  const postRef = toRef(post);
  const runtimeConfig = useRuntimeConfig();
  const podcastContent = computed(() => episodeRef.value ?? postRef.value);

  const title = computed(() => {
    if (podcastContent.value && podcastRef.value)
      return `${podcastContent.value.name} | ${podcastRef.value.name}`;
    if (podcastRef.value) return podcastRef.value.name;
    return runtimeConfig.public.siteName;
  });

  const favicon = computed(() => {
    return podcastRef.value?.favicon && podcastRef.value.favicon_content_type
      ? { href: podcastRef.value.favicon, type: podcastRef.value.favicon_content_type }
      : { href: "/img/spodcat-favicon.png", type: "image/png" };
  });

  const ogUrl = computed(() => {
    let route: string;

    if (postRef.value) route = `/${postRef.value.podcast}/post/${postRef.value.slug}`;
    else if (episodeRef.value)
      route = `/${episodeRef.value.podcast}/episode/${episodeRef.value.slug}`;
    else if (podcastRef.value) route = `/${podcastRef.value.slug}/`;
    else route = "/";

    return new URL(route, runtimeConfig.public.frontendHost).toString();
  });

  const ogImage = computed(() => {
    if (episodeRef.value?.image) {
      return imageData(
        episodeRef.value.image,
        episodeRef.value.image_width,
        episodeRef.value.image_height,
      );
    }
    if (podcastContent.value?.description) {
      const imageUrl = extractImageUrl(podcastContent.value.description);
      if (imageUrl) return imageUrl;
    }
    if (podcastRef.value?.cover) {
      return imageData(
        podcastRef.value.cover,
        podcastRef.value.cover_width,
        podcastRef.value.cover_height,
      );
    }
    return "/img/spodcat-favicon.png";
  });

  const link = computed(() => {
    const fontFacesUrl = new URL("/font-faces/", runtimeConfig.public.backendHost);
    const l: ResolvableLink[] = [
      { rel: "shortcut icon", ...favicon.value },
      { rel: "stylesheet", href: fontFacesUrl.toString() },
    ];

    if (podcastRef.value) {
      l.push({
        rel: "alternate",
        type: "application/rss+xml",
        title: podcastRef.value.name,
        href: podcastRef.value.rss_url,
      });
    }
    return l;
  });

  const meta: ComputedRef<ResolvableMeta[]> = computed(() => {
    if (episodeRef.value) {
      return [
        { name: "music:duration", content: episodeRef.value.duration_seconds.toString() },
        { name: "music:release_date", content: episodeRef.value.published },
      ];
    }
    return [];
  });

  const ogType = computed(() => {
    if (episodeRef.value) return "music.song";
    if (postRef.value) return "article";
    return "website";
  });

  const description = computed(() => {
    if (episodeRef.value?.description) return stripDescription(episodeRef.value.description);
    if (postRef.value?.description) return stripDescription(postRef.value.description);
    if (podcastRef.value) return podcastRef.value.tagline;
    return "This is a podcast platform.";
  });

  useHead({ link, meta });

  useSeoMeta({
    ogSiteName: runtimeConfig.public.siteName,
    ogType,
    title,
    ogUrl,
    description,
    ogAudio: computed(() => episodeRef.value?.audio_url),
    ogLocale: computed(() => podcastRef.value?.language),
    ogImage,
  });
}
