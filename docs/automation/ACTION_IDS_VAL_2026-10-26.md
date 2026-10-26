# ACTION_IDs — 2026-10-26 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-10-26.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-10-26.md).  
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
- `VAL-2026-10-24-001` … `012` in PR [#990](https://github.com/Mr-Melic/stralt/pull/990) (open, not on main).
- `VAL-2026-10-25-001` … `012` in PR [#1051](https://github.com/Mr-Melic/stralt/pull/1051) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-10-26

| ID | Status 2026-10-26 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts`; HEAD still `0f5363f` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 |
| VAL-2026-09-25-011 elite rec 34 | Corrected by VAL-2026-09-26-001 (squash max 1.5 → rec 36) |
| VAL-2026-09-26-005 Rest/Death desktop follow pane | **Corrected** by VAL-2026-09-27-001 (desktop paint ignores `cameraRef`) |
| VAL-2026-09-27-001 | **Extended** by VAL-2026-10-21-004: Rest/Death **does** pan when `!isDesktop` |
| VAL-2026-09-28-001 share gridToScreen / #639 | still OPEN; `isoGrid.ts` absent on `0f5363f`. **#995 `tilePaint.ts` is a different extract**. **#1076 `mapHazardPaint.ts` is a fourth** (hazard overlay, not the projector / not combatants). |
| VAL-2026-09-29-001 #724 spec-sheet collision | still valid; #724 still OPEN |
| VAL-2026-10-21-001 / 004 `#798` cameraFollow | still valid; #798 still OPEN |
| VAL-2026-10-22-004 don't restack AdminDashboard / #838 | **Extended** by VAL-2026-10-23-003 (#883) then VAL-2026-10-24-003 (#945) then VAL-2026-10-25-003 (#1001) then **VAL-2026-10-26-004** (#1066) |
| VAL-2026-10-22-007 don't restack WX / #841 | **Extended** by VAL-2026-10-23-002 / 008 (#901) then VAL-2026-10-24-001 / 002 / 008 (#961) then VAL-2026-10-25-001 / 002 / 008 (#995) then **VAL-2026-10-26-001 / 002 / 008** (#1076) |
| VAL-2026-10-22-005 auto-summon kits not visual | **Extended** by VAL-2026-10-23-004 (#911) then pack-enemy DoT/buff share #947+ then VAL-2026-10-25-004 (#985…#1042) then **VAL-2026-10-26-005** (#1054…#1107) |
| VAL-2026-10-21-006 skip docs PRs #355–#782 | **Extended** by VAL-2026-10-22-008 (#835) then VAL-2026-10-23-005 (#880) then VAL-2026-10-24-005 (#930) then VAL-2026-10-25-005 (#990) then **VAL-2026-10-26-006** (#1051) |
| VAL-2026-10-23-001 / 002 #901 whirlpool | still valid; #901 still OPEN. #961 is a **second** paint extract. #995 is a **third**. **#1076 is a fourth** (hazards, not swirl / not tiles / not combatants). |
| VAL-2026-10-24-001 / 002 #961 pixelPattern | still valid; #961 still OPEN. Do not unify with #995 `tilePaint.ts` or #1076 `mapHazardPaint.ts`. |
| VAL-2026-10-25-001 / 002 #995 tilePaint | still valid; #995 still OPEN. Do not unify with #1076. |
| VAL-2026-10-23-009 forbidden 44 / 240×210 | **Extended** by VAL-2026-10-24-009 (#935 / #966) then VAL-2026-10-25-009 (#1010 / #995 wall 28) then **VAL-2026-10-26-009** (#1068 ToggleGroup 44px; #1076 grain 2–3 / lava 4) |
| VAL-2026-10-24-003 #945 visualRevert | still valid; #945 still OPEN. #1001 / #1066 do **not** replace revert helpers. |
| VAL-2026-10-24-011 remount through #979 | **Extended** by VAL-2026-10-25-011 through #1043 then **VAL-2026-10-26-011** through **#1107** / **#1099** |
| VAL-2026-10-25-010 player second wire | **Extended** by **VAL-2026-10-26-003 / 010**: #1059 extracts summon tint; player site still bypasses `drawCombatant`. |

---

ACTION_ID: VAL-2026-10-26-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not put drawImage inside #1076 engine/mapHazardPaint.ts — overlay grain is 2–3px fillRect; lava 4×4; ice 3×3; spikes 2×2/4×3  
CATEGORY: scope  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#1076](https://github.com/Mr-Melic/stralt/pull/1076) (created 2026-10-25T00:18Z, ~6 minutes after VAL docs #1051) extracts WX lava/ice/spikes overlay into `engine/mapHazardPaint.ts`. Seed `Math.abs(x*7331 + y*5003 + mapId.charCodeAt(0))`. Grain count `floor(rng*21)+30` (30–50) rects of size 2 or 3. Lava glow four 4×4 rects; ice 3×3 arms; spikes tip 2×2 / body 4×3. Clip is the iso diamond from the **top vertex**. Comment forbids folding into `tilePaint.ts` or `barrierRender.ts`. Gameplay (damage / walk tax / challenge) stays in WX. Live main still inlines the overlay at WX **7416–**. Zero `drawImage`. After merge WX 19213 → 19117.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new); must not edit `engine/mapHazardPaint.ts` to accept ImageBitmap  
RECOMMENDED_ACTION: Custom stills are an optional top branch on `drawCombatant` plus one player-site call. Do not overload `drawHazardOverlay` to paint PNGs onto lava/ice/spikes. Do not treat grain 2 / 3 / 4 as `RECOMMENDED_WIDTH`. Do not merge `mapHazardPaint.ts` into `tilePaint.ts` / `isoGrid.ts` / `portalWhirlpool.ts` / `pixelPattern.ts` / `barrierRender.ts`. Empty library + extracted overlay must still look like today’s floors.  
AUTONOMY: SCOPE_GUARD — IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-08-31-016; VAL-2026-10-23-001; VAL-2026-10-24-001; VAL-2026-10-25-001; stack-compat with #1076  
REGRESSION_RISK: HIGH if a hunter routes PNGs through `drawHazardOverlay` and every lava tile becomes a sprite; HIGH if unifying hazard+tilePaint changes walk-tax adjacency; HIGH if `hazardOverlaySeed` is reused as a combatant pool hash.  
VALIDATION_REQUIRED: Empty library: chess pixels identical with and without #1076. Custom 24×24 PNG is not drawn from inside `mapHazardPaint.ts`. Lava/ice/spikes still clip to the 80×40 diamond. `python3 scripts/check-duplicate-exports.py src/frontend/src` after any import of #1076.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Import #1076 drawHazardOverlay / shouldPaintHazardOverlay after that PR — do not clone overlay paint or name a VAL file mapHazardPaint.ts  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #1076 adds `src/frontend/src/engine/mapHazardPaint.ts` + `.test.ts` (18 characterization tests locking seed, tints, grain count, extra rng draws, lava pulse `nowMs`, save/restore). Import slot is after `mapGen` / before `mapModifiers` — unique vs #639 `isoGrid`, #901 `portalWhirlpool`, #961 `pixelPattern`, #995 `tilePaint` (`targeting`/`turnQueue`). Oldest-first merge would duplicate-export `drawHazardOverlay` / `shouldPaintHazardOverlay` / `hazardOverlaySeed` if VAL copies those names. WX on `0f5363f` is still **19213** lines with the inline overlay at 7416.  
SYSTEMS_AFFECTED: first `engine/visualAssets.ts` / `visualPreview.ts` implementation PR; WX wrapper leave-alone after #1076; tests  
RECOMMENDED_ACTION: VAL modules stay `visualAssets.ts` / `visualPreview.ts`. After #1076, import `drawHazardOverlay` only to stamp an optional **preview clip warning** under dummy combatants. Do not paste the grain loop back into WX. Do not grow the rAF body. Keep one `export function` per name. Do not name a VAL file `mapHazardPaint.ts`. Do not use `hazardOverlaySeed` as `pickWeighted` input.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-10-26-001; VAL-2026-08-31-017; stack-compat with #639 / #901 / #961 / #995 / #1076  
REGRESSION_RISK: HIGH if two copies of `drawHazardOverlay` fail Caffeine `vite build` / esbuild; HIGH if VAL re-inlines the overlay and #1076’s wrapper also remains; MEDIUM if preview always paints lava under every still.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Duplicate-export scan clean. Empty library pixels identical. Preview floor uses `drawIsometricTile` (after #995); hazard warning uses `drawHazardOverlay` only when the owner toggles it; dummy still uses pixelPatternOrigin + optional bitmap.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: After #1059, summon custom stills must reuse stroke-only ownerTintStroke — do not restore shadowBlur 8 or concatenate strokeOwnerTint  
CATEGORY: renderer  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#1059](https://github.com/Mr-Melic/stralt/pull/1059) (PERF-2026-10-25-178) extracts `strokeOwnerTint` to `src/frontend/src/data/ownerTintStroke.ts` and **removes** `ctx.shadowBlur = 8` / `shadowColor`. Stroke stays 2px, green player / red enemy, rect from `pattern cols/rows × pixelSize 3 × scale`. Live main still blurs (`pieceArt.ts` **804–809**). `drawCombatant` summon branch always calls the helper after `fillRect`. Custom stills have no cell grid — a hunter who only `drawImage`s a PNG would drop the side-ID outline, or invent a 24×24 box that ignores non-square bitmaps. Moving-enemy WX `shadowBlur = 8` at **8057–8060** is a **different** cue (PERF-179); do not fold it into this helper.  
SYSTEMS_AFFECTED: `pieceArt.ts` custom top branch; `data/ownerTintStroke.ts` after #1059; must not restack WX moving-enemy blur  
RECOMMENDED_ACTION: After #1059, import `strokeOwnerTint`. For a custom summon bitmap, stroke `startX-1, startY-1, width+2, height+2` using the **decoded** footprint at default scale 1 (same origin as `pixelPatternOrigin`). Do not set `shadowBlur`. Do not export a second `strokeOwnerTint`. Player/enemy custom stills do not get this stroke. Empty library after #1059: summon outline is hard, not soft — that is the perf PR’s look, not VAL’s.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011 / stack-compat with #1059  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-10-25-010; VAL-2026-10-26-010  
REGRESSION_RISK: HIGH if VAL pastes `export function strokeOwnerTint` and esbuild fails; HIGH if custom summons lose side color; MEDIUM if VAL reintroduces GPU blur on every living summon.  
VALIDATION_REQUIRED: Duplicate-export scan clean vs #1059. Empty library: player-summon green / enemy-summon red, no `shadowBlur` assignment after #1059. Custom 24×24 PNG summon keeps a 2px owner stroke around the bitmap. Enemy custom does not stroke.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack AdminDashboard or recreate #1066 principalGate / confirmEnter / revealMask / banReason — revert still uses #945 ownerVisualRevert  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#1066](https://github.com/Mr-Melic/stralt/pull/1066) (created 2026-10-25T00:15Z) adds `adminOwnerUx.principalGate.ts`, `.confirmEnter.ts`, `.revealMask.ts`, `.banReason.ts`. Explicitly **not wired** into `AdminDashboard.tsx`. Owner-console locks, not a visual library. VAL-2026-10-25-003 already forbade restacking for #1001 `ownerConfirmChrome`. VAL-2026-10-24-003 forbade recreating #945 `ownerVisualRevert*`. Walk Animation Frames UI (`AdminDashboard.tsx` **1590**) is still stored-not-rendered. Enemy/sprite editors still lack a Revert control.  
SYSTEMS_AFFECTED: admin upload UI (later); must not edit #1066 / #1001 / #945 files or `AdminDashboard.tsx` while older admin PRs queue  
RECOMMENDED_ACTION: Combat spec sheet helper keeps a **new** name (`combatVisualUploadSpecBeforeSelect`). After #945, import `ownerVisualRevert*` so revert-to-default treats empty as valid builtin. After #1001, if a confirm dialog is used, import `ownerConfirmChrome` — do not concatenate a second copy, and do not reuse #1066 `confirmEnter` as chrome. Do not restack `AdminDashboard.tsx`. Do not implement walk cycles to make the heading true (VAL-018).  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-010 / VAL-2026-10-24-003 / VAL-2026-10-25-003  
DEPENDENCIES: VAL-2026-09-29-001; VAL-2026-10-22-004; VAL-2026-10-23-003; VAL-2026-10-24-003; VAL-2026-10-25-003; stack-compat with #334 / #341 / #413 / #470 / #539 / #564 / #631 / #724 / #838 / #883 / #945 / #1001 / #1066  
REGRESSION_RISK: HIGH if VAL pastes `ownerConfirmChrome` / `ownerConfirmEnter` / `ownerVisualRevertLabel` and esbuild fails; HIGH if restacking AdminDashboard conflicts with the owner-UX queue; MEDIUM if empty-after-revert is shown as a validation error and owners cannot return to builtin.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Revert of a bound still → next frame chess, no error toast. Walk-frame paste still does not appear in combat. Confirm pending slot (after #1001) does not close the editor before decode. Principal-gate / ban-reason helpers unused by VAL.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Pack-enemy / summon / boss kit-share through #1107 is still not a visual bind — #1068 ToggleGroup/Breadcrumb/Resizable 44px is a11y, not an upload size  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Pack/summon/boss siblings after VAL #1051 — [#1054](https://github.com/Mr-Melic/stralt/pull/1054) / [#1081](https://github.com/Mr-Melic/stralt/pull/1081) / [#1085](https://github.com/Mr-Melic/stralt/pull/1085) / [#1087](https://github.com/Mr-Melic/stralt/pull/1087) / [#1090](https://github.com/Mr-Melic/stralt/pull/1090) / [#1091](https://github.com/Mr-Melic/stralt/pull/1091) / [#1095](https://github.com/Mr-Melic/stralt/pull/1095) / [#1096](https://github.com/Mr-Melic/stralt/pull/1096) / [#1098](https://github.com/Mr-Melic/stralt/pull/1098) / [#1104](https://github.com/Mr-Melic/stralt/pull/1104) / [#1107](https://github.com/Mr-Melic/stralt/pull/1107) — share kit fallbacks, LoS-reposition, wounded-retreat, and advertised CHC. They do **not** set `isBoss` / `bossId` on the portal Enemy (WX **6522–6569**). Open PR [#1068](https://github.com/Mr-Melic/stralt/pull/1068) raises shadcn ToggleGroup, Breadcrumb, Resizable (and drawer) to **44px** — extends #895 / #935 / #1010; unused in live HUD; not a sprite box. VAL-2026-10-25-004 already covered #1010 Toggle/Accordion 44px and #985+ healer-share. Queue continued to [#1108](https://github.com/Mr-Melic/stralt/pull/1108) (WAITING_FOR_TELEMETRY docs) — not a visual bind.  
SYSTEMS_AFFECTED: spawn bind; must not restack pack-enemy kit helpers or shadcn chrome  
RECOMMENDED_ACTION: Bind stills on instance id (`boss_*`, `boss-rush-*`, `enemy-*`, `summon-${random}`). Do not key `boss_large` off kit resolve, starter ids, `isBoss`, or `family === "boss"`. Filling or sharing `spells` / CHC must not re-roll `visualAssetId`. Do not list 44 as `RECOMMENDED_WIDTH`. Use 44px only for picker button/input hit targets after #895 / #935 / #1010 / #1068.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-22-002 / VAL-2026-10-25-004  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-22-002; VAL-2026-10-23-004; VAL-2026-10-24-004; VAL-2026-10-25-004; stack-compat with #911 / #947 / #966 / #985 / #1010 / #1054 / #1068 / #1104 / #1107  
REGRESSION_RISK: HIGH if a hunter keys custom art off a pack CHC helper or a 44px ToggleGroup and combat draws 24×24 centered; HIGH if two copies of pack-kit helpers fail esbuild.  
VALIDATION_REQUIRED: Empty library player in world is 24×24 chess. Pack kit fill / CHC share does not change appearance. 100 fake rAF ticks same instance → same bind. Spec sheet does not list 44 as art size.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not wait for VAL docs PRs #355–#1051 — implement from merged 08-31 IDs on main  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f` (PR #332, 2026-09-21). Fourteen open VAL docs PRs (#355 … #782, #835, #880, #930, #990, **#1051**) never merged. 35 days produced no combat `drawImage`. Merged actionable contract is `VAL-2026-08-31-001`…`019` plus implemented copy-honesty `VAL-2026-09-01-001`. Later VAL IDs are evidence refreshes (phones Continue, portal boss 34×34, squash 1.5, sibling extracts, #828 persist, #901 whirlpool, #961 pixelPattern, #995 tilePaint, **#1076 mapHazardPaint**, **#1059 ownerTintStroke**). Oldest-first merge of fourteen markdown PRs is not a prerequisite for `engine/visualAssets.ts`.  
SYSTEMS_AFFECTED: first implementation PR (new TS only); do not restack all VAL markdown  
RECOMMENDED_ACTION: First implementer PR ships `resolveRuntimeVisual` + tests that `[]` / inactive / corrupt → `{ kind: "builtin" }`. Read the 08-31 design + this fact sheet’s extract/viewport notes. Do not block on merging #355–#1051. Do not concatenate fourteen copies of `RENDER_PROFILES`.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper first; no RAF / mapGen / combat math.  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-08-31-017; VAL-2026-09-01-006; VAL-2026-10-25-005  
REGRESSION_RISK: LOW for skipping unread docs PRs; HIGH if a hunter waits for the stack and ships nothing, or concatenates `export function resolveRuntimeVisual` from multiple drafts.  
VALIDATION_REQUIRED: Empty library on `main`: pixels identical. New enemy/boss without uploads paints chess. `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 2026-10-26 RENDER_PROFILES — pixel boxes unchanged; cite #1076 overlay grain and #1059 stroke-only tint  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-derived this run: tile 80×40 (`gameConstants.ts` 6–7), cell 3px (WX 3855; after #961 `PIXEL_PATTERN_CELL_SIZE`), draw point top+9, standard/player/summon 24×24, squash max **1.5** (`spawnPolicy.ts` 241–248) → elite rec **36**, portal boss live 8×8×1.4 ≈ **34×34** (no `isBoss`/`bossId` at 6524–6568), Rush `king.front` 24×24, hit **80×41**, shadow desktop 12×4.2, wall 28 (WX 4085; after #995 `ISO_WALL_HEIGHT`), neighbor (40,20), AO 8px floor, pads 10/14. Portal FX 25 / rest-glow 33 / boss-star 37 are live at WX 3898–3965 and become named exports in #901. Portal **tile** ellipse tw/3×th/4 ≈ 26.7×10 is #995. Hazard overlay grain 2–3 / lava 4×4 / ice 3×3 is **#1076**. Summon tint after #1059 is 2px stroke, no blur. Creation CSS **240×210**, lobby CSS **120** / painted **192×192**, shadcn **44px** (#895 / #935 / #1010 / **#1068**) are not upload sizes. Unchanged vs 10-25 except those citations.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. Custom default scale = 1. Do not invent 64×64 / 128×128. Do not key `boss_large` off `isBoss` / `family==="boss"`. Show the spec sheet **before** file selection. Import `PIXEL_PATTERN_CELL_SIZE` after #961 for cell math only. Import `PORTAL_WHIRLPOOL_RADIUS` after #901 for swirl clip only. Import `ISO_WALL_HEIGHT` after #995 for wall-clip only. Import `drawHazardOverlay` after #1076 for overlay-clip only. Import `strokeOwnerTint` after #1059 for summon stroke only.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-004  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-22-002; VAL-2026-09-26-001; VAL-2026-10-25-006; VAL-2026-10-26-001; VAL-2026-10-26-003  
REGRESSION_RISK: HIGH if upload UI asks for 128×128, 192×192 lobby, 28 wall height, 2×2 lava grain, or 3×3 cells as the still size and combat draws 24×24 centered, or boss PNGs are 1.4-stretched enemy art.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / 34×34 live boss / 36 elite-meta / alpha / 256 KiB. Reject JPEG. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity after #1076 mapHazardPaint and #1059 ownerTintStroke on a 35-day freeze of 0f5363f  
CATEGORY: fallback-invariant  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `ctx.drawImage` and `createImageBitmap` returns no matches (comment only in `adminVisualStatus.ts`). `engine/visualAssets.ts` absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect`. #961 extract is still canvas `fillRect` cells. #995 extract is still canvas tile fill. #1076 extract is still canvas overlay fill — it does not add a bitmap resolver. #1059 only removes summon GPU blur. New bosses still `BOSS_PIXEL_PATTERNS[bossId] ?? boss_12` (`enemyPixelPatterns.ts` 430–432) for the unused 8×12 path; live portal Enemy still chess × 1.4. New summons still `creaturePatterns`. VAL-2026-09-01-001 copy change did not wire combat. HEAD `0f5363f` since 2026-09-21. Queue through **#1107** without a paint change on main.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons require no uploads. This ID is the 10-26 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-10-25-007, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-01-006; VAL-2026-10-25-007; VAL-2026-10-26-001  
REGRESSION_RISK: HIGH if a hunter wires `spriteUrl` into rAF “to make admin copy true,” or treats #1076 / #995 / #961 / #1059 as the custom-visual hook.  
VALIDATION_REQUIRED: Empty canister + empty library → today’s pixels. New `BossConfig` without art → generated pixels. After #1076, lava/ice/spikes still paint with no library. After #1059, summon stroke-only still paints with no library. After #961, player and combatant fillRect still paint with no library.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Spec sheet before file pick must not use #1076 grain 2–3 / lava 4, unused 26px serif, or #1068 ToggleGroup 44px as upload sizes  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live combat stills are 24×24 at tile top+9 (WX 8315–8326 / `drawPixelPattern` 3855). Creation preview is 80×80 art on internal canvas **320×280** with CSS **240×210** (`CharacterCreation.tsx` 151–153, 452–463). Portrait is **60×60** (WX 18108–18115). Admin catalog preview is 72×72 `object-fit:contain`. Lobby `CharacterPreview` is CSS **120** / internal **240** / painted **192×192** at 24px cells (`CharacterSelection.tsx` 310–348). Open PR [#1068](https://github.com/Mr-Melic/stralt/pull/1068) raises ToggleGroup / Breadcrumb / Resizable floors to **44px**. After #1076, overlay grain is 2 or 3 px and lava glow is 4×4; the helper sets `font = ${round(th*0.65)}px serif` (desktop **26px**) even though glyphs are `fillRect` — that font size is not art. After #995, `ISO_WALL_HEIGHT = 28` and portal-tile ellipse `tw/3 × th/4` ≈ 26.7×10 are **tile geometry**. Barrier towers 6×28=168. VAL-2026-10-25-009 already forbade 240×210 / Button 44 / lobby 192 / cell 3 / whirlpool 25 / wall 28.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; admin spec sheet  
RECOMMENDED_ACTION: Spec sheet **before** file pick lists 24×24 (48 @2×), live boss 34×34, elite-meta 36, PNG/WebP, alpha, 256 KiB. Explicitly reject using 2 / 3 / 4 / 25 / 26 / 26.7 / 28 / 33 / 37 / 41 / 44 / 60 / 72 / 80 / 120 / 168 / 192 / 240×210 / 320×280 as recommended art size. Use 44px only for picker **button/input** hit targets after #895 / #935 / #1010 / #1068. Use 28 only as a wall-clip warning. Use 2–4 only as a hazard-overlap warning.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-10-25-009  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-10-25-009; VAL-2026-10-26-001; VAL-2026-10-26-005; VAL-2026-10-26-007  
REGRESSION_RISK: HIGH if owners author against a 4×4 lava glow, a 26px serif, a 44px ToggleGroup, or the lobby 192×192 box and combat draws 24×24 centered.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / alpha / 256 KiB and names the forbidden HUD/creation/lobby/portal/wall/hazard/a11y/cell sizes. Reject JPEG. Empty library player still chess.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player stills still bypass drawCombatant — second wire at WX 8315; #1076 and #1059 do not replace that site  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemies/summons/bosses use `drawCombatant` (WX 8063–8075) with `drawPattern: drawPixelPattern` (8072). Player uses `drawPixelPattern` + `getPersistedPiecePattern` (8315–8326) and is **not** in `combatantsRef` (sprite key `"player"`, drawOrder 99999 at 8337–8342). `DrawCombatantOptions` still has no bitmap hook (`pieceArt.ts` 714–744). `drawPixelPattern` trailing `restore` (3883) has no save. #961 only moves the fillRect loop. #995 only moves **tile** fill. #1076 only moves **hazard overlay** fill. #1059 only moves summon **stroke**. None of those extracts paint the player. Putting `drawImage` inside `engine/pixelPattern.ts` would hit the player site **and** every combatant branch plus pop the moving-enemy save (8057–8076). Putting `drawImage` inside `engine/tilePaint.ts` or `mapHazardPaint.ts` would miss combatants entirely and stamp floors. `toCombatantEntry` still drops unknown fields — bind lives on `combatantsRef` Enemy, not turn-order rows. Player bind keys `pieceType`+`playerView`.  
SYSTEMS_AFFECTED: `pieceArt.ts` `drawCombatant`; WX player site 8315–8326  
RECOMMENDED_ACTION: Optional top branch on `drawCombatant` **and** one player-site call that uses the same resolver keyed by `pieceType`+`playerView`. Omitted option ≡ today. Set `imageSmoothingEnabled = false` on the shaken rAF ctx immediately before `drawImage` (scale/shake at 7263–7267 reset 2D state; CSS `image-rendering: pixelated` at WX 17890 / `index.css` 652–655 is display-time). Do not add the player to `combatantsRef` from this library. Do not draw the player through `drawPixelPattern`, `drawIsometricTile`, or `drawHazardOverlay` ImageBitmap overloads. Summon custom path additionally calls `strokeOwnerTint` (VAL-2026-10-26-003).  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011 / VAL-2026-09-01-007 / VAL-2026-10-25-010  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-10-25-010; VAL-2026-10-26-001; VAL-2026-10-26-003  
REGRESSION_RISK: HIGH if only the enemy dispatch paints PNGs and the player stays chess (or vice versa); HIGH if `drawPattern` / `drawIsometricTile` / `drawHazardOverlay` is overloaded to accept ImageBitmap.  
VALIDATION_REQUIRED: No option / empty library → fillRect both sites. Custom player revoke → next frame chess. Enemy custom does not require a player upload. Bound 24×24 PNG stays crisp after resize and hit-shake. Floors and lava stay generated after a custom still binds.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Version-gate and remount-keep PRs through #1107 still do not preserve visual-library keys — uploads stay canister DRAFT  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and keys ending `_inventory`. `App.tsx` still `localStorage.clear()` on `APP_VERSION`. Open persist remount PRs after VAL #1051 — #1045 / #1046 / #1070 / #1088 / #1092 / **#1099** (and earlier #986…#1043) — skip shop/death/rename leftover-XP wipes after a successful keep without unpaid death. None add visual-library keys. Newest paint-adjacent sibling **#1107** is pack CHC share, not persist. **#1108** is telemetry docs. VAL-2026-09-25 already required canister DRAFT until ACTIVE. VAL-2026-10-25-011 covered through #1043.  
SYSTEMS_AFFECTED: library persistence; must not extend `shouldPreserveVersionGateKey` from this designer without a dedicated persist ID  
RECOMMENDED_ACTION: Bytes live in object storage; metadata in optional admin maps. Never `localStorage` / `nsKey` / `Character.pixelPattern`. Drafts never enter `resolveRuntimeVisual`. Safe-delete / deactivate does not depend on version-gate preserve. Do not restack the remount-keep helpers. New canister maps need a migration after `20260901` (`OldActor = {}`).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002 / VAL-2026-08-31-014  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014; VAL-2026-10-25-011; stack-compat with version-gate / remount-keep PRs  
REGRESSION_RISK: HIGH if a hunter stores ImageBitmap keys in `localStorage` and an `APP_VERSION` bump silently empties the library while combat still expects ids; HIGH if VAL concatenates remount-keep skip helpers.  
VALIDATION_REQUIRED: Version bump with a DRAFT asset → combat stays builtin. Empty library after wipe → chess pixels. Duplicate-export scan clean vs remount-keep PRs.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-26-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#1051  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, #694, #715, #782, #835, #880, #930, #990, **#1051**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings or #724 / #798 / #828 / #838 / #841 / #861 / #883 / #901 / #911 / #945 / #961 / #966 / #995 / #1001 / #1010 / **#1059** / **#1066** / **#1068** / **#1076** TS. Rewriting `ACTION_IDS_VAL_2026-10-25.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-10-26.md`, `docs/automation/ACTION_IDS_VAL_2026-10-26.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers with #724 / #639 / #631 / #730 / #798 / #795 / #828 / #831 / #838 / #841 / #861 / #883 / #901 / #911 / #945 / #961 / #966 / #995 / #1001 / #1059 / #1066 / #1076.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-10-26 ACTION_IDs. Production code not modified.*
