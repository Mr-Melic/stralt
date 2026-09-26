"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * PERF-2026-09-26-118: App mounts this toaster for the whole world session.
 * There is no ThemeProvider; useTheme still subscribed and hydrated a
 * "system" theme on every game mount. The carved-stone UI is dark-only.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
