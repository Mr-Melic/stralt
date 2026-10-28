"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";
import {
  TOAST_ACTION_TARGET_CLASS,
  TOAST_BELOW_HUD_CLASS,
  TOAST_OVERSCROLL_CLASS,
} from "@/utils/toastViewport";

const Toaster = ({
  className,
  toastOptions,
  style,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      {...props}
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", TOAST_BELOW_HUD_CLASS, className)}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn(TOAST_OVERSCROLL_CLASS, toastOptions?.classNames?.toast),
          actionButton: cn(
            TOAST_ACTION_TARGET_CLASS,
            toastOptions?.classNames?.actionButton,
          ),
          cancelButton: cn(
            TOAST_ACTION_TARGET_CLASS,
            toastOptions?.classNames?.cancelButton,
          ),
          closeButton: cn(
            TOAST_ACTION_TARGET_CLASS,
            toastOptions?.classNames?.closeButton,
          ),
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          ...style,
        } as CSSProperties
      }
    />
  );
};

export { Toaster };
