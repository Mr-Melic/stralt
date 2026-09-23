# ACTION_IDs — 2026-09-23 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-09-23.md`](./PX_COHERENCE_AUDIT_2026-09-23.md)

Prior PX records remain **open** unless noted. Do not re-file:

- `PXA-2026-08-31-001` … `015` in [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (006 HUD hide done)
- `PXA-2026-09-01-001` … `003` in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md)
- `PXA-2026-09-02-001` and `PXA-2026-09-02-003` in [`ACTION_IDS_PXA_2026-09-02.md`](./ACTION_IDS_PXA_2026-09-02.md) (002 HUD done)
- `PXA-2026-09-21-001` … `003` in open draft [PR #343](https://github.com/Mr-Melic/stralt/pull/343)
- `PXA-2026-09-22-001` … `003` in open draft [PR #393](https://github.com/Mr-Melic/stralt/pull/393)

**Closed this cycle (do not re-open):**

- `PXA-2026-09-02-002` — accepted challenge HUD. Live gate is `shouldShowChallengeHud`.
- `PXA-2026-08-31-006` display half — Blood bar remains gone.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21 / 09-22 audits. New IDs are new *reads* of the same bytes (silent Boost ×1.5, HP pots vs 1:3 Doka-heal, idle +1 HP/10s).

---

ACTION_ID: PXA-2026-09-23-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Victory XP must not hide a permanent +50% behind a dead Battle Boost control  
CATEGORY: rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `BoostToggle.tsx` still implements XP vs Doka +50% pills, battle-lock overlay, and “Battle Boost” chrome, but **nothing imports it** (`src/frontend/src/components` has zero `BoostToggle` importers). `App.tsx` 360–362 / 498–501 still owns a `boostMode` useState and passes `onBoostToggle` into `GameFlow`. GameFlow discards both (`_boostMode` / `_onBoostToggle` at 48–49). `WorldExploration.tsx` 2098 holds `const [boostMode, _setBoostMode] = useState<"xp" | "rewards">("xp")` — setter unused, so the value is always `"xp"`. Victory then does `derivedBaseXp * 1.5 * bossXpMultiplier` when `boostMode === "xp"` (12374–12377) and never the Doka 1.5 branch (12438–12441). Recap receives `finalExp` with the 1.5 already baked (`clampApplyRewardsDeltas` 12447–12450) and does not print “boost.” Dead Code audits (`DEAD_CODE_AUDIT_2026-09-01.md` / `09-02`) already listed the unmounted component; they did not ask the four PX questions. This ID is the identity read: a live grant multiplier with no decision, no mastery, no counterplay, and a control that cannot change it. PXA-004 still owns threat-scaling the *base* `level * 20`. LHIPS-001 still owns the XP wall. Do not treat 1.5 as a level cap.  
SYSTEMS_AFFECTED: rewards, progression, visual feedback, shops  
RECOMMENDED_ACTION: SIMPLIFY. Pick one: (a) bake 1.5 into `computeVictoryExp` / recap copy as the official combat grant and delete `BoostToggle`, App `boostMode`, GameFlow props, and WX `boostMode`; or (b) mount **one** control that actually sets the WX value, lock it in battle, and print +50% XP or +50% Doka on the recap line that was charged. Do not keep a third disconnected `boostMode` in App. Do not add a second wallet. Do not stack a new multiplier on the silent 1.5.  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick bake vs real toggle. ORCHESTRATOR_MAY_DRAFT (a) delete-dead-UI + move `* 1.5` into the shared XP helper and recap label if design keeps the 1.5.  
DEPENDENCIES: PXA-2026-08-31-004 (threat-scale the base; do this first or the baked 1.5 is another unnamed fudge). Does not close LHIPS-001. Does not replace 09-22-002 (summon sticker).  
REGRESSION_RISK: HIGH if the 1.5 is removed without a recap/HUD explanation (every victory grant drops 33%). LOW if only dead UI is deleted and 1.5 stays in one function the recap names. MEDIUM if App and WX `boostMode` are wired without a single source of truth (Doka 1.5 never applies today — wiring it changes the economy).  
VALIDATION_REQUIRED: Recap XP equals `sum(level*20)` times the documented factor (1.0 or 1.5), times boss multiplier. No `BoostToggle` in the player HUD unless clicking it changes the next recap. `pnpm typecheck`. Spectate two victories: the recap sentence matches the persist delta.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-23-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Health potions must not be a worse Doka-to-HP  
CATEGORY: shops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Overworld sidebar heal is 1 Doka → 3 HP (`paidHealFromLiveWallet` / `resolveOverworldHealSpend` in `itemShop.ts` 216–222, 198–225; button only when `!inBattle && hp < maxHp` at `WorldExploration.tsx` 18371–18505). `BuffShop` `health_potion` costs 50 Doka for 30% max HP; `greater_health_potion` costs 120 for 70% (`BuffShop.tsx` 31–47). At 100 max HP: 30 HP is 10 Doka via the sidebar vs 50 via the potion; 70 HP is ~24 vs 120. Canister `BUFF_CATALOG` still disagrees on ids/costs (`main.mo` 2772–2779: `greater_potion`, elixir 200 vs UI 80, fury 100 vs UI 150) with no `purchaseBuff` caller under `components/`. In-battle elixir / boots / charm / fury can still be timing tools. HP pots cannot: they are the same overworld recover as the sidebar, strictly more expensive, and a second cart (GameFlow **Items** vs leftover-XP **Buy Doka**). PXA-011 owns catalog authority and spell-clone items (Fury ≡ Enrage). This ID is the HP-line dominance the earlier shop ID did not isolate.  
SYSTEMS_AFFECTED: shops, death (post-realm recover), challenges (overworld heal must not set `healUsed`), visual feedback, progression  
RECOMMENDED_ACTION: MERGE. Either (a) remove `health_potion` / `greater_health_potion` from the player Items list and keep one overworld recover (the 1:3 button, with PXA-004 if the rate must scale), or (b) make potions **in-battle only** (timing, like elixir) and hide or nerf the sidebar so the pot is not strictly worse, or (c) reprice potions to beat 1:3 if they are meant to be the spend. Do not leave both on the overworld. Catalog id/cost cutover remains PXA-011. GameKey placement remains 09-02-001. Do not persist HP pots only in localStorage if the canister catalog is the authority (011).  
AUTONOMY: HUMAN_DESIGN_REQUIRED to pick (a)/(b)/(c). ORCHESTRATOR_MAY_DRAFT (a) hide the two HP rows from `BUFF_ITEMS` + tests if design keeps sidebar 1:3.  
DEPENDENCIES: PXA-2026-08-31-011 (shop authority). PXA-2026-09-23-003 (idle regen also recovers overworld HP — do not leave wait-to-heal as a third winner). Does not replace 011.  
REGRESSION_RISK: MEDIUM if inventories already hold potion stacks — hide from buy, still allow Use. LOW if only the shop list changes. HIGH if Doka-to-HP is deleted while potions stay localStorage-only (players lose the recover they actually use). Overworld Doka-to-HP must still not set `healUsed`.  
VALIDATION_REQUIRED: A player at 70/100 HP with 40 Doka has exactly one sensible recover. Buy + Use + reload still matches the chosen authority. `pnpm typecheck`. Pacifist / no-heal challenges unchanged for overworld heal.  
STATUS: NEW

---

ACTION_ID: PXA-2026-09-23-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Stop silent +1 HP / 10s out-of-combat regen — recover must be a decision  
CATEGORY: death  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` 3617–3626 runs `setInterval` every 10s: if `!inBattleRef.current` and `hp < maxHp`, set `hp = min(maxHp, hp + 1)`. No HUD, no Rest-map gate, no Doka cost, no persist-lock enqueue on the tick (HP rides the next `saveBattleStats` / heal write). Orphaned comment at 3399 still labels this “Feature 1: Passive HP regen” above the `maxHp` memo, not the interval. After Death Realm, respawn HP is `respawnHpAfterDeath` (50% of scaled max); this interval then walks the bar back for free if the player waits. Combined with sidebar 1:3 Doka-to-HP (18371+) and HP potions (09-23-002), overworld recover is three languages: wait, spend wallet, spend worse wallet. Waiting answers none of the four PX questions. It also makes “HP as a resource between fights” false on any map you can AFK. Mending Mist is an in-battle named event and stays under PXA-008. Death 20/40 stays KEEP.  
SYSTEMS_AFFECTED: death, shops, visual feedback, progression, challenges (entering the next fight at full HP with no spend)  
RECOMMENDED_ACTION: DEPRECATE the interval, or confine it to Rest maps / Death Realm as an announced rule (e.g. sanctuary only). Do not add a “regen” buff chrome on the overworld. Do not replace it with a second Doka sink in this ID (that is 002). If Rest-only regen is kept, Map Effects / Rest banner must say the rate.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT to delete the `setInterval` + the orphaned comment + a unit test that overworld HP does not tick. HUMAN_DESIGN_REQUIRED to invent Rest-only regen copy/rate.  
DEPENDENCIES: PXA-2026-09-23-002 (one remaining overworld spend). PXA-2026-08-31-010 if Rest becomes the dungeon/overworld recover room. Does not change `respawnHpAfterDeath` or 20/40.  
REGRESSION_RISK: MEDIUM — players who currently wait between packs will take more leftover damage into the next pull. LOW if only the interval is removed and Doka-to-HP remains. Do not persist a sudden HP drop; freeze HP at current until the player heals or fights.  
VALIDATION_REQUIRED: Sit on an overworld map at 50/100 HP for 30s: HP unchanged. Rest map: either still unchanged, or the Rest banner states the tick. Death Realm 1.5s guards unchanged. `pnpm typecheck`. No RAF / mapGen edits.  
STATUS: NEW
