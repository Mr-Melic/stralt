# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 12

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-29  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–11 are Generations 3–11. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Wave 6 (#480) is Generation 6 so those memory ids stay tombstoned. Wave 7 (#533) is Generation 7. Wave 8 (#590) is Generation 8. Wave 9 (#646) is Generation 9. Wave 10 (#679) is Generation 10. Wave 11 (#747) is Generation 11. This document is **Generation 12**. `generationMin: 12`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-29.md`](./ACTION_IDS_SDE_2026-09-29.md).

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
| Wave-10 discovery contract | still-open #679 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md` | G≥10 extra slot, W10 unique ids. **Stamp onto Wave-12 family CORE, do not clone** |
| Wave-11 discovery contract | still-open #747 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md` | G≥11 extra slot, W11 unique ids, #695 / #726 stamps. Unique §11 stay extras until Wave 13 |
| Wave-1…11 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-28.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 / #729 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | #342 | Gale Fan … Eclipse Fold |
| Tactical gap-fillers W5 | still-open #411 | Oncoming … Act Bell |
| Tactical gap-fillers W6 | still-open #463 | Post Sting … About Face |
| Tactical gap-fillers W7 | still-open #525 | Wall Sting … Court Shove |
| Tactical gap-fillers W8 | still-open #563 | Gait Mend … Court Hinge |
| Tactical gap-fillers W9 | still-open #636 | Shove Mend … Court Stretch |
| Tactical gap-fillers W10 | still-open #695 — `SPELL_PROPOSALS_2026-09-27.md` | Both Mend … Court Keep. Wave-11 family CORE. Extra doors `both_cantor` … `court_keep_regent` — do not restamp |
| Tactical gap-fillers W11 | still-open **#726** — `SPELL_PROPOSALS_2026-09-28.md` | Heave Mend … Court Dual. **Stamp onto Wave-12 family CORE, do not clone**. Extra doors `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` — do not restamp |
| Tactical gap-fillers W12 | still-open **#787** — `SPELL_PROPOSALS_2026-09-29.md` | Parched Mend … Court Imprint. **Stamp, do not clone**. Unique §11 stay this catalog’s. Extra doors `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` — do not restamp. Wave 13 families consume #787 as CORE. **SDE wins** both leftover-MP=0 heal: unique §11 is Dry Gait; do **not** also ship Parched Mend |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + #686 + #752 + **#796** | #752 Wave-11 families consume **#646** unique Wave-9 verbs **and** **#695**. **#796** Wave-12 families consume unique **#679** Wave-10 verbs **and** **#726**. Do **not** put unique §11 ids in either CORE |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / #663 / **#753** | Extra doors claimed through Wave 12 (`infirm_chanter` / `yoke_subchanter` / `salve_wicker` / `brand_curate`). Do not restamp |
| Same-day encounter primer | #771 — Bash/Dry/Hood catalog | Room ids `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`. Not a spell catalog. Do not consume |
| PX coherence | #343 / #393 / #481 / #579 / #632 / #744 / #784 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-12 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

At audit start (2026-09-29 00:14 UTC) no `SPELL_PROPOSALS_2026-09-29.md` existed. During this run, **#787** opened (00:18 UTC) as Wave-12 tactical. Same-day #771 is an encounter primer. Same-day #753 owns Wave-12 boss extra doors, not unique SDE ids. **SDE wins** unique §11 ids if they collide. Stamp #726 onto Wave-12 family CORE. Stamp #787 onto Wave **13** family CORE. Do not clone Heave Mend as Force Mend. Do not clone Parched Mend as a second Dry Gait — unique §11 `spell-dry-gait` owns both leftover-MP=0 heal.

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

**#726 tactical Wave 11:** `spell-heave-mend`, `spell-dual-keep`, `spell-sept-span`, `spell-cadence-halve`, `spell-mid-hood`, `spell-ready-sting`, `spell-heave-step`, `spell-drift-sill`, `spell-drift-hold`, `spell-drift-lend`, `spell-drift-sip`, `spell-drift-post`, `spell-heave-bounce`, `spell-must-drift`, `spell-verse-pace`, `spell-court-dual`.

**Wave 11 SDE (#747):** `spell-diag-stride`, `spell-mid-oath`, `spell-void-reel`, `spell-foe-bite`, `spell-dwell-mark`, `spell-own-plate`, `spell-cinder-skip`, `spell-full-plate`, `spell-summon-toll`, `spell-still-mend`, `spell-cadence-rest`, `spell-spent-tax`, `spell-brick-crack`, `spell-watch-lend`, `spell-pair-purse`, `spell-escort-cut`, `spell-dry-mend`, `spell-pack-long`, `spell-adj-fold`.

**#787 tactical Wave 12 (same-day; never re-propose):** `spell-parched-mend`, `spell-cadence-imprint`, `spell-six-span`, `spell-odd-hood`, `spell-lean-sting`, `spell-parched-step`, `spell-parched-sill`, `spell-dry-hold`, `spell-lean-lend`, `spell-parched-sip`, `spell-lean-post`, `spell-parched-bounce`, `spell-must-lean`, `spell-verse-lean`, `spell-lean-hold`, `spell-court-imprint`.

**Do not alias** `spell-orth-stride` ↔ `spell-diag-stride` / `spell-inch-stride` / `spell-pair-stride` / `spell-must-span` / `spell-must-step` / `spell-must-pace` / `spell-rank-lock` / `spell-even-stride` / `spell-odd-stride`, `spell-tri-oath` ↔ `spell-mid-oath` / `spell-near-oath` / `spell-long-oath` / `spell-ground-oath` / `spell-unit-oath` / `spell-mid-hood`, `spell-brick-reel` ↔ `spell-cinder-reel` / `spell-void-reel` / `spell-paint-reel` / `spell-foe-reel` / `spell-ally-reel` / `spell-file-reel` / `spell-hook-line`, `spell-lone-bite` ↔ `spell-foe-bite` / `spell-side-bite` / `spell-lone-sting` / `spell-nook-bite` / `spell-field-bite` / `spell-wall-bite`, `spell-wake-mark` ↔ `spell-dwell-mark` / `spell-ingress-mark` / `spell-stride-mark` / `spell-gait-wick` / `spell-exit-sting` / `spell-wound-mark`, `spell-gait-plate` ↔ `spell-own-plate` / `spell-off-plate` / `spell-near-hood` / `spell-far-hood` / `spell-morrow-plate` / `spell-tick-plate`, `spell-glyph-skip` ↔ `spell-cinder-skip` / `spell-lava-skip` / `spell-spike-skip` / `spell-pit-skip` / `spell-gap-ward` / `spell-glyph-tax`, `spell-full-gait` ↔ `spell-full-plate` / `spell-still-plate` / `spell-tapped-plate` / `spell-empty-plate` / `spell-full-purse`, `spell-summon-gait` ↔ `spell-summon-toll` / `spell-walk-toll` / `spell-kennel-lock` / `spell-still-leash` / `spell-short-leash`, `spell-still-gift` ↔ `spell-still-mend` / `spell-both-mend` / `spell-bar-mend` / `spell-gait-mend` / `spell-dry-mend` / `spell-heave-mend`, `spell-cadence-grace` ↔ `spell-cadence-rest` / `spell-cadence-pin` / `spell-cadence-stall` / `spell-cadence-shave` / `spell-cadence-trim` / `spell-cadence-halve`, `spell-cast-debt` ↔ `spell-debt-mark` / `spell-spent-tax` / `spell-still-tax` / `spell-gait-tax` / `spell-quiet-hex`, `spell-brick-orbit` ↔ `spell-brick-crack` / `spell-brick-sprout` / `spell-brick-shift` / `spell-brick-wipe` / `spell-barrier`, `spell-watch-alms` ↔ `spell-watch-lend` / `spell-watch-fee` / `spell-watch-mute` / `spell-boot-lend`, `spell-pair-gait` ↔ `spell-pair-purse` / `spell-lone-purse` / `spell-pair-stride` / `spell-pair-pace` / `spell-dry-sting`, `spell-leash-cut` ↔ `spell-escort-cut` / `spell-banner-cut` / `spell-crown-cut` / `spell-pet-cut` / `spell-summon-bane` / `spell-file-brand`, `spell-dry-gait` ↔ `spell-dry-mend` / `spell-still-gift` / `spell-still-mend` / `spell-dry-sting` / `spell-parched-mend`, `spell-pack-cap` ↔ `spell-pack-long` / `spell-pack-close` / `spell-pack-stride` / `spell-paper-wind` / `spell-near-oath`, `spell-reach-fold` ↔ `spell-adj-fold` / `spell-mid-fold` / `spell-knight-fold` / `spell-sovereign-fold` / `spell-pawn-trade` / `spell-pair-hinge` / `spell-court-imprint`, `spell-cadence-grace` ↔ `spell-cadence-imprint`, `spell-tri-oath` ↔ `spell-odd-hood`, `spell-pair-gait` ↔ `spell-lean-sting`, `spell-wake-mark` ↔ `spell-lean-post`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Unique Wave-10 CORE (#679 — stamp onto Wave-12 family CORE, do not clone)

#679 **owns** the G≥10 unique SDE holes. Wave 11 already recorded them as extras. This document **consumes #679 as Wave-12 family CORE** (together with #726) and does **not** re-author those cards.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-inch-stride` | MULTI_SOURCE | **One** next walk Chebyshev ≤ 1. Distinct from Orth Stride (orthogonal only, length free) and Must Step (all remaining Chebyshev 1) |
| `spell-rite-first` | ENEMY_DISCOVERY | Cannot Strike until a spell resolves |
| `spell-long-oath` | ENEMY_DISCOVERY | Next spell illegal unless range ≥ 3. Distinct from Tri Oath (**exactly** 3) |
| `spell-cinder-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **hazard**. Distinct from Brick Reel (nearest **barrier**) |
| `spell-side-bite` | ENEMY_DISCOVERY | Bonus if adjacent **ally**. Distinct from Lone Bite (isolated from **all** units) |
| `spell-ingress-mark` | ENEMY_DISCOVERY | Cell detonates on **enter**. Distinct from Wake Mark (**start of turn** occupy) |
| `spell-off-plate` | ENEMY_DISCOVERY | Next **off-turn** hit is 0. Distinct from Gait Plate (leftover MP ≥ 1) |
| `spell-spike-skip` | ENEMY_DISCOVERY | 1-tile walk ignores spikes. Distinct from Glyph Skip (glyph-tax tiles) |
| `spell-tapped-plate` | ENEMY_DISCOVERY | Leftover AP 0 → +RES. Distinct from Full Gait (leftover **MP** ≥ 3) |
| `spell-summon-brace` | ELITE | Allied summons ignore forced move. Distinct from Summon Gait (pets pay +1 **MP** to start a walk) |
| `spell-bar-mend` | ENEMY_DISCOVERY | Heal iff target resolved a spell |
| `spell-cadence-pin` | ENEMY_DISCOVERY | One remaining CD does not tick. Distinct from Cadence Grace (next **own** spell skips starting CD) |
| `spell-still-tax` | ENEMY_DISCOVERY | Next spell +1 AP if they **camped**. Distinct from Cast Debt (next **walk** +1 AP if they **spelled**) |
| `spell-brick-sprout` | ENEMY_DISCOVERY | Grow an adjacent barrier 1 cell. Distinct from Brick Orbit (move an existing adjacent barrier) |
| `spell-watch-fee` | ELITE | Overwatch snap costs the **walker** 1 AP. Distinct from Watch Alms (snap **grants** the walker +1 AP) |
| `spell-lone-purse` | ELITE | Bonus if leftover AP **exactly 1**. Distinct from Pair Gait (leftover **MP** exactly 2) |
| `spell-banner-cut` | ELITE | Bonus vs `isLeader`. Distinct from Leash Cut (shares axis with a pet) |
| `spell-pack-close` | ENEMY_ONLY | Pack next-spell range clamp **1**. Distinct from Pack Cap (maxRange **2**). Never owned |
| `spell-mid-fold` | BOSS_ONLY | Swap two player-side bodies that share an axis. Distinct from Reach Fold (Chebyshev **exactly 2**). Never owned |

`inch_gallery` is **not** Orth Stride’s door. `reach_nave` is **not** Tri Oath’s door. `ash_aisle` is **not** Brick Reel’s door. `pin_nave` is **not** Cadence Grace’s door. `mid_fold_regent` is **not** `reach_fold_regent`. `close_precentor` is **not** `cap_precentor`.

### 0.2b Tactical Wave 11 (#726 — stamp onto Wave-12 family CORE, do not clone)

#726 **owns** the G≥11 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-12 family CORE is **#679 + #726**. Extra doors `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` — do not restamp. Do **not** mint `spell-both-heave` / `spell-hept-span` / `spell-vault-keep`.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-heave-mend` | MULTI_SOURCE | Heal iff **caster and target were force-moved**. Distinct from Dry Gait (both leftover **MP** = 0) and Dry Mend (both leftover **AP** = 0) |
| `spell-dual-keep` | MULTI_SOURCE | Bank leftover **AP and MP** (cap 2 each) to next turn start |
| `spell-sept-span` | MULTI_SOURCE | Seven-cell stretched plus. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-cadence-halve` | MULTI_SOURCE | floor-divide remaining CDs on one hostile. Distinct from Cadence Grace (own next spell skips starting CD) |
| `spell-mid-hood` | ELITE | Next hit from Chebyshev **exactly 2** is 0. Distinct from Tri Oath (exact-3 **spell gate**) |
| `spell-ready-sting` | ENEMY_DISCOVERY | Bonus if leftover AP **and** MP both ≥ 1. Distinct from Pair Gait (leftover MP **exactly** 2) |
| `spell-heave-step` | ENEMY_DISCOVERY | Caster lands adjacent to a force-moved ally |
| `spell-drift-sill` | ENEMY_DISCOVERY | Occupant cannot be a relocate dest |
| `spell-drift-hold` | ELITE | Cannot walk until force-moved |
| `spell-drift-lend` | ENEMY_DISCOVERY | +1 AP to an ally who was force-moved |
| `spell-drift-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff they were force-moved |
| `spell-drift-post` | MULTI_SOURCE | Summon detonates on relocate landing; walk is safe |
| `spell-heave-bounce` | ENEMY_DISCOVERY | Bounce 1 to another force-moved hostile |
| `spell-must-drift` | ELITE | Remaining walks follow last forced-move dir. Distinct from Orth Stride (one next walk, orthogonal only) |
| `spell-verse-pace` | ENEMY_DISCOVERY | Last id illegal until they walk |
| `spell-court-dual` | NOT_PLAYER_LEARNABLE | Mass Dual Keep. Never owned. Distinct from Reach Fold |

`heave_cantor` is **not** Still Gift’s door and **not** Dry Gait’s door. `dual_bursar` is **not** Cast Debt’s door. `span_sept` is **not** Reach Fold’s door. `halve_precentor` is **not** Cadence Grace’s door. `court_dual_regent` is **not** `reach_fold_regent`.

### 0.2c Tactical Wave 12 (#787 — stamp, do not clone; Wave 13 family CORE)

#787 **owns** the G≥12 tactical holes **except** both leftover-MP=0 heal. Unique §11 `spell-dry-gait` **wins** that hole (SDE collision rule). Do **not** also ship `spell-parched-mend`. Do **not** mint `spell-both-parched`. Stamp the other #787 ids as Wave **13** family CORE. Extra doors `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` — do not restamp. Do **not** mint `spell-hex-span` / `spell-cadence-copy` / `spell-long-hood`.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-parched-mend` | MULTI_SOURCE | **Dropped.** Same hole as unique §11 Dry Gait (both leftover **MP** = 0). SDE wins. `parched_cantor` is **not** Dry Gait’s door |
| `spell-cadence-imprint` | MULTI_SOURCE | Copy matching remaining CDs onto the caster; target keeps. Distinct from Cadence Grace (next own spell skips **starting** CD) |
| `spell-six-span` | MULTI_SOURCE | Six-cell 2×3 occupy. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-odd-hood` | ELITE | Next hit from **odd** Chebyshev is 0. Distinct from Tri Oath (exact-3 **spell gate**) and Mid Hood (exact 2) |
| `spell-lean-sting` | ENEMY_DISCOVERY | Bonus if leftover AP = 0 **and** leftover MP ≥ 1. Distinct from Pair Gait (leftover MP **exactly** 2) |
| `spell-parched-step` | ENEMY_DISCOVERY | Caster lands adjacent to a leftover-MP=0 ally |
| `spell-parched-sill` | ENEMY_DISCOVERY | Occupant cannot spend walk MP |
| `spell-dry-hold` | ELITE | Cannot walk until leftover AP = 0. Distinct from Dry Gait (heal) |
| `spell-lean-lend` | ENEMY_DISCOVERY | +1 MP to an ally whose leftover AP = 0 |
| `spell-parched-sip` | ENEMY_DISCOVERY | Steal 1 leftover MP iff leftover AP = 0 |
| `spell-lean-post` | MULTI_SOURCE | Summon detonates on end-turn occupy if leftover AP = 0. Distinct from Wake Mark (start-of-turn, any leftover) |
| `spell-parched-bounce` | ENEMY_DISCOVERY | Bounce 1 to another leftover-MP=0 hostile |
| `spell-must-lean` | ELITE | Non-Strike spells illegal unless leftover MP = 0 |
| `spell-verse-lean` | ENEMY_DISCOVERY | Last id illegal until leftover MP = 0 |
| `spell-lean-hold` | ENEMY_DISCOVERY | Strike illegal until leftover MP = 0 |
| `spell-court-imprint` | NOT_PLAYER_LEARNABLE | Mass Cadence Imprint. Never owned. Distinct from Reach Fold |

`imprint_precentor` is **not** Cadence Grace’s door. `span_six` is **not** Reach Fold’s door. `court_imprint_regent` is **not** `reach_fold_regent`.

### 0.3 Held holes (still not this pass)

Wave 11 §13 listed these as Wave-12/13 candidates. This wave **does not** fill them in unique §11 except the ones marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Four-cell / five-cell / seven-cell occupy | **#636 Quad Span**, **#695 Penta Span**, **#726 Sept Span**. Do not clone. Live `ENEMY_SUMMON_CAP` is still 2 |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| `jackpot` feat door | #185 Absolve already claimed `jackpot` as a MULTI child. Do not restamp |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Bank leftover AP **and** MP on one id | **#726 Dual Keep owns this hole.** Do not clone |
| Heal if **both force-moved** | **#726 Heave Mend owns this hole.** Do not clone |
| Heal if **both leftover AP = 0** | **#747 Dry Mend owns this hole.** |
| Heal if **both leftover MP = 0** | **Filled this wave** as Dry Gait (`spell-dry-gait`). #787 Parched Mend claimed the same hole after audit start — **SDE wins**; do not ship Parched Mend |
| Dedicated CORE families for unique Wave-11 §11 verbs | This catalog’s unique §11 ids stay G≥12 extras, not Wave-12 family CORE. Wave 13 families consume unique Wave-11 verbs **and** **#787**. Wave-12 families consume **#679** and **#726** |
| Facing cards | Still fail closed until a battle `currentView` writer exists. **No new Wave-12 facing cards** |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-eight days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 … 2026-09-28 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Still Gift / Dry Gait **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-12 unique ids stay `mpCost: 0`. Cast Debt / Summon Gait / Pack Cap are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Brick Reel is attract-toward-**nearest barrier**, a new dest flavor after Cinder Reel (hazard) and Void Reel (void/portal) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-12 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Leash Cut reads **living allied summon sharing rank or file**, never `spell.name` |
| Open PR queue | #327+, then 2026-09-27…28 docs, then same-day #771 / **#753** / **#747** / **#787**. **#371 owns Wave-4 SDE. #411 owns Wave-5 tactical. #463 owns Wave-6 tactical. #480 owns Wave-6 SDE. #525 owns Wave-7 tactical. #533 owns Wave-7 SDE. #563 owns Wave-8 tactical. #590 owns Wave-8 SDE. #636 owns Wave-9 tactical. #646 owns Wave-9 SDE. #679 owns Wave-10 SDE. #686 owns Wave-10 families. #695 owns Wave-10 tactical. #726 owns Wave-11 tactical. #747 owns Wave-11 SDE. #752 owns Wave-11 families. #753 owns Wave-12 extra boss doors. #787 owns Wave-12 tactical.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-11 P0 remain the prerequisite. **Do not land Wave-12 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 12 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥12 rares make it sharper: a CHAMPION may hold the generation-12 verb until an orthogonal lane / barrier cell / leftover MP ≥ 3 is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 12 fills holes Waves 1–11, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, and **#787** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Diag Stride, Inch Stride, Mid Oath, Long Oath, Cinder Reel, Void Reel, Dwell Mark, Own Plate, Dry Mend, Pack Long, Adj Fold, Parched Mend, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 12 stamps `generationMin: 12`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Cast Debt **adds 1 AP** to the next **walk** if they spelled last turn. Summon Gait taxes **allied summons** 1 MP to start a walk. Pack Cap clamps **maxRange**. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 12 unique ids do **not** require `currentView`.
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

Wave-12 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| `spell-orth-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Later **walk** that pays the orthogonal gate | **No** — do not double-observe |
| `spell-wake-mark` **paint** (AP spent) | **Yes** |
| Later **start-of-turn detonate** on the cell | **No** |
| `spell-gait-plate` **arm** | **Yes** |
| Later **negated hit** while leftover MP ≥ 1 | **No** |
| `spell-brick-reel` no barrier (fizzle after AP) | **Yes** — AP was spent (Wave 2 fizzle rule) |
| `spell-brick-reel` illegal because AI skipped (no AP) | **No** |
| `spell-glyph-skip` **arm** | **Yes** |
| Later 1-tile walk across a glyph-tax cell | **No** |
| `spell-pack-cap` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-reach-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orbs / `WF-SPL-*` / #771 primer rooms | **Never** write `ownedSpellIds` |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 12 stamps unused **rooms**, not new enum members and not leftover feat doors.

| Source | Wave-12 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥12 family verbs in §11 **plus** #679 / #726 stamps in §0.2 / §0.2b / §12 |
| `ELITE` | Summon Gait, Still Gift, Watch Alms, Pair Gait, Leash Cut |
| `ACHIEVEMENT` | **None.** Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master` |
| `CHALLENGE` | **None.** All nine challenge ids remain claimed through Wave 7 |
| `BOSS` | **None.** Reach Fold is `BOSS_ONLY` (never owned) |
| `SPECIAL_ENCOUNTER` | `orth_gallery` / `tri_nave` / `brick_aisle` / `wake_pulpit` / `orbit_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | None new. #679 Inch Stride / #726 Dual Keep keep their existing children |
| `ENEMY_ONLY` | Pack Cap (never owned) |
| `BOSS_ONLY` | Reach Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-12 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every door listed in Wave 11 §4.1, plus:

| Door | Owner |
| :--- | :--- |
| `diag_gallery` / `mid_nave` / `void_aisle` / `dwell_pulpit` / `crack_nave` | Wave 11 SDE (#747) |
| `long_precentor` / `adj_fold_regent` | Wave 11 SDE Pack Long / Adj Fold |
| `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` | #726 |
| `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` | #787 |
| `both_cantor` / `stride_bursar` / `span_penta` / `trim_precentor` / `court_keep_regent` | #695 |
| `infirm_chanter` / `yoke_subchanter` / `salve_wicker` / `brand_curate` | #753 |
| `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` | #663 |
| `inch_gallery` / `rite_nave` / `reach_nave` / `ash_aisle` / `pin_nave` | Wave 10 SDE (#679) |
| `close_precentor` / `mid_fold_regent` | Wave 10 SDE Pack Close / Mid Fold |
| `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` | #771 encounter primer |

### 4.2 Leftover doors (not this pass)

`survivor` only. Economy feats stay Doka-only. `unstoppable` stays unused forever as a spell gate. `jackpot` stays #185 Absolve. Do not restamp `leader_slayer` / `spell_master`.

---

## 5. Spell pool evolution — Generation 12 (never a last tier)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 12 adds the **G≥12 extra slot**.

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
| 3–11 | Prior extra slots from Waves 3–11. Do not retire them |
| 12 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 12` |
| 13+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-11 G11 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **12** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation — extends Wave 11 §5.1)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
     Wave-12 attached families: #679 unique Wave-10 verbs + #726 tactical Wave-11 ids
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3–11. prior extra slots from Waves 2–11
  12. if G ≥ 12: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
      (skip if no legal id; this is the Generation 12 verb)
  13. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  14. drop any id whose AI_REQUIREMENTS are unmet
  15. keep ENEMY_ONLY on enemies (they cast; they never grant)
  16. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 6. New `aiHint` keys (metadata, not names)

Wave 1 §9.1 through Wave 11 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_orthogonal_only` | flanker, kiter, charger | A legal orthogonal dest exists this turn or next; skip if only diagonal dests remain and Strike is better |
| `next_spell_exact_chebyshev_3` | caster, kiter | Caster can reach Chebyshev 3 before the next spell, or already sits at 3; skip if they must stay at 1–2 (use Strike / Mid Oath) |
| `attract_toward_nearest_barrier` | caster, controller | A barrier cell exists in Chebyshev ≤ 4 of the target; skip if none, or if the 1-step would seal the only player↔exit path |
| `bonus_if_target_isolated` | flanker, berserker, caster | Target has 0 living units of any side at Chebyshev 1; skip if any neighbor (use Foe Bite / Side Bite) |
| `detonate_if_start_turn_on_cell` | caster, controller | Paint the cell the player is likely to **begin** the next turn on; skip if they can walk off for 1 MP before their turn starts |
| `negate_hit_if_leftover_mp_ge_1` | guardian, kiter | Caster can keep leftover MP ≥ 1 through the next incoming hit; skip if they must spend that MP to leave a hazard |
| `skip_glyph_tax_one_tile` | flanker, charger | Next intended walk is length 1 across a glyph-tax / AP-zone cell; skip if the path is lava/cinder/spikes (wrong skip) or length ≥ 2 |
| `res_if_leftover_mp_ge_3` | guardian, buffer, kiter | Caster leftover MP ≥ 3 at resolve **or** they can finish the turn that way; skip if they still need those 3 MP to leave |
| `summon_walk_mp_tax` | summoner, guardian | ≥ 1 living allied summon; skip if none |
| `heal_if_target_spent_zero_walk_mp` | healer | Target `walkMpSpentThisTurn === 0` and missing HP ≥ 8; skip if the target already walked. **Healer CORE only** |
| `next_own_spell_skips_cooldown` | caster, kiter | Caster intends a 3–5 AP tool next; skip if the next cast is Strike (Strike is not a spell CD) |
| `tax_next_walk_if_spelled_last_turn` | caster, controller | Target resolved a non-Strike spell last turn; skip if they only Struck or camped (use Still Tax / Debt Mark) |
| `orbit_adjacent_barrier` | caster, controller | An adjacent barrier cell exists **and** another adjacent empty floor cell exists; the move must not seal the only player↔exit path (`findPath` after a hypothetical orbit); skip if it would |
| `overwatch_snap_grants_walker_ap` | kiter, caster | Caster already has or will arm an overwatch this turn; skip if no snap is likely |
| `bonus_if_leftover_mp_eq_2` | caster, kiter | Target leftover MP is exactly 2; skip if 0, 1, or ≥ 3 (use Dry Sting / Soul Sip / Full Gait) |
| `bonus_if_target_shares_axis_with_allied_summon` | caster, controller | Target shares rank **or** file with a living allied summon (same side as the target); skip if none, or if the target **is** the summon (use Summon Bane) |
| `heal_if_both_leftover_mp_eq_0` | healer | Both caster and heal target have leftover MP **= 0** after this spell; skip if either leftover MP ≥ 1. **Healer CORE only** |
| `pack_next_spell_max_range_2` | buffer | CHAMPION only; skip if aura up |
| `fold_two_player_side_exact_2` | **boss AI only** | Exactly two living player-side bodies at Chebyshev **exactly 2** from each other; skip if 0–1 or they are at 1 or ≥ 3 |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: Doka credit `WorldExploration.tsx` 1502–1504, jackpot `WorldExploration.tsx` 18448.
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Wake Mark / Gait Plate / Glyph Skip may add a **battle-log line** when the detonate / negate / skip fires — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 12 adds **no** new canister methods.

| Writer | Wave-12 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | Not used for a new feat/challenge door this wave. #679 / #726 MULTI children stay those catalogs’ |

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
- Still Gift / Dry Gait player-side HP gain flips `challengeHealUsedRef` only when HP actually increased.
- Brick Orbit that would seal the last path must not write tiles; if forced, fizzle (AP spent, observe).

---

## 9. Special encounters (Wave 12)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `orth_gallery` | Blink Cutter on an open rank/file; diagonal walks are blocked by existing walls | `spell-orth-stride` via observe+win |
| `tri_nave` | Glass Sniper parked at Chebyshev 3 down a file | `spell-tri-oath` via observe+win |
| `brick_aisle` | Stone Castellan beside one existing barrier the player can walk around | `spell-brick-reel` via observe+win |
| `wake_pulpit` | Glyph Sower + a cell the player wants to camp overnight | `spell-wake-mark` via observe+win |
| `orbit_nave` | Rime Mason + one optional barrier with an empty adjacent cell | `spell-brick-orbit` via observe+win |

Do not retag `diag_gallery` / `mid_nave` / `void_aisle` / `dwell_pulpit` / `crack_nave` / `inch_gallery` / `pair_gallery` / `odd_gallery` / `even_gallery` / `ash_aisle` / `pin_nave` / `reach_nave` / `long_gallery`. `crack_nave` stays Brick Crack. `reach_nave` stays Long Oath. `brick_aisle` is not a Twin Gate pad and not `map.portals`. Do not consume #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–11 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 + #695 + #726 + **#787** already cover: push, pull-to-caster, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, conditional bounce, next-spell AP tax, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, instant execute, DoT detonate, cross AoE, tile-gravity, ally rescue pull, one next Chebyshev-1 walk, one next diagonal walk, cannot-Strike-until-spell, next-spell range≥3, next-spell exact-2, pull toward nearest hazard / void, adjacent-ally / adjacent-hostile bonus, cell-enter / leave / end-turn detonate, off-turn / own-turn hit negate, spike / lava / pit / cinder skip, leftover-AP-0 / leftover-AP≥3 RES, summons ignore shove / pay AP to walk, heal-if-target-spelled / caster-0-walk-MP / both leftover-AP-0 / both-walked / both-force-moved, freeze one remaining CD / own remaining skip tick, tax if they camped / walked last turn, grow / remove barrier, overwatch walker AP fee / watcher AP grant, leftover-AP-exactly-1 / exactly-2 poke, bonus vs leader / pet-in-2, pack range clamp 1 / minRange 3, axis fold / adjacent fold, leftover-MP bank, five-cell / seven-cell occupy, remaining-CD −1 / floor-halve, near-range / exact-2 miss.

**Still open (Wave 12 SDE unique ids).**

| Hole | Wave-12 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk must be orthogonal | `spell-orth-stride` | Diag Stride **requires** diagonal. Rank Lock binds **all** remaining walks to the current rank **or** file. Inch Stride is Chebyshev ≤ 1 (diagonal 1 is legal). Must Step binds **all** remaining Chebyshev-1 dests |
| Next spell illegal unless Chebyshev = 3 | `spell-tri-oath` | Mid Oath is exact **2**. Long Oath is **≥ 3**. Near Oath is ≤ 1. Mid Hood is exact-2 **incoming miss** |
| Pull 1 toward nearest barrier | `spell-brick-reel` | Cinder Reel is nearest **hazard**. Void Reel is nearest **void/portal**. Paint Reel is nearest **paint**. Hook is to caster |
| Bonus if isolated from **all** units | `spell-lone-bite` | Lone Sting is 0 Chebyshev-1 **hostiles**. Foe Bite needs an adjacent **hostile**. Side Bite needs an adjacent **ally** |
| Cell detonates if they **start their turn** on it | `spell-wake-mark` | Ingress is **enter**. Dwell is **end turn**. Stride Mark / Exit Sting are **leave**. Gait Wick follows the unit |
| Next hit is 0 while leftover MP ≥ 1 | `spell-gait-plate` | Own Plate is **your turn**. Off Plate is **off-turn**. Near / Far Hood are range gates. Morrow Plate is a different window |
| 1-tile walk ignores **glyph-tax** | `spell-glyph-skip` | Cinder Skip is burn. Spike Skip is spikes. Lava Skip is lava. Pit Skip is pits. Gap Ward skips **overwatch**. Wrong tile still taxes |
| Leftover MP ≥ 3 → +RES | `spell-full-gait` | Full Plate is leftover **AP** ≥ 3. Still Plate is leftover **MP** = 0. Tapped Plate is leftover AP = 0 |
| Allied summons pay +1 MP to start a walk | `spell-summon-gait` | Summon Toll is +1 **AP**. Walk Toll taxes the **caster’s** walk pool. Kennel Lock stops stray walks |
| Heal iff **target** spent 0 walk MP | `spell-still-gift` | Still Mend is **caster** spent 0 walk MP. Both Mend is both **walked**. Dry Mend is both leftover **AP** = 0 |
| Next own spell does not start its cooldown | `spell-cadence-grace` | Cadence Rest skips ticking **already-running** remaining CDs. Cadence Pin freezes **one hostile** remaining. Stall is +1 all |
| Next walk +1 AP if they **spelled** last turn | `spell-cast-debt` | Debt Mark taxes the next walk **unconditionally**. Spent Tax taxes the next **spell** if they **walked**. Still Tax taxes the next spell if they **camped** |
| Move one adjacent barrier to another adjacent empty cell | `spell-brick-orbit` | Brick Shift **slides along an axis**. Brick Crack **removes**. Brick Sprout **grows**. Barrier **places** from range |
| Overwatch snap grants the **walker** +1 AP | `spell-watch-alms` | Watch Lend grants the **watcher**. Watch Fee **debits** the walker. Watch Mute zeros the snap |
| Bonus if leftover MP **exactly 2** | `spell-pair-gait` | Pair Purse is leftover **AP** exactly 2. Lone Purse is leftover AP exactly 1. Ready Sting is leftover AP **and** MP both ≥ 1 |
| Bonus if target shares rank/file with a pet | `spell-leash-cut` | Escort Cut is a pet at Chebyshev ≤ 2 (any geometry). Summon Bane bonuses the **summon**. Banner Cut reads `isLeader` |
| Heal iff **both leftover MP = 0** | `spell-dry-gait` | Dry Mend is both leftover **AP** = 0. Still Gift is target walk-MP = 0. Heave Mend is both **force-moved**. #787 Parched Mend is the same hole — **SDE wins**; do not ship a second id |
| Pack next-spell maxRange 2 | `spell-pack-cap` | Pack Close clamps range **to 1**. Pack Long raises **minRange** to 3. Paper Wind cuts **their** range. Never owned |
| Swap two player-side bodies at Chebyshev **exactly 2** | `spell-reach-fold` | Adj Fold is Chebyshev **1**. Mid Fold is shared rank/file **any** distance. Knight Fold is (2,1) from midpoint. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 12)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–11, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #646, #679, #695, #726, #747, or **#787**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Do not add a fourth walk-MP snipe.

### 11.1 New `effectParams` keys (Wave 12 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #679 / #726 / #747 key names for a different meaning.

```text
orthStrideNextWalk,            // true → next walk legal only if (dx==0) XOR (dy==0), length ≥ 1
triOathExactChebyshev,         // 3
brickReelDistance,             // 1 toward nearest barrier
loneBiteIsolatedBonus,         // 8
wakeMarkDuration, wakeMarkDamage,
gaitPlateLeftoverMpMin,        // 1 → next hit is 0 while leftover MP ≥ this
glyphSkipWalkLength,           // 1
fullGaitLeftoverMpMin, fullGaitRes, fullGaitDuration,
summonWalkMpTax,               // 1
stillGiftHeal,
cadenceGraceNextSpell,         // true → next own spell does not start CD
castDebtNextWalkApTax,         // 1 if they spelled last turn
brickOrbitAdjacent,            // true → move one adjacent barrier to another adjacent empty cell
watchAlmsWalkerAp,             // 1
pairGaitLeftoverMp, pairGaitBonus,
leashCutAxisBonus,
dryGaitHeal,
packMaxRange,                  // 2
reachFoldExactChebyshev        // 2
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration`. Do **not** reuse `diagStrideNextWalk`, `dwellMarkDuration`, `ownPlateDuration`, `summonWalkApTax`, `packMinRange`, or `adjFoldTwoPlayerSide`.

---

### SPELL_ID: `spell-orth-stride`

NAME: Orth Stride  
ROLE: CONTROL — one next walk must be orthogonal  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `rust_reaver`; `G ≥ 12`; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rust_reaver`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, 1 turn. The caster’s **next walk** this turn is legal **only** if it is orthogonal (`|dx|==0 XOR |dy|==0`, length ≥ 1). Diagonal dests fail confirm; MP is not spent (`effectParams: {"orthStrideNextWalk":true}`). Teleport / Swap / Twin-gate / Phase Slip do **not** pay and do **not** consume. Distinct from Diag Stride (`|dx|==|dy|`), Inch Stride (Chebyshev ≤ 1, diagonal 1 legal), Rank Lock (all remaining walks on the current rank **or** file), Must Step (all remaining Chebyshev 1). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_orthogonal_only"`. Flanker / kiter / charger. Skip if only diagonal dests remain and Strike is better. **Do not** assign to kits whose only walk is knight-jump.  
PLAYER_COUNTERPLAY: Stand on a diagonal from them; Root; occupy the rank and file  
SYNERGIES: File Lance after they line up; Rank Lock on a different body  
BALANCE_RISK: Orthogonal-only + Rank Lock is a brick. One next walk + CD 2 + G≥12. Fail closed (confirm fails), never become Strike.  
PERSISTENCE_REQUIREMENTS: Standard observe → same-encounter win. Arm observes; later walk does not.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tri-oath`

NAME: Tri Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 3  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `pale_cantor`; `G ≥ 12`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn. The caster’s next **spell** (`damage > 0` or non-physical tool) is illegal unless the target is Chebyshev **exactly 3**. Strike / `physical_attack` stays legal at 1 (`effectParams: {"triOathExactChebyshev":3}`). Distinct from Mid Oath (exact **2**), Long Oath (**≥ 3**), Near Oath (≤ 1), Mid Hood (exact-2 **incoming miss**). If they confirm a spell at 1, 2, or ≥ 4, the confirm fails; AP is not spent.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_3"`. Caster / kiter. Skip if they must stay at 1–2. Next cast should be Glass Shot / File Lance / Far Sting, not Strike.  
PLAYER_COUNTERPLAY: Walk to 1, 2, or 4+; Quiet Hex the 3-range poke  
SYNERGIES: Split Pace after a 2-walk to sit at 3; Paper Wind to keep them from 4  
BALANCE_RISK: Exact-3 + Far Sting is a kiting prison. 2 AP + CD 2 + Strike exempt. Do not stack with Pack Long (minRange 3 vs exact 3) on a BASE kit.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Arm observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-reel`

NAME: Brick Reel  
ROLE: POSITION — pull 1 toward nearest barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `stone_castellan` or `rime_mason`; `G ≥ 12`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Attract the target 1 tile toward the nearest **barrier** cell (`effectParams: {"brickReelDistance":1}`). If no barrier exists in Chebyshev ≤ 6 of the target, fizzle (AP spent, no move). Occupancy / void / world portal: fizzle that step. Distinct from Cinder Reel (nearest **hazard**), Void Reel (nearest **void/portal**), Paint Reel (nearest **paint**), Hook Line (to caster). Dest is a barrier tile, not `map.portals`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_barrier"`. Caster / controller. Skip if none, or if the 1-step would seal the only player↔exit path. Prefer a pull onto glyph-tax / cinder / ally overwatch.  
PLAYER_COUNTERPLAY: Stand off the barrier; occupy the toward-tile; fight in open boards  
SYNERGIES: Glyph Tax on the toward-cell; Brick Orbit to place the dest; Far Watch covering the pull  
BALANCE_RISK: Pull onto lava is the combo. AI value-check; player copy can self-sabotage a summon. World portals stay impassable.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-board fizzle still observes. Illegal (no AP) does not.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lone-bite`

NAME: Lone Bite  
ROLE: DAMAGE — bonus if the target is isolated  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `rust_reaver`; `G ≥ 12`; `aiProfile` flanker/berserker  
ENEMY_FAMILIES: `blink_cutter`, `rust_reaver`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target has **0** living units of any side at Chebyshev 1 (isolated), deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"loneBiteIsolatedBonus":8}`). Neighbor summons, decoys, and the caster all count. Distinct from Lone Sting (0 Chebyshev-1 **hostiles** — allies allowed), Foe Bite (needs an adjacent **hostile**), Side Bite (needs an adjacent **ally**).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_isolated"`. Flanker / berserker / caster. Skip if any neighbor and Strike is better.  
PLAYER_COUNTERPLAY: Park a summon adjacent; stand next to a corpse-free ally; False Retreat decoy  
SYNERGIES: Pawn Trade to isolate; Sever Tether first  
BALANCE_RISK: 18 on a 2-AP CD 1 is Frost-adjacent. Isolation gate + G≥12. Do not also apply Foe Bite’s adjacent-hostile bonus (different ids; AI should not stack both on G=0).  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wake-mark`

NAME: Wake Mark  
ROLE: CONTROL — cell detonates if they start their turn on it  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `bone_scribe`; `G ≥ 12`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor tile 2 turns. If a hostile **begins their turn** occupying the cell, they take 10 (spell, RES+SR) and the paint consumes (`effectParams: {"wakeMarkDuration":2,"wakeMarkDamage":10}`). Enter, leave, and end-turn occupy do **not** detonate. Teleport / Swap / Twin-gate onto the cell does **not** detonate until their next turn **starts** there. Distinct from Ingress Mark (enter), Dwell Mark (end turn), Stride Mark / Exit Sting (leave). Observation is the **paint**.  
SCALING: damage follows dmg%; duration fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_start_turn_on_cell"`. Caster / controller. Paint the cell they are likely to **begin** on. Skip if they can walk off for 1 MP before their turn.  
PLAYER_COUNTERPLAY: Walk off before your turn; blink off; send a summon to camp it  
SYNERGIES: Root / Cast Debt so they cannot leave; Hold Ground covering the cell  
BALANCE_RISK: Start-turn 10 + Root is a camp tax. Consume-on-first-body, CD 2, G≥12.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gait-plate`

NAME: Gait Plate  
ROLE: DEFENSE — next hit is 0 while leftover MP ≥ 1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 12`; `aiProfile` guardian/kiter  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥12. `generationMin: 12`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 2 turns. The next damaging hit against the caster is 0 **if** their leftover MP at impact is ≥ 1; the charge then consumes (`effectParams: {"gaitPlateLeftoverMpMin":1}`). If leftover MP is 0 at impact, the hit lands fully and the charge remains. Strike and spells both consume when they miss. Distinct from Own Plate (next hit on **your turn**, any MP), Off Plate (**off-turn**), Near Hood (Chebyshev ≤ 1), Far Hood (≥ 3). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_mp_ge_1"`. Guardian / kiter. Skip if they must spend that MP to leave a hazard.  
PLAYER_COUNTERPLAY: Drain MP first (Frost / Slow / Soul Sip); wait until they walk to 0; Dispel  
SYNERGIES: Haste to keep leftover; Debt Mark so they do not want to walk  
BALANCE_RISK: A kiter who never spends the last MP is unhittable once. Consume-on-first-body + leftover-MP gate + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-glyph-skip`

NAME: Glyph Skip  
ROLE: POSITION — 1-tile walk ignores glyph-tax  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `ley_tollkeeper`; `G ≥ 12`; `aiProfile` flanker/charger  
ENEMY_FAMILIES: `glyph_sower`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, 1 turn. The caster’s next walk of **length 1** does not pay glyph-tax / AP-zone tiles (`effectParams: {"glyphSkipWalkLength":1}`). Cinder / lava / spikes / pits / void still apply. Length ≥ 2 pays normally. Teleport / Swap do not consume. Distinct from Cinder Skip / Lava Skip / Spike Skip / Pit Skip / Gap Ward (overwatch). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_glyph_tax_one_tile"`. Flanker / charger. Skip if the path is the wrong hazard or length ≥ 2.  
PLAYER_COUNTERPLAY: Paint lava instead; occupy the 1-step; force a 2-walk  
SYNERGIES: Glyph Tax they painted themselves; Cast Debt so the 1-step also costs AP  
BALANCE_RISK: Ignoring Glyph Tax deletes that tile as an answer. Length 1 + CD 2 + wrong-hazard still ticks.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Consume walk does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-full-gait`

NAME: Full Gait  
ROLE: DEFENSE — leftover MP ≥ 3 → +RES  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 12`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥12. `generationMin: 12`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If leftover MP at resolve is **≥ 3**, gain `buffStat: "res"`, `buffModifier: 1.20`, 2 turns (`effectParams: {"fullGaitLeftoverMpMin":3,"fullGaitRes":1.20,"fullGaitDuration":2}`). If leftover MP ≤ 2, fizzle (AP spent). Distinct from Full Plate (leftover **AP** ≥ 3), Still Plate (leftover **MP** = 0), Tapped Plate (leftover AP = 0), Empty Plate. Last RES% writer wins vs Iron Skin / Chain Ward.  
SCALING: modifier fixed  
AI_REQUIREMENTS: `aiHint: "res_if_leftover_mp_ge_3"`. Guardian / buffer / kiter. Skip if they still need those 3 MP to leave. Do not double-cast with Iron Skin (last writer).  
PLAYER_COUNTERPLAY: Force a 2-walk first; Dispel; ignore and snipe  
SYNERGIES: Haste to keep leftover; Gait Plate (keep 1 MP to negate, 3 MP to RES — **do not** require both on a BASE kit)  
BALANCE_RISK: 1.20 + Iron Skin last-writer. Gate is leftover MP ≥ 3, CD 2. Fizzle still observes.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-gait`

NAME: Summon Gait  
ROLE: SUMMONS — allied pets pay +1 MP to start a walk  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 12`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 12`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon that starts a walk pays **+1 MP** (min 1) in addition to the walk cost (`effectParams: {"summonWalkMpTax":1}`). Strike in place is free. Teleport / Swap do **not** pay. Distinct from Summon Toll (+1 **AP**), Walk Toll (taxes the **caster**), Kennel Lock (stops stray walks), Short / Still Leash (radius locks). This is a flag, **not** `spell.mpCost`.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_walk_mp_tax"`. Summoner / guardian. Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
PLAYER_COUNTERPLAY: Park pets; Sever Tether; fight without a summon  
SYNERGIES: Mire Sheet on the pet’s path; Summon Toll on a different family — **do not** put Toll and Gait on the same BASE kit  
BALANCE_RISK: Pets that cannot afford 2 MP are rooted in practice. Elite + CD 3. Player copy taxes **their** pets — a real downside when kiting.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-still-gift`

NAME: Still Gift  
ROLE: HEAL — heal if the **target** spent 0 walk MP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 12`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 12`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: If the **target** has spent **0 walk MP this turn** at resolve, heal 8 (`effectParams: {"stillGiftHeal":8}`). Target may be self. If the target already walked, fizzle (AP spent, no heal). Caster walk does **not** gate. Distinct from Still Mend (**caster** spent 0 walk MP), Both Mend (both **walked**), Dry Mend (both leftover AP = 0), Dry Gait (both leftover MP = 0). `healAmount > 0` — **healer CORE only**. Player-side HP gain flips `healUsed` only when HP actually increased.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_target_spent_zero_walk_mp"`. Healer. Skip if the target already walked. Do not dump the target’s MP **only** to enable this if a Strike would kill.  
PLAYER_COUNTERPLAY: Force the target to walk; Cursed Wound; kill the cantor first  
SYNERGIES: Root the target; Planted Stance (they wanted 0 MP anyway)  
BALANCE_RISK: 8 on a camping ally is a reset. Target-0-walk gate + CD 2 + healer CORE only.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-grace`

NAME: Cadence Grace  
ROLE: SUPPORT — next own spell does not start its cooldown  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 12`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: The caster’s **next spell** this battle (or 2 turns) does not write its cooldown on resolve (`effectParams: {"cadenceGraceNextSpell":true}`). Strike is **not** a spell for this key. Already-running remaining CDs still tick. Distinct from Cadence Rest (own remaining **do not tick**), Cadence Pin (one **hostile** remaining frozen), Cadence Stall (+1 all), Cadence Trim (hostile remaining −1). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_own_spell_skips_cooldown"`. Caster / kiter. Skip if the next cast is Strike. Next cast should be a 3–5 AP CD tool (Inferno, Hold Ground).  
PLAYER_COUNTERPLAY: Quiet Hex the free-CD spell; Dispel the grace; force Strike  
SYNERGIES: Last Ward (0 AP **and** no CD — **do not** stack both on a BASE kit; CHAMPION may have one)  
BALANCE_RISK: Free-CD Inferno is the nightmare. 2 AP + CD 3 + Strike exempt + 2-turn window.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Later CD skip does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cast-debt`

NAME: Cast Debt  
ROLE: CONTROL — next walk costs AP if they spelled last turn  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 12`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target resolved a non-Strike **spell** last turn, their **next walk of ≥ 1 tile** also costs +1 AP (`effectParams: {"castDebtNextWalkApTax":1}`). If they only Struck or camped last turn, fizzle (AP spent). Teleport / Swap / Phase Slip / Twin-gate step do **not** pay. Distinct from Debt Mark (unconditional next-walk tax), Spent Tax (next **spell** +1 AP if they **walked**), Still Tax (next spell if they **camped**), Quiet Hex (next spell unconditionally).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_spelled_last_turn"`. Caster / controller. Skip if they only Struck or camped (use Still Tax / Debt Mark).  
PLAYER_COUNTERPLAY: Blink off; Strike in place; pay the 1 AP; camp after the nuke  
SYNERGIES: Far Watch (walking into 3–4 now costs AP **and** snaps); Paper Wind  
BALANCE_RISK: Cast Debt + Debt Mark + Quiet Hex is three taxes. Different keys, all allowed, but AI should not stack all three on G=0. G≥12 gate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-orbit`

NAME: Brick Orbit  
ROLE: TERRAIN — move one adjacent barrier to another adjacent empty cell  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 12`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Move **one** barrier cell adjacent to the caster onto **another** adjacent empty floor cell (`effectParams: {"brickOrbitAdjacent":true}`). Occupancy / void / portal / existing barrier dest: fizzle that move (AP spent). If the move would seal the only player↔exit path (`findPath` after a hypothetical orbit), AI skip; if forced, fizzle (no tile write). Distinct from Brick Shift (slide along an axis, possibly away from the caster), Brick Crack (remove), Brick Sprout (grow), Barrier (place from range). Maps stay solvable.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "orbit_adjacent_barrier"`. Caster / controller. Skip if no adjacent barrier, no empty adjacent dest, or solvability fails.  
PLAYER_COUNTERPLAY: Stand so both adjacent dests are occupied; Hook the caster off the wall  
SYNERGIES: Brick Reel toward the new dest; Glyph Tax on the landing  
BALANCE_RISK: Orbiting a wall onto the exit is a soft-lock. Solvability skip is mandatory. CD 2 + G≥12.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Solvability fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-alms`

NAME: Watch Alms  
ROLE: SUPPORT — overwatch snap grants the walker +1 AP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 12`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. The next time an allied overwatch **snap** deals damage (Hold Ground / Far Watch / Tripwire consume), the **walker** who triggered it gains +1 leftover AP this turn (`effectParams: {"watchAlmsWalkerAp":1,"overwatchDuration":2}`). If the snap deals 0 (Watch Mute), Alms does not grant. Distinct from Watch Lend (grants the **watcher**), Watch Fee (**debits** the walker 1 AP), Watch Mute (snap 0). Observation is the **arm**.  
SCALING: grant fixed  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_grants_walker_ap"`. Kiter / caster. Skip if no snap is likely. Prefer arming Far Watch the same turn.  
PLAYER_COUNTERPLAY: Blink in (no walk snap); send a summon; Watch Mute first  
SYNERGIES: Far Watch / Hold Ground; **do not** stack with Watch Fee on a BASE kit (grant vs debit)  
BALANCE_RISK: Paying the walker for snapping is a bait, not a nuke. Elite + consume-on-first-snap + CD 3. Player copy can fund the enemy’s leftover.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pair-gait`

NAME: Pair Gait  
ROLE: DAMAGE — bonus if leftover MP is exactly 2  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `purse_scribe` or `bone_scribe`; variant ≥ ELITE or `G ≥ 12`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s leftover MP at resolve is **exactly 2**, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"pairGaitLeftoverMp":2,"pairGaitBonus":8}`). Leftover 0, 1, or ≥ 3: 10 only. Distinct from Pair Purse (leftover **AP** exactly 2), Lone Purse (leftover AP exactly 1), Dry Sting (leftover AP = 0), Ready Sting (leftover AP **and** MP both ≥ 1).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_mp_eq_2"`. Caster / kiter. Skip if leftover MP is not 2 and Strike is better.  
PLAYER_COUNTERPLAY: Spend to 1 or 0; Haste to 3+; sit at 4  
SYNERGIES: Frost / Slow to land them on 2; Soul Sip after they wanted a 3-MP walk  
BALANCE_RISK: 18 on a 2-AP CD 1 is Frost-adjacent. Exact-2 MP gate + elite.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-leash-cut`

NAME: Leash Cut  
ROLE: DAMAGE — bonus if the target shares an axis with a pet  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `null_censor` or `leash_warden`; variant ≥ ELITE or `G ≥ 12`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `null_censor`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 12`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target shares rank **or** file with a living **allied summon** (same side as the target), deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"leashCutAxisBonus":8}`). Distance on that axis is free. If the target **is** the summon, the bonus does **not** apply (use Summon Bane). Reads `isSummon` on same-axis bodies, never `spell.name` or `"wolf"`. Distinct from Escort Cut (pet at Chebyshev ≤ 2, any geometry), Banner Cut (`isLeader`), Pet Cut, Crown Cut.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_shares_axis_with_allied_summon"`. Caster / controller. Skip if no axis pet and Strike is better. Prefer the handler, not the pet.  
PLAYER_COUNTERPLAY: Park pets off-axis; Sever Tether; fight without a summon  
SYNERGIES: File Slide to line the pet up; Kennel Lock keeps the pet parked — a real downside  
BALANCE_RISK: 18 vs a summoner on a file is Frost-adjacent. Elite + flag check + axis gate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dry-gait`

NAME: Dry Gait  
ROLE: HEAL — heal if both leftover MP = 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pale_cantor` or `coil_arbiter`; `G ≥ 12`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `coil_arbiter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: If **both** caster and target have leftover MP **= 0** at resolve, heal the target 8 (`effectParams: {"dryGaitHeal":8}`). Target may be self (self counts as both if the caster’s leftover MP is 0). Walk / force-move / leftover **AP** do **not** substitute. If either leftover MP ≥ 1, fizzle (AP spent, no heal). Distinct from Dry Mend (both leftover **AP** = 0), Still Gift (target walk-MP = 0), Still Mend (caster walk-MP = 0), Heave Mend (both force-moved), Both Mend (both walked), #787 Parched Mend (**same hole — SDE wins**; do not ship `spell-parched-mend`). `healAmount > 0` — **healer CORE only**. Player-side HP gain flips `healUsed` only when HP actually increased.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_both_leftover_mp_eq_0"`. Healer. Skip if either leftover MP ≥ 1. Do not dump leftover MP **only** to enable this if a Strike would kill.  
PLAYER_COUNTERPLAY: Keep 1 leftover MP; Cursed Wound; kill the cantor first  
SYNERGIES: Frost / Slow to land both on 0; Full Gait is leftover MP ≥ 3 (opposite gate)  
BALANCE_RISK: 8 after a double empty-gait is a reset. Two leftover-MP-0 flags + CD 2 + healer CORE only.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-cap`

NAME: Pack Cap  
ROLE: SUPPORT — allied next-spell maxRange 2  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `cap_precentor`; variant CHAMPION; `G ≥ 12`  
ENEMY_FAMILIES: `cap_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 12`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 have their next **spell** `maxRange` lowered to 2 (`effectParams: {"packMaxRange":2,"auraRadius":2,"auraDuration":2}`). Strike stays legal at 1. Distinct from Pack Close (clamps range **to 1**), Pack Long (raises **minRange** to 3), Paper Wind (cuts **their** range), Near Oath (self short-range gate), Pack Tempo / Howl / Tithe / Stride. Does not grant the caster extra AP the turn it is cast.  
SCALING: maxRange fixed  
AI_REQUIREMENTS: `aiHint: "pack_next_spell_max_range_2"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2. **Do not** put Pack Close, Pack Long, and Pack Cap on the same BASE kit.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies out of 2; walk to 1 and Strike  
SYNERGIES: Tri Oath (exact 3 vs max 2 is a brick — **do not** stack both on a BASE kit; CHAMPION may have Cap **or** Tri Oath, not both in CORE)  
BALANCE_RISK: maxRange 2 on two bodies deletes sniper tools. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe (and would not grant anyway).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-reach-fold`

NAME: Reach Fold  
ROLE: POSITION — swap two player-side bodies at Chebyshev exactly 2  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `reach_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `reach_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **only if** they stand at Chebyshev **exactly 2** from each other. If fewer than two, or they are at 1 or ≥ 3, fizzle. Then deal 6 (spell) to each (`effectParams: {"reachFoldExactChebyshev":2}`). Distinct from Adj Fold (Chebyshev **1**), Mid Fold (shared rank/file, any distance on the axis), Knight Fold ((2,1) from midpoint), Sovereign Fold (any two), Pawn Trade (two hostiles-to-caster). Never owned. Player already has Swap and Pawn Trade as learnables.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_exact_2"`. **Boss AI only.** Skip if 0–1 player-side bodies or they are not at Chebyshev 2.  
PLAYER_COUNTERPLAY: Fight without a summon; stand at 1 or 3+; False Retreat decoy as the second body  
SYNERGIES: Reach Fold identity; Claim Ward (anti-swap **cell** does not block this — fold is unit swap, not cell claim; **explicit** so implementers do not merge the keys)  
BALANCE_RISK: Forced exact-2 player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`. Do not restamp #753 `infirm_chanter` / `yoke_subchanter` / `salve_wicker` / `brand_curate`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 12 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…11 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥12 | `spell-orth-stride`, `spell-lone-bite` |
| `rust_reaver` | RARE / G≥12 | `spell-orth-stride`, `spell-lone-bite` |
| `glass_sniper` | RARE / G≥12 | `spell-tri-oath` |
| `glass_sniper` | ELITE | `spell-watch-alms` |
| `pale_cantor` | RARE / G≥12 | `spell-tri-oath`, `spell-dry-gait` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-still-gift` (healer CORE only) |
| `stone_castellan` / `rime_mason` | RARE / G≥12 | `spell-brick-reel`, `spell-brick-orbit` |
| `glyph_sower` | RARE / G≥12 | `spell-wake-mark`, `spell-glyph-skip` |
| `bone_scribe` | RARE / G≥12 | `spell-wake-mark` |
| `bone_scribe` / `purse_scribe` | ELITE | `spell-pair-gait` |
| `plate_warden` | ADVANCED / G≥12 | `spell-gait-plate`, `spell-full-gait` |
| `iron_golem` | ADVANCED / G≥12 | `spell-gait-plate`, `spell-full-gait` |
| `ley_tollkeeper` | RARE / G≥12 | `spell-glyph-skip`, `spell-cast-debt` |
| `tax_scribe` | RARE / G≥12 | `spell-cast-debt` |
| `brood_chanter` | ELITE | `spell-summon-gait` |
| `cadence_thief` | RARE / G≥12 | `spell-cadence-grace` |
| `hex_chorister` | RARE / G≥12 | `spell-cadence-grace` |
| `hood_lurker` | ELITE | `spell-watch-alms` |
| `null_censor` / `leash_warden` | ELITE | `spell-leash-cut` |
| `coil_arbiter` | RARE / G≥12 | `spell-dry-gait` |
| `cap_precentor` CHAMPION | SIGNATURE | `spell-pack-cap` (`ENEMY_ONLY`; not with Pack Close / Pack Long on the same BASE kit) |
| `reach_fold_regent` | BOSS_ONLY | `spell-reach-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-12 family CORE consumes #679 and #726

The Wave-12 enemy/elite family sheet (**#796**, not this PR) puts **#679** unique Wave-10 verbs and **#726** tactical Wave-11 ids in **CORE** for new families. Unique §11 ids may appear there only as G≥12 extras in a later family pass (Wave 13), not as this document’s CORE. Do **not** put unique §11 ids in #752 CORE (#646 + #695) or in #796 CORE.

Stamp, do not clone #679: Inch Stride, Rite First, Long Oath, Cinder Reel, Side Bite, Ingress Mark, Off Plate, Spike Skip, Tapped Plate, Summon Brace, Bar Mend, Cadence Pin, Still Tax, Brick Sprout, Watch Fee, Lone Purse, Banner Cut. Pack Close stays `ENEMY_ONLY`. Mid Fold stays `BOSS_ONLY` on `mid_fold_regent`.

Stamp, do not clone #726: Heave Mend, Dual Keep, Sept Span (implementation-blocked while summon cap is 2), Cadence Halve, Mid Hood, Ready Sting, Heave Step, Drift Sill, Drift Hold, Drift Lend, Drift Sip, Drift Post, Heave Bounce, Must Drift, Verse Pace. Court Dual stays `NOT_PLAYER_LEARNABLE`.

### 12.2 Wave-11 unique extras (deferred)

#747 unique Wave-11 verbs (`spell-diag-stride` … `spell-adj-fold`) stay G≥11 extras until Wave 13 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Long stays `ENEMY_ONLY` on `long_precentor`. Adj Fold stays `BOSS_ONLY` on `adj_fold_regent`.

### 12.3 Wave-12 tactical CORE (deferred — #787)

#787 tactical Wave-12 ids (`spell-cadence-imprint` … `spell-court-imprint`) stay extras until Wave 13 families consume them as CORE. Do **not** put them in Wave-12 family CORE. Extra doors `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` stay #787’s. Court Imprint stays `NOT_PLAYER_LEARNABLE`. **Do not ship** `spell-parched-mend` (Dry Gait owns both leftover-MP=0 heal).

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 13 forever

Same recipe as Wave 11 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 13 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #726 extra doors. Do not restamp #753 extra doors. Do not restamp #787 extra doors. Do not consume #771 primer room ids.

Suggested Wave-13 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-11 §11 verbs (this catalog’s unique ids stay extras until then); consume unique Wave-11 verbs **and** **#787** as Wave-13 family CORE. Bank leftover AP **and** MP is **#726 Dual Keep**. Four-cell occupy is **#636 Quad Span**. Five-cell occupy is **#695 Penta Span**. Seven-cell occupy is **#726 Sept Span**. Six-cell occupy is **#787 Six Span**. Both-force heal is **#726 Heave Mend**. Both leftover-AP=0 heal is #747 Dry Mend. Both leftover-MP=0 heal is this wave’s Dry Gait (**not** #787 Parched Mend). Cadence Imprint is **#787**. Reach Fold stays `BOSS_ONLY` on `reach_fold_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / **#726** / **#747** / **#752** / **#753** / **#787** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W12-A. G≥12 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W12-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W12-C. Wave-12 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #679 / #726 / #747 / **#787** / memory Wave-5 ids |
| W12-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `diag_gallery` / `crack_nave` / `reach_nave` / #771 primer rooms |
| W12-E. Brick Reel attract caller | `applyAttract` toward nearest barrier | Damage-math rewrite; RAF; treating dest as `map.portals` |
| W12-F. Brick Orbit solvability skip | `findPath` after a hypothetical orbit | `mapGen.ts`; skipping `finalizePlayableLayout` on generate |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Orth Stride consume, Wake Mark detonate, Gait Plate consume, Glyph Skip consume, and Watch Alms consume read flags at walk / start-of-turn / incoming-hit / overwatch-snap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 11 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W12-1 | Encounter start | Possessed-but-unused G12 id does not observe |
| W12-2 | Orth Stride diagonal dest | Confirm fails; MP not spent; Orth Stride already observed |
| W12-3 | `orth_gallery` defeat | Does not grant. Victory grants once |
| W12-4 | `diag_gallery` / `inch_gallery` / `pair_gallery` / `must-step` | Do not grant Orth Stride |
| W12-5 | Tri Oath then Frost at Chebyshev 1, 2, or 4 | Confirm fails; Strike still legal |
| W12-6 | Brick Reel no barrier | Fizzle observes; no pull. Dest is not `map.portals` |
| W12-7 | Lone Bite with any neighbor | 10 only. Lone Sting would ignore allies. Foe Bite would need an adjacent hostile |
| W12-8 | Wake Mark enter-and-leave before turn start | No detonate. Ingress would detonate on enter. Dwell would detonate on end turn |
| W12-9 | Gait Plate hit while leftover MP = 0 | Full hit; charge remains. Hit while leftover MP ≥ 1 consumes |
| W12-10 | Glyph Skip across lava / cinder / length 2 | Hazard / tax still ticks. Skip is glyph-tax + length 1 only |
| W12-11 | Full Gait leftover MP 2 | Fizzle observes; no RES. Full Plate would want leftover AP ≥ 3 |
| W12-12 | Summon Gait vs Summon Toll vs Walk Toll | Pets pay MP to start a walk vs pay AP vs caster walk pool |
| W12-13 | Still Gift after the target walked | Fizzle observes; no heal. Still Mend would want the **caster** unmoved |
| W12-14 | Cadence Grace vs Rest vs Pin vs Trim | Next own spell skips starting CD vs own remaining skip tick vs one hostile frozen vs hostile −1 |
| W12-15 | Cast Debt after they only Struck | Fizzle observes. Debt Mark would still tax. Spent Tax would want them to have walked |
| W12-16 | Brick Orbit would seal the only path | AI skip; if forced, fizzle observes; no tile write |
| W12-17 | Watch Alms vs Watch Lend vs Watch Fee vs Watch Mute | Snap grants walker +1 AP vs watcher +1 vs walker −1 vs snap 0 |
| W12-18 | Pair Gait leftover MP 0, 1, or 3 | 10 only. Pair Purse would bonus leftover **AP** 2 |
| W12-19 | Leash Cut on the summon itself | 10 only. Summon Bane would bonus the pet. Escort Cut would want Chebyshev ≤ 2 |
| W12-20 | Dry Gait after leftover MP ≥ 1 on either | Fizzle observes. Dry Mend would want leftover **AP** = 0. Heave Mend (#726) would want both force-moved. Parched Mend (#787) is **not** shipped |
| W12-21 | Pack Cap / Reach Fold | Never in `ownedSpellIds` |
| W12-22 | Loaner / `WF-SPL-*` / #771 primer | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W12-23 | G=11 Tide | No Orth Stride / Cast Debt (`generationMin: 12`) |
| W12-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W12-25 | No cloned ids | Unique §11 ids absent from #679 / #726 / #747 / **#787** catalogs |
| W12-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Cast Debt / Summon Gait / Pack Cap are flags |
| W12-27 | Hex Toll | Still not in any SDE pool |
| W12-28 | Memory Wave-5 / Wave-11 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W12-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W12-30 | #726 extra doors | `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` not restamped |
| W12-30b | #753 extra doors | `infirm_chanter` / `yoke_subchanter` / `salve_wicker` / `brand_curate` not restamped |
| W12-30c | #787 extra doors | `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` not restamped |
| W12-31 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–11, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, or **#787** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / **#753** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / #679 / #695 / #726 / **#747** / **#753** / **#787** extra doors
- Consuming #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` as spell grants
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `diag_gallery` / `inch_gallery` / `pair_gallery` / `odd_gallery` / `even_gallery` / `crack_nave` / `reach_nave` / `ash_aisle` / `long_gallery` as Orth Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #752 CORE, #686 CORE, Wave-11 #695 CORE, or **#796** CORE
- Cloning #679 (`spell-inch-stride` … `spell-mid-fold`), #726 (`spell-heave-mend` … `spell-court-dual`), #747 (`spell-diag-stride` … `spell-adj-fold`), or #787 (`spell-parched-mend` … `spell-court-imprint`) into unique §11
- Minting `spell-both-heave` / `spell-hept-span` / `spell-vault-keep` / `spell-both-parched` / `spell-hex-span` / `spell-cadence-copy`
- Shipping `spell-parched-mend` alongside Dry Gait

---

## 17. Wave-12 index

**Unique SDE ids (19):** orth-stride, tri-oath, brick-reel, lone-bite, wake-mark, gait-plate, glyph-skip, full-gait, summon-gait, still-gift, cadence-grace, cast-debt, brick-orbit, watch-alms, pair-gait, leash-cut, dry-gait, pack-cap, reach-fold.

**#679 stamps (do not clone; Wave-12 family CORE):** Inch Stride, Rite First, Long Oath, Cinder Reel, Side Bite, Ingress Mark, Off Plate, Spike Skip, Tapped Plate, Summon Brace, Bar Mend, Cadence Pin, Still Tax, Brick Sprout, Watch Fee, Lone Purse, Banner Cut, Pack Close, Mid Fold.

**#726 stamps (do not clone; Wave-12 family CORE):** Heave Mend, Dual Keep, Sept Span, Cadence Halve, Mid Hood, Ready Sting, Heave Step, Drift Sill, Drift Hold, Drift Lend, Drift Sip, Drift Post, Heave Bounce, Must Drift, Verse Pace, Court Dual.

**#787 stamps (do not clone; Wave 13 family CORE):** Cadence Imprint, Six Span, Odd Hood, Lean Sting, Parched Step, Parched Sill, Dry Hold, Lean Lend, Parched Sip, Lean Post, Parched Bounce, Must Lean, Verse Lean, Lean Hold, Court Imprint. **Do not ship** Parched Mend (Dry Gait owns both leftover-MP=0 heal).

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-orth-stride` | ENEMY_DISCOVERY | yes | blink / reaver G≥12 | **One** next walk must be orthogonal |
| `spell-tri-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 3 |
| `spell-brick-reel` | ENEMY_DISCOVERY | yes | stone / rime | Pull 1 toward nearest barrier |
| `spell-lone-bite` | ENEMY_DISCOVERY | yes | reaver / blink | Bonus if isolated from **all** units |
| `spell-wake-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates if they **start their turn** on it |
| `spell-gait-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit is 0 while leftover MP ≥ 1 |
| `spell-glyph-skip` | ENEMY_DISCOVERY | yes | glyph / ley | 1-tile walk ignores glyph-tax |
| `spell-full-gait` | ENEMY_DISCOVERY | yes | plate / golem | Leftover MP ≥ 3 → +RES |
| `spell-summon-gait` | ELITE | yes | brood_chanter | Allied summons pay +1 MP to start a walk |
| `spell-still-gift` | ELITE | yes | pale / font cantor | Heal iff **target** spent 0 walk MP |
| `spell-cadence-grace` | ENEMY_DISCOVERY | yes | cadence / hex | Next own spell does not start its cooldown |
| `spell-cast-debt` | ENEMY_DISCOVERY | yes | tax / ley | Next walk +1 AP if they **spelled** last turn |
| `spell-brick-orbit` | ENEMY_DISCOVERY | yes | stone / rime | Move one adjacent barrier to another adjacent empty cell |
| `spell-watch-alms` | ELITE | yes | glass / hood | Overwatch snap grants the **walker** +1 AP |
| `spell-pair-gait` | ELITE | yes | purse / scribe | Bonus if leftover MP **exactly 2** |
| `spell-leash-cut` | ELITE | yes | null / leash | Bonus if target shares an axis with a pet |
| `spell-dry-gait` | ENEMY_DISCOVERY | yes | cantor / coil | Heal iff **both leftover MP = 0** |
| `spell-pack-cap` | ENEMY_ONLY | no | `cap_precentor` CHAMPION | Pack next-spell maxRange 2 |
| `spell-reach-fold` | BOSS_ONLY | no | `reach_fold_regent` | Swap two player-side bodies at Chebyshev **exactly 2** |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-11 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #679 so Inch Stride / Long Oath / Cinder Reel land once as Wave-12 family CORE. Coordinate with #726 so Heave Mend / Dual Keep / Sept Span land once as Wave-12 family CORE. Coordinate with #787 so Cadence Imprint / Six Span / Odd Hood land once as Wave-13 family CORE, and so Parched Mend is **not** shipped beside Dry Gait. Not a license to land combat code in the same change as this spec.
