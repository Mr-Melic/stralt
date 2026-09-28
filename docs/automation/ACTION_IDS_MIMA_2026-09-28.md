# ACTION_IDs — 2026-09-28 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-*`, `MIMA-2026-09-01-*`, `MIMA-2026-09-02-*`, `MIMA-2026-09-21-*` … `MIMA-2026-09-27-*`). Do not clone in-flight **#327** / **#331** / **#336** / **#370** / **#376** / **#379** / **#380** / **#382** / **#386** / **#389** / **#391** / **#410** / **#443** / **#467** / **#476** / **#487** / **#489** / **#491** / **#495** / **#496** / **#498** / **#508** / **#524** / **#541** / **#543** / **#546** / **#547** / **#550** / **#551** / **#553** / **#554** / **#555** / **#566** / **#576** / **#595** / **#596** / **#597** / **#598** / **#599** / **#601** / **#602** / **#604** / **#606** / **#607** / **#608** / **#617** / **#671** / **#714**.

HEAD is unchanged since the 09-21…09-27 matrices. Focus this run: challenge recording completeness, achievement unlock vs persist, Death Realm 1.5s remaining actions, reward persist × unpaid death, spell discovery.

---

ACTION_ID: MIMA-2026-09-28-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: jackpot_heal unlocks on UI banner before persistAbsoluteProgress commits; heal rollback leaves the feat claimable  
CATEGORY: achievements + rewards + persistence + healing  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Doka-to-HP jackpot path (`WorldExploration.tsx` 18412–18484) applies HP/Doka locally, sets `jackpotHealVisible` (18436–18440), then awaits `persistAbsoluteProgress` (18456–18459). The out-of-battle effect (`2287–2291`) calls `checkAndFireAchievement("jackpot_heal")` whenever the banner is true — that mutates `achievementsShownRef` and `markAchievementUnlocked` before the persist Promise settles. On `#err` / false, `shouldRollbackFailedHeal` restores HP/Doka (`18466–18483`) but never clears `jackpotHealVisible` or rolls back the unlock. Feat catalog reward is 100 Doka (`admin.mo` jackpot_heal row). Distinct from `loot_10_doka` (09-27-004: pickup counter + mapsVisited gate). Distinct from `doka_1000` defer-until-credit. Distinct from 09-25-004 (claim × unpaid death honour).  
EXPECTED_INTERACTION: `jackpot_heal` unlocks only after the heal `saveBattleStats` commits; a rolled-back jackpot must not unlock or stay claimable.  
ACTUAL_INTERACTION: Banner + unlock race the persist; a failed write still leaves Claim available.  
SYSTEMS_AFFECTED: jackpot heal, achievements (`jackpot_heal`), persist lock, HUD heal  
RECOMMENDED_ACTION: Fire `checkAndFireAchievement("jackpot_heal")` only inside `persist.then((ok) => { if (ok) … })` (or clear banner + skip unlock on rollback). Do not change jackpot odds or 1:3 spend. Tests: persist false ⇒ no unlock / banner cleared; persist true ⇒ unlock once.  
AUTONOMY: IMPLEMENT_ONE_WX_JACKPOT_GATE  
DEPENDENCIES: None. Do not fold loot_10 (09-27-004) or unpaid-death claim (09-25-004).  
REGRESSION_RISK: LOW — toast copy can stay optimistic; only the feat unlock must wait.  
VALIDATION_REQUIRED: Unit around jackpot + fake persist false; playtest jackpot with actor reject.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-28-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: upgradeSpell and renameCharacter debit the uncut canister wallet / persist lock without honouring unpaid death 20/40  
CATEGORY: rewards + death + persistence + spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Absolute spends honour unpaid death (`persistAbsoluteProgress` → `applyUnpaidDeathPenaltyToWrite`, `WorldExploration.tsx` 13134–13147). Credits that skip honour are already filed: claim (09-25-004), GameKey (09-02-003 / **#391**), shrine/ground/dungeon and victory/portal `applyRewards` (09-26-002 / 09-26-004). `handleUpgradeSpell` (`3140–3182`) enqueues `persistSpellUpgrade` → canister `upgradeSpell` (spends from `dokaBalances`) then `committedDokaAfterSpellUpgrade` / `shouldCommitSpellUpgradeDoka` — no `readPendingDeathPenaltyAnywhere` / `applyUnpaidDeathPenaltyToWrite` in `spellUpgrade.ts`. `handleRenameCharacter` (`2105–2136`) enqueues `renameCharacter` (−100 on canister) then `committedDokaAfterRename` — same miss in `renameCharacter.ts`. After a failed death persist the UI shows the cut wallet while the canister still holds `preDoka`, so upgrade/rename can buy a durable spell level / name with Doka the 40% cut should have removed; the lock then commits the post-spend query without the unpaid tax. Distinct from **#602** (Death Realm **1.5s timing** gate on the same buttons). Distinct from **#387** (throw-after-debit note). `processPendingPurchases` remains a no-op (`0`) — not a live mint path.  
EXPECTED_INTERACTION: Any persist-lock Doka mutation while unpaid death is pending either applies `applyUnpaidDeathPenaltyToWrite` to the committed snapshot or refuses the spend until the cut lands / clears.  
ACTUAL_INTERACTION: Heal/shop absolute writes honour; upgradeSpell / rename spend the uncut canister and commit without the tax.  
SYSTEMS_AFFECTED: upgradeSpell, renameCharacter, death penalty pending marker, persist lock, spell levels  
RECOMMENDED_ACTION: Before canister debit (or when committing the post-spend wallet), if `readPendingDeathPenaltyAnywhere` is set and not `cutConfirmed`, refuse the spend **or** commit `applyUnpaidDeathPenaltyToWrite(pending, xp, postSpendDoka)`. Prefer refuse while pending so a rename cannot consume the unpaid slice. Tests: pending 80 Doka loss + upgrade cost 10 from UI 120 / canister 200 ⇒ either `#err` or lock ends at honoured wallet; `cutConfirmed` upgrade is unchanged. Do not change upgrade cost formula.  
AUTONOMY: IMPLEMENT_HELPER_THEN_UPGRADE_RENAME_SITES  
DEPENDENCIES: Reuse `applyUnpaidDeathPenaltyToWrite`. Do not clone **#391** / **#602** / 09-25-004.  
REGRESSION_RISK: MEDIUM — must not double-tax after death cut confirmed; unseeded placeholder must still fetch.  
VALIDATION_REQUIRED: Helper tests; playtest upgrade after failed death persist.  
STATUS: NEW  

---

## Focus CLOSED / in-flight (this run — do not invent)

### Challenge recording
- **AP spend / hard_3 / no_ap:** player casts (tile / sprite / Attack Nearest / canvas summon) go through `executeCastAttempt` → `recordChallengeApSpend` (`17162–17173`). Attack Nearest (`17329`) CLOSED. Known Surge 0-AP Timestep gate remains **09-25-001**; summon-kit Surge skip **09-25-002**. Summon-control kit AP is not the player bar (non-finding unless product says otherwise).
- **healUsed:** Wisp / Drain / summon `heal` / BuffShop HP potions / in-battle Doka-to-HP CLOSED (`recordChallengeHealFromHpRestore` / `recordChallengeItemHealUsed` / `recordInBattleChallengeHealUsed`). Overworld Doka-to-HP stays out of battle (`18431–18435`). Non-heal BuffShop (battle_elixir / swift_boots / shield_charm / fury_potion) correctly skip healUsed.
- **damageTaken / Untouchable:** Sacrifice (`9374–9386`), enemy reflect (`9496–9500`, Void Mirror / Reflect Shield), Mirror Field (`9549–9553`), Burning DoT via `playerTakesDamage` (`1957–1960` / `3446–3450`), plague (`14320–14323`), lava/spike walk (`11434–11477`), Thorned/rift walk (`9929–9932`), boss kit / melee CLOSED. Known Pacifist summon damage **09-02-005** (**#714** covers kit casts only). Summon AI Striker **09-21-003**.
- **potion AP:** battle_elixir grants +3 AP (`3576–3578`); it is not an AP spend — hard_3 tracks spend peak, not remaining. Not a recorder skip.

### Death Realm 1.5s remaining actions
- Portal / encounter gates CLOSED (`shouldBlockPortalDuringPendingDeathRealm`, `deathRealmPending`).
- Shrine / ground / lava after recap dismiss = **09-27-003** / **#554** (canvas).
- Items Buy **#595**, Doka heal **#576**, Rename / Spell upgrade **#602**, Feat claim / GameKey **#604** — in-flight; do not re-file.

### Reward persist × unpaid death
- `persistAbsoluteProgress` (heal / Items Buy) CLOSED (honours).
- GameKey / shrine / ground / dungeon / victory / portal / challenge `applyRewards` / feat claim — already filed (09-02-003, 09-26-002, 09-26-004, 09-25-004).
- `processPendingPurchases` no-op returns `0` — dead path, not a new mint skip.

### Spell discovery
- No live observe / watch-enemy-cast unlock path. No discovery × battle-failure join on this HEAD. Do not invent.

### Other non-findings
- hitsAllies `__player__` challenge skip is unreachable (catalog `hitsAllies: false` only).
- Shell Armor × DoT still unreachable until 09-22-001.
- Gravity Well / Fog of War unused `_is*` — do not re-file.
