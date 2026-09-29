# ACTION_IDs — 2026-09-29 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-29.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-29.md).  
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
- `VAL-2026-09-28-001` … `012` in PR [#715](https://github.com/Mr-Melic/stralt/pull/715) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-29

| ID | Status 2026-09-29 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 |
| VAL-2026-09-25-011 elite rec 34 | Corrected by VAL-2026-09-26-001 (squash max 1.5 → rec 36) |
| VAL-2026-09-26-005 Rest/Death desktop follow pane | **Corrected** by VAL-2026-09-27-001 (desktop paint ignores `cameraRef`) |
| VAL-2026-09-27-002 share gridToScreen | **Extended** by VAL-2026-09-28-001 (`#639` `isoGrid.ts`) |
| VAL-2026-09-27-009 extract siblings | **Extended** by VAL-2026-09-28-005 (#639) and **this run** (#730 AO, #724 owner UX TS) |
| VAL-2026-09-28-007 HTTPS/JPEG not combat MIME | **Extended** by VAL-2026-09-29-001 (#724 `visualUploadRequirementsBeforeSelect` is the sentence a hunter will paste into the file picker) |

---

ACTION_ID: VAL-2026-09-29-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not use #724 visualUploadRequirementsBeforeSelect as the combat file-picker spec sheet  
CATEGORY: scope  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#724](https://github.com/Mr-Melic/stralt/pull/724) (created 2026-09-28T00:10Z, three minutes after VAL docs #715) adds `visualUploadRequirementsBeforeSelect` in `src/frontend/src/utils/adminOwnerUx.visualPool.ts`. For `kind === "enemy"` / `"sprite"` it returns hosted PNG/WebP, **https only**, empty = Default Pixel Visual, pasted URL not rendered. Combat upload must show §4.2 boxes (recommended/max w×h, alpha, 256 KiB, center-on-top+9, no squash, four stills) **before** file selection. `adminGuard.requireHttpsUrl` is landing ads (`adminGuard.mo` 97–104). Blob refs must not require https. JPEG is allowed only on shop proofs (`proofDataMimeAllowed` 109–116).  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` (new spec-sheet copy); admin catalog rows (leave #724 strings for URL stubs); combat upload validator  
RECOMMENDED_ACTION: Combat picker uses a **distinct** exported name (e.g. `combatVisualUploadSpecSheet(profile)`). Import #724 helpers only for unused `spriteUrl` / facing-URL rows. Do not `drawImage` a https URL. Do not require https on object-store ids.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-09-28-007  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-09-01-005; VAL-2026-09-28-007; stack-compat with #724  
REGRESSION_RISK: HIGH if the https-only sentence becomes the only pre-picker copy and owners never see 24×24 / 80×60 / alpha gates, or blob uploads are rejected for lacking `https:`.  
VALIDATION_REQUIRED: Spec sheet before the file picker lists PNG/WebP + alpha + category boxes. A JPEG is rejected for combat. Catalog enemy URL row can still show #724 https copy. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Union VAL with #724 owner UX helpers — do not concatenate customVisualPoolCopy  
CATEGORY: architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: #724 ships `customVisualPoolCopy`, `visualAssetStatusLines` (`emptyCustomIsValid: true`, `isError: false`), `ownerLifecycleFromFlags`, `ownerAssetDependencyRail`. AGENTS.md / Caffeine `vite build`: duplicate `export function` copies in one file fail esbuild. VAL-2026-09-28-005 listed WX extracts, not these utils. Empty pool copy (`0 active variants`) is valid and must never surface as an error.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new); `utils/adminOwnerUx.visualPool.ts` / `.deps.ts` / `.lifecycle.ts` on #724; admin library UI  
RECOMMENDED_ACTION: After #724, import those helpers. If VAL lands first, keep one implementation per name on restack. `visualAssetStatusLines({ storedCustomUrl: false, activeVariantCount: 0 })` remains the empty-library owner copy. Do not add a second `customVisualPoolCopy`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017  
DEPENDENCIES: VAL-2026-08-31-001; VAL-2026-09-01-001; stack-compat with #724 / #631 (`catalogVisualPreviewSrc`)  
REGRESSION_RISK: HIGH if both PRs export the same helper and Caffeine import fails; MEDIUM if empty pool is shown as an error chip.  
VALIDATION_REQUIRED: `python3 scripts/check-duplicate-exports.py src/frontend/src`. Owner UI with zero assets: Default Pixel Visual + “0 active variants”, `isError` false. Combat still generated pixels.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: ownerAssetDependencyRail is not sufficient for safe removal  
CATEGORY: assignment-architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #724 `ownerAssetDependencyRail` returns a single badge keyed by `enemyBossUsage`. VAL safe-removal must list assignments (`#entity` / `#family` / `#pool` / `#pieceType`), pool membership, and live `combatantsRef` instance ids (`summon-*`, `enemy-*`, `boss_*`, `boss-rush-*`). `toCombatantEntry` (`combatantStore.ts` 141–169) drops unknown fields, so a count of turn-order rows will miss `visualAssetId`. Zero `enemyBossUsage` is valid copy (`emptyIsValid: true`), not a delete grant.  
SYSTEMS_AFFECTED: library safe-delete UI; `adminOwnerUx.deps.ts` (union); `combatantsRef`  
RECOMMENDED_ACTION: Keep the #724 rail as **display**. Implement inspect in `engine/visualAssets.ts` (or a dedicated helper with a **new** name) that enumerates assignments + pools + live Enemy ids. Block hard-delete when any bind exists; offer deactivate.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-010 / VAL-2026-08-31-015  
DEPENDENCIES: VAL-2026-08-31-015; VAL-2026-09-29-002; VAL-2026-09-23-001  
REGRESSION_RISK: HIGH if owners hard-delete an asset that is still in a weighted pool because the badge said “none”.  
VALIDATION_REQUIRED: Asset in a pool with `enemyBossUsage: 0` still blocked from hard-delete. Deactivate falls back next frame without re-roll. Empty library delete UI is a no-op.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Uploads stay DRAFT until canister ACTIVE — version-gate wipe is not a library  
CATEGORY: persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #724 `ownerLifecycleFromFlags`: `localDraftOnly` → DRAFT, `appearsLive: false`; ACTIVE requires published-live path and `active !== false`. `versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. `App.tsx` 297–318 `localStorage.clear()` on `APP_VERSION` (`v163`) drops everything else. `nsKey` (WX 866–869) is per-slot game cache, not assets. New Motoko maps need a chain file **after** `20260901_000000` with `OldActor = {}`.  
SYSTEMS_AFFECTED: library metadata canister; admin lifecycle chips; `versionGate.ts` (do not add blob keys without an explicit preserve decision)  
RECOMMENDED_ACTION: Bytes + metadata on canister / object store. Resolver eligibility = `ACTIVE && VALIDATION_STATUS=#ok` (matches lifecycle `appearsLive`). Browser drafts never enter combat. Do not teach `nsKey` as `visualAssetId` storage. Do not amend frozen migration `NewActor`s.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002 / VAL-2026-08-31-014  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014; EOP migration rules  
REGRESSION_RISK: HIGH if a hunter stores PNGs in localStorage and a version bump wipes them mid-session, or a new stable is added on `20260831`/`20260901` (Caffeine M0263 / IC0503).  
VALIDATION_REQUIRED: Empty canister + empty library → today’s pixels. Draft asset never paints. Activate then deactivate → builtin next frame. `python3 scripts/check-eop-stables.py` when Motoko is added.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Union WX with #730 ambient occlusion — preview AO on the floor, never on the PNG  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live AO is a `Uint8Array` mask (WX 7277–7307) and 8px edge gradients on **floor diamonds** for bits 4 and 8 (7558–7613). Open PR [#730](https://github.com/Mr-Melic/stralt/pull/730) extracts `engine/ambientOcclusion.ts` and still touches `WorldExploration.tsx`. Combatants sort by `depth: x + y` (7966–7971) **after** floors. AO does not multiply combatant `fillRect`s. VAL-2026-09-28-005 did not name #730.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; WX depth pass (wiring only); sibling #730  
RECOMMENDED_ACTION: Iso preview draws the same 8px wall-edge shade under dummies. Do not darken/custom-composite the bitmap with AO. Do not copy AO math into visualPreview if #730 exports it — import. Restack VAL implementation with #730 (union WX, one helper name).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-09-28-005  
DEPENDENCIES: VAL-2026-08-31-009; VAL-2026-09-28-001; stack-compat with #730  
REGRESSION_RISK: MEDIUM if preview omits wall shade and owners author 48-wide art that covers the AO edge; HIGH if VAL concatenates `buildAoMask` with #730.  
VALIDATION_REQUIRED: Preview of 24×24 vs 48-wide on a floor next to a wall shows AO on the diamond only. Empty library combat AO unchanged. `check-duplicate-exports.py` clean.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: #631 catalogVisualPreviewSrc is not the iso combat preview  
CATEGORY: scope  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#631](https://github.com/Mr-Melic/stralt/pull/631) `adminOwnerUx.visualPreview.ts`: `catalogVisualPreviewSrc` returns a trimmed URL or `null` if empty/unsafe — intended for admin `<img>`. Caption: “Stored URL preview — not rendered in world”. Combat preview must place stills on 80×40 / 140×70 diamonds at rounded top+9 with player/enemy dummies (`VAL-2026-08-31-009`). WX player site is `drawPixelPattern` at 8315–8326, not an `<img>`.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` (new); admin catalog thumbnails (leave #631)  
RECOMMENDED_ACTION: Keep `catalogVisualPreviewSrc` for unused URL rows. Combat iso preview is a canvas using `gridToScreen` / #639 `isoTileTopVertexRounded`. Do not `drawImage(catalogVisualPreviewSrc(...))` in the rAF loop.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-08-31-012  
DEPENDENCIES: VAL-2026-08-31-009; VAL-2026-08-31-012; VAL-2026-09-28-002; stack-compat with #631  
REGRESSION_RISK: HIGH if a hunter treats a 72×72 object-fit thumbnail as the world scale contract.  
VALIDATION_REQUIRED: Admin URL thumbnail still says not rendered. Combat iso preview shows 24×24 on the diamond at +9. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Extend the WX extract sibling list with #730 and keep #639 import-not-copy  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: VAL-2026-09-28-005 listed #427 / #514 / #591 / #683 / #639. Additional open WX-touching PRs since then include [#730](https://github.com/Mr-Melic/stralt/pull/730) AO plus combat/map PRs (#728, #754, #761, …). `isoGrid.ts` is still **absent** on `0f5363f`; #639 remains OPEN. WX is 19213 lines. AGENTS.md forbids growing the rAF body. Duplicate iso projectors fail Caffeine esbuild and desync rounded vs unrounded tops.  
SYSTEMS_AFFECTED: WX; `engine/visualAssets.ts`; `engine/isoGrid.ts` on #639; `engine/ambientOcclusion.ts` on #730  
RECOMMENDED_ACTION: New modules + tests. WX at most: pass resolver into `DrawCombatantOptions` and the player site. Import #639 helpers after that PR; until then call live `gridToScreen` results. Union overlapping files.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-017 / VAL-2026-09-28-001  
DEPENDENCIES: VAL-2026-08-31-017; VAL-2026-09-28-001; VAL-2026-09-28-005; VAL-2026-09-29-005  
REGRESSION_RISK: HIGH if VAL pastes a private `gridToScreen` that ignores desktop `cam=0` or duplicates `isoTileTopVertexRounded`.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` on the implementation PR. Empty library pixels identical. Phone Continue: PNG and chess share the diamond.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Iso-preview overlap uses neighbor pitch plus AO 8px edge — warn before MAX_WIDTH 80  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Desktop half-tile `(40, 20)` ≈ 44.7 CSS px (WX 3785–3786). AO shade is an **8px** gradient on the diamond edge (WX 7564–7568). `MAX_WIDTH` 80 is the home tile. A 48-wide centered sprite already crosses the 40 px half-width **and** the AO band. Occupancy stays one tile (`occupancy.ts` 84–96). Hit stays 80×41 + pad 10/14. VAL-2026-09-28-009 froze neighbor pitch; it did not mention the 8px AO band.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; upload warnings  
RECOMMENDED_ACTION: Preview two adjacent 80×40 diamonds with 24×24 vs 48×48 vs 80-wide art, AO on the floor. Warn visual overlap at width &gt; 40, and note AO-edge coverage. Do not change occupancy, range, or hit `h`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-28-009  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-008; VAL-2026-09-28-009; VAL-2026-09-29-005  
REGRESSION_RISK: MEDIUM if owners ship 48-wide art that covers the neighbor name label and testers only checked MAX_WIDTH.  
VALIDATION_REQUIRED: Preview of a 48-wide PNG shows neighbor-overlap (and AO coverage) warning; 24×24 does not. Clicks still 80×41 + pad 10/14.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: ELITE_ONLY stays ineligible — Wave-11 elite docs (#752) are not a live flag  
CATEGORY: assignment-architecture  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: No `isElite` in `src/`. `elite_patrol` is `worldFeatures.ts` 44 / 454. Squash max is **1.5** (`spawnPolicy.ts` 241–248, tests 172–183) → elite rec **36**, not 34. Open PR [#752](https://github.com/Mr-Melic/stralt/pull/752) is design-only. Inferring elite from `scaleY >= 1.4`, `iron_golem`, or HP would restyle ordinary overworld packs.  
SYSTEMS_AFFECTED: pool eligibility; `enemy_elite` profile (metadata only)  
RECOMMENDED_ACTION: Keep `ELITE_ONLY` out of weighted pools until an explicit instance flag exists. Do not implement elite from #752 sheets in this library. Recommended elite box stays 36×36 visual-only, occupancy one tile.  
AUTONOMY: SCOPE_GUARD  
DEPENDENCIES: VAL-2026-08-31-019; VAL-2026-09-01-008; VAL-2026-09-26-001  
REGRESSION_RISK: HIGH if squash 1.5 units start pulling elite art and occupancy is assumed larger.  
VALIDATION_REQUIRED: Empty library: tall squash enemies still chess pixels. An `ELITE_ONLY` asset in a standard pool never binds.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Walk Animation Frames still imply cycles — #724 https facing copy is not walk support  
CATEGORY: scope  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `AdminDashboard.tsx` 1588–1620 “Walk Animation Frames” has no stored-not-rendered disclaimer. Character catalog note at 1783–1786 is honest for **facing URLs** only. #724 `visualUploadRequirementsBeforeSelect("sprite")` says four facing hosted URLs, https only — stills, not a GIF atlas. Combat never samples `walkFrames*` (`VAL-2026-08-31-018`). v1 is four stills matching `ViewDirection`.  
SYSTEMS_AFFECTED: admin Sprite panel copy; combat animation (do not add)  
RECOMMENDED_ACTION: Honesty line on walk-frame sections (stored, not rendered). Do not implement walk cycles to make the heading true. Do not treat #724 sprite sentence as animation support.  
AUTONOMY: DOCUMENT_IN_ADMIN — copy only; no RAF walk sampler  
DEPENDENCIES: VAL-2026-08-31-018; VAL-2026-09-29-001  
REGRESSION_RISK: MEDIUM if a hunter adds GIF/`drawImage` atlas sampling in rAF.  
VALIDATION_REQUIRED: Walk-frame UI states unused. Combat player/enemy stills only. Empty library unchanged.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Set imageSmoothingEnabled false after every rAF setTransform when drawing bitmaps  
CATEGORY: renderer  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: CSS `canvas { image-rendering: pixelated }` (`index.css` 652–655) is display-time. `ctx.imageSmoothingEnabled` is never set. Every frame `setTransform` + `scale(dpr)` (WX 7263–7264) resets 2D state. `canvas.width=` (7256–7261) also resets it. VAL-2026-09-23-004 / VAL-2026-09-28-011 said to cache ImageBitmap; they did not freeze that smoothing must be re-applied **on the shaken ctx** immediately before `drawImage`, not once at module init.  
SYSTEMS_AFFECTED: custom `drawImage` branch; WX rAF (do not “fix” chess `fillRect` path in VAL)  
RECOMMENDED_ACTION: When the optional bitmap branch runs, `ctx.imageSmoothingEnabled = false` on that same ctx after scale/shake. Nearest-neighbor only. Do not change the empty-library fillRect path. Cache bitmaps by `ASSET_ID`+`VERSION`; resize is not a pool re-roll.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-28-011  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-23-004; VAL-2026-09-28-003; VAL-2026-09-28-011  
REGRESSION_RISK: MEDIUM if bilinear smoothing turns 24×24 PNGs mushy on 140×70 tiles; HIGH if decode runs inside rAF after every resize.  
VALIDATION_REQUIRED: Bound 24×24 PNG stays crisp after window resize and after a hit-shake. Empty library fillRect unchanged. Same `visualAssetId` across 100 frames.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-29-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355–#715  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355, #418, #461, #520, #586, #624, #694, **#715**. This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings or #724 TS. Rewriting `ACTION_IDS_VAL_2026-09-28.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-09-29.md`, `docs/automation/ACTION_IDS_VAL_2026-09-29.md` only  
RECOMMENDED_ACTION: Keep these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers with #724 / #639 / #631 / #730.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  

---

*End of 2026-09-29 ACTION_IDs. Production code not modified.*
