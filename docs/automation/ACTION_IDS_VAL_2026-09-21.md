# ACTION_IDs — 2026-09-21 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-21.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-21.md).  
HEAD inspected: `0f5363f`. Gameplay / production code was not modified.

Prior IDs:

- `VAL-2026-08-31-001` … `019` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (merged design PR #121). **None implemented** except as noted below.
- `VAL-2026-09-01-001` … `011` in [`ACTION_IDS_VAL_2026-09-01.md`](./ACTION_IDS_VAL_2026-09-01.md). **001 IMPLEMENTED (copy only).** 002–011 still NEW.
- `VAL-2026-09-02-001` … `012` in [`ACTION_IDS_VAL_2026-09-02.md`](./ACTION_IDS_VAL_2026-09-02.md). **All still NEW.**

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-21

| ID | Title (short) | Status 2026-09-21 |
| :--- | :--- | :--- |
| VAL-2026-08-31-001 | Empty-library fallback | NEW — `resolveRuntimeVisual` absent; no `drawImage` in `src/` |
| VAL-2026-08-31-002 | Owner-only canister metadata | NEW — still `#admin` catalog, no library type |
| VAL-2026-08-31-003 | Upload specs before file pick | NEW — admin still pastes URLs |
| VAL-2026-08-31-004 | Freeze render profiles from live renderer | NEW — pixel boxes unchanged; citations in 09-21 design |
| VAL-2026-08-31-005 | Bind at spawn, never in render | NEW — no `visualAssetId`, no encounter seed |
| VAL-2026-08-31-006 | Weighted pools, else builtin | NEW |
| VAL-2026-08-31-007 | Boss profile is not a stretched enemy | NEW — 8×12 × 1.4 at `enemyPixelPatterns.ts` 10–24 / WX 6535–6536 |
| VAL-2026-08-31-008 | Visual size ≠ gameplay footprint | NEW — occupancy still one tile; `drawSize` still tile-derived |
| VAL-2026-08-31-009 | Iso-tile preview | NEW — admin is still 72×72 `object-fit:contain` |
| VAL-2026-08-31-010 | Admin CRUD / assign / revert / inspect | NEW |
| VAL-2026-08-31-011 | Optional drawImage in drawCombatant | NEW — player still a second call site (WX 8315) |
| VAL-2026-08-31-012 | Do not treat spriteUrl as the library | NEW — copy is honest; combat still unused |
| VAL-2026-08-31-013 | Family pixels are ghost/minion-only | NEW — grids still `enemyPixelPatterns.ts` 434–498; 30% roll is `applyFamilyVariantsToRoster` **stats only** |
| VAL-2026-08-31-014 | Bytes in object storage | NEW — sprite fields still `?Text` |
| VAL-2026-08-31-015 | Versioned replace + safe delete | NEW |
| VAL-2026-08-31-016 | Future categories ineligible | NEW — plus Enemy Register lore, barrier towers, ads |
| VAL-2026-08-31-017 | Extract to engine/, do not grow WX | NEW — WX **19213**; scale/family helpers already in `spawnPolicy.ts` |
| VAL-2026-08-31-018 | Four stills only; no walk cycles | NEW — Walk Animation Frames UI still present |
| VAL-2026-08-31-019 | Elite metadata-only until a real flag | NEW — still no `isElite` |
| VAL-2026-09-01-001 | Stop admin copy claiming unused spriteUrl is live | **IMPLEMENTED** (`adminVisualStatus.ts`; EnemyEditor 817–838) |
| VAL-2026-09-01-002 | Do not attach world-pack assignment only to spriteUrl | NEW — WX still never calls `getEnemyConfigs` |
| VAL-2026-09-01-003 | Keep spriteRects drawSize tile-derived | NEW — WX 8086–8103 / 8335–8352 |
| VAL-2026-09-01-004 | Preview clip math uses summon badge (x+18, y−48) | NEW — WX 8146–8147; also damage floats y−44/−58 |
| VAL-2026-09-01-005 | adminGuard URL checks are not image validation | NEW — `unsafeUrl` now also rejects `file:` (89–95); still not decode/size |
| VAL-2026-09-01-006 | Reaffirm empty-library identity | NEW — still zero `drawImage` |
| VAL-2026-09-01-007 | Player is not drawCombatant | NEW — WX 8315–8326 |
| VAL-2026-09-01-008 | Keep ELITE_ONLY ineligible | NEW — `elite_patrol` still catalog-only |
| VAL-2026-09-01-009 | Do not bind custom death/juice sprites in v1 | NEW — `effects.ts` 282–292 |
| VAL-2026-09-01-010 | Preserve empty-spriteUrl-is-not-custom test | NEW — `adminVisualStatus.test.ts` + `adminContract.test.ts` |
| VAL-2026-09-01-011 | Freeze 09-01 RENDER_PROFILES | NEW — boxes unchanged; 09-21 refreshes citations |
| VAL-2026-09-02-001 | Phones are a live combat path | NEW — Continue still live; `MOBILE_ZOOM` 1.75 |
| VAL-2026-09-02-002 | Resolver in engine/ next to pixel tables | NEW — `visualAssets.ts` still absent; `spawnPolicy.ts` is the new neighbor |
| VAL-2026-09-02-003 | Custom hook on DrawCombatantOptions, not inside drawPixelPattern | NEW — options 714–744 still pattern-only |
| VAL-2026-09-02-004 | Bind from instance id + pool config | NEW |
| VAL-2026-09-02-005 | Walk Animation Frames UI honesty | NEW — heading still at AdminDashboard 1588–1590 |
| VAL-2026-09-02-006 | Do not “fix” landing ad Custom Visual copy | NEW — ads still `<img>` at LandingPage 750; copy at AdminDashboard 8221 |
| VAL-2026-09-02-007 | Keep drop-shadow tile-foot sized | NEW — WX 8033–8054 |
| VAL-2026-09-02-008 | Freeze 09-02 RENDER_PROFILES | NEW — boxes unchanged |
| VAL-2026-09-02-009 | Custom art must not inherit squash | NEW — squash now `spawnPolicy.ts` 227–255 |
| VAL-2026-09-02-010 | Portrait/creation/selection stay pixels in v1 | NEW |
| VAL-2026-09-02-011 | Admin piece type "custom" is not a combat category | NEW — PIECE_TYPES still includes `"custom"` (AdminDashboard 1250–1258) |
| VAL-2026-09-02-012 | Reaffirm empty-library identity on 58302bc | NEW — evidence now HEAD `0f5363f` (this file’s 001) |

---

ACTION_ID: VAL-2026-09-21-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity on 0f5363f — still no drawImage anywhere in src/  
CATEGORY: invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `ctx.drawImage` and `createImageBitmap` returns no matches (comment only in `adminVisualStatus.ts` 5). `engine/visualAssets.ts` is absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect` via `draw` / `drawPatternInline`. New bosses still `BOSS_PIXEL_PATTERNS[bossId] ?? boss_12` (`enemyPixelPatterns.ts` 430–432). New summons still `creaturePatterns`. VAL-2026-09-01-001 copy change did not wire combat. Nineteen days of combat/occupancy/EOP PRs did not add a library.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons require no uploads. This ID is the 09-21 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-09-02-012, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper only  
DEPENDENCIES: VAL-2026-08-31-001  
REGRESSION_RISK: LOW if identity on empty input. HIGH if anyone wires raw `spriteUrl`.  
VALIDATION_REQUIRED: Tests: library `[]`, inactive id, corrupt id → builtin. Manual: new boss portal with empty library matches current pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Put the resolver in engine/ next to spawnPolicy and enemyPixelPatterns — do not re-inline into WorldExploration  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Scale squash and family 30% stats were hoisted to `src/frontend/src/engine/spawnPolicy.ts` (`generateEnemyScaleFactors` 227–255, `applyFamilyVariantsToRoster` 289–297). Boss/family grids remain in `enemyPixelPatterns.ts`. WX is **19213** lines (was 19253 on 09-02). `engine/visualAssets.ts` is still absent. `drawCombatant` already injects pattern tables via `DrawCombatantOptions` (WX 8063–8074).  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `pieceArt.ts` `DrawCombatantOptions`, WX wiring only  
RECOMMENDED_ACTION: Follow the spawnPolicy / pixel-table extraction. New module + tests. WX passes `visualAssetId` / resolved bitmap through options. Do not paste boss grids or the validator into WX. Do not grow the rAF body.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper first; no RAF / mapGen / combat math.  
DEPENDENCIES: VAL-2026-08-31-017; VAL-2026-09-02-002; VAL-2026-08-31-001; VAL-2026-08-31-011  
REGRESSION_RISK: HIGH if a hunter inlines `drawImage` in the 19k-line rAF path.  
VALIDATION_REQUIRED: `pnpm typecheck` + `pnpm check`. Empty library: pixels identical. WX line count must not absorb the validator/preview.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not publish family pixel-grid sizes as the STANDARD ENEMY upload spec  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `applyFamilyVariantsToRoster` (`spawnPolicy.ts` 289–297, WX 5864–5866) writes `family` + HP/damage/res/sp only. `drawCombatant` branch 4 still uses 8×8 chess for those units (`pieceArt.ts` 989–1022). Family grids (`enemyPixelPatterns.ts` 434–498) are 3×8 / 6×5 / 7×4 / 6×6 / 3×3 and run **only** for Ghost / `isBossMinion` (branch 3, 932). Using iron_golem 18×15 as “recommended enemy art” would invent a box the live pack does not draw.  
SYSTEMS_AFFECTED: admin spec UI, `RENDER_PROFILES.enemy_standard`, family assignment  
RECOMMENDED_ACTION: STANDARD ENEMY recommended box stays **24×24** (8×3). Family assignment keys the **string** `family` for pools, but the upload spec does not change with the 30% roll. Ghost/minion family art is a separate presentation until a custom bind exists.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-013; VAL-2026-08-31-004; VAL-2026-09-01-002  
REGRESSION_RISK: MEDIUM if implementers stretch custom art to match 6×5 iron_golem grids and believe occupancy grew.  
VALIDATION_REQUIRED: Spec UI for `pieceType=pawn` + `family=iron_golem` still shows 24×24 recommended. Occupancy one cell.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 09-21 measured RENDER_PROFILES — pixel boxes unchanged; citations moved  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-measured 2026-09-21: tile 80×40 (`gameConstants.ts` 6–7); offset −9 (line 17); cell 3px (WX 3855); standard 8×8 → 24×24 (`pieceArt.ts` 85–93); boss 8×12 (`enemyPixelPatterns.ts` 10–24) × 1.4 (WX 6535–6536) → 33.6×50.4; hit `drawSize` 80×60 (8103); Continue-on-phone + zoom 1.75 tiles only (App.tsx 396–414; WX 957–959). Creation 80×80 on 320×280 (`CharacterCreation.tsx` 151, 452–455) and selection 192×192 (`CharacterSelection.tsx` 313/333) are **not** combat boxes. Admin 72×72 `<img>` (1484–1507) is not a combat box.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. Custom default scale = 1. Do not invent 64×64 / 128×128. Do not apply `MOBILE_ZOOM` or `dpr` to bitmaps by default.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-004; VAL-2026-09-01-011; VAL-2026-09-02-008 (citation refresh, not a second box)  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Unit test: recommended boxes equal 8×3, 12×3×1.4 (ceil 34×50).  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not treat Enemy Register as a visual catalog or assignment target  
CATEGORY: scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `src/frontend/src/utils/enemyRegisterCopy.ts` 1–15: “Flavor only — not the live spawn roster.” UI subtitle `FLAVOR LORE` (`9e28cf9`). `EnemyRegister.tsx` `MONSTERS` / `BOSSES` arrays are display copy. World packs come from `generateEnemies` chess + 30% family stats, not this panel.  
SYSTEMS_AFFECTED: assignment keys, admin library UI  
RECOMMENDED_ACTION: v1 assignment targets are instance fields (`pieceType`, `family`, `boss_`, `isSummon`, future elite). Never match `VARIANT_TAGS` or `ENTITY_IDS` to Enemy Register titles. Do not add an upload slot on the Register.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-08-31-016; VAL-2026-09-01-002  
REGRESSION_RISK: LOW if scoped. MEDIUM if a hunter binds art by lore name (“Wraith Bishop”) while live family key is `wraith_bishop` only on 30% of pawns.  
VALIDATION_REQUIRED: Empty library + Register open: world pixels unchanged. No Register upload control.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Summon owner-tint must not wrap PNG bytes as a cell grid  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `strokeOwnerTint` (`pieceArt.ts` 791–811) computes AABB from `pattern[0].length * 3 * scale`. Summon branch calls it after `draw` (923–926). `DrawCombatantOptions.drawPattern` is fillRect-only. Passing an ImageBitmap into `drawPattern` / `strokeOwnerTint` would treat encoded bytes as cells (same class of bug as VAL-2026-09-02-003). Summon spawn writes **no** `scaleX/Y` (`summonSpawn.ts` 163–188) so tint scale is `{1,1}` today.  
SYSTEMS_AFFECTED: `pieceArt.ts` summon branch, custom draw hook  
RECOMMENDED_ACTION: Custom summon path: `drawImage` then either stroke the **bitmap AABB** (profile box, default 24×24) with `OWNER_TINT[side]` or skip the outline in v1. Do not call `strokeOwnerTint(pattern)` on a bitmap. Builtin path unchanged.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011  
DEPENDENCIES: VAL-2026-09-02-003; VAL-2026-08-31-011  
REGRESSION_RISK: HIGH if `drawPattern` is overloaded to accept ImageBitmap.  
VALIDATION_REQUIRED: Builtin wolf summon still has green/red outline. Custom 24×24: outline matches the image box or is omitted; empty library identical.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Key boss / minion assignment off flags and id prefix — not assignedName  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Bosses set `family: "boss"` (WX 5343, 5368, 6568), `id` `boss_${id}_${Date.now()}` (6524), battle `isBoss` via `id.startsWith("boss_")` (11958–11959), scale 1.4 (6535–6536). `useBossSystem.ts` sets `isBossMinion: true` (148, 539, 838, 1209, 1449). WX phase-spawn minion map (16105–16163) sets `assignedName` `"Minion"` or `"Ghost"`, `family: ""`, `scaleX/Y: 1`, and **omits `isBossMinion`**. `drawCombatant` branch 3 is `assignedName === "Ghost" || isBossMinion` (932). `"Minion"` without the flag draws chess default. Name-heuristic assignment would flicker across these two spawn paths.  
SYSTEMS_AFFECTED: spawn bind, `BOSS_ONLY`, minion eligibility  
RECOMMENDED_ACTION: Boss pool: `isBoss` / `id.startsWith("boss_")` / `family === "boss"`. Minion/ghost custom: require `isBossMinion === true` or an explicit assignment; do not key off `"Minion"` / `"Ghost"` strings. `family === "boss"` must never enter `enemy_standard` pools.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-08-31-007; VAL-2026-09-01-002  
REGRESSION_RISK: HIGH if `"Minion"` name matching paints family art only on one spawn path.  
VALIDATION_REQUIRED: Empty library: both minion paths keep today’s pixels. `BOSS_ONLY` asset never selected for a default-family pawn.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Canister visual-library maps need a new later EOP file after 20260901 — never amend frozen NewActor  
CATEGORY: persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live chain (`mops.toml` / `src/backend/migrations/`): `20260801_000000` genesis `OldActor = {}`, `20260803_185500` name-only, `20260827_000000` drop transients, **frozen `20260831_000000`** (deployed Caffeine shape, 42 stables, **no GameKey**), **frozen `20260901_000000`** GameKey maps. AGENTS.md / `.cursor/rules/eop-stable-migrations.mdc`: new persistent `let`/`var` = new lexically later file, `OldActor = {}`. Editing `20260831` / `20260901` `NewActor` or adding GameKey-shaped fields at the deployed tail is the class of bug that produced M0263 / IC0503. `CharacterStats` stays 12 fields — do not hang `visualAssetId` there.  
SYSTEMS_AFFECTED: `src/backend/migrations/YYYYMMDD_*.mo` (new), `mops.toml` `check-limit`, `.old` must stay Caffeine-owned  
RECOMMENDED_ACTION: When (not before) metadata maps ship: add `20260921_*` or later with empty `OldActor` producing the new maps. Bump `check-limit`. `python3 scripts/check-eop-stables.py` + `bash scripts/caffeine-import-gate.sh backend`. Bytes stay object storage; canister holds ids/hashes/eligibility. Frontend-only v1 (in-memory + admin local cache) is allowed if the first PR is the resolver helper — then this ID waits.  
AUTONOMY: HUMAN_REVIEW — Motoko stables.  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014  
REGRESSION_RISK: HIGH if a hunter edits frozen chain files so Caffeine `mops check` vs its `.old` fails M0263.  
VALIDATION_REQUIRED: `check-eop-stables.py` pass vs `.old` and `snapshots/deployed/*.most`; `unsupported/` still fail. Empty canister `empty-canister.most` still compatible via genesis.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: file: rejection and https-only ads are not image validation  
CATEGORY: upload-validation  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `unsafeUrl` (`adminGuard.mo` 89–95) now also rejects `file:` (security PR since 09-02). `validateOptionalUrl` (143–148) is still length + scheme. Ads use `requireHttpsUrl` (97–104). Shop proofs use `data:` mime allow-list + 524_288 cap (118–131) — **not** combat art. Frontend mirror `adminSafety.ts` 424–428. No decode / dimensions / alpha.  
SYSTEMS_AFFECTED: future `engine/visualAssets.ts` validator; must not be replaced by `validateOptionalUrl` or `proofDataMimeAllowed`  
RECOMMENDED_ACTION: Implement design §4.3 gates client-side before activate. Keep `data:` / `file:` / `javascript:` / `vbscript:` rejected for combat. Do not treat `adminSetEnemyConfig` URL success as `#ok`. Do not store library stills as shop-style `data:` proofs.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-003  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-09-01-005; VAL-2026-08-31-014  
REGRESSION_RISK: MEDIUM if implementers skip decode because the URL “already validated,” or reuse proof `data:` for sprites.  
VALIDATION_REQUIRED: A 2048-char https URL to a 4096² JPEG is rejected by the library validator even if `adminSetEnemyConfig` accepts the string. `file:///tmp/x.png` never becomes `#ok`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: drawImage in logical CSS pixels — do not multiply custom art by dpr or MOBILE_ZOOM  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Canvas backing is `cssW * dpr` then `ctx.scale(dpr)` (WX 7200–7211, 7250–7264, 13953–13965). Builtin `fillRect` uses 3px **logical** cells. `MOBILE_ZOOM` 1.75 scales **tiles only** (957–959); pixels stay 3px. Multiplying a 24×24 PNG by dpr (or by 1.75) would mismatch chess neighbors on the same map.  
SYSTEMS_AFFECTED: custom `drawImage` branch, `visualPreview.ts` mobile pane  
RECOMMENDED_ACTION: `drawImage(bitmap, drawX - w/2, drawY - h/2, w, h)` in the same CSS space as `fillRect`. Preview includes 140×70 diamond with unscaled 24×24 art. Do not set `imageSmoothingEnabled` stretch.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-02-001  
DEPENDENCIES: VAL-2026-09-02-001; VAL-2026-09-02-003; VAL-2026-08-31-011  
REGRESSION_RISK: HIGH if mixed packs show 2× retina custom next to 24×24 chess, or zoomed custom next to unzoomed pixels.  
VALIDATION_REQUIRED: Continue on a 390px-wide viewport; custom 24×24 and chess 24×24 share screen size; HiDPI desktop same.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Keep visualAssetId off CharacterStats — instance bind only  
CATEGORY: persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: CharacterStats is 12 required fields (AGENTS.md; `main.mo` CharacterStats). Omitting `killCount` already fails Candid. `saveBattleStats` is an absolute snapshot path. A 13th visual field would desync bindgen vs deployed actor and is unrelated to HP/AP/XP. Enemy instance already has `id` / `pieceType` / `family` / `isBoss` for bind keys. Player world draw uses `pieceType` + `playerView`, not a stats field.  
SYSTEMS_AFFECTED: `Enemy` type (optional `visualAssetId`), player world ref, **not** CharacterStats  
RECOMMENDED_ACTION: Optional `visualAssetId?: string` on the live `Enemy` / summon object, written at spawn. Player: a WX ref or character-adjacent cache keyed by pieceType, not a Motoko stats field. Revert-to-default clears the instance field.  
AUTONOMY: GUARDRAIL  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-21-008  
REGRESSION_RISK: HIGH if CharacterStats grows and Caffeine/deployed actors reject saves.  
VALIDATION_REQUIRED: `updateCharacter` / `saveBattleStats` payloads still 12 stats fields. Empty library: no new Candid field required.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Preview clip math must include attack damage floats at y−44 / y−58  
CATEGORY: admin-ui  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: 09-01/09-02 warned on name `y−34`, badge `(x+18, y−48)`, icons draw-point − 30. Live attack-mode overlay also draws `-${scaledDmg}` at `screenPos.y - 44` and a scaled label at `y - 58` (WX 8206–8214). Tall custom art will collide with those strings as well as the summon badge.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` (new), VAL-009 warning table  
RECOMMENDED_ACTION: When implementing preview warnings, union 09-21 coordinates: name −34, level −20, icons drawY−30, badge (x+18, y−48), damage −44/−58, shadow at foot. 24×24 recommended art should not trip the damage-float warning; 50-tall boss art should warn.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-009  
DEPENDENCIES: VAL-2026-08-31-009; VAL-2026-09-01-004  
REGRESSION_RISK: LOW — preview-only.  
VALIDATION_REQUIRED: A 48-tall summon PNG triggers badge + damage-float warnings; a 24×24 does not.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-013  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Owner-only means the existing #admin catalog gate — do not invent a second role  
CATEGORY: auth  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: AccessControl is `#admin` | `#user`. First non-anonymous II caller becomes admin (`main.mo` 712–739). `App.tsx` 291 `userRole === "admin"`. Dashboard deny `AdminDashboard.tsx` 5546. `assignUserRole` can mint additional admins. There is no `#owner` variant.  
SYSTEMS_AFFECTED: future `adminSetVisualAsset*` methods  
RECOMMENDED_ACTION: Guard library writes with the same `AccessControl.hasPermission(..., #admin)` as `adminSetEnemyConfig`. Players never see the UI. Document that every `#admin` can mutate the library (same as spawn templates). A single-principal lock is optional product work, not required for v1.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002  
DEPENDENCIES: VAL-2026-08-31-002  
REGRESSION_RISK: MEDIUM if a hunter adds `#owner` and locks out the live first-login admin, or if queries trap for unregistered callers (`_isAdminPrincipal` comment 732–733).  
VALIDATION_REQUIRED: Non-admin actor cannot write. Unregistered `getUserRole` stays non-admin without trap. Empty library: world unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-21-014  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Barrier towers, ads, and juice stay out of v1 combatant library  
CATEGORY: scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `engine/barrierRender.ts` 14–16 draws a 6-layer iso tower (`BARRIER_LAYER_HEIGHT = 28`) — passability/LoS/occupancy untouched. Landing ads already `<img src={imageUrl}>` (`LandingPage.tsx` 750) after `unsafeUrl` reject; admin copy “Custom Visual — override URLs set” (AdminDashboard 8221) is **true for ads**. Death juice is `fillRect` fragments (`effects.ts` 282–292). VAL-016 / VAL-2026-09-01-009 / VAL-2026-09-02-006 already park these; 09-21 confirms barrier towers as an additional non-combatant draw path.  
SYSTEMS_AFFECTED: category registry, upload UI  
RECOMMENDED_ACTION: Upload UI has no barrier / ad / death / portal slot. Adding a category requires a measured profile. Do not route ad bytes through `resolveRuntimeVisual`.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-08-31-016; VAL-2026-09-01-009; VAL-2026-09-02-006  
REGRESSION_RISK: MEDIUM if an orchestrator blindly replaces all “Custom Visual” strings and hides working ads.  
VALIDATION_REQUIRED: Filled ad box still shows on landing; barriers still 6-layer towers; combat pixels unchanged.  
STATUS: NEW  
