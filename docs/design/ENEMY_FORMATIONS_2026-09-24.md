# Enemy synergy and formation catalog (drop 7)

**Author:** Enemy Synergy and Formation Designer  
**Date:** 2026-09-24  
**Status:** PROPOSED — design only. No production code, spawn tables, or AI changes in this drop.

Drops 1–6 already taught the seven pairing words and Waves 1–5 family packs. This drop **does not reuse those `FSN-*` ids**. It writes the **Wave 6 packs** named in [`ENEMY_ELITE_EVOLUTION_2026-09-23.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md) (open as PR #452): Face Court, Gait Snare, Vault File, Span Gate, Span Plug, Cadence Choir, Brand Cover, Lintel Coup, Bell Tempo, Vault Cover, Pin Pit, Cadence Mute.

New experiences still come from **who stands together**. No new sprites. Higher progression unlocks more sophisticated **compositions**, not a last level band.

See also: [`ENEMY_FORMATIONS_2026-08-31.md`](./ENEMY_FORMATIONS_2026-08-31.md) (drop 1), [`ENEMY_FORMATIONS_2026-09-01.md`](./ENEMY_FORMATIONS_2026-09-01.md) (drop 2), [`ENEMY_FORMATIONS_2026-09-02.md`](./ENEMY_FORMATIONS_2026-09-02.md) (drop 3), [`ENEMY_FORMATIONS_2026-09-21.md`](./ENEMY_FORMATIONS_2026-09-21.md) (drop 4, Wave 3 — open as PR #348), [`ENEMY_FORMATIONS_2026-09-22.md`](./ENEMY_FORMATIONS_2026-09-22.md) (drop 5, Wave 4 — open as PR #401), [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md) (drop 6, Wave 5 — open as PR #459). Family sheets: PR #452. Spell verbs: [`SPELL_PROPOSALS_2026-09-22.md`](../automation/SPELL_PROPOSALS_2026-09-22.md) (Wave 5 ids this drop consumes, open as PR #411).

**Hard rules (Wave 6 pack law — plus every older law still stands):**

- Do **not** pack `oncoming_knight` with `shadow_lurker` / `pincer_acolyte` as a PAIR (three facing/adjacency assassins). `FSN-PINCH-GOAD` stays two-body occupancy; `FSN-FROST-KNIFE` stays rear/veil.
- Do **not** pack `pin_cantor` with `misstep_herald` / `axis_locksmith` as a PAIR (three walk/view rewrites). `FSN-OBLIQUE-FILE` stays axis + diagonal gun; Misstep stays a variant there, not this drop’s Pin.
- Do **not** pack `glance_ward` with `glass_sniper` / `far_stinger` / `oblique_cantor` as a PAIR without a pin/span third (two guns). `FSN-SPAN-GUN` is the teaching pair because the **plug** is the other verb.
- Do **not** pack `gait_muter` with `stride_hunter` as a PAIR (two stride verbs). `FSN-KICK-STING` / Recoil Hunt stay moved-this-turn **damage**.
- Do **not** pack `vault_chaplain` with `mist_walker` / `twin_porter` / `morrow_walker` / `hook_chaplain` / `shove_chaplain` / `blink_cutter` as a PAIR (six reposition engines). `FSN-MIST-HUNT` / `FSN-GATE-COURT` / `FSN-RESCUE-LINE` / `FSN-SHOVE-SCHOOL` stay theirs.
- Do **not** pack `span_warder` with `span_prelate` (two span bodies). Cap **one** span body per pack.
- Do **not** pack `span_prelate` with `pylon_prelate` / `bait_prelate` / `stone_castellan` / `font_cantor` (two stationary posts). Cap one pylon **or** turret **or** font **or** bait **or** span-pylon.
- Do **not** pack `cadence_thief` with `ledger_siphon` / `soul_siphon` as a PAIR (two steals). `FSN-LEY-SIP` stays MP; `FSN-LEDGER-LEY` stays AP.
- Do **not** pack `brand_plate` with `surplus_warder` / `cadence_thief` as a PAIR (evade vs brand consume; two cadence engines). `FSN-EVADE-GOAD` stays miss.
- Do **not** pack `cover_squire` with `pain_suture` / `twin_tether` / `bait_prelate` as a PAIR (three “someone else eats it”). `FSN-PLATE-LINK` / `FSN-TWIN-PLATE` / `FSN-BAIT-GATE` stay theirs.
- Do **not** pack `lintel_mason` with `pit_mason` as a PAIR (two walk-block cells). `FSN-MUTE-PIT` is pit + mute; `FSN-LINTEL-COUP` is the COURT/CADRE that makes HP% vs nobody-walks readable.
- Do **not** pack `act_teller` with `hex_teller` / `tax_scribe` / `origin_mason` as a PAIR (two AP taxes). `FSN-GRAVITY-TAX` / `FSN-MORROW-SNARE` stay tile taxes.
- Do **not** pack `act_sexton` with `bell_sexton` / `fuse_binder` as a PAIR (two delayed clocks). `FSN-BELL-CUT` / `FSN-WICK-STEP` stay execute-clock / tile fuse.
- Drop 4–6 laws still stand (no coup+bell PAIR; no two cones; no two evades; no two self-teleports; no two posts; no two scribes; no two censors).

Wave 7 **families** now exist as [`ENEMY_ELITE_EVOLUTION_2026-09-24.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md) (open as PR #535: `post_stinger`, `purse_scribe`, `corner_bishop`, `hinge_squire`, `file_reeler`, `twin_span`, `veil_cantor`, `cadence_breaker`, `cadence_lender`, `purse_splitter`, `tithe_mason`, `hinge_mason`, `spark_chanter`, `cap_warder`). They consume Wave 6 SPELL_PROPOSALS (PR #463), not this catalog’s Wave 6 family pack. This drop does **not** mint `FSN-*` ids for those fourteen families — drop 8 writes Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Lend Fan, Spark Purse, Hinge Trap, Cap Veil, Reel Corner, Split Spark.

Same-day SPELL_PROPOSALS Wave 7 (`SPELL_PROPOSALS_2026-09-24.md`, open as PR #525: Wall Sting, File Brand, Boot Sting, Shove Face, Knight Slip, Pivot Foe, Triple Span, Cadence Crack, Must Pace, Once Verse, Tick Hood, Flank Share, Spare Pace, Pit Wick, Exit Boon, Court Shove) still have **no family sheets**. Elite-evolution Wave 7 left those verbs for Wave 8. Do not mint `FSN-*` ids that require Wave 7 spell verbs until that family pass exists.

Mute Thread / Queue Cut / False Cut stay **boss / closed-class**.

**Do not spawn Face Court / Glance sheets until a battle-walk writer exists for `currentView`.** Overworld wander already writes the field (`WX` 6924–6938); combat walks do not. Missing view → Oncoming never pays +10 and Glance always fizzles (fail closed). Until that writer lands, show `FSN-SPAN-GUN` / `FSN-PINCH-GOAD` instead.

---

## Grounding (live, 2026-09-24)

Re-read this checkout (`origin/main` `0f5363f`). Line numbers match drops 4–6. Family lottery still lives in `spawnPolicy.ts`. `WorldExploration.tsx` is still **19,213** lines.

| Fact | Where |
| :--- | :--- |
| Kits by piece | `enemyAI.ts` `ENEMY_KITS` 163–185 |
| `buildEnemyKit` | `enemyAI.ts` 194–200 (`Math.floor(levelZone)`) |
| Battle-start kit assignment still passes `currentMap.levelZone` (object) | `WorldExploration.tsx` 11920 |
| Summoner overlay still `BASE + characterStats.level * PER` (uncapped; saturates ~level 44) | `WorldExploration.tsx` 11932–11942; `gameConstants.ts` 298–299 |
| Family lottery 30%, seven live ids | `spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 35, `FAMILY_TYPES` 49–57; WX `applyFamilyVariantsToRoster` 5864–5866 |
| Family `res` / `sp` still written as 0.05–0.75 | `spawnPolicy.ts` `FAMILY_STAT_MULTS` 69–120 |
| Battle start still overwrites family HP | `WorldExploration.tsx` 11970–11974 `calcEnemyMaxHp(e.level)` |
| `inferArchetype` still heal-first | `enemyAI.ts` 447–452 |
| `decideEnemyAction` | `enemyAI.ts` 1662–1698 |
| `decideSummonerAction` still **skips** on missing spell / cap / cooldown | `enemyAI.ts` 1832–1888 |
| Summon routing still `name.includes("wolf"\|"golem"\|"wisp")` | `enemyAI.ts` 218–223 — **no** `span` / `bait` / `font` / `pylon` / `turret` key |
| `Enemy.currentView` | `gameTypes.ts`; overworld wander writer WX 6924–6938. **Unread in combat.** |
| Min start spacing | `spawnPolicy.ts` `SPAWN_MIN_CHEBYSHEV = 4` at 38; WX 5763 / 5855 |
| Families (live) | `gameTypes.ts` 12–20 — seven overlays + `default` |
| AI gates | `gameConstants.ts` 200–209 |
| Summon cap / cooldown | `gameConstants.ts` 298–301 |
| Kamikaze constants | `gameConstants.ts` 266–285 |
| Map archetypes | `mapGen.ts` 6–44 |
| Ember melee-burn / tide melee-slow | `WorldExploration.tsx` 16789–16819 |
| Void Mirror 25% reflect | `castHelpers.ts` 335–337 |
| `applyPushback` / `applyAttract` exist; **no spell caller** | `occupancy.ts` 482 / 537 |
| Cast helper gates **AP only** | `WorldExploration.tsx` `executeCastAttempt` 17096+ |
| `isTrap` still `placeBarrier(..., 3)` | `spellEngine.ts` 442–445 |
| `starter-heal` self-only | `spellData.ts` 85–101 |
| Enrage `targetType: "ally"` | `spellData.ts` 274–291 |

### Still true (do not regress)

1. Intended kit band is 0 / 1 / 2. Live assignment is **band 0** until `buildEnemyKit` receives a number.
2. `inferArchetype` never returns `summoner`. Dedicated span-pylon / bait / font / pylon / turret / familiar bodies **replace** the random overlay. Cap one of those engines. Cap one span body.
3. Any `healAmount` steals healer. **Do not put drain, nova, or `starter-heal` on Pin, Oncoming, Glance, Muter, Vault, Span Warder, Span Prelate, Thief, Brand, Cover, Lintel, Act Teller, or Act Sexton.** Cantor on `FSN-BRAND-COVER` / `FSN-BRAND-MEND` is the **one** heal engine on those sheets.
4. `starter-heal` is **self-only**. Ally tools remain Shield / Iron Skin / Absolve / Tempo / Leash / Cover Step / Span Guard.
5. `spell-rallying-cry` stays `usableByEnemy: false`. Wave 6 CORE rows stay `mpCost: 0` (Ley Toll remains the first MP spender; do not add a fourth `mpCost > 0` walk snipe).
6. `inferSummonArchetype` must key `summonAI === "span"` (and `"bait"` / `"font"` / `"pylon"` / `"turret"`) **before** any span-pylon sheet ships. Name heuristics stay a bug. Summoner skip-lock: at cap, fall through to Strike / Frost / Shield, never skip the turn.
7. **Banned:** `ENEMY_AI_TIER_GATES.instantKill` (9), `betrayal` (10), sealed pockets, lava on every approach, turn-1 surround, `spell-barrier` / `spell-mirror` / `spell-timestep` on enemies. Coup / Sated Fang / Act Bell are **not** `instantKill`.
8. Push / vault landing / span second cell: free floor, not lava / spikes / void / portal / pit, player keeps ≥ 1 escape tile. File Vault is **not** `applyPushback`. Nail Down fizzles the vaulted body.
9. Dual Slow / Frost / tide melee / rime: cap applied unit MP debuff at **−2**. One Slow source per pack. Do not also Root + Rank Lock + Facing Pin + Stride Mute on the same AP bar.
10. Facing: dominant axis; **ties fail closed**. Forced-move does not rewrite `currentView`. Pin locks the **literal** for 2 of their turns; walks still happen.

### Relative difficulty (same grades as drops 1–6)

| Grade | Kit band | AI sophistication | Pack size | Rare spells | Unlock (relative) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PAIR | 0–1 | 1–2 | 2 | none | After the matching drop-1…6 PAIR, or as a first composed fight if that pair is the teaching tool |
| CELL | 0–1 | 2–3 | 2–3 | none | After the player answers the related PAIR without a death |
| BRIGADE | 1 | 3–4 | 3 | at most one | After CELL tools (heal / armor / a DoT / a displacement / a delayed timer / a facing tell) |
| CADRE | 1–2 | 4–6 | 3–4 + optional summon | one, sometimes two non-stacking | After displacement **or** a player summon **and** the named prerequisite sheets |
| COURT | 2 | 6–8 | 4 + capped summons | one elite rare | After a leader-boost CADRE from **any** catalog |

Dungeon depth may amplify a grade (extra body, +tier step). It must not jump a PAIR sheet to COURT. No sheet is a final band.

Enemy levels inside a pack stay **relative to each other**:

- Frontliner (oncoming / span-warder / span-prelate-owner / brand / cover / lintel / goad / lancer / warden): pack median + one step.
- Backliner (pin / glance / muter / vault / thief / teller / sexton / sniper / gale / origin / cantor / tempo): pack median.
- Glass (coup, glance, thief, muter): pack median or −1.
- PAIR/CELL: at most **one** step between highest and lowest. BRIGADE+ may use two.

### Proposed role overlays (drop 7)

Drop 1–6 overlays still apply. These are **additional jobs** for Wave 6 verbs. Each is a piece + optional **proposed** family + kit extras + AI contract. Not canister rows. No new pixel patterns.

| Overlay id | Piece | Family | Extra kit (beyond `ENEMY_KITS`) | AI contract |
| :--- | :--- | :--- | :--- | :--- |
| `ROLE-ONCOMING` | `knight` | proposed `oncoming_knight` | `physical_attack`, `spell-oncoming` | flanker; skip Oncoming if `currentView` missing or not facing; ties fail closed (Strike / Mark) |
| `ROLE-PIN` | `bishop` **without** heal | proposed `pin_cantor` | `starter-frost`, `spell-facing-pin` | caster; skip if already pinned; Pin only if a facing-gated ally can cash this or next turn (else Frost) |
| `ROLE-GLANCE` | `queen` **without** heal | proposed `glance_ward` | `starter-frost`, `spell-glance-cut` | caster; Glance only if the target’s **front cell** is occupied by a hostile; skip empty / wall / ally |
| `ROLE-MUTER` | `bishop` | proposed `gait_muter` | `starter-frost`, `spell-stride-mute` | caster; skip if they are already adjacent **and** will Strike (mark unused); never Mute Thread |
| `ROLE-VAULT` | `queen` **without** heal | proposed `vault_chaplain` | `starter-frost`, `spell-file-vault` | caster; blink an **ally** Chebyshev 3–4; skip no-ally / blocked / lava if ally HP% < 40; never self-blink |
| `ROLE-SPAN` | `rook` | proposed `span_warder` | `physical_attack`, `spell-span-guard` | charger; Span only if the second cell plugs a 2-wide file; skip no-free-adjacent; translate only if new second cell is free |
| `ROLE-SPANPOST` | `rook` or `king` **without** heal | proposed `span_prelate` | `physical_attack`, `spell-span-pylon` | `isSummoner` for span-pylon only; pet empty kit, `summonAI: "span"`, must not path or Strike; no wolf/archer/pylon/turret/font/bait overlay |
| `ROLE-THIEF` | `bishop` | proposed `cadence_thief` | `starter-frost`, `spell-cadence-theft` | caster; steal only if their highest remaining CD ≥ 2; never reset to 0; never copy an id |
| `ROLE-BRAND` | `rook` | proposed `brand_plate` | `physical_attack`, `spell-cadence-brand` | charger; skip already-branded; do not Cover-Step the same turn (redirected hit does **not** brand) |
| `ROLE-COVER` | `rook` or `king` **without** Rally | proposed `cover_squire` | `physical_attack`, `spell-cover-step` | charger; Cover only if a Chebyshev-1 ally has HP% ≥ 20; skip no-adj |
| `ROLE-LINTEL` | `rook` or `bishop` | proposed `lintel_mason` | `starter-frost`, `spell-low-lintel` | setter; paint only if player HP% > 50 **and** the cell is a choke; skip if a Pit already occupies it |
| `ROLE-ACTTAX` | `bishop` | proposed `act_teller` | `starter-frost`, `spell-act-tax` | caster; skip if they already acted this round; never splice the queue |
| `ROLE-ACTBELL` | `queen` or `king` **without** heal | proposed `act_sexton` | `starter-frost`, `spell-act-bell` | caster; skip no remaining slot; observe on **arm**, not on the later hit |

Drop-2…6 `ROLE-SNIPER` / `ROLE-LANCER` / `ROLE-GOAD` / `ROLE-PIT` / `ROLE-WARDEN` / `ROLE-CANTOR` / `ROLE-TEMPO` / `ROLE-GALE` / `ROLE-ORIGIN` / `ROLE-SATED` / `ROLE-COUP` / `ROLE-HEX` are reused below. Do not also roll the random 12% summoner overlay onto Pin, Glance, Muter, Vault, Span, Thief, Brand, Cover, Lintel, Act Tax, or Act Bell. One dedicated summoner **engine** per pack (wolf **or** turret **or** familiar **or** pylon **or** font **or** bait **or** span-pylon — never two).

### Fair-fight rules (every sheet)

Same as drops 1–6, plus Wave 6:

- Engagement pocket: **≥ 2 walk-off tiles** that are not hazard, void, portal, barrier, live fuse, pit, lintel the player cannot enter, or a span second cell that seals the only aisle.
- Hostiles start ≥ Chebyshev 4 from each other and from the player.
- Oncoming: 12, +10 iff stored `currentView` faces the caster. Missing view / diagonal tie → no bonus (Strike instead). Hug Chebyshev 0 denies the wedge. Walk past so the face turns.
- Facing Pin: locks `currentView` literal 2 of **their** turns. Walks still happen. Invalid literal fizzles (AP spent). Dispel / wait 2 turns. Never Pin + Root + Rank Lock + Mute on one AP bar.
- Glance Cut: 16 physical on the cell in front of **their** `currentView`. Empty / wall / ally / missing view → fizzle after AP. Do not clump a summon on your front. Hug a wall.
- Stride Mute: arm until end of their next turn. Walk-MP ≥ 1 that turn → next spell fizzles (AP spent). No walk → they cast. Forced-move / File Vault / Swap **does not** trip. Cast first, then walk. Never Mute Thread.
- File Vault: ally teleport Chebyshev 3–4, LoS from **their** origin, `isCellFree`. Landing **must** tick hazards. Occupy the dest. Nail Down fizzles that body. Player targeting themselves is illegal.
- Span Guard: origin + one adjacent free cell, 2 of the caster’s turns. Targeting either cell hits the **one** id. Walk translates the offset. Barrier on the second cell **shrinks** the span (honesty). Death frees both. Closet with no adjacent free cell → **reroll**.
- Span Pylon: two-cell empty summon, lifespan 3, `damageScale: 0`, Strike illegal. Shares stationary-post cap **and** span-body cap. Kill the 1 body → both cells free.
- Cadence Theft: −1 from their highest remaining CD (ties lowest id string), then −1 from the caster’s own highest remaining. Does not copy a spell. Does not reset to 0.
- Cadence Brand: next hostile **hit** (not DoT, not lava, not self-HP) writes +1 remaining CD on **that spell’s id**. Miss does **not** consume. Redirected Cover hit does **not** brand the original attacker. Attack Nearest Strike **does** consume.
- Cover Step: next damaging **hit** on the caster applies to a living Chebyshev-1 ally. Glance / AoE that never targeted the Squire bypasses it. Pull the cover off.
- Low Lintel: walk / blink / swap / vault onto the cell only if walker HP% ≤ 50. LoS **open**. Heal above 50% before crossing. Missing maxHp fail closed (cannot enter).
- Act Tax: if they still have a remaining `turnOrder` slot sooner than the Teller, next spell +1 AP. Already-acted → fizzle. Strike **is** taxed. Do not write `CharacterStatFields.init`.
- Act Bell: 14 when they **become** current actor. Death before the slot drops the mark. Evade **does** consume if treated as a hit. Same turn-start hook family as Queue Cut — **not** RAF, **not** the wrap PR.
- One Inferno cadence per pack unless a variant explicitly splits targets.
- No Glass Realm on stacked-DoT, Ignite, Fuse, Brand, Mute, or Act Bell sheets. No Time Warp on Pin / Mute / Brand / Bell / Vault windows.
- Summons stay at cap 2. Leader boost (default 10% per fallen non-leader) from CADRE up. The player can cut the leader first.

---

## Index (this drop + pointer)

Drops 1–6 union lives in [`ENEMY_FORMATIONS_2026-09-23.md`](./ENEMY_FORMATIONS_2026-09-23.md). **Do not reuse those ids.** This drop adds:

| Id | Grade | Combo | Catalog |
| :--- | :--- | :--- | :--- |
| `FSN-FACE-PIN` | PAIR | facing lock + oncoming poke | this drop |
| `FSN-MUTE-PIT` | PAIR | walk-fizzle + pit | this drop |
| `FSN-SPAN-GUN` | PAIR | two-cell plug + sniper | this drop |
| `FSN-BRAND-MEND` | PAIR | attacker +1 CD + healer | this drop |
| `FSN-VAULT-ORIGIN` | CELL | ally blink 3–4 + origin tax | this drop |
| `FSN-ACT-GIFT` | CELL | turn-start 14 + tempo | this drop |
| `FSN-FACE-COURT` | BRIGADE | pin + oncoming + glance | this drop |
| `FSN-GAIT-SNARE` | BRIGADE | mute + pit + oncoming | this drop |
| `FSN-PIN-PIT` | BRIGADE | pin + gale + pit | this drop |
| `FSN-CADENCE-MUTE` | BRIGADE | CD steal + mute + haste | this drop |
| `FSN-VAULT-FILE` | CADRE | vault + origin + glance | this drop |
| `FSN-SPAN-GATE` | CADRE | span self + lintel + sniper | this drop |
| `FSN-SPAN-PLUG` | CADRE | 2-cell post + goad + lancer | this drop |
| `FSN-BRAND-COVER` | CADRE | brand + ally-eat-hit + cantor | this drop |
| `FSN-LINTEL-COUP` | CADRE | HP%-walk + instant 25% + sated | this drop |
| `FSN-FACE-SPAN` | COURT | Face Court + two-cell plug, leader | this drop |

Named Wave 6 packs shipped as variants (not extra ids): `FSN-ACT-GIFT/MUTE` = Bell Tempo; `FSN-VAULT-FILE/COVER` = Vault Cover; `FSN-CADENCE-MUTE/GALE` = Cadence Choir.

---

## Formations

### FSN-FACE-PIN

FORMATION_ID: `FSN-FACE-PIN`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-PIN` — `bishop` **without heal** / proposed `pin_cantor` — pack median — back
- `ROLE-ONCOMING` — `knight` / proposed `oncoming_knight` — pack median + 1 — front wedge

VARIANT_RULES:

- Teaching pair for Face Court minus Glance. Distinct from `FSN-PINCH-GOAD` (two-body occupancy) and `FSN-FROST-KNIFE` (veil + knife). The tell is **`currentView`**, not adjacency.
- Band 0: **do not spawn this id** until the battle-walk facing writer exists. Show `FSN-PINCH-GOAD` instead. Do not fake Oncoming as a flat 22.
- Band 1: Pin toward the Cantor, then Oncoming only when the +10 is public. No Glance. No Gale. No Root on the Cantor.
- Elite: Knight only. Cantor stays junior so two facing elites cannot lock **and** cash.
- Unlock after `FSN-PINCH-GOAD` **or** `FSN-FROST-KNIFE` (player has seen “where you stand / face matters”).
- Random 30% family lottery is **off**.
- Isolated 1v1 Pin **reroll** — without a cash body Pin is a 0-damage stall.

SPELL_POOL_INTERACTIONS:

- Facing Pin: 2 of their turns, walks do not rewrite the literal. Dispel / wait.
- Oncoming: 12+10 iff they face the caster. Hug / diagonal tie / turn away.
- Frost after Pin is a tax, not a second lock.

TACTICAL_PLAN:

- Turn 1: Cantor Pins if the Knight can reach the wedge this or next turn; else Frosts. Knight walks to the front wedge, then Oncoming only if facing is public.
- Never turn-1 surround. Start ≥ Chebyshev 4.

SYNERGY:

- Controller (lock face) + bruiser (cash the +10). Wave 6 Pin + Oncoming. Combination, not a new sprite.

PLAYER_THREAT:

- Readable pip. Fail is staring at the Knight for a “free Frost.” Recoverable: walk past, hug, wait Pin out.

COUNTERPLAY:

- Don’t look at them. Hug Chebyshev 0. Kill the Cantor before the Knight steps in. Nail Down and ignore the wedge.

MAP_REQUIREMENTS:

- `openField` or `arena` with a 2-tile wedge in front of a typical stand **and** a side step. Reject a 1-tile tunnel (forced face is a lock).
- No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Pin: skip already-pinned; skip if no cash ally this/next turn.
- Oncoming: skip missing view; CHAMPION no-hug (refuse Chebyshev 0).
- Soph 1–2.

VARIANTS:

- `FSN-FACE-PIN/FROST` — if Pin id is not ready, Cantor Frost-only (softer PAIR; still two bodies). Do not fake Pin with Root or Rank Lock.
- `FSN-FACE-PIN/E-POKE` — elite Knight, still no Glance.

STATUS: PROPOSED

---

### FSN-MUTE-PIT

FORMATION_ID: `FSN-MUTE-PIT`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-MUTER` — `bishop` / proposed `gait_muter` — pack median
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median + 1 — paints **one** close tile

VARIANT_RULES:

- Teaching pair for Gait Snare minus the Knight. Distinct from `FSN-PIT-RANK` (pit + lancer) and `FSN-KICK-STING` (moved-this-turn damage). The fork is **close without walking** or **walk and fizzle**.
- Band 1: Stride Mute + Open Pit on the tile they want for melee. Pit dest is not the only walk-off. Mute skips if they are already adjacent and will Strike.
- Elite: Muter only. Mason stays junior so two pits cannot seal both exits.
- Unlock after `FSN-PIT-RANK` **or** `FSN-LOCK-FAN` (player has seen a pit **or** a walk rewrite).
- No Oncoming (that is `FSN-GAIT-SNARE`). No Stride Brand. No Mute Thread. No Lintel (two walk-block paints).
- Do not ship Mute until walk-debit actually arms the fizzle. Do not ship Pit as Barrier.

SPELL_POOL_INTERACTIONS:

- Stride Mute: walk-MP ≥ 1 → next spell fizzles. Blink / Swap / Vault do not trip. Cast first, then walk.
- Open Pit: walk-block, LoS open, 0 HP. Occupy at paint stays. Teleport over works.
- Frost after Mute is a tax, not silence.

TACTICAL_PLAN:

- Mason pits the close tile they must enter to Strike. Muter arms Mute only if they still need ≥ 1 walk to threaten. If they already stand adjacent, Muter Frosts / Slow (VETERAN skip Mute).

SYNERGY:

- Debuffer (walk-then-fizzle) + hazard (nobody-walks cell). Stay still and face the next pack’s charger, or walk and waste AP.

PLAYER_THREAT:

- Tempo, not HP. Fail is walking onto the pit **and** eating a fizzle. Recoverable: cast first, walk around, don’t walk.

COUNTERPLAY:

- Strike instead of Frost after a close. Wait the turn. Dispel Thread. Overwrite the pit with Barrier. Kill the Muter (`hp` ~0.80).

MAP_REQUIREMENTS:

- `arena` or `fortress` courtyard with a detour around the pit. Reject a 1-tile tunnel (pit + mute on the only tile is a lock).
- ≥ 2 walk-offs; at most one is the pit.

AI_REQUIREMENTS:

- Muter: skip adjacent-Strike; never Mute Thread.
- Pit: one cell; never both exits; not `placeBarrier`.
- Soph 1–2.

VARIANTS:

- `FSN-MUTE-PIT/SLOW` — if Mute id is not ready, Muter Slow-only (softer PAIR). Do not fake Mute with Hex of Silence.
- `FSN-MUTE-PIT/E-FORK` — elite Muter, still one pit.

STATUS: PROPOSED

---

### FSN-SPAN-GUN

FORMATION_ID: `FSN-SPAN-GUN`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-SPAN` — `rook` / proposed `span_warder` — pack median + 1 — two-cell self
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` (else live `wraith_bishop`, minRange 3) — pack median

VARIANT_RULES:

- Teaching pair for Span Gate minus Lintel. Distinct from `FSN-GLASS-WARD` (1-cell body-block) and `FSN-PIT-RANK` (empty pit). The plug is **one id, two `isCellFree` failures**.
- Band 1: Span Guard + min-range Frost. Span only if the second cell plugs a 2-wide file **and** a gallery exists. Reroll closets.
- Elite: Warder only. Sniper stays junior (do not PAIR two guns — Glance stays off).
- Unlock after `FSN-GLASS-WARD` **or** `FSN-FILE-GUARD` (player has seen a doorway gun **or** a file).
- No Span Prelate (two span bodies). No pylon/turret/font/bait. No Glance. No Pin (that is Face Court).
- Do not ship until occupancy can mark a second cell on one id. Do not fake Span with two Barriers.

SPELL_POOL_INTERACTIONS:

- Span Guard: 2 of the caster’s turns. Targeting either cell hits the Warder. Barrier on the second cell shrinks the span.
- Sniper minRange 3. Walking in around the plug is the complete answer.
- Iron Skin on the Warder is RES, not a second cell.

TACTICAL_PLAN:

- Warder Spans the 2-wide file, then holds. Sniper Frosts from ≥ 3 behind the plug. If the player is already Chebyshev ≤ 2 of the Sniper, Warder does not also walk through them (`defensiveRetreat` behind the gun at soph ≥ 3).

SYNERGY:

- Tank (two-cell occupy) + artillery. Wave 6 Span standing on drop-2’s sniper. The gun is still glass; the new question is the aisle is **two** cells thick.

PLAYER_THREAT:

- Slow, readable. Fail is fighting the plug. Recoverable: snipe the one HP bar, walk the gallery, Barrier the second cell.

COUNTERPLAY:

- Kill the Warder (one body). Glance is not on this sheet — Strike / Inferno the rook. Walk the gallery. Sit on the second cell before Span.

MAP_REQUIREMENTS:

- `fortress` or `chessboard` with a **2-wide file plus a gallery**. Reject 1-tile closets (**reroll**). Never a closed ring.
- Span second cell must not be the only player exit.

AI_REQUIREMENTS:

- Span: skip no-free-adjacent; translate only if new second cell is free; CHAMPION shrink-honesty.
- Sniper: minRange 3; refuse dest ≤ 2.
- Soph 1–2.

VARIANTS:

- `FSN-SPAN-GUN/GOLEM` — live `iron_golem` if Span occupancy is not ready. Then this is `FSN-GLASS-WARD` — **do not** call it two-cell.
- `FSN-SPAN-GUN/E-PLUG` — elite Warder, still one sniper, still a gallery.

STATUS: PROPOSED

---

### FSN-BRAND-MEND

FORMATION_ID: `FSN-BRAND-MEND`  
RELATIVE_DIFFICULTY: PAIR (kit band 1)  
ENEMIES:

- `ROLE-BRAND` — `rook` / proposed `brand_plate` — pack median + 1
- `ROLE-CANTOR` — `queen` / proposed `pale_cantor` (else live default with `starter-heal`) — pack median — self-heal + Shield

VARIANT_RULES:

- Teaching pair for Brand Cover minus Cover Squire. Distinct from `FSN-WARD-MEND` (no consume-on-hit CD) and `FSN-EVADE-GOAD` (miss). The hit **lands** and the nuke **sits**.
- Band 1: Cadence Brand + Blood Mend (self) + Shield (ally). **Do not ship** until ally Shield `targetId` apply exists — fallback `/SOLO` Cantor self-mends only (still valid).
- Elite: Plate only. Cantor stays junior. No Surplus (miss vs brand is COURT). No Thief (two cadence engines).
- Unlock after `FSN-WARD-MEND` **or** `FSN-PLATE-LINK` (player has seen a fat body + refill).
- No Cover Step on the Plate this sheet (ELITE Brand: do not Cover the same turn anyway).
- Do not put `starter-heal` on the Plate (heal-first would steal charger).

SPELL_POOL_INTERACTIONS:

- Brand: next hostile hit writes +1 CD on that id. Miss does not consume. DoT / lava do not consume. Strike **does**.
- Cantor Shield / Mend. Cursed Wound halves mend; it does not stop Brand consume.
- Iron Skin is RES under the brand, not a second consume.

TACTICAL_PLAN:

- Plate walks into the path and Brands when a nuke is off CD on the player (peer). Cantor stays ≥ 3 back, Shields the Plate under 50%, else self-mends.
- If the Plate dies, remaining Cantor is `FSN-MEND-KNIFE` minus the knife — intended.

SYNERGY:

- Protector (attacker inherits CD) + healer. Hit the plate and Inferno sits; wait 2 turns or Strike-tax a 1-CD.

PLAYER_THREAT:

- Tempo on your big id. Spike is low. Fail is dumping Inferno into a fresh brand.

COUNTERPLAY:

- Hit with Strike and accept CD 1. Poison ticks. Wait 2 turns. Kill the Cantor. Kill the Plate before the nuke. DoT does not consume — that is the designed cheap chip.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with pillars. Cantor needs two walk-offs. Never a closed ring.
- No Thorned Ground on the only path to the Cantor.

AI_REQUIREMENTS:

- Brand: skip already-branded; charger; no Cover same turn.
- Cantor: healer; `AI_BACKLINE_PROTECT` at soph 4.
- Soph 1–2.

VARIANTS:

- `FSN-BRAND-MEND/SOLO` — Cantor self-mend only (if ally Shield apply is missing).
- `FSN-BRAND-MEND/GOLEM` — live `iron_golem` if Brand pipeline is not ready. Then this is `FSN-WARD-MEND` — **do not** call it cadence.

STATUS: PROPOSED

---

### FSN-VAULT-ORIGIN

FORMATION_ID: `FSN-VAULT-ORIGIN`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-VAULT` — `queen` **without heal** / proposed `vault_chaplain` — pack median
- `ROLE-ORIGIN` — `rook` or `bishop` / proposed `origin_mason` — pack median — paints vacated cells
- Optional third: live `pawn` or wolf overlay on **one** body so Vault has a 3–4 landing — if no ally exists, **reroll**

VARIANT_RULES:

- Teaching CELL for Vault File minus Glance. Distinct from `FSN-RESCUE-LINE` (pull **to caster**) and `FSN-SHOVE-SCHOOL` (shove 1). Distance floor 3–4 is why it is not Relay Dash.
- CELL: Vault a pet onto a Cast Snare cell / a tile the player wants. Origin paints the **vacated** cell (Wave 6 pack: tax the vacated cell) **or** the player’s current tile if they hold `apCost ≥ 3` — not both same turn.
- Elite: Chaplain only. Mason stays junior. No Morrow / Mist / Hook / Shove on this sheet.
- Unlock after `FSN-RESCUE-LINE` **or** `FSN-MORROW-SNARE` (player has seen ally-move **or** origin tax).
- Landing must tick hazards. No lava landing if ally HP% < 40. Player keeps ≥ 1 escape tile after the pet lands.
- Needs a second allied body. Isolated Chaplain **reroll**.

SPELL_POOL_INTERACTIONS:

- File Vault: two-step (ally, then cell). Nail Down fizzles that body (AP spent, observe Vault). Claim Ward / occupy dest.
- Cast Snare: +1 AP to spells whose **caster origin** equals the cell. Walk / potions do not pay. Step off.
- Frost after a vault is a tax, not a second teleport.

TACTICAL_PLAN:

- Origin paints the player’s tile if they hold a 3+ AP id, else holds. Chaplain Vaults a pawn onto a 3–4 cell that is **not** the player’s last exit, preferring a Snare cell if one is public.
- Never turn-1 drop a pet adjacent on all sides. Start ≥ 4. Pet landing ≥ 2 from the player’s last exit.

SYNERGY:

- Displacement (ally blink 3–4) + origin tax. Blink a pet into someone’s front (Glance comes at CADRE); tax the vacated cell.

PLAYER_THREAT:

- Positional. Fail is leaving the only 3–4 floor empty. Recoverable: sit on the dest, Nail the pawn, step off Snare.

COUNTERPLAY:

- Occupy the landing ring. Self Anchor / Nail Down the ally. Kill the pet first. Step off origin. Kill the Chaplain (`hp` ~0.80).

MAP_REQUIREMENTS:

- `asymmetric` or `openField` with **at least one** free Chebyshev 3–4 landing from a typical pawn stand, plus a walk-off. Reject cramped `corridorMaze` (3–4 is illegal **or** a lock).
- No sealed alcove.

AI_REQUIREMENTS:

- Vault: skip no-ally / blocked / Chebyshev 1–2 or 5+; never self-blink.
- Origin: skip if they must walk off; do not `isTrap`.
- Soph 2–3.

VARIANTS:

- `FSN-VAULT-ORIGIN/WOLF` — dedicated wolf overlay on a third body (cap 1; still one summon engine).
- `FSN-VAULT-ORIGIN/E-LAND` — elite Chaplain, Glance-front landing only if Glance is in the pack (otherwise origin cell).

STATUS: PROPOSED

---

### FSN-ACT-GIFT

FORMATION_ID: `FSN-ACT-GIFT`  
RELATIVE_DIFFICULTY: CELL (kit band 1)  
ENEMIES:

- `ROLE-ACTBELL` — `queen` **without heal** / proposed `act_sexton` — pack median
- `ROLE-TEMPO` — `king` / proposed `tempo_precentor` — pack median — gifts AP so they **want** to keep the slot

VARIANT_RULES:

- Teaching CELL for Bell Tempo minus Muter. Distinct from `FSN-BELL-CUT` (HP% execute clock) and `FSN-TEMPO-CHOIR` (gift so Ignite cashes). Payload is **14 when they become current actor**, not 25%/30% execute.
- CELL: Act Bell only if they have a remaining slot. Tempo gifts the **player**? **No** — Tempo gifts the Sexton (payoff body) so the Sexton can arm **and** Frost, **or** holds if the gift would stack (replace, not +2). Variant `/BAIT` may gift nothing and instead skip — never gift the player a free Timestep.
- Honest Tempo: gift the Sexton the turn **before** arm, not the player. The “they want to act into the bell” Wave 6 sentence is **player greed** (keeping a slot to spend a nuke) plus a public mark — do not also Slow + Root them into the slot.
- Elite: Sexton only. Precentor stays junior.
- Unlock after `FSN-BELL-CUT` **or** `FSN-TEMPO-CHOIR` (player has seen a delayed clock **or** an AP gift). **No `bell_sexton` / `fuse_binder` on this sheet.**
- Do not ship until the turn-start flag reader exists (shared hook with Queue Cut — not RAF).

SPELL_POOL_INTERACTIONS:

- Act Bell: arm; 14 on become-current-actor; death before slot drops it; evade consumes if it is a hit. Observe on arm.
- Tempo Gift: +1 AP next turn, replace not stack. Challenge `hard_3` still counts spends.
- Frost is the tax, not a second clock.

TACTICAL_PLAN:

- Turn 1: Tempo gifts the Sexton. Sexton Bells only if the player has a remaining slot **and** is not already ≤ 20% (don’t waste 14 on a corpse). Never Bell a full-HP player on turn 1 in open field if they still have MP ≥ 3 and a walk-off (they can spend the slot on a walk).
- Turn 2: mark fires when they become current. Precentor skips duplicate Tempo.

SYNERGY:

- Delayed turn-start hit + AP gift. Gift so the **Sexton** can arm honestly; the player still chooses whether to keep their slot.

PLAYER_THREAT:

- 14 at turn start if the mark lives. Not unavoidable: kill the marked unit (yourself via… no — kill the Sexton; spend the slot on a summon that isn’t marked; Sidestep).

COUNTERPLAY:

- Burst the Sexton. Spend the slot on a walk / summon. Don’t Delay yourself into it. Sidestep at turn start (evade consumes). Refuse to greed a 5-AP nuke on that slot.

MAP_REQUIREMENTS:

- `openField` or `arena`. Sexton needs a retreat tile. No Time Warp (gifted AP + extra turn + bell is a lock).
- ≥ 2 walk-offs from wherever they become current.

AI_REQUIREMENTS:

- Act Bell: skip no-remaining-slot; observe on arm; heal-less.
- Tempo: skip duplicate; gift the Sexton, never the player; no `starter-heal`.
- Soph 2–3.

VARIANTS:

- `FSN-ACT-GIFT/MUTE` — **Bell Tempo** (named Wave 6 pack): add `ROLE-MUTER`. Gift AP so they want to act; mute if they close. Still no Grave Bell. Still one Slow source.
- `FSN-ACT-GIFT/E-ARM` — elite Sexton, lookahead HP (skip if they die before the slot).

STATUS: PROPOSED

---

### FSN-FACE-COURT

FORMATION_ID: `FSN-FACE-COURT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PIN` — `bishop` **without heal** / proposed `pin_cantor` — pack median
- `ROLE-ONCOMING` — `knight` / proposed `oncoming_knight` — pack median + 1
- `ROLE-GLANCE` — `queen` **without heal** / proposed `glance_ward` — pack median

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-FACE-PIN`. **Do not spawn until the battle-walk facing writer exists.**
- Elite: Knight only. Pin and Glance stay junior so two guns cannot both cash a locked face.
- Glance only if the pinned front is occupied by a **hostile**. Empty front → Frost. Do not also kit Glass Shot / Bias Ray / Far Sting.
- Mark on the **front cell** (Pin ADVANCED) is the one rare — amp Glance / landing. Not a second Glance.
- No Gale (that is `FSN-PIN-PIT`). No Span. No Vault (that is `FSN-VAULT-FILE`).
- Isolated Glance **reroll** that overlay if Pin is dead and front is empty — remaining pair is `FSN-FACE-PIN`.

SPELL_POOL_INTERACTIONS:

- Pin locks the face. Oncoming cashes +10. Glance hits the front cell (often a Wisp, or empty → skip). Packing a summon on your front is the designed mistake.
- One Frost source per AP bar across Pin / Glance.

TACTICAL_PLAN:

- Turn 1: Pin toward the Knight / Glance. Knight approaches the wedge. Glance waits for occupancy.
- Turn 2: Oncoming if facing public. Glance if front occupied. One of the three peels a wisp (`focusAlreadySet`); Glance **is** the peel if the wisp is on the front cell.
- Blackboard: `pinnedLiteral`, `frontCell`.

SYNERGY:

- Lock the face, cash the +10, **or** fizzle Glance on an empty front. Three Wave 6 facing verbs, one pip.

PLAYER_THREAT:

- High if you stare and clump. Low if you hug / turn away / leave the front empty. Not a lock.

COUNTERPLAY:

- Turn away. Hug. Don’t stack a summon on your front. Kill Glance first (`hp` ~0.70). Dispel Pin. Barrier the front cell.

MAP_REQUIREMENTS:

- `openField` or `arena` with a wedge **and** a wall-hug tile. Reject tunnels. No Time Warp.

AI_REQUIREMENTS:

- Pin: ELITE aim-the-front-cell; CHAMPION never Pin away from the gun.
- Oncoming: ELITE wait-for-pin one turn if Pin is not on CD.
- Glance: VETERAN skip empty; ELITE target the pinner’s victim, not the nearest.
- Soph 3–4. `groupTactics` at 4. Blackboard: `pinnedLiteral`, `frontCell`.

VARIANTS:

- `FSN-FACE-COURT/NO-GLANCE` — fallback to `FSN-FACE-PIN` if Glance retarget is not ready.
- `FSN-FACE-COURT/NO-KNIGHT` — Pin + Glance only (CELL-shaped). Still needs facing writer.

STATUS: PROPOSED

---

### FSN-GAIT-SNARE

FORMATION_ID: `FSN-GAIT-SNARE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-MUTER` — `bishop` / proposed `gait_muter` — pack median
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median
- `ROLE-ONCOMING` — `knight` / proposed `oncoming_knight` — pack median + 1

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-MUTE-PIT` **and** `FSN-FACE-PIN` (or `FSN-FACE-PIN/FROST` if facing writer is late — then Knight Strikes only).
- Elite: Muter only. Pit and Knight stay junior.
- Walk is illegal **or** the spell fizzles; staying still faces the charger. Pit the close tile; Mute if they must close ≥ 1; Oncoming if they stay and face.
- No Lintel (two walk-blocks). No Stride Hunter. No Glance (Face Court). No Gale.
- If facing writer is missing, Knight is a fat Strike (`FSN-MUTE-PIT` + pawn) — still valid; **do not** call it Oncoming.

SPELL_POOL_INTERACTIONS:

- Mute + Pit is the fork from the PAIR. Oncoming is why standing still is not free.
- Forced-move onto the pit still ticks occupancy (pit is walk-block — they stop before enter if the move is a walk; Vault teleport uses `isCellFree` and **fails** onto pit). Do not Vault on this sheet.

TACTICAL_PLAN:

- Mason pits the Strike tile. Muter arms if they must close. Knight holds the wedge and Oncomings only if they stayed and face.
- Never pit both galleries. Never Mute an already-adjacent Striker.

SYNERGY:

- Anti-melee mute + pit + facing poke. Combination of `FSN-MUTE-PIT` with the Face Court charger.

PLAYER_THREAT:

- Three-way fork. Fail is walking the pit **and** fizzling **and** eating +10. Recoverable: each verb still has a complete answer.

COUNTERPLAY:

- Cast first then walk around the pit. Hug the Knight (deny wedge) after you are adjacent (Mute skipped). Kill the Muter. Don’t look at the Knight.

MAP_REQUIREMENTS:

- `arena` with a pillar + detour. Reject 1-tile tunnels.
- Pit is not the only walk-off. Wedge exists.

AI_REQUIREMENTS:

- Same as the two PAIRs. Soph 3–4. Blackboard: `pitCell`, `wedgeCell`.
- `groupTactics` at 4: one focus — do not all three peel the wisp (Knight stays on the player).

VARIANTS:

- `FSN-GAIT-SNARE/NO-FACE` — Muter + Pit + default knight Strike (if facing writer is missing).
- `FSN-GAIT-SNARE/E-MUTE` — elite Muter, ELITE pit-fork (Mute only if the walk they want is the pit — they must cast or skip).

STATUS: PROPOSED

---

### FSN-PIN-PIT

FORMATION_ID: `FSN-PIN-PIT`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-PIN` — `bishop` **without heal** / proposed `pin_cantor` — pack median
- `ROLE-GALE` — `queen` **without heal** / proposed `gale_deacon` — pack median
- `ROLE-PIT` — `rook` / proposed `pit_mason` — pack median

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-FACE-PIN` **and** `FSN-GALE-HOLE`. Locked front into the wedge / hole.
- Elite: Deacon only. Pin and Pit stay junior so two displacement elites cannot seat you on a pit.
- Gale only if two player-side bodies sit in the 90° wedge **and** at least one push cell is free **or** a hazard, **and** a walk-off **that is not the pit** remains. Hug = immune.
- Pin literal ELITE: point their front at the packed cell / pit. Never Pin + Gale + Pit onto the last exit.
- No Fan Prelate (two cones). No Oncoming (Face Court). No Lintel. No Fuse.
- Do not ship Gale as a Chebyshev blob.

SPELL_POOL_INTERACTIONS:

- Pin locks the face toward the hole. Gale shoves 1. Pit is the landing they must not occupy — dest legality: prefer adjacent-to-pit, **never** onto pit unless two walk-offs exist from that cell (BRIGADE: **never** onto pit).
- Frost from Pin **or** Gale, not both same AP bar.

TACTICAL_PLAN:

- Pit a cell in the Gale push ring, not the only gallery. Pin toward that ring. Gale skips if hug or blocked.
- If the player never enters the wedge, this is a softer `FSN-FACE-PIN` plus a Frost queen — fine.

SYNERGY:

- Facing lock + cone-push + pit. Wave 6 Pin standing on drop-6’s Gale Hole.

PLAYER_THREAT:

- Positional. Fail is standing in the wedge facing the hole. Recoverable: hug the Deacon, leave the wedge, diagonal of the facing.

COUNTERPLAY:

- Hug Gale (immune). Turn away. Walk the gallery. Occupy the pit cell at paint (you stay). Kill the Deacon.

MAP_REQUIREMENTS:

- `arena` or `openField` with a 90° wedge plus a detour. Reject `corridorMaze`. Same dest rules as `FSN-GALE-HOLE`.
- Pit must not cover all walk-offs from a Gale landing.

AI_REQUIREMENTS:

- Pin: ELITE aim-front-at-pit.
- Gale: skip without two bodies / blocked push / last-exit dest (`FSN-GALE-HOLE` contract).
- Pit: one cell in the push ring, not both galleries.
- Soph 3–4. Blackboard: `pitCell`, `wedgeFacing`.

VARIANTS:

- `FSN-PIN-PIT/NO-GALE` — fallback to `FSN-FACE-PIN` + Pit (if cone+push is not ready). Still never Pin+Pit as a 1-tile tunnel.
- `FSN-PIN-PIT/FAN` — **banned.** Two cones. Do not ship.

STATUS: PROPOSED

---

### FSN-CADENCE-MUTE

FORMATION_ID: `FSN-CADENCE-MUTE`  
RELATIVE_DIFFICULTY: BRIGADE (kit band 1)  
ENEMIES:

- `ROLE-THIEF` — `bishop` / proposed `cadence_thief` — pack median
- `ROLE-MUTER` — `bishop` / proposed `gait_muter` — pack median
- `ROLE-BUFFER` — `king` / proposed `hex_chorister` (else default with Enrage / Haste, **no heal**) — pack median

VARIANT_RULES:

- Named Wave 6 pack “Cadence Mute.” Unlock after `FSN-MUTE-PIT` **or** `FSN-HEX-BLOOD`. Steal the nuke CD; they must Strike or walk-fizzle.
- Elite: Thief only. Muter and Chorister stay junior. No Ledger / Soul Siphon (two steals). No Brand (two cadence engines). No Act Teller on the base sheet (that is `/GALE`).
- Thief steals only if highest remaining ≥ 2 (Inferno CD 3 is the teach). Ties lowest id string — AI must not override to a named id.
- Chorister Hastes the Thief (MP) **or** Enrages the Muter — one buff, ally `targetId`. If apply is missing, Chorister **only** holds / Frosts (still valid; no `starter-heal`).
- No Mute Thread. No Gale on the base sheet.

SPELL_POOL_INTERACTIONS:

- Cadence Theft: −1 their highest remaining, −1 thief’s own highest (often none). Does not copy Inferno.
- Stride Mute: if they close to recast, the recast fizzles. Cast-then-walk is the answer.
- Haste is walk budget, not Tempo AP.

TACTICAL_PLAN:

- Turn 1: Thief Frosts if all CDs are 0; else steals. Muter arms only if they must close. Chorister Hastes the Thief if LoS died.
- Dump Inferno **before** the Thief acts is the designed punish-the-wait.

SYNERGY:

- CD steal + walk-fizzle + haste. Tempo on the **cooldown map**, plus the close fork.

PLAYER_THREAT:

- Your Inferno sits an extra turn **or** you walk it into a fizzle. Not a lock: dump first, Strike, wait Mute.

COUNTERPLAY:

- Dump the nuke before they act. Spend CD 1 fillers so the steal hits Slow. Cast first then walk. Kill the Thief (`hp` ~0.75, init high).

MAP_REQUIREMENTS:

- `openField` or `arena` with two approaches. No Time Warp.
- Muter needs a retreat tile.

AI_REQUIREMENTS:

- Thief: skip CD 0; ELITE wait one turn if the nuke is not on CD yet; CHAMPION still only −1.
- Muter: skip adjacent-Strike.
- Chorister: buffer; no heal kit.
- Soph 3–4. `groupTactics` at 4.

VARIANTS:

- `FSN-CADENCE-MUTE/GALE` — **Cadence Choir** (named Wave 6 pack): replace Chorister with `ROLE-GALE` **and** add `ROLE-ACTTAX` only if that would be four bodies — **no.** Cadence Choir is Thief + Act Teller + Gale. Variant swaps Muter→Teller and Chorister→Gale. Still one cone. Still no second steal. Unlock after `FSN-GALE-HOLE`.
- `FSN-CADENCE-MUTE/NO-HEX` — Thief + Muter only (if buffer apply is missing).

STATUS: PROPOSED

---

### FSN-VAULT-FILE

FORMATION_ID: `FSN-VAULT-FILE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-VAULT` — `queen` **without heal** / proposed `vault_chaplain` — pack median — `isLeader` optional
- `ROLE-ORIGIN` — `rook` or `bishop` / proposed `origin_mason` — pack median
- `ROLE-GLANCE` — `queen` **without heal** / proposed `glance_ward` — pack median

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-VAULT-ORIGIN` **and** `FSN-FACE-COURT` (or `FSN-FACE-PIN` if Glance is new here — then Glance is the CADRE rare).
- Elite: Chaplain-leader only. Origin and Glance stay junior.
- Blink a pet into someone’s **front**; tax the vacated cell. Glance fires only if that front is occupied. Needs an ally (pawn / wolf). Isolated **reroll**.
- No Mist / Morrow / Hook / Shove. No second Glance-gun. Facing writer required for Glance; if missing, Glance Frosts and the sheet is Vault+Origin+Frost queen (still CADRE-shaped, weaker).
- Leader boost 10% × fallen escort. Cut the Chaplain first.

SPELL_POOL_INTERACTIONS:

- Vault landing on the player’s front cell is the Glance setup. Origin paints the **vacated** pawn tile so recasting from the old square costs +1 AP.
- Nail Down the pawn fizzles Vault (AP spent). Occupy dest. Step off Snare.
- One Frost source per AP bar.

TACTICAL_PLAN:

- Origin paints vacated-or-player-origin (not both same turn). Chaplain Vaults 3–4 onto a public front if Pin/facing is known, else onto a Snare cell. Glance skips empty.
- Blackboard: `vaultDest`, `frontCell`, `snareCell`. Dest ≠ last player exit.

SYNERGY:

- Ally blink 3–4 + origin tax + hit-the-facing-cell. Three verbs, one landing.

PLAYER_THREAT:

- High if you leave a packed front and an empty 3–4 floor. Low if you sit on the dest. Fail is ignoring the pet.

COUNTERPLAY:

- Occupy the landing. Nail the pet. Turn away so Glance fizzles. Kill the Chaplain-leader. Don’t clump on your front.

MAP_REQUIREMENTS:

- `asymmetric` or `chessboard` with a 3–4 landing **and** a front cell that is not the only exit. Reject closets.
- Four-occupancy (3 hostiles + pet) still starts hostiles ≥ 4 from the player; pet may land ≥ 2 later.

AI_REQUIREMENTS:

- Vault: ELITE land on Glance front / origin glyph; optional `isLeader`; `escapeRoute` at 6 on leader variant.
- Origin: paint vacated if the vault just happened (`blackboard.lastVacated`).
- Glance: skip empty; ELITE hunt the vault landing.
- Soph 4–6. `groupTactics` on.

VARIANTS:

- `FSN-VAULT-FILE/COVER` — **Vault Cover** (named Wave 6 pack): replace Glance with `ROLE-COVER` + `ROLE-WARDEN` would be four — **no.** Vault Cover is Chaplain + Cover Squire + Leash Warden. Variant swaps Glance→Cover and Origin→Warden. Cover on the Warden; vault the cover off after consume. Still one summon engine. Unlock after `FSN-BRAND-COVER` **or** `FSN-GLASS-WARD`.
- `FSN-VAULT-FILE/NO-GLANCE` — fallback to `FSN-VAULT-ORIGIN`.
- `FSN-VAULT-FILE/NO-LEADER` — teaching CADRE.

STATUS: PROPOSED

---

### FSN-SPAN-GATE

FORMATION_ID: `FSN-SPAN-GATE`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-SPAN` — `rook` / proposed `span_warder` — pack median + 1 — `isLeader` optional
- `ROLE-LINTEL` — `rook` or `bishop` / proposed `lintel_mason` — pack median
- `ROLE-SNIPER` — `bishop` / proposed `glass_sniper` — pack median

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-SPAN-GUN`. Two-cell plug + healthy bodies cannot bypass; gun behind.
- Elite: Warder-leader only. Lintel and Sniper stay junior.
- Lintel the **bypass** next to the Span (ELITE Mason) only if player HP% > 50. Never Lintel + Pit. Never Span Prelate on this sheet.
- Gallery must remain a legal path at HP% any (lintel is the **bypass**, not both galleries). Weight 0 on 1-tile closets.
- No Glance-as-second-gun. No Goad (that is Span Plug).

SPELL_POOL_INTERACTIONS:

- Span = two cells. Lintel = HP% gate on the third cell they wanted. Sniper minRange 3.
- Heal above 50% then take the lintel. Chip the Warder (one HP bar). Barrier shrinks Span.

TACTICAL_PLAN:

- Warder Spans the 2-wide file. Mason Lintel the gallery **only if** a second gallery exists **or** the lintel is not the last exit. Sniper Frosts from ≥ 3.
- If the Warder dies, remaining pair is Lintel + Sniper — a soft `FSN-GLASS-WARD` with an HP% door.

SYNERGY:

- Two-cell occupy + HP%-walk + min-range gun. Combination of Span Gun with Wave 6 lintel.

PLAYER_THREAT:

- High at 80% HP in a 2-wide file. Low after a mend-and-cross or a gallery walk. Not a lock.

COUNTERPLAY:

- Mend first. Walk the clean gallery. Kill the Warder-leader. Overwrite lintel with Barrier. Close the Sniper.

MAP_REQUIREMENTS:

- `fortress` courtyard + **two** galleries, or `chessboard` 2-wide file + side aisle. **Reroll** closets.
- Lintel must not be the only cell that leaves the file.

AI_REQUIREMENTS:

- Span: optional `isLeader`; `escapeRoute` at 6; CHAMPION shrink-honesty.
- Lintel: skip if player already ≤ 50%; ELITE plug the bypass next to Span.
- Sniper: minRange 3.
- Soph 4–6. `groupTactics` on. `chokepointCamp` only with a gallery. Blackboard: `spanSecond`, `lintelCell`.

VARIANTS:

- `FSN-SPAN-GATE/NO-LINTEL` — fallback to `FSN-SPAN-GUN`.
- `FSN-SPAN-GATE/NO-LEADER` — teaching CADRE.

STATUS: PROPOSED

---

### FSN-SPAN-PLUG

FORMATION_ID: `FSN-SPAN-PLUG`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-SPANPOST` — `rook` / proposed `span_prelate` — pack median + 1 — `isLeader` optional
- `ROLE-GOAD` — `pawn` or `knight` / proposed `goad_herald` — pack median
- `ROLE-LANCER` — `rook` / proposed `rank_lancer` — pack median — same file as the post

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-BASTION-GATE` **or** `FSN-SPAN-GUN`. Taunt into a 2-cell wall on the file. Distinct from Bastion Gate (1-cell **empty** post, min-range gun) — this post is **two cells**, the gun is a **file lancer**.
- Elite: Prelate-leader only. Herald and Lancer stay junior.
- Span-pylon cap 1, lifespan 3, empty kit, `summonAI: "span"`. Shares post cap **and** span-body cap. Do not also roll wolf/pylon/turret/font/bait. Do not also spawn `span_warder`.
- Goad then wait if the post is not down (ELITE Prelate). Non-damage tools ignore taunt. Gallery must remain a legal non-damage path.
- Weight 0 on 1-tile closets. Lancer owns the **same** file, not a second file (`FSN-FILE-WIRE` law).
- `inferSummonArchetype` must key `"span"` before this ships.

SPELL_POOL_INTERACTIONS:

- Two-cell wall + Goad + File Lance. AoE that includes the Herald satisfies taunt **and** can clip the Lancer — designed.
- Iron Skin on the Prelate, not a second post. Official lancer poke `spell-file-lance`.

TACTICAL_PLAN:

- Turn 1–2: Prelate places if both cells free **and** they plug a file; else Strikes. Herald Goads and steps into Strike range. Lancer holds until the player shares the file.
- If the pylon dies, both cells free; remaining pair is Goad + Lancer — a soft `FSN-FILE-GUARD` + taunt.

SYNERGY:

- Stationary 2-cell wall + taunt + linear file. Wave 6 span-pylon standing on Wave 2/3 file + goad.

PLAYER_THREAT:

- Highest silent-wall threat in this drop. Still turn-based. Fail is Strike-the-Herald on the file. Recoverable: Slow / Barrier / Swap / Absolve taunt, burst the 1 body, step off-file.

COUNTERPLAY:

- Non-damage tools. Walk the gallery. Burn the pylon (one HP bar, both cells). Kill the Prelate-leader. Never share the file. AoE Herald + Lancer.

MAP_REQUIREMENTS:

- `fortress` or `chessboard` with a 2-wide file **plus** a gallery. **Reroll** closets. Never a closed ring.
- Placement: two adjacent free cells, none void. Player must have a tile off the goaded file.

AI_REQUIREMENTS:

- Spanpost: skip blocked adjacent; ELITE wait-for-goad; CHAMPION empty-kit honesty; summoner fall-through (Frost / Iron Skin, never skip-lock).
- Goad: retreat disabled while live; skip if already the only legal damaging target.
- Lancer: linear-only, same `ownedFile` as pylon.
- Soph 4–6. `groupTactics` on. `escapeRoute` (6) on leader. `bottleneckControl` (8) only if a gallery exists.
- Blackboard: `spanCells`, `goadLive`, `ownedFile`.

VARIANTS:

- `FSN-SPAN-PLUG/POST` — teaching BRIGADE: Prelate + Herald only (if Lancer clutters). Still reject closets.
- `FSN-SPAN-PLUG/PYLON` — fallback 1-cell `pylon_prelate` if span summonAI is not ready. Then this is `FSN-BASTION-GATE` minus sniper plus lancer — **do not** call it two-cell.
- `FSN-SPAN-PLUG/NO-LEADER` — teaching CADRE.

STATUS: PROPOSED

---

### FSN-BRAND-COVER

FORMATION_ID: `FSN-BRAND-COVER`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-BRAND` — `rook` / proposed `brand_plate` — pack median + 1
- `ROLE-COVER` — `rook` or `king` **without Rally** / proposed `cover_squire` — pack median
- `ROLE-CANTOR` — `queen` / proposed `pale_cantor` — pack median — self-heal + Shield

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-BRAND-MEND`. Redirected hit does **not** brand; heal the cover body.
- Elite: Plate only. Squire and Cantor stay junior.
- Cover the Cantor / a pawn, **not** the Plate on the same turn Brand is armed (Wave 6 Brand ELITE). Teaching: shoot the Squire → cover pawn eats it → Brand does not write on your Inferno; shoot the Plate → Inferno sits.
- No Pain Link / Tether / Bait on this sheet. No Surplus. No Thief. No `starter-heal` on Brand or Cover.
- **Do not ship** until hit-consume pipeline exists for Brand **and** Cover (not inside `dealDamage` math). Ally Shield apply required for Cantor→Plate; `/NO-CANTOR` otherwise.
- Needs a Chebyshev-1 ally for Cover. Isolated Squire **reroll**.

SPELL_POOL_INTERACTIONS:

- Brand consume-on-hit vs Cover redirect. Glance / AoE that never targeted the Squire bypasses Cover and can still Brand the Plate if the Plate was the target.
- Cantor Shields the cover body after a consume, else the Plate, else self-mends.
- DoT chips without consuming Brand — designed.

TACTICAL_PLAN:

- Plate Brands when a nuke is off CD. Squire Covers an adjacent ally (Cantor if HP% ≥ 20, else a pawn). Cantor refills the body that actually lost HP.
- If the Plate dies, remaining pair is Cover + Cantor — someone else still eats a hit.

SYNERGY:

- Attacker +1 CD + ally-eats-the-hit + healer. The lesson is **which body you targeted**.

PLAYER_THREAT:

- Long, structured. Spike is low. Fail is Inferno-the-Plate while Brand is up, **or** shooting the Squire and wondering why Brand didn’t sit.

COUNTERPLAY:

- Strike-tax CD 1 into the Plate. Poison. Pull the cover off (Chebyshev > 1). Glance/AoE the Cantor directly. Kill the Plate. Wait 2 turns.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery. Band needs space to **break** Cover (Chebyshev 2 aisle). Never a closed ring that forces Cover forever.
- Cantor two walk-offs.

AI_REQUIREMENTS:

- Brand: skip already-branded; do not Cover-Step the same body the same turn.
- Cover: skip no-adj / ally HP% < 20; CHAMPION math-honesty (cover body’s RES/SR).
- Cantor: healer + ally Shield.
- Soph 4–6. `AI_BACKLINE_PROTECT` on. `groupTactics` on. Blackboard: `brandLive`, `coverPair`.

VARIANTS:

- `FSN-BRAND-COVER/NO-CANTOR` — BRIGADE-shaped: Brand + Cover only (if ally heal apply is missing).
- `FSN-BRAND-COVER/WARDEN` — Cover the Leash Warden (Vault Cover adjacent; do not also Vault on this id).

STATUS: PROPOSED

---

### FSN-LINTEL-COUP

FORMATION_ID: `FSN-LINTEL-COUP`  
RELATIVE_DIFFICULTY: CADRE (kit band 1)  
ENEMIES:

- `ROLE-LINTEL` — `rook` or `bishop` / proposed `lintel_mason` — pack median
- `ROLE-COUP` — `knight` / proposed `coup_duelist` — pack median − 1
- `ROLE-SATED` — `knight` or `rook` / proposed `sated_knight` — pack median + 1

VARIANT_RULES:

- Named Wave 6 pack. Unlock after `FSN-COUP-ROT` **or** `FSN-FINISH-LINE` **and** `FSN-SATED-PLATE` (or any fight where the player has seen ≥70% Fang **or** ≤25% Coup). Healthy cannot cross; ≤25% dies; ≥70% still bites.
- Elite: Sated only. Lintel and Coup stay junior so two execute elites cannot 100–0 (Wave 5 law: do not PAIR sated + coup — this CADRE is the **exception** because Lintel is the third verb that makes the fork readable). Still **no `bell_sexton`**. Still no execute_jackal.
- Three public HP% bars, one fork (same contract as drop 6 `FSN-SATED-PLATE`): Sated Fang is legal only when the **target** `hp / maxHp >= 0.70`; Coup is instant at target ≤ 25%; Lintel lets a walker enter only at walker HP% ≤ 50. Stay healthy behind the lintel and eat Fang if you peek; chip to cross and enter Coup range. Absorb is **not** HP. Never Fang a full-HP player as a turn-1 gotcha if they can still walk away.

- No Pit (two walk-blocks). No Ignite on the base sheet (Finish Line). No Tempo gift into Coup (drop 4 COURT-caution).
- Heal-out above 25% **and** chip below 70% **and** mend above 50% to cross are all legal. Not unavoidable.

SPELL_POOL_INTERACTIONS:

- Lintel: HP% ≤ 50 may enter. Coup: instant ≤ 25%. Sated Fang: ≥ 70% target. Absorb is **not** HP for Coup or Fang.
- One melee cadence per AP bar: Fang **or** Coup, not both same body. Two knights, two windows — they do not share a turn on the same HP bar if `groupTactics` focuses one.

TACTICAL_PLAN:

- Mason Lintel the choke if HP% > 50. Sated holds the far side and Fangs only while the player reads ≥ 70%. Coup lurks and ignores a healthy player.
- Never turn-1 surround. Start ≥ 4. Blackboard: `lintelCell`, `executeWindow`.
- If the player sits at 40–60%, **neither** window is live and Lintel is passable — intended “middle is safest.”

SYNERGY:

- HP%-gated walk + instant 25% + high-HP bite. The lintel is why you cannot treat this as two execute clocks.

PLAYER_THREAT:

- High at 80% peeking the choke, or at 20% adjacent to Coup. Low at 40–60% with a mend ready. Fail is crossing at 80% then greed-trading at 20%.

COUNTERPLAY:

- Chip to 50% off-choke, then cross, then mend above 25% before Coup steps in. Don’t peek at 80%. Kill Coup (`hp` ~0.75). Keep Chebyshev ≥ 2 from Coup. Slow the last tile.

MAP_REQUIREMENTS:

- `fortress` courtyard + gallery, or `arena` with a choke **plus** a detour. Reject 1-tile tunnels (lintel on the only tile + two knights is a lock).
- Lintel is not the only exit. No Time Warp. No Glass Realm.

AI_REQUIREMENTS:

- Lintel: skip if player already ≤ 50%.
- Coup: HP% gate; ELITE path to the wounded body; refuse healthy Coup.
- Sated: Fang only ≥ 70% target; refuse under 70 (Strike / Shield).
- Soph 4–6. `groupTactics` on: one focus. Do not enable both knights to commit the same turn on a full-HP player.

VARIANTS:

- `FSN-LINTEL-COUP/NO-SATED` — Lintel + Coup only (if Sated id is not ready). Softer CADRE; still no Pit.
- `FSN-LINTEL-COUP/NO-COUP` — Lintel + Sated (teaching high-bar vs door). Unlock parallel to `FSN-SATED-PLATE`.

STATUS: PROPOSED

---

### FSN-FACE-SPAN

FORMATION_ID: `FSN-FACE-SPAN`  
RELATIVE_DIFFICULTY: COURT (kit band 2, AI soph 6–8)  
ENEMIES:

- `ROLE-PIN` — `bishop` **without heal** / proposed `pin_cantor` — pack median
- `ROLE-ONCOMING` — `knight` / proposed `oncoming_knight` — pack median
- `ROLE-GLANCE` — `queen` **without heal** / proposed `glance_ward` — pack median
- `ROLE-SPAN` — `rook` / proposed `span_warder` — pack median + 1 — `isLeader`

VARIANT_RULES:

- Unlock after `FSN-FACE-COURT` **and** `FSN-SPAN-GATE` **and** a leader-boost CADRE. Wave 6 geometry COURT: Face Court plus the two-cell plug, not a new monster.
- One elite only: the Warder-leader. Others stay junior so boost is the late scare, not four elites.
- **Facing writer required.** Until it lands, do not spawn this id (`FSN-SPAN-GATE` remains the COURT-adjacent CADRE).
- Span plugs the 2-wide file the Knight wants for the wedge. Pin literal points their front at the plug / Glance cell. Glance skips empty. Oncoming skips missing view.
- No second span body. No span-pylon / pylon / turret / font / bait. No Gale (push + span + pin in a pocket is a lock). No Lintel on the base sheet (Span Gate already taught the bypass; adding it here would seal both galleries — `/LINTEL` is **banned** unless a **third** gallery exists).
- InstantKill / betrayal stay off. `bottleneckControl` (8) only if a gallery exists. `escapeRoute` (6) on: wounded Warder walks to the gallery, translating the span only if the new second cell is free.
- Dungeon depth may not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.
- Teaching BRIGADE remains `FSN-FACE-COURT`. Do not skip to this COURT.

SPELL_POOL_INTERACTIONS:

- Two-cell plug owns the file. Pin locks the face. Oncoming cashes if they still look. Glance hits the front cell (often a Wisp stuffed against the plug).
- Iron Skin on the Warder. Mark on the front cell is the one elite rare (amp Glance).
- `spell-rallying-cry` stays false. No Cross Cut / Gale on this sheet (second geometry gun).

TACTICAL_PLAN:

- Turn 1–2: Warder Spans the 2-wide file. Pin toward the wedge. Knight approaches. Glance waits for occupancy.
- If the Warder dies, both cells free; remaining trio is `FSN-FACE-COURT` — intended, not a sudden Coup.
- Leader boost 10% × fallen escort. Cut the Warder early or accept a longer finish.

SYNERGY:

- Facing court + two-cell plug. Court-scale **where you look and which aisle exists**. Sophistication and a fourth body are the unlock, not a new sprite.

PLAYER_THREAT:

- Highest facing-structured threat in this drop. Still turn-based. Failure is staring into the plug with a Wisp on your front. Recoverable: gallery, hug, turn away, Barrier the second cell, kill the leader.

COUNTERPLAY:

- Walk the gallery. Turn away. Hug the Knight. Don’t clump on your front. Barrier-shrink the span. Burst the Warder-leader. Kill Glance (`hp` ~0.70). Dispel Pin.

MAP_REQUIREMENTS:

- `fortress` courtyard + **two** galleries, or `chessboard` with a 2-wide file **plus** a file the player can take. Never a closed ring. Weight 0 on 1-tile closets.
- Span second cell: free, not void, not the only player exit. Wedge exists. Wall-hug tile exists.
- No Time Warp. No lava on both galleries.

AI_REQUIREMENTS:

- Span: `isLeader`; skip no-free-adjacent; translate only if new second free; `escapeRoute` at 6; CHAMPION shrink-honesty.
- Pin: CHAMPION never Pin away from the gun.
- Oncoming: skip missing view; no-hug at CHAMPION.
- Glance: skip empty; hunt the pinner’s victim.
- Soph 6–8. `groupTactics` on. `erratic` (5) may apply to **one** escort, not the Warder.
- Escorts do not path a closed box. Blackboard: `spanSecond`, `pinnedLiteral`, `frontCell`, `wedgeCell`.

VARIANTS:

- `FSN-FACE-SPAN/NO-GLANCE` — COURT of three: Pin + Oncoming + Span (if Glance retarget is not ready).
- `FSN-FACE-SPAN/NO-FACE` — fallback to `FSN-SPAN-GATE` if facing writer is missing.
- `FSN-SPAN-PLUG` remains the taunt+post CADRE; do not merge ids.

STATUS: PROPOSED

---

## Progression (relative unlock graph)

Drops 1–6 still stand. This drop **meshes**; it does not replace.

```
PAIR:    FACE-PIN          MUTE-PIT         SPAN-GUN         BRAND-MEND
            \                 |                 |                 |
CELL:                  VAULT-ORIGIN                         ACT-GIFT
            \                 |                 |                 |
BRIGADE: FACE-COURT    GAIT-SNARE    PIN-PIT    CADENCE-MUTE
            \                 |                 |                 |
CADRE:   VAULT-FILE    SPAN-GATE    SPAN-PLUG    BRAND-COVER    LINTEL-COUP
            \                 |                 |
COURT:                    FACE-SPAN
```

Cross-catalog prereqs (relative mastery, not XP):

| This id | Also requires from earlier catalogs |
| :--- | :--- |
| `FSN-FACE-PIN` | `FSN-PINCH-GOAD` **or** `FSN-FROST-KNIFE` |
| `FSN-MUTE-PIT` | `FSN-PIT-RANK` **or** `FSN-LOCK-FAN` |
| `FSN-SPAN-GUN` | `FSN-GLASS-WARD` **or** `FSN-FILE-GUARD` |
| `FSN-BRAND-MEND` | `FSN-WARD-MEND` **or** `FSN-PLATE-LINK` |
| `FSN-VAULT-ORIGIN` | `FSN-RESCUE-LINE` **or** `FSN-MORROW-SNARE` |
| `FSN-ACT-GIFT` | `FSN-BELL-CUT` **or** `FSN-TEMPO-CHOIR` |
| `FSN-FACE-COURT` | `FSN-FACE-PIN` |
| `FSN-GAIT-SNARE` | `FSN-MUTE-PIT` + `FSN-FACE-PIN` |
| `FSN-PIN-PIT` | `FSN-FACE-PIN` + `FSN-GALE-HOLE` |
| `FSN-CADENCE-MUTE` | `FSN-MUTE-PIT` **or** `FSN-HEX-BLOOD` |
| `FSN-VAULT-FILE` | `FSN-VAULT-ORIGIN` + (`FSN-FACE-COURT` or `FSN-FACE-PIN`) |
| `FSN-SPAN-GATE` | `FSN-SPAN-GUN` |
| `FSN-SPAN-PLUG` | `FSN-BASTION-GATE` **or** `FSN-SPAN-GUN` |
| `FSN-BRAND-COVER` | `FSN-BRAND-MEND` |
| `FSN-LINTEL-COUP` | (`FSN-COUP-ROT` or `FSN-FINISH-LINE`) + (`FSN-SATED-PLATE` or seen Fang) |
| `FSN-FACE-SPAN` | `FSN-FACE-COURT` + `FSN-SPAN-GATE` + a leader CADRE |

A run may skip a **branch**. It must not skip a **grade**.

### Deferred — Wave 7 families (PR #535) and leftover spell verbs (not this drop)

Sibling [`docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md`](../automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md) (open as PR #535) stamped fourteen world-pack families that consume Wave 6 SPELL_PROPOSALS (PR #463). This catalog already packed Wave 6 families from PR #452. Drop 8 owns the Wave 7 packs; do **not** duplicate those family ids here.

| Named pack (PR #535 §3) | Members | Lesson |
| :--- | :--- | :--- |
| Post Tithe | `post_stinger` + `tithe_mason` + `axis_locksmith` | Camp the tax cell; walk-off pays and drops the +10 |
| Purse Court | `purse_scribe` + `act_teller` + `gait_muter` | Cut the loaded bar they cannot spend on a 3-AP nuke |
| Corner Fog | `corner_bishop` + `smoke_thurifer` + `span_warder` | Place the block, then cash the +12 |
| Hinge Cover | `hinge_squire` + `cover_squire` + `glance_ward` | Swing behind the pivot, then redirect / Glance the new front |
| Reel Tithe | `file_reeler` + `tithe_mason` + `oncoming_knight` | Pull onto the tax; they face the charger or pay to leave |
| Twin Plug | `twin_span` + `lintel_mason` + `glass_sniper` | Walking two-cell plug + healthy bodies cannot bypass |
| Veil Corner | `veil_cantor` + `corner_bishop` + `goad_herald` | Forced Strike into a veiled body; spells must AoE or skip |
| Break Choir | `cadence_breaker` + `ignite_alchemist` + `tempo_precentor` | Reset Inferno once; gift AP so the second cash lands |
| Lend Fan | `cadence_lender` + `gale_deacon` + `font_cantor` | Shave Gale CD; pulse keeps the gun standing |
| Spark Purse | `spark_chanter` + `purse_splitter` + `cadence_breaker` | Transfer 1, detonate +1 on **their** turn, reset the follow-up |
| Hinge Trap | `hinge_mason` + `fuse_binder` + `pit_mason` | Enter-swap onto a wick / hole |
| Cap Veil | `cap_warder` + `veil_cantor` + `goad_herald` | Forced swing caps at 12; spells cannot primary the veil |
| Reel Corner | `file_reeler` + `corner_bishop` + `pylon_prelate` | Pull them behind the post, then shoot the blocked LoS |
| Split Spark | `purse_splitter` + `spark_chanter` + `act_sexton` | Gift leftover AP, then arm a turn-start 14 they want to keep |

Drop 8 PAIR bans (from PR #535; COURT later is fine): no `post_stinger`+`stride_hunter`/`far_stinger`/`glass_sniper` without a tithe/lock third; no `purse_scribe`+`ledger_siphon`/`surplus_warder`; no `corner_bishop`+second gun without a smoke/span/pylon third; no `hinge_squire`+vault/hook/shove/mist/morrow/blink; no `file_reeler`+`void_anchoret`/`sink_chanter`/`pair_binder`; no `twin_span`+span body or stationary post; no `veil_cantor`+`smoke_thurifer`/`sidestep_warder` PAIR; no `cadence_breaker`+`cadence_thief`; no `cadence_lender`+`tempo_precentor` PAIR; no `purse_splitter`+`tempo_precentor`/`ledger_siphon`; no `tithe_mason`+`tax_scribe`/`origin_mason`/`glyph_sower`; no `hinge_mason`+`rift_hook`/`pawn_broker`/`twin_porter`/`trip_mason`; no `spark_chanter`+`cinder_martyr`/`brood_chanter` PAIR; no `cap_warder`+`plate_warden`/`surplus_warder`/`cover_squire` PAIR. Twin Span fills `ENEMY_SUMMON_CAP`. Twin Plug / Reel Corner need a file plus an adjacent free cell.

Sibling [`docs/automation/SPELL_PROPOSALS_2026-09-24.md`](../automation/SPELL_PROPOSALS_2026-09-24.md) (open as PR #525) stamped Wave 7 verbs that **still have no family**. Elite-evolution Wave 7 left those for Wave 8. Wave 6 §9 held boss/closed-class Mute Thread / Queue Cut / False Cut. This catalog does **not** mint `FSN-*` ids that require Wave 7 verbs.

| Leftover verb | Nearest older overlay | Why that is not enough |
| :--- | :--- | :--- |
| `spell-wall-sting` | `ROLE-SNIPER` / Glance | Glass is min-range flat; Glance is **their** front. Wall Sting cares about a **solid**. |
| `spell-file-brand` | `ROLE-BRAND` / Lancer | Brand is consume-on-hit CD. File Brand is **file-scoped**. |
| `spell-boot-sting` | `ROLE-MUTER` / Stride Hunter | Mute fizzles a spell; Stride damages a move. Boot is another rider. |
| `spell-shove-face` | `ROLE-GALE` / Oncoming | Gale is cone-push; Oncoming is facing bonus. Shove-face is **forced turn**. |
| `spell-knight-slip` | `ROLE-VAULT` / Mist | Vault blinks an ally 3–4. Slip is a different self/step. |
| `spell-pivot-foe` | `ROLE-PIN` | Pin locks a literal. Pivot **rewrites** facing as a shove. |
| `spell-triple-span` | `ROLE-SPAN` / Spanpost | Two-cell is Wave 6. Triple is a new occupancy count. |
| `spell-cadence-crack` | `ROLE-THIEF` | Theft is −1 remaining. Crack is not a reset-to-0 clone — still a new family. |
| `spell-must-pace` | `ROLE-MUTER` / Misstep | Mute is walk→fizzle. Misstep is one cardinal. Must-pace is another walk rewrite. |
| `spell-once-verse` | `ROLE-VERSE` | Stolen Verse is last-id 50%. Once-verse is a different echo gate. |
| `spell-tick-hood` | `ROLE-ACTBELL` / Fuse | Act Bell is turn-start 14. Fuse is occupancy. Hood is another timer. |
| `spell-flank-share` | `ROLE-COVER` / Pincer | Cover redirects a hit; Pincer is occupancy cash. Share is another split. |
| `spell-spare-pace` | `ROLE-TEMPO` | Tempo is +1 AP next turn. Spare-pace is another resource gift. |
| `spell-pit-wick` | `ROLE-PIT` / Fuse | Pit is walk-block; Fuse is occupancy bomb. Wick-on-pit is a combo id. |
| `spell-exit-boon` | `ROLE-LINTEL` | Lintel is HP% enter. Boon is a leave-cell rider. |
| `spell-court-shove` | `ROLE-GALE` / Board Tilt | Signature mass shove, not a teaching PAIR. |

Do **not** pack `act_sexton` with `bell_sexton` as a teaching pair. `FSN-BELL-CUT` stays the delayed-execute lesson; `FSN-ACT-GIFT` stays the turn-start 14 lesson.

Do **not** co-spawn two span bodies or two stationary posts. Do not put drain / nova / `starter-heal` on facing, mute, vault, span, thief, brand, cover, lintel, or act overlays.

---

## Implementation notes (for a later engineer — not this drop)

These sheets need the same pack composer as drops 1–6, plus Wave 6 verbs in this order (from elite-evolution Wave 6 §8):

1. Numeric kit band into `buildEnemyKit` (`WX` 11920).
2. Keep family HP through `calcEnemyMaxHp` (`WX` 11970–11974). Stop writing `res`/`sp` as 0.05–0.75 (`spawnPolicy.ts`).
3. Explicit `enemy.role` / `aiProfile` so healAmount kits do not collapse. Pin / Glance / Vault / Act Bell / Tempo **must not** carry `starter-heal`.
4. **Battle-walk `currentView` writer** — hard gate for every Oncoming / Pin / Glance sheet. Ties fail closed. Forced-move does not rewrite. Pin literal honored on the walk writer.
5. Ally buff apply (`targetId` on Shield / Iron Skin / Enrage / Tempo). Cover / Brand hit-consume pipeline **before** `dealDamage` formula edits.
6. Occupancy pair on one id (Span Guard) + `summonAI: "span"` allow-list (admin + `inferSummonArchetype` key, never `name.includes("span")`) + summoner fall-through.
7. File Vault occupancy teleport (not push); dest ticks hazards; Nail Down fizzles that body.
8. Stride Mute walk-debit flag; Open Pit not `placeBarrier`; Low Lintel HP% predicate (fail closed if maxHp missing).
9. Cadence maps by id (−1 remaining, never reset to 0, never copy). Brand consume on **hit**, miss does not consume, Cover redirect does not brand.
10. Act Tax reads live `turnOrder` + `currentTurnIndex`. Act Bell turn-start flag — **same hook family as Queue Cut, not RAF, not the wrap PR**.
11. Cap the summoner overlay (`WX` 11932–11942). COURT span-pylon sheets assume the lottery does not add a second engine.
12. Gale dest legality already required by drop 6 — Pin Pit reuses it.

They do **not** need new pixel patterns, RAF edits, map-generation rewrites, turn-order splices, or damage-formula edits. Map **selection** is a filter on already generated maps. Do not implement those hooks in the same change as this catalog.

### Do not ship before (honesty)

| Sheet | Gate |
| :--- | :--- |
| `FSN-FACE-PIN`, `FSN-FACE-COURT`, `FSN-GAIT-SNARE`, `FSN-PIN-PIT`, `FSN-FACE-SPAN` | battle-walk `currentView` writer; Oncoming not a flat 22; Glance skip empty |
| `FSN-MUTE-PIT`, `FSN-GAIT-SNARE`, `FSN-CADENCE-MUTE` | walk-debit mute; Pit ≠ Barrier; never Mute Thread |
| `FSN-SPAN-GUN`, `FSN-SPAN-GATE`, `FSN-FACE-SPAN` | two-cell occupancy on one id; gallery exists; shrink-honesty |
| `FSN-SPAN-PLUG` | `summonAI === "span"`; empty kit; fall-through; gallery exists |
| `FSN-BRAND-MEND`, `FSN-BRAND-COVER` | hit-consume CD write; miss does not consume; Cover redirect does not brand |
| `FSN-VAULT-ORIGIN`, `FSN-VAULT-FILE` | ally teleport 3–4; dest ticks hazards; needs a second allied body |
| `FSN-ACT-GIFT` | turn-start flag; observe on arm; no Grave Bell |
| `FSN-LINTEL-COUP` | HP% enter predicate; Coup ≤25%; Fang ≥70% **target**; middle 40–60% is safe |
| `FSN-CADENCE-MUTE` | steal highest remaining ≥ 2; never reset to 0; never name-pick Inferno |

---

## Sources (line-accurate, 2026-09-24)

- Kits / inference / decide / summoner skip: `src/frontend/src/engine/enemyAI.ts` 163–185, 194–200, 218–223, 447–452, 1662–1698, 1832–1888
- Kit assignment + summoner roll: `src/frontend/src/components/WorldExploration.tsx` 11920, 11932–11942
- Family lottery + HP overwrite: `spawnPolicy.ts` 35–57, 69–120, 279–296; WX 5864–5866, 11970–11974
- Overworld facing writer (combat still missing): `WorldExploration.tsx` 6924–6938
- Ember / tide melee hooks: `WorldExploration.tsx` 16789–16819
- Void reflect: `src/frontend/src/engine/castHelpers.ts` 335–337
- Push / attract (no caller): `src/frontend/src/engine/occupancy.ts` 482, 537
- Trap = fake wall: `src/frontend/src/engine/spellEngine.ts` 442–445
- Gates, summon cap: `src/frontend/src/data/gameConstants.ts` 200–209, 266–301
- Families: `src/frontend/src/types/gameTypes.ts` 12–20
- Spells: `src/frontend/src/data/spellData.ts` (`starter-heal` 85–101 self-only; Enrage ally 274–291)
- Map archetypes: `src/frontend/src/engine/mapGen.ts` 6–44
- Wave 6 families / packs: `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md` (PR #452) §3–§4
- Wave 5 verbs consumed: `docs/automation/SPELL_PROPOSALS_2026-09-22.md` (PR #411)
- Wave 7 leftover (deferred): `docs/automation/SPELL_PROPOSALS_2026-09-24.md` (PR #525)
- Wave 7 families (deferred to drop 8): `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md` (PR #535)
- Drop 6 (do not reuse ids): `docs/design/ENEMY_FORMATIONS_2026-09-23.md` (PR #459)
- Drop 5: `docs/design/ENEMY_FORMATIONS_2026-09-22.md` (PR #401)
- Drop 4: `docs/design/ENEMY_FORMATIONS_2026-09-21.md` (PR #348)
