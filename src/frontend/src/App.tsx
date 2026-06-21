import { Toaster } from "@/components/ui/sonner";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import GameFlow from "./components/GameFlow";
import LandingPage from "./components/LandingPage";
import type { BattleRecapData } from "./components/PostBattleRecap";
import PostBattleRecap from "./components/PostBattleRecap";
import ProfileSetup from "./components/ProfileSetup";
import StarfieldBackground from "./components/StarfieldBackground";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile, useGetUserRole } from "./hooks/useQueries";

/** Current app version — bump this on every deploy to force re-login and show changelog. */
const APP_VERSION = "v163";

const CHANGELOG_ITEMS = [
  "🏆 Achievements system — 15 milestones with Doka rewards",
  "✨ Unique spell range patterns + 3 ultimate spells (Obliterate, Plague Wave, Void Collapse)",
  "🤖 Enemy AI fully rebuilt — group tactics, leader death animation, cooldown strategy",
  "💰 Doka ground loot visual trails — pick up coins scattered across maps",
];

const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

/** Blocks rendering on small screens (< 768px) */
function SmallScreenGuard() {
  const [isSmall, setIsSmall] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  if (!isSmall) return null;
  return (
    <div
      data-ocid="small_screen.overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.97)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#0d0d1a",
          border: "2px solid #8b1a1a",
          borderRadius: 12,
          padding: "32px 24px",
          maxWidth: 320,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 0 40px rgba(139,26,26,0.45)",
        }}
      >
        <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 16 }}>♔</div>
        <h2
          style={{
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 12,
            fontFamily: "serif",
            letterSpacing: "0.02em",
          }}
        >
          Best on Larger Screens
        </h2>
        <p
          style={{
            color: "#aaaaaa",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          ÆSTRALTØ is designed for desktop and tablet play. For the best
          experience, use a device with a larger screen (768px or wider).
        </p>
        <p
          style={{
            color: "rgba(150,80,80,0.75)",
            fontSize: 12,
            lineHeight: 1.5,
            borderTop: "1px solid rgba(139,26,26,0.35)",
            paddingTop: 12,
          }}
        >
          Tablets (768px+) and desktops are fully supported.
        </p>
      </div>
    </div>
  );
}

/** Changelog popup — shown once after each update when the player re-logs in */
function ChangelogPopup({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      data-ocid="changelog.overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(2px)",
        pointerEvents: "all",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg,#0d0f1a 0%,#0a0c14 100%)",
          border: "2px solid #8b1a1a",
          borderRadius: 12,
          padding: "28px 28px 22px",
          maxWidth: 400,
          width: "calc(100% - 40px)",
          boxShadow: "0 0 60px rgba(139,26,26,0.5), 0 0 20px rgba(0,0,0,0.8)",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 26 }}>🧛</span>
          <h2
            style={{
              color: "#e74c3c",
              fontWeight: 800,
              fontSize: 18,
              fontFamily: "serif",
              letterSpacing: "0.03em",
              margin: 0,
            }}
          >
            What changed in {APP_VERSION}
          </h2>
        </div>
        <p
          style={{
            color: "rgba(200,200,200,0.55)",
            fontSize: 11,
            marginBottom: 16,
            marginTop: 4,
          }}
        >
          Game updated — please review before playing.
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {CHANGELOG_ITEMS.map((item) => (
            <li
              key={item}
              style={{
                background: "rgba(139,26,26,0.12)",
                border: "1px solid rgba(139,26,26,0.3)",
                borderRadius: 6,
                padding: "7px 12px",
                color: "#ddd",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        <button
          type="button"
          data-ocid="changelog.dismiss_button"
          onClick={onDismiss}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: 7,
            border: "1px solid #c0392b",
            background: "linear-gradient(135deg,#6a0a0a,#c0392b)",
            color: "#ffeef0",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            boxShadow: "0 0 14px rgba(192,57,43,0.4)",
          }}
        >
          Got it — let me play!
        </button>
      </div>
    </div>
  );
}

function App() {
  const { identity } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: _profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const { data: userRole } = useGetUserRole();
  const isAdmin = userRole === "admin";

  const isAuthenticated = !!identity;

  // Version-based forced re-login + changelog
  const [showChangelog, setShowChangelog] = useState(false);
  useEffect(() => {
    const storedVersion = localStorage.getItem("pbv_app_version");
    if (storedVersion !== APP_VERSION) {
      // New version detected — clear auth-related keys and force re-login
      const keysToKeep = ["pbv_tier_spawn_config", "pbv_levelup_config"];
      const savedValues: Record<string, string | null> = {};
      for (const key of keysToKeep) {
        savedValues[key] = localStorage.getItem(key);
      }
      localStorage.clear();
      for (const key of keysToKeep) {
        if (savedValues[key] !== null)
          localStorage.setItem(key, savedValues[key]!);
      }
      localStorage.setItem("pbv_app_version", APP_VERSION);
      localStorage.setItem("pbv_show_changelog", "true");
      // Reload to start fresh from login screen
      window.location.reload();
      return;
    }
  }, []);

  // Show changelog popup once after the first login following an update
  useEffect(() => {
    if (
      isAuthenticated &&
      localStorage.getItem("pbv_show_changelog") === "true"
    ) {
      setShowChangelog(true);
    }
  }, [isAuthenticated]);

  const handleDismissChangelog = () => {
    setShowChangelog(false);
    localStorage.setItem("pbv_show_changelog", "false");
  };

  // Small screen guard state
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.innerWidth < 768,
  );
  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Admin dashboard state
  const [showAdmin, setShowAdmin] = useState(false);

  // Root-level battle summary popup state — survives battle→exploration transition
  const [battleSummary, setBattleSummary] = useState<BattleRecapData | null>(
    null,
  );

  // Timeout fallback: if still loading 8s after auth, treat as "no profile" and show ProfileSetup.
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isFetched) {
      timerRef.current = setTimeout(() => setLoadingTimedOut(true), 8000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (isFetched) setLoadingTimedOut(false);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isAuthenticated, isFetched]);

  const profileResolved = isFetched || loadingTimedOut;
  const isStillLoading = isAuthenticated && !profileResolved;
  const showProfileSetup = isAuthenticated && profileResolved && !userProfile;
  const showGame = isAuthenticated && profileResolved && !!userProfile;

  // If small screen: show warning only, don't load the game at all
  if (isSmallScreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0d0f1a",
          overflow: "hidden",
        }}
      >
        <StarfieldBackground />
        <SmallScreenGuard />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0d0f1a",
        overflow: "hidden",
      }}
    >
      {/* Starfield: single root-level layer at z:1, behind all content */}
      <StarfieldBackground />

      {/* Content layer: z:20 — always above starfield */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20,
          overflow: "visible",
        }}
      >
        {/* Landing page — not authenticated */}
        {!isAuthenticated && (
          <LandingPage onAdminLogin={() => setShowAdmin(true)} />
        )}

        {/* Admin dashboard — triggered from LandingPage hidden login or Admin button */}
        {showAdmin && (
          <Suspense fallback={null}>
            <AdminDashboard
              onBack={() => setShowAdmin(false)}
              isAdmin={isAdmin}
            />
          </Suspense>
        )}

        {/* Brief loading state */}
        {isStillLoading && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "transparent",
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                className="animate-spin"
                style={{
                  width: 64,
                  height: 64,
                  border: "3px solid #c0392b",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                }}
              />
              <p
                style={{
                  color: "#c0ccd8",
                  fontFamily: "serif",
                  letterSpacing: "0.05em",
                }}
              >
                Loading...
              </p>
            </div>
          </div>
        )}

        {/* Profile setup */}
        {showProfileSetup && <ProfileSetup />}

        {/* Main game flow */}
        {showGame && userProfile && (
          <>
            <GameFlow
              userProfile={userProfile}
              isAdmin={isAdmin}
              onOpenAdmin={() => setShowAdmin(true)}
              onShowBattleSummary={setBattleSummary}
            />
            <Toaster />

            {/* Root-level post-battle summary popup — always mounted above everything */}
            {battleSummary && (
              <div
                data-ocid="battle_summary.overlay"
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9999,
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ pointerEvents: "auto" }}>
                  <PostBattleRecap
                    data={battleSummary}
                    onClose={() => {
                      console.log("BattleSummary DISMISSED");
                      setBattleSummary(null);
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Changelog popup — shown once per update after login */}
      {showChangelog && <ChangelogPopup onDismiss={handleDismissChangelog} />}
    </div>
  );
}

export default App;
