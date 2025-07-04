import { setupTest } from "spodcat/tests/helpers";
import { module, test } from "qunit";

module("Unit | Model | podcast content", function (hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test("it exists", function (assert) {
        const store = this.owner.lookup("service:store");
        const model = store.createRecord("podcast-content", {});
        assert.ok(model, "model exists");
    });
});
