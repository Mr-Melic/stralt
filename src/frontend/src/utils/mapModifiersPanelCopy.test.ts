import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MAP_MODIFIERS_PANEL_TITLE,
  MAP_MODIFIERS_PANEL_WHY,
  shouldShowMapModifiersPanel,
} from "./mapModifiersPanelCopy.ts";

const panelSource = readFileSync(
  fileURLToPath(
    new URL("../components/MapModifiersPanel.tsx", import.meta.url),
  ),
  "utf8",
);

describe("mapModifiersPanelCopy", () => {
  it("hides the HUD chrome when this visit rolled no effects", () => {
    assert.equal(shouldShowMapModifiersPanel([]), false);
    assert.equal(
      shouldShowMapModifiersPanel([{ id: "1", name: "Blood Moon" }]),
      true,
    );
  });

  it("uses one Map Effects name and a this-visit why line", () => {
    assert.equal(MAP_MODIFIERS_PANEL_TITLE, "Map Effects");
    assert.match(MAP_MODIFIERS_PANEL_WHY, /whole map this visit/i);
    assert.match(panelSource, /MAP_MODIFIERS_PANEL_TITLE/);
    assert.match(panelSource, /MAP_MODIFIERS_PANEL_WHY/);
    assert.match(panelSource, /shouldShowMapModifiersPanel/);
    assert.equal(panelSource.includes("No active modifiers"), false);
    assert.equal(panelSource.includes("Map Modifiers"), false);
  });
});
