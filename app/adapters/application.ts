import JSONAPIAdapter from "@ember-data/adapter/json-api";
import type { AdapterPayload } from "@ember-data/legacy-compat/legacy-network-handler/minimum-adapter-interface";
import type { Store } from "@ember-data/store/-private/store-service";
import type { ModelSchema } from "@ember-data/store/-types/q/ds-model";
import ENV from "podcast-frontend/config/environment";

export default class ApplicationAdapter extends JSONAPIAdapter {
    host = ENV.APP.BACKEND_HOST;
    namespace = ENV.APP.API_URL_NAMESPACE;

    buildURL(modelName: string, id: any, snapshot: any, requestType?: any, query?: any): string {
        const url = super.buildURL(modelName, id, snapshot, requestType, query);
        return url.endsWith("/") ? url : `${url}/`;
    }

    query(store: Store, type: ModelSchema, query: Record<string, unknown>): Promise<AdapterPayload> {
        if (Array.isArray(query["include"])) {
            query["include"] = query["include"].join();
        }
        return super.query(store, type, query);
    }
}
