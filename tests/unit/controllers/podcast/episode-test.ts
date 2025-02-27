import { module, test } from "qunit";
import { setupTest } from "podcast-frontend/tests/helpers";

module("Unit | Controller | podcast/episode", function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test("it exists", function (assert) {
        const controller = this.owner.lookup("controller:podcast/episode");
        assert.ok(controller);
    });
});
