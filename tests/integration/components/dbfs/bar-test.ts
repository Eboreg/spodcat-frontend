import { module, test } from "qunit";
import { setupRenderingTest } from "podcast-frontend/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | dbfs/bar", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<Dbfs::Bar />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <Dbfs::Bar>
        template block text
      </Dbfs::Bar>
    `);

        assert.dom().hasText("template block text");
    });
});
