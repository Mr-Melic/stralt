# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 6

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-23  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp**. Wave 3 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md), PR #300) is Generation 3. Wave 4 (still-open #371) is Generation 4. This document does **not** replace any of those.

**GitHub SDE sequence vs memory Wave 5.** Waves 1–3 are on `main`. Wave 4 is still-open #371. Automation memories dated 2026-09-22 reserved a **Wave 5 unique catalog that never opened a pull request**. This document is **Generation 6** so those memory ids stay tombstoned. `generationMin: 6`. If an implementer never finds `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md`, they still must **not** reuse the Wave-5 memory ids in §0.1.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-23.md`](./ACTION_IDS_SDE_2026-09-23.md).

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
| Wave-1…4 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-21.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / #353 / #398 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | #342 | Gale Fan … Eclipse Fold |
| Tactical gap-fillers W5 | still-open #411 | Oncoming … Act Bell |
| Tactical gap-fillers W6 | **same-day #463** | Post Sting … About Face |
| Family sheets | #136 + #349 + #405 + same-day #452 | #452 Wave-6 families consume **#411** as CORE |
| Boss adaptations | #137 / #197 / #367 / #406 / same-day #474 | Extra doors claimed through Wave 7 (`mill_seneschal` … `levy_rector`) |
| PX coherence | #343 / #393 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-6 unique ids in §11 are new. #411 and #463 ids in §0.2 / §0.3 are **stamped**, not cloned.

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

**#463 tactical Wave 6 (same-day; never re-propose):** `spell-post-sting`, `spell-purse-cut`, `spell-blind-corner`, `spell-hinge-step`, `spell-file-reel`, `spell-twin-span`, `spell-oath-blade`, `spell-aim-veil`, `spell-cadence-break`, `spell-cadence-lend`, `spell-split-purse`, `spell-exit-tithe`, `spell-hinge-tile`, `spell-spark-whelp`, `spell-turn-cap`, `spell-about-face`.

**Do not alias** `spell-choir-verse` ↔ `spell-stolen-verse` / `spell-after-verse` / `spell-echo-cast` / `spell-false-echo` / `spell-false-gaze`, `spell-bias-step` ↔ `spell-misstep` / `spell-bias-ray`, `spell-wick-bite` ↔ `spell-pit-sight` / `spell-ash-sill` / `spell-cinder-tile`, `spell-empty-purse` ↔ `spell-purse-cut` / `spell-split-purse` / `spell-ap-sip`, `spell-crowd-tax` ↔ `spell-camp-tax` / `spell-exit-tithe` / `spell-glyph-tax`, `spell-pet-swap` ↔ `spell-pawn-trade` / `spell-twin-guard` / `spell-convert-whelp`, `spell-corner-lens` ↔ `spell-blind-corner` / `spell-wounded-lens` / `spell-gate-sight`, `spell-face-away` ↔ `spell-about-face` / `spell-facing-pin` / `spell-turn-sill`, `spell-dull-edge` ↔ `spell-oath-blade` / `spell-mute-thread` / `spell-hex-of-silence`, `spell-pet-sill` ↔ `spell-keep-kennel` / `spell-cull-kennel` / `spell-open-pit`, `spell-late-purse` ↔ `spell-empty-purse` / `spell-act-tax`, `spell-pet-share` ↔ `spell-load-bearing` / `spell-cover-step` / `spell-pain-link`, `spell-short-leash` ↔ `spell-keep-kennel` / `spell-sever-tether`, `spell-axis-veil` ↔ `spell-aim-veil` / `spell-ward-cell` / `spell-rank-lock`, `spell-safe-fall` ↔ `spell-soft-step` / `spell-self-anchor`, `spell-bare-lens` ↔ `spell-last-stride` / `spell-rooted-sight` / `spell-split-pace`, `spell-gap-ward` ↔ `spell-safe-fall` / `spell-sidestep-ward` / `spell-mist-step` / `spell-soft-step`, `spell-pack-ledger` ↔ `spell-pack-tempo` / `spell-pack-cover` / `spell-pack-howl`, `spell-court-fold` ↔ `spell-sovereign-fold` / `spell-twin-span` / `spell-void-span` / `spell-eclipse-fold`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Same-day #463 hole ownership (stamp, do not clone)

#463 shipped two Wave-5-deferred engine verbs plus fourteen siblings. This document does **not** re-author them. Discovery attaches family / observe metadata only:

| Hole | #463 id | SDE Wave-6 stamp |
| :--- | :--- | :--- |
| Caster-unmoved damage | `spell-post-sting` | `iron_golem` / `stone_castellan` G≥6 observe+win |
| Leftover-AP **target** bonus | `spell-purse-cut` | `tax_scribe` / `ledger_siphon` G≥6 observe+win |
| LoS-blocked poke | `spell-blind-corner` | `glass_sniper` / `smoke_thurifer` G≥6 observe+win |
| 90° rotate around ally | `spell-hinge-step` | `pale_cantor` / `vault_chaplain` observe+win. #463 MULTI — **do not restamp** `hinge_porter` |
| Attract 1 along shared file | `spell-file-reel` | `storm_caller` / `coil_arbiter` G≥6 observe+win |
| Independently walking two-cell occupy | `spell-twin-span` | `span_warder` ELITE observe+win. Distinct from Span Guard (rigid pair). `summonAI: "twinspan"` |
| Strike-only brand | `spell-oath-blade` | #463 BOSS. SDE adds **no** extra door. Do not restamp `oath_censor` |
| Cannot be primary spell target | `spell-aim-veil` | `void_anchoret` / `mist_walker` G≥6 observe+win |
| Cooldown **reset to 0** | `spell-cadence-break` | `cadence_thief` G≥6 observe+win. Cadence Theft still only steals 1 |
| Ally cooldown −1 | `spell-cadence-lend` | `font_cantor` / `pale_cantor` G≥6 observe+win |
| Share 1 leftover AP | `spell-split-purse` | `hex_chorister` / `tempo_precentor` G≥6 observe+win |
| Walk-exit AP tax | `spell-exit-tithe` | `glyph_sower` / `origin_mason` observe+win. #463 MULTI — **do not restamp** `exit_mason` |
| Enter-swap with painter | `spell-hinge-tile` | `rift_hook` / `twin_porter` G≥6 observe+win |
| Death grants owner +1 AP | `spell-spark-whelp` | `brood_chanter` ELITE observe+win. `summonAI: "spark"` |
| Next hit capped at 12 | `spell-turn-cap` | `plate_warden` / `iron_golem` G≥6 observe+win |
| Invert all player-side facing | `spell-about-face` | `NOT_PLAYER_LEARNABLE`. `pin_cantor` CHAMPION may cast. **Never** `ownedSpellIds`. Do not restamp `about_regent` |

### 0.3 Late #411 stamps (SDE Wave 5 never opened a PR)

#452 Wave-6 families already consume #411 as **CORE identity**. This document does **not** clone those cards. Discovery only records observe+win on those families. Grant doors stay with #411:

| #411 id | Family observe (this wave) | Grant door (do not restamp) |
| :--- | :--- | :--- |
| `spell-oncoming` | `oncoming_knight` | observe+win only. **Fail closed** until battle `currentView` writer |
| `spell-facing-pin` | `pin_cantor` | observe+win. Same facing prerequisite |
| `spell-glance-cut` | `glance_ward` | observe+win. Same facing prerequisite |
| `spell-stride-mute` | `gait_muter` | observe+win |
| `spell-file-vault` | `vault_chaplain` | MULTI child; #411 already `enthroned_void` — first child wins |
| `spell-span-guard` | `span_warder` | observe+win. Not Twin Span |
| `spell-span-pylon` | `span_prelate` | ELITE observe+win. File Vault grant stays #411 |
| `spell-cadence-theft` | `cadence_thief` | observe+win. Not Cadence Break |
| `spell-cadence-brand` | `brand_plate` | ELITE observe+win |
| `spell-cover-step` | `cover_squire` | observe+win |
| `spell-low-lintel` | `lintel_mason` | observe+win |
| `spell-act-tax` | `act_teller` | observe+win |
| `spell-act-bell` | `act_sexton` | observe+win. End-of-turn hook, not RAF, not Wave-4 wrap |
| `spell-mute-thread` | none (BOSS) | `weeping_pawn` first-win |
| `spell-queue-cut` | none (BOSS) | `eternal_pawn_king` first-win |
| `spell-false-cut` | none | `NOT_PLAYER_LEARNABLE` |

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-one days of merges (`58302bc` → `0f5363f`, through #332) plus the 2026-09-21 / 2026-09-22 open-PR stacks did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. WX is **19,213** lines (`wc -l`). #411 quoted 18,749 — wrong at this HEAD. The defects did not shrink.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2408 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`main.mo` 134–142) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | Feats cannot grant a spell id |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | Challenges cannot grant a spell id |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | WX 11920; zone object at 4683–4687 | `Math.floor(levelZone)` is `NaN`; every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids. Twin Span / Spark / pet-swap must be enums |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-6 unique ids stay `mpCost: 0` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | File Reel (#463) is the first attract-along-axis caller. Pet Swap uses `swapPositions` |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face **fail closed** until a battle writer exists |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| Open PR queue | #327, #331, then #333+ (docs/fixes). Same-day #447+. **#371 owns Wave-4 SDE. #411 owns Wave-5 tactical. #463 owns Wave-6 tactical. #452 owns Wave-6 families. #474 owns Wave-7 extra doors.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0, Wave-2 P0, Wave-3 P0, and Wave-4 P0 remain the prerequisite. **Do not land Wave-6 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 6 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥6 rares make it sharper: a CHAMPION may hold the generation-6 verb until leftover AP is already committed.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 6 fills holes Waves 1–4, memory Wave 5, #120, #185, #282, #342, #411, and **#463** left open (see §10). It does not clone Shield, Quiet Hex, Stolen Verse, Purse Cut, Span Guard, Cadence Theft, Aim Veil, or About Face.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 6 stamps `generationMin: 6`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Last Stride (memory Wave 5) is a walk MP **waiver**, not `spell.mpCost` — do not clone it.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Facing cards fail closed** until battle walks write `currentView`. Forced-move does not write facing.

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

Wave-6 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| Choir Verse **cast** (AP spent), copy fizzles (no ally last-resolved / denylist) | **Yes** — the technique was used |
| The **copied** ally id resolving | **No** — that id observes only if a hostile later casts **that** id |
| Empty Purse spends leftover AP as part of the hit | **Yes** on the cast; leftover ticking without a cast does not |
| Face Away / About Face **cast** | **Yes** if AP was spent. Missing `currentView` AI skip (no AP) is **No** |
| Pet Swap landing on lava/spikes | One observe; hazard is environmental, not a second observe |
| Twin Span (#463) **summon** | **Yes** on the cast; later independent walks do not second-observe |
| Gap Ward **arm** | **Yes** on the cast. The skipped overwatch snap is not a second observe |
| Cadence Break (#463) **reset** | **Yes** on the reset; a later recast of the freed id is that id’s observe |
| Pack Ledger aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| Court Fold | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Loaner orb pickup | **No** |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 6 stamps unused **family** attachments and one special MULTI. It does **not** add enum members.

| Source | Wave-6 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥6 family verbs in §11 **plus** #411 / #463 stamps in §0.2–§0.3 |
| `ELITE` | Pet Share, Short Leash, Bare Lens |
| `ACHIEVEMENT` | **none** — all 15 feat doors claimed |
| `CHALLENGE` | **none** — all nine challenge doors claimed |
| `BOSS` | **none** — live-19 first-wins and extra doors through #406 stay claimed. Court Fold is `BOSS_ONLY` |
| `SPECIAL_ENCOUNTER` | Choir Verse ← `choir_gallery` (MULTI child; observation not required for that child) |
| `MULTI_SOURCE` | Choir Verse ← hex/cantor observe+win **or** `choir_gallery`. First child wins. Hinge Step / Exit Tithe / File Vault MULTI children stay with #463 / #411 |
| `ENEMY_ONLY` | Pack Ledger (never owned) |
| `BOSS_ONLY` | Court Fold (never owned) |
| `SYSTEM_ONLY` | unchanged innate four |

Do **not** gate a Wave-6 spell on `unstoppable` / `level_10`. That feat is a milestone, not a last tier.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

Every live feat and challenge from Waves 1–4, #120 / #185 / #282 / #342 / #411, plus boss extra doors:

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
| `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` | #474 Wave-7 extra doors (Slide Tile / Pawn Trade / Fan Bolt / Hex Toll) — do not restamp. Court Fold uses `fold_regent`, not these four |

Economy feats stay Doka-only until a designer needs a non-damage identity. `unstoppable` stays unused forever as a spell gate. `survivor` / `leader_slayer` / `jackpot` / `spell_master` / `hard_1` / `legendary_1` remain leftover **only** for a later designer who needs those identities — **not this pass**.

---

## 5. Spell pool evolution — Generation 6 (never a last tier)

Wave 1 §6 five pools and later generation stamps stay. Wave 6 adds the **G≥6 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, 3, 4, 5, 6, … no maximum
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
| 7+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or later G verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **6** for families listed in §12. It remains a data query, not a constant in combat math.

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
  9. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  10. drop any id whose AI_REQUIREMENTS are unmet
  11. keep ENEMY_ONLY on enemies (they cast; they never grant)
  12. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at WX 11920).

Do **not** put unique §11 ids in #405 CORE or #452 CORE. Those families already consume #342 / #411 identities.

---

## 6. New `aiHint` keys (metadata, not names)

Prior-wave hints still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `copy_ally_last_id` | buffer, caster | Living ally resolved a legal, non-denylisted id this battle; skip if none |
| `force_next_walk_diagonal` | caster, controller | Target likely to walk; skip if already rooted or MP = 0 |
| `bonus_if_target_on_hazard` | caster, kiter | Target cell has a painted hazard (`cinder` / `rime` / `mire` / `void`); skip if floor |
| `spend_leftover_ap_for_damage` | caster, berserker | Caster leftover AP ≥ 2 at decide time **and** a legal target; skip if leftover ≤ 1 |
| `tax_walk_through_me` | guardian, charger | Player path crosses Chebyshev 1; skip if they are already adjacent and will Strike |
| `swap_own_summon` | summoner, controller | Living allied summon; landing cell free or is the summon’s cell; skip if none |
| `range_if_los_blocked` | kiter, caster | Bresenham to the intended target is blocked; skip if LoS already clear |
| `invert_one_current_view` | caster, controller | Battle `currentView` writer exists **and** target has a stored view; skip otherwise |
| `zero_next_strike` | caster, controller | Target’s likely next action is Strike; skip if they have a 3+ AP spell in kit |
| `forbid_summon_enter_cell` | summoner, controller, guardian | A hostile summon exists **or** the player just summoned; paint the cell they must enter |
| `burn_leftover_ap_at_turn_end` | caster, controller | Target leftover AP ≥ 2; skip if 0–1 |
| `share_to_living_summon` | summoner, guardian | Living allied summon within 3; skip if none |
| `cut_hostile_summon_lifespan` | caster, controller | Hostile summon remaining lifespan ≥ 2; skip if none |
| `forbid_axis_primary` | caster, controller | Target shares rank or file; skip if off-axis |
| `skip_next_hazard_landing` | kiter, flanker | Caster is about to be pushed/pulled onto a hazard **or** intends Recoil / File Reel; skip on safe floor |
| `range_if_zero_leftover_ap` | kiter, caster | Caster leftover AP = 0 at decide; skip if leftover ≥ 1 |
| `skip_next_overwatch_walk` | flanker, kiter | A visible overwatch / crowd-tax / far-watch is on a 1-step path; skip if already adjacent |
| `pack_leftover_aura` | buffer | CHAMPION only; skip if aura up or no ally in 2 |
| `fold_adjacent_player_side` | **boss AI only** | Two living player-side bodies Chebyshev ≤ 1 from each other; skip if 0–1 |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

#411 / #463 hints (`prefer_facing_bonus`, `lock_current_view`, `hit_facing_cell`, `walk_then_fizzle`, `ally_teleport_3_4`, `occupy_two_cells_self`, `summon_two_cell_pylon`, `steal_one_cooldown`, `reset_own_cooldown_to_zero`, `attract_along_shared_axis`, …) stay on those catalogs. Do not re-author them.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: `pendingAchievementToast` at `WorldExploration.tsx` 2173 / 17949. **Do not grow WX.**
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Choir Verse may add a **battle-log line** when the copy resolves (`CHOIR VERSE echoes {id}`) — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.
- Leftover-AP spend, facing invert, and Twin Span walks are **not** a second cue.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 6 adds **no** new canister methods.

| Writer | Wave-6 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | `choir_gallery` MULTI child only (victory, no observation). **No** feat/challenge/boss stamps this wave |

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
- Pet Swap / Hinge Step landings use existing hazard helpers. This card picks **environmental** for the landing tile.
- Loaner orbs never write `ownedSpellIds`.
- `spell-pack-ledger` / `spell-court-fold` / `spell-about-face` never write `ownedSpellIds`.

---

## 9. Special encounters (Wave 6)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is `unlockOwnedSpell` / observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms. **Do not** reuse encounter-catalog `ENC-*` ids as spell tags.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `choir_gallery` | Hex Chorister + Pale Cantor; chorister holds a last-resolved ally Slow so Choir Verse is legal by turn 2 | `spell-choir-verse` on **victory** (no observation — `SPECIAL_ENCOUNTER` MULTI child) **or** observe+win if the id is used |
| `wick_gallery` | Ember Knight on an existing cinder/rime cell; AI prefers Wick Bite if the player stands on the paint | `spell-wick-bite` via observe+win |
| `purse_nave` | Tax Scribe + pawn; scribe starts leftover AP ≥ 2 | `spell-empty-purse` via observe+win |
| `pet_sill_hall` | Brood Chanter + one whelp; AI prefers Pet Sill on the cell the player pet must enter | `spell-pet-sill` via observe+win |
| `dull_court` | Null Censor on a choke; AI prefers Dull Edge when the player is adjacent | `spell-dull-edge` via observe+win |

Prior specials (`echo_dummies`, `rime_gallery`, `still_court`, `mist_gallery`, `undertow_channel`, `ember_fan`, `rift_twins`, `long_gallery`, `gate_gallery`, `triune_gallery`, `haze_gallery`, `stolen_pulpit`, `nail_court`, `pit_gallery`, and memory Wave-5 `gaze_gallery` / `span_court` / `lintel_hall` / `cadence_nave` / `soft_gallery`) are not re-specified.

Twin Span occupancy is not `map.portals` and not Twin/Triune pads. `WF-SPL-ECHO_SCRIBE` / loaner orbs never write `ownedSpellIds`.

---

## 10. Balance doctrine — holes this wave fills

Prior waves + tactical catalogs already cover: push, pull, blink, root, range buff **and** cut, absorb, redirect, cleanse, burn tile, trap, AP zone, turret, pet, bounce, next-spell AP tax, cone, two-body swaps, portal-pair, evade, leftover-AP evade, distance poke, MP/AP steal, pit, heal totem, walk-brand, conveyor, axis lock, mass shove, delayed blink, pincer, diagonal poke, pair attract, ally shove, origin-cast tax, intercept pylon, HP+MP hybrid, facing bonus/lock/front-cell, next-spell silence, walk-then-fizzle, end-of-turn insert, ally teleport 3–4, rigid two-cell occupy, stationary 2-cell pylon, cooldown steal, attacker +1 CD, hit redirect to ally, HP%-gated walk, act-sooner tax, delayed-on-act, caster-unmoved poke, leftover-AP **target** bonus, LoS-blocked poke, 90° hinge, file-axis attract, walking two-cell occupy, Strike-only brand, primary-target veil, self CD reset to 0, ally CD −1, leftover-AP share, walk-exit AP tax, enter-swap tile, spark whelp, hit cap 12, mass facing invert.

**Still open (Wave 6 SDE unique ids).** The two deferred engine holes #463 filled (walking two-cell, CD reset-to-0). The four #463 **held** (mid-RAF, fourth `mpCost`, fifth echo, player-owned Hex of Silence): this wave fills **only** the fifth echo, as a **ally-last** copy. The other three stay held.

| Hole | Wave-6 id | Why it is not a clone |
| :--- | :--- | :--- |
| Copy last **ally** id | `spell-choir-verse` | Stolen Verse copies a **hostile**. After Verse copies **yours**. Echo Cast primes **your next**. False Echo copies the player at wrap. #463 left a fifth echo for Discovery |
| Force next walk **diagonal** | `spell-bias-step` | Misstep forces **cardinal**. Rank Lock locks **axis**. Bias Ray is a diagonal **poke** |
| Bonus if target stands on **paint** | `spell-wick-bite` | Pit Sight is pit **on the Bresenham**. Cinder Tile **is** the paint. Camp Tax is unmoved |
| Caster leftover AP → this hit | `spell-empty-purse` | Purse Cut bonuses **their** leftover. Split Purse **moves** 1 leftover. AP Sip is zero-sum current AP |
| Walk **through me** costs AP | `spell-crowd-tax` | Exit Tithe taxes **leaving a painted cell**. Glyph Tax is an AP **zone**. Camp Tax is unmoved damage |
| Swap with **own summon** | `spell-pet-swap` | Pawn Trade is two hostiles-to-caster. Twin Guard is two allies including non-summons. Convert Whelp **steals** |
| +range if LoS is **blocked** | `spell-corner-lens` | Blind Corner is **damage**. Wounded Lens ignores LoS **after being hit**. Gate Sight ignores one **barrier** |
| Invert **one** stored view | `spell-face-away` | About Face inverts **all** player-side views (`NOT_PLAYER_LEARNABLE`). Facing Pin **locks**. Glance Cut **hits** the front cell |
| Next Strike deals **0** | `spell-dull-edge` | Oath Blade makes **other ids** fizzle (Strike still hurts). Mute Thread fizzles the **next spell**. Hex of Silence is full-bar `BOSS_ONLY` |
| Cell forbids **summon enter** | `spell-pet-sill` | Open Pit blocks **all** walks. Claim Ward blocks swap/blink. Kennel Lock leashes **allied** pets |
| Leftover AP burns at **their turn end** | `spell-late-purse` | Empty Purse spends **now**. Act Tax is +1 AP if they act sooner. Drain Courage is immediate −1 |
| Share incoming to a **summon** | `spell-pet-share` | Load Bearing shares to any adjacent **ally**. Cover Step redirects the **next hit**. Pain Link redirects to a hostile |
| Cut hostile summon **lifespan** | `spell-short-leash` | Keep Kennel **adds** allied lifespan. Sever Tether **kills**. Convert Whelp **steals** at 25% |
| Shared rank/file cannot be **spell primary** | `spell-axis-veil` | Aim Veil is a **unit** flag. Ward Cell fizzles targeted **cells**. Rank Lock locks **walk** axis |
| Next forced-move skips **hazard landing** | `spell-safe-fall` | Self Anchor ignores push/pull entirely. Nail Down cannot walk **and** ignores displace. Soft Step is a memory Wave-5 id |
| Leftover AP = 0 → next spell +1 range | `spell-bare-lens` | Rooted Sight is +range if you **didn’t walk**. Split Pace is +range after a **long walk**. Last Stride is a walk-MP **waiver** (memory Wave 5) |
| Next 1-tile walk skips overwatch | `spell-gap-ward` | Safe Fall skips **forced-move hazard**. Sidestep Ward evades a **spell**. Crowd Tax / Hold Ground / Far Watch still exist — this walk does not trip them |
| Pack leftover-AP aura | `spell-pack-ledger` | Pack Tempo is +1 **max/start** AP. Pack Howl is CHC. Never owned |
| Fold two **adjacent** player-side bodies | `spell-court-fold` | Sovereign Fold swaps any two player-side. Twin Span is two posts. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**Held, not filled:** mid-RAF splice of the current actor; a fourth `mpCost > 0` walk snipe; player-owned Hex of Silence (full bar lock).

---

## 11. Proposed spells (Wave 6)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–4, memory Wave 5, #120, #137, #185, #282, #342, #411, or **#463**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row.

### 11.1 New `effectParams` keys (Wave 6 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables.

```text
copyAllyLastId, copyDenyIds,
nextWalkMustDiagonal,
wickHazardTypes, wickBonusDamage,
spendLeftoverAp, leftoverApDamage,
crowdRadius, crowdWalkApTax,
swapOwnSummon,
cornerLosRangeDelta, cornerLosDuration,
invertOneCurrentView,
nextStrikeDamageZero, nextStrikeDuration,
forbidSummonEnter, forbidSummonDuration,
leftoverApEndTax, leftoverApEndMin,
shareIncomingToSummonPct, shareSummonDuration,
cutHostileSummonLifespanTo,
axisForbidPrimary, axisForbidDuration,
skipNextHazardLanding,
bareLensIfZeroAp, bareLensRangeDelta,
skipNextOverwatchWalk, skipWalkTiles,
packLeftoverAura, packLeftoverRadius,
foldAdjacentPlayerSide, foldAdjacentDamage
```

Reuse from earlier waves where the meaning is identical: Crowd Tax reuses `overwatchDuration` for stance length (same unit as Hold Ground / Far Watch). Do not invent a second duration key.

Facing cards (`spell-face-away` and #411 stamps) **fail closed** until a battle `currentView` writer exists.

---

### SPELL_ID: `spell-choir-verse`

NAME: Choir Verse  
ROLE: SUPPORT — copy last ally id  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true if learned via hex/cantor; false if via `choir_gallery`  
MINIMUM_ELIGIBILITY: Families `hex_chorister` or `pale_cantor` or `verse_scribe`; `G ≥ 6`; `aiProfile` buffer/caster. **Or** victory on `choir_gallery`  
ENEMY_FAMILIES: `hex_chorister`, `pale_cantor`, `verse_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥6. `generationMin: 6`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Resolve a copy of the last **allied** (same side, not self) spell id that spent AP this battle, using this caster’s current tile / legal targeting. Denylist: `spell-choir-verse`, `spell-stolen-verse`, `spell-after-verse`, `spell-echo-cast`, `spell-false-echo`, `spell-false-gaze`, `spell-timestep`, `spell-hex-of-silence`, any `ENEMY_ONLY` / `BOSS_ONLY` id (`effectParams: {"copyAllyLastId":true,"copyDenyIds":["spell-choir-verse","spell-stolen-verse","spell-after-verse","spell-echo-cast","spell-false-echo","spell-false-gaze","spell-timestep","spell-hex-of-silence"]}`). If none or denylisted, fizzle (AP spent). Distinct from Stolen Verse (hostile last) and After Verse (your last).  
SCALING: copied payload follows that id’s table  
AI_REQUIREMENTS: `aiHint: "copy_ally_last_id"`. Buffer / caster. Skip if no ally last-resolved or denylist would fizzle. **Do not** assign until a last-resolved **per-side** pipeline exists.  
PLAYER_COUNTERPLAY: Kill the ally before they cast; Quiet Hex the copy; stand where the copy cannot legally target  
SYNERGIES: Loan Tempo (ally spends a 4-AP tool, then Choir copies it); Cadence Lend  
BALANCE_RISK: Copying Inferno is the nightmare. 3 AP / CD 3 / ally required / denylist. Do not also copy Timestep.  
PERSISTENCE_REQUIREMENTS: Observe+win **or** `choir_gallery` victory. First MULTI child wins. The copied id is **not** granted. No Doka.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bias-step`

NAME: Bias Step  
ROLE: CONTROL — next walk must be diagonal  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower`, `axis_locksmith`, or `misstep_herald`; `G ≥ 6`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `axis_locksmith`, `misstep_herald`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Target’s **next walk of ≥ 1 tile** this battle (or 2 turns) must land on a diagonal step (`|dx|===|dy|===1` per tile). Cardinal steps fizzle that step (MP may still debit if they attempted a walk — implementers: debit only on a **legal** diagonal; illegal cardinal is a failed confirm, not a tax). Teleport / Swap / Phase Slip / pad transit do **not** pay (`effectParams: {"nextWalkMustDiagonal":true}`). Distinct from Misstep (cardinal), Rank Lock (axis), Root (cannot walk).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "force_next_walk_diagonal"`. Skip if rooted or MP = 0. **Do not** put on the same BASE kit as Misstep.  
PLAYER_COUNTERPLAY: Blink; Strike in place; walk the diagonal they wanted  
SYNERGIES: File Lance after they cannot stay on the file; Crowd Tax on the remaining diagonal  
BALANCE_RISK: Diagonal + Misstep is a hard brick. Different families; ELITE may own both only if AI never casts them the same turn.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wick-bite`

NAME: Wick Bite  
ROLE: DAMAGE — bonus on painted hazard  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `ember_knight`, `cinder_martyr`, or `fuse_binder`; `G ≥ 6`; `aiProfile` caster/charger  
ENEMY_FAMILIES: `ember_knight`, `cinder_martyr`, `fuse_binder`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target’s cell currently has a painted hazard of type `cinder`, `rime`, `mire`, or `void`, deal an extra 10 as a **second** existing `dealDamage` call (`effectParams: {"wickHazardTypes":["cinder","rime","mire","void"],"wickBonusDamage":10}`). Open Pit / Barrier / world lava are **not** paint. Distinct from Pit Sight (pit on ray) and Cinder Tile (the paint itself).  
SCALING: both numbers follow dmg%; type list fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_on_hazard"`. Skip if the cell is floor and Strike is better.  
PLAYER_COUNTERPLAY: Step off the paint; Barrier replaces last writer; don’t stand on your own cinder  
SYNERGIES: Cinder Tile / Rime Sheet / Mire Sheet / Void Glyph as the paint; File Reel onto the paint  
BALANCE_RISK: 20 on a 2-AP CD 1 is Frost-adjacent. Paint gate + G≥6. Do not also apply Ignite Stacks detonate in the same kit turn at BASE.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Also the intended `wick_gallery` teach.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-empty-purse`

NAME: Empty Purse  
ROLE: DAMAGE — spend leftover AP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `bone_scribe`, `tax_scribe`, or `ledger_siphon`; `G ≥ 6`; `aiProfile` caster  
ENEMY_FAMILIES: `bone_scribe`, `tax_scribe`, `ledger_siphon`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥6. `generationMin: 6`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Deal 8. If the caster has leftover AP ≥ 2 **at resolve** (after paying this 2 AP), spend 1 leftover AP and deal +8 (`effectParams: {"spendLeftoverAp":1,"leftoverApDamage":8}`). If leftover is under 2 after the cost, 8 only (not a fizzle). Distinct from Purse Cut (reads **target** leftover), Split Purse (moves leftover), AP Sip (steals current AP). Does not write persisted `CharacterStats.ap`. Counts toward `hard_3` `maxApUsedInTurn` on the **spender**.  
SCALING: both damages follow dmg%; spend fixed  
AI_REQUIREMENTS: `aiHint: "spend_leftover_ap_for_damage"`. Skip if leftover after cost would be under 2 **and** Frost is better.  
PLAYER_COUNTERPLAY: Drain Courage first; Quiet Hex so they cannot afford the 2; Act Tax so leftover is already gone  
SYNERGIES: `purse_nave`; Loan Tempo (borrowed AP is leftover)  
BALANCE_RISK: 16 on a 2+1 AP spend is fair if leftover was going to waste. G≥6 + CD 2. Do not also grant MP.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-crowd-tax`

NAME: Crowd Tax  
ROLE: CONTROL — walk through me costs AP  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `leash_warden` or `iron_golem`; `G ≥ 6`; `aiProfile` guardian  
ENEMY_FAMILIES: `leash_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥6. `generationMin: 6`  
RARITY: UNCOMMON  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into or through Chebyshev 1 of the caster also pays +1 AP for that walk (`effectParams: {"crowdRadius":1,"crowdWalkApTax":1,"overwatchDuration":2}`). Push/pull / teleport / Swap do **not** pay. Distinct from Exit Tithe (leaving a **painted** cell), Glyph Tax (tile zone), Hold Ground (damage + stop). Observation is the **arm**.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_walk_through_me"`. Guardian / charger. Skip if the player is already adjacent and will Strike.  
PLAYER_COUNTERPLAY: Stay at 2; blink in; send a summon through first  
SYNERGIES: Taunt Oath (force the walk); Hold Ground (damage + tax)  
BALANCE_RISK: Tax + Hold Ground + Nail Down is a choke kit. Consume-on-first-body, CD 3, G≥6.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pet-swap`

NAME: Pet Swap  
ROLE: POSITION — swap with own summon  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `brood_chanter` or `rift_hook`; `G ≥ 6`; `aiProfile` summoner/controller; a living allied summon exists  
ENEMY_FAMILIES: `brood_chanter`, `rift_hook`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: Legal only if the target is a living **allied** summon (`isSummon === true`, same side). Swap caster and that summon (`effectParams: {"swapOwnSummon":true}`). Not `isSwap` vs an enemy. Occupancy / void / portal: fizzle. Distinct from Pawn Trade, Twin Guard, Convert Whelp, Ward Interpose.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "swap_own_summon"`. Summoner / controller. Skip if no allied summon. Do not assign until `summonAI` is explicit (name-fallback still live — **drop this id** if empty).  
PLAYER_COUNTERPLAY: Kill the pet first; Claim Ward the landing; Grounded Lock the caster  
SYNERGIES: Spark Whelp (swap then detonate); Cover Step on the pet  
BALANCE_RISK: Instant 4-tile relocate. Ally-summon gate + CD 2. Player copy can strand a wolf on lava — landing is environmental.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Blocked swap still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-corner-lens`

NAME: Corner Lens  
ROLE: SUPPORT — +range if LoS blocked  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glass_sniper` or `pit_mason`; `G ≥ 6`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `pit_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥6. `generationMin: 6`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If **at resolve** a Bresenham from the caster to the highest-threat hostile is blocked by wall/barrier, `modifiableRange` spells get `rangeDelta: +1` for 1 turn (`effectParams: {"cornerLosRangeDelta":1,"cornerLosDuration":1}`). If LoS is already clear, fizzle (AP spent). Last rangeDelta writer wins vs Lens / Overcast / Paper Wind / Split Pace / Bare Lens. Distinct from Blind Corner (damage), Wounded Lens (after being hit), Gate Sight (ignore one barrier).  
SCALING: delta fixed  
AI_REQUIREMENTS: `aiHint: "range_if_los_blocked"`. Kiter / caster. Skip if LoS is already clear (use Glass Shot).  
PLAYER_COUNTERPLAY: Break the cover; Paper Wind overwrite; walk adjacent  
SYNERGIES: Blind Corner the same turn after the lens; Haze Pane to **create** the block  
BALANCE_RISK: +1 through cover is Lens-lite. Block gate + 2 AP + CD 2. Does not ignore walls.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-face-away`

NAME: Face Away  
ROLE: CONTROL — invert one stored view  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `pin_cantor` or `oncoming_knight`; `G ≥ 6`; `aiProfile` caster/controller; **battle `currentView` writer exists**  
ENEMY_FAMILIES: `pin_cantor`, `oncoming_knight`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Invert the target’s stored `currentView` (`front↔back`, `left↔right`). No damage (`effectParams: {"invertOneCurrentView":true}`). If the field is missing, fizzle (AP spent **only if the writer exists and the cast was confirmed**; AI skip if no writer). Forced-move still does not write facing. Distinct from About Face (all player-side, never owned), Facing Pin (lock), Glance Cut (hit the front cell), Rear Cut (walk-vector).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "invert_one_current_view"`. **Fail closed** until battle walks write `currentView` (WX 6928–6931 map). Skip if the field is missing. Do not read pixels.  
PLAYER_COUNTERPLAY: Walk once to rewrite facing; Facing Pin after; fight without facing cards  
SYNERGIES: Oncoming (invert then 22); Glance Cut on the new front  
BALANCE_RISK: Invert + Oncoming is a 22 package. 2 AP / CD 2 / one body / writer prerequisite.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. AI skip with no writer does **not** observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-dull-edge`

NAME: Dull Edge  
ROLE: CONTROL — next Strike deals 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `null_censor` or `hex_chorister`; `G ≥ 6`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `null_censor`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. Target’s next `spell.id === "physical_attack"` this battle (or 2 turns) deals 0 after RES (`effectParams: {"nextStrikeDamageZero":true,"nextStrikeDuration":2}`). Other ids resolve normally. Never `spell.name`. Distinct from Oath Blade (other ids fizzle, Strike still hurts), Mute Thread (next **spell** fizzles), Hex of Silence (full bar, `BOSS_ONLY`).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "zero_next_strike"`. Skip if the target’s likely next action is a 3+ AP spell.  
PLAYER_COUNTERPLAY: Cast Frost / Slow instead; wait 2 turns; Oath Blade is the opposite problem  
SYNERGIES: `dull_court`; Aim Veil (they cannot spell-aim you **and** Strike is 0)  
BALANCE_RISK: Zeroing Strike vs a melee kit is a stall. 3 AP / CD 3 / 2-turn window. Do not also Mute Thread from a world pack.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pet-sill`

NAME: Pet Sill  
ROLE: TERRAIN — summons cannot enter  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `glyph_sower` or `brood_chanter`; `G ≥ 6`; `aiProfile` controller/summoner  
ENEMY_FAMILIES: `glyph_sower`, `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor tile 2 turns. **Summons** (`isSummon === true`) cannot **walk** onto that cell. Non-summons walk freely. Teleport / Swap onto the cell: summons fizzle the landing; non-summons OK (`effectParams: {"forbidSummonEnter":true,"forbidSummonDuration":2}`). Distinct from Open Pit (all walks), Claim Ward (swap/blink for everyone), Kennel Lock (leash allied). Last writer on `"x,y"` vs Cinder / void / rime.  
SCALING: duration fixed  
AI_REQUIREMENTS: `aiHint: "forbid_summon_enter_cell"`. Skip if no hostile summon and the player has not summoned this fight.  
PLAYER_COUNTERPLAY: Walk the player body through; blink the pet over if Claim Ward is down; Sever Tether  
SYNERGIES: `pet_sill_hall`; Short Leash after they cannot park  
BALANCE_RISK: Two-cell Twin Span + Pet Sill can brick a pet. One cell, CD 2, summon-only.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-late-purse`

NAME: Late Purse  
ROLE: CONTROL — leftover AP burns at turn end  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `hex_teller` or `tax_scribe`; `G ≥ 6`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `hex_teller`, `tax_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. At the **end** of the target’s next turn, if leftover AP ≥ 2, they lose 1 leftover AP (`effectParams: {"leftoverApEndTax":1,"leftoverApEndMin":2}`). If they spent down to 0–1, nothing happens. Distinct from Empty Purse (spender, now), Act Tax (+1 AP if they act sooner), Drain Courage (immediate). Does not write persisted `CharacterStats.ap`.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "burn_leftover_ap_at_turn_end"`. Skip if leftover is already 0–1.  
PLAYER_COUNTERPLAY: Spend down; Split Purse the extra away; Empty Purse **you** so leftover is gone  
SYNERGIES: Quiet Hex (they cannot spend the last 3-AP tool); Act Bell (they become current with leftover)  
BALANCE_RISK: Punishing leftover without a spend button feels bad if they had no legal 1-AP tool. Min 2 leftover + CD 2. Strike is 2 AP — they can always dump.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. End-of-turn tick is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pet-share`

NAME: Pet Share  
ROLE: DEFENSE — share incoming to a summon  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Variant ≥ ELITE or `G ≥ 6`; families `brood_chanter` or `leash_warden`; `aiProfile` summoner/guardian; a living allied summon exists to **cast**  
ENEMY_FAMILIES: `brood_chanter`, `leash_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 6`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. 30% of incoming HP damage to the caster is applied to the nearest living allied summon instead (`effectParams: {"shareIncomingToSummonPct":0.30,"shareSummonDuration":2}`). If no summon lives, fizzle. Not RES%. Distinct from Load Bearing (any adjacent ally), Cover Step (next hit full redirect), Pain Link (hostile). Share uses post-RES remaining. Last `stat: "shareIncoming"` writer wins vs Load Bearing — **do not** stack; document replacement.  
SCALING: percent fixed  
AI_REQUIREMENTS: `aiHint: "share_to_living_summon"`. Skip if no allied summon.  
PLAYER_COUNTERPLAY: Kill the pet; snipe from 4; DoT the caster (share still applies per tick — **explicit:** DoT ticks share)  
SYNERGIES: Kennel Lock (pet cannot stray); Spark Whelp is a bad share target (it wants to die)  
BALANCE_RISK: 30% + Iron Skin is a turtle. Elite gate + pet required + CD 3. Player copy dumps onto a 1-HP wolf — a real downside.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-short-leash`

NAME: Short Leash  
ROLE: ANTI-SUMMON — cut remaining lifespan  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `null_censor`; variant ≥ ELITE or `G ≥ 6`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `null_censor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 6`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: Legal only if the target is `isSummon === true`. Set remaining lifespan to `min(remaining, 1)` (`effectParams: {"cutHostileSummonLifespanTo":1}`). No damage. If not a summon, fizzle. Distinct from Keep Kennel (+1 allied), Sever Tether (kill), Convert Whelp (steal at 25%), Summon Bane (bonus damage). Does not count as a new summon for Null Brand.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cut_hostile_summon_lifespan"`. Skip if no hostile summon with remaining ≥ 2.  
PLAYER_COUNTERPLAY: Don’t bring a pet; Keep Kennel first (then this still cuts to 1); dismiss by lifespan  
SYNERGIES: Pet Sill (cannot re-park); Null Brand after  
BALANCE_RISK: Deleting a Sentinel’s remaining 4 turns is huge. Elite + summon flag + CD 3 + 0 damage. Does not affect bosses or leaders.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-axis-veil`

NAME: Axis Veil  
ROLE: CONTROL — shared rank/file cannot be spell primary  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `storm_caller` or `axis_locksmith`; `G ≥ 6`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `storm_caller`, `axis_locksmith`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: No damage. 2 turns. Damaging **spells** (not Strike) cannot choose a primary target that shares rank **or** file with this caster (`effectParams: {"axisForbidPrimary":true,"axisForbidDuration":2}`). Area that includes an off-axis primary still hits bodies on the axis. Strike is unaffected. Distinct from Aim Veil (unit cannot be primary at all), Ward Cell (targeted **cell** fizzles), Rank Lock (walk).  
SCALING: duration fixed  
AI_REQUIREMENTS: `aiHint: "forbid_axis_primary"`. Skip if the player is already off-axis.  
PLAYER_COUNTERPLAY: Step off-axis; Strike; Aim Veil is the unit-level answer they already may own  
SYNERGIES: File Lance (they cannot snipe back down the file); Rank Lock (cannot walk off)  
BALANCE_RISK: Axis veil + Rank Lock deletes file casters. CD 3 + 2 turns + Strike exempt. **Do not** put both on BASE.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-safe-fall`

NAME: Safe Fall  
ROLE: DEFENSE — next forced-move skips hazard  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tide_shade` or `recoil_squire`; `G ≥ 6`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `tide_shade`, `recoil_squire`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥6. `generationMin: 6`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: The caster’s **next** push / pull / swap landing this battle (or 2 turns) does not apply lava / spikes / painted-hazard enter damage (`effectParams: {"skipNextHazardLanding":true}`). Walk onto the hazard still pays. Distinct from Self Anchor (cannot be moved), Nail Down (cannot walk), Back Step (the push). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_next_hazard_landing"`. Kiter / flanker. Cast when a File Reel / Recoil / Undertow landing is the plan **or** the player just painted cinder under them.  
PLAYER_COUNTERPLAY: Make them **walk** onto the hazard; wait 2; Nail Down so they cannot be moved anyway  
SYNERGIES: File Reel / Back Step / Undertow as the forced move; Wick Bite does **not** care (paint is still there)  
BALANCE_RISK: Ignoring lava on a 4-tile pull is a blowout. One landing, CD 3, walk still pays. Challenge lava debit: skipped landing does **not** call `recordInBattleChallengeDamage`.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Landing does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bare-lens`

NAME: Bare Lens  
ROLE: SUPPORT — +range if leftover AP is 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper`; variant ≥ ELITE or `G ≥ 6`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 6`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If leftover AP **at resolve** is 0, `modifiableRange` spells get `rangeDelta: +1` for 1 turn (`effectParams: {"bareLensIfZeroAp":true,"bareLensRangeDelta":1}`). If leftover ≥ 1, fizzle. Last rangeDelta writer wins. Distinct from Rooted Sight (didn’t walk), Split Pace (walked ≥ 2), Last Stride (walk MP waiver — memory Wave 5, do not clone).  
SCALING: delta fixed  
AI_REQUIREMENTS: `aiHint: "range_if_zero_leftover_ap"`. Spend AP first (or start the decide with 0 leftover after a prior cast), then arm, then poke. Skip if leftover ≥ 1.  
PLAYER_COUNTERPLAY: Loan Tempo them 1 leftover; Paper Wind overwrite; walk adjacent  
SYNERGIES: Empty Purse is the **opposite** spend; Far Sting after the lens  
BALANCE_RISK: +1 after dumping AP is Lens-lite. Elite + leftover-0 gate + CD 2.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-gap-ward`

NAME: Gap Ward  
ROLE: DEFENSE — next 1-tile walk skips overwatch  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `blink_cutter` or `mist_walker`; `G ≥ 6`; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `mist_walker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥6. `generationMin: 6`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: The caster’s **next walk of exactly 1 tile** this battle (or 2 turns) does not trigger Hold Ground, Far Watch, Crowd Tax, Tripwire, or Cast Snare (`effectParams: {"skipNextOverwatchWalk":true,"skipWalkTiles":1}`). Walks of 2+ tiles still trip. Teleport / Swap do **not** consume the ward (they already skip those triggers). Distinct from Safe Fall (forced-move **hazard**), Sidestep Ward (next **spell** fizzle), Mist Step (#120 blink). Observation is the **arm**.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_next_overwatch_walk"`. Flanker / kiter. Cast when Hold Ground / Far Watch / Crowd Tax is visible on the path. Skip if already adjacent.  
PLAYER_COUNTERPLAY: Make them walk 2; Strike the landing; wait out 2 turns  
SYNERGIES: Rear Cut after the 1-step flank; Face Away then Oncoming is **not** this card  
BALANCE_RISK: A free 1-step through Hold Ground deletes the stance. Exactly 1 tile + CD 3 + consume-on-walk.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. The skipped snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-ledger`

NAME: Pack Ledger  
ROLE: SUPPORT — leftover-AP aura  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `hex_chorister`; variant CHAMPION; `G ≥ 6`  
ENEMY_FAMILIES: `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 6`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 who start a turn with leftover AP from **the previous** turn keep 1 extra leftover (cap at max AP) (`effectParams: {"packLeftoverAura":1,"packLeftoverRadius":2}`). Does not grant the caster leftover the turn it is cast. Distinct from Pack Tempo (+1 AP at start regardless of leftover), Pack Howl (CHC), Loan Tempo (one ally).  
SCALING: amount fixed  
AI_REQUIREMENTS: `aiHint: "pack_leftover_aura"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2. **Do not** put Pack Howl, Pack Tempo, Pack Cover, **and** Pack Ledger on the same BASE kit; CHAMPION may have **one** pack aura.  
PLAYER_COUNTERPLAY: Kill the Chorister; Late Purse the extra leftover; Quiet Hex  
SYNERGIES: Empty Purse (allies dump leftover into damage); Split Purse  
BALANCE_RISK: Banking leftover across turns is a second Empty Purse. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-court-fold`

NAME: Court Fold  
ROLE: POSITION — fold two adjacent player-side bodies  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Proposed Wave-7 extra kit `fold_regent` / phase 2. Not a world pack. **Do not** restamp #463 `about_regent` / `oath_censor`  
ENEMY_FAMILIES: none (boss id `fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies that are Chebyshev ≤ 1 from **each other**. If fewer than two, or they are not adjacent, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldAdjacentPlayerSide":true,"foldAdjacentDamage":6}`). Distinct from Sovereign Fold (any two player-side, no adjacency), Pawn Trade (two hostiles-to-caster), Twin Span (two posts). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_adjacent_player_side"`. **Boss AI only.** Skip if 0–1 player-side bodies or they are not adjacent.  
PLAYER_COUNTERPLAY: Keep the summon 2+ away; fight without a summon; Claim Ward does not block (unit swap)  
SYNERGIES: Twin Span adjacency is the bait — folding the two posts + player is the lesson  
BALANCE_RISK: Forced adjacent swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 6 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…Wave-4 attachments. Do not put unique §11 ids in #405 CORE or #452 CORE.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `hex_chorister` | RARE / G≥6 | `spell-choir-verse`, `spell-dull-edge`; SIGNATURE `spell-pack-ledger` (ENEMY_ONLY; not with Pack Tempo / Pack Howl / Pack Cover on BASE) |
| `pale_cantor` | RARE / G≥6 | `spell-choir-verse`; #463 `spell-hinge-step`, `spell-cadence-lend` |
| `verse_scribe` | RARE / G≥6 | `spell-choir-verse` |
| `glyph_sower` | RARE / G≥6 | `spell-bias-step`, `spell-pet-sill`; #463 `spell-exit-tithe` |
| `axis_locksmith` | RARE / G≥6 | `spell-bias-step`, `spell-axis-veil` |
| `misstep_herald` | RARE / G≥6 | `spell-bias-step` (not with Misstep on the same BASE turn plan) |
| `ember_knight` | RARE / G≥6 | `spell-wick-bite` |
| `cinder_martyr` | RARE / G≥6 | `spell-wick-bite` |
| `fuse_binder` | RARE / G≥6 | `spell-wick-bite` |
| `bone_scribe` | ADVANCED / G≥6 | `spell-empty-purse` |
| `tax_scribe` | ADVANCED / G≥6 | `spell-empty-purse`, `spell-late-purse`; #463 `spell-purse-cut` |
| `ledger_siphon` | RARE / G≥6 | `spell-empty-purse`; #463 `spell-purse-cut` |
| `leash_warden` | ADVANCED / G≥6 | `spell-crowd-tax`; ELITE `spell-pet-share` |
| `iron_golem` | ADVANCED / G≥6 | `spell-crowd-tax`; #463 `spell-post-sting`, `spell-turn-cap` |
| `stone_castellan` | ADVANCED / G≥6 | #463 `spell-post-sting` |
| `brood_chanter` | RARE / G≥6 | `spell-pet-swap`, `spell-pet-sill`; ELITE `spell-pet-share`, #463 `spell-spark-whelp` |
| `rift_hook` | RARE / G≥6 | `spell-pet-swap`; #463 `spell-hinge-tile` |
| `glass_sniper` | ADVANCED / G≥6 | `spell-corner-lens`; ELITE `spell-bare-lens`; #463 `spell-blind-corner` |
| `pit_mason` | ADVANCED / G≥6 | `spell-corner-lens` |
| `smoke_thurifer` | RARE / G≥6 | #463 `spell-blind-corner` |
| `pin_cantor` | RARE / G≥6 | `spell-face-away`; SIGNATURE #463 `spell-about-face` (ENEMY_ONLY; CHAMPION) |
| `oncoming_knight` | RARE / G≥6 | `spell-face-away` (facing writer required) |
| `null_censor` | RARE / G≥6 | `spell-dull-edge`; ELITE `spell-short-leash` |
| `hex_teller` | RARE / G≥6 | `spell-late-purse` |
| `storm_caller` | RARE / G≥6 | `spell-axis-veil`; #463 `spell-file-reel` |
| `coil_arbiter` | RARE / G≥6 | #463 `spell-file-reel` |
| `tide_shade` | ADVANCED / G≥6 | `spell-safe-fall` |
| `recoil_squire` | ADVANCED / G≥6 | `spell-safe-fall` |
| `plate_warden` | ADVANCED / G≥6 | #463 `spell-turn-cap` |
| `span_warder` | ELITE / G≥6 | #463 `spell-twin-span` (not instead of Span Guard CORE) |
| `cadence_thief` | RARE / G≥6 | #463 `spell-cadence-break` |
| `font_cantor` | ADVANCED / G≥6 | #463 `spell-cadence-lend` |
| `tempo_precentor` | ADVANCED / G≥6 | #463 `spell-split-purse` |
| `origin_mason` | RARE / G≥6 | #463 `spell-exit-tithe` |
| `twin_porter` | RARE / G≥6 | #463 `spell-hinge-tile` |
| `blink_cutter` | ADVANCED / G≥6 | `spell-gap-ward` |
| `mist_walker` | ADVANCED / G≥6 | `spell-gap-ward`; #463 `spell-aim-veil` |
| `void_anchoret` | RARE / G≥6 | #463 `spell-aim-veil` |
| `vault_chaplain` | RARE / G≥6 | #463 `spell-hinge-step` (MULTI with #463; File Vault grant stays #411 `enthroned_void`) |

**#411 CORE (already #452 — observe only, do not duplicate CORE):** `oncoming_knight` / `pin_cantor` / `glance_ward` / `gait_muter` / `vault_chaplain` / `span_warder` / `span_prelate` / `cadence_thief` / `brand_plate` / `cover_squire` / `lintel_mason` / `act_teller` / `act_sexton`.

Empty slot → skip. Empty kit → `[physical_attack]`.

Do not pool #282 `spell-hex-toll`. Do not assign Face Away / Oncoming / Glance Cut until the battle facing writer exists. Do not assign Twin Span to a kit whose AI cannot walk two posts independently. Do not assign Choir Verse without a per-side last-resolved pipeline.

---

## 13. How to add Generation 7 forever

Same recipe as Wave 4 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 7 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids.

Suggested Wave-7 holes (do not fill today): mid-RAF splice (**hold** — AGENTS.md); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover doors `survivor` / `legendary_1` / `hard_1` identities; #463 Wave-7 extra doors `oath_censor` / `hinge_porter` / `exit_mason` / `about_regent` as **boss first-wins**, not world-pack CORE. #474 already extra-doored Slide Tile / Pawn Trade / Fan Bolt / Hex Toll onto `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector` — do not also grant those from `fold_regent`.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Wave-2 **before** Wave-3. Wave-3 **before** Wave-4. Wave-4 **before** any Wave-6 data. Coordinate #411 so Oncoming / Span Guard / Cadence Theft land **once**. Coordinate #463 so Post Sting / Twin Span / Cadence Break / File Reel land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W6-A. G≥6 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W6-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W6-C. Wave-6 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #411 / #463 / memory Wave-5 ids |
| W6-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `ENC-*` rooms as grants |
| W6-E. #411 / #463 stamps | Family overlays only | Restamping feats/challenges/extra doors; pooling Hex Toll |
| W6-F. Battle `currentView` writer | Wave 5 / #411 prerequisite | Pixel reads; forced-move facing rewrite |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids.

Act Bell / Late Purse / Pack Ledger read flags at turn wrap / turn start only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14, Wave 2 §15, Wave 3 §15, Wave 4 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W6-1 | Encounter start | Possessed-but-unused G6 id does not observe |
| W6-2 | Choir Verse no ally last-resolved | Fizzle observes Choir Verse; does not copy; does not grant the missing id |
| W6-3 | Choir Verse vs Stolen Verse / After Verse | Different ids; denylist includes each other |
| W6-4 | `choir_gallery` defeat | Does not grant. Victory grants once (MULTI) |
| W6-5 | Empty Purse leftover under 2 | 8 only; still observes |
| W6-6 | Face Away with no battle writer | AI skip; no observe |
| W6-7 | Pet Swap onto lava | One observe; hazard uses existing tick |
| W6-8 | Twin Span vs Span Guard | Two ids; independent walks vs rigid pair |
| W6-9 | Cadence Break vs Cadence Theft | Reset-to-0 vs steal-1; both legal on `cadence_thief` at G≥6 |
| W6-10 | Wick Bite on floor | 10 only |
| W6-11 | Dull Edge vs Oath Blade | Strike 0 vs other-ids-fizzle; not both on BASE |
| W6-12 | Pet Sill vs Open Pit | Summons blocked vs everyone blocked |
| W6-13 | Late Purse at leftover 1 | No tax |
| W6-14 | Pet Share with no pet | Fizzle observes; no share |
| W6-15 | Short Leash on player | Fizzle; no lifespan write |
| W6-16 | Axis Veil vs Strike | Strike still legal on the file |
| W6-17 | Safe Fall then **walk** onto lava | Walk still pays |
| W6-17b | Gap Ward then walk **2** tiles | Overwatch still trips. A 1-tile walk skips Hold Ground / Far Watch / Crowd Tax |
| W6-18 | Bare Lens with leftover 1 | Fizzle observes |
| W6-19 | Pack Ledger / Court Fold / About Face | Never in `ownedSpellIds` |
| W6-20 | ENC-SPELL-07 loaner | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W6-21 | G=5 Tide | No Empty Purse (`generationMin: 6`) |
| W6-22 | Duplicate victory | One owned row; levels untouched; no Doka |
| W6-23 | No cloned ids | `spell-post-sting` / `spell-oncoming` exist only as #463 / #411 rows |
| W6-24 | No fourth `mpCost > 0` | Unique §11 rows are all 0 |
| W6-25 | Hex Toll | Still not in any SDE pool |
| W6-26 | Memory Wave-5 ids | Absent from this catalog and from `spellData.ts` |
| W6-27 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–4, memory Wave 5, #120, #137, #185, #282, #342, #411, or **#463** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` / challenge rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Restamping #474 extra doors `mill_seneschal` / `counter_chaplain` / `wedge_prior` / `levy_rector`
- Mid-RAF splice of the current actor
- Player-owned Hex of Silence

---

## 17. Wave-6 index

**Unique SDE ids (19):** choir-verse, bias-step, wick-bite, empty-purse, crowd-tax, pet-swap, corner-lens, face-away, dull-edge, pet-sill, late-purse, pet-share, short-leash, axis-veil, safe-fall, bare-lens, gap-ward, pack-ledger, court-fold.

**#411 stamps (not new ids):** Oncoming, Facing Pin, Glance Cut, Stride Mute, Span Guard, Span Pylon, Cadence Theft, Cadence Brand, Cover Step, Low Lintel, Act Tax, Act Bell; File Vault MULTI child stays `enthroned_void`; Mute Thread / Queue Cut / False Cut stay boss/closed.

**#463 stamps (not new ids):** Post Sting, Purse Cut, Blind Corner, Hinge Step, File Reel, Twin Span, Aim Veil, Cadence Break, Cadence Lend, Split Purse, Exit Tithe, Hinge Tile, Spark Whelp, Turn Cap; Oath Blade stays BOSS; About Face never owned.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-choir-verse` | MULTI_SOURCE | yes | hex / cantor G≥6 **or** `choir_gallery` | Copy last ally id |
| `spell-bias-step` | ENEMY_DISCOVERY | yes | glyph / locksmith | Next walk must be diagonal |
| `spell-wick-bite` | ENEMY_DISCOVERY | yes | ember / martyr | Bonus on painted hazard |
| `spell-empty-purse` | ENEMY_DISCOVERY | yes | scribe / ledger | Spend leftover AP for damage |
| `spell-crowd-tax` | ENEMY_DISCOVERY | yes | warden / golem | Walk through me +1 AP |
| `spell-pet-swap` | ENEMY_DISCOVERY | yes | brood / rift | Swap with own summon |
| `spell-corner-lens` | ENEMY_DISCOVERY | yes | sniper / pit | +range if LoS blocked |
| `spell-face-away` | ENEMY_DISCOVERY | yes | pin / oncoming | Invert one stored view |
| `spell-dull-edge` | ENEMY_DISCOVERY | yes | censor / hex | Next Strike deals 0 |
| `spell-pet-sill` | ENEMY_DISCOVERY | yes | glyph / brood | Summons cannot enter cell |
| `spell-late-purse` | ENEMY_DISCOVERY | yes | teller / tax | Leftover AP burns at turn end |
| `spell-pet-share` | ELITE | yes | brood / warden | Share incoming to a summon |
| `spell-short-leash` | ELITE | yes | null_censor | Cut hostile summon lifespan |
| `spell-axis-veil` | ENEMY_DISCOVERY | yes | storm / locksmith | Axis cannot be spell primary |
| `spell-safe-fall` | ENEMY_DISCOVERY | yes | tide / recoil | Next forced-move skips hazard |
| `spell-bare-lens` | ELITE | yes | glass_sniper | +range if leftover AP is 0 |
| `spell-gap-ward` | ENEMY_DISCOVERY | yes | cutter / mist | Next 1-tile walk skips overwatch |
| `spell-pack-ledger` | ENEMY_ONLY | no | hex CHAMPION | Pack leftover-AP aura |
| `spell-court-fold` | BOSS_ONLY | no | `fold_regent` | Fold two adjacent player-side bodies |

All unique rows STATUS: **PROPOSED**.
