# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 4

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-09-21  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Days since last SDE pass:** 19 (Wave 3 was 2026-09-02 @ `58302bc`)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Wave 2 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md), PR #226) is the **generation stamp** (`generationMin`) and G≥2 catalog. Wave 3 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md), PR #300) is Generation 3. This document does **not** replace any of those. It is Generation 4: leftover engine holes after same-day tactical Wave 4 (#342), unused **family** attachments (every live feat/challenge door is already claimed), `generationMin: 4`, and a G≥4 extra kit slot.

ACTION_IDs: [`ACTION_IDS_SDE_2026-09-21.md`](./ACTION_IDS_SDE_2026-09-21.md).

**Do not implement production code from this PR.**

---

## 0. Sibling designs (do not duplicate)

| Sibling | Path / PR | Owns |
| :--- | :--- | :--- |
| Wave-1 discovery contract | #156 — `SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` | State machine, innate four, persist writers, UX copy, Wave-1 cards |
| Wave-2 discovery contract | #226 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-01.md` | `generationMin`, G≥2 verbs, W2 specials |
| Wave-3 discovery contract | #300 — `SPELL_DISCOVERY_ECOSYSTEM_2026-09-02.md` | G≥3 extra slot, W3 unique ids, #282 stamps |
| Wave-1 / Wave-2 / Wave-3 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `2026-09-02.md` | Ownership split, observe hook, victory commit, G resolve — **still blocking, still NEW** |
| Spell admin | #116 / #187 / same-day #353 | `ownedSpellIds` / `observedSpellIds`, soft-retire |
| Tactical gap-fillers W1 | #120 — `SPELL_PROPOSALS_2026-08-31.md` | `spell-shoulder-bash` … `spell-void-anchor` |
| Tactical gap-fillers W2 | #185 — `SPELL_PROPOSALS_2026-09-01.md` | `spell-file-lance` … `spell-life-tether` |
| Tactical gap-fillers W3 | #282 — `SPELL_PROPOSALS_2026-09-02.md` | Ley Toll … Board Tilt |
| Tactical gap-fillers W4 | **same-day #342** — `SPELL_PROPOSALS_2026-09-21.md` | Gale Fan, Twin Guard, Cut In, After Verse, Sanguine Toll, Cross Flank, Bias Ray, Draw Together, AP Sip, Body Check, Cast Snare, Bait Pylon, Morrow Step, Surplus Ward, Sated Fang, Eclipse Fold |
| Family sheets | #136 + 09-01/02 elite + same-day #349 | Wave-4 families consume **#282** verbs (`ley_tollkeeper` … `axis_locksmith`) |
| Boss adaptations | #137 / #197 / same-day #367 | Wave-5 bosses reuse #120 / #282 / #342; **no new #137 ids** |
| Encounter rooms | same-day #347 — `ENCOUNTER_EVOLUTION_2026-09-21.md` | Tide/File/Clock rooms; `ENC-SPELL-07` loaner; `WF-TEL-TRIUNE_PADS` world feature |
| PX coherence | same-day #343 | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |

**Id collision rule:** do not reuse any id in §0.1. Wave-4 unique ids in §11 are new. Same-day #342 ids in §0.2 are **stamped**, not cloned.

### 0.1 Reserved tombstone (never re-propose)

**#120:** `spell-shoulder-bash`, `spell-hook-line`, `spell-mist-step`, `spell-grave-bell`, `spell-root-snare`, `spell-lens-shift`, `spell-ward-plate`, `spell-pain-link`, `spell-cleanse-rite`, `spell-cinder-tile`, `spell-tripwire`, `spell-glyph-tax`, `spell-stone-turret`, `spell-turret-shard`, `spell-blood-familiar`, `spell-ricochet-mark`, `spell-void-anchor`.

**#137:** `spell-ember-step`, `spell-caltrop`, `spell-shock-glyph`, `spell-exsanguinate`, `spell-glyph-snare`, `spell-vault`, `spell-brood-ward`, `spell-aftershock`, `spell-rot-brand`, `spell-echo-cast`.

**Wave 1 SDE:** `spell-quiet-hex`, `spell-chain-ward`, `spell-crosswind`, `spell-glass-shot`, `spell-ember-wake`, `spell-split-mark`, `spell-phase-slip`, `spell-sever-tether`, `spell-overcast`, `spell-second-wind`, `spell-choir-hymn`, `spell-oath-bind`, `spell-leech-tempo`, `spell-null-brand`, `spell-false-retreat`, `spell-blood-benediction`, `spell-ward-interpose`, `spell-martyr-fuse`, `spell-hex-of-silence`. Formal blink id remains `spell-phase-slip` (never add `spell-phase-step`).

**Wave 2 SDE:** `spell-load-bearing`, `spell-void-glyph`, `spell-paper-wind`, `spell-rear-cut`, `spell-hold-ground`, `spell-rime-sheet`, `spell-hex-theft`, `spell-still-brand`, `spell-grounded-lock`, `spell-file-lance`, `spell-loan-tempo`, `spell-dispel-thread`, `spell-taunt-oath`, `spell-convert-whelp`, `spell-last-ember`, `spell-blood-tithe`, `spell-search-dust`, `spell-fog-hood`, `spell-claim-ward`, `spell-self-anchor`, `spell-pack-howl`, `spell-reliquary-lock`.

**#185 tactical Wave 2:** `spell-fuse-tile`, `spell-coup-de-grace`, `spell-ignite-stacks`, `spell-short-sight`, `spell-tempo-gift`, `spell-absolve`, `spell-cross-cut`, `spell-rime-tile`, `spell-smoke-veil`, `spell-sinkhole`, `spell-leash-hook`, `spell-bastion-pylon`, `spell-goad`, `spell-life-tether`. (`spell-file-lance` and `spell-blood-tithe` already listed above.)

**#282 tactical Wave 3:** `spell-ley-toll`, `spell-fan-bolt`, `spell-pawn-trade`, `spell-back-step`, `spell-twin-gate`, `spell-sidestep-ward`, `spell-far-sting`, `spell-soul-sip`, `spell-open-pit`, `spell-mercy-font`, `spell-font-pulse`, `spell-lens-share`, `spell-stride-brand`, `spell-hex-toll`, `spell-slide-tile`, `spell-rank-lock`, `spell-board-tilt`.

**Wave 3 SDE:** `spell-undertow`, `spell-mire-sheet`, `spell-borrowed-eye`, `spell-planted-stance`, `spell-file-slide`, `spell-tempo-invert`, `spell-debt-mark`, `spell-knight-pierce`, `spell-split-pace`, `spell-summon-bane`, `spell-last-ward`, `spell-kennel-lock`, `spell-far-watch`, `spell-mercy-hex`, `spell-bloodless-plate`, `spell-crimson-pact`, `spell-gate-sight`, `spell-pack-tempo`, `spell-sovereign-fold`.

**#342 tactical Wave 4 (same-day; never re-propose):** `spell-gale-fan`, `spell-twin-guard`, `spell-cut-in`, `spell-after-verse`, `spell-sanguine-toll`, `spell-cross-flank`, `spell-bias-ray`, `spell-draw-together`, `spell-ap-sip`, `spell-body-check`, `spell-cast-snare`, `spell-bait-pylon`, `spell-bait-eat`, `spell-morrow-step`, `spell-surplus-ward`, `spell-sated-fang`, `spell-eclipse-fold`.

**Do not alias** `spell-triune-gate` ↔ `spell-twin-gate`, `spell-stolen-verse` ↔ `spell-after-verse` / `spell-echo-cast`, `spell-relay-dash` ↔ `spell-body-check` / `spell-leash-hook`, `spell-camp-tax` ↔ `spell-still-brand` / `spell-stride-brand`, `spell-rooted-sight` ↔ `spell-split-pace` / `spell-overcast`, `spell-haze-pane` ↔ `spell-smoke-veil`, `spell-waste-pace` ↔ `spell-soul-sip` / `starter-frost`, `spell-bitter-cup` ↔ `spell-cursed-wound` / `spell-mercy-hex`, `spell-nail-down` ↔ `spell-self-anchor` / `spell-planted-stance`, `spell-repel-ring` ↔ `spell-pack-tempo` / `spell-board-tilt`, `spell-false-echo` ↔ `spell-eclipse-fold`. Those are sibling-owned fantasies.

Hex Toll (`spell-hex-toll`) remains a Quiet Hex near-clone. **Do not** attach it in SDE pools.

### 0.2 Same-day #342 hole ownership (stamp, do not clone)

#342 shipped the seven Wave-3-deferred engine verbs plus nine siblings. This document does **not** re-author them. Discovery attaches family / observe / unused-door metadata only:

| Hole | #342 id | SDE Wave-4 stamp |
| :--- | :--- | :--- |
| Cone + 1-tile knockback | `spell-gale-fan` | `fan_prelate` / `ember_knight` ELITE observe+win (`generationMin: 4`). Requires Fan Bolt cone helper. |
| Two-ally swap (caster stays) | `spell-twin-guard` | `blink_cutter` / `share_optic` observe+win. #342 MULTI child `betrayal_witness` already claimed — **do not restamp that feat** |
| Round-boundary first slot | `spell-cut-in` | #342 BOSS `starborn_queen` first-win. SDE adds **no** extra door |
| Manual echo of **your** last id | `spell-after-verse` | #342 BOSS `pale_archivist` first-win. SDE adds no extra door |
| HP+MP hybrid payload | `spell-sanguine-toll` | #342 BOSS `starved_vampire_pawn`. **This is the third `mpCost > 0` paper row.** SDE adds **no fourth** walk-MP snipe |
| Pincer (two adjacent allies) | `spell-cross-flank` | `shadow_lurker` / pawn kits G≥4 observe+win |
| Diagonal catalog poke | `spell-bias-ray` | #342 ACHIEVEMENT `first_blood`. Bishops may demonstrate; grant stays the feat |
| Pair attract (not to caster) | `spell-draw-together` | `coil_arbiter` / `soul_siphon` observe+win. #342 MULTI child `lord_of_static` already claimed |
| Zero-sum current AP | `spell-ap-sip` | `hex_teller` / `bone_scribe` G≥4 observe+win |
| Ally shove 1 | `spell-body-check` | `iron_golem` / `leash_warden` G≥4 observe+win |
| Cast-origin tile tax | `spell-cast-snare` | `tax_scribe` / `glyph_sower` G≥4 observe+win |
| Intercept summon | `spell-bait-pylon` | `brood_chanter` / `pylon_prelate` ELITE observe+win. Nested `spell-bait-eat` never owned |
| Delayed self-teleport | `spell-morrow-step` | `blink_cutter` G≥4 observe+win. #367 already MULTI `morrow_herald` — first child wins |
| Leftover-AP evade | `spell-surplus-ward` | #342 ACHIEVEMENT `doka_hoarder`. `sidestep_warder` may demonstrate; grant stays the feat |
| High-HP% physical | `spell-sated-fang` | #342 ACHIEVEMENT `rich_vampire`. `crimson_spawn` may demonstrate; grant stays the feat |
| Skip player-summon turns | `spell-eclipse-fold` | `NOT_PLAYER_LEARNABLE` / `BOSS_ONLY` on `final_pawn`. **Never** `ownedSpellIds` |

Sanguine Toll is **not** Undertow-2. Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll (2), Undertow (1), Sanguine Toll (1 + HP). **Do not add a fourth.**

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Nineteen days of merges (`58302bc` → `0f5363f`, through #332) did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. Line numbers moved with WX shrinkage (Wave 3 quoted 19,253 → **19,213**); the defects did not.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2408 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`gameTypes.ts` 48–49; `main.mo` 134) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | Feats cannot grant a spell id |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | Challenges cannot grant a spell id |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` (unchanged contract) | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | `WorldExploration.tsx` 11920; zone object at 4683 | `Math.floor(levelZone)` is `NaN`; every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids. #342 `summonAI: "bait"` must be an enum, not a parse of `"Bait Pylon"` |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | `WorldExploration.tsx` 17096–17205 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave 4 unique ids stay `mpCost: 0` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Gale Fan still depends on #342’s Fan Bolt cone helper |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Gale Fan / Draw Together / Body Check / Relay Dash landings must tick hazards (MIMA-005 still OPEN) |
| `CharacterStats.evasion` is unused in combat | persist field only | Surplus Ward / Sidestep Ward remain `evadeNextHits`, not a miss % |
| Open PR queue | #327, #331, then same-day #333–#367 (docs/fixes). **#342 owns Wave-4 tactical ids** | This change does not overlap those files |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 (`SDE-2026-08-31-001`…`003`, `006`), Wave-2 P0 (`SDE-2026-09-01-001`, `003`), and Wave-3 P0 (`SDE-2026-09-02-001`, `003`) remain the prerequisite. **Do not land Wave-4 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2, Wave 2 §2, and Wave 3 §2 still apply in full. Restated only where Wave 4 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥4 rares make it sharper: a CHAMPION may hold the generation-4 verb until the player has already committed a summon or a walk.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 4 fills holes Wave 1–3, #120, #185, #282, and **#342** left open (see §10). It does not clone Twin Gate, After Verse, Body Check, Still Brand, Smoke Veil, Soul Sip, Cursed Wound, Self Anchor, or Fan Bolt.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 4 stamps `generationMin: 4` on family verbs. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Wave 4 unique ids add **zero** `mpCost > 0` rows. Pad **transit** on Triune Gate may debit 1 current walk-MP as occupancy (same as #347 `WF-TEL-TRIUNE_PADS`), not as `spell.mpCost`.
13. **Evasion persist field stays unread.** #342 Surplus Ward reuses `evadeNextHits`. Do not teach Enemy Register “evasion %.”
14. **Loaner one-casts are not ownership.** #347 `ENC-SPELL-07` (`WF-SPL-LOANER_MAGE`) may grant a **single remaining cast** this map. That must not write `ownedSpellIds`, `spellLevelKeys`, or call `upgradeSpell`. Observe+win of the demonstrated id is the only persist path.
15. **Every live feat and challenge door is already claimed.** Wave 4 unique grants are `ENEMY_DISCOVERY` / `ELITE` / `SPECIAL_ENCOUNTER` / `MULTI_SOURCE` / closed classes. Do not restamp `first_blood`, `doka_hoarder`, `betrayal_witness`, `rich_vampire`, or any `easy_*` / `hard_*` / `legendary_*`. `unstoppable` / `level_10` stays unused forever as a spell gate.

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

Wave-4 additions to “what is used”:

| Event | Observed? |
| :--- | :--- |
| `spell-triune-gate` **paint** (AP spent, three pads planted) | **Yes** — the technique was used |
| Later **step through** a triune pad (including 1 walk-MP transit) | **No** — do not double-observe |
| `spell-stolen-verse` **cast** (AP spent; copy of a hostile’s last id) | **Yes** — Stolen Verse was used |
| The hostile’s **original** last spell | Observes **that** id if it is eligible; does not observe Stolen Verse |
| `spell-relay-dash` fizzle (no allied body / blocked path) after AP spend | **Yes** |
| `spell-nail-down` **arm** (AP spent) | **Yes** |
| `spell-second-shadow` decoy ticking without a new cast | **No** — `ENEMY_ONLY`; optional dim log on the **walk that left** the decoy |
| `spell-false-echo` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| `spell-repel-ring` aura shove without a new cast | **No** — aura tick is not AP spend |
| #342 `spell-morrow-step` **paint** | **Yes** (owned by #342; SDE does not second-observe arrival) |
| #342 `spell-bait-pylon` **place** | **Yes**; intercept is not a second observe |
| `ENC-SPELL-07` loaner **orb pickup** | **No** — not a hostile cast; not ownership |
| Loaner **cast** by the player this map | **No persist** of ownership; the demonstrated enemy id still needs hostile use + win |

Flee / death: observation **stays**. Unlock does **not** fire. A later win without re-observation does **not** unlock (default).

---

## 4. Acquisition sources (closed enums)

Same table as Wave 1 §4. Wave 4 stamps unused **family / special** doors, not new enum members, and **does not restamp** claimed feats or challenges.

| Source | Wave-4 grants (this doc) |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥4 family verbs in §11 **plus** #342 stamps in §0.2 that are observe+win |
| `ELITE` | Bitter Cup, Keep Kennel, Wounded Lens, #342 Bait Pylon stamp |
| `ACHIEVEMENT` | **None this wave.** #342 already claimed `first_blood` / `doka_hoarder` / `betrayal_witness` / `rich_vampire` |
| `CHALLENGE` | **None this wave.** All nine `DEFAULT_CHALLENGES` ids are claimed |
| `BOSS` | **None new.** Cut In / After Verse / Sanguine Toll stay #342. False Echo is `BOSS_ONLY` (never owned) |
| `SPECIAL_ENCOUNTER` | Triune Gate MULTI child ← `triune_gallery` victory (no observation). Haze Pane ← `haze_gallery` observe+win (teach room, not an extra grant) |
| `MULTI_SOURCE` | Triune Gate ← twin_porter/void_mirror observe+win **or** `triune_gallery` win. First child wins. Stolen Verse is observe+win only (no feat child) |
| `ENEMY_ONLY` | Repel Ring, Second Shadow (never owned) |
| `BOSS_ONLY` | False Echo (never owned). Eclipse Fold remains #342 |
| `SYSTEM_ONLY` | unchanged innate four. Loaner orbs are a **persist exception**, not a fifth innate id |

Do **not** gate a Wave-4 spell on `unstoppable` / `level_10`.

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

### 4.1 Doors already stamped (do not restamp)

| Door | Owner |
| :--- | :--- |
| `spell_scholar` | Wave 1 Overcast; live Barrier also tagged scholar |
| `explorer` | Wave 2 Search Dust |
| `easy_3` / `hard_3` | Wave 1 Second Wind |
| `easy_2` | Wave 2 Self Anchor MULTI child |
| `easy_1` | Wave 3 Bloodless Plate |
| `hard_1` / `jackpot` | #185 Absolve |
| `hard_2` | Wave 2 Blood Tithe |
| `legendary_1` | #120 Mist Step |
| `legendary_2` | Wave 1 live-catalog Timestep |
| `legendary_3` | #137 Echo Cast; Wave 3 Back Step MULTI child |
| Twin Monarchs | Wave 1 Choir Hymn |
| `chessboard_lich` | Wave 2 Claim Ward |
| `echo_dummies` | Wave 1 False Retreat |
| `mist_gallery` / `rime_gallery` / `still_court` | Wave 2 teach rooms |
| `gate_gallery` | Wave 3 Gate Sight |
| `pacifist_run` | Wave 1 Blood Benediction; Wave 3 Mercy Hex |
| `crimson_countess` | Wave 3 Crimson Pact |
| `void_grandmaster` | #282 Twin Gate |
| `critical_striker` | #282 Sidestep Ward |
| `loot_hunter` | #282 Mercy Font |
| `double_betrayal` | #282 Lens Share MULTI child |
| `leader_slayer` / `spell_master` | #120 Ward Interpose / Stone Turret |
| `survivor` | #120 Cleanse Rite |
| `first_blood` | #342 Bias Ray |
| `doka_hoarder` | #342 Surplus Ward |
| `betrayal_witness` | #342 Twin Guard MULTI child |
| `rich_vampire` | #342 Sated Fang |
| `starborn_queen` / `pale_archivist` / `starved_vampire_pawn` / `lord_of_static` | #342 Cut In / After Verse / Sanguine Toll / Draw Together |
| `morrow_herald` | #367 MULTI child on Morrow Step |
| `final_pawn` | #342 Eclipse Fold (`NOT_PLAYER_LEARNABLE`) |

### 4.2 Leftover doors (Wave 5+, not this pass)

**None of the 15 seeded feats or 9 challenges remain as a sole spell door.** Economy feats that #342 already used as non-damage identity (`doka_hoarder`, `rich_vampire`) stay theirs. `unstoppable` stays unused forever as a spell gate.

Wave 5+ may add **new** `AchievementConfig` / challenge rows, or attach observe+win only. Do not invent a 16th feat in this document.

---

## 5. Spell pool evolution — Generation 4 (never a last tier)

Wave 1 §6 five pools, Wave 2 §5 generation stamp, and Wave 3 §5 G≥3 extra slot stay. Wave 4 adds the **G≥4 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, 3, 4, … no maximum
R = enemy.level − player.level
T = current tierSize (default 10)
```

| G | Pool policy (additive) |
| :--- | :--- |
| 0 | CORE only (+ Strike if empty) |
| 1 | CORE + one ADVANCED (`generationMin ≤ 1`) |
| 2 | ADVANCED guaranteed; one slot may be `generationMin ≤ 2`; RARE eligible |
| 3 | RARE weight rises; one RARE may be `generationMin ≤ 3`; **one additional** ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 3` |
| 4 | Same recipe as G=3 **plus one additional** ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE slot with `generationMin ≤ 4` (this is the Generation 4 verb) |
| 5+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-2/3 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **4** for families listed in §12. It remains a data query, not a constant in combat math.

### 5.1 Resolve order (later implementation — extends Wave 3 §5.1)

```
resolveEnemyKit(familyId, pieceType, R, variant, encounterTags, aiProfile) → SpellConfig[]
  1. CORE_POOL (always; generationMin 0)
  2. if G ≥ 1 or variant ≥ VETERAN: one ADVANCED with generationMin ≤ G
  3. if G ≥ 2: one additional slot from ADVANCED ∪ RARE with generationMin ≤ G
     (skip if no legal id)
  4. if rare roll hits: at most one RARE_POOL id with generationMin ≤ G
  5. if G ≥ 3: one additional slot from ADVANCED ∪ RARE ∪ ELITE with generationMin ≤ G
  6. if G ≥ 4: one additional slot from ADVANCED ∪ RARE ∪ ELITE ∪ SIGNATURE with generationMin ≤ G
     (skip if no legal id; this is the Generation 4 verb)
  7. if elite/champion tag: ELITE_POOL / SIGNATURE the AI can use
  8. drop any id whose AI_REQUIREMENTS are unmet
  9. keep ENEMY_ONLY on enemies (they cast; they never grant)
 10. if empty: [physical_attack]
```

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 6. New `aiHint` keys (metadata, not names)

Wave 1 §9.1, Wave 2 §6, and Wave 3 §6 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `paint_three_pads` | caster, kiter | Three floor cells Chebyshev 2–4 apart, cycle 1→2→3→1, none on spawn/portal; skip if a triune already lives or Twin Gate pads already occupy two of the cells |
| `echo_hostile_last` | caster, controller | A living hostile-to-caster has a last-resolved id this battle that is not denylisted and still has a legal tile; skip if none |
| `dash_ally_toward_cell` | guardian, summoner | One living allied summon; a floor cell Chebyshev ≤ 2 from that summon improves pincer / leaves a hazard; skip if path blocked or landing is lava while summon HP% < 40 |
| `bonus_if_target_unmoved` | flanker, caster | Target spent 0 MP last round **or** has `movedThisTurn === false` at their last turn end; skip if they just walked |
| `range_if_caster_unmoved` | caster, kiter | Caster spent 0 MP so far this turn **and** intends to spend 0 more; skip if they still need to close |
| `paint_walkable_los_block` | caster, controller | A floor cell on the player’s LoS spoke to a squishy ally; skip if Smoke Veil already covers that spoke |
| `burn_one_current_mp` | caster, controller | Target current MP ≥ 1; skip if 0 (use Frost / Slow instead). **Do not** also Soul Sip the same turn if Sip is in kit (prefer Sip when caster MP is 0) |
| `invert_next_heal` | caster, controller | Target has a healer summon or Blood Mend in public bar, **or** Wisp alive; skip if no heal source visible |
| `extend_summon_lifespan` | summoner, guardian | ≥ 1 allied summon with remaining lifespan ≤ 2; skip if none |
| `cheaper_physical_after_walk` | flanker, charger, berserker | Caster already walked ≥ 2 this turn; skip on turn 1 if they spawned adjacent |
| `force_next_step_cardinal` | controller, caster | Target MP ≥ 1 and a chosen cardinal step lands on a hazard / pit / snare; skip if all four steps are blocked or safe |
| `fizzle_targeted_cell` | guardian, caster | A cell the player is likely to Mark / pit / gate-pad; skip if Claim Ward already on that cell |
| `nail_no_walk_no_displace` | guardian, charger | Caster occupies a file the player must cross **or** is the likely push/pull victim; skip if already nailed |
| `ap_on_spent_mp` | kiter, charger | Caster will spend their last MP this turn (walk 1 leftover); skip if they still have MP ≥ 2 after the planned walk |
| `los_if_damaged_this_round` | caster, kiter | Caster took damage since their last turn start; skip if they did not |
| `bonus_if_pit_in_los` | caster, kiter | A pit tile lies on Bresenham to the target; skip if no pit (use Far Sting / Frost) |
| `leave_decoy_on_vacate` | flanker, kiter | CHAMPION only; caster will walk ≥ 1; skip if a decoy already lives |
| `end_turn_adj_shove` | buffer, guardian | CHAMPION only; skip if aura up or no hostile will end adjacent |
| `copy_player_last_at_wrap` | **boss AI only** | Player resolved a non-denylisted id this round; skip if 0 |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 7. Spell discovery UX (unchanged chrome)

Wave 1 §7 stands. No second visual system.

- In-battle: `TECHNIQUE OBSERVED` — top-centre toast + `logBattleEntry`, 2.4s, gold/crimson, name only, dedup `(encounterId, spellId)`. Existing toast family: achievement path `WorldExploration.tsx` (same family as Wave 3; do not grow WX).
- After victory: `NEW SPELL DISCOVERED` on root recap. Fields: **name, role, AP, range, target type, key effect, source enemy**.
- Triune / Nail-down may add a **battle-log line** when a pad is used or the nail expires — combat feedback, not a second discovery toast.
- `ENEMY_ONLY` / `BOSS_ONLY`: optional dim `UNKNOWN TECHNIQUE` log. No observe persist.
- Loaner orb pickup is **not** `TECHNIQUE OBSERVED`. Optional dim “one-cast borrowed” log.
- Pad transit’s 1 walk-MP is **not** a second cue.

---

## 8. Persistence (same writers)

Wave 1 §8 is the persist contract. Wave 4 adds **no** new canister methods.

| Writer | Wave-4 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | `triune_gallery` MULTI child only (victory, no observation). **No** feat/challenge stamps this wave |

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
- Forced-move / dash landings use existing hazard helpers. Player-cast Relay Dash onto lava: `recordInBattleChallengeDamage` only while `inBattleRef` if treated as environmental (this card picks **environmental** — the damage is the hazard, not the spell).
- `#347 ENC-SPELL-07` loaner: one-cast this map; **never** `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell`. If the loaned id is later observed from a hostile and the player wins, `commitSpellDiscoveries` may then append it once.
- `spell-repel-ring` / `spell-second-shadow` / `spell-false-echo` never write `ownedSpellIds`.

---

## 9. Special encounters (Wave 4)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is `unlockOwnedSpell` / observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms. **Do not** reuse #347 `ENC-*` ids as spell tags — those are encounter catalog ids. These tags attach **discovery** chrome onto solvable layouts (they may be **paired** with #347 rooms later; they are not those rooms).

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `triune_gallery` | Twin Porter or Void Mirror + three visible floor markers (not world portals, not `WF-TEL-TRIUNE_PADS` occupancy until that feature ships). AI prefers Triune Gate if three cells are legal | `spell-triune-gate` on **victory** (no observation — `SPECIAL_ENCOUNTER` MULTI child) **or** observe+win if the id is used |
| `haze_gallery` | Smoke Thurifer / Pale Cantor on a file with one Barrier; AI prefers Haze Pane on the LoS spoke | `spell-haze-pane` via observe+win |
| `stolen_pulpit` | Bone Scribe + one pawn; scribe holds a last-resolved Frost so Stolen Verse is legal by turn 2 | `spell-stolen-verse` via observe+win |
| `nail_court` | Iron Golem on a choke file; AI prefers Nail-Down when the player shares the file | `spell-nail-down` via observe+win |
| `pit_gallery` | Pit Mason + Glass Sniper; one Open Pit already on the Bresenham (or a scripted hole tile until Open Pit ships) | `spell-pit-sight` via observe+win |

Wave-1 `echo_dummies`, Wave-2 `rime_gallery` / `still_court` / `mist_gallery`, and Wave-3 `undertow_channel` / `ember_fan` / `rift_twins` / `long_gallery` / `gate_gallery` are not re-specified.

`WF-TEL-TRIUNE_PADS` (#347 ENC-MOVE-06) is a **world feature**, not this spell. Do not grant Triune Gate on that room’s victory unless the hostile actually painted `spell-triune-gate` **or** the room is explicitly tagged `triune_gallery`.

---

## 10. Balance doctrine — holes this wave fills

Prior waves + #120 + #185 + #282 + **#342** already cover: push, pull-to-caster, blink, root, range buff **and** cut, absorb, redirect, cleanse, burn tile, trap, AP zone, turret, pet, bounce, next-spell AP tax, cone, cone+push, two-hostile swap, two-ally swap, self knockback, portal-pair, evade, leftover-AP evade, distance poke, MP steal, AP steal, pit, heal totem, ally range, walk-brand, conveyor, axis lock, mass shove, delayed blink, pincer, diagonal poke, pair attract, ally shove, origin-cast tax, intercept pylon, HP+MP hybrid, high-HP gate, round-wrap first slot, manual self-echo, skip-summon-turns.

**Still open (Wave 4 SDE unique ids).** The seven deferred engine holes are #342’s; this table is what Discovery **adds**.

| Hole | Wave-4 id | Why it is not a clone |
| :--- | :--- | :--- |
| Three-pad carousel | `spell-triune-gate` | Twin Gate is a **pair**. World-feature triune pads are not a castable spell |
| Copy a **hostile’s** last id | `spell-stolen-verse` | After Verse copies **yours**. Echo Cast primes **your next**. Hex of Silence stays BOSS_ONLY |
| Ally **walk** toward a cell | `spell-relay-dash` | Body Check is a 1-tile **push**. Leash Hook pulls **to caster**. Morrow Step is **self** delayed blink |
| Bonus vs a target that did not walk | `spell-camp-tax` | Still Brand punishes **self** standing. Stride Brand **rewards** walking |
| +range if **you** did not walk | `spell-rooted-sight` | Split Pace is +range after a **long** walk. Overcast is unconditional |
| Walkable LoS-block **tile** | `spell-haze-pane` | Smoke Veil is an area cloud. Barrier / Open Pit block walk. Frost Pane is a world feature |
| Burn 1 current MP (no steal) | `spell-waste-pace` | Soul Sip is zero-sum. Frost is a **duration** debuff |
| Next heal becomes damage | `spell-bitter-cup` | Cursed Wound **halves** incoming heals. Mercy Hex inverts **their nuke** |
| +1 summon lifespan | `spell-keep-kennel` | Kennel Lock is a **radius leash**. Convert Whelp **steals** a dying pet |
| Next physical cheaper after a walk | `spell-momentum-cut` | Split Pace is range. Last Ember is low-HP **damage**. Stride Brand is a damage rider |
| Force **next** walk cardinal | `spell-misstep` | Rank Lock locks **axis**. File Slide moves them **now** |
| Targeted spells at a **cell** fizzle | `spell-ward-cell` | Claim Ward blocks **swap/blink onto** a cell. Mirror reflects a **unit** hit |
| No walk **and** immune displacement | `spell-nail-down` | Self Anchor ignores push/pull **and can walk**. Planted Stance is 0-walk **RES** |
| +1 AP when walk-MP hits 0 | `spell-spent-stride` | Tempo Invert **swaps** leftover pools. Second Wind is a challenge door. Ley Toll **spends** MP to amp |
| Ignore LoS after being hit | `spell-wounded-lens` | Gate Sight ignores **one barrier**. Borrowed Eye is LoS from an **ally** |
| Bonus if a pit sits on LoS | `spell-pit-sight` | Far Sting scales with **distance**. Open Pit is the terrain verb |
| Decoy on the cell you left | `spell-second-shadow` | False Retreat is a **self blink** decoy. Never owned |
| Copy the **player’s** last id at wrap | `spell-false-echo` | After Verse is player-owned self-echo. Never owned |
| End-turn adjacency shove aura | `spell-repel-ring` | Pack Tempo is +AP. Board Tilt is a mass shove **cast**. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper `mpCost > 0` rows remain Ley Toll, Undertow, Sanguine Toll. This document adds **none**.

---

## 11. Proposed spells (Wave 4)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Wave 1–3 SDE, #120, #137, #185, #282, or **#342**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Pad transit is occupancy, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 4 SDE only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #342 key names for a different meaning.

```text
triunePadCount, triunePadDuration, triunePadMaxUses, triuneTransitMp,  // 3, 3, 1, 1
echoHostileLast, echoPayloadMul, echoDenyIds,                         // Stolen Verse
allyDashMaxSteps, allyDashTowardCell,                                 // Relay Dash
requireTargetUnmoved, campTaxDamage,                                  // Camp Tax
rootedRangeDelta,                                                     // Rooted Sight
hazeBlocksLos, hazeWalkable, hazeDuration,                            // Haze Pane
burnCurrentMp,                                                        // Waste Pace
nextHealBecomesDamageMul, bitterDuration,                             // Bitter Cup
summonLifespanDelta,                                                  // Keep Kennel
momentumMinWalk, nextPhysicalApDelta,                                 // Momentum Cut
forceNextStepCardinal, misstepDuration,                               // Misstep
cellFizzleTargetedSpells, cellFizzleDuration,                         // Ward Cell
nailNoWalk, nailIgnoreDisplace, nailDuration,                         // Nail-Down
apOnSpentMp, apOnSpentMpOncePerTurn,                                  // Spent Stride
losIfDamagedThisRound,                                                // Wounded Lens
pitOnBresenhamBonus,                                                  // Pit Sight
decoyOnVacateHp, decoyLifespan,                                       // Second Shadow
copyPlayerLastAtWrap, copyPayloadMul,                                 // False Echo
repelAdjShoveDistance, repelAuraDuration                              // Repel Ring
```

Reuse Twin Gate’s pad table type for Triune (**three** cells, `gatePads` analogue `triunePads`). Pads stay off `map.portals`.

---

### SPELL_ID: `spell-triune-gate`

NAME: Triune Gate  
ROLE: POSITION — three walkable pads, 1 transit each  
ACQUISITION_SOURCE: MULTI_SOURCE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true on the observe child; false on `triune_gallery` victory  
MINIMUM_ELIGIBILITY: Family `twin_porter` or `void_mirror`; variant ≥ VETERAN; `G ≥ 4` **or** tagged `triune_gallery`  
ENEMY_FAMILIES: `twin_porter`, `void_mirror`, `blink_cutter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / SIGNATURE. `generationMin: 4`  
RARITY: RARE  
AP_COST: 4  
RANGE: 4  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 4  
EFFECT: Paint **three** free floor cells Chebyshev 2–4 apart (`effectParams: {"triunePadCount":3,"triunePadDuration":3,"triunePadMaxUses":1,"triuneTransitMp":1}`). Cycle 1→2→3→1. Standing on a pad and spending 1 **current walk-MP** (not `spell.mpCost`) walks the unit to the next clockwise pad if `isCellFree`. Each pad dies after **one** transit. Occupied destination: swap if the occupant is a combatant, else fizzle that transit (MP spent). Distinct from Twin Gate (pair, Twin Gate’s own uses), Morrow Step (self delayed blink), world-feature `WF-TEL-TRIUNE_PADS` (not a spell).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "paint_three_pads"`. Caster. Skip if fewer than three legal cells or if Twin Gate pads already occupy two of them. Do not assign to chargers.  
PLAYER_COUNTERPLAY: Stand on the next clockwise pad; Barrier a pad; spend their last MP before they paint; Claim Ward a destination  
SYNERGIES: Cast Snare on a pad; Open Pit beside pad 2; Rooted Sight then File Lance through the carousel  
BALANCE_RISK: Three pads are a second Twin Gate if uses/duration match. **1 use each, CD 4, 1 walk-MP per transit.**  
PERSISTENCE_REQUIREMENTS: Observe on **paint**. Transit does not observe. `triune_gallery` victory may `unlockOwnedSpell` once (MULTI; first child wins). Duplicate empty.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-stolen-verse`

NAME: Stolen Verse  
ROLE: CONTROL / DAMAGE — replay a **hostile’s** last resolved id at 50%  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `bone_scribe` or `pale_cantor`; variant ≥ VETERAN; `G ≥ 4`  
ENEMY_FAMILIES: `bone_scribe`, `pale_cantor`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 4`  
RARITY: RARE  
AP_COST: 3  
RANGE: (copied from the stolen id’s live range)  
TARGET_TYPE: (copied)  
LOS: (copied)  
COOLDOWN: 3  
EFFECT: Legal only if a living **hostile-to-caster** has a last-resolved (`castResult === "cast"`) spell id this **battle** that is not denylisted (`effectParams: {"echoHostileLast":true,"echoPayloadMul":0.5}`). Re-resolve that id at 50% `damage` / `healAmount` / `dotDamage` (round half up, min 1 if original > 0) against a newly chosen legal target using **that id’s** targeting metadata. AP paid is Stolen Verse’s 3. MP / HP riders on the original **do not** re-fire. Distinct from After Verse (copies **yours**, same turn, AP 2), Echo Cast (primes **your next**, once/battle).  
SCALING: 50% of the stolen row’s current upgraded numbers  
AI_REQUIREMENTS: `aiHint: "echo_hostile_last"`. Caster. Skip if no last-resolved hostile id, denylist hit, or no second legal tile.  
PLAYER_COUNTERPLAY: Hold the nuke until they have spent Stolen Verse; fizzle the original (no last-resolved); Quiet Hex the verse  
SYNERGIES: Force them to Frost a pawn, then steal Frost onto the caster; Goad a cheap Strike so the stolen id is Strike  
BALANCE_RISK: Stealing Inferno at 50% is still AoE. CD 3 + denylist + needs **their** successful cast. Denylist (ids, not names): `spell-stolen-verse`, `spell-after-verse`, `spell-echo-cast`, `spell-timestep`, `spell-sacrifice`, any `isSummon`, `spell-twin-gate`, `spell-triune-gate`, `spell-morrow-step`, `spell-cut-in`, `spell-ley-toll`, `spell-sanguine-toll`.  
PERSISTENCE_REQUIREMENTS: Observe the Stolen Verse **cast** (AP spent). The original hostile spell observes **itself** separately if eligible. Fizzle after AP still observes Stolen Verse.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-relay-dash`

NAME: Relay Dash  
ROLE: SUPPORT / POSITION — allied summon walks up to 2 toward a painted cell  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `leash_warden` or `font_cantor`; `G ≥ 4`  
ENEMY_FAMILIES: `leash_warden`, `font_cantor`, `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥4. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: Target a living player-side summon. Paint one floor cell Chebyshev ≤ 3 of that summon. The summon **walks** up to **2** steps toward that cell along occupancy (`effectParams: {"allyDashMaxSteps":2,"allyDashTowardCell":true}`). Not a teleport. Blocked / occupied: stop on last free cell (successful cast). Distinct from Body Check (`applyPushback` 1 away from caster), Leash Hook (pull **to caster**), Twin Guard (swap two allies). Pushing the **player** is illegal on this card.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "dash_ally_toward_cell"`. Guardian / summoner. Skip if no summon, or landing is lava while summon HP% < 40.  
PLAYER_COUNTERPLAY: Self Anchor the summon; Body Check them off the path; occupy the cell  
SYNERGIES: Cross Flank pincer cell; Cast Snare / Open Pit off-path; Bait Pylon is a legal 1-HP body  
BALANCE_RISK: A 2-step teleport would delete Body Check. **Walk, max 2, CD 2.** Landing **must** tick hazards (MIMA-005).  
PERSISTENCE_REQUIREMENTS: Observe on cast (AP spent), including partial walks and fizzles after AP.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-camp-tax`

NAME: Camp Tax  
ROLE: DAMAGE — bonus vs a target that did not walk  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `hex_chorister` or `execute_jackal`; `G ≥ 4`  
ENEMY_FAMILIES: `hex_chorister`, `execute_jackal`, `stride_hunter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥4. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal **12**. If the target spent **0 MP** on their last turn (`effectParams: {"requireTargetUnmoved":true,"campTaxDamage":8}` is a **rider**, not a gate — the 12 always fires; the +8 only if unmoved), deal **+8** more. Distinct from Still Brand (self standing punish), Stride Brand (caster moved-this-turn bonus), Coup de Grace (HP%). Fail closed if last-turn MP is unknown (treat as moved — no +8).  
SCALING: 12 follows dmg%; +8 rider follows dmg%; unmoved flag fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_target_unmoved"`. Skip the rider mentally if they just walked (still may cast the 12). Prefer Frost first to empty their MP.  
PLAYER_COUNTERPLAY: Walk 1 before their turn; Haste so leftover MP exists; stay at Chebyshev 4  
SYNERGIES: Waste Pace / Soul Sip / Slow the turn before; Rank Lock so the “walk” they want is illegal  
BALANCE_RISK: 20 at 3 AP matches Frost if they camp. The +8 is the decision, not a second Frost.  
PERSISTENCE_REQUIREMENTS: Observe on AP spend even if the rider does not fire.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-rooted-sight`

NAME: Rooted Sight  
ROLE: SUPPORT — next spell +2 range if you spent 0 walk-MP this turn  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `iron_golem` or `plate_warden`; `G ≥ 4`  
ENEMY_FAMILIES: `iron_golem`, `plate_warden`, `glass_sniper`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥4. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If caster current MP equals their MP **at turn start** (spent 0 walk this turn), the next spell they resolve this turn gains +2 range (`modifiableRange` ids only) (`effectParams: {"rootedRangeDelta":2}`). If they already walked, the buff **does not apply** (AP still spent, CD written — a failed greed). Distinct from Split Pace (+range **after** walking ≥2), Overcast (unconditional), Lens Share (ally).  
SCALING: +2 fixed  
AI_REQUIREMENTS: `aiHint: "range_if_caster_unmoved"`. Skip if they still need to close, or if no `modifiableRange` id is off cooldown.  
PLAYER_COUNTERPLAY: Force them to walk onto ice first; stay inside their unbuffed range  
SYNERGIES: Planted Stance the same turn (0-walk RES + range); File Lance / Bias Ray / Far Sting; do **not** pair with Momentum Cut the same turn (that card **requires** a walk)  
BALANCE_RISK: Sniper +2 without Overcast’s AP. Greed fail + CD 2 is the tax.  
PERSISTENCE_REQUIREMENTS: Observe on AP spend, including failed greed.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-haze-pane`

NAME: Haze Pane  
ROLE: TERRAIN — one walkable tile that blocks LoS  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `smoke_thurifer` or `pale_cantor`; `G ≥ 4`  
ENEMY_FAMILIES: `smoke_thurifer`, `pale_cantor`, `mist_walker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: Paint one free floor cell for **2** turns (`effectParams: {"hazeBlocksLos":true,"hazeWalkable":true,"hazeDuration":2}`). Units may **walk** through it. Bresenham LoS treats it as a barrier. Distinct from Smoke Veil (area cloud), Barrier (blocks walk **and** LoS), Open Pit (blocks walk, LoS **open**), world-feature `WF-TER-FROST_PANE`. Visible carved pane (not hidden).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "paint_walkable_los_block"`. Skip if Smoke Veil already covers that spoke, or if the player is already adjacent (no LoS to cut).  
PLAYER_COUNTERPLAY: Walk through and melee; Gate Sight (one barrier); Borrowed Eye from an ally on the far side  
SYNERGIES: Glass Shot / Far Sting from behind the pane; Pit Sight does **not** count haze as a pit  
BALANCE_RISK: A walkable full wall would delete Barrier. **One cell, 2 turns, CD 2.**  
PERSISTENCE_REQUIREMENTS: Observe on paint. Walking through does not observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-waste-pace`

NAME: Waste Pace  
ROLE: CONTROL — burn 1 current walk-MP (caster does not gain)  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `coil_arbiter` or `soul_siphon`; `G ≥ 4`  
ENEMY_FAMILIES: `coil_arbiter`, `soul_siphon`, `tide_shade`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥4. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: If target **current** MP < 1, fizzle. Else target current MP −1 (floor 0). Caster gains **nothing** (`effectParams: {"burnCurrentMp":1}`). This-turn only; does not write persisted `CharacterStatFields.mp`. Distinct from Soul Sip (zero-sum), Frost (duration −1 MP), Slow (duration −2).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "burn_one_current_mp"`. Skip if target MP is 0. If Soul Sip is in kit **and** caster MP is 0, prefer Sip.  
PLAYER_COUNTERPLAY: Spend leftover MP before they waste it; stay at 0 leftover (they fizzle)  
SYNERGIES: Camp Tax next turn; Debt Mark so the remaining walk also costs AP; do not also Slow the same target the same turn (cap −2 applied MP still stands)  
BALANCE_RISK: Pure tempo drain at Strike cost. CD 2 + fizzle at 0 is the tax.  
PERSISTENCE_REQUIREMENTS: Observe on AP spend, including 0-MP fizzle after the gate if AP was spent. Illegal skip (AI, no AP) does not observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-bitter-cup`

NAME: Bitter Cup  
ROLE: CONTROL — next heal on the target becomes damage  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `null_censor` or `ash_absolver`; variant ≥ ELITE; `G ≥ 4`  
ENEMY_FAMILIES: `null_censor`, `ash_absolver`, `cinder_martyr`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 4`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 3  
EFFECT: 2 turns. The next **heal** that would apply to the target (`healAmount` > 0, including Wisp / Blood Mend / Mercy Font pulse / drain-heal portion) instead deals that amount as spell damage to them (`effectParams: {"nextHealBecomesDamageMul":1,"bitterDuration":2}`) and consumes the cup. Distinct from Cursed Wound (heal received ×0.5 for 2 turns, does not invert), Mercy Hex (their **nuke** becomes an ally heal), Bloodless Plate (absorb, not a heal). Self-HP costs (`recordChallengeSelfHpLoss`) are **not** heals and do not consume the cup.  
SCALING: converted amount follows the heal row; mul 1 fixed  
AI_REQUIREMENTS: `aiHint: "invert_next_heal"`. Skip if no visible heal source. Do not assign to kits that themselves heal the same target this turn.  
PLAYER_COUNTERPLAY: Do not heal; Dispel Thread; wait 2 turns; shield instead of mend  
SYNERGIES: Goad a Wisp into the cup; Cursed Wound is **not** both — if both would apply, Bitter Cup consumes first (explicit order)  
BALANCE_RISK: Turning Blood Mend 12 into 12 damage is a swing. One consume + CD 3 + ELITE gate.  
PERSISTENCE_REQUIREMENTS: Observe on AP spend. The later inverted heal is not a second observe. Challenge: inverted heal is spell-hit damage through `recordChallengeDamageTaken`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-keep-kennel`

NAME: Keep Kennel  
ROLE: SUMMONS — +1 lifespan on allied summons  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE; `G ≥ 4`  
ENEMY_FAMILIES: `brood_chanter`, `leech_familiar`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 4`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Every living **allied** summon gains +1 remaining lifespan, cap remaining ≤ `summonLifespan` + 2 (`effectParams: {"summonLifespanDelta":1}`). Distinct from Kennel Lock (radius leash + RES), Convert Whelp (steal dying hostile pet), Null Brand (hostile summon lockout). Does not heal. Does not recast.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "extend_summon_lifespan"`. Skip if no allied summon or all already above cap.  
PLAYER_COUNTERPLAY: Kill the pets first; Eclipse Fold (witness) still skips their next turn; Summon Bane  
SYNERGIES: Kennel Lock then Keep; Bait Pylon extra turn before intercept  
BALANCE_RISK: Infinite pets if spammable. **+1, CD 3, cap +2, ELITE.**  
PERSISTENCE_REQUIREMENTS: Observe on AP spend even if 0 summons (fizzle after AP).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-momentum-cut`

NAME: Momentum Cut  
ROLE: DAMAGE — next physical AP −1 after walking ≥2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `rust_reaver` or `stride_hunter`; `G ≥ 4`  
ENEMY_FAMILIES: `rust_reaver`, `stride_hunter`, `blink_cutter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥4. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 1  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: If caster already walked ≥ 2 this turn, their next **physical** (`isPhysical`) spell this turn costs −1 AP (floor 1) (`effectParams: {"momentumMinWalk":2,"nextPhysicalApDelta":-1}`). If they have not walked 2, failed greed (AP still spent). Distinct from Split Pace (+range after walk), Last Ember (low-HP next **physical damage**), Stride Brand (damage rider). Strike becomes 1 AP after a 2-walk.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cheaper_physical_after_walk"`. Flanker / charger. Skip on turn 1 if spawned adjacent.  
PLAYER_COUNTERPLAY: Root / Rank Lock before they walk 2; stay off the file  
SYNERGIES: Rear Cut / Cross Flank / Sated Fang after the dash; **anti-synergy** with Rooted Sight  
BALANCE_RISK: 1+1 AP Strike after a dash is a second melee. Floor 1 + CD 2 + must walk 2.  
PERSISTENCE_REQUIREMENTS: Observe on the Momentum Cut cast, not on the later Strike. Challenge: the discounted Strike still `recordChallengeApSpend` for the paid AP.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-misstep`

NAME: Misstep  
ROLE: CONTROL — force the target’s next 1-step walk into a chosen cardinal  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `axis_locksmith`; `G ≥ 4`  
ENEMY_FAMILIES: `glyph_sower`, `axis_locksmith`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 4`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: Choose a cardinal (`N/E/S/W`) stored on the target for **1** of their walks (`effectParams: {"forceNextStepCardinal":true,"misstepDuration":1}`). Their next 1-step walk **must** be that cardinal if the cell is `isCellFree`; if blocked, they may walk another dir (mark consumes). Forced-move spells (push/pull/swap) do **not** consume Misstep. Distinct from Rank Lock (entire walk on one axis), File Slide (moves them **now**), Root Snare (0 walk).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "force_next_step_cardinal"`. Skip if all four cardinals are blocked or none land on a hazard / pit / snare.  
PLAYER_COUNTERPLAY: Don’t walk (consume by waiting out duration); Self Anchor does **not** ignore a **chosen** next-step (explicit: Misstep is a walk rewrite, not a push). Blink / Swap skip it.  
SYNERGIES: Open Pit / Cinder / Cast Snare on that cardinal; Gale Fan after they step  
BALANCE_RISK: Forcing lava is lethal. Blocked-cell escape + 1 walk only + CD 2. Landing **must** tick (MIMA-005).  
PERSISTENCE_REQUIREMENTS: Observe on AP spend. The later forced step is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-ward-cell`

NAME: Ward Cell  
ROLE: TERRAIN — targeted spells aimed at this cell fizzle  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `void_anchoret` or `void_mirror`; `G ≥ 4`  
ENEMY_FAMILIES: `void_anchoret`, `void_mirror`, `claim` analogue: `glyph_sower`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 4`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 3  
EFFECT: Paint one free floor cell for **2** turns (`effectParams: {"cellFizzleTargetedSpells":true,"cellFizzleDuration":2}`). Spells whose **primary target tile** equals this cell fizzle (`no_effect`, AP spent, inner id does **not** observe). Walk, LoS, and **area** that merely **includes** the cell still resolve (the cell is not an absorb). Distinct from Claim Ward (blocks swap/blink **onto** the cell), Mirror (unit reflect), Bait Pylon (eats a hit on the **owner**).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "fizzle_targeted_cell"`. Skip if Claim Ward already occupies that cell (last writer would need a merge rule — **do not** stack; skip).  
PLAYER_COUNTERPLAY: Target a neighbor; use area / self spells; wait 2 turns; overwrite with Barrier (last writer wins, same as Wave 3 terrain)  
SYNERGIES: Mark is a targeted cell — Ward Cell eats Mark; Twin Gate pad on the cell: **paint** still works (ground target), **transit** is a walk  
BALANCE_RISK: Eating every snipe on a tile deletes Glass Shot. **Primary tile only, 2 turns, CD 3, areas still hit.**  
PERSISTENCE_REQUIREMENTS: Observe on paint. Inner fizzles do not observe the inner id (Wave 3 Cast Snare analogue).  
STATUS: PROPOSED

---

### SPELL_ID: `spell-nail-down`

NAME: Nail Down  
ROLE: DEFENSE / POSITION — cannot walk, immune to push/pull/swap, 1 turn  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `iron_golem` or `stone_castellan`; `G ≥ 4`  
ENEMY_FAMILIES: `iron_golem`, `stone_castellan`, `plate_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥4. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. Caster MP spends on **walk** are illegal. `applyPushback` / `applyAttract` / `isSwap` / Twin Guard / Pawn Trade targeting this unit fizzle on **this** body (`effectParams: {"nailNoWalk":true,"nailIgnoreDisplace":true,"nailDuration":1}`). Spells still legal. Distinct from Self Anchor (ignore displace **and can walk**), Planted Stance (0-walk **RES**, still displaceable), Grounded Lock (blocks **others’** swap/blink in a zone).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "nail_no_walk_no_displace"`. Guardian. Skip if already nailed, or if they still need to close.  
PLAYER_COUNTERPLAY: Don’t push them; snipe; Goad; wait the turn  
SYNERGIES: Hold Ground / Far Watch while nailed; Rooted Sight the same turn; **anti-synergy** with Back Step / Relay Dash  
BALANCE_RISK: Immune displacement plus a file choke is a wall. **1 turn, no RES rider, CD 3.**  
PERSISTENCE_REQUIREMENTS: Observe on arm. Expiry is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-spent-stride`

NAME: Spent Stride  
ROLE: SUPPORT — when walk-MP hits 0 this turn, gain 1 current AP once  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `tide_shade` or `ley_tollkeeper`; `G ≥ 4`  
ENEMY_FAMILIES: `tide_shade`, `ley_tollkeeper`, `tempo_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: This turn, the first time caster current MP reaches 0 **after a walk debit**, caster current AP +1 (cap at that unit’s max AP) (`effectParams: {"apOnSpentMp":1,"apOnSpentMpOncePerTurn":true}`). If they never spend the last MP, nothing happens (AP on this spell still spent). Distinct from Tempo Invert (swap leftover pools **now**), Ley Toll (spend 2 MP to **amp**), Second Wind (challenge door), Haste (MP **grant**). **Not** `mpCost`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "ap_on_spent_mp"`. Skip if they will keep MP ≥ 2, or if already at max AP.  
PLAYER_COUNTERPLAY: Don’t let them walk the last tile (Root / pit); Quiet Hex the extra AP  
SYNERGIES: Undertow after emptying MP (illegal if Undertow needs 1 MP — sequence is walk-empty **then** the +1 AP, not Undertow). Soul Sip to empty them **does not** trigger this (trigger is **their** walk debit).  
BALANCE_RISK: Convert leftover walk into a second spell. Once/turn + CD 3 + must actually empty.  
PERSISTENCE_REQUIREMENTS: Observe on the Spent Stride **cast**, not on the later AP grant.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wounded-lens`

NAME: Wounded Lens  
ROLE: SUPPORT — next spell ignores LoS if you took damage since last turn start  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `cinder_martyr`; variant ≥ ELITE; `G ≥ 4`  
ENEMY_FAMILIES: `glass_sniper`, `cinder_martyr`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 4`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: If caster took hit damage (not self-HP costs, not lava they walked onto **before** this turn) since their last turn start, their next spell this turn ignores LoS (`effectParams: {"losIfDamagedThisRound":true}`). Failed greed if they were not hit (AP spent). Distinct from Gate Sight (ignore **one barrier**, no hit gate), Borrowed Eye (LoS origin from ally), Fog Hood (cuts **their** range). Does not ignore range.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "los_if_damaged_this_round"`. Skip if they took no damage.  
PLAYER_COUNTERPLAY: Don’t chip the sniper; Barrier **range** still matters; stay outside maxRange  
SYNERGIES: Pain Link / Life Tether chips that count as hits; Goad a Strike into them on purpose  
BALANCE_RISK: Ignoring all LoS after a 10-damage chip deletes Barrier. **One next spell, ELITE, CD 3, must have been hit.**  
PERSISTENCE_REQUIREMENTS: Observe on AP spend, including failed greed. Lava self-walk is not the gate (explicit). Challenge hits through existing helpers still count.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pit-sight`

NAME: Pit Sight  
ROLE: DAMAGE — bonus if a pit lies on LoS to the target  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pit_mason` or `glass_sniper`; `G ≥ 4`  
ENEMY_FAMILIES: `pit_mason`, `glass_sniper`, `far_stinger`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 4`  
RARITY: UNCOMMON  
AP_COST: 3  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true (pit is LoS-open, so this stays legal)  
COOLDOWN: 1  
EFFECT: Deal **10**. If at least one Open Pit tile (or scripted hole with the same occupancy flag) lies on the Bresenham between caster and target, deal **+8** (`effectParams: {"pitOnBresenhamBonus":8}`). Distinct from Far Sting (distance-scaled, any facing), Glass Shot (min-range flat), Open Pit (the terrain). Haze Pane / Barrier on the line **block LoS** and make the cast illegal — they are not pits.  
SCALING: 10 and +8 follow dmg%  
AI_REQUIREMENTS: `aiHint: "bonus_if_pit_in_los"`. Skip the id if no pit (use Frost / Far Sting).  
PLAYER_COUNTERPLAY: Step off the spoke; fill/overwrite the pit; hug the caster  
SYNERGIES: Open Pit then Pit Sight; File Lance does **not** auto-add this rider (different id)  
BALANCE_RISK: 18 at 3 AP with setup matches Frost. The pit is the setup tax.  
PERSISTENCE_REQUIREMENTS: Observe on AP spend even if the bonus does not fire.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-second-shadow`

NAME: Second Shadow  
ROLE: SUMMONS / POSITION — leave a 1-HP decoy on the cell you vacated  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `shadow_lurker`; variant CHAMPION; `G ≥ 4`  
ENEMY_FAMILIES: `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 4`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: Arm 2 turns. The next time the caster **walks** ≥ 1 onto a free cell, spawn a 1-HP decoy (`summonAI: "bait"`-adjacent **decoy** enum `summonAI: "decoy"`, lifespan 2, kit empty / Strike illegal) on the vacated cell (`effectParams: {"decoyOnVacateHp":1,"decoyLifespan":2}`). Decoy does not walk, does not grant, does not observe. Distinct from False Retreat (self **blink** decoy), Bait Pylon (intercept pet). Never owned.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "leave_decoy_on_vacate"`. Flanker CHAMPION. Skip if a decoy already lives.  
PLAYER_COUNTERPLAY: Mark / Strike the decoy; do not waste Inferno on 1 HP  
SYNERGIES: Cross Flank (decoy is a body); Goad the decoy  
BALANCE_RISK: Free extra body every walk is a second pack. CHAMPION + CD 4 + 1 HP + never owned.  
PERSISTENCE_REQUIREMENTS: None. Optional dim `UNKNOWN TECHNIQUE` on the **arming cast**. Vacate spawn is not a second log. **Never** `ownedSpellIds`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-false-echo`

NAME: False Echo  
ROLE: CONTROL — at round wrap, copy the player’s last resolved id at 25%  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `unbound_pendulum` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `unbound_pendulum`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 5  
EFFECT: Arm until next round wrap. When `currentTurnIndex` wraps (same legal moment as #342 Cut In — **dedicated turn-order PR**, not RAF), if the player resolved a non-denylisted id this round, re-resolve it at **25%** from the boss toward a legal player-side target (`effectParams: {"copyPlayerLastAtWrap":true,"copyPayloadMul":0.25}`). Distinct from After Verse (player copies **themselves**), Stolen Verse (player copies a **hostile** now), Echo Cast (player primes next). Never owned. Denylist matches Stolen Verse plus `spell-false-echo`.  
SCALING: 25% of the copied row  
AI_REQUIREMENTS: `aiHint: "copy_player_last_at_wrap"`. **Boss AI only.** Skip if the player has not resolved a payload id.  
PLAYER_COUNTERPLAY: Cast a denylisted utility last; kill the pendulum before wrap; Quiet Hex  
SYNERGIES: Pendulum identity; do **not** also grant After Verse from this fight  
BALANCE_RISK: Copying Inferno even at 25% is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`. Implementation is the same wrap PR as Cut In — do not splice the current actor.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` on arm. Wrap copy is not a grant.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-repel-ring`

NAME: Repel Ring  
ROLE: POSITION — hostiles that **end their turn** adjacent are shoved 1  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `hex_chorister`; variant CHAMPION; `G ≥ 4`  
ENEMY_FAMILIES: `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 4`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. When a hostile-to-caster **ends their turn** at Chebyshev 1, `applyPushback` 1 away from the caster (`effectParams: {"repelAdjShoveDistance":1,"repelAuraDuration":2}`). Does not shove on the caster’s own turn. Distinct from Pack Tempo (+AP aura), Board Tilt (mass shove **cast**), Shoulder Bash (one body now). Never owned. **Do not** put Pack Tempo and Repel Ring on the same BASE kit; CHAMPION may have Howl **or** Tempo **or** Ring, not two pack auras in CORE.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "end_turn_adj_shove"`. Buffer CHAMPION. Skip if aura up.  
PLAYER_COUNTERPLAY: End turn at Chebyshev 2; Nail Down / Self Anchor; kill the Chorister  
SYNERGIES: Open Pit / Cinder behind the player; Gale Fan after they are shoved into a wedge  
BALANCE_RISK: Free end-turn shove is Board Tilt on a timer. ENEMY_ONLY + CHAMPION + CD 4. Landing **must** tick (MIMA-005). **Never** `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional dim log on the **arming cast**. Shove ticks are not observation.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 4 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1 / Wave-2 / Wave-3 attachments. #349 Wave-4 families already consume **#282** verbs — G≥4 is an **extra** slot, not a replacement.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `twin_porter` | RARE / SIGNATURE / G≥4 | `spell-triune-gate` (MULTI with `triune_gallery`) |
| `void_mirror` | RARE / G≥4 | `spell-triune-gate`, `spell-ward-cell` |
| `blink_cutter` | RARE / G≥4 | `spell-triune-gate`, #342 `spell-morrow-step`, #342 `spell-twin-guard` |
| `bone_scribe` | RARE / G≥4 | `spell-stolen-verse`, #342 `spell-ap-sip` |
| `pale_cantor` | ADVANCED / G≥4 | `spell-stolen-verse`, `spell-haze-pane`, `spell-wounded-lens` |
| `hex_chorister` | ADVANCED / G≥4 | `spell-camp-tax`; SIGNATURE `spell-repel-ring` (ENEMY_ONLY; not with Pack Tempo / Pack Howl on BASE) |
| `execute_jackal` | ADVANCED / G≥4 | `spell-camp-tax` |
| `leash_warden` | ADVANCED / G≥4 | `spell-relay-dash`, #342 `spell-body-check` |
| `font_cantor` | ADVANCED / G≥4 | `spell-relay-dash` |
| `iron_golem` | ADVANCED / G≥4 | `spell-rooted-sight`, `spell-nail-down`, #342 `spell-body-check` |
| `plate_warden` | ADVANCED / G≥4 | `spell-rooted-sight` |
| `stone_castellan` | ADVANCED / G≥4 | `spell-nail-down` |
| `smoke_thurifer` | RARE / G≥4 | `spell-haze-pane` |
| `coil_arbiter` | RARE / G≥4 | `spell-waste-pace`, #342 `spell-draw-together` |
| `soul_siphon` | RARE / G≥4 | `spell-waste-pace`, #342 `spell-draw-together` |
| `tide_shade` | RARE / G≥4 | `spell-spent-stride` |
| `ley_tollkeeper` | RARE / G≥4 | `spell-spent-stride` |
| `null_censor` | ELITE | `spell-bitter-cup` |
| `ash_absolver` | ELITE | `spell-bitter-cup` |
| `brood_chanter` | ELITE | `spell-keep-kennel`, #342 `spell-bait-pylon` |
| `pylon_prelate` | ELITE | #342 `spell-bait-pylon` |
| `rust_reaver` | ADVANCED / G≥4 | `spell-momentum-cut` |
| `stride_hunter` | ADVANCED / G≥4 | `spell-momentum-cut`, `spell-camp-tax` |
| `glyph_sower` | RARE / G≥4 | `spell-misstep`, #342 `spell-cast-snare` |
| `axis_locksmith` | RARE / G≥4 | `spell-misstep` |
| `tax_scribe` | RARE / G≥4 | #342 `spell-cast-snare` |
| `void_anchoret` | RARE / G≥4 | `spell-ward-cell` |
| `glass_sniper` | ELITE / G≥4 | `spell-wounded-lens`, `spell-pit-sight`, `spell-rooted-sight` |
| `cinder_martyr` | ELITE | `spell-wounded-lens` |
| `pit_mason` | RARE / G≥4 | `spell-pit-sight` |
| `far_stinger` | RARE / G≥4 | `spell-pit-sight` |
| `shadow_lurker` | RARE / G≥4 | #342 `spell-cross-flank`; SIGNATURE `spell-second-shadow` (ENEMY_ONLY; CHAMPION) |
| `fan_prelate` | ELITE / G≥4 | #342 `spell-gale-fan` |
| `ember_knight` | ELITE / G≥4 | #342 `spell-gale-fan` |
| `share_optic` | RARE / G≥4 | #342 `spell-twin-guard` |
| `hex_teller` | RARE / G≥4 | #342 `spell-ap-sip` |
| `hex_chorister` | ADVANCED (late W2 stamp) | `spell-still-brand` (`generationMin: 2` — was unfamilied; **not** a G4 verb) |
| `void_mirror` | ADVANCED (late W2 stamp) | `spell-grounded-lock` (`generationMin: 2` — was unfamilied) |

Empty slot → skip. Empty kit → `[physical_attack]`.

Do not pool #282 `spell-hex-toll`. Do not force Gale Fan onto a family whose AI cannot pick a wedge **and** a landing. Do not assign Stolen Verse to a kit with no last-resolved pipeline.

Bishops may demonstrate #342 Bias Ray; grant stays `first_blood`. `sidestep_warder` may demonstrate Surplus Ward; grant stays `doka_hoarder`. `crimson_spawn` may demonstrate Sated Fang; grant stays `rich_vampire`.

---

## 13. How to add Generation 5 forever

Same recipe as Wave 3 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 5 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`.

Suggested Wave-5 holes (do not fill today): mid-turn live splice of `turnOrder` during the current actor (**hold** — AGENTS.md forbids incidental turn-logic edits; Cut In / False Echo already consume the wrap PR); a fourth pure `mpCost > 0` walk snipe; sprite-facing damage (Rear Cut owns walk-facing); player-owned silence (Hex of Silence stays BOSS_ONLY); ally dash **to a clicked cell beyond 2 walk steps**; two-cell occupy; cooldown steal.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D (ownership, observe, commit, toast) **before** any Wave-2 data. Wave-2 slices W2-A–E **before** any Wave-3 data. Wave-3 slices W3-A–F **before** any Wave-4 data. Coordinate #342 data PRs so Gale Fan / Twin Guard / Sanguine Toll land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W4-A. G≥4 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W4-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W4-C. Wave-4 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #342 ids |
| W4-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub; retagging `ENC-*` rooms as grants |
| W4-E. #342 / W2 unfamilied stamps | Family overlays only | Restamping feats/challenges; pooling Hex Toll |
| W4-F. Triune pad table | `triunePads` table, not `map.portals`, not Twin Gate’s pair table | Portal lock-while-hostile rules |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids. Pad transit uses current walk-MP.

False Echo / Cut In read flags at round wrap only. Do not splice the current actor. Do not touch RAF.

---

## 15. QA matrix (additive to Wave 1 §14, Wave 2 §15, Wave 3 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W4-1 | Encounter start | Possessed-but-unused G4 id does not observe |
| W4-2 | Triune paint | Observe on paint; pad transit does not; 1 walk-MP is not a second cue |
| W4-3 | Triune vs Twin Gate vs world portals | Three different tables. World portals still impassable |
| W4-4 | `triune_gallery` defeat | Does not grant. Victory grants once (MULTI) |
| W4-5 | Stolen Verse no last-resolved | Fizzle observes Stolen Verse; does not copy |
| W4-6 | Stolen Verse vs After Verse | Different ids; denylist includes each other |
| W4-7 | Relay Dash onto lava | One observe; hazard uses existing tick |
| W4-8 | Camp Tax vs a walker | 12 fires; +8 does not |
| W4-9 | Rooted Sight after a walk | Failed greed observes; next spell unbuffed |
| W4-10 | Haze Pane vs Open Pit | Walkable LoS-block vs walk-block LoS-open |
| W4-11 | Waste Pace vs Soul Sip | Burn does not credit caster MP |
| W4-12 | Bitter Cup vs Cursed Wound | Invert consumes first; self-HP costs ignored |
| W4-13 | Keep Kennel cap | Remaining lifespan cannot exceed summonLifespan+2 |
| W4-14 | Momentum Cut + Rooted Sight | Not both on the same turn plan (opposite walk gates) |
| W4-15 | Misstep blocked cell | Mark consumes; they may walk another dir |
| W4-16 | Ward Cell vs area | Area that includes the cell still hits; primary-tile snipes fizzle |
| W4-17 | Nail Down vs Self Anchor | Nailed unit cannot walk; Anchored unit can |
| W4-18 | Spent Stride via Soul Sip | Does **not** trigger (must be their walk debit) |
| W4-19 | Wounded Lens vs lava self-walk | Lava is not the gate |
| W4-20 | Pit Sight with no pit | 10 only; AI should have skipped if hint wired |
| W4-21 | Second Shadow / Repel Ring / False Echo | Never in `ownedSpellIds` |
| W4-22 | ENC-SPELL-07 loaner | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W4-23 | G=3 Tide | No Spent Stride (`generationMin: 4`) |
| W4-24 | Duplicate victory | One owned row; levels untouched; no Doka |
| W4-25 | No cloned ids | `spell-gale-fan` / `spell-twin-guard` exist only as #342 rows |
| W4-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0 |
| W4-27 | Hex Toll | Still not in any SDE pool |
| W4-28 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Wave 1–3, #120, #137, #185, #282, or **#342** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` / challenge rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (same-day #367 owns Wave-5 sheets)
- Treating `WF-TEL-TRIUNE_PADS` as this spell

---

## 17. Wave-4 index

**Unique SDE ids (19):** triune-gate, stolen-verse, relay-dash, camp-tax, rooted-sight, haze-pane, waste-pace, bitter-cup, keep-kennel, momentum-cut, misstep, ward-cell, nail-down, spent-stride, wounded-lens, pit-sight, second-shadow, false-echo, repel-ring.

**#342 stamps (not new ids):** Gale Fan, Twin Guard, Cross Flank, AP Sip, Body Check, Cast Snare, Morrow Step, Bait Pylon, Draw Together; demonstrate-only Bias Ray / Surplus Ward / Sated Fang; no extra doors on Cut In / After Verse / Sanguine Toll; Eclipse Fold never owned.

**Late W2 family stamps:** Still Brand → `hex_chorister`; Grounded Lock → `void_mirror`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-triune-gate` | MULTI_SOURCE | yes | twin_porter G≥4 **or** `triune_gallery` | Three-pad carousel |
| `spell-stolen-verse` | ENEMY_DISCOVERY | yes | scribe / cantor | Copy hostile last id |
| `spell-relay-dash` | ENEMY_DISCOVERY | yes | warden / font | Ally walk toward cell |
| `spell-camp-tax` | ENEMY_DISCOVERY | yes | hex / jackal | Bonus vs unmoved |
| `spell-rooted-sight` | ENEMY_DISCOVERY | yes | golem / plate | +range if you didn’t walk |
| `spell-haze-pane` | ENEMY_DISCOVERY | yes | smoke / cantor | Walkable LoS-block tile |
| `spell-waste-pace` | ENEMY_DISCOVERY | yes | coil / siphon | Burn 1 MP, no steal |
| `spell-bitter-cup` | ELITE | yes | null_censor | Heal → damage |
| `spell-keep-kennel` | ELITE | yes | brood_chanter | +1 summon lifespan |
| `spell-momentum-cut` | ENEMY_DISCOVERY | yes | reaver / stride | Cheaper physical after walk |
| `spell-misstep` | ENEMY_DISCOVERY | yes | glyph / locksmith | Force next walk cardinal |
| `spell-ward-cell` | ENEMY_DISCOVERY | yes | void_anchoret | Targeted-cell fizzle |
| `spell-nail-down` | ENEMY_DISCOVERY | yes | golem / castellan | No walk + immune displace |
| `spell-spent-stride` | ENEMY_DISCOVERY | yes | tide / tollkeeper | +1 AP when MP hits 0 |
| `spell-wounded-lens` | ELITE | yes | glass / martyr | Ignore LoS after being hit |
| `spell-pit-sight` | ENEMY_DISCOVERY | yes | pit_mason / sniper | Bonus if pit on LoS |
| `spell-second-shadow` | ENEMY_ONLY | no | lurker CHAMPION | Decoy on vacated cell |
| `spell-false-echo` | BOSS_ONLY | no | Unbound Pendulum | Copy player last at wrap |
| `spell-repel-ring` | ENEMY_ONLY | no | hex CHAMPION | End-turn adj shove |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0, Wave-2 data, Wave-3 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #342 so Gale Fan / Twin Guard / Sanguine Toll land once. Not a license to land combat code in the same change as this spec.
