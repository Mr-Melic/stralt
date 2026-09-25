# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 8

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-25  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Wave 3 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md), PR #300) is Generation 3. Wave 4 (still-open #371) is Generation 4. Wave 6 (still-open #480) is Generation 6. Wave 7 (still-open #533) is Generation 7. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Wave 6 (#480) is Generation 6 so those memory ids stay tombstoned. Wave 7 (#533) is Generation 7. This document is **Generation 8**. `generationMin: 8`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-25.md`](./ACTION_IDS_SDE_2026-09-25.md).

**Do not implement production code from this PR.**

---

## 0. Sibling designs (do not duplicate)

| Sibling | Path / PR | Owns |
| :--- | :--- | :--- |
| Wave-1 discovery contract | #156 — `SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` | State machine, innate four, persist writers, UX copy, Wave-1 cards |
| Wave-2 discovery contract | #226 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md` | `generationMin`, G≥2 verbs, W2 specials |
| Wave-3 discovery contract | #300 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md` | G≥3 extra slot, W3 unique ids, #282 stamps |
| Wave-4 discovery contract | still-open #371 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-21.md` | G≥4 extra slot, W4 unique ids, #342 stamps |
| Wave-5 discovery contract | **no GitHub PR** — memory-reserved 2026-09-22 | Unique ids in §0.1. **Do not resurrect them here.** |
| Wave-6 discovery contract | still-open #480 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-23.md` | G≥6 extra slot, W6 unique ids, #411 / #463 stamps |
| Wave-7 discovery contract | still-open #533 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md` | G≥7 extra slot, W7 unique ids, #525 stamps, leftover `hard_1` / `legendary_1` |
| Wave-1…7 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-24.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | #342 | Gale Fan … Eclipse Fold |
| Tactical gap-fillers W5 | still-open #411 | Oncoming … Act Bell |
| Tactical gap-fillers W6 | still-open #463 | Post Sting … About Face |
| Tactical gap-fillers W7 | still-open #525 | Wall Sting … Court Shove |
| Tactical gap-fillers W8 | same-day #563 — `SPELL_PROPOSALS_2026-09-25.md` | Gait Mend … Court Hinge. **Stamp, do not clone** |
| Family sheets | #136 + #349 + #405 + #452 + #535 + same-day #558 | #558 Wave-8 families consume **#525** as CORE. Do not put unique §11 ids there |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 | Extra doors claimed through Wave 8 (`gaze_beadle` … `lintel_sacrist`) |
| AI evolution increment | same-day #565 | SYS-48…53 / FUT-66…71 — honesty, not grants |
| PX coherence | #343 / #393 / #481 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-8 unique ids in §11 are new. Same-day #563 said if Discovery claims a tactical id, **SDE wins**; this document does **not** claim those ids — it stamps them.

### 0.1 Reserved tombstone (never re-propose)

**#120:** `spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**#137:** `spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 1 SDE:** `spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Wave 2 SDE:** `spell-load-bearing`, `spell-void-glyph`, `spell-paper-wind`, `spell-rear-cut`, `spell-hold-ground`, `spell-rime-sheet`, `spell-hex-theft`, `spell-still-brand`, `spell-grounded-lock`, `spell-file-lance`, `spell-loan-tempo`, `spell-dispel-thread`, `spell-taunt-oath`, `spell-convert-whelp`, `spell-last-ember`, `spell-blood-tithe`, `spell-search-dust`, `spell-fog-hood`, `spell-claim-ward`, `spell-self-anchor`, `spell-pack-howl`, `spell-reliquary-lock`.

**#185 tactical Wave 2:** `spell-fuse-tile`, `spell-coup-de-grace`, `spell-ignite-stacks`, `spell-short-sight`, `spell-tempo-gift`, `spell-absolve`, `spell-cross-cut`, `spell-rime-tile`, `spell-smoke-veil`, `spell-sinkhole`, `spell-leash-hook`, `spell-bastion-pylon`, `spell-goad`, `spell-life-tether`.

**#282 tactical Wave 3:** `spell-ley-toll`, `spell-fan-bolt`, `spell-pawn-trade`, `spell-back-step`, `spell-twin-gate`, `spell-sidestep-ward`, `spell-far-sting`, `spell-soul-sip`, `spell-open-pit`, `spell-mercy-font`, `spell-font-pulse`, `spell-lens-share`, `spell-stride-brand`, `spell-hex-toll`, `spell-slide-tile`, `spell-rank-lock`, `spell-board-tilt`.

**Wave 3 SDE:** `spell-undertow`, `spell-mire-sheet`, `spell-borrowed-eye`, `spell-planted-stance`, `spell-file-slide`, `spell-tempo-invert`, `spell-debt-mark`, `spell-knight-pierce`, `spell-split-pace`, `spell-summon-bane`, `spell-last-ward`, `spell-kennel-lock`, `spell-far-watch`, `spell-mercy-hex`, `spell-bloodless-plate`, `spell-crimson-pact`, `spell-gate-sight`, `spell-pack-tempo`, `spell-sovereign-fold`.

**#342 tactical Wave 4:** `spell-gale-fan`, `spell-twin-guard`, `spell-cut-in`, `spell-after-verse`, `spell-sanguine-toll`, `spell-cross-flank`, `spell-bias-ray`, `spell-draw-together`, `spell-ap-sip`, `spell-body-check`, `spell-cast-snare`, `spell-bait-pylon`, `spell-bait-eat`, `spell-morrow-step`, `spell-surplus-ward`, `spell-sated-fang`, `spell-eclipse-fold`.

**Wave 4 SDE:** `spell-triune-gate`, `spell-stolen-verse`, `spell-relay-dash`, `spell-camp-tax`, `spell-rooted-sight`, `spell-haze-pane`, `spell-waste-pace`, `spell-bitter-cup`, `spell-keep-kennel`, `spell-momentum-cut`, `spell-misstep`, `spell-ward-cell`, `spell-nail-down`, `spell-spent-stride`, `spell-wounded-lens`, `spell-pit-sight`, `spell-second-shadow`, `spell-false-echo`, `spell-repel-ring`.

**Memory-reserved Wave 5 SDE (no PR; never re-propose):** `spell-gaze-sill`, `spell-close-debt`, `spell-near-veil`, `spell-soft-step`, `spell-twice-mark`, `spell-rebound-ward`, `spell-cull-kennel`, `spell-whelp-sill`, `spell-ash-sill`, `spell-spent-lens`, `spell-wait-fang`, `spell-share-gaze`, `spell-body-glass`, `spell-last-stride`, `spell-post-hex`, `spell-turn-sill`, `spell-pack-cover`, `spell-false-gaze`, `spell-void-span`.

**#411 tactical Wave 5:** `spell-oncoming`, `spell-facing-pin`, `spell-glance-cut`, `spell-mute-thread`, `spell-stride-mute`, `spell-queue-cut`, `spell-false-cut`, `spell-file-vault`, `spell-span-guard`, `spell-span-pylon`, `spell-cadence-theft`, `spell-cadence-brand`, `spell-cover-step`, `spell-low-lintel`, `spell-act-tax`, `spell-act-bell`.

**#463 tactical Wave 6:** `spell-post-sting`, `spell-purse-cut`, `spell-blind-corner`, `spell-hinge-step`, `spell-file-reel`, `spell-twin-span`, `spell-oath-blade`, `spell-aim-veil`, `spell-cadence-break`, `spell-cadence-lend`, `spell-split-purse`, `spell-exit-tithe`, `spell-hinge-tile`, `spell-spark-whelp`, `spell-turn-cap`, `spell-about-face`.

**Wave 6 SDE (#480):** `spell-choir-verse`, `spell-bias-step`, `spell-wick-bite`, `spell-empty-purse`, `spell-crowd-tax`, `spell-pet-swap`, `spell-corner-lens`, `spell-face-away`, `spell-dull-edge`, `spell-pet-sill`, `spell-late-purse`, `spell-pet-share`, `spell-short-leash`, `spell-axis-veil`, `spell-safe-fall`, `spell-bare-lens`, `spell-gap-ward`, `spell-pack-ledger`, `spell-court-fold`.

**#525 tactical Wave 7:** `spell-wall-sting`, `spell-file-brand`, `spell-boot-sting`, `spell-shove-face`, `spell-knight-slip`, `spell-pivot-foe`, `spell-triple-span`, `spell-cadence-crack`, `spell-must-pace`, `spell-once-verse`, `spell-tick-hood`, `spell-flank-share`, `spell-spare-pace`, `spell-pit-wick`, `spell-exit-boon`, `spell-court-shove`.

**Wave 7 SDE (#533):** `spell-even-stride`, `spell-strike-hold`, `spell-ground-oath`, `spell-walk-toll`, `spell-purse-lock`, `spell-ally-reel`, `spell-echo-paint`, `spell-blink-seal`, `spell-gift-sill`, `spell-split-fang`, `spell-wall-bite`, `spell-cast-mark`, `spell-still-leash`, `spell-pet-verse`, `spell-ghost-step`, `spell-thin-ward`, `spell-clean-blood`, `spell-pack-still`, `spell-file-fold`.

**#563 tactical Wave 8 (same-day; never re-propose as unique §11):** `spell-gait-mend`, `spell-pair-hinge`, `spell-cadence-flush`, `spell-lone-sting`, `spell-morrow-plate`, `spell-gait-seal`, `spell-diag-lock`, `spell-brick-shift`, `spell-mend-wick`, `spell-return-sting`, `spell-leftover-lend`, `spell-dummy-post`, `spell-enter-mend`, `spell-body-mark`, `spell-split-mend`, `spell-court-hinge`.

**Do not alias** `spell-odd-stride` ↔ `spell-even-stride` / `spell-bias-step` / `spell-misstep` / `spell-diag-lock` / `spell-rank-lock`, `spell-cast-hold` ↔ `spell-strike-hold` / `spell-gait-seal` / `spell-must-pace` / `spell-mute-thread` / `spell-oath-blade`, `spell-unit-oath` ↔ `spell-ground-oath` / `spell-aim-veil`, `spell-step-rebate` ↔ `spell-walk-toll` / `spell-spare-pace` / `spell-gift-sill` / `spell-exit-boon` / `spell-ley-toll`, `spell-foe-reel` ↔ `spell-ally-reel` / `spell-file-reel` / `spell-draw-together` / `spell-hook-line` / `spell-leash-hook`, `spell-echo-wipe` ↔ `spell-echo-paint` / `spell-cleanse-rite` / `spell-dispel-thread`, `spell-field-bite` ↔ `spell-wall-bite` / `spell-wall-sting` / `spell-lone-sting`, `spell-wound-mark` ↔ `spell-cast-mark` / `spell-body-mark` / `spell-split-mark` / `spell-twice-mark`, `spell-split-plate` ↔ `spell-flank-share` / `spell-split-fang` / `spell-load-bearing` / `spell-cover-step` / `spell-pain-link`, `spell-verse-first` ↔ `spell-oath-blade` / `spell-once-verse` / `spell-strike-hold` / `spell-choir-verse`, `spell-pit-skip` ↔ `spell-safe-fall` / `spell-open-pit` / `spell-pit-sight` / `spell-ghost-step` / `spell-gap-ward`, `spell-empty-plate` ↔ `spell-planted-stance` / `spell-still-brand` / `spell-purse-lock` / `spell-empty-purse`, `spell-kennel-sill` ↔ `spell-pet-sill` / `spell-kennel-lock` / `spell-keep-kennel` / `spell-short-leash`, `spell-chase-mend` ↔ `spell-gait-mend` / `spell-enter-mend` / `spell-split-mend` / `spell-mend-wick` / `spell-post-sting`, `spell-cadence-stall` ↔ `spell-cadence-flush` / `spell-cadence-crack` / `spell-cadence-theft` / `spell-cadence-lend`, `spell-crown-cut` ↔ `spell-coup-de-grace` / `spell-summon-bane` / `spell-sated-fang`, `spell-full-bar` ↔ `spell-overcast` / `spell-hex-of-silence` / `spell-spare-pace` / `spell-tempo-gift`, `spell-pack-tithe` ↔ `spell-pack-still` / `spell-pack-tempo` / `spell-pack-ledger` / `spell-pack-howl`, `spell-about-hinge` ↔ `spell-pair-hinge` / `spell-court-hinge` / `spell-file-fold` / `spell-court-fold` / `spell-about-face`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Same-day tactical Wave 8 (#563 — stamp, do not clone)

Same-day #563 (`docs: Wave 8 tactical spell proposals`, `SPELL_PROPOSALS_2026-09-25.md`) **owns** the G≥8 tactical holes below. Unique §11 ids in this document stay this catalog’s. Do **not** clone #563 ids as unique §11 rows. Do **not** rename §11 to match #563. Do **not** restamp #563 extra doors (`gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`).

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-gait-mend` | ENEMY_DISCOVERY | Heal 8 iff **caster** spent ≥ 1 walk MP. Distinct from Chase Mend (target walked) |
| `spell-pair-hinge` | ENEMY_DISCOVERY | Two hostiles 90° around **their** midpoint. Distinct from About Hinge (180°, player-side, closed) |
| `spell-cadence-flush` | ENEMY_DISCOVERY | **Ally**, all remaining CDs → 0. Distinct from Cadence Stall (**hostile**, +1 all remaining) |
| `spell-lone-sting` | ENEMY_DISCOVERY | Bonus iff 0 Chebyshev-1 same-side hostiles. Distinct from Field Bite (open **terrain**) |
| `spell-morrow-plate` | ENEMY_DISCOVERY | Absorb starts next **own** turn |
| `spell-gait-seal` | ENEMY_DISCOVERY | Cannot spend walk MP; spells still legal. Distinct from Cast Hold (spells illegal until walk) |
| `spell-diag-lock` | ELITE | Next walks must be diagonal. Distinct from Odd Stride (Manhattan parity) |
| `spell-brick-shift` | ENEMY_DISCOVERY | Slide an **existing** barrier 1 Chebyshev |
| `spell-mend-wick` | ENEMY_DISCOVERY | Delayed tile **heal**. Distinct from Echo Wipe (erase paint) |
| `spell-return-sting` | ENEMY_DISCOVERY | Next applied hit → 0 on you, `floor(n/2)` poke. Distinct from Split Plate (share incoming) |
| `spell-leftover-lend` | ENEMY_DISCOVERY | Dump **your** leftover AP onto an ally |
| `spell-dummy-post` | ELITE | 1-HP empty-kit taunt post (`summonAI: "dummypost"`) |
| `spell-enter-mend` | ENEMY_DISCOVERY | First enter heals 6 once. Distinct from Chase Mend |
| `spell-body-mark` | ENEMY_DISCOVERY | Unit-scoped next-hit ×1.5. Distinct from Wound Mark (detonate on **being hit**) |
| `spell-split-mend` | ELITE | Heal 12 split 50/50 with adjacent ally |
| `spell-court-hinge` | NOT_PLAYER_LEARNABLE | Mass pair-hinge. Never owned. Distinct from About Hinge |

`court_hinge_regent` is **not** `about_hinge_regent`. `gait_cantor` is **not** Chase Mend’s door.

### 0.3 Held holes (still not this pass)

Wave 7 §13 and #563 §2 listed these as Wave-8/9 candidates. This wave **does not** fill them:

| Held hole | Why still held |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Sixth echo id | After Verse / Stolen Verse / Echo Cast / False Echo / Choir Verse already cover the axis |
| Four-cell occupy | Triple Span is already three. Cap remaining is still 2 live (`ENEMY_SUMMON_CAP`) |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy |
| `jackpot` feat door | #185 Absolve already claimed `jackpot` as a MULTI child. Do not restamp |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-four days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 … 2026-09-25 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2408 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`main.mo` 134–142) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | Feats cannot grant a spell id **until** a later writer; this wave **stamps leftover doors** `leader_slayer` / `spell_master` as MULTI children |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | All nine challenge ids are claimed through Wave 7 (`hard_1` / `legendary_1` inclusive) |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | WX 11920; zone object at 4683–4687 | `Math.floor(levelZone)` is `NaN`; every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Chase Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids. Dummy Post uses `summonAI: "dummypost"` (#563) |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-8 unique ids stay `mpCost: 0`. Step Rebate is a walk-pool **flag**, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Foe Reel is attract-toward-**nearest other hostile**, a new caller after Ally Reel |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed** until a battle-walk writer exists. **No new Wave-8 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` exists | `gameTypes.ts` 293 | Crown Cut reads this flag (and enemy-cast `treatPlayerAsPackLeader`). Never `spell.name` |
| Open PR queue | #327+, then 2026-09-25 docs. **#371 owns Wave-4 SDE. #411 owns Wave-5 tactical. #463 owns Wave-6 tactical. #480 owns Wave-6 SDE. #533 owns Wave-7 SDE. #525 owns Wave-7 tactical. #563 owns Wave-8 tactical. #558 owns Wave-8 families. #518 owns Wave-8 extra doors.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-7 P0 remain the prerequisite. **Do not land Wave-8 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 8 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥8 rares make it sharper: a CHAMPION may hold the generation-8 verb until leftover AP / walk MP / a living leader is already committed.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 8 fills holes Waves 1–7, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, **#533**, and **#563** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Even Stride, Gait Mend, Pair Hinge, Cadence Flush, Gait Seal, Court Hinge, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 8 stamps `generationMin: 8`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Step Rebate **subtracts 1 MP from the next walk cost** (min 0). It is not `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 8 unique ids do **not** require `currentView`.
15. **Leftover feat doors may be stamped once.** Wave 7 reserved `survivor` / `leader_slayer` / `jackpot` / `spell_master`. This wave stamps **`leader_slayer` and `spell_master` only**. `survivor` stays leftover. `jackpot` stays #185 Absolve.

Innate seed is still **four ids only:** `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

---

## 3. Core mechanic (pointer)

Default discovery rule is Wave 1 §3. All five steps must hold for `ENEMY_DISCOVERY` (and for `MULTI_SOURCE` children that include it):

```
1. Hostile possesses an eligible player-learnable spell id
2. Hostile ACTUALLY USES that id during battle
     (WX applied kind === "cast" that spent AP; not AI consider, not preview)
3. Spell becomes OBSERVED for this (principal, slot, spellId)
4. Player successfully WINS that battle (same encounterId)
5. Spell becomes permanently unlocked in the Spell Library
```

Wave-8 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| Odd Stride **cast** (AP spent), target already rooted | **Yes** — the technique was used |
| Illegal even/0 walk **after** Odd Stride is on them | **No** — that is their failed confirm, not a second observe |
| Step Rebate **arm** | **Yes** on the cast. Paying the cheaper walk later is **not** a second observe |
| Echo Wipe **cast** (even if no paint to erase) | **Yes** if AP was spent |
| Wound Mark **arm** | **Yes** on the mark. Detonation when they later **take a hit** is **not** a second observe |
| Split Plate **arm** | **Yes** on the cast. Later shared incoming is **not** a second observe |
| Chase Mend **cast** with target unmoved (heal 0) | **Yes** — AP was spent |
| Cadence Stall **cast** on a target with no remaining CDs | **Yes** if AP was spent |
| Crown Cut on a non-leader (no bonus) | **Yes** — the technique was used |
| Full Bar **cast** with bar size < 8 (no discount) | **Yes** if AP was spent |
| Pack Tithe aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| About Hinge | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orb pickup / `WF-SPL-*` attune | **No** |
| #563 Gait Mend / Pair Hinge / Dummy Post **cast** | **Yes** on those ids (their own observe). Do not also observe unique §11 ids |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 8 stamps unused **family** attachments, one special MULTI, and **two leftover feat doors**. It does **not** add enum members.

| Source | Wave-8 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥8 family verbs in §11 **plus** #563 stamps in §0.2 |
| `ELITE` | Chase Mend, Cadence Stall, Kennel Sill |
| `ACHIEVEMENT` | Crown Cut ← `leader_slayer`. Full Bar ← `spell_master` |
| `CHALLENGE` | **none** — all nine challenge doors remain claimed through Wave 7 |
| `BOSS` | **none** — live-19 first-wins and extra doors through #518 / #563 stay claimed. About Hinge is `BOSS_ONLY` |
| `SPECIAL_ENCOUNTER` | Odd Stride ← `odd_gallery` (MULTI child; observation not required for that child) |
| `MULTI_SOURCE` | Odd Stride ← locksmith observe+win **or** `odd_gallery`. Crown Cut ← king observe+win **or** `leader_slayer`. Full Bar ← scribe observe+win **or** `spell_master`. First child wins |
| `ENEMY_ONLY` | Pack Tithe (never owned) |
| `BOSS_ONLY` | About Hinge (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-8 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every live feat and challenge from Waves 1–7, #120 / #185 / #282 / #342 / #411 / #463 / #525 / **#563**, plus boss extra doors, **plus this wave’s two feat stamps**:

| Door | Owner |
| :--- | :--- |
| `spell_scholar` | Wave 1 Overcast |
| `explorer` | Wave 2 Search Dust |
| `easy_3` / `hard_3` | Wave 1 Second Wind |
| `easy_2` | Wave 2 Self Anchor MULTI child |
| `hard_2` | Wave 2 Blood Tithe |
| `legendary_2` | Wave 1 live-catalog Timestep |
| Twin Monarchs | Wave 1 Choir Hymn |
| `chessboard_lich` | Wave 2 Claim Ward |
| `echo_dummies` | Wave 1 False Retreat |
| `mist_gallery` | Wave 2 Fog Hood |
| `pacifist_run` | Wave 3 Mercy Hex |
| `easy_1` | Wave 3 Bloodless Plate |
| `crimson_countess` | Wave 3 Crimson Pact |
| `gate_gallery` | Wave 3 Gate Sight |
| `legendary_3` | Wave 3 Back Step MULTI child (not `easy_3`) |
| `critical_striker` | #282 Sidestep Ward |
| `loot_hunter` | #282 Mercy Font |
| `double_betrayal` | #282 |
| `first_blood` | #342 Bias Ray |
| `doka_hoarder` | #342 Surplus Ward |
| `betrayal_witness` | #342 Twin Guard |
| `rich_vampire` | #342 Sated Fang |
| `jackpot` | #185 Absolve MULTI child — **do not restamp** |
| `lord_of_static` | #342 Draw Together MULTI |
| `starborn_queen` / `pale_archivist` / `starved_vampire_pawn` / `final_pawn` | #342 Cut In / After Verse / Sanguine Toll / Eclipse Fold |
| `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` | #411 Mute Thread / Queue Cut / File Vault |
| `ram_castellan` / `fosse_warden` / `stride_censor` / `morrow_herald` | #367 extra doors |
| `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` | #406 extra doors |
| `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` | #463 extra doors — do not restamp. About Hinge uses `about_hinge_regent`, not `about_regent` |
| `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` | #474 extra doors |
| `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` | #518 extra doors |
| `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `pace_prelate` | #525 extra doors |
| `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent` | #563 extra doors — do not restamp |
| `choir_gallery` | Wave 6 Choir Verse MULTI child |
| `even_gallery` | Wave 7 Even Stride MULTI child |
| `hard_1` | Wave 7 Thin Ward MULTI child |
| `legendary_1` | Wave 7 Clean Blood MULTI child |
| **`leader_slayer`** | **this wave** Crown Cut MULTI child (`condition: "leader_slayer"`). Not Coup de Grace |
| **`spell_master`** | **this wave** Full Bar MULTI child (`condition: "spell_master_8"`). Not Overcast / Hex of Silence |

Economy feats stay Doka-only until a designer needs a non-damage identity. `unstoppable` stays unused forever as a spell gate. **Still leftover after this pass:** `survivor` only. Do not stamp `survivor` (Last Ember / Last Ward).

---

## 5. Spell pool evolution — Generation 8 (never a last tier)

Wave 1 §6 five pools and later generation stamps stay. Wave 8 adds the **G≥8 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, 3, 4, 5, 6, 7, 8, … no maximum
R = enemy.level − player.level
T = current tierSize (default 10)
```

| G | Pool policy (additive) |
| :--- | :--- |
| 0 | CORE only (+ Strike if empty) |
| 1 | CORE + one ADVANCED (`generationMin ≤ 1`) |
| 2 | ADVANCED guaranteed; one slot may be `generationMin ≤ 2`; RARE eligible |
| 3 | RARE weight rises; one additional ADVANCED ∪ RARE ∪ ELITE with `generationMin ≤ 3` |
| 4 | one additional ADVANCED ∪ RARE ∪ ELITE with `generationMin ≤ 4` |
| 5 | same recipe at `generationMin ≤ 5` (memory Wave 5; skip if that catalog never ships) |
| 6 | one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with `generationMin ≤ 6` |
| 7 | one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with `generationMin ≤ 7` |
| 8 | one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with `generationMin ≤ 8` |
| 9+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or later G verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **8** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3. if G ≥ 2: one additional slot from ADVANCED ∪ RARE with generationMin ≤ G
  4. if rare roll hits: at most one RARE_POOL id with generationMin ≤ G
  5. if G ≥ 3: one additional ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
  6. if G ≥ 4: one additional ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
  7. if G ≥ 5: one additional (skip if no legal id)
  8. if G ≥ 6: one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with generationMin ≤ G
  9. if G ≥ 7: one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with generationMin ≤ G
  10. if G ≥ 8: one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with generationMin ≤ G
  11. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  12. drop any id whose AI_REQUIREMENTS are unmet
  13. keep ENEMY_ONLY on enemies (they cast; they never grant)
  14. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at WX 11920).

Do **not** put unique §11 ids in #405 CORE, #452 CORE, or #558 CORE. Those families already consume #342 / #411 / **#525** identities.

---

## 6. New `aiHint` keys (metadata, not names)

Prior-wave hints still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `force_odd_manhattan_walk` | caster, controller | Target likely to walk ≥ 1; skip if rooted or MP = 0 |
| `forbid_spell_until_walk` | guardian, caster | Target is in range of a 3+ AP spell and has not walked; skip if they already walked this turn |
| `next_spell_unit_only` | caster, controller | Target’s next likely action is a ground-targeted spell; skip if they have no such id |
| `rebate_next_walk_mp` | kiter, flanker | Caster intends to walk ≥ 1 after arming; skip if already adjacent and Strike is better |
| `attract_toward_nearest_hostile` | controller, caster | A living hostile-to-target (not the caster) exists; landing cell free; skip if none or already adjacent |
| `erase_last_paint_adjacent` | caster | A painted hazard exists; an occupied Chebyshev-1 neighbor of that cell is the player path; skip if no paint |
| `bonus_if_open_floor` | charger, caster | Target cell has 0 Chebyshev-1 blocking tiles; skip if they hug a wall (use Wall Bite / Wall Sting) |
| `detonate_on_hit` | caster, controller | Caster expects the target to be hit this round (ally Strike queued or overwatch); skip if they will not be hit |
| `split_incoming_adjacent_ally` | guardian, tank | Living allied body Chebyshev-1; skip if none |
| `forbid_strike_until_spell` | caster, controller | Target is adjacent and likely to Strike; skip if they already cast a non-Strike id this turn |
| `next_walk_ignores_pit` | kiter, flanker | A pit / open-pit / wick-convert sits on the caster’s 1-tile path; skip if no pit |
| `self_buff_if_zero_leftover_ap` | guardian, tank | Caster leftover AP = 0 at resolve **or** they intend to spend down to 0 this turn; skip if leftover ≥ 2 and they still need a 3 AP spell |
| `forbid_summon_leave_cell` | caster, controller | Hostile summon standing on a cell the caster can paint; skip if none |
| `heal_if_target_walked` | healer, buffer | Target spent ≥ 1 walk MP this turn **and** missing HP ≥ 8; skip if unmoved. **Never** put in non-healer CORE |
| `stall_all_remaining_cds` | caster, controller | Target has ≥ 1 kit id with remaining CD ≥ 1; skip if all CDs are 0 (use Crack / Flush instead) |
| `bonus_if_target_is_leader` | caster, charger | Target `isLeader === true` **or** (enemy-cast only) player primary with `treatPlayerAsPackLeader`; skip if neither |
| `cheaper_if_bar_full` | buffer, caster | Self: kit size ≥ 4 (enemy analog of 8-bar). Player copy: `spellBarOrder.length ≥ 8`. Skip if not |
| `pack_siphon_leftover` | buffer | CHAMPION only; skip if aura up or no ally in 2 with leftover ≥ 2 |
| `fold_180_player_side` | **boss AI only** | Exactly two living player-side bodies; skip if 0–1 |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

Prior-wave hints stay on those catalogs. Do not re-author them. Do not assign Face Away / Oncoming / Glance Cut / About Face / Shove Face until a battle `currentView` writer exists.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: `pendingAchievementToast` at `WorldExploration.tsx` 2173 / 17949. **Do not grow WX.**
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Step Rebate may add a **battle-log line** when the cheaper walk is paid (`STEP REBATE −1 MP`) — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.
- Feat MULTI children (`leader_slayer` / `spell_master`) show `NEW SPELL DISCOVERED` on the **same** recap as the feat Doka. Do not add a second popup.
- Odd-walk fail, empty-bar Full Bar, and Wound Mark detonation are **not** a second cue.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 8 adds **no** new canister methods.

| Writer | Wave-8 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | `odd_gallery` / `leader_slayer` / `spell_master` MULTI children (victory or feat claim, no observation). **No** challenge/boss stamps this wave |

Rules that must stay true:

- Enqueue on `createProgressPersist`. `commit` after the canister write.
- Grant is owned-id **append only**.
- Must not call `upgradeSpell` (charges `spellLevelingBaseCost * 2^level`).
- Must not call `updateCharacter`.
- Must not mint Doka/XP.
- Must not reset `spellLevelKeys`.
- Duplicate victory callback → empty grant list.
- Duplicate feat-claim callback → empty grant list (idempotent).
- Death penalty (`saveBattleStats` 20/40) does not touch owned/observed.
- `localStorage` is cache only.
- Foe Reel / About Hinge landings use existing hazard helpers when a body lands on lava/spikes (`recordInBattleChallengeDamage` while `inBattleRef`).
- Chase Mend self-heal / ally heal uses existing heal helpers; challenge `no_healing` flips only when HP actually increased.
- Loaner orbs / `WF-SPL-*` attune never write `ownedSpellIds`.
- `spell-pack-tithe` / `spell-about-hinge` never write `ownedSpellIds`.

---

## 9. Special encounters (Wave 8)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is `unlockOwnedSpell` / observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms. **Do not** reuse encounter-catalog `ENC-*` ids or world-feature `WF-*` ids as spell tags.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `odd_gallery` | Axis Locksmith + pawn; locksmith prefers Odd Stride when the player has a 1-tile diagonal-or-2-step path | `spell-odd-stride` on **victory** (no observation — `SPECIAL_ENCOUNTER` MULTI child) **or** observe+win if the id is used. **Not** `even_gallery` and **not** `WF-ELT-EVEN_PICKET` |
| `rebate_nave` | Tide Shade on a 3-tile corridor; AI prefers Step Rebate then walks 1 | `spell-step-rebate` via observe+win. **Not** Wave-7 `toll_nave` (Walk Toll) |
| `wipe_gallery` | Ember Knight on an existing cinder cell the player must stand on; AI prefers Echo Wipe of that cell | `spell-echo-wipe` via observe+win. **Not** Wave-7 `paint_gallery` (Echo Paint) |
| `mark_court` | Hex Chorister + pawn; chorister prefers Wound Mark then waits for the pawn Strike | `spell-wound-mark` via observe+win |
| `stall_nave` | Cadence Thief + Inferno queen; thief prefers Cadence Stall when Inferno is on CD | `spell-cadence-stall` via observe+win |

Prior specials (`echo_dummies`, `rime_gallery`, `still_court`, `mist_gallery`, `undertow_channel`, `ember_fan`, `rift_twins`, `long_gallery`, `gate_gallery`, `triune_gallery`, `haze_gallery`, `stolen_pulpit`, `nail_court`, `pit_gallery`, memory Wave-5 `gaze_gallery` / `span_court` / `lintel_hall` / `cadence_nave` / `soft_gallery`, Wave-6 `choir_gallery` / `wick_gallery` / `purse_nave` / `pet_sill_hall` / `dull_court`, Wave-7 `even_gallery` / `toll_nave` / `lock_nave` / `paint_gallery` / `ghost_court`) are not re-specified.

About Hinge occupancy is not `map.portals` and not Twin/Triune/Twin Span/Triple Span/Pair Hinge tables. `WF-SPL-ECHO_SCRIBE` / `WF-SPL-LOANER_MAGE` / loaner orbs never write `ownedSpellIds`.

---

## 10. Balance doctrine — holes this wave fills

Prior waves + tactical catalogs already cover: push, pull, blink, root, range buff **and** cut, absorb, redirect, cleanse, burn tile, trap, AP zone, turret, pet, bounce, next-spell AP tax, cone, two-body swaps, portal-pair, evade, leftover-AP evade, distance poke, MP/AP steal, pit, heal totem, walk-brand, conveyor, axis lock, mass shove, delayed blink, pincer, diagonal poke, pair attract, ally shove, origin-cast tax, intercept pylon, HP+MP hybrid, facing bonus/lock/front-cell, next-spell silence, walk-then-fizzle, end-of-turn insert, ally teleport 3–4, rigid two-cell occupy, stationary 2-cell pylon, cooldown steal, attacker +1 CD, hit redirect to ally, HP%-gated walk, act-sooner tax, delayed-on-act, caster-unmoved poke, leftover-AP **target** bonus, LoS-blocked poke, 90° hinge, file-axis attract, walking two-cell occupy, Strike-only brand, primary-target veil, self CD reset to 0, ally CD −1, leftover-AP share, walk-exit AP tax, enter-swap tile, spark whelp, hit cap 12, mass facing invert, copy last **ally** id, force next walk **diagonal**, bonus on **paint**, leftover AP → this hit, walk **through me** AP tax, swap **own summon**, +range if LoS **blocked**, invert **one** view, next Strike **0**, cell forbids **summon enter**, leftover burns at **turn end**, share incoming to a **summon**, cut hostile summon **lifespan**, shared axis cannot be **spell primary**, next forced-move skips **hazard**, leftover 0 → +1 range, next 1-tile walk skips overwatch, pack leftover-AP aura, fold two **adjacent** player-side bodies, even Manhattan walk, cannot Strike until walk, next spell ground-only, next walk +1 MP, leftover AP freeze, pull toward ally, copy last paint, cannot Swap/blink/pad, enter +MP, 50/50 two clustered hostiles, bonus if adj block, detonate on **their** cast, pause summon lifespan, steal summon CD, occupy last cell left, incoming cap 30, ignore LoS if untouched, pack leftover-0 veil, fold shared file, heal if **caster** walked, 90° pair hinge, ally all-CD flush, isolated-target poke, delayed absorb, cannot walk / can cast, diagonal-only walk, slide existing barrier, delayed tile heal, return-half poke, dump leftover AP to ally, dummy taunt post, enter heal, unit next-hit ×1.5, split heal, mass pair-hinge.

**Still open (Wave 8 SDE unique ids).** Held holes from §0.3 stay held.

| Hole | Wave-8 id | Why it is not a clone |
| :--- | :--- | :--- |
| Next walk Manhattan **odd** | `spell-odd-stride` | Even Stride forces **even**. Bias Step forces **diagonal**. Diag Lock is walk-shape, not parity. Misstep is **cardinal** |
| Cannot resolve a **spell** until they walk | `spell-cast-hold` | Strike Hold forbids **Strike**. Gait Seal forbids **walk**. Must Pace requires walk to **cast**. Mute Thread fizzles the next **any** id |
| Next spell must target a **unit** | `spell-unit-oath` | Ground Oath is the inverse (ground only) |
| Next walk **−1 MP** (min 0) | `spell-step-rebate` | Walk Toll is **+1**. Spare Pace is +1 **now**. Gift Sill / Exit Boon are cell enter/leave. Not `spell.mpCost` |
| Pull 1 toward nearest **other hostile** | `spell-foe-reel` | Ally Reel is toward an **ally**. File Reel is along shared axis toward **caster**. Draw Together is pair attract |
| Erase adjacent **paint** | `spell-echo-wipe` | Echo Paint **copies**. Cleanse Rite strips **unit** buffs. Dispel Thread strips buffs |
| Bonus if **no** adjacent block | `spell-field-bite` | Wall Bite / Wall Sting want a hug. Lone Sting wants isolation of **bodies**, not walls |
| Mark detonates when they **take a hit** | `spell-wound-mark` | Cast Mark detonates on **their** cast. Body Mark is next-hit **amp**. Split Mark is a **tile** |
| Split **incoming** 50/50 with adj ally | `spell-split-plate` | Flank Share is **outgoing**. Load Bearing is % share. Cover Step redirects the **whole** hit |
| Cannot Strike until a **spell** resolves | `spell-verse-first` | Oath Blade makes **other** ids fizzle (Strike still hurts). Once Verse bans recast. Strike Hold bans Strike until **walk** |
| Next 1-tile walk treats **pit** as floor | `spell-pit-skip` | Safe Fall skips **hazard ticks** on forced-move. Gap Ward skips **overwatch**. Open Pit still exists |
| 0 leftover AP → +RES | `spell-empty-plate` | Planted Stance is 0 **walk MP**. Still Brand punishes **target** 0 MP. Purse Lock **freezes** leftover |
| Summons cannot **leave** the cell | `spell-kennel-sill` | Pet Sill forbids **enter**. Kennel Lock leashes **allied**. Keep Kennel **adds** allied lifespan |
| Heal iff **target** walked | `spell-chase-mend` | Gait Mend is **caster** walked. Post Sting is unmoved **damage**. Enter Mend is a **tile** |
| +1 **all** remaining CDs on a hostile | `spell-cadence-stall` | Cadence Flush **zeros ally** CDs. Cadence Crack zeros **highest one**. Cadence Theft **steals** 1 |
| Bonus vs `isLeader` | `spell-crown-cut` | Coup de Grace is low-HP execute. Summon Bane is `isSummon`. `leader_slayer` identity |
| Next spell −1 AP if bar has 8 | `spell-full-bar` | Overcast is range. Hex of Silence is full-bar **lock** (still unowned). `spell_master` identity |
| Pack siphon leftover AP to champion | `spell-pack-tithe` | Pack Still is leftover-0 **veil**. Pack Tempo is +AP. Never owned |
| 180° rotate two player-side bodies around midpoint | `spell-about-hinge` | Pair Hinge is 90° of **hostiles-to-caster**. Court Hinge is mass. File Fold is shared file. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll / Undertow / Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 8)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–7, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, or **#563**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique Wave-8 row. Step Rebate is a walk-pool flag.

### 11.1 New `effectParams` keys (Wave 8 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #533 / #563 key names for a different meaning.

```text
oddManhattanWalk,                 // Odd Stride — next walk |dx|+|dy| must be odd
forbidSpellUntilWalk,             // Cast Hold — non-Strike ids illegal until a walk MP spend
nextSpellUnitOnly,                // Unit Oath
rebateNextWalkMp,                 // Step Rebate — next walk cost −1, min 0
attractTowardNearestHostile,      // Foe Reel
erasePaintAdjacent,               // Echo Wipe
openFloorBonus, openFloorDamage,  // Field Bite — 0 Chebyshev-1 blocking tiles
detonateOnHit, woundMarkDamage,   // Wound Mark
splitIncomingAllyPct,             // Split Plate — 0.5 with Chebyshev-1 ally
forbidStrikeUntilSpell,           // Verse First
nextWalkIgnoresPit,               // Pit Skip — 1-tile walk only
emptyLeftoverRes, emptyLeftoverDuration,
forbidSummonLeaveCell, kennelSillDuration,
requireTargetWalkedHeal, chaseMendAmount,
stallAllRemainingCds,             // Cadence Stall — +1 every remaining CD
leaderBonusDamage, treatPlayerAsPackLeader,
fullBarApDiscount, fullBarMinEquipped,
packSiphonLeftover, packSiphonRadius,
fold180PlayerSide
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` is **not** reused.

---

### SPELL_ID: `spell-odd-stride`

NAME: Odd Stride  
ROLE: CONTROL — next walk Manhattan odd  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via locksmith; false if via `odd_gallery`  
MINIMUM_ELIGIBILITY: Family `axis_locksmith`; `G ≥ 8`; `aiProfile` caster/controller. **Or** victory in `odd_gallery`  
ENEMY_FAMILIES: `axis_locksmith`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥8. `generationMin: 8`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. The target’s **next walk** this turn (or 2 turns) must have odd Manhattan length (`|dx|+|dy| ∈ {1,3,5,…}`). A 1-step cardinal is legal; a 2-step cardinal is not; a (1,1) diagonal is even (2) and **illegal**. Confirm fails closed; MP not spent (`effectParams: {"oddManhattanWalk":true}`). Distinct from Even Stride (even only), Bias Step (diagonal only), Diag Lock (#563, diagonal walks), Rank Lock (axis), Misstep (cardinal). Teleport / Swap / shove do not pay.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "force_odd_manhattan_walk"`. Skip if rooted or MP = 0.  
PLAYER_COUNTERPLAY: Walk 1; Haste; blink; wait the duration  
SYNERGIES: `odd_gallery`; Rank Lock then they cannot take the legal 1-step on-axis if that axis is even-length to the dest; Mire Sheet on the 1-step  
BALANCE_RISK: Odd + Even on the same target is a brick. Last writer on the walk-parity flag. CD 2 + G≥8.  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `odd_gallery` victory. First MULTI child wins. Failed later walk is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cast-hold`

NAME: Cast Hold  
ROLE: CONTROL — cannot resolve a spell until they walk  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 8`; `aiProfile` guardian/caster  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥8. `generationMin: 8`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 1 turn. The target cannot confirm a **non-Strike** spell until they spend ≥ 1 **walk** MP this turn (`effectParams: {"forbidSpellUntilWalk":true}`). Strike stays legal. Forced-move does **not** clear the hold. Distinct from Strike Hold (Strike illegal until walk), Gait Seal (walk illegal, spells legal), Must Pace (next spell fizzles unless they walked), Mute Thread (next any id fizzles).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_spell_until_walk"`. Skip if they already walked or if they only have Strike.  
PLAYER_COUNTERPLAY: Walk 1 then nuke; Strike through it; Dispel  
SYNERGIES: Root first (they cannot pay); Gait Seal on a different target — do not stack both on one body (last writer)  
BALANCE_RISK: Hold + Root is a full lockout of spells. 1 turn + CD 2 + Strike still works.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-unit-oath`

NAME: Unit Oath  
ROLE: CONTROL — next spell must target a unit  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pit_mason` or `origin_mason`; `G ≥ 8`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `pit_mason`, `origin_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥8. `generationMin: 8`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 1 turn. The target’s next spell must have `targetType` in `{enemy, ally, self}` — ground / freeCells / line-paint confirms fail closed, AP not spent (`effectParams: {"nextSpellUnitOnly":true}`). Strike is a unit id and remains legal. Distinct from Ground Oath (inverse), Aim Veil (cannot be primary), Hex of Silence (full bar).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_unit_only"`. Skip if they have no ground id.  
PLAYER_COUNTERPLAY: Strike / Frost / self buffs; wait 1 turn; Dispel  
SYNERGIES: Cinder Tile / Open Pit in hand become dead; File Lance still legal if it targets a unit  
BALANCE_RISK: Oath + Ground Oath is a brick. Last writer. 1 turn.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-step-rebate`

NAME: Step Rebate  
ROLE: SUPPORT — next walk −1 MP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `recoil_squire`; `G ≥ 8`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `tide_shade`, `recoil_squire`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥8. `generationMin: 8`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Arm. The caster’s **next walk** this turn costs 1 less MP (min 0) (`effectParams: {"rebateNextWalkMp":true}`). Not `spell.mpCost`. Distinct from Walk Toll (+1 cost on **them**), Spare Pace (+1 leftover **now**), Gift Sill / Exit Boon (cell enter/leave). Forced-move does not consume the rebate.  
SCALING: rebate fixed  
AI_REQUIREMENTS: `aiHint: "rebate_next_walk_mp"`. Arm then walk ≥ 1. Skip if already adjacent and Strike is better, or MP is already 0 and they will not walk.  
PLAYER_COUNTERPLAY: Root / Gait Seal so they cannot spend the rebate; make them Strike instead  
SYNERGIES: `rebate_nave`; Boot Sting after the paid step; Mire Sheet still taxes **enter**, not this flag  
BALANCE_RISK: Rebate + Spare Pace + Exit Boon is three extra tiles. Self-only + CD 2 + one walk. Combined paper still has only three `mpCost > 0` ids.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The later cheap walk is not a second observe. Also the intended `rebate_nave` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-foe-reel`

NAME: Foe Reel  
ROLE: POSITION — pull 1 toward nearest other hostile  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `hook_chaplain` or `file_reeler`; `G ≥ 8`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `hook_chaplain`, `file_reeler`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 8`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Attract the target 1 tile toward the nearest living **hostile-to-the-target** that is not the caster (`applyAttract` dest = that body’s cell, distance 1) (`effectParams: {"attractTowardNearestHostile":true}`). If none, or the step is blocked / void / portal, fizzle that slide (AP spent). Distinct from Ally Reel (toward **ally**), File Reel (along shared axis toward **caster**), Draw Together (pair), Hook Line (to caster).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_hostile"`. Prefer a slide onto rime / cinder / ally overwatch. Skip if no second hostile or both steps blocked. Do not assign until `applyAttract` has a production cast caller (Ally Reel is the first; this is the second dest flavor).  
PLAYER_COUNTERPLAY: Isolate (no second body); occupy the toward-tile; Barrier  
SYNERGIES: Split Fang / Crowd Tax after they cluster; Wound Mark then pawn Strike  
BALANCE_RISK: Clustering into Inferno / Nova is the combo. AI value-check; player copy can huddle their own summons.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Blocked slide still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-echo-wipe`

NAME: Echo Wipe  
ROLE: TERRAIN — erase adjacent paint  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `ember_knight` or `fuse_binder`; `G ≥ 8`; `aiProfile` caster  
ENEMY_FAMILIES: `ember_knight`, `fuse_binder`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥8. `generationMin: 8`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. If the targeted floor cell has a painted hazard (cinder / rime / mire / fuse / wick / glyph) **or** is Chebyshev-1 from one, erase **one** such paint (nearest to the target cell, last-writer table) (`effectParams: {"erasePaintAdjacent":true}`). No damage. If no paint, fizzle (AP spent). Distinct from Echo Paint (copy onto a neighbor), Cleanse Rite (unit), Dispel Thread (buffs), Absolve (ally cleanse).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "erase_last_paint_adjacent"`. Erase paint the player is standing on or must enter. Skip if no paint.  
PLAYER_COUNTERPLAY: Don’t stand on paint; re-paint after; Barrier the cell  
SYNERGIES: `wipe_gallery`; Cinder Tile then wipe the only safe tile; Mend Wick is delayed **heal** paint — wiping it is counterplay  
BALANCE_RISK: Wiping the player’s only Cinder / pit path is mean. One cell + CD 2. Maps stay solvable — this is a paint erase, not a wall.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty wipe still observes. Also the intended `wipe_gallery` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-field-bite`

NAME: Field Bite  
ROLE: DAMAGE — bonus if no adjacent block  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `rust_reaver`; `G ≥ 8`; `aiProfile` charger/caster  
ENEMY_FAMILIES: `glass_sniper`, `rust_reaver`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥8. `generationMin: 8`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target cell has **0** Chebyshev-1 blocking tiles (barrier / wall / pit occupancy / span post), deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"openFloorBonus":true,"openFloorDamage":8}`). Distinct from Wall Bite (bonus if **adj block**), Wall Sting (target adj **barrier**), Lone Sting (0 adj **bodies**).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_open_floor"`. Skip if they hug a wall and Wall Bite / Wall Sting is in kit.  
PLAYER_COUNTERPLAY: Hug a Barrier / pit / span; Smoke; stand in a corner  
SYNERGIES: Brick Shift to pull a wall off them; Echo Wipe is not a block  
BALANCE_RISK: 18 on open floor is Frost-adjacent at 2 AP CD 1. Open-floor gate. Do not also add isolation.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wound-mark`

NAME: Wound Mark  
ROLE: CONTROL — detonates when they take a hit  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `hex_chorister` or `fuse_binder`; `G ≥ 8`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `hex_chorister`, `fuse_binder`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 8`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Arm a unit mark, 2 turns, 1 charge. The next time the target **takes a damaging hit** (Strike or spell; not DoT tick, not lava/spikes), deal 10 as a second `dealDamage` and consume (`effectParams: {"detonateOnHit":true,"woundMarkDamage":10}`). Distinct from Cast Mark (detonate on **their** cast), Body Mark (amp the hit itself), Split Mark / Mark (tiles).  
SCALING: 10 follows dmg%  
AI_REQUIREMENTS: `aiHint: "detonate_on_hit"`. Arm then have an ally Strike / overwatch. Skip if no follow-up hit this round.  
PLAYER_COUNTERPLAY: Don’t get hit; Cleanse; wait 2 turns; DoT only (does not detonate)  
SYNERGIES: `mark_court`; Foe Reel then pawn Strike; Hold Ground overwatch  
BALANCE_RISK: Mark + ally Inferno is 10 extra on a nuke. 1 charge + CD 2 + no environmental detonate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonation is not a second observe. Also the intended `mark_court` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-split-plate`

NAME: Split Plate  
ROLE: DEFENSE — split incoming 50/50 with adjacent ally  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `leash_warden`; `G ≥ 8`; `aiProfile` guardian/tank  
ENEMY_FAMILIES: `plate_warden`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 8`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 charge, 2 turns. The next incoming damaging **hit** (not DoT, not lava) is split 50/50 with one living allied body at Chebyshev-1 (lowest HP allied, then nearest). If no ally at **hit** time, full hit, charge gone (`effectParams: {"splitIncomingAllyPct":0.5}`). Distinct from Flank Share (outgoing 50/50), Load Bearing (incoming %), Cover Step (whole redirect), Pain Link (tether %).  
SCALING: ratio fixed  
AI_REQUIREMENTS: `aiHint: "split_incoming_adjacent_ally"`. Skip if no ally.  
PLAYER_COUNTERPLAY: Isolate the tank; AoE both; wait 2 turns  
SYNERGIES: Goad the tank; Turn Cap on the ally’s half  
BALANCE_RISK: Splitting Inferno onto a 1-HP ally is a kill transfer. Missing-ally fail closed. CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The later split is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-verse-first`

NAME: Verse First  
ROLE: CONTROL — cannot Strike until a spell resolves  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `once_cantor` or `verse_scribe`; `G ≥ 8`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `once_cantor`, `verse_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥8. `generationMin: 8`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 1 turn. The target cannot confirm Strike until they have **resolved** a non-Strike spell this turn (`effectParams: {"forbidStrikeUntilSpell":true}`). Distinct from Oath Blade (other ids fizzle, Strike hurts), Once Verse (cannot recast last id), Strike Hold (Strike illegal until **walk**), Dull Edge (Strike deals 0).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_strike_until_spell"`. Skip if they already cast a spell or if they have no non-Strike id.  
PLAYER_COUNTERPLAY: Cast anything cheap then Strike; wait; Dispel  
SYNERGIES: Quiet Hex after they dump a 2-AP spell to unlock Strike; Mute Thread their unlock spell  
BALANCE_RISK: Verse First + Mute Thread can eat the unlock. 1 turn + Strike still exists after a 2-AP tax.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pit-skip`

NAME: Pit Skip  
ROLE: POSITION — next 1-tile walk treats pit as floor  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pit_mason` or `wick_painter`; `G ≥ 8`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `pit_mason`, `wick_painter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 8`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Arm. The caster’s **next 1-tile walk** this turn treats Open Pit / Pit Wick converted occupancy as floor (walkable, LoS already open). Does **not** ignore lava/spikes/void/portals/barriers (`effectParams: {"nextWalkIgnoresPit":true}`). Walks of length ≥ 2 do not consume and stay illegal through the pit. Distinct from Safe Fall (forced-move skips **hazard ticks**), Gap Ward (skips overwatch), Ghost Step (occupies vacated cell).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_walk_ignores_pit"`. Skip if no pit on a 1-tile path.  
PLAYER_COUNTERPLAY: Don’t leave a 1-tile pit gap; Barrier the far cell; lava on the far side  
SYNERGIES: Open Pit then skip it; Pit Wick convert then step; Spare Pace is a different extra tile  
BALANCE_RISK: Skipping the only pit plug is a solvability leak. 1-tile only + CD 3 + pits only. Maps must still have a floor path for the **player**.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The later step is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-empty-plate`

NAME: Empty Plate  
ROLE: DEFENSE — 0 leftover AP → +RES  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `tempo_precentor`; `G ≥ 8`; `aiProfile` guardian/tank  
ENEMY_FAMILIES: `plate_warden`, `tempo_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥8. `generationMin: 8`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If the caster’s **leftover AP is 0** at resolve, gain `buffStat: "res"`, `buffModifier: 1.20`, 2 turns (`effectParams: {"emptyLeftoverRes":1.20,"emptyLeftoverDuration":2}`). If leftover ≥ 1, fizzle (AP spent — leftover then 0, but the gate was pre-spend). Distinct from Planted Stance (0 **walk MP**), Still Brand (punish **their** 0 MP), Purse Lock (freeze leftover).  
SCALING: modifier fixed  
AI_REQUIREMENTS: `aiHint: "self_buff_if_zero_leftover_ap"`. Cast as the last action. Skip if they still need a 3 AP spell.  
PLAYER_COUNTERPLAY: Don’t let them dump AP; Dispel; Pull so they want leftover for Strike  
SYNERGIES: Leftover Lend (#563) dumps AP onto an ally then this buffs; Pack Still is leftover-0 **veil**, not RES  
BALANCE_RISK: 1.20 + Iron Skin last-writer. Gate is leftover 0 + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-kennel-sill`

NAME: Kennel Sill  
ROLE: CONTROL — summons cannot leave the cell  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `leash_warden`; variant ≥ ELITE or `G ≥ 8`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 8`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. Hostile **summons** (`isSummon === true`) occupying it cannot **leave** by walking (confirm fails, MP not spent). Player bodies walk freely. Summon **enter** is still legal (Pet Sill is the inverse). Teleport / Swap off the cell still work unless Blink Seal / Claim Ward is also up (`effectParams: {"forbidSummonLeaveCell":true,"kennelSillDuration":2}`). Distinct from Pet Sill (cannot **enter**), Kennel Lock (leash **allied**), Short Leash (lifespan → 1), Keep Kennel (add allied life).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_summon_leave_cell"`. Paint under a hostile summon. Skip if none.  
PLAYER_COUNTERPLAY: Don’t park pets; Swap / Sever; wait 2 turns  
SYNERGIES: Pet Sill on the escape cell; Summon Bane while they are stuck  
BALANCE_RISK: Parking a wolf on a corridor is a plug. Summon-only + 2 turns + Elite. Player body always walks.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-chase-mend`

NAME: Chase Mend  
ROLE: SUPPORT — heal iff the target walked  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 8`; `aiProfile` healer/buffer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 8`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 1  
EFFECT: `spellType: "heal"`, `healAmount: 8`. If the **target** spent ≥ 1 walk MP this turn, heal 8 through the existing heal helper (honor `healRecv`). If they have not walked, heal is 0 — AP still spent (`effectParams: {"requireTargetWalkedHeal":true,"chaseMendAmount":8}`). Distinct from Gait Mend (#563, **caster** walked), Enter Mend (tile), Split Mend (50/50), Mend Wick (delayed tile), Post Sting (unmoved **damage**). Forced-move does not count.  
SCALING: 8 follows healRecv only  
AI_REQUIREMENTS: `aiHint: "heal_if_target_walked"`. Healer / buffer only. Skip if target `walkMpSpentThisTurn < 1` or missing HP < 8. **Never** put in non-healer CORE (`inferArchetype` still maps `healAmount > 0` to healer).  
PLAYER_COUNTERPLAY: Root the ally; Cursed Wound; don’t let them walk  
SYNERGIES: Spare Pace / Step Rebate fund the walk; Boot Sting is the damage sibling of “already walked”  
BALANCE_RISK: 8 is below Mend’s 12 because the walk is the rest of the cost. `no_healing` / `hard_1`: HP actually increased fails those challenges; 0-heal fizzle does not.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. 0-heal still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-stall`

NAME: Cadence Stall  
ROLE: CONTROL — +1 all remaining CDs on a hostile  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `cadence_thief`; variant ≥ ELITE or `G ≥ 8`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `cadence_thief`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 8`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Once/battle per caster. Add +1 remaining cooldown to **every** kit id on the target that currently has remaining CD ≥ 1 (`effectParams: {"stallAllRemainingCds":true}`). Ids at 0 are unchanged (this is not a lockout). Distinct from Cadence Flush (#563, **ally** all → 0), Cadence Crack (hostile **highest one** → 0), Cadence Theft (steal 1), Cadence Lend (ally −1).  
SCALING: +1 fixed  
AI_REQUIREMENTS: `aiHint: "stall_all_remaining_cds"`. Skip if the target has no remaining CDs (use Crack / Mute instead). Cadence Theft stays the G5/G6 verb on this family; this is the G8 extra.  
PLAYER_COUNTERPLAY: Don’t start CDs; Dispel; Timestep is AP/MP not CD  
SYNERGIES: `stall_nave`; Crack then Stall does nothing useful — AI must pick one; Inferno CD 3 → 4 is the spike  
BALANCE_RISK: Stalling a 5-id kit is a full extra turn of silence on those ids. Once/battle + Elite + ids-at-0 untouched.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Also the intended `stall_nave` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-crown-cut`

NAME: Crown Cut  
ROLE: DAMAGE — bonus vs leader  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via king observe; false if via `leader_slayer`  
MINIMUM_ELIGIBILITY: Family `coil_arbiter` or pieceType `king` with `isLeader`; `G ≥ 8`; `aiProfile` caster/charger. **Or** claim achievement `leader_slayer`  
ENEMY_FAMILIES: `coil_arbiter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥8. `generationMin: 8`  
RARITY: RARE  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 12. If the target `isLeader === true`, deal an extra 12 as a second `dealDamage` (`effectParams: {"leaderBonusDamage":12}`). Enemy-cast only may set `treatPlayerAsPackLeader: true` so a king demonstrating the verb can observe against the player primary (not summons). Player copy **never** treats a non-leader player-side body as a leader. Distinct from Coup de Grace (low-HP execute), Summon Bane (`isSummon`), Sated Fang (overheal). Reads `isLeader`, never `spell.name` or `"king"` in the unit name.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_is_leader"`. Skip if neither `isLeader` nor (enemy-cast pack-leader flag). Do not assign to a kit that cannot see `isLeader`.  
PLAYER_COUNTERPLAY: Kill the king last; don’t stand as the only primary; Barrier  
SYNERGIES: `leader_slayer` identity (kill a leader) without cloning Coup; Foe Reel a king into range  
BALANCE_RISK: 24 vs a leader is Inferno-adjacent at 3 AP. Leader flag + CD 2. Player copy is niche by design (pack kings).  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `leader_slayer` claim. First MULTI child wins. Duplicate feat callback grants nothing. No Doka from the grant. Feat Doka still comes from `claimAchievementReward`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-full-bar`

NAME: Full Bar  
ROLE: SUPPORT — next spell −1 AP if 8 equipped  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via scribe observe; false if via `spell_master`  
MINIMUM_ELIGIBILITY: Family `bone_scribe`; `G ≥ 8`; `aiProfile` buffer/caster. **Or** claim achievement `spell_master`  
ENEMY_FAMILIES: `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥8. `generationMin: 8`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Arm 1 turn. The caster’s next spell this turn costs 1 less AP (min 1) **if** they have ≥ 8 ids on `spellBarOrder` (player) or ≥ 4 assigned kit ids (enemy analog of a full bar) (`effectParams: {"fullBarApDiscount":1,"fullBarMinEquipped":8}`). If the bar is not full, fizzle (AP spent, no discount). Distinct from Overcast (range), Hex of Silence (full-bar **lock**, still unowned), Tempo Gift / Loan Tempo (grant AP), Spare Pace (walk MP). Does not splice the turn.  
SCALING: discount fixed  
AI_REQUIREMENTS: `aiHint: "cheaper_if_bar_full"`. Skip if kit size < 4.  
PLAYER_COUNTERPLAY: Keep 7 equipped; Quiet Hex the discounted nuke; wait CD 3  
SYNERGIES: `spell_master` identity (8 equipped) without cloning Hex of Silence; Inferno at 4 AP is the spike  
BALANCE_RISK: Inferno 5→4 with a full bar is real. Gate is 8 equipped + CD 3 + min cost 1. Do not also grant a 9th bar slot (that is persist / UI).  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `spell_master` claim. First MULTI child wins. Duplicate feat callback grants nothing. No Doka from the grant. Does not write extra `spellBarOrder` slots.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-tithe`

NAME: Pack Tithe  
ROLE: SUPPORT — siphon leftover AP from allies to the champion  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `cadence_lender`; variant CHAMPION; `G ≥ 8`  
ENEMY_FAMILIES: `cadence_lender`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 8`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. At the start of this caster’s turn, each living ally at Chebyshev ≤ 2 with leftover AP ≥ 2 loses 1 leftover AP and this caster gains 1 (cap at max AP) (`effectParams: {"packSiphonLeftover":true,"packSiphonRadius":2}`). Distinct from Pack Still (leftover-0 veil on `tempo_precentor`), Pack Tempo (+AP aura), Pack Ledger (bank leftover), Leftover Lend (dump yours). **Never owned.** Optional dim `UNKNOWN TECHNIQUE` log.  
SCALING: 1 AP per ally fixed  
AI_REQUIREMENTS: `aiHint: "pack_siphon_leftover"`. CHAMPION only. Skip if aura up or no ally with leftover ≥ 2. Do not put this on `tempo_precentor` (Pack Still already owns that CHAMPION aura). Do not put this on `hex_chorister`.  
PLAYER_COUNTERPLAY: Kill the champion; isolate allies; spend their leftover before the siphon tick  
SYNERGIES: Cadence Lend is ally −1 CD, not this; Purse Cut freezes **player** leftover  
BALANCE_RISK: Three allies donating 1 AP is a second Inferno. CHAMPION + 4 AP + never owned.  
PERSISTENCE_REQUIREMENTS: Never write `ownedSpellIds` / `observedSpellIds`. Aura ticks are not observation.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-about-hinge`

NAME: About Hinge  
ROLE: POSITION — 180° rotate two player-side bodies around their midpoint  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Extra door `about_hinge_regent` (not a live `BossId`). Kit-only  
ENEMY_FAMILIES: none (boss kit)  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 8`  
RARITY: RARE  
AP_COST: 5  
RANGE: 4  
TARGET_TYPE: special  
LOS: false  
COOLDOWN: 4  
EFFECT: If exactly two living **player-side** bodies exist, rotate both 180° around their midpoint (each dest must be free floor). Occupancy / void / portal / barrier: fizzle that rotate (AP spent, no move) (`effectParams: {"fold180PlayerSide":true}`). Distinct from Pair Hinge (90° of **hostiles-to-caster**), Court Hinge (mass pair-hinge, #563 `court_hinge_regent`), File Fold (shared file/rank, `file_regent`), Court Fold (adjacent pair), About Face (facing invert). **Never owned.** Optional dim `UNKNOWN TECHNIQUE` log.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "fold_180_player_side"`. **Boss AI only.** Skip if 0–1 player-side bodies. Do not assign to pack AI.  
PLAYER_COUNTERPLAY: Keep one body; occupy a dest; Barrier the midpoint ring  
SYNERGIES: Pit / lava on a dest; dummy post is a third body and **fails** the exactly-two gate  
BALANCE_RISK: 180° can drop both bodies onto lava. Exactly-two gate + dest-free + never owned. Do not restamp `about_regent` (About Face) or `court_hinge_regent`.  
PERSISTENCE_REQUIREMENTS: Never write `ownedSpellIds` / `observedSpellIds`.  
STATUS: PROPOSED

---

## 12. Family attachments (Generation 8 extras — not CORE)

Do **not** put unique §11 ids in #405 / #452 / #558 CORE. Those families consume #342 / #411 / **#525**. This table is G≥8 extras / ELITE / SIGNATURE / MULTI only.

| Family / door | Unique G≥8 extra | #563 stamp (not a §11 clone) |
| :--- | :--- | :--- |
| `axis_locksmith` | Odd Stride (`odd_gallery` MULTI) | Diag Lock (ELITE stamp) |
| `plate_warden` | Cast Hold, Split Plate, Empty Plate | Morrow Plate |
| `iron_golem` | Cast Hold | — |
| `pit_mason` | Unit Oath, Pit Skip | Brick Shift |
| `origin_mason` | Unit Oath | Enter Mend |
| `tide_shade` | Step Rebate | — |
| `recoil_squire` | Step Rebate | — |
| `hook_chaplain` | Foe Reel | — |
| `file_reeler` | Foe Reel | Pair Hinge |
| `ember_knight` | Echo Wipe | — |
| `fuse_binder` | Echo Wipe, Wound Mark | Mend Wick |
| `glass_sniper` | Field Bite | Lone Sting |
| `rust_reaver` | Field Bite | — |
| `hex_chorister` | Wound Mark | Body Mark |
| `leash_warden` | Split Plate, Kennel Sill (ELITE) | — |
| `once_cantor` | Verse First | — |
| `verse_scribe` | Verse First | — |
| `wick_painter` | Pit Skip | — |
| `tempo_precentor` | Empty Plate | Leftover Lend |
| `glyph_sower` | Kennel Sill (ELITE) | — |
| `pale_cantor` / `font_cantor` | Chase Mend (ELITE; healer CORE only) | Gait Mend / Split Mend / Enter Mend stamps |
| `cadence_thief` | Cadence Stall (ELITE) | Cadence Flush |
| `coil_arbiter` | Crown Cut (`leader_slayer` MULTI) | — |
| `bone_scribe` | Full Bar (`spell_master` MULTI) | — |
| `cadence_lender` CHAMPION | Pack Tithe (`ENEMY_ONLY`) | — |
| `about_hinge_regent` | About Hinge (`BOSS_ONLY`) | not `court_hinge_regent` |

#558 Wave-8 families (`wall_stinger` … `leash_cutter`) keep **#525** CORE. Unique §11 ids may appear there only as G≥8 extras in a later family pass (Wave 9), not as this document’s CORE.

---

## 13. How to add Generation 9 forever

Same recipe as Wave 7 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 9 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve).

Suggested Wave-9 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; four-cell occupy (**hold** until summon cap ≥ 4); dedicated CORE families for Wave-7 / Wave-8 unique verbs (#558 deferred those to Wave 9). About Hinge stays `BOSS_ONLY` on `about_hinge_regent` — do not also grant Crown Cut / Full Bar from that fight, and do not restamp #518 / #525 / #563 extra doors.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Wave-2 **before** Wave-3. Wave-3 **before** Wave-4. Wave-4 **before** Wave-6. Wave-6 **before** Wave-7. Wave-7 **before** any Wave-8 data. Coordinate #411 / #463 / #480 / #525 / **#533** / **#563** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W8-A. G≥8 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W8-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W8-C. Wave-8 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #525 / #533 / **#563** / memory Wave-5 ids |
| W8-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `ENC-*` / `WF-*` / `even_gallery` as Odd Stride |
| W8-E. `leader_slayer` / `spell_master` MULTI | Feat claim → `unlockOwnedSpell` | Restamping Absolve / Overcast; pooling Hex Toll; `upgradeSpell` |
| W8-F. Foe Reel attract caller | `applyAttract` toward nearest other hostile | Damage-math rewrite; RAF |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Wound Mark detonation, Step Rebate consume, and Pack Tithe siphon read flags at hit / walk / turn-start only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 7 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W8-1 | Encounter start | Possessed-but-unused G8 id does not observe |
| W8-2 | Odd Stride even walk | Confirm fails; MP not spent; Odd Stride already observed |
| W8-3 | `odd_gallery` defeat | Does not grant. Victory grants once (MULTI) |
| W8-4 | `even_gallery` / Even Picket | Does not grant Odd Stride |
| W8-5 | Cast Hold vs Strike Hold vs Gait Seal | Spells illegal until walk vs Strike illegal until walk vs walk illegal |
| W8-6 | Unit Oath then Cinder Tile | Ground confirm fails; Frost still legal |
| W8-7 | Step Rebate walk | Next walk −1 MP; not `spell.mpCost`; Ley Toll unchanged |
| W8-8 | Foe Reel no second hostile | Fizzle observes; no pull |
| W8-9 | Echo Wipe with no paint | Fizzle observes |
| W8-10 | Field Bite vs Wall Bite | Open floor +8 vs adj-block +8; both legal on different families |
| W8-11 | Wound Mark then DoT only | No detonate; mark remains |
| W8-12 | Split Plate no ally at hit | Full hit; charge gone |
| W8-13 | Verse First then Strike | Strike confirm fails until a spell resolves |
| W8-14 | Pit Skip length 2 | Does not ignore the pit |
| W8-15 | Empty Plate with leftover 2 | Fizzle observes; no RES |
| W8-16 | Kennel Sill vs Pet Sill | Cannot leave vs cannot enter |
| W8-17 | Chase Mend vs Gait Mend | Target walked vs caster walked. Non-healer CORE has neither |
| W8-18 | Cadence Stall vs Flush vs Crack | Hostile +1 all vs ally all→0 vs hostile highest→0 |
| W8-19 | Crown Cut non-leader | 12 only. `leader_slayer` grants once |
| W8-20 | Full Bar with 7 equipped | Fizzle observes. `spell_master` grants once. Bar size unchanged |
| W8-21 | Pack Tithe / About Hinge | Never in `ownedSpellIds` |
| W8-22 | Loaner / `WF-SPL-*` | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W8-23 | G=7 Tide | No Step Rebate (`generationMin: 8`) |
| W8-24 | Duplicate victory / duplicate `leader_slayer` | One owned row; levels untouched; no Doka from the grant |
| W8-25 | No cloned ids | Unique §11 ids absent from #525 / #533 / **#563** catalogs |
| W8-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Step Rebate is a flag |
| W8-27 | Hex Toll | Still not in any SDE pool |
| W8-28 | Memory Wave-5 / Wave-7 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W8-29 | `jackpot` / `survivor` | Still not this catalog. Absolve / Last Ember unchanged |
| W8-30 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–7, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, **#533**, or **#563** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1 except the two leftover feat doors this wave owns
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #563 own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 extra doors
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `even_gallery` or `WF-ELT-EVEN_PICKET` as Odd Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #558 CORE

---

## 17. Wave-8 index

**Unique SDE ids (19):** odd-stride, cast-hold, unit-oath, step-rebate, foe-reel, echo-wipe, field-bite, wound-mark, split-plate, verse-first, pit-skip, empty-plate, kennel-sill, chase-mend, cadence-stall, crown-cut, full-bar, pack-tithe, about-hinge.

**#563 stamps (do not clone):** Gait Mend, Pair Hinge, Cadence Flush, Lone Sting, Morrow Plate, Gait Seal, Diag Lock, Brick Shift, Mend Wick, Return Sting, Leftover Lend, Dummy Post, Enter Mend, Body Mark, Split Mend, Court Hinge.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-odd-stride` | MULTI_SOURCE | yes | locksmith G≥8 **or** `odd_gallery` | Next walk odd Manhattan |
| `spell-cast-hold` | ENEMY_DISCOVERY | yes | plate / golem | Cannot spell until they walk |
| `spell-unit-oath` | ENEMY_DISCOVERY | yes | pit / origin mason | Next spell must target a unit |
| `spell-step-rebate` | ENEMY_DISCOVERY | yes | tide / recoil | Next walk −1 MP |
| `spell-foe-reel` | ENEMY_DISCOVERY | yes | hook / file reeler | Pull 1 toward nearest other hostile |
| `spell-echo-wipe` | ENEMY_DISCOVERY | yes | ember / fuse | Erase adjacent paint |
| `spell-field-bite` | ENEMY_DISCOVERY | yes | glass / reaver | Bonus if no adj block |
| `spell-wound-mark` | ENEMY_DISCOVERY | yes | hex / fuse | Detonate on being hit |
| `spell-split-plate` | ENEMY_DISCOVERY | yes | plate / leash | Incoming 50/50 with adj ally |
| `spell-verse-first` | ENEMY_DISCOVERY | yes | once / verse scribe | Cannot Strike until a spell |
| `spell-pit-skip` | ENEMY_DISCOVERY | yes | pit / wick painter | 1-tile walk ignores pit |
| `spell-empty-plate` | ENEMY_DISCOVERY | yes | plate / tempo | 0 leftover AP → +RES |
| `spell-kennel-sill` | ELITE | yes | glyph / leash | Summons cannot leave the cell |
| `spell-chase-mend` | ELITE | yes | pale / font cantor | Heal iff **target** walked |
| `spell-cadence-stall` | ELITE | yes | cadence_thief | +1 all remaining CDs |
| `spell-crown-cut` | MULTI_SOURCE | yes | coil **or** `leader_slayer` | Bonus vs `isLeader` |
| `spell-full-bar` | MULTI_SOURCE | yes | scribe **or** `spell_master` | Next spell −1 AP if 8 equipped |
| `spell-pack-tithe` | ENEMY_ONLY | no | cadence_lender CHAMPION | Pack siphon leftover AP |
| `spell-about-hinge` | BOSS_ONLY | no | `about_hinge_regent` | 180° two player-side bodies |

All unique rows STATUS: **PROPOSED**.
