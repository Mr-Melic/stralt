import { Hourglass, Sparkles } from "lucide-react";
import type React from "react";
import { useMemo } from "react";

/** A single spell entry in a summon's kit. */
export interface SummonKitSpell {
  spellId: string;
  name: string;
  icon?: string;
  apCost: number;
  description?: string;
}

/** A summon's spell kit. */
export interface SummonKit {
  spells: SummonKitSpell[];
}

/** Live state of a player-controlled summon. */
export interface SummonState {
  id: string;
  name: string;
  pieceType?: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  currentAp: number;
  currentMp: number;
  turnsRemaining: number;
  maxTurnsRemaining?: number;
  summonKit?: SummonKit;
}

export interface SummonControlPanelProps {
  summon: SummonState;
  selectedSpellId: string | null;
  onSelectSpell: (spellId: string | null) => void;
  onEndTurn: () => void;
  disabled?: boolean;
  isCasting?: boolean;
}

const SummonControlPanel: React.FC<SummonControlPanelProps> = ({
  summon,
  selectedSpellId,
  onSelectSpell,
  onEndTurn,
  disabled = false,
  isCasting = false,
}) => {
  const hpPct = useMemo(() => {
    if (summon.maxHp <= 0) return 0;
    return Math.max(0, Math.min(100, (summon.hp / summon.maxHp) * 100));
  }, [summon.hp, summon.maxHp]);

  const pips = useMemo(() => {
    const total = summon.maxTurnsRemaining ?? summon.turnsRemaining;
    if (total <= 0) return [];
    return Array.from({ length: total }, (_, i) => ({
      key: `pip-${i}`,
      filled: i < summon.turnsRemaining,
    }));
  }, [summon.maxTurnsRemaining, summon.turnsRemaining]);

  const spells = useMemo(
    () => summon.summonKit?.spells ?? [],
    [summon.summonKit],
  );

  const portraitGlyph = useMemo(() => {
    const base = summon.name?.trim() ?? "?";
    return base.charAt(0).toUpperCase() || "?";
  }, [summon.name]);

  const handleSpellClick = (spell: SummonKitSpell) => {
    if (disabled) return;
    if (summon.currentAp < spell.apCost) return;
    if (selectedSpellId === spell.spellId) {
      onSelectSpell(null);
    } else {
      onSelectSpell(spell.spellId);
    }
  };

  return (
    <div
      data-ocid="summon_control.panel"
      style={{
        minHeight: 84,
        background:
          "linear-gradient(180deg, rgba(10,8,20,0.97) 0%, rgba(20,10,28,0.99) 100%)",
        borderTop: "2px solid rgba(180,20,20,0.8)",
        boxShadow:
          "0 -4px 24px rgba(180,20,20,0.25), 0 -1px 0 rgba(180,20,20,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 16px",
        pointerEvents: "auto",
        color: "#e8d8d8",
      }}
    >
      {/* LEFT: portrait + name + lifespan pips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 56,
            height: 56,
            borderRadius: 8,
            background:
              "radial-gradient(circle at 50% 35%, rgba(180,40,40,0.55) 0%, rgba(40,12,18,0.95) 70%)",
            border: "2px solid rgba(200,40,40,0.7)",
            boxShadow:
              "0 0 12px rgba(200,30,30,0.4), inset 0 0 8px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#ffd9d9",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              lineHeight: 1,
            }}
          >
            {portraitGlyph}
          </span>
          {/* HP bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 6,
              background: "rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                width: `${hpPct}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, rgba(220,40,40,0.95) 0%, rgba(255,80,80,0.95) 100%)",
                boxShadow: "0 0 6px rgba(255,60,60,0.6)",
                transition: "width 0.2s",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 96,
            maxWidth: 140,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#ff8a8a",
              letterSpacing: "0.04em",
              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {summon.name}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {pips.length === 0 ? (
              <span
                title="Infinite lifespan"
                style={{
                  fontSize: 12,
                  color: "#ffd9a0",
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                ∞
              </span>
            ) : (
              pips.map((pip) => (
                <span
                  key={pip.key}
                  title={
                    pip.filled ? "Remaining lifespan pip" : "Spent lifespan pip"
                  }
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: pip.filled
                      ? "rgba(255,180,80,0.95)"
                      : "rgba(80,60,40,0.5)",
                    border: pip.filled
                      ? "1px solid rgba(255,200,120,0.9)"
                      : "1px solid rgba(120,90,60,0.4)",
                    boxShadow: pip.filled
                      ? "0 0 4px rgba(255,180,80,0.6)"
                      : "none",
                    display: "inline-block",
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 56,
          background: "rgba(180,20,20,0.3)",
          flexShrink: 0,
        }}
      />

      {/* CENTER: AP orb + MP orb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        {/* AP orb (blue radial) */}
        <div
          title={`${summon.currentAp} Action Points`}
          style={{
            position: "relative",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 35%, rgba(120,180,255,0.95) 0%, rgba(20,40,100,0.95) 70%)",
            border: "2px solid rgba(120,180,255,0.8)",
            boxShadow:
              "0 0 12px rgba(80,140,255,0.45), inset 0 0 8px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#eaf3ff",
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
              lineHeight: 1,
            }}
          >
            {summon.currentAp}
          </span>
          <span
            style={{
              position: "absolute",
              bottom: -10,
              fontSize: 8,
              fontWeight: 800,
              color: "#74b9ff",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            AP
          </span>
        </div>

        {/* MP orb (green radial) */}
        <div
          title={`${summon.currentMp} Movement Points`}
          style={{
            position: "relative",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 35%, rgba(120,255,160,0.95) 0%, rgba(20,100,50,0.95) 70%)",
            border: "2px solid rgba(120,255,160,0.8)",
            boxShadow:
              "0 0 12px rgba(80,255,140,0.4), inset 0 0 8px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "#eafff0",
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
              lineHeight: 1,
            }}
          >
            {summon.currentMp}
          </span>
          <span
            style={{
              position: "absolute",
              bottom: -10,
              fontSize: 8,
              fontWeight: 800,
              color: "#7dffae",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            MP
          </span>
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 56,
          background: "rgba(180,20,20,0.3)",
          flexShrink: 0,
        }}
      />

      {/* RIGHT: kit spell slots */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "nowrap",
          alignItems: "center",
          flex: 1,
          minWidth: 0,
        }}
      >
        {spells.length === 0 ? (
          <div
            data-ocid="summon_control.empty_state"
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              background: "rgba(60,20,20,0.25)",
              border: "1px dashed rgba(180,40,40,0.4)",
              color: "rgba(255,180,180,0.6)",
              fontSize: 11,
              fontStyle: "italic",
              letterSpacing: "0.03em",
            }}
          >
            No kit spells — movement only
          </div>
        ) : (
          spells.map((spell, idx) => {
            const isSelected = selectedSpellId === spell.spellId;
            const tooExpensive = summon.currentAp < spell.apCost;
            const isDisabled = disabled || tooExpensive;
            const titleText = `${spell.name}${
              spell.description ? ` — ${spell.description}` : ""
            } | ${spell.apCost} AP${tooExpensive ? " (insufficient AP)" : ""}`;
            return (
              <button
                key={spell.spellId}
                type="button"
                data-ocid={`summon_control.spell_slot.${idx + 1}`}
                aria-label={titleText}
                aria-pressed={isSelected}
                title={titleText}
                onClick={() => handleSpellClick(spell)}
                disabled={isDisabled}
                style={{
                  width: 46,
                  height: 54,
                  borderRadius: 6,
                  background: isSelected
                    ? "rgba(220,30,30,0.35)"
                    : tooExpensive
                      ? "rgba(40,15,15,0.4)"
                      : "rgba(80,15,15,0.45)",
                  border: isSelected
                    ? "2px solid rgba(255,80,80,0.9)"
                    : tooExpensive
                      ? "2px solid rgba(120,30,30,0.35)"
                      : "2px solid rgba(180,20,20,0.55)",
                  color: isSelected
                    ? "#ff9999"
                    : tooExpensive
                      ? "rgba(200,140,140,0.5)"
                      : "rgba(255,220,220,0.85)",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: tooExpensive ? 0.55 : 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  position: "relative",
                  transition: "all 0.15s",
                  boxShadow: isSelected
                    ? "0 0 16px rgba(255,60,60,0.5), inset 0 0 8px rgba(255,60,60,0.12)"
                    : "0 2px 6px rgba(0,0,0,0.4)",
                  flexShrink: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: 18,
                    lineHeight: 1,
                    filter: isSelected
                      ? "drop-shadow(0 1px 3px rgba(255,60,60,0.5))"
                      : "none",
                  }}
                >
                  {spell.icon || spell.name.charAt(0).toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: 6,
                    fontWeight: 700,
                    lineHeight: 1,
                    textAlign: "center",
                    maxWidth: 44,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {spell.name}
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 3,
                    fontSize: 6,
                    fontWeight: 800,
                    color: "#74b9ff",
                    background: "rgba(20,40,100,0.7)",
                    padding: "0 2px",
                    borderRadius: 2,
                    lineHeight: "11px",
                  }}
                >
                  {spell.apCost}AP
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Separator */}
      <div
        style={{
          width: 1,
          height: 56,
          background: "rgba(180,20,20,0.3)",
          flexShrink: 0,
        }}
      />

      {/* END TURN button */}
      <button
        type="button"
        data-ocid="summon_control.end_turn_button"
        onClick={onEndTurn}
        disabled={disabled}
        aria-label="End summon's turn"
        title="End summon's turn"
        style={{
          minWidth: 72,
          height: 54,
          borderRadius: 8,
          background: disabled ? "rgba(60,10,10,0.35)" : "rgba(200,30,30,0.32)",
          border: disabled
            ? "2px solid rgba(140,20,20,0.35)"
            : "2px solid rgba(255,70,70,0.9)",
          color: disabled ? "rgba(200,80,80,0.3)" : "#ff7070",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexShrink: 0,
          transition: "all 0.15s",
          boxShadow: disabled
            ? "none"
            : "0 0 14px rgba(220,30,30,0.45), inset 0 0 6px rgba(255,60,60,0.1)",
        }}
      >
        <Hourglass size={16} />
        <span
          style={{
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.06em",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          END TURN
        </span>
      </button>

      {/* Header label + casting pill */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
          flexShrink: 0,
          marginLeft: 4,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: "#ff6b6b",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textShadow: "0 1px 3px rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
          }}
        >
          Summon's turn
        </span>
        {isCasting && (
          <span
            data-ocid="summon_control.casting_state"
            className="animate-pulse"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "2px 8px",
              borderRadius: 20,
              background: "rgba(220,20,20,0.2)",
              border: "1px solid rgba(220,20,20,0.5)",
              color: "#ff8a8a",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            <Sparkles size={10} />
            Casting
          </span>
        )}
      </div>
    </div>
  );
};

export default SummonControlPanel;
