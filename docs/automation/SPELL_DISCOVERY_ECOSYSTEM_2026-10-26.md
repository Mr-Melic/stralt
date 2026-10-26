# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 18

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-26  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Waves 3–17 are Generations 3–17. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Waves 6–17 are still-open #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 / #906 / #962 / #1017 / **#1082**. This document is **Generation 18**. `generationMin: 18`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

**Gap note.** The last SDE wave PR is **#1082** (2026-10-25). This pass does **not** skip generations and does **not** mint Waves 19–36. It is the next sequential generation.

**CDA freeze vs this catalog.** Still-open **#942** `CDA-2026-10-23-029` and **#982** `CDA-2026-10-24-030` freeze **shipping** Wave-15/16 live catalog rows until Wave-1 ownership / observe / G resolve exist. This document is sequential Generation 18 **design only** (`STATUS: PROPOSED`). It does not append ids to `starterSpells`, does not implement combat, and is **not** Wave 19.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-26.md`](./ACTION_IDS_SDE_2026-10-26.md).

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
| Wave-15 discovery contract | still-open **#962** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-23.md` | G≥15 extra slot, W15 unique ids |
| Wave-16 discovery contract | still-open **#1017** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-24.md` | G≥16 extra slot, W16 unique ids. **Stamp onto Wave-18 family CORE, do not clone** |
| Wave-17 discovery contract | still-open **#1082** — `SPELL_DISCOVERY_ECOSYSTEM_2026-10-25.md` | G≥17 extra slot, W17 unique ids, #962 / #1011 / #1063 stamps. Unique §11 stay extras until Wave 19 |
| Wave-1…17 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-10-25.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 / #677 / #729 / #791 / #815 / #892 / **#940** / **#1007** / **#1078** | `ownedSpellIds` / `observedSpellIds`, soft-retire. **#1078** owns SDA-2026-10-25-175…189 (unique dated files — do not overwrite). **#870** / **#946** / **#998** / **#1074** are Master Technical Director roadmaps — **not** tactical catalogs |
| Tactical gap-fillers W1…W16 | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 | Reserved in §0.1 |
| Tactical gap-fillers W17 | still-open **#1063** — `SPELL_PROPOSALS_2026-10-25.md` | Stave Mend … Court Dock. **Stamp as Wave 18 family CORE, do not clone**. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp. Stave Mend is both-body leftover **sum === 5**. Cadence Dock is remaining `2→0`. Dodeca Span is twelve-cell occupy (3×4). Hymn Turn is two-ally independent invert (caster stays). Court Dock never owned. **SDE wins** unique §11 (Wide Gift stays AP≥2/MP≥1, not Stave Mend; Cadence Quad stays `n>4→4`, not Cadence Dock; Thin Plate stays leftover 1/0, not Stave Hood). Do **not** mint `spell-stave-gift` / `spell-twelve-span` / `spell-choir-turn` / `spell-court-drop` |
| Tactical gap-fillers W18 | still-open **#1132** — `SPELL_PROPOSALS_2026-10-26.md` | Sestet Mend … Court Tierce. **Stamp as Wave 19 family CORE, do not clone**. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` — do not restamp. Sestet Mend is both-body leftover **sum === 6 AND unequal**. Cadence Tierce is remaining `3→0`. Trideca Span is thirteen-cell occupy (plus arm 3). Psalm Turn is mixed-side leftover invert (one same-side non-caster + one opposite-side; caster stays). Court Tierce never owned. **SDE wins** unique §11 (Wide Gift stays one-body AP≥2/MP≥1, not Sestet Mend; Cadence Quad stays `n>4→4`, not Cadence Tierce; Thin Plate stays leftover 1/0, not Sestet Hood). Do **not** mint `spell-sestet-gift` / `spell-thirteen-span` / `spell-choir-turn` / `spell-mixed-turn` / `spell-cadence-trey` |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + #625 + #686 + #752 + #796 + #840 + #899 + #941 + **#997** + **#1073** + **#1138** | **#997** Wave-16 families consume unique **#906** Wave-14 verbs **and** **#953**. **#1073** Wave-17 families consume unique **#962** Wave-15 verbs **and** **#1011** (`score_mender` … `summon_plater`). **#1138** Wave-18 families consume unique **#1017** Wave-16 verbs **and** **#1063** (`stave_mender` … `cast_plater`). Unique Wave-17 §11 stay extras until Wave 19. Unique §11 stay extras until Wave 20. Do **not** put unique §11 ids in #899 / #941 / #997 / **#1073** / **#1138** CORE. Do **not** restamp #997 / **#1073** / **#1138** `ENEMY_ID`s |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 + #951 + **#1004** + **#1080** + **#1139** | #951 Wave-16 extra doors `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. **#1004** Wave-17 extra doors `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` — do not restamp. **#1080** Wave-18 extra doors `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` (leftover Pair Slide / Both Mend / Heave Mend / Parched Mend; spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`; do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`) — do not restamp. **#1139** Wave-19 extra doors `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost` (leftover Stride Keep / Dual Keep / Cadence Imprint / Damp Sting; spectacular `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`; do not remap `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar`; Rush Table Q) — do not restamp. No new `#137` ids. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal |
| Same-day world dynamics | still-open **#949** / **#993** / **#1064** / **#1114** | `WF-*` Wave-15 / Wave-16 / Wave-17 / Wave-18 overlays. **#1114** Wave-18 ids: `WF-HAZ-PAIR_SEAM` / `WF-HAZ-BUSY_CINDER` / `WF-TRP-SKEW_PLATE` / `WF-TER-BRACE_COLUMN` / `WF-OBS-READY_SILL` / `WF-ZON-PAIR_FONT` / `WF-TEL-SKEW_STEP` / `WF-PRT-READY_GATE` / `WF-INV-READY_FILE` / `WF-ELT-READY_PICKET` / `WF-TRS-ROUND_CACHE` / `WF-SPL-READY_TUTOR` / `WF-RSK-PAIR_OATH` / `WF-MOD-ONCE_CAST` / `WF-EVT-READY_HOUR` / `WF-ENV-PAIR_DRAFT`. Not a spell catalog. Do not consume. `WF-SPL-READY_TUTOR` never writes `ownedSpellIds` |
| Same-day spell admin | still-open **#940** / **#1007** / **#1078** / **#1140** | SDA 2026-10-23, 2026-10-24, 2026-10-25 (175–189), and 2026-10-26 (**190–204**). Soft-retire / tooling. Do not re-file those ACTION_IDs. Do not overwrite `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` / `ACTION_IDS_SDA_2026-10-26.md` / `SPELL_ADMIN_DESIGN_2026-10-26.md` |
| Same-day encounter admin | still-open **#932** / **#1015** / **#1050** / **#1128** | Occupancy unseals, persist-keep rails, world/dungeon admin. **#1128** WDEAD-2026-10-26-001…006 ingest Wave-17 overlays / FSN drop 17 / Rush Table P — not a spell catalog. Do not invent Rush Table Q |
| Same-day enemy/boss admin | still-open **#1044** / **#1111** | EBA re-audit. Zero extra doors. Not a spell catalog |
| Same-day content freeze | still-open **#942** / **#982** | `CDA-029` / `CDA-030` freeze **shipping** Wave-15/16 live rows until live gates. This document is sequential **Generation 18 design**, not a ship, and not Wave 19. CDA-031 had **not opened** at this stamp. **#1120** is content-diversity audit, not CDA-031 |
| Same-day encounter primer | #771 — Bash/Dry/Hood catalog | Room ids `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*`. Not a spell catalog. Do not consume |
| Prior-day encounter catalogs | still-open **#826** / **#885** / **#957** / **#1006** / **#1056** | ENC-* tables. Not spell catalogs. Do not consume. `ENC-INCH-01` is Inch Stride, not Hook Stride. `ENC-SPIKE-01` is Spike Skip, not Brier Skip. `ENC-FOLD-01` is a wall fold, not Hook Fold. `ENC-TRI-01` is not Nona Oath. `ENC-KNIGHT-01` is Knight Stride, not Hook Stride. `ENC-POISE-01` is Poise Mend, not Wide Gift. `ENC-PIT-02` is Pit Reel, not Slide Reel |
| Same-day encounter catalog | still-open **#1121** | Tally/Rank/Spike/Odd rooms (`ENC-TEACH-18` / `ENC-HAZ-35` / `ENC-HAZ-36` / `ENC-SPELL-35` / `ENC-SPELL-36` / `ENC-TALLY-01` / `ENC-SUM-01` / `ENC-RANK-01` / `ENC-SPIKE-02` / `ENC-GATE-05` / `ENC-ODD-03` / `ENC-MIRE-01` / `ENC-SNAP-02` / `ENC-EQUAL-01` / `ENC-TURN-01` / `ENC-PEEK-01` / `ENC-HOLD-07` / `ENC-PRIME-01` / `ENC-TIED-02` / `ENC-PORT-01` / `ENC-WAVE-19` / `ENC-AMBUSH-18` / `ENC-REINF-18` / `ENC-SLIT-01` / `ENC-HEFT-01` / `ENC-HALE-01` / `ENC-PAD-01` / `ENC-MUTE-02` / `ENC-SURV-35` / `ENC-SURV-36` / `ENC-PROT-18` / `ENC-PRIO-20` / `ENC-HALE-02` / `ENC-QUIET-02` / `ENC-DEBT-03` / `ENC-ELITE-34` / `ENC-ELITE-35` / `ENC-RARE-18` / `ENC-TREAS-18` / `ENC-HOUR-02` / `ENC-REST-18` / `ENC-BRANCH-18` / `ENC-MINI-19` / `ENC-BOSS-18` / `ENC-MAST-18` / `ENC-RUSH-67`…`70`). Teaches **#997** Wave-16 family verbs, not unique §11. Do not consume as spell grants. `ENC-RANK-01` is Rank Stride + Penta Oath, not Hook Stride / Nona Oath. `ENC-SPIKE-02` is Spike Reel, not Slide Reel / Brier Skip. `ENC-MIRE-01` is Mire Skip, not Brier Skip |
| Same-day roadmap | still-open **#998** / **#1074** / **#1124** | Master Technical Director 2026-10-24 / 2026-10-25 / 2026-10-26 — **not** tactical catalogs |
| Same-day expansion / VAL / AFDA / AEE / formations | still-open **#1052** / **#1051** / **#1055** / **#1072** / **#1112** / **#1110** / **#1130** / **#1131** / **#1134** / **#1135** | Expansion Director / renderer fact sheet / admin drift / enemy AI increment / mechanic matrix / Wave-17 FSN drop 18 (`FSN-SCORE-STEP` … `FSN-SCORE-HOLD`). Not spell catalogs. **#1112** mints no new `EXPANSION_ID` |
| PX coherence | #343 / #393 / #481 / #579 / #632 / #744 / #784 / #844 / #907 / #955 / **#1008** / **#1067** | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-18 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

**#1073** remains the Wave-17 family sheet (consumes **#962 + #1011**, not unique §11; `score_mender` … `summon_plater` — do not restamp). **#1138** is the Wave-18 family sheet (consumes **#1017 + #1063**, not unique §11; `stave_mender` … `cast_plater` — do not restamp). **#1004** remains Wave-17 boss extra doors. **#1080** is Wave-18 extra doors (`slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`) — do not restamp. **#1139** is Wave-19 extra doors (`stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`) — do not restamp. **#1078** owns SDA-2026-10-25-175…189 — do not overwrite those files. **#1140** owns SDA-2026-10-26-190…204 — do not overwrite those files. **#1056** remains prior-day ENC-* rooms. **#1063** remains the Wave-17 tactical catalog — **stamp it as Wave 18 family CORE**. **#1132** is the Wave-18 tactical catalog — **stamp it as Wave 19 family CORE**. **#1017** remains Wave-16 unique SDE — unique Wave-16 §11 consume as this wave’s CORE together with **#1063**. Unique Wave-17 §11 stay extras until Wave **19**. Unique §11 stay extras until Wave **20**. **SDE wins** unique leftover collisions (Wide Gift stays leftover AP **≥ 2 AND** leftover MP **≥ 1**, not Score Mend / Stave Mend / Sestet Mend / Gait Gift; Cadence Quad stays remaining `n>4` → `4`, not Cadence Tern / Cadence Cap / Cadence Dock / Cadence Tierce; Thin Plate stays leftover **1/0** negate, not Prime Plate / Dual Plate / Stave Hood / Sestet Hood).

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

**#1011 tactical Wave 16:** `spell-score-mend`, `spell-cadence-snuff`, `spell-hendeca-span`, `spell-duel-turn`, `spell-score-hood`, `spell-score-sting`, `spell-score-step`, `spell-score-sill`, `spell-score-hold`, `spell-score-lend`, `spell-score-sip`, `spell-score-post`, `spell-score-bounce`, `spell-must-score`, `spell-verse-score`, `spell-court-snuff`. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` — do not restamp.

**Wave 16 SDE (#1017) — stamp as Wave 18 family CORE, do not clone:** `spell-ring-stride`, `spell-hepta-oath`, `spell-rime-reel`, `spell-rank-bite`, `spell-last-mark`, `spell-dual-plate`, `spell-rift-skip`, `spell-fresh-sting`, `spell-summon-file`, `spell-prime-gift`, `spell-cadence-cap`, `spell-gait-toll`, `spell-brick-hold`, `spell-watch-drain`, `spell-even-gait`, `spell-rime-cut`, `spell-cast-plate`, `spell-pack-orth`, `spell-leap-fold`.

**#1063 tactical Wave 17 — stamp as Wave 18 family CORE, do not clone:** `spell-stave-mend`, `spell-cadence-dock`, `spell-dodeca-span`, `spell-hymn-turn`, `spell-stave-hood`, `spell-stave-sting`, `spell-stave-step`, `spell-stave-sill`, `spell-stave-hold`, `spell-stave-lend`, `spell-stave-sip`, `spell-stave-post`, `spell-stave-bounce`, `spell-must-stave`, `spell-verse-stave`, `spell-court-dock`. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp.

**Wave 17 SDE (#1082):** `spell-tern-stride`, `spell-octa-oath`, `spell-mire-reel`, `spell-diag-bite`, `spell-summon-mark`, `spell-prime-plate`, `spell-slide-skip`, `spell-capped-sting`, `spell-summon-orth`, `spell-gait-gift`, `spell-cadence-tern`, `spell-odd-toll`, `spell-brick-tax`, `spell-watch-tax`, `spell-thin-gait`, `spell-lava-cut`, `spell-strike-plate`, `spell-pack-ring`, `spell-lane-fold`.

**#1132 tactical Wave 18 — stamp as Wave 19 family CORE, do not clone:** `spell-sestet-mend`, `spell-cadence-tierce`, `spell-trideca-span`, `spell-psalm-turn`, `spell-sestet-hood`, `spell-sestet-sting`, `spell-sestet-step`, `spell-sestet-sill`, `spell-sestet-hold`, `spell-sestet-lend`, `spell-sestet-sip`, `spell-sestet-post`, `spell-sestet-bounce`, `spell-must-sestet`, `spell-verse-sestet`, `spell-court-tierce`. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` — do not restamp.

**Do not alias** `spell-hook-stride` ↔ `spell-tern-stride` / `spell-knight-stride` / `spell-ring-stride` / `spell-rank-stride` / `spell-file-stride` / `spell-pair-stride` / `spell-inch-stride` / `spell-orth-stride` / `spell-diag-stride` / `spell-hook-line` / `spell-must-span` / `spell-long-oath`, `spell-nona-oath` ↔ `spell-octa-oath` / `spell-hepta-oath` / `spell-hexa-oath` / `spell-penta-oath` / `spell-nona-span` / `spell-nine-span` / `spell-long-oath` / `spell-far-hood`, `spell-slide-reel` ↔ `spell-mire-reel` / `spell-lava-reel` / `spell-rime-reel` / `spell-spike-reel` / `spell-pit-reel` / `spell-void-reel` / `spell-brick-reel` / `spell-file-reel` / `spell-slide-tile` / `spell-slide-skip` / `spell-hook-line`, `spell-hook-bite` ↔ `spell-diag-bite` / `spell-file-bite` / `spell-rank-bite` / `spell-axis-bite` / `spell-screen-bite` / `spell-file-lance` / `spell-knight-pierce` / `spell-rear-cut`, `spell-idle-mark` ↔ `spell-dwell-mark` / `spell-wake-mark` / `spell-last-mark` / `spell-stride-mark` / `spell-summon-mark` / `spell-strike-mark` / `spell-cast-mark` / `spell-body-mark`, `spell-thin-plate` ↔ `spell-prime-plate` / `spell-dual-plate` / `spell-dry-plate` / `spell-odd-plate` / `spell-even-plate` / `spell-thin-gait` / `spell-thin-ward` / `spell-stave-hood`, `spell-brier-skip` ↔ `spell-slide-skip` / `spell-shock-skip` / `spell-spike-skip` / `spell-rime-skip` / `spell-glyph-skip` / `spell-rift-skip` / `spell-mire-skip` / `spell-gap-ward` / `spell-lava-skip`, `spell-wide-sting` ↔ `spell-thin-gait` / `spell-capped-sting` / `spell-fresh-sting` / `spell-even-sting` / `spell-odd-sting` / `spell-gaunt-sting` / `spell-dry-sting` / `spell-stave-sting` / `spell-wide-gift`, `spell-summon-hook` ↔ `spell-summon-orth` / `spell-summon-file` / `spell-summon-rank` / `spell-summon-toll` / `spell-pack-hook` / `spell-pack-ring` / `spell-hook-stride`, `spell-wide-gift` ↔ `spell-gait-gift` / `spell-lean-gift` / `spell-equal-gift` / `spell-prime-gift` / `spell-tally-mend` / `spell-score-mend` / `spell-stave-mend` / `spell-hollow-gift` / `spell-poise-mend` / `spell-gait-mend`, `spell-cadence-quad` ↔ `spell-cadence-tern` / `spell-cadence-cap` / `spell-cadence-floor` / `spell-cadence-rise` / `spell-cadence-prime` / `spell-cadence-snuff` / `spell-cadence-dock` / `spell-cadence-stall` / `spell-quad-oath` / `spell-quad-span`, `spell-even-toll` ↔ `spell-odd-toll` / `spell-gait-toll` / `spell-still-toll` / `spell-walk-toll` / `spell-gait-tax` / `spell-strike-debt` / `spell-cast-toll` / `spell-even-stride` / `spell-even-gait`, `spell-brick-fee` ↔ `spell-brick-tax` / `spell-brick-hold` / `spell-brick-brace` / `spell-brick-step` / `spell-camp-tax` / `spell-crowd-tax` / `spell-act-tax`, `spell-watch-bind` ↔ `spell-watch-tax` / `spell-watch-drain` / `spell-watch-root` / `spell-watch-sip` / `spell-watch-bank` / `spell-watch-mute` / `spell-quiet-hex`, `spell-prime-gait` ↔ `spell-thin-gait` / `spell-even-gait` / `spell-odd-gait` / `spell-lone-gait` / `spell-pair-gait` / `spell-full-gait` / `spell-tied-gait` / `spell-prime-gift` / `spell-prime-plate`, `spell-slide-cut` ↔ `spell-lava-cut` / `spell-spike-cut` / `spell-hazard-cut` / `spell-portal-cut` / `spell-rime-cut` / `spell-slide-reel` / `spell-slide-skip`, `spell-idle-plate` ↔ `spell-cast-plate` / `spell-summon-plate` / `spell-strike-plate` / `spell-still-plate` / `spell-capped-sting` / `spell-idle-mark`, `spell-pack-hook` ↔ `spell-pack-ring` / `spell-pack-orth` / `spell-pack-diag` / `spell-pack-file` / `spell-pack-rank` / `spell-hook-stride` / `spell-rank-lock`, `spell-hook-fold` ↔ `spell-lane-fold` / `spell-leap-fold` / `spell-far-fold` / `spell-reach-fold` / `spell-adj-fold` / `spell-rank-fold` / `spell-file-fold` / `spell-diag-fold` / `spell-mid-fold` / `spell-knight-fold`. Those are sibling-owned fantasies.

**Also do not alias** `spell-wide-gift` ↔ `spell-stave-mend` / `spell-stave-gift` / `spell-sestet-mend` / `spell-sestet-gift`, `spell-cadence-quad` ↔ `spell-cadence-dock` / `spell-cadence-tierce` / `spell-cadence-trey`, `spell-thin-plate` ↔ `spell-stave-hood` / `spell-prime-plate` / `spell-sestet-hood`, `spell-nona-oath` ↔ `spell-dodeca-span` / `spell-nona-span` / `spell-trideca-span` / `spell-thirteen-span`, `spell-hook-fold` ↔ `spell-court-dock` / `spell-court-tierce`, `spell-pack-hook` ↔ `spell-hymn-turn` / `spell-psalm-turn`. Those #1063 ids stamp as Wave **18** family CORE. Those **#1132** ids stamp as Wave **19** family CORE.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools. `spell-even-plate` stays tombstoned as a Dry Plate alias. `spell-nona-span` stays tombstoned as a Nine Span alias — Nona Oath is the exact-9 **spell gate**, not occupy-weight 9. `spell-twelve-span` stays tombstoned as a Dodeca Span alias — **#1063** owns `spell-dodeca-span`. `spell-hook-line` stays #120 — Hook Stride is a **walk constraint**, not a pull toward the caster.

### 0.2 Unique Wave-16 CORE (#1017 — stamp onto Wave-18 family CORE, do not clone)

#1017 **owns** the G≥16 unique SDE holes. Wave 17 recorded them as extras until Wave 18. This document **consumes #1017 as Wave-18 family CORE** (together with #1063) and does **not** re-author those cards.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-ring-stride` | ENEMY_DISCOVERY | **One** next walk Chebyshev **exactly 2**, knight excluded. Distinct from Hook Stride (permutation of **(3,1)**) |
| `spell-hepta-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 7. Distinct from Nona Oath (**exactly** 9) |
| `spell-rime-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **ice**. Distinct from Slide Reel (nearest **painted conveyor**) |
| `spell-rank-bite` | ENEMY_DISCOVERY | Bonus if share **rank only**. Distinct from Hook Bite (permutation of **(3,1)**) |
| `spell-last-mark` | ENEMY_DISCOVERY | Cell detonates when occupant spends **last leftover AP**. Distinct from Idle Mark (**turn end**, leftover MP **equals max**) |
| `spell-dual-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2**. Distinct from Thin Plate (leftover **1/0**) |
| `spell-rift-skip` | ENEMY_DISCOVERY | 1-tile walk ignores Void Rift tax. Distinct from Brier Skip (Thorned Ground **pathLength 2**) |
| `spell-fresh-sting` | ENEMY_DISCOVERY | Bonus if leftover AP **equals max AP**. Distinct from Wide Sting (leftover AP **≥ 2 AND** leftover MP **≥ 1**) |
| `spell-summon-file` | ELITE | Pets pay +1 AP to **walk off file**. Distinct from Summon Hook (walk landing permutation of **(3,1)** from origin) |
| `spell-prime-gift` | ELITE | Heal iff leftover AP = 1 **and** leftover MP = 1. Distinct from Wide Gift (AP **≥ 2 AND** MP **≥ 1**). **Healer CORE only** |
| `spell-cadence-cap` | ENEMY_DISCOVERY | Remaining `n>2` → 2. Distinct from Cadence Quad (`n>4` → **4**; 0/1/2/3/4 stay) |
| `spell-gait-toll` | ENEMY_DISCOVERY | Next **walk** +1 AP if leftover **MP = 0**. Distinct from Even Toll (leftover **AP even ≥ 2**) |
| `spell-brick-hold` | ENEMY_DISCOVERY | Cannot **walk** while adjacent to a barrier. Distinct from Brick Fee (next **spell** +1 AP while adjacent) |
| `spell-watch-drain` | ELITE | Overwatch snap **steals 1 leftover MP**. Distinct from Watch Bind (next **walk illegal**) |
| `spell-even-gait` | ENEMY_DISCOVERY | Bonus if leftover **MP is even ≥ 2**. Distinct from Prime Gait (leftover AP **=== 1 AND** leftover MP **=== 1**) |
| `spell-rime-cut` | ELITE | Bonus if Chebyshev ≤ 2 from **ice occupancy**. Distinct from Slide Cut (**painted conveyor occupancy**) |
| `spell-cast-plate` | ELITE | Target’s next **non-Strike spell** deals 0. Distinct from Idle Plate (next hit is 0 while leftover MP **equals max**) |
| `spell-pack-orth` | ENEMY_ONLY | Pack walks locked to **orthogonal**. Distinct from Pack Hook (permutation of **(3,1)**). Never owned. Stays `lane_precentor` |
| `spell-leap-fold` | BOSS_ONLY | Swap two player-side bodies at Chebyshev **exactly 3** (any geometry). Distinct from Hook Fold (share a **(3,1)** vector). Never owned. Stays `leap_fold_regent` |

`ring_gallery` is **not** Hook Stride’s door. `hepta_nave` is **not** Nona Oath’s door. `frost_aisle` is **not** Slide Reel’s door. `last_pulpit` is **not** Idle Mark’s door. `rift_court` is **not** Brier Skip’s door. `lane_precentor` is **not** `hook_precentor`. `leap_fold_regent` is **not** `hook_fold_regent`.

### 0.2b Tactical Wave 17 (#1063 — stamp as Wave 18 family CORE, do not clone)

#1063 **owns** the G≥17 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-18 family CORE is unique **#1017** Wave-16 verbs **plus** **#1063** (except Court Dock; Stave Mend is healer CORE only). Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` — do not restamp. Do **not** mint `spell-stave-gift` / `spell-twelve-span` / `spell-choir-turn` / `spell-court-drop` / `spell-quint-mend` / `spell-cadence-deuce`. **SDE wins** unique leftover collisions: Wide Gift stays leftover AP **≥ 2 AND** leftover MP **≥ 1**, not both-body sum===5; Cadence Quad stays remaining `n>4` → `4`, not `2→0`; Thin Plate stays leftover **1/0** negate, not Stave Hood.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-stave-mend` | MULTI_SOURCE | Heal iff **caster and target** leftover AP+MP **=== 5**. Distinct from Wide Gift (**one body** leftover AP **≥ 2 AND** MP **≥ 1**). **Healer CORE only**. `stave_cantor` stays #1063’s door |
| `spell-cadence-dock` | MULTI_SOURCE | Remaining `n===2` → `0`; `n≠2` unchanged. Distinct from Cadence Quad (`n>4` → 4). `dock_precentor` stays #1063’s door |
| `spell-dodeca-span` | MULTI_SOURCE | Axis-aligned **3×4**, counts as **twelve**. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked. `span_dodeca` stays #1063’s door |
| `spell-hymn-turn` | ENEMY_DISCOVERY | Invert leftover AP↔MP independently on **two allies**; caster unchanged; self forbidden. Distinct from Hook Fold (position swap) |
| `spell-stave-hood` | ELITE | Next hit is 0 while leftover AP+MP **=== 5**. Distinct from Thin Plate (leftover **1/0**) |
| `spell-stave-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP+MP **=== 5**. Distinct from Wide Sting (leftover AP **≥ 2 AND** leftover MP **≥ 1**) |
| `spell-stave-step` | ENEMY_DISCOVERY | Caster lands adjacent to a body with leftover AP+MP === 5 |
| `spell-stave-sill` | ENEMY_DISCOVERY | Occupant with leftover AP+MP === 5 at **start of their turn** takes tax |
| `spell-stave-hold` | ELITE | Cannot **walk** while leftover AP+MP === 5. Distinct from Watch Bind (overwatch, next walk illegal) |
| `spell-stave-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP iff the ally leftover AP+MP === 5 |
| `spell-stave-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP+MP === 5 |
| `spell-stave-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP+MP === 5. Distinct from Idle Mark (leftover MP **equals max**, any leftover AP) |
| `spell-stave-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP+MP === 5 |
| `spell-must-stave` | ELITE | Non-Strike illegal unless leftover AP+MP === 5 **and** the spell spends last AP |
| `spell-verse-stave` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP+MP === 5 |
| `spell-court-dock` | NOT_PLAYER_LEARNABLE | Mass Cadence Dock. Never owned. Distinct from Hook Fold (position swap). Stays `court_dock_regent` |

`stave_cantor` is **not** Wide Gift’s door. `dock_precentor` is **not** Cadence Quad’s door (`cadence_thief` / `hex_chorister` observe). `span_dodeca` is **not** Hook Fold’s door. `court_dock_regent` is **not** `hook_fold_regent`. Do not name unique §11 families `stave_mender` / `cadence_docker` / `dodeca_prelate` / `hymn_turner` / `score_mender` / `file_warder` (#1073 / #997 / #941 own those slots).

### 0.2c Unique Wave-17 extras (#1082 — stamp as Wave 19 extras, do not clone)

#1082 **owns** the G≥17 unique SDE holes. This document does **not** consume them as Wave-18 family CORE. Unique Wave-17 §11 stay G≥17 extras until Wave 19 families consume them.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-tern-stride` | ENEMY_DISCOVERY | **One** next walk Chebyshev **exactly 3**, **orthogonal only**. Distinct from Hook Stride (permutation of **(3,1)**; orthogonal dests confirm-fail) |
| `spell-octa-oath` | ENEMY_DISCOVERY | Next spell illegal unless Chebyshev = 8. Distinct from Nona Oath (**exactly** 9) |
| `spell-mire-reel` | ENEMY_DISCOVERY | Pull 1 toward nearest **painted mire**. Distinct from Slide Reel (nearest **painted conveyor**) |
| `spell-diag-bite` | ENEMY_DISCOVERY | Bonus if `\|dx\|==\|dy\|`. Distinct from Hook Bite (permutation of **(3,1)**) |
| `spell-summon-mark` | ENEMY_DISCOVERY | Cell detonates on **summon spawn onto**. Distinct from Idle Mark (**turn end**, leftover MP **equals max**) |
| `spell-prime-plate` | ENEMY_DISCOVERY | Next hit is 0 while leftover **1/1**. Distinct from Thin Plate (leftover **1/0**) |
| `spell-slide-skip` | ENEMY_DISCOVERY | 1-tile walk ignores **conveyor auto-push**. Distinct from Slide Reel (pull toward conveyor) and Brier Skip (Thorned Ground pathLength 2) |
| `spell-capped-sting` | ENEMY_DISCOVERY | Bonus if leftover MP **equals max MP**. Distinct from Wide Sting (AP **≥ 2 AND** MP **≥ 1**) |
| `spell-summon-orth` | ELITE | Pets pay +1 AP to **walk diagonal**. Distinct from Summon Hook (landing permutation of **(3,1)** from origin) |
| `spell-gait-gift` | ELITE | Heal iff leftover AP ≥ 2 **and** leftover MP = 0. Distinct from Wide Gift (AP **≥ 2 AND** MP **≥ 1**). **Healer CORE only** |
| `spell-cadence-tern` | ENEMY_DISCOVERY | Remaining `n>3` → 3. Distinct from Cadence Quad (`n>4` → **4**; 0/1/2/3/4 stay) |
| `spell-odd-toll` | ENEMY_DISCOVERY | Next **walk** +1 AP if leftover **AP is odd**. Distinct from Even Toll (leftover **AP even ≥ 2**) |
| `spell-brick-tax` | ENEMY_DISCOVERY | Next **walk** +1 AP while adjacent to a barrier. Distinct from Brick Fee (next **spell** +1 AP) |
| `spell-watch-tax` | ELITE | Overwatch snap taxes the walker’s **next spell** +1 AP. Distinct from Watch Bind (next **walk illegal**) |
| `spell-thin-gait` | ENEMY_DISCOVERY | Bonus if leftover AP **=== 1 AND** leftover MP **=== 0**. Distinct from Prime Gait (leftover **1/1**) and Wide Sting (AP **≥ 2 AND** MP **≥ 1**) |
| `spell-lava-cut` | ELITE | Bonus if Chebyshev ≤ 2 from **lava occupancy**. Distinct from Slide Cut (**painted conveyor occupancy**) |
| `spell-strike-plate` | ELITE | Target’s next **Strike** deals 0. Distinct from Idle Plate (incoming hit 0 while leftover MP **equals max**) |
| `spell-pack-ring` | ENEMY_ONLY | Pack walks locked to Chebyshev **exactly 2**, knight excluded. Distinct from Pack Hook (permutation of **(3,1)**). Never owned. Stays `hoop_precentor` |
| `spell-lane-fold` | BOSS_ONLY | Swap two player-side bodies that share rank **or** file **and** Chebyshev **exactly 3**. Distinct from Hook Fold (share a **(3,1)** vector). Never owned. Stays `lane_fold_regent` |

`tern_gallery` is **not** Hook Stride’s door. `octa_nave` is **not** Nona Oath’s door. `bog_aisle` is **not** Slide Reel’s door. `spawn_pulpit` is **not** Idle Mark’s door. `belt_nave` is **not** Brier Skip’s door and is **not** Slide Reel’s door. `hoop_precentor` is **not** `hook_precentor`. `lane_fold_regent` is **not** `hook_fold_regent`.

### 0.2d Tactical Wave 18 (#1132 — stamp as Wave 19 family CORE, do not clone)

**#1132** **owns** the G≥18 tactical holes. This catalog’s unique §11 ids stay this document’s. Wave-19 family CORE is unique **#1082** Wave-17 verbs **plus** **#1132** (except Court Tierce; Sestet Mend is healer CORE only). Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` — do not restamp. Do **not** mint `spell-sestet-gift` / `spell-thirteen-span` / `spell-choir-turn` / `spell-mixed-turn` / `spell-cadence-trey` / `spell-court-drop`. **SDE wins** unique leftover collisions: Wide Gift stays leftover AP **≥ 2 AND** leftover MP **≥ 1**, not both-body sum===6 unequal; Cadence Quad stays remaining `n>4` → `4`, not `3→0`; Thin Plate stays leftover **1/0** negate, not Sestet Hood.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-sestet-mend` | MULTI_SOURCE | Heal iff **caster and target** leftover AP+MP **=== 6 AND leftover AP ≠ leftover MP**. Legal pairs (6,0) (0,6) (5,1) (1,5) (4,2) (2,4). (3,3) stays Poise. Distinct from Wide Gift (**one body** leftover AP **≥ 2 AND** MP **≥ 1**). **Healer CORE only**. `sestet_cantor` stays #1132’s door |
| `spell-cadence-tierce` | MULTI_SOURCE | Remaining `n===3` → `0`; `n≠3` unchanged. Distinct from Cadence Quad (`n>4` → 4) and Cadence Dock (`2→0`). `tierce_precentor` stays #1132’s door |
| `spell-trideca-span` | MULTI_SOURCE | Orthogonal plus arm 3, counts as **thirteen**. Click = center. Live summon cap is still 2 — implementation-blocked. Unique §11 does **not** clone it. `span_trideca` stays #1132’s door |
| `spell-psalm-turn` | ENEMY_DISCOVERY | Invert leftover AP↔MP independently on **one same-side non-caster and one opposite-side body**; caster unchanged. Distinct from Hymn Turn (two allies) and Duel Turn (two hostiles) |
| `spell-sestet-hood` | ELITE | Next hit is 0 while leftover AP+MP **=== 6 AND unequal**. Distinct from Thin Plate (leftover **1/0**) |
| `spell-sestet-sting` | ENEMY_DISCOVERY | Bonus iff leftover AP+MP **=== 6 AND unequal**. Distinct from Wide Sting (leftover AP **≥ 2 AND** leftover MP **≥ 1**) |
| `spell-sestet-step` | ENEMY_DISCOVERY | Caster lands adjacent to a body with leftover AP+MP === 6 unequal |
| `spell-sestet-sill` | ENEMY_DISCOVERY | Occupant with leftover AP+MP === 6 unequal at **start of their turn** takes tax |
| `spell-sestet-hold` | ELITE | Cannot **walk** while leftover AP+MP === 6 unequal. Distinct from Watch Bind (overwatch, next walk illegal) |
| `spell-sestet-lend` | ENEMY_DISCOVERY | +1 AP and +1 MP iff the ally leftover AP+MP === 6 unequal |
| `spell-sestet-sip` | ENEMY_DISCOVERY | Steal 1 leftover AP iff leftover AP+MP === 6 unequal |
| `spell-sestet-post` | ENEMY_DISCOVERY | Empty-kit body; end-turn occupy detonates iff leftover AP+MP === 6 unequal. Distinct from Idle Mark (leftover MP **equals max**, any leftover AP) |
| `spell-sestet-bounce` | ENEMY_DISCOVERY | Bounce among hostiles with leftover AP+MP === 6 unequal |
| `spell-must-sestet` | ELITE | Non-Strike illegal unless leftover AP+MP === 6 unequal **and** the spell spends last AP |
| `spell-verse-sestet` | ENEMY_DISCOVERY | Last resolved id illegal until leftover AP+MP === 6 unequal |
| `spell-court-tierce` | NOT_PLAYER_LEARNABLE | Mass Cadence Tierce. Never owned. Distinct from Hook Fold (position swap). Stays `court_tierce_regent` |

`sestet_cantor` is **not** Wide Gift’s door. `tierce_precentor` is **not** Cadence Quad’s door (`cadence_thief` / `hex_chorister` observe). `span_trideca` is **not** Hook Fold’s door. `court_tierce_regent` is **not** `hook_fold_regent`. Do not name unique §11 families `sestet_mender` / `cadence_tiercer` / `trideca_prelate` / `psalm_turner` / `stave_mender` / `cadence_docker` / `dodeca_prelate` / `hymn_turner` (#1138 / #1073 / #997 / #941 own those slots).

### 0.3 Held holes (still not this pass)

Wave 17 §13 listed these as Wave-18/19 candidates. This wave **does not** fill them in unique §11 except the ones marked filled:

| Held hole | Why still held / this wave |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Eight…thirteen-cell occupy | **#849 / #890 / #953 / #1011 / #1063 / #1132** own 8–13. Do not mint `spell-nona-span` / `spell-thirteen-span`. Stamp **#1132** `spell-trideca-span` |
| Both-body leftover AP+MP === 4 **and unequal** heal | **#1011 Score Mend**. Wide Gift is **one-body** AP≥2/MP≥1 |
| Both-body leftover AP+MP === 5 heal | **#1063 Stave Mend**. Distinct from Wide Gift |
| Both-body leftover AP+MP === 6 **and unequal** heal | **#1132 Sestet Mend**. Distinct from Wide Gift |
| Remaining CDs `n===1` → `0` | **#1011 Cadence Snuff** |
| Remaining CDs `n===2` → `0` | **#1063 Cadence Dock** |
| Remaining CDs `n===3` → `0` | **#1132 Cadence Tierce**. Distinct from Cadence Quad (`n>4` → 4) |
| Two-hostile leftover AP↔MP invert | **#1011 Duel Turn** |
| Two-ally leftover AP↔MP invert (caster stays) | **#1063 Hymn Turn** |
| Mixed-side leftover AP↔MP invert (caster stays) | **#1132 Psalm Turn** |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| Sixth echo id | Choir Verse / Stolen Verse / After Verse / Echo Cast / False Echo already cover the axis |
| Player-owned About Hinge | Stays `BOSS_ONLY` on #590 |
| Invert leftover AP ↔ leftover MP on one body | **Wave 3 Tempo Invert**. Hostile invert is **#953 Purse Turn** |
| Two-body leftover AP ↔ leftover MP cross | **#890 Bar Cross** |
| Heal if leftover AP **equals** leftover MP and **both ≥ 1** | **#906 Equal Gift**. Wide Gift is AP≥2 **and** MP≥1, not necessarily equal |
| Remaining CDs `n>1` → 1 (zeros stay 0) | **#906 Cadence Floor** |
| Remaining `0` → `1` | **#953 Cadence Prime** |
| Remaining `n>2` → `2` | **#1017 Cadence Cap** |
| Remaining `n>3` → `3` | **#1082 Cadence Tern**. Cadence Quad is the next cap |
| One next walk must share **file** (same x) | **#962 File Stride** |
| One next walk Chebyshev **exactly 2**, knight excluded | **#1017 Ring Stride** |
| One next walk Chebyshev **exactly 3**, orthogonal only | **#1082 Tern Stride**. Hook Stride is (3,1), not (3,0) |
| Dedicated CORE families for unique Wave-16 §11 verbs **and** #1063 | **#1138** consumes them as Wave-18 family CORE (`stave_mender` … `cast_plater`). This catalog does not mint those family ids |
| Dedicated CORE families for unique Wave-17 §11 verbs **and** #1132 | Unique Wave-17 §11 stay G≥17 extras until Wave 19. **#1132** stamps as Wave 19 family CORE |
| Facing cards | Still fail closed until a battle `currentView` writer exists. **No new Wave-18 facing cards** |
| Chebyshev-3 dest permutation of **(3,2)** | Held for a later generation. Hook Stride is **only** (3,1) |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-seven calendar days after Wave 12, and one day after Wave 17, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Wide Gift / Score Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-18 unique ids stay `mpCost: 0`. Even Toll / Summon Hook / Pack Hook / Watch Bind / Brick Fee are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Slide Reel is attract-toward-**nearest painted conveyor occupancy**, a new dest flavor after Mire Reel (painted mire), Lava Reel (lava), Rime Reel (ice), Spike Reel (spike), Pit Reel (pit), Cinder Reel (hazard), Void Reel (void/portal), and Brick Reel (barrier) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-18 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| Live hazard types | `gameTypes.ts` 437 `HazardTileType` = `lava` \| `ice` \| `spikes` | Slide Cut keys off **painted conveyor**, never a new `HazardTileType`. Thorned Ground (`mapModifiers.ts` 175–186) is a **map-modifier pathLength tax**, not occupancy. Brier Skip keys off pathLength **2** |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21 **#814**…**#869**, then 2026-10-22 **#870**…**#927**, then 2026-10-23 **#930**…**#979**, then 2026-10-24 **#980**…**#1017**, then 2026-10-25 **#1043**…**#1107**, then 2026-10-26 **#1108**…. **#371 owns Wave-4 SDE. #906 owns Wave-14 SDE. #962 owns Wave-15 SDE. #1017 owns Wave-16 SDE. #1082 owns Wave-17 SDE. #953 owns Wave-15 tactical. #1011 owns Wave-16 tactical. #1063 owns Wave-17 tactical (Wave 18 family CORE). #1132 owns Wave-18 tactical (Wave 19 family CORE). #941 owns Wave-15 families. #997 owns Wave-16 families. #1073 owns Wave-17 families. #1138 owns Wave-18 families. #951 owns Wave-16 extra boss doors. #1004 owns Wave-17 extra boss doors. #1080 owns Wave-18 extra boss doors. #1139 owns Wave-19 extra boss doors. #1078 owns SDA-175…189. #1140 owns SDA-190…204. #982 owns CDA-030. #1056 owns prior ENC-*. #1121 owns same-day Tally/Rank/Spike/Odd ENC-*. #1064 owns Wave-17 WF-*. #1114 owns Wave-18 WF-*. #1111 owns same-day EBA (zero extra doors). #1128 owns same-day WDEAD.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-17 P0 remain the prerequisite. **Do not land Wave-18 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 18 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥18 rares make it sharper: a CHAMPION may hold the generation-18 verb until a (3,1) landing / painted conveyor cell / leftover-AP≥2-and-MP≥1 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 18 fills holes Waves 1–17, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, #962, #1011, **#1017**, **#1063**, and **#1082** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Tern Stride, Knight Stride, Ring Stride, Orth Stride, Rank Lock, Pack Ring, Pack Orth, Hook Line, Diag Bite, File Bite, Slide Skip, Cadence Tern, Cadence Dock, Gait Gift, Stave Mend, Prime Plate, Thin Gait, Cast Plate, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 18 stamps `generationMin: 18`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Even Toll **adds 1 AP** to the next **walk** if leftover AP is even ≥ 2. Summon Hook taxes **allied summons** 1 AP when the walk landing is a (3,1) from origin. Pack Hook locks **walk dests to (3,1)**. Watch Bind **forbids** the walker’s next walk. Brick Fee **adds 1 AP** to the next spell while adjacent to a barrier. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Loaner orbs / `WF-SPL-*` never write `ownedSpellIds`.**

Innate seed is still **four ids only:** `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

---

## 3. Discovery state machine (unchanged; Wave-18 edges)

Wave 1 §3. Default path:

1. Enemy possesses an eligible player-learnable id.
2. Enemy **uses** it (`kind === "cast"` and AP spent).
3. Id becomes `OBSERVED` for this encounter (and persist-observed if the writer exists).
4. Player **wins the same encounter**.
5. Id becomes permanently unlocked in the Spell Library.

Wave-18 edges (additive):

| Event | Observes? |
| :--- | :--- |
| Encounter start, kit preview, telegraph | **No** |
| `spell-hook-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Hook Stride later walk confirm-fail (orthogonal / diagonal / knight / (3,2) dest) | Already observed on the arm |
| `spell-idle-mark` **paint** | **Yes** — paint is the use |
| Idle Mark later turn-end detonate | **No second observe** |
| `spell-thin-plate` **armed** | **Yes** |
| Thin Plate later negated hit | **No second observe** |
| `spell-slide-reel` AP spent, no painted conveyor in radius | **Yes** — fizzle after AP |
| `spell-wide-gift` AP spent, leftover not AP≥2/MP≥1 | **Yes** — fizzle after AP |
| `spell-even-toll` AP spent, leftover AP odd or 0/1 | **Yes** — fizzle after AP |
| Illegal confirm (no AP) | **No** |
| `spell-pack-hook` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-hook-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Player-controlled summon casts | **No** |
| Defeat after observe | Observed may persist; **not** granted |

In-battle cue: `TECHNIQUE OBSERVED` (non-blocking, carved-stone / crimson).  
Victory recap: `NEW SPELL DISCOVERED` with name, role, AP, range, target type, key effect, source enemy.

---

## 4. Acquisition sources

| Source | Wave-18 use |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥18 family verbs in §11 **plus** #1017 / #1063 stamps in §0.2 / §0.2b / §12 |
| `ACHIEVEMENT` | **None.** All 15 feat doors claimed or leftover. Never `unstoppable` / `level_10` |
| `CHALLENGE` | **None.** All nine challenge ids claimed through Wave 7 |
| `BOSS` | Hook Fold is `BOSS_ONLY` (not a grant). No new boss-grant MULTI this wave. Court Dock stays `NOT_PLAYER_LEARNABLE` on `court_dock_regent` |
| `ELITE` | Summon Hook, Wide Gift, Watch Bind, Slide Cut, Idle Plate. **#1063** Stave Hood / Stave Hold / Must Stave stamp as Wave 18 CORE, not unique §11 |
| `SPECIAL_ENCOUNTER` | `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | Stamp #1063 Stave Mend / Cadence Dock / Dodeca Span as Wave 18 CORE. Stamp #1017 unique Wave-16 verbs as Wave 18 CORE. Unique §11 are not MULTI this wave |

### 4.1 Claimed doors (do not restamp)

Feat doors remain claimed as in Wave 17 §4.1. `survivor` leftover (Last Ember / Last Ward). `jackpot` is Absolve. `leader_slayer` is Crown Cut. `spell_master` is Full Bar.

Challenge doors remain claimed through Wave 7 (`easy_1` Bloodless Plate, `hard_1` Thin Ward, `legendary_1` Clean Blood, …).

Boss extra doors through **#951**: `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. **#1004**: `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. **#1080**: `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. **#1139**: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`. #890 `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #953 `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. **#1011**: `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063**: `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. **#1132**: `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`. **#1017**: `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. **#1082**: `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent`. **#1073** family ids `score_mender` … `summon_plater` — do not restamp. **#1138** family ids `stave_mender` … `cast_plater` — do not restamp.

---

## 5. Learnable vs closed

| Flag | Wave-18 ids |
| :--- | :--- |
| `PLAYER_LEARNABLE` | Unique §11 except Pack Hook and Hook Fold |
| `ENEMY_ONLY` | `spell-pack-hook` on `hook_precentor` CHAMPION |
| `BOSS_ONLY` | `spell-hook-fold` on `hook_fold_regent` |
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
| 17 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 17` |
| 18 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 18` |
| 19+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-17 G17 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **18** for families listed in §12. It remains a data query, not a constant in combat math.

Pool recipe (conceptual):

```
  1. CORE_POOL (always; generationMin 0)
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  …
  18. if G ≥ 18: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
```

Wave 1 §9.1 through Wave 17 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

Higher relative difficulty raises eligibility for ADVANCED / RARE / ELITE / SIGNATURE. Variant (VETERAN / CHAMPION), rarity, AI sophistication, family, achievement state, encounter type, and mechanic complexity remain legal gates. None of them is a last spell tier.

---

## 7. AI compatibility (Wave-18 hints)

New hints are predicates. Missing hint → drop the id from resolve, log once. Do not fall back to `spell.name`.

| `aiHint` | Required `aiProfile` | Predicate |
| :--- | :--- | :--- |
| `walk_hook_3_1` | flanker / kiter | Next walk dest is a permutation of `(3,1)` (eight cells). Skip if they must orthogonal-3 (Tern Stride), knight `(2,1)`, diagonal, or step-1 to threaten and Strike is better. **Do not** assign to chargers who only walk adjacent |
| `next_spell_exact_chebyshev_9` | kiter / caster | Can occupy a cell from which a non-Strike target sits at Chebyshev 9 this turn; skip if not (use Strike / Octa Oath) |
| `attract_toward_nearest_slide` | controller / caster | At least one **painted conveyor** occupancy in search radius; dest is that occupancy, never `map.portals`, never live lava/ice/spikes, never painted mire (those are Lava / Rime / Spike / Mire Reel) |
| `bonus_if_share_hook_3_1_with_caster` | flanker / bruiser | Target is a permutation of `(3,1)` from the caster; skip if on-rank, on-file, or `|dx|==|dy|` and Diag Bite / File Bite / Rank Bite is better |
| `detonate_if_turn_end_leftover_mp_equals_max` | controller | Paint a cell an occupant is likely to **end turn on without walking**; skip if they will spend last AP (use Last Mark) or a summon will spawn (use Summon Mark) |
| `negate_hit_if_leftover_ap_eq_1_and_mp_eq_0` | tank / warden | Arm when own leftover AP === 1 **and** leftover MP === 0; skip if leftover 1/1 (use Prime Plate) or leftover MP equals max (use Idle Plate) |
| `skip_thorned_ground_on_path_length_2` | flanker / kiter | A pathLength-2 walk on live Thorned Ground is useful; skip if the tax is lava/spikes/ice/Void Rift/conveyor (those are other skips). PathLength 1 already deals 0 Thorned extra |
| `bonus_if_leftover_ap_ge_2_and_mp_ge_1` | bruiser / caster | Target leftover AP ≥ 2 **and** leftover MP ≥ 1; skip if leftover MP = 0 (Thin Gait / Gait Gift window) or leftover 1/1 (Prime Gait / Prime Gift) |
| `summon_walk_hook_3_1_ap_tax` | summoner | Living allied summon exists; skip if pack is already (3,1)-locked (Pack Hook) or Chebyshev-2-locked (Pack Ring) |
| `heal_if_leftover_ap_ge_2_and_mp_ge_1` | healer | Target leftover AP ≥ 2 **and** leftover MP ≥ 1 and missing HP ≥ 8; skip if leftover is AP≥2/MP=0 (Gait Gift) or 1/1 (Prime Gift). **Healer CORE only** |
| `cap_remaining_cds_gt_4_to_4` | controller / caster | Target has at least one remaining CD `n>4`; skip if all remaining are 0/1/2/3/4 (use Tern / Cap / Floor / Dock) |
| `tax_next_walk_if_leftover_ap_even_ge_2` | controller | Target leftover AP is even ≥ 2; skip if leftover AP odd (use Odd Toll) |
| `tax_next_spell_if_adjacent_barrier` | controller / tank | Target is adjacent to a barrier; skip if no barrier (use Brick Tax if the next **walk** should be taxed) |
| `overwatch_snap_forbid_walker_next_walk` | kiter / sniper | Arm overwatch on a tile a walker will enter; snap writes next-walk **illegal**. Skip if they should lose leftover MP now (Watch Root) or pay next-spell AP (Watch Tax) |
| `bonus_if_leftover_ap_eq_1_and_mp_eq_1` | bruiser / caster | Target leftover AP === 1 **and** leftover MP === 1; skip if leftover 1/0 (Thin Gait / Thin Plate) |
| `bonus_if_near_slide_occupancy` | flanker / controller | Target Chebyshev ≤ 2 from painted conveyor occupancy |
| `negate_hit_if_leftover_mp_equals_max` | tank / warden | Arm when own leftover MP === max MP (they have not walked); skip if leftover MP = 0 (Dry Plate) |
| `pack_walk_hook_3_1` | pack champion | Boss/champion AI only. Living pack allies exist. **Never owned** |
| `fold_two_player_side_share_hook_3_1` | boss | Two living player-side bodies that share a (3,1) vector. **Boss AI only. Never owned** |

Do not assign Wide Gift / Tally Mend / Equal Gift / Prime Gift / Score Mend / Stave Mend / Gait Gift to non-healer CORE. Do not assign Slide Reel when the map has no painted conveyor. Do not assign Hook Fold outside boss AI.

---

## 8. Persistence (Wave-1 writers; Wave-18 does not add a second path)

Discovery must be backend-authoritative, idempotent, reload-safe, and duplicate-callback safe.

- Grant writer is still Wave 1 `commitSpellDiscoveries` (not implemented on this HEAD).
- Repeated discovery must not duplicate spells, reset upgrades, mint Doka/XP, or call `upgradeSpell` / `updateCharacter` / `applyRewards`.
- `ENEMY_ONLY` / `BOSS_ONLY` never write `ownedSpellIds` / `spellLevelKeys`.
- Loaner orbs and `WF-SPL-*` never write those maps.

---

## 9. Special encounters (Wave 18)

Tag existing solvable layouts. Do not edit `mapGen.ts` algorithms. Do not skip `finalizePlayableLayout`.

| Tag | Teach via observe+win |
| :--- | :--- |
| `hook_gallery` | `spell-hook-stride` |
| `nona_nave` | `spell-nona-oath` |
| `mill_aisle` | `spell-slide-reel` |
| `idle_pulpit` | `spell-idle-mark` |
| `brier_nave` | `spell-brier-skip` |

Do not retag `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `knight_gallery` / `even_gallery` / `pair_gallery` / `diag_gallery` / `rime_gallery` / `void_aisle` / `ash_aisle` / `penta_nave` / `hexa_nave` / `hepta_nave` / `span_six` / `span_dec` / `span_hendeca` / `span_dodeca` / `mire_nave` / `frost_aisle` / `lava_aisle` / `strike_pulpit` / `last_pulpit` / `shock_nave` / `rift_court`. Do not consume #771 primer rooms, #826 ENC-* ids, #885 ENC-* ids, #957 ENC-* ids, **#1006** ENC-* ids, or **#1056** ENC-* ids. Twin Gate pads stay off `map.portals`. Painted conveyor cells are spell occupancy, not `HazardTileType`. Thorned Ground extra is a map-modifier pathLength tax. `ENC-INCH-01` stays Inch Stride’s room. `ENC-FOLD-01` stays a wall fold, not Hook Fold. `ENC-KNIGHT-01` stays Knight Stride’s room, not Hook Stride. `ENC-POISE-01` stays Poise Mend’s room, not Wide Gift. `ENC-PIT-02` stays Pit Reel’s room, not Slide Reel. `ENC-SPELL-33` stays #1056’s Poise teach, not Wide Gift.

Wave-1 `echo_dummies`, Wave-2 `rime_gallery` / `still_court` / `mist_gallery`, Wave-13 `knight_gallery` / `quad_nave` / `pit_aisle`, Wave-14 `rank_gallery` / `penta_nave` / `spike_aisle` / `mire_nave`, Wave-15 `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave`, Wave-16 `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court`, and Wave-17 `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` are not re-specified.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–17 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 + #695 + #726 + #787 + #849 + #890 + #953 + #1011 + #1063 already cover: push, pull, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, conditional bounce, next-spell AP tax, next-walk AP tax after Strike, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, leftover-AP=0 heal, leftover-MP=0 heal, leftover 0=0 heal, leftover AP==MP ≥ 1 heal, leftover AP=0 and MP≥1 heal, leftover 1/1 heal, leftover AP≥2 and MP=0 heal, leftover sum===3 heal, leftover sum===4 unequal heal, leftover sum===5 heal, CD copy / steal / swap / lag / stall / stretch / halve / trim / rest / grace / floor / rise / prime / cap / tern / snuff / dock, even-Chebyshev hood, odd-Chebyshev hood, eight-cell occupy, nine-cell occupy, ten-cell occupy, eleven-cell occupy, twelve-cell occupy, leftover-AP-odd plate, leftover-MP=0 plate, leftover both-even≥2 plate, leftover 1/1 plate, same-file next walk, same-rank next walk, knight walk, Chebyshev-2-not-knight walk, Chebyshev-3 orthogonal walk, exact-4/5/6/7/8 spell gate, lava/spike/pit/ice/mire pull, Strike-from paint, last-AP paint, summon-spawn paint, pack orthogonal lock, pack diagonal lock, pack Chebyshev-2 lock, Chebyshev-3 axis fold, Chebyshev-3 any-geometry fold, Chebyshev-4 fold.

**Still open (Wave 18 SDE unique ids).** The occupy-weights, leftover-sum===5 family, CD floor/rise/prime/cap/tern/snuff/dock, and same-file/same-rank/ring/tern walks are siblings’; this table is what Discovery **adds**.

| Hole | Wave-18 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk permutation of **(3,1)** | `spell-hook-stride` | Tern Stride is Chebyshev **exactly 3, orthogonal only** `(±3,0)/(0,±3)`. Knight Stride is **only** `(2,1)`. Ring Stride is Chebyshev **exactly 2**, knight excluded. Orth Stride is **any** orthogonal length. `(3,2)` stays held. Hook Line is a **pull toward caster** |
| Next spell illegal unless Chebyshev = 9 | `spell-nona-oath` | Octa Oath is 8. Hepta Oath is 7. Nine Span is occupy-weight 9. Long Oath is ≥ 3. Do not mint `spell-nona-span` |
| Pull 1 toward nearest **painted conveyor occupancy** | `spell-slide-reel` | Mire Reel is painted mire. Lava / Rime / Spike Reel are live hazards. Slide Tile **is** the conveyor. Slide Skip **ignores auto-push**. Hook Line is toward **caster**. Dest is never `map.portals` |
| Bonus if share a **(3,1)** vector | `spell-hook-bite` | Diag Bite is `\|dx\|==\|dy\|`. File Bite is **file only**. Rank Bite is **rank only**. Axis Bite is rank **or** file. Knight Pierce is a **(2,1)** poke. Hook Stride is a **walk** constraint |
| Cell detonates at occupant **turn end** iff leftover MP **equals max MP** | `spell-idle-mark` | Dwell Mark detonates on **any** end-turn occupy. Wake Mark is **start-of-turn**. Last Mark is last leftover **AP**. Summon Mark is **spawn onto**. Stride Mark is **leave**. They must **not walk** for this paint to fire |
| Next hit is 0 while leftover AP **=== 1 AND** leftover MP **=== 0** | `spell-thin-plate` | Prime Plate is leftover **1/1**. Dual Plate is leftover both even ≥ 2. Dry Plate is leftover **MP = 0** (any AP). Thin Gait is a **damage bonus** on 1/0, not a negate. Stave Hood is leftover sum === 5 |
| PathLength **2** walk ignores **Thorned Ground extra** | `spell-brier-skip` | PathLength 1 already deals 0 Thorned extra (`thornedGroundWalkDamage(1) === 0`). Slide Skip is conveyor auto-push, length 1. Rift Skip is Void Rift tax. Shock / Spike / Rime / Glyph skips are other taxes. Length ≥ 3 still pays Thorned extra |
| Bonus if leftover AP **≥ 2 AND** leftover MP **≥ 1** | `spell-wide-sting` | Thin Gait is leftover **1/0**. Capped Sting is leftover MP **equals max**. Fresh Sting is leftover AP **equals max**. Even Sting is leftover AP **even ≥ 2** (MP free). Stave Sting is leftover sum === 5. Wide Gift is the **heal** on the same leftover window |
| Allied summons pay +1 AP if this turn’s walk **landing** is a **(3,1)** from **origin** | `spell-summon-hook` | Summon Orth taxes each **diagonal step**. Summon File taxes walk **off file**. Summon Rank taxes walk **off rank**. Pack Hook **locks** pack walks to (3,1) (`ENEMY_ONLY`) |
| Heal iff leftover AP **≥ 2 AND** leftover MP **≥ 1** | `spell-wide-gift` | Gait Gift is AP ≥ 2 **and** MP = 0. Lean Gift is AP = 0 **and** MP ≥ 1. Prime Gift is **1/1**. Equal Gift is AP **==** MP ≥ 1. Score Mend is both-body leftover **sum === 4 AND unequal**. Stave Mend is both-body leftover **sum === 5**. `healAmount` stays 0 on the row |
| Remaining CDs **n>4 → 4**; 0/1/2/3/4 unchanged | `spell-cadence-quad` | Cadence Tern is `n>3` → **3**. Cadence Cap is `n>2` → **2**. Cadence Floor is `n>1` → **1**. Cadence Dock is `n===2` → 0. Quad Oath is a **spell gate** exactly 4. Quad Span is occupy-weight 4 |
| Next **walk** +1 AP if leftover **AP is even ≥ 2** | `spell-even-toll` | Odd Toll is leftover **AP odd**. Gait Toll is leftover **MP = 0**. Still Toll is next **spell** if leftover MP = 0. Even Gait is **damage** if leftover MP is even ≥ 2 |
| Next **spell** +1 AP while adjacent to a **barrier** | `spell-brick-fee` | Brick Tax is next **walk** +1 AP. Brick Hold **forbids** the walk. Brick Brace **negates a hit**. Quiet Hex is an ungated next-spell tax |
| Overwatch snap **forbids the walker’s next walk** | `spell-watch-bind` | Watch Tax taxes next **spell** +1 AP. Watch Root **zeros leftover MP now**. Watch Drain **steals 1 leftover MP**. Brick Hold forbids walk **while adjacent to a barrier**, not as an overwatch snap |
| Bonus if leftover AP **=== 1 AND** leftover MP **=== 1** | `spell-prime-gait` | Thin Gait is leftover **1/0**. Even Gait is leftover MP **even ≥ 2**. Odd Gait is leftover MP **odd**. Prime Gift / Prime Plate own **1/1** as heal / negate, not a damage rider |
| Bonus if Chebyshev ≤ 2 from **painted conveyor occupancy** | `spell-slide-cut` | Lava Cut is **lava occupancy**. Rime Cut is **ice**. Spike Cut is **spikes**. Hazard Cut is **painted hazard**. Portal Cut is **world portals**. Slide Reel **pulls**. Slide Skip **ignores auto-push** |
| Next hit is 0 while leftover MP **equals max MP** | `spell-idle-plate` | Dry Plate is leftover **MP = 0**. Capped Sting is a **damage bonus** on leftover MP equals max. Cast Plate zeros the next **outgoing non-Strike**. Idle Mark is a **cell detonate**, not a negate |
| Pack walks locked to permutation of **(3,1)** | `spell-pack-hook` | Pack Ring is Chebyshev **exactly 2**, knight excluded. Pack Orth is **orthogonal** (any length). Pack Diag is **diagonal only**. Hook Stride is one next walk from **self**. Never owned |
| Swap two player-side bodies that share a **(3,1)** vector | `spell-hook-fold` | Lane Fold is shared rank **or** file **and** Chebyshev **exactly 3**. Leap Fold is Chebyshev **exactly 3**, **any geometry**. Knight Fold is a different boss. Adj Fold is Chebyshev **1**. Far Fold is exactly **4**. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 18)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–17, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #802, #837, #849, #890, #906, #953, #962, #1011, **#1017**, **#1063**, or **#1082**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Even Toll / Summon Hook / Pack Hook / Watch Bind / Brick Fee are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 18 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #1082 / #1063 / #1017 / #1011 / #962 key names for a different meaning.

```text
hookStride31,                     // dest is permutation of (3,1): eight cells
nextSpellExactChebyshev,          // Nona Oath — value 9 (reuse key; value distinguishes Octa=8 / Hepta=7)
attractTowardNearestSlide, slideSearchRadius,
bonusIfShareHook31WithCaster, hookBiteBonus,
detonateIfTurnEndLeftoverMpEqualsMax,
negateHitIfLeftoverApEq1AndMpEq0,
skipThornedGroundOnPathLength2,
bonusIfLeftoverApGe2AndMpGe1, wideStingBonus,
summonWalkHook31ApTax,
requireLeftoverApGe2AndMpGe1, wideGiftHeal,
capRemainingCdsAbove4To4,         // n>4 → 4; 0/1/2/3/4 stay
nextWalkApTaxIfLeftoverApEvenGe2,
nextSpellApTaxIfAdjacentBarrier,
overwatchSnapForbidWalkerNextWalk,
bonusIfLeftoverApEq1AndMpEq1, primeGaitBonus,
bonusIfNearSlideOccupancy, slideCutRadius, slideCutBonus,
negateHitIfLeftoverMpEqualsMax,
packWalkHook31, packAuraRadius, packAuraDuration,
foldTwoPlayerSideShareHook31, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` for Watch Bind’s arm window; `nextSpellExactChebyshev` with value **9**.

---

### SPELL_ID: `spell-hook-stride`

NAME: Hook Stride  
ROLE: POSITION — one next walk must be a (3,1) dest  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rank_lancer`; `G ≥ 18` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥18. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The caster’s **next walk** is legal only if `(|dx|,|dy|)` is a permutation of `(3,1)` (`effectParams: {"hookStride31":true}`). Legal dests are the eight cells `(±3,±1)` and `(±1,±3)`. Orthogonal dests including Tern Stride’s `(±3,0)/(0,±3)`, diagonal dests including `(2,2)` / `(3,3)`, knight dests `(2,1)`, Chebyshev-3 dests `(3,2)`, Chebyshev 1–2, and Chebyshev ≥ 4 confirm-fail (MP not spent). Forced movement / swap / blink / Twin-gate still legal. Distinct from Tern Stride (Chebyshev **exactly 3, orthogonal only**), Knight Stride (**only** `(2,1)`), Ring Stride (Chebyshev **exactly 2**, knight excluded), Orth Stride (any orthogonal length), Hook Line (pull toward caster). Does **not** read `currentView`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_hook_3_1"`. Flanker / kiter. Skip if they must orthogonal-3, knight-step, or step-1 to threaten and Strike is better. **Do not** assign to chargers who only walk adjacent.  
PLAYER_COUNTERPLAY: Stand at Chebyshev 1, 2, or 4; occupy the eight hook cells; Root before they arm  
SYNERGIES: Far Sting after they are stuck off the axis; Tern Stride on a different body (do **not** CORE both on one kit)  
BALANCE_RISK: One-walk (3,1) lock is a spacing puzzle. 2 AP / CD 2 / one consume. Fail closed (confirm fail), never become Tern Stride, Knight Stride, or Hook Line.  
PERSISTENCE_REQUIREMENTS: Standard observe → same-encounter win. Observation is the **arm**, not the later walk.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nona-oath`

NAME: Nona Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 9  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `pale_cantor`; `G ≥ 18`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **non-Strike** spell confirms only if Chebyshev from caster to that spell’s target is **exactly 9** (`effectParams: {"nextSpellExactChebyshev":9}`). `physical_attack` stays legal at any range. Distinct from Octa Oath (exactly 8), Hepta Oath (exactly 7), Hexa Oath (exactly 6), Long Oath (≥ 3), Nine Span (occupy-weight 9), Far Hood (incoming miss from ≥ 3). If they arm then walk to 8, the spell fizzles on confirm (AP not spent for the fizzled spell; Nona Oath already observed). Do **not** mint `spell-nona-span`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_9"`. Kiter / caster. Skip if they cannot reach 9 this turn (use Strike / Octa Oath).  
PLAYER_COUNTERPLAY: Close to 8 or 10; Root; Paper Wind  
SYNERGIES: Split Pace / Overcast after they sit at 9; Far Sting as the gated poke  
BALANCE_RISK: Exact-9 + Far Sting is a sniper prison. 2 AP / CD 3 / Strike exempt. Do not restamp `span_dodeca` / `octa_nave` / `nine-span`. Do not mint `spell-nona-span`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-slide-reel`

NAME: Slide Reel  
ROLE: POSITION — pull 1 toward nearest painted conveyor  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `rime_mason`; `G ≥ 18`; `aiProfile` controller/caster  
ENEMY_FAMILIES: `tide_shade`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Pull the target 1 tile toward the nearest **painted conveyor** occupancy in Chebyshev 6 (`effectParams: {"attractTowardNearestSlide":true,"slideSearchRadius":6}`). Painted conveyor is Slide Tile occupancy, **not** `HazardTileType` lava/ice/spikes and **not** painted mire. If no painted conveyor exists, fizzle (AP spent). Dest is never `map.portals`, never Twin Gate pads, never live lava/ice/spikes, never painted mire (those are Lava / Rime / Spike / Mire Reel). Distinct from Slide Tile (paints the conveyor), Slide Skip (ignores auto-push), Hook Line (toward caster), Undertow (attract + walk-MP).  
SCALING: distance fixed  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_slide"`. Controller / caster. Skip if no painted conveyor in radius (use Mire Reel / Lava Reel / Hook). **Do not** assign to chargers.  
PLAYER_COUNTERPLAY: Do not stand on a conveyor approach; Barrier the pull cell; blink off  
SYNERGIES: Slide Tile first, then reel; Far Watch covering the mill  
BALANCE_RISK: Pull onto conveyor + auto-push bricks a close. G≥18 + painted-conveyor gate + 3 AP. Dest must fail closed off world portals.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-conveyor fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hook-bite`

NAME: Hook Bite  
ROLE: DAMAGE — bonus if share a (3,1) vector  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `shadow_lurker`; `G ≥ 18`; `aiProfile` flanker/bruiser  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If `(|dx|,|dy|)` is a permutation of `(3,1)`, deal an extra 8 as a **second** existing `dealDamage` call (`effectParams: {"bonusIfShareHook31WithCaster":true,"hookBiteBonus":8}`). Shared rank only, shared file only, shared diagonal, knight `(2,1)`, and `(3,2)` are 10. Distinct from Diag Bite (`|dx|==|dy|`), File Bite (file only), Rank Bite (rank only), Axis Bite (rank **or** file), Knight Pierce (`(2,1)` poke), Hook Stride (walk constraint).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_hook_3_1_with_caster"`. Flanker / bruiser. Skip if the target is on-rank, on-file, or on-diagonal and Strike / Rank Bite / File Bite / Diag Bite is better.  
PLAYER_COUNTERPLAY: Stand on the caster’s rank, file, or diagonal; Barrier the hook cells  
SYNERGIES: Hook Stride onto a hook cell; Pawn Trade to place them on (3,1)  
BALANCE_RISK: 18 on a hook cell is Frost-adjacent on 2 AP CD 1. Geometry gate. Do not also fire Diag Bite’s rider.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-hook still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-idle-mark`

NAME: Idle Mark  
ROLE: TERRAIN — cell detonates at turn end if they did not walk  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `bone_scribe`; `G ≥ 18`; `aiProfile` controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. If the occupant **ends their turn** on this paint with leftover MP **equal to that body’s max MP** (they took no walk), they take 12 (spell, RES+SR) and the paint consumes (`effectParams: {"detonateIfTurnEndLeftoverMpEqualsMax":true}`). Walk enter, Strike-from, last-AP spend, summon spawn, teleport/swap landing, and end-turn occupy with leftover MP < max do **not** detonate. Distinct from Dwell Mark (any end-turn occupy), Wake Mark (start-of-turn), Last Mark (last leftover AP), Summon Mark, Strike Mark, Cast Mark. Observation is the **paint**.  
SCALING: damage follows dmg%; trigger fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_turn_end_leftover_mp_equals_max"`. Controller. Skip if the occupant will walk or spend last AP.  
PLAYER_COUNTERPLAY: Walk one tile (leftover MP < max); spawn off the cell; Barrier last-writer  
SYNERGIES: Root / Brick Hold so they cannot walk; Null Brand after the detonate  
BALANCE_RISK: 12 vs a rooted caster is real. Paint-only trigger + CD 2. Do not detonate on a unit that walked.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-thin-plate`

NAME: Thin Plate  
ROLE: DEFENSE — next hit is 0 while leftover 1/0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 18`; `aiProfile` tank/warden  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥18. `generationMin: 18`  
RARITY: ADVANCED  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Until consumed or this unit’s next turn end. The next incoming hit deals 0 while leftover AP **=== 1 AND** leftover MP **=== 0** (`effectParams: {"negateHitIfLeftoverApEq1AndMpEq0":true}`). Hit while leftover is not 1/0 deals full and leaves the charge. Distinct from Prime Plate (leftover **1/1**), Dual Plate (both even ≥ 2), Dry Plate (leftover MP = 0, any AP), Thin Gait (damage bonus on 1/0), Stave Hood (leftover sum === 5).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_eq_1_and_mp_eq_0"`. Tank / warden. Skip if leftover is 1/1 (Prime Plate) or leftover MP equals max (Idle Plate).  
PLAYER_COUNTERPLAY: Hit them after they walk or after they spend the last AP; wait the charge out  
SYNERGIES: Thin Gait on the same leftover window (damage, not negate); Paper Wind so they cannot refill AP  
BALANCE_RISK: 1/0 is a narrow window. 2 AP / CD 2 / one consume. Fail closed, never become Prime Plate or Dry Plate.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brier-skip`

NAME: Brier Skip  
ROLE: POSITION — pathLength 2 ignores Thorned Ground extra  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `plague_rat`; `G ≥ 18`; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, until consumed or this unit’s next turn end. The caster’s next walk of **pathLength exactly 2** does not pay Thorned Ground extra (`effectParams: {"skipThornedGroundOnPathLength2":true}`). PathLength 1 already deals 0 (`thornedGroundWalkDamage(1) === 0` in `battleSetup.ts` 297). PathLength ≥ 3 still pays. Lava / spike / ice leave-tax / glyph-tax / Void Rift / conveyor auto-push still tick. Distinct from Slide Skip (conveyor auto-push, length 1), Rift Skip (Void Rift tax), Shock / Spike / Rime / Glyph / Mire skips. Thorned Ground is a **live map modifier**, not occupancy and not a new `HazardTileType`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_thorned_ground_on_path_length_2"`. Flanker / kiter. Skip if Thorned Ground is not active or they only need a 1-tile walk.  
PLAYER_COUNTERPLAY: Force a length-3+ walk; Root; stand so length 2 is not a threat  
SYNERGIES: Split Pace after they skip the extra; Far Watch covering the 2-step  
BALANCE_RISK: Skipping the length-2 extra (5 HP) is real on Thorned Ground maps. Length gate + CD 2. Must not become a universal hazard skip.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. The ignored extra is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wide-sting`

NAME: Wide Sting  
ROLE: DAMAGE — bonus if leftover AP ≥ 2 and leftover MP ≥ 1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 18`; `aiProfile` bruiser/caster  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥18. `generationMin: 18`  
RARITY: ADVANCED  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target** leftover AP **≥ 2 AND** leftover MP **≥ 1**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApGe2AndMpGe1":true,"wideStingBonus":8}`). Leftover 1/0, 1/1, 2/0, 0/≥1, and AP even ≥ 2 with MP = 0 are 10. Distinct from Thin Gait (leftover **1/0**), Capped Sting (leftover MP **equals max**), Fresh Sting (leftover AP **equals max**), Even Sting (leftover AP even ≥ 2, MP free), Stave Sting (leftover sum === 5), Wide Gift (heal on the same leftover window).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_ge_2_and_mp_ge_1"`. Bruiser / caster. Skip if leftover is 1/0 (Thin Gait) or 1/1 (Prime Gait) and those ids are better.  
PLAYER_COUNTERPLAY: Spend down to 1 AP or 0 MP before the poke; Barrier  
SYNERGIES: Wide Gift on the same leftover window; Tempo Gift so they hold AP+MP  
BALANCE_RISK: 18 on a fat leftover is Frost-adjacent on 2 AP CD 1. Leftover gate. Do not also fire Even Sting’s rider.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-window still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-hook`

NAME: Summon Hook  
ROLE: CONTROL — allied summons pay +1 AP to land a (3,1) walk  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ VETERAN; `G ≥ 18`; `aiProfile` summoner  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 18`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Allied summons pay +1 AP if this turn’s walk **landing** is a permutation of `(3,1)` from that walk’s **origin** (`effectParams: {"summonWalkHook31ApTax":true}`). Chebyshev-1 steps along the path are uncharged. Distinct from Summon Orth (per **diagonal step**), Summon File (walk **off file**), Summon Rank (walk **off rank**), Summon Toll (every pet walk), Pack Hook (`ENEMY_ONLY` lock). Player-side pets pay the tax too while the aura is up.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "summon_walk_hook_3_1_ap_tax"`. Summoner. Skip if pack is already (3,1)-locked (Pack Hook) or Chebyshev-2-locked (Pack Ring).  
PLAYER_COUNTERPLAY: Walk pets in orthogonal 1-steps; Kennel Lock so they never land (3,1)  
SYNERGIES: Hook Stride on a different body; Null Brand after a taxed landing  
BALANCE_RISK: Taxing a 3-MP hook landing is a tempo puzzle, not a lock. 3 AP / CD 3. Must not become Pack Hook.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. Pet walks do not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wide-gift`

NAME: Wide Gift  
ROLE: SUPPORT — heal iff leftover AP ≥ 2 and leftover MP ≥ 1  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; `G ≥ 18`; `aiProfile` healer. **Healer CORE only**  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 18`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: true  
COOLDOWN: 2  
EFFECT: Heal 8 iff the **target** leftover AP **≥ 2 AND** leftover MP **≥ 1** (`effectParams: {"requireLeftoverApGe2AndMpGe1":true,"wideGiftHeal":8}`). `healAmount` stays 0 on the row so `inferArchetype` does not silently reclassify a mixed kit — assign only to healer CORE. Off-window fizzles (AP spent, no HP). Distinct from Gait Gift (AP ≥ 2 **and** MP = 0), Lean Gift (AP = 0 **and** MP ≥ 1), Prime Gift (**1/1**), Equal Gift (AP **==** MP ≥ 1), Score Mend (both-body leftover **sum === 4 AND unequal**), Stave Mend (both-body leftover **sum === 5**), Hollow Gift / Gaunt Mend (0=0).  
SCALING: heal follows existing heal growth; leftover gate fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_ge_2_and_mp_ge_1"`. Healer. Skip if leftover is AP≥2/MP=0 (Gait Gift) or 1/1 (Prime Gift). **Do not** assign to non-healer CORE.  
PLAYER_COUNTERPLAY: Spend the target to 1 AP or 0 MP before the cast; Mute Thread  
SYNERGIES: Wide Sting on the same leftover window; Tempo Gift so they hold AP+MP  
BALANCE_RISK: Healing a fat leftover is real. One-body gate + healer-CORE lock. Do not clone Stave Mend.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-window fizzle still observes. Player-side HP gain uses existing `healUsed` only when HP actually increased.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-quad`

NAME: Cadence Quad  
ROLE: CONTROL — remaining CDs n>4 become 4  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 18`; `aiProfile` controller/caster  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: For each remaining cooldown `n` on the target, if `n>4` set it to 4; 0/1/2/3/4 stay (`effectParams: {"capRemainingCdsAbove4To4":true}`). Distinct from Cadence Tern (`n>3` → 3), Cadence Cap (`n>2` → 2), Cadence Floor (`n>1` → 1), Cadence Dock (`n===2` → 0), Cadence Snuff (`n===1` → 0), Cadence Stall (+1 all remaining), Quad Oath (spell gate exactly 4), Quad Span (occupy-weight 4).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cap_remaining_cds_gt_4_to_4"`. Controller / caster. Skip if all remaining are 0/1/2/3/4 (use Tern / Cap / Floor / Dock).  
PLAYER_COUNTERPLAY: Hold remaining CDs at 4 or below; Paper Wind  
SYNERGIES: Cadence Stall first so a 3 becomes >4 then Quad caps it; Quiet Hex after the cap  
BALANCE_RISK: Capping long CDs to 4 is a tempo tax, not a strip. 2 AP / CD 3. Must not become Cadence Tern or Cadence Dock.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-even-toll`

NAME: Even Toll  
ROLE: CONTROL — next walk +1 AP if leftover AP is even ≥ 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 18`; `aiProfile` controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Flag, until consumed or the target’s next turn end. The target’s next **walk** costs +1 AP if leftover AP is **even ≥ 2** (`effectParams: {"nextWalkApTaxIfLeftoverApEvenGe2":true}`). Leftover AP odd or 0/1 fizzles the tax (Even Toll already observed). Distinct from Odd Toll (leftover **AP odd**), Gait Toll (leftover **MP = 0**), Still Toll (next **spell** if leftover MP = 0), Walk Toll (ungated), Strike Debt (next walk if they Struck), Even Gait (damage if leftover MP even ≥ 2). Not `spell.mpCost`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_leftover_ap_even_ge_2"`. Controller. Skip if leftover AP odd (use Odd Toll).  
PLAYER_COUNTERPLAY: Spend to odd leftover AP before walking; Root so they do not walk  
SYNERGIES: Tempo Gift so they hold even AP; Brick Hold so the taxed walk is their only option  
BALANCE_RISK: +1 AP on a fat leftover walk is a tempo puzzle. 2 AP / CD 2. Must not become Odd Toll.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-window fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-fee`

NAME: Brick Fee  
ROLE: CONTROL — next spell +1 AP while adjacent to a barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 18`; `aiProfile` controller/tank  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 18`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Flag, until consumed or the target’s next turn end. The target’s next **non-Strike spell** costs +1 AP while they are adjacent to a barrier (`effectParams: {"nextSpellApTaxIfAdjacentBarrier":true}`). No adjacent barrier fizzles the tax (Brick Fee already observed). Strike / `physical_attack` stays untaxed. Distinct from Brick Tax (next **walk** +1 AP), Brick Hold (walk **forbidden**), Brick Brace (negate a **hit**), Quiet Hex (ungated next-spell tax), Watch Tax (overwatch next-spell tax). Not `spell.mpCost`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "tax_next_spell_if_adjacent_barrier"`. Controller / tank. Skip if no barrier (use Brick Tax if the next **walk** should be taxed).  
PLAYER_COUNTERPLAY: Step off the barrier before casting; Strike instead; Paper Wind  
SYNERGIES: Barrier drop adjacent to them; Brick Tax on a different body  
BALANCE_RISK: Taxing a cornered caster is real. Barrier gate + Strike exempt. Must not become Quiet Hex or Brick Tax.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-barrier fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-bind`

NAME: Watch Bind  
ROLE: CONTROL — overwatch snap forbids the walker’s next walk  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `hood_lurker`; `G ≥ 18`; `aiProfile` kiter/sniper  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 18`  
RARITY: ELITE  
AP_COST: 3  
RANGE: 5  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Paint one floor cell (`overwatchDuration` 1 turn). The next walker who **enters** the cell has their **next walk** confirm-fail (MP not spent) (`effectParams: {"overwatchSnapForbidWalkerNextWalk":true}`). Snap consumes the paint. Distinct from Watch Tax (next **spell** +1 AP), Watch Root (zeros leftover **MP now**), Watch Drain (steals 1 leftover MP), Brick Hold (cannot walk **while adjacent to a barrier**), Gap Ward (skips overwatch). Not `spell.mpCost`. Does **not** add an evasion roll.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_forbid_walker_next_walk"`. Kiter / sniper. Skip if they should lose leftover MP now (Watch Root) or pay next-spell AP (Watch Tax).  
PLAYER_COUNTERPLAY: Do not enter the cell; blink / swap instead of walking; send a pet  
SYNERGIES: Far Watch covering the cell; Root after the snap so they cannot reposition by spell  
BALANCE_RISK: Forbidding the next walk is a hard lock. Ground paint + 3 AP / CD 3 / one snap. Must not become Watch Root or Brick Hold.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**. The snap is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-prime-gait`

NAME: Prime Gait  
ROLE: DAMAGE — bonus if leftover 1/1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; `G ≥ 18`; `aiProfile` bruiser/caster  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥18. `generationMin: 18`  
RARITY: ADVANCED  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target** leftover AP **=== 1 AND** leftover MP **=== 1**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApEq1AndMpEq1":true,"primeGaitBonus":8}`). Leftover 1/0, 2/0, 0/1, and 2/2 are 10. Distinct from Thin Gait (leftover **1/0**), Even Gait (leftover MP **even ≥ 2**), Odd Gait (leftover MP **odd**), Prime Gift (heal on 1/1), Prime Plate (negate on 1/1), Wide Sting (AP ≥ 2 **and** MP ≥ 1).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_1_and_mp_eq_1"`. Bruiser / caster. Skip if leftover is 1/0 (Thin Gait) or AP≥2/MP≥1 (Wide Sting).  
PLAYER_COUNTERPLAY: Spend the last AP or the last MP before the poke; Barrier  
SYNERGIES: Prime Plate / Prime Gift on the same leftover window (do **not** CORE all three on one kit)  
BALANCE_RISK: 18 on a 1/1 leftover is Frost-adjacent on 2 AP CD 1. Leftover gate. Do not also fire Thin Gait’s rider.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-window still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-slide-cut`

NAME: Slide Cut  
ROLE: DAMAGE — bonus if near painted conveyor occupancy  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `plague_rat`; `G ≥ 18`; `aiProfile` flanker/controller  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 18`  
RARITY: ELITE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is Chebyshev ≤ 2 from **painted conveyor occupancy**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfNearSlideOccupancy":true,"slideCutRadius":2,"slideCutBonus":8}`). Twin Gate pads, `map.portals`, live lava/ice/spikes, and painted mire do **not** count. Distinct from Lava Cut (lava occupancy), Rime Cut (ice), Spike Cut (spikes), Hazard Cut (painted hazard), Portal Cut (world portals), Slide Reel (pull), Slide Skip (ignore auto-push).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_slide_occupancy"`. Flanker / controller. Skip if no painted conveyor in radius 2.  
PLAYER_COUNTERPLAY: Step off the mill; blink; Barrier the conveyor  
SYNERGIES: Slide Tile then Slide Cut; Slide Reel onto the mill then Cut  
BALANCE_RISK: 18 next to a mill is Frost-adjacent on 2 AP CD 1. Occupancy gate. Dest/bonus must fail closed off world portals.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-mill still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-idle-plate`

NAME: Idle Plate  
ROLE: DEFENSE — next hit is 0 while leftover MP equals max  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; `G ≥ 18`; `aiProfile` tank/warden  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 18`  
RARITY: ELITE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Until consumed or this unit’s next turn end. The next incoming hit deals 0 while leftover MP **equals that body’s max MP** (`effectParams: {"negateHitIfLeftoverMpEqualsMax":true}`). Walking (leftover MP < max) drops the window; the charge remains until a hit or expiry. Distinct from Dry Plate (leftover **MP = 0**), Thin Plate (leftover **1/0**), Prime Plate (leftover **1/1**), Capped Sting (damage bonus on leftover MP equals max), Cast Plate (outgoing non-Strike deals 0), Idle Mark (cell detonate).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_mp_equals_max"`. Tank / warden. Skip if leftover MP = 0 (Dry Plate) or leftover 1/0 (Thin Plate).  
PLAYER_COUNTERPLAY: Force a walk first; wait the charge out  
SYNERGIES: Idle Mark so a rooted non-walker eats both; Capped Sting on a different body  
BALANCE_RISK: Negating a hit because they have not walked is a real tank beat. 2 AP / CD 2 / one consume. Must not become Dry Plate or Capped Sting.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Observation is the **arm**.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-hook`

NAME: Pack Hook  
ROLE: SIGNATURE — pack walks locked to (3,1) dests  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `hook_precentor`; variant CHAMPION; `G ≥ 18`  
ENEMY_FAMILIES: `hook_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE_POOL. `generationMin: 18`  
RARITY: SIGNATURE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: Aura (`packAuraRadius` 6, `packAuraDuration` 2). Living pack allies’ walks confirm only if the dest is a permutation of `(3,1)` from that walk’s origin (`effectParams: {"packWalkHook31":true,"packAuraRadius":6,"packAuraDuration":2}`). Orthogonal, diagonal, knight, and Chebyshev-2 dests confirm-fail. Distinct from Pack Ring (Chebyshev **exactly 2**, knight excluded), Pack Orth (orthogonal any length), Pack Diag (diagonal only), Pack File / Pack Rank (one file / one rank), Hook Stride (one next walk from **self**). **Never owned.** Do not CORE with Pack Ring / Pack Orth / Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_hook_3_1"`. Pack champion only. Living pack allies exist. **Never owned.**  
PLAYER_COUNTERPLAY: Occupy the eight hook cells around each pack ally; Root the champion  
SYNERGIES: `hook_precentor` identity; Hook Stride on a different family  
BALANCE_RISK: Locking a pack to (3,1) dests is a signature puzzle. Never persist. Must not become Pack Ring.  
PERSISTENCE_REQUIREMENTS: `ENEMY_ONLY`. Never write `ownedSpellIds` / `spellLevelKeys`. Aura ticks without a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hook-fold`

NAME: Hook Fold  
ROLE: SIGNATURE — swap two player-side bodies that share a (3,1) vector  
ACQUISITION_SOURCE: BOSS  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `hook_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `hook_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE_POOL. `generationMin: 18`  
RARITY: SIGNATURE  
AP_COST: 5  
RANGE: 8  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap two living **player-side** bodies whose relative dest is a permutation of `(3,1)` (`effectParams: {"foldTwoPlayerSideShareHook31":true,"foldDamage":6}`). Deal 6 (spell, RES+SR) to each after the swap. Shared rank/file at Chebyshev 3 (Lane Fold), Chebyshev 3 any geometry (Leap Fold), Chebyshev 1 (Adj Fold), Chebyshev 4 (Far Fold), and Chebyshev 2 (Reach Fold) are illegal. Distinct from Lane Fold, Leap Fold, Knight Fold, File Fold, Rank Fold, Mid Fold, Diag Fold. **Never owned.** Optional dim `UNKNOWN TECHNIQUE` log. Claim Ward does not block this (unit swap, not cell claim).  
SCALING: foldDamage follows dmg%; geometry fixed  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_share_hook_3_1"`. Boss AI only. Two living player-side bodies that share a (3,1) vector. **Never owned.**  
PLAYER_COUNTERPLAY: Do not stand on a (3,1) from an ally; blink one body off; send a pet so the pair is not both player-side  
SYNERGIES: `hook_fold_regent` identity; Claim Ward does not block this  
BALANCE_RISK: Swapping a player and a controlled summon onto a mill is a boss beat. Never persist. Must not become Lane Fold or Leap Fold.  
PERSISTENCE_REQUIREMENTS: `BOSS_ONLY`. Never write `ownedSpellIds` / `spellLevelKeys`.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 18 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…17 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥18 | `spell-hook-stride`, `spell-hook-bite` |
| `rank_lancer` | RARE / G≥18 | `spell-hook-stride` |
| `shadow_lurker` | RARE / G≥18 | `spell-hook-bite` |
| `glass_sniper` | RARE / G≥18 | `spell-nona-oath` |
| `glass_sniper` | ELITE | `spell-watch-bind` |
| `pale_cantor` | RARE / G≥18 | `spell-nona-oath` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-wide-gift` (healer CORE only) |
| `tide_shade` | RARE / G≥18 | `spell-slide-reel`, `spell-brier-skip` |
| `plague_rat` | RARE / G≥18 | `spell-brier-skip` |
| `plague_rat` | ELITE | `spell-slide-cut` |
| `rime_mason` | RARE / G≥18 | `spell-slide-reel`, `spell-brick-fee` |
| `glyph_sower` | RARE / G≥18 | `spell-idle-mark` |
| `glyph_sower` | ELITE | `spell-slide-cut` |
| `bone_scribe` | RARE / G≥18 | `spell-idle-mark`, `spell-prime-gait` |
| `purse_scribe` | RARE / G≥18 | `spell-prime-gait` |
| `plate_warden` | ADVANCED / G≥18 | `spell-thin-plate`, `spell-wide-sting` |
| `iron_golem` | ADVANCED / G≥18 | `spell-thin-plate`, `spell-wide-sting` |
| `stone_castellan` | RARE / G≥18 | `spell-brick-fee` |
| `brood_chanter` | ELITE | `spell-summon-hook`, `spell-idle-plate` |
| `cadence_thief` | RARE / G≥18 | `spell-cadence-quad` |
| `hex_chorister` | RARE / G≥18 | `spell-cadence-quad` |
| `tax_scribe` | RARE / G≥18 | `spell-even-toll` |
| `ley_tollkeeper` | RARE / G≥18 | `spell-even-toll` |
| `hood_lurker` | ELITE | `spell-watch-bind` |
| `hook_precentor` CHAMPION | SIGNATURE | `spell-pack-hook` (`ENEMY_ONLY`; not with Pack Ring / Pack Orth / Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit) |
| `hook_fold_regent` | BOSS_ONLY | `spell-hook-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-18 family CORE is **#1138** (consumes #1017 and #1063)

**#1138** consumes remaining **#1017** unique Wave-16 verbs (minus Prime Gift / Cast Plate on non-healer kits; minus Pack Orth / Leap Fold) and **#1063** tactical Wave-17 ids (minus Court Dock; Stave Mend healer CORE only) in **CORE**. Family ids: `stave_mender`, `cadence_docker`, `dodeca_prelate`, `hymn_turner`, `stave_hooder`, `stave_stinger`, `stave_stepper`, `stave_siller`, `stave_holder`, `stave_lender`, `stave_sipper`, `stave_prelate`, `stave_bouncer`, `must_staver`, `verse_staver`, `ring_warder`, `hepta_oather`, `rime_reeler`, `rank_biter`, `last_marker`, `dual_plater`, `rift_skipper`, `fresh_stinger`, `summon_filer`, `prime_gifter`, `cadence_capper`, `gait_toller`, `brick_holder`, `watch_drainer`, `even_gaiter`, `rime_cutter`, `cast_plater`. Unique §11 ids may appear there only as G≥18 extras in a later family pass (Wave 20), not as this document’s CORE and **not** as #899 / #941 / #997 / **#1073** / **#1138** CORE. Do **not** put unique §11 ids in #840 CORE, #899 CORE, #941 CORE, #997 CORE, **#1073** CORE, or **#1138** CORE. Do **not** restamp #941 `ENEMY_ID`s (`poise_mender` … `drift_gifter`). Do **not** restamp #997 `ENEMY_ID`s (`tally_mender` … `shove_gifter`). Do **not** restamp **#1073** `ENEMY_ID`s (`score_mender` … `summon_plater`). Do **not** restamp **#1138** `ENEMY_ID`s. Do **not** name unique §11 families after #899, #941, #997, **#1073**, or **#1138** `ENEMY_ID`s. `hook_precentor` is not `ring_warder`. `hook_fold_regent` is not `dodeca_prelate`.

Stamp, do not clone #1017: Ring Stride, Hepta Oath, Rime Reel, Rank Bite, Last Mark, Dual Plate, Rift Skip, Fresh Sting, Summon File, Cadence Cap, Gait Toll, Brick Hold, Watch Drain, Even Gait, Rime Cut. Prime Gift stays healer CORE only. Pack Orth stays `ENEMY_ONLY` on `lane_precentor`. Leap Fold stays `BOSS_ONLY` on `leap_fold_regent`.

Stamp, do not clone #1063: Stave Mend (healer CORE only), Cadence Dock, Dodeca Span (implementation-blocked while summon cap is 2), Hymn Turn, Stave Hood, Stave Sting, Stave Step, Stave Sill, Stave Hold, Stave Lend, Stave Sip, Stave Post, Stave Bounce, Must Stave, Verse Stave. Court Dock stays `NOT_PLAYER_LEARNABLE` on `court_dock_regent`. Do **not** CORE Must Stave with Stave Hold. Do **not** CORE Cadence Dock with Cadence Cap / Cadence Rise / Cadence Prime / Cadence Floor / Cadence Tern / Cadence Quad. Do **not** CORE Stave Mend with Wide Gift / Gait Gift / Prime Gift / Tally Mend / Equal Gift / Poise Mend / Lean Gift / Score Mend. Do **not** CORE Hymn Turn with Purse Turn / Tempo Invert / Bar Cross / Duel Turn. Do **not** CORE Cadence Quad with Cadence Tern.

**SDE wins** unique leftover collisions: Wide Gift stays leftover AP **≥ 2 AND** leftover MP **≥ 1**; Cadence Quad stays remaining `n>4` → `4`; Thin Plate stays leftover **1/0** negate. Do **not** mint `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-quint-mend` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-thirteen-span` / `spell-hook-line` / `spell-cadence-trey` / `spell-mixed-turn`. **#1063** owns `spell-dodeca-span` — stamp, do not clone. **#1132** owns `spell-trideca-span` / `spell-sestet-mend` / `spell-cadence-tierce` / `spell-psalm-turn` — stamp, do not clone.

### 12.2 Wave-17 unique extras (deferred)

#1082 unique Wave-17 verbs (`spell-tern-stride` … `spell-lane-fold`) stay G≥17 extras until Wave 19 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Ring stays `ENEMY_ONLY` on `hoop_precentor`. Lane Fold stays `BOSS_ONLY` on `lane_fold_regent`.

### 12.3 Same-day tactical CORE (Wave 19)

**#1132** opened (`SPELL_PROPOSALS_2026-10-26.md`). **Stamp it as Wave 19 family CORE** together with unique Wave-17 §11 (#1082). Do **not** put those ids in Wave-18 family CORE (#1138) or unique §11. Unique §11 stay this catalog’s until Wave 20. Do **not** CORE Must Sestet with Sestet Hold. Do **not** CORE Cadence Tierce with Cadence Quad / Cadence Tern / Cadence Cap / Cadence Dock / Cadence Snuff. Do **not** CORE Sestet Mend with Wide Gift / Gait Gift / Prime Gift / Stave Mend / Score Mend. Do **not** CORE Psalm Turn with Hymn Turn / Purse Turn / Tempo Invert / Bar Cross / Duel Turn.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 19 forever

Same recipe as Wave 17 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 19 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #890 / #953 / #1011 / **#1063** / **#1132** extra doors. Do not restamp #906 / #962 / **#1017** / **#1082** rooms. Do not restamp #899 / **#941** / **#997** / **#1073** / **#1138** family ids. Do not restamp #903 / **#951** / **#1004** / **#1080** / **#1139** extra doors. Do not consume #771 primer room ids. Do not consume #826 / #885 / #957 / **#1006** / **#1056** / **#1121** ENC-* ids. Do not consume #949 / **#993** / **#1064** / **#1114** `WF-*`. Do not mint `spell-even-plate` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-eleven-span` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-thirteen-span` / `spell-quint-mend` / `spell-hook-line` / `spell-cadence-trey` / `spell-mixed-turn`. Stamp **#1063** `spell-dodeca-span`; stamp **#1132** `spell-trideca-span`; do not clone them.

Suggested Wave-19 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-17 §11 verbs **and** **#1132** (this catalog’s unique ids stay extras until Wave 20); one next walk permutation of **(3,2)**; leftover AP − leftover MP === 2 (collides with Score (3,1) and Sestet (4,2)). Invert leftover AP↔MP on **ally** is **Wave 3 Tempo Invert**. Hostile invert is **#953 Purse Turn**. Two-hostile invert is **#1011 Duel Turn**. Two-ally invert (caster stays) is **#1063 Hymn Turn**. Mixed-side invert (caster stays) is **#1132 Psalm Turn**. Two-body leftover cross is **#890 Bar Cross**. Eight-cell occupy is **#849 Oct Span**. Nine-cell occupy is **#890 Nine Span**. Ten-cell occupy is **#953 Dec Span**. Eleven-cell occupy is **#1011 Hendeca Span**. Twelve-cell occupy is **#1063 Dodeca Span**. Thirteen-cell occupy is **#1132 Trideca Span**. Both-body leftover sum===4 unequal heal is **#1011 Score Mend**. Both-body leftover sum===5 heal is **#1063 Stave Mend**. Both-body leftover sum===6 unequal heal is **#1132 Sestet Mend**. Remaining `1→0` is **#1011 Cadence Snuff**. Remaining `2→0` is **#1063 Cadence Dock**. Remaining `3→0` is **#1132 Cadence Tierce**. Remaining `n>2`→`2` is **#1017 Cadence Cap**. Remaining `n>3`→`3` is **#1082 Cadence Tern**. Remaining `n>4`→`4` is this wave’s Cadence Quad. Chebyshev-3 orthogonal next walk is #1082 Tern Stride. Chebyshev-2-not-knight next walk is #1017 Ring Stride. (3,1) next walk is this wave’s Hook Stride. Pack Ring stays `ENEMY_ONLY` on `hoop_precentor`. Pack Hook stays `ENEMY_ONLY` on `hook_precentor`. Lane Fold stays `BOSS_ONLY` on `lane_fold_regent`. Leap Fold stays `BOSS_ONLY` on `leap_fold_regent`. Hook Fold stays `BOSS_ONLY` on `hook_fold_regent`. Court Dock stays kit-only on `court_dock_regent`. Court Tierce stays kit-only on `court_tierce_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / #802 / #808 / #837 / #849 / #836 / #890 / #899 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** / **#1017** / **#1063** / **#1073** / **#1078** / **#1080** / **#1082** / **#1132** / **#1138** / **#1139** / **#1140** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W18-A. G≥18 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W18-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W18-C. Wave-18 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #1017 / #1063 / #1082 / #1132 ids |
| W18-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub |
| W18-E. No new feat/challenge/boss stamps | — | Doka formula; `unstoppable`; leftover `survivor` |
| W18-F. Painted conveyor occupancy / Thorned Ground pathLength | Slide Tile tables; existing `thornedGroundWalkDamage` | `map.portals`; new `HazardTileType`; editing Thorned Ground extra numbers |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll.

Watch Bind must not add an evasion roll to `dealDamage`. Slide Cut must not edit RES/SR/CHC math. Nona Oath must not clone Nine Span. Brier Skip must not retune `thornedGroundWalkDamage`.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 17 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W18-1 | Encounter start | Possessed-but-unused G18 id does not observe |
| W18-2 | Hook Stride dest orthogonal, diagonal, knight, (3,2), or Chebyshev ≠ 3 | Confirm fails; MP not spent; Hook Stride already observed |
| W18-3 | `hook_gallery` defeat | Does not grant. Victory grants once |
| W18-4 | `tern_gallery` / `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `even_gallery` / `pair_gallery` / `knight_gallery` | Do not grant Hook Stride |
| W18-5 | Nona Oath then Frost at Chebyshev 7, 8, or 10 | Confirm fails; Strike still legal |
| W18-6 | Slide Reel no painted conveyor | Fizzle observes; no pull. Dest is not `map.portals`, not live lava/ice/spikes, not painted mire |
| W18-7 | Hook Bite on-rank, on-file, on-diagonal, or (2,1) | 10 only. Diag Bite would want `|dx|==|dy|`. File Bite would want shared **x**. Rank Bite would want shared **y**. Knight Pierce would want `(2,1)` |
| W18-8 | Idle Mark Strike-from / walk-enter / teleport landing / last-AP / leftover MP < max at turn end | No detonate. Dwell Mark would detonate on any end-turn occupy. Last Mark would detonate on last AP. Summon Mark would detonate on spawn |
| W18-9 | Thin Plate hit while leftover not 1/0 | Full hit; charge remains. Hit while leftover 1/0 consumes. Prime Plate would want leftover 1/1. Dual Plate would want both leftovers even ≥ 2. Dry Plate would want leftover MP = 0 |
| W18-10 | Brier Skip across lava / spikes / ice leave-tax / glyph-tax / Void Rift / conveyor / pathLength 1 / pathLength ≥ 3 | Those taxes still tick. Skip is Thorned Ground extra + pathLength 2 only. PathLength 1 already deals 0 Thorned extra |
| W18-11 | Wide Sting leftover 1/0, 1/1, 2/0, or AP even ≥ 2 with MP = 0 | 10 only. Thin Gait would bonus leftover 1/0. Prime Gait would bonus leftover 1/1. Even Sting would bonus leftover AP even ≥ 2 |
| W18-12 | Summon Hook vs Summon Orth vs Summon File vs Summon Rank vs Pack Hook | Pets pay AP to **land (3,1) from origin** vs **walk diagonal** vs **off file** vs **off rank** vs pack **(3,1) lock** |
| W18-13 | Wide Gift after leftover 1/1 or 2/0 or 0/≥1 | Fizzle observes; no heal. Prime Gift would want 1/1. Gait Gift would want AP≥2/MP=0. Lean Gift would want AP=0/MP≥1. Equal Gift would want AP==MP ≥ 1. Score Mend would want both-body sum === 4 unequal. Stave Mend would want both-body sum === 5. Sestet Mend would want both-body sum === 6 unequal |
| W18-14 | Cadence Quad vs Tern vs Cap vs Floor vs Rise vs Prime vs Stall vs Snuff vs Dock vs Tierce | Remaining `n>4` → 4 vs `n>3` → 3 vs `n>2` → 2 vs `n>1` → 1 vs `n==1` → 2 vs `n==0` → 1 vs +1 **all** vs `n===1` → 0 vs `n===2` → 0 vs `n===3` → 0 |
| W18-15 | Even Toll while leftover AP odd or 0/1 | Fizzle observes. Odd Toll would tax a walk if leftover **AP is odd**. Gait Toll would tax a walk if leftover **MP = 0** |
| W18-16 | Brick Fee with no adjacent barrier | Fizzle observes; spells untaxed. Brick Tax would tax the **walk**. Brick Hold would forbid the walk. Brick Brace would negate a hit |
| W18-17 | Watch Bind vs Tax vs Drain vs Root vs Sip vs Bank vs Far Watch | Snap forbids next **walk** vs taxes next **spell** +1 AP vs steals leftover **MP** vs zeros leftover **MP** vs steals AP vs banks AP vs deals damage |
| W18-18 | Prime Gait leftover 1/0, 2/0, or 0/1 | 10 only. Thin Gait would bonus leftover 1/0. Prime Gift / Prime Plate would want 1/1 as heal / negate. Wide Sting would bonus AP≥2/MP≥1 |
| W18-19 | Slide Cut far from conveyor / on a Twin Gate pad / next to lava only | 10 only. Lava Cut would want lava occupancy. Rime Cut would want ice occupancy. Spike Cut would want spike occupancy. Portal Cut would want `map.portals`. Slide Reel would pull |
| W18-20 | Idle Plate then a walk then a hit | Walking drops leftover MP below max; hit deals full; charge remains until expiry. Dry Plate would want leftover MP = 0. Capped Sting would bonus leftover MP equals max as **damage** |
| W18-21 | Pack Hook / Hook Fold | Never in `ownedSpellIds` |
| W18-22 | Loaner / `WF-SPL-*` / #771 primer / #826 / #885 / #957 / #1006 / **#1056** / **#1121** ENC-* / **#1064** / **#1114** WF-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W18-23 | G=17 Tide | No Hook Stride / Even Toll (`generationMin: 18`) |
| W18-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W18-25 | No cloned ids | Unique §11 ids absent from #906 / #953 / #962 / #1011 / **#1017** / **#1063** / **#1082** catalogs |
| W18-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Even Toll / Summon Hook / Pack Hook / Watch Bind / Brick Fee are flags |
| W18-27 | Hex Toll | Still not in any SDE pool |
| W18-28 | Memory Wave-5 / Wave-17 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W18-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W18-30 | #890 extra doors | `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` not restamped |
| W18-30b | #906 rooms / doors | `rank_gallery` / `rank_precentor` / `rank_fold_regent` / `mire_nave` not restamped |
| W18-30c | #899 family ids | Unique §11 not CORE on `gaunt_mender` … `axis_cutter`. `hook_precentor` / `hook_fold_regent` not #899 ids |
| W18-30d | #903 extra doors | `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` not restamped |
| W18-30e | #962 rooms / doors | `file_gallery` / `diag_precentor` / `far_fold_regent` not restamped |
| W18-30f | #941 family ids | Unique §11 not CORE on `poise_mender` … `drift_gifter`. `hook_gallery` is not `knight_gallery`. `hook_precentor` is not `axis_biter` |
| W18-30g | #951 extra doors | `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` not restamped. `hook_fold_regent` is not those ids |
| W18-30h | #953 tactical ids | Unique §11 does not clone Tally Mend / Cadence Prime / Dec Span / Purse Turn. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` not restamped |
| W18-30i | #957 ENC-* | `ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` not consumed as spell grants |
| W18-30j | #997 family ids | Unique §11 not CORE on `tally_mender` … `shove_gifter`. `hook_precentor` is not `rank_warder`. `hook_fold_regent` is not `dec_prelate` |
| W18-30k | #1004 extra doors | `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` not restamped |
| W18-30r | #1080 extra doors | `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` not restamped. `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` never owned. `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor` not remapped. Unique §11 does not clone Pair Slide / Both Mend / Heave Mend / Parched Mend |
| W18-30s | #1078 SDA files | `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` not overwritten. SDA-175…189 not re-filed |
| W18-30l | #1006 ENC-* | `ENC-GAUNT-01` / `ENC-EVEN-02` / `ENC-TRI-01` / `ENC-DUMP-01` not consumed as spell grants |
| W18-30m | #1011 tactical ids | Unique §11 does not clone Score Mend / Cadence Snuff / Hendeca Span / Duel Turn. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` not restamped |
| W18-30n | #1017 rooms / doors | `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent` not restamped. Unique §11 does not clone Ring Stride / Cadence Cap / Pack Orth / Leap Fold. Those ids stamp as Wave-18 family CORE |
| W18-30o | #1063 tactical ids | Unique §11 does not clone Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn. Cadence Quad is `n>4` → 4, not `2→0`. Wide Gift is AP≥2/MP≥1, not both-body sum===5. Thin Plate is leftover 1/0, not Stave Hood. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` not restamped |
| W18-30x | #1132 tactical ids | Unique §11 does not clone Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn. Cadence Quad is `n>4` → 4, not `3→0`. Wide Gift is AP≥2/MP≥1, not both-body sum===6 unequal. Thin Plate is leftover 1/0, not Sestet Hood. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` not restamped |
| W18-30y | #1138 family ids | Unique §11 not CORE on `stave_mender` … `cast_plater`. `hook_precentor` is not `ring_warder`. `hook_fold_regent` is not `dodeca_prelate` |
| W18-30z | #1139 extra doors | `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost` not restamped. `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` never owned. `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar` not remapped |
| W18-30aa | #1140 SDA files | `ACTION_IDS_SDA_2026-10-26.md` / `SPELL_ADMIN_DESIGN_2026-10-26.md` not overwritten. SDA-190…204 not re-filed |
| W18-30p | #1073 family ids | Unique §11 not CORE on `score_mender` … `summon_plater`. `hook_precentor` is not `file_warder`. `hook_fold_regent` is not `hendeca_prelate` |
| W18-30q | #1056 ENC-* | `ENC-TEACH-17` / `ENC-SPELL-33` / `ENC-POISE-01` / `ENC-TIED-01` / `ENC-KNIGHT-01` / `ENC-PIT-02` / `ENC-WAVE-18` not consumed as spell grants |
| W18-30t | #1082 rooms / doors | `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent` not restamped. Unique §11 does not clone Tern Stride / Cadence Tern / Pack Ring / Lane Fold. `belt_nave` still teaches Slide Skip, not Slide Reel |
| W18-30u | #1121 ENC-* | `ENC-TEACH-18` / `ENC-SPELL-35` / `ENC-SPELL-36` / `ENC-TALLY-01` / `ENC-RANK-01` / `ENC-SPIKE-02` / `ENC-MIRE-01` / `ENC-RUSH-67`…`70` not consumed as unique §11 grants. Rank Stride + Penta Oath stay Rank, not Hook / Nona. Spike Reel stays Spike, not Slide Reel. Mire Skip stays Mire, not Brier Skip |
| W18-30v | #1114 WF-* | `WF-HAZ-PAIR_SEAM` / `WF-HAZ-BUSY_CINDER` / `WF-TRP-SKEW_PLATE` / `WF-TER-BRACE_COLUMN` / `WF-OBS-READY_SILL` / `WF-ZON-PAIR_FONT` / `WF-TEL-SKEW_STEP` / `WF-PRT-READY_GATE` / `WF-INV-READY_FILE` / `WF-ELT-READY_PICKET` / `WF-TRS-ROUND_CACHE` / `WF-SPL-READY_TUTOR` / `WF-RSK-PAIR_OATH` / `WF-MOD-ONCE_CAST` / `WF-EVT-READY_HOUR` / `WF-ENV-PAIR_DRAFT` never write `ownedSpellIds`. Ready Gate stays exploration-only |
| W18-30w | #1111 EBA / #1128 WDEAD | Zero extra doors. Do not invent Rush Table Q. Do not restamp `slide_porter` / `parched_preacher` |
| W18-31 | `spell-even-plate` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-hook-line` | Still tombstoned. Thin Plate is the 1/0 negate, not `even-plate`. Nona Oath is the exact-9 spell gate, not occupy-weight 9. Dodeca Span (#1063) owns twelve occupy. Hook Stride is a walk constraint, not Hook Line |
| W18-32 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–17, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, **#962**, **#1011**, **#1017**, **#1063**, **#1082**, or **#1132** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** / **#1080** / **#1139** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / #636 / #638 / #646 / #663 / #679 / #695 / #726 / #747 / #753 / #787 / #802 / #808 / #836 / #837 / #849 / #890 / #899 / #903 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** / **#1017** / **#1063** / **#1073** / **#1078** / **#1080** / **#1082** / **#1132** / **#1138** / **#1139** / **#1140** extra doors or family ids
- Consuming #771 `ENC-BASH-*` / `ENC-DRY-*` / `ENC-HOOD-*` as spell grants
- Consuming #826 / #885 / **#957** / **#1006** / **#1056** / **#1121** ENC-* as spell grants
- Consuming **#1114** Wave-18 `WF-*` as spell grants (`WF-SPL-READY_TUTOR` never writes `ownedSpellIds`)
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `ring_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `diag_gallery` / `knight_gallery` / `even_gallery` / `odd_gallery` / `rime_gallery` / `void_aisle` / `penta_nave` / `hexa_nave` / `hepta_nave` / `span_six` / `span_dec` / `span_hendeca` / `span_dodeca` / `mire_nave` / `frost_aisle` / `strike_pulpit` as Hook Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #752 CORE, #796 CORE, #840 CORE, #899 CORE, #941 CORE, **#997 CORE**, **#1073 CORE**, **#1138 CORE**, Wave-17 #1082 extras CORE, or **#1132** Wave-19 family CORE before Wave 20
- Cloning #906 (`spell-rank-stride` … `spell-rank-fold`), #953 (`spell-tally-mend` … `spell-court-prime`), **#962** (`spell-file-stride` … `spell-far-fold`), **#1011** (`spell-score-mend` … `spell-court-snuff`), **#1017** (`spell-ring-stride` … `spell-leap-fold`), **#1063** (`spell-stave-mend` … `spell-court-dock`), **#1082** (`spell-tern-stride` … `spell-lane-fold`), or **#1132** (`spell-sestet-mend` … `spell-court-tierce`) into unique §11
- Minting `spell-nona-span` / `spell-octa-span` / `spell-even-plate` / `spell-gaunt-floor` / `spell-hollow-mend` / `spell-cadence-trade` / `spell-parched-mend` / `spell-tempo-mirror` / `spell-tied-mend` / `spell-equal-mend` / `spell-tempo-cross` / `spell-walk-debt` / `spell-pack-far` / `spell-ten-span` / `spell-foe-invert` / `spell-tally-gift` / `spell-cadence-arm` / `spell-ash-skip` / `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-quint-mend` / `spell-twelve-span` / `spell-thirteen-span` / `spell-dump-gift` / `spell-hook-line` / `spell-thin-sting` / `spell-cadence-trey` / `spell-mixed-turn`. Stamp **#1063** `spell-dodeca-span` and **#1132** `spell-trideca-span`; do not clone them
- Shipping `spell-parched-mend` alongside Dry Gait
- Shipping a second `spell-cadence-floor` from #890
- Cloning Tern Stride as Hook Stride, Knight Stride as Hook Stride, Ring Stride as Hook Stride, Diag Bite as Hook Bite, File Bite as Hook Bite, Mire Reel as Slide Reel, Slide Skip as Brier Skip, Pack Ring as Pack Hook, Cadence Tern as Cadence Quad, Cadence Dock as Cadence Quad, Cadence Tierce as Cadence Quad, Gait Gift as Wide Gift, Stave Mend as Wide Gift, Sestet Mend as Wide Gift, Prime Plate as Thin Plate, Thin Gait as Wide Sting, Cast Plate as Idle Plate, Lava Cut as Slide Cut, or Lane Fold as Hook Fold

---

## 17. Wave-18 index

**Unique SDE ids (19):** hook-stride, nona-oath, slide-reel, hook-bite, idle-mark, thin-plate, brier-skip, wide-sting, summon-hook, wide-gift, cadence-quad, even-toll, brick-fee, watch-bind, prime-gait, slide-cut, idle-plate, pack-hook, hook-fold.

**#1017 stamps (do not clone; Wave-18 family CORE):** Ring Stride, Hepta Oath, Rime Reel, Rank Bite, Last Mark, Dual Plate, Rift Skip, Fresh Sting, Summon File, Prime Gift, Cadence Cap, Gait Toll, Brick Hold, Watch Drain, Even Gait, Rime Cut, Cast Plate, Pack Orth, Leap Fold.

**#1063 stamps (do not clone; Wave-18 family CORE):** Stave Mend, Cadence Dock, Dodeca Span, Hymn Turn, Stave Hood, Stave Sting, Stave Step, Stave Sill, Stave Hold, Stave Lend, Stave Sip, Stave Post, Stave Bounce, Must Stave, Verse Stave, Court Dock. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`.

**#1082 stamps (do not clone; Wave-19 extras):** Tern Stride, Octa Oath, Mire Reel, Diag Bite, Summon Mark, Prime Plate, Slide Skip, Capped Sting, Summon Orth, Gait Gift, Cadence Tern, Odd Toll, Brick Tax, Watch Tax, Thin Gait, Lava Cut, Strike Plate, Pack Ring, Lane Fold.

**#899 Wave-14 families (do not clone / do not CORE unique §11):** `gaunt_mender` … `axis_cutter` (31 sheets).

**#941 Wave-15 families (do not clone / do not CORE unique §11):** `poise_mender`, `nine_prelate`, `bar_crosser`, `poise_hooder`, `poise_stinger`, `poise_stepper`, `poise_siller`, `poise_holder`, `poise_lender`, `poise_sipper`, `poise_prelate`, `poise_bouncer`, `must_poiser`, `verse_poiser`, `knight_warder`, `quad_oather`, `pit_reeler`, `axis_biter`, `shove_marker`, `spent_plater`, `rime_skipper`, `full_stinger`, `summon_caster`, `hollow_gifter`, `cadence_swapper`, `strike_debter`, `brick_nudger`, `watch_sipper`, `lone_gaiter`, `hazard_cutter`, `drift_gifter`.

**#997 Wave-16 families (do not clone / do not CORE unique §11):** `tally_mender`, `cadence_primer`, `dec_prelate`, `purse_turner`, `tally_hooder`, `tally_stinger`, `tally_stepper`, `tally_siller`, `tally_holder`, `tally_lender`, `tally_sipper`, `tally_prelate`, `tally_bouncer`, `must_tallier`, `verse_tallier`, `rank_warder`, `penta_oather`, `spike_reeler`, `screen_biter`, `swap_marker`, `odd_plater`, `mire_skipper`, `odd_stinger`, `summon_verser`, `equal_gifter`, `cast_toller`, `brick_stepper`, `watch_banker`, `tied_gaiter`, `portal_cutter`, `shove_gifter`.

**#1073 Wave-17 families (do not clone / do not CORE unique §11):** `score_mender`, `cadence_snuffer`, `hendeca_prelate`, `duel_turner`, `score_hooder`, `score_stinger`, `score_stepper`, `score_siller`, `score_holder`, `score_lender`, `score_sipper`, `score_prelate`, `score_bouncer`, `must_scorer`, `verse_scorer`, `file_warder`, `hexa_oather`, `lava_reeler`, `file_biter`, `strike_marker`, `dry_plater`, `shock_skipper`, `even_stinger`, `summon_ranker`, `lean_gifter`, `cadence_riser`, `still_toller`, `brick_bracer`, `watch_rooter`, `odd_gaiter`, `spike_cutter`, `summon_plater`.

**#1138 Wave-18 families (do not clone / do not CORE unique §11):** `stave_mender`, `cadence_docker`, `dodeca_prelate`, `hymn_turner`, `stave_hooder`, `stave_stinger`, `stave_stepper`, `stave_siller`, `stave_holder`, `stave_lender`, `stave_sipper`, `stave_prelate`, `stave_bouncer`, `must_staver`, `verse_staver`, `ring_warder`, `hepta_oather`, `rime_reeler`, `rank_biter`, `last_marker`, `dual_plater`, `rift_skipper`, `fresh_stinger`, `summon_filer`, `prime_gifter`, `cadence_capper`, `gait_toller`, `brick_holder`, `watch_drainer`, `even_gaiter`, `rime_cutter`, `cast_plater`.

**#1132 stamps (do not clone; Wave-19 family CORE):** Sestet Mend, Cadence Tierce, Trideca Span, Psalm Turn, Sestet Hood, Sestet Sting, Sestet Step, Sestet Sill, Sestet Hold, Sestet Lend, Sestet Sip, Sestet Post, Sestet Bounce, Must Sestet, Verse Sestet, Court Tierce. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`.

**#951 Wave-16 extra doors (do not restamp):** `wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`.

**#1004 Wave-17 extra doors (do not restamp):** `boot_subprior`, `purse_steward`, `tick_infirmarer`, `mute_notary`.

**#1080 Wave-18 extra doors (do not restamp):** `slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`. Leftover Pair Slide / Both Mend / Heave Mend / Parched Mend. Spectacular `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` stay `BOSS_ONLY`. Do not remap `pair_usher` / `both_cantor` / `heave_cantor` / `parched_cantor`. First grant wins Parched Mend vs Dry Gait leftover-MP=0 heal. No new `#137` ids.

**#1139 Wave-19 extra doors (do not restamp):** `stride_chancellor`, `dual_treasurer`, `imprint_archdeacon`, `damp_provost`. Leftover Stride Keep / Dual Keep / Cadence Imprint / Damp Sting. Spectacular `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` stay `BOSS_ONLY`. Do not remap `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar`. Rush Table Q. No new `#137` ids.

**#1078 SDA 2026-10-25 (do not overwrite):** `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` (`SDA-2026-10-25-175`…`189`).

**#1140 SDA 2026-10-26 (do not overwrite):** `ACTION_IDS_SDA_2026-10-26.md` / `SPELL_ADMIN_DESIGN_2026-10-26.md` (`SDA-2026-10-26-190`…`204`).

**#953 extra doors (do not restamp):** `tally_cantor`, `prime_precentor`, `span_dec`, `court_prime_regent`.

**#1011 extra doors (do not restamp):** `score_cantor`, `snuff_precentor`, `span_hendeca`, `court_snuff_regent`.

**#1063 extra doors (do not restamp):** `stave_cantor`, `dock_precentor`, `span_dodeca`, `court_dock_regent`.

**#1132 extra doors (do not restamp):** `sestet_cantor`, `tierce_precentor`, `span_trideca`, `court_tierce_regent`.

**#1017 rooms / doors (do not restamp):** `ring_gallery`, `hepta_nave`, `frost_aisle`, `last_pulpit`, `rift_court`, `lane_precentor`, `leap_fold_regent`.

**#1082 rooms / doors (do not restamp):** `tern_gallery`, `octa_nave`, `bog_aisle`, `spawn_pulpit`, `belt_nave`, `hoop_precentor`, `lane_fold_regent`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-hook-stride` | ENEMY_DISCOVERY | yes | blink / rank_lancer G≥18 | **One** next walk permutation of (3,1) |
| `spell-nona-oath` | ENEMY_DISCOVERY | yes | glass / cantor | Next spell illegal unless Chebyshev = 9 |
| `spell-slide-reel` | ENEMY_DISCOVERY | yes | tide / rime | Pull 1 toward nearest painted conveyor occupancy |
| `spell-hook-bite` | ENEMY_DISCOVERY | yes | blink / lurker | Bonus if share a **(3,1)** vector |
| `spell-idle-mark` | ENEMY_DISCOVERY | yes | glyph / scribe | Cell detonates at turn end iff leftover MP **equals max** |
| `spell-thin-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next hit is 0 while leftover **1/0** |
| `spell-brier-skip` | ENEMY_DISCOVERY | yes | tide / plague | PathLength **2** walk ignores Thorned Ground extra |
| `spell-wide-sting` | ENEMY_DISCOVERY | yes | plate / golem | Leftover AP **≥ 2 AND** leftover MP **≥ 1** → bonus damage |
| `spell-summon-hook` | ELITE | yes | brood_chanter | Allied summons pay +1 AP to land a (3,1) walk |
| `spell-wide-gift` | ELITE | yes | pale / font cantor | Heal iff leftover AP ≥ 2 **and** leftover MP ≥ 1 |
| `spell-cadence-quad` | ENEMY_DISCOVERY | yes | cadence / hex | Remaining `n>4` → 4; 0/1/2/3/4 stay |
| `spell-even-toll` | ENEMY_DISCOVERY | yes | tax / ley | Next walk +1 AP if leftover **AP is even ≥ 2** |
| `spell-brick-fee` | ENEMY_DISCOVERY | yes | stone / rime | Next spell +1 AP while adjacent to a barrier |
| `spell-watch-bind` | ELITE | yes | glass / hood | Overwatch snap forbids the walker’s next walk |
| `spell-prime-gait` | ENEMY_DISCOVERY | yes | purse / scribe | Bonus if leftover AP **=== 1 AND** leftover MP **=== 1** |
| `spell-slide-cut` | ELITE | yes | glyph / plague | Bonus if target is Chebyshev ≤ 2 from painted conveyor occupancy |
| `spell-idle-plate` | ELITE | yes | brood_chanter | Next hit is 0 while leftover MP **equals max** |
| `spell-pack-hook` | ENEMY_ONLY | no | `hook_precentor` CHAMPION | Pack walks locked to permutation of (3,1) |
| `spell-hook-fold` | BOSS_ONLY | no | `hook_fold_regent` | Swap two player-side bodies that share a (3,1) vector |

All unique rows STATUS: **PROPOSED**.
