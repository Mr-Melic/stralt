# Spell and Tactical Mechanics — Design Pass 2026-10-26

**Role:** Spell and Tactical Mechanics Designer  
**Status:** PROPOSED — no production code in this pass  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Sibling systems:**
- Dynamic Spell Discovery — Wave 1 law [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) through still-open Wave 17 [`SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-12eb/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md) (**#1082**). Same-day Wave 18 SDE **has not opened a PR at authoring**.
- Spell, Discovery & Achievement Admin — still-open ACTION_ID-only PRs (no unique spell ids). **#1078** owns SDA-2026-10-25-175…189.
- Prior tactical passes — [`SPELL_PROPOSALS_2026-08-31.md`](./SPELL_PROPOSALS_2026-08-31.md) … still-open Wave 17 [`SPELL_PROPOSALS_2026-10-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-34f2/docs/automation/SPELL_PROPOSALS_2026-10-25.md) (**#1063**)
- Boss sheets — [`../design/BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md); extra doors through #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** (Wave 16 bosses) / **#1004** (Wave 17 bosses: `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`) / **#1080** (Wave 18 bosses: `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`); tactical extras #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063**

This is **Wave 18** of the tactical catalog. Live HEAD is unchanged since Waves 4–17. Wave 17 (#1063) filled both-body leftover AP + leftover MP **=== 5** heal (Stave Mend), remaining `n===2` → `0` (Cadence Dock), axis-aligned 3×4 occupy (Dodeca Span, counts as twelve), two-ally leftover invert (Hymn Turn), and a Stave family plus Court Dock.

**Wave 17 explicitly deferred eleven holes.** Discovery Wave 17 (#1082) already claimed leftover AP **≥ 2 AND** leftover MP **= 0** heal (Gait Gift), remaining `n>3` → `3` (Cadence Tern), leftover **1/1** negate (Prime Plate), Tern Stride / Octa Oath / Mire Reel / Diag Bite / Summon Mark / Slide Skip / Capped Sting / Summon Orth / Odd Toll / Brick Tax / Watch Tax / Thin Gait / Lava Cut / Strike Plate / Pack Ring / Lane Fold. **SDE keeps those.** This pass fills the remaining leftovers Wave 17 left for Wave 18, plus a mixed-side invert that does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, or Hymn Turn:

| Wave-17 leftover | Owner after #1082 / #1063 | This pass |
| :--- | :--- | :--- |
| Leftover AP + leftover MP === **6 AND unequal** | Still open. Tally owns **sum === 3**. Score owns **sum === 4 AND unequal**. Stave owns **sum === 5**. Poise / Equal Gift own **equality ≥ 1**. Gaunt / Hollow Gift own **0+0**. Prime Gift (#1017) owns **exactly 1/1**. Gait Gift (#1082) owns **one-body AP ≥ 2 AND MP = 0** (overlaps (6,0) the way it already overlaps Score (4,0) and Stave (5,0) — one-body vs both-body). Dual Keep max surviving leftover is **2/2** (sum 4) — it **cannot** manufacture sum 6. Wave 16’s directed-diff `AP − MP === 2` **collides with Score at (3,1) and with this window at (4,2)**; excluding those sums from that diff is a sum-family in disguise. The discrete next leftover-sum is **6** (even, **equality banned** so (3,3) stays Poise). | **This pass:** Sestet Mend — **caster and target** leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**. Legal pairs **(6,0) (0,6) (5,1) (1,5) (4,2) (2,4)**. |
| Remaining `3` → `0` | Still open. Dock (#1063) writes `n===2` → `0`. Snuff (#1011) writes `n===1` → `0`. Tern (#1082) caps `n>3` → `3` (**threes stay 3**). Cap (#1017) compresses `n>2` → `2` (**threes become 2**). Floor (#906) compresses `n>1` → `1`. Rise (#962) pads `n===1` → `2`. Prime (#953) locks `n===0` → `1`. | **This pass:** Cadence Tierce (remaining `n===3` → `0`; zeros stay 0; `n===1`, `n===2`, and `n>3` unchanged) |
| Thirteen-cell occupy | Still open. Dodeca Span is twelve (3×4). Hendeca Span is eleven (stretched plus). Dec Span is ten (2×5). | **This pass:** Trideca Span (orthogonal plus **arm 3**, counts as **thirteen**; click = **center**, Hendeca rule) |
| Invert leftover on **one ally and one hostile** (caster stays) | Still open. Hymn Turn is **two allies**. Duel Turn is **two hostiles**. Purse Turn is **one** hostile. Tempo Invert is **one-body ally/self**. Bar Cross is two-body **cross** (caster AP ↔ target MP **and** caster MP ↔ target AP). | **This pass:** Psalm Turn — invert leftover AP↔MP independently on **one same-side non-caster body and one opposite-side body**; caster pools unchanged |
| Target-only sum===6 heal | **Held for SDE.** Gait Gift is **AP≥2/MP=0**, **not** this hole. | **Not this pass.** Do not mint `spell-sestet-gift` / `spell-six-gift` |
| Target-only sum===5 heal | **Still SDE leftover.** Stave Mend is both-body. Gait Gift is AP≥2/MP=0. | **Not this pass.** Do not mint `spell-stave-gift` |
| Target-only sum===4 / sum===3 heal | **Still SDE leftover.** Score / Tally Mend are both-body. Lean Gift is AP=0 and MP≥1. | **Not this pass.** Do not mint `spell-score-gift` / `spell-tally-gift` |
| Leftover AP − leftover MP === 2 (diff window) | Still open **and more colliding**. (3,1) is Score. (4,2) is Sestet (sum 6 unequal). (5,3) would be a later sum-8 family. | **Not this pass** (Wave 19). Do not mint a `spell-skew-*` family |
| Mid-RAF splice | Held (AGENTS.md) | Still held |
| Fourth `mpCost > 0` walk snipe | Held (Ley Toll / Undertow / Sanguine Toll) | Still held |
| Sixth echo id | Held | Still held |
| Player-owned Hex of Silence | Held (`BOSS_ONLY`) | Still held |
| Player-owned About Hinge | Held (`BOSS_ONLY` on #590) | Still held. Hostile 180° around a pair midpoint is still Pawn Trade. |

**This pass does not reuse any reserved id.** Every card below fills a hole that is still empty after the reserved set **and** after #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082. Every proposed spell is **data-only**: it must resolve from explicit `SpellConfig` / `effectParams` fields. `spell.name` is UI and battle-log copy. Targeting and effects must never branch on name.

Same-day Discovery Wave 18 **has not opened a PR at authoring**. **If that catalog later claims a unique leftover below, SDE wins** the unique §11 id; this catalog must not clone it. Do **not** clone #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 unique ids. Do **not** ship `spell-parched-mend` / `spell-cadence-floor` (second copy) / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` (second copy) / `spell-cadence-cap` (second copy) / `spell-cadence-dock` (second copy) / `spell-cadence-tern` (second copy) / `spell-tally-gift` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-prime-gift` (second copy) / `spell-gait-gift` (second copy). Stamp family / observe metadata onto Wave-18 **tactical** ids only. #1082 §0.2d already stamps #1063 as Wave **18** family CORE. **This catalog stamps as Wave 19 family CORE.**

Do **not** mint `spell-six-mend` / `spell-hexa-mend` / `spell-senary-mend` / `spell-sice-mend` / `spell-sext-mend` / `spell-hexad-mend` / `spell-sestet-gift` / `spell-both-sestet` (Sestet Mend owns both-body sum===6 **and unequal** heal; (3,3) stays Poise), `spell-cadence-tri` / `spell-cadence-three` / `spell-cadence-trey` / `spell-cadence-trine` / `spell-cadence-nix` / `spell-cadence-drop` / `spell-cadence-quash` / `spell-cd-tierce` (Cadence Tierce owns remaining `3` → `0`; Dock owns `2` → `0`; Snuff owns `1` → `0`; Tern owns `n>3` → `3`; Cap owns `n>2` → `2`; Floor owns `n>1` → `1`), `spell-thirteen-span` / `spell-triska-span` / `spell-tredec-span` / `spell-plus-span` / `spell-baker-span` (Trideca Span owns thirteen; Wave 7 tombstoned `spell-once-verse` as an echo, not this occupy), `spell-choir-turn` / `spell-pew-turn` / `spell-nave-turn` / `spell-mixed-turn` / `spell-aisle-turn` / `spell-anthem-turn` / `spell-canticle-turn` / `spell-vesper-turn` (Psalm Turn owns mixed-side independent invert, caster stays; Choir Hymn is a Wave-1 Discovery heal, **not** this invert), `spell-court-tri` / `spell-court-three` / `spell-court-trine` / `spell-court-nix` (Court Tierce is the mass signature), or `spell-sestet-plate` / `spell-sum-six-hood` (Sestet Hood owns sum===6 unequal any-range miss; do **not** retag `even_gallery` / Dual Plate / Spent Plate / Gait Plate / Prime Plate / Stave Hood / Score Hood / Tally Hood / Poise Hood).

---

## 1. Re-audit of the catalog that actually exists

Verified against `origin/main` @ `0f5363f`. Live combat catalog is unchanged since 2026-08-31. Discovery is still inert. WX is **19,213** lines (`wc -l`). Same HEAD as Waves 4–17. `WorldExploration.tsx` lives at `src/frontend/src/components/WorldExploration.tsx` (not `engine/`).

### 1.1 Frontend runtime catalog — `src/frontend/src/data/spellData.ts`

`SPELL_ID_CATALOG` (`src/frontend/src/data/bossKits.ts` 29–62) still lists **32** ids. `WorldExploration.tsx` 2395–2408 still maps **every** `starterSpells` row to `isBaseSpell: true` (“always shown, never removable”).

`ownedSpells` (2410–2440) still unions those 32 with backend rows that pass `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718). That helper only drops `usableByPlayer === false` unless the id is already owned. It does **not** create a discovery path.

| ID | Name | Family (actual) | AP | Payload | Range | Notes |
| :--- | :--- | :--- | ---: | :--- | ---: | :--- |
| `physical_attack` | Strike | direct physical | 2 | 10 | 1 | Only true melee baseline; only `isBaseSpell` in data |
| `starter-shield` | Shield | RES% buff | 2 | +30% RES / 3 | 3 | Ally/self |
| `starter-poison` | Poison Arrow | DoT poison | 2 | 4×3 | 4 | No upfront |
| `starter-blast` | Chain Lightning | chain | 4 | 20 + 2 bounces | 4 | Only bounce spell |
| `starter-heal` | Blood Mend | self heal + CHC | 3 | 12 + +15% CHC / 2 | 0 | Self only |
| `starter-drain` | Life Drain | drain + SP | 3 | 10 / heal 5 + SP×0.8 / 2 | 2 | |
| `starter-frost` | Frost Bolt | damage + MP | 3 | 20 + MP−1 / 1 | 4 | Debuff, not steal |
| `spell-swap` | Swap | caster ↔ enemy | 3 | 0 | 3 | Only live position spell; `isSwap` |
| `spell-mark` | Mark | tile amp | 2 | next hit ×2 | 4 | Tile, not unit |
| `spell-barrier` | Barrier | obstacle | 3 | wall 2 turns | 2 | Blocks walk **and** LoS |
| `spell-mirror` | Mirror | reflect 1 spell | 4 | 0 | 0 | Player-only in data |
| `spell-timestep` | Timestep | full AP/MP once | 0 | once/battle | 0 | Player-only |
| `spell-sacrifice` | Sacrifice | HP-cost burst | 3 | 20% HP ×3 | 1 | HP, not MP |
| `spell-lifesteal-nova` | Lifesteal Nova | AoE drain | 5 | 20 + heal 10/hit r=2 | 1 | Circle only |
| `spell-enrage` | Enrage | DMG buff | 3 | +40% / 2 | 3 | Duration, not next-cast |
| `spell-iron-skin` | Iron Skin | RES% buff | 3 | +30% RES / 3 | 3 | Duplicate of Shield |
| `spell-haste` | Haste | MP **grant** | 2 | +2 MP / 1 | 3 | Only MP grant |
| `spell-weaken` | Weaken | DMG debuff | 3 | ×0.7 / 2 | 3 | |
| `spell-slow` | Slow | MP debuff | 2 | −2 MP / 2 | 3 | Not a root; not a steal |
| `spell-expose` | Expose | dmg + RES/SP | 3 | 15 + ×0.8 / 2 | 3 | |
| `spell-venom-strike` | Venom Strike | DoT venom | 3 | 4×3 | 2 | Near-duplicate of Poison |
| `spell-rallying-cry` | Rallying Cry | self heal + CHC | 4 | 20 + +15% CHC / 2 | 0 | Near-duplicate of Mend |
| `spell-drain-courage` | Drain Courage | drain + AP | 4 | 18 / heal 9 + AP−1 | 2 | Only AP debit |
| `spell-cursed-wound` | Cursed Wound | dmg + anti-heal | 3 | 22 + healRecv ×0.5 / 2 | 3 | |
| `spell-shadow-veil` | Shadow Veil | dmg + RES/SP | 3 | 18 + ×0.85 / 2 | 3 | Near-duplicate of Expose |
| `spell-inferno` | Inferno | DoT burn | 5 | 8×3, CD 3 | 3 | Only frontend cooldown |
| `spell-frost-nova` | Frost Nova | AoE + slow | 4 | 15 + MP−1 r=2 | 1 | Circle only |
| `summon-dire-wolf` | Dire Wolf | hunter | 3 | Strike + Venom | 2 | Lifespan 4 |
| `summon-sentinel` | Sentinel | guardian | 3 | Shield + Iron Skin | 2 | Player-only |
| `summon-archer` | Archer | kiter | 3 | Poison + Slow | 2 | |
| `summon-bomber` | Bomber | kamikaze | 2 | Inferno | 2 | Player-only |
| `summon-wisp` | Wisp | mobile healer | 2 | Mend + Rally | 2 | Walks; not a totem |

**None** of these rows set `lineOfSight`, `linear`, `diagonal`, `modifiableRange`, `minRange`, or `maxRange`. **No row sets `mpCost` ≠ 0.** No row uses `targetType: "line"` even though `targeting.ts` 576–617 implements that branch. `areaShape` is typed (`gameTypes.ts` 224) but **targeting never reads `areaShape`** — area expansion is Chebyshev around `areaRadius` (`targeting.ts` 690–727). Confirmed: `rg areaShape src/frontend/src/engine/targeting.ts` is empty.

`CharacterStats.evasion` exists (`gameTypes.ts` 64) and is persisted. Combat never reads it. Do not ship a percent-evasion card.

Live `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). Quad Span (#636) counts as four, Penta Span (#695) as five, Six Span (#787) as six, Sept Span (#726) as seven, Oct Span (#849) as eight, Nine Span (#890) as nine, Dec Span (#953) as ten, Hendeca Span (#1011) as eleven, Dodeca Span (#1063) as twelve on paper; all nine are implementation-blocked until that cap (or a dedicated occupy-weight) exists. Trideca Span is the same class: **propose the hole, do not pretend it can ship against cap 2**.

### 1.2 Backend admin seed — `src/backend/lib/admin.mo` `defaultSpells()`

Six ids, still **not** in `SPELL_ID_CATALOG`. They carry targeting flags. All six still have `mpCost = 0`.

| ID | Name | AP | CD | Flags | Notes |
| :--- | :--- | ---: | ---: | :--- | :--- |
| `shadow_strike` | Shadow Strike | 3 | 2 | diagonal, no LoS, range 1–4 | Only diagonal poke |
| `soul_rend` | Soul Rend | 3 | 4 | LoS, DoT 25 | |
| `vampire_bite` | Vampire Bite | 3 | 2 | drain 20/20, adjacent | |
| `reflect_barrier` | Reflect Barrier | 3 | 3 | self, defense | Mirror clone |
| `thunder_clap` | Thunder Clap | 4 | 3 | 8-dir AoE 25 via `hitTiles` | Closest thing to a cross |
| `void_collapse` | Void Collapse | 12 | 5 | attract-all + 80 AoE, `minLevel` 30 | Do not copy |

`OLD_SPELL_NAMES_SET` (`WorldExploration.tsx` 2356–2389) still filters by **name and id**. That heuristic is forbidden going forward.

### 1.3 Engine support vs catalog use (still true, line numbers at this HEAD)

| Mechanic | Engine @ `0f5363f` | Live catalog | Already proposed (reserved) |
| :--- | :--- | :--- | :--- |
| Spell `mpCost` debit | `executeCastAttempt` (`WorldExploration.tsx` 17096–17207) gates **AP only** (`17162–17165`). | Always 0 | Ley Toll / Undertow / Sanguine Toll. **No fourth snipe this pass.** |
| `areaShape` cone / cross / line | Typed, **unread**. Area = Chebyshev (`targeting.ts` 690–727) | Unused | Fan Bolt / Cross Cut reserved |
| `targetType: "line"` | Implemented 8-dir ray (`targeting.ts` 576–617) | **No spell** | File Lance |
| `applyPushback` / `applyAttract` | Implemented (`occupancy.ts` 482 / 537), **no cast callers** (tests only; `rg` empty in WX) | Unused | Shoulder Bash, Hook Line. Sestet Step / Psalm Turn relocate leftover **pools**, not tiles. Psalm Turn is **not** `isSwap`. |
| `isSwap` | Caster ↔ one enemy (`spellEngine.ts` 637, 767–768 → WX `swapPositions` 9389) | Swap | Pawn Trade / Ward Interpose / Cadence Tierce is **not** `isSwap` (cooldown remaining, not tiles) |
| Map `portals` set | Occupancy treats portal tiles as **impassable** (`occupancy.ts` 13–14, 40) | World transitions | Twin Gate uses `gatePads`, never this set |
| `isTrap` | Still `placeBarrier(..., 3)` (`spellEngine.ts` 442–445) | No trap row | Tripwire |
| Walk / leftover / force flags | Paper `walkMpSpentThisTurn` (Waves 6–10). Paper `forcedMovedThisTurn` (Wave 9). Leftover AP/MP die at turn end unless Dual Keep / Purse Keep / Stride Keep | Haste grants **now**; Timestep is full **now** | **This pass: Sestet Mend / Sestet Hold / Sestet\* / Must Sestet / Verse Sestet / Psalm Turn / Court Tierce** |
| Thirteen-cell occupy | Twin=2 … Dodeca=12 (3×4) | Absent | **This pass: Trideca Span** (plus arm 3 = 13) |
| Remaining CD rewrite | Theft **steals**; Imprint **copies**; Swap (#837) **exchanges full maps**; Rest skips **own** tick; Halve **÷2**; Grace skips **starting** the next own CD; Stall **+1**; Lag **+2**; Floor (#906) `n>1` → `1`; Prime (#953) `n===0` → `1`; Rise (#962) `n===1` → `2`; Snuff (#1011) `n===1` → `0`; Cap (#1017) `n>2` → `2`; Dock (#1063) `n===2` → `0`; Tern (#1082) `n>3` → `3` | Inferno CD 3 is the only live lock | **This pass: Cadence Tierce (remaining n===3 → 0; n===1, n===2, and n>3 unchanged)** |
| Leftover sum (AP + MP === N) | Tally family is **sum === 3**. Score family is **sum === 4 AND unequal**. Stave family is **sum === 5**. Poise family is **equality ≥ 1**. Gaunt family is **both leftover 0**. Equal Gift is **target equality ≥ 1**. Prime Gift is **exactly 1/1**. Gait Gift is **one-body AP ≥ 2 AND MP = 0**. Tied Gait is both leftover **exactly 2**. Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. | Unused live | **This pass: Sestet\* (sum === 6 AND unequal; even sum, (3,3) banned)** |
| One-body leftover AP↔MP | Tempo Invert (`invertApMp`, ally/self). Purse Turn (hostile one-body). Bar Cross (two-body **cross**). Duel Turn (two hostiles, independent invert, caster stays). Hymn Turn (two allies, independent invert, caster stays). | Absent live | **This pass: Psalm Turn (one same-side non-caster + one opposite-side, independent invert, caster stays).** Do not reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp`. |

### 1.4 Reserved id tombstone (do not collide)

**Wave 1 tactical:**  
`spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**Discovery Wave 1:**  
`spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Boss adaptations (`BOSS_AND_SPELL_DISCOVERY.md` §5.2):**  
`spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 2 tactical / Discovery Wave 2 / Wave 3 tactical / Discovery Wave 3 / Wave 4 tactical / Discovery Wave 4 / Memory Wave 5 SDE / Wave 5–16 tactical / Discovery Waves 6–16:** reserved in Waves 2–17 documents and in #1082 §0.1. Do not collide. Memory Wave-5 SDE ids stay tombstoned (`spell-gaze-sill` … `spell-void-span`).

**Wave 17 tactical (#1063 — still open; never re-propose / never clone).** Unique remaining ids stamp as Wave-18 family CORE:  
`spell-stave-mend`, `spell-cadence-dock`, `spell-dodeca-span`, `spell-hymn-turn`, `spell-stave-hood`, `spell-stave-sting`, `spell-stave-step`, `spell-stave-sill`, `spell-stave-hold`, `spell-stave-lend`, `spell-stave-sip`, `spell-stave-post`, `spell-stave-bounce`, `spell-must-stave`, `spell-verse-stave`, `spell-court-dock`.

**Discovery Wave 17 (#1082 — still open; never re-propose / never clone; SDE wins Gait Gift / Cadence Tern / Prime Plate):**  
`spell-tern-stride`, `spell-octa-oath`, `spell-mire-reel`, `spell-diag-bite`, `spell-summon-mark`, `spell-prime-plate`, `spell-slide-skip`, `spell-capped-sting`, `spell-summon-orth`, `spell-gait-gift`, `spell-cadence-tern`, `spell-odd-toll`, `spell-brick-tax`, `spell-watch-tax`, `spell-thin-gait`, `spell-lava-cut`, `spell-strike-plate`, `spell-pack-ring`, `spell-lane-fold`.

**Known same-id collisions already on paper (not this pass’s job to rename):**  
`spell-file-lance` and `spell-blood-tithe` (tactical W2 vs Discovery W2). `spell-cadence-floor` (tactical #890 vs Discovery #906 — **SDE wins**; this pass does not add a third).

**Fantasy overlaps to not clone:** Short Sight ≈ Paper Wind; Tempo Gift ≈ Loan Tempo; Goad ≈ Taunt Oath; Rime Tile ≈ Rime Sheet; Lens Shift / Overcast; Poise Mend ≈ Equal Gift (both-body vs target equality); Tally Mend ≈ Lean Gift (sum===3 vs AP=0-and-MP≥1); Score Mend ≈ Prime Gift (both-body sum 4 unequal vs exactly 1/1); Stave Mend ≈ Gait Gift (both-body sum 5 vs one-body AP≥2/MP=0); Cadence Floor / Prime / Rise / Snuff / Cap / Dock / Tern are **filled**; Tempo Invert ≈ Purse Turn (ally vs hostile invert — **filled**); Purse Turn ≈ Duel Turn (one hostile vs two hostiles — **filled**); Duel Turn ≈ Hymn Turn (two hostiles vs two allies — **filled**); Hymn Turn ≈ Psalm Turn (two allies vs mixed sides — **this pass fills the mixed-side card, does not clone the two-ally card**). Psalm Turn is **not** Choir Hymn.

**Duplicates still forbidden to clone:** Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier; Dry Mend / Dry Gait / Parched Mend; Hollow Gift / Gaunt Mend; Cadence Swap / Cadence Floor / Cadence Prime / Cadence Rise / Cadence Snuff / Cadence Cap / Cadence Dock / Cadence Tern.

---

## 2. Remaining gap map (after reserved proposals)

| Family | Still missing (this pass) | Not this pass (already reserved or live) |
| :--- | :--- | :--- |
| SUPPORT leftover-sum heal | Both-body leftover AP + leftover MP **=== 6 AND unequal** | Tally Mend (sum 3); Score Mend (sum 4 unequal); Stave Mend (sum 5); Poise Mend / Equal Gift (equality); Gaunt / Hollow Gift (0+0); Dry Mend / Dry Gait; Lean Gift; Prime Gift (exactly 1/1); Gait Gift (AP≥2/MP=0) |
| CONTROL remaining 3→0 | Ready-triple ids (`n===3`) write `0` | Snuff `1→0`; Dock `2→0`; Rise `1→2`; Prime `0→1`; Floor `n>1→1`; Cap `n>2→2`; Tern `n>3→3`; Stall/Lag pad; Flush/Crack →0 |
| SUMMONS thirteen-cell occupy | Orthogonal plus arm 3, counts as thirteen | Twin…Dodeca Span |
| CONTROL mixed-side invert | Leftover AP↔MP on **one ally and one hostile**; caster stays | Tempo Invert (ally/self); Purse Turn (one hostile); Bar Cross (two-body cross); Duel Turn (two hostiles); Hymn Turn (two allies) |
| DEFENSE / DAMAGE / TERRAIN sestet family | Hood / Sting / Step / Sill / Hold / Lend / Sip / Post / Bounce / Must / Verse | Stave\* / Score\* / Tally\* / Poise\* / Gaunt\* / Lean\* / Dry\* |
| SIGNATURE mass Tierce | Court Tierce | Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag / Court Imprint |

**Still open after this wave (do not fill today):** mid-RAF splice; fourth walk-MP snipe; sixth echo id; player-owned Hex of Silence; player-owned About Hinge; leftover AP − leftover MP === **2** (diff window; (3,1) is Score; (4,2) is Sestet); remaining `n===4` → `0`; fourteen-cell occupy; **target-only** sum===6 heal (leave for SDE); **target-only** sum===5 / sum===4 / sum===3 heal (still SDE leftovers); leftover AP + leftover MP === **7**; invert leftover on **caster and one hostile** (caster participates). Those stay Wave 19 so this pass stays discrete.

---

## 3. Contract with Dynamic Spell Discovery

Coordinate with Discovery (`c26e5a83-…`) and Admin (`4efa22ec-…`). This pass only stamps acquisition so those layers can filter **by field**.

### 3.1 Discovery is still inert (reconfirmed @ `0f5363f`)

1. All 32 frontend spells are forced `isBaseSpell` (`WorldExploration.tsx` 2395–2408).
2. Recap grants XP/Doka/feats only.
3. Achievements (`defaultAchievements`, `admin.mo` 309–326) grant Doka only.
4. Challenges (`DEFAULT_CHALLENGES` 44–103) grant Doka/XP/badge only.
5. `upgradeSpell` levels a known id; it does not unlock ids.
6. `ENEMY_KITS` (`enemyAI.ts` 163–185) still reuse always-owned ids. Seeing a bishop cast Frost teaches nothing.
7. `buildEnemyKit` still takes `levelZone`. Discovery already recorded that a non-number → `NaN` → every kit stays zone 0.
8. `executeCastAttempt` still does not debit `spell.mpCost`. Combined paper `mpCost > 0` remains Ley Toll / Undertow / Sanguine Toll — **no fourth**.
9. `inferArchetype` still treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452). Sestet Mend **must not** land in non-healer CORE; keep `healAmount: 0` on the row.

**Prerequisite (owned by Discovery, not this pass):** split the 32-id blob. Innate seed remains Strike + Shield + Poison Arrow + Blood Mend. Do **not** append Wave 18 ids to `starterSpells` as base. Do **not** land Wave-18 data before Wave-1 ownership split (`SDE-2026-08-31-001`). CDA-030 (#982) still freezes **shipping** Wave-15/16 live rows until those gates exist; this document is sequential Wave 18 **design only**.

### 3.2 Rules for every proposed spell

- Persist grants through the **same atomic recap/backend funnel** as rewards (`ownedSpellIds` on the character, not `localStorage` as authority).
- Filters: `usableByPlayer` / `usableByEnemy` / `minLevel` / `acquisitionModel` / `discoveryEligible` / `discoverySources`.
- Enemy AI selects by **id** in `assignedSpells` / `summonKit` / `aiHint`, never `spell.name.includes(...)`. New `summonAI: "tridecaspan"` / `"sestetpost"` are **string enums on the config**, not a parse of `"Trideca Span"` / `"Sestet Post"`.
- `NOT_PLAYER_LEARNABLE` may appear in kits so the player can *see* them. Witness without grant. Maps to Discovery `ENEMY_ONLY` / `BOSS_ONLY` for persist (never written to owned ids).
- Default observe path (Discovery §3): hostile **uses** the id (WX `kind: "cast"` + AP spend) → persist observation → **same-encounter win** → `commitSpellDiscoveries`. Possession is not observation. Hit is not required. Fizzle that spent AP **does** observe.
- Trideca Span / Sestet Post **arming** (body placed, AP spent) **is** observation. A later occupy / detonate is **not** a second observe.
- Cadence Tierce **resolve** (even if every remaining was already ≠ 3) **is** observation if AP was spent.
- Do not require “see it N times”. Wave 18 defaults `allowLaterVictory: false`.
- Do not gate on `unstoppable` / `level_10`.
- Do not stamp `survivor` (Last Ember / Last Ward). #646 / #679 / #747 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 left that feat leftover on purpose.

### 3.3 Acquisition model meanings (unchanged)

| Model | Grant when | Typical `usableByEnemy` |
| :--- | :--- | :--- |
| `ENEMY_DISCOVERY` | Witness + same-encounter win | true |
| `ELITE` | Same, elite/champion tag | true |
| `BOSS` | First victory vs listed `bossIds` | true on that boss |
| `ACHIEVEMENT` | Claim of listed achievement (plus existing Doka) | usually false |
| `CHALLENGE` | Complete listed challenge id | usually false |
| `MULTI_SOURCE` | First completed child wins; no double copy | mixed |
| `NOT_PLAYER_LEARNABLE` | Never written to owned ids | true (kit-only) |

### 3.4 Doors this pass actually stamps (avoid taken keys)

**Every live feat and every live challenge id is already a sole spell door or a MULTI child.** Wave 18 does **not** restamp `first_blood`, `survivor`, `spell_scholar`, `doka_hoarder`, `explorer`, `betrayal_witness`, `leader_slayer`, `jackpot`, `loot_hunter`, `double_betrayal`, `unstoppable`, `spell_master`, `critical_striker`, `pacifist_run`, `rich_vampire`, `easy_*`, `hard_*`, `legendary_*`. Wave 18 does **not** invent a 16th feat.

**Live 19 first-wins are all taken (do not restamp as the only door):**  
`starborn_queen` (Cut In), `pale_archivist` (After Verse), `starved_vampire_pawn` (Sanguine Toll), `lord_of_static` (Draw Together), `final_pawn` (Eclipse Fold), `mirror_sovereign` (Echo Cast), `crimson_countess` (Crimson Pact), `void_grandmaster` (Twin Gate), `midnight_bishop` (Life Tether), `chessboard_lich` (Claim Ward), `twin_monarchs` (Choir Hymn), `alabaster_fortress` (Pain Link / Aftershock), `bone_cavalier` (Vault / Caltrop), `pale_archbishop` (Reliquary / Glyph Snare extras), `fetid_rook` (Rot Brand), `broodmother_rook` (Brood Ward), `weeping_pawn` (Mute Thread, #411), `eternal_pawn_king` (Queue Cut, #411), `enthroned_void` (File Vault MULTI child, #411). `second_lament` remains kit-only False Cut.

**Wave-5…18 boss extra doors — do not restamp:** `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald`, `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor`, `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`, `gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`, `toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`, `crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`, `sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`, `infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`, `flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`, `effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`, `jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`, `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`, `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`, `slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`.

**Wave-6…17 tactical extra doors — do not restamp:** `oath_censor`, `hinge_porter`, `exit_mason`, `about_regent`, `pace_prelate`, `span_triune`, `wick_mason`, `slip_castellan`, `court_usher`, `gait_cantor`, `pair_usher`, `flush_precentor`, `dummy_castellan`, `court_hinge_regent`, `shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `court_stretch_regent`, `both_cantor`, `stride_bursar`, `span_penta`, `trim_precentor`, `court_keep_regent`, `heave_cantor`, `dual_bursar`, `span_sept`, `halve_precentor`, `court_dual_regent`, `parched_cantor`, `imprint_precentor`, `span_six`, `court_imprint_regent`, `gaunt_cantor`, `lag_precentor`, `span_oct`, `court_lag_regent`, `poise_cantor`, `floor_precentor`, `span_nine`, `court_floor_regent`, `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`, `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`, `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`. `parched_cantor` is **not** Dry Gait’s door and **not** Sestet Mend’s door. `stave_cantor` stays Stave Mend. `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `dock_precentor` stays Dock. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor (#890 door). SDE teaches Tern via Wave-17 unique pools (`cadence_thief` / `hex_chorister`) — do not restamp `tern_precentor` if #1082 later mints one as a tactical door.

**Wave-8…17 SDE extras — do not restamp:** `about_hinge_regent`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `pair_gallery`, `knight_fold_regent`, `inch_gallery`, `rite_nave`, `reach_nave`, `ash_aisle`, `pin_nave`, `close_precentor`, `mid_fold_regent`, `diag_gallery`, `mid_nave`, `void_aisle`, `dwell_pulpit`, `crack_nave`, `long_precentor`, `adj_fold_regent`, `orth_gallery`, `tri_nave`, `brick_aisle`, `wake_pulpit`, `orbit_nave`, `cap_precentor`, `reach_fold_regent`, `knight_gallery`, `quad_nave`, `pit_aisle`, `shunt_pulpit`, `nudge_nave`, `file_precentor`, `diag_fold_regent`, `rank_fold_regent`, `file_gallery`, `hexa_nave`, `lava_aisle`, `strike_pulpit`, `shock_nave`, `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `leap_fold_regent`, `tern_gallery`, `octa_nave`, `bog_aisle`, `spawn_pulpit`, `belt_nave`, `hoop_precentor`, `lane_fold_regent`. Do **not** retag `even_gallery` as Sestet Hood. Do **not** consume encounter-catalog `ENC-*` rooms. Do not name unique families `sestet_mender` / `cadence_tiercer` / `trideca_prelate` / `stave_mender` / `cadence_docker` / `dodeca_prelate` / `score_mender` / `file_warder`.

**New proposed extra doors for the boss designer (Wave 19 sheets; not live `BOSS_IDS`):**

| Door | Spell |
| :--- | :--- |
| `sestet_cantor` first-win | Sestet Mend MULTI child (observe+win still grants). `stave_cantor` stays Stave Mend. `score_cantor` stays Score Mend. `tally_cantor` stays Tally Mend. `poise_cantor` stays Poise Mend. `gaunt_cantor` stays Gaunt Mend. `parched_cantor` stays the dropped Parched Mend slot — **do not reuse**. Equal Gift / Lean Gift / Prime Gift / Gait Gift have **no** extra door — do not invent `equal_cantor` / `lean_cantor` / `prime_cantor` / `gait_cantor_gift` / `sum_cantor` / `six_cantor`. |
| `tierce_precentor` first-win | Cadence Tierce MULTI child. `dock_precentor` stays Dock. `snuff_precentor` stays Snuff. `prime_precentor` stays Prime. `floor_precentor` stays Floor. `lag_precentor` stays Lag. `imprint_precentor` stays Imprint. `halve_precentor` stays Halve. `cap_precentor` stays Pack Cap. `file_precentor` stays Pack File (`ENEMY_ONLY`). Do **not** mint `rise_precentor` / `tern_precentor` / `three_precentor` / `trine_precentor` / `nix_precentor`. |
| `span_trideca` first-win | Trideca Span MULTI child. `span_dodeca` stays Dodeca Span. `span_hendeca` stays Hendeca Span. `span_dec` stays Dec Span. `span_nine` stays Nine Span. `span_oct` stays Oct Span. `span_six` stays Six Span. `span_sept` stays Sept Span. `span_penta` stays Penta Span. `span_quad` stays Quad Span. `span_triune` stays Triple Span. Do **not** mint `span_thirteen` / `span_plus` / `span_baker`. |
| `court_tierce_regent` kit only | Court Tierce (`NOT_PLAYER_LEARNABLE`). `court_dock_regent` stays Court Dock. `court_snuff_regent` stays Court Snuff. `court_prime_regent` stays Court Prime. `court_floor_regent` stays Court Floor. `court_lag_regent` stays Court Lag. `court_imprint_regent` stays Court Imprint. `reach_fold_regent` stays Reach Fold. `diag_fold_regent` stays Diag Fold. `rank_fold_regent` stays Rank Fold. `leap_fold_regent` stays Leap Fold. `lane_fold_regent` stays Lane Fold. Do **not** mint `court_three_regent` / `court_trine_regent`. |

Piece-type observe paths (not feat doors): cantors / bishops for Sestet Mend; scribes / tempo for Cadence Tierce; masons / rooks ELITE for Trideca Span; hex / queens for Psalm Turn; lurkers / knights for Sestet Hood; lurkers / pawns for Sestet Sting; porters / queens for Sestet Step; masons / rooks for Sestet Sill; hex / knights for Sestet Hold; buffers / bishops for Sestet Lend; hex / pawns for Sestet Sip; masons / pawns for Sestet Post; queens / bishops for Sestet Bounce; knights / pawns for Must Sestet; hex / bishops for Verse Sestet.

### 3.5 New `effectParams` keys for this pass

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 / #371 / #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 key names for a different meaning. Do **not** reuse `invertApMp` (Tempo Invert). Do **not** reuse `invertHostileLeftoverApMp` (Purse Turn). Do **not** reuse `crossLeftoverApMpTwoBody` (Bar Cross). Do **not** reuse `invertTwoHostilesLeftoverApMp` (Duel Turn). Do **not** reuse `invertTwoAlliesLeftoverApMp` (Hymn Turn). Do **not** reuse `floorRemainingCdsTo1` (Cadence Floor). Do **not** reuse `primeRemainingCdsFrom0` (Cadence Prime). Do **not** reuse `snuffRemainingCdsEq1To0` (Cadence Snuff). Do **not** reuse `capRemainingCdsAbove2To2` (Cadence Cap). Do **not** reuse `dockRemainingCdsEq2To0` (Cadence Dock). Do **not** reuse `capRemainingCdsAbove3To3` (Cadence Tern). Do **not** reuse `tallySumN` / `scoreSumN` / `staveSumN` / `scoreForbidEqual`. Do **not** reuse `hendecaSpanCells` / `decSpanCells` / `nineSpanCells` / `nineSpanSolid` / `dodecaSpanCells` / `dodecaLong` / `dodecaShort`. Do **not** reuse `requireLeftoverApEq1AndMpEq1` (Prime Gift). Do **not** reuse `requireLeftoverApGe2AndMpEq0` (Gait Gift).

`mpCost` stays 0 on every Wave-18 row.

**New keys (Wave 18 only):**

```text
requireCasterLeftoverSumEq, requireTargetLeftoverSumEq, sestetSumN, sestetForbidEqual, sestetMendAmount,  // Sestet Mend — AP+MP === 6 AND unequal on both bodies
tierceRemainingCdsEq3To0,                                                                                 // Cadence Tierce — remaining n===3 → 0; n===1, n===2, n>3 unchanged
tridecaSpanCells, tridecaArm,                                                                             // Trideca Span — 13; orthogonal plus arm 3
invertMixedSidesLeftoverApMp, invertMixedSearchRadius, invertMixedExcludeCaster, invertMixedNeedSameSideNonCaster,  // Psalm Turn — one same-side non-caster + one opposite-side; caster unchanged
sestetHoodNextHit,                                                                                        // Sestet Hood — next hit while sum===6 unequal, any range → 0
sestetLeftoverSumEq, sestetStingBonus,                                                                    // Sestet Sting
sestetStepNeedSumEq, sestetStepAdj,                                                                       // Sestet Step — dest Chebyshev 1 of target
sestetSillNeedSumEq, sestetSillDamage, sestetSillDuration,                                                 // Sestet Sill — start-of-their-turn tax
sestetHoldWhileSumEq, sestetHoldDuration,                                                                 // Sestet Hold — 2 of their turns
sestetLendAp, sestetLendMp, requireTargetSumEqLend,                                                       // Sestet Lend — +1 AP and +1 MP iff sum===6 unequal (exits window)
sestetSipAp, requireTargetSumEqSip,                                                                       // Sestet Sip — steal 1 leftover AP iff sum===6 unequal
sestetPostDetonateDamage, sestetPostNeedSumEq,                                                            // Sestet Post — 10 on end-turn occupy if sum===6 unequal
sestetBounceNeedSumEq, sestetBounceSearchRadius, sestetBounceCount,                                       // Sestet Bounce
mustNonStrikeUnlessSumEqAndSpendsLastAp,                                                                  // Must Sestet — pre-spend leftover (same key name as Must Stave/Score; sestetSumN distinguishes)
verseSestetUntilSumEq,                                                                                    // Verse Sestet
courtTierceExcludeCaster                                                                                  // Court Tierce
```

If a key is missing, the rider does not fire. `sestetSumN` is **6** on every Sestet\* row that names a sum. Missing `sestetSumN` → gate fails closed (do not guess 6 from the name; do not treat (3,2) as Sestet; do not treat (3,3) as Sestet). `sestetForbidEqual` is **required**: leftover sum 6 **can** be a tie at (3,3). Missing `sestetForbidEqual` → fail closed (do not silently heal (3,3) and steal Poise Mend). Do not treat `sestetForbidEqual` as optional because Stave (odd) needed no equality flag.

Nested kit-only id (not a player card): none new besides Court Tierce itself. Sestet Post’s detonate is **not** a second spell id (the summon row carries `sestetPostDetonateDamage`). Do not mint `spell-sestet-burst`.

Leftover AP / leftover MP are **current remaining after this spell’s AP is paid**, read from the same pools the HUD uses — **except Must Sestet**, which reads leftover **before** debit (a “spends last AP” gate is otherwise impossible once leftover AP is already 0). Walk spends must write leftover MP. Spell spends must write leftover AP. Missing leftover → the gate fails closed (fizzle rider, AP spent, observe). Dual Keep / Purse Keep / Stride Keep leftover that **survives** turn start **does** count as leftover for these gates. **Dual Keep caps surviving leftover AP and leftover MP at 2**, so Dual Keep leftover sums to **at most 4**. Dual Keep **cannot** open Sestet (sum 6). Sum is integer `leftoverAp + leftoverMp`. Leftover `0 + 0` is **not** a Sestet window (sum 0). Leftover `3 + 0` is **not** a Sestet window (sum 3, Tally). Leftover `3 + 1` is **not** a Sestet window (sum 4, Score). Leftover `3 + 2` is **not** a Sestet window (sum 5, Stave). Leftover `2 + 2` is **not** a Sestet window (sum 4 **and** a tie, Poise). Leftover `3 + 3` is **not** a Sestet window (sum 6 **and** a tie, Poise — `sestetForbidEqual`). Leftover `1 + 1` is **not** a Sestet window (Prime Gift / Poise). Legal pairs after a successful Sestet gate: **(6,0) (0,6) (5,1) (1,5) (4,2) (2,4)** only.

A 6 AP / 3 MP bar that pays this heal’s 3 AP lands at leftover **(3,3)** — that is Poise, **not** Sestet. The intended bank is a **7+ AP** bar (or Haste / Tempo Gift / Score Lend) so the post-debit pair is unequal.

---

## 4. Power budget (relative, not a new math model)

Do not touch damage formulas. Numbers are base `SpellConfig.damage` / effect params; existing `spellDmgGrowthPercent` / `upgradeSpell` apply.

| Band | AP | Expected payload | Anchor |
| :--- | ---: | :--- | :--- |
| Cheap tool | 2 | 8–12 dmg **or** strong position/control, not both at full | Strike 10 / Slow |
| Standard | 3 | ~18–22 **or** 12 + movement **or** clean utility | Frost 20 / Swap |
| Heavy | 4–5 | AoE / delayed / summon, CD 2–3 | Chain / Inferno |
| Signature | 6 + CD 4+ | Multi-axis; usually not player-learnable | Do not copy Void Collapse 12/80 |

Conditional riders stay small so the **decision** is the power. Cadence Tierce’s ready-unlock of remaining-3 is paid in **currently remaining 3**, not in extra AP. Sestet Mend’s 8 is paid in **two sum===6 unequal bars on two bodies** after a 3-AP debit (Stave Mend is the two-body sum-5 cousin; Score Mend is the two-body sum-4-unequal cousin; Tally Mend is the two-body sum-3 cousin). Dual Keep cannot fake this window — the player (or Haste / Tempo Gift / Score Lend / a 7+ leftover bar after a 3-AP spend) has to actually sit on six **unequal**.

Do **not** put Must Sestet in the same CORE as a Strike-only sestet lock (this pass does not ship that lock). Do **not** CORE Sestet Hood with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Poise Hood, Tally Hood, Score Hood, or Stave Hood. Do **not** CORE Sestet Mend with Hollow Gift, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Lean Gift, Prime Gift, or Gait Gift. Do **not** CORE Psalm Turn with Tempo Invert, Purse Turn, Bar Cross, Duel Turn, or Hymn Turn. Do **not** CORE Cadence Tierce with Cadence Dock, Snuff, Tern, Rise, Prime, Floor, Cap, Halve, Trim, Crack, or Flush.

---

## 5. Proposed spells (Wave 18)

All rows: `STATUS: PROPOSED`. `mpCost: 0`. `isBaseSpell: false`. None of these ids exist in `spellData.ts` or in the reserved tombstone (§1.4).

---

### SPELL_ID: `spell-sestet-mend`

NAME: Sestet Mend  
ROLE: SUPPORT — heal if caster **and** target leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetMendAmount":8}`. If **both** caster and target have leftover AP + leftover walk MP **=== 6 AND leftover AP ≠ leftover MP** at resolve (after this spell’s 3 AP is paid), heal the target 8 through the existing heal helper. If either sum ≠ 6 **or** either pair is a tie, fizzle rider (AP spent, no HP). Walk / force-move flags do **not** substitute. Distinct from Stave Mend (#1063, **both bodies leftover AP + leftover MP === 5** — odd sum, never an equality), Score Mend (#1011, **both bodies leftover AP + leftover MP === 4 AND leftover AP ≠ leftover MP** — even sum, equality banned), Tally Mend (#953, **both bodies leftover AP + leftover MP === 3** — odd sum, never an equality), Poise Mend (#890, **both bodies leftover AP === leftover MP ≥ 1**), Equal Gift (#906, **target only** leftover AP == leftover MP ≥ 1; caster leftover unread), Prime Gift (#1017, **target leftover AP exactly 1 AND leftover MP exactly 1**), Gait Gift (#1082, **one body leftover AP ≥ 2 AND leftover MP = 0** — (6,0) is Gait Gift **and** a Sestet pair; Sestet Mend still requires **both** bodies and `sestetForbidEqual`), Hollow Gift (#837, **target only** leftover AP=0 **and** leftover MP=0), Gaunt Mend (#849, **both bodies leftover AP=0 and leftover MP=0**), Lean Gift (#962, leftover **AP = 0 and leftover MP ≥ 1**), Dry Mend (#747, both leftover **AP = 0**, MP unconstrained), Dry Gait (#802, both leftover **MP = 0**, AP unconstrained), Ready Sting (leftover AP≥1 **and** MP≥1 with **no sum**), Tied Gait (#906, leftover AP **and** leftover MP **exactly 2**), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**). Legal pairs: (6,0) (0,6) (5,1) (1,5) (4,2) (2,4). The decision: two bodies **sum to 6 without tying** — Dual Keep 2/2 is Poise **and** Score-blocked, **not** Sestet (sum 4); Dual Keep **cannot** open Sestet; a 6 AP / 3 MP bar that pays this 3 AP lands at **(3,3)** and **fails** (`sestetForbidEqual` — that is Poise Mend’s window); sit on 7 leftover AP and 2 leftover MP after paying the heal, or Score Lend a (3,1) into (4,2). `healAmount` stays 0 on the row so `inferArchetype` (`enemyAI.ts` 447–452) does not treat a kit that only *carries* this id as healer; **healer CORE only** when the row is in a live pool.  
DURATION: instant  
SCALING: 8 follows heal% if any; amount otherwise fixed.  
SYNERGIES: Haste / Tempo Gift / Timestep to bank six unequal after the 3-AP spend; Score Lend **manufactures** Sestet ((3,1)→(4,2)); Sestet Lend **exits** to 8; Psalm Turn **keeps** sum 6 on both bodies when both were already unequal.  
COUNTERPLAY: Spend a pool so either body leaves 6; Dual Keep (caps at 2, **blocks** Sestet); sit on 3/3 (Poise) or 3/2 (Stave) or 3/1 (Score) or 2/1 (Tally) or 2/2 (Poise) or 1/1 (Prime Gift).  
POWER_BUDGET: Standard heal, gated on **two** leftover sums of 6 unequal (four leftover reads + two equality bans). Blood Mend is 12 ungated self. Stave Mend is 8 on **two sum-5** bodies. Score Mend is 8 on **two sum-4 unequal** bodies. Dual Keep cannot fake this.  
AI_USAGE: `aiHint: "heal_if_both_bodies_leftover_ap_plus_mp_eq_6_unequal"`. Cantors / bishops. Skip if either leftover sum ≠ 6 or either pair is a tie. **Healer CORE only.** Do not dump leftover **only** to enable this if a Strike would kill.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: true`, `discoveryWeight: 10`, `discoverySources: { pieceTypes: ["bishop","queen"], levelZoneMin: 1 }`. MULTI child `sestet_cantor`.  
EDGE_CASES: Targeting ally already allows self (`targeting.ts` 184–189). Self-cast requires the caster’s leftover sum === 6 **and** unequal (two keys, two reads of one body). Self-cast at leftover 3/3 **does not** collide with Poise Mend / Equal Gift — `sestetForbidEqual` fails. Self-cast at leftover 0/0 **does not** collide with Hollow Gift / Gaunt Mend — sum 0 fails `sestetSumN`. Self-cast at leftover 2/2 **does not** collide with Poise Mend / Equal Gift / Tied Gait / Dual Plate — sum 4 fails `sestetSumN`. Self-cast at leftover 3/2 **does not** collide with Stave Mend — sum 5 fails `sestetSumN`. Self-cast at leftover 3/1 **does not** collide with Score Mend — sum 4 fails `sestetSumN`. Self-cast at leftover 3/0 **does not** collide with Tally Mend — sum 3 fails `sestetSumN`. Self-cast at leftover 1/1 **does not** collide with Prime Gift — sum 2 fails `sestetSumN`. Self-cast at leftover 6/0 **does** fire, and is **not** a Gait Gift clone (Gait Gift is one-body AP≥2/MP=0 with no second-body read). Player-side HP actually increased → `challengeHealUsedRef`. Missing keys → no heal. Missing `sestetSumN` **or** missing `sestetForbidEqual` → fail closed. Do not clone Stave Mend / Score Mend / Tally Mend / Poise Mend / Equal Gift / Gaunt Mend / Lean Gift / Prime Gift / Gait Gift / Dry Mend / Dry Gait. Target-only sum===6 heal stays Wave 19 / SDE. If same-day SDE Wave 18 claims this leftover, **SDE wins** — keep both-body vs their target-only the way Score vs a future Score Gift / Stave vs Gait Gift already split.  
IMPLEMENTATION_COMPLEXITY: LOW — four leftover reads + equality ban + existing heal helper.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-sestet-mend
effectType: heal
effectCategory: heal
targetType: ally
areaShape: single
apCost: 3
mpCost: 0
damage: 0
healAmount: 0
range: 3
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"requireCasterLeftoverSumEq":true,"requireTargetLeftoverSumEq":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetMendAmount":8}
```

---

### SPELL_ID: `spell-cadence-tierce`

NAME: Cadence Tierce  
ROLE: CONTROL — remaining CDs `n===3` become `0`  
ACQUISITION: MULTI_SOURCE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"tierceRemainingCdsEq3To0":true}`. For each spell id in the **target’s** remaining-CD map with `n === 3`, write `0`. Zeros stay 0. Remaining `n===1` **unchanged** (Snuff’s window). Remaining `n===2` **unchanged** (Dock’s window). Remaining `n>3` **unchanged** (Tern / Cap / Floor territory). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Dock (#1063, remaining `n===2` → `0` — twos, not threes), Cadence Snuff (#1011, remaining `n===1` → `0` — ones, not threes), Cadence Tern (#1082, remaining `n>3` → `3` — **threes stay 3**), Cadence Cap (#1017, remaining `n>2` → `2` — **threes become 2**, not 0), Cadence Rise (#962, remaining `n===1` → `2`), Cadence Prime (#953, remaining `n===0` → `1`), Cadence Floor (#906, remaining `n>1` → `1`; **zeros stay 0**; would peel a 3 to 1, **not** to 0), Cadence Swap (#837, **exchange full remaining maps**), Cadence Lag (#849, remaining `n>0` → `n+2`), Cadence Stall (#590, remaining `n>0` → `n+1`; zeros stay 0), Cadence Stretch (#636, remaining ×2), Cadence Theft (#411, **steals** remaining), Cadence Imprint (#787, **copies** onto the caster; target keeps), Cadence Rest (#747, **own** remaining do not tick), Cadence Grace (#802, **next own spell does not start** its cooldown), Cadence Halve (#726, **÷2** on the hostile), Cadence Trim / Shave / Pin / Crack / Flush. The decision: their Inferno is sitting on remaining 3 — Tierce makes it legal **this turn**; Dock would have needed remaining 2; Snuff would have needed remaining 1; Tern would have **left** a 3; Cap would have written 2; Floor would have written 1.  
DURATION: instant rewrite of remaining `n===3`  
SCALING: none.  
SYNERGIES: Tern a 7 to 3, **then** Tierce the 3 to 0 on a **later** turn (do **not** CORE Tern with Tierce). Verse Sestet so the unlocked id is also their last verse.  
COUNTERPLAY: Sit remaining at 1 (Snuff’s problem) or at 2 (Dock’s problem) or at 4+ (Tern / Cap / Floor’s problem); recast before Tierce; Cadence Break your own remaining.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **unlock remaining-3**, not a silence and not a mass zero.  
AI_USAGE: `aiHint: "tierce_remaining_cds_eq_3_to_0"`. Scribes / tempo. Skip if the target has no remaining `n===3`. Do **not** CORE with Dock / Snuff / Tern / Cap / Floor / Rise / Prime.  
DISCOVERY_ELIGIBILITY: true. MULTI child `tierce_precentor`. `pieceTypes: ["bishop","queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing key → no rewrite. Do not write `spellLevelValues`. Do not reset Dual Keep’s once/battle. Preview must show which remaining drop from 3 to 0. All-non-3 remaining → fizzle rider (AP spent, observe). Do **not** reuse `dockRemainingCdsEq2To0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `capRemainingCdsAbove3To3` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0`. If same-day SDE Wave 18 claims this leftover, **SDE wins** — do not keep a second Tierce id. Tern already owns `n>3→3`; this card is `3→0` even if SDE later stamps a second Tern alias.  
IMPLEMENTATION_COMPLEXITY: LOW — walk remaining map, write 0 when n===3.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-cadence-tierce
effectType: debuff
effectCategory: cc
targetType: enemy
areaShape: single
apCost: 3
mpCost: 0
damage: 0
range: 3
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"tierceRemainingCdsEq3To0":true}
```

---

### SPELL_ID: `spell-trideca-span`

NAME: Trideca Span  
ROLE: SUMMONS — orthogonal plus arm 3 occupy; counts as **thirteen**  
ACQUISITION: MULTI_SOURCE  
AP_COST: 4  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "tridecaspan"`, `summonLifespan: 4`, empty kit (`summonUnitDef` with `pieceType: ""` / zero scales — a body, not a caster). `effectParams: {"tridecaSpanCells":13,"tridecaArm":3}`. Click a free ground tile. That click is the **center** of the plus (Hendeca Span’s placement rule, **not** Dec / Dodeca’s nearest-cell-to-caster rule). Occupy the center plus the four orthogonal arms of length 3: `(0,±1)(0,±2)(0,±3)` and `(±1,0)(±2,0)(±3,0)` relative to the click. All 13 cells must be free and in-bounds (`isCellFree`); else fizzle (AP spent). One combatant id, thirteen-cell footprint. Every cell of the 13 is occupied (not a cage hole — Oct Span’s hollow 3×3 stays Oct Span). Counts as **thirteen** toward the summon cap. Distinct from Dodeca Span (#1063, axis-aligned **3×4** = 12, click = **nearest cell to caster**), Hendeca Span (#1011, stretched plus longArm 3 / shortArm 2 = **11**, click = **center**, **asymmetric**), Dec Span (#953, axis-aligned **2×5** = 10), Nine Span (#890, solid 3×3 = 9, click = center), Oct Span (#849, hollow 3×3 = 8), Sept Span (#726, stretched plus longArm 2 / shortArm 1 = 7), Penta Span (plus arm 1 = 5), Six Span (2×3 = 6), Quad Span (2×2 = 4), Triple / Twin Span. Empty kit.  
DURATION: lifespan 4 or until the body dies (frees all thirteen)  
SCALING: none (occupy, not damage).  
SYNERGIES: Sestet Hold so they cannot walk around the plus; Score / Tally / Stave / Sestet Sill on a cell **beside** the block, not on it (occupied).  
COUNTERPLAY: Coup the body; blink past; File Lance along an arm; occupy-weight still 2 live so this card **does not ship** until a dedicated occupy-weight exists.  
POWER_BUDGET: Heavy 4 / CD 3 / 0 damage. Power is **thirteen occupied cells**. Implementation-blocked while `ENEMY_SUMMON_CAP === 2`.  
AI_USAGE: `aiHint: "trideca_span_if_plus_arm_3_free_and_cuts_a_file_and_rank"`. Masons / rooks ELITE. Skip if any of the 13 is occupied / off-map / a portal. Missing hint → drop id.  
DISCOVERY_ELIGIBILITY: true. MULTI child `span_trideca`. `pieceTypes: ["rook"]`, `levelZoneMin: 2`  
EDGE_CASES: **Do not ship while `ENEMY_SUMMON_CAP === 2` without occupy-weight.** Never parse `"Trideca Span"` / `"Thirteen"` / `"Plus"`. One id, thirteen cells — destroying the body frees all thirteen. Player-side Trideca Span counts toward the **player** summon economy, not `ENEMY_SUMMON_CAP`. Missing `tridecaSpanCells` → do not spawn a 1-cell body and call it Trideca Span. Missing `tridecaArm` → do not guess arm 1 (that is Penta Span), longArm 3 / shortArm 2 (that is Hendeca Span), or 3×4 (that is Dodeca Span). Off-map cell → fizzle. Do not mint `spell-thirteen-span` / `spell-triska-span` / `spell-plus-span`. Cardinal click with `dx===0 && dy===0` is illegal (`freeCells` / caster tile) — the center cannot be the caster’s cell. Click is **center**, not nearest cell (Dodeca’s nearest-cell stays Dodeca; a plus **has** a unique center). Diagonals of the bounding 7×7 are **not** occupied.  
IMPLEMENTATION_COMPLEXITY: HIGH — occupy-weight + plus-arm-3 placer. Same class as Hendeca / Dodeca.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-trideca-span
effectType: summon
effectCategory: defense
spellType: summon
targetType: ground
areaShape: single
apCost: 4
mpCost: 0
damage: 0
range: 3
cooldown: 3
freeCells: true
isSummon: true
summonAI: tridecaspan
summonLifespan: 4
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: MULTI_SOURCE
discoveryEligible: true
effectParams: {"tridecaSpanCells":13,"tridecaArm":3}
```

---

### SPELL_ID: `spell-psalm-turn`

NAME: Psalm Turn  
ROLE: CONTROL — invert leftover AP↔MP on **one same-side non-caster ally and one opposite-side hostile**; caster stays  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 2  
EFFECT: No damage. **Not** `isSwap`. `effectParams: {"invertMixedSidesLeftoverApMp":true,"invertMixedSearchRadius":3,"invertMixedExcludeCaster":true,"invertMixedNeedSameSideNonCaster":true}`. Target one living **opposite-side** body. Find the nearest living **same-side** body within Chebyshev `invertMixedSearchRadius` of **that target** that is **not** the caster. Snapshot each body’s leftover AP and leftover MP, then write leftover AP ← leftover MP and leftover MP ← leftover AP on **each** body independently, each **capped at that pool’s max**. Caster leftover **unchanged**. Caster does not move. If no same-side non-caster body is in radius, fizzle (AP spent). Distinct from Hymn Turn (#1063, **two same-side non-caster allies** independent invert via `invertTwoAlliesLeftoverApMp` — **do not reuse that key**), Duel Turn (#1011, **two hostiles** independent invert via `invertTwoHostilesLeftoverApMp` — **do not reuse that key**), Purse Turn (#953, **one** hostile invert via `invertHostileLeftoverApMp` — **do not reuse that key**), Tempo Invert (#282, **one-body ally/self** leftover AP↔MP via `invertApMp` — **do not reuse that key**), Bar Cross (#890, **two-body leftover cross**: caster AP ↔ target MP **and** caster MP ↔ target AP via `crossLeftoverApMpTwoBody` — **do not reuse that key**), Dual Keep (banks leftover AP **and** MP on **one** body, no invert), Swap / Pawn Trade (tiles, not pools), Choir Hymn (Wave-1 Discovery heal — **do not alias**). Player-side summons **count** as same-side bodies.  
DURATION: instant leftover rewrite; no snap-back at turn end  
SCALING: none.  
SYNERGIES: Sestet Mend / Sestet Sting after the invert **keeps** sum 6 on a body that was already unequal; Stave Mend after you invert a (4,2) wisp with a (2,4) bishop (both stay Sestet) **or** a (5,1) wisp with a (3,2) hostile (wisp stays Sestet, hostile becomes Stave). Must Sestet after you dump their AP into MP.  
COUNTERPLAY: Isolate (no pet / no second same-side body); keep leftover AP === leftover MP on both so both inverts are no-ops; Quiet Hex after they invert into a 3-AP spell; Strike the wisp before they recast.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **one ally leftover flip plus one hostile leftover flip with the caster’s own bar untouched**, not a swap, not Hymn Turn, and not Duel Turn.  
AI_USAGE: `aiHint: "psalm_turn_if_one_non_caster_ally_and_one_hostile_in_r3_and_at_least_one_unequal"`. Hex / queens. Skip if no same-side non-caster body in radius, or if both inverts would be no-ops (both already AP===MP).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing `invertMixedExcludeCaster` → fail closed (do **not** invert the caster). Missing `invertMixedNeedSameSideNonCaster` → fail closed (do **not** pick a second hostile and become Duel Turn). Ties: nearest Chebyshev, then lowest id. Invert (4,2)→(2,4) **stays Sestet**. Invert (6,0)→(0,6) **stays Sestet**. Invert (5,1)→(1,5) **stays Sestet**. Invert (3,3) is a no-op (Poise stays Poise). Invert (3,2)→(2,3) **stays Stave**. Invert (3,1)→(1,3) **stays Score**. Do **not** reuse `invertTwoAlliesLeftoverApMp` / `invertTwoHostilesLeftoverApMp`. If same-day SDE Wave 18 claims this leftover, **SDE wins**. Do not mint `spell-choir-turn` / `spell-pew-turn` / `spell-mixed-turn` / `spell-aisle-turn`. Solo caster with no summon → always fizzle (that is the cost vs Purse Turn).  
IMPLEMENTATION_COMPLEXITY: LOW — two leftover snapshots + two writes. Same class as Hymn Turn / Duel Turn with a mixed-side filter.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-psalm-turn
effectType: debuff
effectCategory: cc
targetType: enemy
areaShape: single
apCost: 3
mpCost: 0
damage: 0
range: 3
cooldown: 2
usableByPlayer: true
usableByEnemy: true
minLevel: 1
isBaseSpell: false
isSwap: false
acquisitionModel: ENEMY_DISCOVERY
discoveryEligible: true
effectParams: {"invertMixedSidesLeftoverApMp":true,"invertMixedSearchRadius":3,"invertMixedExcludeCaster":true,"invertMixedNeedSameSideNonCaster":true}
```

---

### SPELL_ID: `spell-sestet-hood`

NAME: Sestet Hood  
ROLE: DEFENSE — next applied hit is 0 iff leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**  
ACQUISITION: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"sestetHoodNextHit":true,"sestetSumN":6,"sestetForbidEqual":true}`. Arm a one-hit consume: the next applied hit on the caster is 0 **if at impact** leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**. Any Chebyshev. The charge remains if the hit arrives while the sum ≠ 6 or the pair is a tie (hit lands fully; charge stays). Distinct from Stave Hood (#1063, leftover AP + leftover MP === 5), Score Hood (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Hood (#953, leftover AP + leftover MP === 3), Poise Hood (#890, leftover AP === leftover MP ≥ 1), Dual Plate (#1017, leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** — (2,2) is Dual Plate / Poise, **not** Sestet), Prime Plate (#1082, leftover **1/1**), Spent Plate (#837, leftover **AP ≥ 1**, MP unconstrained), Gait Plate (#802, leftover **MP ≥ 1**, AP unconstrained), Dry Plate (#962, leftover **MP = 0**), Even Hood (#849, **even Chebyshev**), Odd Hood (odd Chebyshev), Near / Mid / Far Hood (range bands), Odd Plate (#906, leftover **AP odd**). The decision: hold (4,2) through the hit — Dual Keep 2/2 is Poise Hood / Dual Plate, **not** this — or spend into 3/3 and Poise Hood still works, this does not. Do **not** CORE with Spent Plate, Gait Plate, Dual Plate, Prime Plate, Poise Hood, Tally Hood, Score Hood, or Stave Hood.  
DURATION: until consumed at a sum===6 unequal impact, or battle end  
SCALING: none (negate, not a RES%).  
SYNERGIES: Haste to bank six unequal; Psalm Turn a (6,0) ally into (0,6) still Sestet Hood; Sestet Hold so they cannot walk you off 6.  
COUNTERPLAY: Wait until they spend a pool; Coup; hit them on 3/3 (Poise Hood) or 3/2 (Stave Hood) or 3/1 (Score Hood).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **one hit while sitting on six unequal**. Dual Keep cannot fake it.  
AI_USAGE: `aiHint: "sestet_hood_if_self_leftover_sum_eq_6_unequal"`. Lurkers / knights ELITE. Skip if leftover sum ≠ 6 or the pair is a tie.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing `sestetSumN` **or** missing `sestetForbidEqual` → fail closed. Leftover 3/3 at impact → hit lands (Poise Hood). Leftover 3/2 at impact → hit lands (Stave Hood). Leftover 3/1 at impact → hit lands (Score Hood). Leftover 2/2 at impact → hit lands (Poise Hood / Dual Plate). Leftover 1/1 at impact → hit lands (Prime Plate / Poise). Do **not** retag `even_gallery`.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum-and-unequal gate on the next applied hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-sting`

NAME: Sestet Sting  
ROLE: DAMAGE — 10, plus 8 if target leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. Then if the target’s leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**, deal `sestetStingBonus` (8) as a second existing `dealDamage` call. `effectParams: {"sestetLeftoverSumEq":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetStingBonus":8}`. Distinct from Stave Sting (#1063, leftover AP + leftover MP === 5), Score Sting (#1011, leftover AP + leftover MP === 4 **and unequal**), Tally Sting (#953, leftover AP + leftover MP === 3), Poise Sting (#890, leftover AP === leftover MP ≥ 1), Gaunt Sting (#849, leftover **both 0**), Lean / Dry / Ready / Full / Even Sting (#962, leftover AP **even and ≥ 2** — (2,2) is even AP, which is Poise, not Sestet), Fresh Sting (#1017), Capped Sting (#1082, leftover MP **equals max MP**), Odd Sting (#906, leftover **AP odd**), Tied Gait (#906, both leftover **exactly 2**). The decision: poke the (4,2) bishop for 18, or poke anyone for 10. Dual Keep 2/2 is the **wrong** window (Poise Sting). Dual Keep cannot open this. (3,3) is Poise Sting, not this.  
DURATION: instant  
SCALING: 10 / 8 follow damage%.  
SYNERGIES: Psalm Turn a (6,0) into (0,6) still Sestet; Sestet Hold so they cannot walk the MP off.  
COUNTERPLAY: Sit on 3/3 (Poise Sting) or 3/2 (Stave Sting) or 3/1 (Score Sting) or 2/1 (Tally Sting) or 0/0 (Gaunt Sting).  
POWER_BUDGET: Cheap 2 / CD 1. 10 ungated + 8 on a sum of 6 unequal.  
AI_USAGE: `aiHint: "sestet_sting_if_target_leftover_sum_eq_6_unequal"`. Lurkers / pawns. Skip the bonus path if leftover sum ≠ 6 or the pair is a tie; 10 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bonus keys → 10 only. Target leftover 3/3 → no bonus (Poise Sting). Target leftover 3/2 → no bonus (Stave Sting). Target leftover 3/1 → no bonus (Score Sting). Target leftover 3/0 → no bonus (Tally Sting). Do not name-wire the bonus.  
IMPLEMENTATION_COMPLEXITY: LOW — one leftover-sum-and-unequal gate + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-step`

NAME: Sestet Step  
ROLE: POSITION — relocate to Chebyshev 1 of an ally whose leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `freeCells` on the dest. `effectParams: {"sestetStepNeedSumEq":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetStepAdj":1}`. Target an ally (not self) whose leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**. The caster **relocates** to a free cell at Chebyshev 1 of that ally (player picks the dest among legal neighbors; AI picks the safest). If the ally is not in the window or no neighbor is free, fizzle (AP spent, no move). Distinct from Stave Step (#1063, ally leftover sum === 5), Score Step (#1011, ally leftover sum === 4 **and unequal**), Tally Step (#953, ally leftover sum === 3), Poise Step (#890, ally leftover AP === leftover MP ≥ 1), Gaunt Step (#849, ally leftover **both 0**), Home / Heave / Parched / Ally Step, Hinge Step, Relay Dash. The decision: blink next to the (0,6) wisp — they have walk, you have position — or wait for a 3/3 and Poise Step, or a 3/2 and Stave Step, or a 3/1 and Score Step. Dual Keep cannot open this.  
DURATION: instant relocate  
SCALING: none.  
SYNERGIES: Sestet Sill on a neighbor so they eat 8 at dawn if they stay on 6 unequal; Psalm Turn keeps the wisp in-window.  
COUNTERPLAY: Spend the wisp’s pool; occupy every neighbor; Coup; sit the wisp on 3/3.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **blink to a six-unequal-bar ally**.  
AI_USAGE: `aiHint: "sestet_step_if_ally_leftover_sum_eq_6_unequal_and_a_neighbor_is_free"`. Porters / queens. Skip if no in-window ally or no free neighbor.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen"]`, `levelZoneMin: 1`  
EDGE_CASES: Self-target forbidden (`sestetStep` is not a self blink — that is Mist Step / Phase Slip). Missing keys → no move. Ally leftover 3/3 → fizzle (Poise Step). Ally leftover 3/2 → fizzle (Stave Step). Ally leftover 3/1 → fizzle (Score Step). Portal dest illegal (`isCellFree`).  
IMPLEMENTATION_COMPLEXITY: LOW — leftover-sum-and-unequal gate + existing relocate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-sill`

NAME: Sestet Sill  
ROLE: TERRAIN — start-of-their-turn occupy tax iff leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell for 2 turns. `effectParams: {"sestetSillNeedSumEq":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetSillDamage":8,"sestetSillDuration":2}`. At the **start of a combatant’s turn**, if they occupy this cell and leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**, deal 8 through `updateCombatant`. Walk-enter does **not** tax (Ingress / Shove Sting). End-turn occupy does **not** tax (Sestet Post / Dwell). Relocate landing does **not** tax (Drift Post). Distinct from Stave Sill (#1063, leftover sum === 5 at start), Score Sill (#1011, leftover sum === 4 **and unequal** at start), Tally Sill (#953, leftover sum === 3 at start), Poise Sill (#890, leftover AP === leftover MP ≥ 1 at start), Gaunt Sill (#849, leftover **both 0** at start), Wake Mark (start-turn any leftover), Quiet / Cast / Drift / Parched Sill. The decision: stand on the sill at (4,2) and eat 8 at dawn, or spend a pool overnight, or sit on 3/3 and eat Poise Sill instead, or sit on 3/2 and eat Stave Sill. Dual Keep overnight **cannot** leave them on 6.  
DURATION: 2 turns of paint  
SCALING: 8 follows damage% if any; otherwise fixed.  
SYNERGIES: Sestet Hold so they cannot walk off overnight; Psalm Turn keeps sum 6 through dawn.  
COUNTERPLAY: Walk off (start-turn only); spend a pool; blink; dump to 3/3.  
POWER_BUDGET: Cheap 2 / CD 2 / 0 upfront. Power is **dawn tax on a sum of 6 unequal**.  
AI_USAGE: `aiHint: "sestet_sill_if_foe_will_start_turn_sum_eq_6_unequal_on_tile"`. Masons / rooks. Skip if they will not start on 6 unequal.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["rook"]`, `levelZoneMin: 1`  
EDGE_CASES: Paint on a portal → fizzle (`isCellFree`). Occupant leftover 3/3 at dawn → no tax (Poise Sill). Occupant leftover 3/2 at dawn → no tax (Stave Sill). Occupant leftover 3/1 at dawn → no tax (Score Sill). Occupant leftover 3/0 at dawn → no tax (Tally Sill). Occupant leftover 0/0 at dawn → no tax (Gaunt Sill).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — painted cell + start-turn leftover-sum-and-unequal gate. Same class as Stave Sill / Score Sill / Tally Sill / Poise Sill.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-hold`

NAME: Sestet Hold  
ROLE: CONTROL — cannot spend leftover MP to walk while leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"sestetHoldWhileSumEq":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetHoldDuration":2}`. For 2 of the **target’s** turns, any walk that would spend ≥ 1 leftover MP is illegal **while leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP**. Teleport / Swap / Phase Slip / Twin-gate step / Sestet Step (caster relocate) do **not** pay walk MP and are legal. Distinct from Stave Hold (#1063, cannot walk while leftover sum === 5), Score Hold (#1011, cannot walk while leftover sum === 4 **and unequal**), Tally Hold (#953, cannot walk while leftover sum === 3), Poise Hold (#890, cannot walk while leftover AP === leftover MP ≥ 1), Odd Hold (#849, cannot walk while leftover AP is **odd**), Dry Hold (until leftover **AP = 0**), Drift Hold (until **force-moved**), Cast Hold / Strike Hold / Boot Hold / Tool Hold / Gaunt Hold / Brick Hold (#1017). The decision: they have (0,6) and wanted to walk six tiles — they must **leave sum 6 unequal** (cast leftover AP from a (4,2) / (5,1) / (6,0), get siphoned, get turned, **or dump to 3/3**) before walking, or wait 2 turns. At leftover (0,6) they **have** MP but cannot spend it while this lock is up **and** they still sum to 6 unequal. Dual Keep 2/2 is Poise Hold, **not** this. Dual Keep cannot open this. (3,3) is Poise Hold, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Must Sestet on (0,6) so they can neither walk nor non-Strike; Psalm Turn (0,6)→(6,0) so they lose the walk MP into leftover AP.  
COUNTERPLAY: Cast leftover AP to leave 6 unequal; dump to 3/3; blink; wait 2 turns.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **cannot walk while sitting on six unequal**.  
AI_USAGE: `aiHint: "sestet_hold_if_target_leftover_sum_eq_6_unequal_and_wants_to_walk"`. Hex / knights ELITE. Skip if leftover sum ≠ 6 or the pair is a tie.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight"]`, `levelZoneMin: 2`  
EDGE_CASES: Missing keys → no lock. Leftover (3,3) → this lock does **not** block walks (Poise Hold’s window). Leftover (3,2) → this lock does **not** block walks (Stave Hold). Leftover (3,1) → this lock does **not** block walks (Score Hold’s window). Leftover (2,2) → this lock does **not** block walks (Poise Hold). Leftover (3,0) → this lock does **not** block walks (Tally Hold; leftover MP is 0 anyway).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — leftover-sum-and-unequal gate in the walk spender.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-lend`

NAME: Sestet Lend  
ROLE: SUPPORT — +1 leftover AP and +1 leftover MP iff target leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP** (exits to 8)  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: `effectParams: {"sestetLendAp":1,"sestetLendMp":1,"requireTargetSumEqLend":true,"sestetSumN":6,"sestetForbidEqual":true}`. If the **target** has leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**, grant +1 current AP and +1 current MP (capped at max). The sum becomes **8** (the sestet window **closes**). Inequality is preserved: (4,2)→(5,3), (5,1)→(6,2), (6,0)→(7,1). This **cannot** manufacture Poise (unequal+2 stays unequal). This **cannot** manufacture Stave (sum 8 ≠ 5) or Score (sum 8 ≠ 4) or Tally (sum 8 ≠ 3). If the gate fails, fizzle rider (AP spent, no grant). Distinct from Stave Lend (#1063, +1/+1 if leftover sum === 5 — **exits** to 7), Score Lend (#1011, +1/+1 if leftover sum === 4 **and unequal** — **exits** to 6, **which is this family’s window**), Tally Lend (#953, +1/+1 if leftover sum === 3 — **exits** to 5, which is Stave), Poise Lend (#890, +1/+1 if leftover AP === leftover MP ≥ 1 — the **tie survives**), Gaunt Lend (#849, +1/+1 if leftover **both 0**), Lean / Drift / Spent Lend, Watch Alms, Tempo Gift / Loan Tempo / Haste, Dual Keep. The decision: cash the (4,2) wisp for a 2-resource bump, then they are out of Sestet **and** out of Stave **and** out of Score **and** out of Tally **and** out of Poise (sum 8 is 5/3 or 6/2 or 7/1). **Score Lend is the intended manufacture of Sestet** ((3,1)→(4,2)). Do not name-wire that hop.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Score Lend **into** Sestet, then Sestet Mend; or Sestet Lend **out** of Sestet into an 8-bar that Dual Keep cannot cap this turn.  
COUNTERPLAY: Sit off sum 6 unequal; sit on 3/3 (Poise Lend); sit on 3/2 (Stave Lend); sit on 3/1 (Score Lend).  
POWER_BUDGET: Cheap 2 / CD 2 / 0 damage. Power is **cash six unequal for eight**, not a Haste.  
AI_USAGE: `aiHint: "sestet_lend_if_ally_leftover_sum_eq_6_unequal"`. Buffers / bishops. Skip if leftover sum ≠ 6 or the pair is a tie.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no grant. Target leftover 3/3 → fizzle (Poise Lend). Target leftover 3/2 → fizzle (Stave Lend). Target leftover 3/1 → fizzle (Score Lend). Target leftover 2/1 → fizzle (Tally Lend). Cap at max: if leftover AP is already max, grant MP only — **then the sum may not be 8** and the window-exit is incomplete; fail closed if either grant cannot apply in full (both must land).  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-sip`

NAME: Sestet Sip  
ROLE: CONTROL — steal 1 leftover AP iff target leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: No HP damage. `effectParams: {"sestetSipAp":1,"requireTargetSumEqSip":true,"sestetSumN":6,"sestetForbidEqual":true}`. If the target leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP** **and** leftover AP ≥ 1, subtract 1 leftover AP from the target (not below 0) and add 1 leftover AP to the caster this turn, capped at max. If leftover AP is 0 (the (0,6) pair) or the sum ≠ 6 or the pair is a tie, fizzle rider (AP spent). Distinct from Stave Sip (#1063, steal 1 leftover AP iff leftover sum === 5 — **manufactures Score or Poise**), Score Sip (#1011, steal 1 leftover AP iff leftover sum === 4 **and unequal** — **manufactures Tally**), Tally Sip (#953, steal 1 leftover AP iff leftover sum === 3 — **manufactures Poise** from (2,1)→(1,1)), Poise Sip (#890, steal 1 leftover AP iff leftover AP === leftover MP ≥ 1), Bare Sip (#849, steal 1 leftover AP iff leftover **MP = 0**), Soul Sip (ungated current MP), Ap Sip (#342). The decision: sip (4,2) → they become (3,2) **Stave**; sip (5,1) → they become (4,1) **Stave**; sip (6,0) → they become (5,0) **Stave**; sip (2,4) → they become (1,4) **Stave**; sip (1,5) → they become (0,5) **Stave**. **Sip always manufactures Stave when it lands.** Dual Keep 2/2 is the **wrong** window (Poise Sip). (3,3) is Poise Sip, not this.  
DURATION: instant (current-turn leftover only)  
SCALING: amount fixed.  
SYNERGIES: Stave Sting / Stave Mend **after** manufacturing 3/2 or 4/1 or 5/0; Sestet Hold so they cannot walk the remaining MP.  
COUNTERPLAY: Sit on (0,6) (no AP to steal); sit off sum 6 unequal; sit on 3/3 (Poise Sip); sit on 3/2 (Stave Sip); sit on 3/1 (Score Sip); Second Wind after.  
POWER_BUDGET: Cheap control, 0 damage, CD 1.  
AI_USAGE: `aiHint: "sestet_sip_if_target_sum_eq_6_unequal_and_leftover_ap_ge_1"`. Hex / pawns. Skip if not in the window or leftover AP is 0.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Do not write `debuffStat: "ap"`. Missing keys → no steal. Target leftover 3/3 → fizzle (Poise Sip’s window). Target leftover 3/2 → fizzle (Stave Sip’s window). Target leftover 3/1 → fizzle (Score Sip’s window). Target leftover 2/1 → fizzle (Tally Sip’s window). Challenge: not a heal, not MP. Stave Sip on (3,2) → (2,2) **Poise** is the cousin manufacture; Score Sip on (3,1) → (2,1) **Tally** is the next hop down; do not name-wire either hop.  
IMPLEMENTATION_COMPLEXITY: LOW.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-post`

NAME: Sestet Post  
ROLE: SUMMONS — empty-kit mine; end-turn occupy detonates iff leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `isSummon: true`, `summonAI: "sestetpost"`, `summonLifespan: 3`, empty kit. `effectParams: {"sestetPostDetonateDamage":10,"sestetPostNeedSumEq":true,"sestetSumN":6,"sestetForbidEqual":true}`. Place on a free ground tile. At **end of a combatant’s turn**, if they **occupy** this body and leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**, deal 10 to that occupant through `updateCombatant` and this summon dies. Walk-enter does **not** detonate (Ingress). Relocate landing does **not** detonate (Drift Post). Start-of-turn does **not** detonate (Wake / Gaunt Sill / Poise Sill / Tally Sill / Score Sill / Stave Sill / Sestet Sill). Distinct from Stave Post (#1063, leftover sum === 5), Score Post (#1011, leftover sum === 4 **and unequal**), Tally Post (#953, leftover sum === 3), Poise Post (#890, leftover AP === leftover MP ≥ 1), Gaunt Post (#849, leftover **both 0**), Lean Post (leftover **AP = 0** only), Dummy Post (taunt), Drift Post (**relocate landing**), Dwell Mark (**end-turn occupy, any leftover**). The decision: end the turn on (4,2) and eat 10, or spend a pool, or dump to 3/3 and eat Poise Post, or dump to 3/2 and eat Stave Post, or dump to 3/1 and eat Score Post, or dump to 3/0 and eat Tally Post, or dump to 0/0 and eat Gaunt Post. Dual Keep 2/2 **hurts Poise Post, not this**. Dual Keep **cannot** hurt this. Walk-safe. Relocate-safe. Start-turn-safe.  
DURATION: lifespan 3 or until detonate  
SCALING: 10 follows damage% if any; otherwise fixed.  
SYNERGIES: Sestet Hold so they cannot walk off; Psalm Turn **keeps** sum 6 unequal through the end-turn check.  
COUNTERPLAY: Spend a pool before turn end; dump to 3/3; walk off (walk-safe); Coup the post; blink.  
POWER_BUDGET: Standard 3 / CD 3 / 0 upfront. Power is **end-turn occupy on a sum of 6 unequal**. Counts as **one** toward the summon cap.  
AI_USAGE: `aiHint: "sestet_post_if_foe_will_end_turn_sum_eq_6_unequal_on_tile"`. Masons / pawns. Skip if cap is full.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["pawn","rook"]`, `levelZoneMin: 1`  
EDGE_CASES: **Summon is observation.** Later detonate / death is not a second observe. Missing keys → do not spawn a Dummy Post. Occupant leftover 3/3 at turn end → no detonate (Poise Post’s window). Occupant leftover 3/2 at turn end → no detonate (Stave Post’s window). Occupant leftover 3/1 at turn end → no detonate (Score Post’s window). Occupant leftover 3/0 at turn end → no detonate (Tally Post’s window). Occupant leftover 0/0 at turn end → no detonate (Gaunt Post’s window). Empty tile → no detonate, lifespan ticks. Never parse `"Sestet Post"`. Do not mint `spell-sestet-burst`. Prefer fizzle-and-detonate if the body is displaced by Swap (body gone → no tile tax).  
IMPLEMENTATION_COMPLEXITY: MEDIUM — empty-kit summon + end-turn leftover-sum-and-unequal gate. Same class as Stave Post / Score Post / Tally Post / Poise Post / Gaunt Post / Lean Post.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-sestet-bounce`

NAME: Sestet Bounce  
ROLE: DAMAGE — 12 to primary; bounce 1 to nearest other leftover-AP+MP===6-unequal hostile  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 12 to primary (ungated). `effectParams: {"sestetBounceNeedSumEq":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetBounceSearchRadius":4,"sestetBounceCount":1}` — search Chebyshev ≤ 4 for the nearest **other** living hostile whose leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**; deal 12 to that body too. Primary leftover unconstrained. Distinct from Stave Bounce (#1063, second body leftover sum === 5), Score Bounce (#1011, second body leftover sum === 4 **and unequal**), Tally Bounce (#953, second body leftover sum === 3), Poise Bounce (#890, second body leftover AP === leftover MP ≥ 1), Gaunt Bounce (#849, second body leftover **both 0**), Parched Bounce (leftover **MP = 0**), Heave Bounce (**force-moved**), Chain Lightning (nearest **any**, 2 bounces). The decision: open on whoever, splash the (4,2) bishop — or wait for two 3/2 bodies and Stave Bounce. Dual Keep 2/2 is the **wrong** second body. Dual Keep cannot open this. (3,3) is Poise Bounce, not this.  
DURATION: instant  
SCALING: 12 follows damage%.  
SYNERGIES: Psalm Turn a second body into Sestet before the bounce search; Sestet Hold to keep them in-window.  
COUNTERPLAY: Isolate (one Sestet body); sit the second body on 3/3 or 3/2 or 3/1 or 3/0 or 0/0.  
POWER_BUDGET: Standard. 12 if no second Sestet body; 24 if a second sits on sum 6 unequal.  
AI_USAGE: `aiHint: "sestet_bounce_if_second_sum_eq_6_unequal_hostile_in_r4"`. Queens / bishops. Skip if no second in-window body **and** a Strike would kill the primary; 12 still lands.  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["queen","bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing bounce keys → 12 only. Primary leftover 3/3 does **not** block the primary hit. Ties: nearest Chebyshev, then lowest id. Do not hit allies. Second body leftover 3/3 is **not** a bounce target (Poise Bounce). Second body leftover 3/2 is **not** a bounce target (Stave Bounce). Second body leftover 3/1 is **not** a bounce target (Score Bounce).  
IMPLEMENTATION_COMPLEXITY: LOW — one search + second `dealDamage`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-must-sestet`

NAME: Must Sestet  
ROLE: CONTROL — non-Strike illegal unless leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP **and** the spell spends last AP  
ACQUISITION: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"mustNonStrikeUnlessSumEqAndSpendsLastAp":true,"sestetSumN":6,"sestetForbidEqual":true,"sestetHoldDuration":2}`. For 2 of the **target’s** turns, any non-Strike spell is illegal unless, **before** this (their) spell’s AP is paid, leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP** **and** `apCost === leftover AP` (the spell spends last leftover AP). Strike / `physical_attack` stays legal. Walk stays legal unless a Sestet Hold is also up. Distinct from Must Stave (#1063, leftover sum === 5 **and** last AP — **pre-spend odd sum 5**), Must Score (#1011, leftover sum === 4 **and unequal** **and** last AP — **pre-spend even unequal sum 4**), Must Tally (#953, leftover sum === 3 **and** last AP — **pre-spend odd sum 3**), Must Poise (#890, leftover AP === leftover MP ≥ 1 **and** last AP — **pre-spend equality**), Must Gaunt / Must Lean / Must Drift / Must Pace / Must Span / Must Step, Rite First (cannot Strike until a spell), Tool Hold (cannot tool until Strike). The decision: they sit on (4,2) with a 4-cost tool as their last packet, or they sit on (0,6) with walk MP and **no** leftover AP — Must Sestet **blocks** every non-Strike from (0,6) because leftover AP is 0 (cannot spend last AP). (6,0) spending a 6-cost last packet **is** legal and dumps them to (0,0) Gaunt. Dual Keep 2/2 is Must Poise’s window, **not** this. Dual Keep cannot open this. (3,3) is Must Poise, not this.  
DURATION: 2 of their turns  
SCALING: none.  
SYNERGIES: Sestet Hold on (0,6) so they can neither walk nor non-Strike; Psalm Turn (0,6)→(6,0) so a 6-cost last packet becomes legal. Do **not** CORE with a Strike-only sestet lock (none shipped).  
COUNTERPLAY: Strike; blink; wait 2 turns; dump to 3/3; Psalm Turn / Tempo Invert yourself if you own it.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **last-packet from a sum of 6 unequal**, not a silence.  
AI_USAGE: `aiHint: "must_sestet_if_target_leftover_sum_eq_6_unequal_and_has_a_last_packet_spell"`. Knights / pawns ELITE. Skip if leftover sum ≠ 6 or the pair is a tie. Do not arm if the only remaining legal verb is Strike and a walk would kill.  
DISCOVERY_ELIGIBILITY: true. ELITE. `pieceTypes: ["knight","pawn"]`, `levelZoneMin: 2`  
EDGE_CASES: **Pre-spend leftover** (see §3.5). Missing keys → no lock. Leftover (3,3) → non-Strike still illegal under **this** lock (tied, Must Poise’s window). Leftover (3,2) → non-Strike still illegal under **this** lock (sum 5, Must Stave’s window). Leftover (3,1) → non-Strike still illegal under **this** lock (sum 4, Must Score’s window). Leftover (3,0) → non-Strike still illegal under **this** lock (sum 3, Must Tally’s window). Leftover (0,0) → non-Strike illegal (Must Gaunt’s window, but this lock does not lift there). 0-AP tools (Timestep) are not “spending last AP”. The shared key `mustNonStrikeUnlessSumEqAndSpendsLastAp` is **not** a name table: `sestetSumN` + `sestetForbidEqual` distinguish this row from Must Stave / Must Score.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — pre-spend leftover sum + last-AP compare in the cast gate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-sestet`

NAME: Verse Sestet  
ROLE: CONTROL — last resolved id illegal until leftover AP + leftover MP === 6 AND leftover AP ≠ leftover MP  
ACQUISITION: ENEMY_DISCOVERY  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `effectParams: {"verseSestetUntilSumEq":true,"sestetSumN":6,"sestetForbidEqual":true}`. The target’s **last resolved spell id** (the id they most recently spent AP on) cannot be recast until leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP**. Strike is not a spell id for this key. If they have no last resolved id, fizzle rider (AP spent). Distinct from Verse Stave (#1063, lifts at leftover sum === 5), Verse Score (#1011, lifts at leftover sum === 4 **and unequal**), Verse Tally (#953, lifts at leftover sum === 3), Verse Poise (#890, lifts at leftover AP === leftover MP ≥ 1), Verse Gaunt (#849, lifts at leftover **both 0**), Verse Lean / Verse Pace / Verse Tax, Once Verse / Stolen Verse / Summon Verse (#906, pets pay +1 AP to **recast** last id; the id stays legal), Last Mute / Hex of Silence. The decision: lock their Inferno until they sit on (4,2) — sitting on 3/3 **does not** lift (Verse Poise’s window); sitting on 3/2 **does not** lift (Verse Stave’s window); sitting on 3/1 **does not** lift (Verse Score’s window); sitting on 3/0 **does not** lift (Verse Tally’s window); sitting on 0/0 **does not** lift (Verse Gaunt’s window); sitting on 1/1 **does not** lift (Prime Gift). Instant lift if they already sit on sum 6 unequal at resolve (fizzle rider — do not arm a lock that is already lifted). Dual Keep 2/2 does **not** lift this. Dual Keep **cannot** lift this.  
DURATION: until leftover sum === 6 unequal, or battle end  
SCALING: none.  
SYNERGIES: Cadence Tierce so the locked id is also remaining 0 (they can recast it **this** turn if they also sit in-window); Sestet Hold so they cannot walk into a new leftover split.  
COUNTERPLAY: Sit on (6,0) / (0,6) / (5,1) / (1,5) / (4,2) / (2,4); recast a different id; wait. Dual Keep 2/2 does **not** lift this. Haste into (4,2) **does**. Dumping to 3/3 **does not**.  
POWER_BUDGET: Standard control, 0 damage, CD 2. Power is **which leftover window lifts the last verse**, not a silence.  
AI_USAGE: `aiHint: "verse_sestet_if_target_last_id_is_their_win_condition"`. Hex / bishops. Skip if they have no last resolved id, or if they already sit on sum 6 unequal (instant lift — fizzle rider).  
DISCOVERY_ELIGIBILITY: true. `pieceTypes: ["bishop"]`, `levelZoneMin: 1`  
EDGE_CASES: Missing keys → no lock. Verse Sestet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), or leftover 1/1 (Prime Gift). Summon Verse (#906) is a recast tax, not a legality lock — do not merge the keys.  
IMPLEMENTATION_COMPLEXITY: LOW–MEDIUM — last-id lock + leftover-sum-and-unequal lift.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-tierce`

NAME: Court Tierce  
ROLE: SUPPORT — Cadence Tierce on **every other** body (init order)  
ACQUISITION: NOT_PLAYER_LEARNABLE  
AP_COST: 6  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: `effectParams: {"tierceRemainingCdsEq3To0":true,"courtTierceExcludeCaster":true}`. In initiative order, every living combatant **except the caster** has remaining `n===3` rewritten to `0` (zeros stay 0; `n===1`, `n===2`, and `n>3` unchanged), same rewrite as Cadence Tierce. Distinct from Court Dock (#1063, mass Dock `n===2` → `0`), Court Snuff (#1011, mass Snuff `n===1` → `0`), Court Prime (#953, mass Prime `n===0` → `1`), Court Floor (#890, mass Floor `n>1` → `1`, zeros stay 0), Court Lag (#849, mass Lag `n>0` → `n+2`), Court Imprint (mass Imprint), Court Dual / Court Keep / Court Stretch / Court Hinge / Court Shove / Court Fold, Cadence Tierce (one body), Cadence Flush (all → 0, ally), Cadence Swap (two-body map exchange), Cadence Tern (one body `n>3→3`), Cadence Cap (one body `n>2→2`). Player never owns this. Witness without grant.  
DURATION: instant rewrite  
SCALING: none.  
SYNERGIES: Kit with Cadence Tierce on the caster’s own target after, or Dock a remaining `n===2` after the board’s remaining-3 tools are already sitting at 0. Do **not** CORE with Court Dock / Court Snuff / Court Prime / Court Floor / Cadence Tern / Cadence Cap.  
COUNTERPLAY: Recast before Court Tierce; Cadence Break your own remaining after; Floor your remaining 3 to 1 before the mass tierce; Tern does **not** save you (threes stay 3, then this writes 0); kill the regent.  
POWER_BUDGET: Signature 6 / CD 4 / 0 damage. Power is **board-wide remaining-3 unlock**. Kit-only.  
AI_USAGE: `aiHint: "court_tierce_if_two_plus_foes_have_a_remaining_3_nuke"`. Kit-only regent. Skip if every other remaining is already ≠ 3.  
DISCOVERY_ELIGIBILITY: `discoveryEligible: false`. `NOT_PLAYER_LEARNABLE`. `court_tierce_regent` kit-only. Arm is observation for witness-only kits. Never written to owned ids.  
EDGE_CASES: Missing `courtTierceExcludeCaster` → do not tierce the caster (fail closed, still observe). Do not write `spellLevelValues`. Do not mint `spell-court-three`. Preview must list who tierce. Do not reuse `courtDockExcludeCaster` / `courtSnuffExcludeCaster` / `courtPrimeExcludeCaster` / `courtFloorExcludeCaster`.  
IMPLEMENTATION_COMPLEXITY: MEDIUM — init-order walk + Cadence Tierce rewrite. Same class as Court Dock / Court Snuff / Court Prime / Court Floor / Court Lag.  
STATUS: PROPOSED

**SpellConfig sketch**

```text
id: spell-court-tierce
effectType: debuff
effectCategory: cc
targetType: self
areaShape: single
apCost: 6
mpCost: 0
damage: 0
range: 0
cooldown: 4
usableByPlayer: false
usableByEnemy: true
minLevel: 1
isBaseSpell: false
acquisitionModel: NOT_PLAYER_LEARNABLE
discoveryEligible: false
effectParams: {"tierceRemainingCdsEq3To0":true,"courtTierceExcludeCaster":true}
```

---

## 6. Combination matrix (statuses × leftover × terrain)

| Window | Tools |
| :--- | :--- |
| Leftover AP + leftover MP **=== 6 AND unequal** on an **ally** | Sestet Mend (both bodies), Sestet Step, Sestet Lend (**exits** to 8, stays unequal), Psalm Turn (**keeps** the sum on the ally when it was already unequal; caster stays) |
| Same window on a **hostile** | Sestet Sting, Sestet Sill (their turn start), Sestet Hold (cannot walk), Sestet Sip (**manufactures Stave** from every successful steal), Sestet Post (their turn end), Sestet Bounce (second body), Must Sestet (self, pre-spend), Verse Sestet (lifts here) |
| Same window on **self** | Sestet Hood, Must Sestet |
| Leftover AP + leftover MP **=== 5** | **Not this pass.** Stave\*. Sestet keys fail `sestetSumN === 6`. |
| Leftover AP + leftover MP **=== 4 AND unequal** | **Not this pass.** Score\*. Sestet keys fail `sestetSumN === 6`. Score Lend **manufactures Sestet**. |
| Leftover AP + leftover MP **=== 3** | **Not this pass.** Tally\*. Sestet keys fail `sestetSumN === 6`. |
| Leftover AP === leftover MP **and leftover AP ≥ 1** | **Not this pass.** Poise\* / Equal Gift / Prime Gift (1/1). Sestet keys fail `sestetForbidEqual` at (3,3) and fail `sestetSumN` at every other tie. |
| Leftover AP = 0 **and** leftover MP = 0 | **Not this pass.** Gaunt / Hollow Gift / Bare Sip / Verse Gaunt. Sestet keys fail (sum 0). |
| Leftover AP ≥ 2 **and** leftover MP = 0 (one body) | **Not this pass.** Gait Gift (#1082). (6,0) is Gait Gift **and** a Sestet pair; Sestet Mend still needs **both** bodies. |
| Dual Keep / Purse Keep / Stride Keep surviving **2/2** | **Opens** every Poise gate. **Blocks** every Sestet gate (sum 4 ≠ 6) **and** every Stave gate (sum 4 ≠ 5) **and** every Score gate (`scoreForbidEqual`) **and** every Tally gate (sum 4 ≠ 3) **and** every Gaunt gate. Dual Keep **cannot** manufacture Sestet. |
| Dual Keep surviving **2/1** or **1/2** | **Opens** Tally. **Blocks** Sestet (sum 3). |
| Dual Keep surviving **2/0** or **0/2** | Sum 2. **Blocks** Sestet / Stave / Score / Tally / Poise / Gaunt. Spend nothing; Dual Keep cannot reach 6. |
| Haste / Tempo Gift / Timestep into (4,2) after a 3-AP spend from a 7-AP bar | **Opens** Sestet. The intended bank. A 6 AP / 3 MP bar that pays 3 AP lands at **(3,3)** and **fails** Sestet (Poise). |
| Score Lend on a sum-4 unequal body | **Manufactures Sestet** ((3,1)→(4,2)). Intended hop. |
| Remaining CD `n===3` on a hostile | Cadence Tierce / Court Tierce (ready-unlock of threes). Dock does **not** write 0 on threes. Snuff does **not** write 0 on threes. Tern does **not** write 0 on threes (leaves 3). Cap peels 3 to **2**, not 0. Floor peels 3 to **1**, not 0. |
| Orthogonal plus arm 3 free | Trideca Span occupies all thirteen. Hendeca Span would have painted a 7-spine × 5-crossbar plus (11). Dodeca Span would have painted a 3×4 (12). Penta Span would have painted arm 1 (5). |
| One ally leftover pair + one hostile leftover pair (caster stays) | Psalm Turn inverts AP↔MP on **each**. Hymn Turn stays two allies. Duel Turn stays two hostiles. Tempo Invert stays one-body ally/self. Bar Cross moves leftover **across caster and one target**. |

Dual Keep leftover that survives turn start **never** opens Sestet. Spend Haste / Tempo Gift / a natural 7+ bar, or Score Lend into (4,2), to enter the window.

Sestet Sip on (4,2) → (3,2) is the **intended** Stave manufacture. Stave Sip on (3,2) → (2,2) is the **intended** Poise manufacture. Stave Sip on (4,1) → (3,1) is the **intended** Score manufacture. Score Sip on (3,1) → (2,1) is the **intended** Tally manufacture. Tally Sip on (2,1) → (1,1) is the **intended** Poise manufacture. Do not name-wire any hop; they fall out of the leftover writes.

Score Lend on (3,1) → (4,2) is the **intended** Sestet manufacture. Sestet Lend on (4,2) → (5,3) **exits** Sestet into sum 8. Stave Lend on (3,2) → (4,3) **exits** Stave into sum 7 (**not** Sestet).

---

## 7. Implementation order (not this pass)

1. Discovery ownership split (`SDE-2026-08-31-001`) — without it every Wave-18 id forced into `starterSpells` becomes always-owned.
2. Leftover AP / leftover MP writers (HUD pools after each spend). Dual Keep / Purse Keep / Stride Keep must write surviving leftover at turn start **and keep the cap-2 rule** (Sestet depends on Dual Keep **not** reaching 6).
3. Cadence remaining-CD maps (already required by Waves 5–17). Cadence Floor (#906) is remaining `n>1` → `1`. Cadence Prime (#953) is remaining `n===0` → `1`. Cadence Rise (#962) is remaining `n===1` → `2`. Cadence Snuff (#1011) is remaining `n===1` → `0`. Cadence Cap (#1017) is remaining `n>2` → `2`. Cadence Dock (#1063) is remaining `n===2` → `0`. Cadence Tern (#1082) is remaining `n>3` → `3`. Cadence Tierce is remaining `n===3` → `0`.
4. Occupy-weight **before** Trideca Span (cap 2 cannot host weight 13). Dodeca Span (weight 12) / Hendeca Span (weight 11) / Dec Span (weight 10) / Nine Span (weight 9) / Oct Span (weight 8) have the same prerequisite.
5. Confirm gates for Must Sestet (pre-spend) / Sestet Hold / Verse Sestet / Psalm Turn / `sestetForbidEqual`.
6. Orthogonal plus-arm-3 multi-cell occupy (`tridecaspan`) and empty-kit mine (`sestetpost`).
7. Do **not** land `spell-parched-mend`. Do **not** land a second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern`. Do **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp` / `floorRemainingCdsTo1` / `primeRemainingCdsFrom0` / `snuffRemainingCdsEq1To0` / `capRemainingCdsAbove2To2` / `dockRemainingCdsEq2To0` / `capRemainingCdsAbove3To3` / `tallySumN` / `scoreSumN` / `staveSumN` / `scoreForbidEqual`.

Do not implement production code in this pass.

---

## 8. QA (design-level)

| ID | Check |
| :--- | :--- |
| W18-1 | No Wave-18 id appears in `spellData.ts` / `SPELL_ID_CATALOG` / §1.4 tombstone |
| W18-2 | `spell-parched-mend` is **not** shipped; Dry Gait owns leftover-MP=0 heal |
| W18-3 | `spell-sestet-mend` requires leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP** on **both** bodies. (3,3) fails. (3,2) fails. (3,1) fails. Stave Mend owns **sum === 5**. Score Mend owns **sum === 4 AND unequal**. Tally Mend owns **sum === 3**. Poise Mend / Equal Gift own **equality ≥ 1**. Prime Gift owns **exactly 1/1**. Gait Gift owns **one-body AP ≥ 2 AND MP = 0**. Hollow Gift / Gaunt Mend own **0 + 0**. Lean Gift owns AP=0 and MP≥1 |
| W18-4 | Cadence Tierce is remaining `n===3` → `0`; `n===1`, `n===2`, and `n>3` unchanged; zeros stay 0. Does **not** clone Cadence Dock (`2→0`) / Snuff (`1→0`) / Tern (`n>3→3`) / Cap (`n>2→2`) / Rise (`1→2`) / Prime (`0→1`) / Floor / Swap / Lag / Halve / Crack / Flush |
| W18-5 | Trideca Span is orthogonal plus arm 3, counts as **thirteen**, every cell occupied, click is **center**. Dodeca Span stays 3×4 twelve, click = nearest cell to caster. Hendeca Span stays stretched plus eleven, click = center. Dec Span stays 2×5 ten. Nine Span stays solid nine. Oct Span stays hollow eight. Penta Span stays plus arm 1 five |
| W18-6 | Psalm Turn is mixed-side independent leftover AP↔MP (one same-side non-caster + one opposite-side), caster stays. Does **not** clone Tempo Invert, Purse Turn, Bar Cross, Duel Turn, or Hymn Turn. Does **not** reuse `invertApMp` / `invertHostileLeftoverApMp` / `crossLeftoverApMpTwoBody` / `invertTwoHostilesLeftoverApMp` / `invertTwoAlliesLeftoverApMp`. Does **not** alias Choir Hymn |
| W18-7 | Sestet Hood does **not** retag `even_gallery` / Dual Plate / Prime Plate / Spent Plate / Gait Plate / Dry Plate / Poise Hood / Tally Hood / Score Hood / Stave Hood |
| W18-8 | Sestet Sting bonus is leftover AP + leftover MP === 6 unequal, not Stave Sting’s sum 5, not Score Sting’s sum 4 unequal, not Tally Sting’s sum 3, not Poise Sting’s equality, not Gaunt Sting’s both-0, not Even Sting’s even AP, not Capped Sting’s leftover MP = max, not Tied Gait’s (2,2) |
| W18-9 | Sestet Sip on (4,2) writes (3,2) **Stave**. Stave Sip on (3,2) writes (2,2) **Poise**. Stave Sip on (4,1) writes (3,1) **Score**. Score Sip on (3,1) writes (2,1) **Tally**. Tally Sip on (2,1) writes (1,1) **Poise**. Bare Sip stays leftover MP = 0. Poise Sip stays equality ≥ 1 |
| W18-10 | Must Sestet is **not** in the same CORE as a Strike-only sestet lock (none shipped). Reads leftover **before** debit. Dual Keep 2/2 is Must Poise, not Must Sestet. Dual Keep cannot open Must Sestet. (3,3) is Must Poise |
| W18-11 | Court Tierce is `NOT_PLAYER_LEARNABLE`; `court_tierce_regent` is kit-only |
| W18-12 | Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` do not restamp #808 / #836 / #849 / #837 / #890 / #903 / #906 / #951 / #953 / #962 / #1004 / #1011 / #1017 / #1063 / #1080 / #1082 |
| W18-13 | `mpCost` is 0 on every Wave-18 row |
| W18-14 | `summonAI` values are `"tridecaspan"` / `"sestetpost"` enums, never parsed names |
| W18-15 | Trideca Span does not ship against `ENEMY_SUMMON_CAP === 2` without occupy-weight |
| W18-16 | Verse Sestet does **not** lift at leftover 0/0 (Verse Gaunt), leftover 2/2 (Verse Poise), leftover 3/3 (Verse Poise), leftover 3/0 (Verse Tally), leftover 3/1 (Verse Score), leftover 3/2 (Verse Stave), or leftover 1/1 (Prime Gift) |
| W18-17 | No second `spell-cadence-floor` / `spell-cadence-prime` / `spell-cadence-rise` / `spell-cadence-snuff` / `spell-cadence-cap` / `spell-cadence-dock` / `spell-cadence-tern`. SDE #906 owns Floor. #953 owns Prime. #962 owns Rise. #1011 owns Snuff. #1017 owns Cap. #1063 owns Dock. #1082 owns Tern |
| W18-18 | Legal Sestet pairs are only (6,0) (0,6) (5,1) (1,5) (4,2) (2,4). (3,3) is Poise. (3,2) is Stave. (3,1) is Score. (3,0) is Tally. (2,2) is Poise. (1,1) is Prime Gift. Dual Keep cannot manufacture any Sestet pair. A 6 AP / 3 MP bar that pays 3 AP lands at (3,3) and **fails** Sestet |
| W18-19 | Score Lend (3,1)→(4,2) **manufactures Sestet**. Sestet Lend (4,2)→(5,3) **exits** Sestet. Stave Lend (3,2)→(4,3) **exits** Stave into sum 7, **not** Sestet. Do not name-wire any hop |

---

## 9. Out of scope

- Production TypeScript / Motoko / bindgen / PocketIC.
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / **#903** / **#951** / **#1004** / **#1080** own extra doors).
- Restamping any door in §3.4.
- A fourth `mpCost > 0` walk snipe; Hex of Silence; About Hinge; mid-RAF splice; sixth echo; leftover-sum **=== 3** (Tally); leftover-sum **=== 4 including 2/2** (that is Poise); leftover-sum **=== 4 AND unequal** (Score); leftover-sum **=== 5** (Stave); remaining `n===0` → `1` (Prime); remaining `n===1` → `2` (Rise); remaining `n===1` → `0` (Snuff); remaining `n===2` → `0` (Dock); remaining `n>1` → `1` (Floor); remaining `n>2` → `2` (Cap); remaining `n>3` → `3` (Tern); thirteen-cell occupy aliases; target-only sum===3 / sum===4 / sum===5 / sum===6 heal; leftover **diff** window; two-hostile invert (Duel Turn); two-ally invert (Hymn Turn); one-body invert (Tempo Invert / Purse Turn).
- Cloning Shield / Iron Skin, Blood Mend / Rally, Poison / Venom, Expose / Shadow Veil, Mirror / Reflect, Lens / Overcast, Short Sight / Paper Wind, Tempo Gift / Loan Tempo, Goad / Taunt Oath, Rime Tile / Rime Sheet, File Lance, Blood Tithe, Hex of Silence, Dry Mend, Dry Gait, Parched Mend, Hollow Gift, Cadence Swap, Cadence Floor, Cadence Prime, Cadence Rise, Cadence Snuff, Cadence Cap, Cadence Dock, Cadence Tern, Gaunt Mend, Poise Mend, Equal Gift, Tally Mend, Score Mend, Stave Mend, Lean Gift, Prime Gift, Gait Gift, Tempo Invert, Purse Turn, Bar Cross, Duel Turn, Hymn Turn, Choir Hymn.
- Putting unique #802 / #837 / #849 / #890 / #906 / #953 / #962 / #1011 / #1017 / #1063 / #1082 ids in this catalog.

---

## 10. Catalog index

| SPELL_ID | NAME | ROLE | ACQUISITION | AP | CD | Door |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| `spell-sestet-mend` | Sestet Mend | SUPPORT | MULTI_SOURCE | 3 | 2 | `sestet_cantor` |
| `spell-cadence-tierce` | Cadence Tierce | CONTROL | MULTI_SOURCE | 3 | 2 | `tierce_precentor` |
| `spell-trideca-span` | Trideca Span | SUMMONS | MULTI_SOURCE | 4 | 3 | `span_trideca` |
| `spell-psalm-turn` | Psalm Turn | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-sestet-hood` | Sestet Hood | DEFENSE | ELITE | 2 | 2 | (piece observe) |
| `spell-sestet-sting` | Sestet Sting | DAMAGE | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-sestet-step` | Sestet Step | POSITION | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-sestet-sill` | Sestet Sill | TERRAIN | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-sestet-hold` | Sestet Hold | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-sestet-lend` | Sestet Lend | SUPPORT | ENEMY_DISCOVERY | 2 | 2 | (piece observe) |
| `spell-sestet-sip` | Sestet Sip | CONTROL | ENEMY_DISCOVERY | 2 | 1 | (piece observe) |
| `spell-sestet-post` | Sestet Post | SUMMONS | ENEMY_DISCOVERY | 3 | 3 | (piece observe) |
| `spell-sestet-bounce` | Sestet Bounce | DAMAGE | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-must-sestet` | Must Sestet | CONTROL | ELITE | 3 | 2 | (piece observe) |
| `spell-verse-sestet` | Verse Sestet | CONTROL | ENEMY_DISCOVERY | 3 | 2 | (piece observe) |
| `spell-court-tierce` | Court Tierce | SUPPORT | NOT_PLAYER_LEARNABLE | 6 | 4 | `court_tierce_regent` (kit) |

STATUS: PROPOSED — no production code.

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| Live 32-id catalog | `src/frontend/src/data/spellData.ts` | 9–691 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Backend library filter | `src/frontend/src/utils/adminSafety.ts` | 712–718 |
| `OLD_SPELL_NAMES_SET` | `src/frontend/src/components/WorldExploration.tsx` | 2356–2389 |
| `SPELL_ID_CATALOG` | `src/frontend/src/data/bossKits.ts` | 29–62 |
| `SpellConfig` / `areaShape` / `evasion` | `src/frontend/src/types/gameTypes.ts` | 64, 160–241 |
| Caster-tile rule | `src/frontend/src/engine/targeting.ts` | 184–189 |
| Line targeting (unused by data; no `linear`) | `src/frontend/src/engine/targeting.ts` | 576–617 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Trap stub = barrier | `src/frontend/src/engine/spellEngine.ts` | 442–445 |
| `isSwap` → `swapPositions` | `src/frontend/src/engine/spellEngine.ts` | 637, 767–768; WX 9389 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482–541 |
| Portals impassable | `src/frontend/src/engine/occupancy.ts` | 13–14, 40 |
| AP-only cast debit | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| Enemy kits (owned ids) | `src/frontend/src/engine/enemyAI.ts` | 163–185 |
| Healer inference | `src/frontend/src/engine/enemyAI.ts` | 447–452 |
| `ENEMY_SUMMON_CAP` | `src/frontend/src/data/gameConstants.ts` | 300 |
| Backend six | `src/backend/lib/admin.mo` | 168–191 |
| Feats | `src/backend/lib/admin.mo` | 309–326 |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | 44–103 |
| Boss ids | `src/frontend/src/types/bossTypes.ts` | 390–410 |

**Document status:** PROPOSED. Safe to review and implement in a later, explicit data PR. Not a license to land combat code in the same change as this spec. Coordinate with **#1082** so Gait Gift / Cadence Tern / Prime Plate / Tern Stride land once. Coordinate with **#1063** so Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn land once as Wave-18 family CORE. This catalog stamps as Wave **19** family CORE.
