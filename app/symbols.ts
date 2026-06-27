import type { PodcastModel } from "@/types/api";

export const podcastKey = Symbol() as InjectionKey<Ref<PodcastModel | undefined>>;
export const podcastSlugKey = Symbol() as InjectionKey<string | undefined>;
