import { setupTest } from "spodcat/tests/helpers";
import { module, test } from "qunit";

module("Unit | Adapter | application", function (hooks) {
    setupTest(hooks);

    // Replace this with your real tests.
    test("it exists", function (assert) {
        const adapter = this.owner.lookup("adapter:application");
        assert.ok(adapter, "adapter exists");
    });
});
