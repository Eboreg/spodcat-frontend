import EmberRouter from "@ember/routing/router";
import config from "podcast-frontend/config/environment";

export default class Router extends EmberRouter {
    location = config.locationType;
    rootURL = config.rootURL;
}

Router.map(function () {
    this.route("home", { path: "/" });
    this.route("podcast", { path: "/:podcast_id" }, function () {
        this.route("episode", function () {
            this.route("draft", { path: "/draft/:episode_id" });
            this.route("index", { path: "/:episode_slug" });
        });

        this.route("post", function () {
            this.route("draft", { path: "/draft/:post_id" });
            this.route("index", { path: "/:post_slug" });
        });

        this.route("index", { path: "/" });
    });
    this.route("404", { path: "/*path" });
    this.route("404");
});
