import { module, test } from "qunit";
import { setupTest } from "podcast-frontend/tests/helpers";

module("Unit | Service | audio", function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test("it exists", function (assert) {
        const service = this.owner.lookup("service:audio");
        assert.ok(service);
    });
});
