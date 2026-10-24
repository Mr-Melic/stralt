# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 16

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-24  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–15 are Generations 3–15. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Waves 6–15 are still-open #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 / #906 / **#962**. This document is **Generation 16**. `generationMin: 16`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

**Gap note.** The last SDE wave PR is **#962** (2026-10-23). This pass does **not** skip generations and does **not** mint Waves 17–35. It is the next sequential generation.

**CDA freeze vs this catalog.** Still-open **#942** `CDA-2026-10-23-029` and same-day **#982** `CDA-2026-10-24-030` freeze **shipping** Wave-15/16 live catalog rows until Wave-1 ownership / observe / G resolve exist. This document is sequential Generation 16 **design only** (`STATUS: PROPOSED`). It does not append ids to `starterSpells`, does not implement combat, and is **not** Wave 17.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-24.md`](./ACTION_IDS_SDE_2026-10-24.md).

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
| Wave-6…13 discovery contracts | still-open #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 | G≥6…13 extra slots and those unique catalogs |
| Wave-14 discovery contract | still-open **#906** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md` | G≥14 extra slot, W14 unique ids. **Stamp onto Wave-16 family CORE, do not clone** |
| Wave-15 discovery contract | still-open **#962** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md` | G≥15 extra slot, W15 unique ids, #837 / #890 stamps. Unique §11 stay extras until Wave 17 |
| Wave-1…15 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-10-23.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 / #729 / #791 / #815 / #892 / **#940** | `ownedSpellIds` / `observedSpellIds`, soft-retire. **#870** / **#946** are Master Technical Director roadmaps — **not** tactical catalogs |
| Tactical gap-fillers W1…W14 | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 | Reserved in §0.1 |
| Tactical gap-fillers W15 | still-open **#953** — `SPELL_PROPOSALS_2026-10-23.md` | Tally Mend … Court Prime. **Stamp as Wave 16 family CORE, do not clone**. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` — do not restamp. Cadence Prime is remaining `0→1`; Cadence Cap is remaining `n>2` → `2`. **SDE wins** unique §11 if a hole collides |
| Tactical gap-fillers W16 | still-open **#1011** — `SPELL_PROPOSALS_2026-10-24.md` | Score Mend … Court Snuff. **Stamp as Wave 17 family CORE, do not clone**. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp. Score Mend is both-body leftover **sum === 4 AND unequal**. Cadence Snuff is remaining `1→0`. Hendeca Span is eleven-cell occupy. Duel Turn is two-hostile independent invert. **SDE wins** unique §11 (Prime Gift stays 1/1; Cadence Cap stays `n>2→2`; Dual Plate stays AND even ≥ 2) |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + #686 + #752 + #796 + #840 + #899 + #941 + **#997** | **#997** Wave-16 families (31 sheets) consume unique **#906** Wave-14 verbs (minus Pack Rank / Rank Fold / Cadence Floor) **and** **#953** (except Court Prime). Unique §11 stay extras until Wave 18. Unique Wave-15 §11 stay extras until Wave 17. **#1011** stamps as Wave **17** family CORE. Do **not** put unique §11 ids in #899 / #941 / #997 CORE. Do **not** restamp #997 `ENEMY_ID`s |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 + #951 + **#1004** | #951 Wave-16 extra doors `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. **#1004** Wave-17 extra doors `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` — do not restamp |
| Same-day world dynamics | still-open **#949** / **#993** | `WF-*` Wave-15 and Wave-16 overlays. Not spell catalogs. Do not consume |
| Same-day spell admin | still-open **#940** / **#1007** | SDA 2026-10-23 and 2026-10-24. Soft-retire / tooling. Do not re-file those ACTION_IDs |
| Same-day encounter admin | still-open **#932** | Occupancy unseals and persist-keep rails. Not a spell catalog |
| Same-day content freeze | still-open **#942** / **#982** | `CDA-029` / `CDA-030` freeze **shipping** Wave-15/16 live rows until live gates. This document is sequential **Generation 16 design**, not a ship, and not Wave 17 |
| Same-day encounter primer | #771 — Bash/Dry/Hood catalog | Room ids `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`. Not a spell catalog. Do not consume |
| Prior-day encounter catalogs | still-open **#826** / **#885** / **#957** | ENC-* tables. Not spell catalogs. Do not consume. `ENC-INCH-01` is Inch Stride, not Ring Stride. `ENC-SPIKE-01` is Spike Skip, not Rift Skip. `ENC-FOLD-01` is a wall fold, not Leap Fold. `ENC-DRY-02` is Dry Plate, not Dual Plate |
| Same-day encounter catalog | still-open **#1006** | `ENC-GAUNT-01` / `ENC-BARE-01` / `ENC-EVEN-02` / `ENC-WAKE-01` / `ENC-GATE-03` / `ENC-TRI-01` / `ENC-DUMP-01` / `ENC-CURTAIN-01` / `ENC-RUNE-01`. Not spell grants. Do not consume. `ENC-EVEN-02` is not Even Gait. `ENC-TRI-01` is not Hepta Oath |
| Same-day roadmap | still-open **#998** | Master Technical Director 2026-10-24 — **not** a tactical catalog |
| PX coherence | #343 / #393 / #481 / #579 / #632 / #744 / #784 / #844 / #907 / #955 / **#1008** | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-16 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

At audit start (2026-10-24 00:00 UTC) no `SPELL_PROPOSALS_2026-10-24.md` existed. Same-day **#997** opened as the Wave-16 family sheet and **does** consume **#906 + #953** (not unique §11). Same-day **#1004** opened Wave-17 boss extra doors. Same-day **#1006** opened ENC-* rooms. Same-day **#1011** opened as the Wave-16 tactical catalog — **stamp it as Wave 17 family CORE** and do not clone its ids into unique §11. Unique §11 stay extras until Wave **18** families. Unique Wave-15 §11 stay extras until Wave **17**. **SDE wins** unique leftover collisions (Prime Gift stays 1/1, not Score Mend; Cadence Cap stays `n>2→2`, not Cadence Snuff; Dual Plate stays AND even ≥ 2, not Score Hood).

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

**#849 tactical Wave 13:** `spell-gaunt-mend`, `spell-cadence-lag`, `spell-oct-span`, `spell-even-hood`, `spell-gaunt-sting`, `spell-gaunt-step`, `spell-gaunt-sill`, `spell-odd-hold`, `spell-gaunt-lend`, `spell-bare-sip`, `spell-gaunt-post`, `spell-gaunt-bounce`, `spell-must-gaunt`, `spell-verse-gaunt`, `spell-gaunt-hold`, `spell-court-lag`.

**#890 tactical Wave 14:** `spell-poise-mend`, `spell-cadence-floor` (**#906 unique §11 owns this id**; #890 must not ship a second copy), `spell-nine-span`, `spell-bar-cross`, `spell-poise-hood`, `spell-poise-sting`, `spell-poise-step`, `spell-poise-sill`, `spell-poise-hold`, `spell-poise-lend`, `spell-poise-sip`, `spell-poise-post`, `spell-poise-bounce`, `spell-must-poise`, `spell-verse-poise`, `spell-court-floor`.

**Wave 14 SDE (#906):** `spell-rank-stride`, `spell-penta-oath`, `spell-spike-reel`, `spell-screen-bite`, `spell-swap-mark`, `spell-odd-plate`, `spell-mire-skip`, `spell-odd-sting`, `spell-summon-verse`, `spell-equal-gift`, `spell-cadence-floor`, `spell-cast-toll`, `spell-brick-step`, `spell-watch-bank`, `spell-tied-gait`, `spell-portal-cut`, `spell-shove-gift`, `spell-pack-rank`, `spell-rank-fold`.

**#953 tactical Wave 15 (stamp as Wave 16 family CORE, do not clone):** `spell-tally-mend`, `spell-cadence-prime`, `spell-dec-span`, `spell-purse-turn`, `spell-tally-hood`, `spell-tally-sting`, `spell-tally-step`, `spell-tally-sill`, `spell-tally-hold`, `spell-tally-lend`, `spell-tally-sip`, `spell-tally-post`, `spell-tally-bounce`, `spell-must-tally`, `spell-verse-tally`, `spell-court-prime`. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` — do not restamp. Cadence Prime is remaining `n===0` → `1`. Cadence Cap is remaining `n>2` → `2`. Tally Mend is both-body leftover **sum === 3**. Prime Gift is leftover AP **exactly 1** and leftover MP **exactly 1**. Dec Span is ten-cell occupy. Do **not** mint `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm` / `spell-even-plate`.

**Wave 15 SDE (#962):** `spell-file-stride`, `spell-hexa-oath`, `spell-lava-reel`, `spell-file-bite`, `spell-strike-mark`, `spell-dry-plate`, `spell-shock-skip`, `spell-even-sting`, `spell-summon-rank`, `spell-lean-gift`, `spell-cadence-rise`, `spell-still-toll`, `spell-brick-brace`, `spell-watch-root`, `spell-odd-gait`, `spell-spike-cut`, `spell-summon-plate`, `spell-pack-diag`, `spell-far-fold`.

**#1011 tactical Wave 16 (stamp as Wave 17 family CORE, do not clone):** `spell-score-mend`, `spell-cadence-snuff`, `spell-hendeca-span`, `spell-duel-turn`, `spell-score-hood`, `spell-score-sting`, `spell-score-step`, `spell-score-sill`, `spell-score-hold`, `spell-score-lend`, `spell-score-sip`, `spell-score-post`, `spell-score-bounce`, `spell-must-score`, `spell-verse-score`, `spell-court-snuff`. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp. Score Mend is both-body leftover **sum === 4 AND unequal**. Cadence Snuff is remaining `n===1` → `0`. Hendeca Span is eleven-cell occupy. Duel Turn is two-hostile independent invert. Court Snuff never owned. Do **not** mint `spell-score-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop`.

**Do not alias** `spell-ring-stride` ↔ `spell-rank-stride` / `spell-file-stride` / `spell-pair-stride` / `spell-inch-stride` / `spell-knight-stride` / `spell-orth-stride` / `spell-diag-stride` / `spell-must-span`, `spell-hepta-oath` ↔ `spell-hexa-oath` / `spell-penta-oath` / `spell-quad-oath` / `spell-sept-span` / `spell-long-oath` / `spell-far-hood`, `spell-rime-reel` ↔ `spell-lava-reel` / `spell-spike-reel` / `spell-pit-reel` / `spell-void-reel` / `spell-brick-reel` / `spell-rime-skip` / `spell-hook-line`, `spell-rank-bite` ↔ `spell-file-bite` / `spell-axis-bite` / `spell-file-lance` / `spell-screen-bite` / `spell-rear-cut`, `spell-last-mark` ↔ `spell-strike-mark` / `spell-cast-mark` / `spell-swap-mark` / `spell-shove-mark` / `spell-ingress-mark` / `spell-dwell-mark` / `spell-stride-mark`, `spell-dual-plate` ↔ `spell-dry-plate` / `spell-odd-plate` / `spell-spent-plate` / `spell-even-plate` / `spell-poise-hood` / `spell-even-sting`, `spell-rift-skip` ↔ `spell-shock-skip` / `spell-spike-skip` / `spell-rime-skip` / `spell-glyph-skip` / `spell-gap-ward` / `spell-void-span`, `spell-fresh-sting` ↔ `spell-full-sting` / `spell-even-sting` / `spell-odd-sting` / `spell-gaunt-sting` / `spell-dry-sting`, `spell-summon-file` ↔ `spell-summon-rank` / `spell-summon-toll` / `spell-pack-file` / `spell-summon-verse`, `spell-prime-gift` ↔ `spell-lean-gift` / `spell-equal-gift` / `spell-tally-mend` / `spell-poise-mend` / `spell-hollow-gift`, `spell-cadence-cap` ↔ `spell-cadence-floor` / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-stall` / `spell-cadence-lag` / `spell-pack-cap`, `spell-gait-toll` ↔ `spell-still-toll` / `spell-walk-toll` / `spell-gait-tax` / `spell-strike-debt` / `spell-cast-toll`, `spell-brick-hold` ↔ `spell-brick-brace` / `spell-poise-hold` / `spell-hold-ground` / `spell-brick-step`, `spell-watch-drain` ↔ `spell-watch-root` / `spell-watch-sip` / `spell-watch-bank` / `spell-watch-fee`, `spell-even-gait` ↔ `spell-odd-gait` / `spell-even-sting` / `spell-lone-gait` / `spell-pair-gait` / `spell-full-gait`, `spell-rime-cut` ↔ `spell-spike-cut` / `spell-hazard-cut` / `spell-portal-cut` / `spell-rime-reel` / `spell-rime-skip`, `spell-cast-plate` ↔ `spell-summon-plate` / `spell-mute-thread` / `spell-quiet-hex` / `spell-split-plate`, `spell-pack-orth` ↔ `spell-pack-diag` / `spell-pack-file` / `spell-pack-rank` / `spell-orth-stride` / `spell-rank-lock`, `spell-leap-fold` ↔ `spell-far-fold` / `spell-reach-fold` / `spell-adj-fold` / `spell-rank-fold` / `spell-file-fold` / `spell-diag-fold` / `spell-mid-fold`, `spell-prime-gift` ↔ `spell-score-mend`, `spell-cadence-cap` ↔ `spell-cadence-snuff`, `spell-dual-plate` ↔ `spell-score-hood`, `spell-hepta-oath` ↔ `spell-hendeca-span`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools. `spell-even-plate` stays tombstoned as a Dry Plate alias — Dual Plate is the AND-gate, not that id.

### 0.2 Unique Wave-14 CORE (#906 — stamp onto Wave-16 family CORE, do not clone)

#906 **owns** the G≥14 unique SDE holes. Wave 15 recorded them as extras until Wave 16. This document **consumes #906 as Wave-16 family CORE** (together with #953) and does **not** re-author those cards.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-rank-stride` | ENEMY_DISCOVERY | **One** next walk same **y**. Distinct from Ring Stride (Chebyshev **exactly 2**, knight excluded) |
| `spell-penta-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 5. Distinct from Hepta Oath (**exactly** 7) |
| `spell-spike-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **spike**. Distinct from Rime Reel (nearest **ice**) |
| `spell-screen-bite` | ENEMY_DISCOVERY | Bonus if Bresenham is **blocked**. Distinct from Rank Bite (**rank only**, LoS unread) |
| `spell-swap-mark` | ENEMY_DISCOVERY | Cell detonates on **teleport/swap landing**. Distinct from Last Mark (**last AP spent** on the cell) |
| `spell-odd-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover AP is **odd**. Distinct from Dual Plate (leftover AP **even ≥ 2** **and** leftover MP **even ≥ 2**) |
| `spell-mire-skip` | ENEMY_DISCOVERY | 1-tile walk ignores mire **enter-tax**. Distinct from Rift Skip (Void Rift walk-tax) |
| `spell-odd-sting` | ENEMY_DISCOVERY | Bonus if leftover AP is **odd**. Distinct from Fresh Sting (leftover AP **equals max AP**) |
| `spell-summon-verse` | ELITE | Pets pay +1 AP to **recast last id**. Distinct from Summon File (walk **off file**) |
| `spell-equal-gift` | ELITE | Heal iff leftover AP **equals** leftover MP **and both ≥ 1**. Distinct from Prime Gift (exactly **1/1**). **Healer CORE only** |
| `spell-cadence-floor` | ENEMY_DISCOVERY | Remaining `n>1` → 1. Distinct from Cadence Cap (`n>2` → **2**; 1s stay 1) |
| `spell-cast-toll` | ENEMY_DISCOVERY | Next spell +1 AP if they **Struck** last turn. Distinct from Gait Toll (next **walk** if leftover **MP = 0**) |
| `spell-brick-step` | ENEMY_DISCOVERY | Caster **steps through** an adjacent barrier. Distinct from Brick Hold (**cannot walk** while adjacent) |
| `spell-watch-bank` | ELITE | Overwatch snap **banks** 1 leftover AP. Distinct from Watch Drain (steals 1 leftover **MP**) |
| `spell-tied-gait` | ELITE | Bonus if leftover AP **and** leftover MP are both **exactly 2**. Distinct from Even Gait (leftover MP **even ≥ 2**, AP unread) |
| `spell-portal-cut` | ELITE | Bonus if Chebyshev ≤ 2 from a **world portal**. Distinct from Rime Cut (**ice occupancy**) |
| `spell-shove-gift` | ENEMY_DISCOVERY | Heal iff **this caster** force-moved the target. Distinct from Prime Gift (leftover 1/1). **Healer CORE only** |
| `spell-pack-rank` | ENEMY_ONLY | Pack walks locked to champion **rank**. Distinct from Pack Orth (orthogonal **any file/rank**). Never owned. Stays `rank_precentor` |
| `spell-rank-fold` | BOSS_ONLY | Swap two player-side bodies that **share a rank**. Distinct from Leap Fold (Chebyshev **exactly 3**). Never owned. Stays `rank_fold_regent` |

`rank_gallery` is **not** Ring Stride’s door. `penta_nave` is **not** Hepta Oath’s door. `spike_aisle` is **not** Rime Reel’s door. `rank_precentor` is **not** `lane_precentor`. `rank_fold_regent` is **not** `leap_fold_regent`.

### 0.2b Tactical Wave 15 (#953 — stamp as Wave 16 family CORE, do not clone)

#953 **owns** the G≥15 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-16 family CORE is **#906 unique Wave-14 verbs + #953** (except Court Prime; Tally Mend is healer CORE only). Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` — do not restamp. Do **not** mint `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm` / `spell-even-plate`.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-tally-mend` | MULTI_SOURCE | Heal iff **caster and target** leftover AP+MP **sum === 3**. Distinct from Prime Gift (**target** leftover 1 **and** 1). **Healer CORE only** |
| `spell-cadence-prime` | MULTI_SOURCE | Remaining `n===0` → `1`. Distinct from Cadence Cap (`n>2` → 2). `prime_precentor` stays #953’s door |
| `spell-dec-span` | MULTI_SOURCE | Axis-aligned 2×5 occupy, counts as **ten**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-purse-turn` | ENEMY_DISCOVERY | Invert leftover AP↔MP on a **hostile** body. Distinct from Tempo Invert (ally/self) and Bar Cross (two-body cross) |
| `spell-tally-hood` | ELITE | Next hit is 0 while leftover AP+MP **sum === 3**. Distinct from Dual Plate (both leftover **even ≥ 2**) |
| `spell-tally-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP+MP **sum === 3**. Distinct from Fresh Sting (leftover AP **equals max**) |
| `spell-tally-step` | ENEMY_DISCOVERY | Caster lands adjacent to an ally with leftover AP+MP sum === 3 |
| `spell-tally-sill` | ENEMY_DISCOVERY | Occupant with leftover AP+MP sum === 3 at **start of their turn** takes 8 |
| `spell-tally-hold` | ELITE | Cannot **walk** while leftover AP+MP sum === 3. Distinct from Brick Hold (adjacent **barrier**) |
| `spell-tally-lend` | ENEMY_DISCOVERY | +1 AP if the ally leftover AP+MP sum === 3 |
| `spell-tally-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP+MP sum === 3 |
| `spell-tally-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP+MP sum === 3 |
| `spell-tally-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP+MP sum === 3 |
| `spell-must-tally` | ELITE | Non-Strike illegal unless leftover AP+MP sum === 3 **and** the spell spends last AP |
| `spell-verse-tally` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP+MP sum === 3 |
| `spell-court-prime` | NOT_PLAYER_LEARNABLE | Mass Cadence Prime. Never owned. Distinct from Leap Fold (position swap) |

`tally_cantor` is **not** Prime Gift’s door. `prime_precentor` is **not** Cadence Cap’s door (`cadence_thief` / `hex_chorister` observe). `span_dec` is **not** Leap Fold’s door. `court_prime_regent` is **not** `leap_fold_regent`. Do not name unique §11 families `tally_mender` / `cadence_primer` / `rank_warder` / `poise_mender` / `gaunt_mender` / `rank_precentor` / `diag_precentor` / `file_precentor` (#997 / #941 / #899 own those).

### 0.2c Unique Wave-15 extras (#962 — stamp as Wave 17 extras, do not clone)

#962 **owns** the G≥15 unique SDE holes. This document does **not** consume them as Wave-16 family CORE. Unique Wave-15 §11 stay G≥15 extras until Wave 17 families consume them.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-file-stride` | ENEMY_DISCOVERY | **One** next walk same **x**. Distinct from Ring Stride (Chebyshev **exactly 2**) |
| `spell-hexa-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 6. Distinct from Hepta Oath (**exactly** 7) |
| `spell-lava-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **lava**. Distinct from Rime Reel (nearest **ice**) |
| `spell-file-bite` | ENEMY_DISCOVERY | Bonus if share **file only**. Distinct from Rank Bite (**rank only**) |
| `spell-strike-mark` | ENEMY_DISCOVERY | Cell detonates on **Strike from**. Distinct from Last Mark (**last AP spent** on the cell) |
| `spell-dry-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover **MP = 0**. Distinct from Dual Plate (both leftover **even ≥ 2**) |
| `spell-shock-skip` | ENEMY_DISCOVERY | 1-tile walk ignores shock-tile tax. Distinct from Rift Skip (Void Rift walk-tax) |
| `spell-even-sting` | ENEMY_DISCOVERY | Bonus if leftover AP is **even ≥ 2**. Distinct from Fresh Sting (leftover AP **equals max AP**) |
| `spell-summon-rank` | ELITE | Pets pay +1 AP to **walk off rank**. Distinct from Summon File (walk **off file**) |
| `spell-lean-gift` | ELITE | Heal iff leftover AP = 0 **and** leftover MP ≥ 1. Distinct from Prime Gift (**exactly 1/1**) |
| `spell-cadence-rise` | ENEMY_DISCOVERY | Remaining `n==1` → 2. Distinct from Cadence Cap (`n>2` → 2; 1s stay 1) |
| `spell-still-toll` | ENEMY_DISCOVERY | Next **spell** +1 AP if leftover **MP = 0**. Distinct from Gait Toll (next **walk**) |
| `spell-brick-brace` | ENEMY_DISCOVERY | Next hit is 0 if a barrier is **adjacent**. Distinct from Brick Hold (**cannot walk** while adjacent) |
| `spell-watch-root` | ELITE | Overwatch snap **zeros leftover MP**. Distinct from Watch Drain (steals **1** leftover MP) |
| `spell-odd-gait` | ENEMY_DISCOVERY | Bonus if leftover **MP is odd**. Distinct from Even Gait (leftover MP **even ≥ 2**) |
| `spell-spike-cut` | ELITE | Bonus if Chebyshev ≤ 2 from **spike occupancy**. Distinct from Rime Cut (**ice occupancy**) |
| `spell-summon-plate` | ELITE | Allied summons treat the next **incoming hit** as 0. Distinct from Cast Plate (next **outgoing non-Strike spell** deals 0) |
| `spell-pack-diag` | ENEMY_ONLY | Pack walks locked to champion **diagonal**. Distinct from Pack Orth (**orthogonal**). Never owned. Stays `diag_precentor` |
| `spell-far-fold` | BOSS_ONLY | Swap two player-side bodies at Chebyshev **exactly 4**. Distinct from Leap Fold (**exactly 3**). Never owned. Stays `far_fold_regent` |

`file_gallery` is **not** Ring Stride’s door. `hexa_nave` is **not** Hepta Oath’s door. `lava_aisle` is **not** Rime Reel’s door. `strike_pulpit` is **not** Last Mark’s door. `shock_nave` is **not** Rift Skip’s door.

### 0.2d Tactical Wave 16 (#1011 — stamp as Wave 17 family CORE, do not clone)

#1011 **owns** the G≥16 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-17 family CORE is **#962 unique Wave-15 verbs + #1011** (except Court Snuff; Score Mend is healer CORE only). Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp. Do **not** mint `spell-score-gift` / `spell-eleven-span` / `spell-undec-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-both-score`. **SDE wins** unique leftover collisions: Prime Gift stays leftover **1/1**, not both-body sum===4; Cadence Cap stays remaining `n>2` → `2`, not `1→0`; Dual Plate stays leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**, not Score Hood.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-score-mend` | MULTI_SOURCE | Heal iff **caster and target** leftover AP+MP **=== 4 AND unequal**. Legal pairs **(4,0) (0,4) (3,1) (1,3)**. (2,2) is Poise. (3,0)/(0,3) is Tally. Distinct from Prime Gift (**target** leftover 1 **and** 1). **Healer CORE only**. `score_cantor` stays #1011’s door |
| `spell-cadence-snuff` | MULTI_SOURCE | Remaining `n===1` → `0`; `n>1` unchanged. Distinct from Cadence Cap (`n>2` → 2) and Cadence Rise (`1→2`). `snuff_precentor` stays #1011’s door |
| `spell-hendeca-span` | MULTI_SOURCE | Stretched plus occupy, counts as **eleven**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked. `span_hendeca` stays #1011’s door |
| `spell-duel-turn` | ENEMY_DISCOVERY | Invert leftover AP↔MP independently on **two hostiles**; caster unchanged. Distinct from Purse Turn (one hostile) and Tempo Invert (ally/self) |
| `spell-score-hood` | ELITE | Next hit is 0 while leftover AP+MP **=== 4 AND unequal**. Distinct from Dual Plate (both leftover **even ≥ 2**) |
| `spell-score-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP+MP **=== 4 AND unequal**. Distinct from Fresh Sting (leftover AP **equals max**) |
| `spell-score-step` | ENEMY_DISCOVERY | Caster lands adjacent to a body with leftover AP+MP === 4 unequal |
| `spell-score-sill` | ENEMY_DISCOVERY | Occupant with leftover AP+MP === 4 unequal at **start of their turn** takes tax |
| `spell-score-hold` | ELITE | Cannot **walk** while leftover AP+MP === 4 unequal. Distinct from Brick Hold (adjacent **barrier**) |
| `spell-score-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP iff the ally leftover AP+MP === 4 unequal (exits the window) |
| `spell-score-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP+MP === 4 unequal |
| `spell-score-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP+MP === 4 unequal. Arm is observation; detonate is not a second observe |
| `spell-score-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP+MP === 4 unequal |
| `spell-must-score` | ELITE | Non-Strike illegal unless leftover AP+MP === 4 unequal **and** the spell spends last AP |
| `spell-verse-score` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP+MP === 4 unequal |
| `spell-court-snuff` | NOT_PLAYER_LEARNABLE | Mass Cadence Snuff. Never owned. Distinct from Leap Fold (position swap). Stays `court_snuff_regent` |

`score_cantor` is **not** Prime Gift’s door. `snuff_precentor` is **not** Cadence Cap’s door (`cadence_thief` / `hex_chorister` observe). `span_hendeca` is **not** Leap Fold’s door. `court_snuff_regent` is **not** `leap_fold_regent`. Do not name unique §11 families `score_mender` / `cadence_snuffer` / `hendeca_prelate` / `tally_mender` / `cadence_primer` (#997 / #941 / #899 own those slots; #1011 Wave-17 families will own the score-* ones).

### 0.3 Held holes (still not this pass)

Wave 15 §13 listed these as Wave-16/17 candidates. This wave **does not** fill them in unique §11 except the ones marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Eight-cell occupy | **#849 Oct Span owns this hole.** Do not clone |
| Nine-cell occupy (solid 3×3) | **#890 Nine Span owns this hole.** Do not clone. Live `ENEMY_SUMMON_CAP` is still 2 |
| Ten-cell occupy | **#953 Dec Span owns this hole.** Do not clone. Do not mint `spell-ten-span` |
| Eleven-cell occupy | **#1011 Hendeca Span owns this hole.** Do not clone. Do not mint `spell-eleven-span` |
| Both-body leftover AP+MP === 4 **and unequal** heal | **#1011 Score Mend owns this hole.** Do not clone. Prime Gift stays **1/1**. Do not mint `spell-score-gift` |
| Remaining CDs `n===1` → `0` | **#1011 Cadence Snuff owns this hole.** Distinct from Cadence Cap (`n>2` → 2) and Cadence Rise (`1→2`) |
| Two-hostile leftover AP↔MP invert | **#1011 Duel Turn owns this hole.** Distinct from Purse Turn (one hostile) |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Invert leftover AP ↔ leftover MP on one body | **Wave 3 Tempo Invert** (ally/self). Hostile invert is **#953 Purse Turn** |
| Two-body leftover AP ↔ leftover MP cross | **#890 Bar Cross owns this hole.** Do not clone |
| Heal if leftover AP **equals** leftover MP and **both ≥ 1** | **#906 Equal Gift**. Prime Gift is the **1/1** subset, not a clone of any equal ≥ 1 |
| Remaining CDs `n>1` → 1 (zeros stay 0) | **#906 Cadence Floor.** Cadence Cap is `n>2` → **2** |
| Remaining `0` → `1` | **#953 Cadence Prime.** Do not clone |
| One next walk must share **file** (same x) | **#962 File Stride.** Ring Stride is Chebyshev exactly 2, not a file lock |
| Dedicated CORE families for unique Wave-14 §11 verbs **and** #953 | **This catalog consumes them** as Wave-16 family CORE (§12.1) |
| Dedicated CORE families for unique Wave-15 §11 verbs | Unique Wave-15 §11 stay G≥15 extras until Wave 17. Wave 17 families consume them **and** **#1011** |
| Facing cards | Still fail closed until a battle `currentView` writer exists. **No new Wave-16 facing cards** |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-five calendar days after Wave 12, and one day after Wave 15, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Prime Gift / Cast Plate **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-16 unique ids stay `mpCost: 0`. Gait Toll / Summon File / Pack Orth / Watch Drain are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Rime Reel is attract-toward-**nearest ice occupancy**, a new dest flavor after Lava Reel (lava), Spike Reel (spike), Pit Reel (pit), Cinder Reel (hazard), Void Reel (void/portal), and Brick Reel (barrier) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-16 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Rime Cut reads **ice occupancy**, never `spell.name` |
| Live hazard types | `gameTypes.ts` 437 `HazardTileType` = `lava` \| `ice` \| `spikes` | Rime Reel / Rime Cut key off **ice**. Do not invent an ash occupancy |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21 **#814**…**#869**, then 2026-10-22 **#870**…**#927**, then 2026-10-23 **#930**…**#979**, then same-day **#980**…**#1013**. **#371 owns Wave-4 SDE. #906 owns Wave-14 SDE. #962 owns Wave-15 SDE. #953 owns Wave-15 tactical. #1011 owns Wave-16 tactical (Wave 17 family CORE). #941 owns Wave-15 families. #997 owns Wave-16 families. #951 owns Wave-16 extra boss doors. #1004 owns Wave-17 extra boss doors. #982 owns CDA-030. #1006 owns same-day ENC-*.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-15 P0 remain the prerequisite. **Do not land Wave-16 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 16 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥16 rares make it sharper: a CHAMPION may hold the generation-16 verb until a Chebyshev-2 landing / ice cell / leftover-1/1 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 16 fills holes Waves 1–15, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, **#962**, and **#1011** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Rank Stride, File Stride, Pair Stride, Knight Stride, Rank Lock, Pack Diag, File Bite, Axis Bite, Rime Skip, Cadence Floor, Cadence Rise, Cadence Prime, Cadence Snuff, Spike Cut, Lean Gift, Equal Gift, Tally Mend, Score Mend, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 16 stamps `generationMin: 16`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Gait Toll **adds 1 AP** to the next **walk** if leftover MP is 0. Summon File taxes **allied summons** 1 AP to walk off file. Pack Orth locks **walk orthogonal**. Watch Drain **steals 1 leftover MP**. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Loaner orbs / `WF-SPL-*` never write `ownedSpellIds`.**

---

## 3. Discovery state machine (unchanged; Wave-16 edges)

Wave 1 §3. Default path:

1. Enemy possesses an eligible player-learnable id.
2. Enemy **uses** it (`kind === "cast"` and AP spent).
3. Id becomes `OBSERVED` for this encounter (and persist-observed if the writer exists).
4. Player **wins the same encounter**.
5. Id becomes permanently unlocked in the Spell Library.

Wave-16 edges (additive):

| Event | Observes? |
| :--- | :--- |
| Encounter start, kit preview, telegraph | **No** |
| `spell-ring-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Ring Stride later walk confirm-fail (knight dest / Chebyshev ≠ 2) | Already observed on the arm |
| `spell-last-mark` **paint** | **Yes** — paint is the use |
| Last Mark later last-AP detonate | **No second observe** |
| `spell-dual-plate` **armed** | **Yes** |
| Dual Plate later negated hit | **No second observe** |
| `spell-rime-reel` AP spent, no ice in radius | **Yes** — fizzle after AP |
| `spell-prime-gift` AP spent, leftover not 1/1 | **Yes** — fizzle after AP |
| `spell-gait-toll` AP spent, leftover MP ≥ 1 | **Yes** — fizzle after AP |
| Illegal confirm (no AP) | **No** |
| `spell-pack-orth` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-leap-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Player-controlled summon casts | **No** |
| Defeat after observe | Observed may persist; **not** granted |

In-battle cue: `TECHNIQUE OBSERVED` (non-blocking, carved-stone / crimson).  
Victory recap: `NEW SPELL DISCOVERED` with name, role, AP, range, target type, key effect, source enemy.

---

## 4. Acquisition sources

| Source | Wave-16 use |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥16 family verbs in §11 **plus** #906 / #953 stamps in §0.2 / §0.2b / §12. **#1011** Duel Turn / score-* observe stamps as Wave 17 family CORE |
| `ACHIEVEMENT` | **None.** All 15 feat doors claimed or leftover. Never `unstoppable` / `level_10` |
| `CHALLENGE` | **None.** All nine challenge ids claimed through Wave 7 |
| `BOSS` | Leap Fold is `BOSS_ONLY` (not a grant). No new boss-grant MULTI this wave. Court Snuff stays `NOT_PLAYER_LEARNABLE` on `court_snuff_regent` |
| `ELITE` | Summon File, Prime Gift, Watch Drain, Rime Cut, Cast Plate. **#1011** Score Hood / Score Hold / Must Score stamp as Wave 17 extras |
| `SPECIAL_ENCOUNTER` | `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | Stamp #953 Tally Mend / Cadence Prime / Dec Span only. **#1011** Score Mend / Cadence Snuff / Hendeca Span stamp as Wave 17 MULTI. Unique §11 are not MULTI this wave |

### 4.1 Claimed doors (do not restamp)

Feat doors remain claimed as in Wave 15 §4.1. `survivor` leftover (Last Ember / Last Ward). `jackpot` is Absolve. `leader_slayer` is Crown Cut. `spell_master` is Full Bar.

Challenge doors remain claimed through Wave 7 (`easy_1` Bloodless Plate, `hard_1` Thin Ward, `legendary_1` Clean Blood, …).

Boss extra doors through **#951**: `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. **#1004**: `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. #890 `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #953 `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. **#1011**: `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp.

---

## 5. Learnable vs closed

| Flag | Wave-16 ids |
| :--- | :--- |
| `PLAYER_LEARNABLE` | Unique §11 except Pack Orth and Leap Fold |
| `ENEMY_ONLY` | `spell-pack-orth` on `lane_precentor` CHAMPION |
| `BOSS_ONLY` | `spell-leap-fold` on `leap_fold_regent` |
| `SYSTEM_ONLY` | None this wave |

---

## 6. Spell pool evolution (unbounded G)

```
R = enemyLevel - playerLevel
T = max(1, admin.tierSize)
G = floor(max(0, R) / T)
```

| G | Resolve |
| ---: | :--- |
| 0 | CORE only (+ Strike if empty) |
| 1 | CORE + one ADVANCED (`generationMin ≤ 1`) |
| 2 | ADVANCED guaranteed; one slot may be `generationMin ≤ 2`; RARE eligible |
| … | … |
| 15 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 15` |
| 16 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 16` |
| 17+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-15 G15 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **16** for families listed in §12. It remains a data query, not a constant in combat math.

Pool recipe (conceptual):

```
  1. CORE_POOL (always; generationMin 0)
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  …
  16. if G ≥ 16: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
```

Wave 1 §9.1 through Wave 15 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

Higher relative difficulty raises eligibility for ADVANCED / RARE / ELITE / SIGNATURE. Variant (VETERAN / CHAMPION), rarity, AI sophistication, family, achievement state, encounter type, and mechanic complexity remain legal gates. None of them is a last spell tier.

---

## 7. AI compatibility (Wave-16 hints)

New hints are predicates. Missing hint → drop the id from resolve, log once. Do not fall back to `spell.name`.

| `aiHint` | Required `aiProfile` | Predicate |
| :--- | :--- | :--- |
| `walk_chebyshev_2_not_knight` | flanker / kiter | Next walk dest Chebyshev === 2 and not `(|dx|,|dy|)==(2,1)`; skip if they must knight-step or step-1 to threaten and Strike is better |
| `next_spell_exact_chebyshev_7` | kiter / caster | Can occupy a cell from which a non-Strike target sits at Chebyshev 7 this turn; skip if not (use Strike / Hexa Oath) |
| `attract_toward_nearest_rime` | controller / caster | At least one ice occupancy in search radius; dest is that occupancy, never `map.portals` |
| `bonus_if_share_rank_with_caster` | flanker / bruiser | Target shares **y** with caster |
| `detonate_if_last_ap_on_cell` | controller | Paint a cell a spender is likely to empty AP on; skip if they always Strike-from (use Strike Mark) |
| `negate_hit_if_leftover_ap_even_ge2_and_mp_even_ge2` | tank / warden | Arm when own leftover AP even ≥ 2 **and** leftover MP even ≥ 2; skip if leftover AP odd (use Odd Plate) or leftover MP = 0 (use Dry Plate) |
| `skip_void_rift_tax_one_tile` | flanker / kiter | A 1-tile walk onto Void Rift occupancy is useful; skip if the tax is lava/spikes/ice |
| `bonus_if_leftover_ap_equals_max` | bruiser / caster | Target leftover AP === that body’s max AP (they have not spent AP this turn) |
| `summon_walk_off_file_ap_tax` | summoner | Living allied summon exists; skip if pack is already file-locked (Pack File) |
| `heal_if_leftover_ap_eq_1_and_mp_eq_1` | healer | Target leftover AP = 1 **and** leftover MP = 1 and missing HP ≥ 8; skip if leftover is 0/0 (Hollow Gift) or AP==MP ≥ 2 (Equal Gift). **Healer CORE only** |
| `cap_remaining_cds_gt_2_to_2` | controller / caster | Target has at least one remaining CD `n>2`; skip if all remaining are 0/1/2 (use Floor / Prime / Rise) |
| `tax_next_walk_if_leftover_mp_eq_0` | controller | Target leftover MP = 0; skip if leftover MP ≥ 1 (use Still Toll for the spell tax instead) |
| `cannot_walk_if_adjacent_barrier` | controller / tank | Target is adjacent to a barrier; skip if no barrier (use Poise Hold / Tally Hold for leftover gates) |
| `overwatch_snap_steal_walker_mp` | kiter / sniper | Arm overwatch on a tile a walker with leftover MP ≥ 1 will enter |
| `bonus_if_leftover_mp_even_ge2` | bruiser / caster | Target leftover MP even ≥ 2; skip if leftover MP odd (Odd Gait) or 0 (Dry Sting) |
| `bonus_if_near_rime_occupancy` | flanker / controller | Target Chebyshev ≤ 2 from ice occupancy |
| `next_non_strike_spell_damage_zero` | controller / disruptor | Target is about to confirm a non-Strike damage spell; skip if they will only Strike (use Summon Plate for incoming) |
| `pack_walk_orthogonal_only` | pack champion | Boss/champion AI only. Living pack allies exist. **Never owned** |
| `fold_two_player_side_chebyshev_3` | boss | Two living player-side bodies at Chebyshev exactly 3. **Boss AI only. Never owned** |

Do not assign Prime Gift / Tally Mend / Equal Gift to non-healer CORE. Do not assign Rime Reel when the map has no ice. Do not assign Leap Fold outside boss AI.

---

## 8. Persistence (Wave-1 writers; Wave-16 does not add a second path)

Discovery must be backend-authoritative, idempotent, reload-safe, and duplicate-callback safe.

- Grant writer is still Wave 1 `commitSpellDiscoveries` (not implemented on this HEAD).
- Repeated discovery must not duplicate spells, reset upgrades, mint Doka/XP, or call `upgradeSpell` / `updateCharacter` / `applyRewards`.
- `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds` / `spellLevelKeys`.
- Loaner orbs and `WF-SPL-*` never write those maps.

---

## 9. Special encounters (Wave 16)

Tag existing solvable layouts. Do not edit `mapGen.ts` algorithms. Do not skip `finalizePlayableLayout`.

| Tag | Teach via observe+win |
| :--- | :--- |
| `ring_gallery` | `spell-ring-stride` |
| `hepta_nave` | `spell-hepta-oath` |
| `frost_aisle` | `spell-rime-reel` |
| `last_pulpit` | `spell-last-mark` |
| `rift_court` | `spell-rift-skip` |

Do not retag `rank_gallery` / `file_gallery` / `orth_gallery` / `even_gallery` / `rime_gallery` / `void_aisle` / `ash_aisle` / `penta_nave` / `hexa_nave` / `span_six` / `span_dec` / `strike_pulpit` / `shock_nave` / `lava_aisle`. Do not consume #771 primer rooms, #826 ENC-* ids, #885 ENC-* ids, #957 ENC-* ids, or **#1006** ENC-* ids. Twin Gate pads stay off `map.portals`. Ice / Void Rift cells are map-modifier occupancy, not painted pits. `ENC-INCH-01` stays Inch Stride’s room. `ENC-FOLD-01` stays a wall fold, not Leap Fold. `ENC-EVEN-02` stays #1006’s room, not Even Gait. `ENC-TRI-01` stays #1006’s room, not Hepta Oath.

Wave-1 `echo_dummies`, Wave-2 `rime_gallery` / `still_court` / `mist_gallery`, Wave-13 `knight_gallery` / `quad_nave` / `pit_aisle`, Wave-14 `rank_gallery` / `penta_nave` / `spike_aisle`, and Wave-15 `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` are not re-specified.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–15 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 + #695 + #726 + #787 + #849 + #890 + #953 already cover: push, pull, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, conditional bounce, next-spell AP tax, next-walk AP tax after Strike, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, leftover-AP=0 heal, leftover-MP=0 heal, leftover 0=0 heal, leftover AP==MP ≥ 1 heal, leftover AP=0 and MP≥1 heal, leftover sum===3 heal, CD copy / steal / swap / lag / stall / stretch / halve / trim / rest / grace / floor / rise / prime, even-Chebyshev hood, odd-Chebyshev hood, eight-cell occupy, nine-cell occupy, ten-cell occupy, leftover-AP-odd plate, leftover-MP=0 plate, same-file next walk, same-rank next walk, knight walk, exact-4/5/6 spell gate, lava/spike/pit pull, Strike-from paint, pack diagonal lock, Chebyshev-4 fold.

**Still open (Wave 16 SDE unique ids).** The occupy-weights, leftover-sum===3 family, CD floor/rise/prime, and same-file/same-rank walks are siblings’; this table is what Discovery **adds**.

| Hole | Wave-16 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk Chebyshev **exactly 2**, knight `(2,1)` **excluded** | `spell-ring-stride` | Pair Stride is Manhattan **2** (includes `(1,1)`, excludes `(2,2)`). Inch Stride is Chebyshev **≤ 1**. Knight Stride is **only** `(2,1)`. Rank Stride is same **y**. File Stride is same **x**. Orth Stride is any orthogonal length. Diag Stride is any `|dx|==|dy|`. Must Span is **all** walks this turn |
| Next spell illegal unless Chebyshev = 7 | `spell-hepta-oath` | Hexa Oath is 6. Penta Oath is 5. Sept Span is occupy-weight 7. Long Oath is ≥ 3. Far Hood is incoming miss from ≥ 3 |
| Pull 1 toward nearest **ice occupancy** | `spell-rime-reel` | Lava Reel is lava. Spike Reel is spikes. Void Reel is void/portal. Rime Skip **ignores leave-tax**. Rime Sheet is a **ground sheet**. Hook Line is toward **caster** |
| Bonus if share **rank only** | `spell-rank-bite` | File Bite is **file only**. Axis Bite is rank **or** file. File Lance is a linear poke. Screen Bite wants Bresenham **blocked** |
| Cell detonates when occupant spends their **last leftover AP** on it | `spell-last-mark` | Strike Mark is **Strike from**. Cast Mark is any **spell** confirm. Dwell Mark is end-turn occupy. Ingress is walk enter. Swap Mark is teleport landing. Spent Tax is a last-turn **walk** flag, not a cell |
| Next hit is 0 while leftover AP **even ≥ 2** **and** leftover MP **even ≥ 2** | `spell-dual-plate` | Dry Plate is leftover **MP = 0**. Odd Plate is leftover **AP odd**. Spent Plate is leftover **AP ≥ 1** (MP unread). Poise Hood is leftover AP **===** leftover MP ≥ 1. Even Sting is **damage** if leftover AP even ≥ 2. `even-plate` stays tombstoned |
| 1-tile walk ignores **Void Rift** walk-tax | `spell-rift-skip` | Glyph Skip is glyph-tax. Shock Skip is shock-tile tax. Gap Ward skips **overwatch** on a 1-tile walk. Rime Skip is ice **leave-tax**. Lava / spike taxes still tick |
| Bonus if leftover AP **equals that body’s max AP** | `spell-fresh-sting` | Full Sting is leftover AP **≥ 3** (max unread). Even Sting is leftover AP **even ≥ 2**. Odd Sting is leftover AP **odd**. Gaunt Sting is both leftover **0**. They may have spent down to 3 from a higher max — Fresh Sting would miss that |
| Allied summons pay +1 AP to **walk off file** | `spell-summon-file` | Summon Rank taxes walk **off rank**. Summon Toll taxes **every** pet walk. Pack File **locks** pack walks to a file (`ENEMY_ONLY`). Summon Verse taxes **recast last id** |
| Heal iff leftover AP **exactly 1** **and** leftover MP **exactly 1** | `spell-prime-gift` | Equal Gift is any AP **==** MP ≥ 1. Lean Gift is AP = 0 **and** MP ≥ 1. Hollow Gift / Gaunt Mend own **0=0**. Tally Mend is both-body leftover **sum === 3** (legal pairs include 3/0, not 1/1 as a required pair on **one** body — 1+1=2, so Tally misses 1/1). `healAmount` stays 0 on the row |
| Remaining CDs **n>2 → 2**; 0/1/2 unchanged | `spell-cadence-cap` | Cadence Floor is `n>1` → **1**. Cadence Rise is `n==1` → 2. Cadence Prime is `n==0` → 1. Cadence Stall is **+1 all remaining**. Cadence Lag is `n>0` → `n+2`. Pack Cap is an `ENEMY_ONLY` walk cap |
| Next **walk** +1 AP if leftover **MP = 0** | `spell-gait-toll` | Still Toll is next **spell** if leftover MP = 0. Walk Toll is a Wave-7 walk-pool flag. Strike Debt is next walk if they **Struck**. Gait Tax is a Wave-9 flag. Cast Toll is next spell after a Strike |
| Cannot **walk** while adjacent to a **barrier** | `spell-brick-hold` | Brick Brace **negates a hit** while adjacent. Poise Hold is leftover AP===MP ≥ 1. Tally Hold is leftover sum === 3. Hold Ground is a different planted stance. Brick Step **relocates through** the barrier |
| Overwatch snap **steals 1 leftover MP** | `spell-watch-drain` | Watch Root **zeros** leftover MP. Watch Sip **steals AP**. Watch Bank **banks AP**. Watch Fee is leftover **AP −1**, no transfer |
| Bonus if leftover **MP is even and ≥ 2** | `spell-even-gait` | Odd Gait is leftover MP **odd**. Lone Gait is leftover MP **exactly 1**. Pair Gait is leftover MP **exactly 2**. Full Gait is leftover MP **≥ 3** (includes odds). Even Sting is leftover **AP** even ≥ 2. 0 is even — this card **excludes 0** |
| Bonus if Chebyshev ≤ 2 from **ice occupancy** | `spell-rime-cut` | Spike Cut is **spike occupancy**. Hazard Cut is **painted** hazard. Portal Cut is **world portals**. Rime Reel **pulls**. Rime Skip **ignores tax** |
| Target’s next **non-Strike spell** deals 0 damage (AP still spent) | `spell-cast-plate` | Summon Plate zeros the next **incoming hit** on allied summons. Mute Thread is a silence-ish sibling. Quiet Hex is an ungated **AP tax**. Split Plate is a different plate. Strike still deals full damage |
| Pack walks locked to **orthogonal** (no diagonal) | `spell-pack-orth` | Pack Diag is **diagonal only**. Pack File is **one file**. Pack Rank is **one rank**. Orth Stride is one next walk from **self**. Rank Lock is **all remaining** walks on rank or file. Never owned |
| Swap two player-side bodies at Chebyshev **exactly 3** | `spell-leap-fold` | Adj Fold is Chebyshev **1**. Reach Fold is exactly **2**. Far Fold is exactly **4**. Rank Fold is shared **rank**. File Fold is a different boss. Diag Fold is `|dx|==|dy|`. Mid Fold is shared rank **or** file. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 16)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–15, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #802, #837, #849, #890, #906, #953, or **#962**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Gait Toll / Summon File / Pack Orth / Watch Drain are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 16 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #962 / #953 / #906 key names for a different meaning.

```text
ringStrideChebyshev2NotKnight,    // dest cheb==2 AND not knight (2,1)
nextSpellExactChebyshev,          // Hepta Oath — value 7 (reuse key; value distinguishes Hexa=6 / Penta=5)
attractTowardNearestRime, rimeSearchRadius,
bonusIfShareRankWithCaster, rankBiteBonus,
detonateOnLastApOnCell,           // Last Mark — occupant leftover AP hits 0 while on the cell
negateHitIfLeftoverApEvenGe2AndMpEvenGe2,
skipVoidRiftTaxOneTile,
bonusIfLeftoverApEqualsMaxAp, freshStingBonus,
summonWalkOffFileApTax,
requireLeftoverApEq1AndMpEq1, primeGiftHeal,
capRemainingCdsAbove2To2,         // n>2 → 2; 0/1/2 stay
nextWalkApTaxIfLeftoverMpEq0,
cannotWalkIfAdjacentBarrier,
overwatchSnapStealWalkerMp,
bonusIfLeftoverMpEvenGe2, evenGaitBonus,
bonusIfNearRimeOccupancy, rimeCutRadius, rimeCutBonus,
nextNonStrikeSpellDamageZero,
packWalkOrthogonalOnly, packAuraRadius, packAuraDuration,
foldTwoPlayerSideChebyshev3, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` for Watch Drain’s arm window; `nextSpellExactChebyshev` with value **7**.

---

### SPELL_ID: `spell-ring-stride`

NAME: Ring Stride  
ROLE: POSITION — one next walk must be Chebyshev 2, not knight  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rank_lancer`; `G ≥ 16` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥16. `generationMin: 16`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The caster’s **next walk** is legal only if Chebyshev(`arm`, `dest`) **=== 2** and `(|dx|,|dy|)` is **not** `(2,1)` (`effectParams: {"ringStrideChebyshev2NotKnight":true}`). Legal dests are the four orthogonal 2-steps and the four `(2,2)` diagonals. Knight dests, Chebyshev 1, and Chebyshev ≥ 3 confirm-fail (MP not spent). Forced movement / swap / blink / Twin-gate still legal. Distinct from Pair Stride (Manhattan **2**, includes `(1,1)`, excludes `(2,2)`), Inch Stride (Chebyshev **≤ 1**), Knight Stride (**only** `(2,1)`), Rank Stride (same **y**, length free), File Stride (same **x**), Orth Stride (any orthogonal length), Diag Stride (any `|dx|==|dy|`), Must Span (**all** walks). Does **not** read `currentView`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_chebyshev_2_not_knight"`. Flanker / kiter. Skip if they must knight-step or step-1 to threaten and Strike is better. **Do not** assign to chargers who only walk adjacent.  
PLAYER_COUNTERPLAY: Stand at Chebyshev 1 or 3; occupy the eight ring cells; Root before they arm  
SYNERGIES: Far Sting after they are stuck on the ring; Knight Stride on a different body (do **not** CORE both on one kit)  
BALANCE_RISK: One-walk ring lock is a spacing puzzle. 2 AP / CD 2 / one consume. Fail closed (confirm fail), never become Knight Stride or Pair Stride.  
PERSISTENCE_REQUIREMENTS: Standard observe → same-encounter win. Observation is the **arm**, not the later walk.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hepta-oath`

NAME: Hepta Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 7  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `pale_cantor`; `G ≥ 16`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **non-Strike** spell confirms only if Chebyshev from caster to that spell’s target is **exactly 7** (`effectParams: {"nextSpellExactChebyshev":7}`). `physical_attack` stays legal at any range. Distinct from Hexa Oath (exactly 6), Penta Oath (exactly 5), Quad Oath (exactly 4), Long Oath (≥ 3), Sept Span (occupy-weight 7), Far Hood (incoming miss from ≥ 3). If they arm then walk to 6, the spell fizzles on confirm (AP not spent for the fizzled spell; Hepta Oath already observed).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_7"`. Kiter / caster. Skip if they cannot reach 7 this turn (use Strike / Hexa Oath).  
PLAYER_COUNTERPLAY: Close to 6 or 8; Root; Paper Wind  
SYNERGIES: Split Pace / Overcast after they sit at 7; Far Sting as the gated poke  
BALANCE_RISK: Exact-7 + Far Sting is a sniper prison. 2 AP / CD 3 / Strike exempt. Do not restamp `span_dec` / `span_six`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rime-reel`

NAME: Rime Reel  
ROLE: POSITION — pull 1 toward nearest ice  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `rime_mason` or `tide_shade`; `G ≥ 16`; `aiProfile` controller/caster  
ENEMY_FAMILIES: `rime_mason`, `tide_shade`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Pull the target 1 tile toward the nearest **ice occupancy** in radius 8 (`effectParams: {"attractTowardNearestRime":true,"rimeSearchRadius":8}`). Dest is that occupancy’s neighbor closer to the target, never `map.portals`, never Twin Gate pads, never painted cinder. If no ice exists, fizzle after AP (still observes). Distinct from Lava Reel (lava), Spike Reel (spikes), Pit Reel (painted pit), Void Reel (void/portal), Brick Reel (barrier), Rime Skip (ignore **leave-tax**), Rime Sheet (ground sheet), Hook Line (toward **caster**). Uses existing `applyAttract` dest flavor; does not rewrite damage math.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_rime"`. Controller / caster. Skip if no ice in radius (use Spike Reel / Lava Reel on a different kit). Never path dest onto a world portal.  
PLAYER_COUNTERPLAY: Fight on maps with no ice; stand so the ice-ward step is a wall; Grounded Lock  
SYNERGIES: Rime Skip on a different family (they ignore the leave-tax you just pulled them into — do **not** CORE both); Rime Cut after they sit near ice  
BALANCE_RISK: Ice pull + leave-tax is real. 3 AP / CD 3 / 1 tile / fail closed with no ice. Dest must not be `map.portals`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle after AP still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rank-bite`

NAME: Rank Bite  
ROLE: DAMAGE — bonus if share rank  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `shadow_lurker`; `G ≥ 16`; `aiProfile` flanker/bruiser  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 10. If the target shares **y** with the caster (same rank), deal +8 (`effectParams: {"bonusIfShareRankWithCaster":true,"rankBiteBonus":8}`). File-only (shared **x**, different **y**) does **not** pay the bonus. LoS unread for the bonus. Distinct from File Bite (**file only**), Axis Bite (rank **or** file), File Lance (linear poke), Screen Bite (Bresenham **blocked**), Rear Cut (behind).  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_rank_with_caster"`. Flanker / bruiser. Prefer a same-rank target; skip the bonus path if only a file-share is available (use File Bite).  
PLAYER_COUNTERPLAY: Step off the rank; Smoke Veil; sit on a blocked Bresenham if they also carry Screen Bite on a different body  
SYNERGIES: Rank Stride then bite (do **not** CORE both on one body); File Lance on a different family  
BALANCE_RISK: Rank-share poke is a corridor. 3 AP / CD 2 / +8 only on rank. Fail closed off-rank (10 only).  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **confirm**, bonus or not.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-last-mark`

NAME: Last Mark  
ROLE: TRAP — cell detonates when occupant spends last AP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `bone_scribe`; `G ≥ 16`; `aiProfile` controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: empty  
LOS: true  
COOLDOWN: 3  
EFFECT: Paint one empty cell. If a living occupant’s leftover AP reaches **0** while they still occupy that cell, the paint detonates for 8 and clears (`effectParams: {"detonateOnLastApOnCell":true}`). Walking off before they empty AP clears nothing — paint remains until detonate, caster’s next turn end, or overwrite. Strike-from, spell confirm, walk-enter, teleport landing, and end-turn occupy do **not** detonate unless leftover AP also hits 0 on that event. Distinct from Strike Mark (**Strike from**), Cast Mark (any **spell** confirm), Ingress Mark (walk enter), Dwell Mark (end-turn occupy), Wake Mark (start-of-turn occupy), Swap Mark (teleport landing), Shove Mark (force-move landing), Stride Mark (leave).  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "detonate_if_last_ap_on_cell"`. Controller. Paint a cell a spender will empty AP on. Skip if they always Strike-from (use Strike Mark) or always leave (use Stride Mark).  
PLAYER_COUNTERPLAY: Leave before spending last AP; spend last AP off the cell; Dispel Thread  
SYNERGIES: Quiet Hex / Waste Pace to force the last AP on the cell; do **not** CORE with Strike Mark  
BALANCE_RISK: Punishing “I dumped my bar here” is strong. 2 AP / CD 3 / 8 damage / one cell. Do not also fire on Strike-from.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **paint**, not the detonate.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dual-plate`

NAME: Dual Plate  
ROLE: DEFENSE — next hit 0 while both leftovers even ≥ 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 16`; `aiProfile` tank/warden  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥16. `generationMin: 16`  
RARITY: ADVANCED  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The next hit this caster takes is 0 **only if** leftover AP is **even and ≥ 2** **and** leftover MP is **even and ≥ 2** at the moment of the hit (`effectParams: {"negateHitIfLeftoverApEvenGe2AndMpEvenGe2":true}`). If leftover AP is odd, or leftover MP is 0/1/odd, the hit lands and the charge remains. 0 is even — this card **excludes 0**. Distinct from Dry Plate (leftover **MP = 0**), Odd Plate (leftover **AP odd**), Spent Plate (leftover **AP ≥ 1**, MP unread), Poise Hood (leftover AP **===** leftover MP ≥ 1), Tally Hood (leftover sum === 3), Even Sting (**damage** if leftover AP even ≥ 2). Do **not** mint `spell-even-plate`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_even_ge2_and_mp_even_ge2"`. Tank / warden. Arm when both leftovers already even ≥ 2. Skip if leftover AP odd (Odd Plate) or leftover MP = 0 (Dry Plate).  
PLAYER_COUNTERPLAY: Drain Courage / Purse Cut to break evenness; hit them after they spend to 1 or 3; Undertow to empty MP  
SYNERGIES: Even Sting on a different family (damage vs negate — do not CORE both); Dual Keep **destroys** this window if it banks AP odd  
BALANCE_RISK: Two-even shield is a timing window, not a sponge. 2 AP / CD 2 / fail closed off-window. Never become Even Plate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**, not the negated hit.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rift-skip`

NAME: Rift Skip  
ROLE: POSITION — 1-tile walk ignores Void Rift tax  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `plague_rat`; `G ≥ 16`; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, one consume. The caster’s next **length-1** walk ignores **Void Rift walk-tax** (`effectParams: {"skipVoidRiftTaxOneTile":true}`). Lava / spikes / ice leave-tax / shock-tile / glyph-tax / mire enter-tax still tick. Length ≥ 2 still pays rift tax. Distinct from Glyph Skip (glyph-tax), Shock Skip (shock-tile), Gap Ward (overwatch skip on a 1-tile walk), Rime Skip (ice **leave-tax**), Spike Skip (spike land-tax), Lava Skip (lava), Void Span (Wave-5 memory `BOSS_ONLY` — do not resurrect).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_void_rift_tax_one_tile"`. Flanker / kiter. Skip if no Void Rift occupancy is a useful 1-tile dest.  
PLAYER_COUNTERPLAY: Force a 2-tile path; stand so the rift step is lava; Root  
SYNERGIES: Void Reel on a different family (pull onto a rift they cannot skip — do **not** CORE both); Gap Ward is overwatch, not this skip  
BALANCE_RISK: Skipping the rift tax is a 1-tile pass. 2 AP / CD 3 / lava and spikes still kill. Do not retag `void_aisle`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-fresh-sting`

NAME: Fresh Sting  
ROLE: DAMAGE — bonus if leftover AP equals max AP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 16`; `aiProfile` bruiser/caster  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥16. `generationMin: 16`  
RARITY: ADVANCED  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 10. If the target’s leftover AP **equals that body’s current max AP** (they have not spent AP this turn), deal +8 (`effectParams: {"bonusIfLeftoverApEqualsMaxAp":true,"freshStingBonus":8}`). Leftover 3 from a max of 6 does **not** pay. Distinct from Full Sting (leftover AP **≥ 3**, max unread), Even Sting (leftover AP **even ≥ 2**), Odd Sting (leftover AP **odd**), Gaunt Sting (both leftover **0**), Dry Sting (leftover **MP = 0**), Ready Sting (CD remaining 0).  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_equals_max"`. Bruiser / caster. Prefer a target that has not spent AP this turn. Skip if they already dumped AP (use Full Sting).  
PLAYER_COUNTERPLAY: Spend 1 AP (even a fizzle) before the sting lands; Tempo Gift to desync max vs leftover  
SYNERGIES: Act Tax / Queue Cut to freeze them unspent; do not CORE with Full Sting / Even Sting  
BALANCE_RISK: Punishing “I held my bar” is real. 3 AP / CD 2 / +8 only on untouched AP. Fail closed after any spend.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **confirm**, bonus or not.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-file`

NAME: Summon File  
ROLE: TAX — allied summons pay +1 AP to walk off file  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; `G ≥ 16`; variant ≥ ELITE; `aiProfile` summoner  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 16`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Aura, this caster’s next turn end. Living **allied summons** pay +1 AP to any walk whose dest.x ≠ that summon’s x at walk start (`effectParams: {"summonWalkOffFileApTax":true}`). Walks that stay on file are un-taxed. Player walks unread. Distinct from Summon Rank (tax walk **off rank**), Summon Toll (tax **every** pet walk), Pack File (`ENEMY_ONLY`, **locks** pack walks to a file), Summon Verse (tax **recast last id**), Summon Gait (walk **MP**). Not `spell.mpCost`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "summon_walk_off_file_ap_tax"`. Summoner. Skip if no living allied summon, or if Pack File already locks the pack. Do not CORE with Pack File / Summon Rank / Summon Toll.  
PLAYER_COUNTERPLAY: Walk pets along the file; Kennel Lock; kill the aura caster  
SYNERGIES: File Stride on a different body (do **not** CORE both); Pack File is `ENEMY_ONLY` on `file_precentor` — do not grant  
BALANCE_RISK: File-tax on pets is a corridor, not a hard lock. 3 AP / CD 3 / off-file only. Never owned as Pack File.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-prime-gift`

NAME: Prime Gift  
ROLE: HEAL — leftover AP exactly 1 and leftover MP exactly 1  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; `G ≥ 16`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 16`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target may be self. Heal 10 **only if** leftover AP **= 1** and leftover MP **= 1** at resolve (`effectParams: {"requireLeftoverApEq1AndMpEq1":true,"primeGiftHeal":10}`). Any other leftover pair fizzles (AP spent). Distinct from Equal Gift (any AP **==** MP ≥ 1, including 2/2 and 3/3), Lean Gift (AP = 0 **and** MP ≥ 1), Hollow Gift / Gaunt Mend (**0=0**), Tally Mend (both-body leftover **sum === 3** — 1+1=2 so Tally **misses** a 1/1 body), Poise Mend (both bodies equal ≥ 1), Dry Mend (both leftover **AP** = 0). `healAmount` stays 0 on the row so `inferArchetype` does not treat a kit that only *carries* this id as healer. **Healer CORE only.** Do **not** restamp `tally_cantor` / `poise_cantor`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_eq_1_and_mp_eq_1"`. **Healer CORE only.** Skip if leftover is 0/0 (Hollow Gift), AP==MP ≥ 2 (Equal Gift), or AP=0 MP≥1 (Lean Gift). Do not dump leftover AP **only** to enable this if a Strike would kill.  
PLAYER_COUNTERPLAY: Spend the last 1 AP or 1 MP before the heal; Dual Keep to bank off 1/1  
SYNERGIES: Purse Cut / Act Tax to land them on 1/1; do not CORE with Equal Gift / Lean Gift / Tally Mend / Hollow Gift  
BALANCE_RISK: 1/1 is a needle. 3 AP / CD 3 / fail closed off-window. Healer CORE only.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle after AP still observes. HealUsed only if player-side HP actually increased.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-cap`

NAME: Cadence Cap  
ROLE: CONTROL — remaining CDs n>2 become 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 16`; `aiProfile` controller/caster  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: For each of the target’s remaining spell CDs: if remaining `n>2`, set remaining to **2**. Remaining `0`, `1`, and `2` stay (`effectParams: {"capRemainingCdsAbove2To2":true}`). Distinct from Cadence Floor (`n>1` → **1**; zeros stay 0), Cadence Rise (`n==1` → 2; others unchanged), Cadence Prime (`n==0` → 1), Cadence Stall (**+1 all remaining**), Cadence Lag (`n>0` → `n+2`), Cadence Trim (−1), Cadence Halve, Cadence Swap (exchange maps). Pack Cap is `ENEMY_ONLY` walk-lock, not this id.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cap_remaining_cds_gt_2_to_2"`. Controller / caster. Skip if the target has no remaining `n>2` (use Floor to peel 2s, Prime to lock 0s, Rise to pad 1s). Do **not** CORE with Floor / Rise / Prime / Stall.  
PLAYER_COUNTERPLAY: Hold remaining at 2 or 1; Loan Tempo after the cap; sit at 0 and take Prime from a different kit  
SYNERGIES: Cadence Floor then Cap is illegal as a CORE pair (Floor already peels n>1 to 1). Verse Gaunt after you leave them at 2.  
BALANCE_RISK: Softening long CDs to 2 is real but leaves 1s and 0s untouched. 3 AP / CD 3. Do not also Floor in the same CORE. Do not restamp `prime_precentor` / `floor_precentor`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **confirm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gait-toll`

NAME: Gait Toll  
ROLE: TAX — next walk +1 AP if leftover MP = 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 16`; `aiProfile` controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Flag, until consumed or this unit’s next turn end. The target’s next **walk** costs +1 AP **only if** leftover MP is **0** at walk start (`effectParams: {"nextWalkApTaxIfLeftoverMpEq0":true}`). If leftover MP ≥ 1, the flag fizzles on the walk (no tax; Gait Toll already observed). Spells are un-taxed. Distinct from Still Toll (next **spell** if leftover MP = 0), Walk Toll (Wave-7 walk-pool flag, not leftover-gated), Strike Debt (next walk if they **Struck**), Cast Toll (next spell after a Strike), Gait Tax (Wave-9 flag), Spent Tax (next spell after a walk). Not `spell.mpCost`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll — this is not a fourth.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_leftover_mp_eq_0"`. Controller. Skip if leftover MP ≥ 1 (use Still Toll for the spell tax). Do not CORE with Still Toll / Walk Toll / Strike Debt.  
PLAYER_COUNTERPLAY: Keep 1 leftover MP; blink / swap instead of walking; sit and Strike  
SYNERGIES: Undertow to empty their walk pool then tax the next step; do not CORE with Still Toll  
BALANCE_RISK: Empty-MP walk tax is a corridor. 2 AP / CD 2 / fail closed while they still have MP. Never a fourth `mpCost > 0` snipe.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle after AP (leftover MP ≥ 1) still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-hold`

NAME: Brick Hold  
ROLE: CONTROL — cannot walk while adjacent to a barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 16`; `aiProfile` controller/tank  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 16`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Flag, this caster’s next turn end. While the target is **adjacent to a barrier tile**, their walks confirm-fail (MP not spent) (`effectParams: {"cannotWalkIfAdjacentBarrier":true}`). Spells, Strike, swap, blink, Twin-gate, and force-move stay legal. If no barrier is adjacent, walks are free and the flag remains until expiry. Distinct from Brick Brace (next **hit** 0 if a barrier is adjacent), Brick Step (**relocates through** a barrier), Poise Hold (cannot walk while leftover AP===MP ≥ 1), Tally Hold (cannot walk while leftover sum === 3), Hold Ground (planted stance), Planted Stance (Wave 3).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cannot_walk_if_adjacent_barrier"`. Controller / tank. Skip if the target is not adjacent to a barrier (use Poise Hold / Tally Hold for leftover gates). Do not CORE with Brick Brace / Brick Step.  
PLAYER_COUNTERPLAY: Step off the barrier before the flag; blink; smash the barrier; sit and Strike  
SYNERGIES: Brick Nudge to push a barrier onto them; do not CORE with Brick Brace  
BALANCE_RISK: Barrier-adjacent walk lock is a corridor, not a silence. 3 AP / CD 3 / spells still fire. Fail closed with no barrier.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **confirm**. Fizzle (no adjacent barrier, walks still legal) still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-drain`

NAME: Watch Drain  
ROLE: TAX — overwatch snap steals 1 leftover MP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `hood_lurker`; `G ≥ 16`; `aiProfile` kiter/sniper  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 16`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: empty  
LOS: true  
COOLDOWN: 3  
EFFECT: Arm overwatch on one empty cell (`overwatchDuration` reused). When a walker **enters** that cell, steal 1 leftover MP from the walker (their leftover MP −1, min 0; caster leftover MP +1, capped at that body’s max MP) (`effectParams: {"overwatchSnapStealWalkerMp":true}`). Does **not** zero leftover MP. Does **not** steal AP. Distinct from Watch Root (snap **zeros leftover MP**), Watch Sip (steals leftover **AP**), Watch Bank (**banks** leftover AP), Watch Fee (leftover **AP −1**, no transfer), Watch Alms / Watch Lend (different transfer directions). Not `spell.mpCost`. Not `CharacterStats.evasion`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_steal_walker_mp"`. Kiter / sniper. Arm on a tile a walker with leftover MP ≥ 1 will enter. Skip if they have leftover MP = 0 (use Watch Root to confirm the empty, or Gait Toll).  
PLAYER_COUNTERPLAY: Walk around the cell; enter with leftover MP already 0; blink  
SYNERGIES: Undertow to leave them at 1 MP then steal the last; do not CORE with Watch Root / Watch Sip  
BALANCE_RISK: Stealing 1 MP is a tax, not a root. 3 AP / CD 3 / one snap. Never become Watch Root.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**, not the snap.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-even-gait`

NAME: Even Gait  
ROLE: DAMAGE — bonus if leftover MP even ≥ 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; `G ≥ 16`; `aiProfile` bruiser/caster  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥16. `generationMin: 16`  
RARITY: ADVANCED  
AP_COST: 3  
RANGE: 2  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 10. If the target’s leftover MP is **even and ≥ 2**, deal +8 (`effectParams: {"bonusIfLeftoverMpEvenGe2":true,"evenGaitBonus":8}`). Leftover MP 0 (even) does **not** pay. Distinct from Odd Gait (leftover MP **odd**), Lone Gait (leftover MP **exactly 1**), Pair Gait (leftover MP **exactly 2** — Even Gait also pays on 4/6), Full Gait (leftover MP **≥ 3**, includes odds), Even Sting (leftover **AP** even ≥ 2), Dry Sting (leftover MP **= 0**).  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_mp_even_ge2"`. Bruiser / caster. Prefer leftover MP 2/4. Skip if leftover MP odd (Odd Gait) or 0 (Dry Sting).  
PLAYER_COUNTERPLAY: Spend 1 MP (odd leftover); sit at 0; Gift Sill  
SYNERGIES: Loan Tempo to land even leftover MP; do not CORE with Odd Gait / Even Sting / Pair Gait  
BALANCE_RISK: Even-MP poke is a timing window. 3 AP / CD 2 / +8 only on even ≥ 2. 0 excluded.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **confirm**, bonus or not.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rime-cut`

NAME: Rime Cut  
ROLE: DAMAGE — bonus near ice occupancy  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `plague_rat`; `G ≥ 16`; `aiProfile` flanker/controller  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 16`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 10. If the target is Chebyshev ≤ 2 from an **ice occupancy**, deal +8 (`effectParams: {"bonusIfNearRimeOccupancy":true,"rimeCutRadius":2,"rimeCutBonus":8}`). Painted hazards, spikes, lava, world portals, and Twin Gate pads do **not** pay. Distinct from Spike Cut (**spike occupancy**), Hazard Cut (**painted** hazard), Portal Cut (**world portals**), Rime Reel (**pull** toward ice), Rime Skip (ignore **leave-tax**), Axis Cut (#899 family id — do not restamp).  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_rime_occupancy"`. Flanker / controller. Prefer a target already near ice. Skip if no ice in radius (use Spike Cut / Hazard Cut on a different kit).  
PLAYER_COUNTERPLAY: Fight off ice; stand at Chebyshev 3 from every ice cell; Smoke Veil  
SYNERGIES: Rime Reel then cut (do **not** CORE both on one body); Rime Skip on a different family  
BALANCE_RISK: Ice-adjacent poke is a map tax. 3 AP / CD 2 / +8 only near ice. Fail closed off-ice (10 only). Do not retag `rime_gallery`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **confirm**, bonus or not.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cast-plate`

NAME: Cast Plate  
ROLE: DEFENSE — next non-Strike spell from the target deals 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; `G ≥ 16`; variant ≥ ELITE; `aiProfile` controller/disruptor  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 16`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Flag, until consumed or this caster’s next turn end. The target’s next **non-Strike** spell still confirms and still spends AP, but its **damage is 0** (`effectParams: {"nextNonStrikeSpellDamageZero":true}`). Heal / summon / tax / stance effects still resolve. `physical_attack` is unread (full damage). Distinct from Summon Plate (allied summons’ next **incoming hit** is 0), Mute Thread (sibling silence-ish), Quiet Hex (ungated **AP tax**), Split Plate (a different plate), Surplus Ward (evade charges), Brood Ward (boss absorb). `healAmount` stays 0 on the row.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_non_strike_spell_damage_zero"`. Controller / disruptor. Arm when the target is about to confirm a non-Strike damage spell. Skip if they will only Strike (use a plate for incoming instead). Do not assign to non-disruptor CORE as a fake heal.  
PLAYER_COUNTERPLAY: Strike through the flag; spend a tax/stance spell to consume it; Dispel Thread  
SYNERGIES: Goad to force a Strike (the flag then expires unused — that is the counter); do not CORE with Mute Thread / Quiet Hex / Summon Plate  
BALANCE_RISK: One fizzled nuke is a tempo tax, not a silence. 3 AP / CD 3 / Strike still kills. Never become Hex of Silence.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **confirm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-orth`

NAME: Pack Orth  
ROLE: AURA — pack walks must be orthogonal  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `lane_precentor` CHAMPION only; `G ≥ 16`; pack AI  
ENEMY_FAMILIES: `lane_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE_POOL. `generationMin: 16`  
RARITY: SIGNATURE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: Aura, this caster’s next turn end. Living **pack allies** (same pack id, not the player) may only walk orthogonally: dest must share x **or** y with that walk’s start (`effectParams: {"packWalkOrthogonalOnly":true,"packAuraRadius":8,"packAuraDuration":1}`). Diagonal walks confirm-fail (MP not spent). The champion’s own walks are free. Distinct from Pack Diag (**diagonal only** — the inverse lock), Pack File (**one file**), Pack Rank (**one rank**), Orth Stride (one next walk from **self**), Rank Lock (**all remaining** walks on rank or file). Never owned. Do not CORE with Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_orthogonal_only"`. Pack champion only. Skip if no living pack allies. Missing hint → drop id.  
PLAYER_COUNTERPLAY: Stand on a diagonal approach; force the pack off orthogonal corridors  
SYNERGIES: Pack Orth identity; File Lance after they cannot cut the corner. Do **not** grant.  
BALANCE_RISK: Orthogonal pack lock is a signature, not a farmable spell. ENEMY_ONLY. **Never** `ownedSpellIds`. Do not restamp `diag_precentor` / `file_precentor` / `rank_precentor` / `orth_warder`.  
PERSISTENCE_REQUIREMENTS: None. Aura tick without a cast does not observe. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-leap-fold`

NAME: Leap Fold  
ROLE: DISPLACE — swap two player-side bodies at Chebyshev 3  
ACQUISITION_SOURCE: BOSS  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `leap_fold_regent` only; boss AI  
ENEMY_FAMILIES: `leap_fold_regent`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE_POOL. `generationMin: 16`  
RARITY: SIGNATURE  
AP_COST: 5  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **only if** Chebyshev between them is **exactly 3**. If fewer than two, or they sit at 1 / 2 / 4 / ≥ 5, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideChebyshev3":true,"foldDamage":6}`). Distinct from Adj Fold (Chebyshev **1**), Reach Fold (Chebyshev **exactly 2**), Far Fold (Chebyshev **exactly 4**), Rank Fold (shared **rank**), File Fold (#533 `BOSS_ONLY` on `file_regent`), Diag Fold (`|dx|==|dy|`), Mid Fold (shared rank **or** file), Knight Fold ((2,1) from midpoint), Sovereign Fold (any two), Pawn Trade (two hostiles-to-caster), Court Prime (#953 mass CD prime). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_chebyshev_3"`. **Boss AI only.** Skip if 0–1 player-side bodies or they are not at Chebyshev 3.  
PLAYER_COUNTERPLAY: Fight without a summon; stand at 2 or 4; False Retreat decoy as the second body  
SYNERGIES: Leap Fold identity; Claim Ward (anti-swap **cell** does not block this — fold is unit swap, not cell claim; **explicit** so implementers do not merge the keys)  
BALANCE_RISK: Forced exact-3 player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`. Do not restamp #951 `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. Do not restamp #1004 `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. Do not restamp `court_prime_regent` / `far_fold_regent` / `rank_fold_regent` / `diag_fold_regent` / `file_regent`. `ENC-FOLD-01` stays a wall fold.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 16 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…15 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥16 | `spell-ring-stride`, `spell-rank-bite` |
| `rank_lancer` | RARE / G≥16 | `spell-ring-stride` |
| `shadow_lurker` | RARE / G≥16 | `spell-rank-bite` |
| `glass_sniper` | RARE / G≥16 | `spell-hepta-oath` |
| `glass_sniper` | ELITE | `spell-watch-drain` |
| `pale_cantor` | RARE / G≥16 | `spell-hepta-oath` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-prime-gift` (healer CORE only) |
| `tide_shade` | RARE / G≥16 | `spell-rime-reel`, `spell-rift-skip` |
| `plague_rat` | RARE / G≥16 | `spell-rift-skip` |
| `plague_rat` | ELITE | `spell-rime-cut` |
| `rime_mason` | RARE / G≥16 | `spell-rime-reel`, `spell-brick-hold` |
| `glyph_sower` | RARE / G≥16 | `spell-last-mark` |
| `glyph_sower` | ELITE | `spell-rime-cut` |
| `bone_scribe` | RARE / G≥16 | `spell-last-mark`, `spell-even-gait` |
| `purse_scribe` | RARE / G≥16 | `spell-even-gait` |
| `plate_warden` | ADVANCED / G≥16 | `spell-dual-plate`, `spell-fresh-sting` |
| `iron_golem` | ADVANCED / G≥16 | `spell-dual-plate`, `spell-fresh-sting` |
| `stone_castellan` | RARE / G≥16 | `spell-brick-hold` |
| `brood_chanter` | ELITE | `spell-summon-file`, `spell-cast-plate` |
| `cadence_thief` | RARE / G≥16 | `spell-cadence-cap` |
| `hex_chorister` | RARE / G≥16 | `spell-cadence-cap` |
| `tax_scribe` | RARE / G≥16 | `spell-gait-toll` |
| `ley_tollkeeper` | RARE / G≥16 | `spell-gait-toll` |
| `hood_lurker` | ELITE | `spell-watch-drain` |
| `lane_precentor` CHAMPION | SIGNATURE | `spell-pack-orth` (`ENEMY_ONLY`; not with Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit) |
| `leap_fold_regent` | BOSS_ONLY | `spell-leap-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-16 family CORE consumes #906 and #953

Same-day **#997** (`ENEMY_ELITE_EVOLUTION_2026-10-24.md`) is that Wave-16 family sheet. It puts remaining **#906** unique Wave-14 verbs (minus Equal Gift / Shove Gift on non-healer kits; minus Pack Rank / Rank Fold / Cadence Floor) and **#953** tactical Wave-15 ids (minus Court Prime; Tally Mend healer CORE only) in **CORE**. Unique §11 ids may appear there only as G≥16 extras in a later family pass (Wave 18), not as this document’s CORE and **not** as #899 / #941 / #997 CORE. Do **not** put unique §11 ids in #840 CORE, #899 CORE, #941 CORE, or #997 CORE. Do **not** restamp #941 `ENEMY_ID`s (`poise_mender` … `drift_gifter`). Do **not** restamp #997 `ENEMY_ID`s (`tally_mender` … `shove_gifter`). Do **not** name unique §11 families after #899, #941, or #997 `ENEMY_ID`s.

Stamp, do not clone #906: Rank Stride, Penta Oath, Spike Reel, Screen Bite, Swap Mark, Odd Plate, Mire Skip, Odd Sting, Summon Verse, Cadence Floor, Cast Toll, Brick Step, Watch Bank, Tied Gait, Portal Cut. Equal Gift / Shove Gift stay healer CORE only. Pack Rank stays `ENEMY_ONLY` on `rank_precentor`. Rank Fold stays `BOSS_ONLY` on `rank_fold_regent`.

Stamp, do not clone #953: Tally Mend (healer CORE only), Cadence Prime, Dec Span (implementation-blocked while summon cap is 2), Purse Turn, Tally Hood, Tally Sting, Tally Step, Tally Sill, Tally Hold, Tally Lend, Tally Sip, Tally Post, Tally Bounce, Must Tally, Verse Tally. Court Prime stays `NOT_PLAYER_LEARNABLE` on `court_prime_regent`. Do **not** CORE Must Tally with Tally Hold. Do **not** CORE Cadence Prime with Cadence Floor / Cadence Cap / Cadence Rise.

### 12.2 Wave-15 unique extras (deferred)

#962 unique Wave-15 verbs (`spell-file-stride` … `spell-far-fold`) stay G≥15 extras until Wave 17 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Diag stays `ENEMY_ONLY` on `diag_precentor`. Far Fold stays `BOSS_ONLY` on `far_fold_regent`.

### 12.3 Same-day tactical CORE (Wave 17)

Same-day **#1011** (`SPELL_PROPOSALS_2026-10-24.md`) is that Wave-16 tactical catalog. **Stamp it as Wave 17 family CORE**. Do **not** put those ids in Wave-16 family CORE or unique §11. Unique §11 stay this catalog’s. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp.

Stamp, do not clone #1011: Score Mend (healer CORE only), Cadence Snuff, Hendeca Span (implementation-blocked while summon cap is 2), Duel Turn, Score Hood, Score Sting, Score Step, Score Sill, Score Hold, Score Lend, Score Sip, Score Post, Score Bounce, Must Score, Verse Score. Court Snuff stays `NOT_PLAYER_LEARNABLE` on `court_snuff_regent`. Do **not** CORE Must Score with Score Hold. Do **not** CORE Cadence Snuff with Cadence Cap / Cadence Rise / Cadence Prime / Cadence Floor. Do **not** CORE Score Mend with Prime Gift / Tally Mend / Equal Gift / Poise Mend / Lean Gift. Do **not** CORE Duel Turn with Purse Turn / Tempo Invert / Bar Cross.

**SDE wins** unique leftover collisions: Prime Gift stays leftover **1/1**; Cadence Cap stays remaining `n>2` → `2`; Dual Plate stays leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. Do **not** mint `spell-score-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop`.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 17 forever

Same recipe as Wave 15 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 17 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #890 / #953 / **#1011** extra doors. Do not restamp #906 / #962 rooms. Do not restamp #899 / **#941** / **#997** family ids. Do not restamp #903 / **#951** / **#1004** extra doors. Do not consume #771 primer room ids. Do not consume #826 / #885 / #957 / **#1006** ENC-* ids. Do not consume #949 / **#993** `WF-*`. Do not mint `spell-even-plate` / `spell-score-gift` / `spell-eleven-span`.

Suggested Wave-17 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-15 §11 verbs **and** **#1011** (this catalog’s unique ids stay extras until Wave 18). Invert leftover AP↔MP on **ally** is **Wave 3 Tempo Invert**. Hostile invert is **#953 Purse Turn**. Two-hostile invert is **#1011 Duel Turn**. Two-body leftover cross is **#890 Bar Cross**. Eight-cell occupy is **#849 Oct Span**. Nine-cell occupy is **#890 Nine Span**. Ten-cell occupy is **#953 Dec Span**. Eleven-cell occupy is **#1011 Hendeca Span**. Both-body leftover sum===4 unequal heal is **#1011 Score Mend**. Remaining `1→0` is **#1011 Cadence Snuff**. Four-body both-pools-empty heal is **#849 Gaunt Mend**. Remaining `n>0`→`n+2` is **#849 Cadence Lag**. CD floor is **#906 Cadence Floor**. Remaining `0→1` is **#953 Cadence Prime**. Remaining `n>2`→`2` is this wave’s Cadence Cap. Same-file next walk is #962 File Stride. Chebyshev-2-not-knight next walk is this wave’s Ring Stride. Rank Fold stays `BOSS_ONLY` on `rank_fold_regent`. Far Fold stays `BOSS_ONLY` on `far_fold_regent`. Leap Fold stays `BOSS_ONLY` on `leap_fold_regent`. Court Snuff stays kit-only on `court_snuff_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / #802 / #808 / #837 / #849 / #836 / #890 / #899 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W16-A. G≥16 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W16-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W16-C. Wave-16 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #906 / #953 / #962 / **#1011** CORE / memory Wave-5 ids; a second `spell-cadence-floor`; minting `spell-even-plate` / `spell-score-gift` / `spell-eleven-span` |
| W16-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `rank_gallery` / `file_gallery` / `rime_gallery` / `void_aisle` / `hexa_nave` / `span_dec` / `strike_pulpit` / #771 primer rooms / #885 ENC-* / #949 / #993 `WF-*` / #1006 ENC-* |
| W16-E. Rime Reel attract caller | `applyAttract` toward nearest ice occupancy | Damage-math rewrite; RAF; treating dest as `map.portals` or painted cinder |
| W16-F. Last Mark last-AP hook | existing AP-spend resolve | RAF; treating Strike-from as last-AP unless leftover also hits 0 |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Ring Stride consume, Last Mark detonate, Dual Plate consume, Rift Skip consume, and Watch Drain consume read flags at walk / last-AP / incoming-hit / overwatch-snap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 15 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W16-1 | Encounter start | Possessed-but-unused G16 id does not observe |
| W16-2 | Ring Stride dest knight `(2,1)` or Chebyshev ≠ 2 | Confirm fails; MP not spent; Ring Stride already observed |
| W16-3 | `ring_gallery` defeat | Does not grant. Victory grants once |
| W16-4 | `rank_gallery` / `file_gallery` / `orth_gallery` / `even_gallery` / `pair_gallery` / `knight_gallery` | Do not grant Ring Stride |
| W16-5 | Hepta Oath then Frost at Chebyshev 5, 6, or 8 | Confirm fails; Strike still legal |
| W16-6 | Rime Reel no ice | Fizzle observes; no pull. Dest is not `map.portals` and not painted cinder |
| W16-7 | Rank Bite off-rank / shared file only | 10 only. Axis Bite would want rank **or** file. File Bite would want shared **x** |
| W16-8 | Last Mark Strike-from / walk-enter / teleport landing while leftover AP ≥ 1 | No detonate. Strike Mark would detonate on Strike. Ingress would detonate on walk. Swap Mark would detonate on teleport |
| W16-9 | Dual Plate hit while leftover AP odd or leftover MP = 0 | Full hit; charge remains. Hit while both leftovers even ≥ 2 consumes. Dry Plate would want leftover MP = 0. Even Sting would deal bonus, not negate |
| W16-10 | Rift Skip across lava / spikes / ice leave-tax / glyph-tax / length 2 | Those taxes still tick. Skip is Void Rift tax + length 1 only |
| W16-11 | Fresh Sting leftover AP 3 from max 6 | 10 only. Full Sting would bonus leftover ≥ 3. Even Sting would bonus leftover even ≥ 2 |
| W16-12 | Summon File vs Summon Rank vs Summon Toll vs Summon Verse | Pets pay AP to **walk off file** vs **off rank** vs **any walk** vs **recast last id** |
| W16-13 | Prime Gift after leftover 0=0 or 2/2 | Fizzle observes; no heal. Hollow Gift would want 0=0. Equal Gift would want AP==MP ≥ 1. Tally Mend would want both-body sum === 3 |
| W16-14 | Cadence Cap vs Floor vs Rise vs Prime vs Stall vs Snuff | Remaining `n>2` → 2 vs `n>1` → 1 vs `n==1` → 2 vs `n==0` → 1 vs +1 **all** vs `n===1` → 0 |
| W16-15 | Gait Toll while leftover MP ≥ 1 | Fizzle observes. Still Toll would tax a **spell**. Strike Debt would tax a post-Strike **walk** |
| W16-16 | Brick Hold with no adjacent barrier | Walks legal; flag remains. Brick Brace would negate a hit. Brick Step would relocate through the barrier |
| W16-17 | Watch Drain vs Root vs Sip vs Bank | Snap steals 1 leftover **MP** vs zeros leftover **MP** vs steals AP vs banks AP |
| W16-18 | Even Gait leftover MP 0, 1, or 3 | 10 only. Odd Gait would bonus leftover MP odd. Pair Gait would bonus leftover MP exactly 2. Dry Sting would bonus leftover MP = 0 |
| W16-19 | Rime Cut far from ice / on a Twin Gate pad / next to spikes only | 10 only. Spike Cut would want spike occupancy. Hazard Cut would want painted hazard. Portal Cut would want `map.portals`. Rime Reel would pull |
| W16-20 | Prime Gift after leftover AP ≥ 2 | Fizzle observes. Equal Gift would want AP==MP ≥ 1 |
| W16-21 | Pack Orth / Leap Fold | Never in `ownedSpellIds` |
| W16-22 | Loaner / `WF-SPL-*` / #771 primer / #826 / #885 / #957 ENC-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W16-23 | G=15 Tide | No Ring Stride / Gait Toll (`generationMin: 16`) |
| W16-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W16-25 | No cloned ids | Unique §11 ids absent from #906 / #953 / #962 / **#1011** catalogs |
| W16-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Gait Toll / Summon File / Pack Orth / Watch Drain are flags |
| W16-27 | Hex Toll | Still not in any SDE pool |
| W16-28 | Memory Wave-5 / Wave-15 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W16-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W16-30 | #890 extra doors | `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` not restamped |
| W16-30b | #906 rooms / doors | `rank_gallery` / `rank_precentor` / `rank_fold_regent` not restamped |
| W16-30c | #899 family ids | Unique §11 not CORE on `gaunt_mender` … `axis_cutter`. `lane_precentor` / `leap_fold_regent` not #899 ids |
| W16-30d | #903 extra doors | `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` not restamped |
| W16-30e | #962 rooms / doors | `file_gallery` / `diag_precentor` / `far_fold_regent` not restamped |
| W16-30f | #941 family ids | Unique §11 not CORE on `poise_mender` … `drift_gifter`. `ring_gallery` is not `knight_gallery`. `lane_precentor` is not `axis_biter` |
| W16-30g | #951 extra doors | `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` not restamped. `leap_fold_regent` is not those ids |
| W16-30h | #953 tactical ids | Unique §11 does not clone Tally Mend / Cadence Prime / Dec Span / Purse Turn. Cadence Cap is `n>2` → 2, not `0→1`. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` not restamped |
| W16-30i | #957 ENC-* | `ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` not consumed as spell grants |
| W16-30j | #997 family ids | Unique §11 not CORE on `tally_mender` … `shove_gifter`. `lane_precentor` is not `rank_warder`. `leap_fold_regent` is not `dec_prelate` |
| W16-30k | #1004 extra doors | `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` not restamped |
| W16-30l | #1006 ENC-* | `ENC-GAUNT-01` / `ENC-EVEN-02` / `ENC-TRI-01` not consumed as spell grants |
| W16-30m | #1011 tactical ids | Unique §11 does not clone Score Mend / Cadence Snuff / Hendeca Span / Duel Turn. Cadence Cap is `n>2` → 2, not `1→0`. Prime Gift is 1/1, not both-body sum===4. Dual Plate is AND even ≥ 2, not Score Hood. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` not restamped |
| W16-31 | `spell-even-plate` | Still tombstoned. Dual Plate is the AND-gate, not that id |
| W16-32 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–15, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, **#962**, or **#1011** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / #679 / #695 / #726 / #747 / #753 / #787 / #802 / #808 / #836 / #837 / #849 / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** extra doors or family ids
- Consuming #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` as spell grants
- Consuming #826 / #885 / **#957** / **#1006** ENC-* as spell grants
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `rank_gallery` / `file_gallery` / `orth_gallery` / `diag_gallery` / `knight_gallery` / `even_gallery` / `odd_gallery` / `rime_gallery` / `void_aisle` / `penta_nave` / `hexa_nave` / `span_six` / `span_dec` / `strike_pulpit` as Ring Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #752 CORE, #796 CORE, #840 CORE, #899 CORE, #941 CORE, **#997 CORE**, Wave-15 #837/#890 CORE, or a later Wave-17 family CORE before Wave 18
- Cloning #906 (`spell-rank-stride` … `spell-rank-fold`), #953 (`spell-tally-mend` … `spell-court-prime`), **#962** (`spell-file-stride` … `spell-far-fold`), or **#1011** (`spell-score-mend` … `spell-court-snuff`) into unique §11
- Minting `spell-nona-span` / `spell-octa-span` / `spell-even-plate` / `spell-gaunt-floor` / `spell-hollow-mend` / `spell-cadence-trade` / `spell-parched-mend` / `spell-tempo-mirror` / `spell-tied-mend` / `spell-equal-mend` / `spell-tempo-cross` / `spell-walk-debt` / `spell-pack-far` / `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm` / `spell-ash-skip` / `spell-score-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop`
- Shipping `spell-parched-mend` alongside Dry Gait
- Shipping a second `spell-cadence-floor` from #890
- Cloning Rank Stride as Ring Stride, Knight Stride as Ring Stride, File Bite as Rank Bite, Rime Skip as Rift Skip, Pack Diag as Pack Orth, Cadence Floor as Cadence Cap, Cadence Prime as Cadence Cap, Cadence Snuff as Cadence Cap, Spike Cut as Rime Cut, Lean Gift as Prime Gift, Tally Mend as Prime Gift, or Score Mend as Prime Gift

---

## 17. Wave-16 index

**Unique SDE ids (19):** ring-stride, hepta-oath, rime-reel, rank-bite, last-mark, dual-plate, rift-skip, fresh-sting, summon-file, prime-gift, cadence-cap, gait-toll, brick-hold, watch-drain, even-gait, rime-cut, cast-plate, pack-orth, leap-fold.

**#906 stamps (do not clone; Wave-16 family CORE):** Rank Stride, Penta Oath, Spike Reel, Screen Bite, Swap Mark, Odd Plate, Mire Skip, Odd Sting, Summon Verse, Equal Gift, Cadence Floor, Cast Toll, Brick Step, Watch Bank, Tied Gait, Portal Cut, Shove Gift, Pack Rank, Rank Fold.

**#953 stamps (do not clone; Wave-16 family CORE):** Tally Mend, Cadence Prime, Dec Span, Purse Turn, Tally Hood, Tally Sting, Tally Step, Tally Sill, Tally Hold, Tally Lend, Tally Sip, Tally Post, Tally Bounce, Must Tally, Verse Tally, Court Prime.

**#962 stamps (do not clone; Wave-17 extras):** File Stride, Hexa Oath, Lava Reel, File Bite, Strike Mark, Dry Plate, Shock Skip, Even Sting, Summon Rank, Lean Gift, Cadence Rise, Still Toll, Brick Brace, Watch Root, Odd Gait, Spike Cut, Summon Plate, Pack Diag, Far Fold.

**#1011 stamps (do not clone; Wave-17 family CORE):** Score Mend, Cadence Snuff, Hendeca Span, Duel Turn, Score Hood, Score Sting, Score Step, Score Sill, Score Hold, Score Lend, Score Sip, Score Post, Score Bounce, Must Score, Verse Score, Court Snuff. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`.

**#899 Wave-14 families (do not clone / do not CORE unique §11):** `gaunt_mender` … `axis_cutter` (31 sheets).

**#941 Wave-15 families (do not clone / do not CORE unique §11):** `poise_mender`, `nine_prelate`, `bar_crosser`, `poise_hooder`, `poise_stinger`, `poise_stepper`, `poise_siller`, `poise_holder`, `poise_lender`, `poise_sipper`, `poise_prelate`, `poise_bouncer`, `must_poiser`, `verse_poiser`, `knight_warder`, `quad_oather`, `pit_reeler`, `axis_biter`, `shove_marker`, `spent_plater`, `rime_skipper`, `full_stinger`, `summon_caster`, `hollow_gifter`, `cadence_swapper`, `strike_debter`, `brick_nudger`, `watch_sipper`, `lone_gaiter`, `hazard_cutter`, `drift_gifter`.

**#997 Wave-16 families (do not clone / do not CORE unique §11):** `tally_mender`, `cadence_primer`, `dec_prelate`, `purse_turner`, `tally_hooder`, `tally_stinger`, `tally_stepper`, `tally_siller`, `tally_holder`, `tally_lender`, `tally_sipper`, `tally_prelate`, `tally_bouncer`, `must_tallier`, `verse_tallier`, `rank_warder`, `penta_oather`, `spike_reeler`, `screen_biter`, `swap_marker`, `odd_plater`, `mire_skipper`, `odd_stinger`, `summon_verser`, `equal_gifter`, `cast_toller`, `brick_stepper`, `watch_banker`, `tied_gaiter`, `portal_cutter`, `shove_gifter`.

**#951 Wave-16 extra doors (do not restamp):** `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`.

**#1004 Wave-17 extra doors (do not restamp):** `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`.

**#953 extra doors (do not restamp):** `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`.

**#1011 extra doors (do not restamp):** `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-ring-stride` | ENEMY_DISCOVERY | yes | blink / rank_lancer G≥16 | **One** next walk Chebyshev exactly 2, knight excluded |
| `spell-hepta-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 7 |
| `spell-rime-reel` | ENEMY_DISCOVERY | yes | rime / tide | Pull 1 toward nearest ice occupancy |
| `spell-rank-bite` | ENEMY_DISCOVERY | yes | blink / lurker | Bonus if share **rank only** |
| `spell-last-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates when occupant spends **last AP** on it |
| `spell-dual-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit is 0 while leftover AP **even ≥ 2** **and** leftover MP **even ≥ 2** |
| `spell-rift-skip` | ENEMY_DISCOVERY | yes | tide / plague | 1-tile walk ignores Void Rift tax |
| `spell-fresh-sting` | ENEMY_DISCOVERY | yes | plate / golem | Leftover AP **equals max AP** → bonus damage |
| `spell-summon-file` | ELITE | yes | brood_chanter | Allied summons pay +1 AP to walk off file |
| `spell-prime-gift` | ELITE | yes | pale / font cantor | Heal iff leftover AP = 1 **and** leftover MP = 1 |
| `spell-cadence-cap` | ENEMY_DISCOVERY | yes | cadence / hex | Remaining `n>2` → 2; 0/1/2 stay |
| `spell-gait-toll` | ENEMY_DISCOVERY | yes | tax / ley | Next walk +1 AP if leftover **MP = 0** |
| `spell-brick-hold` | ENEMY_DISCOVERY | yes | stone / rime | Cannot walk while adjacent to a barrier |
| `spell-watch-drain` | ELITE | yes | glass / hood | Overwatch snap steals 1 leftover MP |
| `spell-even-gait` | ENEMY_DISCOVERY | yes | purse / scribe | Bonus if leftover **MP is even ≥ 2** |
| `spell-rime-cut` | ELITE | yes | glyph / plague | Bonus if target is Chebyshev ≤ 2 from ice occupancy |
| `spell-cast-plate` | ELITE | yes | brood_chanter | Target’s next non-Strike spell deals 0 |
| `spell-pack-orth` | ENEMY_ONLY | no | `lane_precentor` CHAMPION | Pack walks locked to orthogonal |
| `spell-leap-fold` | BOSS_ONLY | no | `leap_fold_regent` | Swap two player-side bodies at Chebyshev exactly 3 |

All unique rows STATUS: **PROPOSED**.
