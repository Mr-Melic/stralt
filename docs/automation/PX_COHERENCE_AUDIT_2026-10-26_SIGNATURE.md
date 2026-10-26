# Player Experience Coherence Audit — 2026-10-26 (signature slice)

**HEAD:** `0f5363f` (same production SHA as 09-21…10-25)  
**Scope:** Signature / gifted starter **card vs live execute** — Mark, Swap, Sacrifice, Timestep, Enrage, Poison Arrow, Venom Strike, Strike FAIL, Mirror, and other `starterSpells` description mismatches.  
**ACTION_IDs:** [`ACTION_IDS_PXA_2026-10-26_SIGNATURE.md`](./ACTION_IDS_PXA_2026-10-26_SIGNATURE.md) (`004`–`006`; concurrent PX pass may own `001`–`003`)  
**Code changes:** none (docs only).

## Already filed — not re-opened

Barrier 2 vs 3 (10-22-002); Mirror/Field/Void/Reflect **rates** (10-23-003); Haste +2 / restore / log % (10-25-002); Haste/Iron Skin/Enrage “own” (10-24-003); `hitsMultiple` Chain/Frost/Lifesteal (10-25-001); Inferno silent CD (09-27-002); Windstorm miss → Inferno CD (10-21-002); Expose/Veil/`healAmount` (10-22-001); Weaken/`healRecv` (10-23-001); Shield RES vs Crush (10-23-002); Slow/Weaken apply (EBMA-004); three fire DoT names; three MP-slow names; Timestep vs Time Warp **name** (PXA-012).

## Deferred claim — verified

**2026-10-25 deferred:** “Mark still writes a tile (`placeMark` WX ~9403) while `targetType` is enemy.”

| Claim | Status | Evidence |
| --- | --- | --- |
| Card says tile | **Yes** | `spellData.ts` 163 |
| `targetType: "enemy"` | **Yes** | `spellData.ts` 174 |
| `placeMark` writes tile key | **Yes** | `WorldExploration.tsx` 9403–9405 |
| Mark branch needs hostile | **Yes** | `spellEngine.ts` 882 + 928–936 |
| Empty highlighted floor | **AP spent, no mark** | targeting accepts empty enemy-range floors (`targeting.ts` 669–687); fallthrough `"cast"` (`spellEngine.ts` 1027–1028) |
| Mark on enemy does ×2 on that tile | **Yes, if next damage click uses same `gridPos`** | `WX` 3331–3334 / 3390–3393 |

Filed as **PXA-2026-10-26-005**.

## Card vs engine — signature pass

### Mark → **NEW fracture (10-26-005)**

Tile card + enemy metadata + hostile-gated `placeMark`. Live ×2 on marked **click tile** works when a hostile was present to place it; empty floors and stranded tiles break the card’s “mark a tile” promise. Sacrifice empty floors also self-tax (`spellEngine.ts` 749–763) — same empty-enemy-type family.

### Swap → no new ID

Card: “Teleport caster and target to each other's cells” (`spellData.ts` 143–159: `isSwap`, `apCost: 3n`, `range: 3n`, `targetType: "enemy"`). Engine swaps with `isActiveHostile` only (`spellEngine.ts` 766–775; `swapPositions` `WX` 9389–9401). Player-side summons are not hostile (`battleSetup.ts` 57–60) — cannot swap with your wolf. Enemy summons can. Player LoS is opt-in (`targeting.ts` 118–125); Swap has no `lineOfSight` — can swap through occluders inside Chebyshev 3. Empty floor: no swap, AP fallthrough (same family as Mark; not a unique Swap lie). Card does not claim LoS or ally-swap.

### Sacrifice → identity mostly matches; empty-floor self-tax under 005

Card: lose 20% own HP, deal 3× to target (`spellData.ts` 234–250). Engine: `floor(currentHp * 0.2)` then `×3` (`spellEngine.ts` 749–763); `loseSelfHp` floors at 1 (`WX` 9374–9387); challenge self-loss wired. Current-HP % matches common reading of “own HP.” **Empty adjacent click still pays the HP** — folded into 10-26-005 evidence, not a fourth ID.

### Timestep → mechanics match card (name stays PXA-012)

Card: “Resets your AP and MP to full. Once per battle.” (`spellData.ts` 216–231: `apCost: 0n`, `isTimestep`). Engine: `consumeTimestep` once (`WX` 9350–9353); `restoreApMp` from `getPlayerBaseStats` + additive AP/MP mods (`WX` 9355–9372); returns `"no_ap"` so caller does not double-debit (`spellEngine.ts` 721–733). Do **not** file name-rhyme with Time Warp (PXA-012). Restore floor 8/4 vs forge stamp 10/5 stays 10-21-003.

### Enrage → no new ID (not a Haste twin)

Card: “Buff own DMG by +40% for 2 turns” (`spellData.ts` 274–291: `buffModifier: 1.4`, `buffDuration: 2`). Shield branch writes `buffStat: "dmg"` (`spellEngine.ts` 675–718). Player damage loop reads `getStatModifier("player", "dmg")` (`WX` 3325–3328) — **+40% applies**. Duration 2 survives the first `processActiveEffects` tick (`WX` 14275 before restore) so cast turn + next player turn both see the buff — unlike Haste duration 1 (10-25-002). “Own” vs `targetType: "ally"` stays 10-24-003. Do not twin.

### Poison Arrow vs Venom Strike → numbers match; clone MERGE only

| | Poison Arrow | Venom Strike |
| --- | --- | --- |
| Card DoT | 4 / turn × 3 (`spellData.ts` 49–67) | 4 / turn × 3, “No upfront” (395–415) |
| Engine | `dotDamagePerTurn: 4`, `dotDuration: 3`, `damage: 0` | same |
| Diff | AP 2, range 4, `dotType: "poison"` | AP 3, range 2, `dotType: "venom"` (emoji/label only in DoT branch) |

No card/engine number lie. Catalog **Poison ≡ Venom** MERGE remains under PXA-002 — **no new ACTION_ID**.

### Strike FAIL exemption vs card → **NEW fracture (10-26-006)**

Exemption is live (`spellEngine.ts` 641–651). Card names RES/SP only (`spellData.ts` 12). Prior KEEP required the card to say so — it does not. Not a twin of 09-27-003 (SP/SR log).

### Mirror → **NEW fracture (10-26-004)**

Gifted self-target Mirror never enters `activateMirror` (branch behind hostile/hitsMultiple gate). `playerMirror.ts` fixed the consume key; arming is still unreachable on the only legal tile. Overturns “Mirror KEEP as live one-shot” until this ID lands. Not a twin of 10-23-003’s rate pile.

## Other gifted starters (description vs execute)

- Shield / Iron Skin / Haste / Enrage **write** path live — coverage/Crush/own/Haste-restore already IDs.
- Frost Bolt / Slow / Weaken / Expose / Cursed Wound / Shadow Veil debuff **apply** — EBMA-004 / 10-22-001 / 10-23-001.
- Blood Mend / Rally CHC rider — EBMA.
- Drain / Lifesteal heal numbers — 10-22-001.
- Chain Lightning / Frost Nova / Lifesteal Nova geometry — 10-25-001.
- Inferno CD / burn names — 09-27-002 / 10-21-001.
- Barrier duration — 10-22-002.
- Summon kit blurbs are role flavor; no new description/execute numeric lie found beyond the above.

## New ACTION_IDs

1. **PXA-2026-10-26-004** (P0 REWORK) — Mirror self-cast never arms.  
2. **PXA-2026-10-26-005** (P0 REWORK) — Mark tile card vs enemy gate / empty no-op (10-25 deferred).  
3. **PXA-2026-10-26-006** (P1 SIMPLIFY) — Strike FAIL exemption unnamed on card.

## Classification notes (signature slice)

| Tool | Verdict |
| --- | --- |
| Mirror | KEEP identity **after** 004 arms it; rates MERGE stays 10-23-003 |
| Mark | KEEP tile-trap **or** enemy-tag — pick one via 005 |
| Swap | KEEP |
| Sacrifice | KEEP numbers; empty abort via 005 |
| Timestep | KEEP mechanic; rename vs Time Warp is PXA-012 |
| Enrage | KEEP write + duration 2; “own” is 10-24-003 |
| Poison / Venom | MERGE (PXA-002 catalog) |
| Strike FAIL skip | KEEP **only if** 006 names it on the card |

## Tactical-identity questions that fail

- **Mirror:** Why spend 4 AP to reflect the next spell if casting it on yourself does nothing?  
- **Mark:** Why does “mark a tile” require an enemy, and why does clicking the painted empty floor spend AP with no mark?  
- **Strike:** Why does the sheet teach FAIL% if the basic attack silently ignores FAIL?
