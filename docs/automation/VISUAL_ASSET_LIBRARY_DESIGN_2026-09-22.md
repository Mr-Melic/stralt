# Custom Visual Asset Library & Assignment — 2026-09-22 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-22  
**HEAD:** `0f5363f` (`Merge pull request #332`) — identical SHA to the 2026-09-21 inspection  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (merged PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md). The 2026-09-21 design lives only on open draft PR [#355](https://github.com/Mr-Melic/stralt/pull/355) (`cursor/custom-visual-assets-system-867f`) and is **not** on `main`.  
**Prior ACTION_IDs:** `VAL-2026-08-31-001` … `019`; `VAL-2026-09-01-001` … `011`; `VAL-2026-09-02-001` … `012`; `VAL-2026-09-21-001` … `014` (PR #355, unmerged).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-22.md`](./ACTION_IDS_VAL_2026-09-22.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer. Invented sprite boxes (64×64, 128×128) are not used. Pixel cell size did not change. This run **corrects** the 09-21 boss visual identity: the 8×12 tables are wired, but the live Enemy object almost never enters that branch.

---

## 0. Verdict

| Question | 2026-09-22 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (comment only in `adminVisualStatus.ts` 5). `imageSmoothingEnabled` is never set. |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never reads them. |
| Did recommended cell size change? | **No.** Tile 80×40, cell 3px, standard 8×8 → 24×24. |
| What actually paints for portal bosses? | Chess `pieceType` **8×8 × 3 × 1.4 ≈ 33.6×33.6**. The 8×12 tables (`enemyPixelPatterns.ts`) + `getBossPattern` injection are **dead on the live Enemy**: `drawCombatant` branch 1 requires `isBoss && bossId` (`pieceArt.ts` 856) and portal spawn (`WorldExploration.tsx` 6522–6569) sets **neither**. Scale 1.4 is real. |
| What actually paints for Boss Rush “bosses”? | `isBoss: true`, **no** `bossId`, **no** `scaleX/Y`, `id` `boss-rush-*`, `pieceType` = lore name (“Pale Archbishop”). Branch 1 fails; unknown pieceType → **`king.front` 24×24** (`pieceArt.ts` 1006–1018). |
| Did `main` change since 09-21? | **No.** Same `0f5363f`. PR #355 (09-21 docs) is still draft / unmerged. This run adds new files; it does not re-issue 09-21 IDs. |
| Can phones enter combat? | **Yes.** Continue + `pbv_small_screen_continue`. `MOBILE_ZOOM` 1.75 tiles only; pixels stay 3px. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind, and WorldExploration does not load `getEnemyConfigs` / `getPlayerSpriteConfigs`.

Do **not** “fix” `drawCombatant` to treat `id.startsWith("boss_")` or `family === "boss"` as the 8×12 branch as part of this library. That would change live portal pixels (8×8×1.4 → 8×12×1.4) and is outside VAL scope.

---

## 1. Delta vs 2026-09-21

HEAD is unchanged (`0f5363f`). Citations below were re-read. **New correctness**, not new pixels:

| Topic | 2026-09-21 claimed | 2026-09-22 measured |
| :--- | :--- | :--- |
| Boss drawn size | 8×12 × 3 × 1.4 ≈ 34×50 as if live | **Intended path** still 8×12 × 1.4. **Live portal Enemy** is 8×8 × 1.4 because `isBoss`/`bossId` are written on **turn-order** `CombatantEntry` (WX 11958–11983), not on the Enemy `drawCombatant` receives. |
| `VAL-2026-09-21-007` gates | `isBoss` / `id.startsWith("boss_")` / `family === "boss"` | **Too broad / inverted.** `isBoss: true` is set on **Boss Rush** objects that do **not** use 8×12. Portal objects have `id` `boss_*` + scale 1.4 + `family: "boss"` and **lack** `isBoss`. `family === "boss"` is on **both**. |
| Sprite hit box | `drawSize` 80×60 cited as the hit box | `hitTestSprite` uses `entry.x/y/w/h` (WX 8901–8906). Desktop **w = 80**, **h = 41** (`th/2 + CHARACTER_Y_OFFSET + (th*1.5)/2` = 20 − 9 + 30). `drawSize` 80×60 is stored (8103) and is **not** the tested height. |
| `imageSmoothingEnabled` | not called out | **Never set** in `src/`. Canvas 2D default is smoothing **on**. `fillRect` cells are immune; `drawImage` of a 24×24 PNG would blur unless the custom branch sets it **false** locally. |
| `drawPixelPattern` canvas stack | not called out | Trailing `ctx.restore()` (WX 3883) with **no** matching `save` in the function. Moving-enemy path `save`s (8058) then `drawCombatant` then `restore`s (8076). A custom top branch that skips `drawPattern` changes stack depth. **Do not fix the pairing in the rAF loop.** |
| Decode path | blob storage recommended | Bindgen already has `ExternalBlob` (`backend.ts` 54–55) for other Candid files. Sprite fields remain `?Text`. Shop proofs are `data:` cap 524_288 — **different surface**. Hosted `https` `drawImage` without CORS taints the world canvas. |
| Boss Rush `pieceType` | not separated | `roomDef.boss1Name` e.g. `"Pale Archbishop"` (WX 5327; `useBossRush.ts` 29). Not a `ChessPieceType`. |
| Wall height citation | barrierRender comment “WX line 3273” | Live `wallHeight = 28` is WX **4085**. Barriers stay **out of v1**. |
| 09-21 docs on main | assumed a prior run | **Not on main.** Unique filenames this run: `VISUAL_ASSET_LIBRARY_DESIGN_2026-09-22.md`, `ACTION_IDS_VAL_2026-09-22.md`. No `README.md`. |

Unchanged from 09-21 (re-verified):

- WX **19213** lines; `spawnPolicy.ts` **297**; `enemyPixelPatterns.ts` **522**; `pieceArt.ts` **1061**.
- Tile 80×40, offset −9, cell 3px, `MOBILE_ZOOM` 1.75, Continue-on-phone.
- Zero `drawImage` / `createImageBitmap`.
- `VAL-2026-09-01-001` copy honesty still live (`adminVisualStatus.ts`; EnemyEditor 817–838).
- Family 30% is stats only (`applyFamilyVariantsToRoster` `spawnPolicy.ts` 289–297).
- No `isElite`. No encounter seed. No `engine/visualAssets.ts`.
- Occupancy one tile (`occupancy.ts`). Visual size ≠ gameplay footprint.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Ends with `ctx.restore()` (**no** `save` in the function) |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782). **No** trailing restore |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023. Branch 1: `isBoss && bossId` (856) |
| `engine/enemyPixelPatterns.ts` | Boss 8×12 tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12`; family 434–498 |
| WX player | `getPersistedPiecePattern(pieceType, playerView)` | 8289, 8315–8326 — **not** `drawCombatant` |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3724, 18111–18116 |
| Character creation | 8×8 × `scale = 10` → **80×80** art on a **320×280** canvas (CSS 240×210) | `CharacterCreation.tsx` 151–178, 452–462 |
| Character selection | `pixelSize = floor(internalSize / 10)` with `size = 120`, internal 240 → **24px cells / 192×192 art** | `CharacterSelection.tsx` 313–333 |
| Death juice | `fillRect` fragments | `engine/effects.ts` 282–292 |
| Barrier towers | iso wall stack, **not** a combatant | `engine/barrierRender.ts` 14–16, `BARRIER_LAYER_HEIGHT = 28`; WX wall `wallHeight = 28` at **4085** |

`Character.pixelPattern` is persisted at creation (`CharacterCreation.tsx` 273) and **never read** by WorldExploration (zero `pixelPattern` matches in WX). The world player always uses chess-piece tables via `getPersistedPiecePattern`.

Repo-wide: no `ctx.drawImage`, no `createImageBitmap`, no `imageSmoothingEnabled`. There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects `getBossPattern`, `getFamilyPattern`, `getFamilyColors`, `drawPattern`, `characterYOffset`. It does **not** accept a bitmap. A custom path must be a new optional **top** branch, not `drawImage` inside `drawPixelPattern` (that function only `fillRect`s cells). Putting a PNG through `drawPattern` would interpret bytes as a cell grid.

`strokeOwnerTint` (`pieceArt.ts` 791–811, summon branch 923–926) strokes the **pattern AABB** (3px × cells × scale). A custom bitmap cannot reuse that function as-is.

### 2.2 Two boss shapes — do not merge them

| Shape | Spawn | Flags on **Enemy** | Live draw | Intended 8×12 path? |
| :--- | :--- | :--- | :--- | :--- |
| **Portal boss** | WX 6522–6569 `id: boss_${bossConf.id}_${Date.now()}`, `scaleX/Y: 1.4`, `family: "boss"`, chess `pieceType` | **No** `isBoss`, **no** `bossId` | `drawCombatant` skips branch 1; chess 8×8 × 3 × **1.4 ≈ 33.6×33.6** | Tables + injection exist; flags live on **turn-order** only (11958–11983: `id.startsWith("boss_")`) |
| **Boss Rush unit** | WX 5326–5371 `id: boss-rush-${room}-${n}`, `isBoss: true`, `family: "boss"`, `pieceType: roomDef.boss1Name` (“Pale Archbishop”) | `isBoss` true, **no** `bossId`, **no** scale | Branch 1 fails (`bossId` missing); unknown pieceType → **king.front 24×24** | No. `boss-rush-`.startsWith(`boss_`) is **false** (hyphen vs underscore) |
| **8×12 tables** | `getBossPixelPattern(bossId)` | N/A | Only if Enemy has `isBoss && bossId` | Built, injected, **not entered** by current spawn objects |

Battle AI uses `turnOrderRef` `isBoss` (WX 15358–15368), which **is** set for portal fights. Rendering uses the Enemy. Assignment must follow the **draw** object, not the turn-order flag.

`VAL-2026-09-21-007` is **superseded for visual gates** by `VAL-2026-09-22-002`. Gameplay/AI may still use `id.startsWith("boss_")` on turn-order; that is not a render profile.

### 2.3 Unused URL stubs — still not a library

| Store | Fields | Who reads in combat |
| :--- | :--- | :--- |
| Motoko `EnemyConfig` | `spriteUrl : ?Text` (`admin.mo` 25) | **Nobody in WX** |
| Motoko `PlayerSpriteConfig` | `frontUrl` / `rightUrl` / `leftUrl` / `backUrl` + four `walkFrames*` arrays (`admin.mo` 39+) | **Nobody in WX**. Admin copy says catalog only (`AdminDashboard.tsx` 1784) |
| Admin enemy editor | URL paste + honesty (`ENEMY_SPRITE_URL_*` in `adminVisualStatus.ts`) | Stored, not rendered (817–838) |
| Admin sprite editor | 72×72 `<img object-fit:contain>` (`AdminDashboard.tsx` 1484–1507), `imageRendering: pixelated` on the **img**, not on the world canvas | Preview of the URL string only |
| Caffeine `ExternalBlob` | Bindgen `_uploadFile` / `_downloadFile` | Used for other file-shaped Candid fields. Sprite fields remain **Text URLs**, not blobs |
| Shop `proofFileUrl` | `data:` image/pdf/octet-stream, cap **524_288** (`adminGuard.mo` 118–131) | **Different surface.** Do not reuse as combat art |
| Landing ads | `imageUrl` → `<img>` (`LandingPage.tsx` ~750) | **Does render.** Not combat. Copy “Custom Visual — override URLs set” (`AdminDashboard.tsx` 8221) is true **for ads** |

`adminGuard.validateOptionalUrl` (`adminGuard.mo` 143–148) + frontend `adminSafety.ts` 84–91: empty OK, `MAX_URL = 2048`, `unsafeUrl` (`javascript:` / `data:` / `vbscript:` / **`file:`**). **No MIME, decode, width/height, aspect, pixel count, alpha, or render-safe bounds.** Walk-frame cap is 16 **strings**, not frames drawn.

`requireHttpsUrl` (`adminGuard.mo` 97–104) applies to **ads**, not sprite stubs. A passing `adminSetEnemyConfig` URL is not `VALIDATION_STATUS = #ok`.

### 2.4 Entity categories that actually exist

| Prompt category | Live identity | Default visual |
| :--- | :--- | :--- |
| PLAYER CHARACTER | `character.pieceType` (chess), `playerView` four stills (WX 11490–11493) | 8×8 chess × 3px = 24×24 @ scale 1 |
| STANDARD ENEMY | `pieceType` + optional `family` after 30% roll | **Chess 8×8** even when `family !== "default"` |
| ELITE / LARGE ENEMY | **Does not exist** | `generateEnemyScaleFactors` is visual squash only (`spawnPolicy.ts` 227–255); `iron_golem` is HP paper; `elite_patrol` is a world-feature catalog key |
| BOSS (portal) | `id.startsWith("boss_")`, `family: "boss"`, scale **1.4**, chess `pieceType` | **Live:** 8×8 × 1.4. **Tables:** 8×12 × 1.4 if `isBoss && bossId` ever land on the Enemy |
| BOSS (Rush roster) | `id` `boss-rush-*`, `isBoss: true`, lore `pieceType` | **king.front 24×24**. Not `boss_large` |
| SUMMON | `isSummon`, `pieceType` in `creaturePatterns` (wolf/golem/archer/bomber/wisp), `side` | 8×8 creature × 3px + owner tint. **No `scaleX/Y` on spawn** (`summonSpawn.ts` 163–188) → draw defaults `{1,1}` |
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

### 2.5 Occupancy and hit-testing — visual size ≠ gameplay footprint

`engine/occupancy.ts` `isCellFree`: one combatant per **tile**. No pixel, scale, or image-size input.

WX `spriteRectsRef` (8086–8104 / 8335–8352):

| Field | Desktop | Mobile-zoom (tiles 140×70) |
| :--- | ---: | ---: |
| `drawSize` | 80 × 60 | 140 × 105 |
| tested `w` | **80** | **140** |
| tested `h` | **41** (`40/2 + (-9) + 60/2`) | **78.5** (`70/2 + (-9) + 105/2`) |
| `drawAnchor` | pattern center (tile top + 9) | same |

`hitTestSprite` (8876–8916) pads **10px** mouse (10127) / **14px** touch (10819) around `x,y,w,h`, **not** `drawSize`. Click-miss must **not** be “fixed” by growing occupancy, `drawSize`, tested `h`, or padding from a bitmap.

Targeting (`engine/targeting.ts`) is tile/LoS. Range, collision, movement, and hitbox stay tile-derived.

### 2.6 Stable identity for assignment (no encounter seed)

There is still **no map encounter seed**. Do not block the library on inventing one.

| Instance | Id / RNG | Stable after spawn? |
| :--- | :--- | :--- |
| Pack enemy | `enemy-${n}-${Date.now()}` (WX 5809) | Yes, on the live object. `Date.now()` is unique enough for a bind key **after** push |
| Portal boss | `boss_${id}_${Date.now()}` (WX 6524) | Yes on the live object. Category key: `id.startsWith("boss_")` **and** `scaleX === 1.4`. Do **not** use Enemy.`isBoss` (unset) |
| Boss Rush unit | `boss-rush-${room}-${n}` (5326, 5351) | Yes. Treat as **standard-enemy visual** until a dedicated rush profile is measured. Do not name-match `"Pale Archbishop"` |
| Player summon | `summon-${Math.random().toString(36).slice(2)}` (`summonSpawn.ts` 153) | Yes on the live object; **do not re-call `Math.random` in render** |
| Enemy summon | same helper (`spawnEnemySummonUnit` 254–284) | Same |
| Stats seed | `getEnemyBaseStats` charCode-sum `seedKey` + `seededRng` (`combatMath.ts` 122–127; `progression.ts` 163–170) | Already deterministic per id string |

**Bind `visualAssetId` once at spawn / summon / boss portal / minion add.** Weighted pick: `seededRng(hash(instanceId, poolId, poolVersion))`, walk cumulative weights of **active + `#ok` + eligible** assets. If none qualify → leave id unset → builtin.

If a bound id later fails validation: **fall back to builtin; do not re-roll in rAF or React render.** `turnsRemaining` decrement must not re-pick.

`generateEnemyScaleFactors` uses `Math.random` at spawn and **stores** `scaleX/Y`. That squash applies to **fillRect cells only**. Custom bitmaps use `DEFAULT_SCALE = 1` and must not inherit it. Portal boss 1.4 is a **fixed** spawn scale, not this random function.

### 2.7 Owner / admin gate

There is **no** distinct `#owner` role. AccessControl is `#admin` | `#user`. First non-anonymous Internet Identity caller becomes admin (`main.mo` 712–739). `App.tsx` 291: `isAdmin = userRole === "admin"`. Admin dashboard returns early at `AdminDashboard.tsx` 5546.

**Owner-only** for this library means: **the same `#admin` catalog gate as `adminSetEnemyConfig` / `adminSetPlayerSpriteConfig`.** Players never see the UI. Do not invent a second principal type.

### 2.8 Mobile / tablet — Continue is live

- `SmallScreenGuard` **warns**; **Continue anyway** (`App.tsx` 25–44, 107–124, 396–414).
- Bypass in `sessionStorage` `pbv_small_screen_continue`.
- `useIsMobile(breakpoint = 768)` (`hooks/use-mobile.tsx` 17–26) → WX `MOBILE_ZOOM = 1.75` (874, 957–959) → tiles **140×70**.
- Desktop camera lock: `innerWidth > 1024` (WX 877).
- **Pixel patterns do not multiply by `MOBILE_ZOOM`.** Builtin 24×24 is relatively smaller on zoomed tiles.
- Canvas backing store is `css * dpr` then `ctx.scale(dpr)` (7200–7264, 13953–13965). **Logical CSS pixels** are the draw unit. Do not multiply bitmaps by `devicePixelRatio`.

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
- New `BossConfig` / `EnemyConfig` / summon `pieceType` / Boss Rush room automatically works with generated pixels.
- Failures log once (reuse `logPatternLookupFailed`), never throw, never block combat.
- Do **not** store `visualAssetId` on `CharacterStats` (12 required fields). Instance field on `Enemy` / a player-world ref is enough.
- Persisting library **metadata maps** on the canister is a **new later** migration file after `20260901_000000` (`OldActor = {}`). `check-limit` is currently **5**. Never edit a frozen `NewActor`.

```ts
// src/frontend/src/engine/visualAssets.ts  (not implemented)
function resolveRuntimeVisual(entity, library): RuntimeVisual
  // { kind: "custom", bitmap, profile } | { kind: "builtin" }
```

`drawCombatant` may grow **one optional branch at the top**: if resolve returns a decoded bitmap + profile, `drawImage` at the same anchor as `drawPixelPattern`; otherwise branches 1–4 run unchanged. Player needs a **second** one-line site (WX 8315). Empty library / omitted option ⇒ **identity** with today.

If the custom branch skips `options.drawPattern`:

- It must **not** change canvas stack depth vs builtin for that combatant **or** document that moving-enemy glow (`save` 8058 / outer `restore` 8076) will differ.
- It must **not** call `strokeOwnerTint` with a bitmap.
- It should `save` / set `imageSmoothingEnabled = false` / `drawImage` / `restore` locally.

Do **not** edit the RAF loop, map generation, turn logic, or damage math to “enable” art.

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
| Boss **tables** | **8×12 cells** | | `enemyPixelPatterns.ts` 10–24 |
| Boss tables @ 1.0 | **24 × 36** | | 8×3 × 12×3 |
| Portal boss spawn scale | **1.4 × 1.4** (not random) | | WX 6535–6536 |
| Portal boss **live** drawn | **33.6 × 33.6** | | 8×8 chess × 1.4 (branch 1 not entered) |
| Boss tables @ 1.4 (if flags present) | **33.6 × 50.4** | | intended `boss_large` box |
| Rush unit **live** drawn | **24 × 24** | | king.front @ scale 1 |
| Portrait | 60×60 canvas, 6px cells → 48×48 art | | 3720, 18111–18116 |
| Creation preview | 80×80 pattern on 320×280 canvas | | `CharacterCreation.tsx` 151, 452–455 |
| Selection preview | 192×192 on 240 internal | | `CharacterSelection.tsx` 313, 333 |
| Name label | `screenPos.y − 34` | | 8122 |
| Level label | name + 14 | | 8123 |
| Status icons | draw point − 30 | | 8246, 8362 |
| Summon lifespan badge | `(x + 18, y − 48)` | | 8146–8147 |
| Attack damage float | `y − 44` / scaled label `y − 58` | | 8206–8214 |
| Sprite `drawSize` (stored) | 80 × 60 | 140 × 105 | 8103, 8352 |
| Sprite hit `h` (tested) | **41** | **78.5** | formula in §2.5 |
| Hit padding | 10 mouse / 14 touch | same px | 10127 / 10819 |
| Wall / barrier extrusion | 28 px per layer | | `barrierRender.ts` 15; WX **4085** |
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
| `MAX_FILE_SIZE` | **Not measured in-repo as a visual cap.** `MAX_URL = 2048` is URL text. Shop proof cap 524_288 is a **different** surface. | Starting reject: **256 KiB per still** after encode until IC ingress / object-store limits are measured. Do not store raw base64 in Motoko `Text`. Do not use `data:` or `file:` URLs. Decode from `Blob` / `ExternalBlob`, not a cross-origin `https` paint. |

#### PLAYER CHARACTER — profile `player_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **24** (or **48** @2× source) | 8×8 × 3 |
| `RECOMMENDED_HEIGHT` | **24** (or **48** @2×) | same |
| `MAX_WIDTH` | **80** | `TILE_WIDTH`; wider overlaps neighbor diamonds (half-width 40) |
| `MAX_HEIGHT` | **60** | stored `drawSize.h` desktop — **warn at 41** (tested hit `h`) |
| `ANCHOR` | center on draw point (tile top + 9) | `drawPixelPattern` |
| `DEFAULT_SCALE` | **1** | player draw omits scale (defaults `{1,1}`) |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | 2× default; still inside 80×60 stored box; labels at y−34 stay clear of a 24-tall sprite |

Portrait HUD and character-creation/selection canvases stay generated pixels in v1.

Admin sprite `characterPieceType === "custom"` is **not** a live `ChessPieceType` (`gameTypes.ts` 5–11). World falls back to `king`. Import as inactive + `#invalid` until the owner picks `player_standard` and a real piece id.

#### STANDARD ENEMY — profile `enemy_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | chess 8×8 × 3 — **not** family grids |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile + stored hit box; warn if taller than tested **41** |
| `ANCHOR` | center / draw point | `drawCombatant` |
| `DEFAULT_SCALE` | **1** | Custom art must **not** inherit random 0.6–1.4 squash. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | |

Assignment keys: `pieceType` and/or `family` **string** written by `applyEnemyFamilyStats`. Visual remains chess until a custom bind exists. **Also the live visual for Boss Rush roster units** until a measured rush profile exists.

#### ELITE / LARGE ENEMY — profile `enemy_elite` (future category)

No elite type exists. Do **not** invent gameplay size. If metadata `ELITE_ONLY` is used:

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **34** | ceil(24 × 1.4) — current max instance scale |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | same tile/hit box as standard — **visual only** |
| `DEFAULT_SCALE` | **1** on a 34×34 recommended asset | Do not also multiply by 1.4 |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 56 × 56 | under tile width; warn if &gt; 48 |

Occupancy stays **one tile**. Until an explicit elite flag exists, `ELITE_ONLY` assets are **ineligible** for random pools. Do not infer elite from `scaleY`, HP, `iron_golem`, `elite_patrol`, or Boss Rush `isBoss`.

#### BOSS — profile `boss_large`

Bosses may render larger than standard enemies **where the dedicated path actually runs**. Do not stretch `enemy_standard` art onto a portal id.

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) — matches **both** live portal chess×1.4 width **and** the 8×12 table width |
| `RECOMMENDED_HEIGHT` | **34** for art that must match **today’s portal paint**; **50** if the owner opts into the **table** box (8×12 × 1.4) | Live portal = 8×8×1.4 tall. Tables = 8×12×1.4 tall. Preview must label which box is selected. **Never silently pick 50 and draw it on a unit that currently paints 34 tall.** |
| `MAX_WIDTH` | **80** | tile width; do not span two columns |
| `MAX_HEIGHT` | **72** | above table 50.4; labels/icons/damage floats will clip — preview must warn |
| `ANCHOR` | center / draw point (same as now) | `drawCombatant` |
| `DEFAULT_SCALE` | **1** on the recommended bitmap | Do **not** apply 1.4 on top of a 34×34 or 34×50 upload. Builtin portal chess **does** use instance 1.4. |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 64 × 72 | still one tile occupancy |
| `ANIMATION_SUPPORT` | 4 stills optional; v1 may be a single `front` | Portal bosses spawn `currentView: "front"` (WX 6528) |
| Eligible instances | `id.startsWith("boss_")` **and not** `id.startsWith("boss-rush")` | Do **not** use Enemy.`isBoss` or `family === "boss"` alone (`VAL-2026-09-22-002`) |

Never assign `enemy_standard` art to a portal `boss_*` and scale it up as a substitute for this profile. Never assign `boss_large` to `boss-rush-*`.

#### SUMMON — profile `summon_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| Same box as player/standard | 24 recommended, 80×60 max | 8×8 `creaturePatterns` |
| Extra | Keep owner tint around the **runtime** footprint (bitmap AABB or skip in v1) | `strokeOwnerTint` today uses pattern cells |
| `DEFAULT_SCALE` | **1** | spawn writes no `scaleX/Y` |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | lifespan badge at `(x+18, y−48)` will collide with tall/wide art — warn |

#### FUTURE categories (`#future`)

Portals, walls, loot, death fragments, ads, barrier towers, Enemy Register lore titles: **ineligible** until a measured profile exists. v1 library is combatant stills only.

### 4.3 Aspect ratio and pixel-count gates

| Check | Rule |
| :--- | :--- |
| Aspect vs recommended | Warn if `\|w/h − recW/recH\| > 0.15`. Reject only if the owner did not confirm. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` **after** intended scale (prevents 4096² uploads). |
| Decode | `createImageBitmap` / decode must succeed **from a Blob**; on failure → reject, builtin fallback if already assigned. |
| MIME | Trust decoded type, not the extension. |
| Distortion | If the owner insists on a non-matching size, draw **unscaled** (or integer nearest-neighbor) inside the profile box with **transparent pad**. Never `drawImage` stretch to fill. |
| Smoothing | Custom `drawImage` wrapped in `save` + `imageSmoothingEnabled = false` + `restore`. Do not set this on the world ctx for `fillRect`. |
| URL stubs | `adminGuard` URL checks are **not** this gate. `file:` / `data:` / `javascript:` / `vbscript:` stay forbidden. Cross-origin `https` paint is not `#ok`. |
| Lifetime | `ImageBitmap.close()` and `URL.revokeObjectURL` on replace, deactivate, and fallback. |

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
| `ENTITY_FAMILY` | [Text] | Empty = any family. Else `EnemyFamily` / summon pieceType. **Do not** treat `"boss"` as a family pool that includes Rush. |
| `ENTITY_IDS` | [Text] | Explicit binds: `player`, `boss_3` (catalog id, not `boss-rush-0-0`), summon `pieceType`. Empty = pool-only. |
| `VARIANT_TAGS` | [Text] | Owner tags. Matching is explicit, never name heuristics (`assignedName`, Enemy Register titles, Rush `boss1Name`). |
| `ACTIVE` | Bool | Inactive assets are invisible to resolver. |
| `WEIGHT` | Nat | Pool weight. 0 = never randomly selected (direct assign only). |
| `RARITY` | Text | Display/filter only. Does not change combat. |
| `ELITE_ONLY` | Bool | Eligible only if instance is marked elite (future). If no elite flag exists, ineligible for random pools. |
| `BOSS_ONLY` | Bool | Eligible only for portal `id.startsWith("boss_")` (not `boss-rush-`). **Not** Enemy.`isBoss`. |
| `UPLOAD_DATE` | Nat | Timestamp. |
| `VERSION` | Nat | Increments on replace. |
| `SOURCE_METADATA` | record | hash, MIME, original w/h, byte length, uploader principal. |
| `RENDER_PROFILE` | Text | `player_standard` / `enemy_standard` / `enemy_elite` / `boss_large` / `summon_standard`. |
| `VALIDATION_STATUS` | variant | `#ok` `#pending` `#invalid(Text)` |
| `BLOB_REF` | opt | Caffeine object id. Prefer blob. Legacy URL import stays inactive. |
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

**World-pack bind cannot live only on `EnemyConfig.spriteUrl`.** `generateEnemies` never reads admin enemy templates. Assignments must key off instance fields the spawn path already writes.

Do **not** attach assignment to Enemy Register names (`enemyRegisterCopy.ts` — flavor lore, not the spawn roster) or Rush `boss1Name` strings.

---

## 6. Owner operations

All `#admin` only. Players never see this UI.

Display the category upload spec **before** the file picker.

| Operation | Behavior |
| :--- | :--- |
| **Upload** | Show category spec → pick files (1–4 directions) → validate → store source + metadata `ACTIVE=false` until owner activates. |
| **Preview** | Iso diamond **80×40 and 140×70**, draw point +9, player 24×24 pixel dummy, one standard enemy dummy, optional portal-boss dummy at **34×34** (live) and a second pane at **34×50** (table path) clearly labeled “not current portal paint”, drop-shadow foot, name/badge/damage-float overlays, hit rect **80×41**. Actual scale. Warn clip / pad / overlap / **phone Continue zoom**. |
| **Activate / deactivate** | Toggle `ACTIVE`. Deactivate → live instances with that id fall back **next frame** (resolver), no re-roll. Close bitmaps. |
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
- WorldExploration: **wiring only** — pass `visualAssetId` into `drawCombatant` / player site. **Do not** edit the RAF loop, map generation, turn logic, or damage math. **Do not** set `isBoss`/`bossId` on portal Enemies to “make 8×12 true.”
- Motoko metadata + blob refs: `adminGuard` + `#admin` only. Bytes in object storage, not Candid `Text`. New persistent maps = **new later** chain file after `20260901`; bump `check-limit` above 5.
- Tests: empty library `[]` → `{ kind: "builtin" }`; inactive/corrupt id → builtin; 100 fake renders same `visualAssetId`; occupancy/`drawSize`/tested `h` ignore bitmap size; `ELITE_ONLY` never selected without an elite flag; `boss-rush-*` never eligible for `BOSS_ONLY`; `isBoss: true` without `bossId` never eligible for `boss_large`.

---

## 8. Risk register

| Risk | Mitigation |
| :--- | :--- |
| Random flicker | Bind at spawn; tests: 100 fake renders same `visualAssetId` |
| Stretching enemy art onto bosses | Separate `boss_large`; never `scale(1.4)` a 24×24 upload onto a portal id |
| Assigning 50-tall art to live 34-tall portal units | Preview labels live vs table box (`VAL-2026-09-22-002`) |
| Assigning boss art to Rush `isBoss` units | `BOSS_ONLY` requires `boss_*` id prefix, not Enemy.`isBoss` |
| Flipping portal paint to 8×12 by setting flags | Forbidden in VAL (`VAL-2026-09-22-003`) |
| Occupancy / click box from pixels | Keep tested `h` and `drawSize` tile-derived; occupancy one cell |
| Stale `spriteUrl` wired by mistake | VAL-012 + implemented VAL-2026-09-01-001; still do not `drawImage(spriteUrl)` |
| CORS-tainted world canvas | Blob + `createImageBitmap`; no cross-origin paint |
| Blurry custom pixels | Local `imageSmoothingEnabled = false` |
| Canvas stack mismatch vs trailing restore | Custom branch local save/restore; do not fix WX 3883 in rAF |
| Family owners expect family pixels | Today family art is **ghost/minion only** |
| Phone art looks “too small” | Match builtin: do not apply `MOBILE_ZOOM` or `dpr` to bitmaps |
| Walk-frame UI → hunter adds GIF atlas | Honesty copy + VAL-018 stills-only |
| Ad “Custom Visual” “fixed” by removing landing imgs | Ads already render; leave that copy |
| Enemy Register treated as roster | Flavor lore only |
| Resolver dumped into 19k-line WX | Follow `enemyPixelPatterns.ts` / `spawnPolicy.ts` extraction |
| New Motoko maps on frozen chain files | Later file after `20260901`; never amend `20260831` / `20260901` `NewActor` |
| `CharacterStats` field creep | Do not add visual ids to the 12-field persist path |
| Bitmap / object-URL leaks | `close()` / `revokeObjectURL` on replace and fallback |
| Shadow “doesn’t match” tall PNG | Keep ellipse tile-derived; preview-warn |

---

## 9. What this run did not do

- No production / gameplay code changes.
- No `drawImage` wiring.
- No Motoko library types / no new migration file.
- Did not re-issue `VAL-2026-08-31-*`, `VAL-2026-09-01-*`, `VAL-2026-09-02-*`, or `VAL-2026-09-21-*` as new implementation work.
- Did not edit `README.md` (older open PRs already touch it).
- Did not treat open PRs #327 / #331 / #355 as vehicles to merge this library into combat.
- Did not set `isBoss`/`bossId` on portal Enemies to activate 8×12 tables.
