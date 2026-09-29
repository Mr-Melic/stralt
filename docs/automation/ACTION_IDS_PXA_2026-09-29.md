# ACTION_IDs — 2026-09-29 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-29.md`](./PX_COHERENCE_AUDIT_2026-09-29.md)

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

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…09-28 audits. New IDs are new *reads* of the same bytes (dead spell-dmg slider vs hardcoded `1.03^level`; Rest/Sanctuary hub with no rest; named events painting a second lava/ice/spike language).

---

ACTION_ID: PXA-2026-09-29-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Spell-upgrade damage must read one live percent, or the admin slider must leave the career panel  
CATEGORY: progression  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: There is no level cap. The book-power sink is `upgradeSpell` (`10 * 2^level`, AGENTS.md). Admin Level-up “Spell Damage Growth %” (`AdminDashboard.tsx` 4665–4685) is min 0 / max 50, default 3, help text “Per spell-level damage increase (default 3),” validated in `adminSafety.ts` 510–511, and stored on the canister (`adminContract.ts` 373). Combat never reads it. `calcScaledDamage` (`combatMath.ts` 130–136) takes `_casterLevel` and ignores it, then `Math.max(1, Math.floor(baseDamage * 1.03 ** spellUpgradeLevel))`. `spellEngine.ts` 1031–1043 duplicates that constant. Spellbook preview uses the same `1.03 ** spellLevel` (`SpellbookModal.tsx` 451–452). Frontend `LevelUpConfig` (`gameTypes.ts` 408–424) has HP%, AP/MP cadence, FAIL, and range cap — **no** `spellDmgGrowthPercent`. WX hydrates `pbv_levelup_config` into that type (`WX` 2307–2315). 09-27-001 owns **live** unread AP/MP/HP. 09-25-003 owns the range **ceiling that does bind**. 09-22-002 owns summon 10× **cost**. This ID is the advertised spell-damage career that does not fight. Character level does not scale the book; that is acceptable as a Doka-upgrade fantasy **if** the slider is not a second truth.  
SYSTEMS_AFFECTED: progression, spells, shops (`upgradeSpell`), visual feedback (spellbook preview), admin-enabled content  
RECOMMENDED_ACTION: SIMPLIFY to one source of truth. Pick (a) wire `spellDmgGrowthPercent` through `calcScaledDamage` / spellEngine / SpellbookModal (same object combat uses after hydrate), or (b) remove/hide the admin field and print “+3% damage per upgrade” on the book. Do not start scaling from `_casterLevel` in this ID (that would be a second unbounded power curve next to HP 5%/level). Do not change `upgradeSpell` cost. Do not add a level cap. Spell Scholar (`spell_level_5`) stays KEEP.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (b) copy/hide, or (a) thread the existing percent into the three `1.03` sites plus a unit test that admin 5% → `1.05 ** level`. HUMAN_DESIGN_REQUIRED to invent character-level spell scaling.  
DEPENDENCIES: PXA-2026-09-27-001 (print live cadences nearby; do not twin HP/AP/MP here). PXA-2026-09-25-003 (range cap already binds). PXA-2026-09-22-002 (summon cost 10×). Does not close 001.  
REGRESSION_RISK: MEDIUM if (a) changes 3% → admin 0 and every spell becomes flat (wipe the default to 3 on hydrate). LOW if only the slider is labeled unused. HIGH if `_casterLevel` is turned on without a pass on no-cap DPS vs enemy HP. Do not restack WX `computeDamage` while open combat PRs own that block — change `combatMath.calcScaledDamage` and the spellEngine duplicate together.  
VALIDATION_REQUIRED: Admin save of 3: Strike 10 at upgrade 0 = 10, at 1 = 10 (floor 10.3). Admin save of 10: upgrade 1 uses 1.10, spellbook next-dmg matches the hit. Character level 30 with upgrade 0: still base damage. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-29-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Rest, Sanctuary, and Safe Zone must be one place with one rule — or stop promising rest  
CATEGORY: dungeons  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: White-portal completion toasts “Sanctuary — your run is complete. Rest, hero.” (`WorldExploration.tsx` 6142–6148) then calls `generateRestMap()`. A rest portal toasts “Safe Zone — no enemies here. Use a portal to return.” (`WX` 6205–6212) and generates the **same** map. `generateRestMap` sets `levelZone.name` to `"Rest Area"` with `minLevel: 1, maxLevel: 9999` (`WX` 5513–5522), `isRestMap: true`, no heal, no shop, no shrine. It stamps three rest-exits: blue `restExitType: "normal"`, dungeon-entry, boss (`WX` 5483–5510). Stepping dungeon re-arms the chain at depth 1 (`WX` 6221–6234). Death Realm is a different quiet map (`generateDeathRealmMap`, zone `"Death Realm"`, `WX` 5388–5445). Idle +1 HP / 10s already ticks on any non-battle map (09-23-003) — including this hub — without being named rest. 09-24-003 owns **overworld** maps that can roll rest + rush + solo-boss doors together. This ID is the **destination**: three nouns (Rest / Sanctuary / Safe Zone / Rest Area) for a three-door combat chooser that does not rest. That is terminology overload plus a false recovery fantasy. Rename 100 Doka and BuffShop remain other sinks (PXA-011 / 09-02-001).  
SYSTEMS_AFFECTED: dungeons, world events, death, shops (absence of rest heal), visual feedback, terminology, progression  
RECOMMENDED_ACTION: SIMPLIFY copy to one noun that matches the map. Pick (a) this hub is a **Door Hall** — say “choose overworld / dungeon / boss,” drop “Rest, hero”; or (b) EXPAND a unique rest rule free roam does not have (full heal once, or a real shop, or a no-portal wait) and keep the word Rest. Do not silently full-heal on enter in a drive-by (that fights 09-23-002 pots vs 1:3 and 09-23-003 idle regen). Do not merge Death Realm into this hub. Do not add a fourth portal color. Overworld mix of rest/rush/boss rolls stays 09-24-003.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT (a) toast + zone name + HUD chip to one word (“Sanctuary” or “Crossroads”) with no heal. HUMAN_DESIGN_REQUIRED for (b) a real rest rule.  
DEPENDENCIES: PXA-2026-09-24-003 (overworld portal verbs). PXA-2026-08-31-010 (dungeon unique rule). PXA-2026-08-31-012 (one word per concept). PXA-2026-09-23-003 (do not close idle regen by calling it rest). Does not close 003 or 010.  
REGRESSION_RISK: LOW for copy-only. HIGH if enter-hub heals to max (Untouchable / Pacifist / death 50% HP identity). MEDIUM if dungeon rest-exit arming (`shouldArmDungeonChainOnRestExit`) is renamed away without a test. Do not touch `mapGen.ts`.  
VALIDATION_REQUIRED: White portal and rest portal land on the same map type. Toast, zone chip, and any HUD label use one noun. No HP change on enter (unless HUMAN picks (b) and the toast states the heal). Three exits still reachable. Death Realm still distinct. `pnpm typecheck`.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-29-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Named map events must not secretly stamp a second lava/ice/spike rule  
CATEGORY: world-events  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Battle start, after modifier trigger, paints floor hazards from modifier **ids** (`WorldExploration.tsx` 6696–6729). Thorned Ground or Blood Moon → `addModHazards("spikes")`. Frozen Terrain or legacy `ice_fields` → ice. Plague Zone, Void Rift, or legacy `lava_fields` → lava. Then any other live modifier (`Time Warp`, `titans_vigor`, Windstorm, Surge, Glass, …) has `Math.random() < 0.4` extra mixed lava/ice/spikes. Log is only “N hazard tiles detected” (`WX` 6726–6729). Live floor rules: lava = HP chip + Burning 3 / 3 (`WX` 11440–11453); ice = Frozen −2 MP / 2 turns (`WX` 11454–11467, comment falsely says “−50% MP”); spikes = 5–10 HP (`WX` 11468–11470). Those stack on the named event: Frozen Terrain already `onMpCost * 2` (`mapModifiers.ts` 164–172); Thorned already `thornedGroundWalkDamage` = `(pathLength - 1) * 5` (`battleSetup.ts` 297–300); Plague already `PLAGUE_ZONE_TICK = 2` (`WX` 14309–14324). Admin marks `lava_fields` / `ice_fields` / `spike_pit` as “legacy id (no engine hook)” (`AdminDashboard.tsx` 4945–4949) while this painter still keys on them. 09-01-002 owns announce-vs-registry-hook (Windstorm, Gravity, Fog, Blood Moon flavor). 09-26-002 owns one-sided `combatantsRef` ticks. This ID is a **second encounter language** the Map Effects panel does not name. The 40% extra roll is arbitrary difficulty.  
SYSTEMS_AFFECTED: world events, visual feedback, challenges (Untouchable / walk hazards / lava maps), admin-enabled content, dungeons (same painter on chain maps)  
RECOMMENDED_ACTION: REWORK the painter to match the named event, or delete it. Recommend: each registry id maps to **at most one** floor language that the announce already states, or to none (Thorned = walk tax only; Frozen = MP ×2 only; Plague = 2 HP tick only; Void Rift = rift tile only). Drop the 40% random extra stamp. Drop legacy `spike_pit` / `ice_fields` / `lava_fields` keys. If ice tiles stay, announce “ice tiles: −2 MP / 2 turns” and fix the −50% comment. Do not implement Gravity/Fog here. Do not change Titan/Glass formulas (PXA-008 / 09-28-003). Do not hide Map Effects.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT deleting the 40% extra roll + fixing the wrong-element map (Thorned↛spikes, Blood Moon↛spikes, Plague↛lava) plus a unit test on the mapping table extracted from WX. HUMAN_DESIGN_REQUIRED to keep a dual language (event + floor) as an intentional dungeon rule.  
DEPENDENCIES: PXA-2026-08-31-008 (slim the 22). PXA-2026-09-01-002 (announce vs hook — do not close 002 by deleting ice tiles if Frozen’s MP ×2 is still the announced rule). PXA-2026-09-26-001 (Untouchable on lava maps). Does not close 002 or 008.  
REGRESSION_RISK: MEDIUM — removing spike stamps from Thorned maps changes walk-hazard + Untouchable rates. LOW if only the 40% extra roll is removed. HIGH if lava ticks are removed from Plague while the announce still implies a floor. Do not rewrite `mapGen.ts`; this is the WX battle-start painter. Extract the mapping if open WX PRs own that block.  
VALIDATION_REQUIRED: Frozen-only map: MP ×2, **zero** ice tiles (or ice tiles named in announce). Thorned-only map: walk tax, **zero** spike tiles. Time Warp-only map: 15s clock, **zero** random lava. Admin `spike_pit` does not paint spikes unless a live hook exists. Hazard log names the type or Map Effects does. `pnpm typecheck`.  
STATUS: NEW
