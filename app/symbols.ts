import type { PodcastModel } from "@/types/api";

export const podcastKey = Symbol("Podcast") as InjectionKey<Ref<PodcastModel | undefined>>;
export const podcastSlugKey = Symbol("Podcast slug") as InjectionKey<string | undefined>;
