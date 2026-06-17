import ENV from "spodcat/config/environment";
import type Store from "@ember-data/store";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type PodcastModel from "spodcat/models/podcast";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import type RouterService from "@ember/routing/router-service";

export interface PodcastAsideSignature {
    Args: {
        podcast: PodcastModel;
    };
    Blocks: {
        default: [];
    };
    Element: HTMLElement;
}

export default class PodcastAside extends Component<PodcastAsideSignature> {
    @service declare router: RouterService;
    @service declare store: Store;

    @tracked isSearchModalOpen: boolean = false;

    get showIndexLink() {
        return !ENV.APP.IS_SINGLETON;
    }

    get showPodcastLink() {
        const routeName = this.router.currentRouteName ?? "";
        return routeName.startsWith("podcast.episode") || routeName.startsWith("podcast.post");
    }

    @action openSearchModal() {
        this.isSearchModalOpen = true;
    }

    @action closeSearchModal() {
        this.isSearchModalOpen = false;
    }
}
