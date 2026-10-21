# ACTION_IDs — 2026-10-21 Spell, Discovery & Achievement Admin Designer

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Spell, Discovery & Achievement Admin Designer.  
Design contract: [`SPELL_ADMIN_DESIGN_2026-10-21.md`](./SPELL_ADMIN_DESIGN_2026-10-21.md) (this delta) + [`SPELL_ADMIN_DESIGN_2026-08-31.md`](./SPELL_ADMIN_DESIGN_2026-08-31.md) (full studio).

**First-cuts live on unmerged [#473](https://github.com/Mr-Melic/stralt/pull/473):** `SDA-2026-09-23-001` … `028`. Treat those as the current 001–028. **Do not implement a second 10-21 copy.** 09-21 IDs live on [#353](https://github.com/Mr-Melic/stralt/pull/353); 09-22 IDs live on [#398](https://github.com/Mr-Melic/stralt/pull/398); 09-24 queue-union IDs `029` … `040` live on [#515](https://github.com/Mr-Melic/stralt/pull/515); 09-25 queue-union IDs `041` … `055` live on [#570](https://github.com/Mr-Melic/stralt/pull/570); 09-26 queue-union IDs `056` … `069` live on [#630](https://github.com/Mr-Melic/stralt/pull/630); 09-27 queue-union IDs `070` … `083` live on [#677](https://github.com/Mr-Melic/stralt/pull/677); 09-28 queue-union IDs `084` … `098` live on [#729](https://github.com/Mr-Melic/stralt/pull/729); 09-29 queue-union IDs `099` … `115` live on [#791](https://github.com/Mr-Melic/stralt/pull/791). Prior IDs `SDA-2026-08-31-001` … `013`, `SDA-2026-09-01-001` … `014`, and `SDA-2026-09-02-001` … `015` remain OPEN, PARTIAL, or LANDED as tabulated in the 09-23 / 09-29 / 10-21 designs — do not close them from this file except 09-01-002 (bindgen) and the empty-AI half of 09-02-006, which **landed**.

This run only adds **116–129** (queue after #791, plus #787 which opened minutes before #791 and was not given its own 09-29 ID). Do not implement gameplay from this file unless a later human or orchestrator explicitly picks an ID. This run ships **docs only**.

HEAD: `0f5363f` (unchanged since 09-21). Open PRs targeting `main`: **482**. Newest: **#813** (2026-09-29 21:24 UTC). Calendar: 2026-10-21.

Older still-open PRs (union, do not overwrite): **#327** then **#331**, then #333+. Keep one `export function` per name.

---

ACTION_ID: SDA-2026-10-21-116  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #802 Wave-12 SDE stamps; do not pre-own generationMin 12 ids  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#802](https://github.com/Mr-Melic/stralt/pull/802) is Wave-12 discovery (`SPELL_DISCOVERY_ECOSYSTEM_2026-09-29.md`, `generationMin: 12`). Unique §11 ids (`spell-orth-stride`, `spell-tri-oath`, `spell-brick-reel`, `spell-lone-bite`, `spell-wake-mark`, `spell-gait-plate`, `spell-glyph-skip`, `spell-full-gait`, `spell-summon-gait`, `spell-still-gift`, `spell-cadence-grace`, `spell-cast-debt`, `spell-brick-orbit`, `spell-watch-alms`, `spell-pair-gait`, `spell-leash-cut`, `spell-dry-gait`, `spell-pack-cap`, `spell-reach-fold`) stay this catalog’s. `spell-pack-cap` is `ENEMY_ONLY` on `cap_precentor`. `spell-reach-fold` is `BOSS_ONLY` on `reach_fold_regent`. `spell-dry-gait` **wins** leftover-MP=0 heal vs same-day #787 `spell-parched-mend`. Wave-12 family CORE is #679 + #726, not these unique ids. Live hydrate still grants every `starterSpells` row with `isBaseSpell: true` (`WorldExploration.tsx` 2395–2408). Copying Wave-12 unique ids into that array, or hydrating Pack Cap because `usableByPlayer !== false` (`adminSafety.ts` 711–718), makes discovery worse. 09-29-099 already said the same for Wave-11 `#747`.  
SYSTEMS_AFFECTED: create-character seed; `ownedSpellIds` migration; Wave-12 catalog; family pools; leftover feat doors  
RECOMMENDED_ACTION: Same rule as 09-23-018 / 026, 09-28-084, and 09-29-099. Honour #802 stamps (`ENEMY_DISCOVERY` default, named `MULTI_SOURCE` / `ELITE` / `ENEMY_ONLY` / `BOSS_ONLY` children). SDE unique §11 wins if a later tactical file clones the hole — do **not** also ship Parched Mend. Do not restamp Wave-1…11 doors or #726 / #787 extra doors. Do not implement Wave-12 cards in this studio PR. Innate seed remains the four ids in 09-23-003. Validator rejects `PLAYER_LEARNABLE=true` on Pack Cap / Reach Fold.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-09-23-026; SDA-2026-09-29-099; PR #802; PR #787  
REGRESSION_RISK: HIGH if migrate-from-`starterSpells` includes Wave-12 ids. HIGH if `ENEMY_ONLY` Pack Cap is hydrated because `usableByPlayer !== false`. HIGH if `reach_fold_regent` also grants Orth Stride. HIGH if Parched Mend ships as a second leftover-MP=0 heal.  
VALIDATION_REQUIRED: After a Wave-12 unique id exists in the catalog, a new character does not own it until the stamped route completes (`ENEMY_ONLY` / `BOSS_ONLY` never). Duplicate door stamps do not grant twice. Parched Mend is absent from the live catalog.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-117  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Stamp #787 Wave-12 tactical as Wave-13 CORE; Court Imprint never owned  
CATEGORY: catalog-sync  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#787](https://github.com/Mr-Melic/stralt/pull/787) (`SPELL_PROPOSALS_2026-09-29.md`, created 00:18 UTC — minutes before SDA #791) owns G≥12 tactical holes: `spell-parched-mend`, `spell-cadence-imprint`, `spell-six-span`, `spell-odd-hood`, `spell-lean-sting`, `spell-parched-step`, `spell-parched-sill`, `spell-dry-hold`, `spell-lean-lend`, `spell-parched-sip`, `spell-lean-post`, `spell-parched-bounce`, `spell-must-lean`, `spell-verse-lean`, `spell-lean-hold`, `spell-court-imprint`. Acquisition: most `ENEMY_DISCOVERY` / `MULTI_SOURCE` / `ELITE`; `spell-court-imprint` is `NOT_PLAYER_LEARNABLE`. Six Span is plus-footprint occupy of **six**; live `ENEMY_SUMMON_CAP` is still 2, so that card is implementation-blocked (`summonAI: "sixspan"` is also absent from `knownSummonAI`, `adminGuard.mo` 363–366). Extra doors `parched_cantor` / `imprint_precentor` / `span_six` / `court_imprint_regent` must not be restamped by SDE unique §11 or Wave-13 families. #802 already assigned leftover-MP=0 heal to `spell-dry-gait` — do **not** ship Parched Mend. Wave **13** families consume the remaining #787 ids as CORE. Live hydrate still pre-owns all 32 `starterSpells`. 09-29-100 covered Wave-11 tactical (#726) only.  
SYSTEMS_AFFECTED: Wave-12 tactical catalog; Wave-13 family CORE; summon cap; `ownedSpellIds`; extra-door table; `knownSummonAI`  
RECOMMENDED_ACTION: Stamp #787 ids except Parched Mend. Do not clone them into SDE unique §11. `spell-court-imprint` never enters `ownedSpellIds`. Do not activate Six Span until occupy-weight / cap exists — do not “fix” by name-matching Occupy or Sept Span. Extra doors are first-grant; do not also hang Orth Stride / Dry Gait / Reach Fold on those fights. Do not copy these ids into `starterSpells` with `isBaseSpell: true`. Closed `knownSummonAI` must grow with 09-23-002 when `sixspan` is real, not via a name parse.  
AUTONOMY: HUMAN_APPROVE — with 09-23-003 / 009.  
DEPENDENCIES: SDA-2026-09-23-003; SDA-2026-09-23-009; SDA-2026-10-21-116; SDA-2026-09-29-100; PR #787  
REGRESSION_RISK: HIGH if Court Imprint hydrates as a catalog grant. HIGH if Parched Mend ships beside Dry Gait. MEDIUM if Six Span ships while summon cap is 2 and occupy is undefined.  
VALIDATION_REQUIRED: After these ids exist in the catalog, a new character does not own Court Imprint. Parched Mend is not in `spellConfigs`. Six Span activate is rejected while occupy metadata / cap is missing. Extra-door fights grant the stamped id at most once.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-118  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #796 Wave-12 elite CORE; zone NaN still hides ADVANCED  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#796](https://github.com/Mr-Melic/stralt/pull/796) stamps Wave-12 family CORE from #726 tactical ids and leftover Wave-10 unique CORE (#679). Court Dual / Pack Close / Mid Fold stay boss/closed. SDE Wave-11 unique CORE waits for Wave 13. Live `ENEMY_KITS` is still `Record<ChessPieceType, …>` (`enemyAI.ts` 163–185). Battle start still calls `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 11920). `levelZone` is `{ name, minLevel, maxLevel }` (4683–4687), so `Math.floor` is `NaN` and every kit stays zone 0. Paper ADVANCED / RARE / ELITE / SIGNATURE rows therefore never resolve until 09-23-010 passes a **numeric** zone. 09-29-101 already said the same for Wave-11 `#752`.  
SYSTEMS_AFFECTED: `ENEMY_KITS`; future `EnemyKit` store; Wave-12 family sheets; `buildEnemyKit` call site  
RECOMMENDED_ACTION: Honour #796 stamps as CORE–SIGNATURE **ids**. Do not pre-own those ids. Pass `minLevel` or a numeric zone — never the LevelZone object (09-23-010). Closed signatures stay `ENEMY_ONLY` / `BOSS_ONLY`. Do not grow WX; extract the call site. Empty resolve still falls back to `physical_attack` **after** 09-23-007 removes that id from the purge and name tombstone. Do not mint Wave-11 unique CORE (`spell-diag-stride` …) as this pass’s CORE.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010 / 007.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-09-23-007; SDA-2026-09-23-008; SDA-2026-09-29-101; PR #796  
REGRESSION_RISK: HIGH if fixing zone NaN suddenly enables paper ADVANCED ids that are not in `spellConfigs`. HIGH if Court Dual / Pack Cap / Reach Fold is copied into `starterSpells`.  
VALIDATION_REQUIRED: Zone 0 pawn kit still resolves Strike after 007. Zone ≥ 1 pawn also gets venom-strike. Closed signatures never enter `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-119  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #808 Wave-13 boss / Rush Table K; closed signatures never owned  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#808](https://github.com/Mr-Melic/stralt/pull/808) extends `docs/design/BOSS_AND_SPELL_DISCOVERY.md` with Wave-13 boss sheets (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) and Rush Table K. Extra `ENEMY_DISCOVERY` doors reuse leftover #563 ids only: Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend. Spectacular `CHOIR_FLUSH` / `CHOIR_LONE` / `NAVE_PLATE` / `CHOIR_LEND` stay `BOSS_ONLY`. Court Hinge stays `NOT_PLAYER_LEARNABLE`. No new #137 spell ids. Live combat kits live in `data/bossKits.ts`. Motoko `defaultBossConfigs()` still lists purged ids (`admin.mo` 358+). Admin chips `getSpellConfigs()`. Three sources. 09-23-011 / 028 and 09-29-107 already require one id list.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko phase pools; Admin chips; `ownedSpellIds`  
RECOMMENDED_ACTION: Honour #808 closed signatures as `BOSS_ONLY` / `ENEMY_ONLY`. Never write them to `ownedSpellIds`. Extra doors are first-grant on the named leftover #563 ids only. Do not restamp Wave-1…12 feat doors or #726 / #787 extra doors. One canonical kit list with 09-23-011 / 028 / #449. Do not add a fourth source. Do not “fix” Motoko pools by matching names. Validator marks unresolved chips crimson.  
AUTONOMY: HUMAN_APPROVE — changes boss encounter identity.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-003; SDA-2026-09-29-107; PR #808; PR #792  
REGRESSION_RISK: MEDIUM — empty resolved pool becomes melee-only. Granting a Table K arena verb hydrates a BOSS_ONLY id. MEDIUM — restamping Cadence Flush as a Wave-13-only door double-pays a #563 id.  
VALIDATION_REQUIRED: Table K `BOSS_ONLY` ids never appear in a new character’s spellbook. Extra-door fights grant Cadence Flush / Lone Sting / Morrow Plate / Leftover Lend at most once. Admin chips match live `bossKits.ts`. Court Hinge never enters `ownedSpellIds`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-120  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #792 enemy/boss admin; do not add a fourth kit source  
CATEGORY: boss-kits  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#792](https://github.com/Mr-Melic/stralt/pull/792) is a 09-29 enemy/boss admin re-audit that **mints no new EBA IDs** (`HEAD` still `0f5363f`). Live kits: (1) `data/bossKits.ts`, (2) Motoko `defaultBossConfigs()` purged ids (`admin.mo` 358+), (3) Admin chips on `getSpellConfigs()`. `adminDeleteEnemyConfig` (`main.mo` 798–804) is still unconditional `remove`. Admin `EnemyConfig` has no spell list (`admin.mo` 15–26). 09-23-011 / 028 and 09-29-112 already require one id list with #449 / #746.  
SYSTEMS_AFFECTED: `bossKits.ts`; Motoko pools; Admin Enemy / Boss tabs; future `EnemyKit` store  
RECOMMENDED_ACTION: Consume existing EBA / 09-23-011 IDs. Do not file a fourth kit table. Enemy delete follows 09-23-004 (retire + report; hard-delete drafts only). Honour #792 as documentation, not a license to restack AdminDashboard.  
AUTONOMY: HUMAN_APPROVE — with 09-23-011.  
DEPENDENCIES: SDA-2026-09-23-011; SDA-2026-09-23-028; SDA-2026-09-23-004; SDA-2026-09-29-112; PR #792  
REGRESSION_RISK: HIGH if a fourth list diverges from live `bossKits.ts`. HIGH if enemy `remove` drops a family that still lists CORE ids.  
VALIDATION_REQUIRED: Admin chips match `bossKits.ts`. Enemy delete of a referenced config `#err`s with a dependency report after 004. No fourth kit file appears.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-121  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #798 camera-follow extract; do not grow WorldExploration  
CATEGORY: owner-ui  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#798](https://github.com/Mr-Melic/stralt/pull/798) extracts the camera-follow step from `WorldExploration.tsx` (19 213 lines) into `engine/cameraFollow.ts`. Older still-open PRs #327 / #331 / #639 / #683 / #730 already edit WX. 09-29-102 already required union with the AO extract. Studio wiring that appends observation or catalog filters inside WX will fight those extracts and fail duplicate-`export function` restack.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`; `cameraFollow.ts`; `ambientOcclusion.ts`; future observe hook  
RECOMMENDED_ACTION: Discovery / ownership helpers stay in `engine/*` / `utils/*`. WX only gets one-line call sites. If a persist PR also touches WX, union #327 / #331 / #639 / #683 / #730 / #798. Keep one `export function` per name. Do not grow WX.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 09-23-003 / 009 exist.  
DEPENDENCIES: SDA-2026-09-23-015; SDA-2026-09-29-102; PR #798; PR #730; PR #327; PR #331  
REGRESSION_RISK: MEDIUM — concatenating a second helper on restack fails `vite build`. Growing WX is forbidden.  
VALIDATION_REQUIRED: Duplicate-export scan clean. Observe hook is not inlined in WX. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-122  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Persist bomber kamikaze as summonAI metadata; union #799  
CATEGORY: spell-contract  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#799](https://github.com/Mr-Melic/stralt/pull/799) shares bomber kamikaze blast with Inferno execute (`engine/bomberKamikazeBlast.ts`). Inferno is a single-target DoT (`damage` 0, `areaRadius` 0). Decide detonates on `AI_KAMIKAZE_BLAST_RADIUS` (2); applyCast suicide lives on `damage > 0`, so the bomber spends AP and neighbors are untouched. The helper keys off `isBomber`, **not** `spell.name === "Inferno"`, and explicitly forbids writing `areaRadius: 2` onto Inferno (would rebalance the player kit). Live `inferSummonArchetype` still parses `summon.name` for `"bomber"` (`enemyAI.ts` 217–224). Motoko persist still omits `summonAI` completeness beyond the closed enum (`admin.mo` 85–90, 117–124). A name table is forbidden.  
SYSTEMS_AFFECTED: `SpellConfig` persist; `summonAI`; `bomberKamikazeBlast.ts`; SpellEditor; `enemyAI.ts`  
RECOMMENDED_ACTION: Kamikaze blast is `summonAI = "bomber"` (legacy alias `"kamikaze"` already in `knownSummonAI`, `adminGuard.mo` 363–366) plus the existing radius constant. Do not persist Inferno as AoE. Do not branch on display name. Union #799 helpers — one `export function` per name. Empty `summonAI` stays a validation error, not `"hunter"`. Not a discovery grant.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — once 09-23-002 / 005 fields exist.  
DEPENDENCIES: SDA-2026-09-23-002; SDA-2026-09-23-005; SDA-2026-09-23-008; SDA-2026-09-29-106; PR #799  
REGRESSION_RISK: HIGH if Inferno `areaRadius` becomes 2 (player kit splash). MEDIUM — a name check on “Inferno” breaks the first rename. Concatenating a second blast helper fails esbuild.  
VALIDATION_REQUIRED: Bomber detonate uses radius 2 even when Inferno `areaRadius` is 0. Player Inferno stays ST DoT. Rename Inferno; bomber blast still applies. `pnpm check` clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-123  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Union #810 spell/buff stack caps; rails are not grants  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#810](https://github.com/Mr-Melic/stralt/pull/810) adds `MAX_SPELL_LEVEL = 99` and `MAX_BUFF_STACK = 99` in sidecar `adminSafety.securityAudit.ts` (older PRs own `adminSafety.ts`) plus Motoko `securityAudit.mo`. Live `upgradeSpell` (`main.mo` 964–1065) has **no** max-level check — it doubles cost forever. `summonUnitDef.level > 99` is already rejected (`adminGuard.mo` 441–442; `adminSafety.ts` 638–640). CharacterStats has no level cap. The 99 rail is the same class as AP ≤ 12 / summon level ≤ 99, **not** a content endgame and **not** an `ownedSpellIds` writer. Buff stacks live in `${principal}_inventory`; consume from `inventoryRef`.  
SYSTEMS_AFFECTED: `upgradeSpell`; Admin spell-level display; BuffShop; future activate gate  
RECOMMENDED_ACTION: Prefer #810’s sidecar — do not recopy into `adminSafety.ts`. Studio activate / `upgradeSpell` honour the rail. Do not raise 99 → 999. Do not treat “at max level” as retired or as a grant. Do not add a Character field. Union with 09-23-001 lifecycle: a retired owned id may still sit at its frozen level.  
AUTONOMY: HUMAN_APPROVE — live actor write.  
DEPENDENCIES: SDA-2026-09-23-001; SDA-2026-09-23-003; PR #810  
REGRESSION_RISK: HIGH if 99 is documented as a character level cap. MEDIUM if the sidecar is concatenated into `adminSafety.ts` (duplicate export / restack fight).  
VALIDATION_REQUIRED: `upgradeSpell` at level 99 returns the cap error on both client and Motoko after #810. Level 98 still charges `base * 2^98` within Doka rules. Inventory 99 rejects a further buy. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-124  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Remount skips continue after #791; not a grant path  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: 09-29-113 already covered #742 / #756 / #759 / #764 / #767 remount / leftover-XP skips. After #791: [#800](https://github.com/Mr-Melic/stralt/pull/800) one-shot Doka keep, [#807](https://github.com/Mr-Melic/stralt/pull/807) victory XP keep, [#811](https://github.com/Mr-Melic/stralt/pull/811) GameKey keep, [#812](https://github.com/Mr-Melic/stralt/pull/812) feat-claim keep, [#813](https://github.com/Mr-Melic/stralt/pull/813) leftover-XP keep. Each is a new sidecar so older PRs keep their files. `saveBattleStats` never mints and ignores spell-level arrays. `claimAchievementReward` pays **Doka only**. Discovery must not piggy-back these skips. `ownedSpellIds` / `observedSpellIds` are append-only on the persist lock (09-23-009).  
SYSTEMS_AFFECTED: `saveBattleStats` skip helpers; persist lock; future observe/commit; feat claim  
RECOMMENDED_ACTION: Same rule as 09-28-095 / 09-29-113. Union the new skip helpers; one `export function` per name. Do not write owned/observed ids inside a remount skip. Feat-claim keep is Doka, not a `spellRewardIds` commit. Death does not clear observation; victory without re-observation does not unlock (default).  
AUTONOMY: IMPLEMENT_AFTER_HUMAN — mechanical once 009 exists.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-29-113; PRs #800 / #807 / #811 / #812 / #813  
REGRESSION_RISK: HIGH if a feat-claim remount skip is treated as a victory commit and grants an observed id. MEDIUM — concatenating a second skip helper fails esbuild.  
VALIDATION_REQUIRED: Feat-claim remount does not append `ownedSpellIds`. Observation from the lost fight stays. A later win without re-cast does not unlock. Duplicate-export scan clean.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-125  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #793 Ember slayer rungs; leftover feats unused as spell gates  
CATEGORY: feat-challenge-rewards  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#793](https://github.com/Mr-Melic/stralt/pull/793) mints EXP-2026-09-29-035: repeating Ember Knight slayer conditions `ember_slayer_5` / `ember_slayer_15` / `ember_slayer_40`, Doka on claim (50 / 100 / 200). Live achievements cannot grant spells (`AchievementConfig` has only `dokaReward`, `admin.mo` 249–256). `KNOWN_ACHIEVEMENT_CONDITIONS` is a closed 15-key whitelist (`adminSafety.ts` 306–322); unknown keys fail GameConfig seed. `unstoppable` / `level_10` stays a capped milestone. 09-29-111 already locked leftover doors (`first_blood`, `survivor`, `doka_hoarder`, …) as unused spell gates. 035 keys `family === "ember_knight"`, never the display name.  
SYSTEMS_AFFECTED: leftover feat-door table; `spellRewardIds`; `KNOWN_ACHIEVEMENT_CONDITIONS`; Expansion catalog  
RECOMMENDED_ACTION: Do not hang a Wave-12 / Wave-13 id on Ember slayer rungs. 035 is Doka-only; new keys join the whitelist, they do not become `spellRewardIds`. `unstoppable` stays Doka-only. New grants use 09-23-012 explicit ids on **named** unused doors only when a designer claims one. Honour 09-28-097 / 09-29-111 copy.  
AUTONOMY: HUMAN_APPROVE — with 09-23-012.  
DEPENDENCIES: SDA-2026-09-23-012; SDA-2026-09-29-111; PR #793  
REGRESSION_RISK: MEDIUM — restamping `ember_slayer_*` as a spell door collides with a later identity card. MEDIUM — adding the keys without the whitelist rejects GameConfig seed.  
VALIDATION_REQUIRED: Reaching Ember 5/15/40 still pays Doka only. `first_blood` / `unstoppable` do not append an owned spell id. Unknown condition keys still fail seed. Count keys off `family`, not `"Ember Knight"`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-126  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #794 Wave-11 formations; consume CORE ids, do not grant  
CATEGORY: enemy-pools  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#794](https://github.com/Mr-Melic/stralt/pull/794) proposes 16 world-pack formations that consume Wave-11 families from #752. Live `EnemyFamily` remains the original seven (`gameTypes.ts` 12–20). Formations are spawn composition, not `ownedSpellIds` writers. Zone NaN still hides ADVANCED kits (`WorldExploration.tsx` 11920). 09-23-010 / 09-29-101 already require numeric zone + CORE–SIGNATURE ids.  
SYSTEMS_AFFECTED: future formation store; Wave-11 family sheets; `ownedSpellIds`  
RECOMMENDED_ACTION: Consume #752 / #796 CORE ids inside formation recipes. Do not pre-own those ids. Do not treat a formation clear as `ENEMY_DISCOVERY` unless a named extra door is stamped. Do not edit `mapGen.ts`. Do not add a fourth kit source.  
AUTONOMY: HUMAN_APPROVE — with 09-23-010.  
DEPENDENCIES: SDA-2026-09-23-010; SDA-2026-10-21-118; SDA-2026-09-29-101; PR #794; PR #752  
REGRESSION_RISK: MEDIUM — a formation victory that grants every CORE id in the pack hydrates Wave-11 catalog rows.  
VALIDATION_REQUIRED: Clearing a Wave-11 formation does not append `ownedSpellIds` unless a named door is stamped. Live spawn still uses the original seven families until 001 ships.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-127  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Honour #804 AI increment; AI modules in the dependency view  
CATEGORY: dependency-safety  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#804](https://github.com/Mr-Melic/stralt/pull/804) is the 09-29 enemy AI evolution increment (design only). 08-31 §7 requires spell → AI modules on the inspector. Live `inferArchetype` still classifies healer from `healAmount > 0` and berserker from `family.includes("berserk")` (`enemyAI.ts` 447–477). `inferSummonArchetype` still parses `summon.name` (`enemyAI.ts` 217–224). Closed `knownSummonAI` omits `font` / `dummypost` / `pentaspan` / `septspan`. Retire/delete of a kit id must surface AI-module refs; hard-delete of a draft with an authored AI profile that still lists the id must `#err`.  
SYSTEMS_AFFECTED: future dependency inspector; `enemyAI.ts`; SpellEditor; AI module catalog  
RECOMMENDED_ACTION: Inspector lists AI modules by **id**, not by scanning display names. Honour #804 as documentation of modules; do not grow `enemyAI.ts` tables from this studio. Empty `summonAI` is a validation error (09-23-002 / 008), not `"hunter"`. `family.includes("berserk")` is a name heuristic — do not add more.  
AUTONOMY: HUMAN_APPROVE — with 09-23-004 / 002.  
DEPENDENCIES: SDA-2026-09-23-004; SDA-2026-09-23-002; SDA-2026-09-23-008; PR #804  
REGRESSION_RISK: MEDIUM — inferring `summonAI` from “Bomber” / “Wolf” on activate would fight #799 metadata.  
VALIDATION_REQUIRED: Retire of a CORE id lists the family / AI module that references it. Rename the spell; the AI module still resolves by id. Activate rejects unknown `summonAI`.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-128  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Challenge first-action / leftover-walk item use are not grants  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#809](https://github.com/Mr-Melic/stralt/pull/809) locks challenge offer through a no-op Attack Nearest (`challengeFirstAction.ts`). Open [#805](https://github.com/Mr-Melic/stralt/pull/805) locks leftover-walk BuffShop Use and potion `healUsed`. Challenges still `{ doka, xp, badge }` (`challengeCompletion.ts`). Observation requires a hostile AP-spent `kind === "cast"` (08-31 §5). Attack Nearest that spends no AP is not a cast. Potion use is inventory, not a spell id. 09-29-108 already said leftover AP is not a grant.  
SYSTEMS_AFFECTED: challenge offer; leftover-walk gates; persist lock; future observe/commit  
RECOMMENDED_ACTION: Do not treat first-action no-ops, Attack Nearest rejects, or leftover-walk item use as `recordSpellObservation` / `unlockOwnedSpell`. Challenge spell grants stay 09-23-012 explicit `rewards.spellIds`. Honour #809 / #805 contracts; do not invent a second first-action table.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009 / 012.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-012; SDA-2026-09-29-108; PR #809; PR #805  
REGRESSION_RISK: HIGH if a no-op Attack Nearest is counted as observation of Strike. MEDIUM if potion `healUsed` is mistaken for a heal-spell observe.  
VALIDATION_REQUIRED: No-op Attack Nearest does not observe or unlock. Leftover-walk potion use does not append `ownedSpellIds`. Challenge completion still pays badge/Doka/XP only unless a named `spellIds` reward exists.  
STATUS: NEW  

---

ACTION_ID: SDA-2026-10-21-129  
SOURCE_AUTOMATION: Spell, Discovery & Achievement Admin Designer  
TITLE: Boss Rush complete(9) is not a spell grant  
CATEGORY: ownership-persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Open [#803](https://github.com/Mr-Melic/stralt/pull/803) keeps `completeBossRushRoom(9)` ahead of `resetBossRush`. Live `completeBossRushRoom` ignores client `dokaReward`/`xpReward` (AGENTS.md). Character must exist before mutation. Room-clear `applyRewards` only after `currentRoom` actually advanced. Recap still XP/Doka/feats — `attachRecapUnlocks` is achievements only. There is no Rush → `ownedSpellIds` writer. Table K (#808) / Table J (#753) closed signatures stay `BOSS_ONLY`.  
SYSTEMS_AFFECTED: Boss Rush persist; recap; future observe/commit  
RECOMMENDED_ACTION: Do not append `ownedSpellIds` from `completeBossRushRoom` or `resetBossRush`. Rush extra doors stay the named `BOSS` / `SPECIAL_ENCOUNTER` stamps on 09-23-012. `applyRewards` remains XP/Doka. Honour #803 ordering; do not invent a second Rush complete.  
AUTONOMY: HUMAN_APPROVE — with 09-23-009 / 012.  
DEPENDENCIES: SDA-2026-09-23-009; SDA-2026-09-23-012; SDA-2026-10-21-119; SDA-2026-09-29-107; PR #803  
REGRESSION_RISK: HIGH if room 9 complete hydrates Table K arena verbs. MEDIUM if reset after complete(9) is treated as a second grant.  
VALIDATION_REQUIRED: Completing room 9 does not append `ownedSpellIds`. Reset after complete(9) does not grant. Recap shows XP/Doka/feats only unless a named Rush door was observed+won.  
STATUS: NEW  
