# Custom Visual Asset Library & Assignment — 2026-10-25 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-10-25  
**HEAD:** `0f5363f` (`Merge pull request #332`) — unchanged since 2026-09-21  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**On `origin/main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md) (PR #268).  
**Open VAL docs (not on main):** #355, #418, #461, #520, #586, #624, #694, #715, #782, #835, #880, #930, **#990** (2026-09-21 … 2026-10-24).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-10-25.md`](./ACTION_IDS_VAL_2026-10-25.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer on `0f5363f`. Invented sprite boxes (64×64, 128×128) are not used. Pixel boxes did not change. The **isometric tile-paint extract**, **owner names/role/confirm/grant helpers**, and **Toggle/Accordion/Command/Nav/Menubar 44px floors** are restated because siblings [#995](https://github.com/Mr-Melic/stralt/pull/995), [#1001](https://github.com/Mr-Melic/stralt/pull/1001), and [#1010](https://github.com/Mr-Melic/stralt/pull/1010) landed in the queue after the 2026-10-24 VAL run and were not cited there.

---

## 0. Verdict

| Question | 2026-10-25 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (only a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, draw point = rounded iso top + 9, standard 24×24, squash max 1.5 → elite rec 36, portal boss **live** chess 8×8 × 1.4 ≈ 34×34, hit test **80×41**. |
| Did `origin/main` move since 09-21? | **No.** `origin/main` is still `0f5363f`. Newest open sibling at inspection is **#1043**. |
| Only implemented VAL id? | **VAL-2026-09-01-001** (admin URL honesty). All other VAL-* remain NEW. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`.

Do **not** put `drawImage` inside sibling [#995](https://github.com/Mr-Melic/stralt/pull/995) `engine/tilePaint.ts`. That extract owns isometric **floor / wall / portal tile** fill, grain `fillRect`s, and `ISO_WALL_HEIGHT = 28`. It is not a combatant bitmap pipeline. Hazard overlays, `barrierRender` towers, and the in-battle portal cube (`drawPortalPixels`) stay in WorldExploration. Do not fold walls into `barrierRender`. Do not unify with `#639` `isoGrid.ts` (rounded top vs click-cache center), `#901` `portalWhirlpool.ts` (swirl FX), or `#961` `pixelPattern.ts` (combatant 3px cells).

Do **not** put `drawImage` inside sibling [#961](https://github.com/Mr-Melic/stralt/pull/961) `engine/pixelPattern.ts`. That extract owns 3px-cell `fillRect` centering and an unpaired `ctx.restore()`. `pieceArt.drawPatternInline` remains a **separate** fill-only fallback that does **not** restore — do not unify the two.

Do **not** put combatant stills inside sibling [#901](https://github.com/Mr-Melic/stralt/pull/901) `engine/portalWhirlpool.ts`. That extract owns swirl / rest-ring / boss-star / dungeon-spike **stroke/fill** at `PORTAL_WHIRLPOOL_RADIUS = 25`. `#995` portal **tile** paint is a diamond + pulse ellipse (`rx = tw/3`, `ry = th/4`) — a different surface. Future `PORTAL` category stays ineligible in v1 (`VAL-2026-08-31-016`).

Do **not** promote `Character.pixelPattern` (required Motoko `Text`, cap **16_384**) or catalog sprite URLs to a load-time combat dependency. Sibling [#828](https://github.com/Mr-Melic/stralt/pull/828) `SDEG-2026-10-21-003` already locks that persist rule.

Do **not** restack `AdminDashboard.tsx` or recreate [#945](https://github.com/Mr-Melic/stralt/pull/945) `ownerVisualRevert*` or [#1001](https://github.com/Mr-Melic/stralt/pull/1001) `ownerName*` / `ownerRoleGrant*` / `ownerConfirmChrome` / `ownerShopGrant*` helpers. Empty after revert is a valid Default Pixel Visual, never an error.

---

## 1. Delta vs 2026-10-24

The 10-24 fact sheet ([PR #990](https://github.com/Mr-Melic/stralt/pull/990), branch `cursor/custom-visual-assets-system-305d`) inspected the same SHA at ~00:14Z with newest sibling **#979**. Pixel boxes, fallback identity, viewport camera matrix, and “do not treat URL stubs as a library” still hold. New facts this run can cite:

| Topic | 2026-10-24 | 2026-10-25 |
| :--- | :--- | :--- |
| HEAD / WX | `0f5363f`, WX **19213** lines | **identical** on `origin/main` |
| Newest VAL docs PR | **#930** (10-23); that run created **#990** | #990 still OPEN, not on main. This run adds unique `2026-10-25` files only. |
| [#995](https://github.com/Mr-Melic/stralt/pull/995) isometric tile paint | **Not cited** (created 00:15Z, ~1 minute after #990) | Extracts WX `drawIsometricTile` into `engine/tilePaint.ts` (`ISO_WALL_HEIGHT = 28`, wall/floor seeds, palette-or-grey base, face multipliers, floor family lerp, portal pulse alpha, grain counts). WX keeps an empty-deps wrapper that forwards positional args. Explicitly **does not** fold walls into `barrierRender.ts` (6 stacked layers × 28 = **168**). Hazard overlays and `drawPortalPixels` stay in WX. Live main still inlines the same wallHeight **28** at WX **4085**. Zero `drawImage`. Portal **tile** ellipse `tw/3 × th/4` (desktop ≈ **26.7 × 10**) is **not** `#901` whirlpool r=25. |
| [#1001](https://github.com/Mr-Melic/stralt/pull/1001) owner names/role/confirm/grant | **Not cited** (created 00:18Z) | Adds `adminOwnerUx.namesBusy.ts`, `.roleGrant.ts`, `.confirmChrome.ts`, `.grantLink.ts`. Explicitly **not wired** into `AdminDashboard.tsx`. Not a visual library. Do not merge into #724 `visualPool`, #631 `visualPreview`, or #945 `visualRevert`. |
| [#1010](https://github.com/Mr-Melic/stralt/pull/1010) 44px chrome | not cited as Toggle/Accordion | Raises shadcn Toggle default/lg, AccordionTrigger, CommandInput wrapper, NavigationMenu trigger, Menubar bar/triggers to **44px**. Extends #895 Button and #935 Input/Select/Tabs/OTP. Touch-target a11y, **not** a sprite box. Unused in live player HUD. |
| Pack-enemy kit-share continues | #947 / #967 / #972 / #974 / #978 | **#985 / #989 / #1026 / #1033 / #1034 / #1039 / #1042** share pack-enemy heal / healer approach / backline-guard / Paper Windstorm skip. Still **combat**, not visual bind keys. Portal Enemy still has no `isBoss` / `bossId`. |
| Persist remount siblings | through **#979** | **#986 / #987 / #992 / #1002 / #1019 / #1020 / #1021 / #1024 / #1025 / #1028 / #1029 / #1031 / #1032 / #1036 / #1037 / #1041 / #1043** skip remount wipes after keep-without-unpaid-death. None preserve visual-library keys. `versionGate.ts` still only keeps tier / levelup / `*_inventory`. |
| Newest open sibling | #979 | **#1043** (2026-10-25T00:09Z class) remount leftover-XP keep after victory XP throw — not paint. #1042 is Paper Windstorm melee skip. |

Prior VAL IDs are **not** re-issued. Implementers on `main` already have the merged 08-31 contract plus VAL-2026-09-01-001 copy honesty. The thirteen open VAL docs PRs are evidence refreshes, not a merge gate for the first `engine/visualAssets.ts` PR.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint **on main** | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Trailing `ctx.restore()` at **3883** has **no matching save** — do not put `drawImage` inside this function. WX also **injects** it as `drawPattern` into `drawCombatant` (**8072**), so an overload would hit every combatant branch. |
| After [#961](https://github.com/Mr-Melic/stralt/pull/961) | Same math, named module | `PIXEL_PATTERN_CELL_SIZE = 3`; `pixelPatternOrigin` uses `Math.round(x − width/2)`; `drawPixelPattern` still `restore()`s with no `save`. WX wrapper must stay empty-deps. Preview/resolver must **import** origin math, not copy it. |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782). **Does not** `restore`. #961 forbids unifying this with `engine/pixelPattern.ts`. |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | **837–1023**. **No bitmap hook.** Branch 1 requires `entity.isBoss && entity.bossId` (856). |
| `engine/enemyPixelPatterns.ts` | Boss **8×12** tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12` |
| WX player | `drawPixelPattern` + `getPersistedPiecePattern`, **not** `drawCombatant` | **8315–8326** |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3719–3722, **18108–18115** |
| Character creation | 8×8 × `scale = 10` → **80×80** art on **320×280** internal canvas, CSS **240×210** | `CharacterCreation.tsx` 151–153, 452–463 |
| Character selection | default CSS **120**, internal **240**, `pixelSize = floor(internalSize / 10)` = **24** → **192×192** art | `CharacterSelection.tsx` 310–348. Live main still uses local `CHESS_PIECE_PATTERNS`. After #966 the grid comes from `pieceArt.chessPiecePatterns`; cell size stays 24px, **not** combat 3px. |
| After [#995](https://github.com/Mr-Melic/stralt/pull/995) | Iso **tile** paint, not combatants | `engine/tilePaint.ts` `drawIsometricTile` + `ISO_WALL_HEIGHT = 28`. Floor grain / wall cube / portal diamond+ellipse. Import after `targeting` / before `turnQueue` (unique vs #639 / #901 / #961). |

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

Enemy/player URL copy is honest after VAL-2026-09-01-001 (`adminVisualStatus.ts`). **Walk Animation Frames** (`AdminDashboard.tsx` 1590) still have **no** stored-not-rendered disclaimer. Do not implement walk cycles to make the heading true (`VAL-2026-08-31-018`).

#945 `ownerVisualRevert*` is **copy for a Revert control that Enemy/sprite editors still lack**. Ads already have “Clear to default.” Empty after revert is valid Default Pixel Visual. That helper is **not** a combat resolver and is **not** wired into `AdminDashboard.tsx`.

#1001 helpers are **owner console locks** (Names Add busy, Transfer Admin dialog, ConfirmDialog pending/error slots, Shop Grant ≠ GameKey). They are **not** a library, not a spec sheet, and not a revert control.

`adminGuard.validateOptionalUrl` checks length ≤ 2048 (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–95). It does **not** decode images. Empty URL is valid.

`requireHttpsUrl` (97–104) is **landing ads**. `proofDataMimeAllowed` JPEG is **shop proofs**. Neither is a combat MIME gate. Sibling #724 `visualUploadRequirementsBeforeSelect` is https-only **catalog URL copy** (VAL-2026-09-29-001) — not the file-picker spec sheet.

`MAX_JSON_BLOB = 32768` and `pixelPattern` **16_384** cannot hold PNG bytes. Caffeine `ExternalBlob` is bindgen plumbing. No visual-asset blob type exists.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"`, `pieceType` chess, 4-way `playerView` | 8×8 `chessPiecePatterns` + character colors. **Not** `drawCombatant`. Not in `combatantsRef`. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\``, random chess `pieceType`, `family` starts `"default"` | `drawCombatant` default branch. Family 30% is **stats only**. |
| **ELITE / LARGE ENEMY** | **No type.** `generateEnemyScaleFactors` stores visual squash 0.6–1.5. `iron_golem` is family HP paper. `elite_patrol` is a world-feature catalog key only (`worldFeatures.ts` 44, 454). | Same chess path × instance scale |
| **BOSS** | Portal: `id: \`boss_${bossConf.id}_${Date.now()}\``, `scaleX/Y = 1.4`, `family: "boss"` (**6568**). **No** `isBoss` / `bossId` on that Enemy. Rush: `id: \`boss-rush-${roomIndex}-*\``, `isBoss: true` (**5340 / 5365**), lore `pieceType` string, paints `king.front` 24×24. Battle later tags `isBoss` if `id.startsWith("boss_")`. | Live portal: chess 8×8 × 1.4 ≈ **34×34**. 8×12 tables unused unless `isBoss && bossId`. |
| **SUMMON** | `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` **153**). Wrapper id `enemy-summon-${pieceType}` (**271**) is **not** the instance id. | 8×8 `creaturePatterns` + owner tint. Badge `(x+18, y−48)` (8146–8147). |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use family pixel grids |
| **Future** | Portals (whirlpool r=25 **and** tile ellipse tw/3×th/4), walls (`ISO_WALL_HEIGHT = 28` after #995; live WX **4085**), hazards, loot, ads, death juice | Not `drawCombatant` |

`EnemyFamily` (`gameTypes.ts` 12–20) has no `"boss"`. Portal / Rush spawn still assign `family: "boss"` (6568, 5343). Custom **family** assignment is a new presentation bind, not a repair of the unused 30% grids (`VAL-2026-08-31-013`).

`ELITE_ONLY` assets stay ineligible until an explicit instance flag exists (`VAL-2026-08-31-019`). Do not infer elite from `scaleY >= 1.4`, `iron_golem`, or HP.

Admin `PlayerSpriteConfig.characterPieceType` includes `"custom"`. Live `Character.pieceType` is the chess union (`gameTypes.ts` 5–11). Do not treat admin `"custom"` as a combat category.

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

`hitTestSprite` (8885–8918) tests that stored `x,y,w,h` plus padding. Live pads: mouse **10** (10127), touch **14** (10819). Sibling #795 locks those two literals. Custom art must **never** rewrite `drawSize` / occupancy / range / targeting from bitmap width. `Enemy.scaleX` / `scaleY` are **required** on the TS type (`gameTypes.ts` 300–301) but Rush/summon objects often omit them — do not fill missing squash from PNG size at bind.

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` → desktop **12 × 4.2** (8033–8053). It does not track sprite pixels.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors()` | spawn (WX **5768**, default `Math.random`) | stored on `scaleX`/`scaleY`. Tall/wide branches max **1.5** (`spawnPolicy.ts` 239–248; locked in `spawnPolicy.test.ts` 171–201) |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` |
| Battle stats | `getEnemyBaseStats` | `seededRng` (`combatMath.ts` 122) |
| Map tiles / #995 wall+floor grain | generate / paint | `seededRng(seed)` — **tile** variety, not combatant art |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`seededRng` is the correct primitive for weighted pool picks. Hash the **already unique instance id** plus `poolId` / assignment version. Write `visualAssetId` once at spawn / summon / boss portal. If the bound id later fails validation, fall back to builtin — **do not re-roll**.

Summon `turnsRemaining` ticks must not re-pick. `#861` / `#911` / `#947+` / **#985+** filling or sharing kit spells must not re-pick either. `toCombatantEntry` (`combatantStore.ts` **141–168**) **drops** unknown fields — `visualAssetId` must live on `combatantsRef` Enemy (and survive `updateCombatant` spreads), not only on turn-order rows.

Custom art must **not** inherit instance squash 0.6–1.5. That squash is a pixel-art variety trick.

Do **not** reuse `#995` `isoWallSeed` / `isoFloorColorSeed` / `isoFloorTextureSeed` as combatant pool hashes. Those seeds pick **tile grain**, not artwork.

### 2.6 Owner gate

- `App.tsx` **291**: `isAdmin = userRole === "admin"`.
- Admin dashboard hard-denies `!isAdmin` (**5546**).
- Backend `adminSet*` / `adminDelete*` require `#admin`.
- Library UI is **admin-only**. Players never upload or choose combat art.
- #838 / #883 / #945 / **#1001** owner UX helpers are **not** a library. VAL CRUD must not restack `AdminDashboard.tsx` while #334 / #341 / #413 / #470 / #539 / #564 / #838 / #883 / #945 / **#1001** queue.
- After #945, import `ownerVisualRevertLabel` / `shouldOfferOwnerVisualRevert` / `ownerVisualRevertLeavesValidEmpty` for revert-to-default. Do not concatenate a second copy. Empty after revert must stay a valid Default Pixel Visual (`DEFAULT_PIXEL_VISUAL_STATUS`), never an error.
- VAL save/close of an upload editor must **not** close before decode + size validation succeed. After #883, import `shouldCloseOwnerEditorAfterSave`. After #1001, if a confirm dialog is used, import `ownerConfirmChrome` for pending/error slots — do not invent a second chrome helper.

### 2.7 Viewport matrix (do not collapse “phone” to 140×70)

| Viewport | `innerWidth` | `isMobile` (&lt;768) | `isDesktop` (&gt;1024) | Tiles | `gridToScreen` cam | Rest/Death paint |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Portrait phone after Continue | &lt;768 | true | false | **140×70** | uses `cameraRef` | **pans** |
| Landscape phone / small tablet | 768–1024 | false | false | **80×40** | uses `cameraRef` | **pans** |
| Desktop | &gt;1024 | false | true | **80×40** | **forced 0** (3780–3781) | writes `cameraRef`, **paint ignores it** |

`SmallScreenGuard` is Continue, not a block. Bypass is session-stored. Rotating to width ≥768 auto-persists Continue and **drops MOBILE_ZOOM**. `useIsMobile` (`hooks/use-mobile.tsx` 17–26) is **width-only**. `isDesktop` is `innerWidth > 1024` (WX **877**).

`#798` `stepCameraFollow` is the overworld follow math **after** Rest/Death return and desktop lock. Iso preview must not treat that helper as “desktop now follows.” Import it after #798; until then call live WX. Do not copy a private projector (`#639` `isoGrid.ts` is still OPEN — rounded top ≠ unrounded click-cache center). After #995, **tile** paint uses `drawIsometricTile` from `tilePaint.ts`; the **top-vertex projector** is still `gridToScreen` / #639.

`gridToScreen` cache keys `gx,gy` only (3765–3802) and does **not** invalidate on camera. Custom draw must share the live helper so Rest/Death pans and cache stay aligned.

### 2.8 rAF / overlay stack (preview clip)

- Battle-init skips 3 frames (7238–7244).
- `canvas.width=` (7256–7261) and `setTransform`+`scale(dpr)` (7263–7264) **reset 2D state every frame** when size mismatches. `ctx.imageSmoothingEnabled` is **never** set. CSS `canvas { image-rendering: pixelated }` (`index.css` 652–655 and WX inline **17890**) is display-time only.
- Hit-shake: `translate(shake)` on this ctx (7265–7267). Custom `drawImage` must use the **shaken** ctx. Pixel-puff uses a sidecar `getContext` — do not bind stills there.
- AO is 8px floor-diamond gradients (bits 4/8 at 7296–7303), **not** combatant shading. #730 extracts it; do not multiply PNGs by AO.
- Depth key `x+y` before combatant pass.
- Overlay: name `screenPos.y − 34` (8122); level +14; status 16×16 at drawY−30 (8246–8247); summon badge `(x+18, y−48)` (8146–8147); wander r=**15** (8229–8234); moving-enemy `#ff6b6b` blur 8 wraps draw (8057–8076).
- Neighbor iso pitch desktop Δ=(40, 20) ≈ 44.7 px. Warn visual overlap at width **> 40**. `MAX_WIDTH` 80 is the home tile, not “safe vs neighbor.”
- Player colors: cell 2 = primary, extra = accent (8319–8325). PNGs ignore the picker.
- Portal FX clip (live WX **3888–3919**; after #901 the same numbers are named exports): radius **25**, rest glow **33**, boss star outer **37**, dungeon spike outer **35**, `translate(y-10)`. These are **portal swirl paint**, not combatant upload sizes.
- After #995 the **portal tile** under that swirl is a diamond + pulse ellipse `tw/3 × th/4` (desktop ≈ 26.7 × 10) at `(x, y + th/2)`. Import `isoPortalPulseAlpha` for clip overlay only — do not treat the ellipse as a still size.
- Wall cube height **28** (`ISO_WALL_HEIGHT` after #995; live WX 4085). Barrier towers are **6 × 28 = 168**. Preview clip vs adjacent walls uses 28, not 168.
- #841 stubs click-trace **in production Vite only**. It does not change paint. Do not restack WX to “help” it.
- After #961 the player site and `drawPattern` injection still both call the WX wrapper. Putting `drawImage` in `engine/pixelPattern.ts` would hit **both** sites **and** pop the moving-enemy save.
- After #995, putting `drawImage` in `engine/tilePaint.ts` would paint PNGs onto **every floor/wall/portal tile**, not onto combatants.

### 2.9 Persistence — drafts never enter combat

`versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. `App.tsx` 297–318 `localStorage.clear()` on `APP_VERSION` drops everything else. Persist remount siblings (#900 … **#1043**) skip shop/death wipes after a successful keep; they do **not** add visual-library keys to the preserve list.

Uploads stay canister **DRAFT** until **ACTIVE**. Bytes in object storage. New Motoko maps need a chain file **after** `20260901_000000` with `OldActor = {}`. Never amend frozen `NewActor`s. Never put library ids on required Character fields (`pixelPattern` already occupies that slot as unused catalog JSON).

#724 `ownerAssetDependencyRail` is a single `enemyBossUsage` badge — not sufficient for safe delete (VAL-2026-09-29-003). #838 / #883 / #945 / #1001 do not add a visual dependency rail.

#828 `pixelPatternPersistVisual.ts` is a **persist contract helper**, not a resolver. Do not clone it into `engine/visualAssets.ts`.

---

## 3. Visual fallback invariant

Resolution order for every combatant, every frame:

1. **Bound instance assignment** — `entity.visualAssetId` points at a library record that is `ACTIVE`, `VALIDATION_STATUS = ok`, bytes decode, and category/eligibility still match.
2. **Bound pool assignment** — `entity.visualPoolId` was resolved **at spawn** into a stored `visualAssetId`. If that id is now invalid, **do not re-roll in render.** Fall through.
3. **Built-in / generated pixel visual** — current `drawCombatant` / `drawPixelPattern` path (after #961: `engine/pixelPattern.ts` `fillRect` cells).

Hard rules:

- Missing, inactive, corrupt, undecodable, oversized, or ineligible custom assets **immediately** use step 3.
- Empty library ⇒ every entity is step 3. No upload required to ship a new enemy or boss.
- Failures log once, never throw, never block combat.
- Ordinary React rerenders and rAF ticks must not change appearance.
- Player hydrate must not require a library id, a sprite URL, or a parseable `pixelPattern` blob (`SDEG-2026-10-21-003`).
- Portal whirlpool / rest / boss-star / dungeon-spike paint is **not** step 1.
- Iso **tile** paint (`drawIsometricTile` / #995 `tilePaint.ts`) is **not** step 1.
- Extracting `fillRect` paint to `engine/pixelPattern.ts` (#961) does **not** create a custom-visual hook.
- Extracting tile fill to `engine/tilePaint.ts` (#995) does **not** create a custom-visual hook.

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
| Pattern **anchor** | **center** on the draw point | same | `startX = x − patternWidth/2` (WX 3860–3861; after #961 `pixelPatternOrigin`) |
| World cell size | **3×3** logical px | **not** × 1.75 | `PIXEL_PATTERN_CELL_SIZE` after #961; live WX 3855 |
| Default drawn size @ scale 1 | **24 × 24** | 24 × 24 | 8 × 3 |
| Enemy instance scale | 0.6–1.5 (stored) | same | `spawnPolicy.ts` 239–248 |
| Portal boss live | chess 8×8 × 1.4 ≈ **34 × 34** | | no `isBoss`/`bossId` |
| Hit rect | **80 × 41** | 140 × ~71.5 | registered `h` formula |
| Drop-shadow foot | desktop **12 × 4.2** | | `min(tileW*0.35, tileH*0.3)` × 0.35 |
| Wall cube height | **28** | | WX 4085; after #995 `ISO_WALL_HEIGHT` |
| Barrier tower | **168** (6 × 28) | | `barrierRender.ts` |
| Portal tile ellipse | ≈ **26.7 × 10** | | #995 `tw/3`, `th/4` — not whirlpool |

**Anchor for custom bitmaps must match the pixel path:** center the image on `(tileTopX, tileTopY + 9)`. After #961, compute that box with `pixelPatternOrigin` for preview alignment — do not copy the formula.

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
- Lobby CSS **120** / internal **240** / painted **192×192** (`CharacterSelection` 24px cells)
- Portal whirlpool radius **25** / rest glow **33** / boss star **37**
- Portal **tile** ellipse ≈ **26.7 × 10** (`tw/3`, `th/4` after #995)
- shadcn Button / Input / Select / Tabs / OTP / **Toggle / Accordion / Command / Nav / Menubar** floor **44** (#895 / #935 / **#1010**)
- Hit rect **80×41** (click, not art)
- Wall height **28** (`ISO_WALL_HEIGHT`) / barrier tower **168**
- `PIXEL_PATTERN_CELL_SIZE` **3** (paint cell, not recommended sprite width)
- Motoko `pixelPattern` cap **16_384** (JSON text, not PNG bytes)
- Floor grain pixel sizes 1–4 from `#995` `isoFloorGrainPixelSize`

#### PLAYER CHARACTER — `player_standard`

| Spec | Value |
| :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (or **48** @2×) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** |
| `ANCHOR` | center on tile top + 9 |
| `DEFAULT_SCALE` | **1** |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 (warn overlap &gt; 40 wide) |

Player stills key `pieceType` + `playerView`. Second draw site. Portrait/creation/lobby stay generated pixels in v1. Do not persist the PNG into `Character.pixelPattern`. #966 sharing `chessPiecePatterns` does not make the lobby a combat preview.

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
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **80** (home diamond; warn &gt; 40 overlap, AO coverage, and wall cube 28) |
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

#901 names portal radii so preview **clip warnings** can import them after that PR. #995 names `ISO_WALL_HEIGHT` so preview **wall clip** can import it after that PR. Neither is a `PORTAL` / `WALL` render profile and neither is an upload spec.

---

## 5. Metadata, CRUD, pools

Keep the 08-31 field set: `ASSET_ID`, `DISPLAY_NAME`, `ENTITY_CATEGORY`, `ENTITY_FAMILY`, `ENTITY_IDS`, `VARIANT_TAGS`, `ACTIVE`, `WEIGHT`, `RARITY`, `ELITE_ONLY`, `BOSS_ONLY`, `UPLOAD_DATE`, `VERSION`, `SOURCE_METADATA`, `RENDER_PROFILE`, `VALIDATION_STATUS`.

Owner operations: upload, preview, activate, deactivate, rename, replace (new `VERSION`), safe removal, assign to entity / family / pool, weighted random (at **spawn**), revert to default, dependency inspection.

Weighted pools: only `ACTIVE && VALIDATION_STATUS=ok` eligible members. Empty / none qualify → builtin. Selection = `pickWeighted(seededRng(hash(instanceId, poolId, poolVersion)), eligible)`.

Safe delete: block when any assignment, pool membership, or live `combatantsRef` bind exists; offer deactivate (next frame builtin, no re-roll). Deleting a player still must not delete Character (`SDEG-2026-10-21-003`).

**Revert to default:** clear assignment / `visualAssetId`. Builtin immediately. After #945, the confirm copy must treat empty as valid Default Pixel Visual (`ownerVisualRevertLeavesValidEmpty(true)` → `ownerVisualRevertStatusAfterClear()` = `DEFAULT_PIXEL_VISUAL_STATUS`). After #1001, if the revert uses a ConfirmDialog, pending/error slots come from `ownerConfirmChrome` — do not invent a second chrome helper. Do not surface empty-URL as an error. Do not restack ads “Clear to default” into combat CRUD.

Admin spec sheet **before** file selection must use a **distinct** helper name from:

- #724 `visualUploadRequirementsBeforeSelect` (https catalog URL copy)
- #631 `catalogVisualPreviewSrc` (admin `<img>`)
- #838 `adminOwnerUx.*` (audit / dirty / jump / PII / rollback / changelog)
- #883 `adminOwnerUx.spriteSaveClose` / `.saveFeedback` / `.entitySaveConfirm` / `.configWriterBusy`
- #945 `adminOwnerUx.visualRevert` (`ownerVisualRevertLabel`, …)
- **#1001** `adminOwnerUx.namesBusy` / `.roleGrant` / `.confirmChrome` / `.grantLink`

Suggested name remains `combatVisualUploadSpecBeforeSelect`.

---

## 6. Preview

Iso canvas (not 72×72 `object-fit:contain`, not 240×210 creation CSS, not 120 lobby CSS), using live `gridToScreen` / #639 rounded top, after #961 `pixelPatternOrigin` for dummy pixel alignment, and after #995 `drawIsometricTile` for the **floor diamond under the dummy** (do not paint the dummy through `tilePaint.ts`):

1. Desktop 80×40 diamond, 24×24 art, +9 anchor, player dummy, neighbor dummy, AO on **floor**, optional wall cube height 28 as clip overlay.
2. Portrait-phone 140×70 diamond, **same 24×24 art** (no bitmap zoom).
3. Landscape-phone / tablet 80×40 + Rest/Death **camera pan** (cam used).
4. Desktop Rest/Death: cameraRef written, **paint cam=0** — show that the still does not slide.
5. Optional portal-occupancy pane: whirlpool r=25 / rest 33 / boss-star 37 as **clip overlays only** (import `PORTAL_WHIRLPOOL_RADIUS` after #901) plus tile ellipse tw/3×th/4 after #995. Do not preview a custom portal bitmap in v1.

Warn: clipping vs name/status/badge, padding vs 80×41+10/14, scale vs squash, neighbor overlap &gt; 40, AO 8px coverage, wall cube 28, mobile relative smallness, landscape unzoom, creation-canvas CSS mismatch, lobby 192×192 mismatch, portal FX overlap.

`#631` `catalogVisualPreviewSrc` is an admin `<img>` helper — not this preview. `#966` lobby `chessPiecePatterns` import is not this preview. `#995` `drawIsometricTile` is the **floor**, not the still.

---

## 7. Architecture / stack

- New modules + tests: `engine/visualAssets.ts`, `engine/visualPreview.ts`. Do not grow the rAF body (WX **19213** on main).
- After #961: `import { PIXEL_PATTERN_CELL_SIZE, pixelPatternOrigin, drawPixelPattern } from "../engine/pixelPattern"`. Do **not** put `drawImage` in that file. Do **not** unify with `drawPatternInline`. Do **not** paste the fillRect loop back into WX.
- After #995: `import { ISO_WALL_HEIGHT, drawIsometricTile } from "../engine/tilePaint"`. Do **not** put `drawImage` in that file. Do **not** name a VAL module `tilePaint.ts`. Do **not** fold walls into `barrierRender`. Do **not** unify with `isoGrid` / `portalWhirlpool` / `pixelPattern`.
- WX extracts still OPEN: #427 hit-test, #514/#591 wander, #639 isoGrid, #683 ground Doka, #730 AO, **#798 cameraFollow**, **#831 dust-mote seed/recycle**, **#901 portalWhirlpool**, **#961 pixelPattern**, **#995 tilePaint**. Union overlapping files; **one** `export function` per name. **#841 does not extract paint** — do not edit `vite.config.js` click-trace alias from VAL.
- After #901: `import { drawPortalWhirlpool, PORTAL_WHIRLPOOL_RADIUS } from "../engine/portalWhirlpool"`. Do not name a VAL module `portalRender`.
- #724 owner UX TS: import after that PR; do not concatenate `customVisualPoolCopy`. Combat spec sheet uses a **distinct** name from `visualUploadRequirementsBeforeSelect`.
- #828 persist helpers: import `combatDrawUsesStoredPixelPattern` after that PR; do not clone `pixelPatternPersistVisual.ts`.
- #838 / #883 / #945 / **#1001** owner UX TS: unique `adminOwnerUx.*` filenames; VAL must not recreate them or restack `AdminDashboard.tsx`. After #945, import `ownerVisualRevert*` for revert-to-default copy. After #1001, import `ownerConfirmChrome` if a confirm is used — do not concatenate `ownerConfirmChrome`.
- #861 `autoSummonKitSpells.ts` / #911 `packEnemyKitAssign.ts` / **#947+ / #985+ pack-enemy share**: combat-only. VAL must not bind art to kit resolve.
- #895 / #935 / **#1010** 44px floors: use them for admin picker **buttons/inputs**, not as `RECOMMENDED_WIDTH`.
- #966 `CharacterSelection` pieceArt import: do not restack that file to “preview custom stills in the lobby.” v1 lobby stays generated pixels.
- This docs PR adds **only** the two dated files below so it stays merge-clean vs `origin/main` and vs older VAL docs PRs (#355 … #990).

---

## 8. What not to do

- Do not make upload mandatory.
- Do not `drawImage` inside `drawPixelPattern` / `engine/pixelPattern.ts` (unpaired `restore`; fillRect-only; also injected as `drawPattern`).
- Do not unify `engine/pixelPattern.ts` with `pieceArt.drawPatternInline` (#961).
- Do not `drawImage` inside `#901` `drawPortalWhirlpool` (portal FX, not combatants).
- Do not `drawImage` inside `#995` `drawIsometricTile` / `engine/tilePaint.ts` (floor/wall/portal **tiles**, not combatants).
- Do not unify `tilePaint.ts` with `isoGrid.ts` / `portalWhirlpool.ts` / `pixelPattern.ts` / `barrierRender.ts`.
- Do not pick pools in React render or rAF.
- Do not infer collision / occupied tiles / movement / range / targeting / hitbox from PNG size.
- Do not stretch enemy art to fake a boss.
- Do not store library bytes in `localStorage` / `nsKey` / `Character.pixelPattern`.
- Do not wait for #355–#990 to merge before implementing `resolveRuntimeVisual` on `main`.
- Do not clone #724 / #631 / #828 / #838 / #841 / #861 / #883 / #901 / #911 / #945 / #961 / #966 / **#995** / **#1001** helpers.
- Do not treat empty-after-revert as an error (#945).
- Do not hash `#995` tile seeds into combatant pool picks.

Production code was not modified in this run.
