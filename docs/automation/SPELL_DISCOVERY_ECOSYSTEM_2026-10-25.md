# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 17

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-25  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–16 are Generations 3–16. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Waves 6–16 are still-open #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 / #906 / #962 / **#1017**. This document is **Generation 17**. `generationMin: 17`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

**Gap note.** The last SDE wave PR is **#1017** (2026-10-24). This pass does **not** skip generations and does **not** mint Waves 18–36. It is the next sequential generation.

**CDA freeze vs this catalog.** Still-open **#942** `CDA-2026-10-23-029` and **#982** `CDA-2026-10-24-030` freeze **shipping** Wave-15/16 live catalog rows until Wave-1 ownership / observe / G resolve exist. This document is sequential Generation 17 **design only** (`STATUS: PROPOSED`). It does not append ids to `starterSpells`, does not implement combat, and is **not** Wave 18.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-25.md`](./ACTION_IDS_SDE_2026-10-25.md).

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
| Wave-14 discovery contract | still-open **#906** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-22.md` | G≥14 extra slot, W14 unique ids |
| Wave-15 discovery contract | still-open **#962** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md` | G≥15 extra slot, W15 unique ids. **Stamp onto Wave-17 family CORE, do not clone** |
| Wave-16 discovery contract | still-open **#1017** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md` | G≥16 extra slot, W16 unique ids, #906 / #953 / #1011 stamps. Unique §11 stay extras until Wave 18 |
| Wave-1…16 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-10-24.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 / #729 / #791 / #815 / #892 / **#940** / **#1007** / **#1078** | `ownedSpellIds` / `observedSpellIds`, soft-retire. **#1078** owns SDA-2026-10-25-175…189 (unique dated files — do not overwrite). **#870** / **#946** / **#998** are Master Technical Director roadmaps — **not** tactical catalogs |
| Tactical gap-fillers W1…W15 | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 | Reserved in §0.1 |
| Tactical gap-fillers W16 | still-open **#1011** — `SPELL_PROPOSALS_2026-10-24.md` | Score Mend … Court Snuff. **Stamp as Wave 17 family CORE, do not clone**. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp. Score Mend is both-body leftover **sum === 4 AND unequal**. Cadence Snuff is remaining `1→0`. Hendeca Span is eleven-cell occupy. Duel Turn is two-hostile independent invert. **SDE wins** unique §11 (Gait Gift stays AP≥2/MP=0; Cadence Tern stays `n>3→3`; Prime Plate stays leftover 1/1 negate) |
| Tactical gap-fillers W17 | still-open **#1063** — `SPELL_PROPOSALS_2026-10-25.md` | Stave Mend … Court Dock. **Stamp as Wave 18 family CORE, do not clone**. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp. Stave Mend is both-body leftover **sum === 5**. Cadence Dock is remaining `2→0`. Dodeca Span is twelve-cell occupy (3×4). Hymn Turn is two-ally independent invert (caster stays). Court Dock never owned. **SDE wins** unique §11 (Gait Gift stays AP≥2/MP=0, not Stave Mend; Cadence Tern stays `n>3→3`, not Cadence Dock; Prime Plate stays leftover 1/1 negate, not Stave Hood). Do **not** mint `spell-stave-gift` / `spell-twelve-span` / `spell-choir-turn` / `spell-court-drop` |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + #686 + #752 + #796 + #840 + #899 + #941 + **#997** + **#1073** | **#997** Wave-16 families consume unique **#906** Wave-14 verbs **and** **#953**. **#1073** Wave-17 families consume unique **#962** Wave-15 verbs **and** **#1011** (`score_mender` … `summon_plater`). Unique Wave-16 §11 stay extras until Wave 18. Unique §11 stay extras until Wave 19. Do **not** put unique §11 ids in #899 / #941 / #997 / **#1073** CORE. Do **not** restamp #997 / **#1073** `ENEMY_ID`s |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 + #951 + **#1004** + **#1080** | #951 Wave-16 extra doors `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. **#1004** Wave-17 extra doors `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` — do not restamp. **#1080** Wave-18 extra doors `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` (leftover Pair Slide / Both Mend / Heave Mend / Parched Mend; spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`; do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`) — do not restamp. No new `#137` ids. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal |
| Same-day world dynamics | still-open **#949** / **#993** / **#1064** | `WF-*` Wave-15 / Wave-16 / Wave-17 overlays. Not spell catalogs. Do not consume |
| Same-day spell admin | still-open **#940** / **#1007** / **#1078** | SDA 2026-10-23, 2026-10-24, and 2026-10-25 (175–189). Soft-retire / tooling. Do not re-file those ACTION_IDs. Do not overwrite `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` |
| Same-day encounter admin | still-open **#932** / **#1015** / **#1050** | Occupancy unseals, persist-keep rails, world/dungeon admin. Not a spell catalog |
| Same-day enemy/boss admin | still-open **#1044** | EBA re-audit. Zero extra doors. Not a spell catalog |
| Same-day content freeze | still-open **#942** / **#982** | `CDA-029` / `CDA-030` freeze **shipping** Wave-15/16 live rows until live gates. This document is sequential **Generation 17 design**, not a ship, and not Wave 18 |
| Same-day encounter primer | #771 — Bash/Dry/Hood catalog | Room ids `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`. Not a spell catalog. Do not consume |
| Prior-day encounter catalogs | still-open **#826** / **#885** / **#957** / **#1006** | ENC-* tables. Not spell catalogs. Do not consume. `ENC-INCH-01` is Inch Stride, not Tern Stride. `ENC-SPIKE-01` is Spike Skip, not Slide Skip. `ENC-FOLD-01` is a wall fold, not Lane Fold. `ENC-TRI-01` is not Octa Oath. `ENC-GAUNT-01` is not Gait Gift. `ENC-DUMP-01` is not Gait Gift. `ENC-EVEN-02` is not Thin Gait |
| Same-day encounter catalog | still-open **#1056** | Poise/Knight/Pit/Spent rooms (`ENC-TEACH-17` / `ENC-SPELL-33` / `ENC-POISE-01` / `ENC-TIED-01` / `ENC-KNIGHT-01` / `ENC-PIT-02` / `ENC-WAVE-18`). Not a spell catalog. Do not consume. `ENC-KNIGHT-01` is Knight Stride, not Tern Stride. `ENC-POISE-01` is Poise Mend, not Gait Gift. `ENC-PIT-02` is Pit Reel, not Mire Reel |
| Same-day roadmap | still-open **#998** / **#1074** | Master Technical Director 2026-10-24 and 2026-10-25 — **not** tactical catalogs |
| Same-day expansion / VAL / AFDA / AEE | still-open **#1052** / **#1051** / **#1055** / **#1072** | Expansion Director / renderer fact sheet / admin drift / enemy AI increment. Not spell catalogs |
| PX coherence | #343 / #393 / #481 / #579 / #632 / #744 / #784 / #844 / #907 / #955 / **#1008** / **#1067** | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-17 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

**#997** remains the Wave-16 family sheet (consumes **#906 + #953**, not unique §11). **#1073** is the Wave-17 family sheet (consumes **#962 + #1011**, not unique §11; `score_mender` … `summon_plater` — do not restamp). **#1004** remains Wave-17 boss extra doors. **#1080** is Wave-18 extra doors (`slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`) — do not restamp. **#1078** owns SDA-2026-10-25-175…189 — do not overwrite those files. **#1006** remains prior-day ENC-* rooms. **#1056** is the same-day ENC catalog — do not consume. **#1011** remains the Wave-16 tactical catalog — **stamp it as Wave 17 family CORE**. **#1063** opened 00:15 UTC as Wave-17 tactical (`SPELL_PROPOSALS_2026-10-25.md`) — **stamp it as Wave 18 family CORE** and do not clone its ids. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp. **#1017** remains Wave-16 unique SDE — unique Wave-16 §11 stay extras until Wave **18**. Unique Wave-15 §11 consume as this wave’s CORE together with **#1011**. Unique §11 stay extras until Wave **19**. **SDE wins** unique leftover collisions (Gait Gift stays leftover AP **≥ 2 AND** leftover MP **= 0**, not Score Mend / Stave Mend; Cadence Tern stays remaining `n>3` → `3`, not Cadence Cap / Cadence Snuff / Cadence Dock; Prime Plate stays leftover **1/1** negate, not Dual Plate / Score Hood / Stave Hood).

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

**#953 tactical Wave 15:** `spell-tally-mend`, `spell-cadence-prime`, `spell-dec-span`, `spell-purse-turn`, `spell-tally-hood`, `spell-tally-sting`, `spell-tally-step`, `spell-tally-sill`, `spell-tally-hold`, `spell-tally-lend`, `spell-tally-sip`, `spell-tally-post`, `spell-tally-bounce`, `spell-must-tally`, `spell-verse-tally`, `spell-court-prime`. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` — do not restamp.

**Wave 15 SDE (#962):** `spell-file-stride`, `spell-hexa-oath`, `spell-lava-reel`, `spell-file-bite`, `spell-strike-mark`, `spell-dry-plate`, `spell-shock-skip`, `spell-even-sting`, `spell-summon-rank`, `spell-lean-gift`, `spell-cadence-rise`, `spell-still-toll`, `spell-brick-brace`, `spell-watch-root`, `spell-odd-gait`, `spell-spike-cut`, `spell-summon-plate`, `spell-pack-diag`, `spell-far-fold`.

**#1011 tactical Wave 16 (stamp as Wave 17 family CORE, do not clone):** `spell-score-mend`, `spell-cadence-snuff`, `spell-hendeca-span`, `spell-duel-turn`, `spell-score-hood`, `spell-score-sting`, `spell-score-step`, `spell-score-sill`, `spell-score-hold`, `spell-score-lend`, `spell-score-sip`, `spell-score-post`, `spell-score-bounce`, `spell-must-score`, `spell-verse-score`, `spell-court-snuff`. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp. Score Mend is both-body leftover **sum === 4 AND unequal**. Cadence Snuff is remaining `n===1` → `0`. Hendeca Span is eleven-cell occupy. Duel Turn is two-hostile independent invert. Court Snuff never owned. Do **not** mint `spell-score-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop`.

**Wave 16 SDE (#1017):** `spell-ring-stride`, `spell-hepta-oath`, `spell-rime-reel`, `spell-rank-bite`, `spell-last-mark`, `spell-dual-plate`, `spell-rift-skip`, `spell-fresh-sting`, `spell-summon-file`, `spell-prime-gift`, `spell-cadence-cap`, `spell-gait-toll`, `spell-brick-hold`, `spell-watch-drain`, `spell-even-gait`, `spell-rime-cut`, `spell-cast-plate`, `spell-pack-orth`, `spell-leap-fold`.

**#1063 tactical Wave 17 (stamp as Wave 18 family CORE, do not clone):** `spell-stave-mend`, `spell-cadence-dock`, `spell-dodeca-span`, `spell-hymn-turn`, `spell-stave-hood`, `spell-stave-sting`, `spell-stave-step`, `spell-stave-sill`, `spell-stave-hold`, `spell-stave-lend`, `spell-stave-sip`, `spell-stave-post`, `spell-stave-bounce`, `spell-must-stave`, `spell-verse-stave`, `spell-court-dock`. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp. Stave Mend is both-body leftover **sum === 5**. Cadence Dock is remaining `n===2` → `0`. Dodeca Span is axis-aligned **3×4**, counts as **twelve**. Hymn Turn is two-ally leftover invert (caster stays). Court Dock never owned. Do **not** mint `spell-stave-gift` / `spell-twelve-span` / `spell-choir-turn` / `spell-court-drop`.

**Do not alias** `spell-tern-stride` ↔ `spell-ring-stride` / `spell-rank-stride` / `spell-file-stride` / `spell-pair-stride` / `spell-inch-stride` / `spell-knight-stride` / `spell-orth-stride` / `spell-diag-stride` / `spell-must-span` / `spell-long-oath`, `spell-octa-oath` ↔ `spell-hepta-oath` / `spell-hexa-oath` / `spell-penta-oath` / `spell-oct-span` / `spell-long-oath` / `spell-far-hood`, `spell-mire-reel` ↔ `spell-lava-reel` / `spell-rime-reel` / `spell-spike-reel` / `spell-pit-reel` / `spell-void-reel` / `spell-brick-reel` / `spell-mire-sheet` / `spell-mire-skip` / `spell-hook-line`, `spell-diag-bite` ↔ `spell-file-bite` / `spell-rank-bite` / `spell-axis-bite` / `spell-screen-bite` / `spell-file-lance` / `spell-diag-stride` / `spell-rear-cut`, `spell-summon-mark` ↔ `spell-strike-mark` / `spell-cast-mark` / `spell-last-mark` / `spell-swap-mark` / `spell-shove-mark` / `spell-ingress-mark` / `spell-dwell-mark` / `spell-stride-mark` / `spell-body-mark`, `spell-prime-plate` ↔ `spell-dual-plate` / `spell-dry-plate` / `spell-odd-plate` / `spell-spent-plate` / `spell-even-plate` / `spell-prime-gift` / `spell-score-hood` / `spell-poise-hood`, `spell-slide-skip` ↔ `spell-shock-skip` / `spell-spike-skip` / `spell-rime-skip` / `spell-glyph-skip` / `spell-rift-skip` / `spell-mire-skip` / `spell-gap-ward` / `spell-slide-tile`, `spell-capped-sting` ↔ `spell-fresh-sting` / `spell-full-sting` / `spell-even-sting` / `spell-odd-sting` / `spell-gaunt-sting` / `spell-dry-sting` / `spell-ready-sting`, `spell-summon-orth` ↔ `spell-summon-file` / `spell-summon-rank` / `spell-summon-toll` / `spell-summon-verse` / `spell-pack-orth` / `spell-pack-diag` / `spell-orth-stride`, `spell-gait-gift` ↔ `spell-lean-gift` / `spell-equal-gift` / `spell-prime-gift` / `spell-tally-mend` / `spell-score-mend` / `spell-hollow-gift` / `spell-poise-mend` / `spell-gait-mend` / `spell-gait-toll`, `spell-cadence-tern` ↔ `spell-cadence-cap` / `spell-cadence-floor` / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` / `spell-cadence-stall` / `spell-cadence-lag` / `spell-triple-span` / `spell-pack-cap`, `spell-odd-toll` ↔ `spell-gait-toll` / `spell-still-toll` / `spell-walk-toll` / `spell-gait-tax` / `spell-strike-debt` / `spell-cast-toll` / `spell-debt-mark` / `spell-odd-stride` / `spell-odd-gait`, `spell-brick-tax` ↔ `spell-brick-hold` / `spell-brick-brace` / `spell-brick-step` / `spell-camp-tax` / `spell-crowd-tax` / `spell-act-tax`, `spell-watch-tax` ↔ `spell-watch-drain` / `spell-watch-root` / `spell-watch-sip` / `spell-watch-bank` / `spell-watch-fee` / `spell-quiet-hex`, `spell-thin-gait` ↔ `spell-even-gait` / `spell-odd-gait` / `spell-lone-gait` / `spell-pair-gait` / `spell-full-gait` / `spell-tied-gait` / `spell-thin-ward` / `spell-prime-gift`, `spell-lava-cut` ↔ `spell-spike-cut` / `spell-hazard-cut` / `spell-portal-cut` / `spell-rime-cut` / `spell-lava-reel` / `spell-lava-skip`, `spell-strike-plate` ↔ `spell-cast-plate` / `spell-summon-plate` / `spell-mute-thread` / `spell-quiet-hex` / `spell-split-plate` / `spell-strike-mark` / `spell-strike-hold`, `spell-pack-ring` ↔ `spell-pack-orth` / `spell-pack-diag` / `spell-pack-file` / `spell-pack-rank` / `spell-ring-stride` / `spell-rank-lock`, `spell-lane-fold` ↔ `spell-leap-fold` / `spell-far-fold` / `spell-reach-fold` / `spell-adj-fold` / `spell-rank-fold` / `spell-file-fold` / `spell-diag-fold` / `spell-mid-fold`. Those are sibling-owned fantasies.

**Also do not alias** `spell-gait-gift` ↔ `spell-stave-mend` / `spell-stave-gift`, `spell-cadence-tern` ↔ `spell-cadence-dock`, `spell-prime-plate` ↔ `spell-stave-hood`, `spell-octa-oath` ↔ `spell-dodeca-span`, `spell-lane-fold` ↔ `spell-court-dock`, `spell-pack-ring` ↔ `spell-hymn-turn`. Those #1063 ids stamp as Wave **18** family CORE.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools. `spell-even-plate` stays tombstoned as a Dry Plate alias. `spell-octa-span` stays tombstoned as an Oct Span alias — Octa Oath is the exact-8 **spell gate**, not occupy-weight 8. `spell-twelve-span` stays tombstoned as a Dodeca Span alias — **#1063** owns `spell-dodeca-span`.

### 0.2 Unique Wave-15 CORE (#962 — stamp onto Wave-17 family CORE, do not clone)

#962 **owns** the G≥15 unique SDE holes. Wave 16 recorded them as extras until Wave 17. This document **consumes #962 as Wave-17 family CORE** (together with #1011) and does **not** re-author those cards.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-file-stride` | ENEMY_DISCOVERY | **One** next walk same **x**. Distinct from Tern Stride (Chebyshev **exactly 3**, orthogonal only) |
| `spell-hexa-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 6. Distinct from Octa Oath (**exactly** 8) |
| `spell-lava-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **lava**. Distinct from Mire Reel (nearest **painted mire**) |
| `spell-file-bite` | ENEMY_DISCOVERY | Bonus if share **file only**. Distinct from Diag Bite (`\|dx\|==\|dy\|`) |
| `spell-strike-mark` | ENEMY_DISCOVERY | Cell detonates on **Strike from**. Distinct from Summon Mark (**summon spawn onto**) |
| `spell-dry-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover **MP = 0**. Distinct from Prime Plate (leftover **1/1**) |
| `spell-shock-skip` | ENEMY_DISCOVERY | 1-tile walk ignores shock-tile tax. Distinct from Slide Skip (conveyor auto-push) |
| `spell-even-sting` | ENEMY_DISCOVERY | Bonus if leftover AP is **even ≥ 2**. Distinct from Capped Sting (leftover MP **equals max MP**) |
| `spell-summon-rank` | ELITE | Pets pay +1 AP to **walk off rank**. Distinct from Summon Orth (walk **diagonal**) |
| `spell-lean-gift` | ELITE | Heal iff leftover AP = 0 **and** leftover MP ≥ 1. Distinct from Gait Gift (AP **≥ 2 AND** MP **= 0**). **Healer CORE only** |
| `spell-cadence-rise` | ENEMY_DISCOVERY | Remaining `n==1` → 2. Distinct from Cadence Tern (`n>3` → **3**) |
| `spell-still-toll` | ENEMY_DISCOVERY | Next **spell** +1 AP if leftover **MP = 0**. Distinct from Odd Toll (next **walk** if leftover **AP is odd**) |
| `spell-brick-brace` | ENEMY_DISCOVERY | Next hit is 0 if a barrier is **adjacent**. Distinct from Brick Tax (next **walk** +1 AP while adjacent) |
| `spell-watch-root` | ELITE | Overwatch snap **zeros leftover MP**. Distinct from Watch Tax (next-spell **+1 AP**) |
| `spell-odd-gait` | ENEMY_DISCOVERY | Bonus if leftover **MP is odd**. Distinct from Thin Gait (leftover AP **=== 1 AND** leftover MP **=== 0**) |
| `spell-spike-cut` | ELITE | Bonus if Chebyshev ≤ 2 from **spike occupancy**. Distinct from Lava Cut (**lava occupancy**) |
| `spell-summon-plate` | ELITE | Allied summons treat the next **incoming hit** as 0. Distinct from Strike Plate (next **outgoing Strike** deals 0) |
| `spell-pack-diag` | ENEMY_ONLY | Pack walks locked to champion **diagonal**. Distinct from Pack Ring (Chebyshev **exactly 2**, knight excluded). Never owned. Stays `diag_precentor` |
| `spell-far-fold` | BOSS_ONLY | Swap two player-side bodies at Chebyshev **exactly 4**. Distinct from Lane Fold (share rank **or** file **and** Chebyshev **exactly 3**). Never owned. Stays `far_fold_regent` |

`file_gallery` is **not** Tern Stride’s door. `hexa_nave` is **not** Octa Oath’s door. `lava_aisle` is **not** Mire Reel’s door. `strike_pulpit` is **not** Summon Mark’s door. `shock_nave` is **not** Slide Skip’s door. `diag_precentor` is **not** `hoop_precentor`. `far_fold_regent` is **not** `lane_fold_regent`.

### 0.2b Tactical Wave 16 (#1011 — stamp as Wave 17 family CORE, do not clone)

#1011 **owns** the G≥16 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-17 family CORE is **#962 unique Wave-15 verbs + #1011** (except Court Snuff; Score Mend is healer CORE only). Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp. Do **not** mint `spell-score-gift` / `spell-stave-gift` / `spell-eleven-span` / `spell-undec-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-both-score` / `spell-quint-mend` / `spell-twelve-span`. **#1063** owns `spell-dodeca-span` — stamp, do not clone. **SDE wins** unique leftover collisions: Gait Gift stays leftover AP **≥ 2 AND** leftover MP **= 0**, not both-body sum===4; Cadence Tern stays remaining `n>3` → `3`, not `1→0`; Prime Plate stays leftover **1/1** negate, not Score Hood.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-score-mend` | MULTI_SOURCE | Heal iff **caster and target** leftover AP+MP **=== 4 AND unequal**. Legal pairs **(4,0) (0,4) (3,1) (1,3)**. Distinct from Gait Gift (**one body** leftover AP **≥ 2 AND** MP **= 0**). **Healer CORE only**. `score_cantor` stays #1011’s door |
| `spell-cadence-snuff` | MULTI_SOURCE | Remaining `n===1` → `0`; `n>1` unchanged. Distinct from Cadence Tern (`n>3` → 3). `snuff_precentor` stays #1011’s door |
| `spell-hendeca-span` | MULTI_SOURCE | Stretched plus occupy, counts as **eleven**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked. `span_hendeca` stays #1011’s door |
| `spell-duel-turn` | ENEMY_DISCOVERY | Invert leftover AP↔MP independently on **two hostiles**; caster unchanged. Distinct from Purse Turn (one hostile) and Tempo Invert (ally/self) |
| `spell-score-hood` | ELITE | Next hit is 0 while leftover AP+MP **=== 4 AND unequal**. Distinct from Prime Plate (leftover **1/1**) |
| `spell-score-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP+MP **=== 4 AND unequal**. Distinct from Capped Sting (leftover MP **equals max**) |
| `spell-score-step` | ENEMY_DISCOVERY | Caster lands adjacent to a body with leftover AP+MP === 4 unequal |
| `spell-score-sill` | ENEMY_DISCOVERY | Occupant with leftover AP+MP === 4 unequal at **start of their turn** takes tax |
| `spell-score-hold` | ELITE | Cannot **walk** while leftover AP+MP === 4 unequal. Distinct from Brick Tax (adjacent **barrier**, walk still legal at +1 AP) |
| `spell-score-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP iff the ally leftover AP+MP === 4 unequal |
| `spell-score-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP+MP === 4 unequal |
| `spell-score-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP+MP === 4 unequal. Arm is observation; detonate is not a second observe |
| `spell-score-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP+MP === 4 unequal |
| `spell-must-score` | ELITE | Non-Strike illegal unless leftover AP+MP === 4 unequal **and** the spell spends last AP |
| `spell-verse-score` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP+MP === 4 unequal |
| `spell-court-snuff` | NOT_PLAYER_LEARNABLE | Mass Cadence Snuff. Never owned. Distinct from Lane Fold (position swap). Stays `court_snuff_regent` |

`score_cantor` is **not** Gait Gift’s door. `snuff_precentor` is **not** Cadence Tern’s door (`cadence_thief` / `hex_chorister` observe). `span_hendeca` is **not** Lane Fold’s door. `court_snuff_regent` is **not** `lane_fold_regent`. Do not name unique §11 families `score_mender` / `cadence_snuffer` / `hendeca_prelate` / `tally_mender` / `cadence_primer` / `ring_warder` (#997 / #941 / #899 own those slots; a later Wave-17 family sheet may own the score-* CORE rows).

### 0.2c Unique Wave-16 extras (#1017 — stamp as Wave 18 extras, do not clone)

#1017 **owns** the G≥16 unique SDE holes. This document does **not** consume them as Wave-17 family CORE. Unique Wave-16 §11 stay G≥16 extras until Wave 18 families consume them.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-ring-stride` | ENEMY_DISCOVERY | **One** next walk Chebyshev **exactly 2**, knight excluded. Distinct from Tern Stride (Chebyshev **exactly 3**, orthogonal only) |
| `spell-hepta-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 7. Distinct from Octa Oath (**exactly** 8) |
| `spell-rime-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **ice**. Distinct from Mire Reel (nearest **painted mire**) |
| `spell-rank-bite` | ENEMY_DISCOVERY | Bonus if share **rank only**. Distinct from Diag Bite (`\|dx\|==\|dy\|`) |
| `spell-last-mark` | ENEMY_DISCOVERY | Cell detonates when occupant spends **last leftover AP**. Distinct from Summon Mark (**summon spawn onto**) |
| `spell-dual-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. Distinct from Prime Plate (leftover **1/1**) |
| `spell-rift-skip` | ENEMY_DISCOVERY | 1-tile walk ignores Void Rift tax. Distinct from Slide Skip (conveyor auto-push) |
| `spell-fresh-sting` | ENEMY_DISCOVERY | Bonus if leftover AP **equals max AP**. Distinct from Capped Sting (leftover MP **equals max MP**) |
| `spell-summon-file` | ELITE | Pets pay +1 AP to **walk off file**. Distinct from Summon Orth (walk **diagonal**) |
| `spell-prime-gift` | ELITE | Heal iff leftover AP = 1 **and** leftover MP = 1. Distinct from Gait Gift (AP **≥ 2 AND** MP **= 0**). **Healer CORE only** |
| `spell-cadence-cap` | ENEMY_DISCOVERY | Remaining `n>2` → 2. Distinct from Cadence Tern (`n>3` → **3**; 0/1/2/3 stay) |
| `spell-gait-toll` | ENEMY_DISCOVERY | Next **walk** +1 AP if leftover **MP = 0**. Distinct from Odd Toll (leftover **AP is odd**) |
| `spell-brick-hold` | ENEMY_DISCOVERY | Cannot **walk** while adjacent to a barrier. Distinct from Brick Tax (walk still legal, **+1 AP**) |
| `spell-watch-drain` | ELITE | Overwatch snap **steals 1 leftover MP**. Distinct from Watch Tax (next-spell **+1 AP**) |
| `spell-even-gait` | ENEMY_DISCOVERY | Bonus if leftover **MP is even ≥ 2**. Distinct from Thin Gait (leftover AP **=== 1 AND** leftover MP **=== 0**) |
| `spell-rime-cut` | ELITE | Bonus if Chebyshev ≤ 2 from **ice occupancy**. Distinct from Lava Cut (**lava occupancy**) |
| `spell-cast-plate` | ELITE | Target’s next **non-Strike spell** deals 0. Distinct from Strike Plate (next **Strike** deals 0) |
| `spell-pack-orth` | ENEMY_ONLY | Pack walks locked to **orthogonal**. Distinct from Pack Ring (Chebyshev **exactly 2**, knight excluded). Never owned. Stays `lane_precentor` |
| `spell-leap-fold` | BOSS_ONLY | Swap two player-side bodies at Chebyshev **exactly 3** (any geometry). Distinct from Lane Fold (share rank **or** file **and** Chebyshev **exactly 3**). Never owned. Stays `leap_fold_regent` |

`ring_gallery` is **not** Tern Stride’s door. `hepta_nave` is **not** Octa Oath’s door. `frost_aisle` is **not** Mire Reel’s door. `last_pulpit` is **not** Summon Mark’s door. `rift_court` is **not** Slide Skip’s door. `lane_precentor` is **not** `hoop_precentor`. `leap_fold_regent` is **not** `lane_fold_regent`.

### 0.2d Tactical Wave 17 (#1063 — stamp as Wave 18 family CORE, do not clone)

#1063 **owns** the G≥17 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-18 family CORE is unique **#1017** Wave-16 verbs **plus** **#1063** (except Court Dock; Stave Mend is healer CORE only). Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp. Do **not** mint `spell-stave-gift` / `spell-twelve-span` / `spell-choir-turn` / `spell-court-drop` / `spell-quint-mend` / `spell-cadence-deuce`. **SDE wins** unique leftover collisions: Gait Gift stays leftover AP **≥ 2 AND** leftover MP **= 0**, not both-body sum===5; Cadence Tern stays remaining `n>3` → `3`, not `2→0`; Prime Plate stays leftover **1/1** negate, not Stave Hood.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-stave-mend` | MULTI_SOURCE | Heal iff **caster and target** leftover AP+MP **=== 5**. Legal pairs **(5,0) (0,5) (4,1) (1,4) (3,2) (2,3)**. Distinct from Gait Gift (**one body** leftover AP **≥ 2 AND** MP **= 0**) and Score Mend (both-body sum **=== 4 unequal**). **Healer CORE only**. `stave_cantor` stays #1063’s door |
| `spell-cadence-dock` | MULTI_SOURCE | Remaining `n===2` → `0`; `n≠2` unchanged. Distinct from Cadence Tern (`n>3` → 3) and Cadence Snuff (`n===1` → 0). `dock_precentor` stays #1063’s door |
| `spell-dodeca-span` | MULTI_SOURCE | Axis-aligned **3×4**, counts as **twelve**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked. `span_dodeca` stays #1063’s door |
| `spell-hymn-turn` | ENEMY_DISCOVERY | Invert leftover AP↔MP independently on **two allies**; caster unchanged; self forbidden. Distinct from Duel Turn (two hostiles) and Tempo Invert (ally/self) |
| `spell-stave-hood` | ELITE | Next hit is 0 while leftover AP+MP **=== 5**. Distinct from Prime Plate (leftover **1/1**) |
| `spell-stave-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP+MP **=== 5**. Distinct from Capped Sting (leftover MP **equals max**) |
| `spell-stave-step` | ENEMY_DISCOVERY | Caster lands adjacent to a body with leftover AP+MP === 5 |
| `spell-stave-sill` | ENEMY_DISCOVERY | Occupant with leftover AP+MP === 5 at **start of their turn** takes tax |
| `spell-stave-hold` | ELITE | Cannot **walk** while leftover AP+MP === 5. Distinct from Brick Tax (adjacent **barrier**, walk still legal at +1 AP) |
| `spell-stave-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP iff the ally leftover AP+MP === 5 |
| `spell-stave-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP+MP === 5 |
| `spell-stave-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP+MP === 5. Arm is observation; detonate is not a second observe |
| `spell-stave-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP+MP === 5 |
| `spell-must-stave` | ELITE | Non-Strike illegal unless leftover AP+MP === 5 **and** the spell spends last AP |
| `spell-verse-stave` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP+MP === 5 |
| `spell-court-dock` | NOT_PLAYER_LEARNABLE | Mass Cadence Dock. Never owned. Distinct from Lane Fold (position swap). Stays `court_dock_regent` |

`stave_cantor` is **not** Gait Gift’s door. `dock_precentor` is **not** Cadence Tern’s door (`cadence_thief` / `hex_chorister` observe). `span_dodeca` is **not** Lane Fold’s door. `court_dock_regent` is **not** `lane_fold_regent`. Do not name unique §11 families `stave_mender` / `cadence_docker` / `dodeca_prelate` / `hymn_turner` / `score_mender` / `file_warder` (#1073 / #997 / #941 own those slots).

### 0.3 Held holes (still not this pass)

Wave 16 §13 listed these as Wave-17/18 candidates. This wave **does not** fill them in unique §11 except the ones marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Eight-cell occupy | **#849 Oct Span owns this hole.** Do not clone. Do not mint `spell-octa-span`. Octa Oath is exact-8 **spell gate** |
| Nine-cell occupy (solid 3×3) | **#890 Nine Span owns this hole.** Do not clone. Live `ENEMY_SUMMON_CAP` is still 2 |
| Ten-cell occupy | **#953 Dec Span owns this hole.** Do not clone. Do not mint `spell-ten-span` |
| Eleven-cell occupy | **#1011 Hendeca Span owns this hole.** Do not clone. Do not mint `spell-eleven-span` |
| Twelve-cell occupy | **#1063 Dodeca Span owns this hole.** Do not clone. Do not mint `spell-twelve-span` |
| Both-body leftover AP+MP === 4 **and unequal** heal | **#1011 Score Mend owns this hole.** Do not clone. Gait Gift is **one-body** AP≥2/MP=0. Do not mint `spell-score-gift` / `spell-quint-mend` |
| Both-body leftover AP+MP === 5 heal | **#1063 Stave Mend owns this hole.** Distinct from Gait Gift (one-body AP≥2/MP=0). Do not mint `spell-stave-gift` |
| Remaining CDs `n===1` → `0` | **#1011 Cadence Snuff owns this hole.** Distinct from Cadence Tern (`n>3` → 3) |
| Remaining CDs `n===2` → `0` | **#1063 Cadence Dock owns this hole.** Distinct from Cadence Tern (`n>3` → 3) and Cadence Snuff (`1→0`) |
| Two-hostile leftover AP↔MP invert | **#1011 Duel Turn owns this hole.** Distinct from Purse Turn (one hostile) |
| Two-ally leftover AP↔MP invert (caster stays) | **#1063 Hymn Turn owns this hole.** Distinct from Tempo Invert (ally/self) |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Invert leftover AP ↔ leftover MP on one body | **Wave 3 Tempo Invert** (ally/self). Hostile invert is **#953 Purse Turn** |
| Two-body leftover AP ↔ leftover MP cross | **#890 Bar Cross owns this hole.** Do not clone |
| Heal if leftover AP **equals** leftover MP and **both ≥ 1** | **#906 Equal Gift**. Prime Gift is the **1/1** subset. Gait Gift is AP≥2/MP=0, not equal |
| Remaining CDs `n>1` → 1 (zeros stay 0) | **#906 Cadence Floor.** Cadence Cap is `n>2` → **2**. Cadence Tern is `n>3` → **3** |
| Remaining `0` → `1` | **#953 Cadence Prime.** Do not clone |
| Remaining `n>2` → `2` | **#1017 Cadence Cap.** Cadence Tern is the next cap |
| One next walk must share **file** (same x) | **#962 File Stride.** Tern Stride is Chebyshev exactly 3 orthogonal, not a file lock |
| One next walk Chebyshev **exactly 2**, knight excluded | **#1017 Ring Stride.** Tern Stride is Chebyshev exactly 3 orthogonal |
| Dedicated CORE families for unique Wave-15 §11 verbs **and** #1011 | **This catalog consumes them** as Wave-17 family CORE (§12.1) |
| Dedicated CORE families for unique Wave-16 §11 verbs **and** #1063 | Unique Wave-16 §11 stay G≥16 extras until Wave 18. Wave 18 families consume them **and** **#1063** |
| Facing cards | Still fail closed until a battle `currentView` writer exists. **No new Wave-17 facing cards** |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-six calendar days after Wave 12, and one day after Wave 16, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Gait Gift / Score Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-17 unique ids stay `mpCost: 0`. Odd Toll / Summon Orth / Pack Ring / Watch Tax / Brick Tax are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Mire Reel is attract-toward-**nearest painted mire occupancy**, a new dest flavor after Lava Reel (lava), Rime Reel (ice), Spike Reel (spike), Pit Reel (pit), Cinder Reel (hazard), Void Reel (void/portal), and Brick Reel (barrier) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-17 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Lava Cut reads **lava occupancy**, never `spell.name`. Summon Mark reads the summon-spawn event, never `spell.name` |
| Live hazard types | `gameTypes.ts` 437 `HazardTileType` = `lava` \| `ice` \| `spikes` | Lava Cut keys off **lava**. Mire Reel keys off **painted mire** from Mire Sheet, not a new `HazardTileType`. Do not invent an ash occupancy |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21 **#814**…**#869**, then 2026-10-22 **#870**…**#927**, then 2026-10-23 **#930**…**#979**, then 2026-10-24 **#980**…**#1017**, then 2026-10-25 **#1043**+. **#371 owns Wave-4 SDE. #906 owns Wave-14 SDE. #962 owns Wave-15 SDE. #1017 owns Wave-16 SDE. #953 owns Wave-15 tactical. #1011 owns Wave-16 tactical (Wave 17 family CORE). #1063 owns Wave-17 tactical (Wave 18 family CORE). #941 owns Wave-15 families. #997 owns Wave-16 families. #1073 owns Wave-17 families. #951 owns Wave-16 extra boss doors. #1004 owns Wave-17 extra boss doors. #1080 owns Wave-18 extra boss doors. #1078 owns SDA-175…189. #982 owns CDA-030. #1006 owns prior ENC-*. #1056 owns same-day ENC-*. #1064 owns Wave-17 WF-*.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-16 P0 remain the prerequisite. **Do not land Wave-17 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 17 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥17 rares make it sharper: a CHAMPION may hold the generation-17 verb until a Chebyshev-3 orthogonal landing / painted mire cell / leftover-AP≥2-and-MP=0 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 17 fills holes Waves 1–16, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, #962, **#1011**, **#1017**, and **#1063** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Rank Stride, File Stride, Pair Stride, Knight Stride, Ring Stride, Orth Stride, Rank Lock, Pack Orth, Pack Diag, File Bite, Rank Bite, Axis Bite, Mire Skip, Rift Skip, Cadence Floor, Cadence Rise, Cadence Prime, Cadence Cap, Cadence Snuff, Cadence Dock, Spike Cut, Rime Cut, Lean Gift, Equal Gift, Prime Gift, Tally Mend, Score Mend, Stave Mend, Cast Plate, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 17 stamps `generationMin: 17`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Odd Toll **adds 1 AP** to the next **walk** if leftover AP is odd. Summon Orth taxes **allied summons** 1 AP to walk diagonal. Pack Ring locks **walk Chebyshev 2, knight excluded**. Watch Tax **adds 1 AP** to the walker’s next spell. Brick Tax **adds 1 AP** to the next walk while adjacent to a barrier. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Loaner orbs / `WF-SPL-*` never write `ownedSpellIds`.**

Innate seed is still **four ids only:** `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

---

## 3. Discovery state machine (unchanged; Wave-17 edges)

Wave 1 §3. Default path:

1. Enemy possesses an eligible player-learnable id.
2. Enemy **uses** it (`kind === "cast"` and AP spent).
3. Id becomes `OBSERVED` for this encounter (and persist-observed if the writer exists).
4. Player **wins the same encounter**.
5. Id becomes permanently unlocked in the Spell Library.

Wave-17 edges (additive):

| Event | Observes? |
| :--- | :--- |
| Encounter start, kit preview, telegraph | **No** |
| `spell-tern-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Tern Stride later walk confirm-fail (diagonal dest / Chebyshev ≠ 3) | Already observed on the arm |
| `spell-summon-mark` **paint** | **Yes** — paint is the use |
| Summon Mark later summon-spawn detonate | **No second observe** |
| `spell-prime-plate` **armed** | **Yes** |
| Prime Plate later negated hit | **No second observe** |
| `spell-mire-reel` AP spent, no painted mire in radius | **Yes** — fizzle after AP |
| `spell-gait-gift` AP spent, leftover not AP≥2/MP=0 | **Yes** — fizzle after AP |
| `spell-odd-toll` AP spent, leftover AP even | **Yes** — fizzle after AP |
| Illegal confirm (no AP) | **No** |
| `spell-pack-ring` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-lane-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Player-controlled summon casts | **No** |
| Defeat after observe | Observed may persist; **not** granted |

In-battle cue: `TECHNIQUE OBSERVED` (non-blocking, carved-stone / crimson).  
Victory recap: `NEW SPELL DISCOVERED` with name, role, AP, range, target type, key effect, source enemy.

---

## 4. Acquisition sources

| Source | Wave-17 use |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥17 family verbs in §11 **plus** #962 / #1011 stamps in §0.2 / §0.2b / §12 |
| `ACHIEVEMENT` | **None.** All 15 feat doors claimed or leftover. Never `unstoppable` / `level_10` |
| `CHALLENGE` | **None.** All nine challenge ids claimed through Wave 7 |
| `BOSS` | Lane Fold is `BOSS_ONLY` (not a grant). No new boss-grant MULTI this wave. Court Snuff stays `NOT_PLAYER_LEARNABLE` on `court_snuff_regent` |
| `ELITE` | Summon Orth, Gait Gift, Watch Tax, Lava Cut, Strike Plate. **#1011** Score Hood / Score Hold / Must Score stamp as Wave 17 CORE, not unique §11 |
| `SPECIAL_ENCOUNTER` | `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | Stamp #1011 Score Mend / Cadence Snuff / Hendeca Span as Wave 17 CORE. Stamp **#1063** Stave Mend / Cadence Dock / Dodeca Span as Wave **18** CORE. Unique §11 are not MULTI this wave |

### 4.1 Claimed doors (do not restamp)

Feat doors remain claimed as in Wave 16 §4.1. `survivor` leftover (Last Ember / Last Ward). `jackpot` is Absolve. `leader_slayer` is Crown Cut. `spell_master` is Full Bar.

Challenge doors remain claimed through Wave 7 (`easy_1` Bloodless Plate, `hard_1` Thin Ward, `legendary_1` Clean Blood, …).

Boss extra doors through **#951**: `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. **#1004**: `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. **#1080**: `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. #890 `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #953 `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. **#1011**: `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063**: `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. **#1017**: `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. **#1073** family ids `score_mender` … `summon_plater` — do not restamp.

---

## 5. Learnable vs closed

| Flag | Wave-17 ids |
| :--- | :--- |
| `PLAYER_LEARNABLE` | Unique §11 except Pack Ring and Lane Fold |
| `ENEMY_ONLY` | `spell-pack-ring` on `hoop_precentor` CHAMPION |
| `BOSS_ONLY` | `spell-lane-fold` on `lane_fold_regent` |
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
| 16 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 16` |
| 17 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 17` |
| 18+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-16 G16 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **17** for families listed in §12. It remains a data query, not a constant in combat math.

Pool recipe (conceptual):

```
  1. CORE_POOL (always; generationMin 0)
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  …
  17. if G ≥ 17: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
```

Wave 1 §9.1 through Wave 16 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

Higher relative difficulty raises eligibility for ADVANCED / RARE / ELITE / SIGNATURE. Variant (VETERAN / CHAMPION), rarity, AI sophistication, family, achievement state, encounter type, and mechanic complexity remain legal gates. None of them is a last spell tier.

---

## 7. AI compatibility (Wave-17 hints)

New hints are predicates. Missing hint → drop the id from resolve, log once. Do not fall back to `spell.name`.

| `aiHint` | Required `aiProfile` | Predicate |
| :--- | :--- | :--- |
| `walk_chebyshev_3_orthogonal` | flanker / kiter | Next walk dest Chebyshev === 3 and (`dx===0` XOR `dy===0`); skip if they must diagonal-step, knight-step, or step-1 to threaten and Strike is better |
| `next_spell_exact_chebyshev_8` | kiter / caster | Can occupy a cell from which a non-Strike target sits at Chebyshev 8 this turn; skip if not (use Strike / Hepta Oath) |
| `attract_toward_nearest_mire` | controller / caster | At least one **painted mire** occupancy in search radius; dest is that occupancy, never `map.portals`, never live lava/ice/spikes |
| `bonus_if_share_diagonal_with_caster` | flanker / bruiser | Target `\|dx\|==\|dy\|` and Chebyshev ≥ 1 |
| `detonate_if_summon_spawned_on_cell` | controller / summoner | Paint a cell a summoner is likely to spawn onto; skip if they will Strike-from (use Strike Mark) |
| `negate_hit_if_leftover_ap_eq_1_and_mp_eq_1` | tank / warden | Arm when own leftover AP === 1 **and** leftover MP === 1; skip if leftover AP even ≥ 2 and leftover MP even ≥ 2 (use Dual Plate) or leftover MP = 0 (use Dry Plate) |
| `skip_slide_tile_push_one_tile` | flanker / kiter | A 1-tile walk onto conveyor occupancy is useful; skip if the tax is lava/spikes/ice/Void Rift |
| `bonus_if_leftover_mp_equals_max` | bruiser / caster | Target leftover MP === that body’s max MP (they have not spent MP this turn) |
| `summon_walk_diagonal_ap_tax` | summoner | Living allied summon exists; skip if pack is already orthogonal-locked (Pack Orth) or diagonal-locked (Pack Diag) |
| `heal_if_leftover_ap_ge_2_and_mp_eq_0` | healer | Target leftover AP ≥ 2 **and** leftover MP = 0 and missing HP ≥ 8; skip if leftover is 1/1 (Prime Gift) or AP=0/MP≥1 (Lean Gift). **Healer CORE only** |
| `cap_remaining_cds_gt_3_to_3` | controller / caster | Target has at least one remaining CD `n>3`; skip if all remaining are 0/1/2/3 (use Cap / Floor / Prime / Rise) |
| `tax_next_walk_if_leftover_ap_odd` | controller | Target leftover AP is odd; skip if leftover AP even (use Gait Toll when leftover MP = 0 instead) |
| `tax_next_walk_if_adjacent_barrier` | controller / tank | Target is adjacent to a barrier; skip if no barrier (use Brick Hold if they must not walk) |
| `overwatch_snap_tax_walker_next_spell` | kiter / sniper | Arm overwatch on a tile a walker will enter; snap writes next-spell +1 AP |
| `bonus_if_leftover_ap_eq_1_and_mp_eq_0` | bruiser / caster | Target leftover AP === 1 **and** leftover MP === 0; skip if leftover MP odd (Odd Gait) or leftover 1/1 (Prime Gift / Prime Plate) |
| `bonus_if_near_lava_occupancy` | flanker / controller | Target Chebyshev ≤ 2 from lava occupancy |
| `next_strike_damage_zero` | controller / disruptor | Target is about to confirm Strike / `physical_attack`; skip if they will only cast a non-Strike (use Cast Plate) |
| `pack_walk_chebyshev_2_not_knight` | pack champion | Boss/champion AI only. Living pack allies exist. **Never owned** |
| `fold_two_player_side_share_axis_chebyshev_3` | boss | Two living player-side bodies that share rank **or** file **and** Chebyshev exactly 3. **Boss AI only. Never owned** |

Do not assign Gait Gift / Tally Mend / Equal Gift / Prime Gift / Score Mend to non-healer CORE. Do not assign Mire Reel when the map has no painted mire. Do not assign Lane Fold outside boss AI.

---

## 8. Persistence (Wave-1 writers; Wave-17 does not add a second path)

Discovery must be backend-authoritative, idempotent, reload-safe, and duplicate-callback safe.

- Grant writer is still Wave 1 `commitSpellDiscoveries` (not implemented on this HEAD).
- Repeated discovery must not duplicate spells, reset upgrades, mint Doka/XP, or call `upgradeSpell` / `updateCharacter` / `applyRewards`.
- `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds` / `spellLevelKeys`.
- Loaner orbs and `WF-SPL-*` never write those maps.

---

## 9. Special encounters (Wave 17)

Tag existing solvable layouts. Do not edit `mapGen.ts` algorithms. Do not skip `finalizePlayableLayout`.

| Tag | Teach via observe+win |
| :--- | :--- |
| `tern_gallery` | `spell-tern-stride` |
| `octa_nave` | `spell-octa-oath` |
| `bog_aisle` | `spell-mire-reel` |
| `spawn_pulpit` | `spell-summon-mark` |
| `belt_nave` | `spell-slide-skip` |

Do not retag `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `knight_gallery` / `even_gallery` / `pair_gallery` / `diag_gallery` / `rime_gallery` / `void_aisle` / `ash_aisle` / `penta_nave` / `hexa_nave` / `hepta_nave` / `span_six` / `span_dec` / `span_hendeca` / `mire_nave` / `frost_aisle` / `lava_aisle` / `strike_pulpit` / `last_pulpit` / `shock_nave` / `rift_court`. Do not consume #771 primer rooms, #826 ENC-* ids, #885 ENC-* ids, #957 ENC-* ids, **#1006** ENC-* ids, or **#1056** ENC-* ids. Twin Gate pads stay off `map.portals`. Painted mire / conveyor cells are spell occupancy, not `HazardTileType`. `ENC-INCH-01` stays Inch Stride’s room. `ENC-FOLD-01` stays a wall fold, not Lane Fold. `ENC-TRI-01` stays #1006’s room, not Octa Oath. `ENC-GAUNT-01` stays #1006’s room, not Gait Gift. `ENC-DUMP-01` stays #1006’s room, not Gait Gift. `ENC-KNIGHT-01` stays Knight Stride’s room, not Tern Stride. `ENC-POISE-01` stays Poise Mend’s room, not Gait Gift. `ENC-PIT-02` stays Pit Reel’s room, not Mire Reel. `ENC-SPELL-33` stays #1056’s Poise teach, not Gait Gift.

Wave-1 `echo_dummies`, Wave-2 `rime_gallery` / `still_court` / `mist_gallery`, Wave-13 `knight_gallery` / `quad_nave` / `pit_aisle`, Wave-14 `rank_gallery` / `penta_nave` / `spike_aisle` / `mire_nave`, Wave-15 `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave`, and Wave-16 `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` are not re-specified.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–16 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 + #695 + #726 + #787 + #849 + #890 + #953 + #1011 already cover: push, pull, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, conditional bounce, next-spell AP tax, next-walk AP tax after Strike, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, leftover-AP=0 heal, leftover-MP=0 heal, leftover 0=0 heal, leftover AP==MP ≥ 1 heal, leftover AP=0 and MP≥1 heal, leftover 1/1 heal, leftover sum===3 heal, leftover sum===4 unequal heal, CD copy / steal / swap / lag / stall / stretch / halve / trim / rest / grace / floor / rise / prime / cap / snuff, even-Chebyshev hood, odd-Chebyshev hood, eight-cell occupy, nine-cell occupy, ten-cell occupy, eleven-cell occupy, leftover-AP-odd plate, leftover-MP=0 plate, leftover both-even≥2 plate, same-file next walk, same-rank next walk, knight walk, Chebyshev-2-not-knight walk, exact-4/5/6/7 spell gate, lava/spike/pit/ice pull, Strike-from paint, last-AP paint, pack orthogonal lock, pack diagonal lock, Chebyshev-3 any-geometry fold, Chebyshev-4 fold.

**Still open (Wave 17 SDE unique ids).** The occupy-weights, leftover-sum===4 family, CD floor/rise/prime/cap/snuff, and same-file/same-rank/ring walks are siblings’; this table is what Discovery **adds**.

| Hole | Wave-17 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk Chebyshev **exactly 3**, **orthogonal only** | `spell-tern-stride` | Ring Stride is Chebyshev **exactly 2**, knight excluded (includes `(2,2)`). Orth Stride is **any** orthogonal length. Rank Stride is same **y**, length free. File Stride is same **x**. Pair Stride is Manhattan **2**. Knight Stride is **only** `(2,1)`. Long Oath is a **spell** gate ≥ 3. Leap Fold swaps two bodies at Chebyshev 3 |
| Next spell illegal unless Chebyshev = 8 | `spell-octa-oath` | Hepta Oath is 7. Hexa Oath is 6. Oct Span is occupy-weight 8. Long Oath is ≥ 3. Far Hood is incoming miss from ≥ 3 |
| Pull 1 toward nearest **painted mire occupancy** | `spell-mire-reel` | Lava Reel is lava. Rime Reel is ice. Spike Reel is spikes. Mire Sheet **paints** the cell. Mire Skip **ignores enter-tax**. Hook Line is toward **caster**. Dest is never `map.portals` |
| Bonus if share a **diagonal** (`\|dx\|==\|dy\|`) | `spell-diag-bite` | File Bite is **file only**. Rank Bite is **rank only**. Axis Bite is rank **or** file. Screen Bite wants Bresenham **blocked**. Diag Stride is a **walk** constraint |
| Cell detonates when a summon is **spawned onto** it | `spell-summon-mark` | Strike Mark is **Strike from**. Cast Mark is any **spell** confirm. Last Mark is last leftover **AP**. Ingress is walk enter. Swap Mark is teleport landing. Body Mark is a different unit flag |
| Next hit is 0 while leftover AP **=== 1 AND** leftover MP **=== 1** | `spell-prime-plate` | Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. Dry Plate is leftover **MP = 0**. Odd Plate is leftover **AP odd**. Prime Gift is a **heal** on 1/1. Score Hood is leftover sum === 4 unequal |
| 1-tile walk ignores **conveyor** auto-push | `spell-slide-skip` | Slide Tile **is** the conveyor. Rift Skip is Void Rift tax. Glyph Skip is glyph-tax. Shock Skip is shock-tile tax. Mire Skip is mire enter-tax. Gap Ward skips **overwatch**. Lava / spike taxes still tick |
| Bonus if leftover MP **equals that body’s max MP** | `spell-capped-sting` | Fresh Sting is leftover AP **equals max AP**. Full Sting is leftover AP **≥ 3**. Even Sting is leftover AP **even ≥ 2**. Dry Sting is leftover MP **= 0**. They may have spent AP and still hold max MP — Capped Sting still hits |
| Allied summons pay +1 AP to **walk diagonal** | `spell-summon-orth` | Summon File taxes walk **off file**. Summon Rank taxes walk **off rank**. Summon Toll taxes **every** pet walk. Pack Orth **locks** pack walks orthogonal (`ENEMY_ONLY`). Pack Diag **locks** diagonal |
| Heal iff leftover AP **≥ 2 AND** leftover MP **= 0** | `spell-gait-gift` | Lean Gift is AP = 0 **and** MP ≥ 1. Prime Gift is **1/1**. Equal Gift is AP **==** MP ≥ 1. Hollow Gift / Gaunt Mend own **0=0**. Tally Mend is both-body leftover **sum === 3**. Score Mend is both-body leftover **sum === 4 AND unequal**. `healAmount` stays 0 on the row |
| Remaining CDs **n>3 → 3**; 0/1/2/3 unchanged | `spell-cadence-tern` | Cadence Cap is `n>2` → **2**. Cadence Floor is `n>1` → **1**. Cadence Rise is `n==1` → 2. Cadence Prime is `n==0` → 1. Cadence Snuff is `n===1` → 0. Cadence Stall is **+1 all remaining**. Triple Span is occupy-weight 3 |
| Next **walk** +1 AP if leftover **AP is odd** | `spell-odd-toll` | Gait Toll is next walk if leftover **MP = 0**. Still Toll is next **spell** if leftover MP = 0. Debt Mark is ungated next walk. Strike Debt is next walk if they **Struck**. Odd Gait is **damage** if leftover MP is odd |
| Next **walk** +1 AP while adjacent to a **barrier** | `spell-brick-tax` | Brick Hold **forbids** the walk. Brick Brace **negates a hit** while adjacent. Brick Step **relocates through** the barrier. Tally Hold / Score Hold are leftover-sum walk locks |
| Overwatch snap **taxes the walker’s next spell +1 AP** | `spell-watch-tax` | Watch Drain **steals 1 leftover MP**. Watch Root **zeros** leftover MP. Watch Sip **steals AP**. Watch Bank **banks AP**. Quiet Hex is an ungated **next-spell** tax, not an overwatch snap |
| Bonus if leftover AP **=== 1 AND** leftover MP **=== 0** | `spell-thin-gait` | Even Gait is leftover MP **even ≥ 2**. Odd Gait is leftover MP **odd**. Lone Gait is leftover MP **exactly 1**. Tied Gait is leftover AP **and** MP both **exactly 2**. Prime Gift / Prime Plate own **1/1**. Thin Ward is a Wave-7 challenge absorb |
| Bonus if Chebyshev ≤ 2 from **lava occupancy** | `spell-lava-cut` | Rime Cut is **ice occupancy**. Spike Cut is **spike occupancy**. Hazard Cut is **painted** hazard. Portal Cut is **world portals**. Lava Reel **pulls**. Lava Skip **ignores tax** |
| Target’s next **Strike** deals 0 damage (AP still spent) | `spell-strike-plate` | Cast Plate zeros the next **non-Strike spell**. Summon Plate zeros the next **incoming hit** on allied summons. Mute Thread is a silence-ish sibling. Quiet Hex is an ungated **AP tax**. Strike / `physical_attack` is the only payload this card zeros |
| Pack walks locked to Chebyshev **exactly 2**, knight excluded | `spell-pack-ring` | Pack Orth is **orthogonal** (any length). Pack Diag is **diagonal only**. Pack File is **one file**. Pack Rank is **one rank**. Ring Stride is one next walk from **self**. Never owned |
| Swap two player-side bodies that share rank **or** file **and** Chebyshev **exactly 3** | `spell-lane-fold` | Leap Fold is Chebyshev **exactly 3**, **any geometry**. Mid Fold is shared rank **or** file, **any distance**. Rank Fold is shared **rank** only. File Fold is a different boss. Adj Fold is Chebyshev **1**. Far Fold is exactly **4**. Reach Fold is exactly **2**. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 17)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–16, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #802, #837, #849, #890, #906, #953, #962, **#1011**, or **#1017**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Odd Toll / Summon Orth / Pack Ring / Watch Tax / Brick Tax are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 17 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #1017 / #1011 / #962 / #953 / #906 key names for a different meaning.

```text
ternStrideChebyshev3Orthogonal,   // dest cheb==3 AND (dx==0 XOR dy==0)
nextSpellExactChebyshev,          // Octa Oath — value 8 (reuse key; value distinguishes Hepta=7 / Hexa=6)
attractTowardNearestMire, mireSearchRadius,
bonusIfShareDiagonalWithCaster, diagBiteBonus,
detonateOnSummonSpawnOnCell,
negateHitIfLeftoverApEq1AndMpEq1,
skipSlideTilePushOneTile,
bonusIfLeftoverMpEqualsMaxMp, cappedStingBonus,
summonWalkDiagonalApTax,
requireLeftoverApGe2AndMpEq0, gaitGiftHeal,
capRemainingCdsAbove3To3,         // n>3 → 3; 0/1/2/3 stay
nextWalkApTaxIfLeftoverApOdd,
nextWalkApTaxIfAdjacentBarrier,
overwatchSnapTaxWalkerNextSpell,
bonusIfLeftoverApEq1AndMpEq0, thinGaitBonus,
bonusIfNearLavaOccupancy, lavaCutRadius, lavaCutBonus,
nextStrikeDamageZero,
packWalkChebyshev2NotKnight, packAuraRadius, packAuraDuration,
foldTwoPlayerSideShareAxisChebyshev3, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` for Watch Tax’s arm window; `nextSpellExactChebyshev` with value **8**.

---

### SPELL_ID: `spell-tern-stride`

NAME: Tern Stride  
ROLE: POSITION — one next walk must be Chebyshev 3, orthogonal  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rank_lancer`; `G ≥ 17` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥17. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The caster’s **next walk** is legal only if Chebyshev(`arm`, `dest`) **=== 3** and (`dx===0` XOR `dy===0`) (`effectParams: {"ternStrideChebyshev3Orthogonal":true}`). Legal dests are the four orthogonal 3-steps: `(±3,0)` and `(0,±3)`. Diagonal dests including `(2,2)` / `(3,3)`, knight dests, Chebyshev 1–2, and Chebyshev ≥ 4 confirm-fail (MP not spent). Forced movement / swap / blink / Twin-gate still legal. Distinct from Ring Stride (Chebyshev **exactly 2**, knight excluded, includes `(2,2)`), Orth Stride (any orthogonal length), Rank Stride (same **y**, length free), File Stride (same **x**), Pair Stride (Manhattan **2**), Knight Stride (**only** `(2,1)`), Must Span (**all** walks), Long Oath (spell gate ≥ 3). Does **not** read `currentView`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_chebyshev_3_orthogonal"`. Flanker / kiter. Skip if they must diagonal-step, knight-step, or step-1 to threaten and Strike is better. **Do not** assign to chargers who only walk adjacent.  
PLAYER_COUNTERPLAY: Stand at Chebyshev 1, 2, or 4; occupy the four axis cells; Root before they arm  
SYNERGIES: Far Sting after they are stuck on the axis; Ring Stride on a different body (do **not** CORE both on one kit)  
BALANCE_RISK: One-walk axis-3 lock is a spacing puzzle. 2 AP / CD 2 / one consume. Fail closed (confirm fail), never become Ring Stride, Orth Stride, or Leap Fold.  
PERSISTENCE_REQUIREMENTS: Standard observe → same-encounter win. Observation is the **arm**, not the later walk.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octa-oath`

NAME: Octa Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 8  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `pale_cantor`; `G ≥ 17`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **non-Strike** spell confirms only if Chebyshev from caster to that spell’s target is **exactly 8** (`effectParams: {"nextSpellExactChebyshev":8}`). `physical_attack` stays legal at any range. Distinct from Hepta Oath (exactly 7), Hexa Oath (exactly 6), Penta Oath (exactly 5), Long Oath (≥ 3), Oct Span (occupy-weight 8), Far Hood (incoming miss from ≥ 3). If they arm then walk to 7, the spell fizzles on confirm (AP not spent for the fizzled spell; Octa Oath already observed).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_8"`. Kiter / caster. Skip if they cannot reach 8 this turn (use Strike / Hepta Oath).  
PLAYER_COUNTERPLAY: Close to 7 or 9; Root; Paper Wind  
SYNERGIES: Split Pace / Overcast after they sit at 8; Far Sting as the gated poke  
BALANCE_RISK: Exact-8 + Far Sting is a sniper prison. 2 AP / CD 3 / Strike exempt. Do not restamp `span_hendeca` / `hepta_nave` / `oct-span`. Do not mint `spell-octa-span`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-mire-reel`

NAME: Mire Reel  
ROLE: POSITION — pull 1 toward nearest painted mire  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `rime_mason`; `G ≥ 17`; `aiProfile` controller/caster  
ENEMY_FAMILIES: `tide_shade`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Pull the target 1 tile toward the nearest **painted mire** occupancy in Chebyshev 6 (`effectParams: {"attractTowardNearestMire":true,"mireSearchRadius":6}`). Painted mire is Mire Sheet occupancy, **not** `HazardTileType` lava/ice/spikes. If no painted mire exists, fizzle (AP spent). Dest is never `map.portals`, never Twin Gate pads, never live lava/ice/spikes (those are Lava / Rime / Spike Reel). Distinct from Mire Sheet (paints the tax), Mire Skip (ignores enter-tax), Hook Line (toward caster), Undertow (attract + walk-MP).  
SCALING: distance fixed  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_mire"`. Controller / caster. Skip if no painted mire in radius (use Lava Reel / Rime Reel / Hook). **Do not** assign to chargers.  
PLAYER_COUNTERPLAY: Do not stand on a mire approach; Barrier the pull cell; blink off  
SYNERGIES: Mire Sheet first, then reel; Far Watch covering the mire  
BALANCE_RISK: Pull onto mire + enter-tax bricks a close. G≥17 + painted-mire gate + 3 AP. Dest must fail closed off world portals.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-mire fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-diag-bite`

NAME: Diag Bite  
ROLE: DAMAGE — bonus if share a diagonal  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `shadow_lurker`; `G ≥ 17`; `aiProfile` flanker/bruiser  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If `\|dx\|==\|dy\|` and Chebyshev ≥ 1, deal an extra 8 as a **second** existing `dealDamage` call (`effectParams: {"bonusIfShareDiagonalWithCaster":true,"diagBiteBonus":8}`). Shared rank only or shared file only is 10. Distinct from File Bite (file only), Rank Bite (rank only), Axis Bite (rank **or** file), Screen Bite (Bresenham blocked), Diag Stride (walk constraint), Rear Cut (adjacent flank).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_diagonal_with_caster"`. Flanker / bruiser. Skip if the target is on-rank or on-file and Strike / Rank Bite / File Bite is better.  
PLAYER_COUNTERPLAY: Stand on the caster’s rank or file; Barrier the diagonal  
SYNERGIES: Diag Stride onto the diagonal; Pawn Trade to place them on `|dx|==|dy|`  
BALANCE_RISK: 18 on a diagonal is Frost-adjacent on 2 AP CD 1. Geometry gate. Do not also fire Axis Bite’s rider.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-diagonal still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-mark`

NAME: Summon Mark  
ROLE: TERRAIN — cell detonates on summon spawn  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `bone_scribe`; `G ≥ 17`; `aiProfile` controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. The next **summon spawn** whose landing cell is this paint takes 12 (spell, RES+SR) and the paint consumes (`effectParams: {"detonateOnSummonSpawnOnCell":true}`). Walk enter, Strike-from, last-AP spend, teleport/swap landing, and end-turn occupy do **not** detonate. Distinct from Strike Mark, Last Mark, Ingress Mark, Swap Mark, Cast Mark. Observation is the **paint**.  
SCALING: damage follows dmg%; trigger fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_summon_spawned_on_cell"`. Controller. Skip if no living summoner and the player’s bar has no summon id.  
PLAYER_COUNTERPLAY: Spawn off the cell; walk a pet onto it (no detonate); Barrier last-writer  
SYNERGIES: Null Brand after the detonate; Kennel Lock so they spawn inside 2  
BALANCE_RISK: 12 vs a fresh wolf is real. Paint-only trigger + CD 2. Do not detonate on existing pets walking through.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-prime-plate`

NAME: Prime Plate  
ROLE: DEFENSE — next hit is 0 while leftover 1/1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 17`; `aiProfile` tank/warden  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥17. `generationMin: 17`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or 1 turn. While leftover AP **=== 1** and leftover MP **=== 1**, the next damaging instance against this unit deals 0 and consumes (`effectParams: {"negateHitIfLeftoverApEq1AndMpEq1":true}`). If leftover is not 1/1 at hit time, the hit lands and the stance remains. Distinct from Dual Plate (both leftover **even ≥ 2**), Dry Plate (leftover MP = 0), Odd Plate (leftover AP odd), Prime Gift (**heal** on 1/1), Score Hood (sum === 4 unequal). Do not write `buffStat: "evasion"`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_eq_1_and_mp_eq_1"`. Tank / warden. Skip if leftover is even≥2/even≥2 (Dual Plate) or leftover MP = 0 (Dry Plate).  
PLAYER_COUNTERPLAY: Force them to spend the last AP or last MP before the hit; wait the turn; throw 0-damage control first if a consume gate is up  
SYNERGIES: Prime Gift on a healer ally in the 1/1 window; Quiet Hex so they cannot spend the last AP on a nuke  
BALANCE_RISK: 1/1 is a rare leftover. 2 AP / CD 2. Do not also fire Dual Plate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-slide-skip`

NAME: Slide Skip  
ROLE: POSITION — 1-tile walk ignores conveyor push  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `plague_rat`; `G ≥ 17`; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The caster’s **next walk of length 1** does not trigger Slide Tile auto-push (`effectParams: {"skipSlideTilePushOneTile":true}`). Lava / spikes / ice leave-tax / mire enter-tax / glyph-tax / Void Rift tax still tick. Walks of length ≥ 2 are not skipped. Forced movement onto a conveyor still slides. Distinct from Slide Tile (the conveyor), Rift Skip, Glyph Skip, Shock Skip, Mire Skip, Gap Ward.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_slide_tile_push_one_tile"`. Flanker / kiter. Skip if no conveyor occupancy is on the intended 1-tile dest.  
PLAYER_COUNTERPLAY: Occupy the dest; paint a second conveyor; force-move them onto the belt  
SYNERGIES: Slide Tile as the puzzle they skip; Rank Lock so the only step is onto the belt  
BALANCE_RISK: Skipping the conveyor deletes Slide Tile’s payoff for one step. Length 1 + consume + CD 2. Do not skip lava.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. The ignored push is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-capped-sting`

NAME: Capped Sting  
ROLE: DAMAGE — bonus if leftover MP equals max MP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 17`; `aiProfile` bruiser/caster  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥17. `generationMin: 17`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s leftover MP **equals that body’s max MP**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverMpEqualsMaxMp":true,"cappedStingBonus":8}`). Distinct from Fresh Sting (leftover AP **equals max AP**), Full Sting (leftover AP ≥ 3), Even Sting (leftover AP even ≥ 2), Dry Sting (leftover MP = 0), Gaunt Sting (both leftover 0). A body that walked still has leftover AP but not max MP — Capped Sting misses that, Fresh Sting might still hit.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_mp_equals_max"`. Bruiser / caster. Skip if the target already walked this turn and Fresh Sting / Strike is better.  
PLAYER_COUNTERPLAY: Spend 1 MP before the poke; sit at leftover MP max-1  
SYNERGIES: Root / Odd Toll so they will not spend MP; Paper Wind if they wanted to walk first  
BALANCE_RISK: 18 vs a camping caster is Frost-adjacent. Gate is leftover MP === max, not “has not walked.”  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Missed gate still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-orth`

NAME: Summon Orth  
ROLE: SUMMONS — pets pay +1 AP to walk diagonal  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 17`; `aiProfile` summoner  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 17`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon that confirms a walk dest with `|dx|>0` **and** `|dy|>0` also pays +1 AP (`effectParams: {"summonWalkDiagonalApTax":true}`). Orthogonal walks are free of this tax. Distinct from Summon File (off **file**), Summon Rank (off **rank**), Summon Toll (every pet walk), Pack Orth (`ENEMY_ONLY` orthogonal **lock**), Pack Diag (diagonal **lock**).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_walk_diagonal_ap_tax"`. Summoner. Skip if no allied summon, or if Pack Orth / Pack Diag already locks the pack. Drop this id if `summonAI` is empty.  
PLAYER_COUNTERPLAY: Walk pets orthogonal; kill the Chanter; Sever Tether  
SYNERGIES: Rank Lock so the only legal pet step is diagonal (they pay); Kennel Lock inside 2  
BALANCE_RISK: Taxing diagonal pet walks is a leash, not a lock. Elite + CD 3. Player copy taxes **their** pets — a real downside when kiting.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gait-gift`

NAME: Gait Gift  
ROLE: SUPPORT — heal iff leftover AP ≥ 2 and leftover MP = 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 17`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 17`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: Target may be self. Heal 10 **only if** leftover AP **≥ 2** and leftover MP **= 0** (`effectParams: {"requireLeftoverApGe2AndMpEq0":true,"gaitGiftHeal":10}`). `healAmount` on the row stays **0** so `inferArchetype` does not silently tag every kit that holds the id — assign to **healer CORE only**. If leftover is not AP≥2/MP=0, fizzle (AP spent, no heal). Distinct from Lean Gift (AP=0 and MP≥1), Prime Gift (exactly 1/1), Equal Gift (AP==MP ≥ 1), Hollow Gift / Gaunt Mend (0=0), Tally Mend (both-body sum === 3), Score Mend (both-body sum === 4 unequal), Stave Mend (#1063 both-body sum === 5), Gait Toll (next-walk tax), Gait Mend (#563 leftover-gait heal).  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_ge_2_and_mp_eq_0"`. Healer. Skip if leftover is 1/1 (Prime Gift) or AP=0/MP≥1 (Lean Gift) or missing HP < 8.  
PLAYER_COUNTERPLAY: Force them to spend AP or keep 1 MP; Cursed Wound; kill the cantor  
SYNERGIES: Gait Toll so they dump MP walking then sit in the window; `easy_1` still fails if the heal lands  
BALANCE_RISK: 10 HP after a dumped-MP turn is a camp heal. Elite + leftover gate + healer CORE only. Do not CORE on non-healers.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes. Player-side HP gain sets `healUsed`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-tern`

NAME: Cadence Tern  
ROLE: CONTROL — remaining CDs above 3 become 3  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 17`; `aiProfile` controller/caster  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. For each remaining cooldown `n` on the target, if `n>3` set it to 3; 0/1/2/3 unchanged (`effectParams: {"capRemainingCdsAbove3To3":true}`). Distinct from Cadence Cap (`n>2` → **2**), Cadence Floor (`n>1` → **1**), Cadence Rise (`n==1` → 2), Cadence Prime (`n==0` → 1), Cadence Snuff (`n===1` → 0), Cadence Dock (`n===2` → 0), Cadence Stall (+1 **all** remaining), Triple Span (occupy-weight 3). Zeros stay 0.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cap_remaining_cds_gt_3_to_3"`. Controller / caster. Skip if all remaining are 0/1/2/3 (use Cap / Floor / Prime / Rise / Snuff). Do not CORE with Cadence Cap / Cadence Floor / Cadence Snuff on the same BASE kit.  
PLAYER_COUNTERPLAY: Sit with remaining ≤ 3; wait the CD; Dispel if the strip list includes this key  
SYNERGIES: Cadence Stall first so a 2 becomes 3 then Tern does nothing — **do not** double-cast; Inferno CD 3 is already at the cap  
BALANCE_RISK: Capping a 5 to 3 is a tempo gift to **them** if miscast. AI skip unless a remaining `n>3` exists. G≥17 + CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-odd-toll`

NAME: Odd Toll  
ROLE: CONTROL — next walk +1 AP if leftover AP is odd  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 17`; `aiProfile` controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target’s leftover AP is **odd** at resolve, their **next walk of ≥ 1 tile** this battle (or 2 turns) also costs +1 AP (`effectParams: {"nextWalkApTaxIfLeftoverApOdd":true}`). If leftover AP is even, fizzle (AP spent). Teleport / Swap / Phase Slip / Twin-gate step do **not** pay. Distinct from Gait Toll (next walk if leftover **MP = 0**), Still Toll (next **spell** if leftover MP = 0), Debt Mark (ungated next walk), Strike Debt (next walk after Strike), Odd Gait (**damage** if leftover MP is odd). Not `spell.mpCost`.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_leftover_ap_odd"`. Controller. Skip if leftover AP is even (use Gait Toll when leftover MP = 0).  
PLAYER_COUNTERPLAY: Spend 1 AP to even the leftover before walking; blink off; Strike in place  
SYNERGIES: Quiet Hex so they cannot spend the odd AP on a spell; Far Watch on the taxed step  
BALANCE_RISK: Odd leftover + walk tax is a tempo trap. Fizzle on even leftover. G≥17. Do not also fire Debt Mark on G=0.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Even-leftover fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-tax`

NAME: Brick Tax  
ROLE: CONTROL — next walk +1 AP while adjacent to a barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 17`; `aiProfile` controller/tank  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target is adjacent to a **barrier** at resolve, their next walk of ≥ 1 tile (or 2 turns) also costs +1 AP (`effectParams: {"nextWalkApTaxIfAdjacentBarrier":true}`). If no adjacent barrier, fizzle (AP spent). The walk remains legal — this is not Brick Hold. Distinct from Brick Hold (cannot walk), Brick Brace (negate hit), Brick Step (step through), Tally Hold / Score Hold (leftover-sum walk lock).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_adjacent_barrier"`. Controller / tank. Skip if no adjacent barrier (use Brick Hold only when they must not walk).  
PLAYER_COUNTERPLAY: Step off before the tax resolves; Barrier last-writer **fills** then they are still adjacent — pay or blink; wait 2 turns  
SYNERGIES: Barrier first, then tax; File Lance on the locked approach  
BALANCE_RISK: Barrier + walk tax is a corridor prison. Walk still legal at +1 AP. G≥17 + fizzle without a barrier.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. No-barrier fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-tax`

NAME: Watch Tax  
ROLE: DEFENSE — overwatch snap taxes the walker’s next spell +1 AP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 17`; `aiProfile` kiter/sniper  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 17`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into Chebyshev 3 or 4 of the caster does **not** take damage; instead their **next spell** costs +1 AP for 2 turns or until they successfully spend on a spell (`effectParams: {"overwatchSnapTaxWalkerNextSpell":true,"overwatchDuration":2}`). Push/pull into the band **does** trigger. Teleport / Swap / Twin-gate **does not**. Distinct from Watch Drain (steal leftover MP), Watch Root (zero leftover MP), Watch Sip (steal AP), Watch Bank (bank AP), Far Watch (damage snap), Quiet Hex (ungated next-spell tax). Observation is the **arm**. Not `spell.mpCost`.  
SCALING: tax fixed; band fixed  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_tax_walker_next_spell"`. Kiter / sniper. Skip if the player is already in 1–2 (use Strike / Glass Shot).  
PLAYER_COUNTERPLAY: Stay at 5+ or at 1–2; blink in; send a summon into 3; cast a 2-cost tool to burn the tax  
SYNERGIES: Odd Toll (walking into 3 costs AP **and** the next spell is taxed); Paper Wind  
BALANCE_RISK: Band 3–4 + Quiet Hex is two spell taxes. Consume-on-first-body, CD 3, elite. Snap does not deal HP.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-thin-gait`

NAME: Thin Gait  
ROLE: DAMAGE — bonus if leftover AP is 1 and leftover MP is 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; `G ≥ 17`; `aiProfile` bruiser/caster  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥17. `generationMin: 17`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If leftover AP **=== 1** and leftover MP **=== 0**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApEq1AndMpEq0":true,"thinGaitBonus":8}`). Distinct from Even Gait (leftover MP even ≥ 2), Odd Gait (leftover MP odd), Lone Gait (leftover MP exactly 1), Tied Gait (both leftover exactly 2), Prime Gift / Prime Plate (1/1), Gait Gift (AP≥2 and MP=0 **heal**), Thin Ward (Wave-7 challenge absorb).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_1_and_mp_eq_0"`. Bruiser / caster. Skip if leftover is 1/1 (Prime Gift window) or leftover MP odd (Odd Gait).  
PLAYER_COUNTERPLAY: Keep 1 MP or spend the last AP; sit at leftover 2/0 (Gait Gift window, not this bonus)  
SYNERGIES: Odd Toll so they hesitate to spend the odd AP walking; Gait Toll already dumped their MP  
BALANCE_RISK: 18 on a 1/0 leftover is a punish for dumping MP and holding 1 AP. Gate is exact. Do not fire Gait Gift’s heal on this hit.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Missed gate still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lava-cut`

NAME: Lava Cut  
ROLE: DAMAGE — bonus near lava occupancy  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `plague_rat`; variant ≥ ELITE or `G ≥ 17`; `aiProfile` flanker/controller  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 17`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is Chebyshev ≤ 2 from **lava occupancy** (`HazardTileType` `"lava"`), deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfNearLavaOccupancy":true,"lavaCutRadius":2,"lavaCutBonus":8}`). Distinct from Rime Cut (ice), Spike Cut (spikes), Hazard Cut (painted hazard), Portal Cut (world portals), Lava Reel (pull), Lava Skip (ignore tax). Reads occupancy, never `spell.name`. Twin Gate pads and painted mire do **not** count.  
SCALING: both numbers follow dmg%; radius fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_lava_occupancy"`. Flanker / controller. Skip if no lava in 2 of the target (use Rime Cut / Spike Cut).  
PLAYER_COUNTERPLAY: Step to Chebyshev 3 from lava; blink; fight on ice instead  
SYNERGIES: Lava Reel first; File Slide onto the lava approach  
BALANCE_RISK: 18 next to lava plus the lava tick is a hospital. Elite + occupancy gate. Do not invent ash occupancy.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Far-from-lava still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-strike-plate`

NAME: Strike Plate  
ROLE: CONTROL — target’s next Strike deals 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 17`; `aiProfile` controller/disruptor  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 17`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. The target’s next **Strike** / `physical_attack` this battle (or 2 turns) deals 0; AP is still spent (`effectParams: {"nextStrikeDamageZero":true}`). Non-Strike spells deal full damage. Distinct from Cast Plate (next **non-Strike spell** deals 0), Summon Plate (next **incoming** hit on allied summons), Mute Thread, Quiet Hex (AP tax). Together with Cast Plate a kit can zero a bar — **do not** CORE both on one BASE kit.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_strike_damage_zero"`. Controller / disruptor. Skip if they will only cast a non-Strike (use Cast Plate).  
PLAYER_COUNTERPLAY: Cast Frost / Slow first; wait 2 turns; the 0-damage Strike still spends AP and can still observe other riders  
SYNERGIES: Goad so they must throw Strike; Sidestep does not consume on a 0-damage Strike (explicit: the hit still “lands” at 0, it is not a miss)  
BALANCE_RISK: Zeroing Strike deletes the melee baseline for one swing. Elite + CD 3 + Strike-only. Do not also CORE Cast Plate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. The zeroed Strike is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-ring`

NAME: Pack Ring  
ROLE: SUPPORT — pack walks locked to Chebyshev 2, knight excluded  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `hoop_precentor`; variant CHAMPION; `G ≥ 17`  
ENEMY_FAMILIES: `hoop_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE_POOL. `generationMin: 17`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 of the caster may only **walk** to dests whose Chebyshev from **their** current cell is **exactly 2** and not knight `(2,1)` (`effectParams: {"packWalkChebyshev2NotKnight":true,"packAuraRadius":2,"packAuraDuration":2}`). Forced movement / swap / blink still legal. Distinct from Pack Orth (orthogonal any length), Pack Diag (diagonal only), Pack File (one file), Pack Rank (one rank), Ring Stride (one next walk from **self**). Never owned. Do **not** CORE with Pack Orth / Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_chebyshev_2_not_knight"`. Pack champion only. Skip if aura up or no ally in 2.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies out of 2; occupy the ring cells  
SYNERGIES: Ring Stride is the **learnable** one-body version — do not also grant this  
BALANCE_RISK: Pack-wide ring lock is a signature scramble. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe (and would not grant anyway).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lane-fold`

NAME: Lane Fold  
ROLE: POSITION — swap two player-side bodies that share an axis at Chebyshev 3  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `lane_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `lane_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **only if** they share rank **or** file **and** Chebyshev between them is **exactly 3**. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideShareAxisChebyshev3":true,"foldDamage":6}`). If fewer than two, or they are off-axis, or Chebyshev ≠ 3, fizzle. Distinct from Leap Fold (Chebyshev exactly 3, **any geometry**), Mid Fold (shared rank or file, **any distance**), Rank Fold (shared rank only), File Fold (different boss), Adj Fold (Chebyshev 1), Far Fold (exactly 4), Reach Fold (exactly 2), Sovereign Fold (no axis/cheb gate). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_share_axis_chebyshev_3"`. **Boss AI only.** Skip if 0–1 player-side bodies, off-axis, or Chebyshev ≠ 3.  
PLAYER_COUNTERPLAY: Fight without a summon; stand off-axis; stand at Chebyshev 2 or 4 on the file  
SYNERGIES: `lane_fold_regent` identity; Claim Ward does not block this (unit swap, not cell claim)  
BALANCE_RISK: Axis-and-exactly-3 fold is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`. Do not restamp `leap_fold_regent` / `lane_precentor` / `boot_subprior` / `mute_notary`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 17 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…16 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥17 | `spell-tern-stride`, `spell-diag-bite` |
| `rank_lancer` | RARE / G≥17 | `spell-tern-stride` |
| `shadow_lurker` | RARE / G≥17 | `spell-diag-bite` |
| `glass_sniper` | RARE / G≥17 | `spell-octa-oath` |
| `glass_sniper` | ELITE | `spell-watch-tax` |
| `pale_cantor` | RARE / G≥17 | `spell-octa-oath` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-gait-gift` (healer CORE only) |
| `tide_shade` | RARE / G≥17 | `spell-mire-reel`, `spell-slide-skip` |
| `plague_rat` | RARE / G≥17 | `spell-slide-skip` |
| `plague_rat` | ELITE | `spell-lava-cut` |
| `rime_mason` | RARE / G≥17 | `spell-mire-reel`, `spell-brick-tax` |
| `glyph_sower` | RARE / G≥17 | `spell-summon-mark` |
| `glyph_sower` | ELITE | `spell-lava-cut` |
| `bone_scribe` | RARE / G≥17 | `spell-summon-mark`, `spell-thin-gait` |
| `purse_scribe` | RARE / G≥17 | `spell-thin-gait` |
| `plate_warden` | ADVANCED / G≥17 | `spell-prime-plate`, `spell-capped-sting` |
| `iron_golem` | ADVANCED / G≥17 | `spell-prime-plate`, `spell-capped-sting` |
| `stone_castellan` | RARE / G≥17 | `spell-brick-tax` |
| `brood_chanter` | ELITE | `spell-summon-orth`, `spell-strike-plate` |
| `cadence_thief` | RARE / G≥17 | `spell-cadence-tern` |
| `hex_chorister` | RARE / G≥17 | `spell-cadence-tern` |
| `tax_scribe` | RARE / G≥17 | `spell-odd-toll` |
| `ley_tollkeeper` | RARE / G≥17 | `spell-odd-toll` |
| `hood_lurker` | ELITE | `spell-watch-tax` |
| `hoop_precentor` CHAMPION | SIGNATURE | `spell-pack-ring` (`ENEMY_ONLY`; not with Pack Orth / Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit) |
| `lane_fold_regent` | BOSS_ONLY | `spell-lane-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-17 family CORE consumes #962 and #1011

**#1073** is the Wave-17 family sheet: remaining **#962** unique Wave-15 verbs (minus Lean Gift / Summon Plate on non-healer kits; minus Pack Diag / Far Fold) and **#1011** tactical Wave-16 ids (minus Court Snuff; Score Mend healer CORE only) in **CORE**. Unique §11 ids may appear there only as G≥17 extras in a later family pass (Wave 19), not as this document’s CORE and **not** as #899 / #941 / #997 / **#1073** CORE. Do **not** put unique §11 ids in #840 CORE, #899 CORE, #941 CORE, #997 CORE, or **#1073** CORE. Do **not** restamp #941 `ENEMY_ID`s (`poise_mender` … `drift_gifter`). Do **not** restamp #997 `ENEMY_ID`s (`tally_mender` … `shove_gifter`). Do **not** restamp **#1073** `ENEMY_ID`s (`score_mender` … `summon_plater`). Do **not** name unique §11 families after #899, #941, #997, or **#1073** `ENEMY_ID`s.

Stamp, do not clone #962: File Stride, Hexa Oath, Lava Reel, File Bite, Strike Mark, Dry Plate, Shock Skip, Even Sting, Summon Rank, Cadence Rise, Still Toll, Brick Brace, Watch Root, Odd Gait, Spike Cut. Lean Gift stays healer CORE only. Pack Diag stays `ENEMY_ONLY` on `diag_precentor`. Far Fold stays `BOSS_ONLY` on `far_fold_regent`.

Stamp, do not clone #1011: Score Mend (healer CORE only), Cadence Snuff, Hendeca Span (implementation-blocked while summon cap is 2), Duel Turn, Score Hood, Score Sting, Score Step, Score Sill, Score Hold, Score Lend, Score Sip, Score Post, Score Bounce, Must Score, Verse Score. Court Snuff stays `NOT_PLAYER_LEARNABLE` on `court_snuff_regent`. Do **not** CORE Must Score with Score Hold. Do **not** CORE Cadence Snuff with Cadence Cap / Cadence Rise / Cadence Prime / Cadence Floor / Cadence Tern. Do **not** CORE Score Mend with Gait Gift / Prime Gift / Tally Mend / Equal Gift / Poise Mend / Lean Gift / Stave Mend. Do **not** CORE Duel Turn with Purse Turn / Tempo Invert / Bar Cross / Hymn Turn. Do **not** CORE Cadence Tern with Cadence Dock.

**SDE wins** unique leftover collisions: Gait Gift stays leftover AP **≥ 2 AND** leftover MP **= 0**; Cadence Tern stays remaining `n>3` → `3`; Prime Plate stays leftover **1/1** negate. Do **not** mint `spell-score-gift` / `spell-stave-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-quint-mend` / `spell-octa-span` / `spell-twelve-span`. **#1063** owns `spell-dodeca-span` — stamp, do not clone.

### 12.2 Wave-16 unique extras (deferred)

#1017 unique Wave-16 verbs (`spell-ring-stride` … `spell-leap-fold`) stay G≥16 extras until Wave 18 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Orth stays `ENEMY_ONLY` on `lane_precentor`. Leap Fold stays `BOSS_ONLY` on `leap_fold_regent`.

### 12.3 Same-day tactical CORE (Wave 18)

**#1063** opened 00:15 UTC. **Stamp it as Wave 18 family CORE** together with unique Wave-16 §11 (#1017). Do **not** put those ids in Wave-17 family CORE or unique §11. Unique §11 stay this catalog’s until Wave 19. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp. Court Dock never owned. Stave Mend healer CORE only.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 18 forever

Same recipe as Wave 16 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 18 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #890 / #953 / **#1011** / **#1063** extra doors. Do not restamp #906 / #962 / **#1017** rooms. Do not restamp #899 / **#941** / **#997** / **#1073** family ids. Do not restamp #903 / **#951** / **#1004** / **#1080** extra doors. Do not consume #771 primer room ids. Do not consume #826 / #885 / #957 / **#1006** / **#1056** ENC-* ids. Do not consume #949 / **#993** / **#1064** `WF-*`. Do not mint `spell-even-plate` / `spell-score-gift` / `spell-stave-gift` / `spell-eleven-span` / `spell-octa-span` / `spell-twelve-span` / `spell-quint-mend`. Stamp **#1063** `spell-dodeca-span`; do not clone it.

Suggested Wave-18 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-16 §11 verbs **and** **#1063** (this catalog’s unique ids stay extras until Wave 19). Invert leftover AP↔MP on **ally** is **Wave 3 Tempo Invert**. Hostile invert is **#953 Purse Turn**. Two-hostile invert is **#1011 Duel Turn**. Two-ally invert (caster stays) is **#1063 Hymn Turn**. Two-body leftover cross is **#890 Bar Cross**. Eight-cell occupy is **#849 Oct Span**. Nine-cell occupy is **#890 Nine Span**. Ten-cell occupy is **#953 Dec Span**. Eleven-cell occupy is **#1011 Hendeca Span**. Twelve-cell occupy is **#1063 Dodeca Span**. Both-body leftover sum===4 unequal heal is **#1011 Score Mend**. Both-body leftover sum===5 heal is **#1063 Stave Mend**. Remaining `1→0` is **#1011 Cadence Snuff**. Remaining `2→0` is **#1063 Cadence Dock**. Remaining `n>2`→`2` is **#1017 Cadence Cap**. Remaining `n>3`→`3` is this wave’s Cadence Tern. Same-file next walk is #962 File Stride. Chebyshev-2-not-knight next walk is #1017 Ring Stride. Chebyshev-3 orthogonal next walk is this wave’s Tern Stride. Rank Fold stays `BOSS_ONLY` on `rank_fold_regent`. Far Fold stays `BOSS_ONLY` on `far_fold_regent`. Leap Fold stays `BOSS_ONLY` on `leap_fold_regent`. Lane Fold stays `BOSS_ONLY` on `lane_fold_regent`. Court Snuff stays kit-only on `court_snuff_regent`. Court Dock stays kit-only on `court_dock_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / #802 / #808 / #837 / #849 / #836 / #890 / #899 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** / **#1017** / **#1063** / **#1073** / **#1078** / **#1080** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W17-A. G≥17 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W17-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W17-C. Wave-17 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #962 / #1011 / #1017 / **#1063** ids |
| W17-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub |
| W17-E. No new feat/challenge/boss stamps | — | Doka formula; `unstoppable`; leftover `survivor` |
| W17-F. Painted mire / conveyor occupancy | Mire Sheet / Slide Tile tables | `map.portals`; new `HazardTileType` |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll.

Watch Tax must not add an evasion roll to `dealDamage`. Lava Cut must not edit RES/SR/CHC math. Octa Oath must not clone Oct Span.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 16 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W17-1 | Encounter start | Possessed-but-unused G17 id does not observe |
| W17-2 | Tern Stride dest diagonal, knight, or Chebyshev ≠ 3 | Confirm fails; MP not spent; Tern Stride already observed |
| W17-3 | `tern_gallery` defeat | Does not grant. Victory grants once |
| W17-4 | `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `even_gallery` / `pair_gallery` / `knight_gallery` | Do not grant Tern Stride |
| W17-5 | Octa Oath then Frost at Chebyshev 6, 7, or 9 | Confirm fails; Strike still legal |
| W17-6 | Mire Reel no painted mire | Fizzle observes; no pull. Dest is not `map.portals`, not live lava/ice/spikes |
| W17-7 | Diag Bite on-rank or on-file only | 10 only. Axis Bite would want rank **or** file. File Bite would want shared **x**. Rank Bite would want shared **y** |
| W17-8 | Summon Mark Strike-from / walk-enter / teleport landing / last-AP | No detonate. Strike Mark would detonate on Strike. Ingress would detonate on walk. Swap Mark would detonate on teleport. Last Mark would detonate on last AP |
| W17-9 | Prime Plate hit while leftover not 1/1 | Full hit; charge remains. Hit while leftover 1/1 consumes. Dual Plate would want both leftovers even ≥ 2. Dry Plate would want leftover MP = 0 |
| W17-10 | Slide Skip across lava / spikes / ice leave-tax / glyph-tax / Void Rift / length 2 | Those taxes still tick. Skip is conveyor auto-push + length 1 only |
| W17-11 | Capped Sting leftover MP max-1, leftover AP equals max | 10 only. Fresh Sting would bonus leftover AP equals max |
| W17-12 | Summon Orth vs Summon File vs Summon Rank vs Summon Toll vs Pack Orth | Pets pay AP to **walk diagonal** vs **off file** vs **off rank** vs **any walk** vs pack **orthogonal lock** |
| W17-13 | Gait Gift after leftover 1/1 or 0/≥1 or 2/2 | Fizzle observes; no heal. Prime Gift would want 1/1. Lean Gift would want AP=0/MP≥1. Equal Gift would want AP==MP ≥ 1. Score Mend would want both-body sum === 4 unequal. Stave Mend would want both-body sum === 5 |
| W17-14 | Cadence Tern vs Cap vs Floor vs Rise vs Prime vs Stall vs Snuff vs Dock | Remaining `n>3` → 3 vs `n>2` → 2 vs `n>1` → 1 vs `n==1` → 2 vs `n==0` → 1 vs +1 **all** vs `n===1` → 0 vs `n===2` → 0 |
| W17-15 | Odd Toll while leftover AP even | Fizzle observes. Gait Toll would tax a walk if leftover **MP = 0**. Still Toll would tax a **spell** |
| W17-16 | Brick Tax with no adjacent barrier | Fizzle observes; walks untaxed. Brick Hold would forbid the walk. Brick Brace would negate a hit |
| W17-17 | Watch Tax vs Drain vs Root vs Sip vs Bank vs Far Watch | Snap taxes next **spell** +1 AP vs steals leftover **MP** vs zeros leftover **MP** vs steals AP vs banks AP vs deals damage |
| W17-18 | Thin Gait leftover 1/1, 2/0, or 0/1 | 10 only. Prime Gift / Prime Plate would want 1/1. Gait Gift would heal 2/0. Lean Gift would want 0/≥1. Odd Gait would bonus leftover MP odd |
| W17-19 | Lava Cut far from lava / on a Twin Gate pad / next to ice only | 10 only. Rime Cut would want ice occupancy. Spike Cut would want spike occupancy. Hazard Cut would want painted hazard. Portal Cut would want `map.portals`. Lava Reel would pull |
| W17-20 | Strike Plate then Frost / then Strike | Frost deals full; Strike deals 0. Cast Plate would zero Frost and leave Strike full |
| W17-21 | Pack Ring / Lane Fold | Never in `ownedSpellIds` |
| W17-22 | Loaner / `WF-SPL-*` / #771 primer / #826 / #885 / #957 / #1006 / **#1056** ENC-* / **#1064** WF-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W17-23 | G=16 Tide | No Tern Stride / Odd Toll (`generationMin: 17`) |
| W17-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W17-25 | No cloned ids | Unique §11 ids absent from #906 / #953 / #962 / **#1011** / **#1017** / **#1063** catalogs |
| W17-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Odd Toll / Summon Orth / Pack Ring / Watch Tax / Brick Tax are flags |
| W17-27 | Hex Toll | Still not in any SDE pool |
| W17-28 | Memory Wave-5 / Wave-16 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W17-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W17-30 | #890 extra doors | `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` not restamped |
| W17-30b | #906 rooms / doors | `rank_gallery` / `rank_precentor` / `rank_fold_regent` / `mire_nave` not restamped |
| W17-30c | #899 family ids | Unique §11 not CORE on `gaunt_mender` … `axis_cutter`. `hoop_precentor` / `lane_fold_regent` not #899 ids |
| W17-30d | #903 extra doors | `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` not restamped |
| W17-30e | #962 rooms / doors | `file_gallery` / `diag_precentor` / `far_fold_regent` not restamped |
| W17-30f | #941 family ids | Unique §11 not CORE on `poise_mender` … `drift_gifter`. `tern_gallery` is not `knight_gallery`. `hoop_precentor` is not `axis_biter` |
| W17-30g | #951 extra doors | `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` not restamped. `lane_fold_regent` is not those ids |
| W17-30h | #953 tactical ids | Unique §11 does not clone Tally Mend / Cadence Prime / Dec Span / Purse Turn. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` not restamped |
| W17-30i | #957 ENC-* | `ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` not consumed as spell grants |
| W17-30j | #997 family ids | Unique §11 not CORE on `tally_mender` … `shove_gifter`. `hoop_precentor` is not `rank_warder`. `lane_fold_regent` is not `dec_prelate` |
| W17-30k | #1004 extra doors | `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` not restamped |
| W17-30r | #1080 extra doors | `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` not restamped. `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` never owned. `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` not remapped. Unique §11 does not clone Pair Slide / Both Mend / Heave Mend / Parched Mend |
| W17-30s | #1078 SDA files | `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` not overwritten. SDA-175…189 not re-filed |
| W17-30l | #1006 ENC-* | `ENC-GAUNT-01` / `ENC-EVEN-02` / `ENC-TRI-01` / `ENC-DUMP-01` not consumed as spell grants |
| W17-30m | #1011 tactical ids | Unique §11 does not clone Score Mend / Cadence Snuff / Hendeca Span / Duel Turn. Cadence Tern is `n>3` → 3, not `1→0`. Gait Gift is AP≥2/MP=0, not both-body sum===4. Prime Plate is leftover 1/1, not Score Hood. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` not restamped |
| W17-30n | #1017 rooms / doors | `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent` not restamped. Unique §11 does not clone Ring Stride / Cadence Cap / Pack Orth / Leap Fold |
| W17-30o | #1063 tactical ids | Unique §11 does not clone Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn. Cadence Tern is `n>3` → 3, not `2→0`. Gait Gift is AP≥2/MP=0, not both-body sum===5. Prime Plate is leftover 1/1, not Stave Hood. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` not restamped |
| W17-30p | #1073 family ids | Unique §11 not CORE on `score_mender` … `summon_plater`. `hoop_precentor` is not `file_warder`. `lane_fold_regent` is not `hendeca_prelate` |
| W17-30q | #1056 ENC-* | `ENC-TEACH-17` / `ENC-SPELL-33` / `ENC-POISE-01` / `ENC-TIED-01` / `ENC-KNIGHT-01` / `ENC-PIT-02` / `ENC-WAVE-18` not consumed as spell grants |
| W17-31 | `spell-even-plate` / `spell-octa-span` / `spell-twelve-span` | Still tombstoned. Prime Plate is the 1/1 negate, not `even-plate`. Octa Oath is the exact-8 spell gate, not occupy-weight 8. Dodeca Span (#1063) owns twelve occupy |
| W17-32 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–16, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, **#962**, **#1011**, **#1017**, or **#1063** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** / **#1080** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / #679 / #695 / #726 / #747 / #753 / #787 / #802 / #808 / #836 / #837 / #849 / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** / **#1017** / **#1063** / **#1073** / **#1078** / **#1080** extra doors or family ids
- Consuming #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` as spell grants
- Consuming #826 / #885 / **#957** / **#1006** / **#1056** ENC-* as spell grants
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `diag_gallery` / `knight_gallery` / `even_gallery` / `odd_gallery` / `rime_gallery` / `void_aisle` / `penta_nave` / `hexa_nave` / `hepta_nave` / `span_six` / `span_dec` / `span_hendeca` / `mire_nave` / `frost_aisle` / `strike_pulpit` as Tern Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #752 CORE, #796 CORE, #840 CORE, #899 CORE, #941 CORE, **#997 CORE**, **#1073 CORE**, Wave-16 #1017 extras CORE, or **#1063** Wave-18 family CORE before Wave 19
- Cloning #906 (`spell-rank-stride` … `spell-rank-fold`), #953 (`spell-tally-mend` … `spell-court-prime`), **#962** (`spell-file-stride` … `spell-far-fold`), **#1011** (`spell-score-mend` … `spell-court-snuff`), **#1017** (`spell-ring-stride` … `spell-leap-fold`), or **#1063** (`spell-stave-mend` … `spell-court-dock`) into unique §11
- Minting `spell-nona-span` / `spell-octa-span` / `spell-even-plate` / `spell-gaunt-floor` / `spell-hollow-mend` / `spell-cadence-trade` / `spell-parched-mend` / `spell-tempo-mirror` / `spell-tied-mend` / `spell-equal-mend` / `spell-tempo-cross` / `spell-walk-debt` / `spell-pack-far` / `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm` / `spell-ash-skip` / `spell-score-gift` / `spell-stave-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-quint-mend` / `spell-twelve-span` / `spell-dump-gift`. Stamp **#1063** `spell-dodeca-span`; do not clone it
- Shipping `spell-parched-mend` alongside Dry Gait
- Shipping a second `spell-cadence-floor` from #890
- Cloning Ring Stride as Tern Stride, Orth Stride as Tern Stride, File Bite as Diag Bite, Rank Bite as Diag Bite, Mire Skip as Slide Skip, Rift Skip as Slide Skip, Pack Orth as Pack Ring, Cadence Cap as Cadence Tern, Cadence Snuff as Cadence Tern, Cadence Dock as Cadence Tern, Prime Gift as Gait Gift, Score Mend as Gait Gift, Stave Mend as Gait Gift, Fresh Sting as Capped Sting, Cast Plate as Strike Plate, Rime Cut as Lava Cut, or Leap Fold as Lane Fold

---

## 17. Wave-17 index

**Unique SDE ids (19):** tern-stride, octa-oath, mire-reel, diag-bite, summon-mark, prime-plate, slide-skip, capped-sting, summon-orth, gait-gift, cadence-tern, odd-toll, brick-tax, watch-tax, thin-gait, lava-cut, strike-plate, pack-ring, lane-fold.

**#962 stamps (do not clone; Wave-17 family CORE):** File Stride, Hexa Oath, Lava Reel, File Bite, Strike Mark, Dry Plate, Shock Skip, Even Sting, Summon Rank, Lean Gift, Cadence Rise, Still Toll, Brick Brace, Watch Root, Odd Gait, Spike Cut, Summon Plate, Pack Diag, Far Fold.

**#1011 stamps (do not clone; Wave-17 family CORE):** Score Mend, Cadence Snuff, Hendeca Span, Duel Turn, Score Hood, Score Sting, Score Step, Score Sill, Score Hold, Score Lend, Score Sip, Score Post, Score Bounce, Must Score, Verse Score, Court Snuff. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`.

**#1017 stamps (do not clone; Wave-18 extras):** Ring Stride, Hepta Oath, Rime Reel, Rank Bite, Last Mark, Dual Plate, Rift Skip, Fresh Sting, Summon File, Prime Gift, Cadence Cap, Gait Toll, Brick Hold, Watch Drain, Even Gait, Rime Cut, Cast Plate, Pack Orth, Leap Fold.

**#1063 stamps (do not clone; Wave-18 family CORE):** Stave Mend, Cadence Dock, Dodeca Span, Hymn Turn, Stave Hood, Stave Sting, Stave Step, Stave Sill, Stave Hold, Stave Lend, Stave Sip, Stave Post, Stave Bounce, Must Stave, Verse Stave, Court Dock. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`.

**#899 Wave-14 families (do not clone / do not CORE unique §11):** `gaunt_mender` … `axis_cutter` (31 sheets).

**#941 Wave-15 families (do not clone / do not CORE unique §11):** `poise_mender`, `nine_prelate`, `bar_crosser`, `poise_hooder`, `poise_stinger`, `poise_stepper`, `poise_siller`, `poise_holder`, `poise_lender`, `poise_sipper`, `poise_prelate`, `poise_bouncer`, `must_poiser`, `verse_poiser`, `knight_warder`, `quad_oather`, `pit_reeler`, `axis_biter`, `shove_marker`, `spent_plater`, `rime_skipper`, `full_stinger`, `summon_caster`, `hollow_gifter`, `cadence_swapper`, `strike_debter`, `brick_nudger`, `watch_sipper`, `lone_gaiter`, `hazard_cutter`, `drift_gifter`.

**#997 Wave-16 families (do not clone / do not CORE unique §11):** `tally_mender`, `cadence_primer`, `dec_prelate`, `purse_turner`, `tally_hooder`, `tally_stinger`, `tally_stepper`, `tally_siller`, `tally_holder`, `tally_lender`, `tally_sipper`, `tally_prelate`, `tally_bouncer`, `must_tallier`, `verse_tallier`, `rank_warder`, `penta_oather`, `spike_reeler`, `screen_biter`, `swap_marker`, `odd_plater`, `mire_skipper`, `odd_stinger`, `summon_verser`, `equal_gifter`, `cast_toller`, `brick_stepper`, `watch_banker`, `tied_gaiter`, `portal_cutter`, `shove_gifter`.

**#1073 Wave-17 families (do not clone / do not CORE unique §11):** `score_mender`, `cadence_snuffer`, `hendeca_prelate`, `duel_turner`, `score_hooder`, `score_stinger`, `score_stepper`, `score_siller`, `score_holder`, `score_lender`, `score_sipper`, `score_prelate`, `score_bouncer`, `must_scorer`, `verse_scorer`, `file_warder`, `hexa_oather`, `lava_reeler`, `file_biter`, `strike_marker`, `dry_plater`, `shock_skipper`, `even_stinger`, `summon_ranker`, `lean_gifter`, `cadence_riser`, `still_toller`, `brick_bracer`, `watch_rooter`, `odd_gaiter`, `spike_cutter`, `summon_plater`.

**#951 Wave-16 extra doors (do not restamp):** `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`.

**#1004 Wave-17 extra doors (do not restamp):** `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`.

**#1080 Wave-18 extra doors (do not restamp):** `slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`. Leftover Pair Slide / Both Mend / Heave Mend / Parched Mend. Spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal. No new `#137` ids.

**#1078 SDA 2026-10-25 (do not overwrite):** `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` (`SDA-2026-10-25-175`…`189`).

**#953 extra doors (do not restamp):** `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`.

**#1011 extra doors (do not restamp):** `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`.

**#1063 extra doors (do not restamp):** `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`.

**#1017 rooms / doors (do not restamp):** `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `lane_precentor`, `leap_fold_regent`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-tern-stride` | ENEMY_DISCOVERY | yes | blink / rank_lancer G≥17 | **One** next walk Chebyshev exactly 3, orthogonal only |
| `spell-octa-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 8 |
| `spell-mire-reel` | ENEMY_DISCOVERY | yes | tide / rime | Pull 1 toward nearest painted mire occupancy |
| `spell-diag-bite` | ENEMY_DISCOVERY | yes | blink / lurker | Bonus if share a **diagonal** |
| `spell-summon-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates when a summon is **spawned onto** it |
| `spell-prime-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit is 0 while leftover **1/1** |
| `spell-slide-skip` | ENEMY_DISCOVERY | yes | tide / plague | 1-tile walk ignores conveyor auto-push |
| `spell-capped-sting` | ENEMY_DISCOVERY | yes | plate / golem | Leftover MP **equals max MP** → bonus damage |
| `spell-summon-orth` | ELITE | yes | brood_chanter | Allied summons pay +1 AP to walk diagonal |
| `spell-gait-gift` | ELITE | yes | pale / font cantor | Heal iff leftover AP ≥ 2 **and** leftover MP = 0 |
| `spell-cadence-tern` | ENEMY_DISCOVERY | yes | cadence / hex | Remaining `n>3` → 3; 0/1/2/3 stay |
| `spell-odd-toll` | ENEMY_DISCOVERY | yes | tax / ley | Next walk +1 AP if leftover **AP is odd** |
| `spell-brick-tax` | ENEMY_DISCOVERY | yes | stone / rime | Next walk +1 AP while adjacent to a barrier |
| `spell-watch-tax` | ELITE | yes | glass / hood | Overwatch snap taxes the walker’s next spell +1 AP |
| `spell-thin-gait` | ENEMY_DISCOVERY | yes | purse / scribe | Bonus if leftover AP **=== 1 AND** leftover MP **=== 0** |
| `spell-lava-cut` | ELITE | yes | glyph / plague | Bonus if target is Chebyshev ≤ 2 from lava occupancy |
| `spell-strike-plate` | ELITE | yes | brood_chanter | Target’s next Strike deals 0 |
| `spell-pack-ring` | ENEMY_ONLY | no | `hoop_precentor` CHAMPION | Pack walks locked to Chebyshev 2, knight excluded |
| `spell-lane-fold` | BOSS_ONLY | no | `lane_fold_regent` | Swap two player-side bodies that share an axis at Chebyshev 3 |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-16 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #962 / #1011 / #1017 / **#1063** / **#1073** so File Stride / Score Mend / Ring Stride / Stave Mend land once. Not a license to land combat code in the same change as this spec.
