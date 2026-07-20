import { useQueryClient } from "@tanstack/react-query";
import { Trophy, X } from "lucide-react";
import type React from "react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  useClaimAchievementReward,
  useGetAchievementConfigs,
  useGetPlayerAchievements,
} from "../hooks/useQueries";
import type {
  AchievementConfig,
  AchievementProgress,
} from "../types/gameTypes";

interface AchievementsPanelProps {
  userId?: string;
  dokaBalance: number;
  onDokaBalanceChange: (newBalance: number) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  userId: _userId,
  dokaBalance,
  onDokaBalanceChange,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const { data: configs = [], isLoading: configsLoading } =
    useGetAchievementConfigs();
  const { data: progress = [], isLoading: progressLoading } =
    useGetPlayerAchievements();
  const claimMut = useClaimAchievementReward();

  const progressMap = useMemo(() => {
    const map = new Map<string, { unlocked: boolean; claimed: boolean }>();
    for (const p of progress) {
      map.set(p.achievementId, { unlocked: p.unlocked, claimed: p.claimed });
    }
    return map;
  }, [progress]);

  const getProgress = useCallback(
    (id: string) => progressMap.get(id),
    [progressMap],
  );

  // Rollback helper: undo any stale optimistic claimed=true flip for the given
  // achievement id and force a refetch of the authoritative backend state.
  // Used both when the backend returns #err (e.g. "not yet unlocked") and when
  // the mutation fails at the transport layer (onError). Without this, a stale
  // cache entry could keep the row showing "Claimed" even though the backend
  // rejected the claim, so the UI would lie about persisted state.
  const rollbackClaimed = useCallback(
    (achievementId: string) => {
      queryClient.setQueryData(
        ["playerAchievements"],
        (old: AchievementProgress[] | undefined) =>
          old?.map((p) =>
            p.achievementId === achievementId ? { ...p, claimed: false } : p,
          ),
      );
      queryClient.invalidateQueries({ queryKey: ["playerAchievements"] });
      queryClient.invalidateQueries({ queryKey: ["callerDokaBalance"] });
    },
    [queryClient],
  );

  const handleClaim = useCallback(
    (achievement: AchievementConfig) => {
      claimMut.mutate(achievement.id, {
        onSuccess: (result) => {
          console.log(
            "[FEATS] CLAIM: handleClaim onSuccess raw result =",
            JSON.stringify(result, (_k, v) =>
              typeof v === "bigint" ? v.toString() : v,
            ),
          );
          if ("ok" in result) {
            const granted = Number(result.ok);
            console.log(
              "[FEATS] CLAIM: #ok granted amount =",
              granted,
              "for",
              achievement.id,
            );
            // Optimistic update: flip claimed=true immediately so the UI
            // reflects the claim without waiting for the refetch to propagate.
            queryClient.setQueryData(
              ["playerAchievements"],
              (old: AchievementProgress[] | undefined) =>
                old?.map((p) =>
                  p.achievementId === achievement.id
                    ? { ...p, claimed: true }
                    : p,
                ),
            );
            // Belt-and-suspenders invalidation (hook also invalidates these).
            queryClient.invalidateQueries({ queryKey: ["playerAchievements"] });
            queryClient.invalidateQueries({ queryKey: ["callerDokaBalance"] });
            // Fix overwrite bug: add granted to current balance, not replace.
            onDokaBalanceChange(dokaBalance + granted);
            toast.success(`🏆 Claimed ${granted.toLocaleString()} Doka!`);
          } else if ("err" in result) {
            console.log(
              "[FEATS] CLAIM: #err message =",
              result.err,
              "for",
              achievement.id,
            );
            // Backend rejected the claim (e.g. "Achievement not yet unlocked"
            // or "already claimed"). Undo any optimistic claimed=true flip so
            // the row reflects the real backend state, then refetch.
            rollbackClaimed(achievement.id);
            toast.error(`Failed to claim reward: ${result.err}`);
          }
        },
        onError: (error) => {
          // Transport-level failure (replica down, timeout, etc.). The mutation
          // never reached a definitive #ok/#err, so we cannot trust any
          // optimistic state. Roll back and refetch the authoritative state.
          rollbackClaimed(achievement.id);
          const msg = error instanceof Error ? error.message : "Network error";
          toast.error(`Failed to claim reward: ${msg}`);
        },
      });
    },
    [claimMut, onDokaBalanceChange, queryClient, dokaBalance, rollbackClaimed],
  );

  const activeConfigs = useMemo(
    () => configs.filter((cfg) => cfg.active),
    [configs],
  );

  if (!isOpen) return null;

  return (
    <div
      data-ocid="achievements.dialog"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose?.();
      }}
      aria-modal="true"
      aria-label="Achievements"
    >
      <div
        className="stone-frame"
        style={{
          width: "min(520px, 94vw)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="stone-header flex items-center justify-between px-5 py-3 shrink-0">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={18} style={{ color: "#f0c44a" }} />
            <span className="stone-header-title" style={{ fontSize: 16 }}>
              Feats
            </span>
          </div>
          <button
            type="button"
            data-ocid="achievements.close_button"
            onClick={onClose}
            aria-label="Close achievements"
            className="stone-btn-slate"
            style={{
              width: 30,
              height: 30,
              padding: 0,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          className="stone-well"
          style={{ overflowY: "auto", flex: 1, padding: 2 }}
        >
          {(configsLoading || progressLoading) && (
            <div
              data-ocid="achievements.loading_state"
              className="stone-well"
              style={{
                padding: 32,
                textAlign: "center",
                color: "#8a8090",
                fontSize: 13,
              }}
            >
              Loading achievements…
            </div>
          )}

          {!configsLoading &&
            !progressLoading &&
            activeConfigs.length === 0 && (
              <div
                data-ocid="achievements.empty_state"
                className="stone-well"
                style={{
                  padding: 32,
                  textAlign: "center",
                  color: "#8a8090",
                  fontSize: 13,
                }}
              >
                No achievements configured yet
              </div>
            )}

          {!configsLoading &&
            !progressLoading &&
            activeConfigs.map((cfg, i) => {
              const p = getProgress(cfg.id);
              const unlocked = p?.unlocked ?? false;
              const claimed = p?.claimed ?? false;
              console.log(
                "[FEATS] LIST: achievement",
                cfg.id,
                "claimed =",
                p?.claimed,
                "(unlocked =",
                p?.unlocked,
                ")",
              );
              if (claimed) {
                console.log(
                  "[FEATS] LIST: claimed-row render conditional TRUE for",
                  cfg.id,
                );
              }

              return (
                <div
                  key={cfg.id}
                  data-ocid={`achievements.item.${i + 1}`}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(139,0,0,0.15)",
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
                        color: unlocked ? "#f0c44a" : "#8a8090",
                        fontWeight: 700,
                        fontSize: 12,
                        marginBottom: 2,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {cfg.name}
                    </div>
                    <div
                      style={{
                        color: "#6a7a8a",
                        fontSize: 11,
                        lineHeight: 1.4,
                        marginBottom: 4,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {cfg.description}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#f0c44a",
                        fontWeight: 700,
                        fontFamily: "var(--font-display)",
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
                      className="stone-btn-crimson"
                      style={{
                        fontSize: 10,
                        padding: "4px 10px",
                        borderRadius: 6,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
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
                      className="stone-pill stone-pill-green"
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      Claimed
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPanel;
