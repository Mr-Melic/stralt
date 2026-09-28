# ACTION_IDs — 2026-09-28 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-09-28.md`](./SPELL_ADMIN_DESIGN_2026-09-28.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 09-28 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 design — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **084–098** (queue after #677). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21).

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. SDA-relevant additions since #677: **#679** (Wave-10 SDE), **#695** (Wave-10 tactical), **#686** (Wave-10 elite), **#683** (ground-Doka extract), **#700** (kit Shield/Slow/Poison), **#692** (CHC self-heal), **#699** (ally Enrage), **#696** (Inferno cooldown copy), **#714** (Pacifist kit casts), **#707** (CRC KEEP/FIX Strike), **#709** (Sentinel Shield RES), **#698** / **#705** / **#710** (death-cut skips), **#703** (last-live modifier chance), **#690** (Claim-in-Feats copy), **#724** (owner lifecycle **copy** helpers). Keep one `export function` per name.

---

ACTION_ID: SDA-2026-09-28-084  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #679 Wave-10 SDE stamps; do not pre-own generationMin 10 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#679](https://github.com/Mr-Melic/stralt/pull/679) is Wave-10 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-27.md`, `generationMin: 10`). Unique §11 ids (`spell-inch-stride`, `spell-rite-first`, `spell-long-oath`, `spell-cinder-reel`, `spell-side-bite`, `spell-ingress-mark`, `spell-off-plate`, `spell-spike-skip`, `spell-tapped-plate`, `spell-summon-brace`, `spell-bar-mend`, `spell-cadence-pin`, `spell-still-tax`, `spell-brick-sprout`, `spell-watch-fee`, `spell-lone-purse`, `spell-banner-cut`, `spell-pack-close`, `spell-mid-fold`) stay this catalog’s. `spell-pack-close` is `ENEMY_ONLY` on `close_precentor`. `spell-mid-fold` is `BOSS_ONLY`. Leftover feat door `survivor` stays unused as a spell gate. Tactical Wave-10 ids are stamped from #695, not cloned. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-10 unique ids into that array, or hydrating Pack Close because `usableByPlayer !== false` (`adminSafety.ts` 712–718), makes discovery worse. 09-27-070 already said the same for Wave-9 `#646`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-10 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-26-056, and 09-27-070. Honour #679 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole. Do not restamp Wave-1…9 doors or #695 extra doors (`both_cantor` / `stride_bursar` / `span_penta` / `trim_precentor` / `court_keep_regent`). Do not implement Wave-10 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Close / Mid Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-09-27-070; PR #679; PR #695  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-10 ids. HIGH if `ENEMY_ONLY` Pack Close is hydrated because `usableByPlayer !== false`. HIGH if `mid_fold_regent` also grants Inch Stride.  
VALIDATION_REQUIRED: After a Wave-10 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-085  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #695 Wave-10 tactical; Court Keep never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#695](https://github.com/Mr-Melic/stralt/pull/695) (`SPELL_PROPOSALS_2026-09-27.md`) owns G≥10 tactical holes: `spell-both-mend`, `spell-stride-keep`, `spell-penta-span`, `spell-cadence-trim`, `spell-near-hood`, `spell-gait-sip`, `spell-cast-sill`, `spell-shove-sting`, `spell-must-step`, `spell-ally-step`, `spell-damp-sting`, `spell-pair-pace`, `spell-verse-tax`, `spell-tool-hold`, `spell-spent-lend`, `spell-court-keep`. Acquisition: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-keep` is `NOT_PLAYER_LEARNABLE`. Penta Span is plus-footprint occupy of **five**; live `ENEMY_SUMMON_CAP` is still 2, so that card is implementation-blocked (`summonAI: "pentaspan"` is also absent from `knownSummonAI`, `adminGuard.mo` 363–366). Extra doors `both_cantor` / `stride_bursar` / `span_penta` / `trim_precentor` / `court_keep_regent` must not be restamped by SDE unique §11 or Wave-11 families. Live hydrate still pre-owns all 32 `starterSpells`.  
SYSTEMS_AFFECTED: Wave-10 tactical catalog; summon cap; `ownedSpellIds`; extra-door table; `knownSummonAI`  
RECOMMENDED_ACTION: Stamp #695 ids; do not clone them into SDE unique §11. `spell-court-keep` never enters `ownedSpellIds`. Do not activate Penta Span until occupy-weight / cap exists — do not “fix” by name-matching Occupy. Extra doors are first-grant; do not also hang Inch Stride / Bar Mend / Mid Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`. Closed `knownSummonAI` must grow with 09-23-002 when `pentaspan` is real, not via a name parse.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-28-084; SDA-2026-09-27-071; PR #695  
REGRESSION_RISK: HIGH if Court Keep hydrates as a catalog grant. MEDIUM if Penta Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Keep. Penta Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-086  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #686 Wave-10 elite CORE; zone NaN still hides ADVANCED  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#686](https://github.com/Mr-Melic/stralt/pull/686) stamps Wave-10 family CORE from #636 tactical ids and leftover Wave-8 unique CORE. Court Stretch / Pack Tithe / About Hinge stay boss/closed. SDE Wave-9 unique CORE waits for Wave 11. Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }`, so `Math.floor` is `NaN` and every kit stays zone 0. Paper ADVANCED / RARE / ELITE / SIGNATURE rows therefore never resolve until 09-23-010 passes a **numeric** zone.  
SYSTEMS_AFFECTED: `ENEMY_KITS`; future `EnemyKit` store; Wave-10 family sheets; `buildEnemyKit` call site  
RECOMMENDED_ACTION: Honour #686 stamps as CORE–SIGNATURE **ids**. Do not pre-own those ids. Pass `minLevel` or a numeric zone — never the LevelZone object (09-23-010). Closed signatures stay `ENEMY_ONLY` / `BOSS_ONLY`. Do not grow WX; extract the call site. Empty resolve still falls back to `physical_attack` **after** 09-23-007 removes that id from the purge and name tombstone.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 007.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-23-008; PR #686  
REGRESSION_RISK: HIGH if fixing zone NaN suddenly enables paper ADVANCED ids that are not in `spellConfigs`. HIGH if Court Stretch is copied into `starterSpells`.  
VALIDATION_REQUIRED: Zone 0 pawn kit still resolves Strike after 007. Zone ≥ 1 pawn also gets venom-strike. Closed signatures never enter `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-087  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #683 ground-Doka extract; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#683](https://github.com/Mr-Melic/stralt/pull/683) extracts ground Doka spawn from `WorldExploration.tsx` (19 213 lines) into `engine/groundDokaSpawn.ts`. Older still-open PRs #327 / #331 / #639 already edit WX. 09-27-074 already required union with the iso-grid extract. Studio wiring that appends observation or catalog filters inside WX will fight those extracts and fail duplicate-`export function` restack.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `groundDokaSpawn.ts`; future observe hook  
RECOMMENDED_ACTION: Discovery / ownership helpers stay in `engine/*` / `utils/*`. WX only gets one-line call sites. If a persist PR also touches WX, union #327 / #331 / #639 / #683 / #591 / #606. Keep one `export function` per name. Do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 09-23-003 / 009 exist.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-27-074; PR #683; PR #639; PR #327; PR #331  
REGRESSION_RISK: MEDIUM — concatenating a second helper on restack fails `vite build`. Growing WX is forbidden.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Observe hook is not inlined in WX. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-088  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist kit Shield/Slow/Poison metadata; union #700  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#700](https://github.com/Mr-Melic/stralt/pull/700) copies `buffStat` / `debuffStat` / `dotDamagePerTurn` on auto-summon kit casts (`kitCastStatusEffect`). Live Shield stamps `buffStat: "res"` / `1.3` (`spellData.ts` 31–47). Poison Arrow stamps `isDotSpell` + `dotDamagePerTurn`. Slow stamps `debuffStat: "mp"`. Motoko persist has no those fields (`admin.mo` 92–127). Admin Save drops them. Editor mechanic toggles do not round-trip. Name-matching “Shield” / “Iron Skin” / “Poison Arrow” is forbidden (`summonSpawn.ts` 165 still strips `"Summon "` from the unit **name**). 09-27-077 / 082 / 083 already required the same persist slice for Soul Rend / shreds / Shield RES.  
SYSTEMS_AFFECTED: buff/debuff/DoT fields; `summonExecutor`; SpellEditor; #700 helper  
RECOMMENDED_ACTION: Persist `buffStat` / `debuffStat` / `isDotSpell` / `dotDamagePerTurn` / `targetType` in 09-23-005. Union #700’s `kitCastStatusEffect` — one implementation. Never key kit status off `spell.name`. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-008; SDA-2026-09-23-016; SDA-2026-09-27-077; SDA-2026-09-27-082; PR #700  
REGRESSION_RISK: HIGH if Shield saves without `buffStat` and combat falls back to a name branch. Duplicate kit-status helpers diverge.  
VALIDATION_REQUIRED: Save Shield / Slow / Poison; refetch metadata; #700 still applies RES / −2 MP / DoT ticks. Rename the spells; effects unchanged. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-089  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Blood Mend / Rallying Cry CHC; union #692  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#692](https://github.com/Mr-Melic/stralt/pull/692) applies advertised `buffStat: "chc"` / `0.15` on highlighted self-heals. Live `starter-heal` and `spell-rallying-cry` already stamp those fields plus `targetType: "self"` (`spellData.ts` 85–101, 417–435). Motoko persist omits `buffStat` / `targetType`. Editor Heal option still says “Heal (targets self)” (`AdminDashboard.tsx` 2685) because targeting is inferred from `spellType`. A default of `enemy` on Blood Mend would break the self tile. Rallying Cry `healAmount > 0` still early-returns on some summon paths (#550 / #700 note).  
SYSTEMS_AFFECTED: `targetType`; `buffStat`; SpellEditor; #692 `playerHealCast`  
RECOMMENDED_ACTION: Persist `targetType=self` and the CHC buff block with 09-23-005. Union #692’s helper — one implementation. Heal targeting is `targetType`, never the option label or the name “Blood Mend”. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-008; SDA-2026-09-23-016; PR #692  
REGRESSION_RISK: HIGH if Mend saves without `targetType=self`. Duplicate heal-buff helpers diverge.  
VALIDATION_REQUIRED: Save Blood Mend; refetch `targetType=self` and `buffStat=chc`; #692 still writes the 1.15 CHC row. Rename the spell; buff unchanged.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-090  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist ally Enrage targetType + dmg buff; union #699  
CATEGORY: spell-contract  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#699](https://github.com/Mr-Melic/stralt/pull/699) applies ally Enrage to summon outgoing damage via `summonOutgoingCasterId`. Live `spell-enrage` is `targetType: "ally"`, `buffStat: "dmg"`, `buffModifier: 1.4` (`spellData.ts` 274–291) while the **description** says “Buff own DMG”. Motoko persist omits `targetType` / `buffStat`. Admin Save would drop both. Editor has no `targetType` control. Inferring “self” from the description is a name/copy heuristic.  
SYSTEMS_AFFECTED: `targetType`; `buffStat`; SpellEditor; #699 outgoing-caster helper  
RECOMMENDED_ACTION: Persist `targetType=ally` and `buffStat=dmg`. Union #699’s helper. Description is presentation — activate gate reads metadata, not copy. Fix the lying description in the same persist PR if the owner wants honesty, but do not key combat off it. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-23-008; SDA-2026-09-23-016; PR #699  
REGRESSION_RISK: HIGH if Enrage saves as `targetType=self` and ally summons stop receiving the buff. Duplicate outgoing-caster helpers diverge.  
VALIDATION_REQUIRED: Save Enrage with `targetType=ally` and `buffStat=dmg`; refetch matches; #699 still multiplies summon outgoing. Rename the spell; buff unchanged.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-091  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Inferno cooldown copy reads cooldown, never the name  
CATEGORY: no-heuristics  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#696](https://github.com/Mr-Melic/stralt/pull/696) appends `3-turn cooldown` via `spellCardDescriptionWithCooldown` because Inferno is the only gifted starter with `cooldown: 3` (`spellData.ts` 502–522). Motoko persist already has `cooldown` (`admin.mo` 125–126). Editor has a cooldown input. `OLD_SPELL_NAMES_SET` already tombstones display name `Inferno` and id `inferno` (WX 2360, 2382) while the **live** id is `spell-inferno`. A helper that special-cases `name === "Inferno"` or `id === "inferno"` would strip the live card from kits (09-23-007 / 008).  
SYSTEMS_AFFECTED: `cooldown` on `SpellDefinition`; gifted-card copy; tombstone list  
RECOMMENDED_ACTION: Keep #696’s helper keyed on the numeric `cooldown` field (and id). Never add `"Inferno"` as a name branch. Tombstones are ids only — do not include live `spell-inferno`. Persist `cooldown` already exists; activate gate still requires 0–10.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 09-23-007 / 008 land.  
DEPENDENCIES: SDA-2026-09-23-007; SDA-2026-09-23-008; PR #696  
REGRESSION_RISK: MEDIUM — name-tombstoning “Inferno” still strips the live id from enemy kits.  
VALIDATION_REQUIRED: Gifted Inferno card names the 3-turn cooldown. Rename the spell; copy still names the cooldown. Filter tests use ids only.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-092  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Pacifist uses metadata categories; union #714  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#714](https://github.com/Mr-Melic/stralt/pull/714) fails `pacifist_run` after offensive **kit** casts (`recordSpellType` on controlled-summon resolve). Achievement condition is the whitelist key `pacifist_run` (`adminGuard.mo` 529; `admin.mo` 323). Rewards are still Doka-only (`AchievementConfig` 249–256). Offensive vs heal/buff must stay metadata (`spellType` / `effectType` / damage/heal/DoT flags), never “Poison Arrow” / “Inferno” / “Venom” name lists. 09-23-012 still adds `spellRewardIds`; this ID does not invent a Pacifist spell grant.  
SYSTEMS_AFFECTED: `pacifistRun.ts`; `markAchievementUnlocked`; AchievementEditor; recap  
RECOMMENDED_ACTION: Union #714’s category helper — one implementation. Feat unlock stays the condition key + Doka. If a later card grants a spell on Pacifist, that is an explicit `spellRewardIds` row (09-23-012), not a name match. Preview / range highlight must not flip the feat.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-012 exists if a spell reward is added; otherwise honour #714 as-is.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-23-008; PR #714  
REGRESSION_RISK: MEDIUM if a name list of “offensive” kit ids drifts from metadata.  
VALIDATION_REQUIRED: Archer Poison / Wolf Strike / Bomber Inferno fail Pacifist. Wisp heal / Sentinel shield / Slow-only keep it. Rename Inferno; still fails. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-093  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #707 CRC; Strike is KEEP/FIX, not hard-delete  
CATEGORY: dependency-safety  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Open [#707](https://github.com/Mr-Melic/stralt/pull/707) (`CONTENT_RETIREMENT_AUDIT_2026-09-27.md`) records `SAFE_TO_REMOVE` persist ids = **none**. Highest-priority keep/fix: live starter Strike (`physical_attack`) is still on `OLD_SPELL_IDS` (`main.mo` 689–697) and `OLD_SPELL_NAMES_SET` (WX 2370, 2386). That is every-upgrade purge **plus** enemy-kit miss. Soft-retire remains the default. Spell delete is still `usableByPlayer=false` or `remove` (`main.mo` 882–902). 09-23-007 already required removing live Strike from both lists. CRC must not be read as license to delete `physical_attack`.  
SYSTEMS_AFFECTED: `OLD_SPELL_IDS`; `OLD_SPELL_NAMES_SET`; `adminDeleteSpellConfig`; CRC ledger  
RECOMMENDED_ACTION: Honour CRC: no persist id is safe to hard-delete. Implement 09-23-007 (seed starters; drop live Strike from purge **and** id tombstone; keep purge for truly dead ids such as `fireball`). Lifecycle remains 09-23-001 (`draft | active | inactive | retired`). Already-owned retired ids keep levels/bar (08-31 §8.2). Do not overwrite CRC files.  
AUTONOMY: HUMAN_APPROVE — purge-list edit is irreversible on canister start.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-007; SDA-2026-09-23-004; PR #707  
REGRESSION_RISK: HIGH if purge still drops `physical_attack` after seed. HIGH if CRC “unused paper” is treated as license to `remove` live kits.  
VALIDATION_REQUIRED: `upgradeSpell("physical_attack")` returns `#ok` after 007. Purge still removes `fireball`. CRC still lists Strike as KEEP/FIX.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-094  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist Sentinel Shield RES on allied summons; union #709  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#709](https://github.com/Mr-Melic/stralt/pull/709) applies Sentinel Shield RES to the clicked allied summon. Live `starter-shield` is `targetType: "ally"`, `buffStat: "res"`, `1.3` / 3 turns (`spellData.ts` 31–47). 09-27-083 already required the same persist for enemy fallback melee (#659). Motoko persist still omits `targetType` / `buffStat`. Editor Heal option still implies self. A default of `enemy` on Shield would break ally targeting for **both** #659 and #709.  
SYSTEMS_AFFECTED: `targetType`; `buffStat`; SpellEditor; #709 / #659 RES helpers  
RECOMMENDED_ACTION: Persist Shield `targetType=ally` and RES buff with 09-23-005. Union #709 with #659 — one RES reader. Never key Shield off `spell.name`. New fields need 09-23-016.  
AUTONOMY: HUMAN_APPROVE — with 09-23-005.  
DEPENDENCIES: SDA-2026-09-23-005; SDA-2026-09-27-083; PR #709; PR #659  
REGRESSION_RISK: HIGH if Shield saves without `targetType=ally`. Duplicate RES helpers diverge.  
VALIDATION_REQUIRED: Save Shield; refetch matches; #709 still applies to the clicked allied summon and #659 still applies to enemy fallback melee. Rename the spell; RES unchanged.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-095  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Death-cut saveBattleStats skip is not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#698](https://github.com/Mr-Melic/stralt/pull/698) / [#705](https://github.com/Mr-Melic/stralt/pull/705) / [#710](https://github.com/Mr-Melic/stralt/pull/710) skip `saveBattleStats` wipe after death-cut keep / confirmed credit / remount replay. 09-27-080 already said keep-then-feat/GameKey skip (#657) is not a grant. `saveBattleStats` ignores spell-level arrays (`main.mo` comments around 2007 / 2073); `upgradeSpell` is the sole level writer. Discovery must not hitch a ride on these skips.  
SYSTEMS_AFFECTED: persist lock; `saveBattleStats`; `commitSpellDiscoveries`; death-cut replay  
RECOMMENDED_ACTION: Same as 09-26-066 / 09-27-080. Death-cut skip is HP/Doka snapshot hygiene. Spell grants stay `commitSpellDiscoveries` / `unlockOwnedSpell` on the recap persist. Do not treat a skipped wipe as “progress already written” for ownership. Union #698 / #705 / #710 with #657 / #580 / #599 — one skip helper.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-27-080; PR #698; PR #705; PR #710  
REGRESSION_RISK: MEDIUM — using skip as a grant would drop or double-write owned ids.  
VALIDATION_REQUIRED: After death-cut keep / remount, owned set unchanged. After a real observe+win, grant still commits on recap persist. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-096  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Last-live modifier chance 0 is the same class as spell hard-delete  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#703](https://github.com/Mr-Melic/stralt/pull/703) rejects last-live map-modifier chance of 0. 09-27-081 already paired #650 (refuse emptying the built-in pool) and #626 (refuse delete of seeded modifiers) with spell retire-vs-delete. Spell delete is still `usableByPlayer=false` or `remove` (`main.mo` 882–902) with a confirm that claims immediate remove (`AdminDashboard.tsx` 3794). Zeroing the last live modifier chance is the same silent-corrupt class as hard-deleting the last kit id.  
SYSTEMS_AFFECTED: `adminDeleteSpellConfig`; map-modifier chance writes; Admin confirm/toast  
RECOMMENDED_ACTION: Honour #703 / #650 / #626 as the retire-vs-empty UX for **all** seeded catalogs. Spell lifecycle remains 09-23-001. Confirm/toast must distinguish retire / draft-delete / rejected. Do not copy modifier copy into SpellList without a dependency report (09-23-004). Union those PRs if AdminDashboard is touched.  
AUTONOMY: HUMAN_APPROVE — with 09-23-001 / 004.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-004; SDA-2026-09-27-081; PR #703; PR #650  
REGRESSION_RISK: MEDIUM if spell UI starts saying “retired” while the canister still `remove`s.  
VALIDATION_REQUIRED: Built-in spell still cannot hard-delete. Unreferenced draft still can. Last-live modifier chance cannot go to 0 after #703. Toast matches canister result.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-097  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Claim-in-Feats copy and leftover feat doors are not grants  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#690](https://github.com/Mr-Melic/stralt/pull/690) locks Claim-in-Feats player-journey copy. `claimAchievementReward` still pays Doka only (`main.mo` 2516–2550). Wallet/level feats still defer until `applyRewards` (`adminSafety.ts` `shouldDeferAchievementUnlockUntilRewardsPersist`). Wave-10 SDE (#679) leaves leftover feat `survivor` unused as a spell gate; Wave-9 leftover `jackpot` / `unstoppable` stay unused (09-27-070). There is still no `spellRewardIds`. Treating Claim copy, a feat toast, or a leftover condition key as `unlockOwnedSpell` would grant without observation or an explicit reward id.  
SYSTEMS_AFFECTED: Feats UI; `claimAchievementReward`; leftover feat doors; future `spellRewardIds`  
RECOMMENDED_ACTION: Claim copy stays Doka claim. Leftover feat doors (`survivor` / `jackpot` / `unstoppable`) stay unused as spell gates unless a later catalog **explicitly** stamps them. Grants wait on 09-23-012 + 09-23-003. Do not infer a spell from the achievement name “Survivor”.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — copy can land with #690; grants wait on persist.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-23-003; SDA-2026-09-27-070; PR #690; PR #679  
REGRESSION_RISK: MEDIUM if a leftover feat door is silently reused as a Wave-10 grant.  
VALIDATION_REQUIRED: Claim still pays Doka only. New character does not own a spell after unlocking Survivor. Named leftover doors are not also Wave-10 first-wins.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-09-28-098  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #724 owner-lifecycle copy; do not treat AUX labels as persist  
CATEGORY: lifecycle-tooling  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Same-morning [#724](https://github.com/Mr-Melic/stralt/pull/724) adds `adminOwnerUx.lifecycle.ts` (DRAFT / VALIDATION FAILED / READY TO ACTIVATE / ACTIVE / INACTIVE / LEGACY copy), `adminOwnerUx.deps.ts` (read-only relationship badges), and `adminOwnerUx.visualPool.ts`. Editor wiring is deferred. Live persist is still `adminSetSpellConfig` overwrite (`main.mo` 869–880) and retire-as-`usableByPlayer=false` (`main.mo` 882–902). 09-23-001 / 004 / 013 are the canister lifecycle, dependency report, and activate/rollback. AUX labels that say READY TO ACTIVATE while Save still publishes live would lie the same way the current “Spell deleted” toast lies (`AdminDashboard.tsx` 6166).  
SYSTEMS_AFFECTED: `adminOwnerUx.*`; SpellEditor extract; `adminSetSpellConfig`; future `lifecycle`  
RECOMMENDED_ACTION: Union #724 helpers — one `export function` per name. Do not concatenate a second lifecycle copy module. Wire those strings only after 09-23-001 exists on the canister. Do not grow AdminDashboard (8 280) to attach the helpers. A saved local draft cannot appear in `getSpellConfigs` until activate. LEGACY copy must not mean `usableByPlayer=false`. Dependency badges wait on 09-23-004’s real graph, not a client-only list.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — copy can merge; persist stays 09-23-001 / 013.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-004; SDA-2026-09-23-013; SDA-2026-09-27-075; PR #724  
REGRESSION_RISK: HIGH if AUX ACTIVE is shown on a live overwrite that combat already reads. MEDIUM if a second `adminOwnerUx` copy lands on restack.  
VALIDATION_REQUIRED: After #724 merges, `#admin` still gated. Duplicate-export scan clean. Player hydrate unchanged by a browser draft. Retire toast still matches the canister until 09-23-001 lands.  
STATUS: NEW  
