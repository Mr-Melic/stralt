import type React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useClaimAchievementReward,
  useGetAchievementConfigs,
  useGetPlayerAchievements,
} from "../hooks/useQueries";
import type { AchievementConfig } from "../types/gameTypes";
import DraggablePanel from "./DraggablePanel";

interface AchievementsPanelProps {
  userId?: string;
  dokaBalance: number;
  onDokaBalanceChange: (newBalance: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  userId = "guest",
  dokaBalance: _dokaBalance,
  onDokaBalanceChange,
  isOpen,
  onClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === "function" ? v(open) : v;
    setInternalOpen(next);
    if (!next && onClose) onClose();
  };
  const { data: configs = [], isLoading: configsLoading } =
    useGetAchievementConfigs();
  const { data: progress = [], isLoading: progressLoading } =
    useGetPlayerAchievements();
  const claimMut = useClaimAchievementReward();

  const getProgress = useCallback(
    (id: string) => progress.find((p) => p.achievementId === id),
    [progress],
  );

  const handleClaim = useCallback(
    (achievement: AchievementConfig) => {
      claimMut.mutate(achievement.id, {
        onSuccess: () => {
          onDokaBalanceChange(achievement.dokaReward);
          toast.success(
            `🏆 Claimed ${achievement.dokaReward.toLocaleString()} Doka!`,
          );
        },
        onError: () => toast.error("Failed to claim reward"),
      });
    },
    [claimMut, onDokaBalanceChange],
  );

  const unclaimedCount = configs.filter((cfg) => {
    const p = getProgress(cfg.id);
    return p?.unlocked && !p.claimed;
  }).length;

  return (
    <>
      {/* Trophy toggle button */}
      <button
        type="button"
        data-ocid="achievements.open_modal_button"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          top: 8,
          right: 280,
          zIndex: 200,
          background: open ? "rgba(180,140,20,0.25)" : "rgba(10,10,15,0.88)",
          border: "1px solid #8b0000",
          borderRadius: 6,
          color: "#f0c040",
          fontSize: 18,
          width: 36,
          height: 36,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
          boxShadow: open
            ? "0 0 14px rgba(180,140,20,0.4)"
            : "0 2px 8px rgba(139,0,0,0.3)",
        }}
        aria-label="Toggle achievements panel"
      >
        🏆
        {unclaimedCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#c0392b",
              color: "#fff",
              borderRadius: "50%",
              width: 14,
              height: 14,
              fontSize: 9,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            {unclaimedCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <DraggablePanel
          panelId="achievements_panel"
          title="🏆 Achievements"
          userId={userId}
          defaultPosition={{ x: Math.max(0, window.innerWidth - 340), y: 60 }}
          defaultFolded={false}
          zIndex={201}
          style={{ width: 320 }}
        >
          <div
            data-ocid="achievements.panel"
            style={{ maxHeight: 480, overflowY: "auto", padding: "8px 0" }}
          >
            {(configsLoading || progressLoading) && (
              <div
                data-ocid="achievements.loading_state"
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#5a6a7a",
                  fontSize: 12,
                }}
              >
                Loading achievements…
              </div>
            )}

            {!configsLoading && !progressLoading && configs.length === 0 && (
              <div
                data-ocid="achievements.empty_state"
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#5a6a7a",
                  fontSize: 12,
                }}
              >
                No achievements configured yet
              </div>
            )}

            {configs
              .filter((cfg) => cfg.active)
              .map((cfg, i) => {
                const p = getProgress(cfg.id);
                const unlocked = p?.unlocked ?? false;
                const claimed = p?.claimed ?? false;

                return (
                  <div
                    key={cfg.id}
                    data-ocid={`achievements.item.${i + 1}`}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      padding: "8px 12px",
                      borderBottom: "1px solid rgba(139,0,0,0.2)",
                      opacity: unlocked ? 1 : 0.5,
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        fontSize: 22,
                        flexShrink: 0,
                        filter: unlocked
                          ? "drop-shadow(0 0 6px rgba(240,192,64,0.6))"
                          : "grayscale(1)",
                      }}
                    >
                      {claimed ? "✅" : unlocked ? "🏆" : "🔒"}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: unlocked ? "#f0c040" : "#5a6a7a",
                          fontWeight: 700,
                          fontSize: 12,
                          marginBottom: 2,
                        }}
                      >
                        {cfg.name}
                      </div>
                      <div
                        style={{
                          color: "#4a5a6a",
                          fontSize: 10,
                          lineHeight: 1.4,
                          marginBottom: 4,
                        }}
                      >
                        {cfg.description}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#c8961a",
                          fontWeight: 700,
                        }}
                      >
                        🪙 {cfg.dokaReward.toLocaleString()} Doka
                      </div>
                    </div>

                    {/* Claim button */}
                    {unlocked && !claimed && (
                      <button
                        type="button"
                        data-ocid={`achievements.claim_button.${i + 1}`}
                        onClick={() => handleClaim(cfg)}
                        disabled={claimMut.isPending}
                        style={{
                          background:
                            "linear-gradient(135deg, #5a0000, #8b0000)",
                          border: "1px solid #dc2626",
                          borderRadius: 5,
                          color: "#fde8e8",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "4px 8px",
                          cursor: "pointer",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          boxShadow: "0 0 8px rgba(220, 38, 38, 0.3)",
                        }}
                      >
                        Claim{" "}
                        {cfg.dokaReward > 0n
                          ? `+${cfg.dokaReward.toLocaleString()}🪙`
                          : ""}
                      </button>
                    )}

                    {claimed && (
                      <span
                        data-ocid={`achievements.claimed_badge.${i + 1}`}
                        style={{
                          fontSize: 9,
                          color: "#2ecc71",
                          fontWeight: 700,
                          flexShrink: 0,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Claimed
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </DraggablePanel>
      )}
    </>
  );
};

export default AchievementsPanel;
