# Custom Visual Asset Library & Assignment — 2026-09-29 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-29  
**HEAD:** `0f5363f` (`Merge pull request #332`) — same SHA as 2026-09-21 … 2026-09-28  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs on `origin/main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md)  
**Open VAL docs (not on main):** #355 (09-21), #418 (09-22), #461 (09-23), #520 (09-24), #586 (09-25), #624 (09-26), #694 (09-27), #715 (09-28)  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-29.md`](./ACTION_IDS_VAL_2026-09-29.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer on this SHA. Invented sprite boxes (64×64, 128×128) are not used. Pixel boxes did not change since 09-28. The **owner-console helper stack** did: sibling [#724](https://github.com/Mr-Melic/stralt/pull/724) (created three minutes after VAL #715) added production TypeScript that *looks* like a visual library.

---

## 0. Verdict

| Question | 2026-09-29 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `engine/visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (the word `drawImage` appears only as a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, draw point = rounded iso top + 9, standard 24×24, squash max **1.5** → elite rec **36**, portal boss live chess 8×8 × 1.4 ≈ **34×34**, hit test **80×41**. |
| What is new vs 09-28? | Sibling **#724** owner UX helpers (`adminOwnerUx.visualPool.ts`, `.deps.ts`, `.lifecycle.ts`) and **#730** ambient-occlusion extract. Neither paints combat stills. #724’s `visualUploadRequirementsBeforeSelect` says **“https only”** for enemy/sprite rows — that is catalog URL copy, **not** the combat blob spec. |
| Only implemented VAL id? | **VAL-2026-09-01-001** (`adminVisualStatus.ts`). |

Do **not** implement by wiring `EnemyConfig.spriteUrl`, `PlayerSpriteConfig.frontUrl`, `#724` `catalogVisualPreviewSrc` (#631), or `visualUploadRequirementsBeforeSelect` into `drawCombatant`. Those paths have no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs` (zero matches in `WorldExploration.tsx`).

---

## 1. Delta vs 2026-09-28

Production renderer SHA is unchanged (`0f5363f`, WX **19213** lines). 09-28 already froze rounded vs unrounded iso tops, shaken rAF ctx, and enemy-summon wrapper ids.

| Topic | 2026-09-28 | 2026-09-29 |
| :--- | :--- | :--- |
| Combat `drawImage` | absent | still **absent** |
| `engine/isoGrid.ts` | proposed on [#639](https://github.com/Mr-Melic/stralt/pull/639) (still **OPEN**) | still **not on main**; VAL must **import**, not copy |
| Owner visual-pool TS | not in the 09-28 VAL tree (#715 created 00:07Z) | [#724](https://github.com/Mr-Melic/stralt/pull/724) (00:10Z) adds `customVisualPoolCopy`, `visualAssetStatusLines`, `visualUploadRequirementsBeforeSelect`, `ownerAssetDependencyRail`, `ownerLifecycleFromFlags` |
| #631 catalog `<img>` helper | mentioned as HTTPS/JPEG scope | `catalogVisualPreviewSrc` returns a URL string or `null` — **not** an iso diamond preview |
| AO | inline in WX rAF (7277–7307, 7558–7613) | [#730](https://github.com/Mr-Melic/stralt/pull/730) extracts `engine/ambientOcclusion.ts`; live still inlines 8px edge gradients on **floor diamonds**, bits 4/8 |
| Elite type | absent; #686/#752 docs-only | still **no** `isElite`. `elite_patrol` is a `worldFeatures.ts` catalog string (44, 454) |
| Walk-frame admin UI | no stored-not-rendered note | **unchanged** (`AdminDashboard.tsx` 1588–1620). Character catalog note at 1783–1786 is honest for facing URLs only |
| Version-gate wipe | preserves tier/levelup/`_inventory` | still **does not** preserve a visual-library key (`versionGate.ts` 7–13). `APP_VERSION` is `v163` (`App.tsx` 14) |

Sibling designs that must not fork this library:

- `EBA-2026-08-31-017` — per-entity `visualMode: none|asset|pool`, default **none**. Implement **after** VAL resolver, not as `drawImage(spriteUrl)`.
- Wave-11 elite evolution ([#752](https://github.com/Mr-Melic/stralt/pull/752)) — still **PROPOSED**. `ELITE_ONLY` assets stay ineligible (`VAL-2026-08-31-019`).
- Admin UX #724 / #631 — **copy and catalog thumbnails**, not combat assignment.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3882); **unpaired** `ctx.restore()` at 3883 |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782); **no** restore |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023 |
| `engine/enemyPixelPatterns.ts` | Boss **8×12** tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 (fallback `boss_12`); family 434–498 |
| WX player | `getPersistedPiecePattern(pieceType, playerView)` then `drawPixelPattern` | 8289–8326 — **not** `drawCombatant` |
| Portrait HUD | 8×8 × `pixelSize = 6` on canvas **60×60** | 3720–3724, 18112–18113 |
| Character creation | 8×8 × `scale = 10` → **80×80** art | `CharacterCreation.tsx` 151–153 |
| Death juice | `fillRect` fragments | `engine/effects.ts` (leave generated; VAL-2026-09-01-009) |

`Character.pixelPattern` may be persisted at creation; WorldExploration **never reads it**. The world player uses `getPersistedPiecePattern` (pieceType + facing). Cell **2** is primary; `extra` is accent (`WX` 8320–8325). PNGs ignore the picker.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects `getBossPattern`, `getFamilyPattern`, `getFamilyColors`, `drawPattern`, `characterYOffset`. It does **not** accept a bitmap. A custom path must be a new optional **top** branch (or a new option), not `drawImage` inside `drawPixelPattern` (that function only `fillRect`s cells and then `restore`s).

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline on this SHA. Until one is added, source === runtime.

CSS `canvas { image-rendering: pixelated }` (`index.css` 652–655) is **display-time**. `ctx.imageSmoothingEnabled` is **never** set. Every rAF does `setTransform` identity then `scale(dpr)` (WX 7263–7264), which resets 2D state.

### 2.2 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text | **No.** WX has zero `getEnemyConfigs`. Spawn picks chess `pieceType` + optional `EnemyFamily`. |
| `PlayerSpriteConfig` direction + walk-frame URL arrays | Canister + Sprite panel | **No.** WX has zero `getPlayerSpriteConfigs`. |
| Login ad boxes | `adminSetAdBox` URL strings | Landing `<img>` — **not combat**. |

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`).

**Walk Animation Frames** (`AdminDashboard.tsx` 1588–1620, cap 16 strings in `adminGuard.mo`) still have **no** stored-not-rendered disclaimer. Combat never samples those arrays. Do not implement walk cycles to make the section true (`VAL-2026-08-31-018`).

`adminGuard.validateOptionalUrl` checks length ≤ 2048 (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–94). It does **not** decode images. Empty URL is valid.

`adminGuard.requireHttpsUrl` (97–104) is for **landing ads**. `proofDataMimeAllowed` (109–116) allows **JPEG** for shop proofs (cap 524_288). Neither is the combat MIME gate.

Caffeine `ExternalBlob` is bindgen plumbing. No visual-asset blob type exists.

**#724 / #631 must not be mistaken for this library:**

| Helper (open PR, not on main) | What it actually does |
| :--- | :--- |
| `visualUploadRequirementsBeforeSelect("enemy"\|"sprite")` | String: hosted PNG/WebP, **https only**, empty = default pixels, URL **not rendered** |
| `visualUploadRequirementsBeforeSelect("ad")` | Ads: https, image+link or hide slot |
| `customVisualPoolCopy(n)` | `"Custom Visual Pool — N active variant(s)"` — display only; `n=0` is valid |
| `visualAssetStatusLines` | Fallback line + pool line; `isError: false`; `emptyCustomIsValid: true` |
| `catalogVisualPreviewSrc` (#631) | Returns trimmed URL or `null` if empty/unsafe — for `<img>`, not iso combat |
| `ownerAssetDependencyRail` | **One** badge: `enemyBossUsage` count. Zero is valid, not an error |
| `ownerLifecycleFromFlags` | DRAFT / VALIDATION_FAILED / READY_TO_ACTIVATE / ACTIVE / INACTIVE / LEGACY **copy**. `appearsLive` only when `publishedLive !== false` path reaches ACTIVE |

Combat upload must show category boxes **before** the file picker (recommended/max w×h, formats, alpha, max bytes, anchor, scale, footprint, animation). That is **not** the https-only sentence.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"` (sprite-rect key); **not** in `combatantsRef`. `pieceType` chess, 4-way `playerView` | 8×8 chess pattern + character colors. Separate draw site. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${Date.now()}\`` (WX 5809). Random chess `pieceType`. `family` starts `"default"` | `drawCombatant` branch 4. **Family is not used for regular enemies.** |
| **ELITE / LARGE ENEMY** | **No type.** `generateEnemyScaleFactors` stores visual squash. Tall/wide branches reach **1.5**. `iron_golem` is family HP paper. `elite_patrol` is a world-feature catalog key only | Same chess path × instance scale |
| **BOSS (portal)** | `id: \`boss_${bossConf.id}_${Date.now()}\`` (6524), `scaleX/Y = 1.4`, `family: "boss"` (string, **not** in `EnemyFamily` union). Overworld object has **no** `isBoss` / `bossId` | Wander paint: chess 8×8 × 1.4 ≈ **34×34**. 8×12 tables unused until battle sets `isBoss && bossId` (11958–11983) |
| **BOSS (Rush)** | `id: \`boss-rush-${roomIndex}-N\`` (5326), `isBoss: true` at spawn, `pieceType` is **lore name**, **no** `scaleX/Y`, `family: "boss"` | `drawCombatant` branch 1 needs `isBoss && bossId`. Missing `bossId` → chess/`king.front` **24×24**. Do **not** key `boss_large` off `isBoss` alone |
| **SUMMON** | `id: \`summon-${Math.random().toString(36).slice(2)}\`` (`summonSpawn.ts` 153). Enemy wrapper spell id `enemy-summon-${pieceType}` (271) is **not** the instance id | 8×8 `creaturePatterns` + `strokeOwnerTint` (`pieceArt.ts` 791–810, 923–926) |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use `getEnemyFamilyPixelPattern` (`pieceArt.ts` 932) |
| **Future** | Portals (whirlpool **radius 25**, WX 3898), hazards, loot (coin r=7 / glow 14, 8471–8482), walls (`wallHeight = 28` at 4085), barrier towers **6×28 = 168** (`barrierRender.ts` 15–16), ads | Not `drawCombatant` |

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`. Assigned with 30% chance (`FAMILY_VARIANT_CHANCE` in `spawnPolicy.ts` 35). Changes **stats** (and a few combat hooks), not the default draw path.

Family grids exist but are unused for those 30% units (drawn sizes @ scale 1, ×3 cell):

| Family | Cells | Drawn @ scale 1 |
| :--- | ---: | ---: |
| wraith_bishop | 3×8 | 9×24 |
| iron_golem | 6×5 | 18×15 |
| plague_rat | 6×5 | 18×15 |
| ember_knight | 5×8 | 15×24 |
| tide_shade | 7×4 | 21×12 |
| bone_scribe | 5×8 | 15×24 |
| void_mirror | 6×6 | 18×18 |
| default | 3×3 | 9×9 |

Custom **family** assignment is a new presentation bind (`VAL-2026-08-31-013`), not a repair of this gap.

Admin `PlayerSpriteConfig.characterPieceType` may include `"custom"`. Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11). Do not treat admin `"custom"` as a combat visual category.

`InitiativeStrip` `ENEMY_ICONS` regexes must **not** drive `VARIANT_TAGS` (VAL-2026-09-28-008).

### 2.4 Gameplay footprint is tile-based

`engine/occupancy.ts` 84–96: one combatant per logical tile. No width/height.

Targeting is tile Chebyshev / Manhattan. Sprite rects are a **fixed tile-derived box**, not the painted pattern (WX 8086–8104, 8335–8353):

```
drawSize stored = { w: effectiveTileW, h: effectiveTileH * 1.5 }
  desktop: 80 × 60
  mobile-zoom: 140 × 105
registered hit h = effectiveTileH/2 + CHARACTER_Y_OFFSET + (effectiveTileH*1.5)/2
  desktop: 20 + (−9) + 30 = 41
drawAnchor = (tileTopX, tileTopY − CHARACTER_Y_OFFSET) = (tileTopX, tileTopY + 9)
hitTestSprite padding: mouse 10 (WX 10127), touch 14 (WX 10819)
```

Custom art must never change occupancy, movement, range, targeting, or combat hitboxes. Do not rewrite `drawSize` / registered `h` from bitmap width/height (`VAL-2026-09-01-003`).

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` (WX 8033–8054). Desktop ≈ **28 × 9.8** ellipse (`sw=min(28,12)=12`, `sh=12*0.35=4.2`). It does not track sprite pixels. Tall custom art will visually disconnect from the shadow; preview must warn. Do not grow the shadow from bitmap size.

AO is **floor diamond** shading (8px linear gradients, bits 4 and 8, WX 7558–7613). It does not darken combatant pixels. Preview may show AO under dummies; do not apply AO to the PNG.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors` | spawn (`spawnPolicy.ts` 227–256) | `Math.random` (two unused draws, then variation). Tall: scaleY **1.1–1.5**. Wide: scaleX **1.1–1.5**. Uniform: 0.6–1.4 both axes. **Stored** on instance |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | stored on `family` |
| Battle stats | `getEnemyBaseStats` | `seededRng` from charCode-sum of `seedKey` (`progression.ts`) |
| Map tiles | generate | `seededRng(seed)` |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`seededRng` (`combatMath.ts` 122–128) is the correct primitive for weighted pool picks. Visual selection must be **written onto the Enemy in `combatantsRef` at spawn** (`visualAssetId`) so React rerenders and rAF cannot change appearance. `toCombatantEntry` (`combatantStore.ts` 141–169) **strips** unknown fields — do not bind only on `CombatantEntry`.

Hash the **already unique instance id** (plus `poolId` / assignment config). Do **not** hash `enemy-summon-${pieceType}`. Summon `turnsRemaining` ticks must not re-pick. `Enemy.scaleX/Y` are required on the TS type (`gameTypes.ts` 300–301) but **omitted** on Rush/summons — `drawCombatant` defaults missing scale to `{1,1}` (846–848). Do not fill squash at bind.

**Never call `Math.random()` or pick a pool member inside `drawCombatant` / the rAF loop / a React render.**

Custom art must **not** inherit instance `scaleX`/`scaleY` 0.6–1.5 squash. That squash is a pixel-art variety trick. Stretching a painted illustration with it is the forbidden arbitrary stretch.

`nsKey` (`WX` 866–869) is `${userId}_slotN_${base}` for per-character localStorage. It is **not** a visual library.

### 2.6 Owner gate

- `App.tsx` 291: `isAdmin = userRole === "admin"`.
- `AdminDashboard.tsx`: hard deny if `!isAdmin`.
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- `AGENTS.md`: admin/debug must be gated; never ship to normal players.

Library UI is **admin-only**. Players never upload or choose combat art.

Uploads start **inactive** (`ACTIVE=false`) until the owner activates. #724 `ownerLifecycleFromFlags`: a local-only save is DRAFT (`appearsLive: false`). `versionGate` wipe (`App.tsx` 297–318) would drop unpublished browser drafts that are not in `collectPreservedLocalStorage`. Combat library metadata belongs on the **canister** (new map **after** `20260901_000000`, `OldActor = {}`).

### 2.7 Mobile / tablet — Continue is live

- `SmallScreenGuard` **warns**; **Continue anyway** (`App.tsx` 25–40, overlay while `isSmallScreen && !smallScreenBypass`).
- Bypass: `sessionStorage` `pbv_small_screen_continue`.
- `useIsMobile(breakpoint = 768)` (`hooks/use-mobile.tsx` 17–26) then sets WX `MOBILE_ZOOM = 1.75` → tiles **140×70** (WX 957–959).
- Camera follow is **not** desktop: `isDesktop = innerWidth > 1024` (WX 877) forces `camX/camY = 0` in `gridToScreen` (3780–3781) even if Rest/Death wrote `cameraRef`.
- Tablet 768–1024: unzoomed tiles **and** camera follow.
- **Pixel patterns do not multiply by `MOBILE_ZOOM`.** A 24×24 character is relatively smaller on zoomed tiles.

Custom assets follow the same rule unless a render profile explicitly opts into tile-relative scale (not the default). Iso preview must include a mobile-zoom pane (140×70 diamond, 24×24 art unscaled).

### 2.8 rAF context, shake, puff, depth

Each combat frame: `setTransform` identity, `scale(dpr)`, `save`, `translate(_shake.x, _shake.y)` (WX 7263–7267), then tiles + depth-sorted combatants (`depth: x + y`, 7966–7971). Player hit `drawOrder` is **99999**.

`spawnPixelPuff` is called from summon commit with `canvasRef.current?.getContext("2d")` at **tile center** (9305–9313), size `effectiveTileW * 0.18` (14.4 desktop / 25.2 mobile). Next rAF `clearRect`s it. Puff does **not** inherit the shake save. Custom stills must use the shaken rAF `ctx` already passed into `drawCombatant`. Leave puff generated.

Moving enemies wrap draw with `save` (shadow `#ff6b6b`, blur 8, pulsing alpha, 8057–8061) then `drawCombatant(..., { drawPattern: drawPixelPattern })`. Inner unpaired `restore` already pops that wrap.

`canvas.width=` (7256–7261, M-1 7224–7228) resets 2D state, **not** `ImageBitmap`. Battle-init skips first **3** rAF frames (7238–7244).

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
- Failures log once (reuse `logPatternLookupFailed` throttle), never throw, never block combat.

```ts
// src/frontend/src/engine/visualAssets.ts  (not implemented)
function resolveRuntimeVisual(entity, library): RuntimeVisual
  // { kind: "custom", bitmap, profile } | { kind: "builtin" }
```

`drawCombatant` may grow **one optional branch at the top**: if resolve returns a decoded bitmap + profile, `drawImage` at the same anchor as `drawPixelPattern`; otherwise branches 1–4 run unchanged. Player needs a **second** one-line site (WX 8315). Empty library / omitted option ⇒ **identity** with today.

Deactivate → live instances with that id fall back **next frame**. No re-roll.

---

## 4. Derived render measurements (do not invent)

All sizes are **logical CSS pixels** after `ctx.scale(dpr)` (WX 7264). Source bitmaps may be integer multiples for sharpness.

### 4.1 Tile, anchor, scale

| Quantity | Desktop | Mobile-zoom (`innerWidth < 768` after Continue) | Source |
| :--- | ---: | ---: | :--- |
| Iso diamond | 80 × 40 | 140 × 70 | `TILE_*` × `MOBILE_ZOOM` 1.75 |
| Neighbor pitch | (40, 20) ≈ **44.7** CSS px | (70, 35) | half-tile; overlap warn **before** MAX_WIDTH 80 |
| `gridToScreen` | **rounded top vertex**; cam **0** if `innerWidth > 1024` | rounded top; live `cameraRef` | WX 3772–3790 |
| Click-cache center | **unrounded** iso center (sibling #639) | same | do not place PNGs here |
| Tile visual center | top + `th/2` → +20 / +35 | | `tileCenter` 3806–3811 |
| Character draw point | `(tileTopX, tileTopY + 9)` | same offset | `drawCombatant` 850–852; player 8318–8319 |
| Pattern **anchor** | **center** of the pattern on the draw point | same | `startX = x − patternWidth/2` (WX 3860–3861) |
| Drop-shadow foot | `(tileTopX, tileTopY + th/2 + 4)` | | 8036–8038, 8293–8294 |
| World cell size | **3×3** logical px × `scaleX`/`scaleY` | **not** × 1.75 | WX 3855 |
| Default pattern | **8×8 cells** | | `chessPiecePatterns` (`pieceArt.ts` 83–94) |
| Default drawn size @ scale 1 | **24 × 24** | 24 × 24 | 8 × 3 |
| Enemy instance scale | 0.6–**1.5** (stored) | same | `generateEnemyScaleFactors` 227–256 |
| Max standard drawn @ 1.5 | **36 × 36** | 36 × 36 | 24 × 1.5 |
| Boss **tables** | **8×12 cells** | | `enemyPixelPatterns.ts` 10–24 |
| Boss tables @ 1.0 | **24 × 36** | | |
| Portal boss spawn scale | **1.4 × 1.4** (not random) | | WX 6535–6536 |
| Portal boss **live wander** | **~34 × 34** chess × 1.4 | | no `isBoss` yet |
| Portal boss **in battle** if tables apply | **33.6 × 50.4** | | 8×12 × 3 × 1.4 |
| Rush boss live | **24 × 24** `king.front` typical | | missing `bossId` / lore `pieceType` |
| Portrait | 60×60 canvas, 6px cells → 48×48 art | | 3720, 18113 |
| Name label | `screenPos.y − 34` | | 8122 |
| Level label | name + 14 | | 8123 |
| Status icons | 16×16 at draw point − 30 | | 8246–8248 |
| Summon lifespan badge | `(x + 18, y − 48)` | | 8146–8147 |
| Wander ring | r = **15** at draw point | | 8229–8235 |
| Hover damage | `screenPos.y − 44` / −58 | | 8206–8214 |
| Sprite hit registered | 80 × **41** | 140 × **~62.5** | 8090–8092 |
| Hit padding | 10 mouse / 14 touch | same | 10127 / 10819 |
| Wall extrusion | 28 px | | 4085 |
| Barrier tower | 6 × 28 = **168** | | `barrierRender.ts` 15–16 |
| Portal FX | r = 25 | | 3898 |
| Ground Doka | coin r=7, glow r=14, at **tile top** + bob | | 8457–8482 |
| Puff | `tw * 0.18` at tile **center** | 14.4 / 25.2 | 9305–9313 |
| Viewport | warn &lt;768; Continue enters | zoomed tiles | `SmallScreenGuard` + `useIsMobile` |

**Anchor for custom bitmaps must match the pixel path:** center the image on `(roundedTop.x, roundedTop.y + 9)`, not on tile center, not on unrounded click-cache center, not on a foot bone, unless a future render profile adds an explicit `anchor: "foot"` (not in the current renderer).

Do **not** use the creation 80×80, 72×72 admin `<img>`, or 60×60 portrait as recommended upload size.

### 4.2 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**. Do **not** substitute #724 `visualUploadRequirementsBeforeSelect` (https URL sentence).

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` accepted if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF not used in combat. Shop JPEG proof is a **different** surface. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | `playerView` updates on step. Walk-frame arrays exist on `PlayerSpriteConfig` but are **never drawn**. Do not implement walk cycles in v1. |
| `MAX_FILE_SIZE` | **Not measured in-repo.** Starting reject: **256 KiB per still** after encode until IC ingress / object-store limits are measured. | `MAX_URL = 2048` is URL text. `MAX_JSON_BLOB = 32768` is not an image cap. Do not store raw base64 in Motoko `Text`. Do not use `data:` URLs (`unsafeUrl` forbids them on stubs). Do not require `https:` on blob refs. |

#### PLAYER CHARACTER — profile `player_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **24** (or **48** @2× source) | 8×8 × 3 |
| `RECOMMENDED_HEIGHT` | **24** (or **48** @2×) | same |
| `MAX_WIDTH` | **80** | `TILE_WIDTH`; warn visual overlap at width &gt; **40** (half-tile) |
| `MAX_HEIGHT` | **60** | sprite `drawSize.h` desktop; status icons at drawY−30 clip first |
| `ANCHOR` | center on draw point (rounded top + 9) | `drawPixelPattern` |
| `DEFAULT_SCALE` | **1** | player draw omits scale (defaults `{1,1}`) |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | 2× default; still inside 80×60 stored box; labels at y−34 |

Portrait HUD and character-creation/selection canvases stay generated pixels in v1.

#### STANDARD ENEMY — profile `enemy_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | same 8×8 × 3 |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile + stored hit box |
| `ANCHOR` | center / draw point | `drawCombatant` |
| `DEFAULT_SCALE` | **1** | Custom art must **not** inherit random 0.6–1.5 squash |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | warn overlap &gt; 40 wide |

#### ELITE / LARGE ENEMY — profile `enemy_elite` (future category)

No elite type exists. Do **not** invent gameplay size. If metadata `ELITE_ONLY` is used:

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **36** | ceil(24 × **1.5**) — current max squash (`rng()*0.4+1.1`) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | same tile/hit box as standard — **visual only** |
| `DEFAULT_SCALE` | **1** on a 36×36 recommended asset | Do not also multiply by 1.5 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 56 × 56 | under tile width; warn if &gt; 48 |

Occupancy stays **one tile**. Until an explicit elite flag exists, `ELITE_ONLY` assets are **ineligible** for random pools. Do not infer elite from `scaleY`, HP, `iron_golem`, or `elite_patrol`.

#### BOSS — profile `boss_large`

Bosses already have a **dedicated 8×12 pattern + fixed 1.4 scale** in tables. Live portal wander is chess × 1.4. Rush is typically 24×24. Do not stretch `enemy_standard` art.

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) — match **live portal** size, not unused 8×12×1.4 height unless battle tables actually apply |
| `RECOMMENDED_HEIGHT` | **34** live-match / **50** table-match | ceil(8×3×1.4) vs ceil(12×3×1.4). Preview **both**. Do not silently pick one |
| `MAX_WIDTH` | **80** | tile width; do not span two columns |
| `MAX_HEIGHT` | **72** | above current 50.4; labels/icons will clip — preview must warn |
| `ANCHOR` | center / draw point (same as now) | `drawCombatant` boss branch |
| `DEFAULT_SCALE` | **1** on the recommended bitmap | Do **not** apply 1.4 on top of a 34×50 upload. A 24×36 “pixel-match” sheet may use profile scale 1.4 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 64 × 72 | still one tile occupancy |
| `ANIMATION_SUPPORT` | 4 stills optional; v1 may be a single `front` | Portal spawn `currentView: "front"` (WX 6528) |

Eligibility: portal `id.startsWith("boss_")` **or** an explicit `ENTITY_IDS` bind (Rush `boss-rush-*`). Never `family === "boss"` alone (`EnemyFamily` has no `"boss"`). Never `isBoss` alone.

#### SUMMON — profile `summon_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| Same box as player/standard | 24 recommended, 80×60 max | 8×8 `creaturePatterns` |
| Extra | Keep `strokeOwnerTint` (green/red) around the **runtime** footprint | `pieceArt.ts` 791–810 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | lifespan badge at `(x+18, y−48)` will collide with tall/wide art — warn |
| Bind key | `SpawnedSummon.id` | never `enemy-summon-${pieceType}` |

#### FUTURE categories (`#future`)

Portals, walls, barriers, loot, death fragments, ads, puff: **ineligible** until a measured profile exists. v1 library is combatant stills only.

### 4.3 Aspect ratio and pixel-count gates

| Check | Rule |
| :--- | :--- |
| Aspect vs recommended | Warn if `|w/h − recW/recH| > 0.15`. Reject only if the owner did not confirm. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` **after** intended scale (prevents 4096² uploads). |
| Decode | `createImageBitmap` / decode must succeed; on failure → reject, builtin fallback if already assigned. |
| MIME | Trust decoded type, not the extension. Do not accept JPEG because the shop does. |
| Distortion | If the owner insists on a non-matching size, draw **unscaled** (or integer nearest-neighbor) inside the profile box with **transparent pad**. Never `drawImage` stretch to fill. |
| URL stubs / #724 https copy | Passing `validateOptionalUrl` or `requireHttpsUrl` is **not** this gate. |

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

Backend-authoritative (`localStorage` cache only — and version-gate will **wipe** unlisted keys). Suggested Motoko / TS record:

| Field | Type | Notes |
| :--- | :--- | :--- |
| `ASSET_ID` | Text | Stable id. Never reuse after delete. |
| `DISPLAY_NAME` | Text | Owner rename. |
| `ENTITY_CATEGORY` | variant | `#player` `#enemyStandard` `#enemyElite` `#boss` `#summon` `#future(Text)` |
| `ENTITY_FAMILY` | [Text] | Empty = any family. Else `EnemyFamily` / summon pieceType. Do not store `"boss"` as family unless matching the string on portal units. |
| `ENTITY_IDS` | [Text] | Explicit binds: `player`, `boss_3`, `boss-rush-0-0`, summon `pieceType`, future ids. Empty = pool-only. |
| `VARIANT_TAGS` | [Text] | Owner tags. Matching is explicit, never name heuristics / `ENEMY_ICONS` regex. |
| `ACTIVE` | Bool | Inactive assets are invisible to resolver. |
| `WEIGHT` | Nat | Pool weight. 0 = never randomly selected (direct assign only). |
| `RARITY` | Text | Display/filter only. Does not change combat. |
| `ELITE_ONLY` | Bool | Eligible only if instance is marked elite (future). If no elite flag exists, ineligible for random pools. |
| `BOSS_ONLY` | Bool | Eligible only for portal `boss_*` ids and explicit Rush binds — not `isBoss` alone. |
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

**World-pack bind cannot live only on `EnemyConfig.spriteUrl`.** `generateEnemies` never reads admin enemy templates. Assignments must key off instance fields the spawn path already has: `pieceType`, `family`, `id` prefix (`boss_` vs `boss-rush-` vs `enemy-` vs `summon-`), `isSummon`, and a future elite flag.

`#724` `ownerAssetDependencyRail({ enemyBossUsage })` is **insufficient** for safe removal. Inspect assignments, pools, pieceType binds, and (best-effort) live `combatantsRef` ids.

New canister maps need a **new later** migration file after `20260901` (`OldActor = {}`). Never edit a frozen `NewActor`. Never blank `.old`.

---

## 6. Owner operations

All `#admin` only. Players never see this UI.

| Operation | Behavior |
| :--- | :--- |
| **Upload** | Show category spec (this document §4.2) → pick files (1–4 directions) → validate → store source + metadata `ACTIVE=false` until owner activates. Lifecycle copy may use #724 `ownerLifecycleFromFlags` **without** changing the spec sheet. |
| **Preview** | Iso diamond **80×40 and 140×70**, rounded top +9, player 24×24 pixel dummy, one standard enemy dummy, optional boss dummy (34×34 live vs 34×50 table), drop-shadow foot, AO **floor** shade, name/badge/status overlays, neighbor diamonds at (40,20). Actual scale. Warn clip / pad / overlap / **phone Continue zoom** / tablet camera follow. **Not** `catalogVisualPreviewSrc` `<img>`. |
| **Activate / deactivate** | Toggle `ACTIVE`. Deactivate → live instances with that id fall back **next frame** (resolver), no re-roll. |
| **Rename** | `DISPLAY_NAME` only. |
| **Replace / version** | New bytes, `VERSION++`, keep `ASSET_ID`. Live binds keep the id; runtime reloads blob. |
| **Safe removal** | Full dependency inspect first. If any assignment, pool entry, or live instance id matches: block hard-delete, offer deactivate. Do not treat `enemyBossUsage === 0` as sufficient. |
| **Assign to entity / family / pool** | Priority 1 / family / weighted. Pool resolved **once at spawn**. |
| **Weighted random** | `seededRng(hash(instanceId, poolId, poolVersion))` then walk cumulative weights. Do not wait for a missing encounter seed. |
| **Revert to default** | Clear assignment / `visualAssetId`. Builtin immediately. |
| **Dependency inspection** | List assignments, pools, spawn templates, and live `combatantsRef` ids. Union with #724 badge copy; do not replace the inspect with one count. |

Existing URL rows may later be imported as **inactive** library records (`VAL-2026-08-31-012`). Import never auto-activates.

---

## 7. Implementation placement

Per `AGENTS.md` and `VAL-2026-08-31-017`:

- New logic: `src/frontend/src/engine/visualAssets.ts` (+ tests) and `engine/visualPreview.ts`.
- **Union, do not concatenate:** `#639` `isoGrid.ts`; `#724` `adminOwnerUx.visualPool.ts` / `.deps.ts` / `.lifecycle.ts`; `#631` `adminOwnerUx.visualPreview.ts`; WX extracts `#427` hit-test, `#514`/`#591` wander, `#683` ground Doka, `#730` AO. One `export function` per name.
- Pixel tables already live in `engine/enemyPixelPatterns.ts` — **do not move them back into WX**.
- `DrawCombatantOptions`: add an optional custom-visual hook; default omitted = today’s fillRect path. **Do not** put `drawImage` inside `drawPixelPattern`.
- WorldExploration: **wiring only** — pass `visualAssetId` into `drawCombatant` / player site. **Do not** edit the RAF loop, map generation, turn logic, or damage math.
- Motoko metadata + blob refs: `adminGuard` + `#admin` only. Bytes in object storage, not Candid `Text`. New stables = new chain file after `20260901`.
- Tests: empty library `[]` → `{ kind: "builtin" }`; inactive/corrupt id → builtin; 100 fake renders same `visualAssetId`; occupancy/`drawSize` ignore bitmap size; two enemy wolves get distinct binds; `python3 scripts/check-duplicate-exports.py src/frontend/src`.

---

## 8. Risk register

| Risk | Mitigation |
| :--- | :--- |
| Random flicker | Bind at spawn on `Enemy`; tests: 100 fake renders same `visualAssetId` |
| Stretching enemy art onto bosses | Separate `boss_large`; never `scale(1.4)` a 24×24 upload onto a boss; don’t key off `isBoss` alone |
| Occupancy / click box from pixels | Keep registered hit 80×41 + pad 10/14; occupancy one cell |
| Stale `spriteUrl` / #724 https copy wired by mistake | VAL-012 + implemented VAL-2026-09-01-001 + VAL-2026-09-29-001 |
| Family owners expect family pixels | Today family art is **ghost/minion only** |
| Phone art looks “too small” | Match builtin: do not apply `MOBILE_ZOOM` to bitmaps by default |
| Walk-frame UI → hunter adds GIF atlas | Honesty copy + VAL-018 stills-only |
| Duplicate `export function` vs #724/#639/#631 | Union; distinct names for combat spec sheet vs https URL sentence |
| Resolver dumped into 19k-line WX | Follow `enemyPixelPatterns.ts`; restack with #730 AO extract |
| localStorage library wiped on `APP_VERSION` bump | Canister-authoritative; do not rely on `nsKey` |
| `drawImage` inside `drawPixelPattern` | Unpaired restore pops moving/shake saves |

---

## 9. What this run did not do

- No production / gameplay code changes.
- No `drawImage` wiring.
- No Motoko library types.
- Did not re-issue `VAL-2026-08-31-*` … `VAL-2026-09-28-*` as new implementation work.
- Did not treat open VAL docs PRs (#355–#715) or admin UX #724 as a vehicle to ship combat stills.
- Did not merge or comment on sibling PRs.
