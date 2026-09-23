# Custom Visual Asset Library & Assignment — 2026-09-23 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-23  
**HEAD:** `0f5363f` (`Merge pull request #332`) — identical SHA to the 2026-09-21 and 2026-09-22 inspections  
**Source automation:** cron `0 */48 * * *`  
**Gameplay / production code:** not modified.  
**Prior designs on `main`:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-08-31.md) (merged PR #121), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-01.md), [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md).  
**Prior designs not on `main`:** 2026-09-21 lives only on draft PR [#355](https://github.com/Mr-Melic/stralt/pull/355); 2026-09-22 lives only on draft PR [#418](https://github.com/Mr-Melic/stralt/pull/418). This run adds **new dated files**. It does not rewrite those PRs and does not re-issue their ACTION_IDs.  
**Prior ACTION_IDs:** `VAL-2026-08-31-001` … `019`; `VAL-2026-09-01-001` … `011`; `VAL-2026-09-02-001` … `012`; `VAL-2026-09-21-001` … `014` (PR #355); `VAL-2026-09-22-001` … `012` (PR #418).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-23.md`](./ACTION_IDS_VAL_2026-09-23.md)

**Invariant:** custom visuals are optional. The current built-in / generated pixel visual remains default and fallback. An empty library must be indistinguishable from today. New enemies and bosses must work with generated pixels and no uploads. Artwork upload is never mandatory.

This document re-derives every size from the **live** renderer. Invented sprite boxes (64×64, 128×128) are not used. Pixel cell size did not change. Production code did not change. This run **corrects and adds** architecture facts that 09-22 missed or under-stated: where bind must live (`combatantsRef`), the CSS-vs-Canvas2D smoothing split, pointer space, context-clearing resize, and the admin `getEnemyConfigs` hook that is **not** combat.

---

## 0. Verdict

| Question | 2026-09-23 answer |
| :--- | :--- |
| Does a custom visual library exist? | **No.** `engine/visualAssets.ts` / `visualPreview.ts` are absent. `src/` has **zero** `ctx.drawImage` and **zero** `createImageBitmap` (comment only in `adminVisualStatus.ts` 5). `imageSmoothingEnabled` is never set. |
| Empty library == today’s look? | **Yes, by default** — combat never reads custom bytes. |
| Can owners upload and assign art that appears in combat? | **No.** Admin URL stubs persist; WorldExploration never paints them. |
| Did recommended cell size change? | **No.** Tile 80×40, cell 3px, standard 8×8 → 24×24. Portal **live** boss 8×8 × 1.4 ≈ 34×34. Boss **tables** 8×12 × 1.4 ≈ 34×50, unused on the live Enemy. Rush units `king.front` 24×24. |
| Did `main` change since 09-22? | **No.** Same `0f5363f`. PRs #355 and #418 remain draft / unmerged. |
| Can phones enter combat? | **Yes.** Continue + `pbv_small_screen_continue`. `MOBILE_ZOOM` 1.75 tiles only; pixels stay 3px. |
| Where must `visualAssetId` live? | On the **`combatantsRef` Enemy object** that `drawCombatant` receives (WX 8030). **Not** on `CombatantEntry` / `turnOrderRef` (AI flags live there; pixels do not). **Not** on `CharacterStats`. |
| Is CSS `image-rendering: pixelated` enough for `drawImage`? | **No.** Global `canvas { image-rendering: pixelated }` (`index.css` 652–655) **and** the world canvas inline style (WX 17890) affect **display** of the finished bitmap. They do **not** disable Canvas2D source sampling. `ctx.imageSmoothingEnabled` is still unset. |

Do **not** implement by wiring `EnemyConfig.spriteUrl` or `PlayerSpriteConfig.frontUrl` into `drawCombatant`. That path has no decode, no size contract, no spawn-stable bind. `useGetEnemyConfigs` (`useSpellQueries.ts` 111–137) is **admin catalog React Query**, not WorldExploration combat.

Do **not** “fix” `drawCombatant` to treat `id.startsWith("boss_")` or `family === "boss"` as the 8×12 branch as part of this library (`VAL-2026-09-22-002` / `003`). That would change live portal pixels.

Do **not** derive upload dimensions from the `drawPixelPattern` comment “patterns now match tile dimensions exactly” (WX 3840). They do **not**: 24×24 art on an 80×40 diamond.

---

## 1. Delta vs 2026-09-22

HEAD is unchanged (`0f5363f`). Citations below were re-read. **New correctness**, not new pixels:

| Topic | 2026-09-22 claimed | 2026-09-23 measured |
| :--- | :--- | :--- |
| Where bind lives | “on the instance” / Enemy | Draw reads **`combatantsRef.current[idx]`** (WX 8030). `updateCombatant` spreads patches onto **both** combatants and turn-order (`combatantStore.ts` 413–425). `toCombatantEntry` (141–169) **strips** extra fields when rebuilding the initiative strip. Bind on the Enemy in `combatantsRef`. HP patches via `{...c, ...patch}` preserve extra fields. `syncCombatants` of a mapped list that omits `visualAssetId` would drop the bind. |
| CSS pixelated | Admin `<img>` has it; “not on the world canvas” | **Wrong.** World canvas **does** set `imageRendering: "pixelated"` (WX 17890). Global `canvas { image-rendering: pixelated }` (`index.css` 652–655) covers portrait, creation, selection, landing title. This is **CSS display** of the canvas bitmap, not `ctx.imageSmoothingEnabled`. VAL-2026-09-22-005 still stands. |
| Pointer space | CSS after `ctx.scale(dpr)` | `pointerToRenderSpace` (WX 8991–9004) maps client → logical CSS via `canvasSize / getBoundingClientRect()`. Hit-test and `drawImage` dest rects must share that space. Do not use `canvas.width` (backing store). |
| Resize | backing = `css * dpr` | `canvas.width =` **clears the 2D context** (comment WX 13972–13973). Cache **`ImageBitmap`**, never a `CanvasPattern` / `ImageData` taken from the world ctx. Bitmaps survive resize; ctx-bound resources do not. |
| `getEnemyConfigs` | “WX never calls it” | Still true for WorldExploration. **`useGetEnemyConfigs` does call it** for the admin catalog (`useSpellQueries.ts` 111–137). Grep is not proof the URL is live in combat. |
| Player lookup | `getPersistedPiecePattern` | Confirmed: pieceType → grid only (`pieceArt.ts` 653–658). Comment: “Never treat sprite URLs as required.” `Character.pixelPattern` is saved at creation (273) and **never read** in WX. |
| `Enemy.scaleX/Y` | custom must not inherit squash | TypeScript `Enemy` **requires** `scaleX`/`scaleY` (`gameTypes.ts` 300–301). Rush (`any[]`) and summons **omit** them at runtime; draw uses `?? 1`. Bind helpers must not call `generateEnemyScaleFactors` to “satisfy” the type. |
| Shake | not called out | Whole-frame `ctx.save` + `ctx.translate(_shake)` (WX 7265–7267). Custom `drawImage` inherits shake. Do not add a second shake from bitmap size. |
| Debug overlay | not called out | `debug/clickTrace.ts` is DEV-gated, injects `pointerToRenderSpace`, compares spriteRects vs drawAnchor. Always-reachable debug overlay must **not** dump `blob:` URLs or raw bytes. Click-miss is not a reason to grow occupancy from a custom AABB. |
| Misleading comment | not called out | WX 3840 claims patterns “match tile dimensions exactly.” Live: 8×8 × 3 = **24×24** on **80×40** tiles. |

Unchanged from 09-22 (re-verified 2026-09-23):

- WX **19213** lines; `spawnPolicy.ts` **297**; `enemyPixelPatterns.ts` **522**; `pieceArt.ts` **1061**; `combatantStore.ts` **603**.
- Tile 80×40, offset −9, cell 3px, `MOBILE_ZOOM` 1.75, Continue-on-phone.
- Zero `drawImage` / `createImageBitmap`.
- `VAL-2026-09-01-001` copy honesty still live (`adminVisualStatus.ts`; EnemyEditor ~817–838).
- Family 30% is stats only (`applyFamilyVariantsToRoster` WX 5864–5866).
- No `isElite`. No encounter seed. No `engine/visualAssets.ts`.
- Occupancy one tile. Tested hit `h` desktop **41**, stored `drawSize.h` **60**.
- Portal Enemy omits `isBoss`/`bossId`; Rush sets `isBoss: true` without `bossId`.
- `check-limit = 5`. Chain tail frozen at `20260901_000000`.
- `VAL-2026-09-21-007` visual gates remain **superseded** by `VAL-2026-09-22-002`.

Open PR stack at inspection: 50+ drafts older than this branch, including VAL docs **#355** (09-21) and **#418** (09-22). This PR’s unique files do not overlap those filenames. Union if a sibling later touches the same path; do not concatenate.

---

## 2. Inspection — what actually paints

### 2.1 Combat is generated `fillRect` grids

| Path | Role | Evidence |
| :--- | :--- | :--- |
| `src/frontend/src/data/gameConstants.ts` | Tile + offset | `TILE_WIDTH = 80`, `TILE_HEIGHT = 40`, `CHARACTER_Y_OFFSET = -9` (lines 6–7, 17) |
| WX `drawPixelPattern` | World paint | `pixelSize = 3`; pattern **centered** on `(x, y)` (3841–3886). Ends with `ctx.restore()` (**no** `save` in the function). Comment at 3840 is **false** about matching tile size. |
| `data/pieceArt.ts` `drawPatternInline` | Standalone fallback | same 3px + center (753–782). **No** trailing restore |
| `data/pieceArt.ts` `drawCombatant` | Dispatch: boss → summon → ghost/minion → default | 837–1023. Branch 1: `isBoss && bossId` (856) |
| `engine/enemyPixelPatterns.ts` | Boss 8×12 tables + family grids | `boss_1` 10–24; `getBossPixelPattern` 430–432 fallback `boss_12`; family 434–498 |
| WX player | `getPersistedPiecePattern(pieceType, playerView)` | 8289, 8315–8326 — **not** `drawCombatant` |
| Portrait HUD | 8×8 × `pixelSize = 6` on **60×60** | 3720–3724, 18111–18116 |
| Character creation | 8×8 × `scale = 10` → **80×80** art on a **320×280** canvas (CSS 240×210) | `CharacterCreation.tsx` 151–178, 452–462 |
| Character selection | `pixelSize = floor(internalSize / 10)` with `size = 120`, internal 240 → **24px cells / 192×192 art** | `CharacterSelection.tsx` 313–333 |
| Death juice | `fillRect` fragments | `engine/effects.ts` 282–292 |
| Barrier towers | iso wall stack, **not** a combatant | `engine/barrierRender.ts` 14–16, `BARRIER_LAYER_HEIGHT = 28`; WX wall `wallHeight = 28` at **4085** |
| Landing ads | `<img src={imageUrl}>` | `LandingPage.tsx` 749–757. **Does render.** Not combat. Only `getImageData` in `src/` is the landing title temp canvas (75). |

`Character.pixelPattern` is persisted at creation (`CharacterCreation.tsx` 273) and **never read** by WorldExploration. The world player always uses chess-piece tables via `getPersistedPiecePattern` (`pieceArt.ts` 653–658).

Repo-wide: no `ctx.drawImage`, no `createImageBitmap`, no `imageSmoothingEnabled`. There is **no** SOURCE / NORMALIZED / RENDER_PROFILE pipeline. Until one is added, source === runtime.

`DrawCombatantOptions` (`pieceArt.ts` 714–744) injects pattern resolvers + `drawPattern` + `characterYOffset`. It does **not** accept a bitmap. A custom path must be a new optional **top** branch. Putting a PNG through `drawPattern` / `strokeOwnerTint` would interpret bytes as a cell grid.

### 2.2 Draw source of truth is `combatantsRef`

| Store | What it is | Used for pixels? |
| :--- | :--- | :--- |
| `combatantsRef` | Single source of truth (`WorldExploration.tsx` 1638–1640, 8030) | **Yes.** `drawCombatant(ctx, enemy, …)` |
| `enemies` / `enemiesRef` | Mirror kept in sync by `combatantStore` | Indirectly, if they stay in lockstep |
| `battleEnemiesRef` | Derived battle roster | No |
| `turnOrderRef` `CombatantEntry` | Initiative / AI. Portal `isBoss`/`bossId` are written **here** at battle start (WX 11958–11983) | **No.** `drawCombatant` never reads turn-order |
| `toCombatantEntry` | Rebuilds strip from Enemy (`combatantStore.ts` 141–169) | Copies `isBoss`/`bossId` **if present on Enemy**. Does **not** copy arbitrary extras. Portal spawn never put those flags on Enemy, so the strip’s flags do not flow back into draw |

`updateCombatant` (`combatantStore.ts` 408–443):

```
nextCombatants = map c => c.id === id ? { ...c, ...patch } : c
nextTurnOrder  = map e => e.id === id ? { ...e, ...patch } : e
```

A `{ hp }` patch preserves `visualAssetId` on the Enemy. A `{ visualAssetId }` patch would **also leak onto CombatantEntry**. InitiativeStrip should ignore unknown fields. Do not make turn-order the bind store.

`syncCombatants` (`combatantStore.ts` 464–477) **replaces** `combatantsRef.current = next`. Callers that map a new array and drop extra fields lose the bind. Bind at `addCombatant` / spawn / summon, then only patch.

`Enemy.scaleX` / `scaleY` are **required** on the TypeScript interface (`gameTypes.ts` 300–301). Rush units are pushed as `any[]` (WX 5321) **without** scale. Summons (`summonSpawn.ts` 163–188) omit scale. `CombatantEntity` scale is optional (`pieceArt.ts` 702–703); draw uses `?? 1`. Do not “complete” Rush/summon objects with `generateEnemyScaleFactors` when attaching a visual.

### 2.3 Two boss shapes — do not merge them

Unchanged from 09-22, re-read:

| Shape | Spawn | Flags on **Enemy** | Live draw |
| :--- | :--- | :--- | :--- |
| **Portal boss** | WX 6522–6569 `id: boss_${bossConf.id}_${Date.now()}`, `scaleX/Y: 1.4`, `family: "boss"`, chess `pieceType` | **No** `isBoss`, **no** `bossId` | Chess 8×8 × 3 × **1.4 ≈ 33.6×33.6** |
| **Boss Rush unit** | WX 5326–5371 `id: boss-rush-${room}-${n}`, `isBoss: true`, `family: "boss"`, lore `pieceType` | `isBoss` true, **no** `bossId`, **no** scale | unknown pieceType → **`king.front` 24×24** |
| **8×12 tables** | `getBossPixelPattern(bossId)` | N/A | Only if Enemy has `isBoss && bossId` — **not entered** |

`BOSS_ONLY` / `boss_large` eligible iff `id.startsWith("boss_")` and **not** `id.startsWith("boss-rush")`. Do not use Enemy.`isBoss` or `family === "boss"`. Never name-match Rush `boss1Name` (`useBossRush.ts` 29 `"Pale Archbishop"`).

### 2.4 Unused URL stubs — still not a library

| Store | Who reads in combat |
| :--- | :--- |
| Motoko `EnemyConfig.spriteUrl : ?Text` | **Nobody in WX** |
| Motoko `PlayerSpriteConfig` direction + walk-frame URL arrays | **Nobody in WX**. Admin copy says catalog only (`AdminDashboard.tsx` 1784) |
| `useGetEnemyConfigs` / `useGetPlayerSpriteConfigs` | Admin dashboard React Query (`useSpellQueries.ts`). Normalizes `spriteUrl` to a tuple. **Does not paint the world.** |
| Admin 72×72 `<img object-fit:contain>` | Preview of the URL string only (`AdminDashboard.tsx` 1484–1507) |
| Caffeine `ExternalBlob` | Bindgen plumbing (`backend.ts` 54–55). Sprite fields remain **Text URLs** |
| Shop `proofFileUrl` | `data:` cap **524_288** — **different surface** |
| Landing ads | `<img>` — honest “Custom Visual” for ads (`AdminDashboard.tsx` ~8211+) |

`adminGuard.validateOptionalUrl` (143–148): empty OK, `MAX_URL = 2048`, `unsafeUrl` rejects `javascript:` / `data:` / `vbscript:` / **`file:`** (89–95). **No MIME, decode, dimensions, alpha, or render-safe bounds.** A passing `adminSetEnemyConfig` is not `VALIDATION_STATUS = #ok`.

Walk Animation Frames UI (`AdminDashboard.tsx` 1588–1590) still has **no** stored-not-rendered disclaimer. Combat never samples those arrays. v1 library is four stills (`playerView` WX 11490–11493). Do not add walk cycles to make the heading true.

Empty `spriteUrl` / `[]` is not a custom asset (`adminVisualStatus.test.ts`, `adminContract.test.ts`). Keep that.

### 2.5 Entity categories that actually exist

| Prompt category | Live identity | Default visual |
| :--- | :--- | :--- |
| PLAYER CHARACTER | `character.pieceType` (chess), `playerView` four stills | 8×8 chess × 3px = 24×24 @ scale 1. **Not** `drawCombatant`. |
| STANDARD ENEMY | `id: enemy-${n}-${Date.now()}` (WX 5809), random chess `pieceType`, optional `family` after 30% | **Chess 8×8** even when `family !== "default"` |
| ELITE / LARGE ENEMY | **Does not exist** | `generateEnemyScaleFactors` squash only (`spawnPolicy.ts` 227–255); `iron_golem` is HP paper; `elite_patrol` is a world-feature catalog key (`worldFeatures.ts` 44, 454) |
| BOSS (portal) | `id.startsWith("boss_")`, `family: "boss"`, scale **1.4** | **Live:** 8×8 × 1.4. Tables unused |
| BOSS (Rush roster) | `id` `boss-rush-*`, `isBoss: true`, lore `pieceType` | **king.front 24×24**. Not `boss_large` |
| SUMMON | `summon-${Math.random()…}` (`summonSpawn.ts` 153), `isSummon`, creature `pieceType` | 8×8 + owner tint. **No `scaleX/Y`** → draw `{1,1}` |
| Boss minion / Ghost | `useBossSystem.ts` sets `isBossMinion: true`; WX phase-spawn (~16105) may set `assignedName` Minion/Ghost **without** the flag | Branch 3 only if `assignedName === "Ghost"` **or** `isBossMinion`. `"Minion"` without the flag draws chess |
| FUTURE | portals (whirlpool radius 25, WX 3898), walls (28), loot, death fragments, ads, barrier towers, Enemy Register lore | **Ineligible** until a measured profile exists |

Family pixel tables are **not** the STANDARD ENEMY upload spec (ghost/minion only):

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

Admin `PIECE_TYPES` includes `"custom"` (`AdminDashboard.tsx` 1250–1258). Live `ChessPieceType` does not. Unknown `pieceType` → `king.front`.

Enemy Register (`enemyRegisterCopy.ts` 1–12) is **FLAVOR LORE**, not a visual catalog.

### 2.6 Occupancy, hit-testing, pointer space — visual size ≠ gameplay footprint

`engine/occupancy.ts` `isCellFree`: one combatant per **tile**. No pixel, scale, or image-size input.

Targeting is tile Chebyshev / Manhattan. Sprite rects (WX 8086–8104 / 8335–8352):

| Field | Desktop | Mobile-zoom (tiles 140×70) |
| :--- | ---: | ---: |
| `drawSize` (stored) | 80 × 60 | 140 × 105 |
| tested `w` | **80** | **140** |
| tested `h` | **41** (`40/2 + (-9) + 60/2`) | **78.5** (`70/2 + (-9) + 105/2`) |
| `drawAnchor` | tile top + 9 | same |

`hitTestSprite` pads **10px** mouse (10127) / **14px** touch (10819) around `x,y,w,h`, **not** `drawSize`.

`pointerToRenderSpace` (WX 8991–9004):

```
x = (clientX - rect.left) * (canvasSize.width / rect.width)
y = (clientY - rect.top)  * (canvasSize.height / rect.height)
```

Uses **CSS `canvasSize`**, not `canvas.width`. Custom `drawImage` dest must be in this logical space **after** `ctx.scale(dpr)` (7263–7264, 13953–13965). Preview “actual scale” uses `canvasSize` tiles (80×40), not backing-store pixels and not a raw `getBoundingClientRect` without the scale factor.

Click-miss / clickTrace I2 rect-anchor mismatch must **not** be “fixed” by growing occupancy, `drawSize`, tested `h`, or padding from `image.height`. Debug traces must not persist `blob:` URLs.

Drop shadow is a **tile-foot** ellipse at `(tileTopX, tileTopY + th/2 + 4)` with radius `min(tileW*0.35, tileH*0.3)` (WX 8033–8054). Independent of pattern size. Do not grow it from bitmap bounds.

Whole-frame shake (`ctx.translate(_shake)`, 7265–7267) already moves custom art with the world.

### 2.7 Stable identity for assignment (no encounter seed)

There is still **no map encounter seed**. Do not block the library on inventing one.

| Instance | Id / RNG | Stable after spawn? |
| :--- | :--- | :--- |
| Pack enemy | `enemy-${n}-${Date.now()}` (WX 5809) | Yes on the live `combatantsRef` object |
| Portal boss | `boss_${id}_${Date.now()}` (WX 6524) | Yes. Category: `id.startsWith("boss_")` and not `boss-rush` |
| Boss Rush unit | `boss-rush-${room}-${n}` (5326, 5351) | Yes. Visual category: **`enemy_standard`** |
| Player / enemy summon | `summon-${Math.random()…}` (`summonSpawn.ts` 153) | Yes on the live object; do not re-roll when `turnsRemaining` ticks |
| Stats seed | `seededRng` (`combatMath.ts` 122–127) | Correct primitive for weighted picks |

**Bind `visualAssetId` once at spawn / `addCombatant` / summon / boss portal / minion add.** Weighted pick: `seededRng(hash(instanceId, poolId, poolVersion))` over **active + `#ok` + eligible** assets. If none qualify → leave id unset → builtin.

If a bound id later fails: **fall back to builtin; do not re-roll in rAF or React render.**

Never call `Math.random()` or pick a pool member inside `drawCombatant`, the rAF loop, or a React render.

Custom bitmaps: `DEFAULT_SCALE = 1`. Do not inherit instance 0.6–1.4 squash. Portal builtin chess **does** use fixed 1.4; a 34×34 upload must not also ×1.4.

### 2.8 Owner / admin gate

There is **no** distinct `#owner` role. AccessControl is `#admin` | `#user`. First non-anonymous II caller becomes admin. `App.tsx` 291: `isAdmin = userRole === "admin"`. Dashboard deny: `AdminDashboard.tsx` 5546.

Library UI is **`#admin` only**. Players never upload or choose combat art.

### 2.9 Mobile / tablet — Continue is live

- `SmallScreenGuard` warns; **Continue anyway** (`App.tsx` 396–414). Bypass `sessionStorage` `pbv_small_screen_continue`.
- `useIsMobile(breakpoint = 768)` (`hooks/use-mobile.tsx` 17–26) → WX `MOBILE_ZOOM = 1.75` (957–959) → tiles **140×70**.
- **Pixel patterns do not multiply by `MOBILE_ZOOM`.**
- Canvas backing `cssW * dpr` then `ctx.scale(dpr)`. Logical CSS pixels are the draw unit. Do not multiply bitmaps by `dpr` or 1.75.
- `canvas.width =` during ResizeObserver **clears** the context (13972–13973). Decode once into `ImageBitmap`; redraw from cache. Do not re-fetch every resize.

Iso preview must include a **mobile-zoom pane** (140×70 diamond, 24×24 art unscaled).

### 2.10 CSS pixelated vs Canvas2D smoothing

| Layer | Where | Effect on custom `drawImage` |
| :--- | :--- | :--- |
| CSS `canvas { image-rendering: pixelated }` | `index.css` 652–655 | How the **finished** canvas bitmap is shown |
| World canvas inline `imageRendering: "pixelated"` | WX 17890 | Same, for the world element (overrides 100% box) |
| Admin / creation / selection / portrait / landing | various | Same CSS, **or** `<img>` pixelated (AdminDashboard 1506) |
| `ctx.imageSmoothingEnabled` | **never set in `src/`** | Canvas2D **default on**. Sampling a 24×24 PNG into logical dest blurs **before** CSS display |

Custom branch: `ctx.save(); ctx.imageSmoothingEnabled = false; drawImage(…); ctx.restore();`. Integer dest sizes. Do not set the flag on the shared rAF ctx. Do not skip this because CSS pixelated exists (`VAL-2026-09-23-004`).

---

## 3. Visual fallback invariant

Resolution order for every combatant, every frame:

1. **Bound instance assignment** — `combatantsRef` entity `visualAssetId` points at a library record that is `ACTIVE`, `VALIDATION_STATUS = ok`, bytes decode, and category/eligibility still match.
2. **Bound pool assignment** — `visualPoolId` was resolved **at spawn** into a stored `visualAssetId`. If that id is now invalid, **do not re-roll in render.** Fall through.
3. **Built-in / generated pixel visual** — current `drawCombatant` / `drawPixelPattern` / player `getPersistedPiecePattern` path.

Hard rules:

- Missing, inactive, corrupt, undecodable, oversized, or ineligible custom assets **immediately** use step 3.
- Empty library ⇒ every entity is step 3. No upload required to ship a new enemy, boss, summon, or Rush room.
- Failures log once (`logPatternLookupFailed`), never throw, never block combat.
- Do **not** store `visualAssetId` on `CharacterStats` (12 required fields).
- Do **not** store it only on `CombatantEntry`.
- Persisting library **metadata maps** on the canister is a **new later** migration file after `20260901_000000` (`OldActor = {}`). `check-limit` is currently **5**. Never edit a frozen `NewActor`. Bytes in object storage, not Motoko `Text`.

```ts
// src/frontend/src/engine/visualAssets.ts  (not implemented)
function resolveRuntimeVisual(entity, library): RuntimeVisual
  // { kind: "custom", bitmap, profile } | { kind: "builtin" }
```

`drawCombatant` may grow **one optional branch at the top**. Player needs a **second** one-line site (WX 8315). Empty library / omitted option ⇒ **identity** with today.

Custom branch:

- Own `save` / `imageSmoothingEnabled = false` / `drawImage` / `restore`.
- Do not call `strokeOwnerTint(pattern)` on a bitmap (stroke bitmap AABB or skip in v1).
- Do not route bitmaps through `drawPattern`.
- Do not fix `drawPixelPattern`’s unpaired `restore` (WX 3883) as part of VAL.
- Do not set `isBoss`/`bossId` on portal Enemies to activate 8×12 tables.

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
| Character draw point | `(tileTopX, tileTopY + 9)` | same offset | `drawCombatant` 850–852; player 8318–8319 |
| Pattern **anchor** | **center** of the pattern on the draw point | same | WX 3860–3861, `pieceArt.ts` 764–765 |
| Drop-shadow foot | `(tileTopX, tileTopY + th/2 + 4)` | | 8035–8036, 8293–8294 |
| World cell size | **3×3** logical px × instance scale | **not** × 1.75 | WX 3855 |
| Default pattern | **8×8 cells** | | `chessPiecePatterns`, `creaturePatterns` |
| Default drawn size @ scale 1 | **24 × 24** | 24 × 24 | 8 × 3 |
| Enemy instance scale | 0.6–1.4 (stored on pack enemies) | same | `spawnPolicy.ts` 227–255 |
| Max standard drawn @ 1.4 | **33.6 × 33.6** | 33.6 × 33.6 | 24 × 1.4 (builtin fillRect only) |
| Boss **tables** | **8×12 cells** | | `enemyPixelPatterns.ts` 10–24 |
| Portal boss spawn scale | **1.4 × 1.4** (not random) | | WX 6535–6536 |
| Portal boss **live** drawn | **33.6 × 33.6** | | 8×8 chess × 1.4 |
| Boss tables @ 1.4 (if flags present) | **33.6 × 50.4** | | intended alternate `boss_large` box |
| Rush unit **live** drawn | **24 × 24** | | king.front @ scale 1 |
| Portrait | 60×60 canvas, 6px cells → 48×48 art | | 3720, 18111–18116 |
| Creation preview | 80×80 pattern on 320×280 canvas | | `CharacterCreation.tsx` 151, 452–462 |
| Selection preview | 192×192 on 240 internal | | `CharacterSelection.tsx` 313, 333 |
| Name label | `screenPos.y − 34` | | 8122 |
| Level label | name + 14 | | 8123 |
| Status icons | draw point − 30 | | 8246, 8362 |
| Summon lifespan badge | `(x + 18, y − 48)` | | 8146–8147 |
| Attack damage float | `y − 44` / scaled label `y − 58` | | 8206–8214 |
| Sprite `drawSize` (stored) | 80 × 60 | 140 × 105 | 8103, 8352 |
| Sprite hit `h` (tested) | **41** | **78.5** | §2.6 |
| Hit padding | 10 mouse / 14 touch | same px | 10127 / 10819 |
| Wall / barrier extrusion | 28 px per layer | | `barrierRender.ts` 15; WX **4085** |
| Pointer space | CSS `canvasSize` | same | `pointerToRenderSpace` 8991–9004 |
| Viewport | warn &lt;768; Continue enters | zoomed tiles | `SmallScreenGuard` + `useIsMobile` |

**Anchor for custom bitmaps must match the pixel path:** center the image on `(tileTopX, tileTopY + 9)`.

Do **not** use the 320×280 creation canvas, 72×72 admin `<img>`, 60×60 portrait, 192×192 selection preview, or the false “patterns match tiles” comment as recommended upload size.

### 4.2 Per-category upload specification

Show this table **before** the file picker. Reject or warn — **never silently scale, crop, or stretch**.

Shared:

| Field | Value | Why |
| :--- | :--- | :--- |
| `SUPPORTED_FORMATS` | `image/png` required; `image/webp` accepted if `createImageBitmap` succeeds | Pixel path is transparent (`cell === 0` skipped). JPEG has no alpha. SVG/GIF/APNG not used in combat. |
| `TRANSPARENCY_REQUIREMENT` | At least one pixel with alpha &lt; 255 | Opaque rectangles sit as boxes on the diamond. |
| `ANIMATION_SUPPORT` | **Four stills** (`front` / `right` / `left` / `back`) matching `ViewDirection` | `playerView` updates on step (WX 11490–11493). Walk-frame arrays are never drawn. |
| `MAX_FILE_SIZE` | **Not measured in-repo as a visual cap.** `MAX_URL = 2048` is URL text. Shop proof cap 524_288 is a **different** surface. | Starting reject: **256 KiB per still** after encode until object-store limits are measured. Decode from `Blob` / `ExternalBlob`. No `data:` / `file:` / cross-origin `https` paint. |

#### PLAYER CHARACTER — profile `player_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (or **48** @2×) | 8×8 × 3 |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | tile / stored `drawSize.h`; **warn at 41** (tested hit `h`) |
| `ANCHOR` | center on draw point (tile top + 9) | player `drawPixelPattern` |
| `DEFAULT_SCALE` | **1** | player omits scale |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | labels at y−34 stay clear of 24-tall art |

Portrait / creation / selection stay generated pixels in v1. Admin `"custom"` piece type is not a combat category.

#### STANDARD ENEMY — profile `enemy_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **24** (48 @2×) | chess 8×8 × 3 — **not** family grids |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | warn if taller than tested **41** |
| `DEFAULT_SCALE` | **1** | Do not inherit random squash |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | |

Also the live visual for **Boss Rush roster units** until a measured rush profile exists.

#### ELITE / LARGE ENEMY — profile `enemy_elite` (future)

No elite type. `ELITE_ONLY` assets are **ineligible** for random pools until an explicit flag exists. Do not infer elite from `scaleY`, HP, `iron_golem`, `elite_patrol`, or Rush `isBoss`.

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` / `HEIGHT` | **34** | ceil(24 × 1.4) |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **60** | same tile/hit box — **visual only** |
| `DEFAULT_SCALE` | **1** on a 34×34 asset | Do not also ×1.4 |
| Occupancy | **one tile** | never from visual size |

#### BOSS — profile `boss_large`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| `RECOMMENDED_WIDTH` | **34** | ceil(8 × 3 × 1.4) |
| `RECOMMENDED_HEIGHT` | **34** to match **today’s portal paint**; **50** if the owner opts into the **table** box | Live = 8×8×1.4 tall. Tables = 8×12×1.4. Preview must label which box. Never silently pick 50 for a unit that paints 34. |
| `MAX_WIDTH` / `MAX_HEIGHT` | **80** / **72** | one column; labels will clip — warn |
| `DEFAULT_SCALE` | **1** on the recommended bitmap | Do not apply 1.4 on top of a 34×34 or 34×50 upload |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 64 × 72 | still one tile occupancy |
| Eligible instances | `id.startsWith("boss_")` **and not** `boss-rush` | Not Enemy.`isBoss`, not `family === "boss"` |

Never stretch `enemy_standard` art onto a portal id. Never assign `boss_large` to `boss-rush-*`.

#### SUMMON — profile `summon_standard`

| Spec | Value | Derivation |
| :--- | :--- | :--- |
| Same box as player/standard | 24 recommended, 80×60 max | 8×8 `creaturePatterns` |
| Extra | Owner tint around **runtime** AABB or skip in v1 | `strokeOwnerTint` uses pattern cells today |
| `DEFAULT_SCALE` | **1** | spawn writes no `scaleX/Y` |
| `MAX_SAFE_VISUAL_FOOTPRINT` | 48 × 48 | badge `(x+18, y−48)` collides with tall art — warn |

#### FUTURE (`#future`)

Portals, walls, loot, death fragments, ads, barrier towers, Enemy Register titles: **ineligible**. v1 is combatant stills only.

### 4.3 Aspect ratio and pixel-count gates

| Check | Rule |
| :--- | :--- |
| Aspect vs recommended | Warn if `\|w/h − recW/recH\| > 0.15`. Reject only if the owner did not confirm. |
| Pixel count | Reject if `w * h > MAX_WIDTH * MAX_HEIGHT` after intended scale. |
| Decode | `createImageBitmap` from a **Blob**; failure → `#invalid` / builtin. |
| MIME | Trust decoded type, not the extension. |
| Distortion | Non-matching size: draw **unscaled** (integer nearest-neighbor) with **transparent pad**. Never stretch-to-fill. |
| Smoothing | Local `imageSmoothingEnabled = false`. CSS pixelated is not this gate. |
| URL stubs | `adminGuard` is **not** this gate. |
| Lifetime | `ImageBitmap.close()` / `URL.revokeObjectURL` on replace, deactivate, fallback. |
| Resize | Bitmaps survive `canvas.width =`. Do not cache ctx-bound patterns. |

### 4.4 SOURCE / NORMALIZED / RENDER_PROFILE (proposed — does not exist)

Introduce only if implementation needs 2×/4× sources. Until then **source === runtime**. Validation uses the category profile directly. `RENDER_PROFILE` does not apply instance `scaleX/Y` to custom art (default **false**).

---

## 5. Library metadata

Backend-authoritative (`localStorage` cache only). Suggested record:

| Field | Type | Notes |
| :--- | :--- | :--- |
| `ASSET_ID` | Text | Stable. Never reuse after delete. |
| `DISPLAY_NAME` | Text | Owner rename. |
| `ENTITY_CATEGORY` | variant | `#player` `#enemyStandard` `#enemyElite` `#boss` `#summon` `#future(Text)` |
| `ENTITY_FAMILY` | [Text] | Empty = any family. Do not treat `"boss"` as a pool that includes Rush. |
| `ENTITY_IDS` | [Text] | Explicit binds: `player`, catalog `boss_3`, summon `pieceType`. Not `boss-rush-0-0` unless a rush profile exists. |
| `VARIANT_TAGS` | [Text] | Explicit only. Never `assignedName`, Register titles, Rush `boss1Name`. |
| `ACTIVE` | Bool | Inactive → resolver miss → builtin. |
| `WEIGHT` | Nat | 0 = never randomly selected (direct assign only). |
| `RARITY` | Text | Display/filter only. |
| `ELITE_ONLY` | Bool | Ineligible until a real elite flag exists. |
| `BOSS_ONLY` | Bool | Portal `boss_*` ids only. **Not** Enemy.`isBoss`. |
| `UPLOAD_DATE` | Nat | Timestamp. |
| `VERSION` | Nat | Increments on replace. Cache key `ASSET_ID`+`VERSION`. |
| `SOURCE_METADATA` | record | hash, MIME, original w/h, byte length, uploader principal. |
| `RENDER_PROFILE` | Text | `player_standard` / `enemy_standard` / `enemy_elite` / `boss_large` / `summon_standard`. |
| `VALIDATION_STATUS` | variant | `#ok` `#pending` `#invalid(Text)` |
| `BLOB_REF` | opt | Caffeine object id. Legacy URL import stays inactive. |
| `DIRECTION_REFS` | record | opt front/right/left/back. Missing → `front` → builtin. |
| `PREVIOUS_VERSION` | opt Text | Revert / dependency inspect. |

Assignments: `targetKind` `#entity` `#family` `#pool` `#pieceType`; `assetId` (priority 1) or `poolId` (priority 2, resolved **once at spawn**).

**World-pack bind cannot live only on `EnemyConfig.spriteUrl`.** `generateEnemies` never reads admin enemy templates. Assignments key off instance fields spawn already writes.

---

## 6. Owner operations

All `#admin` only. Display the category upload spec **before** the file picker.

| Operation | Behavior |
| :--- | :--- |
| **Upload** | Spec → pick 1–4 stills → validate → store `ACTIVE=false` until activate. |
| **Preview** | Iso **80×40 and 140×70**, draw point +9, player 24×24 dummy, standard enemy dummy, portal-boss dummy at **34×34** (live) and a labeled **34×50** pane (“not current portal paint”), drop-shadow foot, name/badge/damage-float overlays, hit rect **80×41**, pointer-space note. Warn clip / pad / overlap / **phone Continue zoom**. |
| **Activate / deactivate** | Toggle `ACTIVE`. Deactivate → next frame builtin, no re-roll. Close bitmaps. |
| **Rename** | `DISPLAY_NAME` only. |
| **Replace / version** | New bytes, `VERSION++`, keep `ASSET_ID`. |
| **Safe removal** | Dependency inspect first. Block hard-delete if assigned; offer deactivate. |
| **Assign** | Entity / family / pool. Pool resolved at spawn via `seededRng(hash(instanceId, poolId, poolVersion))`. |
| **Revert to default** | Clear assignment / `visualAssetId` on the **combatantsRef** object. |
| **Dependency inspection** | Assignments, templates, live instance ids. |

Existing URL rows may later import as **inactive** records. Import never auto-activates.

---

## 7. Implementation placement

- New logic: `src/frontend/src/engine/visualAssets.ts` (+ tests) and optionally `visualPreview.ts`.
- Neighbors: `enemyPixelPatterns.ts`, `spawnPolicy.ts`, `combatantStore.ts`. **Do not dump the resolver into WX** (19213 lines).
- `DrawCombatantOptions`: optional custom-visual hook; omitted = today.
- WorldExploration: **wiring only** — pass `visualAssetId` from `combatantsRef`. Do not edit RAF / mapGen / turn / damage. Do not set portal `isBoss`/`bossId`.
- Bind at `addCombatant` / spawn sites. `updateCombatant` patches must not drop the field. Do not bind on `toCombatantEntry`.
- Motoko metadata: `#admin` + new later chain file after `20260901`; bump `check-limit`. Bytes in object storage.
- Tests: empty `[]` → builtin; inactive/corrupt → builtin; 100 fake renders same id; occupancy/`drawSize`/tested `h` ignore bitmap size; `ELITE_ONLY` never selected; `boss-rush-*` never `BOSS_ONLY`; `isBoss: true` without `bossId` never `boss_large`; `useGetEnemyConfigs` success is not `#ok`; resize does not re-decode.

---

## 8. Risk register

| Risk | Mitigation |
| :--- | :--- |
| Random flicker | Bind at spawn on `combatantsRef`; 100 fake renders |
| Bind lost on HP patch / sync | Spread-patch; never remap without the field |
| Bind on turn-order only | Draw never sees it; portal `isBoss` already lives there |
| Stretching enemy art onto bosses | Separate `boss_large`; never ×1.4 a 24×24 upload |
| 50-tall art on live 34-tall portal units | Preview labels live vs table box |
| Boss art on Rush `isBoss` units | `BOSS_ONLY` requires `boss_*` prefix |
| Flipping portal paint to 8×12 | Forbidden (`VAL-2026-09-22-003`) |
| Occupancy / click box from pixels | Keep tested `h` and `drawSize` tile-derived |
| “Fixing” clickTrace mismatches | Debug-only; do not grow AABB (`VAL-2026-09-23-010`) |
| Stale `spriteUrl` / admin query hook | Honesty copy + do not `drawImage(url)` |
| CORS-tainted world canvas | Blob + `createImageBitmap` |
| Blurry custom pixels | Local `imageSmoothingEnabled = false` despite CSS pixelated |
| Context cleared on resize | ImageBitmap cache, not CanvasPattern |
| Canvas stack vs trailing restore | Custom local save/restore; do not fix WX 3883 |
| Type-required `scaleX/Y` filled at bind | Leave Rush/summon unscaled |
| Family owners expect family pixels | Ghost/minion only today |
| Phone art “too small” | Match builtin; no `MOBILE_ZOOM` / `dpr` on bitmaps |
| Walk-frame UI → GIF atlas | Honesty copy + stills-only |
| Ad “Custom Visual” removed | Ads already render |
| Enemy Register as roster | Flavor lore |
| Resolver dumped into WX | Follow engine extraction |
| Frozen EOP chain edited | Later file after `20260901` |
| `CharacterStats` field creep | 12 fields stay |
| Bitmap leaks | `close()` / `revokeObjectURL` |
| Overwriting #355 / #418 docs | New dated filenames only |

---

## 9. What this run did not do

- No production / gameplay code changes.
- No `drawImage` wiring.
- No Motoko library types / no new migration file.
- Did not re-issue prior VAL ACTION_IDs as new implementation work.
- Did not edit `README.md`.
- Did not rewrite PR #355 or #418 files.
- Did not set `isBoss`/`bossId` on portal Enemies.
- Did not treat `useGetEnemyConfigs` as combat consumption.
- Did not invent 64×64 / 128×128 boxes.
