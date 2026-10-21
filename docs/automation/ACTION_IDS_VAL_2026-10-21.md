# ACTION_IDs — 2026-10-21 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-10-21.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-10-21.md).  
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

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-10-21

| ID | Status 2026-10-21 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts`; HEAD still `0f5363f` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 |
| VAL-2026-09-25-011 elite rec 34 | Corrected by VAL-2026-09-26-001 (squash max 1.5 → rec 36) |
| VAL-2026-09-26-005 Rest/Death desktop follow pane | **Corrected** by VAL-2026-09-27-001 (desktop paint ignores `cameraRef`) |
| VAL-2026-09-27-001 | **Extended** by this run: Rest/Death **does** pan when `!isDesktop` (tablet / landscape phone) |
| VAL-2026-09-28-001 share gridToScreen / #639 | still OPEN; `isoGrid.ts` absent on `0f5363f` |
| VAL-2026-09-29-001 #724 spec-sheet collision | still valid; #724 still OPEN |
| VAL-2026-09-29-007 extract sibling list | **Extended** by VAL-2026-10-21-001 / 004 (`#798` cameraFollow) |

---

ACTION_ID: VAL-2026-10-21-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Import #798 stepCameraFollow — do not treat cameraFollow.ts as desktop paint follow  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#798](https://github.com/Mr-Melic/stralt/pull/798) (created 2026-09-29T00:25Z, ten minutes after VAL docs #782) extracts `engine/cameraFollow.ts`. Module comment: WorldExploration still owns Rest/Death snap, desktop lock at (0,0), `shouldFollowPlayer`, and the RAF 0.18 lerp (WX 8767–8788). Tests state “Live WX never calls this on desktop.” Live `gridToScreen` forces `cam=0` when `isDesktop` (`innerWidth > 1024`, WX 877, 3780–3781). Rest/Death writes `cameraRef` for every viewport first (5877–5893) then returns — desktop paint still ignores that write.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` (new); WX camera wiring (union with #798); iso preview panes  
RECOMMENDED_ACTION: After #798, import `stepCameraFollow` — do not copy the velocity/deadzone math. Iso preview must keep a desktop pane with cam=0 even on Rest/Death. Do not simulate desktop follow because the helper file exists. Until #798 merges, call live WX. Union WX on restack (one helper name).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-09-27-001  
DEPENDENCIES: VAL-2026-08-31-009; VAL-2026-09-27-001; VAL-2026-09-28-001; stack-compat with #798 / #639  
REGRESSION_RISK: HIGH if preview or custom draw uses `cameraRef` on desktop and stills slide while chess pixels stay glued to cam=0 tiles; HIGH if VAL concatenates `stepCameraFollow` with #798.  
VALIDATION_REQUIRED: Desktop Rest/Death: custom still and chess share a static diamond. Phone Rest/Death: both pan together. `python3 scripts/check-duplicate-exports.py src/frontend/src`. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Iso preview must include landscape-phone as unzoomed 80×40 — useIsMobile is width-only  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `useIsMobile(breakpoint = 768)` (`hooks/use-mobile.tsx` 17–26) is `innerWidth < 768` only. VAL-2026-09-02-001 treated “phone after Continue” as `MOBILE_ZOOM` 1.75 → 140×70 (WX 957–959). A landscape phone (e.g. 844×390) has `isMobile=false`, tiles **80×40**, and `isDesktop=false` so `gridToScreen` uses `cameraRef`. `App.tsx` 351–355 auto-persists Continue when width ≥768. Sibling #795 documents this as MAA-011 and does not change tile math. Pixel patterns still do not multiply by 1.75.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; `RENDER_PROFILES` mobile pane list  
RECOMMENDED_ACTION: Preview three combat layouts: (1) portrait &lt;768 with 140×70 diamond + 24×24 art; (2) 768–1024 unzoomed 80×40 + camera-capable paint; (3) desktop &gt;1024 cam=0. Do not scale bitmaps with `MOBILE_ZOOM`. Do not skip landscape clipping/overlap warnings.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-09-02-001  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-02-001  
REGRESSION_RISK: MEDIUM if owners author 24×24 art against a 140×70 pane and then rotate — art becomes relatively larger on 80×40 tiles and overlaps neighbors.  
VALIDATION_REQUIRED: Continue on 390px then rotate to ≥768: PNG and chess stay 24×24; tiles drop from 140×70 to 80×40. Preview warned about both layouts. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Keep mouse/touch sprite pads 10/14 — #795 locks them; never grow hit from PNG size  
CATEGORY: render-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live `hitTestSprite` (WX 8885–8918) uses stored tile-derived `x,y,w,h` (desktop tested **80×41**, WX 8088–8092). Pads: mouse **10** (10127), touch **14** (10819). Open PR [#795](https://github.com/Mr-Melic/stralt/pull/795) adds `canvasPointerParity.contracts.test.ts` that `assert.match`es those two `hitTestSprite(..., 10|14)` literals plus shared `decideSpriteCastClick` / `decideTileCastClick` and 400 ms ghost-click. Occupancy remains one tile (`occupancy.ts` 84–96).  
SYSTEMS_AFFECTED: sprite rect recording (WX 8085–8104 / 8335–8353); hit-test (leave pads); VAL must not edit #795’s contract test except union  
RECOMMENDED_ACTION: Custom stills keep the same `drawSize` / registered `h`. Do not set `w`/`h` from bitmap dimensions. Do not unify 10 vs 14 from this library. Restack with #427 (hit-test extract) and #795 by union, not concatenation.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-008 / VAL-2026-09-01-003  
DEPENDENCIES: VAL-2026-08-31-008; VAL-2026-09-01-003; stack-compat with #427 / #795  
REGRESSION_RISK: HIGH if a 48-wide PNG expands the hit rect and steals neighbor casts; HIGH if VAL duplicates `hitTestSprite`.  
VALIDATION_REQUIRED: Bound 48-wide PNG still clicks as 80×41 + pad 10/14. `node --test` on #795 contract file after restack. Empty library click boxes identical.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Rest/Death camera pan is live on every non-desktop viewport — preview that pane  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `updateCameraToFollowPlayer` Rest/Death branch (WX 5877–5893) writes `cameraRef` / `targetCameraRef` to center the player and **returns before** the desktop lock (5895–5899). `gridToScreen`, rAF hover, and `clientToGrid` zero cam only when `isDesktop` (3780–3781, 8844–8845, 8942–8943). Therefore tablet 768–1024 and landscape phones **paint** the Rest/Death pan; desktop writes the same numbers and ignores them. VAL-2026-09-27-001 documented the desktop ignore; it did not freeze the ≤1024 Rest/Death live path. #798 does **not** extract this snap.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; custom `drawImage` must share `gridToScreen` (cache ignores camera — VAL-2026-09-27-002)  
RECOMMENDED_ACTION: Iso preview includes a Rest-map pane at width 800 (cam used) and width 1280 (cam forced 0). Custom draw calls the same `gridToScreen` as chess. Do not move Rest snap into `cameraFollow.ts`. Do not invalidate a private tile cache without camera.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-27-001 / VAL-2026-09-27-002  
DEPENDENCIES: VAL-2026-10-21-001; VAL-2026-10-21-002; VAL-2026-09-28-001  
REGRESSION_RISK: HIGH if custom stills use uncached cam-aware math on desktop (they drift) or cached cam-ignorant math on tablet Rest (they stick while the map pans).  
VALIDATION_REQUIRED: Width 800 Rest map: PNG and chess pan together. Width 1280 Rest map: both stay put. Empty library Rest/Death unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Extend the WX extract sibling list with #798; keep #639 import-not-copy  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: VAL-2026-09-29-007 listed #427 / #514 / #591 / #683 / #639 / #730. Additional OPEN WX-touching extract: [#798](https://github.com/Mr-Melic/stralt/pull/798) `cameraFollow.ts`. `isoGrid.ts` is still **absent** on `0f5363f`; #639 remains OPEN (rounded top ≠ unrounded center). WX is 19213 lines. AGENTS.md forbids growing the rAF body. Duplicate iso projectors fail Caffeine esbuild and desync Rest/Death cam.  
SYSTEMS_AFFECTED: WX; `engine/visualAssets.ts`; `engine/isoGrid.ts` on #639; `engine/cameraFollow.ts` on #798; `engine/ambientOcclusion.ts` on #730  
RECOMMENDED_ACTION: New modules + tests. WX at most: pass resolver into `DrawCombatantOptions` and the player `drawPixelPattern` site (8315–8326). Import #639 / #798 helpers after those PRs; until then call live functions. Union overlapping files.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-09-29-007  
DEPENDENCIES: VAL-2026-08-31-017; VAL-2026-09-28-001; VAL-2026-09-29-007; VAL-2026-10-21-001  
REGRESSION_RISK: HIGH if VAL pastes a private `gridToScreen` that ignores desktop `cam=0` or duplicates `isoTileTopVertexRounded` / `stepCameraFollow`.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Empty library pixels identical. `check-duplicate-exports.py` clean.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not wait for VAL docs PRs #355–#782 — implement from merged 08-31 IDs on main  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `origin/main` is still `0f5363f` (PR #332, 2026-09-21). Nine open VAL docs PRs (#355 … #782) never merged. Newest repo PR is #813 (2026-09-29). 22 days produced no combat `drawImage`. Merged actionable contract is `VAL-2026-08-31-001`…`019` plus implemented copy-honesty `VAL-2026-09-01-001`. Later VAL IDs are evidence refreshes (phones Continue, portal boss 34×34, squash 1.5, sibling extracts). Oldest-first merge of nine markdown PRs is not a prerequisite for `engine/visualAssets.ts`.  
SYSTEMS_AFFECTED: first implementation PR (new TS only); do not restack all VAL markdown  
RECOMMENDED_ACTION: First implementer PR ships `resolveRuntimeVisual` + tests that `[]` / inactive / corrupt → `{ kind: "builtin" }`. Read the 08-31 design + this fact sheet’s viewport matrix. Do not block on merging #355–#782. Do not concatenate nine copies of `RENDER_PROFILES`.  
AUTONOMY: IMPLEMENT_WITH_TESTS — helper first; no RAF / mapGen / combat math.  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-08-31-017; VAL-2026-09-01-006  
REGRESSION_RISK: LOW for skipping unread docs PRs; HIGH if a hunter waits for the stack and ships nothing, or concatenates `export function resolveRuntimeVisual` from multiple drafts.  
VALIDATION_REQUIRED: Empty library on `main`: pixels identical. New enemy/boss without uploads paints chess. `pnpm typecheck` + `pnpm check`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 2026-10-21 RENDER_PROFILES — pixel boxes unchanged after 30 days on 0f5363f  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Re-derived this run: tile 80×40 (`gameConstants.ts` 6–7), cell 3px (WX 3855), draw point top+9, standard/player/summon 24×24, squash max **1.5** (`spawnPolicy.ts` 241–248) → elite rec **36**, portal boss live 8×8×1.4 ≈ **34×34** (no `isBoss`/`bossId` at 6524–6568), Rush `king.front` 24×24, hit **80×41**, shadow desktop 12×4.2, wall 28, neighbor (40,20), AO 8px floor, pads 10/14. Unchanged vs 09-26…09-29.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` profile constants, admin spec UI  
RECOMMENDED_ACTION: Check in typed `RENDER_PROFILES` (`player_standard`, `enemy_standard`, `enemy_elite`, `boss_large`, `summon_standard`) using only these numbers. Custom default scale = 1. Do not invent 64×64 / 128×128. Do not key `boss_large` off `isBoss` / `family==="boss"`. Show the spec sheet **before** file selection.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-004  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-09-22-002; VAL-2026-09-26-001  
REGRESSION_RISK: HIGH if upload UI asks for 128×128 and combat draws 24×24 centered, or boss PNGs are 1.4-stretched enemy art.  
VALIDATION_REQUIRED: Spec sheet before picker lists 24×24 / 34×34 live boss / 36 elite-meta / alpha / 256 KiB. Reject JPEG. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity after 22 designer-days with no main movement  
CATEGORY: fallback-invariant  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Grep of `src/` for `ctx.drawImage` and `createImageBitmap` returns no matches (comment only in `adminVisualStatus.ts`). `engine/visualAssets.ts` absent. `drawCombatant` (`pieceArt.ts` 837–1023) still only `fillRect`. New bosses still `BOSS_PIXEL_PATTERNS[bossId] ?? boss_12` (`enemyPixelPatterns.ts` 430–432) for the unused 8×12 path; live portal Enemy still chess × 1.4. New summons still `creaturePatterns`. VAL-2026-09-01-001 copy change did not wire combat. HEAD `0f5363f` since 2026-09-21.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), `drawCombatant`, spawn sites  
RECOMMENDED_ACTION: First implementer PR must ship `resolveRuntimeVisual` + tests that library `[]` / inactive / corrupt → `{ kind: "builtin" }` with no draw path change. New enemies/bosses/summons require no uploads. This ID is the 10-21 evidence refresh of VAL-2026-08-31-001 / VAL-2026-09-01-006 / VAL-2026-09-02-012, not a second implementation.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-01-006; VAL-2026-10-21-006  
REGRESSION_RISK: HIGH if a hunter wires `spriteUrl` into rAF “to make admin copy true.”  
VALIDATION_REQUIRED: Empty canister + empty library → today’s pixels. New `BossConfig` without art → generated pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Player stills still bypass drawCombatant — second wire at WX 8315  
CATEGORY: renderer  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemies/summons/bosses use `drawCombatant` (WX 8063–8075). Player uses `drawPixelPattern` + `getPersistedPiecePattern` (8315–8326) and is **not** in `combatantsRef` (sprite key `"player"`, drawOrder 99999 at 8337–8342). `DrawCombatantOptions` still has no bitmap hook (`pieceArt.ts` 714–744). `drawPixelPattern` trailing `restore` (3883) has no save — do not `drawImage` inside it.  
SYSTEMS_AFFECTED: `pieceArt.ts` `drawCombatant`; WX player site 8315–8326  
RECOMMENDED_ACTION: Optional top branch on `drawCombatant` **and** one player-site call that uses the same resolver keyed by `pieceType`+`playerView`. Omitted option ≡ today. Do not add the player to `combatantsRef` from this library.  
AUTONOMY: IMPLEMENT_AFTER VAL-2026-08-31-011 / VAL-2026-09-01-007  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007; VAL-2026-09-02-003  
REGRESSION_RISK: HIGH if only the enemy dispatch paints PNGs and the player stays chess (or vice versa); HIGH if `drawPattern` is overloaded to accept ImageBitmap.  
VALIDATION_REQUIRED: No option / empty library → fillRect both sites. Custom player revoke → next frame chess. Enemy custom does not require a player upload.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Bind pools from instance id + seededRng — generateEnemyScaleFactors remains an unseeded Math.random stream  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: No encounter seed exists. WX 5768 calls `generateEnemyScaleFactors()` with default `Math.random` (two unused draws then variation; spawnPolicy.ts 227–255). Enemy ids embed `Date.now()` (5809, 6524). Summon instance id is `summon-${Math.random()…}` (`summonSpawn.ts` 153); wrapper `enemy-summon-${pieceType}` (271) is the **spell** id. `seededRng` (`combatMath.ts` 122–128) already hashes `seedKey` for battle stats. `toCombatantEntry` drops unknown fields (combatantStore.ts 141–169).  
SYSTEMS_AFFECTED: spawn bind on `combatantsRef` Enemy; `engine/visualAssets.ts` pick helper  
RECOMMENDED_ACTION: `visualAssetId = pickWeighted(seededRng(hash(instanceId, poolId, poolVersion)), eligible)`. Write once at spawn / summon / boss portal. Do not sample the squash RNG stream. Do not bind on `enemy-summon-${pieceType}`. If the bound id later fails, builtin — no re-roll. Do not invent a map encounter seed as a prerequisite.  
AUTONOMY: IMPLEMENT_WITH_TESTS  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-08-31-006; VAL-2026-09-02-004; VAL-2026-09-23-001; VAL-2026-09-28-004  
REGRESSION_RISK: HIGH if `Math.random()` is called from `drawCombatant` or a React render; HIGH if two enemy summons of the same pieceType share one visual because the wrapper id was used.  
VALIDATION_REQUIRED: 100 fake rAF ticks same instance → same `visualAssetId`. Empty eligible set → unset id → builtin. `turnsRemaining` decrement does not re-pick. Two `wolf` enemy summons can differ.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Set imageSmoothingEnabled false on the shaken rAF ctx immediately before drawImage  
CATEGORY: renderer  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: CSS `canvas { image-rendering: pixelated }` (`index.css` 652–655) is display-time. `ctx.imageSmoothingEnabled` is never set. Every frame `setTransform` + `scale(dpr)` (WX 7263–7264) resets 2D state; `canvas.width=` (7256–7261) also resets it. Shake is `translate` on this ctx (7265–7267). VAL-2026-09-29-011 already required nearest-neighbor on the shaken ctx; 22 days later the live path is unchanged.  
SYSTEMS_AFFECTED: custom `drawImage` branch; WX rAF (do not “fix” chess `fillRect` in VAL)  
RECOMMENDED_ACTION: When the optional bitmap branch runs, `ctx.imageSmoothingEnabled = false` on that same ctx after scale/shake. Cache `ImageBitmap` by `ASSET_ID`+`VERSION`; resize is not a pool re-roll. Do not draw stills on the puff sidecar context.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-28-011 / VAL-2026-09-29-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-23-004; VAL-2026-09-28-003; VAL-2026-09-29-011  
REGRESSION_RISK: MEDIUM if bilinear smoothing turns 24×24 PNGs mushy on 140×70 tiles; HIGH if decode runs inside rAF after every resize.  
VALIDATION_REQUIRED: Bound 24×24 PNG stays crisp after window resize and after a hit-shake. Empty library fillRect unchanged. Same `visualAssetId` across 100 frames.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-10-21-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#782  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, #694, #715, **#782**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings or #724 / #798 TS. Rewriting `ACTION_IDS_VAL_2026-09-29.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-10-21.md`, `docs/automation/ACTION_IDS_VAL_2026-10-21.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers with #724 / #639 / #631 / #730 / #798 / #795.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-10-21 ACTION_IDs. Production code not modified.*
