# ACTION_IDs — 2026-09-27 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-27.md`](./SPELL_ADMIN_DESIGN_2026-09-27.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 09-27 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 design — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **070–083** (queue after #630). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. SDA-relevant additions since #630: **#636** (Wave-9 tactical), **#638** (Wave-10 bosses / Table H), **#646** (Wave-9 SDE), **#631** (AdminDashboard shop lock), **#639** (iso-grid extract), **#644** (drain lifesteal), **#647** (Soul Rend applied DoT), **#649** (Trap legal tiles), **#650** (map-modifier built-in pool), **#652** (refuse 0-HP victory), **#657** (keep then feat/GameKey skip), **#658** (`res_sp` shreds), **#659** (Shield RES melee), **#660** (enemy/boss admin 09-27), **#663** (Wave-11 bosses / Table I). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-27-070  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #646 Wave-9 SDE stamps; do not pre-own generationMin 9 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#646](https://github.com/Mr-Melic/stralt/pull/646) is Wave-9 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-26.md`, `generationMin: 9`). Unique §11 ids (Clash Mend, Pair Stride, Cadence Shave, Nook Bite, Stride Mark, Foe Plate, Watch Mute, Full Purse, Pet Cut, Pack Stride, Knight Fold, …) stay this catalog’s. `spell-pack-stride` is `ENEMY_ONLY`. `spell-knight-fold` is `BOSS_ONLY` on `knight_fold_regent`. Leftover feat doors `survivor` / `jackpot` / `unstoppable` stay unused as spell gates. Tactical Wave-9 ids are stamped from #636, not cloned. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-9 unique ids into that array, or hydrating Pack Stride because `usableByPlayer !== false`, makes discovery worse. 09-26-056 already said the same for Wave-8 `#590`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-9 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-25-043, and 09-26-056. Honour #646 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole. Do not restamp Wave-1…8 doors or #636 extra doors (`shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent`). Do not implement Wave-9 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Stride / Knight Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-09-26-056; PR #646; PR #636  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-9 ids. HIGH if `ENEMY_ONLY` Pack Stride is hydrated because `usableByPlayer !== false`. HIGH if `knight_fold_regent` also grants Pair Stride.  
VALIDATION_REQUIRED: After a Wave-9 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-071  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #636 Wave-9 tactical; Court Stretch never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#636](https://github.com/Mr-Melic/stralt/pull/636) (`SPELL_PROPOSALS_2026-09-26.md`) owns G≥9 tactical holes: `spell-shove-mend`, `spell-cadence-stretch`, `spell-quad-span`, `spell-gait-wick`, `spell-dry-sting`, `spell-home-step`, `spell-must-span`, `spell-far-hood`, `spell-boot-lend`, `spell-quiet-sill`, `spell-exit-sting`, `spell-purse-keep`, `spell-tick-plate`, `spell-last-mute`, `spell-pair-slide`, `spell-court-stretch`. Acquisition table in #646 §0.3: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-stretch` is `NOT_PLAYER_LEARNABLE`. Quad Span is 2×2 occupy; live `ENEMY_SUMMON_CAP` is still 2, so that card is implementation-blocked. Extra doors `shove_cantor` / `stretch_precentor` / `span_quad` / `keep_bursar` / `court_stretch_regent` must not be restamped by SDE unique §11 or Wave-10 families. Live hydrate still pre-owns all 32 `starterSpells`.  
SYSTEMS_AFFECTED: Wave-9 tactical catalog; summon cap; `ownedSpellIds`; extra-door table  
RECOMMENDED_ACTION: Stamp #636 ids; do not clone them into SDE unique §11. `spell-court-stretch` never enters `ownedSpellIds`. Do not activate Quad Span until summon cap / occupy rules exist — do not “fix” by name-matching Occupy. Extra doors are first-grant; do not also hang Clash Mend / Cadence Shave / Knight Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-27-070; PR #636  
REGRESSION_RISK: HIGH if Court Stretch hydrates as a catalog grant. MEDIUM if Quad Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Stretch. Quad Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-072  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-10 boss spectacular ids stay BOSS_ONLY; Table H is a new roomIndex  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#638](https://github.com/Mr-Melic/stralt/pull/638) appends Wave-10 sheets (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) and Rush Table H (`H0`–`H3`) to `docs/design/BOSS_AND_SPELL_DISCOVERY.md`. Spectaculars stay `BOSS_ONLY` (`NAVE_COLLAPSE`, `CHOIR_PACE`, `NAVE_TRISPAN`, `CHOIR_ORBIT`). Player extra doors reuse #525 only (`spell-pit-wick`, `spell-must-pace`, `spell-triple-span`, `spell-pivot-foe`). Live combat already has three kit sources (09-23-011). 09-26-057 already forbade a sixth list with Wave-9 `#572`. A Wave-10 sheet that authors another `spellPoolIds` array, or that copies spectacular ids into `starterSpells` with `isBaseSpell: true`, pre-owns them via WX 2395–2440. Table H is a new `roomIndex` namespace — do not overwrite Tables A–G.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko `defaultBossConfigs`; Admin Bosses chips; Wave-10 spectacular ids; Rush Table H  
RECOMMENDED_ACTION: Unique / spectacular ids on #638 wait for the named `BOSS` / `BOSS_ONLY` route (09-23-009). `BOSS_ONLY` never enters `ownedSpellIds`. When 09-23-011 lands, point the Wave-10 sheets at the same canonical id list as `bossKits.ts`. Ids only — no name matching. Coordinate with 09-26-057 / 09-25-042 rather than forking. Table H does not rewrite G0–G3.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011 / 028.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-009; SDA-2026-09-26-057; PR #638  
REGRESSION_RISK: HIGH if Wave-10 spectaculars are seeded into `spellData.ts` as `isBaseSpell`. MEDIUM if a seventh kit list drifts from live combat.  
VALIDATION_REQUIRED: After a Wave-10 spectacular id exists in the catalog, a new character does not own it (never, if `BOSS_ONLY`). Admin chips, Motoko pools, and `bossKits.ts` still resolve one live id set. Table H rooms do not collide with G0–G3.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-073  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Wave-11 boss spectacular ids stay BOSS_ONLY; Table I does not overwrite H  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#663](https://github.com/Mr-Melic/stralt/pull/663) appends Wave-11 sheets (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) and Rush Table I (`I0`–`I3`). Spectaculars stay `BOSS_ONLY`. Player extra doors reuse #563 only (`spell-gait-seal`, `spell-diag-lock`, `spell-brick-shift`, `spell-return-sting`). Court Hinge stays `NOT_PLAYER_LEARNABLE`. Unlock for Table I is one complete clear of Table H. Live three kit sources still apply. Copying these ids into `starterSpells` pre-owns them.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko pools; Admin chips; Wave-11 spectacular ids; Rush Table I  
RECOMMENDED_ACTION: Same as 072. `BOSS_ONLY` never owned. Do not restamp #563 extra doors (`gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent`) as these encounter ids. Table I does not overwrite H0–H3 or G0–G3. Do not implement boss cards in this studio PR.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011 / 028.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-27-072; PR #663  
REGRESSION_RISK: HIGH if Wave-11 spectaculars hydrate as `isBaseSpell`. MEDIUM if Table I reuses Table H `roomIndex`.  
VALIDATION_REQUIRED: New character never owns Gait Seal / Diag Lock / Brick Shift / Return Sting from hydrate. Table I rooms are a new namespace. Admin chips still match live `bossKits.ts`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-074  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #639 iso-grid extract; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#639](https://github.com/Mr-Melic/stralt/pull/639) extracts iso grid projection from `WorldExploration.tsx` (19 213 lines). Older still-open PRs #327 / #331 already edit WX. 09-26-064 already required union with #591 wander extract and #606 last-hostile input. Studio wiring that appends observation or catalog filters inside WX will fight those extracts and fail duplicate-`export function` restack.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; extracted iso-grid helper; future observe hook  
RECOMMENDED_ACTION: Discovery / ownership helpers stay in `engine/*` / `utils/*`. WX only gets one-line call sites. If a persist PR also touches WX, union #327 / #331 / #639 / #591 / #606. Keep one `export function` per name. Do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 09-23-003 / 009 exist.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-26-064; PR #639; PR #327; PR #331  
REGRESSION_RISK: MEDIUM — concatenating a second helper on restack fails `vite build`. Growing WX is forbidden.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Observe hook is not inlined in WX. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-075  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #631 AdminDashboard shop lock; one SpellEditor  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#631](https://github.com/Mr-Melic/stralt/pull/631) edits AdminDashboard shop busy-lock / 2026-09-26 owner UX. Dashboard is 8 280 lines. SpellEditor is still inline (`AdminDashboard.tsx` 2508–3565) with zero `targetType` matches and Spell Type damage/heal/drain only (2684–2687). 09-26-063 already required union with #585 Ground Doka labels and #605 modifier identity. Writes already land in `useSpellQueries.ts`. Concatenating a second SpellEditor or a second `export function` on restack fails Caffeine `vite build`.  
SYSTEMS_AFFECTED: extracted `SpellEditor`; `useSpellQueries.ts`; `AdminDashboard.tsx`  
RECOMMENDED_ACTION: Extract one SpellEditor. Keep writes in `useSpellQueries`. Union #631 / #585 / #605 / #341 shop and catalog chrome. Do not add Library / Discovery / Versions tabs until 09-23-013 activate exists on the canister. Do not grow the dashboard.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — UI after persist 09-23-001 / 002 / 005 / 009 / 013.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-26-063; PR #631  
REGRESSION_RISK: MEDIUM — a second visual system or duplicate export fails import gate.  
VALIDATION_REQUIRED: `#admin` still gated. Shop busy-lock from #631 still works after extract. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-076  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist drain lifesteal with spellType; union #644  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#644](https://github.com/Mr-Melic/stralt/pull/644) treats catalog `spellType` drain as player lifesteal. Live `starter-drain` / `spell-lifesteal-nova` already stamp `spellType: "drain"` in `spellData.ts`. Motoko persist stores `spellType` (`admin.mo` 102) but Admin Save still drops frontend combat fields (`targetType`, heal pairing). Editor Spell Type has Drain (2686) but Heal option text is “Heal (targets self)” (2685). A default of `enemy` on drain or a name parse of “Life Drain” would break targeting. 09-23-005 is the persist slice.  
SYSTEMS_AFFECTED: `SpellConfig.spellType`; SpellEditor; `spellEngine.ts`; #644 drain execute  
RECOMMENDED_ACTION: Round-trip `spellType` / `healAmount` / `targetType` with 09-23-005. Union #644’s execute helper — one implementation. Never key drain off `spell.name`. New fields need 09-23-016 only if they are new stables; `spellType` already persists.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-008; PR #644  
REGRESSION_RISK: HIGH if drain is saved without healAmount or with `targetType=self`. Duplicate drain helpers diverge.  
VALIDATION_REQUIRED: Save Life Drain; refetch `spellType=drain` and healAmount; #644 lifesteal still applies. Rename the spell; combat still drains. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-077  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Soul Rend applied DoT; union #647  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#647](https://github.com/Mr-Melic/stralt/pull/647) lands Soul Rend damage instead of a 0-tick DoT. Canister seed `soul_rend` is `effectType = "dot"` (`admin.mo` 175). Frontend Inferno is `isDotSpell` + `dotDamagePerTurn` (`spellData.ts` 502+). Motoko persist has `effectType` but not `isDotSpell` / `dotDamagePerTurn`. Admin Save would strip those flags. `OLD_SPELL_NAMES_SET` already tombstones display name `Inferno` while live id is `spell-inferno` (WX 2360, 502). Do not grow that name set.  
SYSTEMS_AFFECTED: DoT fields on `SpellDefinition`; SpellEditor; #647 apply path; tombstone list  
RECOMMENDED_ACTION: Persist `isDotSpell` / `dotType` / `dotDamagePerTurn` / `dotDuration` in the 09-23-005 slice. Union #647’s apply helper. Tombstones are ids only — do not add “Soul Rend” as a name key. Never infer DoT from `effectType` string vs name. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — Candid.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-008; SDA-2026-09-23-016; PR #647  
REGRESSION_RISK: HIGH — saving Inferno without `isDotSpell` restores a 0-tick. Name-tombstoning “Inferno” still strips the live id from enemy kits.  
VALIDATION_REQUIRED: Save Inferno with explicit DoT fields; refetch matches; #647 Soul Rend still applies damage. Filter tests use ids only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-078  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Trap legal-tile metadata; union #649  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#649](https://github.com/Mr-Melic/stralt/pull/649) places Trap on highlighted legal tiles. Live `spell-mark` / barrier / trap flags live on frontend `SpellConfig` (`gameTypes.ts` 229–237) and `newSpell()` seeds `isTrap: false` (`AdminDashboard.tsx` 129) but Motoko persist omits `isTrap` / `targetType` (`admin.mo` 92–127). Editor has mechanic toggles (`isSwap` / `isMirror` / `isTimestep` at 3432–3434) that do not round-trip. Combat targeting is metadata-only (`spellEngine.ts` 6–13).  
SYSTEMS_AFFECTED: `isTrap`; `freeCells`; `targetType`; SpellEditor; #649 place helper  
RECOMMENDED_ACTION: Persist `isTrap` + `freeCells` + `targetType=ground` (activate gate). Union #649’s legal-tile helper — one implementation. Never key trap off `spell.name` (“Mark”, “Glyph”). New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-016; PR #649  
REGRESSION_RISK: HIGH if Trap saves as `targetType=enemy`. Duplicate place helpers diverge.  
VALIDATION_REQUIRED: Save a trap with `targetType=ground` and `freeCells=true`; refetch matches; #649 still only highlights legal tiles. Rename the spell; placement unchanged.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-079  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Observe→win does not unlock on a 0-HP “victory”; union #652  
CATEGORY: discovery-pipeline  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#652](https://github.com/Mr-Melic/stralt/pull/652) refuses victory when live HP is 0 on the killing blow. Wave-1 discovery law is observe then **player wins that encounter** then `commitSpellDiscoveries`. There is still no observe/commit API (09-23-009). If an implementer wires unlock to `handleBattleEnd` without the HP-0 refuse, a simultaneous lethal tick could grant. Recap still has no `discoveredSpells`. 09-26-068 already said Death Realm skip feat claim waits on root recap persist.  
SYSTEMS_AFFECTED: `commitSpellDiscoveries`; victory persist; #652 live-HP gate; PostBattleRecap  
RECOMMENDED_ACTION: Grant only after the same live-win predicate #652 uses (HP > 0, last hostile dead). Observation may already be persisted; unlock does not fire on a corpse. Do not grant from Flee, preview, or AI-consider. Do not call `upgradeSpell` to grant. Union #652’s helper — one `export function`.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-26-068; PR #652  
REGRESSION_RISK: HIGH if unlock runs on the killing-blow frame where HP is already 0. Duplicate victory predicates diverge.  
VALIDATION_REQUIRED: Cast then win with HP > 0 unlocks once. Cast then lethal tick on the same blow does not unlock. Recap does not list the id. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-080  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Keep-then-feat/GameKey saveBattleStats skip is not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#657](https://github.com/Mr-Melic/stralt/pull/657) skips `saveBattleStats` wipe after a keep then feat/GameKey commit. 09-26-066 already said seeded skip-after-keep (#580 / #599) is not a grant path. `saveBattleStats` ignores spell-level arrays (`main.mo` comments 2007 / 2073); `upgradeSpell` is the sole level writer. Discovery must not hitch a ride on this skip.  
SYSTEMS_AFFECTED: persist lock; `saveBattleStats`; `commitSpellDiscoveries`; feat/GameKey commit  
RECOMMENDED_ACTION: Same as 09-26-066. Skip-after-keep is HP/Doka snapshot hygiene. Spell grants stay `commitSpellDiscoveries` / `unlockOwnedSpell` on the recap persist. Do not treat a skipped wipe as “progress already written” for ownership. Union #657 with #580 / #599 — one skip helper.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-26-066; PR #657  
REGRESSION_RISK: MEDIUM — using skip as a grant would drop or double-write owned ids.  
VALIDATION_REQUIRED: After keep then GameKey, owned set unchanged. After a real observe+win, grant still commits on recap persist. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-081  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Map-modifier built-in-pool delete is the same class as spell hard-delete  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#650](https://github.com/Mr-Melic/stralt/pull/650) refuses emptying the live built-in map-modifier pool. Open [#626](https://github.com/Mr-Melic/stralt/pull/626) refuses delete of seeded map modifiers. Spell delete is still `usableByPlayer=false` or `remove` (`main.mo` 882–902) with a confirm that claims immediate remove (`AdminDashboard.tsx` 3794). Built-in six cannot be deleted (`adminGuard.mo` `isBuiltInSpellId`). The pattern is the same: published / seeded rows retire; drafts with zero refs may delete. Do not invent a third lifecycle on modifiers and leave spells on the cast flag.  
SYSTEMS_AFFECTED: `adminDeleteSpellConfig`; map-modifier delete; Admin confirm/toast  
RECOMMENDED_ACTION: Honour #650 / #626 as the retire-vs-delete UX for **all** seeded catalogs. Spell lifecycle remains 09-23-001 (`draft | active | inactive | retired`), not `usableByPlayer`. Confirm/toast must distinguish retire / draft-delete / rejected. Do not copy modifier copy into SpellList without a dependency report (09-23-004). Union those PRs if AdminDashboard is touched.  
AUTONOMY: HUMAN_APPROVE — with 09-23-001 / 004.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-004; PR #650; PR #626  
REGRESSION_RISK: MEDIUM if spell UI starts saying “retired” while the canister still `remove`s.  
VALIDATION_REQUIRED: Built-in spell still cannot hard-delete. Unreferenced draft still can. Modifier pool cannot go empty after #650. Toast matches canister result.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-082  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist res/sp shred fields; union #658  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#658](https://github.com/Mr-Melic/stralt/pull/658) honors catalog `res_sp` shreds in `getStatModifier`. Live Expose / Shadow Veil already stamp `debuffStat` in `spellData.ts` (374–460). Motoko persist has no `debuffStat` / `buffStat`. Admin Save drops those flags. Editor has buff/debuff fields that do not round-trip. Name-matching “Expose” / “Veil” is forbidden.  
SYSTEMS_AFFECTED: buff/debuff fields; `getStatModifier`; SpellEditor  
RECOMMENDED_ACTION: Persist `buffStat` / `debuffStat` / modifiers / duration in 09-23-005. Union #658’s modifier helper — one implementation. Never key shreds off `spell.name`. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-016; PR #658  
REGRESSION_RISK: HIGH if Expose saves without `debuffStat` and combat falls back to a name branch.  
VALIDATION_REQUIRED: Save Expose; refetch `debuffStat`; #658 still shreds RES/SP. Rename the spell; shred unchanged. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-27-083  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Shield RES metadata; union #659  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#659](https://github.com/Mr-Melic/stralt/pull/659) applies Shield RES to enemy fallback melee. Live `starter-shield` stamps `targetType: "ally"` and a RES% buff in `spellData.ts` (31+). Motoko persist omits `targetType` / `buffStat`. Editor Heal option still says “Heal (targets self)” (2685) because targeting is inferred from `spellType`. A default of `enemy` on Shield would break ally targeting. Enemy fallback melee must keep reading the buff metadata, not the name “Shield”.  
SYSTEMS_AFFECTED: `targetType`; `buffStat`; SpellEditor; #659 melee RES  
RECOMMENDED_ACTION: Persist `targetType` and buff block with 09-23-005. Union #659’s RES helper. Heal/Shield targeting is `targetType`, never the option label. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-008; SDA-2026-09-23-016; PR #659  
REGRESSION_RISK: HIGH if Shield saves without `targetType=ally`. Duplicate RES helpers diverge.  
VALIDATION_REQUIRED: Save Shield with `targetType=ally` and RES buff; refetch matches; #659 still applies to enemy fallback melee. Rename the spell; RES unchanged.  
STATUS: NEW  
