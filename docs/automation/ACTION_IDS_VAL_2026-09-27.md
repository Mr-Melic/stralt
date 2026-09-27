# ACTION_IDs — 2026-09-27 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-27.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-27.md).  
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
- `VAL-2026-09-26-001` … `012` in PR [#624](https://github.com/Mr-Melic/stralt/pull/624) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-27

| ID | Status 2026-09-27 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 |
| VAL-2026-09-25-011 elite rec 34 | Corrected by VAL-2026-09-26-001 (squash max 1.5 → rec 36) |
| VAL-2026-09-26-005 Rest/Death desktop follow pane | **Corrected** by VAL-2026-09-27-001 (desktop paint ignores `cameraRef`) |

---

ACTION_ID: VAL-2026-09-27-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Desktop Rest/Death writes cameraRef but paint and hit-test force cam 0 — do not preview a panned >1024 sanctuary  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `updateCameraToFollowPlayer` sets camera to canvas center − player screen pos on `isRestMap` / `isDeathRealm` and returns before the desktop lock (WX 5877–5899). White/rest entry and Death Realm spawn also write `cameraRef` (6125–6131, 6170–6177, 13456–13466). Live projection still uses `camX = isDesktop ? 0 : cameraRef.current.x` in `gridToScreen` (3780–3781), `_screenToGrid` (3822–3823), and `rebuildTileCornerCache` (8844–8845). `isDesktop` is `innerWidth > 1024` (WX 877). VAL-2026-09-26-005 asked for a camera-follow dummy even at >1024; that pane would not match paint.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` (new); Rest/Death player stills; VAL-2026-09-26-005  
RECOMMENDED_ACTION: Desktop Rest/Death preview = locked 80×40 full map (cam 0), same as overworld. Phone/tablet Rest/Death preview may follow. Empty roster + empty library must still paint player chess. Do not bind visuals assuming `combatantsRef.length > 0`. Do not add a `ctx.translate(camera)` in the custom draw path on desktop.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-26-005 / VAL-2026-09-02-001  
DEPENDENCIES: VAL-2026-08-31-009; VAL-2026-09-25-006; VAL-2026-09-26-005  
REGRESSION_RISK: MEDIUM if preview pans at 1280 px and owners author overlap that never happens in live paint.  
VALIDATION_REQUIRED: At 1280×800 Rest map, player chess and a bound 24×24 PNG stay in the same cam-0 diamond layout as overworld. At 390 px after Continue, follow pane is used.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom drawImage must share gridToScreen — do not dual-project against cameraRef  
CATEGORY: renderer  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `tileScreenCacheRef` is keyed `"gx,gy"` (WX 3775–3788). File comment at 3766 claims invalidation on camera change; `useEffect` at 3800–3802 clears only on `canvasSize` / `effectiveTileW/H`. Camera is baked in at first lookup when `!isDesktop`. Tiles, combatants, portals, and walls all call this helper. A VAL path that reads `cameraRef` itself (or skips the cache) will desync PNG feet from diamonds on phone follow.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` draw helper; WX `drawCombatant` / player site  
RECOMMENDED_ACTION: Pass the same screen `{x,y}` already computed for the pixel path. Do not write a second iso projector. Do not “fix” the cache as a VAL shortcut (that is WX camera work, not the library).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-27-001  
REGRESSION_RISK: HIGH if custom sprites pan while tiles stay cached (or the reverse).  
VALIDATION_REQUIRED: Phone Continue + walk: PNG and chess dummy stay centered on the same diamond as the floor tile. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: spawnPixelPuff and tileCenter sit on the diamond mid-point — character art sits 11 px higher on desktop  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `tileCenter` returns `{ x, y: y + effectiveTileH / 2 }` (WX 3806–3811). Comment claims `+ CHARACTER_Y_OFFSET` for characters; the function does not add it. Character draw is `screenPos.y - CHARACTER_Y_OFFSET` = top+9 (`pieceArt.ts` 851–852; player 8317–8319). `spawnPixelPuff` is called at `(screenPos.x, screenPos.y + effectiveTileH / 2)` with size `effectiveTileW * 0.18` (9305–9313) → desktop **14.4**, phone **25.2**. Desktop gap draw-point vs puff = 20−9 = **11 px**. Next rAF `clearRect`s the one-shot puff.  
SYSTEMS_AFFECTED: iso preview VFX dummy; summon spawn juice (leave generated)  
RECOMMENDED_ACTION: Preview shows both origins. Do not move the puff onto the bitmap center. Do not bind a custom puff atlas. Keep puff as generated `fillRect` particles (`pieceArt.ts` 1036–1060).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-01-009  
REGRESSION_RISK: MEDIUM if someone “fixes” puff to top+9 and owners judge overlap from the wrong dummy.  
VALIDATION_REQUIRED: Spec sheet lists puff size 14.4/25.2 and the 11/26 px draw-vs-center delta. Empty-library summon spawn still uses `spawnPixelPuff`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze the HUD overlay stack — MAX_HEIGHT 60 already meets the status-icon and level-line  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Name/level bold 11px Arial at `y−34` / +14 (WX 8122–8136). Hover damage bold 14px at `y−44` (8204–8207). Summon badge `(x+18, y−48)`, 9px, pill h=12 (8146–8154). Status icons 16×16, max 4, at `screenPos.y - CHARACTER_Y_OFFSET - 30` = drawY−30 (8246–8248). Wander ring r=15 at the draw point (8229–8234). Moving wrap `#ff6b6b` blur 8 (8057–8061). Dungeon portal tooltip `sp.y−45` h=16 (7930–7939). Centered H=60 sprite top is exactly 30 px above drawY (status line). H=58 meets the level baseline (29 px above drawY). Width ≳ 36 meets the badge’s 18 px horizontal offset.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; upload spec warnings  
RECOMMENDED_ACTION: Iso preview draws the live overlay dummies. Warn if decoded height > 44 (status), ≥ 58 (level), or width ≳ 36 on summons (badge). Custom `drawImage` must run inside the moving-enemy save so the red blur applies to the bitmap AABB; do not add a second bloom. Do not grow hit boxes from the overlay.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-09-01-004 / VAL-2026-09-26-007  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-008; VAL-2026-09-01-004  
REGRESSION_RISK: MEDIUM if preview omits icons and owners ship 60-tall art that covers status pills.  
VALIDATION_REQUIRED: Preview of a 60×60 PNG shows status/level clip warnings; 24×24 does not. Moving enemy PNG pulses with the same blur/alpha as chess. Occupancy unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Ground Doka is a r=7 coin glyph — do not add a loot upload profile; union #683 spawn extract  
CATEGORY: scope  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 8454–8505: radial glow r=14, body r=7, bob ±3, fillText `"D"` 8px Arial, value pill at +9/+15. Not `drawCombatant`. Open PR [#683](https://github.com/Mr-Melic/stralt/pull/683) (2026-09-27) extracts `planGroundDokaLoot` into `engine/groundDokaSpawn.ts` and re-exports from `worldHelpers.ts`; this SHA still inlines the roll. Paint stays in WX either way.  
SYSTEMS_AFFECTED: future `#doka` category (ineligible in v1); WX loot loop; sibling #683  
RECOMMENDED_ACTION: Keep coins generated. Preview may place a r=7 dummy for overlap warnings only. After #683, import `planGroundDokaLoot` — do not paste a second copy. Do not pick `visualAssetId` from loot ids (`doka-${now}-${x}-${y}`).  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-08-31-016; stack-compat with #683  
REGRESSION_RISK: HIGH if VAL concatenates `planGroundDokaLoot` (esbuild duplicate export) or treats coins as combatants.  
VALIDATION_REQUIRED: Empty library coins unchanged. `python3 scripts/check-duplicate-exports.py src/frontend/src` after any implementation PR.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Painter depth is x+y — tall custom art occludes with wall 28 and barrier 168 on the same iso diagonal  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Unified pass depth is `x + y` for walls (7722), barriers (7738), portals (7756), enemies (7966), player (7971). Player then wins overlap via `drawOrder` 99999 (8342). Walls extrude 28 px (4085). Barriers are 6×28=168 (`barrierRender.ts` 15–16). Occupancy is still one tile (`occupancy.ts` 84–96). Spell range is a tile-diamond fill (7687–7706), not a sprite box.  
SYSTEMS_AFFECTED: iso preview occlusion dummy; custom drawOrder (must keep live keys)  
RECOMMENDED_ACTION: Preview a 24×24 combatant in front of a 28 px wall and a 168 px tower on the same `x+y`. Warn readability. Do not raise `drawOrder` from bitmap height. Do not change occupancy or range diamonds.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-008 / VAL-2026-09-26-004  
DEPENDENCIES: VAL-2026-08-31-008; VAL-2026-09-26-004; VAL-2026-09-26-009  
REGRESSION_RISK: HIGH if custom player `drawOrder` is derived from PNG size and steals neighbor clicks.  
VALIDATION_REQUIRED: Click tests still use 80×41 + pad 10/14. A 60-tall PNG does not occupy two tiles.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Bound player PNGs do not receive Character.colors — cell 2 is primary, extra is accent  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player world paint (WX 8315–8325) passes `{ primary: colors.primary, secondary: colors.secondary, accent: colors.primary, extra: colors.accent }` into `drawPixelPattern`. Portrait (3728–3754) maps cell 1 secondary, 2 primary, else accent. `getColorPalette` is an admin JSON blob (WX 936), not a combatant tint. Custom `drawImage` has no cell values to recolor.  
SYSTEMS_AFFECTED: player bind; creation color picker; portrait (leave generated in v1)  
RECOMMENDED_ACTION: Preview copy: “Custom stills ignore the piece color picker.” Do not multiply bitmap RGB by palette hex. Portrait/creation/selection stay chess `fillRect` in v1 (VAL-2026-09-26-008).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-23-007 / VAL-2026-09-26-008  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007  
REGRESSION_RISK: MEDIUM if a hunter tints PNGs with `getColorPalette` and empty-library chess colors drift.  
VALIDATION_REQUIRED: Empty library player still uses picker colors. Bound PNG is unchanged when the player recolors the piece.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Keep spawnPixelPuff generated — do not treat 0.18×tileW as an upload spec  
CATEGORY: scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Size is `effectiveTileW * 0.18` (WX 9312). Implementation is 10 `fillRect`s, `globalAlpha` 0.7 (`pieceArt.ts` 1042–1058). Drawn via a one-off `getContext("2d")` at summon commit, then the rAF loop clears. Not a persistent sprite.  
SYSTEMS_AFFECTED: summon spawn juice  
RECOMMENDED_ACTION: Scope guard. `RECOMMENDED_WIDTH` for summons stays 24, not 14. Do not add `ANIMATION_SUPPORT` for puffs.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-09-27-003; VAL-2026-08-31-016  
REGRESSION_RISK: LOW if ignored; MEDIUM if 14 becomes the summon rec by mistake.  
VALIDATION_REQUIRED: Spec sheet summon rec remains 24. Empty-library puff still fires.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Consume WX extracts #427 #514 #591 #683 — do not grow WorldExploration for VAL  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#427](https://github.com/Mr-Melic/stralt/pull/427) sprite-first hit-test. [#514](https://github.com/Mr-Melic/stralt/pull/514) `pickRandomWanderTarget`. [#591](https://github.com/Mr-Melic/stralt/pull/591) `advanceEnemyWander`. [#683](https://github.com/Mr-Melic/stralt/pull/683) `planGroundDokaLoot`. WX is 19213 lines. AGENTS.md forbids growing the rAF body. VAL-2026-09-26-010 named #427/#591 only.  
SYSTEMS_AFFECTED: WX; `engine/visualAssets.ts`; sibling engine extracts  
RECOMMENDED_ACTION: New modules + tests. WX at most: pass resolver into `DrawCombatantOptions`, one player `drawImage` line, bind `visualAssetId` at spawn. After extracts merge, restack with **union** (one `export function` per name). Do not pick art from wander or Doka rolls.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-09-26-010  
DEPENDENCIES: VAL-2026-08-31-017; stack-compat with #427 #514 #591 #683  
REGRESSION_RISK: HIGH if VAL concatenates `hitTestSprite` / `planGroundDokaLoot` / wander helpers — Caffeine `vite build` fails.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR; `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Keep spriteRects.kind summon for player-side units — do not retarget from PNG size  
CATEGORY: hit-test  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy/summon writer sets `kind: enemy.side === "player" ? "summon" : "enemy"` (WX 8095) and `drawOrder: renderItem.depth` (8093). Player writer uses kind `"player"` and `drawOrder` 99999 (8337–8342). `hitTestSprite` iterates those rects with pad 10/14 (8885–8911, 10127, 10819).  
SYSTEMS_AFFECTED: `spriteRectsRef`; future hit-test extract (#427); summon control  
RECOMMENDED_ACTION: Custom stills keep the live kind/order/box. After #427, import that writer. Do not set kind from `ENTITY_CATEGORY` at click time.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-01-003 / VAL-2026-09-26-009  
DEPENDENCIES: VAL-2026-08-31-008; stack-compat with #427  
REGRESSION_RISK: HIGH if player-side summons become kind `"enemy"` and steal attack targeting.  
VALIDATION_REQUIRED: Click a player-side summon PNG and a chess summon both resolve summon; player still wins overlap.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: getCameraFollowSpeed 1200 band is phone/tablet only — desktop Rest/Death never lerps  
CATEGORY: render-contract  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `getCameraFollowSpeed` (`worldHelpers.ts` 8–18): mobile 0.35, width < 1200 → 0.12, else 0.08. Caller is after Rest/Death return **and** after `if (isDesktop) { camera = 0; return }` (WX 5896–5917). Combined with VAL-2026-09-27-001, a 1920 Rest map neither pans nor uses 0.08.  
SYSTEMS_AFFECTED: preview camera dummy  
RECOMMENDED_ACTION: Document three live follow speeds only for `!isDesktop`. Do not simulate 0.08 lerp on desktop sanctuary.  
AUTONOMY: DOCUMENT_ONLY unless implementing preview  
DEPENDENCIES: VAL-2026-09-27-001  
REGRESSION_RISK: LOW for gameplay; MEDIUM for misleading preview motion.  
VALIDATION_REQUIRED: Design table lists 0.35 / 0.12 / 0.08 as non-desktop only.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-27-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#624  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings. Rewriting `ACTION_IDS_VAL_2026-09-26.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-09-27.md`, `docs/automation/ACTION_IDS_VAL_2026-09-27.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-09-27 ACTION_IDs. Production code not modified.*
