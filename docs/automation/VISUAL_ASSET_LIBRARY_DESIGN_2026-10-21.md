# Custom Visual Asset Library & Assignment — 2026-10-21 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-10-21  
**HEAD:** `0f5363f` (`Merge pull request #332`) — unchanged since 2026-09-21  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**On `origin/main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md) (PR #268).  
**Open VAL docs (not on main):** #355, #418, #461, #520, #586, #624, #694, #715, **#782** (2026-09-21 … 2026-09-29).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-10-21.md`](./ACTION_IDS_VAL_2026-10-21.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer on `0f5363f`. Invented sprite boxes (64×64, 128×128) are not used. Pixel boxes did not change. The **viewport camera** contract is restated because sibling [#798](https://github.com/Mr-Melic/stralt/pull/798) landed in the queue *after* the 2026-09-29 VAL run.

---

## 0. Verdict

| Question | 2026-10-21 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (only a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, draw point = rounded iso top + 9, standard 24×24, squash max 1.5 → elite rec 36, portal boss **live** chess 8×8 × 1.4 ≈ 34×34, hit test **80×41**. |
| Did `origin/main` move since 09-21? | **No.** Newest GitHub PR is **#813** (2026-09-29T21:24Z). This cron is the first VAL run after a **22-day** queue freeze. |
| Only implemented VAL id? | **VAL-2026-09-01-001** (admin URL honesty). All other VAL-* remain NEW. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`. `useGetEnemyConfigs` (`hooks/useSpellQueries.ts` 111–138) is admin React Query, not combat.

---

## 1. Delta vs 2026-09-29

The 09-29 fact sheet ([PR #782](https://github.com/Mr-Melic/stralt/pull/782), branch `cursor/custom-visual-assets-system-945e`) inspected the same SHA. Pixel boxes, fallback identity, and “do not treat URL stubs as a library” still hold. New facts this run can cite:

| Topic | 2026-09-29 | 2026-10-21 |
| :--- | :--- | :--- |
| HEAD / WX | `0f5363f`, WX **19213** lines | **identical** |
| Newest GitHub PR | #782 created 00:15Z; queue still moving that day | **#813** (09-29 21:24Z). **No PRs 09-30 … 10-21.** |
| VAL docs on main | 08-31 … 09-02 only | same |
| [#798](https://github.com/Mr-Melic/stralt/pull/798) `engine/cameraFollow.ts` | **Not cited** (created 00:25Z, ten minutes after #782) | Extracts the **mobile follow step only**. Comment: WX still owns Rest/Death snap, desktop lock, `shouldFollowPlayer`, RAF 0.18 lerp. Tests: “Live WX never calls this on desktop.” |
| [#795](https://github.com/Mr-Melic/stralt/pull/795) pointer contracts | **Not cited** (created 00:22Z) | Source test locks mouse pad **10** / touch pad **14**, 400 ms ghost-click, shared `decideSpriteCastClick` / `decideTileCastClick`. MAA-011: `useIsMobile` is **width-only**. |
| Landscape phone tiles | implied by 768 breakpoint | **innerWidth ≥ 768 → 80×40**, even on a phone. Continue+portrait is **not** the only phone path. |
| Rest/Death camera vs paint | 09-27: desktop paint forces `cam=0` | Rest/Death **writes** `cameraRef` for every viewport (WX 5877–5893) **before** the desktop lock. Paint uses cam only when `!isDesktop` (**≤1024**). Tablet + landscape-phone Rest/Death **do pan**. |
| #724 / #631 / #730 / #639 | cited | still OPEN; still not on `0f5363f` |

Prior VAL IDs are **not** re-issued. Implementers on `main` already have the merged 08-31 contract plus VAL-2026-09-01-001 copy honesty. The nine open VAL docs PRs are evidence refreshes, not a merge gate for the first `engine/visualAssets.ts` PR.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Trailing `ctx.restore()` at 3883 has **no matching save** — do not put `drawImage` inside this function. |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782). **Does not** `restore`. |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023. **No bitmap hook.** |
| `engine/enemyPixelPatterns.ts` | Boss **8×12** tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12` |
| WX player | `drawPixelPattern` + `getPersistedPiecePattern`, **not** `drawCombatant` | 8315–8326 |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3722, 18111–18114 |
| Character creation | 8×8 × `scale = 10` → **80×80** art on **320×280** canvas | `CharacterCreation.tsx` 151–153, 452–456 |
| Character selection | `pixelSize = floor(internalSize / 10)` on a **120** CSS box | `CharacterSelection.tsx` 333–348 |

`Character.pixelPattern` is persisted but WorldExploration **never reads it**. The world player always uses chess `pieceType` + `playerView`.

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects pattern resolvers + `drawPattern` + `characterYOffset`. Putting a PNG through `drawPattern` would interpret bytes as a cell grid. Custom path = **optional top branch** (or a new option), plus a **second** one-line wire at the player site.

### 2.2 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text | **No.** WX has zero `getEnemyConfigs` / `spriteUrl`. |
| `PlayerSpriteConfig` facing + walk-frame URL arrays | Canister + Sprite panel | **No.** WX has zero `getPlayerSpriteConfigs`. Admin preview is 72×72 `<img object-fit:contain>`. |
| Login ad boxes | `adminSetAdBox` | Landing `<img>` — **not combat**. |

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`). **Walk Animation Frames** (`AdminDashboard.tsx` 1588–1620) still have **no** stored-not-rendered disclaimer. Do not implement walk cycles to make the heading true (`VAL-2026-08-31-018`).

`adminGuard.validateOptionalUrl` checks length ≤ 2048 (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–95). It does **not** decode images. Empty URL is valid.

`requireHttpsUrl` (97–104) is **landing ads**. `proofDataMimeAllowed` JPEG (109–116) is **shop proofs**. Neither is a combat MIME gate. Sibling #724 `visualUploadRequirementsBeforeSelect` is https-only **catalog URL copy** (VAL-2026-09-29-001) — not the file-picker spec sheet.

`MAX_JSON_BLOB = 32768` cannot hold PNG bytes. Caffeine `ExternalBlob` is bindgen plumbing. No visual-asset blob type exists.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"`, chess `pieceType`, 4-way `playerView` | 8×8 chess pixels + character colors. **Not** in `combatantsRef`. Second draw site. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\`` (WX 5809) | `drawCombatant` branch 4. Family 30% is **stats only**. |
| **ELITE / LARGE ENEMY** | **No type.** `isElite` grep in `src/` is empty. `elite_patrol` is a world-feature catalog key (`worldFeatures.ts` 44). | Same chess path × instance squash |
| **BOSS (portal)** | `id: \`boss_${bossConf.id}_${Date.now()}\`` (6524), `scaleX/Y = 1.4`, `family: "boss"`. **No `isBoss` / `bossId` on the Enemy.** | Branch 1 requires `isBoss && bossId` → **misses**. Live paint is chess **8×8 × 1.4 ≈ 34×34**. 8×12 tables unused. |
| **BOSS (Rush)** | `id: \`boss-rush-${roomIndex}-*\``, `isBoss: true`, **no `bossId`**, `pieceType` is a lore name (5326–5343) | Branch 1 misses (`!bossId`). Unknown `pieceType` → `king.front` **24×24**. |
| **BOSS (battle flag)** | CombatantEntry `isBoss` if `id.startsWith("boss_")` (11958–11983) | Turn-order / HP only. `toCombatantEntry` (combatantStore.ts 141–169) copies `isBoss` **if already on Enemy** — portal spawn never set it. |
| **SUMMON** | instance `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` 153) | 8×8 `creaturePatterns` + `strokeOwnerTint`. Wrapper spell id `enemy-summon-${pieceType}` (271) is **not** the instance id. |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use family pixel grids |
| **Future** | Portals (whirlpool r=25, WX 3898), walls (`wallHeight = 28` at 4085), hazards, loot, ads | Not `drawCombatant` |

`EnemyFamily` (`gameTypes.ts` 12–20) has no `"boss"`. Portal spawn still assigns `family: "boss"` (6568). Custom **family** assignment is a new presentation bind, not a repair of the unused 30% grids (`VAL-2026-08-31-013`).

`ELITE_ONLY` assets stay ineligible until an explicit instance flag exists (`VAL-2026-08-31-019`). Do not infer elite from `scaleY >= 1.4`, `iron_golem`, or HP.

Admin `PlayerSpriteConfig.characterPieceType` includes `"custom"`. Live `Character.pieceType` is the chess union. Do not treat admin `"custom"` as a combat category.

### 2.4 Gameplay footprint is tile-based

`engine/occupancy.ts` 84–96: one combatant per logical tile. No width/height.

Sprite rects are a **fixed tile-derived box**, not the painted pattern (WX 8085–8104, 8335–8353):

```
drawSize = { w: effectiveTileW, h: effectiveTileH * 1.5 }
  desktop / unzoomed: 80 × 60
  mobile-zoom:        140 × 105
registered h = effectiveTileH/2 + CHARACTER_Y_OFFSET + (effectiveTileH*1.5)/2
  desktop: 20 + (−9) + 30 = 41
drawAnchor = (tileTopX, tileTopY − CHARACTER_Y_OFFSET) = (tileTopX, tileTopY + 9)
player drawOrder = 99999
```

`hitTestSprite` (8885–8918) tests that stored `x,y,w,h` plus padding. Live pads: mouse **10** (10127), touch **14** (10819). Sibling #795 locks those two literals in `canvasPointerParity.contracts.test.ts`. Custom art must **never** rewrite `drawSize` / occupancy / range / targeting from bitmap width.

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` → desktop **12 × 4.2** (8033–8053). It does not track sprite pixels.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors()` | spawn (WX **5768**, default `Math.random`) | stored on `scaleX`/`scaleY`. Tall/wide branches max **1.5** (`spawnPolicy.ts` 239–248) |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` (5864) |
| Battle stats | `getEnemyBaseStats` | `seededRng` from `seedKey` (`combatMath.ts` 122–128) |
| Map tiles | generate | `seededRng(seed)` |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`seededRng` is the correct primitive for weighted pool picks. Hash the **already unique instance id** plus `poolId` / assignment version. Write `visualAssetId` once at spawn / summon / boss portal. If the bound id later fails validation, fall back to builtin — **do not re-roll**.

Summon `turnsRemaining` ticks must not re-pick. `toCombatantEntry` **drops** unknown fields — `visualAssetId` must live on `combatantsRef` Enemy (and survive `updateCombatant` spreads), not only on turn-order rows.

Custom art must **not** inherit instance squash 0.6–1.5. That squash is a pixel-art variety trick.

### 2.6 Owner gate

- `App.tsx` 291: `isAdmin = userRole === "admin"`.
- Admin dashboard hard-denies `!isAdmin`.
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- Library UI is **admin-only**. Players never upload or choose combat art.

### 2.7 Viewport matrix (do not collapse “phone” to 140×70)

| Viewport | `innerWidth` | `isMobile` (&lt;768) | `isDesktop` (&gt;1024) | Tiles | `gridToScreen` cam | Rest/Death paint |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Portrait phone after Continue | &lt;768 | true | false | **140×70** | uses `cameraRef` | **pans** (Rest snap 5877–5893) |
| Landscape phone / small tablet | 768–1024 | false | false | **80×40** | uses `cameraRef` | **pans** |
| Desktop | &gt;1024 | false | true | **80×40** | **forced 0** (3780–3781, 8844–8845, 8942–8943) | writes `cameraRef`, **paint ignores it** |

`SmallScreenGuard` is Continue, not a block (`App.tsx` 337–415). Bypass is session-stored. Rotating to width ≥768 auto-persists Continue (351–355) and **drops MOBILE_ZOOM**.

`#798` `stepCameraFollow` is the overworld follow math **after** Rest/Death return and desktop lock. Iso preview must not treat that helper as “desktop now follows.” Import it after #798; until then call live WX. Do not copy a private projector (`#639` `isoGrid.ts` is still OPEN — rounded top ≠ unrounded click-cache center).

`gridToScreen` cache keys `gx,gy` only (3765–3802) and does **not** invalidate on camera. Custom draw must share the live helper so Rest/Death pans and cache stay aligned.

### 2.8 rAF / overlay stack (preview clip)

- Battle-init skips 3 frames (7238–7244).
- `canvas.width=` (7256–7261) and `setTransform`+`scale(dpr)` (7263–7264) **reset 2D state every frame** when size mismatches. `ctx.imageSmoothingEnabled` is **never** set. CSS `canvas { image-rendering: pixelated }` (`index.css` 652–655) is display-time only.
- Hit-shake: `translate(shake)` on this ctx (7265–7267). Custom `drawImage` must use the **shaken** ctx. Pixel-puff uses a sidecar `getContext` — do not bind stills there.
- AO is 8px floor-diamond gradients (bits 4/8), **not** combatant shading. #730 extracts it; do not multiply PNGs by AO.
- Depth key `x+y` before combatant pass.
- Overlay: name `screenPos.y − 34` (8122); level +14; status 16×16 at drawY−30 (8246–8247); summon badge `(x+18, y−48)` (8146–8147); wander r=15 (8229–8234); moving-enemy `#ff6b6b` blur 8 wraps draw (8057–8076); ground Doka coin is a separate extract (#683).
- Neighbor iso pitch desktop Δ=(40, 20) ≈ 44.7 px. Warn visual overlap at width **> 40**. `MAX_WIDTH` 80 is the home tile, not “safe vs neighbor.”
- Player colors: cell 2 = primary, extra = accent (8319–8325). PNGs ignore the picker.

### 2.9 Persistence — drafts never enter combat

`versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. `App.tsx` 297–318 `localStorage.clear()` on `APP_VERSION` (`v163`) drops everything else. `nsKey` (WX 866–869) is per-slot game cache, not a library.

Uploads stay canister **DRAFT** until **ACTIVE**. Bytes in object storage. New Motoko maps need a chain file **after** `20260901_000000` with `OldActor = {}`. Never amend frozen `NewActor`s.

#724 `ownerAssetDependencyRail` is a single `enemyBossUsage` badge — not sufficient for safe delete (VAL-2026-09-29-003).

---

## 3. Visual fallback invariant

Resolution order for every combatant, every frame:

1. **Bound instance assignment** — `entity.visualAssetId` points at a library record that is `ACTIVE`, `VALIDATION_STATUS = ok`, bytes decode, and category/eligibility still match.
2. **Bound pool assignment** — `entity.visualPoolId` was resolved **at spawn** into a stored `visualAssetId`. If that id is now invalid, **do not re-roll in render.** Fall through.
3. **Built-in / generated pixel visual** — current `drawCombatant` / `drawPixelPattern` path.

Hard rules:

- Missing, inactive, corrupt, undecodable, oversized, or ineligible custom assets **immediately** use step 3.
- Empty library ⇒ every entity is step 3. No upload required to ship a new enemy or boss.
- Failures log once (reuse `logPatternLookupFailed` throttle), never throw, never block combat.
- Ordinary React rerenders and rAF ticks must not change appearance.

```ts
// src/frontend/src/engine/visualAssets.ts  (not implemented)
function resolveRuntimeVisual(entity, library): RuntimeVisual
  // { kind: "custom", bitmap, profile } | { kind: "builtin" }
```

---

## 4. Derived render measurements (do not invent)

All sizes are **logical CSS pixels** after `ctx.scale(dpr)` (WX 7263–7264). Source bitmaps may be integer multiples for sharpness.

### 4.1 Tile, anchor, scale

| Quantity | Desktop / unzoomed (≥768) | Mobile-zoom (`innerWidth < 768` after Continue) | Source |
| :--- | ---: | ---: | :--- |
| Iso diamond | 80 × 40 | 140 × 70 | `TILE_*` × `MOBILE_ZOOM` 1.75 |
| `gridToScreen` | **rounded top vertex** | same | WX 3772–3793 (cached; desktop cam=0) |
| Tile visual center | top + `th/2` → +20 / +35 | | `tileCenter` 3804–3810 |
| Character draw point | `(tileTopX, tileTopY + 9)` | same +9 | `CHARACTER_Y_OFFSET = -9` |
| Pattern **anchor** | **center** on the draw point | same | `startX = x − patternWidth/2` (3860–3861) |
| Drop-shadow foot | `(tileTopX, tileTopY + th/2 + 4)`, r = min(0.35 tw, 0.3 th) | | 8035–8038 → desktop **12 × 4.2** |
| World cell size | **3×3** logical px × instance scale | **not** × 1.75 | 3855 |
| Default pattern | **8×8 cells** | | chess / creature tables |
| Default drawn @ scale 1 | **24 × 24** | 24 × 24 | 8 × 3 |
| Enemy squash | 0.6–**1.5** stored | same | `spawnPolicy.ts` 239–248 |
| Elite rec (visual only) | **36 × 36** | 36 | 24 × 1.5 |
| Portal boss **live** | chess 8×8 × 1.4 ≈ **34 × 34** | 34 × 34 | 6524–6536; no `isBoss`/`bossId` |
| Boss **tables** (unused on live Enemy) | 8×12 × 3 × 1.4 ≈ **34 × 50** | | `enemyPixelPatterns.ts` 10–24 |
| Rush live | `king.front` **24 × 24** | 24 | `isBoss` without `bossId` |
| Portrait | 60×60, 6px cells → 48×48 art | | 3720, 18113 |
| Creation preview | 80×80 on 320×280 | | `CharacterCreation.tsx` 151, 454 |
| Name / status / badge | y−34 / drawY−30 / (x+18, y−48) | | 8122, 8246, 8146 |
| Sprite hit `drawSize` | 80 × 60 | 140 × 105 | 8103, 8353 |
| Sprite hit tested `h` | **41** | 20×1.75 − 9 + 52.5 = **78.5** | 8092 |
| Hit padding | mouse 10 / touch 14 | same pads | 10127 / 10819; #795 lock |
| Wall extrusion | 28 | 28 | 4085 |
| Neighbor pitch | (40, 20) ≈ 44.7 | (70, 35) | 3785–3786 |
| AO edge | 8 px on **floor** | 8 | 7558–7613 region (09-29); #730 |

**Anchor for custom bitmaps:** center on `(tileTopX, tileTopY + 9)`. Do not use tile center, foot bone, 320×280 creation canvas, 72×72 admin `<img>`, or 60×60 portrait as recommended upload size.

Do **not** apply `MOBILE_ZOOM` to bitmaps by default (match builtin 3px cells).

### 4.2 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**.

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF not used in combat. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | Walk-frame arrays are never drawn. |
| `MAX_FILE_SIZE` | **256 KiB per still** (starting reject) until IC ingress / object-store limits are measured | `MAX_URL` 2048 is text. Shop proof 524_288 is a different surface. Do not store raw base64 in Motoko `Text`. Do not use `data:` URLs. Do not require `https:` on object-store ids. |

#### PLAYER CHARACTER — `player_standard`

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (or **48** @2×) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| `ANCHOR` | center on tile top + 9 |
| `DEFAULT_SCALE` | **1** |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 (warn overlap &gt; 40 wide) |

Player stills key `pieceType` + `playerView`. Second draw site. Portrait/creation stay generated pixels in v1.

#### STANDARD ENEMY — `enemy_standard`

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| `DEFAULT_SCALE` | **1** — **do not inherit squash** |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 |

Bind on `combatantsRef` Enemy (`enemy-${n}-${t}`).

#### ELITE / LARGE ENEMY — `enemy_elite` (metadata only)

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **36** (24 × 1.5 squash max) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| Occupancy | **one tile** |

`ELITE_ONLY` ineligible until a real flag exists.

#### BOSS — `boss_large` (separate profile; do not stretch enemy art)

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` (live portal) | **34** / **34** (8×8 × 1.4) |
| Optional taller when 8×12 is actually wired | **34** / **50** |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **80** (home diamond; warn &gt; 40 overlap and AO coverage) |
| `DEFAULT_SCALE` | **1** — do not apply 1.4 squash on a PNG |
| Keying | **Not** `isBoss` / `family === "boss"` / Rush lore `pieceType`. Use assignment records + instance id prefixes (`boss_*`, `boss-rush-*`) after an explicit profile. |

Do not simply stretch `enemy_standard` art.

#### SUMMON — `summon_standard`

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| Extra | Owner tint stroke; badge at (x+18, y−48). Bind on `summon-${random}`, not `enemy-summon-${pieceType}`. |

#### Future categories

Portals, walls, hazards, loot, ads, death juice (`engine/effects.ts` fillRect fragments) are **ineligible** in v1 (`VAL-2026-08-31-016`). Landing ads stay a separate URL+`<img>` path.

---

## 5. Metadata, CRUD, pools

Keep the 08-31 field set: `ASSET_ID`, `DISPLAY_NAME`, `ENTITY_CATEGORY`, `ENTITY_FAMILY`, `ENTITY_IDS`, `VARIANT_TAGS`, `ACTIVE`, `WEIGHT`, `RARITY`, `ELITE_ONLY`, `BOSS_ONLY`, `UPLOAD_DATE`, `VERSION`, `SOURCE_METADATA`, `RENDER_PROFILE`, `VALIDATION_STATUS`.

Owner operations: upload, preview, activate, deactivate, rename, replace (new `VERSION`), safe removal, assign to entity / family / pool, weighted random (at **spawn**), revert to default, dependency inspection.

Weighted pools: only `ACTIVE && VALIDATION_STATUS=ok` eligible members. Empty / none qualify → builtin. Selection = `pickWeighted(seededRng(hash(instanceId, poolId, poolVersion)), eligible)`.

Safe delete: block when any assignment, pool membership, or live `combatantsRef` bind exists; offer deactivate (next frame builtin, no re-roll).

---

## 6. Preview

Iso canvas (not 72×72 `object-fit:contain`), using live `gridToScreen` / #639 rounded top:

1. Desktop 80×40 diamond, 24×24 art, +9 anchor, player dummy, neighbor dummy, AO on **floor**.
2. Portrait-phone 140×70 diamond, **same 24×24 art** (no bitmap zoom).
3. Landscape-phone / tablet 80×40 + Rest/Death **camera pan** (cam used).
4. Desktop Rest/Death: cameraRef written, **paint cam=0** — show that the still does not slide.

Warn: clipping vs name/status/badge, padding vs 80×41+10/14, scale vs squash, neighbor overlap &gt; 40, AO 8px coverage, mobile relative smallness, landscape unzoom.

`#631` `catalogVisualPreviewSrc` is an admin `<img>` helper — not this preview.

---

## 7. Architecture / stack

- New modules + tests: `engine/visualAssets.ts`, `engine/visualPreview.ts`. Do not grow the rAF body (WX 19213).
- WX extracts still OPEN: #427 hit-test, #514/#591 wander, #639 isoGrid, #683 ground Doka, #730 AO, **#798 cameraFollow**. Union overlapping files; **one** `export function` per name.
- #724 owner UX TS: import after that PR; do not concatenate `customVisualPoolCopy`. Combat spec sheet uses a **distinct** name from `visualUploadRequirementsBeforeSelect`.
- This docs PR adds **only** the two dated files below so it stays merge-clean vs `origin/main` and vs older VAL docs PRs.

---

## 8. What not to do

- Do not make upload mandatory.
- Do not `drawImage` inside `drawPixelPattern` (unpaired `restore`; fillRect-only).
- Do not pick pools in React render or rAF.
- Do not infer collision / occupied tiles / movement / range / targeting / hitbox from PNG size.
- Do not stretch enemy art to fake a boss.
- Do not store library bytes in `localStorage` / `nsKey`.
- Do not wait for #355–#782 to merge before implementing `resolveRuntimeVisual` on `main`.

Production code was not modified in this run.
