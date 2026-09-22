# Game Feel ACTION_IDs — 2026-09-22

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-22.md`  
**HEAD:** `0f5363f`

Prior IDs live in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`.  
Do not re-open owned surfaces listed in the companion audit.

---

ACTION_ID: GFCF-2026-09-22-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Route enemy melee through the same IMPACT juice as spell hits  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Enemy spell path calls `playerTakesDamage` (`WorldExploration.tsx` 16566–16593) which spawns a damage float, hit-flash, shake, and `playSound("player_damage")`. The melee / fallback path (`WX` 16749–16788) mutates HP via `setCharacterStats`, optionally logs shield absorb, logs `"strikes you for N dmg"`, and never calls `playerTakesDamage` / `spawnDamageAtTile` / `playSound`. A basic claw hit is quieter than a spell. Distinct from GFCF-003 (`applyDamageToEnemy` is player→enemy) and GFCF-011 (lava/spikes/reflect labels).  
SYSTEMS_AFFECTED: WorldExploration enemy melee branch only  
RECOMMENDED_ACTION: Call `playerTakesDamage(meleeDmg, \`${enemy.pieceType} melee\`)` (or spawn the same float+sound after the existing shield block). Keep shield absorb and family DoT/debuff side effects. Do not change melee damage math.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW–MEDIUM — must keep death bisect (`characterStats.hp - meleeDmg`) consistent with whatever helper writes HP.  
VALIDATION_REQUIRED: Force an adjacent melee hit; one red float + hit sound; HP matches log; lethal melee still opens Game Over.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Announce boss-ability damage and AP drain on the canvas  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Boss ability resolution (`WX` 16025–16045) applies `damageToPlayer` and `playerApModifier` with no `logBattleEntry`, no float, no sound. Shield absorb on this path is also mute. Distinct from 001 (normal enemy melee) and from 011 (reflect/shield on the `playerTakesDamage` path).  
SYSTEMS_AFFECTED: WorldExploration boss-ability apply block  
RECOMMENDED_ACTION: Route `finalDmg > 0` through `playerTakesDamage` (or equivalent float+log). Float `"-N AP"` when `playerApModifier < 0`. Do not change ability formulas.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — presentation on an already-committed ability result.  
VALIDATION_REQUIRED: Trigger a damaging boss ability; float + log match `finalDmg`; AP drain shows a short float; shield full-absorb still says Shield.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Shrine altar needs the same pickup juice as ground Doka  
CATEGORY: combat-feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Altar step (`WX` 11298–11354) claims 300 Doka and may set a 3-map covenant, then `setShrineCompleted(true)` with **no** `logBattleEntry`, toast, `playSound`, or `spawnDoka`. Ground Doka on the same movement tick (`WX` 11396–11420) already plays sound + float + log. Player can finish a shrine room without knowing anything paid. PXA owns covenant honesty; this ID is IMPACT only.  
SYSTEMS_AFFECTED: WorldExploration shrine altar branch  
RECOMMENDED_ACTION: On successful claim, reuse `playSound("doka_collected")` + `spawnDoka` / float `"300"` and one log line (`"Shrine grants 300 Doka"` / covenant line if pure). Do not change the 300 grant or persist lock.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none for juice; PXA for covenant meaning  
REGRESSION_RISK: LOW — presentation after `tryClaimFlag`.  
VALIDATION_REQUIRED: Walk onto altar; one Doka pickup juice; impure path still pays 300 without covenant copy; double-step does not double-mint.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float when Attack Nearest hotkey fires outside Attack mode / with no spell  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `attackNearestEnemy` returns immediately when `battleActionMode !== "attack"` or `!selectedSpellIdRef.current` (`WX` 17219–17224). Footer `canAttackNearest` already requires Attack mode + selected spell (`WX` 18852–18861) and disables the button with a title, but `[S]` (`WX` 17368–17374) still calls the function. Distinct from owned off-turn silence, `no_ap` silence, cooldown float, and no-target footer flash.  
SYSTEMS_AFFECTED: WorldExploration `attackNearestEnemy` early returns only  
RECOMMENDED_ACTION: Float `SELECT_SPELL_COPY` / `"Switch to Attack"` at the player tile (match existing reject copy helpers). Do not enable the button. Do not change targeting.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: `rejectCopy.ts` tokens optional  
REGRESSION_RISK: LOW — copy on already-failing returns.  
VALIDATION_REQUIRED: Walk mode + press S → one float; Attack mode no spell → one float; legal Attack Nearest unchanged.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-005  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Banner Boss Rush room transitions like boss portal entry  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Progression portal advance (`WX` 6095–6110) calls `advanceBossRushRoom` + `spawnBossRushRoom` (`5288–5378`) with no log, toast, or `setBossEncounterBanner`. Boss-colored portal entry already shows `☠️ BOSS ENCOUNTER: …` for 1.5s (`WX` 6496–6504). Room clears feel like a silent map swap. Distinct from phase-2 log-only (009).  
SYSTEMS_AFFECTED: WorldExploration boss-rush portal advance + optional `spawnBossRushRoom`  
RECOMMENDED_ACTION: Reuse `setBossEncounterBanner` with `"Room N — {boss names}"` (or log + short toast). Do not auto-start combat or change portal lock rules.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `bossEncounterBanner` UI  
REGRESSION_RISK: LOW — presentation only.  
VALIDATION_REQUIRED: Clear room 0, step progression portal; one banner/toast; room index advances once.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-006  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Explain in-battle portal tile clicks and victory-persist portal blocks  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: (a) World-mode click on a portal tile during battle returns with no float (`WX` 10580–10586 / touch 11161). (b) `checkPortalInteraction` silently returns while `victoryPersistPendingRef` is set (`WX` 5986–5990). Distinct from Death Realm guard (013) and sealed-progression log (`WX` 6060–6064).  
SYSTEMS_AFFECTED: WorldExploration portal click guard + victory-persist early return  
RECOMMENDED_ACTION: Float `"Not during battle"` / `"Rewards settling…"` once per attempt. Do not change the block.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW — copy only.  
VALIDATION_REQUIRED: In battle click portal tile → one float; during victory persist step on portal → one float; Death Realm guard unchanged.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-007  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Canvas float for player drain heal (and summon lifespan fade)  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Drain restore in `castHelpers.ts` 473–487 logs `"drained N HP"` and bumps HP with no green float (`onPlayerHealed` only flips challenge healUsed). Spell-heal path already has `spawnDamageAtTile(..., "heal")` via the cast runtime; drain skips it. Separately, `expireSummonsAtTurnStart` only logs `"fades away..."` (`summonLifespan.ts` 36) with no canvas float — distinct from owned summon-control walk/kit silence.  
SYSTEMS_AFFECTED: `castHelpers` drain block; optional summon expiry call site in `WX` 14074  
RECOMMENDED_ACTION: Spawn existing heal number for drain; float `"Fades"` (or reuse death puff) on lifespan expiry. Do not change drain % or lifespan rules.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: GFCF-001 screen-space helpers; do not conflate with 011 hazard labels  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Cast a drain spell → green `+N` matches log; summon at 0 turns → one fade float + log.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-008  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Float when Attack / spell-slot clicks are ignored at 0 AP  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: `onSetAttack` only switches when `currentBattleAp > 0` (`WX` 18911–18913). Spell-slot `onSelectSpell` ignores selection in battle when AP is 0 (`WX` 18842–18848). Titles/opacity exist on the Attack button, but the click itself produces no float. Distinct from tile `SELECT_SPELL_COPY` (already shipped for empty Attack-mode canvas clicks).  
SYSTEMS_AFFECTED: WorldExploration BattleUIPanel wiring  
RECOMMENDED_ACTION: Float `"No AP!"` on ignored Attack toggle / spell select. Do not allow selecting spells at 0 AP.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Spend to 0 AP; click Attack and a spell slot; one float each; End Turn still works.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-22-009  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Optional “Your turn” canvas banner (log already exists)  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: MEDIUM  
EVIDENCE: Turn start logs `"Your turn"` (`WX` 14399; battle start 12235–12237). Initiative strip / panel name update. Summon control already gets a top chrome `"Summon's Turn"` (`WX` 18822–18826). No reuse of `bossEncounterBanner` for the player. Easy to miss after a long enemy cycle. Distinct from phase-2 (009).  
SYSTEMS_AFFECTED: WorldExploration player-turn dispatch  
RECOMMENDED_ACTION: Short fade banner `"Your turn"` (≤1s) or pulse the existing strip. Do not pause the timer.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: optional reuse of `bossEncounterBanner`  
REGRESSION_RISK: LOW if short; avoid stacking with summon chrome  
VALIDATION_REQUIRED: End enemy turn → one brief banner; timer still 30s; summon turn still shows Summon's Turn.  
STATUS: NEW

---

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn disabled: `title=` explains summon / wait.  
- Rest portal: toast present.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`.  
- Challenge HUD: panel fail/on-track chrome (`shouldShowChallengeHud`).  
- Summon spawn: puff + SFX + log.
