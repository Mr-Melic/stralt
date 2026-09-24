# Enemy and Elite Evolution Design — Wave 7

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-24  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Seventh daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 6 verbs** (`SPELL_PROPOSALS_2026-09-23.md`, open PR #463): caster-unmoved poke, leftover-AP poke, LoS-blocked poke, 90° hinge around an ally, file-axis attract, independently walking two-cell occupy, primary-target veil, self cooldown reset to 0, ally cooldown −1, leftover-AP share, walk-exit AP tax, enter-swap with the painter, death-AP whelp, next-hit cap 12. Bosses stay on the existing catalog. Oath Blade / About Face stay **boss / closed-class** — not world-pack CORE.

**Does not replace:**
- [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) (Wave 1, 22 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) (Wave 2, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) (Wave 3, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-e9f5/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md) (Wave 4, 15 family sheets — open PR #349; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-3823/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md) (Wave 5, 15 family sheets — open PR #405; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-ef30/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md) (Wave 6, 13 family sheets — open PR #452; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 6

Re-read against `HEAD` `0f5363f` (Merge PR #332). Wave 6 closed as docs in the 2026-09-23 pass (PR #452). SPELL_PROPOSALS Wave 6 (PR #463) stamped the two holes Wave 6 **held** (independently walking two-cell occupy; self cooldown reset to 0) plus fourteen siblings. SDE Wave 6 (PR #480) then **stamped** those ids as G≥6 extras on older families. Stamping a verb onto `iron_golem` / `tax_scribe` is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (Waves 4–6 quoted the same). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 6 claim | 2026-09-24 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–6 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287; WX 5862–5866 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` / `span` / **`twinspan`** / **`spark`** |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Wave 6 facing families **and** About Face still fail closed until a battle-walk writer exists |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 7 CORE rows stay `mpCost: 0` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | File Reel is the first **cast** caller of `applyAttract` along one axis |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| Walk-spend field / leftover-AP riders / LoS invert / hinge / exit tax / enter-swap / hit cap | Still absent in live catalog | Wave 7 primary opportunity |

**Wave 1 ids — do not re-propose:**  
`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `crimson_spawn`, `shadow_lurker`, `storm_caller`, `glass_sniper`, `cinder_martyr`, `pale_cantor`, `hex_chorister`, `leash_warden`, `null_censor`, `rift_hook`, `brood_chanter`, `glyph_sower`, `blink_cutter`, `coil_arbiter`, `rust_reaver`.

**Wave 2 ids — do not re-propose:**  
`rank_lancer`, `bash_bruiser`, `snare_weaver`, `trip_mason`, `void_anchoret`, `bell_sexton`, `execute_jackal`, `plate_warden`, `pain_suture`, `stone_castellan`, `ricochet_vicar`, `tax_scribe`, `mist_walker`, `leech_familiar`.

**Wave 3 ids — do not re-propose:**  
`fuse_binder`, `coup_duelist`, `ignite_alchemist`, `dim_optic`, `tempo_precentor`, `ash_absolver`, `plus_cutter`, `rime_mason`, `smoke_thurifer`, `sink_chanter`, `hook_chaplain`, `pylon_prelate`, `goad_herald`, `twin_tether`.

**Wave 4 ids — do not re-propose:**  
`ley_tollkeeper`, `fan_prelate`, `pawn_broker`, `recoil_squire`, `twin_porter`, `sidestep_warder`, `far_stinger`, `soul_siphon`, `pit_mason`, `font_cantor`, `share_optic`, `stride_hunter`, `hex_teller`, `slide_mason`, `axis_locksmith`.

**Wave 5 ids — do not re-propose:**  
`gale_deacon`, `twin_sentry`, `pincer_acolyte`, `oblique_cantor`, `pair_binder`, `ledger_siphon`, `shove_chaplain`, `origin_mason`, `bait_prelate`, `morrow_walker`, `surplus_warder`, `sated_knight`, `verse_scribe`, `misstep_herald`, `bitter_censor`.

**Wave 6 ids — do not re-propose:**  
`oncoming_knight`, `pin_cantor`, `glance_ward`, `gait_muter`, `vault_chaplain`, `span_warder`, `span_prelate`, `cadence_thief`, `brand_plate`, `cover_squire`, `lintel_mason`, `act_teller`, `act_sexton`.

Same-day SPELL_PROPOSALS Wave 7 is now open as PR #525 (`SPELL_PROPOSALS_2026-09-24.md`, branch `cursor/stralt-spell-mechanics-1feb`). This Wave 7 family pass still consumes **#463** verbs only. **Wave 8** consumes the 2026-09-24 catalog. This run does not mint colliding `wave7:` spell ids.

---

## 1. Shared rules (inherit Wave 1 §2)

This pass does **not** retune `pickEnemyLevelFromTiers` percents, RAF, map generation, turn order, or damage math.

Reuse Wave 1:

- Relative band `R = enemy.level - player.level`, `T = tierSize` (default 10).
- Stat ratios after `calcEnemyMaxHp` / `getEnemyBaseStats` — family HP must **survive** battle start.
- Variant floors: BASE min `aiTier` 1, VETERAN 3, ELITE 6, CHAMPION 8.
- Rarity second roll after level pick (`wVeteran` / `wElite` / `wChampion` vs `R/T` + dungeon depth).
- Rewards: 1.00 / 1.15 / 1.35 / 1.60× on existing `level * 20` XP and Doka, **only** through `applyRewards`.
- Explicit `aiProfile` on every family. Non-healers: no `healAmount` in CORE.
- Preferred chassis forced on family roll.
- `usableByEnemy: false` stays false unless a sheet flips **that one id**.
- Proposed spells are `SpellConfig` rows with flags — never `spell.name` heuristics.

**Fifth variant (Wave 2 specified the 2% `wRare` skin):** palette + **one borrowed RARE spell from this family's allowed categories**. Never borrow a forbidden category. Never a new persist stat. This run does not invent a generator.

**Stationary-post / two-body cap (extend Wave 6):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair in the same pack, not two. Twin Span shares `ENEMY_SUMMON_CAP` (`gameConstants.ts` 300 = 2) and **counts as two**. Do **not** also roll wolf/archer overlay onto a Twin Span or Spark body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-cell system cap (extend Wave 6):** at most **one** two-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, **or** a Twin Span pair, never two of those. Twin Span is **not** Span Guard: the posts walk independently and die if Chebyshev > 1.

**Walk-spend prerequisite (new):** Post Sting **fails closed** (12 only) until battle walks write a first-class `walkMpSpentThisTurn` (or equivalent) on the turn actor. Forced-move does **not** increment that field (same contract as Stride Mute). Do not invent a persist stat. Do not read pixels.

**Facing prerequisite (unchanged):** About Face / Oncoming / Facing Pin / Glance Cut still fail closed until battle walks write `currentView`. This pass does **not** add a facing family.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Oath Blade stays `oath_censor` first-win. About Face stays `about_regent` kit-only / `pin_cantor` CHAMPION witness. Hinge Step MULTI child `hinge_porter` — first child wins vs family observe. Exit Tithe MULTI child `exit_mason` — first child wins. Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor`.

SDE Wave 6 unique CORE (`spell-dull-edge`, `spell-pet-sill`, `spell-late-purse`, `spell-pet-share`, `spell-short-leash`, …) stay **G≥6 extras** on older families this pass. Dedicated families for those verbs wait for Wave 8 if they still have no CORE owner.

---

## 2. Why Wave 7 exists (gaps Waves 1–6 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs. Wave 6 covered SPELL_PROPOSALS Wave 5.

SPELL_PROPOSALS Wave 6 (#463) then stamped the holes Wave 6 **held**. A G≥6 extra on `iron_golem` is not a CORE sentence. Dedicated families own the verb.

| Unused Wave 6 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-post-sting` (bonus iff **caster** spent 0 walk MP) | `stride_hunter` (bonus iff **target** moved); Camp Tax (unmoved **hostile**); Planted Stance (self buff, not a poke) | The gun wants to **stand**. Walking drops the +10. |
| `spell-purse-cut` (bonus iff **target** leftover AP ≥ 2) | `ledger_siphon` (steals AP); `surplus_warder` (your leftover AP **evade**); `act_teller` (they act sooner) | Cut is a **hit**. It does not debit their bar. |
| `spell-blind-corner` (bonus iff Bresenham LoS is **blocked**) | `glass_sniper` (min-range flat); `far_stinger` (Chebyshev scale); `smoke_thurifer` (places the block); Pit Sight (pit on the ray) | Open pit does **not** pay. The +12 is the wall / smoke / span. |
| `spell-hinge-step` (90° rotate **caster** around an ally) | `vault_chaplain` (blink the **ally** 3–4); `hook_chaplain` (pull ally **to caster**); `shove_chaplain` (shove 1); Relay Dash (walk ≤ 2); `mist_walker` / `morrow_walker` (**self** blink) | Pivot is a **body**. Distance is always the clockwise adjacent. |
| `spell-file-reel` (pull 1 along a **shared rank or file**) | `void_anchoret` (any-dir Hook); `sink_chanter` (toward a **tile**); `pair_binder` (pair toward **midpoint**); File Lance (ray poke) | Diagonal share is illegal. 0 damage. |
| `spell-twin-span` (two 1-HP posts that **walk independently** while adjacent) | `span_warder` (one id, **rigid** pair); `span_prelate` (stationary 2-cell); Twin Guard (two-ally **swap**) | Break adjacency and the farther post dies. Counts as **two** summons. |
| `spell-aim-veil` (cannot be **primary** spell target) | `smoke_thurifer` (LoS block); `shadow_lurker` (RES/SP veil); `goad_herald` (forced **target**); `cover_squire` (redirect a hit that already chose you) | AoE / Strike still hit. Attack Nearest must skip. |
| `spell-cadence-break` (self last-id remaining CD → **0**, once/battle) | `cadence_thief` (hostile −1); Timestep (AP/MP, not CD); Loan Tempo (AP grant) | Reset is **self**, last owned id, once. Not a steal and not a bar lock. |
| `spell-cadence-lend` (ally highest remaining CD −1) | `tempo_precentor` (+1 AP next turn); `cadence_thief` (hostile) | Tempo on the **cooldown map**, by id, on an **ally**. |
| `spell-split-purse` (move 1 leftover AP to an adjacent ally) | `tempo_precentor` (next-turn AP); `ledger_siphon` (hostile steal); Drain Courage (debit, no grant) | They must **leave** 1 on purpose after paying 2. |
| `spell-exit-tithe` (leaving the cell costs +1 AP, **walk** only) | `tax_scribe` / Glyph Tax (**enter**); `origin_mason` (cast-from); `lintel_mason` (HP% walk gate) | Forced-move exits **free**. Stay-and-cast is legal. |
| `spell-hinge-tile` (next enterer **swaps with the painter**) | `rift_hook` (cast-time Swap); `pawn_broker` (two hostiles, caster stays); `twin_porter` (pad pair); `trip_mason` (enter-root) | Paint now. Enter later. Dead painter = free enter. |
| `spell-spark-whelp` (1-HP whelp; death +1 AP if owner is **current**) | `cinder_martyr` (self HP payload); `brood_chanter` (mobile pets); Bomber (Inferno on death); Convert Whelp (steal a dying pet) | Kill it on **their** turn and the grant is lost. |
| `spell-turn-cap` (next applied hit `min(applied, 12)`) | `plate_warden` (absorb pool); `surplus_warder` (miss); `cover_squire` (redirect); Iron Skin (RES%) | Two small hits beat it. Do not edit `combatMath.ts`. |

**Do not family (closed / boss):** `spell-oath-blade` (`oath_censor` first-win; kit may demonstrate on that extra door only), `spell-about-face` (`NOT_PLAYER_LEARNABLE`; `pin_cantor` CHAMPION witness / `about_regent` kit — same law as Board Tilt on `slide_mason`). Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold stay where Waves 5–6 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 7 CORE rows are `mpCost: 0`.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a fifth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor.  
Do **not** family cooldown reset of **another combatant’s** bar to 0 (Break is self last-id only).  
Do **not** family a three-cell occupy.  
Do **not** family a forced-move that also writes `currentView`.  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint `wave7:` colliding spell ids.

---

## 3. Encounter synergy packs (Waves 1–7)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one two-cell system. Twin Span fills the summon cap.

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Post Tithe | `post_stinger` + `tithe_mason` + `axis_locksmith` | Camp the tax cell; walk-off pays and drops the +10 |
| Purse Court | `purse_scribe` + `act_teller` + `gait_muter` | Cut the loaded bar they cannot spend on a 3-AP nuke after a close |
| Corner Fog | `corner_bishop` + `smoke_thurifer` + `span_warder` | Place the block, then cash the +12 |
| Hinge Cover | `hinge_squire` + `cover_squire` + `glance_ward` | Swing behind the pivot, then redirect / Glance the new front |
| Reel Tithe | `file_reeler` + `tithe_mason` + `oncoming_knight` | Pull onto the tax; they face the charger or pay to leave |
| Twin Plug | `twin_span` + `lintel_mason` + `glass_sniper` | Walking two-cell plug + healthy bodies cannot bypass |
| Veil Corner | `veil_cantor` + `corner_bishop` + `goad_herald` | Forced Strike into a veiled body; spells must AoE or skip |
| Break Choir | `cadence_breaker` + `ignite_alchemist` + `tempo_precentor` | Reset Inferno once; gift AP so the second cash lands |
| Lend Fan | `cadence_lender` + `gale_deacon` + `font_cantor` | Shave Gale CD; pulse keeps the gun standing |
| Spark Purse | `spark_chanter` + `purse_splitter` + `cadence_breaker` | Transfer 1, detonate +1 on **their** turn, reset the follow-up |
| Hinge Trap | `hinge_mason` + `fuse_binder` + `pit_mason` | Enter-swap onto a wick / hole |
| Cap Veil | `cap_warder` + `veil_cantor` + `goad_herald` | Forced swing caps at 12; spells cannot primary the veil |
| Reel Corner | `file_reeler` + `corner_bishop` + `pylon_prelate` | Pull them behind the post, then shoot the blocked LoS |
| Split Spark | `purse_splitter` + `spark_chanter` + `act_sexton` | Gift leftover AP, then arm a turn-start 14 they want to keep |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), and Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute).

Do **not** pack as PAIR (COURT later is fine):

- `post_stinger` + `stride_hunter` / `far_stinger` / `glass_sniper` without a tithe / lock third (two guns, same lesson)
- `purse_scribe` + `ledger_siphon` / `surplus_warder` (steal vs cut vs evade leftover AP)
- `corner_bishop` + `glass_sniper` / `far_stinger` / `oblique_cantor` without a smoke / span / pylon third
- `hinge_squire` + `vault_chaplain` / `hook_chaplain` / `shove_chaplain` / `mist_walker` / `morrow_walker` / `blink_cutter`
- `file_reeler` + `void_anchoret` / `sink_chanter` / `pair_binder`
- `twin_span` + `span_warder` / `span_prelate` / `pylon_prelate` / `bait_prelate` / `font_cantor` / `stone_castellan`
- `veil_cantor` + `smoke_thurifer` / `sidestep_warder` as PAIR (LoS vs untargetable vs miss)
- `cadence_breaker` + `cadence_thief` (reset vs steal)
- `cadence_lender` + `tempo_precentor` as PAIR (CD vs next-turn AP — Lend Fan with Gale is the lesson)
- `purse_splitter` + `tempo_precentor` / `ledger_siphon`
- `tithe_mason` + `tax_scribe` / `origin_mason` / `glyph_sower`
- `hinge_mason` + `rift_hook` / `pawn_broker` / `twin_porter` / `trip_mason`
- `spark_chanter` + `cinder_martyr` / `brood_chanter` as PAIR (two death engines / two summoners)
- `cap_warder` + `plate_warden` / `surplus_warder` / `cover_squire` as PAIR (absorb vs miss vs redirect vs cap)

Do not spawn Twin Plug / Reel Corner on a 1-tile closet (needs a file plus an adjacent free cell). Do not spawn Face Court / About Face witness until the battle-walk facing writer exists. Exit paints, hinge paints, and Twin Span posts are battle-time — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 7

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-f0eb/docs/automation/SPELL_PROPOSALS_2026-09-23.md) (PR #463) unless marked otherwise.

---

### ENEMY_ID: `post_stinger`

- **NAME:** Post Stinger
- **ROLE:** sniper / artillery (caster-unmoved poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `pawn` **without** heal. Distinct from `stride_hunter` (target moved), `far_stinger` (distance tape), `glass_sniper` (min-range flat). At most one camp-gun per pack as PAIR vs Far / Glass (COURT with Tithe is the lesson).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they already walked. Peer: Post Sting only when `walkMpSpentThisTurn === 0`. Above: refuse the id after any walk debit (Frost / Mark instead); do not fake the +10.
- **STAT_SCALING_RULE:** hp 0.90, sp 1.15, sr 0.90, res 0.95, init 0.85, chc 1.05. Identity is the **stand-and-shoot tell**, not a 22-every-turn Frost. If it tops the meter after walking, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_caster_unmoved"`. VETERAN: skip if they already walked. ELITE: Tithe-partner — paint the escape, then sting. CHAMPION: never walk after the shot in the same turn (would lie about next-turn spend).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-post-sting`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **escape cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-hold-ground` only if Nail Down is absent (they truly cannot be pushed off)
- **ELITE_SPELL_POOL:** none new — honesty is the elite. Do **not** unlock Far Sting as identity.
- **SIGNATURE_MECHANICS:** 12, +10 iff walk-MP spent this turn is 0. Missing field fail closed (12 only). Forced-move does not count as walk. Distinct from Still Brand (target stood).
- **VARIANT_PROGRESSION:** BASE frost-or-sting → VETERAN skip-if-walked → ELITE paint-then-sting → CHAMPION no-walk-after
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE on Post Tithe.
- **SYNERGIES:** `tithe_mason`, `axis_locksmith`, `snare_weaver`, `veil_cantor`
- **WEAKNESSES:** Push / pull / Swap them off the post before they shoot; stay at range 4; Sidestep the 12
- **PLAYER_COUNTERPLAY:** Force a walk; don’t stand in range 3 while they camp; Hook them off the aisle
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-post-sting` (ENEMY_DISCOVERY; SDE G≥6 stamp on `iron_golem` is MULTI — first child wins; do not restamp a feat)
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (`walkMpSpentThisTurn` on the turn actor)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `purse_scribe`

- **NAME:** Purse Scribe
- **ROLE:** assassin / debuffer (leftover-AP poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** `starter-heal`. Distinct from `ledger_siphon` (steals AP), `surplus_warder` (your leftover evade), `act_teller` (queue tax). At most one leftover-AP engine as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if target current AP ≤ 1. Peer: Purse Cut only if current AP ≥ 2. Above: refuse Cut on a spent bar (would be a 10 pretending to be 22).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.95, res 0.80, init 1.20, chc 1.05. Identity is the **loaded-bar tell**, not a bigger Drain Courage. If they debit AP, the kit leaked toward Ledger.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_target_ap_ge_2"`. VETERAN: skip AP ≤ 1. ELITE: act **before** a 5-AP Inferno dump. CHAMPION: never Drain the bar first (that would kill their own rider).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-purse-cut`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-drain-courage` only if `ledger_siphon` is **absent** (teaching contrast: debit vs hit)
- **ELITE_SPELL_POOL:** none — leftover honesty is the elite
- **SIGNATURE_MECHANICS:** 10, +12 iff target current AP ≥ 2. Does **not** steal. Missing `currentAp` fail closed (10 only). Summons use their own current AP.
- **VARIANT_PROGRESSION:** BASE frost-or-cut → VETERAN skip-spent → ELITE cut-before-nuke → CHAMPION no-debit
- **RARITY_CURVE:** Standard. +ELITE on Purse Court.
- **SYNERGIES:** `act_teller`, `gait_muter`, `cadence_breaker` (they hold AP for a second Inferno)
- **WEAKNESSES:** Spend down to 0–1 before they act; Haste does not help (AP, not MP)
- **PLAYER_COUNTERPLAY:** Dump Inferno / Strike first; Split Purse the leftover to a pet
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-purse-cut` (ENEMY_DISCOVERY). Do not restamp `doka_hoarder`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `corner_bishop`

- **NAME:** Corner Bishop
- **ROLE:** artillery / anti-ranged (LoS-blocked poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `glass_sniper` (min-range), `far_stinger` (distance), `smoke_thurifer` (places fog), `oblique_cantor` (diagonal poke). Reroll on maps with no walls / smoke / span until a pack partner can place a block.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if LoS is open. Peer: Blind Corner only if the live Bresenham helper **fails**. Above: refuse Corner on open LoS (would be a 10 pretending to be 22); do not treat Open Pit as a block.
- **STAT_SCALING_RULE:** hp 0.70, sp 1.15, sr 0.85, res 0.75, init 1.10, chc 1.10. Identity is the **blocked-ray tell**. If it tops the meter in an open field, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_los_blocked"`. VETERAN: skip open LoS. ELITE: wait one turn if Smoke / Span / Pylon will create the block. CHAMPION: `lineOfSight: false` honesty — the cast is legal in the open; they still refuse the rider-less dump.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-blind-corner`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **block cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-smoke-veil` only if `smoke_thurifer` is absent
- **ELITE_SPELL_POOL:** none — open-LoS honesty is the elite. Do **not** promote backend `shadow_strike`.
- **SIGNATURE_MECHANICS:** 10, +12 iff existing `hasLoS` would have failed (wall, barrier, smoke, span body). Open pit does **not** pay. Occupying bodies block the same way live LoS does.
- **VARIANT_PROGRESSION:** BASE frost-or-corner → VETERAN skip-open → ELITE wait-for-block → CHAMPION no-open-dump
- **RARITY_CURVE:** Standard. +ELITE on Corner Fog / Reel Corner.
- **SYNERGIES:** `smoke_thurifer`, `span_warder`, `pylon_prelate`, `file_reeler`, `twin_span`
- **WEAKNESSES:** Step into open LoS; stay adjacent; overwrite smoke with nothing
- **PLAYER_COUNTERPLAY:** Don’t hide behind the post they just placed; kill the fog first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-blind-corner` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (invert the live LoS boolean)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hinge_squire`

- **NAME:** Hinge Squire
- **ROLE:** teleporter / protector (90° rotate around an ally)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight`. Distinct from `vault_chaplain` (blink **them** 3–4), `hook_chaplain` / `shove_chaplain`, `mist_walker` / `morrow_walker`. At most one hinge body per pack. Needs a living allied pivot. Reroll solo. Do **not** name this `hinge_porter` (proposed MULTI child door).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the clockwise cell is blocked. Peer: Hinge only if landing is free **and** Chebyshev from the ally stays 1. Above: refuse a 1–2 walk substitute (that is Relay Dash); skip lava landings if HP% < 40.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.90, sr 1.00, res 0.90, init 1.20, chc 0.90. Identity is the **clockwise adjacent**, not damage. If the Squire **walks** 2, the kit leaked toward Relay Dash.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "rotate_around_ally_clockwise"`. VETERAN: skip illegal landing. ELITE: land into Cover / Glance front / vacated Exit Tithe. CHAMPION: never self-blink; never counterclockwise (missing `hingeClockwise` fail closed).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-hinge-step`
- **ADVANCED_SPELL_POOL:** `starter-shield`, `spell-mark` on the **vacated** cell
- **RARE_SPELL_POOL:** `spell-cover-step` only if `cover_squire` is absent
- **ELITE_SPELL_POOL:** none — clockwise honesty is the elite
- **SIGNATURE_MECHANICS:** Click adjacent living ally; teleport **self** 90° clockwise. Player body is a legal pivot in the spell card; **enemy AI uses an allied body**, not the player, unless a later peel kit is explicit. Nail Down fizzles (AP spent, observe Hinge). Forced-move does not write facing.
- **VARIANT_PROGRESSION:** BASE strike+hinge → VETERAN skip-blocked → ELITE land-for-cover → CHAMPION no-self
- **RARITY_CURVE:** Standard. +ELITE on Hinge Cover.
- **SYNERGIES:** `cover_squire`, `glance_ward`, `tithe_mason`, `fuse_binder`
- **WEAKNESSES:** Occupy the clockwise cell; kill the pivot; Nail Down the Squire
- **PLAYER_COUNTERPLAY:** Stand on the only clockwise floor; don’t leave a packed front after they swing
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hinge-step` (MULTI: family observe+win **or** `hinge_porter` first-win — first child wins). Do not restamp the boss child.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy teleport of self)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `file_reeler`

- **NAME:** File Reeler
- **ROLE:** displacement specialist (file-axis attract)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook`. Distinct from `void_anchoret` (any-dir Hook), `sink_chanter` (tile gravity), `pair_binder` (pair midpoint), `rank_lancer` (ray poke). At most one attract engine as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they do not share rank/file. Peer: Reel only if aligned **and** the 1-step toward the Reeler is free or a hazard. Above: refuse diagonal share (targeting rejects — do not spend); skip a pull into a safer tile than stay.
- **STAT_SCALING_RULE:** hp 0.95, sp 0.85, sr 1.05, res 0.95, init 1.10, chc 0.80. Identity is **0-damage axis pull**. If they deal Hook-class damage, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "attract_one_along_shared_file"`. VETERAN: skip unaligned / blocked-worse. ELITE: land on Tithe / Fuse / Pit / Cinder. CHAMPION: never call a second attract helper — `applyAttract` along the shared axis only.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-file-reel`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **landing**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-hook-line` only if `void_anchoret` is absent (teaching: any-dir vs file)
- **ELITE_SPELL_POOL:** none — axis honesty is the elite
- **SIGNATURE_MECHANICS:** Legal only on shared rank **or** file. Pull 1 via existing `applyAttract`. Attract does not write `currentView`. Diagonal is illegal before AP.
- **VARIANT_PROGRESSION:** BASE frost+reel → VETERAN skip-unaligned → ELITE land-for-tax → CHAMPION one-helper
- **RARITY_CURVE:** Standard. +ELITE on Reel Tithe / Reel Corner.
- **SYNERGIES:** `tithe_mason`, `oncoming_knight`, `corner_bishop`, `fuse_binder`, `pit_mason`
- **WEAKNESSES:** Stand on a diagonal; Barrier the step; Nail Down / Grounded Lock
- **PLAYER_COUNTERPLAY:** Leave the file; occupy the step; don’t stand on their rank at range 4
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-file-reel` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (first cast caller of `applyAttract` on one axis)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `twin_span`

- **NAME:** Twin Span
- **ROLE:** summoner (independently walking two-cell occupy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `king` **without** heal / Rally. Distinct from `span_warder` (rigid self pair), `span_prelate` (stationary 2-cell), `pylon_prelate` (1-cell empty). Counts as the pack’s two-cell system **and** fills `ENEMY_SUMMON_CAP` (two bodies). Do **not** also roll wolf/archer overlay.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if two adjacent free cells do not exist. Peer: place only if both cells free **and** they plug a file. Above: refuse if a Span / Pylon / Font / Bait already occupies one of the cells; skip if placing the second would exceed the cap (fizzle both).
- **STAT_SCALING_RULE:** hp 1.05, sp 0.80, sr 1.00, res 1.00, init 0.90, chc 0.80. Identity is **two 1-HP walkers**, not a shooting tower. Posts: HP 1, `damageScale: 0`, 1 MP, 0 AP.
- **AI_TIER_PROGRESSION:** Profile `caster` (place, then camp). `aiHint: "spawn_adjacent_walkable_pair"`. VETERAN: skip no-two-cells. ELITE: walk **one** post one step to re-aim the plug; never walk both apart. CHAMPION: adjacency-break honesty — push that separates them **kills the farther from the owner** (no Bomber Inferno).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-twin-span`
- **ADVANCED_SPELL_POOL:** `starter-frost` (after the pair is down), `spell-iron-skin`
- **RARE_SPELL_POOL:** `spell-low-lintel` only if `lintel_mason` is absent
- **ELITE_SPELL_POOL:** the pair itself is the elite unlock (acquisition ELITE on the spell)
- **SIGNATURE_MECHANICS:** `summonAI: "twinspan"` enum, lifespan 3, kit empty, Strike illegal on posts. After any walk or forced-move, Chebyshev > 1 → farther post dies. Blocks walk **and** LoS. `inferSummonArchetype` must **not** parse `"Twin"` / `"Span"`.
- **VARIANT_PROGRESSION:** BASE strike+place → VETERAN skip-blocked → ELITE re-aim-one → CHAMPION break-honesty
- **RARITY_CURVE:** Standard. +ELITE on Twin Plug. Shares two-cell + summon caps.
- **SYNERGIES:** `lintel_mason`, `glass_sniper`, `corner_bishop`, `cover_squire`
- **WEAKNESSES:** Push one off adjacency; AoE both (1 HP); File Vault over them; Null Censor (COURT, not PAIR)
- **PLAYER_COUNTERPLAY:** Don’t fight the plug — break the pair; burn both posts
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-twin-span` (ELITE observe+win). Nested kit empty — no extra id. Do not restamp `alabaster_fortress`.
- **REWARD_EXPECTATION:** Standard. Post death is not a reward event (`countsTowardKillRewards` false).
- **IMPLEMENTATION_COMPLEXITY:** HIGH (dual occupancy + adjacency invariant). New helpers; do not grow WX.
- **STATUS:** PROPOSED

---

### ENEMY_ID: `veil_cantor`

- **NAME:** Veil Cantor
- **ROLE:** protector / kiter (cannot be primary spell target)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `pawn` **without** heal. Distinct from `smoke_thurifer` (LoS), `shadow_lurker` (RES/SP), `goad_herald` (forced target), `cover_squire` (redirect). At most one veil body per pack as PAIR vs Smoke.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if already veiled or the player is out of all hostile ranges. Peer: Aim Veil when a 3+ AP primary is the likely next hostile action. Above: refuse Veil if they are the only legal Strike target **and** no Cover / Cap partner (the veil does not stop Strike).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.10, res 0.85, init 1.15, chc 0.80. Identity is the **reject-tile**, not extra RES. If Inferno is their threat, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "self_if_likely_primary_target"`. VETERAN: skip already-veiled / out of range. ELITE: Veil then Blind Corner from behind a block. CHAMPION: Attack Nearest skip honesty — they must not also be the only body (or the player just Strikes).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-aim-veil`
- **ADVANCED_SPELL_POOL:** `spell-shadow-veil` (RES after the veil drops), `spell-mark`
- **RARE_SPELL_POOL:** `spell-goad` only if `goad_herald` is absent (forced Strike into the veil)
- **ELITE_SPELL_POOL:** none — AoE honesty is the elite
- **SIGNATURE_MECHANICS:** 1 round. Hostile `targetType: enemy` / `self` aimed at the Cantor **rejects the tile**. AoE / line / chain that already includes the cell still hits. Strike still hits. Bait Pylon intercept still runs if they aimed at the owner.
- **VARIANT_PROGRESSION:** BASE frost+veil → VETERAN skip-redundant → ELITE veil-then-corner → CHAMPION nearest-skip
- **RARITY_CURVE:** Standard. +ELITE on Veil Corner / Cap Veil.
- **SYNERGIES:** `corner_bishop`, `goad_herald`, `cap_warder`, `cover_squire` (COURT later)
- **WEAKNESSES:** Frost Nova / Chain / Inferno AoE; walk adjacent and Strike; wait the round
- **PLAYER_COUNTERPLAY:** Don’t primary them — AoE the file; Goad is their pack’s trap
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-aim-veil` (ENEMY_DISCOVERY; arming observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (targeting reject + Attack Nearest skip)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_breaker`

- **NAME:** Cadence Breaker
- **ROLE:** buffer / status specialist (self CD reset to 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** `starter-heal`. Distinct from `cadence_thief` (hostile −1), `tempo_precentor` (AP grant), Timestep (AP/MP). At most one reset engine per pack. Do **not** give Inferno on BASE (the once/battle loop is the ELITE tell).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no owned id is on CD. Peer: Break only if last resolved owned id has remaining CD > 0. Above: refuse Break as the first action of the fight (nothing to reset); refuse reset of this id / Timestep / Sacrifice / any `isSummon`.
- **STAT_SCALING_RULE:** hp 0.75, sp 1.15, sr 1.00, res 0.80, init 1.10, chc 0.95. Identity is **one second Inferno**, not a fatter first Inferno. If they reset to 0 every turn, the once/battle flag leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "reset_last_owned_cooldown_if_gt_0"`. VETERAN: skip no-CD. ELITE: Inferno → Break → Inferno in one fight, never a third. CHAMPION: still once/battle; never write `spellLevelKeys`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-break`
- **ADVANCED_SPELL_POOL:** `spell-inferno` (the reset target), `spell-mark`
- **RARE_SPELL_POOL:** `spell-gale-fan` only if `gale_deacon` / `fan_prelate` are absent (second cone, still once)
- **ELITE_SPELL_POOL:** Inferno is the elite door, not a second reset
- **SIGNATURE_MECHANICS:** Once per battle. Sets remaining CD to 0 on the last **owned** id successfully resolved that still has remaining CD > 0. Fizzle after AP **is** observation. Cannot reset Break itself.
- **VARIANT_PROGRESSION:** BASE frost+break → VETERAN skip-empty → ELITE two-inferno → CHAMPION once-honesty
- **RARITY_CURVE:** Standard. +ELITE on Break Choir / Spark Purse.
- **SYNERGIES:** `ignite_alchemist`, `tempo_precentor`, `spark_chanter`, `brand_plate` (COURT: Brand still writes after a later consume)
- **WEAKNESSES:** Kill them on the 4 AP dump; Mute the second Inferno; Brand the Inferno so even a reset starts later
- **PLAYER_COUNTERPLAY:** Don’t let the first Inferno land if you cannot survive the second; focus the Breaker
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-break` (ENEMY_DISCOVERY; fizzle observes)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (cooldown map write by id; once/battle combatant flag)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_lender`

- **NAME:** Cadence Lender
- **ROLE:** buffer (ally CD −1)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `tempo_precentor` (next-turn AP), `cadence_thief` (hostile), `cadence_breaker` (self 0). At most one CD-support as PAIR vs Tempo (COURT with Gale is the lesson). Reroll if no ally on CD and no ally has a CD-bearing id.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no ally remaining CD > 0. Peer: Lend the highest remaining (ties lowest id string — do not override to a named id). Above: refuse self-target (that is Break).
- **STAT_SCALING_RULE:** hp 0.70, sp 0.85, sr 1.00, res 0.80, init 1.25, chc 0.75. Init is high so the shave lands **before** the ally acts. If this unit tops the damage meter, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `buffer` (ally-first). Until that profile exists, do **not** put `starter-heal` on this kit. `aiHint: "ally_highest_cd_minus_1"`. VETERAN: skip no-CD. ELITE: lend Gale / Inferno / Iron Skin, not Slow, when both sit. CHAMPION: never steal (Thief stays another body).
- **CORE_SPELL_POOL:** `spell-cadence-lend`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-haste`, `spell-iron-skin` (on the lent body)
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if `tempo_precentor` is absent
- **ELITE_SPELL_POOL:** none — −1 honesty
- **SIGNATURE_MECHANICS:** Ally highest remaining CD −1 (min 0). Does not copy an id. Does not write spell levels. Cannot lend to self.
- **VARIANT_PROGRESSION:** BASE frost+lend → VETERAN skip-empty → ELITE lend-the-nuke → CHAMPION no-steal
- **RARITY_CURVE:** Standard. +ELITE on Lend Fan.
- **SYNERGIES:** `gale_deacon`, `font_cantor`, `ignite_alchemist`, `cadence_breaker` (COURT later, not PAIR)
- **WEAKNESSES:** Kill the ally; hold the nuke until after they lend a Slow; isolated 1v1
- **PLAYER_COUNTERPLAY:** Focus the Lender; don’t sit on a CD 3 if you can dump first
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-lend` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `purse_splitter`

- **NAME:** Purse Splitter
- **ROLE:** buffer (share 1 leftover AP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `king` or `bishop` **without** Rally heal. Distinct from `tempo_precentor` (next-turn AP), `ledger_siphon` (hostile), Drain Courage (debit, no grant). Reroll if no adjacent ally.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if leftover after a 2-cost would be 0. Peer: Split only if leftover ≥ 1 **after** pay **and** the ally is under max AP. Above: refuse dump-then-split (would transfer 0 and waste the tell).
- **STAT_SCALING_RULE:** hp 0.70, sp 0.80, sr 1.00, res 0.80, init 1.20, chc 0.75. Identity is the **leave-1 decision**. If they gift 2, the kit leaked toward Tempo.
- **AI_TIER_PROGRESSION:** Profile `buffer` (ally-first; no `healAmount`). `aiHint: "give_one_leftover_ap_to_adjacent_ally"`. VETERAN: skip leftover 0. ELITE: Split into a Spark / Gale that still has a slot. CHAMPION: Challenge AP spend records the **2**, not the transferred 1.
- **CORE_SPELL_POOL:** `spell-split-purse`, `starter-frost`
- **ADVANCED_SPELL_POOL:** `spell-haste`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-tempo-gift` only if `tempo_precentor` is absent
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** After live AP debit, move 1 leftover current AP to an adjacent ally this turn, capped at their max. Leftover 0 still resolves (chrome) but transfers 0 — AI must not choose that. Cannot target a hostile.
- **VARIANT_PROGRESSION:** BASE frost+split → VETERAN skip-empty → ELITE gift-the-follow-up → CHAMPION spend-honesty
- **RARITY_CURVE:** Standard. +ELITE on Spark Purse / Split Spark.
- **SYNERGIES:** `spark_chanter`, `cadence_breaker`, `act_sexton`, `gale_deacon`
- **WEAKNESSES:** Drain Courage the Splitter before they lend; kill the ally; isolated 1v1
- **PLAYER_COUNTERPLAY:** Focus the buffer; don’t stand adjacent to the Spark
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-split-purse` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (post-debit leftover read)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `tithe_mason`

- **NAME:** Tithe Mason
- **ROLE:** hazard creator (walk-exit AP tax)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `bishop`. Distinct from `tax_scribe` / Glyph Tax (enter), `origin_mason` (cast-from), `lintel_mason` (HP% gate). At most one tile-AP specialist as PAIR. Do **not** name this `exit_mason` (proposed MULTI child door).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the player is already off the choke. Peer: paint only the cell they must **leave** to threaten. Above: refuse a cell they can ignore; last-writer skip if Glyph Tax / Cast Snare already owns the cell.
- **STAT_SCALING_RULE:** hp 0.90, sp 0.95, sr 1.00, res 0.90, init 1.00, chc 0.80. Identity is the **exit predicate**, not enter damage. If the paint deals Inferno, the kit leaked toward Cinder.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "paint_exit_ap_on_escape_cell"`. VETERAN: skip off-path cells. ELITE: Reel-partner — pull them onto it first. CHAMPION: forced-move honesty — push / pull / swap / blink / hinge **exits free**.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-exit-tithe`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **painted** cell, `spell-slow`
- **RARE_SPELL_POOL:** `spell-glyph-tax` only if `tax_scribe` is absent
- **ELITE_SPELL_POOL:** none — tax stays +1
- **SIGNATURE_MECHANICS:** One free floor cell, 2 turns. Voluntary **walk** that **leaves** the cell costs +1 AP. 0 AP → walk illegal. Paint is observation; later exits are not. Do **not** edit `mapGen.ts`. Challenge: extra AP through `recordChallengeApSpend` if the walker is the player.
- **VARIANT_PROGRESSION:** BASE frost+paint → VETERAN on-path-only → ELITE reel-then-tax → CHAMPION forced-free
- **RARITY_CURVE:** Standard. +ELITE on Post Tithe / Reel Tithe.
- **SYNERGIES:** `post_stinger`, `file_reeler`, `axis_locksmith`, `oncoming_knight`
- **WEAKNESSES:** Forced-move off; stay and cast; never enter; overwrite with Barrier
- **PLAYER_COUNTERPLAY:** Swap off; sit and Frost; don’t take the only aisle
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-exit-tithe` (MULTI: family observe+win **or** `exit_mason` first-win — first child wins)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (occupancy predicate on walk)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hinge_mason`

- **NAME:** Hinge Mason
- **ROLE:** displacement specialist / hazard creator (enter-swap with painter)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `pawn`. Distinct from `rift_hook` (cast Swap), `pawn_broker` (two hostiles), `twin_porter` (pads), `trip_mason` (enter-root). At most one swap engine as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if already adjacent (Swap would be cheaper and is not this identity). Peer: paint a fuse / pit / tithe approach. Above: refuse if the painter is already adjacent; skip if Grounded Lock / Claim Ward owns either cell.
- **STAT_SCALING_RULE:** hp 0.85, sp 0.95, sr 1.00, res 0.85, init 1.10, chc 0.80. Identity is the **later swap**, not a 3-AP Swap now. If they set `isSwap`, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "paint_enter_swap_with_self"`. VETERAN: skip already-adjacent. ELITE: paint the approach to Fuse / Pit / Glance front. CHAMPION: dead-painter honesty — enter is free, tile expires, no swap.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-hinge-tile`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **paint**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-swap` only if `rift_hook` is absent (teaching: now vs later)
- **ELITE_SPELL_POOL:** none — do **not** set `isSwap` / `isTrap`
- **SIGNATURE_MECHANICS:** Paint 2 turns. Next enter (walk **or** forced-move) swaps with the **painter** if both landings are legal. Nail Down the painter → swap fizzles, tile expires, enterer stays. Does not use `isTrap` (still a fake wall in live `spellEngine.ts`).
- **VARIANT_PROGRESSION:** BASE frost+paint → VETERAN skip-adjacent → ELITE paint-the-wick → CHAMPION dead-free
- **RARITY_CURVE:** Standard. +ELITE on Hinge Trap.
- **SYNERGIES:** `fuse_binder`, `pit_mason`, `cover_squire`, `veil_cantor`
- **WEAKNESSES:** Do not enter; kill the painter first; Nail Down the painter
- **PLAYER_COUNTERPLAY:** Path around the paint; burst the Mason; Hook them off before you step
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-hinge-tile` (ENEMY_DISCOVERY; paint observes, swap tick does not)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MED (enter trigger + `swapPositions` painter↔enterer)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spark_chanter`

- **NAME:** Spark Chanter
- **ROLE:** summoner (death grants owner +1 AP if current)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` or `king` **without** Rally heal. Distinct from `cinder_martyr` (self HP payload), `brood_chanter` (mobile pets), Bomber (Inferno on death). Replaces random overlay on this body. At most one Spark. Counts as one summon toward the cap.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if a fourth summon would exceed the cap. Peer: spawn only if the Chanter is current **and** can spend the +1 this turn (Strike / Frost ready). Above: refuse spawn if they will not be current when the whelp dies (would lose the grant on purpose — only CHAMPION may bait that as a fake).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 1.00, res 0.80, init 1.15, chc 0.85. Identity is the **current-actor gate**, not a second Inferno. Whelp: HP 1, lifespan 1, kit `{ physical_attack }`.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "spawn_spark_if_owner_current_next"`. VETERAN: skip cap. ELITE: detonate on **their** turn (lava / Sacrifice-the-pet / let it Strike and die). CHAMPION: never parse `"Spark"`; `summonAI: "spark"` enum only.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-spark-whelp`
- **ADVANCED_SPELL_POOL:** `physical_attack` (to spend the +1), `spell-mark`
- **RARE_SPELL_POOL:** `spell-split-purse` only if `purse_splitter` is absent
- **ELITE_SPELL_POOL:** the whelp itself is the elite unlock (acquisition ELITE)
- **SIGNATURE_MECHANICS:** On death from any cause, if the owner is the **current** turn actor, owner +1 current AP (capped at max). If not current, the +1 is **lost**. Summon cast observes; death grant does not. Player-side whelp death does not enter `applyRewards`.
- **VARIANT_PROGRESSION:** BASE frost+spawn → VETERAN respect-cap → ELITE detonate-on-own-turn → CHAMPION enum-honesty
- **RARITY_CURVE:** Standard. +ELITE on Spark Purse / Split Spark.
- **SYNERGIES:** `purse_splitter`, `cadence_breaker`, `act_sexton`, `ignite_alchemist`
- **WEAKNESSES:** Kill the whelp on **their** turn; Aim Veil so it cannot be the primary nuke (Strike still works); Null the summon
- **PLAYER_COUNTERPLAY:** Don’t pop it on the Chanter’s turn; wait; Sever Tether
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spark-whelp` (ELITE observe+win). Do not restamp `rich_vampire` / Blood Tithe doors.
- **REWARD_EXPECTATION:** Standard. Whelp death is not a reward event.
- **IMPLEMENTATION_COMPLEXITY:** MED (death hook + current-actor test)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cap_warder`

- **NAME:** Cap Warder
- **ROLE:** tank / protector (next hit capped at 12)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `king` **without** Rally heal. Distinct from `plate_warden` (absorb pool), `surplus_warder` (miss), `cover_squire` (redirect), Iron Skin (RES%). At most one soak engine as PAIR.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if the likely next hit is already ≤ 12. Peer: Turn Cap when a 18+ primary is the likely next hostile action. Above: refuse Cap into Poison (4-ticks do not consume) as the only plan.
- **STAT_SCALING_RULE:** hp 1.20, sp 0.75, sr 1.10, res 1.10, init 0.90, chc 0.80. Identity is the **clamp**, not more HP. If a 40 still lands, the consume path leaked.
- **AI_TIER_PROGRESSION:** Profile `charger` (hold; not healer). `aiHint: "self_if_next_hit_would_exceed_12"`. VETERAN: skip if likely hit ≤ 12. ELITE: do not Cover the same charge (Cover consume: you were not hit, cap stays — waste). CHAMPION: clamp the **already-computed** applied hit; do not edit `combatMath.ts`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-turn-cap`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `starter-shield`
- **RARE_SPELL_POOL:** `spell-ward-plate` only if `plate_warden` is absent
- **ELITE_SPELL_POOL:** none — 12 is fixed
- **SIGNATURE_MECHANICS:** One charge. Next damaging hit after RES/SR/modifiers is `min(applied, 12)`, then consume. Expires at end of next turn if unused. DoT ticks do **not** consume unless a single tick would exceed 12 (they won’t). Challenge records the **capped** amount.
- **VARIANT_PROGRESSION:** BASE strike+cap → VETERAN skip-small-hit → ELITE no-cover-same-charge → CHAMPION clamp-honesty
- **RARITY_CURVE:** Standard. +ELITE on Cap Veil.
- **SYNERGIES:** `veil_cantor`, `goad_herald`, `ash_absolver`, `pale_cantor`
- **WEAKNESSES:** Two small hits (Poison then Strike); Dispel the arm; wait the expiry
- **PLAYER_COUNTERPLAY:** Don’t dump Inferno into a fresh cap; chip; Cover is the other pack’s trick
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-turn-cap` (ENEMY_DISCOVERY; arming observes)
- **REWARD_EXPECTATION:** Standard. No extra Doka for “tankiness.”
- **IMPLEMENTATION_COMPLEXITY:** MED (consume on the existing hit pipeline, not inside `dealDamage`)
- **STATUS:** PROPOSED

---

## 5. Amendments to older waves (ids unchanged)

These are pointer notes, not new families and not new spell ids.

| Older family | Amendment |
| :--- | :--- |
| `iron_golem` / `stone_castellan` | May **demonstrate** Post Sting / Turn Cap at G≥6. CORE identity stays inertia / turret. Wave 7 families own the verbs. |
| `stride_hunter` | Moved-this-turn **target** damage. Not Post Sting (caster unmoved). |
| `far_stinger` / `glass_sniper` | Distance tape / min-range. Corner Bishop owns LoS-**blocked**. |
| `ledger_siphon` / `surplus_warder` / `act_teller` | Steal AP / evade leftover / queue tax. Purse Scribe owns leftover-AP **hit**. |
| `vault_chaplain` / `hook_chaplain` / `shove_chaplain` / `mist_walker` / `morrow_walker` | Ally blink 3–4 / pull / shove / self blink. Hinge Squire owns 90° around a pivot. |
| `void_anchoret` / `sink_chanter` / `pair_binder` | Any-dir Hook / tile gravity / pair midpoint. File Reeler owns shared-axis attract. |
| `span_warder` / `span_prelate` | Rigid pair / stationary 2-cell. Twin Span owns independent walk + adjacency death. |
| `smoke_thurifer` / `goad_herald` / `cover_squire` | LoS fog / forced target / redirect. Veil Cantor owns primary-target reject. |
| `cadence_thief` / `tempo_precentor` | Hostile CD −1 / next-turn AP. Cadence Breaker owns self reset to 0. Cadence Lender owns ally −1. Purse Splitter owns leftover AP share. |
| `tax_scribe` / `origin_mason` / `glyph_sower` / `lintel_mason` | Enter / origin / glyph / HP% gate. Tithe Mason owns **exit** AP. |
| `rift_hook` / `pawn_broker` / `twin_porter` / `trip_mason` | Cast Swap / two-hostile trade / pads / enter-root. Hinge Mason owns enter-swap with painter. |
| `cinder_martyr` / `brood_chanter` | Self payload / mobile pets. Spark Chanter owns death-AP if current. |
| `plate_warden` / `surplus_warder` / `cover_squire` | Absorb / miss / redirect. Cap Warder owns applied-hit cap 12. |
| `pin_cantor` | CHAMPION may arm `spell-about-face` (witness-only, never owned). CORE stays Facing Pin. Same law as Board Tilt on `slide_mason`. |
| `oath_censor` (proposed extra door, not a world family) | Owns `spell-oath-blade`. World packs do **not** take it as CORE. |

`spell-stolen-verse` / `spell-relay-dash` stay Wave 5 / SDE Wave 4 stamps. Do not clone.  
SDE Wave 6 unique CORE (`spell-dull-edge`, `spell-pet-sill`, `spell-late-purse`, `spell-pet-share`, `spell-short-leash`, …) stay G≥6 extras. Do not family them this pass.

---

## 6. Identity matrix (Wave 7 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| post_stinger | requireCasterUnmoved poke, damage, isMark, debuff(mp) | heal, isSummon, far-sting-as-identity, walk-after-shot |
| purse_scribe | leftover-AP poke, damage, debuff | heal, isSummon, AP-steal-as-identity, evade |
| corner_bishop | requireLosBlocked poke, damage, isMark | heal, isSummon, open-pit-as-block, `shadow_strike` |
| hinge_squire | hingeClockwise self teleport, defense, physical | heal, isSummon, self-blink-as-CORE, File Vault |
| file_reeler | fileAxisAttract, damage (frost), isMark | heal, isSummon, any-dir Hook as CORE, File Lance as identity |
| twin_span | isSummon (`twinspan`), defense | turret/wolf/archer/bomber/span/pylon, heal, nested Strike on posts |
| veil_cantor | aimVeilPrimaryOnly, damage, RES veil | heal, isSummon, smoke-as-identity, Goad as CORE |
| cadence_breaker | resetLastOwnedCooldownToZero, damage (inferno/frost) | heal, isSummon, hostile steal, reset-other |
| cadence_lender | lendAllyCooldownTurns, buff(mp/res) | healAmount, isSummon, isSacrifice, inferno |
| purse_splitter | splitLeftoverApToAlly, damage (frost), buff(mp) | healAmount, isSummon, hostile AP sip |
| tithe_mason | exitTitheAp tile, damage (frost), isMark | heal, isSummon, enter-tax-as-identity, Inferno-on-paint |
| hinge_mason | hingeTileSwapOnEnter, damage (frost), isMark | heal, isSummon, `isSwap` / `isTrap` as identity |
| spark_chanter | isSummon (`spark`), damage (frost/physical) | bomber Inferno-on-death, Blood Tithe, healAmount |
| cap_warder | turnCapMaxHit, defense, physical | isSummon, inferno, evade-as-identity, absorb-as-CORE |

Wave 1–6 matrices still apply to those ids.

---

## 7. Role coverage after Wave 7

| Archetype | Wave 1 owner | Wave 7 extra (new verb) |
| :--- | :--- | :--- |
| bruiser | crimson_spawn | — |
| sniper | glass_sniper | post_stinger (stand-and-shoot) |
| kiter | tide_shade | veil_cantor (primary reject) |
| assassin | shadow_lurker | purse_scribe (loaded-bar poke) |
| healer | pale_cantor | — |
| buffer | hex_chorister | cadence_breaker, cadence_lender, purse_splitter |
| debuffer | bone_scribe | purse_scribe (hit, not steal) |
| summoner | brood_chanter | twin_span, spark_chanter |
| controller | coil_arbiter | — (Oath Blade stays boss) |
| tank | iron_golem | cap_warder |
| protector | leash_warden | hinge_squire, veil_cantor, cap_warder |
| artillery | storm_caller | corner_bishop |
| kamikaze | cinder_martyr | spark_chanter (death-AP, not Inferno) |
| teleporter | wraith_bishop | hinge_squire |
| displacement | rift_hook | file_reeler, hinge_mason |
| hazard creator | ember_knight | tithe_mason, hinge_mason |
| status specialist | plague_rat | cadence_breaker |
| anti-summon | null_censor | — (Pet Sill / Short Leash stay SDE extras) |
| anti-ranged | void_mirror | corner_bishop, veil_cantor |
| anti-melee | leash_warden | tithe_mason, cap_warder |

Every requested archetype still has a Wave 1 owner. Wave 7 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation notes (for a later, explicit implementation PR)

1. **No production TypeScript / Motoko in this change.**  
2. **No new `mpCost > 0`.** Ley Toll / Undertow / Sanguine Toll remain the only paper spenders.  
3. **`walkMpSpentThisTurn`** is a combatant-turn integer, not a persist field. Post Sting fails closed until it exists. Forced-move does not increment it.  
4. **Battle facing writer** remains Wave 5’s prerequisite. About Face stays a `pin_cantor` CHAMPION witness, not a new family.  
5. **File Reel** is the first production caller of `applyAttract` along one axis. Do not invent a second attract helper.  
6. **Twin Span / Spark** use `summonAI` enums `"twinspan"` / `"spark"`. Twin Span counts as **two** toward the summon cap. Extend the admin `summonAI` allow-list in the **implementation** PR, not here. Never parse `"Twin Span"` / `"Spark Whelp"`.  
7. **Cadence Break / Lend** read cooldown maps by id. Do not write spell levels. Break is once/battle on a combatant flag (CD field stays 0).  
8. **Turn Cap** clamps the already-computed applied hit. Do not edit `combatMath.ts`.  
9. **Exit Tithe** is an occupancy predicate on **walk**. Hinge Tile is enter + `swapPositions`. Do not edit map generation. Do not use live `isTrap` (still `placeBarrier`).  
10. **Aim Veil** is a targeting reject, not RES. Attack Nearest must skip the veiled body.  
11. **Hinge Step** is occupancy teleport of **self** around an ally. Not RAF. Not File Vault.  
12. Family HP must **survive** `WX` 11970–11974. Fractional `res`/`sp` in `FAMILY_STAT_MULTS` must become ratios on `getEnemyBaseStats`, not 0.05–0.75 writes.  
13. `buildEnemyKit` must not receive the `levelZone` object. Re-key to relative band `R` / numeric zone.  
14. Forced `isBaseSpell` on all 32 starters (`WX` 2395–2408) stays a Discovery prerequisite. Do not append Wave 7 ids to `starterSpells`.  
15. Recap grant uses the reward funnel + `commitSpellDiscoveries` / `unlockOwnedSpell`, not `updateCharacter`.  
16. Extract helpers. Do not grow `WorldExploration.tsx` (19,213 lines).  
17. `usableByEnemy: false` stays false unless a sheet flips **that one id**. Rally / Mirror / Barrier / Timestep / sentinel / bomber / wisp stay false here.

---

## 9. Explicit non-goals this pass

- No production TypeScript / Motoko / Candid edits.  
- No re-proposal of the 22 Wave 1, 14 Wave 2, 14 Wave 3, 15 Wave 4, 15 Wave 5, or 13 Wave 6 ids as new families.  
- No boss redesign (Oath Blade / About Face / Mute Thread / Queue Cut / False Cut stay where #463 / #411 put them).  
- No player or enemy level cap. Do not treat `maxTier = floor(999 / ts)` as content endgame.  
- No RAF / mapGen / turn / damage-math edits.  
- No reward writers outside `applyRewards`.  
- No new persist stats (`wp` / `wr` / `scp` stay gone). No persist `walkMpSpentThisTurn`.  
- No `spell-blood-tithe` enemy family.  
- No fourth `mpCost > 0` walk snipe on CORE kits.  
- No fifth echo id.  
- No player-owned Hex of Silence.  
- No mid-RAF splice of the current actor.  
- No cooldown reset of **another** combatant’s bar to 0.  
- No three-cell occupy.  
- No forced-move that writes `currentView`.  
- No `buffStat: "evasion"` miss formula (`CharacterStats.evasion` stays unread).  
- No Hex Toll pool.  
- No SDE Wave 5 memory ids. No SDE Wave 6 unique CORE families this pass.  
- No restamp of `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `hinge_porter` / `exit_mason` / `oath_censor` / `about_regent`.  
- No `EnemyRegister.tsx` lore rows presented as live.  
- No `wave7:` colliding spell ids.

---

## 10. Proposal index

| ENEMY_ID | Role | CORE verb | Complexity |
| :--- | :--- | :--- | :--- |
| `post_stinger` | sniper / artillery | `spell-post-sting` | LOW–MED |
| `purse_scribe` | assassin / debuffer | `spell-purse-cut` | LOW |
| `corner_bishop` | artillery / anti-ranged | `spell-blind-corner` | LOW–MED |
| `hinge_squire` | teleporter / protector | `spell-hinge-step` | MED |
| `file_reeler` | displacement | `spell-file-reel` | LOW |
| `twin_span` | summoner | `spell-twin-span` | HIGH |
| `veil_cantor` | protector / kiter | `spell-aim-veil` | MED |
| `cadence_breaker` | buffer / status | `spell-cadence-break` | LOW |
| `cadence_lender` | buffer | `spell-cadence-lend` | LOW |
| `purse_splitter` | buffer | `spell-split-purse` | LOW–MED |
| `tithe_mason` | hazard creator | `spell-exit-tithe` | MED |
| `hinge_mason` | displacement / hazard | `spell-hinge-tile` | MED |
| `spark_chanter` | summoner | `spell-spark-whelp` | MED |
| `cap_warder` | tank / protector | `spell-turn-cap` | MED |

All STATUS: **PROPOSED**. Variant model on every sheet: BASE → VETERAN → ELITE → CHAMPION (+ 2% `wRare` skin). These are mechanical identities, not level brackets.

**Not familied (boss / held):** `spell-oath-blade`, `spell-about-face`. Mid-RAF splice, fourth `mpCost`, player-owned full silence, other-bar CD reset to 0, three-cell occupy, forced-move that writes `currentView`, fifth echo, SDE Wave 6 unique CORE — Wave 8+ if SPELL_PROPOSALS stamps them. Do not guess ids.

---

## 11. Source map (read-back)

| Topic | File | Lines |
| :--- | :--- | :--- |
| `EnemyFamily` union | `src/frontend/src/types/gameTypes.ts` | 12–20 |
| `areaShape` typed, unread | `src/frontend/src/types/gameTypes.ts` | 224 |
| `Enemy.currentView` | `src/frontend/src/types/gameTypes.ts` | 297 |
| Family overlay | `src/frontend/src/engine/spawnPolicy.ts` | 34–35, 49–128, 258–297 |
| Family apply at generate | `src/frontend/src/components/WorldExploration.tsx` | 5862–5866 |
| `levelZone` object | `src/frontend/src/components/WorldExploration.tsx` | 4683–4687 |
| Forced `isBaseSpell` | `src/frontend/src/components/WorldExploration.tsx` | 2395–2408 |
| Overworld facing write | `src/frontend/src/components/WorldExploration.tsx` | 6924–6938 |
| `buildEnemyKit(levelZone)` | `src/frontend/src/components/WorldExploration.tsx` | 11920 |
| Summoner overlay | `src/frontend/src/components/WorldExploration.tsx` | 11932–11942 |
| Family HP wipe | `src/frontend/src/components/WorldExploration.tsx` | 11970–11974 |
| Ember / tide melee hooks | `src/frontend/src/components/WorldExploration.tsx` | 16789–16818 |
| AP-only `executeCastAttempt` | `src/frontend/src/components/WorldExploration.tsx` | 17096–17207 |
| WX size | `src/frontend/src/components/WorldExploration.tsx` | 19,213 lines |
| Void reflect | `src/frontend/src/engine/castHelpers.ts` | 336–337 |
| `pickEnemyLevelFromTiers` / `computeAITier` | `src/frontend/src/engine/combatMath.ts` | 36–107 |
| `getEnemyBaseStats` integers | `src/frontend/src/engine/progression.ts` | 151–186 |
| Kits / `buildEnemyKit` | `src/frontend/src/engine/enemyAI.ts` | 163–199 |
| Summon name fallback | `src/frontend/src/engine/enemyAI.ts` | 202–225 |
| Healer-first infer | `src/frontend/src/engine/enemyAI.ts` | 447–477 |
| Ally targeting | `src/frontend/src/engine/targeting.ts` | 528–545 |
| Area = Chebyshev, no `areaShape` | `src/frontend/src/engine/targeting.ts` | 690–727 |
| Push / attract unused by casts | `src/frontend/src/engine/occupancy.ts` | 482, 537 |
| Summon default facing | `src/frontend/src/engine/summonSpawn.ts` | 177–178 |
| Register lore extras | `src/frontend/src/components/EnemyRegister.tsx` | 71–88 |
| Summoner chance / cap | `src/frontend/src/data/gameConstants.ts` | 298–300 |
| Wave 6 spells | PR #463 `SPELL_PROPOSALS_2026-09-23.md` | — |
| Wave 6 families | PR #452 `ENEMY_ELITE_EVOLUTION_2026-09-23.md` | — |
| Wave 5 families | PR #405 `ENEMY_ELITE_EVOLUTION_2026-09-22.md` | — |
| Wave 4 families | PR #349 `ENEMY_ELITE_EVOLUTION_2026-09-21.md` | — |
| SDE Wave 6 stamps | PR #480 `SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md` | — |

**Document status:** PROPOSED. Safe to review. Not a license to land combat code in the same change as this spec.
