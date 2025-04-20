import JSONAPIAdapter from "@ember-data/adapter/json-api";
import type { AdapterPayload } from "@ember-data/legacy-compat/legacy-network-handler/minimum-adapter-interface";
import type { Snapshot } from "@ember-data/legacy-compat/legacy-network-handler/snapshot";
import type { Store } from "@ember-data/store/-private/store-service";
import type { ModelSchema } from "@ember-data/store/-types/q/ds-model";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import ENV from "podcast-frontend/config/environment";

export default class ApplicationAdapter extends JSONAPIAdapter {
    // @ts-ignore
    declare fastboot: FastBoot;

    host = ENV.APP.BACKEND_HOST;
    namespace = ENV.APP.API_URL_NAMESPACE;

    buildURL(modelName: string, id: any, snapshot: any, requestType?: any, query?: any): string {
        if (query && Array.isArray(query["include"])) {
            query["include"] = query["include"].join();
        }

        const url = super.buildURL(modelName, id, snapshot, requestType, query);

        return url.endsWith("/") ? url : `${url}/`;
    }

    cacheKeyFor(modelName: string, id?: string) {
        return modelName && id ? `${modelName}-${id}` : `${modelName}-default-store`;
    }

    async findRecord(store: Store, type: ModelSchema, id: string, snapshot: Snapshot): Promise<AdapterPayload> {
        const key = this.cacheKeyFor(type.modelName, id);

        if (this.fastboot.isFastBoot) {
            const result = await super.findRecord(store, type, id, snapshot);

            this.saveToShoebox(result, key);
            return result;
        }

        const json = this.fastboot.shoebox.retrieve(key) as string | undefined;
        let result: AdapterPayload | undefined;

        if (json) result = JSON.parse(json) as AdapterPayload | undefined;
        if (!result) result = await super.findRecord(store, type, id, snapshot);

        return result;
    }

    async query(store: Store, type: ModelSchema, query: Record<string, any>): Promise<AdapterPayload> {
        if (["post", "episode"].includes(type.modelName)) {
            const key = this.cacheKeyFor(type.modelName, `${query["filter"].podcast}-${query["filter"].slug}`);

            if (this.fastboot.isFastBoot) {
                const result = await super.query(store, type, query);

                this.saveToShoebox(result, key);
                return result;
            }

            const json = this.fastboot.shoebox.retrieve(key) as string | undefined;

            if (json) {
                const result = JSON.parse(json) as AdapterPayload | undefined;
                if (result) return result;
            }
        }

        return super.query(store, type, query);
    }

    saveToShoebox(payload: Record<string, unknown> | unknown[], key: string) {
        this.fastboot.shoebox.put(key, JSON.stringify(payload));
    }
}
