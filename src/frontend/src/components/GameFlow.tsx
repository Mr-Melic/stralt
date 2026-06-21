import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Crown, LogOut, Trophy } from "lucide-react";
import React from "react";
import { useCallback, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetLeaderboard } from "../hooks/useLeaderboardQueries";
import type {
  ActiveEffect,
  BattleLogEntry,
  Character,
  UserProfile,
} from "../types/gameTypes";
import AchievementsPanel from "./AchievementsPanel";
import BossGuideModal from "./BossGuideModal";
import CharacterCreation from "./CharacterCreation";
import CharacterSelection from "./CharacterSelection";
import ChatPanel from "./ChatPanel";
import type { BattleRecapData } from "./PostBattleRecap";
import WorldExploration from "./WorldExploration";

type GameStage = "selection" | "character" | "world";

interface GameFlowProps {
  userProfile: UserProfile;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
  onShowBattleSummary?: (data: BattleRecapData) => void;
}

const GameFlow: React.FC<GameFlowProps> = ({
  userProfile,
  isAdmin,
  onOpenAdmin,
  onShowBattleSummary,
}) => {
  const [currentStage, setCurrentStage] = useState<GameStage>("selection");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<number>(1);
  const [dungeonData, setDungeonData] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Battle log state — lifted here so both WorldExploration and ChatPanel share it
  const [battleLogEntries, setBattleLogEntries] = useState<BattleLogEntry[]>(
    [],
  );
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [isInBattle, setIsInBattle] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showBossGuide, setShowBossGuide] = useState(false);
  const [dokaBalance, setDokaBalance] = useState(0);

  const addBattleLogEntry = useCallback((entry: BattleLogEntry) => {
    // E3: Cap battle log at 500 entries to prevent unbounded growth and lag.
    // .slice(-500) keeps only the newest 500 entries after adding the new one.
    setBattleLogEntries((prev) => {
      const next = [...prev, entry];
      return next.length > 500 ? next.slice(-500) : next;
    });
  }, []);

  const clearBattleLog = useCallback(() => {
    setBattleLogEntries([]);
    setActiveEffects([]);
  }, []);

  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const addDebugLog = useCallback((event: string, detail: string) => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    setDebugLogs((prev) => [
      ...prev.slice(-199),
      `[${time}] ${event}: ${detail}`,
    ]);
  }, []);

  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleCreateCharacter = (slot: number) => {
    setEditingSlot(slot);
    setSelectedCharacter(null);
    setCurrentStage("character");
  };

  const handleEditCharacter = (slot: number, character: Character) => {
    setEditingSlot(slot);
    setSelectedCharacter(character);
    setCurrentStage("character");
  };

  const handlePlayCharacter = (character: Character, slot: number) => {
    setSelectedCharacter(character);
    setActiveSlot(slot);
    setCurrentStage("world");
  };

  const handleCharacterComplete = (character: Character | null) => {
    if (!character) {
      // Cancel pressed — go back to character selection without entering game
      handleBackToSelection();
      return;
    }
    // Save finished — go back to selection so the refreshed slot list is shown
    // The player selects "Play" from there to enter the world
    handleBackToSelection();
  };

  const _handleDungeonComplete = (dungeon: Record<string, unknown>) => {
    setDungeonData(dungeon);
    setCurrentStage("world");
  };

  const handleBackToSelection = () => {
    setCurrentStage("selection");
    setSelectedCharacter(null);
    setEditingSlot(null);
    setDungeonData(null);
  };

  const showBackButton =
    currentStage !== "selection" && currentStage !== "world";
  const isGameMode = currentStage === "world";

  // Game mode: pass through to WorldExploration directly (it handles its own layout)
  if (isGameMode && selectedCharacter !== null) {
    return (
      <>
        <WorldExploration
          character={selectedCharacter}
          dungeon={dungeonData}
          characterSlot={activeSlot}
          addBattleLogEntry={addBattleLogEntry}
          onBattleEnd={clearBattleLog}
          onActiveEffectsChange={setActiveEffects}
          onInBattleChange={setIsInBattle}
          onTransitionChange={setIsTransitioning}
          userId={String(userProfile.id ?? userProfile.name ?? "guest")}
          onDebugLog={addDebugLog}
          onShowBattleSummary={onShowBattleSummary}
        />
        <ChatPanel
          playerName={userProfile.name}
          battleLogEntries={battleLogEntries}
          onClearBattleLog={clearBattleLog}
          activeEffects={activeEffects}
          isPaused={isInBattle || isTransitioning}
          userId={String(userProfile.id ?? userProfile.name ?? "guest")}
          debugLogs={debugLogs}
        />
        {/* Unified top bar in game mode */}
        <div className="fixed top-0 left-0 right-0 z-[9000] stone-top-bar flex items-center justify-between gap-2 px-4 h-12">
          {/* Left side: player chip, map pill, XP bar, Blood bar, Doka coin, shop icon, Zone tag */}
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold"
              style={{ color: "#f0c44a", fontFamily: "var(--font-display)" }}
            >
              🧛 {userProfile.name}
            </span>
            <span className="stone-pill stone-pill-blue text-[10px]">Map</span>
            <div className="w-20 h-1.5 stone-inset rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: "60%" }}
              />
            </div>
            <div className="w-20 h-1.5 stone-inset rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: "80%" }}
              />
            </div>
            <div className="flex items-center gap-1">
              <div className="stone-coin w-5 h-5 text-[9px]" />
              <span className="text-xs font-bold" style={{ color: "#f0c44a" }}>
                {dokaBalance}
              </span>
            </div>
            <span className="stone-pill stone-pill-gold text-[10px]">🛒</span>
            <span className="stone-pill stone-pill-crimson text-[10px]">
              Zone
            </span>
          </div>

          {/* Right side: nav buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="game.leaderboard_button"
              onClick={() => setShowLeaderboard((v) => !v)}
              className={`${showLeaderboard ? "stone-btn-crimson" : "stone-btn-slate"} stone-nav-btn`}
            >
              <Trophy size={13} />
              <span>Board</span>
            </button>
            <button
              type="button"
              data-ocid="game.achievements_button"
              onClick={() => setShowAchievements((v) => !v)}
              className={`${showAchievements ? "stone-btn-crimson" : "stone-btn-slate"} stone-nav-btn`}
            >
              <span className="text-[13px]">🏆</span>
              <span>Feats</span>
            </button>
            <button
              type="button"
              data-ocid="game.boss_guide_button"
              onClick={() => setShowBossGuide((v) => !v)}
              className={`${showBossGuide ? "stone-btn-crimson" : "stone-btn-slate"} stone-nav-btn`}
            >
              <Crown size={13} />
              <span>Bosses</span>
            </button>
            {isAdmin && onOpenAdmin && (
              <button
                type="button"
                data-ocid="game.admin_button"
                onClick={onOpenAdmin}
                className="stone-btn-crimson stone-nav-btn"
              >
                <span className="text-[13px]">🛡️</span>
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Boss Guide modal */}
        {showBossGuide && (
          <BossGuideModal onClose={() => setShowBossGuide(false)} open />
        )}

        {/* Leaderboard modal */}
        {showLeaderboard && (
          <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
        )}

        {/* Achievements panel */}
        <AchievementsPanel
          userId={String(userProfile.id ?? userProfile.name ?? "guest")}
          dokaBalance={dokaBalance}
          onDokaBalanceChange={setDokaBalance}
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />
      </>
    );
  }

  // Non-game stages: show header with navigation
  const renderCurrentStage = () => {
    switch (currentStage) {
      case "selection":
        return (
          <CharacterSelection
            userProfile={userProfile}
            onCreateCharacter={handleCreateCharacter}
            onEditCharacter={handleEditCharacter}
            onPlayCharacter={handlePlayCharacter}
          />
        );
      case "character":
        return (
          <CharacterCreation
            onComplete={handleCharacterComplete}
            editingSlot={editingSlot}
            existingCharacter={selectedCharacter}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ zIndex: 10, background: "#0d0f1a" }}
    >
      {/* Carved-stone top bar */}
      <header className="stone-top-bar flex items-center justify-between gap-2 px-4 h-12 shrink-0 z-30">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBackToSelection}
              className="stone-btn-slate stone-nav-btn"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
          <div>
            <h1
              className="text-sm font-bold"
              style={{
                color: "#f0c44a",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.05em",
              }}
            >
              Paper Baby Vampires
            </h1>
            <p className="text-xs" style={{ color: "#8a8090" }}>
              Welcome,{" "}
              <span style={{ color: "#d8463f" }}>{userProfile.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-xs">
            {(["character"] as const).map((stage, i) => (
              <React.Fragment key={stage}>
                {i > 0 && (
                  <div
                    className="w-3 h-px"
                    style={{ background: "rgba(216,70,63,.3)" }}
                  />
                )}
                <span
                  className={`px-2 py-1 rounded text-xs ${currentStage === stage ? "stone-pill-gold" : "stone-pill text-[#8a8090]"}`}
                >
                  {stage === "character" ? "Character" : "Dungeon"}
                </span>
              </React.Fragment>
            ))}
          </div>
          {isAdmin && onOpenAdmin && (
            <button
              type="button"
              data-ocid="game.admin_button"
              onClick={onOpenAdmin}
              className="stone-btn-crimson stone-nav-btn"
            >
              <span className="text-[12px]">🛡️</span>
              <span>Admin</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="stone-btn-slate stone-nav-btn"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto stone-well">
        {renderCurrentStage()}
      </main>
    </div>
  );
};

// ─── Helpers ────────────────────────────────────────────────────────────────

// ─── Leaderboard Modal ───────────────────────────────────────────────────────

const LeaderboardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: entries = [], isLoading } = useGetLeaderboard();

  return (
    <div
      data-ocid="leaderboard.dialog"
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
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (
          (e.key === "Enter" || e.key === " ") &&
          e.target === e.currentTarget
        )
          onClose();
      }}
      role="presentation"
    >
      <div
        className="stone-frame"
        style={{
          width: "min(640px, 94vw)",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="stone-header flex items-center justify-between px-5 py-3 shrink-0">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Trophy size={18} style={{ color: "#d8463f" }} />
            <span className="stone-header-title" style={{ fontSize: 16 }}>
              Leaderboard
            </span>
          </div>
          <button
            type="button"
            data-ocid="leaderboard.close_button"
            onClick={onClose}
            aria-label="Close leaderboard"
            className="stone-btn-slate"
            style={{
              width: 30,
              height: 30,
              padding: 0,
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          className="stone-well"
          style={{ overflowY: "auto", flex: 1, padding: 2 }}
        >
          {isLoading && (
            <div
              data-ocid="leaderboard.loading_state"
              className="stone-well"
              style={{
                padding: 32,
                textAlign: "center",
                color: "#8a8090",
                fontSize: 13,
              }}
            >
              Loading rankings…
            </div>
          )}

          {!isLoading && entries.length === 0 && (
            <div
              data-ocid="leaderboard.empty_state"
              className="stone-well"
              style={{
                padding: 32,
                textAlign: "center",
                color: "#8a8090",
                fontSize: 13,
              }}
            >
              No players on the board yet — defeat some enemies to appear here!
            </div>
          )}

          {!isLoading && entries.length > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(139,0,0,0.25)",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  {(
                    ["Rank", "Name", "Level", "Kills", "Achievements"] as const
                  ).map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "9px 14px",
                        color: "#dc2626",
                        fontWeight: 700,
                        textAlign:
                          col === "Rank" ||
                          col === "Level" ||
                          col === "Kills" ||
                          col === "Achievements"
                            ? "right"
                            : "left",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontSize: 10,
                        borderBottom: "1px solid rgba(139,0,0,0.3)",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 50).map((entry, i) => (
                  <tr
                    key={entry.principalId}
                    data-ocid={`leaderboard.item.${i + 1}`}
                    style={{
                      borderBottom: "1px solid rgba(139,0,0,0.12)",
                      background:
                        i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "8px 14px",
                        color: rankColor(i),
                        fontWeight: 700,
                        textAlign: "right",
                        minWidth: 48,
                      }}
                    >
                      {rankLabel(i)}
                    </td>
                    <td
                      style={{
                        padding: "8px 14px",
                        color: "#f5c6c6",
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.playerName || "Unknown"}
                    </td>
                    <td
                      style={{
                        padding: "8px 14px",
                        color: "#a8d4f0",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {entry.level.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "8px 14px",
                        color: "#dc2626",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {entry.killCount.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "8px 14px",
                        color: "#f0c040",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {entry.achievementsCompleted.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          className="stone-well"
          style={{
            padding: "8px 20px",
            color: "#8a8090",
            fontSize: 10,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          Showing top {Math.min(entries.length, 50)} players · Refreshes every
          30s
        </div>
      </div>
    </div>
  );
};

function rankColor(i: number): string {
  if (i === 0) return "#ffd700";
  if (i === 1) return "#c0c0c0";
  if (i === 2) return "#cd7f32";
  return "#5a3a3a";
}

function rankLabel(i: number): string {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return `#${i + 1}`;
}
export default GameFlow;
