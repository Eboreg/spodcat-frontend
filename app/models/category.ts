import Model, { attr } from "@ember-data/model";
import { Type } from "@warp-drive/core-types/symbols";

export default class CategoryModel extends Model {
    @attr declare cat: string;
    @attr declare sub?: string;

    [Type] = "category" as const;
}
