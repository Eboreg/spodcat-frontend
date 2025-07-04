import { module, test } from "qunit";
import { setupTest } from "spodcat/tests/helpers";

module("Unit | Route | episode", function (hooks) {
    setupTest(hooks);

    test("it exists", function (assert) {
        const route = this.owner.lookup("route:episode");
        assert.ok(route);
    });
});
