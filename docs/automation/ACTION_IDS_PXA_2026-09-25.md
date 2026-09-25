# ACTION_IDs — 2026-09-25 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-25.md`](./PX_COHERENCE_AUDIT_2026-09-25.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD done)
- `PXA-2026-09-21-001` … `003` in open draft [PR #343](https://github.com/Mr-Melic/stralt/pull/343)
- `PXA-2026-09-22-001` … `003` in open draft [PR #393](https://github.com/Mr-Melic/stralt/pull/393)
- `PXA-2026-09-23-001` … `003` in open draft [PR #481](https://github.com/Mr-Melic/stralt/pull/481)
- `PXA-2026-09-24-001` … `003` in open draft [PR #529](https://github.com/Mr-Melic/stralt/pull/529)

**Closed this cycle (do not re-open):**

- `PXA-2026-09-02-002` — accepted challenge HUD. Live gate is `shouldShowChallengeHud`.
- `PXA-2026-08-31-006` display half — Blood bar remains gone.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…09-24 audits. New IDs are new *reads* of the same bytes (hidden victory-Doka lottery vs recap; recap erases challenge names; silent `maxSpellRange` 5).

---

ACTION_ID: PXA-2026-09-25-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Victory Doka must be a readable grant, not a hidden multiplier lottery  
CATEGORY: rewards  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: After a win, `handleBattleEnd` rolls a per-enemy multiplier (`WorldExploration.tsx` 12379–12414): `roll < 0.0001` → `1..1_000_000_000` (comment says “0.0001%”; the comparison is a **0.01%** band), then 0.0005 / 0.005 / 0.015 / 0.045 / 0.095 bands, else 90% `1..3`. Grant is `enemy.level * multiplier`, then Doka Fever `onRewardMultiplier` (12420–12427), dungeon `chainMult` 1.5–4× (12428–12441), and `clampApplyRewardsDeltas` to 100_000. Recap is shown **before** persist and sets `dokaBreakdown: []` (12468) even though `PostBattleRecap.tsx` 494–532 already renders per-enemy lines when the array is non-empty. `resolveBattleRewards` also returns `dokaBreakdown: []` (`rewardResolver.ts` 222). The player sees one Doka number with no band, no Fever line, and no decision. That answers none of the four PX questions: not a tactic, not mastery, not a readable fantasy, not counterplay. LHIPS / WDEAD / BAL already own the 1e9 **clamp and expected value**. PXA-004 owns threat-scaling the *shape*. This ID is the identity read: the primary wallet faucet is a slot machine the recap refuses to explain. Silent Boost ×1.5 on **XP** stays 09-23-001. Do not treat the 100_000 clamp as a level cap.  
SYSTEMS_AFFECTED: rewards, progression, visual feedback, dungeons (chain mult), world events (Doka Fever), shops (GameKey vs lottery EV)  
RECOMMENDED_ACTION: REWORK. Pick one: (a) replace the seven bands with a single threat-scaled function of enemy level / pack / modifier (same family as PXA-004) and print that function on the recap; or (b) keep a named jackpot **as a rare, announced event** (Map Effects / recap line “Jackpot ×N”) with a published table, and pass the live `dokaBreakdown` into the recap instead of `[]`. Delete the 1e9 band either way. Do not add a second wallet. Do not hide Fever / chain / clamp behind one unlabeled total.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick (a) vs named jackpot. ORCHESTRATOR_MAY_DRAFT (b)’s recap wiring only (stop zeroing `dokaBreakdown`; print Fever/chain if those multipliers fired) after design picks the table.  
DEPENDENCIES: PXA-2026-08-31-004 (threat-scale). LHIPS-001 / WDEAD jackpot clamp (do not re-file the 100k ceiling). PXA-2026-09-23-001 (XP 1.5 is a different silent factor). Does not close 004.  
REGRESSION_RISK: HIGH if the 0.01% band is removed without a recap/HUD explanation (mean Doka drops). LOW if only `dokaBreakdown` is filled with the numbers already computed. MEDIUM if Fever/chain are printed while the 1e9 band stays (teaches the slot machine).  
VALIDATION_REQUIRED: Recap Doka equals persist `dokaDelta`. If a per-enemy line exists, it sums to the pre-clamp total and names ×N. Spectate 20 victories at level 3: the player can state the rule. `pnpm typecheck`. No RAF / mapGen.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-25-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Recap must name the challenge that paid, or stop claiming a challenge line  
CATEGORY: challenges  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Every fight still assigns one of 9 contracts at random (`WorldExploration.tsx` 12210–12218; `challengeCompletion.ts` 44–107), including legendary Untouchable 1000 XP. The HUD can show the live contract after accept (`shouldShowChallengeHud`). On victory, `_completedChallengeName` is computed from `liveChallenge?.description || liveChallenge?.id` and then discarded. `finalRecapData.completedChallenges` is `challengeCompleted ? ["Battle Challenge"] : []` (WX 12469). `PostBattleRecap` declares `completedChallenges`, `dokaFromChallenges`, and `dokaFromVictory` (`PostBattleRecap.tsx` 16–18) and **never reads them** — only feats render, under “Achievements Unlocked” (541). Boss Rush persist maps real names (`WX` 12787) onto a payload the same panel ignores. Persist still uses `challengePersistEntries` (12531) so the wallet can be correct while the card is mute. Mastery that cannot be pointed at on the recap is not mastery. Offer shaping (random legendary, feat overlap) remains PXA-009. HUD visibility remains KEEP.  
SYSTEMS_AFFECTED: challenges, rewards, visual feedback, terminology, achievements  
RECOMMENDED_ACTION: SIMPLIFY the recap. Pass the live contract `description` (or badge: Untouchable / Blitz / Striker) and `dokaFromChallenges` / `xp` into `PostBattleRecap` and render one named row when `challengePersistEntries.length > 0`. Delete the dummy `"Battle Challenge"` string. Do not change `DEFAULT_CHALLENGES` or persist predicates in this ID. Feats vs Achievements copy remains PXA-012.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (wire the existing fields + one RecapSection; drop the dummy array). HUMAN_DESIGN_REQUIRED only if the recap should hide challenges entirely (then stop sending the field).  
DEPENDENCIES: PXA-2026-08-31-009 (offer). PXA-2026-09-25-001 (do not invent a second Doka total while the lottery is unlabeled). Does not block 009. Does not require #364.  
REGRESSION_RISK: LOW — persist already uses refs / `challengePersistEntries`, not the recap string. MEDIUM if a later change treats a missing recap row as “do not persist.”  
VALIDATION_REQUIRED: Accept Untouchable, succeed: recap shows “Win without taking any damage” (or “Untouchable”) and the challenge Doka/XP that `applyRewards` received. Decline: no challenge row. Boss Rush room-clear uses the same sentence. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-25-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Spell reach may not silently stop at 5 on a no-cap game  
CATEGORY: progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `getEffectiveSpellRange` (`WorldExploration.tsx` 3653–3664) is `min(base + floor(level / spellRangeGrowthLevels) + modBonus, maxSpellRange)`. Defaults: `spellRangeGrowthLevels = 10`, `maxSpellRange = 5` (`gameTypes.ts` 411–424; canister seed `main.mo` 628–630; admin form `AdminDashboard.tsx` 4475–4479). AdminGuard allows 1–20 (`adminGuard.mo` 201–202; `adminSafety.ts` 513–514) with no player-facing announce. `levelUpConfig` is read once from `pbv_levelup_config` at mount (WX 2307–2315) — a live admin save rewrites FAIL, HP%, AP/MP cadence, **and** this ceiling without a changelog (`APP_VERSION` popup is unrelated). A range-3 starter stops growing at level 20; Strike (range 1) stops at 5 on level 40. Kits are already stuck at zone 0 (EBA-013 / PXA-013). Reach was the one book-side axis that still taught a new read as level rose. A silent 5 is a finite endgame on positioning, which this audit must not assume. AFDA-011 owns “do not treat fail-at-200 / region max as a career cap.” This ID is the **reach** ceiling as a PX rule. Do not add a level cap to “fix” it.  
SYSTEMS_AFFECTED: spells, progression, admin-enabled content, visual feedback  
RECOMMENDED_ACTION: EXPAND or announce. Pick one: (a) lift or remove `maxSpellRange` so `+1 / 10 levels` keeps teaching at 50 / 80 / 200 (admin max 20 is still a ceiling — publish it or raise the guard); or (b) keep a ceiling and print it on the sheet / Map-less “Rules” line (“Reach cap 5”) so positioning mastery is a known rule, not a surprise. Do not hide the cap inside admin-only LevelUp. Do not grow range every level (information overload). Targeting metadata stays explicit.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick lift vs named cap. ORCHESTRATOR_MAY_DRAFT (b) copy-only (one sheet row bound to `levelUpConfig.maxSpellRange`) if design keeps 5. (a) is HUMAN_APPROVE if the canister default changes.  
DEPENDENCIES: PXA-2026-08-31-015 (admin targeting schema). PXA-2026-09-22-001 (FAIL slider is a sibling silent LevelUp knob — do not twin FAIL here). EBA-013 does not block this.  
REGRESSION_RISK: HIGH if the cap is lifted without a pass on LoS / AP (long Inferno at level 80). LOW if only the sheet prints the existing 5. MEDIUM if admin 20 ships with no player sentence. Do not edit `targeting.ts` heuristics.  
VALIDATION_REQUIRED: A player can state the reach rule at level 1 and level 40. Spectate a range-3 spell at level 25: either range is 5 and the sheet says cap 5, or range is 5 and the designed lift is documented. Admin save of `maxSpellRange` matches the next session’s sheet. `pnpm typecheck`. No mapGen.  
STATUS: NEW
