import JSONAPIAdapter from "@ember-data/adapter/json-api";
import type { AdapterPayload } from "@ember-data/legacy-compat/legacy-network-handler/minimum-adapter-interface";
import type { Snapshot } from "@ember-data/legacy-compat/legacy-network-handler/snapshot";
import type { SnapshotRecordArray } from "@ember-data/legacy-compat/legacy-network-handler/snapshot-record-array";
import type { Store } from "@ember-data/store/-private/store-service";
import type { ModelSchema } from "@ember-data/store/-types/q/ds-model";
import type { HTTPMethod } from "@warp-drive/core-types/request";
import type FastBoot from "ember-cli-fastboot/services/fastboot";
import ENV from "podcast-frontend/config/environment";

export default class ApplicationAdapter extends JSONAPIAdapter {
    // @ts-ignore
    declare fastboot: FastBoot;

    host = ENV.APP.BACKEND_HOST;
    namespace = ENV.APP.API_URL_NAMESPACE;
    // @ts-ignore
    coalesceFindRequests = true;

    ajax(url: string, type: HTTPMethod, options?: any): Promise<AdapterPayload> {
        // Appending trailing slash here instead of in buildURL(). Reason?
        // Because groupRecordsForFindMany() will not work properly otherwise.
        if (!url.endsWith("/")) url += "/";
        return super.ajax(url, type, options);
    }

    buildURL(modelName: string, id: any, snapshot: any, requestType?: any, query?: any): string {
        if (query && Array.isArray(query["include"])) {
            query["include"] = query["include"].join();
        }

        return super.buildURL(modelName, id, snapshot, requestType, query);
    }

    cacheKeyFor(modelName: string, id?: string) {
        return modelName && id ? `${modelName}-${id}` : `${modelName}-all`;
    }

    findAll(
        store: Store,
        type: ModelSchema,
        sinceToken: null,
        snapshotRecordArray: SnapshotRecordArray,
    ): Promise<AdapterPayload> {
        const key = this.cacheKeyFor(type.modelName);

        return this.getPayload(key, () => {
            return super.findAll(store, type, sinceToken, snapshotRecordArray);
        });
    }

    async findRecord(store: Store, type: ModelSchema, id: string, snapshot: Snapshot): Promise<AdapterPayload> {
        const key = this.cacheKeyFor(type.modelName, id);

        return this.getPayload(key, () => {
            return super.findRecord(store, type, id, snapshot);
        });
    }

    async getPayload(key: string, getter: () => Promise<AdapterPayload>): Promise<AdapterPayload> {
        if (this.fastboot.isFastBoot) {
            const result = await getter();

            this.saveToShoebox(result, key);
            return result;
        }

        const json = this.fastboot.shoebox.retrieve(key) as string | undefined;

        if (json) {
            const result = JSON.parse(json) as AdapterPayload | undefined;
            if (result) return result;
        }

        return getter();
    }

    async query(store: Store, type: ModelSchema, query: Record<string, any>): Promise<AdapterPayload> {
        if (["post", "episode"].includes(type.modelName)) {
            const key = this.cacheKeyFor(
                type.modelName,
                `${query["filter"].podcast}-${query["filter"][type.modelName]}`,
            );

            return this.getPayload(key, () => {
                return super.query(store, type, query);
            });
        }

        return super.query(store, type, query);
    }

    saveToShoebox(payload: Record<string, unknown> | unknown[], key: string) {
        this.fastboot.shoebox.put(key, JSON.stringify(payload));
    }
}
