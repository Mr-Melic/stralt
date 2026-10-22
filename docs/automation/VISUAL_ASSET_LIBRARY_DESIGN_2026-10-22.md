# Custom Visual Asset Library & Assignment — 2026-10-22 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-10-22  
**HEAD:** `0f5363f` (`Merge pull request #332`) — unchanged since 2026-09-21  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**On `origin/main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md) (PR #268).  
**Open VAL docs (not on main):** #355, #418, #461, #520, #586, #624, #694, #715, #782, **#835** (2026-09-21 … 2026-10-21).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-10-22.md`](./ACTION_IDS_VAL_2026-10-22.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer on `0f5363f`. Invented sprite boxes (64×64, 128×128) are not used. Pixel boxes did not change. The **persist** and **admin-helper** contracts are restated because siblings [#828](https://github.com/Mr-Melic/stralt/pull/828) and [#838](https://github.com/Mr-Melic/stralt/pull/838) landed in the queue around the 2026-10-21 VAL run and were not cited there.

---

## 0. Verdict

| Question | 2026-10-22 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (only a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, draw point = rounded iso top + 9, standard 24×24, squash max 1.5 → elite rec 36, portal boss **live** chess 8×8 × 1.4 ≈ 34×34, hit test **80×41**. |
| Did `origin/main` move since 09-21? | **No.** `origin/main` is still `0f5363f`. After the freeze behind **#813** (2026-09-29), sibling automations resumed **2026-10-21** (#815+). This run is ~24h later; newest open sibling at inspection is **#869**. |
| Only implemented VAL id? | **VAL-2026-09-01-001** (admin URL honesty). All other VAL-* remain NEW. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`. `useGetEnemyConfigs` (`hooks/useSpellQueries.ts` 111–138) is admin React Query, not combat.

Do **not** promote `Character.pixelPattern` (required Motoko `Text`, cap **16_384**) or catalog sprite URLs to a load-time combat dependency. Sibling [#828](https://github.com/Mr-Melic/stralt/pull/828) `SDEG-2026-10-21-003` already locks that persist rule. VAL bytes belong in optional library maps + object storage.

---

## 1. Delta vs 2026-10-21

The 10-21 fact sheet ([PR #835](https://github.com/Mr-Melic/stralt/pull/835), branch `cursor/custom-visual-assets-system-918a`) inspected the same SHA. Pixel boxes, fallback identity, viewport camera matrix, and “do not treat URL stubs as a library” still hold. New facts this run can cite:

| Topic | 2026-10-21 | 2026-10-22 |
| :--- | :--- | :--- |
| HEAD / WX | `0f5363f`, WX **19213** lines | **identical** |
| Newest VAL docs PR | **#835** itself (created 00:17Z) | #835 still OPEN, not on main. This run adds unique `2026-10-22` files only. |
| [#828](https://github.com/Mr-Melic/stralt/pull/828) persist visuals | **Not cited** (created 00:14Z, three minutes before #835) | `SDEG-2026-10-21-003`: stored `pixelPattern` JSON is catalog snapshot, **not** combat art; sprite URLs stay optional; `adminDeletePlayerSpriteConfig` does not delete Character. Helper `pixelPatternPersistVisual.ts` (`combatDrawUsesStoredPixelPattern() === false`). |
| `Character.pixelPattern` cap | not numbered | Motoko reject `> 16_384` (`main.mo` 315–316, 395–396). Official create writes `JSON.stringify(chessPiecePatterns[selectedPiece])` (`CharacterCreation.tsx` 273) — not PNG bytes. |
| Creation canvas CSS | 80×80 art on **320×280** internal | Internal still 320×280 (`CharacterCreation.tsx` 452–455); **CSS display is 240×210** (462–463). Neither is an upload size. |
| [#838](https://github.com/Mr-Melic/stralt/pull/838) owner UX | **Not cited** (created 00:18Z, one minute after #835) | Adds `adminOwnerUx.auditView/changelogPublish/dirty/entityJump/piiRedact/rollbackConfirm`. Explicitly does **not** restack `AdminDashboard.tsx` and does **not** recreate #631 / #664 / #724 / #775 helpers. |
| [#841](https://github.com/Mr-Melic/stralt/pull/841) click-trace stub | **Not cited** (created 00:18Z) | Production Vite aliases `debug/clickTrace` → stub. **Does not restack WX.** VAL must not grow the RAF body or edit that plugin. |
| [#861](https://github.com/Mr-Melic/stralt/pull/861) auto-summon kits | not cited | `spawnSummonUnit` still never copies `summonKit` onto `summon.spells`. Catalog kit resolve is **combat**, not a visual catalog. Bind stills on `summon-${random}`, not pieceType / kit spell ids. |
| Combat kit-share PRs | queue resuming | **#842–#868** share execute with advertised kit fields. They do **not** set `isBoss`/`bossId` on the portal Enemy. Live portal paint remains chess 8×8 × 1.4. |
| Newest open sibling | #835 / #831 | **#869** (2026-10-21T21:11Z) persist remount — not paint. |

Prior VAL IDs are **not** re-issued. Implementers on `main` already have the merged 08-31 contract plus VAL-2026-09-01-001 copy honesty. The ten open VAL docs PRs are evidence refreshes, not a merge gate for the first `engine/visualAssets.ts` PR.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Trailing `ctx.restore()` at 3883 has **no matching save** — do not put `drawImage` inside this function. WX also **injects** it as `drawPattern` into `drawCombatant` (8072), so an overload would hit every combatant branch. |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782). **Does not** `restore`. |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023. **No bitmap hook.** |
| `engine/enemyPixelPatterns.ts` | Boss **8×12** tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12` |
| WX player | `drawPixelPattern` + `getPersistedPiecePattern`, **not** `drawCombatant` | 8315–8326 |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3722, 18111–18114 |
| Character creation | 8×8 × `scale = 10` → **80×80** art on **320×280** internal canvas, CSS **240×210** | `CharacterCreation.tsx` 151–153, 452–463 |
| Character selection | `pixelSize = floor(internalSize / 10)` on a **120** CSS box | `CharacterSelection.tsx` 333–348 |

`Character.pixelPattern` is a **required** Text field. Official create serializes the catalog chess grid (`CharacterCreation.tsx` 273). `getPersistedPiecePattern` (`pieceArt.ts` 653–658) looks up by `pieceType` string and falls back to `king.front`. WorldExploration **never reads** the stored blob (portrait 3719, player 8289). Unknown `pieceType` paints `king.front`.

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects pattern resolvers + `drawPattern` + `characterYOffset`. Putting a PNG through `drawPattern` would interpret bytes as a cell grid. Custom path = **optional top branch** (or a new option), plus a **second** one-line wire at the player site.

### 2.2 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text | **No.** WX has zero `getEnemyConfigs` / `spriteUrl`. |
| `PlayerSpriteConfig` facing + walk-frame URL arrays | Canister + Sprite panel | **No.** WX has zero `getPlayerSpriteConfigs`. Admin preview is 72×72 `<img object-fit:contain>`. |
| `Character.pixelPattern` | Required Text, cap 16_384 | **No.** Combat uses `pieceType` → catalog grid. |
| Login ad boxes | `adminSetAdBox` | Landing `<img>` — **not combat**. |

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`). **Walk Animation Frames** (`AdminDashboard.tsx` 1588–1620) still have **no** stored-not-rendered disclaimer. Do not implement walk cycles to make the heading true (`VAL-2026-08-31-018`).

`adminGuard.validateOptionalUrl` checks length ≤ 2048 (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–95). It does **not** decode images. Empty URL is valid.

`requireHttpsUrl` (97–104) is **landing ads**. `proofDataMimeAllowed` JPEG (109–116) is **shop proofs**. Neither is a combat MIME gate. Sibling #724 `visualUploadRequirementsBeforeSelect` is https-only **catalog URL copy** (VAL-2026-09-29-001) — not the file-picker spec sheet.

`MAX_JSON_BLOB = 32768` and `pixelPattern` **16_384** cannot hold PNG bytes. Caffeine `ExternalBlob` is bindgen plumbing. `STORAGE_GATEWAY_URL` defaults to `https://blob.caffeine.ai` in Vite — that is blob-gateway config, not a library. No visual-asset blob type exists.

`adminDeletePlayerSpriteConfig` removes the catalog row only (`main.mo` 854–860). It must not delete Character. VAL safe-delete of a player still must not either.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"`, chess `pieceType`, 4-way `playerView` | 8×8 chess pixels + character colors. **Not** in `combatantsRef`. Second draw site. Key `pieceType` + `playerView`, **not** the stored JSON blob. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\`` (WX 5809) | `drawCombatant` branch 4. Family 30% is **stats only**. |
| **ELITE / LARGE ENEMY** | **No type.** `isElite` grep in `src/` is empty. `elite_patrol` is a world-feature catalog key (`worldFeatures.ts` 44). | Same chess path × instance squash |
| **BOSS (portal)** | `id: \`boss_${bossConf.id}_${Date.now()}\`` (6524), `scaleX/Y = 1.4`, `family: "boss"`. **No `isBoss` / `bossId` on the Enemy.** | Branch 1 requires `isBoss && bossId` → **misses**. Live paint is chess **8×8 × 1.4 ≈ 34×34**. 8×12 tables unused. |
| **BOSS (Rush)** | `id: \`boss-rush-${roomIndex}-*\`` (5326), `isBoss: true`, **no `bossId`**, `pieceType` is a lore name, **no `scaleX/Y`** (`newEnemies: any[]`) | Branch 1 misses (`!bossId`). Unknown `pieceType` → `king.front` **24×24** (`scale ?? 1`). |
| **BOSS (battle flag)** | CombatantEntry `isBoss` if `id.startsWith("boss_")` (11958–11983) | Turn-order / HP only. `toCombatantEntry` (combatantStore.ts 141–169) copies `isBoss` **if already on Enemy** — portal spawn never set it. |
| **SUMMON** | instance `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` 153) | 8×8 `creaturePatterns` + `strokeOwnerTint`. Wrapper spell id `enemy-summon-${pieceType}` (271) is **not** the instance id. `#861` may fill empty `spells` from catalog `summonKit` — that is AI, not art. |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use family pixel grids |
| **Future** | Portals (whirlpool r=25, WX 3898), walls (`wallHeight = 28` at 4085), hazards, loot, ads | Not `drawCombatant` |

`EnemyFamily` (`gameTypes.ts` 12–20) has no `"boss"`. Portal / Rush spawn still assign `family: "boss"` (6568, 5343). Custom **family** assignment is a new presentation bind, not a repair of the unused 30% grids (`VAL-2026-08-31-013`).

`ELITE_ONLY` assets stay ineligible until an explicit instance flag exists (`VAL-2026-08-31-019`). Do not infer elite from `scaleY >= 1.4`, `iron_golem`, or HP.

Admin `PlayerSpriteConfig.characterPieceType` includes `"custom"`. Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11, 31). Do not treat admin `"custom"` as a combat category.

Family grids exist (`enemyPixelPatterns.ts` 434–498) but are unused for the 30% family roll:

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

### 2.4 Gameplay footprint is tile-based

`engine/occupancy.ts` `isCellFree` (84–96): one logical cell — in-bounds, walkable, not barrier/portal/void, not `ctx.isOccupied`. No width/height. Visual size must never feed occupancy, movement, range, or targeting.

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
| `generateEnemyScaleFactors()` | spawn (WX **5768**, default `Math.random`) | stored on `scaleX`/`scaleY`. Tall/wide branches max **1.5** (`spawnPolicy.ts` 239–248; locked in `spawnPolicy.test.ts` 171–201) |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` (5864) |
| Battle stats | `getEnemyBaseStats` | `seededRng` from `seedKey` (`combatMath.ts` 122–128) |
| Map tiles | generate | `seededRng(seed)` |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`seededRng` is the correct primitive for weighted pool picks. Hash the **already unique instance id** plus `poolId` / assignment version. Write `visualAssetId` once at spawn / summon / boss portal. If the bound id later fails validation, fall back to builtin — **do not re-roll**.

Summon `turnsRemaining` ticks must not re-pick. `#861` filling empty `spells` from catalog must not re-pick either. `toCombatantEntry` **drops** unknown fields — `visualAssetId` must live on `combatantsRef` Enemy (and survive `updateCombatant` spreads), not only on turn-order rows.

Custom art must **not** inherit instance squash 0.6–1.5. That squash is a pixel-art variety trick.

### 2.6 Owner gate

- `App.tsx` 291: `isAdmin = userRole === "admin"`.
- Admin dashboard hard-denies `!isAdmin`.
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- Library UI is **admin-only**. Players never upload or choose combat art.
- #838 owner UX helpers are **not** a library. VAL CRUD must not restack `AdminDashboard.tsx` while #334 / #341 / #413 / #470 / #539 / #564 / #838 queue.

### 2.7 Viewport matrix (do not collapse “phone” to 140×70)

| Viewport | `innerWidth` | `isMobile` (&lt;768) | `isDesktop` (&gt;1024) | Tiles | `gridToScreen` cam | Rest/Death paint |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Portrait phone after Continue | &lt;768 | true | false | **140×70** | uses `cameraRef` | **pans** (Rest snap 5877–5893) |
| Landscape phone / small tablet | 768–1024 | false | false | **80×40** | uses `cameraRef` | **pans** |
| Desktop | &gt;1024 | false | true | **80×40** | **forced 0** (3780–3781, 8844–8845, 8942–8943) | writes `cameraRef`, **paint ignores it** |

`SmallScreenGuard` is Continue, not a block (`App.tsx` 337–415). Bypass is session-stored. Rotating to width ≥768 auto-persists Continue (351–355) and **drops MOBILE_ZOOM**. `useIsMobile` (`hooks/use-mobile.tsx` 17–26) is **width-only**.

`#798` `stepCameraFollow` is the overworld follow math **after** Rest/Death return and desktop lock. Iso preview must not treat that helper as “desktop now follows.” Import it after #798; until then call live WX. Do not copy a private projector (`#639` `isoGrid.ts` is still OPEN — rounded top ≠ unrounded click-cache center).

`gridToScreen` cache keys `gx,gy` only (3765–3802) and does **not** invalidate on camera. Custom draw must share the live helper so Rest/Death pans and cache stay aligned.

### 2.8 rAF / overlay stack (preview clip)

- Battle-init skips 3 frames (7238–7244).
- `canvas.width=` (7256–7261) and `setTransform`+`scale(dpr)` (7263–7264) **reset 2D state every frame** when size mismatches. `ctx.imageSmoothingEnabled` is **never** set. CSS `canvas { image-rendering: pixelated }` (`index.css` 652–655 and WX inline 17890) is display-time only.
- Hit-shake: `translate(shake)` on this ctx (7265–7267). Custom `drawImage` must use the **shaken** ctx. Pixel-puff uses a sidecar `getContext` — do not bind stills there.
- AO is 8px floor-diamond gradients (bits 4/8), **not** combatant shading. #730 extracts it; do not multiply PNGs by AO.
- Depth key `x+y` before combatant pass.
- Overlay: name `screenPos.y − 34` (8122); level +14; status 16×16 at drawY−30 (8246–8247); summon badge `(x+18, y−48)` (8146–8147); wander r=15 (8229–8234); moving-enemy `#ff6b6b` blur 8 wraps draw (8057–8076); ground Doka coin is a separate extract (#683).
- Neighbor iso pitch desktop Δ=(40, 20) ≈ 44.7 px. Warn visual overlap at width **> 40**. `MAX_WIDTH` 80 is the home tile, not “safe vs neighbor.”
- Player colors: cell 2 = primary, extra = accent (8319–8325). PNGs ignore the picker.
- #841 stubs click-trace **in production Vite only**. It does not change paint. Do not restack WX to “help” it.

### 2.9 Persistence — drafts never enter combat

`versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. `App.tsx` 297–318 `localStorage.clear()` on `APP_VERSION` (`v163`) drops everything else. `nsKey` (WX 866–869) is per-slot game cache, not a library.

Uploads stay canister **DRAFT** until **ACTIVE**. Bytes in object storage. New Motoko maps need a chain file **after** `20260901_000000` with `OldActor = {}`. Never amend frozen `NewActor`s. Never put library ids on required Character fields (`pixelPattern` already occupies that slot as unused catalog JSON).

#724 `ownerAssetDependencyRail` is a single `enemyBossUsage` badge — not sufficient for safe delete (VAL-2026-09-29-003). #838 does not add a visual dependency rail.

#828 `pixelPatternPersistVisual.ts` is a **persist contract helper**, not a resolver. Do not clone it into `engine/visualAssets.ts`. Import after #828 if a test needs `combatDrawUsesStoredPixelPattern`.

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
- Player hydrate must not require a library id, a sprite URL, or a parseable `pixelPattern` blob (`SDEG-2026-10-21-003`).

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
| Rush live | `king.front` **24 × 24** | 24 | `isBoss` without `bossId`; no scale |
| Portrait | 60×60, 6px cells → 48×48 art | | 3720, 18113 |
| Creation preview | 80×80 on 320×280 internal / **240×210 CSS** | | `CharacterCreation.tsx` 151, 452–463 |
| Name / status / badge | y−34 / drawY−30 / (x+18, y−48) | | 8122, 8246, 8146 |
| Sprite hit `drawSize` | 80 × 60 | 140 × 105 | 8103, 8353 |
| Sprite hit tested `h` | **41** | 20×1.75 − 9 + 52.5 = **78.5** | 8092 |
| Hit padding | mouse 10 / touch 14 | same pads | 10127 / 10819; #795 lock |
| Wall extrusion | 28 | 28 | 4085 |
| Neighbor pitch | (40, 20) ≈ 44.7 | (70, 35) | 3785–3786 |
| AO edge | 8 px on **floor** | 8 | #730 |

**Anchor for custom bitmaps:** center on `(tileTopX, tileTopY + 9)`. Do not use tile center, foot bone, 320×280 creation canvas, **240×210 CSS creation box**, 72×72 admin `<img>`, or 60×60 portrait as recommended upload size.

Do **not** apply `MOBILE_ZOOM` to bitmaps by default (match builtin 3px cells).

### 4.2 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**.

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF not used in combat. Shop-proof JPEG is a different surface. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | Walk-frame arrays are never drawn. |
| `MAX_FILE_SIZE` | **256 KiB per still** (starting reject) until IC ingress / object-store limits are measured | `MAX_URL` 2048 and `pixelPattern` 16_384 are text. Shop proof 524_288 is a different surface. Do not store raw base64 in Motoko `Text`. Do not use `data:` URLs. Do not require `https:` on object-store ids. |

#### PLAYER CHARACTER — `player_standard`

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (or **48** @2×) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| `ANCHOR` | center on tile top + 9 |
| `DEFAULT_SCALE` | **1** |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 (warn overlap &gt; 40 wide) |

Player stills key `pieceType` + `playerView`. Second draw site. Portrait/creation stay generated pixels in v1. Do not persist the PNG into `Character.pixelPattern`.

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
| Keying | **Not** `isBoss` / `family === "boss"` / Rush lore `pieceType` / kit-share landing. Use assignment records + instance id prefixes (`boss_*`, `boss-rush-*`) after an explicit profile. |

Do not simply stretch `enemy_standard` art.

#### SUMMON — `summon_standard`

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| Extra | Owner tint stroke; badge at (x+18, y−48). Bind on `summon-${random}`, not `enemy-summon-${pieceType}`, not catalog `summonKit` ids. Empty `spells` after spawn is not a missing visual. |

#### Future categories

Portals, walls, hazards, loot, ads, death juice (`engine/effects.ts` fillRect fragments) are **ineligible** in v1 (`VAL-2026-08-31-016`). Landing ads stay a separate URL+`<img>` path.

---

## 5. Metadata, CRUD, pools

Keep the 08-31 field set: `ASSET_ID`, `DISPLAY_NAME`, `ENTITY_CATEGORY`, `ENTITY_FAMILY`, `ENTITY_IDS`, `VARIANT_TAGS`, `ACTIVE`, `WEIGHT`, `RARITY`, `ELITE_ONLY`, `BOSS_ONLY`, `UPLOAD_DATE`, `VERSION`, `SOURCE_METADATA`, `RENDER_PROFILE`, `VALIDATION_STATUS`.

Owner operations: upload, preview, activate, deactivate, rename, replace (new `VERSION`), safe removal, assign to entity / family / pool, weighted random (at **spawn**), revert to default, dependency inspection.

Weighted pools: only `ACTIVE && VALIDATION_STATUS=ok` eligible members. Empty / none qualify → builtin. Selection = `pickWeighted(seededRng(hash(instanceId, poolId, poolVersion)), eligible)`.

Safe delete: block when any assignment, pool membership, or live `combatantsRef` bind exists; offer deactivate (next frame builtin, no re-roll). Deleting a player still must not delete Character (`SDEG-2026-10-21-003`).

Admin spec sheet **before** file selection must use a **distinct** helper name from:

- #724 `visualUploadRequirementsBeforeSelect` (https catalog URL copy)
- #631 `catalogVisualPreviewSrc` (admin `<img>`)
- #838 `adminOwnerUx.*` (audit / dirty / jump / PII / rollback / changelog)

---

## 6. Preview

Iso canvas (not 72×72 `object-fit:contain`, not 240×210 creation CSS), using live `gridToScreen` / #639 rounded top:

1. Desktop 80×40 diamond, 24×24 art, +9 anchor, player dummy, neighbor dummy, AO on **floor**.
2. Portrait-phone 140×70 diamond, **same 24×24 art** (no bitmap zoom).
3. Landscape-phone / tablet 80×40 + Rest/Death **camera pan** (cam used).
4. Desktop Rest/Death: cameraRef written, **paint cam=0** — show that the still does not slide.

Warn: clipping vs name/status/badge, padding vs 80×41+10/14, scale vs squash, neighbor overlap &gt; 40, AO 8px coverage, mobile relative smallness, landscape unzoom, creation-canvas CSS mismatch.

`#631` `catalogVisualPreviewSrc` is an admin `<img>` helper — not this preview.

---

## 7. Architecture / stack

- New modules + tests: `engine/visualAssets.ts`, `engine/visualPreview.ts`. Do not grow the rAF body (WX 19213).
- WX extracts still OPEN: #427 hit-test, #514/#591 wander, #639 isoGrid, #683 ground Doka, #730 AO, **#798 cameraFollow**, **#831 dust-mote seed/recycle**. Union overlapping files; **one** `export function` per name. #831 already conflicts with the older WX prefix — VAL must not grow that file. **#841 does not extract paint** — do not edit `vite.config.js` click-trace alias from VAL.
- #724 owner UX TS: import after that PR; do not concatenate `customVisualPoolCopy`. Combat spec sheet uses a **distinct** name from `visualUploadRequirementsBeforeSelect`.
- #828 persist helpers: import `combatDrawUsesStoredPixelPattern` after that PR; do not clone `pixelPatternPersistVisual.ts`.
- #838 owner UX TS: unique `adminOwnerUx.*` filenames; VAL must not recreate them or restack `AdminDashboard.tsx`.
- #861 `autoSummonKitSpells.ts`: combat-only. VAL must not bind art to kit resolve.
- This docs PR adds **only** the two dated files below so it stays merge-clean vs `origin/main` and vs older VAL docs PRs (#355 … #835).

---

## 8. What not to do

- Do not make upload mandatory.
- Do not `drawImage` inside `drawPixelPattern` (unpaired `restore`; fillRect-only; also injected as `drawPattern`).
- Do not pick pools in React render or rAF.
- Do not infer collision / occupied tiles / movement / range / targeting / hitbox from PNG size.
- Do not stretch enemy art to fake a boss.
- Do not store library bytes in `localStorage` / `nsKey` / `Character.pixelPattern`.
- Do not wait for #355–#835 to merge before implementing `resolveRuntimeVisual` on `main`.
- Do not clone #724 / #631 / #828 / #838 / #841 / #861 helpers.

Production code was not modified in this run.
