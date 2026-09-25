# ACTION_IDs — 2026-09-25 Visual Asset Library & Assignment Designer

Durable ledger for implementers.  
Source of every record: Visual Asset Library & Assignment Designer (cron `0 */48 * * *`).  
Design contract: [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-25.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-25.md).  
HEAD inspected: `0f5363f`. Gameplay / production code was not modified.

Prior IDs (do **not** re-issue):

- `VAL-2026-08-31-001` … `019` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (merged design PR #121).
- `VAL-2026-09-01-001` … `011` in [`ACTION_IDS_VAL_2026-09-01.md`](./ACTION_IDS_VAL_2026-09-01.md). **001 IMPLEMENTED (copy only).**
- `VAL-2026-09-02-001` … `012` in [`ACTION_IDS_VAL_2026-09-02.md`](./ACTION_IDS_VAL_2026-09-02.md).
- `VAL-2026-09-21-001` … `014` in PR [#355](https://github.com/Mr-Melic/stralt/pull/355) (open, not on main).
- `VAL-2026-09-22-001` … `012` in PR [#418](https://github.com/Mr-Melic/stralt/pull/418) (open, not on main).
- `VAL-2026-09-23-001` … `012` in PR [#461](https://github.com/Mr-Melic/stralt/pull/461) (open, not on main).
- `VAL-2026-09-24-001` … `012` in PR [#520](https://github.com/Mr-Melic/stralt/pull/520) (open, not on main).

This run does **not** re-issue those IDs. Do not implement from this file unless a later human or orchestrator explicitly picks an ID.

---

## Prior IDs — status 2026-09-25

| ID | Status 2026-09-25 |
| :--- | :--- |
| VAL-2026-09-01-001 | **IMPLEMENTED** — `adminVisualStatus.ts` |
| All other VAL-* | **NEW** — still zero `drawImage` / `createImageBitmap` in `src/`; no `engine/visualAssets.ts` |
| VAL-2026-09-21-007 | Superseded for boss keying by VAL-2026-09-22-002 (do not use `isBoss&&bossId` as the live portal path) |

---

ACTION_ID: VAL-2026-09-25-001  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Reaffirm empty-library identity on 0f5363f — still no drawImage anywhere in src/  
CATEGORY: fallback-invariant  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` (same SHA as 09-21…09-24). `rg drawImage\|createImageBitmap src` hits only the comment in `adminVisualStatus.ts` 5. WX 19213 lines. Combat paint remains `fillRect` 3px cells (`WorldExploration.tsx` 3841–3886, `pieceArt.ts` 753–782). `engine/visualAssets.ts` absent. VAL-2026-09-01-001 is still the only implemented VAL id.  
SYSTEMS_AFFECTED: none until an implementer is assigned; documents the identity test  
RECOMMENDED_ACTION: Keep empty-library == today’s generated pixels as the release gate. Do not wire `spriteUrl` / `frontUrl` into combat to “make the admin fields true.”  
AUTONOMY: DOCUMENT_ONLY unless an orchestrator assigns implementation  
DEPENDENCIES: none  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: `rg` still zero `drawImage` in `src/` after any VAL work that claims “not started.” Empty library screenshot-identical to chess/summon/portal-boss/Rush.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-002  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Version-gate wipe destroys any localStorage visual cache — canister is the only durable store  
CATEGORY: persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `App.tsx` 297–318: on `APP_VERSION` change, `collectPreservedLocalStorage` then `localStorage.clear()`. `utils/versionGate.ts` 7–12 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and keys ending `_inventory`. A `pbv_visual_*` or `nsKey('visual')` cache would be deleted on every version bump while the player is forced to re-login. `AGENTS.md` already requires backend-authoritative persistence.  
SYSTEMS_AFFECTED: `engine/visualAssets.ts` (new), canister visual maps, `versionGate.ts` (do **not** add visual keys as the source of truth)  
RECOMMENDED_ACTION: Store metadata + blob refs on the canister behind `#admin`. Treat any localStorage as a disposable decode cache. Do not add visual keys to `shouldPreserveVersionGateKey` as a substitute for a canister. After wipe, re-hydrate from the actor; empty canister == builtin pixels.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-002 / VAL-2026-09-21-008 (EOP later file)  
DEPENDENCIES: VAL-2026-08-31-002; VAL-2026-08-31-014; VAL-2026-09-21-008; VAL-2026-09-24-005  
REGRESSION_RISK: HIGH if implementers cache assignments only in localStorage — owners lose the library on the next APP_VERSION.  
VALIDATION_REQUIRED: Assign one asset, bump a fake APP_VERSION in a test harness (or clear non-preserved keys the same way), reload: assignment still resolves from the actor; builtin fallback if the actor is empty.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-003  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Do not route custom player art through CharacterCreation’s hardcoded 8-cell centering  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `CharacterCreation.tsx` 151–178: `scale = 10`, `offsetX = (ctx.canvas.width - 8 * scale) / 2`, nested loops `y < 8` / `x < 8`, canvas backing 320×280 / CSS 240×210 (452–465). A 24×24 or 48×48 PNG cannot be painted by that loop. Character selection is slightly more flexible (`pattern[0].length`, `CharacterSelection.tsx` 333–337) but still `fillRect` cells, not `drawImage`. Portrait HUD is 60×60 × 6px cells (WX 3720, 18111–18116).  
SYSTEMS_AFFECTED: CharacterCreation, CharacterSelection, portrait canvas — **leave generated**; world player call site WX 8315–8326 only  
RECOMMENDED_ACTION: v1 custom player stills apply only on the world canvas (and admin iso preview). Keep creation / selection / portrait on chess `fillRect`. Do not generalize the `8 * scale` math as an upload spec.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-23-007 / VAL-2026-09-24-004  
DEPENDENCIES: VAL-2026-08-31-011; VAL-2026-09-01-007  
REGRESSION_RISK: MEDIUM if creation canvas is forced to drawImage — 8-cell layout and color pickers break.  
VALIDATION_REQUIRED: Create a king with colors; world shows chess pixels when the library is empty; a bound player PNG never appears on the 320×280 creation canvas in v1.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-004  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Admin PlayerSpriteConfig pieceType "custom" is not a combat visual category  
CATEGORY: assignment  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `AdminDashboard.tsx` 1250–1258 `PIECE_TYPES` includes `"custom"`. Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11). `getPersistedPiecePattern` unknown ids → `king.front` (`pieceArt.ts` 653–658). Do not confuse this with `LEGACY_MODIFIER_TYPES` `"custom"` at AdminDashboard 4950 (map modifiers, labeled “no engine hook”).  
SYSTEMS_AFFECTED: Visual Library assignment UI; must not key ENTITY_IDS off admin `"custom"`  
RECOMMENDED_ACTION: ENTITY_CATEGORY `#player` keys off chess `pieceType` + `playerView` stills. Ignore admin `"custom"` until the live Character union grows (out of scope).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-010  
DEPENDENCIES: VAL-2026-09-23-007  
REGRESSION_RISK: MEDIUM if pools include `"custom"` and never match a spawned character.  
VALIDATION_REQUIRED: Admin sprite row with pieceType custom does not auto-bind world player art.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-005  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Shop proofFileUrl data: PNG path is not the combat upload pipeline  
CATEGORY: upload-validation  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `adminGuard.mo` `proofDataMimeAllowed` 109–116 and `validateProofFileUrl` 118–130 allow `data:image/png` (and jpeg/pdf/octet-stream) up to **524_288** bytes for GameKey proof. Combat/ad URL stubs use `unsafeUrl` 89–94 which **rejects** `data:`. `MAX_URL` 2048 / `MAX_JSON_BLOB` 32768 cannot hold a PNG. `ExternalBlob` (`backend.ts` 54–55) is bindgen plumbing, not a visual type.  
SYSTEMS_AFFECTED: new admin Visual Library upload; must not call `validateProofFileUrl` or `window.open` a combat asset  
RECOMMENDED_ACTION: Combat upload = file picker → decode → object-store / ExternalBlob ref. Never persist combat art as a `data:` URL. Never reuse the proof MIME allow-list as “image validation” (it allows PDF).  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-003 / VAL-2026-08-31-014 / VAL-2026-09-22-007 / VAL-2026-09-24-005  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-09-21-009  
REGRESSION_RISK: HIGH if proof `data:` lands in combat `drawImage` (XSS / huge strings / Motoko trap).  
VALIDATION_REQUIRED: Uploading a PNG for VAL does not write `proofFileUrl`. Pasting `data:image/png;base64,…` into a combat field is rejected. Decode tests use Blob, not a hosted https `spriteUrl`.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-006  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Preview viewport bands are phone / tablet / desktop — MOBILE_ZOOM is only below 768  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `useIsMobile(breakpoint = 768)` (`hooks/use-mobile.tsx` 17–26) gates WX `MOBILE_ZOOM = 1.75` (957–959) → tiles 140×70. `isDesktop` is `innerWidth > 1024` (WX 877) and locks camera. Band **768–1024**: tiles **80×40** (no zoom) + camera **follow**. `SmallScreenGuard` copy (`App.tsx` 109–136) already says tablets 768+ are supported; Continue is only for &lt;768. 09-02 preview asked for 80×40 and 140×70 panes; it did not name the tablet band.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts` (new)  
RECOMMENDED_ACTION: Iso preview: desktop 80×40 locked-camera dummy, phone 140×70 zoom dummy, optional tablet note (“same diamond as desktop, camera follows”). Do not apply 1.75 to bitmaps. Do not treat 768–1024 as the phone pane.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009 / VAL-2026-09-02-001  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004  
REGRESSION_RISK: MEDIUM if implementers scale custom art with any innerWidth &lt; 1024.  
VALIDATION_REQUIRED: Continue on 390px-wide viewport; custom 24×24 matches chess 24×24. At 900px-wide, tiles are 80×40 and custom art is still 24×24.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-007  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Bind visuals at overworld spawn — the first three battle rAF frames draw nothing  
CATEGORY: stable-assignment  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 7238–7245: while `inBattleRef` and `battleInitFrameRef < 3`, `render` returns without drawing (skips the first 3 frames after battle start so setState can settle). `battleInitFrameRef` is reset to 0 at battle start (comment 7248). If decode or pool pick is kicked only from “first battle frame,” it never runs during those skips and must not `Math.random` when drawing resumes.  
SYSTEMS_AFFECTED: `generateEnemies` / boss portal spawn / `summonSpawn.ts` 153 / `engine/visualAssets.ts`  
RECOMMENDED_ACTION: Resolve `visualAssetId` when the Enemy (or summon) object is created. Prefetch `ImageBitmap` off the rAF thread. Resolver in `drawCombatant` only reads the bound id.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-005  
DEPENDENCIES: VAL-2026-08-31-005; VAL-2026-09-23-002  
REGRESSION_RISK: MEDIUM if bind is deferred to battle start — appearance could change after the 3-frame skip or on React Strict Mode remount.  
VALIDATION_REQUIRED: Spawn with a pool of two assets; enter battle; appearance matches overworld and does not change after frame 3.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-008  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: WX nsKey user+slot localStorage is not a visual library  
CATEGORY: persistence  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 866–872: `nsKey(base) => `${userId}_slot${characterSlot}_${base}``. Used for per-character client cache. Version-gate wipe (see 002) does not preserve these keys unless they end `_inventory`. Putting `visualAssetId` in `nsKey('visual')` would bind art to a save slot, survive map changes incorrectly, and die on APP_VERSION.  
SYSTEMS_AFFECTED: WorldExploration `nsKey`; must stay unrelated to VAL  
RECOMMENDED_ACTION: Instance bind is an in-memory field on `combatantsRef` Enemy (and a player-side stills map keyed by `pieceType`+view). Canister holds the library. Do not add `nsKey('visualAsset')`.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-23-002 / VAL-2026-09-24-004  
DEPENDENCIES: VAL-2026-09-25-002  
REGRESSION_RISK: MEDIUM if slot cache leaks a bound id onto the next map’s new roster.  
VALIDATION_REQUIRED: Two characters / two slots; assigning art on slot 1 does not change slot 2; map transition rebinds from spawn, not from nsKey.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-009  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: If sprite-first hit testing is extracted (#427), VAL must consume that helper — do not grow a second spriteRectsRef  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open PR [#427](https://github.com/Mr-Melic/stralt/pull/427) (`cursor/bc-c9e11b6d-25b0-46ed-98b3-f1c60c408558-9920`, created 2026-09-22) extracts sprite-first hit testing from WorldExploration. Live tree still has `spriteRectsRef` + `hitTestSprite` in WX (965–989, 8885–8918) with registered **80×41** desktop and padding 10/14. VAL-2026-09-22-004 / 010 already forbid growing hit boxes from bitmaps. A VAL implementation that copies rect recording into `visualAssets.ts` will duplicate-export or diverge after #427 merges.  
SYSTEMS_AFFECTED: WX sprite rects; future `engine/` hit-test module; `engine/visualAssets.ts`  
RECOMMENDED_ACTION: Custom `drawImage` uses the same tile-derived rect writer as pixels. After #427 lands, import that writer. Do not compute click boxes from PNG width/height. Union overlapping files on restack; one implementation per name.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-09-01-003 / VAL-2026-09-22-004  
DEPENDENCIES: VAL-2026-08-31-008; stack-compat with #427  
REGRESSION_RISK: HIGH if two rect maps disagree — clicks miss tall custom art or steal neighbor tiles.  
VALIDATION_REQUIRED: Click center of a custom 24×24 and a chess 24×24 both resolve the unit; padding stays 10/14; `drawSize` still unused by hit-test.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-010  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Iso neighbor pitch is (40,20) ≈ 44.7 px — warn overlap above 40 even though MAX_WIDTH is 80  
CATEGORY: render-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `gridToScreen` (WX 3785–3786): adjacent tile Δ = `(effectiveTileW/2, effectiveTileH/2)` = **(40, 20)** desktop, distance √(1600+400) ≈ **44.7**. Two 24×24 sprites (radius 12) fit. Two 48×48 (radius 24) already overlap. `MAX_WIDTH` 80 is the diamond width (`TILE_WIDTH`), not neighbor-safe. Occupancy remains one tile (`occupancy.ts` 84–96). Spawn spacing Chebyshev ≥ 4 (`spawnPolicy.ts` 9–12) is overworld-only; combatants stand adjacent in battle.  
SYSTEMS_AFFECTED: `engine/visualPreview.ts`; upload spec copy shown before file pick  
RECOMMENDED_ACTION: Keep MAX 80 as the hard reject (tile width). Preview **warns** when width or height &gt; 40 desktop (or &gt; 70 on the 140×70 phone pane). Do not enlarge occupancy. Do not shrink MAX to 40 without a human decision — that would reject a full-diamond splash that owners may want with a warning.  
AUTONOMY: IMPLEMENT_WITH VAL-2026-08-31-009  
DEPENDENCIES: VAL-2026-08-31-003; VAL-2026-08-31-004; VAL-2026-08-31-008  
REGRESSION_RISK: LOW for gameplay; MEDIUM for readability if 80-wide art ships without the warning.  
VALIDATION_REQUIRED: Preview of a 48×48 PNG shows an overlap warning against a dummy neighbor at (40,20). A 24×24 PNG does not. Combat occupancy still one tile.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-011  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Freeze 09-25 measured RENDER_PROFILES — pixel boxes unchanged; citations moved  
CATEGORY: render-contract  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Re-measured on `0f5363f`: tile 80×40, cell 3px, draw point +9, standard 24×24, portal live ≈34×34, tables 8×12×1.4 unused, Rush 24×24, hit 80×41, wall 28, whirlpool r=25, portrait 60×60/6px, creation 8×10 on 320×280, WX 19213. Same boxes as 09-24; line numbers for player draw 8315–8326, boss spawn 6524–6568, `seededRng` `combatMath.ts` 122–128.  
SYSTEMS_AFFECTED: upload spec UI, `visualPreview.ts`  
RECOMMENDED_ACTION: Use the tables in `VISUAL_ASSET_LIBRARY_DESIGN_2026-09-25.md` §4. Do not invent 64/128/512. Do not take dimensions from context-restore `innerWidth` or the false “match tile dimensions” comment (WX 3840).  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: VAL-2026-08-31-004; VAL-2026-09-22-011; VAL-2026-09-24-009  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Spec sheet shown before file pick matches §4.2.  
STATUS: NEW  

---

ACTION_ID: VAL-2026-09-25-012  
SOURCE_AUTOMATION: Visual Asset Library & Assignment Designer  
TITLE: Stack this docs PR as new dated files — do not rewrite #355 / #418 / #461 / #520 VAL docs  
CATEGORY: process  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Oldest-first merge (`docs/automation/OPEN_PR_STACK_COMPAT.md`). Open VAL docs: #355 (09-21), #418 (09-22), #461 (09-23), #520 (09-24). This tree only had 08-31…09-02 on `origin/main`. Unique dated filenames do not overlap those siblings. Rewriting `ACTION_IDS_VAL_2026-09-24.md` would conflict.  
SYSTEMS_AFFECTED: `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-09-25.md`, `docs/automation/ACTION_IDS_VAL_2026-09-25.md` only  
RECOMMENDED_ACTION: Add these two files. Do not edit prior VAL markdown. Run `bash scripts/open-pr-stack-compat.sh --self`. Union ≠ concatenate if a future implementation PR touches overlapping TS.  
AUTONOMY: DOCUMENT_ONLY  
DEPENDENCIES: none  
REGRESSION_RISK: LOW for this docs PR; HIGH for an implementation PR that concatenates helpers.  
VALIDATION_REQUIRED: `bash scripts/open-pr-stack-compat.sh --self` exit 0. `git diff origin/main --name-only` is only the two new dated files.  
STATUS: NEW  
