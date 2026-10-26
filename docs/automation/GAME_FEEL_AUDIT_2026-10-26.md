# Game Feel & Combat Feedback Audit — 2026-10-26

**Director:** Game Feel & Combat Feedback Director (`078e61d4-a49f-11f1-a7d1-d6b4613131ce`)  
**Run:** `bc-99c67606-c5e8-4d6b-922e-53912da39d40`  
**Schedule:** cron `0 */48 * * *` (eighteenth ledger; 2026-08-31 / #149, 2026-09-01 walk-reject + `level_up` sound, 2026-09-02 attack-mode / off-turn / world-unreachable, 2026-09-21 queued in **#363**, 2026-09-22 queued in **#419**, 2026-09-23 queued in **#478**, 2026-09-24 queued in **#523**, 2026-09-25 queued in **#571**, 2026-09-26 queued in **#610**, 2026-09-27 queued in **#678**, 2026-09-28 queued in **#735**, 2026-09-29 queued in **#772**, 2026-10-21 queued in **#845**, 2026-10-22 queued in **#894**, 2026-10-23 queued in **#954**, 2026-10-24 queued in **#1003**, 2026-10-25 queued in **#1061**)  
**HEAD inspected:** `0f5363f` (`Merge pull request #332`) — same tree as the 09-21 → 10-25 ledgers. No combat-feel code landed on `main` since those runs. This is the next unique-NEW pass, not a rewrite of #1061.  
**Telemetry:** still none in production. DEV-only `recordClickOutcome`. TBC / `AQA-2026-08-30-012` remain `WAITING_FOR_TELEMETRY` (**#1108** is the 2026-10-26 WAITING report). Treat telemetry as **absent**, not a clean bill of health.

This is distinct from general UX. The question is whether important actions communicate **what happened, why, what changed, and whether another action is possible**, through ANTICIPATION → ACTION → IMPACT → RECOVERY → INFORMATION.

Do not implement gameplay to chase engagement metrics. This run **does not auto-implement** canvas wiring: remaining unique holes live in `WorldExploration.tsx` (in-battle lava death Game Over, heal persist-fail toast, victory persist-fail, Death Realm HUD chip). Oldest WX owner is still **#327**; **#363** / **#419** already queue feel floats. Unioning those files across the queue is not an extremely small, low-risk correction. **#363, #419, #478, #523, #571, #610, #678, #735, #772, #845, #894, #954, #1003, and #1061 already own** their surfaces — do not re-implement them here.

Hover-crit omission stays a matrix note (09-28: do not twin). Cooldown-slot pulse stays rejected as spectacle. Challenge HUD ongoing chrome stays a non-hole (`shouldShowChallengeHud`); recap rows stay #845; rising-edge *fail* stays #1003; offer *log* / unaccepted *expire* stay #1061. Rest-*entry* toasts stay a non-hole; rest-*exit* stays #894. Dungeon nearby labels stay a non-hole; white / Boss Rush nearby stay #1003; Death Realm *Escape* nearby stays #1061 — this ledger is the *HUD chip* 10-25 deferred as optional. Do not label rest. Do not steal the `boss` star-burst. Spellbook upgrade toast stays #1003. Shop persist-*fail* stays #1061. Fury/Blood Moon hover stays #894. Heal-body hover stays #894. Summon End Turn leftover title stays #894. Shock *cell* / shrine *tile* / Alabaster *rim* / Dawn *+AP* stay #954. Overworld Doka-heal *success* toast stays a non-hole; this ledger is the *silent rollback after that toast*.

---

## Prior ledger status

| ID | Title | Status this run |
| :--- | :--- | :--- |
| GFCF-2026-08-31-001 | Screen-space juice anchors | **Shipped** (#149) |
| GFCF-2026-08-31-002 | Player-facing reject copy | **Shipped** (#149 / 09-01) |
| GFCF-2026-08-31-003 | `applyDamageToEnemy` IMPACT juice | **Still open.** Highest remaining unique P0. Not auto-implemented (MEDIUM double-spawn vs bounce / `enemyTakesDamage`) |
| GFCF-2026-08-31-004 | Draw armed hit-flash | **Still open.** `getHitFlashAlpha` still has zero render call sites (`effects.ts` 331) |
| GFCF-2026-08-31-005 | Hit-stop `timeScaleRef` | **Still deferred.** RAF freeze |
| GFCF-2026-08-31-006 | Walk reject floats | **Shipped** (09-01) |
| GFCF-2026-08-31-007 | In-battle feats on recap | **Shipped** (#159 / `recapUnlocks.ts`) |
| GFCF-2026-08-31-008 | `level_up` sound + banner | **Partial.** Sound shipped (`rewardFeel.ts`). Recap header still `Level {currentLevel}` (`PostBattleRecap.tsx` 267 / 295). Needs a recap flag, not leftover-XP inference. Spell-*book* upgrade IMPACT is #1003 (not 008) |
| GFCF-2026-08-31-009 | Phase-2 banner | **Still open.** Log-only at `WX` 15790–15799; encounter banner still 1.5s on *entry* |
| GFCF-2026-08-31-010 | Walk-path overlay | **Still open.** Hover MP is still Manhattan (`WX` 8514–8529) while execute uses `findPath` + Frozen 2× |
| GFCF-2026-08-31-011 | Label non-weapon damage | **Still open.** Lava/spikes still write HP inside the movement RAF. Mirror Field / shield absorb stay here. Void Mirror *numbers* stay #735 |
| GFCF-2026-08-31-012 | Status-pill duration digits | **Still open.** Canvas pills emoji-only (`WX` 8240 / 8356). Panel `StatusEffectBadge` already shows `{turns}t` |
| GFCF-2026-08-31-013 | Visible Death Realm wait | **Still open.** 1.5s `armDeathGuards` still invisible. Toast fires *after* the wait (`WX` 13486). #554 owns the walk *block*. Nearby *Escape* is #1061. HUD *chip* is this ledger |
| GFCF-2026-08-31-014 | `triggerVfx` heal no-op | **Still open.** `WX` 9344 `triggerVfx: () => { /* no-op */ }`. Drain heal remains log-only |
| GFCF-2026-08-31-015 | Feel-telemetry | **Still deferred** to AQA-2026-08-30-012 |
| GFCF-2026-09-01-001 | Barrier tokens + leftover invalid-target | **Shipped** (09-01) |
| GFCF-2026-09-01-002 | Attack-mode silent clicks | **Shipped** (09-02) |
| GFCF-2026-09-01-003 | World-mode unreachable float | **Shipped** (09-02) |
| GFCF-2026-09-02-001 | Off-turn canvas after playerCastGate | **Shipped** (09-02) |
| GFCF-2026-09-02-002 … 005 | Summon-control / Windstorm / potions / AN no-AP | **Queued in #363** |
| GFCF-2026-09-21-001 … 004 | AN off-turn / summon kit / Sacrifice | **Queued in #363** |
| GFCF-2026-09-21-005 + 09-22-001 … 009 | AN no-target / melee / boss ability / shrine / … | **Queued in #419** |
| GFCF-2026-09-23-001 … 005 | Enemy heal / hostile spawn / Time's up / ice / portal XP | **Queued in #478** |
| GFCF-2026-09-24-001 … 004 | Void Rift cell / modifier HP / Swap puff / Mark tint | **Queued in #523** |
| GFCF-2026-09-25-001 … 005 | Timestep / Mirror activate / Betrayal / hitsMultiple / Occupied | **Queued in #571** |
| GFCF-2026-09-26-001 … 004 | Sealed portal / ability minions / boss teleport / bounce hover | **Queued in #610** |
| GFCF-2026-09-27-001 … 004 | Mirror consume / enemy walk puff / enemy hazard / betrayal 6× | **Queued in #678** |
| GFCF-2026-09-28-001 … 004 | Void Mirror number / Shell Armor why / Mark consume / erratic | **Queued in #735** |
| GFCF-2026-09-29-001 … 004 | Shield/Fury chips / slot AP digit / Null Field veto / Chaos shuffle | **Queued in #772** |
| GFCF-2026-10-21-001 … 004 | BR Complete / recap challenges / apply float / true expiry | **Queued in #845** |
| GFCF-2026-10-22-001 … 004 | Rest-exit / Fury-Blood Moon hover / heal hover / summon End Turn title | **Queued in #894** |
| GFCF-2026-10-23-001 … 004 | Shock cell / shrine tile / Alabaster rim / Dawn +AP | **Queued in #954** |
| GFCF-2026-10-24-001 … 004 | White nearby / BR nearby / spell-upgrade toast / challenge-fail rising-edge | **Queued in #1003** |
| GFCF-2026-10-25-001 … 004 | Death Realm Escape nearby / challenge offer log / unaccepted expire / shop Buy persist-fail | **Queued in #1061** |

Do not reopen recap XP `level * 100`. Do not wire hit-stop. Do not invent feel-telemetry. Do not clone MIMA-2026-09-21-001/002/004. Do not re-file #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 items as NEW. Do not re-implement those WX call sites on this branch. Hover crit omission stays a matrix note. Do not add a cooldown-slot pulse. Do not add a rest nearby label. Do not tint `boardClaimZone`. Do not reveal Ink Veil glyphs. Do not paint unread illusions / larvae / `void` overlays. Do not steal the `boss` star-burst. Do not pulse Death Realm chrome every frame. Do not toast every shop Buy or overworld-heal *success* (success already speaks). Do not label overworld black/blue/red.

---

## Telemetry

| Signal asked for | Status | Alternative explanation |
| :--- | :--- | :--- |
| Spells selected then cancelled | **No series.** DEV click traces only | Cancel may be the intended “deselect to walk” mode switch (`shouldClearSpellAfterApSpend`). Slot AP digits still show catalog cost (#772). Hover `-dmg` can lie under Fury / Blood Moon (#894) so a “cancel” can be distrust of the preview |
| High flee in particular encounters | **No series** | Flee already has a confirm on dungeon / Boss Rush (`WX` 18918–18935). Overworld flee is intentionally unconfirmed. Death Realm *exits* stay unlabeled until #1061 — a “flee then wander” path can be “I never saw Escape,” not difficulty. After arrival the floor also has no `Dungeon N/M`-style chip (this ledger) |
| Abandonment around boss phases | **No series** | Phase change is still log-only (`WX` 15790–15799). Shock tiles and the Alabaster rim are still invisible (#954). A silent white / Boss Rush portal still looks like a dead swirl next to rest until #1003 |
| Discovered spells rarely used | **No discovery layer** | Spellbook still shows all `allSpells` (SDA owns persist). Spell *upgrade* commits without a toast until #1003 — a “rarely used after buy” signal could be “I am not sure the spend landed” |
| Repeated illegal-action attempts | DEV `recordClickOutcome` only | Attack Nearest AP / mode still silent on `main` (#363 / #419). Rest-exit has a 400ms silent wait (#894). Invisible shrine altar can look like a dead center tile (#954). Challenge *fail* is HUD-only until #1003. Challenge *offer* is a 240px panel that first action silently eats until #1061. Overworld heal *success* toast then silent rollback (this ledger) looks like “the button lied” retries |
| Long turns around certain mechanics | **No series** | 30s timer exists (`WX` 14765–14806) and the footer already pulses at ≤7s. Chaos Initiative reshuffles the strip with no why (#772) |
| Sharp behaviour after a mechanic release | Cannot attribute | Same HEAD as 09-21–10-25; 700+ open sibling PRs; no player population. Cron tick is not a mechanic release. #1108 (today) is TBC WAITING, not feel |

**Rule:** do not change balance or rarity from these gaps. TBC remains `WAITING_FOR_TELEMETRY` (#1108).

---

## What changed since 2026-10-25 (feel-relevant)

`main` is still `0f5363f`. **#363**, **#419**, **#478**, **#523**, **#571**, **#610**, **#678**, **#735**, **#772**, **#845**, **#894**, **#954**, **#1003**, and **#1061** are still open. Sibling TBC PR **#1108** (WAITING_FOR_TELEMETRY, 2026-10-26) landed today and is **not on `main`** — docs, not this ledger.

This run searched for silent ANTICIPATION / IMPACT / INFORMATION paths that those ledgers listed as explicit non-holes (“Game Over 20/40”, “Overworld Doka-heal toast”, “Recap overlay”, “Dungeon N/M / Boss Rush Room N/10 chips”) while a *different* death path, a *different* economy fail, or a *different* floor chrome stayed mute.

Unique holes that are **not** in #363, **not** in #419, **not** in #478, **not** in #523, **not** in #571, **not** in #610, **not** in #678, **not** in #735, **not** in #772, **not** in #845, **not** in #894, **not** in #954, **not** in #1003, **not** in #1061, and **not** in 003–015:

1. **In-battle lava/spike death skips the Game Over 20/40 modal.** `_handlePlayerDeath` (flee / enemy-spell / melee / DoT) sets `showGameOver` (`WX` 13310) so `GameOverModal` shows `−XP (20%)` / `−Doka (40%)` (`GameOverModal.tsx` 56–74) — 10-24 / 10-25 listed that modal as the cited non-hole. Lava/spikes write HP inside the movement RAF (011) and never call `_handlePlayerDeath`. The in-battle HP-watch (`WX` 13386–13440) comments “updates local state + the Game Over recap” then `persistDeathPenalty` + `cleanupMap` + a 1.5s timer — **no** `setShowGameOver`, **no** `onShowBattleSummary`. Out-of-battle lava *does* attach a defeat recap (`WX` 13355–13358). Player death is a listed critical moment; two live paths disagree. Distinct from 013 (the *wait* chrome). Distinct from #1061 Escape *nearby*. Distinct from the arrival toast (non-hole). Distinct from Game Over 20/40 on the modal path (non-hole).
2. **Overworld Doka-heal persist-fail rolls back after a success toast.** `toast.success(\`Healed +${hp} HP (-${doka} Doka)\`)` / jackpot banner fires *before* `persistAbsoluteProgress` (`WX` 18436–18462). `ok === false` restores HP + wallet (`WX` 18463–18484) with no `toast.error`. 10-25 listed the *success* toast as a non-hole (“do not add a canvas number out of battle”). Shop Buy persist-fail is #1061 / 10-25-004 (that path never toasted success). Spell-upgrade fail is #1003 (`console.warn`, never toasted success). Feat claim fail already toasts. This ID is the *silent undo after a lying success*. Distinct from potion *drink* IMPACT (#363). Distinct from recap heal-button pointer-events (same WX button).
3. **Victory `applyRewards` persist-fail is debug-only after the recap already showed the grant.** `onShowBattleSummary(recapWithUnlocks)` runs *before* the persist try (`WX` 12517–12525). Catch is `logDebugInfo("Reward persistence failed (non-blocking)")` (`WX` 12611–12616). `PostBattleRecap.tsx` has no persist/pending/failed field. 09-22-006 is the *portal block while persist is in flight* (`"Rewards settling…"`). This ID is the *failed* write after the overlay already promised XP/Doka. Distinct from shop fail (#1061). Distinct from heal fail (002 this ledger). Distinct from portal +10 XP success float (#478 / 09-23-005). Boss Rush room-clear persist uses the same `logDebugError` pattern (`WX` 12863–12868) — fold into this ID, do not twin.
4. **Death Realm has no persistent HUD chip.** Dungeon chain paints `⚔️ Dungeon N/M` (`WX` 17562–17576). Boss Rush paints `Boss Rush — Room N / 10` (`WX` 17577–17598). `currentMap.isDeathRealm` is never read in that HUD block (zero `isDeathRealm` hits between 17560–17600). Arrival toast lasts 5s (`WX` 13486–13496) then the grey floor is chrome-less. 10-25-001 explicitly deferred “a small Death Realm chip matching `Dungeon N/M` — not required for this ID.” Nearby *Escape* stays #1061. Wait chrome stays 013. Distinct from dungeon / BR chips (the cited non-holes). Distinct from rest (do **not** add a rest chip).

10-25-001…004 stay queued. Primary-hit juice (003) remains the highest unique P0.

---

## Interaction matrix (re-read on `0f5363f`)

| Interaction | Anticipation | Action | Impact | Recovery | Information | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Movement | Hover MP is Manhattan (`WX` 8514) | Click → `findPath` same frame | 600ms path | Camera follows | Gold tile; **no path polyline**. Battle + world rejects float. Summon-control until #363. Enemy walk until #678 | Weak anticipation |
| Tile selection | Hover pulse (walk green / spell blue) | Click gold tint | Immediate | — | Hazard tiles suppress clicked gold. Mark / Void Rift undrawn (#523). Shock / shrine / Alabaster undrawn (#954) | Several live cells still blind |
| Spell selection | Footer highlight; blue range; CD overlay digits | Ref + version bump | Range tiles | Auto-clear on 0 AP | 0 AP slot click silent (#419). Slot AP digit is catalog (#772) | Cost ANTICIPATION lies under Surge |
| Target highlight | Hover `-dmg` omits Fury/Blood Moon (#894). Mark already doubles | Live entity-first gate | Cast or float | — | Hover ignores crit (matrix note). hitsMultiple / bounce rings wait on #571 / #610. Self/ally heal preview waits on #894 | Anticipation incomplete |
| Valid / invalid | Blue/green tiles | Float text | — | — | Spell / walk / attack-mode / off-turn / world-unreachable float. AN AP / mode wait on #363 / #419. Buff suppress waits on #772. Challenge *fail* wait on #1003. Unaccepted offer expire waits on #1061 | Better; queued PRs still needed |
| Damage | Hover `-dmg` can lie under Fury/Blood Moon | Sounds on spell path | Juice only on `enemyTakesDamage` / `playerTakesDamage` | 900ms fade | Primary mute (003). Melee mute (#419). Boss ability mute (#419). Reflect mute (#735). Shock *number* stays #419; shock *cell* is #954 | **Primary IMPACT still broken** |
| Healing | Slot title `Heals: N HP`; body hover waits on #894 | HP bar | Player `heal()` has green numbers; `triggerVfx` no-op (014); potions wait on #363 | — | Spell heal path still 014. Enemy heal mute (#478). Dawn −10 HP “heal” is unread (MIMA). **Overworld Doka-heal success toasts then persist-fail reverts with no error (this ledger)** | Player OK after commit; fail lies |
| AP/MP spend | Hover MP; AP bars 0.3s; **slot AP catalog** | Immediate decrement via live `applyApCost` | Elixir/boots wait on #363. Dawn +AP HUD-only (#954) | Mode switch to walk at 0 AP | No `-N AP` on spell debit. Drain polarity waits on #419. Timestep HUD-only (#571). Summon End Turn leftover untitled (#894) | HUD only; digit can lie |
| Crits | Hover uses non-crit | `critical_hit` sound | Hitstop/shake only if `enemyTakesDamage` | — | Crit `!` unused on main spell path | Sound without punch |
| Enemy death | — | Shatter + log | Leader 36 gold particles + banner | 350ms fragments | Erratic why waits on #735. Bomber detonate uses death pipeline shatter. `leader_boost` SFX exists and is never played — dead hook, not a mute mechanic | Leader overlay yes |
| Player death | HP bar | Recap **or** Game Over **or** 1.5s timer depending on path | Toast after teleport (`WX` 13486); Game Over 20/40 on the *modal* path | Death Realm | Timer invisible (013). Exit swirls unlabeled until #1061. **Lava/spike in-battle skips Game Over 20/40 (this ledger)**. **Floor has no HUD chip (this ledger)** | Split climax |
| Summons | Lifespan `⏳N`; control dock | **Player** puff + SFX + log | Death pipeline; control rejects wait on #363 | Fade log + canvas wait on #419 | Hostile kit spawn mute (#478). Ability minion mute (#610). 0/0 auto-end 500ms is re-entrancy, next-turn log speaks — not filed | Asymmetric spawn |
| Statuses | Inspect chips | Canvas emoji from `activeEffects`; panel `{turns}t` | Apply float waits on #845; expiry log lies every tick (#845) | Pill vanishes | Shield Charm / Fury wait on #772. Duration digits still 012 | Apply/expiry INFORMATION thin |
| Spell observation | Hover dmg + inspect | Swap / Mirror / Shell wait on queued PRs | Windstorm still log-only until #363 | — | Null Field eat waits on #772. Enemy AI already logs `casts {name}` | Log / inspect only |
| Spell discovery | Full spellbook | Upgrade button shows cost / next DMG | Digits + Doka HUD only until #1003. Fail is `console.warn` | — | No unknown-spell fog (SDA). Feat *claim* already toasts | Book upgrade mute until #1003 |
| Level-up | Recap XP bar (curve correct) | — | **`level_up` plays** when recap level > pre-grant | — | Recap still says “Level N”. Spell-book upgrade is #1003 | Sound yes; banner no |
| Achievement | Toast in world | In-battle queued | Recap section wired (#159). Claim toasts Doka | 4s toast | Payload `newlyUnlockedAchievements`. #485 owns “Feat Unlocked” copy. Challenge *fail* wait on #1003. Challenge *offer* / *expire* wait on #1061 | Unlock OK; offer window mute until #1061 |
| Boss phases | Encounter banner on *entry* | Log `PHASE 2!` / Weeping Queen | Stat/HP change | — | Easy to miss in log scroll. Teleport/jump mute (#610). BR complete mute (#845). Shock / rim telegraphs missing (#954) | Weak climax |
| Victory | Recap immediate (persist async) | `battle_end` SFX | Overlay; canvas ignored while open | 1s XP bar | Feats wired; leftover XP correct; persist portal silent (#419). Challenge rows unread (#845). **Persist *fail* is debug-only (this ledger)** | Shell good; fail mute |
| Rewards | Recap Doka/XP | Persist lock | Ground Doka float; shrine *juice* mute (#419); shrine *tile* mute (#954); portal +10 XP silent until #478 | — | Recap heal allowed. Challenge Doka baked into totals on the regular path. Shop persist-fail waits on #1061. **Heal persist-fail is a silent rollback after success toast (this ledger)** | Fail INFORMATION missing |
| Initiative | Strip + timer (footer pulses ≤7s) | Chaos reshuffle at round wrap (`WX` 14717) | Strip jumps | — | Shuffle why waits on #772. Your-turn banner waits on #419 | Strip can surprise |
| Rest / chain / portals | Rest *entry* toast; dungeon nearby (`WX` 7916–7941); white / BR nearby wait on #1003; Death Realm Escape wait on #1061; BR HUD after `bossRushState.active`; dungeon HUD `Dungeon N/M` (`WX` 17575) | Rest-*exit* 400ms timeout (`WX` 6236) | Map swap; no sound/toast until #894 | HUD `Dungeon N/M` if armed | Chain *progress* log exists; rest-exit re-arm does not. **Death Realm floor has no matching chip (this ledger)** | Dungeon/BR labeled; Death Realm unlabeled after toast |

---

## Highest-impact disconnected systems (unchanged + this ledger)

1. **`applyDamageToEnemy` never calls EffectsManager.** Highest unique P0 (003).

2. **`getHitFlashAlpha` has zero render call sites.** Flash is armed and expires unused.

3. **`triggerHitStop` is inert.** Do **not** implement here.

4. **Lava / spikes** still move *player* HP inside the movement RAF. Leave 011. In-battle lethal lava also skips Game Over (this ledger).

5. **Phase 2** still has no reuse of the 1.5s encounter banner.

6. **Enemy melee / boss abilities** (09-22) skip the juice helper that spell hits already have. Shock *numbers* stay in that ID; shock *cells* are #954.

7. **`BattleUIPanel` AP digits do not call `resolveCastApCost`.** Execute already does (#772).

8. **Item-shop combat buffs (Shield / Fury) are refs, not `ActiveEffect`s.** Status chrome never sees them (#772). Hover `-dmg` also ignores Fury’s 1.25× (#894).

9. **Boss Rush final clear has no Complete cue** (#845). Dungeon-chain already has a trophy log.

10. **PostBattleRecap ignores `completedChallenges` / `dokaFromChallenges`** (#845).

11. **`applyActiveEffect` IMPACT is log + emoji only** (#845), except RAF hazard callers which stay frozen.

12. **Non-DoT “expired” log fires on every decrement** (#845). DoT drop is silent.

13. **Rest-exit is a silent 400ms map swap** (#894). Rest-entry and dungeon-enter already speak.

14. **Hover `-dmg` is not the execute formula for Fury / Blood Moon** (#894).

15. **Shock tiles have log coordinates and no floor tint** (#954). Lava/spikes already use `newHazardTiles`.

16. **Shrine rooms have no altar overlay and no room chrome** (#954). Claim *juice* stays #419.

17. **Alabaster crushing rim is computed, damaging, and undrawn** (#954).

18. **Dawn +AP is HUD-only** (#954). Drain polarity stays #419.

19. **White sanctuary portals are an unlabeled pale swirl** (#1003). Dungeon nearby labels already exist.

20. **Boss Rush entry / progression portals skip the dungeon nearby-label pattern** (#1003). Room-advance banner stays #419; Complete stays #845.

21. **Spellbook upgrade is a mute level-up** (#1003). Character recap sound stays 008.

22. **Challenge fail has no rising-edge cue** (#1003). HUD chrome stays a non-hole; recap rows stay #845.

23. **Death Realm exits are unlabeled overworld-colored swirls** (#1061). Arrival toast is not a nearby label. Wait chrome stays 013. HUD *chip* is this ledger.

24. **Challenge offer never writes the battle log** (#1061). HUD after accept stays a non-hole.

25. **First action silently expires an unaccepted offer** (#1061). Fail-after-accept stays #1003.

26. **Shop Buy persist-fail is a silent inventory/wallet rollback** (#1061). Unaffordable stays a disabled button. Spell-upgrade fail stays #1003. Heal persist-fail after a *success* toast is this ledger.

27. **In-battle lava/spike death skips Game Over 20/40** (this ledger). Modal path stays a non-hole.

28. **Victory persist-fail is debug-only after recap already showed the grant** (this ledger). Portal *block* during in-flight persist stays #419 / 09-22-006.

29. **Death Realm floor has no `Dungeon N/M`-style chip** (this ledger). Escape nearby stays #1061.

---

## Implemented this run

None. Presentation wiring for the unique NEW items requires `WorldExploration.tsx` (lava death Game Over / recap attach, heal persist-fail toast, victory persist-fail toast, Death Realm HUD chip). Oldest WX owner is **#327**; **#363** / **#419** already queue feel work on WX. Auto-implementing here would either conflict in the oldest-first queue or force a restack union that is not extremely small / low-risk.

Not touched: RAF loop, map generation, turn logic, damage math, hover MP formula, hit-flash draw, `applyDamageToEnemy` juice, cooldown overlay, #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 surfaces.

---

## Open drafts that already own a feel or WX surface

| PR | Theme | Director action |
| :--- | :--- | :--- |
| #327 | Striker AoE / bounce range | Oldest WX owner. Union, do not overwrite |
| #340 | Attack Nearest execute gates | Union `attackNearestEnemy`; do not overwrite gates |
| #354 | Feats on recap chrome | UX. Union Recap if #845-002 is wired later |
| #363 | 09-21 feel floats | **Owns** 09-02-002…005 and 09-21-001…004. Do not duplicate |
| #376 | Dawn blessing AP/MP log | Mechanic-truth copy for the +1 MP roll. Do not fork. +AP *float* is #954 |
| #379 / #417 | Walk occupancy / hover MP | Own `SummonControlPanel.tsx`. Union leftover-AP title later (#894) |
| #408 | Shop consume after in-flight buy | Persist. Union BuffShop if #1061-004 is wired later |
| #419 | 09-22 AN floats + melee/boss/shrine | **Owns** 09-21-005, 09-22-001…009 including shrine *juice*, ability *numbers*, BR *room-advance*, and victory-persist *portal block* |
| #421 | leftover XP / Game Over 20/40 copy | UX. Game Over 20/40 already on `main` for the *modal* path. Lava skip is this ledger |
| #434 | BuffShop Use on player turn | Combat. Use button already `title=`s `"Wait for your turn"` on `main`. Union BuffShop if #1061-004 is wired later |
| #443 | Map-modifier HP/MP commit | Mechanic-truth. Do not re-file as GFCF |
| #478 | 09-23 silent feel audit | **Owns** 09-23-001…005 |
| #485 | “Feat Unlocked” world toast | UX copy. Do not fork. Spell-upgrade toast is #1003 |
| #523 | 09-24 silent feel audit | **Owns** 09-24-001…004 |
| #554 | Block canvas walks during Death Realm | Combat truth. Wait chrome stays 013. Nearby Escape is #1061. HUD chip is this ledger |
| #571 | 09-25 silent feel audit | **Owns** 09-25-001…005 |
| #592 | 44px summon End Turn | A11y. Union title string later (#894) |
| #610 | 09-26 silent feel audit | **Owns** 09-26-001…004. Sealed *log* stays there; BR *nearby* is #1003 |
| #678 | 09-27 silent feel audit | **Owns** 09-27-001…004 |
| #728 | Summon End Turn double-fire gate | Combat. Leftover-AP *title* is #894 |
| #735 | 09-28 silent feel audit | **Owns** 09-28-001…004 |
| #754 | Tax Swap landings | Mechanic. Swap *puff* stays #523 |
| #772 | 09-29 silent feel audit | **Owns** 09-29-001…004 |
| #799 | Bomber kamikaze / Inferno share | Combat truth. Shatter already runs on `hp<=0` |
| #803 | Boss Rush `complete(9)` persist | Persist order. Banner is #845 |
| #845 | 10-21 silent feel audit | **Owns** 10-21-001…004. Recap *rows* stay there; fail *rising-edge* is #1003 |
| #850–#1108 | Boss/summon kit execute share, remount-wipe, portal snaps, pack-enemy buffs, leftover-XP wipe, TBC WAITING | Combat/persist/map/docs truth, not on `main`. Do not re-file as GFCF |
| #894 | 10-22 silent feel audit | **Owns** 10-22-001…004. Do not duplicate |
| #954 | 10-23 silent feel audit | **Owns** 10-23-001…004. Do not duplicate |
| #1003 | 10-24 silent feel audit | **Owns** 10-24-001…004. White / BR nearby, spell-upgrade toast, challenge-*fail* rising-edge. Do not duplicate |
| #1061 | 10-25 silent feel audit | **Owns** 10-25-001…004. Death Realm *Escape* nearby, challenge offer/expire, shop Buy persist-fail. Do not duplicate |
| #1108 | TBC WAITING_FOR_TELEMETRY (10-26) | Docs. Current WAITING report. Do not invent feel-telemetry |

#108 / #138 leftover-XP HUD: **merged**. #149 juice + reject copy: **merged**. #159 feat recap: **merged**. #326 Attack Nearest origin: **merged**.

---

## ACTION_ID ledger

See `docs/automation/ACTION_IDS_GFCF_2026-10-26.md`. Prior IDs remain in `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_GFCF_2026-09-02.md`, and the dated files on #363 / #419 / #478 / #523 / #571 / #610 / #678 / #735 / #772 / #845 / #894 / #954 / #1003 / #1061 (those fourteen are not on `main`).
