/**
 * Player Sprites list (`AdminDashboard.tsx` ~1844–1936) shows a chess-piece
 * glyph when frontUrl is empty (valid Default Pixel Visual) but the only
 * chip is characterPieceType. Enemy list already has Default Pixel /
 * stored-URL chips.
 *
 * Unique 2026-10-31 file — do not merge into adminOwnerUx.visualPreview.ts
 * / visualPool.ts / visualRevert.ts. Not wired (stack). Empty URL is never
 * an error.
 */

import {
  enemyVisualStatusCopy,
  spriteUrlIsStored,
} from "./adminVisualStatus.ts";

type SpriteUrlField = [] | [string] | string | undefined | null;

export function ownerSpriteFacingUrlIsStored(
  frontUrl: SpriteUrlField,
  rightUrl: SpriteUrlField = [],
  leftUrl: SpriteUrlField = [],
  backUrl: SpriteUrlField = [],
): boolean {
  return (
    spriteUrlIsStored(frontUrl) ||
    spriteUrlIsStored(rightUrl) ||
    spriteUrlIsStored(leftUrl) ||
    spriteUrlIsStored(backUrl)
  );
}

export function ownerSpriteListVisualChip(
  frontUrl: SpriteUrlField,
  rightUrl: SpriteUrlField = [],
  leftUrl: SpriteUrlField = [],
  backUrl: SpriteUrlField = [],
): {
  status: string;
  chip: string;
  storedNotRendered: boolean;
} {
  return enemyVisualStatusCopy(
    ownerSpriteFacingUrlIsStored(frontUrl, rightUrl, leftUrl, backUrl),
  );
}

export function ownerSpriteListChipMissingOnMain(): true {
  return true;
}
