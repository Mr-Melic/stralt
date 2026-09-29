# Game Feel ACTION_IDs — 2026-09-29

**SOURCE_AUTOMATION:** Game Feel & Combat Feedback Director  
**Companion audit:** `docs/automation/GAME_FEEL_AUDIT_2026-09-29.md`  
**HEAD:** `0f5363f`  
**Run:** `bc-7277b3ed-ed8f-4e09-95e7-f21eef84ed4f`

Prior IDs `GFCF-2026-08-31-001` … `015` live in `ACTION_IDS_2026-08-31.md`.  
`GFCF-2026-09-01-001` … `003` live in `ACTION_IDS_2026-09-01.md`.  
`GFCF-2026-09-02-001` … `005` live in `ACTION_IDS_GFCF_2026-09-02.md`.  
`GFCF-2026-09-21-001` … `004` are **queued in #363** (not on `main`).  
`GFCF-2026-09-21-005` and `GFCF-2026-09-22-001` … `009` are **queued in #419** (not on `main`).  
`GFCF-2026-09-23-001` … `005` are **queued in #478** (not on `main`).  
`GFCF-2026-09-24-001` … `004` are **queued in #523** (not on `main`).  
`GFCF-2026-09-25-001` … `005` are **queued in #571** (not on `main`).  
`GFCF-2026-09-26-001` … `004` are **queued in #610** (not on `main`).  
`GFCF-2026-09-27-001` … `004` are **queued in #678** (not on `main`).  
`GFCF-2026-09-28-001` … `004` are **queued in #735** (not on `main`).  
This file records **new unique** recommendations only. Do not re-open 003–005 / 008 remaining / 009–015 / #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 items as NEW.

No IDs were auto-implemented this run: remaining unique holes require `WorldExploration.tsx` or `BattleUIPanel.tsx`, already owned by older still-open PRs (#327, #363, #419, UX spell-bar siblings).

---

ACTION_ID: GFCF-2026-09-29-001  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Show Shield Charm remaining HP and Fury remaining turns in status chrome  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Shield Charm and Fury Potion write `shieldHpRef` / `furyRef` (`WX` 1588–1591, 3584–3589) and never become `ActiveEffect`s. Canvas pills (`WX` 8240 / 8356) and the inspect-row `StatusEffectBadge` list (`WX` 18342–18354) filter `activeEffects` with `targetId === "player"` — both item buffs are invisible there. Use IMPACT (green/resource float) stays #363 / 09-02-004. Absorb is a battle-log line inside `playerTakesDamage` / melee (`WX` 3433–3438 / 16757–16760) — 011. Fury expiry is log-only (`WX` 14290–14293); 09-28 left that as a non-hole because “HUD ATK is enough,” but ATK is not labeled Fury and remaining turns are not shown. Cleanup zeros both refs (`WX` 11651–11652). `isFuryActive` is only passed into `createPlayerSpellContext` (`WX` 9159) for damage math. Distinct from 012 (duration digits on existing pills). Distinct from 09-25-002 (Mirror activate).  
SYSTEMS_AFFECTED: WorldExploration status chrome (canvas pills and/or `StatusEffectBadge` row); existing refs only  
RECOMMENDED_ACTION: While `shieldHpRef > 0`, show a Shield chip with remaining HP. While `furyRef.turnsLeft > 0`, show a Fury chip with remaining turns (reuse `{turns}t` from `StatusEffectBadge`). Do not convert them into `ActiveEffect` rows if that would double-apply `getStatModifier`. Do not change 20 HP / 1.25× / 3-turn math. Do not add a 1.5s banner. Potion *drink* float stays #363.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: #363 / 09-02-004 for use IMPACT; 012 if the chips share the canvas pill row; 011 for absorb numbers  
REGRESSION_RISK: LOW — presentation of already-committed refs. MEDIUM only if they are pushed through `mergeIncomingEffect` (would enter buff math).  
VALIDATION_REQUIRED: Drink Shield Charm; chip shows 20 and drops after a 7-damage hit to 13; drink Fury; chip shows 3t / 2t / 1t then disappears with the existing wore-off log; inspect row matches; unused items stay off the row. `StatusEffectBadge` / existing potion tests still pass.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-29-002  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Spell-slot AP digit must show live `resolveCastApCost`, not catalog `spell.apCost`  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Execute, Attack Nearest preview, and `canAttackNearest` already debit / gate through `resolveCastApCost` + `applyApCost` (`targeting.ts` 1097–1109; `playerCastPlan.ts`; `WX` 17129–17130, 17245–17246, 18872–18873). Arcane Surge and Arcane Overflow both set `onApCost: max(1, base-1)` (`mapModifiers.ts` 210–217 / 319–324). `BattleUIPanel` still paints `{Number(spell.apCost)} AP` on the title and the slot badge (`BattleUIPanel.tsx` 635 / 812). With 3 AP left under Surge, the slot still says `4AP` while Attack Nearest can legally fire. Distinct from 010 (walk hover Manhattan vs Frozen 2× path). Distinct from 09-22-008 (ignored click at 0 AP). Distinct from #340 (execute gates — keep those; this ID is the digit).  
SYSTEMS_AFFECTED: `BattleUIPanel.tsx` spell-slot title + badge; caller must pass live cost (or a `resolveCastApCost` helper)  
RECOMMENDED_ACTION: Display the same integer `planPlayerCastResources` / `executeCastAttempt` uses. Keep the catalog cost in a tooltip if useful (`4 → 3`). Do not change `onApCost` math. Do not enable the slot at 0 leftover AP.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: existing `resolveCastApCost`; #340 owns the gate — union, do not overwrite  
REGRESSION_RISK: LOW — label only. Unmodified maps must still show catalog cost. Min-1 Surge must not paint `0AP`.  
VALIDATION_REQUIRED: No modifier → slot matches `spell.apCost`. Arcane Surge on a 4-cost spell → slot `3AP`; 3 leftover AP enables Attack Nearest and the slot no longer reads `4AP`; 2 leftover AP still disables. Title string matches the badge. `playerCastPlan` tests unchanged.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-29-003  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: Surface Null Field / Overflow `applyEffectApplication` veto to the player  
CATEGORY: combat-feedback  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyActiveEffect` (`WX` 1874–1885) bails when `mapModifierRegistry.applyEffectApplication` is false. The only line is `logDebugInfo("MODIFIER", \`suppressed: ${effect.type}\`)` — no `logBattleEntry`, no float. Null Field (`mapModifiers.ts` 419–432) vetoes buff/debuff and keeps DoTs. Arcane Overflow (`mapModifiers.ts` 325–332) vetoes non-DoT effects on a 10% roll and `ctx.log`s “makes the spell fizzle” into the **debug** logger, not the battle log. Canvas `"✦ FIZZLED! ✦"` (`WX` 17337–17347) is a different fail path (`castResult === "fizzled"`). Distinct from PXA-002 (whether Overflow’s *announce* should say fizzle vs effect-veto — leave announce to PXA). Distinct from 09-22-003 Windstorm miss (#363).  
SYSTEMS_AFFECTED: WorldExploration `applyActiveEffect` early return only  
RECOMMENDED_ACTION: One battle-log line and one short canvas float (`"Suppressed"` / `"Null Field"` / `"Overflow"`) at the caster or target tile when the veto fires. Keep DoTs applying under Null Field. Do not change the 10% roll. Do not reuse the FIZZLED particle string — that would collide with the real fizzle path. Do not add a 1.5s banner.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: none for the float; PXA owns Overflow announce vs live miss/veto wording  
REGRESSION_RISK: LOW — presentation on an already-failing return. A successful buff must not float. DoT under Null Field must stay quiet on this path.  
VALIDATION_REQUIRED: Null Field + a buff spell: damage (if any) unchanged; no buff pill; one `"Suppressed"` (or Null Field) float + log. Overflow rng-fail: same, not `"✦ FIZZLED! ✦"`. No modifier: existing apply log still fires.  
STATUS: NEW

---

ACTION_ID: GFCF-2026-09-29-004  
SOURCE_AUTOMATION: Game Feel & Combat Feedback Director  
TITLE: One line when Chaos Initiative reshuffles the round  
CATEGORY: combat-feedback  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: When `currentTurnIndexRef` wraps to 0, `advanceTurn` returns `mapModifierRegistry.applyTurnOrderSort(prevOrder, activeMapModifierTypes)` (`WX` 14717–14721). Chaos Initiative (`mapModifiers.ts` 435–457) Fisher-Yates shuffles owners and re-attaches summons. Map Effects already lists the modifier (`MapModifiersPanel` icon `chaos_initiative`). No `logBattleEntry`, no float, no strip pulse. The portraits jump. Distinct from 09-22-009 (optional “Your turn” banner — do not stack a second long banner). Distinct from 09-28-004 (post-leader erratic). Distinct from Time Warp (footer timer already halves — 09-28 non-hole).  
SYSTEMS_AFFECTED: WorldExploration round-wrap `applyTurnOrderSort` only  
RECOMMENDED_ACTION: When the active set includes `chaos_initiative` and the sort actually permutes order, one log line (`"Initiative reshuffled"`) or a ≤0.5s strip pulse. Do not pause the 30s timer. Do not shuffle twice. Do not float on every turn — only the round wrap.  
AUTONOMY: RECOMMEND  
DEPENDENCIES: optional reuse of `bossEncounterBanner` is **not** required (too slow). 09-22-009 stays Your-turn  
REGRESSION_RISK: LOW — presentation. A no-op sort (modifier absent) must stay silent. Summons must still trail owners (existing hook).  
VALIDATION_REQUIRED: Chaos Initiative map: after a full round, strip order can change and one log fires; unmodified maps never log this line; summon still sits after its owner.  
STATUS: NEW

---

## Still open from 2026-08-31 / 09-01 / 09-02 / 09-21 / 09-22 / 09-23 / 09-24 / 09-25 / 09-26 / 09-27 / 09-28 (do not duplicate)

- **GFCF-2026-08-31-003** P0 — `onDamageJuice` on `applyDamageToEnemy` (skip bounce double-count). Highest remaining unique P0. MEDIUM risk — do not auto-implement. Include `__player__` hitsAllies when juicing `hitTarget`.  
- **GFCF-2026-08-31-004** P0 — draw `getHitFlashAlpha` in the existing sprite pass (not RAF).  
- **GFCF-2026-08-31-005** P2 DEFER — hit-stop needs RAF exemption.  
- **GFCF-2026-08-31-008** remaining — recap LEVEL UP chrome (sound shipped; needs a recap flag, not leftover-XP inference).  
- **GFCF-2026-08-31-009** P2 — reuse `bossEncounterBanner` for PHASE 2 / Weeping Pawn promote.  
- **GFCF-2026-08-31-010** P2 — dashed walk-path overlay. Hover MP is still Manhattan. Distinct from 002 (spell-slot AP).  
- **GFCF-2026-08-31-011** P2 — lava / spikes / reflect / shield / DoT source labels. Lava/spikes still sit in the movement RAF. Mirror Field reflect (`WX` 9538–9561) stays here. Shield *absorb number* stays here; Shield *remaining chip* is 001 this ledger.  
- **GFCF-2026-08-31-012** P2 — duration digit on **canvas** status pills (panel already has `{turns}t`). Item-buff chips are 001, not a twin of 012.  
- **GFCF-2026-08-31-013** P2 — “Entering the Death Realm…” for the existing 1.5s wait. #554 is the walk block.  
- **GFCF-2026-08-31-014** P2 — map `triggerVfx("heal")` to flash + existing green number. Drain heal is still log-only.  
- **GFCF-2026-08-31-015** P2 DEFER — no production feel-telemetry.  
- **#363 queue** — GFCF-2026-09-02-002…005 and GFCF-2026-09-21-001…004. Potion *drink* stays 09-02-004.  
- **#419 queue** — GFCF-2026-09-21-005 and GFCF-2026-09-22-001…009.  
- **#478 queue** — GFCF-2026-09-23-001…005.  
- **#523 queue** — GFCF-2026-09-24-001…004.  
- **#571 queue** — GFCF-2026-09-25-001…005.  
- **#610 queue** — GFCF-2026-09-26-001…004.  
- **#678 queue** — GFCF-2026-09-27-001…004.  
- **#735 queue** — GFCF-2026-09-28-001…004.

TBC remains WAITING (#768). Do not invent feel-telemetry (015 / AQA-012).

Mechanic-truth overlaps (do not re-file as GFCF): MIMA-2026-09-21-001 (modifier HP/MP never commits — #443), MIMA-2026-09-21-002 (Dawn +1 MP applied as AP; #376 owns the log lie), MIMA-2026-09-21-004 (control-mode player-spell ring still origins on the wolf). Fog of War / Gravity Well announce-only stubs stay PXA/MIMA. **Invincible / `damageImmune`:** unread on player hits — stay MIMA. **Shell Armor** on the player-spell path is applied — #735 / 09-28-002. **Vampiric Ground** `onDamageDealt` mutates a throwaway `attacker` object in `enemyTakesDamage` (`WX` 3499–3516) — mechanic commit, not a mute heal float (MIMA). **`mirrorRedirect`** never fires — dead-code (09-28). **`_leaderBoostMultiplier`** unread — MIMA. **Arcane Overflow announce vs effect-veto** is PXA; the missing veto *line* is 003 this ledger.

## Explicit non-holes from this search

- Flee: confirm dialogs present.  
- End Turn: `title=` already says leftover AP/MP are lost (`BattleUIPanel.tsx` 553). Do not add a confirm that slows turns.  
- Rest / sanctuary portal: toasts present.  
- Ground Doka: sound + float + log.  
- Map modifiers: log + `MapModifiersPanel`. Time Warp footer timer is enough.  
- Challenge HUD: panel fail/on-track chrome.  
- **Player** summon spawn: puff + SFX + log.  
- Dungeon-chain complete: gold log already names the bonus.  
- Player DoT ticks: already go through `playerTakesDamage`.  
- Leader death: `"LEADER DEFEATED!"` overlay. Erratic *why* is #735 / 09-28-004.  
- Spell fizzle: canvas `"✦ FIZZLED! ✦"` + SFX. Do not reuse that string for Null Field (003).  
- Attack Nearest cooldown: already floats `"On cooldown"`.  
- Hover crit omission: matrix note only (09-28). Do not twin 002 or 004.  
- Barrier fade: tower disappears; leftover `Barrier at ${bKey}` log is ugly but IMPACT exists — still not filed.  
- Barrier place: tower + `Barrier placed at (x,y)` log (`spellEngine.ts` 848–851).  
- Passive overworld +1 HP / 10s: do not float every tick.  
- World-mode wall / void clicks: wall graphic is enough.  
- `comboTextRef` is drawn but never written — dead overlay, not a mute mechanic.  
- `applyDamageToPlayer` unused — dead-code.  
- Enemy AI 5s watchdog: not a player “time’s up” (09-23-003).  
- Jackpot heal: 3s banner already exists.  
- Recap Doka Fever ×2: announce + recap total are enough.  
- Fury *expiry log* alone is not enough INFORMATION — remaining turns are 001; do not twin the wore-off line as a fifth ID.  
