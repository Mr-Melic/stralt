# ACTION_IDs — 2026-09-23 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-23.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-23.md).  
HEAD inspected: `0f5363f` (same SHA as 2026-09-21 and 2026-09-22). Gameplay / production code was not modified.

Prior IDs:

- `VAL-2026-08-31-001` … `019` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (merged design PR #121). **None implemented** except as noted below.
- `VAL-2026-09-01-001` … `011` in [`ACTION_IDS_VAL_2026-09-01.md`](./ACTION_IDS_VAL_2026-09-01.md). **001 IMPLEMENTED (copy only).** 002–011 still NEW.
- `VAL-2026-09-02-001` … `012` in [`ACTION_IDS_VAL_2026-09-02.md`](./ACTION_IDS_VAL_2026-09-02.md). **All still NEW.**
- `VAL-2026-09-21-001` … `014` in PR [#355](https://github.com/Mr-Melic/stralt/pull/355) (**not on main**). **All still NEW.** `VAL-2026-09-21-007` visual gates remain **superseded** by `VAL-2026-09-22-002`.
- `VAL-2026-09-22-001` … `012` in PR [#418](https://github.com/Mr-Melic/stralt/pull/418) (**not on main**). **All still NEW.**

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-23

| ID | Title (short) | Status 2026-09-23 |
| :--- | :--- | :--- |
| VAL-2026-08-31-001 | Empty-library fallback | NEW — `resolveRuntimeVisual` absent; no `drawImage` in `src/` |
| VAL-2026-08-31-002 | Owner-only canister metadata | NEW — still `#admin` catalog, no library type |
| VAL-2026-08-31-003 | Upload specs before file pick | NEW — admin still pastes URLs |
| VAL-2026-08-31-004 | Freeze render profiles from live renderer | NEW — cell size unchanged; live vs table boss split still 09-22 |
| VAL-2026-08-31-005 | Bind at spawn, never in render | NEW — no `visualAssetId`; bind must land on `combatantsRef` (this file’s 002) |
| VAL-2026-08-31-006 | Weighted pools, else builtin | NEW |
| VAL-2026-08-31-007 | Boss profile is not a stretched enemy | NEW — portal **live** is chess×1.4, not 8×12×1.4 |
| VAL-2026-08-31-008 | Visual size ≠ gameplay footprint | NEW — occupancy one tile; tested hit `h` is **41**, not `drawSize.h` 60 |
| VAL-2026-08-31-009 | Iso-tile preview | NEW — admin is still 72×72 `object-fit:contain` |
| VAL-2026-08-31-010 | Admin CRUD / assign / revert / inspect | NEW |
| VAL-2026-08-31-011 | Optional drawImage in drawCombatant | NEW — player still a second call site (WX 8315) |
| VAL-2026-08-31-012 | Do not treat spriteUrl as the library | NEW — copy is honest; WX unused; admin query hook is not combat (this file’s 006) |
| VAL-2026-08-31-013 | Family pixels are ghost/minion-only | NEW — grids still `enemyPixelPatterns.ts` 434–498 |
| VAL-2026-08-31-014 | Bytes in object storage | NEW — sprite fields still `?Text` |
| VAL-2026-08-31-015 | Versioned replace + safe delete | NEW |
| VAL-2026-08-31-016 | Future categories ineligible | NEW |
| VAL-2026-08-31-017 | Extract to engine/, do not grow WX | NEW — WX **19213**; `spawnPolicy.ts` 297; `combatantStore.ts` 603 |
| VAL-2026-08-31-018 | Four stills only; no walk cycles | NEW — Walk Animation Frames UI still present (AdminDashboard 1588–1590) |
| VAL-2026-08-31-019 | Elite metadata-only until a real flag | NEW — still no `isElite` |
| VAL-2026-09-01-001 | Stop admin copy claiming unused spriteUrl is live | **IMPLEMENTED** (`adminVisualStatus.ts`) |
| VAL-2026-09-01-002 … 011 | (see 09-01 ledger) | NEW |
| VAL-2026-09-02-001 … 012 | (see 09-02 ledger) | NEW |
| VAL-2026-09-21-001 … 006, 008 … 014 | (see PR #355) | NEW — docs not on main |
| VAL-2026-09-21-007 | Key boss/minion off flags and id prefix | **SUPERSEDED for visual assignment** by VAL-2026-09-22-002 |
| VAL-2026-09-22-001 … 012 | (see PR #418) | NEW — docs not on main. 005 (smoothing) is refined by this file’s 004, not replaced. |

---

ACTION_ID: VAL-2026-09-23-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity on 0f5363f — still no drawImage anywhere in src/  
CATEGORY: invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same HEAD as 09-21 and 09-22 (`0f5363f`). Grep of `src/` for `ctx.drawImage`, `createImageBitmap`, and `imageSmoothingEnabled` returns no matches (drawImage mentioned only as a comment in `adminVisualStatus.ts` 5). `engine/visualAssets.ts` is absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect` via `draw` / `drawPatternInline`. WX is 19213 lines. PRs #355 and #418 are still draft and unmerged; `main` has no 09-21/09-22 files. VAL-2026-09-01-001 copy change did not wire combat.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons/Rush rooms require no uploads. This ID is the 09-23 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-09-02-012 / VAL-2026-09-21-001 / VAL-2026-09-22-001, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper only  
DEPENDENCIES: VAL-2026-08-31-001  
REGRESSION_RISK: LOW if identity on empty input. HIGH if anyone wires raw `spriteUrl`.  
VALIDATION_REQUIRED: Tests: library `[]`, inactive id, corrupt id → builtin. Manual: new boss portal and a Boss Rush room with empty library match current pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Bind visualAssetId on combatantsRef Enemy objects — not on CombatantEntry / turnOrder  
CATEGORY: assignment-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Draw reads `combatantsRef.current[renderItem.idx]` (WX 8030) and passes that Enemy to `drawCombatant`. Comments at 1638–1640 call combatantsRef the single source of truth. Portal `isBoss`/`bossId` are written on **turn-order** `CombatantEntry` at battle start (WX 11958–11983) and are **not** on the live Enemy — which is why 8×12 tables never paint. `toCombatantEntry` (`combatantStore.ts` 141–169) copies a fixed field list and **strips** extras when rebuilding the strip. `updateCombatant` (413–425) spreads `patch` onto **both** combatants and turn-order, so a visual-only patch would leak into InitiativeStrip. `syncCombatants` (464–477) replaces the whole combatant array.  
SYSTEMS_AFFECTED: spawn / `addCombatant`, `engine/combatantStore.ts` callers, `DrawCombatantOptions` wiring  
RECOMMENDED_ACTION: Write `visualAssetId` onto the Enemy at spawn/`addCombatant`. Resolver reads that object. Do not bind on `CombatantEntry`. HP/AP patches must `{...c, ...patch}` so the field survives. `syncCombatants` callers must not map a new list that omits it. InitiativeStrip ignores unknown extras. Do not add the field to `CharacterStats`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-005  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-21-011; VAL-2026-09-22-002  
REGRESSION_RISK: HIGH if bind lives only on turn-order (draw never sees it) or if `syncCombatants` drops the field and every unit snaps to builtin mid-fight.  
VALIDATION_REQUIRED: Bind at spawn; `updateCombatant(id, { hp })` keeps the same `visualAssetId`; 100 rAF ticks unchanged; empty library identical.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom drawImage dest rects must use pointerToRenderSpace CSS pixels — not canvas backing-store width  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `pointerToRenderSpace` (WX 8991–9004) converts client coordinates with `canvasSize.width / getBoundingClientRect().width` (and the height analogue). Comment: uses canvasSize (CSS state) NOT canvas.width (physical backing-store). `hitTestSprite` (8876–8916) and `gridToScreen` operate in that space. Resize sets `canvas.width = floor(cssW * dpr)` then `ctx.scale(dpr)` (13953–13965, 7263–7264). Drawing a bitmap in backing-store pixels would desync clicks from art.  
SYSTEMS_AFFECTED: custom `drawImage` branch, `visualPreview.ts`, click-hit comments  
RECOMMENDED_ACTION: `drawImage(bitmap, drawX - w/2, drawY - h/2, w, h)` in the same CSS space as `fillRect`. Preview “actual scale” pane uses 80×40 / 140×70 diamonds from `TILE_*` / `MOBILE_ZOOM`, not `canvas.width`. Do not multiply dest size by `dpr`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-21-010  
DEPENDENCIES: VAL-2026-09-21-010; VAL-2026-09-02-001; VAL-2026-08-31-011  
REGRESSION_RISK: HIGH if HiDPI dest is 2× chess neighbors, or if hit-test CSS space and draw backing space diverge.  
VALIDATION_REQUIRED: Continue on a 390px-wide viewport and a 2× DPR desktop: custom 24×24 and chess 24×24 share screen size; sprite click still uses padding 10 on the 80×41 box.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: CSS image-rendering:pixelated does not replace ctx.imageSmoothingEnabled=false  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 09-22 said admin `<img>` is pixelated and that CSS does not apply to the world canvas. Re-read: the **world canvas** sets `imageRendering: "pixelated"` (WX 17890) and global `canvas { image-rendering: pixelated; -moz-crisp-edges; crisp-edges }` (`index.css` 652–655) covers every canvas (portrait 18115, creation 458, selection 373, landing 219). That CSS controls **how the finished bitmap is displayed**. `src/` still never sets `imageSmoothingEnabled`. Canvas2D default smoothing is **on**, so `drawImage` of a 24×24 PNG into logical dest blurs **before** CSS display. VAL-2026-09-22-005 still required.  
SYSTEMS_AFFECTED: custom branch in `drawCombatant` / player site; `visualPreview.ts`  
RECOMMENDED_ACTION: In the custom branch only: `ctx.save(); ctx.imageSmoothingEnabled = false; drawImage(...); ctx.restore();`. Do not skip this because world/CSS pixelated exists. Do not set the flag on the shared rAF ctx. Do not stretch. Integer dest sizes preferred.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-22-005  
DEPENDENCIES: VAL-2026-09-22-005; VAL-2026-08-31-011; VAL-2026-09-02-003  
REGRESSION_RISK: MEDIUM if a hunter treats CSS pixelated as sufficient and ships blurry PNGs next to fillRect chess.  
VALIDATION_REQUIRED: 24×24 PNG next to chess pawn: custom edges stay blocky at desktop 1×, HiDPI, and after Continue zoom.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Cache ImageBitmap across canvas.width resets — do not cache CanvasPattern from the world ctx  
CATEGORY: lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: ResizeObserver `applySize` assigns `canvas.width = floor(cssW * dpr)` (WX 13956). Comment at 13972–13973: `canvas.width=` **CLEARS the entire 2D context** and must not fire mid-frame. Decode-once into `ImageBitmap` is independent of ctx and survives. A `createPattern` / `getImageData` taken from the world ctx dies on every layout. Landing `getImageData` (LandingPage.tsx 75) is a **temp** canvas, not the world ctx — do not copy that pattern onto combat.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` bitmap cache; must not hook rAF resize  
RECOMMENDED_ACTION: Cache keyed by `ASSET_ID`+`VERSION`. Survive resize without re-fetch/decode. Never store ctx-bound patterns. After fallback/replace: `bitmap.close()`. Do not re-decode inside rAF.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-22-009  
DEPENDENCIES: VAL-2026-09-22-009; VAL-2026-08-31-015; VAL-2026-09-22-007  
REGRESSION_RISK: MEDIUM if every resize re-hits object storage, or if a closed bitmap is drawn the same frame.  
VALIDATION_REQUIRED: Decode once; resize the world pane 10 times: no extra decode; empty library unchanged; deactivate still next-frame builtin.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: useGetEnemyConfigs is admin catalog React Query — not combat consumption of spriteUrl  
CATEGORY: scope  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Prior designs said “WX never calls getEnemyConfigs.” Still true for `WorldExploration.tsx` (zero matches). `useGetEnemyConfigs` (`useSpellQueries.ts` 111–137) **does** call `actor.getEnemyConfigs()` and normalizes `spriteUrl` to a tuple for the admin dashboard. `useGetPlayerSpriteConfigs` (233–254) is the same pattern. Implementers grepping `getEnemyConfigs` will find a live hook and may wire `drawImage(spriteUrl)`.  
SYSTEMS_AFFECTED: assignment import UI; must not change Admin query hooks as a shortcut to combat  
RECOMMENDED_ACTION: Treat the hook as catalog I/O only. Combat resolver never reads those query caches. Import of existing https rows stays **inactive** + `#invalid` until Blob decode and profile checks pass. Do not use query success as `VALIDATION_STATUS = #ok`.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-012; VAL-2026-09-01-002; VAL-2026-09-22-007  
REGRESSION_RISK: HIGH if `drawImage(config.spriteUrl[0])` is added because “getEnemyConfigs is already used.”  
VALIDATION_REQUIRED: Admin enemy list still loads. Empty library: world pixels unchanged. Filled spriteUrl still “Stored URL — not rendered in world.”  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player custom stills key pieceType + playerView — not Character.pixelPattern or sprite URLs  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getPersistedPiecePattern` (`pieceArt.ts` 653–658) is a pieceType → grid lookup. Comment: “Never treat sprite URLs as required.” WX player draw uses it (8289, 8315–8326) and never reads `character.pixelPattern`. Creation **does** persist `JSON.stringify(chessPiecePatterns[selectedPiece])` (`CharacterCreation.tsx` 273). Portrait also uses `getPersistedPiecePattern(pieceType, "front")` (3719). Admin `"custom"` piece type (`AdminDashboard.tsx` 1250–1258) is not a live `ChessPieceType`.  
SYSTEMS_AFFECTED: player-world bind, portrait (v1 stays pixels), PlayerSpriteConfig import  
RECOMMENDED_ACTION: Player library rows assign by chess `pieceType` + optional direction stills. Missing direction → front → builtin. Do not parse persisted `pixelPattern` JSON as an assignment key. Do not treat admin `"custom"` as a category. Portrait/creation/selection stay generated pixels in v1 (VAL-2026-09-02-010).  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-01-007; VAL-2026-09-02-010; VAL-2026-09-02-011  
REGRESSION_RISK: MEDIUM if a hunter swaps portrait to `drawImage` with a different anchor than world, or keys off stale pixelPattern strings.  
VALIDATION_REQUIRED: Custom player in world; portrait still chess 60×60; empty library identity; saving pixelPattern at creation does not auto-activate a library row.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not fill required Enemy.scaleX/Y with generateEnemyScaleFactors when binding Rush or summon visuals  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: TypeScript `Enemy` requires `scaleX`/`scaleY` (`gameTypes.ts` 300–301). Pack spawn writes random squash (`spawnPolicy.ts` 227–255; WX 5820–5821). Boss Rush pushes `any[]` **without** scale (WX 5321–5346). `spawnSummonUnit` omits scale (`summonSpawn.ts` 163–188). `drawCombatant` uses `entity.scaleX ?? 1` (`pieceArt.ts` 847–848). A bind helper that constructs a “complete” Enemy via `generateEnemyScaleFactors()` would arbitrarily stretch Rush king.front and summon PNGs (forbidden class of VAL-007 / VAL-2026-09-02-009 / VAL-2026-09-22-012).  
SYSTEMS_AFFECTED: spawn bind helpers, Rush / summon sites  
RECOMMENDED_ACTION: Optional `visualAssetId` on the live object. Do not call `generateEnemyScaleFactors` at visual bind. Custom `DEFAULT_SCALE = 1`. Builtin pack enemies may keep squash on fillRect only.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-02-009  
DEPENDENCIES: VAL-2026-09-02-009; VAL-2026-09-22-012; VAL-2026-08-31-007  
REGRESSION_RISK: MEDIUM if Rush rooms suddenly squash, or custom summons inherit 0.6–1.4.  
VALIDATION_REQUIRED: Custom 24×24 wolf summon stays 24×24 beside a squash-scaled pawn. Empty library: Rush still king.front 24×24.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom draw inherits the whole-frame shake translate — do not add a second shake from bitmap size  
CATEGORY: invariant  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Render wraps the frame in `ctx.save(); ctx.translate(_shake.x, _shake.y)` (WX 7265–7267) from `effectsManagerRef.getShakeOffset()`. All fillRect combatants already shake. A custom `drawImage` in the same transform inherits it. Growing shake intensity from `image.width` would be the same forbidden class as growing occupancy from visual size. Preview does not need shake.  
SYSTEMS_AFFECTED: custom draw branch; `engine/effects.ts` shake — **leave shake math**  
RECOMMENDED_ACTION: Draw custom art in the existing frame transform. Do not read bitmap dimensions into `triggerShake`. Do not disable shake for custom units.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-008; VAL-2026-09-01-009  
REGRESSION_RISK: LOW if scoped. MEDIUM if a hunter special-cases custom units out of shake or scales shake with PNG size.  
VALIDATION_REQUIRED: Empty library: shake unchanged. Custom 24×24: same shake as chess neighbor.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: clickTrace mismatches are not a reason to grow occupancy or dump blob URLs into the debug overlay  
CATEGORY: invariant  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `debug/clickTrace.ts` is DEV-gated (header 1–8), injects `pointerToRenderSpace`, and compares spriteRects vs `drawAnchor` / tile (I2 rect-anchor). Sprite rects are **tile-derived** (WX 8086–8104), not pattern-sized. Tall custom art will look like a “miss” in traces while occupancy stays one cell. AGENTS.md: debug overlay must stay reachable; admin/debug never ship to normal players. No `toDataURL` / `getImageData` on the world canvas today (only landing temp canvas).  
SYSTEMS_AFFECTED: `clickTrace.ts` / debug export — leave geometry; `visualAssets.ts` must not log blob URLs  
RECOMMENDED_ACTION: Keep tested 80×41. Preview may warn that art extends past the hit box. Do not rewrite `drawSize` or padding from `image.height`. Debug records may store `visualAssetId` (an id string); they must not store `blob:` URLs, bitmaps, or bytes.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-22-004; VAL-2026-09-22-010; VAL-2026-08-31-008  
REGRESSION_RISK: MEDIUM if “trace shows miss on tall PNG” is fixed by occupancy growth. LOW for omitting blob URLs.  
VALIDATION_REQUIRED: 64×72 custom: occupancy one cell; tested rect 80×41; DEV clickTrace has no `blob:` strings.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not derive upload specs from drawPixelPattern’s “match tile dimensions exactly” comment  
CATEGORY: render-contract  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 3840 comment: “Draw pixel pattern with perfect tile alignment - patterns now match tile dimensions exactly.” Live math: `pixelSize = 3` (3855); chess 8×8 → **24×24**; tiles **80×40**. Patterns are **centered** on the draw point (3860–3861), not stretched to the diamond. Using that comment as a spec would invent 80×40 (or 80×60) recommended uploads and force silent stretch.  
SYSTEMS_AFFECTED: admin spec UI, `RENDER_PROFILES` constants  
RECOMMENDED_ACTION: Recommended stills stay **24×24** (standard/player/summon) and **34×34** (live portal boss). Ignore the 3840 comment. Do not “fix” fillRect to fill the tile as part of VAL.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-004; VAL-2026-09-22-011  
REGRESSION_RISK: MEDIUM if implementers stretch every PNG to 80×40 because a comment said “exactly.”  
VALIDATION_REQUIRED: Spec UI for pawn shows 24×24 recommended, not 80×40. Empty library pixels unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-23-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355 / #418 VAL docs  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge queue (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Draft PR #355 (2026-09-21, `ACTION_IDS_VAL_2026-09-21.md`) and #418 (2026-09-22, `ACTION_IDS_VAL_2026-09-22.md`) are **older** than this run and **not on main**. This run’s unique files are `VISUAL_ASSET_LIBRARY_DESIGN_2026-09-23.md` and `ACTION_IDS_VAL_2026-09-23.md`. Union ≠ concatenate. `VAL-2026-09-21-007` remains superseded by `VAL-2026-09-22-002` for visual gates.  
SYSTEMS_AFFECTED: `docs/automation/` only  
RECOMMENDED_ACTION: Keep unique dated filenames. If a sibling later touches the same path, union one copy per file — do not concatenate ACTION_ID blocks. Run `bash scripts/open-pr-stack-compat.sh --self`. Do not edit `README.md`.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: none (docs-only)  
REGRESSION_RISK: LOW. MEDIUM if a hunter force-pushes over #355/#418 files and drops the boss live-vs-table correction.  
VALIDATION_REQUIRED: `open-pr-stack-compat.sh --self` clean vs `origin/main` and as the next queue item after older PRs.  
STATUS: NEW  
