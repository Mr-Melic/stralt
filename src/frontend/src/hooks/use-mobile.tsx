import { useEffect, useState } from "react";
import {
  DEFAULT_MOBILE_BREAKPOINT_PX,
  isMobileViewport,
  shouldCommitIsMobile,
} from "../engine/viewportActivity";

/** Pixel value of the notch / status-bar inset. 0 when env() is unavailable. */
export function readSafeAreaInsetTopPx(): number {
  if (typeof document === "undefined") return 0;
  const probe = document.createElement("div");
  probe.style.paddingTop = "env(safe-area-inset-top, 0px)";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const px = Number.parseFloat(getComputedStyle(probe).paddingTop);
  probe.remove();
  return Number.isFinite(px) ? px : 0;
}

function readWindowIsMobile(breakpoint: number): boolean {
  if (typeof window === "undefined") return false;
  return isMobileViewport(window.innerWidth, breakpoint);
}

export function useIsMobile(
  breakpoint = DEFAULT_MOBILE_BREAKPOINT_PX,
): boolean {
  // PERF-2026-09-23-094: seed from the real width so mobile does not pay a
  // false→true WorldExploration render on mount. Resize (URL-bar chrome)
  // only commits when the boolean actually flips.
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    readWindowIsMobile(breakpoint),
  );
  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setIsMobile((prev) =>
        shouldCommitIsMobile(prev, width, breakpoint)
          ? isMobileViewport(width, breakpoint)
          : prev,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
}
