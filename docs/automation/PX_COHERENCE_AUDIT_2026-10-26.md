# Player Experience Coherence Audit — 2026-10-26

**Auditor:** Player Experience Coherence Auditor  
**Automation:** `bc-16765ec2-025d-5940-b252-a6a1974ff3f0`  
**HEAD inspected:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)  
**Prior audit:** [`PX_COHERENCE_AUDIT_2026-10-25.md`](https://github.com/Mr-Melic/stralt/blob/pr-1067-tmp/docs/automation/PX_COHERENCE_AUDIT_2026-10-25.md) in open draft [PR #1067](https://github.com/Mr-Melic/stralt/pull/1067) (same production SHA)  
**Gameplay / production code:** not modified.

Stralt is judged as **one tactical game**. There is **no level cap**. Flat numbers are judged by whether they still create a decision at high level.

**Do not re-file** still-open PXA IDs from 08-31 … 10-25. They remain open in-repo or in drafts **#343 / #393 / #481 / #529 / #579 / #632 / #691 / #744 / #784 / #844 / #907 / #955 / #1008 / #1067**.  
Closed (do not re-open): `PXA-2026-08-31-006` (Blood HUD), `PXA-2026-09-02-002` (accepted challenge HUD).  
New records: [`ACTION_IDS_PXA_2026-10-26.md`](./ACTION_IDS_PXA_2026-10-26.md) (`PXA-2026-10-26-001` … `003`).  
Sibling same-day signature hunt docs (`*_SIGNATURE.md`) claim `004` … `006` — orthogonal; do not renumber.

---

## Hunt answers (requested surfaces)

### 1. Remaining DEFAULT_CHALLENGES — HUD vs fail vs complete

| Challenge | Fail chip when… | Complete when… | Verdict |
| :--- | :--- | :--- | :--- |
| Untouchable (`no_damage_taken`) | `totalDamage > 0` (`challengeCompletion.ts` 454–455) | `totalDamage === 0` (128–129) | **Honest fail.** KEEP chip wiring. |
| Striker (`direct_hit`) | `!directHit` after a spent attempt beyond Chebyshev 2 (387–397, 458–459) | `directHit && attempts > 0` (421–428) | **Honest fail** on a range-3 land. KEEP. |
| hard_3 (`under_8_ap_per_turn`) | `maxApUsedInTurn > 8` (452–453) | `maxApUsedInTurn <= 8` (126–127) | Fail wiring **works**; peak is **invisible** on the panel → **10-26-003**. Flat ≤ 8 auto-stamp stays **09-26-001**. |
| under_N_turns | never mid-fight (444–457) | `turnCount <= N` | **10-25-003** (do not twin). |
| easy_1 / hard_1 heal | `healUsed` | `!healUsed` (+ damage for hard_1) | Copy vs any-restore stays **10-24-002**. Pacifist feat overlap stays **PXA-009**. |

`ChallengePanel` progress always shows Turns + Damage (`ChallengePanel.tsx` 304–307); Striker gets an extra line (308–312); **hard_3 never gets an AP line**.

### 2. Summon cards vs spawn / lifespan / AI / control

Lifespan and HP/AP/MP chips in the spellbook mirror `getSummonBaseStats` + per-spell `summonLifespan` (`SpellbookModal.tsx` 246–259; `summonSpawn.ts` 147–161; `progression.ts` 218–244). Wolf / Archer / Sentinel / Wisp kits are spendable at printed AP.

**Bomber is not.** Card “rushes and explodes” + kit Inferno (5 AP) + unit `ap: 1` + player-only control mode → permanent grey kit, no explode → **10-26-001**. Not a twin of EBMA-006 (AI executor path).

### 3. BuffShop vs live effects

| Item | Card | Engine | Verdict |
| :--- | :--- | :--- | :--- |
| Battle Elixir | +3 AP this turn | `setCurrentBattleApSynced(prev + 3)` WX 3575–3577 | KEEP |
| Swift Boots | +2 MP this turn | `setCurrentBattleMp(prev + 2)` WX 3579–3581 | KEEP (vs Haste unread = 10-25-002) |
| Shield Charm | Absorb next 20 | `shieldHpRef = 20` WX 3583–3585 | KEEP (melee Shield noun stays 10-23-002) |
| Fury Potion | +25% for 3 turns | `furyRef.turnsLeft = 3`; ×1.25 `spellEngine.ts` 895–898; tick WX 14289–14293 | KEEP |
| HP potions | 30% / 70% max | `floor(maxHp * 0.3/0.7)` WX 3557–3572 | vs overworld 1:3 stays **09-23-002** — no new pot lie |

### 4. Statistics / sheet

No new unread/lying peer beyond SR (09-26-003), FAIL-as-inbound stack (09-22-001 / 09-27-003), AP/MP cadence (09-27-001), SP inbound (10-24-001). Resilience/evasion still unprinted (DEPRECATE under 09-26-003). Forge 10/5 vs battle 8/4 stays 10-21-003.

### 5. Death Realm

KEEP. Quiet map, no enemies/hazards (`WX` 5388–5457). Copy: 20% XP / 40% Doka, half health, portal escape (`GameOverModal.tsx` 52–80; `App.tsx` tip; Flee title `BattleUIPanel.tsx` 519–523). `respawnHpAfterDeath` is 50% of the **linear** orb that WX `maxHp` also uses (`deathPenalty.ts` 138–140; WX 3400–3405).

### 6. Boss rush

`combinedMechanic` still unused — PXA-003. No new room-name vs spawn lie filed this run.

### 7. Dungeon chain copy

Live HUD depth + portal “Continue Chain” are honest. Victory Doka ×depth is honest; XP is not multiplied (and recap says Doka). Recap **Depth** defaults to `1/?` because WX never sets the fields → **10-26-002**. Sanctuary “Rest” stays 09-29-002.

### 8. Shrine / covenant / ground Doka

Shrine still pays 300 Doka silently; pure path writes `covenantBuffMapsRef = 3` with no combat reader (WX 11303–11330) — already DEPRECATE under 08-31 / 09-01 / 09-02. No new player-facing covenant sentence to twin. Ground Doka credits the pickup value with no false card.

### 9. InitiativeStrip

Leader crown `title` + panel “gains +stats on ally death” (`InitiativeStrip.tsx` 385, 660) — same lie as **09-28-001**. Summon lifespan chip matches `turnsRemaining`. No new strip lie.

### 10. Attack Nearest

KEEP. Tooltip and path use the selected spell (`BattleUIPanel.tsx` 830–843; `attackNearestEnemy` WX 17218+).

---

## Delta since 2026-10-25

`origin/main` has **not moved**. Same SHA `0f5363f`. New reads only.

1. **Bomber is not a Bomber under player control.** Card + Inferno kit + 1 AP + control-only path → grey kit, no explode (**10-26-001**).
2. **Dungeon recap Depth is a default, not the live floor.** Multiplier is real; Depth 1/? is not (**10-26-002**).
3. **hard_3’s contract is AP; the HUD never shows AP.** Fail chip works; peak is invisible (**10-26-003**). Distinct from flat ≤ 8 (09-26-001) and turn-limit never-Failed (10-25-003).

---

## Verdict

Core identity still KEEP: AP/MP, targeting metadata, persist+recap mount, death 20/40, summons as a five-pack **once Bomber’s card matches the panel**, Attack Nearest on the selected spell, BuffShop timing pots, honest Death Realm.

New noise is **summon / dungeon / challenge HUD honesty** on surfaces this hunt named. Do not add another summon kit that costs more AP than the unit’s budget. Do not ship another recap field that defaults past the live refs. Do not add another AP-cap challenge without printing the peak.

---

## Classification snapshot (delta)

| System | Class | Note |
| :--- | :--- | :--- |
| Untouchable / Striker fail chips | KEEP | Fail when damage / out-of-range cast |
| hard_3 fail predicate | KEEP wiring | Missing peak AP line → 10-26-003; flat 8 → 09-26-001 |
| Bomber player identity | REWORK | 10-26-001 |
| Dungeon live HUD depth | KEEP | |
| Dungeon recap Depth line | SIMPLIFY | 10-26-002 |
| BuffShop elixir/boots/charm/fury | KEEP | |
| Death Realm copy | KEEP | |
| Attack Nearest | KEEP | |
| InitiativeStrip leader copy | REWORK (prior) | 09-28-001 (panel + tooltip) |
| Covenant write-only | DEPRECATE (prior) | no new copy lie |
