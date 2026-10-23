# ACTION_IDs — 2026-10-23 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-10-23.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-10-23.md).  
HEAD inspected: `0f5363f`. Gameplay / production code was not modified.

Prior IDs (do **not** re-issue):

- `VAL-2026-08-31-001` … `019` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (merged design PR #121).
- `VAL-2026-09-01-001` … `011` in [`ACTION_IDS_VAL_2026-09-01.md`](./ACTION_IDS_VAL_2026-09-01.md). **001 IMPLEMENTED (copy only).**
- `VAL-2026-09-02-001` … `012` in [`ACTION_IDS_VAL_2026-09-02.md`](./ACTION_IDS_VAL_2026-09-02.md) (merged design PR #268).
- `VAL-2026-09-21-001` … `014` in PR [#355](https://github.com/Mr-Melic/stralt/pull/355) (open, not on main).
- `VAL-2026-09-22-001` … `012` in PR [#418](https://github.com/Mr-Melic/stralt/pull/418) (open, not on main).
- `VAL-2026-09-23-001` … `012` in PR [#461](https://github.com/Mr-Melic/stralt/pull/461) (open, not on main).
- `VAL-2026-09-24-001` … `012` in PR [#520](https://github.com/Mr-Melic/stralt/pull/520) (open, not on main).
- `VAL-2026-09-25-001` … `012` in PR [#586](https://github.com/Mr-Melic/stralt/pull/586) (open, not on main).
- `VAL-2026-09-26-001` … `012` in PR [#624](https://github.com/Mr-Melic/stralt/pull/624) (open, not on main).
- `VAL-2026-09-27-001` … `012` in PR [#694](https://github.com/Mr-Melic/stralt/pull/694) (open, not on main).
- `VAL-2026-09-28-001` … `012` in PR [#715](https://github.com/Mr-Melic/stralt/pull/715) (open, not on main).
- `VAL-2026-09-29-001` … `012` in PR [#782](https://github.com/Mr-Melic/stralt/pull/782) (open, not on main).
- `VAL-2026-10-21-001` … `012` in PR [#835](https://github.com/Mr-Melic/stralt/pull/835) (open, not on main).
- `VAL-2026-10-22-001` … `012` in PR [#880](https://github.com/Mr-Melic/stralt/pull/880) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-10-23

| ID | Status 2026-10-23 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts`; HEAD still `0f5363f` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 |
| VAL-2026-09-25-011 elite rec 34 | Corrected by VAL-2026-09-26-001 (squash max 1.5 → rec 36) |
| VAL-2026-09-26-005 Rest/Death desktop follow pane | **Corrected** by VAL-2026-09-27-001 (desktop paint ignores `cameraRef`) |
| VAL-2026-09-27-001 | **Extended** by VAL-2026-10-21-004: Rest/Death **does** pan when `!isDesktop` |
| VAL-2026-09-28-001 share gridToScreen / #639 | still OPEN; `isoGrid.ts` absent on `0f5363f` |
| VAL-2026-09-29-001 #724 spec-sheet collision | still valid; #724 still OPEN |
| VAL-2026-10-21-001 / 004 `#798` cameraFollow | still valid; #798 still OPEN |
| VAL-2026-10-21-006 skip docs PRs #355–#782 | **Extended** by VAL-2026-10-22-008 (#835) then **VAL-2026-10-23-005** (#880) |
| VAL-2026-10-22-004 don't restack AdminDashboard / #838 | **Extended** by VAL-2026-10-23-003 (#883) |
| VAL-2026-10-22-007 don't restack WX / #841 | **Extended** by VAL-2026-10-23-002 / 008 (#901) |
| VAL-2026-10-22-005 auto-summon kits not visual | **Extended** by VAL-2026-10-23-004 (#911 pack kits) |

---

ACTION_ID: VAL-2026-10-23-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not put combatant stills in #901 portalWhirlpool — PORTAL stays ineligible; radii 25/33/37 are clip warnings not upload sizes  
CATEGORY: scope  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#901](https://github.com/Mr-Melic/stralt/pull/901) (created 2026-10-22T00:19Z, six minutes after VAL docs #880) extracts swirl / rest-ring / boss-star / dungeon-spike from WorldExploration into `engine/portalWhirlpool.ts`. Named constants: `PORTAL_WHIRLPOOL_RADIUS = 25`, rest glow ellipse `radius+8` = 33, boss star `outerR = radius+12` = 37, dungeon spike `outerR = radius+10` = 35, `ctx.translate(x, y-10)`. Paint is `stroke` / `fill` / `fillText("★")`. Live main still inlines the same numbers at WX **3888–3919**. VAL-2026-08-31-016 already marks portals ineligible. VAL #880 cited WX 3898 as future-category clip only and did not see this extract.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new); `engine/visualPreview.ts` clip overlays; must not edit `engine/portalWhirlpool.ts`  
RECOMMENDED_ACTION: v1 library is combatant stills only. After #901, preview may import `PORTAL_WHIRLPOOL_RADIUS` for overlap warnings. Do not add a `PORTAL` `RENDER_PROFILE`. Do not `drawImage` inside `drawPortalWhirlpool`. Do not treat radius 25 / 33 / 37 as `RECOMMENDED_WIDTH`. Empty library + extracted whirlpool must still look like today’s pixels.  
AUTONOMY: SCOPE_GUARD — IMPLEMENT_WITH VAL-2026-08-31-016  
DEPENDENCIES: VAL-2026-08-31-016; VAL-2026-08-31-009; stack-compat with #901  
REGRESSION_RISK: HIGH if a hunter routes custom boss art through the boss-star branch or concatenates `drawPortalWhirlpool`; MEDIUM if upload UI asks for 25×25 “portal size.”  
VALIDATION_REQUIRED: Empty library: portal swirl unchanged. Spec sheet before picker does not list 25 / 33 / 37 as recommended sprite size. `python3 scripts/check-duplicate-exports.py src/frontend/src` after any import of #901.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Import #901 drawPortalWhirlpool after that PR — do not clone PORTAL_WHIRLPOOL_* into visualAssets or re-inline WX  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #901 adds `src/frontend/src/engine/portalWhirlpool.ts` + `.test.ts`, deletes ~171 WX lines, and documents the import as `../engine/portalWhirlpool` after `portalRules` / before `progression` so it does not collide with #659 `playerIncomingRes`. It explicitly says do not name the module `portalRender`. Oldest-first merge would duplicate-export `drawPortalWhirlpool` / `PORTAL_WHIRLPOOL_RADIUS` / `portalWhirlpoolPalette` if VAL copies those names. WX on `0f5363f` is still **19213** lines with the inline callback at 3888.  
SYSTEMS_AFFECTED: first `engine/visualAssets.ts` implementation PR; WX call site only after #901; tests  
RECOMMENDED_ACTION: VAL modules stay `visualAssets.ts` / `visualPreview.ts`. After #901 lands, import the named radius for clip math. Do not paste the whirlpool callback back into WX. Do not grow the rAF body. Keep one `export function` per name.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-10-23-001; VAL-2026-08-31-017; stack-compat with #901 / #659  
REGRESSION_RISK: HIGH if two copies of `drawPortalWhirlpool` fail Caffeine `vite build` / esbuild; HIGH if VAL names a file `portalRender.ts`.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Duplicate-export scan clean. Empty library pixels identical.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack AdminDashboard or recreate #883 spriteSaveClose / saveFeedback helpers for VAL CRUD  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#883](https://github.com/Mr-Melic/stralt/pull/883) (created 2026-10-22T00:13Z, 25 seconds after VAL #880) adds `adminOwnerUx.spriteSaveClose.ts`, `.saveFeedback.ts`, `.entitySaveConfirm.ts`, `.configWriterBusy.ts` and states it does **not** restack `AdminDashboard.tsx` and does **not** recreate #631 / #664 / #724 / #775 / #838. `shouldCloseOwnerEditorAfterSave` documents that SpriteList currently closes before walk-URL validation / `#ok`. VAL-2026-10-22-004 already forbade restacking for #838. Walk Animation Frames UI (`AdminDashboard.tsx` 1588–1620) is still stored-not-rendered.  
SYSTEMS_AFFECTED: admin upload UI (later); must not edit #883 files or `AdminDashboard.tsx` while older admin PRs queue  
RECOMMENDED_ACTION: Combat spec sheet helper keeps a **new** name (`combatVisualUploadSpecBeforeSelect`). After #883, import `shouldCloseOwnerEditorAfterSave` so an upload editor does not close before MIME/decode/size validation. Do not concatenate a second `shouldCloseOwnerEditorAfterSave`. Do not restack `AdminDashboard.tsx`. Do not implement walk cycles to make the heading true (VAL-018).  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-003 / VAL-2026-08-31-010 / VAL-2026-10-22-004  
DEPENDENCIES: VAL-2026-09-29-001; VAL-2026-10-22-004; stack-compat with #334 / #341 / #413 / #470 / #539 / #564 / #631 / #724 / #838 / #883  
REGRESSION_RISK: HIGH if VAL pastes `shouldCloseOwnerEditorAfterSave` and esbuild fails; HIGH if restacking AdminDashboard conflicts with the owner-UX queue.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Upload editor stays open on invalid PNG. Walk-frame paste still does not appear in combat.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Pack starter kits (#911) and continued boss-kit-share are not visual bind keys — portal Enemy still has no isBoss  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#911](https://github.com/Mr-Melic/stralt/pull/911) adds `engine/packEnemyKitAssign.ts` to fill empty pack `spells` from catalog starter ids. [#888](https://github.com/Mr-Melic/stralt/pull/888) / [#910](https://github.com/Mr-Melic/stralt/pull/910) share boss kit first-id execute with advertised range / summon ground range. Portal boss spawn still omits `isBoss` / `bossId` (WX **6522–6569**, `family: "boss"` at 6568, `scaleX/Y = 1.4`). Rush sets `isBoss: true` without `bossId` and uses lore `pieceType` (**5340 / 5365**). `drawCombatant` branch 1 requires `entity.isBoss && entity.bossId` (`pieceArt.ts` **856**). Live portal paint remains chess 8×8 × 1.4 ≈ 34×34. VAL-2026-10-22-005 already covered #861 auto-summon kits.  
SYSTEMS_AFFECTED: spawn bind; must not edit `packEnemyKitAssign.ts` / `bossKitRangedPrimaryExecute.ts`  
RECOMMENDED_ACTION: Bind stills on instance id (`boss_*`, `boss-rush-*`, `enemy-*`, `summon-${random}`). Do not key `boss_large` off kit resolve, starter ids, `isBoss`, or `family === "boss"`. Filling empty `spells` must not re-roll `visualAssetId`. Import kit helpers after those PRs; do not clone them into `visualAssets.ts`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-22-002 / VAL-2026-10-22-005  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-22-002; VAL-2026-10-22-006; stack-compat with #861 / #888 / #910 / #911  
REGRESSION_RISK: HIGH if a hunter keys custom boss art off `isBoss` and portal units stay chess while Rush units swap; HIGH if two copies of `assignPackEnemyKits` fail esbuild.  
VALIDATION_REQUIRED: Portal boss with empty library → chess × 1.4. Pack kit fill does not change appearance. 100 fake rAF ticks same instance → same bind.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not wait for VAL docs PRs #355–#880 — implement from merged 08-31 IDs on main  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f` (PR #332, 2026-09-21). Eleven open VAL docs PRs (#355 … #782, #835, **#880**) never merged. 32 days produced no combat `drawImage`. Merged actionable contract is `VAL-2026-08-31-001`…`019` plus implemented copy-honesty `VAL-2026-09-01-001`. Later VAL IDs are evidence refreshes (phones Continue, portal boss 34×34, squash 1.5, sibling extracts, #828 persist, #901 whirlpool). Oldest-first merge of eleven markdown PRs is not a prerequisite for `engine/visualAssets.ts`.  
SYSTEMS_AFFECTED: first implementation PR (new TS only); do not restack all VAL markdown  
RECOMMENDED_ACTION: First implementer PR ships `resolveRuntimeVisual` + tests that `[]` / inactive / corrupt → `{ kind: "builtin" }`. Read the 08-31 design + this fact sheet’s extract/viewport notes. Do not block on merging #355–#880. Do not concatenate eleven copies of `RENDER_PROFILES`.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper first; no RAF / mapGen / combat math.  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-08-31-017; VAL-2026-09-01-006; VAL-2026-10-22-008  
REGRESSION_RISK: LOW for skipping unread docs PRs; HIGH if a hunter waits for the stack and ships nothing, or concatenates `export function resolveRuntimeVisual` from multiple drafts.  
VALIDATION_REQUIRED: Empty library on `main`: pixels identical. New enemy/boss without uploads paints chess. `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 2026-10-23 RENDER_PROFILES — pixel boxes unchanged; cite named PORTAL_WHIRLPOOL_RADIUS after #901  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-derived this run: tile 80×40 (`gameConstants.ts` 6–7), cell 3px (WX 3855), draw point top+9, standard/player/summon 24×24, squash max **1.5** (`spawnPolicy.ts` 241–248) → elite rec **36**, portal boss live 8×8×1.4 ≈ **34×34** (no `isBoss`/`bossId` at 6524–6568), Rush `king.front` 24×24, hit **80×41**, shadow desktop 12×4.2, wall 28, neighbor (40,20), AO 8px floor, pads 10/14. Portal FX 25 / rest-glow 33 / boss-star 37 are live at WX 3888–3919 and become named exports in #901. Creation CSS **240×210** and shadcn **44px** (#895) are not upload sizes. Unchanged vs 10-22 except those citations.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. Custom default scale = 1. Do not invent 64×64 / 128×128. Do not key `boss_large` off `isBoss` / `family==="boss"`. Show the spec sheet **before** file selection. Import `PORTAL_WHIRLPOOL_RADIUS` after #901 for clip warnings only.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-004  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-22-002; VAL-2026-09-26-001; VAL-2026-10-22-009; VAL-2026-10-23-001  
REGRESSION_RISK: HIGH if upload UI asks for 128×128 or 25×25 portal FX and combat draws 24×24 centered, or boss PNGs are 1.4-stretched enemy art.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / 34×34 live boss / 36 elite-meta / alpha / 256 KiB. Reject JPEG. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity after #901 whirlpool extract and a 32-day freeze on 0f5363f  
CATEGORY: fallback-invariant  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `ctx.drawImage` and `createImageBitmap` returns no matches (comment only in `adminVisualStatus.ts`). `engine/visualAssets.ts` absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect`. #901 extract is still canvas path primitives — it does not add a bitmap resolver. New bosses still `BOSS_PIXEL_PATTERNS[bossId] ?? boss_12` (`enemyPixelPatterns.ts` 430–432) for the unused 8×12 path; live portal Enemy still chess × 1.4. New summons still `creaturePatterns`. VAL-2026-09-01-001 copy change did not wire combat. HEAD `0f5363f` since 2026-09-21. Queue through **#927** without a paint change on main.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons require no uploads. This ID is the 10-23 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-10-22-010, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-01-006; VAL-2026-10-22-010; VAL-2026-10-23-001  
REGRESSION_RISK: HIGH if a hunter wires `spriteUrl` into rAF “to make admin copy true,” or treats #901 as the custom-visual hook.  
VALIDATION_REQUIRED: Empty canister + empty library → today’s pixels. New `BossConfig` without art → generated pixels. After #901, portal swirl still paints with no library.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack WorldExploration or the #841 click-trace Vite alias — add #901 to the extract list  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX is **19213** lines on `0f5363f`. AGENTS.md forbids growing the rAF body. Open WX extracts: #427 / #514 / #591 / #639 / #683 / #730 / #798 / #831 / **#901**. Open PR [#841](https://github.com/Mr-Melic/stralt/pull/841) aliases `debug/clickTrace` in `vite.config.js` and **does not restack WX**. VAL-2026-10-22-007 already listed #798 / #831 / #841. `drawPixelPattern` trailing `restore` (WX 3883) has no save; it is also passed as `drawPattern` (8072). Player site remains a second wire (8315–8326).  
SYSTEMS_AFFECTED: `engine/visualAssets.ts`; WX at most two call sites; `vite.config.js` leave-alone  
RECOMMENDED_ACTION: New modules + tests. WX at most: pass resolver into `DrawCombatantOptions` and the player site (8315–8326). Import extract helpers after those PRs. Do not edit the click-trace stub plugin. Union overlapping files; one export per name.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-10-22-007  
DEPENDENCIES: VAL-2026-08-31-017; VAL-2026-09-28-001; VAL-2026-10-22-007; VAL-2026-10-23-002; stack-compat with #427 / #639 / #730 / #798 / #831 / #841 / #901  
REGRESSION_RISK: HIGH if VAL pastes a private `gridToScreen` or duplicates `drawPortalWhirlpool` / `stepCameraFollow` / `isoTileTopVertexRounded`; HIGH if `vite.config.js` is rewritten and the prod click-trace stub drops.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Empty library pixels identical. Duplicate-export scan clean. Production `vite build` still stubs click-trace after restack.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Spec sheet before file pick must not use whirlpool r=25, Button 44px, or creation CSS 240×210 as upload sizes  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live combat stills are 24×24 at tile top+9 (WX 8315–8326 / `drawPixelPattern` 3855). Creation preview is 80×80 art on internal canvas **320×280** with CSS **240×210** (`CharacterCreation.tsx` 151–153, 452–463). Portrait is **60×60** (WX 18109–18114). Admin catalog preview is 72×72 `object-fit:contain`. Open PR [#895](https://github.com/Mr-Melic/stralt/pull/895) raises shadcn Button default/icon floor to **44px** (`button.tsx`) — touch-target a11y, not a sprite box. Portal FX radii 25/33/37 are #901 clip geometry. VAL-2026-10-22-003 already forbade 240×210 as upload size and did not cite #895 / #901.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; admin spec sheet  
RECOMMENDED_ACTION: Spec sheet **before** file pick lists 24×24 (48 @2×), live boss 34×34, elite-meta 36, PNG/WebP, alpha, 256 KiB. Explicitly reject using 44 / 25 / 33 / 37 / 60 / 72 / 240×210 / 320×280 / 80×41 as recommended art size. Use 44px only for the picker **button** hit target after #895.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-10-22-003  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-10-22-003; VAL-2026-10-23-001; VAL-2026-10-23-006  
REGRESSION_RISK: HIGH if owners author against the 240×210 creation box or a 44px button and combat draws 24×24 centered.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / alpha / 256 KiB and names the forbidden HUD/creation/portal/a11y sizes. Reject JPEG. Empty library player still chess.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player stills still bypass drawCombatant — second wire at WX 8315; #901 does not replace that site  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemies/summons/bosses use `drawCombatant` (WX 8063–8075) with `drawPattern: drawPixelPattern` (8072). Player uses `drawPixelPattern` + `getPersistedPiecePattern` (8315–8326) and is **not** in `combatantsRef` (sprite key `"player"`, drawOrder 99999 at 8337–8342). `DrawCombatantOptions` still has no bitmap hook (`pieceArt.ts` 714–744). `drawPixelPattern` trailing `restore` (3883) has no save. #901 only moves portal FX; it does not touch the player site. Putting `drawImage` inside `drawPixelPattern` would hit the player site **and** every combatant branch plus pop the moving-enemy save (8057–8076).  
SYSTEMS_AFFECTED: `pieceArt.ts` `drawCombatant`; WX player site 8315–8326  
RECOMMENDED_ACTION: Optional top branch on `drawCombatant` **and** one player-site call that uses the same resolver keyed by `pieceType`+`playerView`. Omitted option ≡ today. Set `imageSmoothingEnabled = false` on the shaken rAF ctx immediately before `drawImage` (scale/shake at 7263–7267 reset 2D state; CSS `image-rendering: pixelated` at WX 17890 / `index.css` 652–655 is display-time). Do not add the player to `combatantsRef` from this library. Do not draw the player through `drawPortalWhirlpool`.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011 / VAL-2026-09-01-007 / VAL-2026-10-22-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-10-22-011; VAL-2026-10-23-002  
REGRESSION_RISK: HIGH if only the enemy dispatch paints PNGs and the player stays chess (or vice versa); HIGH if `drawPattern` is overloaded to accept ImageBitmap.  
VALIDATION_REQUIRED: No option / empty library → fillRect both sites. Custom player revoke → next frame chess. Enemy custom does not require a player upload. Bound 24×24 PNG stays crisp after resize and hit-shake.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Version-gate and remount-keep PRs still do not preserve visual-library keys — uploads stay canister DRAFT  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and keys ending `_inventory`. `App.tsx` 297–318 still `localStorage.clear()` on `APP_VERSION`. Open persist remount PRs after VAL #880 — #900 / #909 / #912 / #918 / #919 / #926 / **#927** — skip shop/death wipes after a successful keep without unpaid death. None add visual-library keys. VAL-2026-09-25 already required canister DRAFT until ACTIVE.  
SYSTEMS_AFFECTED: library persistence; must not extend `shouldPreserveVersionGateKey` from this designer without a dedicated persist ID  
RECOMMENDED_ACTION: Bytes live in object storage; metadata in optional admin maps. Never `localStorage` / `nsKey` / `Character.pixelPattern`. Drafts never enter `resolveRuntimeVisual`. Safe-delete / deactivate does not depend on version-gate preserve. Do not restack the remount-keep helpers.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002 / VAL-2026-08-31-014  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014; VAL-2026-10-22-001; stack-compat with version-gate / remount-keep PRs  
REGRESSION_RISK: HIGH if a hunter stores ImageBitmap keys in `localStorage` and an `APP_VERSION` bump silently empties the library while combat still expects ids; HIGH if VAL concatenates remount-keep skip helpers.  
VALIDATION_REQUIRED: Version bump with a DRAFT asset → combat stays builtin. Empty library after wipe → chess pixels. Duplicate-export scan clean vs remount-keep PRs.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-23-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#880  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, #694, #715, #782, #835, **#880**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings or #724 / #798 / #828 / #838 / #841 / #861 / **#883** / **#901** / **#911** TS. Rewriting `ACTION_IDS_VAL_2026-10-22.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-10-23.md`, `docs/automation/ACTION_IDS_VAL_2026-10-23.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers with #724 / #639 / #631 / #730 / #798 / #795 / #828 / #831 / #838 / #841 / #861 / #883 / #901 / #911.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-10-23 ACTION_IDs. Production code not modified.*
