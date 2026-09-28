# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 11

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-28  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–10 are Generations 3–10. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Wave 6 (#480) is Generation 6 so those memory ids stay tombstoned. Wave 7 (#533) is Generation 7. Wave 8 (#590) is Generation 8. Wave 9 (#646) is Generation 9. Wave 10 (#679) is Generation 10. This document is **Generation 11**. `generationMin: 11`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-28.md`](./ACTION_IDS_SDE_2026-09-28.md).

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
| Wave-7 discovery contract | still-open #533 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-24.md` | G≥7 extra slot, W7 unique ids, #525 stamps |
| Wave-8 discovery contract | still-open #590 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md` | G≥8 extra slot, W8 unique ids, #563 stamps |
| Wave-9 discovery contract | still-open #646 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md` | G≥9 extra slot, W9 unique ids, #636 stamps |
| Wave-10 discovery contract | still-open #679 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md` | G≥10 extra slot, W10 unique ids, #636 CORE stamps |
| Wave-1…10 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-27.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | #342 | Gale Fan … Eclipse Fold |
| Tactical gap-fillers W5 | still-open #411 | Oncoming … Act Bell |
| Tactical gap-fillers W6 | still-open #463 | Post Sting … About Face |
| Tactical gap-fillers W7 | still-open #525 | Wall Sting … Court Shove |
| Tactical gap-fillers W8 | still-open #563 | Gait Mend … Court Hinge |
| Tactical gap-fillers W9 | still-open #636 | Shove Mend … Court Stretch |
| Tactical gap-fillers W10 | still-open **#695** — `SPELL_PROPOSALS_2026-09-27.md` | Both Mend … Court Keep. **Stamp onto Wave-11 family CORE, do not clone**. Extra doors `both_cantor` / `stride_bursar` / `span_penta` / `trim_precentor` / `court_keep_regent` — do not restamp |
| Tactical gap-fillers W11 | still-open **#726** — `SPELL_PROPOSALS_2026-09-28.md` | Heave Mend … Court Dual. **Stamp, do not clone**. Unique §11 stay this catalog’s. Extra doors `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` — do not restamp. Wave 12 families consume #726 as CORE |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + **#686** | #686 Wave-10 families consume **#636**. Wave-11 families consume unique **#646** Wave-9 verbs **and** **#695**. Do **not** put unique §11 ids there |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / **#663** | Extra doors claimed through Wave 11 (`crypt_sexton` … `orbit_succentor`; `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`). Do not restamp |
| Same-day sibling | #715 — live combat renderer fact sheet | Visuals only. Not a spell catalog |
| PX coherence | #343 / #393 / #481 / #579 / #632 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-11 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

At audit start (2026-09-28 00:03 UTC) no `SPELL_PROPOSALS_2026-09-28.md` existed. During this run, **#726** opened (00:11 UTC) as Wave-11 tactical. Same-day #715 is a renderer fact sheet. **SDE wins** unique §11 ids if they collide; this catalog’s unique ids do not match #726’s. Stamp #726. Do not clone Heave Mend as Force Mend — that hole is #726’s. Unique §11 uses Dry Mend (both leftover AP = 0), the hole #726 still held.

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

**Wave 9 SDE (#646):** `spell-pair-stride`, `spell-boot-hold`, `spell-near-oath`, `spell-paint-reel`, `spell-nook-bite`, `spell-stride-mark`, `spell-foe-plate`, `spell-lava-skip`, `spell-still-plate`, `spell-body-sill`, `spell-clash-mend`, `spell-cadence-shave`, `spell-gait-tax`, `spell-brick-wipe`, `spell-watch-mute`, `spell-full-purse`, `spell-pet-cut`, `spell-pack-stride`, `spell-knight-fold`.

**Wave 10 SDE (#679):** `spell-inch-stride`, `spell-rite-first`, `spell-long-oath`, `spell-cinder-reel`, `spell-side-bite`, `spell-ingress-mark`, `spell-off-plate`, `spell-spike-skip`, `spell-tapped-plate`, `spell-summon-brace`, `spell-bar-mend`, `spell-cadence-pin`, `spell-still-tax`, `spell-brick-sprout`, `spell-watch-fee`, `spell-lone-purse`, `spell-banner-cut`, `spell-pack-close`, `spell-mid-fold`.

**#695 tactical Wave 10:** `spell-both-mend`, `spell-stride-keep`, `spell-penta-span`, `spell-cadence-trim`, `spell-near-hood`, `spell-gait-sip`, `spell-cast-sill`, `spell-shove-sting`, `spell-must-step`, `spell-ally-step`, `spell-damp-sting`, `spell-pair-pace`, `spell-verse-tax`, `spell-tool-hold`, `spell-spent-lend`, `spell-court-keep`.

**#726 tactical Wave 11 (same-day; never re-propose):** `spell-heave-mend`, `spell-dual-keep`, `spell-sept-span`, `spell-cadence-halve`, `spell-mid-hood`, `spell-ready-sting`, `spell-heave-step`, `spell-drift-sill`, `spell-drift-hold`, `spell-drift-lend`, `spell-drift-sip`, `spell-drift-post`, `spell-heave-bounce`, `spell-must-drift`, `spell-verse-pace`, `spell-court-dual`.

**Do not alias** `spell-diag-stride` ↔ `spell-inch-stride` / `spell-pair-stride` / `spell-must-span` / `spell-must-step` / `spell-must-pace` / `spell-diag-lock` / `spell-even-stride` / `spell-odd-stride`, `spell-mid-oath` ↔ `spell-near-oath` / `spell-long-oath` / `spell-ground-oath` / `spell-unit-oath` / `spell-oath-blade`, `spell-void-reel` ↔ `spell-cinder-reel` / `spell-paint-reel` / `spell-foe-reel` / `spell-ally-reel` / `spell-file-reel` / `spell-void-glyph` / `spell-void-anchor`, `spell-foe-bite` ↔ `spell-side-bite` / `spell-nook-bite` / `spell-field-bite` / `spell-wall-bite` / `spell-lone-sting` / `spell-flank-share`, `spell-dwell-mark` ↔ `spell-stride-mark` / `spell-ingress-mark` / `spell-gait-wick` / `spell-exit-sting` / `spell-wound-mark` / `spell-cast-mark`, `spell-own-plate` ↔ `spell-off-plate` / `spell-foe-plate` / `spell-morrow-plate` / `spell-tick-plate` / `spell-near-hood` / `spell-far-hood`, `spell-cinder-skip` ↔ `spell-lava-skip` / `spell-spike-skip` / `spell-pit-skip` / `spell-gap-ward` / `spell-cinder-tile`, `spell-full-plate` ↔ `spell-tapped-plate` / `spell-still-plate` / `spell-empty-plate` / `spell-split-plate`, `spell-summon-toll` ↔ `spell-walk-toll` / `spell-kennel-lock` / `spell-still-leash` / `spell-short-leash`, `spell-still-mend` ↔ `spell-both-mend` / `spell-bar-mend` / `spell-gait-mend` / `spell-clash-mend` / `spell-shove-mend` / `spell-heave-mend` / `spell-dry-mend`, `spell-cadence-rest` ↔ `spell-cadence-pin` / `spell-cadence-stall` / `spell-cadence-shave` / `spell-cadence-flush` / `spell-cadence-stretch` / `spell-cadence-trim` / `spell-cadence-halve`, `spell-spent-tax` ↔ `spell-still-tax` / `spell-gait-tax` / `spell-camp-tax` / `spell-act-tax` / `spell-quiet-hex`, `spell-brick-crack` ↔ `spell-brick-sprout` / `spell-brick-shift` / `spell-brick-wipe` / `spell-barrier`, `spell-watch-lend` ↔ `spell-watch-fee` / `spell-watch-mute` / `spell-boot-lend` / `spell-leftover-lend`, `spell-pair-purse` ↔ `spell-lone-purse` / `spell-full-purse` / `spell-dry-sting` / `spell-split-purse`, `spell-escort-cut` ↔ `spell-banner-cut` / `spell-crown-cut` / `spell-pet-cut` / `spell-summon-bane` / `spell-glance-cut`, `spell-dry-mend` ↔ `spell-both-mend` / `spell-heave-mend` / `spell-still-mend` / `spell-shove-mend` / `spell-dry-sting`, `spell-mid-oath` ↔ `spell-mid-hood` (exact-2 **spell gate** vs exact-2 **incoming miss**), `spell-pack-long` ↔ `spell-pack-close` / `spell-pack-stride` / `spell-pack-tithe` / `spell-paper-wind` / `spell-long-oath`, `spell-adj-fold` ↔ `spell-mid-fold` / `spell-knight-fold` / `spell-sovereign-fold` / `spell-pawn-trade` / `spell-pair-hinge` / `spell-pair-slide`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Tactical Wave 10 (#695 — stamp onto Wave-11 family CORE, do not clone)

#695 **owns** the G≥10 tactical holes. Wave 10 SDE already recorded family extras for unique #679 ids. This document **consumes #695 as Wave-11 family CORE** (together with unique #646 Wave-9 verbs) and does **not** re-author those cards. Do **not** restamp #695 extra doors.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-both-mend` | MULTI_SOURCE | Heal iff **caster and target walked**. Distinct from Still Mend (**caster spent 0 walk MP**), Dry Mend (**both leftover AP = 0**), and Heave Mend (#726, **both force-moved**) |
| `spell-stride-keep` | MULTI_SOURCE | Bank leftover **MP** to next turn start. Distinct from Purse Keep (leftover **AP**) |
| `spell-penta-span` | MULTI_SOURCE | Five-cell plus occupy. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-cadence-trim` | MULTI_SOURCE | Hostile remaining CDs **−1**. Distinct from Cadence Rest (**own** remaining do not tick) |
| `spell-near-hood` | ELITE | Next hit from Chebyshev **≤ 1** is 0. Distinct from Own Plate (next hit on **your turn**, any range) |
| `spell-gait-sip` | ENEMY_DISCOVERY | Steal 1 MP iff they walked |
| `spell-cast-sill` | ENEMY_DISCOVERY | Occupant cannot resolve non-physical |
| `spell-shove-sting` | ENEMY_DISCOVERY | First **forced-move landing** deals 8. Distinct from Dwell Mark (end-turn occupy) |
| `spell-must-step` | ELITE | **All** remaining walks must be Chebyshev 1. Distinct from Diag Stride (**one** next walk, diagonal only) |
| `spell-ally-step` | ENEMY_DISCOVERY | Ally lands adjacent to the caster |
| `spell-damp-sting` | ENEMY_DISCOVERY | Bonus if leftover walk MP ≥ 2 |
| `spell-pair-pace` | ENEMY_DISCOVERY | Caster + adj ally translate 1 together |
| `spell-verse-tax` | ENEMY_DISCOVERY | Recast of last id costs +1 AP |
| `spell-tool-hold` | ENEMY_DISCOVERY | Cannot resolve non-physical until Strike |
| `spell-spent-lend` | ENEMY_DISCOVERY | +1 MP to an ally who already walked |
| `spell-court-keep` | NOT_PLAYER_LEARNABLE | Mass leftover-MP bank. Never owned. Distinct from Adj Fold |

`span_penta` is **not** Adj Fold’s door. `both_cantor` is **not** Still Mend’s door. `stride_bursar` is **not** Spent Tax’s door. `trim_precentor` is **not** Cadence Rest’s door. `court_keep_regent` is **not** `adj_fold_regent`.

### 0.2b Tactical Wave 11 (#726 — stamp, do not clone; Wave 12 family CORE)

#726 **owns** the G≥11 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-11 family CORE is still **#646 + #695**. **Do not** put #726 in Wave-11 family CORE. Wave 12 families consume #726 as CORE. Extra doors `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` — do not restamp. Do **not** mint `spell-both-heave` / `spell-hept-span` / `spell-vault-keep`.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-heave-mend` | MULTI_SOURCE | Heal iff **caster and target were force-moved**. Distinct from Dry Mend (both leftover AP = 0) and Both Mend (both walked) |
| `spell-dual-keep` | MULTI_SOURCE | Bank leftover **AP and MP** (cap 2 each) to next turn start. Distinct from Purse Keep (AP) and Stride Keep (MP) |
| `spell-sept-span` | MULTI_SOURCE | Seven-cell stretched plus. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-cadence-halve` | MULTI_SOURCE | floor-divide remaining CDs on one hostile. Distinct from Cadence Rest (**own** remaining do not tick) |
| `spell-mid-hood` | ELITE | Next hit from Chebyshev **exactly 2** is 0. Distinct from Mid Oath (exact-2 **spell gate**) |
| `spell-ready-sting` | ENEMY_DISCOVERY | Bonus if leftover AP **and** MP both ≥ 1 |
| `spell-heave-step` | ENEMY_DISCOVERY | Caster lands adjacent to a force-moved ally |
| `spell-drift-sill` | ENEMY_DISCOVERY | Occupant cannot be a relocate dest |
| `spell-drift-hold` | ELITE | Cannot walk until force-moved |
| `spell-drift-lend` | ENEMY_DISCOVERY | +1 AP to an ally who was force-moved |
| `spell-drift-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff they were force-moved |
| `spell-drift-post` | MULTI_SOURCE | Summon detonates on relocate landing; walk is safe |
| `spell-heave-bounce` | ENEMY_DISCOVERY | Bounce 1 to another force-moved hostile |
| `spell-must-drift` | ELITE | Remaining walks follow last forced-move dir. Distinct from Diag Stride (one next walk, diagonal only) |
| `spell-verse-pace` | ENEMY_DISCOVERY | Last id illegal until they walk |
| `spell-court-dual` | NOT_PLAYER_LEARNABLE | Mass Dual Keep. Never owned. Distinct from Adj Fold |

`heave_cantor` is **not** Still Mend’s door and **not** Dry Mend’s door. `dual_bursar` is **not** Spent Tax’s door. `span_sept` is **not** Adj Fold’s door. `halve_precentor` is **not** Cadence Rest’s door. `court_dual_regent` is **not** `adj_fold_regent`.

### 0.3 Held holes (still not this pass)

Wave 10 §13 listed these as Wave-11/12 candidates. This wave **does not** fill them in unique §11 except the one marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Four-cell / five-cell occupy | **#636 Quad Span** and **#695 Penta Span** own those holes. Do not clone. Live `ENEMY_SUMMON_CAP` is still 2 |
| Seven-cell occupy | Same cap. Still held |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| `jackpot` feat door | #185 Absolve already claimed `jackpot` as a MULTI child. Do not restamp |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Bank leftover AP **and** MP on one id | **#726 Dual Keep owns this hole.** Do not clone. Unique §11 does not mint `spell-vault-keep` |
| Heal if **both force-moved** | **#726 Heave Mend owns this hole.** Do not clone. Do not mint `spell-both-heave` |
| Seven-cell occupy | **#726 Sept Span owns this hole.** Do not clone. Do not mint `spell-hept-span` |
| Heal if **both leftover AP = 0** | **Filled this wave** as Dry Mend (`spell-dry-mend`). #726 held this hole |
| Dedicated CORE families for Wave-10 unique verbs | This catalog’s unique §11 ids stay G≥11 extras, not Wave-11 family CORE. Wave 12 families consume unique Wave-10 verbs. Wave-11 families consume **#646** and **#695** |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-seven days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 … 2026-09-27 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2440 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`main.mo` 132–142) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | All 15 feat doors are claimed or leftover. This wave **stamps none**. `survivor` stays leftover |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | All nine challenge ids remain claimed through Wave 7 |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | WX 11920; zone object at 4683–4687 | `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 194–199); every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Still Mend / Dry Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-11 unique ids stay `mpCost: 0`. Spent Tax / Summon Toll / Pack Long are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Void Reel is attract-toward-**nearest void/portal**, a new dest flavor after Cinder Reel (nearest hazard) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-11 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Escort Cut reads **living allied summon within 2 of the target**, never `spell.name` |
| Open PR queue | #327+, then 2026-09-27 docs, then same-day #715 / **#726**. **#371 owns Wave-4 SDE. #411 owns Wave-5 tactical. #463 owns Wave-6 tactical. #480 owns Wave-6 SDE. #525 owns Wave-7 tactical. #533 owns Wave-7 SDE. #563 owns Wave-8 tactical. #590 owns Wave-8 SDE. #636 owns Wave-9 tactical. #646 owns Wave-9 SDE. #663 owns Wave-11 extra boss doors. #679 owns Wave-10 SDE. #686 owns Wave-10 families. #695 owns Wave-10 tactical. #726 owns Wave-11 tactical.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-10 P0 remain the prerequisite. **Do not land Wave-11 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 11 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥11 rares make it sharper: a CHAMPION may hold the generation-11 verb until a diagonal lane / void cell / leftover AP ≥ 3 is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 11 fills holes Waves 1–10, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, **#679**, **#695**, and **#726** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Inch Stride, Must Step, Pair Stride, Cinder Reel, Ingress Mark, Off Plate, Both Mend, Heave Mend, Cadence Pin, Pack Close, Mid Fold, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 11 stamps `generationMin: 11`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Spent Tax **adds 1 AP** to the next spell if they walked last turn. Summon Toll taxes **allied summons** 1 AP to start a walk. Pack Long clamps **minRange**. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 11 unique ids do **not** require `currentView`.
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

Wave-11 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| `spell-diag-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Later **walk** that pays the diagonal gate | **No** — do not double-observe |
| `spell-dwell-mark` **paint** (AP spent) | **Yes** |
| Later **end-turn detonate** on the cell | **No** |
| `spell-own-plate` **arm** | **Yes** |
| Later **negated hit** on the caster’s turn | **No** |
| `spell-void-reel` no void/portal (fizzle after AP) | **Yes** — AP was spent (Wave 2 fizzle rule) |
| `spell-void-reel` illegal because AI skipped (no AP) | **No** |
| `spell-cinder-skip` **arm** | **Yes** |
| Later 1-tile walk across cinder | **No** |
| `spell-pack-long` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-adj-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orbs / `WF-SPL-*` | **Never** write `ownedSpellIds` |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 11 stamps unused **rooms**, not new enum members and not leftover feat doors.

| Source | Wave-11 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥11 family verbs in §11 **plus** #695 / #646 stamps in §0.2 / §12. #726 stamps live in §0.2b (Wave 12 CORE, not this CORE) |
| `ELITE` | Summon Toll, Still Mend, Watch Lend, Pair Purse, Escort Cut |
| `ACHIEVEMENT` | **None.** Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master` |
| `CHALLENGE` | **None.** All nine challenge ids remain claimed through Wave 7 |
| `BOSS` | **None.** Adj Fold is `BOSS_ONLY` (never owned) |
| `SPECIAL_ENCOUNTER` | `diag_gallery` / `mid_nave` / `void_aisle` / `dwell_pulpit` / `crack_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | None new. #695 Both Mend / Stride Keep / Penta Span / Cadence Trim keep their existing children |
| `ENEMY_ONLY` | Pack Long (never owned) |
| `BOSS_ONLY` | Adj Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-11 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every door listed in Wave 10 §4.1, plus:

| Door | Owner |
| :--- | :--- |
| `inch_gallery` / `rite_nave` / `reach_nave` / `ash_aisle` / `pin_nave` | Wave 10 SDE (#679) |
| `close_precentor` / `mid_fold_regent` | Wave 10 SDE Pack Close / Mid Fold |
| `both_cantor` / `stride_bursar` / `span_penta` / `trim_precentor` / `court_keep_regent` | #695 |
| `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` | #726 |
| `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` | #663 |
| `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` | #638 |
| `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent` | #636 |
| `pair_gallery` / `knight_fold_regent` | #646 |

### 4.2 Leftover doors (not this pass)

`survivor` only. Economy feats stay Doka-only. `unstoppable` stays unused forever as a spell gate. `jackpot` stays #185 Absolve. Do not restamp `leader_slayer` / `spell_master`.

---

## 5. Spell pool evolution — Generation 11 (never a last tier)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 11 adds the **G≥11 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, 3, … no maximum
R = enemy.level − player.level
T = current tierSize (default 10)
```

| G | Pool policy (additive) |
| :--- | :--- |
| 0 | CORE only (+ Strike if empty) |
| 1 | CORE + one ADVANCED (`generationMin ≤ 1`) |
| 2 | ADVANCED guaranteed; one slot may be `generationMin ≤ 2`; RARE eligible |
| 3–10 | Prior extra slots from Waves 3–10. Do not retire them |
| 11 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 11` |
| 12+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-10 G10 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **11** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation — extends Wave 10 §5.1)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
     Wave-11 attached families: #646 unique Wave-9 verbs + #695 tactical Wave-10 ids
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3–10. prior extra slots from Waves 2–10
  11. if G ≥ 11: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
      (skip if no legal id; this is the Generation 11 verb)
  12. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  13. drop any id whose AI_REQUIREMENTS are unmet
  14. keep ENEMY_ONLY on enemies (they cast; they never grant)
  15. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 6. New `aiHint` keys (metadata, not names)

Wave 1 §9.1 through Wave 10 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_diagonal_only` | flanker, kiter | A legal diagonal dest exists this turn or next; skip if only orthogonal dests remain and Strike is better |
| `next_spell_exact_chebyshev_2` | caster, kiter | Caster can reach Chebyshev 2 before the next spell, or already sits at 2; skip if they must stay at 1 (use Strike) |
| `attract_toward_nearest_void` | caster, controller | A void or portal cell exists in Chebyshev ≤ 4 of the target; skip if none, or if the 1-step would land them on a world portal the occupancy layer treats as impassable |
| `bonus_if_adjacent_hostile` | flanker, berserker | A living hostile is Chebyshev 1 from the target; skip if none (use Strike) |
| `detonate_if_end_turn_on_cell` | caster, controller | Paint the cell the player is likely to **end** on (not merely enter); skip if they can walk off for 1 MP |
| `negate_hit_on_own_turn` | guardian, charger | Caster expects to be struck **during their own turn** (overwatch, reflect, hold-ground snap); skip if they will only be hit on the enemy turn (use Off Plate) |
| `skip_cinder_one_tile` | flanker, charger | Next intended walk is length 1 across a cinder/burn cell; skip if the path is lava/spikes (wrong skip) or length ≥ 2 |
| `res_if_leftover_ap_ge_3` | guardian, buffer | Caster leftover AP ≥ 3 at resolve **or** they can finish the turn that way; skip if they still need those 3 AP to Strike |
| `summon_walk_ap_tax` | summoner, guardian | ≥ 1 living allied summon; skip if none |
| `heal_if_caster_spent_zero_walk_mp` | healer | Caster `walkMpSpentThisTurn === 0` and missing HP ≥ 8; skip if they already walked. **Healer CORE only** |
| `own_remaining_cds_do_not_tick` | caster, kiter | Caster has at least one remaining CD ≥ 2; skip if all remaining are 0–1 |
| `tax_next_spell_if_walked_last_turn` | caster, controller | Target `walkMpSpentLastTurn ≥ 1`; skip if they camped (use Still Tax) |
| `remove_adjacent_barrier` | caster, controller | An adjacent barrier cell exists **and** removing it does not seal the only player↔exit path (`findPath` after a hypothetical crack); skip if it would |
| `overwatch_snap_grants_watcher_ap` | kiter, caster | Caster already has or will arm an overwatch this turn; skip if no snap is likely |
| `bonus_if_leftover_ap_eq_2` | caster, kiter | Target leftover AP is exactly 2; skip if 0, 1, or ≥ 3 (use Lone Purse / Dry Sting / Full Plate) |
| `bonus_if_target_has_allied_summon_in_2` | caster, controller | Target has a living allied summon at Chebyshev ≤ 2; skip if the target is the summon (use Summon Bane) or no pet |
| `heal_if_both_leftover_ap_eq_0` | healer | Both caster and heal target have leftover AP **= 0** after this spell’s cost; skip if either leftover AP ≥ 1. **Healer CORE only** |
| `pack_next_spell_min_range_3` | buffer | CHAMPION only; skip if aura up |
| `fold_two_adjacent_player_side` | **boss AI only** | Exactly two living player-side bodies at Chebyshev 1 from each other; skip if 0–1 or they are not adjacent |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: achievement path `WorldExploration.tsx` 2144–2208.
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Dwell Mark / Own Plate / Cinder Skip may add a **battle-log line** when the detonate / negate / skip fires — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 11 adds **no** new canister methods.

| Writer | Wave-11 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | Not used for a new feat/challenge door this wave. #695 MULTI children stay #695’s |

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
- Still Mend / Dry Mend player-side HP gain flips `challengeHealUsedRef` only when HP actually increased.
- Brick Crack that would seal the last path must not write tiles; if forced, fizzle (AP spent, observe).

---

## 9. Special encounters (Wave 11)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `diag_gallery` | Blink Cutter on an open diagonal; orthogonal walks are blocked by existing walls | `spell-diag-stride` via observe+win |
| `mid_nave` | Glass Sniper parked at Chebyshev 2 down a file | `spell-mid-oath` via observe+win |
| `void_aisle` | Void Mirror beside one existing void cell (not a world portal) | `spell-void-reel` via observe+win |
| `dwell_pulpit` | Glyph Sower + a cell the player wants to camp | `spell-dwell-mark` via observe+win |
| `crack_nave` | Stone Castellan + one optional barrier the player can walk around | `spell-brick-crack` via observe+win |

Do not retag `inch_gallery` / `pair_gallery` / `odd_gallery` / `even_gallery` / `ash_aisle` / `pin_nave` / `long_gallery`. `ash_aisle` stays Cinder Reel. `void_aisle` is not a Twin Gate pad and not `map.portals`.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–10 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 + #695 already cover: push, pull-to-caster, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, conditional bounce, next-spell AP tax, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, instant execute, DoT detonate, cross AoE, tile-gravity, ally rescue pull, one next Chebyshev-1 walk, cannot-Strike-until-spell, next-spell range≥3, pull toward nearest hazard, adjacent-ally bonus, cell-enter detonate, off-turn hit negate, spike skip, leftover-AP-0 RES, summons ignore shove, heal-if-target-spelled, freeze one remaining CD, tax if they camped, grow barrier, overwatch walker AP fee, leftover-AP-exactly-1 poke, bonus vs leader, pack range clamp 1, axis fold, heal-if-both-walked, leftover-MP bank, five-cell occupy, remaining-CD −1, near-range miss, steal MP iff walked, tile forbids tools, force-landing sting, all walks Chebyshev 1, ally-to-caster step, leftover-MP≥2 poke, pair translate, recast tax, cannot-tool-until-Strike, +MP to an already-walked ally.

**Still open (Wave 11 SDE unique ids).**

| Hole | Wave-11 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk must be diagonal | `spell-diag-stride` | Inch Stride is Chebyshev ≤ 1 (orthogonal legal). Must Step / Must Span bind **all** remaining walks. Pair Stride is exact Manhattan 2. Diag Lock forbids diagonal dests — this **requires** them |
| Next spell illegal unless Chebyshev = 2 | `spell-mid-oath` | Long Oath is ≥ 3. Near Oath is the short-range identity. Ground / Unit oaths are different gates |
| Pull 1 toward nearest void/portal | `spell-void-reel` | Cinder Reel is nearest **hazard of any type**. Hook is to caster. This dest is void/portal only; fizzle if none |
| Bonus if adjacent **hostile** | `spell-foe-bite` | Side Bite is adjacent **ally**. Lone Sting is 0 Chebyshev-1 hostiles. Flank Share is a different writer |
| Cell detonates if they **end turn** on it | `spell-dwell-mark` | Ingress Mark is **enter**. Stride Mark / Exit Sting are **leave**. Gait Wick follows the unit |
| Next hit on **your turn** is 0 | `spell-own-plate` | Off Plate is **off-turn**. Near Hood / Far Hood are range gates. Morrow Plate is a different window |
| 1-tile walk ignores **cinder/burn** | `spell-cinder-skip` | Spike Skip is spikes. Lava Skip is lava. Pit Skip is pits. Wrong hazard still damages |
| Leftover AP ≥ 3 → +RES | `spell-full-plate` | Tapped Plate is leftover AP **= 0**. Still Plate is leftover **MP** = 0. Empty Plate is a different empty |
| Allied summons pay +1 AP to start a walk | `spell-summon-toll` | Kennel Lock stops stray walks. Walk Toll taxes the **caster’s** walk pool. Short / Still Leash are radius locks |
| Heal iff caster spent **0** walk MP | `spell-still-mend` | Both Mend needs **both walked**. Gait Mend / Bar Mend / Clash Mend / Shove Mend are different predicates |
| Own remaining CDs do not tick | `spell-cadence-rest` | Cadence Pin freezes **one hostile** remaining. Stall is +1 all. Shave / Trim rewrite remaining. Stretch is ×2 |
| Next spell +1 AP if they **walked** last turn | `spell-spent-tax` | Still Tax taxes if they **camped**. Quiet Hex taxes the next spell unconditionally. Gait Tax / Camp Tax are other writers |
| Remove one adjacent barrier | `spell-brick-crack` | Brick Sprout **grows** a cell. Brick Shift / Wipe move or erase paint. Barrier **places** a wall |
| Overwatch snap grants **watcher** +1 AP | `spell-watch-lend` | Watch Fee taxes the **walker**. Watch Mute zeros the snap. Boot Lend is +MP to an unmoved ally |
| Bonus if leftover AP **exactly 2** | `spell-pair-purse` | Lone Purse is exactly **1**. Dry Sting is leftover AP = 0. Full Purse is a different full |
| Bonus if target has a living allied summon in 2 | `spell-escort-cut` | Summon Bane bonuses the **summon**. Banner Cut reads `isLeader`. Pet Cut is a different pet |
| Heal iff **both leftover AP = 0** | `spell-dry-mend` | Both Mend is both **walked**. Heave Mend (#726) is both **force-moved**. Still Mend is caster walk-MP = 0. Dry Sting is leftover-AP=0 **damage** |
| Pack next-spell minRange 3 | `spell-pack-long` | Pack Close clamps range **to 1**. Paper Wind cuts their range. Long Oath is a self gate. Never owned |
| Swap two **adjacent** player-side bodies | `spell-adj-fold` | Mid Fold is shared rank/file any distance. Sovereign Fold is any two. Pawn Trade is hostiles-to-caster. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 11)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–10, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #646, #679, **#695**, or **#726**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Do not add a fourth walk-MP snipe.

### 11.1 New `effectParams` keys (Wave 11 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #679 / #695 key names for a different meaning.

```text
diagStrideNextWalk,          // true → next walk legal only if |dx|==|dy| ≥ 1
midOathExactChebyshev,       // 2
voidReelDistance,            // 1 toward nearest void/portal
foeBiteAdjacentBonus,        // 8
dwellMarkDuration, dwellMarkDamage,
ownPlateDuration,            // next hit on caster's turn → 0
cinderSkipWalkLength,        // 1
fullPlateLeftoverApMin, fullPlateRes, fullPlateDuration,
summonWalkApTax,
stillMendHeal,               // 8 if caster walkMpSpentThisTurn == 0
cadenceRestOwnRemaining,     // own remaining CDs do not tick this turn
spentTaxIfWalkedLastTurn,
brickCrackAdjacent,          // remove one adjacent barrier
watchLendAp,                 // +1 AP to watcher on snap
pairPurseLeftoverAp, pairPurseBonus,
escortCutRadius, escortCutBonus,
dryMendHeal,                 // 8 if both leftover AP == 0
packMinRange,                // 3
adjFoldTwoPlayerSide         // swap two Chebyshev-1 player-side bodies
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration`. Do not reuse `forcedMovedThisTurn` as a new key — read the Wave-9 flag.

---

### SPELL_ID: `spell-diag-stride`

NAME: Diag Stride  
ROLE: CONTROL — next walk must be diagonal  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `rust_reaver`; `G ≥ 11` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rust_reaver`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥11. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Target’s **next walk of ≥ 1 tile** this battle (or 2 turns, whichever first) is legal **only** if `|dx| == |dy|` and Chebyshev ≥ 1 (`effectParams: {"diagStrideNextWalk":true}`). Orthogonal dests fail confirm; MP is not spent. Teleport / Swap / Phase Slip / Twin-gate step do **not** pay the gate. Distinct from Inch Stride (one next walk Chebyshev ≤ 1, orthogonal legal), Must Step (all remaining walks Chebyshev 1), Pair Stride (one next exact Manhattan 2), Diag Lock (forbids diagonal dests).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_diagonal_only"`. Flanker / kiter. Skip if the only remaining dests are orthogonal and Strike is better. **Do not** assign to chargers who only walk files.  
PLAYER_COUNTERPLAY: Walk orthogonally before the arm; blink off; Strike in place  
SYNERGIES: Brick Crack (open a diagonal); Mid Oath (they wanted Chebyshev 2 on a file)  
BALANCE_RISK: Diagonal-only + Root is a brick. 2 AP, CD 2, one walk only. Fail closed.  
PERSISTENCE_REQUIREMENTS: Standard observe → same-encounter win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-mid-oath`

NAME: Mid Oath  
ROLE: CONTROL — next spell only at Chebyshev 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `pale_cantor`; `G ≥ 11`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Target’s next **spell** (`damage > 0` or non-Strike tool) this battle (or 2 turns) is illegal unless the target tile is Chebyshev **exactly 2** from the caster (`effectParams: {"midOathExactChebyshev":2}`). Strike / `physical_attack` stays legal at any range. Distinct from Long Oath (illegal unless range ≥ 3), Near Oath (short-range identity), Ground / Unit oaths.  
SCALING: band fixed  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_2"`. Caster / kiter. Skip if they must stay at 1 and Strike is better.  
PLAYER_COUNTERPLAY: Step to 1 or 3 before the nuke; Strike through it; Dispel  
SYNERGIES: Diag Stride (file 2 may be illegal to walk); Quiet Hex on the mid-range spell  
BALANCE_RISK: Exact-2 + Far Sting / Glass Shot deletes other bands. Strike exempt + 2 AP + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-void-reel`

NAME: Void Reel  
ROLE: POSITION — pull 1 toward nearest void/portal  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `void_mirror` or `rift_hook`; `G ≥ 11`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `void_mirror`, `rift_hook`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Pull the target 1 tile toward the nearest **void or portal** cell in Chebyshev ≤ 4 of the target (`effectParams: {"voidReelDistance":1}`). If none exists, fizzle (AP spent, no move). Occupancy / barrier / world-portal dest: fizzle that step. Distinct from Cinder Reel (nearest hazard of any type), Hook Line (to caster), Paint Reel / Foe Reel (other dests). Twin Gate pads are **not** this dest. World portals stay impassable.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_void"`. Caster / controller. Skip if no void/portal in 4, or if the 1-step dest is a world portal the occupancy layer treats as impassable.  
PLAYER_COUNTERPLAY: Stand with no void in 4; occupy the toward-tile; Self Anchor  
SYNERGIES: Dwell Mark on the toward-cell; Brick Crack to open the pull lane  
BALANCE_RISK: Pull onto void is a delete. AI value-check; dest must be a legal floor step **toward** the void, not into it, unless the dest is already a legal hazard the existing tick handles. **Explicit:** the 1-step is toward, not onto, unless that toward-cell is already a floor hazard.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-foe-bite`

NAME: Foe Bite  
ROLE: DAMAGE — bonus if adjacent hostile  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `rust_reaver` or `blink_cutter`; `G ≥ 11`; `aiProfile` flanker/berserker  
ENEMY_FAMILIES: `rust_reaver`, `blink_cutter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥11. `generationMin: 11`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Physical. Deal 10. If a living **hostile-to-the-target** (not the caster, not an ally of the caster) stands at Chebyshev 1 from the target, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"foeBiteAdjacentBonus":8}`). Distinct from Side Bite (adjacent **ally** of the caster), Lone Sting (0 Chebyshev-1 hostiles), Nook Bite (exactly one block). Player copy bonuses when two enemies sit together — or when the player stands next to their own summon and bites an enemy (the summon is hostile-to-the-enemy).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_adjacent_hostile"`. Flanker / berserker. Skip if no adjacent hostile-to-target and Strike is equal.  
PLAYER_COUNTERPLAY: Peel so the target is isolated; kill the escort first  
SYNERGIES: Pair Pace / Ally Step to park a body; Escort Cut on the handler  
BALANCE_RISK: 18 adjacent is Frost-adjacent on 2 AP CD 1. Isolation gate. Do not also apply Side Bite on the same hit (different keys; AI should not stack both on G=0).  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dwell-mark`

NAME: Dwell Mark  
ROLE: TERRAIN — end-turn occupy detonate  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `bone_scribe`; `G ≥ 11`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor tile 2 turns. If a hostile **ends their turn** on that cell, deal 10 (spell, RES+SR) and consume (`effectParams: {"dwellMarkDuration":2,"dwellMarkDamage":10}`). Entering and leaving in the same turn does **not** detonate. Teleport / Swap onto the cell **does** count as ending there if they stay. Distinct from Ingress Mark (enter), Stride Mark / Exit Sting (leave), Gait Wick (unit-follow walk-MP), Shove Sting (force-landing). Last writer on `"x,y"` vs Cinder / void-glyph / rime / ingress. Observation is the **paint**.  
SCALING: damage follows dmg%; duration fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_end_turn_on_cell"`. Caster / controller. Paint the cell they want to camp. Skip if they can walk off for 1 MP and still threaten.  
PLAYER_COUNTERPLAY: Walk off before turn end; blink on and off; send a summon to camp it  
SYNERGIES: Diag Stride / Root so they cannot leave; Spent Tax if they walk off  
BALANCE_RISK: End-turn 10 + Root is a prison. Consume-on-first-body, CD 2, G≥11.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-own-plate`

NAME: Own Plate  
ROLE: DEFENSE — next hit on your turn is 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `plate_warden` or `iron_golem`; `G ≥ 11`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥11. `generationMin: 11`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 2 turns or until consumed. The next **hit** the caster receives **during their own turn** (overwatch snap, reflect, hold-ground, thorn, a spell they forced onto themselves) deals 0 and consumes (`effectParams: {"ownPlateDuration":2}`). Hits received on **other** turns are full and do **not** consume. Distinct from Off Plate (off-turn negate), Near Hood / Far Hood (range gates), Tick Plate (DoT tick), Morrow Plate. Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_on_own_turn"`. Guardian / charger. Skip if they will only be hit on the enemy turn (use Off Plate).  
PLAYER_COUNTERPLAY: Hit them on **your** turn; Dispel; wait out 2 turns  
SYNERGIES: Hold Ground / Far Watch (they walk in on the caster’s leftover); Watch Lend after a snapped overwatch  
BALANCE_RISK: Negating Hold Ground + Far Watch in one arm is a turtle. Own-turn only + consume + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cinder-skip`

NAME: Cinder Skip  
ROLE: POSITION — 1-tile walk ignores cinder  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `ember_knight` or `cinder_martyr`; `G ≥ 11`; `aiProfile` flanker/charger  
ENEMY_FAMILIES: `ember_knight`, `cinder_martyr`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: The caster’s **next walk of length 1** this battle (or 2 turns) ignores **cinder / burn / ember-wake** hazard ticks on the dest cell (`effectParams: {"cinderSkipWalkLength":1}`). Lava, spikes, pits, mire, and void still damage / block. Walks of length ≥ 2 do **not** skip. Teleport / Swap do not consume. Distinct from Spike Skip, Lava Skip, Pit Skip, Gap Ward (overwatch skip). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_cinder_one_tile"`. Flanker / charger. Skip if the next walk is not a 1-step across cinder.  
PLAYER_COUNTERPLAY: Paint lava instead; force a 2-step; Root  
SYNERGIES: Ember Wake / Cinder Tile they painted; Diag Stride across a burned diagonal  
BALANCE_RISK: Ignoring every hazard would delete lava. **Cinder only**, length 1, consume.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The skipped tick is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-full-plate`

NAME: Full Plate  
ROLE: DEFENSE — leftover AP ≥ 3 → +RES  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `plate_warden` or `iron_golem`; `G ≥ 11`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥11. `generationMin: 11`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If the caster’s leftover AP at resolve is **≥ 3**, gain `buffStat: "res"` 1.15 for 2 turns (`effectParams: {"fullPlateLeftoverApMin":3,"fullPlateRes":1.15,"fullPlateDuration":2}`). If leftover AP ≤ 2, fizzle (AP spent). The 2 AP this spell costs is paid **before** the leftover check. Distinct from Tapped Plate (leftover AP = 0), Still Plate (leftover MP = 0), Planted Stance (0 walk MP this turn), Empty Plate.  
SCALING: modifier fixed  
AI_REQUIREMENTS: `aiHint: "res_if_leftover_ap_ge_3"`. Guardian. Skip if they still need those 3 AP to Strike or if Iron Skin is already up (last RES% writer wins).  
PLAYER_COUNTERPLAY: Drain Courage / Quiet Hex so leftover drops below 3; Dispel  
SYNERGIES: Loan Tempo / Second Wind to keep leftover high; Own Plate the same turn  
BALANCE_RISK: 1.15 + Iron Skin last-writer. Gate is leftover ≥ 3 after a 2-AP pay, CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-toll`

NAME: Summon Toll  
ROLE: SUMMONS — allied pets pay AP to walk  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 11`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 11`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon (same side as caster) that **starts a walk** also pays +1 AP (`effectParams: {"summonWalkApTax":1}`). Teleport / Swap / forced move do **not** pay. Distinct from Kennel Lock (cannot stray past radius 2), Walk Toll (taxes the caster’s walk pool), Still / Short Leash (radius), Summon Brace (ignore shove). Player copy taxes **their** pets — a real downside when kiting.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_walk_ap_tax"`. Summoner / guardian. Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
PLAYER_COUNTERPLAY: Force-move the pets; Sever Tether; sit them still and Strike  
SYNERGIES: Kennel Lock (they wanted to stay); Spent Tax on the handler  
BALANCE_RISK: Two pets paying 1 AP each is a tempo brick. Radius-allied + CD 3 + elite.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-still-mend`

NAME: Still Mend  
ROLE: HEAL — heal if caster spent 0 walk MP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 11`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 11`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: If the caster’s `walkMpSpentThisTurn === 0` at resolve, heal the target 8 (`effectParams: {"stillMendHeal":8}`). Target may be self. If the caster already walked, fizzle (AP spent, no heal). Distinct from Both Mend (caster **and** target walked), Dry Mend (both leftover AP = 0), Heave Mend (#726, both force-moved), Gait Mend, Bar Mend (target resolved a spell), Clash Mend, Shove Mend. `healAmount > 0` — **healer CORE only**. Player-side HP gain flips `healUsed` only when HP actually increased.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_caster_spent_zero_walk_mp"`. Healer. Skip if they already walked or missing HP < 8. Never walk **only** to fail this.  
PLAYER_COUNTERPLAY: Pull the cantor so they want to walk; Cursed Wound; interrupt before resolve  
SYNERGIES: Planted Stance / Full Plate on a camped cantor; Own Plate the same turn  
BALANCE_RISK: Free 8 every other turn on a camped healer. Elite + walk-0 gate + CD 2. Non-healer CORE must not include this id.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-rest`

NAME: Cadence Rest  
ROLE: SUPPORT — own remaining CDs do not tick  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `cadence_thief` or `hex_chorister`; `G ≥ 11`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: This turn only. The caster’s **remaining** cooldown counters do **not** decrement at turn end (`effectParams: {"cadenceRestOwnRemaining":true}`). New locks written this turn still apply. Does not rewrite remaining (not −1 / +1 / ×2). Distinct from Cadence Pin (one **hostile** remaining frozen), Stall (+1 all), Shave / Trim (rewrite remaining), Stretch (×2), Cadence Flush.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "own_remaining_cds_do_not_tick"`. Caster / kiter. Skip if all remaining are 0–1 (nothing to protect) or if they needed those tools this turn.  
PLAYER_COUNTERPLAY: Cadence Trim / Pin the same locks; wait the extra turn  
SYNERGIES: Inferno remaining 3; Verse Tax on the delayed recast  
BALANCE_RISK: Parking Inferno / Twin Gate an extra turn is a stall. Self only + CD 3 + 2 AP.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spent-tax`

NAME: Spent Tax  
ROLE: CONTROL — next spell costs AP if they walked  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `tax_scribe` or `ley_tollkeeper`; `G ≥ 11`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target’s `walkMpSpentLastTurn ≥ 1`, their **next spell** this battle (or 2 turns) also costs +1 AP (`effectParams: {"spentTaxIfWalkedLastTurn":true}`). If they camped last turn, fizzle (AP spent). Strike still pays if it is the next “spell” for Quiet Hex — **explicit:** Spent Tax applies to the next non-Strike tool only (Strike exempt), opposite of Quiet Hex. Distinct from Still Tax (taxes if they **camped**), Gait Tax / Camp Tax / Act Tax, Debt Mark (next **walk** +1 AP).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_spell_if_walked_last_turn"`. Caster / controller. Skip if they camped last turn (use Still Tax) or if they are already Quiet Hexed and the AI would triple-tax.  
PLAYER_COUNTERPLAY: Camp a turn; Strike; pay the 1 AP  
SYNERGIES: Diag Stride (they had to walk); Dwell Mark (walking off still taxes the next tool)  
BALANCE_RISK: Spent Tax + Quiet Hex + Drain Courage is three taxes. Different keys, all allowed, but AI should not stack all three on G=0. G≥11 gate. Strike exempt.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-crack`

NAME: Brick Crack  
ROLE: TERRAIN — remove one adjacent barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `stone_castellan` or `rime_mason`; `G ≥ 11`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 3  
RANGE: 1  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 3  
EFFECT: `freeCells: true`. Remove **one** adjacent barrier cell (`effectParams: {"brickCrackAdjacent":true}`). Walls that are not barrier-paint are illegal (fizzle). If removing the cell would seal the only player↔exit / player↔enemy path (`findPath` after a hypothetical crack), AI skips; if forced, fizzle (AP spent, no tile write). Distinct from Brick Sprout (grows a cell), Brick Shift / Wipe (move or erase paint), Barrier (places a wall). Do not edit `mapGen.ts`. After a legal crack, callers still run `finalizePlayableLayout` on generate — this is a **battle** tile write, not a generate pass.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "remove_adjacent_barrier"`. Caster / controller. Skip if no adjacent barrier, or if the crack would seal the last path.  
PLAYER_COUNTERPLAY: Do not stand so a crack opens a file onto you; re-Barrier  
SYNERGIES: File Lance / Mid Oath through the hole; Void Reel along the new lane  
BALANCE_RISK: Deleting Barrier as a tool. **One** adjacent cell, solvability skip, CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Sealing fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-lend`

NAME: Watch Lend  
ROLE: DEFENSE — overwatch snap grants watcher AP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 11`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns or until consumed. The next time an overwatch the caster owns **snaps** (Hold Ground, Far Watch, or a later watch id), the caster gains +1 AP at snap resolve (`effectParams: {"watchLendAp":1,"overwatchDuration":2}`). The snap’s damage / stop still uses its own writer. Distinct from Watch Fee (walker pays 1 AP), Watch Mute (snap deals 0), Boot Lend (+MP to an unmoved ally), Leftover Lend. Observation is the **arm**. The snap does not second-observe.  
SCALING: amount fixed  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_grants_watcher_ap"`. Kiter / caster. Skip if no overwatch is armed or likely this turn.  
PLAYER_COUNTERPLAY: Do not walk into the band; blink in; send a summon  
SYNERGIES: Far Watch / Hold Ground; Own Plate if the snap would also hit the caster  
BALANCE_RISK: Free AP after a 10-damage snap is a second action. Elite + consume + CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pair-purse`

NAME: Pair Purse  
ROLE: DAMAGE — bonus if leftover AP is exactly 2  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `purse_scribe` or `bone_scribe`; variant ≥ ELITE or `G ≥ 11`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s leftover AP at resolve is **exactly 2**, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"pairPurseLeftoverAp":2,"pairPurseBonus":8}`). Leftover 0, 1, or ≥ 3: 10 only. Distinct from Lone Purse (exactly 1), Dry Sting (leftover AP = 0), Full Purse, Empty Purse.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_2"`. Caster / kiter. Skip if leftover is not 2 and Strike is better.  
PLAYER_COUNTERPLAY: Spend to 1 or 0; bank with Purse Keep; sit at 3  
SYNERGIES: Drain Courage to land them on 2; Quiet Hex after they wanted a 3-AP tool  
BALANCE_RISK: 18 on a 2-AP CD 1 is Frost-adjacent. Exact-2 gate + elite.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-escort-cut`

NAME: Escort Cut  
ROLE: DAMAGE — bonus if the target has a pet nearby  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `null_censor` or `leash_warden`; variant ≥ ELITE or `G ≥ 11`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `null_censor`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 11`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target has a living **allied summon** (same side as the target) at Chebyshev ≤ 2, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"escortCutRadius":2,"escortCutBonus":8}`). If the target **is** the summon, the bonus does **not** apply (use Summon Bane). Reads `isSummon` on neighbors, never `spell.name` or `"wolf"`. Distinct from Banner Cut (`isLeader`), Pet Cut, Crown Cut, Summon Bane (bonus on the pet).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_has_allied_summon_in_2"`. Caster / controller. Skip if no pet in 2 and Strike is better. Prefer the handler, not the pet.  
PLAYER_COUNTERPLAY: Park pets at 3+; Sever Tether; fight without a summon  
SYNERGIES: Pawn Trade to put a pet in 2; Kennel Lock keeps the pet in range — a real downside  
BALANCE_RISK: 18 vs a summoner is Frost-adjacent. Elite + flag check + radius 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dry-mend`

NAME: Dry Mend  
ROLE: HEAL — heal if both leftover AP = 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pale_cantor` or `coil_arbiter`; `G ≥ 11`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `coil_arbiter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: If **both** caster and target have leftover AP **= 0** at resolve (after this spell’s 3 AP is paid), heal the target 8 (`effectParams: {"dryMendHeal":8}`). Target may be self (self counts as both if the caster’s leftover AP is 0). Walk / force-move flags do **not** substitute. If either leftover AP ≥ 1, fizzle (AP spent, no heal). Distinct from Both Mend (both **walked**), Heave Mend (#726, both **force-moved**), Still Mend (caster walk-MP = 0), Shove Mend, Dry Sting (leftover-AP=0 **damage**). #726 held this hole. `healAmount > 0` — **healer CORE only**. Player-side HP gain flips `healUsed` only when HP actually increased.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_both_leftover_ap_eq_0"`. Healer. Skip if either leftover AP ≥ 1. Do not dump leftover AP **only** to enable this if a Strike would kill.  
PLAYER_COUNTERPLAY: Keep 1 leftover AP; Cursed Wound; kill the cantor first  
SYNERGIES: Drain Courage / Quiet Hex to land both on 0; Full Plate is leftover ≥ 3 (opposite gate)  
BALANCE_RISK: 8 after a double empty-purse is a reset. Two leftover-0 flags + CD 2 + healer CORE only.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-long`

NAME: Pack Long  
ROLE: SUPPORT — allied next-spell minRange 3  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `long_precentor`; variant CHAMPION; `G ≥ 11`  
ENEMY_FAMILIES: `long_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 11`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 have their next **spell** `minRange` raised to 3 (`effectParams: {"packMinRange":3,"auraRadius":2,"auraDuration":2}`). Strike stays legal at 1. Distinct from Pack Close (clamps range **to 1**), Paper Wind (cuts **their** range), Long Oath (self gate), Pack Tempo / Howl / Tithe / Stride. Does not grant the caster extra AP the turn it is cast.  
SCALING: minRange fixed  
AI_REQUIREMENTS: `aiHint: "pack_next_spell_min_range_3"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2. **Do not** put Pack Close and Pack Long on the same BASE kit.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies out of 2; walk to 1 and Strike  
SYNERGIES: Mid Oath (exact 2 vs min 3 is a brick — **do not** stack both on a BASE kit; CHAMPION may have Long **or** Mid Oath, not both in CORE)  
BALANCE_RISK: minRange 3 on two bodies deletes melee tools. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe (and would not grant anyway).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-adj-fold`

NAME: Adj Fold  
ROLE: POSITION — swap two adjacent player-side bodies  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `adj_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `adj_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **only if** they stand at Chebyshev 1 from each other. If fewer than two, or they are not adjacent, fizzle. Then deal 6 (spell) to each (`effectParams: {"adjFoldTwoPlayerSide":true}`). Distinct from Mid Fold (shared rank/file, any distance on the axis), Sovereign Fold (any two), Pawn Trade (two hostiles-to-caster), Pair Slide / Pair Hinge. Never owned. Player already has Swap and Pawn Trade as learnables.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_adjacent_player_side"`. **Boss AI only.** Skip if 0–1 player-side bodies or they are not adjacent.  
PLAYER_COUNTERPLAY: Fight without a summon; stand at 2+; False Retreat decoy as the second body  
SYNERGIES: Adj Fold identity; Claim Ward (anti-swap **cell** does not block this — fold is unit swap, not cell claim; **explicit** so implementers do not merge the keys)  
BALANCE_RISK: Forced adjacent player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 11 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…10 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥11 | `spell-diag-stride`, `spell-foe-bite` |
| `rust_reaver` | RARE / G≥11 | `spell-diag-stride`, `spell-foe-bite` |
| `glass_sniper` | RARE / G≥11 | `spell-mid-oath` |
| `glass_sniper` | ELITE | `spell-watch-lend` |
| `pale_cantor` | RARE / G≥11 | `spell-mid-oath`, `spell-dry-mend` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-still-mend` (healer CORE only) |
| `void_mirror` | RARE / G≥11 | `spell-void-reel` |
| `rift_hook` | RARE / G≥11 | `spell-void-reel` |
| `glyph_sower` | RARE / G≥11 | `spell-dwell-mark` |
| `bone_scribe` | RARE / G≥11 | `spell-dwell-mark` |
| `bone_scribe` / `purse_scribe` | ELITE | `spell-pair-purse` |
| `plate_warden` | ADVANCED / G≥11 | `spell-own-plate`, `spell-full-plate` |
| `iron_golem` | ADVANCED / G≥11 | `spell-own-plate`, `spell-full-plate` |
| `ember_knight` | RARE / G≥11 | `spell-cinder-skip` |
| `cinder_martyr` | RARE / G≥11 | `spell-cinder-skip` |
| `brood_chanter` | ELITE | `spell-summon-toll` |
| `cadence_thief` | RARE / G≥11 | `spell-cadence-rest` |
| `hex_chorister` | RARE / G≥11 | `spell-cadence-rest` |
| `tax_scribe` / `ley_tollkeeper` | RARE / G≥11 | `spell-spent-tax` |
| `stone_castellan` / `rime_mason` | RARE / G≥11 | `spell-brick-crack` |
| `hood_lurker` | ELITE | `spell-watch-lend` |
| `null_censor` / `leash_warden` | ELITE | `spell-escort-cut` |
| `coil_arbiter` | RARE / G≥11 | `spell-dry-mend` |
| `long_precentor` CHAMPION | SIGNATURE | `spell-pack-long` (`ENEMY_ONLY`; not with Pack Close on the same BASE kit) |
| `adj_fold_regent` | BOSS_ONLY | `spell-adj-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-11 family CORE consumes #646 and #695

The Wave-11 enemy/elite family sheet (not this PR) puts **#646** unique Wave-9 verbs and **#695** tactical Wave-10 ids in **CORE** for new families. Unique §11 ids may appear there only as G≥11 extras in a later family pass (Wave 12), not as this document’s CORE.

Stamp, do not clone #646: Pair Stride, Boot Hold, Near Oath, Paint Reel, Nook Bite, Stride Mark, Foe Plate, Lava Skip, Still Plate, Body Sill, Clash Mend, Cadence Shave, Gait Tax, Brick Wipe, Watch Mute, Full Purse, Pet Cut. Pack Stride stays `ENEMY_ONLY`. Knight Fold stays `BOSS_ONLY`.

Stamp, do not clone #695: Both Mend, Stride Keep, Penta Span (implementation-blocked while summon cap is 2), Cadence Trim, Near Hood, Gait Sip, Cast Sill, Shove Sting, Must Step, Ally Step, Damp Sting, Pair Pace, Verse Tax, Tool Hold, Spent Lend. Court Keep stays `NOT_PLAYER_LEARNABLE`.

### 12.2 Wave-10 unique CORE (deferred)

#679 unique Wave-10 verbs (`spell-inch-stride` … `spell-mid-fold`) stay G≥10 extras until Wave 12 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Close stays `ENEMY_ONLY`. Mid Fold stays `BOSS_ONLY` on `mid_fold_regent`.

### 12.3 Wave-11 tactical CORE (deferred — #726)

#726 tactical Wave-11 ids (`spell-heave-mend` … `spell-court-dual`) stay extras until Wave 12 families consume them as CORE. Do **not** put them in Wave-11 family CORE. Extra doors `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` stay #726’s. Court Dual stays `NOT_PLAYER_LEARNABLE`.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 12 forever

Same recipe as Wave 10 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 12 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #695 extra doors. Do not restamp #726 extra doors.

Suggested Wave-12 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for Wave-10 unique verbs **and** for unique Wave-11 §11 verbs (this catalog’s unique ids stay extras until then); consume **#726** as Wave-12 family CORE. Bank leftover AP **and** MP is **#726 Dual Keep**. Four-cell occupy is **#636 Quad Span**. Five-cell occupy is **#695 Penta Span**. Seven-cell occupy is **#726 Sept Span**. Both-force heal is **#726 Heave Mend**. Both leftover-AP=0 heal is this wave’s Dry Mend. Adj Fold stays `BOSS_ONLY` on `adj_fold_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / **#695** / **#726** / **#686** / **#663** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W11-A. G≥11 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W11-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W11-C. Wave-11 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #646 / #679 / #695 / **#726** / memory Wave-5 ids |
| W11-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `inch_gallery` / `ash_aisle` / `pair_gallery` as Diag Stride |
| W11-E. Void Reel attract caller | `applyAttract` toward nearest void/portal | Damage-math rewrite; RAF; treating dest as `map.portals` |
| W11-F. Brick Crack solvability skip | `findPath` after a hypothetical crack | `mapGen.ts`; skipping `finalizePlayableLayout` on generate |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Diag Stride consume, Dwell Mark detonate, Own Plate consume, Cinder Skip consume, and Watch Lend consume read flags at walk / end-turn / incoming-hit / overwatch-snap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 10 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W11-1 | Encounter start | Possessed-but-unused G11 id does not observe |
| W11-2 | Diag Stride orthogonal dest | Confirm fails; MP not spent; Diag Stride already observed |
| W11-3 | `diag_gallery` defeat | Does not grant. Victory grants once |
| W11-4 | `inch_gallery` / `pair_gallery` / `odd_gallery` / `must-step` | Do not grant Diag Stride |
| W11-5 | Mid Oath then Frost at Chebyshev 1 or 3 | Confirm fails; Strike still legal |
| W11-6 | Void Reel no void/portal | Fizzle observes; no pull. Dest is not `map.portals` |
| W11-7 | Foe Bite isolated target | 10 only. Side Bite would need an adjacent **ally** |
| W11-8 | Dwell Mark enter-and-leave | No detonate. Ingress Mark would detonate on enter. Stride Mark would detonate on leave |
| W11-9 | Own Plate hit on **their** turn | Full hit; charge remains. Hit on **your** turn consumes |
| W11-10 | Cinder Skip across lava / spikes / length 2 | Hazard still ticks. Skip is cinder + length 1 only |
| W11-11 | Full Plate leftover AP 2 | Fizzle observes; no RES. Tapped Plate would want 0 |
| W11-12 | Summon Toll vs Kennel Lock vs Walk Toll | Pets pay AP to start a walk vs cannot stray vs caster walk pool |
| W11-13 | Still Mend after they walked | Fizzle observes; no heal. Both Mend would want both walked |
| W11-14 | Cadence Rest vs Pin vs Trim vs Stall | Own remaining skip tick vs one hostile frozen vs hostile −1 vs +1 all |
| W11-15 | Spent Tax after they camped | Fizzle observes. Still Tax would tax the camp |
| W11-16 | Brick Crack would seal the only path | AI skip; if forced, fizzle observes; no tile write |
| W11-17 | Watch Lend vs Watch Fee vs Watch Mute | Snap grants watcher +1 AP vs walker −1 AP vs snap deals 0 |
| W11-18 | Pair Purse leftover 0, 1, or 3 | 10 only. Lone Purse would bonus on 1 |
| W11-19 | Escort Cut on the summon itself | 10 only. Summon Bane would bonus the pet |
| W11-20 | Dry Mend after leftover AP ≥ 1 on either | Fizzle observes. Both Mend would want both walked. Heave Mend (#726) would want both force-moved |
| W11-21 | Pack Long / Adj Fold | Never in `ownedSpellIds` |
| W11-22 | Loaner / `WF-SPL-*` | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W11-23 | G=10 Tide | No Diag Stride / Spent Tax (`generationMin: 11`) |
| W11-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W11-25 | No cloned ids | Unique §11 ids absent from #646 / #679 / #695 / **#726** catalogs |
| W11-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Spent Tax / Summon Toll / Pack Long are flags |
| W11-27 | Hex Toll | Still not in any SDE pool |
| W11-28 | Memory Wave-5 / Wave-10 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W11-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W11-30 | #695 extra doors | `both_cantor` / `stride_bursar` / `span_penta` / `trim_precentor` / `court_keep_regent` not restamped |
| W11-30b | #726 extra doors | `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` not restamped |
| W11-31 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–10, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, **#679**, **#695**, or **#726** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / **#663** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / **#679** / **#695** / **#726** extra doors
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `inch_gallery` / `pair_gallery` / `odd_gallery` / `even_gallery` / `ash_aisle` / `long_gallery` as Diag Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #686 CORE, #625 CORE, or Wave-10 #636 CORE
- Cloning #646 (`spell-pair-stride` … `spell-knight-fold`), #679 (`spell-inch-stride` … `spell-mid-fold`), #695 (`spell-both-mend` … `spell-court-keep`), or #726 (`spell-heave-mend` … `spell-court-dual`) into unique §11
- Minting `spell-both-heave` / `spell-hept-span` / `spell-vault-keep`

---

## 17. Wave-11 index

**Unique SDE ids (19):** diag-stride, mid-oath, void-reel, foe-bite, dwell-mark, own-plate, cinder-skip, full-plate, summon-toll, still-mend, cadence-rest, spent-tax, brick-crack, watch-lend, pair-purse, escort-cut, dry-mend, pack-long, adj-fold.

**#695 stamps (do not clone; Wave-11 family CORE):** Both Mend, Stride Keep, Penta Span, Cadence Trim, Near Hood, Gait Sip, Cast Sill, Shove Sting, Must Step, Ally Step, Damp Sting, Pair Pace, Verse Tax, Tool Hold, Spent Lend, Court Keep.

**#646 stamps (do not clone; Wave-11 family CORE):** Pair Stride, Boot Hold, Near Oath, Paint Reel, Nook Bite, Stride Mark, Foe Plate, Lava Skip, Still Plate, Body Sill, Clash Mend, Cadence Shave, Gait Tax, Brick Wipe, Watch Mute, Full Purse, Pet Cut, Pack Stride, Knight Fold.

**#726 stamps (do not clone; Wave 12 family CORE):** Heave Mend, Dual Keep, Sept Span, Cadence Halve, Mid Hood, Ready Sting, Heave Step, Drift Sill, Drift Hold, Drift Lend, Drift Sip, Drift Post, Heave Bounce, Must Drift, Verse Pace, Court Dual.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-diag-stride` | ENEMY_DISCOVERY | yes | blink / reaver G≥11 | **One** next walk must be diagonal |
| `spell-mid-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 2 |
| `spell-void-reel` | ENEMY_DISCOVERY | yes | void / rift | Pull 1 toward nearest void/portal |
| `spell-foe-bite` | ENEMY_DISCOVERY | yes | reaver / blink | Bonus if adjacent **hostile** |
| `spell-dwell-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates if they **end turn** on it |
| `spell-own-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit on **your turn** is 0 |
| `spell-cinder-skip` | ENEMY_DISCOVERY | yes | ember / martyr | 1-tile walk ignores cinder/burn |
| `spell-full-plate` | ENEMY_DISCOVERY | yes | plate / golem | Leftover AP ≥ 3 → +RES |
| `spell-summon-toll` | ELITE | yes | brood_chanter | Allied summons pay +1 AP to start a walk |
| `spell-still-mend` | ELITE | yes | pale / font cantor | Heal iff caster spent **0** walk MP |
| `spell-cadence-rest` | ENEMY_DISCOVERY | yes | cadence / hex | Own remaining CDs do not tick |
| `spell-spent-tax` | ENEMY_DISCOVERY | yes | tax / ley | Next spell +1 AP if they **walked** last turn |
| `spell-brick-crack` | ENEMY_DISCOVERY | yes | stone / rime | Remove one adjacent barrier |
| `spell-watch-lend` | ELITE | yes | glass / hood | Overwatch snap grants watcher +1 AP |
| `spell-pair-purse` | ELITE | yes | purse / scribe | Bonus if leftover AP **exactly 2** |
| `spell-escort-cut` | ELITE | yes | null / leash | Bonus if target has a pet in 2 |
| `spell-dry-mend` | ENEMY_DISCOVERY | yes | cantor / coil | Heal iff **both leftover AP = 0** |
| `spell-pack-long` | ENEMY_ONLY | no | `long_precentor` CHAMPION | Pack next-spell minRange 3 |
| `spell-adj-fold` | BOSS_ONLY | no | `adj_fold_regent` | Swap two **adjacent** player-side bodies |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-10 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #695 so Both Mend / Must Step / Penta Span land once as Wave-11 family CORE. Coordinate with #726 so Heave Mend / Dual Keep / Sept Span land once as Wave-12 family CORE. Not a license to land combat code in the same change as this spec.
