# Custom Visual Asset Library & Assignment — 2026-10-27 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-10-27  
**HEAD:** `0f5363f` (`Merge pull request #332`) — unchanged since 2026-09-21  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**On `origin/main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md) (PR #268).  
**Open VAL docs (not on main):** #355, #418, #461, #520, #586, #624, #694, #715, #782, #835, #880, #930, #990, #1051, **#1110** (2026-09-21 … 2026-10-26).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-10-27.md`](./ACTION_IDS_VAL_2026-10-27.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer on `0f5363f`. Invented sprite boxes (64×64, 128×128) are not used. Pixel boxes did not change. The **in-battle portal cube extract**, **owner confirm-snapshot / mailto-secret / confirm-a11y / hit-target helpers**, **Collapsible/ScrollBar/SidebarRail 44px floors**, and **Spellbook Save/Cancel/upgrade 44px floors** are restated because siblings [#1109](https://github.com/Mr-Melic/stralt/pull/1109), [#1115](https://github.com/Mr-Melic/stralt/pull/1115), [#1125](https://github.com/Mr-Melic/stralt/pull/1125), and [#1162](https://github.com/Mr-Melic/stralt/pull/1162) landed in the queue after the 2026-10-26 VAL run (or raced it by two minutes) and were not cited there.

---

## 0. Verdict

| Question | 2026-10-27 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (only a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, draw point = rounded iso top + 9, standard 24×24, squash max 1.5 → elite rec 36, portal boss **live** chess 8×8 × 1.4 ≈ 34×34, hit test **80×41**. |
| Did `origin/main` move since 09-21? | **No.** `origin/main` is still `0f5363f`. Newest open sibling at inspection is **#1162** (Spellbook 44px a11y; paint-relevant newest is **#1109**). |
| Only implemented VAL id? | **VAL-2026-09-01-001** (admin URL honesty). All other VAL-* remain NEW. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`.

Do **not** put `drawImage` inside sibling [#1109](https://github.com/Mr-Melic/stralt/pull/1109) `engine/battlePortalCube.ts`. That extract owns the **in-battle** teal / dungeon-crimson iso cube (`BATTLE_PORTAL_CUBE_HEIGHT = 28`, grain 10 on the top face / 9 per side, seed `x*127 + y*311`, Park–Miller LCG `16807` / `2147483647`). Grain is unrounded `fillRect` of size `1 + rng` (~1–2 px). It is not a combatant bitmap pipeline and not the overworld whirlpool. Gameplay (portal occupancy, dungeon-chain labels, inBattle vs swirl branch) stays in WorldExploration. Do not fold the cube into `barrierRender.ts` / `portalWhirlpool.ts` / `tilePaint.ts` / `mapHazardPaint.ts` / `pixelPattern.ts`. Only `color === "dungeon"` uses crimson faces; boss / bossRush / rest / white / progression stay **teal** — do not “fix” that with a custom portal still.

Do **not** put `drawImage` inside sibling [#1076](https://github.com/Mr-Melic/stralt/pull/1076) `engine/mapHazardPaint.ts`. That extract owns lava / ice / spikes **floor-tile overlay** fill (`fillRect` grain 2–3 px, lava glow 4×4, ice 3×3, spike tips 2×2 / bodies 4×3). It is not a combatant bitmap pipeline. Gameplay (lava/spikes damage, walk tax, challenge recording) stays in WorldExploration. Do not fold hazards into `tilePaint.ts` / `barrierRender.ts` / `portalWhirlpool.ts` / `pixelPattern.ts` / `battlePortalCube.ts`.

Do **not** put `drawImage` inside sibling [#995](https://github.com/Mr-Melic/stralt/pull/995) `engine/tilePaint.ts`. That extract owns isometric **floor / wall / portal tile** fill, grain `fillRect`s, and `ISO_WALL_HEIGHT = 28`. Hazard overlays, `barrierRender` towers, and the in-battle portal cube stay separate. Do not unify with `#639` `isoGrid.ts` (rounded top vs click-cache center), `#901` `portalWhirlpool.ts` (swirl FX), `#961` `pixelPattern.ts` (combatant 3px cells), or `#1109` `battlePortalCube.ts`.

Do **not** put `drawImage` inside sibling [#961](https://github.com/Mr-Melic/stralt/pull/961) `engine/pixelPattern.ts`. That extract owns 3px-cell `fillRect` centering and an unpaired `ctx.restore()`. `pieceArt.drawPatternInline` remains a **separate** fill-only fallback that does **not** restore — do not unify the two.

Do **not** put combatant stills inside sibling [#901](https://github.com/Mr-Melic/stralt/pull/901) `engine/portalWhirlpool.ts`. That extract owns swirl / rest-ring / boss-star / dungeon-spike **stroke/fill** at `PORTAL_WHIRLPOOL_RADIUS = 25`. `#995` portal **tile** paint is a diamond + pulse ellipse (`rx = tw/3`, `ry = th/4`) — a different surface. `#1109` is a third portal surface (in-battle cube). Future `PORTAL` category stays ineligible in v1 (`VAL-2026-08-31-016`).

After sibling [#1059](https://github.com/Mr-Melic/stralt/pull/1059), summon owner-tint is a **2px side-color stroke with no `shadowBlur`**. Import `strokeOwnerTint` from `data/ownerTintStroke.ts`. Do not recreate the old glow, and do not concatenate a second `export function strokeOwnerTint`. Custom summon stills must stroke the **bitmap footprint**, not a hardcoded 24×24 box, using that helper.

Do **not** restack `AdminDashboard.tsx` or recreate [#945](https://github.com/Mr-Melic/stralt/pull/945) `ownerVisualRevert*`, [#1001](https://github.com/Mr-Melic/stralt/pull/1001) names/role/confirm/grant helpers, [#1066](https://github.com/Mr-Melic/stralt/pull/1066) `ownerPrincipalGate` / `ownerConfirmEnter` / `ownerRevealMask` / `ownerBanReason`, or [#1115](https://github.com/Mr-Melic/stralt/pull/1115) `ownerConfirmSnapshot` / `ownerMailtoSecret` / `ownerConfirmA11y` / `ownerHitTarget` (`OWNER_MIN_HIT_PX = 44`). Empty after revert is a valid Default Pixel Visual, never an error.

Do **not** promote `Character.pixelPattern` (required Motoko `Text`, cap **16_384**) or catalog sprite URLs to a load-time combat dependency. Sibling [#828](https://github.com/Mr-Melic/stralt/pull/828) `SDEG-2026-10-21-003` already locks that persist rule.

---

## 1. Delta vs 2026-10-26

The 10-26 fact sheet ([PR #1110](https://github.com/Mr-Melic/stralt/pull/1110), branch `cursor/custom-visual-assets-system-c58e`) inspected the same SHA at ~00:12Z with newest sibling **#1108**. Pixel boxes, fallback identity, viewport camera matrix, and “do not treat URL stubs as a library” still hold. New facts this run can cite:

| Topic | 2026-10-26 | 2026-10-27 |
| :--- | :--- | :--- |
| HEAD / WX | `0f5363f`, WX **19213** lines | **identical** on `origin/main` |
| Newest VAL docs PR | **#1051** (10-25); that run created **#1110** | #1110 still OPEN, not on main. This run adds unique `2026-10-27` files only. |
| [#1109](https://github.com/Mr-Melic/stralt/pull/1109) in-battle portal cube | **Not cited** (created 00:10:06Z, **two minutes before** VAL docs #1110 at 00:12:07Z; 10-26 newest sibling was **#1108**) | Extracts WX in-battle teal/crimson cube (`drawPortalPixels` nested helper, `bh = 28`, grain 10/9, seed `x*127+y*311`) into `engine/battlePortalCube.ts`. Named `BATTLE_PORTAL_CUBE_HEIGHT = 28`, `GRAIN_TOP = 10`, `GRAIN_SIDE = 9`, LCG `16807`/`2147483647`. Comment forbids folding into `barrierRender`, overworld whirlpool, `tilePaint`, or `mapHazardPaint`. Live main still inlines at WX **7766–**. Zero `drawImage`. After merge WX **19213 → ~19085** (−140 / +12 in WX). Boss/rest/white cubes stay teal. |
| [#1115](https://github.com/Mr-Melic/stralt/pull/1115) owner confirm-snapshot / mailto / a11y / hit-target | **Not cited** | Adds `adminOwnerUx.confirmSnapshot.ts`, `.mailtoSecret.ts`, `.confirmA11y.ts`, `.hitTarget.ts` (`OWNER_MIN_HIT_PX = 44`). Explicitly **not wired** into `AdminDashboard.tsx`. Not a visual library. Do not merge into #724 `visualPool`, #631 `visualPreview`, #945 `visualRevert`, #1001 confirmChrome, or #1066 confirmEnter. |
| [#1125](https://github.com/Mr-Melic/stralt/pull/1125) / [#1162](https://github.com/Mr-Melic/stralt/pull/1162) 44px chrome | #1068 ToggleGroup/Breadcrumb/Resizable | Raises Collapsible / ScrollBar / SidebarRail (**#1125**) and Spellbook Save / Cancel / upgrade (**#1162**) floors to **44px**. Extends #895 Button, #935 Input/Select, #1010 Toggle/Accordion, #1068 ToggleGroup. Touch-target a11y, **not** a sprite box. |
| Pack-enemy kit-share continues | #1054 / #1081 / #1085 / #1087 / #1090 / #1091 / #1095 / #1096 / #1098 / #1104 / #1107 | **#1123 / #1150 / #1158 / #1159** share summon-hunter Venom, bomber Inferno CD, WX `availableSpells` vs pack CD, Enthroned Void Swap. Combat modifiers **#1142 / #1148 / #1155 / #1160** (Plague Zone soak, Vampiric Ground, Iron Curse, Glass Realm) are advertised-number commits, not visual binds. Portal Enemy still has no `isBoss` / `bossId`. |
| Persist remount siblings | through **#1107** / **#1099** | **#1129 / #1145 / #1147 / #1149 / #1151 / #1153 / #1157** skip remount leftover-Doka wipes after portal persist following keep. None preserve visual-library keys. `versionGate.ts` still only keeps tier / levelup / `*_inventory`. |
| Newest open sibling | #1108 | **#1162** (2026-10-26T18:27Z) Spellbook 44px. Paint-relevant newest **#1109**. |

Prior VAL IDs are **not** re-issued. Implementers on `main` already have the merged 08-31 contract plus VAL-2026-09-01-001 copy honesty. The fifteen open VAL docs PRs are evidence refreshes, not a merge gate for the first `engine/visualAssets.ts` PR.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint **on main** | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Trailing `ctx.restore()` at **3883** has **no matching save** — do not put `drawImage` inside this function. WX also **injects** it as `drawPattern` into `drawCombatant` (**8063**), so an overload would hit every combatant branch. |
| After [#961](https://github.com/Mr-Melic/stralt/pull/961) | Same math, named module | `PIXEL_PATTERN_CELL_SIZE = 3`; `pixelPatternOrigin` uses `Math.round(x − width/2)`; `drawPixelPattern` still `restore()`s with no `save`. WX wrapper must stay empty-deps. Preview/resolver must **import** origin math, not copy it. |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782). **Does not** `restore`. #961 forbids unifying this with `engine/pixelPattern.ts`. |
| `data/pieceArt.ts` `strokeOwnerTint` | Summon side outline **on main** | 2px stroke + `shadowBlur = 8` (791–811). After **#1059**: `data/ownerTintStroke.ts`, **no blur**. Sized from pattern × 3 × scale, not from occupancy. |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | **837–1023**. **No bitmap hook.** Branch 1 requires `entity.isBoss && entity.bossId` (856). |
| `engine/enemyPixelPatterns.ts` | Boss **8×12** tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12` |
| WX player | `drawPixelPattern` + `getPersistedPiecePattern`, **not** `drawCombatant` | **8315–8326** |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3722, **18108–18115** |
| Character creation | 8×8 × `scale = 10` → **80×80** art on **320×280** internal canvas, CSS **240×210** | `CharacterCreation.tsx` 151–153, 452–463 |
| Character selection | default CSS **120**, internal **240**, `pixelSize = floor(internalSize / 10)` = **24** → **192×192** art | `CharacterSelection.tsx` 310–348. Live main still uses local `CHESS_PIECE_PATTERNS`. After #966 the grid comes from `pieceArt.chessPiecePatterns`; cell size stays 24px, **not** combat 3px. |
| After [#995](https://github.com/Mr-Melic/stralt/pull/995) | Iso **tile** paint, not combatants | `engine/tilePaint.ts` `drawIsometricTile` + `ISO_WALL_HEIGHT = 28`. Floor grain / wall cube / portal diamond+ellipse. Import after `targeting` / before `turnQueue`. |
| After [#1076](https://github.com/Mr-Melic/stralt/pull/1076) | Hazard **overlay** paint, not combatants | `engine/mapHazardPaint.ts` `drawHazardOverlay`. Clip to iso diamond at **top vertex**. Grain 2–3 px. Lava pulse uses injected `nowMs`, not `Date.now` inside the helper. Import after `mapGen` / before `mapModifiers`. Live main still inlines at **7416**. |
| After [#1109](https://github.com/Mr-Melic/stralt/pull/1109) | In-battle **portal cube**, not combatants | `engine/battlePortalCube.ts` `drawBattlePortalCube`. Height **28**, grain 10/9, seed `x*127+y*311`. Import from the existing inBattle branch. Live main still inlines at **7766**. Overworld keeps `drawPortalWhirlpool`. |

`Character.pixelPattern` is a **required** Text field. Official create serializes the catalog chess grid (`CharacterCreation.tsx`). `getPersistedPiecePattern` (`pieceArt.ts` 653–658) looks up by `pieceType` string and falls back to `king.front`. WorldExploration **never reads** the stored blob (portrait 3719, player 8289). Unknown `pieceType` paints `king.front`.

There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime. A later split is allowed only if decode produces an `ImageBitmap` at the profile’s default scale without stretching at paint time.

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

#1001 / #1066 / **#1115** helpers are **owner console locks** (confirm chrome, principal-gate, confirm-Enter, reveal-mask, ban-reason, confirm-snapshot, mailto-secret, confirm-a11y, hit-target 44px). They are **not** a library, not a spec sheet, and not a revert control.

`adminGuard.validateOptionalUrl` checks length ≤ 2048 (`MAX_URL` line 10) and `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / `file:`, 89–95). It does **not** decode images. Empty URL is valid.

`requireHttpsUrl` is **landing ads**. `proofDataMimeAllowed` JPEG is **shop proofs**. Neither is a combat MIME gate. Sibling #724 `visualUploadRequirementsBeforeSelect` is https-only **catalog URL copy** (VAL-2026-09-29-001) — not the file-picker spec sheet.

`MAX_JSON_BLOB = 32768` and `pixelPattern` **16_384** cannot hold PNG bytes. Caffeine `ExternalBlob` is bindgen plumbing. No visual-asset blob type exists.

### 2.3 Entity categories as the game classifies them

| Requested category | Current identity | Visual today |
| :--- | :--- | :--- |
| **PLAYER CHARACTER** | `id: "player"`, `pieceType` chess, 4-way `playerView` | 8×8 `chessPiecePatterns` + character colors. **Not** `drawCombatant`. Not in `combatantsRef`. |
| **STANDARD ENEMY** | `id: \`enemy-${n}-${currentTime}\``, random chess `pieceType`, `family` starts `"default"` | `drawCombatant` default branch. Family 30% is **stats only**. |
| **ELITE / LARGE ENEMY** | **No type.** `generateEnemyScaleFactors` stores visual squash 0.6–1.5. `iron_golem` is family HP paper. `elite_patrol` is a world-feature catalog key only (`worldFeatures.ts` 44, 454, 1013, 1491). | Same chess path × instance scale |
| **BOSS** | Portal: `id: \`boss_${bossConf.id}_${Date.now()}\``, `scaleX/Y = 1.4`, `family: "boss"` (**6568**). **No** `isBoss` / `bossId` on that Enemy. Rush: `id: \`boss-rush-${roomIndex}-*\``, `isBoss: true` (**5340 / 5365**), lore `pieceType` string, paints `king.front` 24×24. Battle later tags `isBoss` if `id.startsWith("boss_")`. | Live portal: chess 8×8 × 1.4 ≈ **34×34**. 8×12 tables unused unless `isBoss && bossId`. |
| **SUMMON** | `id: \`summon-${Math.random()…}\`` (`summonSpawn.ts` **153**). Wrapper id `enemy-summon-${pieceType}` (**271**) is **not** the instance id. | 8×8 `creaturePatterns` + owner tint. Badge `(x+18, y−48)` (8146–8147). After #1059 the tint is stroke-only. |
| **Ghost / boss minion** | `assignedName === "Ghost"` or `isBossMinion` | **Only these** use family pixel grids |
| **Future** | Portals (whirlpool r=25 **and** tile ellipse tw/3×th/4 **and** in-battle cube h=28), walls (`ISO_WALL_HEIGHT = 28` after #995; live WX **4085**), hazards (**#1076** overlay, live WX **7416**), loot, ads, death juice | Not `drawCombatant` |

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

`hitTestSprite` tests that stored `x,y,w,h` plus padding. Live pads: mouse **10** (10127), touch **14** (10819). Sibling #795 locks those two literals. Custom art must **never** rewrite `drawSize` / occupancy / range / targeting from bitmap width. `Enemy.scaleX` / `scaleY` are **required** on the TS type (`gameTypes.ts` 300–301) but Rush/summon objects often omit them — do not fill missing squash from PNG size at bind.

Drop shadow is a **separate** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` → desktop **12 × 4.2** (8033–8053). It does not track sprite pixels. Moving-enemy `shadowBlur = 8` (8057–8060) is a walk cue, distinct from #1059’s summon tint.

Barrier towers are `BARRIER_LAYERS * BARRIER_LAYER_HEIGHT` = 6 × 28 = **168** (`barrierRender.ts` 15–16). That height is occupancy-adjacent **paint**, not a combatant still. `#1109` cube height **28** matches the wall / barrier **layer**, not a still size.

### 2.5 Randomness — bind at spawn, never in render

| What | When | Stability |
| :--- | :--- | :--- |
| `generateEnemyScaleFactors()` | spawn (WX **5768**, default `Math.random`) | stored on `scaleX`/`scaleY`. Tall/wide branches max **1.5** (`spawnPolicy.ts` 239–248; locked in `spawnPolicy.test.ts` 171–201) |
| Enemy / boss ids | spawn | `Date.now()` / `Math.random` in the id string |
| Family 30% | spawn | `Math.random` via `applyFamilyVariantsToRoster` |
| Battle stats | `getEnemyBaseStats` | `seededRng` (`combatMath.ts` 122) |
| Map tiles / #995 wall+floor grain / **#1076 hazard grain** / **#1109 cube grain** | generate / paint | tile-local LCG — **not** combatant art |
| **Encounter visual seed** | — | **Does not exist** |
| rAF / React render | every frame | Must **not** pick art |

`seededRng` (`combatMath.ts` 122–128) is the correct primitive for weighted pool picks. `#1109` cube grain uses the **same Park–Miller constants** (`16807` / `2147483647`, init `abs(seed)+1`) but a **different stream** (seed `x*127+y*311`). The extract comment forbids reusing `seededRng` for cube grain. Do **not** reverse that: do not feed `portalCubeSeed` / cube LCG into `pickWeighted`. Hash the **already unique instance id** plus `poolId` / assignment version.

Write `visualAssetId` once at spawn / summon / boss portal. If the bound id later fails validation, fall back to builtin — **do not re-roll**.

Summon `turnsRemaining` ticks must not re-pick. `#861` / `#911` / `#947+` / **#985+** / **#1107** / **#1123 / #1150 / #1158** filling or sharing kit spells must not re-pick either. `toCombatantEntry` (`combatantStore.ts`) **drops** unknown fields — `visualAssetId` must live on `combatantsRef` Enemy (and survive `updateCombatant` spreads), not only on turn-order rows.

Custom art must **not** inherit instance squash 0.6–1.5. That squash is a pixel-art variety trick.

Do **not** reuse `#995` `isoWallSeed` / `isoFloorColorSeed` / `isoFloorTextureSeed`, `#1076` `hazardOverlaySeed`, or `#1109` `portalCubeSeed` as combatant pool hashes. Those seeds pick **tile / cube grain**, not artwork.

### 2.6 Owner gate and viewport

`App.tsx` `SmallScreenGuard` is Continue-not-block (`pbv_small_screen_continue`). After bypass, `useIsMobile` (`hooks/use-mobile.tsx` 17–26) is **width-only** `< 768`, so:

| Viewport | Tiles | Camera in paint |
| :--- | :--- | :--- |
| Portrait phone `<768` after Continue | `MOBILE_ZOOM` 1.75 → **140×70** (WX 957–959) | `gridToScreen` uses `cameraRef` |
| Landscape phone / tablet 768–1024 | **80×40** | Rest/Death **pans** (`!isDesktop`) |
| Desktop `innerWidth > 1024` | **80×40** | paint **cam=0** even if Rest/Death writes `cameraRef` (3780–3781) |

Iso preview must include a mobile-zoom pane. Do not scale custom bitmaps by `MOBILE_ZOOM` (builtin cells stay 3px).

Admin writes require owner / admin role. New canister maps for a visual library need a **new later** migration file after `20260901` (`OldActor = {}`). Do not edit shipped `NewActor`s. Uploads stay **DRAFT** until the owner activates.

### 2.7 Overlay stack that preview must warn about

| Overlay | Position | Size |
| :--- | :--- | :--- |
| Name | `screenPos.y − 34` | bold 11px |
| Level | nameY + 14 | bold 11px |
| Status icons | drawY − 30 | 16×16, max 4 |
| Summon badge | `(x+18, y−48)` | ~12px pill |
| Wander ring | — | r=15 (extract #591) |
| Moving glow | around combatant | `#ff6b6b` blur 8 |
| Ground Doka | tile | coin r=7/14 |
| Portal FX | `translate(y−10)` | r=25; rest glow **33**; boss-star **37**; dungeon spike **35** |
| In-battle portal cube | tile top | height **28**; grain ~1–2 px (**#1109**) |
| Hazard overlay | iso diamond clip | grain 2–3; lava 4×4; ice 3×3 |
| Wall cube | tile top | height **28** |
| Barrier tower | tile | **168** |

`MAX_HEIGHT` 60 on a still clips the status row. Custom stills stay **24×24** (or 34×34 live boss) so they fit under that stack.

---

## 3. RENDER_PROFILES (frozen from live boxes)

Custom default scale is **1**. Do not invent 64×64 / 128×128. Do not key `boss_large` off `isBoss` / `family==="boss"`.

| Profile | RECOMMENDED_W×H | MAX_W×H | DEFAULT_SCALE | MAX_SAFE_VISUAL_FOOTPRINT | ANCHOR | ANIMATION_SUPPORT |
| :--- | ---: | ---: | ---: | ---: | :--- | :--- |
| `player_standard` | 24×24 | 48×48 (@2×) | 1 | 24×24 on 80×40 (140×70 phone) | pattern center at **rounded** tile top+9 | 4 stills (front/back/left/right). No walk. |
| `enemy_standard` | 24×24 | 48×48 | 1 | 24×24. Do **not** apply instance squash 0.6–1.5 | same | 4 stills |
| `enemy_elite` | 36×36 | 48×48 | 1 | 36 from squash max **1.5** × 24. **Metadata-only** until `isElite` exists | same | 4 stills. `ELITE_ONLY` ineligible in v1 |
| `boss_large` | **34×34** live | 48×48 (reject 8×12 stretched to 1.4 as a hidden 34×50) | 1 | Live portal is chess 8×8 × 1.4 ≈ 34×34. Unused tables are 8×12. Do not stretch enemy 24×24 | same | 4 stills. Separate profile — not enemy art × 1.4 |
| `summon_standard` | 24×24 | 48×48 | 1 | 24×24 plus 2px owner stroke (`#1059` no blur) | same | 4 stills. Bind on `summon-${random}`, not `enemy-summon-${pieceType}` |

Shared:

| Field | Value | Evidence |
| :--- | :--- | :--- |
| SUPPORTED_FORMATS | **PNG / WebP** with alpha. Reject JPEG / GIF / SVG / `data:` / `file:` | Combat has no JPEG path. Shop `proofDataMimeAllowed` JPEG is **not** this gate. `unsafeUrl` already rejects `data:` / `file:`. |
| TRANSPARENCY_REQUIREMENT | **Required.** Builtin cell `0` is skip. Opaque rectangles cover the diamond. | `drawPixelPattern` skips 0 (3866). |
| MAX_FILE_SIZE | **256 KiB** decoded source | `MAX_JSON_BLOB` 32768 / `pixelPattern` 16384 cannot hold bytes. Object storage, not Motoko Text. |
| Hit box (not art) | desktop **80×41**; pads 10 / 14 | WX 8085–8092, 10127, 10819 |

---

## 4. Asset library metadata

Owner-only records. Empty catalog is valid.

| Field | Role |
| :--- | :--- |
| `ASSET_ID` | Stable id. Never reuse after safe-delete. |
| `DISPLAY_NAME` | Owner label. Rename does not re-bind instances. |
| `ENTITY_CATEGORY` | `player` / `enemy` / `elite` / `boss` / `summon`. Unknown → ineligible. |
| `ENTITY_FAMILY` | Optional `EnemyFamily`. Empty = any family in that category. |
| `ENTITY_IDS` | Optional explicit ids (`boss_1`, chess `pieceType`, summon `pieceType`). Empty = pool. |
| `VARIANT_TAGS` | Optional tags (`front`, `alt`). Not walk-frame slots. |
| `ACTIVE` | Only ACTIVE + valid decode participates. DRAFT never enters `resolveRuntimeVisual`. |
| `WEIGHT` | Positive number. Inactive / 0 excluded. |
| `RARITY` | Owner label only — does not bypass WEIGHT. |
| `ELITE_ONLY` | Ineligible until a real elite flag exists. |
| `BOSS_ONLY` | Eligible only for `boss_*` instance ids (not Rush `isBoss: true` lore rows). |
| `UPLOAD_DATE` | Audit. |
| `VERSION` | Replace increments. Bound instances keep the id; decode uses current bytes or fallback. |
| `SOURCE_METADATA` | Original MIME, px, bytes. |
| `RENDER_PROFILE` | One of the five frozen profiles. |
| `VALIDATION_STATUS` | `ok` / `invalid` / `inactive` / `missing`. Invalid → immediate builtin. |

Operations: upload, preview, activate, deactivate, rename, replace (version), safe removal (unbind then delete), assign to entity / family / pool, weighted random, revert to default, dependency inspection (which instance ids currently bind this asset).

Safe removal: deactivate first; live instances fall back **without re-roll**; then delete bytes. Never leave a dangling id that re-picks a different PNG.

---

## 5. Fallback, assignment, weighted pools

Rendering priority (must be a **pure function** of stored bind + library snapshot, never of `Math.random` / React render):

1. valid **ACTIVE** custom visual **specifically assigned** to this entity/variant;
2. valid **ACTIVE** custom visual selected from the eligible **pool** (id already stored on the instance);
3. existing built-in / generated pixel visual.

Missing, invalid, inactive, corrupt, or unavailable custom assets fall back **immediately** to (3). Do not pick a different pool member in render.

Weighted pool: only ACTIVE + category-eligible + decode-ok assets. If none qualify, builtin. Selection:

```
visualAssetId = pickWeighted(
  seededRng(hash(instanceId, poolId, poolVersion)),
  eligible
)
```

Write once at spawn / summon / boss portal / player facing bind (`pieceType`+`playerView`). Ordinary rerenders, `turnsRemaining` decrement, kit-share, and pack heal must not change appearance.

There is **no** encounter seed. Do not invent one as a prerequisite.

Revert-to-default: clear the bind (and/or deactivate the asset). Empty after revert is **Default Pixel Visual**, not a validation error.

---

## 6. Entity-aware upload specifications (show BEFORE file pick)

Derive from §3. Display this sheet **before** `<input type=file>`. Never silently scale / crop / letterbox.

| Category | Rec | Max | Formats | Alpha | Max bytes | Anchor | Default scale | Max safe footprint | Animation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PLAYER | 24×24 | 48×48 | PNG/WebP | required | 256 KiB | tile top+9 center | 1 | 24×24 | 4 stills |
| STANDARD ENEMY | 24×24 | 48×48 | PNG/WebP | required | 256 KiB | same | 1 | 24×24 | 4 stills |
| ELITE / LARGE | 36×36 | 48×48 | PNG/WebP | required | 256 KiB | same | 1 | 36×36 (ineligible until `isElite`) | 4 stills |
| BOSS | 34×34 | 48×48 | PNG/WebP | required | 256 KiB | same | 1 | 34×34 live; do not stretch 24×24 | 4 stills |
| SUMMON | 24×24 | 48×48 | PNG/WebP | required | 256 KiB | same | 1 | 24×24 + 2px stroke | 4 stills |

**Forbidden as recommended art size:** 1–2 (cube grain `#1109`), 3 (cell), 2 / 4 (hazard grain / lava glow), 26.7×10 (portal-tile ellipse), 25 / 33 / 37 / 35 (portal FX), 28 (wall **and** in-battle cube height), 41 / 80 (hit), 44 (a11y including Spellbook / `OWNER_MIN_HIT_PX`), 60 (portrait), 72 (admin `<img>`), 120 / 192 (lobby), 168 (barrier), 240×210 / 320×280 (creation), `th*0.65` serif (hazard font that is unused — glyphs are `fillRect`).

Validate: MIME, decode, width/height, aspect (reject far from 1:1 unless profile says otherwise — live stills are square-ish 8×8 or live 34×34), pixel count, file size, transparency, category, render-safe bounds. Reject with an error. Never `drawImage` a failed decode.

---

## 7. Preview

Where architecture supports it cleanly: SOURCE asset → optional NORMALIZED runtime bitmap → RENDER_PROFILE. **That pipeline does not exist today.** v1 may draw the decoded bitmap at default scale 1 with the same centering as `pixelPatternOrigin`.

Preview **must** show:

- isometric 80×40 diamond (import `drawIsometricTile` after #995; do not clone);
- dummy player 24×24 and dummy enemy 24×24 at top+9;
- intended scale 1 and correct anchor;
- mobile-zoom pane 140×70;
- warnings: clipping vs name/status/badge, padding vs 10/14 hit pads, overlap vs neighbor Δ=(40,20), wall 28, in-battle cube 28, hazard overlay grain, phone relative smallness.

Admin catalog 72×72 `object-fit:contain` is **not** iso preview (`#631` `catalogVisualPreviewSrc`).

After #1076, preview may optionally stamp `drawHazardOverlay` under the dummy **as a clip warning**, not as the still.

After #1109, preview may optionally stamp `drawBattlePortalCube` **as a clip warning** on a dummy in-battle portal tile. Do not treat the cube as a combatant still. Do not paint the overworld whirlpool in the same pane without labeling it as FX.

After #1059, summon preview must use stroke-only owner tint around the bitmap.

---

## 8. Persistence

Bytes in object storage. Metadata in optional admin maps (new migration after `20260901`). Never `localStorage` / `nsKey` / `Character.pixelPattern`.

`versionGate.ts` 7–13 preserves only `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory`. `App.tsx` still `localStorage.clear()` on `APP_VERSION`. Remount-keep PRs through **#1157** do not add visual-library keys. Drafts never enter `resolveRuntimeVisual`.

---

## 9. Stack / implementation posture

WX is **19213** lines on `0f5363f`. AGENTS.md forbids growing the rAF body, map generation, turn logic, and damage math.

Open paint extracts VAL must **import, not copy**:

| PR | Module | Slot / note |
| :--- | :--- | :--- |
| #427 | sprite hit-test | do not restack WX |
| #639 | `isoGrid.ts` | rounded top ≠ click-cache center |
| #730 | AO | 8px floor-diamond; not combatant shading |
| #798 | `stepCameraFollow` | desktop paint still cam=0 |
| #901 | `portalWhirlpool.ts` | r=25 swirl; not tile ellipse; not in-battle cube |
| #961 | `pixelPattern.ts` | 3px cells; unpaired restore |
| #995 | `tilePaint.ts` | `ISO_WALL_HEIGHT = 28`; floor/wall/portal fill |
| #1076 | `mapHazardPaint.ts` | after `mapGen` / before `mapModifiers` |
| **#1109** | **`battlePortalCube.ts`** | **inBattle branch only; height 28; grain 10/9** |
| #841 | click-trace Vite alias | do not restack `vite.config.js` |
| #1059 | `ownerTintStroke.ts` | stroke-only; import, don’t clone |

First implementer PR: `engine/visualAssets.ts` + tests that `[]` / inactive / corrupt → `{ kind: "builtin" }`. Read merged 08-31 IDs. Do **not** wait for fifteen VAL markdown PRs. Union overlapping files; one `export function` per name.

---

## 10. ACTION_ID index (this run)

See [`ACTION_IDS_VAL_2026-10-27.md`](./ACTION_IDS_VAL_2026-10-27.md). `VAL-2026-10-27-001` … `012` are NEW. Prior VAL-* are not re-issued.

*End of 2026-10-27 design. Production code not modified.*
