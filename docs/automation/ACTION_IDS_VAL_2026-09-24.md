# ACTION_IDs — 2026-09-24 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-24.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-24.md).  
HEAD inspected: `0f5363f` (same SHA as 2026-09-21, 2026-09-22, and 2026-09-23). Gameplay / production code was not modified.

Prior IDs:

- `VAL-2026-08-31-001` … `019` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (merged design PR #121). **None implemented** except as noted below.
- `VAL-2026-09-01-001` … `011` in [`ACTION_IDS_VAL_2026-09-01.md`](./ACTION_IDS_VAL_2026-09-01.md). **001 IMPLEMENTED (copy only).** 002–011 still NEW.
- `VAL-2026-09-02-001` … `012` in [`ACTION_IDS_VAL_2026-09-02.md`](./ACTION_IDS_VAL_2026-09-02.md). **All still NEW.**
- `VAL-2026-09-21-001` … `014` in PR [#355](https://github.com/Mr-Melic/stralt/pull/355) (**not on main**). **All still NEW.** `VAL-2026-09-21-007` visual gates remain **superseded** by `VAL-2026-09-22-002`.
- `VAL-2026-09-22-001` … `012` in PR [#418](https://github.com/Mr-Melic/stralt/pull/418) (**not on main**). **All still NEW.**
- `VAL-2026-09-23-001` … `012` in PR [#461](https://github.com/Mr-Melic/stralt/pull/461) (**not on main**). **All still NEW.**

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-24

| ID | Title (short) | Status 2026-09-24 |
| :--- | :--- | :--- |
| VAL-2026-08-31-001 | Empty-library fallback | NEW — `resolveRuntimeVisual` absent; no `drawImage` in `src/` |
| VAL-2026-08-31-002 | Owner-only canister metadata | NEW — still `#admin` catalog, no library type |
| VAL-2026-08-31-003 | Upload specs before file pick | NEW — admin still pastes URLs |
| VAL-2026-08-31-004 | Freeze render profiles from live renderer | NEW — cell size unchanged; live vs table boss split still 09-22 |
| VAL-2026-08-31-005 | Bind at spawn, never in render | NEW — no `visualAssetId`; Enemy bind 09-23-002; **player is not an Enemy** (this file’s 004) |
| VAL-2026-08-31-006 | Weighted pools, else builtin | NEW |
| VAL-2026-08-31-007 | Boss profile is not a stretched enemy | NEW — portal **live** is chess×1.4, not 8×12×1.4 |
| VAL-2026-08-31-008 | Visual size ≠ gameplay footprint | NEW — occupancy one tile; tested hit `h` is **41**, not `drawSize.h` 60 |
| VAL-2026-08-31-009 | Iso-tile preview | NEW — admin is still 72×72 `object-fit:contain` |
| VAL-2026-08-31-010 | Admin CRUD / assign / revert / inspect | NEW |
| VAL-2026-08-31-011 | Optional drawImage in drawCombatant | NEW — player still a second call site (WX 8315) |
| VAL-2026-08-31-012 | Do not treat spriteUrl as the library | NEW — copy is honest; WX unused; admin query hook is not combat |
| VAL-2026-08-31-013 | Family pixels are ghost/minion-only | NEW — grids still `enemyPixelPatterns.ts` 434–498 |
| VAL-2026-08-31-014 | Bytes in object storage | NEW — sprite fields still `?Text`; this file’s 005 measures Motoko caps |
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
| VAL-2026-09-22-001 … 012 | (see PR #418) | NEW — docs not on main |
| VAL-2026-09-23-001 … 012 | (see PR #461) | NEW — docs not on main. 005 (bitmap cache vs ResizeObserver) is refined by this file’s 002, not replaced. 004 (CSS pixelated vs smoothing) is refined by this file’s 003. |

---

ACTION_ID: VAL-2026-09-24-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity on 0f5363f — still no drawImage anywhere in src/  
CATEGORY: invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same HEAD as 09-21/22/23 (`0f5363f`). Grep of `src/` for `ctx.drawImage`, `createImageBitmap`, and `imageSmoothingEnabled` returns no matches (drawImage mentioned only as a comment in `adminVisualStatus.ts` 5). `engine/visualAssets.ts` is absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect` via `draw` / `drawPatternInline`. WX is 19213 lines. Draft PRs #355, #418, and #461 are unmerged; `main` has no 09-21+ files. VAL-2026-09-01-001 copy change did not wire combat.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons/Rush rooms require no uploads. This ID is the 09-24 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-09-02-012 / VAL-2026-09-21-001 / VAL-2026-09-22-001 / VAL-2026-09-23-001, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper only  
DEPENDENCIES: VAL-2026-08-31-001  
REGRESSION_RISK: LOW if identity on empty input. HIGH if anyone wires raw `spriteUrl`.  
VALIDATION_REQUIRED: Tests: library `[]`, inactive id, corrupt id → builtin. Manual: new boss portal and a Boss Rush room with empty library match current pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Cache ImageBitmap across rAF canvas.width resets — ResizeObserver is not the only clearer  
CATEGORY: lifecycle  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 09-23-005 documented ResizeObserver `applySize` (`WorldExploration.tsx` 13956, comment 13972–13973). Re-read of the mapped render path: when `canvas.width !== Math.floor(w * dpr)` the **rAF body itself** assigns `canvas.width` / `canvas.height` (7256–7261) before `setTransform`. GPU recovery also zeros then restores width (7224–7228). All of these **clear the 2D context**. `createPattern` / `getImageData` taken from the world ctx die on ordinary frames, not only layout. Landing `getImageData` (`LandingPage.tsx` 75) is a temp canvas — do not copy that onto combat.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` bitmap cache; must not hook rAF resize  
RECOMMENDED_ACTION: Cache `ImageBitmap` keyed by `ASSET_ID`+`VERSION`. Survive rAF backing-store sync, ResizeObserver, and context restore without re-fetch/decode. Never store ctx-bound patterns. After fallback/replace: `bitmap.close()`. Do not re-decode inside rAF. This refines VAL-2026-09-23-005; do not treat ResizeObserver-only caching as sufficient.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-23-005  
DEPENDENCIES: VAL-2026-09-23-005; VAL-2026-09-22-009; VAL-2026-08-31-015  
REGRESSION_RISK: MEDIUM if every DPR hitch re-hits object storage, or if a closed bitmap is drawn the same frame.  
VALIDATION_REQUIRED: Decode once; resize and toggle DPR-sized backing 10 times (or force 7256 mismatch): no extra decode; empty library unchanged; deactivate still next-frame builtin.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Set imageSmoothingEnabled=false per custom draw AFTER the frame setTransform — a loop-start flag is wiped  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Every mapped frame runs `ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr)` (`WorldExploration.tsx` 7263–7264) **after** the possible `canvas.width=` reset. Canvas2D default smoothing is **on**. `src/` never sets `imageSmoothingEnabled`. CSS `image-rendering: pixelated` (WX 17890; `index.css` 652–655) is display-time only (VAL-2026-09-23-004). A hunter who sets `imageSmoothingEnabled = false` once at the top of `render` (before or even immediately after scale) still loses it on the **next** frame’s identity transform unless it is repeated.  
SYSTEMS_AFFECTED: custom branch in `drawCombatant` / player site; `visualPreview.ts`  
RECOMMENDED_ACTION: In the custom branch only, **after** the caller’s frame transform: `ctx.save(); ctx.imageSmoothingEnabled = false; drawImage(...); ctx.restore();`. Do not set the flag on the shared rAF ctx for fillRect pixels. Do not stretch. Integer dest sizes preferred. This refines VAL-2026-09-22-005 / VAL-2026-09-23-004.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-22-005  
DEPENDENCIES: VAL-2026-09-22-005; VAL-2026-09-23-004; VAL-2026-08-31-011  
REGRESSION_RISK: MEDIUM if a hunter sets smoothing once per session and ships blurry PNGs next to fillRect chess after the first transform reset.  
VALIDATION_REQUIRED: 24×24 PNG next to chess pawn: custom edges stay blocky at desktop 1×, HiDPI, after Continue zoom, and after a canvas.width sync inside rAF.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player custom stills cannot live on combatantsRef Enemy.visualAssetId — the player is not in that array  
CATEGORY: assignment-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: VAL-2026-09-23-002 correctly requires Enemy binds on `combatantsRef` (WX 1638–1640, draw at 8030). The player branch is a separate `kind === 'player'` path (8283–8326) using `getPersistedPiecePattern(pieceType, playerView)` (8289) and `drawPixelPattern` **without** a scale arg (8315–8326). `combatantsRef` is `useRef<Enemy[]>` (1640). There is no `id: "player"` Enemy. `addCombatant` / `updateCombatant` never see the player. Portrait uses the same pieceType helper (3719) on a 60×60 canvas.  
SYSTEMS_AFFECTED: player-world bind, `engine/visualAssets.ts` player resolver, WX player site 8315  
RECOMMENDED_ACTION: Resolve player stills by chess `pieceType` + optional `playerView` (VAL-2026-09-23-007). Missing direction → front → builtin. Do not insert the player into `combatantsRef` to reuse the Enemy field. Do not add `visualAssetId` to `CharacterStats`. Portrait/creation/selection stay generated pixels in v1 (VAL-2026-09-02-010).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-23-002 (enemies) + VAL-2026-09-01-007 (player site)  
DEPENDENCIES: VAL-2026-09-23-002; VAL-2026-09-23-007; VAL-2026-09-01-007; VAL-2026-09-02-010  
REGRESSION_RISK: HIGH if implementers skip player custom because “bind is on Enemy,” or if they push a fake player Enemy and break occupancy / turn order.  
VALIDATION_REQUIRED: Custom pawn still in world; `combatantsRef` length unchanged vs empty library; portrait still chess 60×60; empty library identity.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not store PNG bytes in Motoko Text — measured caps are MAX_URL 2048 and MAX_JSON_BLOB 32768  
CATEGORY: storage  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `adminGuard.mo` 9–10: `MAX_JSON_BLOB = 32_768`, `MAX_URL = 2_048`. `validateOptionalUrl` (143–148) length-checks then `unsafeUrl`, which **rejects `data:`** (89–95) along with `javascript:` / `vbscript:` / `file:`. `validateJsonBlob` (155–163) is JSON object/array text, not pixels. `validateProofFileUrl` allows `data:image/png` up to **524_288** (118–128) for **shop proofs** only (`proofDataMimeAllowed` 109–116). `EnemyConfig.spriteUrl` remains `?Text`. Caffeine `ExternalBlob` exists as bindgen plumbing (`backend.ts` 54–55) with **no** visual-asset type.  
SYSTEMS_AFFECTED: new library metadata actor fields + object storage; must not extend spriteUrl to hold base64  
RECOMMENDED_ACTION: Metadata (ids, weights, profile, checksum) on canister. Bytes in object storage / `ExternalBlob`. Starting client reject **256 KiB per still**. Do not reuse `proofFileUrl` validation as combat validation. Do not paste `data:` URLs into `spriteUrl` to “skip” storage. New maps need a later EOP file after `20260901` (VAL-2026-09-21-008).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-014  
DEPENDENCIES: VAL-2026-08-31-014; VAL-2026-09-21-008; VAL-2026-09-22-007  
REGRESSION_RISK: HIGH if a hunter base64-encodes a PNG into a Text stable and blows upgrade or `MAX_JSON_BLOB`. MEDIUM if shop proof MIME is copied and `javascript:`-adjacent payloads reach combat.  
VALIDATION_REQUIRED: 24×24 PNG upload does not write a `data:` spriteUrl. `adminSetEnemyConfig` with a 3 KB data URL still rejected by `unsafeUrl`. Empty library pixels unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom bitmaps must ignore Character.colors, chess palettes, and family color maps  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Builtin `fillRect` maps cell values through `Character.colors` (player WX 8319–8325), `chessPiecePalettes` / `creaturePalettes` (`pieceArt.ts` 1000–1022), or `getEnemyFamilyColors` (`enemyPixelPatterns.ts` 507+; `pieceArt.ts` 952–957). A PNG already has RGB(A). Feeding it through those maps, `globalCompositeOperation = 'multiply'`, or a palette swap to “match the piece” is **silent distortion** (forbidden). Creation persists `pixelPattern` JSON (`CharacterCreation.tsx` 273); world never uses it as a color key.  
SYSTEMS_AFFECTED: custom `drawImage` branch; must not change fillRect palette paths  
RECOMMENDED_ACTION: Bitmap path paints source pixels (plus owner-tint **rect** for summons, not cell-grid stroke). Leave palettes on the builtin branch only. Do not offer a “recolor to character colors” toggle in v1.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-21-006  
REGRESSION_RISK: MEDIUM if owners expect chess-dye on painted art; HIGH if palette multiply tints every PNG crimson.  
VALIDATION_REQUIRED: 24×24 PNG with its own colors next to a dyed chess pawn: PNG hues unchanged. Empty library: player still uses character colors on fillRect.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom draw must stay inside the moving-enemy save — do not drop globalAlpha pulse or add bitmap-sized shadows  
CATEGORY: invariant  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: When `enemy.isMoving`, WX `ctx.save()`, sets `shadowColor = #ff6b6b`, `shadowBlur = 8`, `globalAlpha = 0.8 + 0.2 * sin(Date.now() * 0.01)`, then `drawCombatant`, then `ctx.restore()` (8057–8076). Builtin fillRect inherits that. A custom branch that `restore()`s to disable smoothing (this file’s 003) must nest **inside** the move save, not pop it. Growing `shadowBlur` from `image.width` is the same forbidden class as growing occupancy from visual size. Frame shake (7265–7267) is separate (VAL-2026-09-23-009).  
SYSTEMS_AFFECTED: custom draw branch; moving-enemy block 8057–8076 — **leave pulse math**  
RECOMMENDED_ACTION: Nest smoothing save inside the existing move save. Do not skip pulse for custom units. Do not scale shadowBlur/alpha from bitmap dimensions.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-23-009; VAL-2026-09-24-003; VAL-2026-08-31-008  
REGRESSION_RISK: MEDIUM if nested restore pops the move save and moving custom units look static, or if PNG size drives a larger red glow.  
VALIDATION_REQUIRED: Empty library: moving pulse unchanged. Custom 24×24: same alpha pulse and 8px blur as chess neighbor.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: family string "boss" is not an EnemyFamily member — do not use it as BOSS_ONLY / family-pool eligibility  
CATEGORY: category-model  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Portal spawn writes `family: "boss"` (`WorldExploration.tsx` 6568). `Enemy.family` is `string` (`gameTypes.ts` 305). `EnemyFamily` (`gameTypes.ts` 12–20) is `wraith_bishop` … `default` only — **no `boss`**. `getEnemyFamilyPixelPattern` (`enemyPixelPatterns.ts` 500–504) indexes that record and falls back to **3×3 `default`**. Family pools that key off `entity.family` would either miss portal bosses or attach `default` 9×9 art. VAL-2026-09-22-002 already forbids `family===boss` as the 8×12 draw gate; this ID forbids it as **assignment eligibility**.  
SYSTEMS_AFFECTED: pool eligibility, `ENTITY_FAMILY` metadata, portal spawn bind  
RECOMMENDED_ACTION: Boss rows use spawn-kind (`portal_boss` / `boss_rush`) or explicit `ENTITY_IDS` (boss config id). `ENTITY_FAMILY` accepts only the `EnemyFamily` union. A row tagged family `boss` is `#invalid` until the owner picks a real family or a boss spawn-kind. Do not add `"boss"` to the union as part of VAL.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-22-002; VAL-2026-08-31-016; VAL-2026-08-31-013  
REGRESSION_RISK: HIGH if a family pool paints default 9×9 (or 8×12) on today’s 34×34 portal chess.  
VALIDATION_REQUIRED: `BOSS_ONLY` row does not apply to a unit only because `family === "boss"`. Empty library: portal paint unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not derive upload specs or dest sizes from context-restore window.innerWidth  
CATEGORY: render-contract  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `handleContextRestored` (`WorldExploration.tsx` 13825–13836) sets `w = window.innerWidth`, `h = window.innerHeight`, then `canvas.width = Math.round(w * dpr)` and CSS style to that window size. Steady-state layout uses container `ResizeObserver` + `canvasSize` state (13950–13968). `pointerToRenderSpace` / `gridToScreen` use `canvasSize`, not `innerWidth`. Using restore-path dimensions as `RECOMMENDED_WIDTH` or `drawImage` dest would invent viewport-sized sprites.  
SYSTEMS_AFFECTED: `RENDER_PROFILES`, custom dest rects, admin spec UI  
RECOMMENDED_ACTION: Profiles stay tile/cell/offset-derived (24 / 34). Dest rects use CSS `canvasSize` space (VAL-2026-09-23-003). After context restore, wait for `applySize` / next `canvasSize` commit; do not bake `innerWidth` into validation.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-23-003; VAL-2026-08-31-004; VAL-2026-09-23-011  
REGRESSION_RISK: MEDIUM if a hunter “fixes” post-restore blur by stretching PNGs to the window.  
VALIDATION_REQUIRED: Spec UI still shows 24×24 / 34×34. After a simulated context restore, custom 24×24 matches chess 24×24 once `canvasSize` settles.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Never use InitiativeStrip ENEMY_ICONS regex (or Enemy Register lore) as visual assignment  
CATEGORY: category-model  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `InitiativeStrip.tsx` 65–80 maps name keywords (`/goblin/i`, `/boss|lord|king/i`, `/ghost|spirit/i`, …) to emoji for the **strip**, not the canvas. `enemyRegisterCopy.ts` 6–15 labels the Register as flavor lore, not the live spawn roster (VAL-2026-09-21-005). AGENTS.md requires explicit metadata, never name-based heuristics, for targeting/effects — the same rule applies to art. Assigned names come from a shuffled admin pool (WX 5751–5758) and can collide with those regexes by chance.  
SYSTEMS_AFFECTED: assignment keys; InitiativeStrip (leave emoji map); Enemy Register (leave copy)  
RECOMMENDED_ACTION: Eligibility is `ENTITY_IDS` / `ENTITY_FAMILY` (union) / spawn-kind / bound `visualAssetId` only. Do not activate a ghost PNG because `assignedName` matches `/ghost/i`. Do not treat Register MONSTERS/BOSSES arrays as `ENTITY_IDS`.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-21-005; VAL-2026-08-31-012  
REGRESSION_RISK: MEDIUM if a hunter “smart-assigns” from the strip regex and a named pawn randomly receives boss art.  
VALIDATION_REQUIRED: Unit named “Ghost King” with empty library still paints chess (unless it is actually `assignedName === "Ghost"` for family grids). Register unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Iso preview must warn when custom art collides with the 28px wall prism  
CATEGORY: preview  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `drawIsometricTile` walls use `wallHeight = 28` (`WorldExploration.tsx` 4085, faces 4137–4160). Combatants occupy **one** logical tile (`occupancy.ts` 84–96) in front of or behind walls by depth sort; visual height is independent. Standard 24×24 art at draw point +9 sits mostly in the diamond. 64-tall boss opt-in art will overlap wall tops and name labels (`y − 34`, WX 8122). 09-23 preview listed iso panes, hit 80×41, and labels; it did not cite wallHeight 28.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` (new)  
RECOMMENDED_ACTION: Preview compositing includes a wall prism 28px above an adjacent tile. Warn “clips wall / name / badge / damage float / mobile zoom.” Do not raise `wallHeight` or occupancy from bitmap size.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009  
DEPENDENCIES: VAL-2026-08-31-009; VAL-2026-09-21-012; VAL-2026-08-31-008  
REGRESSION_RISK: LOW for a warning. HIGH if “clips wall” is fixed by punching occupancy or shortening walls.  
VALIDATION_REQUIRED: 24×24 pawn preview: no wall warning required. 64×72 boss opt-in: wall + label warnings; occupancy still one cell.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-24-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355 / #418 / #461 VAL docs  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge queue (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Draft PRs #355 (2026-09-21), #418 (2026-09-22), and #461 (2026-09-23) are **older** than this run and **not on main**. This run’s unique files are `VISUAL_ASSET_LIBRARY_DESIGN_2026-09-24.md` and `ACTION_IDS_VAL_2026-09-24.md`. Union ≠ concatenate. `VAL-2026-09-21-007` remains superseded by `VAL-2026-09-22-002` for visual gates.  
SYSTEMS_AFFECTED: `docs/automation/` only  
RECOMMENDED_ACTION: Keep unique dated filenames. If a sibling later touches the same path, union one copy per file — do not concatenate ACTION_ID blocks. Run `bash scripts/open-pr-stack-compat.sh --self`. Do not edit `README.md`.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: none (docs-only)  
REGRESSION_RISK: LOW. MEDIUM if a hunter force-pushes over #355/#418/#461 files and drops the boss live-vs-table correction.  
VALIDATION_REQUIRED: `open-pr-stack-compat.sh --self` clean vs `origin/main` and as the next queue item after older PRs.  
STATUS: NEW  
