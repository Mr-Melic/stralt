/**
 * Spellbook primary actions must meet DESIGN.md's mobile 44px floor.
 * `.stone-touch-target` is already 44×44 under `@media (max-width: 768px)`
 * in `index.css`. Close already uses `.stone-modal-close` (same rule).
 * Catalog cards and 54px slots are already ≥44px — do not retag those.
 */
export const SPELLBOOK_MOBILE_TOUCH_CLASS = "stone-touch-target";

export const SPELLBOOK_MOBILE_TOUCH_OCID_MARKERS = [
  "spellbook.cancel_button",
  "spellbook.confirm_button",
  "spellbook.confirm_swap.cancel_button",
  "spellbook.confirm_swap.confirm_button",
  "spellbook.upgrade_toggle.",
  "spellbook.upgrade_button.",
] as const;

export function spellbookControlUsesMobileTouchFloor(
  buttonSource: string,
): boolean {
  return (
    buttonSource.includes("SPELLBOOK_MOBILE_TOUCH_CLASS") ||
    buttonSource.includes(SPELLBOOK_MOBILE_TOUCH_CLASS) ||
    buttonSource.includes("minHeight: 44") ||
    buttonSource.includes("minHeight:44")
  );
}

/** Split a SpellbookModal source file into `data-ocid` button/control blocks. */
export function spellbookOcidBlocks(source: string): Array<{
  ocid: string;
  block: string;
}> {
  const blocks: Array<{ ocid: string; block: string }> = [];
  const ocidRe = /data-ocid=\{?[`"]([^`"]+)[`"]\}?/g;
  const matches = [...source.matchAll(ocidRe)];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const ocid = match[1];
    if (!ocid) continue;
    const start = match.index ?? 0;
    const end = matches[i + 1]?.index ?? source.length;
    blocks.push({ ocid, block: source.slice(start, end) });
  }
  return blocks;
}

export function spellbookPrimaryActionsHaveMobileTouchFloor(
  source: string,
): boolean {
  const blocks = spellbookOcidBlocks(source);
  return SPELLBOOK_MOBILE_TOUCH_OCID_MARKERS.every((marker) => {
    const hits = blocks.filter((b) =>
      marker.endsWith(".") ? b.ocid.startsWith(marker) : b.ocid === marker,
    );
    return (
      hits.length > 0 &&
      hits.every((h) => spellbookControlUsesMobileTouchFloor(h.block))
    );
  });
}
