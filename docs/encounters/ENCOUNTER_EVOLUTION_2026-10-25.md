# Encounter Evolution Catalog — 2026-10-25

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-25-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826), `ENCOUNTER_EVOLUTION_2026-10-22.md` (`EED-2026-10-22-001`, PR #885), `ENCOUNTER_EVOLUTION_2026-10-23.md` (`EED-2026-10-23-001`, PR #957), `ENCOUNTER_EVOLUTION_2026-10-24.md` (`EED-2026-10-24-001`, PR #1006). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-16 Wave 15 packs `docs/design/ENEMY_FORMATIONS_2026-10-24.md` (PR #1005), Wave 16 world features in `docs/WORLD_DYNAMICS.md` (PR #993, `WDD-2026-10-24-001`), Rush Table O `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.14 (PR #1004). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-25) Wave 17 family / spell / world-feature / formation catalogs that land in parallel stay **unconsumed**. Wave 16 **families** (`tally_mender`, `shove_gifter`, … — PR #997) wait for a later formation drop (drop 17). Wave 17 **bosses** stay Rush-only (Table O). Wave 15 **families** (`poise_mender`, `poise_stinger`, `poise_stepper`, `poise_sipper`, `poise_hooder`, `poise_siller`, `poise_holder`, `poise_lender`, `poise_prelate`, `poise_bouncer`, `must_poiser`, `verse_poiser`, `knight_warder`, `quad_oather`, `pit_reeler`, `axis_biter`, `shove_marker`, `spent_plater`, `rime_skipper`, `full_stinger`, `summon_caster`, `hollow_gifter`, `cadence_swapper`, `strike_debter`, `brick_nudger`, `watch_sipper`, `lone_gaiter`, `hazard_cutter`, `drift_gifter`, `bar_crosser`, `nine_prelate`) are legal **metadata locks** on drop-16 sheets, not a 30% lottery.

---

## 1. Why a seventeenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–16 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, Both/Stride/Near, Heave/Dual/Mid, Dry/Lean/Odd, and Gaunt/Even/Brick/Orth. Day-16 rooms spent leftover drop-15 packs (`FSN-GAUNT-STEP`, `FSN-GAUNT-SIP`, `FSN-EVEN-ORTH`, …) and Wave 15 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-16 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-16 Wave 15 packs | Day-16 taught four leftover-**0** flags / leftover-**AP**=0 **and** leftover-**MP**=0 poke / even-Chebyshev miss as **rooms**. Still PDFs: `FSN-POISE-STEP`, `FSN-POISE-SIP`, `FSN-KNIGHT-QUAD`, `FSN-PIT-AXIS`, `FSN-POISE-GATE`, `FSN-SPENT-FULL`, `FSN-RIME-FILE`, `FSN-WATCH-SIP`, `FSN-POISE-CHOIR`, `FSN-SHOVE-DRIFT`, `FSN-POISE-QUIET`, `FSN-HOLLOW-SWAP`, `FSN-LONE-HAZARD`, `FSN-STRIKE-TAX`, `FSN-CROSS-POISE`, `FSN-POISE-HOLD` |
| World-feature Wave 16 | Day-16 **rooms** never spent `WF-HAZ-SPENT_SEAM`, `WF-HAZ-LEAN_CINDER`, `WF-TRP-STRIDE_PLATE`, `WF-TER-PIVOT_SLAB`, `WF-OBS-HURT_SILL`, `WF-ZON-HURT_FONT`, `WF-TEL-SPARE_STEP`, `WF-INV-GUARD_FILE`, `WF-ELT-DIAG_PICKET`, `WF-TRS-DIAG_CACHE`, `WF-SPL-DIAG_TUTOR`, `WF-RSK-SPENT_OATH`, `WF-MOD-CAST_LOCK`, `WF-EVT-DIAG_HOUR`, `WF-ENV-SPARE_DRAFT` |
| Rush Table O | `O0`–`O3` (`boot_subprior`+`lock_marshal`, `purse_steward`+`unbound_pendulum`, `tick_infirmarer`+`fetid_rook`, `mute_notary`+`dilate_organist`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `spentSeamCells` / `leanCinderCell` / `stridePlateCell` / `pivotSlabCell` / `hurtSillCell` / `hurtFontCell` / `spareStepPads` / `castLockArmed` / `diagPicketArmed` / `spareDraftArmed` / `diagHourArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Lean Post / Gaunt Post / Poise Post count as **1**. Six Plug / `FSN-LEAN-HOLD/SIX` count as **6**. Sept / `FSN-DRIFT-COURT/SEPT` count as **7**. Oct Plug (`oct_prelate`, `FSN-GAUNT-HOLD/OCT`) counts as **8**. Nine Plug (`nine_prelate`, `FSN-POISE-HOLD/NINE`) counts as **9** — wait for remaining cap ≥ 9 (live cap is 2).
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Poise / Hollow Gift / Drift Gift / Still Gift / Pair Gift bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Poise Mend / Hollow Gift / Drift Gift live **only** on the named profiles. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Gaunt Mend as Poise Mend (Gaunt is **both leftover 0**; Poise is **both leftover AP === MP ≥ 1**). Do **not** clone Hollow Gift as Poise Mend (Hollow Gift is **target-only** both-pools).
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-STRIDE_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark / Incant / Vow). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-DIAG_HOUR` may overlay a dungeon as a reward wager (no extra portal).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-17 ids (`boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Heave Step / Parched Step / Gaunt Step / **Poise Step** **does not** count as leftover walk-MP for Poise Mend, Poise Sting, Poise Sip, Poise Sill, Poise Post, Must Poise, Verse Poise, Poise Hold, Spent Plate, Full Sting, or Pair Gait. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`. Poise Step dests are occupancy, **not** `isSwap`.
- Poise Mend pays 8 only if **caster and target** leftover AP === leftover MP **and leftover AP ≥ 1** after the 3 AP is paid. One broken equality on one body is 0 HP. Dual Keep leftover **opens** Poise and **closes** Gaunt / Hollow Gift. `0 = 0` is Gaunt’s window, not this primer. Poise Step relocates onto a free Chebyshev-1 of an ally whose leftover AP === leftover MP ≥ 1 — not Gaunt / Parched / Home / Heave / Ally Step. Poise Sting is 10, +8 iff **target** leftover AP === leftover MP ≥ 1. Poise Sip steals 1 leftover AP iff leftover AP === leftover MP ≥ 1 (breaks the tie). Knight Stride makes the **next** walk dest `|dx|,|dy|` = 2,1 or 1,2. Quad Oath wants the next spell at Chebyshev **exactly 4**; Strike stays legal. Pit Reel is the **eighth** `applyAttract` dest (file / ally / foe / paint / hazard / void / barrier / then **pit**). Dest is **toward**, not onto, a world portal. Wake Mark detonates on **start-turn occupy**. Poise Post detonates on end-turn occupy **and leftover AP === leftover MP ≥ 1**; walk-on is safe; leftover 0 or unequal is safe. Poise Sill taxes start-turn occupy **and leftover AP === leftover MP ≥ 1**; paint stays. Rime Skip is next **1-tile** walk treating **rime leave-tax** as floor; lava / spikes / pits / cinder / glyph still tick. Spent Plate zeros the next hit **while leftover AP ≥ 1**; leftover AP 0 at impact **lands**. Full Sting is leftover **AP ≥ 3** poke. Watch Sip: overwatch snap **steals** the walker’s leftover AP (inverse of Watch Alms’ walker grant). Hollow Gift heals iff the **target** leftover AP = 0 **and** leftover MP = 0; caster leftover unconstrained. Cadence Swap exchanges remaining CD **maps**; unknown ids dropped. Strike Debt is **Struck**-last-turn next-walk +1 AP; spell last turn does **not** arm it. Verse Poise makes the last id illegal until leftover AP === leftover MP ≥ 1. Must Poise makes remaining **non-Strike** spells illegal unless leftover AP === leftover MP ≥ 1 **and** last AP. Poise Hold refuses walk MP until leftover AP === leftover MP ≥ 1; spells stay legal. Axis Bite bonuses a target who shares a **rank or file with the caster**. Hazard Cut bonuses a target on a **painted** hazard (world lava that is not painted does not count). Bar Cross simultaneously writes leftover AP↔MP across two bodies. Brick Nudge pushes an adjacent **barrier** 1 away — skip if `findPath` after the hypothetical push would not reach an exit.
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 15 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-POISE-01 / ENC-SPELL-33 / ENC-ELITE-32 (mend skin) | leftover AP === leftover MP **and leftover AP ≥ 1** on **both** bodies **or** occupancy dest for Poise Step | Convert to ENC-GAUNT-01 (queued day-16) without claiming Poise Mend |
| ENC-TIED-01 / ENC-ELITE-32 (sting skin) | leftover AP === leftover MP ≥ 1 poke **or** leftover-tied AP steal | Convert to ENC-BARE-01 (queued day-16) without claiming Poise / Tied |
| ENC-KNIGHT-01 / ENC-SPELL-34 | next-walk dest (2,1) **or** next-spell exact Chebyshev 4 | Convert to ENC-EVEN-02 or ENC-TRI-01 (queued day-16) without claiming Knight / Quad |
| ENC-PIT-02 | eighth `applyAttract` dest (pit) **or** caster-axis bite | Convert to ENC-WAKE-01 or ENC-LONE-02 (queued day-16) without claiming Pit Reel |
| ENC-GATE-04 | leftover-AP===MP≥1 occupy detonate **and** walk-on 0 **or** `summonAI === "poisepost"` | Convert to ENC-GATE-03 (queued day-16) without claiming Poise Gate |
| ENC-SPENT-02 | leftover-AP ≥ 1 miss **or** leftover-AP ≥ 3 poke | Convert to ENC-ALMS-01 or ENC-GLYPH-01 (queued day-16) without claiming Spent / Full Sting |
| ENC-RIME-02 | 1-tile rime-tax-as-floor | Convert to ENC-GLYPH-01 (queued day-16) without claiming Rime Skip |
| ENC-SNAP-01 | overwatch snap steals walker leftover AP | Convert to ENC-ALMS-01 (queued day-16) without claiming Watch Sip |
| ENC-SHUNT-01 | force-move landing consume **or** `forcedMovedThisTurn` writer | Convert to ENC-WAKE-01 (queued day-16) without claiming Shove Mark |
| ENC-HOLLOW-01 | target leftover both 0 heal **or** remaining-CD map trade | Convert to ENC-PAIR-04 (queued day-16) without claiming Hollow Gift |
| ENC-CROSS-01 | simultaneous leftover AP↔MP cross **or** Dual Keep leftover as leftover | Convert to ENC-READY-01 leftover without claiming Bar Cross |
| ENC-DEBT-02 | `struckThisTurn` at turn end **or** Struck-last-turn walk tax | Convert to ENC-DEBT-01 (queued day-16) without claiming Strike Debt |
| ENC-HOLD-06 / ENC-RARE-17 | walk refuse until leftover AP === leftover MP ≥ 1 **or** tools-until tied ≥ 1 **and** last AP | Convert to ENC-HOLD-05 (queued day-16) without claiming Poise Hold |
| ENC-SLAB-01 | walk-block LoS-open **or** 1-AP adjacent 90° pivot | Convert to ENC-CURTAIN-01 (queued day-16) without claiming Pivot Slab |
| ENC-HURT-01 | wall→floor after player end-turn with current HP strictly below 50% of max | Convert to ENC-DUMP-01 (queued day-16) without claiming Hurt |
| ENC-LEAVE-01 | occupancy-walk **leave** tax | Convert to ENC-RUNE-01 (queued day-16) without claiming Stride Plate |
| ENC-SPARE-01 | pad swap only if remaining AP ≥ 1 | Convert to ENC-EMPTY-02 (queued day-16) without claiming Spare Step |
| ENC-PROT-17 | Hurt Font heal only if current HP strictly below 50% of max | Convert to ENC-PROT-16 (queued day-16, Empty) without claiming Hurt |
| ENC-PRIO-19 | one-cast if the player ends a turn sharing **neither** rank nor file while they live | Convert to ENC-PRIO-18 (queued day-16) without claiming Diag Tutor |
| ENC-AMBUSH-17 | elite appears only while the player shares **neither** the post’s row nor column | Convert to ENC-AMBUSH-16 (queued day-16, on-axis) without claiming Diag |
| ENC-SURV-33 | end-of-turn tax if remaining AP ≥ 1 | Convert to ENC-SURV-31 (queued day-16) without claiming Spare Draft |
| ENC-GUARD-01 | first elite cannot spend MP on walks until second dies **or** player ends Chebyshev ≥ 4 from both | Convert to ENC-SHEATH-01 (queued day-16) without claiming Guard File |
| ENC-LONE-03 | leftover MP **exactly 1** poke **or** painted-hazard cut | Convert to ENC-LONE-02 (queued day-16) without claiming Lone Gait |
| ENC-RUSH-63…66 | Table O bosses + Caliga/Cista/Plaster/Tabula objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Poise / Knight / Pit / Spent primer + inserts)

Standard chain (maxDepth 4 or 5):

```
teach mechanic
  → reinforce
  → combine
  → pressure
  → choice / rest
  → mastery
  → boss
```

| Beat | Depth hint | Job | Day-17 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (spent-seam hop, tied-≥1 heal, lean cinder) | ENC-TEACH-17, ENC-SPELL-33, ENC-HAZ-33 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-18, ENC-AMBUSH-17, ENC-SPELL-34 |
| Combine | 2–3 | Two taught verbs | ENC-POISE-01, ENC-TIED-01, ENC-KNIGHT-01, ENC-HAZ-34, ENC-SLAB-01, ENC-GATE-04 |
| Pressure | 3 | Clock, spare draft, pull-to-pit, or leftover-AP miss | ENC-SURV-33, ENC-PROT-17, ENC-PIT-02, ENC-SNAP-01, ENC-PRIO-19, ENC-GUARD-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-17, ENC-BRANCH-17, ENC-TREAS-17, ENC-BANK-01, ENC-HOUR-01, ENC-SPARE-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-32, ENC-ELITE-33, ENC-RARE-17, ENC-MAST-17, ENC-SPENT-02, ENC-RIME-02, ENC-DEBT-02, ENC-HOLD-06 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-18, ENC-BOSS-17, ENC-RUSH-63…66 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–16 remain valid. Day-17 **Poise / Knight / Pit / Spent primer** is the default for accounts that already cleared Gaunt / Even / Brick / Orth once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-17

ENCOUNTER_ID: ENC-TEACH-17  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a last-AP path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile copper-slate ribbon of `WF-HAZ-SPENT_SEAM` across the mid-band (walk tiles cost 4% max HP **only if remaining AP after that step is 0**; leftover AP is free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First 0-AP seam tax logs a teach line. Do not also apply Last Seam (ENC-TEACH-16: tax on **0 remaining MP**), Even Seam (ENC-TEACH-15: tax on **even rounds**), Odd Seam (ENC-TEACH-14: tax on **odd**), or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: stop one tile short so leftover AP remains, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is free while you still have AP, a tax on the last action stride; stopping short is the answer, not a bigger nuke.” Inverse of ENC-TEACH-16’s last-MP tax. Prepares ENC-HAZ-34 / ENC-TREAS-17 (spent-AP / off-axis devices).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-LEAN_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-33`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-33

ENCOUNTER_ID: ENC-HAZ-33  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn (`physical_attack`). Optional 1-HP player-side summon is **not** required; if the player brought one, a spent-AP body is legal bait.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the orb’s next cell on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-LEAN_CINDER` on a mid-court floor cell (at round start steps one tile toward the living unit with the **fewest remaining AP**; ties break toward the player; 5% max HP on land). Inverse of Rich Cinder (ENC-HAZ-31: hunts the **highest** HP%). Distinct from Hunting Lantern (last MP spender), Still Cinder (0-MP spender), Hurt Cinder (lowest HP%), and Orbiting Cinder (clockwise square). A floor path around the orb remains. Exit behind the bishop.  
SPECIAL_RULES: Scripted orb only. Never starts on spawn±3 or the portal. Tax via in-battle challenge HP. First land logs a teach line.  
OBJECTIVE: Clear all. Optional: keep leftover AP so the orb hunts a spent foe, or dump AP on a summon as bait.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the orb hunts the spent-AP body, not the wounded.” Distinct from ENC-HAZ-31 (rich / highest HP%).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb counts as 1 toward the hazard cap.  
REPLAYABILITY: Orb west vs east gallery.  
SCALING_BEHAVIOUR: Mid: pawn starts with leftover AP so the orb prefers the player until you dump. High: inherit one spent-seam tile on a **flank**. Never two orbs.  
STATUS: PROPOSED

---

### ENC-HAZ-34

ENCOUNTER_ID: ENC-HAZ-34  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on cardinal files. After either spends a `SpellConfig`, further occupancy-walk MP is illegal this turn if `WF-MOD-CAST_LOCK` is on. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-17 spent-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-17`) **plus** `WF-MOD-CAST_LOCK` armed (after a unit spends a `SpellConfig` this turn, further occupancy-walk MP spends are illegal; leftover MP may still pay teleport tiles). A dry detour exists. Distinct from Act Lock (ENC-HAZ-32: after **any** AP spend), File Walk (committed facing after the first step), and One Stride (at most 1 MP).  
SPECIAL_RULES: Scripted hazards only. Cast Lock does not rewrite damage. Attack Nearest is not a spell. Teleport tiles are not walks.  
OBJECTIVE: Clear all. Intended: walk first, then cast; stop one tile short of the seam so leftover AP remains.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Combine last-AP tax with a cast-then-no-walk lock so “Frost then dash across” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: Walk-then-cast remains usable; seam is not a wall; desturn never isolates the exit.  
REPLAYABILITY: Facing N-S vs E-W.  
SCALING_BEHAVIOUR: High: enable Poise Sting. Peak: add `WF-ENV-SPARE_DRAFT` so ending with leftover AP is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-33

ENCOUNTER_ID: ENC-SPELL-33  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-POISE-STEP/SOLO-MEND` fallback — 1× `poise_mender` queen (`spell-poise-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Poise Step off until band 1 honesty.  
AI_REQUIREMENTS: Mender Poise-Mends only if **caster and target** leftover AP === leftover MP **and leftover AP ≥ 1** **and** missing HP ≥ 8; else Shields. Pawn greedy. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Poise Mend (8 paid on four leftover-tied-≥1 flags) can drop `spell-poise-mend` if missing. Do **not** grant `spell-gaunt-mend` or Hollow Gift. If already owned, glyph is `starter-shield`.  
MAP_REQUIREMENTS: Open court, two pillars, optional glyph tile (`discoverSpellId: spell-poise-mend`). No extra modifiers.  
SPECIAL_RULES: If the player already owns Poise Mend, convert to ENC-POISE-01. Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Honesty: missing leftover-equality writer → ENC-SPELL-31 leftover without claiming Poise. Band 0 → show `FSN-GAUNT-STEP`. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire.  
OBJECTIVE: Defeat both. Optional: pick up the glyph before the last kill.  
FAILURE_CONDITION: Player death. Glyph despawns unused (still a win).  
REWARD: Standard + optional grant of `spell-poise-mend` to the spellbook. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “four leftover-tied-≥1 flags cash 8; one broken equality on one body is 0 HP.” Distinct from ENC-SPELL-31 (leftover-**both 0**).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Glyph is floor, not a portal.  
REPLAYABILITY: Glyph skipped if owned. Pawn vs knight chassis at mid.  
SCALING_BEHAVIOUR: Mid: enable Poise Step on a second queen (promote to ENC-POISE-01). Never Inferno on the mender.  
STATUS: PROPOSED

---

### ENC-SPELL-34

ENCOUNTER_ID: ENC-SPELL-34  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-KNIGHT-QUAD/SOLO-STRIDE` fallback — 1× `knight_warder` pawn or knight (`spell-knight-stride` + `physical_attack`) + 1× bishop (`starter-frost` only). Quad Oath off until band 1 honesty.  
AI_REQUIREMENTS: Warder skips if the player has 0 MP or no legal (2,1) floor. Bishop kites. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Knight Stride ((2,1) dest lock) can drop `spell-knight-stride` if missing. If already owned, glyph is `starter-frost`. Extra room `knight_gallery` is **not** this family.  
MAP_REQUIREMENTS: Open court with room to stand at knight-move dests. Optional glyph (`discoverSpellId: spell-knight-stride`).  
SPECIAL_RULES: If the player already owns Knight Stride, convert to ENC-KNIGHT-01. Honesty: missing (2,1) dest filter → ENC-SPELL-32 leftover without claiming Knight. Band 0 → show `FSN-EVEN-ORTH`. Cardinal 2-steps and diagonal 1-steps are illegal walks. Stand / Swap / forced-move still answer.  
OBJECTIVE: Defeat both. Optional: pick up the glyph. Intended: stand, Swap, or take a legal L-step.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional grant of `spell-knight-stride`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the next walk is an L, not a cardinal.” Distinct from ENC-SPELL-32 (even-Chebyshev miss + orthogonal-only).  
SOLVABILITY_REQUIREMENTS: At least one legal (2,1) floor dest from the player’s start. Two walk-offs that are stand / Swap.  
REPLAYABILITY: Warder chassis pawn vs knight.  
SCALING_BEHAVIOUR: Mid: enable Quad Oath (promote to ENC-KNIGHT-01). Never pack Orth Stride on this PAIR.  
STATUS: PROPOSED

---

### ENC-POISE-01

ENCOUNTER_ID: ENC-POISE-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-POISE-STEP` — 1× `poise_mender` queen (`spell-poise-mend` + `starter-shield`) + 1× `poise_stepper` queen without heal (`spell-poise-step` + `physical_attack`). No Gaunt / Hollow / Dry / Still / Heave / Both / Bar / Gift Mend on PAIR. No Gaunt / Parched / Home / Heave / Ally Step / Cover on PAIR.  
AI_REQUIREMENTS: Mender healer; skip if leftover AP ≠ leftover MP **or** leftover AP = 0. Stepper protector; skip if ally leftover AP ≠ leftover MP or leftover AP = 0 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Poise Mend or a legal Poise Step can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Poise Mend: 8 HP iff **caster and target** leftover AP === leftover MP **and leftover AP ≥ 1**. One broken equality is 0 HP. Poise Step is not ungated Home Step and not Gaunt Step. Band 0 → show `FSN-GAUNT-STEP`. Honesty reroll → ENC-GAUNT-01. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire.  
OBJECTIVE: Defeat both. Intended: spend 1 leftover AP **or** 1 leftover MP on one body; occupy every Chebyshev-1 of the Mender.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-tied discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Four-flag tied-≥1 healer + four-flag joiner. Distinct from ENC-GAUNT-01 (leftover-**both 0**) and ENC-HEAVE-01 (both **force-moved**).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal Step dest. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Mender north vs east. Variant `FSN-POISE-STEP/E-STEP`.  
SCALING_BEHAVIOUR: High: promote to `FSN-POISE-QUIET` (add cover). Peak: inherit one spent-seam gallery. Never `titans_vigor`. Never pack Gaunt Mend on this PAIR.  
STATUS: PROPOSED

---

### ENC-TIED-01

ENCOUNTER_ID: ENC-TIED-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-POISE-SIP` — 1× `poise_stinger` pawn (`physical_attack` + `spell-poise-sting`) + 1× `poise_sipper` pawn (`starter-frost` + `spell-poise-sip`). No Gaunt / Lean / Damp / Ready / Full / Lone / Pair Gait on PAIR. No Bare / Parched / Gait / Drift / Watch Sip on PAIR.  
AI_REQUIREMENTS: Stinger lurks at 3 and commits when leftover AP === leftover MP ≥ 1 **or** HP% ≤ 40. Sipper Sips if leftover AP === leftover MP ≥ 1; else Frosts. Sip then Sting on the **same** AP bar is banned — Sip **breaks** the tie. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Poise Sting or Poise Sip can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Stinger needs a flank path that is not the only exit. Sipper needs a retreat tile. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Poise Sting: 10 + 8 iff **target** leftover AP === leftover MP ≥ 1. `0 = 0` is Gaunt Sting’s window. Poise Sip: steal 1 leftover AP iff leftover AP === leftover MP ≥ 1. Cap leftover-AP steal at −1 with one Slow source. Band 0 → show `FSN-GAUNT-SIP`. Honesty reroll → ENC-BARE-01.  
OBJECTIVE: Defeat both. Intended: spend 1 leftover AP **or** MP, dump both pools to 0, or kill the Stinger and eat Frost.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + tied-window discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Tied-≥1 poke + tied leftover-AP steal. Distinct from ENC-BARE-01 (leftover-**pair 0** poke + leftover-MP=0 AP steal).  
SOLVABILITY_REQUIREMENTS: Flank path reachable; two-unit occupancy leaves an exit.  
REPLAYABILITY: Stinger west vs east. Variant `FSN-POISE-SIP/E-STING`.  
SCALING_BEHAVIOUR: High: inherit spent-seam on a gallery. Never pack Poise Hold on this PAIR.  
STATUS: PROPOSED

---

### ENC-KNIGHT-01

ENCOUNTER_ID: ENC-KNIGHT-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-KNIGHT-QUAD` — 1× `knight_warder` knight (`starter-frost` + `spell-knight-stride`) + 1× `quad_oather` bishop (`starter-frost` + `spell-quad-oath`). No Orth / Diag / Inch Warder on PAIR. No Tri / Mid / Long / Near Oath on PAIR. Extra doors `knight_gallery` / `quad_nave` are **not** these families.  
AI_REQUIREMENTS: Warder skips if player MP = 0 or no legal (2,1) floor. Oather skips if they have no ranged id; next spell exact Chebyshev 4; Strike stays legal. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Knight Stride or Quad Oath can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena` with legal L-step dests **and** a tile at Chebyshev 4 from Oather start. Reject a 1-tile closet (forced illegal walk).  
SPECIAL_RULES: Family lottery **off**. Knight Stride: next occupancy-walk dest must be `|dx|,|dy|` = 2,1 or 1,2. Illegal walk spends 0 MP. Quad Oath: next **non-Strike** spell must be Chebyshev exactly 4; other ranges fizzle after AP. Band 0 → show `FSN-EVEN-ORTH`. Honesty reroll → ENC-EVEN-02.  
OBJECTIVE: Defeat both. Intended: stand / Swap / take a legal L; Strike from 1, 2, or 3 (oath does not tax Strike).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + walk-shape discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: L-step walk lock + exact-4 spell oath. Distinct from ENC-EVEN-02 (even miss + orthogonal-only) and ENC-TRI-01 (orthogonal + exact-3).  
SOLVABILITY_REQUIREMENTS: At least one legal L dest; tiles at 1, 2, 3, **and** 4 from Oather; two walk-offs.  
REPLAYABILITY: Warder north vs east.  
SCALING_BEHAVIOUR: High: inherit spent-seam on a **gallery**, never on the only L dest. Never pack Must Span on this PAIR.  
STATUS: PROPOSED

---

### ENC-PIT-02

ENCOUNTER_ID: ENC-PIT-02  
TYPE: elite-adjacent / formation / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-PIT-AXIS` — 1× `pit_reeler` rook (`starter-frost` + `spell-pit-reel`) + 1× `axis_biter` pawn (`physical_attack` + `spell-axis-bite`). No Brick / Void / Cinder / Paint / Foe / Ally / File Reel on PAIR. No Foe / Lone / Side Bite / Axis Cut on PAIR. Extra door `pit_aisle` is **not** this family. Distinct from queued day-5 `ENC-PIT-01` (LoS-open walk-block — do not reuse that id).  
AI_REQUIREMENTS: Reeler skips if no pit in Chebyshev 6; dest scoring must not use a world portal; never turn-1 pull onto the pit tile. Biter skips rider off-axis; Dummy Post is not a pet. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Pit Reel or Axis Bite can drop that id if missing.  
MAP_REQUIREMENTS: `arena` or `asymmetric` with **one pit in Chebyshev 6** plus open floor the other way. Reject `corridorMaze`. No Void Rift as a legal landing. No lava dest. Player keeps ≥ 1 walk-off that is not the pit. If the map has no pit in Chebyshev 6 of a legal floor, **reroll this id**.  
SPECIAL_RULES: Family lottery **off**. Pit Reel: pull 1 toward the nearest **pit**. Empty / blocked / world-portal dest: fizzle that step (AP spent). Axis Bite: 10 + 8 if target shares rank **or** file with the **caster**. Honesty reroll → ENC-WAKE-01.  
OBJECTIVE: Defeat both. Intended: step off the Reeler’s file before the Bite; occupy the only legal landing.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + pit-dest discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Eighth attract dest (pit) + caster-axis bite. Distinct from ENC-WAKE-01 (barrier pull + start-turn occupy) and ENC-LONE-02 (isolation + pet-axis).  
SOLVABILITY_REQUIREMENTS: Pit is not a cut-vertex. Walk-off remains after a legal reel. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Pit west vs east gallery. Variant `FSN-PIT-AXIS/RIME` only after ENC-RIME-02.  
SCALING_BEHAVIOUR: High: inherit spent-seam on a **different** gallery. Never two reel dest flavors.  
STATUS: PROPOSED

---

### ENC-GATE-04

ENCOUNTER_ID: ENC-GATE-04  
TYPE: elite-adjacent / formation / protection  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-POISE-GATE` — 1× `poise_prelate` pawn (`physical_attack` + `spell-poise-post`, `isSummoner` for poisepost only) + 1× `poise_siller` bishop (`starter-frost` + `spell-poise-sill`). Post and sill paint **different** tiles. No Gaunt / Dummy / Drift / Lean / Dwell / Ingress / Wake / Bait / Nine Prelate on PAIR.  
AI_REQUIREMENTS: Post `summonAI: "poisepost"`, remaining cap ≥ 1. Skip if leftover already 0/0 or unequal. Siller skip if occupant leftover already 0/0. Hostiles start ≥ 4 apart. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Poise Post or Poise Sill can drop that id if missing.  
MAP_REQUIREMENTS: `openField` with two painted cells that are not spawn, portal, or the only aisle. Walk-on both cells is **safe**.  
SPECIAL_RULES: Family lottery **off**. Poise Post detonates on end-turn occupy **and leftover AP === leftover MP ≥ 1**. Walk-on / dump-a-pool / chip-safe. Poise Sill taxes start-turn occupy **and leftover AP === leftover MP ≥ 1**; paint stays. Honesty: missing `summonAI === "poisepost"` → ENC-GATE-03. Hold Nine Plug.  
OBJECTIVE: Defeat both. Intended: dump one leftover pool before ending on the post; start the turn already untied on the sill.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Tied-≥1 post + tied-≥1 start-turn sill. Distinct from ENC-GATE-03 (leftover-**both 0** post).  
SOLVABILITY_REQUIREMENTS: Both paints floor. Two walk-offs. Post counts as 1 toward cap.  
REPLAYABILITY: Post north vs east of the sill.  
SCALING_BEHAVIOUR: High: inherit lean cinder on a gallery. Never two posts.  
STATUS: PROPOSED

---

### ENC-SPENT-02

ENCOUNTER_ID: ENC-SPENT-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SPENT-FULL` — 1× `spent_plater` rook (`starter-shield` + `spell-spent-plate`) + 1× `full_stinger` pawn (`physical_attack` + `spell-full-sting`). No Gait / Own / Off Plate / Poise Hood on PAIR. Distinct from queued day-14 `ENC-SPENT-01` (Spent Plate leftover-AP overlay — do not reuse that id).  
AI_REQUIREMENTS: Plater Plates if leftover AP ≥ 1, else Shields. Stinger holds until leftover AP ≥ 3 **or** HP% ≤ 40. Never both on turn 1 against a full-HP player who has not acted. Hostiles start ≥ 4 apart. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Spent Plate or Full Sting can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Stinger needs a straight walk; Plater needs a doorway that is not the only exit. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Spent Plate: next hit 0 while leftover AP ≥ 1; leftover AP 0 at impact **lands**. Full Sting: leftover AP ≥ 3 → bonus. MP unconstrained. Honesty reroll → ENC-ALMS-01.  
OBJECTIVE: Defeat both. Intended: drain leftover AP to 0 before the poke; do not Dual Keep 3 into melee.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-AP discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-AP≥1 miss + leftover-AP≥3 poke. Distinct from ENC-ALMS-01 (leftover-**MP** miss) and ENC-GLYPH-01 (leftover-**MP ≥ 3** +RES).  
SOLVABILITY_REQUIREMENTS: Two walk-offs. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Plater west vs east doorway. Variant `FSN-SPENT-FULL/PLATE` after this BASE.  
SCALING_BEHAVIOUR: High: inherit spent-seam. Never pack Gait Plate on this CELL.  
STATUS: PROPOSED

---

### ENC-RIME-02

ENCOUNTER_ID: ENC-RIME-02  
TYPE: hazard / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-RIME-FILE` — 1× `rime_skipper` knight (`physical_attack` + `spell-rime-skip`) + 1× `rime_mason` rook (paints **rime**, never lava). Distinct from queued day-5 `ENC-RIME-01` (enter-tax file — do not reuse that id).  
AI_REQUIREMENTS: Skipper skips if the next walk is not a 1-step across rime. Mason paints a 3–4 tile rime ribbon, never on spawn±3 or the portal. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Rime Skip can drop `spell-rime-skip` if missing.  
MAP_REQUIREMENTS: `openField` with a dry detour of ≥ 1 tile. Rime ribbon counts toward `MAX_HAZARD_TILES`. Lava / spikes / pits / cinder / glyph still tick if the skipper is forced onto them.  
SPECIAL_RULES: Family lottery **off**. Rime Skip: next **1-tile** walk treats rime leave-tax as floor. Length ≥ 2 pays. Honesty reroll → ENC-GLYPH-01.  
OBJECTIVE: Clear all. Intended: take the dry detour, or hop 1 tile of rime then step off.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: 1-tile rime-tax skip vs a painted ribbon. Distinct from ENC-GLYPH-01 (glyph-tax skip).  
SOLVABILITY_REQUIREMENTS: Dry detour reaches both. Ribbon never walls a corridor.  
REPLAYABILITY: Ribbon N-S vs E-W.  
SCALING_BEHAVIOUR: High: inherit spent-seam on a **different** gallery. Never two skip flavors.  
STATUS: PROPOSED

---

### ENC-SNAP-01

ENCOUNTER_ID: ENC-SNAP-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-WATCH-SIP` — 1× `watch_sipper` bishop (`starter-frost` + `spell-watch-sip`) + 1× pawn charger. No Watch Alms / Watch Lend / Watch Feer / Watch Mute / Poise Sip on PAIR.  
AI_REQUIREMENTS: Sipper skips if leftover AP = 0 **or** no overwatch is armed. Snap still deals. Pawn greedy. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Watch Sip can drop `spell-watch-sip` if missing.  
MAP_REQUIREMENTS: `openField` with a painted overwatch file. Exit not on that file.  
SPECIAL_RULES: Family lottery **off**. Watch Sip: overwatch snap **steals** the walker’s leftover AP (inverse of ENC-ALMS-01’s walker **grant**). Cap leftover-AP steal at −1. Honesty reroll → ENC-ALMS-01.  
OBJECTIVE: Defeat both. Intended: dump leftover AP before crossing the file, or bait the pawn onto the snap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Overwatch that **takes** leftover AP. Distinct from ENC-ALMS-01 (snap **gives** walker +1 AP).  
SOLVABILITY_REQUIREMENTS: Path that never crosses the file. Two walk-offs.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: High: inherit spare draft so holding leftover AP is a second tax. Never two snap engines.  
STATUS: PROPOSED

---

### ENC-SHUNT-01

ENCOUNTER_ID: ENC-SHUNT-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SHOVE-DRIFT` — 1× `shove_marker` bishop (`starter-frost` + `spell-shove-mark`) + 1× `ROLE-PUSHER` pawn (`physical_attack` + one live push). Extra room `shunt_pulpit` is **not** this family.  
AI_REQUIREMENTS: Marker skips if no force ally. Pusher never shoves onto a portal / pit / lava. Walk-on the mark is **free**. Soph 2–3. Until `forcedMovedThisTurn` exists, this sheet must not ship.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Shove Mark can drop `spell-shove-mark` if missing.  
MAP_REQUIREMENTS: `openField` with a painted mark cell that is not the only aisle. Player keeps ≥ 1 walk-off after a legal shove dest.  
SPECIAL_RULES: Family lottery **off**. Shove Mark: 0 on cast; **force-move landing** detonates and consumes. Walk / Swap / Poise Step / Gaunt Step / Home Step do **not** set the flag. Extra door is not this family. Honesty reroll → ENC-WAKE-01. Band 0 → show `FSN-HOOK-SLAM`.  
OBJECTIVE: Defeat both. Intended: walk onto the mark (safe), refuse the shove, or occupy the only landing.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Force-landing consume, not start-turn occupy. Distinct from ENC-WAKE-01 (start-turn occupy any leftover).  
SOLVABILITY_REQUIREMENTS: Shove dest free floor, not lava / pit / portal. Two walk-offs.  
REPLAYABILITY: Mark west vs east.  
SCALING_BEHAVIOUR: High: inherit lean cinder so a shoved body may land near the orb. Never two force-landing paints.  
STATUS: PROPOSED

---

### ENC-WAVE-18

ENCOUNTER_ID: ENC-WAVE-18  
TYPE: waves  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Wave 1: 3× pawn (`physical_attack`). Wave 2: `FSN-POISE-STEP` fallback (mender + stepper) **or** `FSN-POISE-SIP` if Poise Mend already owned. Wave 3: 1× rook (`physical_attack`) + leftover pawn. Never more than 4 living hostiles.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 uses the PAIR AI (mender skip if leftover AP ≠ leftover MP **or** leftover AP = 0; stinger commits on leftover AP === leftover MP ≥ 1). Wave 3 rook camps the choke via `chokepointCamp` only if AI tier ≥ 3.  
SPELL_DISCOVERY_OPPORTUNITIES: Optional overlay: a dead mender drops `spell-poise-mend` if ENC-SPELL-33 was skipped this chain.  
MAP_REQUIREMENTS: One choke (2-tile corridor) between spawn side and a backline alcove. `waveSpawnCells` marked. Exit behind the alcove. Optional spent-seam ribbon on the **gallery**, never in the choke.  
SPECIAL_RULES: Portal stays locked until wave 3 is clear. Next wave spawns at the start of the enemy phase after the previous wave is dead, on `waveSpawnCells` only (must be free floor). If a cell is occupied, spill to the nearest free reachable floor. Soft fail: if a wave cannot place any unit, skip that wave and log it. Honesty: missing leftover-equality → wave 2 is ENC-WAVE-17 leftover without claiming Poise.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player HP ≤ 0.  
REWARD: Victory XP counts all three waves’ defeated levels. Depth Doka. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Cadence — spend on wave 1, break the Dual Keep tie before the four-flag healer, then break the choke.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Choke must not isolate the player from the exit after walls finalize. Cap living hostiles so `ENEMY_SUMMON_CAP` is not starved later.  
REPLAYABILITY: Wave 2 rotates `FSN-POISE-STEP` / `FSN-POISE-SIP` / `FSN-KNIGHT-QUAD` by seed. Choke side flips.  
SCALING_BEHAVIOUR: Mid: wave 2 gains the named kit. High: wave 3 rook learns `spell-iron-skin`. Peak: add a 2-pawn “echo” wave only if the player’s kill time on wave 1 was under 2 turns (skill-scaled, not level-scaled).  
STATUS: PROPOSED

---

### ENC-AMBUSH-17

ENCOUNTER_ID: ENC-AMBUSH-17  
TYPE: ambushes  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Overworld / exploration: `WF-ELT-DIAG_PICKET` — one same-tier elite occupies a painted post **only while the player shares neither that cell’s row nor column**. Step onto the rank or file and the post is empty floor (exploration: they leave, no purse). Dungeon / boss rush: they stand from map start — required for map-clear. Inverse of Orth Picket (ENC-AMBUSH-16). Distinct from Near Picket (≤3), Mid Picket (Chebyshev 4–5), Far Picket (≥6), and Spell Picket (after a cast).  
AI_REQUIREMENTS: Elite uses live kit for the piece. No lookahead until engaged. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: elite may carry one `usableByEnemy` extra that ENC-PRIO-19 can teach.  
MAP_REQUIREMENTS: Painted post is floor. Exit reachable without touching. Counts as 1 enemy. Rank/file lines painted.  
SPECIAL_RULES: Appearance keys off sharing **neither** the post’s row nor column with the player. World contact starts a normal battle. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-AMBUSH-16.  
OBJECTIVE: Fight them (dungeon) or walk onto the rank/file and pass (exploration).  
FAILURE_CONDITION: Player death in the fight. Walking past is not a fail.  
REWARD: Hard purse via `applyRewards` on victory. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “the picket only exists **off** the rank or file.” Inverse of ENC-AMBUSH-16 (on-axis).  
SOLVABILITY_REQUIREMENTS: Post is floor. Exit reachable without touching. In a run they are present from the start and reachable.  
REPLAYABILITY: Post north file vs east rank.  
SCALING_BEHAVIOUR: High: elite is Poise Hood so Dual Keep 1/1 on the diagonal is a miss — break the tie then Strike. Never two pickets.  
STATUS: PROPOSED

---

### ENC-REINF-17

ENCOUNTER_ID: ENC-REINF-17  
TYPE: reinforcements / waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: 2× pawn. Wave 2 (reinforcement): 1× bishop (`starter-frost`) spawns on `waveSpawnCells` when the first pawn dies — **not** a Guard File (that is ENC-GUARD-01). Distinct from ENC-REINF-16 (echo bishop after a kill).  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 bishop kites. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Alcove `waveSpawnCells` behind a 2-tile choke. Portal locked until both waves clear.  
SPECIAL_RULES: Reinforcement at the start of the enemy phase after the trigger kill. Occupied cell spills to nearest free reachable floor. `holdPortalLocked` until wave 2 is down.  
OBJECTIVE: Clear both waves.  
FAILURE_CONDITION: Player death. Soft fail: if wave 2 cannot place, skip and log.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce after a kill so bursting the first pawn is a choice, not always correct. Distinct from ENC-GUARD-01 (rooted MP lock until range ≥ 4).  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4.  
REPLAYABILITY: Bishop vs queen (frost only) by seed.  
SCALING_BEHAVIOUR: High: wave 2 is Poise Hood. Peak: inherit spent-seam on the gallery.  
STATUS: PROPOSED

---

### ENC-SLAB-01

ENCOUNTER_ID: ENC-SLAB-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-TER-PIVOT_SLAB` + 1× pawn on the player’s side.  
AI_REQUIREMENTS: Bishop kites behind the slab (walk-block, LoS **open**). Pawn charges around it. No smash AI.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One carved slab occupies a cell: it **blocks walk** but **not** line of sight. Adjacent 1 AP (no spell) pivots it 90° onto one empty cardinal neighbor (origin becomes floor; dest becomes the slab). Adjacent 2 AP smashes it to clear floor in place. Distinct from Hush Curtain (ENC-CURTAIN-01: walk-through LoS-block), Slide Screen (1 AP relocates a walkable LoS-block), Fold Wall (blocks walk+LoS), and Crumble Pillar (smash only). Never on spawn/portals.  
SPECIAL_RULES: Pivot and smash are AP occupancy actions, not spells. No damage. Skip if `evaluateSolvability` would fail with the slab intact. Pivot dest must be empty floor, never spawn±3 or a portal. Honesty reroll → ENC-CURTAIN-01.  
OBJECTIVE: Clear all. Intended: spend 1 AP to swing a shortcut, spend 2 AP to smash, linear-shot through open LoS, or take the bypass.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “walk-block LoS-open; pivot is 1 AP, smash is 2 AP.” Distinct from ENC-CURTAIN-01 (walk-through LoS-block).  
SOLVABILITY_REQUIREMENTS: Must not be a cut-vertex. Map solvable with the slab intact. Bypass exists.  
REPLAYABILITY: Slab west vs east aisle.  
SCALING_BEHAVIOUR: High: bishop gains `starter-poison`. Never two slabs on the only aisle.  
STATUS: PROPOSED

---

### ENC-LEAVE-01

ENCOUNTER_ID: ENC-LEAVE-01  
TYPE: hazard / trap  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop may occupy the plate and Frost (leave does not tax a spell). Pawn walking off it pays.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One visible `WF-TRP-STRIDE_PLATE` (stepping on it is free; the first occupancy-walk that **leaves** it this map costs that walker 8% max HP once; then the plate becomes floor). Distinct from Glyph Plate (enter tax), Cast Plate (ENC-RUNE-01: first spell from the plate), Leave Bell, and Dash Plate. Never hidden. Never on spawn/portals.  
SPECIAL_RULES: Trigger keys off an occupancy-walk MP spend that exits the plate. SpellConfig casts, Attack Nearest, and summon kits do not trigger it. Challenge HP. Honesty: missing leave-walk trigger → skip the plate, keep the fight.  
OBJECTIVE: Clear all. Optional: end the turn on it; teleport off; send a summon to spend the leave; shove a foe onto it then wait for their walk.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the plate taxes the first **leave**, not the step and not the spell.” Distinct from ENC-RUNE-01 (first spell from the cell).  
SOLVABILITY_REQUIREMENTS: Walkable before and after. Optional.  
REPLAYABILITY: Plate mid vs flank.  
SCALING_BEHAVIOUR: High: inherit spent-seam on a **different** gallery. Never two plates.  
STATUS: PROPOSED

---

### ENC-HURT-01

ENCOUNTER_ID: ENC-HURT-01  
TYPE: map structure / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn on the long path. Short-path corridor cell starts as a wall (`WF-OBS-HURT_SILL`).  
AI_REQUIREMENTS: Both take the long path. Neither pathfinds through the sill until it is floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Place only when a second spawn→portal route already exists. Evaluate solvability as if the sill were already a wall. Never the only exit. Distinct from Spent Sill (ENC-DUMP-01: end-turn 0 AP), Retreat Sill (end-turn ≥5 away), Wound Step (1 MP skip below 50%), and Latch Sill (end-turn adjacent).  
SPECIAL_RULES: Wall occupancy until a player end-of-turn with current HP **strictly below 50% of max**. Then floor for the rest of the map. No damage. Honesty reroll → ENC-DUMP-01.  
OBJECTIVE: Clear all. Optional: take a wound and end the turn to open the short path.  
FAILURE_CONDITION: Player death. Leaving the sill closed is not a fail.  
REWARD: Standard. Overlay `under_50_damage` (pairs with staying healthy on the long path).  
TACTICAL_PURPOSE: Teach “below-half end-turn opens the short path.” Distinct from ENC-DUMP-01 (empty-AP end-turn).  
SOLVABILITY_REQUIREMENTS: Long path already spawn→portal. Sill never the only exit.  
REPLAYABILITY: Sill north vs south of the long path.  
SCALING_BEHAVIOUR: High: inherit Cast Lock so a wounded Frost also forbids a leftover walk.  
STATUS: PROPOSED

---

### ENC-SPARE-01

ENCOUNTER_ID: ENC-SPARE-01  
TYPE: movement objectives / teleport pads  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop + 1× pawn. Pads are optional.  
AI_REQUIREMENTS: Neither is required to use the pads. Bishop may keep leftover AP then pad.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Two linked brass-cyan pads (`WF-TEL-SPARE_STEP`). Entering one for 1 MP exits the other **only if remaining AP is at least 1**. Otherwise the MP is not spent and you stay. If the exit is occupied, the travelers swap. Inverse of Empty Step (ENC-EMPTY-02: 0 remaining AP). Distinct from Full Step (≥80% HP), Wound Step (below 50% HP), and Clear Step (empty dest). Both on floor, not on spawn/portals. The map is solvable without using them.  
SPECIAL_RULES: 1 MP from the unit’s current MP only on a successful leftover-AP landing. Not a teleport spell — do not key off `effectCategory`. Honesty reroll → ENC-EMPTY-02.  
OBJECTIVE: Clear all. Optional: keep leftover AP then spend 1 MP, or stand on the exit to force a swap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “pads only fire when you still have an action chip.” Inverse of ENC-EMPTY-02 (0-AP gate).  
SOLVABILITY_REQUIREMENTS: Map solvable without the pads. Occupied dest swaps.  
REPLAYABILITY: Pads N-S vs E-W.  
SCALING_BEHAVIOUR: High: inherit Spare Draft so keeping leftover AP to use the pad is a second tax.  
STATUS: PROPOSED

---

### ENC-SURV-33

ENCOUNTER_ID: ENC-SURV-33  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× bishop (`starter-frost`) starting on opposite ranks.  
AI_REQUIREMENTS: Bishops kite. No kamikaze. They dump leftover AP before ending when wounded.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: `WF-ENV-SPARE_DRAFT` armed: at the end of each combatant turn, if they still have **at least 1 remaining AP** they pay 3% max HP. Ending spent (0 AP) is shelter. Inverse of needing leftover AP (Spare Oath / Spare Step). Distinct from File Shade (ENC-SURV-31: tax if **off** a hostile’s rank/file), Gale Bite (tax for moving), and Needle Grass (end on a tile).  
SPECIAL_RULES: End-of-turn challenge HP. Remaining AP is the unit’s current AP at end of turn. Summons pay it. No skipped turns. Honesty reroll → ENC-SURV-31. Clock: 8 player turns; portal still locked until hostiles are down.  
OBJECTIVE: Survive 8 turns **or** clear both (clear wins early). Intended: dump remaining AP before ending the turn.  
FAILURE_CONDITION: Player death. Surviving 8 turns with hostiles alive still unlocks the portal only after they die — this is not a timer-unlock room.  
REWARD: Standard. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Pressure by **holding** leftover AP, not by standing off a file. Distinct from ENC-SURV-31 (tax if off-axis).  
SOLVABILITY_REQUIREMENTS: Tax is not a wall. Both bishops reachable.  
REPLAYABILITY: Bishops N-S ranks vs E-W files.  
SCALING_BEHAVIOUR: Peak: add a pawn. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-34

ENCOUNTER_ID: ENC-SURV-34  
TYPE: survival / optional wager  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× rook + 1× pawn.  
AI_REQUIREMENTS: Rook body-blocks. Pawn charges.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Open court. `WF-EVT-DIAG_HOUR` overlay: if the player ended at least one turn sharing **neither** a row nor a column with any living hostile, the next `applyRewards` uses the hard multiplier. Distinct from Close Hour (ENC-SURV-32: hard if you **plant adjacent**), Far Hour (hard if you **never** end adjacent), and Orth Picket (elite on a shared file). No blocks.  
SPECIAL_RULES: Off-axis means sharing neither row nor column with any living enemy-side combatant at player end-of-turn. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Honesty: missing off-axis-end-turn flag → room still plays as a kill fight without the wager.  
OBJECTIVE: Clear all. Optional: plant off-axis at least once for a hard purse, or hold the file and accept normal rewards.  
FAILURE_CONDITION: Player death. Never planting off-axis is not a fail.  
REWARD: Standard, or hard multiplier if the flag armed. Overlay none (the wager *is* the challenge).  
TACTICAL_PURPOSE: Opt-in off-axis plant for a purse. Inverse of ENC-SURV-32 (melee plant).  
SOLVABILITY_REQUIREMENTS: Leaving is always legal. Hostiles reachable.  
REPLAYABILITY: Rook west vs east.  
SCALING_BEHAVIOUR: High: rook learns iron-skin so leaving the file is a real hit. Never two hour overlays.  
STATUS: PROPOSED

---

### ENC-PROT-17

ENCOUNTER_ID: ENC-PROT-17  
TYPE: protection objectives  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn racing the player to `WF-ZON-HURT_FONT`. Optional player-side summon is legal to plant wounded.  
AI_REQUIREMENTS: Bishop plants on the font if already below 50% HP this turn. Pawn may shove the player off. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One cracked-copper basin (first unit to end a turn here this map heals 8% max HP **only if they are strictly below 50% of max HP**; then the tile dries). Ending here at or above 50% does nothing and does not dry it. Inverse of Full Cache (≥90% to open). Distinct from Empty Font (ENC-EMPTY-01 / ENC-PROT-16: 0 remaining AP), Labor Font (2+ AP spent), and Alone Font (isolation). Inherit spent-seam on a **gallery** (`inheritHazardsFrom: ENC-TEACH-17`) so dumping AP to reach it is a second question.  
SPECIAL_RULES: Zone tick, not a spell. Player HP persist via `saveBattleStats` on the progress lock. Null Field does not strip it. Honesty reroll → ENC-PROT-16.  
OBJECTIVE: Clear all. Optional: drink after you are already wounded; deny the enemy the basin.  
FAILURE_CONDITION: Player death. Enemy drinking is not a fail.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Protect / contest a below-half heal under a last-AP tax. Combine teach + zone.  
SOLVABILITY_REQUIREMENTS: Two approaches. Font not on the only aisle. Seam not a wall. Font optional.  
REPLAYABILITY: Font alcove flips.  
SCALING_BEHAVIOUR: High: pawn starts adjacent to the font. Never a third body.  
STATUS: PROPOSED

---

### ENC-PRIO-19

ENCOUNTER_ID: ENC-PRIO-19  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-DIAG_TUTOR` — one same-tier enemy (medium) carries 1 extra `usableByEnemy` spell (prefer `starter-frost` if the player lacks it; else `spell-poise-hood` if missing; else `starter-poison`). Plus 1× pawn decoy.  
AI_REQUIREMENTS: Tutor kites **off** a rank/file when they want to deny the teach. Pawn greedy. No lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn sharing **neither** a row nor a column with the tutor while they still live, the player gains that spell id as a **single remaining cast** this map. Killing them before that off-axis teach grants the purse but not the one-cast. Inverse of Orth Tutor (ENC-PRIO-18). Distinct from Close Tutor (end turn adjacent), Range Tutor (end turn 4+ away), and Mark Tutor (adjacent 1 AP then LoS).  
MAP_REQUIREMENTS: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable. Rank/file lines painted.  
SPECIAL_RULES: One-cast does not call `upgradeSpell` and does not persist `spellLevel*` arrays. Honesty reroll → ENC-PRIO-18.  
OBJECTIVE: Clear all. Optional: plant off-axis for the teach then leave; burst-kill if you want the purse more than the cast.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional one-cast. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Priority-target with an **off-axis** teach. Inverse of ENC-PRIO-18 (file-teach).  
SOLVABILITY_REQUIREMENTS: Tutor reachable. In a run they count as hostiles for map-clear.  
REPLAYABILITY: Extra spell rotates among missing ids.  
SCALING_BEHAVIOUR: High: tutor is Poise Hood so Dual Keep 1/1 on the diagonal is a miss — break the tie then Strike.  
STATUS: PROPOSED

---

### ENC-GUARD-01

ENCOUNTER_ID: ENC-GUARD-01  
TYPE: priority-target / elite  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-GUARD_FILE` — two extra same-tier elites share a painted file. The first (painted rooted pennant) cannot spend MP on occupancy-walks until the second is dead **OR** the player ends a turn at Chebyshev ≥ 4 from both. Distinct from Sheath File (ENC-SHEATH-01: second **AP**-locked until the first dies or you end **adjacent**), Sleeping Vanguard (both world-asleep until touch), Paired File (−20% incoming while both live), and Gap File (spacing threat).  
AI_REQUIREMENTS: Live elite uses the kit. Rooted elite is occupancy-locked until wake. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Painted file with two posts. Add enemies only up to `MAX_ENEMIES`. Skip if the roster cannot fit 2. In dungeon / boss rush they count as hostiles for map-clear.  
SPECIAL_RULES: Rooted MP lock is occupancy/turn state, not a buff spell. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-SHEATH-01.  
OBJECTIVE: Burst the free walker first, plant at range so the guard can walk, or (exploration) walk to a portal and leave.  
FAILURE_CONDITION: Player death. Leaving without engaging is legal in exploration.  
REWARD: Hard reward multiplier via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Priority-target with a rooted first. Distinct from ENC-SHEATH-01 (sheathed **second**, adjacent wake).  
SOLVABILITY_REQUIREMENTS: Both posts floor. Exit reachable. Living hostiles well under cap.  
REPLAYABILITY: Rooted pennant north vs south of the file.  
SCALING_BEHAVIOUR: High: free elite is Poise Stinger. Never three pennants.  
STATUS: PROPOSED

---

### ENC-HOLLOW-01

ENCOUNTER_ID: ENC-HOLLOW-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HOLLOW-SWAP` — 1× `hollow_gifter` queen (`spell-hollow-gift` + `starter-shield`) + 1× `cadence_swapper` bishop (`starter-frost` + `spell-cadence-swap`) + 1× `once_cantor` queen without heal (echo lock, **no** Inferno). Never PAIR Hollow Gift with Poise / Gaunt / Still / Dry / Drift / Bar Mend. Never PAIR Cadence Swap with Lag / Imprint / Grace / Floor.  
AI_REQUIREMENTS: Gifter Shields unless **target** leftover both 0 **and** missing HP ≥ 8. Swapper Swaps if they hold Inferno remaining and the caster’s map is empty; else Frosts. Once holds and echoes the dumped id. Never turn-1 map-trade a full-HP player. Hostiles start ≥ 4 apart. Two queens, opposite corners. Soph 3–4. `AI_BACKLINE_PROTECT` at 4.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Hollow Gift or Cadence Swap can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Gifter needs a retreat tile that is not the Once choke. No Time Warp. No Glass Realm.  
SPECIAL_RULES: Family lottery **off**. Hollow Gift: 8 iff **target leftover AP = 0 and leftover MP = 0**. Dual Keep leftover **blocks**. Caster leftover unconstrained. Cadence Swap: exchange remaining CD **maps**; unknown ids dropped; once/battle flags and spell levels are **not** CDs. Variant `FSN-HOLLOW-SWAP/NO-ONCE` if echo apply is not ready. Honesty reroll → ENC-PAIR-04.  
OBJECTIVE: Defeat all. Intended: keep 1 leftover AP **or** MP on yourself; Dual Keep **blocks** Gift.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Target-empty both-pools heal + remaining-CD map trade. Distinct from ENC-PAIR-04 (exact-2 walk-MP poke + target-camp heal) and ENC-GAUNT-01 (caster **and** target leftover 0).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Gifter west vs east. No-Once variant.  
SCALING_BEHAVIOUR: Peak: inherit spent-seam on a gallery. Never two last-id engines (Verse Poise stays `FSN-POISE-CHOIR`).  
STATUS: PROPOSED

---

### ENC-CROSS-01

ENCOUNTER_ID: ENC-CROSS-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CROSS-POISE` CADRE fallback — 1× `bar_crosser` bishop (`starter-frost` + `spell-bar-cross`) + 1× `poise_lender` bishop (`starter-frost` + `spell-poise-lend`) + 1× pawn. Never PAIR Bar Cross with Dual Keep / tile Swap as a two-body.  
AI_REQUIREMENTS: Crosser skips if both leftover pairs are 0/0; simultaneous four-write. Lender skips if ally leftover AP ≠ leftover MP or leftover AP = 0; +1 current AP **and** +1 current MP (**keeps** the tie). Pawn greedy. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Bar Cross or Poise Lend can drop that id if missing.  
MAP_REQUIREMENTS: `openField`. Crosser needs a tile at range 3 that is not the only exit.  
SPECIAL_RULES: Family lottery **off**. Bar Cross writes leftover AP↔MP across two bodies in one resolve. Dual Keep leftover **is** leftover. Honesty: missing four-write → ENC-READY-01 leftover without claiming Cross.  
OBJECTIVE: Defeat all. Intended: dump one pool so Cross has nothing to swap; kill the Lender before it re-ties.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover AP↔MP cross + tied-≥1 lend that **keeps** the equality. Distinct from ENC-READY-01 (leftover-pair **bank**).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Crosser north vs east.  
SCALING_BEHAVIOUR: Peak: inherit spare draft. Never two leftover-bank engines.  
STATUS: PROPOSED

---

### ENC-DEBT-02

ENCOUNTER_ID: ENC-DEBT-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-STRIKE-TAX` CADRE — 1× `strike_debter` bishop (`starter-frost` + `spell-strike-debt`) + 1× `ROLE-GLYPH` bishop (Mark + Poison) + 1× oncoming pawn. Never PAIR Strike Debt with Cast Debt / Spent Tax / Still Tax / Gait Tax as a two-body. Distinct from ENC-DEBT-01 (spelled-**last-turn** walk tax).  
AI_REQUIREMENTS: Debter skips if they only spelled or camped last turn. Glyph paints. Pawn charges. Soph 3–4. Until `struckThisTurn` exists, show `FSN-DEBT-ORBIT` (ENC-DEBT-01) instead.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Strike Debt can drop `spell-strike-debt` if missing.  
MAP_REQUIREMENTS: `openField` with cover pillars. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Strike Debt: next walk +1 AP if they **Struck** last turn. Spell last turn does **not** arm it. Teleport / Swap / Poise Step do not pay. Honesty reroll → ENC-DEBT-01.  
OBJECTIVE: Defeat all. Intended: Strike-then-stand, or walk before they arm.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Struck-last-turn walk tax. Distinct from ENC-DEBT-01 (spelled-last-turn).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Debter west vs east.  
SCALING_BEHAVIOUR: Peak: inherit spent-seam. Never two last-turn taxes.  
STATUS: PROPOSED

---

### ENC-LONE-03

ENCOUNTER_ID: ENC-LONE-03  
TYPE: elite-adjacent / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LONE-HAZARD` — 1× `lone_gaiter` pawn (`physical_attack` + `spell-lone-gait`) + 1× `hazard_cutter` pawn (`physical_attack` + `spell-hazard-cut`) + 1× `glyph_sower` bishop (Mark + Poison / **painted** cinder). Never PAIR Lone Gait with Pair Gait / Lone Purse / Full Gait / Poise Sting. Dummy Post is not a hazard. World lava that is **not** painted does **not** count.  
AI_REQUIREMENTS: Gaiter skips if leftover MP is not exactly 1 unless 10 still kills. Cutter skips rider if target is not on a **painted** hazard. Glyph paints. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lone Gait or Hazard Cut can drop that id if missing.  
MAP_REQUIREMENTS: `openField` with room to stand off painted cells **or** on them. Reject a 1-tile closet (forced paint).  
SPECIAL_RULES: Family lottery **off**. Lone Gait: leftover MP **exactly 1** poke. Hazard Cut: bonus vs **painted** hazard. Honesty reroll → ENC-LONE-02.  
OBJECTIVE: Defeat all. Intended: spend leftover MP to 0 or 2; stand off the paint.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Exact-1 walk-MP poke + painted-hazard cut. Distinct from ENC-LONE-02 (isolation from **all** units + handler-on-file pet cut) and ENC-PAIR-04 (exact-**2** leftover MP).  
SOLVABILITY_REQUIREMENTS: Room to stand on paint **and** off it. Two walk-offs.  
REPLAYABILITY: Cutter west vs east.  
SCALING_BEHAVIOUR: High: cutter is the leader. Never two isolation engines.  
STATUS: PROPOSED

---

### ENC-HOLD-06

ENCOUNTER_ID: ENC-HOLD-06  
TYPE: elite encounters / mastery  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-POISE-HOLD` — 1× `poise_holder` pawn or knight (`isLeader`, `spell-poise-hold` + `physical_attack`) + 1× `must_poiser` knight (`spell-must-poise` + `physical_attack`) + 1× `ROLE-WARDEN` rook (`iron_golem` overlay legal, Shield / Iron Skin). Optional fourth: Poise Hood junior **or** omit. **Never PAIR Poise Hold + Must Poise** as a two-body — the COURT is why both locks exist, with a third peeler (Warden).  
AI_REQUIREMENTS: Hold skips if leftover AP ≠ leftover MP **or** leftover AP = 0. Must skips if already 0/0; Strike stays legal on that body. Warden interposes with a **gap**. Never all three on turn 1 against a full-HP player who has not acted. `escapeRoute` (6) on. `bottleneckControl` (8) only if a gallery exists. InstantKill / betrayal off. Root stays off. Soph 6–8.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Poise Hold or Must Poise can drop that id if missing.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets. Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.  
SPECIAL_RULES: Family lottery **off**. Poise Hold: cannot spend walk MP while leftover AP === leftover MP ≥ 1; spells stay legal. Must Poise: remaining **non-Strike** spells confirm-fail unless leftover AP === leftover MP ≥ 1 **and this spell spends last AP**. Leader boost 10% × fallen escort. Dungeon depth may not add a fifth hostile to this id. Honesty reroll → ENC-HOLD-05. Teaching variant `FSN-POISE-HOLD/LANE` drops optional Hood. Hold `FSN-POISE-HOLD/NINE` while remaining cap < 9. Hold `/NUDGE` until trip is real. Hold `/KENNEL` if `summonAI` empty.  
OBJECTIVE: Defeat all. Intended: spend 1 leftover AP **or** MP (Hold peels), dump both pools and Strike (Must peels), live on waiting, kill Hold, or blink / Swap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + mastery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Court-scale leftover-equality **walk lock** plus **tool lock** without `instantKill`. Distinct from ENC-HOLD-05 (leftover-**MP**=0 **and** last-AP).  
SOLVABILITY_REQUIREMENTS: Gallery walk-off. Never a closed ring. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Hold chassis pawn vs knight. Hood on/off.  
SCALING_BEHAVIOUR: Do not add a fifth body. Tighten by leaving the Hood on, not HP. Never Root. Never Nine Plug while cap is 2.  
STATUS: PROPOSED

---

### ENC-ELITE-32

ENCOUNTER_ID: ENC-ELITE-32  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-POISE-CHOIR` — 1× `poise_mender` queen (`spell-poise-mend` + `starter-shield`) + 1× `verse_poiser` bishop (`starter-frost` + `spell-verse-poise`) + 1× ignite junior (`ember_knight` overlay legal, no second heal). Never PAIR Verse Poise with Verse Gaunt / Verse Lean / Verse Pace / Last Mute. Never PAIR Poise Mend with Gaunt / Hollow / Dry / Still / Heave / Both / Bar / Gift.  
AI_REQUIREMENTS: Mender skip if leftover AP ≠ leftover MP **or** leftover AP = 0. Verse skips if no `lastResolvedSpellId`. Ignite holds until the choir has taught the tied-≥1 window. Soph 3–4. Until `lastResolvedSpellId` exists, show `FSN-GAUNT-CHOIR` (ENC-ELITE-30) instead.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Poise Mend or Verse Poise can drop that id if missing.  
MAP_REQUIREMENTS: `arena` with cover pillars. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Verse Poise: last-id illegal until leftover AP === leftover MP ≥ 1. Forced-move does **not** peel Verse Poise. `0 = 0` does **not** lift. Honesty reroll → ENC-ELITE-30.  
OBJECTIVE: Defeat all. Intended: break the equality so Mend is 0 **and** Verse stays on; or Dual Keep 1/1 to peel Verse and accept the 8.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Four-flag tied-≥1 heal + last-id until leftover equality. Distinct from ENC-ELITE-30 (leftover-**both 0** last-id).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Verse west vs east.  
SCALING_BEHAVIOUR: Peak: inherit spent-seam. Never two last-id engines.  
STATUS: PROPOSED

---

### ENC-ELITE-33

ENCOUNTER_ID: ENC-ELITE-33  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Branch skin. Default / poise: `FSN-POISE-QUIET` — Poise Step + Poise Mend + cover. Knight: `FSN-KNIGHT-QUAD` + optional Spent Plate junior. Pit: `FSN-PIT-AXIS/RIME` if ENC-RIME-02 was taught, else `FSN-PIT-AXIS`. Spent: `FSN-SPENT-FULL` — Spent Plate + Full Sting.  
AI_REQUIREMENTS: Named formation AI. Cover / Hold / Skip skip-locks as in the formation sheet. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing the named CORE can drop it if missing.  
MAP_REQUIREMENTS: Formation `MAP_REQUIREMENTS`. Inherit one taught device from the branch (spent-seam / lean-cinder / pivot-slab / pit gallery) on a **gallery**.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-equality / (2,1) dest / pit attract / leftover-AP miss → convert to ENC-ELITE-31 leftover without claiming the day-17 verb.  
OBJECTIVE: Defeat all.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Branch-skinned elite using the taught pack. Distinct from ENC-ELITE-31 (Gaunt / Even / Brick / Orth).  
SOLVABILITY_REQUIREMENTS: Formation solvability plus inherited device not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Peak: promote Quiet to Hold or Spent Full to Plate brigade. Never a fifth body on Quiet.  
STATUS: PROPOSED

---

### ENC-RARE-17

ENCOUNTER_ID: ENC-RARE-17  
TYPE: rare elite rooms  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-POISE-HOLD` (ENC-HOLD-06) as an **insert** on depth 4, not a replacement beat. 8% on depth 4 after the account has answered ENC-POISE-01 **and** ENC-HOLD-05. Nine Plug (`FSN-POISE-HOLD/NINE`) stays **off** while remaining cap < 9. Bounce Ring (`FSN-POISE-HOLD/BOUNCE`) may replace optional Hood if the account already answered ENC-TIED-01.  
AI_REQUIREMENTS: Same as ENC-HOLD-06.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-HOLD-06.  
MAP_REQUIREMENTS: Same as ENC-HOLD-06. Never a closed ring.  
SPECIAL_RULES: Insert, do not replace mastery. `holdPortalLocked` until the COURT is down. Honesty reroll → ENC-RARE-16.  
OBJECTIVE: Defeat the rare COURT.  
FAILURE_CONDITION: Player death.  
REWARD: Rare multiplier via `applyRewards` (hard). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Optional peak leftover-equality exam. Distinct from ENC-RARE-16 (Gaunt Hold).  
SOLVABILITY_REQUIREMENTS: Same as ENC-HOLD-06.  
REPLAYABILITY: Hood vs Bounce Ring vs Lane (no fourth).  
SCALING_BEHAVIOUR: Do not add Nine. Tighten by Bounce Ring, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-17

ENCOUNTER_ID: ENC-TREAS-17  
TYPE: treasure/risk rooms  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn still on the board (the chest is not a third hostile).  
AI_REQUIREMENTS: Bishop kites on a rank/file so a line can be **avoided**. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Visible `WF-TRS-DIAG_CACHE` chest. 1 AP adjacent opens it **only while no living hostile shares the player’s row or column**: a medium `applyRewards` grant and no guardian. Inverse of Line Cache (ENC-TREAS-16). Distinct from Clash Cache (hostile Chebyshev ≤ 1), Watch Cache (no hostile within 3), and Hire Cache (allied summon adjacent to the chest). Adjacent-open, not a wall. Optional.  
SPECIAL_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Failed open spends AP only. Optional spent-seam ribbon on a **gallery**.  
OBJECTIVE: Clear all. Optional: open while off every hostile’s rank and file, kite onto a diagonal then spend 1 AP, or walk past.  
FAILURE_CONDITION: Player death. Skipping the chest is not a fail.  
REWARD: Standard kill + optional medium grant. No overlay (the chest *is* the challenge).  
TACTICAL_PURPOSE: Treasure that wants an **off-axis** plant, not a shared file. Inverse of ENC-TREAS-16.  
SOLVABILITY_REQUIREMENTS: Chest not a wall. Map solvable if never opened.  
REPLAYABILITY: Chest west vs east of the painted diagonal.  
SCALING_BEHAVIOUR: High: bishop is Poise Hood so Dual Keep 1/1 on the diagonal is a miss — open after breaking the tie.  
STATUS: PROPOSED

---

### ENC-BANK-01

ENCOUNTER_ID: ENC-BANK-01  
TYPE: optional challenge / rest-adjacent wager  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: None required on the inlay map; if a fight follows, the next room’s roster.  
AI_REQUIREMENTS: None on the inlay.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Optional `WF-RSK-SPENT_OATH` spent-copper inlay. End a turn on it to flag this map. If the next `applyRewards` happens while the player’s remaining AP is **0**, that credit uses the hard multiplier. If they still have leftover AP at credit, the flag pays nothing extra. Inverse of Spare Oath (leftover AP). Distinct from Plant Oath (ENC-PLANT-01: 0 remaining **MP**), Stillness Oath (any MP spend after the flag clears it), and Scar Oath (below 50% HP at credit). Optional floor tile. Map is solvable if never used.  
SPECIAL_RULES: AP check is remaining AP at the `applyRewards` enqueue. Multiplier on the next enqueue only. Death still uses `saveBattleStats`.  
OBJECTIVE: Optional: flag a fight you will cash out spent, or stay unflagged and keep leftover AP.  
FAILURE_CONDITION: None on the inlay. Next-room death is Death Realm.  
REWARD: Hard multiplier **or** nothing extra. No overlay.  
TACTICAL_PURPOSE: Opt-in leftover-AP=0 wager. Distinct from ENC-PLANT-01 (leftover-**MP**=0) and ENC-SURV-32 (adjacent plant).  
SOLVABILITY_REQUIREMENTS: Optional. Not on spawn or a portal.  
REPLAYABILITY: Inlay west vs east of spawn.  
SCALING_BEHAVIOUR: Rest/treasure only. Never a required dungeon tax.  
STATUS: PROPOSED

---

### ENC-HOUR-01

ENCOUNTER_ID: ENC-HOUR-01  
TYPE: optional challenge / wager  
RELATIVE_DIFFICULTY: MID (opt-in)  
ENEMY_COMPOSITION: Uses the next room’s roster (typically ENC-TREAS-17 or ENC-MAST-17).  
AI_REQUIREMENTS: Next room.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-DIAG_HOUR` overlay on the next fight (same mechanic as ENC-SURV-34, offered from rest as a **choice** rather than a forced overlay). Inverse of ENC-CLOSE-01.  
SPECIAL_RULES: Rest shrine can enable `diagHourArmed` on the next dungeon room. Never on rest combat (rest has no hostiles).  
OBJECTIVE: Choose to plant off-axis once in the next fight for a hard purse.  
FAILURE_CONDITION: Next-room death. Declining the overlay is not a fail.  
REWARD: Hard multiplier if armed and planted off-axis.  
TACTICAL_PURPOSE: Rest-offered off-axis wager. Distinct from ENC-SURV-34 (forced overlay on a scripted survival room) and ENC-CLOSE-01 (melee plant).  
SOLVABILITY_REQUIREMENTS: Overlay does not block.  
REPLAYABILITY: On/off from rest.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-REST-17

ENCOUNTER_ID: ENC-REST-17  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional spent-oath / diag-hour shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-18 / ENC-POISE-01 / ENC-KNIGHT-01 observed Poise Mend / Knight Stride / Quad Oath, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-DIAG_TUTOR` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-17. Optional `WF-RSK-SPENT_OATH` tile (flag next room only). Optional `WF-PRT-STRIDE_GATE` as a **bonus gamble exit** (rest/overworld only — not an exit until the player has spent at least 1 MP on an occupancy-walk this map; never the only portal). White sanctuary portal colocates with spawn.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Spent oath does not start combat. `uiLayout` unchanged. After one full Table N clear, shrine can enable day-17 `rushVariant` flags (`boot_lock`, `purse_pendulum`, `tick_fetid`, `mute_dilate`).  
OBJECTIVE: Choose an exit. Optional: shrine, spent oath, stride gate, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Spent oath is a modifier flag, not a Doka mint. Stride Gate bonus via `applyRewards` on the persist lock.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Poise-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and oath pass punch-roster / portal reachability. Stride Gate always in addition to a reachable stable portal. Oath not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Stride on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-17

ENCOUNTER_ID: ENC-BRANCH-17  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four locked-until-step portals labeled by **metadata** `branch: poise | knight | pit | spent` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: poise → ENC-POISE-01 or ENC-SPELL-33, knight → ENC-KNIGHT-01 or ENC-SPELL-34, pit → ENC-PIT-02 or ENC-GATE-04, spent → ENC-SPENT-02 or ENC-SNAP-01. A sealed fifth door to ENC-RARE-17 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: poise | knight | pit | spent` on the dungeon snapshot. Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-17 / ENC-BOSS-17). Day-16 `ENC-BRANCH-16` stays gaunt/even/brick/orth. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer. Foyer death is Death Realm.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Gaunt / Even / Brick / Orth.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Guard File door (ENC-GUARD-01) can replace Knight for accounts that already finished Knight this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band. High: foyer pawn is a Diag Picket (ENC-AMBUSH-17) so lingering off-axis to read doors is a fight. Never a sixth door.  
STATUS: PROPOSED

---

### ENC-MINI-18

ENCOUNTER_ID: ENC-MINI-18  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `starved_vampire_pawn` (spent / leftover-AP adjacent). Branch poise: `starved_vampire_pawn`. Branch knight: `bone_cavalier`. Branch pit: `alabaster_fortress`. Branch spent: `midnight_bishop`. Do **not** use `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. Not a dual-boss. No phase-2 table beyond the live kit.  
AI_REQUIREMENTS: Existing boss kits. No Table O directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (spent-seam / pivot-slab / one pit gallery / leftover-AP aisle) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only. Honest to pacing: at 30% HP the lieutenant-feel extra (one extra Poise Hood consume / one extra Poise Mend) only if the chain taught that verb.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-17

ENCOUNTER_ID: ENC-BOSS-17  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Poise → `starved_vampire_pawn`; Knight → `bone_cavalier`; Pit → `alabaster_fortress`; Spent → `midnight_bishop`. If the chain taught Diag Picket (ENC-AMBUSH-17) **and** Knight was not taken, Ice/Hex-mixed accounts may use `pale_archbishop` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** use Table O ids.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-18) or guard (ENC-GUARD-01) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Poise may inherit 2 spent-seam tiles off the only path; Knight may inherit room for L-steps plus a Chebyshev-4 aisle; Pit may inherit one pit gallery (not a sealed pocket); Spent may inherit pivot slab on a gallery.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (spent drain / charge-on-file / fortress pits / curse-reflect).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-17

ENCOUNTER_ID: ENC-MAST-17  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on spent-seam (`WF-HAZ-SPENT_SEAM`). Wave 2: `FSN-POISE-STEP` **or** `FSN-POISE-SIP` **or** `FSN-KNIGHT-QUAD` **or** `FSN-PIT-AXIS` by `branch`. Wave 3: elite leftover (E-STEP stepper **or** E-STING stinger **or** Warder elite **or** Reeler elite) + leftover.  
AI_REQUIREMENTS: Wave AI as ENC-WAVE-18 plus the named PAIR. Soph 4–6 on wave 3. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None new if the chain already observed the CORE; else the wave-2 glyph may still drop.  
MAP_REQUIREMENTS: Choke + gallery. Spent-seam on the gallery, never in the choke. Branch skins add pivot / pit / leftover-AP aisle / cast-lock on a **second** gallery. Portal locked until wave 3 is clear.  
SPECIAL_RULES: `holdPortalLocked` until wave 3 is down. Honesty: missing leftover-equality / L-step / pit attract → wave 2 is ENC-MAST-16 leftover without claiming the day-17 verb.  
OBJECTIVE: Clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery XP via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Prove the taught primer under a last-AP tax and a choke.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Inherited device not a cut-vertex. Living hostiles ≤ 5.  
REPLAYABILITY: Four branch skins. Choke side flips.  
SCALING_BEHAVIOUR: Peak: wave 3 gains Poise Hood junior. Never a sixth body. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-RUSH-63

ENCOUNTER_ID: ENC-RUSH-63  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room O0 remix: `boot_subprior` + `lock_marshal` as Table O `O0`. Combined mechanic remains: he gifts the novice a 2-step; you are **axis-locked**. Occupy the on-axis landing. Compass dest **never** occupies the Caliga. Off-axis walks already reject (0 MP). Forced-move does **not** fizzle the lend. Novice death ≠ victory. Not Infirm / March / Stride / Wick / Sole / Mill / Ram / Hook / Fosse / Hex / Palisade.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-KNIGHT-01, a **painted L overlay** (visual only) shows legal walks beside the axis lock — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Spare Pace, Gift Sill, Leftover Lend, Cadence Lend, or Haste. Player Boot Lend cannot target hostiles.  
MAP_REQUIREMENTS: Preferred cells. Compass never on Caliga. L overlay must not sit on portals.  
SPECIAL_RULES: `rushVariant: boot_lock`. Unlock after one full Table N clear.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table O room 0 table + tiny bonus if the player occupied the on-axis landing without walking off-axis (skill).  
TACTICAL_PURPOSE: Add the walk-shape exam the Knight primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Compass never on Caliga. At least one floor dest remains (stand / Swap / forced-move).  
REPLAYABILITY: Caliga N vs S of Compass.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten Compass dests, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-64

ENCOUNTER_ID: ENC-RUSH-64  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room O1 remix: `purse_steward` + `unbound_pendulum` as Table O `O1`. Combined mechanic remains: dump leftover before snapshot, or the banked 3 recasts Inferno after the next **sweep**. Metronome dest **never** occupies the Cista. Keep is not a second clock (pays at next own turn start, not on sweep). Death discards the bank. Not Surplus / Lend / Dry / Flush.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-SPENT-02 / ENC-BANK-01, a **painted leftover-AP pip** (visual only) shows the snapshot window — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Player Purse Keep cannot last past one battle or pay mid-RAF.  
MAP_REQUIREMENTS: Preferred cells. Metronome never on Cista.  
SPECIAL_RULES: `rushVariant: purse_pendulum`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table O room 1 table + tiny bonus if leftover AP was 0 at snapshot (skill).  
TACTICAL_PURPOSE: Add the leftover-AP exam the Spent primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Metronome never on Cista.  
REPLAYABILITY: Cista N vs S of Metronome.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten sweep timing, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-65

ENCOUNTER_ID: ENC-RUSH-65  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room O2 remix: `tick_infirmarer` + `fetid_rook` as Table O `O2`. Combined mechanic remains: Inferno him (one tick eaten) while answering compounding **rot** on you. Split-rook dest **never** occupies the Plaster. Rot on you is not this plate (plate is self). Lava / hazard ticks do not consume. Twin counts as a body. Not Plate / Rebound / Hood / Cover / Countess / Wick Prelate.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-RIME-02 / ENC-LEAVE-01, a **painted tick pip** (visual only) shows the next consume — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Player Tick Plate cannot last past consume or 2 of their turns.  
MAP_REQUIREMENTS: Preferred cells. Split-rook never on Plaster.  
SPECIAL_RULES: `rushVariant: tick_fetid`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table O room 2 table + tiny bonus if the first Inferno consumed his next tick (skill).  
TACTICAL_PURPOSE: Add the consume-exam the Rime / Leave primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Split-rook never on Plaster. Twin counts as a body, not a second boss.  
REPLAYABILITY: Plaster N vs S of the split.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten rot cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-66

ENCOUNTER_ID: ENC-RUSH-66  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room O3 remix: `mute_notary` + `dilate_organist` as Table O `O3`. Combined mechanic remains: Stretch Inferno late, then mute **that same id**. Antiphoner dest **never** occupies the Tabula. Strike stays legal if last id was not Strike. Stretch cap 8. Not Conductor / Weeping / Oath / Flush / Surplus / Court Stretch.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-ELITE-32 (Verse Poise), a **painted last-id pip** (visual only) shows the muted id — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Player Last Mute cannot last past 1 of the target’s turns.  
MAP_REQUIREMENTS: Preferred cells. Antiphoner never on Tabula.  
SPECIAL_RULES: `rushVariant: mute_dilate`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table O room 3 table + tiny bonus if the player Striked after mute without recasting the stretched id (skill).  
TACTICAL_PURPOSE: Add the last-id exam the Poise choir taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Antiphoner never on Tabula. Strike remains a legal answer.  
REPLAYABILITY: Tabula N vs S of Antiphoner.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten stretch window, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain Q — “Poise Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-17 then ENC-SPELL-33 (or ENC-SPELL-34 if Poise Mend already owned) |
| 2 | Reinforce | ENC-WAVE-18 |
| 3 | Combine | ENC-HAZ-33 then ENC-POISE-01 **or** ENC-TIED-01 **or** ENC-KNIGHT-01 |
| 3 insert | Choice | ENC-BRANCH-17 → Poise/Knight/Pit/Spent destinations |
| 4 | Pressure | ENC-SURV-33 **or** ENC-PROT-17 **or** ENC-GUARD-01 **or** skip via ENC-REST-17 |
| 4 | Mastery | ENC-MAST-17 (branch skin) |
| 5 | Boss | ENC-BOSS-17 |

Rare: 8% on depth 4 to **insert** ENC-RARE-17 before mastery.  
Treasure: rest may offer ENC-TREAS-17 instead of PROT-17.  
Pit side-story: replace combine with ENC-PIT-02 and mini-boss ENC-MINI-18; capstone may become `alabaster_fortress` if Pit was the door.

### Chain R — “Spare Primer” (maxDepth 4)

ENC-SLAB-01 → ENC-HURT-01 → ENC-SPARE-01 → ENC-REST-17 → ENC-BOSS-17 (`midnight_bishop` only if Spent was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-SLAB-01 as teach on accounts that already know spent-seam / leftover-tied.

### Rush injection (day-17)

After one full Table N clear, ENC-REST-17 shrine can enable: O0 → ENC-RUSH-63, O1 → ENC-RUSH-64, O2 → ENC-RUSH-65, O3 → ENC-RUSH-66. Day-1…day-16 flags for rooms 0–9 and Tables B–N remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-17, ENC-SPELL-33, ENC-SPELL-34 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-33, ENC-RIME-02, ENC-SPARE-01, ENC-LEAVE-01 | `under_50_damage` |
| ENC-HAZ-34, ENC-WAVE-18 | `under_10_turns` / `under_15_turns` |
| ENC-PROT-17, ENC-MAST-17, ENC-SLAB-01, ENC-LONE-03 | `direct_hit` |
| ENC-POISE-01, ENC-TIED-01, ENC-ELITE-32, ENC-ELITE-33, ENC-PIT-02, ENC-SNAP-01, ENC-GUARD-01, ENC-HOLD-06 | `under_8_ap_per_turn` |
| ENC-SURV-33, ENC-HURT-01 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-17 / ENC-REST-17 bank / ENC-BANK-01 / ENC-HOUR-01 / ENC-SURV-34 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | `spent_seam` or 1 lean cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | spent-seam **or** stride plate | kill + optional glyph |
| MID | named drop-16 `FSN-*` or waves | backline guard | zone 1 + Poise Mend / Knight Stride | one `WF-*` | clock / tags / gate |
| HIGH | elite or guard file | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / pit / leftover-AP miss |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / rush O0–O3 |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit spent-seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. Spent Oath / Diag Hour / Diag Cache stay opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-16 fields plus:

```
encounterId
encounterType        // + poise_step | poise_sip | knight_quad | pit_axis | poise_gate |
                     //   spent_full | rime_file | watch_sip | poise_choir | shove_drift |
                     //   poise_quiet | hollow_swap | lone_hazard | strike_tax | cross_poise |
                     //   poise_hold | spent_seam | lean_cinder | stride_plate | pivot_slab |
                     //   hurt_sill | hurt_font | spare_step | guard_file | diag_picket |
                     //   diag_cache | diag_tutor | spent_oath | cast_lock | diag_hour | spare_draft
formationId?         // FSN-POISE-STEP | FSN-POISE-SIP | FSN-KNIGHT-QUAD |
                     // FSN-PIT-AXIS | FSN-POISE-GATE | FSN-SPENT-FULL |
                     // FSN-RIME-FILE | FSN-WATCH-SIP | FSN-POISE-CHOIR |
                     // FSN-SHOVE-DRIFT | FSN-POISE-QUIET | FSN-HOLLOW-SWAP |
                     // FSN-LONE-HAZARD | FSN-STRIKE-TAX | FSN-CROSS-POISE |
                     // FSN-POISE-HOLD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // poise | knight | pit | spent
spentSeamCells? / leanCinderCell? / stridePlateCell?
pivotSlabCell? / hurtSillCell? / hurtFontCell?
spareStepPads? / castLockArmed? / diagPicketArmed?
spareDraftArmed? / diagHourArmed?
holdPortalLocked?
objectiveKind        // + occupy_hurt_font | open_hurt | drink_hurt |
                     //   tag_diag | choose_device | spent_file | pivot_slab
failureKind
deviceTable[]        // ENC-TREAS-17
rushVariant?         // boot_lock | purse_pendulum | tick_fetid | mute_dilate
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Diag Picket” logic — use `formationId` / `diagPicketArmed` / `branchFlag`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-24 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush only).
- Wiring Wave-16 families (`tally_mender`, `shove_gifter`, …) or Wave-17 spell unique CORE — those wait on same-day / later catalogs. This catalog consumes drop-16 **formations** that can stand on Wave-15 kits.
- Faking Poise Mend without four leftover-tied-≥1 flags, Poise Sting as Gaunt/Bare, Knight Stride as Orth / Even, Pit Reel as Brick Reel, Poise Post walk-on as a detonate, Rime Skip as a required player hop, Spent Plate as a leftover-MP miss, Full Sting as Full Gait, Watch Sip as Watch Alms, Hollow Gift as Gaunt Mend, Bar Cross as Dual Keep, Strike Debt as Cast Debt, Poise Hold as Gaunt Hold, Pivot as Hush, Hurt as Spent, Spare Step as Empty Step, Hurt Font as Empty Font, Diag Picket as Orth Picket, Diag Tutor as Orth Tutor, Spare Draft as File Shade, Guard File as Sheath File, Stride Gate in a dungeon, Nine Plug while cap is 2.
- Consuming same-day 2026-10-25 Wave 17 family / spell / world catalogs.

---

## 10. Pick order (day-17, after days 1–16 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–16 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-17 + ENC-SPELL-33 (spent-seam / poise-mend verbs)  
2. ENC-WAVE-18 (`formationId` POISE-STEP → POISE-SIP)  
3. ENC-POISE-01 or ENC-TIED-01 or ENC-KNIGHT-01 (new pressure objects)  
4. ENC-BRANCH-17 (`branch: poise|knight|pit|spent` snapshot-before-cleanup)  
5. ENC-BOSS-17 branch read  
6. Rush Table O variants 63–66 one room at a time (after the account has one full Table N clear)

Uniqueness: this file is the **seventeenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
