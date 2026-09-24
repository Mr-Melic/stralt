import assert from "node:assert/strict";
import { adminLivePublishSpec } from "./adminLivePublish.ts";

assert.equal(adminLivePublishSpec(undefined), null);
assert.equal(adminLivePublishSpec("admin.spell.save_button"), null);

const tier = adminLivePublishSpec("admin.tier.save_button");
assert.equal(tier?.ocidPrefix, "admin.tier.publish");
assert.equal(tier?.body.includes("not a browser draft"), true);

const level = adminLivePublishSpec("admin.levelup.save_button");
assert.equal(level?.title.includes("level-up"), true);

const palette = adminLivePublishSpec("admin.visuals.save_button");
assert.equal(palette?.body.includes("canister immediately"), true);

const doka = adminLivePublishSpec("admin.doka.save_config_button");
assert.equal(doka?.body.includes("ground Doka"), true);
