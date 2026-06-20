import { BookOpen, Swords } from "lucide-react";
import React from "react";
import type { SpellConfig } from "../types/gameTypes";
import DraggablePanel from "./DraggablePanel";
import type { CombatantEntry } from "./InitiativeStrip";

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
  onSelectSpell: (id: string) => void;
  onOpenSpellbook: () => void;
  onAttackNearest?: () => void;
  canAttackNearest?: boolean;
  isMobile?: boolean;
  // Initiative strip
  turnOrder: CombatantEntry[];
  currentTurnIndex: number;
  battlePhase: "player" | "enemy";
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
  onEndTurn: () => void;
  // Spell cooldowns
  spellCooldowns?: Record<string, number>;
  // Misc
  userId?: string;
}

const BattleUIPanel: React.FC<BattleUIPanelProps> = ({
  inBattle = false,
  activeSpells,
  selectedSpellIdRef,
  spellSelectionVersion,
  onSelectSpell,
  onOpenSpellbook,
  onAttackNearest,
  canAttackNearest = false,
  isMobile = false,
  turnOrder,
  currentTurnIndex,
  battlePhase,
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
  spellCooldowns = {},
  userId,
}) => {
  const forceUpdate = spellSelectionVersion; // keeps spellSelectionVersion used
  const selectedIdRef = React.useRef<string | null>(null);
  const [_cardSelectionVersion, setCardSelectionVersion] = React.useState(0);

  const handleCardClick = (id: string) => {
    selectedIdRef.current = selectedIdRef.current === id ? null : id;
    setCardSelectionVersion((v) => v + 1);
  };

  const currentCombatant = turnOrder[currentTurnIndex];

  return (
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
        style={{
          background:
            "linear-gradient(180deg, rgba(10,8,20,0.98) 0%, rgba(18,8,24,0.99) 100%)",
          borderTop: "2px solid rgba(180,20,20,0.8)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          minWidth: isMobile ? 320 : 620,
          maxWidth: isMobile ? 360 : 800,
        }}
      >
        {/* ── Header row: turn order mini-strip + timer + mode toggle + AP/MP — battle only ── */}
        {inBattle && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px 4px",
              borderBottom: "1px solid rgba(139,0,0,0.35)",
              flexWrap: "wrap",
            }}
          >
            {/* Mini initiative list */}
            <div
              data-ocid="battle_ui.initiative_strip"
              style={{
                display: "flex",
                gap: 3,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
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
                const isSelected = selectedIdRef.current === c.id;
                const hpPct = Math.max(
                  0,
                  Math.min(100, (c.hp / c.maxHp) * 100),
                );
                return (
                  <div
                    key={c.id}
                    data-ocid={`battle_ui.initiative.item.${idx + 1}`}
                    style={{ position: "relative", display: "inline-flex" }}
                  >
                    <button
                      type="button"
                      title={`${c.name} Lv.${c.level} — INIT ${c.initiative}`}
                      onClick={() => {
                        if (!isPlayer) handleCardClick(c.id);
                      }}
                      style={{
                        width: 34,
                        height: 40,
                        borderRadius: 5,
                        background: isActive
                          ? isPlayer
                            ? "rgba(220,30,30,0.40)"
                            : "rgba(70,10,10,0.65)"
                          : "rgba(20,10,20,0.70)",
                        border: isActive
                          ? isPlayer
                            ? "2px solid rgba(255,90,90,0.95)"
                            : "2px solid rgba(180,0,0,0.80)"
                          : "1px solid rgba(139,0,0,0.32)",
                        transform: isActive ? "scale(1.08)" : "scale(0.94)",
                        opacity: isActive ? 1 : 0.6,
                        transition: "all 0.2s",
                        boxShadow: isActive
                          ? "0 0 12px rgba(255,50,50,0.45)"
                          : "none",
                        cursor: isPlayer ? "default" : "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2px",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {isActive && (
                        <div
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: isPlayer ? "#ff4444" : "#880000",
                            boxShadow: "0 0 4px rgba(255,50,50,0.8)",
                            animation: "pulse 1s ease-in-out infinite",
                          }}
                        />
                      )}
                      {extraStats.enraged && (
                        <div
                          style={{
                            position: "absolute",
                            top: 1,
                            left: 1,
                            fontSize: 7,
                            lineHeight: 1,
                          }}
                        >
                          \uD83D\uDD25
                        </div>
                      )}
                      {isLeader && (
                        <div
                          style={{
                            position: "absolute",
                            top: 1,
                            right: isActive ? 8 : 2,
                            fontSize: 8,
                            lineHeight: 1,
                            filter: "drop-shadow(0 0 2px rgba(255,210,0,0.9))",
                            zIndex: 3,
                          }}
                          title="Leader"
                        >
                          \uD83D\uDC51
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: 16,
                          lineHeight: 1,
                          color: isActive
                            ? isPlayer
                              ? "#ffcccc"
                              : "#ff8888"
                            : "rgba(200,120,120,0.65)",
                          filter: isActive
                            ? "drop-shadow(0 0 4px rgba(255,80,80,0.7))"
                            : "none",
                        }}
                      >
                        {symbol}
                      </span>
                      {!isPlayer && (
                        <div
                          style={{
                            width: 28,
                            height: 2,
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: 1,
                            overflow: "hidden",
                            marginTop: 1,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${hpPct}%`,
                              background:
                                hpPct > 50
                                  ? "#27ae60"
                                  : hpPct > 25
                                    ? "#e67e22"
                                    : "#e74c3c",
                              borderRadius: 1,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      )}
                    </button>

                    {/* Stats tooltip on click */}
                    {isSelected && !isPlayer && (
                      <div
                        data-ocid={`battle_ui.initiative.tooltip.${idx + 1}`}
                        style={{
                          position: "absolute",
                          bottom: 48,
                          left: 0,
                          zIndex: 300,
                          minWidth: 170,
                          background: "#0a0a0f",
                          border: "1.5px solid #8b0000",
                          borderRadius: 8,
                          padding: "10px 12px",
                          boxShadow:
                            "0 0 18px rgba(139,0,0,0.5), 0 4px 16px rgba(0,0,0,0.8)",
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 6,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              color: "#ff7675",
                              fontWeight: 800,
                              fontSize: 11,
                            }}
                          >
                            {c.name.toUpperCase()}
                          </span>
                          {extraStats.enraged && (
                            <span
                              style={{
                                color: "#ff4500",
                                fontWeight: 900,
                                fontSize: 9,
                              }}
                            >
                              ENRAGED!
                            </span>
                          )}
                          <span
                            style={{
                              color: "rgba(255,180,80,0.8)",
                              fontSize: 10,
                            }}
                          >
                            Lv.{c.level}
                          </span>
                        </div>
                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                        >
                          {(
                            [
                              ["❤", "HP", `${c.hp}/${c.maxHp}`, "#e74c3c"],
                              ["⚡", "AP", extraStats.ap ?? "?", "#4a9adf"],
                              ["👣", "MP", extraStats.mp ?? "?", "#2ecc71"],
                              ["🗡️", "ATK", extraStats.atk ?? "?", "#e67e22"],
                              ["🛡️", "RES", extraStats.res ?? 0, "#9b59b6"],
                              ["💎", "SP", extraStats.sp ?? 0, "#1abc9c"],
                              ["✨", "CHC", extraStats.chc ?? 0, "#f1c40f"],
                            ] as [string, string, string | number, string][]
                          ).map(([icon, label, val, color]) => (
                            <div
                              key={label}
                              style={{
                                background: `${color}18`,
                                border: `1px solid ${color}44`,
                                borderRadius: 4,
                                padding: "2px 5px",
                                fontSize: 9,
                                color,
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {icon} {label}: {val}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Vertical divider */}
            <div
              style={{
                width: 1,
                alignSelf: "stretch",
                background: "rgba(139,0,0,0.4)",
                flexShrink: 0,
              }}
            />

            {/* Phase indicator + timer */}
            <div
              data-ocid="battle_ui.phase_indicator"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
                minWidth: 48,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  filter:
                    battlePhase === "player"
                      ? "drop-shadow(0 0 4px rgba(255,80,80,0.8))"
                      : "none",
                }}
              >
                {battlePhase === "player" ? "⚔️" : "💀"}
              </div>
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 900,
                  color:
                    battlePhase === "player"
                      ? "rgba(255,140,140,0.95)"
                      : "rgba(200,80,80,0.8)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {battlePhase === "player" ? "YOUR" : "ENEMY"}
              </div>
              {/* Timer */}
              <div
                data-ocid="battle_ui.timer"
                style={{
                  padding: "1px 5px",
                  borderRadius: 3,
                  background:
                    turnTimeLeft <= 7
                      ? "rgba(180,10,10,0.55)"
                      : turnTimeLeft <= 15
                        ? "rgba(180,120,0,0.5)"
                        : "rgba(0,100,40,0.4)",
                  border:
                    turnTimeLeft <= 7
                      ? "1px solid rgba(255,60,60,0.7)"
                      : turnTimeLeft <= 15
                        ? "1px solid rgba(241,196,15,0.5)"
                        : "1px solid rgba(39,174,96,0.5)",
                  color:
                    turnTimeLeft <= 7
                      ? "#ff6b6b"
                      : turnTimeLeft <= 15
                        ? "#f1c40f"
                        : "#2ecc71",
                  fontSize: 12,
                  fontWeight: 900,
                  fontVariantNumeric: "tabular-nums",
                  animation:
                    turnTimeLeft <= 7
                      ? "pulse 0.6s ease-in-out infinite"
                      : "none",
                }}
              >
                {turnTimeLeft}s
              </div>
              <div
                style={{
                  fontSize: 7,
                  color: "rgba(200,80,80,0.5)",
                  fontWeight: 700,
                }}
              >
                T{battleTurn}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: 1,
                alignSelf: "stretch",
                background: "rgba(139,0,0,0.4)",
                flexShrink: 0,
              }}
            />

            {/* AP/MP counters */}
            <div
              data-ocid="battle_ui.resources"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(20,40,100,0.5)",
                  border: "1px solid rgba(74,154,223,0.4)",
                  borderRadius: 4,
                  padding: "2px 8px",
                }}
              >
                <span style={{ fontSize: 10 }}>⚡</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#74b9ff",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(20,80,40,0.5)",
                  border: "1px solid rgba(46,204,113,0.4)",
                  borderRadius: 4,
                  padding: "2px 8px",
                }}
              >
                <span style={{ fontSize: 10 }}>👣</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#2ecc71",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
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
            <div
              style={{
                width: 1,
                alignSelf: "stretch",
                background: "rgba(139,0,0,0.4)",
                flexShrink: 0,
              }}
            />

            {/* Walk / Attack toggle + End Turn */}
            <div
              style={{
                display: "flex",
                gap: 4,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                data-ocid="battle_ui.walk_button"
                onClick={onSetWalk}
                style={{
                  padding: "4px 8px",
                  borderRadius: 5,
                  border:
                    battleActionMode === "walk"
                      ? "2px solid #27ae60"
                      : "2px solid rgba(39,174,96,0.4)",
                  background:
                    battleActionMode === "walk"
                      ? "rgba(39,174,96,0.28)"
                      : "rgba(10,20,14,0.85)",
                  color:
                    battleActionMode === "walk"
                      ? "#2ecc71"
                      : "rgba(46,204,113,0.55)",
                  fontWeight: 800,
                  fontSize: 10,
                  cursor: currentBattleMp > 0 ? "pointer" : "not-allowed",
                  letterSpacing: "0.04em",
                  opacity: currentBattleMp <= 0 ? 0.45 : 1,
                  transition: "all 0.15s",
                }}
              >
                🚶 WALK
              </button>
              <button
                type="button"
                data-ocid="battle_ui.attack_button"
                onClick={onSetAttack}
                style={{
                  padding: "4px 8px",
                  borderRadius: 5,
                  border:
                    battleActionMode === "attack"
                      ? "2px solid rgba(200,30,30,0.9)"
                      : "2px solid rgba(200,30,30,0.35)",
                  background:
                    battleActionMode === "attack"
                      ? "rgba(180,20,20,0.32)"
                      : "rgba(20,8,8,0.85)",
                  color:
                    battleActionMode === "attack"
                      ? "#ff6b6b"
                      : "rgba(255,107,107,0.5)",
                  fontWeight: 800,
                  fontSize: 10,
                  cursor: currentBattleAp > 0 ? "pointer" : "not-allowed",
                  opacity: currentBattleAp <= 0 ? 0.45 : 1,
                  transition: "all 0.15s",
                }}
              >
                ⚔️ ATTACK
              </button>
              <button
                type="button"
                data-ocid="battle_ui.end_turn_button"
                onClick={onEndTurn}
                disabled={battlePhase !== "player"}
                style={{
                  padding: "4px 8px",
                  borderRadius: 5,
                  border:
                    battlePhase === "player"
                      ? "2px solid rgba(241,196,15,0.6)"
                      : "2px solid rgba(80,60,0,0.35)",
                  background: "rgba(30,22,0,0.85)",
                  color:
                    battlePhase === "player"
                      ? "#f1c40f"
                      : "rgba(150,120,0,0.45)",
                  fontWeight: 800,
                  fontSize: 10,
                  cursor: battlePhase === "player" ? "pointer" : "not-allowed",
                  opacity: battlePhase !== "player" ? 0.5 : 1,
                  transition: "all 0.15s",
                }}
              >
                END TURN
              </button>
            </div>

            {/* Current combatant name */}
            {currentCombatant && (
              <div
                style={{
                  marginLeft: "auto",
                  fontSize: 9,
                  color:
                    battlePhase === "player"
                      ? "#ff9999"
                      : "rgba(200,80,80,0.7)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {battlePhase === "player"
                  ? "YOUR TURN"
                  : `${currentCombatant.name.slice(0, 6)}'S TURN`}
              </div>
            )}
          </div>
        )}

        {/* ── Spell row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px 8px",
            flexWrap: "nowrap",
            overflowX: "auto",
          }}
        >
          {/* Spellbook button */}
          <button
            type="button"
            data-ocid="battle_ui.spellbook_button"
            onClick={onOpenSpellbook}
            title="Open Spellbook"
            style={{
              width: 44,
              height: 52,
              borderRadius: 6,
              background: "rgba(140,20,20,0.18)",
              border: "2px solid rgba(180,20,20,0.55)",
              color: "#ff6b6b",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            <BookOpen size={16} />
            <span style={{ fontSize: 8, lineHeight: 1, opacity: 0.8 }}>
              Book
            </span>
          </button>

          {/* Separator */}
          <div
            style={{
              width: 1,
              height: 44,
              background: "rgba(180,20,20,0.3)",
              flexShrink: 0,
            }}
          />

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
  );
};

export default BattleUIPanel;
