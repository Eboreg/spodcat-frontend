import { module, test } from "qunit";
import { setupRenderingTest } from "spodcat/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | playback-speed-control", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<PlaybackSpeedControl />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <PlaybackSpeedControl>
        template block text
      </PlaybackSpeedControl>
    `);

        assert.dom().hasText("template block text");
    });
});
