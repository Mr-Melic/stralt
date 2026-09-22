# ACTION_IDs — 2026-09-22 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-22.md`](./PX_COHERENCE_AUDIT_2026-09-22.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md)
- `PXA-2026-09-21-001` … `003` in open draft [PR #343](https://github.com/Mr-Melic/stralt/pull/343) (`ACTION_IDS_PXA_2026-09-21.md`)

**Closed this cycle (do not re-open):**

- `PXA-2026-09-02-002` — accepted challenge HUD. Live gate is `shouldShowChallengeHud` (`challengeHudVisibility.ts`). WX still passes accept-window `visible`; the panel keeps `accepted && hasChallenge`.
- `PXA-2026-08-31-006` display half — Blood bar remains gone (`GameFlow.tsx` 282–290). Session field `bloodBalance` stays inert.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21 audit. New IDs are new *reads* of the same bytes (FAIL stacking, summon 10× tag, challenge HUD hit-testing), plus a pointer at in-flight [#364](https://github.com/Mr-Melic/stralt/pull/364).

---

ACTION_ID: PXA-2026-09-22-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: One miss language — FAIL must not stack with Windstorm as a silent second fizzle  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Player non-physical casts roll FAIL first in `resolvePlayerCast` (`spellEngine.ts` 641–651): `failRoll < ctx.spellFailChance` logs “fizzled” and returns. Chance is `levelUpConfig.spellFailBaseChance - (level-1) * spellFailReductionPerLevel` (`WorldExploration.tsx` 3646–3650), seeded **20.0 / 0.1** (`main.mo` 630–631; `gameTypes.ts` 413–423). Physical Strike is exempt (`if (!isPhysical)`). The world sidebar prints **FAIL** as a sixth combat stat next to CHC/RES (WX 18559–18563). Admin can set the base 0–100 without a map announce (`AdminDashboard.tsx` 4524+). After a successful FAIL check, Paper Windstorm rolls again (`spellEngine.ts` 909–914) via `paperWindstormMiss`: **30% any hit**, no range gate (WX 9563–9572), including physical. Independent stack at level 1: magic on a Windstorm map lands `0.80 × 0.70 = 56%` before RES/SP. Announce is still “ranged spell reach halved” (`mapModifiers.ts` 249–257). Enemy kit casts use a third number (`isPaperWindstorm && spellRange > 1 && Math.random() < 0.5` at WX 16491). Enemy/summon `resolveSpellCast` uses a fourth path: `caster.stats.fail` (spellEngine 427–431), not `spellFailChance`. FAIL is not a turn decision (no AP spend, item, or positioning reduces it except 0.1%/level until ~201). That is arbitrary difficulty plus a mechanic that needs a rule card the Windstorm banner never gives. Dual Windstorm *rates* remain PXA-2026-09-02-003; this ID is FAIL as a **second miss language**. No-cap instruction: do not treat 0% at ~201 as a level cap; do not keep FAIL as a hidden tax while events also miss.  
SYSTEMS_AFFECTED: spells, world events, visual feedback, admin-enabled content, progression, challenges (ranged/Striker contracts on Windstorm maps)  
RECOMMENDED_ACTION: SIMPLIFY to one player-facing miss rule. Recommend: (a) FAIL is the only fizzle — delete player Windstorm miss (and then PXA-2026-09-02-003’s remaining job is announce = FAIL or implement true half-range); or (b) FAIL = 0 in combat, Windstorm is the only miss, and the FAIL row leaves the sheet; or (c) Windstorm *replaces* FAIL for that map (one roll). Physical Strike staying reliable is KEEP if FAIL remains the only miss. Do not add a fourth rate. Do not print FAIL beside CHC unless the player can spend to change it. Enemy `stats.fail` must use the same function as the player once one rule exists. Admin `spellFailBaseChance` must not silently rewrite identity without the same sentence the Map Effects panel uses.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick which miss survives. ORCHESTRATOR_MAY_DRAFT only after that pick (delete one hook + one HUD row + announce string).  
DEPENDENCIES: PXA-2026-09-02-003 (Windstorm one rate/sentence); PXA-2026-09-01-002 (announce = hook); PXA-2026-08-31-008 (slim events). Does not close 003 — 003 is two Windstorm numbers; this is FAIL × Windstorm.  
REGRESSION_RISK: HIGH if FAIL is zeroed while players have learned to spam around 20% (outcomes get easier). HIGH if Windstorm is deleted while FAIL stays 20% and announce still says reach halved. MEDIUM if only the HUD row is removed while the roll stays. Striker / ranged challenges on Windstorm maps change whichever roll is kept.  
VALIDATION_REQUIRED: One function implements “this cast misses.” Player Inferno and Strike on the same Windstorm map use it as designed (Strike either always lands or shares the one rule). FAIL is either on the sheet with that sentence or absent. Admin fail slider either drives that function or is labeled unused. Typecheck clean. Spectate: no double “fizzled” then “blows your spell off course” on one click.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-22-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Summon upgrades must charge the number the spellbook shows  
CATEGORY: shops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Spellbook copy and `upgradeCost` advertise summon upgrades as `SUMMON_UPGRADE_COST_MULTIPLIER * 10 * 2^currentLevel` (`SpellbookModal.tsx` 439–447; `gameConstants.ts` 94–102 → multiplier 10, so 100 Doka at level 0). Canister `upgradeSpell` charges `spellLevelingBaseCost * 2^level` (base 10). Persist already knows the lie: `spellUpgradeUiSpend` / `spellUpgradeCanisterSpend` debit the 10×-smaller canister amount so hydrate does not wipe the gap (`spellUpgrade.ts` 103–125, 132–139; WX 3197 comment). The player is taught “summons are a ten-times mastery sink” while Fireball and Dire Wolf share the real curve. That is overlapping identities and a progression fantasy the wallet does not support. PXA-011 owns buff-catalog drift, not this tag. PXA-002 owns Shield≡Iron Skin, not upgrade prices.  
SYSTEMS_AFFECTED: shops, spells, summons, progression, visual feedback  
RECOMMENDED_ACTION: REWORK to one number. Either (a) charge `100 * 2^level` in `upgradeSpell` for `isSummon` ids (real 10× commitment — needs Motoko + persist lock + recap), or (b) show `10 * 2^level` in the spellbook and delete `SUMMON_UPGRADE_COST_MULTIPLIER` from player copy. Do not keep a UI 10× with a persist shim. Do not invent a second wallet.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick expensive-summons vs honest-tag. ORCHESTRATOR_MAY_DRAFT (b) copy-only (SpellbookModal + constants + tests) if design keeps the canister curve. (a) is HUMAN_APPROVE (actor + persist).  
DEPENDENCIES: PXA-2026-08-31-011 (shop authority); PXA-2026-08-31-002 (clone merge should happen before a summon-only surcharge table). Does not require PXA-001 (even a gifted book should not lie about the sink).  
REGRESSION_RISK: HIGH if (a) ships without migrating players mid-upgrade (sticker shock + Doka drain). LOW if (b) only changes the displayed cost. MEDIUM if the persist shim is removed before the UI matches (returns the hydrate wipe AGENTS.md already documents).  
VALIDATION_REQUIRED: Spellbook line for Dire Wolf at level 0 equals the Doka deducted on a successful `upgradeSpell`. Recap/HUD wallet matches canister. `spellUpgradeUiSpend` either becomes identity (advertised === charged) or is deleted. `pnpm typecheck`. Play: upgrade wolf, then Fireball; the ratio is the designed 1× or 10×, not 1× charged / 10× shown.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-22-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Accepted challenge HUD must not steal map targeting clicks  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: #332 / `shouldShowChallengeHud` (`challengeHudVisibility.ts` 15–23) correctly keeps an accepted contract after the first AP/MP spend. `ChallengePanel` default pos is `x = innerWidth - 260`, `y = 300`, width 240 (`ChallengePanel.tsx` 64–70). The wrapper is `position: fixed; zIndex: 1200` with `onMouseDown` on the **entire** panel (195–210). World canvas is `zIndex: 30` (WX 17861–17870). Sequence: accept → first action (HUD stays) → click a hostile under the panel → canvas never sees the event. On a ~390px viewport the default overlay covers almost the field. Mastery that blocks the board it is measuring is not mastery. Offer shaping remains PXA-009. Visibility remains KEEP (do not re-hide after first action). Open draft [#364](https://github.com/Mr-Melic/stralt/pull/364) already implements click-through after accept (`pointer-events: none` on the wrapper; fold/offer still capture). This ID is the PX ledger so 003 is not re-discovered as a “hide the HUD” revert.  
SYSTEMS_AFFECTED: challenges, visual feedback  
RECOMMENDED_ACTION: SIMPLIFY hit-testing. Land #364 or equivalent: after `accepted`, the tracker is click-through except fold / explicit chrome; Accept/Decline still capture during the offer window. Do not set `visible=false` on an accepted contract. Do not drop the panel into the battle log only. Do not change `DEFAULT_CHALLENGES` in this ID.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT only if #364 is closed without merge; otherwise prefer #364. HUMAN_DESIGN_REQUIRED to move the default anchor off the board (e.g. under the leftover-XP bar) instead of click-through.  
DEPENDENCIES: PXA-2026-09-02-002 (HUD KEEP — done). PXA-2026-08-31-009 (offer). Does not block 009. Do not restack a third `ChallengePanel.tsx` pointer-events PR while #364 is open.  
REGRESSION_RISK: LOW for pointer-events none after accept (persist uses refs, not clicks on the panel). MEDIUM if `pointer-events: none` is applied during the offer window (Accept/Decline die). MEDIUM if a later change treats `visible=false` as decline.  
VALIDATION_REQUIRED: Accept Untouchable, spend 2 AP: panel still shows “Damage taken: N”; a tile under the default overlay selects/casts. Decline then walk: offer gone, no persist credit. Fold still toggles. `pnpm typecheck`. Opening-turn Blitz count unchanged.  
STATUS: NEW
