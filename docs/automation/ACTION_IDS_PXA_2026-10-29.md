# ACTION_IDs — 2026-10-29 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-29.md`](./PX_COHERENCE_AUDIT_2026-10-29.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide is done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD is done)
- `PXA-2026-09-21-001` … `003` (PR **#343**)
- `PXA-2026-09-22-001` … `003` (PR **#393** — FAIL×Windstorm, summon 10× tag, challenge HUD clicks)
- `PXA-2026-09-23-001` … `003` (PR **#481** — silent Boost ×1.5, HP pots vs 1:3, idle regen)
- `PXA-2026-09-24-001` … `003` (PR **#529** — Board kills, betrayal 6×, portal-verb overload)
- `PXA-2026-09-25-001` … `003` (PR **#579** — hidden Doka lottery, recap challenge name, `maxSpellRange` 5)
- `PXA-2026-09-26-001` … `003` (PR **#632** — flat challenge predicates, one-sided map events **including Vampiric throwaway**, player sheet SR)
- `PXA-2026-09-27-001` … `003` (PR **#691** — unread AP/MP/HP cadence, Inferno silent CD, hit-log SP vs math SR). Inferno copy is also queued in **#696** — do not twin.
- `PXA-2026-09-28-001` … `003` (PR **#744** — leader crown inverse, default-bar / default-win feats, post-mod float)
- `PXA-2026-09-29-001` … `003` (PR **#784** — hardcoded 1.03 vs admin spell-dmg %; Rest/Sanctuary hub with no rest; named-event lava/ice/spike painter)
- `PXA-2026-10-21-001` … `003` (PR **#844** — three fire DoT names; Windstorm miss starts Inferno CD; forge AP 10 / MP 5 vs battle 8 / 4)
- `PXA-2026-10-22-001` … `003` (PR **#907** — `res_sp` unread + drain healAmount vs 50%-once; Barrier 2 vs 3; three MP-slow names)
- `PXA-2026-10-23-001` … `003` (PR **#955** — Weaken `dmg` / Cursed Wound `healRecv` unread on the pack; Shield RES skips Crush while Charm fights it; four reflect rates)
- `PXA-2026-10-24-001` … `003` (PR **#1008** — player SP inbound on enemy spells + RES twice; `easy_1` “healing spells” vs any restore; Iron Skin/Haste/Enrage “own” vs ally)
- `PXA-2026-10-25-001` … `003` (PR **#1067** — gifted `hitsMultiple` vs cards; Haste +2 unread on restore / summon budget; turn-limit HUD never Failed)
- `PXA-2026-10-26-001` … `007` (PR **#1144** — Bomber card/kit/1 AP; dungeon recap Depth 1/?; hard_3 HUD omits peak AP; Mirror dead self-arm; Mark empty no-op; Strike FAIL unnamed; Wisp healer 2 AP vs 3–4 AP kit)
- `PXA-2026-10-27-001` … `005` (PR **#1175** — Timestep shield early-return; Sacrifice empty HP tax; overworld recap omits challenge Doka; easy_1/hard_1 HUD omits healUsed; Striker Yes at 0 attempts)
- `PXA-2026-10-28-001` … `003` (PR **#1246** — Mark ×2 only in computeDamage; legendary Badge never granted; empty Strike/DoT/debuff `"cast"` + Inferno empty CD)

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-28 audits. New IDs are new *reads* of the same bytes.

**Do not twin** 10-27-003 (overworld recap **omits** challenge Doka persist pays; this run is feat Doka **printed** before Claim). Do not twin 10-28-002 (legendary Badge never granted). Do not twin 09-25-002 (dummy `"Battle Challenge"` recap name). Do not twin PXA-009 (offer / pacifist). Do not twin PXA-012 (Feats vs Achievements **word** — toast/recap still say Achievement; this ID is the unclaimed gold number). Do not twin PXA-004 (flat feat size). Do not twin 10-26-001 (Bomber Inferno 5 vs 1 AP — identity explode). Do not twin 10-26-007 (Wisp 3–4 AP heals vs 2 AP / no champion restore). Do not twin 09-22-002 (summon upgrade **10× price** vs `upgradeSpell` charge). Do not twin 10-24-003 (Iron Skin “own” vs ally). Do not twin PXA-002 Shield ≡ Iron Skin MERGE. Do not twin 10-21-003 (forge AP 10 / MP 5 vs battle 8 / 4). Do not twin SDEG (victory HP/AP/MP floor). Do not flatten death 20/40.

**KEEP this run:** Death Realm quiet map + 20/40 + half linear-orb HP; BuffShop elixir/boots/charm/fury; Attack Nearest on the selected spell (player tile); dungeon **live** HUD depth; Untouchable/Striker fail chips; Enrage +40% / duration 2 write **and** player `computeDamage` `"dmg"` read; Poison≡Venom numbers (MERGE under PXA-002 only); Swap hostile-only / no LoS / empty AP-burn; Drain empty abort; Archer kit fully spendable; Wolf Strike / Sentinel Shield spendable (second verbs are **002**); accepted challenge HUD visibility (`shouldShowChallengeHud`); Time Warp 15s.

---

ACTION_ID: PXA-2026-10-29-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Unlock chrome prints feat Doka as granted — wallet waits on Feats Claim  
CATEGORY: achievements  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `checkAndFireAchievement` (`src/frontend/src/components/WorldExploration.tsx` 2217–2244) calls `markAchievementUnlocked.mutate(cfg.id)` and, in battle, `appendRecapUnlock`. Motoko `markAchievementUnlocked` (`src/backend/main.mo` 2462–2511) writes `claimed = false` and returns `#ok` with **no Nat**. `claimAchievementReward` (2514–2517) is the wallet writer: “adds dokaReward to the caller’s dokaBalances”. Feats panel is the only Claim control (`AchievementsPanel.tsx` 360–380; success toast `Claimed N Doka!` at 113). Before that click, two surfaces already print gold `+Doka` in the same language as persist-paid battle Doka: `AchievementToast.tsx` 148–166 (`+{dokaReward}` / “Doka”, header “Achievement Unlocked!”) and `PostBattleRecap.tsx` 539–597 (`+{ach.dokaReward} Doka` under “Achievements Unlocked”, beside recap `+{dokaEarned} Doka` at 443). Recap Continue is `onClose` only (605–609) — no claim. 10-27-003 is the **opposite** recap lie (challenge Doka omitted while persist pays). 10-28-002 is legendary `rewards.badge` never granted (no feat, no Claim). 09-25-002 is dummy `"Battle Challenge"`. PXA-012 is Feats vs Achievements **word**. PXA-009 is offer / pacifist overlap. PXA-004 is flat grant size.  
SYSTEMS_AFFECTED: achievements (unlock vs claim), rewards (recap gold vs persist), visual feedback (toast + PostBattleRecap feat chips), terminology (Achievement vs Feats — sibling PXA-012)  
RECOMMENDED_ACTION: REWORK to one receipt. Recommend: recap/toast print **Unlocked — Claim in Feats** (no gold `+Doka` until Claim) **or** auto-claim through the persist lock on unlock (`claimAchievementReward` after `markAchievementUnlocked`, then recap `dokaEarned` includes the grant). Do not mint on the client. Do not hide the recap unlock list. Do not rename Feats here (PXA-012). Do not grant legendary Badges here (10-28-002). Do not add challenge Doka to overworld recap here (10-27-003).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT copy-only (drop gold `+Doka` on toast/recap until claimed, add “Claim in Feats”). HUMAN_DESIGN_REQUIRED to auto-claim through persist / attach the grant onto recap `dokaEarned`.  
DEPENDENCIES: PXA-2026-10-27-003 (challenge Doka recap — opposite direction; do not close). PXA-2026-10-28-002 (Badge — orthogonal). PXA-2026-09-25-002 (dummy recap name). PXA-2026-08-31-012 (Feats vs Achievements word). PXA-2026-08-31-009 (offer / pacifist). PXA-2026-08-31-004 (scale feat grants — do not pick the number here). Does not close those.  
REGRESSION_RISK: LOW if only copy changes (wallet already waits on Claim). HIGH if auto-claim skips the persist lock or double-credits with the Claim button. Do not grant wallet/level feats against the pre-credit snapshot (`shouldDeferAchievementUnlockUntilRewardsPersist`).  
VALIDATION_REQUIRED: Win first battle: recap shows First Blood **without** adding 50 to `dokaEarned` **or** `dokaEarned` includes 50 and Feats shows Claimed. Toast in world (Explorer / loot) does not imply the HUD Doka already moved until Claim **or** the HUD moved through persist. Decline Claim: wallet unchanged if copy-only. Dummy `"Battle Challenge"` unchanged. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-29-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Wolf Venom and Sentinel Iron Skin stay grey at spawn AP — kit unlock is silent upgrade 3  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Comment identity (`src/frontend/src/data/gameConstants.ts` 31–32): hunter “casts venom strike”; guardian “casts shield / iron skin”. Live kits (`spellData.ts`): Wolf `summonKit: ["physical_attack", "spell-venom-strike"]`, `ap: 2` (564–565); Venom `apCost: 3` (399). Sentinel `summonKit: ["starter-shield", "spell-iron-skin"]`, `ap: 2` (593–595); Iron Skin `apCost: 3` (295). `getSummonBaseStats` is `unitDef.ap + floor(spellLevel / SUMMON_AP_PER_LEVELS)` with `SUMMON_AP_PER_LEVELS = 3` (`progression.ts` 229–232; `gameConstants.ts` 100) — Venom / Iron Skin become payable at summon **spell level 3**. `SummonControlPanel.tsx` 343 greys `currentAp < spell.apCost` (aria “insufficient AP”) every spawn because **maxAp is also 2**. Spellbook chips print current AP and a title “+1 every 3 levels” (`SpellbookModal.tsx` 321–334) but kit rows print only name + description, **no AP** (380–429). Upgrade expander still prints `DMG: {currentDmg} → {nextDmg}` (1119–1126) via `leveledDamage(Number(spell.damage), level)` which is **0 → 0** for summons. Archer Poison+Slow at 2 AP stay KEEP. Bomber Inferno 5 vs 1 AP (needs level 12) stays 10-26-001. Wisp Blood Mend 3 / Rally 4 vs 2 AP stays 10-26-007. Summon 10× **Doka price** vs `upgradeSpell` stays 09-22-002. Sentinel portrait `golem` stays PXA-012. Iron Skin “own” vs ally stays 10-24-003.  
SYSTEMS_AFFECTED: spells (Summon Dire Wolf, Summon Sentinel), visual feedback (SummonControlPanel grey slots; Spellbook kit + upgrade expander), progression (summon spell level as kit unlock), shops (upgrade sink — price stays 09-22-002)  
RECOMMENDED_ACTION: SIMPLIFY the gate so it is a decision. Recommend **one** of: (a) print kit AP on the Spellbook row and “Venom at upgrade 3 (3 AP)” / “Iron Skin at upgrade 3”; upgrade expander shows next **HP/AP/MP/lifespan**, not DMG 0→0; (b) hide kit ids the unit cannot pay at **current maxAp**; (c) spawn Wolf/Sentinel at AP 3 so the advertised second verb is a spawn verb. Do not change Bomber explode (10-26-001) or Wisp champion heal (10-26-007) in this ID. Do not change the 10× price (09-22-002). Do not merge Shield ≡ Iron Skin here (PXA-002).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (a) kit AP + upgrade expander copy/stats, or (b) filter kit ids by current maxAp, plus tests: level-0 Wolf greys or hides Venom; level-3 Wolf can pay Venom; Archer both slots stay live at level 0; Bomber/Wisp still 10-26. HUMAN_DESIGN_REQUIRED for (c) raising spawn AP.  
DEPENDENCIES: PXA-2026-10-26-001 (Bomber — do not close by greying Venom). PXA-2026-10-26-007 (Wisp — do not close). PXA-2026-09-22-002 (10× price — orthogonal). PXA-2026-10-24-003 (Iron Skin “own”). PXA-2026-08-31-002 (Shield ≡ Iron Skin MERGE — do not pick the survivor here). PXA-012 (Sentinel `golem`). Does not close those.  
REGRESSION_RISK: LOW if only copy / hide-uncastable-ids (spawn kits still have Strike/Shield). MEDIUM if spawn AP rises to 3 (Wolf/Sentinel get a real second press per turn). Do not restack RAF / mapGen. Do not give Bomber 5 AP in this ID.  
VALIDATION_REQUIRED: Summon level-0 Wolf: panel Strike live, Venom grey **or** hidden **or** copy names upgrade 3. Upgrade Wolf to 3: Venom payable, chips show 3 AP. Level-0 Sentinel: Shield live, Iron Skin gated the same way. Level-0 Archer: Poison and Slow live. Spellbook upgrade expander for a summon does not read as 0→0 damage **or** the chips/kit row carry the gate. Bomber/Wisp unchanged. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-29-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Death copy is half HP + 20/40 — respawn also stamps AP 4 / MP 3 on the overworld orbs  
CATEGORY: death  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Player copy (`GameOverModal.tsx` 52–80): Death Realm is a quiet map, −XP 20%, −Doka 40%, “You revive at half health.” HP matches: `respawnHpAfterDeath` is 50% of the linear orb `100 * (1 + (level-1) * 0.05)` (`deathPenalty.ts` 131–140), same formula as HUD `maxHp` (`WorldExploration.tsx` 3400–3406). `handleRespawn` (`WX` 13610–13616) writes that HP **and** `ap: 4`, `mp: 3`. Out-of-battle side-panel orbs read `characterStats.ap/mp` (18264–18270), so Death Realm shows 4 / 3. Next fight ignores those fields: battle start sets `currentBattleAp/Mp` from `getPlayerBaseStats` 8 / 4 (`WX` 12105–12116; `PLAYER_BASE_AP` 8 in `gameConstants.ts` 131). Overworld walk does not spend MP (`getMpReachableTiles` returns empty when `!inBattle`, `WX` 7037) — the 4 / 3 pair is HUD-only. Comment at 13587 still says “full heal”; the modal does not. Forge stamp 10 / 5 is 10-21-003. Victory floor `ap: 6 + floor(level/20)` is SDEG. Four AP/MP pairs for one resource is information overload; death copy never names AP/MP.  
SYSTEMS_AFFECTED: death (respawn stamp), visual feedback (overworld / Death Realm orbs), progression (AP/MP identity vs battle floor 8/4)  
RECOMMENDED_ACTION: SIMPLIFY to the copy. Recommend: `handleRespawn` writes half-HP only and leaves AP/MP at the battle floor (8/4 via `getPlayerBaseStats`) **or** leaves the persisted values; do not write 4 / 3. Keep 20/40. Keep quiet Death Realm. Do not add enemies. Do not change forge 10/5 here (10-21-003). Do not change victory floor here (SDEG). Fix the 13587 comment if the orchestrator touches this file.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT dropping the `ap: 4` / `mp: 3` assignment (or replacing with `getPlayerBaseStats`) plus a test that respawn HP is still half linear-orb and AP/MP are not 4/3. HUMAN_DESIGN_REQUIRED only if death is meant to tax AP/MP (then the modal must say so).  
DEPENDENCIES: PXA-2026-10-21-003 (forge 10/5 vs battle 8/4 — orthogonal; do not close by deleting 4/3 only). SDEG victory HP/AP/MP floor — do not retouch. PXA-2026-09-27-001 (unread cadence — print 8/4, not 4/3). Death 20/40 KEEP. Does not close 10-21-003.  
REGRESSION_RISK: LOW if only the HUD stamp changes (combat already uses 8/4; overworld does not spend MP). MEDIUM if persist starts writing 4/3 into `saveBattleStats` maxAp/maxMp (death persist currently copies `characterStatsRef` AP/MP at WX 13017–13020 — do not start persisting 4/3 as the new floor). No mapGen / RAF.  
VALIDATION_REQUIRED: Die, Enter Death Realm: HP is half linear-orb; AP/MP orbs are 8/4 **or** the pre-death persisted pair, not 4/3. 20/40 applied. Next fight AP/MP still 8/4 (+ cadence). Forge still 10/5 until 10-21-003. Quiet map, no enemies. `pnpm typecheck`.  
STATUS: NEW
