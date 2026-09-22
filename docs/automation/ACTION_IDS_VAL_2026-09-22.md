# ACTION_IDs — 2026-09-22 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-22.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-22.md).  
HEAD inspected: `0f5363f` (same SHA as 2026-09-21). Gameplay / production code was not modified.

Prior IDs:

- `VAL-2026-08-31-001` … `019` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (merged design PR #121). **None implemented** except as noted below.
- `VAL-2026-09-01-001` … `011` in [`ACTION_IDS_VAL_2026-09-01.md`](./ACTION_IDS_VAL_2026-09-01.md). **001 IMPLEMENTED (copy only).** 002–011 still NEW.
- `VAL-2026-09-02-001` … `012` in [`ACTION_IDS_VAL_2026-09-02.md`](./ACTION_IDS_VAL_2026-09-02.md). **All still NEW.**
- `VAL-2026-09-21-001` … `014` in PR [#355](https://github.com/Mr-Melic/stralt/pull/355) (`ACTION_IDS_VAL_2026-09-21.md`, **not on main**). **All still NEW.** `VAL-2026-09-21-007` visual gates are **superseded** by `VAL-2026-09-22-002` (do not implement 007’s `isBoss` / `family === "boss"` assignment keys).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-22

| ID | Title (short) | Status 2026-09-22 |
| :--- | :--- | :--- |
| VAL-2026-08-31-001 | Empty-library fallback | NEW — `resolveRuntimeVisual` absent; no `drawImage` in `src/` |
| VAL-2026-08-31-002 | Owner-only canister metadata | NEW — still `#admin` catalog, no library type |
| VAL-2026-08-31-003 | Upload specs before file pick | NEW — admin still pastes URLs |
| VAL-2026-08-31-004 | Freeze render profiles from live renderer | NEW — cell size unchanged; boss **live vs table** split in 09-22 design |
| VAL-2026-08-31-005 | Bind at spawn, never in render | NEW — no `visualAssetId`, no encounter seed |
| VAL-2026-08-31-006 | Weighted pools, else builtin | NEW |
| VAL-2026-08-31-007 | Boss profile is not a stretched enemy | NEW — portal **live** is chess×1.4, not 8×12×1.4; do not stretch `enemy_standard` |
| VAL-2026-08-31-008 | Visual size ≠ gameplay footprint | NEW — occupancy one tile; tested hit `h` is **41**, not `drawSize.h` 60 |
| VAL-2026-08-31-009 | Iso-tile preview | NEW — admin is still 72×72 `object-fit:contain` |
| VAL-2026-08-31-010 | Admin CRUD / assign / revert / inspect | NEW |
| VAL-2026-08-31-011 | Optional drawImage in drawCombatant | NEW — player still a second call site (WX 8315) |
| VAL-2026-08-31-012 | Do not treat spriteUrl as the library | NEW — copy is honest; combat still unused |
| VAL-2026-08-31-013 | Family pixels are ghost/minion-only | NEW — grids still `enemyPixelPatterns.ts` 434–498; 30% roll is stats only |
| VAL-2026-08-31-014 | Bytes in object storage | NEW — sprite fields still `?Text`; bindgen `ExternalBlob` exists for other fields |
| VAL-2026-08-31-015 | Versioned replace + safe delete | NEW |
| VAL-2026-08-31-016 | Future categories ineligible | NEW |
| VAL-2026-08-31-017 | Extract to engine/, do not grow WX | NEW — WX **19213**; `spawnPolicy.ts` 297 |
| VAL-2026-08-31-018 | Four stills only; no walk cycles | NEW — Walk Animation Frames UI still present (AdminDashboard 1588–1590) |
| VAL-2026-08-31-019 | Elite metadata-only until a real flag | NEW — still no `isElite` |
| VAL-2026-09-01-001 | Stop admin copy claiming unused spriteUrl is live | **IMPLEMENTED** (`adminVisualStatus.ts`; EnemyEditor 817–838) |
| VAL-2026-09-01-002 … 011 | (see 09-01 ledger) | NEW |
| VAL-2026-09-02-001 … 012 | (see 09-02 ledger) | NEW |
| VAL-2026-09-21-001 … 006, 008 … 014 | (see PR #355) | NEW — docs not on main |
| VAL-2026-09-21-007 | Key boss/minion off flags and id prefix | **SUPERSEDED for visual assignment** by VAL-2026-09-22-002. `isBoss` / `family === "boss"` must not select `boss_large`. |

---

ACTION_ID: VAL-2026-09-22-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity on 0f5363f — still no drawImage anywhere in src/  
CATEGORY: invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Same HEAD as 09-21 (`0f5363f`). Grep of `src/` for `ctx.drawImage`, `createImageBitmap`, and `imageSmoothingEnabled` returns no matches (drawImage mentioned only as a comment in `adminVisualStatus.ts` 5). `engine/visualAssets.ts` is absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect` via `draw` / `drawPatternInline`. WX is 19213 lines. PR #355 (09-21 docs) is still draft and unmerged; `main` has no 09-21 files. VAL-2026-09-01-001 copy change did not wire combat.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons/Rush rooms require no uploads. This ID is the 09-22 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-09-02-012 / VAL-2026-09-21-001, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper only  
DEPENDENCIES: VAL-2026-08-31-001  
REGRESSION_RISK: LOW if identity on empty input. HIGH if anyone wires raw `spriteUrl`.  
VALIDATION_REQUIRED: Tests: library `[]`, inactive id, corrupt id → builtin. Manual: new boss portal and a Boss Rush room with empty library match current pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not key boss_large off Enemy.isBoss or family===boss — live 8×12 path is isBoss&&bossId on the draw object  
CATEGORY: assignment-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `drawCombatant` branch 1 is `entity.isBoss && entity.bossId` (`pieceArt.ts` 856). Portal spawn (WX 6522–6569) sets `id: boss_${id}_${Date.now()}`, `scaleX/Y: 1.4`, `family: "boss"`, chess `pieceType`, and **omits** `isBoss`/`bossId`. Those flags are written on **turn-order** `CombatantEntry` at battle start when `id.startsWith("boss_")` (WX 11958–11983). AI reads turn-order (15358–15368). Rendering reads the Enemy → **chess 8×8 × 1.4**. Boss Rush (5326–5371) sets `isBoss: true`, **no** `bossId`, `id: boss-rush-*` (hyphen; `startsWith("boss_")` is false), `pieceType: "Pale Archbishop"` (`useBossRush.ts` 29) → unknown pieceType → `king.front` 24×24 (`pieceArt.ts` 1006–1018). `family === "boss"` is on **both** shapes. VAL-2026-09-21-007’s three gates are therefore inverted/too broad for visuals.  
SYSTEMS_AFFECTED: `BOSS_ONLY` eligibility, `boss_large` preview panes, spawn bind  
RECOMMENDED_ACTION: `BOSS_ONLY` / `boss_large` eligible iff `id.startsWith("boss_")` and **not** `id.startsWith("boss-rush")`. Do not use Enemy.`isBoss` or `family === "boss"` as the visual gate. Rush units stay `enemy_standard` (live 24×24). Preview must show **two** boss boxes: live portal **34×34** (8×8×1.4) and table **34×50** (8×12×1.4), labeled so the owner knows 50-tall art is **not** current portal paint. Never name-match Rush `boss1Name`.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-007; VAL-2026-09-21-007 (supersedes visual keys only)  
REGRESSION_RISK: HIGH if `isBoss: true` pulls 50-tall art onto Rush king.front units, or if `family === "boss"` paints portal art on Rush.  
VALIDATION_REQUIRED: Empty library: portal unit still 8×8×1.4 chess; Rush unit still king.front 24×24. Eligibility tests: `{isBoss:true, id:"boss-rush-0-0"}` ineligible; `{id:"boss_1_1", scaleX:1.4}` eligible; `{family:"boss"}` alone ineligible.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not set isBoss/bossId on portal Enemies (or retarget drawCombatant to id.startsWith boss_) as part of the library  
CATEGORY: scope  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 8×12 tables + `getBossPixelPattern` injection (WX 8069) exist but the live Enemy never satisfies branch 1. Setting `isBoss`+`bossId` on portal spawn, or changing branch 1 to `id.startsWith("boss_")`, would switch live portal paint from **33.6×33.6 chess** to **33.6×50.4 tables** — a production pixel change, not an optional overlay. AGENTS.md: do not touch unrelated render behavior. Custom visuals are optional; empty library must equal today.  
SYSTEMS_AFFECTED: WX portal spawn, `pieceArt.ts` branch 1 — **leave unchanged**  
RECOMMENDED_ACTION: Library overlay only. Optional custom `drawImage` when `visualAssetId` is bound. Builtin path identity. A separate (non-VAL) pixel bugfix may later activate 8×12; until then `boss_large` default scale is 1 on a 34×34 bitmap matching **live** portal size, with 34×50 as an explicit owner opt-in that preview warns is taller than current paint.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-09-22-001; VAL-2026-09-22-002; VAL-2026-08-31-011  
REGRESSION_RISK: HIGH if a hunter “fixes” flags so every portal boss suddenly uses 8×12 grids.  
VALIDATION_REQUIRED: After any library PR with empty library: portal boss pixel footprint unchanged vs `0f5363f` (screenshot or pattern-cell count).  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Hit-testing uses x,y,w,h (desktop 80×41), not stored drawSize (80×60) — never grow either from a bitmap  
CATEGORY: invariant  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Rect write (WX 8086–8104): `_srW = effectiveTileW`, `_srH = effectiveTileH * 1.5`, `w = _srW`, `h = effectiveTileH / 2 + CHARACTER_Y_OFFSET + _srH / 2` → desktop **80 × 41**. `drawSize` is `{ w: effectiveTileW, h: effectiveTileH * 1.5 }` → **80 × 60**. `hitTestSprite` (8901–8906) tests `entry.x/y/w/h` with padding 10 (10127) / 14 (10819). Occupancy (`occupancy.ts`) is one tile.  
SYSTEMS_AFFECTED: `visualPreview.ts` clip math, click-hit comments, VAL-008 / VAL-2026-09-01-003  
RECOMMENDED_ACTION: Preview overlays the **tested** 80×41 (desktop) / 140×78.5 (mobile-zoom) box, not drawSize 80×60. Custom art must not change occupancy, `drawSize`, tested `h`, or padding. Click-miss is not a reason to grow the box from `image.height`.  
AUTONOMY: GUARDRAIL + preview  
DEPENDENCIES: VAL-2026-08-31-008; VAL-2026-09-01-003  
REGRESSION_RISK: MEDIUM if implementers “fix” click-miss by using bitmap AABB as occupancy or as `h`.  
VALIDATION_REQUIRED: 64×72 custom boss PNG: occupancy one cell; tested rect still 80×41 desktop; drawSize still 80×60.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom drawImage must locally disable image smoothing — the world canvas never sets imageSmoothingEnabled  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `imageSmoothingEnabled` is empty. Builtin art is `fillRect` 3px cells (WX 3874–3878) — immune to bilinear scaling. Canvas 2D default smoothing is **on**. A 24×24 PNG `drawImage` into logical CSS space (and especially any non-integer dest) will blur next to chess neighbors. Admin `<img>` already uses `imageRendering: pixelated` (AdminDashboard 1506) — that CSS does **not** apply to the world ctx.  
SYSTEMS_AFFECTED: custom branch in `drawCombatant` / player site; `visualPreview.ts`  
RECOMMENDED_ACTION: In the custom branch only: `ctx.save(); ctx.imageSmoothingEnabled = false; drawImage(...); ctx.restore();`. Do not set the flag on the shared rAF ctx (would not affect fillRect but is still RAF-adjacent). Do not stretch. Integer dest sizes preferred.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-02-003; VAL-2026-09-21-010  
REGRESSION_RISK: MEDIUM if a global smoothing toggle is flipped in the rAF resize path.  
VALIDATION_REQUIRED: 24×24 PNG next to chess pawn: custom edges stay blocky (not blurry) at desktop 1× and after Continue zoom.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Custom draw must not inherit drawPixelPattern’s unpaired ctx.restore — do not fix that pairing in the rAF loop  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `drawPixelPattern` (WX 3841–3886) never `save`s and always `restore`s (3883). `drawPatternInline` (`pieceArt.ts` 753–782) does **not** restore. Moving enemies `save` (8058–8061), call `drawCombatant` with `drawPattern: drawPixelPattern`, then `restore` (8076). Today the inner restore pops the moving-glow save; the outer restore pops a different state. A custom top branch that returns without calling `drawPattern` leaves the glow save for the outer restore — **correct for glow, different from builtin**. AGENTS.md forbids RAF/turn/damage edits for this designer.  
SYSTEMS_AFFECTED: custom `drawCombatant` branch; moving-enemy glow  
RECOMMENDED_ACTION: Custom branch uses its **own** save/restore around `drawImage` (also covers smoothing). Do not add/remove WX 3883 as part of VAL. Do not route bitmaps through `drawPattern` to “reuse” the restore. Builtin identity when the option is omitted. Mixed custom/builtin packs may show moving-glow only on custom — acceptable; do not “fix” builtin glow here.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-02-003  
REGRESSION_RISK: HIGH if custom skips restore and also skips the moving-enemy outer restore assumption, leaking transform/alpha into the next depth-sorted unit.  
VALIDATION_REQUIRED: Empty library: moving-enemy canvas state unchanged. Custom idle unit: no leftover shadowBlur on the following combatant. Custom moving unit: no transform leak.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Decode from Blob / ExternalBlob — never drawImage a hosted https spriteUrl  
CATEGORY: upload-validation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Sprite fields are `?Text` URLs (`admin.mo` 25, 43–50). `validateOptionalUrl` is length + `unsafeUrl` (`adminGuard.mo` 143–148; `file:` rejected at 89–95). Bindgen already imports `ExternalBlob` (`backend.ts` 54–55) for other Candid files; sprites are not blobs. Shop `data:` proofs cap 524_288 (118–131) — different surface. Landing ads `<img>` (and a **temp** canvas `getImageData` for the title effect, `LandingPage.tsx` 75) are not the world ctx. Cross-origin `drawImage` without CORS taints the **world** canvas and can break future debug snapshots.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` decode; future Motoko blob ref; must not reuse `adminSetEnemyConfig` URL success  
RECOMMENDED_ACTION: File picker → `Blob` → `createImageBitmap` → `#ok` or `#invalid`. Persist bytes in object storage; canister holds id/hash/eligibility. Import of existing https `spriteUrl` rows stays **inactive**. Do not `drawImage(url)`. Do not store stills as shop `data:` proofs.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-003 / VAL-2026-08-31-014  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-014; VAL-2026-09-01-005; VAL-2026-09-21-009  
REGRESSION_RISK: HIGH if implementers paint `spriteUrl` and the world canvas taints, or if proof `data:` is reused for sprites.  
VALIDATION_REQUIRED: A 2048-char https URL to a 4096² JPEG is `#invalid` even if `adminSetEnemyConfig` accepts the string. `file:` / `javascript:` never `#ok`. Empty library: no network image fetch on combat draw.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Boss Rush pieceType is a lore name — never use it as an ENTITY_ID or pieceType assignment key  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spawnBossRushRoom` writes `pieceType: roomDef.boss1Name || "Boss 1"` (WX 5327) where `boss1Name` is `"Pale Archbishop"` (`useBossRush.ts` 27–29), not `ChessPieceType`. Live draw falls through to `king.front`. `boss1Id` (`pale_archbishop`) is unused on the Enemy object. Enemy Register titles are also lore (`enemyRegisterCopy.ts` 1–12). Name-heuristic assignment would bind art to strings that are not spawn catalog keys.  
SYSTEMS_AFFECTED: assignment keys, import UI, `VARIANT_TAGS`  
RECOMMENDED_ACTION: Rush assignment, if any in v1, keys `id` prefix `boss-rush-` or an explicit pool — and uses `enemy_standard` (24×24), not `boss_large`. Never match `assignedName`, Register titles, or `boss1Name`. Portal catalog ids (`boss_1` … `boss_12` / config ids) stay explicit `ENTITY_IDS`.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-22-002; VAL-2026-09-21-005; VAL-2026-08-31-016  
REGRESSION_RISK: MEDIUM if a hunter binds “Pale Archbishop” PNG to every Rush room 0 unit while overworld still draws chess.  
VALIDATION_REQUIRED: Empty library + Rush room 0: king.front. Activating a `boss_large` asset assigned to `pale_archbishop` or `"Pale Archbishop"` does not change Rush pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Close ImageBitmaps and revoke object URLs on replace, deactivate, and fallback  
CATEGORY: lifecycle  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: No decode path exists today. Once `createImageBitmap` / blob URLs ship, replace (`VERSION++`, same `ASSET_ID`) and deactivate (resolver falls back **next frame**, no re-roll) must not leak GPU bitmaps. Admin 72×72 `<img src={previewUrl}>` (1484–1510) would also leak blob URLs if preview switches to object URLs.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` cache, admin preview  
RECOMMENDED_ACTION: Cache keyed by `ASSET_ID`+`VERSION`. On replace/deactivate/invalid: `bitmap.close()`, `URL.revokeObjectURL`, drop cache entry. Fallback to builtin the same frame. Do not wait for GC.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-015  
DEPENDENCIES: VAL-2026-08-31-015; VAL-2026-09-22-007  
REGRESSION_RISK: LOW if closed only after the new bitmap is ready. MEDIUM if close races a rAF that still holds the handle.  
VALIDATION_REQUIRED: Replace 20 times in admin preview: no unbounded blob: URLs. Deactivate: next world frame is builtin, no throw.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Keep sprite hit padding at 10/14 px — do not scale padding from custom art  
CATEGORY: invariant  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Comments at WX 8878–8880; calls at 10127 (10) and 10819 (14). Independent of pattern 24×24 / portal 33.6 / table 50. Same class of bug as growing occupancy from `image.height`.  
SYSTEMS_AFFECTED: `hitTestSprite` call sites — **leave literals**  
RECOMMENDED_ACTION: Leave padding tile-independent constants. Preview may warn that tall art is harder to click near the head if it extends past tested `h` 41. Do not pass `bitmap.height` into padding.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-09-22-004; VAL-2026-08-31-008  
REGRESSION_RISK: MEDIUM if “tall PNG is hard to click” is fixed by padding *= height.  
VALIDATION_REQUIRED: 24×24 and 48×48 custom: padding still 10 on mouse click.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 09-22 measured RENDER_PROFILES — cell size unchanged; boss live vs table split  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-measured 2026-09-22 on `0f5363f`: tile 80×40 (`gameConstants.ts` 6–7); offset −9 (17); cell 3px (WX 3855); standard 8×8 → 24×24 (`pieceArt.ts` 85–93); portal live 8×8×1.4 (spawn 6535–6536, branch 1 not entered); tables 8×12 (`enemyPixelPatterns.ts` 10–24) unused on live Enemy; Rush king.front 24×24; hit tested 80×41 vs drawSize 80×60 (8086–8104); Continue + zoom 1.75 tiles only (`App.tsx` 396–414; WX 957–959). Creation 80×80 on 320×280 and selection 192×192 are **not** combat boxes.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. `boss_large.recommended` defaults to **34×34** (live portal). Store `boss_large.tableBox = 34×50` as an explicit alternate, never the silent default. Custom `DEFAULT_SCALE = 1`. Do not invent 64×64 / 128×128. Do not apply `MOBILE_ZOOM` or `dpr` to bitmaps.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-004; VAL-2026-09-02-008; VAL-2026-09-21-004; VAL-2026-09-22-002  
REGRESSION_RISK: LOW if tests pin both boss boxes. HIGH if 50-tall becomes the only recommended size.  
VALIDATION_REQUIRED: Unit test: standard 8×3 = 24; live boss 8×3×1.4 ceil 34; table 12×3×1.4 ceil 50.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-22-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Summon bind must not backfill scaleX/Y — spawn omits them and draw defaults to 1  
CATEGORY: render-contract  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `spawnSummonUnit` (`summonSpawn.ts` 163–188) writes no `scaleX`/`scaleY`. `drawCombatant` uses `entity.scaleX ?? 1` (`pieceArt.ts` 847–848). `spawnEnemySummonUnit` (254–284) reuses that helper. Pack enemies **do** store random squash (`spawnPolicy.ts` 227–255; WX 5820–5821). Copying pack squash onto summons when binding a visual would arbitrarily stretch summon PNGs (forbidden class of VAL-007 / VAL-2026-09-02-009).  
SYSTEMS_AFFECTED: summon spawn bind, custom summon draw  
RECOMMENDED_ACTION: Summon `DEFAULT_SCALE = 1`. Do not write `generateEnemyScaleFactors` onto summons when attaching `visualAssetId`. Builtin summon pixels stay unscaled.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-02-009  
DEPENDENCIES: VAL-2026-09-02-009; VAL-2026-09-21-006  
REGRESSION_RISK: MEDIUM if a hunter copies the Enemy type’s required `scaleX` by calling `generateEnemyScaleFactors` at summon bind.  
VALIDATION_REQUIRED: Custom 24×24 wolf summon stays 24×24 beside a squash-scaled pawn.  
STATUS: NEW  
