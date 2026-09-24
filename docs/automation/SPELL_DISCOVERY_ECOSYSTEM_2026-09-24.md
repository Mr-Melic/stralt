# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 7

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-24  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Wave 3 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md), PR #300) is Generation 3. Wave 4 (still-open #371) is Generation 4. Wave 6 (still-open #480) is Generation 6. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. Wave 6 (#480) is Generation 6 so those memory ids stay tombstoned. This document is **Generation 7**. `generationMin: 7`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-24.md`](./ACTION_IDS_SDE_2026-09-24.md).

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
| Wave-1…6 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-23.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 / #473 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | #342 | Gale Fan … Eclipse Fold |
| Tactical gap-fillers W5 | still-open #411 | Oncoming … Act Bell |
| Tactical gap-fillers W6 | still-open #463 | Post Sting … About Face |
| Tactical gap-fillers W7 | **none at audit** (2026-09-24 ~00:13 UTC) | If a same-day `docs: Wave 7 tactical spell proposals` PR opens before merge, **stamp, do not clone** |
| Family sheets | #136 + #349 + #405 + #452 | #452 Wave-6 families consume **#411** as CORE. Do not put unique §11 ids there |
| Boss adaptations | #137 / #197 / #367 / #406 / #474 / same-day #518 | Extra doors claimed through Wave 8 (`gaze_beadle` … `lintel_sacrist`) |
| World dynamics Wave 7 | same-day #503 | `WF-ELT-EVEN_PICKET`, `WF-TEL-FILE_SLIDE`, … — **not** grant tags |
| PX coherence | #343 / #393 / #481 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-7 unique ids in §11 are new.

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

**Do not alias** `spell-even-stride` ↔ `spell-bias-step` / `spell-misstep` / `spell-rank-lock` / `spell-split-pace` / `spell-spent-stride` / `spell-last-stride` / `WF-ELT-EVEN_PICKET`, `spell-strike-hold` ↔ `spell-oath-blade` / `spell-dull-edge` / `spell-oath-bind`, `spell-ground-oath` ↔ `spell-aim-veil` / `spell-axis-veil` / `spell-ward-cell` / `spell-open-pit`, `spell-walk-toll` ↔ `spell-ley-toll` / `spell-hex-toll` / `spell-crowd-tax` / `spell-exit-tithe` / `spell-glyph-tax` / `spell-camp-tax`, `spell-purse-lock` ↔ `spell-empty-purse` / `spell-late-purse` / `spell-purse-cut` / `spell-split-purse` / `spell-ap-sip`, `spell-ally-reel` ↔ `spell-file-reel` / `spell-draw-together` / `spell-undertow` / `spell-leash-hook`, `spell-echo-paint` ↔ `spell-cinder-tile` / `spell-echo-cast` / `spell-false-echo` / `spell-wick-bite` / `spell-ash-sill`, `spell-blink-seal` ↔ `spell-claim-ward` / `spell-grounded-lock` / `spell-phase-slip` / `spell-self-anchor`, `spell-gift-sill` ↔ `spell-pet-sill` / `spell-ash-sill` / `spell-whelp-sill` / `spell-gaze-sill` / `spell-last-stride`, `spell-split-fang` ↔ `spell-split-mark` / `spell-split-pace` / `spell-split-purse` / `spell-sated-fang` / `starter-blast`, `spell-wall-bite` ↔ `spell-wick-bite` / `spell-corner-lens` / `spell-pit-sight`, `spell-cast-mark` ↔ `spell-split-mark` / `spell-debt-mark` / `spell-twice-mark` / `spell-stride-brand`, `spell-still-leash` ↔ `spell-short-leash` / `spell-keep-kennel` / `spell-still-brand` / `spell-leash-hook`, `spell-pet-verse` ↔ `spell-choir-verse` / `spell-stolen-verse` / `spell-after-verse` / `spell-cadence-theft` / `spell-pet-share`, `spell-ghost-step` ↔ `spell-mist-step` / `spell-soft-step` / `spell-bias-step` / `spell-hinge-step` / `spell-cover-step` / `spell-ember-step` / `spell-morrow-step` / `spell-second-shadow`, `spell-thin-ward` ↔ `spell-turn-cap` / `spell-bloodless-plate` / `spell-ward-plate` / `spell-surplus-ward`, `spell-clean-blood` ↔ `spell-wounded-lens` / `spell-corner-lens` / `spell-gate-sight` / `spell-bloodless-plate`, `spell-pack-still` ↔ `spell-pack-ledger` / `spell-pack-tempo` / `spell-pack-howl` / `spell-pack-cover` / `spell-aim-veil`, `spell-file-fold` ↔ `spell-court-fold` / `spell-sovereign-fold` / `spell-eclipse-fold` / `spell-file-reel` / `WF-TEL-FILE_SLIDE`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Same-day tactical Wave 7 (none at audit)

No `docs: Wave 7 tactical spell proposals` PR existed at HEAD-audit time (`0f5363f`, open queue through #508). This catalog therefore **authors** the G≥7 holes in §10 / §11.

If a tactical Wave-7 PR opens before this branch merges:

1. **Stamp** those ids onto family overlays. Do **not** clone them as unique §11 rows.
2. Unique §11 ids in this document stay this catalog’s. Do not rename them to match the tactical PR.
3. Do not restamp that PR’s feat / boss / MULTI doors.

### 0.3 Held holes (still not this pass)

Wave 6 §13 listed these as Wave-7 candidates. This wave **does not** fill them:

| Held hole | Why still held |
| :--- | :--- |
| Mid-RAF splice of the current actor | AGENTS.md: do not touch RAF / turn logic. Act Bell / Queue Cut / False Cut already own end-of-turn wrap |
| Fourth `mpCost > 0` walk snipe | Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. `executeCastAttempt` is still AP-only (WX 17096–17207) |
| Player-owned Hex of Silence | Full-bar lock stays `BOSS_ONLY` |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-three days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 / 09-22 / 09-23 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2408 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`main.mo` 134–142) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | Feats cannot grant a spell id |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | Challenges cannot grant a spell id **until** a later writer; this wave **stamps leftover doors** `hard_1` / `legendary_1` as MULTI children |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | WX 11920; zone object at 4683–4687 | `Math.floor(levelZone)` is `NaN`; every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-7 unique ids stay `mpCost: 0`. Walk Toll / Gift Sill touch the **walk** pool via flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690+; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | File Reel (#463) remains the first attract-along-axis caller. Ally Reel is attract-toward-**ally**, a new caller |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face **fail closed**. **No new Wave-7 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| Open PR queue | #327, #331, then #333+ (docs/fixes). Same-day #502+. **#371 owns Wave-4 SDE. #411 owns Wave-5 tactical. #463 owns Wave-6 tactical. #480 owns Wave-6 SDE. #452 owns Wave-6 families. #474 owns Wave-7 extra doors. #518 owns Wave-8 extra doors (`gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist`). #503 owns Wave-7 world features.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0, Wave-2 P0, Wave-3 P0, Wave-4 P0, and Wave-6 P0 remain the prerequisite. **Do not land Wave-7 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 7 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥7 rares make it sharper: a CHAMPION may hold the generation-7 verb until leftover AP / walk MP is already committed.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 7 fills holes Waves 1–6, memory Wave 5, #120, #185, #282, #342, #411, #463, and **#480** left open (see §10). It does not clone Shield, Quiet Hex, Bias Step, Empty Purse, Aim Veil, Cadence Theft, Short Leash, Court Fold, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 7 stamps `generationMin: 7`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Walk Toll adds **+1 MP to the next walk**; Gift Sill **grants** 1 leftover MP on enter. Neither is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing. Wave 7 unique ids do **not** require `currentView`.
15. **Leftover challenge doors may be stamped once.** Wave 6 reserved `hard_1` / `legendary_1` / `survivor` as Wave-7 identities. This wave stamps **`hard_1` and `legendary_1` only**. `survivor` stays leftover (Last Ember / Last Ward already own the 1-HP fantasy).

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

Wave-7 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| Even Stride **cast** (AP spent), target already rooted | **Yes** — the technique was used |
| Illegal cardinal/odd walk **after** Even Stride is on them | **No** — that is their failed confirm, not a second observe |
| Walk Toll **arm** | **Yes** on the cast. Paying the extra MP on a later walk is **not** a second observe |
| Gift Sill **paint** | **Yes** on the cast. Stepping onto the cell (even if it grants MP) is **not** a second observe |
| Echo Paint copies last hazard onto a neighbor | **Yes** on the paint cast. The original Cinder Tile / Rime Sheet observe is that other id |
| Cast Mark **arm** | **Yes** on the mark. Detonation when they later **cast** is **not** a second observe |
| Ghost Step **arm** | **Yes** on the cast. Occupying the vacated cell is **not** a second observe |
| Split Fang 50/50 two `dealDamage` calls | **One** observe (the cast) |
| Thin Ward / Clean Blood **challenge child** | Observation **not** required for that child. Observe+win is the other MULTI child. First child wins |
| Pack Still aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| File Fold | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orb pickup / `WF-SPL-*` attune | **No** |
| `WF-ELT-EVEN_PICKET` contact | **No** — not `even_gallery` |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 7 stamps unused **family** attachments, one special MULTI, and **two leftover challenge doors**. It does **not** add enum members.

| Source | Wave-7 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥7 family verbs in §11 |
| `ELITE` | Still Leash, Pet Verse, Ghost Step |
| `ACHIEVEMENT` | **none** — all 15 feat doors remain claimed or leftover (`survivor` / `leader_slayer` / `jackpot` / `spell_master`). Still never `unstoppable` |
| `CHALLENGE` | Thin Ward ← `hard_1`. Clean Blood ← `legendary_1` |
| `BOSS` | **none** — live-19 first-wins and extra doors through #474 / #518 stay claimed. File Fold is `BOSS_ONLY` |
| `SPECIAL_ENCOUNTER` | Even Stride ← `even_gallery` (MULTI child; observation not required for that child) |
| `MULTI_SOURCE` | Even Stride ← locksmith observe+win **or** `even_gallery`. Thin Ward ← plate observe+win **or** `hard_1`. Clean Blood ← glass observe+win **or** `legendary_1`. First child wins |
| `ENEMY_ONLY` | Pack Still (never owned) |
| `BOSS_ONLY` | File Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-7 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every live feat and challenge from Waves 1–6, #120 / #185 / #282 / #342 / #411 / #463, plus boss extra doors, **plus this wave’s two challenge stamps**:

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
| `lord_of_static` | #342 Draw Together MULTI |
| `starborn_queen` / `pale_archivist` / `starved_vampire_pawn` / `final_pawn` | #342 Cut In / After Verse / Sanguine Toll / Eclipse Fold |
| `weeping_pawn` / `eternal_pawn_king` / `enthroned_void` | #411 Mute Thread / Queue Cut / File Vault |
| `ram_castellan` / `fosse_warden` / `stride_censor` / `morrow_herald` | #367 extra doors |
| `lock_marshal` / `bait_vicar` / `font_abbess` / `surplus_auditor` | #406 extra doors |
| `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` | #463 **proposed Wave-7 extra doors** — do not restamp |
| `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` | #474 Wave-7 extra doors — do not restamp. File Fold uses `file_regent`, not these four |
| `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` | #518 Wave-8 extra doors (Facing Pin / Span Guard / Cover Step / Low Lintel) — do not restamp |
| `choir_gallery` | Wave 6 Choir Verse MULTI child |
| **`hard_1`** | **this wave** Thin Ward MULTI child (`no_healing_under_30_damage`). Not Bloodless Plate |
| **`legendary_1`** | **this wave** Clean Blood MULTI child (`no_damage_taken`). Not Bloodless Plate / easy_3 |

Economy feats stay Doka-only until a designer needs a non-damage identity. `unstoppable` stays unused forever as a spell gate. **Still leftover after this pass:** `survivor`, `leader_slayer`, `jackpot`, `spell_master`. Do not stamp `survivor` (Last Ember / Last Ward).

---

## 5. Spell pool evolution — Generation 7 (never a last tier)

Wave 1 §6 five pools and later generation stamps stay. Wave 7 adds the **G≥7 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, 3, 4, 5, 6, 7, … no maximum
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
| 8+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or later G verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **7** for families listed in §12. It remains a data query, not a constant in combat math.

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
  10. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  11. drop any id whose AI_REQUIREMENTS are unmet
  12. keep ENEMY_ONLY on enemies (they cast; they never grant)
  13. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at WX 11920).

Do **not** put unique §11 ids in #405 CORE or #452 CORE. Those families already consume #342 / #411 identities.

---

## 6. New `aiHint` keys (metadata, not names)

Prior-wave hints still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `force_even_manhattan_walk` | caster, controller | Target likely to walk ≥ 1; skip if rooted or MP = 0 |
| `forbid_strike_until_walk` | guardian, charger | Target is adjacent and likely to Strike; skip if they already walked this turn |
| `next_spell_ground_only` | caster, controller | Target’s next likely action is a unit-targeted spell; skip if they have no such id |
| `tax_next_walk_mp` | guardian, kiter | Target has MP ≥ 1 and a walk path; skip if MP = 0 |
| `freeze_leftover_ap` | caster, controller | Target leftover AP ≥ 2; skip if leftover ≤ 1 |
| `attract_toward_nearest_ally` | buffer, controller | Living allied body exists; landing cell free; skip if none or already adjacent to that ally |
| `copy_last_paint_adjacent` | caster | A painted hazard exists on the board this battle; an empty Chebyshev-1 neighbor of that cell is free; skip if no paint |
| `forbid_displace_ids` | controller, guardian | Target likely to Swap / Phase Slip / pad; skip if they have none of those ids and no pad is visible |
| `paint_enter_plus_mp` | controller, guardian | An empty cell on the player’s likely path; skip if already adjacent |
| `split_hit_adjacent_hostile` | caster, berserker | Two living hostiles Chebyshev ≤ 1 from each other in range; skip if 0–1 clustered |
| `bonus_if_adj_block` | charger, caster | Target cell Chebyshev-adjacent to a blocking tile; skip if open floor on all 8 |
| `detonate_on_cast` | caster, controller | Target likely to cast a spell (not Strike) next; skip if they only have Strike |
| `pause_hostile_summon_lifespan` | caster, controller | Hostile summon remaining lifespan ≥ 2; skip if none |
| `steal_summon_cooldown` | caster, controller | Hostile summon has a kit id with remaining CD ≥ 1 **or** a just-cast id; skip if no summon |
| `occupy_last_cell_left` | flanker, kiter | Caster intends to walk ≥ 1 this turn after arming; skip if MP = 0 |
| `cap_next_incoming` | guardian, tank | Caster expects to be hit; skip if already capped |
| `ignore_los_if_untouched` | kiter, caster | Caster took 0 damage last enemy-turn (or this battle so far); skip if already damaged |
| `pack_zero_leftover_veil` | buffer | CHAMPION only; skip if aura up or no ally in 2 with leftover 0 |
| `fold_shared_file_player_side` | **boss AI only** | Two living player-side bodies share rank **or** file and are not the same cell; skip if 0–1 |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

Prior-wave hints stay on those catalogs. Do not re-author them. Do not assign Face Away / Oncoming / Glance Cut / About Face until a battle `currentView` writer exists.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: `pendingAchievementToast` at `WorldExploration.tsx` 2173 / 17949. **Do not grow WX.**
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Gift Sill / Walk Toll may add a **battle-log line** when the extra MP is paid or granted (`WALK TOLL +1 MP` / `GIFT SILL +1 MP`) — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.
- Challenge MULTI children (`hard_1` / `legendary_1`) show `NEW SPELL DISCOVERED` on the **same** recap as the feat/challenge Doka. Do not add a second popup.
- Leftover-AP freeze, even-walk fail, and Ghost Step occupancy are **not** a second cue.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 7 adds **no** new canister methods.

| Writer | Wave-7 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | `even_gallery` / `hard_1` / `legendary_1` MULTI children (victory or challenge complete, no observation). **No** feat/boss stamps this wave |

Rules that must stay true:

- Enqueue on `createProgressPersist`. `commit` after the canister write.
- Grant is owned-id **append only**.
- Must not call `upgradeSpell` (charges `spellLevelingBaseCost * 2^level`).
- Must not call `updateCharacter`.
- Must not mint Doka/XP.
- Must not reset `spellLevelKeys`.
- Duplicate victory callback → empty grant list.
- Duplicate challenge-complete callback → empty grant list (idempotent).
- Death penalty (`saveBattleStats` 20/40) does not touch owned/observed.
- `localStorage` is cache only.
- Ally Reel / Ghost Step / Split Fang landings use existing hazard helpers when a body lands on lava/spikes (`recordInBattleChallengeDamage` while `inBattleRef`).
- Loaner orbs / `WF-SPL-*` attune never write `ownedSpellIds`.
- `spell-pack-still` / `spell-file-fold` never write `ownedSpellIds`.

---

## 9. Special encounters (Wave 7)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is `unlockOwnedSpell` / observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms. **Do not** reuse encounter-catalog `ENC-*` ids or world-feature `WF-*` ids as spell tags.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `even_gallery` | Axis Locksmith + pawn; locksmith prefers Even Stride when the player has a 1-tile cardinal path | `spell-even-stride` on **victory** (no observation — `SPECIAL_ENCOUNTER` MULTI child) **or** observe+win if the id is used. **Not** `WF-ELT-EVEN_PICKET` |
| `toll_nave` | Tide Shade on a 3-tile corridor; AI prefers Walk Toll when the player has MP ≥ 1 | `spell-walk-toll` via observe+win |
| `lock_nave` | Tax Scribe + pawn; scribe starts leftover AP ≥ 2 and prefers Purse Lock | `spell-purse-lock` via observe+win. **Not** Wave-6 `purse_nave` (Empty Purse) |
| `paint_gallery` | Ember Knight on an existing cinder cell; AI prefers Echo Paint onto the empty neighbor the player must enter | `spell-echo-paint` via observe+win |
| `ghost_court` | Blink Cutter with MP ≥ 1; AI arms Ghost Step then walks 1 | `spell-ghost-step` via observe+win |

Prior specials (`echo_dummies`, `rime_gallery`, `still_court`, `mist_gallery`, `undertow_channel`, `ember_fan`, `rift_twins`, `long_gallery`, `gate_gallery`, `triune_gallery`, `haze_gallery`, `stolen_pulpit`, `nail_court`, `pit_gallery`, memory Wave-5 `gaze_gallery` / `span_court` / `lintel_hall` / `cadence_nave` / `soft_gallery`, Wave-6 `choir_gallery` / `wick_gallery` / `purse_nave` / `pet_sill_hall` / `dull_court`) are not re-specified.

Ghost Step occupancy is not `map.portals` and not Twin/Triune/Twin Span pads. `WF-SPL-ECHO_SCRIBE` / `WF-SPL-LOANER_MAGE` / loaner orbs never write `ownedSpellIds`. `WF-TEL-FILE_SLIDE` is a world inlay, not File Fold.

---

## 10. Balance doctrine — holes this wave fills

Prior waves + tactical catalogs already cover: push, pull, blink, root, range buff **and** cut, absorb, redirect, cleanse, burn tile, trap, AP zone, turret, pet, bounce, next-spell AP tax, cone, two-body swaps, portal-pair, evade, leftover-AP evade, distance poke, MP/AP steal, pit, heal totem, walk-brand, conveyor, axis lock, mass shove, delayed blink, pincer, diagonal poke, pair attract, ally shove, origin-cast tax, intercept pylon, HP+MP hybrid, facing bonus/lock/front-cell, next-spell silence, walk-then-fizzle, end-of-turn insert, ally teleport 3–4, rigid two-cell occupy, stationary 2-cell pylon, cooldown steal, attacker +1 CD, hit redirect to ally, HP%-gated walk, act-sooner tax, delayed-on-act, caster-unmoved poke, leftover-AP **target** bonus, LoS-blocked poke, 90° hinge, file-axis attract, walking two-cell occupy, Strike-only brand, primary-target veil, self CD reset to 0, ally CD −1, leftover-AP share, walk-exit AP tax, enter-swap tile, spark whelp, hit cap 12, mass facing invert, copy last **ally** id, force next walk **diagonal**, bonus on **paint**, leftover AP → this hit, walk **through me** AP tax, swap **own summon**, +range if LoS **blocked**, invert **one** view, next Strike **0**, cell forbids **summon enter**, leftover burns at **turn end**, share incoming to a **summon**, cut hostile summon **lifespan**, shared axis cannot be **spell primary**, next forced-move skips **hazard**, leftover 0 → +1 range, next 1-tile walk skips overwatch, pack leftover-AP aura, fold two **adjacent** player-side bodies.

**Still open (Wave 7 SDE unique ids).** Held holes from §0.3 stay held.

| Hole | Wave-7 id | Why it is not a clone |
| :--- | :--- | :--- |
| Next walk Manhattan **even** | `spell-even-stride` | Bias Step forces **diagonal**. Misstep forces **cardinal**. Rank Lock locks **axis**. Split Pace is +range after a long walk. Even Picket is a **world elite clock**, not a spell |
| Cannot Strike until they **walk** | `spell-strike-hold` | Oath Blade makes **other ids** fizzle (Strike still hurts). Dull Edge makes Strike deal **0** (they can still choose it) |
| Next spell must target **empty/ground** | `spell-ground-oath` | Aim Veil is a **unit** flag (cannot be primary). Axis Veil is **axis** cannot be primary. Open Pit blocks **walks** |
| Next walk costs **+1 MP** | `spell-walk-toll` | Exit Tithe / Crowd Tax / Glyph Tax are **AP**. Ley Toll is `spell.mpCost` on the **cast**. Last Stride is a walk-MP **waiver** (memory Wave 5) |
| Leftover AP **frozen** this turn | `spell-purse-lock` | Empty Purse **spends** leftover. Late Purse **burns** it at wrap. Split Purse **moves** 1. AP Sip steals **current** AP |
| Pull 1 toward nearest **ally** | `spell-ally-reel` | File Reel is along a **shared file toward the caster**. Draw Together is **pair** attract. Undertow is self-center + 1 walk-MP |
| Copy last **paint** onto a neighbor | `spell-echo-paint` | Cinder Tile **is** the paint. Wick Bite **bonuses** standing on paint. Echo Cast copies a **spell** |
| Cannot Swap / blink / pad | `spell-blink-seal` | Claim Ward blocks swap/blink on a **cell**. Grounded Lock roots **walk**. Self Anchor **ignores** push/pull |
| Enter cell **grants** 1 leftover MP | `spell-gift-sill` | Pet Sill **forbids summon enter**. Taxes take MP/AP. Last Stride **waives** a walk cost. Not `spell.mpCost` |
| Hit splits 50/50 onto two **clustered** hostiles | `spell-split-fang` | Chain Lightning **bounces** to nearest, full payload each hop. Overkill **retargets** the whole action. Split Mark is a **mark** |
| Bonus if adjacent to a **blocking tile** | `spell-wall-bite` | Wick Bite is **paint**. Corner Lens is **blocked LoS**. Pit Sight is pit on the **ray** |
| Mark detonates if they **cast** | `spell-cast-mark` | Split Mark detonates on **hit**. Stride Brand is a **walk**. Debt Mark is next-spell **AP tax** |
| Pause hostile summon **lifespan** | `spell-still-leash` | Short Leash **cuts**. Keep Kennel **adds allied**. Sever Tether **kills**. Convert Whelp **steals** |
| Steal 1 CD from a hostile **summon kit** | `spell-pet-verse` | Cadence Theft steals from a **caster**. Choir Verse copies last **ally**. Cadence Break **resets own** to 0 |
| Occupy the last cell the caster **left** | `spell-ghost-step` | Twin Span is two **posts**. Span Guard is a **rigid pair**. Second Shadow is memory-adjacent ENEMY_ONLY. Claim Ward is a **painted cell** you choose |
| Next incoming hit **capped at 30** | `spell-thin-ward` | Turn Cap is **outgoing** 12. Bloodless Plate is **easy_1 no-heal**. Surplus Ward is leftover-AP **evade** |
| Ignore LoS if **untouched last turn** | `spell-clean-blood` | Wounded Lens ignores LoS **after being hit** (opposite). Corner Lens is +range if LoS **blocked**. Gate Sight ignores one **barrier**. `legendary_1` is the Untouchable **challenge**, not this spell by itself |
| Pack aura: leftover-0 allies cannot be **spell primary** | `spell-pack-still` | Pack Ledger banks leftover. Pack Tempo is +1 **max/start** AP. Aim Veil is a **unit** flag. Never owned |
| Fold two player-side bodies that **share a file/rank** | `spell-file-fold` | Court Fold requires **adjacency**. Sovereign Fold is **any two**. File Reel is attract-along-file. `WF-TEL-FILE_SLIDE` is a world inlay. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**Held, not filled:** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; player-owned Hex of Silence (full bar lock).

---

## 11. Proposed spells (Wave 7)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–4, memory Wave 5, Wave 6, #120, #137, #185, #282, #342, #411, or #463.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row.

### 11.1 New `effectParams` keys (Wave 7 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables.

```text
nextWalkMustEvenManhattan,
forbidStrikeUntilWalk, forbidStrikeDuration,
nextSpellGroundOnly, nextSpellGroundDuration,
nextWalkMpTax,
freezeLeftoverAp, freezeLeftoverDuration,
attractTowardNearestAlly, attractAllyDistance,
copyLastPaintAdjacent, copyPaintTypes,
forbidDisplaceIds, forbidDisplaceDuration,
enterCellPlusMp, enterCellPlusMpOnce,
splitHitAdjacentPct, splitHitAdjacentRadius,
wallAdjBonusDamage,
detonateOnCast, detonateOnCastDamage,
pauseHostileSummonTurns,
stealSummonCooldown,
occupyLastCellLeft, occupyLastCellDuration,
capNextIncoming, capNextIncomingValue,
ignoreLosIfUntouched,
packZeroLeftoverVeil, packZeroLeftoverRadius,
foldSharedFilePlayerSide, foldSharedFileDamage
```

Facing cards from prior waves **fail closed** until a battle `currentView` writer exists. Wave 7 unique ids do not read `currentView`.

---

### SPELL_ID: `spell-even-stride`

NAME: Even Stride  
ROLE: CONTROL — next walk must be even Manhattan  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via locksmith; false if via `even_gallery`  
MINIMUM_ELIGIBILITY: Families `axis_locksmith` or `glyph_sower` or `misstep_herald`; `G ≥ 7`; `aiProfile` caster/controller. **Or** victory on `even_gallery`  
ENEMY_FAMILIES: `axis_locksmith`, `glyph_sower`, `misstep_herald`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥7. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Target’s **next walk of ≥ 1 tile** this battle (or 2 turns) must have even Manhattan length (`(abs(dx)+abs(dy)) % 2 === 0`, so 2 or 4, not 1 or 3). Odd-length confirms fail (MP not spent). Teleport / Swap / Phase Slip / pad transit do **not** pay (`effectParams: {"nextWalkMustEvenManhattan":true}`). Distinct from Bias Step (diagonal), Misstep (cardinal), Rank Lock (axis). Not `WF-ELT-EVEN_PICKET`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "force_even_manhattan_walk"`. Skip if rooted or MP = 0. **Do not** put on the same BASE kit as Bias Step **and** Misstep; ELITE may own two walk-shape cards only if AI never casts both the same turn.  
PLAYER_COUNTERPLAY: Blink; Strike in place; walk 2 the way they wanted  
SYNERGIES: File Lance after they cannot take a 1-step file; Crowd Tax on the remaining even path  
BALANCE_RISK: Even + Misstep + Bias Step is a hard brick. Different families at BASE.  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `even_gallery` victory. First MULTI child wins. No Doka.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-strike-hold`

NAME: Strike Hold  
ROLE: CONTROL — cannot Strike until they walk  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden`, `iron_golem`, or `null_censor`; `G ≥ 7`; `aiProfile` guardian/charger  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`, `null_censor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥7. `generationMin: 7`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. For 1 turn (or until they complete a walk of ≥ 1 tile), `physical_attack` is illegal for the target (`effectParams: {"forbidStrikeUntilWalk":true,"forbidStrikeDuration":1}`). Other spell ids remain legal. Walk / blink / swap all count as “walked” for this flag. Distinct from Oath Blade (other ids fizzle) and Dull Edge (Strike deals 0).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_strike_until_walk"`. Cast when adjacent and they still have Strike as the likely next action. Skip if they already walked this turn.  
PLAYER_COUNTERPLAY: Cast Frost / Poison; walk 1 then Strike; Quiet Hex the Hold  
SYNERGIES: Dull Edge is **not** stacked on BASE with this; Oath Blade stays #463 BOSS  
BALANCE_RISK: Melee-only kits become skip-turns. 1 turn + other ids still work + G≥7.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ground-oath`

NAME: Ground Oath  
ROLE: CONTROL — next spell must target empty/ground  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pit_mason` or `origin_mason`; `G ≥ 7`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `pit_mason`, `origin_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. Target’s **next non-Strike spell** this battle (or 2 turns) must have `targetType` in `{ground, empty, self}` or it fizzles (AP spent) (`effectParams: {"nextSpellGroundOnly":true,"nextSpellGroundDuration":2}`). Strike is unaffected. Summon ids that target ground remain legal. Distinct from Aim Veil (unit cannot be primary) and Axis Veil (axis cannot be primary).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_ground_only"`. Skip if the target’s kit is Strike-only.  
PLAYER_COUNTERPLAY: Strike; Barrier / Cinder Tile / Open Pit as the ground cast; wait 2 turns  
SYNERGIES: Open Pit after they are forced to spend the ground cast; Quiet Hex so they cannot afford a 3-AP ground tool  
BALANCE_RISK: Casters with no ground id skip a turn. 2-turn window + Strike legal + CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-walk-toll`

NAME: Walk Toll  
ROLE: CONTROL — next walk costs +1 MP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade`, `recoil_squire`, or `gait_muter`; `G ≥ 7`; `aiProfile` guardian/kiter  
ENEMY_FAMILIES: `tide_shade`, `recoil_squire`, `gait_muter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥7. `generationMin: 7`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Target’s **next walk of ≥ 1 tile** costs 1 extra MP from the walk pool (`effectParams: {"nextWalkMpTax":1}`). If they cannot pay, the walk confirm fails (no partial step). Teleport / Swap / pads do **not** pay. `spell.mpCost` stays 0. Distinct from Ley Toll (cast spends MP), Exit Tithe (AP on leaving a cell), Crowd Tax (AP through me).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_mp"`. Skip if target MP = 0.  
PLAYER_COUNTERPLAY: Blink; Strike in place; Gift Sill to refund the tax; stay put  
SYNERGIES: `toll_nave`; Rank Lock then they cannot walk the cheap axis  
BALANCE_RISK: MP-starved kiting dies. One walk + CD 2 + G≥7. Do not also add `spell.mpCost`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Paying the tax is not a second observe. Also the intended `toll_nave` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-purse-lock`

NAME: Purse Lock  
ROLE: CONTROL — leftover AP frozen  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe`, `ledger_siphon`, or `bone_scribe`; `G ≥ 7`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ledger_siphon`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. For the rest of the target’s **current** turn (if it is their turn) or their **next** turn (if it is not), leftover AP cannot be spent on spells or Attack Nearest (`effectParams: {"freezeLeftoverAp":true,"freezeLeftoverDuration":1}`). They may still spend AP that refreshes at turn start. Empty Purse / Late Purse read 0 leftover while frozen. Does not write persisted `CharacterStats.ap`. Distinct from Empty Purse (spend leftover now), Late Purse (burn at wrap), Split Purse (move 1).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "freeze_leftover_ap"`. Skip if leftover ≤ 1.  
PLAYER_COUNTERPLAY: Spend leftover **before** they lock; Quiet Hex; End Turn  
SYNERGIES: `lock_nave`; Act Tax so leftover was already going to vanish  
BALANCE_RISK: Freezing a 6 leftover Inferno is the nightmare. 1 turn + G≥7 + CD 2. Do not stack Empty Purse on the same BASE turn plan.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ally-reel`

NAME: Ally Reel  
ROLE: POSITION — pull 1 toward nearest ally  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pale_cantor`, `font_cantor`, or `cover_squire`; `G ≥ 7`; `aiProfile` buffer/controller  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`, `cover_squire`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Pull the target 1 tile toward the caster’s nearest living **ally** (Chebyshev; not self). If no ally, or the landing cell is blocked, fizzle (`effectParams: {"attractTowardNearestAlly":true,"attractAllyDistance":1}`). Uses `applyAttract` toward that ally’s cell. Lava/spikes on landing use existing ticks. Distinct from File Reel (shared file toward **caster**), Draw Together (pair), Undertow (self-center).  
SCALING: distance fixed  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_ally"`. Skip if no ally or already Chebyshev-adjacent to that ally. **Do not** assign until `applyAttract` has a cast caller (File Reel is the sibling first caller — this is the second).  
PLAYER_COUNTERPLAY: Kill the ally first; Claim Ward the landing; stand where the pull is a 0-step  
SYNERGIES: Wick Bite / Echo Paint on the landing; Crowd Tax after they are dragged through the guardian  
BALANCE_RISK: Pull onto lava is the spike. Distance 1 + fizzle if blocked + existing hazard helpers.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Landing hazard is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-echo-paint`

NAME: Echo Paint  
ROLE: HAZARD — copy last paint onto a neighbor  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `ember_knight`, `fuse_binder`, or `glyph_sower`; `G ≥ 7`; `aiProfile` caster  
ENEMY_FAMILIES: `ember_knight`, `fuse_binder`, `glyph_sower`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: If a painted hazard of type `cinder`, `rime`, `mire`, or `void` exists this battle, copy **that last-written type** onto one empty Chebyshev-1 neighbor of the clicked ground cell (`effectParams: {"copyLastPaintAdjacent":true,"copyPaintTypes":["cinder","rime","mire","void"]}`). The clicked cell must already hold that type **or** be empty adjacent to it. Open Pit / Barrier / world lava are **not** paint. If no paint exists, fizzle. Distinct from Cinder Tile (places cinder), Wick Bite (bonus on paint), Echo Cast (copies a spell). Respect `MAX_HAZARD_TILES = 50`.  
SCALING: none (hazard type copied)  
AI_REQUIREMENTS: `aiHint: "copy_last_paint_adjacent"`. Skip if no paint on the board.  
PLAYER_COUNTERPLAY: Barrier replaces last writer; step off both cells; do not let them paint the first cell  
SYNERGIES: `paint_gallery`; Wick Bite after the copy; File Reel onto the new cell  
BALANCE_RISK: Free second Cinder is a second zone. Must copy an existing type + empty neighbor + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Also the intended `paint_gallery` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-blink-seal`

NAME: Blink Seal  
ROLE: CONTROL — cannot Swap / blink / pad  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `void_anchoret` or `mist_walker`; `G ≥ 7`; `aiProfile` controller/guardian  
ENEMY_FAMILIES: `void_anchoret`, `mist_walker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. For 2 turns the target cannot resolve `spell-swap`, `spell-phase-slip`, Twin/Triune/Twin Span **pad transit**, or `spell-pawn-trade` (`effectParams: {"forbidDisplaceIds":["spell-swap","spell-phase-slip","spell-pawn-trade"],"forbidDisplaceDuration":2}`). Ordinary walks remain legal. Distinct from Claim Ward (cell), Grounded Lock (root walk), Self Anchor (ignore push).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "forbid_displace_ids"`. Skip if they have none of those ids and no pad is visible.  
PLAYER_COUNTERPLAY: Walk; wait 2 turns; Strike  
SYNERGIES: Crowd Tax after they cannot blink the tax; Rank Lock  
BALANCE_RISK: Deleting blink for 2 turns is harsh into Hold Ground. Duration 2 + CD 3 + walks legal.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gift-sill`

NAME: Gift Sill  
ROLE: SUPPORT — enter cell +1 leftover MP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `origin_mason` or `lintel_mason`; `G ≥ 7`; `aiProfile` controller/guardian  
ENEMY_FAMILIES: `origin_mason`, `lintel_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥7. `generationMin: 7`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Paint an empty floor cell. The **first** unit (either side) to **enter by walk** this battle (or 2 turns) gains 1 leftover MP, cap at max MP (`effectParams: {"enterCellPlusMp":1,"enterCellPlusMpOnce":true}`). Teleport / Swap onto the cell does **not** grant. Not `spell.mpCost`. Distinct from Pet Sill (summons cannot enter), taxes, Last Stride (waiver).  
SCALING: grant fixed  
AI_REQUIREMENTS: `aiHint: "paint_enter_plus_mp"`. Paint a cell on the player’s likely path **or** the cell the caster will enter after Walk Toll. Skip if already adjacent (no path cell).  
PLAYER_COUNTERPLAY: Don’t enter; push a pawn onto it; Walk Toll still taxes the grant  
SYNERGIES: Walk Toll then step the sill; Cover Step onto it  
BALANCE_RISK: Free MP is a second Ley Toll. Once + enter-by-walk + CD 3 + G≥7. Allies can steal it.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The grant step is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-split-fang`

NAME: Split Fang  
ROLE: DAMAGE — 50/50 onto two clustered hostiles  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glance_ward` or `iron_golem`; `G ≥ 7`; `aiProfile` caster/berserker  
ENEMY_FAMILIES: `glance_ward`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 16 to the primary. If a second living hostile is Chebyshev ≤ 1 from the primary, deal 16 to that second as a **second** existing `dealDamage` call (`effectParams: {"splitHitAdjacentPct":50,"splitHitAdjacentRadius":1}`). If none, 16 only (not a fizzle). Not a bounce (does not seek nearest beyond 1). Distinct from Chain Lightning (`starter-blast`) and overkill retarget.  
SCALING: both 16 follow dmg%  
AI_REQUIREMENTS: `aiHint: "split_hit_adjacent_hostile"`. Skip if 0 clustered pairs and Strike is better. Player-side AI: two **enemies** clustered. Enemy-side AI: player + a player summon clustered.  
PLAYER_COUNTERPLAY: Spread summons Chebyshev ≥ 2; Barrier the primary; don’t stand on your whelp  
SYNERGIES: Ally Reel to cluster them; Twin Span adjacency is the bait  
BALANCE_RISK: 32 on a 3-AP CD 2 is Inferno-adjacent. Cluster gate + G≥7. Do not also bounce.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. One observe for both hits.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wall-bite`

NAME: Wall Bite  
ROLE: DAMAGE — bonus if adjacent to a blocking tile  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `pit_mason`; `G ≥ 7`; `aiProfile` charger/caster  
ENEMY_FAMILIES: `stone_castellan`, `pit_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥7. `generationMin: 7`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s cell is Chebyshev-adjacent to a **blocking** tile (wall / unwalkable / `blocksWalk` feature), deal an extra 10 as a second `dealDamage` (`effectParams: {"wallAdjBonusDamage":10}`). Painted hazards, Open Pit, and Barrier are **not** blocking unless they already block walk. Distinct from Wick Bite (paint) and Corner Lens (LoS).  
SCALING: both numbers follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_adj_block"`. Skip if open floor on all 8 and Strike is better.  
PLAYER_COUNTERPLAY: Step to open floor; don’t hug the corridor; Barrier is not a wall  
SYNERGIES: Board Tilt / Rank Lock into a wall; Shoulder Bash into a pillar  
BALANCE_RISK: 20 on 2-AP CD 1 is Frost-adjacent. Wall gate + G≥7. Maps with galleries always have walls — do not also ignore LoS.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cast-mark`

NAME: Cast Mark  
ROLE: MARK — detonates if they cast  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `hex_chorister` or `fuse_binder`; `G ≥ 7`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `hex_chorister`, `fuse_binder`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Apply a mark (2 turns). If the target **casts** a non-Strike spell while marked, the mark detonates for 12 (spell) and is consumed (`effectParams: {"detonateOnCast":true,"detonateOnCastDamage":12}`). Strike, walk, End Turn, and potion Use do **not** detonate. Distinct from Split Mark (detonate on hit), Stride Brand (walk), Debt Mark (next-spell AP tax). Uses explicit `isMark` metadata.  
SCALING: 12 follows dmg%  
AI_REQUIREMENTS: `aiHint: "detonate_on_cast"`. Skip if they only have Strike.  
PLAYER_COUNTERPLAY: Strike; walk; wait out 2 turns; Quiet Hex so they cannot afford a detonate bait  
SYNERGIES: Ground Oath then they must ground-cast into the mark; Quiet Hex  
BALANCE_RISK: Punishing the only 3-AP tool is harsh. Strike legal + 2 turns + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Detonation is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-still-leash`

NAME: Still Leash  
ROLE: CONTROL — pause hostile summon lifespan  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `null_censor`; variant ≥ ELITE or `G ≥ 7`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `null_censor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: If the target is a hostile **summon** (`isSummon`), pause remaining lifespan ticks for 2 of **its** turns (`effectParams: {"pauseHostileSummonTurns":2}`). The body stays. If the target is not a summon, fizzle. Distinct from Short Leash (cut remaining), Keep Kennel (add allied), Sever Tether (kill). Does not steal.  
SCALING: duration fixed  
AI_REQUIREMENTS: `aiHint: "pause_hostile_summon_lifespan"`. Skip if no hostile summon with remaining lifespan ≥ 2. **Do not** put Short Leash and Still Leash on the same BASE turn plan; ELITE `null_censor` may own both if AI prefers cut vs pause by remaining lifespan.  
PLAYER_COUNTERPLAY: Don’t summon; Sever Tether your own dying pet; wait 2  
SYNERGIES: Pet Sill after the pause; Cadence Theft is **not** this card  
BALANCE_RISK: Freezing a bomber on a cell is a second Open Pit. Summon-only + 2 turns + CD 3 + Elite.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle on player still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pet-verse`

NAME: Pet Verse  
ROLE: SUPPORT — steal 1 CD from a hostile summon kit  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `cadence_thief`; variant ≥ ELITE or `G ≥ 7`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `cadence_thief`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: If the target is a hostile **summon** with a kit id on cooldown, steal 1 remaining CD from **one** of those ids (largest remaining first) and apply it to this caster’s matching id if owned, else discard (`effectParams: {"stealSummonCooldown":1}`). If no summon or no CD, fizzle. Distinct from Cadence Theft (caster), Cadence Break (reset own to 0), Choir Verse (copy last ally). Never name-parse the summon.  
SCALING: steal fixed  
AI_REQUIREMENTS: `aiHint: "steal_summon_cooldown"`. Skip if no summon kit CD. Cadence Theft stays the G6 verb on this family; this is the G7 extra.  
PLAYER_COUNTERPLAY: Pets with Strike-only kits; wait CD to 0; Don’t summon  
SYNERGIES: Spark Whelp then steal; Cadence Lend is ally −1, not this  
BALANCE_RISK: Stealing Inferno CD from an archer kit is the spike. Summon-only + 1 CD + Elite.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The stolen id is **not** granted.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ghost-step`

NAME: Ghost Step  
ROLE: POSITION — occupy the last cell left  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `rift_hook`; variant ≥ ELITE or `G ≥ 7`; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rift_hook`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Arm. The caster’s **next walk of ≥ 1 tile** this battle (or 2 turns) leaves a 1-turn occupancy ghost on the **cell they left** (`effectParams: {"occupyLastCellLeft":true,"occupyLastCellDuration":1}`). The ghost blocks walk / summon enter / swap dest the same as a unit, but cannot be targeted, has no HP, and is not a combatant. Teleport / Swap do **not** leave a ghost (they already skip this). Distinct from Twin Span (two posts), Span Guard (rigid pair), Claim Ward (chosen cell), Second Shadow (memory Wave 4 ENEMY_ONLY). Not `map.portals`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "occupy_last_cell_left"`. Arm then walk 1. Skip if MP = 0.  
PLAYER_COUNTERPLAY: Don’t chase the vacated cell; blink past; wait 1 turn  
SYNERGIES: `ghost_court`; Rear Cut after they cannot re-enter; Crowd Tax on the remaining path  
BALANCE_RISK: Sealing the only corridor behind you is a second Open Pit. 1-turn ghost + Elite + CD 3 + walk-gated. Maps must stay solvable — ghosts expire.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Occupancy is not a second observe. Also the intended `ghost_court` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-thin-ward`

NAME: Thin Ward  
ROLE: DEFENSE — next incoming hit capped at 30  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via plate; false if via `hard_1`  
MINIMUM_ELIGIBILITY: Family `plate_warden`; `G ≥ 7`; `aiProfile` guardian/tank. **Or** complete challenge `hard_1` (`no_healing_under_30_damage`)  
ENEMY_FAMILIES: `plate_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥7. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: The next incoming **spell or Strike** that would deal damage to the caster this battle (or 2 turns) is capped at 30 **after** existing RES/SR, via the already-computed hit (`effectParams: {"capNextIncoming":true,"capNextIncomingValue":30}`). DoTs after the first tick are not the “next hit.” Does not rewrite `combatMath.ts`. Distinct from Turn Cap (outgoing 12), Bloodless Plate (`easy_1` no-heal identity), Surplus Ward (leftover-AP evade charges).  
SCALING: cap fixed  
AI_REQUIREMENTS: `aiHint: "cap_next_incoming"`. Cast when expecting a 3+ AP nuke. Skip if already capped.  
PLAYER_COUNTERPLAY: Two small hits; DoT; wait 2 turns; Quiet Hex  
SYNERGIES: `hard_1` identity (under 30) without cloning Bloodless Plate; Turn Cap is the **outgoing** sibling on this family at G6  
BALANCE_RISK: Capping Inferno at 30 deletes burst. One hit + CD 3 + G≥7. Do not also evade.  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `hard_1` complete. First MULTI child wins. Duplicate challenge callback grants nothing. No Doka from the grant. Challenge Doka still comes from the existing challenge writer.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-clean-blood`

NAME: Clean Blood  
ROLE: SUPPORT — ignore LoS if untouched last turn  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via glass; false if via `legendary_1`  
MINIMUM_ELIGIBILITY: Family `glass_sniper`; `G ≥ 7`; `aiProfile` kiter/caster. **Or** complete challenge `legendary_1` (`no_damage_taken`)  
ENEMY_FAMILIES: `glass_sniper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥7. `generationMin: 7`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If the caster took **0 damage** during the previous opposing turn (or, on round 1, this battle so far), their **next** spell this turn ignores LoS (`effectParams: {"ignoreLosIfUntouched":true}`). If they already took damage, fizzle. Distinct from Wounded Lens (ignore LoS **after being hit** — opposite gate), Corner Lens (+range if LoS blocked), Gate Sight (one barrier). `legendary_1` is the Untouchable **challenge door**, not this spell by itself.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "ignore_los_if_untouched"`. Skip if already damaged.  
PLAYER_COUNTERPLAY: Poke them for 1 before the snipe; Paper Wind; walk adjacent  
SYNERGIES: `legendary_1` identity (untouched) without cloning easy_3 / Bloodless Plate; Far Sting after the lens  
BALANCE_RISK: Full ignore-LoS on a glass kit is Wounded Lens without the wound. Untouched gate + fizzle if poked + CD 2.  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `legendary_1` complete. First MULTI child wins. Duplicate challenge callback grants nothing. No Doka from the grant.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-still`

NAME: Pack Still  
ROLE: SUPPORT — leftover-0 allies cannot be spell primary  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `tempo_precentor`; variant CHAMPION; `G ≥ 7`  
ENEMY_FAMILIES: `tempo_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 7`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 who start a turn with leftover AP **= 0** cannot be the **primary** target of an enemy spell (`effectParams: {"packZeroLeftoverVeil":true,"packZeroLeftoverRadius":2}`). Strike, ground, and AoE that does not use them as primary remain legal. Distinct from Pack Ledger (banks leftover), Pack Tempo (+1 AP), Aim Veil (unit flag). **Do not** put this on `hex_chorister` BASE with Pack Ledger — CHAMPION may have **one** pack aura. This family already has Split Purse at G6; this is the G7 SIGNATURE.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_zero_leftover_veil"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2 with leftover 0.  
PLAYER_COUNTERPLAY: Strike the veiled ally; spend their leftover first (Empty Purse bait); kill the Precentor  
SYNERGIES: Purse Lock so leftover stays 0; Split Purse is the opposite spend  
BALANCE_RISK: A leftover-0 veil is a second Aim Veil on the pack. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-file-fold`

NAME: File Fold  
ROLE: POSITION — fold two player-side bodies on a shared file/rank  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Proposed later extra kit `file_regent` / phase 2. Not a world pack. **Do not** restamp #474 `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector`, #463 `about_regent`, or #518 `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist`  
ENEMY_FAMILIES: none (boss id `file_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies that share a rank **or** file (not the same cell) and are both in range. If fewer than two, or they do not share an axis, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldSharedFilePlayerSide":true,"foldSharedFileDamage":6}`). Distinct from Court Fold (must be Chebyshev-adjacent), Sovereign Fold (any two), File Reel (attract along file), `WF-TEL-FILE_SLIDE` (world inlay). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_shared_file_player_side"`. **Boss AI only.** Skip if 0–1 player-side bodies or they do not share rank/file.  
PLAYER_COUNTERPLAY: Keep the summon off-axis; fight without a summon; Claim Ward does not block (unit swap)  
SYNERGIES: Twin Span on a file is the bait — folding the two posts + player is the lesson. Court Fold remains adjacency-only on `fold_regent`  
BALANCE_RISK: Forced axis swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 7 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…Wave-6 attachments. Do not put unique §11 ids in #405 CORE or #452 CORE.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `axis_locksmith` | RARE / G≥7 | `spell-even-stride` |
| `glyph_sower` | RARE / G≥7 | `spell-even-stride`; `spell-echo-paint` |
| `misstep_herald` | RARE / G≥7 | `spell-even-stride` (not with Bias Step + Misstep on the same BASE turn plan) |
| `plate_warden` | ADVANCED / G≥7 | `spell-strike-hold`; RARE `spell-thin-ward` (MULTI with `hard_1`) |
| `iron_golem` | ADVANCED / G≥7 | `spell-strike-hold`; RARE `spell-split-fang` |
| `null_censor` | ADVANCED / G≥7 | `spell-strike-hold`; ELITE `spell-still-leash` |
| `pit_mason` | RARE / G≥7 | `spell-ground-oath`; ADVANCED `spell-wall-bite` |
| `origin_mason` | RARE / G≥7 | `spell-ground-oath`; ADVANCED `spell-gift-sill` |
| `tide_shade` | ADVANCED / G≥7 | `spell-walk-toll` |
| `recoil_squire` | ADVANCED / G≥7 | `spell-walk-toll` |
| `gait_muter` | ADVANCED / G≥7 | `spell-walk-toll` (Stride Mute stays #411 CORE — this is the extra) |
| `tax_scribe` | RARE / G≥7 | `spell-purse-lock` |
| `ledger_siphon` | RARE / G≥7 | `spell-purse-lock` |
| `bone_scribe` | RARE / G≥7 | `spell-purse-lock` |
| `pale_cantor` | RARE / G≥7 | `spell-ally-reel` |
| `font_cantor` | RARE / G≥7 | `spell-ally-reel` |
| `cover_squire` | RARE / G≥7 | `spell-ally-reel` (Cover Step stays #411 CORE) |
| `ember_knight` | RARE / G≥7 | `spell-echo-paint` |
| `fuse_binder` | RARE / G≥7 | `spell-echo-paint`; `spell-cast-mark` |
| `void_anchoret` | RARE / G≥7 | `spell-blink-seal` |
| `mist_walker` | RARE / G≥7 | `spell-blink-seal` |
| `lintel_mason` | ADVANCED / G≥7 | `spell-gift-sill` (Low Lintel stays #411 CORE) |
| `glance_ward` | RARE / G≥7 | `spell-split-fang` (Glance Cut stays #411 CORE; facing writer still required for that CORE id) |
| `stone_castellan` | ADVANCED / G≥7 | `spell-wall-bite` |
| `hex_chorister` | RARE / G≥7 | `spell-cast-mark` (Pack Ledger SIGNATURE stays Wave 6; do **not** add Pack Still here) |
| `cadence_thief` | ELITE / G≥7 | `spell-pet-verse` (Cadence Break stays Wave 6 extra; Cadence Theft stays #411 CORE) |
| `blink_cutter` | ELITE / G≥7 | `spell-ghost-step` |
| `rift_hook` | ELITE / G≥7 | `spell-ghost-step` |
| `glass_sniper` | RARE / G≥7 | `spell-clean-blood` (MULTI with `legendary_1`; Bare Lens stays Wave 6 ELITE) |
| `tempo_precentor` | SIGNATURE / G≥7 | `spell-pack-still` (ENEMY_ONLY; CHAMPION; not with Pack Ledger / Pack Tempo / Pack Howl / Pack Cover on BASE) |

**#411 CORE (already #452 — observe only, do not duplicate CORE):** `oncoming_knight` / `pin_cantor` / `glance_ward` / `gait_muter` / `vault_chaplain` / `span_warder` / `span_prelate` / `cadence_thief` / `brand_plate` / `cover_squire` / `lintel_mason` / `act_teller` / `act_sexton`.

Empty slot → skip. Empty kit → `[physical_attack]`.

Do not pool #282 `spell-hex-toll`. Do not assign Face Away / Oncoming / Glance Cut until the battle facing writer exists. Do not assign Twin Span to a kit whose AI cannot walk two posts independently. Do not assign Ally Reel without an `applyAttract` cast caller. Do not assign Pack Still on `hex_chorister`.

---

## 13. How to add Generation 8 forever

Same recipe as Wave 6 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 8 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired.

Suggested Wave-8 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover doors `survivor` / `leader_slayer` / `jackpot` / `spell_master`; a same-day tactical Wave-7 catalog if one opens (stamp, do not clone). File Fold stays `BOSS_ONLY` on `file_regent` — do not also grant Thin Ward / Clean Blood from that fight, and do not restamp #518 extra doors (`gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist`).

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Wave-2 **before** Wave-3. Wave-3 **before** Wave-4. Wave-4 **before** Wave-6. Wave-6 **before** any Wave-7 data. Coordinate #411 / #463 / #480 so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W7-A. G≥7 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W7-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W7-C. Wave-7 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #411 / #463 / #480 / memory Wave-5 ids |
| W7-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `ENC-*` / `WF-*` as grants; retagging `WF-ELT-EVEN_PICKET` as `even_gallery` |
| W7-E. `hard_1` / `legendary_1` MULTI | Challenge complete → `unlockOwnedSpell` | Restamping Bloodless Plate / easy_3; pooling Hex Toll; `upgradeSpell` |
| W7-F. Ally Reel attract caller | `applyAttract` toward ally cell | Damage-math rewrite; RAF |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Cast Mark detonation, Ghost Step occupancy, and Pack Still veil read flags at wrap / walk / incoming-target time only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 6 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W7-1 | Encounter start | Possessed-but-unused G7 id does not observe |
| W7-2 | Even Stride odd walk | Confirm fails; MP not spent; Even Stride already observed |
| W7-3 | `even_gallery` defeat | Does not grant. Victory grants once (MULTI) |
| W7-4 | `WF-ELT-EVEN_PICKET` contact | Does not grant Even Stride |
| W7-5 | Strike Hold vs Oath Blade vs Dull Edge | Three ids; Strike illegal vs other-ids-fizzle vs Strike-deals-0 |
| W7-6 | Ground Oath then Strike | Strike legal; Frost fizzles if targeted at a unit |
| W7-7 | Walk Toll with MP 0 | Walk confirm fails; Walk Toll already observed |
| W7-8 | Purse Lock leftover 1 | No freeze value; still observes |
| W7-9 | Ally Reel no ally | Fizzle observes; no pull |
| W7-10 | Echo Paint with no paint | Fizzle observes |
| W7-11 | Blink Seal vs Claim Ward | Unit flag vs cell; walks still legal under Seal |
| W7-12 | Gift Sill Swap onto cell | No MP grant |
| W7-13 | Split Fang unclustered | 16 only |
| W7-14 | Wall Bite on open floor | 10 only |
| W7-15 | Cast Mark then Strike | No detonate |
| W7-16 | Still Leash on player | Fizzle; no lifespan write |
| W7-17 | Pet Verse vs Cadence Theft | Summon kit CD vs caster CD; both legal on `cadence_thief` at G≥7 |
| W7-18 | Ghost Step vs Twin Span | Vacated-cell ghost vs two posts |
| W7-19 | Thin Ward vs Turn Cap vs Bloodless Plate | Incoming 30 vs outgoing 12 vs `easy_1` no-heal. `hard_1` grants Thin Ward once |
| W7-20 | Clean Blood after 1 damage | Fizzle observes. `legendary_1` grants once. Wounded Lens still opposite gate |
| W7-21 | Pack Still / File Fold | Never in `ownedSpellIds` |
| W7-22 | Loaner / `WF-SPL-*` | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W7-23 | G=6 Tide | No Walk Toll (`generationMin: 7`) |
| W7-24 | Duplicate victory / duplicate `hard_1` | One owned row; levels untouched; no Doka from the grant |
| W7-25 | No cloned ids | Unique §11 ids absent from #411 / #463 / #480 catalogs |
| W7-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Walk Toll / Gift Sill are flags |
| W7-27 | Hex Toll | Still not in any SDE pool |
| W7-28 | Memory Wave-5 / Wave-6 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W7-29 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–6, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, or **#480** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1 except the two leftover challenge doors this wave owns
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 extra doors `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector`
- Restamping #518 extra doors `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist`
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence
- Stamping `survivor` / `leader_slayer` / `jackpot` / `spell_master`
- Retagging `WF-ELT-EVEN_PICKET` or `WF-TEL-FILE_SLIDE` as discovery grants
- New facing cards (still fail closed)

---

## 17. Wave-7 index

**Unique SDE ids (19):** even-stride, strike-hold, ground-oath, walk-toll, purse-lock, ally-reel, echo-paint, blink-seal, gift-sill, split-fang, wall-bite, cast-mark, still-leash, pet-verse, ghost-step, thin-ward, clean-blood, pack-still, file-fold.

**No same-day tactical stamps at audit.** If a Wave-7 tactical PR opens, stamp those ids in a follow-up; do not clone them here.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-even-stride` | MULTI_SOURCE | yes | locksmith G≥7 **or** `even_gallery` | Next walk even Manhattan |
| `spell-strike-hold` | ENEMY_DISCOVERY | yes | plate / golem | Cannot Strike until they walk |
| `spell-ground-oath` | ENEMY_DISCOVERY | yes | pit / origin mason | Next spell must target ground |
| `spell-walk-toll` | ENEMY_DISCOVERY | yes | tide / recoil | Next walk +1 MP |
| `spell-purse-lock` | ENEMY_DISCOVERY | yes | scribe / ledger | Leftover AP frozen |
| `spell-ally-reel` | ENEMY_DISCOVERY | yes | cantor / squire | Pull 1 toward nearest ally |
| `spell-echo-paint` | ENEMY_DISCOVERY | yes | ember / fuse | Copy last paint onto a neighbor |
| `spell-blink-seal` | ENEMY_DISCOVERY | yes | void / mist | Cannot Swap / blink / pad |
| `spell-gift-sill` | ENEMY_DISCOVERY | yes | origin / lintel | Enter cell +1 leftover MP |
| `spell-split-fang` | ENEMY_DISCOVERY | yes | glance / golem | 50/50 onto two clustered hostiles |
| `spell-wall-bite` | ENEMY_DISCOVERY | yes | castellan / pit | Bonus if adjacent to a blocking tile |
| `spell-cast-mark` | ENEMY_DISCOVERY | yes | hex / fuse | Mark detonates on cast |
| `spell-still-leash` | ELITE | yes | null_censor | Pause hostile summon lifespan |
| `spell-pet-verse` | ELITE | yes | cadence_thief | Steal 1 CD from a summon kit |
| `spell-ghost-step` | ELITE | yes | cutter / rift | Occupy the last cell left |
| `spell-thin-ward` | MULTI_SOURCE | yes | plate **or** `hard_1` | Next incoming hit capped at 30 |
| `spell-clean-blood` | MULTI_SOURCE | yes | glass **or** `legendary_1` | Ignore LoS if untouched last turn |
| `spell-pack-still` | ENEMY_ONLY | no | tempo_precentor CHAMPION | Pack leftover-0 veil |
| `spell-file-fold` | BOSS_ONLY | no | `file_regent` | Fold two player-side bodies on a shared file/rank |

All unique rows STATUS: **PROPOSED**.
