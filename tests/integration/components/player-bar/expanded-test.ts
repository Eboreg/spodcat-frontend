import { module, test } from "qunit";
import { setupRenderingTest } from "spodcat/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | player-bar/expanded", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<PlayerBar::Expanded />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <PlayerBar::Expanded>
        template block text
      </PlayerBar::Expanded>
    `);

        assert.dom().hasText("template block text");
    });
});
