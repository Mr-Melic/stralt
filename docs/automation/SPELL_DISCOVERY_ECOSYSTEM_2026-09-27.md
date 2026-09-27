# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 10

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-27  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Wave 3 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md), PR #300) is Generation 3. Wave 4 (still-open #371) is Generation 4. Wave 6 (still-open #480) is Generation 6. Wave 7 (still-open #533) is Generation 7. Wave 8 (still-open #590) is Generation 8. Wave 9 (still-open #646) is Generation 9. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Wave 6 (#480) is Generation 6 so those memory ids stay tombstoned. Wave 7 (#533) is Generation 7. Wave 8 (#590) is Generation 8. Wave 9 (#646) is Generation 9. This document is **Generation 10**. `generationMin: 10`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-27.md`](./ACTION_IDS_SDE_2026-09-27.md).

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
| Wave-1…9 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-26.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 / #515 / #570 / #630 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | #342 | Gale Fan … Eclipse Fold |
| Tactical gap-fillers W5 | still-open #411 | Oncoming … Act Bell |
| Tactical gap-fillers W6 | still-open #463 | Post Sting … About Face |
| Tactical gap-fillers W7 | still-open #525 | Wall Sting … Court Shove |
| Tactical gap-fillers W8 | still-open #563 | Gait Mend … Court Hinge |
| Tactical gap-fillers W9 | still-open **#636** — `SPELL_PROPOSALS_2026-09-26.md` | Shove Mend … Court Stretch. **Stamp onto Wave-10 family CORE, do not clone**. Unique §11 stay this catalog’s. Extra doors `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent` — do not restamp |
| Family sheets | #136 + #349 + #405 + #452 + #535 + #558 + **#625** | #625 Wave-9 families consume **#563** plus leftover **#533** unique CORE. Wave-10 families consume **#636**. Dedicated CORE for Wave-8 unique verbs (#625 deferred those here) is that family sheet’s job. Do **not** put unique §11 ids there |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / #518 / #572 / **#638** / same-day **#663** | Extra doors claimed through Wave 11 (`crypt_sexton` … `orbit_succentor`; `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`). Do not restamp |
| PX coherence | #343 / #393 / #481 / #579 / #632 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-10 unique ids in §11 are new. If a later same-day tactical catalog claims a hole this document already authored, **SDE wins** the unique §11 id; that catalog must pick a different fantasy.

At audit start (2026-09-27 00:05 UTC) the only same-day open PR was #660 (enemy/boss admin re-audit). No Wave-10 tactical catalog (`SPELL_PROPOSALS_2026-09-27.md`) existed yet.

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

**Do not alias** `spell-inch-stride` ↔ `spell-pair-stride` / `spell-even-stride` / `spell-odd-stride` / `spell-must-span` / `spell-must-pace` / `spell-split-pace`, `spell-rite-first` ↔ `spell-verse-first` / `spell-cast-hold` / `spell-strike-hold` / `spell-boot-hold` / `spell-once-verse`, `spell-long-oath` ↔ `spell-near-oath` / `spell-unit-oath` / `spell-ground-oath` / `spell-glass-shot` / `spell-oath-blade`, `spell-cinder-reel` ↔ `spell-paint-reel` / `spell-foe-reel` / `spell-ally-reel` / `spell-file-reel` / `spell-cinder-tile`, `spell-side-bite` ↔ `spell-nook-bite` / `spell-field-bite` / `spell-wall-bite` / `spell-lone-sting` / `spell-flank-share`, `spell-ingress-mark` ↔ `spell-stride-mark` / `spell-gait-wick` / `spell-exit-sting` / `spell-enter-mend` / `spell-wound-mark`, `spell-off-plate` ↔ `spell-foe-plate` / `spell-morrow-plate` / `spell-far-hood` / `spell-tick-plate` / `spell-still-plate`, `spell-spike-skip` ↔ `spell-lava-skip` / `spell-pit-skip` / `spell-gap-ward` / `spell-safe-fall`, `spell-tapped-plate` ↔ `spell-still-plate` / `spell-dry-sting` / `spell-empty-plate` / `spell-planted-stance`, `spell-summon-brace` ↔ `spell-body-sill` / `spell-kennel-sill` / `spell-grounded-lock` / `spell-self-anchor` / `spell-kennel-lock`, `spell-bar-mend` ↔ `spell-clash-mend` / `spell-chase-mend` / `spell-gait-mend` / `spell-shove-mend` / `spell-enter-mend`, `spell-cadence-pin` ↔ `spell-cadence-stall` / `spell-cadence-shave` / `spell-cadence-flush` / `spell-cadence-stretch` / `spell-cadence-crack`, `spell-still-tax` ↔ `spell-gait-tax` / `spell-camp-tax` / `spell-quiet-hex` / `spell-debt-mark` / `spell-act-tax`, `spell-brick-sprout` ↔ `spell-brick-shift` / `spell-brick-wipe` / `spell-barrier`, `spell-watch-fee` ↔ `spell-watch-mute` / `spell-far-watch` / `spell-hold-ground` / `spell-gap-ward`, `spell-lone-purse` ↔ `spell-full-purse` / `spell-dry-sting` / `spell-lone-sting` / `spell-purse-keep` / `spell-empty-purse`, `spell-banner-cut` ↔ `spell-crown-cut` / `spell-pet-cut` / `spell-coup-de-grace` / `spell-glance-cut`, `spell-pack-close` ↔ `spell-pack-stride` / `spell-pack-tithe` / `spell-pack-still` / `spell-pack-tempo` / `spell-near-oath` / `spell-paper-wind`, `spell-mid-fold` ↔ `spell-knight-fold` / `spell-sovereign-fold` / `spell-pawn-trade` / `spell-file-fold` / `spell-court-fold` / `spell-pair-hinge` / `spell-quad-span`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Tactical Wave 9 (#636 — stamp onto Wave-10 family CORE, do not clone)

#636 **owns** the G≥9 tactical holes. Wave 9 SDE already recorded family extras. This document **consumes #636 as Wave-10 family CORE** and does **not** re-author those cards. Do **not** restamp #636 extra doors.

| Id | Acquisition | Stamp, do not clone |
| :--- | :--- | :--- |
| `spell-shove-mend` | MULTI_SOURCE | Heal iff **target was force-moved**. Distinct from Bar Mend (**target resolved a spell**) |
| `spell-cadence-stretch` | MULTI_SOURCE | **Hostile** remaining CDs ×2. Distinct from Cadence Pin (**one** remaining CD does not tick) |
| `spell-quad-span` | MULTI_SOURCE | 2×2 occupy. Unique §11 does **not** clone it. Live summon cap is still 2 — implementation-blocked |
| `spell-gait-wick` | ENEMY_DISCOVERY | **Unit** mark; detonates on next **any** walk-MP spend. Distinct from Ingress Mark (**cell** paint; enter that cell) |
| `spell-dry-sting` | ENEMY_DISCOVERY | Bonus if leftover AP **= 0**. Distinct from Tapped Plate (leftover AP = 0 → **RES**) and Lone Purse (**exactly 1**) |
| `spell-home-step` | ENEMY_DISCOVERY | Caster steps adjacent to an ally |
| `spell-must-span` | ELITE | **All** remaining walks **this turn** must be Manhattan 2. Distinct from Inch Stride (**one** next walk Chebyshev ≤ 1) |
| `spell-far-hood` | ELITE | Next hit from Chebyshev ≥ 3 is 0. Distinct from Off Plate (next **off-turn** hit is 0) |
| `spell-boot-lend` | ENEMY_DISCOVERY | +1 MP to an **unmoved** ally |
| `spell-quiet-sill` | ENEMY_DISCOVERY | Occupant cannot resolve Strike |
| `spell-exit-sting` | ENEMY_DISCOVERY | First **leave** deals 8. Distinct from Ingress Mark (first **enter** detonates) |
| `spell-purse-keep` | MULTI_SOURCE | Bank leftover AP to next turn start. Distinct from Lone Purse (bonus if leftover **= 1 now**) |
| `spell-tick-plate` | ENEMY_DISCOVERY | Next **DoT tick** on you is 0. Distinct from Off Plate (off-turn **hit**) |
| `spell-last-mute` | ENEMY_DISCOVERY | Their **last resolved id** is illegal 1 turn |
| `spell-pair-slide` | ENEMY_DISCOVERY | Translate two adj hostiles 1 step. Distinct from Mid Fold (shared rank/file swap) |
| `spell-court-stretch` | NOT_PLAYER_LEARNABLE | Mass remaining-CD ×2. Never owned. Distinct from Mid Fold |

`span_quad` is **not** Mid Fold’s door. `stretch_precentor` is **not** Cadence Pin’s door. `shove_cantor` is **not** Bar Mend’s door. `march_prefect` (#638 Must Pace) is **not** Inch Stride.

### 0.3 Held holes (still not this pass)

Wave 9 §13 listed these as Wave-10/11 candidates. This wave **does not** fill them in unique §11:

| Held hole | Why still held |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |
| Four-cell occupy | **#636 Quad Span owns the hole.** Do not clone. Live `ENEMY_SUMMON_CAP` is still 2 |
| `survivor` feat door | Last Ember / Last Ward already own the 1-HP fantasy. **Still held.** |
| `jackpot` feat door | #185 Absolve already claimed `jackpot` as a MULTI child. Do not restamp |
| Dedicated CORE families for Wave-9 unique verbs | This catalog’s unique §11 ids stay G≥10 extras, not Wave-10 family CORE. Wave 11 families consume unique Wave-9 verbs. Wave-10 families consume **#636**. Wave-8 unique CORE may land on dedicated families this generation — that is the family sheet, not §11 |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-six days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 … 2026-09-26 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2440 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`main.mo` 134–142) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | All 15 feat doors are claimed or leftover. This wave **stamps none**. `survivor` stays leftover |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | All nine challenge ids remain claimed through Wave 7 |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | WX 11920; zone object at 4683–4687 | `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 194–199); every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Bar Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids. Dummy Post keeps `summonAI: "dummypost"` (#563) |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-10 unique ids stay `mpCost: 0`. Still Tax / Watch Fee / Pack Close are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Cinder Reel is attract-toward-**nearest hazard**, a new dest flavor after Paint Reel / Foe Reel |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-10 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| `isLeader` / `isSummon` exist | `gameTypes.ts` 293 + summon flags | Banner Cut reads `isLeader`. Never `spell.name` or `"king"` |
| Open PR queue | #327+, then 2026-09-26 docs, then same-day #660. **#371 owns Wave-4 SDE. #411 owns Wave-5 tactical. #463 owns Wave-6 tactical. #480 owns Wave-6 SDE. #525 owns Wave-7 tactical. #533 owns Wave-7 SDE. #563 owns Wave-8 tactical. #590 owns Wave-8 SDE. #625 owns Wave-9 families. #636 owns Wave-9 tactical. #638 owns Wave-10 extra boss doors. #646 owns Wave-9 SDE.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-9 P0 remain the prerequisite. **Do not land Wave-10 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 10 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥10 rares make it sharper: a CHAMPION may hold the generation-10 verb until leftover AP / a living leader / a hazard tile is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 10 fills holes Waves 1–9, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, **#636**, and **#646** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Pair Stride, Must Span, Paint Reel, Stride Mark, Lava Skip, Clash Mend, Cadence Shave, Pack Stride, Knight Fold, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 10 stamps `generationMin: 10`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Still Tax **adds 1 AP** to the next spell if they spent 0 walk MP last turn. Watch Fee taxes the **walker** 1 AP when an overwatch snaps. Pack Close clamps **range**. None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 10 unique ids do **not** require `currentView`.
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

Wave-10 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| Inch Stride **cast** (AP spent), target already rooted | **Yes** — the technique was used |
| Illegal 2-step **after** Inch Stride is on them | **No** — that is their failed confirm, not a second observe |
| Rite First **cast** | **Yes** on the cast. A later failed Strike is **not** a second observe |
| Cinder Reel **cast** with no lava/cinder/pit on the board | **Yes** if AP was spent (fizzle) |
| Ingress Mark **arm** | **Yes** on the paint. Detonation when they later **enter that cell** is **not** a second observe |
| Off Plate **arm** | **Yes** on the cast. Later 0-damage off-turn hit is **not** a second observe |
| Spike Skip **arm** | **Yes** on the cast. Paying the spike walk later is **not** a second observe |
| Tapped Plate **cast** with leftover AP ≥ 1 (no RES) | **Yes** — AP was spent |
| Bar Mend **cast** with target having resolved no spell (heal 0) | **Yes** if AP was spent |
| Cadence Pin **cast** on a target with no remaining CDs | **Yes** if AP was spent |
| Still Tax **cast** on a target who walked last turn (no tax) | **Yes** if AP was spent |
| Brick Sprout **cast** with no adjacent barrier | **Yes** if AP was spent |
| Watch Fee **arm** | **Yes** on the cast. A later taxed snap is **not** a second observe |
| Lone Purse on leftover AP 0 or 2 (no bonus) | **Yes** — the technique was used |
| Banner Cut on a non-leader (no bonus) | **Yes** — the technique was used |
| Pack Close aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| Mid Fold | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orb pickup / `WF-SPL-*` attune | **No** |
| #636 Shove Mend / Gait Wick / Must Span **cast** | **Yes** on those ids (their own observe). Do not also observe unique §11 ids |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 10 stamps unused **family** attachments and one special MULTI. It does **not** add enum members. It does **not** stamp leftover feat or challenge doors.

| Source | Wave-10 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥10 family verbs in §11 **plus** #636 stamps already recorded in Wave 9, now CORE on Wave-10 families |
| `ELITE` | Summon Brace, Bar Mend, Watch Fee, Lone Purse, Banner Cut |
| `ACHIEVEMENT` | **none** — `survivor` stays leftover. Do not restamp `leader_slayer` / `spell_master` / `jackpot` |
| `CHALLENGE` | **none** — all nine challenge doors remain claimed through Wave 7 |
| `BOSS` | **none** — live-19 first-wins and extra doors through #638 stay claimed. Mid Fold is `BOSS_ONLY` |
| `SPECIAL_ENCOUNTER` | Inch Stride ← `inch_gallery` (MULTI child; observation not required for that child) |
| `MULTI_SOURCE` | Inch Stride ← locksmith observe+win **or** `inch_gallery`. First child wins |
| `ENEMY_ONLY` | Pack Close (never owned) |
| `BOSS_ONLY` | Mid Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-10 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every live feat and challenge from Waves 1–9, #120 / #185 / #282 / #342 / #411 / #463 / #525 / **#563** / **#590** / **#636** / **#646**, plus boss extra doors:

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
| `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent` | #563 extra doors |
| `toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean` | #572 extra doors |
| `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent` | #636 extra doors — do not restamp. Bar Mend is **not** `shove_cantor`. Cadence Pin is **not** `stretch_precentor`. Mid Fold is **not** `span_quad` / `knight_fold_regent` |
| `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` | #638 extra doors — Pit Wick / Must Pace / Triple Span / Pivot Foe. Spike Skip is **not** `crypt_sexton`. Inch Stride is **not** `march_prefect` |
| `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner` | same-day #663 extra doors — Gait Seal / Diag Lock / Brick Shift / Return Sting. Brick Sprout is **not** `brick_cellarer`. Off Plate is **not** `rebound_almoner` |
| `choir_gallery` | Wave 6 Choir Verse MULTI child |
| `even_gallery` | Wave 7 Even Stride MULTI child |
| `odd_gallery` | Wave 8 Odd Stride MULTI child |
| `pair_gallery` | Wave 9 Pair Stride MULTI child — **not** Inch Stride |
| `hard_1` | Wave 7 Thin Ward MULTI child |
| `legendary_1` | Wave 7 Clean Blood MULTI child |
| `leader_slayer` | Wave 8 Crown Cut MULTI child |
| `spell_master` | Wave 8 Full Bar MULTI child |

Economy feats stay Doka-only until a designer needs a non-damage identity. `unstoppable` stays unused forever as a spell gate. **Still leftover after this pass:** `survivor` only. Do not stamp `survivor` (Last Ember / Last Ward).

---

## 5. Spell pool evolution — Generation 10 (never a last tier)

Wave 1 §6 five pools and later generation stamps stay. Wave 10 adds the **G≥10 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, … no maximum
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
| 10 | one additional ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with `generationMin ≤ 10` |
| 11+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or later G verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **10** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation — extends Wave 9)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
     Wave-10 family CORE includes #636 ids the AI can use
     Dedicated Wave-8 unique CORE families (if the family sheet shipped them) also live here
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3. if G ≥ 2: one additional slot from ADVANCED ∪ RARE with generationMin ≤ G
  4. if rare roll hits: at most one RARE_POOL id with generationMin ≤ G
  5. if G ≥ 3 … G ≥ 10: one additional slot from ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE
     with generationMin ≤ G (skip if no legal id; this is the Generation N verb)
  6. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  7. drop any id whose AI_REQUIREMENTS are unmet
  8. keep ENEMY_ONLY on enemies (they cast; they never grant)
  9. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 6. New `aiHint` keys (metadata, not names)

Wave 1 §9.1 and later profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `force_next_walk_chebyshev_le_1` | caster, controller | Target has MP ≥ 2 **or** last walked ≥ 2; skip if already rooted or MP 0 |
| `forbid_strike_until_spell` | caster, controller | Target’s bar includes Strike **and** at least one spell; skip if they already resolved a spell this turn |
| `next_spell_range_ge_3` | kiter, caster | Target is at Chebyshev ≤ 2 with a 3+ range tool; skip if they only hold Strike |
| `attract_toward_nearest_hazard` | caster, controller | A lava / cinder / pit cell exists; the 1-step toward it is free; skip if no hazard or the step is blocked |
| `bonus_if_adjacent_ally` | flanker, berserker | Caster has a living same-side body at Chebyshev 1; skip if isolated (use Strike / Nook Bite) |
| `detonate_on_walk_enter_cell` | caster, controller | Paint a cell the player **must enter** to threaten; skip if they can threaten without entering |
| `next_off_turn_hit_zero` | guardian, kiter | Caster is likely to be hit on the **player** turn; skip if already plated |
| `next_walk_ignores_spikes` | charger, flanker | A spike cell sits on the only 1-step approach; skip if no spikes |
| `self_buff_if_zero_leftover_ap` | guardian | Caster leftover AP is 0 **after** this would be the last spend, or already 0; skip if they still need a 2-AP tool |
| `allied_summon_ignores_forced_move` | summoner, guardian | ≥ 1 living allied summon; skip if none. Drop if `summonAI` empty |
| `heal_if_target_resolved_spell` | healer | Ally (or self) resolved a non-Strike spell this turn; skip otherwise. **Healer CORE only** |
| `freeze_one_remaining_cd` | caster, controller | Target has a remaining CD ≥ 2 on a 3–5 AP tool; skip if all remaining are 0 |
| `tax_next_spell_if_zero_walk_mp_last_turn` | caster, controller | Target spent 0 walk MP last turn **and** holds a spell; skip if they walked |
| `grow_adjacent_barrier` | caster, guardian | An adjacent barrier has a free floor cell to grow into that blocks a file; skip if no barrier or growth cell is occupied |
| `next_overwatch_also_costs_ap` | kiter, caster | An allied or self overwatch is armed **or** the player is about to walk into a band; skip if no overwatch on the board |
| `bonus_if_leftover_ap_eq_1` | caster, kiter | Target leftover AP is exactly 1; skip if 0 (Dry Sting) or ≥ 3 (Full Purse) |
| `bonus_if_target_is_leader` | caster, flanker | Living hostile with `isLeader === true`; skip if none. Never parse `"king"` / `name` |
| `pack_clamp_next_spell_range_1` | buffer | CHAMPION only; ≥ 1 ally holds a `modifiableRange` or range ≥ 3 id; skip if aura up |
| `fold_share_rank_or_file` | **boss AI only** | Exactly two living player-side bodies sharing rank **or** file; skip if 0–1 or they do not share an axis |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: `pendingAchievementToast` at `WorldExploration.tsx` 2173 / 17949.
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Ingress Mark / Watch Fee / Cinder Reel may add a **battle-log line** when the detonate / snap / pull fires — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.
- Still Tax’s later +1 AP is **not** a second cue. One toast for the spell name.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 10 adds **no** new canister methods.

| Writer | Wave-10 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | `inch_gallery` MULTI child only |

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
- Pull / fold landings onto lava/spikes use existing `recordInBattleChallengeDamage` only while `inBattleRef`. Bar Mend HP restore uses the existing heal flag (`healUsed`) only when HP actually increased.

---

## 9. Special encounters (Wave 10)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is `unlockOwnedSpell` / observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `inch_gallery` | Axis locksmith on a long file; AI prefers Inch Stride if the player has MP ≥ 2 | `spell-inch-stride` on **victory** (MULTI child; observation not required for this child) |
| `rite_nave` | Hex chorister + pawn; AI prefers Rite First while Strike is still legal | `spell-rite-first` via observe+win |
| `reach_nave` | Glass sniper at Chebyshev 2; Long Oath makes the snipe illegal until they step out | `spell-long-oath` via observe+win |
| `ash_aisle` | Ember knight beside a cinder / lava cell; AI prefers Cinder Reel | `spell-cinder-reel` via observe+win |
| `pin_nave` | Cadence thief vs a 3–5 AP tool on CD | `spell-cadence-pin` via observe+win |

Wave-1…9 specials (`echo_dummies`, `rime_gallery`, `pair_gallery`, `odd_gallery`, …) are not re-specified. Do **not** retag `pair_gallery` / `long_gallery` / `ember_fan` / `oath_dean` / `march_prefect` as Inch Stride / Long Oath / Cinder Reel.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–9 + #120 + #185 + #282 + #342 + #411 + #463 + #525 + #563 + #636 already cover: push, pull-to-caster, blink, root, range buff **and** cut, absorb, redirect, cleanse, burn tile, trap, AP zone, turret, pet, bounce, next-spell AP tax, adjacent RES share, min-range sniper, walk-off fire, split mark, summon lock, init steal, decoy, ally heal, ally swap, damage share, anti-heal tile, flank gate, melee overwatch, ice leave-tax, steal buff, punish 0 MP, block swap/blink, linear file poke, AP loan, strip buff, taunt, steal dying pet, low-HP next physical, HP→AP, reveal traps, LoS range cut, anti-swap cell, ignore push/pull, delayed tile fuse, instant execute, DoT detonate, cross AoE, tile-gravity, ally rescue pull, ice tile, smoke, sinkhole, leash hook, bastion, goad, life tether, walk-MP spend, cone, two-body swap, self knockback, portal-pair, evade charge, distance poke, MP steal, even/odd/pair/must walk lengths, hold-until-Strike/cast/walk, near oath, paint attract, nook/field/wall bites, leave-cell detonate, incoming split with enemy, lava skip, pit skip, 0 leftover MP RES, primary/summon cannot leave, heal-if-Struck / walked / caster-walked / force-moved, cadence −1 / +1 / ×2 / flush, gait tax, brick shift/wipe, overwatch mute, leftover AP ≥ 3, bonus vs player summon, pack leftover-MP siphon, knight-fold.

**Still open (Wave 10 SDE unique ids).**

| Hole | Wave-10 id | Why it is not a clone |
| :--- | :--- | :--- |
| Next walk Chebyshev ≤ 1 | `spell-inch-stride` | Pair Stride is **exactly** Manhattan 2. Must Span is **all** remaining walks this turn Manhattan 2. Even/Odd are parity |
| Cannot Strike until a spell resolves | `spell-rite-first` | Strike Hold is Strike illegal until **walk**. Cast Hold is spells illegal until walk. Boot Hold is walk illegal until Strike. Verse First is **this id** before other spells |
| Next spell illegal unless range ≥ 3 | `spell-long-oath` | Near Oath is range **≤ 1**. Glass Shot is this spell’s minRange 3 |
| Pull 1 toward nearest hazard | `spell-cinder-reel` | Paint Reel is nearest **paint**. Foe Reel is nearest **body**. Hook is to caster |
| Bonus if adjacent ally | `spell-side-bite` | Lone Sting is 0 Chebyshev-1 **hostiles**. Nook is exactly 1 **block**. Field is 0 blocks. Wall is any hug |
| Cell paint detonates on **enter** | `spell-ingress-mark` | Stride Mark detonates on **leave**. Gait Wick is **unit-follow** walk-MP. Exit Sting is first leave **damage**. Enter Mend is first enter **heal** |
| Next **off-turn** hit is 0 | `spell-off-plate` | Far Hood is next hit from **≥ 3**. Morrow Plate is absorb next **own** turn. Tick Plate is next **DoT tick**. Foe Plate **splits** with an enemy |
| 1-tile walk ignores spikes | `spell-spike-skip` | Lava Skip is lava. Pit Skip is pit occupancy. Gap Ward skips overwatch on a 1-tile walk |
| Leftover AP 0 → +RES | `spell-tapped-plate` | Still Plate is leftover **MP** 0 → RES. Dry Sting is leftover AP 0 → **damage**. Empty Plate is a different Wave-8 RES gate |
| Allied summons ignore forced move | `spell-summon-brace` | Body Sill / Kennel Sill forbid **leave-walk**. Grounded Lock forbids swap/blink. Self Anchor is the unit itself |
| Heal iff target resolved a spell | `spell-bar-mend` | Clash is **Struck**. Chase is **walked**. Gait is **caster** walked. Shove is **force-moved**. Strike does **not** count |
| One remaining CD does not tick | `spell-cadence-pin` | Stall is +1 **all**. Shave is −1 all. Flush is all → 0. Stretch is remaining ×2 |
| Next spell +1 AP if they camped last turn | `spell-still-tax` | Gait Tax is if they **walked**. Quiet Hex always taxes the next spell. Debt Mark taxes the next **walk** |
| Grow an adjacent barrier 1 cell | `spell-brick-sprout` | Brick Shift **slides** the barrier. Brick Wipe **erases** it. Barrier **paints** a new wall from range |
| Overwatch snap also costs the walker 1 AP | `spell-watch-fee` | Watch Mute makes the snap deal **0**. Far Watch / Hold Ground **are** the snap |
| Bonus if leftover AP **exactly 1** | `spell-lone-purse` | Dry Sting is leftover **0**. Full Purse is leftover **≥ 3**. Purse Keep **banks** leftover |
| Bonus vs `isLeader` | `spell-banner-cut` | Pet Cut is `isSummon`. Crown Cut is the `leader_slayer` **grant**, a different id. Coup is an HP window |
| Pack next-spell range clamp 1 | `spell-pack-close` | Pack Stride siphons leftover **MP**. Near Oath brands **one** body. Paper Wind cuts **their** range. Never owned |
| Swap two player-side bodies that share an axis | `spell-mid-fold` | Knight Fold is (2,1) from midpoint. Sovereign Fold swaps then damages. Pawn Trade is two **hostiles-to-caster**. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 10)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–9, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, **#590**, **#636**, or **#646**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll — no fourth.

### 11.1 New `effectParams` keys (Wave 10 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables.

```text
nextWalkMaxChebyshev,          // Inch Stride: next walk Chebyshev ≤ 1
forbidStrikeUntilSpell,        // Rite First
nextSpellMinRange,             // Long Oath
attractTowardNearestHazard,    // Cinder Reel: lava | cinder | pit
adjacentAllyBonusDamage,       // Side Bite
ingressDetonateDamage, ingressDuration,  // Ingress Mark: detonate on enter
offTurnHitZeroCharges,         // Off Plate
nextWalkIgnoresSpikes,         // Spike Skip
tappedRes, tappedDuration,     // Tapped Plate
summonIgnoreForcedMoveTurns,   // Summon Brace
healIfTargetResolvedSpell, barMendHeal,  // Bar Mend; Strike does not count
pinOneRemainingCdTurns,        // Cadence Pin: highest remaining CD does not tick
stillTaxNextSpellAp,           // Still Tax
barrierGrowDistance,           // Brick Sprout
overwatchWalkerApTax,          // Watch Fee
leftoverApExact, leftoverApExactBonus,  // Lone Purse
leaderBonusDamage,             // Banner Cut: isLeader
packNextSpellMaxRange,         // Pack Close
foldShareAxisPlayerSide        // Mid Fold: shared rank or file
```

Reuse from earlier waves where the meaning is identical: `attractDistance`, `overwatchDuration`. Do **not** reuse `gaitWickDamage` for Ingress Mark. Do **not** reuse `splitIncomingPct` for Off Plate.

---

### SPELL_ID: `spell-inch-stride`

NAME: Inch Stride  
ROLE: CONTROL — next walk Chebyshev ≤ 1  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true (observe+win child). `inch_gallery` victory child does **not** require observation  
MINIMUM_ELIGIBILITY: Family `axis_locksmith`; `G ≥ 10` or variant ≥ CHAMPION; `aiProfile` caster/controller. **Or** victory on `inch_gallery`  
ENEMY_FAMILIES: `axis_locksmith`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥10. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. The target’s **next walk** this battle (or 2 turns, whichever first) may only end at Chebyshev ≤ 1 from their start cell (`effectParams: {"nextWalkMaxChebyshev":1}`). Confirm of a 2+ step fails; MP is not spent. Teleport / Swap / Phase Slip / Twin-gate / Inch-illegal forced moves **do not** consume the brand. Distinct from Pair Stride (next walk Manhattan **exactly 2**), Must Span (**all** remaining walks this turn Manhattan 2), Even/Odd Stride (parity), Rank Lock (axis lock for 2 turns).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "force_next_walk_chebyshev_le_1"`. Caster / controller. Skip if rooted or MP 0. **Do not** assign to chargers whose kit is “walk 3 and Strike.”  
PLAYER_COUNTERPLAY: Blink / Swap off; Strike in place; pay nothing because you wanted a 1-step anyway  
SYNERGIES: Far Watch band 3–4 (they cannot step into 3 in one walk); Debt Mark; Side Bite after they are parked  
BALANCE_RISK: Inch + Root is a brick. Brand is **one** walk + CD 2 + G≥10. Must Span remains the “every step is a leap” sibling — do not merge the keys.  
PERSISTENCE_REQUIREMENTS: Observe on **cast**. `inch_gallery` victory uses `unlockOwnedSpell` (MULTI; first child wins). Do not grant on `pair_gallery` / `odd_gallery` / `even_gallery` / `march_prefect`. No Doka.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rite-first`

NAME: Rite First  
ROLE: CONTROL — cannot Strike until a spell resolves  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `hex_chorister` or `bone_scribe`; `G ≥ 10`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `hex_chorister`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥10. `generationMin: 10`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Until the target **resolves a spell** (`kind === "cast"` that spent AP, not Strike / `physical_attack`) this turn, Strike is illegal (`effectParams: {"forbidStrikeUntilSpell":true}`). Walks remain legal. If they already resolved a spell this turn, fizzle (AP spent). Distinct from Strike Hold (Strike illegal until **walk**), Cast Hold (spells illegal until walk), Boot Hold (walk illegal until Strike), Verse First (this id before other spells), Quiet Sill (occupant cannot Strike **while on the cell**).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_strike_until_spell"`. Caster / controller. Skip if the target’s bar is spells-only or they already cast.  
PLAYER_COUNTERPLAY: Cast Slow / Mark to unlock Strike; wait the turn; Quiet Hex the unlocking spell  
SYNERGIES: Long Oath (the unlocking spell may also be range-illegal); Watch Fee if they walk instead  
BALANCE_RISK: Melee characters with one 2-AP tool shrug it. G≥10 + 2 AP + CD 2. Do not also apply Hex of Silence.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-long-oath`

NAME: Long Oath  
ROLE: CONTROL — next spell min range 3  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `far_stinger`; `G ≥ 10`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `far_stinger`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. The target’s **next spell** this battle (or 2 turns) is illegal unless Chebyshev(caster_of_that_spell, its target) ≥ 3 (`effectParams: {"nextSpellMinRange":3}`). Strike is **not** a spell for this key (still legal at range 1). Distinct from Near Oath (next spell range **≤ 1**), Glass Shot / Far Sting (this card’s own minRange), Paper Wind (cuts max range), Unit Oath (Wave 8: a different unit-scoped oath).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_range_ge_3"`. Kiter / caster. Skip if the player only holds Strike or is already at 4+.  
PLAYER_COUNTERPLAY: Strike; walk to 3+ before the nuke; wait 2 turns  
SYNERGIES: Inch Stride (they cannot walk to 3 in one step); Rite First (Strike is also locked)  
BALANCE_RISK: Long Oath + Inch Stride bricks a sniper bar. Two different keys, G≥10 on both, AI should not stack on G=0.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cinder-reel`

NAME: Cinder Reel  
ROLE: POSITION — pull 1 toward nearest hazard  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `ember_knight` or `fuse_binder`; `G ≥ 10`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `ember_knight`, `fuse_binder`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Find the nearest floor cell tagged lava **or** cinder **or** pit (Chebyshev, then lowest id). `applyAttract` the target 1 tile toward that cell (`effectParams: {"attractTowardNearestHazard":true,"attractDistance":1}`). If no such cell exists, fizzle (AP spent). Distinct from Paint Reel (nearest **paint**), Foe Reel / Ally Reel (nearest **body**), Hook Line (to **caster**), File Slide (axis step). Landing ticks existing hazards (`recordInBattleChallengeDamage` if lava/spikes while `inBattleRef`).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_hazard"`. Caster / controller. Skip if no hazard or the 1-step is blocked. **Do not** assign until `applyAttract` has a production cast caller.  
PLAYER_COUNTERPLAY: Occupy the step; Barrier; stand on the hazard already (attract 0)  
SYNERGIES: Cinder Tile / Fuse / Open Pit as the dest; Spike Skip does **not** ignore a pull onto spikes (skip is a **walk** flag)  
BALANCE_RISK: Pull onto lava is the combo. AI value-check; player copy can self-sabotage a summon. G≥10.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-board fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-side-bite`

NAME: Side Bite  
ROLE: DAMAGE — bonus if adjacent ally  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `brood_chanter` or `leash_warden`; `G ≥ 10`; `aiProfile` flanker/berserker  
ENEMY_FAMILIES: `brood_chanter`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥10. `generationMin: 10`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 1  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: Physical. Deal 10. If the **caster** has a living same-side body at Chebyshev 1, deal an extra 8 as a second existing `dealDamage` call (`effectParams: {"adjacentAllyBonusDamage":8}`). Distinct from Lone Sting (0 Chebyshev-1 **hostiles-to-target**), Nook Bite (exactly 1 **block**), Field Bite (0 blocks), Wall Bite (any hug), Flank Share (Wave 7). Player copy needs a summon or ally; isolated casters deal 10 only.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_adjacent_ally"`. Flanker / berserker. Skip if isolated and Strike is better.  
PLAYER_COUNTERPLAY: Peel the pack (Pawn Trade / Swap); kill the hug body first; Barrier  
SYNERGIES: Kennel Lock / Summon Brace keep the hug body parked; Pack Close after they clustered  
BALANCE_RISK: 18 adjacent is Frost-adjacent on 2 AP CD 1. Gate is a living hug body, not a name.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Isolated cast still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ingress-mark`

NAME: Ingress Mark  
ROLE: TERRAIN — cell paint detonates on enter  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `stride_hunter`; `G ≥ 10`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `stride_hunter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. The next unit that **enters** that cell by walking (or by push/pull/slide/swap landing) takes 10 (spell, RES+SR) and the paint consumes (`effectParams: {"ingressDetonateDamage":10,"ingressDuration":2}`). Teleport / Twin-gate / Phase Slip onto the cell **does** enter. Standing on it at paint time does **not** detonate. Distinct from Stride Mark (detonate on **leave**), Gait Wick (**unit** walk-MP), Exit Sting (first leave **8**), Enter Mend (enter **heals**), Tripwire (hidden). Observation is the **arm**.  
SCALING: damage follows dmg%; duration fixed  
AI_REQUIREMENTS: `aiHint: "detonate_on_walk_enter_cell"`. Caster / controller. Paint the cell the player must enter to threaten. Skip if they can threaten without entering. Do **not** reuse `gaitWickDamage`.  
PLAYER_COUNTERPLAY: Don’t enter; blink past; send a summon in  
SYNERGIES: Inch Stride (the only legal step may be onto the paint); Cinder Reel onto the cell  
BALANCE_RISK: Enter-tax + leave-tax + Gait Wick is three walk punishments. Different keys; AI should not stack all three on G=0. G≥10.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonation does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-off-plate`

NAME: Off Plate  
ROLE: DEFENSE — next off-turn hit is 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 10`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥10. `generationMin: 10`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: The next **damaging** instance against this unit that would call `dealDamage` **while it is not this unit’s turn** misses: 0 HP, no absorb chew, no DoT apply from that hit. Then the charge consumes (`effectParams: {"offTurnHitZeroCharges":1}`). Timeout 2 turns. Hits during **their** turn still land (including their own Sacrifice / reflect). Distinct from Far Hood (next hit from Chebyshev ≥ 3), Morrow Plate (absorb starts next **own** turn), Tick Plate (next **DoT tick**), Sidestep Ward (next hit **any** turn), Foe Plate (split with adj enemy). Do **not** implement as `buffStat: "evasion"`.  
SCALING: charges fixed  
AI_REQUIREMENTS: `aiHint: "next_off_turn_hit_zero"`. Guardian / kiter. Skip if already plated with Sidestep / Far Hood.  
PLAYER_COUNTERPLAY: Hit them on **their** turn (overwatch, Goad into a reflect window); throw 0-damage control first on your turn to **not** consume, then the real hit — **explicit: Off Plate consumes only damaging instances, so Slow does not consume**; wait 2 turns  
SYNERGIES: Hold Ground / Far Watch so they must walk on **your** turn into a snap that **does** consume Off Plate (snap is an off-turn hit)  
BALANCE_RISK: A free miss of Inferno is huge. Charge 1 + CD 3 + their-turn hits still land.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The later 0-hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spike-skip`

NAME: Spike Skip  
ROLE: POSITION — 1-tile walk ignores spikes  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `rust_reaver` or `blink_cutter`; `G ≥ 10`; `aiProfile` charger/flanker  
ENEMY_FAMILIES: `rust_reaver`, `blink_cutter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Stance, 1 turn. The caster’s next **walk of Chebyshev 1** ignores spike occupancy and spike tick (`effectParams: {"nextWalkIgnoresSpikes":true}`). Walks of length ≥ 2 still pay. Lava / pit / void / portal / Barrier still block and tick as usual. Distinct from Lava Skip (lava only), Pit Skip (pit occupancy), Gap Ward (skips **overwatch** on a 1-tile walk), Ember Step (boss dash). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_walk_ignores_spikes"`. Charger / flanker. Skip if no spike on the 1-step approach.  
PLAYER_COUNTERPLAY: Make the approach 2+ tiles; lava instead of spikes; Root  
SYNERGIES: Ingress Mark on the far side of the spike; Cinder Reel does **not** count as a walk skip  
BALANCE_RISK: Free spike crossing is a map-puzzle skip. 1-tile only + CD 2 + G≥10. Do not also ignore lava.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The later spike walk does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-tapped-plate`

NAME: Tapped Plate  
ROLE: DEFENSE — leftover AP 0 → +RES  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `tempo_precentor`; `G ≥ 10`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `tempo_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥10. `generationMin: 10`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If caster leftover AP is **0** at resolve, gain `buffStat: "res"`, `buffModifier: 1.20`, 2 turns (`effectParams: {"tappedRes":1.20,"tappedDuration":2}`). If leftover AP ≥ 1, fizzle (AP spent). Distinct from Still Plate (leftover **MP** 0), Dry Sting (leftover AP 0 → **damage**), Empty Plate (Wave 8 RES gate), Planted Stance (0 **walk MP this turn** at cast). Last RES% writer wins vs Iron Skin / Chain Ward.  
SCALING: modifier fixed  
AI_REQUIREMENTS: `aiHint: "self_buff_if_zero_leftover_ap"`. Guardian. Cast as the last action of the turn. Skip if they still need a 2-AP tool or Iron Skin is already up.  
PLAYER_COUNTERPLAY: Loan Tempo them 1 AP before they arm; Dispel; ignore and snipe  
SYNERGIES: Dry Sting after they tapped (they wanted leftover 0 for both — **explicit: Dry Sting reads leftover AP at its own resolve; Tapped consumes 2 AP so leftover must already be 0 before this cast**, meaning they spent down first).  
BALANCE_RISK: 1.20 RES + Planted + Iron Skin last-writer. Gate is leftover 0 + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-brace`

NAME: Summon Brace  
ROLE: SUMMONS — allied pets ignore forced move  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 10`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 10`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Living **allied** summons (same side as caster) ignore `applyPushback` / `applyAttract` / slide / swap landing (they stay on their cell; the rest of the resolution continues) (`effectParams: {"summonIgnoreForcedMoveTurns":2}`). They may still **walk**. Distinct from Body Sill (primary cannot **leave**), Kennel Sill (summon cannot leave), Kennel Lock (leash radius), Grounded Lock (no swap/blink on the **branded unit**), Self Anchor.  
SCALING: duration fixed  
AI_REQUIREMENTS: `aiHint: "allied_summon_ignores_forced_move"`. Summoner / guardian. Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
PLAYER_COUNTERPLAY: Kill the pets; brand the **primary** with Grounded Lock; damage instead of shove  
SYNERGIES: Side Bite (hug body stays); Load Bearing inside the pack  
BALANCE_RISK: Unshovable wolves next to a golem is a turtle. Elite + CD 3 + 2 turns. Player copy also braces **their** pets — a real downside when you wanted to Pawn Trade them.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bar-mend`

NAME: Bar Mend  
ROLE: SUPPORT — heal iff target resolved a spell  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 10`; `aiProfile` healer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 10`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: If the target **resolved a spell** this turn (`kind === "cast"` that spent AP; Strike / `physical_attack` does **not** count), heal 12 (`effectParams: {"healIfTargetResolvedSpell":true,"barMendHeal":12}`). Else heal 0 (AP spent). Distinct from Clash Mend (target **Struck**), Chase Mend (target **walked**), Gait Mend (**caster** walked), Shove Mend (target **force-moved**), Enter Mend (tile), Split Mend (50/50). `no_healing` fails only when HP increased.  
SCALING: heal follows a later heal table if one exists; until then fixed 12  
AI_REQUIREMENTS: `aiHint: "heal_if_target_resolved_spell"`. **Healer only.** Skip if the ally has not resolved a spell. Do **not** put this id in non-healer CORE (`inferArchetype` still maps any `healAmount > 0` to healer).  
PLAYER_COUNTERPLAY: Force Strike-only turns; Cursed Wound the mend; kill the cantor  
SYNERGIES: Rite First on the **player** does not help the enemy cantor; on the **player’s** copy, Rite First + Bar Mend is a pacifist loop — 3 AP + CD 2 is the payment  
BALANCE_RISK: 12 after Inferno is a hospital. Elite + spell-not-Strike gate + healer CORE only.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. 0-heal still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-pin`

NAME: Cadence Pin  
ROLE: CONTROL — one remaining CD does not tick  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `cadence_thief`; `G ≥ 10`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `cadence_thief`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Among the target’s remaining cooldowns, pick the **highest remaining** value (ties: lowest id). That remaining value does **not** decrement at the next turn-start tick (`effectParams: {"pinOneRemainingCdTurns":1}`). Remaining 0 stays 0 (nothing to pin → fizzle, AP spent). Distinct from Cadence Stall (+1 **all** remaining), Cadence Shave (ally −1 all), Cadence Flush (ally all → 0), Cadence Stretch (hostile remaining ×2), Cadence Crack, Last Mute (last **resolved id** illegal).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "freeze_one_remaining_cd"`. Caster / controller. Prefer pinning Inferno / Hold Ground / a 3–5 AP tool at remaining ≥ 2. Skip if all remaining are 0.  
PLAYER_COUNTERPLAY: Wait the extra turn; Cadence Flush / Shave on yourself if you have them; swap the pinned id off the bar (bar swap does **not** clear remaining — **explicit: pin follows spellId**, not bar slot)  
SYNERGIES: Quiet Hex the unpinned tools so they want the pinned nuke  
BALANCE_RISK: Pinning Inferno an extra turn is tempo, not a lock. 2 AP + CD 2 + one id.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Empty-CD fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-still-tax`

NAME: Still Tax  
ROLE: CONTROL — next spell +1 AP if they camped  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 10`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target spent **0 walk MP last turn**, their next **spell** costs +1 AP (`effectParams: {"stillTaxNextSpellAp":1}`). If they walked last turn, fizzle rider (AP still spent; no tax). Teleport / Swap last turn does **not** count as walk MP. Distinct from Gait Tax (tax if they **walked**), Quiet Hex (always tax next spell), Debt Mark (next **walk** +1 AP), Camp Tax (Wave 4 different door), Act Tax. Not `spell.mpCost`.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_spell_if_zero_walk_mp_last_turn"`. Caster / controller. Skip if they walked last turn or hold only Strike.  
PLAYER_COUNTERPLAY: Walk 1 before the tax lands; Strike; pay the 1 AP  
SYNERGIES: Rite First (they must spend a spell to unlock Strike, and that spell is taxed); Inch Stride (they may not want to walk)  
BALANCE_RISK: Still Tax + Quiet Hex + Gait Tax is three AP taxes. Different keys; G≥10 gate; AI should not stack all three on G=0.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Unmoved-last-turn fizzle still observes. The later +1 AP is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-sprout`

NAME: Brick Sprout  
ROLE: TERRAIN — grow an adjacent barrier 1 cell  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 10`; `aiProfile` caster/guardian  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 3  
RANGE: 1  
TARGET_TYPE: ground  
LOS: false  
COOLDOWN: 2  
EFFECT: Target a **free floor** cell Chebyshev 1 from an **existing** barrier (not from a wall, not from void). Paint that cell as a barrier for 2 turns (`effectParams: {"barrierGrowDistance":1}`). Occupancy / LoS match existing Barrier. If no adjacent barrier exists, or the dest is occupied / void / portal / already barrier, fizzle (AP spent). Distinct from Barrier (range-2 paint, no existing-barrier gate), Brick Shift (**slide** an existing barrier), Brick Wipe (**erase**), Open Pit (walk-block LoS-open). Maps stay solvable: AI skip if the growth would seal the only path (`finalizePlayableLayout` is not re-run mid-battle — **explicit: skip if `findPath` from player to any hostile would fail after growth**).  
SCALING: duration fixed  
AI_REQUIREMENTS: `aiHint: "grow_adjacent_barrier"`. Caster / guardian. Grow to block a file the player uses. Skip if no barrier, dest illegal, or the growth would seal.  
PLAYER_COUNTERPLAY: Brick Wipe; stand on the dest; blink around  
SYNERGIES: File Lance after the file is walled; Far Watch covering the remaining step  
BALANCE_RISK: Growing a wall through the only corridor bricks the map. Solvability skip is mandatory. G≥10 + dest must already have a barrier neighbor.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Illegal dest still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-fee`

NAME: Watch Fee  
ROLE: CONTROL — overwatch snap also costs the walker 1 AP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 10`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns. The next allied or self **overwatch snap** (Hold Ground / Far Watch / equivalent `overwatchDuration` consume) that deals its damage also subtracts 1 **current AP** from the **walker** who triggered it (min 0) (`effectParams: {"overwatchWalkerApTax":1,"overwatchDuration":2}`). If the snap deals 0 (Watch Mute), the fee does **not** apply. Push/pull into the band **does** trigger (walker is the moved body). Teleport / Swap / Twin-gate **does not**. Distinct from Watch Mute (snap deals **0**), Far Watch / Hold Ground (the snap itself), Debt Mark (next **walk** +1 AP at confirm), Gait Tax (next **spell**). Observation is the **arm**. Not `spell.mpCost`.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "next_overwatch_also_costs_ap"`. Kiter / caster. Skip if no overwatch is armed and they cannot arm one this turn. Prefer arming Far Watch then Watch Fee, not the reverse on a turn they cannot afford both.  
PLAYER_COUNTERPLAY: Don’t walk into the band; Watch Mute the snap; blink in  
SYNERGIES: Far Watch / Hold Ground; Inch Stride (the only legal step may be into the band)  
BALANCE_RISK: Snap damage **and** −1 AP is a brick with Far Watch. Elite + consume-on-first-body + CD 3. Watch Mute still beats it.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The later fee does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lone-purse`

NAME: Lone Purse  
ROLE: DAMAGE — bonus if leftover AP is exactly 1  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `purse_scribe` or `bone_scribe`; variant ≥ ELITE or `G ≥ 10`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `purse_scribe`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **target’s** leftover AP at resolve is **exactly 1**, deal an extra 10 as a second existing `dealDamage` call (`effectParams: {"leftoverApExact":1,"leftoverApExactBonus":10}`). Distinct from Dry Sting (leftover **0**), Full Purse (leftover **≥ 3**), Empty Purse (Wave 6 control), Purse Keep (bank leftover), Split Purse. If leftover is 0 or ≥ 2, only the 10 lands.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_1"`. Caster / kiter. Skip if leftover is 0 (use Dry Sting if in kit) or ≥ 3 (use Full Purse if in kit). Drain Courage / Quiet Hex can set up the 1.  
PLAYER_COUNTERPLAY: Spend the last 1 AP before the poke; sit at 0; Loan Tempo to 2  
SYNERGIES: Drain Courage to leave them at 1; Still Tax after they spend the 1 on a taxed spell  
BALANCE_RISK: 20 at 2 AP CD 1 is Frost-equal. Exact-1 gate + elite. Do not also apply Dry Sting’s 0-gate on the same hit (one leftover reader per cast: this card’s exact-1 key).  
PERSISTENCE_REQUIREMENTS: Standard observe → win. No-bonus cast still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-banner-cut`

NAME: Banner Cut  
ROLE: DAMAGE — bonus vs leader  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `null_censor` or `rust_reaver`; variant ≥ ELITE or `G ≥ 10`; `aiProfile` caster/flanker  
ENEMY_FAMILIES: `null_censor`, `rust_reaver`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 10`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target `isLeader === true`, deal an extra 12 as a second existing `dealDamage` call (`effectParams: {"leaderBonusDamage":12}`). Reads the leader flag, never `pieceType === "king"` and never `name`. Distinct from Pet Cut (`isSummon` player-side), Crown Cut (the `leader_slayer` **grant id**, a different spell), Coup de Grace (HP window), Summon Bane (`isSummon` any). If the target is not a leader, only the 10 lands.  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_is_leader"`. Caster / flanker. Skip if no living `isLeader` and Strike is better vs a pawn.  
PLAYER_COUNTERPLAY: Kill the leader with something else; don’t let a CHAMPION stay tagged; Barrier  
SYNERGIES: Goad the leader into range; Pawn Trade to put the leader on a file  
BALANCE_RISK: 22 vs a leader is Frost-adjacent on 2 AP CD 1. Elite + flag check. Do not apply the bonus to bosses unless they also set `isLeader` (most boss sheets do not — **explicit: boss ids are not leaders unless the spawn flags them**).  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Non-leader cast still observes. Do **not** restamp `leader_slayer` (Crown Cut).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-close`

NAME: Pack Close  
ROLE: SUPPORT — allied next spells max range 1  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `close_precentor`; variant CHAMPION; `G ≥ 10`  
ENEMY_FAMILIES: `close_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 10`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 1 turn. Living allies at Chebyshev ≤ 2 have their next spell this turn clamped to `maxRange: 1` (Strike unaffected) (`effectParams: {"packNextSpellMaxRange":1,"auraRadius":2}`). Does not clamp the caster the turn it is cast. Distinct from Pack Stride (siphon leftover **walk MP**), Pack Tithe / Pack Still / Pack Tempo / Pack Howl / Pack Ledger (other pack auras), Near Oath (one **hostile** next spell range ≤ 1), Paper Wind (range cut on a **target**).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_clamp_next_spell_range_1"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2 with range ≥ 3. **Do not** put on `stride_precentor` (Pack Stride), `cadence_lender` (Pack Tithe), or `tempo_precentor` (Pack Still).  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies out of 2; this is a **hostile** pack identity — they are forcing **their** snipers into melee, which is the tell  
SYNERGIES: Side Bite after they clustered; Pack Howl **or** Close, not both in CORE  
BALANCE_RISK: Forcing Frost to range 1 is a self-nerf unless the pack is already in melee. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`. The tell is the point: the player sees a technique they cannot take.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe (and would not grant anyway).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-mid-fold`

NAME: Mid Fold  
ROLE: POSITION — swap two player-side bodies that share an axis  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `mid_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `mid_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 6  
RANGE: 5  
TARGET_TYPE: special  
LOS: false  
COOLDOWN: 4  
EFFECT: Exactly two living **player-side** bodies. They must share rank **or** file. Swap them through occupancy. If they do not share an axis, or either dest is illegal after vacating, the whole fold fizzles (AP spent) (`effectParams: {"foldShareAxisPlayerSide":true}`). Occupancy is **not** `map.portals` and not Twin / Triune / Twin Span / Triple Span / Pair Hinge / About Hinge / Quad Span / Knight Fold tables. Distinct from Knight Fold ((2,1) from midpoint), Sovereign Fold (swap then 6 damage), Pawn Trade (two hostiles-to-caster), File Fold (Wave 7 boss), Court Fold. Never owned.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "fold_share_rank_or_file"`. Boss AI only. Skip unless exactly two player-side bodies share rank or file.  
PLAYER_COUNTERPLAY: Keep one summon dead; stand off-axis; occupy so the swap fizzles  
SYNERGIES: Lava / pit under one body; Body Sill after they land  
BALANCE_RISK: Axis scramble. 6 AP + fizzle if off-axis + never owned. Landing on lava/spikes uses existing `recordInBattleChallengeDamage`.  
PERSISTENCE_REQUIREMENTS: Never write `ownedSpellIds`. Optional dim `UNKNOWN TECHNIQUE`. Do not restamp `knight_fold_regent` / `about_hinge_regent` / `court_hinge_regent` / `file_regent` / `span_quad` / `court_stretch_regent` / `orbit_succentor`.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 10)

### 12.1 Unique G≥10 extras (not Wave-10 family CORE)

Unique §11 ids attach as **generationMin: 10 extras** on older families. They are **not** CORE on #625 Wave-9 families and **not** CORE on Wave-10 families (those consume #636).

| Family | Unique Wave-10 extra | Notes |
| :--- | :--- | :--- |
| `axis_locksmith` | Inch Stride (`inch_gallery` MULTI) | Not `pair_gallery` / Pair Stride / Must Span / `march_prefect` |
| `hex_chorister` / `bone_scribe` | Rite First | Not Cast Hold / Strike Hold / Boot Hold / Verse First |
| `glass_sniper` / `far_stinger` | Long Oath | Not Near Oath |
| `ember_knight` / `fuse_binder` | Cinder Reel | Not Paint Reel / Foe Reel |
| `brood_chanter` / `leash_warden` | Side Bite | Not Nook / Field / Lone Sting |
| `glyph_sower` / `stride_hunter` | Ingress Mark | Cell enter. Not Gait Wick / Stride Mark |
| `plate_warden` / `iron_golem` | Off Plate | Not Morrow / Far Hood / Tick Plate |
| `rust_reaver` / `blink_cutter` | Spike Skip | Not Lava Skip / Pit Skip. Not `crypt_sexton` |
| `plate_warden` / `tempo_precentor` | Tapped Plate | Leftover AP 0. Not Still Plate (MP 0) |
| `brood_chanter` | Summon Brace (ELITE) | Not Body Sill / Kennel Sill |
| `pale_cantor` / `font_cantor` | Bar Mend (ELITE; healer CORE only) | Not Clash / Chase / Gait / Shove Mend |
| `cadence_thief` | Cadence Pin | Not Stall / Shave / Flush / Stretch |
| `tax_scribe` / `ley_tollkeeper` | Still Tax | Not Gait Tax / Camp Tax |
| `stone_castellan` / `rime_mason` | Brick Sprout | Not Brick Shift / Brick Wipe |
| `glass_sniper` / `hood_lurker` | Watch Fee (ELITE) | Not Watch Mute |
| `purse_scribe` / `bone_scribe` | Lone Purse (ELITE) | Leftover AP = 1. Not Dry Sting / Full Purse |
| `null_censor` / `rust_reaver` | Banner Cut (ELITE) | `isLeader`. Not Crown Cut / `leader_slayer` |
| `close_precentor` CHAMPION | Pack Close (`ENEMY_ONLY`) | Not `stride_precentor` / `cadence_lender` / `tempo_precentor` |
| `mid_fold_regent` | Mid Fold (`BOSS_ONLY`) | Not `knight_fold_regent` / `span_quad` / `orbit_succentor` |

### 12.2 Wave-10 family CORE consumes #636

The Wave-10 enemy/elite family sheet (not this PR) puts #636 ids in **CORE** for new families. Unique §11 ids may appear there only as G≥10 extras in a later family pass (Wave 11), not as this document’s CORE.

Stamp, do not clone: Shove Mend, Cadence Stretch, Quad Span (implementation-blocked while summon cap is 2), Gait Wick, Dry Sting, Home Step, Must Span, Far Hood, Boot Lend, Quiet Sill, Exit Sting, Purse Keep, Tick Plate, Last Mute, Pair Slide. Court Stretch stays `NOT_PLAYER_LEARNABLE`.

### 12.3 Wave-8 unique CORE (deferred from #625)

#625 deferred dedicated CORE families for Wave-8 unique verbs (`spell-odd-stride` … `spell-about-hinge`) to Wave 10. That remains a **family-sheet** job. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Tithe stays `ENEMY_ONLY`. About Hinge stays `BOSS_ONLY`.

Empty slot → skip. Empty kit → `[physical_attack]`.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 11 forever

Same recipe as Wave 9 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 11 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve).

Suggested Wave-11 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for Wave-9 unique verbs (this catalog’s unique §11 stay extras until then). Four-cell occupy is **#636 Quad Span** — do not clone. Wave 11 families consume unique Wave-9 verbs and any same-day tactical Wave-10 catalog. Mid Fold stays `BOSS_ONLY` on `mid_fold_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / **#590** / **#625** / **#636** / **#646** / **#638** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W10-A. G≥10 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W10-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W10-C. Wave-10 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #636 / #646 / memory Wave-5 ids |
| W10-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `pair_gallery` / `long_gallery` / `march_prefect` as Inch Stride |
| W10-E. Cinder Reel attract caller | `applyAttract` toward nearest hazard | Damage-math rewrite; RAF |
| W10-F. Brick Sprout solvability skip | `findPath` after a hypothetical growth | `mapGen.ts`; skipping `finalizePlayableLayout` on generate |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Ingress Mark detonation, Still Tax consume, Spike Skip consume, and Watch Fee consume read flags at walk / spell-confirm / overwatch-snap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 9 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W10-1 | Encounter start | Possessed-but-unused G10 id does not observe |
| W10-2 | Inch Stride 2-step | Confirm fails; MP not spent; Inch Stride already observed |
| W10-3 | `inch_gallery` defeat | Does not grant. Victory grants once (MULTI) |
| W10-4 | `pair_gallery` / `odd_gallery` / `even_gallery` / `march_prefect` | Do not grant Inch Stride |
| W10-5 | Rite First vs Strike Hold vs Cast Hold vs Boot Hold | Strike illegal until spell vs Strike illegal until walk vs spells illegal until walk vs walk illegal until Strike |
| W10-6 | Long Oath then Frost at Chebyshev 2 | Confirm fails; Strike still legal |
| W10-7 | Cinder Reel no hazard | Fizzle observes; no pull |
| W10-8 | Side Bite vs Nook vs Lone Sting | Adjacent **ally** +8 vs exactly 1 **block** +8 vs 0 Chebyshev-1 **hostiles** +8 |
| W10-9 | Ingress Mark then leave without entering | No detonate. Stride Mark would detonate on leave. Gait Wick would still follow |
| W10-10 | Off Plate hit on **their** turn | Full hit; charge remains. Hit on **your** turn consumes |
| W10-11 | Spike Skip length 2 | Does not ignore the spikes |
| W10-12 | Tapped Plate leftover AP 1 | Fizzle observes; no RES |
| W10-13 | Summon Brace vs Body Sill vs Kennel Sill | Pets ignore shove vs primary cannot leave vs summon cannot leave |
| W10-14 | Bar Mend vs Clash vs Gait vs Shove | Target resolved a **spell** vs Struck vs caster walked vs force-moved. Strike does not count. Non-healer CORE has none |
| W10-15 | Cadence Pin vs Stall vs Shave vs Stretch | One remaining frozen vs +1 all vs ally −1 all vs hostile remaining ×2 |
| W10-16 | Still Tax after they walked last turn | No +1 AP; already observed |
| W10-17 | Brick Sprout would seal the only path | AI skip; if forced, fizzle observes |
| W10-18 | Watch Fee vs Watch Mute | Snap deals damage **and** −1 AP vs snap deals 0 (no fee) |
| W10-19 | Lone Purse leftover 0 or 2 | 10 only. No bonus |
| W10-20 | Banner Cut on non-leader | 10 only. `isLeader` false. Does not restamp `leader_slayer` |
| W10-21 | Pack Close / Mid Fold | Never in `ownedSpellIds` |
| W10-22 | Loaner / `WF-SPL-*` | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W10-23 | G=9 Tide | No Still Tax / Inch Stride (`generationMin: 10`) |
| W10-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W10-25 | No cloned ids | Unique §11 ids absent from #636 / #646 catalogs |
| W10-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Still Tax / Watch Fee / Pack Close are flags |
| W10-27 | Hex Toll | Still not in any SDE pool |
| W10-28 | Memory Wave-5 / Wave-9 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W10-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W10-30 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–9, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, **#590**, **#636**, or **#646** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / **#638** / **#663** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 / #518 / #525 / #563 / #572 / #625 / **#636** / **#638** / **#663** extra doors
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `jackpot`
- Retagging `pair_gallery` / `odd_gallery` / `even_gallery` / `long_gallery` / `march_prefect` as Inch Stride
- New facing cards (still fail closed)
- Putting unique §11 ids in #558 CORE, #625 CORE, or Wave-10 #636 CORE
- Cloning #636 (`spell-shove-mend` … `spell-court-stretch`) or #646 (`spell-pair-stride` … `spell-knight-fold`) into unique §11

---

## 17. Wave-10 index

**Unique SDE ids (19):** inch-stride, rite-first, long-oath, cinder-reel, side-bite, ingress-mark, off-plate, spike-skip, tapped-plate, summon-brace, bar-mend, cadence-pin, still-tax, brick-sprout, watch-fee, lone-purse, banner-cut, pack-close, mid-fold.

**#636 stamps (do not clone; Wave-10 family CORE):** Shove Mend, Cadence Stretch, Quad Span, Gait Wick, Dry Sting, Home Step, Must Span, Far Hood, Boot Lend, Quiet Sill, Exit Sting, Purse Keep, Tick Plate, Last Mute, Pair Slide, Court Stretch.

**#646 stamps (do not clone):** Pair Stride, Boot Hold, Near Oath, Paint Reel, Nook Bite, Stride Mark, Foe Plate, Lava Skip, Still Plate, Body Sill, Clash Mend, Cadence Shave, Gait Tax, Brick Wipe, Watch Mute, Full Purse, Pet Cut, Pack Stride, Knight Fold.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-inch-stride` | MULTI_SOURCE | yes | locksmith G≥10 **or** `inch_gallery` | **One** next walk Chebyshev ≤ 1 (not Must Span / Pair Stride) |
| `spell-rite-first` | ENEMY_DISCOVERY | yes | hex / scribe | Cannot Strike until they resolve a spell |
| `spell-long-oath` | ENEMY_DISCOVERY | yes | glass / far stinger | Next spell illegal unless range ≥ 3 |
| `spell-cinder-reel` | ENEMY_DISCOVERY | yes | ember / fuse | Pull 1 toward nearest hazard |
| `spell-side-bite` | ENEMY_DISCOVERY | yes | brood / leash | Bonus if adjacent ally |
| `spell-ingress-mark` | ENEMY_DISCOVERY | yes | glyph / stride | Cell paint; detonate on **enter** (not Stride Mark leave) |
| `spell-off-plate` | ENEMY_DISCOVERY | yes | plate / golem | Next **off-turn** hit is 0 |
| `spell-spike-skip` | ENEMY_DISCOVERY | yes | reaver / blink | 1-tile walk ignores spikes |
| `spell-tapped-plate` | ENEMY_DISCOVERY | yes | plate / tempo | Leftover AP 0 → +RES (not Still Plate MP 0) |
| `spell-summon-brace` | ELITE | yes | brood_chanter | Allied summons ignore forced move |
| `spell-bar-mend` | ELITE | yes | pale / font cantor | Heal iff target resolved a **spell** (not Strike) |
| `spell-cadence-pin` | ENEMY_DISCOVERY | yes | cadence_thief | One remaining CD does not tick |
| `spell-still-tax` | ENEMY_DISCOVERY | yes | tax / ley | Next spell +1 AP if they camped last turn |
| `spell-brick-sprout` | ENEMY_DISCOVERY | yes | stone / rime | Grow adjacent barrier 1 cell |
| `spell-watch-fee` | ELITE | yes | glass / hood | Overwatch snap also costs the walker 1 AP |
| `spell-lone-purse` | ELITE | yes | purse / scribe | Bonus if leftover AP **exactly 1** |
| `spell-banner-cut` | ELITE | yes | null / reaver | Bonus vs `isLeader` (not Crown Cut) |
| `spell-pack-close` | ENEMY_ONLY | no | `close_precentor` CHAMPION | Pack next-spell range clamp 1 |
| `spell-mid-fold` | BOSS_ONLY | no | `mid_fold_regent` | Swap two player-side bodies that share an axis |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-9 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #636 so Shove Mend / Must Span / Quad Span land once as Wave-10 family CORE. Not a license to land combat code in the same change as this spec.
