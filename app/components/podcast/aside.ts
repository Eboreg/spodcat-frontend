import ENV from "podcast-frontend/config/environment";
import type Store from "@ember-data/store";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import type PodcastModel from "podcast-frontend/models/podcast";

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
    @service declare store: Store;

    get showIndexLink() {
        return !ENV.APP.IS_SINGLETON;
    }
}
