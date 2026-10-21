# ACTION_IDs — 2026-10-21 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-21.md`](./PX_COHERENCE_AUDIT_2026-10-21.md)

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

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…09-29 audits. New IDs are new *reads* of the same bytes (three stacking fire DoT names; Windstorm miss starts Inferno cooldown; forge AP 10 / MP 5 vs battle 8 / 4).

---

ACTION_ID: PXA-2026-10-21-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Fire must be one stacking language — Inferno DoT, lava Burning, and Ember burn are the same verb  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same-type DoTs append, they do not replace (`dotStacks.ts` 31–38; `mergeIncomingEffect` routes `type === "dot"` there). The gifted Inferno writes `effectName: \`${spell.name} DoT\`` = “Inferno DoT” at 8/turn for 3 (`spellEngine.ts` 777–807; `spellData.ts` 502–519, `dotType: "burn"`). Stepping on lava writes a **different** name: `effectName: "Burning"`, 3/turn for 3 (player `WorldExploration.tsx` 11443–11453; enemy lava walk 16903–16912, same name). Ember Knight melee writes a **third**: `effectName: "burn"`, 3/turn for 3 (`WX` 16789–16799). An Ember pack on a lava-painted map (09-29-003 still stamps lava from Plague/Void/40% extra) plus one Inferno is 8+3+3 under three badges. The DoT tick log labels the **first** matching `effectName` and ticks the **sum** (`WX` 1943–1991). Enemy Register still teaches Ember “Leaves burning tiles on movement path” (`EnemyRegister.tsx` 48–51) while the engine is a melee DoT named `burn`. That is overlapping spell/event identity, untaught stack mastery, and a Register sentence the 09-01-001 FLAVOR LORE chip does not fix. Poison Arrow vs Venom Strike as 4×3 clones stays PXA-002 — do not merge this into 002 (those are two gifted cards; this is three fire **names** across spell, floor, and family). Lava **painter** stays 09-29-003.  
SYSTEMS_AFFECTED: spells, enemies, world events, visual feedback, challenges (Untouchable / under-damage on Ember+lava maps)  
RECOMMENDED_ACTION: MERGE to one fire verb. Pick (a) every fire DoT uses one `effectName` (recommend `"Burning"`) and one stack language the badge and Inferno card share (“Burning stacks; Inferno is 8, lava/Ember 3”), or (b) they do **not** stack — replace-or-refresh by a shared name so Inferno refreshes lava rather than adding 8. Print the chosen rule on Inferno before the first cast (with 09-27-002’s CD line, not instead of it). Rewrite Ember Register copy to melee Burning, not tiles, as part of 09-01-001 — do not close 001 here. Do not add bleed/poison/venom into this ID. Do not delete Inferno’s 8/3 identity.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (a) rename lava + Ember `effectName` to `"Inferno DoT"` or `"Burning"` plus a unit test that two fire applies share one name; Inferno card one clause on stacking. HUMAN_DESIGN_REQUIRED to pick (b) no-stack or to keep three names as an intentional Ember-vs-spell distinction.  
DEPENDENCIES: PXA-2026-08-31-002 (clone merge is Poison/Venom/heals — not this). PXA-2026-09-01-001 (Register Ember tiles). PXA-2026-09-29-003 (which maps even have lava). PXA-2026-09-27-002 (Inferno CD copy on the same card). Does not close 002, 001, or 003.  
REGRESSION_RISK: MEDIUM if (a) two Inferno casts start collapsing because they share a **non-DoT** replace path (keep `type: "dot"` + `appendDotStack`). HIGH if (b) lava Burning replace-refreshes Inferno 8 down to 3. LOW if only Ember/lava names unify and Inferno stays 8-stack. Do not restack WX lava/ember blocks while open combat PRs own them — extract a `FIRE_DOT_EFFECT_NAME` constant.  
VALIDATION_REQUIRED: Inferno only: one “Inferno DoT” / “Burning” badge at 8. Inferno then lava step: either 11/turn under one name (a) or 8 refreshed (b), never “burn” + “Burning” + “Inferno DoT”. Ember melee on a no-Inferno target: 3/turn, same name as lava. Register Ember line does not say tiles. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-21-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: A miss must not start Inferno’s cooldown unless FAIL does too  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `resolvePlayerCast` documents two attempt endings: `"cast"` deducts AP **and** sets cooldown; `"fizzled"` deducts AP only (`spellEngine.ts` 284–285, 614–615). FAIL (`!isPhysical` then `failRoll < ctx.spellFailChance`) returns `"fizzled"` (641–651). After that check, Mirror Field reflect (901–906) and Paper Windstorm miss (909–914) **return `"cast"`** with no damage. `castResultAppliesCooldown` is `result === "cast" || result === "summon"` (`challengeCompletion.ts` 345–350). `executeCastAttempt` writes `nextSpellCooldownTurns(spell.cooldown)` on that predicate (`WX` 17200–17203). The gifted book’s only `cooldown: 3` is Inferno (`spellData.ts` 519); the card still names the burn duration, not the lock (09-27-002 / #696). Windstorm is already a second miss language (09-22-001) at a second rate (09-02-003, player 30% any-hit at `WX` 9563–9572). This ID is the **lock disagreement**: FAIL lets you retry Inferno next action; Windstorm “blows your spell off course” locks it for 3 turns as if it landed. Mirror reflect hitting the caster is closer to a real cast — do not treat it as the primary fix, but it shares the `"cast"` return. Physical Strike skips FAIL and still rolls Windstorm, so the CD-on-miss path can also tax the one reliable spend.  
SYSTEMS_AFFECTED: spells, world events, visual feedback, challenges (Blitz / Striker / CD Inferno on Windstorm maps)  
RECOMMENDED_ACTION: SIMPLIFY so every player-facing miss uses one cooldown rule. Recommend: Windstorm miss returns `"fizzled"` (or a new `"missed"` that `castResultAppliesCooldown` treats like fizzle) so Inferno can be retried the same way FAIL allows. Keep AP spent — the attempt happened. If design wants CD on **every** attempt, FAIL must start the lock too and the Inferno card must say “CD 3t on attempt, including miss.” Do not add a third miss return. Do not hide the CD (that is 09-27-002). Do not pick which miss survives (that is 09-22-001) inside this ID — only make the survivor and the leftover share a lock.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT Windstorm (and, if HUMAN agrees it is a miss, Mirror Field) returning `"fizzled"` plus a unit test that Inferno CD stays 0 after `paperWindstormMiss === true`. HUMAN_DESIGN_REQUIRED to put CD on FAIL as well, or to keep Mirror reflect as a successful cast.  
DEPENDENCIES: PXA-2026-09-22-001 (one miss language). PXA-2026-09-02-003 (one Windstorm rate). PXA-2026-09-27-002 (name the lock on the card). Does not close 001/003/002.  
REGRESSION_RISK: MEDIUM — Windstorm maps become easier if Inferno can be retried after a blow-off (that is the FAIL parity). HIGH if `"fizzled"` is used and a follow-up path double-debits AP (`castFollowUpShouldDebitAp` already forbids that). LOW if only the Inferno card adds “CD also on Windstorm miss” while the lock stays. Do not restack WX `executeCastAttempt` while open combat PRs own that block — change `resolvePlayerCast`’s return and the helper tests.  
VALIDATION_REQUIRED: Windstorm map, Inferno, forced miss: AP spent, CD remaining 0 (or 3 if HUMAN picks attempt-lock), float/log is the Windstorm sentence not “FIZZLED” unless FAIL also fired. FAIL-only miss: CD still 0 unless HUMAN picks attempt-lock for both. Strike on Windstorm: still no Inferno CD (Strike has none). `pnpm typecheck`. Spectate: no Inferno greyed after a blow-off unless FAIL would grey it too.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-21-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Forge AP 10 / MP 5 must not outrank the live battle floor of 8 / 4  
CATEGORY: progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: There is no level cap. The action identity is AP for spells, MP for walk. Create writes `startingChampionStats()` AP **10** / MP **5** (`startingChampionStats.ts` 7–12; `CharacterCreation.tsx` 272). Forge vitals display those defaults (`championForgeVitalsFromStats`). Character select falls back to AP `"10"` (`CharacterSelection.tsx` 667). Battle start and per-turn restore ignore the persisted pair and load `getPlayerBaseStats` floors **8 / 4** (`progression.ts` 59–72, `PLAYER_BASE_AP` / `PLAYER_BASE_MP` in `gameConstants.ts` 131; `WX` 12101–12116, 14337–14364). The restore comment names the old “10/4 flapping.” `hard_3` (“Never spend more than 8 AP in any single turn”, `challengeCompletion.ts` 81–86) is therefore free at L1 even when the forge implied a 10-AP bar — 09-26-001 owns the flat predicate; this ID owns the **first-hour sheet vs fight**. Admin Level-up help still says “All stats grow this percent per character level (default 5)” (`AdminDashboard.tsx` 4567–4587) while `statGrowthPercent` only drives the **linear** HP orb `floor(100 * (1 + (L-1) * g))` (`WX` 3400–3406) and linear enemy HP (`WX` 3607–3611). Compounding `getPlayerBaseStats` HP (`progression.ts` 74–80) is unused for the orb and for `respawnHpAfterDeath` (`deathPenalty.ts` 138–140). ATK 15 / CHC 5 / SP 8 never read the knob. 09-27-001 asked to print the live AP/MP/HP cadence — if that print uses compounding HP or forge 10/5 it will lie. Do not treat 8 AP as a level cap.  
SYSTEMS_AFFECTED: progression, visual feedback, admin-enabled content, challenges (`hard_3`), death (respawn HP uses linear 50%), spells (first-fight AP bar)  
RECOMMENDED_ACTION: SIMPLIFY to one L1 budget. Stamp `startingChampionStats` AP/MP as `PLAYER_BASE_AP` / `PLAYER_BASE_MP` (8 / 4); forge vitals, select fallback, and create payload follow. Keep battle formula as the floor (already wins on divergence). Rewrite admin “All stats grow %” to the live sentences: “Max HP +P% of base per level (linear, not compound)”; “+1 AP/MP every N levels”; do not claim ATK/SP/CHC grow. 09-27-001’s sheet line must bind the **orb** formula and the 8/4 floor, not `getPlayerBaseStats` HP. Do not raise the battle floor to 10 to match the forge. Do not add a level cap.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT create/forge/select 8/4 plus the admin help string, and a unit test that `startingChampionStats().ap === 8n` and `getPlayerBaseStats(1, DEFAULT_LEVELUP_CONFIG).ap === 8`. HUMAN_DESIGN_REQUIRED to make L1 battle AP 10 (that changes `hard_3`, orbs, and every cost table).  
DEPENDENCIES: PXA-2026-09-27-001 (print live cadence nearby — do not print 10/5). PXA-2026-09-26-001 (`hard_3` still auto-completes until +1 AP at 25; fixing the stamp does not close 001). PXA-2026-09-29-001 (another dead LevelUpConfig sentence). Does not close 001.  
REGRESSION_RISK: LOW for create-stamp 10→8 on **new** profiles (matches what combat already spends). MEDIUM if existing rows with persisted AP 10 are shown on select as 10 while the next fight is 8 — that is today’s live state; HUD should show formula or persist, not both. HIGH if battle floor is raised to 10 without a pass on `hard_3`, elixir +3, and Surge −1. Do not edit `getPlayerBaseStats` HP compounding in this ID (persist/SDEG own that curve).  
VALIDATION_REQUIRED: New champion forge shows AP 8 / MP 4. First overworld fight orbs and spend the same 8 / 4. Select card matches. Admin 5% help no longer says “all stats.” Level 1 `hard_3` still cannot fail from the stamp (8 ≤ 8) — remaining invert is 09-26-001. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW
