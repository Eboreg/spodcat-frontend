import { setupTest } from "spodcat/tests/helpers";
import { module, test } from "qunit";

module("Unit | Model | episode", function (hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test("it exists", function (assert) {
        const store = this.owner.lookup("service:store");
        const model = store.createRecord("episode", {});
        assert.ok(model, "model exists");
    });
});
