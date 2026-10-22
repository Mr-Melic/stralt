# ACTION_IDs — 2026-10-22 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-10-22.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-10-22.md).  
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

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-10-22

| ID | Status 2026-10-22 |
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
| VAL-2026-10-21-006 skip docs PRs #355–#782 | **Extended** by VAL-2026-10-22-008 (now include **#835**) |
| VAL-2026-10-21-008 empty-library | **Extended** by VAL-2026-10-22-001 / 010 with #828 persist contract |

---

ACTION_ID: VAL-2026-10-22-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Union VAL persist with #828 SDEG-2026-10-21-003 — never promote pixelPattern JSON or sprite URLs to mandatory combat art  
CATEGORY: fallback-invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#828](https://github.com/Mr-Melic/stralt/pull/828) (created 2026-10-21T00:14Z, three minutes before VAL docs #835) ships `SDEG-2026-10-21-003` + `utils/pixelPatternPersistVisual.ts`. Live combat portrait/player draw uses `getPersistedPiecePattern(pieceType)` (WX **3719**, **8289**; `pieceArt.ts` **653–658**) and ignores `Character.pixelPattern`. Official create writes `JSON.stringify(chessPiecePatterns[selectedPiece])` (`CharacterCreation.tsx` **273**). The blob is still a **required** Text field with cap **16_384** (`main.mo` **315–316**, **395–396**). `adminDeletePlayerSpriteConfig` (`main.mo` **854–860**) removes the catalog row only. VAL #835 did not cite this sibling.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new); Character persist; playerSpriteConfigs; must not write library ids onto required Character fields  
RECOMMENDED_ACTION: Library records stay optional canister maps + object-store bytes. `resolveRuntimeVisual` must return `{ kind: "builtin" }` when the library is empty, the bound id is missing, or Character has only catalog JSON / empty spriteUrl. Do not persist PNG into `pixelPattern`. Do not require a sprite URL on Character. Safe-delete of a player still must not delete Character. Import `combatDrawUsesStoredPixelPattern` after #828 — do not clone that file.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-001 / VAL-2026-08-31-012 / SDEG-2026-10-21-003  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-08-31-012; VAL-2026-09-01-006; stack-compat with #828  
REGRESSION_RISK: HIGH if a hunter indexes stored JSON or `spriteUrl` in RAF and yesterday’s cohort fails to load; HIGH if VAL concatenates `combatDrawUsesStoredPixelPattern` with #828.  
VALIDATION_REQUIRED: Unknown `pieceType` still paints `king.front`. Empty library + filled catalog JSON → chess pixels. Delete sprite config does not delete Character. `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not clone #828 pixelPatternPersistVisual helpers into engine/visualAssets.ts  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #828 adds `src/frontend/src/utils/pixelPatternPersistVisual.ts` and `.test.ts` with `combatDrawUsesStoredPixelPattern`, `characterCreatePersistsCatalogPieceJson`, `storedPixelPatternIsMandatoryGameplay`, `deleteSpriteConfigDeletesCharacter`, `unknownPieceTypeFallsBackToKingFront`. Those functions encode persist policy, not bitmap resolve. Oldest-first merge would conflict or duplicate-export if VAL copies the same names.  
SYSTEMS_AFFECTED: first `engine/visualAssets.ts` implementation PR; tests  
RECOMMENDED_ACTION: VAL tests live next to the resolver (`visualAssets.test.ts`). After #828, import the persist helper if a fixture needs the boolean. Keep one `export function` per name. Do not move persist helpers into `engine/` from this library.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-10-22-001; stack-compat with #828  
REGRESSION_RISK: HIGH if two copies of `combatDrawUsesStoredPixelPattern` fail Caffeine `vite build` / esbuild.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Duplicate-export scan clean. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player stills key pieceType+playerView — Character.pixelPattern 16_384 and creation CSS 240×210 are not upload sizes  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `getPersistedPiecePattern` (`pieceArt.ts` 653–658) is pieceType-only. Motoko rejects `pixelPattern.size() > 16_384`. A 24×24 PNG already exceeds that Text cap if stored as bytes/base64. Creation preview is 8×10=80×80 art on internal canvas **320×280** (`CharacterCreation.tsx` 151–153, 452–455) with CSS **width 240 / height 210** (462–463). VAL-2026-10-21-007 listed 320×280 and omitted the CSS box. Admin sprite preview remains 72×72 `object-fit:contain`. World player draw is 24×24 at tile top+9 (WX 8315–8326).  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; admin spec sheet; player bind  
RECOMMENDED_ACTION: Spec sheet **before** file pick lists 24×24 (48 @2×). Explicitly reject using 60×60 portrait, 72×72 admin `<img>`, 320×280 internal, or 240×210 CSS as recommended size. Do not write the PNG into `pixelPattern`. Portrait/creation stay generated pixels in v1.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-009 / VAL-2026-09-01-007  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-10-22-001  
REGRESSION_RISK: HIGH if owners author against the 240×210 creation box and combat draws 24×24 centered; MEDIUM if Motoko Text is used as a blob and create/update start returning `pixelPattern exceeds maximum size`.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / alpha / 256 KiB and names the forbidden HUD/creation sizes. Reject JPEG. Empty library player still chess.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack AdminDashboard or recreate #631/#724/#838 owner UX helpers for the VAL spec sheet  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#838](https://github.com/Mr-Melic/stralt/pull/838) (created 2026-10-21T00:18Z, one minute after VAL #835) adds `adminOwnerUx.auditView.ts`, `.changelogPublish.ts`, `.dirty.ts`, `.entityJump.ts`, `.piiRedact.ts`, `.rollbackConfirm.ts` and states it does **not** restack `AdminDashboard.tsx` and does **not** recreate #631 / #664 / #724 / #775. #724 still owns `visualUploadRequirementsBeforeSelect` (https catalog URL copy, not combat MIME). #631 `catalogVisualPreviewSrc` is admin `<img>`, not iso combat preview. VAL-2026-09-29-001 already forbade colliding with #724’s spec-sheet name.  
SYSTEMS_AFFECTED: admin upload UI (later); `engine/visualPreview.ts`; must not edit #838 files  
RECOMMENDED_ACTION: Combat spec sheet helper gets a **new** name (e.g. `combatVisualUploadSpecBeforeSelect`). Iso preview is a canvas module, not `catalogVisualPreviewSrc`. Import #724 / #631 / #838 after those PRs. Until then, do not paste their functions. Do not restack `AdminDashboard.tsx` while older admin PRs queue.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-003 / VAL-2026-08-31-009 / VAL-2026-09-29-001  
DEPENDENCIES: VAL-2026-09-29-001; VAL-2026-09-29-002; stack-compat with #631 / #724 / #838  
REGRESSION_RISK: HIGH if VAL concatenates `visualUploadRequirementsBeforeSelect` or any `adminOwnerUx.*` export; HIGH if AdminDashboard is edited on a 19k-line conflict stack.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Spec sheet shown before `<input type=file>`. Empty catalog URL copy from #724 unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Bind summon stills on summon-${random} — #861 catalog kit fill is combat, not a visual catalog  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `spawnSummonUnit` (`summonSpawn.ts` **153**) mints `summon-${Math.random().toString(36).slice(2)}` and never copies `summonUnitDef.summonKit` onto `summon.spells`. Wrapper spell id `enemy-summon-${pieceType}` (**271**) is not the instance id. Open PR [#861](https://github.com/Mr-Melic/stralt/pull/861) adds `engine/autoSummonKitSpells.ts` so empty/missing `spells` resolve from catalog `summonKit` for AI. That does not change pieceType, tint, or draw. Two wolves can share a kit and must not share one visual because pieceType or kit spell id was used as the bind key.  
SYSTEMS_AFFECTED: spawn bind on `combatantsRef` Enemy; `engine/visualAssets.ts` pick helper  
RECOMMENDED_ACTION: `visualAssetId = pickWeighted(seededRng(hash(instanceId, poolId, poolVersion)), eligible)` at spawn. Do not bind on `enemy-summon-${pieceType}`, catalog summon spell id, or `summonKit[]`. Filling empty `spells` later must not re-pick. `turnsRemaining` decrement must not re-pick.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-08-31-006; VAL-2026-09-28-004; VAL-2026-10-21-010; stack-compat with #861  
REGRESSION_RISK: HIGH if two enemy summons of the same pieceType share one visual; HIGH if kit resolve in render calls `Math.random`.  
VALIDATION_REQUIRED: 100 fake rAF ticks same instance → same `visualAssetId` before and after catalog kit fill. Empty eligible set → builtin. Two `wolf` summons can differ. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Combat kit-share PRs do not wire boss_large — live portal Enemy still lacks isBoss/bossId  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Portal spawn (WX **6524–6568**) sets `scaleX/Y = 1.4`, `family: "boss"`, id `boss_${id}_${Date.now()}`, and does **not** set `isBoss` / `bossId`. `drawCombatant` branch 1 requires both (`pieceArt.ts` 856). Live paint is chess 8×8 × 1.4 ≈ **34×34**. 8×12 tables (`enemyPixelPatterns.ts` 10–24) stay unused. Rush (`WX` 5326–5343) sets `isBoss: true`, lore `pieceType`, no `bossId`, no scale → `king.front` **24×24**. Open kit-share PRs **#842–#868** share execute with advertised kit fields; they do not add those Enemy flags. VAL-2026-09-22-002 already forbade keying `boss_large` off `isBoss` / `family==="boss"`.  
SYSTEMS_AFFECTED: `RENDER_PROFILES.boss_large`; spawn assignment records  
RECOMMENDED_ACTION: Keep `boss_large` keyed by assignment records + instance id prefixes (`boss_*`, `boss-rush-*`) after an explicit profile. Do not treat kit-share landing as 8×12 paint. Do not stretch `enemy_standard` PNGs by 1.4. Do not wait for kit PRs before shipping empty-library fallback.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-007 / VAL-2026-09-22-002  
DEPENDENCIES: VAL-2026-08-31-007; VAL-2026-09-22-002; VAL-2026-10-21-007  
REGRESSION_RISK: HIGH if a hunter sets `isBoss` on portal spawn “so PNGs show” and 8×12 tables suddenly paint at 1.4 without a profile; HIGH if kit PRs are blocked as a VAL prerequisite.  
VALIDATION_REQUIRED: New `BossConfig` without uploads still paints chess × 1.4. Bound `boss_large` PNG uses scale 1. Empty library Rush still `king.front` 24×24.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not restack WorldExploration or the #841 click-trace Vite alias from VAL  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX is **19213** lines on `0f5363f`. AGENTS.md forbids growing the rAF body. Open WX extracts: #427 / #514 / #591 / #639 / #683 / #730 / #798 / #831. Open PR [#841](https://github.com/Mr-Melic/stralt/pull/841) aliases `debug/clickTrace` in `vite.config.js` and **does not restack WX**. VAL-2026-10-21-005 already listed #798 / #831. A VAL `drawImage` pasted into the rAF path would conflict with every extract and with #841’s “do not restack WX” rule. `drawPixelPattern` trailing `restore` (WX 3883) has no save; it is also passed as `drawPattern` (8072).  
SYSTEMS_AFFECTED: `engine/visualAssets.ts`; WX at most two call sites; `vite.config.js` leave-alone  
RECOMMENDED_ACTION: New modules + tests. WX at most: pass resolver into `DrawCombatantOptions` and the player site (8315–8326). Import extract helpers after those PRs. Do not edit the click-trace stub plugin. Union overlapping files; one export per name.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-10-21-005  
DEPENDENCIES: VAL-2026-08-31-017; VAL-2026-09-28-001; VAL-2026-10-21-005; stack-compat with #427 / #639 / #730 / #798 / #831 / #841  
REGRESSION_RISK: HIGH if VAL pastes a private `gridToScreen` or duplicates `stepCameraFollow` / `isoTileTopVertexRounded`; HIGH if `vite.config.js` is rewritten and the prod click-trace stub drops.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Empty library pixels identical. Duplicate-export scan clean. Production `vite build` still stubs click-trace after restack.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not wait for VAL docs PRs #355–#835 — implement from merged 08-31 IDs on main  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f` (PR #332, 2026-09-21). Ten open VAL docs PRs (#355 … #782, **#835**) never merged. 31 days produced no combat `drawImage`. Merged actionable contract is `VAL-2026-08-31-001`…`019` plus implemented copy-honesty `VAL-2026-09-01-001`. Later VAL IDs are evidence refreshes (phones Continue, portal boss 34×34, squash 1.5, sibling extracts, #828 persist). Oldest-first merge of ten markdown PRs is not a prerequisite for `engine/visualAssets.ts`.  
SYSTEMS_AFFECTED: first implementation PR (new TS only); do not restack all VAL markdown  
RECOMMENDED_ACTION: First implementer PR ships `resolveRuntimeVisual` + tests that `[]` / inactive / corrupt → `{ kind: "builtin" }`. Read the 08-31 design + this fact sheet’s persist/viewport notes. Do not block on merging #355–#835. Do not concatenate ten copies of `RENDER_PROFILES`.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper first; no RAF / mapGen / combat math.  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-08-31-017; VAL-2026-09-01-006; VAL-2026-10-21-006  
REGRESSION_RISK: LOW for skipping unread docs PRs; HIGH if a hunter waits for the stack and ships nothing, or concatenates `export function resolveRuntimeVisual` from multiple drafts.  
VALIDATION_REQUIRED: Empty library on `main`: pixels identical. New enemy/boss without uploads paints chess. `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 2026-10-22 RENDER_PROFILES — pixel boxes unchanged after 31 days on 0f5363f  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-derived this run: tile 80×40 (`gameConstants.ts` 6–7), cell 3px (WX 3855), draw point top+9, standard/player/summon 24×24, squash max **1.5** (`spawnPolicy.ts` 241–248) → elite rec **36**, portal boss live 8×8×1.4 ≈ **34×34** (no `isBoss`/`bossId` at 6524–6568), Rush `king.front` 24×24, hit **80×41**, shadow desktop 12×4.2, wall 28, neighbor (40,20), AO 8px floor, pads 10/14. Creation CSS **240×210** is display-only. Unchanged vs 09-26…10-21 except that CSS citation.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. Custom default scale = 1. Do not invent 64×64 / 128×128. Do not key `boss_large` off `isBoss` / `family==="boss"`. Show the spec sheet **before** file selection.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-004  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-22-002; VAL-2026-09-26-001; VAL-2026-10-21-007  
REGRESSION_RISK: HIGH if upload UI asks for 128×128 and combat draws 24×24 centered, or boss PNGs are 1.4-stretched enemy art.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / 34×34 live boss / 36 elite-meta / alpha / 256 KiB. Reject JPEG. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity after 31 designer-days and a resumed sibling queue  
CATEGORY: fallback-invariant  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `ctx.drawImage` and `createImageBitmap` returns no matches (comment only in `adminVisualStatus.ts`). `engine/visualAssets.ts` absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect`. New bosses still `BOSS_PIXEL_PATTERNS[bossId] ?? boss_12` (`enemyPixelPatterns.ts` 430–432) for the unused 8×12 path; live portal Enemy still chess × 1.4. New summons still `creaturePatterns`. VAL-2026-09-01-001 copy change did not wire combat. HEAD `0f5363f` since 2026-09-21. Queue resumed 2026-10-21 through **#869** without a paint change on main.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons require no uploads. This ID is the 10-22 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-10-21-008, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-01-006; VAL-2026-10-21-008; VAL-2026-10-22-001  
REGRESSION_RISK: HIGH if a hunter wires `spriteUrl` into rAF “to make admin copy true.”  
VALIDATION_REQUIRED: Empty canister + empty library → today’s pixels. New `BossConfig` without art → generated pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player stills still bypass drawCombatant — second wire at WX 8315; do not drawImage inside drawPixelPattern  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemies/summons/bosses use `drawCombatant` (WX 8063–8075) with `drawPattern: drawPixelPattern` (8072). Player uses `drawPixelPattern` + `getPersistedPiecePattern` (8315–8326) and is **not** in `combatantsRef` (sprite key `"player"`, drawOrder 99999 at 8337–8342). `DrawCombatantOptions` still has no bitmap hook (`pieceArt.ts` 714–744). `drawPixelPattern` trailing `restore` (3883) has no save. Putting `drawImage` inside it would hit the player site **and** every combatant branch plus pop the moving-enemy save (8057–8076).  
SYSTEMS_AFFECTED: `pieceArt.ts` `drawCombatant`; WX player site 8315–8326  
RECOMMENDED_ACTION: Optional top branch on `drawCombatant` **and** one player-site call that uses the same resolver keyed by `pieceType`+`playerView`. Omitted option ≡ today. Set `imageSmoothingEnabled = false` on the shaken rAF ctx immediately before `drawImage` (scale/shake at 7263–7267 reset 2D state; CSS `image-rendering: pixelated` at WX 17890 / `index.css` 652–655 is display-time). Do not add the player to `combatantsRef` from this library.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011 / VAL-2026-09-01-007 / VAL-2026-10-21-009 / VAL-2026-10-21-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-09-02-003; VAL-2026-10-21-009  
REGRESSION_RISK: HIGH if only the enemy dispatch paints PNGs and the player stays chess (or vice versa); HIGH if `drawPattern` is overloaded to accept ImageBitmap.  
VALIDATION_REQUIRED: No option / empty library → fillRect both sites. Custom player revoke → next frame chess. Enemy custom does not require a player upload. Bound 24×24 PNG stays crisp after resize and hit-shake.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-22-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#835  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, #694, #715, #782, **#835**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings or #724 / #798 / #828 / #838 / #841 / #861 TS. Rewriting `ACTION_IDS_VAL_2026-10-21.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-10-22.md`, `docs/automation/ACTION_IDS_VAL_2026-10-22.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers with #724 / #639 / #631 / #730 / #798 / #795 / #828 / #831 / #838 / #841 / #861.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-10-22 ACTION_IDs. Production code not modified.*
