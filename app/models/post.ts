import { Type } from "@warp-drive/core-types/symbols";
import PodcastContentModel from "./podcast-content";

export default class PostModel extends PodcastContentModel {
    get isPost() {
        return true;
    }

    [Type] = "post" as const;
}
