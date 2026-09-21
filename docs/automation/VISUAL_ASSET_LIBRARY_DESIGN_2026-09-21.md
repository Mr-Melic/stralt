# Custom Visual Asset Library & Assignment — 2026-09-21 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-21  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (merged PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md)  
**Prior ACTION_IDs:** `VAL-2026-08-31-001` … `019`; `VAL-2026-09-01-001` … `011`; `VAL-2026-09-02-001` … `012`  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-21.md`](./ACTION_IDS_VAL_2026-09-21.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer. Invented sprite boxes (64×64, 128×128) are not used. Pixel boxes did not change. Architecture around spawn policy, admin honesty, EOP, and flavor lore did.

---

## 0. Verdict

| Question | 2026-09-21 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (only a comment in `adminVisualStatus.ts`). |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended dimensions change? | **No.** Tile 80×40, cell 3px, standard 24×24, boss 8×12 × 1.4 ≈ 34×50. |
| What shipped since 09-02? | **Not the library.** Spawn policy extracted (`engine/spawnPolicy.ts`). Enemy Register labeled flavor lore. Admin URL guard now also rejects `file:`. EOP GameKey chain after `20260831`. Combat/occupancy/security PRs. Copy honesty from VAL-2026-09-01-001 is still live. |
| Can phones enter combat? | **Yes.** Continue + `pbv_small_screen_continue`. `MOBILE_ZOOM` 1.75 tiles only; pixels stay 3px. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`.

---

## 1. Delta vs 2026-09-02

| Topic | 2026-09-02 | 2026-09-21 (this tree) |
| :--- | :--- | :--- |
| `WorldExploration.tsx` | 19253 lines | **19213** lines |
| `getBossPixelPattern` | `enemyPixelPatterns.ts` 430–432 | **unchanged location** 430–432; fallback `boss_12` |
| Family grids | `enemyPixelPatterns.ts` 434–498 | **unchanged** 434–498; sizes are **not** 8×8 |
| `drawPixelPattern` | WX 3816, `pixelSize = 3` | WX **3841–3886**, still `pixelSize = 3` |
| `generateEnemyScaleFactors` | WX 4545–4571 | **`engine/spawnPolicy.ts` 227–255** (0.6–1.4 squash, two unused rng draws kept) |
| Family 30% roll | WX 5862–5953 inline | **`applyFamilyVariantsToRoster`** (`spawnPolicy.ts` 289–297) called from WX **5864–5866** — still **stats only** |
| Enemy spawn id | `enemy-${n}-${currentTime}` | WX **5809** same; `Date.now()` |
| Boss spawn | scale 1.4, `boss_${id}_${Date.now()}` | WX **6524**, **6535–6536** same |
| Battle `isBoss` | `id.startsWith("boss_")` | WX **11958–11959** same |
| Boss `family` | `"boss"` | WX **5343 / 5368 / 6568** |
| Player facing | `setPlayerView` on step | WX **11490–11493** (was cited as 11601) |
| Sprite hit box | tile-derived `drawSize` | WX **8086–8103** / **8335–8352** still 80×60 desktop |
| Name / level labels | `y − 34` / +14 | WX **8122–8123** |
| Summon lifespan badge | `(x+18, y−48)` | WX **8146–8147** |
| Attack-mode damage float | not in 09-02 clip table | **NEW citation:** WX **8206–8214** `y − 44` / `y − 58` |
| Status icons | draw point − 30 | WX **8246** / player **8362** |
| Player draw | not `drawCombatant` | WX **8315–8326** still `drawPixelPattern` |
| Portrait | 60×60, 6px | WX **3720**, **18112–18114** |
| Drop shadow | tile-foot ellipse | WX **8033–8054** / **8291–8312** |
| `ctx.scale(dpr)` | cited ~7317 | **7200–7211**, rAF **7250–7264**, resize **13953–13965** |
| `gridToScreen` | cached top vertex | WX **3772–3792** |
| Admin deny | `if (!isAdmin)` | `AdminDashboard.tsx` **5546** |
| `App.tsx` `isAdmin` | `userRole === "admin"` | **291** |
| Admin sprite URL copy | stored, not rendered | **Still honest** (`adminVisualStatus.ts`; EnemyEditor **817–838**) |
| Walk-frame URL UI | “Walk Animation Frames” | **Still present** (`AdminDashboard.tsx` **1588–1622**) with **no** stored-not-rendered note |
| Ad box copy | “Custom Visual — override URLs set” | **8221** — landing still paints `<img>` (`LandingPage.tsx` **750**) |
| `getEnemyConfigs` in WX | unused | still **zero** matches. Hook lives in `useSpellQueries.ts` **111–137** for **AdminDashboard only** |
| `engine/visualAssets.ts` | proposed | still **absent** |
| `isElite` | absent | still **absent** (`gameTypes.ts` Enemy **280–341**) |
| `elite_patrol` | catalog string | `worldFeatures.ts` still a **feature category**, not an enemy flag |
| Encounter seed | absent | still **absent**. `seededRng` (`combatMath.ts` **122–127**); `getEnemyBaseStats` hashes `seedKey` (`progression.ts` **163–170**) |
| Enemy Register | implied live roster | **Flavor lore** (`enemyRegisterCopy.ts` **1–15**; commit `9e28cf9`) |
| `unsafeUrl` | javascript/data/vbscript | also **`file:`** (`adminGuard.mo` **89–95**) |
| EOP | GameKey-on-20260831 unsupported | Live chain: genesis + `20260803` + `20260827` + **frozen `20260831`** + **frozen `20260901` GameKey**. New stables need **`20260902+`** |
| Open PR stack at inspection | #259 draft | **#327**, **#331** (code); **#333** (telemetry docs, `README.md`). This design is new files under `docs/automation/` only |

Sibling designs that must not fork this library:

- `EBA-2026-08-31-017` — per-entity `visualMode: none|asset|pool`, default **none**. Implement **after** VAL resolver, not as `drawImage(spriteUrl)`. `EnemyConfig` still has only `spriteUrl` (`gameTypes.ts` 108–119; Motoko `admin.mo` 15–26).
- `ENEMY_ELITE_EVOLUTION_*.md` — still **PROPOSED**. No live `isElite`. `ELITE_ONLY` assets stay ineligible (`VAL-2026-08-31-019`).

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Ends with `ctx.restore()` |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782) |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023 |
| `engine/enemyPixelPatterns.ts` | Boss 8×12 tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432; family 434–498 |
| WX player | `getPersistedPiecePattern(pieceType, playerView)` | 8289, 8315–8326 |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3724, 18112–18114 |
| Character creation | 8×8 × `scale = 10` → **80×80** art on a **320×280** canvas (CSS width 240) | `CharacterCreation.tsx` 151–178, 452–462 |
| Character selection | `pixelSize = floor(internalSize / 10)` with `size = 120`, internal 240 → **24px cells / 192×192 art** | `CharacterSelection.tsx` 310–337 |
| Death juice | `fillRect` fragments | `engine/effects.ts` 282–292 |
| Barrier towers | iso wall stack, **not** a combatant | `engine/barrierRender.ts` 14–16, `BARRIER_LAYER_HEIGHT = 28`, 6 layers |

`Character.pixelPattern` is persisted at creation and **never read** by WorldExploration (zero `pixelPattern` matches in WX). The world player always uses chess-piece tables via `getPersistedPiecePattern`.

Repo-wide: no `ctx.drawImage`, no `createImageBitmap`. There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects `getBossPattern`, `getFamilyPattern`, `getFamilyColors`, `drawPattern`, `characterYOffset`. It does **not** accept a bitmap. A custom path must be a new optional **top** branch, not `drawImage` inside `drawPixelPattern` (that function only `fillRect`s cells). Putting a PNG through `drawPattern` would interpret bytes as a cell grid.

`strokeOwnerTint` (`pieceArt.ts` 791–811, summon branch 923–926) strokes the **pattern AABB** (3px × cells × scale). A custom bitmap cannot reuse that function as-is.

### 2.2 Unused URL stubs — still not a library

| Store | Fields | Who reads in combat |
| :--- | :--- | :--- |
| Motoko `EnemyConfig` | `spriteUrl : ?Text` (`admin.mo` 25) | **Nobody in WX** |
| Motoko `PlayerSpriteConfig` | `frontUrl` / `rightUrl` / `leftUrl` / `backUrl` + four `walkFrames*` arrays (`admin.mo` 39+) | **Nobody in WX**. Admin copy says catalog only (`AdminDashboard.tsx` 1784) |
| Admin enemy editor | URL paste + honesty (`ENEMY_SPRITE_URL_*` in `adminVisualStatus.ts`) | Stored, not rendered |
| Admin sprite editor | 72×72 `<img object-fit:contain>` (`AdminDashboard.tsx` 1484–1507) | Preview of the URL string only |
| Caffeine `ExternalBlob` | Bindgen `_uploadFile` / `_downloadFile` | Used for other file-shaped Candid fields. Sprite fields remain **Text URLs**, not blobs |
| Shop `proofFileUrl` | `data:` image/pdf/octet-stream, cap **524_288** (`adminGuard.mo` 118–131) | **Different surface.** Do not reuse as combat art |
| Landing ads | `imageUrl` → `<img>` (`LandingPage.tsx` 719–750) | **Does render.** Not combat |

`adminGuard.validateOptionalUrl` (`adminGuard.mo` 143–148) + frontend `adminSafety.ts` 424–428: empty OK, `MAX_URL = 2048`, `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / **`file:`**). **No MIME, decode, width/height, aspect, pixel count, alpha, or render-safe bounds.** Walk-frame cap is 16 **strings**, not frames drawn.

`requireHttpsUrl` (`adminGuard.mo` 97–104) applies to **ads**, not sprite stubs. A passing `adminSetEnemyConfig` URL is not `VALIDATION_STATUS = #ok`.

### 2.3 Entity categories that actually exist

| Prompt category | Live identity | Default visual |
| :--- | :--- | :--- |
| PLAYER CHARACTER | `character.pieceType` (chess), `playerView` four stills | 8×8 chess × 3px = 24×24 @ scale 1 |
| STANDARD ENEMY | `pieceType` + optional `family` after 30% roll | **Chess 8×8** even when `family !== "default"` |
| ELITE / LARGE ENEMY | **Does not exist** | `generateEnemyScaleFactors` is visual squash only; `iron_golem` is HP paper; `elite_patrol` is a world-feature catalog key |
| BOSS | `id.startsWith("boss_")`, `isBoss`, `bossId`, `family: "boss"`, scale **1.4** | 8×12 pattern × 3 × 1.4 ≈ 34×50; unknown id → `boss_12` |
| SUMMON | `isSummon`, `pieceType` in `creaturePatterns` (wolf/golem/archer/bomber/wisp), `side` | 8×8 creature × 3px + owner tint. **No `scaleX/Y` on spawn** (`summonSpawn.ts`) → draw defaults `{1,1}` |
| Boss minion / Ghost | `useBossSystem.ts` sets `isBossMinion: true`; WX phase-spawn map (**16105–16163**) sets `assignedName` Minion/Ghost, `family: ""`, **`isBossMinion` omitted**, `scaleX/Y = 1` | Branch 3 only if `assignedName === "Ghost"` **or** `isBossMinion`. `"Minion"` without the flag draws **chess default** |
| FUTURE | portals, walls, loot, death fragments, ads, barrier towers | Separate procedural / `<img>` paths. **Ineligible** until a measured profile exists |

Family **pixel** tables (`enemyPixelPatterns.ts` 434–498) are **not** 8×8:

| Family key | Grid | @ 3px |
| :--- | ---: | ---: |
| `wraith_bishop` | 3×8 | 9×24 |
| `iron_golem` | 6×5 | 18×15 |
| `plague_rat` | 6×5 | 18×15 |
| `ember_knight` | 5×8 | 15×24 |
| `tide_shade` | 7×4 | 21×12 |
| `bone_scribe` | 5×8 | 15×24 |
| `void_mirror` | 6×6 | 18×18 |
| `default` | 3×3 | 9×9 |

`drawCombatant` branch 3 uses those grids **only** for Ghost / `isBossMinion`. The 30% family roster still draws chess (`pieceArt.ts` 989–1022). **Do not publish family-grid sizes as the STANDARD ENEMY upload spec.**

### 2.4 Occupancy and hit-testing — visual size ≠ gameplay footprint

`engine/occupancy.ts` `isCellFree` (84–98): one combatant per **tile**. No pixel, scale, or image-size input.

WX `spriteRectsRef` stores `drawSize: { w: effectiveTileW, h: effectiveTileH * 1.5 }` (desktop **80×60**, mobile-zoom **140×105**). `drawAnchor` is the pattern center, not the image AABB. Click-miss must **not** be “fixed” by growing occupancy or `drawSize` from a bitmap.

Targeting (`engine/targeting.ts`) is tile/LoS. Range, collision, movement, and hitbox stay tile-derived.

### 2.5 Stable identity for assignment (no encounter seed)

There is still **no map encounter seed**. Do not block the library on inventing one.

| Instance | Id / RNG | Stable after spawn? |
| :--- | :--- | :--- |
| Pack enemy | `enemy-${n}-${Date.now()}` (WX 5809) | Yes, on the live object. `Date.now()` is unique enough for a bind key **after** push |
| Boss | `boss_${id}_${Date.now()}` (WX 6524) | Yes on the live object. Category also `id.startsWith("boss_")` |
| Player summon | `summon-${Math.random().toString(36).slice(2)}` (`summonSpawn.ts` 153) | Yes on the live object; **do not re-call `Math.random` in render** |
| Enemy summon | same helper | Same |
| Stats seed | `getEnemyBaseStats` charCode-sum `seedKey` + `seededRng` | Already deterministic per id string |

**Bind `visualAssetId` once at spawn / summon / boss portal / minion add.** Weighted pick: `seededRng(hash(instanceId, poolId, poolVersion))`, walk cumulative weights of **active + `#ok` + eligible** assets. If none qualify → leave id unset → builtin.

If a bound id later fails validation: **fall back to builtin; do not re-roll in rAF or React render.** `turnsRemaining` decrement must not re-pick.

`generateEnemyScaleFactors` uses `Math.random` at spawn and **stores** `scaleX/Y`. That squash applies to **fillRect cells only**. Custom bitmaps use `DEFAULT_SCALE = 1` and must not inherit it.

### 2.6 Owner / admin gate

There is **no** distinct `#owner` role. AccessControl is `#admin` | `#user`. First non-anonymous Internet Identity caller becomes admin (`main.mo` 712–739). `App.tsx` 291: `isAdmin = userRole === "admin"`. Admin dashboard returns early at `AdminDashboard.tsx` 5546.

**Owner-only** for this library means: **the same `#admin` catalog gate as `adminSetEnemyConfig` / `adminSetPlayerSpriteConfig`.** Players never see the UI. Do not invent a second principal type. Any later assigned `#admin` can mutate the library — same as today’s spawn-template catalog. A tighter single-principal lock is a product decision, not a renderer fact.

### 2.7 Mobile / tablet — Continue is live

Unchanged from 09-02 (09-01 was wrong):

- `SmallScreenGuard` **warns**; **Continue anyway** (`App.tsx` 43, 107–124).
- Bypass in `sessionStorage` `pbv_small_screen_continue` (25–40, 396–414).
- `useIsMobile(breakpoint = 768)` (`hooks/use-mobile.tsx` 17–26) → WX `MOBILE_ZOOM = 1.75` (874, 957–959) → tiles **140×70**.
- Desktop camera lock: `innerWidth > 1024` (WX 877).
- **Pixel patterns do not multiply by `MOBILE_ZOOM`.** Builtin 24×24 is relatively smaller on zoomed tiles.
- Canvas backing store is `css * dpr` then `ctx.scale(dpr)` (7200–7264). **Logical CSS pixels** are the draw unit. Do not multiply bitmaps by `devicePixelRatio`.

Iso preview must include a **mobile-zoom pane**. Treating phones as out-of-scope is still a stale design error.

---

## 3. Visual fallback invariant

Resolution order for every combatant, every frame:

1. **Bound instance assignment** — `entity.visualAssetId` points at a library record that is `ACTIVE`, `VALIDATION_STATUS = ok`, bytes decode, and category/eligibility still match.
2. **Bound pool assignment** — `entity.visualPoolId` was resolved **at spawn** into a stored `visualAssetId`. If that id is now invalid, **do not re-roll in render.** Fall through.
3. **Built-in / generated pixel visual** — current `drawCombatant` / `drawPixelPattern` path.

Hard rules:

- Missing, inactive, corrupt, undecodable, oversized, or ineligible custom assets **immediately** use step 3.
- Empty library ⇒ every entity is step 3. No upload required to ship a new enemy or boss.
- New `BossConfig` / `EnemyConfig` / summon `pieceType` automatically works with generated pixels (`getBossPixelPattern` already falls back to `boss_12`; unknown `pieceType` → `king.front` with a logged error).
- Failures log once (reuse `logPatternLookupFailed`), never throw, never block combat.

```ts
// src/frontend/src/engine/visualAssets.ts  (not implemented)
function resolveRuntimeVisual(entity, library): RuntimeVisual
  // { kind: "custom", bitmap, profile } | { kind: "builtin" }
```

`drawCombatant` may grow **one optional branch at the top**: if resolve returns a decoded bitmap + profile, `drawImage` at the same anchor as `drawPixelPattern`; otherwise branches 1–4 run unchanged. Player needs a **second** one-line site (WX 8315). Empty library / omitted option ⇒ **identity** with today.

Do **not** store `visualAssetId` on `CharacterStats` (12 required fields; AGENTS.md). Instance field on `Enemy` / a player-world ref is enough. Persisting library **metadata maps** on the canister is a **new later** migration file after `20260901_000000` (`OldActor = {}`). Never edit a frozen `NewActor`. Never put GameKey-shaped fields on `20260831`.

---

## 4. Derived render measurements (do not invent)

All sizes are **logical CSS pixels** after `ctx.scale(dpr)`. Source bitmaps may be integer multiples for sharpness.

### 4.1 Tile, anchor, scale

| Quantity | Desktop | Mobile-zoom (`isMobile` after Continue) | Source |
| :--- | ---: | ---: | :--- |
| Iso diamond | 80 × 40 | 140 × 70 | `TILE_*` × `MOBILE_ZOOM` 1.75 |
| `gridToScreen` | **top vertex** of the diamond | same | WX 3772–3792 (cached) |
| Tile visual center | top + `th/2` → +20 / +35 | | `tileCenter` 3804–3812 |
| Character draw point | `(tileTopX, tileTopY − CHARACTER_Y_OFFSET)` = `(tileTopX, tileTopY + 9)` | same offset | `drawCombatant` 850–852; player 8318–8319 |
| Pattern **anchor** | **center of the pattern** on the draw point | same | `startX = x − patternWidth/2` (WX 3860–3861, `pieceArt.ts` 764–765) |
| Drop-shadow foot | `(tileTopX, tileTopY + th/2 + 4)` | | 8035–8036, 8293–8294 |
| World cell size | **3×3** logical px × `scaleX`/`scaleY` | **not** × 1.75 | WX 3855 |
| Default pattern | **8×8 cells** | | `chessPiecePatterns`, `creaturePatterns` |
| Default drawn size @ scale 1 | **24 × 24** | 24 × 24 | 8 × 3 |
| Enemy instance scale | 0.6–1.4 (stored) | same | `spawnPolicy.ts` 227–255 |
| Max standard drawn @ 1.4 | **33.6 × 33.6** | 33.6 × 33.6 | 24 × 1.4 |
| Boss pattern | **8×12 cells** (all inspected `boss_*` / named) | | `enemyPixelPatterns.ts` 10–24, 406–427 |
| Boss drawn @ 1.0 | **24 × 36** | | 8×3 × 12×3 |
| Boss spawn scale | **1.4 × 1.4** (not random) | | WX 6535–6536 |
| Boss drawn @ 1.4 | **33.6 × 50.4** | | |
| Portrait | 60×60 canvas, 6px cells → 48×48 art | | 3720, 18112–18114 |
| Creation preview | 80×80 pattern on 320×280 canvas | | `CharacterCreation.tsx` 151, 452–455 |
| Selection preview | 192×192 on 240 internal | | `CharacterSelection.tsx` 313, 333 |
| Name label | `screenPos.y − 34` | | 8122 |
| Level label | name + 14 | | 8123 |
| Status icons | draw point − 30 | | 8246, 8362 |
| Summon lifespan badge | `(x + 18, y − 48)` | | 8146–8147 |
| Attack damage float | `y − 44` / scaled label `y − 58` | | 8206–8214 |
| Sprite hit `drawSize` | 80 × 60 | 140 × 105 | 8103, 8352 |
| Wall / barrier extrusion | 28 px per layer | | `barrierRender.ts` 15; WX wall branch |
| Viewport | warn &lt;768; Continue enters | zoomed tiles | `SmallScreenGuard` + `useIsMobile` |

**Anchor for custom bitmaps must match the pixel path:** center the image on `(tileTopX, tileTopY + 9)`, not on tile center and not on a foot bone, unless a future render profile adds an explicit `anchor: "foot"` (not in the current renderer).

Do **not** use the 320×280 creation canvas, 72×72 admin `<img>`, 60×60 portrait, or 192×192 selection preview as recommended upload size.

### 4.2 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**.

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` accepted if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF/APNG not used in combat. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | `playerView` updates on step (WX 11490–11493). Walk-frame arrays exist on `PlayerSpriteConfig` but are **never drawn**. Do not implement walk cycles in v1. |
| `MAX_FILE_SIZE` | **Not measured in-repo as a visual cap.** `MAX_URL = 2048` is URL text. Shop proof cap 524_288 is a **different** surface. `ExternalBlob` has no documented visual cap. | Starting reject: **256 KiB per still** after encode until IC ingress / object-store limits are measured. Do not store raw base64 in Motoko `Text`. Do not use `data:` or `file:` URLs. |

#### PLAYER CHARACTER — profile `player_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **24** (or **48** @2× source) | 8×8 × 3 |
| `RECOMMENDED_HEIGHT` | **24** (or **48** @2×) | same |
| `MAX_WIDTH` | **80** | `TILE_WIDTH`; wider overlaps neighbor diamonds (half-width 40) |
| `MAX_HEIGHT` | **60** | sprite `drawSize.h` desktop |
| `ANCHOR` | center on draw point (tile top + 9) | `drawPixelPattern` |
| `DEFAULT_SCALE` | **1** | player draw omits scale (defaults `{1,1}`) |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | 2× default; still inside 80×60 hit box; labels at y−34 stay clear of a 24-tall sprite |

Portrait HUD and character-creation/selection canvases stay generated pixels in v1.

Admin sprite `characterPieceType === "custom"` is **not** a live `ChessPieceType` (`gameTypes.ts` 5–11). World falls back to `king`. Import as inactive + `#invalid` until the owner picks `player_standard` and a real piece id.

#### STANDARD ENEMY — profile `enemy_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | chess 8×8 × 3 — **not** family grids |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile + hit box |
| `ANCHOR` | center / draw point | `drawCombatant` |
| `DEFAULT_SCALE` | **1** | Custom art must **not** inherit random 0.6–1.4 squash. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | |

Assignment keys: `pieceType` and/or `family` **string** written by `applyEnemyFamilyStats`. Visual remains chess until a custom bind exists.

#### ELITE / LARGE ENEMY — profile `enemy_elite` (future category)

No elite type exists. Do **not** invent gameplay size. If metadata `ELITE_ONLY` is used:

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **34** | ceil(24 × 1.4) — current max instance scale |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | same tile/hit box as standard — **visual only** |
| `DEFAULT_SCALE` | **1** on a 34×34 recommended asset | Do not also multiply by 1.4 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 56 × 56 | under tile width; warn if &gt; 48 |

Occupancy stays **one tile**. Until an explicit elite flag exists, `ELITE_ONLY` assets are **ineligible** for random pools. Do not infer elite from `scaleY`, HP, `iron_golem`, or `elite_patrol`.

#### BOSS — profile `boss_large`

Bosses already render larger via a **dedicated 8×12 pattern + fixed 1.4 scale**, not a stretched 8×8 enemy.

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) |
| `RECOMMENDED_HEIGHT` | **50** | ceil(12 × 3 × 1.4) |
| `MAX_WIDTH` | **80** | tile width; do not span two columns |
| `MAX_HEIGHT` | **72** | above current 50.4; labels/icons/damage floats will clip — preview must warn |
| `ANCHOR` | center / draw point (same as now) | `drawCombatant` boss branch |
| `DEFAULT_SCALE` | **1** on the recommended bitmap | Do **not** apply 1.4 on top of a 34×50 upload. If the owner uploads a 24×36 “pixel-match” sheet, the boss profile may apply 1.4 to match today’s look. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 64 × 72 | still one tile occupancy |
| `ANIMATION_SUPPORT` | 4 stills optional; v1 may be a single `front` | Bosses spawn `currentView: "front"` (WX 6528) |

Never assign `enemy_standard` art to a boss and scale it up. `family === "boss"` is a **boss** assignment key, not a standard-enemy pool.

#### SUMMON — profile `summon_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| Same box as player/standard | 24 recommended, 80×60 max | 8×8 `creaturePatterns` |
| Extra | Keep owner tint around the **runtime** footprint (bitmap AABB or skip in v1) | `strokeOwnerTint` today uses pattern cells |
| `DEFAULT_SCALE` | **1** | spawn writes no `scaleX/Y` |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | lifespan badge at `(x+18, y−48)` will collide with tall/wide art — warn |

#### FUTURE categories (`#future`)

Portals, walls, loot, death fragments, ads, barrier towers: **ineligible** until a measured profile exists. v1 library is combatant stills only. Enemy Register flavor entries are **not** a category.

### 4.3 Aspect ratio and pixel-count gates

| Check | Rule |
| :--- | :--- |
| Aspect vs recommended | Warn if `|w/h − recW/recH| > 0.15`. Reject only if the owner did not confirm. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` **after** intended scale (prevents 4096² uploads). |
| Decode | `createImageBitmap` / decode must succeed; on failure → reject, builtin fallback if already assigned. |
| MIME | Trust decoded type, not the extension. |
| Distortion | If the owner insists on a non-matching size, draw **unscaled** (or integer nearest-neighbor) inside the profile box with **transparent pad**. Never `drawImage` stretch to fill. |
| URL stubs | `adminGuard` URL checks are **not** this gate. Do not treat a passing URL as a valid asset. `file:` / `data:` / `javascript:` / `vbscript:` stay forbidden. |

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

Backend-authoritative (`localStorage` cache only). Suggested Motoko / TS record:

| Field | Type | Notes |
| :--- | :--- | :--- |
| `ASSET_ID` | Text | Stable id. Never reuse after delete. |
| `DISPLAY_NAME` | Text | Owner rename. |
| `ENTITY_CATEGORY` | variant | `#player` `#enemyStandard` `#enemyElite` `#boss` `#summon` `#future(Text)` |
| `ENTITY_FAMILY` | [Text] | Empty = any family. Else `EnemyFamily` / `boss` / summon pieceType. |
| `ENTITY_IDS` | [Text] | Explicit binds: `player`, `boss_3`, summon `pieceType`, future ids. Empty = pool-only. |
| `VARIANT_TAGS` | [Text] | Owner tags. Matching is explicit, never name heuristics (`assignedName`, Enemy Register titles). |
| `ACTIVE` | Bool | Inactive assets are invisible to resolver. |
| `WEIGHT` | Nat | Pool weight. 0 = never randomly selected (direct assign only). |
| `RARITY` | Text | Display/filter only. Does not change combat. |
| `ELITE_ONLY` | Bool | Eligible only if instance is marked elite (future). If no elite flag exists, ineligible for random pools. |
| `BOSS_ONLY` | Bool | Eligible only for `isBoss` / `id.startsWith("boss_")` / `family === "boss"`. |
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

**World-pack bind cannot live only on `EnemyConfig.spriteUrl`.** `generateEnemies` never reads admin enemy templates. Assignments must key off instance fields the spawn path already writes: `pieceType`, `family` (including `"boss"` and family-variant keys), `id` prefix (`boss_`), `isSummon` / summon `pieceType`, `isBossMinion` when present, and a future elite flag.

Do **not** attach assignment to Enemy Register names (`enemyRegisterCopy.ts` — flavor lore, not the spawn roster).

---

## 6. Owner operations

All `#admin` only. Players never see this UI.

Display the category upload spec **before** the file picker.

| Operation | Behavior |
| :--- | :--- |
| **Upload** | Show category spec → pick files (1–4 directions) → validate → store source + metadata `ACTIVE=false` until owner activates. |
| **Preview** | Iso diamond **80×40 and 140×70**, draw point +9, player 24×24 pixel dummy, one standard enemy dummy, optional boss dummy, drop-shadow foot, name/badge/damage-float overlays. Actual scale. Warn clip / pad / overlap / **phone Continue zoom**. |
| **Activate / deactivate** | Toggle `ACTIVE`. Deactivate → live instances with that id fall back **next frame** (resolver), no re-roll. |
| **Rename** | `DISPLAY_NAME` only. |
| **Replace / version** | New bytes, `VERSION++`, keep `ASSET_ID`. Live binds keep the id; runtime reloads blob. |
| **Safe removal** | Dependency inspect first. If any assignment or live instance id matches: block hard-delete, offer deactivate. |
| **Assign to entity / family / pool** | Priority 1 / family / weighted. Pool resolved **once at spawn**. |
| **Weighted random** | `seededRng(hash(instanceId, poolId, poolVersion))` then walk cumulative weights. Do not wait for a missing encounter seed. |
| **Revert to default** | Clear assignment / `visualAssetId`. Builtin immediately. |
| **Dependency inspection** | List assignments, spawn templates, and (best-effort) live instance ids using the asset. |

Existing URL rows may later be imported as **inactive** library records (`VAL-2026-08-31-012`). Import never auto-activates. Empty `spriteUrl` / `[]` is not a custom asset (`adminContract.test.ts`, `adminVisualStatus.test.ts`).

---

## 7. Implementation placement

Per `AGENTS.md` and `VAL-2026-08-31-017`:

- New logic: `src/frontend/src/engine/visualAssets.ts` (+ tests) and optionally `visualPreview.ts`.
- Pixel tables already live in `engine/enemyPixelPatterns.ts`; spawn squash/family stats in `engine/spawnPolicy.ts` — **do not move them back into WX** and do not dump the resolver into WX.
- `DrawCombatantOptions`: add an optional custom-visual hook; default omitted = today’s fillRect path. Summon tint is a **separate** optional outline around the runtime AABB.
- WorldExploration: **wiring only** — pass `visualAssetId` into `drawCombatant` / player site. **Do not** edit the RAF loop, map generation, turn logic, or damage math.
- Motoko metadata + blob refs: `adminGuard` + `#admin` only. Bytes in object storage, not Candid `Text`. New persistent maps = **new later** chain file after `20260901`.
- Tests: empty library `[]` → `{ kind: "builtin" }`; inactive/corrupt id → builtin; 100 fake renders same `visualAssetId`; occupancy/`drawSize` ignore bitmap size; `ELITE_ONLY` never selected without an elite flag.

---

## 8. Risk register

| Risk | Mitigation |
| :--- | :--- |
| Random flicker | Bind at spawn; tests: 100 fake renders same `visualAssetId` |
| Stretching enemy art onto bosses | Separate `boss_large` profile; never `scale(1.4)` a 24×24 upload onto a boss |
| Occupancy / click box from pixels | Keep `drawSize` tile-derived; occupancy one cell |
| Stale `spriteUrl` wired by mistake | VAL-012 + implemented VAL-2026-09-01-001; still do not `drawImage(spriteUrl)` |
| Family owners expect family pixels | Today family art is **ghost/minion only**. Custom family assign is new presentation (VAL-013). Upload spec stays 24×24 chess, not 6×5 iron_golem |
| WX minion path vs `useBossSystem` | Key off `isBossMinion` / `isBoss` / id prefix, never `assignedName === "Minion"` |
| Phone art looks “too small” | Match builtin: do not apply `MOBILE_ZOOM` or `dpr` to bitmaps by default; preview the 140×70 tile |
| Walk-frame UI → hunter adds GIF atlas | Honesty copy + VAL-018 stills-only |
| Ad “Custom Visual” “fixed” by removing landing imgs | Ads already render; leave that copy |
| Enemy Register treated as roster | Flavor lore only (`enemyRegisterCopy.ts`) |
| Resolver dumped into 19k-line WX | Follow `enemyPixelPatterns.ts` / `spawnPolicy.ts` extraction |
| New Motoko maps on frozen chain files | Later file after `20260901`; never amend `20260831` / `20260901` `NewActor` |
| `CharacterStats` field creep | Do not add visual ids to the 12-field persist path |
| `strokeOwnerTint` on PNG | AABB of the bitmap or skip; do not pass ImageBitmap into `drawPattern` |
| Shadow “doesn’t match” tall PNG | Keep ellipse tile-derived; preview-warn |

---

## 9. What this run did not do

- No production / gameplay code changes.
- No `drawImage` wiring.
- No Motoko library types / no new migration file.
- Did not re-issue `VAL-2026-08-31-*`, `VAL-2026-09-01-*`, or `VAL-2026-09-02-*` as new implementation work.
- Did not edit `README.md` (open PR #333 already touches it).
- Did not treat open PRs #327 / #331 as visual-library vehicles.
