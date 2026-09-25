import type { CSSProperties } from "react";
import { LIVE_CATALOG_PUBLISH_NOTE } from "../utils/adminOwnerUx.catalogPublish";
import {
  ADMIN_SUMMON_AIS,
  ADMIN_SUMMON_PIECES,
  type SummonEditorSlice,
  applySummonEnabled,
  patchSummonField,
} from "../utils/adminOwnerUx.summon";

const C = {
  gold: "#f0c44a",
  goldDim: "#5c4a1f",
  dimmer: "#5a5060",
} as const;

const inputStyle: CSSProperties = {
  width: "100%",
  background: "linear-gradient(180deg,#13141c,#0e0f16)",
  border: "1px solid rgba(192,57,43,0.27)",
  borderRadius: 8,
  color: "#c0ccd8",
  padding: "7px 10px",
  fontSize: 12,
  outline: "none",
  fontFamily: "'Saira', system-ui, sans-serif",
};

const labelStyle: CSSProperties = {
  color: "#d8463f",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  marginBottom: 4,
  display: "block",
  fontFamily: "'Saira', system-ui, sans-serif",
};

const sectionHeadStyle: CSSProperties = {
  color: "#d8463f",
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  marginBottom: 10,
  paddingBottom: 5,
  borderBottom: "1px solid rgba(216,70,63,0.25)",
  fontFamily: "'Saira', system-ui, sans-serif",
};

export function SpellSummonFields<T extends SummonEditorSlice>({
  cfg,
  onChange,
}: {
  cfg: T;
  onChange: (next: T) => void;
}) {
  const enabled = cfg.isSummon === true || cfg.spellType === "summon";
  const unit = cfg.summonUnitDef;
  return (
    <div data-ocid="admin.spell.summon_section">
      <p style={{ ...sectionHeadStyle, marginTop: 4 }}>Summon</p>
      <p
        style={{
          color: C.dimmer,
          fontSize: 10,
          margin: "0 0 10px",
          lineHeight: 1.45,
        }}
      >
        {LIVE_CATALOG_PUBLISH_NOTE} Required before Save when this is a summon.
        kiter aliases archer and kamikaze aliases bomber at runtime. Lifespan
        cap 20, unit level cap 99, hp/damage scale 0–10 (adminGuard). Empty
        custom visual is unrelated — this is combat identity, not a sprite URL.
      </p>
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 10px",
          background:
            "linear-gradient(160deg,#48343c 0%,#241a20 40%,#14101a 100%)",
          border: `1px solid ${C.goldDim}`,
          borderRadius: 5,
        }}
      >
        <input
          id="admin.spell.issummon_checkbox"
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(applySummonEnabled(cfg, e.target.checked))}
          data-ocid="admin.spell.issummon_checkbox"
          style={{ accentColor: C.gold, width: 14, height: 14 }}
        />
        <label
          htmlFor="admin.spell.issummon_checkbox"
          style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}
        >
          Summon (places a unit)
        </label>
      </div>
      {enabled && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0 16px",
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="admin.spell.summonai_select" style={labelStyle}>
              Summon AI
            </label>
            <select
              id="admin.spell.summonai_select"
              value={cfg.summonAI || "hunter"}
              onChange={(e) =>
                onChange(patchSummonField(cfg, "summonAI", e.target.value))
              }
              data-ocid="admin.spell.summonai_select"
              style={inputStyle}
            >
              {ADMIN_SUMMON_AIS.map((ai) => (
                <option key={ai} value={ai}>
                  {ai}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label
              htmlFor="admin.spell.summonlifespan_input"
              style={labelStyle}
            >
              Lifespan (turns)
            </label>
            <input
              id="admin.spell.summonlifespan_input"
              type="number"
              min={1}
              max={20}
              value={cfg.summonLifespan ?? 3}
              onChange={(e) =>
                onChange(
                  patchSummonField(cfg, "summonLifespan", e.target.value),
                )
              }
              data-ocid="admin.spell.summonlifespan_input"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="admin.spell.summonpiece_select" style={labelStyle}>
              Unit piece
            </label>
            <select
              id="admin.spell.summonpiece_select"
              value={unit?.pieceType || "pawn"}
              onChange={(e) =>
                onChange(patchSummonField(cfg, "pieceType", e.target.value))
              }
              data-ocid="admin.spell.summonpiece_select"
              style={inputStyle}
            >
              {ADMIN_SUMMON_PIECES.map((piece) => (
                <option key={piece} value={piece}>
                  {piece}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="admin.spell.summonlevel_input" style={labelStyle}>
              Unit level
            </label>
            <input
              id="admin.spell.summonlevel_input"
              type="number"
              min={1}
              max={99}
              value={unit?.level ?? 1}
              onChange={(e) =>
                onChange(patchSummonField(cfg, "level", e.target.value))
              }
              data-ocid="admin.spell.summonlevel_input"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="admin.spell.summonhpscale_input" style={labelStyle}>
              HP scale
            </label>
            <input
              id="admin.spell.summonhpscale_input"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={unit?.hpScale ?? 1}
              onChange={(e) =>
                onChange(patchSummonField(cfg, "hpScale", e.target.value))
              }
              data-ocid="admin.spell.summonhpscale_input"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label
              htmlFor="admin.spell.summondamagescale_input"
              style={labelStyle}
            >
              Damage scale
            </label>
            <input
              id="admin.spell.summondamagescale_input"
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={unit?.damageScale ?? 1}
              onChange={(e) =>
                onChange(patchSummonField(cfg, "damageScale", e.target.value))
              }
              data-ocid="admin.spell.summondamagescale_input"
              style={inputStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
