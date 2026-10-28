# Player Experience Coherence Audit — 2026-10-28

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `30118f7c-a49e-11f1-a7d1-d6b4613131ce` (cron `0 */48 * * *`)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-10-27.md`](https://github.com/Mr-Melic/stralt/pull/1175) in open [PR #1175](https://github.com/Mr-Melic/stralt/pull/1175) (same production SHA)  
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

**Do not re-file** still-open PXA IDs from 08-31 … 10-27. They remain open in-repo or in drafts **#343 / #393 / #481 / #529 / #579 / #632 / #691 / #744 / #784 / #844 / #907 / #955 / #1008 / #1067 / #1144 / #1175**.  
Closed (do not re-open): `PXA-2026-08-31-006` (Blood HUD), `PXA-2026-09-02-002` (accepted challenge HUD via `shouldShowChallengeHud`).  
Queued sibling, not a close: [PR #696](https://github.com/Mr-Melic/stralt/pull/696) names Inferno’s cooldown — that is 09-27-002, still unmerged.  
New records: [`ACTION_IDS_PXA_2026-10-28.md`](./ACTION_IDS_PXA_2026-10-28.md) (`PXA-2026-10-28-001` … `003`).

Sibling IDs already own: kit-zone NaN (EBA-013), `computeAITier` 30% noise, LHIPS XP-wall / 1e9 Doka clamp, FAIL×Windstorm (09-22-001), Windstorm dual rate (09-02-003), one-sided modifier store **including Vampiric throwaway** (09-26-002), player-sheet SR inbound (09-26-003), `maxSpellRange` 5 (09-25-003), unread AP/MP/HP cadence (09-27-001), Inferno silent CD (09-27-002), hit-log SP vs math SR on **player→enemy** hits (09-27-003), leader crown inverse (09-28-001), default-bar / default-win feats (09-28-002), post-mod float (09-28-003), hardcoded 1.03 vs admin spell-dmg % (09-29-001), Rest/Sanctuary hub with no rest (09-29-002), named-event lava/ice/spike painter (09-29-003), three fire DoT names (10-21-001), Windstorm miss starts Inferno CD (10-21-002), forge AP 10 / MP 5 vs battle 8 / 4 (10-21-003), `res_sp` unread + drain healAmount vs 50%-once (10-22-001), Barrier 2 vs 3 (10-22-002), three MP-slow names (10-22-003), Weaken `dmg` / Cursed Wound `healRecv` (10-23-001), Shield RES skips Crush (10-23-002), four reflect **rates** (10-23-003), player SP inbound + double RES (10-24-001), `easy_1` “healing spells” vs any restore (10-24-002), Iron Skin/Haste/Enrage “own” vs ally (10-24-003), gifted `hitsMultiple` vs cards (10-25-001), Haste +2 unread on restore / summon budget (10-25-002), turn-limit HUD never Failed (10-25-003), Bomber card/kit/1 AP (10-26-001), dungeon recap Depth 1/? (10-26-002), hard_3 HUD omits peak AP (10-26-003), Mirror dead self-arm (10-26-004), Mark empty no-op / tile vs enemy (10-26-005), Strike FAIL unnamed (10-26-006), Wisp healer 2 AP vs 3–4 AP kit (10-26-007), Timestep shield early-return (10-27-001), Sacrifice empty HP tax (10-27-002), overworld recap omits challenge Doka (10-27-003), easy_1/hard_1 HUD omits healUsed (10-27-004), Striker Yes at 0 attempts (10-27-005), missing juice on `applyDamageToEnemy` (GFCF-003), family HP wipe (PREREQ-H), Blood Mend / Rally **CHC** rider on the **champion** path (EBMA), player `debuffStat` never applying (EBMA-004 / **#528** / **#555**), summon Slow without `stat` (**#878** / EBMA-006), drain `healUsed` (EBMA-005), victory HP floor vs persist (SDEG), betrayal 6× (09-24-002), **AI Bomber DoT/kamikaze (`EBMA-2026-09-01-006`)**. This run does not twin those. PX still agrees: **scale combat grants; do not add a level cap.**

---

## Delta since 2026-10-27

`origin/main` has **not moved** since the 09-21…10-27 PX runs. All production claims below were re-read on `0f5363f` with current line numbers. No integrity merge landed in between. The **pipe** is the 09-02+ persist/recap work. The **loop** is still not one game.

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
| Recap dummy `"Battle Challenge"` | **Yes** | WX 12469. `_completedChallengeName` is computed at 12321–12323 and **never used**. Recap UI never renders `completedChallenges` — 09-25-002 |
| Death Realm copy | **Yes (KEEP)** | Quiet map; 20/40 + half linear-orb HP (`GameOverModal.tsx` 52–80) |
| BuffShop elixir / boots / charm / fury | **Yes (KEEP)** | Timing tools. HP pots vs 1:3 stay 09-23-002 |
| Attack Nearest on selected spell | **Yes (KEEP)** | Selected-spell execute from the **player** tile (`attackNearestLiveCasterPos`) |
| Dungeon live HUD depth | **Yes (KEEP)** | Recap Depth stay 10-26-002 |
| Wolf / Archer / Sentinel kits spendable | **Yes** | Bomber / Wisp stay 10-26-001 / 007. Sentinel panel title `golem` is PXA-012 |
| Timestep once-per-battle restore | **Still dead** | 10-27-001 |
| Sacrifice empty HP tax | **Still live** | 10-27-002 |
| Overworld recap omits challenge Doka | **Still live** | 10-27-003 |
| easy_1 / hard_1 HUD omits `healUsed` | **Still live** | 10-27-004 |
| Striker Yes at 0 attempts | **Still live** | 10-27-005 |
| Mark empty-floor | **Still dead** | 10-26-005. This run is the **x2 verb**, not the empty floor |
| Mark ×2 on “next spell” | **No — KEEP of the verb was wrong** | `computeDamage` doubles only inside that function (`WX` 3331–3335). DoT / Sacrifice never enter it. **10-28-001** |
| Legendary `rewards.badge` | **New read** | Panel prints `Badge: Untouchable/Blitz/Striker`. Persist type has no `badge`. No feat by those names. **10-28-002** |
| Empty `enemy` floors besides Mark / Sacrifice | **New read** | Targeting paints empty. Drain aborts. Swap empty KEEP. Strike / Poison / Inferno / Weaken / Slow / Frost Bolt / Expose / Veil / Cursed Wound `return "cast"`. Inferno also starts CD. **10-28-003** |

What **did not** change for identity: discovery is still a gifted 32-id book; encounter copy still disagrees with the engine; secondary rewards are still flat on `100 * 2^(N-1)`.

**New this run** (same bytes, unread last cycle). Do not re-file 10-26-001…007, 10-27-001…005, 09-25-002 dummy name, 10-21-002 Windstorm→Inferno CD, PXA-009 offer shaping / feat overlap, PXA-012 terminology.

1. **Gifted Mark’s ×2 never fights the DoT book or Sacrifice.** Card: “next spell on that tile deals x2.” Log: “Next hit deals x2.” Live double lives only in `computeDamage` / `calculatePlayerDamage` (`WX` 3331–3393). Inferno / Poison / Venom return from the DoT branch (`spellEngine.ts` 778–814) before the damage loop. Sacrifice uses `dealDamage` (`spellEngine.ts` 749–763) and never consults `markedTilesRef`. Mark then Inferno: no double, mark stays, Inferno still has `damage: 0` so there is no blast to double. Mark KEEP after 10-26-005 (tile vs enemy) is blocked until the ×2 verb is real. **10-28-001.**
2. **Legendary challenges advertise a Badge that is never granted.** Untouchable / Blitz / Striker print `Badge: …` (`ChallengePanel.tsx` 287–290). `CompletedChallengeReward` is `{ name, dokaReward, xpReward? }` (`challengeRewards.ts` 1–5). Persist hardcodes `name: "Battle Challenge"` (09-25-002). Feats have `pacifist_run`, not Untouchable. The panel sells a mastery token that does not exist. **10-28-002.**
3. **Empty highlighted `enemy` floors still execute the rest of the gifted book as AP burns.** 10-26-005 owns Mark empty (no `placeMark`). 10-27-002 owns Sacrifice empty (HP tax). Drain empty already `abort`s. Swap empty stays KEEP (hostile teleport miss, AP only). Strike / Poison Arrow / Venom / Inferno / Frost Bolt / Slow / Weaken / Expose / Shadow Veil / Cursed Wound have no occupant check in targeting (`targeting.ts` 669–687) and `return "cast"` when `!targetEnemy` (`spellEngine.ts` 1027–1028). Inferno empty also applies cooldown (`castResultAppliesCooldown("cast")`). **10-28-003.**

---

## Verdict

The **core identity is still sound**: AP spends actions, MP spends movement, explicit `SpellConfig` targeting, one Doka wallet, persist-locked `applyRewards` + root recap **mount**, percentage death + honest Death Realm, honest solo boss kits, CHC ×2, INIT-sorted turn order, 30s shot clock with honest Time Warp 15s, Attack Nearest on the selected spell, BuffShop timing pots, dungeon **live** depth HUD, Untouchable/Striker fail chips, Wolf/Archer/Sentinel spendable kits.

The game still does **not** play as one loop. Signature spells keep dying behind hoist order (Mirror 10-26-004, Timestep 10-27-001), empty-floor targeting (Mark 10-26-005, Sacrifice 10-27-002, now the rest of the book 10-28-003), or a verb that only the Strike-shaped damage loop runs (Mark ×2, **10-28-001**). Recap still lies about numbers the persist lock actually pays. Challenge HUD still advertises a Badge that is not a feat, not Doka, and not XP (**10-28-002**).

Until PXA-001 (discovery) and these signature / targeting / reward-token IDs are designed, adding World Dynamics tiles, more families, or more admin SKUs will make the identity *less* readable.

**Do not add a level cap.** Scale combat grants. Do not flatten percentage death.

---

## Classification (all reviewed systems)

| System | Class | One-line why |
| :--- | :--- | :--- |
| **Combat AP/MP split** | KEEP | AP = actions, MP = movement; book `mpCost` is ~0. Battle floor 8 / 4. Forge stamp 10 / 5 is 10-21-003. |
| **Explicit spell targeting metadata** | KEEP | `targetType` / range / LoS — not name heuristics. Empty `enemy` floors that execute are the leak (10-26-005 / 10-27-002 / **10-28-003**). |
| **Atomic reward funnel + root recap mount** | KEEP the pipe | Contents still lie (09-25-001/002, 10-26-002, 10-27-003). **Badge is not even on the pipe (10-28-002).** |
| **Death 20% XP / 40% Doka + Death Realm** | KEEP | Percentage cost stays meaningful with no cap. Copy is honest. |
| **Solo boss kits + `BossAbility` tags** | KEEP | Unique phase kits; real specials. |
| **Enemy / summon AI engine** | KEEP | Archetypes, lethal lookahead, LoS step, backline guard. Do not add toggles. |
| **Summon five-pack + player control panel** | KEEP **after** Bomber 10-26-001 and Wisp 10-26-007 | Wolf/Archer/Sentinel can spend ≥1 kit spell at spawn AP. |
| **Signature spells** | KEEP **after** honesty | Swap hostile-only KEEP. Barrier duration 10-22-002. Mirror arming 10-26-004. Mark empty 10-26-005. **Mark ×2 verb 10-28-001.** Timestep restore 10-27-001. Sacrifice empty 10-27-002. |
| **JUICE** | KEEP | Shake / hitstop / numbers. Value must match post-mod (09-28-003). |
| **Admin UI gated + backend `#admin`** | KEEP | Must stay off the player HUD. |
| **GameKey / Mollie IAP** | KEEP off-loop; SIMPLIFY chrome | 09-02-001. Not a tactic. |
| **Enrage +40% / duration 2 write** | KEEP | Player `computeDamage` **does** read `"dmg"` (`WX` 3325–3329). Hostile Crush unread is 10-23-001. “Own” vs ally is 10-24-003. |
| **Poison ≡ Venom numbers** | MERGE under PXA-002 | Identical 4×3 DoT. |
| **Spell catalog clones** | MERGE after unique keys fight | Shield ≡ Iron Skin waits 10-23-002; Expose ≡ Veil waits 10-22-001. |
| **Challenge HUD visibility** | KEEP | `shouldShowChallengeHud`. Do not hide for click-steal. |
| **Challenge HUD meters** | SIMPLIFY | Turns/Damage always. Peak AP 10-26-003. healUsed 10-27-004. Striker attempts 10-27-005. Turn-limit Failed 10-25-003. |
| **Challenge Badge line** | DEPRECATE or EXPAND | Advertised, never granted (**10-28-002**). |
| **Battle challenges (offer)** | REWORK | Random pick among 9, including legendary 1000 XP, every fight. Flat predicates 09-26-001. Copy 10-24-002. |
| **Spell discovery** | REWORK | Innate 32-id book. No observe → win → unlock. |
| **Boss-rush combined mechanics** | REWORK | Copy-only. Not shown in WX, not executed. |
| **Overworld recap Doka** | REWORK | Challenge Doka persist-only (10-27-003). Lottery 09-25-001. Dummy name 09-25-002. |
| **Dungeon chain** | EXPAND live rule; SIMPLIFY recap Depth | Live HUD KEEP. Recap Depth 10-26-002. |
| **Progression / rewards** | EXPAND grants; KEEP no-cap | Curve unbounded; grants are not. Do not add a cap. |
| **Enemy identity posters** | SIMPLIFY | Piece + family + aiTier + Register lore. Live kit is always zone 0. |
| **Achievements / Feats** | SIMPLIFY | Mastery mixed with chores and RNG. Feats vs Achievements stays PXA-012. No Untouchable feat for the challenge Badge. |
| **Map modifiers / world events** | SIMPLIFY + MERGE | Announce-vs-engine 09-01-002. Windstorm two rates 09-02-003. |
| **World Dynamics catalog** | MERGE or hold | Unwired. Do not stack. 09-01-003. |
| **Terminology** | SIMPLIFY | Includes Rest/Sanctuary, burn names, slow names, Shield vs Charm, Mirror pile, SP vs SR, “own” vs ally, Sentinel panel `golem`, Timestep vs Time Warp **names** (PXA-012), **Badge vs Feat vs recap dummy name (10-28-002)**. |
| **`resilience` / `evasion` on persist** | DEPRECATE or EXPAND | Required on `CharacterStats`; unused in combat math. |
| **`covenantBuff` / shrine 3-map write** | DEPRECATE or EXPAND | Shrine pays 300 Doka. Buff is write-only. |
| **Leftover `bloodBalance` + select particles** | DEPRECATE leftover field | Chrome is gone. Do not invent a spend. |
| **Empty `enemy`-floor execute (non-signature)** | REWORK | **10-28-003.** Drain abort KEEP. Swap empty KEEP. Mark empty 10-26-005. Sacrifice empty 10-27-002. |

---

## System notes (evidence)

### Spells — Mark ×2 is a Strike-loop verb; empty floors still burn AP for the rest of the book

Gifted Mark (`spellData.ts` 161–177): “Mark target tile — next spell on that tile deals x2 damage.” `isMark: true`, `targetType: "enemy"`. Empty execute is 10-26-005 (`placeMark` sits inside `if (targetEnemy \|\| spell.hitsMultiple)` at `spellEngine.ts` 928–937).

The **×2** lives in `computeDamage` (`WorldExploration.tsx` 3331–3335): if `markedTilesRef` has the click key, `dmg *= 2`. `calculatePlayerDamage` then deletes the key (3390–3393). That function is the player **damage-loop** helper. It is not the DoT branch and not Sacrifice.

| Next “spell” after Mark | What the engine does | ×2? | Consumes mark? |
| :--- | :--- | :--- | :--- |
| Strike / Chain Lightning / Expose / … damage-loop | `calculatePlayerDamage` | Yes (if click key matches) | Yes |
| Inferno / Poison Arrow / Venom Strike | DoT branch 778–814, `applyEffect` only. Inferno `damage: 0` | No | No — mark stays |
| Sacrifice | `dealDamage` 754–760, no `markedTilesRef` | No | No |
| Swap | Hostile swap, then `"cast"` | n/a | No |
| Empty Inferno | Falls through to `"cast"` (10-28-003) | No | No; CD still starts |

The card answers “what does Mark add?” with a tile trap for **the next spell**. Live Mark is a trap for **the next `computeDamage` call**. Inferno’s card is “Intense fire blast — burns target” with `damage: BigInt(0)` (`spellData.ts` 502–523) — there is no blast to double, and the burn never reads the mark. Silent Inferno CD stays 09-27-002; three fire names stay 10-21-001. This ID is the Mark verb. **PXA-2026-10-28-001.**

Empty `enemy` floors (targeting 669–687, no occupant check) still `return "cast"` at `spellEngine.ts` 1027–1028 when the spell is not drain / not Mark-with-occupant / not Sacrifice. Drain empty already aborts (867–873). Swap empty stays KEEP (hostile-only; AP burn, no HP). The leftover book:

- Strike (2 AP)
- Poison Arrow (2 AP)
- Venom Strike (3 AP)
- Inferno (5 AP **and** `cooldown: 3` via `castResultAppliesCooldown("cast")` — not 10-21-002, which is Windstorm miss)
- Frost Bolt, Slow, Weaken, Expose, Shadow Veil, Cursed Wound (debuff apply is EBMA-004; empty is this ID)

10-26-005 *recommended* occupancy for Sacrifice and did not file the rest of the book. 10-27-002 regression risk said do not retarget **all** `enemy` spells in that ID. This is that leftover class. **PXA-2026-10-28-003.**

### Challenges — HUD still sells a Badge that persist cannot grant

Offer is still `DEFAULT_CHALLENGES[Math.random()]` every fight (WX 12210–12218). Shaping stays PXA-009. Flat ≤ 8 stays 09-26-001. Turn-limit never-Failed stays 10-25-003. hard_3 peak AP stays 10-26-003. `easy_1` copy stays 10-24-002. healUsed meter stays 10-27-004. Striker attempts stay 10-27-005.

Legendary rows still carry `badge: "Untouchable" | "Blitz" | "Striker"` (`challengeCompletion.ts` 88–107). `ChallengePanel` renders `Badge: {name}` whenever `rewards.badge` is set (287–290). `battleChallengePersistEntries` accepts only `{ doka?, xp? }` and writes `name: "Battle Challenge"` (`challengeRewards.ts` 12–25). No caller reads `rewards.badge`. Recap dummy name stays 09-25-002. Feats still have `pacifist_run` (PXA-009 overlap with no-heal), not Untouchable / Blitz / Striker.

A mastery token the panel prints and the recap / Feats list never receive answers none of the four questions. **PXA-2026-10-28-002.**

### Summons / enemies / AI / bosses / dungeons / world events / shops / death / admin

Unchanged classes vs 10-27. Do not twin. Live kits still zone 0 (EBA-013). Register still teaches a game that is not running (09-01-001). Rush `combinedMechanic` still copy-only (PXA-003). Dungeon live HUD KEEP; recap Depth 10-26-002. Windstorm two rates 09-02-003. Death Realm KEEP. GameKey off-loop 09-02-001. Admin catalogs still three truths (PXA-015 / 09-01-002). Player summon spawn **does** apply `spell.summonLifespan` on top of `getSummonBaseStats` (`summonSpawn.ts` 158–161); Spellbook chips match when the field is set. Do not file lifespan as a five-pack ID.

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
- Untouchable / Striker fail chips (meters and Badge are the hole).
- Attack Nearest on the selected spell (player tile, not summon).
- BuffShop elixir / boots / charm / fury as in-battle timing tools.
- Dungeon **live** depth HUD and portal `Continue Chain (d/max)`.
- Time Warp 15s matching the **player** shot clock (name vs Timestep is PXA-012).
- Swap as hostile-only teleport (empty AP-burn is weaker than Sacrifice empty; do not fold into 10-28-003).
- Drain empty abort.
- Enrage +40% / 2 turns write path **and** player `computeDamage` `"dmg"` read.
- CHC ×2, INIT-sorted turns, SP **outbound** multiplier (inbound is 10-24-001).

---

## Recommended sequence (human, not this automation)

1. **Mark ×2 must fight the next spell the card names** — DoT / Sacrifice consume-or-double, or reprint the card as “next Strike-shaped hit” (10-28-001). Empty Mark place-or-abort stays 10-26-005.
2. **Empty `enemy` floors must abort or do the verb** — leftover book AP burn + Inferno CD (10-28-003), Sacrifice HP tax (10-27-002). Do not retarget Swap in 003.
3. **Hoist Timestep before the shield early-return** (10-27-001). Then Mirror arming (10-26-004).
4. **Recap numbers = persist numbers** — challenge Doka on overworld `dokaEarned` (10-27-003), dungeon Depth (10-26-002), then lottery/breakdown (09-25-001). Drop or grant the Badge (10-28-002); dummy `"Battle Challenge"` stays 09-25-002.
5. **Challenge HUD prints the contract** — peak AP (10-26-003), healUsed (10-27-004), Striker attempts (10-27-005), turn-limit Failed (10-25-003).
6. **Bomber / Wisp identity** (10-26-001 / 007) before treating the five-pack as KEEP.
7. **Honesty of rules the player can read today** — Register, modifier announce, Windstorm single rate, rush pair copy.
8. **Discovery contract** — innate 2–4, find the rest. Do not ship Rune Bearer first.
9. **NaN kit adapter, then kits past zone 2.** Do not add a level cap.

Do not implement these from this file unless a human or the Report Action Orchestrator picks an ID and it is still unique versus open PRs.
