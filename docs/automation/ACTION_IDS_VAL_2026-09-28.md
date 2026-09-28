# ACTION_IDs — 2026-09-28 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-28.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-28.md).  
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
- `VAL-2026-09-27-001` … `012` in PR [#694](https://github.com/Mr-Melic/stralt/pull/694) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-28

| ID | Status 2026-09-28 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 |
| VAL-2026-09-25-011 elite rec 34 | Corrected by VAL-2026-09-26-001 (squash max 1.5 → rec 36) |
| VAL-2026-09-26-005 Rest/Death desktop follow pane | **Corrected** by VAL-2026-09-27-001 (desktop paint ignores `cameraRef`) |
| VAL-2026-09-27-002 share gridToScreen | **Extended** by VAL-2026-09-28-001 (import `#639` `isoGrid.ts`, do not copy) |
| VAL-2026-09-27-009 extract siblings | **Extended** by VAL-2026-09-28-005 (#639 was missing from that list) |

---

ACTION_ID: VAL-2026-09-28-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Import engine/isoGrid from PR #639 — do not copy gridToScreen into visualPreview  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: This SHA still inlines iso math in WX `gridToScreen` (3772–3790), `_screenToGrid` (3819–3838), `rebuildTileCornerCache` (~8844), and `clientToGrid` (8921–8988). Open PR [#639](https://github.com/Mr-Melic/stralt/pull/639) (created 2026-09-26) adds `src/frontend/src/engine/isoGrid.ts` with `isoTileTopVertexRounded`, `isoTileCenter`, `isoApproxGrid`, `pickIsoTileFromPoint`, plus `isoGrid.test.ts` that locks the live algebra. VAL-2026-09-27-002 said “share gridToScreen” but never named #639. A third copy of the origin formula will fail Caffeine esbuild if both export the same helper name, and will desync when #639 lands.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `engine/visualPreview.ts` (new), WX projection; sibling #639  
RECOMMENDED_ACTION: After #639, import `isoTileTopVertexRounded` / `IsoView`. On this SHA, call the live `gridToScreen` result already computed for the pixel path — do not paste a private projector. Union, do not concatenate, if VAL and #639 both add `isoGrid.ts`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-27-002 / VAL-2026-08-31-017  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-27-002; stack-compat with #639  
REGRESSION_RISK: HIGH if VAL ships a second `isoTileTopVertexRounded` or a camera-aware blit that ignores the desktop cam=0 gate.  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src`. Phone Continue + walk: PNG and chess dummy share the same diamond as the floor tile. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Preview and drawImage use the rounded top vertex — not unrounded isoTileCenter  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #639 tests (`isoGrid.test.ts` in that PR) assert mobile zoom + camera can make `isoTileTopVertex.x !== isoTileTopVertexRounded.x`, and that the click cache keeps **unrounded** centers so inverse-formula drift does not move picks. Live `gridToScreen` already `Math.round`s (WX 3787). Character body is roundedTop + 9 (`CHARACTER_Y_OFFSET = -9`). `tileCenter` / `isoTileCenter` is top + th/2 (desktop +20). VAL-2026-09-27-003 froze the 11 px puff gap; it did not freeze the rounded-vs-unrounded split.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; custom `drawImage` origin  
RECOMMENDED_ACTION: Bitmap origin = `(roundedTop.x, roundedTop.y - CHARACTER_Y_OFFSET)` then center the image (same as `drawPixelPattern` 3860–3861). Preview may **draw** the unrounded center as a second dummy for click-cache education, but must not place the PNG there. Do not “fix” rounding.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-09-27-003  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-28-001  
REGRESSION_RISK: MEDIUM if owners author overlap from the click-cache center and live paint is a half-pixel off on 140×70 tiles.  
VALIDATION_REQUIRED: Spec sheet lists both points. 24×24 PNG on tile (8,8) desktop lines up with chess `fillRect` cells. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom drawImage must run on the shaken rAF context — not a sidecar getContext like spawnPixelPuff  
CATEGORY: renderer  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Each combat frame does `setTransform` identity, `scale(dpr)`, `save`, `translate(_shake.x, _shake.y)` (WX 7263–7267) then paints tiles and combatants. `spawnPixelPuff` is called from summon commit with `canvasRef.current?.getContext("2d")` at tile center (9305–9313) — a one-shot blit that the next rAF `clearRect`s and that does **not** inherit the shake save. VAL-2026-09-27-003 / 008 kept the puff generated; they did not say custom stills must share the shaken ctx.  
SYSTEMS_AFFECTED: `drawCombatant` optional bitmap branch; WX player site 8315; puff (leave generated)  
RECOMMENDED_ACTION: Draw bound PNGs through the same `ctx` already passed into `drawCombatant` / `drawPixelPattern`, after the shake translate. Do not open a second 2D context for combat stills. Do not bind a custom puff atlas. Cache `ImageBitmap`; `canvas.width=` clears context state, not bitmaps.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-09-27-003  
REGRESSION_RISK: HIGH if a hunter blits from a second context and hit-test CSS space no longer matches the painted PNG during shake.  
VALIDATION_REQUIRED: Empty library pixels identical including shake. Bound PNG translates with chess during a hit-shake. Puff remains generated `fillRect`s.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Seed pool picks from SpawnedSummon.id — never the enemy-summon wrapper spell id  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spawnSummonUnit` mints `id: \`summon-${Math.random().toString(36).slice(2)}\`` (`summonSpawn.ts` 153) and stores it on the live Enemy. `spawnEnemySummonUnit` builds a wrapper spell whose `id` is `enemy-summon-${unitDef.pieceType}` (271) and then calls `spawnSummonUnit` — so two enemy wolves share the wrapper id and still get distinct instance ids. `toCombatantEntry` (`combatantStore.ts` 141–169) would drop `visualAssetId`. VAL-2026-09-02-004 hashed instance id generally; it did not call out this collision.  
SYSTEMS_AFFECTED: summon spawn bind; `engine/visualAssets.ts` pick helper  
RECOMMENDED_ACTION: `visualAssetId = pickWeighted(seededRng(hash(summon.id, poolId, poolVersion)), eligible)` written once onto the Enemy. Do not hash `enemy-summon-wolf`. Do not bind on CombatantEntry. `turnsRemaining` ticks must not re-pick. Missing scale on summons stays default 1 (`pieceArt.ts` 846–848) — do not fill squash.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-08-31-006; VAL-2026-09-02-004; VAL-2026-09-23-001  
REGRESSION_RISK: HIGH if two simultaneous enemy summons of the same pieceType flicker to the same pooled art or steal each other’s bind.  
VALIDATION_REQUIRED: Spawn two enemy wolves: distinct `visualAssetId` when the pool has ≥2 assets; 100 rAF ticks each stay put; empty pool → builtin creature pixels + owner tint.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Union VAL with isoGrid #639 plus hit-test/wander/Doka extracts — 09-27 sibling list was incomplete  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: VAL-2026-09-27-009 listed [#427](https://github.com/Mr-Melic/stralt/pull/427) hit-test, [#514](https://github.com/Mr-Melic/stralt/pull/514) wander target, [#591](https://github.com/Mr-Melic/stralt/pull/591) wander, [#683](https://github.com/Mr-Melic/stralt/pull/683) ground Doka. [#639](https://github.com/Mr-Melic/stralt/pull/639) iso projection existed since 2026-09-26 and is the projector VAL must share. WX is 19213 lines. AGENTS.md forbids growing the rAF body. Additional WX extracts (#468 names, #369 AP/MP) are not visual catalogs.  
SYSTEMS_AFFECTED: WX; `engine/visualAssets.ts`; sibling engine extracts  
RECOMMENDED_ACTION: New modules + tests. WX at most: pass resolver into `DrawCombatantOptions`, one player `drawImage` line, bind `visualAssetId` at spawn. Restack with **union** (one `export function` per name). Do not pick art from wander, Doka, or name-pool rolls.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-09-27-009  
DEPENDENCIES: VAL-2026-08-31-017; stack-compat with #427 #514 #591 #639 #683  
REGRESSION_RISK: HIGH if VAL concatenates `isoTileTopVertexRounded` / `hitTestSprite` / `planGroundDokaLoot` — Caffeine `vite build` fails.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR; `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom bitmap path must not ride drawPixelPattern — unpaired restore pops the moving-enemy save  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `drawPixelPattern` always `ctx.restore()` at WX 3883 with **no** matching `save`. Moving enemies `ctx.save()` (shadow `#ff6b6b`, blur 8, pulsing alpha) then call `drawCombatant` with `drawPattern: drawPixelPattern` then `restore` (8057–8076). The inner restore already pops the moving wrap; the outer restore pops the rAF shake save. `drawPatternInline` (`pieceArt.ts` 753–782) correctly does **not** restore. Putting `drawImage` inside `drawPixelPattern` inherits this bug and would interpret PNG bytes as a cell grid.  
SYSTEMS_AFFECTED: `pieceArt.ts` `drawCombatant`; WX `drawPixelPattern`; moving-enemy bloom  
RECOMMENDED_ACTION: Optional top branch in `drawCombatant` (not in `drawPattern`). Custom stills inherit the moving wrap by being called **between** that save/restore; do not add a second bloom. Prefer injecting a drawPattern that does not restore, or stop passing `drawPixelPattern` once the unpaired restore is fixed outside VAL.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-02-003 / VAL-2026-09-27-004  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-02-003  
REGRESSION_RISK: HIGH if `drawImage` is stuffed into `drawPixelPattern` and shake/moving glow desyncs for every combatant.  
VALIDATION_REQUIRED: Empty library moving-enemy chess still pulses. Bound PNG pulses with the same blur/alpha. No extra `restore` underflow (board does not jump after a moving unit).  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Landing requireHttpsUrl and shop JPEG proof are not combat upload validation  
CATEGORY: scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `adminGuard.requireHttpsUrl` (`adminGuard.mo` 97–104) forces landing ads onto `https:`. `proofDataMimeAllowed` (109–116) allows `data:image/jpeg` / png / pdf / octet-stream; frontend cap 524_288 (`adminSafety.ts` 137). Combat `unsafeUrl` (89–94) rejects `javascript:` / `data:` / `vbscript:` / `file:` and never decodes pixels. VAL-2026-09-01-005 already said URL checks are not image validation; https-only ads and JPEG proofs landed after that wording and are easy to copy into the library gate.  
SYSTEMS_AFFECTED: combat upload validator (new); landing ads (leave); shop KYC (leave)  
RECOMMENDED_ACTION: Combat stills: decode PNG/WebP, require transparency, enforce category boxes. Do not require https on blob refs. Do not accept JPEG because the shop does. Do not route ad bytes through `resolveRuntimeVisual`.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-09-01-005; VAL-2026-08-31-016; VAL-2026-09-02-006  
REGRESSION_RISK: MEDIUM if an orchestrator reuses `requireHttpsUrl` and blocks object-store blob ids, or allows opaque JPEGs on the diamond.  
VALIDATION_REQUIRED: Spec sheet before the file picker lists PNG/WebP + alpha. A JPEG is rejected for combat upload. Landing ads still render.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: VARIANT_TAGS must not use InitiativeStrip ENEMY_ICONS regex  
CATEGORY: assignment-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `ENEMY_ICONS` (`InitiativeStrip.tsx` 65–80) maps `/goblin/i`, `/boss|lord|king/i`, `/ghost|spirit/i`, etc. onto emoji. `assignedName` is a flavor string from the admin name pool (WX 5751–5840). Chess `pieceType` is independent. A hunter matching `VARIANT_TAGS` with those regexes would bind “king” lore names to boss art and “ghost” names to family pixels even when `assignedName !== "Ghost"` (the only live family-pixel gate, `pieceArt.ts` 932).  
SYSTEMS_AFFECTED: assignment matcher; InitiativeStrip (leave emoji)  
RECOMMENDED_ACTION: Explicit metadata only (`ENTITY_IDS`, `ENTITY_FAMILY`, `VARIANT_TAGS` exact). Do not parse `assignedName`. Strip emoji stay generated.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-013; VAL-2026-09-23-006  
REGRESSION_RISK: HIGH if name-regex assignment silently restyles half the overworld.  
VALIDATION_REQUIRED: Enemy named “Ghost King” with `family: "default"` still paints chess unless an explicit bind exists. Empty library strip icons unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Iso-preview overlap uses neighbor pitch (40, 20) — warn before MAX_WIDTH 80  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Desktop half-tile is `(TILE_WIDTH/2, TILE_HEIGHT/2) = (40, 20)`; neighbor distance √(40²+20²) ≈ **44.7** CSS px (WX 3785–3786; #639 `isoTileTopVertex` uses the same halfW/halfH). `MAX_WIDTH` 80 is the **home tile** width. A 48-wide centered sprite already reaches past the 40 px half-width toward the neighbor diamond. Occupancy stays one tile (`occupancy.ts` 84–96).  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; upload warnings  
RECOMMENDED_ACTION: Preview two adjacent 80×40 diamonds with 24×24 vs 48×48 vs 80-wide art. Warn visual overlap at width &gt; 40, not only at 80. Do not change occupancy, range, or hit `h`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-09-25-008  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-008; VAL-2026-09-28-002  
REGRESSION_RISK: MEDIUM if owners ship 80-wide art that covers the neighbor name label and testers only checked MAX_WIDTH.  
VALIDATION_REQUIRED: Preview of a 48-wide PNG shows a neighbor-overlap warning; 24×24 does not. Click tests still 80×41 + pad 10/14.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: After #639, IsoView.camX/camY must apply the desktop 0 gate in the caller  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #639 `IsoView` documents “Callers resolve desktop cam=0 before passing camX/camY.” The PR’s `isoViewNow` still uses `camX: isDesktop ? 0 : cameraRef.current.x`. Rest/Death writes `cameraRef` (WX 5877–5893) then returns **before** the desktop lock; paint still uses cam 0 when `innerWidth > 1024` (3780–3781). VAL-2026-09-27-001 / 011 froze that for WX; a preview that builds `IsoView` from raw `cameraRef` would pan a 1280 sanctuary.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` Rest/Death / overworld panes  
RECOMMENDED_ACTION: Desktop panes (`>1024`) always pass `camX: 0, camY: 0`. Phone/tablet Rest/Death may follow. Empty roster still paints player chess. Do not add `ctx.translate(camera)` in the custom draw path on desktop.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-27-001  
DEPENDENCIES: VAL-2026-09-27-001; VAL-2026-09-27-011; VAL-2026-09-28-001  
REGRESSION_RISK: MEDIUM if preview pans at 1280 px and owners author overlap that never happens in live paint.  
VALIDATION_REQUIRED: At 1280×800 Rest map, player chess and a bound 24×24 PNG stay in the same cam-0 diamond layout as overworld. At 390 px after Continue, follow pane is used.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Cache ImageBitmap across canvas.width resets — context restore uses window.innerWidth  
CATEGORY: renderer  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: rAF may assign `canvas.width` when CSS size × dpr drifts (WX 7256–7261). M-1 sets `canvas.width = 0` then restores (7224–7229). `webglcontextrestored` handler sizes from `window.innerWidth/Height` (13830–13834), not `canvasSize`. Assigning `canvas.width` resets 2D state (`imageSmoothingEnabled`, transform) but does **not** revoke `ImageBitmap`. Re-decoding every frame after a resize would hitch and is not spawn-stable.  
SYSTEMS_AFFECTED: bitmap cache in `engine/visualAssets.ts`; WX canvas sizing (do not “fix” in VAL)  
RECOMMENDED_ACTION: Cache decoded bitmaps by `ASSET_ID`+`VERSION`. Re-apply `imageSmoothingEnabled = false` after any context reset. Do not treat context restore as a pool re-roll. Do not change the innerWidth restore path in this library.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-24-004  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-23-004  
REGRESSION_RISK: MEDIUM if decode runs inside rAF after every resize and combat hitches; HIGH if restore is mistaken for a new encounter seed.  
VALIDATION_REQUIRED: Resize the window with a bound PNG: same `visualAssetId`, no flicker to another pool member. Empty library still recovers from M-1.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-28-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#694  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, **#694**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings. Rewriting `ACTION_IDS_VAL_2026-09-27.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-09-28.md`, `docs/automation/ACTION_IDS_VAL_2026-09-28.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-09-28 ACTION_IDs. Production code not modified.*
