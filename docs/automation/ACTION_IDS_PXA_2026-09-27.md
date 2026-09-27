# ACTION_IDs — 2026-09-27 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-27.md`](./PX_COHERENCE_AUDIT_2026-09-27.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide is done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD is done)
- `PXA-2026-09-21-001` … `003` (PR **#343**)
- `PXA-2026-09-22-001` … `003` (PR **#393** — FAIL×Windstorm, summon 10× tag, challenge HUD clicks)
- `PXA-2026-09-23-001` … `003` (PR **#481** — silent Boost ×1.5, HP pots vs 1:3, idle regen)
- `PXA-2026-09-24-001` … `003` (PR **#529** — Board kills, betrayal 6×, portal-verb overload)
- `PXA-2026-09-25-001` … `003` (PR **#579** — hidden Doka lottery, recap challenge name, `maxSpellRange` 5)
- `PXA-2026-09-26-001` … `003` (PR **#632** — flat challenge predicates, one-sided map events, player sheet SR)

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…09-26 audits. New IDs are new *reads* of the same bytes (unread AP/MP/HP cadence; Inferno’s silent cooldown; hit-log SP vs math SR).

---

ACTION_ID: PXA-2026-09-27-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Print the live AP/MP and HP career rules on the player sheet  
CATEGORY: progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: There is no level cap. Battle AP/MP/HP come from `getPlayerBaseStats` (`progression.ts` 59–82): AP/MP start at 8/4 and gain +1 each every `apMpGrowthEveryNLevels` (default 25, `gameTypes.ts` 410–419); HP is `round(100 * (1 + statGrowthPercent/100)^(level-1))` (default 5%). The Statistics grid (`WorldExploration.tsx` 18527–18563) prints SP, SR%, INIT, RES%, CHC%, FAIL% and never “+1 AP/MP / 25 levels” or “HP ×1.05 / level.” `levelUpConfig` is read once from `pbv_levelup_config` at mount (WX 2307–2315) — an admin save rewrites FAIL, range cap, **and this cadence** with no changelog (`APP_VERSION` popup is unrelated). `hard_3` (“Never spend more than 8 AP in any single turn”, `challengeCompletion.ts` 81–86) is a free stamp until that +1 lands (09-26-001 owns the predicate; this ID owns the missing career sentence). Range +1/10 capped at 5 stays 09-25-003. FAIL 0.1%/level stays 09-22-001. Do not treat AP-every-25 as a level cap.  
SYSTEMS_AFFECTED: progression, visual feedback, admin-enabled content, challenges (AP-cap contracts), death (respawn HP uses the same HP curve)  
RECOMMENDED_ACTION: EXPAND the sheet (or a single “Rules” line under leftover XP) with the live `levelUpConfig` cadences: “AP/MP +1 every N levels (next at L…)”; “Max HP +P%/level.” Bind to the same object combat uses. If admin publishes a new N or P, the next session’s sheet must match. Do not hide the knobs only in AdminDashboard. Do not add a level cap. Do not grow AP every level (information overload). PXA-004 still owns threat-scaling the *grant*; this ID is readable career, not more Doka.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT copy-only (one Statistics row bound to `apMpGrowthEveryNLevels` / `statGrowthPercent`). HUMAN_DESIGN_REQUIRED to change the formula or to surface a live-ops toast when admin publishes LevelUpConfig.  
DEPENDENCIES: PXA-2026-09-25-003 (range cap is a sibling unread knob — print it nearby, do not twin the ceiling here). PXA-2026-09-22-001 (FAIL slider). PXA-2026-09-26-001 (do not close 001 by printing cadence; predicates still invert). Does not close LHIPS-001.  
REGRESSION_RISK: LOW for sheet copy. HIGH if the formula is changed without a pass on `hard_3`, orb caps, and `respawnHpAfterDeath`. MEDIUM if admin 1–100 `apMpLevelThreshold` ships with no player sentence.  
VALIDATION_REQUIRED: A player can state when the next AP point arrives at level 1 and level 24. Spectate level 25: AP is 9 and the sheet says +1/25. Admin save of `apMpGrowthEveryNLevels` matches the next session’s sheet. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-27-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Cooldown must be on the card before the first cast, or leave the gifted book  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: AP is the action spend. Cooldown is a second lock. Of 32 innate ids (`spellData.ts` 9–663), only Inferno sets `cooldown: 3` (519). Description is “Intense fire blast — burns target for 8 dmg/turn for 3 turns” (504) — duration of the burn, not the lock. `SpellbookModal.tsx` never mentions cooldown (upgrade copy only). Battle-bar tooltip appends `| CD: ${cdTurns}t` only when `isOnCooldown` (`BattleUIPanel.tsx` 623–637), i.e. **after** the first Inferno, never the configured 3. `nextSpellCooldownTurns` + `spellCooldownsRef` are live (WX 17200–17203, tick 14284–14288). Admin catalog spells may ship any `cooldown` via Candid with the same silent card. That is a third action-economy the gifted book barely uses and never teaches — overlapping identities (Inferno as “the CD spell” without saying so) and a mechanic that needs a rule the book does not give. FAIL/Windstorm miss languages stay 09-22-001 / 09-02-003.  
SYSTEMS_AFFECTED: spells, visual feedback, admin-enabled content, challenges (Striker / Blitz on a CD spell)  
RECOMMENDED_ACTION: SIMPLIFY. Pick one: (a) print configured cooldown on every card that has it (spellbook row, bar tooltip before first cast, e.g. “CD 3t”) and keep Inferno’s 3 as a real identity; or (b) delete Inferno’s `cooldown: 3` so the gifted book has one action spend (AP) until discovery/admin introduces CD as a named rule. Do not leave a live lock that the description calls a burn timer. Do not add CDs to the other 31 starters in this ID (bloat). Admin spells with `cooldown > 0` must use the same sentence the bar uses.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (a) copy-only (description + tooltip using `nextSpellCooldownTurns(spell.cooldown)` even when remaining is 0). HUMAN_DESIGN_REQUIRED to pick (b) or to make CD a kit-wide language.  
DEPENDENCIES: PXA-2026-08-31-002 (clone merge should happen before a CD table). PXA-2026-08-31-015 (admin targeting/cooldown schema). Does not require PXA-001 (even a gifted Inferno should not lie about the lock).  
REGRESSION_RISK: MEDIUM if (b) removes the 3-turn lock (Inferno can be dumped every turn). LOW if only copy is added. HIGH if CD is shown as remaining-0 “CD 0t” on every slot (noise). Do not restack WX cast while open combat PRs own that block.  
VALIDATION_REQUIRED: Spellbook Inferno at level 0 says 3-turn cooldown before any fight. Bar tooltip on an off-CD Inferno still names 3t. First cast then two player turns: slot locked, tooltip remaining matches. A 0-cooldown Strike never prints CD. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-27-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Stop teaching SP as inbound resist — the math uses SR on enemies, SP outbound on the player  
CATEGORY: visual-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Player outbound magic is `1 + SP/100` on non-physical hits (`WorldExploration.tsx` 3320–3322). Enemy inbound spell mitigation is `SR × RES` (`computeDamage` 3351–3363); physical/DoT is RES-only. The live hit log still computes a “SP reduction” from `hitTarget.sp` and prints `-SP` (`castHelpers.ts` 377–389, comment “RES/SP resistance breakdown”). Strike’s player-facing description is “A direct physical attack. Only RES applies (not SP).” (`spellData.ts` 12) — that sentence treats SP as the inbound spell resist the physical path skips, which is **SR**. Statistics still prints player **SR%** as a peer of RES (WX 18534–18538) while `playerTakesDamage` is RES-only (3424–3432) — that inbound sheet lie stays 09-26-003 and is not re-filed. This ID is the **log + Strike card** teaching the outbound multiplier as inbound resist. FAIL as a sheet peer of RES stays 09-22-001. PXA-012 asked for one resist word unless combat actually splits; combat *does* split SR/RES **on enemies**. The log and the signature physical card name the wrong half.  
SYSTEMS_AFFECTED: visual feedback, terminology, spells (Strike card), enemies (log on every kit hit)  
RECOMMENDED_ACTION: SIMPLIFY copy to match `computeDamage`. Log inbound spell cuts as SR (and RES), never SP. Rewrite Strike to “Physical: RES only (no SR, no SP).” Do not rename Candid `sp`/`sr`. Do not hide player SP on the sheet — it is a real outbound. Player SR% hide/implement remains 09-26-003. Do not invent inbound SP.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (log token + Strike description + a unit test that a frost hit’s resist note says SR when `target.sr > 0` and `target.sp` is 0). HUMAN_DESIGN_REQUIRED to collapse SR/RES into one word (that is PXA-012).  
DEPENDENCIES: PXA-2026-08-31-012 (one word per concept). PXA-2026-09-26-003 (player sheet SR — do not close it by fixing the log). Does not block 012.  
REGRESSION_RISK: LOW for log/card copy. MEDIUM if the log is switched to SR while AoE helper objects still omit `sr` (false 0% SR). HIGH if outbound SP is removed from the sheet “to simplify.” Do not change damage math in this ID.  
VALIDATION_REQUIRED: Frost on a bishop with SR>0 and SP=0 logs `-SR`, not `-SP`. Strike tooltip/card does not call SP an inbound resist. Player Statistics still shows SP as a number. A physical Strike still ignores SR. `pnpm typecheck`.  
STATUS: NEW
