# Custom Visual Asset Library & Assignment — 2026-09-27 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-27  
**HEAD:** `0f5363f` (`Merge pull request #332`) — **same SHA as 09-21 … 09-26**  
**WX:** `src/frontend/src/components/WorldExploration.tsx` **19213** lines  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs on `origin/main`:** 08-31 / 09-01 / 09-02 only.  
**Sibling VAL docs (open, not on main):** [#355](https://github.com/Mr-Melic/stralt/pull/355) (09-21), [#418](https://github.com/Mr-Melic/stralt/pull/418) (09-22), [#461](https://github.com/Mr-Melic/stralt/pull/461) (09-23), [#520](https://github.com/Mr-Melic/stralt/pull/520) (09-24), [#586](https://github.com/Mr-Melic/stralt/pull/586) (09-25), [#624](https://github.com/Mr-Melic/stralt/pull/624) (09-26).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-27.md`](./ACTION_IDS_VAL_2026-09-27.md)

**Invariant:** custom visuals are **optional**. The current built-in / generated pixel visual remains **default and fallback**. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

Every size below is re-derived from the **live** renderer on this SHA. Invented sprite boxes (64×64, 128×128, 512²) are not used.

---

## 0. Verdict

| Question | 2026-09-27 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (the only `drawImage` string is a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them (`getEnemyConfigs` / `spriteUrl` have **zero** matches in WX). |
| Did recommended pixel boxes change vs 09-26? | **No.** Tile 80×40, cell 3px, draw point tile top+9, standard 24×24, squash max 1.5 → elite rec **36**, portal boss live ≈34×34. |
| What is implemented? | **VAL-2026-09-01-001 only** (admin copy honesty). All other VAL-* remain NEW. |
| Production SHA since 09-21? | Unchanged (`0f5363f`). This run **corrects** 09-26 Rest/Death desktop follow and names overlay / puff / ground-Doka / depth / color-map traps 09-26 did not freeze. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`.

---

## 1. Delta vs 2026-09-26 (same SHA — contract corrections)

Pixel boxes did not move. These facts **correct or extend** the 09-26 contract. Implementers on `main` still only see 08-31…09-02; 09-26 IDs did not cover them.

| Topic | 09-26 said | Live 09-27 | Why it matters for VAL |
| :--- | :--- | :--- | :--- |
| Rest/Death desktop camera | Preview a follow pane even at **>1024** (`VAL-2026-09-26-005`) | `updateCameraToFollowPlayer` **writes** `cameraRef` on Rest/Death (WX 5877–5893) **before** the desktop lock (5896–5899). **Paint and hit-test ignore it on desktop:** `gridToScreen` / `_screenToGrid` / `rebuildTileCornerCache` all use `camX = isDesktop ? 0 : cameraRef.current.x` (3780–3781, 3822–3823, 8844–8845). | A >1024 Rest/Death preview that pans the diamond **does not match live paint**. Desktop Rest/Death is the same locked 80×40 full-map view as overworld. Phone/tablet (`isDesktop` false) is the follow path. |
| `gridToScreen` cache vs camera | named cache; not that it ignores camera moves | Comment at 3766 claims invalidation on camera change. `useEffect` at 3800–3802 clears **only** on `canvasSize` / tile size. Cache keys are `"gx,gy"` with camera baked in at first lookup. | Custom `drawImage` must call the **same** `gridToScreen` the tiles use. Do not compute a second camera-aware position or sprites desync from diamonds. Do not “fix” the cache inside VAL. |
| Character draw vs tile center | draw point top+9; portal FX r=25 | `tileCenter` returns top + `th/2` and **does not** apply `CHARACTER_Y_OFFSET` (3806–3811) despite the comment. `spawnPixelPuff` is centered on `(top.x, top.y + th/2)` at size `effectiveTileW * 0.18` (9305–9313). Character body is at top+9. Desktop delta = **11 px** (20−9). | Do not author puff/VFX to the bitmap center. Do not “correct” the puff onto the draw point. Preview must show both origins. |
| HUD overlay stack | name y−34, level +14, dmg y−44/−58, badge (x+18, y−48), status “draw point − 30” | Frozen fonts/sizes: name/level **bold 11px Arial** (8125–8136); hover dmg **bold 14px** at y−44 (8204–8207); badge **bold 9px**, pill h=12 (8149–8154); status **16×16** pills, max 4, at `drawY − 30` (8246–8248); wander ring **r=15** (8229–8234); moving wrap `shadowColor #ff6b6b`, `shadowBlur` 8, alpha `0.8+0.2*sin` (8057–8061). Dungeon portal tooltip **y−45**, h=16 (7930–7939). | `MAX_HEIGHT` 60 puts the sprite top on the status-icon line (`H/2 = 30`). Preview must warn. Custom draw inherits the moving glow — do not add a second bloom. |
| Ground Doka | ineligible future category | Live paint is **not** a combatant: glow r=**14**, body r=**7**, bob ±**3**, fillText `"D"` 8px, value pill at +9/+15 (8454–8505). Open [#683](https://github.com/Mr-Melic/stralt/pull/683) (created 2026-09-27) extracts **planning** (`planGroundDokaLoot`) from WX; **this tree still inlines the roll** and always paints in WX. | v1 library is combatant stills. Do not add a `#doka` upload profile. Do not concatenate a second `planGroundDokaLoot` when #683 lands (`worldHelpers.ts` re-export). |
| Painter depth | drawOrder 99999 player; enemy uses `renderItem.depth` | Depth key is **`x + y`** for walls, barriers, portals, enemies, and player (7722, 7738, 7756, 7966, 7971). | Tall custom art on tile `(x,y)` is sorted with wall 28 / barrier 168 on the same iso diagonal. Preview occlusion. Occupancy stays one tile. |
| Player colors | palettes must not recolor PNGs | Live player `drawPixelPattern` maps cell 1 → `colors.secondary`, cell 2 → **`colors.primary`** (not accent), extra → `colors.accent` (8315–8325). Portrait uses the same triple (3728–3754). | A bound PNG **cannot** pick up the character color picker. Preview must say so. Do not run `getColorPalette` over bitmap pixels. |
| WX extract siblings | #427 hit-test, #591 wander | Still open: [#427](https://github.com/Mr-Melic/stralt/pull/427), [#591](https://github.com/Mr-Melic/stralt/pull/591), [#514](https://github.com/Mr-Melic/stralt/pull/514) (`pickRandomWanderTarget`). **New today:** [#683](https://github.com/Mr-Melic/stralt/pull/683) ground Doka spawn. | VAL implementation must stay in `engine/visualAssets.ts`. WX gets at most bind + `drawImage` wires. Union, do not concatenate helpers. |
| Camera lerp bands | phone follow / tablet follow / desktop lock | `getCameraFollowSpeed` (`worldHelpers.ts` 8–18): mobile **0.35**, `screenWidth < 1200` → **0.12**, else **0.08**. Called only after Rest/Death return **and** after `if (isDesktop) lock 0` (5914–5917). | The 1200 band is **phone/tablet only**. Do not preview a 0.08 lerp on a 1920 Rest map — desktop paint never applies that speed. |

Unchanged from 09-26 (re-verified on this tree):

- Portal boss Enemy has `family: "boss"` (WX 6568) but **no** `isBoss` / `bossId`; paint is chess 8×8 × 1.4 ≈ 34×34.
- Battle start writes `isBoss` / `bossId` onto **CombatantEntry only** (WX 11958–11984), not onto the Enemy that `drawCombatant` receives from `combatantsRef`.
- `drawCombatant` boss branch requires `isBoss && bossId` (`pieceArt.ts` 856). Live portal Enemy matches **neither**.
- Boss Rush sets `isBoss: true` (WX 5340), omits `bossId` / `scaleX`, `pieceType` is a **lore name**. Rush id is `boss-rush-…` (hyphen) — `id.startsWith("boss_")` is **false**.
- Hit test uses `entry.x,y,w,h` (desktop **80×41**), not stored `drawSize` 80×60. Padding 10 mouse / 14 touch (10127, 10819).
- `pointerToRenderSpace` uses CSS `canvasSize` (WX 8994–9004).
- rAF may `canvas.width=` (7256–7261) **and** `setTransform`+`scale(dpr)` every frame (7263–7264). M-1 zeros width (7224–7229).
- Player is **not** in `combatantsRef`. Player stills are a second call site (WX 8315–8326). `drawOrder` **99999**.
- `drawPixelPattern` trailing `ctx.restore()` has no matching `save` (3883). Moving-enemy `save` wraps draw (8057–8076).
- CSS `image-rendering: pixelated` on world canvas (WX 17890) and global `canvas` (`index.css` 652–655). `imageSmoothingEnabled` is never set.
- Context restore sizes from `window.innerWidth` (WX 13830–13834), not `canvasSize`.
- `InitiativeStrip` `ENEMY_ICONS` is name-regex emoji (`InitiativeStrip.tsx` 65–80). Enemy Register is flavor lore.
- Version-gate wipe keeps only `pbv_tier_spawn_config`, `pbv_levelup_config`, `*_inventory` (`versionGate.ts` 7–12).
- CharacterCreation hardcodes an 8-cell box. Selection painter is 192×192 cells. Portrait 60×60 / 6 px.
- Shop `proofFileUrl` may be `data:image/*` up to **524_288**; combat `unsafeUrl` **rejects** `data:` and `file:` (`adminGuard.mo` 89–94).
- Tablet 768–1024: tiles 80×40, camera follow. Phone after Continue: 140×70 tiles, cell still 3px.
- Battle-init skips while `battleInitFrameRef < 3` (WX 7238–7245). Comment says “first 2 frames”; code skips **3**. Do not bind art there.
- Iso neighbor Δ = `(40, 20)` ≈ 44.7 desktop (WX 3785–3786).
- Drop-shadow desktop: `sw = min(80*0.35, 40*0.3) = 12`, `sh = 4.2` (WX 8033–8054).
- Squash max **1.5** on one axis (`spawnPolicy.ts` 239–248). Live `generateEnemyScaleFactors()` is bare `Math.random` (WX 5768).
- `toCombatantEntry` strips `scaleX/Y`, `family`, `assignedName`, `currentView`, and would strip `visualAssetId` (`combatantStore.ts` 141–169). Bind on **Enemy**.
- `Enemy.scaleX` / `scaleY` / `currentView` are required on the TS type (`gameTypes.ts` 297–301). Rush/summons omit scale at runtime; `drawCombatant` defaults missing scale to 1 (`pieceArt.ts` 846–848). Summons set `currentView: "front"` (`summonSpawn.ts` 177–178) and omit scale.

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
| Character creation | 8×8 × `scale = 10` → **80×80** art | `CharacterCreation.tsx` |
| Character selection | `size=120` → `internalSize=240` → `pixelSize=floor(240/10)=24` → **192×192** cells | `CharacterSelection.tsx` 310–337 |
| Death juice | `fillRect` fragments | `engine/effects.ts` 282–292 |
| Portal FX | ellipse whirlpool **radius 25**, translated `(x, y-10)` | WX 3898–3919 |
| Barrier tower | 6 iso layers × 28 px = **168** | `barrierRender.ts` 15–16 (comment still cites stale WX 3273; live `wallHeight` is 4085) |
| Ground Doka | arc + `"D"` glyph | WX 8454–8505 |
| Summon spawn puff | 10 `fillRect` particles, alpha 0.7 | `spawnPixelPuff` (`pieceArt.ts` 1036–1060), WX 9308–9313 |

`Character.pixelPattern` may be persisted at creation but WorldExploration **never reads it**. `getPersistedPiecePattern` (`pieceArt.ts` 653–658) is **pieceType-only**.

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects `getBossPattern`, `getFamilyPattern`, `getFamilyColors`, `drawPattern`, `characterYOffset`. It does **not** accept a bitmap. A custom path must be a **new optional top branch** (or a new option). Do **not** implement `drawImage` inside `drawPixelPattern` (fillRect + unpaired restore).

### 2.2 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text | **No.** WX has zero `getEnemyConfigs` / `spriteUrl`. `useGetEnemyConfigs` (`useSpellQueries.ts` 111) is **admin React Query**. |
| `PlayerSpriteConfig` direction + walk-frame URL arrays | Canister + Sprite panel | **No.** Walk arrays cap **16** (`adminGuard.mo`). Combat never samples them. Heading still “Walk Animation Frames” (`AdminDashboard.tsx` 1590). |
| Login ad boxes | `adminSetAdBox` URL strings | Landing `<img>` — **not combat**. |
| GameKey shop thumb | `<img>` | IAP chrome, not combat. |
| Admin sprite preview | 72×72 `<img object-fit:contain>` (`AdminDashboard.tsx` 1484–1507) | **Not** the iso preview. |
| Shop proof | `data:image/*` ≤ 524_288 (`adminSafety.ts` 137) | Admin KYC, not combat. Combat `unsafeUrl` rejects `data:`. |

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`).

`adminGuard.validateOptionalUrl` checks **length ≤ 2048** (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–94). It does **not** decode images. Empty URL is valid. `MAX_JSON_BLOB = 32_768` (line 9).

`adminContract.test.ts` + `adminVisualStatus.test.ts`: empty `spriteUrl` tuple is **not** a custom asset.

Caffeine `ExternalBlob` is bindgen plumbing (`backend.ts` 54–55). No visual-asset blob type exists. New canister maps need a **new later** migration file after `20260901` (`OldActor = {}`). Never store raw base64 in Motoko `Text`.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"` — **not** in `combatantsRef`. Chess `pieceType` + 4-way `playerView` (WX 11490–11493) | 8×8 `chessPiecePatterns` + character colors. Second call site. `drawOrder` 99999. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\`` (WX 5809), random chess `pieceType`, `family` starts `"default"` | `drawCombatant` branch 4. Family 30% is **stats only**. Instance squash stored (WX 5768 / 5820–5821). |
| **ELITE / LARGE ENEMY** | **No type.** `generateEnemyScaleFactors` stores visual squash (max **1.5** on one axis). `elite_patrol` is a world-feature catalog key (`worldFeatures.ts`). | Same chess path × instance scale |
| **BOSS (portal)** | `id: \`boss_${bossConf.id}_${Date.now()}\`` (WX 6524), `scaleX/Y = 1.4` (6535–6536), `family: "boss"` (6568). **No** `isBoss` / `bossId` on the Enemy. | Chess 8×8 × 1.4. 8×12 tables unused. |
| **BOSS (Rush)** | `id: \`boss-rush-${roomIndex}-*\`` (hyphen), `isBoss: true`, lore `pieceType`, **no** `scaleX/Y` / `bossId` | `drawCombatant` branch 1 fails (`!bossId`); branch 4 + unknown pieceType → `king.front` 24×24 |
| **SUMMON** | `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` 153). Omits `scaleX/Y`. Sprite-rect `kind` is `"summon"` when `side === "player"` (WX 8095). | 8×8 `creaturePatterns` + `strokeOwnerTint` (`pieceArt.ts` 791–810, 923–926) |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use `getEnemyFamilyPixelPattern` |
| **Death Realm** | `isDeathRealm` → **no enemies** (WX 6566–6568) | Player stills only. Desktop paint stays cam 0. |
| **Future** | Portals (r=25 / rest glow 33 / boss star 37), hazards, loot (**coin r=7**), walls (28), **barrier towers (168)**, ads, death fragments, dust motes (cap 40) | Not `drawCombatant` |

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

Do **not** publish those grids as the STANDARD ENEMY upload spec.

Admin `PlayerSpriteConfig` `PIECE_TYPES` includes `"custom"`. Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11). Do not treat admin `"custom"` as a combat visual category.

`InitiativeStrip.ENEMY_ICONS` and Enemy Register lore are **not** catalogs. v1 custom stills do **not** replace strip emoji.

### 2.4 Gameplay footprint is tile-based

`engine/occupancy.ts` 84–96: one combatant per logical tile. No width/height. Spell range overlay is a **tile diamond** fill (WX 7687–7706), not a sprite AABB.

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

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with `sw = min(tw*0.35, th*0.3)` (desktop **12 × 4.2**). It does not track sprite pixels. Tall custom art disconnects from the shadow; preview must warn. Do not grow the shadow from bitmap size.

Whole-frame shake is `ctx.translate(_shake)` after `ctx.save()` (WX 7265–7267). Custom `drawImage` inherits it; do not add a second shake from bitmap size.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors` | spawn | **Default `Math.random`** (WX 5768), then **stored** on `scaleX`/`scaleY`. Two unused draws are internal to that call and do **not** feed `pickEnemyLevelFromTiers` (5770). |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` |
| Battle stats | `getEnemyBaseStats` | `seededRng` from charCode-sum of `seedKey` (`progression.ts` 163–170) |
| Map tiles / Boss Rush cells / wall palette | generate | `seededRng(seed)` (WX 4089+) |
| Ground Doka plan | map swap | `Math.random` / `Date.now` (live inline; #683 extracts) |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |
| Battle-init rAF | first 3 frames skipped | Must **not** be the bind site |
| Wander ticks | #591 extract | Must **not** re-bind art |

`seededRng` (`combatMath.ts` 122–128) is the correct primitive for pool picks. Hash the **already unique instance id** plus `poolId` / assignment config the same way `getEnemyBaseStats` hashes `seedKey` (charCode sum). Write `visualAssetId` onto the **Enemy** in `combatantsRef` at spawn.

Summon ids are random but **stable for the live object**; bind once at spawn (`summonSpawn.ts` 153), never when `turnsRemaining` ticks.

**Never call `Math.random()` or pick a pool member inside `drawCombatant` / the rAF loop / a React render.**

Custom art must **not** inherit instance `scaleX`/`scaleY` 0.6–1.5 squash. Rush/summons **omit** those fields; `drawCombatant` defaults missing scale to 1. Do not backfill squash when binding. Do not insert VAL draws inside `generateEnemyScaleFactors`.

### 2.6 Owner gate

- `App.tsx` 291: `isAdmin = userRole === "admin"`.
- `getUserRole` (`main.mo` 2558): first II caller becomes admin. Roles are `#admin` / `#user` only. **No `#owner` role.**
- `AdminDashboard.tsx` 5546: hard deny if `!isAdmin`.
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- `AGENTS.md`: admin/debug must be gated; never ship to normal players.

Library UI is **admin-only**. Players never upload or choose combat art.

### 2.7 Viewport bands (corrected)

| Band | Detection | Tiles | Camera used by paint? | Pixel cell |
| :--- | :--- | :--- | :--- | :--- |
| Phone | `innerWidth < 768` after Continue (`pbv_small_screen_continue`) | **140×70** (`MOBILE_ZOOM` 1.75, WX 957–959) | `gridToScreen` reads `cameraRef` (`isDesktop` false). Follow speed 0.35. | **3px** (not ×1.75) |
| Tablet | 768–1024 | **80×40** | follow; speed 0.12 if width < 1200 | 3px |
| Desktop overworld | `innerWidth > 1024` (WX 877) | **80×40** | **locked 0** — `gridToScreen` forces `camX/Y = 0` | 3px |
| Rest / Death **desktop** | `isRestMap` / `isDeathRealm` and `isDesktop` | 80×40 | `cameraRef` is **written** (5877–5893, 6125–6131, 6170–6177, 13456–13466) but **paint/hit-test zero it** | 3px |
| Rest / Death **phone/tablet** | same flags, `!isDesktop` | band tiles | follow via `cameraRef` (subject to the gx,gy cache; share `gridToScreen`) | 3px |

`SmallScreenGuard` warns; **Continue anyway** (`App.tsx` 44+). Builtin 24×24 art is relatively smaller on zoomed phone tiles. Iso preview must include a **140×70** pane. Do **not** add a panned >1024 Rest/Death pane — that is not live paint.

### 2.8 Canvas / bitmap lifecycle (implementation traps)

| Event | What happens | VAL rule |
| :--- | :--- | :--- |
| M-1 null context | `canvas.width = 0` then restore (7224–7229) | Treat as full context death. Keep `ImageBitmap` off-ctx. |
| No-map early rAF | may `canvas.width=` (7203–7208) | Same. |
| Every rAF | `setTransform` identity then `scale(dpr)` (7263–7264). May also `canvas.width=` if backing store drifted (7256–7261). | `canvas.width=` **clears 2D state**. Cache `ImageBitmap`, not `CanvasPattern` from the world ctx. Set `imageSmoothingEnabled = false` **after** `setTransform` on each custom draw (CSS `pixelated` is display-time only). |
| ResizeObserver | `canvas.width=` (13956–13957); comment at 13972 | Same cache rule. |
| Context restore | `canvas.width = innerWidth * dpr` (13830–13834) | **Do not** derive upload MAX from this size. Listeners include `webglcontextlost` on a **2D** canvas (13846–13851). |
| Moving enemy | `ctx.save()` + `#ff6b6b` blur 8 / alpha pulse, draw, `ctx.restore()` (8057–8076) | Custom draw must run **inside** that save. Do not go through `drawPixelPattern` (unpaired restore pops the save). |
| `spawnPixelPuff` | `canvas.getContext("2d")` at summon commit (9306–9313), then next rAF `clearRect`s | One-shot juice. Do not keep a puff bitmap. Do not bind custom FX. |
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
| `gridToScreen` | **top vertex** of the diamond | same | WX 3772–3793 (cached; camera ignored when `isDesktop`) |
| Tile visual center | top + `th/2` → +20 / +35 | | `tileCenter` 3806–3811 (**no** Y offset) |
| Character draw point | `(tileTopX, tileTopY + 9)` | same offset | `drawCombatant` 851–852; player 8317–8319 |
| Draw vs center delta | **11 px** desktop (20−9) | **26 px** phone (35−9) | puff vs body |
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
| Creation preview | 80×80 pattern | | `CharacterCreation.tsx` |
| Selection preview | **192×192** cells on 240 backing / 120 CSS | | `CharacterSelection.tsx` 310–337 |
| Name label | `screenPos.y − 34`, bold 11px Arial | | 8122–8132 |
| Level label | name + 14 | | 8123–8136 |
| Damage float | `y − 44` / `y − 58`, 14px / 10px | | 8204–8215 |
| Status icons | **16×16**, max 4, at `drawY − 30` | | 8246–8248, 8362 |
| Summon lifespan badge | `(x + 18, y − 48)`, 9px, pill h=12 | | 8146–8154 |
| Summon owner tint | pattern AABB, `lineWidth` 2, `shadowBlur` 8 | | `pieceArt.ts` 791–810 |
| Wander pulse | circle **r=15** at draw point | | 8229–8234 |
| Moving enemy wrap | `#ff6b6b` blur **8**, alpha 0.8–1.0 | | 8057–8061 |
| Dungeon portal tooltip | `sp.y − 45`, h=16 | | 7930–7939 |
| Ground Doka coin | glow r=14, body r=7, bob ±3 | | 8454–8505 |
| `spawnPixelPuff` | size `tileW * 0.18` → **14.4** / **25.2**; 10 particles | | 9312, `pieceArt.ts` 1042–1052 |
| Sprite hit registered | **80 × 41** | **140 × 61.5** | `h` formula above |
| Sprite stored `drawSize` | 80 × 60 | 140 × 105 | **not** used by hitTest |
| Hit padding | 10 mouse / 14 touch | same | 10127, 10819 |
| Wall extrusion | **28** px | | 4085 |
| Barrier tower | **168** px (6 × 28) | | `barrierRender.ts` 15–16 |
| Portal FX | r=25; rest glow 33; boss star 37 | | 3898, 3928, 3965 |
| Painter depth | **`x + y`** | | 7722 / 7966 / 7971 |
| Player `drawOrder` | **99999** | | 8342 |

**Anchor for custom bitmaps must match the pixel path:** center the image on `(tileTopX, tileTopY + 9)`.

Do **not** use the creation canvas, 192×192 selection cells, 72×72 admin `<img>`, 60×60 portrait, `window.innerWidth` after context restore, barrier 168, portal 25/33/37, coin r=7/14, puff 14.4, or the false “match tile dimensions” comment (WX 3840) as recommended upload size.

### 4.2 Overlay collision (new this run)

Distances are from the **draw point** `(tileTopX, tileTopY + 9)` = `(screenPos.x, screenPos.y + 9)`:

| Overlay | Offset from draw point | Collides with centered bitmap when |
| :--- | :--- | :--- |
| Status 16×16 pills | 30 px above center (icon occupies ≈ 22–38 px above) | height ≳ **44** |
| Name baseline | 43 px above (`34 + 9`) | height ≳ **86** (above current MAX 60 — names stay clear) |
| Hover damage | 53 px above (`44 + 9`) | height ≳ **106** |
| Summon badge | 57 px above and **18 px** right | height ≳ **114** or width ≳ **36** (horizontal) |
| Wander ring | radius 15 | footprint diameter ≳ **30** (ring no longer frames the body) |
| Level line | 29 px above (`20 + 9`) | height ≳ **58** — **MAX_HEIGHT 60 already clips** |

Preview must show these overlays on the iso dummy. Warn; do not auto-shrink the PNG.

### 4.3 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**.

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` accepted if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF not used in combat. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | `playerView` updates on step (WX 11490–11493). Walk-frame arrays exist but are **never drawn**. Do not implement walk cycles in v1 (`VAL-2026-08-31-018`). |
| `MAX_FILE_SIZE` | **Not an in-renderer measurement.** `MAX_URL = 2048`, `MAX_JSON_BLOB = 32_768` (`adminGuard.mo` 9–10). Shop `proofFileUrl` cap **524_288** is a **different** surface (`adminSafety.ts` 137). | Starting reject: **256 KiB per still** after encode until object-store limits are measured. **Do not store raw base64 in Motoko `Text`.** Do not use `data:` URLs (`unsafeUrl` forbids them on sprite stubs). Decode from `Blob` / `ExternalBlob`. |

#### PLAYER CHARACTER — profile `player_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **24** (or **48** @2× source) | 8×8 × 3 |
| `RECOMMENDED_HEIGHT` | **24** (or **48** @2×) | same |
| `MAX_WIDTH` | **80** | `TILE_WIDTH`; **warn** if &gt; 40 (iso neighbor Δx) |
| `MAX_HEIGHT` | **60** | stored `drawSize.h` desktop (hit uses 41). **Warn** if &gt; 44 (status icons) or ≥ 58 (level line) |
| `ANCHOR` | center on draw point (tile top + 9) | `drawPixelPattern` |
| `DEFAULT_SCALE` | **1** | player draw omits scale (defaults `{1,1}`) |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | 2× default; labels at y−34 stay clear of a 24-tall sprite |
| `ANIMATION_SUPPORT` | 4 stills keyed by `pieceType` + `playerView` | Player is not in `combatantsRef`; keep `drawOrder` 99999 |

Portrait HUD, character-creation (hardcoded 8 cells), and character-selection (192-cell painter) stay generated pixels in v1. Custom player art **does not** receive `Character.colors`.

#### STANDARD ENEMY — profile `enemy_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | same 8×8 × 3 |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile + stored drawSize; warn &gt; 40 wide; warn &gt; 44 tall vs status icons |
| `ANCHOR` | center / draw point | `drawCombatant` |
| `DEFAULT_SCALE` | **1** | Custom art must **not** inherit random 0.6–1.5 squash. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | |

#### ELITE / LARGE ENEMY — profile `enemy_elite` (future category)

No elite type exists. Do **not** invent gameplay size. If metadata `ELITE_ONLY` is used:

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **36** | ceil(24 × 1.5) — **live** max squash axis (`spawnPolicy.ts` 241–248) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | same tile/hit box as standard — **visual only** |
| `DEFAULT_SCALE` | **1** on a 36×36 recommended asset | Do not also multiply by 1.4/1.5 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 56 × 56 | under tile width; warn if &gt; 48 |

Occupancy stays **one tile**. Until an explicit elite flag exists, `ELITE_ONLY` assets are **ineligible** for random pools. Do not infer elite from `scaleY`, HP, `iron_golem`, or `elite_patrol`.

#### BOSS — profile `boss_large`

Bosses may render larger **where the live path already does**. That is **not** “stretch any enemy PNG.”

| Live path | Drawn size @ now | How to key custom art |
| :--- | ---: | :--- |
| Portal Enemy | ≈ 34 × 34 (8×8 × 1.4) | `id.startsWith("boss_")` on the **Enemy**. Do **not** require `isBoss && bossId`. Do **not** set those flags as part of VAL. |
| 8×12 tables | ≈ 34 × 50 | Wired only when `isBoss && bossId` on the **draw object**. Unused today. |
| Boss Rush | 24 × 24 `king.front` | `entity.isBoss === true` on the Rush Enemy. **Never** `pieceType` (lore name). **Never** `id.startsWith("boss_")` (`boss-rush-` uses a hyphen). |

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) live portal |
| `RECOMMENDED_HEIGHT` | **34** live portal; **50** if using the unused 8×12 table profile | Do not silently pick 50 for Rush |
| `MAX_WIDTH` | **80** | tile width; do not span two columns |
| `MAX_HEIGHT` | **72** | above current 50.4; labels/icons/walls will clip — preview must warn vs wall 28 **and** barrier 168 **and** depth `x+y` |
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
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | lifespan badge at `(x+18, y−48)` collides if width ≳ 36 or height is large — warn |
| Sprite-rect `kind` | keep `"summon"` when `side === "player"` | WX 8095 |

#### FUTURE categories (`#future`)

Portals (r=25 / 33 / 37), walls (28), **barrier towers (168)**, **ground Doka coins (r=7/14)**, death fragments, ads, dust motes, spawn puffs: **ineligible** until a measured **combatant-like** profile exists. v1 library is combatant stills only.

### 4.4 Aspect ratio and pixel-count gates

| Check | Rule |
| :--- | :--- |
| Aspect vs recommended | Warn if `|w/h − recW/recH| > 0.15`. Reject only if the owner did not confirm. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` **after** intended scale (prevents 4096² uploads). |
| Decode | `createImageBitmap` / `Image.decode`. Failure → `VALIDATION_STATUS = invalid`, do not store as active. |
| MIME | Sniff + `file.type`. Reject `image/svg+xml`, `image/gif`, `image/jpeg` for combat stills (no / bad alpha). |
| Category | Must be one of the v1 profiles. Unknown → ineligible. |
| Render-safe bounds | If decoded size > MAX_* at `DEFAULT_SCALE` 1, **reject** (no silent downscale). Owner may re-export. |
| Transparency | Sample alpha; warn if fully opaque. |

---

## 5. Asset library metadata

Admin-only records. Suggested fields (logical; not a Motoko type yet):

| Field | Role |
| :--- | :--- |
| `ASSET_ID` | Stable id. Never reuse after delete. |
| `DISPLAY_NAME` | Rename-able. |
| `ENTITY_CATEGORY` | `player` / `enemy_standard` / `enemy_elite` / `boss_large` / `summon` / `#future` |
| `ENTITY_FAMILY` | Optional `EnemyFamily`. Empty = not family-scoped. `"boss"` is **not** a family enum member. |
| `ENTITY_IDS` | Explicit entity / variant ids (catalog enemy id, `bossConf.id`, summon `pieceType`). Empty = none pinned. |
| `VARIANT_TAGS` | Free tags. Not used as a name-heuristic (`InitiativeStrip` regex is not a key). |
| `ACTIVE` | Inactive → skip pools; bound instances fall back next frame. |
| `WEIGHT` | Pool weight. Only active + eligible participate. |
| `RARITY` | Display only in v1. Do not multiply weight unless an owner toggle says so. |
| `ELITE_ONLY` | Ineligible until a real elite flag exists. |
| `BOSS_ONLY` | Eligible only for boss keying rules in §4.3. |
| `UPLOAD_DATE` / `VERSION` | Replace increments version; old bytes kept until unreferenced. |
| `SOURCE_METADATA` | Original filename, MIME, decoded w/h, byte length. |
| `RENDER_PROFILE` | Frozen profile id from §4.3. |
| `VALIDATION_STATUS` | `ok` / `invalid` / `ineligible`. Invalid never draws. |

Operations: upload, preview (iso + overlays + phone 140×70), activate, deactivate, rename, replace (version), safe removal (refuse if live binds; or deactivate + fallback), assign to entity / family / pool, weighted random (spawn-time only), revert to default (clear bind), dependency inspection (which instances / pools reference this id).

Weighted pools: **only active eligible assets**. If none qualify → builtin. Selection:

```
visualAssetId = pickWeighted(seededRng(hash(instanceId, poolId, poolVersion)), eligible)
```

written **once** at spawn / summon / boss portal. Ordinary rerenders must not change appearance.

---

## 6. Architecture notes for implementers

- New code: `engine/visualAssets.ts` + `engine/visualPreview.ts` + tests. Do not grow the 19213-line rAF body.
- After [#427](https://github.com/Mr-Melic/stralt/pull/427) / [#591](https://github.com/Mr-Melic/stralt/pull/591) / [#514](https://github.com/Mr-Melic/stralt/pull/514) / [#683](https://github.com/Mr-Melic/stralt/pull/683) merge: **union** overlapping files. One `export function` per name. Concatenating `planGroundDokaLoot` or `hitTestSprite` fails Caffeine `vite build`.
- Bytes: object storage / `ExternalBlob`, not Motoko `Text`. New stables ⇒ migration **after** `20260901`.
- `imageSmoothingEnabled = false` after every `setTransform` on custom draws.
- CSS `image-rendering: pixelated` does not replace that flag.
- Do not key `boss_large` off `family === "boss"` (`EnemyFamily` has no `boss`).
- Do not wait for an encounter seed.
- Do not wire walk-frame URL arrays.
- Do not treat landing ads or shop proofs as combat assets.
- Do not bind custom death fragments (`effects.ts` 282–292).
- Do not pick art from wander ticks or `turnsRemaining` decrements.

---

## 7. What this run does not change

Pixel recommended boxes vs 09-26 are unchanged (24 / 36 elite / 34 portal boss). The 09-27 delta is **camera truth**, **overlay collision**, **puff vs draw point**, **ground-Doka paint**, **depth key**, **player color mapping**, and **new WX-extract sibling #683**.

Empty library remains success. Production code was not modified.
