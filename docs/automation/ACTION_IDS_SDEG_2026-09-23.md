# ACTION_IDs — 2026-09-23 Save / Data Evolution Guardian

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Save/Data Evolution Guardian.  
Audit: [`DATA_EVOLUTION_AUDIT_2026-09-23.md`](./DATA_EVOLUTION_AUDIT_2026-09-23.md).  
Prior: `ACTION_IDS_SDEG_2026-09-22.md` (#400), `ACTION_IDS_SDEG_2026-09-21.md` (#362).  
Do not edit shipped `20260831` / `20260901` NewActor. New stables → `20260902+` with `OldActor = {}`.  
Do not edit `WorldExploration.tsx` while #327 / #331 are still open.  
Do not edit `main.mo` while older persist PRs (#362, #437, …) are queued.

---

## Closed / landed since 2026-09-22 (on this HEAD: none)

HEAD is still `0f5363f`. Vehicles remain draft. Helpers in this PR are restack-safe contracts only.

---

## Carry-forward (still OPEN — do not re-mint twins)

See `ACTION_IDS_SDEG_2026-09-21.md` / `ACTION_IDS_SDEG_2026-09-22.md` for full records.

- SDEG-2026-08-31-001 / 002 — later chain file after `20260901` before any required field
- SDEG-2026-08-31-003 — stop every-upgrade `OLD_SPELL_IDS` purge; remap ownership
- SDEG-2026-08-31-004 — persist owned spell ids separately from the live catalog
- SDEG-2026-08-31-005 — hydrate BuffShop from canister inventory
- SDEG-2026-08-31-006 — Character `writeGeneration`
- SDEG-2026-08-31-007 — dungeon progress idempotent + slot-scoped
- SDEG-2026-08-31-008 — snapshot achievement reward at unlock
- SDEG-2026-08-31-011 — do not deploy `dfx.json` `backend_extended`
- SDEG-2026-09-01-004 — split applyRewards ceilings from official payouts
- SDEG-2026-09-02-001 — victory HP floor vs persist cap (vehicle #386)
- SDEG-2026-09-02-004 — leftover KYC `purchaseRecords`
- SDEG-2026-09-02-005 — GameKey serial wrap (vehicle #362)
- SDEG-2026-09-02-006 — redeem credits caller, not requester
- SDEG-2026-09-21-001 — `saveActiveSpells` keep-store (vehicle #362)
- SDEG-2026-09-21-002 — stop hiding live spells by display name (WX; #327/#331)
- SDEG-2026-09-21-003 — persist AP/MP cap 20
- SDEG-2026-09-21-004 — applyRewards pow2 O(level) — helper landed this run; Motoko not wired
- SDEG-2026-09-22-001 — compounding battle HP vs linear persist cap — helper landed this run
- SDEG-2026-09-22-002 — empty keys drop starters on `setSpellBarOrder` (vehicle #400)
- SDEG-2026-09-22-003 — empty keys hydrate spell levels from localStorage (vehicle #388)
- SDEG-2026-09-22-004 — atk/res/sp/sr/init/chc/evasion/resilience never grow — offensive clamp landed this run
- SDEG-2026-09-22-005 — unpaid death slot-only keys (vehicle #385)

---

## New (2026-09-23)

ACTION_ID: SDEG-2026-09-23-001  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Alias BuffShop `greater_health_potion` to canister `greater_potion` before any inventory hydrate  
CATEGORY: inventory  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Official UI writes `${principal}_inventory` with `greater_health_potion` (`BuffShop.tsx` **16**, **41**). Motoko `BUFF_CATALOG` uses `greater_potion` (`main.mo` **2774**). `purchaseBuff` returns `#err("Unknown item")` for the frontend id. Costs also drift: `battle_elixir` 80 vs 200, `swift_boots` 90 vs 80, `shield_charm` 100 vs 150, `fury_potion` 150 vs 100. `health_potion` is the only matching paid id (50). This run: `mergeBuffInventoryAliases` / `ownedBuffStacks` max-not-sum, idempotent. Did not change live prices. Did not edit `BuffShop.tsx` (#408).  
SYSTEMS_AFFECTED: `BuffShop.tsx`; `buffInventories`; `purchaseBuff`; `useBuffItem`; `versionGate.ts`  
RECOMMENDED_ACTION: SDEG-005 hydrate must send `canonicalBuffItemId`. Keep both keys until every client reads `ownedBuffStacks`. Human picks one cost table before debiting canister Doka.  
AUTONOMY: IMPLEMENT (alias helper this run); HUMAN (price unify + wire loadInventory)  
DEPENDENCIES: SDEG-2026-08-31-005; #408 if wiring `BuffShop.tsx`  
MIGRATION_REQUIREMENT: YES — idempotent alias; no schema  
REGRESSION_RISK: HIGH if stacks are summed or prices silently change  
VALIDATION_REQUIRED: Fixture `{ greater_health_potion: 2 }` hydrates as 2 stacks usable in BuffShop and as `greater_potion` on `purchaseBuff`. Re-merge is a no-op.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-23-002  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Enforce SpellConfig.minLevel on first `upgradeSpell` grant; grandfather already-owned ids  
CATEGORY: spell-discovery  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `upgradeSpell` (`main.mo` **964–1014**) checks catalog presence and `usableByPlayer` for never-owned ids. It does **not** read `minLevel`. Seed `void_collapse` is `minLevel = 30` (`admin.mo` **190**). A yesterday-created level-1 character can pay to append that id. A six-month-old owner must still upgrade if an admin later raises minLevel. Helper `upgradeSpellMinLevelRejected` landed this run. Motoko not wired (older persist PRs own `main.mo`).  
SYSTEMS_AFFECTED: `upgradeSpell`; Spellbook; `spellLevelKeys`; future discovery  
RECOMMENDED_ACTION: Gate first grant on `playerLevel >= minLevel`. `alreadyOwned` skips the gate. Do not add `ownedSpellIds` until SDEG-001.  
AUTONOMY: IMPLEMENT (helper this run); HUMAN (Motoko after older persist PRs)  
DEPENDENCIES: SDEG-2026-08-31-004; do not edit `main.mo` until #362/#437 land or restack  
MIGRATION_REQUIREMENT: None if behavior-only; YES if storing discovery history  
REGRESSION_RISK: MEDIUM if already-owned high-minLevel spells cannot rank up  
VALIDATION_REQUIRED: L1 + `void_collapse` → reject; keys already contain the id at L4 + minLevel 30 → allow.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-23-003  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Make `saveKillCount` idempotent per battle; official client currently never writes it  
CATEGORY: stale-client  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `saveKillCount` (`main.mo` **3078–3110**) does `killCount + kills` and `#err`s when `kills > 64`. `useSaveKillCount` (`useLeaderboardQueries.ts` **43–50**) has **zero** official call sites. Create forces `killCount = 0`. A raw client retry of the same battle mints a second +N. Leaderboard `Number(entry.killCount)` is display-only. Helper `nextKillCountAfterSave` documents ADD not SET.  
SYSTEMS_AFFECTED: `saveKillCount`; `CharacterStats.killCount`; leaderboard  
RECOMMENDED_ACTION: Official path should send a battle id / use max-not-add, or stop exporting the hook until wired behind the persist lock. Do not treat the 64 cap as a lifetime max.  
AUTONOMY: HUMAN  
DEPENDENCIES: None for schema; WX if counting combat kills  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: MEDIUM if the method is switched to SET and a stale 0 overwrites a high total  
VALIDATION_REQUIRED: Double saveKillCount(3) must not yield +6 unless two battles; official UI still loads.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-23-004  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Document `getSessionState` bloodBalance default 50; persist covenant by id not name  
CATEGORY: persist-schema  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `getSessionState` (`main.mo` **3232**) returns `bloodBalance = 50` when the optional field is null. Pre-feature / six-month-old characters never wrote session state. First query is mid-scale blood, not empty. `covenantBuff` is `Text` (max 64) stored as a name (`updateSessionState` **3120–3158**). A rename of a covenant leaves old rows pointing at a missing string. Helper `hydrateBloodBalance` landed this run.  
SYSTEMS_AFFECTED: `updateSessionState`; `getSessionState`; Character optional session fields  
RECOMMENDED_ACTION: Keep 50 if that is the intended empty-world midpoint; otherwise default 0 with a one-shot only when the client first writes. Store covenant **ids**. Do not add required fields.  
AUTONOMY: HUMAN  
DEPENDENCIES: SDEG-2026-08-31-001 if a new optional map is added  
MIGRATION_REQUIREMENT: Optional field only; null remains valid  
REGRESSION_RISK: MEDIUM if existing clients assume 50  
VALIDATION_REQUIRED: Character with all session optionals null: getSessionState blood is the chosen default; covenant rename does not break an old row.  
STATUS: NEW  

---

ACTION_ID: SDEG-2026-09-23-005  
SOURCE_AUTOMATION: Save/Data Evolution Guardian  
TITLE: Short-circuit Motoko applyRewards pow2 when leftover XP cannot afford the next level  
CATEGORY: unbounded-progression  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: `applyRewards` (`main.mo` **2129–2138**) always builds `100 * 2^(level-1)` with a `while` multiply. Frontend `leftoverXpCannotAffordNextLevel` landed this run in `xpCurve.ts`. Motoko not wired (do not edit `main.mo` while older persist PRs are queued). Does not change the curve.  
SYSTEMS_AFFECTED: `applyRewards`  
RECOMMENDED_ACTION: `if leftoverXpCannotAffordNextLevel then skip pow2`. Same thresholds.  
AUTONOMY: HUMAN (Motoko)  
DEPENDENCIES: None; restack onto any `main.mo` persist PR  
MIGRATION_REQUIREMENT: None  
REGRESSION_RISK: HIGH if the compare skips a real level-up  
VALIDATION_REQUIRED: Level 1 + 500_000 XP still levels the same number of times; level 1000 + 0 XP returns immediately.  
STATUS: NEW  
