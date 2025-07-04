import { module, test } from "qunit";
import { setupRenderingTest } from "spodcat/tests/helpers";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | podcast/content/post-card", function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`<Podcast::Content::PostCard />`);

        assert.dom().hasText("");

        // Template block usage:
        await render(hbs`
      <Podcast::Content::PostCard>
        template block text
      </Podcast::Content::PostCard>
    `);

        assert.dom().hasText("template block text");
    });
});
