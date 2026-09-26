# Custom Visual Asset Library & Assignment — 2026-09-26 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-26  
**HEAD:** `0f5363f` (`Merge pull request #332`) — **same SHA as 09-21 … 09-25**  
**WX:** 19213 lines  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs on `origin/main`:** 08-31 / 09-01 / 09-02 only.  
**Sibling VAL docs (open, not on main):** [#355](https://github.com/Mr-Melic/stralt/pull/355) (09-21), [#418](https://github.com/Mr-Melic/stralt/pull/418) (09-22), [#461](https://github.com/Mr-Melic/stralt/pull/461) (09-23), [#520](https://github.com/Mr-Melic/stralt/pull/520) (09-24), [#586](https://github.com/Mr-Melic/stralt/pull/586) (09-25).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-26.md`](./ACTION_IDS_VAL_2026-09-26.md)

**Invariant:** custom visuals are **optional**. The current built-in / generated pixel visual remains **default and fallback**. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

Every size below is re-derived from the **live** renderer on this SHA. Invented sprite boxes (64×64, 128×128, 512²) are not used.

---

## 0. Verdict

| Question | 2026-09-26 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (the only `drawImage` string is a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change vs 09-25? | **Pixel boxes unchanged.** One **squash-range correction**: live tall/wide branches reach **1.5**, not the 1.4 ceiling 09-25 published. |
| What is implemented? | **VAL-2026-09-01-001 only** (admin copy honesty). All other VAL-* remain NEW. |
| Production SHA since 09-21? | Unchanged (`0f5363f`). This run names architecture traps 09-25 did not: scale **1.5** squash, stale shared-RNG comment vs live `Math.random` call, M-1 `canvas.width=0` kill, barrier towers **6×28 = 168** px, Rest/Death Realm **desktop camera follow**, rest glow **r+8**, boss-portal star **r+12**, `#591` wander extract. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`.

---

## 1. Delta vs 2026-09-25 (same SHA — contract corrections)

Pixel boxes did not move. These facts **correct or extend** the 09-25 contract. Implementers on `main` still only see 08-31…09-02; 09-25 IDs did not cover them.

| Topic | 09-25 said | Live 09-26 | Why it matters for VAL |
| :--- | :--- | :--- | :--- |
| Instance squash range | `scaleX/Y` 0.6–1.4; elite rec **34** = ceil(24×1.4) | Tall: `scaleY = rng()*0.4+1.1` ∈ **[1.1, 1.5)**; wide: `scaleX` ∈ **[1.1, 1.5)**; uniform still 0.6–1.4 (`spawnPolicy.ts` 227–256; tests 171–201) | 09-25 `enemy_elite` rec 34 is **short**. Max painted chess at squash is **36×36** (24×1.5). Custom art still must **not** inherit squash. |
| Scale RNG stream | implied leftover draws might share spawn RNG | WX **5768** calls `generateEnemyScaleFactors()` with **default `Math.random`**. `pickEnemyLevelFromTiers` is a **separate** call (5770). File comment at `spawnPolicy.ts` 17–18 / 224–226 is **stale**. | VAL bind may `seededRng(hash(instanceId, poolId))` at spawn **without** shifting levels. Do not “preserve” the two discarded draws as if they fed the level picker. |
| Context death | resize / drift `canvas.width=` | **M-1** (WX 7224–7229): if `getContext("2d")` is null, `canvas.width = 0` then restore savedW. Early no-map path also `canvas.width=` (7203–7208). | `canvas.width=0` **destroys** the 2D context. Cache `ImageBitmap`, not a `CanvasPattern` minted from the world ctx. |
| Walls vs barriers | `wallHeight = 28` | Walls 28 (WX 4085). Barrier towers: **`BARRIER_LAYERS = 6` × `BARRIER_LAYER_HEIGHT = 28` = 168 px** (`barrierRender.ts` 15–16). Comment citing WX 3273 is **stale**. | Preview must show a 168 px tower next to a 24×24 dummy. Do not size combatant uploads from the tower. Future `#barrier` category only after a measured profile. |
| Desktop camera | `isDesktop` → offset 0 | Rest / Death Realm **center on the player even when desktop** (WX 5877–5893) **before** the `isDesktop` lock (5896–5899). | Iso preview needs a Rest/Death pane: desktop diamond 80×40 + **camera follow**. 09-25’s three-band table is incomplete. |
| Portal FX vs unit | whirlpool `radius = 25` | Rest glow ellipse **r+8 = 33** (3928); boss-portal star **outerR = r+12 = 37** (3965). Unit paint is still chess 8×8 × 1.4. | Do not size `boss_large` from 33/37. FX profile ≠ unit profile. |
| WX extract siblings | #427 hit-test only | #427 still open; **[#591](https://github.com/Mr-Melic/stralt/pull/591)** extracts `advanceEnemyWander` from WX into `engine/enemyWander.ts`. | VAL must not grow the rAF body. After either lands, consume the helper; do not concatenate a second copy. |
| Death Realm roster | not named | Boss-portal else-branch: `newMap.isDeathRealm ? [] : generateEnemies(...)` (WX 6566–6583) | Empty library + **empty roster** must still paint the player stills. Bind never assumes an enemy list. |
| Player overlap | hit 80×41 | Player `drawOrder: 99999` (WX 8332–8342) — always last in the depth pass, wins tiebreak | Custom player `drawImage` must keep that order. Do not grow the hit box from PNG size. |

Unchanged from 09-25 (re-verified on this tree):

- Portal boss Enemy has `family: "boss"` (WX 6568) but **no** `isBoss` / `bossId`; paint is chess 8×8 × 1.4 ≈ 34×34.
- `drawCombatant` boss branch requires `isBoss && bossId` (`pieceArt.ts` 856). Live portal Enemy matches **neither**.
- Boss Rush sets `isBoss: true` (WX 5340), omits `bossId` / `scaleX`, `pieceType` is a **lore name** (`roomDef.boss1Name`). Rush id is `boss-rush-…` (hyphen) — `id.startsWith("boss_")` is **false**.
- Hit test uses `entry.x,y,w,h` (desktop **80×41**), not stored `drawSize` 80×60. Padding 10 mouse / 14 touch.
- `pointerToRenderSpace` uses CSS `canvasSize` (WX 8994–9004).
- rAF may `canvas.width=` (7256–7261) **and** `setTransform`+`scale(dpr)` every frame (7263–7264).
- Player is **not** in `combatantsRef`. Player stills are a second call site (WX 8315–8326).
- `drawPixelPattern` trailing `ctx.restore()` has no matching `save` (3883). Moving-enemy `save` wraps draw (8057–8076).
- CSS `image-rendering: pixelated` on world canvas (WX 17890) and global `canvas` (`index.css` 652–655). `imageSmoothingEnabled` is never set.
- Context restore sizes from `window.innerWidth` (WX 13830–13834), not `canvasSize`.
- `InitiativeStrip` `ENEMY_ICONS` is name-regex emoji (`InitiativeStrip.tsx` 65–80). Enemy Register is flavor lore.
- Version-gate wipe keeps only `pbv_tier_spawn_config`, `pbv_levelup_config`, `*_inventory` (`versionGate.ts` 7–12; `App.tsx` 297–318).
- CharacterCreation hardcodes an 8-cell box (`CharacterCreation.tsx` 151–178).
- Shop `proofFileUrl` may be `data:image/*` up to 524_288; combat `unsafeUrl` **rejects** `data:`.
- Tablet 768–1024: tiles 80×40, camera follow (`useIsMobile` 768; `isDesktop` `>1024` at WX 877) — **except** Rest/Death as above.
- Battle-init skips while `battleInitFrameRef < 3` (WX 7238–7245). Comment says “first 2 frames”; code skips **3**.
- `nsKey` (WX 866–871) is a slot cache, not a library.
- Iso neighbor Δ = `(40, 20)` ≈ 44.7 desktop (WX 3785–3786).
- Drop-shadow desktop: `sw = min(80*0.35, 40*0.3) = min(28, 12) = 12`, `sh = 4.2` (WX 8033–8054).

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886); unpaired `ctx.restore()` at 3883. Comment at 3840 (“match tile dimensions exactly”) is **false** (8×8×3 = 24 ≠ 80×40). |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782); **no** restore |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023 |
| `engine/enemyPixelPatterns.ts` | Boss 8×12 tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432; family 434–498 |
| WX player | `getPersistedPiecePattern(pieceType, playerView)` then `drawPixelPattern` | 8289, 8315–8326 — **not** `drawCombatant` |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3760, 18111–18116 |
| Character creation | 8×8 × `scale = 10` → **80×80** art on a **320×280** backing / **240×210** CSS | `CharacterCreation.tsx` 151–178, 452–465 |
| Character selection | `size=120` → `internalSize=240` → `pixelSize=floor(240/10)=24` → **192×192** cells | `CharacterSelection.tsx` 310–337 |
| Death juice | `fillRect` fragments | `engine/effects.ts` 282–292 |
| Portal FX | ellipse whirlpool **radius 25**, translated `(x, y-10)` | WX 3898–3919 |
| Barrier tower | 6 iso layers × 28 px | `barrierRender.ts` 15–16 |

`Character.pixelPattern` may be persisted at creation but WorldExploration **never reads it**. `getPersistedPiecePattern` (`pieceArt.ts` 653–658) is **pieceType-only**.

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects `getBossPattern`, `getFamilyPattern`, `getFamilyColors`, `drawPattern`, `characterYOffset`. It does **not** accept a bitmap. A custom path must be a **new optional top branch** (or a new option). Do **not** implement `drawImage` inside `drawPixelPattern` (fillRect + unpaired restore).

### 2.2 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text | **No.** WX has zero `getEnemyConfigs` / `spriteUrl`. `useGetEnemyConfigs` (`useSpellQueries.ts` 111) is **admin React Query**. |
| `PlayerSpriteConfig` direction + walk-frame URL arrays | Canister + Sprite panel | **No.** Walk arrays cap **16** (`adminGuard.mo` 318–320). Combat never samples them. |
| Login ad boxes | `adminSetAdBox` URL strings | Landing `<img>` (`LandingPage.tsx` 749) — **not combat**. |
| GameKey shop thumb | `<img>` (`DokaGameKeyShop.tsx` 488) | IAP chrome, not combat. |
| Admin sprite preview | 72×72 `<img object-fit:contain>` (`AdminDashboard.tsx` 1484–1507) | **Not** the iso preview. |

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`).

`adminGuard.validateOptionalUrl` checks **length ≤ 2048** (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–94). It does **not** decode images. Empty URL is valid. `MAX_JSON_BLOB = 32_768` (line 9).

`adminContract.test.ts` + `adminVisualStatus.test.ts`: empty `spriteUrl` tuple is **not** a custom asset.

Caffeine `ExternalBlob` is bindgen plumbing (`backend.ts` 54–55). No visual-asset blob type exists.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"` — **not** in `combatantsRef`. Chess `pieceType` + 4-way `playerView` (WX 11490–11493) | 8×8 `chessPiecePatterns` + character colors. Second call site. `drawOrder` 99999. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\`` (WX 5809), random chess `pieceType`, `family` starts `"default"` | `drawCombatant` branch 4. Family 30% is **stats only**. Instance squash stored (WX 5820–5821). |
| **ELITE / LARGE ENEMY** | **No type.** `generateEnemyScaleFactors` stores visual squash (max **1.5** on one axis). `elite_patrol` is a world-feature catalog key (`worldFeatures.ts` 44, 454). | Same chess path × instance scale |
| **BOSS (portal)** | `id: \`boss_${bossConf.id}_${Date.now()}\`` (WX 6524), `scaleX/Y = 1.4` (6535–6536), `family: "boss"` (6568). **No** `isBoss` / `bossId` on the Enemy. Battle start writes those flags onto **CombatantEntry only** (WX 11958–11984). | Chess 8×8 × 1.4. 8×12 tables unused. |
| **BOSS (Rush)** | `id: \`boss-rush-${roomIndex}-*\`` (hyphen), `isBoss: true`, lore `pieceType`, **no** `scaleX/Y` / `bossId` | `drawCombatant` branch 1 fails (`!bossId`); branch 4 + unknown pieceType → `king.front` 24×24 |
| **SUMMON** | `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` 153). Omits `scaleX/Y`. | 8×8 `creaturePatterns` + `strokeOwnerTint` (`pieceArt.ts` 791–810, 923–926) |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use `getEnemyFamilyPixelPattern` |
| **Death Realm** | `isDeathRealm` → **no enemies** (WX 6566–6568) | Player stills only + camera center |
| **Future** | Portals (r=25 / rest glow 33 / boss star 37), hazards, loot, walls (28), **barrier towers (168)**, ads, death fragments | Not `drawCombatant` |

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`. **`"boss"` is not a member.** Assigned with 30% chance (`FAMILY_VARIANT_CHANCE = 0.3`, `spawnPolicy.ts` 35) via `applyFamilyVariantsToRoster` (WX 5864). Changes **stats**, not the default draw path.

Family grids exist but are unused for those 30% units:

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

Do **not** publish those grids as the STANDARD ENEMY upload spec.

Admin `PlayerSpriteConfig` `PIECE_TYPES` includes `"custom"` (`AdminDashboard.tsx` 1250–1258). Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11). Do not treat admin `"custom"` as a combat visual category.

`InitiativeStrip.ENEMY_ICONS` and Enemy Register lore are **not** catalogs.

### 2.4 Gameplay footprint is tile-based

`engine/occupancy.ts` 84–96: one combatant per logical tile. No width/height.

Sprite rects are a **fixed tile-derived box** (WX 8086–8103, 8335–8352):

```
drawSize = { w: effectiveTileW, h: effectiveTileH * 1.5 }
  desktop: 80 × 60
  mobile-zoom: 140 × 105
registered h = effectiveTileH/2 + CHARACTER_Y_OFFSET + (effectiveTileH*1.5)/2
  desktop: 20 + (−9) + 30 = 41
drawAnchor = (tileTopX, tileTopY − CHARACTER_Y_OFFSET) = (tileTopX, tileTopY + 9)
hitTestSprite uses entry.x, y, w, h (the 80×41 box) + padding 10 / 14
  — NOT drawSize, NOT bitmap size
```

Custom art must never change occupancy, movement, range, targeting, or combat hitboxes. Do not rewrite `drawSize` or hit `h` from bitmap width/height.

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with `sw = min(tw*0.35, th*0.3)` (desktop **12 × 4.2**, WX 8033–8054). It does not track sprite pixels. Tall custom art disconnects from the shadow; preview must warn. Do not grow the shadow from bitmap size.

Whole-frame shake is `ctx.translate(_shake)` after `ctx.save()` (WX 7265–7267). Custom `drawImage` inherits it; do not add a second shake from bitmap size.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors` | spawn | **Default `Math.random`** (WX 5768), then **stored** on `scaleX`/`scaleY`. Two unused draws are internal to that call. |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` (WX 5864) |
| Battle stats | `getEnemyBaseStats` | `seededRng` from charCode-sum of `seedKey` (`progression.ts` 163–170) |
| Map tiles / Boss Rush cells | generate | `seededRng(seed)` (WX 4089+) |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |
| Battle-init rAF | first 3 frames skipped | Must **not** be the bind site |

`seededRng` (`combatMath.ts` 122–128) is the correct primitive for pool picks. Hash the **already unique instance id** plus `poolId` / assignment config the same way `getEnemyBaseStats` hashes `seedKey` (charCode sum). Write `visualAssetId` onto the **Enemy** in `combatantsRef` at spawn (`toCombatantEntry` at `combatantStore.ts` 141–169 **strips** `scaleX/Y`, `family`, `assignedName`, `currentView` — do not store the bind only on `CombatantEntry`).

Summon ids are random but **stable for the live object**; bind once at spawn (`summonSpawn.ts` 153), never when `turnsRemaining` ticks.

**Never call `Math.random()` or pick a pool member inside `drawCombatant` / the rAF loop / a React render.**

Custom art must **not** inherit instance `scaleX`/`scaleY` 0.6–1.5 squash. Rush/summons **omit** those fields; `drawCombatant` defaults missing scale to 1 (`pieceArt.ts` 846–848). Do not backfill squash when binding.

### 2.6 Owner gate

- `App.tsx` 291: `isAdmin = userRole === "admin"`.
- `getUserRole` (`main.mo` 2558–2564): first II caller becomes admin. Roles are `#admin` / `#user` only (`adminGuard.validateAssignRole` 174–178). **No `#owner` role.**
- `AdminDashboard.tsx` 5546: hard deny if `!isAdmin`.
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- `AGENTS.md`: admin/debug must be gated; never ship to normal players.

Library UI is **admin-only**. Players never upload or choose combat art.

### 2.7 Viewport bands (not a binary phone/desktop)

| Band | Detection | Tiles | Camera | Pixel cell |
| :--- | :--- | :--- | :--- | :--- |
| Phone | `innerWidth < 768` after Continue (`pbv_small_screen_continue`) | **140×70** (`MOBILE_ZOOM` 1.75, WX 957–959) | follow (`isDesktop` false) | **3px** (not ×1.75) |
| Tablet | 768–1024 | **80×40** | follow | 3px |
| Desktop overworld | `innerWidth > 1024` (WX 877) | **80×40** | locked offset 0 | 3px |
| Rest / Death (any width) | `isRestMap` / `isDeathRealm` (WX 5877–5893) | same as band | **center on player** (overrides desktop lock) | 3px |

`SmallScreenGuard` warns; **Continue anyway** (`App.tsx` 44–139). Builtin 24×24 art is relatively smaller on zoomed phone tiles. Iso preview must include a **140×70** pane **and** a Rest/Death follow pane.

### 2.8 Canvas / bitmap lifecycle (implementation traps)

| Event | What happens | VAL rule |
| :--- | :--- | :--- |
| M-1 null context | `canvas.width = 0` then restore (7224–7229) | Treat as full context death. Keep `ImageBitmap` off-ctx. |
| No-map early rAF | may `canvas.width=` (7203–7208) | Same. |
| Every rAF | `setTransform` identity then `scale(dpr)` (7263–7264). May also `canvas.width=` if backing store drifted (7256–7261). | `canvas.width=` **clears 2D state**. Cache `ImageBitmap`, not `CanvasPattern` from the world ctx. Set `imageSmoothingEnabled = false` **after** `setTransform` on each custom draw. |
| ResizeObserver | `canvas.width=` (13956–13957); comment at 13972 | Same cache rule. |
| Context restore | `canvas.width = innerWidth * dpr` (13830–13834) | **Do not** derive upload MAX from this size. Listeners include `webglcontextlost` on a **2D** canvas (13826–13864). |
| Moving enemy | `ctx.save()` + shadow/alpha, draw, `ctx.restore()` (8057–8076) | Custom draw must run **inside** that save. Do not go through `drawPixelPattern` (unpaired restore pops the save). |
| `updateCombatant` | Spreads patch onto Enemy **and** CombatantEntry | Bind field on Enemy is enough. `syncCombatants` rebuilds entries via `toCombatantEntry` (strips extras). |

---

## 3. Visual fallback invariant

Resolution order for every combatant, every frame:

1. **Bound instance assignment** — `entity.visualAssetId` points at a library record that is `ACTIVE`, `VALIDATION_STATUS = ok`, bytes decode, and category/eligibility still match.
2. **Bound pool assignment** — `entity.visualPoolId` was resolved **at spawn** into a stored `visualAssetId`. If that id is now invalid, **do not re-roll in render.** Fall through.
3. **Built-in / generated pixel visual** — current `drawCombatant` / `drawPixelPattern` path.

Hard rules:

- Missing, inactive, corrupt, undecodable, oversized, or ineligible custom assets **immediately** use step 3.
- Empty library ⇒ every entity is step 3. No upload required to ship a new enemy or boss.
- New `BossConfig` / `EnemyConfig` / summon `pieceType` automatically works with generated pixels.
- Death Realm (zero enemies) + empty library ⇒ player chess pixels only. That is success.
- Failures log once (reuse `logPatternLookupFailed` throttle, `pieceArt.ts` 40–55), never throw, never block combat.
- Deactivate → live instances with that id fall back **next frame**. No re-roll.

```ts
// src/frontend/src/engine/visualAssets.ts  (not implemented)
function resolveRuntimeVisual(entity, library): RuntimeVisual
  // { kind: "custom", bitmap, profile } | { kind: "builtin" }
```

`drawCombatant` may grow **one optional branch at the top**: if resolve returns a decoded bitmap + profile, `drawImage` at the same anchor as `drawPixelPattern`; otherwise branches 1–4 run unchanged. Player needs a **second** one-line site (WX 8315). Empty library / omitted option ⇒ **identity** with today.

---

## 4. Derived render measurements (do not invent)

All sizes are **logical CSS pixels** after `ctx.scale(dpr)` (WX 7264). Source bitmaps may be integer multiples for sharpness (2× = 48×48 for standard). Draw **unscaled** (or integer nearest-neighbor). Never silently stretch.

### 4.1 Tile, anchor, scale

| Quantity | Desktop / tablet (768+) | Phone after Continue (`isMobile`) | Source |
| :--- | ---: | ---: | :--- |
| Iso diamond | 80 × 40 | 140 × 70 | `TILE_*` × `MOBILE_ZOOM` 1.75 |
| Adjacent-tile screen Δ | **(40, 20)** ≈ 44.7 px | **(70, 35)** ≈ 78.3 px | `gridToScreen` 3785–3786 |
| `gridToScreen` | **top vertex** of the diamond | same | WX 3772–3793 (cached) |
| Tile visual center | top + `th/2` → +20 / +35 | | `tileCenter` 3806–3811 |
| Character draw point | `(tileTopX, tileTopY + 9)` | same offset | `drawCombatant` 851–852; player 8317–8319 |
| Pattern **anchor** | **center of the pattern** on the draw point | same | WX 3860–3861, `pieceArt.ts` 764–765 |
| Drop-shadow foot | `(tileTopX, tileTopY + th/2 + 4)`, desktop **12 × 4.2** | phone `sw = min(49, 21) = 21` | 8033–8054, 8291–8312 |
| World cell size | **3×3** logical px × `scaleX`/`scaleY` | **not** × 1.75 | WX 3855 |
| Default pattern | **8×8 cells** | | `chessPiecePatterns` 83–94, `creaturePatterns` 347–357 |
| Default drawn size @ scale 1 | **24 × 24** | 24 × 24 | 8 × 3 |
| Enemy instance scale | 0.6–**1.5** on one axis (stored when present) | same | `spawnPolicy.ts` 227–256 |
| Max standard drawn @ 1.5 | **36 × 36** | 36 × 36 | 24 × 1.5 (tall or wide branch) |
| Max uniform drawn @ 1.4 | **33.6 × 33.6** | | uniform branch |
| Boss **tables** | **8×12 cells** | | `enemyPixelPatterns.ts` 10–24 |
| Boss tables @ 1.4 | **33.6 × 50.4** | | unused on live portal Enemy |
| Portal boss **live** | chess 8×8 × 1.4 ≈ **33.6 × 33.6** | | no `isBoss`/`bossId` on Enemy |
| Rush boss **live** | `king.front` **24 × 24** | | `isBoss` without `bossId` |
| Portrait | 60×60 canvas, 6px cells → 48×48 art | | 3720, 18111–18116 |
| Creation preview | 80×80 pattern on 320×280 backing | | `CharacterCreation.tsx` 151–153 |
| Selection preview | **192×192** cells on 240 backing / 120 CSS | | `CharacterSelection.tsx` 310–337 |
| Name label | `screenPos.y − 34` | | 8122 |
| Level label | name + 14 | | 8123 |
| Damage float | `y − 44` / `y − 58` | | 8206–8214 |
| Status icons | draw point − 30 | | 8246, 8362 |
| Summon lifespan badge | `(x + 18, y − 48)` | | 8146–8147 |
| Summon owner tint | pattern AABB, `lineWidth` 2, `shadowBlur` 8 | | `pieceArt.ts` 791–810 |
| Sprite hit registered | **80 × 41** | **140 × 61.5** | `h` formula above |
| Sprite stored `drawSize` | 80 × 60 | 140 × 105 | **not** used by hitTest |
| Hit padding | 10 mouse / 14 touch | same | 10127, 10819 |
| Wall extrusion | **28** px | | 4085 |
| Barrier tower | **168** px (6 × 28) | | `barrierRender.ts` 15–16 |
| Wandering pulse ring | radius **15** at draw point | | 8229–8234 |
| Portal FX | r=25; rest glow 33; boss star 37 | | 3898, 3928, 3965 |
| Player `drawOrder` | **99999** | | 8342 |

**Anchor for custom bitmaps must match the pixel path:** center the image on `(tileTopX, tileTopY + 9)`.

Do **not** use the 320×280 creation canvas, 192×192 selection cells, 72×72 admin `<img>`, 60×60 portrait, `window.innerWidth` after context restore, barrier 168, portal 25/33/37, or the false “match tile dimensions” comment (WX 3840) as recommended upload size.

### 4.2 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**.

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` accepted if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF not used in combat. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | `playerView` updates on step (WX 11490–11493). Walk-frame arrays exist but are **never drawn**. Do not implement walk cycles in v1 (`VAL-2026-08-31-018`). |
| `MAX_FILE_SIZE` | **Not an in-renderer measurement.** `MAX_URL = 2048`, `MAX_JSON_BLOB = 32_768` (`adminGuard.mo` 9–10). Shop `proofFileUrl` cap 524_288 is a **different** surface. | Starting reject: **256 KiB per still** after encode until object-store limits are measured. **Do not store raw base64 in Motoko `Text`.** Do not use `data:` URLs (`unsafeUrl` forbids them on sprite stubs). Decode from `Blob` / `ExternalBlob`. |

#### PLAYER CHARACTER — profile `player_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **24** (or **48** @2× source) | 8×8 × 3 |
| `RECOMMENDED_HEIGHT` | **24** (or **48** @2×) | same |
| `MAX_WIDTH` | **80** | `TILE_WIDTH`; **warn** if &gt; 40 (iso neighbor Δx) |
| `MAX_HEIGHT` | **60** | stored `drawSize.h` desktop (hit uses 41) |
| `ANCHOR` | center on draw point (tile top + 9) | `drawPixelPattern` |
| `DEFAULT_SCALE` | **1** | player draw omits scale (defaults `{1,1}`) |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | 2× default; labels at y−34 stay clear of a 24-tall sprite |
| `ANIMATION_SUPPORT` | 4 stills keyed by `pieceType` + `playerView` | Player is not in `combatantsRef`; keep `drawOrder` 99999 |

Portrait HUD, character-creation (hardcoded 8 cells), and character-selection (192-cell painter) stay generated pixels in v1.

#### STANDARD ENEMY — profile `enemy_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | same 8×8 × 3 |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile + stored drawSize; warn &gt; 40 wide |
| `ANCHOR` | center / draw point | `drawCombatant` |
| `DEFAULT_SCALE` | **1** | Custom art must **not** inherit random 0.6–1.5 squash. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | |

#### ELITE / LARGE ENEMY — profile `enemy_elite` (future category)

No elite type exists. Do **not** invent gameplay size. If metadata `ELITE_ONLY` is used:

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **36** | ceil(24 × 1.5) — **live** max squash axis (`spawnPolicy.ts` 241–248). 09-25’s 34 used the uniform 1.4 cap. |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | same tile/hit box as standard — **visual only** |
| `DEFAULT_SCALE` | **1** on a 36×36 recommended asset | Do not also multiply by 1.4/1.5 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 56 × 56 | under tile width; warn if &gt; 48 |

Occupancy stays **one tile**. Until an explicit elite flag exists, `ELITE_ONLY` assets are **ineligible** for random pools. Do not infer elite from `scaleY`, HP, `iron_golem`, or `elite_patrol`.

#### BOSS — profile `boss_large`

Bosses may render larger **where the live path already does**. That is **not** “stretch any enemy PNG.”

| Live path | Drawn size @ now | How to key custom art |
| :--- | ---: | :--- |
| Portal Enemy | ≈ 34 × 34 (8×8 × 1.4) | `id.startsWith("boss_")` on the **Enemy**. Do **not** require `isBoss && bossId`. Do **not** set those flags as part of VAL (`VAL-2026-09-22-003`). |
| 8×12 tables | ≈ 34 × 50 | Wired only when `isBoss && bossId` on the **draw object**. Unused today. |
| Boss Rush | 24 × 24 `king.front` | `entity.isBoss === true` on the Rush Enemy. **Never** `pieceType` (lore name). **Never** `id.startsWith("boss_")` (`boss-rush-` uses a hyphen). |

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) live portal |
| `RECOMMENDED_HEIGHT` | **34** live portal; **50** if using the unused 8×12 table profile | Do not silently pick 50 for Rush |
| `MAX_WIDTH` | **80** | tile width; do not span two columns |
| `MAX_HEIGHT` | **72** | above current 50.4; labels/icons/walls will clip — preview must warn vs wall 28 **and** barrier 168 |
| `ANCHOR` | center / draw point (same as now) | |
| `DEFAULT_SCALE` | **1** on the recommended bitmap | Do **not** apply 1.4 on top of a 34×34 upload. A 24×24 “pixel-match” sheet may use the portal profile’s 1.4 to match **today’s portal look only**. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 64 × 72 | still one tile occupancy |
| `ANIMATION_SUPPORT` | 4 stills optional; v1 may be a single `front` | Portal bosses spawn `currentView: "front"` (WX 6528) |

Never assign `enemy_standard` art to a boss and scale it up.

#### SUMMON — profile `summon_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| Same box as player/standard | 24 recommended, 80×60 max | 8×8 `creaturePatterns` |
| Extra | Keep `strokeOwnerTint` around the **runtime bitmap** AABB (`lineWidth` 2, `shadowBlur` 8), not a cell grid | `pieceArt.ts` 791–810 |
| `DEFAULT_SCALE` | **1** | Spawn omits `scaleX/Y` |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | lifespan badge at `(x+18, y−48)` will collide with tall/wide art — warn |

#### FUTURE categories (`#future`)

Portals (r=25 / 33 / 37), walls (28), **barrier towers (168)**, loot, death fragments, ads: **ineligible** until a measured profile exists. v1 library is combatant stills only.

### 4.3 Aspect ratio and pixel-count gates

| Check | Rule |
| :--- | :--- |
| Aspect vs recommended | Warn if `|w/h − recW/recH| > 0.15`. Reject only if the owner did not confirm. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` **after** intended scale (prevents 4096² uploads). |
| Decode | `createImageBitmap` / decode must succeed; on failure → reject, builtin fallback if already assigned. |
| MIME | Trust decoded type, not the extension. |
| Distortion | If the owner insists on a non-matching size, draw **unscaled** (or integer nearest-neighbor) inside the profile box with **transparent pad**. Never `drawImage` stretch to fill. |
| Neighbor overlap | Warn if width or height &gt; **40** desktop (iso Δx) even if under MAX 80. |
| Wall clip | Warn if centered height/2 &gt; **(9 + 28) = 37** px above the draw point (wall prism). |
| Barrier clip | Warn if any combatant art is previewed beside a **168** px tower — readability only; do not raise MAX. |
| URL stubs | `adminGuard` URL checks are **not** this gate. |

### 4.4 SOURCE / NORMALIZED / RENDER_PROFILE (proposed — does not exist)

Introduce only if implementation needs 2×/4× sources:

| Layer | Role |
| :--- | :--- |
| `SOURCE ASSET` | Owner file + hash + original width/height/MIME |
| `NORMALIZED RUNTIME ASSET` | PNG/WebP stills at recommended size (or integer 2×), nearest-neighbor, **no color remap** (ignore `Character.colors`, chess palettes, family color maps) |
| `RENDER PROFILE` | Category box, anchor, default scale, max footprint, whether to apply instance `scaleX/Y` (default **false** for custom) |

Until that pipeline exists, **source === runtime**. Validation uses the category profile directly.

---

## 5. Library metadata

Backend-authoritative (`localStorage` cache only — and that cache **will be wiped** by the version gate unless it is treated as disposable). Suggested Motoko / TS record:

| Field | Type | Notes |
| :--- | :--- | :--- |
| `ASSET_ID` | Text | Stable id. Never reuse after delete. |
| `DISPLAY_NAME` | Text | Owner rename. |
| `ENTITY_CATEGORY` | variant | `#player` `#enemyStandard` `#enemyElite` `#boss` `#summon` `#future(Text)` |
| `ENTITY_FAMILY` | [Text] | Empty = any **`EnemyFamily`**. Do **not** put the string `"boss"` here (`EnemyFamily` has no such member). |
| `ENTITY_IDS` | [Text] | Explicit binds: `player`, `boss_3`, summon `pieceType`, Rush id pattern `boss-rush-*`. Empty = pool-only. Never a Rush lore `pieceType`. |
| `VARIANT_TAGS` | [Text] | Owner tags. Matching is explicit, never name heuristics (`ENEMY_ICONS`, Register, `assignedName`). |
| `ACTIVE` | Bool | Inactive assets are invisible to resolver. |
| `WEIGHT` | Nat | Pool weight. 0 = never randomly selected (direct assign only). |
| `RARITY` | Text | Display/filter only. Does not change combat. |
| `ELITE_ONLY` | Bool | Eligible only if instance is marked elite (future). If no elite flag exists, ineligible for random pools. |
| `BOSS_ONLY` | Bool | Eligible for portal `id.startsWith("boss_")` **or** Rush `isBoss === true`. Not `family === "boss"`. Not `boss-rush` via `boss_`. |
| `UPLOAD_DATE` | Nat | Timestamp. |
| `VERSION` | Nat | Increments on replace. |
| `SOURCE_METADATA` | record | hash, MIME, original w/h, byte length, uploader principal. |
| `RENDER_PROFILE` | Text | `player_standard` / `enemy_standard` / `enemy_elite` / `boss_large` / `summon_standard`. |
| `VALIDATION_STATUS` | variant | `#ok` `#pending` `#invalid(Text)` |
| `BLOB_REF` | opt | Caffeine object id. Prefer blob over URL. |
| `DIRECTION_REFS` | record | opt front/right/left/back stills. Missing directions fall back to `front`, then builtin. |
| `PREVIOUS_VERSION` | opt Text | For revert / dependency inspect. |

Assignments (separate map):

| Field | Meaning |
| :--- | :--- |
| `targetKind` | `#entity` `#family` `#pool` `#pieceType` |
| `targetId` | e.g. `boss_1`, `iron_golem`, `pool_undead_standard`, `wolf` |
| `assetId` | Direct bind (priority 1) |
| `poolId` | Weighted pool (priority 2) |
| `active` | Soft disable without delete |

Pools: `poolId`, `category`, `entries: { assetId, weight }`, `fallback` always builtin. Only `ACTIVE` + `#ok` + matching flags participate. If none qualifies → default pixel visual.

**World-pack bind cannot live only on `EnemyConfig.spriteUrl`.** `generateEnemies` never reads admin enemy templates. Assignments must key off instance fields the spawn path already has: `pieceType` (chess / summon creature keys only), `family` (`EnemyFamily` members only), `id` prefix (`boss_`), `isSummon`, Rush `isBoss`, and a future elite flag.

Canister maps need a **new later** EOP file after `20260901` (`OldActor = {}`), `check-limit` bumped from **5**. Never amend frozen `NewActor`. Never put PNG bytes in Motoko `Text`.

---

## 6. Owner operations

All `#admin` only. Players never see this UI.

| Operation | Behavior |
| :--- | :--- |
| **Upload** | Show category spec → pick files (1–4 directions) → validate → store source + metadata `ACTIVE=false` until owner activates. Not the shop proof picker. |
| **Preview** | Iso diamond **80×40 and 140×70**, Rest/Death follow pane, draw point +9, player 24×24 pixel dummy, one standard enemy dummy, optional boss dummy, drop-shadow **12×4.2**, name/badge/damage-float overlays, **28 px wall** and **168 px barrier** prisms. Actual scale. Warn clip / pad / overlap / **phone Continue zoom** / neighbor Δ / Rest camera. |
| **Activate / deactivate** | Toggle `ACTIVE`. Deactivate → live instances with that id fall back **next frame**. Close `ImageBitmap`s / revoke object URLs. |
| **Rename** | `DISPLAY_NAME` only. |
| **Replace / version** | New bytes, `VERSION++`, keep `ASSET_ID`. Live binds keep the id; runtime reloads blob. |
| **Safe removal** | Dependency inspect first. If any assignment or live instance id matches: block hard-delete, offer deactivate. |
| **Assign to entity / family / pool** | Priority 1 / family / weighted. Pool resolved **once at spawn**. |
| **Weighted random** | `seededRng(hash(instanceId, poolId, poolVersion))` then walk cumulative weights. Do not wait for a missing encounter seed. Do not consume `generateEnemyScaleFactors`’s `Math.random`. |
| **Revert to default** | Clear assignment / `visualAssetId`. Builtin immediately. |
| **Dependency inspection** | List assignments, spawn templates, and (best-effort) live instance ids using the asset. |

Existing URL rows may later be imported as **inactive** library records. Import never auto-activates.

---

## 7. Implementation placement

Per `AGENTS.md` and `VAL-2026-08-31-017`:

- New logic: `src/frontend/src/engine/visualAssets.ts` (+ tests) and optionally `visualPreview.ts`.
- Follow `enemyPixelPatterns.ts` / `spawnPolicy.ts` extraction. **Do not grow the rAF body.**
- WX wiring only: pass `visualAssetId` / resolved bitmap through `DrawCombatantOptions`; one player call-site line.
- If open PR #427 extracts hit-testing, consume that module. If #591 extracts wander, do not fight that split. Do not duplicate `spriteRectsRef`.
- Do not touch RAF loop structure, map generation, turn logic, or damage math.
- Do not add `visualAssetId` to `CharacterStats` (12 fields stay 12).
- Admin panel: new **Visual Library** section behind the existing `!isAdmin` gate. Do not imply walk cycles.

Sibling designs that must not fork this library:

- `EBA-2026-08-31-017` — per-entity `visualMode: none|asset|pool`, default **none**. Implement **after** VAL resolver, not as `drawImage(spriteUrl)`.
- Elite evolution docs — still **PROPOSED**. No live `isElite`.

---

## 8. Validation required before calling VAL “done”

- Empty library: screenshot-identical to today’s chess/summon/boss pixels (portal 34×34 squash, Rush king.front, player colors). Death Realm: player only.
- One assigned PNG: that instance stable across React rerenders, rAF, camera follow (including Rest/Death desktop), battle-init 3-frame skip, M-1 context reset, and `updateCombatant` HP patches.
- Invalid / inactive / corrupt: immediate builtin fallback, no throw, no re-roll.
- New enemy / new boss with zero uploads: generated pixels.
- Occupancy / path / range / click `h=41` / padding 10/14 unchanged.
- Phone Continue + `MOBILE_ZOOM`: custom 24×24 and chess 24×24 share screen size.
- Admin: specs visible before file pick; 72×72 `object-fit:contain` and 192-cell selection canvas are **not** the preview.
- `pnpm typecheck` && `pnpm check`; if Motoko maps added: `mops check`, `python3 scripts/check-eop-stables.py`, `bash scripts/caffeine-import-gate.sh backend`.
- `bash scripts/open-pr-stack-compat.sh --self` on any implementation PR (union, do not concatenate helpers).

---

## 9. Stack note for this docs PR

Open VAL docs PRs already exist (#355, #418, #461, #520, #586). This run adds **new dated files only**:

- `docs/automation/VISUAL_ASSET_LIBRARY_DESIGN_2026-09-26.md`
- `docs/automation/ACTION_IDS_VAL_2026-09-26.md`

Do not rewrite sibling VAL markdown. Oldest-first merge of unique dated files is conflict-free vs those siblings.
