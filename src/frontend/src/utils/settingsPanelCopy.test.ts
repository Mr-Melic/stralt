import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SETTINGS_MUTE_HINT,
  SETTINGS_PANEL_TITLE,
} from "./settingsPanelCopy.ts";

function readComponent(relativeFromUtils: string): string {
  return readFileSync(
    fileURLToPath(new URL(relativeFromUtils, import.meta.url)),
    "utf8",
  );
}

describe("sound dock display copy", () => {
  it("names the folded tab Sound, not a leftover Settings label", () => {
    assert.equal(SETTINGS_PANEL_TITLE, "Sound");
    const src = readComponent("../components/SettingsPanel.tsx");
    assert.match(src, /SETTINGS_PANEL_TITLE/);
    assert.match(src, /title=\{SETTINGS_PANEL_TITLE\}/);
    assert.equal(/title="Settings"/.test(src), false);
  });

  it("explains this dock is the only mute and keeps a 44px mute target", () => {
    assert.match(SETTINGS_MUTE_HINT, /only mute/i);
    const src = readComponent("../components/SettingsPanel.tsx");
    assert.match(src, /data-ocid="settings\.mute_hint"/);
    assert.match(src, /SETTINGS_MUTE_HINT/);
    assert.match(src, /minHeight: 44/);
    assert.match(src, /stone-touch-target/);
  });
});
