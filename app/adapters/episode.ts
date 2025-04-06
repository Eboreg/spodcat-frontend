import type { AdapterPayload } from "@ember-data/legacy-compat/legacy-network-handler/minimum-adapter-interface";
import type { Store } from "@ember-data/store/-private/store-service";
import type { ModelSchema } from "@ember-data/store/-types/q/ds-model";
import ApplicationAdapter from "./application";

export default class EpisodeAdapter extends ApplicationAdapter {
    async query(
        store: Store,
        type: ModelSchema,
        query: { include?: string[] | string; filter: { podcast: string; slug: string } },
    ): Promise<AdapterPayload> {
        const key = this.cacheKeyFor(type.modelName, `${query.filter.podcast}-${query.filter.slug}`);

        if (Array.isArray(query["include"])) {
            query["include"] = query["include"].join();
        }

        if (this.fastboot.isFastBoot) {
            const result = await super.query(store, type, query);

            this.saveToShoebox(result, key);
            return result;
        }

        const json = this.fastboot.shoebox.retrieve(key) as string | undefined;
        let result: AdapterPayload | undefined;

        if (json) result = JSON.parse(json) as AdapterPayload | undefined;
        if (!result) result = await super.query(store, type, query);

        return result;
    }
}
