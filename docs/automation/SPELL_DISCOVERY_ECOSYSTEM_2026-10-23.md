# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 15

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-23  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–14 are Generations 3–14. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Waves 6–14 are still-open #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 / **#906**. This document is **Generation 15**. `generationMin: 15`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

**Gap note.** The last SDE wave PR is **#906** (2026-10-22). This pass does **not** skip generations and does **not** mint Waves 16–35. It is the next sequential generation.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-23.md`](./ACTION_IDS_SDE_2026-10-23.md).

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
| Wave-6…12 discovery contracts | still-open #480 / #533 / #590 / #646 / #679 / #747 / #802 | G≥6…12 extra slots and those unique catalogs |
| Wave-13 discovery contract | still-open **#837** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-21.md` | G≥13 extra slot, W13 unique ids. **Stamp onto Wave-15 family CORE, do not clone** |
| Wave-14 discovery contract | still-open **#906** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md` | G≥14 extra slot, W14 unique ids, #802 / #849 / #890 stamps. Unique §11 stay extras until Wave 16 |
| Wave-1…14 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-10-22.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 / #729 / #791 / #815 / **#892** | `ownedSpellIds` / `observedSpellIds`, soft-retire. **#870** is Master Technical Director roadmap — **not** a tactical catalog |
| Tactical gap-fillers W1…W13 | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 | Reserved in §0.1 |
| Tactical gap-fillers W14 | still-open **#890** — `SPELL_PROPOSALS_2026-10-22.md` | Poise Mend … Court Floor. **Stamp as Wave 15 family CORE, do not clone**. Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` — do not restamp. **SDE already won** `spell-cadence-floor` on #906; do not ship a second copy |
| Tactical gap-fillers W15 | still-open **#953** — `SPELL_PROPOSALS_2026-10-23.md` | Tally Mend … Court Prime. **Stamp as Wave 16 family CORE, do not clone**. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` — do not restamp. Cadence Prime is remaining `0→1`; Cadence Rise is remaining `1→2`. **SDE wins** unique §11 if a hole collides |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + #686 + #752 + #796 + #840 + #899 + **#941** | **#941** Wave-15 families (31 sheets) consume unique **#837** Wave-13 verbs (minus Pack File / Diag Fold) **and** **#890** (except Cadence Floor / Court Floor). Unique §11 stay extras until Wave 17. Do **not** put unique §11 ids in #899 CORE or #941 CORE. Do **not** restamp #941 `ENEMY_ID`s |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 + **#951** | Extra doors claimed through Wave 15 (`jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`). **#951** Wave-16 extra doors `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` — do not restamp |
| Same-day world dynamics | still-open **#949** | `WF-*` Wave-15 overlays. Not a spell catalog. Do not consume. Sheath File / Orth Picket are hostiles, not teach rooms |
| Same-day spell admin | still-open **#940** | `SDA-2026-10-23-145` … `159`. Soft-retire / tooling. Do not re-file those ACTION_IDs |
| Same-day encounter admin | still-open **#932** | `WDEAD-2026-10-23-001` / `002`. Occupancy unseals and persist-keep rails. Not a spell catalog |
| Same-day content freeze | still-open **#942** | `CDA-2026-10-23-029` freezes Wave-14/15 HP clones and forbids **Wave 16** until live gates. This document is sequential **Generation 15**, not Wave 16 |
| Same-day encounter primer | #771 — Bash/Dry/Hood catalog | Room ids `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`. Not a spell catalog. Do not consume |
| Prior-day encounter catalogs | still-open **#826** / **#885** | 2026-10-21 and 2026-10-22 ENC-* tables. Not spell catalogs. Do not consume. `ENC-SPIKE-01` is Spike Skip, not Spike Cut. `ENC-INCH-01` is Inch Stride, not File Stride. `ENC-FOLD-01` is a wall fold, not Far Fold |
| Same-day encounter catalog | still-open **#957** | `ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` / `ENC-DWELL-01` / `ENC-GATE-02` / `ENC-OWN-01` / `ENC-CINDER-02`. Not spell grants. Do not consume |
| PX coherence | #343 / #393 / #481 / #579 / #632 / #744 / #784 / #844 / **#907** | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-15 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

At audit start (2026-10-23 00:04 UTC) no `SPELL_PROPOSALS_2026-10-23.md` existed. Same-day **#941** opened as the Wave-15 family sheet and **does** consume **#837 + #890** (not unique §11). Same-day **#951** opened Wave-16 boss extra doors. Same-day **#953** opened the Wave-15 tactical catalog — **stamp it as Wave 16 family CORE** and do not clone its ids into unique §11. Unique §11 stay extras until Wave **17** families. If #953 claims a hole this document already authored, **SDE wins** the unique §11 id.

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

**#953 tactical Wave 15 (stamp as Wave 16 family CORE, do not clone):** `spell-tally-mend`, `spell-cadence-prime`, `spell-dec-span`, `spell-purse-turn`, `spell-tally-hood`, `spell-tally-sting`, `spell-tally-step`, `spell-tally-sill`, `spell-tally-hold`, `spell-tally-lend`, `spell-tally-sip`, `spell-tally-post`, `spell-tally-bounce`, `spell-must-tally`, `spell-verse-tally`, `spell-court-prime`. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` — do not restamp. Cadence Prime is remaining `n===0` → `1`. Cadence Rise is remaining `n==1` → `2`. Tally Mend is both-body leftover **sum === 3**. Lean Gift is leftover AP = 0 **and** leftover MP ≥ 1. Dec Span is ten-cell occupy. Do **not** mint `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm`.

**Do not alias** `spell-cadence-rise` ↔ `spell-cadence-prime` / `spell-cadence-floor` / `spell-cadence-arm`, `spell-lean-gift` ↔ `spell-tally-mend` / `spell-poise-mend` / `spell-equal-gift`, `spell-far-fold` ↔ `spell-dec-span` / `spell-nine-span`, `spell-file-stride` ↔ `spell-rank-stride` / `spell-orth-stride` / `spell-rank-lock` / `spell-pack-file` / `spell-even-stride` / `spell-diag-stride`, `spell-hexa-oath` ↔ `spell-penta-oath` / `spell-quad-oath` / `spell-six-span` / `spell-far-hood` / `spell-long-oath`, `spell-lava-reel` ↔ `spell-spike-reel` / `spell-cinder-reel` / `spell-pit-reel` / `spell-void-reel` / `spell-lava-skip` / `spell-hook-line`, `spell-file-bite` ↔ `spell-axis-bite` / `spell-file-lance` / `spell-screen-bite` / `spell-rear-cut` / `spell-leash-cut`, `spell-strike-mark` ↔ `spell-cast-mark` / `spell-swap-mark` / `spell-shove-mark` / `spell-ingress-mark` / `spell-body-mark`, `spell-dry-plate` ↔ `spell-gait-plate` / `spell-dry-sting` / `spell-dry-gait` / `spell-odd-plate` / `spell-spent-plate` / `spell-even-plate`, `spell-shock-skip` ↔ `spell-spike-skip` / `spell-glyph-skip` / `spell-mire-skip` / `spell-shock-glyph` / `spell-gap-ward`, `spell-even-sting` ↔ `spell-odd-sting` / `spell-pair-purse` / `spell-gaunt-sting` / `spell-dry-sting` / `spell-full-sting`, `spell-summon-rank` ↔ `spell-summon-toll` / `spell-pack-rank` / `spell-summon-gait` / `spell-summon-verse`, `spell-lean-gift` ↔ `spell-lean-sting` / `spell-hollow-gift` / `spell-dry-mend` / `spell-equal-gift` / `spell-poise-mend`, `spell-cadence-rise` ↔ `spell-cadence-stall` / `spell-cadence-lag` / `spell-cadence-floor` / `spell-cadence-trim`, `spell-still-toll` ↔ `spell-cast-toll` / `spell-quiet-hex` / `spell-spent-tax` / `spell-walk-toll` / `spell-still-tax`, `spell-brick-brace` ↔ `spell-load-bearing` / `spell-ward-plate` / `spell-screen-bite` / `spell-brick-step`, `spell-watch-root` ↔ `spell-watch-fee` / `spell-watch-sip` / `spell-root-snare` / `spell-cast-snare` / `spell-watch-bank`, `spell-odd-gait` ↔ `spell-lone-gait` / `spell-pair-gait` / `spell-odd-sting` / `spell-odd-plate`, `spell-spike-cut` ↔ `spell-hazard-cut` / `spell-portal-cut` / `spell-spike-reel` / `spell-spike-skip` / `spell-leash-cut`, `spell-summon-plate` ↔ `spell-brood-ward` / `spell-split-plate` / `spell-summon-brace` / `spell-surplus-ward`, `spell-pack-diag` ↔ `spell-pack-file` / `spell-pack-rank` / `spell-diag-stride` / `spell-diag-lock`, `spell-far-fold` ↔ `spell-reach-fold` / `spell-adj-fold` / `spell-file-fold` / `spell-rank-fold` / `spell-diag-fold` / `spell-mid-fold`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Unique Wave-13 CORE (#837 — stamp onto Wave-15 family CORE, do not clone)

#837 **owns** the G≥13 unique SDE holes. Wave 14 already recorded them as extras. This document **consumes #837 as Wave-15 family CORE** (together with #890) and does **not** re-author those cards.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-knight-stride` | ENEMY_DISCOVERY | **One** next walk (2,1). Distinct from File Stride (**same x only**) |
| `spell-quad-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 4. Distinct from Hexa Oath (**exactly** 6) |
| `spell-pit-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **painted pit**. Distinct from Lava Reel (nearest **lava occupancy**) |
| `spell-axis-bite` | ENEMY_DISCOVERY | Bonus if share **rank or file**. Distinct from File Bite (**file only**) |
| `spell-shove-mark` | ENEMY_DISCOVERY | Cell detonates on **force-move landing**. Distinct from Strike Mark (**Strike from** the cell) |
| `spell-spent-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover **AP ≥ 1**. Distinct from Dry Plate (leftover **MP = 0**) |
| `spell-rime-skip` | ENEMY_DISCOVERY | 1-tile walk ignores rime **leave-tax**. Distinct from Shock Skip (shock-tile **enter-tax**) |
| `spell-full-sting` | ENEMY_DISCOVERY | Bonus if leftover AP **≥ 3** (often caster). Distinct from Even Sting (target leftover AP **even and ≥ 2**) |
| `spell-summon-cast` | ELITE | Allied summons pay +1 AP to **any spell**. Distinct from Summon Rank (pets pay +1 AP to **walk off rank**) |
| `spell-hollow-gift` | ELITE | Heal iff **target** leftover AP = 0 **and** leftover MP = 0. Distinct from Lean Gift (AP = 0 **and** MP **≥ 1**). **Healer CORE only** — not general Wave-15 family CORE |
| `spell-cadence-swap` | ENEMY_DISCOVERY | Exchange remaining CD maps. Distinct from Cadence Rise (only remaining **1 → 2**) |
| `spell-strike-debt` | ENEMY_DISCOVERY | Next **walk** +1 AP if they **Struck**. Distinct from Still Toll (next **spell** +1 AP if leftover **MP = 0**) |
| `spell-brick-nudge` | ENEMY_DISCOVERY | Push an adjacent barrier **away**. Distinct from Brick Brace (next hit 0 if a barrier is **adjacent**) |
| `spell-watch-sip` | ELITE | Overwatch snap **steals** 1 leftover AP. Distinct from Watch Root (snap **zeros leftover MP**) |
| `spell-lone-gait` | ELITE | Bonus if leftover MP **exactly 1**. Distinct from Odd Gait (leftover MP **odd**, including 1/3/5) |
| `spell-hazard-cut` | ELITE | Bonus if target occupies a **painted** hazard. Distinct from Spike Cut (**spike occupancy**, not painted) |
| `spell-drift-gift` | ENEMY_DISCOVERY | Heal iff **anyone** force-moved the target. **Healer CORE only** |
| `spell-pack-file` | ENEMY_ONLY | Pack walks locked to champion **file**. Distinct from Pack Diag (champion **diagonal**). Never owned. Stays `file_precentor` |
| `spell-diag-fold` | BOSS_ONLY | Swap two player-side bodies on a **diagonal**. Distinct from Far Fold (Chebyshev **exactly 4**). Never owned. Stays `diag_fold_regent` |

`knight_gallery` is **not** File Stride’s door. `quad_nave` is **not** Hexa Oath’s door. `pit_aisle` is **not** Lava Reel’s door. `file_precentor` is **not** `diag_precentor`. `diag_fold_regent` is **not** `far_fold_regent`.

### 0.2b Tactical Wave 14 (#890 — stamp as Wave 15 family CORE, do not clone)

#890 **owns** the G≥14 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-15 family CORE is **#837 unique Wave-13 verbs + #890** (except Cadence Floor / Court Floor; Poise Mend is healer CORE only). Extra doors `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` — do not restamp. Do **not** mint `spell-tied-mend` / `spell-equal-mend` / `spell-nona-span` / `spell-tempo-cross` / `spell-court-arm`. **SDE already won** `spell-cadence-floor` on #906.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-poise-mend` | MULTI_SOURCE | Heal iff **caster and target** both leftover AP === leftover MP **and both ≥ 1**. Distinct from Lean Gift (**target** leftover AP = 0 **and** leftover MP ≥ 1). **Healer CORE only** |
| `spell-cadence-floor` | MULTI_SOURCE | **#906 owns this id.** Remaining `n>1` → 1. Distinct from Cadence Rise (only remaining **1 → 2**). Do not ship #890’s copy. `floor_precentor` stays #890’s door |
| `spell-nine-span` | MULTI_SOURCE | Solid 3×3 occupy, counts as **nine**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-bar-cross` | ENEMY_DISCOVERY | Two-body leftover cross: caster AP ↔ target MP **and** caster MP ↔ target AP |
| `spell-poise-hood` | ELITE | Next hit is 0 while leftover AP === leftover MP **and both ≥ 1**. Distinct from Dry Plate (leftover **MP = 0**, AP unread) |
| `spell-poise-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP === leftover MP **and both ≥ 1**. Distinct from Even Sting (leftover AP **even ≥ 2**, MP unread) |
| `spell-poise-step` | ENEMY_DISCOVERY | Caster lands adjacent to an ally with leftover AP === leftover MP ≥ 1 |
| `spell-poise-sill` | ENEMY_DISCOVERY | Occupant with leftover AP === leftover MP ≥ 1 at **start of their turn** takes 8 |
| `spell-poise-hold` | ELITE | Cannot **walk** while leftover AP === leftover MP ≥ 1 |
| `spell-poise-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP if the ally leftover AP === leftover MP ≥ 1 |
| `spell-poise-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP === leftover MP ≥ 1 |
| `spell-poise-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP === leftover MP ≥ 1 |
| `spell-poise-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP === leftover MP ≥ 1 |
| `spell-must-poise` | ELITE | Non-Strike illegal unless leftover AP === leftover MP ≥ 1 **and** the spell spends last AP |
| `spell-verse-poise` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP === leftover MP ≥ 1 |
| `spell-court-floor` | NOT_PLAYER_LEARNABLE | Mass Cadence Floor. Never owned. Distinct from Far Fold (position swap) |

`poise_cantor` is **not** Lean Gift’s door. `floor_precentor` is **not** Cadence Rise’s door (`cadence_thief` / `hex_chorister` observe). `span_nine` is **not** Far Fold’s door. `court_floor_regent` is **not** `far_fold_regent`. Do not name unique §11 families `gaunt_mender` / `cadence_lagger` / `oct_prelate` / `orth_warder` / `axis_cutter` / `poise_cantor` / `poise_mender` / `knight_warder` / `axis_biter` / `hollow_gifter` (#899 / #890 / **#941** own those).

### 0.2c Unique Wave-14 extras (#906 — stamp as Wave 16 extras, do not clone)

#906 **owns** the G≥14 unique SDE holes. This document does **not** consume them as Wave-15 family CORE. Unique Wave-14 §11 stay G≥14 extras until Wave 16 families consume them.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-rank-stride` | ENEMY_DISCOVERY | **One** next walk same **y**. Distinct from File Stride (same **x**) |
| `spell-penta-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 5. Distinct from Hexa Oath (**exactly** 6) |
| `spell-spike-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **spike**. Distinct from Lava Reel (nearest **lava**) and Spike Cut (damage bonus, no pull) |
| `spell-screen-bite` | ENEMY_DISCOVERY | Bonus if Bresenham is **blocked**. Distinct from File Bite (share **file**, LoS unread) |
| `spell-swap-mark` | ENEMY_DISCOVERY | Cell detonates on **teleport/swap landing**. Distinct from Strike Mark (**Strike from**) |
| `spell-odd-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover AP is **odd**. Distinct from Dry Plate (leftover **MP = 0**) |
| `spell-mire-skip` | ENEMY_DISCOVERY | 1-tile walk ignores mire **enter-tax**. Distinct from Shock Skip (shock-tile tax) |
| `spell-odd-sting` | ENEMY_DISCOVERY | Bonus if leftover AP is **odd**. Distinct from Even Sting (leftover AP **even ≥ 2**) |
| `spell-summon-verse` | ELITE | Pets pay +1 AP to **recast last id**. Distinct from Summon Rank (walk off rank) |
| `spell-equal-gift` | ELITE | Heal iff leftover AP **equals** leftover MP **and both ≥ 1**. Distinct from Lean Gift (AP = 0 **and** MP ≥ 1) |
| `spell-cadence-floor` | ENEMY_DISCOVERY | Remaining `n>1` → 1. Distinct from Cadence Rise (only remaining **1 → 2**). **SDE already won** vs #890 |
| `spell-cast-toll` | ENEMY_DISCOVERY | Next spell +1 AP if they **Struck** last turn. Distinct from Still Toll (leftover **MP = 0**) |
| `spell-brick-step` | ENEMY_DISCOVERY | Caster **steps through** an adjacent barrier. Distinct from Brick Brace (hit negate while adjacent) |
| `spell-watch-bank` | ELITE | Overwatch snap **banks** 1 leftover AP. Distinct from Watch Root (zeros leftover **MP**) |
| `spell-tied-gait` | ELITE | Bonus if leftover AP **and** leftover MP are both **exactly 2**. Distinct from Odd Gait (leftover MP **odd**) |
| `spell-portal-cut` | ELITE | Bonus if Chebyshev ≤ 2 from a **world portal**. Distinct from Spike Cut (**spike occupancy**) |
| `spell-shove-gift` | ENEMY_DISCOVERY | Heal iff **this caster** force-moved the target. Distinct from Lean Gift (leftover gate) |
| `spell-pack-rank` | ENEMY_ONLY | Pack walks locked to champion **rank**. Distinct from Pack Diag. Never owned. Stays `rank_precentor` |
| `spell-rank-fold` | BOSS_ONLY | Swap two player-side bodies that **share a rank**. Distinct from Far Fold (Chebyshev **exactly 4**). Never owned. Stays `rank_fold_regent` |

`rank_gallery` is **not** File Stride’s door. `penta_nave` is **not** Hexa Oath’s door. `spike_aisle` is **not** Lava Reel’s door **and** is **not** Spike Cut’s door. `swap_pulpit` is **not** Strike Mark’s door. `mire_nave` is **not** Shock Skip’s door.

### 0.3 Held holes (still not this pass)

Wave 14 §13 listed these as Wave-15/16 candidates. This wave **does not** fill them in unique §11 except the ones marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Eight-cell occupy | **#849 Oct Span owns this hole.** Do not clone |
| Nine-cell occupy (solid 3×3) | **#890 Nine Span owns this hole.** Do not clone. Live `ENEMY_SUMMON_CAP` is still 2 |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Invert leftover AP ↔ leftover MP on one body | **Wave 3 Tempo Invert already owns this hole.** Do not clone |
| Two-body leftover AP ↔ leftover MP cross | **#890 Bar Cross owns this hole.** Do not clone |
| Heal if leftover AP **equals** leftover MP and **both ≥ 1** | **#906 Equal Gift** (target one-body). #890 Poise Mend is **both bodies** |
| Remaining CDs `n>1` → 1 (zeros stay 0) | **#906 Cadence Floor.** Do not clone |
| One next walk must share **file** (same x) | **Filled this wave** as File Stride (`spell-file-stride`). Wave 14 listed minting this id as out of scope **for that pass** |
| Dedicated CORE families for unique Wave-13 §11 verbs **and** #890 | **This catalog consumes them** as Wave-15 family CORE (§12.1). Same-day **#941** authored those CORE rows |
| Dedicated CORE families for unique Wave-14 §11 verbs | Unique Wave-14 §11 stay G≥14 extras until Wave 16 |
| Remaining `0` → `1` / ten-cell occupy / leftover AP+MP === 3 / hostile leftover invert | **#953 owns these.** Cadence Prime / Dec Span / Tally Mend / Purse Turn. Stamp as Wave 16 family CORE. Do not clone |
| Facing cards | Still fail closed until a battle `currentView` writer exists. **No new Wave-15 facing cards** |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-four calendar days after Wave 12, and one day after Wave 14, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Lean Gift / Summon Plate **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-15 unique ids stay `mpCost: 0`. Still Toll / Summon Rank / Pack Diag / Watch Root are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Lava Reel is attract-toward-**nearest lava occupancy**, a new dest flavor after Spike Reel (spike), Pit Reel (pit), Cinder Reel (hazard), Void Reel (void/portal), and Brick Reel (barrier) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-15 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Spike Cut reads **spike occupancy**, never `spell.name` |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21 **#814**…**#869**, then 2026-10-22 **#870**…**#927**. **#371 owns Wave-4 SDE. #802 owns Wave-12 SDE. #837 owns Wave-13 SDE. #906 owns Wave-14 SDE. #849 owns Wave-13 tactical. #890 owns Wave-14 tactical. #899 owns Wave-14 families. #870 owns roadmap. #885 owns 2026-10-22 encounters. #903 owns Wave-15 extra boss doors.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-14 P0 remain the prerequisite. **Do not land Wave-15 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 15 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥15 rares make it sharper: a CHAMPION may hold the generation-15 verb until a same-file landing / lava cell / leftover-MP=0 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 15 fills holes Waves 1–14, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, and **#906** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Rank Stride, Rank Lock, Pack File, Axis Bite, Dry Sting, Cadence Stall, Cadence Floor, Hazard Cut, Hollow Gift, Poise Mend, Nine Span, Bar Cross, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 15 stamps `generationMin: 15`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Still Toll **adds 1 AP** to the next **spell** if leftover MP is 0. Summon Rank taxes **allied summons** 1 AP to walk off rank. Pack Diag locks **walk diagonal**. Watch Root **zeros leftover MP**. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 15 unique ids do **not** require `currentView`.
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

Wave-15 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| `spell-file-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Later **walk** that pays the same-file gate | **No** — do not double-observe |
| `spell-strike-mark` **paint** (AP spent) | **Yes** |
| Later **Strike from** the painted cell | **No** |
| `spell-dry-plate` **arm** | **Yes** |
| Later **negated hit** while leftover MP is 0 | **No** |
| `spell-lava-reel` no lava (fizzle after AP) | **Yes** — AP was spent (Wave 2 fizzle rule) |
| `spell-lava-reel` illegal because AI skipped (no AP) | **No** |
| `spell-shock-skip` **arm** | **Yes** |
| Later 1-tile walk onto a shock cell | **No** |
| `spell-cadence-rise` **resolve** (even if no remaining was 1) | **Yes** if AP was spent |
| `spell-brick-brace` no adjacent barrier (fizzle after AP) | **Yes** |
| `spell-watch-root` **arm** of the overwatch that will zero MP | **Yes** |
| Later **snap** that zeros leftover MP | **No** |
| `spell-pack-diag` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-far-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orbs / `WF-SPL-*` / #771 primer rooms / #826 / #885 ENC-* | **Never** write `ownedSpellIds` |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 15 stamps unused **rooms**, not new enum members and not leftover feat doors.

| Source | Wave-15 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥15 family verbs in §11 **plus** #837 / #890 stamps in §0.2 / §0.2b / §12 |
| `ELITE` | Summon Rank, Lean Gift, Summon Plate, Watch Root, Spike Cut |
| `ACHIEVEMENT` | **None.** Do not restamp `survivor` / `jackpot` / `leader_slayer` / `spell_master` |
| `CHALLENGE` | **None.** All nine challenge ids remain claimed through Wave 7 |
| `BOSS` | **None.** Far Fold is `BOSS_ONLY` (never owned) |
| `SPECIAL_ENCOUNTER` | `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | None new. #837 Knight Stride / #890 Poise Mend keep their existing children |
| `ENEMY_ONLY` | Pack Diag (never owned) |
| `BOSS_ONLY` | Far Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-15 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every door listed in Wave 14 §4.1, plus:

| Door | Owner |
| :--- | :--- |
| `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` | Wave 14 SDE (#906) |
| `rank_precentor` / `rank_fold_regent` | Wave 14 SDE Pack Rank / Rank Fold |
| `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` | #890 |
| `gaunt_mender` / `cadence_lagger` / `oct_prelate` / `orth_warder` / `axis_cutter` / other #899 `ENEMY_ID`s | #899 Wave-14 families |
| `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` | #903 Wave-15 extra boss doors |
| `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` | #951 Wave-16 extra boss doors |
| `poise_mender` / `nine_prelate` / `bar_crosser` / `knight_warder` / `quad_oather` / `pit_reeler` / `axis_biter` / `shove_marker` / `hollow_gifter` / `cadence_swapper` / other #941 `ENEMY_ID`s | #941 Wave-15 families |
| `knight_gallery` / `quad_nave` / `pit_aisle` / `shunt_pulpit` / `nudge_nave` | Wave 13 SDE (#837) |
| `file_precentor` / `diag_fold_regent` | Wave 13 SDE Pack File / Diag Fold |
| `gaunt_cantor` / `lag_precentor` / `span_oct` / `court_lag_regent` | #849 |
| `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister` | #836 |
| `orth_gallery` / `tri_nave` / `brick_aisle` / `wake_pulpit` / `orbit_nave` | Wave 12 SDE (#802) |
| `cap_precentor` / `reach_fold_regent` | Wave 12 SDE Pack Cap / Reach Fold |
| `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` | #771 encounter primer |
| `ENC-TEACH-13` / `ENC-SPELL-25` / `ENC-NEAR-01` / other 2026-10-21 ENC-* | #826 encounter catalog |
| `ENC-TEACH-14` / `ENC-SPIKE-01` / `ENC-INCH-01` / `ENC-FOLD-01` / other 2026-10-22 ENC-* | #885 encounter catalog |
| `ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` / `ENC-DWELL-01` / `ENC-GATE-02` / `ENC-OWN-01` / `ENC-CINDER-02` | #957 encounter catalog |
| `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` | #953 Wave-15 tactical extra doors |

### 4.2 Leftover doors (not this pass)

`survivor` only. Economy feats stay Doka-only. `unstoppable` stays unused forever as a spell gate. `jackpot` stays #185 Absolve. Do not restamp `leader_slayer` / `spell_master`.

---

## 5. Spell pool evolution — Generation 15 (never a last tier)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 15 adds the **G≥15 extra slot**.

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
| 3–14 | Prior extra slots from Waves 3–14. Do not retire them |
| 15 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 15` |
| 16+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-14 G14 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **15** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation — extends Wave 14 §5.1)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
     Wave-15 attached families: #837 unique Wave-13 verbs + #890 tactical Wave-14 ids
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3–14. prior extra slots from Waves 2–14
  15. if G ≥ 15: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
      (skip if no legal id; this is the Generation 15 verb)
  16. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  17. drop any id whose AI_REQUIREMENTS are unmet
  18. keep ENEMY_ONLY on enemies (they cast; they never grant)
  19. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 6. New `aiHint` keys (metadata, not names)

Wave 1 §9.1 through Wave 14 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_same_file_only` | flanker, kiter | A legal dest with `dest.x == arm.x` exists this turn or next; skip if they must change file to threaten and Strike is better |
| `next_spell_exact_chebyshev_6` | caster, kiter | Caster can sit at Chebyshev 6 before the next spell, or already sits at 6; skip if they must stay at 1–5 (use Strike / Penta Oath / Quad Oath) |
| `attract_toward_nearest_lava` | caster, controller | A lava occupancy cell exists in Chebyshev ≤ 6 of the target; skip if none, or if the 1-step would land on a world portal / void |
| `bonus_if_share_file_with_caster` | flanker, caster | Target `x == caster.x` and `dy ≠ 0`; skip if they share only a rank, or sit on a diagonal (use Axis Bite / Screen Bite) |
| `detonate_if_strike_from` | caster, controller | Paint the cell a Strike / `physical_attack` is likely to **originate from**; skip if the player will walk there (use Ingress) or teleport there (use Swap Mark) |
| `negate_hit_if_leftover_mp_eq_0` | guardian, charger | Caster can keep leftover MP = 0 through the next incoming hit; skip if they must walk (use Gait Plate’s inverse window, not this) |
| `skip_shock_tile_tax_one_tile` | flanker, charger | Next intended walk is length 1 **onto** a shock-tile occupancy cell; skip if the path is lava / spikes / glyph-tax / length ≥ 2 |
| `bonus_if_target_leftover_ap_even_ge_2` | caster, berserker | Target leftover AP is even **and ≥ 2** at resolve; skip if leftover AP is 0 or odd (use Gaunt Sting / Odd Sting / Dry Sting) |
| `summon_walk_off_rank_ap_tax` | summoner, guardian | ≥ 1 living allied summon whose next walk would change `y` from the summoner’s current rank; skip if none, or if they will stay on rank (use Summon Toll for every walk) |
| `heal_if_leftover_ap_eq_0_and_mp_ge_1` | healer | Target leftover AP = 0 **and** leftover MP ≥ 1 and missing HP ≥ 8; skip if leftover AP ≥ 1 (use Equal Gift / Poise Mend) or leftover MP = 0 (use Hollow Gift). **Healer CORE only** |
| `bump_remaining_cds_eq_1_to_2` | caster, controller | Target has ≥ 1 remaining CD **exactly 1**; skip if every remaining is 0 or > 1 (Stall would still pad; Floor would peel n>1) |
| `tax_next_spell_if_leftover_mp_eq_0` | caster, controller | Target leftover MP is 0 and they still have a spell to confirm; skip if leftover MP ≥ 1 (use Quiet Hex / Cast Toll) |
| `negate_hit_if_adjacent_barrier` | guardian, caster | An adjacent barrier exists **and** an incoming hit is likely; skip if no barrier, or if HP% < 40 and they should walk instead |
| `overwatch_snap_zero_walker_mp` | kiter, caster | Caster already has or will arm an overwatch this turn **and** the likely walker has leftover MP ≥ 1; skip if Watch Fee already covers leftover AP, or if no snap is likely |
| `bonus_if_leftover_mp_odd` | caster, kiter | Target leftover MP is odd at resolve; skip if leftover MP is even (use Pair Gait / Dry Sting / Lone Gait only when exactly 1 is better) |
| `bonus_if_near_spike_occupancy` | caster, controller | Target Chebyshev ≤ 2 from a spike occupancy cell; skip if they stand farther, or if the nearest cell is a painted pit (use Hazard Cut) |
| `summon_next_hit_zero` | summoner, guardian | ≥ 1 living allied summon that will take a hit this round; skip if none. **Do not** put `healAmount > 0` on this row |
| `pack_walk_share_champion_diag` | buffer | CHAMPION only; skip if aura up or no ally in 2 |
| `fold_two_player_side_chebyshev_4` | **boss AI only** | Exactly two living player-side bodies at Chebyshev **exactly 4**; skip if 0–1, or they sit at 2 (use Reach Fold), or they share a rank (use Rank Fold) |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: Doka credit `WorldExploration.tsx` 1502–1504, jackpot `WorldExploration.tsx` 18448.
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Strike Mark / Dry Plate / Shock Skip / Watch Root / Brick Brace may add a **battle-log line** when the detonate / negate / skip / snap / blocked hit fires — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 15 adds **no** new canister methods.

| Writer | Wave-15 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | Not used for a new feat/challenge door this wave. #837 / #890 MULTI children stay those catalogs’ |

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
- Lean Gift HP gain uses existing healUsed only when player-side HP actually increased. Lava Reel onto lava/spikes uses existing hazard helpers (`recordInBattleChallengeDamage` only while `inBattleRef` if treated as environmental).

---

## 9. Special encounters (Wave 15)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `file_gallery` | Blink Cutter / File Lancer with a legal same-file landing | `spell-file-stride` via observe+win |
| `hexa_nave` | Glass Sniper at Chebyshev 6 down a file | `spell-hexa-oath` via observe+win |
| `lava_aisle` | Tide / Glyph on a map that already has lava occupancy | `spell-lava-reel` via observe+win |
| `strike_pulpit` | Glyph Sower + a visible Strike bait (not Twin Gate pads) | `spell-strike-mark` via observe+win |
| `shock_nave` | Tide Shade on existing shock-tile occupancy; AI prefers Shock Skip if a 1-tile enter is forced | `spell-shock-skip` via observe+win |

Do not retag `rank_gallery` / `orth_gallery` / `even_gallery` / `penta_nave` / `span_six` / `spike_aisle` / `pit_aisle` / `swap_pulpit` / `mire_nave`. Do not consume #771 primer rooms, #826 ENC-* ids, or #885 ENC-* ids. Twin Gate pads stay off `map.portals`. Lava / shock / spike cells are map-modifier occupancy, not painted pits. `ENC-SPIKE-01` stays Spike Skip’s room. `ENC-FOLD-01` stays a wall fold, not Far Fold.

Wave-1 `echo_dummies`, Wave-2 `rime_gallery` / `still_court` / `mist_gallery`, Wave-13 `knight_gallery` / `quad_nave` / `pit_aisle` / `shunt_pulpit` / `nudge_nave`, and Wave-14 `rank_gallery` / `penta_nave` / `spike_aisle` / `swap_pulpit` / `mire_nave` are not re-specified.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–14 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 + #695 + #726 + #787 + #849 + #890 already cover: push, pull, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, conditional bounce, next-spell AP tax, next-walk AP tax, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, instant execute, DoT detonate, cross AoE, tile-gravity, ally rescue pull, ice tile, smoke, sinkhole, leash hook, bastion, goad, life tether, leftover-AP=0 heal, leftover-MP=0 heal, target both-pools-empty heal, four-body both-pools-empty heal, CD copy / steal / swap / lag / stall / stretch / halve / trim / rest / grace / floor, even-Chebyshev hood, odd-Chebyshev hood, eight-cell occupy, nine-cell occupy, leftover-AP-odd walk lock, knight walk, exact-4/5 spell gate, pit/spike pull, force-move paint, leftover-AP≥1 plate, leftover-AP-odd plate, same-rank next walk.

**Still open (Wave 15 SDE unique ids).** The eight-cell occupy, nine-cell occupy, four-body gaunt heal, CD floor, and remaining `n>0`→`n+2` are siblings’; this table is what Discovery **adds**.

| Hole | Wave-15 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk must share **file** (same x) | `spell-file-stride` | Rank Stride is same **y**. Orth Stride is any orthogonal. Rank Lock is **all remaining** walks on rank **or** file. Pack File locks **allies** to a **file** |
| Next spell illegal unless Chebyshev = 6 | `spell-hexa-oath` | Penta Oath is 5. Quad Oath is 4. Long Oath is ≥ 3. Six Span is occupy-weight 6 |
| Pull 1 toward nearest **lava occupancy** | `spell-lava-reel` | Spike Reel is spike occupancy. Cinder Reel is **painted** hazard. Lava Skip **ignores** lava tax. Hook Line is toward **caster** |
| Bonus if share **file only** | `spell-file-bite` | Axis Bite is rank **or** file. File Lance is a linear poke. Screen Bite wants Bresenham **blocked**. Leash Cut is axis with a **pet** |
| Cell detonates when a unit **Strikes from** it | `spell-strike-mark` | Cast Mark is a **spell** confirm. Swap Mark is teleport landing. Shove Mark is force-move landing. Ingress is walk enter |
| Next hit is 0 while leftover **MP = 0** | `spell-dry-plate` | Gait Plate is leftover MP **≥ 1**. Dry Sting is **damage bonus** if leftover MP = 0. Odd Plate is leftover **AP odd**. Spent Plate is leftover **AP ≥ 1**. `even-plate` stays tombstoned |
| 1-tile walk ignores **shock-tile** tax | `spell-shock-skip` | Spike Skip is spike land-tax. Glyph Skip is glyph-tax. Mire Skip is mire enter-tax. Shock Glyph is a **boss paint**, not this skip |
| Bonus if leftover AP is **even and ≥ 2** | `spell-even-sting` | Odd Sting is leftover AP **odd**. Pair Purse is leftover AP **exactly 2**. Gaunt Sting is both leftover **0**. Dry Sting is leftover **MP = 0**. 0 is even — this card **excludes 0** |
| Allied summons pay +1 AP to **walk off rank** | `spell-summon-rank` | Summon Toll taxes **every** pet walk. Pack Rank **locks** pack walks to rank (`ENEMY_ONLY`). Summon Gait is walk **MP**. Summon Verse taxes **recast last id** |
| Heal iff leftover AP = 0 **and** leftover MP ≥ 1 | `spell-lean-gift` | Hollow Gift / Gaunt Mend own **0=0**. Dry Mend is leftover **AP = 0** (MP unread, both bodies). Lean Sting is **damage** for caster AP=0 MP≥1. Equal Gift wants AP **==** MP ≥ 1 |
| Remaining CDs **exactly 1 → 2**; others unchanged | `spell-cadence-rise` | Cadence Stall is **+1 all remaining**. Cadence Lag is `n>0` → `n+2`. Cadence Floor is `n>1` → 1. Cadence Trim is −1 |
| Next **spell** +1 AP if leftover **MP = 0** | `spell-still-toll` | Quiet Hex is ungated. Cast Toll is last-turn **Strike**. Spent Tax is last-turn **walk**. Still Tax is a different Wave-10 flag |
| Next hit is 0 if a **barrier is adjacent** | `spell-brick-brace` | Load Bearing is absorb. Ward Plate is a different plate. Screen Bite is **damage through** a blocked Bresenham. Brick Step **relocates** through the barrier |
| Overwatch snap **zeros leftover MP** on the walker | `spell-watch-root` | Watch Fee is leftover **AP −1**, no transfer. Watch Sip **steals AP**. Watch Bank **banks AP**. Root Snare is a **tile** root. Cast Snare is a cast-time root |
| Bonus if leftover **MP is odd** | `spell-odd-gait` | Lone Gait is leftover MP **exactly 1**. Pair Gait is leftover MP **exactly 2**. Odd Sting is leftover **AP odd**. Dry Sting is leftover MP **= 0** (even) |
| Bonus if Chebyshev ≤ 2 from **spike occupancy** | `spell-spike-cut` | Hazard Cut is **painted** hazard and **explicitly** not spikes-as-occupancy-only. Portal Cut is **world portals**. Spike Reel **pulls**. Spike Skip **ignores tax** |
| Allied summons treat the next hit as 0 | `spell-summon-plate` | Brood Ward is a boss absorb. Split Plate is a different plate. Summon Brace is RES. Surplus Ward is evade charges. `healAmount` stays 0 |
| Pack walks locked to champion **diagonal** | `spell-pack-diag` | Pack File is **file**. Pack Rank is **rank**. Diag Stride is one next walk from **self**. Never owned |
| Swap two player-side bodies at Chebyshev **exactly 4** | `spell-far-fold` | Reach Fold is exactly **2**. Adj Fold is Chebyshev **1**. Rank Fold is shared **rank**. File Fold is a different boss. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 15)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–14, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #802, #837, #849, **#890**, or **#906**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Still Toll / Summon Rank / Pack Diag / Watch Root are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 15 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #906 / #890 / #837 key names for a different meaning.

```text
fileStrideLockX,                  // File Stride — dest.x == arm.x
nextSpellExactChebyshev,          // Hexa Oath — value 6 (reuse key; value distinguishes Penta=5 / Quad=4)
attractTowardNearestLava, lavaSearchRadius,
bonusIfShareFileWithCaster, fileBiteBonus,
detonateOnStrikeFrom,             // Strike Mark — physical_attack originating on the cell
negateHitIfLeftoverMpEq0,
skipShockTileTaxOneTile,
bonusIfTargetLeftoverApEvenGe2, evenStingBonus,
summonWalkOffRankApTax,
requireLeftoverApEq0AndMpGe1, leanGiftHeal,
bumpRemainingCdsEq1To2,           // n==1 → 2; 0 stays 0; n>1 stays
nextSpellApTaxIfLeftoverMpEq0,
negateHitIfAdjacentBarrier,
overwatchSnapZeroWalkerMp,
bonusIfLeftoverMpOdd, oddGaitBonus,
bonusIfNearSpikeOccupancy, spikeCutRadius, spikeCutBonus,
summonNextHitZero, auraRadius, auraDuration,
packWalkShareChampionDiag, packAuraRadius, packAuraDuration,
foldTwoPlayerSideChebyshev4, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` for Watch Root’s arm window; `nextSpellExactChebyshev` with value **6**.

---

### SPELL_ID: `spell-file-stride`

NAME: File Stride  
ROLE: POSITION — one next walk must share file  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rank_lancer`; `G ≥ 15` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥15. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The caster’s **next walk** is legal only if `dest.x == x_at_arm` (`effectParams: {"fileStrideLockX":true}`). Length is free. Rank-change (`dest.x ≠ arm.x`) confirm-fails (MP not spent). Forced movement / swap / blink / Twin-gate still legal. Distinct from Rank Stride (same **y**), Orth Stride (any orthogonal), Rank Lock (#282, **all remaining** walks locked to rank **or** file), Pack File (allies locked to a **file**), Diag Stride (`|dx|==|dy|`). Does **not** read `currentView`. Wave 14 listed minting this id as out of scope **for that pass**; this wave fills the hole.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_same_file_only"`. Flanker / kiter. Skip if they must change file to threaten and Strike is better. **Do not** assign to chargers who only walk toward the player on a rank.  
PLAYER_COUNTERPLAY: Stand off-file; occupy the only same-file approach; Root before they arm  
SYNERGIES: File Lance after they are stuck on the file; Pack File on a different body in the pack (do **not** CORE both on one kit)  
BALANCE_RISK: One-walk file lock is a corridor. 2 AP / CD 2 / one consume. Fail closed (confirm fail), never become Orth Stride or Rank Stride.  
PERSISTENCE_REQUIREMENTS: Standard observe → same-encounter win. Observation is the **arm**, not the later walk.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hexa-oath`

NAME: Hexa Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 6  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `pale_cantor`; `G ≥ 15`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **non-Strike** spell confirms only if Chebyshev from caster to that spell’s target is **exactly 6** (`effectParams: {"nextSpellExactChebyshev":6}`). `physical_attack` stays legal at any range. Distinct from Penta Oath (exactly 5), Quad Oath (exactly 4), Tri Oath (exactly 3), Long Oath (≥ 3), Six Span (occupy-weight 6), Far Hood (incoming miss from ≥ 3). If they arm then walk to 5, the spell fizzles on confirm (AP not spent for the fizzled spell; Hexa Oath already observed).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_6"`. Kiter / caster. Skip if they cannot reach 6 this turn (use Strike / Penta Oath).  
PLAYER_COUNTERPLAY: Close to 5 or 7; Root; Paper Wind  
SYNERGIES: Split Pace / Overcast after they sit at 6; Far Sting as the gated poke  
BALANCE_RISK: Exact-6 + Far Sting is a sniper prison. 2 AP / CD 3 / Strike exempt. Do not restamp `span_six`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lava-reel`

NAME: Lava Reel  
ROLE: POSITION — pull 1 toward nearest lava  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `ignite_alchemist`; `G ≥ 15`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `ignite_alchemist`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Pull the target 1 tile toward the nearest **lava occupancy** cell in Chebyshev ≤ 6 (`effectParams: {"attractTowardNearestLava":true,"lavaSearchRadius":6}`). Lava cells are map-modifier occupancy, **not** painted cinder, **not** `map.portals`, **not** spike occupancy. If no lava exists, or the 1-step would land on a world portal / void, fizzle (AP spent, no move). Distinct from Spike Reel (spike occupancy), Pit Reel (painted pit), Cinder Reel (painted hazard), Void Reel (void/portal), Brick Reel (barrier), Lava Skip (ignore lava **land tax**), Hook Line (toward caster). Occupancy dest uses existing `applyAttract`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_lava"`. Caster / controller. Skip if no lava, or if the 1-step is a world portal.  
PLAYER_COUNTERPLAY: Fight on maps without lava; occupy the toward-tile; blink  
SYNERGIES: Lava Skip on the landing (they still get pulled, tax skipped); Hazard Cut does **not** fire (lava occupancy is not painted cinder unless a later paint says so)  
BALANCE_RISK: Pull onto lava is the combo. AI value-check; dest is never `map.portals`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-board fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-file-bite`

NAME: File Bite  
ROLE: DAMAGE — bonus if caster and target share a file  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `shadow_lurker`; `G ≥ 15`; `aiProfile` flanker/caster  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If `target.x == caster.x` and `dy ≠ 0`, deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfShareFileWithCaster":true,"fileBiteBonus":10}`). If they share only a rank, or sit on a diagonal, only the 10 lands. Distinct from Axis Bite (rank **or** file), File Lance (linear poke down the file, different id), Screen Bite (Bresenham **blocked**), Rear Cut (adjacent flank), Leash Cut (axis with a **pet**). Reads occupancy, never `spell.name`.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_file_with_caster"`. Flanker / caster. Skip if they do not share a file and Frost is better.  
PLAYER_COUNTERPLAY: Step off the file; stand on the rank instead; blink  
SYNERGIES: File Stride then bite (do **not** CORE both on one body); File Lance on a different family  
BALANCE_RISK: 20 on a file is Frost-adjacent on 2 AP CD 1. G≥15 + file gate. Fail closed (10 only), never become Axis Bite.  
PERSISTENCE_REQUIREMENTS: Off-file 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-strike-mark`

NAME: Strike Mark  
ROLE: TERRAIN — cell detonates when a unit Strikes from it  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `bone_scribe`; `G ≥ 15`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor tile 2 turns. The next unit who **resolves `physical_attack` / Strike originating on that cell** takes 10 (spell, RES+SR) and the paint consumes (`effectParams: {"detonateOnStrikeFrom":true,"markDamage":10,"hazardDuration":2}`). Walk-enter, spell confirm, push, pull, slide, and teleport **do not** detonate. Distinct from Cast Mark (Wave 7, **spell** confirm from the cell), Swap Mark (teleport landing), Shove Mark (force-move landing), Ingress Mark (walk enter), Body Mark (#563). Observation is the **paint**.  
SCALING: damage follows dmg%; trigger class fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_strike_from"`. Caster / controller. Skip if the player has no Strike in kit and no adjacent melee threat.  
PLAYER_COUNTERPLAY: Spell from the cell (safe); walk onto it (safe); wait the 2; Strike from an adjacent cell  
SYNERGIES: Goad / Taunt Oath to force Strike; Swap Mark is a different paint — do not CORE both  
BALANCE_RISK: Punishing melee from a bait cell is the identity. Spell/walk is the counter. CD 2 / consume-on-first-Strike.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dry-plate`

NAME: Dry Plate  
ROLE: DEFENSE — next hit is 0 while leftover MP is 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 15`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥15. `generationMin: 15`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Until consumed or this unit’s next turn start. The next **applied** damaging hit deals 0 **if** leftover MP is **0** at the moment of the hit, and then consumes (`effectParams: {"negateHitIfLeftoverMpEq0":true}`). If leftover MP ≥ 1, the hit lands and the charge **remains**. Distinct from Gait Plate (leftover MP **≥ 1**), Dry Sting (#636, **damage bonus** if leftover MP = 0), Dry Gait (heal if both leftover MP = 0), Odd Plate (leftover **AP odd**), Spent Plate (leftover **AP ≥ 1**). Do **not** mint `spell-even-plate`. Does not read `CharacterStats.evasion`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_mp_eq_0"`. Guardian / charger. Skip if they must walk that leftover MP to threaten.  
PLAYER_COUNTERPLAY: Hit them after they walk (leftover MP ≥ 0 becomes ≥ 1 only if they keep some — force a walk that spends last MP, then wait; or hit while they still have 1 MP); wait the turn start peel  
SYNERGIES: Dry Sting on a different family (damage vs negate — do not CORE both); Undertow to empty their walk pool  
BALANCE_RISK: Camping at 0 MP is the identity. 2 AP / CD 2 / MP-empty gate. Weaker than Spent Plate while they still have AP.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. Leftover-MP≥1 full hit does not consume and does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-shock-skip`

NAME: Shock Skip  
ROLE: POSITION — 1-tile walk ignores shock-tile tax  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `plague_rat`; `G ≥ 15`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Consume-on-first-walk. The caster’s next **length-1** walk does not pay **shock-tile occupancy** tax (`effectParams: {"skipShockTileTaxOneTile":true}`). Shock tiles are map-modifier / boss `SHOCK_TILES` occupancy, **not** Shock Glyph paint. Length ≥ 2 still pays. Lava, spikes, glyph-tax, rime leave-tax, and mire enter-tax still tick. Distinct from Spike Skip, Glyph Skip, Mire Skip, Rime Skip, Lava Skip, Cinder Skip, Gap Ward, Shock Glyph (#137).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_shock_tile_tax_one_tile"`. Kiter / flanker / charger. Skip if no shock tile is on the intended 1-tile path.  
PLAYER_COUNTERPLAY: Force a length-2 path; overwrite the cell; Root  
SYNERGIES: Fight on maps that already place shock occupancy; do not skip `finalizePlayableLayout`  
BALANCE_RISK: Skip + attract is a close. Length-1 + consume + CD 2. Do not ignore lava/spikes.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**, not the later walk.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-even-sting`

NAME: Even Sting  
ROLE: DAMAGE — bonus if target leftover AP is even and ≥ 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 15`; `aiProfile` caster/berserker  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥15. `generationMin: 15`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target’s** leftover AP is **even and ≥ 2** (2, 4, 6, …), deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfTargetLeftoverApEvenGe2":true,"evenStingBonus":10}`). If leftover AP is 0 or odd, only the 10 lands. Distinct from Odd Sting (leftover AP **odd**), Pair Purse (leftover AP **exactly 2** — this card also fires at 4/6), Gaunt Sting (both leftover **0** — 0 is even, **excluded here**), Dry Sting (leftover **MP = 0**), Full Sting (often **caster** leftover AP ≥ 3).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_leftover_ap_even_ge_2"`. Caster / berserker. Skip if leftover AP is 0 or odd and Frost is better.  
PLAYER_COUNTERPLAY: Spend 1 AP to odd the pool; sit at 0 or 1; Dual Keep leftover 1  
SYNERGIES: Drain Courage to land leftover 2; Odd Sting on a different family (do not CORE both)  
BALANCE_RISK: 20 on leftover 2/4 is Frost-adjacent on 2 AP CD 1. G≥15 + even-and-≥2 gate. Overlap with Pair Purse at exactly 2 is documented, not a clone (Pair Purse is the exact-2 specialization).  
PERSISTENCE_REQUIREMENTS: Odd-or-zero leftover 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-rank`

NAME: Summon Rank  
ROLE: SUMMONS — pets pay +1 AP to walk off the summoner’s rank  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 15`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 15`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon that starts a walk whose dest `y` differs from the **summoner’s current `y` at arm time** pays +1 AP (`effectParams: {"summonWalkOffRankApTax":true}`). Walks that stay on that rank are free of this tax. Strike / spells are **not** walks for this key. Distinct from Summon Toll (every pet **walk** +1 AP), Summon Gait (pet walk +1 **MP**), Summon Cast (every pet **spell** +1 AP), Summon Verse (pets pay +1 AP to **recast last id**), Pack Rank (`ENEMY_ONLY` hard lock). Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_walk_off_rank_ap_tax"`. Summoner / guardian. Skip if no allied summon, or if they will stay on rank.  
PLAYER_COUNTERPLAY: Keep pets on the summoner’s rank; Sever Tether; kill the summoner  
SYNERGIES: Summon Toll on a different family (every walk vs off-rank — do not CORE both); Pack Rank is `ENEMY_ONLY` on `rank_precentor` — do not grant  
BALANCE_RISK: Taxing a file-advance wolf is the nightmare. Elite + off-rank-only + CD 3. Player copy taxes **their** pets — a real downside.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Later walk tax does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lean-gift`

NAME: Lean Gift  
ROLE: SUPPORT — heal iff leftover AP = 0 and leftover MP ≥ 1  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 15`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 15`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target may be self. Heal 10 **only if** leftover AP **= 0** and leftover MP **≥ 1** at resolve (`effectParams: {"requireLeftoverApEq0AndMpGe1":true,"leanGiftHeal":10}`). If leftover AP ≥ 1, or leftover MP = 0, fizzle (AP spent). Distinct from Hollow Gift (#837, leftover AP = 0 **and** leftover MP = 0), Gaunt Mend (#849, **caster and target** both leftover 0/0), Equal Gift (#906, leftover AP **==** leftover MP **and both ≥ 1**), Poise Mend (#890, **both bodies** equal ≥ 1), Dry Mend (both leftover **AP** = 0, MP unread), Lean Sting (#787, **damage** if caster leftover AP = 0 and MP ≥ 1). `healAmount` stays 0 on the row so `inferArchetype` does not treat a kit that only *carries* this id as healer. **Healer CORE only.** Do **not** restamp `poise_cantor`.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_eq_0_and_mp_ge_1"`. **Healer CORE only.** Skip if leftover AP ≥ 1 (use Equal Gift) or leftover MP = 0 (use Hollow Gift). Do not dump leftover AP **only** to enable this if a Strike would kill.  
PLAYER_COUNTERPLAY: Leave them 1 AP; empty their walk pool too (Hollow Gift window, not this); Cursed Wound  
SYNERGIES: Drain Courage to empty leftover AP while they still have MP; Dual Keep **destroys** this window if it banks AP. Do not CORE with Hollow Gift / Equal Gift / Poise Mend / Lean Sting  
BALANCE_RISK: 10 on spent-AP / remaining-walk is Mend-lite. Elite + AP=0-and-MP≥1 + CD 3. 0=0 stays the gaunt/hollow identity.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Player-side HP gain sets `healUsed`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-rise`

NAME: Cadence Rise  
ROLE: CONTROL — remaining CDs exactly 1 become 2; others unchanged  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 15`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. For each spell id in the **target’s** remaining-CD map: if `n == 1`, write `2`; if `n` is 0 or `n > 1`, leave it (`effectParams: {"bumpRemainingCdsEq1To2":true}`). Target **keeps every spell**. Once/battle flags and spell levels are **not** CDs. Distinct from Cadence Stall (#590, **+1 all remaining**), Cadence Lag (#849, `n>0` → `n+2`), Cadence Floor (#906, `n>1` → 1), Cadence Trim (−1), Cadence Crack (→ 0). Extra door `floor_precentor` stays #890’s — do not restamp; this catalog teaches via `cadence_thief` / `hex_chorister` observe. The decision: Inferno “almost ready” at 1 becomes 2 — not Stall-wide, not Floor-peel.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "bump_remaining_cds_eq_1_to_2"`. Caster / controller. Skip if no remaining is exactly 1.  
PLAYER_COUNTERPLAY: Recast so remaining is 0 (zeros stay 0); Floor the 2 you just wrote; wait the last 1  
SYNERGIES: Cadence Floor then Rise is illegal as a CORE pair (Floor peels n>1, Rise pads the 1s — do **not** CORE both); Verse Gaunt after you leave them at 2  
BALANCE_RISK: Punishing “almost ready” is strong. 3 AP / CD 2 / cannot touch 0 or n>1. Do not also Stall in the same CORE.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. No-remaining-eq-1 still observes if AP was spent.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-still-toll`

NAME: Still Toll  
ROLE: CONTROL — next spell +1 AP if leftover MP is 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 15`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target’s leftover MP is **0**, their next **spell** this battle (or 2 turns) costs +1 AP (`effectParams: {"nextSpellApTaxIfLeftoverMpEq0":true}`). Strike / `physical_attack` is **not** a spell for this key (still costs 2). If leftover MP ≥ 1, fizzle (AP spent). Distinct from Quiet Hex (next spell +1 AP, **ungated**), Cast Toll (next spell +1 AP if they **Struck** last turn), Spent Tax (next spell after a **walk**), Walk Toll (walk pool flag, not `spell.mpCost`), Still Tax (Wave 10 flag, different verb).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_spell_if_leftover_mp_eq_0"`. Caster / controller. Skip if leftover MP ≥ 1 (use Quiet Hex / Cast Toll) or already sit on Quiet Hex.  
PLAYER_COUNTERPLAY: Keep 1 walk MP; pay the 1 AP; wait 2  
SYNERGIES: Undertow / Walk Toll to empty their walk pool; Dry Plate after they camp at 0 MP  
BALANCE_RISK: Camp-then-spell is a common packet. G≥15 + leftover-MP=0 gate + CD 2. Do not CORE with Quiet Hex.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-brace`

NAME: Brick Brace  
ROLE: DEFENSE — next hit is 0 if a barrier is adjacent  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 15`; `aiProfile` guardian/caster  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Until consumed or this unit’s next turn start. The next **applied** damaging hit deals 0 **if** a barrier cell is Chebyshev 1 from the caster at the moment of the hit, and then consumes (`effectParams: {"negateHitIfAdjacentBarrier":true}`). If no adjacent barrier exists, the hit lands and the charge **remains**. Distinct from Load Bearing (absorb), Ward Plate (#120), Screen Bite (**damage** if Bresenham is blocked), Brick Step (relocate through the barrier), Brick Nudge (move the barrier). Does not read `CharacterStats.evasion`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_adjacent_barrier"`. Guardian / caster. Skip if no adjacent barrier, or if HP% < 40 and they should walk.  
PLAYER_COUNTERPLAY: Destroy the barrier; Brick Nudge it away; hit them after they step off; wait the turn start peel  
SYNERGIES: Barrier as a door they hide behind; Screen Bite on a different family (do not CORE both)  
BALANCE_RISK: Cover-camping is the identity. 2 AP / CD 2 / adjacency gate. Fail closed (hit lands), never become Sidestep.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. No-barrier full hit does not consume and does not second-observe. Fizzle-after-AP with no barrier still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-root`

NAME: Watch Root  
ROLE: CONTROL — overwatch snap zeros leftover MP on the walker  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 15`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 15`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into the caster’s existing overwatch band (Hold Ground enter-1 **or** Far Watch 3–4 — whichever is armed) has leftover MP set to **0** (`effectParams: {"overwatchSnapZeroWalkerMp":true,"overwatchDuration":2}`). The snap still deals that overwatch’s damage if one is armed. If no overwatch is armed, this card arms a **damage-0** enter-1 snap that only zeros leftover MP. Distinct from Watch Fee (walker leftover **AP −1**, no transfer), Watch Sip (steals leftover **AP**), Watch Bank (banks leftover **AP**), Watch Alms (grants walker +1 AP **now**), Root Snare (#120, **tile** root), Cast Snare (cast-time root). Push/pull into the band **does** snap. Teleport / Swap **does not**. This is not `spell.mpCost`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_zero_walker_mp"`. Kiter / caster. Skip if no snap is likely, or if the walker already has leftover MP = 0.  
PLAYER_COUNTERPLAY: Blink in; send a summon; sit still; keep leftover MP 0 already  
SYNERGIES: Far Watch / Hold Ground as the damage snap; Still Toll after they sit at 0 MP  
BALANCE_RISK: Ending a walker’s remaining walk mid-path is Root-lite. Elite + consume-on-first-body + CD 3. Do not also Fee in the same CORE.  
PERSISTENCE_REQUIREMENTS: Observation is the **arm**. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-odd-gait`

NAME: Odd Gait  
ROLE: DAMAGE — bonus if leftover MP is odd  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; `G ≥ 15`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target’s** leftover MP is **odd** (1, 3, 5, …), deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverMpOdd":true,"oddGaitBonus":10}`). Otherwise 10 only. Distinct from Lone Gait (leftover MP **exactly 1** — this card also fires at 3/5), Pair Gait (leftover MP **exactly 2**, even), Full Gait (leftover MP ≥ 3 → **RES**), Odd Sting (leftover **AP odd**), Dry Sting (leftover MP **= 0**, even), Tied Gait (both leftover **exactly 2**).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_mp_odd"`. Caster / kiter. Skip if leftover MP is even and Frost is better. Prefer Lone Gait when leftover MP is exactly 1 **and** that id is already on the kit.  
PLAYER_COUNTERPLAY: Spend 1 walk MP to even the pool; sit at 0 or 2; Dual Keep a different leftover  
SYNERGIES: Lone Gait is the exact-1 specialization — do not CORE both; Walk Toll to **leave** leftover 1  
BALANCE_RISK: 20 at leftover 1/3 is Frost-adjacent on 2 AP CD 1. G≥15 + odd-MP gate. Overlap with Lone Gait at exactly 1 is documented, not a clone.  
PERSISTENCE_REQUIREMENTS: Even leftover 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spike-cut`

NAME: Spike Cut  
ROLE: DAMAGE — bonus if the target is near spike occupancy  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `plague_rat`; variant ≥ ELITE or `G ≥ 15`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 15`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s tile is Chebyshev ≤ 2 from a **spike occupancy** cell, deal an extra 10 as a second `dealDamage` (`effectParams: {"bonusIfNearSpikeOccupancy":true,"spikeCutRadius":2,"spikeCutBonus":10}`). Spike cells are map-modifier occupancy, **not** painted pits. Twin Gate pads and `map.portals` do **not** trigger this. Distinct from Hazard Cut (#837, **painted** hazard; Wave 13 **explicitly** excludes treating occupancy-only spikes as that list unless painted), Portal Cut (world portals), Spike Reel (pull toward spike), Spike Skip (ignore spike **land tax**), Leash Cut (axis with a pet). Reads spike occupancy, never `spell.name`.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_spike_occupancy"`. Caster / controller. Skip if they stand farther than 2 from every spike and Frost is better.  
PLAYER_COUNTERPLAY: Stand 3+ from every spike; fight in rooms without spikes; blink off the threshold  
SYNERGIES: Spike Reel to pull them **toward** a spike (the 1-step must still not **land on** a world portal — Spike Reel already forbids that); do not CORE with Hazard Cut  
BALANCE_RISK: 20 on a spike threshold is Frost-adjacent. Elite + occupancy check. Do not treat Twin Gate pads as spikes. Do not skip portal lock-while-hostile. `ENC-SPIKE-01` stays Spike Skip’s room.  
PERSISTENCE_REQUIREMENTS: Far-from-spike 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-plate`

NAME: Summon Plate  
ROLE: SUMMONS — allied summons treat the next hit as 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 15`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 15`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. Every living **allied** summon treats the next **applied** damaging hit as 0, then that summon’s charge consumes (`effectParams: {"summonNextHitZero":true,"auraRadius":6,"auraDuration":1}`). The summoner’s own hit is **not** covered. Distinct from Brood Ward (#137, boss absorb), Split Plate (a different plate), Summon Brace (RES), Surplus Ward (evade charges), Own Plate (self window). `healAmount` stays 0. Drop this id if `summonAI` is empty.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "summon_next_hit_zero"`. Summoner / guardian. Skip if no allied summon, or if no hit is likely. Do not assign to non-summoner CORE.  
PLAYER_COUNTERPLAY: Hit the summoner; wait the turn; two hits on the same pet (second lands)  
SYNERGIES: Kennel Lock parks the pets; Summon Rank on a different family (do not CORE both with Verse on one BASE kit)  
BALANCE_RISK: A free pet Sidestep is strong. Elite + one consume per pet + CD 3. Player copy covers **their** pets.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Later negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-diag`

NAME: Pack Diag  
ROLE: SUPPORT — allied walks locked to the champion’s diagonal  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family champion `diag_precentor`; variant CHAMPION; `G ≥ 15`  
ENEMY_FAMILIES: `diag_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 15`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 may only **walk** to cells where `|dx|==|dy|` from the champion’s current position at arm time (`effectParams: {"packWalkShareChampionDiag":true,"packAuraRadius":2,"packAuraDuration":2}`). Forced movement is legal. Distinct from Pack File (file / `x`), Pack Rank (rank / `y`), Diag Stride (one next walk from **self**), Diag Lock (forbids diagonal dests), Pack Cap (maxRange 2), Pack Long (minRange 3), Pack Close (maxRange 1). Does not grant the caster extra AP the turn it is cast.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_share_champion_diag"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2. **Do not** put Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies off the diagonal; blink  
SYNERGIES: Diag Stride on a different family; Pack Howl is CHC — CHAMPION may have Howl **or** Diag, not both in CORE  
BALANCE_RISK: Diagonal-locking two bodies is a corridor prison. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`. Do not restamp `file_precentor` / `rank_precentor` / `diag_fold_regent`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe (and would not grant anyway).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-far-fold`

NAME: Far Fold  
ROLE: POSITION — swap two player-side bodies at Chebyshev exactly 4  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `far_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `far_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **only if** Chebyshev between them is **exactly 4**. If fewer than two, or they sit at 1 / 2 / 3 / ≥ 5, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideChebyshev4":true,"foldDamage":6}`). Distinct from Reach Fold (Chebyshev **exactly 2**), Adj Fold (Chebyshev **1**), Rank Fold (shared **rank**), File Fold (#533 `BOSS_ONLY` on `file_regent`), Diag Fold (`|dx|==|dy|`), Mid Fold (shared rank **or** file), Knight Fold ((2,1) from midpoint), Sovereign Fold (any two), Pawn Trade (two hostiles-to-caster), Court Floor (#890 mass CD floor). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_chebyshev_4"`. **Boss AI only.** Skip if 0–1 player-side bodies or they are not at Chebyshev 4.  
PLAYER_COUNTERPLAY: Fight without a summon; stand at 2 or 3; False Retreat decoy as the second body  
SYNERGIES: Far Fold identity; Claim Ward (anti-swap **cell** does not block this — fold is unit swap, not cell claim; **explicit** so implementers do not merge the keys)  
BALANCE_RISK: Forced exact-4 player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`. Do not restamp #903 `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. Do not restamp #951 `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. Do not restamp `court_floor_regent` / `rank_fold_regent` / `diag_fold_regent` / `file_regent`. `ENC-FOLD-01` stays a wall fold.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 15 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…14 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥15 | `spell-file-stride`, `spell-file-bite` |
| `rank_lancer` | RARE / G≥15 | `spell-file-stride` |
| `shadow_lurker` | RARE / G≥15 | `spell-file-bite` |
| `glass_sniper` | RARE / G≥15 | `spell-hexa-oath` |
| `glass_sniper` | ELITE | `spell-watch-root` |
| `pale_cantor` | RARE / G≥15 | `spell-hexa-oath` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-lean-gift` (healer CORE only) |
| `tide_shade` | RARE / G≥15 | `spell-shock-skip` |
| `plague_rat` | RARE / G≥15 | `spell-shock-skip` |
| `plague_rat` | ELITE | `spell-spike-cut` |
| `glyph_sower` | RARE / G≥15 | `spell-lava-reel`, `spell-strike-mark` |
| `glyph_sower` | ELITE | `spell-spike-cut` |
| `ignite_alchemist` | RARE / G≥15 | `spell-lava-reel` |
| `bone_scribe` | RARE / G≥15 | `spell-strike-mark`, `spell-odd-gait` |
| `purse_scribe` | RARE / G≥15 | `spell-odd-gait` |
| `plate_warden` | ADVANCED / G≥15 | `spell-dry-plate`, `spell-even-sting` |
| `iron_golem` | ADVANCED / G≥15 | `spell-dry-plate`, `spell-even-sting` |
| `stone_castellan` | RARE / G≥15 | `spell-brick-brace` |
| `rime_mason` | RARE / G≥15 | `spell-brick-brace` |
| `brood_chanter` | ELITE | `spell-summon-rank`, `spell-summon-plate` |
| `cadence_thief` | RARE / G≥15 | `spell-cadence-rise` |
| `hex_chorister` | RARE / G≥15 | `spell-cadence-rise` |
| `tax_scribe` | RARE / G≥15 | `spell-still-toll` |
| `ley_tollkeeper` | RARE / G≥15 | `spell-still-toll` |
| `hood_lurker` | ELITE | `spell-watch-root` |
| `diag_precentor` CHAMPION | SIGNATURE | `spell-pack-diag` (`ENEMY_ONLY`; not with Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit) |
| `far_fold_regent` | BOSS_ONLY | `spell-far-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-15 family CORE consumes #837 and #890

Same-day **#941** (`ENEMY_ELITE_EVOLUTION_2026-10-23.md`) is that Wave-15 family sheet. It puts remaining **#837** unique Wave-13 verbs (minus Hollow Gift / Pack File / Diag Fold) and **#890** tactical Wave-14 ids (minus Cadence Floor / Court Floor; Poise Mend healer CORE only) in **CORE**. Unique §11 ids may appear there only as G≥15 extras in a later family pass (Wave 17), not as this document’s CORE and **not** as #899 / #941 CORE. Do **not** put unique §11 ids in #840 CORE, #899 CORE, or #941 CORE. Do **not** restamp #941 `ENEMY_ID`s (`poise_mender` … `drift_gifter`). Do **not** name unique §11 families after #899 or #941 `ENEMY_ID`s.

Stamp, do not clone #837: Knight Stride, Quad Oath, Pit Reel, Axis Bite, Shove Mark, Spent Plate, Rime Skip, Full Sting, Summon Cast, Cadence Swap, Strike Debt, Brick Nudge, Watch Sip, Lone Gait, Hazard Cut, Drift Gift. Hollow Gift stays healer CORE only. Pack File stays `ENEMY_ONLY` on `file_precentor`. Diag Fold stays `BOSS_ONLY` on `diag_fold_regent`.

Stamp, do not clone #890: Poise Mend (healer CORE only), Nine Span (implementation-blocked while summon cap is 2), Bar Cross, Poise Hood, Poise Sting, Poise Step, Poise Sill, Poise Hold, Poise Lend, Poise Sip, Poise Post, Poise Bounce, Must Poise, Verse Poise. Cadence Floor stays #906’s (`cadence_thief` / `hex_chorister`). Court Floor stays `NOT_PLAYER_LEARNABLE` on `court_floor_regent`. Do **not** CORE Must Poise with Poise Hold.

### 12.2 Wave-14 unique extras (deferred)

#906 unique Wave-14 verbs (`spell-rank-stride` … `spell-rank-fold`) stay G≥14 extras until Wave 16 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Rank stays `ENEMY_ONLY` on `rank_precentor`. Rank Fold stays `BOSS_ONLY` on `rank_fold_regent`.

### 12.3 Same-day tactical CORE (#953 → Wave 16)

Same-day **#953** (`SPELL_PROPOSALS_2026-10-23.md`) **is** that Wave-15 tactical catalog. **Stamp it as Wave 16 family CORE**. Do **not** put those ids in Wave-15 family CORE or unique §11. Unique §11 stay this catalog’s. Cadence Prime (`n===0` → `1`) is not Cadence Rise (`n==1` → `2`). Tally Mend (both-body leftover **sum === 3**) is not Lean Gift. Dec Span (ten-cell) is not Far Fold. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` — do not restamp. If #953 claims a hole this document already authored, **SDE wins** the unique §11 id.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 16 forever

Same recipe as Wave 14 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 16 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #890 extra doors. Do not restamp #906 rooms. Do not restamp #899 / **#941** family ids. Do not restamp #903 / **#951** extra doors. Do not consume #771 primer room ids. Do not consume #826 / #885 ENC-* ids. Do not consume #949 `WF-*`.

Suggested Wave-16 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-14 §11 verbs (this catalog’s unique ids stay extras until Wave 17). Invert leftover AP↔MP on **ally** is **Wave 3 Tempo Invert**. Hostile invert is **#953 Purse Turn**. Two-body leftover cross is **#890 Bar Cross**. Eight-cell occupy is **#849 Oct Span**. Nine-cell occupy is **#890 Nine Span**. Ten-cell occupy is **#953 Dec Span**. Four-body both-pools-empty heal is **#849 Gaunt Mend**. Remaining `n>0`→`n+2` is **#849 Cadence Lag**. CD floor is **#906 Cadence Floor**. Remaining `0→1` is **#953 Cadence Prime**. Same-file next walk is this wave’s File Stride. Rank Fold stays `BOSS_ONLY` on `rank_fold_regent`. Far Fold stays `BOSS_ONLY` on `far_fold_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / #802 / #808 / #837 / #849 / #836 / #890 / #899 / #906 / **#941** / **#951** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W15-A. G≥15 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W15-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W15-C. Wave-15 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #837 / #890 / #906 / #941 CORE / #953 / memory Wave-5 ids; a second `spell-cadence-floor` |
| W15-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `rank_gallery` / `orth_gallery` / `penta_nave` / `span_six` / `spike_aisle` / `swap_pulpit` / `mire_nave` / #771 primer rooms / #885 ENC-* / #949 `WF-*` |
| W15-E. Lava Reel attract caller | `applyAttract` toward nearest lava occupancy | Damage-math rewrite; RAF; treating dest as `map.portals` or painted cinder |
| W15-F. Strike Mark Strike-from hook | existing Strike resolve | RAF; treating walk-enter as Strike |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

File Stride consume, Strike Mark detonate, Dry Plate consume, Shock Skip consume, and Watch Root consume read flags at walk / Strike-from / incoming-hit / overwatch-snap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 14 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W15-1 | Encounter start | Possessed-but-unused G15 id does not observe |
| W15-2 | File Stride dest with `dest.x ≠ arm.x` | Confirm fails; MP not spent; File Stride already observed |
| W15-3 | `file_gallery` defeat | Does not grant. Victory grants once |
| W15-4 | `rank_gallery` / `orth_gallery` / `even_gallery` / `rank-lock` | Do not grant File Stride |
| W15-5 | Hexa Oath then Frost at Chebyshev 4, 5, or 7 | Confirm fails; Strike still legal |
| W15-6 | Lava Reel no lava | Fizzle observes; no pull. Dest is not `map.portals` and not painted cinder |
| W15-7 | File Bite off-file / shared rank only | 10 only. Axis Bite would want rank **or** file. Screen Bite would want blocked Bresenham |
| W15-8 | Strike Mark walk-enter / spell confirm / teleport landing | No detonate. Ingress would detonate on walk. Cast Mark would detonate on spell. Swap Mark would detonate on teleport |
| W15-9 | Dry Plate hit while leftover MP ≥ 1 | Full hit; charge remains. Hit while leftover MP = 0 consumes. Dry Sting would deal bonus, not negate |
| W15-10 | Shock Skip across lava / spikes / glyph-tax / length 2 | Those taxes still tick. Skip is shock-tile tax + length 1 only |
| W15-11 | Even Sting leftover AP 0 or 1 or 3 | 10 only. Gaunt Sting would want both leftover 0. Odd Sting would want leftover AP odd. Pair Purse would want leftover AP exactly 2 |
| W15-12 | Summon Rank vs Summon Toll vs Summon Verse | Pets pay AP to **walk off rank** vs pay AP to **any walk** vs pay AP to **recast last id** |
| W15-13 | Lean Gift after leftover 0=0 or 1/1 | Fizzle observes; no heal. Hollow Gift would want 0=0. Equal Gift would want AP==MP ≥ 1. Lean Sting would deal damage |
| W15-14 | Cadence Rise vs Stall vs Lag vs Floor vs Prime | Remaining `n==1` → 2 vs +1 **all** vs `n>0` → n+2 vs `n>1` → 1 vs remaining `0` → 1 |
| W15-15 | Still Toll while leftover MP ≥ 1 | Fizzle observes. Cast Toll would tax a post-Strike **spell**. Quiet Hex would tax ungated |
| W15-16 | Brick Brace with no adjacent barrier | Full hit; charge remains. Brick Step would relocate through the barrier |
| W15-17 | Watch Root vs Fee vs Sip vs Bank | Snap zeros leftover **MP** vs leftover **AP −1** vs steals AP vs banks AP |
| W15-18 | Odd Gait leftover MP 0, 2, or 4 | 10 only. Lone Gait would bonus leftover MP exactly 1. Pair Gait would bonus leftover MP exactly 2 |
| W15-19 | Spike Cut far from spike occupancy / on a Twin Gate pad | 10 only. Hazard Cut would want painted hazard. Portal Cut would want `map.portals`. Spike Reel would pull |
| W15-20 | Lean Gift after leftover AP ≥ 1 | Fizzle observes. Equal Gift would want AP==MP ≥ 1 |
| W15-21 | Pack Diag / Far Fold | Never in `ownedSpellIds` |
| W15-22 | Loaner / `WF-SPL-*` / #771 primer / #826 / #885 / #957 ENC-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W15-23 | G=14 Tide | No File Stride / Still Toll (`generationMin: 15`) |
| W15-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W15-25 | No cloned ids | Unique §11 ids absent from #837 / #890 / #906 catalogs |
| W15-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Still Toll / Summon Rank / Pack Diag / Watch Root are flags |
| W15-27 | Hex Toll | Still not in any SDE pool |
| W15-28 | Memory Wave-5 / Wave-14 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W15-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W15-30 | #890 extra doors | `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` not restamped |
| W15-30b | #906 rooms / doors | `rank_gallery` / `rank_precentor` / `rank_fold_regent` not restamped |
| W15-30c | #899 family ids | Unique §11 not CORE on `gaunt_mender` … `axis_cutter`. `diag_precentor` / `far_fold_regent` not #899 ids |
| W15-30d | #903 extra doors | `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` not restamped |
| W15-30e | #837 rooms / doors | `knight_gallery` / `file_precentor` / `diag_fold_regent` not restamped |
| W15-30f | #941 family ids | Unique §11 not CORE on `poise_mender` … `drift_gifter`. `file_gallery` is not `knight_gallery`. `diag_precentor` is not `axis_biter` |
| W15-30g | #951 extra doors | `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` not restamped. `far_fold_regent` is not those ids |
| W15-30h | #953 tactical ids | Unique §11 does not clone Tally Mend / Cadence Prime / Dec Span / Purse Turn. Cadence Rise is `1→2`, not `0→1`. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` not restamped |
| W15-30i | #957 ENC-* | `ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` not consumed as spell grants |
| W15-31 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–14, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, or **#906** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / #679 / #695 / #726 / #747 / #753 / #787 / #802 / #808 / #836 / #837 / #849 / #890 / #899 / #903 / #906 / **#941** / **#951** extra doors or family ids
- Consuming #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` as spell grants
- Consuming #826 / #885 / **#957** ENC-* as spell grants
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `rank_gallery` / `orth_gallery` / `diag_gallery` / `knight_gallery` / `even_gallery` / `odd_gallery` / `penta_nave` / `span_six` / `spike_aisle` / `pit_aisle` as File Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #752 CORE, #796 CORE, #840 CORE, #899 CORE, #941 CORE, Wave-14 #802/#849 CORE, or a later Wave-16 family CORE before Wave 17
- Cloning #837 (`spell-knight-stride` … `spell-diag-fold`), #890 (`spell-poise-mend` … `spell-court-floor`), #906 (`spell-rank-stride` … `spell-rank-fold`), or **#953** (`spell-tally-mend` … `spell-court-prime`) into unique §11
- Minting `spell-nona-span` / `spell-octa-span` / `spell-even-plate` / `spell-gaunt-floor` / `spell-hollow-mend` / `spell-cadence-trade` / `spell-parched-mend` / `spell-tempo-mirror` / `spell-tied-mend` / `spell-equal-mend` / `spell-tempo-cross` / `spell-walk-debt` / `spell-pack-far` / `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm`
- Shipping `spell-parched-mend` alongside Dry Gait
- Shipping a second `spell-cadence-floor` from #890
- Cloning Rank Stride as File Stride, Axis Bite as File Bite, Dry Sting as Dry Plate, Pack File as Pack Diag, Cadence Stall as Cadence Rise, Hazard Cut as Spike Cut, or Lean Sting as Lean Gift

---

## 17. Wave-15 index

**Unique SDE ids (19):** file-stride, hexa-oath, lava-reel, file-bite, strike-mark, dry-plate, shock-skip, even-sting, summon-rank, lean-gift, cadence-rise, still-toll, brick-brace, watch-root, odd-gait, spike-cut, summon-plate, pack-diag, far-fold.

**#837 stamps (do not clone; Wave-15 family CORE):** Knight Stride, Quad Oath, Pit Reel, Axis Bite, Shove Mark, Spent Plate, Rime Skip, Full Sting, Summon Cast, Hollow Gift, Cadence Swap, Strike Debt, Brick Nudge, Watch Sip, Lone Gait, Hazard Cut, Drift Gift, Pack File, Diag Fold.

**#890 stamps (do not clone; Wave-15 family CORE; Cadence Floor is #906’s):** Poise Mend, Nine Span, Bar Cross, Poise Hood, Poise Sting, Poise Step, Poise Sill, Poise Hold, Poise Lend, Poise Sip, Poise Post, Poise Bounce, Must Poise, Verse Poise, Court Floor.

**#906 stamps (do not clone; Wave-16 extras):** Rank Stride, Penta Oath, Spike Reel, Screen Bite, Swap Mark, Odd Plate, Mire Skip, Odd Sting, Summon Verse, Equal Gift, Cadence Floor, Cast Toll, Brick Step, Watch Bank, Tied Gait, Portal Cut, Shove Gift, Pack Rank, Rank Fold.

**#899 Wave-14 families (do not clone / do not CORE unique §11):** `gaunt_mender` … `axis_cutter` (31 sheets).

**#941 Wave-15 families (do not clone / do not CORE unique §11):** `poise_mender`, `nine_prelate`, `bar_crosser`, `poise_hooder`, `poise_stinger`, `poise_stepper`, `poise_siller`, `poise_holder`, `poise_lender`, `poise_sipper`, `poise_prelate`, `poise_bouncer`, `must_poiser`, `verse_poiser`, `knight_warder`, `quad_oather`, `pit_reeler`, `axis_biter`, `shove_marker`, `spent_plater`, `rime_skipper`, `full_stinger`, `summon_caster`, `hollow_gifter`, `cadence_swapper`, `strike_debter`, `brick_nudger`, `watch_sipper`, `lone_gaiter`, `hazard_cutter`, `drift_gifter`.

**#951 Wave-16 extra doors (do not restamp):** `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`.

**#953 stamps (do not clone; Wave-16 family CORE):** Tally Mend, Cadence Prime, Dec Span, Purse Turn, Tally Hood, Tally Sting, Tally Step, Tally Sill, Tally Hold, Tally Lend, Tally Sip, Tally Post, Tally Bounce, Must Tally, Verse Tally, Court Prime. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-file-stride` | ENEMY_DISCOVERY | yes | blink / rank_lancer G≥15 | **One** next walk must share file (same x) |
| `spell-hexa-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 6 |
| `spell-lava-reel` | ENEMY_DISCOVERY | yes | glyph / ignite | Pull 1 toward nearest lava occupancy |
| `spell-file-bite` | ENEMY_DISCOVERY | yes | blink / lurker | Bonus if share **file only** |
| `spell-strike-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates when a unit **Strikes from** it |
| `spell-dry-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit is 0 while leftover **MP = 0** |
| `spell-shock-skip` | ENEMY_DISCOVERY | yes | tide / plague | 1-tile walk ignores shock-tile tax |
| `spell-even-sting` | ENEMY_DISCOVERY | yes | plate / golem | Leftover AP even **and ≥ 2** → bonus damage |
| `spell-summon-rank` | ELITE | yes | brood_chanter | Allied summons pay +1 AP to walk off rank |
| `spell-lean-gift` | ELITE | yes | pale / font cantor | Heal iff leftover AP = 0 **and** leftover MP ≥ 1 |
| `spell-cadence-rise` | ENEMY_DISCOVERY | yes | cadence / hex | Remaining `n==1` → 2; others unchanged |
| `spell-still-toll` | ENEMY_DISCOVERY | yes | tax / ley | Next spell +1 AP if leftover **MP = 0** |
| `spell-brick-brace` | ENEMY_DISCOVERY | yes | stone / rime | Next hit is 0 if a barrier is adjacent |
| `spell-watch-root` | ELITE | yes | glass / hood | Overwatch snap zeros leftover MP on the walker |
| `spell-odd-gait` | ENEMY_DISCOVERY | yes | purse / scribe | Bonus if leftover **MP is odd** |
| `spell-spike-cut` | ELITE | yes | glyph / plague | Bonus if target is Chebyshev ≤ 2 from spike occupancy |
| `spell-summon-plate` | ELITE | yes | brood_chanter | Allied summons treat the next hit as 0 |
| `spell-pack-diag` | ENEMY_ONLY | no | `diag_precentor` CHAMPION | Pack walks locked to the champion diagonal |
| `spell-far-fold` | BOSS_ONLY | no | `far_fold_regent` | Swap two player-side bodies at Chebyshev exactly 4 |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-14 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with **#941** so Knight Stride / Poise Mend / Bar Cross / Nine Span land once as Wave-15 family CORE. Coordinate with #837 / #890 so those verbs are not cloned. Coordinate with #906 so Rank Stride / Cadence Floor stay Wave-16 extras, not this CORE. Coordinate with **#953** so Tally Mend / Cadence Prime / Dec Span / Purse Turn land once as Wave-16 family CORE. Unique §11 stay extras until Wave 17. Not a license to land combat code in the same change as this spec.
