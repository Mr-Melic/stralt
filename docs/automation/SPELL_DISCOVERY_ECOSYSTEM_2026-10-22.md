# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 14

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-22  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–13 are Generations 3–13. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Waves 6–13 are still-open #480 / #533 / #590 / #646 / #679 / #747 / #802 / **#837**. This document is **Generation 14**. `generationMin: 14`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

**Gap note.** The last SDE wave PR is **#837** (2026-10-21). This pass does **not** skip generations and does **not** mint Waves 15–35. It is the next sequential generation.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-22.md`](./ACTION_IDS_SDE_2026-10-22.md).

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
| Wave-6…11 discovery contracts | still-open #480 / #533 / #590 / #646 / #679 / #747 | G≥6…11 extra slots and those unique catalogs |
| Wave-12 discovery contract | still-open #802 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md` | G≥12 extra slot, W12 unique ids. **Stamp onto Wave-14 family CORE, do not clone** |
| Wave-13 discovery contract | still-open **#837** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md` | G≥13 extra slot, W13 unique ids, #747 / #787 stamps. Unique §11 stay extras until Wave 15 |
| Wave-1…13 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-10-21.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 / #729 / #791 / #815 | `ownedSpellIds` / `observedSpellIds`, soft-retire. Same-day **#870** is Master Technical Director roadmap — **not** a tactical catalog |
| Tactical gap-fillers W1…W12 | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 | Reserved in §0.1 |
| Tactical gap-fillers W13 | still-open **#849** — `SPELL_PROPOSALS_2026-10-21.md` | Gaunt Mend … Court Lag. **Stamp onto Wave-14 family CORE, do not clone**. Extra doors `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent` — do not restamp. **SDE already won** Hollow Gift and Cadence Swap on #837; #849 stamped those and filled four-body gaunt / CD lag / Oct Span instead |
| Tactical gap-fillers W14 | still-open **#890** — `SPELL_PROPOSALS_2026-10-22.md` | Poise Mend … Court Floor. **Stamp as Wave 15 family CORE, do not clone**. Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` — do not restamp. **SDE wins** `spell-cadence-floor` (same hole and id); #890 must not ship that duplicate. Equal Gift is **target** leftover AP==MP≥1; Poise Mend is **both bodies**. Nine Span owns solid 3×3 occupy |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + #686 + #752 + #796 + #840 + **#899** | #840 Wave-13 families consume unique **#747** Wave-11 verbs **and** **#787**. **#899** Wave-14 families consume unique **#802** Wave-12 verbs (minus Dry Gait / Pack Cap / Reach Fold) **and** **#849** (minus Court Lag). Do **not** put unique §11 ids in #899 CORE. Wave 15 families consume unique **#837** Wave-13 verbs **and** **#890** (except Cadence Floor) |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / **#836** | Extra doors claimed through Wave 14 (`effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister`). Do not restamp |
| Same-day encounter primer | #771 — Bash/Dry/Hood catalog | Room ids `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`. Not a spell catalog. Do not consume |
| Prior-day encounter catalog | still-open **#826** — `ENCOUNTER_EVOLUTION_2026-10-21.md` | Room ids `ENC-TEACH-13` / `ENC-HAZ-25` / `ENC-SPELL-25` / `ENC-SPELL-26` / `ENC-BOTH-01` / `ENC-NEAR-01` / `ENC-DAMP-01` and the rest of that day’s ENC-* table. Not a spell catalog. Do not consume |
| Same-day encounter catalog | still-open **#885** — `ENCOUNTER_EVOLUTION_2026-10-22.md` | Room ids `ENC-TEACH-14` / `ENC-HAZ-27` / `ENC-HAZ-28` / `ENC-SPELL-27` / `ENC-SPELL-28` / `ENC-HEAVE-01` / `ENC-READY-01` / `ENC-MID-01` / `ENC-SPIKE-01` / `ENC-INCH-01` / `ENC-FOLD-01` and the rest of that day’s ENC-* table. Not a spell catalog. Do not consume. `ENC-SPIKE-01` teaches Spike Skip, **not** Spike Reel. `ENC-INCH-01` teaches Inch Stride, **not** Rank Stride. `ENC-FOLD-01` is a wall fold, **not** Rank Fold |
| PX coherence | #343 / #393 / #481 / #579 / #632 / #744 / #784 / #844 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-14 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

At audit start (2026-10-22 00:01 UTC) no `SPELL_PROPOSALS_2026-10-22.md` existed. Same-day **#870** is roadmap, not tactical. During this run **#890** opened as Wave-14 tactical — **stamp it** as Wave **15** family CORE and do not clone its ids into unique §11. **SDE wins** `spell-cadence-floor`. Same-day **#899** is the Wave-14 family sheet (#802 + #849 CORE) — unique §11 stay extras, not that CORE.

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

**Wave 13 SDE (#837):** `spell-knight-stride`, `spell-quad-oath`, `spell-pit-reel`, `spell-axis-bite`, `spell-shove-mark`, `spell-spent-plate`, `spell-rime-skip`, `spell-full-sting`, `spell-summon-cast`, `spell-hollow-gift`, `spell-cadence-swap`, `spell-strike-debt`, `spell-brick-nudge`, `spell-watch-sip`, `spell-lone-gait`, `spell-hazard-cut`, `spell-drift-gift`, `spell-pack-file`, `spell-diag-fold`.

**#849 tactical Wave 13 (never re-propose / never clone):** `spell-gaunt-mend`, `spell-cadence-lag`, `spell-oct-span`, `spell-even-hood`, `spell-gaunt-sting`, `spell-gaunt-step`, `spell-gaunt-sill`, `spell-odd-hold`, `spell-gaunt-lend`, `spell-bare-sip`, `spell-gaunt-post`, `spell-gaunt-bounce`, `spell-must-gaunt`, `spell-verse-gaunt`, `spell-gaunt-hold`, `spell-court-lag`.

**#890 tactical Wave 14 (never re-propose / never clone except Cadence Floor — SDE wins that id):** `spell-poise-mend`, `spell-cadence-floor` (**SDE unique §11 owns this id**; #890 must not ship a second copy), `spell-nine-span`, `spell-bar-cross`, `spell-poise-hood`, `spell-poise-sting`, `spell-poise-step`, `spell-poise-sill`, `spell-poise-hold`, `spell-poise-lend`, `spell-poise-sip`, `spell-poise-post`, `spell-poise-bounce`, `spell-must-poise`, `spell-verse-poise`, `spell-court-floor`.

**Do not alias** `spell-rank-stride` ↔ `spell-orth-stride` / `spell-file-stride` / `spell-rank-lock` / `spell-pack-file` / `spell-even-stride` / `spell-odd-stride` / `spell-knight-stride` / `spell-diag-stride`, `spell-penta-oath` ↔ `spell-quad-oath` / `spell-tri-oath` / `spell-mid-oath` / `spell-long-oath` / `spell-penta-span` / `spell-far-hood`, `spell-spike-reel` ↔ `spell-pit-reel` / `spell-cinder-reel` / `spell-void-reel` / `spell-brick-reel` / `spell-spike-skip` / `spell-open-pit`, `spell-screen-bite` ↔ `spell-cover-step` / `spell-wall-bite` / `spell-axis-bite` / `spell-rear-cut` / `spell-gate-sight` / `spell-borrowed-eye`, `spell-swap-mark` ↔ `spell-shove-mark` / `spell-ingress-mark` / `spell-dwell-mark` / `spell-wake-mark` / `spell-spell-swap` / `spell-pawn-trade`, `spell-odd-plate` ↔ `spell-spent-plate` / `spell-odd-hood` / `spell-odd-hold` / `spell-even-hood` / `spell-gait-plate` / `spell-own-plate`, `spell-mire-skip` ↔ `spell-rime-skip` / `spell-mire-sheet` / `spell-glyph-skip` / `spell-cinder-skip` / `spell-lava-skip` / `spell-spike-skip`, `spell-odd-sting` ↔ `spell-full-sting` / `spell-gaunt-sting` / `spell-odd-hold` / `spell-pair-purse` / `spell-lean-sting`, `spell-summon-verse` ↔ `spell-summon-cast` / `spell-choir-verse` / `spell-verse-gaunt` / `spell-pet-verse` / `spell-once-verse`, `spell-equal-gift` ↔ `spell-hollow-gift` / `spell-gaunt-mend` / `spell-dry-mend` / `spell-dry-gait` / `spell-tempo-invert` / `spell-still-gift` / `spell-drift-gift` / `spell-poise-mend`, `spell-cadence-floor` ↔ `spell-cadence-lag` / `spell-cadence-crack` / `spell-cadence-halve` / `spell-cadence-trim` / `spell-cadence-flush` / `spell-cadence-swap` / #890’s duplicate `spell-cadence-floor` (SDE wins), `spell-cast-toll` ↔ `spell-strike-debt` / `spell-cast-debt` / `spell-spent-tax` / `spell-walk-toll` / `spell-ley-toll` / `spell-summon-toll`, `spell-brick-step` ↔ `spell-brick-nudge` / `spell-brick-orbit` / `spell-brick-crack` / `spell-phase-slip` / `spell-vault` / `spell-swap`, `spell-watch-bank` ↔ `spell-watch-alms` / `spell-watch-sip` / `spell-dual-keep` / `spell-purse-keep` / `spell-stride-keep` / `spell-watch-lend`, `spell-tied-gait` ↔ `spell-pair-gait` / `spell-pair-purse` / `spell-twin-gate` / `spell-gaunt-sting` / `spell-equal-gift` / `spell-poise-sting` / `spell-poise-hood`, `spell-portal-cut` ↔ `spell-hazard-cut` / `spell-void-reel` / `spell-gate-sight` / `spell-leash-cut` / `spell-escort-cut`, `spell-shove-gift` ↔ `spell-drift-gift` / `spell-heave-mend` / `spell-shove-mark` / `spell-shove-mend` / `spell-hollow-gift`, `spell-pack-rank` ↔ `spell-pack-file` / `spell-rank-lock` / `spell-rank-stride` / `spell-pack-cap` / `spell-pack-long`, `spell-rank-fold` ↔ `spell-mid-fold` / `spell-file-fold` / `spell-diag-fold` / `spell-adj-fold` / `spell-reach-fold` / `spell-court-lag` / `spell-court-floor` / `spell-nine-span` / `spell-bar-cross`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Unique Wave-12 CORE (#802 — stamp onto Wave-14 family CORE, do not clone)

#802 **owns** the G≥12 unique SDE holes. Wave 13 already recorded them as extras. This document **consumes #802 as Wave-14 family CORE** (together with #849) and does **not** re-author those cards.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-orth-stride` | ENEMY_DISCOVERY | **One** next walk orthogonal. Distinct from Rank Stride (**horizontal / same y only**) |
| `spell-tri-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 3. Distinct from Penta Oath (**exactly** 5) |
| `spell-brick-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **barrier**. Distinct from Spike Reel (nearest **spike**) |
| `spell-lone-bite` | ENEMY_DISCOVERY | Bonus if isolated from **all** units. Distinct from Screen Bite (Bresenham **blocked**) |
| `spell-wake-mark` | ENEMY_DISCOVERY | Cell detonates on **start-of-turn occupy**. Distinct from Swap Mark (**teleport/swap landing**) |
| `spell-gait-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover **MP** ≥ 1. Distinct from Odd Plate (leftover **AP odd**) |
| `spell-glyph-skip` | ENEMY_DISCOVERY | 1-tile walk ignores glyph-tax. Distinct from Mire Skip (mire **enter-tax**) |
| `spell-full-gait` | ENEMY_DISCOVERY | Leftover MP ≥ 3 → +RES. Distinct from Tied Gait (leftover AP **==** leftover MP **==** 2) |
| `spell-summon-gait` | ELITE | Allied summons pay +1 **MP** to start a walk. Distinct from Summon Verse (pets pay +1 **AP** to **recast last id**) |
| `spell-still-gift` | ELITE | Heal iff **target** spent 0 walk MP. Distinct from Equal Gift (leftover AP **equals** leftover MP, both ≥ 1) |
| `spell-cadence-grace` | ENEMY_DISCOVERY | Next own spell does not **start** its cooldown. Distinct from Cadence Floor (hostile remaining `n>1` → **1**) |
| `spell-cast-debt` | ENEMY_DISCOVERY | Next **walk** +1 AP if they **spelled**. Distinct from Cast Toll (next **spell** +1 AP if they **Struck**) |
| `spell-brick-orbit` | ENEMY_DISCOVERY | Move an adjacent barrier to another adjacent empty cell. Distinct from Brick Step (**caster** steps through the barrier; barrier stays) |
| `spell-watch-alms` | ELITE | Overwatch snap **grants** the walker +1 AP **now**. Distinct from Watch Bank (snap **banks** 1 leftover AP until their next turn start) |
| `spell-pair-gait` | ELITE | Bonus if leftover MP **exactly 2**. Distinct from Tied Gait (leftover AP **and** leftover MP **exactly 2**) |
| `spell-leash-cut` | ELITE | Bonus if target shares an axis with a pet. Distinct from Portal Cut (Chebyshev ≤ 2 from a **world portal**) |
| `spell-dry-gait` | ENEMY_DISCOVERY | Heal iff **both leftover MP = 0**. Distinct from Equal Gift (equal **and both ≥ 1**). **Do not ship** Parched Mend |
| `spell-pack-cap` | ENEMY_ONLY | Pack next-spell maxRange 2. Distinct from Pack Rank (allies walk locked to champion **rank**). Never owned |
| `spell-reach-fold` | BOSS_ONLY | Swap two player-side bodies at Chebyshev **exactly 2**. Distinct from Rank Fold (they **share a rank**). Never owned |

`orth_gallery` is **not** Rank Stride’s door. `tri_nave` is **not** Penta Oath’s door. `brick_aisle` is **not** Spike Reel’s door. `wake_pulpit` is **not** Swap Mark’s door. `orbit_nave` is **not** Brick Step’s door. `cap_precentor` is **not** `rank_precentor`. `reach_fold_regent` is **not** `rank_fold_regent`.

### 0.2b Tactical Wave 13 (#849 — stamp onto Wave-14 family CORE, do not clone)

#849 **owns** the G≥13 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-14 family CORE is **#802 + #849**. Extra doors `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent` — do not restamp. Do **not** mint `spell-hollow-mend` / `spell-cadence-trade` / `spell-octa-span` / `spell-even-plate` / `spell-gaunt-floor`.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-gaunt-mend` | MULTI_SOURCE | Heal iff **caster and target** both leftover AP = 0 **and** leftover MP = 0. Distinct from Equal Gift (AP **==** MP **and both ≥ 1**) |
| `spell-cadence-lag` | MULTI_SOURCE | Remaining `n>0` → `n+2`; zeros stay 0. Distinct from Cadence Floor (`n>1` → **1**; zeros stay 0) |
| `spell-oct-span` | MULTI_SOURCE | Hollow 3×3 ring, counts as **eight**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked. Nine-cell occupy stays **held** |
| `spell-even-hood` | ELITE | Next hit from **even** Chebyshev is 0. Distinct from Odd Plate (leftover **AP odd**, any range) |
| `spell-gaunt-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP = 0 **and** leftover MP = 0. Distinct from Odd Sting (target leftover **AP odd**) and Tied Gait (both leftover **exactly 2**) |
| `spell-gaunt-step` | ENEMY_DISCOVERY | Caster lands adjacent to an ally with both leftover 0 |
| `spell-gaunt-sill` | ENEMY_DISCOVERY | Occupant fully spent at **start of their turn** takes 8 |
| `spell-odd-hold` | ELITE | Cannot **walk** while leftover AP is odd. Distinct from Odd Plate (incoming hit 0) and Odd Sting (damage bonus) |
| `spell-gaunt-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP if the ally is fully spent |
| `spell-bare-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover MP = 0 |
| `spell-gaunt-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff fully spent |
| `spell-gaunt-bounce` | ENEMY_DISCOVERY | Bounce among fully-spent hostiles |
| `spell-must-gaunt` | ELITE | Non-Strike illegal unless leftover MP = 0 **and** the spell spends last AP |
| `spell-verse-gaunt` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP = 0 **and** leftover MP = 0. Distinct from Summon Verse (pets pay +1 AP to **recast** last id; the id stays legal) |
| `spell-gaunt-hold` | ELITE | Strike illegal unless leftover MP = 0 **and** Strike spends last AP |
| `spell-court-lag` | NOT_PLAYER_LEARNABLE | Mass Cadence Lag. Never owned. Distinct from Rank Fold (position swap) |

`gaunt_cantor` is **not** Equal Gift’s door. `lag_precentor` is **not** Cadence Floor’s door. `span_oct` is **not** Rank Fold’s door. `court_lag_regent` is **not** `rank_fold_regent`. `even_gallery` is **not** Rank Stride’s door.

### 0.2c Tactical Wave 14 (#890 — stamp as Wave 15 family CORE, do not clone)

#890 **owns** the G≥14 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-15 family CORE is **#837 unique Wave-13 verbs + #890** (except Cadence Floor). Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` — do not restamp. Do **not** mint `spell-tied-mend` / `spell-equal-mend` / `spell-nona-span` / `spell-tempo-cross` / `spell-court-arm`. **SDE wins** `spell-cadence-floor`; #890 must pick a different id if it still wants a tactical CD-floor card — the hole is filled here.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-poise-mend` | MULTI_SOURCE | Heal iff **caster and target** both leftover AP === leftover MP **and both ≥ 1**. Distinct from Equal Gift (**target** leftover AP == leftover MP ≥ 1; caster leftover unread) |
| `spell-cadence-floor` | MULTI_SOURCE | **Collision.** Same id and same `n>1` → 1 hole as unique §11. **SDE wins.** Do not ship #890’s copy. `floor_precentor` stays #890’s door — do not restamp; this catalog teaches via `cadence_thief` / `hex_chorister` |
| `spell-nine-span` | MULTI_SOURCE | Solid 3×3 occupy, counts as **nine**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked. Oct Span stays the hollow eight |
| `spell-bar-cross` | ENEMY_DISCOVERY | Two-body leftover cross: caster AP ↔ target MP **and** caster MP ↔ target AP. Distinct from Tempo Invert (one-body ally/self) |
| `spell-poise-hood` | ELITE | Next hit is 0 while leftover AP === leftover MP **and both ≥ 1**. Distinct from Odd Plate (leftover **AP odd**) and Tied Gait (both leftover **exactly 2**) |
| `spell-poise-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP === leftover MP **and both ≥ 1**. Distinct from Odd Sting (leftover AP **odd**) and Tied Gait (both **exactly 2**) |
| `spell-poise-step` | ENEMY_DISCOVERY | Caster lands adjacent to an ally with leftover AP === leftover MP ≥ 1 |
| `spell-poise-sill` | ENEMY_DISCOVERY | Occupant with leftover AP === leftover MP ≥ 1 at **start of their turn** takes 8 |
| `spell-poise-hold` | ELITE | Cannot **walk** while leftover AP === leftover MP ≥ 1 |
| `spell-poise-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP if the ally leftover AP === leftover MP ≥ 1 |
| `spell-poise-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP === leftover MP ≥ 1 |
| `spell-poise-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP === leftover MP ≥ 1 |
| `spell-poise-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP === leftover MP ≥ 1 |
| `spell-must-poise` | ELITE | Non-Strike illegal unless leftover AP === leftover MP ≥ 1 **and** the spell spends last AP |
| `spell-verse-poise` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP === leftover MP ≥ 1 |
| `spell-court-floor` | NOT_PLAYER_LEARNABLE | Mass Cadence Floor. Never owned. Distinct from Rank Fold (position swap) |

`poise_cantor` is **not** Equal Gift’s door. `floor_precentor` is **not** this catalog’s Cadence Floor door (`cadence_thief` / `hex_chorister` observe). `span_nine` is **not** Rank Fold’s door. `court_floor_regent` is **not** `rank_fold_regent`. Do not name unique §11 families `gaunt_mender` / `cadence_lagger` / `oct_prelate` / `orth_warder` / `axis_cutter` (#899 owns those).

### 0.3 Held holes (still not this pass)

Wave 13 §13 listed these as Wave-14/15 candidates. This wave **does not** fill them in unique §11 except the ones marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Eight-cell occupy | **#849 Oct Span owns this hole.** Do not clone |
| Nine-cell occupy (solid 3×3) | **#890 Nine Span owns this hole.** Do not clone. Live `ENEMY_SUMMON_CAP` is still 2. Unique §11 does **not** mint `spell-nona-span` |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Invert leftover AP ↔ leftover MP on one body | **Wave 3 Tempo Invert already owns this hole.** Do not clone |
| Two-body leftover AP ↔ leftover MP cross | **#890 Bar Cross owns this hole.** Do not clone |
| Heal if leftover AP **equals** leftover MP and **both ≥ 1** | **Filled this wave** as Equal Gift (`spell-equal-gift`, **target** one-body). 0=0 stays Hollow Gift / Gaunt Mend. #890 Poise Mend is **both bodies** — stamp, do not clone |
| Remaining CDs `n>1` → 1 (zeros stay 0) | **Filled this wave** as Cadence Floor (`spell-cadence-floor`). **SDE wins** vs #890’s duplicate id |
| Dedicated CORE families for unique Wave-12 §11 verbs | **#899 consumes them** as Wave-14 family CORE (§12.1) together with #849 |
| Dedicated CORE families for unique Wave-13 §11 verbs | This catalog’s unique §11 ids stay G≥14 extras, not Wave-14 / #899 CORE. Wave 15 families consume unique Wave-13 verbs **and** #890 (except Cadence Floor) |
| Facing cards | Still fail closed until a battle `currentView` writer exists. **No new Wave-14 facing cards** |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-three calendar days after Wave 12, and one day after Wave 13, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Equal Gift / Shove Gift **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-14 unique ids stay `mpCost: 0`. Cast Toll / Summon Verse / Pack Rank / Watch Bank are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Spike Reel is attract-toward-**nearest spike**, a new dest flavor after Pit Reel (pit), Cinder Reel (hazard), Void Reel (void/portal), and Brick Reel (barrier) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-14 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Portal Cut reads **`map.portals` occupancy**, never `spell.name` |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21 **#814**…**#869**, then same-day **#870**…**#899**. **#371 owns Wave-4 SDE. #802 owns Wave-12 SDE. #837 owns Wave-13 SDE. #849 owns Wave-13 tactical. #836 owns Wave-14 extra boss doors. #840 owns Wave-13 families. #870 owns same-day roadmap. #885 owns same-day encounters. #890 owns Wave-14 tactical. #899 owns Wave-14 families.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-13 P0 remain the prerequisite. **Do not land Wave-14 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 14 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥14 rares make it sharper: a CHAMPION may hold the generation-14 verb until a same-rank landing / spike cell / leftover AP==MP≥1 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 14 fills holes Waves 1–13, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, **#837**, **#849**, and **#890** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Orth Stride, Rank Lock, Quad Oath, Pit Reel, Spent Plate, Pack File, Diag Fold, Hollow Gift, Cadence Swap, Gaunt Mend, Cadence Lag, Oct Span, Even Hood, Tempo Invert, Poise Mend, Nine Span, Bar Cross, or Hex of Silence. **SDE wins** Cadence Floor vs #890’s duplicate id.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 14 stamps `generationMin: 14`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Cast Toll **adds 1 AP** to the next **spell** if they Struck last turn. Summon Verse taxes **allied summons** 1 AP to recast last id. Pack Rank locks **walk rank**. Watch Bank **banks** leftover AP. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 14 unique ids do **not** require `currentView`.
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

Wave-14 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| `spell-rank-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Later **walk** that pays the same-rank gate | **No** — do not double-observe |
| `spell-swap-mark` **paint** (AP spent) | **Yes** |
| Later **swap/teleport landing** detonate | **No** |
| `spell-odd-plate` **arm** | **Yes** |
| Later **negated hit** while leftover AP is odd | **No** |
| `spell-spike-reel` no spike (fizzle after AP) | **Yes** — AP was spent (Wave 2 fizzle rule) |
| `spell-spike-reel` illegal because AI skipped (no AP) | **No** |
| `spell-mire-skip` **arm** | **Yes** |
| Later 1-tile walk onto a mire cell | **No** |
| `spell-cadence-floor` **resolve** (even if every remaining was already 0 or 1) | **Yes** if AP was spent |
| `spell-brick-step` dest occupied (fizzle after AP) | **Yes** |
| `spell-watch-bank` **arm** of the overwatch that will bank | **Yes** |
| Later **snap** that banks 1 leftover AP | **No** |
| `spell-pack-rank` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-rank-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orbs / `WF-SPL-*` / #771 primer rooms / #826 ENC-* | **Never** write `ownedSpellIds` |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 14 stamps unused **rooms**, not new enum members and not leftover feat doors.

| Source | Wave-14 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥14 family verbs in §11 **plus** #802 / #849 / #890 stamps in §0.2 / §0.2b / §0.2c / §12 |
| `ELITE` | Summon Verse, Equal Gift, Watch Bank, Tied Gait, Portal Cut |
| `ACHIEVEMENT` | **None.** Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master` |
| `CHALLENGE` | **None.** All nine challenge ids remain claimed through Wave 7 |
| `BOSS` | **None.** Rank Fold is `BOSS_ONLY` (never owned) |
| `SPECIAL_ENCOUNTER` | `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | None new. #802 Orth Stride / #849 Gaunt Mend / #890 Poise Mend keep their existing children |
| `ENEMY_ONLY` | Pack Rank (never owned) |
| `BOSS_ONLY` | Rank Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-14 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every door listed in Wave 13 §4.1, plus:

| Door | Owner |
| :--- | :--- |
| `knight_gallery` / `quad_nave` / `pit_aisle` / `shunt_pulpit` / `nudge_nave` | Wave 13 SDE (#837) |
| `file_precentor` / `diag_fold_regent` | Wave 13 SDE Pack File / Diag Fold |
| `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent` | #849 |
| `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` | #836 |
| `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` | #808 |
| `orth_gallery` / `tri_nave` / `brick_aisle` / `wake_pulpit` / `orbit_nave` | Wave 12 SDE (#802) |
| `cap_precentor` / `reach_fold_regent` | Wave 12 SDE Pack Cap / Reach Fold |
| `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` | #787 |
| `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` | #771 encounter primer |
| `ENC-TEACH-13` / `ENC-HAZ-25` / `ENC-SPELL-25` / `ENC-SPELL-26` / `ENC-BOTH-01` / `ENC-NEAR-01` / `ENC-DAMP-01` / other 2026-10-21 ENC-* | #826 encounter catalog |
| `ENC-TEACH-14` / `ENC-HAZ-27` / `ENC-HAZ-28` / `ENC-SPELL-27` / `ENC-SPELL-28` / `ENC-HEAVE-01` / `ENC-READY-01` / `ENC-MID-01` / `ENC-SPIKE-01` / `ENC-INCH-01` / `ENC-FOLD-01` / other 2026-10-22 ENC-* | #885 encounter catalog |
| `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` | #890 |
| `gaunt_mender` / `cadence_lagger` / `oct_prelate` / `orth_warder` / `axis_cutter` / other #899 `ENEMY_ID`s | #899 Wave-14 families |

### 4.2 Leftover doors (not this pass)

`survivor` only. Economy feats stay Doka-only. `unstoppable` stays unused forever as a spell gate. `jackpot` stays #185 Absolve. Do not restamp `leader_slayer` / `spell_master`.

---

## 5. Spell pool evolution — Generation 14 (never a last tier)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 14 adds the **G≥14 extra slot**.

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
| 3–13 | Prior extra slots from Waves 3–13. Do not retire them |
| 14 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 14` |
| 15+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-13 G13 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **14** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation — extends Wave 13 §5.1)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
     Wave-14 attached families: #802 unique Wave-12 verbs + #849 tactical Wave-13 ids
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3–13. prior extra slots from Waves 2–13
  14. if G ≥ 14: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
      (skip if no legal id; this is the Generation 14 verb)
  15. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  16. drop any id whose AI_REQUIREMENTS are unmet
  17. keep ENEMY_ONLY on enemies (they cast; they never grant)
  18. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 6. New `aiHint` keys (metadata, not names)

Wave 1 §9.1 through Wave 13 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_same_rank_only` | flanker, kiter | A legal dest with `dest.y == arm.y` exists this turn or next; skip if they must change rank to threaten and Strike is better |
| `next_spell_exact_chebyshev_5` | caster, kiter | Caster can sit at Chebyshev 5 before the next spell, or already sits at 5; skip if they must stay at 1–4 (use Strike / Quad Oath / Tri Oath / Long Oath) |
| `attract_toward_nearest_spike` | caster, controller | A spike occupancy cell exists in Chebyshev ≤ 6 of the target; skip if none, or if the 1-step would land on a world portal |
| `bonus_if_bresenham_blocked` | flanker, caster | A wall or barrier sits on the Bresenham from caster to target; skip if LoS is clear (use Axis Bite / Lone Bite) |
| `detonate_if_teleport_onto` | caster, controller | Paint the cell a swap / Twin Gate / Phase Slip / fold is likely to **land** on; skip if the player will walk there (use Ingress) or be shoved there (use Shove Mark) |
| `negate_hit_if_leftover_ap_odd` | guardian, charger | Caster can keep leftover AP odd through the next incoming hit; skip if they must spend to even the pool (use Odd Hold’s cousin window, not this) |
| `skip_mire_enter_tax_one_tile` | flanker, charger | Next intended walk is length 1 **onto** a mire cell; skip if the path is rime leave-tax / glyph-tax / lava / length ≥ 2 |
| `bonus_if_target_leftover_ap_odd` | caster, berserker | Target leftover AP is odd at resolve; skip if leftover AP is even (use Pair Purse / Gaunt Sting / Full Sting) |
| `summon_recast_last_id_ap_tax` | summoner, guardian | ≥ 1 living allied summon whose next spell id equals their last resolved id; skip if none, or if they will cast a new id (use Summon Cast) |
| `heal_if_leftover_ap_eq_leftover_mp_ge_1` | healer | Target leftover AP **equals** leftover MP **and both ≥ 1** and missing HP ≥ 8; skip if either leftover is 0 (use Hollow Gift / Gaunt Mend) or they differ (use Tempo Invert first, or skip). **Healer CORE only** |
| `floor_remaining_cds_to_1` | caster, controller | Target has ≥ 1 remaining CD **> 1**; skip if every remaining is 0 or 1 (Lag / Stall would still pad; Crack would zero) |
| `tax_next_spell_if_struck_last_turn` | caster, controller | Target resolved `physical_attack` last turn and no other spell; skip if they spelled (use Spent Tax) or walked (use Cast Debt) |
| `step_through_adjacent_barrier` | flanker, caster | An adjacent barrier exists **and** the far cell (2 away, barrier between) is empty floor; skip if dest is void / portal / occupied, or if HP% < 40 and dest is lava |
| `overwatch_snap_bank_walker_ap` | kiter, caster | Caster already has or will arm an overwatch this turn **and** the likely walker has leftover AP ≥ 1 that would expire at turn end; skip if Dual Keep already banks their AP, or if no snap is likely |
| `bonus_if_leftover_ap_eq_leftover_mp_eq_2` | caster, kiter | Target leftover AP **and** leftover MP are both exactly 2; skip if either is not 2 (use Pair Purse / Pair Gait / Equal Gift) |
| `bonus_if_near_world_portal` | caster, controller | Target Chebyshev ≤ 2 from a `map.portals` cell; skip if they stand farther, or if the nearest portal tile would be treated as a Twin Gate pad (it must not) |
| `heal_if_caster_force_moved_target` | healer | **This caster** shoved / pulled / slid / swapped the target this turn, missing HP ≥ 8; skip if another body authored the force-move, or if they only walked. **Healer CORE only** |
| `pack_walk_share_champion_rank` | buffer | CHAMPION only; skip if aura up or no ally in 2 |
| `fold_two_player_side_share_rank` | **boss AI only** | Exactly two living player-side bodies with equal `y` and `dx ≠ 0`; skip if 0–1, or they share a file instead (use Mid Fold), or they sit on a diagonal (use Diag Fold) |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: Doka credit `WorldExploration.tsx` 1502–1504, jackpot `WorldExploration.tsx` 18448.
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Swap Mark / Odd Plate / Mire Skip / Watch Bank / Brick Step may add a **battle-log line** when the detonate / negate / skip / bank / landing fires — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 14 adds **no** new canister methods.

| Writer | Wave-14 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | Not used for a new feat/challenge door this wave. #802 / #849 MULTI children stay those catalogs’ |

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
- Equal Gift / Shove Gift HP gain uses existing healUsed only when player-side HP actually increased. Brick Step / Spike Reel onto lava/spikes uses existing hazard helpers (`recordInBattleChallengeDamage` only while `inBattleRef` if treated as environmental).

---

## 9. Special encounters (Wave 14)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `rank_gallery` | Blink Cutter / Rank Lancer with a legal same-rank landing | `spell-rank-stride` via observe+win |
| `penta_nave` | Glass Sniper at Chebyshev 5 down a file | `spell-penta-oath` via observe+win |
| `spike_aisle` | Tide / Glyph on a map that already has spike occupancy | `spell-spike-reel` via observe+win |
| `swap_pulpit` | Glyph Sower + a visible swap bait (not Twin Gate pads) | `spell-swap-mark` via observe+win |
| `mire_nave` | Tide Shade on existing mire / ice; AI prefers Mire Skip if a 1-tile enter is forced | `spell-mire-skip` via observe+win |

Do not retag `orth_gallery` / `even_gallery` / `knight_gallery` / `pit_aisle` / `quad_nave` / `span_penta` / `shunt_pulpit`. Do not consume #771 primer rooms, #826 ENC-* ids, or #885 ENC-* ids. Twin Gate pads stay off `map.portals`. Spike cells are map-modifier occupancy, not painted pits. `ENC-SPIKE-01` stays Spike Skip’s room.

Wave-1 `echo_dummies`, Wave-2 `rime_gallery` / `still_court` / `mist_gallery`, and Wave-13 `knight_gallery` / `quad_nave` / `pit_aisle` / `shunt_pulpit` / `nudge_nave` are not re-specified.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–13 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 + #695 + #726 + #787 + #849 already cover: push, pull, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, conditional bounce, next-spell AP tax, next-walk AP tax, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, instant execute, DoT detonate, cross AoE, tile-gravity, ally rescue pull, ice tile, smoke, sinkhole, leash hook, bastion, goad, life tether, leftover-AP=0 heal, leftover-MP=0 heal, target both-pools-empty heal, four-body both-pools-empty heal, CD copy / steal / swap / lag / stall / stretch / halve / trim / rest / grace, even-Chebyshev hood, odd-Chebyshev hood, eight-cell occupy, leftover-AP-odd walk lock, knight walk, exact-4 spell gate, pit pull, force-move paint, leftover-AP≥1 plate.

**Still open (Wave 14 SDE unique ids).** The eight-cell occupy, four-body gaunt heal, and remaining `n>0`→`n+2` are #849’s; this table is what Discovery **adds**.

| Hole | Wave-14 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk must share **rank** (same y) | `spell-rank-stride` | Orth Stride is any orthogonal. Rank Lock is **all remaining** walks on rank **or** file. Pack File locks **allies** to a **file** |
| Next spell illegal unless Chebyshev = 5 | `spell-penta-oath` | Quad Oath is 4. Tri Oath is 3. Long Oath is ≥ 3. Penta Span is occupy-weight 5 |
| Pull 1 toward nearest **spike** | `spell-spike-reel` | Pit Reel is painted pit. Spike Skip **ignores** spike tax. Cinder Reel is painted hazard |
| Bonus if Bresenham is **blocked** | `spell-screen-bite` | Rear Cut is adjacent flank. Gate Sight **ignores** one barrier. Cover Step is a relocate |
| Cell detonates on **swap/teleport** landing only | `spell-swap-mark` | Shove Mark is push/pull/slide. Ingress is walk enter. Dwell is end-turn occupy |
| Next hit is 0 while leftover AP is **odd** | `spell-odd-plate` | Spent Plate is leftover AP **≥ 1** (includes even 2/4). Odd Hold **blocks walk**. Odd Hood is Chebyshev **parity** |
| 1-tile walk ignores **mire enter-tax** | `spell-mire-skip` | Rime Skip is rime **leave-tax**. Mire Sheet **paints** the tax. Glyph Skip is glyph-tax |
| Bonus if target leftover AP is **odd** | `spell-odd-sting` | Full Sting is leftover AP **≥ 3**. Gaunt Sting is both leftover **0**. Pair Purse is leftover AP **exactly 2** (even) |
| Allied summons pay +1 AP to **recast last id** | `spell-summon-verse` | Summon Cast taxes **every** pet spell. Verse Gaunt **bans** the last id until both leftover 0 |
| Heal iff leftover AP **equals** leftover MP and **both ≥ 1** | `spell-equal-gift` | Hollow Gift / Gaunt Mend own **0=0**. Dry Mend is leftover AP = 0. Dry Gait is leftover MP = 0. Tempo Invert **swaps** the pools. Poise Mend (#890) is **both bodies** |
| Hostile remaining `n>1` → 1; zeros stay 0 | `spell-cadence-floor` | Cadence Lag is `n>0` → `n+2`. Crack is → 0. Halve is ÷2. Trim is −1 (can reach 0). **SDE wins** this id vs #890 |
| Next **spell** +1 AP if they **Struck** last turn | `spell-cast-toll` | Strike Debt is next **walk** after Strike. Spent Tax is next **spell** after a **walk**. Cast Debt is next **walk** after a **spell** |
| Caster steps **through** an adjacent barrier | `spell-brick-step` | Brick Nudge **moves** the barrier. Brick Crack **removes** it. Phase Slip is a free blink. Vault is a boss ability |
| Overwatch snap **banks** 1 leftover AP on the walker | `spell-watch-bank` | Watch Alms **grants now**. Watch Sip **steals**. Dual Keep banks leftover **AP and MP** at turn end without an overwatch |
| Bonus if leftover AP **and** leftover MP are both **exactly 2** | `spell-tied-gait` | Pair Purse is AP exactly 2. Pair Gait is MP exactly 2. Gaunt Sting is both 0. Equal Gift **heals** any equal ≥ 1 |
| Bonus if target is Chebyshev ≤ 2 from a **world portal** | `spell-portal-cut` | Hazard Cut is **painted** hazard (explicitly not world portals). Void Reel **pulls** toward void/portal |
| Heal iff **this caster** force-moved the target | `spell-shove-gift` | Drift Gift is **anyone’s** force-move. Heave Mend is **both** force-moved |
| Pack walks locked to champion **rank** | `spell-pack-rank` | Pack File is **file**. Rank Lock is learnable unit-scoped. Never owned |
| Swap two player-side bodies that **share a rank** | `spell-rank-fold` | Mid Fold is shared rank **or** file. Diag Fold is diagonal. File Fold is a different boss. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 14)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–13, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, **#802**, **#837**, or **#849**. Unique §11 `spell-cadence-floor` collides with #890’s same-named card — **SDE wins**; #890 must not ship a second copy. Other #890 ids (`spell-poise-mend` … `spell-court-floor`) stay #890’s.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Cast Toll / Summon Verse / Pack Rank / Watch Bank are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 14 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #837 / #849 key names for a different meaning.

```text
rankStrideLockY,                  // Rank Stride — dest.y == arm.y
nextSpellExactChebyshev,          // Penta Oath — value 5
attractTowardNearestSpike, spikeSearchRadius,
bonusIfBresenhamBlocked, screenBiteBonus,
detonateOnTeleportLanding,        // Swap Mark — swap / gate / blink / fold only
negateHitIfLeftoverApOdd,
skipMireEnterTaxOneTile,
bonusIfTargetLeftoverApOdd, oddStingBonus,
summonRecastLastIdApTax,
requireLeftoverApEqLeftoverMpGe1, equalGiftHeal,
floorRemainingCdsTo1,             // n>1 → 1; 0 stays 0; 1 stays 1
nextSpellApTaxIfStruckLastTurn,
stepThroughAdjacentBarrier,
overwatchSnapBankWalkerAp,
bonusIfLeftoverApEqMpEq2, tiedGaitBonus,
bonusIfNearWorldPortal, portalCutRadius, portalCutBonus,
healIfCasterForceMovedTarget, shoveGiftHeal,
packWalkShareChampionRank, auraRadius, auraDuration,
foldTwoPlayerSideShareRank, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` for Watch Bank’s arm window.

---

### SPELL_ID: `spell-rank-stride`

NAME: Rank Stride  
ROLE: POSITION — one next walk must share rank  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rank_lancer`; `G ≥ 14` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥14. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The caster’s **next walk** is legal only if `dest.y == y_at_arm` (`effectParams: {"rankStrideLockY":true}`). Length is free. File-advance (`dest.y ≠ arm.y`) confirm-fails (MP not spent). Forced movement / swap / blink / Twin-gate still legal. Distinct from Orth Stride (orthogonal **or** vertical), Rank Lock (#282, **all remaining** walks locked to rank **or** file), Pack File (allies locked to a **file**), Knight Stride ((2,1) only). Does **not** read `currentView`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_same_rank_only"`. Flanker / kiter. Skip if they must change rank to threaten and Strike is better. **Do not** assign to chargers who only walk toward the player on a file.  
PLAYER_COUNTERPLAY: Stand off-rank; occupy the only same-rank approach; Root before they arm  
SYNERGIES: File Lance after they are stuck on the rank; Pack Rank on a different body in the pack (do **not** CORE both on one kit)  
BALANCE_RISK: One-walk rank lock is a corridor. 2 AP / CD 2 / one consume. Fail closed (confirm fail), never become Orth Stride.  
PERSISTENCE_REQUIREMENTS: Standard observe → same-encounter win. Observation is the **arm**, not the later walk.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-penta-oath`

NAME: Penta Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 5  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `pale_cantor`; `G ≥ 14`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **non-Strike** spell confirms only if Chebyshev from caster to that spell’s target is **exactly 5** (`effectParams: {"nextSpellExactChebyshev":5}`). `physical_attack` stays legal at any range. Distinct from Quad Oath (exactly 4), Tri Oath (exactly 3), Mid Oath (exactly 2), Long Oath (≥ 3), Far Hood (incoming miss from ≥ 3). If they arm then walk to 4, the spell fizzles on confirm (AP not spent for the fizzled spell; Penta Oath already observed).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_5"`. Kiter / caster. Skip if they cannot reach 5 this turn (use Strike / Quad Oath).  
PLAYER_COUNTERPLAY: Close to 4 or 6; Root; Paper Wind  
SYNERGIES: Split Pace / Overcast after they sit at 5; Far Sting as the gated poke  
BALANCE_RISK: Exact-5 + Far Sting is a sniper prison. 2 AP / CD 3 / Strike exempt.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spike-reel`

NAME: Spike Reel  
ROLE: POSITION — pull 1 toward nearest spike  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `plague_rat`; `G ≥ 14`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Pull the target 1 tile toward the nearest **spike occupancy** cell in Chebyshev ≤ 6 (`effectParams: {"attractTowardNearestSpike":true,"spikeSearchRadius":6}`). Spike cells are map-modifier occupancy, **not** painted pits and **not** `map.portals`. If no spike exists, or the 1-step would land on a world portal / void, fizzle (AP spent, no move). Distinct from Pit Reel (painted pit), Cinder Reel (painted hazard), Void Reel (void/portal), Brick Reel (barrier), Spike Skip (ignore spike **land tax**). Occupancy dest uses existing `applyAttract`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_spike"`. Caster / controller. Skip if no spike, or if the 1-step is a world portal.  
PLAYER_COUNTERPLAY: Fight on maps without spikes; occupy the toward-tile; blink  
SYNERGIES: Spike Skip on the landing (they still get pulled, tax skipped); Hazard Cut does **not** fire (spikes are not painted)  
BALANCE_RISK: Pull onto spikes is the combo. AI value-check; dest is never `map.portals`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-board fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-screen-bite`

NAME: Screen Bite  
ROLE: DAMAGE — bonus if Bresenham is blocked  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `shadow_lurker`; `G ≥ 14`; `aiProfile` flanker/caster  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: Deal 10. If a wall **or** barrier sits on the Bresenham from caster to target, deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfBresenhamBlocked":true,"screenBiteBonus":10}`). If LoS is clear, only the 10 lands. Distinct from Rear Cut (adjacent flank), Axis Bite (share rank/file), Gate Sight (ignore one barrier), Borrowed Eye (LoS origin from ally), Cover Step (relocate). Reads occupancy, never `spell.name`.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_bresenham_blocked"`. Flanker / caster. Skip if LoS is clear and Frost is better.  
PLAYER_COUNTERPLAY: Step into LoS; destroy the barrier; stand so Bresenham is empty  
SYNERGIES: Barrier as a screen for your own copy; Brick Step to peek then bite  
BALANCE_RISK: 20 through cover is Frost-adjacent on 2 AP CD 1. G≥14 + blocked-LoS gate. Fail closed (10 only), never become Strike.  
PERSISTENCE_REQUIREMENTS: Clear-LoS 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-swap-mark`

NAME: Swap Mark  
ROLE: TERRAIN — cell detonates on teleport landing  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `bone_scribe`; `G ≥ 14`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor tile 2 turns. The next unit who **lands** on it via swap / Twin Gate / Phase Slip / fold (teleport class) takes 10 (spell, RES+SR) and the paint consumes (`effectParams: {"detonateOnTeleportLanding":true,"markDamage":10,"hazardDuration":2}`). Walk-enter, push, pull, and slide **do not** detonate. Distinct from Shove Mark (force-move landing including push), Ingress Mark (walk enter), Dwell Mark (end-turn occupy), Wake Mark (start-of-turn occupy), Gaunt Post (end-turn leftover gate). Observation is the **paint**.  
SCALING: damage follows dmg%; trigger class fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_teleport_onto"`. Caster / controller. Skip if the player has no swap/blink in kit and no Twin Gate pads live.  
PLAYER_COUNTERPLAY: Walk onto it (safe); shove them onto it (safe for this card); wait the 2  
SYNERGIES: Pawn Trade / Swap / Twin Gate as the trigger; Shove Mark is a different paint — do not CORE both  
BALANCE_RISK: Punishing blink is the identity. Walk is the counter. CD 2 / consume-on-first-teleport.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-odd-plate`

NAME: Odd Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP is odd  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 14`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥14. `generationMin: 14`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Until consumed or this unit’s next turn start. The next **applied** damaging hit deals 0 **if** leftover AP is **odd** (1, 3, 5, …) at the moment of the hit, and then consumes (`effectParams: {"negateHitIfLeftoverApOdd":true}`). If leftover AP is even (0, 2, 4, …), the hit lands and the charge **remains**. Distinct from Spent Plate (leftover AP **≥ 1** — even 2 still negates), Odd Hold (cannot **walk** while leftover AP odd), Odd Hood (Chebyshev **odd** miss), Even Hood (#849, Chebyshev **even** miss), Gait Plate (leftover **MP** ≥ 1). Does not read `CharacterStats.evasion`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_odd"`. Guardian / charger. Skip if they must spend that odd AP to Strike.  
PLAYER_COUNTERPLAY: Hit them after they spend to even; Drain Courage onto 2; wait the turn start peel  
SYNERGIES: Odd Hold on a different family (walk lock vs hit negate — do not CORE both on one body); Drain Courage to land leftover 1  
BALANCE_RISK: Weaker than Spent Plate on even leftover. 2 AP / CD 2 / parity gate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. Even-leftover full hit does not consume and does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-mire-skip`

NAME: Mire Skip  
ROLE: POSITION — 1-tile walk ignores mire enter-tax  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `plague_rat`; `G ≥ 14`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Consume-on-first-walk. The caster’s next **length-1** walk does not pay mire **enter-tax** (`effectParams: {"skipMireEnterTaxOneTile":true}`). Length ≥ 2 still pays. Rime leave-tax, glyph-tax, lava, and spikes still tick. Teleport / Swap onto mire already pays no enter-tax (Wave 3). Distinct from Rime Skip (rime **leave-tax**), Mire Sheet (paints the tax), Glyph Skip, Cinder Skip, Lava Skip, Spike Skip, Gap Ward.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_mire_enter_tax_one_tile"`. Kiter / flanker / charger. Skip if no mire is on the intended 1-tile path.  
PLAYER_COUNTERPLAY: Force a length-2 path; overwrite the cell with last-writer paint; Root  
SYNERGIES: Mire Sheet then skip the tax you painted; Undertow after they spent MP elsewhere  
BALANCE_RISK: Skip + attract is a close. Length-1 + consume + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**, not the later walk.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-odd-sting`

NAME: Odd Sting  
ROLE: DAMAGE — bonus if target leftover AP is odd  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 14`; `aiProfile` caster/berserker  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥14. `generationMin: 14`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target’s** leftover AP is **odd**, deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfTargetLeftoverApOdd":true,"oddStingBonus":10}`). If leftover AP is even, only the 10 lands. Distinct from Full Sting (leftover AP **≥ 3**, often caster-side), Gaunt Sting (both leftover **0** — 0 is even), Pair Purse (leftover AP **exactly 2** — even), Lean Sting (leftover AP = 0 **and** leftover MP ≥ 1), Odd Hold (walk lock).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_leftover_ap_odd"`. Caster / berserker. Skip if leftover AP is even and Frost is better.  
PLAYER_COUNTERPLAY: Spend 1 AP to even the pool; sit at 0 or 2; Dual Keep even leftover  
SYNERGIES: Drain Courage to land leftover 1; Odd Hold then sting (do not CORE both)  
BALANCE_RISK: 20 on leftover 1/3 is Frost-adjacent on 2 AP CD 1. G≥14 + odd gate.  
PERSISTENCE_REQUIREMENTS: Even-leftover 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-verse`

NAME: Summon Verse  
ROLE: SUMMONS — pets pay +1 AP to recast last id  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 14`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 14`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon that confirms a spell whose id equals that summon’s **last resolved spell id** pays +1 AP (`effectParams: {"summonRecastLastIdApTax":true}`). First cast of any id is free of this tax. Strike / `physical_attack` is **not** a spell for this key. Distinct from Summon Cast (every pet **spell** +1 AP), Summon Toll (pet **walk** +1 AP), Summon Gait (pet walk +1 **MP**), Verse Gaunt (hostile last id **illegal** until both leftover 0), Choir Verse / Stolen Verse (echo axis).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_recast_last_id_ap_tax"`. Summoner / guardian. Skip if no allied summon, or if they will cast a new id. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
PLAYER_COUNTERPLAY: Kill pets after one cast; Sever Tether; force them to recast Inferno  
SYNERGIES: Summon Cast on a different family (every spell vs recast — do not CORE both); Kennel Lock parks the pets  
BALANCE_RISK: Taxing a second Inferno is the nightmare. Elite + recast-only + CD 3. Player copy taxes **their** pets — a real downside.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Later recast tax does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-equal-gift`

NAME: Equal Gift  
ROLE: SUPPORT — heal iff leftover AP equals leftover MP and both ≥ 1  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 14`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 14`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target may be self. Heal 10 **only if** leftover AP **equals** leftover MP **and both ≥ 1** at resolve (`effectParams: {"requireLeftoverApEqLeftoverMpGe1":true,"equalGiftHeal":10}`). Windows: 1=1, 2=2, 3=3, …. If either leftover is 0, or they differ, fizzle (AP spent). Distinct from Hollow Gift (#837, **target** leftover AP = 0 **and** leftover MP = 0), Gaunt Mend (#849, **caster and target** both leftover 0/0), Poise Mend (#890, **caster and target** both leftover AP === leftover MP **and both ≥ 1** — caster leftover unread here), Dry Mend (both leftover **AP** = 0), Dry Gait (both leftover **MP** = 0), Tempo Invert (Wave 3, **swaps** leftover AP ↔ MP — can create or destroy this window), Still Gift (target spent 0 walk MP), Drift Gift (target force-moved). `healAmount` stays 0 on the row so `inferArchetype` does not treat a kit that only *carries* this id as healer. **Healer CORE only.** Do **not** restamp `poise_cantor`.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_eq_leftover_mp_ge_1"`. **Healer CORE only.** Skip if either leftover is 0 (use Hollow Gift) or they differ (consider Tempo Invert, or skip). Do not dump leftover **only** to enable this if a Strike would kill.  
PLAYER_COUNTERPLAY: Spend 1 from one pool so they differ; sit at 0/0 (Hollow Gift window, not this); Cursed Wound  
SYNERGIES: Tempo Invert to **make** 3 AP / 1 MP into 1/3 (still equal) or 2/0 into 0/2 (misses this, hits Dry Gait); Dual Keep **preserves** a 2=2 window. Do not CORE with Hollow Gift / Gaunt Mend / Poise Mend  
BALANCE_RISK: 10 on a matching leftover pair is Mend-lite. Elite + equal-and-both-≥1 + CD 3. 0=0 stays the gaunt/hollow identity.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Player-side HP gain sets `healUsed`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-floor`

NAME: Cadence Floor  
ROLE: CONTROL — remaining n>1 become 1; zeros stay 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 14`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. For each spell id in the **target’s** remaining-CD map: if `n > 1`, write `1`; if `n` is 0 or 1, leave it (`effectParams: {"floorRemainingCdsTo1":true}`). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Lag (#849, `n>0` → `n+2`), Cadence Crack (→ 0), Cadence Halve (÷2), Cadence Trim (−1, can reach 0), Cadence Stall (+1), Cadence Swap (exchange full maps), Cadence Imprint (copy onto caster), Cadence Rest (own remaining do not tick), Cadence Grace (next own skips **starting** CD). **SDE wins** this id vs #890’s same-named card; #890 must not ship a second `spell-cadence-floor`. Extra door `floor_precentor` stays #890’s — do not restamp; this catalog teaches via `cadence_thief` / `hex_chorister` observe. The decision: Inferno 3 becomes 1 — almost ready, not Crack-ready.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "floor_remaining_cds_to_1"`. Caster / controller. Skip if every remaining is 0 or 1. Prefer if the highest remaining is ≥ 3.  
PLAYER_COUNTERPLAY: Recast so remaining is 0 (zeros stay 0); Crack the highest to 0 yourself; wait the last 1  
SYNERGIES: Cadence Lag then Floor peels the pad you just wrote — **do not CORE both**; Verse Gaunt after you leave them at 1  
BALANCE_RISK: Peeling Inferno 5 → 1 is strong. 3 AP / CD 2 / cannot reach 0. Do not also Crack in the same CORE.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. All-already-0-or-1 still observes if AP was spent.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cast-toll`

NAME: Cast Toll  
ROLE: CONTROL — next spell +1 AP if they Struck last turn  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 14`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target resolved `physical_attack` last turn **and** resolved no other spell last turn, their next **spell** this battle (or 2 turns) costs +1 AP (`effectParams: {"nextSpellApTaxIfStruckLastTurn":true}`). Strike / `physical_attack` is **not** a spell for this key (still costs 2). If they spelled or only walked last turn, fizzle (AP spent). Distinct from Strike Debt (next **walk** +1 AP after Strike), Spent Tax (next **spell** after a **walk**), Cast Debt (next **walk** after a **spell**), Quiet Hex (next spell +1 AP, ungated), Walk Toll (walk pool flag, not `spell.mpCost`).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_spell_if_struck_last_turn"`. Caster / controller. Skip if they spelled last turn (use Spent Tax) or walked (use Cast Debt) or already sit on Quiet Hex.  
PLAYER_COUNTERPLAY: Spell instead of Strike the turn before; pay the 1 AP; wait 2  
SYNERGIES: Goad / Taunt Oath to force Strike; Odd Sting after leftover AP goes odd from the tax  
BALANCE_RISK: Strike-then-spell is a common packet. G≥14 + last-turn Strike gate + CD 2. Do not CORE with Quiet Hex.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-step`

NAME: Brick Step  
ROLE: POSITION — step through an adjacent barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 14`; `aiProfile` flanker/caster  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 3  
RANGE: 1  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 2  
EFFECT: Click an **adjacent** barrier cell. Relocate the caster to the cell immediately beyond it (same axis, Chebyshev 2 from the start, barrier between) if that dest is empty floor (`isCellFree`) (`effectParams: {"stepThroughAdjacentBarrier":true}`). The barrier **stays**. Not `isSwap`. If dest is void / portal / occupied / off-map, fizzle (AP spent, caster stays). Distinct from Brick Nudge (pushes the **barrier** 1 away), Brick Orbit (moves the barrier to another adjacent empty cell), Brick Crack (removes the barrier), Phase Slip (free blink), Vault (boss ability), Swap. Dest hazards tick with existing helpers. Does **not** write `currentView`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "step_through_adjacent_barrier"`. Flanker / caster. Skip if no adjacent barrier or dest is unsafe (void/portal/occupied, or lava while HP% < 40). Do not skip `finalizePlayableLayout` on generate — this is a unit relocate, not a tile write.  
PLAYER_COUNTERPLAY: Occupy the far cell; destroy the barrier; stand so the only far cell is lava  
SYNERGIES: Screen Bite after you peek; Barrier as a door you then step through  
BALANCE_RISK: Peek-through-cover is Phase Slip-lite. Adjacent-only + dest free + CD 2. Do not become a second blink.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Landing on lava/spikes is environmental (`recordInBattleChallengeDamage` while `inBattleRef`).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-bank`

NAME: Watch Bank  
ROLE: SUPPORT — overwatch snap banks 1 leftover AP on the walker  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 14`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 14`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into the caster’s existing overwatch band (Hold Ground enter-1 **or** Far Watch 3–4 — whichever is armed) has **1 leftover AP** banked to their next turn start (`effectParams: {"overwatchSnapBankWalkerAp":1,"overwatchDuration":2}`). The snap still deals that overwatch’s damage if one is armed. If no overwatch is armed, this card arms a **damage-0** enter-1 snap that only banks. Banked AP is leftover that **survives** turn start (Dual Keep-lite, **AP only**, cap 1). Distinct from Watch Alms (grants walker +1 AP **now**), Watch Sip (steals leftover AP), Watch Lend (watcher +1), Watch Fee (walker −1, no transfer), Dual Keep (banks leftover **AP and MP**, cap 2, no overwatch). If Dual Keep / Purse Keep / Stride Keep already banks their AP, Dual Keep wins (do not double-bank). Push/pull into the band **does** snap. Teleport / Swap **does not**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_bank_walker_ap"`. Kiter / caster. Skip if no snap is likely, or if Dual Keep already covers them.  
PLAYER_COUNTERPLAY: Blink in; send a summon; sit still; Dual Keep already banks  
SYNERGIES: Far Watch / Hold Ground as the damage snap; Cast Toll after they Strike then walk into the band  
BALANCE_RISK: Banking a walker’s last AP into next turn is Dual Keep-lite. Elite + consume-on-first-body + CD 3.  
PERSISTENCE_REQUIREMENTS: Observation is the **arm**. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tied-gait`

NAME: Tied Gait  
ROLE: DAMAGE — bonus if leftover AP and leftover MP are both exactly 2  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; variant ≥ ELITE or `G ≥ 14`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target’s** leftover AP **and** leftover MP are both **exactly 2**, deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApEqMpEq2":true,"tiedGaitBonus":10}`). Otherwise 10 only. Distinct from Pair Purse (leftover **AP** exactly 2, MP unconstrained), Pair Gait (leftover **MP** exactly 2, AP unconstrained), Gaunt Sting (both leftover **0**), Equal Gift (**heal** if AP==MP and both ≥ 1, including 2=2), Ready Sting (both leftover ≥ 1).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_leftover_mp_eq_2"`. Caster / kiter. Skip if either leftover is not 2 and Frost is better.  
PLAYER_COUNTERPLAY: Spend 1 from either pool; sit at 0/0 or 3/3; Dual Keep a different leftover  
SYNERGIES: Equal Gift wants the same 2=2 window on allies (heal vs poke — do not CORE both); Drain Courage / Walk Toll to **leave** 2/2  
BALANCE_RISK: 20 at exactly 2/2 is Frost-adjacent on 2 AP CD 1. Elite + exact two-resource gate.  
PERSISTENCE_REQUIREMENTS: Wrong leftover still observes (10 only).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-portal-cut`

NAME: Portal Cut  
ROLE: DAMAGE — bonus if the target is near a world portal  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `null_censor` or `void_mirror`; variant ≥ ELITE or `G ≥ 14`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `null_censor`, `void_mirror`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 14`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s tile is Chebyshev ≤ 2 from a **`map.portals`** cell, deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfNearWorldPortal":true,"portalCutRadius":2,"portalCutBonus":10}`). World portals stay impassable. Twin Gate pads are **not** `map.portals` and do **not** trigger this. Distinct from Hazard Cut (painted hazard; Wave 13 **explicitly** excludes world portals), Void Reel (pull toward void/portal), Gate Sight (ignore one barrier LoS), Escort Cut (pet in 2), Banner Cut (`isLeader`). Reads portal occupancy, never `spell.name`.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_world_portal"`. Caster / controller. Skip if they stand farther than 2 from every world portal and Frost is better.  
PLAYER_COUNTERPLAY: Stand 3+ from every portal; fight in rooms without world portals; blink off the threshold  
SYNERGIES: Void Reel to pull them **toward** a portal (the 1-step must still not **land on** the portal — Void Reel already forbids that); Claim Ward is a different anti-swap cell  
BALANCE_RISK: 20 on a threshold is Frost-adjacent. Elite + occupancy check. Do not treat Twin Gate pads as portals. Do not skip portal lock-while-hostile.  
PERSISTENCE_REQUIREMENTS: Far-from-portal 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-shove-gift`

NAME: Shove Gift  
ROLE: SUPPORT — heal iff this caster force-moved the target  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `coil_arbiter` or `pale_cantor`; `G ≥ 14`; `aiProfile` healer  
ENEMY_FAMILIES: `coil_arbiter`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target may be self only if this caster force-moved **themself** this turn (self-push / recoil). Heal 10 **only if this caster** shoved / pulled / slid / swapped the target this turn (`effectParams: {"healIfCasterForceMovedTarget":true,"shoveGiftHeal":10}`). If another body authored the force-move, or they only walked, fizzle (AP spent). Distinct from Drift Gift (#837, **anyone’s** force-move), Heave Mend (#726, **both** caster and target force-moved), Hollow Gift (both leftover 0), Equal Gift (AP==MP ≥ 1), Gaunt Mend (four leftover-0 reads). Reads a **caster-authored** force-move flag, never `spell.name`. `healAmount` stays 0 on the row. **Healer CORE only.**  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_caster_force_moved_target"`. **Healer CORE only.** Skip if this caster did not force-move the target, or missing HP < 8.  
PLAYER_COUNTERPLAY: Do not let the healer be the one who shoves the wounded ally; Cursed Wound; kill the healer  
SYNERGIES: Shoulder Bash / File Slide / Back Step as the authored shove; Drift Gift is a different (anyone) gate — do not CORE both  
BALANCE_RISK: 10 after your own shove is Mend-lite. Author gate + CD 3. Do not treat walk as force-move.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Player-side HP gain sets `healUsed`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-rank`

NAME: Pack Rank  
ROLE: SUPPORT — allied walks locked to the champion’s rank  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family champion `rank_precentor`; variant CHAMPION; `G ≥ 14`  
ENEMY_FAMILIES: `rank_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 14`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 may only **walk** to cells that share the champion’s current `y` (rank) at arm time (`effectParams: {"packWalkShareChampionRank":true,"auraRadius":2,"auraDuration":2}`). Forced movement is legal. Distinct from Pack File (file / `x`), Rank Lock (unit-scoped rank **or** file, learnable), Rank Stride (one next walk, learnable), Pack Cap (maxRange 2), Pack Long (minRange 3), Pack Close (maxRange 1). Does not grant the caster extra AP the turn it is cast.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_share_champion_rank"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2. **Do not** put Pack File / Pack Cap / Pack Long / Pack Close on the same BASE kit.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies off the rank; blink  
SYNERGIES: Rank Stride on a different family; Pack Howl is CHC — CHAMPION may have Howl **or** Rank, not both in CORE  
BALANCE_RISK: Rank-locking two bodies is a corridor prison. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe (and would not grant anyway).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rank-fold`

NAME: Rank Fold  
ROLE: POSITION — swap two player-side bodies that share a rank  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `rank_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `rank_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **only if** they share `y` and `dx ≠ 0`. If fewer than two, or they share a file (`x`) instead, or they sit on a diagonal, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideShareRank":true,"foldDamage":6}`). Distinct from Mid Fold (shared rank **or** file, any distance on the axis), File Fold (#533 `BOSS_ONLY` on `file_regent`), Diag Fold (`|dx|==|dy|`), Adj Fold (Chebyshev 1), Reach Fold (Chebyshev exactly 2), Knight Fold ((2,1) from midpoint), Sovereign Fold (any two), Pawn Trade (two hostiles-to-caster), Court Lag (#849 mass CD lag). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_share_rank"`. **Boss AI only.** Skip if 0–1 player-side bodies or they do not share a rank.  
PLAYER_COUNTERPLAY: Fight without a summon; stand on different ranks; False Retreat decoy as the second body  
SYNERGIES: Rank Fold identity; Claim Ward (anti-swap **cell** does not block this — fold is unit swap, not cell claim; **explicit** so implementers do not merge the keys)  
BALANCE_RISK: Forced same-rank player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`. Do not restamp #836 `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister`. Do not restamp `court_lag_regent` / `diag_fold_regent` / `mid_fold_regent`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 14 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…13 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥14 | `spell-rank-stride`, `spell-screen-bite` |
| `rank_lancer` | RARE / G≥14 | `spell-rank-stride` |
| `shadow_lurker` | RARE / G≥14 | `spell-screen-bite` |
| `glass_sniper` | RARE / G≥14 | `spell-penta-oath` |
| `glass_sniper` | ELITE | `spell-watch-bank` |
| `pale_cantor` | RARE / G≥14 | `spell-penta-oath`, `spell-shove-gift` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-equal-gift` (healer CORE only) |
| `tide_shade` | RARE / G≥14 | `spell-mire-skip` |
| `plague_rat` | RARE / G≥14 | `spell-mire-skip`, `spell-spike-reel` |
| `glyph_sower` | RARE / G≥14 | `spell-spike-reel`, `spell-swap-mark` |
| `bone_scribe` | RARE / G≥14 | `spell-swap-mark` |
| `bone_scribe` / `purse_scribe` | ELITE | `spell-tied-gait` |
| `plate_warden` | ADVANCED / G≥14 | `spell-odd-plate`, `spell-odd-sting` |
| `iron_golem` | ADVANCED / G≥14 | `spell-odd-plate`, `spell-odd-sting` |
| `stone_castellan` | RARE / G≥14 | `spell-brick-step` |
| `rime_mason` | RARE / G≥14 | `spell-brick-step` |
| `brood_chanter` | ELITE | `spell-summon-verse` |
| `cadence_thief` | RARE / G≥14 | `spell-cadence-floor` |
| `hex_chorister` | RARE / G≥14 | `spell-cadence-floor` |
| `tax_scribe` | RARE / G≥14 | `spell-cast-toll` |
| `ley_tollkeeper` | RARE / G≥14 | `spell-cast-toll` |
| `hood_lurker` | ELITE | `spell-watch-bank` |
| `null_censor` | ELITE | `spell-portal-cut` |
| `void_mirror` | ELITE | `spell-portal-cut` |
| `coil_arbiter` | RARE / G≥14 | `spell-shove-gift` |
| `rank_precentor` CHAMPION | SIGNATURE | `spell-pack-rank` (`ENEMY_ONLY`; not with Pack File / Pack Cap / Pack Long / Pack Close on the same BASE kit) |
| `rank_fold_regent` | BOSS_ONLY | `spell-rank-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-14 family CORE consumes #802 and #849 (**#899**)

Same-day **#899** is the Wave-14 enemy/elite family sheet. It puts remaining **#802** unique Wave-12 verbs (minus Dry Gait / Pack Cap / Reach Fold) and **#849** tactical Wave-13 ids (minus Court Lag) in **CORE** for new families (`gaunt_mender` … `axis_cutter`). Unique §11 ids may appear there only as G≥14 extras in a later family pass (Wave 15), not as this document’s CORE and **not** as #899 CORE. Do **not** put unique §11 ids in #840 CORE (#747 + #787), #796 CORE (#679 + #726), #752 CORE, or #899 CORE. Do **not** name unique §11 families after #899 `ENEMY_ID`s.

Stamp, do not clone #802: Orth Stride, Tri Oath, Brick Reel, Lone Bite, Wake Mark, Gait Plate, Glyph Skip, Full Gait, Summon Gait, Still Gift, Cadence Grace, Cast Debt, Brick Orbit, Watch Alms, Pair Gait, Leash Cut, Dry Gait. Pack Cap stays `ENEMY_ONLY` on `cap_precentor`. Reach Fold stays `BOSS_ONLY` on `reach_fold_regent`. **Do not ship** `spell-parched-mend`. Leash Cut’s #899 family is `axis_cutter` (Wave 8 already claimed `leash_cutter`).

Stamp, do not clone #849: Gaunt Mend, Cadence Lag, Oct Span (implementation-blocked while summon cap is 2), Even Hood, Gaunt Sting, Gaunt Step, Gaunt Sill, Odd Hold, Gaunt Lend, Bare Sip, Gaunt Post, Gaunt Bounce, Must Gaunt, Verse Gaunt, Gaunt Hold. Court Lag stays `NOT_PLAYER_LEARNABLE` on `court_lag_regent`. Do **not** CORE Must Gaunt with Gaunt Hold.

### 12.2 Wave-13 unique extras (deferred)

#837 unique Wave-13 verbs (`spell-knight-stride` … `spell-diag-fold`) stay G≥13 extras until Wave 15 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack File stays `ENEMY_ONLY` on `file_precentor`. Diag Fold stays `BOSS_ONLY` on `diag_fold_regent`.

### 12.3 Same-day tactical CORE (**#890** → Wave 15)

Same-day **#890** is Wave-14 tactical. Stamp it as Wave **15** family CORE. Do **not** put those ids in Wave-14 / #899 family CORE. Unique §11 stay this catalog’s. **SDE wins** `spell-cadence-floor`; stamp Poise Mend / Nine Span / Bar Cross / Poise Hood … Court Floor, not a second Cadence Floor. Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` — do not restamp.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 15 forever

Same recipe as Wave 13 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 15 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #849 extra doors. Do not restamp #837 rooms. Do not restamp #836 extra doors. Do not restamp #890 extra doors. Do not restamp #899 family ids. Do not consume #771 primer room ids. Do not consume #826 / #885 ENC-* ids.

Suggested Wave-15 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-13 §11 verbs **and** #890 (this catalog’s unique ids stay extras until then; **SDE already won** Cadence Floor). Invert leftover AP↔MP is **Wave 3 Tempo Invert**. Two-body leftover cross is **#890 Bar Cross**. Eight-cell occupy is **#849 Oct Span**. Nine-cell occupy is **#890 Nine Span**. Four-body both-pools-empty heal is **#849 Gaunt Mend**. Remaining `n>0`→`n+2` is **#849 Cadence Lag**. Target both-pools-empty heal is #837 Hollow Gift. Both leftover-MP=0 heal is #802 Dry Gait (**not** #787 Parched Mend). Target equal leftover ≥ 1 heal is this wave’s Equal Gift. Both-body equal leftover ≥ 1 heal is **#890 Poise Mend**. CD floor is this wave’s Cadence Floor (**SDE wins** vs #890). Rank Fold stays `BOSS_ONLY` on `rank_fold_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / #802 / #808 / **#837** / **#849** / **#836** / **#890** / **#899** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W14-A. G≥14 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W14-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W14-C. Wave-14 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #802 / #837 / #849 / #890 / memory Wave-5 ids; a second `spell-cadence-floor` |
| W14-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `orth_gallery` / `knight_gallery` / `even_gallery` / `pit_aisle` / `span_penta` / `span_nine` / #771 primer rooms / #885 ENC-* |
| W14-E. Spike Reel attract caller | `applyAttract` toward nearest spike | Damage-math rewrite; RAF; treating dest as `map.portals` or painted pits |
| W14-F. Brick Step occupancy dest | `isCellFree` far cell | `mapGen.ts`; skipping `finalizePlayableLayout` on generate; writing `currentView` |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Rank Stride consume, Swap Mark detonate, Odd Plate consume, Mire Skip consume, and Watch Bank consume read flags at walk / teleport-landing / incoming-hit / overwatch-snap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 13 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W14-1 | Encounter start | Possessed-but-unused G14 id does not observe |
| W14-2 | Rank Stride dest with `dest.y ≠ arm.y` | Confirm fails; MP not spent; Rank Stride already observed |
| W14-3 | `rank_gallery` defeat | Does not grant. Victory grants once |
| W14-4 | `orth_gallery` / `even_gallery` / `knight_gallery` / `rank-lock` | Do not grant Rank Stride |
| W14-5 | Penta Oath then Frost at Chebyshev 3, 4, or 6 | Confirm fails; Strike still legal |
| W14-6 | Spike Reel no spike | Fizzle observes; no pull. Dest is not `map.portals` and not a painted pit |
| W14-7 | Screen Bite with clear LoS | 10 only. Rear Cut would want adjacent flank. Gate Sight would ignore a barrier |
| W14-8 | Swap Mark walk-enter / shove-landing | No detonate. Ingress would detonate on walk. Shove Mark would detonate on force-move |
| W14-9 | Odd Plate hit while leftover AP is even | Full hit; charge remains. Hit while leftover AP odd consumes |
| W14-10 | Mire Skip across rime / glyph-tax / lava / length 2 | Those taxes still tick. Skip is mire enter-tax + length 1 only |
| W14-11 | Odd Sting leftover AP 0 or 2 | 10 only. Gaunt Sting would want both leftover 0. Pair Purse would want leftover AP exactly 2 |
| W14-12 | Summon Verse vs Summon Cast vs Summon Toll | Pets pay AP to **recast last id** vs pay AP to **any spell** vs pay AP to **walk** |
| W14-13 | Equal Gift after leftover 0=0 or 3≠1 | Fizzle observes; no heal. Hollow Gift would want 0=0. Gaunt Mend would want four leftover-0 reads. Poise Mend would want **both bodies** equal ≥ 1. Tempo Invert would swap the pools |
| W14-14 | Cadence Floor vs Lag vs Crack vs Halve | Remaining `n>1` → 1 vs `n>0` → n+2 vs → 0 vs ÷2. One `spell-cadence-floor` id (SDE wins vs #890) |
| W14-15 | Cast Toll after they spelled or walked | Fizzle observes. Strike Debt would tax a post-Strike **walk**. Spent Tax would tax a post-walk **spell** |
| W14-16 | Brick Step dest occupied / portal / void | Fizzle observes; no relocate. Brick Nudge would move the barrier |
| W14-17 | Watch Bank vs Alms vs Sip vs Dual Keep | Snap banks leftover AP vs grants now vs steals vs banks AP **and** MP without overwatch |
| W14-18 | Tied Gait leftover 2/1, 0/0, or 2/3 | 10 only. Pair Gait would bonus leftover MP exactly 2. Equal Gift would **heal** 2=2 |
| W14-19 | Portal Cut far from `map.portals` / on a Twin Gate pad | 10 only. Hazard Cut would want painted hazard. Void Reel would pull toward void/portal |
| W14-20 | Shove Gift after another body shoved them, or after a voluntary walk | Fizzle observes. Drift Gift would accept anyone’s force-move. Heave Mend would want **both** force-moved |
| W14-21 | Pack Rank / Rank Fold | Never in `ownedSpellIds` |
| W14-22 | Loaner / `WF-SPL-*` / #771 primer / #826 ENC-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W14-23 | G=13 Tide | No Rank Stride / Cast Toll (`generationMin: 14`) |
| W14-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W14-25 | No cloned ids | Unique §11 ids absent from #802 / #837 / #849 catalogs except **SDE-won** `spell-cadence-floor` vs #890 |
| W14-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Cast Toll / Summon Verse / Pack Rank / Watch Bank are flags |
| W14-27 | Hex Toll | Still not in any SDE pool |
| W14-28 | Memory Wave-5 / Wave-13 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W14-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W14-30 | #849 extra doors | `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent` not restamped |
| W14-30b | #837 rooms / doors | `knight_gallery` / `file_precentor` / `diag_fold_regent` not restamped |
| W14-30c | #836 extra doors | `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` not restamped |
| W14-30d | #890 extra doors | `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` not restamped |
| W14-30e | #899 family ids | Unique §11 not CORE on `gaunt_mender` … `axis_cutter`. `rank_precentor` / `rank_fold_regent` not #899 ids |
| W14-31 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–13, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, **#837**, **#849**, or **#890** cards (except the Cadence Floor collision, which SDE wins)
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / **#836** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / #679 / #695 / #726 / #747 / #753 / #787 / #802 / #808 / **#836** / **#837** / **#849** / **#890** extra doors or **#899** family ids
- Consuming #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` as spell grants
- Consuming #826 `ENC-TEACH-13` / `ENC-SPELL-25` / `ENC-NEAR-01` / other 2026-10-21 ENC-* as spell grants
- Consuming #885 `ENC-TEACH-14` / `ENC-SPELL-27` / `ENC-SPIKE-01` / `ENC-INCH-01` / `ENC-FOLD-01` / other 2026-10-22 ENC-* as spell grants
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `orth_gallery` / `diag_gallery` / `knight_gallery` / `even_gallery` / `odd_gallery` / `pair_gallery` / `inch_gallery` / `pit_aisle` / `quad_nave` / `span_penta` as Rank Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #752 CORE, #796 CORE, #840 CORE, Wave-14 #802/#849 CORE, or **#899** CORE
- Cloning #802 (`spell-orth-stride` … `spell-reach-fold`), #837 (`spell-knight-stride` … `spell-diag-fold`), #849 (`spell-gaunt-mend` … `spell-court-lag`), or #890 (`spell-poise-mend` … `spell-court-floor`) into unique §11
- Minting `spell-file-stride` / `spell-nona-span` / `spell-octa-span` / `spell-even-plate` / `spell-gaunt-floor` / `spell-hollow-mend` / `spell-cadence-trade` / `spell-parched-mend` / `spell-tempo-mirror` / `spell-tied-mend` / `spell-equal-mend` / `spell-tempo-cross`
- Shipping `spell-parched-mend` alongside Dry Gait
- Shipping a second `spell-cadence-floor` from #890
- Cloning Tempo Invert as Equal Gift, Pack File as Pack Rank, Spent Plate as Odd Plate, Cadence Lag as Cadence Floor, or Poise Mend as Equal Gift

---

## 17. Wave-14 index

**Unique SDE ids (19):** rank-stride, penta-oath, spike-reel, screen-bite, swap-mark, odd-plate, mire-skip, odd-sting, summon-verse, equal-gift, cadence-floor, cast-toll, brick-step, watch-bank, tied-gait, portal-cut, shove-gift, pack-rank, rank-fold.

**#802 stamps (do not clone; Wave-14 family CORE):** Orth Stride, Tri Oath, Brick Reel, Lone Bite, Wake Mark, Gait Plate, Glyph Skip, Full Gait, Summon Gait, Still Gift, Cadence Grace, Cast Debt, Brick Orbit, Watch Alms, Pair Gait, Leash Cut, Dry Gait, Pack Cap, Reach Fold.

**#849 stamps (do not clone; Wave-14 family CORE via #899):** Gaunt Mend, Cadence Lag, Oct Span, Even Hood, Gaunt Sting, Gaunt Step, Gaunt Sill, Odd Hold, Gaunt Lend, Bare Sip, Gaunt Post, Gaunt Bounce, Must Gaunt, Verse Gaunt, Gaunt Hold, Court Lag.

**#899 Wave-14 families (do not clone / do not CORE unique §11):** `gaunt_mender` … `axis_cutter` (31 sheets). Leash Cut family is `axis_cutter`.

**#837 stamps (do not clone; Wave-15 family CORE):** Knight Stride, Quad Oath, Pit Reel, Axis Bite, Shove Mark, Spent Plate, Rime Skip, Full Sting, Summon Cast, Hollow Gift, Cadence Swap, Strike Debt, Brick Nudge, Watch Sip, Lone Gait, Hazard Cut, Drift Gift, Pack File, Diag Fold.

**#890 stamps (do not clone; Wave-15 family CORE; Cadence Floor is SDE’s):** Poise Mend, Nine Span, Bar Cross, Poise Hood, Poise Sting, Poise Step, Poise Sill, Poise Hold, Poise Lend, Poise Sip, Poise Post, Poise Bounce, Must Poise, Verse Poise, Court Floor.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-rank-stride` | ENEMY_DISCOVERY | yes | blink / rank_lancer G≥14 | **One** next walk must share rank (same y) |
| `spell-penta-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 5 |
| `spell-spike-reel` | ENEMY_DISCOVERY | yes | glyph / plague | Pull 1 toward nearest spike |
| `spell-screen-bite` | ENEMY_DISCOVERY | yes | blink / lurker | Bonus if Bresenham is blocked |
| `spell-swap-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates on **teleport/swap landing** |
| `spell-odd-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit is 0 while leftover AP is odd |
| `spell-mire-skip` | ENEMY_DISCOVERY | yes | tide / plague | 1-tile walk ignores mire enter-tax |
| `spell-odd-sting` | ENEMY_DISCOVERY | yes | plate / golem | Leftover AP odd → bonus damage |
| `spell-summon-verse` | ELITE | yes | brood_chanter | Allied summons pay +1 AP to recast last id |
| `spell-equal-gift` | ELITE | yes | pale / font cantor | Heal iff leftover AP **equals** leftover MP and both ≥ 1 |
| `spell-cadence-floor` | ENEMY_DISCOVERY | yes | cadence / hex | Remaining `n>1` → 1; zeros stay 0 |
| `spell-cast-toll` | ENEMY_DISCOVERY | yes | tax / ley | Next spell +1 AP if they **Struck** last turn |
| `spell-brick-step` | ENEMY_DISCOVERY | yes | stone / rime | Step through an adjacent barrier |
| `spell-watch-bank` | ELITE | yes | glass / hood | Overwatch snap banks 1 leftover AP on the walker |
| `spell-tied-gait` | ELITE | yes | purse / scribe | Bonus if leftover AP **and** leftover MP are both exactly 2 |
| `spell-portal-cut` | ELITE | yes | null / void | Bonus if target is Chebyshev ≤ 2 from a world portal |
| `spell-shove-gift` | ENEMY_DISCOVERY | yes | coil / cantor | Heal iff **this caster** force-moved the target |
| `spell-pack-rank` | ENEMY_ONLY | no | `rank_precentor` CHAMPION | Pack walks locked to the champion rank |
| `spell-rank-fold` | BOSS_ONLY | no | `rank_fold_regent` | Swap two player-side bodies that share a rank |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-13 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with **#899** so Orth Stride / Gaunt Mend / Cadence Lag / Oct Span land once as Wave-14 family CORE. Coordinate with #802 / #849 so those verbs are not cloned. Coordinate with #837 so Knight Stride / Hollow Gift / Cadence Swap stay Wave-15 CORE, not this CORE. Coordinate with **#890** so Poise Mend / Nine Span / Bar Cross land once as Wave-15 family CORE and so **one** `spell-cadence-floor` ships (this catalog’s). Not a license to land combat code in the same change as this spec.
