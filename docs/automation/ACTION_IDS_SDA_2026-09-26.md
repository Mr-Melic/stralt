# ACTION_IDs — 2026-09-26 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-26.md`](./SPELL_ADMIN_DESIGN_2026-09-26.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 09-26 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 design §9 — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **056–068** (queue after #570). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. SDA-relevant additions since #570: **#572** (Wave-9 bosses / Table G), **#574** (Face/Mute/Span/Brand encounters), **#577** (version-gate feat keep + spell-level array alignment), **#578** / **#613** (WDD waves 8–9), **#580** / **#599** (seeded `saveBattleStats` skip), **#581** (0-AP Timestep under Arcane Surge), **#585** (AdminDashboard Ground Doka / ads), **#590** (Wave-8 SDE), **#591** (enemyWander extract), **#592** (summon kit a11y), **#596** / **#598** (Haste/Slow pools), **#597** / **#601** / **#607** (ally / occupant / Sacrifice live gates), **#602** (Death Realm skip upgradeSpell), **#604** (Death Realm skip feat claim), **#605** (map-modifier identity), **#606** (last-hostile battle input), **#611** (recap `victoryPersistPending`). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-26-056  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #590 Wave-8 SDE stamps; do not pre-own generationMin 8 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#590](https://github.com/Mr-Melic/stralt/pull/590) is Wave-8 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-25.md`, `generationMin: 8`). Pack Tithe (`spell-pack-tithe`) is `ENEMY_ONLY`. About Hinge (`spell-about-hinge`) is `BOSS_ONLY` on `about_hinge_regent`. Leftover feat MULTI children: Crown Cut ← `leader_slayer` (do not also grant Coup de Grace); Full Bar ← `spell_master` (do not also grant Overcast / Hex of Silence). `unstoppable` stays unused as a spell gate. `odd_gallery` is a MULTI observe+win room. Open [#574](https://github.com/Mr-Melic/stralt/pull/574) Face/Mute/Span/Brand tags are `SPECIAL_ENCOUNTER` overlays, not hydrate grants. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-8 unique ids into that array, or hydrating Pack Tithe because `usableByPlayer !== false`, makes discovery worse. 09-25-043 already said the same for Wave-7 `#533`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-8 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-24-031, and 09-25-043. Honour #590 stamps (`ENEMY_DISCOVERY` default, named `ACHIEVEMENT` / `BOSS` / `MULTI_SOURCE` / `ENEMY_ONLY` / `BOSS_ONLY` / `SPECIAL_ENCOUNTER` children). Do not restamp Wave-1…7 doors or #563 extra doors. Do not implement Wave-8 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Tithe / About Hinge. Encounter tags from #574 never write `ownedSpellIds` by themselves.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-09-25-043; PR #590; PR #574  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-8 ids. HIGH if `ENEMY_ONLY` Pack Tithe is hydrated because `usableByPlayer !== false`. HIGH if `leader_slayer` double-grants Coup de Grace.  
VALIDATION_REQUIRED: After a Wave-8 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Claiming `leader_slayer` grants Crown Cut at most once. Duplicate door stamps do not grant twice.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-057  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-9 boss spectacular ids stay BOSS_ONLY; do not grow a sixth kit source  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#572](https://github.com/Mr-Melic/stralt/pull/572) appends Wave-9 sheets (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) and Rush Table G (`G0`–`G3`) to `docs/design/BOSS_AND_SPELL_DISCOVERY.md`. Spectaculars stay `BOSS_ONLY`. Player doors reuse existing ids only. Live combat already has three kit sources (09-23-011): `data/bossKits.ts`, Motoko `defaultBossConfigs()` still listing purged ids (`admin.mo` 357–379, Pale Archbishop `fireball`/`cursed_gust`/`entangle`), Admin chips `getSpellConfigs()`. 09-25-042 already forbade a fifth list with Wave-8 `#518`. A Wave-9 sheet that authors another `spellPoolIds` array, or that copies spectacular ids into `starterSpells` with `isBaseSpell: true`, pre-owns them via WX 2395–2440.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses chips; Wave-9 spectacular ids; Rush Table G  
RECOMMENDED_ACTION: Unique / spectacular ids on #572 wait for the named `BOSS` / `BOSS_ONLY` route (09-23-009). `BOSS_ONLY` never enters `ownedSpellIds`. When 09-23-011 lands, point the Wave-9 sheets at the same canonical id list as `bossKits.ts`. Ids only — no name matching. Do not implement boss cards in this studio PR. Coordinate with 09-25-042 / 09-24-030 rather than forking. Table G is a new `roomIndex` namespace — do not overwrite Tables A–F.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011 / 028 / 09-25-042.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-009; SDA-2026-09-25-042; PR #572  
REGRESSION_RISK: HIGH if Wave-9 spectaculars are seeded into `spellData.ts` as `isBaseSpell`. MEDIUM if a sixth kit list drifts from live combat.  
VALIDATION_REQUIRED: After a Wave-9 spectacular id exists in the catalog, a new character does not own it (never, if `BOSS_ONLY`). Admin chips, Motoko pools, and `bossKits.ts` still resolve one live id set. Table G rooms do not collide with F0–F3.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-058  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist AP 0 and isTimestep; union #581 Arcane Surge 0-AP stay-free  
CATEGORY: lifecycle-tooling  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live Timestep (`spell-timestep`, `spellData.ts` 216–226) is `apCost: BigInt(0)` and `isTimestep: true`. Client `validateSpellConfig` (`adminSafety.ts` 604–606) and Motoko `AdminGuard.validateSpellConfig` (`adminGuard.mo` 380–382) still reject `apCost < 1`. Editor exposes the Timestep toggle (`AdminDashboard.tsx` 3434) but cannot Save AP 0. Open [#581](https://github.com/Mr-Melic/stralt/pull/581) extracts `discountedApCostMinus1Min1` so Arcane Surge / Overflow `onApCost` keeps a 0-AP catalog cost at 0 (`Math.max(1, 0 - 1)` used to raise it to 1 and gate empty-wallet preview / execute / Attack Nearest). Announce copy still says “AP costs reduced by 1 (min 1)” for **paid** spells. Remaining 09-23-006 is still required `targetType`. Range clamps (#512 / #549 / #568) do not replace the AP 0 gate.  
SYSTEMS_AFFECTED: `validateSpellConfig`; `adminGuard.mo`; SpellEditor; `mapModifiers.ts` `discountedApCostMinus1Min1`; `spell-timestep`  
RECOMMENDED_ACTION: If #581 has landed, keep one `discountedApCostMinus1Min1`. Do not paste it into `validateSpellConfig`. 09-23-006 must accept AP 0 when `isTimestep` / `allowZeroAp` is set (same string client and Motoko). Do not “fix” Timestep by writing AP 1 to satisfy the old floor. Persist `isTimestep` in the 09-23-005 slice. Honour 09-25-041 / 055. Never key Timestep off `spell.name`. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — Candid + activate gate.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-006; SDA-2026-09-23-016; SDA-2026-09-25-041; PR #581  
REGRESSION_RISK: HIGH — saving Timestep as AP 1 re-breaks empty-wallet casts under Arcane Surge. Duplicate AP-cost helpers diverge. Skipping 006 still leaves Timestep illegal on Admin Save.  
VALIDATION_REQUIRED: Save Timestep with `isTimestep=true` and `apCost=0`; refetch matches; Arcane Surge still leaves cost 0. A paid 1-AP spell still floors at 1 after Surge. Rename the spell; combat still resets AP/MP. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-059  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Version-gate must keep observed and owned maps like feat caches; array alignment is not a grant  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#577](https://github.com/Mr-Melic/stralt/pull/577) adds `shouldPreserveFeatSessionVersionGateKey` so APP_VERSION wipe keeps covenant / shrine / maps-visited / ground-doka keys (official `explore_25_maps` / `loot_10_doka` progress is localStorage-only until `markAchievementUnlocked`). Same PR adds `spellLevelArrayEvolve` so misaligned `spellLevelKeys` / `spellLevelValues` refuse `upgradeSpell` instead of trapping — that is a **length contract**, not `ownedSpellIds`. `AGENTS.md` already keeps `pbv_tier_spawn_config`, `pbv_levelup_config`, and `*_inventory` across wipe. Observation / ownership maps do not exist yet; when they do, a wipe that preserves feats but drops `observedSpellIds` silently un-discovers. Display name is not a persist key.  
SYSTEMS_AFFECTED: `versionGate.ts`; `versionGateFeatEvolve.ts`; `spellLevelArrayEvolve.ts`; future observation maps; character slot 1–3  
RECOMMENDED_ACTION: When 09-23-003 / 009 land, OR a `shouldPreserveSpellDiscoveryVersionGateKey` into the same keep helper as #577 (after #508 owns `versionGate.ts`). Key observed/owned maps `(principal, slot, spellId)`. Do not treat aligned spell-level arrays as ownership. Do not mint catalog ids from `spellLevelForId`. `localStorage` is cache only. New stables need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — persist-lock and version-gate keep list.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-016; SDA-2026-09-24-036; PR #577  
REGRESSION_RISK: HIGH if a version wipe drops committed discovery while keeping feat caches. HIGH if `spellLevelArrayEvolve` is used as a grant writer. MEDIUM if keep-list concatenation duplicates `shouldPreserveVersionGateKey`.  
VALIDATION_REQUIRED: After observation persist exists, a version bump still hydrates slot-2 observed ids. Misaligned keys/values still skip `upgradeSpell` without adding ids. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-060  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: WDD wave-8/9 attune, loan, and death-tile glyph never write ownedSpellIds  
CATEGORY: discovery-pipeline  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live `WF-SPL-RUNE_BEARER` / `WF-SPL-GRIMOIRE_STALKER` / `WF-SPL-LOANER_MAGE` (`worldFeatures.ts` 511–529, 1071–1075, 1550–1578) already document that attune / loan must not call `upgradeSpell` and must not persist spell-level arrays. 09-24-029 already bound that. Open [#578](https://github.com/Mr-Melic/stralt/pull/578) unions Wave-8 `WORLD_FEATURES`. Open [#613](https://github.com/Mr-Melic/stralt/pull/613) adds Wave-9, including a death-tile **one-cast glyph that is not auto-grant** (WDD-2026-09-26-001: “death-tile one-cast glyph (not auto-grant)”). Catalog hydrate still grants every `starterSpells` row (WX 2395–2408). Wiring a glyph pickup into `upgradeSpell` or `ownedSpellIds` skips observe→win.  
SYSTEMS_AFFECTED: `worldFeatures.ts`; future attune/loan/glyph writers; `upgradeSpell`; `ownedSpellIds`  
RECOMMENDED_ACTION: Honour 09-24-029. Map-local attune / one-cast loan / death-tile glyph may equip a **temporary** id for the map only. They never write `ownedSpellIds`, `observedSpellIds`, or `spellLevelKeys`. They never call `upgradeSpell`. Victory still uses `applyRewards`. If a glyph is meant to teach, it is a `SPECIAL_ENCOUNTER` observe+win room — not a pickup grant. Do not grow WX. Extract helpers next to `worldFeatures.ts`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-24-029; PR #578; PR #613  
REGRESSION_RISK: HIGH if a Wave-9 glyph auto-grants. HIGH if Rune Bearer attune calls `upgradeSpell`. MEDIUM if loaner persist rides `saveBattleStats`.  
VALIDATION_REQUIRED: Loaner pickup leaves `spellLevelKeys` unchanged. Death-tile glyph does not add an owned id on step. Defeat on an attune map does not persist the spell. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-061  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist ally, occupant, and Sacrifice flags; union #597, #601, and #607  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Motoko `SpellConfig` (`src/backend/types/admin.mo` 92–127) and bindgen (`backend.ts` 118–152) omit `targetType`, `isSacrifice`, and occupant-required kit metadata. CatalogNote admits Swap/Barrier/Trap/DoT/buff numeric flags drop on reload (`AdminDashboard.tsx` 3641–3644). Editor “Heal (targets self)” (2685) still infers targeting from `spellType`. Open [#597](https://github.com/Mr-Melic/stralt/pull/597) extracts `kitAllyBuffTarget` so Sentinel Shield applies to the clicked ally summon. Open [#601](https://github.com/Mr-Melic/stralt/pull/601) shares occupant-required kits with the live gate (`playerOccupantRequiredLive.ts`). Open [#607](https://github.com/Mr-Melic/stralt/pull/607) shares Sacrifice occupant with the live gate (`playerSacrificeLive.ts`). Live combat therefore **requires** those frontend fields. 09-23-005 already asked to persist them; these PRs make that a runtime dependency.  
SYSTEMS_AFFECTED: `admin.mo` SpellConfig; bindgen; SpellEditor; `kitAllyBuffTarget.ts`; `playerOccupantRequiredLive.ts`; `playerSacrificeLive.ts`; `targeting.ts`  
RECOMMENDED_ACTION: Persist 09-23-005 (`targetType` including `ally` / `self` / `enemy` / `empty` / `chain`, occupant-required, `isSacrifice`) in the same Motoko + bindgen + editor slice. If #597 / #601 / #607 have landed, keep one extract per name — do not concatenate a second `applyEffect`. Never key Sentinel Shield / Sacrifice off `spell.name`. Drop “Heal (targets self)”. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — Candid shape.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-006; SDA-2026-09-23-016; SDA-2026-09-25-045; PRs #597 / #601 / #607  
REGRESSION_RISK: HIGH — default `targetType=enemy` on Sentinel Shield would buff a hostile. A lagging actor rejects new-field saves. Duplicate occupant helpers fail esbuild.  
VALIDATION_REQUIRED: Save Sentinel Shield with `targetType=ally`; refetch matches; clicked ally summon still receives the shield. Save Sacrifice with `isSacrifice=true`; occupant gate still matches execute. Rename the spell; combat still uses flags. `pnpm typecheck` + `mops check`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-062  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Haste and Slow onto the summon pool; union #596 and #598  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#596](https://github.com/Mr-Melic/stralt/pull/596) extracts `playerBattleResource` so Haste MP applies to the live player pool this turn. Open [#598](https://github.com/Mr-Melic/stralt/pull/598) extracts `summonBattleResource` so Slow and Haste apply to the summon walk/cast pool. Both require catalog `buffStat` / `debuffStat` / duration — Motoko persist and bindgen omit them. 09-25-045 already bound Weaken/Slow on hostiles; summon-pool Slow is the same metadata on a different extract. Open [#565](https://github.com/Mr-Melic/stralt/pull/565) AI increment is honesty, not a grant, and must not introduce name fallbacks. Overlaps WX.  
SYSTEMS_AFFECTED: `playerBattleResource.ts`; `summonBattleResource.ts`; SpellEditor statuses; Motoko SpellConfig; `WorldExploration.tsx` call sites  
RECOMMENDED_ACTION: Persist buff/debuff stat + duration in the 09-23-005 slice. If #596 / #598 have landed, keep one extract per name. Never key Haste / Slow off `spell.name`. Summon kit AP/MP still need 09-23-002. Extract further WX rather than growing WX (19 213 lines). Honour 09-25-045.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-005; SDA-2026-09-25-045; PRs #596 / #598 / #565  
REGRESSION_RISK: MEDIUM — dropping summon-pool Slow while adding `displayName` re-breaks kit walks. Concatenating a second `modifiedResourcePool` fails esbuild.  
VALIDATION_REQUIRED: Haste still adds MP to the player this turn. Slow on a player summon still reduces that summon’s walk/cast pool. Rename Haste; combat still uses `buffStat`. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-063  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #585 AdminDashboard Ground Doka labels and #605 modifier identity; one SpellEditor  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#585](https://github.com/Mr-Melic/stralt/pull/585) edits `AdminDashboard.tsx` (8 280 lines) to label live Ground Doka and landing ads. Open [#605](https://github.com/Mr-Melic/stralt/pull/605) adds `adminSafety.mapModifierIdentity.ts` and Motoko id/type mismatch rejects on `adminGuard.mo` — the same Guard module as `validateSpellConfig`. 09-25-049 already unions #539 live-publish confirm + #531 Visuals + #470. 09-25-053 unions #564 `SpellSummonFields`. Concatenating two SpellEditor copies, two Guard validators, or two confirm dialogs fails Caffeine `vite build`. Live spell confirm still claims immediate remove (`AdminDashboard.tsx` 3791–3795) and toast is `"Spell deleted"` (6166). Spell Save landing remains `useSpellQueries.ts`. This docs PR must **not** touch those files.  
SYSTEMS_AFFECTED: `AdminDashboard.tsx`; `adminGuard.mo`; `adminSafety.mapModifierIdentity.ts`; extracted SpellEditor; `useSpellQueries.ts`  
RECOMMENDED_ACTION: When 09-23-015 is implemented, restack onto an oldest-first integration that includes #470 / #531 / #539 / #564 / #585 / #605. Keep one SpellEditor, one confirm dialog, one `validateSpellConfig`, one map-modifier identity helper. Do not inline modifier identity into spell validators. Do not treat owner-UX copy as lifecycle (09-23-001). Run `bash scripts/open-pr-stack-compat.sh --self` and `python3 scripts/check-duplicate-exports.py src/frontend/src`.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-23-027; SDA-2026-09-24-037; SDA-2026-09-25-049; SDA-2026-09-25-053; PRs #585 / #605  
REGRESSION_RISK: HIGH — duplicate exports fail import; overwriting #585 labels re-lies about Ground Doka; overwriting 3791–3795 without 001 keeps the “removed immediately” lie.  
VALIDATION_REQUIRED: Stack-compat clean vs `origin/main` and as next queue item. Map-modifier id/type mismatch still `#err`s. Spell Save still goes through `useSpellQueries`. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-064  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #591 wander extract and #606 last-hostile input; do not grow WorldExploration  
CATEGORY: stack-compat  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `WorldExploration.tsx` is 19 213 lines. Open [#591](https://github.com/Mr-Melic/stralt/pull/591) extracts `advanceEnemyWander` into `engine/enemyWander.ts`. Open [#606](https://github.com/Mr-Melic/stralt/pull/606) ignores new battle input after the last hostile dies (`lastHostileBattleInput.ts`). 09-25-048 already unions leftover-walk / summon-spawn siblings (#544 / #546 / #547 / #554 / #536). Concatenating a second wander helper or a second last-hostile gate fails esbuild. Discovery writers must not be inlined into these hunks. `buildEnemyKit(..., currentMap.levelZone)` (WX 11920) still passes a LevelZone object.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `enemyWander.ts`; `lastHostileBattleInput.ts`  
RECOMMENDED_ACTION: If those PRs have landed, keep one wander extract and one last-hostile helper. Extract further WX kit resolve / observe hooks into helpers next to those files. Do not grow WX. Do not add `recordSpellObservation` inside a wander or last-hostile hunk. One `export function` per name. Honour 09-25-048. Pass a numeric zone into `buildEnemyKit` only with 09-23-007 / 010.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack only.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-25-048; PRs #591 / #606  
REGRESSION_RISK: HIGH — duplicate wander exports fail import; growing WX for discovery wiring is forbidden; dropping last-hostile ignore re-opens post-victory casts.  
VALIDATION_REQUIRED: Stack-compat clean vs `origin/main` and as next queue item. Wander still advances on the fight graph. After the last hostile dies, new battle input is ignored. Duplicate-export scan clean. WX line count does not grow for studio work.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-065  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #592 summon-kit 44px targets; kit slots are not acquisition  
CATEGORY: owner-ui  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Open [#592](https://github.com/Mr-Melic/stralt/pull/592) makes summon End Turn and kit spell slots 44px (`SummonControlPanel.tsx`). That is summon **chrome**, not `ownedSpellIds`. Kit ids still live on frontend `SummonUnitDef.summonKit` (`summonSpawn.ts` 22–33); Motoko unit def has no kit (`admin.mo` 85–90). Runtime still does `spell.summonAI || "hunter"` (`summonSpawn.ts` 139). A studio that treats kit-slot a11y as “player owns the kit spell” would pre-own Blood Mend / Rallying Cry via hydrate. Honour 09-25-047 / 053.  
SYSTEMS_AFFECTED: `SummonControlPanel.tsx`; SpellEditor summon kit; `summonSpawn.ts`  
RECOMMENDED_ACTION: Keep #592 a11y on the summon panel. Kit spell ids are enemy/player-summon casts, not player library rows, unless 09-23-009 stamps them `PLAYER_LEARNABLE`. 09-23-002 still persists `displayName` / `summonKit` / AP/MP and drops the hunter default. Do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 09-23-002 / 015.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-015; SDA-2026-09-25-047; SDA-2026-09-25-053; PR #592  
REGRESSION_RISK: LOW for combat. MEDIUM if kit-slot ids are cloned into `starterSpells`.  
VALIDATION_REQUIRED: Summon End Turn and kit slots stay ≥ 44px. A new character does not own Blood Mend. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-066  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Seeded saveBattleStats skip-after-keep PRs are not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 09-25-052 already forbade piggy-backing unseeded skip-`saveBattleStats` helpers (#532 / #540 / #545 / #552). After #570 the same class grew **seeded** variants: [#580](https://github.com/Mr-Melic/stralt/pull/580) seeded victory keep, [#599](https://github.com/Mr-Melic/stralt/pull/599) seeded portal keep. `saveBattleStats` never mints and ignores spell-level arrays (`AGENTS.md`). Discovery grants must not ride those skip paths. Display name is not a persist key.  
SYSTEMS_AFFECTED: future observation maps; persist lock; character slot 1–3; `saveBattleStats` callers  
RECOMMENDED_ACTION: Key observed/owned maps `(principal, slot, spellId)`. Enqueue on `createProgressPersist`; `commit` after the canister write. Do not call `updateCharacter`, `upgradeSpell`, or `saveBattleStats` to grant. Honour the seeded skip helpers for wallet writes; do not add a parallel skip for spell grants. Death 20/40 does not strip owned/observed. Honour 09-25-052 / 09-24-036. New stables need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — persist-lock and character-record shape.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-016; SDA-2026-09-25-052; PRs #580 / #599  
REGRESSION_RISK: HIGH if a grant is folded into `saveBattleStats` or keyed by display name. HIGH if a seeded skip helper drops a committed discovery on victory / portal keep.  
VALIDATION_REQUIRED: Slot 2 observe does not unlock slot 1. Seeded victory keep and seeded portal keep still do not wipe a committed discovery. Duplicate victory empty grant.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-067  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Death Realm skip upgradeSpell is a spend gate, not a grant writer  
CATEGORY: ownership-persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#602](https://github.com/Mr-Melic/stralt/pull/602) skips rename and **spell upgrade** while Death Realm is pending (`deathRealmPendingSpend.ts`). That is the correct spend gate: `upgradeSpell` charges `spellLevelingBaseCost * 2^level` and must not debit during the 1.5s death timer (`AGENTS.md`). Live `upgradeSpell` (`main.mo` 1008–1014) still **appends any `usableByPlayer` catalog id** on first paid upgrade — that remains the accidental grant path 09-23-023 forbids. Implementers who wire `commitSpellDiscoveries` through `upgradeSpell` would both skip grants during Death Realm **and** mint on the next successful pay. `armDeathGuards` already blocks portals and encounters until the timer fires.  
SYSTEMS_AFFECTED: `deathRealmPendingSpend.ts`; `upgradeSpell`; future `commitSpellDiscoveries`; WorldExploration call sites  
RECOMMENDED_ACTION: Keep #602 as a spend skip. 09-23-023 still owns “`upgradeSpell` is never the grant writer.” Discovery commit is a dedicated canister method on `createProgressPersist`. Death Realm does not strip owned/observed. Do not grow WX — keep the skip helper. Honour 09-23-003.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — restack with 09-23-023.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-023; PR #602  
REGRESSION_RISK: HIGH if discovery is folded into `upgradeSpell` and then skipped for 1.5s (lost observe) or paid after respawn (unowned catalog mint).  
VALIDATION_REQUIRED: During Death Realm, upgrade click does not debit Doka and does not append a catalog id. After the timer, a paid upgrade of an already-owned id still levels. A new catalog id still cannot be purchased until 023. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-26-068  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Death Realm skip feat claim; discovery waits on the root recap persist  
CATEGORY: discovery-pipeline  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `BattleRecapData` (`PostBattleRecap.tsx` 6–34) still has XP/Doka/feats only; `attachRecapUnlocks` is achievements. Open [#604](https://github.com/Mr-Melic/stralt/pull/604) skips feat claim and GameKey redeem while Death Realm is pending (`deathRealmPendingCredit.ts`) — feat chrome, not a spell grant. Open [#611](https://github.com/Mr-Melic/stralt/pull/611) documents recap `victoryPersistPending` gates. Wave-1 SDE requires `TECHNIQUE OBSERVED` and `NEW SPELL DISCOVERED` on the **same** root recap after `applyRewards` commits. Wallet/level feats already wait until `applyRewards` (`shouldDeferAchievementUnlockUntilRewardsPersist`). A second recap, or a feat-claim that also writes `ownedSpellIds`, would fork the atomic funnel (`AGENTS.md` recap rule). Honour 09-25-051 / 09-24-035.  
SYSTEMS_AFFECTED: `deathRealmPendingCredit.ts`; `PostBattleRecap.tsx` `BattleRecapData`; `AchievementToast.tsx`; observe toast  
RECOMMENDED_ACTION: Keep #604 on feats / GameKey. When 09-23-009 lands, extend the existing recap object with `discoveredSpells` and wait for the same `victoryPersistPending` / persist-lock commit as XP/Doka. Do not open a second popup. `ENEMY_ONLY` / `BOSS_ONLY` optional dim log only. Extract helpers; do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-24-035; SDA-2026-09-25-051; PRs #604 / #611  
REGRESSION_RISK: MEDIUM — a Feat Unlocked-styled spell toast double-signals; claiming a feat during Death Realm must not also grant a spell. LOW if recap waits correctly.  
VALIDATION_REQUIRED: Victory with a new feat and a discovered spell shows one recap containing both after persist. Observe toast is not “Feat Unlocked”. Feat claim during Death Realm is skipped; discovery is not claimed via that skip helper. Duplicate victory empty grant.  
STATUS: NEW  
