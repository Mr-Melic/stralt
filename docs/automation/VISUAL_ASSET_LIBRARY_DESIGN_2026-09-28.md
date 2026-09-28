# Custom Visual Asset Library & Assignment — 2026-09-28 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-28  
**HEAD:** `0f5363f` (`Merge pull request #332`) — **same SHA as 09-21 … 09-27**  
**WX:** `src/frontend/src/components/WorldExploration.tsx` **19213** lines  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs on `origin/main`:** 08-31 / 09-01 / 09-02 only.  
**Sibling VAL docs (open, not on main):** [#355](https://github.com/Mr-Melic/stralt/pull/355) (09-21), [#418](https://github.com/Mr-Melic/stralt/pull/418) (09-22), [#461](https://github.com/Mr-Melic/stralt/pull/461) (09-23), [#520](https://github.com/Mr-Melic/stralt/pull/520) (09-24), [#586](https://github.com/Mr-Melic/stralt/pull/586) (09-25), [#624](https://github.com/Mr-Melic/stralt/pull/624) (09-26), [#694](https://github.com/Mr-Melic/stralt/pull/694) (09-27).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-28.md`](./ACTION_IDS_VAL_2026-09-28.md)

**Invariant:** custom visuals are **optional**. The current built-in / generated pixel visual remains **default and fallback**. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

Every size below is re-derived from the **live** renderer on this SHA. Invented sprite boxes (64×64, 128×128, 512²) are not used.

---

## 0. Verdict

| Question | 2026-09-28 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (the only `drawImage` string is a comment in `adminVisualStatus.ts` line 5). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them (`getEnemyConfigs` / `spriteUrl` / `getPlayerSpriteConfigs` have **zero** matches in WX). |
| Did recommended pixel boxes change vs 09-27? | **No.** Tile 80×40, cell 3px, draw point tile top+9, standard 24×24, squash max 1.5 → elite rec **36**, portal boss live ≈34×34. |
| What is implemented? | **VAL-2026-09-01-001 only** (admin copy honesty). All other VAL-* remain NEW. |
| Production SHA since 09-21? | Unchanged (`0f5363f`). This run **adds** the #639 iso-grid extract, shake-ctx, rounded-vs-unrounded center, and enemy-summon wrapper-id traps that 09-27 did not freeze. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`.

---

## 1. Delta vs 2026-09-27 (same SHA — architecture siblings)

Pixel boxes did not move. These facts **correct or extend** the 09-27 contract. Implementers on `main` still only see 08-31…09-02.

| Topic | 09-27 said | Live 09-28 | Why it matters for VAL |
| :--- | :--- | :--- | :--- |
| Iso projection ownership | Custom draw must share WX `gridToScreen`; do not write a second projector (`VAL-2026-09-27-002`). Extract siblings were #427 / #514 / #591 / #683. | Open [#639](https://github.com/Mr-Melic/stralt/pull/639) (created 2026-09-26) extracts the **same algebra** into `engine/isoGrid.ts`: `isoTileTopVertexRounded`, `isoTileCenter`, `isoApproxGrid`, `pickIsoTileFromPoint`. This SHA still inlines the formulas at WX 3772–3838 / 8844–8988. | After #639, `visualPreview` / `visualAssets` must **import** those helpers. Copying `gridToScreen` a third time is a duplicate-export / drift bug. 09-27 never named #639. |
| Rounded top vs unrounded center | `gridToScreen` is the top vertex; `tileCenter` is top+th/2. | #639 tests freeze a **rounding split**: draw uses `isoTileTopVertexRounded` (`Math.round`); click cache uses **unrounded** `isoTileCenter`. Mobile zoom with camera can make `top.x !== rounded.x`. | Iso preview of a PNG must sit on the **rounded** draw point the pixel path uses, then `− CHARACTER_Y_OFFSET`. Using `isoTileCenter` as the bitmap origin is a different point (desktop 11 px below the body). |
| Screen shake | rAF `setTransform` + `scale(dpr)` every frame (WX 7263–7264). | After that, the loop `ctx.save()`, `ctx.translate(_shake.x, _shake.y)` (7265–7267), then draws tiles and combatants. `spawnPixelPuff` grabs a **fresh** `getContext("2d")` (9306–9313) and is **not** in that save. | Custom `drawImage` must run on the **same shaken ctx** as `drawCombatant`. A sidecar bitmap blit (the puff pattern) will not shake with the board. |
| Enemy-summon ids | Summon id is `summon-${Math.random()…}` (`summonSpawn.ts` 153). | `spawnEnemySummonUnit` wraps a **non-unique** spell object id `enemy-summon-${unitDef.pieceType}` (271) and then `spawnSummonUnit` still mints a random `summon-…` instance id (153). | Bind `visualAssetId` on the **SpawnedSummon.id**, never the wrapper spell id. Two enemy wolves would hash-collide if the wrapper were the seed. |
| VAL docs siblings | #355…#624 | **#694** (09-27 fact sheet) is now also open. | This run adds **new dated files only**. Do not rewrite 09-27 markdown. |
| Rest/Death desktop cam | Paint ignores `cameraRef` when `isDesktop` (`VAL-2026-09-27-001`). | Re-verified. `isoViewNow` in #639 still passes `camX: isDesktop ? 0 : cameraRef.current.x`. | Preview callers after #639 must apply the **same desktop 0 gate**. Do not pass live `cameraRef` at 1280 px. |

Unchanged from 09-27 (re-verified on this tree):

- Portal boss Enemy has `family: "boss"` (WX 6568) but **no** `isBoss` / `bossId`; paint is chess 8×8 × 1.4 ≈ 34×34.
- Battle start writes `isBoss` / `bossId` onto **CombatantEntry only** (WX 11958–11984), not onto the Enemy that `drawCombatant` receives from `combatantsRef`.
- `drawCombatant` boss branch requires `isBoss && bossId` (`pieceArt.ts` 856). Live portal Enemy matches **neither**.
- Boss Rush sets `isBoss: true` (WX 5340), omits `bossId` / `scaleX`, `pieceType` is a **lore name**. Rush id is `boss-rush-…` (hyphen) — `id.startsWith("boss_")` is **false**.
- Hit test uses `entry.x,y,w,h` (desktop **80×41**), not stored `drawSize` 80×60. Padding 10 mouse (WX 10127) / 14 touch (10819).
- `pointerToRenderSpace` uses CSS `canvasSize` (WX 8994–9004).
- rAF may `canvas.width=` (7256–7261) **and** `setTransform`+`scale(dpr)` every frame. M-1 zeros width (7224–7229). Context restore sizes from `window.innerWidth` (13830–13834).
- Player is **not** in `combatantsRef`. Player stills are a second call site (WX 8315–8326). `drawOrder` **99999**.
- `drawPixelPattern` trailing `ctx.restore()` has no matching `save` (3883). Moving-enemy `save` wraps draw (8057–8076).
- CSS `image-rendering: pixelated` on world canvas (WX 17890) and global `canvas` (`index.css` 652–655). `imageSmoothingEnabled` is never set.
- `InitiativeStrip` `ENEMY_ICONS` is name-regex emoji (`InitiativeStrip.tsx` 65–80). Enemy Register is flavor lore.
- Version-gate wipe keeps only `pbv_tier_spawn_config`, `pbv_levelup_config`, `*_inventory` (`versionGate.ts` 7–12).
- CharacterCreation hardcodes an 8-cell box on a **320×280** backing canvas (`CharacterCreation.tsx` 151, 454–455). Selection painter is 192×192 cells. Portrait 60×60 / 6 px (WX 3720, 18111–18114).
- Shop `proofFileUrl` may be `data:image/*` up to **524_288** (`adminSafety.ts` 137); combat `unsafeUrl` **rejects** `data:` and `file:` (`adminGuard.mo` 89–94). Landing ads need **https** (`requireHttpsUrl` 97–104).
- Tablet 768–1024: tiles 80×40, camera follow (`isDesktop` is `innerWidth > 1024`, WX 877). Phone after Continue: 140×70 tiles, cell still 3px.
- Battle-init skips while `battleInitFrameRef < 3` (WX 7238–7245). Comment says “first 2 frames”; code skips **3**. Do not bind art there.
- Iso neighbor Δ = `(40, 20)` ≈ 44.7 desktop (WX 3785–3786).
- Drop-shadow desktop: `sw = min(80*0.35, 40*0.3) = 12`, `sh = 4.2` (WX 8033–8054).
- Squash max **1.5** on one axis (`spawnPolicy.ts` 239–248). Live `generateEnemyScaleFactors()` is bare `Math.random` (WX 5768) — not shared with `pickEnemyLevelFromTiers`.
- `toCombatantEntry` strips `scaleX/Y`, `family`, `assignedName`, `currentView`, and would strip `visualAssetId` (`combatantStore.ts` 141–169). Bind on **Enemy**.
- `Enemy.scaleX` / `scaleY` / `currentView` are required on the TS type (`gameTypes.ts` 297–301). Rush/summons omit scale at runtime; `drawCombatant` defaults missing scale to 1 (`pieceArt.ts` 846–848). Player-side summons set `currentView: "front"` (`summonSpawn.ts` 177–178) and omit scale.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886); unpaired `ctx.restore()` at 3883. Comment at 3840 (“match tile dimensions exactly”) is **false** (8×8×3 = 24 ≠ 80×40). |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782); **no** restore |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023 |
| `engine/enemyPixelPatterns.ts` | Boss 8×12 tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432; family 434–504 |
| WX player | `getPersistedPiecePattern(pieceType, playerView)` then `drawPixelPattern` | 8289, 8315–8326 — **not** `drawCombatant` |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3760, 18111–18116 |
| Character creation | 8×8 × `scale = 10` → **80×80** art on **320×280** backing / 240×210 CSS | `CharacterCreation.tsx` 151–178, 454–463 |
| Character selection | `size=120` → `internalSize=240` → `pixelSize=floor(240/10)=24` → **192×192** cells | `CharacterSelection.tsx` 310–337 |
| Death juice | `fillRect` fragments | `engine/effects.ts` 282–292 |
| Portal FX | ellipse whirlpool **radius 25**, translated `(x, y-10)` | WX 3898–3919. Rest extra glow **r=33** (`radius+8`, 3928). Boss star outer **r=37** (`radius+12`, 3965). |
| Barrier tower | 6 iso layers × 28 px = **168** | `barrierRender.ts` 15–16 (comment still cites stale WX 3273; live `wallHeight` is 4085) |
| Ground Doka | glow r=**14**, body r=**7**, bob ±**3**, fillText `"D"` | WX 8454–8488 |
| Summon spawn puff | 10 `fillRect` particles, alpha 0.7 | `spawnPixelPuff` (`pieceArt.ts` 1036–1060), WX 9308–9313 — **not** on the shaken rAF ctx |
| Screen shake | `effectsManager.getShakeOffset()` then `translate` | WX 7265–7267 |

`Character.pixelPattern` may be persisted at creation but WorldExploration **never reads it**. `getPersistedPiecePattern` (`pieceArt.ts` 653–658) is **pieceType-only**.

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects `getBossPattern`, `getFamilyPattern`, `getFamilyColors`, `drawPattern`, `characterYOffset`. It does **not** accept a bitmap. A custom path must be a **new optional top branch** (or a new option). Do **not** implement `drawImage` inside `drawPixelPattern` (fillRect + unpaired restore).

### 2.2 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text | **No.** WX has zero `getEnemyConfigs` / `spriteUrl`. `useGetEnemyConfigs` (`useSpellQueries.ts`) is **admin React Query**. |
| `PlayerSpriteConfig` direction + walk-frame URL arrays | Canister + Sprite panel | **No.** Walk arrays cap **16** (`adminGuard.mo`). Combat never samples them. Heading still “Walk Animation Frames” (`AdminDashboard.tsx` 1590). |
| Login ad boxes | `adminSetAdBox` URL strings | Landing `<img>` after `requireHttpsUrl` — **not combat**. |
| GameKey shop thumb | `<img>` | IAP chrome, not combat. |
| Admin sprite preview | 72×72 `<img object-fit:contain>` (`AdminDashboard.tsx` 1484–1507) | **Not** the iso preview. Distorts silently — forbidden for the library gate. |
| Shop proof | `data:image/*` ≤ 524_288 (`adminSafety.ts` 137); JPEG allowed | Admin KYC, not combat. Combat `unsafeUrl` rejects `data:`. |

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`).

`adminGuard.validateOptionalUrl` checks **length ≤ 2048** (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–94). It does **not** decode images. Empty URL is valid. `MAX_JSON_BLOB = 32_768` (line 9).

`adminContract.test.ts` + `adminVisualStatus.test.ts`: empty `spriteUrl` tuple is **not** a custom asset.

Caffeine `ExternalBlob` is bindgen plumbing (`backend.ts` 54–55). No visual-asset blob type exists. New canister maps need a **new later** migration file after `20260901` (`OldActor = {}`). Never store raw base64 in Motoko `Text`.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"` — **not** in `combatantsRef`. Chess `pieceType` + 4-way `playerView` (WX 11490–11493) | 8×8 `chessPiecePatterns` + character colors. Second call site. `drawOrder` 99999. Cell 2 = primary, extra = accent (8315–8325). |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\`` (WX 5809), random chess `pieceType`, `family` starts `"default"` | `drawCombatant` branch 4. Family 30% is **stats only**. Instance squash stored (WX 5768 / 5820–5821). |
| **ELITE / LARGE ENEMY** | **No type.** `generateEnemyScaleFactors` stores visual squash (max **1.5** on one axis). `elite_patrol` is a world-feature catalog key (`worldFeatures.ts` 44, 454). | Same chess path × instance scale |
| **BOSS (portal)** | `id: \`boss_${bossConf.id}_${Date.now()}\`` (WX 6524), `scaleX/Y = 1.4` (6535–6536), `family: "boss"` (6568). **No** `isBoss` / `bossId` on the Enemy. | Chess 8×8 × 1.4. 8×12 tables unused. |
| **BOSS (Rush)** | `id: \`boss-rush-${roomIndex}-*\`` (hyphen), `isBoss: true`, lore `pieceType`, **no** `scaleX/Y` / `bossId` | `drawCombatant` branch 1 fails (`!bossId`); branch 4 + unknown pieceType → `king.front` 24×24 |
| **SUMMON** | Instance `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` 153). Enemy wrapper spell id `enemy-summon-${pieceType}` (271) is **not** the instance id. Omits `scaleX/Y`. Sprite-rect `kind` is `"summon"` when `side === "player"` (WX 8095). | 8×8 `creaturePatterns` + `strokeOwnerTint` (`pieceArt.ts` 791–810, 923–926) |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use `getEnemyFamilyPixelPattern` (`enemyPixelPatterns.ts` 500–504) |
| **Death Realm** | `isDeathRealm` → **no enemies** (WX 6576–6578) | Player stills only. Desktop paint stays cam 0. |
| **Future** | Portals (r=25 / rest glow 33 / boss star 37), hazards, loot (**coin r=7**), walls (28), **barrier towers (168)**, ads, death fragments, dust motes | Not `drawCombatant` |

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`. **`"boss"` is not a member.** Assigned with 30% chance (`FAMILY_VARIANT_CHANCE = 0.3`, `spawnPolicy.ts` 35). Changes **stats**, not the default draw path.

Family grids exist but are unused for those 30% units (drawn sizes @ scale 1 × 3px):

| Family | Cells (cols × rows) | Drawn @ scale 1 |
| :--- | ---: | ---: |
| wraith_bishop | 3 × 8 | 9 × 24 |
| iron_golem | 6 × 5 | 18 × 15 |
| plague_rat | 6 × 5 | 18 × 15 |
| ember_knight | 5 × 8 | 15 × 24 |
| tide_shade | 7 × 4 | 21 × 12 |
| bone_scribe | 5 × 8 | 15 × 24 |
| void_mirror | 6 × 6 | 18 × 18 |
| default | 3 × 3 | 9 × 9 |

Do **not** publish those grids as the STANDARD ENEMY upload spec. Custom **family** assignment is a new presentation bind (`VAL-2026-08-31-013`), not a repair of this gap.

Admin `PlayerSpriteConfig` includes the string `"custom"`. Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11). Do not treat admin `"custom"` as a combat visual category.

`InitiativeStrip.ENEMY_ICONS` and Enemy Register lore are **not** catalogs. v1 custom stills do **not** replace strip emoji. Variant matching is explicit metadata, never name heuristics.

### 2.4 Gameplay footprint is tile-based

`engine/occupancy.ts` 84–96: one combatant per logical tile. No width/height. Spell range overlay is a **tile diamond** fill, not a sprite AABB.

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
player-side summon: kind "summon"; other combatants: kind "enemy"
player: kind "player", drawOrder 99999
```

Custom art must never change occupancy, movement, range, targeting, or combat hitboxes. Do not rewrite `drawSize`, hit `h`, or `kind` from bitmap width/height.

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` (WX 8033–8054). It does not track sprite pixels. Tall custom art will visually disconnect from the shadow; preview must warn. Do not grow the shadow from bitmap size.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors` | spawn | `Math.random` (WX 5768), then **stored** on `scaleX`/`scaleY` |
| Enemy / portal-boss ids | spawn | `Date.now()` in the id string (5809, 6524) |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` (5864) |
| Battle stats | `getEnemyBaseStats` | `seededRng` from charCode-sum of `seedKey` (`progression.ts` 163–170) |
| Map tiles / Boss Rush cells | generate | `seededRng(seed)` (WX 4089+) |
| Player-summon id | spawn | `summon-${Math.random().toString(36).slice(2)}` (`summonSpawn.ts` 153) — **stable for the live object** |
| Enemy-summon wrapper | spawn | `enemy-summon-${pieceType}` is the **spell** id (271), not the instance |
| Screen shake / wander pulse | every frame | `Date.now()` in alpha/sin — **glow only**, not art pick |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`seededRng` (`combatMath.ts` 122–128) is the correct primitive for weighted pool picks. Visual selection must be **written onto the Enemy instance at spawn** (`visualAssetId`) so React rerenders and rAF cannot change appearance.

Do **not** block implementation on inventing a map-level encounter seed. Hash the **already unique instance id** (plus `poolId` / assignment config) the same way `getEnemyBaseStats` hashes `seedKey`.

**Never call `Math.random()` or pick a pool member inside `drawCombatant` / the rAF loop / a React render.**

If the bound id later fails validation, fall back to builtin — **do not re-roll in render**.

Custom art must **not** inherit instance `scaleX`/`scaleY` 0.6–1.5 squash. That squash is a pixel-art variety trick. Stretching a painted illustration with it is the forbidden arbitrary stretch.

### 2.6 Owner gate

- `App.tsx` 291: `isAdmin = userRole === "admin"`.
- `AdminDashboard.tsx` 5546: hard deny if `!isAdmin`.
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- `AGENTS.md`: admin/debug must be gated; never ship to normal players.

Library UI is **admin-only**. Players never upload or choose combat art.

### 2.7 Mobile / tablet — Continue is live

- `SmallScreenGuard` **warns**; **Continue anyway** (`App.tsx` 25, 112–125).
- Bypass persisted in `sessionStorage` `pbv_small_screen_continue`.
- Overlay only while `isSmallScreen && !smallScreenBypass`. After Continue, the full game tree mounts.
- `useIsMobile(breakpoint = 768)` (`hooks/use-mobile.tsx` 17–26) then sets WX `MOBILE_ZOOM = 1.75` → tiles **140×70** (WX 957–959).
- Camera follow: phone (`isMobile`) and tablet (`innerWidth ≤ 1024`). Desktop (`> 1024`) locks offset 0 **except** Rest/Death which **writes** `cameraRef` and paint **ignores** it on desktop.
- `getCameraFollowSpeed` (`worldHelpers.ts` 8–18): mobile **0.35**, width &lt; 1200 → **0.12**, else **0.08**. Called only after Rest/Death return **and** after the desktop lock — so the 0.08 band is **non-desktop only**.
- **Pixel patterns do not multiply by `MOBILE_ZOOM`.** A 24×24 character is relatively smaller on zoomed tiles.

Custom assets follow the same rule unless a render profile explicitly opts into tile-relative scale (not the default). **Iso preview must include a mobile-zoom pane** (140×70 diamond, 24×24 art unscaled).

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
- Failures log once (reuse `logPatternLookupFailed` throttle, `pieceArt.ts` 40–55), never throw, never block combat.

```ts
// src/frontend/src/engine/visualAssets.ts  (not implemented)
function resolveRuntimeVisual(entity, library): RuntimeVisual
  // { kind: "custom", bitmap, profile } | { kind: "builtin" }
```

`drawCombatant` may grow **one optional branch at the top**: if resolve returns a decoded bitmap + profile, `drawImage` centered on the same draw point as `drawPixelPattern`; otherwise branches 1–4 run unchanged. Player needs a **second** one-line site (WX 8315). Empty library / omitted option ⇒ **identity** with today.

Cache `ImageBitmap` keyed by `ASSET_ID`+`VERSION`. `canvas.width=` (7256–7261, 7227–7228, 13833) **clears the 2D context** but does not revoke bitmaps. Re-decode only on replace/version.

---

## 4. Derived render measurements (do not invent)

All sizes are **logical CSS pixels** after `ctx.scale(dpr)` (WX 7264). Source bitmaps may be integer multiples for sharpness. `imageSmoothingEnabled` is unset; CSS `pixelated` is display-time only — set `imageSmoothingEnabled = false` on custom `drawImage` so 2× sources stay crisp.

### 4.1 Tile, anchor, scale

| Quantity | Desktop | Mobile-zoom (`isMobile` after Continue) | Source |
| :--- | ---: | ---: | :--- |
| Iso diamond | 80 × 40 | 140 × 70 | `TILE_*` × `MOBILE_ZOOM` 1.75 |
| `gridToScreen` | **rounded top vertex** | same | WX 3772–3790; after #639 = `isoTileTopVertexRounded` |
| Click-cache center | unrounded top + th/2 | same | after #639 = `isoTileCenter` |
| Tile visual center (`tileCenter`) | top + `th/2` → +20 / +35 | | WX 3806–3811 — **does not** add `CHARACTER_Y_OFFSET` |
| Character draw point | `(tileTopX, tileTopY − CHARACTER_Y_OFFSET)` = `(tileTopX, tileTopY + 9)` | same offset | `drawCombatant` 851–852; player 8317–8319 |
| Pattern **anchor** | **center of the pattern** on the draw point | same | `startX = x − patternWidth/2` (WX 3860–3861, `pieceArt.ts` 764–765) |
| Drop-shadow foot | `(tileTopX, tileTopY + th/2 + 4)`, desktop **12 × 4.2** | 24.5 × 8.575 | WX 8033–8054 / 8291–8312 |
| World cell size | **3×3** logical px × `scaleX`/`scaleY` | **not** × 1.75 | WX 3855 |
| Default pattern | **8×8 cells** | | `chessPiecePatterns` (`pieceArt.ts` 83–94), `creaturePatterns` (347–357) |
| Default drawn size @ scale 1 | **24 × 24** | 24 × 24 | 8 × 3 |
| Enemy instance scale | 0.6–1.4 uniform, or 0.6–0.9 × 1.1–1.5 squash | same | `spawnPolicy.ts` 227–256 |
| Max standard drawn @ 1.5 | **36 × 36** (tall/wide axis) | 36 × 36 | 24 × 1.5 |
| Boss pattern tables | **8×12 cells** | | `enemyPixelPatterns.ts` 10–24 |
| Boss tables @ 1.0 | **24 × 36** | | 8×3 × 12×3 |
| Portal boss **live** | chess 8×8 × 1.4 ≈ **33.6 × 33.6** | | WX 6535–6536; no `isBoss` |
| Boss tables @ 1.4 (unused live) | **33.6 × 50.4** | | |
| Boss Rush live | `king.front` **24 × 24** | | no scale, lore `pieceType` |
| Portrait | 60×60 canvas, 6px cells → 48×48 art | | 3720, 18111–18114 |
| Creation preview | 80×80 pattern on 320×280 backing | | `CharacterCreation.tsx` 151, 454 |
| Name label | `screenPos.y − 34`, bold 11px Arial | | WX 8122–8136 |
| Level label | name + 14 | | 8123 |
| Hover damage | bold 14px at `y − 44`; extra line `y − 58` | | 8204–8214 |
| Status icons | 16×16, max 4, at drawY − 30 | | 8246–8248 / 8362–8364 |
| Wander ring | r=**15** at draw point | | 8229–8234 |
| Summon lifespan badge | `(x + 18, y − 48)`, pill h=12 | | 8146–8154 |
| Sprite hit `drawSize` | 80 × 60 stored | 140 × 105 | 8103, 8352 |
| Sprite hit **tested** box | **80 × 41** | 140 × 61.5 | registered `h` |
| Wall extrusion | 28 px | | 4085 |
| Barrier tower | 168 px | | `barrierRender.ts` 15–16 |
| Portal FX | r=25 / rest 33 / boss star 37 | | 3898, 3928, 3965 |
| Ground Doka | glow 14 / body 7 | | 8470–8484 |
| Puff | `tileW * 0.18` → **14.4 / 25.2** | | 9312 |
| Viewport | warn &lt;768; Continue enters | zoomed tiles | `SmallScreenGuard` + `useIsMobile` |

**Anchor for custom bitmaps must match the pixel path:** center the image on `(roundedTileTopX, roundedTileTopY + 9)`, not on tile center, not on unrounded `isoTileCenter`, and not on a foot bone, unless a future render profile adds an explicit `anchor: "foot"` (not in the current renderer).

Do **not** use the 320×280 creation canvas, 72×72 admin `<img>`, or 60×60 portrait as recommended upload size.

### 4.2 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**.

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` accepted if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. Shop proof JPEG is a **different** surface. SVG/GIF not used in combat. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | `playerView` updates on step (WX 11490–11493). Walk-frame arrays exist on `PlayerSpriteConfig` but are **never drawn**. Do not implement walk cycles in v1. |
| `MAX_FILE_SIZE` | **Not measured in-repo.** `adminGuard.MAX_URL = 2048` is URL text, not bytes. Shop proof 524_288 is a **different** surface. | Starting reject: **256 KiB per still** after encode until IC ingress / object-store limits are measured. Do not store raw base64 in Motoko `Text`. Do not use `data:` URLs (`unsafeUrl` already forbids them on stubs). |

#### PLAYER CHARACTER — profile `player_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **24** (or **48** @2× source) | 8×8 × 3 |
| `RECOMMENDED_HEIGHT` | **24** (or **48** @2×) | same |
| `MAX_WIDTH` | **80** | `TILE_WIDTH`; wider overlaps neighbor diamonds (half-width 40; iso pitch ≈ 44.7) |
| `MAX_HEIGHT` | **60** | sprite `drawSize.h` desktop; **clips status icons** (drawY−30) |
| `ANCHOR` | center on draw point (rounded tile top + 9) | `drawPixelPattern` |
| `DEFAULT_SCALE` | **1** | player draw omits scale (defaults `{1,1}`) |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | 2× default; labels at y−34 stay clear of a 24-tall sprite |

Portrait HUD and character-creation/selection canvases stay generated pixels in v1. Bound PNGs **ignore** the piece color picker.

#### STANDARD ENEMY — profile `enemy_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | same 8×8 × 3 |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile + stored hit box |
| `ANCHOR` | center / draw point | `drawCombatant` |
| `DEFAULT_SCALE` | **1** | Custom art must **not** inherit random 0.6–1.5 squash. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | |

#### ELITE / LARGE ENEMY — profile `enemy_elite` (future category)

No elite type exists. Do **not** invent gameplay size. If metadata `ELITE_ONLY` is used:

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **36** | ceil(24 × 1.5) — current max instance squash |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | same tile/hit box as standard — **visual only** |
| `DEFAULT_SCALE` | **1** on a 36×36 recommended asset | Do not also multiply by 1.5 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 56 × 56 | under tile width; warn if &gt; 48 |

Occupancy stays **one tile**. Until an explicit elite flag exists, `ELITE_ONLY` assets are **ineligible** for random pools. Do not infer elite from `scaleY`, HP, `iron_golem`, or `elite_patrol`.

#### BOSS — profile `boss_large`

Do **not** key this profile off `isBoss`, `bossId`, or `family === "boss"`. Live portal paint is chess 8×8 × 1.4. Key off `id.startsWith("boss_")` for portal instances. Rush (`boss-rush-`, hyphen) is a **separate** bind (`boss_rush`) defaulting to 24×24 until an owner assigns `boss_large`.

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) matching **live portal** size |
| `RECOMMENDED_HEIGHT` | **34** live portal / **50** if using unused 8×12 tables | ceil(12 × 3 × 1.4) = 51 for the table look |
| `MAX_WIDTH` | **80** | tile width; do not span two columns |
| `MAX_HEIGHT` | **72** | above current 50.4; labels/icons will clip — preview must warn |
| `ANCHOR` | center / draw point (same as now) | pixel path |
| `DEFAULT_SCALE` | **1** on the recommended bitmap | Do **not** apply 1.4 on top of a 34×34 upload. If the owner uploads a 24×24 “pixel-match” sheet, the portal-boss profile may apply 1.4 to match today’s look. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 64 × 72 | still one tile occupancy |
| `ANIMATION_SUPPORT` | 4 stills optional; v1 may be a single `front` | Portal bosses spawn `currentView: "front"` (WX 6528) |

Never assign `enemy_standard` art to a portal boss and scale it up.

#### SUMMON — profile `summon_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| Same box as player/standard | 24 recommended, 80×60 max | 8×8 `creaturePatterns` |
| Extra | Keep `strokeOwnerTint` (green/red) around the **runtime** footprint | `pieceArt.ts` 791–810, 923–926 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | lifespan badge at `(x+18, y−48)` will collide with tall/wide art — warn |
| Bind key | `SpawnedSummon.id` | Not `enemy-summon-${pieceType}` |

#### FUTURE categories (`#future`)

Portals, walls, barriers, loot, death fragments, ads, puffs: **ineligible** until a measured profile exists. v1 library is combatant stills only.

### 4.3 Aspect ratio and pixel-count gates

| Check | Rule |
| :--- | :--- |
| Aspect vs recommended | Warn if `|w/h − recW/recH| > 0.15`. Reject only if the owner did not confirm. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` **after** intended scale (prevents 4096² uploads). |
| Decode | `createImageBitmap` / decode must succeed; on failure → reject, builtin fallback if already assigned. |
| MIME | Trust decoded type, not the extension. Shop JPEG proof ≠ combat PNG. |
| Distortion | If the owner insists on a non-matching size, draw **unscaled** (or integer nearest-neighbor) inside the profile box with **transparent pad**. Never `drawImage` stretch to fill. |
| URL stubs | `adminGuard` URL / https checks are **not** this gate. Do not treat a passing URL as a valid asset. |

### 4.4 SOURCE / NORMALIZED / RENDER_PROFILE (proposed — does not exist)

Introduce only if implementation needs 2×/4× sources:

| Layer | Role |
| :--- | :--- |
| `SOURCE ASSET` | Owner file + hash + original width/height/MIME |
| `NORMALIZED RUNTIME ASSET` | PNG/WebP stills at recommended size (or integer 2×), nearest-neighbor, no color remap |
| `RENDER PROFILE` | Category box, anchor, default scale, max footprint, whether to apply instance `scaleX/Y` (default **false** for custom) |

Until that pipeline exists, **source === runtime**. Validation uses the category profile directly.

---

## 5. Library metadata

Backend-authoritative (`localStorage` cache only). Version-gate wipe will drop a local-only library — do not store the only copy in `localStorage`. Suggested Motoko / TS record:

| Field | Type | Notes |
| :--- | :--- | :--- |
| `ASSET_ID` | Text | Stable id. Never reuse after delete. |
| `DISPLAY_NAME` | Text | Owner rename. |
| `ENTITY_CATEGORY` | variant | `#player` `#enemyStandard` `#enemyElite` `#boss` `#summon` `#future(Text)` |
| `ENTITY_FAMILY` | [Text] | Empty = any family. Else `EnemyFamily` / summon pieceType. Never `"boss"` (not in the union). |
| `ENTITY_IDS` | [Text] | Explicit binds: `player`, `boss_3`, summon `pieceType`, future ids. Empty = pool-only. |
| `VARIANT_TAGS` | [Text] | Owner tags. Matching is explicit, never `ENEMY_ICONS` regex or name heuristics. |
| `ACTIVE` | Bool | Inactive assets are invisible to resolver. |
| `WEIGHT` | Nat | Pool weight. 0 = never randomly selected (direct assign only). |
| `RARITY` | Text | Display/filter only. Does not change combat. |
| `ELITE_ONLY` | Bool | Eligible only if instance is marked elite (future). If no elite flag exists, ineligible for random pools. |
| `BOSS_ONLY` | Bool | Eligible only for `id.startsWith("boss_")` portal instances — **not** Rush hyphen ids, **not** `isBoss` on CombatantEntry. |
| `UPLOAD_DATE` | Nat | Timestamp. |
| `VERSION` | Nat | Increments on replace. |
| `SOURCE_METADATA` | record | hash, MIME, original w/h, byte length, uploader principal. |
| `RENDER_PROFILE` | Text | `player_standard` / `enemy_standard` / `enemy_elite` / `boss_large` / `summon_standard`. |
| `VALIDATION_STATUS` | variant | `#ok` `#pending` `#invalid(Text)` |
| `BLOB_REF` | opt | Caffeine object id **or** (legacy import) URL. Prefer blob. |
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

**World-pack bind cannot live only on `EnemyConfig.spriteUrl`.** `generateEnemies` never reads admin enemy templates. Assignments must key off instance fields the spawn path already has: `pieceType`, `family`, `id` prefix (`boss_` vs `boss-rush-` vs `summon-` vs `enemy-`), `isSummon`, and a future elite flag.

`nsKey` (`userId_slotN_…`, WX 866–872) is a **progress cache prefix**, not a library namespace.

---

## 6. Owner operations

All `#admin` only. Players never see this UI.

| Operation | Behavior |
| :--- | :--- |
| **Upload** | Show category spec → pick files (1–4 directions) → validate → store source + metadata `ACTIVE=false` until owner activates. |
| **Preview** | Iso diamond **80×40 and 140×70**, **rounded** top +9, player 24×24 pixel dummy, one standard enemy dummy, optional portal-boss 34×34 dummy, drop-shadow foot, name/badge/status overlays, wall 28 / barrier 168 on the same `x+y`, Rest/Death **cam 0 on desktop**. Warn clip / pad / overlap / **phone Continue zoom**. Do not pan a 1280 Rest map. |
| **Activate / deactivate** | Toggle `ACTIVE`. Deactivate → live instances with that id fall back **next frame** (resolver), no re-roll. |
| **Rename** | `DISPLAY_NAME` only. |
| **Replace / version** | New bytes, `VERSION++`, keep `ASSET_ID`. Live binds keep the id; runtime reloads blob. |
| **Safe removal** | Dependency inspect first. If any assignment or live instance id matches: block hard-delete, offer deactivate. |
| **Assign to entity / family / pool** | Priority 1 / family / weighted. Pool resolved **once at spawn**. |
| **Weighted random** | `seededRng(hash(instanceId, poolId, poolVersion))` then walk cumulative weights. Do not wait for a missing encounter seed. Do not hash `enemy-summon-${pieceType}`. |
| **Revert to default** | Clear assignment / `visualAssetId`. Builtin immediately. |
| **Dependency inspection** | List assignments, spawn templates, and (best-effort) live instance ids using the asset. |

Existing URL rows may later be imported as **inactive** library records (`VAL-2026-08-31-012`). Import never auto-activates.

---

## 7. Implementation placement

Per `AGENTS.md` and `VAL-2026-08-31-017`:

- New logic: `src/frontend/src/engine/visualAssets.ts` (+ tests) and optionally `visualPreview.ts`.
- After [#639](https://github.com/Mr-Melic/stralt/pull/639): import `isoTileTopVertexRounded` / `IsoView` — **do not** add a second `isoTileTopVertexRounded`.
- After [#427](https://github.com/Mr-Melic/stralt/pull/427): import the hit-test writer; keep tile-derived boxes.
- After [#514](https://github.com/Mr-Melic/stralt/pull/514) / [#591](https://github.com/Mr-Melic/stralt/pull/591): do not pick art from wander rolls.
- After [#683](https://github.com/Mr-Melic/stralt/pull/683): import `planGroundDokaLoot`; coins stay generated.
- Pixel tables already live in `engine/enemyPixelPatterns.ts` — **do not move them back into WX**.
- `DrawCombatantOptions`: add an optional custom-visual hook; default omitted = today’s fillRect path.
- WorldExploration: **wiring only** — pass `visualAssetId` into `drawCombatant` / player site. Draw inside the shaken ctx. **Do not** edit the RAF loop, map generation, turn logic, or damage math.
- Motoko metadata + blob refs: `adminGuard` + `#admin` only. Bytes in object storage, not Candid `Text`. New maps = new migration after `20260901`.
- Tests: empty library `[]` → `{ kind: "builtin" }`; inactive/corrupt id → builtin; 100 fake renders same `visualAssetId`; occupancy/`drawSize` ignore bitmap size; two enemy summons of the same `pieceType` can bind different assets.

---

## 8. Risk register

| Risk | Mitigation |
| :--- | :--- |
| Random flicker | Bind at spawn; tests: 100 fake renders same `visualAssetId` |
| Stretching enemy art onto bosses | Separate `boss_large`; never `scale(1.4)` a 24×24 upload onto a portal boss **and** never key off `isBoss` |
| Occupancy / click box from pixels | Keep tested 80×41 + pad 10/14; occupancy one cell |
| Stale `spriteUrl` wired by mistake | VAL-012 + implemented VAL-2026-09-01-001; still do not `drawImage(spriteUrl)` |
| Duplicate iso projector vs #639 | Import `isoGrid.ts`; union ≠ concatenate |
| Preview uses unrounded center | Draw on `isoTileTopVertexRounded` +9 |
| Sidecar ctx misses shake | Draw on the rAF ctx after `translate(shake)` |
| Enemy-summon hash collision | Seed from instance id, not wrapper spell id |
| Family owners expect family pixels | Today family art is **ghost/minion only**. Custom family assign is new presentation (VAL-013) |
| Phone art looks “too small” | Match builtin: do not apply `MOBILE_ZOOM` to bitmaps by default |
| Walk-frame UI → hunter adds GIF atlas | Honesty copy + VAL-018 stills-only |
| Ad “Custom Visual” “fixed” by removing landing imgs | Ads already render over https; leave that copy |
| Resolver dumped into 19k-line WX | Follow `enemyPixelPatterns.ts` / `isoGrid.ts` extraction |
| `localStorage` library wiped | Version gate preserves only tier/levelup/inventory |

---

## 9. What this run did not do

- No production / gameplay code changes.
- No `drawImage` wiring.
- No Motoko library types.
- Did not re-issue `VAL-2026-08-31-*` … `VAL-2026-09-27-*` as new implementation work.
- Did not treat open VAL docs PRs #355 / #418 / #461 / #520 / #586 / #624 / #694 as vehicles for code.
- Did not implement #639; documented how VAL must consume it.
