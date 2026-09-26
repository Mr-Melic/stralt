# Custom Visual Asset Library & Assignment — 2026-09-26 re-inspection

**Designer:** Visual Asset Library & Assignment Designer  
**Date:** 2026-09-26  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Branch:** `cursor/custom-visual-assets-system-2286`  
**Gameplay / production code:** not modified.  
**Prior designs on this tree:** [`VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md`](./VISUAL_ASSET_LIBRARY_DESIGN_2026-09-02.md) (and 09-01 / 08-31).  
**This run ACTION_IDs:** [`ACTION_IDS_VAL_2026-09-26.md`](./ACTION_IDS_VAL_2026-09-26.md)

**Invariant:** custom visuals are optional. Empty library ≡ today’s pixel look. Do not invent sprite boxes.

This document is a **structured fact sheet** derived only from live files with line numbers. Invented dimensions are forbidden.

---

## 0. Verdict vs claimed checklist

| Claim | Live measurement | Match? |
| :--- | :--- | :--- |
| Tile 80×40 | `TILE_WIDTH=80`, `TILE_HEIGHT=40` (`gameConstants.ts` 6–7) | YES |
| Cell 3px | `pixelSize = 3` in `drawPixelPattern` (WX 3855) and `drawPatternInline` (`pieceArt.ts` 761) | YES |
| Draw point tile top+9 | `CHARACTER_Y_OFFSET = -9` (`gameConstants.ts` 17); draw at `screenPos.y - CHARACTER_Y_OFFSET` = tile-top **+9** | YES |
| Standard 24×24 | Chess grids 8×8 × 3px (`pieceArt.ts` 85–94 `king.front`) | YES |
| Portal live 8×8×1.4 | Portal **Enemy** spawn: chess `pieceType`, `scaleX/Y=1.4`, **no** `isBoss`/`bossId` on Enemy (WX 6522–6569) → ≈33.6×33.6 | YES (enemy, not whirlpool) |
| Rush `king.front` 24×24 | Rush: `isBoss:true`, lore `pieceType`, **no** `bossId`/`scaleX` → fallback `king.front` @ scale 1 (WX 5325–5346; `pieceArt.ts` 856 / 1006–1022) | YES |
| Hit 80×41 | Stored `w=80`; `h = th/2 + CHARACTER_Y_OFFSET + (th*1.5)/2 = 20−9+30 = 41` (WX 8086–8092) | YES |
| Wall 28 | `wallHeight = 28` (WX 4085); `barrierRender.ts` comment agrees | YES |

**Important distinction:** the **portal graphic** is a whirlpool (`radius = 25`, WX 3898), not an 8×8 pixel pattern. “Portal live 8×8×1.4” means the **boss Enemy** spawned after entering a boss portal.

---

## 1. Core constants

| Symbol | Value | Path:lines |
| :--- | :--- | :--- |
| `TILE_WIDTH` | `80` | `src/frontend/src/data/gameConstants.ts:6` |
| `TILE_HEIGHT` | `40` | `gameConstants.ts:7` |
| `CHARACTER_Y_OFFSET` | `-9` | `gameConstants.ts:17` |
| `MOBILE_ZOOM` | `1.75` | `WorldExploration.tsx:957` |
| `effectiveTileW/H` | mobile: `140×70`; else `80×40` | WX `958–959` |
| `wallHeight` | `28` | WX `4085` |
| `pixelSize` (combat) | `3` | WX `3855`; `pieceArt.ts` `761` |
| Portrait `pixelSize` (selection) | `Math.floor(internalSize/10)` | `CharacterSelection.tsx:333` |
| Creation scale | `10` (hardcoded 8-cell box) | `CharacterCreation.tsx:151–153` |

---

## 2. `drawPixelPattern` (centering, cell size, save/restore)

**Site:** `WorldExploration.tsx` `3841–3886`.

```
pixelSize = 3
patternWidth  = pattern[0].length * pixelSize * scale.x
patternHeight = pattern.length     * pixelSize * scale.y
startX = Math.round(x - patternWidth / 2)
startY = Math.round(y - patternHeight / 2)
fillRect(round(startX + col*3*sx), round(startY + row*3*sy), ceil(3*sx), ceil(3*sy))
```

Cell values: `0` skip; `1` secondary; `2` accent; `3` extra (if provided); else primary.

**Bug / asymmetry:** ends with `ctx.restore()` (WX `3883`) but **never calls `ctx.save()`**. Inline twin `drawPatternInline` (`pieceArt.ts` `753–782`) correctly does **not** restore. Callers that wrap with their own `save` (moving-enemy glow WX `8057–8076`) rely on this accidental restore.

---

## 3. Who draws what

| Entity | Path | Pattern source | Scale |
| :--- | :--- | :--- | :--- |
| **Player** | WX `8285–8326` — **direct** `drawPixelPattern`, **not** `drawCombatant` | `getPersistedPiecePattern(pieceType, playerView)` | default `{1,1}` |
| **Enemy / summon / boss (combatantsRef)** | WX `8063–8075` → `drawCombatant` (`pieceArt.ts` `837–1023`) | dispatch branches below | `entity.scaleX/Y ?? 1` |
| **Boss branch** | `isBoss && bossId` → `getBossPattern(bossId)` | 8×12 tables | instance scale |
| **Summon branch** | `isSummon` → creature pattern + `OWNER_TINT` outline | creature grids | instance scale |
| **Ghost / boss minion** | `assignedName==="Ghost"` \|\| `isBossMinion` → **family** grids | `getEnemyFamilyPixelPattern` | instance scale |
| **Default enemy** | chess / creature by `pieceType` | `getCreaturePattern` | instance scale |
| **Portal graphic** | `drawPortalWhirlpool` WX `3889+` | ellipse whirlpool `radius=25` | N/A |
| **Walls** | `drawIsometricTile` wall branch WX `4084+` | extruded diamond, `wallHeight=28` | N/A |

Fallback on any failed lookup: `chessPiecePatterns.king.front` (`pieceArt.ts` `879`, `911`, `940`, `973`, `1010`).

---

## 4. Boss pixel patterns (8×8 vs 8×12), scale 1.4, flags

| Fact | Evidence |
| :--- | :--- |
| Boss **tables** are **8 wide × 12 tall** | `enemyPixelPatterns.ts` `11–24` (`boss_1` through …) |
| Live **portal** boss Enemy: `scaleX/Y = 1.4`, `family: "boss"`, id `boss_${id}_${Date.now()}` | WX `6524–6568` |
| Portal Enemy **omits** `isBoss` and `bossId` | same block — fields absent |
| Battle sets `isBoss`/`bossId` only on **`CombatantEntry` (turnOrder)** via `id.startsWith("boss_")` | WX `11958–11984` |
| `syncCombatants(..., enemiesWithSpells)` does **not** copy those flags onto Enemy | WX `11927–11929`, `12075` |
| Therefore live paint uses **default chess 8×8 × 1.4**, **not** 8×12 tables | `drawCombatant` branch 1 requires `isBoss && bossId` (`pieceArt.ts` `856`) |
| `family === "boss"` is **not** in `EnemyFamily` union | `gameTypes.ts` `12–20` |
| Do **not** key a `boss_large` profile off `isBoss` / `family===boss` alone | tables wired but unused on live portal Enemy |

---

## 5. Family pixel patterns — used for regular family enemies?

| Fact | Evidence |
| :--- | :--- |
| Tables exist (3×8 wraith … 6×6 void_mirror, 3×3 default) | `enemyPixelPatterns.ts` `434–498` |
| 30% family roll applies **stats only** | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE=0.3` (35); `applyFamilyVariantsToRoster` WX `5864–5866` |
| Regular family enemies keep chess `pieceType` art | `drawCombatant` default branch `989–1022` |
| Family **art** only for Ghost / `isBossMinion` | `pieceArt.ts` `930–957` |
| Ghost spawn example | WX `16153` `assignedName: "Ghost"` / `"Minion"` |

---

## 6. `generateEnemyScaleFactors` / `scaleX`/`scaleY`

**Site:** `src/frontend/src/engine/spawnPolicy.ts` `227–256`.

- Two unused rng draws then `variation = rng()`.
- `<0.3`: tall squash `scaleX ∈ [0.6,0.9]`, `scaleY ∈ [1.1,1.5]`
- `<0.6`: wide squash `scaleX ∈ [1.1,1.5]`, `scaleY ∈ [0.6,0.9]`
- else uniform `∈ [0.6,1.4]`
- Written onto regular enemies at spawn (WX `5820–5821`).
- Portal boss forces `1.4/1.4` (WX `6535–6536`).
- Rush / many summons omit scale → draw defaults to `1`.

---

## 7. Hit test / sprite rects / drawAnchor / drawSize / actual 80×41

**Map:** `spriteRectsRef` cleared each frame (WX `7990`), rebuilt at draw sites.

**Enemy rect (desktop):** WX `8086–8103`

```
_srW = effectiveTileW           // 80
_srH = effectiveTileH * 1.5     // 60
x = screenPos.x - _srW/2
y = screenPos.y - CHARACTER_Y_OFFSET - _srH/2
w = _srW                        // 80
h = effectiveTileH/2 + CHARACTER_Y_OFFSET + _srH/2
  = 20 + (-9) + 30 = 41
drawAnchor = (screenPos.x, screenPos.y - CHARACTER_Y_OFFSET)
drawSize   = { w: 80, h: 60 }   // NOT the hit height
```

**Player rect:** same formula (WX `8335–8352`), `drawOrder: 99999`.

**Hit test:** `hitTestSprite` (WX `8885–8917`) expands by padding **10** (mouse, `10127`) / **14** (touch, `10819`).

**Contradiction:** comments say bounding box `effectiveTileW × effectiveTileH*1.5`, but stored **`h` is 41**, not 60. Hit testing uses `x,y,w,h` — so live hit box is **80×41** (+ padding), not `drawSize`.

---

## 8. Drop shadow formula

Enemy (WX `8033–8054`) and player (WX `8291–8312`) identical:

```
footX = screenPos.x
footY = screenPos.y + effectiveTileH/2 + 4
sw = min(effectiveTileW * 0.35, effectiveTileH * 0.3)   // desktop: min(28, 12) = 12
sh = sw * 0.35                                          // 4.2
radialGradient center→sw: rgba(0,0,0,0.35) → transparent
ellipse(footX, footY, sw, sh)
```

---

## 9. `ctx.drawImage` / `createImageBitmap` in `src/`

**Zero call sites.** Only a comment in `adminVisualStatus.ts:5`. Combat paints exclusively via `fillRect` / ellipse / path.

---

## 10. `engine/visualAssets.ts`

**Absent.** `ls` → No such file.

---

## 11. `EnemyConfig.spriteUrl` / `PlayerSpriteConfig` in WorldExploration

**Zero references** in `WorldExploration.tsx` (no `spriteUrl`, `PlayerSprite`, `getEnemyConfigs`, `getPlayerSpriteConfigs`). Admin persist + honesty copy live in `AdminDashboard` / `adminVisualStatus.ts`; combat never loads them.

---

## 12. `occupancy.ts` — one-tile footprint

`isCellFree` (`occupancy.ts` `84–98`) enforces **one combatant per tile**. No multi-tile footprint. Visual size ≠ gameplay footprint.

---

## 13. `seededRng` / encounter seed

| Item | Status |
| :--- | :--- |
| `seededRng` | `combatMath.ts` `122–128` (LCG); used for walls, hazards, `computeEnemyStats` |
| Encounter seed | **Absent** — no `encounterSeed` / bind-at-spawn visual id |
| Enemy spawn id | `` `enemy-${n}-${currentTime}` `` (WX `5809`) — time-based, not encounter-stable |

---

## 14. Canvas DPR / smoothing / pixelated / `canvas.width=`

| Fact | Lines |
| :--- | :--- |
| `dprRef = devicePixelRatio \|\| 1` | WX `1040` |
| Resize sets `canvas.width = floor(cssW * dpr)` | WX `13953–13957` |
| Every frame: `setTransform` + `scale(dpr)` | WX `7263–7264` |
| `canvas.width=` **clears** 2D context (commented) | WX `13972–13973`, also M-1 reset `7226–7228` |
| `ctx.imageSmoothingEnabled` | **never set** in WX |
| CSS `image-rendering: pixelated` | WX canvas style `17890`; global `index.css` `652–655` |

---

## 15. Portrait / character creation / selection pixel sizes

| Surface | Math | Lines |
| :--- | :--- | :--- |
| CharacterCreation | Hardcoded **8×8** cells × `scale=10` → 80×80 art in 320×280 canvas (CSS 240×210) | `CharacterCreation.tsx` `151–153`, `452–464` |
| CharacterSelection preview | `size` default 120 → `internalSize=240` → `pixelSize=floor(240/10)=24` → 8×24=192 | `CharacterSelection.tsx` `310–335` |

Do not route PNGs through these hardcoded 8-cell painters without a separate profile.

---

## 16. Name labels / summon badges

| Element | Position | Lines |
| :--- | :--- | :--- |
| Enemy name | `(screenPos.x, screenPos.y - 34)` | WX `8122–8132` |
| Enemy level | `nameY + 14` | WX `8123`, `8134–8136` |
| Summon lifespan badge | `(screenPos.x + 18, screenPos.y - 48)` | WX `8146–8147` |
| Status icons (enemy/player) | `y - CHARACTER_Y_OFFSET - 30` | WX `8246`, `8362` |

---

## 17. `pointerToRenderSpace`

WX `8994–9005`: maps client → **CSS logical** space via `canvasSize` (not `canvas.width`). Shared by click/touch + `hitTestSprite`.

---

## 18. `isElite`

**No field** anywhere under `src/` (grep empty). Elite remains catalog/metadata-only.

---

## 19. `CombatantEntry` vs `combatantsRef` Enemy extras

`toCombatantEntry` (`combatantStore.ts` `141–168`) keeps turn fields (`isBoss`, `bossId`, `isSummon`, …) and **strips** render extras: `scaleX/Y`, `family`, `assignedName`, `currentView`, movement, etc.

**Bind visuals on `combatantsRef` Enemy**, not `CombatantEntry`. Player is **not** in `combatantsRef` (separate draw path).

Portal boss: `isBoss`/`bossId` live on turnOrder only; Enemy paint never sees them → chess@1.4.

---

## 20. `WorldExploration.tsx` line count

**19213** lines (`wc -l`).

---

## 21. `pieceArt.ts` `DrawCombatantOptions`

Interface `714–744`: `getBossPattern?`, `getFamilyPattern?`, `getFamilyColors?`, `drawPattern?`, `characterYOffset?`. No bitmap / `visualAssetId` hook yet.

---

## 22. Admin visual URL validation

| Constant | Value | Where |
| :--- | :--- | :--- |
| `MAX_URL` | `2048` | `adminGuard.mo:10`; frontend `validateOptionalUrl` literal `2048` (`adminSafety.ts:426`) |
| `MAX_JSON_BLOB` | `32768` | `adminGuard.mo:9`; `adminSafety.ts:8` |
| `unsafeUrl` rejects | `javascript:`, `data:`, `vbscript:`, `file:` | `adminGuard.mo:89–94`; `adminSafety.ts:84–91` |
| Shop proof exception | allows specific `data:image/*` / pdf / octet-stream | `adminSafety.ts:104–114` — **≠** combat URL reject |

---

## 23. Version-gate wipe keys

`versionGate.ts` `7–12` / `App.tsx` `300–313`: `localStorage.clear()` then restore only:

- `pbv_tier_spawn_config`
- `pbv_levelup_config`
- keys ending `_inventory`

---

## 24. Portal render size

Whirlpool `radius = 25`, translated `(x, y-10)` (WX `3898–3919`). Rest/boss variants expand rings (`radius+8`, `radius+12`). **Not** an 8×8 pattern.

---

## 25. Rush `king.front` size

Rush spawn (WX `5325–5346`): `isBoss: true`, `pieceType: roomDef.boss1Name` (lore string), **no** `bossId`, **no** `scaleX/Y`. Dispatch skips boss tables → unknown pieceType → **`king.front` 8×8 × 3 = 24×24**.

---

## 26. InitiativeStrip `ENEMY_ICONS`

`InitiativeStrip.tsx` `65–81`: regex→emoji map (goblin, vampire, …). **UI strip only** — not a visual catalog / not used by canvas paint.

---

## 27. `contextlost` handling

WX `13826–13864`: listens `webglcontextlost` / `webglcontextrestored` / `contextlost` / `contextrestored`. On restore, resizes from **`window.innerWidth/Height`** × dpr (not `canvasSize`). Synthetic dispatch also at WX `8756`.

---

## 28. Tablet 768–1024 camera/zoom

| Breakpoint | Behavior |
| :--- | :--- |
| `<768` | `useIsMobile` true → `MOBILE_ZOOM` 1.75 tiles; camera follow |
| `768–1024` | mobile false, `isDesktop` false (`>1024`, WX `877`) → tiles **80×40**, camera **follow** |
| `>1024` | desktop: tiles 80×40, camera locked at 0 |

---

## 29. Battle-init rAF skip

WX `7238–7245`: while `inBattleRef`, if `battleInitFrameRef < 3` increment and **return** (skips draw). Comment says “first 2 frames”; code skips **3** frames (0,1,2). Reset at battle start (`11619`).

---

## 30. `nsKey`

WX `866–871`: `` `${userId}_slot${characterSlot}_${base}` `` for localStorage. **Not** a visual library.

---

## 31. Iso neighbor delta

`gridToScreen` (WX `3785–3786`):

```
ΔscreenX (gx+1) = +effectiveTileW/2 = +40
ΔscreenY (gx+1) = +effectiveTileH/2 = +20
‖Δ‖ ≈ √(40²+20²) ≈ 44.72 px
```

Warn custom overlap if footprint diameter ≳ 40 on the neighbor pitch.

---

## 32. Custom library status (unchanged)

| Question | Answer |
| :--- | :--- |
| Does `engine/visualAssets.ts` exist? | **No** |
| Does combat `drawImage`? | **No** |
| Do admin sprite URLs appear in world? | **No** |
| Empty library ≡ today? | **Yes** (by absence) |
| VAL-2026-09-01-001 copy honesty | Still the only implemented VAL id on this tree |

---

## 33. Recommended RENDER_PROFILES (unchanged boxes)

| Profile | Pixel box | Notes |
| :--- | :--- | :--- |
| `standard` / player / summon | 24×24 | 8×8 × 3 @ scale 1 |
| `portal_boss_live` | ≈34×34 | chess 8×8 × 1.4 — **current** portal paint |
| `boss_table` | ≈34×50 | 8×12 × 3 × 1.4 — tables exist, unused on live Enemy |
| `rush_fallback` | 24×24 | `king.front` |
| Mobile tile | 140×70 | art stays 24×24 unless policy says otherwise |

---

*End of 2026-09-26 fact sheet. Production code not modified.*
