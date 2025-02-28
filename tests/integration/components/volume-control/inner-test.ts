import { module, test } from "qunit";
import { setupRenderingTest } from "podcast-frontend/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | volume-control/inner", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<VolumeControl::Inner />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <VolumeControl::Inner>
        template block text
      </VolumeControl::Inner>
    `);

        assert.dom().hasText("template block text");
    });
});
