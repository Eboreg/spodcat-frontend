import type { PodcastModel } from "@/types/api";
import type { InjectionKey, Ref } from "vue";

export const podcastKey = Symbol() as InjectionKey<Ref<PodcastModel | undefined>>;
