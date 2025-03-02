import { module, test } from "qunit";
import { setupRenderingTest } from "podcast-frontend/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | podcast/content/description", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<Podcast::Content::Description />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <Podcast::Content::Description>
        template block text
      </Podcast::Content::Description>
    `);

        assert.dom().hasText("template block text");
    });
});
