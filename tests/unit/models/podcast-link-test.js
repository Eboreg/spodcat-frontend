import { setupTest } from "podcast-frontend/tests/helpers";
import { module, test } from "qunit";

module("Unit | Model | podcast link", function (hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test("it exists", function (assert) {
        const store = this.owner.lookup("service:store");
        const model = store.createRecord("podcast-link", {});
        assert.ok(model, "model exists");
    });
});
