import { module, test } from "qunit";
import { setupTest } from "spodcat/tests/helpers";

module("Unit | Service | head-data", function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test("it exists", function (assert) {
        const service = this.owner.lookup("service:head-data");
        assert.ok(service);
    });
});
