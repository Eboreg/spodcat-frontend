import Application from "spodcat/app";
import config from "spodcat/config/environment";
import * as QUnit from "qunit";
import { setApplication } from "@ember/test-helpers";
import { setup } from "qunit-dom";
import { loadTests } from "ember-qunit/test-loader";
import { start, setupEmberOnerrorValidation } from "ember-qunit";

setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupEmberOnerrorValidation();
loadTests();
start();
