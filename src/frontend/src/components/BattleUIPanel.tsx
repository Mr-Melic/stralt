import { BookOpen, Skull, Swords } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SpellConfig } from "../types/gameTypes";
import DraggablePanel from "./DraggablePanel";
import type { CombatantEntry } from "./InitiativeStrip";
import StatPopup from "./StatPopup";

const PIECE_SYMBOLS: Record<string, string> = {
  king: "♚",
  queen: "♛",
  rook: "♜",
  bishop: "♝",
  knight: "♞",
  pawn: "♟",
};

export interface BattleUIPanelProps {
  // Battle state
  inBattle?: boolean;
  // Spell footer
  activeSpells: SpellConfig[];
  selectedSpellIdRef: React.MutableRefObject<string | null>;
  spellSelectionVersion: number;
  /**
   * Click-precedence gate for the initiative chip inspect popup.
   * When a spell is selected (true), clicking a portrait chip must NOT open
   * inspect — the user intends to cast on the canvas, not inspect. Inspect
   * opens from the chip ONLY when no spell is selected (false).
   * Forced inspect is available via right-click / long-press on the canvas
   * (handled separately), not via the chip.
   */
  hasSelectedSpell?: boolean;
  onSelectSpell: (id: string) => void;
  onOpenSpellbook: () => void;
  onAttackNearest?: () => void;
  canAttackNearest?: boolean;
  isMobile?: boolean;
  // Initiative strip
  turnOrder: CombatantEntry[];
  currentTurnIndex: number;
  battleTurn: number;
  turnTimeLeft: number;
  // Walk/Attack toggle
  battleActionMode: "walk" | "attack";
  onSetWalk: () => void;
  onSetAttack: () => void;
  currentBattleAp: number;
  currentBattleMp: number;
  /** H6 fix: the player’s actual maximum AP this battle (characterStats.ap, grows +1/25 levels). */
  maxBattleAp?: number;
  /** H6 fix: the player’s actual maximum MP this battle (characterStats.mp, grows +1/25 levels). */
  maxBattleMp?: number;
  // End turn
  onEndBattle?: () => void;
  onEndTurn: () => void;
  // Spell cooldowns
  spellCooldowns?: Record<string, number>;
  // Misc
  userId?: string;
  /**
   * Prop-driven inspect trigger. When set to a non-null combatant id,
   * BattleUIPanel opens the inspect card for that combatant — reusing the
   * existing chip-button inspect flow (setSelectedCombatantId) without
   * refactoring it. Used by WorldExploration's sprite-hit inspect branch so a
   * direct body click on a hostile opens inspect, mirroring the chip button.
   */
  inspectCombatantId?: string | null;
  onInspectCombatant?: (id: string | null) => void;
  /**
   * SECTION 2e — when true, a player-controlled summon's turn is active.
   * The player's own spell-slot row and END TURN button are dimmed (not the
   * whole panel) and a "Summon's Turn" label is shown. Initiative strip,
   * enemy inspect, and player HP/stats remain fully visible.
   */
  isSummonControlled?: boolean;
  /**
   * SECTION 2 (RETRY 3) — inline summon control block. When non-null, a
   * carved-stone summon control block is rendered inside the battle bar
   * (right of the player's 8 spell slots) showing the summon's portrait,
   * name, lifespan pips, kit spell slots, AP/MP orbs, HP bar, and a compact
   * SP/SR/RES/INIT stats row. The block renders ONLY while this prop is set
   * (i.e. while activeControlledSummonId is set in WorldExploration). The
   * player's own 8 spell slots are greyed (opacity + desaturate) while the
   * block is visible.
   */
  controlledSummon?: SummonControlData | null;
  /**
   * Kit spells available to the controlled summon, resolved by
   * WorldExploration from the summon's pieceType via explicit metadata
   * (summonUnitDef.summonKit). Each entry carries the spell id, name, and
   * AP cost. Rendered as clickable slots in the inline block.
   */
  summonKitSpells?: SummonKitSpell[];
  /**
   * Called when a kit spell slot in the inline summon block is clicked,
   * with the slot index (0-based). WorldExploration maps this to
   * setSelectedSummonSpellId(spell.id).
   */
  onSummonSpellSelect?: (slotIndex: number) => void;
  /**
   * Called when the inline summon block's END TURN button is pressed.
   * WorldExploration clears activeControlledSummonId and advances the turn.
   */
  onSummonEndTurn?: () => void;
  /**
   * SECTION 1 (RETRY 2) — SINGLE source of truth for whose turn it is.
   * `currentActor` is the ref-derived current turn-order entry
   * (turnOrderRef.current[currentTurnIndexRef.current]) kept in React state
   * by an effect in WorldExploration. The turn label, turn chip, and EndTurn
   * guard all derive from currentActor.type — NOT from the stale battlePhase
   * flag, isPlayerTurn, or isSummonControlled. This eliminates the dual-label
   * bug (battlePhase stays "player" during summon turns) and the skip-lockout
   * (END TURN guard disabled on battlePhase !== "player" even when the
   * ref-derived isPlayerTurn was true).
   */
  currentActor?: CombatantEntry | null;
}

/**
 * SECTION 2 (RETRY 3) — inline summon control block data. Passed from
 * WorldExploration (reusing the activeControlledSummonId lookup) and
 * rendered as a carved-stone block inside the battle bar, right of the
 * player's 8 spell slots. Renders ONLY while controlledSummon is non-null.
 */
export interface SummonControlData {
  /** Display name (typically the summon's pieceType). */
  name: string;
  /** pieceType, used for the portrait placeholder label. */
  pieceType: string;
  /** Remaining lifespan in turns. */
  lifespan: number;
  /** Maximum lifespan (for rendering empty pips). */
  maxLifespan: number;
  /** Current action points. */
  currentAp: number;
  /** Maximum action points. */
  maxAp: number;
  /** Current movement points. */
  currentMp: number;
  /** Maximum movement points. */
  maxMp: number;
  /** Current HP. */
  currentHp: number;
  /** Maximum HP. */
  maxHp: number;
  /** Spell power stat (works in resolvers via summonSpawn merge). */
  sp: number;
  /** Spell resistance stat. */
  sr: number;
  /** Physical resistance stat. */
  res: number;
  /** Initiative stat. */
  init: number;
}

/**
 * SECTION 2 (RETRY 3) — a kit spell rendered in the inline summon block.
 * Resolved by WorldExploration from the summon's pieceType via explicit
 * metadata (summonUnitDef.summonKit).
 */
export interface SummonKitSpell {
  id: string;
  name: string;
  apCost: number;
  /** Optional accent color for the spell icon placeholder. */
  iconColor?: string;
  /** Emoji rendered in the kit slot icon, mirroring the player spell bar. */
  iconEmoji?: string;
}

const BattleUIPanel: React.FC<BattleUIPanelProps> = ({
  inBattle = false,
  activeSpells,
  selectedSpellIdRef,
  spellSelectionVersion,
  hasSelectedSpell = false,
  onSelectSpell,
  onOpenSpellbook,
  onAttackNearest,
  canAttackNearest = false,
  isMobile = false,
  turnOrder,
  currentTurnIndex,
  battleTurn,
  turnTimeLeft,
  battleActionMode,
  onSetWalk,
  onSetAttack,
  currentBattleAp,
  currentBattleMp,
  maxBattleAp,
  maxBattleMp,
  onEndTurn,
  onEndBattle,
  spellCooldowns = {},
  userId,
  inspectCombatantId,
  onInspectCombatant,
  isSummonControlled = false,
  currentActor = null,
  controlledSummon = null,
  summonKitSpells = [],
  onSummonSpellSelect,
  onSummonEndTurn,
}) => {
  const forceUpdate = spellSelectionVersion; // keeps spellSelectionVersion used
  const [selectedCombatantId, setSelectedCombatantId] = useState<string | null>(
    null,
  );
  const [popupAnchor, setPopupAnchor] = useState<DOMRect | null>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const selectedCombatant = selectedCombatantId
    ? turnOrder.find((c) => c.id === selectedCombatantId)
    : null;

  // Build unitStats and unitEffects from turnOrder entries
  const unitStats: Record<string, any> = {};
  const unitEffects: Record<string, any[]> = {};
  for (const c of turnOrder) {
    const extra = c as any;
    unitStats[c.id] = {
      hp: c.hp,
      maxHp: c.maxHp,
      sp: extra.sp ?? 0,
      sr: extra.sr ?? 0,
      res: extra.res ?? 0,
      init: c.initiative,
      chc: extra.chc ?? 0,
      fail: extra.fail ?? 0,
    };
    unitEffects[c.id] = Array.isArray(extra.activeEffects)
      ? extra.activeEffects
      : [];
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCombatantId(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Prop-driven inspect trigger: when WorldExploration's sprite-hit inspect
  // branch sets inspectCombatantId to a non-null combatant id, open the inspect
  // card by reusing the existing setSelectedCombatantId flow. Toggling back to
  // null closes the card. This does NOT touch the chip-button inspect path —
  // it is purely an additional trigger.
  useEffect(() => {
    if (inspectCombatantId != null) {
      setSelectedCombatantId(inspectCombatantId);
      // Anchor the popup near the active chip if available; fall back to null
      // (StatPopup handles a null anchor by centering).
      const rect = chipRefs.current
        .get(inspectCombatantId)
        ?.getBoundingClientRect();
      setPopupAnchor(rect || null);
    }
  }, [inspectCombatantId]);

  // Notify parent when the user closes inspect via Escape (selectedCombatantId
  // becomes null) so the prop and internal state stay in sync.
  useEffect(() => {
    if (
      selectedCombatantId == null &&
      inspectCombatantId != null &&
      onInspectCombatant
    ) {
      onInspectCombatant(null);
    }
  }, [selectedCombatantId, inspectCombatantId, onInspectCombatant]);

  return (
    <>
      <DraggablePanel
        data-version={forceUpdate}
        panelId="battle-ui-panel"
        title="Battle"
        userId={userId}
        defaultPosition={{
          x: Math.max(0, window.innerWidth / 2 - 350),
          y: Math.max(0, window.innerHeight - 220),
        }}
        defaultFolded={false}
        zIndex={200}
      >
        <div
          data-ocid="battle_ui.panel"
          className="stone-frame"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            minWidth: isMobile ? 320 : 620,
            maxWidth: isMobile ? 360 : 1180,
            margin: "0 auto",
          }}
        >
          {/* ── Header row: turn order mini-strip + timer + mode toggle + AP/MP — battle only ── */}
          {inBattle && (
            <div
              className="stone-header"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px 4px",
                flexWrap: "wrap",
              }}
            >
              {/* Initiative timeline */}
              <div
                data-ocid="battle_ui.initiative_strip"
                className="flex flex-col flex-1 min-w-0"
              >
                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[rgba(200,80,80,0.6)] mb-1 pl-0.5">
                  Initiative
                </div>
                <div className="flex gap-[7px] items-center">
                  {turnOrder.map((c, idx) => {
                    const isActive = idx === currentTurnIndex;
                    const isPlayer = c.type === "player";
                    const symbol = isPlayer
                      ? c.pieceIcon
                      : (PIECE_SYMBOLS[c.pieceType ?? ""] ?? "☠");
                    const extraStats = c as CombatantEntry & {
                      ap?: number;
                      mp?: number;
                      atk?: number;
                      res?: number;
                      sp?: number;
                      chc?: number;
                      spells?: unknown[];
                      enraged?: boolean;
                    };
                    const isLeader = !isPlayer && c.isLeader === true;
                    const hpPct = Math.max(
                      0,
                      Math.min(100, (c.hp / c.maxHp) * 100),
                    );
                    return (
                      <div
                        key={c.id}
                        data-ocid={`battle_ui.initiative.item.${idx + 1}`}
                        className="stone-battle-chip"
                      >
                        {/* Bouncing crimson caret above active combatant */}
                        {isActive && <div className="stone-battle-caret" />}
                        <button
                          type="button"
                          title={`${c.name} Lv.${c.level} — INIT ${c.initiative}`}
                          ref={(el) => {
                            if (el) chipRefs.current.set(c.id, el);
                          }}
                          onClick={() => {
                            // Click-precedence: if a spell is selected, the
                            // user intends to cast on the canvas, not inspect.
                            // Chip click is a no-op so inspect does NOT open
                            // and steal the cast intent. Inspect opens from the
                            // chip ONLY when no spell is selected. Forced
                            // inspect is via right-click / long-press on the
                            // canvas (handled in WorldExploration), not here.
                            if (hasSelectedSpell) return;
                            const rect = chipRefs.current
                              .get(c.id)
                              ?.getBoundingClientRect();
                            setPopupAnchor(rect || null);
                            setSelectedCombatantId(
                              c.id === selectedCombatantId ? null : c.id,
                            );
                          }}
                          className={`
                            stone-battle-portrait
                            ${isPlayer ? "stone-battle-portrait-self" : "stone-battle-portrait-enemy"}
                            ${isActive ? "scale-105" : "opacity-70 scale-95"}
                            transition-all duration-200
                            cursor-pointer
                          `}
                          style={{
                            background: isPlayer
                              ? "radial-gradient(circle at 40% 35%, rgba(216,70,63,0.25), rgba(40,20,20,0.8))"
                              : "radial-gradient(circle at 40% 35%, rgba(80,80,90,0.2), rgba(20,20,25,0.8))",
                          }}
                        >
                          {/* Level badge — top-right corner */}
                          <span
                            className={`
                              absolute -top-1.5 -right-1.5 z-10
                              min-w-[16px] h-[16px] px-0.5
                              rounded-full
                              text-[8px] font-black leading-none
                              flex items-center justify-center
                              ${isPlayer ? "stone-pill-crimson" : "stone-pill-gold"}
                              shadow-lg
                            `}
                          >
                            {c.level}
                          </span>
                          {/* Enraged indicator */}
                          {extraStats.enraged && (
                            <span className="absolute top-0.5 left-0.5 text-[8px] leading-none z-10">
                              🔥
                            </span>
                          )}
                          {/* Leader crown */}
                          {isLeader && (
                            <span
                              className="absolute top-0.5 right-4 text-[9px] leading-none z-10 drop-shadow-[0_0_2px_rgba(255,210,0,0.9)]"
                              title="Leader"
                            >
                              👑
                            </span>
                          )}
                          {/* Chess piece glyph centered */}
                          <span
                            className={`
                              text-[20px] leading-none select-none
                              ${isActive ? (isPlayer ? "text-[#ffcccc] drop-shadow-[0_0_4px_rgba(255,80,80,0.7)]" : "text-[#ff8888] drop-shadow-[0_0_4px_rgba(255,80,80,0.7)]") : "text-[rgba(200,120,120,0.65)]"}
                            `}
                          >
                            {symbol}
                          </span>
                        </button>
                        {/* HP bar under tile — ALL combatants */}
                        <div className="stone-battle-hp-bar">
                          <div
                            className="stone-battle-hp-fill"
                            style={{ width: `${hpPct}%` }}
                          />
                        </div>
                        {/* AP/MP readout — player-side summons only */}
                        {c.isSummon && c.side === "player" && (
                          <div
                            className="text-[7px] leading-none font-bold text-center mt-[1px] text-[rgba(180,220,255,0.85)] select-none"
                            data-ocid={`battle_ui.initiative.ap_mp.${idx + 1}`}
                            title={`AP ${extraStats.ap ?? 0} / MP ${extraStats.mp ?? 0}`}
                          >
                            {extraStats.ap ?? 0}AP {extraStats.mp ?? 0}MP
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px self-stretch bg-[rgba(139,0,0,0.4)] flex-shrink-0" />

              {/* Phase indicator + timer */}
              <div
                data-ocid="battle_ui.phase_indicator"
                className="flex flex-col items-center gap-px flex-shrink-0 min-w-[48px]"
              >
                <div
                  className={`text-sm ${currentActor?.type === "player" ? "drop-shadow-[0_0_4px_rgba(255,80,80,0.8)]" : ""}`}
                >
                  {currentActor?.type === "player"
                    ? "⚔️"
                    : currentActor?.type === "summon"
                      ? "🐾"
                      : "💀"}
                </div>
                <div
                  className={`text-[7px] font-black uppercase tracking-widest ${
                    currentActor?.type === "player"
                      ? "text-[rgba(255,140,140,0.95)]"
                      : currentActor?.type === "summon"
                        ? "text-amber-400"
                        : "text-[rgba(200,80,80,0.8)]"
                  }`}
                >
                  {currentActor?.type === "player"
                    ? "YOUR"
                    : currentActor?.type === "summon"
                      ? "SUMMON"
                      : "ENEMY"}
                </div>
                {/* Timer */}
                <div
                  data-ocid="battle_ui.timer"
                  className={`px-[5px] py-px rounded text-xs font-black tabular-nums ${
                    turnTimeLeft <= 7
                      ? "stone-pill-crimson animate-pulse"
                      : turnTimeLeft <= 15
                        ? "stone-pill-gold"
                        : "stone-pill-green"
                  }`}
                >
                  {turnTimeLeft}s
                </div>
                <div className="text-[7px] font-bold text-[rgba(200,80,80,0.5)]">
                  T{battleTurn}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px self-stretch bg-[rgba(139,0,0,0.4)] flex-shrink-0" />

              {/* AP/MP counters */}
              <div
                data-ocid="battle_ui.resources"
                className="flex flex-col gap-[3px] flex-shrink-0"
              >
                <div className="stone-orb flex items-center gap-1 rounded px-2 py-0.5">
                  <span className="text-[10px]">⚡</span>
                  <span className="text-[11px] font-extrabold text-[#74b9ff] tabular-nums">
                    {currentBattleAp} AP
                  </span>
                  {/* H6: mini bar using actual maxBattleAp */}
                  {maxBattleAp != null && maxBattleAp > 0 && (
                    <div
                      style={{
                        width: 30,
                        height: 3,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, (currentBattleAp / maxBattleAp) * 100)}%`,
                          background: "#74b9ff",
                          borderRadius: 2,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div
                  className="stone-orb flex items-center gap-1 rounded px-2 py-0.5"
                  style={{
                    background: "rgba(20,80,40,0.5)",
                    borderColor: "rgba(46,204,113,0.4)",
                  }}
                >
                  <span className="text-[10px]">👣</span>
                  <span className="text-[11px] font-extrabold text-[#2ecc71] tabular-nums">
                    {currentBattleMp} MP
                  </span>
                  {/* H6: mini bar using actual maxBattleMp */}
                  {maxBattleMp != null && maxBattleMp > 0 && (
                    <div
                      style={{
                        width: 30,
                        height: 3,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, (currentBattleMp / maxBattleMp) * 100)}%`,
                          background: "#2ecc71",
                          borderRadius: 2,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="w-px self-stretch bg-[rgba(139,0,0,0.4)] flex-shrink-0" />

              {/* Walk / Attack toggle + End Turn */}
              <div className="flex gap-1 items-center flex-shrink-0">
                <button
                  type="button"
                  data-ocid="battle_ui.walk_button"
                  onClick={onSetWalk}
                  disabled={isSummonControlled || currentBattleMp <= 0}
                  className={`
                    px-2 py-1 rounded-[5px] text-[10px] font-extrabold tracking-wide transition-all duration-150
                    ${battleActionMode === "walk" ? "stone-btn-emerald" : "stone-btn-slate opacity-55"}
                    ${isSummonControlled || currentBattleMp <= 0 ? "opacity-45 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  🚶 WALK
                </button>
                <button
                  type="button"
                  data-ocid="battle_ui.attack_button"
                  onClick={onSetAttack}
                  disabled={isSummonControlled || currentBattleAp <= 0}
                  className={`
                    px-2 py-1 rounded-[5px] text-[10px] font-extrabold tracking-wide transition-all duration-150
                    ${battleActionMode === "attack" ? "stone-btn-blue" : "stone-btn-slate opacity-55"}
                    ${isSummonControlled || currentBattleAp <= 0 ? "opacity-45 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  ⚔️ ATTACK
                </button>
                <button
                  type="button"
                  data-ocid="battle_ui.end_battle_button"
                  onClick={() => {
                    if (window.confirm("Leave battle? You will die.")) {
                      onEndBattle?.();
                    }
                  }}
                  className="
                    px-2 py-1 rounded-[5px] text-[10px] font-extrabold tracking-wide transition-all duration-150
                    stone-btn-slate
                    cursor-pointer
                  "
                >
                  <Skull size={12} />
                  FLEE
                </button>
                <button
                  type="button"
                  data-ocid="battle_ui.end_turn_button"
                  onClick={onEndTurn}
                  disabled={currentActor?.type !== "player"}
                  className={`
                    px-2 py-1 rounded-[5px] text-[10px] font-extrabold tracking-wide transition-all duration-150
                    ${
                      currentActor?.type === "player"
                        ? "stone-btn-crimson"
                        : "stone-btn-slate opacity-40 cursor-not-allowed"
                    }
                  `}
                >
                  END TURN
                </button>
              </div>

              {/* Current combatant name — single source of truth via currentActor.type */}
              {currentActor && (
                <div
                  className={`
                    ml-auto text-[9px] font-bold tracking-wider uppercase flex-shrink-0
                    ${
                      currentActor.type === "player"
                        ? "text-[#ff9999]"
                        : currentActor.type === "summon"
                          ? "text-amber-400"
                          : "text-[rgba(200,80,80,0.7)]"
                    }
                  `}
                >
                  {currentActor.type === "player"
                    ? "YOUR TURN"
                    : currentActor.type === "summon"
                      ? "SUMMON'S TURN"
                      : `${currentActor.name?.slice(0, 6) ?? "ENEMY"}'S TURN`}
                </div>
              )}
            </div>
          )}

          {/* ── Spell row ── */}
          {/* SECTION 3 (R12) FIX (a) — the dimming wrapper now encloses ONLY
              the player's own spellbook button + 8 spell slots. The inline
              summon control block (below) and the Attack-Nearest / status
              pill sit OUTSIDE this wrapper so they stay full-color during
              control mode. Interactivity of the kit slots + END button is
              bound STRICTLY to controlledSummon (i.e. activeControlledSummonId)
              being set — not battlePhase, not isPlayerTurn. */}
          <div className="flex items-center gap-2 px-2.5 pt-1.5 pb-2 flex-nowrap overflow-x-auto">
            {/* Player spell cluster — dimmed as a whole during summon control */}
            <div
              className="flex items-center gap-2 flex-nowrap"
              style={
                isSummonControlled
                  ? {
                      opacity: 0.45,
                      filter: "grayscale(0.85) saturate(0.4)",
                    }
                  : undefined
              }
            >
              {/* Spellbook button */}
              <button
                type="button"
                data-ocid="battle_ui.spellbook_button"
                onClick={onOpenSpellbook}
                title="Open Spellbook"
                className="stone-btn-slate w-11 h-[52px] rounded-md flex flex-col items-center justify-center gap-0.5 flex-shrink-0 transition-all duration-150"
              >
                <BookOpen size={16} />
                <span className="text-[8px] leading-none opacity-80">Book</span>
              </button>

              {/* Separator */}
              <div className="w-px h-11 bg-[rgba(180,20,20,0.3)] flex-shrink-0" />

              {/* 8 spell slots */}
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
                  const spell = activeSpells[slotIndex] ?? null;
                  const isSelected = spell?.id === selectedSpellIdRef.current;
                  const isEmpty = !spell;
                  const isPhysical = spell?.isPhysical ?? false;
                  const isHeal =
                    spell?.spellType === "heal" || spell?.spellType === "drain";
                  const cdTurns = spell ? (spellCooldowns[spell.id] ?? 0) : 0;
                  const isOnCooldown = cdTurns > 0;

                  const spellTitle = spell
                    ? `${spell.name} \u2014 ${spell.description} | ${
                        isHeal
                          ? `Heals: ${spell.healAmount ?? 0} HP`
                          : `Damage: ${Number(spell.damage)}`
                      } | ${Number(spell.apCost)} AP | Range: ${Number(
                        spell.range,
                      )}${isOnCooldown ? ` | CD: ${cdTurns}t` : ""}`
                    : `Empty slot ${slotIndex + 1}`;

                  return (
                    <button
                      key={slotIndex}
                      type="button"
                      data-ocid={`battle_ui.spell.${slotIndex + 1}`}
                      onClick={() => {
                        if (spell && !isOnCooldown) onSelectSpell(spell.id);
                      }}
                      disabled={isEmpty || isOnCooldown}
                      title={spellTitle}
                      style={{
                        width: 44,
                        height: 52,
                        borderRadius: 6,
                        background: isEmpty
                          ? "rgba(255,255,255,0.03)"
                          : isSelected
                            ? isPhysical
                              ? "rgba(139,90,30,0.4)"
                              : isHeal
                                ? "rgba(30,140,80,0.4)"
                                : "rgba(220,30,30,0.35)"
                            : isPhysical
                              ? "rgba(100,60,10,0.45)"
                              : isHeal
                                ? "rgba(20,100,50,0.35)"
                                : "rgba(80,15,15,0.45)",
                        border: isEmpty
                          ? "2px dashed rgba(180,20,20,0.25)"
                          : isSelected
                            ? isPhysical
                              ? "2px solid rgba(200,140,40,0.9)"
                              : isHeal
                                ? "2px solid rgba(50,200,100,0.9)"
                                : "2px solid rgba(255,80,80,0.9)"
                            : isPhysical
                              ? "2px solid rgba(180,120,30,0.6)"
                              : isHeal
                                ? "2px solid rgba(40,160,80,0.6)"
                                : "2px solid rgba(180,20,20,0.55)",
                        cursor: isEmpty || isOnCooldown ? "default" : "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        position: "relative",
                        transition: "all 0.12s",
                        boxShadow: isSelected
                          ? isPhysical
                            ? "0 0 14px rgba(200,140,40,0.5)"
                            : isHeal
                              ? "0 0 14px rgba(50,200,100,0.5)"
                              : "0 0 14px rgba(255,60,60,0.5)"
                          : "0 2px 5px rgba(0,0,0,0.35)",
                        flexShrink: 0,
                        opacity: isOnCooldown ? 0.5 : 1,
                      }}
                    >
                      {/* Cooldown number overlay */}
                      {isOnCooldown && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0,0,0,0.4)",
                            borderRadius: 5,
                            zIndex: 10,
                            pointerEvents: "none",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 900,
                              color: "#ff3333",
                              textShadow: "0 0 6px rgba(255,0,0,0.8)",
                              fontVariantNumeric: "tabular-nums",
                              lineHeight: 1,
                            }}
                          >
                            {cdTurns}
                          </span>
                        </div>
                      )}
                      <span
                        style={{
                          position: "absolute",
                          top: 1,
                          left: 2,
                          fontSize: 7,
                          color: "rgba(255,255,255,0.35)",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {slotIndex + 1}
                      </span>
                      {isPhysical && !isEmpty && (
                        <span
                          style={{
                            position: "absolute",
                            top: 1,
                            right: 2,
                            fontSize: 6,
                            color: "rgba(200,140,40,0.8)",
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          PHY
                        </span>
                      )}
                      {isEmpty ? (
                        <span style={{ fontSize: 14, opacity: 0.2 }}>✦</span>
                      ) : (
                        <>
                          <span
                            style={{
                              fontSize: 17,
                              lineHeight: 1,
                              filter: isPhysical
                                ? "drop-shadow(0 1px 3px rgba(200,140,40,0.5))"
                                : isHeal
                                  ? "drop-shadow(0 1px 3px rgba(50,200,100,0.4))"
                                  : "drop-shadow(0 1px 3px rgba(255,60,60,0.4))",
                            }}
                          >
                            {spell.iconEmoji || "🔮"}
                          </span>
                          <span
                            style={{
                              fontSize: 6,
                              color: isSelected
                                ? isHeal
                                  ? "#90ffcc"
                                  : "#ff9999"
                                : "rgba(255,220,220,0.7)",
                              fontWeight: 700,
                              textAlign: "center",
                              maxWidth: 42,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              lineHeight: 1,
                            }}
                          >
                            {spell.name}
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              bottom: 1,
                              right: 2,
                              fontSize: 6,
                              fontWeight: 800,
                              color: "#74b9ff",
                              background: "rgba(20,40,100,0.7)",
                              padding: "0 2px",
                              borderRadius: 2,
                              lineHeight: "10px",
                            }}
                          >
                            {Number(spell.apCost)}AP
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* End player spell cluster — dimming wrapper closes here. The
                summon block below is OUTSIDE the wrapper so it stays
                full-color and interactive during control mode. */}
            </div>

            {/* ── SECTION 2 (RETRY 3): Inline summon control block ──
                Renders ONLY while controlledSummon is non-null (i.e. while
                activeControlledSummonId is set in WorldExploration). Carved-
                stone dark slate with crimson accents, mirroring the Ankama/
                Dofus aesthetic. Sits right of the player's 8 spell slots
                (which are greyed above when isSummonControlled). */}
            {controlledSummon && (
              <div
                data-ocid="battle_ui.summon_block"
                aria-label={`${controlledSummon.name} summon control`}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: 6,
                  padding: "4px 6px",
                  borderRadius: 8,
                  flexShrink: 0,
                  background:
                    "linear-gradient(180deg, rgba(30,12,12,0.85) 0%, rgba(18,8,8,0.92) 100%)",
                  border: "2px solid rgba(220,38,38,0.55)",
                  boxShadow:
                    "inset 0 0 10px rgba(0,0,0,0.7), 0 0 10px rgba(220,38,38,0.35)",
                }}
              >
                {/* Carved-stone left edge accent */}
                <div
                  style={{
                    width: 3,
                    alignSelf: "stretch",
                    flexShrink: 0,
                    borderRadius: 3,
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(220,38,38,0.85) 50%, transparent 100%)",
                  }}
                />

                {/* Portrait + name + lifespan pips */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingRight: 6,
                    borderRight: "1px solid rgba(180,20,20,0.3)",
                  }}
                >
                  <div
                    data-ocid="battle_ui.summon_portrait"
                    aria-hidden="true"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid rgba(220,38,38,0.7)",
                      background:
                        "linear-gradient(135deg, rgba(51,65,85,0.9) 0%, rgba(15,23,42,0.95) 100%)",
                      boxShadow:
                        "inset 0 0 6px rgba(0,0,0,0.7), 0 0 6px rgba(220,38,38,0.3)",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "rgba(220,38,38,0.9)",
                        lineHeight: 1,
                      }}
                    >
                      {controlledSummon.pieceType.slice(0, 3)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                      gap: 3,
                    }}
                  >
                    <span
                      data-ocid="battle_ui.summon_name"
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "#e6dcdc",
                        maxWidth: 84,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.1,
                      }}
                    >
                      {controlledSummon.name}
                    </span>
                    {/* Lifespan pips */}
                    <div
                      data-ocid="battle_ui.summon_lifespan_pips"
                      aria-label={`Lifespan ${controlledSummon.lifespan} of ${controlledSummon.maxLifespan}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          color: "rgba(220,38,38,0.8)",
                          lineHeight: 1,
                        }}
                        aria-hidden="true"
                      >
                        ⧗
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {Array.from(
                          {
                            length: Math.max(
                              controlledSummon.maxLifespan,
                              controlledSummon.lifespan,
                              0,
                            ),
                          },
                          (_, i) => i < Math.max(controlledSummon.lifespan, 0),
                        ).map((isFilled, i) => (
                          <span
                            key={isFilled ? `pip-f-${i}` : `pip-e-${i}`}
                            data-ocid={`battle_ui.summon_lifespan_pip.${i + 1}`}
                            aria-hidden="true"
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              border: "1px solid rgba(180,20,20,0.5)",
                              background: isFilled
                                ? "rgba(220,38,38,0.95)"
                                : "rgba(120,40,40,0.25)",
                              boxShadow: isFilled
                                ? "inset 0 0 1px rgba(0,0,0,0.6)"
                                : "none",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kit spell slots */}
                <div
                  data-ocid="battle_ui.summon_spell_slots"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    paddingRight: 6,
                    borderRight: "1px solid rgba(180,20,20,0.3)",
                  }}
                >
                  {summonKitSpells.length === 0 ? (
                    <span
                      style={{
                        fontSize: 9,
                        fontStyle: "italic",
                        color: "rgba(200,160,160,0.5)",
                      }}
                    >
                      No kit
                    </span>
                  ) : (
                    summonKitSpells.map((spell, i) => {
                      const disabled =
                        controlledSummon.currentAp < spell.apCost;
                      const iconBg = spell.iconColor ?? "#7c2d12";
                      return (
                        <button
                          key={spell.id}
                          type="button"
                          data-ocid={`battle_ui.summon_spell_slot.${i + 1}`}
                          disabled={disabled}
                          onClick={() => onSummonSpellSelect?.(i)}
                          aria-label={`${spell.name}, AP cost ${spell.apCost}${
                            disabled ? ", insufficient AP" : ""
                          }`}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            width: 44,
                            padding: "3px 2px",
                            borderRadius: 5,
                            cursor: disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.4 : 1,
                            border: disabled
                              ? "1px solid rgba(180,20,20,0.3)"
                              : "1px solid rgba(220,38,38,0.5)",
                            background: disabled
                              ? "rgba(40,20,20,0.3)"
                              : "rgba(60,20,20,0.5)",
                            transition: "all 0.12s",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 3,
                              border: "1px solid rgba(180,20,20,0.5)",
                              background: iconBg,
                              boxShadow: "inset 0 0 3px rgba(0,0,0,0.6)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              lineHeight: 1,
                              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
                            }}
                          >
                            {spell.iconEmoji || "🔮"}
                          </span>
                          <span
                            style={{
                              fontSize: 7,
                              fontWeight: 600,
                              color: "#e6dcdc",
                              maxWidth: 40,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              lineHeight: 1,
                            }}
                          >
                            {spell.name}
                          </span>
                          <span
                            style={{
                              fontSize: 7,
                              fontWeight: 800,
                              color: "#74b9ff",
                              background: "rgba(20,40,100,0.7)",
                              padding: "0 2px",
                              borderRadius: 2,
                              lineHeight: "10px",
                            }}
                          >
                            {spell.apCost}AP
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* AP / MP orbs (small) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    paddingRight: 6,
                    borderRight: "1px solid rgba(180,20,20,0.3)",
                  }}
                >
                  {/* AP orb */}
                  <div
                    data-ocid="battle_ui.summon_ap_orb"
                    aria-label={`AP ${controlledSummon.currentAp} of ${controlledSummon.maxAp}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid rgba(59,130,246,0.6)",
                        background:
                          "linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(30,58,138,0.4) 100%)",
                        boxShadow: "0 0 6px rgba(59,130,246,0.45)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: "#bfdbfe",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1,
                        }}
                      >
                        {controlledSummon.currentAp}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 7,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "rgba(200,160,160,0.6)",
                        lineHeight: 1,
                      }}
                    >
                      AP
                    </span>
                  </div>
                  {/* MP orb */}
                  <div
                    data-ocid="battle_ui.summon_mp_orb"
                    aria-label={`MP ${controlledSummon.currentMp} of ${controlledSummon.maxMp}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid rgba(34,197,94,0.6)",
                        background:
                          "linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(20,83,45,0.4) 100%)",
                        boxShadow: "0 0 6px rgba(34,197,94,0.45)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: "#bbf7d0",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: 1,
                        }}
                      >
                        {controlledSummon.currentMp}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 7,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "rgba(200,160,160,0.6)",
                        lineHeight: 1,
                      }}
                    >
                      MP
                    </span>
                  </div>
                </div>

                {/* HP bar */}
                <div
                  data-ocid="battle_ui.summon_hp_bar"
                  aria-label={`HP ${controlledSummon.currentHp} of ${controlledSummon.maxHp}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                    paddingRight: 6,
                    borderRight: "1px solid rgba(180,20,20,0.3)",
                  }}
                >
                  {(() => {
                    const safeMax = Math.max(controlledSummon.maxHp, 1);
                    const pct = Math.max(
                      0,
                      Math.min(
                        100,
                        (controlledSummon.currentHp / safeMax) * 100,
                      ),
                    );
                    const low = pct <= 25;
                    return (
                      <>
                        <div
                          style={{
                            position: "relative",
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: low
                              ? "2px solid rgba(239,68,68,0.7)"
                              : "2px solid rgba(220,38,38,0.6)",
                            background:
                              "linear-gradient(135deg, rgba(239,68,68,0.25) 0%, rgba(127,29,29,0.4) 100%)",
                            boxShadow: low
                              ? "0 0 6px rgba(239,68,68,0.5)"
                              : "0 0 6px rgba(220,38,38,0.4)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 8,
                              fontWeight: 800,
                              color: "#fecaca",
                              fontVariantNumeric: "tabular-nums",
                              lineHeight: 1,
                            }}
                          >
                            {controlledSummon.currentHp}
                          </span>
                        </div>
                        <div
                          aria-hidden="true"
                          style={{
                            width: 26,
                            height: 3,
                            borderRadius: 3,
                            overflow: "hidden",
                            border: "1px solid rgba(180,20,20,0.5)",
                            background: "rgba(40,20,20,0.4)",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: low
                                ? "rgba(239,68,68,0.95)"
                                : "rgba(220,38,38,0.95)",
                              boxShadow: low
                                ? "0 0 3px rgba(239,68,68,0.7)"
                                : "0 0 3px rgba(220,38,38,0.6)",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 7,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "rgba(200,160,160,0.6)",
                            lineHeight: 1,
                          }}
                        >
                          HP
                        </span>
                      </>
                    );
                  })()}
                </div>

                {/* Compact SP/SR/RES/INIT stats row */}
                <div
                  data-ocid="battle_ui.summon_stats"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    paddingRight: 6,
                  }}
                >
                  {[
                    { label: "SP", value: controlledSummon.sp },
                    { label: "SR", value: controlledSummon.sr },
                    { label: "RES", value: controlledSummon.res },
                    { label: "INIT", value: controlledSummon.init },
                  ].map((s) => (
                    <div
                      key={s.label}
                      data-ocid={`battle_ui.summon_stat.${s.label.toLowerCase()}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        lineHeight: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 7,
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                          color: "rgba(220,38,38,0.85)",
                          minWidth: 22,
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        style={{
                          fontSize: 8,
                          fontWeight: 700,
                          color: "#e6dcdc",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* End turn */}
                <button
                  type="button"
                  data-ocid="battle_ui.summon_end_turn_button"
                  onClick={onSummonEndTurn}
                  aria-label="End the summon's turn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    borderRadius: 6,
                    border: "2px solid rgba(220,38,38,0.9)",
                    padding: "4px 8px",
                    background:
                      "linear-gradient(180deg, rgba(220,38,38,0.85) 0%, rgba(127,29,29,0.95) 100%)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "0 0 8px rgba(220,38,38,0.5)",
                    transition: "all 0.12s",
                    flexShrink: 0,
                  }}
                >
                  End
                </button>
              </div>
            )}

            {/* Separator + Attack Nearest */}
            <div
              style={{
                width: 1,
                height: 44,
                background: "rgba(180,20,20,0.3)",
                flexShrink: 0,
              }}
            />
            <button
              type="button"
              data-ocid="battle_ui.attack_nearest_button"
              onClick={onAttackNearest}
              disabled={!canAttackNearest}
              title={isMobile ? "Attack nearest" : "Attack nearest [S]"}
              style={{
                minWidth: 58,
                height: 52,
                borderRadius: 7,
                background: canAttackNearest
                  ? "rgba(200,30,30,0.32)"
                  : "rgba(60,10,10,0.35)",
                border: canAttackNearest
                  ? "2px solid rgba(255,70,70,0.9)"
                  : "2px solid rgba(140,20,20,0.35)",
                color: canAttackNearest ? "#ff7070" : "rgba(200,80,80,0.3)",
                cursor: canAttackNearest ? "pointer" : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                flexShrink: 0,
                transition: "all 0.12s",
                boxShadow: canAttackNearest
                  ? "0 0 12px rgba(220,30,30,0.45)"
                  : "none",
                position: "relative",
              }}
            >
              <Swords size={15} />
              <span
                style={{
                  fontSize: 7,
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                NEAREST
              </span>
              {!isMobile && (
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 4,
                    fontSize: 7,
                    fontWeight: 700,
                    color: "rgba(255,120,120,0.55)",
                    lineHeight: 1,
                  }}
                >
                  S
                </span>
              )}
            </button>

            {/* Battle status pill — only show during battle */}
            {inBattle && (
              <div
                data-ocid="battle_ui.status"
                className="animate-pulse"
                style={{
                  marginLeft: 4,
                  padding: "4px 8px",
                  borderRadius: 18,
                  background: "rgba(220,20,20,0.2)",
                  border: "1px solid rgba(220,20,20,0.5)",
                  color: "#ff6b6b",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                ⚔️ BATTLE
              </div>
            )}
          </div>
        </div>
      </DraggablePanel>
      {selectedCombatant &&
        popupAnchor &&
        createPortal(
          <StatPopup
            combatant={selectedCombatant}
            unitStats={unitStats}
            unitEffects={unitEffects}
            anchorRect={popupAnchor}
            onClose={() => setSelectedCombatantId(null)}
          />,
          document.body,
        )}
    </>
  );
};

export default BattleUIPanel;
