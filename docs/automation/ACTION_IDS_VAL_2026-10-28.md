# ACTION_IDs — 2026-10-28 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-10-28.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-10-28.md).  
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
- `VAL-2026-10-26-001` … `012` in PR [#1110](https://github.com/Mr-Melic/stralt/pull/1110) (open, not on main).
- `VAL-2026-10-27-001` … `012` in PR [#1169](https://github.com/Mr-Melic/stralt/pull/1169) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-10-28

| ID | Status 2026-10-28 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts`; HEAD still `0f5363f` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 |
| VAL-2026-09-25-011 elite rec 34 | Corrected by VAL-2026-09-26-001 (squash max 1.5 → rec 36) |
| VAL-2026-09-26-005 Rest/Death desktop follow pane | **Corrected** by VAL-2026-09-27-001 (desktop paint ignores `cameraRef`) |
| VAL-2026-09-27-001 | **Extended** by VAL-2026-10-21-004: Rest/Death **does** pan when `!isDesktop` |
| VAL-2026-09-28-001 share gridToScreen / #639 | still OPEN; `isoGrid.ts` absent on `0f5363f`. **#995 `tilePaint.ts` is a different extract**. **#1076 `mapHazardPaint.ts` is a fourth** (hazard overlay). **#1109 `battlePortalCube.ts` is a fifth** (in-battle cube). **#1196 `combatTileOverlay.ts` is a sixth** (floor highlight, not the projector / not combatants / not swirl / not cube). |
| VAL-2026-09-29-001 #724 spec-sheet collision | still valid; #724 still OPEN |
| VAL-2026-10-21-001 / 004 `#798` cameraFollow | still valid; #798 still OPEN |
| VAL-2026-10-22-004 don't restack AdminDashboard / #838 | **Extended** by VAL-2026-10-23-003 (#883) then VAL-2026-10-24-003 (#945) then VAL-2026-10-25-003 (#1001) then VAL-2026-10-26-004 (#1066) then VAL-2026-10-27-004 (#1115) then **VAL-2026-10-28-004** (#1190) |
| VAL-2026-10-22-007 don't restack WX / #841 | **Extended** by VAL-2026-10-23-002 / 008 (#901) then VAL-2026-10-24-001 / 002 / 008 (#961) then VAL-2026-10-25-001 / 002 / 008 (#995) then VAL-2026-10-26-001 / 002 / 008 (#1076) then VAL-2026-10-27-001 / 002 / 008 (#1109) then **VAL-2026-10-28-001 / 002 / 008** (#1196) |
| VAL-2026-10-22-005 auto-summon kits not visual | **Extended** by VAL-2026-10-23-004 (#911) then pack-enemy DoT/buff share #947+ then VAL-2026-10-25-004 (#985…#1042) then VAL-2026-10-26-005 (#1054…#1107) then VAL-2026-10-27-005 (#1123 / #1150 / #1158 / #1159) then **VAL-2026-10-28-005** (#1166 / #1205 / #1206 / #1211 / #1214 / #1217) |
| VAL-2026-10-21-006 skip docs PRs #355–#782 | **Extended** by VAL-2026-10-22-008 (#835) then VAL-2026-10-23-005 (#880) then VAL-2026-10-24-005 (#930) then VAL-2026-10-25-005 (#990) then VAL-2026-10-26-006 (#1051) then VAL-2026-10-27-006 (#1110) then **VAL-2026-10-28-006** (#1169) |
| VAL-2026-10-23-001 / 002 #901 whirlpool | still valid; #901 still OPEN. #961 is a **second** paint extract. #995 is a **third**. #1076 is a **fourth**. #1109 is a **fifth**. **#1196 is a sixth** (floor highlight, not swirl / not tiles / not hazards / not cube / not combatants). |
| VAL-2026-10-24-001 / 002 #961 pixelPattern | still valid; #961 still OPEN. Do not unify with #995 `tilePaint.ts`, #1076 `mapHazardPaint.ts`, #1109 `battlePortalCube.ts`, or #1196 `combatTileOverlay.ts`. |
| VAL-2026-10-25-001 / 002 #995 tilePaint | still valid; #995 still OPEN. Do not unify with #1076, #1109, or #1196. |
| VAL-2026-10-26-001 / 002 #1076 mapHazardPaint | still valid; #1076 still OPEN. Do not unify with #1109 or #1196. |
| VAL-2026-10-27-001 / 002 #1109 battlePortalCube | still valid; #1109 still OPEN. Do not unify with #1196. |
| VAL-2026-10-23-009 forbidden 44 / 240×210 | **Extended** by VAL-2026-10-24-009 (#935 / #966) then VAL-2026-10-25-009 (#1010 / #995 wall 28) then VAL-2026-10-26-009 (#1068 ToggleGroup 44px; #1076 grain 2–3 / lava 4) then VAL-2026-10-27-009 (#1109 cube grain ~1–2 / height 28; #1125 / #1162 / #1115 44px) then **VAL-2026-10-28-009** (#1196 hover radius 40/70 / stroke 1.5; #1194 overscroll contain) |
| VAL-2026-10-24-003 #945 visualRevert | still valid; #945 still OPEN. #1001 / #1066 / #1115 / #1190 do **not** replace revert helpers. |
| VAL-2026-10-24-011 remount through #979 | **Extended** by VAL-2026-10-25-011 through #1043 then VAL-2026-10-26-011 through **#1107** / **#1099** then VAL-2026-10-27-011 through **#1157** then **VAL-2026-10-28-011** through **#1215** |
| VAL-2026-10-25-010 player second wire | **Extended** by VAL-2026-10-26-003 / 010 (#1059 tint) then VAL-2026-10-27-003 / 010 (#1109 cube) then **VAL-2026-10-28-003 / 010**: #1196 extracts the floor overlay; player site still bypasses `drawCombatant`. |
| VAL-2026-10-26-003 #1059 stroke-only tint | still valid; #1059 still OPEN. Custom summons still import `strokeOwnerTint`. |

---

ACTION_ID: VAL-2026-10-28-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not put drawImage inside #1196 engine/combatTileOverlay.ts — floor highlights are fill/stroke with hover radius tw/2, not a combatant still  
CATEGORY: scope  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#1196](https://github.com/Mr-Melic/stralt/pull/1196) (created 2026-10-27T00:32:26Z, nineteen minutes after VAL docs #1169) extracts WX hover-glow / green MP-walk / blue spell-range floor overlays into `engine/combatTileOverlay.ts`. Live main still inlines at WX **7616–** (`pulseAlpha = 0.12 + Math.sin(now * 0.003) * 0.05`, diamond `moveTo`/`lineTo` from tile top, hover radial `r = effectiveTileW / 2`, walk fill `rgba(0,200,80,0.35)` stroke `rgba(0,220,100,0.8)`, spell fill `rgba(30,100,255,0.35)` stroke `rgba(60,140,255,0.85)`, `lineWidth = 1.5`). Named exports: `WALK_TILE_FILL`, `WALK_TILE_STROKE`, `SPELL_RANGE_FILL`, `SPELL_RANGE_STROKE`, `RANGE_TILE_LINE_WIDTH = 1.5`, `HOVER_PULSE_BASE = 0.12`, `HOVER_PULSE_AMP = 0.05`, `HOVER_PULSE_RATE = 0.003`, `drawFloorHoverGlow`, `drawWalkTileOverlay`, `drawSpellRangeOverlay`, `isoTileDiamondVertices`. Comment forbids folding into `tilePaint`, `mapHazardPaint`, `barrierRender`, `battleWalkMp`, or `battleWalkReachable`. Spell-hover RGB wins over MP. Hover radius is **width** (`tw/2` = desktop 40 / mobile-zoom 70), not `th/2`. Zero `drawImage`. After merge WX 19213 → 19175.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new); must not edit `engine/combatTileOverlay.ts` to accept ImageBitmap  
RECOMMENDED_ACTION: Custom stills are an optional top branch on `drawCombatant` plus one player-site call. Do not overload `drawFloorHoverGlow` / `drawWalkTileOverlay` / `drawSpellRangeOverlay` / `traceIsoTileDiamond` to paint PNGs onto the diamond. Do not treat hover radius 40/70, stroke 1.5, pulse 0.12, or overlay rgba as `RECOMMENDED_WIDTH`. Do not merge `combatTileOverlay.ts` into `tilePaint.ts` / `isoGrid.ts` / `portalWhirlpool.ts` / `pixelPattern.ts` / `mapHazardPaint.ts` / `battlePortalCube.ts` / `barrierRender.ts`. Empty library + extracted overlay must still look like today’s walk/spell/hover floors.  
AUTONOMY: SCOPE_GUARD — IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-08-31-016; VAL-2026-10-23-001; VAL-2026-10-24-001; VAL-2026-10-25-001; VAL-2026-10-26-001; VAL-2026-10-27-001; stack-compat with #1196  
REGRESSION_RISK: HIGH if a hunter routes PNGs through `drawWalkTileOverlay` and every MP tile becomes a sprite; HIGH if unifying overlay+tilePaint changes floor slabs; HIGH if `nowMs` / pulse alpha is reused as a combatant pool hash so art flickers every frame; HIGH if hover radius 40 is used as recommended still size (it equals `TILE_HEIGHT`, not the 24×24 body).  
VALIDATION_REQUIRED: Empty library: chess pixels identical with and without #1196. Custom 24×24 PNG is not drawn from inside `combatTileOverlay.ts`. Walk tiles stay green, spell tiles stay blue, hover still pulses. `python3 scripts/check-duplicate-exports.py src/frontend/src` after any import of #1196.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Import #1196 drawFloorHoverGlow / walk / spell overlay after that PR — do not clone overlay paint or name a VAL file combatTileOverlay.ts  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #1196 adds `src/frontend/src/engine/combatTileOverlay.ts` + `.test.ts` (characterization tests locking diamond verts, live rgba/lineWidth 1.5, hover pulse `0.12+sin(now*0.003)*0.05`, spell-hover RGB winning over MP, hover radius `tw/2` not `th/2`, save/restore, no ellipse/translate/clip/fillRect). Import slot is after `combatMath` / before `combatantStore` — unique vs #639 `isoGrid`, #901 `portalWhirlpool`, #961 `pixelPattern`, #995 `tilePaint` (`targeting`/`turnQueue`), #1076 `mapHazardPaint` (`mapGen`/`mapModifiers`), #1109 `battlePortalCube` (inBattle branch). Oldest-first merge would duplicate-export `drawFloorHoverGlow` / `drawWalkTileOverlay` / `isoTileDiamondVertices` if VAL copies those names. WX on `0f5363f` is still **19213** lines with the inline overlay at 7616.  
SYSTEMS_AFFECTED: first `engine/visualAssets.ts` / `visualPreview.ts` implementation PR; WX wrapper leave-alone after #1196; tests  
RECOMMENDED_ACTION: VAL modules stay `visualAssets.ts` / `visualPreview.ts`. After #1196, import `drawWalkTileOverlay` / `drawSpellRangeOverlay` / `drawFloorHoverGlow` only to stamp an optional **preview clip warning** under a dummy still. Do not paste the diamond `moveTo`/`lineTo` loop back into WX. Do not grow the rAF body. Keep one `export function` per name. Do not name a VAL file `combatTileOverlay.ts`. Do not use `nowMs` / pulse alpha as `pickWeighted` input. Inject a frozen `nowMs` in preview tests.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-10-28-001; VAL-2026-08-31-017; stack-compat with #639 / #901 / #961 / #995 / #1076 / #1109 / #1196  
REGRESSION_RISK: HIGH if two copies of `drawFloorHoverGlow` fail Caffeine `vite build` / esbuild; HIGH if VAL re-inlines the overlay and #1196’s wrapper also remains; MEDIUM if preview always paints a pulsing hover under every still.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Duplicate-export scan clean. Empty library pixels identical. Preview floor uses `drawIsometricTile` (after #995); overlay warning uses #1196 helpers only when the owner toggles a battle-floor pane; dummy still uses pixelPatternOrigin + optional bitmap.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: #1196 floor overlay is a sixth paint surface — do not unify with #995 tile diamond, #1076 hazard clip, or #1109 cube; overlay pulse is not a combatant pool hash  
CATEGORY: renderer  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live walk/spell/hover paint sits in the floor pass (WX **7616–**) on an **unrounded** iso diamond at the tile top vertex. After #995 the **base slab** is `drawIsometricTile` (grain fill + wall 28 + portal ellipse). After #1076 lava/ice/spikes clip to the diamond then `fillRect` grain. After #1109 in-battle portals become a 28-tall cube. After #639 click-cache uses a **rounded** top, which is not these verts. After #1196 the overlay helpers export `isoTileDiamondVertices` — do not concatenate a second copy into `tilePaint` or `isoGrid`. Pulse uses RAF `now`; `combatMath.seededRng` is Park–Miller. VAL-2026-08-31-016 already keeps future PORTAL ineligible; floor highlights are not a new category either. Summon owner-tint remains #1059 (`strokeOwnerTint`, no blur).  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` clip warnings; spawn bind; must not restack #901 / #995 / #1076 / #1109 / #1196 / #1059  
RECOMMENDED_ACTION: Preview may show **labeled** floor surfaces (base slab, hazard grain, walk/spell overlay, hover glow) as overlap warnings. Do not add a `floor_overlay` or `portal` RENDER_PROFILE in v1. Do not `drawImage` on any of those surfaces. Bind combatant stills from instance id via `seededRng(hash(instanceId, poolId, poolVersion))` — never `nowMs` / pulse alpha / hover RGB / `portalCubeSeed` / `isoWallSeed` / `hazardOverlaySeed`. After #1059, custom summons still import `strokeOwnerTint` around the bitmap.  
AUTONOMY: SCOPE_GUARD — IMPLEMENT_WITH VAL-2026-08-31-016 / VAL-2026-10-27-003  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-08-31-016; VAL-2026-10-23-001; VAL-2026-10-25-001; VAL-2026-10-26-001; VAL-2026-10-27-001; VAL-2026-10-28-001  
REGRESSION_RISK: HIGH if a hunter keys art off hover RGB (spell-blue vs walk-green) so the still changes when the player toggles walk/attack; HIGH if overlay pulse re-picks `visualAssetId` every frame; MEDIUM if preview conflates hover radius 40 with tile height 40 and owners author 40×40 stills.  
VALIDATION_REQUIRED: Empty library: walk tiles still green; spell tiles still blue; hover still pulses; combatants still chess. Custom 24×24 PNG never appears inside overlay/tile/hazard/cube paint. 100 fake rAF ticks same instance → same bind even while standing on a pulsing hover tile. Duplicate-export scan clean vs #901 / #995 / #1076 / #1109 / #1196 / #1059.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack AdminDashboard or recreate #1190 revealFormat / purchaseBusy / grantDraft / copyFollowup — revert still uses #945 ownerVisualRevert  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#1190](https://github.com/Mr-Melic/stralt/pull/1190) (created 2026-10-27T00:23Z) adds `adminOwnerUx.revealFormat.ts`, `.purchaseGlobalBusy.ts`, `.grantDraft.ts`, `.copyFollowup.ts`. Explicitly **not wired** into `AdminDashboard.tsx`. Owner-console locks (GameKey format, Purchases global busy, Shop Grant string draft, copy toast), not a visual library. VAL-2026-10-27-004 already forbade restacking for #1115 confirmSnapshot/mailtoSecret. VAL-2026-10-26-004 forbade #1066 principalGate/confirmEnter. VAL-2026-10-25-003 forbade #1001 `ownerConfirmChrome`. VAL-2026-10-24-003 forbade recreating #945 `ownerVisualRevert*`. Walk Animation Frames UI (`AdminDashboard.tsx` **1590**) is still stored-not-rendered. Enemy/sprite editors still lack a Revert control.  
SYSTEMS_AFFECTED: admin upload UI (later); must not edit #1190 / #1115 / #1066 / #1001 / #945 files or `AdminDashboard.tsx` while older admin PRs queue  
RECOMMENDED_ACTION: Combat spec sheet helper keeps a **new** name (`combatVisualUploadSpecBeforeSelect`). After #945, import `ownerVisualRevert*` so revert-to-default treats empty as valid builtin. After #1001, if a confirm dialog is used, import `ownerConfirmChrome` — do not concatenate a second copy, and do not reuse #1066 `confirmEnter`, #1115 `confirmSnapshot`, or #1190 `copyFollowup` as chrome. Do not restack `AdminDashboard.tsx`. Do not implement walk cycles to make the heading true (VAL-018). Use `OWNER_MIN_HIT_PX` only for picker **button** floors after #1115, never as `RECOMMENDED_WIDTH`.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-010 / VAL-2026-10-24-003 / VAL-2026-10-25-003 / VAL-2026-10-26-004 / VAL-2026-10-27-004  
DEPENDENCIES: VAL-2026-09-29-001; VAL-2026-10-22-004; VAL-2026-10-23-003; VAL-2026-10-24-003; VAL-2026-10-25-003; VAL-2026-10-26-004; VAL-2026-10-27-004; stack-compat with #334 / #341 / #413 / #470 / #539 / #564 / #631 / #724 / #838 / #883 / #945 / #1001 / #1066 / #1115 / #1190  
REGRESSION_RISK: HIGH if VAL pastes `ownerConfirmChrome` / `ownerConfirmEnter` / `ownerConfirmSnapshot` / `ownerVisualRevertLabel` / `ownerHitTargetMeetsMinimum` / `ownerRevealFormat` / `ownerGrantDraft` and esbuild fails; HIGH if restacking AdminDashboard conflicts with the owner-UX queue; MEDIUM if empty-after-revert is shown as a validation error and owners cannot return to builtin.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Revert of a bound still → next frame chess, no error toast. Walk-frame paste still does not appear in combat. Confirm pending slot (after #1001) does not close the editor before decode. Principal-gate / ban-reason / mailto-secret / confirm-snapshot / reveal-format / grant-draft helpers unused by VAL.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Pack-enemy / summon kit-share through #1214 is still not a visual bind — #1194 overscroll contain is a11y, not an upload size  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Pack/summon siblings after VAL #1169 — [#1166](https://github.com/Mr-Melic/stralt/pull/1166) / [#1205](https://github.com/Mr-Melic/stralt/pull/1205) / [#1206](https://github.com/Mr-Melic/stralt/pull/1206) / [#1211](https://github.com/Mr-Melic/stralt/pull/1211) / [#1214](https://github.com/Mr-Melic/stralt/pull/1214) — share summon-control Inferno CD / remaining / kit select / highlight. Kit-first locks [#1164](https://github.com/Mr-Melic/stralt/pull/1164) / [#1204](https://github.com/Mr-Melic/stralt/pull/1204) / [#1212](https://github.com/Mr-Melic/stralt/pull/1212) (Enthroned Void Swap, Eternal Pawn Slow). Combat modifier commits [#1199](https://github.com/Mr-Melic/stralt/pull/1199) / [#1200](https://github.com/Mr-Melic/stralt/pull/1200) / [#1202](https://github.com/Mr-Melic/stralt/pull/1202) / [#1207](https://github.com/Mr-Melic/stralt/pull/1207) / [#1208](https://github.com/Mr-Melic/stralt/pull/1208) / [#1210](https://github.com/Mr-Melic/stralt/pull/1210) / [#1216](https://github.com/Mr-Melic/stralt/pull/1216) / [#1217](https://github.com/Mr-Melic/stralt/pull/1217) (Mending Mist, Iron Curse, Swift Winds, Doka Fever, Titan's Vigor, Arcane Overflow, Glyph Trap, Broodmother venom) do **not** set `isBoss` / `bossId` on the portal Enemy (WX **6522–6569**). Open PR [#1194](https://github.com/Mr-Melic/stralt/pull/1194) contains HoverCard / Tooltip / menu **overscroll** (`overscroll-behavior`) — CSS, not a sprite box. VAL-2026-10-27-005 already covered #1125 / #1162 44px and #1123…#1159 kit-share.  
SYSTEMS_AFFECTED: spawn bind; must not restack pack-enemy kit helpers or shadcn overlay chrome  
RECOMMENDED_ACTION: Bind stills on instance id (`boss_*`, `boss-rush-*`, `enemy-*`, `summon-${random}`). Do not key `boss_large` off kit resolve, Inferno remaining, starter ids, `isBoss`, `family === "boss"`, or advertised modifier multipliers. Filling or sharing `spells` / CD / remaining ticks must not re-roll `visualAssetId`. Do not list overscroll-contain, 44, or overlay stroke 1.5 as `RECOMMENDED_WIDTH`. Use 44px only for picker button/input hit targets after #895 / #935 / #1010 / #1068 / #1115 / #1125 / #1162.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-22-002 / VAL-2026-10-27-005  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-22-002; VAL-2026-10-23-004; VAL-2026-10-24-004; VAL-2026-10-25-004; VAL-2026-10-26-005; VAL-2026-10-27-005; stack-compat with #911 / #947 / #966 / #985 / #1010 / #1054 / #1068 / #1104 / #1107 / #1123 / #1125 / #1158 / #1162 / #1166 / #1194 / #1211 / #1214  
REGRESSION_RISK: HIGH if a hunter keys custom art off Inferno remaining, Broodmother venom, or a Tooltip overscroll helper and combat draws 24×24 centered; HIGH if two copies of pack-kit helpers fail esbuild.  
VALIDATION_REQUIRED: Empty library player in world is 24×24 chess. Pack kit fill / CD share / Inferno remaining tick / modifier commit does not change appearance. 100 fake rAF ticks same instance → same bind. Spec sheet does not list 1.5 / 40 / 44 as art size.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not wait for VAL docs PRs #355–#1169 — implement from merged 08-31 IDs on main  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f` (PR #332, 2026-09-21). Sixteen open VAL docs PRs (#355 … #782, #835, #880, #930, #990, #1051, #1110, **#1169**) never merged. 37 days produced no combat `drawImage`. Merged actionable contract is `VAL-2026-08-31-001`…`019` plus implemented copy-honesty `VAL-2026-09-01-001`. Later VAL IDs are evidence refreshes (phones Continue, portal boss 34×34, squash 1.5, sibling extracts, #828 persist, #901 whirlpool, #961 pixelPattern, #995 tilePaint, #1076 mapHazardPaint, #1059 ownerTintStroke, #1109 battlePortalCube, **#1196 combatTileOverlay**). Oldest-first merge of sixteen markdown PRs is not a prerequisite for `engine/visualAssets.ts`.  
SYSTEMS_AFFECTED: first implementation PR (new TS only); do not restack all VAL markdown  
RECOMMENDED_ACTION: First implementer PR ships `resolveRuntimeVisual` + tests that `[]` / inactive / corrupt → `{ kind: "builtin" }`. Read the 08-31 design + this fact sheet’s extract/viewport notes. Do not block on merging #355–#1169. Do not concatenate sixteen copies of `RENDER_PROFILES`.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper first; no RAF / mapGen / combat math.  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-08-31-017; VAL-2026-09-01-006; VAL-2026-10-27-006  
REGRESSION_RISK: LOW for skipping unread docs PRs; HIGH if a hunter waits for the stack and ships nothing, or concatenates `export function resolveRuntimeVisual` from multiple drafts.  
VALIDATION_REQUIRED: Empty library on `main`: pixels identical. New enemy/boss without uploads paints chess. `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 2026-10-28 RENDER_PROFILES — pixel boxes unchanged; cite #1196 hover radius tw/2 / stroke 1.5 and #1194 overscroll contain  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-derived this run: tile 80×40 (`gameConstants.ts` 6–7), cell 3px (WX 3855; after #961 `PIXEL_PATTERN_CELL_SIZE`), draw point top+9, standard/player/summon 24×24, squash max **1.5** (`spawnPolicy.ts` 241–248) → elite rec **36**, portal boss live 8×8×1.4 ≈ **34×34** (no `isBoss`/`bossId` at 6524–6568), Rush `king.front` 24×24, hit **80×41**, shadow desktop 12×4.2, wall 28 (WX 4085; after #995 `ISO_WALL_HEIGHT`; after #1109 also `BATTLE_PORTAL_CUBE_HEIGHT`), neighbor (40,20), AO 8px floor, pads 10/14. Portal FX 25 / rest-glow 33 / boss-star 37 are live at WX 3898–3965 and become named exports in #901. Portal **tile** ellipse tw/3×th/4 ≈ 26.7×10 is #995. Hazard overlay grain 2–3 / lava 4×4 / ice 3×3 is #1076. In-battle cube grain `1+rng` (~1–2 px) / height 28 is #1109. Floor overlay stroke **1.5** / hover radius `tw/2` (40 / 70) is **#1196**. Summon tint after #1059 is 2px stroke, no blur. Creation CSS **240×210**, lobby CSS **120** / painted **192×192**, shadcn **44px** (#895 / #935 / #1010 / #1068 / #1115 `OWNER_MIN_HIT_PX` / #1125 / #1162) and #1194 overscroll-contain are not upload sizes. Unchanged vs 10-27 except those citations. Do not confuse overlay stroke **1.5** with squash max **1.5**.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. Custom default scale = 1. Do not invent 64×64 / 128×128. Do not key `boss_large` off `isBoss` / `family==="boss"`. Show the spec sheet **before** file selection. Import `PIXEL_PATTERN_CELL_SIZE` after #961 for cell math only. Import `PORTAL_WHIRLPOOL_RADIUS` after #901 for swirl clip only. Import `ISO_WALL_HEIGHT` after #995 for wall-clip only. Import `drawHazardOverlay` after #1076 for overlay-clip only. Import `drawBattlePortalCube` after #1109 for cube-clip only. Import `drawWalkTileOverlay` after #1196 for floor-highlight-clip only. Import `strokeOwnerTint` after #1059 for summon stroke only.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-004  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-22-002; VAL-2026-09-26-001; VAL-2026-10-27-007; VAL-2026-10-28-001; VAL-2026-10-28-003  
REGRESSION_RISK: HIGH if upload UI asks for 128×128, 192×192 lobby, 40 hover-radius, 1.5 stroke, 28 cube/wall height, 1–2 cube grain, or 3×3 cells as the still size and combat draws 24×24 centered, or boss PNGs are 1.4-stretched enemy art.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / 34×34 live boss / 36 elite-meta / alpha / 256 KiB. Reject JPEG. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity after #1196 combatTileOverlay on a 37-day freeze of 0f5363f  
CATEGORY: fallback-invariant  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `ctx.drawImage` and `createImageBitmap` returns no matches (comment only in `adminVisualStatus.ts`). `engine/visualAssets.ts` absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect`. #961 extract is still canvas `fillRect` cells. #995 extract is still canvas tile fill. #1076 extract is still canvas overlay fill. #1109 extract is still canvas cube fill/stroke. #1196 extract is still canvas diamond fill/stroke — it does not add a bitmap resolver. #1059 only removes summon GPU blur. New bosses still `BOSS_PIXEL_PATTERNS[bossId] ?? boss_12` (`enemyPixelPatterns.ts` 430–432) for the unused 8×12 path; live portal Enemy still chess × 1.4. New summons still `creaturePatterns`. VAL-2026-09-01-001 copy change did not wire combat. HEAD `0f5363f` since 2026-09-21. Queue through **#1217** without a paint change on main.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons require no uploads. This ID is the 10-28 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-10-27-008, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-01-006; VAL-2026-10-27-008; VAL-2026-10-28-001  
REGRESSION_RISK: HIGH if a hunter wires `spriteUrl` into rAF “to make admin copy true,” or treats #1196 / #1109 / #1076 / #995 / #961 / #1059 as the custom-visual hook.  
VALIDATION_REQUIRED: Empty canister + empty library → today’s pixels. New `BossConfig` without art → generated pixels. After #1196, walk/spell/hover floors still paint with no library. After #1109, in-battle cubes still paint with no library. After #1076, lava/ice/spikes still paint with no library. After #1059, summon stroke-only still paints with no library. After #961, player and combatant fillRect still paint with no library.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Spec sheet before file pick must not use #1196 hover radius 40/70 / stroke 1.5, or #1194 overscroll contain, as upload sizes  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live combat stills are 24×24 at tile top+9 (WX 8315–8326 / `drawPixelPattern` 3855). Creation preview is 80×80 art on internal canvas **320×280** with CSS **240×210** (`CharacterCreation.tsx` 151–153, 452–463). Portrait is **60×60**. Admin catalog preview is 72×72 `object-fit:contain`. Lobby `CharacterPreview` is CSS **120** / internal **240** / painted **192×192** at 24px cells (`CharacterSelection.tsx` 310–348). After #1196, hover radius is `tw/2` (desktop **40** = `TILE_HEIGHT`, mobile-zoom **70**) and overlay stroke is **1.5** (same numeral as squash max, different unit). Open PR [#1194](https://github.com/Mr-Melic/stralt/pull/1194) contains HoverCard/Tooltip/menu overscroll — not a px box. After #1109, cube grain is `1+rng` (~1–2 px) and height is 28. After #1076, overlay grain is 2 or 3 px and lava glow is 4×4. After #995, portal-tile ellipse `tw/3 × th/4` ≈ 26.7×10 is **tile geometry**. Barrier towers 6×28=168. VAL-2026-10-27-009 already forbade 240×210 / Button 44 / lobby 192 / cell 3 / whirlpool 25 / wall 28 / hazard 2–4 / cube 1–2.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; admin spec sheet  
RECOMMENDED_ACTION: Spec sheet **before** file pick lists 24×24 (48 @2×), live boss 34×34, elite-meta 36, PNG/WebP, alpha, 256 KiB. Explicitly reject using 1 / 1.5 / 2 / 3 / 4 / 9 / 10 / 25 / 26 / 26.7 / 28 / 33 / 37 / 40 / 41 / 44 / 60 / 70 / 72 / 80 / 120 / 168 / 192 / 240×210 / 320×280 as recommended art size. Use 44px only for picker **button/input** hit targets after #895 / #935 / #1010 / #1068 / #1115 / #1125 / #1162. Use 28 only as a wall-or-cube clip warning. Use 40/70 only as a floor-highlight clip warning. Use 1–4 only as cube/hazard-overlap warnings.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-10-27-009  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-10-27-009; VAL-2026-10-28-001; VAL-2026-10-28-005; VAL-2026-10-28-007  
REGRESSION_RISK: HIGH if owners author against a 40px hover radius (tile height), a 1.5px overlay stroke, a 70px mobile glow, or the lobby 192×192 box and combat draws 24×24 centered.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / alpha / 256 KiB and names the forbidden HUD/creation/lobby/portal/wall/cube/hazard/overlay/a11y/cell sizes. Reject JPEG. Empty library player still chess.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player stills still bypass drawCombatant — second wire at WX 8315; #1196 overlay extract does not replace that site  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemies/summons/bosses use `drawCombatant` (WX 8063–8075) with `drawPattern: drawPixelPattern`. Player uses `drawPixelPattern` + `getPersistedPiecePattern` (8315–8326) and is **not** in `combatantsRef` (sprite key `"player"`, drawOrder 99999 at 8337–8342). `DrawCombatantOptions` still has no bitmap hook (`pieceArt.ts` 714–744). `drawPixelPattern` trailing `restore` (3883) has no save. #961 only moves the fillRect loop. #995 only moves **tile** fill. #1076 only moves **hazard overlay** fill. #1109 only moves **in-battle portal cube** fill. #1196 only moves **floor highlight** fill/stroke. #1059 only moves summon **stroke**. None of those extracts paint the player. Putting `drawImage` inside `engine/pixelPattern.ts` would hit the player site **and** every combatant branch plus pop the moving-enemy save (8057–8076). Putting `drawImage` inside `engine/tilePaint.ts`, `mapHazardPaint.ts`, `battlePortalCube.ts`, or `combatTileOverlay.ts` would miss combatants entirely and stamp floors. `toCombatantEntry` still drops unknown fields — bind lives on `combatantsRef` Enemy, not turn-order rows. Player bind keys `pieceType`+`playerView`. Custom stills must draw on the shaken rAF ctx (`translate(shake)` 7265–7267); puff uses a sidecar `getContext`.  
SYSTEMS_AFFECTED: `pieceArt.ts` `drawCombatant`; WX player site 8315–8326  
RECOMMENDED_ACTION: Optional top branch on `drawCombatant` **and** one player-site call that uses the same resolver keyed by `pieceType`+`playerView`. Omitted option ≡ today. Set `imageSmoothingEnabled = false` on the shaken rAF ctx immediately before `drawImage` (scale/shake at 7263–7267 reset 2D state; CSS `image-rendering: pixelated` is display-time). Do not add the player to `combatantsRef` from this library. Do not draw the player through `drawPixelPattern`, `drawIsometricTile`, `drawHazardOverlay`, `drawBattlePortalCube`, or `drawWalkTileOverlay` ImageBitmap overloads. Summon custom path additionally calls `strokeOwnerTint` (VAL-2026-10-26-003).  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011 / VAL-2026-09-01-007 / VAL-2026-10-27-010  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-10-27-010; VAL-2026-10-28-001; VAL-2026-10-28-003  
REGRESSION_RISK: HIGH if only the enemy dispatch paints PNGs and the player stays chess (or vice versa); HIGH if `drawPattern` / `drawIsometricTile` / `drawHazardOverlay` / `drawBattlePortalCube` / `drawWalkTileOverlay` is overloaded to accept ImageBitmap.  
VALIDATION_REQUIRED: No option / empty library → fillRect both sites. Custom player revoke → next frame chess. Enemy custom does not require a player upload. Bound 24×24 PNG stays crisp after resize and hit-shake. Floors, lava, walk overlays, and in-battle cubes stay generated after a custom still binds.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Version-gate and remount-keep PRs through #1215 still do not preserve visual-library keys — uploads stay canister DRAFT  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and keys ending `_inventory`. `App.tsx` still `localStorage.clear()` on `APP_VERSION`. Open persist remount PR after VAL #1169 — **[#1215](https://github.com/Mr-Melic/stralt/pull/1215)** — skips remount `upgradeSpell` retry after leftover spell-level keep. It does not add visual-library keys. Newest sibling **#1217** is Broodmother advertised venom, not persist. VAL-2026-09-25 already required canister DRAFT until ACTIVE. VAL-2026-10-27-011 covered through #1157.  
SYSTEMS_AFFECTED: library persistence; must not extend `shouldPreserveVersionGateKey` from this designer without a dedicated persist ID  
RECOMMENDED_ACTION: Bytes live in object storage; metadata in optional admin maps. Never `localStorage` / `nsKey` / `Character.pixelPattern`. Drafts never enter `resolveRuntimeVisual`. Safe-delete / deactivate does not depend on version-gate preserve. Do not restack the remount-keep helpers. New canister maps need a migration after `20260901` (`OldActor = {}`).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002 / VAL-2026-08-31-014  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014; VAL-2026-10-27-011; stack-compat with version-gate / remount-keep PRs  
REGRESSION_RISK: HIGH if a hunter stores ImageBitmap keys in `localStorage` and an `APP_VERSION` bump silently empties the library while combat still expects ids; HIGH if VAL concatenates remount-keep skip helpers.  
VALIDATION_REQUIRED: Version bump with a DRAFT asset → combat stays builtin. Empty library after wipe → chess pixels. Duplicate-export scan clean vs remount-keep PRs.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-28-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#1169  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, #694, #715, #782, #835, #880, #930, #990, #1051, #1110, **#1169**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings or #724 / #798 / #828 / #838 / #841 / #861 / #883 / #901 / #911 / #945 / #961 / #966 / #995 / #1001 / #1010 / #1059 / #1066 / #1068 / #1076 / #1109 / #1115 / #1125 / #1162 / **#1190** / **#1194** / **#1196** TS. Rewriting `ACTION_IDS_VAL_2026-10-27.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-10-28.md`, `docs/automation/ACTION_IDS_VAL_2026-10-28.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers with #724 / #639 / #631 / #730 / #798 / #795 / #828 / #831 / #838 / #841 / #861 / #883 / #901 / #911 / #945 / #961 / #966 / #995 / #1001 / #1059 / #1066 / #1076 / #1109 / #1115 / #1190 / #1196.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-10-28 ACTION_IDs. Production code not modified.*
