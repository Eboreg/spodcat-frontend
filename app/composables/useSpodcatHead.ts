import type { ResolvableLink, ResolvableMeta } from "@unhead/vue";
import type { EpisodeModel, PodcastModel, PostModel } from "@/types/api";
import { SPODCAT_FAVICON, SPODCAT_LOGO } from "~/constants";
import { extractImageUrlsFromMarkdown } from "~/utils";

function stripDescription(description: string): string {
  return description
    .replaceAll(/!\[.*?\]\(.*?\)\s*/g, "") // remove image tags completely
    .replaceAll(/\[(.*?)\]\(.*?\)/g, "$1") // replace links with link text only
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
    if (podcastContent.value && podcastRef.value) {
      return `${podcastContent.value.name} | ${podcastRef.value.name}`;
    }
    if (podcastRef.value) {
      return podcastRef.value.name;
    }
    return runtimeConfig.public.siteName;
  });

  const favicon = computed(() => {
    return podcastRef.value?.favicon && podcastRef.value.favicon_content_type
      ? { href: podcastRef.value.favicon, type: podcastRef.value.favicon_content_type }
      : SPODCAT_FAVICON;
  });

  const ogUrl = computed(() => {
    const route = () => {
      if (postRef.value) return `/${postRef.value.podcast}/post/${postRef.value.slug}`;
      if (episodeRef.value) return `/${episodeRef.value.podcast}/episode/${episodeRef.value.slug}`;
      if (podcastRef.value) return `/${podcastRef.value.slug}/`;
      return "/";
    };

    return new URL(route(), runtimeConfig.public.frontendHost).toString();
  });

  const ogImage = computed(() => {
    if (episodeRef.value?.image) {
      return {
        height: episodeRef.value.image_height ?? undefined,
        url: episodeRef.value.image,
        width: episodeRef.value.image_width ?? undefined,
      };
    }
    if (podcastContent.value?.description) {
      const imageUrl = extractImageUrlsFromMarkdown(podcastContent.value.description)[0];
      if (imageUrl) return imageUrl;
    }
    if (podcastRef.value?.cover) {
      return {
        height: podcastRef.value.cover_height ?? undefined,
        url: podcastRef.value.cover,
        width: podcastRef.value.cover_width ?? undefined,
      };
    }
    return SPODCAT_LOGO;
  });

  const link = computed(() => {
    const fontFacesUrl = new URL("/font-faces/", runtimeConfig.public.backendHost);
    const l: ResolvableLink[] = [
      { rel: "shortcut icon", ...favicon.value },
      { rel: "stylesheet", href: fontFacesUrl.toString() },
    ];

    if (podcastRef.value) {
      l.push({
        href: podcastRef.value.rss_url,
        rel: "alternate",
        title: podcastRef.value.name,
        type: "application/rss+xml",
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

  const bodyAttrs = { class: runtimeConfig.public.darkMode ? "dark" : "light" };

  useHead({ link, meta, bodyAttrs });

  useSeoMeta({
    description,
    ogAudio: computed(() => episodeRef.value?.audio_url),
    ogImage,
    ogLocale: computed(() => podcastRef.value?.language),
    ogSiteName: runtimeConfig.public.siteName,
    ogType,
    ogUrl,
    title,
  });
}
