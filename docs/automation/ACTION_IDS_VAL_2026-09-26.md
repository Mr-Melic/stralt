# ACTION_IDs — 2026-09-26 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-26.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-26.md).  
HEAD inspected: `0f5363f`. Gameplay / production code was not modified.

Prior IDs (do **not** re-issue):

- `VAL-2026-08-31-001` … `019` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (merged design PR #121).
- `VAL-2026-09-01-001` … `011` in [`ACTION_IDS_VAL_2026-09-01.md`](./ACTION_IDS_VAL_2026-09-01.md). **001 IMPLEMENTED (copy only).**
- `VAL-2026-09-02-001` … `012` in [`ACTION_IDS_VAL_2026-09-02.md`](./ACTION_IDS_VAL_2026-09-02.md).
- `VAL-2026-09-21-001` … `014` in PR [#355](https://github.com/Mr-Melic/stralt/pull/355) (open, not on main).
- `VAL-2026-09-22-001` … `012` in PR [#418](https://github.com/Mr-Melic/stralt/pull/418) (open, not on main).
- `VAL-2026-09-23-001` … `012` in PR [#461](https://github.com/Mr-Melic/stralt/pull/461) (open, not on main).
- `VAL-2026-09-24-001` … `012` in PR [#520](https://github.com/Mr-Melic/stralt/pull/520) (open, not on main).
- `VAL-2026-09-25-001` … `012` in PR [#586](https://github.com/Mr-Melic/stralt/pull/586) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-26

| ID | Status 2026-09-26 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 (do not use `isBoss&&bossId` as the live portal path) |
| VAL-2026-09-25-011 elite rec 34 | **Corrected** by VAL-2026-09-26-001 (live squash max is 1.5 → 36) |

---

ACTION_ID: VAL-2026-09-26-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Live squash max is 1.5 on one axis — 09-25 elite recommended 34 is short  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `generateEnemyScaleFactors` (`spawnPolicy.ts` 227–256): discarded pair in 0.6–1.4; `variation < 0.3` returns `scaleY = rng()*0.4+1.1` ∈ [1.1, 1.5); `variation < 0.6` returns `scaleX` ∈ [1.1, 1.5); uniform only then uses 0.6–1.4. Tests (`spawnPolicy.test.ts` 171–201) lock those formulas. 09-25 `enemy_elite` rec 34 = ceil(24×1.4) missed the tall/wide branches. Max painted chess = 24×1.5 = **36**. Custom art must still **not** inherit squash.  
SYSTEMS_AFFECTED: upload spec UI; `enemy_elite` RENDER_PROFILE; `visualPreview.ts`  
RECOMMENDED_ACTION: Publish rec **36×36** for `enemy_elite`. Keep `enemy_standard` rec 24 and `DEFAULT_SCALE` 1. Preview a tall 0.75×1.5 dummy vs a custom 24×24 so owners see today’s variety without stretching PNGs.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-004 / VAL-2026-09-25-011  
DEPENDENCIES: VAL-2026-08-31-004; VAL-2026-08-31-007  
REGRESSION_RISK: MEDIUM if implementers multiply a 36×36 upload by 1.5 (54 px, past neighbor Δ 40).  
VALIDATION_REQUIRED: Spec sheet before file pick shows 36 for elite, 24 for standard. A bound PNG does not read `entity.scaleY`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: generateEnemyScaleFactors unused draws do not share pickEnemyLevelFromTiers — live call is bare Math.random  
CATEGORY: stable-assignment  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `spawnPolicy.ts` 17–18 and 224–226 claim the two unused rng draws “feed the later per-enemy RNG stream (level pick).” Live `generateEnemies` calls `generateEnemyScaleFactors()` with **no rng** (WX 5768) then `pickEnemyLevelFromTiers` separately (5770). Default parameter is `Math.random` (`spawnPolicy.ts` 227). VAL bind that uses `seededRng(hash(instanceId, poolId))` does **not** shift levels. Do not insert VAL draws *inside* `generateEnemyScaleFactors`.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` spawn bind; must not edit `generateEnemyScaleFactors` signature as a VAL shortcut  
RECOMMENDED_ACTION: Bind `visualAssetId` after the Enemy object exists, hashing the instance id (already unique). Leave the scale-factor function and its unused draws untouched (they are a pixel-art variety trick, not a visual-library primitive).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-005  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-23-002; VAL-2026-09-25-007  
REGRESSION_RISK: HIGH if someone “fixes” the stale comment by plumbing one rng through scale+level+visual — levels and squash change.  
VALIDATION_REQUIRED: Spawn N enemies with a two-asset pool; levels match empty-library spawn; appearance stable across rerender; `generateEnemyScaleFactors` tests still pass without edits.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: M-1 canvas.width=0 context kill must not drop the ImageBitmap cache  
CATEGORY: renderer  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: WX 7220–7229: if `getContext("2d")` is null, set `canvas.width = 0` then restore `savedW` and return. That tears down the 2D context (and any `CanvasPattern` / ctx-bound state). Separate no-map path also assigns `canvas.width` (7203–7208). 09-25 named drift-resize `canvas.width=` (7256–7261) but not this zero-width reset.  
SYSTEMS_AFFECTED: decode cache in `engine/visualAssets.ts`; world canvas lifecycle  
RECOMMENDED_ACTION: Keep decoded `ImageBitmap` (or Blob) off the world context. After M-1 / resize / contextrestored, re-get ctx, `setTransform`+`scale(dpr)`, set `imageSmoothingEnabled=false`, then `drawImage` from the same bitmaps. Do not mint patterns on the world ctx.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-011 / VAL-2026-09-24-006 / VAL-2026-09-25-008  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-23-005  
REGRESSION_RISK: HIGH if bitmaps are held only as ctx patterns — first GPU pressure frame permanently falls back or flashes builtin.  
VALIDATION_REQUIRED: Synthetic `canvas.width=0` then restore mid-battle; bound PNG still draws next frame without re-upload.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Barrier towers are 6×28=168 px — preview clip; do not size combatant uploads from them  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `barrierRender.ts` 15–16: `BARRIER_LAYER_HEIGHT = 28`, `BARRIER_LAYERS = 6` → **168** px stacked iso. Comment “WX line 3273” is stale (wallHeight lives at WX 4085). 09-25 wall-clip warn used only 28 px. Combatant occupancy is still one tile (`occupancy.ts` 84–96).  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; future `#barrier` category (ineligible in v1)  
RECOMMENDED_ACTION: Iso preview draws a 168 px tower dummy beside the 24×24 combatant. Warn readability / overlap. Keep combatant MAX 80×60. Do not add a barrier upload profile until a measured draw contract exists.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-08-31-008  
REGRESSION_RISK: LOW for gameplay; MEDIUM if someone sets boss MAX_HEIGHT from 168.  
VALIDATION_REQUIRED: Preview of a 24×24 PNG next to the tower shows a clip/readability warning; occupancy still one tile.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Rest and Death Realm center the camera on desktop — 09-25 three-band table is incomplete  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `updateCameraToFollowPlayer` (WX 5876–5899): if `isRestMap` or `isDeathRealm`, camera = canvas center − player screen pos and **return**, before `if (isDesktop) lock 0`. Death Realm also skips `generateEnemies` (WX 6566–6568 → `[]`). 09-25 preview asked phone 140×70 / tablet follow / desktop lock only.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; player stills bind (player is the only combatant on Death Realm)  
RECOMMENDED_ACTION: Add a Rest/Death preview pane: 80×40 diamond + camera-follow dummy even at &gt;1024. Empty roster + empty library must paint player chess. Do not bind visuals assuming `combatantsRef.length > 0`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-02-001 / VAL-2026-09-25-006  
DEPENDENCIES: VAL-2026-08-31-009; VAL-2026-09-25-006  
REGRESSION_RISK: MEDIUM if desktop-lock preview is treated as the Rest-map truth — owners mis-judge overlap.  
VALIDATION_REQUIRED: On a rest map at 1280 px width, player stays centered; a bound player PNG stays centered with it. Death Realm with empty library ≡ today’s player pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Portal FX radii are 25 / rest-glow 33 / boss-star 37 — not the portal Enemy footprint  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `drawPortalWhirlpool` radius 25 (WX 3898), translated `(x, y-10)` (3919). Rest glow ellipse `radius+8` = **33** (3928). Boss-portal star `outerR = radius+12` = **37** (3965). Portal **Enemy** paint is chess 8×8 × 1.4 ≈ 34×34 (WX 6535–6536) with no `isBoss`/`bossId`. 09-25 named r=25 only.  
SYSTEMS_AFFECTED: preview FX dummy vs `boss_large` profile  
RECOMMENDED_ACTION: Keep FX and unit profiles separate. Do not set `RECOMMENDED_*` from 33 or 37. Preview may show the whirlpool under the unit dummy as a clip warning only.  
AUTONOMY: DOCUMENT_ONLY unless implementing preview  
DEPENDENCIES: VAL-2026-09-22-002; VAL-2026-09-26-001  
REGRESSION_RISK: MEDIUM if boss PNGs are authored to 37×37 “to cover the star.”  
VALIDATION_REQUIRED: Design + spec sheet cite 25/33/37 as FX-only; portal boss upload rec stays 34.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: strokeOwnerTint is a 2px + blur-8 AABB — custom summons must outline the bitmap, not the cell grid  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `strokeOwnerTint` (`pieceArt.ts` 791–810) strokes `patternWidth+2` × `patternHeight+2` at the centered pattern origin, `lineWidth` 2, `shadowBlur` 8, `OWNER_TINT` by `side`. Summon spawn omits `scaleX/Y` (`summonSpawn.ts` 153). 09-25 asked to keep the tint but did not publish stroke/blur numbers.  
SYSTEMS_AFFECTED: summon `drawImage` branch; badge at `(x+18, y−48)` (WX 8146–8147)  
RECOMMENDED_ACTION: After drawing the summon bitmap, stroke the **bitmap** AABB with the same 2 / 8 constants. Do not reconstruct an 8×8 cell outline. Warn if the AABB plus blur collides with the lifespan badge.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-23-007  
REGRESSION_RISK: MEDIUM if tint is dropped (owner-side readability) or drawn in cell space around a PNG.  
VALIDATION_REQUIRED: Player-side summon PNG has a green AABB stroke; enemy-side red; empty library still uses cell-grid tint.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: CharacterSelection paints 192×192 cells — do not use that canvas as an upload spec  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `CharacterSelection.tsx` 310–337: default `size=120`, `internalSize=240`, `pixelSize=floor(240/10)=24`, pattern 8×24 = **192×192** on a 240 backing. Creation is the other extreme: hardcoded 8×10 = 80×80 on 320×280 (`CharacterCreation.tsx` 151–178). Portrait is 60×60 / 6 px (WX 3720, 18111–18116). 09-25 named creation 8-cell and portrait; it did not publish the 192-cell selection painter.  
SYSTEMS_AFFECTED: CharacterSelection / Creation / portrait — **leave generated** in v1  
RECOMMENDED_ACTION: v1 custom player stills apply only on the world canvas (WX 8315–8326) and admin iso preview. Do not generalize `internalSize/10` or `8*scale` as RECOMMENDED_WIDTH.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-23-007 / VAL-2026-09-25-003  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-09-25-003  
REGRESSION_RISK: MEDIUM if selection is forced to `drawImage` a 24×24 PNG into a 192-cell layout.  
VALIDATION_REQUIRED: Slot picker still shows chess `fillRect`; a bound world PNG never appears on the 120 CSS preview in v1.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player drawOrder 99999 must stay — do not grow the 80×41 hit box from PNG size  
CATEGORY: hit-test  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player rect writer (WX 8328–8353) sets `drawOrder: 99999` so the player wins overlap after being drawn last. Hit uses computed `h=41`, not `drawSize.h=60`. Open PR [#427](https://github.com/Mr-Melic/stralt/pull/427) extracts this writer. Custom player art that rewrites order or derives w/h from the bitmap will steal neighbor clicks or lose to summons.  
SYSTEMS_AFFECTED: `spriteRectsRef`; future `engine/` hit-test module; player `drawImage` site  
RECOMMENDED_ACTION: Custom player draw uses the same tile-derived rect + `drawOrder` 99999. After #427 lands, import that writer. Union overlapping files; one implementation per name.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-01-003 / VAL-2026-09-22-004 / VAL-2026-09-25-009  
DEPENDENCIES: VAL-2026-08-31-008; stack-compat with #427  
REGRESSION_RISK: HIGH if two rect maps disagree — clicks miss the player or steal adjacent enemies.  
VALIDATION_REQUIRED: Click center of a custom 24×24 player and a chess 24×24 both resolve `player`; padding stays 10/14; drawOrder still 99999.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Consume #427 hit-test and #591 wander extracts — do not grow WorldExploration for VAL  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#427](https://github.com/Mr-Melic/stralt/pull/427) extracts sprite-first hit testing. Open [#591](https://github.com/Mr-Melic/stralt/pull/591) (created 2026-09-25) extracts `advanceEnemyWander` into `engine/enemyWander.ts` and edits WX. AGENTS.md forbids growing the rAF body. A VAL implementation that inlines `drawImage` + a new rect map + wander-time rebind will conflict with both siblings and the 19213-line WX.  
SYSTEMS_AFFECTED: WX; `engine/visualAssets.ts`; `engine/enemyWander.ts` (sibling); hit-test helper (sibling)  
RECOMMENDED_ACTION: New code lives in `engine/visualAssets.ts` (+ tests). WX gets at most: pass a resolver into `DrawCombatantOptions`, one player `drawImage` line, bind `visualAssetId` at spawn. After #427/#591 merge, restack with **union** (one `export function` per name). Do not pick art from wander ticks.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-09-25-009  
DEPENDENCIES: VAL-2026-08-31-017; stack-compat with #427 and #591  
REGRESSION_RISK: HIGH if VAL concatenates a second `hitTestSprite` or wander helper — Caffeine `vite build` / esbuild fails on duplicate exports.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR; `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Drop-shadow desktop is a 12×4.2 ellipse — do not grow it from the bitmap  
CATEGORY: render-contract  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 8033–8054 / 8291–8312: `sw = min(effectiveTileW*0.35, effectiveTileH*0.3)` → desktop `min(28, 12) = 12`, `sh = 12*0.35 = 4.2`, foot at `tileTopY + th/2 + 4`. 09-25 published the formula but not the 12×4.2 result. Phone zoom: `min(49, 21) = 21`. Shadow is tile-foot, not pattern-sized.  
SYSTEMS_AFFECTED: preview overlay; custom draw must keep the existing ellipse  
RECOMMENDED_ACTION: Keep the live ellipse. Preview a 48-tall PNG over the 12×4.2 foot and warn “disconnected shadow.” Do not scale `sw` by bitmap height.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009  
DEPENDENCIES: VAL-2026-08-31-008  
REGRESSION_RISK: LOW for gameplay; MEDIUM for readability if shadow is grown to the PNG.  
VALIDATION_REQUIRED: Empty library shadow identical; bound 48×48 PNG still uses sw=12 on desktop.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-26-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355 / #418 / #461 / #520 / #586  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355 (09-21), #418 (09-22), #461 (09-23), #520 (09-24), #586 (09-25). This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings. Rewriting `ACTION_IDS_VAL_2026-09-25.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-09-26.md`, `docs/automation/ACTION_IDS_VAL_2026-09-26.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-09-26 ACTION_IDs. Production code not modified.*
