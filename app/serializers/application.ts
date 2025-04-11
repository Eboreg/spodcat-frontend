import JSONAPISerializer from "@ember-data/serializer/json-api";

export default class ApplicationSerializer extends JSONAPISerializer {
    payloadKeyFromModelName(modelName: string) {
        // Don't want to play along with Ember's ridiculously opinionated
        // juggling of singular and plural forms here and there. Singular all
        // the way!
        return modelName;
    }
}
