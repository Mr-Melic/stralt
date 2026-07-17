import { Pencil, RotateCcw, ShoppingCart } from "lucide-react";
import { Component } from "react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { useIsMobile } from "../hooks/use-mobile";

import { useActor } from "../hooks/useActor";
import {
  useGetAchievementConfigs,
  useGetEnemyNames,
  useGetGameConfig,
  useGetMapModifiers,
  useGetPlayerAchievements,
  useGetRegionConfigs,
  useGetSpellConfigs,
  useMarkAchievementUnlocked,
} from "../hooks/useQueries";
import { playSound } from "../hooks/useSoundHooks";
import { DEFAULT_LEVELUP_CONFIG } from "../types/gameTypes";
import type { EnemyFamily } from "../types/gameTypes";
import type {
  AchievementConfig,
  ActiveEffect,
  AdminGameConfig,
  BattleLogEntry,
  ChessPieceType,
  DokaLootItem,
  Enemy,
  SpellConfig,
} from "../types/gameTypes";
import AchievementToast from "./AchievementToast";
import AchievementsPanel from "./AchievementsPanel";
import BattleUIPanel from "./BattleUIPanel";
import BoostToggle from "./BoostToggle";
import DraggablePanel from "./DraggablePanel";
import EnemyRegister from "./EnemyRegister";
import GameOverModal from "./GameOverModal";
import type { CombatantEntry } from "./InitiativeStrip";
import MapModifiersPanel from "./MapModifiersPanel";
import PostBattleRecap from "./PostBattleRecap";
import type { BattleRecapData } from "./PostBattleRecap";

import {
  CHARACTER_Y_OFFSET,
  ENEMY_MOVE_INTERVAL_MAX,
  ENEMY_MOVE_INTERVAL_MIN,
  ENEMY_SUMMONER_CHANCE_BASE,
  ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE,
  MAX_ENEMIES,
  MAX_HAZARD_TILES,
  MOVEMENT_DURATION,
  TILE_HEIGHT,
  TILE_WIDTH,
  WORLD_GRID_SIZE,
} from "../data/gameConstants";
import {
  type CombatantEntity,
  chessPiecePatterns,
  drawCombatant,
  spawnPixelPuff,
} from "../data/pieceArt";
import { physicalAttackSpell, starterSpells } from "../data/spellData";
import { drawBarrierTower } from "../engine/barrierRender";
import {
  activeHostilesRemaining,
  despawnSummons,
  isAliveCombatant,
} from "../engine/battleSetup";
import {
  applyDamageToEnemy as applyDamageToEnemyHelper,
  getAoETargets as getAoETargetsHelper,
} from "../engine/castHelpers";
import {
  calcScaledDamage,
  computeAITier,
  computeEnemyStats,
  loadTierConfig,
  pickEnemyLevelFromTiers,
  seededRng,
} from "../engine/combatMath";
import {
  type CombatantStoreCtx,
  addCombatant,
  deriveBattleEnemies,
  dumpStateSync,
  getLiveCombatants,
  initCombatantStore,
  removeCombatant,
  resetCombatantStore,
  syncCombatants,
  updateCombatant,
} from "../engine/combatantStore";
import {
  type DotTickResult,
  appendDotStack,
  tickDotStacks,
} from "../engine/dotStacks";
import { EffectsManager } from "../engine/effects";
import {
  type AICell,
  type AICombatant,
  type DecideEnemyContext,
  type EnemyAction,
  decideEnemyAction,
  decideSummonAction,
  decideSummonerAction,
} from "../engine/enemyAI";
import {
  applyVoidTiles,
  checkVoidConnectivity,
  countWalkableVoid,
  ensureReachability,
  pickMapArchetype,
} from "../engine/mapGen";
import { MAP_MODIFIERS, mapModifierRegistry } from "../engine/mapModifiers";
import type { OccupancyContext } from "../engine/occupancy";
import {
  PROGRESSION_PORTAL_KIND,
  type RunMode,
  completeRun,
  getRunMode,
  isProgressionLocked,
  isProgressionPortalUnlocked,
  resetRunState,
  shouldSpawnWhitePortal,
  shouldSuppressPortal,
} from "../engine/portalRules";
import { getPlayerBaseStats } from "../engine/progression";
import {
  type PlayerSpellContextDeps,
  createPlayerSpellContext,
} from "../engine/spellContext";
import {
  type ActiveEffectLike,
  type PlayerCastEnemy,
  type PlayerCastResult,
  type PlayerCastTarget,
  type PlayerSpellContext,
  type Side,
  type SummonUnitDef,
  resolvePlayerCast,
} from "../engine/spellEngine";
import {
  type SummonExecutorHelpers,
  executeSummonAction,
} from "../engine/summonExecutor";
import {
  buildSpellContext,
  getPlayerSideTargets,
  resolveEnemyApMp,
  syncExpiredSummonsFromTurnQueue,
} from "../engine/summonIntegration";
import { applySummonResult, spawnSummonUnit } from "../engine/summonSpawn";
import {
  applyHealBuffSideEffect,
  computeTargetableTiles,
} from "../engine/targeting";
import {
  getCameraFollowSpeed,
  getSessionVersion,
  nowTimestamp,
} from "../engine/worldHelpers";
import { useBossAI } from "../hooks/useBossAI";
import { useBossRush } from "../hooks/useBossRush";
import {
  applyBossAbility,
  checkPhaseTransition,
  cleanupBossState,
  initBossState,
} from "../hooks/useBossSystem";
import { DEFAULT_BOSS_CONFIGS } from "../types/bossDefaults";
import type { BossConfig, BossState } from "../types/bossTypes";
import { BOSS_IDS } from "../types/bossTypes";
import { evaluateChallenges } from "../utils/battleFixes";
import {
  logDebugError,
  logDebugInfo,
  logDebugWarn,
} from "../utils/debugLogger";
import { RewardInput, resolveBattleRewards } from "../utils/rewardResolver";
import BuffShop from "./BuffShop";
import type { BuffItemType } from "./BuffShop";
import ChallengePanel, {
  type Challenge,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
} from "./ChallengePanel";
import type { ChallengePanelProgress } from "./ChallengePanel";
import SpellbookModal from "./SpellbookModal";
import StatusEffectBadge from "./StatusEffectBadge";
let _fbNameIdx = 0;
// Module-level divergence flag — warns ONCE per page load when persisted
// character ap/mp diverge from the canonical progression formula at battle
// start. Reset only on full reload (intentional: a single warn is enough).
let _progressionDivergenceWarned = false;

// ─── [CLICK] guard instrumentation (Part 4) ───────────────────────────────
// Map-keyed, time-based throttle: logs on first occurrence per key, then at
// most once per 1000ms per key. Modeled on pieceArt.ts's logPatternLookupFailed
// style but with a 1s time window instead of every-Nth. Routes through
// logDebugInfo so entries surface in the Shift+D debug overlay. PERMANENT
// (not dev-only) per spec — always visible in the overlay buffer.
const _clickGuardLastLog: Map<string, number> = new Map();
const _CLICK_THROTTLE_MS = 1000;
function logClickGuard(key: string, detail: Record<string, unknown>): void {
  const now = Date.now();
  const last = _clickGuardLastLog.get(key);
  if (last !== undefined && now - last < _CLICK_THROTTLE_MS) return;
  _clickGuardLastLog.set(key, now);
  logDebugInfo("BATTLE", `[CLICK] ${key}`, detail);
}

interface WorldExplorationProps {
  dokaBalance: number;
  onDokaBalanceChange: (val: number) => void;
  character: any;
  dungeon: any;
  characterSlot?: number;
  addBattleLogEntry?: (entry: BattleLogEntry) => void;
  onBattleEnd?: () => void;
  onActiveEffectsChange?: (effects: ActiveEffect[]) => void;
  onInBattleChange?: (inBattle: boolean) => void;
  onTransitionChange?: (isTransitioning: boolean) => void;
  userId?: string;
  onDebugLog?: (event: string, detail: string) => void;
  onShowBattleSummary?: (data: BattleRecapData) => void;
}

type TileType = "floor" | "wall" | "portal";
type ViewDirection = "front" | "back" | "left" | "right";
type HazardType =
  | "spike"
  | "poison"
  | "fire"
  | "ice"
  | "void"
  | "lava"
  | "spikes";
type PortalColor =
  | "blue"
  | "red"
  | "green"
  | "purple"
  | "gold"
  | "black"
  | "rest"
  | "boss"
  | "dungeon"
  | "bossRush"
  | "white"
  | "progression";
interface GameMap {
  id: string;
  tiles: TileType[][];
  width?: number;
  height?: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  portals: any[];
  levelZone: any;
  tilePatterns: any;
  colorFamily: any;
  wallPalette: any;
  isDeathRealm: boolean;
  isRestMap: boolean;
  hazardTiles: any;
  voidTiles: any;
}
interface LevelZone {
  id?: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  mapArchetype?: string;
}
interface PlayerPosition {
  x: number;
  y: number;
}
interface PathNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: PathNode;
}
export interface CharacterStats {
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  mp: number;
  maxMp: number;
  sp: number;
  sr: number;
  init: number;
  res: number;
  chc: number;
  fail: number;
  level: number;
  exp: number;
  expToNext: number;
}

const _CAMERA_DEADZONE = 30;
const _CAMERA_MAX_OFFSET = 150;
const CAMERA_SMOOTHING_FACTOR = 0.85;

const _ENEMY_MOVEMENT_RANGE = 3; // Maximum tiles an enemy can move in one action
const _ENEMY_MOVEMENT_SPEED = 800; // Duration of enemy movement animation

// Adaptive camera follow speed imported from ../engine/worldHelpers

// ── Tier-based enemy spawn system ─────────────────────────────────────────
// Tiers are `tierSize` levels wide. Player tier = floor((level-1)/tierSize).
// Weighted random: 60% same tier, 20% ±1 (10% each), 10% ±2 (5% each),
// 5% ±3+ (split evenly among remaining).
// Config is stored in localStorage (editable via admin panel).

// nowTimestamp imported from ../engine/worldHelpers

// getSessionVersion imported from ../engine/worldHelpers
const _incrementSessionVersion = (): number => {
  try {
    const v = getSessionVersion() + 1;
    localStorage.setItem("pbv_session_version", String(v));
    return v;
  } catch {
    return 0;
  }
};

// O10: Canvas Error Boundary — catches any render-loop JS errors so a crash
// never leaves the player on a black screen. Shows a recovery button instead.
class CanvasErrorBoundary extends Component<
  {
    children: React.ReactNode;
    onDebugLog?: (event: string, detail: string) => void;
  },
  {
    hasError: boolean;
    error: Error | null;
    componentStack: string;
    timestamp: string;
  }
> {
  constructor(props: {
    children: React.ReactNode;
    onDebugLog?: (event: string, detail: string) => void;
  }) {
    super(props);
    this.state = {
      hasError: false as boolean,
      error: null as Error | null,
      componentStack: "" as string,
      timestamp: "" as string,
    };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("[CanvasErrorBoundary] caught:", error);
    const msg = error instanceof Error ? error.message : String(error);
    this.props.onDebugLog?.("ERROR_BOUNDARY", msg);
    this.setState({
      componentStack: errorInfo.componentStack || "",
      timestamp: new Date().toISOString(),
    });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          data-ocid="canvas.error_state"
          style={{
            position: "fixed",
            inset: 0,
            background: "#0d0f1a",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 99999,
            padding: 24,
            overflow: "auto",
            fontFamily: "monospace",
          }}
        >
          <h2 style={{ color: "#ff4444", marginTop: 0 }}>
            Game Error — Please Report
          </h2>
          <pre
            style={{
              fontSize: 13,
              background: "#1a0020",
              padding: 12,
              borderRadius: 4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: "#ff4444",
              width: "100%",
              maxWidth: 800,
            }}
          >
            {String(this.state.error?.message ?? "Unknown error")}
          </pre>
          <div
            style={{
              marginBottom: 8,
              color: "#aaa",
              fontSize: 12,
              maxWidth: 800,
            }}
          >
            <strong>Time:</strong> {this.state.timestamp}
          </div>
          <div style={{ marginBottom: 8, maxWidth: 800, width: "100%" }}>
            <strong style={{ color: "#ff6666" }}>Component Stack:</strong>
            <pre
              style={{
                fontSize: 10,
                overflowX: "auto",
                maxHeight: 150,
                background: "#111",
                padding: 4,
                whiteSpace: "pre-wrap",
                color: "#ff8888",
                marginTop: 4,
              }}
            >
              {this.state.componentStack}
            </pre>
          </div>
          <pre
            style={{
              fontSize: 11,
              background: "#0a0010",
              padding: 12,
              borderRadius: 4,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: "#ff6666",
              marginTop: 8,
              width: "100%",
              maxWidth: 800,
            }}
          >
            {String(this.state.error?.stack ?? "")}
          </pre>
          <button
            type="button"
            onClick={() => {
              const report = [
                `Time: ${this.state.timestamp}`,
                `Error: ${this.state.error?.message ?? ""}`,
                `Stack: ${this.state.error?.stack ?? ""}`,
                `Component: ${this.state.componentStack}`,
              ].join("\n\n");
              navigator.clipboard?.writeText(report).catch(() => {});
            }}
            style={{
              marginTop: 12,
              padding: "6px 16px",
              background: "#8b0000",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Copy Debug Report
          </button>
          <button
            type="button"
            onClick={() => {
              this.setState({
                hasError: false,
                error: null,
                componentStack: "",
                timestamp: "",
              });
              window.location.reload();
            }}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              background: "#660020",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Reload Game
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const WorldExplorationInner: React.FC<WorldExplorationProps> = ({
  dokaBalance,
  onDokaBalanceChange,
  character,
  dungeon: _dungeon,
  characterSlot = 1,
  addBattleLogEntry,
  onBattleEnd,
  onActiveEffectsChange,
  onInBattleChange,
  onTransitionChange,
  userId,
  onDebugLog,
  onShowBattleSummary,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ActorAny = Record<string, any>;
  const { actor: rawActor } = useActor();
  const actor = rawActor as ActorAny | null;

  // M6: Per-character localStorage key helper — namespaced by userId + slot
  // so switching characters or principals never cross-pollutes saved state.
  const nsKey = useCallback(
    (base: string): string => {
      if (!userId) return base;
      return `${userId}_slot${characterSlot}_${base}`;
    },
    [userId, characterSlot],
  );
  // Mobile detection — used only to adjust zoom & camera on mobile
  const isMobile = useIsMobile();
  // Desktop detection — used for camera (static, no follow) and static tile layout
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 1024);
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    const flush = async () => {
      const queue = [...pendingSavesRef.current];
      pendingSavesRef.current = [];
      for (const fn of queue) {
        try {
          await fn();
        } catch (e) {
          console.warn("[PBV] Retry save failed:", e);
        }
      }
    };
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, []);
  // Backend config sync — load admin-configured settings from backend on mount
  useEffect(() => {
    if (!actor) {
      setTierConfigLoaded(true);
      return;
    }
    (async () => {
      try {
        const tierCfg = await (actor as any).getTierSpawnConfig?.();
        if (tierCfg) {
          localStorage.setItem(
            "pbv_tier_spawn_config",
            JSON.stringify(tierCfg),
          );
          const dtc = loadTierConfig();
          const merged: typeof dtc = {
            ...dtc,
            tierSize: Number(tierCfg.tierSize ?? dtc.tierSize),
            sameTierPercent: Number(
              tierCfg.sameTierPercent ?? dtc.sameTierPercent,
            ),
            adjacentTierPercent: Number(
              tierCfg.adjacentTierPercent ?? dtc.adjacentTierPercent,
            ),
            twoAwayPercent: Number(
              tierCfg.twoAwayPercent ?? dtc.twoAwayPercent,
            ),
            threeOrMorePercent: Number(
              tierCfg.threeOrMorePercent ?? dtc.threeOrMorePercent,
            ),
          };
          localStorage.setItem("pbv_tier_spawn_config", JSON.stringify(merged));
        }
        tierConfigRef.current = loadTierConfig();
      } catch (_e) {
        /* use localStorage fallback */
      }
      try {
        const palette = await (actor as any).getColorPalette?.();
        if (palette)
          localStorage.setItem(
            "pbv_color_palette",
            typeof palette === "string" ? palette : JSON.stringify(palette),
          );
      } catch (_e) {
        /* use localStorage fallback */
      }
      try {
        const brcfg = await (actor as any).getBossRushConfig?.();
        if (brcfg)
          localStorage.setItem("pbv_boss_rush_config", JSON.stringify(brcfg));
      } catch (_e) {
        /* use localStorage fallback */
      } finally {
        setTierConfigLoaded(true);
      }
    })();
  }, [actor]);
  // On desktop: no zoom. On mobile: zoom in ~1.75× so the map is close
  const MOBILE_ZOOM = 1.75;
  const effectiveTileW = isMobile ? TILE_WIDTH * MOBILE_ZOOM : TILE_WIDTH;
  const effectiveTileH = isMobile ? TILE_HEIGHT * MOBILE_ZOOM : TILE_HEIGHT;
  // On desktop: zero deadzone so camera stays exactly centered (no drift)
  // On mobile: small deadzone for tight follow
  const effectiveDeadzone = isMobile ? 8 : 0;
  const effectiveMaxOffset = isMobile ? 600 : 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portraitCanvasRef = useRef<HTMLCanvasElement>(null);
  const _containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const movementStartTimeRef = useRef<number>(0);
  const _enemyAnimationRef = useRef<number | undefined>(undefined);
  const cameraVelocityRef = useRef({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);
  const transitionInProgressRef = useRef(false);
  const lastPortalRef = useRef<{ x: number; y: number } | null>(null);
  // Edge-trigger for the sealed-portal announcement. Remembers which locked
  // portal was last announced so the "way forward is sealed" log fires exactly
  // once per on-portal dwell, re-arms when the player steps off, and always
  // re-announces on a fresh interact after leaving.
  const sealedPortalAnnouncedRef = useRef<{
    portalKey: string;
    announcedAt: number;
  } | null>(null);
  // EDIT 3 — Edge-trigger for the portal-check effect. The effect must only
  // fire checkPortalInteraction() on the actual isMoving false-transition, not
  // on every checkPortalInteraction identity change (its deps array is large
  // and changes on many unrelated state updates). prevIsMovingRef tracks the
  // previous isMoving value; checkPortalInteractionRef holds the latest
  // callback so the effect's deps array can stay [isMoving] only.
  const prevIsMovingRef = useRef(false);
  const checkPortalInteractionRef = useRef<() => void>(() => {});
  const dprRef = useRef<number>(window.devicePixelRatio || 1);
  // ── Visual enhancement refs (avoid useState to prevent re-renders) ──────────
  // Fade overlay for portal transitions
  const fadeOverlayRef = useRef<{
    opacity: number;
    direction: "in" | "out" | "none";
  }>({ opacity: 0, direction: "none" });
  // Combo text overlay
  const comboTextRef = useRef<{
    text: string;
    x: number;
    y: number;
    alpha: number;
    born: number;
  } | null>(null);
  // Last spell cast (for combo detection)
  const lastSpellCastRef = useRef<SpellConfig | null>(null);
  // Marked tiles (for combo mechanic)
  const markedTilesRef = useRef<Set<string>>(new Set());
  // ── H2 Mirror: units with active mirror effect ──────────────────────────────
  const mirrorUnitsRef = useRef<Set<string>>(new Set());
  // ── H3 Barrier: active barrier tiles → turns remaining ──────────────────────
  const barrierTilesRef = useRef<Map<string, number>>(new Map());
  // ── M5 Spell range cache: key = "spellId_cx_cy_version", value = tile Set ──
  const spellRangeCacheRef = useRef<Map<string, Set<string>>>(new Map());
  // ── FIX 1.1: Battle-world version counter. Bumped on every turn advance and
  // whenever the `enemies` array identity changes (catches AI moves, summons,
  // deaths in one place). Folded into the spell-range cache key so a tile set
  // computed before an enemy moved can never gate a click after.
  const battleWorldVersionRef = useRef(0);
  // H3: Battle-phase watchdog — counts consecutive turns where no action fired.
  // If 5 idle turns accumulate in a row, force-advance to unblock frozen battles.
  const idleTurnCountRef = useRef(0);

  // Jackpot heal banner state
  const [jackpotHealVisible, setJackpotHealVisible] = useState(false);
  const jackpotHealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  // Dust mote particles — updated in render loop, stored in ref to skip re-renders
  // Dust mote particles — updated in render loop, stored in ref to skip re-renders
  interface DustMote {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    life: number;
    maxLife: number;
  }
  const dustMotesRef = useRef<DustMote[]>([]);
  const dustFrameRef = useRef(0);
  // Ambient occlusion mask — pre-computed when map generates; grid of flags
  // Each cell is a bitmask: bit0=top-right neighbor is wall, bit1=top-left
  const aoMaskRef = useRef<Uint8Array | null>(null);
  // Track map id so we rebuild AO mask only when map changes
  const aoMapIdRef = useRef<string | null>(null);

  // Weather system removed per user request (was causing black screens)

  const [currentMap, setCurrentMap] = useState<GameMap | null>(null);
  const currentMapRef = useRef<GameMap | null>(null);
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>({
    x: 8,
    y: 8,
  });
  const [playerView, setPlayerView] = useState<ViewDirection>("front");
  // M7/O8: Camera stored as refs — never triggers re-renders on every frame.
  // `cameraRef` is the live position; `targetCameraRef` is the interpolation target.
  // A lightweight `cameraVersion` counter is incremented ONLY on map transitions
  // (reset to 0,0) so tile-corner-cache rebuilds still happen, but not every frame.
  const cameraRef = useRef({ x: 0, y: 0 });
  const targetCameraRef = useRef({ x: 0, y: 0 });
  // Thin shim so legacy code that reads `cameraOffset` still compiles without
  // re-render side-effects — reads from the ref synchronously.
  const _cameraOffset = cameraRef.current;
  const [_cameraVersion, setCameraVersion] = useState(0);
  // Legacy setters — used only on map transitions (reset to 0,0); safe to call
  // because they only fire when the map structurally changes.
  const setCameraOffset = (val: { x: number; y: number }) => {
    cameraRef.current = val;
    setCameraVersion((v) => v + 1);
  };
  const setTargetCameraOffset = (val: { x: number; y: number }) => {
    targetCameraRef.current = val;
  };
  const [mapCount, setMapCount] = useState(1);
  const [currentZoneTier, setCurrentZoneTier] = useState(1);
  const [showZoneLockPopup, setShowZoneLockPopup] = useState(false);
  const [showEnemyRegister, setShowEnemyRegister] = useState(false);
  const [zoneLockEnabled, setZoneLockEnabled] = useState(
    () => localStorage.getItem("aestralto_zone_locked") === "true",
  );
  const {
    bossRushState,
    startBossRush,
    advanceBossRushRoom,
    abortBossRush,
    BOSS_RUSH_ROOMS,
    subscribeRunComplete,
  } = useBossRush(actor, characterSlot, userId);
  const [isMoving, setIsMoving] = useState(false);
  const [movementPath, setMovementPath] = useState<PlayerPosition[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [clickedTile, setClickedTile] = useState<{
    x: number;
    y: number;
    timestamp: number;
  } | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [shouldFollowPlayer, _setShouldFollowPlayer] = useState(true);
  const [_pendingDestination, setPendingDestination] =
    useState<PlayerPosition | null>(null);

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  // Ref mirror of `enemies` so the enemy-turn setTimeout (dep array omits `enemies`) reads fresh summons.
  const enemiesRef = useRef<Enemy[]>([]);
  // ── FIX 1.1: Bump the battle-world version whenever the `enemies` array
  // identity changes. This catches ALL enemy movement (AI moves, summons,
  // deaths) in one place without modifying combatantStore.ts, and invalidates
  // the spell-range cache so a stale tile set can never gate a click.
  // biome-ignore lint/correctness/useExhaustiveDependencies: enemies identity change is the intentional cache-bust trigger (not read inside callback)
  useEffect(() => {
    battleWorldVersionRef.current += 1;
  }, [enemies]);

  // Battle system states
  const [inBattle, setInBattle] = useState(false);
  const [tierConfigLoaded, setTierConfigLoaded] = useState(false);
  const tierConfigRef = useRef<ReturnType<typeof loadTierConfig> | null>(null);
  // inBattle intentionally read via inBattleRef inside the render callback to prevent
  // the animation loop from restarting (and producing a black frame) on battle start.
  // See battleActionModeRef / selectedSpellIdRef for the same pattern.
  const inBattleRef = useRef(false);
  useEffect(() => {
    // Report battle state to parent so ChatPanel can pause polling
    onInBattleChange?.(inBattle);
  }, [inBattle, onInBattleChange]);
  // Keep onTransitionChange in a ref so it can be called from inside callbacks
  // without adding it to every useCallback dependency array.
  const onTransitionChangeRef = useRef(onTransitionChange);
  useEffect(() => {
    onTransitionChangeRef.current = onTransitionChange;
  }, [onTransitionChange]);
  // Helper: set transitionInProgressRef AND notify parent in one call
  const setTransitionInProgress = useCallback((value: boolean) => {
    transitionInProgressRef.current = value;
    onTransitionChangeRef.current?.(value);
  }, []);
  // Frame counter used to skip drawing for the first 2 frames during battle init
  // while React's batched state updates are still settling.
  const battleInitFrameRef = useRef(0);
  // Debounce: prevent re-triggering battle while one is already initialising
  const battleTriggerCooldownRef = useRef(false);
  // Gate: AI + turn logic may not start until battle state is fully settled
  const battleReadyRef = useRef(false);
  // M3 FIX: Idempotency guard — prevents handleBattleEnd from firing twice
  // (e.g. the useEffect that watches inBattle===false && enemies.length===0
  // can fire the same callback multiple times in rapid succession).
  const battleEndedRef = useRef(false);
  const battleStartSkipRef = useRef(0);
  // Weather suppress: pause new particle spawns for ~60 frames at battle start
  const _weatherSuppressRef = useRef(false); // Weather effects removed, ref kept to avoid larger refactor
  const [_battleEnemies, setBattleEnemies] = useState<Enemy[]>([]);
  const battleEnemiesRef = useRef<Enemy[]>([]); // mirrors _battleEnemies for stable ref access in callbacks
  const [showGameOver, setShowGameOver] = useState(false);

  // dokaBalance is now a prop from GameFlow (single source of truth)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null,
  );
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  const challengeHealUsedRef = useRef(false);
  const challengeTotalDamageRef = useRef(0);
  const challengeTurnCountRef = useRef(0);
  const challengeMaxApThisTurnRef = useRef(0);
  const challengeDirectHitRef = useRef(true);
  // Mirror of challengeAccepted state for stable access inside callbacks
  // (cast/move handlers are useCallback-memoized and would otherwise see a
  // stale closure of the accepted flag).
  const challengeAcceptedRef = useRef(false);
  // Accept window: once the player takes their first MP/AP-spending action
  // without having accepted the offered challenge, the offer is dismissed.
  const firstActionTakenRef = useRef(false);
  // Keep a ref mirror of challengeAccepted so non-React callbacks (move/cast
  // handlers) read the latest accepted flag without stale-closure issues.
  useEffect(() => {
    challengeAcceptedRef.current = challengeAccepted;
  }, [challengeAccepted]);
  const [bloodBalance, _setBloodBalance] = useState<number>(() => {
    try {
      const _bs = localStorage.getItem(
        `pbv_blood_balance_${userId}_slot${characterSlot}`,
      );
      return _bs !== null
        ? Math.max(0, Math.min(100, Number.parseInt(_bs, 10)))
        : 100;
    } catch {
      return 100;
    }
  });
  const _bloodBalanceRef = useRef<number>(100);
  const _noSpawnCounterRef = useRef<number>(0);

  // ── EXP8: Dungeon Chain Run state ───────────────────────────────────────────────
  const [dungeonChainActive, setDungeonChainActive] = useState(false);
  const [dungeonChainDepth, setDungeonChainDepth] = useState(0);
  const [dungeonChainMaxDepth, setDungeonChainMaxDepth] = useState(0);
  const [_dungeonChainBaseLevel, setDungeonChainBaseLevel] = useState(1);
  // Refs for stable access inside callbacks without re-renders
  const dungeonChainActiveRef = useRef(false);
  const dungeonChainDepthRef = useRef(0);
  const dungeonChainMaxDepthRef = useRef(0);
  // Pending white portal to attach to the next generated map (set by the
  // dungeon-chain completion block, consumed after generateRandomMap).
  const pendingWhitePortalRef = useRef<{
    x: number;
    y: number;
    color: PortalColor;
    isWhitePortal: boolean;
    animationOffset: number;
  } | null>(null);
  // Idempotency guard for run completion (else branch + subscribeRunComplete).
  const runCompleteHandledRef = useRef(false);
  // Register a single run-complete handler with useBossRush. When the boss-rush
  // state flips to `complete`, this fires once to call completeRun (same refs as
  // resetRunState) and spawn a white sanctuary portal. Guarded by
  // runCompleteHandledRef so the else-branch completion path and this
  // subscription cannot double-fire. Completion (unlike fleeing/death) keeps
  // rewards — no death penalty, no Death Realm reset.
  useEffect(() => {
    subscribeRunComplete(() => {
      if (runCompleteHandledRef.current) return;
      runCompleteHandledRef.current = true;
      completeRun({
        bossRushActiveRef,
        dungeonChainActiveRef,
        dungeonChainDepthRef,
        dungeonChainMaxDepthRef,
        abortBossRush,
      });
      const { map: whiteMap, spawnPosition: whiteSpawn } = generateRandomMap();
      if (whiteMap) {
        const whitePortal = {
          x: whiteSpawn.x,
          y: whiteSpawn.y,
          color: "white" as const,
          isWhitePortal: true,
          animationOffset: Math.random() * Math.PI * 2,
        };
        whiteMap.portals = [...(whiteMap.portals || []), whitePortal];
        setCurrentMap(whiteMap);
        if (whiteSpawn) setPlayerPosition({ ...whiteSpawn });
        resetCombatantStore(combatantStoreCtx);
      }
      logBattleEntry("A white gateway to sanctuary opens…", "white");
    });
    return () => {
      subscribeRunComplete(null);
    };
  }, [subscribeRunComplete, abortBossRush]);
  useEffect(() => {
    dungeonChainActiveRef.current = dungeonChainActive;
  }, [dungeonChainActive]);
  useEffect(() => {
    dungeonChainDepthRef.current = dungeonChainDepth;
  }, [dungeonChainDepth]);
  useEffect(() => {
    dungeonChainMaxDepthRef.current = dungeonChainMaxDepth;
  }, [dungeonChainMaxDepth]);
  // dokaBalance loaded by GameFlow; no local fetch needed
  // Doka multiplier inside dungeon chain (depth 0 = normal; depth 1-5 = 1.5x..4x)
  const DUNGEON_DOKA_MULTIPLIERS = [1, 1.5, 2.0, 2.5, 3.0, 4.0];
  const dungeonDokaMultiplier = dungeonChainActive
    ? (DUNGEON_DOKA_MULTIPLIERS[Math.min(dungeonChainDepth, 5)] ?? 1)
    : 1;
  const dungeonDokaMultiplierRef = useRef(1);
  useEffect(() => {
    dungeonDokaMultiplierRef.current = dungeonDokaMultiplier;
  }, [dungeonDokaMultiplier]);
  // H2 FIX: Prevents double-persisting dungeon Doka bonus
  const dungeonCompletionSavedRef = useRef(false);
  const isShrineRoomRef = useRef(false);
  const [_isShrineRoom, setIsShrineRoom] = useState(false);
  const [_shrineCompleted, setShrineCompleted] = useState(false);
  const shrineAltarPosRef = useRef<{ x: number; y: number } | null>(null);
  const shrinePathViolatedRef = useRef(false);
  const bossRushActiveRef = useRef(false);
  const covenantBuffMapsRef = useRef<number>(
    (() => {
      try {
        return (
          Number.parseInt(
            localStorage.getItem(
              `pbv_covenant_buff_${userId}_slot${characterSlot}`,
            ) ?? "0",
            10,
          ) || 0
        );
      } catch {
        return 0;
      }
    })(),
  );
  const shrineAchievementRef = useRef<number>(
    (() => {
      try {
        return (
          Number.parseInt(
            localStorage.getItem(
              `pbv_shrine_count_${userId}_slot${characterSlot}`,
            ) ?? "0",
            10,
          ) || 0
        );
      } catch {
        return 0;
      }
    })(),
  );

  // ── Process abort: enemy AI safety net ─────────────────────────────────────
  // Set to true when battle ends or map transitions; all nested enemy AI setTimeout
  // callbacks check this at the start and abort if true.
  const enemyTurnAbortRef = useRef<boolean>(false);
  // Track every pending enemy AI setTimeout id so we can clear them on battle exit
  const pendingTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(
    new Set(),
  );
  // M-4: Guard that prevents new timeouts from registering after cleanup has run.
  // Set true at start of cleanupBattle, reset false when a new battle starts.
  const cleanupRanRef = useRef(false);
  const pendingSavesRef = useRef<Array<() => Promise<unknown>>>([]);
  // E2: Per-turn pathfinding cache — reused by ALL enemies in the same turn.
  // Key: "sx,sy->ex,ey"; cleared at the start of each new enemy turn cycle
  // so data never goes stale between turns.
  const enemyPathCacheRef = useRef<Map<string, { x: number; y: number }[]>>(
    new Map(),
  );

  // ── Boss system state ─────────────────────────────────────────
  const [_currentBossId, setCurrentBossId] = useState<string | null>(null);
  const [_activeBossState, setActiveBossState] = useState<BossState | null>(
    null,
  );
  // Ref mirrors activeBossState for stale-closure-safe access inside AI callbacks
  // H6 FIX: Removed useEffect sync — bossStateRef is now updated synchronously
  // at every setActiveBossState call-site, eliminating a one-render-cycle lag
  // where boss AI reads stale phase-1 config after phase-2 has already committed.
  const bossStateRef = useRef<BossState | null>(null);
  const currentBossConfigRef = useRef<BossConfig | null>(null);
  // Illusory copies for the Void Grandmaster (render-only, no HP from boss pool)
  const illusionsRef = useRef<
    { id: string; x: number; y: number; isReal: boolean }[]
  >([]);
  // Show boss encounter banner at top-center
  const [bossEncounterBanner, setBossEncounterBanner] = useState<string | null>(
    null,
  );
  const bossEncounterBannerTimerRef = useRef<number | null>(null);

  // ── EXP6: Buff/Consumable Shop refs ──────────────────────────────────
  // Shield Charm: absorbs up to shieldHpRef HP from the next incoming damage
  const shieldHpRef = useRef<number>(0);
  // Fury Potion: turnsLeft > 0 means all player damage is multiplied by 1.25
  const furyRef = useRef<{ turnsLeft: number }>({ turnsLeft: 0 });

  // ── Turn timer single-instance guarantee ────────────────────────────────────
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // FIX #15: AI generation counter — incremented each battle start/end so stale
  // setTimeout callbacks from a previous battle become instant no-ops.
  const aiGenerationRef = useRef<number>(0);
  const mapWallDensityRef = useRef<number>(0);
  const mapChokePointsRef = useRef<Set<string>>(new Set());
  const mapBottleneckTilesRef = useRef<Set<string>>(new Set());
  const mapIsCorridorRef = useRef<boolean>(false);
  const cleanupPhaseRef = useRef<
    "idle" | "timers" | "battle" | "effects" | "done"
  >("idle");
  // Boss AI hook — generation-guarded decision functions for all 12 bosses
  const bossAI = useBossAI({ aiGenerationRef });

  // FIX-2: Session version — matches localStorage value so stale post-reload
  // callbacks detect the mismatch and abort immediately.
  const sessionVersionRef = useRef<number>(getSessionVersion());
  // FIX-1: Turn-timer generation counter — prevents the old interval from firing
  // once more after currentTurnIndex changes but before the effect re-runs.
  const turnTimerGenerationRef = useRef<number>(0);
  // RC FIX: isLoopRunningRef removed — single loop runs for component lifetime
  // M2: Track consecutive render errors; restart loop cleanly after 3 in a row
  const renderErrorCountRef = useRef<number>(0);
  const battleInitSafetyTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // ── Battle turn-system state ─────────────────────────────────────────────────
  const [battlePhase, setBattlePhase] = useState<"player" | "enemy">("player");
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0); // H2/C1: Mirror currentTurnIndex in a ref for synchronous reads inside advanceTurn/flushSync
  const _battlePhaseRef = useRef<string>("exploration");
  const currentTurnIndexRef = useRef(0);
  const [turnOrder, setTurnOrder] = useState<CombatantEntry[]>([]);
  // H2: Mirror of turnOrder in a ref so enemy AI always reads the current value
  // without relying on a stale React-state closure captured at effect creation time.
  const turnOrderRef = useRef<CombatantEntry[]>([]);
  // --- Unified combatant store (Section 1) ---
  // combatantsRef is the single source of truth; enemiesRef/battleEnemiesRef/turnOrderRef
  // remain as mirrors the store helpers keep in sync. See engine/combatantStore.ts.
  const combatantsRef = useRef<Enemy[]>([]);
  const storeCtxRef = useRef<CombatantStoreCtx | null>(null);
  if (storeCtxRef.current === null) {
    storeCtxRef.current = initCombatantStore(
      combatantsRef,
      enemiesRef,
      battleEnemiesRef,
      turnOrderRef,
      currentTurnIndexRef,
      setEnemies,
      setBattleEnemies,
      setTurnOrder,
    );
  }
  const combatantStoreCtx = storeCtxRef.current;

  const _phaseChangeCounterRef = useRef(0);

  const enemyTurnInProgressRef = useRef(false);
  // Ref holding the enemy-side summon spawn callback so the enemy turn
  // executor (a different closure from the SpellContext builder) can
  // invoke it when a summoner enemy decides to cast a summon spell.
  const spawnEnemySummonRef = useRef<
    ((cell: { x: number; y: number }, spell: any) => void) | null
  >(null);
  // Per-enemy HP tracking (keyed by enemy.id)
  const [enemyHpMap, setEnemyHpMap] = useState<Record<string, number>>({});
  // Track enraged enemies by id
  const [enragedEnemies, setEnragedEnemies] = useState<Set<string>>(new Set());

  // ── Spell Cooldowns — tracks turns remaining per spell id ──────────────────
  // Player cooldowns: Map<spellId, turnsRemaining>; decremented at player turn start
  const spellCooldownsRef = useRef<Map<string, number>>(new Map());
  const [spellCooldownVersion, setSpellCooldownVersion] = useState(0);
  // Enemy cooldowns: Map<enemyId, Map<spellId, turnsRemaining>>
  const [_enemyCooldowns, setEnemyCooldowns] = useState<
    Record<string, Record<string, number>>
  >({});

  // ── Leader System — one enemy is designated leader when 3+ enemies present ──
  const [_leaderId, _setLeaderId] = useState<string | null>(null);
  const [_leaderBoostMultiplier, setLeaderBoostMultiplier] = useState(1.0);

  // ── Ground Doka Loot — coin pickups spawned on maps with enemies ────────────
  const [dokaLoot, setDokaLoot] = useState<DokaLootItem[]>([]);
  const dokaLootRef = useRef<DokaLootItem[]>([]);
  useEffect(() => {
    dokaLootRef.current = dokaLoot;
  }, [dokaLoot]);
  // Coin trail animation removed — coins render as static graphics on tile centres.
  // CoinParticle type kept so cleanup stubs compile without changes.
  interface CoinParticle {
    id: string;
    fromX: number;
    fromY: number;
    offsetX: number;
    offsetY: number;
    progress: number;
    value: number;
    delay: number;
    size: number; // radius 3..6
  }
  const [coinParticles, setCoinParticles] = useState<CoinParticle[]>([]);
  const coinParticlesRef = useRef<CoinParticle[]>([]);
  useEffect(() => {
    coinParticlesRef.current = coinParticles;
  }, [coinParticles]);

  // ── Spell cooldown tracking: enemyId → spellId → turns remaining ──────────
  const enemyCooldownsRef = useRef<Map<string, Map<string, number>>>(new Map());
  // ── Enemy summoner cooldown: enemyId → battle turn of last summon cast ────
  // Enforces ENEMY_SUMMON_COOLDOWN_TURNS "every other turn" cadence. Read by
  // decideSummonerAction via ctx.lastSummonTurn; written after a successful
  // spawnEnemySummon. Cleared on battle start alongside enemyCooldownsRef.
  const enemySummonCooldownRef = useRef<Map<string, number>>(new Map());
  const battleSpellsRef = useRef<SpellConfig[]>([]);

  // ── #17 Modifiable Range: delta bonus per spell id, expires after duration turns ──
  const modifiableRangeBonusRef = useRef<
    Map<string, { delta: number; turnsLeft: number }>
  >(new Map());
  const applyRangeModification = useCallback(
    (targetSpellId: string, delta: number, duration: number) => {
      modifiableRangeBonusRef.current.set(targetSpellId, {
        delta,
        turnsLeft: duration,
      });
    },
    [],
  );
  // Decrement modifiable range bonuses at start of each player turn
  const tickModifiableRangeBonuses = useCallback(() => {
    const updated = new Map<string, { delta: number; turnsLeft: number }>();
    for (const [id, entry] of modifiableRangeBonusRef.current.entries()) {
      if (entry.turnsLeft > 1)
        updated.set(id, { ...entry, turnsLeft: entry.turnsLeft - 1 });
      // turnsLeft === 1 means it expires this tick — drop it
    }
    modifiableRangeBonusRef.current = updated;
  }, []);
  // Suppress unused warning
  void applyRangeModification;
  void tickModifiableRangeBonuses;

  // ── Leader / erratic state ────────────────────────────────────────────────
  const leaderEnemyIdRef = useRef<string | null>(null);
  const leaderDiedRef = useRef(false);
  const allEnemiesErraticRef = useRef(false);
  const erraticTurnsLeftRef = useRef(0);

  // ── Leader death animation ─────────────────────────────────────────────────
  interface LeaderDeathParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    born: number;
  }
  const leaderDeathParticlesRef = useRef<LeaderDeathParticle[]>([]);
  // H1: Generation counter for leader death particles.
  // Incremented every time cleanupMap() resets leaderDeathParticlesRef so that
  // any in-flight particle animation frame from a previous map aborts immediately.
  const leaderParticleGenRef = useRef<number>(0);
  const leaderDeathTextRef = useRef<{
    x: number;
    y: number;
    born: number;
  } | null>(null);
  const effectsManagerRef = useRef(new EffectsManager());

  // ── Render-loop health refs (crash prevention) ───────────────────────────
  // Tracks whether the canvas has been initialised at least once (first applySize call).
  // Used in animate() to distinguish "not ready yet" from genuine GPU context loss.
  const canvasInitializedRef = useRef<boolean>(false);
  // Tracks whether the animate() callback is actively drawing (used by ResizeObserver).
  const isRenderingRef = useRef(false);
  // Debounce timer for ResizeObserver — prevents canvas.width= assignment mid-frame.
  const resizeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks the last time animate() ran — used by the watchdog to detect a dead loop.
  const lastFrameTimeRef = useRef<number>(Date.now());
  // Watchdog interval that restarts the loop if it dies silently.
  const watchdogIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  // ── FIX: Tracked portal transition timers (Fix 1) ─────────────────────────
  // These two nested setTimeouts drive the post-portal camera + transition unlock.
  // Previously untracked — if a second portal fired within 1.6 s the first timer
  // would clear the lock mid-render and allow two map generations to race.
  const portalTimerRef1 = useRef<number | null>(null);
  const portalTimerRef2 = useRef<number | null>(null);
  // ── FIX: Tracked movement-end timers (Fix 3) ────────────────────────────────
  // The 50 ms camera and 100 ms portal-check timeouts after movement completion.
  const movementTimersRef = useRef<Set<number>>(new Set());
  // ── FIX: Tracked post-battle recap timer (Fix 4) ────────────────────────────
  const recapTimerRef = useRef<number | null>(null);
  // ── FIX: Tracked Death Realm transition timer (Fix 5) ───────────────────────
  const deathRealmTimerRef = useRef<number | null>(null);
  // ── FIX: Tracked respawn / camera-follow timers so cleanupMap can cancel them
  // if the player crosses a portal immediately after dying or respawning.
  const respawnTimerRef = useRef<number | null>(null);
  const cameraFollowTimerRef = useRef<number | null>(null);
  // Generation counter — incremented every time we intentionally restart the loop
  // (e.g. portal transition). Any in-flight loop whose generation doesn't match is
  // automatically orphaned without needing an explicit cancel.
  // RC FIX: rafGenerationRef removed — loop runs forever, no generation counter needed
  // Stable ref to the animate function — needed by checkPortalInteraction (defined
  // before animate) to restart the loop after a portal transition.
  const animateRef = useRef<() => void>(() => {});

  // ── Focus-fire shared target (group of 3+) ───────────────────────────────
  const focusTargetRef = useRef<string | null>(null);
  const focusTurnRef = useRef<number>(-1);

  // ── Player spell-type history (last 5) for Adaptive Resistance ────────────
  const playerSpellTypeHistoryRef = useRef<string[]>([]);

  // Active effects (buff/debuff/DoT) state machine
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const activeEffectsRef = useRef<ActiveEffect[]>([]);
  // enemy effects are stored in activeEffects with targetId === enemy.id
  // activeEffectsRef sync removed — ref is set synchronously at every mutation site
  const timestepUsedRef = useRef(false);
  const playerApWasDebuffedRef = useRef(false);

  // Sync active effects to parent (ChatPanel Status tab)
  useEffect(() => {
    onActiveEffectsChange?.(activeEffects);
  }, [activeEffects, onActiveEffectsChange]);

  // ── Battle log helper (nowTimestamp / calcScaledDamage are module-level pure fns) ──
  const logBattleEntry = useCallback(
    (text: string, color?: string, isSummon?: boolean) => {
      if (!addBattleLogEntry) return;
      addBattleLogEntry({
        id: `bl-${Date.now()}-${Math.random()}`,
        timestamp: nowTimestamp(),
        text,
        color: color ?? "#ffffff",
        isSummon,
      });
    },
    [addBattleLogEntry],
  );

  // Helper: apply or refresh an active effect
  const applyActiveEffect = useCallback(
    (effect: ActiveEffect) => {
      if (
        effect.type !== "dot" &&
        !mapModifierRegistry.applyEffectApplication(
          effect.type,
          activeMapModifierTypes,
          {
            log: (msg: string) => logDebugInfo("MODIFIER", msg),
            rng: Math.random,
          },
        )
      ) {
        logDebugInfo("MODIFIER", `suppressed: ${effect.type}`);
        return;
      }
      setActiveEffects((prev) => {
        // Section 4: DoTs stack additively — each application appends a new
        // independent stack with its own duration (no replace). Non-DoT
        // buffs/debuffs retain the existing replace-or-refresh behavior.
        let next: ActiveEffect[];
        if (effect.type === "dot") {
          // Ensure the incoming DoT has a stackId so React keys stay unique
          // across multiple stacks of the same DoT type.
          const withStackId: ActiveEffect =
            (effect.stackId ?? effect.id)
              ? effect
              : {
                  ...effect,
                  stackId: `dot-${effect.effectName}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                };
          next = appendDotStack(prev, withStackId);
        } else {
          // Replace existing same-name+target effect, or append
          const existing = prev.findIndex(
            (e) =>
              e.targetId === effect.targetId &&
              e.effectName === effect.effectName,
          );
          if (existing >= 0) {
            next = [...prev];
            next[existing] = effect;
          } else {
            next = [...prev, effect];
          }
        }
        activeEffectsRef.current = next;
        return next;
      });
      // Log effect application with explicit stat, magnitude, and duration
      const effectType = effect.type;
      const stat = effect.stat;
      const modifier = effect.modifier;
      const isDot =
        effectType === "dot" &&
        effect.dotDamagePerTurn !== undefined &&
        effect.dotDamagePerTurn > 0;
      if (!isDot && stat && modifier !== undefined) {
        const isPercentStat = stat !== "mp" && stat !== "ap";
        const signedMag = isPercentStat
          ? modifier > 1
            ? `+${Math.round((modifier - 1) * 100)}%`
            : `${Math.round((modifier - 1) * 100)}%`
          : modifier > 0
            ? `+${modifier}`
            : `${modifier}`;
        const color = effectType === "buff" ? "#22c55e" : "#a855f7";
        const targetName =
          effect.targetId === "player" ? "you" : effect.targetId;
        logBattleEntry(
          `${effect.effectName}: ${signedMag} ${stat.toUpperCase()} on ${targetName} (${effect.duration} turns)`,
          color,
        );
      } else if (isDot) {
        const color = effect.targetId === "player" ? "#eab308" : "#a855f7";
        const targetName =
          effect.targetId === "player" ? "you" : effect.targetId;
        logBattleEntry(
          `${effect.effectName}: ${effect.dotDamagePerTurn} dmg/turn on ${targetName} (${effect.duration} turns)`,
          color,
        );
      }
    },
    [logBattleEntry],
  );

  // Helper: remove expired effects at start of each turn, apply DoT
  // M-5: reads/writes activeEffectsRef.current directly to avoid stale closure captures;
  // syncs back to state via setActiveEffects after mutating the ref.
  const processActiveEffects = useCallback(
    (targetId: string) => {
      // M-5: operate on the ref so we always see the live array, not a stale snapshot
      const prev = activeEffectsRef.current;
      setActiveEffects((_prev) => {
        // Section 4: tick all DoT stacks on this target as a single summed tick.
        // tickDotStacks returns the summed pre-RES damage, the surviving DoT
        // stacks (durations decremented independently), and per-stack remaining
        // durations for the log. RES is applied INSIDE playerTakesDamage /
        // enemyTakesDamage — do NOT apply it again here. SR does NOT reduce DoT.
        const dotResult: DotTickResult = tickDotStacks(prev, targetId);
        const next: ActiveEffect[] = [...dotResult.remaining];

        if (dotResult.damage > 0 && dotResult.stackCount > 0) {
          // Apply the SUMMED DoT damage as a single tick. RES is applied inside
          // the damage helpers; we capture the post-RES value for the log.
          const dotTypeLabel =
            prev.find(
              (e) =>
                e.targetId === targetId &&
                e.type === "dot" &&
                e.dotDamagePerTurn !== undefined &&
                e.dotDamagePerTurn > 0,
            )?.effectName ?? "DoT";
          let postResDamage = dotResult.damage;
          if (targetId === "player") {
            postResDamage = playerTakesDamage(
              dotResult.damage,
              `${dotTypeLabel} DoT`,
            );
          } else {
            postResDamage = enemyTakesDamage(
              targetId,
              dotResult.damage,
              "dot",
              `${dotTypeLabel} DoT`,
              false,
            );
          }
          // Compute the RES reduction that was applied (for the log).
          // RES is the only reduction on DoT ticks (SR does NOT apply).
          const resReduc = Math.max(0, dotResult.damage - postResDamage);
          if (logBattleEntry) {
            const stacksStr = dotResult.perStackDurations
              .map((d) => String(d))
              .join(",");
            const tickColor = targetId === "player" ? "#eab308" : "#a855f7";
            const targetName = targetId === "player" ? "player" : targetId;
            logBattleEntry(
              `[DOT] target=${targetName} type=${dotTypeLabel} tick=${postResDamage} stacks=[${stacksStr}] resReduc=${resReduc}`,
              tickColor,
            );
          }
        }

        // Decrement duration for non-DoT effects on this target (buffs/debuffs).
        // DoT stacks were already handled by tickDotStacks above and are present
        // in `next` with decremented durations (or dropped if expired).
        // We must process only the non-DoT effects that tickDotStacks passed
        // through untouched — re-scan `next` for non-DoT effects on this target.
        const afterNonDot: ActiveEffect[] = [];
        for (const eff of next) {
          if (eff.targetId !== targetId) {
            afterNonDot.push(eff);
            continue;
          }
          if (eff.type === "dot") {
            // Already ticked by tickDotStacks — keep as-is.
            afterNonDot.push(eff);
            continue;
          }
          // Non-DoT effect: decrement duration, drop if expired.
          const newDur = eff.duration - 1;
          if (newDur > 0) {
            afterNonDot.push({ ...eff, duration: newDur });
          }
          const stat = eff.stat;
          const modifier = eff.modifier;
          if (stat && modifier !== undefined) {
            const isPercentStat = stat !== "mp" && stat !== "ap";
            const signedMag = isPercentStat
              ? modifier > 1
                ? `+${Math.round((modifier - 1) * 100)}%`
                : `${Math.round((modifier - 1) * 100)}%`
              : modifier > 0
                ? `+${modifier}`
                : `${modifier}`;
            logBattleEntry(
              `${eff.effectName || "Effect"} expired (${signedMag} ${stat.toUpperCase()} ended)`,
              "#94a3b8",
            );
          }
        }
        // M-5: also update ref immediately so subsequent reads in the same turn are fresh
        activeEffectsRef.current = afterNonDot;
        return afterNonDot;
      });
      // enemy effects are stored in activeEffects with targetId === enemy.id, so they are already ticked above
    },
    [logBattleEntry],
  );

  // ── Centralized damage helpers moved to after characterStats & logBattleEntry declarations ──
  // Battle action mode: 'walk' uses MP for movement, 'attack' uses AP for spells

  // Refs for volatile values used inside canvas render callback (must be after declarations)
  // These are intentionally created after their source values are declared below

  const [battleActionMode, setBattleActionMode] = useState<"walk" | "attack">(
    "walk",
  );
  const battleActionModeRef = useRef<"walk" | "attack">("walk");
  useEffect(() => {
    battleActionModeRef.current = battleActionMode;
  }, [battleActionMode]);
  // Current MP and AP available this turn (reset each turn)
  const [currentBattleAp, setCurrentBattleAp] = useState(4);
  const [currentBattleMp, setCurrentBattleMp] = useState(3);
  // Turn tracking
  const [battleTurn, setBattleTurn] = useState(0);
  // 30-second turn timer
  const [turnTimeLeft, setTurnTimeLeft] = useState(30);
  // Spell damage preview: track hovered enemy id during attack mode
  const [hoveredEnemyId, setHoveredEnemyId] = useState<string | null>(null);
  const hoveredEnemyIdRef = useRef<string | null>(null);
  useEffect(() => {
    hoveredEnemyIdRef.current = hoveredEnemyId;
  }, [hoveredEnemyId]);
  // Battle hits tracking
  const battleHitsRef = useRef<number>(0);

  // Rename modal state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameInput, setRenameInput] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Shop modal state
  const [showShop, setShowShop] = useState(false);
  const [shopStep, setShopStep] = useState<"packages" | "form">("packages");
  const [selectedPkg, setSelectedPkg] = useState<{
    dokaAmount: number;
    priceEur: number;
    id: string;
    paymentLink?: string;
  } | null>(null);
  const [shopCustomerData, setShopCustomerData] = useState<
    Record<string, string>
  >({});
  const [shopProofFile, setShopProofFile] = useState<File | null>(null);

  // Boost toggle state
  const [boostMode, _setBoostMode] = useState<"xp" | "rewards">("xp");

  // Simple rename handler — calls backend renameCharacter and deducts Doka locally
  const handleRenameCharacter = async () => {
    const newName = renameInput.trim();
    if (!newName || newName.length > 20) return;
    if (dokaBalance < 100) {
      toast.error("Insufficient Doka (need 100)");
      return;
    }
    setIsRenaming(true);
    try {
      if (actor) {
        await (actor as Record<string, any>).renameCharacter(
          BigInt(characterSlot),
          newName,
        );
        onDokaBalanceChange(Math.max(0, dokaBalance - 100));
        toast.success(`Name changed to "${newName}"`);
        setShowRenameModal(false);
        setRenameInput("");
      }
    } catch {
      toast.error("Rename failed. Please try again.");
    } finally {
      setIsRenaming(false);
    }
  };

  // Region configs from backend
  const { data: regionConfigs = [] } = useGetRegionConfigs();
  const { data: backendSpells = [] } = useGetSpellConfigs();
  const { data: mapModifiers = [] } = useGetMapModifiers();
  const { data: gameConfig } = useGetGameConfig();
  // Achievement hooks
  const { data: achievementConfigs = [] } = useGetAchievementConfigs();
  const { data: playerAchievements = [] } = useGetPlayerAchievements();
  const markAchievementUnlocked = useMarkAchievementUnlocked();
  // Enemy names pool from admin
  const { data: enemyNamesFromQuery = [] } = useGetEnemyNames();

  // Achievement tracking state
  const [pendingAchievementToast, setPendingAchievementToast] =
    useState<AchievementConfig | null>(null);
  const [_newlyUnlockedInBattle, setNewlyUnlockedInBattle] = useState<
    AchievementConfig[]
  >([]);
  // Guard: track which achievement IDs have already been toasted this session
  // to prevent double-firing from the outside-battle useEffect AND the battle-victory path
  const achievementsShownRef = useRef<Set<string>>(new Set());
  // Persistent counters stored in localStorage
  // ISSUE 2 FIX: Initialize to 0; userId is not known at render time.
  // A useEffect below (after this block) loads the namespaced values once
  // both userId and characterSlot are available.
  const mapsVisitedCountRef = useRef<number>(0);
  const groundDokaPickupCountRef = useRef<number>(0);
  // ISSUE 2 FIX: Load namespaced localStorage values once userId + characterSlot are known.
  useEffect(() => {
    if (!userId || characterSlot === undefined) return;
    const nsPrefix = `${userId}_slot${characterSlot}_`;
    try {
      mapsVisitedCountRef.current = Number.parseInt(
        localStorage.getItem(`${nsPrefix}pbv_maps_visited_count`) || "0",
        10,
      );
      groundDokaPickupCountRef.current = Number.parseInt(
        localStorage.getItem(`${nsPrefix}pbv_ground_doka_pickups`) || "0",
        10,
      );
    } catch {
      // localStorage unavailable — leave at 0
    }
  }, [userId, characterSlot]);
  // Per-battle tracking
  const battleCritHitsRef = useRef<number>(0);
  const battleBetrayalOccurredRef = useRef<boolean>(false);
  const battleDoubleBetrayelOccurredRef = useRef<boolean>(false);
  const battleLeaderSlainRef = useRef<boolean>(false);
  const battleOnlyHealBuffSpellsRef = useRef<boolean>(true); // flips false if damage spell used

  // Outside-battle achievement checks and jackpot are hoisted after checkAndFireAchievement declaration below

  // Helper: check and fire achievement by condition
  // C4 fix: entire body wrapped in try-catch so a malformed achievement entry
  // never kills all subsequent achievement firing for the session.
  const checkAndFireAchievement = useCallback(
    (condition: string, inBattle: boolean) => {
      try {
        const cfg = achievementConfigs.find(
          (a) => a.active && a.condition === condition,
        );
        if (!cfg) return;
        const alreadyUnlocked = playerAchievements.some(
          (p) => p.achievementId === cfg.id && p.unlocked,
        );
        if (alreadyUnlocked) return;
        // Guard: skip if already toasted this session
        if (achievementsShownRef.current.has(cfg.id)) return;
        achievementsShownRef.current.add(cfg.id);
        // Mark in backend
        markAchievementUnlocked.mutate(cfg.id);
        if (inBattle) {
          // Collect for post-battle recap
          setNewlyUnlockedInBattle((prev) => {
            if (prev.find((a) => a.id === cfg.id)) return prev;
            return [...prev, cfg];
          });
        } else {
          // Show top-centre toast in world mode
          setPendingAchievementToast(cfg);
        }
      } catch (err) {
        // C4: log but never let a bad achievement entry crash the whole check pipeline
        if (process.env.NODE_ENV === "development") {
          console.warn("[Achievement] checkAndFireAchievement error:", err);
        }
      }
    },
    [achievementConfigs, playerAchievements, markAchievementUnlocked],
  );

  // Outside-battle achievement checks — doka and maps only (early, before characterStats declaration)
  // H5: MIN_DOKA_THRESHOLD — pre-computed minimum so the doka check can short-circuit
  // on every pickup when the balance is still far below any reward threshold.
  const MIN_DOKA_THRESHOLD = 1000; // lowest doka-gated achievement threshold
  const prevAchievementValuesRef = useRef({ doka: 0, mapsVisited: 0 });
  useEffect(() => {
    if (inBattle) return;
    const prev = prevAchievementValuesRef.current;
    const mapsVisited = mapsVisitedCountRef.current;
    if (dokaBalance !== prev.doka) {
      // H5: Skip all doka checks immediately when balance is below the lowest threshold
      if (dokaBalance >= MIN_DOKA_THRESHOLD) {
        if (dokaBalance >= 1000) checkAndFireAchievement("doka_1000", false);
        if (dokaBalance >= 10000) checkAndFireAchievement("doka_10000", false);
      }
      prevAchievementValuesRef.current = {
        ...prevAchievementValuesRef.current,
        doka: dokaBalance,
      };
    }
    if (mapsVisited !== prev.mapsVisited) {
      if (mapsVisited >= 25) checkAndFireAchievement("explore_25_maps", false);
      if (groundDokaPickupCountRef.current >= 10)
        checkAndFireAchievement("loot_10_doka", false);
      prevAchievementValuesRef.current = {
        ...prevAchievementValuesRef.current,
        mapsVisited,
      };
    }
  }, [dokaBalance, inBattle, checkAndFireAchievement]);

  // Jackpot heal achievement check
  useEffect(() => {
    if (jackpotHealVisible && !inBattle) {
      checkAndFireAchievement("jackpot_heal", false);
    }
  }, [jackpotHealVisible, inBattle, checkAndFireAchievement]);

  const leaderBoostPercent: number =
    (gameConfig as AdminGameConfig | undefined)?.leaderBoostPercent ?? 10;
  const dokaSpawnChance: number =
    (gameConfig as AdminGameConfig | undefined)?.dokaSpawnChance ?? 40;
  const dokaSpawnBaseValue: number =
    (gameConfig as AdminGameConfig | undefined)?.dokaSpawnBaseValue ?? 5;

  // ── #18 Doka spawn config ref: always reflects latest gameConfig value ─────
  const dokaSpawnConfigRef = useRef({ dokaSpawnChance, dokaSpawnBaseValue });
  useEffect(() => {
    dokaSpawnConfigRef.current = { dokaSpawnChance, dokaSpawnBaseValue };
  }, [dokaSpawnChance, dokaSpawnBaseValue]);

  // Load level-up config from localStorage (admin editable)
  const levelUpConfig = useMemo(() => {
    try {
      const raw = localStorage.getItem("pbv_levelup_config");
      if (raw) return { ...DEFAULT_LEVELUP_CONFIG, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return DEFAULT_LEVELUP_CONFIG;
  }, []);

  // Active map modifier flags — only if the modifier was triggered this portal transition
  const [activeMapModifierTypes, setActiveMapModifierTypes] = useState<
    Set<string>
  >(new Set());

  const isSlimeFlood = activeMapModifierTypes.has("slime_flood");
  const isPaperWindstorm = activeMapModifierTypes.has("paper_windstorm");
  const _isGravityWell = activeMapModifierTypes.has("gravity_well");
  const isBloodMoon = activeMapModifierTypes.has("blood_moon");
  const _isFogOfWar = activeMapModifierTypes.has("fog_of_war");
  const isThornedGround = activeMapModifierTypes.has("thorned_ground");
  const _isArcaneSurge = activeMapModifierTypes.has("arcane_surge");
  const isMirrorField = activeMapModifierTypes.has("mirror_field");
  const _isFrozenTerrain = activeMapModifierTypes.has("frozen_terrain");
  const isPlagueZone = activeMapModifierTypes.has("plague_zone");
  const isTimeWarp = activeMapModifierTypes.has("time_warp");
  const isVoidRift = activeMapModifierTypes.has("void_rift");
  // Refs for volatile render-loop values (avoid dep array instability)
  const isSlimeFloodRef = useRef(isSlimeFlood);
  useEffect(() => {
    isSlimeFloodRef.current = isSlimeFlood;
  }, [isSlimeFlood]);
  const currentBattleMpRef = useRef(currentBattleMp);
  useEffect(() => {
    currentBattleMpRef.current = currentBattleMp;
  }, [currentBattleMp]);
  // Void rift: one random walkable tile per turn becomes void (reset each turn)
  const [voidRiftTile, setVoidRiftTile] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // starterSpells and physicalAttackSpell are imported from ../data/spellData

  // Spell pool for enemy assignment = backend spells if any, else fallback starters
  const OLD_SPELL_NAMES_SET = new Set([
    "Blood Nova",
    "Crimson Heal",
    "Cursed Gust",
    "Drain Life",
    "Entangle",
    "Fireball",
    "Frost Nova",
    "Heal",
    "Ice Shard",
    "Inferno",
    "Meteor Strike",
    "Mist Form",
    "Obliterate",
    "Physical Attack",
    "Plague Wave",
    "Poison Dart",
    "blood_nova",
    "crimson_heal",
    "cursed_gust",
    "drain_life",
    "entangle",
    "fireball",
    "frost_nova",
    "heal",
    "ice_shard",
    "inferno",
    "meteor_strike",
    "mist_form",
    "obliterate",
    "physical_attack",
    "plague_wave",
    "poison_dart",
  ]);
  const filteredBackendSpells = backendSpells.filter(
    (s: { id: string; name: string }) =>
      !OLD_SPELL_NAMES_SET.has(s.id) && !OLD_SPELL_NAMES_SET.has(s.name),
  );

  // Base spells = the always-owned innate spells (ALL starter spells + physical attack)
  // Every spell in starterSpells is a base/innate spell — always shown, never removable.
  const baseSpells = useMemo(() => {
    const base = starterSpells.map((s) => ({
      ...s,
      isBaseSpell: true as const,
    }));
    // Ensure physicalAttackSpell is always included
    if (!base.some((s) => s.id === physicalAttackSpell.id)) {
      base.unshift({ ...physicalAttackSpell, isBaseSpell: true });
    }
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Owned spells = base spells UNION acquired spells (backend), deduplicated by id
  // If a spell exists in both, the base version wins (preserves isBaseSpell flag)
  const ownedSpells = useMemo(() => {
    const map = new Map<string, SpellConfig>();
    // Base spells first — they are the canonical source for base spells
    for (const s of baseSpells) {
      map.set(s.id, s);
    }
    // Acquired spells from backend — only add if not already a base spell
    for (const s of filteredBackendSpells) {
      if (!map.has(s.id)) {
        map.set(s.id, s);
      }
    }
    return Array.from(map.values());
  }, [baseSpells, filteredBackendSpells]);

  // FIX 2 (TS): Type guard for the setSpellBarOrder Motoko variant result.
  // The backend returns variant{#ok,#err:Text}, which the JS binding serializes
  // as EITHER { _ok?: null } | { _err?: string } (underscored) OR { ok?, err? }
  // (plain) depending on the candid/codegen path. A bare union of the two
  // object shapes does NOT allow accessing `_err` on the `{ ok?, err? }` member
  // (and vice versa), which produced ~12 TS2339 errors. This guard narrows to
  // a single discriminated shape so the err message is type-safe to read.
  const isSpellBarErr = (r: unknown): r is { _err: string } | { err: string } =>
    r != null &&
    (typeof (r as { _err?: unknown })._err === "string" ||
      typeof (r as { err?: unknown }).err === "string");
  const spellBarErrMsg = (r: { _err: string } | { err: string }): string =>
    typeof (r as { _err?: string })._err === "string"
      ? (r as { _err: string })._err
      : (r as { err: string }).err;

  // Load active spell IDs from backend on character load so loadout survives
  // browser storage clears and device switches.
  // SECTION 4: spellBarOrder is the backend-authoritative source for the
  // arranged spell-bar order. We read it from getCharacter (the Character
  // record now includes spellBarOrder: ?[Text]). Only the FIRST assignment
  // after character creation may be automatic — and even then it uses the
  // ownedSpells in their natural/learned order (NOT a random shuffle) and is
  // immediately persisted via setSpellBarOrder so the next load reads it back.
  // biome-ignore lint/correctness/useExhaustiveDependencies: isSpellBarErr/spellBarErrMsg are stable local helpers (defined once, never reassigned)
  useEffect(() => {
    if (
      !userId ||
      characterSlot === null ||
      characterSlot === undefined ||
      !actor
    )
      return;
    let cancelled = false;
    (async () => {
      try {
        // Read the character record to get spellBarOrder (backend-authoritative).
        const character = await (actor as ActorAny).getCharacter(
          BigInt(characterSlot),
        );
        if (cancelled) return;
        const savedOrder: string[] | undefined =
          character?.spellBarOrder ?? undefined;
        const ownedIds = new Set(ownedSpells.map((s) => s.id));

        if (savedOrder && savedOrder.length > 0) {
          // (a) Render exactly the saved order — skip unknown/no-longer-owned
          // ids (filter against ownedSpells), then append any newly-learned
          // spells that aren't in the saved order to the end (up to 8-slot cap).
          const kept = savedOrder.filter((id) => ownedIds.has(id));
          const keptSet = new Set(kept);
          const appended = ownedSpells
            .map((s) => s.id)
            .filter((id) => !keptSet.has(id));
          const resolved = [...kept, ...appended].slice(0, 8);
          const padded = [
            ...resolved,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ].slice(0, 8);
          setActiveSpellIds(resolved);
          localStorage.setItem(
            nsKey("pbv_active_spells"),
            JSON.stringify(padded),
          );
        } else if (ownedSpells.length > 0) {
          // (b) spellBarOrder is empty/null — derive the default ONCE using the
          // ownedSpells in their natural/learned order (NOT a random shuffle)
          // and SAVE it immediately via setSpellBarOrder so the next load
          // reads it back.
          const first8 = ownedSpells.slice(0, 8).map((s) => s.id);
          if (cancelled) return;
          setActiveSpellIds(first8);
          localStorage.setItem(
            nsKey("pbv_active_spells"),
            JSON.stringify(first8),
          );
          try {
            // FIX 2b: Log the initial-save round-trip result too (the
            // non-debounced fallback path). Same variant inspection as the
            // debounced save above.
            const result = await (actor as ActorAny).setSpellBarOrder(
              BigInt(characterSlot),
              first8,
            );
            if (isSpellBarErr(result)) {
              logDebugError("SPELLS", "[SPELLBAR] initial save #err", {
                msg: spellBarErrMsg(result),
                slot: characterSlot,
                orderIds: first8,
              });
              console.error(
                "[SpellInit] setSpellBarOrder #err:",
                spellBarErrMsg(result),
              );
            } else {
              logDebugInfo("SPELLS", "[SPELLBAR] initial save #ok", {
                slot: characterSlot,
                orderIds: first8,
              });
            }
          } catch (e) {
            logDebugError("SPELLS", "[SPELLBAR] initial save failed", {
              error: String(e),
              slot: characterSlot,
              orderIds: first8,
            });
            console.warn(
              "[SpellInit] Failed to save initial spellBarOrder:",
              e,
            );
          }
        }
      } catch (e) {
        console.warn("[SpellLoad] Failed to load spells from backend:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, characterSlot, actor, nsKey, ownedSpells]);

  const spellPool =
    filteredBackendSpells.length > 0
      ? filteredBackendSpells
      : starterSpells.filter(
          (s: { id: string; name: string }) =>
            !OLD_SPELL_NAMES_SET.has(s.id) && !OLD_SPELL_NAMES_SET.has(s.name),
        );
  const normalizedSpellPool: SpellConfig[] = spellPool.map((s) => ({
    cooldown: 0,
    aoe: false,
    usableByPlayer: true,
    usableByEnemy: false,
    ...s,
  })) as SpellConfig[];

  // H4: Invalidate spell range cache when admin updates spell configs.
  // backendSpells is a React Query result — it changes identity when the admin saves a spell,
  // so clearing here ensures range highlights recalculate on the next player selection.
  // biome-ignore lint/correctness/useExhaustiveDependencies: backendSpells identity change is intentional trigger
  useEffect(() => {
    spellRangeCacheRef.current.clear();
  }, [backendSpells]);

  // Active spells — persist only slot IDs, resolve to live SpellConfig on load & pool change
  const [activeSpellIds, setActiveSpellIds] = useState<string[]>(() => {
    try {
      // M6: Try namespaced key first, fall back to legacy for migration
      const namespacedKey = userId
        ? `${userId}_slot${characterSlot}_pbv_active_spells`
        : "pbv_active_spells";
      const legacySaved = localStorage.getItem("pbv_active_spells");
      const saved = localStorage.getItem(namespacedKey) ?? legacySaved;
      if (legacySaved && userId) {
        localStorage.setItem(namespacedKey, legacySaved); // migrate
        localStorage.removeItem("pbv_active_spells");
      }
      if (saved) {
        const parsed = JSON.parse(saved) as (SpellConfig | string)[];
        // Support both legacy full-object format and new ID-only format
        return parsed
          .slice(0, 8)
          .map((entry) =>
            typeof entry === "string" ? entry : (entry as SpellConfig).id,
          )
          .filter(Boolean) as string[];
      }
    } catch (e) {
      console.warn("[Spell] Spell state load failed, using empty defaults:", e);
    }
    return [];
  });

  // ── ACTIVE SPELLS: pure derived value ───────────────────────────────────────
  // activeSpells is a PURE useMemo derived from (activeSpellIds, ownedSpells).
  // It resolves each slot's spellId against the FULL ownedSpells library.
  // Because ownedSpells includes base spells UNION acquired spells, base spell IDs
  // always resolve and can never vanish. Equipping/swapping only changes
  // activeSpellIds (the slot->id mapping), never ownedSpells.
  const activeSpells = useMemo(() => {
    if (ownedSpells.length === 0) return [] as SpellConfig[];
    const ids = activeSpellIds.length > 0 ? activeSpellIds : null;
    if (ids) {
      const resolved = ids
        .map((id) => {
          if (!id) return null;
          const found = ownedSpells.find((s) => s.id === id);
          if (!found) {
            console.warn("[SpellSlots] Spell ID not found in ownedSpells:", id);
          }
          return found ?? null;
        })
        .filter((s): s is SpellConfig => s !== null);
      if (resolved.length > 0) return resolved;
    }
    // No saved IDs yet — return 8 empty slots
    return Array(8).fill(null) as SpellConfig[];
  }, [ownedSpells, activeSpellIds]);

  const activeSpellsRef = useRef<SpellConfig[]>([]);
  useEffect(() => {
    activeSpellsRef.current = activeSpells;
  }, [activeSpells]);

  // STEP 2: Debounced backend save of the spell-bar ORDER via setSpellBarOrder.
  // The debounce coalesces rapid equip/swap clicks into a single backend call
  // (matches ChallengePanel.tsx line 212 and DraggablePanel.tsx line 187).
  const setSpellBarOrderDebounceRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // FIX 2a: Pending spell-bar queue. When the player swaps spells DURING battle,
  // handleSetActiveSpells cannot apply immediately (the bar is locked mid-fight).
  // Instead of a silent no-op, we stash the requested list here and flush it in
  // cleanupBattle once inBattleRef flips false — so the change is never lost.
  // Null = no pending change. Non-null = apply this list after the current battle.
  const pendingSpellBarRef = useRef<SpellConfig[] | null>(null);

  // FIX 2c: Ref mirror of handleSetActiveSpells so cleanupBattle (a useCallback
  // with a stable identity) can call the LATEST handler without re-creating
  // itself on every render. This is the standard ref-mirror pattern and keeps
  // exhaustive-deps satisfied for both the handler and cleanupBattle.
  const handleSetActiveSpellsRef = useRef<(spells: SpellConfig[]) => void>(
    () => {},
  );

  // SINGLE-AUTHORITY spell-bar update path.
  //
  // spellBarOrder (the [Text] id list on the Character record) is the ONE
  // source of truth for BOTH the spell-bar CONTENT and its ORDER. This handler
  // is the only path that mutates the bar: it (a) updates the local state the
  // bar renders from (activeSpellIds → activeSpells useMemo), and (b) persists
  // via the existing debounced setSpellBarOrder save below.
  //
  // The old divergent saveActiveSpells(BigInt[]) call has been REMOVED — it
  // wrote a SEPARATE backend field (activeSpells: ?[Nat]) that the load effect
  // (@~1777) never reads, so it could only ever drift from spellBarOrder and
  // cause the bar to revert on reload. spellBarOrder is now the single
  // authority; no new backend field or endpoint was added.
  //
  // STORAGE DISCIPLINE: persistence is ONE compact [Text] array field
  // (spellBarOrder) on the character — a single tiny blob, debounced writes
  // only on change. No per-slot records, no chatty per-item writes.
  //
  // Equip/swap handler: ONLY changes the slot -> spellId mapping.
  // It must NEVER add to or remove from ownedSpells. The underlying
  // spell library (ownedSpells) is immutable with respect to equipping.
  const handleSetActiveSpells = (spells: SpellConfig[]) => {
    // FIX 2a: Do NOT silently drop spell-bar changes made during battle.
    // The bar is locked mid-fight (applying immediately would desync the
    // active battle), so we queue the requested list and flush it in
    // cleanupBattle once inBattleRef flips false. The user gets an immediate
    // toast so the swap is never a silent no-op.
    if (inBattleRef.current) {
      pendingSpellBarRef.current = spells;
      toast("⚔️ Changes will apply after battle", {
        duration: 4000,
        style: {
          background: "#1a0a0a",
          border: "1px solid #8b0000",
          color: "#ffaaaa",
        },
      });
      logDebugInfo("SPELLS", "[SPELLBAR] queued for after battle", {
        count: spells.length,
      });
      return;
    }
    // Extract IDs from the 8 slots (null for empty slots)
    const ids = [...spells, ...Array(8).fill(null)]
      .slice(0, 8)
      .map((s) => (s as SpellConfig | null)?.id ?? null);
    // (a) Update the slot mapping — activeSpells re-derives via useMemo.
    setActiveSpellIds(ids.filter((id): id is string => id !== null));
    try {
      // localStorage is a CACHE only — backend (spellBarOrder) is authoritative.
      localStorage.setItem(nsKey("pbv_active_spells"), JSON.stringify(ids));
    } catch {
      // ignore
    }
    // (b) Persist via the SINGLE debounced setSpellBarOrder save.
    // Pre-filter to owned ids + cap at 8 to avoid unnecessary backend errors
    // (backend remains authoritative). The debounce coalesces rapid equip/swap
    // clicks into a single backend call (matches ChallengePanel.tsx line 212
    // and DraggablePanel.tsx line 187).
    if (actor) {
      const ownedIdSet = new Set(ownedSpells.map((s) => s.id));
      const orderIds = ids
        .filter(
          (id): id is string =>
            id !== null && id !== undefined && id !== "" && ownedIdSet.has(id),
        )
        .slice(0, 8);
      if (setSpellBarOrderDebounceRef.current) {
        clearTimeout(setSpellBarOrderDebounceRef.current);
      }
      setSpellBarOrderDebounceRef.current = setTimeout(() => {
        setSpellBarOrderDebounceRef.current = null;
        // FIX 2b: Verify the backend round-trip. The actor returns a Motoko
        // variant {#ok,#err:Text}. We inspect the resolved value and log the
        // actual result (non-throttled — this fires at most once per debounce).
        // Network/actor-throw failures still hit .catch and are logged as a
        // save failure (distinct from a backend #err).
        (actor as ActorAny)
          .setSpellBarOrder(BigInt(characterSlot), orderIds)
          .then((result: unknown) => {
            // Motoko {#ok} / {#err:Text} variants arrive as { _ok: null } or
            // { _err: string } in the JS binding. isSpellBarErr narrows to a
            // single discriminated shape so the err message is type-safe.
            if (isSpellBarErr(result)) {
              logDebugError("SPELLS", "[SPELLBAR] saved #err", {
                msg: spellBarErrMsg(result),
                slot: characterSlot,
                orderIds,
              });
              console.error(
                "[SpellOrderSave] setSpellBarOrder #err:",
                spellBarErrMsg(result),
              );
            } else {
              logDebugInfo("SPELLS", "[SPELLBAR] saved #ok", {
                slot: characterSlot,
                orderIds,
              });
            }
          })
          .catch((e: unknown) => {
            logDebugError("SPELLS", "[SPELLBAR] save failed", {
              error: String(e),
              slot: characterSlot,
              orderIds,
            });
            console.error("[SpellOrderSave] setSpellBarOrder failed:", e);
          });
      }, 1000);
    }
  };
  // FIX 2c: Keep the ref mirror in sync with the latest handler closure on
  // every render. This is a top-level statement (not inside an effect) so it
  // runs unconditionally and cleanupBattle always sees the current handler.
  handleSetActiveSpellsRef.current = handleSetActiveSpells;

  // Flush spell IDs to localStorage on page unload so a crash/reload always has the latest loadout.
  const activeSpellIdsForSaveRef = useRef<string[]>(activeSpellIds);
  useEffect(() => {
    activeSpellIdsForSaveRef.current = activeSpellIds;
  }, [activeSpellIds]);
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userId && characterSlot !== null && characterSlot !== undefined) {
        localStorage.setItem(
          nsKey("pbv_active_spells"),
          JSON.stringify(activeSpellIdsForSaveRef.current),
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [userId, characterSlot, nsKey]);

  // STEP 2: Clear any pending debounced setSpellBarOrder save on unmount so we
  // never leave a dangling timeout pointing at a stale actor/closure.
  useEffect(
    () => () => {
      if (setSpellBarOrderDebounceRef.current) {
        clearTimeout(setSpellBarOrderDebounceRef.current);
        setSpellBarOrderDebounceRef.current = null;
      }
    },
    [],
  );

  // FIX: Keep volatile battle state in refs so the render callback never has them in its dep array.
  // Changing a selected spell must NOT cause the animation loop to restart (causes black frame).
  const [spellSelectionVersion, setSpellSelectionVersion] = useState(0);
  const selectedSpellIdRef = useRef<string | null>(null);
  // M5: Also clear spell range cache when player moves (position change)
  // biome-ignore lint/correctness/useExhaustiveDependencies: playerPosition is a plain object — structural comparison is intentional
  useEffect(() => {
    spellRangeCacheRef.current.clear();
  }, [playerPosition]);
  const [spellbookOpen, setSpellbookOpen] = useState(false);

  // FIX 5: Spell level tracking and Doka upgrade — restore from backend character if available
  const [spellLevels, setSpellLevels] = useState<Record<string, number>>(() => {
    // Prefer backend-saved spell levels from character prop
    if (
      character?.spellLevelKeys?.length > 0 &&
      character?.spellLevelValues?.length > 0
    ) {
      const result: Record<string, number> = {};
      const keys = (character?.spellLevelKeys ?? []) as string[];
      const vals = (character?.spellLevelValues ?? []) as (bigint | number)[];
      keys.forEach((k, i) => {
        result[k] = Number(vals[i] ?? 0);
      });
      return result;
    }
    try {
      // M6: Try namespaced key first, fall back to legacy for migration
      const namespacedKey = userId
        ? `${userId}_slot${characterSlot}_pbv_spell_levels`
        : "pbv_spell_levels";
      const saved =
        localStorage.getItem(namespacedKey) ??
        localStorage.getItem("pbv_spell_levels");
      if (saved && userId) localStorage.setItem(namespacedKey, saved); // migrate
      if (saved) return JSON.parse(saved) as Record<string, number>;
    } catch {
      /* ignore */
    }
    return {};
  });
  const spellLevelsRef = useRef<Record<string, number>>({});
  useEffect(() => {
    spellLevelsRef.current = spellLevels;
  }, [spellLevels]);

  const handleUpgradeSpell = useCallback(
    (spellId: string, cost: number) => {
      if (dokaBalance < cost) return;
      const newDoka = dokaBalance - cost;
      onDokaBalanceChange(newDoka);
      setSpellLevels((prev) => {
        const next = { ...prev, [spellId]: (prev[spellId] ?? 0) + 1 };
        try {
          // M6: Use namespaced key for per-character spell levels
          localStorage.setItem(nsKey("pbv_spell_levels"), JSON.stringify(next));
        } catch {
          /* ignore */
        }
        // Save to backend after upgrade — derive character info from props directly
        if (actor) {
          setCharacterStats((stats) => {
            const spellKeys = Object.keys(next);
            const spellVals = spellKeys.map((k) => BigInt(next[k] ?? 0));
            const rawColors = character?.colors;
            const charColors = Array.isArray(rawColors)
              ? [
                  rawColors[0] ?? "#F5F5F5",
                  rawColors[1] ?? "#D3D3D3",
                  rawColors[2] ?? "#000000",
                ]
              : ["#F5F5F5", "#D3D3D3", "#000000"];
            const charToSave = {
              name: character?.name ?? "Adventurer",
              pieceType: character?.pieceType ?? "king",
              colors: charColors,
              pixelPattern: "",
              rotation: BigInt(0),
              level: BigInt(stats.level),
              experience: BigInt(stats.exp),
              dokaBalance: BigInt(newDoka),
              stats: {
                hp: BigInt(stats.hp),
                ap: BigInt(stats.ap),
                mp: BigInt(stats.mp),
                sp: BigInt(stats.sp),
                sr: BigInt(stats.sr),
                init: BigInt(stats.init),
                res: BigInt(stats.res),
                chc: BigInt(stats.chc),
                atk: BigInt(0),
                resilience: BigInt(0),
                evasion: BigInt(0),
                killCount: BigInt(character?.stats?.killCount ?? 0),
              },
              spellLevelKeys: spellKeys,
              spellLevelValues: spellVals,
            };
            (async () => {
              try {
                await actor.updateCharacter(BigInt(characterSlot), charToSave);
              } catch (err) {
                console.warn("[PBV] Character save failed:", err);
                const savedSlot = BigInt(characterSlot);
                const savedUpdate = charToSave;
                pendingSavesRef.current.push(() =>
                  actor.updateCharacter(savedSlot, savedUpdate),
                );
              }
            })();
            return stats;
          });
        }
        return next;
      });
    },
    [dokaBalance, onDokaBalanceChange, actor, character, characterSlot, nsKey],
  );

  // Character stats with experience system — restore from backend character if available
  const [characterStats, setCharacterStats] = useState<CharacterStats>(() => {
    const savedLevel = character?.level != null ? Number(character.level) : 1;
    const savedExp =
      character?.experience != null ? Number(character.experience) : 0;
    const s = character?.stats;
    const expToNext = Math.floor(100 * 2 ** (savedLevel - 1));
    return {
      hp: s?.hp != null ? Number(s.hp) : 100,
      maxHp: s?.hp != null ? Number(s.hp) : 100,
      ap: s?.ap != null ? Number(s.ap) : 4,
      maxAp: s?.ap != null ? Number(s.ap) : 4,
      mp: s?.mp != null ? Number(s.mp) : 3,
      maxMp: s?.mp != null ? Number(s.mp) : 3,
      sp: s?.sp != null ? Number(s.sp) : 2,
      sr: s?.sr != null ? Number(s.sr) : 0,
      init: s?.init != null ? Number(s.init) : 10,
      res: s?.res != null ? Number(s.res) : 0,
      chc: s?.chc != null ? Number(s.chc) : 1,
      fail: 0,
      level: savedLevel,
      exp: savedExp,
      expToNext,
    };
  });

  // Doka balance is owned by GameFlow; no re-sync needed here.

  // Get effective stat modifier for a combatant from active effects
  const getStatModifier = useCallback(
    (
      targetId: string,
      stat: string,
      activeEffectsSnap: ActiveEffect[],
    ): number => {
      let multiplier = 1;
      let additive = 0;
      for (const eff of activeEffectsSnap) {
        if (eff.targetId !== targetId || eff.stat !== stat) continue;
        if (eff.type === "buff" || eff.type === "debuff") {
          if (stat === "mp" || stat === "ap") {
            additive += eff.modifier ?? 0;
          } else {
            multiplier *= eff.modifier ?? 1;
          }
        }
      }
      return stat === "mp" || stat === "ap" ? additive : multiplier;
    },
    [],
  );

  const computeDamage = useCallback(
    (
      baseDamage: number,
      spellId: string,
      targetEnemy: Enemy,
      gridPos: { x: number; y: number },
      isPhysical: boolean,
      isCrit: boolean,
      effects: ActiveEffect[],
    ): { finalDamage: number; breakdown: string } => {
      let dmg = baseDamage;
      let breakdownParts: string[] = [`Base ${dmg}`];

      const scaledDmg = calcScaledDamage(
        dmg,
        characterStats.level,
        spellLevelsRef.current[spellId] ?? 0,
      );
      if (scaledDmg !== dmg) {
        dmg = scaledDmg;
        breakdownParts.push(`scaled = ${dmg}`);
      }

      // SP (Spell Power): flat % bonus to spell damage AND healing (SP 8 = +8%).
      // Applied to spell damage only (physical attacks do not benefit from SP).
      if (!isPhysical && characterStats.sp > 0) {
        dmg = Math.floor(dmg * (1 + characterStats.sp / 100));
        breakdownParts.push(`SP +${characterStats.sp}% = ${dmg}`);
      }

      const dmgMod = getStatModifier("player", "dmg", effects);
      if (dmgMod !== 1) {
        dmg = Math.floor(dmg * dmgMod);
        breakdownParts.push(`×${dmgMod.toFixed(1)} buff = ${dmg}`);
      }

      const markKey = `${gridPos.x},${gridPos.y}`;
      if (markedTilesRef.current.has(markKey)) {
        dmg *= 2;
        breakdownParts.push(`×2 mark = ${dmg}`);
      }

      if (isCrit) {
        dmg *= 2;
        breakdownParts.push(`CRIT ×2 = ${dmg}`);
      }

      // RES (Resistance): flat % reduction to ALL incoming damage.
      // SR (Spell Resistance): flat % reduction to incoming SPELL damage only
      // (excludes physical and DoT ticks). Stacking is multiplicative:
      //   spells:  finalDamage = baseDamage * (1 - SR/100) * (1 - RES/100)
      //   physical/DoT: finalDamage = baseDamage * (1 - RES/100)
      const resMod = getStatModifier(targetEnemy.id, "res", effects);
      const effectiveRes = targetEnemy.res * resMod;
      const resFactor = Math.max(0, 1 - effectiveRes / 100);

      if (isPhysical) {
        dmg = Math.max(1, Math.round(dmg * resFactor));
        if (effectiveRes > 0)
          breakdownParts.push(`RES ${effectiveRes.toFixed(1)}% = ${dmg}`);
      } else {
        const srMod = getStatModifier(targetEnemy.id, "sr", effects);
        const effectiveSr = (targetEnemy.sr ?? 0) * srMod;
        const srFactor = Math.max(0, 1 - effectiveSr / 100);
        dmg = Math.max(1, Math.round(dmg * srFactor * resFactor));
        if (effectiveSr > 0 || effectiveRes > 0)
          breakdownParts.push(
            `SR ${effectiveSr.toFixed(1)}% × RES ${effectiveRes.toFixed(1)}% = ${dmg}`,
          );
      }

      return { finalDamage: dmg, breakdown: breakdownParts.join(" → ") };
    },
    [characterStats.level, characterStats.sp, getStatModifier],
  );

  const calculatePlayerDamage = useCallback(
    (
      baseDamage: number,
      spellId: string,
      targetEnemy: Enemy,
      gridPos: { x: number; y: number },
      isPhysical: boolean,
      isCrit: boolean,
      effects: ActiveEffect[],
    ): { finalDamage: number; breakdown: string } => {
      const result = computeDamage(
        baseDamage,
        spellId,
        targetEnemy,
        gridPos,
        isPhysical,
        isCrit,
        effects,
      );
      const markKey = `${gridPos.x},${gridPos.y}`;
      if (markedTilesRef.current.has(markKey)) {
        markedTilesRef.current.delete(markKey);
      }
      return result;
    },
    [computeDamage],
  );

  // Feature 1: Passive HP regen — 1 HP every 10 seconds out of battle when not at full HP
  const maxHp = useMemo(() => {
    // Derive max HP from base (100) with level scaling based on levelUpConfig
    const growthRate = (levelUpConfig.statGrowthPercent ?? 5) / 100;
    return Math.floor(
      100 * (1 + ((characterStats?.level ?? 1) - 1) * growthRate),
    );
  }, [characterStats?.level, levelUpConfig.statGrowthPercent]);

  const playerTakesDamage = useCallback(
    (incomingDamage: number, source: string): number => {
      let dmg = incomingDamage;
      // RES (Resistance): flat % reduction to ALL incoming damage (including DoT ticks).
      // DoT ticks do NOT apply SR — only RES. Stacking: finalDamage = baseDamage * (1 - RES/100).
      const effRes =
        Number(characterStats.res) *
        getStatModifier("player", "res", activeEffectsRef.current);
      dmg = Math.max(1, Math.round(dmg * Math.max(0, 1 - effRes / 100)));
      if (shieldHpRef.current > 0) {
        const absorb = Math.min(shieldHpRef.current, dmg);
        shieldHpRef.current -= absorb;
        dmg -= absorb;
        if (absorb > 0)
          logBattleEntry(`Shield absorbed ${absorb} damage`, "#a855f7");
      }
      const newHp = Math.max(0, characterStats.hp - dmg);
      setCharacterStats((prev) => ({ ...prev, hp: newHp }));
      logBattleEntry(`Player took ${dmg} damage from ${source}`, "#ef4444");
      const _em = effectsManagerRef.current;
      _em.triggerHitFlash("player");
      _em.triggerShake(4);
      return dmg;
    },
    [characterStats.res, characterStats.hp, getStatModifier, logBattleEntry],
  );

  const enemyTakesDamage = useCallback(
    (
      enemyId: string,
      incomingDamage: number,
      casterId: string,
      source: string,
      isCrit = false,
    ): number => {
      const enemy = getLiveCombatants(combatantStoreCtx).find(
        (e) => e.id === enemyId,
      );
      if (!enemy) return 0;
      // RES (Resistance): flat % reduction to ALL incoming damage (including DoT ticks).
      // DoT ticks (source === "dot") do NOT apply SR — only RES.
      // Non-DoT spell damage would apply SR here too, but the inline computeDamage
      // already applies SR+RES for spell hits; this path is the fallback for DoT
      // ticks and direct enemy damage, so we apply RES only (matching the DoT rule).
      const effRes =
        Number(enemy.res) *
        getStatModifier(enemyId, "res", activeEffectsRef.current);
      const effDmg =
        incomingDamage *
        getStatModifier(casterId, "dmg", activeEffectsRef.current);
      const dmg = Math.max(
        1,
        Math.round(effDmg * Math.max(0, 1 - effRes / 100)),
      );
      const _dmgAfterMods = mapModifierRegistry.applyDamageDealt(
        casterId === "player"
          ? ({
              hp: characterStats.hp,
              maxHp: characterStats.hp,
              id: "player",
              isEnemy: false,
            } as any)
          : combatantsRef.current.find((c) => (c as any).id === casterId) ||
              ({ hp: 0, id: casterId } as any),
        enemy,
        dmg,
        activeMapModifierTypes,
        {
          log: (msg: string) => logDebugInfo("MODIFIER", msg),
          rng: Math.random,
        },
      );
      const newHp = Math.max(0, enemy.hp - _dmgAfterMods);
      setEnemyHpMap((prev) => ({ ...prev, [enemyId]: newHp }));
      // Route the HP update through the combatant store so the ref mirrors
      // stay in sync; the subsequent removeCombatant (on death) filters the
      // enemy out atomically, so a separate setEnemies filter is redundant.
      updateCombatant(combatantStoreCtx, enemyId, { hp: newHp });
      logBattleEntry(`${enemyId} took ${dmg} damage from ${source}`, "#ef4444");
      const _em = effectsManagerRef.current;
      _em.spawnDamageNumber(0, 0, dmg, isCrit ? "crit" : "damage");
      _em.triggerHitFlash(String(enemyId));
      _em.triggerShake(isCrit ? 8 : 4);
      if (isCrit) _em.triggerHitStop();
      if (newHp === 0) {
        _em.triggerDeath(String(enemyId), enemy.x, enemy.y);
        removeCombatant(combatantStoreCtx, enemyId);
        dumpStateSync("kill", combatantStoreCtx);
      }
      return dmg;
    },
    [
      getStatModifier,
      logBattleEntry,
      combatantStoreCtx,
      activeMapModifierTypes,
      characterStats.hp,
    ],
  );

  // EXP6: Handle item use from BuffShop
  const handleUseItem = useCallback(
    (itemType: BuffItemType) => {
      const logItem = (msg: string, color = "#22c55e") => {
        if (addBattleLogEntry)
          addBattleLogEntry({
            id: `item-${Date.now()}`,
            timestamp: nowTimestamp(),
            text: msg,
            color,
          });
      };
      switch (itemType) {
        case "health_potion": {
          const heal30 = Math.floor(maxHp * 0.3);
          setCharacterStats((prev) => ({
            ...prev,
            hp: Math.min(maxHp, prev.hp + heal30),
          }));
          logItem(`🧪 Health Potion! Restored ${heal30} HP.`);
          break;
        }
        case "greater_health_potion": {
          const heal70 = Math.floor(maxHp * 0.7);
          setCharacterStats((prev) => ({
            ...prev,
            hp: Math.min(maxHp, prev.hp + heal70),
          }));
          logItem(`💊 Greater Potion! Restored ${heal70} HP.`);
          break;
        }
        case "battle_elixir":
          setCurrentBattleAp((prev) => prev + 3);
          logItem("⚡ Battle Elixir! +3 AP this turn.", "#60a5fa");
          break;
        case "swift_boots":
          setCurrentBattleMp((prev) => prev + 2);
          logItem("👟 Swift Boots! +2 MP this turn.", "#34d399");
          break;
        case "shield_charm":
          shieldHpRef.current = 20;
          logItem("🛡️ Shield Charm! Absorbs next 20 damage.", "#818cf8");
          break;
        case "fury_potion":
          furyRef.current = { turnsLeft: 3 };
          logItem("💢 Fury Potion! +25% damage for 3 turns.", "#f97316");
          break;
        default:
          break;
      }
    },
    [addBattleLogEntry, maxHp],
  );

  /** M5: Compute enemy max HP from levelUpConfig rather than hardcoded * 10 */
  const calcEnemyMaxHp = useCallback(
    (enemyLevel: number): number => {
      const growthRate = (levelUpConfig.statGrowthPercent ?? 5) / 100;
      // Enemy base HP is 50; scales at same rate as player
      return Math.floor(50 * (1 + (enemyLevel - 1) * growthRate));
    },
    [levelUpConfig.statGrowthPercent],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Guard: skip regen if battle is active (use ref to avoid stale closure)
      if (inBattleRef.current) return;
      setCharacterStats((prev) => {
        if (prev.hp >= maxHp) return prev;
        return { ...prev, hp: Math.min(maxHp, prev.hp + 1) };
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [maxHp]);

  // Level/spell-based achievement checks (placed here, after characterStats/spellLevels/activeSpells are declared)
  useEffect(() => {
    if (inBattle) return;
    if (characterStats.level >= 10) checkAndFireAchievement("level_10", false);
    if (Object.values(spellLevels).some((l) => l >= 5))
      checkAndFireAchievement("spell_level_5", false);
    if (activeSpells.length >= 8)
      checkAndFireAchievement("spell_master_8", false);
  }, [
    characterStats.level,
    spellLevels,
    activeSpells.length,
    inBattle,
    checkAndFireAchievement,
  ]);

  // Spell fail chance based on player level
  const spellFailChance = Math.max(
    0,
    levelUpConfig.spellFailBaseChance -
      (characterStats.level - 1) * levelUpConfig.spellFailReductionPerLevel,
  );

  // Effective spell range bonus based on level
  const getEffectiveSpellRange = useCallback(
    (baseRange: number, spellId?: string): number => {
      const levelBonus = Math.floor(
        (characterStats?.level ?? 1) / levelUpConfig.spellRangeGrowthLevels,
      );
      const modBonus = spellId
        ? (modifiableRangeBonusRef.current.get(spellId)?.delta ?? 0)
        : 0;
      return Math.min(
        baseRange + levelBonus + modBonus,
        levelUpConfig.maxSpellRange,
      );
    },
    [characterStats?.level, levelUpConfig],
  );

  // Character data from character creation
  // Normalize colors: handle both array and object formats from backend — store in ref so it never re-derives
  // Always re-derive colors so edits from character creation are immediately reflected
  const charColorsRef = useRef<{
    primary: string;
    secondary: string;
    accent: string;
  }>({ primary: "#F5F5F5", secondary: "#D3D3D3", accent: "#000000" });
  {
    const raw = character?.colors;
    if (Array.isArray(raw)) {
      charColorsRef.current = {
        primary: raw[0] ?? "#F5F5F5",
        secondary: raw[1] ?? "#D3D3D3",
        accent: raw[2] ?? "#000000",
      };
    } else if (raw && typeof raw === "object" && "primary" in raw) {
      charColorsRef.current = raw as {
        primary: string;
        secondary: string;
        accent: string;
      };
    }
  }
  const colors = charColorsRef.current;
  const pieceType: ChessPieceType = character?.pieceType || "king";
  const characterName: string = character?.name || "Adventurer";

  // chessPiecePatterns now imported from ../data/pieceArt (see import near top).
  // Determine current region from backend configs matching player level
  const _currentRegionEffects = (() => {
    const level = characterStats.level;
    const match = regionConfigs.find(
      (r) => level >= Number(r.levelMin) && level <= Number(r.levelMax),
    );
    if (!match) return [];
    return match.battleEffects.map((e) => e.description);
  })();

  // Draw portrait canvas whenever character, colors, or pieceType changes
  useEffect(() => {
    const canvas = portraitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0a0c18";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pattern = chessPiecePatterns[pieceType].front;
    const pixelSize = 6;
    const patternW = pattern[0].length * pixelSize;
    const patternH = pattern.length * pixelSize;
    const startX = Math.floor((canvas.width - patternW) / 2);
    const startY = Math.floor((canvas.height - patternH) / 2);

    // Re-derive colors directly from character prop to avoid stale ref
    const rawColors = character?.colors;
    let drawPrimary = colors.primary;
    let drawSecondary = colors.secondary;
    let drawAccent = colors.accent;
    if (Array.isArray(rawColors)) {
      drawPrimary = rawColors[0] ?? "#F5F5F5";
      drawSecondary = rawColors[1] ?? "#D3D3D3";
      drawAccent = rawColors[2] ?? "#000000";
    } else if (
      rawColors &&
      typeof rawColors === "object" &&
      "primary" in rawColors
    ) {
      drawPrimary = (rawColors as { primary: string }).primary;
      drawSecondary = (rawColors as { secondary: string }).secondary;
      drawAccent = (rawColors as { accent: string }).accent;
    }

    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        const v = pattern[row][col];
        if (v === 0) continue;
        ctx.fillStyle =
          v === 1
            ? drawSecondary || "#D3D3D3"
            : v === 2
              ? drawPrimary || "#F5F5F5"
              : drawAccent || "#000000";
        ctx.fillRect(
          startX + col * pixelSize,
          startY + row * pixelSize,
          pixelSize,
          pixelSize,
        );
      }
    }
  }, [pieceType, colors, character]);

  // O5: Tile screen-position cache — keyed by "gx,gy".
  // Populated lazily on first call; invalidated on resize, camera change, or new map.
  const tileScreenCacheRef = useRef<Map<string, { x: number; y: number }>>(
    new Map(),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: isDesktop is stable (never changes at runtime) and cameraRef is intentionally excluded to avoid re-creating this on every camera move
  const gridToScreen = useCallback(
    (gridX: number, gridY: number) => {
      // O5: Serve from cache when available (avoids recalculating inside render loop).
      const key = `${gridX},${gridY}`;
      const cached = tileScreenCacheRef.current.get(key);
      if (cached) return cached;

      const mapH = WORLD_GRID_SIZE * effectiveTileH;
      const camX = isDesktop ? 0 : cameraRef.current.x;
      const camY = isDesktop ? 0 : cameraRef.current.y;
      const originX = canvasSize.width / 2 + camX;
      const originY =
        (canvasSize.height - mapH) / 2 + effectiveTileH / 2 + camY;
      const screenX = (gridX - gridY) * (effectiveTileW / 2) + originX;
      const screenY = (gridX + gridY) * (effectiveTileH / 2) + originY;
      const result = { x: Math.round(screenX), y: Math.round(screenY) };
      tileScreenCacheRef.current.set(key, result);
      return result;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvasSize, effectiveTileW, effectiveTileH],
  );

  // Invalidate tile cache whenever layout inputs change (same deps as gridToScreen).
  // E1: isDesktop removed — cache only needs to reset on actual canvas/tile size
  // changes, not every window resize that toggles the boolean.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // biome-ignore lint/correctness/useExhaustiveDependencies: deps are intentional cache-bust triggers, not read inside callback
  useEffect(() => {
    tileScreenCacheRef.current.clear();
  }, [canvasSize, effectiveTileW, effectiveTileH]);

  // Return the visual center of a tile for VFX origin (mid-diamond)
  // gridToScreen gives the TOP vertex; center is tH/2 below + CHARACTER_Y_OFFSET for characters
  const tileCenter = useCallback(
    (gridX: number, gridY: number) => {
      const { x, y } = gridToScreen(gridX, gridY);
      return { x, y: y + effectiveTileH / 2 };
    },
    [gridToScreen, effectiveTileH],
  );

  // Convert screen coordinates to grid coordinates
  // gridToScreen returns the TOP VERTEX of the tile diamond (x, y).
  // drawIsometricTile draws from the top vertex so tile center is at (sx, sy + tH/2).
  // To hit-test correctly, we must offset the click by -tH/2 in Y (treating click as aimed at tile center).
  const _screenToGrid = useCallback(
    (screenX: number, screenY: number) => {
      const mapH = WORLD_GRID_SIZE * effectiveTileH;
      const camX = isDesktop ? 0 : cameraRef.current.x;
      const camY = isDesktop ? 0 : cameraRef.current.y;
      const originX = canvasSize.width / 2 + camX;
      const originY =
        (canvasSize.height - mapH) / 2 + effectiveTileH / 2 + camY;
      const hW = effectiveTileW / 2;
      const hH = effectiveTileH / 2;
      // Adjust y: clicks aim at tile center, which is hH below the top vertex
      const dx = screenX - originX;
      const dy = screenY - hH - originY;
      const gridX = Math.round((dx / hW + dy / hH) / 2);
      const gridY = Math.round((dy / hH - dx / hW) / 2);
      return { x: gridX, y: gridY };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvasSize, effectiveTileW, effectiveTileH, isDesktop],
  );

  // FIXED: Draw pixel pattern with perfect tile alignment - patterns now match tile dimensions exactly
  const drawPixelPattern = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      pattern: number[][],
      x: number,
      y: number,
      colors: {
        primary: string;
        secondary: string;
        accent: string;
        extra?: string;
      },
      scale: { x: number; y: number } = { x: 1, y: 1 },
    ) => {
      const pixelSize = 3;
      const patternWidth = pattern[0].length * pixelSize * scale.x;
      const patternHeight = pattern.length * pixelSize * scale.y;

      // FIXED: Perfect centering using Math.round for pixel-perfect alignment, matching battle mode exactly
      const startX = Math.round(x - patternWidth / 2);
      const startY = Math.round(y - patternHeight / 2);

      for (let row = 0; row < pattern.length; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
          const pixelValue = pattern[row][col];
          if (pixelValue === 0) continue;

          let color = colors.primary;
          if (pixelValue === 1) color = colors.secondary;
          if (pixelValue === 2) color = colors.accent;
          if (pixelValue === 3 && colors.extra) color = colors.extra;

          ctx.fillStyle = color;
          ctx.fillRect(
            Math.round(startX + col * pixelSize * scale.x),
            Math.round(startY + row * pixelSize * scale.y),
            Math.ceil(pixelSize * scale.x),
            Math.ceil(pixelSize * scale.y),
          );
        }
      }

      ctx.restore();
    },
    [],
  );

  // Draw animated portal whirlpool
  function getBossPixelPattern(bossId: string): {
    pattern: number[][];
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      extra?: string;
    };
  } {
    const P: Record<
      string,
      {
        pattern: number[][];
        colors: {
          primary: string;
          secondary: string;
          accent: string;
          extra?: string;
        };
      }
    > = {
      boss_1: {
        pattern: [
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 1, 2, 2, 1, 0, 0],
          [0, 0, 0, 3, 3, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
        ],
        colors: {
          primary: "#f5f0e8",
          secondary: "#f5f0e8",
          accent: "#1a1a1a",
          extra: "#8b0000",
        },
      },
      boss_2: {
        pattern: [
          [0, 0, 2, 1, 1, 2, 0, 0],
          [0, 2, 1, 2, 2, 1, 2, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 3, 1, 1, 3, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
        ],
        colors: {
          primary: "#8b0000",
          secondary: "#8b0000",
          accent: "#cc0000",
          extra: "#ff4444",
        },
      },
      boss_3: {
        pattern: [
          [0, 0, 2, 3, 3, 2, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 2, 1, 1, 1, 1, 2, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
        ],
        colors: {
          primary: "#1a0a2e",
          secondary: "#1a0a2e",
          accent: "#6b21a8",
          extra: "#c0c0c0",
        },
      },
      boss_4: {
        pattern: [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 3, 1, 1, 3, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 2, 1, 1, 1, 1, 2, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 3, 1, 1, 3, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 1, 0, 0, 0, 0, 1, 0],
        ],
        colors: {
          primary: "#f5deb3",
          secondary: "#f5deb3",
          accent: "#1a1a1a",
          extra: "#8b7355",
        },
      },
      boss_5: {
        pattern: [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
        ],
        colors: {
          primary: "#d3d3c0",
          secondary: "#d3d3c0",
          accent: "#1a1a1a",
          extra: "#888877",
        },
      },
      boss_6: {
        pattern: [
          [0, 0, 2, 1, 1, 2, 0, 0],
          [0, 2, 1, 2, 2, 1, 2, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [2, 1, 1, 2, 2, 1, 1, 2],
          [1, 2, 3, 1, 1, 3, 2, 1],
          [1, 1, 2, 1, 1, 2, 1, 1],
          [0, 1, 1, 2, 2, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
        ],
        colors: {
          primary: "#0a0a1a",
          secondary: "#0a0a1a",
          accent: "#2a1a4a",
          extra: "#fffacd",
        },
      },
      boss_7: {
        pattern: [
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 2, 1, 1, 2, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 2, 1, 1, 1, 1, 2, 1],
          [0, 3, 1, 1, 1, 1, 3, 0],
          [0, 3, 0, 1, 1, 0, 3, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 3, 0, 0, 0, 0, 3, 0],
        ],
        colors: {
          primary: "#556b2f",
          secondary: "#556b2f",
          accent: "#3d4f22",
          extra: "#8b0000",
        },
      },
      boss_8: {
        pattern: [
          [0, 0, 1, 3, 3, 1, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [1, 1, 0, 0, 0, 0, 1, 1],
        ],
        colors: {
          primary: "#cd7f32",
          secondary: "#cd7f32",
          accent: "#8b5513",
          extra: "#1a1a1a",
        },
      },
      boss_9: {
        pattern: [
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 3, 3, 3, 2, 0, 0],
          [1, 1, 1, 0, 2, 2, 2, 0],
          [1, 1, 1, 0, 2, 2, 2, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [1, 1, 1, 0, 2, 2, 2, 0],
          [1, 1, 1, 0, 2, 2, 2, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 0, 1, 0, 2, 0, 0, 0],
        ],
        colors: {
          primary: "#f8f8f8",
          secondary: "#f8f8f8",
          accent: "#0a0a0a",
          extra: "#888888",
        },
      },
      boss_10: {
        pattern: [
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 0, 1],
          [1, 0, 1, 3, 3, 1, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 0, 1, 1, 0, 1, 1],
          [1, 3, 0, 1, 1, 0, 3, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 0, 1],
          [1, 3, 1, 1, 1, 1, 3, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 3, 0, 0, 0, 0, 3, 0],
        ],
        colors: {
          primary: "#800000",
          secondary: "#800000",
          accent: "#5a0000",
          extra: "#fffacd",
        },
      },
      boss_11: {
        pattern: [
          [0, 3, 1, 3, 3, 1, 3, 0],
          [3, 1, 1, 1, 1, 1, 1, 3],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [3, 1, 1, 1, 1, 1, 1, 3],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [3, 1, 3, 1, 1, 3, 1, 3],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [3, 1, 1, 1, 1, 1, 1, 3],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 3, 1, 0, 0, 1, 3, 0],
          [0, 0, 3, 0, 0, 3, 0, 0],
        ],
        colors: {
          primary: "#e0f0ff",
          secondary: "#e0f0ff",
          accent: "#ffffff",
          extra: "#ffa500",
        },
      },
      boss_12: {
        pattern: [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 1, 0, 0, 0, 0, 1, 0],
        ],
        colors: {
          primary: "#808080",
          secondary: "#808080",
          accent: "#666666",
          extra: "#999999",
        },
      },
      alabaster_fortress: {
        pattern: [
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 2, 2, 2, 2, 2, 2, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 2, 2, 2, 2, 2, 2, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 2, 2, 2, 2, 2, 2, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [2, 2, 2, 2, 2, 2, 2, 2],
        ],
        colors: {
          primary: "#f0ede0",
          secondary: "#f0ede0",
          accent: "#8b1a1a",
          extra: "#c8c0a8",
        },
      },
      chessboard_lich: {
        pattern: [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 2, 1, 1, 2, 0, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 0, 1, 1, 0, 0, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 2, 3, 2, 3, 2, 3, 0],
          [0, 3, 2, 3, 2, 3, 2, 0],
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
        ],
        colors: {
          primary: "#8ab4c8",
          secondary: "#8ab4c8",
          accent: "#0a0a0a",
          extra: "#f8f8f8",
        },
      },
      mirror_sovereign: {
        pattern: [
          [0, 0, 2, 1, 1, 2, 0, 0],
          [0, 2, 1, 1, 1, 1, 2, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [2, 1, 1, 1, 1, 1, 1, 2],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [3, 1, 1, 1, 1, 1, 1, 3],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [2, 1, 1, 1, 1, 1, 1, 2],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 0, 0, 1, 1, 0],
          [0, 0, 2, 0, 0, 2, 0, 0],
        ],
        colors: {
          primary: "#050505",
          secondary: "#050505",
          accent: "#d4d4d4",
          extra: "#c0c0c0",
        },
      },
      starved_vampire_pawn: {
        pattern: [
          [0, 0, 1, 1, 0, 0, 0, 0],
          [0, 1, 2, 2, 1, 0, 0, 0],
          [0, 1, 1, 1, 1, 0, 0, 0],
          [0, 0, 1, 1, 0, 0, 0, 0],
          [0, 1, 1, 1, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 0, 0],
          [0, 1, 1, 0, 0, 0, 0, 0],
          [1, 1, 0, 0, 0, 0, 0, 0],
        ],
        colors: {
          primary: "#f5f5f0",
          secondary: "#f5f5f0",
          accent: "#8b0000",
          extra: "#d0d0c0",
        },
      },
      pale_archivist: {
        pattern: [
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [0, 1, 3, 1, 1, 3, 1, 0],
          [0, 1, 2, 2, 2, 2, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 2, 1, 3, 3, 1, 2, 1],
          [1, 2, 1, 0, 0, 1, 2, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 2, 1, 1, 2, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
        ],
        colors: {
          primary: "#fffff0",
          secondary: "#fffff0",
          accent: "#d4c9a8",
          extra: "#ffd700",
        },
      },
      twin_monarchs: {
        pattern: [
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [3, 3, 3, 3, 3, 3, 3, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [1, 1, 1, 0, 2, 2, 2, 0],
          [1, 1, 1, 0, 2, 2, 2, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [1, 1, 1, 0, 2, 2, 2, 0],
          [0, 1, 1, 0, 2, 2, 0, 0],
          [0, 1, 0, 0, 0, 2, 0, 0],
        ],
        colors: {
          primary: "#ffd700",
          secondary: "#ffd700",
          accent: "#1a1a2e",
          extra: "#e8e8ff",
        },
      },
      enthroned_void: {
        pattern: [
          [0, 0, 1, 1, 1, 1, 0, 0],
          [0, 2, 1, 0, 0, 1, 2, 0],
          [0, 2, 1, 0, 0, 1, 2, 0],
          [0, 2, 1, 0, 0, 1, 2, 0],
          [0, 2, 1, 0, 0, 1, 2, 0],
          [0, 2, 1, 1, 1, 1, 2, 0],
          [0, 2, 2, 1, 1, 2, 2, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
        ],
        colors: {
          primary: "#050505",
          secondary: "#050505",
          accent: "#6b21a8",
          extra: "#2d1a4a",
        },
      },
    };
    return P[bossId] ?? P.boss_12;
  }
  const getEnemyFamilyPixelPattern = (family: EnemyFamily): number[][] => {
    const patterns: Record<EnemyFamily, number[][]> = {
      wraith_bishop: [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
        [1, 2, 1],
        [1, 2, 1],
        [1, 1, 1],
        [3, 1, 3],
        [0, 3, 0],
      ],
      iron_golem: [
        [1, 1, 1, 1, 1, 1],
        [1, 3, 1, 1, 3, 1],
        [1, 1, 1, 1, 1, 1],
        [2, 1, 1, 1, 1, 2],
        [1, 1, 1, 1, 1, 1],
      ],
      plague_rat: [
        [1, 1, 0, 1, 1, 0],
        [1, 2, 1, 1, 2, 1],
        [1, 1, 1, 1, 1, 1],
        [0, 2, 0, 0, 2, 0],
        [0, 2, 0, 0, 2, 0],
      ],
      ember_knight: [
        [0, 1, 1, 1, 0],
        [1, 1, 3, 1, 1],
        [1, 3, 1, 3, 1],
        [1, 1, 1, 1, 1],
        [1, 2, 1, 2, 1],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 2, 0, 2, 0],
      ],
      tide_shade: [
        [0, 1, 0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [2, 1, 1, 1, 1, 1, 2],
        [3, 3, 1, 1, 1, 3, 3],
      ],
      bone_scribe: [
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [3, 2, 2, 2, 3],
        [3, 2, 1, 2, 3],
        [3, 2, 2, 2, 3],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
      ],
      void_mirror: [
        [2, 2, 2, 2, 2, 2],
        [2, 1, 1, 1, 1, 2],
        [2, 1, 3, 3, 1, 2],
        [2, 1, 3, 3, 1, 2],
        [2, 1, 1, 1, 1, 2],
        [2, 2, 2, 2, 2, 2],
      ],
      default: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
    };
    return patterns[family] ?? patterns.default;
  };

  const getEnemyFamilyColors = (
    family: EnemyFamily,
  ): Record<number, string> => {
    const colorMaps: Record<EnemyFamily, Record<number, string>> = {
      wraith_bishop: { 1: "#6B21A8", 2: "#E2E8F0", 3: "#7C3AED" },
      iron_golem: { 1: "#374151", 2: "#EA580C", 3: "#1F2937" },
      plague_rat: { 1: "#84CC16", 2: "#92400E", 3: "#3F6212" },
      ember_knight: { 1: "#111827", 2: "#F97316", 3: "#FCD34D" },
      tide_shade: { 1: "#0F766E", 2: "#CBD5E1", 3: "#065F46" },
      bone_scribe: { 1: "#FEF3C7", 2: "#0F172A", 3: "#7C3AED" },
      void_mirror: { 1: "#E2E8F0", 2: "#0F172A", 3: "#94A3B8" },
      default: { 1: "#6B7280", 2: "#9CA3AF", 3: "#4B5563" },
    };
    return colorMaps[family] ?? colorMaps.default;
  };

  // Draw animated portal whirlpool
  const drawPortalWhirlpool = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      color: PortalColor,
      animationOffset: number,
    ) => {
      const time = Date.now() * 0.005 + animationOffset;
      const radius = 25;
      // Portal colors — dungeon uses deep crimson, boss uses deep purple, rest uses silver-white
      const portalColors: Record<PortalColor, string[]> = {
        black: ["#000000", "#333333", "#666666"],
        blue: ["#001133", "#003366", "#0066cc"],
        red: ["#330011", "#660033", "#cc0066"],
        green: ["#003311", "#006633", "#00cc66"],
        purple: ["#220033", "#550066", "#9900cc"],
        gold: ["#332200", "#665500", "#cc9900"],
        dungeon: ["#4a0000", "#8b0000", "#cc0000"],
        boss: ["#1a0033", "#5b1fa0", "#9333ea"],
        bossRush: ["#1a0040", "#9900cc", "#ff66ff"],
        progression: ["#2a1a00", "#665500", "#ffcc00"],
        rest: ["#d0d0d0", "#e8e8e8", "#f8f8f8"],
        white: ["#f5f5f5", "#ffffff", "#e8e8e8"],
      };

      const colors = portalColors[color] ?? portalColors.blue;

      // Draw swirling whirlpool effect
      ctx.save();
      ctx.translate(x, y - 10);

      // REST PORTALS: soft concentric silver-white rings, slow gentle rotation
      if (color === "rest") {
        const slowTime = Date.now() * 0.005 * 0.5 + animationOffset;
        // Soft white glow at center
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath();
        ctx.ellipse(0, 0, radius + 8, (radius + 8) * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        // Draw 3 concentric rings: outer, middle, inner
        const ringDefs = [
          { r: radius + 4, color: "#d0d0d0", lw: 2.5, alpha: 0.55 },
          { r: radius - 5, color: "#e8e8e8", lw: 2.0, alpha: 0.7 },
          { r: radius - 13, color: "#f8f8f8", lw: 1.5, alpha: 0.85 },
        ];
        for (const ring of ringDefs) {
          if (ring.r <= 0) continue;
          ctx.globalAlpha =
            ring.alpha * (0.85 + 0.15 * Math.sin(slowTime * 1.2));
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = ring.lw;
          ctx.beginPath();
          ctx.ellipse(0, 0, ring.r, ring.r * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Slowly rotating sparkle dots
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(slowTime * 0.8);
        ctx.fillStyle = "#ffffff";
        for (let s = 0; s < 6; s++) {
          const angle = (s / 6) * Math.PI * 2 + slowTime * 0.4;
          const sx = Math.cos(angle) * (radius - 2);
          const sy = Math.sin(angle) * (radius - 2) * 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
        return;
      }
      // BOSS PORTALS: star burst ring in deep purple, visually unmistakable
      if (color === "boss") {
        ctx.globalAlpha = 0.75 + 0.25 * Math.sin(time * 1.5);
        const spikeCount = 6;
        const outerR = radius + 12;
        const innerR = radius + 4;
        ctx.fillStyle = "#9333ea";
        ctx.beginPath();
        for (let s = 0; s < spikeCount; s++) {
          const baseAngle = (s / spikeCount) * Math.PI * 2 + time * 0.5;
          const tipAngle = baseAngle + Math.PI / spikeCount;
          const bx = Math.cos(baseAngle) * innerR;
          const by = Math.sin(baseAngle) * innerR * 0.5;
          const tx = Math.cos(tipAngle) * outerR;
          const ty = Math.sin(tipAngle) * outerR * 0.5;
          const b2x = Math.cos(baseAngle + (2 * Math.PI) / spikeCount) * innerR;
          const b2y =
            Math.sin(baseAngle + (2 * Math.PI) / spikeCount) * innerR * 0.5;
          if (s === 0) ctx.moveTo(bx, by);
          else ctx.lineTo(bx, by);
          ctx.lineTo(tx, ty);
          ctx.lineTo(b2x, b2y);
        }
        ctx.closePath();
        ctx.fill();
        // Star glyph in center
        ctx.globalAlpha = 0.9 + 0.1 * Math.sin(time * 2);
        ctx.fillStyle = "#e2aeff";
        ctx.font = "bold 14px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("★", 0, 0);
        ctx.globalAlpha = 1;
      }
      // DUNGEON PORTALS: outer diamond-spike ring as unmistakable visual distinguisher
      if (color === "dungeon") {
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(time * 1.2);
        const spikeCount = 8;
        const outerR = radius + 10;
        const innerR = radius + 3;
        ctx.fillStyle = "#cc0000";
        ctx.beginPath();
        for (let s = 0; s < spikeCount; s++) {
          const baseAngle = (s / spikeCount) * Math.PI * 2 + time * 0.3;
          const tipAngle = baseAngle + Math.PI / spikeCount;
          const bx = Math.cos(baseAngle) * innerR;
          const by = Math.sin(baseAngle) * innerR * 0.5;
          const tx = Math.cos(tipAngle) * outerR;
          const ty = Math.sin(tipAngle) * outerR * 0.5;
          const b2x = Math.cos(baseAngle + (2 * Math.PI) / spikeCount) * innerR;
          const b2y =
            Math.sin(baseAngle + (2 * Math.PI) / spikeCount) * innerR * 0.5;
          if (s === 0) ctx.moveTo(bx, by);
          else ctx.lineTo(bx, by);
          ctx.lineTo(tx, ty);
          ctx.lineTo(b2x, b2y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw multiple spiral layers
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = radius - layer * 8;
        const spiralCount = 6 - layer;

        ctx.strokeStyle = colors[layer];
        ctx.lineWidth = 3 - layer;
        ctx.globalAlpha = 0.8 - layer * 0.2;

        for (let i = 0; i < spiralCount; i++) {
          const angle =
            (time + i * ((Math.PI * 2) / spiralCount)) % (Math.PI * 2);
          const spiralRadius =
            layerRadius * (0.3 + 0.7 * Math.sin(time * 0.5 + layer));

          ctx.beginPath();
          for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const r = spiralRadius * (1 - t / (Math.PI * 2));
            const spiralX = Math.cos(angle + t) * r;
            const spiralY = Math.sin(angle + t) * r * 0.5; // Flatten for isometric view

            if (t === 0) {
              ctx.moveTo(spiralX, spiralY);
            } else {
              ctx.lineTo(spiralX, spiralY);
            }
          }
          ctx.stroke();
        }
      }

      ctx.restore();
    },
    [],
  );

  // DOFUS-style isometric tile rendering - stone slab floors, 3D cube walls
  // mapColorFamily: optional per-map tile color palette
  // wallPalette: optional array of hex colors for wall faces
  const drawIsometricTile = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      tileType: TileType,
      gridX: number,
      gridY: number,
      isHovered = false,
      isClicked = false,
      tw = TILE_WIDTH,
      th = TILE_HEIGHT,
      mapColorFamily?: GameMap["colorFamily"],
      wallPalette?: string[],
    ) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + tw / 2, y + th / 2);
      ctx.lineTo(x, y + th);
      ctx.lineTo(x - tw / 2, y + th / 2);
      ctx.closePath();

      if (tileType === "wall") {
        const wallHeight = 28;
        const seed = Math.abs(
          gridX * 397 + gridY * 521 + (gridX + 1) * (gridY + 1) * 7,
        );
        const rng = seededRng(seed);

        // Determine wall base color from palette
        let topR: number;
        let topG: number;
        let topB: number;

        if (wallPalette && wallPalette.length > 0) {
          const paletteIdx = Math.floor(rng() * wallPalette.length);
          const hexColor = wallPalette[paletteIdx].replace("#", "");
          topR = Number.parseInt(hexColor.substring(0, 2), 16);
          topG = Number.parseInt(hexColor.substring(2, 4), 16);
          topB = Number.parseInt(hexColor.substring(4, 6), 16);
        } else {
          const baseGrey = Math.floor(rng() * 16) + 42;
          topR = baseGrey;
          topG = baseGrey;
          topB = baseGrey;
        }

        // Face colors: top lightest, right medium-dark, left darkest
        const topFaceR = Math.min(255, topR + 20);
        const topFaceG = Math.min(255, topG + 20);
        const topFaceB = Math.min(255, topB + 20);
        const rightR = Math.floor(topR * 0.77);
        const rightG = Math.floor(topG * 0.77);
        const rightB = Math.floor(topB * 0.77);
        const leftR = Math.floor(topR * 0.72);
        const leftG = Math.floor(topG * 0.72);
        const leftB = Math.floor(topB * 0.72);

        const topFaceColor = `rgb(${topFaceR},${topFaceG},${topFaceB})`;
        const rightFaceColor = `rgb(${rightR},${rightG},${rightB})`;
        const leftFaceColor = `rgb(${leftR},${leftG},${leftB})`;
        const baseColor = `rgb(${topR},${topG},${topB})`;

        ctx.fillStyle = isHovered ? "rgba(239,68,68,0.4)" : baseColor;
        if (isClicked) ctx.fillStyle = "#ffd700";
        ctx.fill();
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Right face — fully opaque
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(x + tw / 2, y + th / 2);
        ctx.lineTo(x + tw / 2, y + th / 2 - wallHeight);
        ctx.lineTo(x, y - wallHeight);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = isHovered ? "#555555" : rightFaceColor;
        ctx.fill();
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + tw / 2, y + th / 2);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();

        // Left face — fully opaque
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(x - tw / 2, y + th / 2);
        ctx.lineTo(x - tw / 2, y + th / 2 - wallHeight);
        ctx.lineTo(x, y - wallHeight);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = isHovered ? "#333333" : leftFaceColor;
        ctx.fill();
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - tw / 2, y + th / 2);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();

        // Bottom front face — split into left and right sub-faces with a dark vertical seam
        // Left half: (x-tw/2, y+th/2) → (x, y) → (x, y+th) — front-left panel
        const bottomFaceR = Math.floor(topR * 0.68);
        const bottomFaceG = Math.floor(topG * 0.68);
        const bottomFaceB = Math.floor(topB * 0.68);
        const bottomLeftR = Math.floor(topR * 0.62);
        const bottomLeftG = Math.floor(topG * 0.62);
        const bottomLeftB = Math.floor(topB * 0.62);

        // Front-right sub-face: (x, y) → (x+tw/2, y+th/2) → (x, y+th)
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + tw / 2, y + th / 2);
        ctx.lineTo(x, y + th);
        ctx.closePath();
        ctx.fillStyle = isHovered
          ? "#2a2a2a"
          : `rgb(${bottomFaceR},${bottomFaceG},${bottomFaceB})`;
        ctx.fill();
        // Clip and add pixel texture
        if (!isHovered && !isClicked) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + tw / 2, y + th / 2);
          ctx.lineTo(x, y + th);
          ctx.closePath();
          ctx.clip();
          const rngBR = seededRng(seed + 6);
          const pxCountBR = Math.floor(rngBR() * 12) + 18;
          for (let pi = 0; pi < pxCountBR; pi++) {
            const u = rngBR();
            const v = rngBR();
            const bfx = x + u * (tw / 2);
            const bfy =
              y + u * (th / 2) + v * ((th / 2) * (1 - u) + (th / 2) * u);
            const bps = rngBR() < 0.5 ? 2 : 3;
            const shv = Math.floor(rngBR() * 30) - 12;
            ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, bottomFaceR + shv))},${Math.max(0, Math.min(255, bottomFaceG + shv))},${Math.max(0, Math.min(255, bottomFaceB + shv))})`;
            ctx.fillRect(Math.round(bfx), Math.round(bfy), bps, bps);
          }
          ctx.restore();
        }
        ctx.restore();

        // Front-left sub-face: (x-tw/2, y+th/2) → (x, y) → (x, y+th)
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(x - tw / 2, y + th / 2);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + th);
        ctx.closePath();
        ctx.fillStyle = isHovered
          ? "#1a1a1a"
          : `rgb(${bottomLeftR},${bottomLeftG},${bottomLeftB})`;
        ctx.fill();
        // Clip and add pixel texture
        if (!isHovered && !isClicked) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x - tw / 2, y + th / 2);
          ctx.lineTo(x, y);
          ctx.lineTo(x, y + th);
          ctx.closePath();
          ctx.clip();
          const rngBL = seededRng(seed + 7);
          const pxCountBL = Math.floor(rngBL() * 12) + 18;
          for (let pi = 0; pi < pxCountBL; pi++) {
            const u = rngBL();
            const v = rngBL();
            const bfx2 = x - u * (tw / 2);
            const bfy2 =
              y + u * (th / 2) + v * ((th / 2) * (1 - u) + (th / 2) * u);
            const bps2 = rngBL() < 0.5 ? 2 : 3;
            const shv2 = Math.floor(rngBL() * 30) - 12;
            ctx.fillStyle = `rgb(${Math.max(0, Math.min(255, bottomLeftR + shv2))},${Math.max(0, Math.min(255, bottomLeftG + shv2))},${Math.max(0, Math.min(255, bottomLeftB + shv2))})`;
            ctx.fillRect(Math.round(bfx2), Math.round(bfy2), bps2, bps2);
          }
          ctx.restore();
        }
        ctx.restore();

        // Vertical black seam line — front center edge of the cube base
        ctx.save();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + th);
        ctx.stroke();
        // Bottom edge lines connecting base corners
        ctx.strokeStyle = "rgba(0,0,0,0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - tw / 2, y + th / 2);
        ctx.lineTo(x, y + th);
        ctx.moveTo(x + tw / 2, y + th / 2);
        ctx.lineTo(x, y + th);
        ctx.stroke();
        ctx.restore();

        // Top face
        ctx.beginPath();
        ctx.moveTo(x, y - wallHeight);
        ctx.lineTo(x + tw / 2, y + th / 2 - wallHeight);
        ctx.lineTo(x, y + th - wallHeight);
        ctx.lineTo(x - tw / 2, y + th / 2 - wallHeight);
        ctx.closePath();
        ctx.fillStyle = isHovered ? "#777777" : topFaceColor;
        ctx.fill();
        ctx.strokeStyle = "#222222";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Stone pixel texture on side faces only (not on top face per user feedback)
        if (!isHovered && !isClicked) {
          // Right face pixels — random stone texture on right parallelogram
          // Right face vertices: top-right=(x+tw/2, y+th/2-wallHeight), bottom-right=(x+tw/2, y+th/2), bottom-left=(x, y), top-left=(x, y-wallHeight)
          const rng3 = seededRng(seed + 2);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x + tw / 2, y + th / 2 - wallHeight);
          ctx.lineTo(x + tw / 2, y + th / 2);
          ctx.lineTo(x, y);
          ctx.lineTo(x, y - wallHeight);
          ctx.closePath();
          ctx.clip();
          const pixelCountR = Math.floor(rng3() * 25) + 40;
          for (let pi = 0; pi < pixelCountR; pi++) {
            // Interpolate across the right face parallelogram
            const u = rng3(); // 0..1 horizontal (x to x+tw/2)
            const v = rng3(); // 0..1 vertical (top to bottom)
            // Right face goes from left edge (x, y-wallHeight..y) to right edge (x+tw/2, y+th/2-wallHeight..y+th/2)
            const faceTopY = y - wallHeight + u * (th / 2);
            const faceBotY = y + u * (th / 2);
            const ipx2 = x + u * (tw / 2);
            const ipy2 = faceTopY + v * (faceBotY - faceTopY);
            const ips2 = rng3() < 0.5 ? 2 : 3;
            const shVar2 = Math.floor(rng3() * 35) - 10;
            const shR2 = Math.max(0, Math.min(255, rightR + shVar2));
            const shG2 = Math.max(0, Math.min(255, rightG + shVar2));
            const shB2 = Math.max(0, Math.min(255, rightB + shVar2));
            ctx.fillStyle = `rgb(${shR2},${shG2},${shB2})`;
            ctx.fillRect(Math.round(ipx2), Math.round(ipy2), ips2, ips2);
          }
          ctx.restore();

          // Left face pixels — random stone texture on left parallelogram
          // Left face vertices: top-left=(x-tw/2, y+th/2-wallHeight), bottom-left=(x-tw/2, y+th/2), bottom-right=(x, y), top-right=(x, y-wallHeight)
          const rng4 = seededRng(seed + 3);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x - tw / 2, y + th / 2 - wallHeight);
          ctx.lineTo(x - tw / 2, y + th / 2);
          ctx.lineTo(x, y);
          ctx.lineTo(x, y - wallHeight);
          ctx.closePath();
          ctx.clip();
          const pixelCountL = Math.floor(rng4() * 25) + 40;
          for (let pi = 0; pi < pixelCountL; pi++) {
            // Interpolate across the left face parallelogram
            const u = rng4(); // 0..1 horizontal (0=center, 1=far left)
            const v = rng4(); // 0..1 vertical
            // Left face goes from right edge (x, y-wallHeight..y) to left edge (x-tw/2, y+th/2-wallHeight..y+th/2)
            const faceTopY = y - wallHeight + u * (th / 2);
            const faceBotY = y + u * (th / 2);
            const ipx3 = x - u * (tw / 2);
            const ipy3 = faceTopY + v * (faceBotY - faceTopY);
            const ips3 = rng4() < 0.5 ? 2 : 3;
            const shVar3 = Math.floor(rng4() * 35) - 10;
            const shR3 = Math.max(0, Math.min(255, leftR + shVar3));
            const shG3 = Math.max(0, Math.min(255, leftG + shVar3));
            const shB3 = Math.max(0, Math.min(255, leftB + shVar3));
            ctx.fillStyle = `rgb(${shR3},${shG3},${shB3})`;
            ctx.fillRect(Math.round(ipx3), Math.round(ipy3), ips3, ips3);
          }
          ctx.restore();
        }
      } else if (tileType === "portal") {
        ctx.fillStyle = isHovered ? "#4a4060" : "#1e1a2e";
        if (isClicked) ctx.fillStyle = "#ffd700";
        ctx.fill();
        ctx.strokeStyle = "#6b21a8";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.save();
        ctx.globalAlpha = 0.35 + 0.15 * Math.sin(Date.now() * 0.003);
        ctx.strokeStyle = "#c084fc";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y + th / 2, tw / 3, th / 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        // Floor tile — per-map color family, NO border strokes (removes green/blue artifact)
        let flR: number;
        let flG: number;
        let flB: number;
        if (mapColorFamily && !isClicked) {
          const tileSeed = Math.abs(gridX * 31 + gridY * 17);
          const srng = seededRng(tileSeed);
          const tf = srng();
          flR = Math.round(
            mapColorFamily.r1 + tf * (mapColorFamily.r2 - mapColorFamily.r1),
          );
          flG = Math.round(
            mapColorFamily.g1 + tf * (mapColorFamily.g2 - mapColorFamily.g1),
          );
          flB = Math.round(
            mapColorFamily.b1 + tf * (mapColorFamily.b2 - mapColorFamily.b1),
          );
        } else {
          flR = 176;
          flG = 190;
          flB = 197;
        }
        const baseColor2 = isClicked ? "#ffd700" : `rgb(${flR},${flG},${flB})`;
        ctx.fillStyle = baseColor2;
        ctx.fill();
        // No stroke on floor tiles

        // Pixel texture overlay on walkable floor tiles (not clicked/hovered for clarity)
        // FIX 6: Increased from 28 to 40-55 pixels + second depth pass to match block density
        if (!isClicked && mapColorFamily) {
          const txSeed = Math.abs(gridX * 7919 + gridY * 6151);
          const trng = seededRng(txSeed);
          // Primary pass: 40-55 pixels at opacity 0.22 with -25..+30 color shift
          const pixelCount = Math.floor(trng() * 16) + 40; // 40-55
          ctx.save();
          // Clip to diamond
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + tw / 2, y + th / 2);
          ctx.lineTo(x, y + th);
          ctx.lineTo(x - tw / 2, y + th / 2);
          ctx.closePath();
          ctx.clip();
          ctx.globalAlpha = 0.22;
          for (let pi = 0; pi < pixelCount; pi++) {
            // Random position within tile bounding box; diamond clip removes outside ones
            const ipx = x - tw / 2 + trng() * tw;
            const ipy = y + trng() * th;
            // Vary pixel size: 1-3px for more grain variety
            const ips = trng() < 0.33 ? 1 : trng() < 0.66 ? 2 : 3;
            const shift = Math.floor(trng() * 55) - 25; // -25..+30
            const pr = Math.max(0, Math.min(255, flR + shift));
            const pg = Math.max(0, Math.min(255, flG + shift));
            const pb = Math.max(0, Math.min(255, flB + shift));
            ctx.fillStyle = `rgb(${pr},${pg},${pb})`;
            ctx.fillRect(Math.round(ipx), Math.round(ipy), ips, ips);
          }
          // Second depth pass: 8-12 larger pixels at opacity 0.12 for subtle depth
          ctx.globalAlpha = 0.12;
          const depthCount = Math.floor(trng() * 5) + 8; // 8-12
          for (let pi = 0; pi < depthCount; pi++) {
            const ipx2 = x - tw / 2 + trng() * tw;
            const ipy2 = y + trng() * th;
            const ips2 = trng() < 0.5 ? 3 : 4; // 3-4px for depth pass
            const shift2 = Math.floor(trng() * 40) - 15; // -15..+25
            const pr2 = Math.max(0, Math.min(255, flR + shift2));
            const pg2 = Math.max(0, Math.min(255, flG + shift2));
            const pb2 = Math.max(0, Math.min(255, flB + shift2));
            ctx.fillStyle = `rgb(${pr2},${pg2},${pb2})`;
            ctx.fillRect(Math.round(ipx2), Math.round(ipy2), ips2, ips2);
          }
          ctx.restore();
        }

        if (isHovered) {
          // Hover: fill overlay only, no stroke border
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + tw / 2, y + th / 2);
          ctx.lineTo(x, y + th);
          ctx.lineTo(x - tw / 2, y + th / 2);
          ctx.closePath();
          ctx.fillStyle = "rgba(74,222,128,0.22)";
          ctx.fill();
        }
      }
    },
    // seededRng is a module-level pure function, no deps needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // A* pathfinding algorithm
  const findPath = useCallback(
    (start: PlayerPosition, end: PlayerPosition): PlayerPosition[] => {
      if (!currentMap) return [];

      const openSet: PathNode[] = [];
      const closedSet: Set<string> = new Set();

      const startNode: PathNode = {
        x: start.x,
        y: start.y,
        g: 0,
        h: Math.abs(end.x - start.x) + Math.abs(end.y - start.y),
        f: 0,
      };
      startNode.f = startNode.g + startNode.h;

      openSet.push(startNode);

      while (openSet.length > 0) {
        // Find node with lowest f score
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
          if (openSet[i].f < openSet[currentIndex].f) {
            currentIndex = i;
          }
        }

        const current = openSet.splice(currentIndex, 1)[0];
        closedSet.add(`${current.x},${current.y}`);

        // Check if we reached the goal
        if (current.x === end.x && current.y === end.y) {
          const path: PlayerPosition[] = [];
          let node: PathNode | undefined = current;
          while (node) {
            path.unshift({ x: node.x, y: node.y });
            node = node.parent;
          }
          return path.slice(1); // Remove starting position
        }

        // Check neighbors
        const neighbors = [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 },
        ];

        for (const neighbor of neighbors) {
          const { x, y } = neighbor;

          // Check bounds
          if (x < 0 || x >= WORLD_GRID_SIZE || y < 0 || y >= WORLD_GRID_SIZE)
            continue;

          // Check if walkable
          if (currentMap.tiles[y][x] === "wall") continue;
          // FIX 4 — void tiles are impassable in pathfinding
          if (currentMap?.voidTiles?.has(`${x},${y}`)) continue;

          // Block portal tiles during battle (enemies must not pathfind onto portals)
          if (
            inBattleRef.current &&
            currentMap.portals.some((p) => p.x === x && p.y === y)
          )
            continue;

          // Check if already processed
          if (closedSet.has(`${x},${y}`)) continue;

          const g = current.g + 1;
          const h = Math.abs(end.x - x) + Math.abs(end.y - y);
          const f = g + h;

          // Check if this path to neighbor is better
          const existingNode = openSet.find(
            (node) => node.x === x && node.y === y,
          );
          if (existingNode && g >= existingNode.g) continue;

          const neighborNode: PathNode = {
            x,
            y,
            g,
            h,
            f,
            parent: current,
          };

          if (existingNode) {
            // Update existing node
            existingNode.g = g;
            existingNode.f = f;
            existingNode.parent = current;
          } else {
            openSet.push(neighborNode);
          }
        }
      }

      return []; // No path found
    },
    [currentMap],
  );

  // Check if a position is adjacent to any portal
  const isAdjacentToPortal = useCallback(
    (x: number, y: number, portals: { x: number; y: number }[]): boolean => {
      return portals.some((portal) => {
        const distance = Math.abs(portal.x - x) + Math.abs(portal.y - y);
        return distance <= 2;
      });
    },
    [],
  );

  // Generate random scale factors for enemy variety
  const generateEnemyScaleFactors = useCallback(() => {
    const minScale = 0.6;
    const maxScale = 1.4;

    const _scaleX = Math.random() * (maxScale - minScale) + minScale;
    const _scaleY = Math.random() * (maxScale - minScale) + minScale;

    const variation = Math.random();

    if (variation < 0.3) {
      return {
        scaleX: Math.random() * 0.3 + 0.6,
        scaleY: Math.random() * 0.4 + 1.1,
      };
    }
    if (variation < 0.6) {
      return {
        scaleX: Math.random() * 0.4 + 1.1,
        scaleY: Math.random() * 0.3 + 0.6,
      };
    }
    const uniformScale = Math.random() * (maxScale - minScale) + minScale;
    return {
      scaleX: uniformScale,
      scaleY: uniformScale,
    };
  }, []);

  // Check if all portals are reachable
  const arePortalsReachable = useCallback(
    (
      tiles: TileType[][],
      portals: { x: number; y: number }[],
      voidSet?: Set<string>,
    ): boolean => {
      const visited = Array(WORLD_GRID_SIZE)
        .fill(null)
        .map(() => Array(WORLD_GRID_SIZE).fill(false));
      let startX = 8;
      let startY = 8;
      if (tiles && voidSet) {
        outerBfs: for (let sy = 0; sy < WORLD_GRID_SIZE; sy++) {
          for (let sx = 0; sx < WORLD_GRID_SIZE; sx++) {
            if (tiles[sy]?.[sx] === "floor" && !voidSet.has(`${sx},${sy}`)) {
              startX = sx;
              startY = sy;
              break outerBfs;
            }
          }
        }
      } else if (tiles) {
        outerBfsNoVoid: for (let sy = 0; sy < WORLD_GRID_SIZE; sy++) {
          for (let sx = 0; sx < WORLD_GRID_SIZE; sx++) {
            if (tiles[sy]?.[sx] === "floor") {
              startX = sx;
              startY = sy;
              break outerBfsNoVoid;
            }
          }
        }
      }
      const queue: PlayerPosition[] = [{ x: startX, y: startY }];
      visited[startY][startX] = true;

      while (queue.length > 0) {
        const current = queue.shift()!;

        const neighbors = [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 },
        ];

        for (const neighbor of neighbors) {
          const { x, y } = neighbor;

          if (x < 0 || x >= WORLD_GRID_SIZE || y < 0 || y >= WORLD_GRID_SIZE)
            continue;
          if (visited[y][x]) continue;
          if (tiles[y][x] === "wall") continue;
          if (voidSet?.has(`${x},${y}`)) continue;

          visited[y][x] = true;
          queue.push({ x, y });
        }
      }

      return portals.every(
        (portal) =>
          visited[portal.y][portal.x] &&
          !voidSet?.has(`${portal.x},${portal.y}`),
      );
    },
    [],
  );

  // Generate random map with portals
  const generateRandomMap = useCallback((): {
    map: GameMap;
    spawnPosition: PlayerPosition;
  } => {
    let tiles: TileType[][];
    let portals: {
      x: number;
      y: number;
      color: PortalColor;
      animationOffset: number;
      isDungeonEntry?: boolean;
      isBossPortal?: boolean;
      bossPortalId?: string;
      isRestPortal?: boolean;
      isBossRushPortal?: boolean;
      isWhitePortal?: boolean;
      isProgressionPortal?: boolean;
    }[];
    let attempts = 0;
    let maxAttempts = 50;
    const _arch = pickMapArchetype();
    const voidTiles = new Set<string>();
    const _fillDensity = _arch.fillDensity;
    const _smoothPasses = _arch.smoothPasses;
    if (_arch.fillDensity >= 0.4) maxAttempts = 100;

    if (process.env.NODE_ENV === "development") {
      console.log("Generating new map with portals");
    }

    // FIX 3 — Derive level zone from tier system instead of hardcoded LEVEL_ZONES
    const _tierCfg = loadTierConfig();
    const ts = Math.max(1, _tierCfg.tierSize);
    const playerTier = Math.floor(((characterStats?.level ?? 1) - 1) / ts);
    setCurrentZoneTier(playerTier + 1);
    const tierMin = playerTier * ts + 1;
    const tierMax = (playerTier + 1) * ts;
    const levelZone: LevelZone = {
      name: `Tier ${playerTier + 1} Zone`,
      minLevel: tierMin,
      maxLevel: tierMax,
    };

    do {
      attempts++;

      // ── CELLULAR AUTOMATA MAP GENERATION ────────────────────────────────────
      // Phase 1: seed random walls (~40% fill on interior cells)
      tiles = Array(WORLD_GRID_SIZE)
        .fill(null)
        .map((_, gy) =>
          Array(WORLD_GRID_SIZE)
            .fill(null)
            .map((_, gx) => {
              // Outer border is always floor
              if (
                gx === 0 ||
                gx === WORLD_GRID_SIZE - 1 ||
                gy === 0 ||
                gy === WORLD_GRID_SIZE - 1
              )
                return "floor" as TileType;
              return Math.random() < _fillDensity ? "wall" : "floor";
            }),
        );

      // Phase 2: smoothing passes (cellular automata)
      for (let pass = 0; pass < _smoothPasses; pass++) {
        const next = tiles.map((row) => [...row] as TileType[]);
        for (let gy = 1; gy < WORLD_GRID_SIZE - 1; gy++) {
          for (let gx = 1; gx < WORLD_GRID_SIZE - 1; gx++) {
            let wallCount = 0;
            for (let dy = -1; dy <= 1; dy++)
              for (let dx = -1; dx <= 1; dx++)
                if (tiles[gy + dy]?.[gx + dx] === "wall") wallCount++;
            if (wallCount >= 5) next[gy][gx] = "wall";
            else if (wallCount < 4) next[gy][gx] = "floor";
          }
        }
        tiles = next;
      }

      // Archetype post-steps
      if (_arch.type === "fortress") {
        const cs = 3;
        for (let r2 = 0; r2 < cs; r2++)
          for (let c2 = 0; c2 < cs; c2++) {
            if (tiles[r2]?.[c2] !== undefined) tiles[r2][c2] = "wall";
          }
        for (let r2 = 0; r2 < cs; r2++)
          for (let c2 = WORLD_GRID_SIZE - cs; c2 < WORLD_GRID_SIZE; c2++) {
            if (tiles[r2]?.[c2] !== undefined) tiles[r2][c2] = "wall";
          }
        for (let r2 = WORLD_GRID_SIZE - cs; r2 < WORLD_GRID_SIZE; r2++)
          for (let c2 = 0; c2 < cs; c2++) {
            if (tiles[r2]?.[c2] !== undefined) tiles[r2][c2] = "wall";
          }
        for (let r2 = WORLD_GRID_SIZE - cs; r2 < WORLD_GRID_SIZE; r2++)
          for (let c2 = WORLD_GRID_SIZE - cs; c2 < WORLD_GRID_SIZE; c2++) {
            if (tiles[r2]?.[c2] !== undefined) tiles[r2][c2] = "wall";
          }
      } else if (_arch.type === "ruinsIslands") {
        for (let i = 0; i < 5; i++) {
          const cr = 2 + Math.floor(Math.random() * (WORLD_GRID_SIZE - 4));
          const cc2 = 2 + Math.floor(Math.random() * (WORLD_GRID_SIZE - 4));
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
              if (tiles[cr + dr]?.[cc2 + dc] !== undefined)
                tiles[cr + dr][cc2 + dc] = "wall";
            }
        }
      } else if (_arch.type === "arena") {
        for (let r2 = 0; r2 < WORLD_GRID_SIZE; r2++)
          for (let c2 = 0; c2 < Math.floor(WORLD_GRID_SIZE / 2); c2++) {
            if (tiles[r2]?.[WORLD_GRID_SIZE - 1 - c2] !== undefined)
              tiles[r2][WORLD_GRID_SIZE - 1 - c2] = tiles[r2][c2];
          }
      } else if (_arch.type === "asymmetric") {
        for (let r2 = 0; r2 < WORLD_GRID_SIZE; r2++)
          for (let c2 = 0; c2 < Math.floor(WORLD_GRID_SIZE / 2); c2++) {
            if (tiles[r2]?.[c2] !== undefined)
              tiles[r2][c2] = Math.random() < 0.2 ? "wall" : "floor";
          }
        for (let r2 = 0; r2 < WORLD_GRID_SIZE; r2++)
          for (
            let c2 = Math.floor(WORLD_GRID_SIZE / 2);
            c2 < WORLD_GRID_SIZE;
            c2++
          ) {
            if (tiles[r2]?.[c2] !== undefined)
              tiles[r2][c2] = Math.random() < 0.45 ? "wall" : "floor";
          }
      } else if (_arch.type === "chessboard") {
        for (let r2 = 0; r2 < WORLD_GRID_SIZE; r2++)
          for (let c2 = 0; c2 < WORLD_GRID_SIZE; c2++) {
            if (r2 % 2 === 0 && c2 % 2 === 0 && tiles[r2]?.[c2] !== undefined)
              tiles[r2][c2] = "wall";
          }
      }

      portals = [];

      // S2: run-mode portal suppression — logic in engine/portalRules.ts
      const _s2RunMode = getRunMode(
        bossRushActiveRef.current,
        dungeonChainActiveRef.current,
      );
      const _s2MapCleared = enemies.length === 0;

      // Phase 3: place portals on border-adjacent floor tiles (well-separated)
      const portalCount = Math.floor(Math.random() * 3) + 1;
      const regularPortalColors: ("black" | "blue" | "red")[] = [
        "black",
        "blue",
        "red",
      ];
      const borderCandidates: { x: number; y: number }[] = [];
      for (let gy = 1; gy < WORLD_GRID_SIZE - 1; gy++) {
        for (let gx = 1; gx < WORLD_GRID_SIZE - 1; gx++) {
          if (tiles[gy][gx] !== "floor") continue;
          if (
            gx <= 2 ||
            gx >= WORLD_GRID_SIZE - 3 ||
            gy <= 2 ||
            gy >= WORLD_GRID_SIZE - 3
          ) {
            borderCandidates.push({ x: gx, y: gy });
          }
        }
      }
      // Shuffle and place portals
      for (let i = borderCandidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [borderCandidates[i], borderCandidates[j]] = [
          borderCandidates[j],
          borderCandidates[i],
        ];
      }
      for (let i = 0; i < Math.min(portalCount, borderCandidates.length); i++) {
        // S2: suppress regular portals while a run is active
        if (shouldSuppressPortal("regular", _s2RunMode, _s2MapCleared)) break;
        const cand = borderCandidates[i];
        if (
          portals.some(
            (p) => Math.max(Math.abs(p.x - cand.x), Math.abs(p.y - cand.y)) < 4,
          )
        )
          continue;
        tiles[cand.y][cand.x] = "portal";
        portals.push({
          x: cand.x,
          y: cand.y,
          color: regularPortalColors[i % regularPortalColors.length],
          animationOffset: Math.random() * Math.PI * 2,
        });
      }
      if (portals.length === 0 && _s2RunMode === "none") {
        // Fallback: guarantee at least one portal (free exploration only)
        tiles[2][2] = "portal";
        portals.push({ x: 2, y: 2, color: "blue", animationOffset: 0 });
      }

      // ── EXP8: DUNGEON ENTRY PORTAL ──────────────────────────────────────────
      // 20% chance per world map; never spawns when already inside a chain.
      // Uses deep crimson colour palette — visually unmistakable from regular portals.
      // S2: also suppressed during a boss-rush run (no side portals).
      if (
        !shouldSuppressPortal("dungeonEntry", _s2RunMode, _s2MapCleared) &&
        !dungeonChainActiveRef.current &&
        Math.random() < 0.2
      ) {
        const dungeonCandidates = borderCandidates.filter(
          (c) =>
            tiles[c.y][c.x] === "floor" &&
            portals.every(
              (p) => Math.max(Math.abs(p.x - c.x), Math.abs(p.y - c.y)) >= 4,
            ),
        );
        if (dungeonCandidates.length > 0) {
          const dc =
            dungeonCandidates[
              Math.floor(Math.random() * dungeonCandidates.length)
            ];
          tiles[dc.y][dc.x] = "portal";
          portals.push({
            x: dc.x,
            y: dc.y,
            color: "dungeon" as const,
            animationOffset: Math.random() * Math.PI * 2,
            isDungeonEntry: true,
          });
        }
      }

      // ── BOSS PORTAL ───────────────────────────────────────────────────
      // 15% chance per world map; never spawns inside a dungeon chain.
      // Boss portals are deep purple (★ glyph) — visually distinct from all other portals.
      // S2: also suppressed during a boss-rush run (no side portals).
      if (
        !shouldSuppressPortal("bossRushEntry", _s2RunMode, _s2MapCleared) &&
        !dungeonChainActiveRef.current &&
        Math.random() < 0.15
      ) {
        const bossCandidates = borderCandidates.filter(
          (c) =>
            tiles[c.y][c.x] === "floor" &&
            portals.every(
              (p) => Math.max(Math.abs(p.x - c.x), Math.abs(p.y - c.y)) >= 4,
            ),
        );
        if (bossCandidates.length > 0) {
          const bc =
            bossCandidates[Math.floor(Math.random() * bossCandidates.length)];
          // Pick a random boss from the 12
          const bossIndex = Math.floor(Math.random() * BOSS_IDS.length);
          const chosenBossId = BOSS_IDS[bossIndex];
          tiles[bc.y][bc.x] = "portal";
          portals.push({
            x: bc.x,
            y: bc.y,
            color: "boss" as const,
            animationOffset: Math.random() * Math.PI * 2,
            isBossPortal: true,
            bossPortalId: chosenBossId,
          });
        }
      }

      // White rest portal (10% chance on normal non-dungeon maps)
      // S2: suppressed during any run (no side portals / safe zones mid-run).
      if (
        !shouldSuppressPortal("regular", _s2RunMode, _s2MapCleared) &&
        !dungeonChainActiveRef.current &&
        Math.random() < 0.1
      ) {
        const usedPositions = new Set(portals.map((p: any) => `${p.x},${p.y}`));
        const restCandidate = borderCandidates.find(
          (c: any) => !usedPositions.has(`${c.x},${c.y}`),
        );
        if (restCandidate) {
          tiles[restCandidate.y][restCandidate.x] = "portal";
          portals.push({
            x: restCandidate.x,
            y: restCandidate.y,
            color: "rest" as const,
            isRestPortal: true,
            animationOffset: Math.random() * Math.PI * 2,
          });
        }
      }

      // Boss Rush portal (8% chance on non-dungeon maps)
      // S2: suppressed during any active run (no side portals mid-run).
      if (
        !shouldSuppressPortal("bossRushEntry", _s2RunMode, _s2MapCleared) &&
        !dungeonChainActiveRef.current &&
        Math.random() < 0.08
      ) {
        const usedPositions2 = new Set(
          portals.map((p: any) => `${p.x},${p.y}`),
        );
        const rushCandidate = borderCandidates.find(
          (c: any) => !usedPositions2.has(`${c.x},${c.y}`),
        );
        if (rushCandidate) {
          tiles[rushCandidate.y][rushCandidate.x] = "portal";
          portals.push({
            x: rushCandidate.x,
            y: rushCandidate.y,
            color: "bossRush" as const,
            isBossRushPortal: true,
            animationOffset: Math.random() * Math.PI * 2,
          });
        }
      }

      // ── S2: RUN PROGRESSION PORTAL ──────────────────────────────────────
      // During any active run (bossRush or dungeon) spawn exactly one locked
      // progression portal per room. It is ALWAYS visible (locked visual while
      // the room is uncleared, unlocked once isProgressionPortalUnlocked returns
      // true) so the player understands the goal. It is intentionally NOT
      // gated by shouldSuppressPortal — that helper suppresses the progression
      // kind while the map is uncleared, but we want the locked portal shown.
      // The step-time lock check (isProgressionPortalUnlocked) prevents the
      // player from advancing before the room is cleared.
      if (_s2RunMode !== "none") {
        const usedPositions3 = new Set(
          portals.map((p: any) => `${p.x},${p.y}`),
        );
        const progressionCandidate = borderCandidates.find(
          (c: any) => !usedPositions3.has(`${c.x},${c.y}`),
        );
        if (progressionCandidate) {
          tiles[progressionCandidate.y][progressionCandidate.x] = "portal";
          portals.push({
            x: progressionCandidate.x,
            y: progressionCandidate.y,
            color: PROGRESSION_PORTAL_KIND as any,
            isProgressionPortal: true,
            animationOffset: Math.random() * Math.PI * 2,
          });
        }
      }

      if (
        dungeonChainActiveRef.current &&
        !isShrineRoomRef.current &&
        Math.random() < 0.25
      ) {
        isShrineRoomRef.current = true;
        setIsShrineRoom(true);
        shrinePathViolatedRef.current = false;
        const _sCenter = Math.floor(WORLD_GRID_SIZE / 2);
        shrineAltarPosRef.current = { x: _sCenter, y: _sCenter };
      }

      // Phase 4: clear spawn area around map center
      const spawnCx = Math.floor(WORLD_GRID_SIZE / 2);
      const spawnCy = Math.floor(WORLD_GRID_SIZE / 2);
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const nx = spawnCx + dx;
          const ny = spawnCy + dy;
          if (
            nx >= 0 &&
            nx < WORLD_GRID_SIZE &&
            ny >= 0 &&
            ny < WORLD_GRID_SIZE
          ) {
            if (tiles[ny][nx] !== "portal") tiles[ny][nx] = "floor";
          }
        }
      }

      // Phase 5: Connectivity guarantee — flood fill from center,
      // carve passages until all floor + portal tiles are reachable
      const visited = Array.from({ length: WORLD_GRID_SIZE }, () =>
        new Array(WORLD_GRID_SIZE).fill(false),
      );
      const queue: { x: number; y: number }[] = [{ x: spawnCx, y: spawnCy }];
      visited[spawnCy][spawnCx] = true;
      while (queue.length > 0) {
        const { x: qx, y: qy } = queue.shift()!;
        for (const [ddx, ddy] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          const nx = qx + ddx;
          const ny = qy + ddy;
          if (
            nx < 0 ||
            nx >= WORLD_GRID_SIZE ||
            ny < 0 ||
            ny >= WORLD_GRID_SIZE
          )
            continue;
          if (visited[ny][nx]) continue;
          if (tiles[ny][nx] === "wall") continue;
          visited[ny][nx] = true;
          queue.push({ x: nx, y: ny });
        }
      }
      // Connect unreachable floor tiles by carving toward center
      for (let gy = 0; gy < WORLD_GRID_SIZE; gy++) {
        for (let gx = 0; gx < WORLD_GRID_SIZE; gx++) {
          if (tiles[gy][gx] !== "floor" && tiles[gy][gx] !== "portal") continue;
          if (visited[gy][gx]) continue;
          // Carve a path toward spawn center
          let cx2 = gx;
          let cy2 = gy;
          while ((cx2 !== spawnCx || cy2 !== spawnCy) && !visited[cy2][cx2]) {
            if (cx2 !== spawnCx) cx2 += Math.sign(spawnCx - cx2);
            else cy2 += Math.sign(spawnCy - cy2);
            if (tiles[cy2][cx2] === "wall") tiles[cy2][cx2] = "floor";
            visited[cy2][cx2] = true;
          }
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`Cellular automata map generated on attempt ${attempts}`);
      }

      // FIX 1 — Apply void tiles INSIDE the loop, before reachability check,
      // so portal reachability is validated against the post-void map.
      voidTiles.clear();
      const _voidProt = new Set<string>();
      for (const p of portals) {
        _voidProt.add(`${p.x},${p.y}`);
      }
      applyVoidTiles(
        tiles as unknown as string[][],
        _arch.type,
        voidTiles,
        _voidProt,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      );
    } while (
      !arePortalsReachable(tiles, portals, voidTiles) &&
      attempts < maxAttempts
    );

    if (attempts >= maxAttempts) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Map generation failed after ${maxAttempts} attempts, using fallback`,
        );
      }
      // Create a simple fallback map
      tiles = Array(WORLD_GRID_SIZE)
        .fill(null)
        .map(() => Array(WORLD_GRID_SIZE).fill("floor" as TileType));
      portals = [
        {
          x: 4,
          y: 4,
          color: "blue" as const,
          animationOffset: 0,
        },
      ];
      tiles[4][4] = "portal";
    }

    // Pick a random color family for this map's tiles
    const colorFamilies: Array<{
      r1: number;
      g1: number;
      b1: number;
      r2: number;
      g2: number;
      b2: number;
    }> = [
      { r1: 26, g1: 58, b1: 92, r2: 45, g2: 106, b2: 159 }, // blues
      { r1: 92, g1: 26, b1: 26, r2: 159, g2: 45, b2: 45 }, // reds
      { r1: 26, g1: 92, b1: 42, r2: 45, g2: 159, b2: 74 }, // greens
      { r1: 58, g1: 26, b1: 92, r2: 106, g2: 45, b2: 159 }, // purples
      { r1: 92, g1: 58, b1: 26, r2: 159, g2: 106, b2: 45 }, // oranges
      { r1: 26, g1: 92, b1: 92, r2: 45, g2: 159, b2: 159 }, // teals
      { r1: 92, g1: 74, b1: 26, r2: 159, g2: 134, b2: 45 }, // golds
      { r1: 92, g1: 26, b1: 74, r2: 159, g2: 45, b2: 122 }, // pinks
    ];
    const colorFamily =
      colorFamilies[Math.floor(Math.random() * colorFamilies.length)];

    // Wall color palettes — 10 harmonious combinations (1-10 colours per palette)
    const WALL_PALETTES: string[][] = [
      ["#8B7355", "#9C8463", "#7A6548", "#6B563D"], // Stone: warm brown
      ["#607B8B", "#6E8A9B", "#526A78", "#4A6070"], // Slate: cool blue-grey
      ["#5C7A4E", "#6A8A5A", "#4E6B42", "#435E38"], // Moss: mossy green stone
      ["#C4965A", "#D4A668", "#B08848", "#9A7438"], // Desert: sandy stone
      ["#3A3A4A", "#44445A", "#303040", "#282835"], // Obsidian: dark stone
      ["#7A3535", "#8A4040", "#6A2A2A", "#5C2020"], // Crimson: dark red stone
      ["#C8C0B8", "#D4CCC4", "#BCB4AC", "#B0A8A0"], // Marble: light marble
      ["#8B6045", "#9C6E50", "#7A5238", "#6B4430"], // Copper: copper-tinted
      ["#5E4A7A", "#6C5688", "#503E6A", "#443458"], // Amethyst: purple
      ["#3D7A6E", "#4A8A7C", "#336A60", "#2A5C52"], // Jade: jade green
    ];
    // Pick one palette for the whole map, then pick 2-4 colours from it
    const paletteSeed = Math.random();
    const chosenPaletteIdx = Math.floor(paletteSeed * WALL_PALETTES.length);
    const fullPalette = WALL_PALETTES[chosenPaletteIdx];
    const colourCount = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4
    const wallPalette = fullPalette.slice(0, colourCount);

    // EXP5 Phase 6: Place hazard tiles on walkable floor tiles (not spawn, not portals, not center)
    const hazardTiles = new Map<string, HazardType>();
    const spawnCxH = Math.floor(WORLD_GRID_SIZE / 2);
    const spawnCyH = Math.floor(WORLD_GRID_SIZE / 2);
    const portalSet = new Set(portals.map((p) => `${p.x},${p.y}`));
    // Collect eligible floor tiles for hazard placement
    const eligibleHazard: { x: number; y: number }[] = [];
    for (let hy = 0; hy < WORLD_GRID_SIZE; hy++) {
      for (let hx = 0; hx < WORLD_GRID_SIZE; hx++) {
        if (tiles[hy][hx] !== "floor") continue;
        if (portalSet.has(`${hx},${hy}`)) continue;
        // Skip center 7×7 spawn-clear area
        if (Math.abs(hx - spawnCxH) <= 3 && Math.abs(hy - spawnCyH) <= 3)
          continue;
        eligibleHazard.push({ x: hx, y: hy });
      }
    }
    // Shuffle eligible tiles
    for (let i = eligibleHazard.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eligibleHazard[i], eligibleHazard[j]] = [
        eligibleHazard[j],
        eligibleHazard[i],
      ];
    }
    // Determine which hazard types to place based on active modifiers (read from ref later;
    // here we use a local random to keep generation self-contained)
    const hazardTypes: HazardType[] = ["lava", "ice", "spikes"];
    // 15% chance: place 1-3 random hazards even without a modifier
    if (Math.random() < 0.15) {
      const count = 1 + Math.floor(Math.random() * 3); // 1-3
      for (let hi = 0; hi < Math.min(count, eligibleHazard.length); hi++) {
        const ht = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
        hazardTiles.set(`${eligibleHazard[hi].x},${eligibleHazard[hi].y}`, ht);
      }
    }

    const map: GameMap = {
      id: `map-${Date.now()}-${Math.random()}`,
      tiles,
      portals,
      levelZone,
      tilePatterns: {}, // Initialize empty patterns object
      colorFamily,
      wallPalette,
      hazardTiles,
      voidTiles,
      isDeathRealm: false,
      isRestMap: false,
    };

    // Spawn at map center — ensure center tile is not a void tile
    let spawnX = Math.floor(WORLD_GRID_SIZE / 2);
    let spawnY = Math.floor(WORLD_GRID_SIZE / 2);
    // FIX 3 — if center is void, spiral outward to find the nearest valid tile
    if (voidTiles.has(`${spawnX},${spawnY}`)) {
      let found = false;
      outer: for (let radius = 1; radius <= 15; radius++) {
        const candidates = [
          { x: spawnX + radius, y: spawnY },
          { x: spawnX - radius, y: spawnY },
          { x: spawnX, y: spawnY + radius },
          { x: spawnX, y: spawnY - radius },
          { x: spawnX + radius, y: spawnY + radius },
          { x: spawnX - radius, y: spawnY - radius },
          { x: spawnX + radius, y: spawnY - radius },
          { x: spawnX - radius, y: spawnY + radius },
        ];
        for (const c of candidates) {
          if (
            c.x >= 0 &&
            c.x < WORLD_GRID_SIZE &&
            c.y >= 0 &&
            c.y < WORLD_GRID_SIZE &&
            map.tiles[c.y][c.x] !== "wall" &&
            !voidTiles.has(`${c.x},${c.y}`)
          ) {
            spawnX = c.x;
            spawnY = c.y;
            found = true;
            break outer;
          }
        }
      }
      if (!found && process.env.NODE_ENV === "development") {
        console.warn(
          "Player spawn: center is void and no nearby tile found — using center as failsafe",
        );
      }
    }
    const spawnPosition: PlayerPosition = { x: spawnX, y: spawnY };

    return { map, spawnPosition };
  }, [characterStats?.level, arePortalsReachable, enemies.length]);

  /** Generate the special Death Realm map — no walls, eerie grey/purple palette */
  const generateDeathRealmMap = useCallback((): {
    map: GameMap;
    spawnPosition: PlayerPosition;
  } => {
    const tiles: TileType[][] = Array(WORLD_GRID_SIZE)
      .fill(null)
      .map(() => Array(WORLD_GRID_SIZE).fill("floor" as TileType));

    // Place 2-3 portals near edges
    const edgePositions: { x: number; y: number }[] = [];
    for (let i = 2; i <= 13; i += 4) {
      edgePositions.push({ x: i, y: 1 });
      edgePositions.push({ x: i, y: 14 });
      edgePositions.push({ x: 1, y: i });
      edgePositions.push({ x: 14, y: i });
    }
    const shuffledEdges = [...edgePositions].sort(() => Math.random() - 0.5);
    const portalCount = 2 + Math.floor(Math.random() * 2); // 2 or 3
    const deathPortalColors: ("black" | "blue" | "red")[] = [
      "black",
      "blue",
      "red",
    ];
    const portals: GameMap["portals"] = [];
    for (let i = 0; i < Math.min(portalCount, shuffledEdges.length); i++) {
      const pos = shuffledEdges[i];
      tiles[pos.y][pos.x] = "portal";
      portals.push({
        x: pos.x,
        y: pos.y,
        color: deathPortalColors[i % deathPortalColors.length],
        animationOffset: Math.random() * Math.PI * 2,
      });
    }

    // Eerie grey-purple color family
    const drColorFamily = {
      r1: 55 + Math.floor(Math.random() * 15),
      g1: 45 + Math.floor(Math.random() * 15),
      b1: 75 + Math.floor(Math.random() * 20),
      r2: 75 + Math.floor(Math.random() * 15),
      g2: 60 + Math.floor(Math.random() * 15),
      b2: 100 + Math.floor(Math.random() * 20),
    };
    const drWallPalette = ["#3a2a4a", "#4a3a5e"];

    const map: GameMap = {
      id: `map-death-${Date.now()}`,
      tiles,
      portals,
      levelZone: { name: "Death Realm", minLevel: 0, maxLevel: 9999 },
      tilePatterns: {},
      colorFamily: drColorFamily,
      wallPalette: drWallPalette,
      isDeathRealm: true,
      isRestMap: false,
      hazardTiles: new Map(), // No hazards in Death Realm
      voidTiles: new Map(),
    };
    let spawnPos = { x: 1, y: 1 };
    outerLoop: for (let ry = 0; ry < map.tiles.length; ry++) {
      for (let rx = 0; rx < map.tiles[ry].length; rx++) {
        if (map.tiles[ry][rx] === "floor") {
          spawnPos = { x: rx, y: ry };
          break outerLoop;
        }
      }
    }
    return { map, spawnPosition: spawnPos };
  }, []);

  const generateRestMap = useCallback((): {
    map: GameMap;
    spawnPosition: { x: number; y: number };
  } => {
    const size = WORLD_GRID_SIZE;
    const tiles: TileType[][] = [];
    for (let y = 0; y < size; y++) {
      const row: TileType[] = [];
      for (let x = 0; x < size; x++) {
        row.push(
          x === 0 || y === 0 || x === size - 1 || y === size - 1
            ? "wall"
            : "floor",
        );
      }
      tiles.push(row);
    }
    const restPortals: any[] = [
      {
        x: 2,
        y: 2,
        color: "blue" as const,
        isRestExit: true,
        restExitType: "normal" as const,
        animationOffset: 0,
      },
      {
        x: size - 3,
        y: 2,
        color: "dungeon" as const,
        isRestExit: true,
        restExitType: "dungeon" as const,
        isDungeonEntry: true,
        animationOffset: 1,
      },
      {
        x: Math.floor(size / 2),
        y: size - 3,
        color: "boss" as const,
        isRestExit: true,
        restExitType: "boss" as const,
        isBossPortal: true,
        bossPortalId: null,
        animationOffset: 2,
      },
    ];
    const restMap: GameMap = {
      id: `rest-${Date.now()}`,
      tiles,
      portals: restPortals,
      levelZone: { name: "Rest Area", minLevel: 1, maxLevel: 9999 },
      tilePatterns: {},
      wallPalette: ["#d4d4d8", "#e4e4e7", "#f4f4f5"],
      colorFamily: { r1: 200, g1: 200, b1: 205, r2: 220, g2: 220, b2: 225 },
      hazardTiles: new Map(),
      isRestMap: true,
      isDeathRealm: false,
      voidTiles: new Map(),
    };
    // Spawn near center of rest map
    const center = Math.floor(size / 2);
    let spawnPos: { x: number; y: number } = { x: center, y: center };
    if (tiles[center][center] !== "floor") {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const t = tiles[y][x];
          if (t === "floor") {
            spawnPos = { x, y };
            break;
          }
        }
        if (spawnPos.x !== center || spawnPos.y !== center) break;
      }
    }
    return {
      map: restMap,
      spawnPosition: spawnPos,
    };
  }, []);

  // Helper function for pathfinding during map generation
  const _findPathForGeneration = useCallback(
    (
      start: PlayerPosition,
      end: PlayerPosition,
      tiles: TileType[][],
    ): PlayerPosition[] => {
      const openSet: PathNode[] = [];
      const closedSet: Set<string> = new Set();

      const startNode: PathNode = {
        x: start.x,
        y: start.y,
        g: 0,
        h: Math.abs(end.x - start.x) + Math.abs(end.y - start.y),
        f: 0,
      };
      startNode.f = startNode.g + startNode.h;

      openSet.push(startNode);

      while (openSet.length > 0) {
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
          if (openSet[i].f < openSet[currentIndex].f) {
            currentIndex = i;
          }
        }
        const current = openSet.splice(currentIndex, 1)[0];
        closedSet.add(`${current.x},${current.y}`);
        if (current.x === end.x && current.y === end.y) {
          const path: PlayerPosition[] = [];
          let node: PathNode | undefined = current;
          while (node) {
            path.unshift({ x: node.x, y: node.y });
            node = node.parent;
          }
          return path;
        }
        const neighbors = [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 },
        ];
        for (const neighbor of neighbors) {
          const { x, y } = neighbor;
          if (x < 0 || x >= WORLD_GRID_SIZE || y < 0 || y >= WORLD_GRID_SIZE)
            continue;
          if (tiles[y][x] === "wall") continue;
          if (closedSet.has(`${x},${y}`)) continue;
          const g = current.g + 1;
          const h = Math.abs(end.x - x) + Math.abs(end.y - y);
          const f = g + h;
          const existingNode = openSet.find(
            (node) => node.x === x && node.y === y,
          );
          if (existingNode && g >= existingNode.g) continue;
          const neighborNode: PathNode = {
            x,
            y,
            g,
            h,
            f,
            parent: current,
          };
          if (existingNode) {
            existingNode.g = g;
            existingNode.f = f;
            existingNode.parent = current;
          } else {
            openSet.push(neighborNode);
          }
        }
      }
      return [start, end]; // Simple fallback path
    },
    [],
  );
  // NEW: Generate a random walkable position for enemy wandering
  const generateRandomWalkablePosition = useCallback(
    (
      tiles: TileType[][],
      currentX: number,
      currentY: number,
      range: number,
    ): PlayerPosition | null => {
      const attempts = 50;
      for (let i = 0; i < attempts; i++) {
        const deltaX = Math.floor(Math.random() * (range * 2 + 1)) - range;
        const deltaY = Math.floor(Math.random() * (range * 2 + 1)) - range;
        const newX = currentX + deltaX;
        const newY = currentY + deltaY;
        // Check bounds and walkability
        if (
          newX >= 0 &&
          newX < WORLD_GRID_SIZE &&
          newY >= 0 &&
          newY < WORLD_GRID_SIZE &&
          tiles[newY][newX] === "floor" &&
          !currentMap?.voidTiles?.has(`${newX},${newY}`) &&
          (newX !== currentX || newY !== currentY)
        ) {
          return { x: newX, y: newY };
        }
      }
      return null;
    },
    [currentMap],
  );
  const DEFAULT_ANCIENT_NAMES = [
    "Malachar",
    "Vorenth",
    "Aethys",
    "Zarvok",
    "Kethara",
    "Duskwyn",
    "Voraxis",
    "Nythera",
    "Valdrek",
    "Seramis",
    "Thornvex",
    "Golvak",
    "Draveth",
    "Sythion",
    "Kaelthar",
    "Norrax",
    "Veluun",
    "Drathis",
    "Xarveth",
    "Orvael",
    "Tyranos",
    "Belkoth",
    "Senvaris",
    "Rathvel",
    "Mordaen",
    "Sylvrath",
    "Graveoch",
    "Umbrath",
    "Nocteus",
    "Vesperis",
    "Corvath",
    "Duskaron",
    "Morbeth",
    "Soulvex",
    "Wraitheon",
    "Spectrael",
    "Phantarax",
    "Voidkaen",
    "Abysseth",
    "Netheron",
  ];
  // Generate enemies with level assignment and enhanced movement properties
  // Generate enemies with level assignment, minimum spread, and quadrant coverage
  const generateEnemies = useCallback(
    (
      tiles: TileType[][],
      portals: { x: number; y: number }[],
      dungeonDepth = 0,
      voidTilesParam?: Set<string>,
    ): Enemy[] => {
      // ── EXP8: DUNGEON DIFFICULTY SCALING ───────────────────────────────
      // depth 0 = normal world; depth 1-5 = escalating dungeon difficulty
      const dungeonExtraEnemies = [0, 2, 3, 4, 4, 5][Math.min(dungeonDepth, 5)];
      const dungeonTierBoost = [0, 1, 2, 2, 3, 3][Math.min(dungeonDepth, 5)];
      const enemyCount =
        Math.floor(Math.random() * 8) + 1 + dungeonExtraEnemies;
      const enemies: Enemy[] = [];
      const chessPieceTypes: ChessPieceType[] = [
        "king",
        "queen",
        "pawn",
        "rook",
        "bishop",
        "knight",
      ];
      // FIX 3 — Tier-based enemy level selection
      // Each enemy independently picks its level via the tier probability function.
      // No more flat LEVEL_ZONES lookup.
      // Collect all valid floor positions spread across entire map
      const allValid: PlayerPosition[] = [];
      for (let y = 0; y < WORLD_GRID_SIZE; y++) {
        for (let x = 0; x < WORLD_GRID_SIZE; x++) {
          if (tiles[y][x] !== "floor") continue;
          if (isAdjacentToPortal(x, y, portals)) continue;
          if (Math.abs(x - 8) <= 3 && Math.abs(y - 8) <= 3) continue;
          // FIX 2 — skip void tiles for enemy spawns
          if ((voidTilesParam ?? new Set<string>()).has(`${x},${y}`)) continue;
          allValid.push({ x, y });
        }
      }
      // Shuffle valid positions for random spread
      const shuffled = [...allValid].sort(() => Math.random() - 0.5);
      // Split map into 4 quadrants: top-left, top-right, bottom-left, bottom-right
      const quadrants = [
        (p: PlayerPosition) => p.x < 8 && p.y < 8,
        (p: PlayerPosition) => p.x >= 8 && p.y < 8,
        (p: PlayerPosition) => p.x < 8 && p.y >= 8,
        (p: PlayerPosition) => p.x >= 8 && p.y >= 8,
      ];
      // H4: Build a shuffled copy of the admin name pool for this map.
      // A usedNames Set ensures no two enemies on the same map share a name.
      const availableNames = [...enemyNamesFromQuery].sort(
        () => Math.random() - 0.5,
      );
      const namePool =
        availableNames.length > 0 ? availableNames : DEFAULT_ANCIENT_NAMES;
      const usedNamesOnThisMap = new Set<string>();
      let nameIndex = 0;
      // Try to place at least 1 enemy per quadrant first
      const MIN_CHEBYSHEV = 4;
      const isFarEnough = (pos: PlayerPosition): boolean =>
        enemies.every(
          (e) =>
            Math.max(Math.abs(e.x - pos.x), Math.abs(e.y - pos.y)) >=
            MIN_CHEBYSHEV,
        );
      const tryPlaceEnemy = (candidates: PlayerPosition[]): boolean => {
        for (const pos of candidates) {
          if (!isFarEnough(pos)) continue;
          const randomPieceType =
            chessPieceTypes[Math.floor(Math.random() * chessPieceTypes.length)];
          const initialDelay = Math.random() * 9000 + 1000;
          const currentTime = Date.now();
          const scaleFactors = generateEnemyScaleFactors();
          // FIX 3 — use tier-based level selection; dungeon depth adds tier boost
          const baseEnemyLevel = pickEnemyLevelFromTiers(
            characterStats?.level ?? 1,
          );
          const tierSize = Math.max(
            1,
            (tierConfigRef.current ?? loadTierConfig()).tierSize,
          );
          const enemyLevel =
            dungeonTierBoost > 0
              ? Math.max(1, baseEnemyLevel + dungeonTierBoost * tierSize)
              : baseEnemyLevel;
          const movementSpeed = Math.random() * 400 + 600;
          const movementRange = Math.floor(Math.random() * 3) + 1;
          const nextMoveDelay =
            Math.random() *
              (ENEMY_MOVE_INTERVAL_MAX - ENEMY_MOVE_INTERVAL_MIN) +
            ENEMY_MOVE_INTERVAL_MIN;
          // H4: Pick the next name that hasn't been used on this map yet.
          // Advance past duplicates, then mark as used so no two enemies share a name.
          let assignedName: string | undefined;
          while (nameIndex < namePool.length) {
            const candidate = namePool[nameIndex++];
            if (!usedNamesOnThisMap.has(candidate)) {
              usedNamesOnThisMap.add(candidate);
              assignedName = candidate;
              break;
            }
          }
          // Fallback if the pool is empty or all names are exhausted
          if (!assignedName) {
            assignedName =
              availableNames.length === 0
                ? DEFAULT_ANCIENT_NAMES[
                    _fbNameIdx++ % DEFAULT_ANCIENT_NAMES.length
                  ]
                : undefined;
          }
          enemies.push({
            id: `enemy-${enemies.length}-${currentTime}`,
            x: pos.x,
            y: pos.y,
            pieceType: randomPieceType,
            currentView: "front",
            isMoving: false,
            movementPath: [],
            currentStepIndex: 0,
            movementStartTime: 0,
            initialDelay,
            spawnTime: currentTime,
            scaleX: scaleFactors.scaleX,
            scaleY: scaleFactors.scaleY,
            level: enemyLevel,
            aiTier: computeAITier(enemyLevel),
            nextMoveTime: currentTime + nextMoveDelay,
            movementSpeed,
            movementRange,
            isWandering: true,
            wanderTarget: null,
            lastMoveTime: currentTime,
            // Placeholder stats — overwritten with seededRng values when battle starts
            hp: Math.max(1, Math.round(enemyLevel * 8 + 20)),
            maxHp: Math.max(1, Math.round(enemyLevel * 8 + 20)),
            damage: Math.max(1, Math.round(enemyLevel * 2 + 3)),
            ...computeEnemyStats(
              enemyLevel,
              pieceType,
              `enemy-${enemies.length}-${currentTime}`,
            ),
            family: "default" as EnemyFamily,
            assignedName,
          });
          return true;
        }
        return false;
      };
      // Place one enemy per quadrant where possible
      for (const quadrantFn of quadrants) {
        if (enemies.length >= enemyCount) break;
        const candidates = shuffled.filter(quadrantFn);
        tryPlaceEnemy(candidates);
      }
      // Fill remaining slots from any position with minimum spacing
      for (const pos of shuffled) {
        if (enemies.length >= enemyCount) break;
        if (!isFarEnough(pos)) continue;
        tryPlaceEnemy([pos]);
      }
      // Guarantee at least 1 enemy if nothing placed (fallback)
      if (enemies.length === 0 && shuffled.length > 0) {
        tryPlaceEnemy(shuffled);
      }
      // Family enemy variant spawning (30% chance per enemy — occasional but noticeable)
      const familyTypesList: EnemyFamily[] = [
        "wraith_bishop",
        "iron_golem",
        "plague_rat",
        "ember_knight",
        "tide_shade",
        "bone_scribe",
        "void_mirror",
      ];
      const familyStatMults: Record<
        string,
        {
          hpMult: number;
          dmgMult: number;
          res: number;
          spRes: number;
          mp: number;
          ap: number;
        }
      > = {
        wraith_bishop: {
          hpMult: 0.6,
          dmgMult: 1.4,
          res: 0.1,
          spRes: 0.2,
          mp: 4,
          ap: 5,
        },
        iron_golem: {
          hpMult: 2.5,
          dmgMult: 0.7,
          res: 0.75,
          spRes: 0.6,
          mp: 1,
          ap: 4,
        },
        plague_rat: {
          hpMult: 0.4,
          dmgMult: 0.6,
          res: 0.05,
          spRes: 0.05,
          mp: 3,
          ap: 3,
        },
        ember_knight: {
          hpMult: 1.1,
          dmgMult: 1.0,
          res: 0.3,
          spRes: 0.15,
          mp: 3,
          ap: 4,
        },
        tide_shade: {
          hpMult: 0.8,
          dmgMult: 0.9,
          res: 0.15,
          spRes: 0.3,
          mp: 5,
          ap: 4,
        },
        bone_scribe: {
          hpMult: 0.7,
          dmgMult: 0.5,
          res: 0.1,
          spRes: 0.4,
          mp: 3,
          ap: 4,
        },
        void_mirror: {
          hpMult: 1.0,
          dmgMult: 0.8,
          res: 0.2,
          spRes: 0.5,
          mp: 2,
          ap: 3,
        },
      };
      for (const en of enemies) {
        if (Math.random() < 0.3) {
          const fam =
            familyTypesList[Math.floor(Math.random() * familyTypesList.length)];
          const m = familyStatMults[fam];
          en.family = fam;
          en.hp = Math.max(1, Math.round(en.hp * m.hpMult));
          en.maxHp = en.hp;
          en.damage = Math.max(1, Math.round((en.damage ?? 0) * m.dmgMult));
          en.res = m.res;
          en.sp = m.spRes;
          en.aiTier = computeAITier(en.level ?? 1);
        }
      }
      if (process.env.NODE_ENV === "development")
        console.log(`${enemies.length} enemies generated with quadrant spread`);
      return enemies;
    },
    [
      characterStats,
      isAdjacentToPortal,
      generateEnemyScaleFactors,
      enemyNamesFromQuery,
      pieceType,
    ],
  );
  // Improved camera following with adaptive speed and smooth easing
  // On DESKTOP: camera is locked at offset 0 — full map always visible
  // On MOBILE: tight follow with smooth easing
  const updateCameraToFollowPlayer = useCallback(() => {
    // Rest / Death Realm maps: center camera on the player so they stay visible
    if (
      currentMapRef.current?.isRestMap ||
      currentMapRef.current?.isDeathRealm
    ) {
      const playerScreenPos = gridToScreen(playerPosition.x, playerPosition.y);
      const centerX = canvasSize.width / 2;
      const centerY = canvasSize.height / 2;
      cameraRef.current = {
        x: centerX - playerScreenPos.x,
        y: centerY - playerScreenPos.y,
      };
      targetCameraRef.current = { ...cameraRef.current };
      return;
    }
    // Desktop: static camera — always centered, never move
    if (isDesktop) {
      cameraRef.current = { x: 0, y: 0 };
      targetCameraRef.current = { x: 0, y: 0 };
      return;
    }
    if (!shouldFollowPlayer) return;
    const playerScreenPos = gridToScreen(playerPosition.x, playerPosition.y);
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const cam = cameraRef.current;
    const desiredOffsetX = centerX - playerScreenPos.x + cam.x;
    const desiredOffsetY = centerY - playerScreenPos.y + cam.y;
    const distanceFromCenter = Math.sqrt(
      (playerScreenPos.x - centerX) ** 2 + (playerScreenPos.y - centerY) ** 2,
    );
    if (distanceFromCenter > effectiveDeadzone) {
      const adaptiveCameraSpeed = getCameraFollowSpeed(
        canvasSize.width,
        isMobile,
      );
      const currentVelocity = cameraVelocityRef.current;
      const smoothedTargetX =
        cam.x + (desiredOffsetX - cam.x) * adaptiveCameraSpeed;
      const smoothedTargetY =
        cam.y + (desiredOffsetY - cam.y) * adaptiveCameraSpeed;
      currentVelocity.x =
        currentVelocity.x * CAMERA_SMOOTHING_FACTOR +
        (smoothedTargetX - cam.x) * (1 - CAMERA_SMOOTHING_FACTOR);
      currentVelocity.y =
        currentVelocity.y * CAMERA_SMOOTHING_FACTOR +
        (smoothedTargetY - cam.y) * (1 - CAMERA_SMOOTHING_FACTOR);
      const maxVelocity =
        canvasSize.width < 768 ? 8 : canvasSize.width < 1200 ? 6 : 4;
      currentVelocity.x = Math.max(
        -maxVelocity,
        Math.min(maxVelocity, currentVelocity.x),
      );
      currentVelocity.y = Math.max(
        -maxVelocity,
        Math.min(maxVelocity, currentVelocity.y),
      );
      const newOffsetX = cam.x + currentVelocity.x;
      const newOffsetY = cam.y + currentVelocity.y;
      const clampedOffsetX = Math.max(
        -effectiveMaxOffset,
        Math.min(effectiveMaxOffset, newOffsetX),
      );
      const clampedOffsetY = Math.max(
        -effectiveMaxOffset,
        Math.min(effectiveMaxOffset, newOffsetY),
      );
      targetCameraRef.current = { x: clampedOffsetX, y: clampedOffsetY };
    }
  }, [
    isDesktop,
    playerPosition,
    gridToScreen,
    canvasSize,
    shouldFollowPlayer,
    effectiveDeadzone,
    effectiveMaxOffset,
    isMobile,
  ]);
  // FIXED: Robust portal interaction system that triggers immediately when player steps on portal
  // FIX 1 — Portals are disabled in battle; stepping on them does nothing
  // FIX #14 — Atomic check-and-set: the lock is claimed as the very first
  //            synchronous line, before any state updates or awaits.
  // biome-ignore lint/correctness/useExhaustiveDependencies: refs and stable setters don't need listing
  const checkPortalInteraction = useCallback(() => {
    // DEATH REALM FIX: Use inBattleRef.current (synchronous ref) instead of inBattle
    // (React state). After player death, setInBattle(false) is async — if the portal
    // check fires before React re-renders with the new value, inBattle would still be
    // true and permanently block the Death Realm portal exit.
    if (transitionInProgressRef.current) return;
    if (inBattleRef.current) return; // ← use ref, not stale closure state
    if (!currentMap) return;
    // FIX #14: Check-and-set is the very first synchronous operation so there
    // is no gap between the check and the lock being claimed.
    setTransitionInProgress(true);
    transitionInProgressRef.current = true;
    lastPortalRef.current = null; // ensure every portal check starts fresh
    onDebugLog?.("MAP_TRANSITION", "Portal entered");
    // Check if player is currently on a portal tile
    let portal = currentMap.portals.find(
      (p) => p.x === playerPosition.x && p.y === playerPosition.y,
    );
    if (!portal) {
      // Proximity fallback for rest portals (catches coordinate rounding)
      const nearbyRest = currentMap.portals.find(
        (p) =>
          p.isRestPortal &&
          Math.sqrt(
            (playerPosition.x - p.x) ** 2 + (playerPosition.y - p.y) ** 2,
          ) < 1.5,
      );
      if (nearbyRest) portal = nearbyRest;
    }
    if (!portal) {
      // C1 FIX: No portal found — release the lock to prevent permanent stuck state
      setTransitionInProgress(false);
      transitionInProgressRef.current = false;
      // EDIT 2 — Player stepped off any portal: re-arm the sealed-portal
      // announcement so the next on-portal dwell logs exactly once more.
      sealedPortalAnnouncedRef.current = null;
      return;
    }
    if (portal) {
      // Prevent multiple triggers from the same portal
      const portalKey = `${portal.x},${portal.y}`;
      const lastPortal = lastPortalRef.current;
      let lastPortalKey: string | null = null;
      if (lastPortal) {
        lastPortalKey = `${(lastPortal as any).x},${(lastPortal as any).y}`;
      }
      if (portalKey === lastPortalKey) {
        // FIX #14: Release the lock before returning so a different portal can trigger later
        setTransitionInProgress(false);
        transitionInProgressRef.current = false;
        return; // Already processed this portal
      }
      // S2: progression gate — run portal locked until map cleared (engine/portalRules.ts)
      const _s2InteractRunMode: RunMode = bossRushActiveRef.current
        ? "bossRush"
        : dungeonChainActiveRef.current
          ? "dungeon"
          : "none";
      const _s2IsProgressionPortal =
        _s2InteractRunMode !== "none" &&
        !portal.isBossRushPortal &&
        !portal.isRestPortal &&
        !portal.isRestExit &&
        !portal.isBossPortal &&
        !portal.isDungeonEntry;
      if (
        _s2IsProgressionPortal &&
        isProgressionLocked(
          _s2InteractRunMode,
          activeHostilesRemaining(combatantsRef.current) === 0,
        )
      ) {
        // EDIT 2 — Edge-trigger the "sealed" announcement so it fires exactly
        // once per on-portal dwell. sealedPortalAnnouncedRef remembers the last
        // announced portalKey; we only log when the key differs (first dwell on
        // this portal). The ref is cleared in the no-portal-found branch above
        // when the player steps off, re-arming it for the next entry.
        if (sealedPortalAnnouncedRef.current?.portalKey !== portalKey) {
          logBattleEntry(
            "🔒 The way forward is sealed until every foe falls.",
            "#8a6a3a",
          );
          sealedPortalAnnouncedRef.current = {
            portalKey,
            announcedAt: Date.now(),
          };
        }
        setTransitionInProgress(false);
        transitionInProgressRef.current = false;
        return;
      }
      // Boss Rush portal entry
      if (portal.isBossRushPortal || portal.color === "bossRush") {
        lastPortalRef.current = { x: portal.x, y: portal.y };
        bossRushActiveRef.current = true;
        startBossRush();
        setTransitionInProgress(false);
        transitionInProgressRef.current = false;
        return;
      }
      // Boss Rush room-advance: stepping into a progression portal during a
      // boss rush advances to the next room once the current room is cleared.
      // The portal stays locked (handled above) until activeHostilesRemaining
      // is zero. This replaces the old auto-advance in handleBossRushRoomClear.
      if (
        bossRushActiveRef.current &&
        (portal.isProgressionPortal ||
          portal.kind === PROGRESSION_PORTAL_KIND) &&
        activeHostilesRemaining(combatantsRef.current) === 0
      ) {
        lastPortalRef.current = { x: portal.x, y: portal.y };
        const nextRoomIndex = bossRushState.currentRoom + 1;
        const nextRoomDef = BOSS_RUSH_ROOMS[nextRoomIndex];
        if (nextRoomDef) {
          void advanceBossRushRoom();
          const { map: nextMap, spawnPosition } = generateRandomMap();
          if (nextMap) {
            setCurrentMap(nextMap);
            if (spawnPosition) {
              setPlayerPosition({ ...spawnPosition });
            }
            const newEnemies: any[] = [];
            if (nextRoomDef.boss1Id) {
              newEnemies.push({
                id: `boss-rush-${nextRoomIndex}-0`,
                pieceType: nextRoomDef.boss1Name || "Boss 1",
                x: 4,
                y: 5,
                level: characterStats.level + 2,
                hp: 100,
                maxHp: 100,
                ap: 6,
                mp: 3,
                initiative: 10,
                attack: 20,
                defense: 10,
                resistance: 5,
                spells: [],
                isBoss: true,
                isLeader: false,
                behavior: "aggressive",
                family: "boss",
                statusEffects: [],
                activeEffects: [],
              });
            }
            if (nextRoomDef.boss2Id) {
              newEnemies.push({
                id: `boss-rush-${nextRoomIndex}-1`,
                pieceType: nextRoomDef.boss2Name || "Boss 2",
                x: 6,
                y: 5,
                level: characterStats.level + 2,
                hp: 100,
                maxHp: 100,
                ap: 6,
                mp: 3,
                initiative: 10,
                attack: 20,
                defense: 10,
                resistance: 5,
                spells: [],
                isBoss: true,
                isLeader: false,
                behavior: "aggressive",
                family: "boss",
                statusEffects: [],
                activeEffects: [],
              });
            }
            syncCombatants(combatantStoreCtx, newEnemies, {
              resetBattle: true,
            });
          }
        }
        setTransitionInProgress(false);
        transitionInProgressRef.current = false;
        return;
      }
      // White portal entry — sanctuary transition on run/dungeon completion.
      // Mirrors the rest portal entry: cleanupMap + generateRestMap. Completion
      // keeps rewards; this is NOT a death/flee reset.
      if (portal.isWhitePortal) {
        lastPortalRef.current = { x: portal.x, y: portal.y };
        cleanupMap();
        try {
          const { map: restMap, spawnPosition: restSpawn } = generateRestMap();
          currentMapRef.current = restMap;
          setCurrentMap(restMap);
          setPlayerPosition(restSpawn);
          resetCombatantStore(combatantStoreCtx);
          setPlayerView("front");
          const playerScreenPos = gridToScreen(restSpawn.x, restSpawn.y);
          const centerX = canvasSize.width / 2;
          const centerY = canvasSize.height / 2;
          const camX = centerX - playerScreenPos.x;
          const camY = centerY - playerScreenPos.y;
          cameraRef.current = { x: camX, y: camY };
          targetCameraRef.current = { x: camX, y: camY };
          cameraVelocityRef.current = { x: 0, y: 0 };
          if (cameraFollowTimerRef.current !== null)
            clearTimeout(cameraFollowTimerRef.current);
          setTimeout(() => {
            cameraFollowTimerRef.current = null;
            updateCameraToFollowPlayer();
          }, 100);
          transitionInProgressRef.current = false;
          setTransitionInProgress(false);
          setMapCount((prev) => prev + 1);
          toast("✨ Sanctuary — your run is complete. Rest, hero.", {
            duration: 4000,
            style: {
              background: "#1a1a2e",
              border: "1px solid #6a6a8a",
              color: "#e0e0ff",
            },
          });
        } catch (err) {
          console.error("[white] sanctuary map generation failed:", err);
          setTransitionInProgress(false);
          transitionInProgressRef.current = false;
        }
        return;
      }
      // Rest portal entry — safe zone (enemy-free, with return portals)
      if (portal.isRestPortal) {
        lastPortalRef.current = { x: portal.x, y: portal.y };
        cleanupMap();
        // Use the same pattern as the death-realm transition (line ~11182):
        // synchronous map creation, immediate state application, no generation counter
        try {
          const { map: restMap, spawnPosition: restSpawn } = generateRestMap();
          currentMapRef.current = restMap;
          setCurrentMap(restMap);
          setPlayerPosition(restSpawn);
          resetCombatantStore(combatantStoreCtx);
          setPlayerView("front");
          // Explicitly center camera on player for rest map
          const playerScreenPos = gridToScreen(restSpawn.x, restSpawn.y);
          const centerX = canvasSize.width / 2;
          const centerY = canvasSize.height / 2;
          const camX = centerX - playerScreenPos.x;
          const camY = centerY - playerScreenPos.y;
          cameraRef.current = { x: camX, y: camY };
          targetCameraRef.current = { x: camX, y: camY };
          cameraVelocityRef.current = { x: 0, y: 0 };
          if (cameraFollowTimerRef.current !== null)
            clearTimeout(cameraFollowTimerRef.current);
          setTimeout(() => {
            cameraFollowTimerRef.current = null;
            updateCameraToFollowPlayer();
          }, 100);
          transitionInProgressRef.current = false;
          setTransitionInProgress(false);
          setMapCount((prev) => prev + 1);
          // DEBUG: prove player and portals are within bounds
          console.log(
            "REST_MAP_PLAYER",
            restSpawn,
            "MAP_DIMS",
            restMap.tiles[0]?.length || 0,
            restMap.tiles.length || 0,
          );
          console.log(
            "REST_MAP_PORTALS",
            restMap.portals.map((p: any) => ({
              x: p.x,
              y: p.y,
              isRestExit: p.isRestExit,
            })),
          );
          console.log("REST_MAP_CAMERA", cameraRef.current);
          toast("🛡️ Safe Zone — no enemies here. Use a portal to return.", {
            duration: 4000,
            style: {
              background: "#1a1a2e",
              border: "1px solid #4a4a6a",
              color: "#e0e0ff",
            },
          });
        } catch (err) {
          console.error("[rest] rest map generation failed:", err);
          setTransitionInProgress(false);
          transitionInProgressRef.current = false;
        }
        return;
      }
      // Rest portal exit
      if (portal.isRestExit && currentMap?.isRestMap) {
        aiGenerationRef.current++;
        const _myGen2 = aiGenerationRef.current;
        lastPortalRef.current = { x: portal.x, y: portal.y };
        cleanupMap();
        if (portal.restExitType === "dungeon") {
          dungeonChainActiveRef.current = true;
          setDungeonChainActive(true);
          setDungeonChainDepth(1);
          const newMaxDepth = 3 + Math.floor(Math.random() * 3);
          setDungeonChainMaxDepth(newMaxDepth);
          dungeonChainMaxDepthRef.current = newMaxDepth;
        }
        const reTimerId = setTimeout(() => {
          // RC FIX: No generation check needed — loop runs forever
          const { map: newMap, spawnPosition } = generateRandomMap();
          currentMapRef.current = newMap;
          setCurrentMap(newMap);
          setPlayerPosition(spawnPosition);
          resetCombatantStore(combatantStoreCtx);
          setTransitionInProgress(false);
          transitionInProgressRef.current = false;
        }, 400);
        pendingTimeoutsRef.current.add(reTimerId);
        return;
      }
      // Fire portal sound
      playSound("map_transition");
      // ── UNIFIED MAP CLEANUP: terminates ALL battle processes, timers, AI callbacks,
      // VFX, particle systems, DoT effects, and caches from the previous map.
      // cleanupMap() calls cleanupBattle() internally — this is the single point
      // that guarantees nothing from the old map carries over to the new one.
      cleanupMap();
      setCoinParticles([]);
      effectsManagerRef.current.clear();
      // Ensure fade overlay is cleared (no fade animation)
      fadeOverlayRef.current = { opacity: 0, direction: "none" };
      // RC FIX: No manual loop cancel/restart — cleanupMap already bumped generation
      // The single RAF loop effect (empty deps) will auto-restart via its cleanup+re-run
      // when the component re-renders, OR the existing loop will pick up the new map via
      // currentMapRef on its next frame.
      // H2: transitionInProgressRef already set at the very top of this function (line ~3824).
      // Setting it again here is redundant and removed.
      lastPortalRef.current = { x: portal.x, y: portal.y };
      // Stop any current movement immediately
      setIsMoving(false);
      setMovementPath([]);
      setCurrentStepIndex(0);
      setClickedTile(null);
      setPendingDestination(null);
      // ── EXP8: DUNGEON CHAIN STATE MANAGEMENT ──────────────────────────
      const isDungeonEntryPortal = portal.isDungeonEntry === true;
      const isInsideChain = dungeonChainActiveRef.current;
      const currentDepth = dungeonChainDepthRef.current;
      const maxDepth = dungeonChainMaxDepthRef.current;
      let nextDungeonDepth = 0;
      let chainJustCompleted = false;
      if (isDungeonEntryPortal && !isInsideChain) {
        // ENTER THE CHAIN
        const newMaxDepth = 3 + Math.floor(Math.random() * 3); // 3-5
        nextDungeonDepth = 1;
        setDungeonChainActive(true);
        setDungeonChainDepth(1);
        setDungeonChainMaxDepth(newMaxDepth);
        setDungeonChainBaseLevel(characterStats.level);
        dungeonChainActiveRef.current = true;
        dungeonChainDepthRef.current = 1;
        dungeonChainMaxDepthRef.current = newMaxDepth;
        logBattleEntry(
          `⚔️ Dungeon Chain entered! Prepare for ${newMaxDepth} escalating maps.`,
          "#cc0000",
        );
      } else if (isInsideChain) {
        if (currentDepth >= maxDepth) {
          // CHAIN COMPLETED — award bonus and reset
          const chainBonus = maxDepth * 50;
          onDokaBalanceChange(dokaBalance + chainBonus);
          chainJustCompleted = true;
          nextDungeonDepth = 0;
          setDungeonChainActive(false);
          setDungeonChainDepth(0);
          setDungeonChainMaxDepth(0);
          dungeonChainActiveRef.current = false;
          dungeonChainDepthRef.current = 0;
          dungeonChainMaxDepthRef.current = 0;
          logBattleEntry(
            `🏆 Dungeon Chain COMPLETE! Bonus: ${chainBonus} Doka!`,
            "#ffd700",
          );
          // Spawn a white portal to sanctuary on dungeon-chain completion.
          // Completion keeps rewards (no death penalty / no Death Realm reset).
          const whiteDungeonPortal = {
            x: 0,
            y: 0,
            color: "white" as const,
            isWhitePortal: true,
            animationOffset: Math.random() * Math.PI * 2,
          };
          // Attach to the next generated map (created below) via a ref hook
          // so the portal entry handler can find it after map swap.
          pendingWhitePortalRef.current = whiteDungeonPortal;
          logBattleEntry("A white gateway to sanctuary opens…", "white");
        } else {
          // PROGRESS DEEPER
          nextDungeonDepth = currentDepth + 1;
          setDungeonChainDepth(nextDungeonDepth);
          dungeonChainDepthRef.current = nextDungeonDepth;
          logBattleEntry(
            `⚔️ Dungeon depth ${nextDungeonDepth}/${maxDepth} — enemies grow stronger!`,
            "#cc0000",
          );
        }
      }
      // Generate new map — dungeon chain maps never get dungeon entry portals
      // (dungeonChainActiveRef is already updated above before this call)
      const { map: newMap, spawnPosition } = generateRandomMap();
      // Attach any pending white portal (run-complete portal) to the new map
      if (pendingWhitePortalRef.current && newMap) {
        newMap.portals = [
          ...(newMap.portals || []),
          pendingWhitePortalRef.current,
        ];
        pendingWhitePortalRef.current = null;
      }
      // Update all states for the new map
      currentMapRef.current = newMap;
      setCurrentMap(newMap);
      if (newMap?.tiles?.length) {
        const _miRows = newMap.tiles.length;
        const _miCols = newMap.tiles[0]?.length ?? 0;
        let _miWalls = 0;
        const _miChoke = new Set<string>();
        const _miBN = new Set<string>();
        for (let _ri = 0; _ri < _miRows; _ri++) {
          for (let _ci = 0; _ci < _miCols; _ci++) {
            const _isW = newMap.tiles[_ri][_ci] === "wall";
            if (_isW) {
              _miWalls++;
              continue;
            }
            let _wn = 0;
            for (let _dr = -1; _dr <= 1; _dr++)
              for (let _dc = -1; _dc <= 1; _dc++) {
                if (_dr === 0 && _dc === 0) continue;
                const _nr = _ri + _dr;
                const _nc = _ci + _dc;
                if (
                  _nr < 0 ||
                  _nr >= _miRows ||
                  _nc < 0 ||
                  _nc >= _miCols ||
                  newMap.tiles[_nr][_nc] === "wall"
                )
                  _wn++;
              }
            if (_wn >= 6) _miChoke.add(`${_ri},${_ci}`);
            const _cf = [
              [_ri - 1, _ci],
              [_ri + 1, _ci],
              [_ri, _ci - 1],
              [_ri, _ci + 1],
            ].filter(
              ([_rr, _cc]) =>
                _rr >= 0 &&
                _rr < _miRows &&
                _cc >= 0 &&
                _cc < _miCols &&
                newMap.tiles[_rr][_cc] !== "wall",
            ).length;
            if (_cf === 2) _miBN.add(`${_ri},${_ci}`);
          }
        }
        const _miDensity =
          _miRows * _miCols > 0 ? _miWalls / (_miRows * _miCols) : 0;
        mapWallDensityRef.current = _miDensity;
        mapIsCorridorRef.current = _miDensity >= 0.5;
        mapChokePointsRef.current = _miChoke;
        mapBottleneckTilesRef.current = _miBN;
      }
      setPlayerPosition(spawnPosition);
      // RC FIX: No manual loop restart — the single RAF loop (empty deps) continues
      // running and reads the new map from currentMapRef on its next frame.
      setPlayerView("front");
      setMapCount((prev) => prev + 1);
      // Track map visits for achievement
      mapsVisitedCountRef.current += 1;
      try {
        // M6: Namespace by userId+slot so switching accounts doesn't cross-pollute
        const mvKey = userId
          ? `${userId}_slot${characterSlot}_pbv_maps_visited_count`
          : "pbv_maps_visited_count";
        localStorage.setItem(mvKey, String(mapsVisitedCountRef.current));
      } catch {
        /* ignore */
      }
      // ── BOSS PORTAL HANDLING ─────────────────────────────────────────
      const isBossPortalEntry =
        portal.isBossPortal === true && !!portal.bossPortalId;
      if (isBossPortalEntry && portal.bossPortalId) {
        // Load boss config from localStorage (admin-editable)
        const bossConfigsRaw = localStorage.getItem("pbv_boss_configs");
        const allBossConfigs: BossConfig[] = bossConfigsRaw
          ? (JSON.parse(bossConfigsRaw) as BossConfig[])
          : DEFAULT_BOSS_CONFIGS;
        const bossConfig =
          allBossConfigs.find((b) => b.id === portal.bossPortalId) ??
          DEFAULT_BOSS_CONFIGS.find((b) => b.id === portal.bossPortalId);
        if (bossConfig) {
          currentBossConfigRef.current = bossConfig;
          setCurrentBossId(bossConfig.id);
          // Show BOSS ENCOUNTER banner for 1.5s
          setBossEncounterBanner(`☠️ BOSS ENCOUNTER: ${bossConfig.name}`);
          if (bossEncounterBannerTimerRef.current !== null) {
            clearTimeout(bossEncounterBannerTimerRef.current);
          }
          bossEncounterBannerTimerRef.current = window.setTimeout(() => {
            bossEncounterBannerTimerRef.current = null;
            setBossEncounterBanner(null);
          }, 1500);
        }
      }
      // Reset camera system for smooth transition
      cameraVelocityRef.current = { x: 0, y: 0 };
      setCameraOffset({ x: 0, y: 0 });
      setTargetCameraOffset({ x: 0, y: 0 });
      // Generate enemies — boss maps spawn only one boss enemy, normal maps use tier system
      const effectiveDepth = chainJustCompleted ? 0 : nextDungeonDepth;
      let newEnemies: Enemy[];
      if (
        isBossPortalEntry &&
        portal.bossPortalId &&
        currentBossConfigRef.current
      ) {
        const bossConf = currentBossConfigRef.current;
        const midX = Math.floor(WORLD_GRID_SIZE / 2) + 3;
        const midY = Math.floor(WORLD_GRID_SIZE / 2) - 3;
        newEnemies = [
          {
            id: `boss_${bossConf.id}_${Date.now()}`,
            x: midX,
            y: midY,
            pieceType: bossConf.pieceType as ChessPieceType,
            currentView: "front" as ViewDirection,
            isMoving: false,
            movementPath: [],
            currentStepIndex: 0,
            movementStartTime: 0,
            initialDelay: 500,
            spawnTime: Date.now(),
            scaleX: 1.4,
            scaleY: 1.4,
            level: Math.max(1, characterStats.level + 5),
            nextMoveTime: Date.now() + 1000,
            movementSpeed: 700,
            movementRange: 2,
            isWandering: false,
            wanderTarget: null,
            lastMoveTime: Date.now(),
            hp: Math.max(
              1,
              bossConf.baseStats.hp ??
                Math.round((characterStats.level + 5) * 50 + 200),
            ),
            maxHp: Math.max(
              1,
              bossConf.baseStats.hp ??
                Math.round((characterStats.level + 5) * 50 + 200),
            ),
            damage: Math.max(
              1,
              bossConf.baseStats.atk ??
                Math.round((characterStats.level + 5) * 4 + 10),
            ),
            res: Math.min(50, bossConf.baseStats.res),
            sp: Math.min(50, bossConf.baseStats.sp),
            chc: bossConf.baseStats.chc,
            init:
              bossConf.baseStats.init ??
              Math.max(1, 8 + Math.max(1, characterStats.level + 5) - 1),
            sr: 10,
            assignedName: bossConf.name,
            isLeader: true,
            family: "boss",
          },
        ];
        // Initialise boss state
        const freshBossState = initBossState(bossConf.id, bossConf);
        bossStateRef.current = freshBossState;
        setActiveBossState(freshBossState);
      } else {
        newEnemies = newMap.isDeathRealm
          ? []
          : generateEnemies(
              newMap.tiles,
              newMap.portals,
              effectiveDepth,
              newMap.voidTiles,
            );
      }
      // Section 6: ensure all spawns + player + portal are mutually reachable
      const _enemySpawns = newEnemies.map((e) => ({ x: e.x, y: e.y }));
      const _portal = newMap.portals?.[0];
      if (_portal) {
        const { tiles: _tiles, spawns: _spawns } = ensureReachability(
          newMap.tiles as string[][],
          newMap.voidTiles,
          _enemySpawns,
          spawnPosition,
          _portal,
          WORLD_GRID_SIZE,
          WORLD_GRID_SIZE,
        );
        newMap.tiles = _tiles as typeof newMap.tiles;
        newEnemies.forEach((e, i) => {
          if (_spawns[i]) {
            e.x = _spawns[i].x;
            e.y = _spawns[i].y;
          }
        });
      }
      syncCombatants(combatantStoreCtx, newEnemies, { resetBattle: true });
      // M2 FIX: Cloud cluster generation deferred into the portal timer callback
      // so it never blocks the synchronous portal-transition path on mobile
      // (synchronous cloud gen was pushing transitions past 16ms → dropped frames).
      // Skate-rail system removed
      // Weather effects removed
      // Update camera to follow player to new position
      // FIX 1: Cancel any previously-queued portal timers before scheduling new ones.
      // Without this, crossing two portals within 1.6 s lets the first timer clear the
      // transition lock mid-render, allowing two map-generation calls to race.
      if (portalTimerRef1.current !== null) {
        clearTimeout(portalTimerRef1.current);
        portalTimerRef1.current = null;
      }
      if (portalTimerRef2.current !== null) {
        clearTimeout(portalTimerRef2.current);
        portalTimerRef2.current = null;
      }
      portalTimerRef1.current = window.setTimeout(() => {
        // RC FIX: No generation check needed — loop runs forever
        portalTimerRef1.current = null;
        updateCameraToFollowPlayer();
        // Clear transition flag and last portal reference after camera update
        portalTimerRef2.current = window.setTimeout(() => {
          portalTimerRef2.current = null;
          setTransitionInProgress(false);
          transitionInProgressRef.current = false;
          lastPortalRef.current = null;
        }, 1500); // H4: 1500ms guard prevents immediate re-entry when spawning on a portal
      }, 100);
      // Apply map modifiers on portal transition — delegated to the
      // map-modifier registry (engine/mapModifiers.ts). The registry performs
      // the same two-roll trigger logic (global chance → weighted first pick →
      // second-modifier chance) and returns the set of activated modifier ids.
      const triggered = mapModifierRegistry.rollActiveModifiers(mapModifiers, {
        log: (msg: string) => logDebugInfo("MODIFIER", msg),
        rng: Math.random,
      });
      setActiveMapModifierTypes(triggered);
      // EXP5: Apply hazard tiles based on active modifiers (lava/ice/spikes)
      // These add to whatever random hazards were already seeded during map generation.
      if (!newMap.isDeathRealm) {
        const hazardMap = newMap.hazardTiles;
        const spawnCxMod = Math.floor(WORLD_GRID_SIZE / 2);
        const spawnCyMod = Math.floor(WORLD_GRID_SIZE / 2);
        const portalSetMod = new Set(
          newMap.portals.map((p) => `${p.x},${p.y}`),
        );
        const eligMod: { x: number; y: number }[] = [];
        for (let hy = 0; hy < WORLD_GRID_SIZE; hy++) {
          for (let hx = 0; hx < WORLD_GRID_SIZE; hx++) {
            if (newMap.tiles[hy][hx] !== "floor") continue;
            if (portalSetMod.has(`${hx},${hy}`)) continue;
            if (
              Math.abs(hx - spawnCxMod) <= 3 &&
              Math.abs(hy - spawnCyMod) <= 3
            )
              continue;
            if (hazardMap.has(`${hx},${hy}`)) continue;
            eligMod.push({ x: hx, y: hy });
          }
        }
        for (let i = eligMod.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [eligMod[i], eligMod[j]] = [eligMod[j], eligMod[i]];
        }
        let modHazardIdx = 0;
        const addModHazards = (type: HazardType) => {
          const count = 3 + Math.floor(Math.random() * 6); // 3-8
          for (
            let hi = 0;
            hi < count && modHazardIdx < eligMod.length;
            hi++, modHazardIdx++
          ) {
            hazardMap.set(
              `${eligMod[modHazardIdx].x},${eligMod[modHazardIdx].y}`,
              type,
            );
          }
        };
        if (
          triggered.has("thorned_ground") ||
          triggered.has("blood_moon") ||
          triggered.has("spike_pit")
        )
          addModHazards("spikes");
        if (triggered.has("frozen_terrain") || triggered.has("ice_fields"))
          addModHazards("ice");
        if (
          triggered.has("plague_zone") ||
          triggered.has("void_rift") ||
          triggered.has("lava_fields")
        )
          addModHazards("lava");
        // Any other active modifier: 40% chance to add mixed hazards
        if (
          triggered.size > 0 &&
          !triggered.has("thorned_ground") &&
          !triggered.has("blood_moon") &&
          !triggered.has("frozen_terrain") &&
          !triggered.has("plague_zone") &&
          !triggered.has("void_rift") &&
          Math.random() < 0.4
        ) {
          const randHType: HazardType[] = ["lava", "ice", "spikes"];
          addModHazards(
            randHType[Math.floor(Math.random() * randHType.length)],
          );
        }
        if (hazardMap.size > 0) {
          logBattleEntry(
            `⚠️ ${hazardMap.size} hazard tile${hazardMap.size !== 1 ? "s" : ""} detected on this map!`,
            "#ff7675",
          );
        }
      }
      if (triggered.size > 0) {
        const names = [...triggered]
          .map((t) => MAP_MODIFIERS.find((m) => m.id === t)?.name ?? t)
          .join(" + ");
        logBattleEntry(
          `Map modifier${triggered.size > 1 ? "s" : ""} active: ${names}`,
          "#ff7675",
        );
      } else {
        logBattleEntry("No map modifier this area.", "#888888");
      }
      // Spawn ground Doka loot on this map (balance: more enemies = more loot)
      // Only if map is not death realm and has enemies
      // ── #18 Always read Doka spawn config from ref (never stale closure) ──
      const { dokaSpawnChance: spawnChance, dokaSpawnBaseValue: spawnBase } =
        dokaSpawnConfigRef.current;
      if (
        !newMap.isDeathRealm &&
        Math.random() * 100 < spawnChance &&
        newEnemies.length > 0
      ) {
        const avgLevel =
          newEnemies.reduce((s, e) => s + Number(e.level), 0) /
          newEnemies.length;
        const lootCount = Math.max(1, Math.ceil(newEnemies.length / 3));
        // Collect walkable tiles not occupied by player/enemies
        const walkable: { x: number; y: number }[] = [];
        for (let gy = 0; gy < WORLD_GRID_SIZE; gy++) {
          for (let gx = 0; gx < WORLD_GRID_SIZE; gx++) {
            if (
              newMap.tiles[gy]?.[gx] === "floor" &&
              !newMap.voidTiles?.has(`${gx},${gy}`) &&
              !(gx === spawnPosition.x && gy === spawnPosition.y) &&
              !newEnemies.some((e) => e.x === gx && e.y === gy)
            ) {
              walkable.push({ x: gx, y: gy });
            }
          }
        }
        // Shuffle and pick lootCount tiles
        for (let i = walkable.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [walkable[i], walkable[j]] = [walkable[j], walkable[i]];
        }
        const lootItems: DokaLootItem[] = walkable
          .slice(0, lootCount)
          .map((tile) => ({
            id: `doka-${Date.now()}-${tile.x}-${tile.y}`,
            tileX: tile.x,
            tileY: tile.y,
            value: Math.max(
              1,
              Math.round(
                (spawnBase + avgLevel * 2) * (0.8 + Math.random() * 0.4),
              ),
            ),
            collected: false,
          }));
        setDokaLoot(lootItems);
        if (lootItems.length > 0) {
          logBattleEntry(
            `\uD83D\uDCB0 You notice ${lootItems.length} Doka coin${lootItems.length !== 1 ? "s" : ""} scattered on the ground!`,
            "#f1c40f",
          );
        }
      } else {
        setDokaLoot([]);
      }
      // FIX 2: Award 10 XP for portal transition and save progress
      setCharacterStats((prev) => {
        const PORTAL_XP = 10;
        let newExp = prev.exp + PORTAL_XP;
        let newLevel = prev.level;
        let newExpToNext = prev.expToNext;
        while (newExp >= newExpToNext) {
          newExp -= newExpToNext;
          newLevel += 1;
          newExpToNext = Math.floor(100 * 2 ** (newLevel - 1));
        }
        // Save to backend asynchronously
        if (actor) {
          const spellKeys = Object.keys(spellLevels);
          const spellVals = spellKeys.map((k) => BigInt(spellLevels[k] ?? 0));
          const portalXpUpdate = {
            name: characterName,
            pieceType: pieceType,
            colors: [colors.primary, colors.secondary, colors.accent],
            pixelPattern: "",
            rotation: BigInt(0),
            level: BigInt(newLevel),
            experience: BigInt(newExp),
            dokaBalance: BigInt(dokaBalance),
            stats: {
              hp: BigInt(prev.hp),
              ap: BigInt(prev.ap),
              mp: BigInt(prev.mp),
              sp: BigInt(prev.sp),
              sr: BigInt(prev.sr),
              init: BigInt(prev.init),
              res: BigInt(prev.res),
              chc: BigInt(prev.chc),
              atk: BigInt(0),
              resilience: BigInt(0),
              evasion: BigInt(0),
              killCount: BigInt(character?.stats?.killCount ?? 0),
            },
            spellLevelKeys: spellKeys,
            spellLevelValues: spellVals,
          };
          const portalXpSlot = BigInt(characterSlot);
          (async () => {
            try {
              await actor.updateCharacter(portalXpSlot, portalXpUpdate);
            } catch (err) {
              console.warn("[PBV] Character save failed:", err);
              pendingSavesRef.current.push(() =>
                actor.updateCharacter(portalXpSlot, portalXpUpdate),
              );
            }
          })();
        }
        return {
          ...prev,
          exp: newExp,
          level: newLevel,
          expToNext: newExpToNext,
        };
      });
    } else {
      // FIX #14: Player is not on a portal — release lock immediately
      transitionInProgressRef.current = false;
      setTransitionInProgress(false);
    }
  }, [
    inBattle,
    currentMap,
    playerPosition,
    mapModifiers,
    generateRandomMap,
    generateEnemies,
    canvasSize,
    updateCameraToFollowPlayer,
    actor,
    characterSlot,
    characterName,
    pieceType,
    colors,
    spellLevels,
    dokaBalance,
    logBattleEntry,
    dokaSpawnConfigRef,
    setTransitionInProgress,
    characterStats.level,
    setDungeonChainActive,
    setDungeonChainDepth,
    setDungeonChainMaxDepth,
    setDungeonChainBaseLevel,
    onDokaBalanceChange,
  ]);
  // NEW: Enhanced enemy movement system with visible random wandering
  const updateEnemyMovement = useCallback(() => {
    // HARD GATE: enemies are completely frozen during battle or when shop is open
    if (inBattleRef.current) return;
    if (showShop) return;
    if (!currentMap || transitionInProgressRef.current) return;
    const currentTime = Date.now();
    // H3: Only call setEnemies if at least one enemy actually changed position/state.
    // Previously setEnemies was called unconditionally on every frame, causing
    // a cascade of React re-renders even when all enemies were stationary.
    let hasChanged = false;
    const nextEnemies = enemies.map((enemy) => {
      // Skip if enemy is already moving
      if (enemy.isMoving) {
        // Check if current movement is complete
        const elapsed = currentTime - enemy.movementStartTime!;
        const stepDuration =
          enemy.movementSpeed! / Math.max(enemy.movementPath.length, 1);
        const targetStepIndex = Math.floor(elapsed / stepDuration);
        if (targetStepIndex >= enemy.movementPath.length) {
          // Movement complete - update position and reset movement state
          const finalPosition =
            enemy.movementPath[enemy.movementPath.length - 1];
          const nextMoveDelay =
            Math.random() *
              (ENEMY_MOVE_INTERVAL_MAX - ENEMY_MOVE_INTERVAL_MIN) +
            ENEMY_MOVE_INTERVAL_MIN;
          hasChanged = true;
          return {
            ...enemy,
            x: finalPosition.x,
            y: finalPosition.y,
            isMoving: false,
            movementPath: [],
            currentStepIndex: 0,
            nextMoveTime: currentTime + nextMoveDelay,
            lastMoveTime: currentTime,
            wanderTarget: null,
          };
        }
        if (targetStepIndex > enemy.currentStepIndex!) {
          // Update current step and position during movement
          const newPosition = enemy.movementPath[targetStepIndex];
          // Update view direction based on movement
          let newView = enemy.currentView;
          if (targetStepIndex > 0) {
            const prev = enemy.movementPath[targetStepIndex - 1];
            const current = enemy.movementPath[targetStepIndex];
            if (current.x > prev.x) newView = "right";
            else if (current.x < prev.x) newView = "left";
            else if (current.y > prev.y) newView = "front";
            else if (current.y < prev.y) newView = "back";
          }
          hasChanged = true;
          return {
            ...enemy,
            x: newPosition.x,
            y: newPosition.y,
            currentView: newView,
            currentStepIndex: targetStepIndex,
          };
        }
        return enemy;
      }
      // Check if it's time to start a new movement
      if (currentTime >= enemy.nextMoveTime && enemy.isWandering) {
        // Generate a random target within movement range
        const target = generateRandomWalkablePosition(
          currentMap.tiles,
          enemy.x,
          enemy.y,
          enemy.movementRange!,
        );

        if (target) {
          // Find path to target
          const path = findPath({ x: enemy.x, y: enemy.y }, target);

          if (path.length > 0) {
            // Start movement
            hasChanged = true;
            return {
              ...enemy,
              isMoving: true,
              movementPath: path,
              currentStepIndex: 0,
              movementStartTime: currentTime,
              wanderTarget: target,
            };
          }
        }

        // If no valid target found, schedule next attempt
        const nextMoveDelay =
          Math.random() * (ENEMY_MOVE_INTERVAL_MAX - ENEMY_MOVE_INTERVAL_MIN) +
          ENEMY_MOVE_INTERVAL_MIN;
        hasChanged = true;
        return {
          ...enemy,
          nextMoveTime: currentTime + nextMoveDelay,
        };
      }

      return enemy;
    });
    // H3: skip store update if nothing changed
    if (hasChanged) {
      syncCombatants(combatantStoreCtx, nextEnemies);
    }
  }, [
    showShop,
    currentMap,
    generateRandomWalkablePosition,
    findPath,
    combatantStoreCtx,
    enemies,
  ]);

  // BFS flood-fill for MP reachable tiles
  const getMpReachableTiles = useCallback((): Set<string> => {
    if (!currentMap || !inBattleRef.current || currentBattleMp <= 0)
      return new Set();
    // FIX 1 — Build a set of portal positions to exclude from movement targets in battle
    const portalKeys = new Set(currentMap.portals.map((p) => `${p.x},${p.y}`));
    const visited = new Map<string, number>(); // key -> best steps used
    const queue: { x: number; y: number; steps: number }[] = [
      { x: playerPosition.x, y: playerPosition.y, steps: 0 },
    ];
    visited.set(`${playerPosition.x},${playerPosition.y}`, 0);
    const reachable = new Set<string>();
    // Movement cost per tile — delegated to the modifier registry (Slime
    // Flood / Frozen Terrain double the cost via their onMpCost hooks).
    const moveCostPerTile = mapModifierRegistry.applyMpCost(
      1,
      activeMapModifierTypes,
      { log: (msg: string) => logDebugInfo("MODIFIER", msg), rng: Math.random },
    );
    while (queue.length > 0) {
      const current = queue.shift()!;
      const nextSteps = current.steps + moveCostPerTile;
      if (nextSteps > currentBattleMp) continue;
      const dirs = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      for (const d of dirs) {
        const nx = current.x + d.x;
        const ny = current.y + d.y;
        const key = `${nx},${ny}`;
        if (nx < 0 || nx >= WORLD_GRID_SIZE || ny < 0 || ny >= WORLD_GRID_SIZE)
          continue;
        if (currentMap.tiles[ny][nx] === "wall") continue;
        if (portalKeys.has(key)) continue; // FIX 1 — portals are blocked in battle
        if (barrierTilesRef.current.has(key)) continue; // H3 — barrier tiles are impassable
        const prevBest = visited.get(key);
        if (prevBest !== undefined && prevBest <= nextSteps) continue;
        visited.set(key, nextSteps);
        reachable.add(key);
        if (nextSteps < currentBattleMp) {
          queue.push({ x: nx, y: ny, steps: nextSteps });
        }
      }
    }
    return reachable;
  }, [currentMap, playerPosition, currentBattleMp, activeMapModifierTypes]);

  // Get tiles in spell range (Chebyshev) for blue highlights
  const getSpellRangeTiles = useCallback((): Set<string> => {
    if (!currentMap || !inBattleRef.current || !selectedSpellIdRef.current)
      return new Set();
    const spell = activeSpells.find((s) => s.id === selectedSpellIdRef.current);
    if (!spell) return new Set();
    // M5: Check cache before computing. FIX 1.1: include battleWorldVersion so
    // a set computed before an enemy moved can never gate a click after.
    const cacheKey = `${selectedSpellIdRef.current}_${playerPosition.x}_${playerPosition.y}_${battleWorldVersionRef.current}`;
    const cached = spellRangeCacheRef.current.get(cacheKey);
    if (cached) return cached;
    // ── #19 Pacifist Run: flip flag for ANY offensive spell usage ──────────────
    applyHealBuffSideEffect(spell, battleOnlyHealBuffSpellsRef);
    const result = computeTargetableTiles(spell, playerPosition, {
      tiles: currentMap.tiles,
      enemies,
      worldGridSize: WORLD_GRID_SIZE,
      effectiveRange: getEffectiveSpellRange(
        spell.maxRange ?? Math.max(1, Number(spell.range)),
        spell.modifiableRange ? spell.id : undefined,
      ),
      barrierTiles: barrierTilesRef.current,
    });
    // M5: store computed result in cache
    spellRangeCacheRef.current.set(cacheKey, result);
    return result;
  }, [
    currentMap,
    playerPosition,
    activeSpells,
    getEffectiveSpellRange,
    enemies,
  ]);

  // Main render function — DPR-aware, DOFUS-style aesthetics
  // biome-ignore lint/correctness/useExhaustiveDependencies: getBossPixelPattern is a pure function defined in component scope with no external dependencies
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    // Guard: skip entirely if canvas element is missing or has zero dimensions
    // (prevents clear-to-black on unmounted or mid-resize frames)
    if (!canvas) return;
    if (canvas.width === 0 || canvas.height === 0) return;
    if (!currentMap) {
      // Even when no map, paint a dark background so canvas never goes transparent/black
      {
        const ctx2 = canvas.getContext("2d");
        if (ctx2) {
          const dpr2 = dprRef.current;
          const w2 = canvasSize.width;
          const h2 = canvasSize.height;
          if (
            canvas.width !== Math.floor(w2 * dpr2) ||
            canvas.height !== Math.floor(h2 * dpr2)
          ) {
            canvas.width = Math.floor(w2 * dpr2);
            canvas.height = Math.floor(h2 * dpr2);
          }
          ctx2.setTransform(1, 0, 0, 1, 0, 0);
          ctx2.scale(dpr2, dpr2);
          ctx2.fillStyle = "#0a0c18";
          ctx2.fillRect(0, 0, w2, h2);
        }
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    // M-1: Null-check with context-reset recovery trick.
    // Under GPU memory pressure getContext("2d") can return null.
    // Assigning canvas.width forces an internal context reset so the
    // next rAF frame can obtain a fresh context instead of staying black.
    if (!ctx) {
      // Force context reset without changing pixel dimensions
      const savedW = canvas.width;
      canvas.width = 0;
      canvas.width = savedW;
      return;
    }

    // ── Battle-init frame guard ─────────────────────────────────────────────
    // When battle starts, React fires multiple setState calls (setInBattle,
    // setTurnOrder, setPlayerPosition, setCurrentBattleAp, etc.) in sequence.
    // During that cascade the render loop clears the canvas before all state
    // has settled → black frame visible to user. We skip the first 2 render
    // frames after battle starts so state settles before we draw.
    if (inBattleRef.current) {
      if (battleInitFrameRef.current < 3) {
        // Only increment during the init phase (first 3 frames after battle starts).
        // Once >= 3 we are past init — never increment again so mid-battle state
        // changes (spell selection, targeting, etc.) never re-trigger the early return.
        battleInitFrameRef.current++;
        return;
      }
      // battleInitFrameRef >= 3: init phase passed, render normally every frame
    }
    // Note: battleInitFrameRef is reset to 0 at battle start only (not in render loop)

    // DPR-aware: draw at logical canvas size (ctx is already scaled via dprRef in ResizeObserver)
    // Re-apply transform each frame to survive any context reset
    const dpr = dprRef.current;
    const w = canvasSize.width;
    const h = canvasSize.height;
    // Ensure physical size matches in case React reset it
    if (
      canvas.width !== Math.floor(w * dpr) ||
      canvas.height !== Math.floor(h * dpr)
    ) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.save();
    const _shake = effectsManagerRef.current.getShakeOffset();
    ctx.translate(_shake.x, _shake.y);

    // Clear with solid dark background — never transparent
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0a0c18";
    ctx.fillRect(0, 0, w, h);
    // Subtle overlay so tiles read clearly over starfield
    ctx.fillStyle = "rgba(8,10,22,0.55)";
    ctx.fillRect(0, 0, w, h);

    // ── Pre-compute ambient occlusion mask when map changes ───────────────────
    if (aoMapIdRef.current !== currentMap.id) {
      aoMapIdRef.current = currentMap.id;
      const size = WORLD_GRID_SIZE * WORLD_GRID_SIZE;
      const mask = new Uint8Array(size);
      for (let gy = 0; gy < WORLD_GRID_SIZE; gy++) {
        for (let gx = 0; gx < WORLD_GRID_SIZE; gx++) {
          if (currentMap.tiles[gy][gx] === "wall") continue;
          let bits = 0;
          // top-right neighbor (gx+1, gy-1 in iso = wall to the upper-right)
          if (
            gx + 1 < WORLD_GRID_SIZE &&
            gy > 0 &&
            currentMap.tiles[gy - 1][gx + 1] === "wall"
          )
            bits |= 1;
          // top-left neighbor (gx-1, gy-1 in iso = wall to the upper-left)
          if (gx > 0 && gy > 0 && currentMap.tiles[gy - 1][gx - 1] === "wall")
            bits |= 2;
          // right neighbor in grid
          if (
            gx + 1 < WORLD_GRID_SIZE &&
            currentMap.tiles[gy][gx + 1] === "wall"
          )
            bits |= 4;
          // left neighbor in grid
          if (gx > 0 && currentMap.tiles[gy][gx - 1] === "wall") bits |= 8;
          mask[gy * WORLD_GRID_SIZE + gx] = bits;
        }
      }
      aoMaskRef.current = mask;
      // Seed dust motes on first map
      // Hard cap: dust motes must never exceed 40 at any time
      const DUST_MOTE_CAP = 40;
      if (dustMotesRef.current.length === 0) {
        const mapPxW = WORLD_GRID_SIZE * effectiveTileW;
        const mapPxH = WORLD_GRID_SIZE * effectiveTileH;
        const motes: DustMote[] = [];
        const count = Math.min(
          DUST_MOTE_CAP,
          18 + Math.floor(Math.random() * 8),
        );
        for (let i = 0; i < count; i++) {
          const maxLife = 180 + Math.floor(Math.random() * 120);
          motes.push({
            x: (Math.random() - 0.5) * mapPxW,
            y: (Math.random() - 0.5) * mapPxH,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: 1.5 + Math.random() * 1.5,
            alpha: 0,
            life: Math.floor(Math.random() * maxLife),
            maxLife,
          });
        }
        dustMotesRef.current = motes;
      } else if (dustMotesRef.current.length > DUST_MOTE_CAP) {
        // Trim any excess that may have accumulated
        dustMotesRef.current = dustMotesRef.current.slice(0, DUST_MOTE_CAP);
      }
    }

    // Compute highlight tile sets for battle mode
    // inBattle intentionally read via inBattleRef to prevent animation loop restart
    const mpTiles =
      inBattleRef.current && battleActionModeRef.current === "walk"
        ? getMpReachableTiles()
        : new Set<string>();
    const spellTiles =
      inBattleRef.current &&
      battleActionModeRef.current === "attack" &&
      selectedSpellIdRef.current
        ? getSpellRangeTiles()
        : new Set<string>();
    const barrierTileSnapshot = new Map(barrierTilesRef.current);

    // ── PAINTER'S ALGORITHM: per-row isometric draw order ───────────────────
    // For each row (y=0 is farthest back, y=GRID_SIZE-1 is nearest front):
    // 1. Draw all floor tiles in this row (left to right)
    // 2. Draw walls in this row (left to right)
    // 3. Draw portals in this row
    // 4. Draw enemies in this row
    // 5. Draw player if in this row
    // This guarantees entities in front rows always appear ABOVE blocks in back rows.
    const now = Date.now();

    // Build portal lookup by grid position for O(1) access
    const portalMap = new Map<string, (typeof currentMap.portals)[0]>();
    for (const portal of currentMap.portals) {
      portalMap.set(`${portal.x},${portal.y}`, portal);
    }

    // (allWallPositions and isEntityBehindWalls removed — unified depth-sorted pass below replaces multi-pass entity draw)

    const wallDepthItems: Array<{
      screenX: number;
      screenY: number;
      wx: number;
      wy: number;
      depth: number;
      isBarrier?: boolean;
    }> = [];

    const portalDepthItems: Array<{
      depth: number;
      draw: () => void;
    }> = [];

    for (let y = 0; y < WORLD_GRID_SIZE; y++) {
      // ── E. Sine-wave shimmer: per-row brightness offset ─────────────────────
      if (!currentMap.tiles[y]) continue;
      const shimmerAlpha = Math.max(0, Math.sin(now * 0.0008 + y * 0.3) * 0.03);

      // Pass 1: floor tiles for this row
      for (let x = 0; x < WORLD_GRID_SIZE; x++) {
        if (currentMap.tiles[y][x] === undefined) continue;
        if (currentMap?.voidTiles?.has(`${x},${y}`)) continue;
        const tileType = currentMap.tiles[y][x];
        if (tileType !== "wall") {
          const screenPos = gridToScreen(x, y);
          const isHovered = hoveredTile?.x === x && hoveredTile?.y === y;
          const isClicked = clickedTile?.x === x && clickedTile?.y === y;

          drawIsometricTile(
            ctx,
            screenPos.x,
            screenPos.y,
            tileType,
            x,
            y,
            isHovered,
            isClicked,
            effectiveTileW,
            effectiveTileH,
            currentMap.colorFamily,
            currentMap.wallPalette,
          );

          // EXP5: Draw hazard tile overlay on floor tiles
          const hazardType =
            tileType === "floor"
              ? currentMap.hazardTiles?.get(`${x},${y}`)
              : undefined;
          if (hazardType && !isClicked) {
            const hSeed = Math.abs(
              x * 7331 + y * 5003 + currentMap.id.charCodeAt(0),
            );
            const hrng = seededRng(hSeed);
            const tw = effectiveTileW;
            const th = effectiveTileH;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(screenPos.x + tw / 2, screenPos.y + th / 2);
            ctx.lineTo(screenPos.x, screenPos.y + th);
            ctx.lineTo(screenPos.x - tw / 2, screenPos.y + th / 2);
            ctx.closePath();
            ctx.clip();

            // Base tint colour
            if (hazardType === "lava") {
              ctx.fillStyle = "rgba(180,30,0,0.68)";
            } else if (hazardType === "ice") {
              ctx.fillStyle = "rgba(100,200,255,0.55)";
            } else {
              ctx.fillStyle = "rgba(40,40,40,0.72)";
            }
            ctx.fill();

            // Dense pixel texture (30-50 random pixels using the hazard palette)
            const pxCount = Math.floor(hrng() * 21) + 30; // 30-50
            for (let pi = 0; pi < pxCount; pi++) {
              const px = screenPos.x - tw / 2 + hrng() * tw;
              const py = screenPos.y + hrng() * th;
              const ps = hrng() < 0.4 ? 2 : 3;
              const shade = Math.floor(hrng() * 60) - 20;
              if (hazardType === "lava") {
                // Dark red → orange-red → bright orange, with occasional yellow hotspot
                const isHot = hrng() < 0.12;
                const r = isHot ? 255 : Math.min(255, 160 + Math.abs(shade));
                const g = isHot ? 220 : Math.max(0, 30 + shade);
                const b = isHot ? 20 : 0;
                ctx.fillStyle = `rgb(${r},${g},${b})`;
              } else if (hazardType === "ice") {
                // Pale blue-white to light cyan
                const bv = Math.min(255, 200 + shade);
                ctx.fillStyle = `rgb(${Math.max(180, bv - 20)},${Math.max(220, bv)},255)`;
              } else {
                // Spikes: dark grey/charcoal with lighter tip pixels
                const isTip = hrng() < 0.15;
                const gv = isTip ? 170 : Math.max(30, 60 + shade);
                ctx.fillStyle = `rgb(${gv},${gv},${gv})`;
              }
              ctx.fillRect(Math.round(px), Math.round(py), ps, ps);
            }

            // Type icon symbol drawn at tile centre
            const tcx = screenPos.x;
            const tcy = screenPos.y + th / 2;
            ctx.globalAlpha = 0.9;
            ctx.font = `${Math.round(th * 0.65)}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (hazardType === "lava") {
              // Lava: animated glow dots
              const pulse = 0.6 + 0.4 * Math.sin(now * 0.004 + hSeed);
              ctx.globalAlpha = pulse * 0.9;
              for (let di = 0; di < 4; di++) {
                const da = (di / 4) * Math.PI * 2;
                const dr = th * 0.2;
                const dx2 = Math.cos(da) * dr * 0.5;
                const dy2 = Math.sin(da) * dr * 0.3;
                ctx.fillStyle = `rgba(255,${180 + Math.floor(pulse * 60)},20,${pulse})`;
                ctx.fillRect(
                  Math.round(tcx + dx2) - 2,
                  Math.round(tcy + dy2) - 2,
                  4,
                  4,
                );
              }
            } else if (hazardType === "ice") {
              // Ice: snowflake-like star pattern
              ctx.fillStyle = "rgba(255,255,255,0.9)";
              for (let si = 0; si < 4; si++) {
                const sa = (si / 4) * Math.PI;
                const sl = th * 0.28;
                const sx1 = tcx + Math.cos(sa) * sl;
                const sy1 = tcy + Math.sin(sa) * sl * 0.5;
                const sx2 = tcx - Math.cos(sa) * sl;
                const sy2 = tcy - Math.sin(sa) * sl * 0.5;
                ctx.fillRect(Math.round(sx1) - 1, Math.round(sy1) - 1, 3, 3);
                ctx.fillRect(Math.round(sx2) - 1, Math.round(sy2) - 1, 3, 3);
              }
              ctx.fillRect(tcx - 1, tcy - 1, 3, 3);
            } else {
              // Spikes: 3 upward-pointing triangular pixel clusters
              ctx.fillStyle = "rgba(180,180,180,0.95)";
              const spikeOffsets = [-tw * 0.22, 0, tw * 0.22];
              for (const sox of spikeOffsets) {
                const sby = tcy - th * 0.18;
                // Triangle tip + body pixels
                ctx.fillRect(
                  Math.round(tcx + sox) - 1,
                  Math.round(sby) - 1,
                  2,
                  2,
                );
                ctx.fillStyle = "rgba(120,120,120,0.85)";
                ctx.fillRect(
                  Math.round(tcx + sox) - 2,
                  Math.round(sby + 4),
                  4,
                  3,
                );
                ctx.fillStyle = "rgba(180,180,180,0.95)";
              }
            }
            ctx.restore();
          }

          // ── E. Apply row shimmer overlay ─────────────────────────────────
          if (shimmerAlpha > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(
              screenPos.x + effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.lineTo(screenPos.x, screenPos.y + effectiveTileH);
            ctx.lineTo(
              screenPos.x - effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.closePath();
            ctx.fillStyle = `rgba(255,255,255,${shimmerAlpha})`;
            ctx.fill();
            ctx.restore();
          }

          // ── A. Tile ambient occlusion ────────────────────────────────────
          const aoMask = aoMaskRef.current;
          if (aoMask) {
            const bits = aoMask[y * WORLD_GRID_SIZE + x];
            if (bits & 4) {
              ctx.save();
              const grad = ctx.createLinearGradient(
                screenPos.x + effectiveTileW / 2,
                screenPos.y + effectiveTileH / 2,
                screenPos.x + effectiveTileW / 2 - 8,
                screenPos.y + effectiveTileH / 2,
              );
              grad.addColorStop(0, "rgba(0,0,0,0.22)");
              grad.addColorStop(1, "rgba(0,0,0,0)");
              ctx.beginPath();
              ctx.moveTo(screenPos.x, screenPos.y);
              ctx.lineTo(
                screenPos.x + effectiveTileW / 2,
                screenPos.y + effectiveTileH / 2,
              );
              ctx.lineTo(screenPos.x, screenPos.y + effectiveTileH);
              ctx.lineTo(
                screenPos.x - effectiveTileW / 2,
                screenPos.y + effectiveTileH / 2,
              );
              ctx.closePath();
              ctx.fillStyle = grad;
              ctx.fill();
              ctx.restore();
            }
            if (bits & 8) {
              ctx.save();
              const grad = ctx.createLinearGradient(
                screenPos.x - effectiveTileW / 2,
                screenPos.y + effectiveTileH / 2,
                screenPos.x - effectiveTileW / 2 + 8,
                screenPos.y + effectiveTileH / 2,
              );
              grad.addColorStop(0, "rgba(0,0,0,0.22)");
              grad.addColorStop(1, "rgba(0,0,0,0)");
              ctx.beginPath();
              ctx.moveTo(screenPos.x, screenPos.y);
              ctx.lineTo(
                screenPos.x + effectiveTileW / 2,
                screenPos.y + effectiveTileH / 2,
              );
              ctx.lineTo(screenPos.x, screenPos.y + effectiveTileH);
              ctx.lineTo(
                screenPos.x - effectiveTileW / 2,
                screenPos.y + effectiveTileH / 2,
              );
              ctx.closePath();
              ctx.fillStyle = grad;
              ctx.fill();
              ctx.restore();
            }
          }

          // ── D. Tile hover glow (animated pulse) ──────────────────────────
          if (isHovered && tileType === "floor") {
            const pulseAlpha = 0.12 + Math.sin(now * 0.003) * 0.05;
            const isSpellHover =
              inBattleRef.current &&
              battleActionModeRef.current === "attack" &&
              selectedSpellIdRef.current;
            const isMpHover =
              inBattleRef.current && battleActionModeRef.current === "walk";
            const glowR = isSpellHover ? 100 : isMpHover ? 0 : 255;
            const glowG = isSpellHover ? 150 : isMpHover ? 255 : 255;
            const glowB = isSpellHover ? 255 : isMpHover ? 100 : 200;
            ctx.save();
            const glowGrad = ctx.createRadialGradient(
              screenPos.x,
              screenPos.y + effectiveTileH / 2,
              0,
              screenPos.x,
              screenPos.y + effectiveTileH / 2,
              effectiveTileW / 2,
            );
            glowGrad.addColorStop(
              0,
              `rgba(${glowR},${glowG},${glowB},${pulseAlpha})`,
            );
            glowGrad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(
              screenPos.x + effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.lineTo(screenPos.x, screenPos.y + effectiveTileH);
            ctx.lineTo(
              screenPos.x - effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.closePath();
            ctx.fillStyle = glowGrad;
            ctx.fill();
            ctx.restore();
          }

          // Green MP highlight
          if (mpTiles.has(`${x},${y}`)) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(
              screenPos.x + effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.lineTo(screenPos.x, screenPos.y + effectiveTileH);
            ctx.lineTo(
              screenPos.x - effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.closePath();
            ctx.fillStyle = "rgba(0,200,80,0.35)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,220,100,0.8)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }

          // H3 Barrier tile — now rendered as a 6-high tower in the unified
          // depth-sorted pass (see wallDepthItems + drawBarrierTower). The
          // floor-pass single-block draw was removed in Section 3.

          // Blue spell range highlight
          if (spellTiles.has(`${x},${y}`)) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(
              screenPos.x + effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.lineTo(screenPos.x, screenPos.y + effectiveTileH);
            ctx.lineTo(
              screenPos.x - effectiveTileW / 2,
              screenPos.y + effectiveTileH / 2,
            );
            ctx.closePath();
            ctx.fillStyle = "rgba(30,100,255,0.35)";
            ctx.fill();
            ctx.strokeStyle = "rgba(60,140,255,0.85)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      if (!currentMap.tiles[y]) continue;
      // Pass 2b: wall blocks for this row (enemies/player drawn in unified pass below)
      for (let x = 0; x < WORLD_GRID_SIZE; x++) {
        if (currentMap.tiles[y][x] === undefined) continue;
        if (currentMap.tiles[y][x] === "wall") {
          const screenPos = gridToScreen(x, y);
          wallDepthItems.push({
            screenX: screenPos.x,
            screenY: screenPos.y,
            wx: x,
            wy: y,
            depth: x + y,
          });
        }
      }

      // Pass 2c: barrier tiles for this row — pushed into wallDepthItems with
      // isBarrier flag so they participate in the same depth-sorted painter's
      // pass as walls and combatants. Rendered as a 6-high tower (Section 3).
      for (let x = 0; x < WORLD_GRID_SIZE; x++) {
        if (!barrierTileSnapshot.has(`${x},${y}`)) continue;
        const screenPos = gridToScreen(x, y);
        wallDepthItems.push({
          screenX: screenPos.x,
          screenY: screenPos.y,
          wx: x,
          wy: y,
          depth: x + y,
          isBarrier: true,
        });
      }

      // Pass 3: portals at this row — push into portalDepthItems for unified depth-sorted draw
      for (let x = 0; x < WORLD_GRID_SIZE; x++) {
        const portal = portalMap.get(`${x},${y}`);
        if (!portal) continue;
        const screenPos = gridToScreen(portal.x, portal.y);
        const _portalSnapshot = {
          portal,
          screenPos,
          inBattle: inBattleRef.current,
          tw2: effectiveTileW,
          th2: effectiveTileH,
        };
        portalDepthItems.push({
          depth: portal.x + portal.y,
          draw: () => {
            const {
              portal: p,
              screenPos: sp,
              inBattle,
              tw2,
              th2,
            } = _portalSnapshot;
            if (inBattle) {
              // Draw a teal cube block (distinct from grey stone walls) with pixel texture
              const bh = 28;
              ctx.save();

              // Helper: draw pixel dots across a face polygon using seeded random
              const drawPortalPixels = (
                seed: number,
                baseColor: string,
                xs: number[],
                ys: number[],
                count: number,
              ) => {
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);
                let sv = Math.abs(seed) + 1;
                const nextRng = () => {
                  sv = (sv * 16807) % 2147483647;
                  return (sv - 1) / 2147483646;
                };
                for (let i = 0; i < count; i++) {
                  const px = minX + nextRng() * (maxX - minX);
                  const py = minY + nextRng() * (maxY - minY);
                  const sz = 1 + nextRng();
                  const bright = nextRng() < 0.5 ? 1 : -1;
                  const bParsed = Number.parseInt(baseColor.slice(1), 16);
                  const r = Math.min(
                    255,
                    Math.max(0, ((bParsed >> 16) & 0xff) + bright * 30),
                  );
                  const g = Math.min(
                    255,
                    Math.max(0, ((bParsed >> 8) & 0xff) + bright * 25),
                  );
                  const b = Math.min(
                    255,
                    Math.max(0, (bParsed & 0xff) + bright * 20),
                  );
                  ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
                  ctx.fillRect(px, py, sz, sz);
                }
              };

              const portalSeed = p.x * 127 + p.y * 311;
              const isDungeonPortal = p.color === "dungeon";
              const ptop = isDungeonPortal ? "#8b0000" : "#00CED1";
              const pright = isDungeonPortal ? "#660000" : "#008B8B";
              const pleft = isDungeonPortal ? "#4a0000" : "#006666";
              const pstroke = isDungeonPortal ? "#2a0000" : "#005a5c";
              const pfront1 = isDungeonPortal ? "#550000" : "#007a7a";
              const pfront2 = isDungeonPortal ? "#3a0000" : "#005c5c";

              // Top face
              ctx.beginPath();
              ctx.moveTo(sp.x, sp.y - bh);
              ctx.lineTo(sp.x + tw2 / 2, sp.y + th2 / 2 - bh);
              ctx.lineTo(sp.x, sp.y + th2 - bh);
              ctx.lineTo(sp.x - tw2 / 2, sp.y + th2 / 2 - bh);
              ctx.closePath();
              ctx.fillStyle = ptop;
              ctx.fill();
              ctx.strokeStyle = pstroke;
              ctx.lineWidth = 0.5;
              ctx.stroke();
              drawPortalPixels(
                portalSeed,
                ptop,
                [sp.x, sp.x + tw2 / 2, sp.x, sp.x - tw2 / 2],
                [
                  sp.y - bh,
                  sp.y + th2 / 2 - bh,
                  sp.y + th2 - bh,
                  sp.y + th2 / 2 - bh,
                ],
                10,
              );

              // Right face
              ctx.beginPath();
              ctx.moveTo(sp.x + tw2 / 2, sp.y + th2 / 2);
              ctx.lineTo(sp.x + tw2 / 2, sp.y + th2 / 2 - bh);
              ctx.lineTo(sp.x, sp.y - bh);
              ctx.lineTo(sp.x, sp.y);
              ctx.closePath();
              ctx.fillStyle = pright;
              ctx.fill();
              ctx.strokeStyle = isDungeonPortal ? "#200000" : "#004444";
              ctx.lineWidth = 0.5;
              ctx.stroke();
              drawPortalPixels(
                portalSeed + 1,
                pright,
                [sp.x + tw2 / 2, sp.x + tw2 / 2, sp.x, sp.x],
                [sp.y + th2 / 2, sp.y + th2 / 2 - bh, sp.y - bh, sp.y],
                9,
              );

              // Left face
              ctx.beginPath();
              ctx.moveTo(sp.x - tw2 / 2, sp.y + th2 / 2);
              ctx.lineTo(sp.x - tw2 / 2, sp.y + th2 / 2 - bh);
              ctx.lineTo(sp.x, sp.y - bh);
              ctx.lineTo(sp.x, sp.y);
              ctx.closePath();
              ctx.fillStyle = pleft;
              ctx.fill();
              ctx.strokeStyle = isDungeonPortal ? "#150000" : "#003333";
              ctx.lineWidth = 0.5;
              ctx.stroke();
              drawPortalPixels(
                portalSeed + 2,
                pleft,
                [sp.x - tw2 / 2, sp.x - tw2 / 2, sp.x, sp.x],
                [sp.y + th2 / 2, sp.y + th2 / 2 - bh, sp.y - bh, sp.y],
                9,
              );

              // Front faces (bottom cube)
              ctx.beginPath();
              ctx.moveTo(sp.x, sp.y);
              ctx.lineTo(sp.x + tw2 / 2, sp.y + th2 / 2);
              ctx.lineTo(sp.x, sp.y + th2);
              ctx.closePath();
              ctx.fillStyle = pfront1;
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(sp.x - tw2 / 2, sp.y + th2 / 2);
              ctx.lineTo(sp.x, sp.y);
              ctx.lineTo(sp.x, sp.y + th2);
              ctx.closePath();
              ctx.fillStyle = pfront2;
              ctx.fill();
              // Dark seam
              ctx.strokeStyle = "#000000";
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(sp.x, sp.y);
              ctx.lineTo(sp.x, sp.y + th2);
              ctx.stroke();
              ctx.restore();
            } else {
              drawPortalWhirlpool(
                ctx,
                sp.x,
                sp.y,
                p.isRestPortal ? "rest" : p.color,
                p.animationOffset,
              );
              // EXP8: Draw tooltip label above dungeon portals when player is nearby
              if (p.color === "dungeon" || dungeonChainActiveRef.current) {
                const dx = Math.abs(playerPosition.x - p.x);
                const dy = Math.abs(playerPosition.y - p.y);
                if (dx <= 3 && dy <= 3) {
                  const labelText = dungeonChainActiveRef.current
                    ? `⚔️ Continue Chain (${dungeonChainDepthRef.current}/${dungeonChainMaxDepthRef.current})`
                    : "⚔️ Enter Dungeon Chain";
                  ctx.save();
                  ctx.font = "bold 10px sans-serif";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "bottom";
                  const lw = ctx.measureText(labelText).width + 10;
                  const lh = 16;
                  const lx = sp.x - lw / 2;
                  const ly = sp.y - 45;
                  ctx.fillStyle = "rgba(60,0,0,0.82)";
                  ctx.beginPath();
                  ctx.roundRect(lx, ly, lw, lh, 3);
                  ctx.fill();
                  ctx.strokeStyle = "#cc0000";
                  ctx.lineWidth = 1;
                  ctx.stroke();
                  ctx.fillStyle = "#ff8888";
                  ctx.fillText(labelText, sp.x, ly + lh - 2);
                  ctx.restore();
                }
              }
            }
          },
        });
      }
    }
    // ── END OF ROW LOOP ──────────────────────────────────────────────────────

    // ── UNIFIED DEPTH-SORTED ENTITY PASS ────────────────────────────────────
    // Collect all entities (enemies + player + portals) into one array, sort by
    // isometric depth (gx + gy ascending = painter's algorithm: low depth drawn
    // first), then draw in that single pass.
    {
      type DrawEntity =
        | { kind: "enemy"; idx: number; depth: number }
        | { kind: "player"; depth: number };
      const drawQueue: DrawEntity[] = [];

      for (let i = 0; i < combatantsRef.current.length; i++) {
        const e = combatantsRef.current[i];
        if (!isAliveCombatant(e)) continue;
        drawQueue.push({
          kind: "enemy",
          idx: i,
          depth: (e.x ?? 0) + (e.y ?? 0),
        });
      }
      drawQueue.push({
        kind: "player",
        depth: playerPosition.x + playerPosition.y,
      });

      // Painter's algorithm: lower depth (farther back) drawn first
      type WallDepthItem = (typeof wallDepthItems)[number] & { kind: "wall" };
      type PortalDepthItem = (typeof portalDepthItems)[number] & {
        kind: "portal";
      };
      type RenderItem = WallDepthItem | PortalDepthItem | DrawEntity;
      const allRenderItems: RenderItem[] = [
        ...wallDepthItems.map((w) => ({ ...w, kind: "wall" as const })),
        ...portalDepthItems.map((p) => ({ ...p, kind: "portal" as const })),
        ...drawQueue,
      ].sort((a, b) => a.depth - b.depth);

      for (const renderItem of allRenderItems) {
        if (renderItem.kind === "portal") {
          renderItem.draw();
          continue;
        }
        if (renderItem.kind === "wall") {
          if (renderItem.isBarrier) {
            // Barrier tower — 6 stacked block layers, depth-sorted with walls
            // and combatants (Section 3).
            drawBarrierTower(
              ctx,
              renderItem.screenX,
              renderItem.screenY,
              effectiveTileW,
              effectiveTileH,
              renderItem.wx,
              renderItem.wy,
            );
            continue;
          }
          drawIsometricTile(
            ctx,
            renderItem.screenX,
            renderItem.screenY,
            "wall",
            renderItem.wx,
            renderItem.wy,
            hoveredTile?.x === renderItem.wx &&
              hoveredTile?.y === renderItem.wy,
            clickedTile?.x === renderItem.wx &&
              clickedTile?.y === renderItem.wy,
            effectiveTileW,
            effectiveTileH,
            currentMap.colorFamily,
            currentMap.wallPalette,
          );
          continue;
        }
        if (renderItem.kind === "enemy") {
          const enemy = combatantsRef.current[renderItem.idx];
          const screenPos = gridToScreen(enemy.x ?? 0, enemy.y ?? 0);

          // Sprite drop shadow
          {
            const footX = screenPos.x;
            const footY = screenPos.y + effectiveTileH / 2 + 4;
            const sw = Math.min(effectiveTileW * 0.35, effectiveTileH * 0.3);
            const sh = sw * 0.35;
            ctx.save();
            const shadowGrad = ctx.createRadialGradient(
              footX,
              footY,
              0,
              footX,
              footY,
              sw,
            );
            shadowGrad.addColorStop(0, "rgba(0,0,0,0.35)");
            shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = shadowGrad;
            ctx.beginPath();
            ctx.ellipse(footX, footY, sw, sh, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          if (enemy.isMoving) {
            ctx.save();
            ctx.shadowColor = "#ff6b6b";
            ctx.shadowBlur = 8;
            ctx.globalAlpha = 0.8 + 0.2 * Math.sin(Date.now() * 0.01);
          }
          drawCombatant(
            ctx,
            enemy as unknown as CombatantEntity,
            screenPos,
            enemy.currentView as ViewDirection | undefined,
            {
              getBossPattern: getBossPixelPattern,
              getFamilyPattern: getEnemyFamilyPixelPattern as (
                family: string,
              ) => number[][],
              getFamilyColors: getEnemyFamilyColors as (
                family: string,
              ) => Record<number, string>,
              drawPattern: drawPixelPattern,
              characterYOffset: CHARACTER_Y_OFFSET,
            },
          );
          if (enemy.isMoving) ctx.restore();

          const isLeader = leaderEnemyIdRef.current === enemy.id;
          // Enemy name label — name on first line, level on second line with color coding
          {
            const enemyName = `${isLeader ? "\uD83D\uDC51 " : ""}${enemy.assignedName ?? (enemy.pieceType ?? "pawn").charAt(0).toUpperCase() + (enemy.pieceType ?? "pawn").slice(1)}`;
            const levelLabel = `L${enemy.level}`;
            const playerLvl = characterStats?.level ?? 1;
            const levelDiff = (enemy.level ?? 1) - playerLvl;
            const levelColor =
              levelDiff <= 0
                ? "#00e676"
                : levelDiff <= 10
                  ? "#ff9800"
                  : levelDiff <= 100
                    ? "#f44336"
                    : "#ce93d8";
            const nameY = screenPos.y - 34;
            const levelY = nameY + 14;
            ctx.save();
            ctx.font = "bold 11px Arial";
            ctx.textAlign = "center";
            ctx.strokeStyle = "rgba(0,0,0,0.85)";
            ctx.lineWidth = 2.5;
            // Draw name
            ctx.strokeText(enemyName, screenPos.x, nameY);
            ctx.fillStyle = isLeader ? "#ffd700" : "#ffffff";
            ctx.fillText(enemyName, screenPos.x, nameY);
            // Draw level
            ctx.strokeText(levelLabel, screenPos.x, levelY);
            ctx.fillStyle = levelColor;
            ctx.fillText(levelLabel, screenPos.x, levelY);
            ctx.restore();
          }

          // Summon lifespan badge — small amber pip drawn above the sprite
          // showing turnsRemaining. Counts down each turn as
          // decrementSummonLifespan (summonIntegration.ts) reduces the value.
          // Minimal inline draw block in the render loop; no state changes.
          if (enemy.isSummon && enemy.turnsRemaining != null) {
            const badgeText = `\u23F3${enemy.turnsRemaining}`;
            const badgeX = screenPos.x + 18;
            const badgeY = screenPos.y - 48;
            ctx.save();
            ctx.font = "bold 9px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const padX = 4;
            const badgeW = ctx.measureText(badgeText).width + padX * 2;
            const badgeH = 12;
            // Stone-themed amber pill background
            ctx.fillStyle = "rgba(80,65,40,0.85)";
            ctx.strokeStyle = "rgba(160,140,90,0.7)";
            ctx.lineWidth = 1;
            const bx = badgeX - badgeW / 2;
            const by = badgeY - badgeH / 2;
            const r = 4;
            ctx.beginPath();
            ctx.moveTo(bx + r, by);
            ctx.arcTo(bx + badgeW, by, bx + badgeW, by + badgeH, r);
            ctx.arcTo(bx + badgeW, by + badgeH, bx, by + badgeH, r);
            ctx.arcTo(bx, by + badgeH, bx, by, r);
            ctx.arcTo(bx, by, bx + badgeW, by, r);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "rgba(230,210,160,0.95)";
            ctx.fillText(badgeText, badgeX, badgeY);
            ctx.restore();
          }

          if (
            inBattleRef.current &&
            battleActionModeRef.current === "attack" &&
            selectedSpellIdRef.current &&
            hoveredEnemyIdRef.current === enemy.id
          ) {
            const spell = activeSpellsRef.current.find(
              (s) => s.id === selectedSpellIdRef.current,
            );
            const baseDmg = spell ? Number(spell.damage) : 0;
            const _spellUpgLvl = spell
              ? (spellLevelsRef.current[spell.id] ?? 0)
              : 0;
            const scaledDmg = spell
              ? computeDamage(
                  baseDmg,
                  spell.id,
                  enemy as unknown as Enemy,
                  { x: enemy.x ?? 0, y: enemy.y ?? 0 },
                  spell.isPhysical || false,
                  false,
                  activeEffectsRef.current,
                ).finalDamage
              : 0;
            ctx.save();
            ctx.fillStyle = "#ff4444";
            ctx.strokeStyle = "#220000";
            ctx.lineWidth = 2;
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.strokeText(`-${scaledDmg}`, screenPos.x, screenPos.y - 44);
            ctx.fillText(`-${scaledDmg}`, screenPos.x, screenPos.y - 44);
            if (scaledDmg !== baseDmg) {
              ctx.font = "10px Arial";
              ctx.fillStyle = "rgba(255,180,80,0.9)";
              ctx.strokeStyle = "rgba(20,0,0,0.8)";
              ctx.lineWidth = 1;
              const dmgLabel = `${spell?.name ?? ""}: ${scaledDmg} (base ${baseDmg}×L${characterStats.level})`;
              ctx.strokeText(dmgLabel, screenPos.x, screenPos.y - 58);
              ctx.fillText(dmgLabel, screenPos.x, screenPos.y - 58);
            }
            ctx.restore();
          }

          if (enemy.isWandering && !enemy.isMoving) {
            const pulseAlpha =
              0.3 +
              0.2 * Math.sin(Date.now() * 0.005 + enemy.spawnTime! * 0.001);
            ctx.save();
            ctx.globalAlpha = pulseAlpha;
            ctx.strokeStyle = "#4ade80";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(
              screenPos.x,
              screenPos.y - CHARACTER_Y_OFFSET,
              15,
              0,
              Math.PI * 2,
            );
            ctx.stroke();
            ctx.restore();
          }

          // Status effect icons above enemy sprite (render in battle mode)
          if (inBattleRef.current) {
            const enemyEffects = activeEffectsRef.current.filter(
              (e) => e.targetId === enemy.id,
            );
            if (enemyEffects.length > 0) {
              const iconY = screenPos.y - CHARACTER_Y_OFFSET - 30;
              const iconSize = 16;
              const maxIcons = 4;
              const visibleEffects = enemyEffects.slice(0, maxIcons);
              const totalW = visibleEffects.length * (iconSize + 2);
              const startIconX = screenPos.x - totalW / 2;
              ctx.save();
              visibleEffects.forEach((eff, ei) => {
                const ix = startIconX + ei * (iconSize + 2);
                const pillColor =
                  eff.type === "dot"
                    ? "rgba(234,179,8,0.85)"
                    : eff.type === "buff"
                      ? "rgba(34,197,94,0.85)"
                      : "rgba(239,68,68,0.85)";
                ctx.fillStyle = pillColor;
                ctx.beginPath();
                ctx.roundRect(ix, iconY - iconSize / 2, iconSize, iconSize, 3);
                ctx.fill();
                ctx.font = `${iconSize - 4}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(eff.iconEmoji, ix + iconSize / 2, iconY);
              });
              if (enemyEffects.length > maxIcons) {
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.font = "8px sans-serif";
                ctx.textAlign = "left";
                ctx.fillText(
                  `+${enemyEffects.length - maxIcons}`,
                  startIconX + totalW + 2,
                  iconY,
                );
              }
              ctx.restore();
            }
          }
        } else {
          // kind === 'player'
          const playerScreenPos = gridToScreen(
            playerPosition.x,
            playerPosition.y,
          );
          const playerPattern = chessPiecePatterns[pieceType][playerView];

          // Player drop shadow
          {
            const footX = playerScreenPos.x;
            const footY = playerScreenPos.y + effectiveTileH / 2 + 4;
            const sw = Math.min(effectiveTileW * 0.35, effectiveTileH * 0.3);
            const sh = sw * 0.35;
            ctx.save();
            const pShadowGrad = ctx.createRadialGradient(
              footX,
              footY,
              0,
              footX,
              footY,
              sw,
            );
            pShadowGrad.addColorStop(0, "rgba(0,0,0,0.35)");
            pShadowGrad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = pShadowGrad;
            ctx.beginPath();
            ctx.ellipse(footX, footY, sw, sh, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          drawPixelPattern(
            ctx,
            playerPattern,
            playerScreenPos.x,
            playerScreenPos.y - CHARACTER_Y_OFFSET,
            {
              primary: colors.primary,
              secondary: colors.secondary,
              accent: colors.primary,
              extra: colors.accent,
            },
          );

          // Status effect icons above player sprite
          if (inBattleRef.current) {
            const playerEffects = activeEffectsRef.current.filter(
              (e) => e.targetId === "player",
            );
            if (playerEffects.length > 0) {
              const iconY = playerScreenPos.y - CHARACTER_Y_OFFSET - 30;
              const iconSize = 16;
              const maxIcons = 4;
              const visibleEffects = playerEffects.slice(0, maxIcons);
              const totalW = visibleEffects.length * (iconSize + 2);
              const startIconX = playerScreenPos.x - totalW / 2;
              ctx.save();
              visibleEffects.forEach((eff, ei) => {
                const ix = startIconX + ei * (iconSize + 2);
                const pillColor =
                  eff.type === "dot"
                    ? "rgba(234,179,8,0.85)"
                    : eff.type === "buff"
                      ? "rgba(34,197,94,0.85)"
                      : "rgba(239,68,68,0.85)";
                ctx.fillStyle = pillColor;
                ctx.beginPath();
                ctx.roundRect(ix, iconY - iconSize / 2, iconSize, iconSize, 3);
                ctx.fill();
                ctx.font = `${iconSize - 4}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(eff.iconEmoji, ix + iconSize / 2, iconY);
              });
              if (playerEffects.length > maxIcons) {
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.font = "8px sans-serif";
                ctx.textAlign = "left";
                ctx.fillText(
                  `+${playerEffects.length - maxIcons}`,
                  startIconX + totalW + 2,
                  iconY,
                );
              }
              ctx.restore();
            }
          }
        }
      }
    }
    // ── END UNIFIED DEPTH-SORTED ENTITY PASS ────────────────────────────────

    // ── F. Dust motes — update & draw ───────────────────────────────────────
    {
      const frame = dustFrameRef.current++;
      const motes = dustMotesRef.current;
      const mapCx = w / 2;
      const mapCy = h / 2;
      const mapPxW = WORLD_GRID_SIZE * effectiveTileW;
      const mapPxH = WORLD_GRID_SIZE * effectiveTileH;
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.vx += Math.sin(frame * 0.02 + i) * 0.012;
        m.vy += Math.cos(frame * 0.015 + i * 1.3) * 0.008;
        m.vx *= 0.98;
        m.vy *= 0.98;
        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        const fadeIn = 60;
        const fadeOut = 60;
        const peak = m.maxLife - fadeOut;
        if (m.life < fadeIn) {
          m.alpha = (m.life / fadeIn) * 0.35;
        } else if (m.life < peak) {
          m.alpha = 0.3 + Math.sin(m.life * 0.05) * 0.05;
        } else if (m.life < m.maxLife) {
          m.alpha = 0.35 * (1 - (m.life - peak) / fadeOut);
        } else {
          m.x = (Math.random() - 0.5) * mapPxW;
          m.y = (Math.random() - 0.5) * mapPxH;
          m.vx = (Math.random() - 0.5) * 0.3;
          m.vy = (Math.random() - 0.5) * 0.3;
          m.size = 1.5 + Math.random() * 1.5;
          m.alpha = 0;
          m.life = 0;
          m.maxLife = 180 + Math.floor(Math.random() * 120);
        }
        if (Math.abs(m.x) > mapPxW / 2) m.vx *= -1;
        if (Math.abs(m.y) > mapPxH / 2) m.vy *= -1;
        if (m.alpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = m.alpha;
          ctx.fillStyle = "rgba(255,255,240,1)";
          ctx.beginPath();
          ctx.arc(mapCx + m.x, mapCy + m.y, m.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Draw ground Doka loot coins (static graphic at tile centre, no trail animation)
    for (const loot of dokaLootRef.current) {
      if (loot.collected) continue;
      const ls = gridToScreen(loot.tileX, loot.tileY);
      let cx2 = ls.x;
      let cy2 = ls.y;
      const t = Date.now() * 0.003;
      const bobY = Math.sin(t + loot.tileX * 0.7 + loot.tileY * 0.5) * 3;
      ctx.save();
      // Glow
      const coinGlow = ctx.createRadialGradient(
        cx2,
        cy2 + bobY,
        0,
        cx2,
        cy2 + bobY,
        14,
      );
      coinGlow.addColorStop(0, "rgba(255,210,0,0.45)");
      coinGlow.addColorStop(1, "rgba(255,180,0,0)");
      ctx.fillStyle = coinGlow;
      ctx.beginPath();
      ctx.arc(cx2, cy2 + bobY, 14, 0, Math.PI * 2);
      ctx.fill();
      // Coin body
      ctx.fillStyle = "#f1c40f";
      ctx.strokeStyle = "#b7950b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx2, cy2 + bobY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // D letter
      ctx.fillStyle = "#7d6608";
      ctx.font = "bold 8px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("D", cx2, cy2 + bobY);
      // Value badge
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.strokeStyle = "rgba(241,196,15,0.8)";
      ctx.lineWidth = 1;
      const vLabel = String(loot.value);
      const vW = vLabel.length * 5 + 6;
      ctx.beginPath();
      ctx.roundRect(cx2 - vW / 2, cy2 + bobY + 9, vW, 12, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f1c40f";
      ctx.font = "bold 8px Arial";
      ctx.fillText(vLabel, cx2, cy2 + bobY + 15);
      ctx.restore();
    }

    // "+X Doka" float texts are now drawn by effectsManager.draw()

    // Draw the player's "now" label — only if NOT drawn by the row loop above
    // (The row loop handles player drawing per-row; this vignette block follows)

    // Tile hover movement cost (player turn, walk mode, in battle)
    if (
      inBattleRef.current &&
      battleActionModeRef.current === "walk" &&
      hoveredTile
    ) {
      const hoverScreen = gridToScreen(hoveredTile.x, hoveredTile.y);
      const dist =
        Math.abs(hoveredTile.x - playerPosition.x) +
        Math.abs(hoveredTile.y - playerPosition.y);
      const mpCost =
        dist *
        mapModifierRegistry.applyMpCost(1, activeMapModifierTypes, {
          log: (msg: string) => logDebugInfo("MODIFIER", msg),
          rng: Math.random,
        });
      if (
        dist > 0 &&
        currentMap.tiles[hoveredTile.y]?.[hoveredTile.x] === "floor"
      ) {
        ctx.save();
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "rgba(0,0,0,0.85)";
        ctx.lineWidth = 2.5;
        const costLabel = `${mpCost} MP`;
        ctx.strokeText(
          costLabel,
          hoverScreen.x,
          hoverScreen.y + effectiveTileH / 2 - 4,
        );
        ctx.fillStyle =
          mpCost <= currentBattleMpRef.current ? "#4ade80" : "#f87171";
        ctx.fillText(
          costLabel,
          hoverScreen.x,
          hoverScreen.y + effectiveTileH / 2 - 4,
        );
        ctx.restore();
      }
    }

    // ── Leader death animation: particle burst + "LEADER DEFEATED!" overlay ─────────
    const nowLd = Date.now();
    // Update & draw leader death particles
    // H1: Capture current generation before filter loop so the closure
    // can abort if cleanupMap() increments the counter mid-animation.
    const _ldGen = leaderParticleGenRef.current;
    leaderDeathParticlesRef.current = leaderDeathParticlesRef.current.filter(
      (p) => {
        // H1: Abort if a map transition cleared the particles
        if (leaderParticleGenRef.current !== _ldGen) return false;
        const age = nowLd - p.born;
        if (age > 1200) return false;
        const progress2 = age / 1200;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha = Math.max(0, 1 - progress2);
        ctx.save();
        ctx.globalAlpha = p.alpha;
        // Expanding ring effect on the first 20 particles
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + progress2 * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      },
    );
    // Draw "LEADER DEFEATED!" text overlay
    if (leaderDeathTextRef.current) {
      const ldAge = nowLd - leaderDeathTextRef.current.born;
      if (ldAge < 1500) {
        const ldProgress = ldAge / 1500;
        const ldAlpha = ldProgress < 0.6 ? 1 : 1 - (ldProgress - 0.6) / 0.4;
        const ldScale = 1 + Math.sin(ldProgress * Math.PI) * 0.12;
        const ldY = leaderDeathTextRef.current.y - ldProgress * 20;
        ctx.save();
        ctx.globalAlpha = ldAlpha;
        ctx.translate(leaderDeathTextRef.current.x, ldY);
        ctx.scale(ldScale, ldScale);
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "rgba(0,0,0,0.9)";
        ctx.lineWidth = 4;
        ctx.strokeText("👑 LEADER DEFEATED!", 0, 0);
        ctx.fillStyle = "#ffd700";
        ctx.fillText("👑 LEADER DEFEATED!", 0, 0);
        ctx.restore();
      } else {
        leaderDeathTextRef.current = null;
      }
    }

    // Combo text overlay (fades over 1s)
    if (comboTextRef.current) {
      const ct = comboTextRef.current;
      const elapsed = Date.now() - ct.born;
      if (elapsed < 1000) {
        ct.alpha = Math.max(0, 1 - elapsed / 1000);
        const yOff = -(elapsed / 1000) * 24;
        ctx.save();
        ctx.globalAlpha = ct.alpha;
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "rgba(0,0,0,0.9)";
        ctx.lineWidth = 3;
        ctx.strokeText(ct.text, ct.x, ct.y + yOff);
        ctx.fillStyle = "#ffd700";
        ctx.fillText(ct.text, ct.x, ct.y + yOff);
        ctx.restore();
      } else {
        comboTextRef.current = null;
      }
    }

    // Fade overlay for portal transitions
    const fo = fadeOverlayRef.current;
    if (fo.opacity > 0) {
      ctx.save();
      ctx.globalAlpha = fo.opacity;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // Battle mode visual: pulsing crimson vignette border
    if (inBattleRef.current) {
      const vignetteTime = Date.now() * 0.002;
      const vignettePulse = 0.55 + 0.25 * Math.sin(vignetteTime);
      const gradient = ctx.createRadialGradient(
        w / 2,
        h / 2,
        h * 0.35,
        w / 2,
        h / 2,
        h * 0.85,
      );
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, `rgba(160,10,10,${vignettePulse * 0.55})`);
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }
    effectsManagerRef.current.draw(ctx, { x: 0, y: 0 });
    ctx.restore();
  }, [
    currentMap,
    hoveredTile,
    clickedTile,
    enemies,
    playerPosition,
    playerView,
    gridToScreen,
    drawIsometricTile,
    drawPixelPattern,
    drawPortalWhirlpool,
    pieceType,
    colors,
    canvasSize,
    effectiveTileW,
    effectiveTileH,
    // NOTE: inBattle, battleActionMode, selectedSpellId, activeSpells, hoveredEnemyId,
    // activeEffects and spellLevels are intentionally read via refs inside the render
    // callback to prevent the animation loop from restarting (and producing a black
    // frame) every time battle starts or a spell is selected. See inBattleRef,
    // battleActionModeRef, selectedSpellIdRef patterns above.
    getMpReachableTiles,
    getSpellRangeTiles,
    characterStats.level,
  ]);

  // Stable refs to latest render/updateEnemyMovement — avoids animation loop restart on every state change
  const renderRef = useRef(render);
  const updateEnemyMovementRef = useRef(updateEnemyMovement);
  useEffect(() => {
    renderRef.current = render;
  }, [render]);
  useEffect(() => {
    updateEnemyMovementRef.current = updateEnemyMovement;
  }, [updateEnemyMovement]);

  // Stable animation loop — never restarts on state changes; always calls through the latest refs.
  // This prevents the 1-frame black gap that occurs when React cancels + restarts the loop.
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateCameraToFollowPlayer is a stable callback ref
  const animate = useCallback(() => {
    // RC FIX: Loop runs forever for the component lifetime. When currentMap is null
    // (during portal transition), skip rendering but stay alive — the next frame will
    // pick up the new map automatically via currentMapRef.current.
    if (!currentMapRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    // RC FIX: No single-instance guard needed — only one loop ever runs.
    // The loop is started once in a mount effect with empty deps and runs forever.
    // When currentMap is null (during portal transition), we skip rendering but
    // stay alive — the next frame will pick up the new map via currentMapRef.

    // Watchdog: mark this frame alive using high-resolution timer
    lastFrameTimeRef.current = performance.now();

    isRenderingRef.current = true;
    const _animCtx = canvasRef.current?.getContext("2d");
    if (!_animCtx) {
      if (!canvasInitializedRef.current) {
        // Canvas not ready yet on first load — retry next frame silently
        animationFrameRef.current = requestAnimationFrame(animateRef.current);
      } else {
        // Genuine GPU context loss — only if canvas element exists with non-zero dimensions
        const canvasEl = canvasRef.current;
        if (canvasEl && canvasEl.width > 0 && canvasEl.height > 0) {
          canvasEl.dispatchEvent(new Event("contextlost"));
        }
      }
      return;
    }
    // RC3a FIX: Mark canvas initialized on first successful ctx acquisition
    if (!canvasInitializedRef.current) canvasInitializedRef.current = true;
    try {
      effectsManagerRef.current.tick(16);
      renderRef.current();

      // M7/O8: Camera interpolation runs directly against refs — zero re-renders.
      {
        const prev = cameraRef.current;
        const target = targetCameraRef.current;
        const deltaX = target.x - prev.x;
        const deltaY = target.y - prev.y;
        const smoothingFactor = 0.18;
        const threshold = 0.1;
        cameraRef.current = {
          x:
            Math.abs(deltaX) > threshold
              ? prev.x + deltaX * smoothingFactor
              : target.x,
          y:
            Math.abs(deltaY) > threshold
              ? prev.y + deltaY * smoothingFactor
              : target.y,
        };
      }

      // Update camera to follow player on every frame for all map types
      updateCameraToFollowPlayer();

      // Update enemy movement on each frame
      updateEnemyMovementRef.current();

      // H-3: Hard cap on dust motes enforced EVERY frame (not just on map change).
      // Rapid portal clicks could let motes pile up between cleanupMap() calls.
      if (dustMotesRef.current.length > 40) {
        dustMotesRef.current = dustMotesRef.current.slice(-40);
      }
    } catch (err) {
      // M2: Count consecutive errors. After 3 in a row, restart the loop cleanly
      // instead of silently continuing with potentially corrupt canvas state.
      renderErrorCountRef.current += 1;
      // FIX C4: Restart on the FIRST error frame, not after 3 consecutive ones.
      // Waiting for 3 errors allows visible black frames under GPU memory pressure.
      if (renderErrorCountRef.current >= 1) {
        renderErrorCountRef.current = 0;
        isRenderingRef.current = false;
        // RC FIX: Schedule next frame — loop runs forever, no generation check needed
        animationFrameRef.current = requestAnimationFrame(animate);
        return; // don't fall through to the normal reschedule
      }
      if (process.env.NODE_ENV === "development") {
        console.warn("[GameLoop] Render error caught, skipping frame:", err);
      }
    } finally {
      isRenderingRef.current = false;
    }

    // M2: Reset error counter on any successful frame
    renderErrorCountRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []); // stable — deps accessed via refs, loop never needs to restart

  // Keep animateRef in sync so checkPortalInteraction (and other early-defined
  // callbacks) can access the stable animate function via ref.
  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  // Per-tile pixel-perfect hit detection.
  // For each candidate tile, compute its diamond center in CSS pixels using the same
  // formula as gridToScreen, then apply a point-in-diamond test.
  // This completely avoids the inverse-formula drift that accumulates across the map.
  // FIX 2 — Tile corner cache for pixel-perfect mouse detection.
  // Each tile's diamond corners are pre-computed from the exact same formula as
  // gridToScreen and rebuilt whenever canvas size, zoom, or camera changes.
  // clientToGrid iterates over the cache for point-in-diamond tests — no
  // approximation formula, so accuracy never drifts with screen size changes.
  const tileCornerCacheRef = useRef<Map<string, { cx: number; cy: number }>>(
    new Map(),
  );

  const rebuildTileCornerCache = useCallback(() => {
    const mapH = WORLD_GRID_SIZE * effectiveTileH;
    const camX = isDesktop ? 0 : cameraRef.current.x;
    const camY = isDesktop ? 0 : cameraRef.current.y;
    const halfW = effectiveTileW / 2;
    const halfH = effectiveTileH / 2;
    // originX/Y in CSS space — MUST use canvasSize (same as gridToScreen)
    const originX = canvasSize.width / 2 + camX;
    const originY = (canvasSize.height - mapH) / 2 + halfH + camY;
    const cache = new Map<string, { cx: number; cy: number }>();
    for (let gy = 0; gy < WORLD_GRID_SIZE; gy++) {
      for (let gx = 0; gx < WORLD_GRID_SIZE; gx++) {
        // gridToScreen top-vertex + halfH = tile visual center
        const topX = (gx - gy) * halfW + originX;
        const topY = (gx + gy) * halfH + originY;
        cache.set(`${gx},${gy}`, { cx: topX, cy: topY + halfH });
      }
    }
    tileCornerCacheRef.current = cache;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasSize, effectiveTileW, effectiveTileH, isDesktop]);

  // Rebuild cache whenever the dependencies change
  useEffect(() => {
    rebuildTileCornerCache();
  }, [rebuildTileCornerCache]);

  // Also rebuild on window resize
  useEffect(() => {
    const onResize = () => rebuildTileCornerCache();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [rebuildTileCornerCache]);

  const clientToGrid = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      // Convert client coords to CSS-space canvas coordinates.
      // canvas.style.width/height = CSS size, rect.width/height = same if no transform.
      // Use canvasSize (the authoritative CSS size) to match gridToScreen & the cache.
      const cssW = canvasSize.width;
      const cssH = canvasSize.height;
      // Scale from screen->canvas CSS space (accounts for any browser zoom/scaling)
      const px = (clientX - rect.left) * (cssW / rect.width);
      const py = (clientY - rect.top) * (cssH / rect.height);

      const halfW = effectiveTileW / 2;
      const halfH = effectiveTileH / 2;
      const cache = tileCornerCacheRef.current;

      // Fast path: approximate grid position using inverse isometric formula,
      // then test a 5×5 neighborhood with the exact cached diamond centers.
      const mapH = WORLD_GRID_SIZE * effectiveTileH;
      const camX = isDesktop ? 0 : cameraRef.current.x;
      const camY = isDesktop ? 0 : cameraRef.current.y;
      const originY = (cssH - mapH) / 2 + halfH + camY;
      const originX = canvasSize.width / 2 + camX;
      const dx0 = px - originX;
      const dy0 = py - halfH - originY;
      // H6: Clamp the approximate grid position so the 5×5 neighborhood
      // search never wanders outside the valid grid range on map-edge clicks.
      const approxX = Math.max(
        0,
        Math.min(
          WORLD_GRID_SIZE - 1,
          Math.round((dx0 / halfW + dy0 / halfH) / 2),
        ),
      );
      const approxY = Math.max(
        0,
        Math.min(
          WORLD_GRID_SIZE - 1,
          Math.round((dy0 / halfH - dx0 / halfW) / 2),
        ),
      );

      // Search 5×5 neighborhood using pre-computed centers from cache
      for (let gy = approxY - 2; gy <= approxY + 2; gy++) {
        for (let gx = approxX - 2; gx <= approxX + 2; gx++) {
          if (
            gx < 0 ||
            gx >= WORLD_GRID_SIZE ||
            gy < 0 ||
            gy >= WORLD_GRID_SIZE
          )
            continue;
          const entry = cache.get(`${gx},${gy}`);
          if (!entry) continue;
          // Point-in-diamond test against cached center
          const ndx = Math.abs(px - entry.cx) / halfW;
          const ndy = Math.abs(py - entry.cy) / halfH;
          if (ndx + ndy <= 1.0) {
            return { x: gx, y: gy };
          }
        }
      }
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvasSize, effectiveTileW, effectiveTileH, isDesktop],
  );

  // Handle canvas click — DPR-aware coordinates
  const castRuntimeRef = useRef<{
    apCost: number;
    targetsToHit: any[];
    spell: any;
  }>({ apCost: 0, targetsToHit: [], spell: null });
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable refs and exhaustive dep list is intentionally curated
  const playerSpellContext = useCallback(() => {
    return createPlayerSpellContext({
      // --- scalars (PlayerSpellContextDeps) ---
      characterName,
      characterStats,
      playerPosition,
      spellFailChance,
      spellLevels,
      chc: characterStats.chc,
      isFuryActive: furyRef.current.turnsLeft > 0,
      isBloodMoon,
      isMirrorField,
      isPaperWindstorm,
      enemies,
      // --- base SpellContextDeps callbacks ---
      rng: Math.random,
      log: (msg: string, color?: string, isSummon?: boolean) => {
        if (msg !== "") logBattleEntry(msg, color, isSummon);
      },
      getEffectiveStat: (combatantId: string, stat: string) =>
        getStatModifier(combatantId, stat, activeEffectsRef.current),
      dealDamage: (
        targetId: string,
        amount: number,
        _opts?: { isPhysical?: boolean },
      ) => {
        enemyTakesDamage(
          targetId,
          amount,
          "player",
          castRuntimeRef.current.spell?.name ?? "",
          false,
        );
        return amount;
      },
      heal: (combatantId: string, amount: number) => {
        if (combatantId === "player" || combatantId === "__player__") {
          setCharacterStats((prev: any) => ({
            ...prev,
            hp: Math.min(maxHp, prev.hp + amount),
          }));
          effectsManagerRef.current.spawnDamageNumber(0, 0, amount, "heal");
        }
      },
      applyEffect: (effect: ActiveEffectLike) => {
        applyActiveEffect(effect as unknown as ActiveEffect);
      },
      placeBarrier: (cell: { x: number; y: number }, turns: number) => {
        barrierTilesRef.current.set(`${cell.x},${cell.y}`, turns);
      },
      spawnUnit: (
        cell: { x: number; y: number },
        unitDef: SummonUnitDef,
        _side: Side,
        lifespan: number,
        spell: any,
      ) => {
        // [SUMMON] loud defensive guard: the new contract passes the cast spell
        // explicitly. If it is truly absent, surface a traceable error instead
        // of silently skipping the spawn (the old castRuntimeRef.current.spell
        // read + if(spell) guard is gone — no silent no-op).
        if (!spell) {
          logDebugError("SUMMON", "spawnUnit invoked without a spell", {
            cell,
            pieceType: unitDef?.pieceType,
          });
          return;
        }
        const { summon, turnOrderEntry } = spawnSummonUnit(
          cell,
          { ...spell, summonUnitDef: unitDef, summonLifespan: lifespan },
          "player",
          characterStats.level,
          logBattleEntry,
          computeEnemyStats as (
            level: number,
            pieceType: string,
            seedKey: string,
          ) => any,
          spellLevelsRef.current[spell.id] ?? 0,
          // OccupancyContext so spawnSummonUnit can fall back to the nearest
          // free cell when the requested cell is occupied/impassable.
          {
            tiles: (currentMap?.tiles ?? []).map((row: any) =>
              (row ?? []).map((t: any) => t !== "wall"),
            ),
            barriers: new Set(barrierTilesRef.current.keys()),
            voidTiles: currentMap?.voidTiles ?? new Set<string>(),
            portals: new Set(
              (currentMap?.portals ?? []).map((p: any) => `${p.x},${p.y}`),
            ),
            isOccupied: (c: { x: number; y: number }) =>
              getLiveCombatants(combatantStoreCtx).some(
                (e: any) => e.x === c.x && e.y === c.y,
              ) ||
              (playerPosition.x === c.x && playerPosition.y === c.y),
          } satisfies OccupancyContext,
        );
        // Apply the summon through the real state paths: enemies +
        // battleEnemies (keeps battleEnemiesRef in sync) and turnOrder with
        // summoner-adjacent placement (immediately after the player's entry).
        const { turnOrder } = applySummonResult(
          summon,
          turnOrderEntry,
          "player",
          enemies,
          turnOrderRef.current,
        );
        turnOrderRef.current = turnOrder;
        const _newEnemies = [
          ...combatantsRef.current,
          summon as unknown as Enemy,
        ];
        syncCombatants(combatantStoreCtx, _newEnemies);
        setTurnOrder(turnOrder);
        logDebugInfo(
          "SUMMON",
          "[SUMMON-LIFE] spawn commit (prev-spread path)",
          {
            site: "WX~7935",
            summonId: (summon as any)?.id,
            turnsRemaining: (summon as any)?.turnsRemaining,
            hp: (summon as any)?.hp,
            isSummon: (summon as any)?.isSummon,
            note: "setEnemies((prev) => [...prev, summon]) — committed entity is the spawn object itself",
          },
        );
        // Spawn pixel-puff + cast sound. Drawn through the SAME canvas
        // context the renderer uses for every other combatant — no
        // separate rendering system. gridToScreen gives the tile's top
        // vertex; the puff is centered on the tile visual center
        // (half a tile-height below the top vertex), matching how
        // characters are positioned.
        const screenPos = gridToScreen(cell.x, cell.y);
        const puffCtx = canvasRef.current?.getContext("2d");
        if (puffCtx) {
          spawnPixelPuff(
            puffCtx,
            screenPos.x,
            screenPos.y + effectiveTileH / 2,
            effectiveTileW * 0.18,
          );
        }
        playSound("spell_cast" as any);
      },
      isCellFree: (cell: { x: number; y: number }) =>
        !getLiveCombatants(combatantStoreCtx).some(
          (e: any) => e.x === cell.x && e.y === cell.y,
        ) && !(playerPosition.x === cell.x && playerPosition.y === cell.y),
      getCombatantAt: (cell: { x: number; y: number }) => {
        const e = getLiveCombatants(combatantStoreCtx).find(
          (en: any) => en.x === cell.x && en.y === cell.y,
        );
        if (e) return { id: e.id, side: "enemy" as Side };
        if (playerPosition.x === cell.x && playerPosition.y === cell.y)
          return { id: "__player__", side: "player" as Side };
        return null;
      },
      // --- player-specific callbacks ---
      onHit: () => {
        battleHitsRef.current += 1;
      },
      onCritHit: () => {
        battleCritHitsRef.current += 1;
      },
      triggerVfx: () => {
        /* no-op */
      },
      playSound: (name: string, ctx?: string) => {
        playSound(name as any, ctx);
      },
      consumeTimestep: () => {
        if (timestepUsedRef.current) return true;
        timestepUsedRef.current = true;
        return false;
      },
      restoreApMp: () => {
        // Per-turn restore now reads from the canonical progression formula
        // (getPlayerBaseStats) + active-effect modifiers. The stat key is
        // 'ap'/'mp' (NOT 'maxAp'/'maxMp') because getStatModifier only treats
        // 'ap'/'mp' as additive — the legacy 'maxAp'/'maxMp' keys hit the
        // multiplier branch and returned 1 (no-op), capping restore at 1.
        const _baseStats = getPlayerBaseStats(
          characterStats.level,
          levelUpConfig,
        );
        const maxApRestore =
          _baseStats.ap +
          getStatModifier("player", "ap", activeEffectsRef.current);
        const maxMpRestore =
          _baseStats.mp +
          getStatModifier("player", "mp", activeEffectsRef.current);
        setCurrentBattleAp(maxApRestore - castRuntimeRef.current.apCost);
        setCurrentBattleMp(maxMpRestore);
      },
      loseSelfHp: (amount: number) => {
        setCharacterStats((prev: any) => ({
          ...prev,
          hp: Math.max(1, prev.hp - amount),
        }));
        return amount;
      },
      swapPositions: (targetEnemyId: string) => {
        const target = getLiveCombatants(combatantStoreCtx).find(
          (e: any) => e.id === targetEnemyId,
        );
        if (!target) return;
        const oldPlayerPos = { ...playerPosition };
        setPlayerPosition({ x: target.x, y: target.y });
        // Route the enemy position swap through the combatant store so the
        // ref mirrors stay atomically in sync (replaces a setEnemies map).
        updateCombatant(combatantStoreCtx, targetEnemyId, {
          x: oldPlayerPos.x,
          y: oldPlayerPos.y,
        });
      },
      placeMark: (cell: { x: number; y: number }) => {
        markedTilesRef.current.add(`${cell.x},${cell.y}`);
        lastSpellCastRef.current = castRuntimeRef.current.spell;
      },
      getAoETargets: (
        spell: any,
        gridPos: { x: number; y: number },
        targetEnemy: PlayerCastEnemy | undefined,
      ) => {
        const targets = getAoETargetsHelper({
          getEffectiveSpellRange,
          spell,
          gridPos,
          targetEnemy,
          enemies,
          playerPosition,
          characterName,
          characterStats,
          logBattleEntry,
        });
        castRuntimeRef.current.targetsToHit = targets;
        return targets as PlayerCastTarget[];
      },
      calculatePlayerDamage: (
        baseDamage: number,
        spellId: string,
        targetEnemy: PlayerCastEnemy,
        gridPos: { x: number; y: number },
        isPhysical: boolean,
        isCrit: boolean,
      ) => {
        return calculatePlayerDamage(
          baseDamage,
          spellId,
          targetEnemy as unknown as Enemy,
          gridPos,
          isPhysical,
          isCrit,
          activeEffectsRef.current,
        );
      },
      applyDamageToEnemy: (
        target: PlayerCastEnemy,
        _finalDmg: number,
        spell: any,
        gridPos: { x: number; y: number },
        isCrit: boolean,
        rawDmg: number,
        preCritDmg: number,
        preCritDmgBM: number,
        isFirstTarget: boolean,
      ) => {
        const isPhysical = spell?.isPhysical ?? false;
        const isDrainSpell = spell?.effectType === "drain";
        applyDamageToEnemyHelper({
          hitTarget: target as any,
          isFirstTarget,
          deps: {
            spell,
            gridPos,
            isPhysical,
            isCrit,
            rawDmg,
            preCritDmg,
            preCritDmgBM,
            isDrainSpell,
            maxHp,
            characterStats: { hp: characterStats.hp },
            targetsToHit: castRuntimeRef.current.targetsToHit as any[],
            activeEffectsRef,
            turnOrderRef,
            currentTurnIndexRef,
            bossStateRef,
            enemyHpMap,
            leaderEnemyIdRef,
            battleHitsRef,
            battleCritHitsRef,
            battleLeaderSlainRef,
            leaderDiedRef,
            leaderBoostPercent,
            calculatePlayerDamage,
            logBattleEntry,
            calcEnemyMaxHp,
            setEnemyHpMap,
            setTurnOrder,
            enemies,
            enemyTakesDamage,
            playSound,
            setEnemies,
            triggerLeaderDeathAnimation,
            setLeaderBoostMultiplier,
            setCharacterStats,
          },
        });
      },
      applyDamageToPlayer: (finalDmg: number) => {
        setCharacterStats((prev: any) => ({
          ...prev,
          hp: Math.max(0, prev.hp - finalDmg),
        }));
      },
      mirrorRedirect: (
        targetEnemy: PlayerCastEnemy,
        _spell: any,
        _gridPos: { x: number; y: number },
      ) => {
        // Inline Mirror-redirect: if target has mirror active, redirect to player.
        // Real inline path checks mirrorUnitsRef for the target's tile.
        const key = `${targetEnemy.x},${targetEnemy.y}`;
        if (mirrorUnitsRef.current.has(key)) {
          mirrorUnitsRef.current.delete(key);
          return true;
        }
        return false;
      },
      mirrorFieldReflect: (
        _spell: any,
        _gridPos: { x: number; y: number },
        preCritDmgBM: number,
      ) => {
        // Inline Mirror Field 20% reflect: 20% chance to reflect back at player.
        if (Math.random() * 100 < 20) {
          setCharacterStats((prev: any) => ({
            ...prev,
            hp: Math.max(0, prev.hp - preCritDmgBM),
          }));
          logBattleEntry(
            `Mirror Field reflects ${preCritDmgBM} damage back at you!`,
            "#c084fc",
          );
          return true;
        }
        return false;
      },
      paperWindstormMiss: (_spell: any, _gridPos: { x: number; y: number }) => {
        // Inline Paper Windstorm miss: 30% chance to miss.
        if (Math.random() * 100 < 30) {
          logBattleEntry(
            "Paper Windstorm blows your spell off course!",
            "#94a3b8",
          );
          return true;
        }
        return false;
      },
      activateMirror: () => {
        mirrorUnitsRef.current.add(`${playerPosition.x},${playerPosition.y}`);
      },
      placeBarrierTile: (cell: { x: number; y: number }, turns: number) => {
        barrierTilesRef.current.set(`${cell.x},${cell.y}`, turns);
      },
      spawnPlayerSummon: (gridPos: { x: number; y: number }, spell: any) => {
        const { summon, turnOrderEntry } = spawnSummonUnit(
          gridPos,
          spell,
          "player",
          characterStats.level,
          logBattleEntry,
          computeEnemyStats as (
            level: number,
            pieceType: string,
            seedKey: string,
          ) => any,
          spellLevels[spell.id] ?? 0,
          // OccupancyContext so spawnSummonUnit can fall back to the nearest
          // free cell when the requested cell is occupied/impassable.
          {
            tiles: (currentMap?.tiles ?? []).map((row: any) =>
              (row ?? []).map((t: any) => t !== "wall"),
            ),
            barriers: new Set(barrierTilesRef.current.keys()),
            voidTiles: currentMap?.voidTiles ?? new Set<string>(),
            portals: new Set(
              (currentMap?.portals ?? []).map((p: any) => `${p.x},${p.y}`),
            ),
            isOccupied: (c: { x: number; y: number }) =>
              getLiveCombatants(combatantStoreCtx).some(
                (e: any) => e.x === c.x && e.y === c.y,
              ) ||
              (playerPosition.x === c.x && playerPosition.y === c.y),
          } satisfies OccupancyContext,
        );
        const { enemies: newEnemies, turnOrder: newTurnOrder } =
          applySummonResult(
            summon,
            turnOrderEntry,
            "player",
            enemies,
            turnOrderRef.current,
          );
        syncCombatants(combatantStoreCtx, newEnemies);
        setTurnOrder(newTurnOrder);
        turnOrderRef.current = newTurnOrder;
        {
          const committed = newEnemies.find(
            (en: any) => en.id === (summon as any)?.id,
          );
          logDebugInfo(
            "SUMMON",
            "[SUMMON-LIFE] spawn commit (newEnemies path)",
            {
              site: "WX~8206",
              summonId: (summon as any)?.id,
              turnsRemaining: (summon as any)?.turnsRemaining,
              hp: (summon as any)?.hp,
              isSummon: (summon as any)?.isSummon,
              committedInNewEnemies: committed
                ? {
                    id: committed.id,
                    turnsRemaining: committed.turnsRemaining,
                    hp: committed.hp,
                    isSummon: !!committed.isSummon,
                  }
                : null,
              newEnemiesSummonCount: newEnemies.filter((e: any) => e.isSummon)
                .length,
            },
          );
        }
      },
      getEffectiveSpellRange: (baseRange: number, spellId?: string) =>
        getEffectiveSpellRange(baseRange, spellId),
      recordSpellType: recordPlayerSpellType,
    });
  }, [
    enemies,
    characterName,
    characterStats,
    playerPosition,
    maxHp,
    spellFailChance,
    spellLevels,
    isBloodMoon,
    isMirrorField,
    isPaperWindstorm,
    enemyHpMap,
    leaderBoostPercent,
    getStatModifier,
    calculatePlayerDamage,
    enemyTakesDamage,
    calcEnemyMaxHp,
    getEffectiveSpellRange,
    logBattleEntry,
    applyActiveEffect,
    setEnemyHpMap,
    setTurnOrder,
    setEnemies,
    setCharacterStats,
    setPlayerPosition,
    setLeaderBoostMultiplier,
    setCurrentBattleAp,
    setCurrentBattleMp,
    playSound,
    spawnSummonUnit,
    computeEnemyStats,
  ]);
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!currentMap || transitionInProgressRef.current) return;
      const gridPos = clientToGrid(event.clientX, event.clientY);
      if (!gridPos) return;
      if (
        gridPos.x < 0 ||
        gridPos.x >= WORLD_GRID_SIZE ||
        gridPos.y < 0 ||
        gridPos.y >= WORLD_GRID_SIZE
      )
        return;
      // --- BATTLE MODE ---
      if (inBattle) {
        // Part 4(a): [CLICK] entry instrumentation (throttled once/sec).
        {
          const _entry = turnOrderRef.current[currentTurnIndexRef.current];
          const _allowed = _entry?.type === "player";
          logClickGuard("battle.entry", {
            phase: battlePhase,
            currentEntry: _entry?.type,
            currentId: _entry?.id,
            allowed: _allowed,
          });
        }
        // Part 3: Desync-proof click guard. PRIMARY gate is the turn-truth
        // (turnOrderRef/currentTurnIndexRef), so a stale battlePhase flag can
        // never lock the player out of their own turn. battlePhase remains a
        // secondary condition. Refs are stable — NOT added to dep arrays.
        {
          const _entry = turnOrderRef.current[currentTurnIndexRef.current];
          if (_entry?.type !== "player") {
            logClickGuard("blocked.notPlayerTurn", {
              phase: battlePhase,
              currentEntry: _entry?.type,
              currentId: _entry?.id,
            });
            return;
          }
        }
        if (battleActionMode === "walk") {
          // Walk mode: move using MP if tile is reachable
          if (currentBattleMp <= 0) return;
          if (
            currentMap.tiles[gridPos.y][gridPos.x] === "wall" ||
            currentMap.voidTiles?.has(`${gridPos.x},${gridPos.y}`)
          )
            return;
          const reachable = getMpReachableTiles();
          if (!reachable.has(`${gridPos.x},${gridPos.y}`)) return;
          // Calculate path cost (Manhattan steps)
          const path = findPath(playerPosition, gridPos);
          if (path.length === 0) return;
          // Slime Flood / Frozen Terrain: double movement cost per tile
          const moveCost =
            path.length *
            mapModifierRegistry.applyMpCost(1, activeMapModifierTypes, {
              log: (msg: string) => logDebugInfo("MODIFIER", msg),
              rng: Math.random,
            });
          const cost = moveCost;
          if (cost > currentBattleMp) return;
          // Thorned Ground: damage for moving more than 2 tiles
          if (isThornedGround && path.length > 2) {
            const extraTiles = path.length - 2;
            const thornDmg = extraTiles * 5;
            setCharacterStats((prev) => ({
              ...prev,
              hp: Math.max(0, prev.hp - thornDmg),
            }));
            logBattleEntry(
              `Thorned Ground deals ${thornDmg} damage (${extraTiles} extra tiles)!`,
              "#ef4444",
            );
          }
          // Void Rift: if stepping on void tile, teleport and take 3 damage
          if (
            isVoidRift &&
            voidRiftTile &&
            gridPos.x === voidRiftTile.x &&
            gridPos.y === voidRiftTile.y
          ) {
            // Find a free walkable tile at least 2 away
            const voidFreeCell = (() => {
              if (!currentMap) return null;
              for (let gy = 0; gy < WORLD_GRID_SIZE; gy++) {
                for (let gx = 0; gx < WORLD_GRID_SIZE; gx++) {
                  if (currentMap.tiles[gy][gx] !== "floor") continue;
                  if (
                    Math.max(
                      Math.abs(gx - voidRiftTile.x),
                      Math.abs(gy - voidRiftTile.y),
                    ) >= 2
                  ) {
                    return { x: gx, y: gy };
                  }
                }
              }
              return null;
            })();
            if (voidFreeCell) {
              setPlayerPosition(voidFreeCell);
              setCharacterStats((prev) => ({
                ...prev,
                hp: Math.max(0, prev.hp - 3),
              }));
              logBattleEntry("Void Rift teleports you! -3 HP", "#a855f7");
              setCurrentBattleMp((prev) => Math.max(0, prev - cost));
              markFirstAction();
              return;
            }
          }
          // Deduct MP and move
          setCurrentBattleMp((prev) => Math.max(0, prev - cost));
          markFirstAction();
          setClickedTile({ x: gridPos.x, y: gridPos.y, timestamp: Date.now() });
          setMovementPath(path);
          setCurrentStepIndex(0);
          setIsMoving(true);
          movementStartTimeRef.current = Date.now();
          // Auto-disable walk mode when MP exhausted
          if (currentBattleMp - cost <= 0) {
            setBattleActionMode("attack");
          }
        } else {
          // Attack mode: cast selected spell on clicked tile if in range.
          // Precedence: spell SELECTED (selectedSpellIdRef.current non-null) AND
          // tile is a legal target (spellTiles.has(tile)) → CAST, always.
          // No spell selected → silent return (inspect opens only via the
          // BattleUIPanel initiative chip button, NOT via canvas click).
          if (!selectedSpellIdRef.current) {
            logClickGuard("blocked.noSpellSelected", {
              phase: battlePhase,
              mode: battleActionMode,
            });
            return;
          }
          if (currentBattleAp <= 0) {
            logClickGuard("blocked.noAp", {
              phase: battlePhase,
              ap: currentBattleAp,
            });
            selectedSpellIdRef.current = null;
            setSpellSelectionVersion((v) => v + 1);
            spellRangeCacheRef.current.clear();
            setBattleActionMode("walk");
            return;
          }
          // FIX 1.2: capture cache-hit state BEFORE getSpellRangeTiles may
          // populate the cache, so the rejection log reports whether the cache
          // already held an entry for this key.
          const _preClickCacheKey = `${selectedSpellIdRef.current}_${playerPosition.x}_${playerPosition.y}_${battleWorldVersionRef.current}`;
          const _preClickCacheHit =
            spellRangeCacheRef.current.has(_preClickCacheKey);
          const spellTiles = getSpellRangeTiles();
          if (!spellTiles.has(`${gridPos.x},${gridPos.y}`)) {
            logClickGuard("blocked.tileOutOfRange", {
              phase: battlePhase,
              tile: gridPos,
              clickedTile: `${gridPos.x},${gridPos.y}`,
              setSize: spellTiles.size,
              cacheHit: _preClickCacheHit,
              spellId: selectedSpellIdRef.current,
            });
            return;
          }
          const spell = activeSpells.find(
            (s) => s.id === selectedSpellIdRef.current,
          );
          if (!spell) {
            logClickGuard("blocked.spellNotFound", {
              phase: battlePhase,
              spellId: selectedSpellIdRef.current,
            });
            return;
          }
          // [CLICK] cast-branch debug — dev-only, never ships to players.
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log("[CLICK] cast branch", {
              spellId: spell.id,
              spellName: spell.name,
              tile: gridPos,
              apCost: Number(spell.apCost),
              currentBattleAp,
            });
          }
          // Arcane Surge: spells cost 1 less AP (minimum 1)
          const apCost = mapModifierRegistry.applyApCost(
            Number(spell.apCost),
            activeMapModifierTypes,
            {
              log: (msg: string) => logDebugInfo("MODIFIER", msg),
              rng: Math.random,
            },
          );
          if (currentBattleAp < apCost) return;
          castRuntimeRef.current.apCost = apCost;
          castRuntimeRef.current.spell = spell;
          if (spell.isSummon) {
            logDebugInfo("SUMMON", "cast handler received summon spell", {
              spellId: spell.id,
              gridPos,
            });
          }
          const castResult = resolvePlayerCast(
            spell,
            gridPos,
            playerSpellContext(),
          );
          if (castResult === "cast") {
            setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
            markFirstAction();
            challengeMaxApThisTurnRef.current += apCost;
            if (
              Math.max(
                Math.abs(gridPos.x - playerPosition.x),
                Math.abs(gridPos.y - playerPosition.y),
              ) > 2
            )
              challengeDirectHitRef.current = false;
            if (spell.targetType === "self" && spell.effectType === "heal") {
              challengeHealUsedRef.current = true;
            }
            if (spell.cooldown && spell.cooldown > 0) {
              spellCooldownsRef.current.set(spell.id, spell.cooldown as number);
              setSpellCooldownVersion((v) => v + 1);
            }
            if (currentBattleAp - apCost <= 0) {
              selectedSpellIdRef.current = null;
              setSpellSelectionVersion((v) => v + 1);
              spellRangeCacheRef.current.clear();
              setBattleActionMode("walk");
            }
          } else if (castResult === "fizzled") {
            setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
            markFirstAction();
            if (
              Math.max(
                Math.abs(gridPos.x - playerPosition.x),
                Math.abs(gridPos.y - playerPosition.y),
              ) > 2
            )
              challengeDirectHitRef.current = false;
            if (currentBattleAp - apCost <= 0) {
              selectedSpellIdRef.current = null;
              setSpellSelectionVersion((v) => v + 1);
              spellRangeCacheRef.current.clear();
              setBattleActionMode("walk");
            }
          } else if (castResult === "summon") {
            // FIX #3 (summon AP cost): deduct apCost + markFirstAction + set
            // cooldown, mirroring the "cast" branch. challengeDirectHitRef is
            // owned by another task — do NOT touch it here.
            setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
            markFirstAction();
            challengeMaxApThisTurnRef.current += apCost;
            if (spell.cooldown && spell.cooldown > 0) {
              spellCooldownsRef.current.set(spell.id, spell.cooldown as number);
              setSpellCooldownVersion((v) => v + 1);
            }
            if (currentBattleAp - apCost <= 0) {
              selectedSpellIdRef.current = null;
              setSpellSelectionVersion((v) => v + 1);
              spellRangeCacheRef.current.clear();
              setBattleActionMode("walk");
            }
          }
          // "no_ap" | "abort" → no further action
        }
        return;
      }
      // --- WORLD MODE ---
      if (
        currentMap.tiles[gridPos.y][gridPos.x] !== "wall" &&
        !currentMap.voidTiles?.has(`${gridPos.x},${gridPos.y}`)
      ) {
        setClickedTile({ x: gridPos.x, y: gridPos.y, timestamp: Date.now() });
        const path = findPath(playerPosition, gridPos);
        if (path.length > 0) {
          setMovementPath(path);
          setCurrentStepIndex(0);
          setIsMoving(true);
          movementStartTimeRef.current = Date.now();
        } else {
          const dx = Math.abs(gridPos.x - playerPosition.x);
          const dy = Math.abs(gridPos.y - playerPosition.y);
          if (dx <= 1 && dy <= 1 && dx + dy > 0) {
            setMovementPath([gridPos]);
            setCurrentStepIndex(0);
            setIsMoving(true);
            movementStartTimeRef.current = Date.now();
          }
        }
      }
    },
    [
      currentMap,
      clientToGrid,
      findPath,
      playerPosition,
      inBattle,
      battlePhase,
      battleActionMode,
      currentBattleMp,
      currentBattleAp,
      getMpReachableTiles,
      getSpellRangeTiles,
      activeSpells,
      playerSpellContext,
      logBattleEntry,
      activeMapModifierTypes,
      isThornedGround,
      isVoidRift,
      voidRiftTile,
    ],
  );
  // Handle canvas mouse move
  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const gridPos = clientToGrid(event.clientX, event.clientY);
      if (!gridPos) {
        setHoveredTile(null);
        setHoveredEnemyId(null);
        return;
      }
      if (
        gridPos.x >= 0 &&
        gridPos.x < WORLD_GRID_SIZE &&
        gridPos.y >= 0 &&
        gridPos.y < WORLD_GRID_SIZE
      ) {
        setHoveredTile(gridPos);
        if (
          inBattle &&
          battleActionMode === "attack" &&
          selectedSpellIdRef.current
        ) {
          const hovEnemy = getLiveCombatants(combatantStoreCtx).find(
            (e) => e.x === gridPos.x && e.y === gridPos.y,
          );
          setHoveredEnemyId(hovEnemy?.id ?? null);
        } else {
          setHoveredEnemyId(null);
        }
      } else {
        setHoveredTile(null);
        setHoveredEnemyId(null);
      }
    },
    [clientToGrid, inBattle, battleActionMode, combatantStoreCtx],
  );
  // Touch handler — delegates to same grid logic as mouse click
  // Touch handler — delegates to same grid logic as mouse click
  const handleCanvasTouch = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>) => {
      if (!currentMap || transitionInProgressRef.current) return;
      // Prevent default scroll/zoom on canvas touch
      event.preventDefault();
      const touch = event.changedTouches[0];
      if (!touch) return;
      const gridPos = clientToGrid(touch.clientX, touch.clientY);
      if (!gridPos) return;
      if (
        gridPos.x < 0 ||
        gridPos.x >= WORLD_GRID_SIZE ||
        gridPos.y < 0 ||
        gridPos.y >= WORLD_GRID_SIZE
      )
        return;
      // Reuse same logic as mouse click
      if (inBattle) {
        // Part 4(a): [CLICK] entry instrumentation (throttled once/sec).
        {
          const _entry = turnOrderRef.current[currentTurnIndexRef.current];
          const _allowed = _entry?.type === "player";
          logClickGuard("battle.entry.touch", {
            phase: battlePhase,
            currentEntry: _entry?.type,
            currentId: _entry?.id,
            allowed: _allowed,
          });
        }
        // Part 3: Desync-proof touch guard (mirrors the click handler).
        {
          const _entry = turnOrderRef.current[currentTurnIndexRef.current];
          if (_entry?.type !== "player") {
            logClickGuard("blocked.notPlayerTurn.touch", {
              phase: battlePhase,
              currentEntry: _entry?.type,
              currentId: _entry?.id,
            });
            return;
          }
        }
        if (battleActionMode === "walk") {
          if (currentBattleMp <= 0) return;
          if (
            currentMap.tiles[gridPos.y][gridPos.x] === "wall" ||
            currentMap.voidTiles?.has(`${gridPos.x},${gridPos.y}`)
          )
            return;
          const reachable = getMpReachableTiles();
          if (!reachable.has(`${gridPos.x},${gridPos.y}`)) return;
          const path = findPath(playerPosition, gridPos);
          if (path.length === 0) return;
          const cost = path.length;
          if (cost > currentBattleMp) return;
          setCurrentBattleMp((prev) => Math.max(0, prev - cost));
          markFirstAction();
          setClickedTile({ x: gridPos.x, y: gridPos.y, timestamp: Date.now() });
          setMovementPath(path);
          setCurrentStepIndex(0);
          setIsMoving(true);
          movementStartTimeRef.current = Date.now();
          if (currentBattleMp - cost <= 0) setBattleActionMode("attack");
        } else {
          // Attack mode: cast selected spell on touched tile if in range
          if (!selectedSpellIdRef.current) {
            logClickGuard("blocked.noSpellSelected.touch", {
              phase: battlePhase,
              mode: battleActionMode,
            });
            return;
          }
          if (currentBattleAp <= 0) {
            logClickGuard("blocked.noAp.touch", {
              phase: battlePhase,
              ap: currentBattleAp,
            });
            selectedSpellIdRef.current = null;
            setSpellSelectionVersion((v) => v + 1);
            spellRangeCacheRef.current.clear();
            setBattleActionMode("walk");
            return;
          }
          // FIX 1.2: capture cache-hit state BEFORE getSpellRangeTiles may
          // populate the cache, so the touch rejection log reports whether the
          // cache already held an entry for this key.
          const _preClickCacheKey = `${selectedSpellIdRef.current}_${playerPosition.x}_${playerPosition.y}_${battleWorldVersionRef.current}`;
          const _preClickCacheHit =
            spellRangeCacheRef.current.has(_preClickCacheKey);
          const spellTiles = getSpellRangeTiles();
          if (!spellTiles.has(`${gridPos.x},${gridPos.y}`)) {
            logClickGuard("blocked.tileOutOfRange.touch", {
              phase: battlePhase,
              tile: gridPos,
              clickedTile: `${gridPos.x},${gridPos.y}`,
              setSize: spellTiles.size,
              cacheHit: _preClickCacheHit,
              spellId: selectedSpellIdRef.current,
            });
            return;
          }
          const spell = activeSpells.find(
            (s) => s.id === selectedSpellIdRef.current,
          );
          if (!spell) {
            logClickGuard("blocked.spellNotFound.touch", {
              phase: battlePhase,
              spellId: selectedSpellIdRef.current,
            });
            return;
          }
          // [CLICK] cast-branch debug — dev-only, never ships to players.
          // Mirrors the mouse handler so touch devices get the same trace.
          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log("[CLICK] cast branch (touch)", {
              spellId: spell.id,
              spellName: spell.name,
              tile: gridPos,
              apCost: Number(spell.apCost),
              currentBattleAp,
            });
          }
          // Arcane Surge: spells cost 1 less AP (minimum 1)
          const apCost = mapModifierRegistry.applyApCost(
            Number(spell.apCost),
            activeMapModifierTypes,
            {
              log: (msg: string) => logDebugInfo("MODIFIER", msg),
              rng: Math.random,
            },
          );
          if (currentBattleAp < apCost) return;
          castRuntimeRef.current.apCost = apCost;
          castRuntimeRef.current.spell = spell;
          if (spell.isSummon) {
            logDebugInfo("SUMMON", "cast handler received summon spell", {
              spellId: spell.id,
              gridPos,
            });
          }
          const castResult = resolvePlayerCast(
            spell,
            gridPos,
            playerSpellContext(),
          );
          if (castResult === "cast") {
            setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
            markFirstAction();
            challengeMaxApThisTurnRef.current += apCost;
            if (
              Math.max(
                Math.abs(gridPos.x - playerPosition.x),
                Math.abs(gridPos.y - playerPosition.y),
              ) > 2
            )
              challengeDirectHitRef.current = false;
            if (spell.targetType === "self" && spell.effectType === "heal") {
              challengeHealUsedRef.current = true;
            }
            if (spell.cooldown && spell.cooldown > 0) {
              spellCooldownsRef.current.set(spell.id, spell.cooldown as number);
              setSpellCooldownVersion((v) => v + 1);
            }
            if (currentBattleAp - apCost <= 0) {
              selectedSpellIdRef.current = null;
              setSpellSelectionVersion((v) => v + 1);
              spellRangeCacheRef.current.clear();
              setBattleActionMode("walk");
            }
          } else if (castResult === "fizzled") {
            setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
            markFirstAction();
            if (
              Math.max(
                Math.abs(gridPos.x - playerPosition.x),
                Math.abs(gridPos.y - playerPosition.y),
              ) > 2
            )
              challengeDirectHitRef.current = false;
            if (currentBattleAp - apCost <= 0) {
              selectedSpellIdRef.current = null;
              setSpellSelectionVersion((v) => v + 1);
              spellRangeCacheRef.current.clear();
              setBattleActionMode("walk");
            }
          } else if (castResult === "summon") {
            // FIX #3 (summon AP cost): deduct apCost + markFirstAction + set
            // cooldown, mirroring the "cast" branch. challengeDirectHitRef is
            // owned by another task — do NOT touch it here.
            setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
            markFirstAction();
            challengeMaxApThisTurnRef.current += apCost;
            if (spell.cooldown && spell.cooldown > 0) {
              spellCooldownsRef.current.set(spell.id, spell.cooldown as number);
              setSpellCooldownVersion((v) => v + 1);
            }
            if (currentBattleAp - apCost <= 0) {
              selectedSpellIdRef.current = null;
              setSpellSelectionVersion((v) => v + 1);
              spellRangeCacheRef.current.clear();
              setBattleActionMode("walk");
            }
          }
          // "no_ap" | "abort" → no further action
        }
        return;
      }
      if (
        currentMap.tiles[gridPos.y][gridPos.x] !== "wall" &&
        !currentMap.voidTiles?.has(`${gridPos.x},${gridPos.y}`)
      ) {
        // Block click-to-move onto portal tiles during battle
        if (
          inBattleRef.current &&
          currentMap.portals.some((p) => p.x === gridPos.x && p.y === gridPos.y)
        )
          return;
        setClickedTile({ x: gridPos.x, y: gridPos.y, timestamp: Date.now() });
        const path = findPath(playerPosition, gridPos);
        if (path.length > 0) {
          setMovementPath(path);
          setCurrentStepIndex(0);
          setIsMoving(true);
          movementStartTimeRef.current = Date.now();
        } else {
          const dx = Math.abs(gridPos.x - playerPosition.x);
          const dy = Math.abs(gridPos.y - playerPosition.y);
          if (dx <= 1 && dy <= 1 && dx + dy > 0) {
            setMovementPath([gridPos]);
            setCurrentStepIndex(0);
            setIsMoving(true);
            movementStartTimeRef.current = Date.now();
          }
        }
      }
    },
    [
      currentMap,
      clientToGrid,
      findPath,
      playerPosition,
      inBattle,
      battlePhase,
      battleActionMode,
      currentBattleMp,
      currentBattleAp,
      getMpReachableTiles,
      getSpellRangeTiles,
      activeSpells,
      playerSpellContext,
      activeMapModifierTypes,
    ],
  );
  // FIXED: Player movement animation with immediate portal checking on each step
  useEffect(() => {
    if (!isMoving || movementPath.length === 0) return;
    const movePlayer = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - movementStartTimeRef.current;
      const stepDuration = MOVEMENT_DURATION / movementPath.length;
      const targetStepIndex = Math.floor(elapsed / stepDuration);
      if (targetStepIndex >= movementPath.length) {
        // Movement complete - ensure player is exactly at final position
        const finalPosition = movementPath[movementPath.length - 1];
        setPlayerPosition(finalPosition);
        setIsMoving(false);
        setMovementPath([]);
        setCurrentStepIndex(0);
        setClickedTile(null);
        // FIX 3: Tracked movement-end timers — cancelled by cleanupMap on portal/battle.
        const mt1 = window.setTimeout(() => {
          movementTimersRef.current.delete(mt1);
          updateCameraToFollowPlayer();
        }, 50);
        movementTimersRef.current.add(mt1);
        // FIXED: Check for portal interaction immediately after movement is complete
        const mt2 = window.setTimeout(() => {
          movementTimersRef.current.delete(mt2);
          checkPortalInteraction();
        }, 100);
        movementTimersRef.current.add(mt2);
        return;
      }
      if (targetStepIndex > currentStepIndex) {
        setCurrentStepIndex(targetStepIndex);
        const newPosition = movementPath[targetStepIndex];
        // FIXED: Ensure player position is exactly at tile center
        const newPos = {
          x: Math.round(newPosition.x),
          y: Math.round(newPosition.y),
        };
        setPlayerPosition(newPos);
        if (isShrineRoomRef.current && shrineAltarPosRef.current) {
          const _isHazardTile =
            currentMap?.hazardTiles?.has(`${newPos.x},${newPos.y}`) ?? false;
          if (
            !_isHazardTile &&
            !(
              newPos.x === shrineAltarPosRef.current.x &&
              newPos.y === shrineAltarPosRef.current.y
            )
          ) {
            shrinePathViolatedRef.current = true;
          }
          if (
            newPos.x === shrineAltarPosRef.current.x &&
            newPos.y === shrineAltarPosRef.current.y
          ) {
            const _purePath = !shrinePathViolatedRef.current;
            onDokaBalanceChange(dokaBalance + 300);
            if (_purePath) {
              covenantBuffMapsRef.current = 3;
              try {
                localStorage.setItem(
                  `pbv_covenant_buff_${userId}_slot${characterSlot}`,
                  "3",
                );
              } catch (e) {
                logDebugWarn(
                  "MAP",
                  "Shrine covenant buff save failed",
                  String(e),
                );
              }
            }
            shrineAchievementRef.current += 1;
            try {
              localStorage.setItem(
                `pbv_shrine_count_${userId}_slot${characterSlot}`,
                String(shrineAchievementRef.current),
              );
            } catch (e) {
              logDebugWarn("MAP", "Shrine count save failed", String(e));
            }
            setShrineCompleted(true);
            isShrineRoomRef.current = false;
          }
        }
        // Auto-collect Doka loot on tile contact
        setDokaLoot((prev) => {
          const hit = prev.find(
            (loot) =>
              !loot.collected &&
              loot.tileX === newPos.x &&
              loot.tileY === newPos.y,
          );
          if (!hit) return prev;
          // Trigger collection
          onDokaBalanceChange(dokaBalance + hit.value);
          playSound("doka_collected", String(hit.value));
          // Track ground doka pickup count for achievement
          groundDokaPickupCountRef.current += 1;
          try {
            // M6: Namespace by userId+slot
            const gdKey = userId
              ? `${userId}_slot${characterSlot}_pbv_ground_doka_pickups`
              : "pbv_ground_doka_pickups";
            localStorage.setItem(
              gdKey,
              String(groundDokaPickupCountRef.current),
            );
          } catch {
            /* ignore */
          }
          logBattleEntry(
            `\uD83D\uDCB0 [COLLECT] You found ${hit.value} Doka on the ground!`,
            "#f1c40f",
          );
          // Coin trail animation removed — pickup is instant, float text shows the value
          const playerScreen = gridToScreen(newPos.x, newPos.y);
          effectsManagerRef.current.spawnDoka(
            playerScreen.x,
            playerScreen.y,
            hit.value,
          );
          return prev.map((l) =>
            l.id === hit.id ? { ...l, collected: true } : l,
          );
        });
        // EXP5: SYNCHRONOUS hazard tile check — no setTimeout, no async
        if (currentMap) {
          const hazardType = currentMap.hazardTiles?.get(
            `${newPos.x},${newPos.y}`,
          );
          if (hazardType) {
            if (hazardType === "lava") {
              const rawDmg = 8 + Math.floor(Math.random() * 8); // 8-15
              setCharacterStats((prev) => ({
                ...prev,
                hp: Math.max(0, prev.hp - rawDmg),
              }));
              logBattleEntry(
                `🌋 You stepped on lava! -${rawDmg} HP`,
                "#ff4400",
              );
              // Apply Burning DoT
              applyActiveEffect({
                id: `hazard-burn-${Date.now()}`,
                effectName: "Burning",
                type: "dot",
                targetId: "player",
                duration: 3,
                iconEmoji: "🔥",
                description: "Burning from lava",
                dotDamagePerTurn: 3,
              });
            } else if (hazardType === "ice") {
              logBattleEntry("❌❄️ You stepped on ice! Slowed!", "#66ccff");
              // Apply Frozen debuff (-50% MP per turn)
              applyActiveEffect({
                id: `hazard-frozen-${Date.now()}`,
                effectName: "Frozen",
                type: "debuff",
                targetId: "player",
                stat: "mp",
                modifier: -2,
                duration: 2,
                iconEmoji: "❄️",
                description: "Slowed by ice: -2 MP",
              });
            } else if (hazardType === "spikes") {
              const spikeDmg = 5 + Math.floor(Math.random() * 6); // 5-10
              setCharacterStats((prev) => ({
                ...prev,
                hp: Math.max(0, prev.hp - spikeDmg),
              }));
              logBattleEntry(
                `⚔️ You stepped on spikes! -${spikeDmg} HP`,
                "#cc8800",
              );
            }
          }
        }
        // Update player view based on movement direction
        if (targetStepIndex > 0) {
          const prev = movementPath[targetStepIndex - 1];
          const current = movementPath[targetStepIndex];
          if (current.x > prev.x) setPlayerView("right");
          else if (current.x < prev.x) setPlayerView("left");
          else if (current.y > prev.y) setPlayerView("front");
          else if (current.y < prev.y) setPlayerView("back");
        }
        // Update camera to follow player during movement with smooth tracking
        updateCameraToFollowPlayer();
        // FIXED: Check for portal interaction on EVERY step, not just at the end
        // FIX F: Removed untracked setTimeout portal check — timer was never cancelled
        // in cleanupMap, causing portal logic to fire on the new map after transition.
      }
      requestAnimationFrame(movePlayer);
    };
    requestAnimationFrame(movePlayer);
  }, [
    isMoving,
    movementPath,
    currentStepIndex,
    updateCameraToFollowPlayer,
    checkPortalInteraction,
    gridToScreen,
    logBattleEntry,
    currentMap,
    applyActiveEffect,
    userId,
    characterSlot,
    dokaBalance,
    onDokaBalanceChange,
  ]);
  // FIXED: Check portal interaction whenever player position changes
  // EDIT 3 — Edge-trigger: only fire checkPortalInteraction() on the actual
  // isMoving false-transition (moving → stopped), NOT on every
  // checkPortalInteraction identity change. The callback's deps array is large
  // (24+ entries) so its identity flips on many unrelated state updates; without
  // this guard the check re-ran even for a stationary player, which is what
  // re-triggered the sealed-portal log spam (now also deduped via
  // sealedPortalAnnouncedRef above). We keep the latest callback in a ref so
  // the effect's deps array can be [isMoving] only.
  checkPortalInteractionRef.current = checkPortalInteraction;
  useEffect(() => {
    const wasMoving = prevIsMovingRef.current;
    prevIsMovingRef.current = isMoving;
    if (!isMoving && wasMoving) {
      // Player just stopped — check the tile they landed on.
      checkPortalInteractionRef.current();
    }
  }, [isMoving]);
  // Check for battle trigger
  // Check for battle trigger — fires when player is exactly 1 Chebyshev step from any enemy
  // Helper: find a free cell at least minDist Chebyshev away from all given positions
  const findFreeCellFarFrom = useCallback(
    (
      positions: { x: number; y: number }[],
      minDist: number,
      tiles: TileType[][],
    ): { x: number; y: number } | null => {
      const candidates: { x: number; y: number; dist: number }[] = [];
      for (let gy = 0; gy < WORLD_GRID_SIZE; gy++) {
        for (let gx = 0; gx < WORLD_GRID_SIZE; gx++) {
          if (tiles[gy][gx] === "wall") continue;
          if (currentMap?.voidTiles?.has(`${gx},${gy}`)) continue;
          const minD = positions.reduce(
            (m, p) =>
              Math.min(m, Math.max(Math.abs(gx - p.x), Math.abs(gy - p.y))),
            Number.POSITIVE_INFINITY,
          );
          if (minD >= minDist) candidates.push({ x: gx, y: gy, dist: minD });
        }
      }
      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.dist - a.dist);
      return { x: candidates[0].x, y: candidates[0].y };
    },
    [currentMap],
  );
  // ── Unified cleanup functions ──────────────────────────────────────────────
  // cleanupBattle: terminates every timer/interval/flag from an active battle.
  // Must be defined BEFORE handleBattleEnd and checkPortalInteraction use it.
  const cleanupBattle = useCallback(() => {
    if (inBattleRef.current) {
      onDebugLog?.("BATTLE_END", "Battle resolved");
    }
    // 1. Set abort flag first — stops any in-flight AI decision mid-execution
    enemyTurnAbortRef.current = true;
    challengeHealUsedRef.current = false;
    challengeTotalDamageRef.current = 0;
    challengeTurnCountRef.current = 0;
    challengeMaxApThisTurnRef.current = 0;
    challengeDirectHitRef.current = true;
    // M-4: Mark cleanup as having run so no new timeouts can register after this
    cleanupRanRef.current = true;
    // FIX 4: Cancel recap timer so it never fires after battle ends
    if (recapTimerRef.current !== null) {
      clearTimeout(recapTimerRef.current);
      recapTimerRef.current = null;
    }
    // Cancel battle init safety timeout
    if (battleInitSafetyTimeoutRef.current) {
      clearTimeout(battleInitSafetyTimeoutRef.current);
      battleInitSafetyTimeoutRef.current = null;
    }
    // 2. Increment AI generation counter so stale AI callbacks self-terminate.
    aiGenerationRef.current += 1;
    // 3. Cancel ALL tracked pending timeouts from enemy AI
    for (const tid of pendingTimeoutsRef.current) {
      clearTimeout(tid);
    }
    pendingTimeoutsRef.current.clear();
    // 4. Clear the turn-timer interval (LEAK-2: single guarded clearInterval)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    // 5. Cancel jackpot heal timer (LEAK-4: was not tracked in pendingTimeoutsRef)
    if (jackpotHealTimerRef.current) {
      clearTimeout(jackpotHealTimerRef.current);
      jackpotHealTimerRef.current = null;
    }

    // 6. Reset all battle-phase boolean flags
    inBattleRef.current = false;
    // FIX 2d: Flush any spell-bar change the player queued DURING battle.
    // handleSetActiveSpells stashed the requested list into pendingSpellBarRef
    // (instead of silently dropping it) because the bar is locked mid-fight.
    // Now that inBattleRef is false we apply the queued list via the ref mirror
    // so the change is never lost, and toast the player that it landed.
    const pendingSpellBar = pendingSpellBarRef.current;
    pendingSpellBarRef.current = null;
    if (pendingSpellBar) {
      handleSetActiveSpellsRef.current(pendingSpellBar);
      logDebugInfo("SPELLS", "[SPELLBAR] applied after battle", {
        count: pendingSpellBar.length,
      });
      toast("Spell bar changes applied after battle", {
        duration: 4000,
        style: {
          background: "#1a0a0a",
          border: "1px solid #8b0000",
          color: "#ffaaaa",
        },
      });
    }
    battleReadyRef.current = false;
    enemyTurnInProgressRef.current = false;
    battleTriggerCooldownRef.current = false;
    battleInitFrameRef.current = 0;
    battleStartSkipRef.current = 0;

    // 8. Clear spell/barrier/mirror caches (LEAK-8, H2, H3, M5)
    mirrorUnitsRef.current.clear();
    barrierTilesRef.current.clear();
    spellRangeCacheRef.current.clear();
    enemyPathCacheRef.current.clear();

    // M-3: Clear accumulated cooldown maps so old battle data doesn't bleed
    //      into the next battle (prevents GC stalls from pileup after 10+ battles)
    enemyCooldownsRef.current = new Map();
    enemySummonCooldownRef.current = new Map();
    spellCooldownsRef.current.clear();
    setSpellCooldownVersion((v) => v + 1);
    setEnemyCooldowns({});

    // C3: Clear turn order so stale battle data never bleeds into the next battle.
    // (Was missing despite a comment in cleanupMap claiming it was here.)
    setTurnOrder([]);
    turnOrderRef.current = [];
    // Part 1: Reset battlePhase to "player" so the next battle's
    // setBattlePhase("enemy") (when entry 0 is an AI combatant) is a REAL
    // state change — guaranteeing the AI-trigger effect fires for turn 0.
    // Without this, a battle that ended during the enemy phase leaves
    // battlePhase === "enemy", so the next setBattlePhase("enemy") is a
    // no-op and the AI-trigger effect never runs turn 0 → click deadlock.
    setBattlePhase("player");

    // EXP6: Reset buff item effects on battle cleanup
    shieldHpRef.current = 0;
    furyRef.current = { turnsLeft: 0 };

    // Atomic boss state reset — all boss refs cleared in one contiguous block
    if (bossEncounterBannerTimerRef.current !== null) {
      clearTimeout(bossEncounterBannerTimerRef.current);
      bossEncounterBannerTimerRef.current = null;
    }
    setBossEncounterBanner(null);
    cleanupBossState(bossStateRef, setActiveBossState);
    bossStateRef.current = null;
    currentBossConfigRef.current = null;
    illusionsRef.current = [];
    setCurrentBossId(null);
    // 9. Reset watchdog counter
    idleTurnCountRef.current = 0;
    // M3 FIX: Reset battleEndedRef so the NEXT battle can call handleBattleEnd
    battleEndedRef.current = false;
    // H2 FIX: Clear active effects state and ref so status icons don't linger after victory
    activeEffectsRef.current = [];
    setActiveEffects([]);
    // enemy effects are stored in activeEffects with targetId === enemy.id, already cleared above
  }, [onDebugLog]);

  // cleanupMap: runs cleanupBattle then also clears map-level particle/effect state.
  // Call this as the FIRST action inside checkPortalInteraction.
  const cleanupMap = useCallback(() => {
    cleanupPhaseRef.current = "timers";
    // C2 FIX: Synchronously reset dungeon chain refs FIRST
    dungeonChainActiveRef.current = false;
    dungeonChainDepthRef.current = 0;
    dungeonChainMaxDepthRef.current = 0;
    dungeonCompletionSavedRef.current = false;
    isShrineRoomRef.current = false;
    shrineAltarPosRef.current = null;
    shrinePathViolatedRef.current = false;
    mapWallDensityRef.current = 0;
    mapChokePointsRef.current = new Set();
    mapBottleneckTilesRef.current = new Set();
    mapIsCorridorRef.current = false;
    // C5 FIX: Clear boss hazard tiles on map exit
    if (bossStateRef.current) {
      bossStateRef.current = { ...bossStateRef.current, hazardTiles: [] };
    }
    // FIX 1: Cancel both portal transition timers FIRST — before any state changes.
    // Stale timers from a previous portal can clear the transition lock mid-render
    // and allow two map-generation calls to race.
    if (portalTimerRef1.current !== null) {
      clearTimeout(portalTimerRef1.current);
      portalTimerRef1.current = null;
    }
    if (portalTimerRef2.current !== null) {
      clearTimeout(portalTimerRef2.current);
      portalTimerRef2.current = null;
    }

    // FIX 2: Doka float-text RAF is now managed by effectsManager; clear on map change.
    effectsManagerRef.current.clear();

    // FIX 3: Cancel movement-end timers so they cannot call checkPortalInteraction
    // on a map that has already been replaced.
    for (const id of movementTimersRef.current) clearTimeout(id);
    movementTimersRef.current.clear();

    // Cancel the Death Realm transition timer.
    if (deathRealmTimerRef.current !== null) {
      clearTimeout(deathRealmTimerRef.current);
      deathRealmTimerRef.current = null;
    }

    // Cancel respawn / camera-follow timers (untracked prior to this fix)
    if (respawnTimerRef.current !== null) {
      clearTimeout(respawnTimerRef.current);
      respawnTimerRef.current = null;
    }
    if (cameraFollowTimerRef.current !== null) {
      clearTimeout(cameraFollowTimerRef.current);
      cameraFollowTimerRef.current = null;
    }

    cleanupPhaseRef.current = "battle";
    cleanupBattle();
    spellRangeCacheRef.current = new Map();
    enemyPathCacheRef.current = new Map();
    cleanupPhaseRef.current = "effects";

    // Clear all particle accumulation refs that grow across maps
    dustMotesRef.current = [];
    leaderDeathParticlesRef.current = [];
    // H1: Increment generation so any in-flight leader particle RAF aborts
    leaderParticleGenRef.current += 1;
    leaderDeathTextRef.current = null;
    coinParticlesRef.current = [];
    effectsManagerRef.current.clear();

    // Clear Doka ground loot so coins from the old map never appear on the new one
    setDokaLoot([]);

    // Clear DoT active-effects so effects from battle/previous map don't bleed in
    // C3: setTurnOrder([]) is called inside cleanupBattle above (verified present).
    activeEffectsRef.current = [];
    setActiveEffects([]);

    // ISSUE 1 FIX: Dismiss any pending achievement toast so its internal timers
    // (timerRef, fadeTimer, dismissTimer) are cleaned up via its own useEffect return.
    setPendingAchievementToast(null);
    cleanupPhaseRef.current = "idle";
  }, [cleanupBattle]);

  // H7: Explicit re-entry guard for the 2-frame battle initialisation window.
  // battleTriggerCooldownRef blocks re-triggers for 600 ms but there is a
  // 2-frame gap between the collidingEnemy check and the debounce assignment.
  // battleInitInProgressRef closes that gap: it is set at the very first line
  // inside the collision branch and cleared when flushSync finishes.
  const battleInitInProgressRef = useRef(false);

  // Check for battle trigger — fires only when player steps on the EXACT same cell as an enemy
  // biome-ignore lint/correctness/useExhaustiveDependencies: calcEnemyMaxHp is a stable useCallback — included in dep array
  const checkBattleTrigger = useCallback(() => {
    // Guard: never re-trigger while battle is already initialising or active
    if (inBattle || inBattleRef.current || transitionInProgressRef.current)
      return;
    if (battleTriggerCooldownRef.current) return;
    // H7: Secondary re-entry guard for the 2-frame init window
    if (battleInitInProgressRef.current) return;

    const collidingEnemy = getLiveCombatants(combatantStoreCtx).find(
      (enemy) => {
        return enemy.x === playerPosition.x && enemy.y === playerPosition.y;
      },
    );

    if (collidingEnemy && currentMap) {
      // H7: Claim re-entry guard immediately — before any other work
      battleInitInProgressRef.current = true;
      // --- Debounce: block any further triggers for 600ms ---
      battleTriggerCooldownRef.current = true;
      // Reset stale AI flag immediately (synchronously, before any React update)
      enemyTurnInProgressRef.current = false;
      battleReadyRef.current = false;

      const tiles = currentMap.tiles;

      // Teleport player to a free cell >= 3 Chebyshev from all enemies
      const enemyPositions = getLiveCombatants(combatantStoreCtx).map((e) => ({
        x: e.x,
        y: e.y,
      }));
      const newPlayerPos = findFreeCellFarFrom(enemyPositions, 3, tiles);

      // Teleport each enemy to a UNIQUE free cell >= 3 Chebyshev from the player
      // We track already-occupied positions so enemies don't stack on the same tile
      const occupiedPositions: { x: number; y: number }[] = [playerPosition];
      const updatedEnemies = enemies.map((e) => {
        const stats = computeEnemyStats(e.level, e.pieceType, e.id);
        const newPos = findFreeCellFarFrom(occupiedPositions, 3, tiles);
        if (newPos) {
          // Claim this position so the next enemy picks a different one
          occupiedPositions.push(newPos);
          return {
            ...e,
            x: newPos.x,
            y: newPos.y,
            isMoving: false,
            movementPath: [],
            sp: stats.sp,
            sr: stats.sr,
            init: stats.init,
            res: stats.res,
            chc: stats.chc,
          };
        }
        // Fallback: keep original position but still freeze movement
        occupiedPositions.push({ x: e.x, y: e.y });
        return {
          ...e,
          isMoving: false,
          movementPath: [],
          sp: stats.sp,
          sr: stats.sr,
          init: stats.init,
          res: stats.res,
          chc: stats.chc,
        };
      });

      // Clear dust motes at battle start so ambient particles don't accumulate
      dustMotesRef.current = [];
      // Clear any leftover coin loot so coins from world mode don't render in battle
      setDokaLoot([]);

      // Apply teleports
      if (newPlayerPos) setPlayerPosition(newPlayerPos);

      // Build initiative-sorted turn order
      // 4b: Assign 10 random spells per enemy from usableByEnemy pool
      const enemyUsableSpells = normalizedSpellPool.filter(
        (s) => s.usableByEnemy !== false, // undefined/null = backward compat → allowed
      );
      const assignEnemySpells = (_enemyCount: number) => {
        if (enemyUsableSpells.length === 0)
          return [] as typeof normalizedSpellPool;
        const shuffled = [...enemyUsableSpells].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(10, shuffled.length));
      };

      // Update enemies with their individual spell selections
      const enemiesWithSpells = updatedEnemies.map((e, _i) => ({
        ...e,
        spells: assignEnemySpells(updatedEnemies.length),
      }));

      const summonerChance =
        ENEMY_SUMMONER_CHANCE_BASE +
        characterStats.level * ENEMY_SUMMONER_CHANCE_PER_LEVEL_ZONE;
      const wolfSpell = starterSpells.find((s) => s.id === "summon-dire-wolf");
      const archerSpell = starterSpells.find((s) => s.id === "summon-archer");
      for (const e of enemiesWithSpells) {
        if (!e.isSummon && !e.isSummoner && Math.random() < summonerChance) {
          e.isSummoner = true;
          const summonSpell = Math.random() < 0.5 ? wolfSpell : archerSpell;
          if (summonSpell) e.spells = [...(e.spells ?? []), summonSpell];
        }
      }

      const playerEntry: CombatantEntry = {
        id: "player",
        type: "player",
        initiative: characterStats.init,
        name: characterName,
        pieceIcon: "\u2654",
        hp: characterStats.hp,
        maxHp: maxHp, // H1: use actual max HP (level-scaled), not hardcoded 100
        level: characterStats.level,
      };
      // Issue 2 fix: reuse spell assignment from enemiesWithSpells so enemy.spells
      // and the turnOrder entry always use the exact same randomly-drawn spell set.
      const enemyEntries: CombatantEntry[] = enemiesWithSpells.map((e) => {
        const isBossEnemy =
          !!currentBossConfigRef.current && e.id.startsWith("boss_");
        const bossConf = isBossEnemy ? currentBossConfigRef.current : null;
        return {
          id: e.id,
          type: "enemy",
          initiative: isBossEnemy
            ? (bossConf?.baseStats.init ?? Math.max(1, 8 + e.level - 1))
            : e.init,
          name: e.assignedName ?? e.pieceType,
          pieceIcon: isBossEnemy ? (bossConf?.iconEmoji ?? "☠") : "☠",
          hp: isBossEnemy
            ? (bossConf?.baseStats.hp ?? calcEnemyMaxHp(e.level))
            : calcEnemyMaxHp(e.level),
          maxHp: isBossEnemy
            ? (bossConf?.baseStats.hp ?? calcEnemyMaxHp(e.level))
            : calcEnemyMaxHp(e.level),
          level: e.level,
          pieceType: e.pieceType,
          spells: e.spells,
          sp: e.sp,
          sr: e.sr,
          res: e.res,
          chc: e.chc,
          isBoss: isBossEnemy,
          bossId: isBossEnemy ? currentBossConfigRef.current!.id : undefined,
          currentBossPhase: isBossEnemy ? (1 as 1 | 2) : undefined,
        } as CombatantEntry;
      });
      const order = [playerEntry, ...enemyEntries].sort(
        (a, b) => b.initiative - a.initiative,
      );

      const hpMap: Record<string, number> = {};
      for (const e of updatedEnemies) {
        const isBossForHp =
          !!currentBossConfigRef.current && e.id.startsWith("boss_");
        hpMap[e.id] = isBossForHp
          ? currentBossConfigRef.current!.baseStats.hp
          : calcEnemyMaxHp(e.level);
      }

      // --- SYNCHRONOUS flushSync: ALL battle-init state in a single commit ---
      // This prevents any render cycle from seeing partially-updated state
      // (old pattern with startTransition deferred the updates causing a
      // multi-frame window where inBattleRef was true but turnOrder was empty).

      // FIX #15: Increment AI generation so residual callbacks from previous
      // battles see a stale generation and abort without touching state.
      aiGenerationRef.current += 1;
      playSound("battle_start");

      // Designate the highest-level enemy (or first) as the group leader
      const sortedByLevel = [...enemiesWithSpells].sort(
        (a, b) => b.level - a.level,
      );
      const leaderEnemy = sortedByLevel[0] ?? null;
      leaderEnemyIdRef.current = leaderEnemy?.id ?? null;
      leaderDiedRef.current = false;
      allEnemiesErraticRef.current = false;
      erraticTurnsLeftRef.current = 0;
      focusTargetRef.current = null;
      focusTurnRef.current = -1;
      playerSpellTypeHistoryRef.current = [];
      const initCooldowns = new Map<string, Map<string, number>>();
      for (const e of enemiesWithSpells) initCooldowns.set(e.id, new Map());
      enemyCooldownsRef.current = initCooldowns;

      // Annotate turnOrder entries with isLeader flag
      const orderWithLeader = order.map((c) =>
        c.type === "enemy" && c.id === leaderEnemy?.id
          ? { ...c, isLeader: true }
          : c,
      );

      // FIX E: cleanupRanRef MUST be set to false BEFORE flushSync opens.
      // If set after flushSync, an AI callback whose timer fires during the React
      // commit window sees cleanupRanRef=true and registers itself as untracked,
      // permanently escaping the cleanup registry.
      cleanupRanRef.current = false;
      battleSpellsRef.current = [
        physicalAttackSpell,
        ...activeSpells.filter((s) => s && s.id !== physicalAttackSpell.id),
      ];
      flushSync(() => {
        syncCombatants(combatantStoreCtx, enemiesWithSpells);
        mapModifierRegistry.applyBattleStart(
          combatantsRef.current,
          activeMapModifierTypes,
        );
        setEnragedEnemies(new Set());
        setEnemyHpMap(hpMap);
        setTurnOrder(orderWithLeader);
        turnOrderRef.current = orderWithLeader;
        setCurrentTurnIndex(0);
        currentTurnIndexRef.current = 0;
        // Part 2: Explicit turn-0 dispatch. advanceTurn's AI branches drive
        // AI turns via setBattlePhase("enemy") (see @11197/@11207), which
        // triggers the AI-trigger effect (@11310, deps [inBattle,
        // currentTurnIndex, battlePhase]). Part 1's cleanupBattle reset
        // guarantees this setBattlePhase("enemy") is a REAL state change
        // (player→enemy) when entry 0 is an AI combatant, so the effect
        // fires turn 0 even after a prior battle ended mid-enemy-phase.
        // No parallel AI runner is introduced — this IS the same mechanism.
        setBattlePhase(
          orderWithLeader[0].type === "player" ? "player" : "enemy",
        );
        setInBattle(true);
        inBattleRef.current = true;
        onDebugLog?.("BATTLE_START", "Battle started");
        setBattleEnemies([...enemiesWithSpells]);
        // Battle-start AP/MP init now reads from the canonical progression
        // formula (getPlayerBaseStats) + active-effect modifiers, NOT the raw
        // persisted characterStats.ap/mp. The formula is the floor
        // (PLAYER_BASE_AP=8, PLAYER_BASE_MP=4) and wins on divergence.
        const _baseStats = getPlayerBaseStats(
          characterStats.level,
          levelUpConfig,
        );
        const _baseAp =
          _baseStats.ap +
          getStatModifier("player", "ap", activeEffectsRef.current);
        const _baseMp =
          _baseStats.mp +
          getStatModifier("player", "mp", activeEffectsRef.current);
        setCurrentBattleAp(_baseAp);
        setCurrentBattleMp(_baseMp);
        if (
          !_progressionDivergenceWarned &&
          (Number(characterStats.ap) !== _baseStats.ap ||
            Number(characterStats.mp) !== _baseStats.mp)
        ) {
          _progressionDivergenceWarned = true;
          logDebugWarn(
            "BATTLE",
            "[PROGRESSION] persisted ap/mp diverges from formula",
            {
              persistedAp: Number(characterStats.ap),
              formulaAp: _baseStats.ap,
              persistedMp: Number(characterStats.mp),
              formulaMp: _baseStats.mp,
              level: characterStats.level,
            },
          );
        }
        setBattleActionMode("walk");
        setBattleTurn(1);
        activeEffectsRef.current = [];
        setActiveEffects([]);
        // Reset cooldowns at start of every battle
        spellCooldownsRef.current.clear();
        setSpellCooldownVersion((v) => v + 1);
        setEnemyCooldowns({});
        // H-2: battleReadyRef set INSIDE flushSync so it is true by the time
        // the AI effect runs after the single commit — first enemy turn never skips.
        battleReadyRef.current = true;
        // C1: enemyTurnAbortRef MUST be reset inside flushSync — if it's reset
        // after flushSync closes there is a tiny window where AI fires with abort=true
        // and the first enemy turn silently skips.
        enemyTurnAbortRef.current = false;
        // C4: battleStartSkipRef MUST be set before the flushSync commit so the
        // VFX canvas is paused from the very first rendered frame of the new battle.
        battleStartSkipRef.current = 2;
      });

      inBattleRef.current = true;
      if (battleInitSafetyTimeoutRef.current)
        clearTimeout(battleInitSafetyTimeoutRef.current);
      battleInitSafetyTimeoutRef.current = setTimeout(() => {
        if (!inBattleRef.current) {
          inBattleRef.current = true;
          setInBattle(true);
        }
        battleInitSafetyTimeoutRef.current = null;
      }, 2000);

      battleHitsRef.current = 0;
      // Reset battle-scoped refs
      timestepUsedRef.current = false;
      playerApWasDebuffedRef.current = false;
      // Reset per-battle achievement tracking
      battleCritHitsRef.current = 0;
      battleBetrayalOccurredRef.current = false;
      battleDoubleBetrayelOccurredRef.current = false;
      battleLeaderSlainRef.current = false;
      battleOnlyHealBuffSpellsRef.current = true;
      // FIX-3: cleanupRanRef is now reset INSIDE flushSync above (before AI can fire).
      // Keeping pendingTimeoutsRef.current.clear() here is still correct — it ensures
      // any timeouts that somehow registered between flushSync close and here are cleared.
      pendingTimeoutsRef.current.clear();
      setNewlyUnlockedInBattle([]);
      battleTriggerCooldownRef.current = false;
      const _randChallenge =
        DEFAULT_CHALLENGES[
          Math.floor(Math.random() * DEFAULT_CHALLENGES.length)
        ];
      setCurrentChallenge(_randChallenge);
      // H7: Release re-entry guard after full init commit
      battleInitInProgressRef.current = false;

      // C5 fix: synchronous draw immediately after battle-init flushSync to fill
      // the first frame. Without this there is a 1-frame gap where inBattleRef
      // is true but the canvas has not yet rendered, causing a black flash.
      // battleInitFrameRef is already 0 here, so the draw guard lets it through.
      const _c5Canvas = canvasRef.current;
      if (_c5Canvas?.getContext("2d")) {
        animateRef.current();
      }

      logBattleEntry(
        `Battle started! Enemies separated. ${updatedEnemies.length} ${updatedEnemies.length > 1 ? "enemies" : "enemy"} on the field.`,
        "#ffffff",
      );
      logBattleEntry(
        order[0].type === "player" ? "Your turn" : `${order[0].name}'s turn`,
        "#ffffff",
      );
      // Boss lore intro in battle log
      if (currentBossConfigRef.current) {
        logBattleEntry(
          `☠️ BOSS ENCOUNTER: ${currentBossConfigRef.current.name}`,
          "#9333ea",
        );
        logBattleEntry(currentBossConfigRef.current.loreText, "#a855f7");
      }
    }
  }, [
    enemies,
    playerPosition,
    inBattle,
    currentMap,
    characterStats,
    characterName,
    logBattleEntry,
    findFreeCellFarFrom,
    normalizedSpellPool,
    maxHp,
  ]);

  // Handle battle end - FIXED: Properly return to overworld and remove enemies
  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanupBattle is stable (useCallback with stable refs)
  const handleBattleEnd = useCallback(
    async (
      victory: boolean,
      expGained?: number,
      _hitsDealt?: number,
      enemiesDefeated?: Array<{ name: string; level: number }>,
    ) => {
      logDebugInfo("BATTLE", "BATTLE_END triggered", {
        path: "handleBattleEnd",
        victory,
        isBossRush: bossRushActiveRef.current,
      });
      // M3 FIX: Idempotency guard — bail out immediately if we've already
      // run the battle-end logic once for this battle.
      // BOSS RUSH FIX: reset the guard for each boss rush room so every
      if (battleEndedRef.current) return;
      battleEndedRef.current = true;
      try {
        const challengeResults = evaluateChallenges(
          {
            challengeTotalDamageRef,
            challengeHealUsedRef,
            challengeDirectHitRef,
            challengeTurnCountRef,
            challengeMaxApThisTurnRef,
          },
          characterStats.hp,
          maxHp,
        );
        logDebugInfo(
          "CHALLENGE",
          "CHALLENGE_EVAL",
          JSON.stringify(challengeResults),
        );
        // Snapshot challenge state BEFORE cleanup wipes it
        const challengeCompleted =
          challengeAccepted && currentChallenge
            ? isChallengeCompleted(currentChallenge, {
                turnCount: challengeTurnCountRef.current,
                totalDamage: challengeTotalDamageRef.current,
                healUsed: challengeHealUsedRef.current,
                directHit: challengeDirectHitRef.current,
                maxApUsedInTurn: challengeMaxApThisTurnRef.current,
              })
            : false;
        const challengeDokaReward = challengeCompleted
          ? currentChallenge?.rewards?.doka || 0
          : 0;
        const _challengeXpReward = challengeCompleted
          ? currentChallenge?.rewards?.xp || 0
          : 0;
        const _completedChallengeName = challengeCompleted
          ? currentChallenge?.description || currentChallenge?.id || "Challenge"
          : null;
        // ── UNIFIED CLEANUP: terminates ALL timers, intervals, AI callbacks, VFX ──
        // cleanupBattle() handles: abort flag, both generation counters, all
        // pending timeouts, turn-timer interval, jackpot timer, VFX, battle flags,
        // mirror/barrier/spellRange/enemyPath caches, and idleTurnCount.
        cleanupBattle();
        const _battleEndGen = aiGenerationRef.current;
        setInBattle(false);
        playSound("battle_end");
        setBattleEnemies([]);
        // Log battle outcome
        if (victory) {
          logBattleEntry("Victory! All enemies defeated.", "#22c55e");
        } else {
          logBattleEntry("Defeated! Returning to map.", "#ef4444");
        }
        // Clear battle log for the next battle
        if (onBattleEnd) onBattleEnd();

        if (aiGenerationRef.current !== _battleEndGen) return; // concurrent battle end guard
        if (victory) {
          // Remove all enemies from map at the START of the victory branch
          // (before recap/rewards/achievements — see #290 ordering below).
          // Routed through the combatant store so ref mirrors stay in sync.
          syncCombatants(
            combatantStoreCtx,
            despawnSummons(combatantsRef.current),
          );

          // Apply boost multiplier + boss XP multiplier
          const activeBossConfForXP = currentBossConfigRef.current;
          const bossXpMultiplier = activeBossConfForXP
            ? activeBossConfForXP.rewardXpMultiplier
            : 1;
          const finalExp =
            boostMode === "xp"
              ? Math.round((expGained ?? 0) * 1.5 * bossXpMultiplier)
              : Math.round((expGained ?? 0) * bossXpMultiplier);

          // Award experience and calculate Doka
          const defeated = enemiesDefeated || [];

          // Calculate Doka per enemy with random multiplier tiers
          const dokaBreakdown: Array<{
            enemyName: string;
            level: number;
            doka: number;
          }> = [];
          for (const enemy of defeated) {
            const roll = Math.random();
            let multiplier: number;
            if (roll < 0.0001) {
              // 0.0001% — 1 to 1,000,000,000
              multiplier = Math.floor(Math.random() * 1_000_000_000) + 1;
            } else if (roll < 0.0005) {
              // 0.0005% — 1 to 5,000 (adjusted for 0.4% band)
              multiplier = Math.floor(Math.random() * 5_000) + 1;
            } else if (roll < 0.005) {
              // 0.5% — 1 to 1,000
              multiplier = Math.floor(Math.random() * 1_000) + 1;
            } else if (roll < 0.015) {
              // 1% — 55 to 100
              multiplier = Math.floor(Math.random() * 46) + 55;
            } else if (roll < 0.045) {
              // 3% — 1 to 50
              multiplier = Math.floor(Math.random() * 50) + 1;
            } else if (roll < 0.095) {
              // 5% — 1 to 10
              multiplier = Math.floor(Math.random() * 10) + 1;
            } else {
              // 90% — 1 to 3
              multiplier = Math.floor(Math.random() * 3) + 1;
            }
            dokaBreakdown.push({
              enemyName: enemy.name,
              level: Number(enemy.level),
              doka: Number(enemy.level) * multiplier,
            });
          }
          let rawDoka = dokaBreakdown.reduce(
            (sum, d) => sum + Number(d.doka),
            0,
          );
          rawDoka = mapModifierRegistry.applyRewardMultiplier(
            rawDoka,
            activeMapModifierTypes,
            {
              log: (msg: string) => logDebugInfo("MODIFIER", msg),
              rng: Math.random,
            },
          );
          // EXP8: Apply dungeon chain Doka multiplier (1.5x-4x based on depth)
          const chainMult = dungeonDokaMultiplierRef.current;
          // BOSS: Apply boss reward multiplier on top of chain multiplier
          const activeBossConf = currentBossConfigRef.current;
          const bossDokaMultiplier = activeBossConf
            ? activeBossConf.rewardDokaMultiplier
            : 1;
          const totalDoka =
            boostMode === "rewards"
              ? Math.round(rawDoka * 1.5 * chainMult * bossDokaMultiplier)
              : Math.round(rawDoka * chainMult * bossDokaMultiplier);

          // NOTE: Local state updated above; persistence is handled by resolveBattleRewards below.
          // Do NOT call updateCharacter here — rewards must ONLY persist via applyRewards.

          // Build and show recap IMMEDIATELY — never block on persistence
          const finalRecapData: BattleRecapData = {
            mapTitle: currentMapRef.current?.id || "Unknown",
            xpEarned: finalExp,
            dokaEarned: totalDoka,
            hitsDealt: battleHitsRef.current,
            enemiesDefeated: enemiesDefeated || [],
            currentLevel: characterStats.level,
            currentXP: characterStats.exp,
            xpForNextLevel: (characterStats.level || 1) * 100,
            dokaBreakdown: [],
            completedChallenges: challengeCompleted ? ["Battle Challenge"] : [],
            dungeonMultiplier: chainMult || 1,
            bossDefeated: currentBossConfigRef.current?.name || undefined,
          };

          logDebugInfo(
            "BATTLE",
            "Victory recap built",
            JSON.stringify(finalRecapData),
          );
          if (onShowBattleSummary) {
            onShowBattleSummary(finalRecapData);
            logDebugInfo("BATTLE", "onShowBattleSummary fired for victory");
          }

          // Persist rewards in a separate try/catch so failures never hide the recap
          try {
            const _recapData = await resolveBattleRewards(
              actor,
              characterSlot,
              {
                victory,
                enemiesDefeated: enemiesDefeated || [],
                completedChallenges: challengeCompleted
                  ? [
                      {
                        name: "Battle Challenge",
                        dokaReward: challengeDokaReward || 0,
                      },
                    ]
                  : [],
                dungeonMultiplier: chainMult || 1,
                baseDoka: totalDoka || 0,
                baseXp: finalExp || 0,
              },
            );
            const _rewardRecap = _recapData;

            setCharacterStats((prev) => ({
              ...prev,
              exp: _rewardRecap.newXp ?? characterStats.exp,
              level: _rewardRecap.currentLevel,
              hp: 50 + prev.level * 10,
              mp: 5 + Math.floor(prev.level / 10),
              ap: 6 + Math.floor(prev.level / 20),
            }));
            onDokaBalanceChange(_rewardRecap.newDoka ?? dokaBalance);
          } catch (persistErr) {
            logDebugInfo(
              "BATTLE",
              "Reward persistence failed (non-blocking)",
              String(persistErr),
            );
          }

          // ── Achievement checks after victory ──────────────────────────────────
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          const recap = finalRecapData as BattleRecapData | null;
          if (recap) {
            const newLevel = recap.currentLevel;
            const newDoka = dokaBalance + totalDoka;
            // first_battle_win — any victory
            checkAndFireAchievement("first_battle_win", true);
            // survive_1hp — end with exactly 1 HP
            if (characterStats.hp === 1) {
              checkAndFireAchievement("survive_1hp", true);
            }
            // level_10 — reached level 10+
            if (newLevel >= 10) {
              checkAndFireAchievement("level_10", true);
            }
            // doka_1000 / doka_10000
            if (newDoka >= 1000) checkAndFireAchievement("doka_1000", true);
            if (newDoka >= 10000) checkAndFireAchievement("doka_10000", true);
            // explore_25_maps
            if (mapsVisitedCountRef.current >= 25) {
              checkAndFireAchievement("explore_25_maps", true);
            }
            // loot_10_doka
            if (groundDokaPickupCountRef.current >= 10) {
              checkAndFireAchievement("loot_10_doka", true);
            }
            // spell_master_8 — 8 spells equipped
            if (activeSpells.length >= 8) {
              checkAndFireAchievement("spell_master_8", true);
            }
            // spell_level_5 — any spell upgraded to level 5+
            if (Object.values(spellLevels).some((l) => l >= 5)) {
              checkAndFireAchievement("spell_level_5", true);
            }
            // critical_5_in_battle
            if (battleCritHitsRef.current >= 5) {
              checkAndFireAchievement("critical_5_in_battle", true);
            }
            // pacifist_run — won using only heal/buff spells
            if (battleOnlyHealBuffSpellsRef.current) {
              checkAndFireAchievement("pacifist_run", true);
            }
            // betrayal_witness
            if (battleBetrayalOccurredRef.current) {
              checkAndFireAchievement("betrayal_witness", true);
            }
            // double_betrayal
            if (battleDoubleBetrayelOccurredRef.current) {
              checkAndFireAchievement("double_betrayal", true);
            }
            // leader_slayer
            if (battleLeaderSlainRef.current) {
              checkAndFireAchievement("leader_slayer", true);
            }
            // BOSS: fire per-boss achievement
            if (activeBossConf) {
              checkAndFireAchievement(
                `boss_defeated_${activeBossConf.id}`,
                true,
              );
              logBattleEntry(
                `☠️ BOSS DEFEATED: ${activeBossConf.name}!`,
                "#c084fc",
              );
            }
          }
        } else {
          // On defeat, keep enemies but reset player stats
          setCharacterStats((prev) => ({
            ...prev,
            hp: Math.floor(100 * (1 + ((prev?.level ?? 1) - 1) * 0.05) * 0.5),
            ap: Math.floor(4 * (1 + ((prev?.level ?? 1) - 1) * 0.05) * 0.5),
            mp: Math.floor(3 * (1 + ((prev?.level ?? 1) - 1) * 0.05) * 0.5),
          }));
        }
      } catch (err) {
        logDebugError("BATTLE", "Reward computation error", String(err));
        if (onShowBattleSummary) {
          onShowBattleSummary({
            mapTitle: currentMapRef.current?.id || "Unknown",
            xpEarned: 0,
            dokaEarned: 0,
            hitsDealt: 0,
            enemiesDefeated: [],
            currentXP: characterStats.exp,
            xpForNextLevel: (characterStats.level || 1) * 100,
            currentLevel: characterStats.level,
            dokaBreakdown: [],
          });
        }
      }
    },
    [
      currentMap,
      mapCount,
      boostMode,
      onBattleEnd,
      logBattleEntry,
      actor,
      characterStats,
      spellLevels,
      dokaBalance,
      characterSlot,
      characterName,
      pieceType,
      colors,
      activeSpells,
      checkAndFireAchievement,
      calcEnemyMaxHp,
    ],
  );

  function handleBossRushRoomClear() {
    // Idempotency guard
    if (battleEndedRef.current) return;
    battleEndedRef.current = true;

    // ── 1. ROOM CLEAR — NO AUTO-ADVANCE ──
    // The progression portal (spawned by the map generator) now drives room
    // advancement. handleBossRushRoomClear only records the cleared room and
    // unlocks the portal; the player steps into the portal to advance. The
    // final room still completes the run and opens the white sanctuary portal.
    const currentRoomIndex = bossRushState.currentRoom;
    const _currentRoom = BOSS_RUSH_ROOMS[currentRoomIndex];

    const nextRoomIndex = bossRushState.currentRoom + 1;
    const nextRoomDef = BOSS_RUSH_ROOMS[nextRoomIndex];
    if (!nextRoomDef) {
      // Final boss-rush room cleared — complete the run and open a white
      // gateway to sanctuary. Completion (unlike fleeing/death) keeps rewards;
      // no death penalty, no Death Realm reset.
      completeRun({
        bossRushActiveRef,
        dungeonChainActiveRef,
        dungeonChainDepthRef,
        dungeonChainMaxDepthRef,
        abortBossRush,
      });
      const { map: whiteMap, spawnPosition: whiteSpawn } = generateRandomMap();
      if (whiteMap) {
        const whitePortal = {
          x: whiteSpawn.x,
          y: whiteSpawn.y,
          color: "white" as const,
          isWhitePortal: true,
          animationOffset: Math.random() * Math.PI * 2,
        };
        whiteMap.portals = [...(whiteMap.portals || []), whitePortal];
        setCurrentMap(whiteMap);
        if (whiteSpawn) setPlayerPosition({ ...whiteSpawn });
        resetCombatantStore(combatantStoreCtx);
      }
      logBattleEntry("A white gateway to sanctuary opens…", "white");
    }
    // Non-final room: leave the progression portal unlocked. The portal step
    // (advanceBossRushRoom + map regen) fires when the player steps into it.

    // ── 2. REWARDS + POPUP (non-blocking, wrapped in try/catch) ──
    try {
      const defeatedList = _battleEnemies.map((e) => ({
        name: e.pieceType,
        level: e.level,
      }));
      const expGained =
        defeatedList.reduce((sum, e) => sum + Number(e.level) * 20, 0) ||
        Number(characterStats.level) * 20;

      // Compute Doka rewards
      const dokaPerEnemy = Math.max(
        5,
        Math.floor(Number(characterStats.level) * 1.5),
      );
      let totalDoka = defeatedList.length * dokaPerEnemy;

      // Apply boss rush multiplier (fixed at 1 — per-room multipliers removed)
      const roomMultiplier = 1;
      totalDoka = Math.floor(totalDoka * roomMultiplier);

      // Challenge rewards (placeholder — challenges evaluated elsewhere)
      const challengeDokaReward = 0;
      const completedChallenges: string[] = [];

      // Rewards persisted via applyRewards in resolveBattleRewards
      const newDokaBalance = dokaBalance + totalDoka + challengeDokaReward;
      const newXp = (characterStats.exp || 0) + expGained;

      onDokaBalanceChange(newDokaBalance);
      setCharacterStats((prev) => ({ ...prev, exp: newXp }));

      // Rewards persisted via applyRewards in resolveBattleRewards
      // if (actor) {
      //   void actor.addDoka(BigInt(totalDoka + challengeDokaReward));
      //   void actor.updateCharacterStats({
      //     ...characterStats,
      //     xp: newXp,
      //   });
      // }

      // Build recap data
      const finalRecapData = {
        mapTitle: `Boss Rush - Room ${currentRoomIndex + 1}`,
        xpEarned: expGained,
        hitsDealt: battleHitsRef.current,
        enemiesDefeated: defeatedList,
        currentXP: characterStats.exp || 0,
        xpForNextLevel: (characterStats.level || 1) * 100,
        currentLevel: characterStats.level || 1,
        dokaEarned: totalDoka + challengeDokaReward,
        dokaBreakdown: defeatedList.map((e) => ({
          enemyName: e.name,
          level: e.level,
          doka: Math.floor(dokaPerEnemy * roomMultiplier),
        })),
        dokaFromVictory: totalDoka,
        dokaFromChallenges: challengeDokaReward,
        completedChallenges,
        isBossRush: true,
        bossRushRoom: currentRoomIndex + 1,
      };

      // Set popup state (non-blocking overlay)
      if (onShowBattleSummary) onShowBattleSummary(finalRecapData);
    } catch (err) {
      logDebugError("BOSS", "BossRush reward/popup error", String(err));
    }

    // Clear battle state
    cleanupBattle();
  }

  // Handle player death
  const _handlePlayerDeath = useCallback(() => {
    onDebugLog?.("PLAYER_DEATH", "Player HP reached 0");
    // ── S2: RESET ALL RUN STATE BEFORE THE DEATH FLOW PROCEEDS ──────────
    // Dying inside a dungeon or boss-rush run must end the run immediately so
    // the Death Realm map generates in free-exploration mode (no locked
    // progression portal, no run-themed suppression). These resets run BEFORE
    // setShowGameOver / cleanupMap so there is no window where the death flow
    // can read stale run state.
    resetRunState({
      bossRushActiveRef,
      dungeonChainActiveRef,
      dungeonChainDepthRef,
      dungeonChainMaxDepthRef,
      abortBossRush,
    });
    setShowGameOver(true);
  }, [abortBossRush, onDebugLog]);

  // FEATURE 1: Watch HP — send to Death Realm when HP reaches 0 in battle
  const [deathPenalty, setDeathPenalty] = useState<{
    xpLost: number;
    dokaLost: number;
  }>({ xpLost: 0, dokaLost: 0 });
  const deathXpLostRef = useRef<number>(0);
  const deathTriggeredRef = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: stable refs
  useEffect(() => {
    if (!inBattle) {
      if (characterStats.hp <= 0 && !deathTriggeredRef.current) {
        deathTriggeredRef.current = true;
        const xpLost = Math.floor(characterStats.exp * 0.2);
        const dokaLost = Math.floor(dokaBalance * 0.4);
        const newXp = Math.max(0, characterStats.exp - xpLost);
        const newDoka = Math.max(0, dokaBalance - dokaLost);
        if (actor) {
          actor.applyRewards(characterSlot, 0, -xpLost).catch(() => {});
          actor.applyRewards(characterSlot, -dokaLost, 0).catch(() => {});
        }
        setCharacterStats((prev) => ({
          ...prev,
          exp: newXp,
          hp: Math.floor((50 + prev.level * 10) * 0.5),
        }));
        onDokaBalanceChange(newDoka);
        const defeatRecap: any = {
          isDefeat: true,
          xpLost,
          dokaLost,
          xpEarned: 0,
          dokaEarned: 0,
          currentLevel: characterStats.level,
          currentXP: newXp,
          xpForNextLevel: (characterStats.level || 1) * 100,
          enemiesDefeated: [],
          hitsDealt: 0,
          mapTitle: currentMapRef.current?.id || "Unknown",
        };
        if (onShowBattleSummary) onShowBattleSummary(defeatRecap);
        if (deathRealmTimerRef.current !== null)
          clearTimeout(deathRealmTimerRef.current);
        deathRealmTimerRef.current = window.setTimeout(() => {
          deathRealmTimerRef.current = null;
          const { map: deathMap, spawnPosition: drSpawn } =
            generateDeathRealmMap();
          currentMapRef.current = deathMap;
          setCurrentMap(deathMap);
          setPlayerPosition(drSpawn || { x: 2, y: 2 });
          resetCombatantStore(combatantStoreCtx);
          setInBattle(false);
          cleanupBattle();
          deathTriggeredRef.current = false;
        }, 1500);
      }
      return;
    }
    if (characterStats.hp > 0) return;
    if (deathTriggeredRef.current) return;
    deathTriggeredRef.current = true;
    // Apply XP penalty: 20%, floored so level never decreases
    // Apply Doka penalty: 40%, min 0
    setCharacterStats((prev) => {
      const xpLost = Math.floor(prev.exp * 0.2);
      const newExp = Math.max(0, prev.exp - xpLost);
      deathXpLostRef.current = xpLost;
      return { ...prev, exp: newExp };
    });
    const dokaLost = Math.floor(dokaBalance * 0.4);
    const newDoka = Math.max(0, dokaBalance - dokaLost);
    const xpLostAccurate = deathXpLostRef.current;
    setDeathPenalty({ xpLost: xpLostAccurate, dokaLost });
    if (actor) {
      (async () => {
        try {
          await actor.applyRewards(
            BigInt(characterSlot),
            BigInt(0),
            BigInt(-xpLostAccurate),
          );
          await actor.applyRewards(
            BigInt(characterSlot),
            BigInt(-dokaLost),
            BigInt(0),
          );
        } catch (err) {
          console.error("[death-save] failed:", err);
        }
      })();
    }
    onDokaBalanceChange(newDoka);
    // ── UNIFIED CLEANUP on defeat: terminates all timers, AI, VFX, caches
    // DEATH REALM FIX: Use cleanupMap() here (not just cleanupBattle()) so that
    // all particle refs are also fully reset before entering
    // the Death Realm. Without this, stale particle data from the battle map
    // accumulated in refs and caused a crash when transitioning through the Death Realm portal.
    cleanupMap();
    // EXP8: Reset dungeon chain on death — refs only; state setters are redundant
    // since cleanupMap already resets the refs synchronously (M3 FIX).
    dungeonChainActiveRef.current = false;
    dungeonChainDepthRef.current = 0;
    dungeonChainMaxDepthRef.current = 0;
    setInBattle(false);
    setBattleEnemies([]);
    setTurnOrder([]);
    turnOrderRef.current = [];
    setCurrentTurnIndex(0);
    currentTurnIndexRef.current = 0;
    setBattlePhase("player");
    setBattleTurn(0);
    setTurnTimeLeft(30);
    setEnemyHpMap({});
    setEnragedEnemies(new Set());
    enemyTurnInProgressRef.current = false;
    // FIX 5: Tracked Death Realm transition timer — cancelled by cleanupMap so it
    // never fires on a new map if the player clicks a portal immediately after dying.
    if (deathRealmTimerRef.current !== null) {
      clearTimeout(deathRealmTimerRef.current);
      deathRealmTimerRef.current = null;
    }
    // A4e: Explicitly clear DoT effects before the Death Realm timer fires
    activeEffectsRef.current = [];
    setActiveEffects([]);
    deathRealmTimerRef.current = window.setTimeout(() => {
      // RC FIX: No generation check needed — loop runs forever
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      deathRealmTimerRef.current = null;
      try {
        const { map: drMap, spawnPosition: drSpawn } = generateDeathRealmMap();
        currentMapRef.current = drMap;
        setCurrentMap(drMap);
        setPlayerPosition(drSpawn || { x: 2, y: 2 });
        setPlayerView("front");
        // Center camera on player spawn for death realm
        const drScreenPos = gridToScreen(
          (drSpawn || { x: 2, y: 2 }).x,
          (drSpawn || { x: 2, y: 2 }).y,
        );
        const drCenterX = canvasSize.width / 2;
        const drCenterY = canvasSize.height / 2;
        const drCamX = drCenterX - drScreenPos.x;
        const drCamY = drCenterY - drScreenPos.y;
        cameraRef.current = { x: drCamX, y: drCamY };
        targetCameraRef.current = { x: drCamX, y: drCamY };
        cameraVelocityRef.current = { x: 0, y: 0 };
        transitionInProgressRef.current = false;
        setTransitionInProgress(false);
        lastPortalRef.current = null;
        setMapCount((prev) => prev + 1);
        setCharacterStats((prev) => ({
          ...prev,
          // FIX: respawn at 50% HP (consistent with handleRespawn)
          hp: Math.max(
            1,
            Math.floor(100 * (1 + (prev.level - 1) * 0.05) * 0.5),
          ),
        }));
        resetCombatantStore(combatantStoreCtx);
        // Skate-rail system removed
        toast(
          "💀 You have fallen... find a portal to escape the Death Realm.",
          {
            duration: 5000,
            style: {
              background: "#1a0a0a",
              border: "1px solid #8b0000",
              color: "#ffaaaa",
            },
          },
        );
        if (cameraFollowTimerRef.current !== null)
          clearTimeout(cameraFollowTimerRef.current);
        cameraFollowTimerRef.current = window.setTimeout(() => {
          cameraFollowTimerRef.current = null;
          updateCameraToFollowPlayer();
        }, 100);
      } catch (err) {
        console.error("[death] death realm generation failed:", err);
        // Safe fallback: build an all-floor death-realm-like map with one portal
        const safeTiles: TileType[][] = Array(WORLD_GRID_SIZE)
          .fill(null)
          .map(() => Array(WORLD_GRID_SIZE).fill("floor" as TileType));
        safeTiles[4][4] = "portal";
        const fallbackMap: GameMap = {
          id: `map-fallback-${Date.now()}`,
          tiles: safeTiles,
          portals: [{ x: 4, y: 4, color: "blue" as const, animationOffset: 0 }],
          levelZone: { name: "Death Realm", minLevel: 1, maxLevel: 5 },
          tilePatterns: {},
          colorFamily: { r1: 55, g1: 45, b1: 80, r2: 75, g2: 60, b2: 105 },
          wallPalette: ["#3a2a4a", "#4a3a5e"],
          isDeathRealm: true,
          isRestMap: false,
          hazardTiles: new Map(),
          voidTiles: new Map(),
        };
        let fallbackSpawn: PlayerPosition = { x: 1, y: 1 };
        let foundFallback = false;
        for (let fy = 0; fy < safeTiles.length && !foundFallback; fy++) {
          for (
            let fx = 0;
            fx < (safeTiles[fy]?.length ?? 0) && !foundFallback;
            fx++
          ) {
            if ((safeTiles[fy]?.[fx] as string) === "floor") {
              fallbackSpawn = { x: fx, y: fy };
              foundFallback = true;
            }
          }
        }
        currentMapRef.current = fallbackMap;
        setCurrentMap(fallbackMap);
        setPlayerPosition(fallbackSpawn);
        setPlayerView("front");
        const fbScreenPos = gridToScreen(fallbackSpawn.x, fallbackSpawn.y);
        const fbCenterX = canvasSize.width / 2;
        const fbCenterY = canvasSize.height / 2;
        const fbCamX = fbCenterX - fbScreenPos.x;
        const fbCamY = fbCenterY - fbScreenPos.y;
        cameraRef.current = { x: fbCamX, y: fbCamY };
        targetCameraRef.current = { x: fbCamX, y: fbCamY };
        cameraVelocityRef.current = { x: 0, y: 0 };
        transitionInProgressRef.current = false;
        setTransitionInProgress(false);
        lastPortalRef.current = null;
        setMapCount((prev) => prev + 1);
        setCharacterStats((prev) => ({
          ...prev,
          hp: Math.max(
            1,
            Math.floor(100 * (1 + (prev.level - 1) * 0.05) * 0.5),
          ),
        }));
        resetCombatantStore(combatantStoreCtx);
        toast(
          "💀 You have fallen... find a portal to escape the Death Realm.",
          {
            duration: 5000,
            style: {
              background: "#1a0a0a",
              border: "1px solid #8b0000",
              color: "#ffaaaa",
            },
          },
        );
        if (cameraFollowTimerRef.current !== null)
          clearTimeout(cameraFollowTimerRef.current);
        cameraFollowTimerRef.current = window.setTimeout(() => {
          cameraFollowTimerRef.current = null;
          updateCameraToFollowPlayer();
        }, 100);
      }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterStats?.hp ?? 0, inBattle]);

  // Handle respawn — sends player to Death Realm (no enemies, full heal)
  const handleRespawn = useCallback(() => {
    transitionInProgressRef.current = false;
    setShowGameOver(false);
    // ── UNIFIED CLEANUP on respawn: use cleanupMap() (not just cleanupBattle())
    // so all particle refs are also reset before the Death Realm loads.
    cleanupMap();
    setInBattle(false);
    setBattleEnemies([]);
    setTurnOrder([]);
    turnOrderRef.current = [];
    setCurrentTurnIndex(0);
    currentTurnIndexRef.current = 0;
    setBattlePhase("player");
    setBattleTurn(0);
    setTurnTimeLeft(30);
    setEnemyHpMap({});
    setEnragedEnemies(new Set());
    enemyTurnInProgressRef.current = false;

    // Reset character stats with restored HP
    setCharacterStats((prev) => ({
      ...prev,
      // FIX-6: Respawn at 50% max HP (not full HP)
      hp: Math.max(1, Math.floor(100 * (1 + (prev.level - 1) * 0.05) * 0.5)),
      ap: 4,
      mp: 3,
    }));

    // Generate death realm map
    let newMap: GameMap;
    let spawnPosition: PlayerPosition;
    try {
      const result = generateDeathRealmMap();
      newMap = result.map;
      spawnPosition = result.spawnPosition;
    } catch (err) {
      console.error(
        "[handleRespawn] generateDeathRealmMap failed, using safe fallback:",
        err,
      );
      // Safe fallback: all-floor death-realm-like map with one portal
      const safeTiles: TileType[][] = Array(WORLD_GRID_SIZE)
        .fill(null)
        .map(() => Array(WORLD_GRID_SIZE).fill("floor" as TileType));
      safeTiles[4][4] = "portal";
      newMap = {
        id: `map-fallback-${Date.now()}`,
        tiles: safeTiles,
        portals: [{ x: 4, y: 4, color: "blue" as const, animationOffset: 0 }],
        levelZone: { name: "Death Realm", minLevel: 1, maxLevel: 5 },
        tilePatterns: {},
        colorFamily: { r1: 55, g1: 45, b1: 80, r2: 75, g2: 60, b2: 105 },
        wallPalette: ["#3a2a4a", "#4a3a5e"],
        isDeathRealm: true,
        isRestMap: false,
        hazardTiles: new Map(),
        voidTiles: new Map(),
      };
      // Dynamic fallback: find first walkable floor tile
      let foundFallback = false;
      for (let fy = 0; fy < safeTiles.length && !foundFallback; fy++) {
        for (
          let fx = 0;
          fx < (safeTiles[fy]?.length ?? 0) && !foundFallback;
          fx++
        ) {
          if ((safeTiles[fy]?.[fx] as string) === "floor") {
            spawnPosition = { x: fx, y: fy };
            foundFallback = true;
          }
        }
      }
      if (!foundFallback) spawnPosition = { x: 1, y: 1 }; // absolute last resort
    }

    // Use a small delay to ensure React state has fully settled before rendering new map
    if (respawnTimerRef.current !== null) clearTimeout(respawnTimerRef.current);
    respawnTimerRef.current = window.setTimeout(() => {
      // RC FIX: No generation check needed — loop runs forever
      respawnTimerRef.current = null;
      currentMapRef.current = newMap;
      setCurrentMap(newMap);
      setPlayerPosition(spawnPosition);
      setPlayerView("front");
      cameraRef.current = { x: 0, y: 0 };
      targetCameraRef.current = { x: 0, y: 0 };
      cameraVelocityRef.current = { x: 0, y: 0 };
      transitionInProgressRef.current = false;
      setTransitionInProgress(false);
      lastPortalRef.current = null;
      setMapCount((prev) => prev + 1);

      // Death Realm: no enemies, eerie silence
      resetCombatantStore(combatantStoreCtx);

      // Skate-rail system removed

      // Update camera to follow player after a tick
      if (cameraFollowTimerRef.current !== null)
        clearTimeout(cameraFollowTimerRef.current);
      cameraFollowTimerRef.current = window.setTimeout(() => {
        cameraFollowTimerRef.current = null;
        updateCameraToFollowPlayer();
      }, 100);
    }, 100);
  }, [
    cleanupMap,
    generateDeathRealmMap,
    combatantStoreCtx,

    updateCameraToFollowPlayer,
    setTransitionInProgress,
  ]);

  // Initialize first map - FIXED: Only run once on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time init guard via isInitializedRef
  useEffect(() => {
    if (isInitializedRef.current) return;
    if (!tierConfigLoaded) return;
    if (!character) return;

    isInitializedRef.current = true;

    if (process.env.NODE_ENV === "development") {
      console.log("Initializing world exploration...");
    }

    const { map, spawnPosition } = generateRandomMap();
    currentMapRef.current = map;
    setCurrentMap(map);
    const newEnemies = generateEnemies(
      map.tiles,
      map.portals,
      0,
      map.voidTiles,
    );
    // Section 6: ensure all spawns + player + portal are mutually reachable
    const _enemySpawns = newEnemies.map((e) => ({ x: e.x, y: e.y }));
    const _portal = map.portals?.[0];
    if (_portal) {
      const { tiles: _tiles, spawns: _spawns } = ensureReachability(
        map.tiles as string[][],
        map.voidTiles,
        _enemySpawns,
        spawnPosition,
        _portal,
        WORLD_GRID_SIZE,
        WORLD_GRID_SIZE,
      );
      map.tiles = _tiles as typeof map.tiles;
      newEnemies.forEach((e, i) => {
        if (_spawns[i]) {
          e.x = _spawns[i].x;
          e.y = _spawns[i].y;
        }
      });
    }
    syncCombatants(combatantStoreCtx, newEnemies, { resetBattle: true });
    // Weather effects removed

    // Skate-rail system removed

    // Center camera on player initially with smooth transition
    const initCamTimer = setTimeout(() => {
      updateCameraToFollowPlayer();
    }, 200);
    if (process.env.NODE_ENV === "development") {
      console.log("World exploration initialized successfully");
    }
    return () => clearTimeout(initCamTimer);
  }, [tierConfigLoaded]);

  // Start animation loop + watchdog
  useEffect(() => {
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    // RC FIX: Watchdog simplified — only restarts if no frame for >2s.
    // The loop runs forever; this is a safety net for genuine hangs.
    watchdogIntervalRef.current = setInterval(() => {
      const staleness = performance.now() - lastFrameTimeRef.current;
      if (staleness > 2000) {
        console.warn(
          "[GameLoop] Watchdog: loop appears dead (",
          staleness,
          "ms), restarting",
        );
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        lastFrameTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animateRef.current);
      }
    }, 1000);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (watchdogIntervalRef.current) {
        clearInterval(watchdogIntervalRef.current);
        watchdogIntervalRef.current = null;
      }
    };
  }, [animate]); // RC FIX: include animate in deps — it's a stable useCallback([]) reference, so effect still runs once

  // Canvas context-lost / context-restored handlers
  // When the GPU is briefly reclaimed by the OS (e.g. tab backgrounded heavily),
  // the 2D context can be lost. We cancel the RAF loop on loss and restart it on
  // restore so the game never stays black after a context reset.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (e: Event) => {
      e.preventDefault(); // Required to allow context restoration
      console.warn(
        "[Canvas] Context lost — pausing render loop until restored",
      );
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };

    const handleContextRestored = () => {
      console.warn("[Canvas] Context restored — restarting render loop");
      // M-2: Re-apply canvas physical dimensions before restarting the loop.
      // When context is lost and restored the canvas can come back at zero size,
      // causing the render guard to early-return every frame (stays black).
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx2 = canvas.getContext("2d");
      if (ctx2) {
        ctx2.setTransform(1, 0, 0, 1, 0, 0);
        ctx2.scale(dpr, dpr);
      }
      lastFrameTimeRef.current = Date.now();
      // RC FIX: No generation bump or manual restart — the single RAF loop continues
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    canvas.addEventListener("contextlost", handleContextLost as EventListener);
    canvas.addEventListener(
      "contextrestored",
      handleContextRestored as EventListener,
    );

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      canvas.removeEventListener(
        "contextlost",
        handleContextLost as EventListener,
      );
      canvas.removeEventListener(
        "contextrestored",
        handleContextRestored as EventListener,
      );
    };
  }, []);
  // Check for battle trigger when player moves
  useEffect(() => {
    if (!inBattle) checkBattleTrigger();
  }, [checkBattleTrigger, inBattle]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: stable callback
  useEffect(() => {
    if (
      inBattle &&
      combatantStoreCtx.battleStartIds.size > 0 &&
      activeHostilesRemaining(combatantsRef.current) === 0
    ) {
      dumpStateSync("victory-gate", combatantStoreCtx);
      console.log("[VICTORY-GATE]", {
        hostiles: activeHostilesRemaining(combatantsRef.current),
        battleStartIds: combatantStoreCtx.battleStartIds.size,
        inBattle,
      });
      // S2: When the last enemy on a run map dies, announce that the way
      // forward is now open. Only fires inside an active dungeon or boss-rush
      // run — free exploration has no progression lock to lift.
      const _s2RunMode: RunMode = bossRushActiveRef.current
        ? "bossRush"
        : dungeonChainActiveRef.current
          ? "dungeon"
          : "none";
      if (_s2RunMode !== "none") {
        logBattleEntry(
          "✦ The way forward opens... the portal hums to life.",
          "#d4af37",
        );
      }
      // XP = sum of (enemy.level * 20) for each defeated enemy.
      // Filter out LIVING summons (isSummon && hp>0) so a surviving summon is
      // NOT counted as a defeated enemy — keeps expGained from being inflated
      // by the summon's level. A dead summon (killed during battle) still counts.
      const defeatedList = deriveBattleEnemies(combatantStoreCtx)
        .filter((e) => !(e.isSummon && e.hp > 0))
        .map((e) => ({
          name: e.pieceType ?? "unknown",
          level: e.level ?? 1,
        }));
      const expGained =
        defeatedList.reduce((sum, e) => sum + Number(e.level) * 20, 0) ||
        Number(characterStats.level) * 20;
      if (bossRushActiveRef.current) {
        handleBossRushRoomClear();
      } else {
        handleBattleEnd(true, expGained, battleHitsRef.current, defeatedList);
      }
    }
  }, [inBattle, enemies]);

  // Canvas container ref for ResizeObserver
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  // Handle container resize — canvas fills all available space with DPR scaling
  useEffect(() => {
    const area = canvasAreaRef.current;
    if (!area) return;

    // Handle container resize — canvas CSS size == logical size, no transform
    const applySize = (cssW: number, cssH: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      // Physical pixel resolution
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      // CSS display size matches layout exactly — no scale distortion
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      // Scale context so drawing uses logical CSS pixels
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        canvasInitializedRef.current = true;
      }
      setCanvasSize({ width: Math.floor(cssW), height: Math.floor(cssH) });
    };

    // Debounced + render-safe resize handler.
    // canvas.width= assignment CLEARS the entire 2D context — if it fires
    // mid-frame (inside animate()), we get a black frame. The debounce coalesces
    // rapid ResizeObserver entries; the isRenderingRef guard defers the apply
    // by one rAF if we happen to land exactly on a rendering frame.
    const scheduleApplySize = (cssW: number, cssH: number) => {
      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current);
      resizeDebounceRef.current = setTimeout(() => {
        resizeDebounceRef.current = null;
        if (isRenderingRef.current) {
          // We're mid-frame — defer by one rAF so we don't clear mid-render
          requestAnimationFrame(() => applySize(cssW, cssH));
        } else {
          applySize(cssW, cssH);
        }
      }, 50);
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          scheduleApplySize(width, height);
        }
      }
    });
    observer.observe(area);
    // Set initial size (no debounce needed — loop isn't running yet)
    const rect = area.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      applySize(rect.width, rect.height);
    }
    return () => {
      observer.disconnect();
      if (resizeDebounceRef.current) {
        clearTimeout(resizeDebounceRef.current);
        resizeDebounceRef.current = null;
      }
    };
  }, []);

  // Update camera when canvas size changes
  useEffect(() => {
    updateCameraToFollowPlayer();
  }, [updateCameraToFollowPlayer]);

  // Advance to next combatant in turn order and reset timer
  // biome-ignore lint/correctness/useExhaustiveDependencies: flushSync-wrapped advanceTurn intentionally captures stable refs
  const advanceTurn = useCallback(() => {
    flushSync(() => {
      // FIX 1.1: Bump the battle-world version at the top of advanceTurn (after
      // flushSync open, before turn-order advancement) so the spell-range cache
      // key changes every turn and a stale tile set can never gate a click.
      battleWorldVersionRef.current += 1;
      // H3: A real advanceTurn resets the idle counter (the turn moved forward normally).
      idleTurnCountRef.current = 0;
      // Time Warp: 15s timer instead of 30
      const timerDuration = isTimeWarp ? 15 : 30;
      setTurnTimeLeft(timerDuration);
      // Summon lifespan: decrement, kill expired summons, and atomically sync
      // the turn queue (state + both refs + index math) BEFORE the turn-index
      // advance below.
      //
      // SECTION 2 FIX — "once when the summon's own turn begins":
      // The decrement only fires for the summon whose turn is ABOUT to start
      // (the next combatant in the turn order). When the next combatant is not
      // a summon, we pass null and this becomes a cleanup-only pass (no
      // decrement, but any summon already at 0 is still removed). This makes a
      // summon's lifespan decrement exactly once per ROUND (on its own turn),
      // not once per combatant turn — so a lifespan-4 summon acts on ~4 of its
      // own turns before fading.
      //
      // The next combatant is computed from the LIVE refs here (BEFORE the
      // setTurnOrder/setCurrentTurnIndex advance below) so the decrement
      // targets the same summon the advance will dispatch to. Running this
      // BEFORE the `(prevIdx + 1) % prevOrder.length` advance also guarantees
      // the advance always runs against a turnOrder that no longer contains
      // faded summons — closing the ghost-slot race where currentTurnIndexRef
      // could point at a removed combatant. See syncExpiredSummonsFromTurnQueue
      // in engine/summonIntegration.ts for the full atomic contract.
      const _order = turnOrderRef.current;
      const _nextIdx =
        _order.length > 0
          ? (currentTurnIndexRef.current + 1) % _order.length
          : 0;
      const _nextCombatant = _order[_nextIdx];
      const _activeSummonId = _nextCombatant?.isSummon
        ? _nextCombatant.id
        : null;
      syncExpiredSummonsFromTurnQueue(
        enemies,
        turnOrderRef.current,
        turnOrderRef,
        currentTurnIndexRef,
        setTurnOrder,
        setEnemies,
        logBattleEntry,
        _activeSummonId,
      );
      setTurnOrder((prevOrder) => {
        if (prevOrder.length === 0) return prevOrder;
        // H7: ref is set to the new computed order BEFORE the state update so AI reads a fresh value
        setCurrentTurnIndex((prevIdx) => {
          const nextIdx = (prevIdx + 1) % prevOrder.length;
          currentTurnIndexRef.current = nextIdx;
          const nextCombatant = prevOrder[nextIdx];
          if (nextCombatant.type === "player") {
            logDebugInfo("TURN", "dispatch", {
              entryId: nextCombatant.id,
              side: nextCombatant.side,
              isSummon: false,
              round: battleTurn,
              idx: nextIdx,
              route: "player",
            });
            // M6: HP guard — if player is already dead, skip turn setup and call death handler
            if (characterStats.hp <= 0) {
              activeEffectsRef.current = activeEffectsRef.current.filter(
                (e) => e.targetId !== "player",
              );
              setActiveEffects([...activeEffectsRef.current]);
              _handlePlayerDeath();
              return nextIdx;
            }
            setBattlePhase("player");
            // Process player's active effects (DoT, duration decrement)
            mapModifierRegistry.applyTurnStart(
              combatantsRef.current.find((c) => (c as any).id === "player") ||
                combatantsRef.current[0],
              activeMapModifierTypes,
              {
                log: (msg: string) => logDebugInfo("MODIFIER", msg),
                rng: Math.random,
              },
            );
            processActiveEffects("player");
            spellCooldownsRef.current.forEach((cd, id) => {
              if (cd > 1) spellCooldownsRef.current.set(id, cd - 1);
              else spellCooldownsRef.current.delete(id);
            });
            setSpellCooldownVersion((v) => v + 1);
            // EXP6: Decrement fury turns at start of player's turn
            if (furyRef.current.turnsLeft > 0) {
              furyRef.current.turnsLeft -= 1;
              if (furyRef.current.turnsLeft === 0)
                logBattleEntry("💢 Fury Potion wore off.", "#f97316");
            }
            // M5: Invalidate spell range cache on new player turn
            spellRangeCacheRef.current.clear();
            // H3: Tick barrier tiles — decrement and remove expired ones
            {
              const updatedBarriers = new Map<string, number>();
              for (const [bKey, bTurns] of barrierTilesRef.current.entries()) {
                if (bTurns - 1 > 0) {
                  updatedBarriers.set(bKey, bTurns - 1);
                } else {
                  logBattleEntry(`Barrier at ${bKey} has faded.`, "#818cf8");
                }
              }
              barrierTilesRef.current = updatedBarriers;
            }
            // Plague Zone: all units lose 2 HP at start of each turn
            if (isPlagueZone) {
              setCharacterStats((s) => ({ ...s, hp: Math.max(0, s.hp - 2) }));
              logBattleEntry("Plague Zone deals 2 damage to you!", "#a855f7");
            }
            // Reset the AP-debuff flag at start of player's turn
            playerApWasDebuffedRef.current = false;
            // Per-turn restore now reads from the canonical progression formula
            // (getPlayerBaseStats) + active-effect modifiers, mirroring the
            // restoreApMp callback and battle-start init. The formula is the
            // floor (PLAYER_BASE_AP=8, PLAYER_BASE_MP=4) and wins on divergence
            // with persisted characterStats.ap/mp — eliminating the 10/4 flapping.
            const _baseStats = getPlayerBaseStats(
              characterStats.level,
              levelUpConfig,
            );
            setCurrentBattleAp((prev) => {
              void prev;
              // Arcane Surge: spells cost 1 less AP, which is applied at cast time not here
              // Apply AP buffs/debuffs from active effects
              const apMod = getStatModifier(
                "player",
                "ap",
                activeEffectsRef.current,
              );
              return Math.max(0, _baseStats.ap + apMod);
            });
            setCurrentBattleMp((prev) => {
              void prev;
              const mpMod = getStatModifier(
                "player",
                "mp",
                activeEffectsRef.current,
              );
              return Math.max(0, _baseStats.mp + mpMod);
            });
            setBattleActionMode("walk");
            selectedSpellIdRef.current = null;
            setSpellSelectionVersion((v) => v + 1);
            setBattleTurn((t) => t + 1);
            challengeTurnCountRef.current += 1;
            challengeMaxApThisTurnRef.current = 0;
            // Void Rift: pick a new random walkable void tile each turn
            if (isVoidRift) {
              setCurrentMap((cm) => {
                if (!cm) return cm;
                const walkable: { x: number; y: number }[] = [];
                for (let gy = 0; gy < WORLD_GRID_SIZE; gy++) {
                  for (let gx = 0; gx < WORLD_GRID_SIZE; gx++) {
                    if (cm.tiles[gy][gx] === "floor")
                      walkable.push({ x: gx, y: gy });
                  }
                }
                if (walkable.length > 0) {
                  const pick =
                    walkable[Math.floor(Math.random() * walkable.length)];
                  setVoidRiftTile(pick);
                  logBattleEntry(
                    `Void Rift warps tile (${pick.x},${pick.y})! Avoid it!`,
                    "#a855f7",
                  );
                }
                return cm;
              });
            } else {
              setVoidRiftTile(null);
            }
            logBattleEntry("Your turn", "#ffffff");
          } else if (nextCombatant.isSummon) {
            logDebugInfo("TURN", "dispatch", {
              entryId: nextCombatant.id,
              side: nextCombatant.side,
              isSummon: true,
              round: battleTurn,
              idx: nextIdx,
              route: "summon-ai",
            });
            setBattlePhase("enemy");
          } else {
            logDebugInfo("TURN", "dispatch", {
              entryId: nextCombatant.id,
              side: nextCombatant.side,
              isSummon: false,
              round: battleTurn,
              idx: nextIdx,
              route: "enemy-ai",
            });
            setBattlePhase("enemy");
            // Process this enemy's active effects
            mapModifierRegistry.applyTurnStart(
              nextCombatant,
              activeMapModifierTypes,
              {
                log: (msg: string) => logDebugInfo("MODIFIER", msg),
                rng: Math.random,
              },
            );
            processActiveEffects(nextCombatant.id);
            // Plague Zone on enemies too
            if (isPlagueZone) {
              setEnemyHpMap((prev) => {
                const cur = prev[nextCombatant.id] ?? 0;
                const newHp = Math.max(0, cur - 2);
                return { ...prev, [nextCombatant.id]: newHp };
              });
              logBattleEntry(
                `Plague Zone deals 2 damage to ${nextCombatant.name}!`,
                "#a855f7",
              );
            }
            logBattleEntry(`${nextCombatant.name}'s turn`, "#ffffff");
          }
          return nextIdx;
        });
        if (currentTurnIndexRef.current === 0) {
          return mapModifierRegistry.applyTurnOrderSort(
            prevOrder,
            activeMapModifierTypes,
          );
        }
        return prevOrder;
      });
    }); // end flushSync
  }, [
    characterStats.level,
    logBattleEntry,
    processActiveEffects,
    getStatModifier,
    isTimeWarp,
    isPlagueZone,
    isVoidRift,
  ]);

  // Store advanceTurn in a ref so it's never stale inside setTimeout callbacks
  // FIX-H1: Declared BEFORE turn timer effect so the timer captures the ref, not a stale closure
  const advanceTurnRef = useRef(advanceTurn);
  useEffect(() => {
    advanceTurnRef.current = advanceTurn;
  }, [advanceTurn]);

  // ─── 30-second turn timer (runs for both player and enemy turns) ───────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (!inBattle) return;
    // Clear any previously running interval before creating a new one (prevents stacking)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    // FIX-1: Increment generation counter so any stale interval callback from
    // the previous render cycle becomes an instant no-op.
    turnTimerGenerationRef.current += 1;
    const myGeneration = turnTimerGenerationRef.current;
    // Reset timer whenever the active turn changes (Time Warp: 15s instead of 30s)
    const timerStart = isTimeWarp ? 15 : 30;
    setTurnTimeLeft(timerStart);
    timerIntervalRef.current = setInterval(() => {
      // FIX-1: If the generation has moved on (effect re-ran), this stale
      // interval must not fire advanceTurn on outdated state.
      if (turnTimerGenerationRef.current !== myGeneration) return;
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          // FIX-1 & FIX-5: Use the ref so we always call the latest version of
          // advanceTurn (avoids stale closure over characterStats / activeEffects).
          advanceTurnRef.current();
          return timerStart;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [inBattle, currentTurnIndex, isTimeWarp]);

  // ─── Enemy AI turn: spells + movement with HP-based strategy ────────────────

  // NOTE: battleEnemiesRef / enemiesRef are now owned by the combatant store
  // (combatantStoreCtx). The previous useEffect mirrors here clobbered the
  // store's atomic assignments and re-introduced desync — they were removed
  // as part of the store-unification pass.

  // biome-ignore lint/correctness/useExhaustiveDependencies: stable refs
  useEffect(() => {
    if (!inBattle || battlePhase !== "enemy" || enemyTurnInProgressRef.current)
      return;
    if (!battleReadyRef.current) return;
    // H2: Read from the ref mirror so we always get the latest turnOrder
    // even if the React state closure captured a stale snapshot.
    const currentCombatant =
      turnOrderRef.current[currentTurnIndex] ?? turnOrder[currentTurnIndex];
    if (!currentCombatant || currentCombatant.type !== "enemy") return;
    const enemyId = currentCombatant.id;
    enemyTurnInProgressRef.current = true;
    // E2: Clear per-turn path cache so this enemy's computations are fresh.
    enemyPathCacheRef.current.clear();
    // FIX #15: Capture AI generation at the start of this enemy turn.
    // Each setTimeout callback checks this; if the generation has moved on
    // (battle ended / new battle started), the callback aborts immediately.
    const myAIGeneration = aiGenerationRef.current;
    // FIX-2: Capture session version so that post-error-reload stale callbacks
    // abort immediately even if aiGenerationRef happens to match by coincidence.
    const mySessionVersion = sessionVersionRef.current;
    // NOTE: Do NOT reset enemyTurnAbortRef here — rely only on aiGenerationRef to gate stale callbacks.
    // Resetting it here creates a race where a concurrent battle-end can be overridden.
    // H2 fix: declare watchdog first so timeout callback can reference it (forward reference fix)
    let watchdog: ReturnType<typeof setTimeout>;
    const timeout = setTimeout(() => {
      // Read from enemiesRef.current (fresh mirror) — the dep array omits `enemies` to avoid double-firing.
      const summonEnemy = enemiesRef.current.find((e: any) => e.id === enemyId);
      if (summonEnemy?.isSummon && summonEnemy.side === "player") {
        // Reset AP/MP for the summon's turn.
        summonEnemy.currentAp = summonEnemy.maxAp ?? 2;
        summonEnemy.currentMp = summonEnemy.maxMp ?? 2;
        // Build a real SpellContext reusing the player's damage/heal/effect/spawn paths.
        const summonCtx = buildSpellContext({
          rng: Math.random,
          log: (msg: string, color?: string, isSummon?: boolean) => {
            if (msg !== "") logBattleEntry(msg, color, isSummon);
          },
          getEffectiveStat: (combatantId: string, stat: string) =>
            getStatModifier(combatantId, stat, activeEffectsRef.current),
          dealDamage: (
            targetId: string,
            amount: number,
            _opts?: { isPhysical?: boolean },
          ) => {
            enemyTakesDamage(targetId, amount, "player", "", false);
            return amount;
          },
          heal: (combatantId: string, amount: number) => {
            if (combatantId === "player" || combatantId === "__player__") {
              setCharacterStats((prev: any) => ({
                ...prev,
                hp: Math.min(maxHp, prev.hp + amount),
              }));
              effectsManagerRef.current.spawnDamageNumber(0, 0, amount, "heal");
            }
          },
          applyEffect: (effect: ActiveEffectLike) => {
            applyActiveEffect(effect as unknown as ActiveEffect);
          },
          placeBarrier: (cell: { x: number; y: number }, turns: number) => {
            barrierTilesRef.current.set(`${cell.x},${cell.y}`, turns);
          },
          spawnUnit: (
            cell: { x: number; y: number },
            unitDef: SummonUnitDef,
            _side: Side,
            lifespan: number,
            _spell: any,
          ) => {
            const { summon, turnOrderEntry } = spawnSummonUnit(
              cell,
              {
                id: `summon-spell-${unitDef.pieceType}`,
                name: `Summon ${unitDef.pieceType}`,
                summonUnitDef: unitDef,
                summonLifespan: lifespan,
                summonAI: unitDef.pieceType,
              },
              "player",
              characterStats.level,
              logBattleEntry,
              computeEnemyStats as (
                level: number,
                pieceType: string,
                seedKey: string,
              ) => any,
              0,
              // OccupancyContext so spawnSummonUnit can fall back to the
              // nearest free cell when the requested cell is occupied.
              {
                tiles: (currentMap?.tiles ?? []).map((row: any) =>
                  (row ?? []).map((t: any) => t !== "wall"),
                ),
                barriers: new Set(barrierTilesRef.current.keys()),
                voidTiles: currentMap?.voidTiles ?? new Set<string>(),
                portals: new Set(
                  (currentMap?.portals ?? []).map((p: any) => `${p.x},${p.y}`),
                ),
                isOccupied: (c: { x: number; y: number }) =>
                  enemiesRef.current.some(
                    (e: any) => e.x === c.x && e.y === c.y,
                  ) ||
                  (playerPosition.x === c.x && playerPosition.y === c.y),
              } satisfies OccupancyContext,
            );
            const { enemies: newEnemies, turnOrder: newTurnOrder } =
              applySummonResult(
                summon,
                turnOrderEntry,
                "player",
                enemiesRef.current,
                turnOrderRef.current,
              );
            syncCombatants(combatantStoreCtx, newEnemies);
            setTurnOrder(newTurnOrder);
            turnOrderRef.current = newTurnOrder;
          },
          isCellFree: (cell: { x: number; y: number }) =>
            !getLiveCombatants(combatantStoreCtx).some(
              (e: any) => e.x === cell.x && e.y === cell.y,
            ) && !(playerPosition.x === cell.x && playerPosition.y === cell.y),
          getCombatantAt: (cell: { x: number; y: number }) => {
            const e = enemiesRef.current.find(
              (en: any) => en.x === cell.x && en.y === cell.y,
            );
            if (e) return { id: e.id, side: "enemy" as Side };
            if (playerPosition.x === cell.x && playerPosition.y === cell.y)
              return { id: "__player__", side: "player" as Side };
            return null;
          },
          spawnEnemySummon: (cell: { x: number; y: number }, spell: any) => {
            // Self-assign to the ref so the enemy turn executor closure
            // (a different scope from this SpellContext builder) can invoke
            // the latest version of this callback when a summoner enemy
            // decides to cast a summon spell.
            spawnEnemySummonRef.current = (
              c: { x: number; y: number },
              s: any,
            ) => {
              const unitDef: SummonUnitDef | undefined =
                s?.summonUnitDef ??
                starterSpells.find((sp: any) => sp.id === s?.id)?.summonUnitDef;
              if (!unitDef) return;
              const { summon, turnOrderEntry } = spawnSummonUnit(
                c,
                {
                  id: `enemy-summon-${unitDef.pieceType}`,
                  name: `Enemy Summon ${unitDef.pieceType}`,
                  summonUnitDef: unitDef,
                  summonLifespan: 0,
                  summonAI: unitDef.pieceType,
                },
                "enemy",
                characterStats.level,
                logBattleEntry,
                computeEnemyStats as (
                  level: number,
                  pieceType: string,
                  seedKey: string,
                ) => any,
                0,
                {
                  tiles: (currentMap?.tiles ?? []).map((row: any) =>
                    (row ?? []).map((t: any) => t !== "wall"),
                  ),
                  barriers: new Set(barrierTilesRef.current.keys()),
                  voidTiles: currentMap?.voidTiles ?? new Set<string>(),
                  portals: new Set(
                    (currentMap?.portals ?? []).map(
                      (p: any) => `${p.x},${p.y}`,
                    ),
                  ),
                  isOccupied: (oc: { x: number; y: number }) =>
                    enemiesRef.current.some(
                      (e: any) => e.x === oc.x && e.y === oc.y,
                    ) ||
                    (playerPosition.x === oc.x && playerPosition.y === oc.y),
                } satisfies OccupancyContext,
              );
              const { enemies: newEnemies, turnOrder: newTurnOrder } =
                applySummonResult(
                  summon,
                  turnOrderEntry,
                  "enemy",
                  enemiesRef.current,
                  turnOrderRef.current,
                );
              syncCombatants(combatantStoreCtx, newEnemies, {
                resetBattle: true,
              });
              setTurnOrder(newTurnOrder);
              turnOrderRef.current = newTurnOrder;
            };
            // Invoke the same logic inline for the SpellContext caller.
            const unitDef: SummonUnitDef | undefined =
              spell?.summonUnitDef ??
              starterSpells.find((s: any) => s.id === spell?.id)?.summonUnitDef;
            if (!unitDef) return;
            const { summon, turnOrderEntry } = spawnSummonUnit(
              cell,
              {
                id: `enemy-summon-${unitDef.pieceType}`,
                name: `Enemy Summon ${unitDef.pieceType}`,
                summonUnitDef: unitDef,
                summonLifespan: 0,
                summonAI: unitDef.pieceType,
              },
              "enemy",
              characterStats.level,
              logBattleEntry,
              computeEnemyStats as (
                level: number,
                pieceType: string,
                seedKey: string,
              ) => any,
              0,
              {
                tiles: (currentMap?.tiles ?? []).map((row: any) =>
                  (row ?? []).map((t: any) => t !== "wall"),
                ),
                barriers: new Set(barrierTilesRef.current.keys()),
                voidTiles: currentMap?.voidTiles ?? new Set<string>(),
                portals: new Set(
                  (currentMap?.portals ?? []).map((p: any) => `${p.x},${p.y}`),
                ),
                isOccupied: (c: { x: number; y: number }) =>
                  enemiesRef.current.some(
                    (e: any) => e.x === c.x && e.y === c.y,
                  ) ||
                  (playerPosition.x === c.x && playerPosition.y === c.y),
              } satisfies OccupancyContext,
            );
            const { enemies: newEnemies, turnOrder: newTurnOrder } =
              applySummonResult(
                summon,
                turnOrderEntry,
                "enemy",
                enemiesRef.current,
                turnOrderRef.current,
              );
            syncCombatants(combatantStoreCtx, newEnemies);
            setTurnOrder(newTurnOrder);
            turnOrderRef.current = newTurnOrder;
          },
        });
        // Build AI context for the summon (first-class AI combatant via decideSummonAction).
        const summonCombatants = enemiesRef.current
          .filter((e: any) => e.id !== enemyId)
          .map((e: any) => ({
            id: e.id,
            name: e.pieceType,
            side: (e.isSummon && e.side === "player" ? "player" : "enemy") as
              | "player"
              | "enemy",
            isSummon: e.isSummon,
            summonAI: e.summonAI,
            x: e.x,
            y: e.y,
            hp: e.hp,
            maxHp: e.maxHp,
            level: e.level,
          }));
        summonCombatants.push({
          id: "player",
          name: "player",
          side: "player" as "player" | "enemy",
          isSummon: false,
          summonAI: undefined,
          x: playerPosition.x,
          y: playerPosition.y,
          hp: characterStats.hp,
          maxHp: maxHp,
          level: characterStats.level,
        });
        const aiGrid: boolean[][] = (currentMap?.tiles ?? []).map((row: any) =>
          (row ?? []).map((t: any) => t !== "wall"),
        );
        const aiOccupied = new Set<string>();
        const aiBarriers = new Set<string>(barrierTilesRef.current.keys());
        const aiPortals = new Set<string>(
          (currentMap?.portals ?? []).map((p: any) => `${p.x},${p.y}`),
        );
        const aiVoid = currentMap?.voidTiles ?? new Set<string>();
        const aiHazards = currentMap?.hazardTiles ?? new Map<string, string>();
        const aiCtx: DecideEnemyContext = {
          enemy: summonEnemy,
          combatants: summonCombatants,
          grid: aiGrid,
          occupied: aiOccupied,
          barriers: aiBarriers,
          portals: aiPortals,
          voidTiles: aiVoid,
          hazardTiles: aiHazards,
          availableSpells: summonEnemy.spells ?? [],
          assignedSpells: summonEnemy.spells ?? [],
          battleTurn,
          allyCount: summonCombatants.filter((c: any) => c.side === "player")
            .length,
          enemyCount: summonCombatants.filter((c: any) => c.side === "enemy")
            .length,
          enrageMultiplier: 1,
          isSlimeFlood: isSlimeFloodRef.current,
          rng: Math.random,
          getEffectiveStat: (cid: string, stat: string) =>
            getStatModifier(cid, stat, activeEffectsRef.current) as number,
          calcScaledDamage,
          hasLineOfSight: (from: AICell, to: AICell) => {
            const dx = Math.abs(to.x - from.x);
            const dy = Math.abs(to.y - from.y);
            const sx = from.x < to.x ? 1 : -1;
            const sy = from.y < to.y ? 1 : -1;
            let err = dx - dy;
            let cx = from.x;
            let cy = from.y;
            while (!(cx === to.x && cy === to.y)) {
              if (
                !(cx === from.x && cy === from.y) &&
                aiBarriers.has(`${cx},${cy}`)
              )
                return false;
              const e2 = 2 * err;
              if (e2 > -dy) {
                err -= dy;
                cx += sx;
              }
              if (e2 < dx) {
                err += dx;
                cy += sy;
              }
            }
            return true;
          },
          log: (msg: string, color?: string) =>
            summonCtx.log(msg, color ?? "#a78bfa", true),
          focusTargetId: focusTargetRef.current,
          setFocusTargetId: (id: string | null) => {
            focusTargetRef.current = id;
          },
          focusAlreadySet: focusTurnRef.current === battleTurn,
          markFocusSet: () => {
            focusTurnRef.current = battleTurn;
          },
        };
        const action = decideSummonAction(summonEnemy, aiCtx);
        // Apply the action via the shared summon executor (engine/summonExecutor).
        // Reuse the OccupancyContext built above for spawnSummonUnit so movement
        // validation shares the same occupancy source as spawn fallback.
        const summonOccupancyCtx: OccupancyContext = {
          tiles: aiGrid,
          barriers: aiBarriers,
          voidTiles: aiVoid,
          portals: aiPortals,
          isOccupied: (c: { x: number; y: number }) =>
            enemiesRef.current.some((e: any) => e.x === c.x && e.y === c.y) ||
            (playerPosition.x === c.x && playerPosition.y === c.y),
        };
        const executorHelpers: SummonExecutorHelpers = {
          calcScaledDamage,
          occupancyCtx: summonOccupancyCtx,
          worldGridSize: WORLD_GRID_SIZE,
          mpCostPerTile: 1,
          meleeApCost: 1,
          getEnemyById: (id: string) =>
            enemiesRef.current.find((e: any) => e.id === id),
          getAoEVictims: (primaryId: string, blastR: number) => {
            const primary = enemiesRef.current.find(
              (e: any) => e.id === primaryId,
            );
            if (!primary) return [];
            return enemiesRef.current.filter((e: any) => {
              if (e.id === primaryId) return false;
              if (e.side === summonEnemy.side) return false;
              const dx = Math.abs((e.x ?? 0) - (primary.x ?? 0));
              const dy = Math.abs((e.y ?? 0) - (primary.y ?? 0));
              return Math.max(dx, dy) <= blastR;
            });
          },
        };
        const execResult = executeSummonAction(
          action,
          summonEnemy,
          summonCtx,
          executorHelpers,
        );
        // Apply the executor's returned state via the combatant store so the
        // ref mirrors (enemiesRef/battleEnemiesRef) stay atomically in sync.
        // Set AP/MP directly on the summon object (matching the pattern at
        // lines 11166-11167) — updateCombatant's patch is Partial<Combatant>
        // and does not accept currentAp/currentMp.
        summonEnemy.currentAp = execResult.currentAp;
        summonEnemy.currentMp = execResult.currentMp;
        updateCombatant(combatantStoreCtx, enemyId, {
          x: execResult.newPosition.x,
          y: execResult.newPosition.y,
          hp: execResult.hp,
        });
        // Always advance the turn — no stalls.
        // FIX #1 (router stall): reset enemyTurnInProgressRef so the enemy-phase
        // useEffect gate (line ~10639) does not early-return on the next
        // enemy/summon turn. Every other branch in this pipeline resets this ref;
        // the summon branch was the only one that forgot, stalling all turns
        // after the first summon turn.
        enemyTurnInProgressRef.current = false;
        setTimeout(() => advanceTurnRef.current(), 600);
        return;
      }
      if (enemyTurnAbortRef.current) {
        clearTimeout(watchdog);
        pendingTimeoutsRef.current.delete(watchdog);
        enemyTurnInProgressRef.current = false;
        return;
      }
      // FIX #15: Generation guard — abort if this callback belongs to a stale battle
      if (
        cleanupPhaseRef.current !== "idle" ||
        cleanupRanRef.current ||
        aiGenerationRef.current !== myAIGeneration
      ) {
        clearTimeout(watchdog);
        pendingTimeoutsRef.current.delete(watchdog);
        enemyTurnInProgressRef.current = false;
        return;
      }
      // FIX-2: Session guard — abort if this callback survived an error-boundary reload
      if (sessionVersionRef.current !== mySessionVersion) {
        clearTimeout(watchdog);
        pendingTimeoutsRef.current.delete(watchdog);
        enemyTurnInProgressRef.current = false;
        return;
      }

      // ── BOSS AI: phase-transition + decision function ──
      // Run outside flushSync (pure computation), then apply inside.
      const currentBossEntry = turnOrderRef.current.find(
        (c) => c.id === enemyId && c.isBoss,
      );
      const currentBossConfig = currentBossConfigRef.current;
      let bossAIAction: import("../types/bossTypes").AIAction | null = null;
      let bossPhaseTransitioned = false;
      let newBossStateAfterPhase: BossState | null = null;

      if (
        currentBossEntry?.isBoss &&
        currentBossEntry.bossId &&
        currentBossConfig &&
        bossStateRef.current
      ) {
        const bossEnemy = turnOrderRef.current.find((c) => c.id === enemyId);
        const bossEnemyWPos = getLiveCombatants(combatantStoreCtx).find(
          (e) => e.id === enemyId,
        ) ?? {
          x: 8,
          y: 8,
        };
        const bossCELike: import("../types/bossTypes").CombatantEntryLike = {
          id: currentBossEntry.id,
          name: currentBossEntry.name,
          hp: bossEnemy?.hp ?? currentBossEntry.hp,
          maxHp: bossEnemy?.maxHp ?? currentBossEntry.maxHp,
          ap: currentBossConfig.baseStats.ap,
          mp: currentBossConfig.baseStats.mp,
          atk: currentBossConfig.baseStats.atk,
          res: currentBossConfig.baseStats.res,
          sp: currentBossConfig.baseStats.sp,
          init: currentBossConfig.baseStats.init,
          chc: currentBossConfig.baseStats.chc,
          x: bossEnemyWPos.x,
          y: bossEnemyWPos.y,
          isPlayer: false,
          pieceType: currentBossConfig.pieceType as ChessPieceType,
          phaseNumber: (bossEnemy?.currentBossPhase ?? 1) as 1 | 2,
        };
        const { transitioned, newState } = checkPhaseTransition(
          bossCELike,
          bossStateRef.current,
          currentBossConfig,
        );
        if (transitioned) {
          bossPhaseTransitioned = true;
          newBossStateAfterPhase = newState;
        }
        const playerWE = turnOrderRef.current.find((c) => c.type === "player");
        const playerCELike:
          | import("../types/bossTypes").CombatantEntryLike
          | null = playerWE
          ? {
              id: "player",
              name: playerWE.name,
              hp: playerWE.hp,
              maxHp: playerWE.maxHp,
              ap: currentBattleAp,
              mp: currentBattleMp,
              atk: 10,
              res: characterStats.res ?? 0,
              sp: characterStats.sp ?? 0,
              init: characterStats.init,
              chc: characterStats.chc,
              x: playerPosition.x,
              y: playerPosition.y,
              isPlayer: true,
              pieceType: (pieceType ?? "pawn") as ChessPieceType,
            }
          : null;
        if (playerCELike) {
          type _CELike2 = import("../types/bossTypes").CombatantEntryLike;
          const enemiesForBossAI: _CELike2[] = getPlayerSideTargets(
            turnOrderRef.current,
          )
            .filter((c: any) => c.id !== enemyId)
            .filter((c) => c.type === "enemy" && c.id !== enemyId)
            .map((c) => {
              const wE = getLiveCombatants(combatantStoreCtx).find(
                (e) => e.id === c.id,
              ) ?? { x: 0, y: 0 };
              return {
                id: c.id,
                name: c.name,
                hp: c.hp,
                maxHp: c.maxHp,
                ap: 3,
                mp: 3,
                atk: 10,
                res: 0,
                sp: 0,
                init: 6,
                chc: 2,
                x: wE.x,
                y: wE.y,
                isPlayer: false,
                pieceType: (c.pieceType ?? "pawn") as ChessPieceType,
              };
            });
          const tilesForBossAI: boolean[][] = currentMap
            ? currentMap.tiles.map((r) =>
                r.map((t) => t === "floor" || t === "portal"),
              )
            : [];
          bossAIAction = bossAI.executeBossDecision(
            currentBossEntry.bossId,
            bossCELike,
            playerCELike,
            enemiesForBossAI,
            tilesForBossAI,
            bossPhaseTransitioned && newBossStateAfterPhase
              ? newBossStateAfterPhase
              : bossStateRef.current,
            currentBossConfig,
            battleTurn,
          );
        }
      }
      // C-3: Wrap the entire enemy AI state-update block in a single flushSync
      // so ALL nested setters (setCharacterStats, setTurnOrder, setEnemyHpMap, etc.)
      // are committed in ONE React render. Prevents canvas from reading stale refs
      // mid-AI-logic due to cascading separate re-renders.
      flushSync(() => {
        const prevEnemies = getLiveCombatants(combatantStoreCtx);
        const enemy = prevEnemies.find((e) => e.id === enemyId);
        if (!enemy) {
          clearTimeout(watchdog);
          pendingTimeoutsRef.current.delete(watchdog);
          enemyTurnInProgressRef.current = false;
          const _t = setTimeout(() => {
            pendingTimeoutsRef.current.delete(_t);
            if (
              !enemyTurnAbortRef.current &&
              aiGenerationRef.current === myAIGeneration
            )
              advanceTurnRef.current(); // FIX #15
          }, 0);
          // M-4: Only register if cleanup hasn't run yet
          if (!cleanupRanRef.current) {
            pendingTimeoutsRef.current.add(_t);
          }
          return;
        }
        const myMap = enemyCooldownsRef.current.get(enemyId);
        if (myMap) {
          for (const [sid, turns] of myMap.entries()) {
            if (turns > 0) myMap.set(sid, turns - 1);
          }
        }
        if (
          (enemy.aiTier ?? 1) >= 5 &&
          leaderDiedRef.current &&
          !allEnemiesErraticRef.current &&
          erraticTurnsLeftRef.current <= 0
        ) {
          allEnemiesErraticRef.current = true;
          erraticTurnsLeftRef.current = prevEnemies.length;
          logBattleEntry(
            "[Leader died] Enemies acting erratically!",
            "#ef4444",
          );
        }
        if (allEnemiesErraticRef.current) {
          logBattleEntry(
            `[Leader died] ${enemy.pieceType} acts erratically!`,
            "#ef4444",
          );
          erraticTurnsLeftRef.current = Math.max(
            0,
            erraticTurnsLeftRef.current - 1,
          );
          if (erraticTurnsLeftRef.current <= 0)
            allEnemiesErraticRef.current = false;
          const adjCells = [
            { x: enemy.x - 1, y: enemy.y },
            { x: enemy.x + 1, y: enemy.y },
            { x: enemy.x, y: enemy.y - 1 },
            { x: enemy.x, y: enemy.y + 1 },
          ].filter(
            (c) =>
              c.x >= 0 &&
              c.x < WORLD_GRID_SIZE &&
              c.y >= 0 &&
              c.y < WORLD_GRID_SIZE &&
              currentMap?.tiles[c.y]?.[c.x] !== "wall" &&
              !prevEnemies.some(
                (e) => e.id !== enemyId && e.x === c.x && e.y === c.y,
              ) &&
              !(c.x === playerPosition.x && c.y === playerPosition.y),
          );
          let erX = enemy.x;
          let erY = enemy.y;
          if (adjCells.length > 0) {
            const p = adjCells[Math.floor(Math.random() * adjCells.length)];
            erX = p.x;
            erY = p.y;
          }
          const erSpells = (currentCombatant.spells ?? []) as SpellConfig[];
          if (Math.random() < 0.5 && erSpells.length > 0) {
            const rs = erSpells[Math.floor(Math.random() * erSpells.length)];
            logBattleEntry(
              `${enemy.pieceType} wildly casts ${rs.name}!`,
              "#ef4444",
            );
          }
          clearTimeout(watchdog);
          enemyTurnInProgressRef.current = false;
          // FIX-4a: Register erratic-action timer in cleanup registry so it
          // can be cancelled if battle ends before it fires.
          const myErraticGen = aiGenerationRef.current;
          let erraticTimer: ReturnType<typeof setTimeout>;
          erraticTimer = setTimeout(() => {
            if (
              cleanupPhaseRef.current !== "idle" ||
              cleanupRanRef.current ||
              aiGenerationRef.current !== myErraticGen
            )
              return;
            // Delete from registry on entry so cleanup doesn't double-cancel.
            pendingTimeoutsRef.current.delete(erraticTimer);
            if (
              !enemyTurnAbortRef.current &&
              aiGenerationRef.current === myAIGeneration
            )
              advanceTurnRef.current(); // FIX #15
          }, 0);
          if (!cleanupRanRef.current) {
            pendingTimeoutsRef.current.add(erraticTimer);
          }
          updateCombatant(combatantStoreCtx, enemyId, { x: erX, y: erY });
          return;
        }
        const aliveAllies = prevEnemies.filter((e) => e.id !== enemyId);
        if (
          (enemy.aiTier ?? 1) >= 10 &&
          aliveAllies.length > 0 &&
          Math.random() < 0.05
        ) {
          const allyT =
            aliveAllies[Math.floor(Math.random() * aliveAllies.length)];
          const btDmg = Math.max(
            1,
            enemy.level * 2 + Math.floor(Math.random() * 5),
          );
          const allyPrevHp =
            enemyHpMap[allyT.id] ?? calcEnemyMaxHp(allyT.level);
          const allyNewHp = Math.max(0, allyPrevHp - btDmg);
          logBattleEntry(
            `${enemy.pieceType} turns on ${allyT.pieceType}! Betrayal!`,
            "#ef4444",
          );
          battleBetrayalOccurredRef.current = true;
          if (allyNewHp <= 0) {
            if (
              allyT.id === leaderEnemyIdRef.current &&
              !leaderDiedRef.current
            ) {
              leaderDiedRef.current = true;
              triggerLeaderDeathAnimation(allyT.x, allyT.y);
              logBattleEntry(
                `\ud83d\udc51 The leader ${allyT.pieceType} fell via betrayal!`,
                "#f97316",
              );
            }
            setEnragedEnemies((prev) => {
              const n = new Set(prev);
              n.add(enemyId);
              return n;
            });
            // Route the ally removal + enemy enrage through the unified
            // combatant store: removeCombatant drops allyT from
            // combatants/enemies/battleEnemies/turnOrder atomically;
            // updateCombatant applies the 6× maxHp/hp boost to enemyId
            // across all mirrors + setters. The store auto-syncs
            // battleEnemies, so the explicit setBattleEnemies sync is
            // redundant and removed.
            removeCombatant(combatantStoreCtx, allyT.id);
            updateCombatant(combatantStoreCtx, enemyId, {
              maxHp: Math.round(
                (turnOrderRef.current.find((c) => c.id === enemyId)?.maxHp ??
                  calcEnemyMaxHp(enemy.level)) * 6,
              ),
              hp: Math.round(
                (turnOrderRef.current.find((c) => c.id === enemyId)?.hp ??
                  calcEnemyMaxHp(enemy.level)) * 6,
              ),
            });
            setEnemyHpMap((prev) => {
              const n = { ...prev };
              delete n[allyT.id];
              n[enemyId] = Math.round(
                (prev[enemyId] ?? calcEnemyMaxHp(enemy.level)) * 6,
              );
              return n;
            });
            const afterFirst = prevEnemies.filter((e) => e.id !== allyT.id);
            const secondPool = afterFirst.filter((e) => e.id !== enemyId);
            if (secondPool.length > 0 && Math.random() < 0.15) {
              battleDoubleBetrayelOccurredRef.current = true;
              let dbTimer: ReturnType<typeof setTimeout>;
              dbTimer = setTimeout(() => {
                // C-1: Guard — if cleanup ran before this fires, abort immediately
                if (!pendingTimeoutsRef.current.has(dbTimer)) return;
                pendingTimeoutsRef.current.delete(dbTimer);
                if (enemyTurnAbortRef.current) return;
                if (
                  cleanupPhaseRef.current !== "idle" ||
                  cleanupRanRef.current ||
                  aiGenerationRef.current !== myAIGeneration
                )
                  return; // FIX #15 + triple-check
                if (sessionVersionRef.current !== mySessionVersion) return; // FIX-2
                const sb =
                  secondPool[Math.floor(Math.random() * secondPool.length)];
                logBattleEntry(
                  `\u26a1 DOUBLE BETRAYAL! ${sb.pieceType} also turns!`,
                  "#f97316",
                );
                const sbTgts = afterFirst.filter((e) => e.id !== sb.id);
                if (sbTgts.length > 0) {
                  const sbT = sbTgts[Math.floor(Math.random() * sbTgts.length)];
                  const sbDmg = Math.max(
                    1,
                    sb.level * 2 + Math.floor(Math.random() * 5),
                  );
                  logBattleEntry(
                    `${sb.pieceType} attacks ${sbT.pieceType} for ${sbDmg}!`,
                    "#f97316",
                  );
                  setEnemyHpMap((h) => {
                    const curHp = h[sbT.id] ?? calcEnemyMaxHp(sbT.level);
                    const nHp = Math.max(0, curHp - sbDmg);
                    if (nHp <= 0) {
                      // Route the double-betrayal kill through the unified
                      // store: removeCombatant drops sbT from
                      // combatants/enemies/battleEnemies/turnOrder
                      // atomically (replaces the separate setTurnOrder +
                      // setEnemies filters).
                      removeCombatant(combatantStoreCtx, sbT.id);
                    }
                    return { ...h, [sbT.id]: nHp };
                  });
                }
              }, 200);
              // C-1 / M-4: Register AFTER assigning ID, guard with cleanupRanRef
              if (!cleanupRanRef.current) {
                pendingTimeoutsRef.current.add(dbTimer);
              }
            }
            clearTimeout(watchdog);
            pendingTimeoutsRef.current.delete(watchdog);
            enemyTurnInProgressRef.current = false;
            const _at1 = setTimeout(() => {
              // H-1: Guard — if cleanup ran before this fires, abort immediately
              if (!pendingTimeoutsRef.current.has(_at1)) return;
              pendingTimeoutsRef.current.delete(_at1);
              if (
                !enemyTurnAbortRef.current &&
                aiGenerationRef.current === myAIGeneration
              )
                advanceTurnRef.current(); // FIX #15
            }, 0);
            // M-4: Only register if cleanup hasn't run yet
            if (!cleanupRanRef.current) {
              pendingTimeoutsRef.current.add(_at1);
            }
            return;
          }
          setEnemyHpMap((prev) => ({ ...prev, [allyT.id]: allyNewHp }));
          setTurnOrder((prev) =>
            prev.map((c) => (c.id === allyT.id ? { ...c, hp: allyNewHp } : c)),
          );
          clearTimeout(watchdog);
          pendingTimeoutsRef.current.delete(watchdog);
          enemyTurnInProgressRef.current = false;
          const _at2 = setTimeout(() => {
            // H-1: Guard — if cleanup ran before this fires, abort immediately
            if (!pendingTimeoutsRef.current.has(_at2)) return;
            pendingTimeoutsRef.current.delete(_at2);
            if (
              !enemyTurnAbortRef.current &&
              aiGenerationRef.current === myAIGeneration
            )
              advanceTurnRef.current(); // FIX #15
          }, 0);
          // M-4: Only register if cleanup hasn't run yet
          if (!cleanupRanRef.current) {
            pendingTimeoutsRef.current.add(_at2);
          }
          return;
        }
        // ── BOSS AI ACTION APPLICATION ─────────────────────────────────
        // If this is a boss enemy, apply the pre-computed boss action and skip
        // the regular AI pipeline entirely. Phase transition also applied here.
        if (currentBossEntry?.isBoss && currentBossConfig) {
          // Phase transition: apply stat multiplier in same flushSync
          if (bossPhaseTransitioned && newBossStateAfterPhase) {
            const mult = currentBossConfig.phase2.statMultiplier;
            // ISSUE 5 — Weeping Pawn PROMOTE_QUEEN: restore FULL HP on transition
            const isWeepingPawn = currentBossConfig.id === "weeping_pawn";
            setTurnOrder((prev) =>
              prev.map((c) => {
                if (c.id !== enemyId) return c;
                const newMaxHp = Math.round(c.maxHp * mult);
                const newHp = isWeepingPawn
                  ? newMaxHp
                  : Math.min(Math.round(c.hp * mult), newMaxHp);
                return {
                  ...c,
                  maxHp: newMaxHp,
                  hp: newHp,
                  currentBossPhase: 2 as const,
                };
              }),
            );
            setEnemyHpMap((h) => {
              const newMaxHp = Math.round((h[enemyId] ?? 0) * mult);
              const newHp = isWeepingPawn
                ? newMaxHp
                : Math.round((h[enemyId] ?? 0) * mult);
              return { ...h, [enemyId]: newHp };
            });
            bossStateRef.current = newBossStateAfterPhase;
            flushSync(() => {
              setActiveBossState(newBossStateAfterPhase);
            });
            if (isWeepingPawn) {
              logBattleEntry(
                "👑 The Weeping Pawn PROMOTES to the Weeping Queen — FULL HP RESTORED!",
                "#ffd700",
              );
            } else {
              logBattleEntry(
                `⚡ ${currentBossConfig.name} PHASE 2! Stats boosted ×${mult}!`,
                "#ffd700",
              );
            }
          }
          // Apply boss action result
          if (bossAIAction) {
            const res = bossAIAction.abilityResult;
            // Log messages
            if (bossAIAction.logMessage) {
              logBattleEntry(bossAIAction.logMessage, "#a855f7");
            }
            if (res?.logMessages) {
              for (const msg of res.logMessages) logBattleEntry(msg, "#a855f7");
            }
            // Apply position change
            const newBossX = res?.newBossPosition?.x ?? enemy.x;
            const newBossY = res?.newBossPosition?.y ?? enemy.y;
            // Apply player damage
            if (res?.damageToPlayer && res.damageToPlayer > 0) {
              const rawDmg = res.damageToPlayer;
              const absorbed = Math.min(shieldHpRef.current, rawDmg);
              shieldHpRef.current = Math.max(0, shieldHpRef.current - absorbed);
              const finalDmg = rawDmg - absorbed;
              if (finalDmg > 0) {
                setCharacterStats((s) => ({
                  ...s,
                  hp: Math.max(0, s.hp - finalDmg),
                }));
                challengeTotalDamageRef.current += finalDmg;
              }
            }
            // Apply player AP drain
            if (res?.playerApModifier && res.playerApModifier !== 0) {
              setCurrentBattleAp((prev) =>
                Math.max(0, prev + res.playerApModifier!),
              );
            }
            // Apply debuffs to player
            if (res?.debuffsApplied) {
              for (const d of res.debuffsApplied) {
                applyActiveEffect({
                  id: `debuff_${Date.now()}`,
                  targetId: "player",
                  type: "debuff",
                  stat: d.stat,
                  modifier: d.modifier,
                  duration: d.duration,
                  effectName: d.effectName,
                  iconEmoji: d.iconEmoji,
                  description: d.effectName,
                });
              }
            }
            // Apply DoT to player
            if (res?.dotApplied) {
              for (const dot of res.dotApplied) {
                applyActiveEffect({
                  id: `dot_${Date.now()}`,
                  targetId: "player",
                  type: "dot",
                  dotDamagePerTurn: dot.damage,
                  duration: dot.duration,
                  effectName: dot.effectName,
                  iconEmoji: dot.iconEmoji,
                  description: `${dot.damage} dmg/turn`,
                });
              }
            }
            // Update boss state
            if (res?.newBossState) {
              const merged = {
                ...bossStateRef.current!,
                ...res.newBossState,
              };
              bossStateRef.current = merged;
              setActiveBossState(merged);
            }
            // Add hazard tiles to map
            if (res?.newHazardTiles && currentMap) {
              for (const ht of res.newHazardTiles) {
                if (currentMap.hazardTiles.size >= MAX_HAZARD_TILES) {
                  const firstHazardKey = currentMap.hazardTiles
                    .keys()
                    .next().value;
                  if (firstHazardKey !== undefined)
                    currentMap.hazardTiles.delete(firstHazardKey);
                }
                currentMap.hazardTiles.set(
                  `${ht.x},${ht.y}`,
                  ht.type as HazardType,
                );
              }
            }
            // Spawn minions
            if (res?.spawns && res.spawns.length > 0) {
              const minionEnemies: Enemy[] = res.spawns.map((s) => ({
                id: s.id,
                x: s.x,
                y: s.y,
                pieceType: s.pieceType as ChessPieceType,
                currentView: "front" as ViewDirection,
                isMoving: false,
                movementPath: [],
                currentStepIndex: 0,
                movementStartTime: 0,
                initialDelay: 0,
                hasStartedMoving: true,
                spawnTime: Date.now(),
                scaleX: 1,
                scaleY: 1,
                level: Math.max(1, currentBossConfig.baseStats.init - 2),
                nextMoveTime: Date.now() + 1000,
                movementSpeed: 800,
                movementRange: 1,
                isWandering: false,
                wanderTarget: null,
                lastMoveTime: Date.now(),
                hp: Math.max(
                  1,
                  Math.round(
                    Math.max(1, currentBossConfig.baseStats.init - 2) * 8 + 20,
                  ),
                ),
                maxHp: Math.max(
                  1,
                  Math.round(
                    Math.max(1, currentBossConfig.baseStats.init - 2) * 8 + 20,
                  ),
                ),
                damage: Math.max(
                  1,
                  Math.round(
                    Math.max(1, currentBossConfig.baseStats.init - 2) * 2 + 3,
                  ),
                ),
                res: 0,
                sp: 0,
                chc: 0,
                init: Math.max(
                  1,
                  8 + Math.max(1, currentBossConfig.baseStats.init - 2) - 1,
                ),
                sr: 5,
                assignedName: s.parentBossId ? "Minion" : "Ghost",
                ap: 0,
                mp: 0,
                atk: 0,
                family: "",
                tier: "",
                intelligence: 0,
                aiStrategy: "",
                spellCooldowns: {},
                activeEffects: [],
              }));
              const _spawnSlots = Math.max(
                0,
                MAX_ENEMIES - combatantsRef.current.length,
              );
              const _newMinionEnemies = [
                ...combatantsRef.current,
                ...minionEnemies.slice(0, _spawnSlots),
              ];
              syncCombatants(combatantStoreCtx, _newMinionEnemies);
              const minionEntries: CombatantEntry[] = minionEnemies.map(
                (m) => ({
                  id: m.id,
                  type: "enemy",
                  initiative: 6,
                  name: m.assignedName ?? "Minion",
                  pieceIcon: "☠",
                  hp: 20,
                  maxHp: 20,
                  level: m.level,
                  pieceType: m.pieceType,
                }),
              );
              setTurnOrder((prev) => [...prev, ...minionEntries]);
              setEnemyHpMap((h) => {
                const n = { ...h };
                for (const m of minionEnemies) n[m.id] = 20;
                return n;
              });
            }
            // ISSUE 4 — endsTurn flag: if the ability ends the turn immediately
            // (PROMOTE_QUEEN, SPLIT_ROOKS, MERGE_BISHOPS), advance right away
            // and skip the normal deferred advanceTurn below.
            if (res?.endsTurn === true) {
              clearTimeout(watchdog);
              pendingTimeoutsRef.current.delete(watchdog);
              enemyTurnInProgressRef.current = false;
              advanceTurnRef.current();
              updateCombatant(combatantStoreCtx, enemyId, {
                x: newBossX,
                y: newBossY,
              });
              return;
            }
            // Update boss position in enemies
            clearTimeout(watchdog);
            pendingTimeoutsRef.current.delete(watchdog);
            enemyTurnInProgressRef.current = false;
            const myBossAdvGen = aiGenerationRef.current;
            const bossAdvTimer = setTimeout(() => {
              if (
                cleanupPhaseRef.current !== "idle" ||
                cleanupRanRef.current ||
                aiGenerationRef.current !== myBossAdvGen
              )
                return;
              pendingTimeoutsRef.current.delete(bossAdvTimer);
              if (
                !enemyTurnAbortRef.current &&
                aiGenerationRef.current === myAIGeneration
              )
                advanceTurnRef.current();
            }, 0);
            if (!cleanupRanRef.current)
              pendingTimeoutsRef.current.add(bossAdvTimer);
            updateCombatant(combatantStoreCtx, enemyId, {
              x: newBossX,
              y: newBossY,
            });
            return;
          }
          // No action from boss AI — skip turn
          clearTimeout(watchdog);
          pendingTimeoutsRef.current.delete(watchdog);
          enemyTurnInProgressRef.current = false;
          const myBossSkipGen = aiGenerationRef.current;
          const bossSkipTimer = setTimeout(() => {
            if (
              cleanupPhaseRef.current !== "idle" ||
              cleanupRanRef.current ||
              aiGenerationRef.current !== myBossSkipGen
            )
              return;
            pendingTimeoutsRef.current.delete(bossSkipTimer);
            if (
              !enemyTurnAbortRef.current &&
              aiGenerationRef.current === myAIGeneration
            )
              advanceTurnRef.current();
          }, 0);
          if (!cleanupRanRef.current)
            pendingTimeoutsRef.current.add(bossSkipTimer);
          return;
        }
        // ── END BOSS AI ────────────────────────────────────────────
        // ── BEGIN enemyAI.ts call site (Section 3 extraction) ──────────────
        const enrageMultiplier = enragedEnemies.has(enemyId) ? 6 : 1;
        // FIX #3: first-turn spell fallback via battleEnemiesRef
        const battleEnemyData = battleEnemiesRef.current.find(
          (be) => be.id === enemyId,
        );
        const assignedSpells = (((currentCombatant.spells?.length ?? 0) > 0
          ? currentCombatant.spells
          : (battleEnemyData?.spells ?? currentCombatant.spells)) ??
          []) as SpellConfig[];
        const enemyCooldownMap =
          enemyCooldownsRef.current.get(enemyId) ?? new Map<string, number>();
        const availableSpells = assignedSpells.filter(
          (s) =>
            (enemyCooldownMap.get(s.id) ?? 0) <= 0 && s.usableByEnemy !== false,
        );

        // Build AICombatant[] from prevEnemies + player + player-side summons.
        const aiCombatants: AICombatant[] = [];
        for (const e of prevEnemies) {
          if (e.id === enemyId) continue;
          const eHp = enemyHpMap[e.id] ?? e.hp;
          if (eHp <= 0) continue;
          aiCombatants.push({
            id: e.id,
            side: e.isSummon && e.side === "player" ? "player" : "enemy",
            isSummon: e.isSummon,
            summonAI: e.summonAI,
            name: e.pieceType,
            x: e.x,
            y: e.y,
            hp: eHp,
            maxHp: e.maxHp,
            level: e.level,
          });
        }
        // Player combatant
        aiCombatants.push({
          id: "player",
          side: "player",
          name: "player",
          x: playerPosition.x,
          y: playerPosition.y,
          hp: characterStats.hp,
          maxHp: characterStats.maxHp ?? characterStats.hp,
          level: characterStats.level ?? 1,
        });

        // Grid: passable = not wall. Build boolean[][] once.
        const aiGrid: boolean[][] = (currentMap?.tiles ?? []).map((row) =>
          (row ?? []).map((t) => t !== "wall"),
        );
        const aiOccupied = new Set<string>();
        for (const e of prevEnemies) {
          if (e.id === enemyId) continue;
          aiOccupied.add(`${e.x},${e.y}`);
        }
        aiOccupied.add(`${playerPosition.x},${playerPosition.y}`);
        const aiBarriers = new Set(barrierTilesRef.current.keys());
        const aiPortals = new Set(
          (currentMap?.portals ?? []).map((p) => `${p.x},${p.y}`),
        );
        const aiVoid = currentMap?.voidTiles ?? new Set<string>();
        const aiHazards = currentMap?.hazardTiles ?? new Map<string, string>();

        // Local Bresenham LoS (targeting.ts does not export one).
        const aiHasLineOfSight = (from: AICell, to: AICell): boolean => {
          let x0 = from.x;
          let y0 = from.y;
          const x1 = to.x;
          const y1 = to.y;
          const dx = Math.abs(x1 - x0);
          const dy = Math.abs(y1 - y0);
          const sx = x0 < x1 ? 1 : -1;
          const sy = y0 < y1 ? 1 : -1;
          let err = dx - dy;
          let guard = 0;
          while (guard++ < 256) {
            if (x0 === x1 && y0 === y1) return true;
            const k = `${x0},${y0}`;
            if (!(x0 === from.x && y0 === from.y)) {
              if (aiBarriers.has(k)) return false;
              const t = currentMap?.tiles?.[y0]?.[x0];
              if (t === "wall") return false;
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
              err -= dy;
              x0 += sx;
            }
            if (e2 < dx) {
              err += dx;
              y0 += sy;
            }
          }
          return false;
        };

        const aiCtx: DecideEnemyContext = {
          enemy,
          combatants: aiCombatants,
          grid: aiGrid,
          occupied: aiOccupied,
          barriers: aiBarriers,
          portals: aiPortals,
          voidTiles: aiVoid,
          hazardTiles: aiHazards,
          availableSpells,
          assignedSpells,
          battleTurn,
          allyCount: prevEnemies.filter(
            (e) => e.id !== enemyId && (enemyHpMap[e.id] ?? e.hp) > 0,
          ).length,
          enemyCount: prevEnemies.filter((e) => (enemyHpMap[e.id] ?? e.hp) > 0)
            .length,
          enrageMultiplier,
          isSlimeFlood: isSlimeFloodRef.current,
          rng: Math.random,
          getEffectiveStat: (cid, stat) =>
            getStatModifier(cid, stat, activeEffectsRef.current) as number,
          calcScaledDamage,
          hasLineOfSight: aiHasLineOfSight,
          log: logBattleEntry,
          focusTargetId: focusTargetRef.current,
          setFocusTargetId: (id) => {
            focusTargetRef.current = id;
          },
          focusAlreadySet: focusTurnRef.current === battleTurn,
          markFocusSet: () => {
            focusTurnRef.current = battleTurn;
          },
          // Enemy summoner cooldown: only read by decideSummonerAction.
          // lastSummonTurn is null when the summoner has not yet cast.
          currentTurn: battleTurn,
          lastSummonTurn: enemySummonCooldownRef.current.get(enemyId) ?? null,
        };

        const action = enemy.isSummoner
          ? decideSummonerAction(
              {
                ...enemy,
                name: enemy.assignedName ?? String(enemy.pieceType),
                side: "enemy" as const,
              },
              aiCtx,
            )
          : decideEnemyAction(enemy, aiCtx);
        // 3e: short-circuit the enemy turn when a summoner casts a summon
        // spell — the spawn is applied via spawnEnemySummonRef, the turn
        // is handed off to the next combatant, and we return before the
        // normal move/cast executor runs (which has no summon branch).
        if (
          action.kind === "cast" &&
          action.spell?.isSummon &&
          action.destination
        ) {
          spawnEnemySummonRef.current?.(action.destination, action.spell);
          // Record the battle turn of this successful summon so the
          // ENEMY_SUMMON_COOLDOWN_TURNS cadence is enforced on the
          // summoner's next turn.
          enemySummonCooldownRef.current.set(enemyId, battleTurn);
          enemyTurnInProgressRef.current = false;
          setTimeout(advanceTurnRef.current, 600);
          return;
        }
        let newX = action.destination.x;
        let newY = action.destination.y;
        // Clamp to grid (defensive — decideEnemyAction should already do this).
        newX = Math.max(0, Math.min(WORLD_GRID_SIZE - 1, newX));
        newY = Math.max(0, Math.min(WORLD_GRID_SIZE - 1, newY));
        const chosenSpell = action.spell;

        // ── Resolve attack target (player or player-side summon) ──────────
        // action.targetId is set by enemyAI archetype decision functions to
        // the scored combatant's id. When it points to a player-side summon
        // (lives in prevEnemies with side==='player'), route damage through
        // enemyTakesDamage instead of playerTakesDamage. When null/missing
        // (skip/retreat/advance) or 'player', fall back to the player.
        const resolvedTarget =
          action.targetId && action.targetId !== "player"
            ? prevEnemies.find((e) => e.id === action.targetId)
            : null;
        const targetCell = resolvedTarget
          ? { x: resolvedTarget.x, y: resolvedTarget.y }
          : playerPosition;
        const isSummonTarget = !!resolvedTarget;
        const resolvedTargetId = action.targetId ?? "player";

        // Intent log line (emitted by decideEnemyAction via ctx.log already,
        // but we surface action.intent here for any caller-side telemetry).
        if (action.intent) {
          // decideEnemyAction already logged via ctx.log; avoid double-logging.
        }

        let didAct = false;
        // ── Apply spell cast ──────────────────────────────────────────────
        if (action.kind === "cast" && chosenSpell) {
          const spellRange = Number(chosenSpell.range);
          const distAM = Math.max(
            Math.abs(newX - targetCell.x),
            Math.abs(newY - targetCell.y),
          );
          const inRange = distAM <= spellRange;
          const spellType = chosenSpell.spellType ?? "damage";
          const spellDmg = Number(chosenSpell.damage);
          if (
            inRange &&
            (spellType === "damage" || spellType === "drain") &&
            spellDmg > 0
          ) {
            const rawDmg = Math.max(
              1,
              Math.round(
                calcScaledDamage(spellDmg, enemy.level, 0) * enrageMultiplier,
              ),
            );
            const isCrit =
              Math.random() * 100 <
              (enemy.chc ?? 2) + (enragedEnemies.has(enemyId) ? 10 : 0);
            const dmgAC = isCrit ? rawDmg * 2 : rawDmg;
            // Player-side summons have no SP; RES comes from resolvedTarget.res.
            const plSpEff = isSummonTarget
              ? 0
              : Math.max(0, characterStats.sp) *
                (getStatModifier(
                  "player",
                  "sp",
                  activeEffectsRef.current,
                ) as number);
            const plResEff = isSummonTarget
              ? Math.max(0, Number(resolvedTarget?.res ?? 0))
              : Math.max(0, Number(characterStats.res)) *
                (getStatModifier(
                  "player",
                  "res",
                  activeEffectsRef.current,
                ) as number);
            if (isPaperWindstorm && spellRange > 1 && Math.random() < 0.5) {
              logBattleEntry(
                `Paper Windstorm! ${enemy.pieceType}'s ${chosenSpell.name} missed!`,
                "#AAAAAA",
              );
            } else if (
              !chosenSpell.hitsMultiple &&
              !chosenSpell.aoe &&
              mirrorUnitsRef.current.has("player")
            ) {
              mirrorUnitsRef.current.delete("player");
              const mirrorDmg = Math.max(
                1,
                Math.round(
                  dmgAC *
                    (1 -
                      (Number(enemy.res) *
                        getStatModifier(enemy.id, "res", activeEffects)) /
                        100),
                ),
              );
              const curEnemyHp = enemyHpMap[enemyId] ?? currentCombatant.hp;
              const newEnemyHpMirror = Math.max(0, curEnemyHp - mirrorDmg);
              setEnemyHpMap((prev) => ({
                ...prev,
                [enemyId]: newEnemyHpMirror,
              }));
              setTurnOrder((prev) =>
                prev.map((c) =>
                  c.id === enemyId ? { ...c, hp: newEnemyHpMirror } : c,
                ),
              );
              logBattleEntry(
                `Mirror! ${enemy.pieceType}'s ${chosenSpell.name} was reflected back for ${mirrorDmg} dmg!`,
                "#c084fc",
              );
              didAct = true;
            } else {
              const dmg = Math.max(
                1,
                Math.round(dmgAC * (1 - plSpEff / 100) * (1 - plResEff / 100)),
              );
              const spR = Math.round(dmgAC * (plSpEff / 100));
              const resR = Math.round(
                dmgAC * (1 - plSpEff / 100) * (plResEff / 100),
              );
              const rn = [
                spR > 0 ? `-${spR} SP` : "",
                resR > 0 ? `-${resR} RES` : "",
              ]
                .filter(Boolean)
                .join(", ");
              const resNote = rn ? ` [${rn} = ${dmg} recv]` : "";
              let actualDmg: number;
              if (isSummonTarget && resolvedTarget) {
                enemyTakesDamage(
                  resolvedTarget.id,
                  dmg,
                  enemy.id,
                  `${enemy.pieceType} spell ${chosenSpell.name}`,
                  isCrit,
                );
                actualDmg = dmg;
                logBattleEntry(
                  isCrit
                    ? `CRITICAL HIT! ${enemy.pieceType} casts ${chosenSpell.name} on ${resolvedTarget.pieceType}: ${rawDmg}x2=${dmgAC} dmg`
                    : `${enemy.pieceType} casts ${chosenSpell.name} on ${resolvedTarget.pieceType} for ${actualDmg} dmg`,
                  isCrit ? "#FFD700" : "#ef4444",
                );
              } else {
                actualDmg = playerTakesDamage(
                  dmg,
                  `${enemy.pieceType} spell ${chosenSpell.name}`,
                );
                logBattleEntry(
                  isCrit
                    ? `CRITICAL HIT! ${enemy.pieceType} casts ${chosenSpell.name}: ${rawDmg}x2=${dmgAC} dmg${resNote}`
                    : `${enemy.pieceType} casts ${chosenSpell.name} on you for ${actualDmg} dmg${resNote}`,
                  isCrit ? "#FFD700" : "#ef4444",
                );
                if (actualDmg > 0)
                  logBattleEntry(`You lost ${actualDmg} HP!`, "#eab308");
              }
              playSound("player_damage", enemy.pieceType);
              if (chosenSpell.debuffStat && chosenSpell.debuffDuration) {
                applyActiveEffect({
                  id: `ed-${Date.now()}`,
                  effectName: chosenSpell.name,
                  type: "debuff",
                  targetId: resolvedTargetId,
                  stat: chosenSpell.debuffStat,
                  modifier: chosenSpell.debuffModifier ?? 1,
                  duration: chosenSpell.debuffDuration,
                  iconEmoji: chosenSpell.iconEmoji,
                  description: `${chosenSpell.debuffStat} debuffed`,
                });
                if (chosenSpell.debuffStat === "ap" && !isSummonTarget)
                  playerApWasDebuffedRef.current = true;
              }
              if (
                (chosenSpell.dotDamagePerTurn ?? chosenSpell.dotDamage) &&
                chosenSpell.dotDuration
              ) {
                const dotPptE =
                  chosenSpell.dotDamagePerTurn ?? chosenSpell.dotDamage ?? 0;
                applyActiveEffect({
                  id: `edot-${Date.now()}`,
                  effectName: `${chosenSpell.name} DoT`,
                  type: "dot",
                  targetId: resolvedTargetId,
                  dotDamagePerTurn: dotPptE,
                  duration: chosenSpell.dotDuration,
                  iconEmoji: "\u2620\uFE0F",
                  description: `${dotPptE} dmg/turn`,
                });
              }
              if (spellType === "drain" && chosenSpell.healAmount) {
                const ha = chosenSpell.healAmount;
                setTurnOrder((prev) =>
                  prev.map((c) =>
                    c.id === enemyId
                      ? { ...c, hp: Math.min(c.maxHp, c.hp + ha) }
                      : c,
                  ),
                );
              }
            }
            if (chosenSpell.cooldown && chosenSpell.cooldown > 0) {
              const cdm =
                enemyCooldownsRef.current.get(enemyId) ??
                new Map<string, number>();
              cdm.set(chosenSpell.id, chosenSpell.cooldown);
              enemyCooldownsRef.current.set(enemyId, cdm);
            }
            didAct = true;
          } else if (inRange && spellType === "heal" && spellRange === 0) {
            const ha = Math.round(
              (chosenSpell.healAmount ?? enemy.level * 2) * enrageMultiplier,
            );
            setTurnOrder((prev) =>
              prev.map((c) =>
                c.id === enemyId
                  ? { ...c, hp: Math.min(c.maxHp, c.hp + ha) }
                  : c,
              ),
            );
            logBattleEntry(`${enemy.pieceType} heals ${ha} HP`, "#ef4444");
            if (chosenSpell.cooldown && chosenSpell.cooldown > 0) {
              const cdm =
                enemyCooldownsRef.current.get(enemyId) ??
                new Map<string, number>();
              cdm.set(chosenSpell.id, chosenSpell.cooldown);
              enemyCooldownsRef.current.set(enemyId, cdm);
            }
            didAct = true;
          } else if (
            inRange &&
            chosenSpell.debuffStat &&
            chosenSpell.debuffDuration
          ) {
            applyActiveEffect({
              id: `ed2-${Date.now()}`,
              effectName: chosenSpell.name,
              type: "debuff",
              targetId: resolvedTargetId,
              stat: chosenSpell.debuffStat,
              modifier: chosenSpell.debuffModifier ?? 1,
              duration: chosenSpell.debuffDuration,
              iconEmoji: chosenSpell.iconEmoji,
              description: `${chosenSpell.debuffStat} debuffed`,
            });
            if (chosenSpell.debuffStat === "ap" && !isSummonTarget)
              playerApWasDebuffedRef.current = true;
            logBattleEntry(
              `${enemy.pieceType} uses ${chosenSpell.name}!`,
              "#ef4444",
            );
            if (chosenSpell.cooldown && chosenSpell.cooldown > 0) {
              const cdm =
                enemyCooldownsRef.current.get(enemyId) ??
                new Map<string, number>();
              cdm.set(chosenSpell.id, chosenSpell.cooldown);
              enemyCooldownsRef.current.set(enemyId, cdm);
            }
            didAct = true;
          }
        }
        // ── Fallback melee or skip ────────────────────────────────────────
        if (action.kind === "melee" || !didAct) {
          const nd = Math.max(
            Math.abs(newX - targetCell.x),
            Math.abs(newY - targetCell.y),
          );
          if (nd <= 1) {
            const fallbackPool = [
              { id: "e-crush", name: "Crush", range: 1, damage: 12 },
              { id: "e-firebolt", name: "Fire Bolt", range: 3, damage: 8 },
            ];
            const fb =
              fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
            const rawFB = Math.max(
              1,
              Math.round(
                fb.damage * Math.max(1, enemy.level / 5) * enrageMultiplier,
              ),
            );
            const meleeRes = isSummonTarget
              ? Math.max(0, Number(resolvedTarget?.res ?? 0))
              : Math.max(0, Number(characterStats.res));
            const dmgFB = Math.max(1, Math.round(rawFB * (1 - meleeRes / 100)));
            if (isPaperWindstorm && fb.range > 1 && Math.random() < 0.5)
              logBattleEntry(
                `Paper Windstorm! ${enemy.pieceType}'s ${fb.name} missed!`,
                "#AAAAAA",
              );
            else if (isSummonTarget && resolvedTarget) {
              // Summon target: route through enemyTakesDamage; no shield/DoTs.
              enemyTakesDamage(
                resolvedTarget.id,
                dmgFB,
                enemy.id,
                "melee",
                false,
              );
              logBattleEntry(
                `${enemy.pieceType} strikes ${resolvedTarget.pieceType} for ${dmgFB} dmg`,
                "#ef4444",
              );
              didAct = true;
            } else {
              let meleeDmg = dmgFB;
              if (shieldHpRef.current > 0) {
                const absorbedFB = Math.min(shieldHpRef.current, meleeDmg);
                shieldHpRef.current = Math.max(
                  0,
                  shieldHpRef.current - absorbedFB,
                );
                meleeDmg = Math.max(0, meleeDmg - absorbedFB);
                if (absorbedFB > 0)
                  logBattleEntry(
                    `\ud83d\udee1\ufe0f Shield absorbed ${absorbedFB} dmg! (${shieldHpRef.current} remaining)`,
                    "#818cf8",
                  );
              }
              setCharacterStats((prev) => ({
                ...prev,
                hp: Math.max(0, prev.hp - meleeDmg),
              }));
              logBattleEntry(
                `${enemy.pieceType} strikes you for ${meleeDmg} dmg`,
                "#ef4444",
              );
              if (enemy?.family === "ember_knight") {
                applyActiveEffect({
                  id: `ember_burn_${Date.now()}`,
                  targetId: "player",
                  type: "dot",
                  dotDamagePerTurn: 3,
                  duration: 3,
                  effectName: "burn",
                  iconEmoji: "\ud83d\udd25",
                  description: "3 dmg/turn (Ember Knight)",
                });
                logBattleEntry(
                  `${enemy.pieceType ?? "Enemy"} ignites you!`,
                  "#F97316",
                );
              }
              if (enemy?.family === "tide_shade") {
                applyActiveEffect({
                  id: `tide_slow_${Date.now()}`,
                  targetId: "player",
                  type: "debuff",
                  stat: "mp",
                  modifier: -1,
                  duration: 2,
                  effectName: "slow",
                  iconEmoji: "\ud83c\udf0a",
                  description: "-1 MP (Tide Shade)",
                });
                logBattleEntry(
                  `${enemy.pieceType ?? "Enemy"} slows you!`,
                  "#0F766E",
                );
              }
              didAct = true;
            }
          } else if (action.kind === "skip") {
            logBattleEntry(
              `${enemy.pieceType} skipped (out of range)`,
              "#ef4444",
            );
          }
        }
        // ── Leader DoT death check ───────────────────────────────────────
        const thisHp = enemyHpMap[enemyId] ?? currentCombatant.hp;
        if (
          thisHp <= 0 &&
          enemyId === leaderEnemyIdRef.current &&
          !leaderDiedRef.current
        ) {
          leaderDiedRef.current = true;
          triggerLeaderDeathAnimation(enemy.x, enemy.y);
          logBattleEntry(
            `\ud83d\udc51 The leader ${enemy.pieceType} fell! Allies in disarray!`,
            "#f97316",
          );
        }
        logBattleEntry(`${enemy.pieceType} ends turn`, "#ef4444");
        // ── Enemy hazard tile landing ────────────────────────────────────
        if (currentMap && (newX !== enemy.x || newY !== enemy.y)) {
          const enemyHazard = currentMap.hazardTiles?.get(`${newX},${newY}`);
          if (enemyHazard) {
            if (enemyHazard === "lava") {
              const hDmg = 8 + Math.floor(Math.random() * 8);
              const curEH = enemyHpMap[enemyId] ?? currentCombatant.hp;
              const newEH = Math.max(0, curEH - hDmg);
              setEnemyHpMap((h) => ({ ...h, [enemyId]: newEH }));
              setTurnOrder((to) =>
                to.map((c) => (c.id === enemyId ? { ...c, hp: newEH } : c)),
              );
              logBattleEntry(
                `\ud83c\udf30 ${enemy.pieceType} walked on lava! -${hDmg} HP`,
                "#ff4400",
              );
              applyActiveEffect({
                id: `enemy-burn-${Date.now()}`,
                effectName: "Burning",
                type: "dot",
                targetId: enemyId,
                duration: 3,
                iconEmoji: "\ud83d\udd25",
                description: "Burning",
                dotDamagePerTurn: 3,
              });
            } else if (enemyHazard === "ice") {
              logBattleEntry(
                `\u2744\ufe0f ${enemy.pieceType} stepped on ice! Slowed!`,
                "#66ccff",
              );
              applyActiveEffect({
                id: `enemy-frozen-${Date.now()}`,
                effectName: "Frozen",
                type: "debuff",
                targetId: enemyId,
                stat: "mp",
                modifier: -2,
                duration: 2,
                iconEmoji: "\u2744\ufe0f",
                description: "Slowed by ice",
              });
            } else if (enemyHazard === "spikes") {
              const hsDmg = 5 + Math.floor(Math.random() * 6);
              const curEHS = enemyHpMap[enemyId] ?? currentCombatant.hp;
              const newEHS = Math.max(0, curEHS - hsDmg);
              setEnemyHpMap((h) => ({ ...h, [enemyId]: newEHS }));
              setTurnOrder((to) =>
                to.map((c) => (c.id === enemyId ? { ...c, hp: newEHS } : c)),
              );
              logBattleEntry(
                `\u2694\ufe0f ${enemy.pieceType} hit spikes! -${hsDmg} HP`,
                "#cc8800",
              );
            }
          }
        }
        // ── END enemyAI.ts call site ──────────────────────────────────────
        clearTimeout(watchdog);
        pendingTimeoutsRef.current.delete(watchdog);
        // try/finally guarantee: flag always cleared even if anything above throws
        try {
          updateCombatant(combatantStoreCtx, enemyId, { x: newX, y: newY });
          const _at3 = setTimeout(() => {
            // H-1: Guard — if cleanup ran before this fires, abort immediately
            if (!pendingTimeoutsRef.current.has(_at3)) return;
            pendingTimeoutsRef.current.delete(_at3);
            if (
              !enemyTurnAbortRef.current &&
              aiGenerationRef.current === myAIGeneration
            )
              advanceTurnRef.current(); // FIX #15
          }, 0);
          // M-4: Only register if cleanup hasn't run yet
          if (!cleanupRanRef.current) {
            pendingTimeoutsRef.current.add(_at3);
          }
          return;
        } finally {
          enemyTurnInProgressRef.current = false;
        }
      }); // end C-3 flushSync
    }, 800);
    // M-4: Only register main timeout if cleanup hasn't run yet
    if (!cleanupRanRef.current) {
      pendingTimeoutsRef.current.add(timeout);
    }
    // H2 fix: watchdog assigned here after timeout is scheduled
    watchdog = setTimeout(() => {
      if (cleanupPhaseRef.current !== "idle" || cleanupRanRef.current) return;
      if (aiGenerationRef.current !== myAIGeneration) return;
      pendingTimeoutsRef.current.delete(watchdog);
      advanceTurnRef.current();
    }, 5000);
    if (!cleanupRanRef.current) {
      pendingTimeoutsRef.current.add(watchdog);
    }
    return () => {
      clearTimeout(timeout);
      pendingTimeoutsRef.current.delete(timeout);
      if (!enemyTurnInProgressRef.current) {
        clearTimeout(watchdog);
        pendingTimeoutsRef.current.delete(watchdog);
      }
      enemyTurnInProgressRef.current = false;
    };
  }, [inBattle, currentTurnIndex, battlePhase]);
  // Track player spell type for Adaptive Resistance AI
  const recordPlayerSpellType = useCallback((effectType: string) => {
    playerSpellTypeHistoryRef.current = [
      ...playerSpellTypeHistoryRef.current.slice(-4),
      effectType,
    ];
    // #19 pacifist run: flip if any offensive effect type used
    const offCats = [
      "damage",
      "drain",
      "aoe",
      "dot",
      "pushback",
      "attract",
      "cc",
      "teleport",
    ];
    if (offCats.includes((effectType ?? "").toLowerCase())) {
      battleOnlyHealBuffSpellsRef.current = false;
    }
  }, []);
  // ── Trigger leader death particle burst + text overlay ─────────────────────
  const triggerLeaderDeathAnimation = useCallback(
    (tileX: number, tileY: number) => {
      const screen = tileCenter(tileX, tileY);
      const now3 = Date.now();
      const COLORS = [
        "#ffd700",
        "#ffaa00",
        "#ff4444",
        "#ff8800",
        "#ffffff",
        "#ffd700",
      ];
      const particles: LeaderDeathParticle[] = Array.from(
        { length: 36 },
        (_, pi) => {
          const angle = (pi / 36) * Math.PI * 2 + Math.random() * 0.3;
          const speed = 2 + Math.random() * 5;
          return {
            x: screen.x + (Math.random() - 0.5) * 8,
            y: screen.y + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size: 2 + Math.random() * 5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: 1,
            born: now3,
          };
        },
      );
      leaderDeathParticlesRef.current = [
        ...leaderDeathParticlesRef.current,
        ...particles,
      ];
      leaderDeathTextRef.current = {
        x: screen.x,
        y: screen.y - 20,
        born: now3,
      };
      effectsManagerRef.current.triggerDeath(
        `leader-${tileX}-${tileY}`,
        tileX,
        tileY,
      );
      effectsManagerRef.current.triggerShake(12);
    },
    [tileCenter],
  );
  // Marks the player's first MP/AP-spending action. If a challenge was offered
  // but not yet accepted, dismiss the offer (accept window has elapsed).
  const markFirstAction = useCallback(() => {
    firstActionTakenRef.current = true;
    if (!challengeAcceptedRef.current && currentChallenge) {
      setCurrentChallenge(null);
    }
  }, [currentChallenge]);
  const attackNearestEnemy = useCallback(() => {
    if (
      !inBattle ||
      battleActionMode !== "attack" ||
      !selectedSpellIdRef.current
    )
      return;
    markFirstAction();
    const spell = activeSpells.find((s) => s.id === selectedSpellIdRef.current);
    if (!spell) return;
    // Arcane Surge: spells cost 1 less AP (minimum 1) — matches handleCanvasClick
    const apCost = mapModifierRegistry.applyApCost(
      Number(spell.apCost),
      activeMapModifierTypes,
      { log: (msg: string) => logDebugInfo("MODIFIER", msg), rng: Math.random },
    );
    if (currentBattleAp < apCost) return;
    const isHealSpell =
      spell.targetType === "self" && spell.effectType === "heal";
    // Determine gridPos: player tile for heal spells (engine's heal branch
    // requires isPlayerTile), nearest-enemy tile otherwise.
    let gridPos: { x: number; y: number };
    if (isHealSpell) {
      gridPos = { x: playerPosition.x, y: playerPosition.y };
    } else {
      const effectiveRange = getEffectiveSpellRange(
        Math.max(1, Number(spell.range)),
      );
      // Find closest enemy within Chebyshev range
      let nearest: (typeof enemies)[0] | null = null;
      let nearestDist = Number.POSITIVE_INFINITY;
      for (const e of enemies) {
        const dx = Math.abs(e.x - playerPosition.x);
        const dy = Math.abs(e.y - playerPosition.y);
        const dist = Math.max(dx, dy);
        if (dist <= effectiveRange && dist < nearestDist) {
          nearest = e;
          nearestDist = dist;
        }
      }
      if (!nearest) {
        setNoTargetFlash(true);
        setTimeout(() => setNoTargetFlash(false), 1200);
        return;
      }
      gridPos = { x: nearest.x, y: nearest.y };
    }
    castRuntimeRef.current.apCost = apCost;
    castRuntimeRef.current.spell = spell;
    if (spell.isSummon) {
      logDebugInfo("SUMMON", "cast handler received summon spell", {
        spellId: spell.id,
        gridPos,
      });
    }
    const castResult = resolvePlayerCast(spell, gridPos, playerSpellContext());
    if (castResult === "cast") {
      setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
      markFirstAction();
      challengeMaxApThisTurnRef.current += apCost;
      if (
        Math.max(
          Math.abs(gridPos.x - playerPosition.x),
          Math.abs(gridPos.y - playerPosition.y),
        ) > 2
      )
        challengeDirectHitRef.current = false;
      if (spell.targetType === "self" && spell.effectType === "heal") {
        challengeHealUsedRef.current = true;
      }
      if (spell.cooldown && spell.cooldown > 0) {
        spellCooldownsRef.current.set(spell.id, spell.cooldown as number);
        setSpellCooldownVersion((v) => v + 1);
      }
      if (currentBattleAp - apCost <= 0) {
        selectedSpellIdRef.current = null;
        setSpellSelectionVersion((v) => v + 1);
        spellRangeCacheRef.current.clear();
        setBattleActionMode("walk");
      }
    } else if (castResult === "fizzled") {
      setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
      markFirstAction();
      if (
        Math.max(
          Math.abs(gridPos.x - playerPosition.x),
          Math.abs(gridPos.y - playerPosition.y),
        ) > 2
      )
        challengeDirectHitRef.current = false;
      if (currentBattleAp - apCost <= 0) {
        selectedSpellIdRef.current = null;
        setSpellSelectionVersion((v) => v + 1);
        spellRangeCacheRef.current.clear();
        setBattleActionMode("walk");
      }
    } else if (castResult === "summon") {
      // FIX #3 (summon AP cost): deduct apCost + markFirstAction + set
      // cooldown, mirroring the "cast" branch. challengeDirectHitRef is
      // owned by another task — do NOT touch it here.
      setCurrentBattleAp((prev) => Math.max(0, prev - apCost));
      markFirstAction();
      challengeMaxApThisTurnRef.current += apCost;
      if (spell.cooldown && spell.cooldown > 0) {
        spellCooldownsRef.current.set(spell.id, spell.cooldown as number);
        setSpellCooldownVersion((v) => v + 1);
      }
      if (currentBattleAp - apCost <= 0) {
        selectedSpellIdRef.current = null;
        setSpellSelectionVersion((v) => v + 1);
        spellRangeCacheRef.current.clear();
        setBattleActionMode("walk");
      }
    }
    // "no_ap" | "abort" → no further action
  }, [
    inBattle,
    battleActionMode,
    activeSpells,
    currentBattleAp,
    activeMapModifierTypes,
    enemies,
    playerPosition,
    getEffectiveSpellRange,
    playerSpellContext,
    markFirstAction,
  ]);
  const [noTargetFlash, setNoTargetFlash] = useState(false);
  // Show game over modal
  if (showGameOver) {
    return (
      <div
        className="fixed inset-0"
        style={{ zIndex: 200, background: "transparent" }}
      >
        <GameOverModal
          isOpen={showGameOver}
          onRespawn={handleRespawn}
          xpLost={deathPenalty.xpLost}
          dokaLost={deathPenalty.dokaLost}
        />
      </div>
    );
  }
  if (!currentMap) {
    return (
      <div
        className="fixed inset-0"
        style={{ zIndex: 30, background: "transparent" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-20 w-20 border-b-2 mx-auto mb-4"
              style={{ borderColor: "var(--dofus-border-gold)" }}
            />
            <p style={{ color: "var(--dofus-text-silver)" }}>
              Generating world...
            </p>
          </div>
        </div>
      </div>
    );
  }
  const pieceLabels: Record<ChessPieceType, string> = {
    king: "King",
    queen: "Queen",
    pawn: "Pawn",
    rook: "Rook",
    bishop: "Bishop",
    knight: "Knight",
  };
  if (!character) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0d0f1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ color: "#c0392b", fontSize: 18, fontFamily: "monospace" }}
        >
          Loading character…
        </div>
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 30, background: "transparent" }}
    >
      {/* Game canvas fills the ENTIRE screen behind UI panels */}
      {/* DOFUS-style top bar — fixed overlay at top */}
      <div
        className="dofus-panel-header flex items-center justify-between px-3 h-11"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "44px",
          zIndex: 100,
          pointerEvents: "auto",
        }}
      >
        <div className="flex items-center space-x-2">
          {/* Character name + level badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(200,150,42,0.08)",
              border: "1px solid var(--dofus-border-gold-dim)",
              borderRadius: 4,
              padding: "2px 8px",
            }}
          >
            <span
              style={{
                color: "var(--dofus-text-gold)",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {characterName}
            </span>
            <span
              style={{
                background: "rgba(200,150,42,0.2)",
                border: "1px solid var(--dofus-border-gold-dim)",
                color: "var(--dofus-text-gold)",
                fontSize: 10,
                padding: "1px 5px",
                borderRadius: 3,
                fontWeight: 700,
              }}
            >
              Lv.{characterStats.level}
            </span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "rgba(200,150,42,0.12)",
              border: "1px solid var(--dofus-border-gold-dim)",
              color: "var(--dofus-text-dim)",
              fontSize: 10,
            }}
          >
            Map #{mapCount}
          </span>
          {/* EXP8: Dungeon Chain indicator */}
          {dungeonChainActive && (
            <span
              className="text-xs px-2 py-0.5 rounded animate-pulse"
              style={{
                background: "rgba(139,0,0,0.35)",
                border: "1px solid #cc0000",
                color: "#ff6060",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              ⚔️ Dungeon {dungeonChainDepth}/{dungeonChainMaxDepth}
            </span>
          )}
          {bossRushState.active && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 200,
                background: "rgba(180,0,120,0.85)",
                border: "1px solid #FF69B4",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontFamily: "monospace",
                boxShadow: "0 0 12px rgba(255,105,180,0.6)",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              Boss Rush — Room {bossRushState.currentRoom + 1} / 10
            </div>
          )}
          {currentZoneTier > 0 && (
            <button
              type="button"
              onClick={() => setShowZoneLockPopup(true)}
              style={{
                position: "fixed",
                bottom: 80,
                right: 16,
                zIndex: 100,
                background: "rgba(20,0,0,0.85)",
                border: "1px solid #8b0000",
                color: "#ff6666",
                padding: "6px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "monospace",
                boxShadow: "0 0 8px rgba(180,0,0,0.4)",
                userSelect: "none",
              }}
            >
              Zone Tier {currentZoneTier}
              {zoneLockEnabled ? " 🔒" : ""}
            </button>
          )}
          {showZoneLockPopup && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                zIndex: 10000,
                background: "rgba(10,0,0,0.95)",
                border: "1px solid #8b0000",
                borderRadius: "12px",
                padding: "24px",
                minWidth: "280px",
                boxShadow: "0 0 24px rgba(180,0,0,0.6)",
              }}
            >
              <h3
                style={{
                  color: "#ff4444",
                  margin: "0 0 16px 0",
                  fontSize: "16px",
                }}
              >
                Zone Lock
              </h3>
              <p
                style={{
                  color: "#aaa",
                  fontSize: "12px",
                  marginBottom: "16px",
                }}
              >
                When locked, the next map stays at Zone Tier {currentZoneTier}.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ color: "#ccc", fontSize: "14px" }}>
                  Lock Zone
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const v = !zoneLockEnabled;
                    setZoneLockEnabled(v);
                    localStorage.setItem("aestralto_zone_locked", String(v));
                  }}
                  style={{
                    background: zoneLockEnabled ? "#6b0000" : "#333",
                    color: "#fff",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {zoneLockEnabled ? "ON" : "OFF"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowZoneLockPopup(false)}
                style={{
                  background: "transparent",
                  color: "#666",
                  border: "1px solid #333",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Close
              </button>
            </div>
          )}
          {transitionInProgressRef.current && (
            <span
              className="text-xs animate-pulse px-2 py-0.5 rounded"
              style={{
                color: "var(--dofus-text-gold)",
                background: "rgba(200,150,42,0.2)",
              }}
            >
              Portal...
            </span>
          )}
        </div>
        {/* XP bar center */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            maxWidth: 320,
            margin: "0 12px",
          }}
        >
          <span
            style={{
              color: "#9b59b6",
              fontSize: 10,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            XP
          </span>
          <div
            style={{
              flex: 1,
              height: 8,
              background: "#1a0d2e",
              border: "1px solid #4a2a6a",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, (characterStats.exp / characterStats.expToNext) * 100)}%`,
                background: "linear-gradient(90deg, #6b21a8, #a855f7)",
                borderRadius: 4,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span
            style={{
              color: "var(--dofus-xp-color)",
              fontSize: 10,
              whiteSpace: "nowrap",
            }}
          >
            {characterStats.exp}/{characterStats.expToNext}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginLeft: "8px",
          }}
        >
          <span
            style={{
              color: "#cc0000",
              fontSize: "10px",
              fontWeight: "bold",
              textShadow: "0 0 4px #8b0000",
            }}
          >
            BLOOD
          </span>
          <div
            style={{
              width: "60px",
              height: "8px",
              background: "#1a0000",
              border: "1px solid #8b0000",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${bloodBalance}%`,
                height: "100%",
                background: "linear-gradient(90deg, #8b0000, #cc0000)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span
            style={{ color: "#cc0000", fontSize: "10px", fontWeight: "bold" }}
          >
            {bloodBalance}
          </span>
        </div>
        {/* Doka balance chip + Shop button */}
        <div className="flex items-center gap-1.5">
          <span className="stone-pill stone-pill-gold text-[10px] font-bold whitespace-nowrap min-w-[60px] justify-center">
            💰 {dokaBalance.toLocaleString()}
          </span>
          <button
            type="button"
            data-ocid="shop.open_modal_button"
            onClick={() => {
              setShowShop(true);
              setShopStep("packages");
            }}
            title="Buy Doka"
            style={{
              background: "linear-gradient(135deg,#6a0a0a,#c0392b)",
              border: "1px solid #e74c3c",
              borderRadius: 4,
              color: "#fde",
              padding: "2px 6px",
              fontSize: 11,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              boxShadow: "0 0 6px rgba(192,57,43,0.3)",
            }}
          >
            <ShoppingCart style={{ width: 10, height: 10 }} />
          </button>
        </div>
        {/* Region name on right of center */}
        <span
          style={{
            background: "rgba(52,152,219,0.14)",
            border: "1px solid #2a6a9a",
            color: "#74b9ff",
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          {currentMap.levelZone?.name ?? "Unknown"}
        </span>
        <button
          type="button"
          onClick={() => {
            cameraVelocityRef.current = { x: 0, y: 0 };
            updateCameraToFollowPlayer();
          }}
          className="flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors"
          style={{
            background: "rgba(200,150,42,0.1)",
            border: "1px solid var(--dofus-border-gold-dim)",
            color: "var(--dofus-text-dim)",
          }}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Center</span>
        </button>
        <button
          type="button"
          data-ocid="enemy_register.open_modal_button"
          onClick={() => setShowEnemyRegister(true)}
          className="flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors"
          style={{
            background: "rgba(200,50,50,0.1)",
            border: "1px solid var(--dofus-border-gold-dim)",
            color: "var(--dofus-text-dim)",
          }}
        >
          <span>Enemies</span>
        </button>
      </div>

      {/* Canvas area — fills entire screen from top-44 to bottom, left-0 to right-224 (sidebar) */}
      <div
        ref={canvasAreaRef}
        style={{
          position: "fixed",
          top: "44px",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 30,
          overflow: "hidden",
        }}
      >
        {/* MapModifiersPanel is now a draggable overlay */}
        <MapModifiersPanel
          modifiers={mapModifiers.filter((m) =>
            activeMapModifierTypes.has(m.modifierType),
          )}
          userId={userId}
        />
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onKeyDown={undefined}
          tabIndex={0}
          aria-label="World exploration canvas"
          className="cursor-pointer"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
            background: "transparent",
            outline: "none",
          }}
          onTouchEnd={handleCanvasTouch}
        />

        {/* Achievements panel is now rendered from GameFlow.tsx */}

        {/* EXP6: Item (Buff) Shop draggable panel */}
        <BuffShop
          dokaBalance={dokaBalance}
          onDeductDoka={(amount) =>
            onDokaBalanceChange(Math.max(0, dokaBalance - amount))
          }
          onUseItem={handleUseItem}
          isPlayerTurn={battlePhase === "player" && inBattle}
          inBattle={inBattle}
          userId={userId}
          principalId={userId}
        />

        {/* Achievement toast — world explorer only (not during battle) */}
        {!inBattle && pendingAchievementToast && (
          <AchievementToast
            achievement={pendingAchievementToast}
            onDismiss={() => setPendingAchievementToast(null)}
          />
        )}

        {/* Jackpot Heal banner — centered on screen, fades after 3s */}
        {jackpotHealVisible && (
          <div
            data-ocid="stats.jackpot_heal_banner"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              pointerEvents: "none",
              animation: "pbv-jackpot-fade 3s ease-out forwards",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(20,10,0,0.9))",
                border: "2px solid #FFD700",
                borderRadius: 12,
                padding: "18px 32px",
                boxShadow:
                  "0 0 40px rgba(255,215,0,0.7), 0 0 80px rgba(255,215,0,0.3)",
                fontFamily: "serif",
              }}
            >
              <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 6 }}>
                🎰
              </div>
              <div
                style={{
                  color: "#FFD700",
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textShadow:
                    "0 0 20px rgba(255,215,0,0.9), 0 2px 4px rgba(0,0,0,0.8)",
                  textTransform: "uppercase" as const,
                }}
              >
                JACKPOT HEAL!
              </div>
              <div
                style={{
                  color: "#ffe080",
                  fontSize: 13,
                  marginTop: 6,
                  fontFamily: "sans-serif",
                }}
              >
                Full HP restored ✨
              </div>
            </div>
          </div>
        )}

        {/* BOSS ENCOUNTER banner */}
        {bossEncounterBanner && (
          <div
            data-ocid="boss.encounter_banner"
            style={{
              position: "fixed",
              top: 56,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9000,
              background:
                "linear-gradient(135deg, rgba(88,28,135,0.95), rgba(147,51,234,0.85))",
              border: "2px solid #9333ea",
              borderRadius: 10,
              padding: "12px 28px",
              boxShadow:
                "0 0 40px rgba(147,51,234,0.7), 0 4px 20px rgba(0,0,0,0.6)",
              color: "#e2aeff",
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textAlign: "center",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              animation: "pbv-boss-banner 1.5s ease forwards",
            }}
          >
            {bossEncounterBanner}
          </div>
        )}
        <style>{`
          @keyframes pbv-boss-banner {
            0%   { opacity: 0; transform: translateX(-50%) scale(0.8); }
            15%  { opacity: 1; transform: translateX(-50%) scale(1.05); }
            70%  { opacity: 1; transform: translateX(-50%) scale(1); }
            100% { opacity: 0; transform: translateX(-50%) scale(0.95); }
          }
          @keyframes pbv-jackpot-fade {
            0%   { opacity: 0; transform: translate(-50%, -60%) scale(0.8); }
            15%  { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            70%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -44%) scale(0.95); }
          }
        `}</style>
      </div>

      {/* DOFUS-style right side panel — draggable overlay */}
      <DraggablePanel
        panelId="stats-panel"
        title="Stats"
        userId={userId}
        defaultPosition={{ x: Math.max(0, window.innerWidth - 234), y: 54 }}
        defaultFolded={false}
        zIndex={100}
        style={{ width: 224 }}
      >
        <div
          className="dofus-scrollbar"
          style={{
            width: "224px",
            background: "linear-gradient(180deg, #0d0f1a 0%, #0a0c14 100%)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
            maxHeight: "85vh",
          }}
        >
          {/* Character portrait section */}
          <div
            style={{
              borderBottom: "1px solid var(--dofus-border-gold-dim)",
              padding: 0,
            }}
          >
            {/* Gold section header */}
            <div className="dofus-section-header">
              ♟ {pieceLabels[pieceType]}
            </div>
            <div style={{ padding: "8px 10px 10px" }}>
              {/* Portrait + name row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                {/* Portrait canvas with gold frame */}
                <div
                  className="dofus-portrait-frame"
                  style={{ width: 60, height: 60, flexShrink: 0 }}
                >
                  <canvas
                    ref={portraitCanvasRef}
                    width={60}
                    height={60}
                    style={{ display: "block", imageRendering: "pixelated" }}
                  />
                </div>
                {/* Name + level + class */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: "var(--dofus-text-gold)",
                      fontWeight: 800,
                      fontSize: 13,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {characterName}
                    </span>
                    {!inBattle && (
                      <button
                        type="button"
                        data-ocid="stats.rename_button"
                        title="Rename (100 Doka)"
                        onClick={() => {
                          setRenameInput(characterName);
                          setShowRenameModal(true);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: 2,
                          cursor: "pointer",
                          color: "#c0392b",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Pencil style={{ width: 10, height: 10 }} />
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      className="dofus-badge dofus-badge-gold"
                      style={{ fontSize: 10 }}
                    >
                      Lv. {characterStats.level}
                    </span>
                    <span
                      style={{ color: "var(--dofus-text-dim)", fontSize: 10 }}
                    >
                      {pieceLabels[pieceType]}
                    </span>
                  </div>
                  {/* XP bar */}
                  <div className="dofus-xp-bar">
                    <div
                      className="dofus-xp-bar-fill"
                      style={{
                        width: `${Math.min(100, (characterStats.exp / characterStats.expToNext) * 100)}%`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 2,
                    }}
                  >
                    <span style={{ color: "#9b59b6", fontSize: 9 }}>
                      {characterStats.exp} XP
                    </span>
                    <span
                      style={{ color: "var(--dofus-text-dim)", fontSize: 9 }}
                    >
                      /{characterStats.expToNext}
                    </span>
                  </div>
                </div>
              </div>
              {/* Coordinates */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 9,
                  color: "var(--dofus-text-dim)",
                }}
              >
                <span>
                  📍 ({playerPosition.x}, {playerPosition.y})
                </span>
                <span style={{ color: "#74b9ff" }}>
                  {currentMap.levelZone?.name ?? "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Vital stats orbs — enlarged, prominent */}
          <div
            style={{
              borderBottom: "1px solid var(--dofus-border-gold-dim)",
              padding: 0,
            }}
          >
            <div className="dofus-section-header">Vitals</div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "8px 10px 12px",
                gap: 6,
              }}
            >
              {[
                {
                  cls: "dofus-hp-orb",
                  label: "HP",
                  value: characterStats.hp,
                  max: 100,
                },
                {
                  cls: "dofus-ap-orb",
                  label: "AP",
                  value: inBattle ? currentBattleAp : characterStats.ap,
                  max: 6,
                },
                {
                  cls: "dofus-mp-orb",
                  label: "MP",
                  value: inBattle ? currentBattleMp : characterStats.mp,
                  max: 4,
                },
              ].map((orb) => (
                <div
                  key={orb.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <div className={`dofus-orb dofus-orb-lg ${orb.cls}`}>
                    <span
                      style={{ fontSize: 14, fontWeight: 800, lineHeight: 1 }}
                    >
                      {orb.value}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        opacity: 0.7,
                        lineHeight: 1,
                        marginTop: 1,
                      }}
                    >
                      {orb.label}
                    </span>
                  </div>
                  {/* Mini bar below orb */}
                  <div
                    style={{
                      width: 40,
                      height: 3,
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(100, (orb.value / orb.max) * 100)}%`,
                        background:
                          orb.label === "HP"
                            ? "#e74c3c"
                            : orb.label === "AP"
                              ? "#3498db"
                              : "#27ae60",
                        borderRadius: 2,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Player active status effects */}
            {inBattle && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                  padding: "4px 10px 8px",
                  borderBottom: "1px solid var(--dofus-border-gold-dim)",
                }}
              >
                {activeEffects
                  .filter((e) => e.targetId === "player")
                  .map((eff, index) => (
                    <StatusEffectBadge
                      key={
                        eff.stackId ??
                        eff.id ??
                        `${eff.targetId}-${eff.effectName}-${index}`
                      }
                      effect={eff}
                      isPlayer
                    />
                  ))}
                {activeEffects.filter((e) => e.targetId === "player").length ===
                  0 && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--dofus-text-dim)",
                      opacity: 0.6,
                    }}
                  >
                    No active effects
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Doka-to-HP healing — only outside battle, when HP is not full */}
          {!inBattle && characterStats.hp < maxHp && (
            <div
              style={{
                borderBottom: "1px solid var(--dofus-border-gold-dim)",
                padding: "6px 10px 8px",
              }}
            >
              {(() => {
                const hpNeeded = maxHp - characterStats.hp;
                const cost = Math.ceil(hpNeeded / 3);
                const canAfford = dokaBalance >= 1;
                const healHp = Math.min(hpNeeded, Math.floor(dokaBalance * 3));
                const actualCost = Math.ceil(healHp / 3);
                return (
                  <button
                    type="button"
                    data-ocid="stats.heal_with_doka_button"
                    disabled={!canAfford}
                    title={
                      canAfford
                        ? `Heal ${hpNeeded} HP (costs ${cost} Doka)`
                        : "Not enough Doka"
                    }
                    onClick={() => {
                      if (!canAfford) return;

                      // 🎰 Jackpot heal: 0.5% chance of full HP restore
                      const isJackpot = Math.random() < 0.005;
                      if (isJackpot) {
                        // Full heal — only spend 1 Doka for the jackpot
                        setCharacterStats((prev) => ({ ...prev, hp: maxHp }));
                        onDokaBalanceChange(Math.max(0, dokaBalance - 1));
                        // Banner
                        setJackpotHealVisible(true);
                        if (jackpotHealTimerRef.current)
                          clearTimeout(jackpotHealTimerRef.current);
                        jackpotHealTimerRef.current = setTimeout(
                          () => setJackpotHealVisible(false),
                          3000,
                        );
                        // Log to battle log (shows in general chat channel too)
                        logBattleEntry(
                          "🎰 [JACKPOT] Full HP restore from a Doka exchange!",
                          "#FFD700",
                        );
                        toast.success("🎰 JACKPOT HEAL! Full HP restored!", {
                          duration: 4000,
                        });
                        // Auto-save
                        if (actor) {
                          actor
                            .updateCharacter(BigInt(characterSlot), {
                              name: characterName,
                              pieceType,
                              colors: [
                                colors.primary,
                                colors.secondary,
                                colors.accent,
                              ],
                              pixelPattern: "",
                              rotation: BigInt(0),
                              level: BigInt(characterStats.level),
                              experience: BigInt(characterStats.exp),
                              dokaBalance: BigInt(Math.max(0, dokaBalance - 1)),
                              stats: {
                                hp: BigInt(maxHp),
                                ap: BigInt(characterStats.ap),
                                mp: BigInt(characterStats.mp),
                                sp: BigInt(characterStats.sp),
                                sr: BigInt(characterStats.sr),
                                init: BigInt(characterStats.init),
                                res: BigInt(characterStats.res),
                                chc: BigInt(characterStats.chc),
                                atk: BigInt(0),
                                resilience: BigInt(0),
                                evasion: BigInt(0),
                                killCount: BigInt(
                                  character?.stats?.killCount ?? 0,
                                ),
                              },
                              spellLevelKeys: Object.keys(spellLevels),
                              spellLevelValues: Object.keys(spellLevels).map(
                                (k) => BigInt(spellLevels[k] ?? 0),
                              ),
                            })
                            .catch((e: unknown) =>
                              console.error("[jackpot-heal save]", e),
                            );
                        }
                        return;
                      }

                      // Normal heal path
                      const hpToAdd = healHp;
                      const dokaCost = actualCost;
                      setCharacterStats((prev) => ({
                        ...prev,
                        hp: Math.min(maxHp, prev.hp + hpToAdd),
                      }));
                      challengeHealUsedRef.current = true;
                      onDokaBalanceChange(Math.max(0, dokaBalance - dokaCost));
                      // Auto-save
                      if (actor) {
                        const newHp = Math.min(
                          maxHp,
                          characterStats.hp + hpToAdd,
                        );
                        const newDoka = Math.max(0, dokaBalance - dokaCost);
                        actor
                          .updateCharacter(BigInt(characterSlot), {
                            name: characterName,
                            pieceType,
                            colors: [
                              colors.primary,
                              colors.secondary,
                              colors.accent,
                            ],
                            pixelPattern: "",
                            rotation: BigInt(0),
                            level: BigInt(characterStats.level),
                            experience: BigInt(characterStats.exp),
                            dokaBalance: BigInt(newDoka),
                            stats: {
                              hp: BigInt(newHp),
                              ap: BigInt(characterStats.ap),
                              mp: BigInt(characterStats.mp),
                              sp: BigInt(characterStats.sp),
                              sr: BigInt(characterStats.sr),
                              init: BigInt(characterStats.init),
                              res: BigInt(characterStats.res),
                              chc: BigInt(characterStats.chc),
                              atk: BigInt(0),
                              resilience: BigInt(0),
                              evasion: BigInt(0),
                              killCount: BigInt(
                                character?.stats?.killCount ?? 0,
                              ),
                            },
                            spellLevelKeys: Object.keys(spellLevels),
                            spellLevelValues: Object.keys(spellLevels).map(
                              (k) => BigInt(spellLevels[k] ?? 0),
                            ),
                          })
                          .catch((e: unknown) =>
                            console.error("[doka-heal save]", e),
                          );
                      }
                      // Toast
                      toast.success(
                        `Healed +${hpToAdd} HP (-${dokaCost} Doka)`,
                      );
                    }}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      borderRadius: 5,
                      border: canAfford
                        ? "1px solid rgba(241,196,15,0.5)"
                        : "1px solid rgba(100,100,100,0.3)",
                      background: canAfford
                        ? "rgba(241,196,15,0.08)"
                        : "rgba(60,60,60,0.15)",
                      color: canAfford ? "#f1c40f" : "#555",
                      cursor: canAfford ? "pointer" : "not-allowed",
                      fontSize: 10,
                      fontWeight: 700,
                      textAlign: "center" as const,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {canAfford
                      ? `♥ Heal ${healHp} HP → ${actualCost} Doka (1:3)`
                      : "♥ Heal (Need Doka)"}
                  </button>
                );
              })()}
            </div>
          )}
          <div
            style={{
              borderBottom: "1px solid var(--dofus-border-gold-dim)",
              padding: 0,
            }}
          >
            <div className="dofus-section-header">Statistics</div>
            <div style={{ padding: "4px 10px 10px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "3px 8px",
                }}
              >
                {[
                  {
                    label: "SP",
                    value: characterStats.sp,
                    color: "#b39ddb",
                    icon: "✨",
                  },
                  {
                    label: "SR",
                    value: `${characterStats.sr}%`,
                    color: "#4dd0e1",
                    icon: "🛡️",
                  },
                  {
                    label: "INIT",
                    value: characterStats.init,
                    color: "#f48fb1",
                    icon: "⚡",
                  },
                  {
                    label: "RES",
                    value: `${characterStats.res}%`,
                    color: "#80cbc4",
                    icon: "\uD83D\uDEE1\uFE0F",
                  },
                  {
                    label: "CHC",
                    value: `${characterStats.chc}%`,
                    color: "#ffcc02",
                    icon: "\uD83C\uDFAF",
                  },
                  {
                    label: "FAIL",
                    value: `${spellFailChance.toFixed(1)}%`,
                    color: "#AAAAAA",
                    icon: "\u274C",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="dofus-stat-row"
                    style={{
                      padding: "2px 4px",
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--dofus-text-dim)",
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {stat.icon} {stat.label}
                    </span>
                    <span
                      style={{
                        color: stat.color,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map info */}
          <div
            style={{
              borderBottom: "1px solid var(--dofus-border-gold-dim)",
              padding: 0,
            }}
          >
            <div className="dofus-section-header">Map Info</div>
            <div style={{ padding: "4px 10px 10px" }}>
              <div className="space-y-1 text-xs">
                <div className="dofus-stat-row">
                  <span className="dofus-stat-label">Zone</span>
                  <span
                    className="dofus-badge dofus-badge-blue"
                    style={{ fontSize: 9 }}
                  >
                    {currentMap.levelZone?.name ?? "Unknown"}
                  </span>
                </div>
                <div className="dofus-stat-row">
                  <span className="dofus-stat-label">Level</span>
                  <span
                    style={{ color: "var(--dofus-text-silver)", fontSize: 11 }}
                  >
                    {currentMap.levelZone?.minLevel ?? 0}–
                    {currentMap.levelZone?.maxLevel ?? 9999}
                  </span>
                </div>
                <div className="dofus-stat-row">
                  <span className="dofus-stat-label">Maps</span>
                  <span
                    style={{ color: "var(--dofus-text-silver)", fontSize: 11 }}
                  >
                    #{mapCount}
                  </span>
                </div>
                <div className="dofus-stat-row">
                  <span className="dofus-stat-label">Portals</span>
                  <span style={{ color: "#b39ddb", fontSize: 11 }}>
                    {currentMap?.portals?.length ?? 0}
                  </span>
                </div>
                <div className="dofus-stat-row">
                  <span className="dofus-stat-label">Enemies</span>
                  <span
                    className="dofus-badge dofus-badge-red"
                    style={{ fontSize: 9 }}
                  >
                    {enemies.length} left
                  </span>
                </div>
                <div className="dofus-stat-row">
                  <span
                    className="dofus-stat-label"
                    style={{ color: "#f1c40f" }}
                  >
                    💰 Doka
                  </span>
                  <span
                    style={{ color: "#f1c40f", fontSize: 11, fontWeight: 700 }}
                  >
                    {dokaBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enemy tracker */}
          {enemies.length > 0 && (
            <div
              style={{
                borderBottom: "1px solid var(--dofus-border-gold-dim)",
                padding: 0,
              }}
            >
              <div
                className="dofus-section-header"
                style={{ color: "#ff7675" }}
              >
                ☠️ Enemies ({enemies.length})
              </div>
              <div
                className="dofus-scrollbar"
                style={{
                  padding: "4px 10px 10px",
                  maxHeight: 110,
                  overflowY: "auto",
                }}
              >
                {enemies.map((enemy, index) => (
                  <div
                    key={enemy.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "3px 4px",
                      borderRadius: 3,
                      marginBottom: 2,
                      background: enemy.isMoving
                        ? "rgba(85,239,196,0.05)"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${enemy.isMoving ? "rgba(85,239,196,0.15)" : "transparent"}`,
                    }}
                  >
                    <span
                      style={{ color: "var(--dofus-text-dim)", fontSize: 10 }}
                    >
                      ♖ {pieceLabels[enemy.pieceType]} #{index + 1}
                    </span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {/* Enemy active status effects */}
                      {activeEffects.filter((e) => e.targetId === enemy.id)
                        .length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 3,
                            marginLeft: 4,
                          }}
                        >
                          {activeEffects
                            .filter((e) => e.targetId === enemy.id)
                            .map((eff, index) => (
                              <StatusEffectBadge
                                key={
                                  eff.stackId ??
                                  eff.id ??
                                  `${eff.targetId}-${eff.effectName}-${index}`
                                }
                                effect={eff}
                              />
                            ))}
                        </div>
                      )}
                      <span
                        className="dofus-badge"
                        style={{
                          background: "rgba(200,150,42,0.12)",
                          border: "1px solid var(--dofus-border-gold-dim)",
                          color: (() => {
                            const playerLvl = characterStats?.level ?? 1;
                            const diff = Number(enemy.level) - playerLvl;
                            return diff <= 0
                              ? "#00e676"
                              : diff <= 10
                                ? "#ff9800"
                                : diff <= 100
                                  ? "#f44336"
                                  : "#ce93d8";
                          })(),
                          fontSize: 8,
                          padding: "1px 5px",
                        }}
                      >
                        Lv.{enemy.level}
                      </span>
                      {enemy.isMoving && (
                        <span
                          className="animate-pulse"
                          style={{ color: "#55efc4", fontSize: 8 }}
                        >
                          ●
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer credit */}
          <div
            className="mt-auto p-3 text-center"
            style={{ borderTop: "1px solid var(--dofus-border-gold-dim)" }}
          >
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-xs transition-colors"
              style={{ color: "var(--dofus-text-dim)" }}
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </DraggablePanel>

      {/* BATTLE badge — top-left of canvas area when inBattle */}
      {/* BATTLE badge — top-left of canvas area when inBattle */}
      {inBattle && (
        <div
          data-ocid="battle.badge"
          className="animate-pulse"
          style={{
            position: "fixed",
            top: "52px",
            left: "8px",
            zIndex: 110,
            background: "rgba(180,10,10,0.92)",
            border: "2px solid rgba(255,60,60,0.8)",
            borderRadius: 6,
            padding: "3px 10px",
            color: "#fff",
            fontWeight: 900,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            boxShadow: "0 0 18px rgba(200,0,0,0.55)",
            pointerEvents: "none",
          }}
        >
          ⚔️ BATTLE
        </div>
      )}

      {/* Battle UI Panel — always visible; battle-only sections gated by inBattle prop */}
      <BattleUIPanel
        inBattle={inBattle}
        activeSpells={activeSpells}
        selectedSpellIdRef={selectedSpellIdRef}
        spellSelectionVersion={spellSelectionVersion}
        hasSelectedSpell={!!selectedSpellIdRef.current}
        onSelectSpell={(id) => {
          if (!inBattle || currentBattleAp > 0) {
            selectedSpellIdRef.current = id;
            setSpellSelectionVersion((v) => v + 1);
            spellRangeCacheRef.current.clear();
            if (inBattle) setBattleActionMode("attack");
          }
        }}
        onOpenSpellbook={() => setSpellbookOpen(true)}
        onAttackNearest={attackNearestEnemy}
        canAttackNearest={
          inBattle &&
          battleActionMode === "attack" &&
          !!selectedSpellIdRef.current &&
          currentBattleAp >=
            (activeSpells.find((s) => s.id === selectedSpellIdRef.current)
              ? Number(
                  activeSpells.find((s) => s.id === selectedSpellIdRef.current)!
                    .apCost,
                )
              : 999) &&
          enemies.some((e) => {
            const spell = activeSpells.find(
              (s) => s.id === selectedSpellIdRef.current,
            );
            const range = spell ? Math.max(1, Number(spell.range)) : 0;
            return (
              Math.max(
                Math.abs(e.x - playerPosition.x),
                Math.abs(e.y - playerPosition.y),
              ) <= range
            );
          })
        }
        isMobile={isMobile}
        turnOrder={turnOrder.map((c) => {
          if (c.type === "player") {
            return {
              ...c,
              ap: currentBattleAp,
              mp: currentBattleMp,
              atk: 0,
              res: characterStats.res,
              sp: characterStats.sp,
              chc: characterStats.chc,
            };
          }
          const e = enemies.find((en) => en.id === c.id);
          return {
            ...c,
            ...resolveEnemyApMp(e, c.level),
            atk: e ? e.level * 2 : 0,
            res: 0,
            sp: 0,
            chc: 2,
            spells: e?.spells,
            enraged: enragedEnemies.has(c.id),
          };
        })}
        currentTurnIndex={currentTurnIndex}
        battlePhase={battlePhase}
        battleTurn={battleTurn}
        turnTimeLeft={turnTimeLeft}
        battleActionMode={battleActionMode}
        onSetWalk={() => {
          setBattleActionMode("walk");
          selectedSpellIdRef.current = null;
          setSpellSelectionVersion((v) => v + 1);
          spellRangeCacheRef.current.clear();
        }}
        onSetAttack={() => {
          if (currentBattleAp > 0) setBattleActionMode("attack");
        }}
        currentBattleAp={currentBattleAp}
        currentBattleMp={currentBattleMp}
        onEndBattle={() => {
          // ── S2: RUN-THEMED FLEE CONFIRM ────────────────────────────────
          // Fleeing a battle inside an active dungeon or boss-rush run ends
          // the run (the player "falls"). Show a themed confirm dialog before
          // invoking the death flow so the choice is deliberate. In free
          // exploration, fleeing proceeds with no extra prompt.
          const _s2RunActive =
            bossRushActiveRef.current || dungeonChainActiveRef.current;
          if (_s2RunActive) {
            const _s2RunName = bossRushActiveRef.current
              ? "Boss Rush"
              : "Dungeon Chain";
            const _s2Confirmed = window.confirm(
              `Fleeing ends your ${_s2RunName} run — you will fall. Continue?`,
            );
            if (!_s2Confirmed) return;
          }
          _handlePlayerDeath();
        }}
        onEndTurn={() => {
          if (battlePhase !== "player") return;
          advanceTurn();
        }}
        spellCooldowns={
          spellCooldownVersion >= 0
            ? Object.fromEntries(spellCooldownsRef.current)
            : {}
        }
        userId={userId}
      />

      {/* "No target in range" flash */}
      {noTargetFlash && (
        <div
          data-ocid="battle.no_target_flash"
          style={{
            position: "fixed",
            top: "56px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 150,
            background: "rgba(160,10,10,0.92)",
            border: "1.5px solid rgba(255,60,60,0.8)",
            borderRadius: 8,
            padding: "6px 20px",
            color: "#ffaaaa",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.06em",
            boxShadow: "0 0 18px rgba(220,0,0,0.5)",
            pointerEvents: "none",
            animation: "fadeOut 1.2s ease-in forwards",
          }}
        >
          ⚠️ No target in range
        </div>
      )}

      {/* Spellbook modal */}
      {spellbookOpen && (
        <SpellbookModal
          allSpells={ownedSpells}
          activeSpells={activeSpells}
          onClose={() => setSpellbookOpen(false)}
          onSetActiveSpells={handleSetActiveSpells}
          dokaBalance={dokaBalance}
          spellLevels={spellLevels}
          onUpgradeSpell={handleUpgradeSpell}
        />
      )}

      {/* ── Rename Character Modal ────────────────────────────────────────────── */}
      {showRenameModal && (
        <div
          data-ocid="stats.rename_modal"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#141726",
              border: "2px solid #c0392b",
              borderRadius: 12,
              padding: 24,
              width: 320,
              boxShadow: "0 0 40px rgba(192,57,43,0.4)",
            }}
          >
            <h3
              style={{
                color: "#e74c3c",
                fontFamily: "serif",
                marginBottom: 8,
                fontSize: 16,
              }}
            >
              Rename Character
            </h3>
            <p style={{ color: "#6a7a8a", fontSize: 12, marginBottom: 16 }}>
              Cost: 100 Doka (you have {dokaBalance})
            </p>
            <input
              type="text"
              data-ocid="stats.rename_input"
              value={renameInput}
              maxLength={20}
              onChange={(e) => setRenameInput(e.target.value)}
              placeholder="New name"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#0d0f1a",
                border: "1px solid #8b1a1a",
                borderRadius: 6,
                color: "#e0e6f0",
                fontSize: 14,
                marginBottom: 12,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                data-ocid="stats.rename_cancel_button"
                onClick={() => setShowRenameModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: "#1a1e30",
                  border: "1px solid #2a3040",
                  borderRadius: 6,
                  color: "#6a7a8a",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="stats.rename_confirm_button"
                onClick={handleRenameCharacter}
                disabled={
                  isRenaming || !renameInput.trim() || dokaBalance < 100
                }
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background:
                    dokaBalance < 100
                      ? "rgba(192,57,43,0.2)"
                      : "linear-gradient(135deg,#6a0a0a,#c0392b)",
                  border: "1px solid #c0392b",
                  borderRadius: 6,
                  color: dokaBalance < 100 ? "rgba(231,76,60,0.5)" : "#fff",
                  cursor:
                    isRenaming || dokaBalance < 100 ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {isRenaming ? "Saving…" : "Confirm (100 Doka)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Doka Shop Modal ───────────────────────────────────────────────────── */}
      {showShop && (
        <div
          data-ocid="shop.dialog"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
          }}
        >
          <div
            style={{
              background: "#141726",
              border: "2px solid #c0392b",
              borderRadius: 14,
              padding: 28,
              width: "min(860px, 95vw)",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 0 60px rgba(192,57,43,0.5)",
              position: "relative",
            }}
          >
            <button
              type="button"
              data-ocid="shop.close_button"
              onClick={() => {
                setShowShop(false);
                setShopStep("packages");
                setSelectedPkg(null);
              }}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "transparent",
                border: "none",
                color: "#e74c3c",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <h2
              style={{
                color: "#e74c3c",
                fontFamily: "serif",
                marginBottom: 4,
                fontSize: 20,
              }}
            >
              Doka Shop
            </h2>
            <p style={{ color: "#6a7a8a", fontSize: 12, marginBottom: 20 }}>
              Purchase Doka to level up spells and exchange for healing.
            </p>

            {shopStep === "packages" && (
              <div>
                {[
                  [
                    { id: "pkg_10", dokaAmount: 10, priceEur: 1 },
                    { id: "pkg_100", dokaAmount: 100, priceEur: 3 },
                    { id: "pkg_250", dokaAmount: 250, priceEur: 5 },
                    { id: "pkg_500", dokaAmount: 500, priceEur: 8 },
                    { id: "pkg_1000", dokaAmount: 1000, priceEur: 15 },
                  ],
                  [
                    { id: "pkg_2500", dokaAmount: 2500, priceEur: 20 },
                    { id: "pkg_5000", dokaAmount: 5000, priceEur: 40 },
                    { id: "pkg_10000", dokaAmount: 10000, priceEur: 75 },
                    { id: "pkg_25000", dokaAmount: 25000, priceEur: 130 },
                    { id: "pkg_50000", dokaAmount: 50000, priceEur: 250 },
                  ],
                  [
                    { id: "pkg_100000", dokaAmount: 100000, priceEur: 400 },
                    { id: "pkg_200000", dokaAmount: 200000, priceEur: 700 },
                    { id: "pkg_400000", dokaAmount: 400000, priceEur: 1200 },
                    { id: "pkg_800000", dokaAmount: 800000, priceEur: 2000 },
                    { id: "pkg_1600000", dokaAmount: 1600000, priceEur: 3500 },
                  ],
                ].map((row) => (
                  <div
                    key={row[0].id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5,1fr)",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    {row.map((pkg) => (
                      <div
                        key={pkg.id}
                        style={{
                          background: "#0d0f1a",
                          border: "1px solid #8b1a1a",
                          borderRadius: 8,
                          padding: "12px 6px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            color: "#f1c40f",
                            fontWeight: 800,
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          💰 {pkg.dokaAmount.toLocaleString()}
                        </div>
                        <div
                          style={{
                            color: "#6a7a8a",
                            fontSize: 11,
                            marginBottom: 8,
                          }}
                        >
                          €{pkg.priceEur}
                        </div>
                        <button
                          type="button"
                          data-ocid={`shop.buy_button.${pkg.id}`}
                          onClick={() => {
                            setSelectedPkg(pkg);
                            setShopStep("form");
                            setShopCustomerData({});
                            setShopProofFile(null);
                          }}
                          style={{
                            width: "100%",
                            padding: "6px 0",
                            background:
                              "linear-gradient(135deg,#6a0a0a,#c0392b)",
                            border: "1px solid #c0392b",
                            borderRadius: 5,
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          Buy
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {shopStep === "form" && selectedPkg && (
              <div style={{ maxWidth: 480, margin: "0 auto" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                    background: "#0d0f1a",
                    border: "1px solid #8b1a1a",
                    borderRadius: 8,
                    padding: "12px 16px",
                  }}
                >
                  <span style={{ color: "#f1c40f", fontSize: 22 }}>💰</span>
                  <div>
                    <div
                      style={{
                        color: "#e74c3c",
                        fontWeight: 800,
                        fontSize: 15,
                      }}
                    >
                      {selectedPkg.dokaAmount.toLocaleString()} Doka
                    </div>
                    <div style={{ color: "#6a7a8a", fontSize: 12 }}>
                      €{selectedPkg.priceEur}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShopStep("packages")}
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      border: "1px solid #2a3040",
                      borderRadius: 4,
                      color: "#6a7a8a",
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                  >
                    ← Back
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0 16px",
                  }}
                >
                  {[
                    { key: "firstName", label: "First Name" },
                    { key: "lastName", label: "Last Name" },
                    { key: "email", label: "Email" },
                    { key: "address", label: "Address" },
                    { key: "city", label: "City" },
                    { key: "postalCode", label: "Postal Code" },
                    { key: "country", label: "Country" },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      style={{
                        marginBottom: 12,
                        gridColumn: key === "address" ? "1 / -1" : undefined,
                      }}
                    >
                      <label
                        htmlFor={`shop-field-${key}`}
                        style={{
                          display: "block",
                          color: "#6a7a8a",
                          fontSize: 10,
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        {label}
                      </label>
                      <input
                        id={`shop-field-${key}`}
                        type="text"
                        data-ocid={`shop.form.${key}_input`}
                        value={shopCustomerData[key] ?? ""}
                        onChange={(e) =>
                          setShopCustomerData((p) => ({
                            ...p,
                            [key]: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          background: "#0d0f1a",
                          border: "1px solid #8b1a1a",
                          borderRadius: 5,
                          color: "#e0e6f0",
                          fontSize: 13,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Proof of Address upload */}
                <div style={{ marginBottom: 14 }}>
                  <label
                    htmlFor="shop-proof-upload"
                    style={{
                      display: "block",
                      color: "#6a7a8a",
                      fontSize: 10,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Proof of Address (phone bill, utility bill, etc.){" "}
                    <span style={{ color: "#e74c3c" }}>— Required</span>
                  </label>
                  <label
                    htmlFor="shop-proof-upload"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "8px 12px",
                      background: "#0d0f1a",
                      border: `1px solid ${shopProofFile ? "#2ecc71" : "#8b1a1a"}`,
                      borderRadius: 5,
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>📎</span>
                    <span
                      style={{
                        color: shopProofFile ? "#2ecc71" : "#e74c3c",
                        fontSize: 12,
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {shopProofFile
                        ? shopProofFile.name
                        : "Click to upload document…"}
                    </span>
                    {shopProofFile && (
                      <span
                        style={{
                          color: "#2ecc71",
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓ Selected
                      </span>
                    )}
                  </label>
                  <input
                    id="shop-proof-upload"
                    data-ocid="shop.form.proof_upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setShopProofFile(file);
                    }}
                  />
                  {!shopProofFile && (
                    <p
                      style={{
                        color: "#6a7a8a",
                        fontSize: 10,
                        marginTop: 4,
                        marginBottom: 0,
                      }}
                    >
                      Accepted formats: PDF, JPG, PNG
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  data-ocid="shop.confirm_button"
                  onClick={async () => {
                    const required = [
                      "firstName",
                      "lastName",
                      "email",
                      "address",
                      "city",
                      "postalCode",
                      "country",
                    ];
                    if (required.some((k) => !shopCustomerData[k]?.trim())) {
                      toast.error("Please fill in all fields");
                      return;
                    }
                    if (!shopProofFile) {
                      toast.error("Please upload a proof of address document");
                      return;
                    }
                    try {
                      if (actor) {
                        // Convert proof-of-address file to base64 for submission
                        const proofBase64 = await new Promise<string>(
                          (resolve) => {
                            const reader = new FileReader();
                            reader.onload = () =>
                              resolve(
                                (reader.result as string).split(",")[1] ?? "",
                              );
                            reader.readAsDataURL(shopProofFile);
                          },
                        );
                        await (actor as Record<string, any>).initiatePurchase(
                          selectedPkg.id,
                          {
                            ...shopCustomerData,
                            proofOfAddressBase64: proofBase64,
                            proofOfAddressFileName: shopProofFile.name,
                          },
                        );
                      }
                    } catch {
                      /* silent */
                    }
                    // Open payment link if available
                    if (selectedPkg.paymentLink) {
                      window.open(selectedPkg.paymentLink, "_blank");
                    }
                    // C2: Auto-credit after 60s — timer registered in pendingTimeoutsRef
                    // so it is cancelled on unmount and never fires on stale state.
                    const autoCreditTimer = setTimeout(() => {
                      pendingTimeoutsRef.current.delete(autoCreditTimer);
                      onDokaBalanceChange(dokaBalance + selectedPkg.dokaAmount);
                      toast.success(
                        `${selectedPkg.dokaAmount.toLocaleString()} Doka credited!`,
                      );
                    }, 60000);
                    // FIX-4: Guard with cleanupRanRef so late shop timers don't fire after map cleanup
                    if (!cleanupRanRef.current) {
                      pendingTimeoutsRef.current.add(autoCreditTimer);
                    } else {
                      clearTimeout(autoCreditTimer);
                    }
                    setShowShop(false);
                    setShopStep("packages");
                    setShopProofFile(null);
                    toast.success("Purchase initiated! Payment link opened.");
                  }}
                  disabled={!shopProofFile}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    background: shopProofFile
                      ? "linear-gradient(135deg,#6a0a0a,#c0392b)"
                      : "#2a1a1a",
                    border: `1px solid ${shopProofFile ? "#c0392b" : "#5a2a2a"}`,
                    borderRadius: 8,
                    color: shopProofFile ? "#fff" : "#6a3a3a",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: shopProofFile ? "pointer" : "not-allowed",
                    marginTop: 8,
                    letterSpacing: "0.04em",
                  }}
                >
                  Confirm Purchase
                </button>
                <p
                  style={{
                    color: "#6a7a8a",
                    fontSize: 10,
                    textAlign: "center",
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}
                >
                  By confirming you are obligated to complete this payment.
                  Non-payment will result in account suspension and referral to
                  a debt collection agency until the balance is settled.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {showEnemyRegister && (
        <EnemyRegister
          isOpen={showEnemyRegister}
          onClose={() => setShowEnemyRegister(false)}
        />
      )}
      <ChallengePanel
        visible={inBattle && !!currentChallenge && !firstActionTakenRef.current}
        userId={userId ?? ""}
        currentChallenge={currentChallenge}
        accepted={challengeAccepted}
        onAccept={() => setChallengeAccepted(true)}
        onDecline={() => setCurrentChallenge(null)}
        progress={{
          turnCount: challengeTurnCountRef.current,
          totalDamage: challengeTotalDamageRef.current,
          healUsed: challengeHealUsedRef.current,
          directHit: challengeDirectHitRef.current,
          maxApUsedInTurn: challengeMaxApThisTurnRef.current,
        }}
      />
    </div>
  );
};

// O10: Wrap with error boundary so render-loop crashes show a recovery UI.
const WorldExploration = (props: WorldExplorationProps) => (
  <CanvasErrorBoundary onDebugLog={props.onDebugLog}>
    <WorldExplorationInner {...props} />
  </CanvasErrorBoundary>
);

export default WorldExploration;
