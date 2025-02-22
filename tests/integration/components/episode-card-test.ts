import { module, test } from "qunit";
import { setupRenderingTest } from "podcast-frontend/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | episode-card", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<EpisodeCard />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <EpisodeCard>
        template block text
      </EpisodeCard>
    `);

        assert.dom().hasText("template block text");
    });
});
