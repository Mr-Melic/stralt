import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import DraggablePanel from "./DraggablePanel";

// ── Item Definitions ──────────────────────────────────────────────────────────
export type BuffItemType =
  | "health_potion"
  | "greater_health_potion"
  | "battle_elixir"
  | "swift_boots"
  | "shield_charm"
  | "fury_potion";

export interface BuffItem {
  id: BuffItemType;
  name: string;
  icon: string;
  description: string;
  cost: number;
  maxStack: number;
}

export const BUFF_ITEMS: BuffItem[] = [
  {
    id: "health_potion",
    name: "Health Potion",
    icon: "🧪",
    description: "Restore 30% of max HP",
    cost: 50,
    maxStack: 5,
  },
  {
    id: "greater_health_potion",
    name: "Greater Potion",
    icon: "💊",
    description: "Restore 70% of max HP",
    cost: 120,
    maxStack: 5,
  },
  {
    id: "battle_elixir",
    name: "Battle Elixir",
    icon: "⚡",
    description: "+3 AP this turn (battle)",
    cost: 80,
    maxStack: 5,
  },
  {
    id: "swift_boots",
    name: "Swift Boots",
    icon: "👟",
    description: "+2 MP this turn (battle)",
    cost: 90,
    maxStack: 5,
  },
  {
    id: "shield_charm",
    name: "Shield Charm",
    icon: "🛡️",
    description: "Absorb next 20 damage",
    cost: 100,
    maxStack: 5,
  },
  {
    id: "fury_potion",
    name: "Fury Potion",
    icon: "💢",
    description: "+25% damage for 3 turns",
    cost: 150,
    maxStack: 5,
  },
];

// ── Inventory persistence ──────────────────────────────────────────────────────
export type Inventory = Partial<Record<BuffItemType, number>>;

export function loadInventory(principalId: string): Inventory {
  try {
    const raw = localStorage.getItem(`${principalId}_inventory`);
    if (!raw) return {};
    return JSON.parse(raw) as Inventory;
  } catch {
    return {};
  }
}

export function saveInventory(principalId: string, inv: Inventory): void {
  try {
    localStorage.setItem(`${principalId}_inventory`, JSON.stringify(inv));
  } catch {
    // ignore
  }
}

// ── Props ──────────────────────────────────────────────────────────────────────
export interface BuffShopProps {
  dokaBalance: number;
  onDeductDoka: (amount: number) => void;
  onUseItem: (itemType: BuffItemType) => void;
  isPlayerTurn: boolean;
  inBattle: boolean;
  userId?: string;
  /** Principal ID used as localStorage key namespace for inventory */
  principalId?: string;
}

const PANEL_STYLE: React.CSSProperties = {
  width: 248,
};

const sectionStyle: React.CSSProperties = {
  padding: "6px 8px",
  borderBottom: "1px solid rgba(139,0,0,0.35)",
};

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "4px 0",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  background: active ? "rgba(139,0,0,0.4)" : "transparent",
  border: active ? "1px solid #8b0000" : "1px solid transparent",
  borderRadius: 3,
  color: active ? "#ff8888" : "#996666",
  cursor: "pointer",
});

const itemCardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(139,0,0,0.3)",
  borderRadius: 5,
  padding: "6px 8px",
  display: "flex",
  flexDirection: "column",
  gap: 3,
  position: "relative",
};

const buyBtnStyle = (canAfford: boolean): React.CSSProperties => ({
  marginTop: 4,
  padding: "3px 0",
  fontSize: 10,
  fontWeight: 700,
  background: canAfford
    ? "linear-gradient(135deg,#6a0a0a,#c0392b)"
    : "rgba(40,15,15,0.7)",
  border: `1px solid ${canAfford ? "#c0392b" : "#5a2020"}`,
  borderRadius: 3,
  color: canAfford ? "#fff" : "#6a3a3a",
  cursor: canAfford ? "pointer" : "not-allowed",
  width: "100%",
});

const getBtnStyle = (canUse: boolean): React.CSSProperties => ({
  marginTop: 3,
  padding: "3px 0",
  fontSize: 10,
  fontWeight: 700,
  background: canUse
    ? "linear-gradient(135deg,#0a3a6a,#1a6ac0)"
    : "rgba(15,20,40,0.7)",
  border: `1px solid ${canUse ? "#1a6ac0" : "#1a2a5a"}`,
  borderRadius: 3,
  color: canUse ? "#a0cfff" : "#3a4a6a",
  cursor: canUse ? "pointer" : "not-allowed",
  width: "100%",
});

// ── Component ──────────────────────────────────────────────────────────────────
const BuffShop: React.FC<BuffShopProps> = ({
  dokaBalance,
  onDeductDoka,
  onUseItem,
  isPlayerTurn,
  inBattle,
  userId,
  principalId,
}) => {
  const storageKey = principalId ?? userId ?? "guest";
  const [inventory, setInventory] = useState<Inventory>(() =>
    loadInventory(storageKey),
  );
  const [activeTab, setActiveTab] = useState<"shop" | "inventory">("shop");
  // Track storageKey to reload when it changes (login)
  const prevKeyRef = useRef(storageKey);

  useEffect(() => {
    if (prevKeyRef.current !== storageKey) {
      prevKeyRef.current = storageKey;
      setInventory(loadInventory(storageKey));
    }
  }, [storageKey]);

  // Persist whenever inventory changes
  useEffect(() => {
    saveInventory(storageKey, inventory);
  }, [inventory, storageKey]);

  const handleBuy = useCallback(
    (item: BuffItem) => {
      if (dokaBalance < item.cost) return;
      if (inBattle) return; // buying disabled in battle
      const current = inventory[item.id] ?? 0;
      if (current >= item.maxStack) return;
      onDeductDoka(item.cost);
      setInventory((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] ?? 0) + 1,
      }));
    },
    [dokaBalance, inventory, inBattle, onDeductDoka],
  );

  const handleUse = useCallback(
    (itemId: BuffItemType) => {
      if (!inBattle || !isPlayerTurn) return;
      const count = inventory[itemId] ?? 0;
      if (count <= 0) return;
      onUseItem(itemId);
      setInventory((prev) => {
        const next = prev[itemId] ? prev[itemId]! - 1 : 0;
        return { ...prev, [itemId]: Math.max(0, next) };
      });
    },
    [inventory, inBattle, isPlayerTurn, onUseItem],
  );

  const totalItems = BUFF_ITEMS.reduce(
    (acc, it) => acc + (inventory[it.id] ?? 0),
    0,
  );

  return (
    <DraggablePanel
      panelId="buff-shop-panel"
      title="⚗️ Item Shop"
      userId={userId}
      defaultPosition={{ x: Math.max(0, window.innerWidth - 500), y: 54 }}
      defaultFolded={false}
      zIndex={200}
      style={PANEL_STYLE}
    >
      {/* Doka balance */}
      <div style={sectionStyle}>
        <span
          style={{
            color: "#f1c40f",
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          💰 {dokaBalance.toLocaleString()} Doka
          {inBattle && (
            <span style={{ color: "#e74c3c", fontSize: 9, marginLeft: 4 }}>
              (buy outside battle)
            </span>
          )}
        </span>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "5px 8px",
          borderBottom: "1px solid rgba(139,0,0,0.35)",
        }}
      >
        <button
          type="button"
          data-ocid="buff_shop.shop_tab"
          style={tabButtonStyle(activeTab === "shop")}
          onClick={() => setActiveTab("shop")}
        >
          Shop
        </button>
        <button
          type="button"
          data-ocid="buff_shop.inventory_tab"
          style={tabButtonStyle(activeTab === "inventory")}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
          {totalItems > 0 && (
            <span
              style={{
                marginLeft: 4,
                background: "#c0392b",
                color: "#fff",
                fontSize: 9,
                borderRadius: 8,
                padding: "0 4px",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Shop tab */}
      {activeTab === "shop" && (
        <div
          style={{
            padding: "6px 8px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            maxHeight: 340,
            overflowY: "auto",
          }}
        >
          {BUFF_ITEMS.map((item) => {
            const owned = inventory[item.id] ?? 0;
            const canAfford = dokaBalance >= item.cost && !inBattle;
            const atMax = owned >= item.maxStack;
            return (
              <div
                key={item.id}
                data-ocid={`buff_shop.item.${item.id}`}
                style={itemCardStyle}
              >
                {/* Count badge */}
                {owned > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "#c0392b",
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      borderRadius: 8,
                      padding: "0 4px",
                      lineHeight: "14px",
                    }}
                  >
                    ×{owned}
                  </span>
                )}
                <div
                  style={{ fontSize: 18, lineHeight: 1, textAlign: "center" }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    color: "#e0c8a0",
                    fontSize: 9,
                    fontWeight: 700,
                    textAlign: "center",
                    lineHeight: 1.2,
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    color: "#887766",
                    fontSize: 8,
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  {item.description}
                </div>
                <div
                  style={{
                    color: "#f1c40f",
                    fontSize: 9,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {item.cost} Doka
                </div>
                <button
                  type="button"
                  data-ocid={`buff_shop.buy_button.${item.id}`}
                  style={buyBtnStyle(canAfford && !atMax)}
                  disabled={!canAfford || atMax}
                  onClick={() => handleBuy(item)}
                >
                  {atMax ? "Max" : "Buy"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Inventory tab */}
      {activeTab === "inventory" && (
        <div
          style={{
            padding: "6px 8px",
            maxHeight: 340,
            overflowY: "auto",
          }}
        >
          {BUFF_ITEMS.filter((it) => (inventory[it.id] ?? 0) > 0).length ===
          0 ? (
            <div
              data-ocid="buff_shop.empty_state"
              style={{
                color: "#556677",
                fontSize: 10,
                textAlign: "center",
                padding: "18px 0",
              }}
            >
              No items in inventory.
              <br />
              Buy items in the Shop tab.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              {BUFF_ITEMS.filter((it) => (inventory[it.id] ?? 0) > 0).map(
                (item) => {
                  const count = inventory[item.id] ?? 0;
                  const canUse = inBattle && isPlayerTurn && count > 0;
                  return (
                    <div
                      key={item.id}
                      data-ocid={`buff_shop.inv_item.${item.id}`}
                      style={{
                        ...itemCardStyle,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 18, flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            color: "#e0c8a0",
                            fontSize: 9,
                            fontWeight: 700,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.name}
                          <span
                            style={{
                              color: "#c0392b",
                              marginLeft: 4,
                              fontWeight: 800,
                            }}
                          >
                            ×{count}
                          </span>
                        </div>
                        <div
                          style={{
                            color: "#887766",
                            fontSize: 8,
                            lineHeight: 1.3,
                            marginTop: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.description}
                        </div>
                      </div>
                      <button
                        type="button"
                        data-ocid={`buff_shop.use_button.${item.id}`}
                        style={{
                          ...getBtnStyle(canUse),
                          width: 38,
                          flexShrink: 0,
                          marginTop: 0,
                        }}
                        disabled={!canUse}
                        onClick={() => handleUse(item.id)}
                        title={
                          !inBattle
                            ? "Only usable in battle"
                            : !isPlayerTurn
                              ? "Wait for your turn"
                              : "Use item"
                        }
                      >
                        Use
                      </button>
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* In-battle hint */}
          {!inBattle && (
            <p
              style={{
                color: "#556677",
                fontSize: 8,
                textAlign: "center",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              Items can only be used during your battle turn.
            </p>
          )}
        </div>
      )}
    </DraggablePanel>
  );
};

export default BuffShop;
