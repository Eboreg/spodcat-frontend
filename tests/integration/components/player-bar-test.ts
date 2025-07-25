import { module, test } from "qunit";
import { setupRenderingTest } from "spodcat/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | player-bar", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<PlayerBar />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <PlayerBar>
        template block text
      </PlayerBar>
    `);

        assert.dom().hasText("template block text");
    });
});
