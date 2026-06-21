import { ChevronDown, ChevronUp, MessageSquare, Send } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../backend.d";
import { useActor } from "../hooks/useActor";
import type { ActiveEffect, BattleLogEntry } from "../types/gameTypes";
import DraggablePanel from "./DraggablePanel";

// Palette of 12 bright colors — excludes #7ec8e3 (self/light-blue)
const CHAT_COLORS = [
  "#e74c3c",
  "#e67e22",
  "#f1c40f",
  "#2ecc71",
  "#1abc9c",
  "#9b59b6",
  "#e91e63",
  "#ff5722",
  "#00bcd4",
  "#8bc34a",
  "#ff9800",
  "#673ab7",
] as const;

const SELF_COLOR = "#7ec8e3";

function randomColor(): string {
  return CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)];
}

function formatTime(tsMs: bigint): string {
  const d = new Date(Number(tsMs));
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

type Channel = "general" | "battlelog" | "status" | "debug";

interface ChatPanelProps {
  playerName: string;
  battleLogEntries?: BattleLogEntry[];
  onClearBattleLog?: () => void;
  userId?: string;
  activeEffects?: ActiveEffect[];
  /** When true, suspends the message polling interval (e.g. during battle or map transition) */
  isPaused?: boolean;
  debugLogs?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorAny = Record<string, any>;

/**
 * Renders a battle log line with inline resistance-breakdown tokens highlighted.
 * Tokens enclosed in |[...]| are rendered in muted blue/grey to show absorbed damage.
 * Remaining text is rendered in the entry's accent color.
 */
const BattleLogText: React.FC<{ text: string; color: string }> = ({
  text,
  color,
}) => {
  // Pattern: |[...]| marks resistance breakdown segments
  const TOKEN_RE = /\|\[([^\]]+)\]\|/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let idx = 0;
  TOKEN_RE.lastIndex = 0;
  match = TOKEN_RE.exec(text);
  while (match !== null) {
    if (match.index > last) {
      parts.push(
        <span key={idx++} style={{ color, fontWeight: 600 }}>
          {text.slice(last, match.index)}
        </span>,
      );
    }
    parts.push(
      <span
        key={idx++}
        style={{
          color: "#7fb3d3",
          fontWeight: 700,
          background: "rgba(100,160,200,0.12)",
          borderRadius: 3,
          padding: "0 3px",
          fontSize: 10,
          letterSpacing: "0.03em",
        }}
      >
        ↓{match[1]}
      </span>,
    );
    last = match.index + match[0].length;
    match = TOKEN_RE.exec(text);
  }
  if (last < text.length) {
    parts.push(
      <span key={idx++} style={{ color, fontWeight: 600 }}>
        {text.slice(last)}
      </span>,
    );
  }
  if (parts.length === 0) {
    return <span style={{ color, fontWeight: 600 }}>{text}</span>;
  }
  return <>{parts}</>;
};

const ChatPanel: React.FC<ChatPanelProps> = ({
  playerName,
  battleLogEntries = [],
  onClearBattleLog,
  userId,
  activeEffects = [],
  isPaused = false,
  debugLogs = [],
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeChannel, setActiveChannel] = useState<Channel>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [unreadGeneral, setUnreadGeneral] = useState(0);
  const [unreadBattleLog, setUnreadBattleLog] = useState(0);
  const [unreadStatus, setUnreadStatus] = useState(0);
  const [myColor] = useState<string>(randomColor);
  const [isSending, setIsSending] = useState(false);

  const lastSeenIdRef = useRef<bigint>(0n);
  const lastSeenBattleLogCount = useRef<number>(0);
  const lastSeenStatusCountRef = useRef<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { actor } = useActor();

  // Track unread status effects
  useEffect(() => {
    const newCount = activeEffects.length;
    if (newCount > lastSeenStatusCountRef.current) {
      if (!expanded || activeChannel !== "status") {
        setUnreadStatus(
          (prev) => prev + (newCount - lastSeenStatusCountRef.current),
        );
      } else {
        lastSeenStatusCountRef.current = newCount;
      }
    }
    if (newCount < lastSeenStatusCountRef.current) {
      lastSeenStatusCountRef.current = 0;
      setUnreadStatus(0);
    }
  }, [activeEffects.length, expanded, activeChannel]);

  // Track unread battle log entries
  useEffect(() => {
    const newCount = battleLogEntries.length;
    if (newCount > lastSeenBattleLogCount.current) {
      if (!expanded || activeChannel !== "battlelog") {
        setUnreadBattleLog(
          (prev) => prev + (newCount - lastSeenBattleLogCount.current),
        );
      } else {
        lastSeenBattleLogCount.current = newCount;
      }
    }
    if (newCount < lastSeenBattleLogCount.current) {
      lastSeenBattleLogCount.current = 0;
      setUnreadBattleLog(0);
    }
  }, [battleLogEntries.length, expanded, activeChannel]);

  const fetchMessages = useCallback(async () => {
    if (!actor) return;
    // M4: 5-second timeout prevents slow responses from cascading into queued requests
    let didTimeout = false;
    const timeoutId = setTimeout(() => {
      didTimeout = true;
    }, 5000);
    try {
      const raw = await Promise.race([
        (actor as ActorAny).getMessages(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("chat poll timed out")), 5000),
        ),
      ]);
      clearTimeout(timeoutId);
      if (!Array.isArray(raw)) return;
      setMessages(raw as ChatMessage[]);
      if (!expanded || activeChannel !== "general") {
        const newMsgs = (raw as ChatMessage[]).filter(
          (m) => m.id > lastSeenIdRef.current,
        );
        if (newMsgs.length > 0) {
          setUnreadGeneral((prev) => prev + newMsgs.length);
        }
      }
      if (raw.length > 0) {
        lastSeenIdRef.current = (raw as ChatMessage[]).reduce(
          (max, m) => (m.id > max ? m.id : max),
          lastSeenIdRef.current,
        );
      }
    } catch {
      clearTimeout(timeoutId);
      if (didTimeout) return; // skip silently on timeout
      // Silently ignore other errors
    }
  }, [actor, expanded, activeChannel]);

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // C6: Track browser tab visibility so polling stops immediately when hidden.
  const tabVisibleRef = useRef(!document.hidden);
  useEffect(() => {
    const onVisibility = () => {
      tabVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    // LEAK-12: Only start polling when not paused. When isPaused flips true
    // the interval is cleared; when it flips false a new one is created.
    // This prevents the interval from running during map transitions or battles.
    // FIX C2: Also guard INSIDE the callback with isPausedRef to prevent a stale
    // closure from the previous interval firing once after the dependency changes.
    // C6: Also skip when tab is hidden to avoid stale request bursts on resume.
    if (isPaused) return;
    fetchMessages();
    const id = setInterval(() => {
      if (isPausedRef.current) return; // stale-closure guard
      if (!tabVisibleRef.current) return; // C6: skip while tab is backgrounded
      fetchMessages();
    }, 2000);
    return () => clearInterval(id);
  }, [fetchMessages, isPaused]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: length is the relevant trigger
  useEffect(() => {
    if (expanded && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [
    messages.length,
    battleLogEntries.length,
    activeEffects.length,
    expanded,
    activeChannel,
  ]);

  useEffect(() => {
    if (expanded) {
      if (activeChannel === "general") {
        setUnreadGeneral(0);
        lastSeenIdRef.current = messages.reduce(
          (max, m) => (m.id > max ? m.id : max),
          lastSeenIdRef.current,
        );
      } else if (activeChannel === "battlelog") {
        setUnreadBattleLog(0);
        lastSeenBattleLogCount.current = battleLogEntries.length;
      } else if (activeChannel === "status") {
        setUnreadStatus(0);
        lastSeenStatusCountRef.current = activeEffects.length;
      }
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [
    expanded,
    activeChannel,
    messages,
    battleLogEntries.length,
    activeEffects.length,
  ]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !actor || isSending) return;
    setIsSending(true);
    setInputText("");
    try {
      await (actor as ActorAny).sendMessage(playerName, text, myColor);
      await fetchMessages();
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  }, [inputText, actor, isSending, playerName, myColor, fetchMessages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const toggleExpanded = () => setExpanded((v) => !v);
  const totalUnread = unreadGeneral + unreadBattleLog + unreadStatus;

  // Status tab content renderer
  const renderStatusContent = () => {
    if (activeEffects.length === 0) {
      return (
        <div
          data-ocid="chat.status.empty_state"
          style={{
            color: "rgba(200,140,140,0.4)",
            fontSize: 11,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          No active battle effects.
        </div>
      );
    }
    const playerEffects = activeEffects.filter((e) => e.targetId === "player");
    const enemyMap: Record<string, ActiveEffect[]> = {};
    for (const eff of activeEffects) {
      if (eff.targetId !== "player") {
        if (!enemyMap[eff.targetId]) enemyMap[eff.targetId] = [];
        enemyMap[eff.targetId].push(eff);
      }
    }
    const effColor = (type: ActiveEffect["type"]) =>
      type === "buff" ? "#22c55e" : type === "dot" ? "#f97316" : "#ef4444";
    const renderEff = (eff: ActiveEffect) => (
      <div
        key={eff.id}
        data-ocid="chat.status.effect_entry"
        style={{
          fontSize: 11,
          lineHeight: 1.5,
          marginBottom: 3,
          paddingLeft: 8,
        }}
      >
        <span style={{ marginRight: 4 }}>{eff.iconEmoji}</span>
        <span style={{ color: effColor(eff.type), fontWeight: 700 }}>
          {eff.effectName}
        </span>
        <span style={{ color: "rgba(200,190,200,0.7)" }}>
          {" "}
          — {eff.description}
        </span>
        <span style={{ color: "rgba(160,160,170,0.6)", fontSize: 10 }}>
          {" "}
          ({eff.duration}t)
        </span>
      </div>
    );
    return (
      <>
        {playerEffects.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                color: "#7ec8e3",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              YOU
            </div>
            {playerEffects.map(renderEff)}
          </div>
        )}
        {Object.entries(enemyMap).map(([enemyId, effs]) => (
          <div key={enemyId} style={{ marginBottom: 8 }}>
            <div
              style={{
                color: "#ef4444",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              ENEMY {enemyId.slice(-4).toUpperCase()}
            </div>
            {effs.map(renderEff)}
          </div>
        ))}
      </>
    );
  };

  return (
    <DraggablePanel
      panelId="chat-panel"
      title="Chat"
      userId={userId}
      defaultPosition={{
        x: Math.max(0, window.innerWidth - 330),
        y: Math.max(0, window.innerHeight - 420),
      }}
      defaultFolded={false}
      zIndex={9000}
      style={{ width: 300 }}
    >
      <div
        data-ocid="chat.panel"
        className="stone-frame"
        style={{
          width: 300,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          className="stone-well"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {/* Header — single bar, toggles open/close, tabs inline when expanded */}
          <button
            type="button"
            data-ocid="chat.toggle"
            onClick={toggleExpanded}
            className="stone-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "8px 12px",
              cursor: "pointer",
              border: "none",
              width: "100%",
              textAlign: "left",
            }}
          >
            <MessageSquare
              size={15}
              style={{ color: "#d8463f", flexShrink: 0 }}
            />
            <span
              className="stone-header-title"
              style={{ fontSize: 12, letterSpacing: "0.08em", flexShrink: 0 }}
            >
              Chat
            </span>

            {expanded && (
              <div
                className="flex flex-nowrap"
                style={{ gap: 2, flex: 1, overflow: "hidden" }}
              >
                {(
                  [
                    ["general", "General", unreadGeneral],
                    ["battlelog", "Battle Log", unreadBattleLog],
                    ["status", "Status", unreadStatus],
                    ["debug", "Debug", 0],
                  ] as const
                ).map(([key, label, unread]) => {
                  const isActive = activeChannel === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      data-ocid={`chat.tab.${key}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChannel(key);
                      }}
                      className={`flex items-center justify-center gap-1 py-1 px-2 text-[9px] font-semibold uppercase tracking-wider border-0 rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "text-[#d8463f] font-bold"
                          : "text-[#8a8090] hover:text-[#cdbfd2]"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {label}
                      {unread > 0 && !isActive && (
                        <span
                          className="inline-flex items-center justify-center rounded-full text-white text-[9px] font-bold min-w-[14px] h-[14px] px-[3px]"
                          style={{
                            background:
                              key === "status" ? "#c79cff" : "#d8463f",
                          }}
                        >
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <span style={{ marginLeft: "auto", flexShrink: 0 }}>
              {totalUnread > 0 && !expanded && (
                <span
                  data-ocid="chat.unread_badge"
                  className="stone-pill stone-pill-crimson"
                  style={{
                    minWidth: 18,
                    height: 18,
                    padding: "0 4px",
                    marginRight: 4,
                    fontSize: 10,
                  }}
                >
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
              {expanded ? (
                <ChevronDown size={14} style={{ color: "#d8463f" }} />
              ) : (
                <ChevronUp size={14} style={{ color: "#d8463f" }} />
              )}
            </span>
          </button>

          {expanded && (
            <>
              {/* Message list */}
              <div
                ref={listRef}
                data-ocid="chat.message_list"
                className="dofus-scrollbar"
                style={{
                  height: 280,
                  overflowY: "auto",
                  padding: "8px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {activeChannel === "general" &&
                  (messages.length === 0 ? (
                    <div
                      data-ocid="chat.general.empty_state"
                      className="text-muted-foreground"
                      style={{
                        fontSize: 11,
                        textAlign: "center",
                        marginTop: 16,
                        opacity: 0.5,
                      }}
                    >
                      No messages yet. Say something!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSelf = msg.playerName === playerName;
                      return (
                        <div
                          key={String(msg.id)}
                          style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            wordBreak: "break-word",
                          }}
                        >
                          <span
                            style={{
                              color: "rgba(160,160,170,0.7)",
                              fontSize: 10,
                              marginRight: 5,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            [{formatTime(msg.timestampMs)}]
                          </span>
                          <span
                            style={{
                              color: isSelf ? SELF_COLOR : msg.colorHex,
                              fontWeight: 600,
                              marginRight: 4,
                            }}
                          >
                            {msg.playerName}:
                          </span>
                          <span
                            style={{
                              color: isSelf
                                ? "#d0f0ff"
                                : "rgba(235,235,245,0.88)",
                            }}
                          >
                            {msg.text}
                          </span>
                        </div>
                      );
                    })
                  ))}
                {activeChannel === "battlelog" &&
                  (battleLogEntries.length === 0 ? (
                    <div
                      data-ocid="chat.battlelog.empty_state"
                      className="text-muted-foreground"
                      style={{
                        fontSize: 11,
                        textAlign: "center",
                        marginTop: 16,
                        opacity: 0.5,
                      }}
                    >
                      No battle actions yet.
                    </div>
                  ) : (
                    battleLogEntries.map((entry) => (
                      <div
                        key={entry.id}
                        data-ocid="chat.battlelog.entry"
                        style={{
                          fontSize: 11,
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                        }}
                      >
                        <span
                          style={{
                            color: "rgba(160,160,170,0.6)",
                            fontSize: 10,
                            marginRight: 5,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          [{entry.timestamp}]
                        </span>
                        <BattleLogText text={entry.text} color={entry.color} />
                      </div>
                    ))
                  ))}
                {activeChannel === "status" && renderStatusContent()}
                {activeChannel === "debug" && (
                  <div
                    style={{
                      padding: "8px",
                      color: "#aaa",
                      fontFamily: "monospace",
                      fontSize: "11px",
                      overflowY: "auto",
                      height: "100%",
                    }}
                  >
                    {!debugLogs || debugLogs.length === 0 ? (
                      <div
                        className="text-muted-foreground"
                        style={{
                          textAlign: "center",
                          marginTop: 20,
                          opacity: 0.5,
                        }}
                      >
                        No debug events yet.
                      </div>
                    ) : (
                      <div>
                        {debugLogs
                          .slice()
                          .reverse()
                          .map((log) => (
                            <div
                              key={log}
                              style={{
                                padding: "2px 4px",
                                borderBottom: "1px solid #222",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                              }}
                            >
                              {log}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {activeChannel === "general" ? (
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    padding: "8px 10px",
                    borderTop: "1px solid rgba(216,70,63,0.3)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <input
                    ref={inputRef}
                    data-ocid="chat.input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Say something..."
                    maxLength={200}
                    className="stone-inset"
                    style={{
                      flex: 1,
                      fontSize: 12,
                      padding: "5px 8px",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                  <button
                    type="button"
                    data-ocid="chat.send_button"
                    onClick={handleSend}
                    disabled={!inputText.trim() || isSending}
                    className="stone-btn-crimson"
                    style={{
                      width: 32,
                      height: 32,
                      padding: 0,
                      flexShrink: 0,
                      opacity: inputText.trim() && !isSending ? 1 : 0.4,
                      cursor:
                        inputText.trim() && !isSending
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    <Send size={14} />
                  </button>
                </div>
              ) : activeChannel === "battlelog" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderTop: "1px solid rgba(216,70,63,0.3)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <span
                    className="text-muted-foreground"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.04em",
                      opacity: 0.5,
                    }}
                  >
                    {battleLogEntries.length} actions
                  </span>
                  <button
                    type="button"
                    data-ocid="chat.battlelog.clear_button"
                    onClick={() => onClearBattleLog?.()}
                    className="stone-btn-slate"
                    style={{
                      fontSize: 10,
                      padding: "3px 10px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Clear log
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    borderTop: "1px solid rgba(199,156,255,0.3)",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <span
                    className="text-muted-foreground"
                    style={{ fontSize: 10, opacity: 0.5 }}
                  >
                    {activeEffects.length} active effect
                    {activeEffects.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DraggablePanel>
  );
};

export default ChatPanel;
