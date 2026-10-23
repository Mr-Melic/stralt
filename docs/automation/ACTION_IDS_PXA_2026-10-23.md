# ACTION_IDs — 2026-10-23 (Player Experience Coherence Auditor)

**Source:** Player Experience Coherence Auditor (`30118f7c-a49e-11f1-a7d1-d6b4613131ce`)  
**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Narrative:** [`PX_COHERENCE_AUDIT_2026-10-23.md`](./PX_COHERENCE_AUDIT_2026-10-23.md)

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
- `PXA-2026-10-21-001` … `003` (PR **#844** — three fire DoT names; Windstorm miss starts Inferno CD; forge AP 10 / MP 5 vs battle 8 / 4)
- `PXA-2026-10-22-001` … `003` (PR **#907** — `res_sp` unread + drain healAmount vs 50%-once; Barrier 2 vs 3; three MP-slow names). Do not twin EBMA-004 / #528 / #555 / #878.

Gameplay / production code was **not** modified this run. Do not implement from this file unless a human or the Report Action Orchestrator picks an ID.

`origin/main` has not moved since the 09-21…10-22 audits. New IDs are new *reads* of the same bytes (Weaken `dmg` / Cursed Wound `healRecv` unread on the pack after the queued rider wire; Shield RES skips Crush while Shield Charm fights it; four live reflect rates).

**Do not twin** player `debuffStat` apply: `EBMA-2026-09-02-004`, open PRs **#528** (Weaken/Slow on highlighted hostiles), **#555** (advertised `debuffStat` after player hits), **#878** (summon kit Slow `stat`). Summon nametag Slow is also `EBMA-2026-09-02-006`. Drain `healUsed` is `EBMA-2026-09-02-005`. Blood Mend / Rally CHC is EBMA. `res_sp` / drain printed heals are 10-22-001. Barrier duration is 10-22-002. Tide/Slow/Frozen names are 10-22-003. Mirror Field flavor announce is 09-01-002. Void Register copy is 09-01-001 evidence, not a new 001.

---

ACTION_ID: PXA-2026-10-23-001  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Weaken dmg and Cursed Wound healRecv still would not fight the pack even after player Slow is wired  
CATEGORY: spells  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `getStatModifier` matches `eff.stat === stat` only (`statusEffects.ts` 45–62). Player outgoing reads `"dmg"` (`WorldExploration.tsx` 3325–3328). Player self-heal in `resolvePlayerCast` is the **only** `"healRecv"` reader (`spellEngine.ts` 657–661). Weaken (`spellData.ts` 334–351) sets `debuffStat: "dmg"` ×0.7 / 2 turns. Cursed Wound (459–478) sets `debuffStat: "healRecv"` ×0.5 / 2 turns and prints “reduce target heal received by -50%.” Enemy Crush / Fire Bolt scales with `enrageMultiplier` and raw `characterStats.res` (`WX` 16716–16728) — never `getStatModifier(enemyId, "dmg")`. Enemy self-heal is `hpAfterHeal(..., chosenSpell.healAmount)` (`WX` 16648–16661). Potions (`WX` 3557–3573), drain (`castHelpers.ts` 473–488), Wisp `ctx.heal` (`summonAI.ts` 415–416), idle +1/10s (`WX` 3617–3624), and Mending Mist (`mapModifiers.ts` 355–365) never consult `healRecv`. Asymmetry: `enemyTakesDamage` **does** multiply caster `"dmg"` (`WX` 3492–3494), so Weaken on a pawn shreds hits on **your wolf** and not Crush on **you**. #528 / #555 / EBMA-004 would copy those same unread-on-pack keys onto the player path. Drain Courage `"ap"` and Slow `"mp"` **do** fight (restore `getStatModifier`; 10-22-003 is the Slow **name**). Do not twin `res_sp` / drain numbers (10-22-001) or Slow/Weaken **write** (EBMA-004 / #528 / #555) or summon Slow `stat` (#878 / EBMA-006).  
SYSTEMS_AFFECTED: spells, enemies (Crush ignores target dmg), visual feedback (card vs pack), admin-enabled content (`healRecv` dropdown), challenges (Pacifist / no-heal vs a heal-tax that potions skip), shops (pots ignore Cursed Wound)  
RECOMMENDED_ACTION: REWORK the keys and the heal sites so the gifted KEEP identities fight **after** the queued apply-path PRs land. Enemy outgoing (spell + melee + boss `damageToPlayer`) must multiply `getStatModifier(casterId, "dmg")` the same way `enemyTakesDamage` already does for summon hits — **or** reprint Weaken as “reduces the target’s damage against summons.” Every player HP gain (self-heal, potion, drain, Wisp, Mist) must multiply `getStatModifier(healedId, "healRecv")` — **or** reprint Cursed Wound as “Blood Mend / Rallying Cry restore half.” Enemy heals must use the same helper. Then KEEP Weaken / Cursed Wound under PXA-002 — clone merge is blocked while the unique question is unread. Do not apply Slow here. Do not map `res_sp` here (10-22-001). Do not implement Blood Mend CHC (EBMA).  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT routing enemy melee/spell through caster `"dmg"` plus a shared `applyHeal(id, amount)` that reads `healRecv`, with a unit test that Weaken on a pawn drops Crush on the player and Cursed Wound on the player halves a potion **or** the cards are reprinted. HUMAN_DESIGN_REQUIRED to keep Weaken as summon-only shred or Cursed Wound as self-heal-only (then reprint).  
DEPENDENCIES: EBMA-2026-09-02-004 / **#528** / **#555** (player rider **write** — this ID is what remains unread **after** that write). **#878** / EBMA-006 (summon Slow `stat` — not this ID). PXA-2026-08-31-002 (clone merge; KEEP Weaken / Cursed Wound is blocked until this ID). PXA-2026-10-22-001 (`res_sp` / drain numbers — orthogonal keys). PXA-2026-09-23-002 (pots vs Doka-to-HP — pots must not stay a Cursed Wound bypass). Does not close 002, 10-22-001, or EBMA-004.  
REGRESSION_RISK: HIGH if enemy melee suddenly reads player `"dmg"` (Enrage on the player would then buff Crush — wrong caster). Multiply **caster** id, not target. MEDIUM if potion/drain start honoring 0.5 healRecv and Pacifist / no-heal math changes. LOW if only the cards reprint the live holes. Do not restack WX `executeCastAttempt` while #528/#555/#878 own that block — change the melee/heal helpers and tests.  
VALIDATION_REQUIRED: Weaken a 12-dmg Crush pawn: next Crush on the player is 70% (or the card says summon-only). Same pawn vs a Dire Wolf: already 70% today via `enemyTakesDamage`; keep that. Cursed Wound the player, drink a Health Potion: restore is half (or the card says Blood Mend only). Cursed Wound a self-healing bishop: its heal is half. Enemy-cast Cursed Wound on the player halves Blood Mend. Admin `healRecv` cannot save unless a pack reader exists. `pnpm typecheck`. No mapGen / RAF. Slow −2 MP is **not** this ID’s test.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-23-002  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Spell Shield / Iron Skin skip Crush; Shield Charm is the only Shield that fights melee  
CATEGORY: spells  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Shield and Iron Skin are the gifted RES identity (`spellData.ts` 30–47, 293–311: `buffStat: "res"` ×1.3 / 3 turns; Iron Skin copy says “Buff own RES”). The shield branch **does** write `buffStat` (`spellEngine.ts` 675–718) — last run KEEP that write. `playerTakesDamage` multiplies `"res"` (`WX` 3429–3432) **then** spends `shieldHpRef` (3433–3438) and logs `"Shield absorbed"`. Shield Charm is the only writer of `shieldHpRef` (`WX` 1588–1589, 3583–3585: “Absorb next 20 damage”). Enemy melee skips `playerTakesDamage`: Crush / Fire Bolt uses **unbuffed** `characterStats.res` (`WX` 16722–16728) and **does** spend Charm (`16750–16761`, same `"Shield absorbed"` log). Boss `damageToPlayer` does the same (`WX` 16025–16038). So vs Crush: Charm fights, Shield spell does not. Vs enemy spells / DoT: both can fight. Two “Shield” nouns, inverted coverage. Do not fold into PXA-002 (Shield ≡ Iron Skin clone merge is blocked until RES actually fights melee). Do not fold into 10-23-001 (Weaken `dmg` / Cursed Wound `healRecv` — different keys). Do not fold inbound SR (09-26-003) or hit-log SP (09-27-003) into this ID. Iron Curse heal-half stays 09-01-002.  
SYSTEMS_AFFECTED: spells, shops (Charm), enemies (Crush pipeline), bosses (`damageToPlayer`), visual feedback (`"Shield absorbed"` vs +30% RES card), challenges (Untouchable / under-50 vs a RES buff Crush ignores)  
RECOMMENDED_ACTION: SIMPLIFY to one coverage rule and one noun. Recommend: route Crush and boss `damageToPlayer` through `playerTakesDamage` (or the same `getStatModifier("player", "res")` multiply) so Shield / Iron Skin fight every HP loss the card implies, **and** rename Charm log / shop row off the word Shield (e.g. “Ward Charm absorbed”). Alternative: reprint Shield / Iron Skin as “+30% RES vs spells and DoT, not Crush” and keep Charm as the melee absorb. Do not tick Charm on lava/spikes in a drive-by (hazards are 09-29-003). Do not merge Shield ≡ Iron Skin in this ID (PXA-002). Do not add inbound SR to Crush.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT routing melee/boss player HP loss through `playerTakesDamage` **or** reprinting the two cards plus renaming the Charm log, plus a unit test that Shield ×1.3 drops Crush **or** the card names the hole. HUMAN_DESIGN_REQUIRED to keep Crush as true-damage (then reprint).  
DEPENDENCIES: PXA-2026-08-31-002 (KEEP Shield / Iron Skin as the RES pair — this ID makes that KEEP honest; clone merge waits). PXA-2026-10-23-001 (pack `dmg` / `healRecv` — orthogonal). PXA-2026-09-26-003 (sheet SR — do not invent SR on Crush here). PXA-011 (Charm cost drift). Does not close 002 or 09-26-003.  
REGRESSION_RISK: MEDIUM if melee starts using `playerTakesDamage` (DoT/RES stacking, challenge damage, death-bisect comments at `WX` 16773–16776 currently assume a direct HP write). LOW if only Charm is renamed and the cards reprint “not Crush.” HIGH if Charm absorb is removed from melee without giving RES a reader there. Do not restack WX melee while occupancy / death PRs own it — extract a `applyPlayerIncoming(dmg, source)` helper.  
VALIDATION_REQUIRED: Cast Shield, take Crush: HP loss is 70% of today’s Crush **or** the card says spells-only. Charm at 20: Crush still absorbs, log does not say “Shield” unless the RES spell also fought. Enemy Frost still reduced by Shield. Untouchable still fails on a 1-HP Crush. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW

---

ACTION_ID: PXA-2026-10-23-003  
SOURCE_AUTOMATION: Player Experience Coherence Auditor  
TITLE: Reflect must be one live player-facing verb — Mirror, Mirror Field, Void 25%, and Reflect Shield 30% teach the same counterplay  
CATEGORY: world-events  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Four live reflect rules, four rates, one counterplay (“don’t dump a big hit”): (1) Mirror spell — KEEP signature, 100% of the **next** single-target incoming (`spellData.ts` 198–213; `activatePlayerMirror` / `consumePlayerMirror`; enemy consume at `WX` 16497–16528). (2) Mirror Field — 20% **chance** to return **100%** of your outgoing hit (`WX` 9538–9561; `spellEngine.ts` 901–907). Announce is “reflections shimmer” (`mapModifiers.ts` 271–277) — flavor vs engine stays 09-01-002. (3) Void Mirror family — **always** 25% of `preCritDmgBM` (`castHelpers.ts` 335–345). Register still teaches “Copies your spells… Immune to magic until hit by a physical attack” (`EnemyRegister.tsx` 67–70; 09-01-001 copy). (4) Boss Reflect Shield — 30% of `finalDmg` while `reflectShieldActive` (`castHelpers.ts` 363–375; Admin/Boss Guide “Reflect Shield (30% dmg reflect)”). Admin seed `reflect_barrier` (`admin.mo` 182) is a fifth **noun** with no `isMirror` — catalog bloat stays PXA-001 / 015, not a fifth live rate. Do not fold Mirror Field’s missing “20%” sentence into this ID (09-01-002). Do not fold Void’s Register sentence as a new 09-01-001. Do not fold Barrier the **wall** (10-22-002) into reflect. 10-22-003 is walk-tax names; this is the reflect pile.  
SYSTEMS_AFFECTED: spells (Mirror), world events (Mirror Field), enemies (Void family), bosses (Reflect Shield), visual feedback (four “mirror/reflect” logs), admin-enabled content (`reflect_barrier` seed), challenges (Untouchable / Striker on a Field or Void map)  
RECOMMENDED_ACTION: MERGE to one player-facing verb. Keep Mirror as the AP commitment (one-shot next-hit). Pick **one** environmental/family/boss rate and one trigger (chance vs always-a-percent vs boss flag) and print that sentence on Map Effects, Register, and Boss Guide. Recommend: Void and Reflect Shield share “returns N% of the hit” (pick 25 or 30, not both); Mirror Field either becomes that same percent **or** is deleted until it is half-range / a unique question. Rename Mirror Field if Mirror the spell stays. Do not implement Register’s “magic immune until physical” (EBA-024 is blocked until the card matches). Do not add a fifth reflect from `reflect_barrier` until targeting metadata exists (PXA-015) and this ID has one verb.  
AUTONOMY: ORCHESTRATOR_MAY_DRAFT unifying Void + Reflect Shield to one percent and renaming Mirror Field’s announce to the live 20%-chance-full-return **or** deleting the Field hook, plus a unit test that one helper implements non-Mirror reflect. HUMAN_DESIGN_REQUIRED to keep four rates as intentional (then print a compare table in Map Effects / Boss Guide) or to implement true copy-spell Void.  
DEPENDENCIES: PXA-2026-09-01-002 (Mirror Field flavor vs engine — this ID is the four-rate pile, not the announce). PXA-2026-09-01-001 (Void Register copy). PXA-2026-08-31-002 (KEEP Mirror the spell). PXA-2026-08-31-008 (slim events). PXA-015 (admin `reflect_barrier`). Does not close 001, 002, or 008.  
REGRESSION_RISK: MEDIUM if Void 25% → 30% (or Shield 30% → 25%) changes boss and family lethality. HIGH if Mirror the spell is removed (the only reflect that is a loadout decision). LOW if only Register / Map Effects / Boss Guide print the live numbers. Do not restack `applyDamageToEnemy` while GFCF-003 / Shell Armor PRs own it — extract a `reflectOutgoing(kind, amount)` helper.  
VALIDATION_REQUIRED: Mirror: next enemy single-target returns 100%, then expires. Mirror Field: one function, one sentence, one rate. Void: card/Register/log are 25% of the hit (or the chosen shared percent), not copy-spell. Reflect Shield: same verb + percent as the family **or** a clearly named boss-only exception. Untouchable fails on a reflected chip. `pnpm typecheck`. No mapGen / RAF.  
STATUS: NEW
