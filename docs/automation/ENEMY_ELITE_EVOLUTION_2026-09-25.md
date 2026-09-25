# Enemy and Elite Evolution Design — Wave 8

**Author:** Enemy and Elite Evolution Designer (cron `0 */24 * * *`)  
**Date:** 2026-09-25  
**Status:** PROPOSED — design only. No production code in this change.  
**Scope:** Eighth daily pass. New world-pack families that consume **SPELL_PROPOSALS Wave 7 verbs** (`SPELL_PROPOSALS_2026-09-24.md`, open PR #525): wall-hug poke, shared-axis XOR poke, caster-walked poke, shove that writes facing, knight-offset self teleport, 90° pivot of the target around the caster, three-cell occupy, hostile highest-CD → 0, recast lock, next DoT tick skip, adjacent-ally 50/50 share, current-turn +1 walk MP, delayed pit convert, walk-exit MP refund. Plus three **SDE Wave 6 unique CORE** verbs Wave 7 held (`spell-dull-edge`, `spell-pet-sill`, `spell-short-leash`) because they still have no CORE owner. Bosses stay on the existing catalog. Must Pace / Court Shove stay **boss / closed-class** — not world-pack CORE.

**Does not replace:**
- [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) (Wave 1, 22 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) (Wave 2, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-02.md`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) (Wave 3, 14 family sheets)
- [`ENEMY_ELITE_EVOLUTION_2026-09-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-e9f5/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md) (Wave 4, 15 family sheets — open PR #349; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-3823/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md) (Wave 5, 15 family sheets — open PR #405; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-ef30/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md) (Wave 6, 13 family sheets — open PR #452; not on `main` yet)
- [`ENEMY_ELITE_EVOLUTION_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-enemy-evolution-a2f2/docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md) (Wave 7, 14 family sheets — open PR #535; not on `main` yet)

Those ids stay **PROPOSED**. This run does **not** re-list them as new content.

Stralt has **no character level cap**. Nothing here is a final enemy level, a final player level, or a last variant. Relevance is player-relative spawn + role + AI + spell-pool growth + variant mechanics.

---

## 0. What changed since Wave 7

Re-read against `HEAD` `0f5363f` (Merge PR #332). Wave 7 closed as docs in the 2026-09-24 pass (PR #535). SPELL_PROPOSALS Wave 7 (PR #525) stamped three holes Wave 6 **held** (three-cell occupy; hostile CD → 0; forced-move that writes `currentView`) plus thirteen siblings. SDE Wave 7 (PR #533) then stamped a **new** unique catalog (`spell-even-stride` … `spell-file-fold`). Stamping a verb onto `iron_golem` / `null_censor` is not a CORE identity. If a family only gained more HP/damage to “use” those ids, it would be the failure mode this brief forbids.

`WorldExploration.tsx` is still **19,213** lines (`wc -l`). Family overlay remains in `engine/spawnPolicy.ts`. Line numbers below are this checkout.

| Wave 7 claim | 2026-09-25 live | Verdict |
| :--- | :--- | :--- |
| 7 `EnemyFamily` ids + `default` | `gameTypes.ts` 12–20 unchanged | No Wave 1–7 sheet shipped |
| 30% family roll is stat-only | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 0.3; `maybeApplyEnemyFamilyVariant` 279–287 | Still true |
| Family `res`/`sp` written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–128 (`iron_golem.res = 0.75`, `plague_rat.res = 0.05`) | Still broken vs `getEnemyBaseStats` (`progression.ts` 180–186) |
| Battle start drops family HP | `WX` 11970–11974 `calcEnemyMaxHp(e.level)` | Still true |
| Kit zone is NaN | `WX` 11920 `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` | Still true. `levelZone` is `{ name, minLevel, maxLevel }` at WX 4683–4687. `enemyAI.ts` 194–199 `Math.floor(levelZone)` → every kit stays zone 0 |
| Live combat hooks | ember melee-burn `WX` 16789–16804; tide melee-slow `WX` 16805–16818; void 25% reflect `castHelpers.ts` 336–337 | Still the only three |
| Register extras | Crimson Spawn / Shadow Lurker / Storm Caller still lore-only (`EnemyRegister.tsx` 71–88) | Not in `EnemyFamily` |
| `pickEnemyLevelFromTiers` | `combatMath.ts` 54–107; `maxTier = floor(999 / ts)` at 58 | Do not retune percents; 999 remains a spawn-math rail, not a content cap |
| `computeAITier` | `combatMath.ts` 36–52; bands then 30% 1–10 noise | Variant floors still sit on top |
| Summoner chance | `WX` 11932–11942 `0.12 + playerLevel * 0.02` (`gameConstants.ts` 298–299) | Still saturates; Wave 1 `brood_chanter` still the family fix |
| `ENEMY_SUMMON_CAP` | `gameConstants.ts` 300 = **2** | Triple Span counts as **3**. Do not spawn `triple_span` until cap remaining ≥ 3 |
| `inferArchetype` healer-first | `enemyAI.ts` 447–477; `family.includes("berserk")` heuristic | Still metadata-hostile |
| `inferSummonArchetype` | `enemyAI.ts` 202–225: hunter / guardian / archer / bomber / healer only | No `font` / `pylon` / `turret` / `bait` / `decoy` / `span` / `twinspan` / `spark` / **`triplespan`** |
| `Enemy.currentView` | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938. **Unread in combat.** | Wave 6–7 facing families still fail closed until a battle-walk writer exists. **Shove Face writes facing from this push only** |
| `executeCastAttempt` | `WX` 17096–17207: AP gate + debit only | Ley Toll / Undertow / Sanguine Toll remain illegal without MP debit. Wave 8 CORE rows stay `mpCost: 0` |
| `applyPushback` / `applyAttract` | `occupancy.ts` 482 / 537; tests exist; **no spell caller** | Shove Face is the first **cast** caller that also writes `currentView` |
| `areaShape` | Typed (`gameTypes.ts` 224); **unread** in `targeting.ts` (area = Chebyshev `areaRadius`, 690–727) | Unused this pass (Gale / Fan still own the cone hole) |
| Wall-hug / axis XOR / walked poke / knight dest / pivot / triple / hostile CD0 / recast lock / tick skip / flank share / spare MP / delayed pit / exit refund | Still absent in live catalog | Wave 8 primary opportunity |

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

**Wave 7 ids — do not re-propose:**  
`post_stinger`, `purse_scribe`, `corner_bishop`, `hinge_squire`, `file_reeler`, `twin_span`, `veil_cantor`, `cadence_breaker`, `cadence_lender`, `purse_splitter`, `tithe_mason`, `hinge_mason`, `spark_chanter`, `cap_warder`.

Same-day SPELL_PROPOSALS Wave 8 may open as a sibling cron. This Wave 8 family pass still consumes **#525** verbs only. **Wave 9** consumes any 2026-09-25 catalog. This run does not mint colliding `wave8:` spell ids.

SDE Wave 7 unique CORE (`spell-even-stride`, `spell-strike-hold`, `spell-ground-oath`, `spell-walk-toll`, `spell-purse-lock`, `spell-ally-reel`, `spell-echo-paint`, `spell-blink-seal`, `spell-gift-sill`, `spell-split-fang`, `spell-wall-bite`, `spell-cast-mark`, `spell-still-leash`, `spell-pet-verse`, `spell-ghost-step`, `spell-thin-ward`, `spell-clean-blood`, `spell-pack-still`, `spell-file-fold`) stay **G≥6 extras** on older families this pass. Dedicated families for those verbs wait for Wave 9 if they still have no CORE owner.

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

**Stationary-post / multi-body cap (extend Wave 7):** one pylon **or** turret **or** mercy font **or** bait pylon **or** span pylon **or** Twin Span pair **or** Triple Span chain in the same pack, not two. Twin Span counts as **two**. Triple Span counts as **three**. Do **not** also roll wolf/archer overlay onto a Twin Span, Spark, or Triple Span body. Do **not** also roll `summonAI: "decoy"` onto the same body.

**Two-/three-cell system cap (extend Wave 7):** at most **one** multi-cell system per pack — a living `span_warder` under Span Guard, a Span Pylon, a Twin Span pair, **or** a Triple Span chain, never two of those. Triple Span is **not** Twin Span: three 1-HP posts on a cardinal 3-line; posts walk independently but dests that break 4-adjacency of the living chain are illegal. If one dies, the remaining two use Twin Span’s adjacent-pair rule.

**Summon-cap prerequisite (new):** live `ENEMY_SUMMON_CAP` is 2 (`gameConstants.ts` 300). Triple Span is illegal until remaining cap ≥ 3. Do not spawn `triple_span` on a board that already has a Twin Span, a Spark overlay, or a wolf/archer overlay. Raising the cap is **not** this design pass; skip the family until that number exists.

**Walk-spend prerequisite (unchanged from Wave 7):** Boot Sting / Must Pace **fail closed** until battle walks write a first-class `walkMpSpentThisTurn` (or equivalent) on the turn actor. Forced-move does **not** increment that field. Knight Slip is a teleport — it does **not** increment walk-spend. Do not invent a persist stat. Do not read pixels.

**Facing prerequisite (split):** About Face / Oncoming / Facing Pin / Glance Cut still fail closed until battle walks write `currentView`. **Shove Face writes facing from this push only** (mapping WX 6928–6931). Court Shove is kit-only witness. This pass does **not** add a Must Pace family.

**Discovery doors:** family observe must not restamp claimed feats/challenges. Must Pace stays `pace_prelate` first-win. Court Shove stays `court_usher` kit-only / `face_shover` CHAMPION witness. Knight Slip MULTI child `slip_castellan` — first child wins vs family observe. Pit Wick MULTI child `wick_mason` — first child wins vs `wick_painter` observe. Triple Span MULTI child `span_triune` — first child wins. Do **not** restamp `first_blood` / `doka_hoarder` / `rich_vampire` / `betrayal_witness` / `lord_of_static` / `morrow_herald` / `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` / `ram_castellan` / `fosse_warden` / `stride_censor` / `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` / `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` / `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` / `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist`.

---

## 2. Why Wave 8 exists (gaps Waves 1–7 did not fill)

Wave 1 covered every requested **role word**. Wave 2 covered unused **engine verbs**. Wave 3 covered SPELL_PROPOSALS Wave 2. Wave 4 covered SPELL_PROPOSALS Wave 3. Wave 5 covered SPELL_PROPOSALS Wave 4 + three SDE Wave 4 unique CORE verbs. Wave 6 covered SPELL_PROPOSALS Wave 5. Wave 7 covered SPELL_PROPOSALS Wave 6.

SPELL_PROPOSALS Wave 7 (#525) then stamped the holes Wave 6 **held**. A G≥6 extra on `iron_golem` is not a CORE sentence. Dedicated families own the verb.

SDE Wave 6 unique CORE still had no CORE owner after Wave 7 (Wave 7 held them as G≥6 stamps). Three of those verbs fill the remaining **anti-summon / anti-melee** hole Wave 7 listed as empty. `spell-late-purse` and `spell-pet-share` stay G≥6 extras: leftover-AP **hit** is `purse_scribe`; leftover-AP **burn** is not a second CORE gun this pass. Adjacent-ally 50/50 is `share_warden`; summon-only 30% share stays on `brood_chanter` ELITE.

| Unused Wave 7 spell verb | Nearest older family | Why that is not enough |
| :--- | :--- | :--- |
| `spell-wall-sting` (bonus iff **target** Chebyshev-1 from a **barrier**) | `corner_bishop` (LoS **blocked**); `post_stinger` (caster unmoved); Wick Bite (painted hazard **now**); Pit Sight (pit on the ray) | World walls / smoke / span are **not** `barrierTiles`. The gun wants a **planted wall**. |
| `spell-file-brand` (+10 iff share rank **XOR** file) | `file_reeler` (attract 1 along the axis); File Lance (ray poke); Rank Lock (walk constraint); Axis Veil (cannot be primary) | Diagonal is 10 only. Same cell is illegal. This is a **rider**, not a ray. |
| `spell-boot-sting` (bonus iff caster spent ≥ 1 walk MP) | `post_stinger` (unmoved inverse); `stride_hunter` (**target** moved); Spent Stride (taxes **their** walk); Planted Stance (self buff) | The gun wants to **step**. Standing drops the +10. Knight Slip does **not** pay. |
| `spell-shove-face` (push 1 **and** write `currentView`) | `bash_bruiser` / `shove_chaplain` (shove, no facing); `recoil_squire` (self push); About Face (invert, no move); Facing Pin (lock one view) | The write is the identity. Collision = 0 facing rewrite. |
| `spell-knight-slip` ((2,1) self teleport, dest must be free, walls block dest) | Vault (once/battle, **ignores** walls); `mist_walker` / `morrow_walker` / `blink_cutter` (Chebyshev blink); Relay Dash (walk ≤ 2); Knight Pierce (damage rider) | Offset is knight-shaped. Dest-is-wall fails. Walk MP stays 0. |
| `spell-pivot-foe` (rotate **target** 90° around caster) | `hinge_squire` (caster rotates around an **ally**); `pawn_broker` (two hostiles swap); Twin Guard (two-ally swap) | Caster stays. Clockwise dest must be free. |
| `spell-triple-span` (three 1-HP posts, 4-adj chain) | `twin_span` (two, independent walk); `span_warder` (rigid pair); `span_prelate` (stationary 2-cell); Triune Gate (three **pads**) | Counts as **three**. Empty kit. Cap remaining < 3 → skip. |
| `spell-cadence-crack` (hostile highest remaining CD → **0**, once/battle) | `cadence_breaker` (**self** last-id → 0); `cadence_thief` (steal 1); `cadence_lender` (ally −1); Timestep (AP/MP) | Reset is **their** highest remaining. Not a steal and not self. |
| `spell-once-verse` (cannot resolve the same id twice in a row) | Mute Thread (next **any** spell); After Verse family (**replays**); Oath Blade (Strike-only) | Last **resolved** id. Strike is an id. Missing last-id fail-closes (no fizzle). |
| `spell-tick-hood` (next **DoT tick** on self deals 0) | `sidestep_warder` (miss a **hit**); Fog Hood (LoS); Cursed Wound (healRecv); Cleanse (strips) | Apply still lands. Lava/spikes are **not** DoT ticks. |
| `spell-flank-share` (next hit 50/50 with adjacent **ally**) | Pet Share (summon-only 30%); `pain_suture` (% tether); `cover_squire` (redirect whole hit); Turn Cap (cap 12) | Missing ally at **hit** time: full hit, charge gone. |
| `spell-spare-pace` (+1 **current** walk MP now) | Haste (+2 MP / 1 turn buff); Second Wind (Discovery refill); Split Pace (walked ≥ 2 range rider); `tempo_precentor` (next-turn AP) | 2 AP for 1 extra step **this turn**. Not a duration. |
| `spell-pit-wick` (floor paint becomes a pit after 1 turn) | `pit_mason` (immediate Open Pit); `fuse_binder` (delayed **damage**, still walkable); Wick Bite (bonus on painted hazard **now**) | Wick is walkable. Convert is occupancy. Extra door is `wick_mason` — family is **`wick_painter`**. |
| `spell-exit-boon` (leaving the cell refunds 1 walk MP) | `tithe_mason` (leave costs **+1 AP**); Glyph Tax (enter AP); Spare Pace (caster-scoped) | Walk leave only. Teleport / swap / shove do **not** refund. Last writer vs Tithe. |
| `spell-dull-edge` (next Strike deals **0**) | Oath Blade (other ids fizzle, Strike **hurts**); Mute Thread (next spell fizzles); `null_censor` G≥6 stamp | Zeroing Strike is the CORE. Other ids resolve. |
| `spell-pet-sill` (summons cannot **enter** the cell) | `pit_mason` (all walks); Claim Ward (swap/blink for everyone); Kennel Lock (leash **allied**); `glyph_sower` G≥6 stamp | Player body walks freely. Summon walk / summon landing fizzle. |
| `spell-short-leash` (hostile summon remaining lifespan → min(remaining, 1)) | Sever Tether (**kills**); Keep Kennel (**adds** allied); Convert Whelp (steal at 25%); `null_censor` ELITE stamp | Legal only if `isSummon`. 0 damage. Not a kill. |

**Do not family (closed / boss):** `spell-must-pace` (`pace_prelate` first-win; world hex may demonstrate at zone ≥ 2 but CORE stays the extra door), `spell-court-shove` (`NOT_PLAYER_LEARNABLE`; `court_usher` kit / `face_shover` CHAMPION witness — same law as About Face on `pin_cantor`). Mute Thread / Queue Cut / False Cut / Cut In / After Verse / Sanguine Toll / Eclipse Fold / Oath Blade / About Face stay where Waves 5–7 put them.

`spell-blood-tithe` stays **player-first** (Wave 3 law). Do not clone a tithe family.  
Do **not** add a fourth `mpCost > 0` walk snipe. Wave 8 CORE rows are `mpCost: 0`.  
Do **not** family Hex Toll (Quiet Hex near-clone; SDE forbids pooling).  
Do **not** family a sixth echo.  
Do **not** family player-owned Hex of Silence.  
Do **not** family mid-RAF splice of the current actor.  
Do **not** family cooldown reset of **all** of another combatant’s CDs (Crack is highest-one only).  
Do **not** family a four-cell occupy.  
Do **not** family heal-if-caster-moved.  
Do **not** family 90° hinge of **two hostiles as a pair**.  
Do **not** family a forced-move that also writes `currentView` **except** Shove Face (Court Shove is witness-only).  
Do **not** mint SDE Wave 5 memory ids (`spell-gaze-sill` … `spell-void-span`).  
Do **not** mint SDE Wave 7 unique CORE as this pass’s CORE (`spell-even-stride` …).  
Do **not** mint `wave8:` colliding spell ids.  
Do **not** name the Pit Wick family `wick_mason` (that id is the MULTI extra door).

---

## 3. Encounter synergy packs (Waves 1–8)

Weights rise with `R` the same way Elite does. Cap one CHAMPION. Cap one dedicated summoner plus the existing overlay. Cap one multi-cell system. Triple Span fills the summon cap (needs remaining ≥ 3).

| Pack | Members | Decision (not “more HP”) |
| :--- | :--- | :--- |
| Wall File | `wall_stinger` + `pylon_prelate` + `file_brander` | Plant the wall, cash the hug, then brand the file |
| Boot Spare | `boot_stinger` + `spare_pacer` + `gait_muter` | Buy the step, sting, mute their walk back |
| Face Glance | `face_shover` + `glance_ward` + `oncoming_knight` | Write facing, then Glance / Oncoming the new front |
| Slip Pit | `slip_squire` + `wick_painter` + `file_brander` | Slip off the file; the origin becomes a pit next turn |
| Pivot Wick | `pivot_ward` + `wick_painter` + `axis_locksmith` | Clockwise onto the wick; they cannot walk off the file |
| Triple Plug | `triple_span` + `lintel_mason` + `glass_sniper` | Three-cell plug + healthy bodies cannot bypass |
| Crack Verse | `cadence_cracker` + `once_cantor` + `ignite_alchemist` | Restore Inferno, then ban recasting it |
| Hood Choir | `hood_lurker` + `ignite_alchemist` + `ash_absolver` | Skip the fat tick, then strip leftover stacks |
| Share Goad | `share_warden` + `goad_herald` + `cap_warder` | Forced swing splits, then the ally’s half caps at 12 |
| Boon Boot | `boon_mason` + `boot_stinger` + `spare_pacer` | Refund the leave, sting after the paid step |
| Dull Sill | `dull_censor` + `pet_siller` + `leash_cutter` | Strike deals 0, pets cannot park, remaining life → 1 |
| Wick Face | `wick_painter` + `face_shover` + `fuse_binder` | Shove onto the wick / fuse before convert |
| Brand Reel | `file_brander` + `file_reeler` + `wall_stinger` | Pull onto the file, brand, hug-sting the wall |
| Spare Slip | `spare_pacer` + `slip_squire` + `post_stinger` | Extra MP to stand, or slip to a post (Slip does **not** pay Boot) |
| Sill Brood | `pet_siller` + `brood_chanter` + `spark_chanter` | Hostile pets cannot enter; Spark still wants to die on **their** turn |

Keep Wave 1 packs (Ash Court, Quiet Choir, Paper Plague, Broken Glass, Rift Knot, Null Brood, Tide Mirror), Wave 2 packs (File & Wire, Bell Court, Gravity Choir, Plate Choir, Shard Battery, Mist Hunt, Ash Slam), Wave 3 packs (Wick Court, Ice File, Smoke Hunt, Plus Battery, Tempo Choir, Absolve Race, Rescue Line, Bastion Gate, Twin Plate, Finish Line, Fog Fuse), Wave 4 packs (Ley Court, Fan File, Trade Trap, Recoil Hunt, Gate Court, Font Gate, Lens Battery, Hex Ledger, Pit File, Slide Slam, Evade Goad, Push School, Lens Duel, Broker Pit), Wave 5 packs (Gale Pit, Twin Kennel, Pincer Gate, Oblique File, Pair Court, Ledger Choir, Shove School, Origin Tax, Bait Gate, Morrow Snare, Surplus Goad, Sated Plate, Verse Pulpit, Misstep Pit, Bitter Font), Wave 6 packs (Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute), and Wave 7 packs (Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark).

Do **not** pack as PAIR (COURT later is fine):

- `wall_stinger` + `corner_bishop` / `post_stinger` / `far_stinger` / `glass_sniper` without a barrier / lock third
- `file_brander` + `file_reeler` / `rank_lancer` / `axis_locksmith` as PAIR (rider vs attract vs ray vs walk-lock)
- `boot_stinger` + `post_stinger` (inverse walk guns)
- `face_shover` + `bash_bruiser` / `shove_chaplain` / `recoil_squire` as PAIR (shove vs shove+face vs self-push)
- `slip_squire` + `mist_walker` / `morrow_walker` / `blink_cutter` / `vault_chaplain` / `hinge_squire`
- `pivot_ward` + `hinge_squire` / `pawn_broker` / `hook_chaplain`
- `triple_span` + `twin_span` / `span_warder` / `span_prelate` / `pylon_prelate` / `bait_prelate` / `font_cantor` / `stone_castellan` / `spark_chanter`
- `cadence_cracker` + `cadence_breaker` / `cadence_thief` / `cadence_lender`
- `once_cantor` + `hex_chorister` / `verse_scribe` as PAIR (recast lock vs replay)
- `hood_lurker` + `sidestep_warder` / `cap_warder` as PAIR (tick skip vs hit miss vs hit cap)
- `share_warden` + `cover_squire` / `pain_suture` / `twin_tether` / `leash_warden`
- `spare_pacer` + `tempo_precentor` as PAIR (current MP vs next-turn AP)
- `wick_painter` + `pit_mason` / `fuse_binder` / `hinge_mason` as PAIR (delayed pit vs immediate pit vs delayed damage vs enter-swap)
- `boon_mason` + `tithe_mason` / `tax_scribe` / `origin_mason` / `glyph_sower`
- `dull_censor` + `null_censor` / `oath_censor` as PAIR (Strike 0 vs other-id fizzle vs brand)
- `pet_siller` + `pit_mason` / `glyph_sower` as PAIR (summon-only sill vs all-walk pit vs glyph tax)
- `leash_cutter` + `null_censor` / `leash_warden` as PAIR (cut hostile life vs lockout vs allied leash)

Do not spawn Triple Plug on a 1-tile closet (needs a cardinal 3-line plus adjacent free cells). Do not spawn Face Glance / Court Shove witness until Shove Face’s facing write exists (battle-walk writer still required for Oncoming / Glance on **walk**). Wick paints and Triple Span posts are battle-time — `finalizePlayableLayout` still owns generated maps.

---

## 4. Family sheets — Wave 8

All sheets: **STATUS: PROPOSED**.  
Spell ids are from [`SPELL_PROPOSALS_2026-09-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-spell-mechanics-1feb/docs/automation/SPELL_PROPOSALS_2026-09-24.md) (PR #525) unless marked SDE Wave 6 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/spell-discovery-and-evolution-df4f/docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md), PR #480).

---

### ENEMY_ID: `wall_stinger`

- **NAME:** Wall Stinger
- **ROLE:** sniper / anti-melee (target-hugs-barrier poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `pawn` **without** heal. Distinct from `corner_bishop` (LoS blocked), `post_stinger` (caster unmoved), `far_stinger` (distance tape), `glass_sniper` (min-range). At most one hug-gun per pack as PAIR vs Corner / Post (COURT with Pylon is the lesson).
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the target is Chebyshev-2+ from every barrier. Peer: Wall Sting only if a `barrierTiles` cell is Chebyshev-1 from them. Above: refuse the id on an open hug (would be a 12 pretending to be 22); do not treat world walls, smoke, pits, or span bodies as barriers.
- **STAT_SCALING_RULE:** hp 0.90, sp 1.15, sr 0.90, res 0.95, init 0.85, chc 1.05. Identity is the **hug-the-wall tell**, not a 22-every-turn Frost. If it tops the meter in an empty field, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_target_adj_barrier"`. VETERAN: skip if no barrier hug. ELITE: wait one turn if a Pylon / Bastion / Barrier ally will plant. CHAMPION: never treat `tiles[y][x] === false` as a barrier.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-wall-sting`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **barrier cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-barrier` only if a dedicated mason is **absent** and `usableByEnemy` is flipped for **that one id**
- **ELITE_SPELL_POOL:** none new — hug honesty is the elite. Do **not** unlock Blind Corner as identity.
- **SIGNATURE_MECHANICS:** 12, +10 iff target Chebyshev-1 from `barrierTiles`. Missing set fail closed (12 only). Pits / smoke / rime / fuse paints are **not** barriers.
- **VARIANT_PROGRESSION:** BASE frost-or-sting → VETERAN skip-if-open → ELITE wait-for-plant → CHAMPION no-world-wall-lie
- **RARITY_CURVE:** Standard Wave 1 §2.4. +ELITE on Wall File.
- **SYNERGIES:** `pylon_prelate`, `file_brander`, `axis_locksmith`, `stone_castellan`
- **WEAKNESSES:** Step Chebyshev-2 from every wall; Dispel / wait the barrier out; Sidestep the 12
- **PLAYER_COUNTERPLAY:** Don’t hug their pylon; kill the wall first; stay at range 4
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-wall-sting` (ENEMY_DISCOVERY). Do not restamp a feat.
- **REWARD_EXPECTATION:** Standard Wave 1 §2.6
- **IMPLEMENTATION_COMPLEXITY:** LOW (one Chebyshev scan of `barrierTiles`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `file_brander`

- **NAME:** File Brander
- **ROLE:** artillery (shared-axis XOR poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `bishop` **without** heal. Distinct from `file_reeler` (attract), File Lance (ray), `rank_lancer` (walk lock), Axis Veil (cannot be primary). At most one axis-rider as PAIR vs Reel / Lance.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if off-axis. Peer: File Brand only if they share **exactly one** axis. Above: refuse Brand on a diagonal (would be a 10 pretending to be 20).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 0.90, res 0.80, init 1.10, chc 1.05. Identity is the **on-file tell**. If it tops the meter from a knight-offset, the kit leaked toward Frost.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "bonus_if_shared_rank_xor_file"`. VETERAN: skip diagonal. ELITE: Reel-partner — pull onto the file, then brand. CHAMPION: `linear: false` honesty — this is not `targetType: "line"`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-file-brand`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **shared-axis cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-rank-lock` only if `axis_locksmith` is **absent**
- **ELITE_SPELL_POOL:** none — on-axis honesty is the elite. Do **not** unlock File Lance as identity.
- **SIGNATURE_MECHANICS:** 10, +10 iff share rank XOR file. Same cell illegal. Missing key fail closed (10 only).
- **VARIANT_PROGRESSION:** BASE frost-or-brand → VETERAN skip-diagonal → ELITE pull-then-brand → CHAMPION not-a-ray
- **RARITY_CURVE:** Standard. +ELITE on Wall File / Brand Reel.
- **SYNERGIES:** `file_reeler`, `wall_stinger`, `axis_locksmith`, `pivot_ward`
- **WEAKNESSES:** Step onto a diagonal; Smoke the file; hug the caster (Chebyshev 0 never fires)
- **PLAYER_COUNTERPLAY:** Leave the rank **or** the file, not both; do not stand in the aisle they just marked
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-file-brand` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `boot_stinger`

- **NAME:** Boot Stinger
- **ROLE:** bruiser / kiter (caster-walked poke)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `pawn` **without** heal. Distinct from `post_stinger` (unmoved inverse), `stride_hunter` (target moved), `far_stinger` (distance). At most one walk-gun as PAIR vs Post.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if they have not walked. Peer: Boot Sting only if `walkMpSpentThisTurn ≥ 1`. Above: refuse the id after a stand (would be a 12 pretending to be 22). Knight Slip does **not** count as walk.
- **STAT_SCALING_RULE:** hp 1.05, sp 1.00, sr 0.95, res 0.90, init 1.15, chc 1.00. Identity is the **step-then-sting tell**. If it tops the meter from a planted post, the kit leaked toward Post Stinger.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "bonus_if_caster_walked"`. VETERAN: skip if walk-spend is 0. ELITE: Spare-partner — buy the step, then sting. CHAMPION: never count Slip / shove / Swap as walk MP.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-boot-sting`
- **ADVANCED_SPELL_POOL:** `starter-frost` if range 3 is needed after the step, `spell-slow`
- **RARE_SPELL_POOL:** `spell-spare-pace` only if `spare_pacer` is **absent**
- **ELITE_SPELL_POOL:** none — walked honesty is the elite. Do **not** unlock Post Sting as identity.
- **SIGNATURE_MECHANICS:** 12, +10 iff walk-MP spent this turn ≥ 1. Missing field fail closed (12 only). Forced-move does not count.
- **VARIANT_PROGRESSION:** BASE strike-or-sting → VETERAN skip-if-stood → ELITE buy-then-sting → CHAMPION no-teleport-lie
- **RARITY_CURVE:** Standard. +ELITE on Boot Spare / Boon Boot.
- **SYNERGIES:** `spare_pacer`, `boon_mason`, `gait_muter`, `face_shover`
- **WEAKNESSES:** Root / Nail Down so they cannot take the bonus; stay at range 4; Post Sting is the inverse they do **not** own
- **PLAYER_COUNTERPLAY:** Force a stand; don’t stand in range 3 after they stepped; Hook them off the aisle
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-boot-sting` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`walkMpSpentThisTurn` on the turn actor — same integer Post Sting needs)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `face_shover`

- **NAME:** Face Shover
- **ROLE:** displacement specialist (push + facing write)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from `bash_bruiser` / `shove_chaplain` (shove, no facing), `recoil_squire` (self push), `pin_cantor` (lock view), About Face (invert, no move). At most one facing-writer as PAIR vs Bash.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if the dest is blocked. Peer: Shove Face only if `applyPushback` would change cell. Above: refuse the id on a 0-slide (would rewrite facing from nothing).
- **STAT_SCALING_RULE:** hp 1.10, sp 0.90, sr 1.00, res 0.95, init 1.20, chc 0.95. Identity is the **new-front tell**, not a bigger Bash. If they deal damage on the shove, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "push_and_write_view_if_adj"`. VETERAN: skip if dest is a pit / lava **or** push would be 0. ELITE: Glance-partner — write facing, then the ally Glances. CHAMPION: may arm `spell-court-shove` (witness-only, never owned). CORE stays Shove Face.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-shove-face`
- **ADVANCED_SPELL_POOL:** `starter-frost` only as a backup if shove dest is blocked
- **RARE_SPELL_POOL:** none — do not steal Oncoming as identity
- **ELITE_SPELL_POOL:** `spell-court-shove` at CHAMPION **kit only** (`NOT_PLAYER_LEARNABLE`)
- **SIGNATURE_MECHANICS:** Push 1 via existing `applyPushback`. If they changed cell, write `currentView` from that step (WX 6928–6931 mapping). No damage. Dest hazard must tick.
- **VARIANT_PROGRESSION:** BASE strike-or-shove → VETERAN skip-blocked → ELITE write-then-glance → CHAMPION Court Shove witness
- **RARITY_CURVE:** Standard. +ELITE on Face Glance / Wick Face.
- **SYNERGIES:** `glance_ward`, `oncoming_knight`, `wick_painter`, `boot_stinger`
- **WEAKNESSES:** Corner them (push distance 0); Self Anchor; occupy the dest
- **PLAYER_COUNTERPLAY:** Stand on the up-dir wall; don’t give them a Glance partner with a free front
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-shove-face` (ENEMY_DISCOVERY). Court Shove never grants. Do not restamp `about_regent`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (resolver exists; facing write is one enum assign)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `slip_squire`

- **NAME:** Slip Squire
- **ROLE:** teleporter (knight-offset self teleport)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` **without** heal. Distinct from Vault (wall-ignore, once/battle), `mist_walker` / `morrow_walker` / `blink_cutter` (Chebyshev blink), `hinge_squire` (rotate around ally), Relay Dash (walk ≤ 2). At most one knight-blink as PAIR vs Mist / Morrow.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Strike if every (2,1) dest fails `isCellFree`. Peer: Knight Slip only to a safer free dest. Above: refuse Slip onto a pit / lava; refuse if dest **is** a wall (Vault’s wall-ignore is **not** this card).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.95, sr 0.90, res 0.80, init 1.25, chc 1.05. Identity is the **eight-dest tell**. If they walk 3 Chebyshev, the kit leaked toward Mist.
- **AI_TIER_PROGRESSION:** Profile `flanker`. `aiHint: "knight_slip_if_dest_free_and_safer"`. VETERAN: skip if every dest fails. ELITE: Wick-partner — slip off a cell that will convert. CHAMPION: never spend walk MP to “pay” Boot (they do not own Boot).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-knight-slip`
- **ADVANCED_SPELL_POOL:** `starter-frost` after a landing that needs a poke
- **RARE_SPELL_POOL:** none — Vault stays Achievement / `slip_castellan` MULTI child
- **ELITE_SPELL_POOL:** none — dest honesty is the elite
- **SIGNATURE_MECHANICS:** Eight (2,1) rotations. Dest must be `isCellFree`. Jump **over** a wall is legal if dest is free; dest-that-is-wall fails. Walk MP stays 0. `movedThisTurn` = true on success.
- **VARIANT_PROGRESSION:** BASE strike-or-slip → VETERAN skip-blocked → ELITE slip-off-wick → CHAMPION no-boot-lie
- **RARITY_CURVE:** Standard. +ELITE on Slip Pit / Spare Slip.
- **SYNERGIES:** `wick_painter`, `spare_pacer`, `file_brander`, `post_stinger`
- **WEAKNESSES:** Occupy all eight dests; Claim Ward a dest; Nail Down does **not** block teleport (Grounded Lock / Claim Ward do)
- **PLAYER_COUNTERPLAY:** Plug the knight ring; don’t stand on the only free dest
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-knight-slip` (MULTI: family observe+win **or** `slip_castellan` first-win — first child wins). Observation **false** on the BOSS child.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (dest filter + occupancy teleport; do not reuse Vault’s wall-ignore)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pivot_ward`

- **NAME:** Pivot Ward
- **ROLE:** displacement specialist (rotate the target around the caster)
- **BASE_ELIGIBILITY:** New family; preferred chassis `queen` or `bishop` **without** `starter-heal`. Distinct from `hinge_squire` (caster rotates around ally), `pawn_broker` (two-hostile swap), `hook_chaplain` (pull ally to caster). At most one rotate-engine as PAIR vs Hinge.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if clockwise dest is blocked. Peer: Pivot Foe only if dest is `isCellFree` **and** improves file / hazard. Above: refuse Pivot onto a worse cell (lava under a body that would die).
- **STAT_SCALING_RULE:** hp 0.80, sp 1.10, sr 0.95, res 0.80, init 1.15, chc 1.00. Identity is the **clockwise dest tell**. If they Swap two bodies, the kit leaked toward Broker.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "pivot_foe_if_dest_improves_file_or_hazard"`. VETERAN: skip blocked dest. ELITE: Wick-partner — clockwise onto the wick. CHAMPION: `pivotClockwise: true` honesty — do not guess counter-clockwise from the name.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pivot-foe`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **dest cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-file-brand` only if `file_brander` is **absent**
- **ELITE_SPELL_POOL:** none — dest honesty is the elite. Do **not** unlock Hinge Step as identity.
- **SIGNATURE_MECHANICS:** Dest = caster + `(dy, −dx)` from target − caster. Occupancy teleport of the **target**. Caster stays. AP spent on a blocked dest (fizzle). Dest hazard must tick.
- **VARIANT_PROGRESSION:** BASE frost-or-pivot → VETERAN skip-blocked → ELITE onto-wick → CHAMPION clockwise-only
- **RARITY_CURVE:** Standard. +ELITE on Pivot Wick.
- **SYNERGIES:** `wick_painter`, `file_brander`, `axis_locksmith`, `face_shover`
- **WEAKNESSES:** Stand so every clockwise dest is a wall; Self Anchor; occupy the dest
- **PLAYER_COUNTERPLAY:** Hug a corner; don’t give them a file after the land
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pivot-foe` (ENEMY_DISCOVERY). Blocked landing after AP still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (occupancy teleport of the target)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `triple_span`

- **NAME:** Triple Span
- **ROLE:** summoner / protector (three-cell occupy)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `twin_span` (two), `span_warder` (rigid pair), `span_prelate` (stationary 2-cell), Triune Gate (three pads). **Skip spawn** if `ENEMY_SUMMON_CAP` remaining < 3. At most one multi-cell system per pack.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if the 3-line is not free. Peer: Triple Span only if three cardinal cells are free **and** cap remaining ≥ 3. Above: refuse if a Twin Span / Spark / wolf overlay already occupies the cap.
- **STAT_SCALING_RULE:** hp 1.20, sp 0.70, sr 1.10, res 1.15, init 0.70, chc 0.80. Identity is the **three-body plug**, not a turret that Strikes. If posts deal damage, the kit leaked.
- **AI_TIER_PROGRESSION:** Profile `generic` + explicit `aiHint: "triple_span_if_summon_cap_ge_3"`. VETERAN: skip if cap remaining < 3. ELITE: plant across the only bypass. CHAMPION: never also roll wolf/archer overlay. `inferSummonArchetype` must key `summonAI === "triplespan"`, **never** `name.includes("span")`.
- **CORE_SPELL_POOL:** `physical_attack`, `spell-triple-span`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin` on self (not on posts)
- **RARE_SPELL_POOL:** `spell-low-lintel` only if `lintel_mason` is **absent**
- **ELITE_SPELL_POOL:** none — empty-kit posts are the elite. Do **not** unlock Twin Span as identity.
- **SIGNATURE_MECHANICS:** Three 1-HP posts, cardinal 3-line, lifespan 4, `ap: 0`, `mp: 2`, empty kit. Walk dest illegal unless living posts remain a 4-adj chain. Counts as **three**.
- **VARIANT_PROGRESSION:** BASE strike-or-plant → VETERAN skip-cap → ELITE plug-bypass → CHAMPION no-overlay
- **RARITY_CURVE:** Standard. +ELITE on Triple Plug. `eliteOnly` on the spell.
- **SYNERGIES:** `lintel_mason`, `glass_sniper`, `share_warden` (posts as adjacent sponges), `wall_stinger`
- **WEAKNESSES:** Kill one post (chain becomes two); Open Pit a required step; Null Brand lockout
- **PLAYER_COUNTERPLAY:** Snipe a post; don’t walk the 3-line; Far Sting over the plug
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-triple-span` (ELITE / MULTI: family observe+win **or** `span_triune` first-win — first child wins). Later walks / deaths are not a second observe.
- **REWARD_EXPECTATION:** Standard. Do not credit three kills as three `applyRewards` — posts are not `countsTowardKillRewards`.
- **IMPLEMENTATION_COMPLEXITY:** HIGH (three-body occupy + walk dest filter + cap ≥ 3)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `cadence_cracker`

- **NAME:** Cadence Cracker
- **ROLE:** debuffer / controller (hostile highest CD → 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** `starter-heal`. Distinct from `cadence_breaker` (self last-id), `cadence_thief` (steal 1), `cadence_lender` (ally −1). At most one CD-reset engine as PAIR vs Breaker.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the target has no id on CD ≥ 2. Peer: Cadence Crack only if highest remaining ≥ 2 **and** not already used this battle. Above: refuse Crack on a bar of 0s (would spend 2 AP to fizzle).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.10, sr 0.95, res 0.75, init 1.20, chc 1.00. Identity is the **restore-their-nuke tell**. If they steal the CD, the kit leaked toward Thief.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "reset_hostile_highest_cd_if_ge_2"`. VETERAN: skip if no remaining CD ≥ 2. ELITE: Once-partner — restore Inferno, then the ally bans recasting it. CHAMPION: once/battle honesty (`cadenceCrackUsedThisBattle` on **this** caster).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-cadence-crack`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-mark`
- **RARE_SPELL_POOL:** `spell-inferno` only if `ignite_alchemist` is **absent** (teaching contrast: they restored **yours**)
- **ELITE_SPELL_POOL:** none — do not unlock Cadence Break as identity
- **SIGNATURE_MECHANICS:** Target’s highest remaining CD → 0. Once per battle per caster. Ties: highest remaining, then lowest id. Fizzle if none on CD (AP spent, still observes).
- **VARIANT_PROGRESSION:** BASE frost-or-crack → VETERAN skip-empty → ELITE restore-then-ban → CHAMPION once
- **RARITY_CURVE:** Standard. +ELITE on Crack Verse.
- **SYNERGIES:** `once_cantor`, `ignite_alchemist`, `tempo_precentor`
- **WEAKNESSES:** Sit with all CDs at 0; Cadence Brand +1 after they crack; do not hold Inferno CD 3 in their range
- **PLAYER_COUNTERPLAY:** Dump the nuke before they act; keep a cheap off-CD tool so Once Verse hurts them, not you
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-cadence-crack` (ENEMY_DISCOVERY). Fizzle after AP still observes.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (cooldown map by id)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `once_cantor`

- **NAME:** Once Cantor
- **ROLE:** controller (recast lock)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `queen` **without** heal. Distinct from Mute Thread (next **any** spell), After Verse family (replay), Oath Blade (Strike-only). At most one recast-lock as PAIR vs Hex Chorister.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have ≥ 3 off-CD ids. Peer: Once Verse if they just resolved a nuke they will want again. Above: refuse if they have no `lastResolvedSpellId` (first spell of the fight is never a repeat — fail closed, do not pretend the brand fizzles Strike).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.05, sr 1.00, res 0.75, init 1.15, chc 1.00. Identity is the **don’t-repeat tell**. If they fizzle the next **any** spell, the kit leaked toward Mute.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "once_verse_if_target_repeats_a_nuke"`. VETERAN: skip if they have ≥ 3 off-CD ids. ELITE: Crack-partner — restore the banned id. CHAMPION: `lastResolvedSpellId` written only on `castResult === "cast"`, never fizzle.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-once-verse`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-quiet-hex` only if a hex family is **absent**
- **RARE_SPELL_POOL:** none — do not steal After Verse
- **ELITE_SPELL_POOL:** none
- **SIGNATURE_MECHANICS:** 2 turns: next spell fizzles if `spell.id === lastResolvedSpellId`. Strike is `physical_attack`. Missing last-id → no fizzle.
- **VARIANT_PROGRESSION:** BASE frost-or-brand → VETERAN skip-toolbox → ELITE restore-then-ban → CHAMPION resolved-only
- **RARITY_CURVE:** Standard. +ELITE on Crack Verse.
- **SYNERGIES:** `cadence_cracker`, `ignite_alchemist`, `hex_chorister` (COURT, not PAIR)
- **WEAKNESSES:** Cast a 2-cost tool of a different id; wait 2 turns; first spell of the fight is free
- **PLAYER_COUNTERPLAY:** Alternate Strike and Frost; don’t recast Inferno into the brand
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-once-verse` (ENEMY_DISCOVERY). Arming observes; later consume is not a second observe.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (one id on the unit)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `hood_lurker`

- **NAME:** Hood Lurker
- **ROLE:** status specialist / kiter (next DoT tick skip)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `pawn` **without** heal. Distinct from `sidestep_warder` (miss a hit), Fog Hood (LoS), `cap_warder` (cap 12), Cleanse (strips). At most one tick-skip as PAIR vs Sidestep.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they have no DoT. Peer: Tick Hood only if a DoT is present. Above: refuse Hood with empty DoT list (would waste 2 AP).
- **STAT_SCALING_RULE:** hp 0.65, sp 1.05, sr 0.85, res 0.70, init 1.25, chc 1.10. Identity is the **skip-the-fat-tick tell**. If they miss a Strike, the kit leaked toward Sidestep.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "skip_next_dot_tick_if_dot_present"`. VETERAN: skip if no DoT. ELITE: Ignite-partner — skip the Inferno tick, then Absolve leftover. CHAMPION: lava/spikes are **not** DoT ticks (Safe Fall / environmental path).
- **CORE_SPELL_POOL:** `starter-frost`, `spell-tick-hood`
- **ADVANCED_SPELL_POOL:** `starter-poison` (so they can teach the skip on a stack they applied)
- **RARE_SPELL_POOL:** `spell-absolve` only if `ash_absolver` is **absent**
- **ELITE_SPELL_POOL:** none — tick honesty is the elite. Do **not** unlock Sidestep as identity.
- **SIGNATURE_MECHANICS:** Next DoT tick that would deal HP deals 0, then the charge consumes. Apply still lands. Timeout 2 turns. Multiple DoTs: first tick that would deal > 0 (lowest effect id).
- **VARIANT_PROGRESSION:** BASE frost-or-hood → VETERAN skip-empty → ELITE skip-then-strip → CHAMPION no-lava-lie
- **RARITY_CURVE:** Standard. +ELITE on Hood Choir.
- **SYNERGIES:** `ignite_alchemist`, `ash_absolver`, `plague_rat`
- **WEAKNESSES:** Wait 2 turns; throw a hit (does **not** consume Tick Hood); apply a new DoT after the skip
- **PLAYER_COUNTERPLAY:** Don’t Inferno them while Hood is up; poison them **after** the skip
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-tick-hood` (ENEMY_DISCOVERY). Arming observes; the skipped tick does not.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (one flag in the DoT ticker, not inside `computeDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `share_warden`

- **NAME:** Share Warden
- **ROLE:** protector / tank (adjacent-ally 50/50)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `king` **without** heal. Distinct from Pet Share (summon-only 30%), `pain_suture` (% tether), `cover_squire` (redirect whole hit), `cap_warder` (cap 12). At most one share-engine as PAIR vs Cover / Pain.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Iron Skin if no adjacent ally. Peer: Flank Share only if a living same-`side` ally is Chebyshev-1. Above: refuse Share with no adjacent ally (charge would consume on a full hit).
- **STAT_SCALING_RULE:** hp 1.35, sp 0.80, sr 1.10, res 1.20, init 0.75, chc 0.80. Identity is the **split-with-neighbor tell**. If they redirect the whole hit, the kit leaked toward Cover.
- **AI_TIER_PROGRESSION:** Profile `generic`. `aiHint: "flank_share_if_adj_ally"`. VETERAN: skip if no adjacent ally. ELITE: Goad-partner — forced swing is the split one. CHAMPION: missing ally at **hit** time → full hit, charge gone (do not keep the charge).
- **CORE_SPELL_POOL:** `physical_attack`, `spell-flank-share`
- **ADVANCED_SPELL_POOL:** `spell-iron-skin`, `spell-goad` only if `goad_herald` is **absent**
- **RARE_SPELL_POOL:** `spell-turn-cap` only if `cap_warder` is **absent**
- **ELITE_SPELL_POOL:** none — split honesty is the elite. Do **not** unlock Pet Share as identity.
- **SIGNATURE_MECHANICS:** Next damaging **hit** (not DoT, not lava): this unit `ceil(applied * 0.5)`, nearest living ally Chebyshev 1 takes the remainder. Split **after** RES. Ally includes player-side summons, excludes self.
- **VARIANT_PROGRESSION:** BASE strike-or-share → VETERAN skip-alone → ELITE goad-then-split → CHAMPION consume-on-missed-ally
- **RARITY_CURVE:** Standard. +ELITE on Share Goad. `eliteOnly` on the spell.
- **SYNERGIES:** `goad_herald`, `cap_warder`, `triple_span`, `twin_tether` (COURT, not PAIR)
- **WEAKNESSES:** Kill the adjacent ally first; AoE that hits both (first split, second full); wait 2
- **PLAYER_COUNTERPLAY:** Separate them; snipe the sponge; DoT the warden (ticks do **not** split)
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-flank-share` (ELITE observe+win). Remainder through `recordChallengeDamageTaken` if the ally is the player.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (one split in the incoming-hit pipeline after RES; do not rewrite `computeDamage`)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `spare_pacer`

- **NAME:** Spare Pacer
- **ROLE:** buffer / kiter (+1 current walk MP)
- **BASE_ELIGIBILITY:** New family; preferred chassis `knight` or `bishop` **without** heal. Distinct from Haste (duration +2), `tempo_precentor` (next-turn AP), Second Wind (refill), Split Pace (range rider). At most one current-MP gift as PAIR vs Tempo.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost / Strike if already at max MP. Peer: Spare Pace only if a dest needs exactly +1. Above: refuse Spare at max MP (would cap-waste).
- **STAT_SCALING_RULE:** hp 0.80, sp 0.90, sr 0.90, res 0.80, init 1.20, chc 1.00. Identity is the **one-extra-step tell**. If they grant next-turn AP, the kit leaked toward Precentor.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "spare_pace_if_one_short_of_dest"`. VETERAN: skip if at max MP or no dest needs +1. ELITE: Boot-partner — buy the step, then the ally stings. CHAMPION: do not write persisted `CharacterStats.mp`.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-spare-pace`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `physical_attack`
- **RARE_SPELL_POOL:** `spell-boot-sting` only if `boot_stinger` is **absent**
- **ELITE_SPELL_POOL:** none — current-turn honesty is the elite. Do **not** unlock Haste as identity.
- **SIGNATURE_MECHANICS:** +1 current MP this turn, cap at unit max (or 20). Not a `buffStat: "mp"` duration. Frozen/Slime still apply to the next step.
- **VARIANT_PROGRESSION:** BASE frost-or-spare → VETERAN skip-max → ELITE buy-for-boot → CHAMPION no-persist
- **RARITY_CURVE:** Standard. +ELITE on Boot Spare / Boon Boot / Spare Slip.
- **SYNERGIES:** `boot_stinger`, `boon_mason`, `slip_squire`, `gait_muter`
- **WEAKNESSES:** Soul Sip the spare; ice / Rank Lock so the extra MP cannot be spent on a useful dest
- **PLAYER_COUNTERPLAY:** Slow them after the grant; occupy the dest they bought
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-spare-pace` (ENEMY_DISCOVERY)
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `wick_painter`

- **NAME:** Wick Painter
- **ROLE:** hazard creator (delayed pit convert)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` **without** heal. Distinct from `pit_mason` (immediate Open Pit), `fuse_binder` (delayed **damage**), `hinge_mason` (enter-swap). **Not** named `wick_mason` — that id is the Pit Wick MULTI extra door. At most one delayed-pit as PAIR vs Pit / Fuse.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if they already stand at range 4 with Far Sting (you will give them a LoS tunnel in 1 turn). Peer: Pit Wick on the melee approach cell. Above: refuse Wick under a body that will simply walk off (paint a choke they must use).
- **STAT_SCALING_RULE:** hp 0.95, sp 1.00, sr 0.95, res 0.90, init 0.90, chc 1.00. Identity is the **walkable-now / pit-later tell**. If the cell is a pit **this** turn, the kit leaked toward Pit Mason.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "pit_wick_on_melee_approach"`. VETERAN: skip if the player is already at range 4 with a far gun. ELITE: Face-partner — shove onto the wick before convert. CHAMPION: Barrier last-writer **fills** the pit; do not fight last-writer with a second paint.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pit-wick`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **wick cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-shove-face` only if `face_shover` is **absent**
- **ELITE_SPELL_POOL:** none — delay honesty is the elite. Do **not** unlock Open Pit as identity.
- **SIGNATURE_MECHANICS:** Paint floor 1 turn (walkable, LoS open). At caster’s next turn start (or after 1 round if gone), convert to Open Pit for 2 turns (`pitTiles`, not `barrierTiles`). Units standing on convert are **not** displaced.
- **VARIANT_PROGRESSION:** BASE frost-or-wick → VETERAN skip-far-gun → ELITE shove-then-convert → CHAMPION last-writer
- **RARITY_CURVE:** Standard. +ELITE on Pivot Wick / Wick Face / Slip Pit.
- **SYNERGIES:** `face_shover`, `pivot_ward`, `slip_squire`, `fuse_binder` (COURT, not PAIR)
- **WEAKNESSES:** Leave during the wick window; Barrier the cell; do not stand there at convert
- **PLAYER_COUNTERPLAY:** Walk off before convert; Far Sting the painter; don’t get shoved onto it
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pit-wick` (MULTI: family observe+win **or** `wick_mason` first-win — first child wins). Paint observes; convert does not.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (delayed occupancy convert; share `pitTiles` with Open Pit)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `boon_mason`

- **NAME:** Boon Mason
- **ROLE:** hazard creator / buffer (walk-exit MP refund)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` or `knight` **without** heal. Distinct from `tithe_mason` (leave **+1 AP**), Glyph Tax (enter AP), `spare_pacer` (caster-scoped +1). At most one exit-paint as PAIR vs Tithe.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the cell is adjacent to a pit they would refund into. Peer: Exit Boon on their own kiting cell. Above: refuse Boon under an Exit Tithe last-writer (last paint wins — do not stack).
- **STAT_SCALING_RULE:** hp 0.85, sp 0.95, sr 0.90, res 0.80, init 1.10, chc 1.00. Identity is the **refund-the-leave tell**. If leaving costs AP, the kit leaked toward Tithe.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "exit_boon_on_own_kiting_cell"`. VETERAN: skip if the cell dumps into a pit. ELITE: Boot-partner — refund, then sting after the paid step. CHAMPION: teleport / swap / shove leave do **not** refund.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-exit-boon`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **boon cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-spare-pace` only if `spare_pacer` is **absent**
- **ELITE_SPELL_POOL:** none — walk-leave honesty is the elite. Do **not** unlock Exit Tithe as identity.
- **SIGNATURE_MECHANICS:** Paint floor 2 turns. A unit that **leaves by walk** refunds 1 current MP (cap at max). Standing at paint does not refund. Re-enter and leave again in the same turn **does** refund again.
- **VARIANT_PROGRESSION:** BASE frost-or-boon → VETERAN skip-into-pit → ELITE refund-then-boot → CHAMPION walk-only
- **RARITY_CURVE:** Standard. +ELITE on Boon Boot.
- **SYNERGIES:** `boot_stinger`, `spare_pacer`, `tide_shade`, `gait_muter`
- **WEAKNESSES:** Do not enter; Exit Tithe last-writer on the same cell; Frozen still charged the step (net −(cost−1))
- **PLAYER_COUNTERPLAY:** Don’t step on it; Tithe-overwrite if you own that paint; Soul Sip after the refund
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-exit-boon` (ENEMY_DISCOVERY). Paint observes; leave refunds do not. Do not restamp `exit_mason`.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** MEDIUM (leave hook shared with Exit Tithe’s walk-exit predicate)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `dull_censor`

- **NAME:** Dull Censor
- **ROLE:** anti-melee / controller (next Strike deals 0)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `null_censor` (G≥6 stamp of this verb is not CORE), Oath Blade (other ids fizzle, Strike **hurts**), Mute Thread (next spell fizzles). SDE Wave 6 `spell-dull-edge`. At most one Strike-zero as PAIR vs Null / Oath.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if the target’s likely next action is a 3+ AP spell. Peer: Dull Edge when they are adjacent and will Strike. Above: refuse Dull if they are a planted caster (would waste 3 AP).
- **STAT_SCALING_RULE:** hp 0.75, sp 1.10, sr 1.05, res 0.80, init 1.10, chc 1.00. Identity is the **Strike-is-0 tell**. If other ids fizzle, the kit leaked toward Oath.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "zero_next_strike"`. VETERAN: skip if they will not Strike. ELITE: Sill-partner — pets cannot park, Strike deals 0. CHAMPION: never also Mute Thread from this world pack.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-dull-edge`
- **ADVANCED_SPELL_POOL:** `spell-slow`, `spell-weaken`
- **RARE_SPELL_POOL:** `spell-aim-veil` only if `veil_cantor` is **absent**
- **ELITE_SPELL_POOL:** none — Strike-zero honesty is the elite. Do **not** unlock Oath Blade.
- **SIGNATURE_MECHANICS:** Next `spell.id === "physical_attack"` deals 0 after RES for 2 turns. Other ids resolve. Never `spell.name`.
- **VARIANT_PROGRESSION:** BASE frost-or-dull → VETERAN skip-casters → ELITE dull+sill → CHAMPION no-mute
- **RARITY_CURVE:** Standard. +ELITE on Dull Sill.
- **SYNERGIES:** `pet_siller`, `leash_cutter`, `veil_cantor` (COURT, not PAIR)
- **WEAKNESSES:** Cast Frost / Slow instead; wait 2 turns; Oath Blade is the opposite problem
- **PLAYER_COUNTERPLAY:** Don’t Strike; poke from 4; wait the brand out
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-dull-edge` (ENEMY_DISCOVERY). SDE G≥6 stamp on `null_censor` / `hex_chorister` is MULTI — first child wins; do not restamp a feat.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW
- **STATUS:** PROPOSED

---

### ENEMY_ID: `pet_siller`

- **NAME:** Pet Siller
- **ROLE:** anti-summon / hazard creator (summons cannot enter)
- **BASE_ELIGIBILITY:** New family; preferred chassis `rook` or `pawn` **without** heal. Distinct from `pit_mason` (all walks), Claim Ward (everyone’s swap/blink), Kennel Lock (leash **allied**), `glyph_sower` G≥6 stamp. At most one summon-sill as PAIR vs Pit / Glyph.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no hostile summon and the player has not summoned this fight. Peer: Pet Sill on the cell the player pet must enter. Above: refuse Sill on an empty board (would paint a tax nobody pays).
- **STAT_SCALING_RULE:** hp 0.90, sp 1.00, sr 1.00, res 0.90, init 0.95, chc 1.00. Identity is the **pets-cannot-park tell**. If the player body cannot enter, the kit leaked toward Pit.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "forbid_summon_enter_cell"`. VETERAN: skip if no hostile summon. ELITE: Leash-partner — cannot park, remaining life → 1. CHAMPION: player body walks freely; summon teleport landing fizzles.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-pet-sill`
- **ADVANCED_SPELL_POOL:** `spell-mark` on the **sill cell**, `spell-slow`
- **RARE_SPELL_POOL:** `spell-short-leash` only if `leash_cutter` is **absent**
- **ELITE_SPELL_POOL:** none — summon-only honesty is the elite. Do **not** unlock Open Pit as identity.
- **SIGNATURE_MECHANICS:** Paint floor 2 turns. Summons (`isSummon === true`) cannot **walk** onto that cell. Non-summons walk freely. Summon Swap/blink landing fizzles; non-summons OK.
- **VARIANT_PROGRESSION:** BASE frost-or-sill → VETERAN skip-empty → ELITE sill-then-cut → CHAMPION player-walks
- **RARITY_CURVE:** Standard. +ELITE on Dull Sill / Sill Brood.
- **SYNERGIES:** `leash_cutter`, `dull_censor`, `brood_chanter` (COURT, not PAIR), `spark_chanter`
- **WEAKNESSES:** Walk the player body through; blink the pet over if Claim Ward is down; Sever Tether
- **PLAYER_COUNTERPLAY:** Don’t park the wolf on the paint; dismiss and recast off the cell
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-pet-sill` (ENEMY_DISCOVERY). SDE G≥6 stamp on `glyph_sower` / `brood_chanter` is MULTI — first child wins.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW–MED (enter gate on `isSummon`, not on piece name)
- **STATUS:** PROPOSED

---

### ENEMY_ID: `leash_cutter`

- **NAME:** Leash Cutter
- **ROLE:** anti-summon (cut hostile summon lifespan)
- **BASE_ELIGIBILITY:** New family; preferred chassis `bishop` **without** heal. Distinct from `null_censor` (ELITE stamp of this verb is not CORE), Sever Tether (**kills**), Keep Kennel (**adds** allied), Convert Whelp (steal at 25%), `leash_warden` (allied leash). At most one lifespan-cut as PAIR vs Null / Leash.
- **RELATIVE_LEVEL_BEHAVIOUR:** Below: Frost if no hostile summon with remaining ≥ 2. Peer: Short Leash only if `isSummon === true` and remaining ≥ 2. Above: refuse on a player body (would fizzle 3 AP).
- **STAT_SCALING_RULE:** hp 0.70, sp 1.10, sr 1.05, res 0.75, init 1.15, chc 1.00. Identity is the **one-turn-left tell**. If the pet dies now, the kit leaked toward Sever.
- **AI_TIER_PROGRESSION:** Profile `caster`. `aiHint: "cut_hostile_summon_lifespan"`. VETERAN: skip if remaining < 2. ELITE: Sill-partner — cannot re-park after the cut. CHAMPION: does not affect bosses or leaders; 0 damage.
- **CORE_SPELL_POOL:** `starter-frost`, `spell-short-leash`
- **ADVANCED_SPELL_POOL:** `spell-weaken`, `spell-expose`
- **RARE_SPELL_POOL:** `spell-pet-sill` only if `pet_siller` is **absent**
- **ELITE_SPELL_POOL:** none — cut-to-1 honesty is the elite. Do **not** unlock Sever Tether as identity.
- **SIGNATURE_MECHANICS:** Legal only if target `isSummon`. Set remaining lifespan to `min(remaining, 1)`. Fizzle on non-summons (AP spent, still observes). Does not count as a new summon for Null Brand.
- **VARIANT_PROGRESSION:** BASE frost-or-cut → VETERAN skip-short-life → ELITE cut-then-sill → CHAMPION no-boss
- **RARITY_CURVE:** Standard. +ELITE on Dull Sill. `eliteOnly` on the spell.
- **SYNERGIES:** `pet_siller`, `dull_censor`, `null_censor` (COURT, not PAIR)
- **WEAKNESSES:** Don’t bring a pet; Keep Kennel first (then this still cuts to 1); dismiss by lifespan
- **PLAYER_COUNTERPLAY:** Play without summons; recast after the last turn; don’t invest a Sentinel’s remaining 4
- **SPELL_DISCOVERY_OPPORTUNITIES:** `spell-short-leash` (ELITE observe+win). SDE ELITE stamp on `null_censor` is MULTI — first child wins.
- **REWARD_EXPECTATION:** Standard
- **IMPLEMENTATION_COMPLEXITY:** LOW (`isSummon` flag + lifespan integer)
- **STATUS:** PROPOSED

---

## 5. Amendments to older waves (ids unchanged)

These are pointer notes, not new families and not new spell ids.

| Older family | Amendment |
| :--- | :--- |
| `iron_golem` / `stone_castellan` | May **demonstrate** Wall Sting / Triple Span at G≥6. CORE identity stays inertia / turret. Wave 8 families own the verbs. |
| `post_stinger` / `corner_bishop` / `far_stinger` / `glass_sniper` | Unmoved / LoS-blocked / distance / min-range. Wall Stinger owns **barrier-hug**. Boot Stinger owns **walked**. |
| `file_reeler` / `rank_lancer` / `axis_locksmith` | Attract / walk-lock / axis lock. File Brander owns XOR-axis **rider**. |
| `bash_bruiser` / `shove_chaplain` / `recoil_squire` / `pin_cantor` | Shove / ally shove / self push / lock view. Face Shover owns shove **+ facing write**. CHAMPION may witness Court Shove. |
| `mist_walker` / `morrow_walker` / `blink_cutter` / `hinge_squire` / `vault_chaplain` | Chebyshev blink / 90° around ally / ally blink 3–4. Slip Squire owns knight-offset dest-must-be-free. |
| `hinge_squire` / `pawn_broker` / `hook_chaplain` | Caster around ally / two-hostile swap / pull. Pivot Ward owns **target** around caster. |
| `twin_span` / `span_warder` / `span_prelate` | Two independent / rigid pair / stationary 2-cell. Triple Span owns three + chain walk. |
| `cadence_breaker` / `cadence_thief` / `cadence_lender` | Self last-id → 0 / steal 1 / ally −1. Cadence Cracker owns **hostile** highest → 0. |
| `hex_chorister` / `verse_scribe` | Replay / verse extras. Once Cantor owns recast lock. Mute Thread stays boss. |
| `sidestep_warder` / `cap_warder` / `cover_squire` / `pain_suture` | Hit miss / hit cap / redirect / tether. Hood Lurker owns **DoT tick** skip. Share Warden owns adjacent-ally 50/50. |
| `tempo_precentor` | Next-turn AP. Spare Pacer owns **current** walk MP. |
| `pit_mason` / `fuse_binder` / `hinge_mason` | Immediate pit / delayed damage / enter-swap. Wick Painter owns delayed **occupancy** convert. Extra door remains `wick_mason`. |
| `tithe_mason` / `tax_scribe` / `glyph_sower` | Exit AP / enter AP / glyph. Boon Mason owns exit **MP refund**. |
| `null_censor` / `oath_censor` | G≥6 Dull / Oath extra door. Dull Censor owns Strike 0 as CORE. Oath stays boss. |
| `glyph_sower` / `brood_chanter` / `leash_warden` | G≥6 Pet Sill / Pet Share. Pet Siller owns summon-enter forbid as CORE. Pet Share stays ELITE extra on Brood / Leash. |
| `null_censor` (ELITE) | G≥6 Short Leash stamp. Leash Cutter owns cut-to-1 as CORE. |
| `face_shover` | CHAMPION may arm `spell-court-shove` (witness-only, never owned). CORE stays Shove Face. Same law as About Face on `pin_cantor`. |
| `pace_prelate` (proposed extra door, not a world family) | Owns `spell-must-pace`. World packs do **not** take it as CORE. |

`spell-late-purse` / `spell-pet-share` stay Wave 6 SDE stamps (`tax_scribe` / `hex_teller`; `brood_chanter` / `leash_warden` ELITE). Do not clone.  
SDE Wave 7 unique CORE (`spell-even-stride` … `spell-file-fold`) stay G≥6 extras. Do not family them this pass.

---

## 6. Identity matrix (Wave 8 — keep kits coherent)

When a future spell is assigned, it must match the family’s allowed categories. If it does not, drop it — do not “fill a slot.”

| Family | Allowed categories / flags | Forbidden |
| :--- | :--- | :--- |
| wall_stinger | requireTargetAdjBarrier poke, damage, isMark, debuff(mp) | heal, isSummon, blind-corner-as-identity, world-wall-as-barrier |
| file_brander | requireSharedAxisXor poke, damage, isMark | heal, isSummon, File Lance as identity, `targetType: "line"` |
| boot_stinger | requireCasterWalked poke, damage, physical | heal, isSummon, post-sting-as-identity, slip-as-walk |
| face_shover | shoveFaceWriteView, physical | heal, isSummon, damage-on-shove, About Face as CORE |
| slip_squire | knightSlipDx/Dy self teleport, physical | heal, isSummon, Vault wall-ignore, Chebyshev blink as CORE |
| pivot_ward | pivotClockwise target teleport, damage (frost), isMark | heal, isSummon, Hinge Step as CORE, `isSwap` |
| triple_span | isSummon (`triplespan`), defense | turret/wolf/archer/bomber/span/pylon/twinspan/spark, heal, nested Strike on posts |
| cadence_cracker | resetTargetHighestCooldownToZero, damage (frost) | heal, isSummon, self-reset, steal |
| once_cantor | forbidRepeatLastSpellId, damage (frost), debuff | heal, isSummon, Mute Thread, echo/replay |
| hood_lurker | skipNextDotTick, damage (frost/poison) | heal, isSummon, Sidestep as identity, lava-as-DoT |
| share_warden | flankShareRatio, defense, physical | isSummon-as-identity, Cover as CORE, Pet Share as CORE, inferno |
| spare_pacer | sparePaceCurrentMp, damage (frost), physical | healAmount, isSummon, Haste-as-identity, persist MP |
| wick_painter | pitWickDelayTurns, damage (frost), isMark | heal, isSummon, Open Pit as identity, Fuse as identity |
| boon_mason | exitBoonMp tile, damage (frost), isMark | heal, isSummon, Exit Tithe as identity, teleport-refund |
| dull_censor | nextStrikeDamageZero, damage (frost), debuff | heal, isSummon, Oath Blade, Mute Thread |
| pet_siller | forbidSummonEnter tile, damage (frost), isMark | heal, Open Pit as identity, player-body block |
| leash_cutter | cutHostileSummonLifespanTo, damage (frost), debuff | heal, isSummon-as-self, Sever Tether as identity, boss target |

Wave 1–7 matrices still apply to those ids.

---

## 7. Role coverage after Wave 8

| Archetype | Wave 1 owner | Wave 8 extra (new verb) |
| :--- | :--- | :--- |
| bruiser | crimson_spawn | boot_stinger (step-then-sting) |
| sniper | glass_sniper | wall_stinger (barrier hug) |
| kiter | tide_shade | spare_pacer, hood_lurker |
| assassin | shadow_lurker | — |
| healer | pale_cantor | — |
| buffer | hex_chorister | spare_pacer, boon_mason |
| debuffer | bone_scribe | cadence_cracker, once_cantor, dull_censor |
| summoner | brood_chanter | triple_span |
| controller | coil_arbiter | once_cantor, cadence_cracker (Must Pace stays boss) |
| tank | iron_golem | share_warden |
| protector | leash_warden | share_warden, triple_span |
| artillery | storm_caller | file_brander |
| kamikaze | cinder_martyr | — |
| teleporter | wraith_bishop | slip_squire |
| displacement | rift_hook | face_shover, pivot_ward |
| hazard creator | ember_knight | wick_painter, boon_mason, pet_siller |
| status specialist | plague_rat | hood_lurker, once_cantor |
| anti-summon | null_censor | pet_siller, leash_cutter |
| anti-ranged | void_mirror | file_brander |
| anti-melee | leash_warden | wall_stinger, dull_censor, share_warden |

Every requested archetype still has a Wave 1 owner. Wave 8 does not invent a 21st role word. It adds **verbs**.

---

## 8. Implementation notes (not this PR)

This change is **design only**. When a later implementation PR lands Wave 8 families:

1. Add ids to `EnemyFamily` / `FAMILY_TYPES` / `FAMILY_STAT_MULTS` **after** family HP survives battle start (`WX` 11970–11974 still overwrites). Do not ship families that die to `calcEnemyMaxHp`.
2. Pass a **number** into `buildEnemyKit` (WX 11920 is still `levelZone` object → NaN → zone 0).
3. `executeCastAttempt` still AP-only. Every Wave 8 CORE row is `mpCost: 0`.
4. Write `walkMpSpentThisTurn` on battle walks before Boot Sting / Must Pace can be honest. Knight Slip must **not** increment it.
5. Write `currentView` from Shove Face’s occupancy step (WX 6928–6931 mapping). Battle-walk facing remains a Wave 5 prerequisite for Oncoming / Glance.
6. `inferSummonArchetype`: add `summonAI === "triplespan"` (and still `twinspan` / `spark` / `font` / `pylon` / `turret` / `bait` / `decoy`). Never parse `"Triple Span"`.
7. Do not spawn `triple_span` while `ENEMY_SUMMON_CAP` is 2. Cap remaining ≥ 3 is a **hard skip**, not a silent plant of two posts.
8. Stationary-post / multi-cell cap: one system per pack. Triple Span fills it.
9. Do not touch RAF, map generation, turn logic, or damage math.
10. Rewards only through `applyRewards`. Posts / whelps do not mint.

---

## 9. STATUS

**PROPOSED.** Seventeen world-pack families. Fourteen consume SPELL_PROPOSALS Wave 7. Three consume SDE Wave 6 unique CORE that still had no CORE owner. Must Pace / Court Shove stay closed. No production code in this change.
