# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 13

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-21  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–12 are Generations 3–12. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Waves 6–12 are still-open #480 / #533 / #590 / #646 / #679 / #747 / #802. This document is **Generation 13**. `generationMin: 13`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

**Gap note.** The last SDE wave PR is #802 (2026-09-29). No intervening SDE PRs exist through 2026-10-20. This pass does **not** skip generations and does **not** mint Waves 14–34. It is the next sequential generation.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-21.md`](./ACTION_IDS_SDE_2026-10-21.md).

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
| Wave-6…10 discovery contracts | still-open #480 / #533 / #590 / #646 / #679 | G≥6…10 extra slots and those unique catalogs |
| Wave-11 discovery contract | still-open #747 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-28.md` | G≥11 extra slot, W11 unique ids. **Stamp onto Wave-13 family CORE, do not clone** |
| Wave-12 discovery contract | still-open #802 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md` | G≥12 extra slot, W12 unique ids, #679 / #726 / #787 stamps. Unique §11 stay extras until Wave 14 |
| Wave-1…12 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-29.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 / #729 / #791 / **#815** | `ownedSpellIds` / `observedSpellIds`, soft-retire. Same-day #815 is a dated admin re-audit — **not** a tactical catalog |
| Tactical gap-fillers W1…W11 | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 | Reserved in §0.1 |
| Tactical gap-fillers W12 | still-open **#787** — `SPELL_PROPOSALS_2026-09-29.md` | Parched Mend … Court Imprint. **Stamp onto Wave-13 family CORE, do not clone**. Extra doors `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` — do not restamp. **SDE already won** both leftover-MP=0 heal: #802 Dry Gait; do **not** ship Parched Mend |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + #686 + #752 + **#796** | #796 Wave-12 families consume unique **#679** Wave-10 verbs **and** **#726**. Wave-13 families consume unique **#747** Wave-11 verbs **and** **#787**. Do **not** put unique §11 ids in either CORE |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / **#808** | Extra doors claimed through Wave 13 (`flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor`). Do not restamp |
| Same-day encounter primer | #771 — Bash/Dry/Hood catalog | Room ids `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`. Not a spell catalog. Do not consume |
| Same-day encounter catalog | still-open **#826** — `ENCOUNTER_EVOLUTION_2026-10-21.md` | Room ids `ENC-TEACH-13` / `ENC-HAZ-25` / `ENC-SPELL-25` / `ENC-SPELL-26` / `ENC-BOTH-01` / `ENC-NEAR-01` / `ENC-DAMP-01` and the rest of that day’s ENC-* table. Not a spell catalog. Do not consume |
| PX coherence | #343 / #393 / #481 / #579 / #632 / #744 / #784 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-13 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

At audit start (2026-10-21 00:03 UTC) no `SPELL_PROPOSALS_2026-10-21.md` existed. Same-day **#815** is admin, not tactical. If a Wave-13 tactical catalog opens during this run, **stamp it** as Wave **14** family CORE and do not clone its ids into unique §11.

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

**#787 tactical Wave 12:** `spell-parched-mend`, `spell-cadence-imprint`, `spell-six-span`, `spell-odd-hood`, `spell-lean-sting`, `spell-parched-step`, `spell-parched-sill`, `spell-dry-hold`, `spell-lean-lend`, `spell-parched-sip`, `spell-lean-post`, `spell-parched-bounce`, `spell-must-lean`, `spell-verse-lean`, `spell-lean-hold`, `spell-court-imprint`.

**Wave 12 SDE (#802):** `spell-orth-stride`, `spell-tri-oath`, `spell-brick-reel`, `spell-lone-bite`, `spell-wake-mark`, `spell-gait-plate`, `spell-glyph-skip`, `spell-full-gait`, `spell-summon-gait`, `spell-still-gift`, `spell-cadence-grace`, `spell-cast-debt`, `spell-brick-orbit`, `spell-watch-alms`, `spell-pair-gait`, `spell-leash-cut`, `spell-dry-gait`, `spell-pack-cap`, `spell-reach-fold`.

**Do not alias** `spell-knight-stride` ↔ `spell-diag-stride` / `spell-orth-stride` / `spell-inch-stride` / `spell-knight-pierce` / `spell-knight-slip` / `spell-must-step` / `spell-diag-lock`, `spell-quad-oath` ↔ `spell-tri-oath` / `spell-mid-oath` / `spell-long-oath` / `spell-quad-span` / `spell-odd-hood`, `spell-pit-reel` ↔ `spell-brick-reel` / `spell-cinder-reel` / `spell-void-reel` / `spell-open-pit` / `spell-pit-skip` / `spell-pit-sight`, `spell-axis-bite` ↔ `spell-foe-bite` / `spell-side-bite` / `spell-leash-cut` / `spell-axis-veil` / `spell-lone-bite`, `spell-shove-mark` ↔ `spell-ingress-mark` / `spell-dwell-mark` / `spell-wake-mark` / `spell-stride-mark` / `spell-drift-post` / `spell-shove-mend`, `spell-spent-plate` ↔ `spell-gait-plate` / `spell-own-plate` / `spell-off-plate` / `spell-spent-tax` / `spell-spent-stride`, `spell-rime-skip` ↔ `spell-glyph-skip` / `spell-cinder-skip` / `spell-lava-skip` / `spell-rime-sheet` / `spell-gap-ward`, `spell-full-sting` ↔ `spell-full-plate` / `spell-full-gait` / `spell-lone-sting` / `spell-dry-sting` / `spell-lean-sting` / `spell-ready-sting`, `spell-summon-cast` ↔ `spell-summon-toll` / `spell-summon-gait` / `spell-summon-bane` / `spell-kennel-lock`, `spell-hollow-gift` ↔ `spell-dry-mend` / `spell-dry-gait` / `spell-still-gift` / `spell-still-mend` / `spell-parched-mend` / `spell-gift-sill`, `spell-cadence-swap` ↔ `spell-cadence-imprint` / `spell-cadence-halve` / `spell-cadence-grace` / `spell-cadence-rest` / `spell-pawn-trade` / `spell-pet-swap`, `spell-strike-debt` ↔ `spell-spent-tax` / `spell-cast-debt` / `spell-debt-mark` / `spell-strike-hold` / `spell-walk-toll`, `spell-brick-nudge` ↔ `spell-brick-orbit` / `spell-brick-shift` / `spell-brick-crack` / `spell-brick-sprout` / `spell-brick-wipe`, `spell-watch-sip` ↔ `spell-watch-alms` / `spell-watch-lend` / `spell-watch-fee` / `spell-watch-mute` / `spell-soul-sip` / `spell-ap-sip` / `spell-parched-sip` / `spell-drift-sip`, `spell-lone-gait` ↔ `spell-pair-gait` / `spell-lone-purse` / `spell-lone-bite` / `spell-full-gait`, `spell-hazard-cut` ↔ `spell-leash-cut` / `spell-escort-cut` / `spell-banner-cut` / `spell-crown-cut` / `spell-pet-cut`, `spell-drift-gift` ↔ `spell-heave-mend` / `spell-drift-lend` / `spell-still-gift` / `spell-hollow-gift`, `spell-pack-file` ↔ `spell-pack-long` / `spell-pack-cap` / `spell-pack-close` / `spell-rank-lock` / `spell-file-fold` / `spell-file-slide`, `spell-diag-fold` ↔ `spell-adj-fold` / `spell-reach-fold` / `spell-mid-fold` / `spell-knight-fold` / `spell-diag-stride`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Unique Wave-11 CORE (#747 — stamp onto Wave-13 family CORE, do not clone)

#747 **owns** the G≥11 unique SDE holes. Wave 12 already recorded them as extras. This document **consumes #747 as Wave-13 family CORE** (together with #787) and does **not** re-author those cards.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-diag-stride` | MULTI_SOURCE | **One** next walk `|dx|==|dy|`. Distinct from Knight Stride ((2,1) only) and Orth Stride (orthogonal) |
| `spell-mid-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 2. Distinct from Quad Oath (**exactly** 4) |
| `spell-void-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **void/portal**. Distinct from Pit Reel (nearest **pit**) |
| `spell-foe-bite` | ENEMY_DISCOVERY | Bonus if adjacent **hostile**. Distinct from Axis Bite (shares rank/file with **caster**) |
| `spell-dwell-mark` | ENEMY_DISCOVERY | Cell detonates on **end-turn occupy**. Distinct from Shove Mark (**force-move landing**) |
| `spell-own-plate` | ENEMY_DISCOVERY | Next hit on **your turn** is 0. Distinct from Spent Plate (leftover **AP** ≥ 1) |
| `spell-cinder-skip` | ENEMY_DISCOVERY | 1-tile walk ignores cinder. Distinct from Rime Skip (rime **leave-tax**) |
| `spell-full-plate` | ENEMY_DISCOVERY | Leftover AP ≥ 3 → **+RES**. Distinct from Full Sting (leftover AP ≥ 3 → **damage**) |
| `spell-summon-toll` | ELITE | Allied summons pay +1 AP to start a **walk**. Distinct from Summon Cast (+1 AP to start a **spell**) |
| `spell-still-mend` | ELITE | Heal iff **caster** spent 0 walk MP. Distinct from Hollow Gift (target both pools 0) |
| `spell-cadence-rest` | ENEMY_DISCOVERY | Own remaining CDs do not tick. Distinct from Cadence Swap (swap remaining CDs with the **target**) |
| `spell-spent-tax` | ENEMY_DISCOVERY | Next **spell** +1 AP if they **walked** last turn. Distinct from Strike Debt (next **walk** +1 AP if they **Struck**) |
| `spell-brick-crack` | ENEMY_DISCOVERY | **Remove** one adjacent barrier. Distinct from Brick Nudge (**push** it 1 away) |
| `spell-watch-lend` | ELITE | Overwatch snap grants **watcher** +1 AP. Distinct from Watch Sip (**steal** 1 leftover AP from walker) |
| `spell-pair-purse` | ELITE | Bonus if leftover AP **exactly 2**. Distinct from Full Sting (leftover AP **≥ 3**) |
| `spell-escort-cut` | ELITE | Bonus if target has a pet in 2. Distinct from Hazard Cut (target stands on a **painted hazard**) |
| `spell-dry-mend` | ENEMY_DISCOVERY | Heal iff **both leftover AP = 0**. Distinct from Hollow Gift (one target, **both** leftover AP **and** MP = 0) |
| `spell-pack-long` | ENEMY_ONLY | Pack next-spell **minRange 3**. Distinct from Pack File (allies walk on the champion **file**). Never owned |
| `spell-adj-fold` | BOSS_ONLY | Swap two **adjacent** player-side bodies. Distinct from Diag Fold (`|dx|==|dy|`). Never owned |

`diag_gallery` is **not** Knight Stride’s door. `mid_nave` is **not** Quad Oath’s door. `void_aisle` is **not** Pit Reel’s door. `dwell_pulpit` is **not** Shove Mark’s door. `crack_nave` is **not** Brick Nudge’s door. `long_precentor` is **not** `file_precentor`. `adj_fold_regent` is **not** `diag_fold_regent`.

### 0.2b Tactical Wave 12 (#787 — stamp onto Wave-13 family CORE, do not clone)

#787 **owns** the G≥12 tactical holes **except** both leftover-MP=0 heal. #802 unique §11 `spell-dry-gait` **already won** that hole. Do **not** also ship `spell-parched-mend`. Stamp the other #787 ids as Wave **13** family CORE. Extra doors `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` — do not restamp. Do **not** mint `spell-hex-span` / `spell-cadence-copy` / `spell-long-hood` / `spell-both-parched`.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-parched-mend` | MULTI_SOURCE | **Dropped.** Same hole as #802 Dry Gait. SDE already won. `parched_cantor` is **not** Hollow Gift’s door |
| `spell-cadence-imprint` | MULTI_SOURCE | Copy matching remaining CDs onto the caster; target **keeps**. Distinct from Cadence Swap (the two bars **exchange**) |
| `spell-six-span` | MULTI_SOURCE | Six-cell 2×3 occupy. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-odd-hood` | ELITE | Next hit from **odd** Chebyshev is 0. Distinct from Quad Oath (exact-4 **spell gate**) |
| `spell-lean-sting` | ENEMY_DISCOVERY | Bonus if leftover AP = 0 **and** leftover MP ≥ 1. Distinct from Full Sting (leftover AP **≥ 3**) and Lone Gait (leftover MP **exactly** 1) |
| `spell-parched-step` | ENEMY_DISCOVERY | Caster lands adjacent to a leftover-MP=0 ally |
| `spell-parched-sill` | ENEMY_DISCOVERY | Occupant cannot spend walk MP |
| `spell-dry-hold` | ELITE | Cannot walk until leftover AP = 0. Distinct from Hollow Gift (heal) |
| `spell-lean-lend` | ENEMY_DISCOVERY | +1 MP to an ally whose leftover AP = 0 |
| `spell-parched-sip` | ENEMY_DISCOVERY | Steal 1 leftover MP iff leftover AP = 0. Distinct from Watch Sip (overwatch snap steals leftover **AP**) |
| `spell-lean-post` | MULTI_SOURCE | Summon detonates on end-turn occupy if leftover AP = 0. Distinct from Shove Mark (force-move landing, any leftover) |
| `spell-parched-bounce` | ENEMY_DISCOVERY | Bounce 1 to another leftover-MP=0 hostile |
| `spell-must-lean` | ELITE | Non-Strike spells illegal unless leftover MP = 0 |
| `spell-verse-lean` | ENEMY_DISCOVERY | Last id illegal until leftover MP = 0 |
| `spell-lean-hold` | ENEMY_DISCOVERY | Strike illegal until leftover MP = 0 |
| `spell-court-imprint` | NOT_PLAYER_LEARNABLE | Mass Cadence Imprint. Never owned. Distinct from Diag Fold |

`imprint_precentor` is **not** Cadence Swap’s door. `span_six` is **not** Diag Fold’s door. `court_imprint_regent` is **not** `diag_fold_regent`.

### 0.3 Held holes (still not this pass)

Wave 12 §13 listed these as Wave-13/14 candidates. This wave **does not** fill them in unique §11 except the ones marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Four-cell / five-cell / six-cell / seven-cell / eight-cell occupy | **#636 Quad Span**, **#695 Penta Span**, **#787 Six Span**, **#726 Sept Span**. Eight-cell stays skipped. Live `ENEMY_SUMMON_CAP` is still 2 |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| `jackpot` feat door | #185 Absolve already claimed `jackpot` as a MULTI child. Do not restamp |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Bank leftover AP **and** MP on one id | **#726 Dual Keep owns this hole.** Do not clone |
| Heal if **both force-moved** | **#726 Heave Mend owns this hole.** Unique §11 Drift Gift heals iff **the target** was force-moved |
| Heal if **both leftover AP = 0** | **#747 Dry Mend owns this hole.** |
| Heal if **both leftover MP = 0** | **#802 Dry Gait owns this hole.** Do not ship Parched Mend |
| Heal if **one target leftover AP and leftover MP are both 0** | **Filled this wave** as Hollow Gift (`spell-hollow-gift`) |
| Swap remaining CDs caster ↔ target | **Filled this wave** as Cadence Swap (`spell-cadence-swap`) |
| Dedicated CORE families for unique Wave-11 §11 verbs | **This catalog consumes them** as Wave-13 family CORE (§12.1) |
| Dedicated CORE families for unique Wave-12 §11 verbs | This catalog’s unique §11 ids stay G≥13 extras, not Wave-13 family CORE. Wave 14 families consume unique Wave-12 verbs |
| Facing cards | Still fail closed until a battle `currentView` writer exists. **No new Wave-13 facing cards** |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Fifty days of calendar time after `58302bc`, and twenty-two days after Wave 12, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Hollow Gift / Drift Gift **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-13 unique ids stay `mpCost: 0`. Strike Debt / Summon Cast / Pack File are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Pit Reel is attract-toward-**nearest pit**, a new dest flavor after Cinder Reel (hazard), Void Reel (void/portal), and Brick Reel (barrier) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-13 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Hazard Cut reads **painted hazard occupancy**, never `spell.name` |
| Open PR queue | #327+, then 2026-09-21…29 docs, then same-day **#814** / **#815**. **#371 owns Wave-4 SDE. #747 owns Wave-11 SDE. #787 owns Wave-12 tactical. #802 owns Wave-12 SDE. #808 owns Wave-13 extra boss doors. #815 owns same-day admin.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-12 P0 remain the prerequisite. **Do not land Wave-13 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 13 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥13 rares make it sharper: a CHAMPION may hold the generation-13 verb until a (2,1) landing / pit cell / leftover AP ≥ 3 is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 13 fills holes Waves 1–12, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, and **#802** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Diag Stride, Knight Pierce, Mid Oath, Spent Tax, Full Plate, Pack Long, Adj Fold, Dry Mend, Dry Gait, Parched Mend, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 13 stamps `generationMin: 13`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Strike Debt **adds 1 AP** to the next **walk** if they Struck last turn. Summon Cast taxes **allied summons** 1 AP to start a spell. Pack File locks **walk file**. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 13 unique ids do **not** require `currentView`.
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

Wave-13 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| `spell-knight-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Later **walk** that pays the (2,1) gate | **No** — do not double-observe |
| `spell-shove-mark` **paint** (AP spent) | **Yes** |
| Later **force-move landing** detonate | **No** |
| `spell-spent-plate` **arm** | **Yes** |
| Later **negated hit** while leftover AP ≥ 1 | **No** |
| `spell-pit-reel` no pit (fizzle after AP) | **Yes** — AP was spent (Wave 2 fizzle rule) |
| `spell-pit-reel` illegal because AI skipped (no AP) | **No** |
| `spell-rime-skip` **arm** | **Yes** |
| Later 1-tile walk across a rime cell | **No** |
| `spell-cadence-swap` **resolve** (even if one bar was empty) | **Yes** if AP was spent |
| `spell-pack-file` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-diag-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orbs / `WF-SPL-*` / #771 primer rooms | **Never** write `ownedSpellIds` |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 13 stamps unused **rooms**, not new enum members and not leftover feat doors.

| Source | Wave-13 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥13 family verbs in §11 **plus** #747 / #787 stamps in §0.2 / §0.2b / §12 |
| `ELITE` | Summon Cast, Hollow Gift, Watch Sip, Lone Gait, Hazard Cut |
| `ACHIEVEMENT` | **None.** Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master` |
| `CHALLENGE` | **None.** All nine challenge ids remain claimed through Wave 7 |
| `BOSS` | **None.** Diag Fold is `BOSS_ONLY` (never owned) |
| `SPECIAL_ENCOUNTER` | `knight_gallery` / `quad_nave` / `pit_aisle` / `shunt_pulpit` / `nudge_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | None new. #747 Diag Stride / #787 Cadence Imprint keep their existing children |
| `ENEMY_ONLY` | Pack File (never owned) |
| `BOSS_ONLY` | Diag Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-13 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every door listed in Wave 12 §4.1, plus:

| Door | Owner |
| :--- | :--- |
| `orth_gallery` / `tri_nave` / `brick_aisle` / `wake_pulpit` / `orbit_nave` | Wave 12 SDE (#802) |
| `cap_precentor` / `reach_fold_regent` | Wave 12 SDE Pack Cap / Reach Fold |
| `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` | #787 |
| `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` | #808 |
| `heave_cantor` / `dual_bursar` / `span_sept` / `halve_precentor` / `court_dual_regent` | #726 |
| `diag_gallery` / `mid_nave` / `void_aisle` / `dwell_pulpit` / `crack_nave` | Wave 11 SDE (#747) |
| `long_precentor` / `adj_fold_regent` | Wave 11 SDE Pack Long / Adj Fold |
| `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` | #771 encounter primer |
| `ENC-TEACH-13` / `ENC-HAZ-25` / `ENC-SPELL-25` / `ENC-SPELL-26` / `ENC-BOTH-01` / `ENC-NEAR-01` / `ENC-DAMP-01` / other 2026-10-21 ENC-* | #826 encounter catalog |

### 4.2 Leftover doors (not this pass)

`survivor` only. Economy feats stay Doka-only. `unstoppable` stays unused forever as a spell gate. `jackpot` stays #185 Absolve. Do not restamp `leader_slayer` / `spell_master`.

---

## 5. Spell pool evolution — Generation 13 (never a last tier)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 13 adds the **G≥13 extra slot**.

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
| 3–12 | Prior extra slots from Waves 3–12. Do not retire them |
| 13 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 13` |
| 14+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-12 G12 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **13** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation — extends Wave 12 §5.1)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
     Wave-13 attached families: #747 unique Wave-11 verbs + #787 tactical Wave-12 ids
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3–12. prior extra slots from Waves 2–12
  13. if G ≥ 13: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
      (skip if no legal id; this is the Generation 13 verb)
  14. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  15. drop any id whose AI_REQUIREMENTS are unmet
  16. keep ENEMY_ONLY on enemies (they cast; they never grant)
  17. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 6. New `aiHint` keys (metadata, not names)

Wave 1 §9.1 through Wave 12 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_knight_only` | flanker, kiter | A legal (2,1) dest exists this turn or next; skip if only orthogonal/diagonal dests remain and Strike is better |
| `next_spell_exact_chebyshev_4` | caster, kiter | Caster can reach Chebyshev 4 before the next spell, or already sits at 4; skip if they must stay at 1–3 (use Strike / Tri Oath / Mid Oath) |
| `attract_toward_nearest_pit` | caster, controller | A pit cell exists in Chebyshev ≤ 4 of the target; skip if none, or if the 1-step would land on a world portal |
| `bonus_if_share_axis_with_caster` | flanker, caster | Target shares rank **or** file with the caster; skip if off-axis (use Foe Bite / Lone Bite) |
| `detonate_if_force_moved_onto` | caster, controller | Paint the cell a shove / pull / swap / slide is likely to **land** on; skip if the player will walk there (use Ingress) or camp (use Dwell / Wake) |
| `negate_hit_if_leftover_ap_ge_1` | guardian, charger | Caster can keep leftover AP ≥ 1 through the next incoming hit; skip if they must spend that AP to Strike |
| `skip_rime_leave_tax_one_tile` | flanker, charger | Next intended walk is length 1 **off** a rime cell; skip if the path is glyph-tax / lava / length ≥ 2 |
| `bonus_if_leftover_ap_ge_3` | caster, berserker | Caster leftover AP ≥ 3 at resolve **or** they can finish the turn that way; skip if leftover AP ≤ 2 (use Pair Purse / Lean Sting) |
| `summon_spell_ap_tax` | summoner, guardian | ≥ 1 living allied summon that intends a non-Strike spell; skip if none, or if they will only walk (use Summon Toll) |
| `heal_if_target_both_pools_zero` | healer | Target leftover AP **= 0** and leftover MP **= 0** and missing HP ≥ 8; skip if either leftover ≥ 1. **Healer CORE only** |
| `swap_remaining_cooldowns` | caster, controller | Target has ≥ 1 remaining CD **and** the swap improves the caster’s next tool; skip if both bars are empty |
| `tax_next_walk_if_struck_last_turn` | caster, controller | Target resolved `physical_attack` last turn and no other spell; skip if they spelled (use Cast Debt) or walked (use Spent Tax) |
| `nudge_adjacent_barrier_away` | caster, controller | An adjacent barrier cell exists **and** the away-cell is empty floor; the move must not seal the only player↔exit path (`findPath` after a hypothetical nudge); skip if it would |
| `overwatch_snap_steal_walker_ap` | kiter, caster | Caster already has or will arm an overwatch this turn **and** the likely walker has leftover AP ≥ 1; skip if no snap is likely |
| `bonus_if_leftover_mp_eq_1` | caster, kiter | Target leftover MP is exactly 1; skip if 0, 2, or ≥ 3 (use Dry Sting / Pair Gait / Full Gait) |
| `bonus_if_target_on_hazard` | caster, controller | Target occupies a painted hazard (cinder / rime / mire / glyph-tax / fuse / pit); skip if they stand on plain floor |
| `heal_if_target_force_moved` | healer | Target `movedThisTurn` from push/pull/swap/slide/gate (not a voluntary walk) and missing HP ≥ 8; skip if they only walked. **Healer CORE only** |
| `pack_walk_share_champion_file` | buffer | CHAMPION only; skip if aura up or no ally in 2 |
| `fold_two_player_side_diagonal` | **boss AI only** | Exactly two living player-side bodies with `|dx|==|dy|` and both deltas ≠ 0; skip if 0–1 or they share a rank/file |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: Doka credit `WorldExploration.tsx` 1502–1504, jackpot `WorldExploration.tsx` 18448.
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Shove Mark / Spent Plate / Rime Skip / Watch Sip may add a **battle-log line** when the detonate / negate / skip / steal fires — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 13 adds **no** new canister methods.

| Writer | Wave-13 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | Not used for a new feat/challenge door this wave. #747 / #787 MULTI children stay those catalogs’ |

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
- Hollow Gift / Drift Gift HP gain uses existing healUsed only when player-side HP actually increased. Forced-move onto lava/spikes uses existing hazard helpers (`recordInBattleChallengeDamage` only while `inBattleRef` if treated as environmental).

---

## 9. Special encounters (Wave 13)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `knight_gallery` | Blink Cutter / Rust Reaver with a legal (2,1) landing | `spell-knight-stride` via observe+win |
| `quad_nave` | Glass Sniper at Chebyshev 4 down a file | `spell-quad-oath` via observe+win |
| `pit_aisle` | Tide Shade beside one existing Open Pit cell (not a world portal) | `spell-pit-reel` via observe+win |
| `shunt_pulpit` | Glyph Sower plus one shove tool in the kit | `spell-shove-mark` via observe+win |
| `nudge_nave` | Stone Castellan beside one existing barrier | `spell-brick-nudge` via observe+win |

Wave-12 `orth_gallery` / `tri_nave` / `brick_aisle` / `wake_pulpit` / `orbit_nave` and Wave-4 `pit_gallery` are not re-specified. `pit_aisle` teaches **Pit Reel**, not Pit Sight.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–12 plus the tactical siblings already cover: push, pull-to-caster / hazard / void / barrier, blink, root, range buff and cut, absorb, evade, cone, distance poke, knight **damage** poke, orthogonal / diagonal / inch / pair / even / odd **walk** gates, exact-2 / exact-3 spell gates, enter / leave / end-turn / start-turn paints, leftover-MP plates, leftover-AP RES, summon walk AP tax, summon walk MP tax, both-leftover-AP heal, both-leftover-MP heal, both-force heal, CD skip / freeze / copy / halve, next-walk tax if they spelled, next-spell tax if they walked, barrier grow / crack / orbit / shift, overwatch grant / fee / mute, pack minRange 3 / maxRange 1 / maxRange 2, adjacent / exact-2 / axis folds.

**Still open (Wave 13 SDE unique ids).**

| Hole | Wave-13 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk must be (2,1) | `spell-knight-stride` | Knight Pierce is a **damage** poke. Diag Stride is `|dx|==|dy|`. Orth Stride is cardinal. Knight Slip is a relocate |
| Exact-4 spell gate | `spell-quad-oath` | Tri Oath is 3. Long Oath is **≥ 3**. Mid Oath is 2. Quad Span is occupy |
| Pull toward nearest pit | `spell-pit-reel` | Brick Reel is barrier. Cinder Reel is hazard. Void Reel is void/portal. Open Pit **paints** the pit |
| Bonus if share axis with caster | `spell-axis-bite` | Foe Bite is adjacent hostile. Leash Cut is axis with a **pet**. Side Bite is adjacent ally |
| Detonate on force-move landing | `spell-shove-mark` | Ingress is walk enter. Dwell is end-turn. Wake is start-turn. Drift Post is a **summon** |
| Negate hit while leftover AP ≥ 1 | `spell-spent-plate` | Gait Plate is leftover **MP** ≥ 1. Own Plate is “on your turn.” Off Plate is off-turn |
| 1-tile walk ignores rime leave-tax | `spell-rime-skip` | Glyph Skip is glyph-tax. Cinder Skip is burn. Gap Ward is overwatch |
| Leftover AP ≥ 3 → damage | `spell-full-sting` | Full Plate is leftover AP ≥ 3 → **RES**. Pair Purse is leftover AP **exactly 2** |
| Allied summons pay +1 AP to **spell** | `spell-summon-cast` | Summon Toll taxes **walk**. Summon Gait taxes walk **MP** |
| Heal iff target leftover AP **and** MP are 0 | `spell-hollow-gift` | Dry Mend is both **units** leftover AP=0. Dry Gait is both units leftover MP=0. Parched Mend is **not** shipped |
| Swap remaining CDs caster ↔ target | `spell-cadence-swap` | Cadence Imprint **copies** onto the caster; target keeps. Cadence Halve floor-divides one bar |
| Next walk +1 AP if they **Struck** | `spell-strike-debt` | Spent Tax taxes the next **spell** after a walk. Cast Debt taxes the next **walk** after a spell |
| Push an adjacent barrier 1 away | `spell-brick-nudge` | Brick Orbit moves to another **adjacent** empty. Brick Crack **deletes**. Brick Shift relocates 1 |
| Overwatch snap steals walker leftover AP | `spell-watch-sip` | Watch Alms **grants** the walker +1. Watch Fee **debits** without transfer. Watch Lend pays the **watcher** |
| Bonus if leftover MP exactly 1 | `spell-lone-gait` | Pair Gait is leftover MP **exactly 2**. Lone Purse is leftover **AP** exactly 1 |
| Bonus if target stands on a painted hazard | `spell-hazard-cut` | Banner Cut is `isLeader`. Escort Cut is pet in 2. Leash Cut is axis with a pet |
| Heal iff **target** was force-moved | `spell-drift-gift` | Heave Mend requires **both** caster and target force-moved |
| Pack walk-file lock | `spell-pack-file` | Pack Long is minRange 3. Rank Lock is a **unit** walk-axis brand. Never owned |
| Fold two player-side on a diagonal | `spell-diag-fold` | Adj Fold is Chebyshev 1. Reach Fold is Chebyshev 2. Mid Fold is shared rank/file. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 13)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–12, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, or **#787**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll.

### 11.1 New `effectParams` keys (Wave 13 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables.

```text
knightStrideNextWalk,          // true → next walk dest must be (2,1)
nextSpellExactChebyshev,       // 4
attractTowardNearestPit,       // true
bonusIfShareAxisWithCaster,    // damage rider
detonateIfForceMovedOnto,      // paint
negateHitIfLeftoverApGe1,
skipRimeLeaveTaxOneTile,
bonusIfLeftoverApGe3,
summonSpellApTax,
healIfTargetBothPoolsZero,
swapRemainingCooldowns,
taxNextWalkIfStruckLastTurn,
nudgeAdjacentBarrierAway,
overwatchSnapStealWalkerAp,
bonusIfLeftoverMpEq1,
bonusIfTargetOnHazard,
healIfTargetForceMoved,
packWalkShareChampionFile,
foldTwoPlayerSideDiagonal
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration`, `attractDistance`, `pushDistance`.

---

### SPELL_ID: `spell-knight-stride`

NAME: Knight Stride  
ROLE: POSITION — one next walk must be (2,1)  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rust_reaver`; `G ≥ 13` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rust_reaver`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥13. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Arm 1 turn. The caster’s **next walk** this battle (or this turn, whichever first) is legal **only** if the dest is a chess knight-jump from the current cell (`effectParams: {"knightStrideNextWalk":true}` — must be (2,1) or (1,2); Chebyshev 2 on a diagonal is **illegal**). Forced movement does **not** pay the gate. Distinct from Knight Pierce (damage poke through walls), Diag Stride (`|dx|==|dy|`), Orth Stride (cardinal), Inch Stride (Chebyshev ≤ 1), Must Step (all remaining Chebyshev 1). If they do not walk before expiry, the arm falls unused.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_knight_only"`. Flanker / kiter. Skip if no legal (2,1) dest exists. **Do not** assign to chargers who only walk orthogonal.  
PLAYER_COUNTERPLAY: Occupy every (2,1); Root before they walk; force them onto a map edge  
SYNERGIES: Knight Pierce after they land; Phase Slip is a different tool — do not merge the keys  
BALANCE_RISK: (2,1) through a choke is a wall-jump. **One** next walk, CD 2, G≥13. Fail closed (walk confirm rejects), never become Strike.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. The later walk does not second-observe. Standard observe → same-encounter win. No Doka.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-quad-oath`

NAME: Quad Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 4  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `pale_cantor`; `G ≥ 13`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn. The caster’s next **spell** (not Strike / `physical_attack`) is illegal unless the target tile is Chebyshev **exactly 4** from the caster (`effectParams: {"nextSpellExactChebyshev":4}`). Confirm fails closed. Distinct from Tri Oath (exactly 3), Mid Oath (exactly 2), Long Oath (≥ 3), Odd Hood (incoming miss on odd Chebyshev).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_4"`. Caster / kiter. Arm only if they can sit at 4 before the nuke. Skip if they must stay at 1–3.  
PLAYER_COUNTERPLAY: Walk to 3 or 5; Root them at 2; force Strike  
SYNERGIES: Far Sting at 5 is **illegal** under the oath (exact 4 only); Paper Wind can shove them off 4  
BALANCE_RISK: Exact-4 + Far Sting would be a prison if allowed — the oath **blocks** range 5. 2 AP, CD 2.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Failed later confirm does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pit-reel`

NAME: Pit Reel  
ROLE: POSITION — pull 1 toward nearest pit  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `glyph_sower`; `G ≥ 13`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tide_shade`, `glyph_sower`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. `applyAttract` 1 tile toward the nearest **pit** cell (`effectParams: {"attractTowardNearestPit":true,"attractDistance":1}`). Pit = occupancy `pitTiles` from Open Pit / Pit Wick, **not** `map.portals`, **not** void, **not** barrier. If no pit exists in Chebyshev ≤ 6 of the target, fizzle (AP spent). Distinct from Brick Reel (barrier), Cinder Reel (hazard), Void Reel (void/portal), Hook Line (toward caster).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_pit"`. Caster / controller. Skip if no pit, or if the 1-step would land on a world portal / seal the only exit.  
PLAYER_COUNTERPLAY: Fill the pit (Barrier last-writer); stand so the 1-step is blocked; blink  
SYNERGIES: Open Pit / Pit Wick first; File Lance after they share a file with the hole  
BALANCE_RISK: Pull onto a pit they cannot enter (pit is not `isCellFree`) stops short — they stop on the last free cell. Do not dump them into a world portal.  
PERSISTENCE_REQUIREMENTS: Fizzle after AP still observes. Dest is never `map.portals`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-axis-bite`

NAME: Axis Bite  
ROLE: DAMAGE — bonus if they share rank or file with you  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rust_reaver`; `G ≥ 13`; `aiProfile` flanker/caster  
ENEMY_FAMILIES: `blink_cutter`, `rust_reaver`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target shares rank **or** file with the caster, deal an extra 10 as a **second** existing `dealDamage` call (`effectParams: {"bonusIfShareAxisWithCaster":10}`). Distinct from Foe Bite (adjacent hostile), Side Bite (adjacent ally), Lone Bite (isolated from all), Leash Cut (axis with a **pet**).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_axis_with_caster"`. Flanker / caster. Skip if off-axis and Strike is better.  
PLAYER_COUNTERPLAY: Stand off-axis; occupy the file with a summon decoy  
SYNERGIES: File Slide / File Lance after they line up; Rank Lock  
BALANCE_RISK: 20 on-axis is Frost-adjacent on 2 AP CD 1. G≥13 + LoS. Do not also apply Foe Bite’s rider.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-axis 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-shove-mark`

NAME: Shove Mark  
ROLE: TERRAIN — detonate on force-move landing  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `bone_scribe`; `G ≥ 13`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. The next unit that **lands** on it by push, pull, swap, slide, or gate teleport takes 12 (spell, RES+SR) and the paint consumes (`effectParams: {"detonateIfForceMovedOnto":true,"shoveMarkDamage":12}`). Voluntary **walk** enter does **not** detonate (that is Ingress Mark). End-turn occupy does **not** (Dwell). Start-of-turn occupy does **not** (Wake).  
SCALING: damage follows dmg%; trigger fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_force_moved_onto"`. Caster / controller. Paint the cell a Shoulder Bash / File Slide / Pit Reel / Pawn Trade will land on. Skip if no shove tool is in kit **and** no ally will shove.  
PLAYER_COUNTERPLAY: Walk onto it (safe); occupy so the shove stops short; blink  
SYNERGIES: Shoulder Bash / File Slide / Board Tilt / Pawn Trade set `movedThisTurn` **and** land  
BALANCE_RISK: Shove + 12 is a combo, not a trap for walkers. Consume-on-first-body, CD 2.  
PERSISTENCE_REQUIREMENTS: Observe on **paint**. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spent-plate`

NAME: Spent Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP ≥ 1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 13`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥13. `generationMin: 13`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn. The next damaging instance against the caster **misses** (0 HP, no absorb chew) **if** leftover AP ≥ 1 at the moment of the hit (`effectParams: {"negateHitIfLeftoverApGe1":true}`). If leftover AP is 0, the hit lands and the charge **remains**. Distinct from Gait Plate (leftover **MP** ≥ 1), Own Plate (your-turn window), Off Plate (off-turn), Sidestep Ward (unconditional consume). Do **not** read `CharacterStats.evasion`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_ge_1"`. Guardian. Skip if they must spend the last AP to Strike this turn.  
PLAYER_COUNTERPLAY: Quiet Hex / Drain Courage them to 0 AP; wait out 1 turn; throw a 0-damage tool first (does not consume)  
SYNERGIES: Hold Ground (plant + plate); Last Ward is a different spend  
BALANCE_RISK: Holding 1 AP forever is a prison. 1 hit, 1 turn, CD 2. AoE: first damaging instance only.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Negate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rime-skip`

NAME: Rime Skip  
ROLE: POSITION — 1-tile walk ignores rime leave-tax  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `rime_mason` or `ley_tollkeeper`; `G ≥ 13`; `aiProfile` flanker/charger  
ENEMY_FAMILIES: `rime_mason`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn. The caster’s next **length-1** walk that **leaves** a rime / ice-tax cell does not pay the leave-tax (`effectParams: {"skipRimeLeaveTaxOneTile":true}`). Glyph-tax, lava, cinder, spikes, mire enter-tax, and walks of length ≥ 2 still pay. Distinct from Glyph Skip, Cinder Skip, Lava Skip, Spike Skip, Gap Ward (overwatch).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_rime_leave_tax_one_tile"`. Flanker / charger. Skip if they are not on rime or the intended step is length ≥ 2.  
PLAYER_COUNTERPLAY: Paint mire instead; Debt Mark the step; occupy the only exit  
SYNERGIES: Rime Sheet they painted themselves; Undertow after they leave for free  
BALANCE_RISK: Free leave + Frost −1 MP is still a brick if they need 2 steps. Length 1 only.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. The later skip does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-full-sting`

NAME: Full Sting  
ROLE: DAMAGE — bonus if leftover AP ≥ 3  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 13`; `aiProfile` caster/berserker  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥13. `generationMin: 13`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the caster’s leftover AP **before** this spend is ≥ 3, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApGe3":8}`). After paying 2 AP they may still have ≥ 1. Distinct from Full Plate (same gate → **RES**, no damage rider), Pair Purse (leftover AP **exactly 2**), Ready Sting (leftover AP **and** MP both ≥ 1), Lean Sting (leftover AP = 0 and MP ≥ 1). If leftover AP is 2, only the 10 lands (fizzle rider, AP spent).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_ge_3"`. Caster / berserker. Skip if leftover AP ≤ 2 and Frost is better.  
PLAYER_COUNTERPLAY: Drain Courage / Quiet Hex before they poke; force them to walk-spend AP  
SYNERGIES: Loan Tempo / Dual Keep to hold 3 AP; Spent Plate keeps 1 after the sting  
BALANCE_RISK: 18 at 2 AP is Frost-lite. Gate is leftover ≥ 3 **before** spend, CD 1, G≥13.  
PERSISTENCE_REQUIREMENTS: Leftover AP 2 still observes (10 only).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-cast`

NAME: Summon Cast  
ROLE: SUMMONS — pets pay +1 AP to start a spell  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 13`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 13`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon that starts a **non-Strike spell** pays +1 AP on that attempt (`effectParams: {"summonSpellApTax":1}`). Walks are free of this tax (that is Summon Toll). Strike / `physical_attack` is exempt. Distinct from Summon Toll (walk AP), Summon Gait (walk MP), Kennel Lock (leash), Null Brand (hostile lockout). If a pet cannot pay, the cast rejects (`no_ap`) and the tax **remains**.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_spell_ap_tax"`. Summoner / guardian. Skip if no allied summon, or if pets will only Strike / walk. Do not assign until `summonAI` is explicit (name-fallback still live — **drop this id** if `summonAI` is empty).  
PLAYER_COUNTERPLAY: Kill the Chanter; Quiet Hex the pet so the inflated cost bricks Inferno; Sever Tether  
SYNERGIES: Kennel Lock keeps pets in range; Choir Hymn after they pay  
BALANCE_RISK: +1 AP on two pets is a second Quiet Hex. Elite gate + CD 3 + Strike exempt. Player copy taxes **their** pets — a real downside.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hollow-gift`

NAME: Hollow Gift  
ROLE: SUPPORT — heal iff the target’s leftover AP and leftover MP are both 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 13`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 13`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target may be self. Heal 12 **only if** that target’s leftover AP **= 0** and leftover MP **= 0** at resolve (`effectParams: {"healIfTargetBothPoolsZero":true,"hollowHeal":12}`). If either leftover ≥ 1, fizzle (AP spent, no HP). Distinct from Dry Mend (both **units** leftover AP = 0), Dry Gait (both units leftover MP = 0), Still Gift (target spent 0 walk MP), Still Mend (caster spent 0 walk MP), Parched Mend (**not shipped**). `healAmount` must not sit on a non-healer CORE row.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_target_both_pools_zero"`. **Healer CORE only.** Skip if either leftover ≥ 1 or missing HP < 8.  
PLAYER_COUNTERPLAY: Leave them 1 AP or 1 MP; Cursed Wound the heal; kill the Cantor  
SYNERGIES: Drain Courage / Soul Sip to empty the pools; `no_healing` fails if this heal lands  
BALANCE_RISK: 12 is Mend-sized. Dual-pool gate + elite + CD 3. Do not also fire Dry Mend / Dry Gait on the same resolve (one heal writer: Hollow Gift wins if all three would apply — document).  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Player-side HP gain sets `healUsed`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-swap`

NAME: Cadence Swap  
ROLE: SUPPORT — swap remaining cooldowns with the target  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 13`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. Exchange the caster’s remaining cooldown map with the target’s remaining cooldown map (`effectParams: {"swapRemainingCooldowns":true}`). Ids the other unit does not own are **dropped** (not granted). Empty bar ↔ full bar is legal. Distinct from Cadence Imprint (copy matching CDs onto the caster; target **keeps**), Cadence Halve (floor-divide one hostile bar), Cadence Grace (next own spell skips **starting** CD), Cadence Rest (own remaining do not tick), Pawn Trade (bodies). Does **not** write `ownedSpellIds`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "swap_remaining_cooldowns"`. Caster / controller. Skip if both bars are empty, or if the swap would hand the player a ready Inferno while the caster gains nothing.  
PLAYER_COUNTERPLAY: Hold no CDs (empty swap); Absolve / Dispel after; wait 3  
SYNERGIES: Cadence Pin one id first, then swap the rest; Quiet Hex the tool they just received ready  
BALANCE_RISK: Handing a ready 5-AP nuke is the nightmare. Drop unknown ids + CD 3 + G≥13. Never grant new ownership.  
PERSISTENCE_REQUIREMENTS: Observe on the **resolve**. Empty-bar swap still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-strike-debt`

NAME: Strike Debt  
ROLE: CONTROL — next walk costs +1 AP if they Struck last turn  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 13`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target’s last resolved action last turn was `physical_attack` / Strike (and they did **not** also resolve a spell), their **next walk of ≥ 1 tile** also costs +1 AP (`effectParams: {"taxNextWalkIfStruckLastTurn":true}`). If they spelled, camped, or only walked, fizzle (AP spent). Teleport / Swap / Phase Slip / Twin-gate step do **not** pay. Distinct from Spent Tax (next **spell** +1 AP if they **walked**), Cast Debt (next **walk** +1 AP if they **spelled**), Debt Mark (next walk +1 AP with no last-action gate).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_struck_last_turn"`. Caster / controller. Skip if they spelled last turn (use Cast Debt) or walked (use Spent Tax) or are already rooted.  
PLAYER_COUNTERPLAY: Blink off; Strike in place again; pay the 1 AP  
SYNERGIES: Hold Ground (they wanted to walk in after the Strike); Paper Wind  
BALANCE_RISK: Strike + walk is the melee default. Gate is **last action was Strike**, CD 2, G≥13. Do not stack with Debt Mark on G=0.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-nudge`

NAME: Brick Nudge  
ROLE: TERRAIN — push one adjacent barrier 1 away  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 13`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 3  
RANGE: 1  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 2  
EFFECT: Target an adjacent barrier cell. Move that barrier 1 cell **away from the caster** along the caster→brick axis if the dest is empty floor (`effectParams: {"nudgeAdjacentBarrierAway":true}`). Occupied / void / portal / existing barrier / reserved dest: fizzle (AP spent, no tile write). Distinct from Brick Orbit (move to **another adjacent** empty, not necessarily away), Brick Shift (relocate 1 any dir), Brick Crack (delete), Brick Sprout (grow a new cell), Barrier (place). The nudge **must not** seal the only player↔exit path — AI skips; a forced cast that would seal fizzles.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "nudge_adjacent_barrier_away"`. Caster / controller. Run `findPath` after a hypothetical nudge. Skip if it would seal, or if no away-cell exists.  
PLAYER_COUNTERPLAY: Stand in the away-cell; Barrier last-writer; occupy so the nudge fizzles  
SYNERGIES: File Lance through the opened file; Pit Reel after a hole appears  
BALANCE_RISK: Shoving a wall onto the last corridor is a soft-lock. Solvability skip is mandatory. Do not skip `finalizePlayableLayout` on generate.  
PERSISTENCE_REQUIREMENTS: Fizzle (seal / blocked) still observes. No tile write on fizzle.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-sip`

NAME: Watch Sip  
ROLE: CONTROL — overwatch snap steals 1 leftover AP from the walker  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 13`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 13`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into the caster’s armed overwatch band (reuse the existing overwatch enter hook — Hold Ground enter-1 or Far Watch 3–4, whichever is already armed; if none is armed, this id **also** arms a 1-tile enter band) loses 1 leftover AP if they have ≥ 1, and the caster gains 1 leftover AP this turn, capped at max (`effectParams: {"overwatchSnapStealWalkerAp":1,"overwatchDuration":2}`). If the walker has 0 leftover AP, the snap still consumes and no AP moves. Distinct from Watch Alms (grants walker +1), Watch Fee (walker −1, no transfer), Watch Lend (watcher +1, no steal), Soul Sip / AP Sip (cast-time steal, not a snap). Observation is the **arm**.  
SCALING: amount fixed  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_steal_walker_ap"`. Kiter / caster. Skip if no snap is likely or the likely walker is already at 0 AP.  
PLAYER_COUNTERPLAY: Stay outside the band; blink in; send a 0-AP summon  
SYNERGIES: Far Watch / Hold Ground already armed; Drain Courage first so they enter at 1  
BALANCE_RISK: Zero-sum AP on a snap is a tempo swing. Consume-on-first-body, CD 3, elite. Do not also fire Watch Fee on the same snap (sip wins).  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lone-gait`

NAME: Lone Gait  
ROLE: DAMAGE — bonus if leftover MP is exactly 1  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; variant ≥ ELITE or `G ≥ 13`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target’s** leftover MP is **exactly 1**, deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverMpEq1":10}`). Distinct from Pair Gait (leftover MP **exactly 2**), Full Gait (leftover MP ≥ 3 → RES), Lone Purse (leftover **AP** exactly 1), Dry Sting (leftover MP = 0), Lean Sting (caster leftover AP = 0 and MP ≥ 1). If leftover MP is 0, 2, or ≥ 3, only the 10 lands.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_mp_eq_1"`. Caster / kiter. Skip if leftover MP ≠ 1 and Frost is better.  
PLAYER_COUNTERPLAY: Spend the last MP; sit at 0 or 2+; Haste to 3  
SYNERGIES: Soul Sip to leave them at 1; Rime Sheet so they dare not spend it  
BALANCE_RISK: 20 at exactly 1 MP is Frost-adjacent on 2 AP CD 1. Elite + exact gate.  
PERSISTENCE_REQUIREMENTS: Wrong leftover still observes (10 only).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hazard-cut`

NAME: Hazard Cut  
ROLE: DAMAGE — bonus if the target stands on a painted hazard  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `null_censor` or `glyph_sower`; variant ≥ ELITE or `G ≥ 13`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `null_censor`, `glyph_sower`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 13`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target occupies a painted hazard cell (cinder / rime / mire / glyph-tax / fuse / pit / void-glyph — occupancy tile maps, **never** `spell.name`), deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfTargetOnHazard":10}`). Plain floor, world portals, and barriers are not hazards. Distinct from Banner Cut (`isLeader`), Escort Cut (pet in 2), Leash Cut (axis with a pet), Summon Bane (`isSummon`).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_on_hazard"`. Caster / controller. Skip if they stand on plain floor and Strike is better.  
PLAYER_COUNTERPLAY: Step off the paint; Barrier last-writer fills the cell; blink  
SYNERGIES: Cinder Tile / Rime Sheet / Mire Sheet / Open Pit first; Shove Mark is a different trigger  
BALANCE_RISK: 20 on paint is Frost-adjacent. Elite + tile-map check. Do not count lava/spikes map modifiers unless those maps also write a paint key — **explicit: only painted spell tiles**, not generated lava.  
PERSISTENCE_REQUIREMENTS: Plain-floor 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-drift-gift`

NAME: Drift Gift  
ROLE: SUPPORT — heal iff the target was force-moved this turn  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `coil_arbiter` or `pale_cantor`; `G ≥ 13`; `aiProfile` healer  
ENEMY_FAMILIES: `coil_arbiter`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target may be self. Heal 10 **only if** the target was force-moved this turn (push, pull, swap landing, slide, gate teleport — not a voluntary walk) (`effectParams: {"healIfTargetForceMoved":true,"driftHeal":10}`). If they only walked or camped, fizzle (AP spent). Distinct from Heave Mend (**both** caster and target force-moved), Hollow Gift (both leftover pools 0), Still Gift (0 walk MP), Gait Mend (caster walked). Reads the force-move flag, never `spell.name`. `healAmount` must not sit on a non-healer CORE row.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_target_force_moved"`. **Healer CORE only.** Skip if the target was not force-moved or missing HP < 8.  
PLAYER_COUNTERPLAY: Do not shove the wounded ally; Cursed Wound; kill the healer  
SYNERGIES: Shoulder Bash / File Slide / Pawn Trade / Twin Gate set the flag; Heave Mend is a different (both) gate  
BALANCE_RISK: 10 after a shove is Mend-lite. Force-move gate + CD 3. Do not treat walk as force-move.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Player-side HP gain sets `healUsed`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-file`

NAME: Pack File  
ROLE: SUPPORT — allied walks locked to the champion’s file  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family champion `file_precentor`; variant CHAMPION; `G ≥ 13`  
ENEMY_FAMILIES: `file_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 13`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 may only **walk** to cells that share the champion’s current `x` (file) at arm time (`effectParams: {"packWalkShareChampionFile":true,"auraRadius":2,"auraDuration":2}`). Forced movement is legal. Distinct from Pack Long (minRange 3), Pack Cap (maxRange 2), Pack Close (maxRange 1), Rank Lock (unit-scoped axis, learnable), File Fold (`BOSS_ONLY`). Does not grant the caster extra AP the turn it is cast.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_share_champion_file"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2. **Do not** put Pack Long / Pack Cap / Pack Close on the same BASE kit.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies off the file; blink  
SYNERGIES: File Lance down the locked file; Pack Howl is CHC — CHAMPION may have Howl **or** File, not both in CORE  
BALANCE_RISK: File-locking two bodies is a corridor prison. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe (and would not grant anyway).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-diag-fold`

NAME: Diag Fold  
ROLE: POSITION — swap two player-side bodies on a diagonal  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `diag_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `diag_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **only if** `|dx|==|dy|` and both deltas ≠ 0. If fewer than two, or they share a rank/file, or they sit on a knight offset, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideDiagonal":true,"foldDamage":6}`). Distinct from Adj Fold (Chebyshev **1**), Reach Fold (Chebyshev **exactly 2**), Mid Fold (shared rank/file, any distance on the axis), Knight Fold ((2,1) from midpoint), Sovereign Fold (any two), Pawn Trade (two hostiles-to-caster). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_diagonal"`. **Boss AI only.** Skip if 0–1 player-side bodies or they are not on a diagonal.  
PLAYER_COUNTERPLAY: Fight without a summon; stand on a rank/file; False Retreat decoy as the second body  
SYNERGIES: Diag Fold identity; Claim Ward (anti-swap **cell** does not block this — fold is unit swap, not cell claim; **explicit** so implementers do not merge the keys)  
BALANCE_RISK: Forced diagonal player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`. Do not restamp #808 `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 13 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…12 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥13 | `spell-knight-stride`, `spell-axis-bite` |
| `rust_reaver` | RARE / G≥13 | `spell-knight-stride`, `spell-axis-bite` |
| `glass_sniper` | RARE / G≥13 | `spell-quad-oath` |
| `glass_sniper` | ELITE | `spell-watch-sip` |
| `pale_cantor` | RARE / G≥13 | `spell-quad-oath`, `spell-drift-gift` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-hollow-gift` (healer CORE only) |
| `tide_shade` | RARE / G≥13 | `spell-pit-reel` |
| `glyph_sower` | RARE / G≥13 | `spell-pit-reel`, `spell-shove-mark` |
| `glyph_sower` | ELITE | `spell-hazard-cut` |
| `bone_scribe` | RARE / G≥13 | `spell-shove-mark` |
| `bone_scribe` / `purse_scribe` | ELITE | `spell-lone-gait` |
| `plate_warden` | ADVANCED / G≥13 | `spell-spent-plate`, `spell-full-sting` |
| `iron_golem` | ADVANCED / G≥13 | `spell-spent-plate`, `spell-full-sting` |
| `rime_mason` | RARE / G≥13 | `spell-rime-skip`, `spell-brick-nudge` |
| `ley_tollkeeper` | RARE / G≥13 | `spell-rime-skip`, `spell-strike-debt` |
| `tax_scribe` | RARE / G≥13 | `spell-strike-debt` |
| `stone_castellan` | RARE / G≥13 | `spell-brick-nudge` |
| `brood_chanter` | ELITE | `spell-summon-cast` |
| `cadence_thief` | RARE / G≥13 | `spell-cadence-swap` |
| `hex_chorister` | RARE / G≥13 | `spell-cadence-swap` |
| `hood_lurker` | ELITE | `spell-watch-sip` |
| `null_censor` | ELITE | `spell-hazard-cut` |
| `coil_arbiter` | RARE / G≥13 | `spell-drift-gift` |
| `file_precentor` CHAMPION | SIGNATURE | `spell-pack-file` (`ENEMY_ONLY`; not with Pack Long / Pack Cap / Pack Close on the same BASE kit) |
| `diag_fold_regent` | BOSS_ONLY | `spell-diag-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-13 family CORE consumes #747 and #787

The Wave-13 enemy/elite family sheet (same-day sibling if opened; otherwise the next family-sheet PR) puts **#747** unique Wave-11 verbs and **#787** tactical Wave-12 ids in **CORE** for new families. Unique §11 ids may appear there only as G≥13 extras in a later family pass (Wave 14), not as this document’s CORE. Do **not** put unique §11 ids in #796 CORE (#679 + #726) or in #752 CORE.

Stamp, do not clone #747: Diag Stride, Mid Oath, Void Reel, Foe Bite, Dwell Mark, Own Plate, Cinder Skip, Full Plate, Summon Toll, Still Mend, Cadence Rest, Spent Tax, Brick Crack, Watch Lend, Pair Purse, Escort Cut, Dry Mend. Pack Long stays `ENEMY_ONLY` on `long_precentor`. Adj Fold stays `BOSS_ONLY` on `adj_fold_regent`.

Stamp, do not clone #787: Cadence Imprint, Six Span (implementation-blocked while summon cap is 2), Odd Hood, Lean Sting, Parched Step, Parched Sill, Dry Hold, Lean Lend, Parched Sip, Lean Post, Parched Bounce, Must Lean, Verse Lean, Lean Hold. Court Imprint stays `NOT_PLAYER_LEARNABLE`. **Do not ship** `spell-parched-mend` (Dry Gait owns both leftover-MP=0 heal).

### 12.2 Wave-12 unique extras (deferred)

#802 unique Wave-12 verbs (`spell-orth-stride` … `spell-reach-fold`) stay G≥12 extras until Wave 14 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Cap stays `ENEMY_ONLY` on `cap_precentor`. Reach Fold stays `BOSS_ONLY` on `reach_fold_regent`.

### 12.3 Same-day tactical CORE (deferred)

If a 2026-10-21 tactical catalog opens, stamp it as Wave **14** family CORE. Do **not** put those ids in Wave-13 family CORE. Unique §11 stay this catalog’s. **SDE wins** unique §11 if that catalog claims the same hole.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 14 forever

Same recipe as Wave 12 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 14 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #787 extra doors. Do not restamp #802 rooms. Do not restamp #808 extra doors. Do not consume #771 primer room ids.

Suggested Wave-14 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; eight-cell occupy (**hold** — summon cap is 2); dedicated CORE families for unique Wave-12 §11 verbs (this catalog’s unique ids stay extras until then); consume unique Wave-12 verbs as Wave-14 family CORE. Bank leftover AP **and** MP is **#726 Dual Keep**. Four-cell occupy is **#636 Quad Span**. Five-cell occupy is **#695 Penta Span**. Six-cell occupy is **#787 Six Span**. Seven-cell occupy is **#726 Sept Span**. Both-force heal is **#726 Heave Mend**. Both leftover-AP=0 heal is #747 Dry Mend. Both leftover-MP=0 heal is #802 Dry Gait (**not** #787 Parched Mend). Target both-pools-empty heal is this wave’s Hollow Gift. CD swap is this wave’s Cadence Swap. Diag Fold stays `BOSS_ONLY` on `diag_fold_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / **#802** / **#808** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W13-A. G≥13 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W13-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W13-C. Wave-13 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #747 / #787 / #802 / memory Wave-5 ids |
| W13-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `orth_gallery` / `pit_gallery` / `diag_gallery` / #771 primer rooms |
| W13-E. Pit Reel attract caller | `applyAttract` toward nearest pit | Damage-math rewrite; RAF; treating dest as `map.portals` |
| W13-F. Brick Nudge solvability skip | `findPath` after a hypothetical nudge | `mapGen.ts`; skipping `finalizePlayableLayout` on generate |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Knight Stride consume, Shove Mark detonate, Spent Plate consume, Rime Skip consume, and Watch Sip consume read flags at walk / force-move / incoming-hit / overwatch-snap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 12 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W13-1 | Encounter start | Possessed-but-unused G13 id does not observe |
| W13-2 | Knight Stride orthogonal / diagonal dest | Confirm fails; MP not spent; Knight Stride already observed |
| W13-3 | `knight_gallery` defeat | Does not grant. Victory grants once |
| W13-4 | `diag_gallery` / `orth_gallery` / `inch_gallery` / `knight-pierce` | Do not grant Knight Stride |
| W13-5 | Quad Oath then Frost at Chebyshev 1, 2, 3, or 5 | Confirm fails; Strike still legal |
| W13-6 | Pit Reel no pit | Fizzle observes; no pull. Dest is not `map.portals` |
| W13-7 | Axis Bite off-axis | 10 only. Foe Bite would want an adjacent hostile. Leash Cut would want a pet on the axis |
| W13-8 | Shove Mark walk-enter | No detonate. Ingress would detonate on walk. Dwell would detonate on end turn. Wake would detonate on start turn |
| W13-9 | Spent Plate hit while leftover AP = 0 | Full hit; charge remains. Hit while leftover AP ≥ 1 consumes |
| W13-10 | Rime Skip across glyph-tax / lava / length 2 | Those taxes still tick. Skip is rime leave-tax + length 1 only |
| W13-11 | Full Sting leftover AP 2 | 10 only. Full Plate would want leftover AP ≥ 3 for **RES** |
| W13-12 | Summon Cast vs Summon Toll vs Summon Gait | Pets pay AP to **spell** vs pay AP to **walk** vs pay MP to walk |
| W13-13 | Hollow Gift after leftover AP or MP ≥ 1 | Fizzle observes; no heal. Dry Mend would want both **units** leftover AP = 0. Dry Gait would want both leftover MP = 0 |
| W13-14 | Cadence Swap vs Imprint vs Halve vs Grace | Bars **exchange** vs copy onto caster vs floor-divide one hostile vs next own skips starting CD |
| W13-15 | Strike Debt after they spelled or walked | Fizzle observes. Cast Debt would tax a post-spell walk. Spent Tax would tax a post-walk spell |
| W13-16 | Brick Nudge would seal the only path | AI skip; if forced, fizzle observes; no tile write |
| W13-17 | Watch Sip vs Alms vs Fee vs Lend | Snap steals walker AP vs grants walker +1 vs walker −1 no transfer vs watcher +1 |
| W13-18 | Lone Gait leftover MP 0, 2, or 3 | 10 only. Pair Gait would bonus leftover MP **exactly 2** |
| W13-19 | Hazard Cut on plain floor / world portal | 10 only. Banner Cut would want `isLeader`. Escort Cut would want a pet in 2 |
| W13-20 | Drift Gift after a voluntary walk | Fizzle observes. Heave Mend would want **both** force-moved |
| W13-21 | Pack File / Diag Fold | Never in `ownedSpellIds` |
| W13-22 | Loaner / `WF-SPL-*` / #771 primer | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W13-23 | G=12 Tide | No Knight Stride / Strike Debt (`generationMin: 13`) |
| W13-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W13-25 | No cloned ids | Unique §11 ids absent from #747 / #787 / #802 catalogs |
| W13-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Strike Debt / Summon Cast / Pack File are flags |
| W13-27 | Hex Toll | Still not in any SDE pool |
| W13-28 | Memory Wave-5 / Wave-12 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W13-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W13-30 | #787 extra doors | `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` not restamped |
| W13-30b | #802 rooms / doors | `orth_gallery` / `cap_precentor` / `reach_fold_regent` not restamped |
| W13-30c | #808 extra doors | `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` not restamped |
| W13-31 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–12, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, or **#802** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / **#808** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / #679 / #695 / #726 / #747 / #753 / #787 / **#802** / **#808** extra doors
- Consuming #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` as spell grants
- Consuming #826 `ENC-TEACH-13` / `ENC-SPELL-25` / `ENC-NEAR-01` / other 2026-10-21 ENC-* as spell grants
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `diag_gallery` / `orth_gallery` / `inch_gallery` / `pair_gallery` / `odd_gallery` / `even_gallery` / `pit_gallery` / `crack_nave` / `orbit_nave` as Knight Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #752 CORE, #686 CORE, #796 CORE, or Wave-13 #747/#787 CORE
- Cloning #747 (`spell-diag-stride` … `spell-adj-fold`), #787 (`spell-parched-mend` … `spell-court-imprint`), or #802 (`spell-orth-stride` … `spell-reach-fold`) into unique §11
- Minting `spell-both-parched` / `spell-hex-span` / `spell-cadence-copy` / `spell-walk-debt` / `spell-pack-far` / `spell-full-cast`
- Shipping `spell-parched-mend` alongside Dry Gait
- Cloning Spent Tax as Strike Debt, Pack Long as Pack File, or Full Plate as Full Sting

---

## 17. Wave-13 index

**Unique SDE ids (19):** knight-stride, quad-oath, pit-reel, axis-bite, shove-mark, spent-plate, rime-skip, full-sting, summon-cast, hollow-gift, cadence-swap, strike-debt, brick-nudge, watch-sip, lone-gait, hazard-cut, drift-gift, pack-file, diag-fold.

**#747 stamps (do not clone; Wave-13 family CORE):** Diag Stride, Mid Oath, Void Reel, Foe Bite, Dwell Mark, Own Plate, Cinder Skip, Full Plate, Summon Toll, Still Mend, Cadence Rest, Spent Tax, Brick Crack, Watch Lend, Pair Purse, Escort Cut, Dry Mend, Pack Long, Adj Fold.

**#787 stamps (do not clone; Wave-13 family CORE):** Cadence Imprint, Six Span, Odd Hood, Lean Sting, Parched Step, Parched Sill, Dry Hold, Lean Lend, Parched Sip, Lean Post, Parched Bounce, Must Lean, Verse Lean, Lean Hold, Court Imprint. **Do not ship** Parched Mend (Dry Gait owns both leftover-MP=0 heal).

**#802 stamps (do not clone; Wave-14 family CORE):** Orth Stride, Tri Oath, Brick Reel, Lone Bite, Wake Mark, Gait Plate, Glyph Skip, Full Gait, Summon Gait, Still Gift, Cadence Grace, Cast Debt, Brick Orbit, Watch Alms, Pair Gait, Leash Cut, Dry Gait, Pack Cap, Reach Fold.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-knight-stride` | ENEMY_DISCOVERY | yes | blink / reaver G≥13 | **One** next walk must be (2,1) |
| `spell-quad-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 4 |
| `spell-pit-reel` | ENEMY_DISCOVERY | yes | tide / glyph | Pull 1 toward nearest pit |
| `spell-axis-bite` | ENEMY_DISCOVERY | yes | reaver / blink | Bonus if they share rank/file with the caster |
| `spell-shove-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates on **force-move landing** |
| `spell-spent-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit is 0 while leftover AP ≥ 1 |
| `spell-rime-skip` | ENEMY_DISCOVERY | yes | rime / ley | 1-tile walk ignores rime leave-tax |
| `spell-full-sting` | ENEMY_DISCOVERY | yes | plate / golem | Leftover AP ≥ 3 → bonus damage |
| `spell-summon-cast` | ELITE | yes | brood_chanter | Allied summons pay +1 AP to start a spell |
| `spell-hollow-gift` | ELITE | yes | pale / font cantor | Heal iff **target leftover AP and MP are both 0** |
| `spell-cadence-swap` | ENEMY_DISCOVERY | yes | cadence / hex | Swap remaining CDs caster ↔ target |
| `spell-strike-debt` | ENEMY_DISCOVERY | yes | tax / ley | Next walk +1 AP if they **Struck** last turn |
| `spell-brick-nudge` | ENEMY_DISCOVERY | yes | stone / rime | Push one adjacent barrier 1 away |
| `spell-watch-sip` | ELITE | yes | glass / hood | Overwatch snap steals walker leftover AP |
| `spell-lone-gait` | ELITE | yes | purse / scribe | Bonus if leftover MP **exactly 1** |
| `spell-hazard-cut` | ELITE | yes | null / glyph | Bonus if target stands on a painted hazard |
| `spell-drift-gift` | ENEMY_DISCOVERY | yes | coil / cantor | Heal iff **target** was force-moved |
| `spell-pack-file` | ENEMY_ONLY | no | `file_precentor` CHAMPION | Pack walks locked to the champion file |
| `spell-diag-fold` | BOSS_ONLY | no | `diag_fold_regent` | Swap two player-side bodies on a diagonal |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-12 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #747 so Diag Stride / Spent Tax / Full Plate land once as Wave-13 family CORE. Coordinate with #787 so Cadence Imprint / Six Span / Odd Hood land once as Wave-13 family CORE, and so Parched Mend is **not** shipped beside Dry Gait. Coordinate with #802 so Orth Stride / Dry Gait stay Wave-14 CORE, not this CORE. Not a license to land combat code in the same change as this spec.
