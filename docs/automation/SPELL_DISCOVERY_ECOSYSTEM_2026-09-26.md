# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 9

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-26  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Wave 3 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md), PR #300) is Generation 3. Wave 4 (still-open #371) is Generation 4. Wave 6 (still-open #480) is Generation 6. Wave 7 (still-open #533) is Generation 7. Wave 8 (still-open #590) is Generation 8. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Wave 6 (#480) is Generation 6 so those memory ids stay tombstoned. Wave 7 (#533) is Generation 7. Wave 8 (#590) is Generation 8. This document is **Generation 9**. `generationMin: 9`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-26.md`](./ACTION_IDS_SDE_2026-09-26.md).

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
| Wave-8 discovery contract | still-open #590 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md` | G≥8 extra slot, W8 unique ids, #563 stamps, leftover `leader_slayer` / `spell_master` |
| Wave-1…8 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-25.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | #342 | Gale Fan … Eclipse Fold |
| Tactical gap-fillers W5 | still-open #411 | Oncoming … Act Bell |
| Tactical gap-fillers W6 | still-open #463 | Post Sting … About Face |
| Tactical gap-fillers W7 | still-open #525 | Wall Sting … Court Shove |
| Tactical gap-fillers W8 | still-open #563 — `SPELL_PROPOSALS_2026-09-25.md` | Gait Mend … Court Hinge. **Stamp, do not clone** |
| Tactical gap-fillers W9 | still-open **#636** — `SPELL_PROPOSALS_2026-09-26.md` | Shove Mend … Court Stretch. **Stamp, do not clone**. Unique §11 stay this catalog’s. Wave 10 families consume #636. Extra doors `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent` — do not restamp |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + same-day **#625** | #625 Wave-9 families consume **#563** plus leftover **#533** unique CORE. Do **not** put unique §11 ids there. Wave-8 unique CORE stays G≥8 extras until Wave 10 |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 | Extra doors claimed through Wave 9 (`toll_ostiary` … `oath_dean`). Do not restamp |
| World dynamics | same-day #613 — `WDD-2026-09-26-001` | World features. Do not retag `WF-*` as spell encounter ids |
| PX coherence | #343 / #393 / #481 / #579 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-9 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

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

**#563 tactical Wave 8:** `spell-gait-mend`, `spell-pair-hinge`, `spell-cadence-flush`, `spell-lone-sting`, `spell-morrow-plate`, `spell-gait-seal`, `spell-diag-lock`, `spell-brick-shift`, `spell-mend-wick`, `spell-return-sting`, `spell-leftover-lend`, `spell-dummy-post`, `spell-enter-mend`, `spell-body-mark`, `spell-split-mend`, `spell-court-hinge`.

**Wave 8 SDE (#590):** `spell-odd-stride`, `spell-cast-hold`, `spell-unit-oath`, `spell-step-rebate`, `spell-foe-reel`, `spell-echo-wipe`, `spell-field-bite`, `spell-wound-mark`, `spell-split-plate`, `spell-verse-first`, `spell-pit-skip`, `spell-empty-plate`, `spell-kennel-sill`, `spell-chase-mend`, `spell-cadence-stall`, `spell-crown-cut`, `spell-full-bar`, `spell-pack-tithe`, `spell-about-hinge`.

**#636 tactical Wave 9:** `spell-shove-mend`, `spell-cadence-stretch`, `spell-quad-span`, `spell-gait-wick`, `spell-dry-sting`, `spell-home-step`, `spell-must-span`, `spell-far-hood`, `spell-boot-lend`, `spell-quiet-sill`, `spell-exit-sting`, `spell-purse-keep`, `spell-tick-plate`, `spell-last-mute`, `spell-pair-slide`, `spell-court-stretch`.

**Do not alias** `spell-pair-stride` ↔ `spell-even-stride` / `spell-odd-stride` / `spell-split-pace` / `spell-pair-hinge` / `spell-diag-lock` / `spell-must-span`, `spell-boot-hold` ↔ `spell-strike-hold` / `spell-cast-hold` / `spell-gait-seal` / `spell-boot-sting` / `spell-must-pace` / `spell-boot-lend`, `spell-near-oath` ↔ `spell-unit-oath` / `spell-ground-oath` / `spell-near-veil` / `spell-aim-veil` / `spell-short-sight`, `spell-paint-reel` ↔ `spell-foe-reel` / `spell-ally-reel` / `spell-file-reel` / `spell-echo-paint` / `spell-echo-wipe` / `spell-pair-slide`, `spell-nook-bite` ↔ `spell-field-bite` / `spell-wall-bite` / `spell-wall-sting` / `spell-lone-sting` / `spell-wick-bite` / `spell-dry-sting`, `spell-stride-mark` ↔ `spell-wound-mark` / `spell-cast-mark` / `spell-body-mark` / `spell-stride-brand` / `spell-boot-sting` / `spell-gait-wick`, `spell-foe-plate` ↔ `spell-split-plate` / `spell-empty-plate` / `spell-morrow-plate` / `spell-pain-link` / `spell-load-bearing` / `spell-tick-plate`, `spell-lava-skip` ↔ `spell-pit-skip` / `spell-safe-fall` / `spell-ember-step` / `spell-gap-ward`, `spell-still-plate` ↔ `spell-empty-plate` / `spell-planted-stance` / `spell-still-brand` / `spell-still-leash`, `spell-body-sill` ↔ `spell-kennel-sill` / `spell-pet-sill` / `spell-gift-sill` / `spell-body-mark` / `spell-body-check` / `spell-quiet-sill`, `spell-clash-mend` ↔ `spell-chase-mend` / `spell-gait-mend` / `spell-split-mend` / `spell-enter-mend` / `spell-post-sting` / `spell-shove-mend`, `spell-cadence-shave` ↔ `spell-cadence-stall` / `spell-cadence-flush` / `spell-cadence-crack` / `spell-cadence-theft` / `spell-cadence-lend` / `spell-cadence-stretch`, `spell-gait-tax` ↔ `spell-walk-toll` / `spell-camp-tax` / `spell-act-tax` / `spell-gait-mend` / `spell-gait-seal` / `spell-gait-wick`, `spell-brick-wipe` ↔ `spell-brick-shift` / `spell-echo-wipe` / `spell-dispel-thread`, `spell-watch-mute` ↔ `spell-far-watch` / `spell-gap-ward` / `spell-mute-thread` / `spell-hold-ground` / `spell-last-mute` / `spell-far-hood`, `spell-full-purse` ↔ `spell-empty-purse` / `spell-full-bar` / `spell-empty-plate` / `spell-late-purse` / `spell-dry-sting` / `spell-purse-keep`, `spell-pet-cut` ↔ `spell-summon-bane` / `spell-sated-fang` / `spell-crown-cut` / `spell-cull-kennel`, `spell-pack-stride` ↔ `spell-pack-tithe` / `spell-pack-still` / `spell-pack-tempo` / `spell-pack-ledger` / `spell-even-stride`, `spell-knight-fold` ↔ `spell-knight-pierce` / `spell-knight-slip` / `spell-about-hinge` / `spell-court-fold` / `spell-file-fold` / `spell-pair-hinge` / `spell-pair-slide` / `spell-court-stretch` / `spell-quad-span`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Tactical Wave 8 (#563 — stamp, do not clone)

#563 still **owns** the G≥8 tactical holes. Wave 8 SDE already stamped them. This document does **not** re-author them and does **not** restamp #563 / #625 extra doors (`gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`).

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-gait-mend` | ENEMY_DISCOVERY | Heal iff **caster** walked. Distinct from Clash Mend (**target Struck**) |
| `spell-pair-hinge` | ENEMY_DISCOVERY | Two hostiles 90° around **their** midpoint. Distinct from Pair Stride (walk length) and Knight Fold (closed) |
| `spell-cadence-flush` | ENEMY_DISCOVERY | **Ally**, all remaining CDs → 0. Distinct from Cadence Shave (**ally**, −1 all remaining) and Cadence Stretch (**hostile** remaining ×2) |
| `spell-lone-sting` | ENEMY_DISCOVERY | Bonus iff 0 Chebyshev-1 same-side hostiles. Distinct from Nook Bite (exactly **one wall**) |
| `spell-morrow-plate` | ENEMY_DISCOVERY | Absorb starts next **own** turn |
| `spell-gait-seal` | ENEMY_DISCOVERY | Cannot spend walk MP; spells still legal. Distinct from Boot Hold (walk illegal until **Strike**) |
| `spell-diag-lock` | ELITE | Next walks must be diagonal. Distinct from Pair Stride (exact Manhattan 2) |
| `spell-brick-shift` | ENEMY_DISCOVERY | Slide an **existing** barrier 1 Chebyshev. Distinct from Brick Wipe (**erase**) |
| `spell-mend-wick` | ENEMY_DISCOVERY | Delayed tile **heal** |
| `spell-return-sting` | ENEMY_DISCOVERY | Next applied hit → 0 on you, `floor(n/2)` poke |
| `spell-leftover-lend` | ENEMY_DISCOVERY | Dump **your** leftover AP onto an ally |
| `spell-dummy-post` | ELITE | 1-HP empty-kit taunt post (`summonAI: "dummypost"`) |
| `spell-enter-mend` | ENEMY_DISCOVERY | First enter heals 6 once |
| `spell-body-mark` | ENEMY_DISCOVERY | Unit-scoped next-hit ×1.5 |
| `spell-split-mend` | ELITE | Heal 12 split 50/50 with adjacent ally |
| `spell-court-hinge` | NOT_PLAYER_LEARNABLE | Mass pair-hinge. Never owned. Distinct from Knight Fold |

`pair_usher` is **not** `pair_gallery`. `gait_cantor` is **not** Clash Mend’s door. `dummy_prelate` (#625) is Dummy Post CORE, not Pack Stride.

### 0.3 Tactical Wave 9 (#636 — stamp, do not clone)

#636 opened after this audit started and **owns** the G≥9 tactical holes. This document does **not** re-author them and does **not** restamp #636 extra doors (`shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent`). Unique §11 stay this catalog’s.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-shove-mend` | MULTI_SOURCE | Heal iff **target was force-moved**. Distinct from Clash Mend (**target Struck**) |
| `spell-cadence-stretch` | MULTI_SOURCE | **Hostile** remaining CDs ×2 (0 stays 0). Distinct from Cadence Shave (**ally** −1 all) and Stall (**+1** all) |
| `spell-quad-span` | MULTI_SOURCE | 2×2 occupy, counts as four. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-gait-wick` | ENEMY_DISCOVERY | **Unit** mark; detonates on next **any** walk-MP spend. Distinct from Stride Mark (**cell** paint; leave that cell) |
| `spell-dry-sting` | ENEMY_DISCOVERY | Bonus if leftover AP **= 0**. Distinct from Full Purse (leftover AP **≥ 3**) |
| `spell-home-step` | ENEMY_DISCOVERY | Caster steps adjacent to an ally. Distinct from Paint Reel / Pair Slide |
| `spell-must-span` | ELITE | **All** remaining walks **this turn** must be Manhattan 2. Distinct from Pair Stride (**one** next walk, may persist 2 turns) |
| `spell-far-hood` | ELITE | Next hit from Chebyshev ≥ 3 is 0. Distinct from Watch Mute (next **overwatch snap** is 0) |
| `spell-boot-lend` | ENEMY_DISCOVERY | +1 MP to an **unmoved** ally. Distinct from Boot Hold (walk illegal until Strike) |
| `spell-quiet-sill` | ENEMY_DISCOVERY | Occupant cannot resolve Strike. Distinct from Body Sill (primary cannot **leave**) |
| `spell-exit-sting` | ENEMY_DISCOVERY | First leave deals 8. Distinct from Stride Mark (leave-cell **walk-MP** detonate on a painted cell) |
| `spell-purse-keep` | MULTI_SOURCE | Bank leftover AP to next turn start. Distinct from Full Purse (bonus if leftover ≥ 3 **now**) |
| `spell-tick-plate` | ENEMY_DISCOVERY | Next **DoT tick** on you is 0. Distinct from Foe Plate (split an incoming **hit**) |
| `spell-last-mute` | ENEMY_DISCOVERY | Their **last resolved id** is illegal 1 turn. Distinct from Watch Mute (overwatch snap) |
| `spell-pair-slide` | ENEMY_DISCOVERY | Translate two adj hostiles 1 step. Distinct from Pair Hinge (90°) and Knight Fold (knight 2,1) |
| `spell-court-stretch` | NOT_PLAYER_LEARNABLE | Mass remaining-CD ×2. Never owned. Distinct from Knight Fold |

`span_quad` is **not** Knight Fold’s door. `stretch_precentor` is **not** Cadence Shave’s door. `shove_cantor` is **not** Clash Mend’s door.

### 0.4 Held holes (still not this pass)

Wave 8 §13 listed these as Wave-9/10 candidates. This wave **does not** fill them in unique §11:

| Held hole | Why still held |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Four-cell occupy | **#636 Quad Span owns the hole.** Do not clone. Live `ENEMY_SUMMON_CAP` is still 2, so that card stays implementation-blocked |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. Wave 8 held this door. **Still held.** |
| `jackpot` feat door | #185 Absolve already claimed `jackpot` as a MULTI child. Do not restamp |
| Dedicated CORE families for Wave-8 unique verbs | #625 deferred those to **Wave 10**. This catalog’s unique §11 ids stay G≥9 extras, not #625 CORE. Wave 10 families consume **#636**, not unique §11 |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-five days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 … 2026-09-26 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2408 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`main.mo` 134–142) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | All 15 feat doors are claimed or leftover. This wave **stamps none**. `survivor` stays leftover |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | All nine challenge ids remain claimed through Wave 7 |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | WX 11920; zone object at 4683–4687 | `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 194–199); every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Clash Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids. Dummy Post keeps `summonAI: "dummypost"` (#563) |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-9 unique ids stay `mpCost: 0`. Gait Tax / Pack Stride are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Paint Reel is attract-toward-**nearest paint**, a new dest flavor after Ally Reel / Foe Reel |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-9 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Pet Cut reads `isSummon && side === player`. Never `spell.name` |
| Open PR queue | #327+, then 2026-09-26 docs. **#371 owns Wave-4 SDE. #411 owns Wave-5 tactical. #463 owns Wave-6 tactical. #480 owns Wave-6 SDE. #525 owns Wave-7 tactical. #533 owns Wave-7 SDE. #563 owns Wave-8 tactical. #590 owns Wave-8 SDE. #558 owns Wave-8 families. #625 owns Wave-9 families (#563 + leftover #533 CORE). #572 owns Wave-9 extra boss doors. #636 owns Wave-9 tactical.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-8 P0 remain the prerequisite. **Do not land Wave-9 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 9 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥9 rares make it sharper: a CHAMPION may hold the generation-9 verb until leftover AP / walk MP / a living player-side summon is already committed.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 9 fills holes Waves 1–8, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, **#590**, and **#636** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Odd Stride, Pair Hinge, Cadence Stall, Split Plate, Pit Skip, Chase Mend, Pack Tithe, About Hinge, Gait Wick, Must Span, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 9 stamps `generationMin: 9`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Gait Tax **adds 1 AP** to the next spell if they walked. Pack Stride moves leftover **walk MP**. Neither is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 9 unique ids do **not** require `currentView`.
15. **No leftover feat / challenge doors this pass.** Wave 8 stamped `leader_slayer` / `spell_master`. `survivor` stays leftover (Last Ember / Last Ward). `jackpot` stays #185 Absolve. `unstoppable` stays unused forever as a spell gate.

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

Wave-9 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| Pair Stride **cast** (AP spent), target already rooted | **Yes** — the technique was used |
| Illegal walk length **after** Pair Stride is on them | **No** — that is their failed confirm, not a second observe |
| Boot Hold **cast** | **Yes** on the cast. A later failed walk is **not** a second observe |
| Paint Reel **cast** with no paint on the board | **Yes** if AP was spent (fizzle) |
| Stride Mark **arm** | **Yes** on the paint. Detonation when they later **walk off that cell** is **not** a second observe |
| Foe Plate **arm** | **Yes** on the cast. Later shared incoming is **not** a second observe |
| Lava Skip **arm** | **Yes** on the cast. Paying the lava walk later is **not** a second observe |
| Clash Mend **cast** with target unstruck (heal 0) | **Yes** — AP was spent |
| Cadence Shave **cast** on an ally with no remaining CDs | **Yes** if AP was spent |
| Gait Tax **cast** on an unmoved target (no tax) | **Yes** if AP was spent |
| Brick Wipe **cast** with no adjacent barrier | **Yes** if AP was spent |
| Watch Mute **arm** | **Yes** on the cast. A later 0-damage snap is **not** a second observe |
| Full Purse on leftover AP 2 (no bonus) | **Yes** — the technique was used |
| Pet Cut on a non-summon (no bonus) | **Yes** — the technique was used |
| Pack Stride aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| Knight Fold | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orb pickup / `WF-SPL-*` attune | **No** |
| #563 Gait Mend / Pair Hinge / Dummy Post **cast** | **Yes** on those ids (their own observe). Do not also observe unique §11 ids |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 9 stamps unused **family** attachments and one special MULTI. It does **not** add enum members. It does **not** stamp leftover feat or challenge doors.

| Source | Wave-9 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥9 family verbs in §11 **plus** #563 stamps already recorded in Wave 8 |
| `ELITE` | Clash Mend, Body Sill, Full Purse, Pet Cut, Watch Mute |
| `ACHIEVEMENT` | **none** — `survivor` stays leftover. Do not restamp `leader_slayer` / `spell_master` / `jackpot` |
| `CHALLENGE` | **none** — all nine challenge doors remain claimed through Wave 7 |
| `BOSS` | **none** — live-19 first-wins and extra doors through #572 stay claimed. Knight Fold is `BOSS_ONLY` |
| `SPECIAL_ENCOUNTER` | Pair Stride ← `pair_gallery` (MULTI child; observation not required for that child) |
| `MULTI_SOURCE` | Pair Stride ← locksmith observe+win **or** `pair_gallery`. First child wins |
| `ENEMY_ONLY` | Pack Stride (never owned) |
| `BOSS_ONLY` | Knight Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-9 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every live feat and challenge from Waves 1–8, #120 / #185 / #282 / #342 / #411 / #463 / #525 / **#563** / **#590**, plus boss extra doors:

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
| `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` | #463 extra doors |
| `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` | #474 extra doors |
| `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` | #518 extra doors |
| `span_triune` / `wick_mason` / `slip_castellan` / `court_usher` / `pace_prelate` | #525 extra doors |
| `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent` | #563 extra doors — do not restamp. `pair_gallery` is **not** `pair_usher` |
| `toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean` | #572 extra doors — do not restamp |
| `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent` | #636 extra doors — do not restamp. Clash Mend is **not** `shove_cantor`. Cadence Shave is **not** `stretch_precentor`. Knight Fold is **not** `span_quad` |
| `choir_gallery` | Wave 6 Choir Verse MULTI child |
| `even_gallery` | Wave 7 Even Stride MULTI child |
| `odd_gallery` | Wave 8 Odd Stride MULTI child |
| `hard_1` | Wave 7 Thin Ward MULTI child |
| `legendary_1` | Wave 7 Clean Blood MULTI child |
| `leader_slayer` | Wave 8 Crown Cut MULTI child |
| `spell_master` | Wave 8 Full Bar MULTI child |

Economy feats stay Doka-only until a designer needs a non-damage identity. `unstoppable` stays unused forever as a spell gate. **Still leftover after this pass:** `survivor` only. Do not stamp `survivor` (Last Ember / Last Ward).

---

## 5. Spell pool evolution — Generation 9 (never a last tier)

Wave 1 §6 five pools and later generation stamps stay. Wave 9 adds the **G≥9 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, … no maximum
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
| 9 | one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with `generationMin ≤ 9` |
| 10+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or later G verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **9** for families listed in §12. It remains a data query, not a constant in combat math.

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
  11. if G ≥ 9: one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with generationMin ≤ G
  12. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  13. drop any id whose AI_REQUIREMENTS are unmet
  14. keep ENEMY_ONLY on enemies (they cast; they never grant)
  15. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at WX 11920).

Do **not** put unique §11 ids in #405 CORE, #452 CORE, #558 CORE, or **#625 CORE**. Those families already consume #342 / #411 / #525 / **#563 + leftover #533** identities. Wave-8 unique CORE (`spell-odd-stride` … `spell-about-hinge`) stays a G≥8 extra until a Wave-10 family pass.

---

## 6. New `aiHint` keys (metadata, not names)

Prior-wave hints still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `force_exact_manhattan_2` | caster, controller | Target likely to walk ≥ 1; skip if rooted, MP = 0, or they already have only a 1-step legal dest |
| `forbid_walk_until_strike` | guardian, charger | Target is in range of a 2+ tile walk and has Strike; skip if they already Struck this turn or MP = 0 |
| `next_spell_range_le_1` | caster, controller | Target’s next likely spell has `range > 1`; skip if their kit is already melee-only |
| `attract_toward_nearest_paint` | controller, caster | A painted hazard exists; landing cell free; skip if none or already adjacent to that paint |
| `bonus_if_exactly_one_adj_block` | charger, caster | Target cell has exactly 1 Chebyshev-1 blocking tile; skip if 0 (use Field Bite) or ≥ 2 (use Wall Bite) |
| `detonate_on_walk_leave_cell` | caster, controller | A painted leave-cell exists under the target; skip if they are already off it, rooted, or MP = 0. **Do not** reuse #636 `mark_if_target_still_has_walk_mp` (Gait Wick unit-follow) |
| `split_incoming_adjacent_enemy` | guardian, tank | Living **hostile-to-target** Chebyshev-1; skip if none |
| `next_walk_ignores_lava` | kiter, flanker | A lava / ember-wake / cinder cell sits on the caster’s 1-tile path; skip if no lava |
| `self_buff_if_zero_leftover_mp` | guardian, tank | Caster leftover walk MP = 0 at resolve **or** they intend to spend down to 0 this turn; skip if leftover MP ≥ 2 and they still need a 2-tile walk |
| `forbid_primary_leave_cell` | caster, controller | Target is the player primary (not a summon); skip if they are already rooted |
| `heal_if_target_struck` | healer, buffer | Target resolved Strike this turn **and** missing HP ≥ 8; skip if they have not Struck. **Never** put in non-healer CORE |
| `shave_all_remaining_cds` | caster, buffer | **Ally** has ≥ 1 kit id with remaining CD ≥ 2; skip if all CDs are 0 or 1 (use Flush for a full reset) |
| `tax_next_spell_if_walked` | caster, controller | Target spent ≥ 1 walk MP this turn and still has a 3+ AP spell; skip if unmoved |
| `erase_adjacent_barrier` | caster | A `barrierTiles` cell is Chebyshev-1 of the caster or a painted path; skip if none |
| `next_overwatch_deals_zero` | caster, controller | An armed overwatch / Far Watch / Hold Ground exists on the player path; skip if none |
| `bonus_if_leftover_ap_ge_3` | charger, caster | Target leftover AP ≥ 3 **or** they are about to end a turn with ≥ 3; skip if leftover ≤ 2 |
| `bonus_if_player_side_summon` | caster, charger | A living `isSummon && side === player` is in range; skip if none (use Crown Cut / Summon Bane instead) |
| `pack_siphon_leftover_mp` | buffer | CHAMPION only; skip if aura up or no ally in 2 with leftover walk MP ≥ 1 |
| `fold_knight_player_side` | **boss AI only** | Exactly two living player-side bodies; both dest cells free and on-board; skip if 0–1 or a dest is blocked |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

Prior-wave hints stay on those catalogs. Do not re-author them. Do not assign Face Away / Oncoming / Glance Cut / About Face / Shove Face until a battle `currentView` writer exists.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: `pendingAchievementToast` at `WorldExploration.tsx` 2173 / 17949. **Do not grow WX.**
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Gait Tax / Lava Skip may add a **battle-log line** when the tax or ignored lava is paid — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.
- `pair_gallery` MULTI child shows `NEW SPELL DISCOVERED` on the **same** recap as victory. Do not add a second popup.
- Exact-2 fail, empty-paint Reel, Gait Wick detonation, and Stride Mark detonation are **not** a second cue.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 9 adds **no** new canister methods.

| Writer | Wave-9 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | `pair_gallery` MULTI child (victory, no observation). **No** feat/challenge/boss stamps this wave |

Rules that must stay true:

- Enqueue on `createProgressPersist`. `commit` after the canister write.
- Grant is owned-id **append only**.
- Must not call `upgradeSpell` (charges `spellLevelingBaseCost * 2^level`).
- Must not call `updateCharacter`.
- Must not mint Doka/XP.
- Must not reset `spellLevelKeys`.
- Duplicate victory callback → empty grant list.
- Death penalty (`saveBattleStats` 20/40) does not touch owned/observed.
- `localStorage` is cache only.
- Paint Reel / Knight Fold landings use existing hazard helpers when a body lands on lava/spikes (`recordInBattleChallengeDamage` while `inBattleRef`).
- Clash Mend self-heal / ally heal uses existing heal helpers; challenge `no_healing` flips only when HP actually increased.
- Loaner orbs / `WF-SPL-*` attune never write `ownedSpellIds`.
- `spell-pack-stride` / `spell-knight-fold` never write `ownedSpellIds`.

---

## 9. Special encounters (Wave 9)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is `unlockOwnedSpell` / observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms. **Do not** reuse encounter-catalog `ENC-*` ids or world-feature `WF-*` ids as spell tags.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `pair_gallery` | Axis Locksmith + pawn; locksmith prefers Pair Stride when the player has a 1-tile path and a 3-tile path | `spell-pair-stride` on **victory** (no observation — `SPECIAL_ENCOUNTER` MULTI child) **or** observe+win if the id is used. **Not** `odd_gallery` / `even_gallery` and **not** `pair_usher` |
| `hold_nave` | Plate Warden on a 3-tile corridor; AI prefers Boot Hold when the player has leftover MP | `spell-boot-hold` via observe+win. **Not** Wave-8 `odd_gallery` and **not** #625 `hold_knight` as a tag |
| `nook_court` | Glass Sniper in a one-wall alcove; AI prefers Nook Bite | `spell-nook-bite` via observe+win |
| `stride_pulpit` | Stride Hunter + pawn; hunter prefers Stride Mark then waits for the pawn to force a walk | `spell-stride-mark` via observe+win |
| `shave_nave` | Cadence Thief + Inferno queen; thief prefers Cadence Shave when Inferno is on CD ≥ 2 | `spell-cadence-shave` via observe+win. **Not** Wave-8 `stall_nave` |

Prior specials (`echo_dummies`, `rime_gallery`, `still_court`, `mist_gallery`, `undertow_channel`, `ember_fan`, `rift_twins`, `long_gallery`, `gate_gallery`, `triune_gallery`, `haze_gallery`, `stolen_pulpit`, `nail_court`, `pit_gallery`, memory Wave-5 `gaze_gallery` / `span_court` / `lintel_hall` / `cadence_nave` / `soft_gallery`, Wave-6 `choir_gallery` / `wick_gallery` / `purse_nave` / `pet_sill_hall` / `dull_court`, Wave-7 `even_gallery` / `toll_nave` / `lock_nave` / `paint_gallery` / `ghost_court`, Wave-8 `odd_gallery` / `rebate_nave` / `wipe_gallery` / `mark_court` / `stall_nave`) are not re-specified.

Knight Fold occupancy is not `map.portals` and not Twin/Triune/Twin Span/Triple Span/Pair Hinge/About Hinge tables. `WF-SPL-ECHO_SCRIBE` / `WF-SPL-LOANER_MAGE` / loaner orbs never write `ownedSpellIds`.

---

## 10. Balance doctrine — holes this wave fills

Prior waves + tactical catalogs already cover the Wave 8 §10 closed list, plus Wave 8 unique verbs (odd Manhattan, cannot spell until walk, next spell unit-only, next walk −1 MP, pull toward nearest other hostile, erase paint, bonus if no adj block, detonate on being hit, split incoming 50/50 ally, cannot Strike until spell, 1-tile walk ignores pit, 0 leftover AP → +RES, summons cannot leave, heal iff target walked, +1 all remaining CDs, bonus vs `isLeader`, next spell −1 AP if bar 8, pack siphon leftover AP, 180° two player-side).

**Still open (Wave 9 SDE unique ids).** Held holes from §0.4 stay held. #636 stamps in §0.3 are **not** unique §11.

| Hole | Wave-9 id | Why it is not a clone |
| :--- | :--- | :--- |
| **One** next walk Manhattan **exactly 2** | `spell-pair-stride` | Must Span (#636) is **all** remaining walks **this turn**. Even/Odd are parity. Diag Lock is walk-**shape**. Pair Hinge is occupancy |
| Cannot **walk** until they Strike | `spell-boot-hold` | Strike Hold forbids **Strike** until walk. Cast Hold forbids **spells** until walk. Gait Seal forbids walk while spells stay legal. Boot Lend is +1 MP to an unmoved **ally** |
| Next spell `range` must be ≤ 1 | `spell-near-oath` | Unit Oath is target **class**. Ground Oath is ground only. Near Veil is memory Wave 5. Short Sight **cuts** range, it does not forbid long confirms |
| Pull 1 toward nearest **paint** | `spell-paint-reel` | Foe Reel is toward a **body**. Ally Reel is toward an ally. File Reel is along shared axis toward **caster**. Echo Paint **copies** paint. Pair Slide **translates** two adj hostiles |
| Bonus if **exactly one** adjacent block | `spell-nook-bite` | Field Bite wants **zero**. Wall Bite / Wall Sting want **any** hug. Lone Sting wants isolation of **bodies**. Dry Sting is leftover-AP **0** |
| **Cell** paint detonates when they **walk off that cell** | `spell-stride-mark` | Gait Wick (#636) is a **unit** mark that follows them and detonates on any walk-MP spend. Wound Mark is **being hit**. Cast Mark is **their** cast. Exit Sting is first **leave** of a different paint |
| Split **incoming** 50/50 with adj **enemy** | `spell-foe-plate` | Split Plate shares with an **ally**. Tick Plate (#636) zeros the next **DoT tick**. Pain Link / Load Bearing are % share / tethers |
| Next 1-tile walk treats **lava** as floor | `spell-lava-skip` | Pit Skip is **pit**. Safe Fall skips hazard ticks on **forced-move**. Ember Step **paints** lava |
| 0 leftover **walk MP** → +RES | `spell-still-plate` | Empty Plate is 0 leftover **AP**. Planted Stance is a 0-walk **stance**. Still Brand punishes **target** 0 MP |
| **Primary** cannot leave the cell | `spell-body-sill` | Kennel Sill is **summons** cannot leave. Quiet Sill (#636) forbids **Strike** on the occupant. Pet Sill is summons cannot **enter**. Root is MP lock without a cell brand |
| Heal iff **target Struck** | `spell-clash-mend` | Shove Mend (#636) is target **force-moved**. Chase Mend is target **walked**. Gait Mend is **caster** walked. Post Sting is unmoved **damage** |
| −1 **all** remaining CDs on an **ally** | `spell-cadence-shave` | Cadence Stretch (#636) is **hostile** remaining ×2. Cadence Stall is **+1** all on a **hostile**. Cadence Flush **zeros ally** CDs. Cadence Lend is −1 **one** ally id. Cadence Theft **steals** 1 |
| Next spell +1 AP if they **walked** | `spell-gait-tax` | Walk Toll is +1 **walk MP**. Camp Tax / Act Tax are other wallets. Gait Wick is a **detonate**. Not `spell.mpCost` |
| Erase adjacent **barrier** | `spell-brick-wipe` | Brick Shift **slides**. Echo Wipe erases **paint**. Dispel Thread strips **unit** buffs |
| Next overwatch snap deals **0** | `spell-watch-mute` | Far Hood (#636) zeros a hit from Chebyshev ≥ 3. Last Mute (#636) bans their **last resolved id**. Gap Ward **skips** overwatch on a 1-tile walk. Far Watch **is** overwatch |
| Bonus if leftover AP ≥ **3** | `spell-full-purse` | Dry Sting (#636) wants leftover **0**. Purse Keep (#636) **banks** leftover. Empty Plate wants leftover **0** → +RES. Full Bar is **equipped count** |
| Bonus vs **player-side** `isSummon` | `spell-pet-cut` | Summon Bane is any `isSummon`. Crown Cut is `isLeader`. Sated Fang is a vampire door. Quad Span is occupy, not a cut |
| Pack siphon leftover **walk MP** | `spell-pack-stride` | Pack Tithe siphons leftover **AP**. Pack Still is leftover-0 **veil**. Never owned |
| Knight-(2,1) rotate two player-side bodies around midpoint | `spell-knight-fold` | About Hinge is **180°**. Pair Slide is a **translate**. Quad Span is occupy. Pair Hinge is 90° of **hostiles-to-caster**. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rallying Cry; Poison ≈ Venom; Expose ≈ Shadow Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll / Undertow / Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 9)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–8, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, **#590**, or **#636**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique Wave-9 row. Gait Tax / Pack Stride are walk-pool / AP-pool flags.

### 11.1 New `effectParams` keys (Wave 9 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #590 / #563 / **#636** key names for a different meaning.

```text
exactManhattanWalk,               // Pair Stride — next walk |dx|+|dy| must be 2
forbidWalkUntilStrike,            // Boot Hold
nextSpellRangeMax,                // Near Oath — 1
attractTowardNearestPaint,        // Paint Reel
nookBonus, nookDamage,            // Nook Bite — exactly 1 Chebyshev-1 blocking tile
detonateOnWalkLeaveCell, strideMarkDamage,
splitIncomingEnemyPct,            // Foe Plate — 0.5 with Chebyshev-1 hostile-to-target
nextWalkIgnoresLava,              // Lava Skip — 1-tile walk only
emptyLeftoverMpRes, emptyLeftoverMpDuration,
forbidPrimaryLeaveCell, bodySillDuration,
requireTargetStruckHeal, clashMendAmount,
shaveAllRemainingCds,             // Cadence Shave — −1 every remaining CD (min 0)
taxNextSpellIfWalked, gaitTaxAp,  // +1 AP
eraseBarrierAdjacent,             // Brick Wipe
nextOverwatchDealsZero,           // Watch Mute
leftoverApBonusMin, leftoverApBonusDamage,
playerSideSummonBonus,            // Pet Cut
packSiphonLeftoverMp, packSiphonMpRadius,
foldKnightPlayerSide
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` is **not** reused.

---

### SPELL_ID: `spell-pair-stride`

NAME: Pair Stride  
ROLE: CONTROL — next walk Manhattan exactly 2  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via locksmith; false if via `pair_gallery`  
MINIMUM_ELIGIBILITY: Family `axis_locksmith`; `G ≥ 9`; `aiProfile` caster/controller. **Or** victory in `pair_gallery`  
ENEMY_FAMILIES: `axis_locksmith`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥9. `generationMin: 9`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. The target’s **next one walk** (this turn, or the next if they do not walk — max 2 turns) must have Manhattan length exactly 2 (`|dx|+|dy| = 2`: a 2-step cardinal **or** a (1,1) diagonal). After that one walk resolves, the constraint ends. A 1-step cardinal is **illegal**. Confirm fails closed; MP not spent (`effectParams: {"exactManhattanWalk":true}`). Distinct from Must Span (#636: **all** remaining walks **this turn** must be Manhattan 2), Even Stride (any even), Odd Stride (any odd), Diag Lock (diagonal-only, any length), Split Pace (leftover split), Pair Hinge (occupancy). Teleport / Swap / shove do not pay.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "force_exact_manhattan_2"`. Skip if rooted or MP = 0.  
PLAYER_COUNTERPLAY: Walk a legal 2; Haste; blink; wait the duration  
SYNERGIES: `pair_gallery`; Rank Lock then they cannot take the legal 2-step on-axis if that axis is blocked; Mire Sheet on the 2-step  
BALANCE_RISK: Pair + Odd/Even on the same target is a brick. Last writer on the walk-length flag. CD 2 + G≥9.  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `pair_gallery` victory. First MULTI child wins. Failed later walk is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-boot-hold`

NAME: Boot Hold  
ROLE: CONTROL — cannot walk until they Strike  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 9`; `aiProfile` guardian/charger  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥9. `generationMin: 9`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 1 turn. The target cannot confirm a **walk** until they resolve Strike this turn (`effectParams: {"forbidWalkUntilStrike":true}`). Spells stay legal. Forced-move does **not** clear the hold. Distinct from Strike Hold (Strike illegal until walk), Cast Hold (spells illegal until walk), Gait Seal (walk illegal, spells legal), Must Pace (next spell fizzles unless they walked), Boot Lend (#636: +1 MP to an unmoved **ally**).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_walk_until_strike"`. Skip if they already Struck or if they have no Strike.  
PLAYER_COUNTERPLAY: Strike then walk; blink; Dispel; cast in place  
SYNERGIES: Root first (they cannot pay even after Strike if MP is 0); Cast Hold on a different target — do not stack both on one body (last writer)  
BALANCE_RISK: Hold + Root is a full lockout of walks. 1 turn + CD 2 + spells still work.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-near-oath`

NAME: Near Oath  
ROLE: CONTROL — next spell must be range ≤ 1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `origin_mason` or `far_stinger`; `G ≥ 9`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `origin_mason`, `far_stinger`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥9. `generationMin: 9`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 1 turn. The target’s next spell confirm must have effective `range ≤ 1` (`effectParams: {"nextSpellRangeMax":1}`). Longer confirms fail closed; AP not spent. Strike (range 1) remains legal. Distinct from Unit Oath (unit class), Ground Oath (ground only), Short Sight (range cut, confirms still legal), Aim Veil (cannot be primary).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_range_le_1"`. Skip if their kit is already melee-only.  
PLAYER_COUNTERPLAY: Strike / self buffs; walk in; wait 1 turn; Dispel  
SYNERGIES: Frost / Inferno / Far Sting in hand become dead; File Lance still legal if effective range is 1  
BALANCE_RISK: Oath + Ground Oath is a brick if they have no melee. Last writer. 1 turn.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-paint-reel`

NAME: Paint Reel  
ROLE: POSITION — pull 1 toward nearest paint  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `fuse_binder` or `ember_knight`; `G ≥ 9`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `fuse_binder`, `ember_knight`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Attract the target 1 tile toward the nearest living **paint** cell (cinder / rime / wick / echo / fuse — last-written paint table) (`applyAttract` dest = that cell, distance 1) (`effectParams: {"attractTowardNearestPaint":true}`). If none, or the step is blocked / void / portal, fizzle that slide (AP spent). Distinct from Foe Reel (toward a **body**), Ally Reel (toward ally), File Reel (toward caster), Echo Paint (copy).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_paint"`. Prefer a slide onto cinder / rime. Skip if no paint or both steps blocked. Do not assign until `applyAttract` has a production cast caller (Ally Reel / Foe Reel first; this is the paint dest flavor).  
PLAYER_COUNTERPLAY: Wipe paint (Echo Wipe); occupy the toward-tile; Barrier  
SYNERGIES: Echo Paint then Reel; Cinder Tile under the dest  
BALANCE_RISK: Clustering into Inferno / Nova is the combo. AI value-check.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Blocked slide still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nook-bite`

NAME: Nook Bite  
ROLE: DAMAGE — bonus if exactly one adjacent block  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `trip_mason`; `G ≥ 9`; `aiProfile` charger/caster  
ENEMY_FAMILIES: `glass_sniper`, `trip_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥9. `generationMin: 9`  
RARITY: UNCOMMON  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 10 damage. If the target’s cell has **exactly one** Chebyshev-1 blocking tile (barrier / void / map edge counts as a block), deal +8 (`effectParams: {"nookBonus":true,"nookDamage":8}`). Distinct from Field Bite (0 blocks), Wall Bite / Wall Sting (any hug), Lone Sting (0 adjacent **bodies**).  
SCALING: base 10 follows `spellDmgGrowthPercent`; nook +8 fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_exactly_one_adj_block"`. Skip if 0 or ≥ 2 blocks (use Field Bite / Wall Bite).  
PLAYER_COUNTERPLAY: Step into the open or into a corner-of-two; Barrier  
SYNERGIES: `nook_court`; Brick Shift to leave exactly one wall  
BALANCE_RISK: Corner camping. +8 is the same band as Field/Wall Bite so the choice is **which floor**, not more damage.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stride-mark`

NAME: Stride Mark  
ROLE: CONTROL — cell paint; detonate when they walk off that cell  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stride_hunter` or `hex_chorister`; `G ≥ 9`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stride_hunter`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 9`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Paint the **target’s current cell** for 2 turns (`freeCells: false`). The next time **that body** spends ≥ 1 **walk MP** to **leave that painted cell**, the paint detonates for 12 and ends (`effectParams: {"detonateOnWalkLeaveCell":true,"strideMarkDamage":12}`). Forced-move / blink / swap off the cell does **not** detonate and **clears** the paint. A later walk from a different cell does **not** detonate. Distinct from Gait Wick (#636: **unit** mark that follows them and detonates on any walk-MP spend), Exit Sting (first leave of a different paint, 8 now), Wound Mark (being hit), Cast Mark (their cast), Boot Sting (tax a paid step). Do **not** reuse `gaitWickDamage`.  
SCALING: 12 follows growth  
AI_REQUIREMENTS: `aiHint: "detonate_on_walk_leave_cell"`. Skip if rooted, MP = 0, or they are already off the cell.  
PLAYER_COUNTERPLAY: Strike / cast in place; blink / swap off (clears, 0); Dispel; wait it out  
SYNERGIES: `stride_pulpit`; Gait Seal so they cannot walk it off; Root first  
BALANCE_RISK: Mark + Root is a dead card. Skip if they cannot walk. Cell-scoped so a shove + later walk is not a free 12.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Detonation is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-foe-plate`

NAME: Foe Plate  
ROLE: SUPPORT — incoming 50/50 with adjacent enemy  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `void_mirror` or `pain_suture`; `G ≥ 9`; `aiProfile` guardian/tank  
ENEMY_FAMILIES: `void_mirror`, `pain_suture`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. The next applied hit on the caster is split 50/50 with a living **hostile-to-the-caster** Chebyshev-1 (`effectParams: {"splitIncomingEnemyPct":0.5}`). If none at hit time, the caster takes the full hit and the charge ends. Distinct from Split Plate (share with an **ally**), Pain Link / Load Bearing (tether %).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "split_incoming_adjacent_enemy"`. Skip if no adjacent hostile.  
PLAYER_COUNTERPLAY: Isolate them; hit the neighbor first; wait 2  
SYNERGIES: Foe Reel to create the neighbor; Crowd Tax after they huddle  
BALANCE_RISK: Player copy can park a summon next to a boss. Charge is **one hit** + CD 3.  
PERSISTENCE_REQUIREMENTS: Observe on the **cast**. Later shared incoming is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lava-skip`

NAME: Lava Skip  
ROLE: SUPPORT — next 1-tile walk ignores lava  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `ember_knight` or `wick_painter`; `G ≥ 9`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `ember_knight`, `wick_painter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥9. `generationMin: 9`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Arm. The caster’s **next 1-tile walk** this turn treats lava / ember-wake / cinder as floor (no enter tick) (`effectParams: {"nextWalkIgnoresLava":true}`). Length ≥ 2 does **not** ignore. Forced-move does not consume. Distinct from Pit Skip (pit only), Safe Fall (forced-move hazard), Ember Step (paints lava), Gap Ward (skips overwatch).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_walk_ignores_lava"`. Arm then walk 1 onto lava. Skip if no lava on a 1-step.  
PLAYER_COUNTERPLAY: Force a 2-step; Root; occupy the far side  
SYNERGIES: Ember Wake then skip; Cinder Tile under the dest  
BALANCE_RISK: Free lava camping. Self-only + 1-tile + CD 2.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. The later lava walk is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-still-plate`

NAME: Still Plate  
ROLE: SUPPORT — 0 leftover walk MP → +RES  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `tempo_precentor`; `G ≥ 9`; `aiProfile` guardian/tank  
ENEMY_FAMILIES: `plate_warden`, `tempo_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥9. `generationMin: 9`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If the caster’s leftover **walk MP** is 0 at resolve, +30% RES for 1 turn (`effectParams: {"emptyLeftoverMpRes":1.3,"emptyLeftoverMpDuration":1}`). If leftover MP ≥ 1, fizzle (AP spent, no RES). Distinct from Empty Plate (0 leftover **AP**), Planted Stance (0-walk stance), Still Brand (punishes **target** 0 MP).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "self_buff_if_zero_leftover_mp"`. Spend walk first, then cast — or skip if they still need a 2-tile walk.  
PLAYER_COUNTERPLAY: Force leftover MP (Haste, Spare Pace); hit before they spend down  
SYNERGIES: Walk Toll on **them** so they spend the last MP; Planted Stance on a different body  
BALANCE_RISK: Empty Plate + Still Plate is double RES. Last writer on the empty-pool RES flag; different keys (`emptyLeftoverRes` vs `emptyLeftoverMpRes`).  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-body-sill`

NAME: Body Sill  
ROLE: CONTROL — primary cannot leave the cell  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `leash_warden`; `G ≥ 9`; variant ≥ ELITE; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE / G≥9. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: 1 turn. If the target is the **player primary** (not `isSummon`), they cannot confirm a walk that leaves their current cell (`effectParams: {"forbidPrimaryLeaveCell":true,"bodySillDuration":1}`). Summons are unaffected. Blink / Swap / shove still move them and **end** the sill. Distinct from Quiet Sill (#636: occupant cannot resolve **Strike**), Kennel Sill (summons cannot leave), Pet Sill (summons cannot enter), Root (MP lock).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_primary_leave_cell"`. Skip if the in-range body is a summon.  
PLAYER_COUNTERPLAY: Swap / blink; send a summon; Dispel; wait 1  
SYNERGIES: Far Watch on the cell; Cinder under their feet  
BALANCE_RISK: Sill + Root is a brick. 1 turn + CD 3 + blink still works.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-clash-mend`

NAME: Clash Mend  
ROLE: SUPPORT — heal iff target Struck  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; `G ≥ 9`; variant ≥ ELITE; `aiProfile` healer/buffer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE / G≥9. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: Heal 8 iff the target resolved Strike this turn (`effectParams: {"requireTargetStruckHeal":true,"clashMendAmount":8}`). If they have not Struck, heal 0 (AP spent). Distinct from Shove Mend (#636: target **force-moved**), Chase Mend (target **walked**), Gait Mend (**caster** walked), Split Mend / Enter Mend (tile / split). **Never** in non-healer CORE (`inferArchetype` still maps `healAmount > 0` to healer).  
SCALING: 8 follows growth  
AI_REQUIREMENTS: `aiHint: "heal_if_target_struck"`. Skip if unstruck or missing HP < 8.  
PLAYER_COUNTERPLAY: Do not let the wounded body Strike; Mute Thread their Strike; kill before the mend  
SYNERGIES: Oath Blade so they **must** Strike; Verse First on a different body  
BALANCE_RISK: Free sustain on chargers. ELITE + skip if unstruck + healer CORE only.  
PERSISTENCE_REQUIREMENTS: Observe even on heal 0. `no_healing` flips only when HP increased.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-shave`

NAME: Cadence Shave  
ROLE: SUPPORT — −1 all remaining CDs on an ally  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `cadence_thief`; `G ≥ 9`; `aiProfile` caster/buffer  
ENEMY_FAMILIES: `cadence_thief`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE / G≥9. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 3  
EFFECT: Every kit id on the **ally** with remaining CD ≥ 1 is reduced by 1 (min 0) (`effectParams: {"shaveAllRemainingCds":true}`). Ids already at 0 are unchanged. Self is a legal ally. Distinct from Cadence Stretch (#636: **hostile** remaining ×2), Cadence Stall (**+1** all on a **hostile**), Cadence Flush (ally all → **0**), Cadence Lend (−1 **one** ally id), Cadence Crack (hostile highest → 0), Cadence Theft (steal 1).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "shave_all_remaining_cds"`. Prefer an ally whose highest remaining CD is ≥ 2. Skip if all CDs are 0 or 1 (Flush is the full reset).  
PLAYER_COUNTERPLAY: Kill the ally before the shave; Mute Thread the recycled id  
SYNERGIES: `shave_nave`; Stall the player then Shave the Inferno queen  
BALANCE_RISK: Shave + Flush in one turn is a full recycle. CD 3 + G≥9 + AI skips CD 1.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-bar shave still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gait-tax`

NAME: Gait Tax  
ROLE: CONTROL — next spell +1 AP if they walked  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 9`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥9. `generationMin: 9`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 1 turn. If the target spent ≥ 1 **walk MP** this turn, their next spell costs +1 AP (`effectParams: {"taxNextSpellIfWalked":true,"gaitTaxAp":1}`). If they have not walked, the tax does not apply (AP spent). Not `spell.mpCost`. Distinct from Walk Toll (+1 **walk MP**), Camp Tax / Act Tax (other wallets), Ley Toll (self amp).  
SCALING: tax fixed +1  
AI_REQUIREMENTS: `aiHint: "tax_next_spell_if_walked"`. Skip if unmoved or if they only have Strike.  
PLAYER_COUNTERPLAY: Cast before walking; Strike; wait 1 turn  
SYNERGIES: Boot Hold so they must Strike instead of walking off; Must Pace on a different body  
BALANCE_RISK: Tax + Walk Toll is two wallets. 1 turn + CD 2 + walk-gated.  
PERSISTENCE_REQUIREMENTS: Observe even when they have not walked. Paying the extra AP later is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-wipe`

NAME: Brick Wipe  
ROLE: TERRAIN — erase adjacent barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 9`; `aiProfile` caster  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 1  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Erase one Chebyshev-1 `barrierTiles` cell (`effectParams: {"eraseBarrierAdjacent":true}`). If the aimed cell is not a barrier, fizzle (AP spent). Does **not** erase paint (Echo Wipe) and does **not** slide the brick (Brick Shift). Map-gen walls that are not in `barrierTiles` are illegal.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "erase_adjacent_barrier"`. Prefer opening a file the caster can lance. Skip if no adjacent barrier.  
PLAYER_COUNTERPLAY: Stand off the opened file; re-drop a turret; Brick Shift the wall away first  
SYNERGIES: File Lance down the opened file; Nook Bite after a two-wall corner becomes one  
BALANCE_RISK: Deleting cover can unsolve a choke. Adjacent-only + CD 3 + `finalizePlayableLayout` still required on the room. Do not edit `mapGen.ts`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty wipe still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-mute`

NAME: Watch Mute  
ROLE: CONTROL — next overwatch snap deals 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `shadow_lurker` or `hood_lurker`; `G ≥ 9`; variant ≥ ELITE; `aiProfile` caster/controller  
ENEMY_FAMILIES: `shadow_lurker`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE / G≥9. `generationMin: 9`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: 2 turns. The next time an armed overwatch / Far Watch / Hold Ground **snaps** at the target, that snap deals 0 and the mute ends (`effectParams: {"nextOverwatchDealsZero":true}`). The overwatch charge is still consumed. Distinct from Far Hood (#636: next hit from Chebyshev ≥ 3 is 0), Last Mute (#636: last **resolved id** illegal), Gap Ward (skip overwatch on a **1-tile walk**), Far Watch (the snap itself), Mute Thread (next **any** id fizzles).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_overwatch_deals_zero"`. Skip if no armed overwatch sits on the player path.  
PLAYER_COUNTERPLAY: Do not walk the snap; Dispel; wait 2  
SYNERGIES: Far Watch on a different file; Gap Ward on a different body  
BALANCE_RISK: Mute + Gap Ward deletes two snaps. ELITE + one snap + CD 3.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. The later 0-damage snap is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-full-purse`

NAME: Full Purse  
ROLE: DAMAGE — bonus if leftover AP ≥ 3  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; `G ≥ 9`; variant ≥ ELITE; `aiProfile` charger/caster  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE / G≥9. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 10 damage. If the **target** has leftover AP ≥ 3 at resolve, deal +8 (`effectParams: {"leftoverApBonusMin":3,"leftoverApBonusDamage":8}`). Distinct from Dry Sting (#636: leftover AP **= 0**), Purse Keep (#636: **bank** leftover), Empty Plate (leftover **0** → +RES), Full Bar (equipped **count**), Empty Purse (different wallet), Leftover Lend (dump leftover).  
SCALING: base 10 follows growth; +8 fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_ge_3"`. Skip if leftover ≤ 2 (use Empty Plate / a plain poke).  
PLAYER_COUNTERPLAY: Spend down to 2 before the poke; Purse Lock their leftover  
SYNERGIES: Loan Tempo so they sit on leftover; Spare Pace then poke  
BALANCE_RISK: Punishes hoarding leftover. ELITE + skip if they already spent.  
PERSISTENCE_REQUIREMENTS: Observe even when leftover is 2 (no bonus).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pet-cut`

NAME: Pet Cut  
ROLE: DAMAGE — bonus vs player-side summon  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `spark_chanter` or `leash_warden`; `G ≥ 9`; variant ≥ ELITE; `aiProfile` caster/charger  
ENEMY_FAMILIES: `spark_chanter`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE / G≥9. `generationMin: 9`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: 10 damage. If the target is `isSummon === true` **and** `side === player` (enemy-cast: the player’s living summon), deal +10 (`effectParams: {"playerSideSummonBonus":10}`). Player copy: bonus vs an **enemy-side** summon (`side === enemy`). Distinct from Summon Bane (any `isSummon`), Crown Cut (`isLeader`), Sated Fang (vampire door). Never `spell.name`.  
SCALING: base 10 follows growth; +10 fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_player_side_summon"`. Skip if no player-side summon is in range (use Crown Cut / a plain poke).  
PLAYER_COUNTERPLAY: Dismiss / hide the pet; body-block with the primary  
SYNERGIES: Kennel Sill so the pet cannot leave; Short Leash  
BALANCE_RISK: Deletes spark whelps. ELITE + skip if no pet + Dummy Post is a legal summon.  
PERSISTENCE_REQUIREMENTS: Observe even on a non-summon (no bonus).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-stride`

NAME: Pack Stride  
ROLE: AURA — pack siphon leftover walk MP  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `stride_precentor` CHAMPION only; `G ≥ 9`; `aiProfile` buffer  
ENEMY_FAMILIES: `stride_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE / CHAMPION. `generationMin: 9`  
RARITY: SIGNATURE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: Aura 2 turns, radius 2. At each allied turn start, if that ally has leftover walk MP ≥ 1, they lose 1 leftover MP and the champion’s next walk costs 1 less (min 0) (`effectParams: {"packSiphonLeftoverMp":true,"packSiphonMpRadius":2}`). Not `spell.mpCost`. Distinct from Pack Tithe (leftover **AP**), Pack Still (leftover-0 veil), Pack Tempo (+AP), Step Rebate (self next walk −1). Never enters `ownedSpellIds`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_siphon_leftover_mp"`. CHAMPION only. Skip if aura up or no ally in 2 with leftover MP ≥ 1. Do **not** assign on `cadence_lender` (Pack Tithe) or `tempo_precentor` (Pack Still).  
PLAYER_COUNTERPLAY: Isolate the champion; spend ally MP before the tick  
SYNERGIES: Spare Pace on the pack; Walk Toll on the player  
BALANCE_RISK: Free pack mobility. Signature + CHAMPION + never owned.  
PERSISTENCE_REQUIREMENTS: Aura ticks never observe. Never write `ownedSpellIds`. Optional dim `UNKNOWN TECHNIQUE` on the **cast** only.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-knight-fold`

NAME: Knight Fold  
ROLE: SIGNATURE — knight-(2,1) rotate two player-side bodies  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `knight_fold_regent` only  
ENEMY_FAMILIES: `knight_fold_regent`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE / BOSS. `generationMin: 9`  
RARITY: SIGNATURE  
AP_COST: 6  
RANGE: 5  
TARGET_TYPE: special  
LOS: false  
COOLDOWN: 4  
EFFECT: Exactly two living **player-side** bodies. Each is moved to a cell that is a knight (2,1) from their current midpoint. If either dest is off-board, occupied, void, or portal, the whole fold fizzles (AP spent). Occupancy is **not** `map.portals` and not Twin / Triune / Twin Span / Triple Span / Pair Hinge / About Hinge / Quad Span tables (`effectParams: {"foldKnightPlayerSide":true}`). Distinct from About Hinge (180°), Pair Slide (#636: translate two adj hostiles 1 step), Quad Span (#636: 2×2 occupy), Pair Hinge (90° of hostiles-to-caster), Court Hinge (mass pair-hinge), Knight Pierce (poke), Knight Slip (self). Never owned.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "fold_knight_player_side"`. Boss AI only. Skip unless exactly two player-side bodies and both dests are free.  
PLAYER_COUNTERPLAY: Keep one summon dead; occupy a dest; stand so the (2,1) is off-board  
SYNERGIES: Lava / pit under a dest; Body Sill after they land  
BALANCE_RISK: Arena scramble. 6 AP + fizzle if dests illegal + never owned. Landing on lava/spikes uses existing `recordInBattleChallengeDamage`.  
PERSISTENCE_REQUIREMENTS: Never write `ownedSpellIds`. Optional dim `UNKNOWN TECHNIQUE`. Do not restamp `about_hinge_regent` / `court_hinge_regent` / `file_regent` / `about_regent`.  
STATUS: PROPOSED

---

## 12. Family attachments (G≥9 extras — not #625 CORE)

Unique §11 ids attach as **generationMin: 9 extras** on older families. They are **not** CORE on #625 Wave-9 families (`gait_mender` … `clean_cantor`) and **not** CORE on #558 Wave-8 families (`wall_stinger` … `leash_cutter`).

| Family | Unique Wave-9 extra | Notes |
| :--- | :--- | :--- |
| `axis_locksmith` | Pair Stride (`pair_gallery` MULTI) | Not `pair_usher` / Pair Hinge / Must Span |
| `plate_warden` / `iron_golem` | Boot Hold | Not #625 `hold_knight` CORE (Strike Hold). Not Boot Lend |
| `origin_mason` / `far_stinger` | Near Oath | |
| `fuse_binder` / `ember_knight` | Paint Reel | |
| `glass_sniper` / `trip_mason` | Nook Bite | |
| `stride_hunter` / `hex_chorister` | Stride Mark | Cell paint. Not Gait Wick (unit-follow) |
| `void_mirror` / `pain_suture` | Foe Plate | |
| `ember_knight` / `wick_painter` | Lava Skip | Wick Painter CORE stays Pit Wick / #558 |
| `plate_warden` / `tempo_precentor` | Still Plate | Not Empty Plate |
| `glyph_sower` / `leash_warden` | Body Sill (ELITE) | |
| `pale_cantor` / `font_cantor` | Clash Mend (ELITE; healer CORE only) | Not Gait Mend / Chase Mend / Shove Mend |
| `cadence_thief` | Cadence Shave | Not Stall / Flush / Stretch |
| `tax_scribe` / `ley_tollkeeper` | Gait Tax | Not Walk Toll |
| `stone_castellan` / `rime_mason` | Brick Wipe | Not #625 `brick_shifter` CORE (Brick Shift) |
| `shadow_lurker` / `hood_lurker` | Watch Mute (ELITE) | Hood Lurker CORE stays Tick Hood / #558 |
| `purse_scribe` / `bone_scribe` | Full Purse (ELITE) | |
| `spark_chanter` / `leash_warden` | Pet Cut (ELITE) | |
| `stride_precentor` CHAMPION | Pack Stride (`ENEMY_ONLY`) | Not `cadence_lender` / `tempo_precentor` |
| `knight_fold_regent` | Knight Fold (`BOSS_ONLY`) | Not `about_hinge_regent` / `court_hinge_regent` / `span_quad` / `court_stretch_regent` |

#625 Wave-9 families keep **#563** plus leftover **#533** unique CORE. Unique §11 ids may appear there only as G≥9 extras in a later family pass (Wave 10), not as this document’s CORE. Wave-8 unique CORE (`spell-odd-stride` … `spell-about-hinge`) also stays a G≥8 extra until that Wave-10 pass.

---

## 13. How to add Generation 10 forever

Same recipe as Wave 8 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 10 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve).

Suggested Wave-10 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for Wave-8 unique verbs (#625 deferred those to Wave 10). Four-cell occupy is **#636 Quad Span** — do not clone; it stays implementation-blocked while `ENEMY_SUMMON_CAP` is 2. Wave 10 families consume **#636**. Knight Fold stays `BOSS_ONLY` on `knight_fold_regent` — do not also grant Pair Stride from that fight, and do not restamp #518 / #525 / #563 / #572 / #625 / **#636** extra doors.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Wave-2 **before** Wave-3. Wave-3 **before** Wave-4. Wave-4 **before** Wave-6. Wave-6 **before** Wave-7. Wave-7 **before** Wave-8. Wave-8 **before** any Wave-9 data. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / **#590** / **#625** / **#636** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W9-A. G≥9 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W9-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W9-C. Wave-9 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #563 / #590 / **#636** / memory Wave-5 ids |
| W9-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `ENC-*` / `WF-*` / `pair_usher` / `odd_gallery` as Pair Stride |
| W9-E. Paint Reel attract caller | `applyAttract` toward nearest paint | Damage-math rewrite; RAF |
| W9-F. Brick Wipe barrier erase | `barrierTiles` adjacency | `mapGen.ts`; solvability skip |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Stride Mark detonation, Gait Tax consume, Lava Skip consume, and Pack Stride siphon read flags at walk / spell-confirm / turn-start only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 8 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W9-1 | Encounter start | Possessed-but-unused G9 id does not observe |
| W9-2 | Pair Stride 1-step | Confirm fails; MP not spent; Pair Stride already observed |
| W9-3 | `pair_gallery` defeat | Does not grant. Victory grants once (MULTI) |
| W9-4 | `odd_gallery` / `even_gallery` / `pair_usher` | Do not grant Pair Stride |
| W9-5 | Boot Hold vs Strike Hold vs Cast Hold vs Gait Seal | Walk illegal until Strike vs Strike illegal until walk vs spells illegal until walk vs walk illegal / spells legal |
| W9-6 | Near Oath then Inferno | Long confirm fails; Strike still legal |
| W9-7 | Paint Reel no paint | Fizzle observes; no pull |
| W9-8 | Nook Bite vs Field Bite vs Wall Bite | Exactly 1 block +8 vs 0 +8 vs any hug +8 |
| W9-9 | Stride Mark then Strike only | No detonate; cell paint remains. Shove off the cell clears with 0. A later walk from a new cell does not detonate. Gait Wick would still follow |
| W9-10 | Foe Plate no adjacent enemy at hit | Full hit; charge gone |
| W9-11 | Lava Skip length 2 | Does not ignore the lava |
| W9-12 | Still Plate with leftover MP 1 | Fizzle observes; no RES |
| W9-13 | Body Sill vs Kennel Sill | Primary cannot leave vs summon cannot leave |
| W9-14 | Clash Mend vs Chase Mend vs Gait Mend | Target Struck vs target walked vs caster walked. Non-healer CORE has none |
| W9-15 | Cadence Shave vs Stall vs Flush vs Stretch | Ally −1 all vs hostile +1 all vs ally all→0 vs hostile remaining ×2 |
| W9-16 | Gait Tax unmoved | No +1 AP; already observed |
| W9-17 | Brick Wipe non-barrier | Fizzle observes |
| W9-18 | Watch Mute vs Gap Ward | Snap deals 0 vs 1-tile walk skips snap |
| W9-19 | Full Purse leftover 2 | 10 only. No bonus |
| W9-20 | Pet Cut on primary | 10 only. `isSummon` false |
| W9-21 | Pack Stride / Knight Fold | Never in `ownedSpellIds` |
| W9-22 | Loaner / `WF-SPL-*` | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W9-23 | G=8 Tide | No Pair Stride / Gait Tax (`generationMin: 9`) |
| W9-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W9-25 | No cloned ids | Unique §11 ids absent from #563 / #590 / **#636** catalogs |
| W9-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Gait Tax / Pack Stride are flags |
| W9-27 | Hex Toll | Still not in any SDE pool |
| W9-28 | Memory Wave-5 / Wave-8 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W9-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W9-30 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–8, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, **#590**, or **#636** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #563 / #572 own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / **#636** extra doors
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `odd_gallery` / `even_gallery` / `pair_usher` as Pair Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #558 CORE or #625 CORE
- Cloning #636 (`spell-shove-mend` … `spell-court-stretch`) into unique §11

---

## 17. Wave-9 index

**Unique SDE ids (19):** pair-stride, boot-hold, near-oath, paint-reel, nook-bite, stride-mark, foe-plate, lava-skip, still-plate, body-sill, clash-mend, cadence-shave, gait-tax, brick-wipe, watch-mute, full-purse, pet-cut, pack-stride, knight-fold.

**#563 stamps (do not clone):** Gait Mend, Pair Hinge, Cadence Flush, Lone Sting, Morrow Plate, Gait Seal, Diag Lock, Brick Shift, Mend Wick, Return Sting, Leftover Lend, Dummy Post, Enter Mend, Body Mark, Split Mend, Court Hinge.

**#636 stamps (do not clone):** Shove Mend, Cadence Stretch, Quad Span, Gait Wick, Dry Sting, Home Step, Must Span, Far Hood, Boot Lend, Quiet Sill, Exit Sting, Purse Keep, Tick Plate, Last Mute, Pair Slide, Court Stretch.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-pair-stride` | MULTI_SOURCE | yes | locksmith G≥9 **or** `pair_gallery` | **One** next walk Manhattan exactly 2 (not Must Span) |
| `spell-boot-hold` | ENEMY_DISCOVERY | yes | plate / golem | Cannot walk until they Strike |
| `spell-near-oath` | ENEMY_DISCOVERY | yes | origin / far stinger | Next spell range ≤ 1 |
| `spell-paint-reel` | ENEMY_DISCOVERY | yes | fuse / ember | Pull 1 toward nearest paint |
| `spell-nook-bite` | ENEMY_DISCOVERY | yes | glass / trip | Bonus if exactly 1 adj block |
| `spell-stride-mark` | ENEMY_DISCOVERY | yes | stride / hex | Cell paint; detonate on walk-leave (not Gait Wick) |
| `spell-foe-plate` | ENEMY_DISCOVERY | yes | void / pain | Incoming 50/50 with adj enemy |
| `spell-lava-skip` | ENEMY_DISCOVERY | yes | ember / wick | 1-tile walk ignores lava |
| `spell-still-plate` | ENEMY_DISCOVERY | yes | plate / tempo | 0 leftover walk MP → +RES |
| `spell-body-sill` | ELITE | yes | glyph / leash | Primary cannot leave the cell |
| `spell-clash-mend` | ELITE | yes | pale / font cantor | Heal iff **target Struck** (not Shove Mend) |
| `spell-cadence-shave` | ENEMY_DISCOVERY | yes | cadence_thief | Ally −1 all remaining CDs (not Stretch) |
| `spell-gait-tax` | ENEMY_DISCOVERY | yes | tax / ley | Next spell +1 AP if they walked |
| `spell-brick-wipe` | ENEMY_DISCOVERY | yes | stone / rime | Erase adjacent barrier |
| `spell-watch-mute` | ELITE | yes | lurker / hood | Next overwatch snap deals 0 |
| `spell-full-purse` | ELITE | yes | purse / scribe | Bonus if leftover AP ≥ 3 |
| `spell-pet-cut` | ELITE | yes | spark / leash | Bonus vs player-side summon |
| `spell-pack-stride` | ENEMY_ONLY | no | `stride_precentor` CHAMPION | Pack siphon leftover walk MP |
| `spell-knight-fold` | BOSS_ONLY | no | `knight_fold_regent` | Knight-(2,1) two player-side bodies |

All unique rows STATUS: **PROPOSED**.
