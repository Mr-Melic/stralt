import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HIDDEN_TAB_CSS_ATTR,
  applyHiddenTabCssPause,
  shouldPauseHiddenTabCss,
  wireHiddenTabCssPause,
} from "./hiddenTabCssActivity.ts";

describe("hiddenTabCssActivity", () => {
  it("pauses only while the document is hidden", () => {
    assert.equal(shouldPauseHiddenTabCss(false), false);
    assert.equal(shouldPauseHiddenTabCss(true), true);
  });

  it("sets and clears the html dataset flag without leftover keys", () => {
    const root = { dataset: {} as Record<string, string> };
    applyHiddenTabCssPause(true, root as unknown as HTMLElement);
    assert.equal(root.dataset[HIDDEN_TAB_CSS_ATTR], "1");
    applyHiddenTabCssPause(true, root as unknown as HTMLElement);
    assert.equal(root.dataset[HIDDEN_TAB_CSS_ATTR], "1");
    applyHiddenTabCssPause(false, root as unknown as HTMLElement);
    assert.equal(HIDDEN_TAB_CSS_ATTR in root.dataset, false);
  });

  it("wires visibilitychange and removes the listener on dispose", () => {
    const listeners = new Map<string, () => void>();
    const root = { dataset: {} as Record<string, string> };
    const doc = {
      hidden: true,
      documentElement: root,
      addEventListener(type: string, fn: () => void) {
        listeners.set(type, fn);
      },
      removeEventListener(type: string, fn: () => void) {
        if (listeners.get(type) === fn) listeners.delete(type);
      },
    };
    const unsub = wireHiddenTabCssPause(doc as unknown as Document);
    assert.equal(root.dataset[HIDDEN_TAB_CSS_ATTR], "1");
    doc.hidden = false;
    listeners.get("visibilitychange")?.();
    assert.equal(HIDDEN_TAB_CSS_ATTR in root.dataset, false);
    unsub();
    assert.equal(listeners.has("visibilitychange"), false);
  });
});
