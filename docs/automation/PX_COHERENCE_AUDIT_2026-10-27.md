# Player Experience Coherence Audit — 2026-10-27

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-10-26.md`](https://github.com/Mr-Melic/stralt/pull/1144) in open draft [PR #1144](https://github.com/Mr-Melic/stralt/pull/1144) (same production SHA)  
**Gameplay / production code:** not modified.

Stralt is judged as **one tactical game**. There is **no level cap**. Flat numbers are judged by whether they still create a decision at high level, not by whether an “endgame” exists.

Protected:

- tactical clarity
- meaningful choice
- spell-discovery excitement
- progressive enemy sophistication
- comprehensible encounter rules

Every system was asked at least one of:

1. What tactical decision does this add?
2. What mastery does this reward?
3. What progression fantasy does this support?
4. What new counterplay does this create?

If the honest answer is “none,” the system is noise.

**Do not re-file** still-open PXA IDs from 08-31 … 10-26. They remain open in-repo or in drafts **#343 / #393 / #481 / #529 / #579 / #632 / #691 / #744 / #784 / #844 / #907 / #955 / #1008 / #1067 / #1144**.  
Closed (do not re-open): `PXA-2026-08-31-006` (Blood HUD), `PXA-2026-09-02-002` (accepted challenge HUD via `shouldShowChallengeHud`).  
Queued sibling, not a close: [PR #696](https://github.com/Mr-Melic/stralt/pull/696) names Inferno’s cooldown — that is 09-27-002, still unmerged.  
New records: [`ACTION_IDS_PXA_2026-10-27.md`](./ACTION_IDS_PXA_2026-10-27.md) (`PXA-2026-10-27-001` … `005`).

Sibling IDs already own: kit-zone NaN (EBA-013), `computeAITier` 30% noise, LHIPS XP-wall / 1e9 Doka clamp, FAIL×Windstorm (09-22-001), Windstorm dual rate (09-02-003), one-sided modifier store **including Vampiric throwaway** (09-26-002), player-sheet SR inbound (09-26-003), `maxSpellRange` 5 (09-25-003), unread AP/MP/HP cadence (09-27-001), Inferno silent CD (09-27-002), hit-log SP vs math SR on **player→enemy** hits (09-27-003), leader crown inverse (09-28-001), default-bar / default-win feats (09-28-002), post-mod float (09-28-003), hardcoded 1.03 vs admin spell-dmg % (09-29-001), Rest/Sanctuary hub with no rest (09-29-002), named-event lava/ice/spike painter (09-29-003), three fire DoT names (10-21-001), Windstorm miss starts Inferno CD (10-21-002), forge AP 10 / MP 5 vs battle 8 / 4 (10-21-003), `res_sp` unread + drain healAmount vs 50%-once (10-22-001), Barrier 2 vs 3 (10-22-002), three MP-slow names (10-22-003), Weaken `dmg` / Cursed Wound `healRecv` (10-23-001), Shield RES skips Crush (10-23-002), four reflect **rates** (10-23-003), player SP inbound + double RES (10-24-001), `easy_1` “healing spells” vs any restore (10-24-002), Iron Skin/Haste/Enrage “own” vs ally (10-24-003), gifted `hitsMultiple` vs cards (10-25-001), Haste +2 unread on restore / summon budget (10-25-002), turn-limit HUD never Failed (10-25-003), Bomber card/kit/1 AP (10-26-001), dungeon recap Depth 1/? (10-26-002), hard_3 HUD omits peak AP (10-26-003), Mirror dead self-arm (10-26-004), Mark tile vs enemy/empty no-op (10-26-005), Strike FAIL unnamed (10-26-006), Wisp healer 2 AP vs 3–4 AP kit (10-26-007), missing juice on `applyDamageToEnemy` (GFCF-003), family HP wipe (PREREQ-H), Blood Mend / Rally **CHC** rider on the **champion** path (EBMA), player `debuffStat` never applying (EBMA-004 / **#528** / **#555**), summon Slow without `stat` (**#878** / EBMA-006), drain `healUsed` (EBMA-005), victory HP floor vs persist (SDEG), betrayal 6× (09-24-002), **AI Bomber DoT/kamikaze (`EBMA-2026-09-01-006`)**. This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

---

## Delta since 2026-10-26

`origin/main` has **not moved** since the 09-21…10-26 PX runs. All production claims below were re-read on `0f5363f` with current line numbers. No integrity merge landed in between. The **pipe** is the 09-02+ persist/recap work. The **loop** is still not one game.

The 10-26 KEEP of **Timestep mechanics** was wrong. The once-per-battle restore **exists** after the shield/buff early-return and is never reached on the only legal tile.

| Claim from last audits | Still true? | Updated evidence |
| :--- | :--- | :--- |
| Full `starterSpells` gifted as innate | **Yes** | `WorldExploration.tsx` 2395–2406; 32 ids in `spellData.ts` 9–690 |
| `shouldIncludeBackendSpellInLibrary` is not discovery | **Yes** | `adminSafety.ts` hides only `usableByPlayer === false` |
| `combinedMechanic` unused | **Yes** | Only `useBossRush.ts` 19–130; WX never renders the sentence |
| Blood HUD gone; field leftover | **Yes** | GameFlow spacer. `bloodBalance` still on the record (`main.mo` ~137). Character select still rains `BloodParticles` |
| Covenant buff write-only | **Yes** | `covenantBuffMapsRef` write WX 11330; no combat reader |
| Random legendary challenge every fight | **Yes** | WX 12210–12218; `DEFAULT_CHALLENGES` still 9 (`challengeCompletion.ts` 44–109) |
| Kits stop at zone 0 (NaN adapter) | **Yes** | `buildEnemyKit(..., currentMap.levelZone)` — EBA-013 |
| Accepted challenge HUD visible | **Yes (KEEP)** | `shouldShowChallengeHud`. Untouchable / Striker **fail chips work**. Do not hide again for click-steal (09-22-003 / #364) |
| Recap `dokaBreakdown: []` | **Yes** overworld (`WX` 12468). Lottery stays 09-25-001 |
| Recap dummy `"Battle Challenge"` | **Yes** | WX 12469. Recap UI never renders `completedChallenges` — 09-25-002 |
| Death Realm copy | **Yes (KEEP)** | Quiet map; 20/40 + half linear-orb HP (`GameOverModal.tsx` 52–80) |
| BuffShop elixir / boots / charm / fury | **Yes (KEEP)** | Timing tools. HP pots vs 1:3 stay 09-23-002 |
| Attack Nearest on selected spell | **Yes (KEEP)** | Selected-spell execute |
| Dungeon live HUD depth | **Yes (KEEP)** | Recap Depth stay 10-26-002 |
| Wolf / Archer / Sentinel kits spendable | **Yes** | Wolf Strike 2/2; Archer both kit spells 2/2; Sentinel Shield 2/2. Bomber / Wisp stay 10-26-001 / 007. Sentinel panel title `golem` is PXA-012 terminology, not a new ID |
| **Timestep once-per-battle restore** | **No — KEEP was wrong** | Card + `isTimestep` + `consumeTimestep` / `restoreApMp` exist. `effectType: "buff"` + `targetType: "self"` matches `isShieldSpell` (`spellEngine.ts` 634–636). Self-tile returns `"cast"` at 716–717 **before** `if (spell.isTimestep)` at 722–734. **10-27-001** |
| Swap hostile-only / no LoS | **Yes (KEEP)** | Empty click is AP burn, no swap. Not a HP tax |
| Enrage +40% / duration 2 | **Yes (KEEP write)** | “Own” stays 10-24-003 |
| Poison Arrow ≡ Venom Strike numbers | **Yes** | Both 4/turn × 3. MERGE stays PXA-002 |
| Physical Strike skipping FAIL | **Yes, unnamed** | 10-26-006 |
| Mirror self-cast arming | **Still dead** | 10-26-004 |
| Mark empty-floor | **Still dead** | 10-26-005. Sacrifice empty is **worse** (HP tax, no damage) → **10-27-002** |
| Overworld recap Doka vs persist | **New read** | Recap XP adds `challengeXpReward`; recap Doka is `clamp(totalDoka)` only. Persist then adds challenge Doka. Rush recap is honest. **10-27-003** |
| Challenge HUD contract meters | **Partial** | Turns/Damage always; Striker Yes/No; no peak AP (10-26-003); no `healUsed` (**10-27-004**); Striker Yes at 0 attempts (**10-27-005**) |

What **did not** change for identity: discovery is still a gifted 32-id book; encounter copy still disagrees with the engine; secondary rewards are still flat on `100 * 2^(N-1)`.

**New this run** (same bytes, unread or wrongly KEEP’d last cycle). Do not re-file 10-26-001…007, 10-26-004 Mirror arming, 10-26-005 Mark empty, 10-25-002 Haste restore, 10-25-003 turn-limit Failed, 09-26-001 flat ≤ 8, 09-25-001 lottery, 09-25-002 recap dummy name, 09-29-002 Sanctuary Rest, PXA-012 Timestep/Time Warp **names**, 10-24-002 `easy_1` copy.

1. **Gifted Timestep never restores AP/MP.** Self+buff is classified as a shield spell and returns before `isTimestep`. 0 AP, infinite clicks, no once-per-battle consume (**10-27-001**). Prior KEEP of “Timestep mechanics” is withdrawn. Name rhyme vs Time Warp stays PXA-012.
2. **Sacrifice on empty still bleeds 20% HP.** Card is a trade. Targeting paints empty enemy-type floors. `loseSelfHp` always; `dealDamage` only `if (targetEnemy)` (**10-27-002**). 10-26-005 recommended this abort and did not file it. Mark empty is a silent AP burn; Sacrifice empty is a HP tax with no target.
3. **Overworld recap omits the challenge Doka the panel advertised.** Immediate recap clamps Doka from fight `totalDoka` and **does** add challenge XP. Persist then credits challenge Doka via `completedChallenges`. Boss Rush recap adds both. `PostBattleRecap` never renders `dokaFromChallenges` (**10-27-003**). Not the hidden lottery (09-25-001) and not the dummy name (09-25-002).
4. **easy_1 / hard_1 HUD never shows `healUsed`.** Fail chip works after a restore; the contract metric is invisible before that, same class as hard_3’s missing peak AP (**10-27-004**). Copy “healing spells” vs any restore stays 10-24-002.
5. **Striker HUD prints vacuous “Yes” at zero casts.** Persist requires `directHit && attempts > 0`. `challengeDirectHitRef` starts `true`. Panel shows “All casts within 2 tiles: Yes” and “Not met yet” together (**10-27-005**). Fail-on-long-range chip stays KEEP.

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap **mount**, percentage death + honest Death Realm, honest solo boss kits, CHC ×2, INIT-sorted turn order, 30s shot clock with honest Time Warp 15s, Attack Nearest on the selected spell, BuffShop timing pots, dungeon **live** depth HUD, Untouchable/Striker fail chips, Wolf/Archer/Sentinel spendable kits.

The game still does **not** play as one loop. Signature spells keep dying behind hoist order (Mirror 10-26-004, now Timestep 10-27-001) or empty-floor targeting (Mark 10-26-005, now Sacrifice 10-27-002). Recap still lies about numbers the persist lock actually pays (Depth 10-26-002, now challenge Doka 10-27-003). Challenge HUD still hides the contract the chip is judging (peak AP 10-26-003, now healUsed / Striker attempts).

Until PXA-001 (discovery) and these signature/recap/HUD IDs are designed, adding World Dynamics tiles, more families, or more admin SKUs will make the identity *less* readable.

**Do not add a level cap.** Scale combat grants. Do not flatten percentage death.

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. Battle floor 8 / 4 (`PLAYER_BASE_AP/MP`). Forge stamp 10 / 5 is 10-21-003. |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Protect this. Empty `enemy` floors that execute are the leak (005 / 10-27-002). |
| **Atomic reward funnel + root recap mount** | KEEP the pipe | `applyRewards` / `saveBattleStats` + `PostBattleRecap` at app root. Contents still lie (09-25-001/002, 10-26-002, **10-27-003**). |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. Copy is honest. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. |
| **Summon five-pack + player control panel** | KEEP **after** Bomber 10-26-001 and Wisp 10-26-007 | Wolf/Archer/Sentinel can spend ≥1 kit spell at spawn AP. Bomber/Wisp cannot. |
| **Signature spells** | KEEP **after** honesty | Swap hostile-only KEEP. Barrier duration 10-22-002. Mirror arming 10-26-004. Mark empty 10-26-005. **Timestep restore 10-27-001. Sacrifice empty 10-27-002.** |
| **JUICE** | KEEP | Shake / hitstop / numbers. Value must match post-mod (09-28-003). |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | 09-02-001. Not a tactic. |
| **Enrage +40% / duration 2 write** | KEEP | “Own” vs ally is 10-24-003. |
| **Poison ≡ Venom numbers** | MERGE under PXA-002 | Identical 4×3 DoT. |
| **Spell catalog clones** | MERGE after unique keys fight | Shield ≡ Iron Skin waits 10-23-002; Expose ≡ Veil waits 10-22-001. |
| **Challenge HUD visibility** | KEEP | `shouldShowChallengeHud`. Do not hide for click-steal. |
| **Challenge HUD meters** | SIMPLIFY | Turns/Damage always. Peak AP is 10-26-003. **healUsed is 10-27-004. Striker attempts is 10-27-005.** Turn-limit Failed is 10-25-003. |
| **Battle challenges (offer)** | REWORK | Random pick among 9, including legendary 1000 XP, every fight. Flat predicates 09-26-001. Copy 10-24-002. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Boss-rush combined mechanics** | REWORK | Copy-only. Not shown in WX, not executed. |
| **Overworld recap Doka** | REWORK | Challenge Doka persist-only (**10-27-003**). Lottery 09-25-001. Dummy name 09-25-002. |
| **Dungeon chain** | EXPAND live rule; SIMPLIFY recap Depth | Live HUD KEEP. Recap Depth 10-26-002. |
| **Progression / rewards** | EXPAND grants; KEEP no-cap | Curve unbounded; grants are not. Do not add a cap. |
| **Enemy identity posters** | SIMPLIFY | Piece + family + aiTier + Register lore. Live kit is always zone 0. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores and RNG. Feats vs Achievements stays PXA-012. |
| **Map modifiers / world events** | SIMPLIFY + MERGE | Announce-vs-engine 09-01-002. Windstorm two rates 09-02-003. |
| **World Dynamics catalog** | MERGE or hold | Unwired. Do not stack. 09-01-003. |
| **Terminology** | SIMPLIFY | Includes Rest/Sanctuary, burn names, slow names, Shield vs Charm, Mirror pile, SP vs SR, “own” vs ally, Sentinel panel `golem`, Timestep vs Time Warp **names** (PXA-012 — not the dead restore). |
| **`resilience` / `evasion` on persist** | DEPRECATE or EXPAND | Required on `CharacterStats`; unused in combat math. |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. Buff is write-only. |
| **Leftover `bloodBalance` + select particles** | DEPRECATE leftover field | Chrome is gone. Do not invent a spend. |

---

## System notes (evidence)

### Spells — Timestep is a 0-AP no-op; Sacrifice empty is a bleed without a trade

Gifted Timestep (`spellData.ts` 215–231): “Resets your AP and MP to full. Once per battle.” `apCost: 0`, `effectType: "buff"`, `targetType: "self"`, `isTimestep: true`. Targeting only allows the caster tile (`targeting.ts` 503–508).

`resolvePlayerCast` classifies **any** self/ally buff as `isShieldSpell` (`spellEngine.ts` 634–636). On the player tile the shield branch applies `buffStat` if present, then **always** `return "cast"` (680–717). Timestep has no `buffStat`. Control never reaches `if (spell.isTimestep)` (722–734), so `consumeTimestep` / `restoreApMp` (`WorldExploration.tsx` 9350–9373) never run. `timestepUsedRef` still resets each fight (1847, 12177) for a consume that cannot fire.

FAIL still rolls (`!isPhysical`, 641–651): ~20% of clicks fizzle a spell that would have done nothing. Remaining clicks are silent 0-AP `"cast"`. The player can press Timestep all fight.

This is the same hoist class as Barrier/Summon (817–856) and the unused Mirror arm (10-26-004), **not** the Time Warp name rhyme (PXA-012). 10-26 KEEP of “Timestep mechanics” assumed the branch ran. It does not. **PXA-2026-10-27-001.**

Gifted Sacrifice (`spellData.ts` 233–250): “Lose 20% of own HP **to deal** 3x that amount as damage **to target**.” `targetType: "enemy"`. Preview for enemy-type accepts any in-range non-barrier floor (`targeting.ts` 669–687) — no occupant check. Engine (`spellEngine.ts` 749–763) **always** `loseSelfHp` (WX 9374–9387 records challenge self-HP), then damages only `if (targetEnemy)`, then `return "cast"` (AP spent). Empty highlighted floor: 20% HP gone, 3 AP gone, no damage.

10-26-005 owns Mark’s empty no-op (no `placeMark`, no HP tax) and *recommended* Sacrifice abort as a sibling. That abort was never an ID. The identity is different: Mark empty answers “nothing happened”; Sacrifice empty answers “I paid the cost of a trade and received none.” **PXA-2026-10-27-002.** Swap empty stays KEEP (hostile-only; AP burn, no HP).

### Challenges — HUD still hides the contract; recap still hides the Doka

Offer is still `DEFAULT_CHALLENGES[Math.random()]` every fight (WX 12210–12218). Shaping stays PXA-009. Flat ≤ 8 stays 09-26-001. Turn-limit never-Failed stays 10-25-003. hard_3 peak AP stays 10-26-003. `easy_1` copy stays 10-24-002.

`ChallengePanel` progress always prints Turns and Damage taken (304–307), adds Striker Yes/No only for `direct_hit` (308–312), and never prints `healUsed` or `directHitAttempts` even though WX passes both (19192–19198).

- `easy_1` / `hard_1` key on `healUsed` (`challengeCompletion.ts` 116–123, 442–449). Fail chip copy “a heal was used” works **after** the restore. Mid-fight the player cannot see whether the contract still thinks they are clean. Same meter-hole class as hard_3’s missing peak. **PXA-2026-10-27-004.**
- Striker persist is `directHit && attempts > 0` (`isStrikerChallengeComplete` 420–428). `challengeDirectHitRef` starts `true` (WX 1260). Zero casts → Yes + “Not met yet”. The Yes is a lie until an attempt exists. Fail-on-long-range chip stays KEEP. **PXA-2026-10-27-005.**

### Rewards / recap — overworld Doka undercounts the challenge the panel sold

Challenge panel prints Reward Doka and XP (`ChallengePanel.tsx` 275–286). Overworld victory:

- XP recap **includes** `challengeXpReward` (`WX` 12318–12320, 12447–12449).
- Doka recap is `clampApplyRewardsDeltas(totalDoka, …)` → `dokaEarned: recapGrant.dokaDelta` with **no** challenge Doka (12447–12462). `dokaFromChallenges` is not set (12456–12472).
- Persist then passes `completedChallenges: challengePersistEntries` (`WX` 12528–12538). `computeRewardDeltas` adds those Doka (`rewardResolver.ts` 155–162; `challengeRewards.ts` 53–68).

Boss Rush recap is the honest twin: `dokaEarned: totalDoka + challengeDokaReward` and `dokaFromChallenges` set (`WX` 12884–12891). `PostBattleRecap` never renders `dokaFromChallenges` (type-only at line 17) — Rush is saved by putting the sum in `dokaEarned`. Overworld is not.

A completed Untouchable therefore shows recap Doka without the advertised 500, then the persist lock credits it. Recap is the mastery receipt. **PXA-2026-10-27-003.** Hidden lottery / empty `dokaBreakdown` stays 09-25-001. Dummy `"Battle Challenge"` name stays 09-25-002 (and the recap UI still does not print that array). Depth 1/? stays 10-26-002.

### Summons — no new five-pack ID

Re-read spawn AP vs cheapest kit cost:

| Unit | Spawn AP | Cheapest kit | Spendable? |
| :--- | :--- | :--- | :--- |
| Dire Wolf | 2 | Strike 2 | Yes. Venom 3 grey until summon spell ≥ 3 |
| Archer | 2 | Poison 2 / Slow 2 | Yes (both) |
| Sentinel | 2 | Shield 2 | Yes. Iron Skin 3 grey until ≥ 3. Panel title `golem` (`pieceType`) is PXA-012 |
| Bomber | 1 | Inferno 5 | No — 10-26-001 |
| Wisp | 2 | Blood Mend 3 | No — 10-26-007 |

Sentinel cannot Shield the champion (ally targeting excludes the player — 09-26-002 / 10-24-003). Self-Shield on the golem is still a tank bodyguard; that is not a twin of Wisp’s “heals allies” with a fully grey kit. Do not file it.

### Enemies / AI / bosses / dungeons / world events / shops / death / admin

Unchanged classes vs 10-26. Do not twin. Live kits still zone 0 (EBA-013). Register still teaches a game that is not running (09-01-001). Rush `combinedMechanic` still copy-only (PXA-003). Dungeon live HUD KEEP; recap Depth 10-26-002. Windstorm two rates 09-02-003. Death Realm KEEP. GameKey off-loop 09-02-001. Admin catalogs still three truths (PXA-015 / 09-01-002).

### Progression — KEEP no cap

`xpForNextLevel` = `100 * 2^(N-1)`. Victory XP still `sum(level * 20)` then silent ×1.5 (09-23-001). Boss `1.08^diff` still scales. PX: scale **combat grants**; do not add a level cap. LHIPS-001 already owns the wall.

---

## What already fits (do not “fix”)

- AP for spells / MP for walk.
- Eight-slot bar as a **commitment** (once the book is earned).
- Wolf / Archer / Sentinel kits that the panel can actually press.
- Persist lock + recap **mount** at root.
- Death Realm as a place + 20/40 percentage.
- Boss phase 2 as kit + ability escalation.
- No level cap + percentage death + compounding boss level-diff.
- Accepted challenge HUD visibility (`shouldShowChallengeHud`).
- Untouchable / Striker fail chips (meters are the hole).
- Attack Nearest on the selected spell.
- BuffShop elixir / boots / charm / fury as in-battle timing tools.
- Dungeon **live** depth HUD and portal `Continue Chain (d/max)`.
- Time Warp 15s matching the **player** shot clock (name vs Timestep is PXA-012, not the dead restore).
- Swap as hostile-only teleport (empty AP-burn is weaker than Sacrifice empty).
- Enrage +40% / 2 turns write path.
- CHC ×2, INIT-sorted turns, SP **outbound** multiplier (inbound is 10-24-001).

---

## Recommended sequence (human, not this automation)

1. **Hoist Timestep before the shield early-return** so the gifted once-per-battle reset exists (10-27-001). Then Mirror arming (10-26-004).
2. **Empty `enemy` floors must abort or do the verb** — Sacrifice HP tax (10-27-002), Mark place-or-abort (10-26-005).
3. **Recap numbers = persist numbers** — challenge Doka on overworld `dokaEarned` (10-27-003), dungeon Depth (10-26-002), then lottery/breakdown (09-25-001).
4. **Challenge HUD prints the contract** — peak AP (10-26-003), healUsed (10-27-004), Striker attempts (10-27-005), turn-limit Failed (10-25-003).
5. **Bomber / Wisp identity** (10-26-001 / 007) before treating the five-pack as KEEP.
6. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm single rate, rush pair copy.
7. **Discovery contract** — innate 2–4, find the rest. Do not ship Rune Bearer first.
8. **NaN kit adapter, then kits past zone 2.** Do not add a level cap.

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.
