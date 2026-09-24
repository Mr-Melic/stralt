# Custom Visual Asset Library & Assignment — 2026-09-24 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-24  
**HEAD:** `0f5363f` (`Merge pull request #332`) — **same SHA** as 2026-09-21, 2026-09-22, and 2026-09-23  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs on `main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md)  
**Prior designs not on `main` (older open drafts):** [PR #355](https://github.com/Mr-Melic/stralt/pull/355) (09-21), [PR #418](https://github.com/Mr-Melic/stralt/pull/418) (09-22), [PR #461](https://github.com/Mr-Melic/stralt/pull/461) (09-23)  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-24.md`](./ACTION_IDS_VAL_2026-09-24.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer. Invented sprite boxes (64×64, 128×128 as recommended) are not used. Pixel boxes did not change. This run adds **lifecycle and assignment-surface** facts the 09-23 ledger did not encode as ACTION_IDs.

---

## 0. Verdict

| Question | 2026-09-24 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage`, **zero** `createImageBitmap`, **zero** `imageSmoothingEnabled`. |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, standard 24×24. Portal **live** boss is chess 8×8 × 1.4 ≈ **34×34**. Boss **tables** 8×12 × 1.4 ≈ 34×50 are unused on the live Enemy. Rush paints `king.front` 24×24. |
| Did HEAD move since 09-23? | **No.** Still `0f5363f`. VAL-2026-09-01-001 (admin URL honesty) is still the only implemented VAL id. |
| New facts this run? | (1) The **rAF body** itself can assign `canvas.width` (not only ResizeObserver). (2) Every frame `setTransform`+`scale(dpr)` **resets** Canvas2D state, including smoothing. (3) The **player is not in `combatantsRef`**. (4) Motoko text caps cannot hold PNG bytes. (5) Palettes must not recolor bitmaps. (6) Moving-enemy `save` wraps draw. (7) `family: "boss"` is not in `EnemyFamily`. (8) `contextlost` sizes from `window.innerWidth`. (9) InitiativeStrip icon regex is not a catalog. (10) Walls are 28px tall for clip preview. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load those queries.

Do **not** “fix” `drawCombatant` to treat `id.startsWith("boss_")` or `family === "boss"` as the 8×12 branch as part of this library (`VAL-2026-09-22-002` / `003`). That would change live portal pixels.

---

## 1. Delta vs 2026-09-23

09-23 already corrected live-vs-table boss paint, `combatantsRef` bind, CSS vs `imageSmoothingEnabled`, `pointerToRenderSpace` CSS pixels, ImageBitmap vs ctx-bound patterns, admin React Query ≠ combat, `getPersistedPiecePattern`, and Rush/summon omitted `scaleX/Y`. Those IDs stay **NEW** and are **not** re-issued.

| Topic | 09-23 | 09-24 (this tree, same SHA, new ACTION_IDs) |
| :--- | :--- | :--- |
| `canvas.width=` | ResizeObserver `applySize` (WX 13956) + comment 13972 | **Also the rAF body** (WX **7256–7261**) when backing store ≠ `floor(css * dpr)` |
| Smoothing | Set `imageSmoothingEnabled = false` in the custom branch | Must run **after** the per-frame `ctx.setTransform` + `ctx.scale(dpr)` (7263–7264), which **resets** ctx state. A one-shot at loop start is wiped. |
| Bind target | `visualAssetId` on `combatantsRef` Enemy | **Player is a second site** (WX 8289–8326). `combatantsRef` is `useRef<Enemy[]>` (1640). Player is never an entry. |
| Bytes | Object storage, not `spriteUrl` | **Measured caps:** `MAX_URL = 2048`, `MAX_JSON_BLOB = 32_768`, `unsafeUrl` rejects `data:` (`adminGuard.mo` 9–10, 89–95, 143–148). Shop `proofFileUrl` 524_288 is **not** a combat budget. |
| Color | fillRect palettes | Custom PNG must **ignore** `Character.colors`, `chessPiecePalettes`, `creaturePalettes`, `getEnemyFamilyColors` |
| Motion FX | shake translate (7265–7267) | Moving enemies also `ctx.save` + `globalAlpha` + red shadow **around** `drawCombatant` (8057–8076). Custom art must stay inside that save. |
| `family: "boss"` | not a draw branch | Also **not** in `EnemyFamily` (`gameTypes.ts` 12–20). Portal writes `family: "boss"` (WX 6568) as a **string**, not a union member. |
| Context restore | ImageBitmap survives resize | `handleContextRestored` sets size from **`window.innerWidth/Height`** (13830–13836), not `canvasSize`. Do not derive upload specs from that. |
| Name heuristics | Enemy Register is flavor | InitiativeStrip `ENEMY_ICONS` regex (`InitiativeStrip.tsx` 65–80) maps names → emoji. **Not** a visual catalog. |
| Walls | occupancy one tile | Iso walls use `wallHeight = 28` (WX 4085). Preview must warn when art collides with the prism. |
| Open VAL docs | #355, #418 | **#461** (09-23) is now also older in the merge queue. This run uses **new dated filenames only**. |

WX remains **19213** lines. `combatantStore.ts` remains **603**. `spawnPolicy.ts` remains **297**. `enemyPixelPatterns.ts` remains **522**. Admin deny is now `AdminDashboard.tsx` **5546** (`if (!isAdmin)`).

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3855–3861); trailing `ctx.restore()` with **no matching save** (3883) |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (761–780); explicitly **does not** save/restore (747–751) |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023 |
| `engine/enemyPixelPatterns.ts` | Boss 8×12 tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12`; family 434–498 |
| WX player | `getPersistedPiecePattern(pieceType, playerView)` | 8289, 8315–8326 — **not** `drawCombatant`; **no scale arg** → default `{x:1,y:1}` |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3719–3724, 18111–18115 |
| Character creation | 8×8 × `scale = 10` → **80×80** art; canvas **320×280** backing, CSS **240×210** | `CharacterCreation.tsx` 151–153, 454–463 |
| Character selection | `pixelSize = floor(internalSize / 10)` | `CharacterSelection.tsx` 333 |
| Death juice | `fillRect` fragments | `engine/effects.ts` 282–292 |

`getPersistedPiecePattern` (`pieceArt.ts` 653–658) is pieceType → grid. Comment: “Never treat sprite URLs as required.” `Character.pixelPattern` is persisted (`CharacterCreation.tsx` 273) and **unused** in WorldExploration.

Repo-wide: no `ctx.drawImage`, no `createImageBitmap`, no `imageSmoothingEnabled`. There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, **source === runtime**.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects pattern resolvers + `drawPattern` + `characterYOffset`. It does **not** accept a bitmap. A custom path must be a new optional top branch, not `drawImage` inside `drawPixelPattern` (that function only `fillRect`s cells, then pops a canvas save).

### 2.2 Draw source of truth is `combatantsRef` — player is not in it

WX comments at 1638–1640: `combatantsRef` is the single source of truth; `enemiesRef` / `battleEnemiesRef` / `turnOrderRef` are mirrors.

Enemy / summon / portal-boss / Rush units paint from `combatantsRef.current[renderItem.idx]` (WX 8030) passed into `drawCombatant`.

The **player** is a separate `kind === 'player'` branch (8283–8326). There is no `id: "player"` Enemy in `combatantsRef`. Player custom stills cannot be stored as `Enemy.visualAssetId` (`VAL-2026-09-23-002`). Bind player art by chess `pieceType` + `playerView` (see `VAL-2026-09-23-007`).

`toCombatantEntry` (`combatantStore.ts` 141–169) copies a **fixed** field list and strips extras when rebuilding the strip. `updateCombatant` (413–425) spreads `patch` onto **both** combatants and turn-order. `addCombatant` (284–318) appends the live Enemy then builds a strip entry via `toCombatantEntry`. `deriveBattleEnemies` (505–507) **filters** `combatantsRef` and keeps the full Enemy object. `syncCombatants` (464+) replaces the whole array — callers must not map a list that drops `visualAssetId`. `resetCombatantStore` (527+) clears the set; re-bind after the next spawn.

### 2.3 Two boss shapes — do not merge them

| Path | Flags on the **drawn** object | Pattern actually painted |
| :--- | :--- | :--- |
| **Portal boss** (WX 6523–6569) | **No** `isBoss`, **no** `bossId`. `id` `boss_${id}_${Date.now()}`, `family: "boss"` (string), `scaleX/Y = 1.4`, chess `pieceType` from config | Branch 4 chess 8×8 × **1.4** ≈ **33.6×33.6** (ceil **34×34**) |
| **Boss Rush** (WX 5321–5346, 5340 `isBoss: true`) | `isBoss: true`, **no** `bossId`, `pieceType` is `roomDef.boss1Name` (lore), **no** `scaleX/Y` | Branch 1 requires `isBoss && bossId` — fails. Lore `pieceType` is not a `CreatureKey` → `king.front` **24×24** at scale default **1** |
| **8×12 tables** | `getBossPixelPattern` (`enemyPixelPatterns.ts` 430–432) | Only if `entity.isBoss && entity.bossId` (`pieceArt.ts` 856). **No live spawn sets both on the Enemy.** |
| Battle `CombatantEntry` | Portal: `isBoss` / `bossId` from `id.startsWith("boss_")` (WX 11958–11983) | Strip only. **Draw does not read turnOrder.** |

`EnemyFamily` (`gameTypes.ts` 12–20) is `wraith_bishop` … `default`. It does **not** include `"boss"`. `getEnemyFamilyPixelPattern` (`enemyPixelPatterns.ts` 500–504) indexes that record and falls back to `default` (3×3). Portal `family: "boss"` is a **string** on `Enemy.family` (`gameTypes.ts` 305). Do not treat it as `BOSS_ONLY` / `boss_large` eligibility.

Do not set `isBoss`/`bossId` on portal Enemies, and do not retarget `drawCombatant` to `id.startsWith("boss_")`, as part of shipping the library (`VAL-2026-09-22-003`).

### 2.4 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text (`AdminDashboard.tsx` 816–830) | **No.** WX has zero `getEnemyConfigs` / `spriteUrl`. |
| `useGetEnemyConfigs` | Admin React Query (`useSpellQueries.ts` 111+) | Catalog I/O only. Success ≠ `VALIDATION_STATUS = #ok`. |
| `PlayerSpriteConfig` direction + walk-frame URL arrays | Canister + Sprite panel | **No.** WX has zero `getPlayerSpriteConfigs`. Preview is 72×72 `<img object-fit:contain>` (1484–1507). |
| Login ad boxes | `adminSetAdBox` URL strings | Landing `<img>` — **not combat**. |

`adminGuard.validateOptionalUrl` (143–148): empty OK, `MAX_URL = 2048` (line 10), `unsafeUrl` rejects `javascript:` / `data:` / `vbscript:` / **`file:`** (89–95). **No MIME, decode, dimensions, alpha, or render-safe bounds.**

`validateJsonBlob` uses `MAX_JSON_BLOB = 32_768` (line 9, 155–163). A PNG cannot live in those Text fields. `validateProofFileUrl` allows `data:image/png` up to **524_288** (118–128) for **shop proofs only**. Do not reuse that cap or `proofDataMimeAllowed` as combat validation.

Caffeine `ExternalBlob` is bindgen plumbing (`backend.ts` 54–55). No visual-asset blob type exists. Decode from `Blob` / `ExternalBlob`, never `drawImage(https spriteUrl)`.

Walk Animation Frames (`AdminDashboard.tsx` 1588–1614) still imply cycles. Combat never samples those arrays. v1 is four stills (`VAL-2026-08-31-018`).

### 2.5 Entity categories that actually exist

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | Not in `combatantsRef`. Chess `pieceType` + 4-way `playerView` | 8×8 `chessPiecePatterns` via `getPersistedPiecePattern`. Scale **1**. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\`` (WX 5767), random chess `pieceType`, `family` starts `"default"` | `drawCombatant` branch 4 × instance squash 0.6–1.4 |
| **ELITE / LARGE ENEMY** | **No type.** `elite_patrol` is a world-feature catalog key (`worldFeatures.ts` 44, 454). `iron_golem` is family HP paper. | Same chess path. `ELITE_ONLY` assets stay **ineligible** until a real `isElite` flag. |
| **BOSS** | Three mismatched shapes (portal / Rush / unused 8×12). See §2.3. | Live portal **34×34**; Rush **24×24**; tables unused |
| **SUMMON** | `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` 153). **Omits** `scaleX/Y`. | 8×8 `creaturePatterns` + `strokeOwnerTint` (`pieceArt.ts` 791–810, 923–926). Scale default **1**. |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use family grids (`pieceArt.ts` 932–958) |
| **Future** | Portals (whirlpool **radius 25**, WX 3898), hazards, loot, walls (`wallHeight = 28` at 4085), ads, barrier towers | Not `drawCombatant`. Ineligible in v1. |

Family 30% (`spawnPolicy.ts` `FAMILY_VARIANT_CHANCE = 0.3`, `maybeApplyEnemyFamilyVariant` 279–287) changes **stats**, not the default draw path. Family grids exist (434–498) but are unused for those 30% units:

| Family | Cells (cols × rows) | Drawn @ scale 1 (×3) |
| :--- | ---: | ---: |
| wraith_bishop | 3 × 8 | 9 × 24 |
| iron_golem | 6 × 5 | 18 × 15 |
| plague_rat | 6 × 5 | 18 × 15 |
| ember_knight | 5 × 8 | 15 × 24 |
| tide_shade | 7 × 4 | 21 × 12 |
| bone_scribe | 5 × 8 | 15 × 24 |
| void_mirror | 6 × 6 | 18 × 18 |
| default | 3 × 3 | 9 × 9 |

Do not publish those as the STANDARD ENEMY upload spec (`VAL-2026-09-21-003`).

Admin `PlayerSpriteConfig.characterPieceType` includes `"custom"` (`AdminDashboard.tsx` 1250–1258). Live `ChessPieceType` (`gameTypes.ts` 5–11) has no `custom`.

Enemy Register (`enemyRegisterCopy.ts` 6–15) is **flavor lore**, not a spawn or visual catalog.

### 2.6 Occupancy, hit-testing, pointer space — visual size ≠ gameplay footprint

`engine/occupancy.ts` 84–96: one combatant per logical tile. No width/height.

Sprite rects are a **fixed tile-derived box** (WX 8086–8104, 8335–8353):

```
drawSize stored = { w: effectiveTileW, h: effectiveTileH * 1.5 }
  desktop: 80 × 60
tested rect uses x,y,w,h:
  h = effectiveTileH/2 + CHARACTER_Y_OFFSET + (effectiveTileH*1.5)/2
  desktop: 20 + (−9) + 30 = 41
drawAnchor = (tileTopX, tileTopY − CHARACTER_Y_OFFSET) = (tileTopX, tileTopY + 9)
padding: mouse 10 (WX 10127), touch 14 (10819)
```

`hitTestSprite` (8885–8916) tests `entry.x/y/w/h`, **not** `drawSize`. Custom art must never change occupancy, movement, range, targeting, or those rects.

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` (WX 8033–8054). Independent of pattern size.

`pointerToRenderSpace` (8994–9004) uses `canvasSize` (CSS), **not** `canvas.width`. `drawImage` dest rects must be CSS pixels. Do not multiply by `dpr` or `MOBILE_ZOOM`.

`debug/clickTrace.ts` is DEV-gated. Tall custom art can look like a “miss” in traces while occupancy stays one cell. Do not grow hit boxes. Do not dump `blob:` URLs into the overlay.

### 2.7 Canvas lifecycle — rAF, transform reset, context lost

Every mapped frame (WX 7250–7267):

1. If `canvas.width !== floor(cssW * dpr)` → **`canvas.width = …` (7256–7261)**. This **clears the 2D context**.
2. `ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr)` (7263–7264). This **resets** `imageSmoothingEnabled` to the Canvas2D default (**true**).
3. `ctx.save(); ctx.translate(shake)` (7265–7267).

ResizeObserver `applySize` also assigns `canvas.width` (13956) and comments that this must not fire mid-frame (13972–13973).

`handleContextRestored` (13825–13844) sizes from **`window.innerWidth/Height`**, then `canvas.width = round(w * dpr)`. That is **not** a render-profile input.

Consequences for custom art:

- Cache **`ImageBitmap`** keyed by `ASSET_ID`+`VERSION`. Never cache `CanvasPattern` / `getImageData` from the world ctx.
- Set `imageSmoothingEnabled = false` in a **per-draw** `save/restore` **after** the frame transform, not once at loop start.
- Landing `getImageData` (`LandingPage.tsx` 75) is a **temp** canvas for the title effect. Do not copy that onto combat.
- CSS `image-rendering: pixelated` on the world canvas (WX 17890) and global `canvas` (`index.css` 652–655) is **display-time**. It does not disable Canvas2D smoothing during `drawImage`.

`drawPixelPattern`’s unpaired `ctx.restore()` (3883) pops the nearest save (often the shake save or the moving-enemy save). Custom `drawImage` must **not** go through `drawPattern`. Do not “fix” that pairing in the rAF loop (`VAL-2026-09-22-006`).

Moving enemies (8057–8076): `ctx.save(); shadowColor; shadowBlur; globalAlpha = 0.8 + 0.2 * sin(...)`; `drawCombatant`; `ctx.restore()`. Custom bitmaps must remain **inside** that save so the pulse still applies. Do not add a nested restore that pops it early. Do not skip the pulse for custom units.

### 2.8 Stable identity for assignment (no encounter seed)

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors` | pack spawn | `Math.random` then **stored** (`spawnPolicy.ts` 227–255; WX 5768, 5820–5821) |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | stored on `family` |
| Battle stats | `getEnemyBaseStats` | `seededRng` from charCode-sum of `seedKey` (`progression.ts` 163–170; `combatMath.ts` 122–128) |
| Map tiles | generate | `seededRng(seed)` |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`visualAssetId = pickWeighted(seededRng(hash(instanceId, poolId, poolVersion)), eligible)` written **once** at spawn / `addCombatant` / summon / portal / Rush. If the bound id later fails validation, fall back to builtin — **do not re-roll in render**. `turnsRemaining` ticks must not re-pick.

Custom `DEFAULT_SCALE = 1`. Do not inherit instance 0.6–1.4 squash. Do not call `generateEnemyScaleFactors` to “complete” Rush/summon objects that omit scale. Portal builtin chess **does** use fixed 1.4; a 34×34 upload must not also ×1.4.

Player stills: no instance id. Key `pieceType` + optional direction. Missing direction → front → builtin.

### 2.9 Owner / admin gate

- `App.tsx` 291: `isAdmin = userRole === "admin"`.
- `AdminDashboard.tsx` 5546: hard deny if `!isAdmin`.
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- Roles are `"admin"` \| `"user"` (`adminGuard.mo` `validateAssignRole` 174–177). Do not invent a second role.

Library UI is **admin-only**. Players never upload or choose combat art. New canister maps need a **new later** EOP file after `20260901` (`mops.toml` `check-limit = 5`). Never amend a frozen `NewActor`.

### 2.10 Mobile / tablet — Continue is live

`SmallScreenGuard` (`App.tsx` 44, 107–119, 407): overlay with **Continue anyway**; bypass in `sessionStorage` `pbv_small_screen_continue`. After bypass, `useIsMobile` (`hooks/use-mobile.tsx` 17–26, breakpoint 768) applies WX `MOBILE_ZOOM = 1.75` (957–959) → tiles **140×70** while `drawPixelPattern` keeps `pixelSize = 3`. Builtin 24×24 is relatively smaller on zoomed tiles. Iso preview must include a 140×70 pane. Do not scale custom bitmaps by `MOBILE_ZOOM`.

---

## 3. Visual fallback invariant

Rendering priority (resolver, **never** in React render / rAF pick):

1. Valid **active** custom visual **specifically assigned** to this entity/variant (bound `visualAssetId` still in the library, `ACTIVE`, `VALIDATION_STATUS = #ok`, bytes decode, profile matches).
2. Else valid **active** custom visual from the **eligible weighted pool** (bound at spawn; if the bound id is later invalid, **do not re-roll** — skip to 3).
3. Existing built-in / generated pixel visual.

Missing, invalid, inactive, corrupt, or unavailable custom assets **immediately** fall back to (3). Inactive / safe-removed assets drop out of pools **before** the next spawn; already-bound instances fall back without re-roll.

Empty library, all-inactive library, and “never uploaded” are the same as today.

`strokeOwnerTint` (`pieceArt.ts` 791–810) strokes the **cell-grid** footprint. Wrapping PNG bytes as a pattern would mis-outline. Custom summons: outline the **dest rect** (or skip v1 and keep pixels-only summons).

---

## 4. Derived render measurements (do not invent)

### 4.1 Tile, anchor, scale

| Token | Value | Source |
| :--- | :--- | :--- |
| Tile | 80 × 40 | `gameConstants.ts` 6–7 |
| Mobile tile | 140 × 70 | `MOBILE_ZOOM` 1.75 (WX 957–959) |
| Cell | 3 px | WX 3855; `pieceArt.ts` 761 |
| Draw point | tile top + 9 | `CHARACTER_Y_OFFSET = -9` (gameConstants 17); draw at `screenPos.y - offset` |
| Standard pattern | 8 × 8 | `pieceArt.ts` 85–93 |
| Standard footprint @1 | **24 × 24** | 8 × 3 |
| Portal boss live | 8 × 8 × 1.4 | chess × portal `scaleX/Y` (WX 6535–6536) → **≈34 × 34** |
| Boss tables (unused on live Enemy) | 8 × 12 × 1.4 | `enemyPixelPatterns.ts` 10–24 | **≈34 × 50** |
| Rush live | 8 × 8 × 1 | `king.front` | **24 × 24** |
| Hit tested | 80 × **41** | WX 8088–8092 |
| Hit stored `drawSize` | 80 × 60 | WX 8103 |
| Name label | `screenPos.y − 34` | WX 8122 |
| Summon badge | `(x+18, y−48)` | WX 8146–8147 |
| Damage float | `y − 44` / `y − 58` | WX 8206–8214 |
| Status icons | `drawY − 30` | WX 8246, 8362 |
| Wall prism | height **28** | WX 4085 |
| Portal whirlpool | radius **25** | WX 3898 |
| Drop shadow | tile-foot ellipse | WX 8033–8054 |
| Portrait | 60 × 60, cell 6 | WX 3720, 18113–18114 — **not combat** |
| Admin preview | 72 × 72 contain | AdminDashboard 1484–1507 — **not combat** |
| Creation | 80 × 80 art on 320×280 / CSS 240×210 | CharacterCreation 151–153, 454–463 — **not combat** |

WX 3840 comment (“patterns now match tile dimensions exactly”) is **false** for the math. Ignore it when writing specs (`VAL-2026-09-23-011`).

### 4.2 Per-category upload specification

Show these **before** the file picker. Never silently rescale, crop, or stretch on reject.

Shared:

| Field | Contract |
| :--- | :--- |
| `SUPPORTED_FORMATS` | **PNG** (preferred), **WebP** with alpha. Reject JPEG (no alpha), SVG, GIF/APNG **animation**, video. `createImageBitmap` of a GIF is typically the **first frame** — that is not animation support. |
| `TRANSPARENCY_REQUIREMENT` | **Required.** Builtin cell `0` is skip. Opaque rectangles over the diamond are a preview warning and a reject if zero alpha samples. |
| `MAX_FILE_SIZE` | **Not a measured visual cap in-repo.** `MAX_URL = 2048` is URL text. `MAX_JSON_BLOB = 32_768` is JSON text. Shop proof **524_288** is a **different** surface. Starting reject: **256 KiB per still** after encode until object-store limits are measured. Decode from `Blob` / `ExternalBlob`. No `data:` / `file:` / cross-origin `https` paint. |
| `ANCHOR` | Center on draw point `(tileTopX, tileTopY + 9)` — same as `startX = round(x − w/2)` |
| `DEFAULT_SCALE` | **1** (do not apply instance squash or extra 1.4 on a recommended-size upload) |
| `ANIMATION_SUPPORT` | **None** in v1. Four stills (front/right/left/back) for player. Enemies/bosses/summons: **one** still. Walk-frame arrays stay stored-not-rendered. |
| `VALIDATION_STATUS` | `#ok` only after MIME + decode + w/h + aspect + pixel count + file size + alpha + category + render-safe bounds. URL-length pass is **not** `#ok`. |

**PLAYER CHARACTER** — `player_standard`

| Field | Value | Why |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (or **48** @2×, drawn at 24) | 8×8 × 3 |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile / stored `drawSize.h`; **warn at 41** (tested hit `h`) |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | labels at y−34 stay clear of 24-tall art |

**STANDARD ENEMY** — `enemy_standard`

| Field | Value | Why |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | chess 8×8 × 3 — **not** family grids |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | warn if taller than tested **41** |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | |

**ELITE / LARGE ENEMY** — `enemy_elite`

Metadata-only until `isElite` exists. Same numbers as `enemy_standard` if a future flag ships. `ELITE_ONLY` rows are **ineligible** today. Do not stretch standard art.

**BOSS** — `boss_large` (separate profile; do not stretch `enemy_standard`)

| Field | Value | Why |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) |
| `RECOMMENDED_HEIGHT` | **34** to match **today’s portal paint**; **50** only if the owner **opts into the unused table box** | Live = 8×8×1.4. Tables = 8×12×1.4. Preview must **label** which box. Never silently pick 50 for a unit that paints 34. |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **72** | one column; labels will clip — warn |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 64 × 72 | still one tile occupancy |
| Assignment key | **Not** `Enemy.isBoss`, **not** `family === "boss"`, **not** Rush `pieceType` lore name | Use spawn-kind: `portal_boss` / `boss_rush` / (future) `boss_table` |

**SUMMON** — `summon_standard`

| Field | Value | Why |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** | creature 8×8 × 3 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | badge `(x+18, y−48)` collides with tall art — warn |

### 4.3 Aspect ratio and pixel-count gates

| Gate | Rule |
| :--- | :--- |
| Aspect | Standard / player / summon: **1:1** ± 5% at recommended. Boss live: **1:1** ± 5% at 34×34. Boss table opt-in: **34:50** (0.68) ± 5%. Reject others — **do not letterbox**. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` after intended scale. |
| Decode | `createImageBitmap` / `Image.decode`. Failure → `#invalid`, no bind. |
| Distortion | Never `drawImage` with a dest aspect ≠ source. Never `object-fit: contain` in combat (admin 72×72 may). |

### 4.4 SOURCE / NORMALIZED / RENDER_PROFILE (proposed — does not exist)

Introduce only if implementation needs 2×/4× sources. Until then **source === runtime**. Validation uses the category profile directly. `RENDER_PROFILE` does not apply instance `scaleX/Y` to custom art.

Do **not** derive specs from `window.innerWidth` (context-restore path) or from `canvas.width` (backing store).

---

## 5. Library metadata

| Field | Type | Notes |
| :--- | :--- | :--- |
| `ASSET_ID` | Text | Stable. Never reuse after safe delete. |
| `DISPLAY_NAME` | Text | Owner-facing. Rename does not change id. |
| `ENTITY_CATEGORY` | Enum | `player` / `standard_enemy` / `elite` / `boss` / `summon` / `future_*` |
| `ENTITY_FAMILY` | Text? | `EnemyFamily` union members only when assigned to family. **Not** `"boss"`. |
| `ENTITY_IDS` | Text[] | Explicit ids (chess pieceType, boss config id, summon `pieceType`). Rush lore names are **invalid** keys. |
| `VARIANT_TAGS` | Text[] | Optional. No name heuristics. |
| `ACTIVE` | Bool | Inactive → skip pools; bound instances fall back. |
| `WEIGHT` | Nat | Pool pick. 0 ≡ skip. |
| `RARITY` | Text | Display only. Does not change combat. |
| `ELITE_ONLY` | Bool | **Ineligible** until `isElite` exists. |
| `BOSS_ONLY` | Bool | Eligible only for spawn-kind `portal_boss` / `boss_rush`, not `family === "boss"`. |
| `UPLOAD_DATE` | Int | |
| `VERSION` | Nat | Increment on replace. Bound ids pin a version or fall back if missing. |
| `SOURCE_METADATA` | Record | MIME, bytes, original w/h, checksum. |
| `RENDER_PROFILE` | Text | `player_standard` / `enemy_standard` / `enemy_elite` / `boss_large` / `summon_standard`. |
| `VALIDATION_STATUS` | Enum | `#pending` / `#ok` / `#invalid`. Only `#ok` + `ACTIVE` participate. |

Future categories (`portal`, `hazard`, `wall`, `loot`, `ad`, `barrier_tower`, `death_juice`) store as **ineligible**.

---

## 6. Owner operations

| Op | Rule |
| :--- | :--- |
| **Upload** | Specs **before** picker. Validate then store bytes in object storage. Metadata on canister. Reject ≠ auto-resize. |
| **Preview** | Iso **80×40 and 140×70**, draw point +9, player 24×24 dummy, standard enemy dummy, portal-boss dummy at **34×34** (live) and a labeled **34×50** pane (“not current portal paint”), drop-shadow foot, name/badge/damage-float overlays, hit rect **80×41**, **wall prism 28**, pointer-space note. Warn clip / pad / overlap / **phone Continue zoom**. |
| **Activate / deactivate** | Pool membership. Bound invalid → builtin next frame, no re-roll. |
| **Rename** | Display only. |
| **Replace / version** | New version; `bitmap.close()` old; keep id. In-flight instances: pin or fallback. |
| **Safe removal** | Dependency inspect → deactivate → wait no bound `#ok` uses → delete bytes. Never leave a dangling id that paints corrupt. |
| **Assign entity / family / pool** | Explicit ids. Weighted random **at spawn** via `seededRng`. |
| **Revert to default** | Clear bind / deactivate. Builtin immediately. |
| **Dependency inspection** | Which entity ids, families, pools, live instance counts (session). |

---

## 7. Implementation placement

| Module | Owns |
| :--- | :--- |
| `engine/visualAssets.ts` (new) | Types, `RENDER_PROFILES`, validate, `resolveRuntimeVisual`, weighted pick, ImageBitmap cache |
| `engine/visualPreview.ts` (new) | Iso preview + warnings (admin-only) |
| `pieceArt.ts` | Optional custom **top** branch in `drawCombatant`; **do not** overload `drawPattern` |
| WX | Pass bound id + optional bitmap through `DrawCombatantOptions`. **Player site is a second one-line wire.** Do not grow the 19213-line rAF body. |
| `combatantStore.ts` | Keep `visualAssetId` on Enemy across `updateCombatant` / `addCombatant` / `syncCombatants`. Strip stays ignorant. |
| Admin | New library panel. Do not pretend `spriteUrl` is live. |
| Motoko | New later migration after `20260901` for maps. `#admin` only. Bytes **not** in `Text`. |

Tests: library `[]` → `{ kind: "builtin" }`; inactive / corrupt → builtin; 100 fake rAF ticks same id; empty eligible pool → unset id; `turnsRemaining` decrement does not re-pick; Rush lore `pieceType` never matches a row; `family: "boss"` does not activate `BOSS_ONLY`; player missing from `combatantsRef` still resolves by pieceType; PNG not recolored by `Character.colors`.

---

## 8. Risk register

| Risk | Mitigation |
| :--- | :--- |
| Wiring `spriteUrl` because `useGetEnemyConfigs` exists | `VAL-2026-09-22-007` / `VAL-2026-09-23-006` |
| Keying `boss_large` off `isBoss` / `family===boss` | `VAL-2026-09-22-002` — would change portal paint |
| Growing occupancy / hit `h` 41 from PNG size | `VAL-2026-09-22-004` |
| `drawImage` through `drawPixelPattern` (unpaired restore) | `VAL-2026-09-22-006` |
| Re-pick in render | Bind on Enemy at spawn; player by pieceType |
| Stretch via squash / extra 1.4 | Custom scale 1 |
| Blurry PNG next to fillRect | Per-draw `imageSmoothingEnabled = false` **after** `setTransform` |
| Ctx-bound pattern dies on rAF `canvas.width=` | ImageBitmap cache |
| PNG in Motoko Text | Object storage; 2048 / 32768 caps |
| Recolor PNG with chess palettes | Ignore palettes on bitmap path |
| Custom skips move pulse | Stay inside 8057 save |
| Upload spec from `window.innerWidth` | Profiles from tile/cell/offset only |
| Name-heuristic assignment | No Register / no `ENEMY_ICONS` regex |
| EOP trap | New later chain file |
| Stack overwrite of #355/#418/#461 | Unique dated filenames |

---

## 9. What this run did not do

- No production / gameplay / RAF / map-gen / combat-math edits.
- No `engine/visualAssets.ts` implementation.
- Did not re-issue `VAL-2026-08-31-*`, `VAL-2026-09-01-*`, `VAL-2026-09-02-*`, `VAL-2026-09-21-*`, `VAL-2026-09-22-*`, or `VAL-2026-09-23-*`.
- Did not edit `README.md`.
- Did not merge or close older VAL drafts.

**Implemented (copy only):** `VAL-2026-09-01-001`.

**Superseded for visual gates:** `VAL-2026-09-21-007` → `VAL-2026-09-22-002`.
