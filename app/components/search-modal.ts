import { type EmberRunTimer } from "@ember/runloop/types";
import type Store from "@ember-data/store";
import { type NativeArray, A } from "@ember/array";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { cancelTask, runTask } from "ember-lifeline";
import type EpisodeModel from "spodcat/models/episode";
import type PodcastContentModel from "spodcat/models/podcast-content";
import PostModel from "spodcat/models/post";
import type RouterService from "@ember/routing/router-service";

export interface SearchModalSignature {
    Args: {
        "on-dismiss-request": () => void;
    };
    Blocks: {
        default: [];
    };
}

export default class SearchModal extends Component<SearchModalSignature> {
    @service declare store: Store;
    @service declare router: RouterService;

    @tracked __episodeResults: NativeArray<EpisodeModel> = A();
    @tracked __postResults: NativeArray<PostModel> = A();
    @tracked __activeIdx: number = 0;
    @tracked term: string = "";

    __episodeSearchId?: EmberRunTimer | number;
    __postSearchId?: EmberRunTimer | number;

    get activeIdx(): number {
        return Math.min(this.__activeIdx, this.results.length - 1);
    }

    get results(): PodcastContentModel[] {
        return [...this.__episodeResults, ...this.__postResults].sort(
            (o1, o2) => o2.published.getTime() - o1.published.getTime(),
        ) as PodcastContentModel[];
    }

    get showMinCharsText(): boolean {
        return this.term.length > 0 && this.term.length < 3 && this.results.length == 0;
    }

    @action onInput(event: InputEvent) {
        if (event.target instanceof HTMLInputElement) {
            const previousTerm = this.term;
            this.term = event.target.value;

            if (this.term.length >= 3) {
                if (this.__episodeSearchId) cancelTask(this, this.__episodeSearchId as EmberRunTimer);
                if (this.__postSearchId) cancelTask(this, this.__postSearchId as EmberRunTimer);
                this.__episodeSearchId = runTask(this, async () => {
                    this.__episodeResults.setObjects(
                        await this.store.query<EpisodeModel>("episode", { filter: { freetext: this.term } }),
                    );
                });
                this.__postSearchId = runTask(this, async () => {
                    this.__postResults.setObjects(
                        await this.store.query<PostModel>("post", { filter: { freetext: this.term } }),
                    );
                });
            } else if (this.term.length >= previousTerm.length) {
                this.__episodeResults.clear();
                this.__postResults.clear();
            }
        }
    }

    @action onInputInsert(elem: HTMLElement) {
        elem.focus();
    }

    @action onKeyDown(event: KeyboardEvent) {
        let shouldScroll = false;

        if (event.key == "ArrowUp") {
            event.preventDefault();
            if (this.__activeIdx == 0) this.__activeIdx = Math.max(this.results.length - 1, 0);
            else this.__activeIdx = this.activeIdx - 1;
            shouldScroll = true;
        } else if (event.key == "ArrowDown") {
            event.preventDefault();
            if (this.__activeIdx >= this.results.length - 1) this.__activeIdx = 0;
            else this.__activeIdx = this.activeIdx + 1;
            shouldScroll = true;
        } else if (event.key == "Enter") {
            const result = this.results[this.activeIdx];

            event.preventDefault();
            if (result) {
                this.router.transitionTo(result.route, ...result.routeModels);
                this.args["on-dismiss-request"]();
            }
        } else if (event.key == "Escape") {
            event.preventDefault();
            this.args["on-dismiss-request"]();
        }

        if (event.currentTarget instanceof HTMLElement && shouldScroll) {
            event.currentTarget
                .querySelector(`.search-results .search-result:nth-child(${this.activeIdx + 1})`)
                ?.scrollIntoView({ block: "nearest" });
        }
    }
}
