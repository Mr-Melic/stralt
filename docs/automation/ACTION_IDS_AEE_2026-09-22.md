# ACTION_IDs — 2026-09-22 Advanced Enemy AI Evolution Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source automation: Advanced Enemy AI Evolution Designer (`67b03c2f-a492-11f1-a7d1-d6b4613131ce`).  
Design: [`docs/ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md), [`docs/ENEMY_AI_EVOLUTION_2026-09-21.md`](../ENEMY_AI_EVOLUTION_2026-09-21.md) (open PR #351; SYS-22…32 / FUT-36…47), [`docs/ENEMY_AI_EVOLUTION_2026-09-22.md`](../ENEMY_AI_EVOLUTION_2026-09-22.md).

This run ships **docs only**. Do not implement gameplay from these IDs unless a later human or orchestrator explicitly picks one.

Do **not** re-file AEE-2026-09-21-001…010. Those ids and SYS-22…32 / FUT-36…47 belong to PR #351.

## Still-open IDs (line numbers confirmed 2026-09-22; not re-filed)

| ACTION_ID | Live evidence (2026-09-22) |
| :--- | :--- |
| `AEE-2026-08-31-001` | `computeAITier` `combatMath.ts` 36–52. Spawn WX **5823**. Family second roll WX **5864–5866**. Gates WX **15507** / **15594**. |
| `AEE-2026-08-31-002` | Fire Bolt WX **16710–16715**. Ally heal WX **16648**. `enemyAI.ts` has **zero** `currentAp`/`currentMp`/`apCost` reads. |
| `AEE-2026-09-01-003` | Kit assign WX **11920**. |
| `AEE-2026-09-01-005` | Focus setter 957 / 1539; `scoreTargets` unread; prepend 1682–1690. |
| `AEE-2026-09-01-008` | `pickBossKitSpell` still `new Map()`. |
| `AEE-2026-09-02-002` | Summon occupied empty WX **15156**. |
| `AEE-2026-09-21-002` | Healer Chebyshev-only 1099–1100. |
| `AEE-2026-09-21-004` | `findKitSpell` assigned fallback 1741–1745. |
| `AEE-2026-09-21-006` | Family second `computeAITier` 5864–5866. |

P0 remains **AEE-2026-08-31-002** then **001**. Then 09-21-002 / 004. Then this file’s 001–003. Do not start FUT-52/53 first.

---

ACTION_ID: AEE-2026-09-22-001  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Summon snapshot `allyCount` hardcoded to `side === "player"`  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: WX 15175–15176. `decideSummonAction` 1768–1774 filters by `summon.side`. `allyCount` unused today; TEM modules would invert sides for an enemy-side wolf.  
RECOMMENDED_ACTION: AI-SYS-33. Count same-side living units.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-SUMSIDE  
STATUS: NEW

ACTION_ID: AEE-2026-09-22-002  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Apply range uses React `playerPosition` not `playerPositionRef`  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: WX 16438 `playerPosition` after dest-commit. Pack snapshot player combatant already uses the ref (16293–16302). Summon targets use `resolvedTarget.{x,y}`.  
RECOMMENDED_ACTION: AI-SYS-34. Live tile only; no hidden click intent.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-PREF  
STATUS: NEW

ACTION_ID: AEE-2026-09-22-003  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: `estimateDamage` ignores SP; apply uses SP then RES  
CATEGORY: combat-ai  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `estimateDamage` 490–509 is `calcScaledDamage * enrage`. Apply WX 16475–16537 uses `plSpEff` then RES. 09-21 FUT-44 covers RES/SR via `getEffectiveStat`; it does not name the SP term. Player-side summons have SP 0 (16475–16477). Do not change `calcScaledDamage`.  
RECOMMENDED_ACTION: AI-SYS-35. Completes TGT-05 / 09-21 FUT-44.  
DEPENDENCIES: AEE-2026-09-01-004 (snapshot); AEE-2026-09-21 FUT-44  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-SPEV  
STATUS: NEW

ACTION_ID: AEE-2026-09-22-004  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Drain self-heal EV is invisible to `pickBestDamageSpell`  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Apply heals on `spellType === "drain" && healAmount` (WX 16626–16638). `pickBestDamageSpell` 555–573 requires `damage > 0` and ignores `healAmount`. Heal-first `inferArchetype` must not treat drain as ROL-04.  
RECOMMENDED_ACTION: AI-FUT-48 after SYS-35.  
DEPENDENCIES: AEE-2026-09-22-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-DRAIN  
STATUS: NEW

ACTION_ID: AEE-2026-09-22-005  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Summoner skips the turn on cap/CD instead of falling through to kit  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `decideSummonerAction` 1841–1887 returns `kind: "skip"`. WX 16375 routes `isSummoner` only there. Cap/CD are spawn-rate guards, not “waste the turn.”  
RECOMMENDED_ACTION: AI-FUT-49. Frost/melee fall-through when summon is illegal.  
DEPENDENCIES: AEE-2026-08-31-002 (no Fire Bolt on skip); SYS-14 occupancy for place dest  
REGRESSION_RISK: MEDIUM if fall-through uses an off-kit id  
VALIDATION_REQUIRED: TS-SUMFALL  
STATUS: NEW

ACTION_ID: AEE-2026-09-22-006  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: Pack healer backline comment “prefer the player”; allies are enemy-side  
CATEGORY: combat-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `decideHealer` 1142. Allies filter 1674–1676 is `side === "enemy"`. Guardian already uses `pickBestAlly` (2113–2120).  
RECOMMENDED_ACTION: AI-FUT-50. Ward is enemy-side.  
DEPENDENCIES: None  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: TS-WARD  
STATUS: NEW

ACTION_ID: AEE-2026-09-22-007  
SOURCE_AUTOMATION: Advanced Enemy AI Evolution Designer  
TITLE: T6+ last-player-dest bait and pack spell rotation (after honesty)  
CATEGORY: combat-ai  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: Parent TEM-04 / ADV exist as T3–T4; no public last-dest field; zone-0 kits make rotation a no-op until SYS-09.  
RECOMMENDED_ACTION: AI-FUT-51 (dup DoT), AI-FUT-52 (bait), AI-FUT-53 (rotation). After SYS-05 / SYS-09 / SYS-10.  
DEPENDENCIES: AEE-2026-08-31-002; AEE-2026-09-01-003; AEE-2026-09-01-004  
REGRESSION_RISK: MEDIUM if bait uses hover/click intent  
VALIDATION_REQUIRED: TS-DUP, TS-BAIT, TS-ROTATE  
STATUS: NEW
