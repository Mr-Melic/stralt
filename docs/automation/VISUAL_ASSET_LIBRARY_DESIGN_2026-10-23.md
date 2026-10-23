# Custom Visual Asset Library & Assignment — 2026-10-23 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-10-23  
**HEAD:** `0f5363f` (`Merge pull request #332`) — unchanged since 2026-09-21  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**On `origin/main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md) (PR #268).  
**Open VAL docs (not on main):** #355, #418, #461, #520, #586, #624, #694, #715, #782, #835, **#880** (2026-09-21 … 2026-10-22).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-10-23.md`](./ACTION_IDS_VAL_2026-10-23.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer on `0f5363f`. Invented sprite boxes (64×64, 128×128) are not used. Pixel boxes did not change. The **portal-paint extract** and **owner save-close helpers** are restated because siblings [#901](https://github.com/Mr-Melic/stralt/pull/901) and [#883](https://github.com/Mr-Melic/stralt/pull/883) landed in the queue minutes after the 2026-10-22 VAL run and were not cited there.

---

## 0. Verdict

| Question | 2026-10-23 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (only a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, draw point = rounded iso top + 9, standard 24×24, squash max 1.5 → elite rec 36, portal boss **live** chess 8×8 × 1.4 ≈ 34×34, hit test **80×41**. |
| Did `origin/main` move since 09-21? | **No.** `origin/main` is still `0f5363f`. Newest open sibling at inspection is **#927**. |
| Only implemented VAL id? | **VAL-2026-09-01-001** (admin URL honesty). All other VAL-* remain NEW. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`. `useGetEnemyConfigs` (`hooks/useSpellQueries.ts`) is admin React Query, not combat.

Do **not** put combatant stills inside sibling [#901](https://github.com/Mr-Melic/stralt/pull/901) `engine/portalWhirlpool.ts`. That extract owns swirl / rest-ring / boss-star / dungeon-spike **stroke/fill** at `PORTAL_WHIRLPOOL_RADIUS = 25`. It is not a bitmap pipeline. Future `PORTAL` category stays ineligible in v1 (`VAL-2026-08-31-016`).

Do **not** promote `Character.pixelPattern` (required Motoko `Text`, cap **16_384**) or catalog sprite URLs to a load-time combat dependency. Sibling [#828](https://github.com/Mr-Melic/stralt/pull/828) `SDEG-2026-10-21-003` already locks that persist rule.

---

## 1. Delta vs 2026-10-22

The 10-22 fact sheet ([PR #880](https://github.com/Mr-Melic/stralt/pull/880), branch `cursor/custom-visual-assets-system-e6b1`) inspected the same SHA at ~00:13Z with newest sibling **#869**. Pixel boxes, fallback identity, viewport camera matrix, and “do not treat URL stubs as a library” still hold. New facts this run can cite:

| Topic | 2026-10-22 | 2026-10-23 |
| :--- | :--- | :--- |
| HEAD / WX | `0f5363f`, WX **19213** lines | **identical** on `origin/main` |
| Newest VAL docs PR | **#835** (10-21); this run created **#880** | #880 still OPEN, not on main. This run adds unique `2026-10-23` files only. |
| [#901](https://github.com/Mr-Melic/stralt/pull/901) portal whirlpool | **Not cited** (created 00:19Z, six minutes after #880) | Extracts swirl / rest-ring / boss-star / dungeon-spike from WX into `engine/portalWhirlpool.ts` (`PORTAL_WHIRLPOOL_RADIUS = 25`, rest glow `radius+8` = 33, boss star `radius+12` = 37, dungeon spike `radius+10` = 35, `translate(x, y-10)`). Live main still inlines the same paint at WX **3888–3919**. Extract is `stroke`/`fill`/`fillText("★")` — **zero** `drawImage`. |
| [#883](https://github.com/Mr-Melic/stralt/pull/883) owner UX | **Not cited** (created 00:13Z, 25 seconds after #880) | Adds `adminOwnerUx.spriteSaveClose` / `.saveFeedback` / `.entitySaveConfirm` / `.configWriterBusy`. Explicitly does **not** restack `AdminDashboard.tsx` and does **not** recreate #631 / #664 / #724 / #775 / #838. `shouldCloseOwnerEditorAfterSave` documents that SpriteList currently closes before walk-URL validation / `#ok`. |
| [#911](https://github.com/Mr-Melic/stralt/pull/911) pack kits | not cited | `packEnemyKitAssign.ts` fills empty pack `spells` from catalog starter ids. **Combat**, not a visual catalog. Bind stills on instance id, not kit spell ids. |
| [#888](https://github.com/Mr-Melic/stralt/pull/888) / [#910](https://github.com/Mr-Melic/stralt/pull/910) boss kit-share | queue continuing | Share execute with advertised range / summon ground range. They do **not** set `isBoss` / `bossId` on the portal Enemy. Live portal paint remains chess 8×8 × 1.4. |
| [#895](https://github.com/Mr-Melic/stralt/pull/895) Button 44px | not cited | shadcn default/icon floor **44px** (`button.tsx`). Touch-target a11y, **not** a sprite box. Do not list 44 as `RECOMMENDED_WIDTH`. |
| Persist remount siblings | #869 newest | **#900 / #909 / #912 / #918 / #919 / #926 / #927** skip remount wipes after keep-without-unpaid-death. None preserve visual-library keys. `versionGate.ts` still only keeps tier / levelup / `*_inventory`. |
| Newest open sibling | #869 | **#927** (2026-10-22T21:23Z) persist remount — not paint. |

Prior VAL IDs are **not** re-issued. Implementers on `main` already have the merged 08-31 contract plus VAL-2026-09-01-001 copy honesty. The eleven open VAL docs PRs are evidence refreshes, not a merge gate for the first `engine/visualAssets.ts` PR.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Trailing `ctx.restore()` at **3883** has **no matching save** — do not put `drawImage` inside this function. WX also **injects** it as `drawPattern` into `drawCombatant` (**8072**), so an overload would hit every combatant branch. |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782). **Does not** `restore`. |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | **837–1023**. **No bitmap hook.** Branch 1 requires `entity.isBoss && entity.bossId` (856). |
| `engine/enemyPixelPatterns.ts` | Boss **8×12** tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12` |
| WX player | `drawPixelPattern` + `getPersistedPiecePattern`, **not** `drawCombatant` | **8315–8326** |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3719–3722, **18109–18114** |
| Character creation | 8×8 × `scale = 10` → **80×80** art on **320×280** internal canvas, CSS **240×210** | `CharacterCreation.tsx` 151–153, 452–463 |
| Character selection | `pixelSize = floor(internalSize / 10)` on a **120** CSS box | `CharacterSelection.tsx` 333–348 |

`Character.pixelPattern` is a **required** Text field. Official create serializes the catalog chess grid (`CharacterCreation.tsx` **273**). `getPersistedPiecePattern` (`pieceArt.ts` 653–658) looks up by `pieceType` string and falls back to `king.front`. WorldExploration **never reads** the stored blob (portrait 3719, player 8289). Unknown `pieceType` paints `king.front`.

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects pattern resolvers + `drawPattern` + `characterYOffset`. Putting a PNG through `drawPattern` would interpret bytes as a cell grid. Custom path = **optional top branch** (or a new option), plus a **second** one-line wire at the player site.

### 2.2 Unused URL stubs — still not a library

| Stub | Stored | Consumed by combat? |
| :--- | :--- | :--- |
| `EnemyConfig.spriteUrl : ?Text` | Canister + admin text | **No.** WX has zero `getEnemyConfigs` / `spriteUrl`. |
| `PlayerSpriteConfig` facing + walk-frame URL arrays | Canister + Sprite panel | **No.** WX has zero `getPlayerSpriteConfigs`. Admin preview is 72×72 `<img object-fit:contain>`. |
| `Character.pixelPattern` | Required Text, cap 16_384 | **No.** Combat uses `pieceType` → catalog grid. |
| Login ad boxes | `adminSetAdBox` | Landing `<img>` — **not combat**. |

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`). **Walk Animation Frames** (`AdminDashboard.tsx` 1588–1620) still have **no** stored-not-rendered disclaimer. Do not implement walk cycles to make the heading true (`VAL-2026-08-31-018`). #883 `shouldCloseOwnerEditorAfterSave` is about **not closing** the sprite editor before walk-URL validation — it is not a combat cycle.

`adminGuard.validateOptionalUrl` checks length ≤ 2048 (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–95). It does **not** decode images. Empty URL is valid.

`requireHttpsUrl` (97–104) is **landing ads**. `proofDataMimeAllowed` JPEG is **shop proofs**. Neither is a combat MIME gate. Sibling #724 `visualUploadRequirementsBeforeSelect` is https-only **catalog URL copy** (VAL-2026-09-29-001) — not the file-picker spec sheet.

`MAX_JSON_BLOB = 32768` and `pixelPattern` **16_384** cannot hold PNG bytes. Caffeine `ExternalBlob` is bindgen plumbing. No visual-asset blob type exists.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"`, `pieceType` chess, 4-way `playerView` | 8×8 `chessPiecePatterns` + character colors. **Not** `drawCombatant`. Not in `combatantsRef`. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\``, random chess `pieceType`, `family` starts `"default"` | `drawCombatant` default branch. Family 30% is **stats only**. |
| **ELITE / LARGE ENEMY** | **No type.** `generateEnemyScaleFactors` stores visual squash 0.6–1.5. `iron_golem` is family HP paper. `elite_patrol` is a world-feature catalog key only (`worldFeatures.ts` 44, 454). | Same chess path × instance scale |
| **BOSS** | Portal: `id: \`boss_${bossConf.id}_${Date.now()}\``, `scaleX/Y = 1.4`, `family: "boss"` (**6568**). **No** `isBoss` / `bossId` on that Enemy. Rush: `id: \`boss-rush-${roomIndex}-*\``, `isBoss: true` (**5340 / 5365**), lore `pieceType` string, paints `king.front` 24×24. Battle later tags `isBoss` if `id.startsWith("boss_")` (**11959 / 11994**). | Live portal: chess 8×8 × 1.4 ≈ **34×34**. 8×12 tables unused unless `isBoss && bossId`. |
| **SUMMON** | `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` **153**). Wrapper id `enemy-summon-${pieceType}` (**271**) is **not** the instance id. | 8×8 `creaturePatterns` + owner tint. Badge `(x+18, y−48)` (8146–8147). |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use family pixel grids |
| **Future** | Portals (whirlpool r=25), walls (`wallHeight = 28` at 4085), hazards, loot, ads, death juice | Not `drawCombatant` |

`EnemyFamily` (`gameTypes.ts` 12–20) has no `"boss"`. Portal / Rush spawn still assign `family: "boss"` (6568, 5343). Custom **family** assignment is a new presentation bind, not a repair of the unused 30% grids (`VAL-2026-08-31-013`).

`ELITE_ONLY` assets stay ineligible until an explicit instance flag exists (`VAL-2026-08-31-019`). Do not infer elite from `scaleY >= 1.4`, `iron_golem`, or HP.

Admin `PlayerSpriteConfig.characterPieceType` includes `"custom"`. Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11, 31). Do not treat admin `"custom"` as a combat category.

Family grids exist (`enemyPixelPatterns.ts` 434–498) but are unused for the 30% family roll (`applyFamilyVariantsToRoster` at WX **5864**):

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

`hitTestSprite` (8885–8918) tests that stored `x,y,w,h` plus padding. Live pads: mouse **10** (10127), touch **14** (10819). Sibling #795 locks those two literals. Custom art must **never** rewrite `drawSize` / occupancy / range / targeting from bitmap width. `Enemy.scaleX` / `scaleY` are **required** on the TS type (`gameTypes.ts` 300–301) but Rush/summon objects often omit them — do not fill missing squash from PNG size at bind.

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` → desktop **12 × 4.2** (8033–8053). It does not track sprite pixels.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors()` | spawn (WX **5768**, default `Math.random`) | stored on `scaleX`/`scaleY`. Tall/wide branches max **1.5** (`spawnPolicy.ts` 239–248; locked in `spawnPolicy.test.ts` 171–201) |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` (5864) |
| Battle stats | `getEnemyBaseStats` | `seededRng` (`combatMath.ts` 122) |
| Map tiles | generate | `seededRng(seed)` |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`seededRng` is the correct primitive for weighted pool picks. Hash the **already unique instance id** plus `poolId` / assignment version. Write `visualAssetId` once at spawn / summon / boss portal. If the bound id later fails validation, fall back to builtin — **do not re-roll**.

Summon `turnsRemaining` ticks must not re-pick. `#861` / `#911` filling empty `spells` from catalog must not re-pick either. `toCombatantEntry` (**141–168**) **drops** unknown fields — `visualAssetId` must live on `combatantsRef` Enemy (and survive `updateCombatant` spreads), not only on turn-order rows.

Custom art must **not** inherit instance squash 0.6–1.5. That squash is a pixel-art variety trick.

### 2.6 Owner gate

- `App.tsx` **291**: `isAdmin = userRole === "admin"`.
- Admin dashboard hard-denies `!isAdmin` (**5546**).
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- Library UI is **admin-only**. Players never upload or choose combat art.
- #838 / **#883** owner UX helpers are **not** a library. VAL CRUD must not restack `AdminDashboard.tsx` while #334 / #341 / #413 / #470 / #539 / #564 / #838 / **#883** queue.
- VAL save/close of an upload editor must **not** close before decode + size validation succeed. After #883, import `shouldCloseOwnerEditorAfterSave` — do not concatenate a second copy.

### 2.7 Viewport matrix (do not collapse “phone” to 140×70)

| Viewport | `innerWidth` | `isMobile` (&lt;768) | `isDesktop` (&gt;1024) | Tiles | `gridToScreen` cam | Rest/Death paint |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Portrait phone after Continue | &lt;768 | true | false | **140×70** | uses `cameraRef` | **pans** (Rest snap 5877–5893) |
| Landscape phone / small tablet | 768–1024 | false | false | **80×40** | uses `cameraRef` | **pans** |
| Desktop | &gt;1024 | false | true | **80×40** | **forced 0** (3780–3781, 8844–8845, 8942–8943) | writes `cameraRef`, **paint ignores it** |

`SmallScreenGuard` is Continue, not a block (`App.tsx` 337–415). Bypass is session-stored. Rotating to width ≥768 auto-persists Continue (351–355) and **drops MOBILE_ZOOM**. `useIsMobile` (`hooks/use-mobile.tsx` 17–26) is **width-only**. `isDesktop` is `innerWidth > 1024` (WX **877**).

`#798` `stepCameraFollow` is the overworld follow math **after** Rest/Death return and desktop lock. Iso preview must not treat that helper as “desktop now follows.” Import it after #798; until then call live WX. Do not copy a private projector (`#639` `isoGrid.ts` is still OPEN — rounded top ≠ unrounded click-cache center).

`gridToScreen` cache keys `gx,gy` only (3765–3802) and does **not** invalidate on camera. Custom draw must share the live helper so Rest/Death pans and cache stay aligned.

### 2.8 rAF / overlay stack (preview clip)

- Battle-init skips 3 frames (7238–7244).
- `canvas.width=` (7256–7261) and `setTransform`+`scale(dpr)` (7263–7264) **reset 2D state every frame** when size mismatches. `ctx.imageSmoothingEnabled` is **never** set. CSS `canvas { image-rendering: pixelated }` (`index.css` 652–655 and WX inline **17890**) is display-time only.
- Hit-shake: `translate(shake)` on this ctx (7265–7267). Custom `drawImage` must use the **shaken** ctx. Pixel-puff uses a sidecar `getContext` — do not bind stills there.
- AO is 8px floor-diamond gradients (bits 4/8 at 7296–7303), **not** combatant shading. #730 extracts it; do not multiply PNGs by AO.
- Depth key `x+y` before combatant pass.
- Overlay: name `screenPos.y − 34` (8122); level +14; status 16×16 at drawY−30 (8246–8247); summon badge `(x+18, y−48)` (8146–8147); wander r=**15** (8229–8234); moving-enemy `#ff6b6b` blur 8 wraps draw (8057–8076); ground Doka coin is a separate extract (#683).
- Neighbor iso pitch desktop Δ=(40, 20) ≈ 44.7 px. Warn visual overlap at width **> 40**. `MAX_WIDTH` 80 is the home tile, not “safe vs neighbor.”
- Player colors: cell 2 = primary, extra = accent (8319–8325). PNGs ignore the picker.
- Portal FX clip (live WX **3888–3919**; after #901 the same numbers are named exports): radius **25**, rest glow **33**, boss star outer **37**, dungeon spike outer **35**, `translate(y-10)`. These are **portal paint**, not combatant upload sizes.
- #841 stubs click-trace **in production Vite only**. It does not change paint. Do not restack WX to “help” it.

### 2.9 Persistence — drafts never enter combat

`versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. `App.tsx` 297–318 `localStorage.clear()` on `APP_VERSION` drops everything else. Persist remount siblings (#900 … #927) skip shop/death wipes after a successful keep; they do **not** add visual-library keys to the preserve list.

Uploads stay canister **DRAFT** until **ACTIVE**. Bytes in object storage. New Motoko maps need a chain file **after** `20260901_000000` with `OldActor = {}`. Never amend frozen `NewActor`s. Never put library ids on required Character fields (`pixelPattern` already occupies that slot as unused catalog JSON).

#724 `ownerAssetDependencyRail` is a single `enemyBossUsage` badge — not sufficient for safe delete (VAL-2026-09-29-003). #838 / #883 do not add a visual dependency rail.

#828 `pixelPatternPersistVisual.ts` is a **persist contract helper**, not a resolver. Do not clone it into `engine/visualAssets.ts`.

---

## 3. Visual fallback invariant

Resolution order for every combatant, every frame:

1. **Bound instance assignment** — `entity.visualAssetId` points at a library record that is `ACTIVE`, `VALIDATION_STATUS = ok`, bytes decode, and category/eligibility still match.
2. **Bound pool assignment** — `entity.visualPoolId` was resolved **at spawn** into a stored `visualAssetId`. If that id is now invalid, **do not re-roll in render.** Fall through.
3. **Built-in / generated pixel visual** — current `drawCombatant` / `drawPixelPattern` path.

Hard rules:

- Missing, inactive, corrupt, undecodable, oversized, or ineligible custom assets **immediately** use step 3.
- Empty library ⇒ every entity is step 3. No upload required to ship a new enemy or boss.
- Failures log once, never throw, never block combat.
- Ordinary React rerenders and rAF ticks must not change appearance.
- Player hydrate must not require a library id, a sprite URL, or a parseable `pixelPattern` blob (`SDEG-2026-10-21-003`).
- Portal whirlpool / rest / boss-star / dungeon-spike paint is **not** step 1. Extracting it (#901) does not create a custom-portal library.

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

### 4.2 Shared upload contract

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF not used in combat. Shop-proof JPEG is a different surface. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | Walk-frame arrays are never drawn. |
| `MAX_FILE_SIZE` | **256 KiB per still** (starting reject) until IC ingress / object-store limits are measured | `MAX_URL` 2048 and `pixelPattern` 16_384 are text. Shop proof 524_288 is a different surface. Do not store raw base64 in Motoko `Text`. Do not use `data:` URLs. Do not require `https:` on object-store ids. |

Never silently distort: reject out-of-range width/height, aspect, pixel count, MIME, decode failure, missing alpha, ineligible category. Do not `drawImage` with a stretch to “fit the tile.”

Display this spec sheet **before** the file picker. Forbidden look-alike sizes that are **not** upload targets:

- Portrait HUD **60×60**
- Admin catalog `<img>` **72×72**
- Creation internal **320×280** / CSS **240×210**
- Portal whirlpool radius **25** / rest glow **33** / boss star **37**
- shadcn Button floor **44** (#895)
- Hit rect **80×41** (click, not art)
- Wall height **28**

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
| Keying | **Not** `isBoss` / `family === "boss"` / Rush lore `pieceType` / kit-share landing / pack starter ids. Use assignment records + instance id prefixes (`boss_*`, `boss-rush-*`) after an explicit profile. |

Do not simply stretch `enemy_standard` art.

#### SUMMON — `summon_standard`

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| Extra | Owner tint stroke; badge at (x+18, y−48). Bind on `summon-${random}`, not `enemy-summon-${pieceType}`, not catalog `summonKit` / pack starter ids. Empty `spells` after spawn is not a missing visual. |

#### Future categories

Portals, walls, hazards, loot, ads, death juice (`engine/effects.ts` fillRect fragments) are **ineligible** in v1 (`VAL-2026-08-31-016`). Landing ads stay a separate URL+`<img>` path.

#901 names portal radii (`PORTAL_WHIRLPOOL_RADIUS = 25`) so preview **clip warnings** can import them after that PR. That is not a `PORTAL` render profile and not an upload spec.

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
- **#883** `adminOwnerUx.spriteSaveClose` / `.saveFeedback` / `.entitySaveConfirm` / `.configWriterBusy`

Suggested name remains `combatVisualUploadSpecBeforeSelect`.

---

## 6. Preview

Iso canvas (not 72×72 `object-fit:contain`, not 240×210 creation CSS), using live `gridToScreen` / #639 rounded top:

1. Desktop 80×40 diamond, 24×24 art, +9 anchor, player dummy, neighbor dummy, AO on **floor**.
2. Portrait-phone 140×70 diamond, **same 24×24 art** (no bitmap zoom).
3. Landscape-phone / tablet 80×40 + Rest/Death **camera pan** (cam used).
4. Desktop Rest/Death: cameraRef written, **paint cam=0** — show that the still does not slide.
5. Optional portal-occupancy pane: whirlpool r=25 / rest 33 / boss-star 37 as **clip overlays only** (import `PORTAL_WHIRLPOOL_RADIUS` after #901). Do not preview a custom portal bitmap in v1.

Warn: clipping vs name/status/badge, padding vs 80×41+10/14, scale vs squash, neighbor overlap &gt; 40, AO 8px coverage, mobile relative smallness, landscape unzoom, creation-canvas CSS mismatch, portal FX overlap.

`#631` `catalogVisualPreviewSrc` is an admin `<img>` helper — not this preview.

---

## 7. Architecture / stack

- New modules + tests: `engine/visualAssets.ts`, `engine/visualPreview.ts`. Do not grow the rAF body (WX **19213** on main; #901 deletes ~171 whirlpool lines from WX and must be imported, not re-inlined).
- WX extracts still OPEN: #427 hit-test, #514/#591 wander, #639 isoGrid, #683 ground Doka, #730 AO, **#798 cameraFollow**, **#831 dust-mote seed/recycle**, **#901 portalWhirlpool**. Union overlapping files; **one** `export function` per name. **#841 does not extract paint** — do not edit `vite.config.js` click-trace alias from VAL.
- After #901: `import { drawPortalWhirlpool, PORTAL_WHIRLPOOL_RADIUS } from "../engine/portalWhirlpool"`. Do not name a VAL module `portalRender` (the extract already reserved the whirlpool filename). Do not put `drawImage` in that file.
- #724 owner UX TS: import after that PR; do not concatenate `customVisualPoolCopy`. Combat spec sheet uses a **distinct** name from `visualUploadRequirementsBeforeSelect`.
- #828 persist helpers: import `combatDrawUsesStoredPixelPattern` after that PR; do not clone `pixelPatternPersistVisual.ts`.
- #838 / **#883** owner UX TS: unique `adminOwnerUx.*` filenames; VAL must not recreate them or restack `AdminDashboard.tsx`. After #883, import `shouldCloseOwnerEditorAfterSave` for upload-editor close gating.
- #861 `autoSummonKitSpells.ts` / **#911** `packEnemyKitAssign.ts`: combat-only. VAL must not bind art to kit resolve.
- #895 `button.tsx` 44px floor: use it for admin picker **buttons**, not as `RECOMMENDED_WIDTH`.
- This docs PR adds **only** the two dated files below so it stays merge-clean vs `origin/main` and vs older VAL docs PRs (#355 … #880).

---

## 8. What not to do

- Do not make upload mandatory.
- Do not `drawImage` inside `drawPixelPattern` (unpaired `restore`; fillRect-only; also injected as `drawPattern`).
- Do not `drawImage` inside `#901` `drawPortalWhirlpool` (portal FX, not combatants).
- Do not pick pools in React render or rAF.
- Do not infer collision / occupied tiles / movement / range / targeting / hitbox from PNG size.
- Do not stretch enemy art to fake a boss.
- Do not store library bytes in `localStorage` / `nsKey` / `Character.pixelPattern`.
- Do not wait for #355–#880 to merge before implementing `resolveRuntimeVisual` on `main`.
- Do not clone #724 / #631 / #828 / #838 / #841 / #861 / **#883** / **#901** / **#911** helpers.

Production code was not modified in this run.
