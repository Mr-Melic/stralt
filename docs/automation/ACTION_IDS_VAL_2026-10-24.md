# ACTION_IDs — 2026-10-24 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-10-24.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-10-24.md).  
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
- `VAL-2026-10-23-001` … `012` in PR [#930](https://github.com/Mr-Melic/stralt/pull/930) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-10-24

| ID | Status 2026-10-24 |
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
| VAL-2026-10-22-004 don't restack AdminDashboard / #838 | **Extended** by VAL-2026-10-23-003 (#883) then **VAL-2026-10-24-003** (#945) |
| VAL-2026-10-22-007 don't restack WX / #841 | **Extended** by VAL-2026-10-23-002 / 008 (#901) then **VAL-2026-10-24-001 / 002 / 008** (#961) |
| VAL-2026-10-22-005 auto-summon kits not visual | **Extended** by VAL-2026-10-23-004 (#911) then pack-enemy DoT/buff share #947 / #967 / #972 / #974 / #978 |
| VAL-2026-10-21-006 skip docs PRs #355–#782 | **Extended** by VAL-2026-10-22-008 (#835) then VAL-2026-10-23-005 (#880) then **VAL-2026-10-24-005** (#930) |
| VAL-2026-10-23-001 / 002 #901 whirlpool | still valid; #901 still OPEN. #961 is a **second** paint extract, not a replacement. |
| VAL-2026-10-23-009 forbidden 44 / 240×210 | **Extended** by VAL-2026-10-24-009 (#935 Input/Select 44px; #966 lobby 120/192) |

---

ACTION_ID: VAL-2026-10-24-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not put drawImage inside #961 engine/pixelPattern.ts — PIXEL_PATTERN_CELL_SIZE is 3; unpaired restore stays; drawPatternInline is a different fallback  
CATEGORY: scope  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#961](https://github.com/Mr-Melic/stralt/pull/961) (created 2026-10-23T00:22Z, ~12 minutes after VAL docs #930) extracts WX `drawPixelPattern` into `engine/pixelPattern.ts`. Named `PIXEL_PATTERN_CELL_SIZE = 3`. `pixelPatternOrigin` centers with `Math.round(x − width/2)`. `drawPixelPattern` still calls `ctx.restore()` with **no** matching `save` — live RAF callers rely on that pop (WX moving-enemy save at **8057–8076**; player site **8315–8326**; `drawPattern` injection **8072**). The extract comment forbids unifying with `pieceArt.drawPatternInline` (`pieceArt.ts` 753–782), which is fill-only and does **not** restore. Live main still inlines the same loop at WX **3841–3886** (`pixelSize = 3`, restore at **3883**). Zero `drawImage` in the extract.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new); must not edit `engine/pixelPattern.ts` to accept ImageBitmap  
RECOMMENDED_ACTION: Custom stills are an optional top branch on `drawCombatant` plus one player-site call. Do not overload `drawPixelPattern` / `pixelPatternCellColor` to paint PNGs. Do not put `drawImage` before the unpaired `restore`. Do not merge `drawPatternInline` into `pixelPattern.ts` to “clean up” restore. Empty library + extracted paint must still look like today’s pixels.  
AUTONOMY: SCOPE_GUARD — IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-02-003; VAL-2026-10-23-010; stack-compat with #961  
REGRESSION_RISK: HIGH if a hunter routes PNGs through `drawPattern` and pops the moving-enemy save; HIGH if unifying inline+extracted paint drops the unpaired restore the player site depends on.  
VALIDATION_REQUIRED: Empty library: chess pixels identical with and without #961. Custom 24×24 PNG is not drawn from inside `pixelPattern.ts`. `python3 scripts/check-duplicate-exports.py src/frontend/src` after any import of #961.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Import #961 pixelPatternOrigin / PIXEL_PATTERN_CELL_SIZE after that PR — do not clone paint math or re-inline the WX wrapper  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #961 adds `src/frontend/src/engine/pixelPattern.ts` + `.test.ts`, deletes ~30 WX lines from the callback body, and keeps an empty-deps `useCallback` wrapper so call sites stay stable. Tests lock 3px cells, rounded origin, skip-zero cells, ceil scaled size, and restore-without-save. Oldest-first merge would duplicate-export `drawPixelPattern` / `PIXEL_PATTERN_CELL_SIZE` / `pixelPatternOrigin` if VAL copies those names. WX on `0f5363f` is still **19213** lines with the inline callback at 3841.  
SYSTEMS_AFFECTED: first `engine/visualAssets.ts` / `visualPreview.ts` implementation PR; WX wrapper leave-alone after #961; tests  
RECOMMENDED_ACTION: VAL modules stay `visualAssets.ts` / `visualPreview.ts`. After #961, import `pixelPatternOrigin` for iso-preview dummy alignment and `PIXEL_PATTERN_CELL_SIZE` when documenting the cell. Do not paste the fillRect loop back into WX. Do not grow the rAF body. Keep one `export function` per name. Do not name a VAL file `pixelPattern.ts`.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-10-24-001; VAL-2026-08-31-017; stack-compat with #961  
REGRESSION_RISK: HIGH if two copies of `drawPixelPattern` fail Caffeine `vite build` / esbuild; HIGH if VAL re-inlines the loop and #961’s wrapper also remains.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Duplicate-export scan clean. Empty library pixels identical.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack AdminDashboard or recreate #945 ownerVisualRevert helpers — empty after revert is a valid Default Pixel Visual  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#945](https://github.com/Mr-Melic/stralt/pull/945) (created 2026-10-23T00:14Z, ~5 minutes after VAL #930) adds `adminOwnerUx.visualRevert.ts` (`ownerVisualRevertLabel` → `"Revert to Default Pixel Visual"`, `shouldOfferOwnerVisualRevert`, `ownerVisualRevertLeavesValidEmpty`, `ownerVisualRevertStatusAfterClear` → `DEFAULT_PIXEL_VISUAL_STATUS`, `ownerVisualRevertConfirmBody` for enemy/sprite/ad). Comment: ads have “Clear to default”; enemy/player-sprite editors have **no** Revert control; emptying the URL is implicit; empty after revert is valid, never an error. Explicitly **not wired** into `AdminDashboard.tsx` and must not merge into #724 `visualPool.ts` or #631 `visualPreview.ts`. VAL-2026-10-23-003 already forbade restacking for #883. Walk Animation Frames UI (`AdminDashboard.tsx` **1590**) is still stored-not-rendered.  
SYSTEMS_AFFECTED: admin upload UI (later); must not edit #945 files or `AdminDashboard.tsx` while older admin PRs queue  
RECOMMENDED_ACTION: Combat spec sheet helper keeps a **new** name (`combatVisualUploadSpecBeforeSelect`). After #945, import `ownerVisualRevertLabel` / `shouldOfferOwnerVisualRevert` / `ownerVisualRevertLeavesValidEmpty` so revert-to-default treats empty as valid builtin. Do not concatenate a second `ownerVisualRevertLabel`. Do not restack `AdminDashboard.tsx`. Do not implement walk cycles to make the heading true (VAL-018).  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-010 / VAL-2026-10-23-003  
DEPENDENCIES: VAL-2026-09-29-001; VAL-2026-10-22-004; VAL-2026-10-23-003; stack-compat with #334 / #341 / #413 / #470 / #539 / #564 / #631 / #724 / #838 / #883 / #945  
REGRESSION_RISK: HIGH if VAL pastes `ownerVisualRevertLabel` and esbuild fails; HIGH if restacking AdminDashboard conflicts with the owner-UX queue; MEDIUM if empty-after-revert is shown as a validation error and owners cannot return to builtin.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Revert of a bound still → next frame chess, no error toast. Walk-frame paste still does not appear in combat.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: #966 lobby chessPiecePatterns share is not a combat bind — CSS 120 / painted 192×192 is not an upload size; pack-enemy kit-share still is not a visual key  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#966](https://github.com/Mr-Melic/stralt/pull/966) (created 2026-10-23T06:22Z) deletes the duplicated `CHESS_PIECE_PATTERNS` table from `CharacterSelection.tsx` and imports `chessPiecePatterns` from `pieceArt`. Lobby `CharacterPreview` still defaults `size = 120` (CSS), `internalSize = size * 2` = **240**, `pixelSize = floor(internalSize / 10)` = **24**, so an 8×8 grid paints **192×192** on the internal canvas (`CharacterSelection.tsx` 310–348 on main; same math after the import). Combat stills are 8×8 × **3** = **24×24** (WX 3855 / #961 `PIXEL_PATTERN_CELL_SIZE`). Pack-enemy siblings after VAL #930 — [#947](https://github.com/Mr-Melic/stralt/pull/947) / [#967](https://github.com/Mr-Melic/stralt/pull/967) / [#972](https://github.com/Mr-Melic/stralt/pull/972) / [#974](https://github.com/Mr-Melic/stralt/pull/974) / [#978](https://github.com/Mr-Melic/stralt/pull/978) — share DoT / buff / Inferno decide+execute. They do **not** set `isBoss` / `bossId` on the portal Enemy (WX **6522–6569**). VAL-2026-10-23-004 already covered #911 pack starter kits.  
SYSTEMS_AFFECTED: spawn bind; must not restack `CharacterSelection.tsx` or edit pack-enemy kit helpers  
RECOMMENDED_ACTION: v1 lobby / portrait / creation stay generated pixels. Do not preview custom stills by restacking #966. Do not list 120 / 192 / 240 as `RECOMMENDED_WIDTH`. Bind stills on instance id (`boss_*`, `boss-rush-*`, `enemy-*`, `summon-${random}`). Do not key `boss_large` off kit resolve, starter ids, `isBoss`, or `family === "boss"`. Filling or sharing `spells` must not re-roll `visualAssetId`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-22-002 / VAL-2026-10-23-004  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-22-002; VAL-2026-10-23-004; stack-compat with #911 / #947 / #966 / #967 / #972 / #974 / #978  
REGRESSION_RISK: HIGH if a hunter keys custom player art off the lobby 192×192 box and combat draws 24×24 centered; HIGH if two copies of `chessPiecePatterns` / pack-kit helpers fail esbuild.  
VALIDATION_REQUIRED: Empty library player in world is 24×24 chess. Lobby still paints catalog grids. Pack kit fill does not change appearance. 100 fake rAF ticks same instance → same bind.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not wait for VAL docs PRs #355–#930 — implement from merged 08-31 IDs on main  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f` (PR #332, 2026-09-21). Twelve open VAL docs PRs (#355 … #782, #835, #880, **#930**) never merged. 33 days produced no combat `drawImage`. Merged actionable contract is `VAL-2026-08-31-001`…`019` plus implemented copy-honesty `VAL-2026-09-01-001`. Later VAL IDs are evidence refreshes (phones Continue, portal boss 34×34, squash 1.5, sibling extracts, #828 persist, #901 whirlpool, **#961 pixelPattern**). Oldest-first merge of twelve markdown PRs is not a prerequisite for `engine/visualAssets.ts`.  
SYSTEMS_AFFECTED: first implementation PR (new TS only); do not restack all VAL markdown  
RECOMMENDED_ACTION: First implementer PR ships `resolveRuntimeVisual` + tests that `[]` / inactive / corrupt → `{ kind: "builtin" }`. Read the 08-31 design + this fact sheet’s extract/viewport notes. Do not block on merging #355–#930. Do not concatenate twelve copies of `RENDER_PROFILES`.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper first; no RAF / mapGen / combat math.  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-08-31-017; VAL-2026-09-01-006; VAL-2026-10-23-005  
REGRESSION_RISK: LOW for skipping unread docs PRs; HIGH if a hunter waits for the stack and ships nothing, or concatenates `export function resolveRuntimeVisual` from multiple drafts.  
VALIDATION_REQUIRED: Empty library on `main`: pixels identical. New enemy/boss without uploads paints chess. `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 2026-10-24 RENDER_PROFILES — pixel boxes unchanged; cite PIXEL_PATTERN_CELL_SIZE after #961  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-derived this run: tile 80×40 (`gameConstants.ts` 6–7), cell 3px (WX 3855; after #961 `PIXEL_PATTERN_CELL_SIZE`), draw point top+9, standard/player/summon 24×24, squash max **1.5** (`spawnPolicy.ts` 241–248) → elite rec **36**, portal boss live 8×8×1.4 ≈ **34×34** (no `isBoss`/`bossId` at 6524–6568), Rush `king.front` 24×24, hit **80×41**, shadow desktop 12×4.2, wall 28, neighbor (40,20), AO 8px floor, pads 10/14. Portal FX 25 / rest-glow 33 / boss-star 37 are live at WX 3888–3919 and become named exports in #901. Creation CSS **240×210**, lobby CSS **120** / painted **192×192**, shadcn **44px** (#895 / #935) are not upload sizes. Unchanged vs 10-23 except those citations.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. Custom default scale = 1. Do not invent 64×64 / 128×128. Do not key `boss_large` off `isBoss` / `family==="boss"`. Show the spec sheet **before** file selection. Import `PIXEL_PATTERN_CELL_SIZE` after #961 for cell math only — do not list 3 as recommended sprite width. Import `PORTAL_WHIRLPOOL_RADIUS` after #901 for clip warnings only.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-004  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-22-002; VAL-2026-09-26-001; VAL-2026-10-23-006; VAL-2026-10-24-001  
REGRESSION_RISK: HIGH if upload UI asks for 128×128, 192×192 lobby, or 3×3 cells as the still size and combat draws 24×24 centered, or boss PNGs are 1.4-stretched enemy art.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / 34×34 live boss / 36 elite-meta / alpha / 256 KiB. Reject JPEG. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity after #961 pixelPattern extract and a 33-day freeze on 0f5363f  
CATEGORY: fallback-invariant  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `ctx.drawImage` and `createImageBitmap` returns no matches (comment only in `adminVisualStatus.ts`). `engine/visualAssets.ts` absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect`. #961 extract is still canvas `fillRect` cells — it does not add a bitmap resolver. New bosses still `BOSS_PIXEL_PATTERNS[bossId] ?? boss_12` (`enemyPixelPatterns.ts` 430–432) for the unused 8×12 path; live portal Enemy still chess × 1.4. New summons still `creaturePatterns`. VAL-2026-09-01-001 copy change did not wire combat. HEAD `0f5363f` since 2026-09-21. Queue through **#979** without a paint change on main.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons require no uploads. This ID is the 10-24 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-10-23-007, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-01-006; VAL-2026-10-23-007; VAL-2026-10-24-001  
REGRESSION_RISK: HIGH if a hunter wires `spriteUrl` into rAF “to make admin copy true,” or treats #961 as the custom-visual hook.  
VALIDATION_REQUIRED: Empty canister + empty library → today’s pixels. New `BossConfig` without art → generated pixels. After #961, player and combatant fillRect still paint with no library.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack WorldExploration or the #841 click-trace Vite alias — add #961 to the extract list  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX is **19213** lines on `0f5363f`. AGENTS.md forbids growing the rAF body. Open WX extracts: #427 / #514 / #591 / #639 / #683 / #730 / #798 / #831 / #901 / **#961**. Open PR [#841](https://github.com/Mr-Melic/stralt/pull/841) aliases `debug/clickTrace` in `vite.config.js` and **does not restack WX**. VAL-2026-10-23-008 already listed #798 / #831 / #841 / #901. `drawPixelPattern` trailing `restore` (WX 3883) has no save; it is also passed as `drawPattern` (8072). Player site remains a second wire (8315–8326).  
SYSTEMS_AFFECTED: `engine/visualAssets.ts`; WX at most two call sites; `vite.config.js` leave-alone  
RECOMMENDED_ACTION: New modules + tests. WX at most: pass resolver into `DrawCombatantOptions` and the player site (8315–8326). Import extract helpers after those PRs. Do not edit the click-trace stub plugin. Union overlapping files; one export per name.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-10-23-008  
DEPENDENCIES: VAL-2026-08-31-017; VAL-2026-09-28-001; VAL-2026-10-23-008; VAL-2026-10-24-002; stack-compat with #427 / #639 / #730 / #798 / #831 / #841 / #901 / #961  
REGRESSION_RISK: HIGH if VAL pastes a private `gridToScreen` or duplicates `drawPixelPattern` / `drawPortalWhirlpool` / `stepCameraFollow` / `isoTileTopVertexRounded`; HIGH if `vite.config.js` is rewritten and the prod click-trace stub drops.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Empty library pixels identical. Duplicate-export scan clean. Production `vite build` still stubs click-trace after restack.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Spec sheet before file pick must not use lobby 120/192, PIXEL_PATTERN_CELL_SIZE 3, or #935 Input/Select 44px as upload sizes  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live combat stills are 24×24 at tile top+9 (WX 8315–8326 / `drawPixelPattern` 3855). Creation preview is 80×80 art on internal canvas **320×280** with CSS **240×210** (`CharacterCreation.tsx` 151–153, 452–463). Portrait is **60×60** (WX 18108–18115). Admin catalog preview is 72×72 `object-fit:contain`. Lobby `CharacterPreview` is CSS **120** / internal **240** / painted **192×192** at 24px cells (`CharacterSelection.tsx` 310–348). Open PR [#935](https://github.com/Mr-Melic/stralt/pull/935) raises shadcn Input / Select / Tabs / OTP floor to **44px** — extends #895 Button 44px; touch-target a11y, not a sprite box. `PIXEL_PATTERN_CELL_SIZE = 3` after #961 is the **cell**, not the still. Portal FX radii 25/33/37 are #901 clip geometry. VAL-2026-10-23-009 already forbade 240×210 / Button 44 / whirlpool 25.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; admin spec sheet  
RECOMMENDED_ACTION: Spec sheet **before** file pick lists 24×24 (48 @2×), live boss 34×34, elite-meta 36, PNG/WebP, alpha, 256 KiB. Explicitly reject using 3 / 44 / 25 / 33 / 37 / 60 / 72 / 120 / 192 / 240×210 / 320×280 / 80×41 as recommended art size. Use 44px only for picker **button/input** hit targets after #895 / #935.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-10-23-009  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-10-23-009; VAL-2026-10-24-004; VAL-2026-10-24-006  
REGRESSION_RISK: HIGH if owners author against the lobby 192×192 box or a 44px input and combat draws 24×24 centered.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / alpha / 256 KiB and names the forbidden HUD/creation/lobby/portal/a11y/cell sizes. Reject JPEG. Empty library player still chess.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player stills still bypass drawCombatant — second wire at WX 8315; #961 does not replace that site  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemies/summons/bosses use `drawCombatant` (WX 8063–8075) with `drawPattern: drawPixelPattern` (8072). Player uses `drawPixelPattern` + `getPersistedPiecePattern` (8315–8326) and is **not** in `combatantsRef` (sprite key `"player"`, drawOrder 99999 at 8337–8342). `DrawCombatantOptions` still has no bitmap hook (`pieceArt.ts` 714–744). `drawPixelPattern` trailing `restore` (3883) has no save. #961 only moves the fillRect loop; the WX wrapper still serves **both** the player site and every combatant branch. Putting `drawImage` inside `engine/pixelPattern.ts` would hit the player site **and** every combatant branch plus pop the moving-enemy save (8057–8076). `toCombatantEntry` (`combatantStore.ts` 141–168) still drops unknown fields — bind lives on `combatantsRef` Enemy, not turn-order rows. Player bind keys `pieceType`+`playerView`.  
SYSTEMS_AFFECTED: `pieceArt.ts` `drawCombatant`; WX player site 8315–8326  
RECOMMENDED_ACTION: Optional top branch on `drawCombatant` **and** one player-site call that uses the same resolver keyed by `pieceType`+`playerView`. Omitted option ≡ today. Set `imageSmoothingEnabled = false` on the shaken rAF ctx immediately before `drawImage` (scale/shake at 7263–7267 reset 2D state; CSS `image-rendering: pixelated` at WX 17890 / `index.css` 652–655 is display-time). Do not add the player to `combatantsRef` from this library. Do not draw the player through `drawPixelPattern` ImageBitmap overload.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011 / VAL-2026-09-01-007 / VAL-2026-10-23-010  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-10-23-010; VAL-2026-10-24-001  
REGRESSION_RISK: HIGH if only the enemy dispatch paints PNGs and the player stays chess (or vice versa); HIGH if `drawPattern` is overloaded to accept ImageBitmap.  
VALIDATION_REQUIRED: No option / empty library → fillRect both sites. Custom player revoke → next frame chess. Enemy custom does not require a player upload. Bound 24×24 PNG stays crisp after resize and hit-shake.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Version-gate and remount-keep PRs through #979 still do not preserve visual-library keys — uploads stay canister DRAFT  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and keys ending `_inventory`. `App.tsx` 297–318 still `localStorage.clear()` on `APP_VERSION`. Open persist remount PRs after VAL #930 — #938 / #964 / #969 / #971 / #977 / **#979** — skip shop/death/rename wipes after a successful keep without unpaid death. None add visual-library keys. VAL-2026-09-25 already required canister DRAFT until ACTIVE. VAL-2026-10-23-011 covered through #927.  
SYSTEMS_AFFECTED: library persistence; must not extend `shouldPreserveVersionGateKey` from this designer without a dedicated persist ID  
RECOMMENDED_ACTION: Bytes live in object storage; metadata in optional admin maps. Never `localStorage` / `nsKey` / `Character.pixelPattern`. Drafts never enter `resolveRuntimeVisual`. Safe-delete / deactivate does not depend on version-gate preserve. Do not restack the remount-keep helpers.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002 / VAL-2026-08-31-014  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014; VAL-2026-10-23-011; stack-compat with version-gate / remount-keep PRs  
REGRESSION_RISK: HIGH if a hunter stores ImageBitmap keys in `localStorage` and an `APP_VERSION` bump silently empties the library while combat still expects ids; HIGH if VAL concatenates remount-keep skip helpers.  
VALIDATION_REQUIRED: Version bump with a DRAFT asset → combat stays builtin. Empty library after wipe → chess pixels. Duplicate-export scan clean vs remount-keep PRs.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-24-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#930  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, #694, #715, #782, #835, #880, **#930**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings or #724 / #798 / #828 / #838 / #841 / #861 / #883 / #901 / #911 / **#945** / **#961** / **#966** TS. Rewriting `ACTION_IDS_VAL_2026-10-23.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-10-24.md`, `docs/automation/ACTION_IDS_VAL_2026-10-24.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers with #724 / #639 / #631 / #730 / #798 / #795 / #828 / #831 / #838 / #841 / #861 / #883 / #901 / #911 / #945 / #961 / #966.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-10-24 ACTION_IDs. Production code not modified.*
