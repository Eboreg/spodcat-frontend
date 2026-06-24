import type { PodcastModel } from "@/types/api";
import type { InjectionKey } from "vue";

export const podcastKey = Symbol() as InjectionKey<Ref<PodcastModel | undefined>>;
export const podcastSlugKey = Symbol() as InjectionKey<string | undefined>;
