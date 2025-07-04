import { module, test } from "qunit";
import { setupTest } from "spodcat/tests/helpers";

module("Unit | Route | podcast", function (hooks) {
    setupTest(hooks);

    test("it exists", function (assert) {
        const route = this.owner.lookup("route:podcast");
        assert.ok(route);
    });
});
