# ACTION_IDs — 2026-09-28 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`, `MIMA-2026-09-22-001/002/003/004`, `MIMA-2026-09-23-001/002/003/004`, `MIMA-2026-09-24-001/002/003/004`, `MIMA-2026-09-25-001/002/003/004`, `MIMA-2026-09-26-001/002/003/004`, `MIMA-2026-09-27-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#331** / **#336** / **#370** / **#376** / **#379** / **#380** / **#382** / **#386** / **#389** / **#391** / **#410** / **#443** / **#467** / **#476** / **#487** / **#489** / **#491** / **#495** / **#496** / **#498** / **#508** / **#524** / **#541** / **#543** / **#546** / **#547** / **#550** / **#551** / **#553** / **#554** / **#555** / **#566** / **#576** / **#595** / **#596** / **#597** / **#598** / **#599** / **#601** / **#602** / **#604** / **#606** / **#607** / **#608** / **#617** / **#671** / **#706** / **#709** / **#714** / **#728**.

HEAD is unchanged since the 09-21…09-27 matrices. These IDs are consume joins that were never filed: jackpot feat vs heal persist, upgrade/rename spends vs unpaid death, Shield Charm absorb vs enemy drain heal, and queen healer AI vs range-0 Blood Mend.

---

ACTION_ID: MIMA-2026-09-28-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: jackpot_heal unlocks from the optimistic banner before persist commits, and never from an in-battle jackpot  
CATEGORY: achievements + healing + persistence + challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: HUD Doka-to-HP (`WorldExploration.tsx` 18412–18484) applies HP/Doka locally, sets `jackpotHealVisible` (18436–18450), then `persistAbsoluteProgress` (18456–18459). The world effect (`2287–2291`) fires `checkAndFireAchievement("jackpot_heal")` whenever the banner is true **and** `!inBattle`. That helper immediately adds `achievementsShownRef` and `markAchievementUnlocked.mutate` (`2217–2244`) before the persist Promise settles. On reject, `shouldRollbackFailedHeal` restores HP/Doka (`18466–18483`) but never clears the banner or the unlock. Feat copy is “Trigger the jackpot heal event” with **200** Doka (`src/backend/lib/admin.mo` 318). Independently, the same effect’s `!inBattle` gate means a jackpot while the stats HUD is live in combat (challenge `healUsed` still flips at 18431–18435) never unlocks; the banner hides after 3s (`18440–18442`) so a later world check sees `false`. Distinct from `loot_10_doka` (09-27-004: pickup counter + `mapsVisited` gate). Distinct from `doka_1000` defer-until-credit. Distinct from 09-25-004 (claim × unpaid death). No test asserts persist-false ⇒ no unlock, or in-battle jackpot ⇒ no feat.  
EXPECTED_INTERACTION: `jackpot_heal` unlocks only after the heal `saveBattleStats` commits. A rolled-back jackpot must not unlock or stay claimable. An in-battle jackpot that committed should still be able to unlock (recap or post-battle check), same as other battle feats.  
ACTUAL_INTERACTION: Out-of-battle banner races persist; a failed write still leaves Claim. In-battle jackpot fails no-heal challenges but never awards the feat.  
SYSTEMS_AFFECTED: jackpot heal, achievements (`jackpot_heal`), persist lock, HUD heal, challenges (`healUsed`)  
RECOMMENDED_ACTION: Call `checkAndFireAchievement("jackpot_heal")` only inside `persist.then((ok) => { if (ok) … })` (and allow `inBattle: true` so recap can carry it). On rollback, clear `jackpotHealVisible` and do not mutate `achievementsShownRef`. Do not change jackpot odds (0.005) or 1:3 spend. Tests: persist false ⇒ no unlock / banner cleared; persist true out of battle ⇒ unlock once; persist true in battle ⇒ recap lists `jackpot_heal`.  
AUTONOMY: IMPLEMENT_ONE_WX_JACKPOT_GATE  
DEPENDENCIES: None. Do not fold loot_10 (09-27-004) or unpaid-death claim (09-25-004).  
REGRESSION_RISK: LOW — toast copy can stay optimistic; only the feat unlock must wait. In-battle recap must not double-toast (`achievementsShownRef`).  
VALIDATION_REQUIRED: Unit around jackpot + fake persist false; playtest jackpot with actor reject and one in-battle jackpot.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-28-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: upgradeSpell and renameCharacter debit the uncut canister wallet without honouring unpaid death 20/40  
CATEGORY: rewards + death + persistence + spell discovery  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Absolute spends honour unpaid death (`persistAbsoluteProgress` → `applyUnpaidDeathPenaltyToWrite`, `WorldExploration.tsx` 13134–13147). Credits that skip honour are already filed: feat claim (09-25-004), GameKey (09-02-003 / **#391**), shrine/ground/dungeon and victory/portal `applyRewards` (09-26-002 / 09-26-004). `handleUpgradeSpell` (`3140–3182`) enqueues `persistSpellUpgrade` → canister `upgradeSpell` (debits `dokaBalances`, writes spell levels) then `committedDokaAfterSpellUpgrade` — `spellUpgrade.ts` has **zero** `readPendingDeathPenalty` / `applyUnpaidDeathPenaltyToWrite`. `handleRenameCharacter` (`2105–2136`) enqueues `renameCharacter` (−100 on canister) then `committedDokaAfterRename` — same miss in `renameCharacter.ts`. After a failed death persist the UI can show the cut wallet while the canister still holds pre-death Doka, so upgrade/rename buy a durable spell level / name with the unpaid 40% slice; the lock then commits the post-spend snapshot without the tax. Distinct from **#602** (Death Realm **1.5s timing** gate on the same buttons). Distinct from **#387** (throw-after-debit note). `processPendingPurchases` remains a no-op (`0`). Heal/Items Buy already honour via the absolute path.  
EXPECTED_INTERACTION: Any persist-lock Doka mutation while unpaid death is pending either applies `applyUnpaidDeathPenaltyToWrite` to the committed snapshot or refuses the spend until the cut lands. Spell levels must not be purchased from Doka the 20/40 should have removed.  
ACTUAL_INTERACTION: Heal/shop absolute writes honour; `upgradeSpell` / `renameCharacter` spend the uncut canister and commit without the tax.  
SYSTEMS_AFFECTED: upgradeSpell, renameCharacter, death penalty pending marker, persist lock, spell levels  
RECOMMENDED_ACTION: Before canister debit (or when committing the post-spend wallet), if `readPendingDeathPenaltyAnywhere` is set and not `cutConfirmed`, refuse the spend **or** commit `applyUnpaidDeathPenaltyToWrite(pending, xp, postSpendDoka)`. Prefer refuse while pending so a rename cannot consume the unpaid slice. Tests: pending 80 Doka loss + upgrade cost 10 from UI 120 / canister 200 ⇒ either `#err` or lock ends at honoured wallet; `cutConfirmed` upgrade is unchanged. Do not change `spellLevelingBaseCost * 2^level`.  
AUTONOMY: IMPLEMENT_HELPER_THEN_UPGRADE_RENAME_SITES  
DEPENDENCIES: Reuse `applyUnpaidDeathPenaltyToWrite`. Share helper with **#391** / 09-25-004 / 09-26-002/004 if those land first — do not concatenate duplicates. Do not clone **#602**.  
REGRESSION_RISK: MEDIUM — must not double-tax after death cut confirmed; unseeded placeholder must still fetch.  
VALIDATION_REQUIRED: Helper tests; playtest upgrade after failed death persist.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-28-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Shield Charm absorbs enemy/boss drain HP but the caster still heals the catalog healAmount  
CATEGORY: healing + damage + statuses + challenges + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: BuffShop copy is “Absorbs next 20 damage” (`WorldExploration.tsx` 3583–3585, `shieldHpRef`). Absorb runs in `playerTakesDamage` (3424–3467) and **returns residual `dmg`** (3467). Enemy drain (`spellType === "drain" && chosenSpell.healAmount`, 16626–16637) then `hpAfterHeal`s the caster by the catalog `healAmount` (Life Drain 5, Drain Courage 9) with **no** `actualDmg` term. A fully absorbed hit (`actualDmg === 0`) still heals the enemy; death check correctly uses residual (`16580`). Boss kit drain duplicates the same catalog heal (`15860–15880`) after `playerTakesDamage`. Challenge totals only record residual HP (`3446–3450`), so Untouchable can stay true while the attacker is topped up. Distinct from 09-27-002 (lava/spikes/Thorned/rift/Mirror Field write HP **raw** — those never enter `playerTakesDamage`). Distinct from 09-23-004 (Iron Curse heal ×0.5 never applied). Distinct from player Life Drain `healUsed` (closed). No test asserts shield 20 + Life Drain 10 ⇒ enemy HP unchanged.  
EXPECTED_INTERACTION: Drain lifesteal heals the caster for HP actually lost after Shield Charm (and RES), or 0 when the charm soaks the hit. Copy that says “absorbs next 20 damage” must cover drain hits the same way it covers Strike.  
ACTUAL_INTERACTION: Player HP and challenge totals honour the charm; the enemy/boss still gains full `healAmount`.  
SYSTEMS_AFFECTED: Shield Charm, enemy drain, boss kit drain, healing, challenges (Untouchable), player feedback  
RECOMMENDED_ACTION: Heal the caster with `hpAfterHeal(..., actualDmg > 0 ? chosenSpell.healAmount : 0)` **or** scale heal to residual (`min(healAmount, actualDmg)`). Apply the same term on the boss kit drain branch. Do not change Life Drain catalog numbers. Tests: shield 20 + Life Drain 10 ⇒ player HP 0 change, shield 10 leftover, caster HP unchanged; shield 5 + Drain Courage 9 ⇒ player −4, caster +4 (or +9 only if product keeps catalog-on-partial). Do not fold environmental soak (09-27-002) into this PR unless extracting `absorbShieldThenHp`.  
AUTONOMY: IMPLEMENT_ONE_DRAIN_HEAL_TERM  
DEPENDENCIES: None. Distinct from 09-27-002. Do not clone **#440** player Life Drain HP.  
REGRESSION_RISK: LOW if only residual-gated; MEDIUM if heal is retuned to a percent of damage (would change unshielded Drain Courage).  
VALIDATION_REQUIRED: Helper fixture shield + drain; playtest Shield Charm vs a drain bishop/queen.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-28-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Queen healer AI selects Blood Mend for wounded allies, but range 0 + WX self-only heal never restores them  
CATEGORY: healing + summons + range + AI pathfinding + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Zone ≥ 1 queens get `starter-heal` (`enemyAI.ts` `ENEMY_KITS.queen` 176–178). `inferArchetype` returns `"healer"` when any kit spell has `spellType === "heal"` **or** `healAmount > 0` (447–452). `decideHealer` picks the most-wounded **ally** below 50% (1092–1112) and excludes self (`allies` filter 1674–1676). Blood Mend is `range: 0`, `targetType: "self"` (`spellData.ts` 85–99). Chebyshev to another unit is never ≤ 0 (occupancy forbids stacking), so the in-range cast never returns — the queen only `stepToward` the wounded ally. WX apply heals **only** when `spellType === "heal" && spellRange === 0` and writes the **caster** (`WorldExploration.tsx` 16648–16661); `action.targetId` is ignored. Rallying Cry is `usableByEnemy: false` (`spellData.ts` 432) so the official queen kit cannot substitute a longer heal. Intent log still says `heals ${wounded.name}`. Distinct from Dawn +10 (09-02-006, log-only player heal). Distinct from Wisp player-side `ctx.heal` (closed `healUsed`). Distinct from Iron Curse (09-23-004). AEE catalog noted archetype inference; this is the **consume** join of kit metadata × decide × WX. No `decideHealer` fixture asserts a wounded ally never receives HP.  
EXPECTED_INTERACTION: A kit heal either targets the wounded ally at a legal range and WX writes that id’s store HP, **or** the queen stays a caster (self-heal when wounded, otherwise nuke) and the log does not claim an ally heal. Preview/intent and execute must match.  
ACTUAL_INTERACTION: A wounded pack-mate converts the queen into a walker that never casts; ally HP unchanged; log lies. Healthy packs still fall through to `decideCaster`.  
SYSTEMS_AFFECTED: enemy AI (healer archetype), Blood Mend metadata, WX enemy heal apply, range, player feedback  
RECOMMENDED_ACTION: One of: (a) `decideHealer` self-targets when the only heal is `targetType: "self"` / `range === 0`, and keep the caster fallback when the healer is healthy; (b) give the queen kit an ally heal with range ≥ 1 and WX `updateCombatant(action.targetId, hpAfterHeal)`; (c) stop inferring healer from Blood Mend so queens stay artillery. Do not change Blood Mend 12 HP. Tests: wounded ally + queen with only `starter-heal` ⇒ either ally HP rises or queen `kind: "cast"` on a player-side target / self, never infinite approach. Do not edit RAF.  
AUTONOMY: IMPLEMENT_ONE_SELF_OR_ALLY_HEAL_PATH  
DEPENDENCIES: None. Do not fold Wisp (#550 / #380). Do not clone **#706** leftover-walk player heal origin.  
REGRESSION_RISK: MEDIUM — making queens artillery again changes mid-zone pacing; ally-heal apply must not heal the player.  
VALIDATION_REQUIRED: `decideHealer` + WX apply fixture; playtest two queens / queen+rook with the rook under 50% HP.  
STATUS: NEW  

---

## Focus non-findings / CLOSED (this run — do not invent)

- **Challenge AP / healUsed / damageTaken** asked this pass: player casts (tile / sprite / Attack Nearest / canvas summon) go through `executeCastAttempt`. Wisp / Drain / BuffShop HP potions / in-battle Doka-to-HP `healUsed` CLOSED. Sacrifice / reflect / Burning DoT / plague / lava·spike walk CLOSED. Known skips remain 09-21-003 (Striker AI), 09-02-005 (Pacifist summon; **#714** is kit-cast half only), 09-25-001/002 (Surge). Potion AP grant is not a spend.
- **Death Realm 1.5s:** portal/encounter CLOSED. Shrine/ground/lava after recap dismiss = 09-27-003 / **#554**. Items **#595**, Doka heal **#576**, rename/upgrade **#602**, feat/GameKey **#604**. Do not clone.
- **Reward persist × unpaid death:** absolute heal/Items CLOSED. GameKey / shrine / ground / dungeon / victory / portal / feat claim already filed. This run only adds the **spend** surfaces (002).
- **Spell discovery / observation × battle failure:** no live observe path (`ownedSpells` = starter ∪ catalog). Do not invent.
- **Blood Moon / Mirror Field × summon kits:** still only `resolvePlayerCast`. Announce is flavour — do not invent a summon-kit skip (09-26 / 09-27). Mirror Field × Shield Charm soak remains 09-27-002.
- **Paper Windstorm announce “reach halved” vs 30%/50% miss:** PXA-owned. `MAP_MODIFIER_PAPER_WINDSTORM_RANGE_REDUCTION` is unused in `getEffectiveSpellRange`. Do not re-file.
- **Lifesteal Nova catalog 10-per-hit vs `drainPercent` first target:** single-spell catalog/execute; **#543** owns empty-anchor execute. Not filed as a pair.
- **hitsAllies `__player__` raw HP:** catalog `hitsAllies: false` only — unreachable.
- **Push/pull × hazards:** still unwired (08-31-005 REPORT_ONLY).
- **Gravity Well / Fog of War:** unused `_is*`. Do not re-file.
- **Time Warp:** wired (15s).
- **Summons × portals occupy/path/cleanup:** CLOSED. Spawn-on-lava is 09-27-001. Walk landing is 08-31-002 / 09-01-006 / **#728** helper (do not clone).
- **DoT / plague × last-hostile victory, death × challenge pay, boss phase × minion HP:** CLOSED.
- **Shell Armor × DoT:** unreachable until 09-22-001 larvae latch.
- **Shield Charm × spell/DoT/melee HP:** CLOSED (`playerTakesDamage`). Hole vs drain **heal** is 003; vs environment is 09-27-002.
