import { module, test } from "qunit";
import { setupRenderingTest } from "spodcat/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | button/content", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<Button::Content />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <Button::Content>
        template block text
      </Button::Content>
    `);

        assert.dom().hasText("template block text");
    });
});
